import type { ReactNode } from "react";

export interface NavigationLink {
  key: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  target?: string;
}

export interface NavItem {
  key: string;
  icon: ReactNode;
  path?: string;
  new?: boolean;
  target?: string;
  subItems?: NavigationLink[];
}

// Match descendants without confusing /products with /products-other.
export function matchesNavigationPath(pathname: string, path: string): boolean {
  return pathname === path || (path !== "/" && pathname.startsWith(path + "/"));
}
