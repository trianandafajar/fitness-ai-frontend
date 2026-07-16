import { ComponentType } from "react";
import {
  IconDashboard,
  IconWorkout,
  IconNutrition,
  IconProgress,
  IconSettings,
  IconCheckin,
  IconMealPlan,
  IconKpi,
  IconNotification,
} from "./icons";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export const sidebarNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { href: "/dashboard/kpi-history", label: "KPI", icon: IconKpi },
  { href: "/dashboard/workout-schedules", label: "Workout", icon: IconWorkout },
  { href: "/dashboard/meal-schedules", label: "Meal Plan", icon: IconMealPlan },
  { href: "/dashboard/attendances", label: "Check-in", icon: IconCheckin },
  { href: "/dashboard/meal-logs", label: "Meal Log", icon: IconNutrition },
  { href: "/dashboard/weight-logs", label: "Weight", icon: IconProgress },
  { href: "/dashboard/notifications", label: "Notifications", icon: IconNotification },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

// Bottom nav mirrors the sidebar but splits around the center action button.
export const bottomNavLeft: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { href: "/dashboard/workout-schedules", label: "Workout", icon: IconWorkout },
  { href: "/dashboard/meal-schedules", label: "Meal Plan", icon: IconMealPlan },
];

export const bottomNavRight: NavItem[] = [
  { href: "/dashboard/meal-logs", label: "Meal Log", icon: IconNutrition },
  { href: "/dashboard/weight-logs", label: "Weight", icon: IconProgress },
  { href: "/dashboard/kpi-history", label: "KPI", icon: IconKpi },
];

export const bottomNavAll: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { href: "/dashboard/workout-schedules", label: "Workout", icon: IconWorkout },
  { href: "/dashboard/meal-schedules", label: "Meal Plan", icon: IconMealPlan },
  { href: "/dashboard/meal-logs", label: "Meal Log", icon: IconNutrition },
  { href: "/dashboard/weight-logs", label: "Weight", icon: IconProgress },
  { href: "/dashboard/kpi-history", label: "KPI", icon: IconKpi },
];
