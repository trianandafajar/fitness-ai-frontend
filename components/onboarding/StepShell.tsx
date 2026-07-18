import { type ReactNode } from "react";

interface StepShellProps {
  stepTag: string;
  title: string;
  sub: string;
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
}

export default function StepShell({
  stepTag,
  title,
  sub,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  nextLoading = false,
}: StepShellProps) {
  return (
    <div className="flex flex-1 flex-col pb-28">
      <div className="mb-2 text-[12.5px] font-semibold tracking-wide text-orange-deep">
        {stepTag}
      </div>
      <h1 className="mb-1.5 font-display text-[22px] font-bold tracking-tight sm:text-2xl">
        {title}
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-ink-soft">{sub}</p>

      <div className="flex-1">{children}</div>

      <div className="fixed inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-100 items-center gap-3 px-5 py-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-line bg-white px-3.25 text-[14px] font-semibold text-ink transition-colors hover:border-ink-faint"
            >
              Back
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || nextLoading}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-[10px] bg-orange px-3.5 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(217,68,10,0.15)] transition-all hover:bg-orange-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {nextLoading ? "Saving..." : nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
