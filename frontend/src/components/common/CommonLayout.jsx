import React from "react";

export default function CommonLayout({ children, role = "Teacher", sidebar = null, headerActions = null }) {
  return (
    <div className="min-h-screen bg-surface-3 text-white bg-zinc-900 flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-30 bg-surface-2/95 backdrop-blur border-b border-surface px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center shadow-md shadow-black/20">
            <span className="text-sm">🎓</span>
          </div>
          <div>
            <div className="text-white font-bold tracking-tight">ClassNet</div>
            <div className="text-muted text-xs">{role} panel</div>
          </div>
        </div>

        <div className="flex items-center gap-3">{headerActions}</div>
      </header>

      <main className="flex-1 overflow-auto pt-20 pb-6 px-4 sm:px-6">
        {sidebar && (
          <aside className="fixed left-4 top-20 bottom-6 w-64 bg-surface border border-surface-2 rounded-2xl p-4 z-20 overflow-y-auto">
            {sidebar}
          </aside>
        )}
        <div className="container p-0">
          <div className="flex">
            <div className={`flex-1 ${sidebar ? "ml-72" : ""}`}>{children}</div>
          </div>
        </div>
      </main>

    </div>
  );
}
