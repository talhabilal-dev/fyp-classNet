import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
const STUDENT_KEY = "classnet_student_session";
export function useStudentSession() {
    const socket = getSocket();
    const [studentData, setStudentData] = useState(null);
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [handRaised, setHandRaised] = useState(false);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [teacherReconnecting, setTeacherReconnecting] = useState(false);
    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            // Try to rejoin saved student session
            const saved = sessionStorage.getItem(STUDENT_KEY);
            if (saved) {
                try {
                    const savedStudent = JSON.parse(saved);
                    setIsLoading(true);
                    // Rejoin using saved data
                    socket.emit("student:join", {
                        sessionCode: savedStudent.sessionCode,
                        name: savedStudent.name,
                        rollNumber: savedStudent.rollNumber,
                    });
                }
                catch {
                    sessionStorage.removeItem(STUDENT_KEY);
                }
            }
        });
        socket.on("student:joined", (data) => {
            setStudentData(data);
            setIsLoading(false);
            setError(null);
            setSessionEnded(false);
            socket.emit("attendance:mark", {
                sessionId: data.sessionId,
                studentId: data.studentId,
                studentName: data.name,
                rollNumber: data.rollNumber,
            });
            socket.emit("files:get-all", { sessionId: data.sessionId });
            // Check if teacher is already streaming
            socket.emit("stream:check", { sessionId: data.sessionId });
        });
        socket.on("student:join-error", ({ message }) => {
            setError(message);
            setIsLoading(false);
            // Clear saved session if it's invalid
            sessionStorage.removeItem(STUDENT_KEY);
        });
        socket.on("attendance:confirmed", ({ status }) => {
            setAttendanceStatus(status);
        });
        socket.on("hand:raised", () => setHandRaised(true));
        socket.on("hand:lowered", () => setHandRaised(false));
        socket.on("hand:dismissed-by-teacher", () => setHandRaised(false));
        socket.on("files:list", ({ files }) => {
            setFiles(files);
        });
        socket.on("file:shared", (file) => {
            setFiles((prev) => [...prev, file]);
        });
        socket.on("file:deleted", ({ fileId }) => {
            setFiles((prev) => prev.filter((f) => f.fileId !== fileId));
        });
        // Teacher temporarily disconnected — show warning
        socket.on("session:teacher-disconnected", () => {
            setTeacherReconnecting(true);
        });
        socket.on("session:ended", () => {
            setSessionEnded(true);
            setStudentData(null);
            sessionStorage.removeItem(STUDENT_KEY);
        });
        return () => {
            socket.off("connect");
            socket.off("student:joined");
            socket.off("student:join-error");
            socket.off("attendance:confirmed");
            socket.off("hand:raised");
            socket.off("hand:lowered");
            socket.off("hand:dismissed-by-teacher");
            socket.off("files:list");
            socket.off("file:shared");
            socket.off("file:deleted");
            socket.off("session:teacher-disconnected");
            socket.off("session:ended");
        };
    }, []);
    const joinSession = (sessionCode, name, rollNumber) => {
        setIsLoading(true);
        setError(null);
        socket.emit("student:join", { sessionCode, name, rollNumber });
    };
    const raiseHand = () => {
        if (!studentData)
            return;
        socket.emit("hand:raise", {
            sessionId: studentData.sessionId,
            studentId: studentData.studentId,
            studentName: studentData.name,
        });
    };
    const lowerHand = () => {
        if (!studentData)
            return;
        socket.emit("hand:lower", {
            sessionId: studentData.sessionId,
            studentId: studentData.studentId,
        });
    };
    return {
        studentData,
        attendanceStatus,
        handRaised,
        files,
        error,
        isLoading,
        sessionEnded,
        teacherReconnecting,
        joinSession,
        raiseHand,
        lowerHand,
    };
}
