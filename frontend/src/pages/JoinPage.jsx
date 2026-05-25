import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CommonLayout from "../components/common/CommonLayout";
import { useStudentSession } from "../hooks/useStudentSession";
import { useQuiz } from "../hooks/useQuiz";
import { QuizPanel } from "../components/student/QuizPanel";
import { StreamViewer } from "../components/student/StreamViewer";

function categoryIcon(category) {
  if (category === "pdf") return "📄";
  if (category === "image") return "🖼️";
  if (category === "video") return "🎥";
  if (category === "document") return "📝";
  return "📎";
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileCard({ file }) {
  return (
    <a
      href={file.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 rounded-xl border border-surface-2 bg-surface-3/60 px-4 py-3 transition-all hover:bg-surface-2 hover:border-surface"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="shrink-0 text-[11px] font-bold tracking-[0.18em] px-2.5 py-1 rounded-full bg-brand/15 text-brand border border-brand/20">
          {categoryIcon(file.category)} {file.category.toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate group-hover:text-emerald-300">{file.originalName}</p>
          <p className="text-muted text-xs mt-0.5">{formatSize(file.sizeBytes)}</p>
        </div>
      </div>
      <span className="shrink-0 text-muted text-xs">↓</span>
    </a>
  );
}

export function JoinPage() {
  const { code } = useParams();
  const {
    studentData,
    attendanceStatus,
    handRaised,
    files,
    error,
    isLoading,
    sessionEnded,
    teacherReconnecting,
    joinSession,
    raiseHand,
    lowerHand,
  } = useStudentSession();
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [sessionCode, setSessionCode] = useState(code ?? "");
  const { quiz, questions, answers, quizEnded, submitAnswer } = useQuiz(studentData);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && rollNumber.trim() && sessionCode.trim()) {
      joinSession(sessionCode.trim().toUpperCase(), name.trim(), rollNumber.trim());
    }
  };

  if (sessionEnded) {
    return (
      <CommonLayout role="Student">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-3xl border border-surface-2 bg-surface p-10 text-center shadow-2xl shadow-black/20">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <span className="text-3xl">⏹️</span>
            </div>
            <p className="text-white font-semibold text-2xl">Class Ended</p>
            <p className="text-muted text-sm mt-2">The teacher has ended the session.</p>
          </div>
        </div>
      </CommonLayout>
    );
  }

  if (studentData) {
    const sidebar = (
      <div className="flex flex-col gap-4 h-full">
        <div>
          <p className="text-muted text-xs font-semibold uppercase tracking-wider px-2 py-1 mb-2">Session</p>
          <div className="bg-surface-3 border border-surface-2 rounded-xl p-4 text-center mb-3">
            <span className="text-white text-xl font-bold tracking-[0.2em]">{studentData.sessionCode}</span>
          </div>
          <p className="text-muted text-xs leading-5 break-all px-1">{studentData.sessionUrl || studentData.lanUrl || ""}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-surface-2 bg-surface-3/60 p-3">
            <p className="text-muted text-[11px] uppercase tracking-[0.16em]">Attendance</p>
            <p className="text-white text-sm font-semibold mt-2">{attendanceStatus || "Pending"}</p>
          </div>
          <div className="rounded-xl border border-surface-2 bg-surface-3/60 p-3">
            <p className="text-muted text-[11px] uppercase tracking-[0.16em]">Hand</p>
            <p className="text-white text-sm font-semibold mt-2">{handRaised ? "Raised" : "Lowered"}</p>
          </div>
          <div className="rounded-xl border border-surface-2 bg-surface-3/60 p-3 col-span-2">
            <p className="text-muted text-[11px] uppercase tracking-[0.16em]">Files</p>
            <p className="text-white text-sm font-semibold mt-2">{files.length} shared</p>
          </div>
        </div>

        {teacherReconnecting && (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-400">
            Teacher is reconnecting - please wait
          </div>
        )}

        <div className="mt-auto rounded-xl border border-surface-2 bg-surface-3/60 p-3">
          <p className="text-muted text-xs uppercase tracking-[0.16em]">Tips</p>
          <p className="text-muted text-sm mt-2 leading-6">
            Keep this tab open during class and use the join code only once per session.
          </p>
        </div>
      </div>
    );

    return (
      <CommonLayout role="Student" sidebar={sidebar}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)] items-start">
            <div className="flex flex-col gap-6 min-w-0">
              <section className="bg-surface border border-surface-2 rounded-2xl p-5 shadow-lg shadow-black/10">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-400 text-xs font-semibold uppercase tracking-[0.18em] mb-4">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Student View
                    </div>
                    <h1 className="text-white text-2xl font-bold tracking-tight">Welcome, {studentData.name}</h1>
                    <p className="text-muted text-sm mt-2">
                      Roll No: {studentData.rollNumber} · Session: {studentData.sessionCode}
                    </p>
                  </div>
                  {attendanceStatus && (
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide ${
                        attendanceStatus === "present"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {attendanceStatus === "present" ? "Present" : "Late"}
                    </span>
                  )}
                </div>
              </section>

              <StreamViewer sessionId={studentData.sessionId} />

              {quiz && (
                <QuizPanel
                  quiz={quiz}
                  questions={questions}
                  answers={answers}
                  quizEnded={quizEnded}
                  onSubmitAnswer={submitAnswer}
                />
              )}
            </div>

            <aside className="flex flex-col gap-6 min-w-0">
              <section className="bg-surface border border-surface-2 rounded-2xl p-5 shadow-lg shadow-black/10 flex flex-col items-center gap-4">
                <div className="text-center">
                  <p className="text-muted text-sm">Need attention from the teacher?</p>
                  <p className="text-white text-lg font-semibold mt-1">Use the hand button to request help</p>
                </div>
                <button
                  onClick={handRaised ? lowerHand : raiseHand}
                  className={`w-full max-w-md py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                    handRaised
                      ? "bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
                  }`}
                >
                  {handRaised ? "✋ Hand Raised - Click to Lower" : "Raise Hand"}
                </button>
                {handRaised && <p className="text-muted text-xs text-center">Teacher has been notified</p>}
              </section>

              <section className="bg-surface border border-surface-2 rounded-2xl p-5 shadow-lg shadow-black/10">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-white font-semibold text-lg">Shared Files</h2>
                    <p className="text-muted text-sm mt-1">Downloaded materials from the session</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-surface-2 text-muted border border-surface-2">{files.length} items</span>
                </div>

                {files.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-surface-2 bg-surface-3/60 py-10 text-center">
                    <p className="text-muted text-sm">No files shared yet</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {files.map((file) => (
                      <FileCard key={file.fileId} file={file} />
                    ))}
                  </div>
                )}
              </section>

              <section className="bg-surface border border-surface-2 rounded-2xl p-5 shadow-lg shadow-black/10">
                <p className="text-muted text-xs uppercase tracking-[0.2em] mb-3">Session Tips</p>
                <ul className="space-y-2 text-sm text-muted">
                  <li>Keep this page open during class.</li>
                  <li>Use Raise Hand if you need help.</li>
                  <li>Watch the lecture screen for live teaching.</li>
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout role="Student">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl border border-surface-2 bg-surface/95 shadow-2xl shadow-black/20 p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-400 text-xs font-semibold uppercase tracking-[0.18em] mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Student Join
              </div>
              <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">Join your class</h1>
              <p className="text-muted text-sm sm:text-base mt-3 max-w-lg">
                Enter your name, roll number, and the session code shared by your teacher to enter the live classroom.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-surface-2 bg-surface-3/60 p-5 sm:p-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-sm">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ali Khan"
                  className="bg-surface border border-surface-2 text-white placeholder:text-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-sm">Roll Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. F22BINFT001"
                  className="bg-surface border border-surface-2 text-white placeholder:text-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-sm">Session Code</label>
                <input
                  type="text"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC123"
                  maxLength={6}
                  className="bg-surface border border-surface-2 text-white placeholder:text-zinc-600 rounded-xl px-4 py-3 text-sm tracking-widest uppercase focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !name.trim() || !rollNumber.trim() || !sessionCode.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/30"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Joining...
                  </span>
                ) : (
                  "Join Class"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}