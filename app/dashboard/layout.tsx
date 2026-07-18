import BottomNav from "@/components/dashboard/BottomNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-140 flex-col px-6 pb-28 sm:pb-28">
      <DashboardHeader />
      <div className="flex-1">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
