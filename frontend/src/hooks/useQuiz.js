import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
export function useQuiz(studentData) {
    const socket = getSocket();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [quizEnded, setQuizEnded] = useState(false);
    useEffect(() => {
        socket.on("quiz:started", ({ quiz, questions }) => {
            setQuiz(quiz);
            setQuestions(questions);
            setAnswers({});
            setQuizEnded(false);
        });
        socket.on("quiz:ended", () => setQuizEnded(true));
        socket.on("quiz:none", () => {
            setQuiz(null);
            setQuestions([]);
        });
        return () => {
            socket.off("quiz:started");
            socket.off("quiz:ended");
            socket.off("quiz:none");
        };
    }, []);
    // Check for active quiz on join
    useEffect(() => {
        if (!studentData)
            return;
        socket.emit("quiz:get-active", { sessionId: studentData.sessionId });
    }, [studentData]);
    const submitAnswer = (questionId, selectedOption) => {
        if (!studentData || !quiz)
            return;
        setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
        socket.emit("quiz:submit-answer", {
            quizId: quiz.id,
            questionId,
            studentId: studentData.studentId,
            studentName: studentData.name,
            rollNumber: studentData.rollNumber,
            selectedOption,
        });
    };
    return { quiz, questions, answers, quizEnded, submitAnswer };
}
