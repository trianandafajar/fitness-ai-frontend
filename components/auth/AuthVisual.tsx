interface StatCard {
    label: string;
    value: string;
}

interface AuthVisualProps {
    tag: string;
    heading: string;
    sub: string;
    stats?: StatCard[];
}

export default function AuthVisual({ tag, heading, sub, stats }: AuthVisualProps) {
    return (
        <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-linear-to-br from-orange to-orange-deep p-12 md:flex">
            <svg
                className="absolute inset-0 z-1 h-full w-full opacity-55"
                viewBox="0 0 500 500"
                preserveAspectRatio="none"
            >
                <path
                    className="fill-none stroke-white/90 stroke-2 animate-draw-pulse"
                    style={{ strokeDasharray: 1400, strokeDashoffset: 1400 }}
                    d="M0,260 L60,260 L80,180 L100,340 L120,90 L140,380 L160,260 L220,260 L240,220 L260,260 L500,260"
                />
            </svg>

            <div className="relative z-2 w-full max-w-95 text-left">
                <div className="mb-5 inline-block rounded-full bg-white/16 px-3 py-1.25 text-xs font-semibold tracking-wide text-white">
                    {tag}
                </div>
                <div className="mb-35 font-display text-[26px] font-bold leading-[1.3] tracking-tight text-white">
                    {heading}
                </div>
                <div className="mb-8 text-[14.5px] leading-relaxed text-white/85">{sub}</div>

                {stats && stats.length > 0 && (
                    <div className="relative z-2 flex flex-col gap-3">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex items-center justify-between rounded-xl border border-white/25 bg-white/[0.14] px-4 py-3.5 backdrop-blur-md"
                            >
                                <span className="text-[12.5px] font-medium text-white/85">
                                    {stat.label}
                                </span>
                                <span className="font-mono text-[17px] font-semibold text-white">
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
