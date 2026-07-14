import SportNav from "@/components/SportNav";
import PublicFooter from "@/components/PublicFooter";
import PublicNavigationTracker from "@/components/PublicNavigationTracker";
import RoleGate from "@/components/RoleGate";

export default function SportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate>
      <div className="sport-bg flex min-h-dvh flex-col text-frost">
        <PublicNavigationTracker />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <PublicFooter />
        <SportNav />
      </div>
    </RoleGate>
  );
}
