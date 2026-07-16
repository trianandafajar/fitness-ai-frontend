import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex">
      <Sidebar />
      <main className="min-h-screen flex-1 px-5 pb-28 pt-6 sm:px-6 md:px-10 md:pb-10 md:pt-8">
        <div className="sticky top-0 z-10 -mx-5 -mt-6 bg-white px-5 pb-6 sm:-mx-6 sm:px-6 md:static md:mx-0 md:px-0 md:pb-0 md:mt-0">
          <DashboardHeader />
        </div>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
