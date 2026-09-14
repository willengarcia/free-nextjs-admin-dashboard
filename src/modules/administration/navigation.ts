import type { NavigationLink } from "@/config/navigation-types";

// Presentation routes only; this manifest does not grant API permissions.
export const administrationNavigation: NavigationLink[] = [
  {
    "key": "users",
    "path": "/administration/users"
  },
  {
    "key": "permissions",
    "path": "/administration/permissions"
  },
  {
    "key": "settings",
    "path": "/administration/settings"
  }
];
