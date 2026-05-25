import { Server as SocketServer, Socket } from "socket.io";

type StreamMode = "screen" | "whiteboard";

interface FramePayload {
  sessionId: string;
  data: ArrayBuffer | Uint8Array | Buffer;
  width: number;
  height: number;
  ts?: number;
  mimeType?: string;
}

interface CachedFrame {
  data: Buffer;
  width: number;
  height: number;
  ts: number;
  mimeType: string;
}

const MAX_FRAME_BYTES = 2 * 1024 * 1024;

// Track active streams: sessionId -> mode
const activeStreams = new Map<string, StreamMode>();
const lastFrames = new Map<string, CachedFrame>();

export function clearStreamState(sessionId: string): void {
  activeStreams.delete(sessionId);
  lastFrames.delete(sessionId);
}

function isTeacherSocket(socket: Socket, sessionId: string): boolean {
  return socket.rooms.has(`${sessionId}:teacher`);
}

function normalizeFrameData(data: FramePayload["data"]): Buffer | null {
  if (!data) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof ArrayBuffer) return Buffer.from(data);
  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  }
  return null;
}

export function registerStreamSocketEvents(io: SocketServer, socket: Socket): void {

  // Teacher started streaming
  socket.on("stream:start", ({ sessionId, mode }: { sessionId: string; mode: StreamMode }) => {
    if (!isTeacherSocket(socket, sessionId)) return;
    activeStreams.set(sessionId, mode);
    lastFrames.delete(sessionId);
    socket.to(sessionId).emit("stream:started", { mode });
    console.log(`[Stream] Started ${mode} in session ${sessionId}`);
  });

  // Teacher stopped streaming
  socket.on("stream:stop", ({ sessionId }: { sessionId: string }) => {
    if (!isTeacherSocket(socket, sessionId)) return;
    clearStreamState(sessionId);
    socket.to(sessionId).emit("stream:stopped");
    console.log(`[Stream] Stopped in session ${sessionId}`);
  });

  // Teacher switched mode
  socket.on("stream:mode-change", ({ sessionId, mode }: { sessionId: string; mode: StreamMode }) => {
    if (!isTeacherSocket(socket, sessionId)) return;
    activeStreams.set(sessionId, mode);
    socket.to(sessionId).emit("stream:mode-changed", { mode });
  });

  // Teacher uploads a compressed frame
  socket.on("stream:frame", (payload: FramePayload) => {
    if (!payload?.sessionId || !isTeacherSocket(socket, payload.sessionId)) return;
    if (!activeStreams.has(payload.sessionId)) return;

    const buf = normalizeFrameData(payload.data);
    if (!buf) return;
    if (buf.length > MAX_FRAME_BYTES) {
      console.warn(`[Stream] Dropped frame > ${MAX_FRAME_BYTES} bytes for ${payload.sessionId}`);
      return;
    }

    const width = Number.isFinite(payload.width) ? payload.width : 0;
    const height = Number.isFinite(payload.height) ? payload.height : 0;
    const mimeType = payload.mimeType ?? "image/jpeg";
    if (mimeType !== "image/jpeg") {
      console.warn(`[Stream] Rejected frame with mime ${mimeType} for ${payload.sessionId}`);
      return;
    }

    const frame: CachedFrame = {
      data: buf,
      width,
      height,
      ts: payload.ts ?? Date.now(),
      mimeType,
    };

    lastFrames.set(payload.sessionId, frame);
    socket.to(payload.sessionId).volatile.emit("stream:frame", {
      sessionId: payload.sessionId,
      ...frame,
      data: buf,
    });
  });

  // Student checks if stream is active when joining
  socket.on("stream:check", ({ sessionId }: { sessionId: string }) => {
    const mode = activeStreams.get(sessionId);
    if (mode) {
      socket.emit("stream:started", { mode });
      const frame = lastFrames.get(sessionId);
      if (frame) {
        socket.emit("stream:frame", { sessionId, ...frame, data: frame.data });
      }
      console.log(`[Stream] Late student checked — stream active: ${mode}`);
    } else {
      socket.emit("stream:none");
    }
  });

  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (!room.endsWith(":teacher")) continue;
      const sessionId = room.slice(0, -":teacher".length);
      if (!activeStreams.has(sessionId)) continue;
      clearStreamState(sessionId);
      io.to(sessionId).emit("stream:stopped");
      console.log(`[Stream] Teacher disconnected — stopped stream in ${sessionId}`);
    }
  });
}