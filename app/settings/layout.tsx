import BottomNav from "@/components/dashboard/BottomNav";
import PageContainer from "@/components/ui/PageContainer";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer className="py-8 pb-28 sm:py-10 sm:pb-20 px-6">
      <div className="flex-1">
        {children}
      </div>
      <BottomNav />
    </PageContainer>
  );
}
