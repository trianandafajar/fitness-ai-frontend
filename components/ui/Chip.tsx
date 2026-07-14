interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer select-none rounded-full border-[1.5px] px-4 py-2.25 text-[13.5px] font-medium transition-colors ${
        selected
          ? "border-orange bg-orange-tint font-semibold text-orange-deep"
          : "border-line bg-white text-ink-soft hover:border-orange"
      }`}
    >
      {label}
    </button>
  );
}

export function ChipGroup({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 flex flex-wrap gap-2.25">{children}</div>;
}
