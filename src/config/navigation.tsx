import { BoxCubeIcon, GridIcon, GroupIcon, PieChartIcon, UserCircleIcon } from "@/icons";
import { ecommerceNavigation } from "@/modules/ecommerce/navigation";
import { administrationNavigation } from "@/modules/administration/navigation";
import type { NavItem } from "./navigation-types";

export const navItems: NavItem[] = [
  { key: "dashboard", icon: <GridIcon />, path: "/" },
  { key: "ecommerce", icon: <BoxCubeIcon />, subItems: ecommerceNavigation },
  { key: "reports", icon: <PieChartIcon />, path: "/reports" },
  { key: "administration", icon: <GroupIcon />, subItems: administrationNavigation },
];

export const othersItems: NavItem[] = [
  { key: "userProfile", icon: <UserCircleIcon />, path: "/profile" },
];
