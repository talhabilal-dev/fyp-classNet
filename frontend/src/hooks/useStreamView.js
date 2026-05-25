import { useEffect, useRef, useState } from "react";
import { getSocket } from "../lib/socket";

function toFrameBlob(data, mimeType = "image/jpeg") {
    if (!data)
        return null;
    if (data instanceof Blob)
        return data;
    if (data instanceof ArrayBuffer)
        return new Blob([data], { type: mimeType });
    if (ArrayBuffer.isView(data)) {
        return new Blob([data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)], { type: mimeType });
    }
    if (data?.data && Array.isArray(data.data)) {
        return new Blob([new Uint8Array(data.data)], { type: mimeType });
    }
    return null;
}

export function useStreamView(sessionId) {
    const socket = getSocket();
    const [isTeacherStreaming, setIsTeacherStreaming] = useState(false);
    const [streamMode, setStreamMode] = useState("screen");
    const [frameSrc, setFrameSrc] = useState(null);
    const stopPolling = () => {
        setFrameSrc(null);
    };
    useEffect(() => {
        if (!sessionId)
            return;
        const handleStreamStarted = ({ mode }) => {
            setIsTeacherStreaming(true);
            setStreamMode(mode);
        };
        const handleStreamStopped = () => {
            setIsTeacherStreaming(false);
            stopPolling();
        };
        const handleStreamModeChanged = ({ mode }) => {
            setStreamMode(mode);
        };
        const handleStreamFrame = (payload) => {
            if (!payload || payload.sessionId !== sessionId)
                return;
            const blob = toFrameBlob(payload.data, payload.mimeType);
            if (!blob)
                return;
            const url = URL.createObjectURL(blob);
            setFrameSrc((prev) => {
                if (prev)
                    URL.revokeObjectURL(prev);
                return url;
            });
            setIsTeacherStreaming(true);
        };
        const handleStreamNone = () => {
            setIsTeacherStreaming(false);
            stopPolling();
        };
        socket.on("stream:started", handleStreamStarted);
        socket.on("stream:stopped", handleStreamStopped);
        socket.on("stream:mode-changed", handleStreamModeChanged);
        socket.on("stream:frame", handleStreamFrame);
        socket.on("stream:none", handleStreamNone);
        socket.emit("stream:check", { sessionId });
        return () => {
            socket.off("stream:started", handleStreamStarted);
            socket.off("stream:stopped", handleStreamStopped);
            socket.off("stream:mode-changed", handleStreamModeChanged);
            socket.off("stream:frame", handleStreamFrame);
            socket.off("stream:none", handleStreamNone);
            stopPolling();
        };
    }, [sessionId]);
    return { isTeacherStreaming, streamMode, frameSrc };
}
