import { ComponentType } from "react";
import {
  IconDashboard,
  IconWorkout,
  IconNutrition,
  IconProgress,
  IconSettings,
  IconCheckin,
} from "./icons";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export const sidebarNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { href: "/dashboard/workout-schedules", label: "Workout", icon: IconWorkout },
  { href: "/dashboard/attendances", label: "Check-in", icon: IconCheckin },
  { href: "/nutrisi", label: "Nutrition", icon: IconNutrition },
  { href: "/progress", label: "Progress", icon: IconProgress },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

// Bottom nav mirrors the sidebar but splits around the center action button.
export const bottomNavLeft: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { href: "/dashboard/workout-schedules", label: "Workout", icon: IconWorkout },
  { href: "/dashboard/attendances", label: "Check-in", icon: IconCheckin },
];

export const bottomNavRight: NavItem[] = [
  { href: "/nutrisi", label: "Nutrition", icon: IconNutrition },
  { href: "/progress", label: "Progress", icon: IconProgress },
];
