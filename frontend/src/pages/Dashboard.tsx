import { DashboardShell } from "../components/layouts/DashboardShell.tsx";
import { ChatInput } from "../components/ChatInput.tsx";

export function DashboardPage() {
  return (
    <DashboardShell>
      <section className="flex h-full flex-1 flex-col overflow-hidden rounded-[32px] bg-white/80 p-6 shadow-inner">
        <header className="mb-4 border-b border-indigo/10 pb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate/60">
            Chat With AI
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-indigo">Welcome back</h1>
          <p className="text-sm text-slate/70">
            Start a conversation. Your assistant has access to your connected data sources.
          </p>
        </header>
        <div className="flex flex-1 flex-col overflow-hidden rounded-[28px] border border-indigo/10 bg-white">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="rounded-2xl bg-lavender/30 p-4 text-sm text-slate/70">
              No messages yet. Ask anything to get started.
            </div>
          </div>
          <div className="border-t border-indigo/10 bg-white/70 p-4">
            <ChatInput />
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

