import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
function formatDate(dt) {
    return new Date(dt.replace(" ", "T") + "Z").toLocaleString();
}
function formatSeconds(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0)
        return `${h}h ${m}m ${s}s`;
    if (m > 0)
        return `${m}m ${s}s`;
    return `${s}s`;
}
function eventIcon(type) {
    if (type === "session_started")
        return "🟢";
    if (type === "session_ended")
        return "🔴";
    if (type === "student_joined")
        return "➕";
    if (type === "student_disconnected")
        return "➖";
    return "•";
}
function ScoreBar({ percent }) {
    return (_jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [_jsx("div", { className: "flex-1 bg-zinc-700 rounded-full h-1.5", children: _jsx("div", { className: `h-1.5 rounded-full transition-all ${percent >= 70 ? "bg-emerald-500" :
                        percent >= 40 ? "bg-yellow-500" : "bg-red-500"}`, style: { width: `${percent}%` } }) }), _jsxs("span", { className: `text-xs font-semibold w-10 text-right shrink-0 ${percent >= 70 ? "text-emerald-400" :
                    percent >= 40 ? "text-yellow-400" : "text-red-400"}`, children: [percent, "%"] })] }));
}
export function ReportsPage() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [summary, setSummary] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("attendance");
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    useEffect(() => {
        fetch(`${BACKEND_URL}/api/logs/sessions`)
            .then((r) => r.json())
            .then((d) => setSessions(d.sessions ?? []));
    }, []);
    const loadReport = async (session) => {
        setSelectedSession(session);
        setLoading(true);
        setSummary(null);
        setLogs([]);
        setSelectedQuiz(null);
        setActiveTab("attendance");
        const [summaryRes, logsRes] = await Promise.all([
            fetch(`${BACKEND_URL}/api/logs/${session.id}/summary`),
            fetch(`${BACKEND_URL}/api/logs/${session.id}`),
        ]);
        setSummary(await summaryRes.json());
        setLogs((await logsRes.json()).logs ?? []);
        setLoading(false);
    };
    const exportCsv = (filename, headers, rows) => {
        const csv = [headers, ...rows]
            .map((r) => r.map((c) => `"${c}"`).join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };
    const exportAttendance = () => {
        if (!summary || !selectedSession)
            return;
        exportCsv(`attendance-${selectedSession.code}.csv`, ["Roll Number", "Name", "Status", "Joined At", "Left At", "Online Time", "Reconnects"], summary.students.map((s) => [
            s.roll_number, s.student_name, s.status,
            s.joined_at ? formatDate(s.joined_at) : "-",
            s.left_at ? formatDate(s.left_at) : "Still Online",
            formatSeconds(Number(s.total_online_seconds)),
            s.reconnect_count,
        ]));
    };
    const exportQuiz = (quiz) => {
        if (!selectedSession)
            return;
        if (quiz.mode === "csv") {
            exportCsv(`quiz-${quiz.title}-${selectedSession.code}.csv`, ["Roll Number", "Name", "Correct", "Total", "Score %"], quiz.results.map((r) => [
                r.rollNumber, r.studentName, r.totalCorrect, r.totalQuestions, `${r.scorePercent}%`,
            ]));
        }
        else {
            exportCsv(`oral-${quiz.title}-${selectedSession.code}.csv`, ["Roll Number", "Name", "Marks", "Total Marks", "Score %", "Remarks"], quiz.results.map((r) => [
                r.rollNumber, r.studentName, r.marksObtained, r.totalMarks, `${r.scorePercent}%`, r.remarks ?? "",
            ]));
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-zinc-950 flex flex-col", children: [_jsxs("header", { className: "bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between shrink-0", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-sm", children: "\uD83C\uDF93" }) }), _jsx("span", { className: "text-white font-bold tracking-tight", children: "ClassNet" }), _jsx("span", { className: "text-zinc-600 text-sm", children: "/" }), _jsx("span", { className: "text-zinc-400 text-sm", children: "Reports" })] }), _jsx("button", { onClick: () => navigate("/"), className: "flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm px-4 py-2 rounded-lg transition-all", children: "\u2190 Back to Class" })] }), _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsxs("aside", { className: "w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 overflow-hidden", children: [_jsxs("div", { className: "px-4 py-4 border-b border-zinc-800", children: [_jsx("p", { className: "text-zinc-400 text-xs font-medium uppercase tracking-wider", children: "Sessions" }), _jsxs("p", { className: "text-zinc-600 text-xs mt-1", children: [sessions.length, " recorded"] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-3 flex flex-col gap-1.5", children: sessions.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 gap-2", children: [_jsx("span", { className: "text-3xl", children: "\uD83D\uDCED" }), _jsx("p", { className: "text-zinc-600 text-sm text-center", children: "No sessions recorded yet" })] })) : (sessions.map((s) => (_jsxs("button", { onClick: () => loadReport(s), className: `w-full text-left px-3 py-3 rounded-xl transition-all border ${selectedSession?.id === s.id
                                        ? "bg-emerald-600/15 border-emerald-600/40 shadow-sm"
                                        : "bg-zinc-800/50 hover:bg-zinc-800 border-transparent"}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [_jsx("span", { className: `font-bold tracking-widest text-sm ${selectedSession?.id === s.id ? "text-emerald-400" : "text-white"}`, children: s.code }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded-full ${s.status === "active"
                                                        ? "bg-emerald-500/15 text-emerald-400"
                                                        : "bg-zinc-700 text-zinc-500"}`, children: s.status })] }), _jsx("p", { className: "text-zinc-500 text-xs", children: formatDate(s.created_at) })] }, s.id)))) })] }), _jsxs("main", { className: "flex-1 overflow-y-auto", children: [!selectedSession && (_jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-4", children: [_jsx("span", { className: "text-5xl", children: "\uD83D\uDCCA" }), _jsx("p", { className: "text-zinc-400 font-medium", children: "Select a session to view report" }), _jsx("p", { className: "text-zinc-600 text-sm", children: "Click any session from the sidebar" })] })), loading && (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin" }), _jsx("p", { className: "text-zinc-500 text-sm", children: "Loading report..." })] }) })), summary && !loading && (_jsxs("div", { className: "p-6 flex flex-col gap-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-white text-lg font-bold", children: ["Session", " ", _jsx("span", { className: "text-emerald-400 tracking-widest", children: summary.sessionCode })] }), _jsxs("p", { className: "text-zinc-500 text-sm mt-0.5", children: [summary.startedAt ? formatDate(summary.startedAt) : "—", summary.endedAt && ` → ${formatDate(summary.endedAt)}`] })] }), _jsx("span", { className: `text-xs px-3 py-1.5 rounded-full font-medium border ${summary.status === "active"
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                                    : "bg-zinc-800 text-zinc-400 border-zinc-700"}`, children: summary.status })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: [
                                            { label: "Class Duration", value: summary.classDurationFormatted, icon: "⏱️", color: "text-white" },
                                            { label: "Total Students", value: summary.totalStudents, icon: "👥", color: "text-white" },
                                            { label: "Present", value: summary.present, icon: "✅", color: "text-emerald-400" },
                                            { label: "Late", value: summary.late, icon: "⚠️", color: "text-yellow-400" },
                                        ].map((stat) => (_jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: "text-base", children: stat.icon }), _jsx("p", { className: "text-zinc-500 text-xs", children: stat.label })] }), _jsx("p", { className: `text-2xl font-bold ${stat.color}`, children: stat.value })] }, stat.label))) }), _jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden", children: [_jsx("div", { className: "flex border-b border-zinc-800 bg-zinc-900", children: ["attendance", "quiz", "logs"].map((tab) => (_jsx("button", { onClick: () => { setActiveTab(tab); setSelectedQuiz(null); }, className: `flex-1 py-3.5 text-sm font-medium transition-all ${activeTab === tab
                                                        ? "text-white border-b-2 border-emerald-500 bg-zinc-800/30"
                                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/20"}`, children: tab === "quiz"
                                                        ? `Quiz${summary.quizzes.length > 0 ? ` (${summary.quizzes.length})` : ""}`
                                                        : tab === "logs" ? "Activity Log"
                                                            : "Attendance" }, tab))) }), _jsxs("div", { className: "p-5", children: [activeTab === "attendance" && (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-zinc-500 text-sm", children: [summary.students.length, " student", summary.students.length !== 1 ? "s" : ""] }), summary.students.length > 0 && (_jsxs("button", { onClick: exportAttendance, className: "flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-2 rounded-lg transition-colors", children: [_jsx("span", { children: "\u2193" }), " Export CSV"] }))] }), summary.students.length === 0 ? (_jsx("div", { className: "text-center py-10 text-zinc-600 text-sm", children: "No attendance records" })) : (_jsx("div", { className: "flex flex-col divide-y divide-zinc-800 rounded-xl overflow-hidden border border-zinc-800", children: summary.students.map((s, i) => (_jsxs("div", { className: "flex items-center justify-between px-4 py-3.5 bg-zinc-800/30 hover:bg-zinc-800/60 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-300", children: i + 1 }), _jsxs("div", { children: [_jsx("p", { className: "text-white text-sm font-medium", children: s.student_name }), _jsxs("p", { className: "text-zinc-500 text-xs", children: [s.roll_number, s.total_online_seconds > 0 && (_jsxs("span", { className: "ml-2 text-zinc-600", children: ["\u00B7 ", formatSeconds(Number(s.total_online_seconds)), " online"] }))] })] })] }), _jsx("span", { className: `text-xs px-2.5 py-1 rounded-full font-medium ${s.status === "present"
                                                                                ? "bg-emerald-500/10 text-emerald-400"
                                                                                : "bg-yellow-500/10 text-yellow-400"}`, children: s.status })] }, i))) }))] })), activeTab === "quiz" && (_jsx("div", { className: "flex flex-col gap-4", children: summary.quizzes.length === 0 ? (_jsxs("div", { className: "text-center py-10", children: [_jsx("span", { className: "text-3xl", children: "\uD83D\uDCDD" }), _jsx("p", { className: "text-zinc-600 text-sm mt-3", children: "No quizzes in this session" })] })) : !selectedQuiz ? (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("p", { className: "text-zinc-500 text-sm", children: [summary.quizzes.length, " quiz", summary.quizzes.length > 1 ? "zes" : ""] }), summary.quizzes.map((q) => (_jsxs("button", { onClick: () => setSelectedQuiz(q), className: "flex items-center justify-between bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-700 rounded-xl px-4 py-4 transition-all text-left group", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center text-lg", children: q.mode === "csv" ? "📋" : "🎤" }), _jsxs("div", { children: [_jsx("p", { className: "text-white text-sm font-medium", children: q.title }), _jsxs("p", { className: "text-zinc-500 text-xs mt-0.5", children: [q.mode === "csv" ? "MCQ Quiz" : "Oral Quiz", " \u00B7 ", q.results.length, " student", q.results.length !== 1 ? "s" : ""] })] })] }), _jsx("span", { className: "text-zinc-600 group-hover:text-zinc-400 transition-colors text-lg", children: "\u2192" })] }, q.quizId)))] })) : (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => setSelectedQuiz(null), className: "w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-all text-sm", children: "\u2190" }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-semibold", children: selectedQuiz.title }), _jsxs("p", { className: "text-zinc-500 text-xs", children: [selectedQuiz.mode === "csv" ? "MCQ Quiz" : "Oral Quiz", " \u00B7 ", selectedQuiz.results.length, " students"] })] })] }), _jsxs("button", { onClick: () => exportQuiz(selectedQuiz), className: "flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-2 rounded-lg transition-colors", children: [_jsx("span", { children: "\u2193" }), " Export CSV"] })] }), selectedQuiz.results.length === 0 ? (_jsx("p", { className: "text-zinc-600 text-sm text-center py-8", children: "No results recorded" })) : (_jsx("div", { className: "flex flex-col divide-y divide-zinc-800 rounded-xl overflow-hidden border border-zinc-800", children: selectedQuiz.results.map((r, i) => {
                                                                        const percent = r.scorePercent;
                                                                        const name = r.studentName ?? r.student_name;
                                                                        const roll = r.rollNumber ?? r.roll_number;
                                                                        const scoreLabel = selectedQuiz.mode === "csv"
                                                                            ? `${r.totalCorrect}/${r.totalQuestions}`
                                                                            : `${r.marksObtained}/${r.totalMarks}`;
                                                                        return (_jsxs("div", { className: "px-4 py-3.5 bg-zinc-800/30 hover:bg-zinc-800/60 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-yellow-500/20 text-yellow-400" :
                                                                                                        i === 1 ? "bg-zinc-500/20 text-zinc-400" :
                                                                                                            i === 2 ? "bg-orange-500/20 text-orange-400" :
                                                                                                                "bg-zinc-700 text-zinc-500"}`, children: i + 1 }), _jsxs("div", { children: [_jsx("p", { className: "text-white text-sm font-medium", children: name }), _jsx("p", { className: "text-zinc-500 text-xs", children: roll })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: `text-sm font-bold ${percent >= 70 ? "text-emerald-400" :
                                                                                                        percent >= 40 ? "text-yellow-400" : "text-red-400"}`, children: scoreLabel }), r.remarks && (_jsx("p", { className: "text-zinc-600 text-xs mt-0.5", children: r.remarks }))] })] }), _jsx(ScoreBar, { percent: percent })] }, i));
                                                                    }) }))] })) })), activeTab === "logs" && (_jsx("div", { className: "flex flex-col gap-1", children: logs.length === 0 ? (_jsxs("div", { className: "text-center py-10", children: [_jsx("span", { className: "text-3xl", children: "\uD83D\uDCCB" }), _jsx("p", { className: "text-zinc-600 text-sm mt-3", children: "No activity logs" })] })) : (_jsx("div", { className: "flex flex-col", children: logs.map((log, i) => (_jsxs("div", { className: "flex items-start gap-3 py-3 border-b border-zinc-800/60 last:border-0", children: [_jsx("span", { className: "text-base mt-0.5 shrink-0", children: eventIcon(log.event_type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("p", { className: "text-white text-sm", children: [log.student_name ?? "System", log.roll_number && (_jsx("span", { className: "text-zinc-500 text-xs ml-2", children: log.roll_number }))] }), _jsx("p", { className: "text-zinc-500 text-xs capitalize mt-0.5", children: log.event_type.replace(/_/g, " ") })] }), _jsx("p", { className: "text-zinc-600 text-xs shrink-0 mt-0.5", children: formatDate(log.timestamp) })] }, i))) })) }))] })] })] }))] })] })] }));
}
