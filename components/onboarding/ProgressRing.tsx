interface ProgressRingProps {
  step: number;
  total: number;
}

const RADIUS = 23;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing({ step, total }: ProgressRingProps) {
  const offset = CIRCUMFERENCE - CIRCUMFERENCE * (step / total);

  return (
    <div className="relative h-13 w-13">
      <svg viewBox="0 0 52 52" className="h-13 w-13 -rotate-90">
        <circle cx="26" cy="26" r={RADIUS} className="fill-none stroke-orange-tint" strokeWidth="5" />
        <circle
          cx="26"
          cy="26"
          r={RADIUS}
          className="fill-none stroke-orange transition-[stroke-dashoffset] duration-500 ease-out"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold text-ink">
        {step}/{total}
      </div>
    </div>
  );
}
