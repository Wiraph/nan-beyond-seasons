"use client";

import { createContext, useContext, useState } from "react";
import type { DemoRole } from "@/lib/role-access";

type RoleSession = {
  loading: boolean;
  role: DemoRole | null;
  selectRole: (role: DemoRole) => void;
  logout: () => void;
};

const RoleContext = createContext<RoleSession | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<DemoRole | null>(null);
  const loading = false;

  const selectRole = (nextRole: DemoRole) => {
    setRole(nextRole);
  };

  const logout = () => {
    setRole(null);
  };

  return (
    <RoleContext.Provider value={{ loading, role, selectRole, logout }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleSession(): RoleSession {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRoleSession must be used within RoleProvider");
  return context;
}
