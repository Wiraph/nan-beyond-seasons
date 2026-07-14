export type DemoRole = "user" | "organizer" | "admin";

export const ROLE_HOME: Record<DemoRole, string> = {
  user: "/",
  organizer: "/organizer",
  admin: "/admin",
};

export const ROLE_DISPLAY: Record<DemoRole, { label: string; title: string; description: string }> = {
  user: {
    label: "User",
    title: "นักท่องเที่ยว",
    description: "Follow events, collect passport stamps, and earn rewards.",
  },
  organizer: {
    label: "Organizer",
    title: "ผู้จัดงาน",
    description: "Manage your events and event check-ins.",
  },
  admin: {
    label: "Admin",
    title: "ผู้ดูแลระบบ",
    description: "Review events, organizers, and users.",
  },
};

export const ROLE_ROUTE_ALLOW_LIST: Record<DemoRole, readonly string[]> = {
  user: ["/", "/calendar", "/chat", "/checkin", "/events", "/passport", "/rewards"],
  organizer: ["/organizer"],
  admin: ["/admin"],
};

function normalizePathname(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function isDemoRole(value: unknown): value is DemoRole {
  return value === "user" || value === "organizer" || value === "admin";
}

export function isRoleRouteAllowed(role: DemoRole, pathname: string): boolean {
  const path = normalizePathname(pathname);

  return ROLE_ROUTE_ALLOW_LIST[role].some((allowedPath) => {
    if (allowedPath === "/") return path === "/";
    return path === allowedPath || path.startsWith(`${allowedPath}/`);
  });
}

export function getRoleRouteRedirect(role: DemoRole | null, pathname: string): string | null {
  if (!role) return "/login";
  return isRoleRouteAllowed(role, pathname) ? null : ROLE_HOME[role];
}
