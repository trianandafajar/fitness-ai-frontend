import { APP_BRAND } from "@/lib/app-config";

export default function Logo() {
    const prefix = "Fitness"
    const suffix = APP_BRAND.startsWith(prefix) ? APP_BRAND.slice(prefix.length) : ""

    return (
        <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                        d="M3 12h4l2-7 4 14 2-7h6"
                        stroke="white"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <div className="font-display text-lg font-bold tracking-tight">
                {prefix}<span className="text-orange">{suffix}</span>
            </div>
        </div>
    );
}
