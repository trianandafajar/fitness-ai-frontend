import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageContainer from "@/components/ui/PageContainer";

interface LegalPageProps {
    title: string;
    updated: string;
    children: ReactNode;
}

export default function LegalPage({ title, updated, children }: LegalPageProps) {
    return (
        <PageContainer className="px-6 py-8 sm:py-10">
            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/register"
                    aria-label="Back to register"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line text-ink-soft transition-colors hover:bg-surface hover:text-ink"
                >
                    <ArrowLeft className="h-4.5 w-4.5" />
                </Link>
                <div>
                    <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
                    <p className="text-[13.5px] text-ink-soft">Last updated: {updated}</p>
                </div>
            </div>
            <div className="space-y-5">{children}</div>
        </PageContainer>
    );
}
