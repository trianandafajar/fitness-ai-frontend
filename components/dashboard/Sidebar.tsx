"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/auth/Logo";
import { sidebarNavItems } from "./navItems";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 flex-shrink-0 flex-col border-r border-line px-[18px] py-6 md:flex">
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
              className={`flex items-center gap-[11px] rounded-[10px] px-3 py-[11px] text-sm font-semibold transition-colors ${
                active
                  ? "bg-orange-tint text-orange-deep"
                  : "text-ink-soft hover:bg-surface hover:text-ink"
              }`}
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2.5">
          <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-orange font-display text-sm font-bold text-white">
            F
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ink">Farid</div>
            <div className="text-[11.5px] text-ink-soft">Intermediate</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
