interface ScoreGaugeProps {
  score: number | null;
  status: string | null;
  note: string;
}

const ARC_LENGTH = 270;

function statusColor(status: string | null) {
  const s = status?.toLowerCase() ?? "";
  if (s.includes("excellent")) return "bg-green-100 text-green-700";
  if (s.includes("good")) return "bg-orange-tint text-orange-deep";
  if (s.includes("needs attention")) return "bg-amber-100 text-amber-700";
  return "bg-surface text-ink-soft";
}

export default function ScoreGauge({ score, status, note }: ScoreGaugeProps) {
  const displayScore = score != null ? score : 0;
  const offset = ARC_LENGTH - ARC_LENGTH * (Math.min(Math.max(displayScore, 0), 100) / 100);

  return (
    <div className="flex h-full flex-col items-center rounded-2xl border border-line bg-white p-5.5 text-center">
      <div className="mb-4 self-start text-[13px] font-bold uppercase tracking-wide text-ink-soft">
        Overall Score
      </div>
      <div className="relative mb-1.5 h-27.5 w-50">
        <svg viewBox="0 0 200 110" className="h-full w-full">
          <path
            d="M14,100 A86,86 0 0,1 186,100"
            fill="none"
            className="stroke-surface"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M14,100 A86,86 0 0,1 186,100"
            fill="none"
            className={`stroke-orange transition-[stroke-dashoffset] duration-700 ease-out ${score == null ? "opacity-30" : ""}`}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center font-mono text-4xl font-semibold text-ink">
          {score != null ? score : "—"}
        </div>
      </div>
      <span className={`mt-2.5 inline-block rounded-full px-3 py-1 text-xs font-bold ${statusColor(status)}`}>
        {status ?? "No data"}
      </span>
      <div className="mt-2.5 text-[12.5px] leading-relaxed text-ink-soft">{note}</div>
    </div>
  );
}
