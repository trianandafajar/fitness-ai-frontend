"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Modal, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/Modal";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer";
import { AlertTriangle, Menu, Users, X } from "lucide-react";
import { LayoutDashboard, Dumbbell, Apple, FolderOpen, LogOut, Loader2 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users-management", label: "Users Management", icon: Users },
  { href: "/admin/exercise-categories", label: "Ex. Categories", icon: FolderOpen },
  { href: "/admin/food-categories", label: "Food Categories", icon: FolderOpen },
  { href: "/admin/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/admin/foods", label: "Foods", icon: Apple },

];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/admin/login");
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  }

  const navLinks = (onClick?: () => void) =>
    NAV_ITEMS.map((item) => {
      const active = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active
            ? "bg-orange/10 text-orange-deep"
            : "text-ink-soft hover:bg-surface hover:text-ink"
            }`}
        >
          <item.icon size={18} />
          {item.label}
        </Link>
      );
    });

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-line bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileNav(true)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition hover:bg-surface hover:text-ink md:hidden"
            >
              <Menu size={20} />
            </button>
            <Link href="/admin" className="font-display text-base font-bold text-ink">
              FitnessAI <span className="text-orange">Admin</span>
            </Link>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-surface hover:text-ink"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl gap-6 p-4">
        <aside className="sticky top-14 hidden h-fit w-48 shrink-0 md:block">
          <nav className="space-y-1">{navLinks()}</nav>
        </aside>

        <main className="flex-1 py-2">{children}</main>
      </div>

      <Drawer open={showMobileNav} onOpenChange={setShowMobileNav} side="left" dismissible>
        <DrawerContent showHandle={false}>
          <DrawerHeader className="flex-row items-center justify-between border-b border-line">
            <DrawerTitle className="font-display text-base font-bold">
              FitnessAI <span className="text-orange">Admin</span>
            </DrawerTitle>
            <button
              type="button"
              onClick={() => setShowMobileNav(false)}
              aria-label="Close navigation menu"
              className="rounded-lg p-1.5 text-ink-soft transition hover:bg-surface hover:text-ink"
            >
              <X size={18} />
            </button>
          </DrawerHeader>
          <DrawerBody className="pt-4">
            <nav className="space-y-1">{navLinks(() => setShowMobileNav(false))}</nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <ModalHeader className="items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
            <AlertTriangle size={24} />
          </div>
          <ModalTitle className="font-display text-xl">Logout?</ModalTitle>
          <p className="max-w-sm text-sm leading-6 text-ink-soft">
            You will be signed out of your account.
          </p>
        </ModalHeader>
        <ModalFooter>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="w-full rounded-xl border-[1.5px] border-line bg-card px-4 py-3 text-sm font-semibold text-ink transition hover:border-ink-faint"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 text-sm font-semibold text-white transition hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
