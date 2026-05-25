import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { config } from "./config/index.js";
import { initSocket } from "./sockets/index.js";
import { getLocalIP } from "./utils/getLocalIP.js";
import { initDatabase } from "./database/database.js";
import sessionRoutes from "./modules/session/session.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";
import filesRoutes from "./modules/files/files.routes.js";
import logsRoutes from "./modules/logs/logs.routes.js";
import quizRoutes from "./modules/quiz/quiz.routes.js";
import { fileURLToPath } from "url";

const app = express();
const httpServer = http.createServer(app);
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use("/uploads", express.static(path.join(moduleDir, "..", config.uploadDir)));

app.use("/api/sessions", sessionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/quiz", quizRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "ClassNet server is running" });
});

initSocket(httpServer);
async function bootstrap() {
  await initDatabase();
  httpServer.listen(config.port, "0.0.0.0", () => {
    const localIP = getLocalIP();
    console.log("=================================");
    console.log("  🎓 ClassNet Server Started");
    console.log("=================================");
    console.log(`  Local:   http://localhost:${config.port}`);
    console.log(`  LAN:     http://${localIP}:${config.port}`);
    console.log("=================================");
  });
}

bootstrap();







