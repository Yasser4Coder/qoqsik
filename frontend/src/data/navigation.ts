import type { IconType } from "react-icons";
import {
  TbSmartHome,
  TbFileDescription,
  TbUserPlus,
  TbCreditCard,
  TbDatabaseShare,
  TbSettingsCog,
} from "react-icons/tb";

export type SidebarLink = {
  label: string;
  icon: IconType;
  isPrimary?: boolean;
  path?: string;
};

export const primaryNav: SidebarLink[] = [
  {
    label: "Chat With AI",
    icon: TbSmartHome,
    isPrimary: true,
    path: "/dashboard",
  },
  {
    label: "Add Documents",
    icon: TbFileDescription,
    path: "/dashboard/documents",
  },
  { label: "Add employee", icon: TbUserPlus, path: "/dashboard/add-employee" },
  {
    label: "Subscription",
    icon: TbCreditCard,
    path: "/dashboard/subscription",
  },
  {
    label: "Data Sources",
    icon: TbDatabaseShare,
    path: "/dashboard/data-sources",
  },
];

export const secondaryNav: SidebarLink[] = [
  { label: "Settings", icon: TbSettingsCog },
];
