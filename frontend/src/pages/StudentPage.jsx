import React from "react";
import CommonLayout from "../components/common/CommonLayout";
import { StudentDashboard } from "../components/student/StudentDashboard";
import { StreamViewer } from "../components/student/StreamViewer";
import { useStudentSession } from "../hooks/useStudentSession";

export function StudentPage() {
  const { studentData, attendanceStatus, handRaised, files, sessionEnded, joinSession, raiseHand, lowerHand, error, isLoading, teacherReconnecting } = useStudentSession();

  if (!studentData) {
    return (
      <CommonLayout role="Student">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-3xl border border-surface-2 bg-surface/95 shadow-2xl shadow-black/20 p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-400 text-xs font-semibold uppercase tracking-[0.18em] mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Student Workspace
                </div>
                <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">Join your class</h1>
                <p className="text-muted text-sm sm:text-base mt-3 max-w-lg">
                  Open the join page using the QR code or session link shared by your teacher, then enter your details to start.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-surface-2 bg-surface-3/60 p-5">
                  <p className="text-muted text-xs uppercase tracking-[0.18em]">Session</p>
                  <p className="text-white text-lg font-semibold mt-2">Waiting to join</p>
                  <p className="text-muted text-sm mt-1">Use the join code provided by your teacher</p>
                </div>
                <div className="rounded-2xl border border-surface-2 bg-surface-3/60 p-5">
                  <p className="text-muted text-xs uppercase tracking-[0.18em]">Status</p>
                  <p className="text-white text-lg font-semibold mt-2">Not connected</p>
                  <p className="text-muted text-sm mt-1">You can open the join page from the QR link</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </CommonLayout>
    );
  }

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
        <p className="text-muted text-sm mt-2 leading-6">Keep this tab open during class and use the join code only once per session.</p>
      </div>
    </div>
  );

  return (
    <CommonLayout role="Student" sidebar={sidebar}>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)] items-start">
          <div className="flex flex-col gap-6 min-w-0">
            <StreamViewer sessionId={studentData.sessionId} />
            <StudentDashboard
              studentData={studentData}
              attendanceStatus={attendanceStatus}
              handRaised={handRaised}
              files={files}
              sessionEnded={sessionEnded}
              onRaiseHand={raiseHand}
              onLowerHand={lowerHand}
            />
          </div>

          <aside className="flex flex-col gap-6 min-w-0">
            <div className="rounded-2xl border border-surface-2 bg-surface/95 p-5 shadow-lg shadow-black/10">
              <p className="text-muted text-xs uppercase tracking-[0.2em] mb-3">Live Class</p>
              <p className="text-white text-lg font-semibold">Lecture screen and whiteboard appear above.</p>
              <p className="text-muted text-sm mt-2 leading-6">
                Keep this page open while the teacher shares the screen or writes on the board.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </CommonLayout>
  );
}
