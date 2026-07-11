import SportNav from "@/components/SportNav";

export default function SportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sport-bg flex min-h-dvh flex-col text-frost">
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <SportNav />
    </div>
  );
}
