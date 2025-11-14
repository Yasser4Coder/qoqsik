import { useNavigate } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import { primaryNav, secondaryNav } from "../data/navigation.ts";
import { SidebarNavItem } from "./SidebarNavItem.tsx";
import { getAuthUser, logout } from "../lib/api.ts";

type SidebarProps = {
  collapsed?: boolean;
};

export function Sidebar({ collapsed = false }: SidebarProps) {
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };
  return (
    <aside
      className={`flex min-h-[95vh] flex-col shadow-2xl justify-between rounded-2xl bg-[#F3F3F3] p-4 transition-all duration-500 ${
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
        <div className="space-y-3">
          <div className="rounded-2xl bg-transparent p-4">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100?img=65"
                alt={user?.full_name || "User"}
                className="h-12 w-12 rounded-2xl border border-white object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black truncate">
                  {user?.full_name || "User"}
                </p>
                <p className="text-xs text-slate/80 truncate">
                  {user?.email || "email@example.com"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <span className="flex items-center justify-center rounded-xl">
              <TbLogout size={20} />
            </span>
            Logout
          </button>
        </div>
      )}
      {collapsed && (
        <button
          onClick={handleLogout}
          className="flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          title="Logout"
        >
          <TbLogout size={20} />
        </button>
      )}
    </aside>
  );
}
