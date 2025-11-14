import { primaryNav, secondaryNav } from "../data/navigation.ts";
import { SidebarNavItem } from "./SidebarNavItem.tsx";

type SidebarProps = {
  collapsed?: boolean;
};

export function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <aside
      className={`flex min-h-[95vh] flex-col justify-between rounded-2xl bg-[#F3F3F3] p-4 shadow-panel transition-all duration-500 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          {primaryNav.map((item) => (
            <SidebarNavItem
              key={item.label}
              item={item}
              collapsed={collapsed}
            />
          ))}
        </div>
        {!collapsed && secondaryNav.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate/70">
              Support
            </p>
            <div className="mt-4 space-y-2">
              {secondaryNav.map((item) => (
                <SidebarNavItem
                  key={item.label}
                  item={item}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="rounded-2xl bg-transparent cursor-pointer p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100?img=65"
              alt="Mohamed Douadi"
              className="h-12 w-12 rounded-2xl border border-white object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-black">Mohamed Douadi</p>
              <p className="text-xs text-slate/80">mohameddouadi@gmail.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
