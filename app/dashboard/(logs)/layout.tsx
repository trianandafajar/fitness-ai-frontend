"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LOG_TABS = [
  { href: "/dashboard/weight-logs", label: "Weight Logs" },
  { href: "/dashboard/meal-logs", label: "Meal Logs" },
];

export default function LogsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeHref = pathname === "/dashboard/meal-logs"
    ? "/dashboard/meal-logs"
    : "/dashboard/weight-logs";

  return (
    <>
      <div className="sticky top-20 z-30 -mx-6 mb-6 bg-white px-6 py-2">
        <div className="flex rounded-xl bg-surface p-1">
        {LOG_TABS.map((tab) => {
          const active = tab.href === activeHref;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors sm:text-sm ${
                active
                  ? "bg-orange text-white shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
        </div>
      </div>
      {children}
    </>
  );
}
