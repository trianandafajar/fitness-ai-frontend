interface SegmentedProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Segmented({ options, value, onChange, className = "" }: SegmentedProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex-1 cursor-pointer rounded-[10px] border-[1.5px] px-3 py-3 font-sans text-[13.5px] font-semibold transition-colors ${
              selected
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink-soft hover:border-ink-faint"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
