import type { ReactNode } from "react";

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

const Tooltip = ({ label, children, side = "bottom" }: TooltipProps) => {
  const positionClasses = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
  };

  const arrowClasses = {
    top: "left-1/2 top-full -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-ink",
    right:
      "right-full top-1/2 -translate-y-1/2 border-y-[5px] border-r-[5px] border-y-transparent border-r-ink",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-x-[5px] border-b-[5px] border-x-transparent border-b-ink",
    left: "left-full top-1/2 -translate-y-1/2 border-y-[5px] border-l-[5px] border-y-transparent border-l-ink",
  };

  return (
    <div className="group relative inline-flex">
      {children}

      <div
        role="tooltip"
        className={`
          pointer-events-none absolute
          ${positionClasses[side]}
          z-50 whitespace-nowrap rounded-md bg-ink
          px-2.5 py-1.5 text-xs font-medium text-white
          opacity-0 shadow-md scale-95
          transition-all duration-150
          group-hover:scale-100 group-hover:opacity-100
          group-focus-within:scale-100 group-focus-within:opacity-100
        `}
      >
        {label}

        <span className={`absolute h-0 w-0 ${arrowClasses[side]}`} />
      </div>
    </div>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
