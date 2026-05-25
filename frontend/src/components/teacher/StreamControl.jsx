import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStream } from "../../hooks/useStream";
export function StreamControl({ sessionId, onModeChange }) {
    const { isStreaming, streamMode, error, startScreenShare, stopCapture } = useStream(sessionId);
    const handleScreenShare = () => {
        startScreenShare();
        onModeChange?.("screen");
    };
    const handleStop = () => {
        stopCapture();
        onModeChange?.(null);
    };
    return (_jsxs("div", { className: "flex items-center gap-2", children: [error && _jsx("span", { className: "text-red-400 text-xs", children: error }), !isStreaming ? (_jsxs("button", { onClick: handleScreenShare, className: "flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-1.5 rounded-lg transition-all font-medium shadow-lg shadow-blue-900/30", children: [_jsx("span", { children: "\uD83D\uDDA5\uFE0F" }), " Share Screen"] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" }), _jsx("span", { className: "text-red-400 text-xs font-medium", children: streamMode === "screen" ? "Screen Live" : "Whiteboard Live" })] }), _jsx("button", { onClick: handleStop, className: "flex items-center gap-2 bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white text-sm px-4 py-1.5 rounded-lg transition-all", children: "Stop" })] }))] }));
}
