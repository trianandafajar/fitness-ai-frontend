import { type ReactNode } from "react";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";

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
    <div className="flex flex-1 flex-col">
      <div className="mb-2 text-[12.5px] font-semibold tracking-wide text-orange-deep">
        {stepTag}
      </div>
      <h1 className="mb-1.5 font-display text-[22px] font-bold tracking-tight sm:text-2xl">
        {title}
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-ink-soft">{sub}</p>

      <div className="flex-1">{children}</div>

      <div className="mt-auto flex gap-3 pt-7">
        {onBack && (
          <ButtonSecondary
            type="button"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </ButtonSecondary>
        )}

        <ButtonPrimary
          type="button"
          onClick={onNext}
          disabled={nextDisabled || nextLoading}
          className="flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextLoading ? "Saving..." : nextLabel}
        </ButtonPrimary>
      </div>
    </div>
  );
}
