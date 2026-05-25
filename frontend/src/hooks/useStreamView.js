import { useEffect, useRef, useState } from "react";
import { getSocket } from "../lib/socket";
export function useStreamView(sessionId) {
    const socket = getSocket();
    const [isTeacherStreaming, setIsTeacherStreaming] = useState(false);
    const [streamMode, setStreamMode] = useState("screen");
    const [frameSrc, setFrameSrc] = useState(null);
    const lastUrlRef = useRef(null);
    useEffect(() => {
        if (!sessionId)
            return;
        socket.on("stream:started", ({ mode }) => {
            setIsTeacherStreaming(true);
            setStreamMode(mode);
        });
        socket.on("stream:stopped", () => {
            setIsTeacherStreaming(false);
            if (lastUrlRef.current) {
                URL.revokeObjectURL(lastUrlRef.current);
                lastUrlRef.current = null;
            }
            setFrameSrc(null);
        });
        socket.on("stream:mode-changed", ({ mode }) => {
            setStreamMode(mode);
        });
        socket.on("stream:frame", (payload) => {
            if (payload.sessionId && payload.sessionId !== sessionId)
                return;
            const blob = new Blob([payload.data], { type: payload.mimeType ?? "image/jpeg" });
            const url = URL.createObjectURL(blob);
            if (lastUrlRef.current)
                URL.revokeObjectURL(lastUrlRef.current);
            lastUrlRef.current = url;
            setFrameSrc(url);
            setIsTeacherStreaming(true);
        });
        return () => {
            socket.off("stream:started");
            socket.off("stream:stopped");
            socket.off("stream:mode-changed");
            socket.off("stream:frame");
            if (lastUrlRef.current) {
                URL.revokeObjectURL(lastUrlRef.current);
                lastUrlRef.current = null;
            }
            setFrameSrc(null);
        };
    }, [sessionId]);
    return { isTeacherStreaming, streamMode, frameSrc };
}
