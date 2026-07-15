import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex">
      <Sidebar />
      <main className="min-h-screen flex-1 px-5 pb-28 pt-6 sm:px-6 md:px-10 md:pb-10 md:pt-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
