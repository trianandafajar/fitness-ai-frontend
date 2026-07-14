import Logo from "@/components/auth/Logo";
import ProgressRing from "./ProgressRing";

export default function OnboardingHeader({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-9 flex items-center justify-between">
      <Logo />
      <ProgressRing step={step} total={total} />
    </div>
  );
}
