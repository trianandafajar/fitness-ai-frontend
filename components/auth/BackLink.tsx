import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-soft hover:text-orange-deep"
    >
      <ArrowLeft className="w-5"/>{children}
    </Link>
  );
}
