import React, { useState, useEffect } from "react";
import { useTeacherSession } from "../hooks/useTeacherSession";
import { useTeacherQuiz } from "../hooks/useTeacherQuiz";
import { FileUpload } from "../components/teacher/FileUpload";
import { QuizManager } from "../components/teacher/QuizManager";
import { Whiteboard } from "../components/teacher/Whiteboard";
import { useStream } from "../hooks/useStream";
import { exportAttendanceCsv } from "../lib/exportCsv";
import { useNavigate } from "react-router-dom";
import { TeacherDashboard } from "../components/teacher/TeacherDashboard";
import CommonLayout from "../components/common/CommonLayout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export function TeacherPage() {
    const navigate = useNavigate();
    const { session, students, raisedHands, isConnected, isLoading, isRejoining, createSession, endSession, dismissHand, } = useTeacherSession();
    const { isStreaming, streamMode, startScreenShare, startWhiteboard, stopCapture, switchMode, postWhiteboardFrame, } = useStream(session?.sessionId);
    const quizState = useTeacherQuiz(session?.sessionId);
    const [attendance, setAttendance] = useState([]);
    const [activePanel, setActivePanel] = useState("dashboard");
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (!session) return;
        fetch(`${BACKEND_URL}/api/attendance/${session.sessionId}`).then((r) => r.json()).then((d) => setAttendance(d.records ?? []));
    }, [students, session]);

    useEffect(() => {
        if (!session) return;
        fetch(`${BACKEND_URL}/api/files/${session.sessionId}`).then((r) => r.json()).then((d) => setFiles(d.files ?? []));
    }, [session?.sessionId]);

    useEffect(() => {
        if (!session) {
            setFiles([]);
            setAttendance([]);
            setActivePanel("students");
        }
    }, [session]);

    const onlineCount = students.filter((s) => s.isOnline).length;
    const presentCount = attendance.filter((a) => a.status === "present").length;
    const lateCount = attendance.filter((a) => a.status === "late").length;

    if (!isConnected || isRejoining) {
        return (
            <CommonLayout role="Teacher">
                <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin" />
                        <p className="text-zinc-500 text-sm">{isRejoining ? "Rejoining session..." : "Connecting to server..."}</p>
                    </div>
                </div>
            </CommonLayout>
        );
    }

    if (!session) {
        return (
            <CommonLayout role="Teacher">
                <div className="min-h-[40vh] bg-surface border border-surface-2 rounded-2xl p-8 max-w-sm mx-auto flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-black/30">
                            <span className="text-3xl">🎓</span>
                        </div>
                        <div className="text-center">
                            <h1 className="text-white text-2xl font-bold tracking-tight">ClassNet</h1>
                            <p className="text-muted text-sm mt-1">Offline LAN Classroom</p>
                        </div>
                    </div>
                    <div className="w-full h-px bg-surface-2" />
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-400">Server connected</span>
                    </div>
                    <button onClick={createSession} disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/30">
                        {isLoading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Starting...</span> : "Start Class"}
                    </button>
                    <button onClick={() => navigate("/reports")} className="w-full bg-surface hover:bg-surface-2 border border-surface-2 text-muted hover:text-white text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                        <span>📊</span> View Past Reports
                    </button>
                </div>
            </CommonLayout>
        );
    }

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "students", label: "Students", icon: "👥", badge: onlineCount },
        { id: "attendance", label: "Attendance", icon: "✅", badge: attendance.length },
        { id: "files", label: "Files", icon: "📁", badge: files.length },
        { id: "quiz", label: "Quiz", icon: "📝" },
        { id: "screen", label: "Screen Share", icon: "🖥️" },
    ];

    const sidebar = (
        <div className="flex flex-col h-full">
            <nav className="flex-1 flex flex-col gap-1">
                <p className="text-muted text-xs font-semibold uppercase tracking-wider px-2 py-1 mb-2">Tools</p>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActivePanel(item.id)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activePanel === item.id
                            ? "bg-brand/20 text-brand border border-brand/30"
                            : "text-muted hover:text-white hover:bg-surface-2"
                            }`}
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activePanel === item.id ? "bg-brand/30 text-brand" : "bg-surface-2 text-muted"}`}>
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );

    const headerActions = (
        <div className="flex items-center gap-3">
            {session && (
                <div className="rounded-lg border border-surface-2 bg-surface-3/60 px-3 py-1.5 text-xs text-muted">
                    {isStreaming ? `Streaming ${streamMode}` : "Stream idle"}
                </div>
            )}
            <button
                onClick={() => navigate("/reports")}
                className="text-muted hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-all"
            >
                📊 Reports
            </button>
            <button
                onClick={endSession}
                className="bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white text-sm px-4 py-1.5 rounded-lg transition-all font-medium"
            >
                End Class
            </button>
        </div>
    );

    return (
        <CommonLayout role="Teacher" sidebar={sidebar} headerActions={headerActions}>
            <div className="flex flex-col gap-5">
                {/* Dashboard Panel */}
                {activePanel === "dashboard" && (
                    <TeacherDashboard
                        session={session}
                        students={students}
                        attendance={attendance}
                        files={files}
                        raisedHands={raisedHands}
                        onDismissHand={dismissHand}
                    />
                )}

                {/* Students Panel */}
                {activePanel === "students" && (
                    <div className="bg-surface border border-surface-2 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-surface-2">
                            <h2 className="text-white font-semibold">Students</h2>
                            <p className="text-muted text-xs mt-0.5">
                                {onlineCount} online · {students.length} total
                            </p>
                        </div>
                        {students.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <span className="text-4xl">👥</span>
                                <p className="text-zinc-500 text-sm">Waiting for students to join...</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-800">
                                {students.map((s) => (
                                    <div
                                        key={s.id}
                                        className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-2 h-2 rounded-full shrink-0 ${s.isOnline ? "bg-emerald-500" : "bg-zinc-600"
                                                    }`}
                                            ></div>
                                            <div>
                                                <p className="text-white text-sm font-medium">{s.name}</p>
                                                <p className="text-zinc-500 text-xs">{s.rollNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {raisedHands.find((h) => h.studentId === s.id) && (
                                                <span className="text-sm animate-bounce">✋</span>
                                            )}
                                            <span
                                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.isOnline
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-zinc-800 text-zinc-500"
                                                    }`}
                                            >
                                                {s.isOnline ? "Online" : "Offline"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Attendance Panel */}
                {activePanel === "attendance" && (
                    <div className="bg-surface border border-surface-2 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-surface-2 flex items-center justify-between">
                            <div>
                                <h2 className="text-white font-semibold">Attendance</h2>
                                <p className="text-muted text-xs mt-0.5">
                                    {presentCount} present · {lateCount} late · {attendance.length} total
                                </p>
                            </div>
                            {attendance.length > 0 && (
                                <button
                                    onClick={() => exportAttendanceCsv(session.sessionCode, attendance)}
                                    className="bg-surface-2 hover:bg-surface text-muted text-xs px-3 py-2 rounded-lg"
                                >
                                    ↓ Export CSV
                                </button>
                            )}
                        </div>
                        {attendance.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <span className="text-4xl">✅</span>
                                <p className="text-zinc-500 text-sm">No attendance records yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-800">
                                {attendance.map((a, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <div>
                                            <p className="text-white text-sm font-medium">{a.student_name}</p>
                                            <p className="text-zinc-500 text-xs">{a.roll_number}</p>
                                        </div>
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.status === "present"
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : a.status === "late"
                                                    ? "bg-yellow-500/10 text-yellow-400"
                                                    : "bg-red-500/10 text-red-400"
                                                }`}
                                        >
                                            {a.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Files Panel */}
                {activePanel === "files" && (
                    <FileUpload
                        sessionId={session.sessionId}
                        files={files}
                        onFileUploaded={(file) => setFiles((prev) => [...prev, file])}
                        onFileDeleted={(fileId) => setFiles((prev) => prev.filter((f) => f.fileId !== fileId))}
                    />
                )}

                {/* Quiz Panel */}
                {activePanel === "quiz" && (
                    <QuizManager
                        sessionId={session.sessionId}
                        students={students}
                        quizState={quizState}
                    />
                )}

                {/* Screen Share Panel */}
                {activePanel === "screen" && (
                    <div className="flex flex-col gap-4">
                        <div className="bg-surface border border-surface-2 rounded-xl p-4 flex items-center gap-3">
                            <p className="text-muted text-sm mr-2">Mode:</p>
                            <button
                                onClick={() => switchMode("screen")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isStreaming && streamMode === "screen"
                                    ? "bg-blue-600 text-white"
                                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                    }`}
                            >
                                🖥️ Screen Share
                            </button>
                            <button
                                onClick={() => switchMode("whiteboard")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isStreaming && streamMode === "whiteboard"
                                    ? "bg-brand text-white"
                                    : "bg-surface-2 hover:bg-surface text-muted"
                                    }`}
                            >
                                🎨 Whiteboard
                            </button>
                            {isStreaming && (
                                <button
                                    onClick={stopCapture}
                                    className="ml-auto bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-sm px-4 py-2 rounded-lg transition-all"
                                >
                                    Stop Streaming
                                </button>
                            )}
                        </div>
                        {streamMode === "whiteboard" && isStreaming && (
                            <Whiteboard onFrame={postWhiteboardFrame} isStreaming={isStreaming} />
                        )}
                        {streamMode === "screen" && isStreaming && (
                            <div className="bg-surface border border-surface-2 rounded-xl p-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <p className="text-white font-medium">Screen sharing is live</p>
                                </div>
                                <p className="text-muted text-sm">Students can see your screen</p>
                            </div>
                        )}
                        {!isStreaming && (
                            <div className="bg-surface border border-surface-2 rounded-xl p-6 flex flex-col gap-4">
                                <p className="text-muted text-sm text-center">
                                    Choose a mode above to start streaming to students
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-surface-2 rounded-xl p-4 text-center">
                                        <span className="text-3xl">🖥️</span>
                                        <p className="text-white text-sm font-medium mt-2">Screen Share</p>
                                        <p className="text-muted text-xs mt-1">
                                            Share your entire screen or a window
                                        </p>
                                    </div>
                                    <div className="bg-surface-2 rounded-xl p-4 text-center">
                                        <span className="text-3xl">🎨</span>
                                        <p className="text-white text-sm font-medium mt-2">Whiteboard</p>
                                        <p className="text-muted text-xs mt-1">
                                            Draw and write for students
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </CommonLayout>
    );
}
