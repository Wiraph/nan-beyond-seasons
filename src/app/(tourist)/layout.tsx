import BottomNav from "@/components/BottomNav";
import PublicFooter from "@/components/PublicFooter";
import PublicNavigationTracker from "@/components/PublicNavigationTracker";

export default function TouristLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <PublicNavigationTracker />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <PublicFooter />
      <BottomNav />
    </div>
  );
}
