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
      </div>

      {!collapsed && (
        <div className="space-y-3">
          <div className="bg-transparent flex justify-center items-center pb-6">
            <img
              src="/logo.png"
              alt="logo"
              className="w-[90%] object-contain"
            />
          </div>
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
