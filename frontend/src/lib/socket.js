import { io } from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
let socket;
export function getSocket() {
    if (!socket) {
        socket = io(BACKEND_URL, { autoConnect: false });
    }
    return socket;
}
