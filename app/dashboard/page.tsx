import { Flame, Footprints, Droplet, CheckCircle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ScoreGauge from "@/components/dashboard/ScoreGauge";
import StatMini from "@/components/dashboard/StatMini";
import AICheckin from "@/components/dashboard/AICheckin";
import TodayPlanCard from "@/components/dashboard/TodayPlanCard";
import KpiCard from "@/components/dashboard/KpiCard";

export default function DashboardPage() {
  return (
    <div className="md:flex">
      <Sidebar />

      <main className="min-h-screen flex-1 px-5 pb-28 pt-6 sm:px-6 md:px-10 md:pb-10 md:pt-8">
        <DashboardHeader name="Farid" dateLabel="Tuesday, 14 July 2026" streakDays={12} />

        {/* Row 1: score gauge + stat minis */}
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
          <ScoreGauge
            score={78}
            status="Good"
            note="Up 4 points from last week. Keep up your training consistency."
          />

          <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
            <StatMini label="Calories" icon={<Flame className="h-[16px] w-[16px]" />} value="1,850" total="2,000" percent={92} />
            <StatMini label="Steps" icon={<Footprints className="h-[16px] w-[16px]" />} value="8,500" total="10k" percent={85} />
            <StatMini label="Water" icon={<Droplet className="h-[16px] w-[16px]" />} value="1.6L" total="2L" percent={80} />
            <StatMini
              label="Workout"
              icon={<CheckCircle className="h-[16px] w-[16px]" />}
              value="Push Day"
              secondaryText="Done • 45 min"
            />
          </div>
        </div>

        <AICheckin message="Protein is sufficient today. Try adding green vegetables tomorrow for micronutrients. Good job keeping the calorie deficit steady!" />

        {/* Row 2: plan + KPI */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
          <TodayPlanCard
            badge="Push Day • Week 2"
            exercises={[
              { name: "Bench Press", meta: "4×8-10" },
              { name: "Overhead Press", meta: "3×10" },
              { name: "Incline Dumbbell Press", meta: "3×12" },
              { name: "Triceps Pushdown", meta: "3×15" },
            ]}
          />

          <KpiCard
            rows={[
              { label: "Workout Compliance", value: "85%", percent: 85, color: "bg-green-500" },
              { label: "Nutrition Score", value: "72", percent: 72, color: "bg-orange" },
              { label: "Weight Trend", value: "65", percent: 65, color: "bg-orange" },
              { label: "Consistency", value: "90%", percent: 90, color: "bg-green-500" },
              { label: "Engagement", value: "55%", percent: 55, color: "bg-amber-500" },
            ]}
            streak={[
              { label: "Mon", done: true },
              { label: "Tue", done: true },
              { label: "Wed", done: true },
              { label: "Thu", done: false },
              { label: "Fri", done: true },
              { label: "Sat", done: true },
              { label: "Sun", done: true },
            ]}
          />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
