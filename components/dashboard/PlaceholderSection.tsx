import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";

export default function PlaceholderSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="md:flex">
      <Sidebar />
      <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 px-6 pb-28 text-center md:pb-10">
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft">{description}</p>
      </main>
      <BottomNav />
    </div>
  );
}
