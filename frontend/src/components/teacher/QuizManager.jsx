import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useTeacherQuiz } from "../../hooks/useTeacherQuiz";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
export function QuizManager({ sessionId, students }) {
    const { quizId, quizTitle, results, totalSubmitted, isCreating, quizActive, showResults, createCsvQuiz, launchQuiz, endQuiz, resetQuiz, } = useTeacherQuiz(sessionId);
    const [mode, setMode] = useState("select");
    const [oralTitle, setOralTitle] = useState("");
    const [oralTotalMarks, setOralTotalMarks] = useState(10);
    const [csvTitle, setCsvTitle] = useState("");
    const [csvFile, setCsvFile] = useState(null);
    // Oral grading state
    const [oralQuizId, setOralQuizId] = useState(null);
    const [oralQuizTitle, setOralQuizTitle] = useState("");
    const [grades, setGrades] = useState({});
    const [savedGrades, setSavedGrades] = useState({});
const [oralResults, setOralResults] = useState([]);
const [showOralResults, setShowOralResults] = useState(false);
const handleCreateOral = async () => {
    if (!oralTitle.trim())
        return;
    const res = await fetch(`${BACKEND_URL}/api/quiz/${sessionId}/oral`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: oralTitle, totalQuestions: oralTotalMarks }),
    });
    const data = await res.json();
    setOralQuizId(data.quiz.id);
    setOralQuizTitle(data.quiz.title);
};
const handleGradeStudent = async (student) => {
    if (!oralQuizId)
        return;
    const grade = grades[student.id];
    if (!grade?.marks)
        return;
    await fetch(`${BACKEND_URL}/api/quiz/${oralQuizId}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sessionId,
            studentId: student.id,
            studentName: student.name,
            rollNumber: student.rollNumber,
            marksObtained: Number(grade.marks),
            totalMarks: oralTotalMarks,
            remarks: grade.remarks ?? "",
        }),
    });
    setSavedGrades((prev) => ({ ...prev, [student.id]: true }));
};
const handleViewOralResults = async () => {
    if (!oralQuizId)
        return;
    const res = await fetch(`${BACKEND_URL}/api/quiz/${oralQuizId}/oral-results`);
    const data = await res.json();
    setOralResults(data.results);
    setShowOralResults(true);
};
const resetOral = () => {
    setOralQuizId(null);
    setOralQuizTitle("");
    setGrades({});
    setSavedGrades({});
    setOralResults([]);
    setShowOralResults(false);
    setMode("select");
};
// ── Oral Results ──
if (showOralResults) {
    return (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-white font-semibold", children: ["Oral Results \u2014 ", oralQuizTitle] }), _jsx("button", { onClick: resetOral, className: "text-zinc-400 hover:text-white text-xs bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors", children: "New Quiz" })] }), oralResults.length === 0 ? (_jsx("p", { className: "text-zinc-600 text-sm text-center py-4", children: "No grades submitted" })) : (_jsx("div", { className: "flex flex-col gap-2 max-h-80 overflow-y-auto", children: oralResults.map((r, i) => {
                    const percent = Math.round((r.marks_obtained / r.total_marks) * 100);
                    return (_jsxs("div", { className: "bg-zinc-800 rounded-lg px-4 py-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-zinc-500 text-xs", children: ["#", i + 1] }), _jsx("p", { className: "text-white text-sm font-medium", children: r.student_name }), _jsx("span", { className: "text-zinc-500 text-xs", children: r.roll_number })] }), _jsxs("span", { className: `text-sm font-bold ${percent >= 70 ? "text-emerald-400" :
                                            percent >= 40 ? "text-yellow-400" : "text-red-400"}`, children: [r.marks_obtained, "/", r.total_marks] })] }), _jsxs("div", { className: "flex items-center gap-3 mt-1", children: [_jsx("div", { className: "flex-1 bg-zinc-700 rounded-full h-1.5", children: _jsx("div", { className: `h-1.5 rounded-full ${percent >= 70 ? "bg-emerald-500" :
                                                percent >= 40 ? "bg-yellow-500" : "bg-red-500"}`, style: { width: `${percent}%` } }) }), r.remarks && (_jsx("span", { className: "text-zinc-500 text-xs shrink-0", children: r.remarks }))] })] }, r.student_id));
                }) }))] }));
}
// ── Oral Grading Sheet ──
if (oralQuizId) {
    const gradedCount = Object.keys(savedGrades).length;
    return (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-white font-semibold", children: oralQuizTitle }), _jsxs("p", { className: "text-zinc-500 text-xs mt-0.5", children: [gradedCount, "/", students.length, " graded \u00B7 Total marks: ", oralTotalMarks] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleViewOralResults, className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors", children: "View Results" }), _jsx("button", { onClick: resetOral, className: "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs px-3 py-1.5 rounded-lg transition-colors", children: "Cancel" })] })] }), students.length === 0 ? (_jsx("p", { className: "text-zinc-600 text-sm text-center py-4", children: "No students in session yet" })) : (_jsx("div", { className: "flex flex-col gap-3 max-h-96 overflow-y-auto", children: students.map((student) => {
                    const isSaved = savedGrades[student.id];
                    return (_jsxs("div", { className: `rounded-xl p-4 flex flex-col gap-3 border ${isSaved ? "bg-emerald-500/5 border-emerald-500/20" : "bg-zinc-800 border-transparent"}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-white text-sm font-medium", children: student.name }), _jsx("p", { className: "text-zinc-500 text-xs", children: student.rollNumber })] }), isSaved && (_jsx("span", { className: "text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full", children: "\u2713 Saved" }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("label", { className: "text-zinc-500 text-xs", children: ["Marks / ", oralTotalMarks] }), _jsx("input", { type: "number", min: 0, max: oralTotalMarks, value: grades[student.id]?.marks ?? "", onChange: (e) => setGrades((prev) => ({
                                                    ...prev,
                                                    [student.id]: { ...prev[student.id], marks: e.target.value },
                                                })), placeholder: "0", className: "w-20 bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors" })] }), _jsxs("div", { className: "flex flex-col gap-1 flex-1", children: [_jsx("label", { className: "text-zinc-500 text-xs", children: "Remarks (optional)" }), _jsx("input", { type: "text", value: grades[student.id]?.remarks ?? "", onChange: (e) => setGrades((prev) => ({
                                                    ...prev,
                                                    [student.id]: { ...prev[student.id], remarks: e.target.value },
                                                })), placeholder: "e.g. Good explanation", className: "bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors" })] }), _jsxs("div", { className: "flex flex-col gap-1 justify-end", children: [_jsx("label", { className: "text-zinc-500 text-xs opacity-0", children: "." }), _jsx("button", { onClick: () => handleGradeStudent(student), disabled: !grades[student.id]?.marks, className: "bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm px-3 py-2 rounded-lg transition-colors", children: "Save" })] })] })] }, student.id));
                }) }))] }));
}
// ── CSV Results ──
if (showResults) {
    return (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-white font-semibold", children: ["Results \u2014 ", quizTitle] }), _jsx("button", { onClick: resetQuiz, className: "text-zinc-400 hover:text-white text-xs bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors", children: "New Quiz" })] }), results.length === 0 ? (_jsx("p", { className: "text-zinc-600 text-sm text-center py-4", children: "No students answered" })) : (_jsx("div", { className: "flex flex-col gap-2 max-h-80 overflow-y-auto", children: results.map((r, i) => (_jsxs("div", { className: "bg-zinc-800 rounded-lg px-4 py-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-zinc-500 text-xs", children: ["#", i + 1] }), _jsx("p", { className: "text-white text-sm font-medium", children: r.studentName }), _jsx("span", { className: "text-zinc-500 text-xs", children: r.rollNumber })] }), _jsxs("span", { className: `text-sm font-bold ${r.scorePercent >= 70 ? "text-emerald-400" :
                                        r.scorePercent >= 40 ? "text-yellow-400" : "text-red-400"}`, children: [r.scorePercent, "%"] })] }), _jsxs("div", { className: "flex items-center gap-3 mt-1", children: [_jsx("div", { className: "flex-1 bg-zinc-700 rounded-full h-1.5", children: _jsx("div", { className: `h-1.5 rounded-full ${r.scorePercent >= 70 ? "bg-emerald-500" :
                                            r.scorePercent >= 40 ? "bg-yellow-500" : "bg-red-500"}`, style: { width: `${r.scorePercent}%` } }) }), _jsxs("span", { className: "text-zinc-500 text-xs shrink-0", children: [r.totalCorrect, "/", r.totalAnswered, " correct"] })] })] }, r.studentId))) }))] }));
}
// ── CSV Quiz Active ──
if (quizActive) {
    return (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-white font-semibold", children: quizTitle }), _jsx("p", { className: "text-zinc-500 text-xs mt-0.5", children: "Quiz in progress" })] }), _jsx("button", { onClick: endQuiz, className: "bg-red-600/20 hover:bg-red-600 border border-red-600/40 text-red-400 hover:text-white text-sm px-4 py-2 rounded-lg transition-all", children: "End Quiz" })] }), _jsxs("div", { className: "bg-zinc-800 rounded-xl p-4 flex flex-col gap-2", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-zinc-400", children: "Students submitted" }), _jsxs("span", { className: "text-white font-semibold", children: [totalSubmitted, " / ", students.length] })] }), _jsx("div", { className: "w-full bg-zinc-700 rounded-full h-2", children: _jsx("div", { className: "bg-emerald-500 h-2 rounded-full transition-all", style: { width: students.length > 0 ? `${(totalSubmitted / students.length) * 100}%` : "0%" } }) })] })] }));
}
// ── CSV Quiz Ready to Launch ──
if (quizId) {
    return (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4", children: [_jsx("h2", { className: "text-white font-semibold", children: "Quiz Ready" }), _jsxs("div", { className: "bg-zinc-800 rounded-xl p-4 text-center", children: [_jsx("p", { className: "text-zinc-400 text-sm mb-1", children: "Quiz title" }), _jsx("p", { className: "text-white font-semibold", children: quizTitle })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: resetQuiz, className: "flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-xl text-sm transition-colors", children: "Cancel" }), _jsx("button", { onClick: launchQuiz, className: "flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors", children: "Launch Quiz" })] })] }));
}
// ── Mode Select ──
if (mode === "select") {
    return (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4", children: [_jsx("h2", { className: "text-white font-semibold", children: "Quiz" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { onClick: () => setMode("oral"), className: "bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 text-left transition-colors", children: [_jsx("p", { className: "text-2xl mb-2", children: "\uD83C\uDFA4" }), _jsx("p", { className: "text-white text-sm font-medium", children: "Oral Quiz" }), _jsx("p", { className: "text-zinc-500 text-xs mt-1", children: "Grade students manually" })] }), _jsxs("button", { onClick: () => setMode("csv"), className: "bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 text-left transition-colors", children: [_jsx("p", { className: "text-2xl mb-2", children: "\uD83D\uDCCB" }), _jsx("p", { className: "text-white text-sm font-medium", children: "CSV Quiz" }), _jsx("p", { className: "text-zinc-500 text-xs mt-1", children: "Upload MCQ file with answers" })] })] })] }));
}
// ── Oral Form ──
if (mode === "oral") {
    return (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => setMode("select"), className: "text-zinc-500 hover:text-white transition-colors", children: "\u2190" }), _jsx("h2", { className: "text-white font-semibold", children: "Oral Quiz" })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-zinc-400 text-sm", children: "Quiz Title" }), _jsx("input", { type: "text", value: oralTitle, onChange: (e) => setOralTitle(e.target.value), placeholder: "e.g. Chapter 3 Oral", className: "bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors" })] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-zinc-400 text-sm", children: "Total Marks" }), _jsx("input", { type: "number", value: oralTotalMarks, onChange: (e) => setOralTotalMarks(parseInt(e.target.value)), min: 1, max: 100, className: "bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors" })] })] }), _jsx("button", { onClick: handleCreateOral, disabled: !oralTitle.trim(), className: "w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors", children: "Start Grading" })] }));
}
// ── CSV Form ──
return (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => setMode("select"), className: "text-zinc-500 hover:text-white transition-colors", children: "\u2190" }), _jsx("h2", { className: "text-white font-semibold", children: "CSV Quiz" })] }), _jsxs("div", { className: "bg-zinc-800 rounded-lg p-3 text-xs text-zinc-400", children: [_jsx("p", { className: "font-medium text-zinc-300 mb-1", children: "CSV Format:" }), _jsx("p", { children: "question,option_a,option_b,option_c,option_d,correct" }), _jsx("p", { children: "What is 2+2?,1,2,4,8,C" })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-zinc-400 text-sm", children: "Quiz Title" }), _jsx("input", { type: "text", value: csvTitle, onChange: (e) => setCsvTitle(e.target.value), placeholder: "e.g. Midterm Quiz", className: "bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors" })] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-zinc-400 text-sm", children: "CSV File" }), _jsxs("label", { className: "cursor-pointer bg-zinc-800 border border-zinc-700 hover:border-zinc-500 rounded-lg px-4 py-3 text-sm text-zinc-400 transition-colors text-center", children: [csvFile ? csvFile.name : "Click to select CSV file", _jsx("input", { type: "file", accept: ".csv", className: "hidden", onChange: (e) => setCsvFile(e.target.files?.[0] ?? null) })] })] })] }), _jsx("button", { onClick: () => csvFile && createCsvQuiz(csvTitle, csvFile), disabled: isCreating || !csvTitle.trim() || !csvFile, className: "w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors", children: isCreating ? "Creating..." : "Create Quiz" })] }));
}

