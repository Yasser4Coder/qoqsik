import { useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "../Sidebar.tsx";
import { TopBar } from "../TopBar.tsx";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-[95vh] bg-gradient-to-br from-lavender to-white px-6 py-6 font-inter text-indigo">
      <div className="flex min-h-[95vh] w-full gap-8 overflow-hidden rounded-[48px]">
        <Sidebar collapsed={isCollapsed} />
        <main className="flex min-h-[95vh] flex-1 flex-col gap-8 rounded-[40px] bg-white/70 p-10 shadow-panel overflow-hidden">
          <div className="flex items-center justify-between">
            <TopBar />
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="rounded-2xl border border-indigo/20 bg-white px-4 py-2 text-sm font-semibold text-indigo transition hover:border-indigo/50"
            >
              {isCollapsed ? (
                <span className="flex items-center gap-2">
                  <TbLayoutSidebarLeftExpand /> Open menu
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <TbLayoutSidebarLeftCollapse /> Close menu
                </span>
              )}
            </button>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
        </main>
      </div>
    </div>
  );
}

