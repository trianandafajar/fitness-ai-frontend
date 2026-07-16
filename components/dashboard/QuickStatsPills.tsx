interface StatItem {
  label: string;
  value: string;
  accent?: boolean;
}

interface QuickStatsPillsProps {
  items: StatItem[];
}

export default function QuickStatsPills({ items }: QuickStatsPillsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:px-0">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-2xl border p-4 ${item.accent
              ? "border-orange/30 bg-orange-tint"
              : "border-line bg-white"
            }`}
        >
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-soft">
            {item.label}
          </div>

          <div
            className={`mt-1 font-mono text-base font-semibold ${item.accent ? "text-orange-deep" : "text-ink"
              }`}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}