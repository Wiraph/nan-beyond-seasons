import ManagementShell from "@/components/ManagementShell";
import RoleGate from "@/components/RoleGate";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate>
      <ManagementShell role="organizer">{children}</ManagementShell>
    </RoleGate>
  );
}
