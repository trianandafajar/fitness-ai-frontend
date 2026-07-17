import BottomNav from "@/components/dashboard/BottomNav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-140 flex-col px-6 py-8 pb-28 sm:py-10 sm:pb-28">
      <div className="flex-1">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
