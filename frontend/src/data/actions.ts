import { type IconType } from "react-icons";
import {
  PiPenNibLight,
  PiNewspaperClippingLight,
  PiImagesThin,
  PiChartBarLight,
  PiMagnifyingGlassLight,
  PiCodesandboxLogoLight,
} from "react-icons/pi";

export type ActionTile = {
  title: string;
  description: string;
  icon: IconType;
};

export const quickActions: ActionTile[] = [
  {
    title: "Write Copy",
    description: "Craft compelling text for ads and emails.",
    icon: PiPenNibLight,
  },
  {
    title: "Generate Article",
    description: "Write articles on any topic instantly.",
    icon: PiNewspaperClippingLight,
  },
  {
    title: "Image Generation",
    description: "Design custom visuals with AI.",
    icon: PiImagesThin,
  },
  {
    title: "Data Analytics",
    description: "Analyze data with AI-driven insights.",
    icon: PiChartBarLight,
  },
  {
    title: "Research",
    description: "Quickly gather and summarize info.",
    icon: PiMagnifyingGlassLight,
  },
  {
    title: "Generate Code",
    description: "Produce accurate code fast.",
    icon: PiCodesandboxLogoLight,
  },
];
