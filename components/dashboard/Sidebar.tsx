"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/auth/Logo";
import { sidebarNavItems } from "./navItems";
import { authStore } from "@/stores/auth.store";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    authStore.getState,
  );

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line px-4.5 py-6 md:flex">
      <div className="mb-8 px-2">
        <Logo />
      </div>

      <nav className="flex flex-col gap-0.5">
        {sidebarNavItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-[2.75] rounded-[10px] px-3 py-[2.75] text-sm font-semibold transition-colors ${active
                ? "bg-orange-tint text-orange-deep"
                : "text-ink-soft hover:bg-surface hover:text-ink"
                }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2.5">
          <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-orange font-display text-sm font-bold text-white">
            {initial}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ink">{user?.name ?? "User"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
