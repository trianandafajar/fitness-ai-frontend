import { ComponentType } from "react";
import {
  IconDashboard,
  IconWorkout,
  IconProgress,
  IconMealPlan,
  IconKpi,
} from "./icons";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  matchPaths?: string[];
}

export const bottomNavAll: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: IconDashboard,
    matchPaths: [
      "/dashboard",
      "/dashboard/day"
    ]
  },
  {
    href: "/dashboard/workout-schedules",
    label: "Workout",
    icon: IconWorkout,
  },
  {
    href: "/dashboard/meal-schedules",
    label: "Meal Plan",
    icon: IconMealPlan,
  },
  {
    href: "/dashboard/weight-logs",
    label: "Logs",
    icon: IconProgress,
    matchPaths: [
      "/dashboard/weight-logs",
      "/dashboard/meal-logs",
    ],
  },
  {
    href: "/dashboard/kpi-history",
    label: "KPI",
    icon: IconKpi,
  },
];