import React from "react";

export function StudentDashboard({ studentData, attendanceStatus, handRaised, files, sessionEnded, onRaiseHand, onLowerHand }) {
  if (sessionEnded) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-surface border border-surface-2 rounded-2xl p-8 text-center shadow-xl shadow-black/10">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <span className="text-3xl">⏹️</span>
          </div>
          <p className="text-white font-semibold text-xl">Class Ended</p>
          <p className="text-muted text-sm mt-2">The teacher has ended the session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="bg-surface border border-surface-2 rounded-2xl p-5 shadow-lg shadow-black/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-400 text-xs font-semibold uppercase tracking-[0.18em] mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Student View
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight">Welcome, {studentData.name}</h1>
            <p className="text-muted text-sm mt-2">Roll No: {studentData.rollNumber} · Session: {studentData.sessionCode}</p>
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
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-surface border border-surface-2 rounded-2xl p-4">
          <p className="text-muted text-xs uppercase tracking-[0.18em]">Attendance</p>
          <p className="text-white text-lg font-semibold mt-2">{attendanceStatus || "Pending"}</p>
        </div>
        <div className="bg-surface border border-surface-2 rounded-2xl p-4">
          <p className="text-muted text-xs uppercase tracking-[0.18em]">Hand Status</p>
          <p className="text-white text-lg font-semibold mt-2">{handRaised ? "Raised" : "Lowered"}</p>
        </div>
        <div className="bg-surface border border-surface-2 rounded-2xl p-4">
          <p className="text-muted text-xs uppercase tracking-[0.18em]">Shared Files</p>
          <p className="text-white text-lg font-semibold mt-2">{files.length}</p>
        </div>
      </div>

      <div className="bg-surface border border-surface-2 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-lg shadow-black/10">
        <div className="text-center">
          <p className="text-muted text-sm">Need attention from the teacher?</p>
          <p className="text-white text-lg font-semibold mt-1">Use the hand button to request help</p>
        </div>
        <button
          onClick={handRaised ? onLowerHand : onRaiseHand}
          className={`w-full max-w-md py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${
            handRaised
              ? "bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
          }`}
        >
          {handRaised ? "✋ Hand Raised - Click to Lower" : "Raise Hand"}
        </button>
      </div>

      <div className="bg-surface border border-surface-2 rounded-2xl p-5 shadow-lg shadow-black/10">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-white font-semibold text-lg">Shared Files</h2>
            <p className="text-muted text-sm mt-1">Files posted by your teacher during the session</p>
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
              <a
                key={file.fileId}
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-xl border border-surface-2 bg-surface-3/60 px-4 py-3 transition-all hover:bg-surface-2 hover:border-surface"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 text-[11px] font-bold tracking-[0.18em] px-2.5 py-1 rounded-full bg-brand/15 text-brand border border-brand/20">
                    {file.category.toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-emerald-300">{file.originalName}</p>
                    <p className="text-muted text-xs mt-0.5">Available for download</p>
                  </div>
                </div>
                <span className="shrink-0 text-muted text-xs">{(file.sizeBytes / 1024).toFixed(1)} KB</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
