import { DashboardShell } from "../components/layouts/DashboardShell.tsx";
import { ChatInput } from "../components/ChatInput.tsx";

export function DashboardPage() {
  return (
    <DashboardShell>
      <section className="flex h-full flex-1 flex-col overflow-hidden rounded-[32px] bg-[#f3f3f3]  px-6 pt-6">
        <div className="flex flex-1 flex-col overflow-hidden bg-[#f3f3f3]">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="rounded-2xl bg-lavender/30 p-4 text-sm text-slate/70">
              No messages yet. Ask anything to get started.
            </div>
          </div>

          <ChatInput />
        </div>
      </section>
    </DashboardShell>
  );
}
