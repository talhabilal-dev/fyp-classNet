import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const OPTIONS = ["A", "B", "C", "D"];
function getOptionText(q, opt) {
    if (opt === "A")
        return q.option_a;
    if (opt === "B")
        return q.option_b;
    if (opt === "C")
        return q.option_c;
    return q.option_d;
}
export function QuizPanel({ quiz, questions, answers, quizEnded, onSubmitAnswer }) {
    const answeredCount = Object.keys(answers).length;
    if (quizEnded) {
        return (_jsx("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3", children: _jsxs("div", { className: "text-center py-4", children: [_jsx("p", { className: "text-2xl mb-2", children: "\uD83C\uDF89" }), _jsx("p", { className: "text-white font-semibold", children: "Quiz Ended" }), _jsxs("p", { className: "text-zinc-500 text-sm mt-1", children: ["You answered ", answeredCount, " of ", quiz.total_questions, " questions"] })] }) }));
    }
    return (_jsxs("div", {
        className: "bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-white font-semibold", children: quiz.title }), _jsxs("p", { className: "text-zinc-500 text-xs mt-0.5", children: [answeredCount, "/", quiz.total_questions, " answered"] })] }), _jsx("span", { className: "text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-lg", children: quiz.mode === "csv" ? "MCQ" : "Oral" })] }), _jsx("div", { className: "w-full bg-zinc-800 rounded-full h-1.5", children: _jsx("div", { className: "bg-emerald-500 h-1.5 rounded-full transition-all", style: { width: `${(answeredCount / quiz.total_questions) * 100}%` } }) }), _jsx("div", {
            className: "flex flex-col gap-4 max-h-96 overflow-y-auto", children: questions.map((q) => (_jsxs("div", {
                className: "bg-zinc-800 rounded-xl p-4 flex flex-col gap-3", children: [_jsxs("p", { className: "text-white text-sm font-medium", children: [_jsxs("span", { className: "text-zinc-500 mr-2", children: ["Q", q.question_number, "."] }), q.question_text] }), _jsx("div", {
                    className: "grid grid-cols-2 gap-2", children: OPTIONS.map((opt) => {
                        const selected = answers[q.id] === opt;
                        return (_jsxs("button", {
                            onClick: () => onSubmitAnswer(q.id, opt), className: `px-3 py-2.5 rounded-lg text-sm text-left transition-all ${selected
                                ? "bg-emerald-600 text-white border-2 border-emerald-500"
                                : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300 border-2 border-transparent"}`, children: [_jsxs("span", { className: "font-bold mr-2", children: [opt, "."] }), getOptionText(q, opt)]
                        }, opt));
                    })
                })]
            }, q.id)))
        })]
    }));
}
