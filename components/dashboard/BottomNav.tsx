"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNavAll } from "./navItems";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-line bg-white">
      <div className="mx-auto flex w-full max-w-100 items-center justify-between px-5 py-2.5">
        {bottomNavAll.map(({ href, label, icon: Icon, matchPaths }) => {
          const active = matchPaths
            ? matchPaths.some((path) => pathname === path)
            : pathname === href;

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                active
                  ? "bg-orange text-white"
                  : "text-ink-faint hover:text-ink-soft"
              }`}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
