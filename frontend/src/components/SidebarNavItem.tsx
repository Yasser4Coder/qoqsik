import { NavLink as RouterNavLink } from "react-router-dom";
import type { SidebarLink } from "../data/navigation.ts";

type SidebarNavItemProps = {
  item: SidebarLink;
  collapsed?: boolean;
};

const containerClasses = (active: boolean, collapsed: boolean) =>
  `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
    active
      ? "bg-white text-black shadow-panel shadow-slate-200/30"
      : "text-black hover:bg-white/70 hover:text-black"
  } ${collapsed ? "justify-center" : "gap-3"}`;

const iconClasses = (active: boolean) =>
  `flex items-center justify-center rounded-xl ${
    active ? "text-black" : "bg-white text-black"
  }`;

function InnerContent({
  active,
  label,
  Icon,
  collapsed,
}: {
  active: boolean;
  label: string;
  Icon: SidebarLink["icon"];
  collapsed: boolean;
}) {
  return (
    <>
      <span className={iconClasses(active)}>
        <Icon size={20} />
      </span>
      {!collapsed && label}
    </>
  );
}

export function SidebarNavItem({
  item,
  collapsed = false,
}: SidebarNavItemProps) {
  const Icon = item.icon;

  if (item.path) {
    return (
      <RouterNavLink
        to={item.path}
        className={({ isActive }) => containerClasses(isActive, collapsed)}
        end={item.path === "/dashboard"}
      >
        {({ isActive }) => (
          <InnerContent
            active={isActive}
            label={item.label}
            Icon={Icon}
            collapsed={collapsed}
          />
        )}
      </RouterNavLink>
    );
  }

  const active = Boolean(item.isPrimary);
  return (
    <button className={containerClasses(active, collapsed)}>
      <InnerContent
        active={active}
        label={item.label}
        Icon={Icon}
        collapsed={collapsed}
      />
    </button>
  );
}
