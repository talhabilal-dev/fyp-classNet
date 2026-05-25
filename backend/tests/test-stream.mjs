import fetch from "node-fetch";
import { io } from "socket.io-client";

const URL = "http://localhost:3000";

function waitFor(socket, event, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout: ${event}`)), timeout);
    socket.once(event, (data) => { clearTimeout(timer); resolve(data); });
  });
}

async function run() {
  // Teacher creates session
  const teacher = io(URL);
  await waitFor(teacher, "connect");
  teacher.emit("session:create");
  const { sessionId, sessionCode } = await waitFor(teacher, "session:created");
  console.log(`✅ Session: ${sessionCode}`);

  // Student joins
  const student = io(URL);
  await waitFor(student, "connect");
  student.emit("student:join", { sessionCode, name: "Ali", rollNumber: "F001" });
  await waitFor(student, "student:joined");
  console.log(`✅ Student joined`);

  // Teacher starts stream
  teacher.emit("stream:start", { sessionId, mode: "screen" });
  const started = await waitFor(student, "stream:started");
  console.log(`✅ Student notified stream started — mode: ${started.mode}`);

  // Test POST frame
  // Test sending a frame over socket
  const fakeJpeg = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, ...Array(100).fill(0x00)]);

  // Wait for student to receive a frame
  const framePromise = waitFor(student, "stream:frame");

  teacher.emit("stream:frame", {
    sessionId,
    width: 320,
    height: 180,
    ts: Date.now(),
    mimeType: "image/jpeg",
    data: fakeJpeg,
  });

  const received = await framePromise;
  console.log(`✅ Student received frame — size: ${received.data?.length ?? "unknown"}`);

  // Test late student joining
  const lateStudent = io(URL);
  await waitFor(lateStudent, "connect");
  lateStudent.emit("student:join", { sessionCode, name: "Sara", rollNumber: "F002" });
  await waitFor(lateStudent, "student:joined");
  console.log(`✅ Late student joined`);

  lateStudent.emit("stream:check", { sessionId });
  const lateFrame = await waitFor(lateStudent, "stream:frame", 3000);
  console.log(`✅ Late student received cached frame — size: ${lateFrame.data?.length ?? "unknown"}`);

  // Teacher stops
  teacher.emit("stream:stop", { sessionId });
  const stopped = await waitFor(student, "stream:stopped");
  console.log(`✅ Student notified stream stopped`);

  teacher.disconnect();
  student.disconnect();
  lateStudent.disconnect();
  process.exit(0);
}

run().catch(console.error);