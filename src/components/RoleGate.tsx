"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getRoleRouteRedirect } from "@/lib/role-access";
import { useRoleSession } from "@/lib/RoleStore";

export default function RoleGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, role } = useRoleSession();
  const redirect = loading ? null : getRoleRouteRedirect(role, pathname);

  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  if (loading || redirect) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6 text-sm text-steel" role="status">
        {loading ? "Preparing demo session…" : "Redirecting…"}
      </div>
    );
  }

  return <>{children}</>;
}
