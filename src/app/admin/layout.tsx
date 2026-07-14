import ManagementShell from "@/components/ManagementShell";
import RoleGate from "@/components/RoleGate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate>
      <ManagementShell role="admin">{children}</ManagementShell>
    </RoleGate>
  );
}
