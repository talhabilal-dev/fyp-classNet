import React, { useState } from "react";
import { SessionQRCode } from "./QRCode";

export function TeacherDashboard({
  session,
  students,
  attendance,
  files,
  raisedHands,
  attendanceStats,
  onDismissHand,
}) {
  const [copied, setCopied] = useState(null);
  const onlineCount = students.filter((s) => s.isOnline).length;
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const lateCount = attendance.filter((a) => a.status === "late").length;

  const copy = async (text, type) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Session Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-4">
        <div className="bg-gradient-to-r from-brand/10 to-emerald-900/20 border border-brand/30 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400 text-xs font-semibold uppercase tracking-[0.18em] mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Session
              </div>
              <h1 className="text-white text-2xl font-bold mb-2">Session Active</h1>
              <p className="text-muted text-sm max-w-xl">
                Share the join code or QR code with students, monitor live attendance, and manage the classroom from one place.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-emerald-400 text-sm font-semibold whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-4">
            <div className="rounded-2xl border border-surface-2 bg-surface/80 p-5">
              <p className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">Join Code</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-mono text-3xl font-bold tracking-[0.25em] text-white">{session.sessionCode}</p>
                  {/* <p className="text-muted text-xs mt-2 break-all">{session.lanUrl}</p> */}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => copy(session.sessionCode, "code")}
                    className="rounded-lg bg-brand/20 px-3 py-2 text-xs font-semibold text-brand hover:bg-brand/30 transition-all"
                  >
                    {copied === "code" ? "Copied" : "Copy Code"}
                  </button>
                  <button
                    onClick={() => copy(session.lanUrl, "url")}
                    className="rounded-lg border border-surface-2 bg-surface-2 px-3 py-2 text-xs font-semibold text-muted hover:text-white hover:bg-surface transition-all"
                  >
                    {copied === "url" ? "Copied" : "Copy Link"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-surface-2 bg-surface/80 p-4 flex flex-col items-center justify-center">
              <SessionQRCode sessionCode={session.sessionCode} lanUrl={session.lanUrl} />
              <p className="mt-3 text-xs text-muted text-center">Students can scan this to join instantly.</p>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-surface-2 rounded-2xl p-5">
          <p className="text-muted text-xs font-semibold uppercase tracking-wider mb-3">Session Stats</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-2 p-4">
              <p className="text-muted text-xs font-semibold uppercase">Online</p>
              <p className="text-white text-2xl font-bold mt-2">{onlineCount}/{students.length}</p>
            </div>
            <div className="rounded-xl bg-surface-2 p-4">
              <p className="text-muted text-xs font-semibold uppercase">Present</p>
              <p className="text-emerald-400 text-2xl font-bold mt-2">{presentCount}</p>
            </div>
            <div className="rounded-xl bg-surface-2 p-4">
              <p className="text-muted text-xs font-semibold uppercase">Late</p>
              <p className="text-yellow-400 text-2xl font-bold mt-2">{lateCount}</p>
            </div>
            <div className="rounded-xl bg-surface-2 p-4">
              <p className="text-muted text-xs font-semibold uppercase">Files</p>
              <p className="text-blue-400 text-2xl font-bold mt-2">{files.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Raised Hands Alert */}
      {raisedHands.length > 0 && (
        <div className="bg-yellow-500/15 border border-yellow-500/40 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">✋</span>
            <div>
              <h3 className="text-yellow-200 font-bold text-sm">Students Requesting Help</h3>
              <p className="text-yellow-400/70 text-xs">{raisedHands.length} {raisedHands.length === 1 ? "student" : "students"}</p>
            </div>
          </div>
          <div className="space-y-2">
            {raisedHands.map((h) => (
              <div key={h.studentId} className="flex items-center justify-between bg-yellow-500/10 rounded-lg p-3">
                <div>
                  <p className="text-white text-sm font-semibold">{h.studentName}</p>
                  <p className="text-yellow-400/60 text-xs">{new Date(h.raisedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <button onClick={() => onDismissHand(h.studentId)} className="bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 text-xs px-3 py-1.5 rounded-lg transition-all font-medium">
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-surface-2 rounded-xl p-5">
          <p className="text-muted text-xs font-semibold uppercase mb-2">Total Students</p>
          <p className="text-white text-3xl font-bold">{students.length}</p>
          <p className="text-muted text-xs mt-2">{onlineCount} online now</p>
        </div>
        <div className="bg-surface border border-surface-2 rounded-xl p-5">
          <p className="text-muted text-xs font-semibold uppercase mb-2">Present</p>
          <p className="text-emerald-400 text-3xl font-bold">{presentCount}</p>
          <p className="text-muted text-xs mt-2">{attendance.length} marked</p>
        </div>
        <div className="bg-surface border border-surface-2 rounded-xl p-5">
          <p className="text-muted text-xs font-semibold uppercase mb-2">Late</p>
          <p className="text-yellow-400 text-3xl font-bold">{lateCount}</p>
          <p className="text-muted text-xs mt-2">Needs attention</p>
        </div>
        <div className="bg-surface border border-surface-2 rounded-xl p-5">
          <p className="text-muted text-xs font-semibold uppercase mb-2">Files Shared</p>
          <p className="text-blue-400 text-3xl font-bold">{files.length}</p>
          <p className="text-muted text-xs mt-2">Available to students</p>
        </div>
      </div>

      {/* Students List Preview */}
      <div className="bg-surface border border-surface-2 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-2">
          <h2 className="text-white font-bold text-lg">Connected Students</h2>
        </div>
        {students.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-muted text-sm">Waiting for students to join...</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-2">
            {students.slice(0, 5).map((s) => (
              <div key={s.id} className="px-6 py-3 flex items-center justify-between hover:bg-surface-2/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.isOnline ? "bg-emerald-400" : "bg-zinc-600"}`}></div>
                  <div>
                    <p className="text-white text-sm font-medium">{s.name}</p>
                    <p className="text-muted text-xs">{s.rollNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {raisedHands.find((h) => h.studentId === s.id) && <span className="text-lg animate-bounce">✋</span>}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.isOnline ? "bg-emerald-500/10 text-emerald-400" : "bg-surface-2 text-zinc-500"}`}>
                    {s.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            ))}
            {students.length > 5 && (
              <div className="px-6 py-3 text-center">
                <p className="text-muted text-xs">+{students.length - 5} more students</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
