"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNavLeft, bottomNavRight } from "./navItems";
import { IconPlus } from "./icons";
import { NavItem } from "./navItems";

function NavButton({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-label={item.label}
      className={`relative flex h-11 w-11 flex-col items-center justify-center gap-1.25 ${active ? "text-orange" : "text-ink-faint"
        }`}
    >
      <Icon className="h-5.25 w-5.25" />
      <span
        className={`h-1 w-1 rounded-full bg-orange transition-transform ${active ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
      />
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))] md:hidden">
      <div className="flex h-16.5 w-full max-w-105 items-center justify-between rounded-full bg-white px-3.5 shadow-[0_8px_24px_rgba(23,24,28,0.10),0_2px_6px_rgba(23,24,28,0.06)]">
        {bottomNavLeft.map((item) => (
          <NavButton key={item.href} item={item} active={pathname === item.href} />
        ))}

        <Link
          href="/log"
          aria-label="Add log"
          className="-mt-7.5 flex h-13.5 w-13.5 shrink-0 items-center justify-center rounded-full bg-orange shadow-[0_8px_16px_rgba(255,90,31,0.35),0_0_0_6px_#fff] transition-transform hover:scale-105"
        >
          <IconPlus />
        </Link>

        {bottomNavRight.map((item) => (
          <NavButton key={item.href} item={item} active={pathname === item.href} />
        ))}
      </div>
    </div>
  );
}
