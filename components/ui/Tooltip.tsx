"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

const Tooltip = ({ label, children, side = "bottom" }: TooltipProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const updatePosition = () => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 8;

    const positions = {
      top: {
        top: rect.top - gap,
        left: rect.left + rect.width / 2,
      },
      right: {
        top: rect.top + rect.height / 2,
        left: rect.right + gap,
      },
      bottom: {
        top: rect.bottom + gap,
        left: rect.left + rect.width / 2,
      },
      left: {
        top: rect.top + rect.height / 2,
        left: rect.left - gap,
      },
    };

    setPosition(positions[side]);
  };

  useEffect(() => {
    if (!isVisible) return;

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isVisible, side]);

  const transformClasses = {
    top: "-translate-x-1/2 -translate-y-full",
    right: "-translate-y-1/2",
    bottom: "-translate-x-1/2",
    left: "-translate-x-full -translate-y-1/2",
  };

  const arrowClasses = {
    top: `
      left-1/2 top-full -translate-x-1/2
      border-x-[5px] border-t-[5px]
      border-x-transparent border-t-ink
    `,
    right: `
      right-full top-1/2 -translate-y-1/2
      border-y-[5px] border-r-[5px]
      border-y-transparent border-r-ink
    `,
    bottom: `
      bottom-full left-1/2 -translate-x-1/2
      border-x-[5px] border-b-[5px]
      border-x-transparent border-b-ink
    `,
    left: `
      left-full top-1/2 -translate-y-1/2
      border-y-[5px] border-l-[5px]
      border-y-transparent border-l-ink
    `,
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={() => {
          updatePosition();
          setIsVisible(true);
        }}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => {
          updatePosition();
          setIsVisible(true);
        }}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            style={{
              top: position.top,
              left: position.left,
            }}
            className={`
              pointer-events-none fixed z-[9999]
              ${transformClasses[side]}
              whitespace-nowrap rounded-md bg-ink
              px-2.5 py-1.5 text-xs font-medium text-white
              shadow-md
            `}
          >
            {label}

            <span className={`absolute h-0 w-0 ${arrowClasses[side]}`} />
          </div>,
          document.body,
        )}
    </>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
