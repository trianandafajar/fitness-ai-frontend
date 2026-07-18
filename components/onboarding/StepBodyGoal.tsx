import { Scale, Dumbbell, Heart } from "lucide-react";
import Field from "@/components/ui/Field";
import StepShell from "./StepShell";
import GoalCard from "./GoalCard";
import { OnboardingData, ACTIVITY_OPTIONS } from "./types";
import type { ReactNode } from "react";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
  error?: string;
}

const GOALS: { id: OnboardingData["goal"]; icon: ReactNode; title: string; description: string }[] = [
  { id: "weight-loss", icon: <Scale className="h-5 w-5" />, title: "Lose weight", description: "Focus on calorie deficit & cardio" },
  { id: "muscle-gain", icon: <Dumbbell className="h-5 w-5" />, title: "Build muscle", description: "Focus on weight training & protein surplus" },
  { id: "endurance", icon: <Heart className="h-5 w-5" />, title: "Boost endurance", description: "Focus on cardio & endurance training" },
];

export default function StepBodyGoal({ data, update, onNext, onBack, loading, error }: Props) {
  const canProceed = data.height.trim().length > 0 && data.weight.trim().length > 0;

  return (
    <StepShell
      stepTag="STEP 2 OF 5"
      title="Your body & goal"
      sub="Used to calculate your BMI, BMR, and create a realistic plan."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!canProceed}
      nextLoading={loading}
    >
      {error && (
        <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
          {error}
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-4">
        <Field
          id="height"
          label="Height (cm)"
          type="number"
          placeholder="170"
          value={data.height}
          onChange={(e) => update({ height: e.target.value })}
        />
        <Field
          id="weight"
          label="Weight (kg)"
          type="number"
          placeholder="65"
          value={data.weight}
          onChange={(e) => update({ weight: e.target.value })}
        />
      </div>

      <label className="mb-2.5 block text-[13px] font-semibold text-ink">Your main goal</label>
      {GOALS.map((g) => (
        <GoalCard
          key={g.id}
          icon={g.icon}
          title={g.title}
          description={g.description}
          selected={data.goal === g.id}
          onClick={() => update({ goal: g.id })}
        />
      ))}

      <label className="mb-2.5 mt-5 block text-[13px] font-semibold text-ink">Activity level</label>
      <div className="mb-5 grid grid-cols-3 gap-2">
        {ACTIVITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => update({ activityLevel: opt.value })}
            className={`rounded-[10px] border-[1.5px] px-3 py-2.5 text-center text-[13px] font-semibold transition-colors ${data.activityLevel === opt.value
              ? "border-orange bg-orange text-white"
              : "border-line bg-white text-ink-soft hover:border-ink-faint"
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <Field
        id="goalWeight"
        label="Goal weight (kg) — optional"
        type="number"
        placeholder="70"
        value={data.goalWeight}
        onChange={(e) => update({ goalWeight: e.target.value })}
      />
    </StepShell>
  );
}
