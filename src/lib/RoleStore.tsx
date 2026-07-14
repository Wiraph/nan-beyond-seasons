"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { parseStoredDemoRole, type DemoRole } from "@/lib/role-access";

export const DEMO_ROLE_STORAGE_KEY = "nan-game-on:demo-role";

type RoleSession = {
  loading: boolean;
  role: DemoRole | null;
  selectRole: (role: DemoRole) => void;
  logout: () => void;
};

const RoleContext = createContext<RoleSession | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<DemoRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrationId = window.setTimeout(() => {
      try {
        setRole(parseStoredDemoRole(window.localStorage.getItem(DEMO_ROLE_STORAGE_KEY)));
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(hydrationId);
  }, []);

  const selectRole = (nextRole: DemoRole) => {
    setRole(nextRole);
    try {
      window.localStorage.setItem(DEMO_ROLE_STORAGE_KEY, JSON.stringify(nextRole));
    } catch {
      // The in-memory demo role remains usable when browser storage is unavailable.
    }
  };

  const logout = () => {
    setRole(null);
    try {
      window.localStorage.removeItem(DEMO_ROLE_STORAGE_KEY);
    } catch {
      // Clearing in-memory state still ends the current demo session.
    }
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
