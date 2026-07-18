import { Scale, Dumbbell, Heart, Activity, Zap, Feather, Target } from "lucide-react";
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
  { id: "general-fitness", icon: <Activity className="h-5 w-5" />, title: "General Fitness", description: "Stay healthy and active every day" },
  { id: "strength", icon: <Zap className="h-5 w-5" />, title: "Strength Training", description: "Increase raw strength and power" },
  { id: "flexibility", icon: <Feather className="h-5 w-5" />, title: "Flexibility & Mobility", description: "Improve range of motion and posture" },
  { id: "toning", icon: <Target className="h-5 w-5" />, title: "Toning / Body Recomp", description: "Sculpt your body and reduce body fat" },
];

const GOALS_WITH_WEIGHT: OnboardingData["goal"][] = ["weight-loss", "muscle-gain", "toning"];

export default function StepBodyGoal({ data, update, onNext, onBack, loading, error }: Props) {
  const needsWeight = GOALS_WITH_WEIGHT.includes(data.goal);
  const canProceed = !needsWeight || data.goalWeight.trim().length > 0;

  return (
    <StepShell
      stepTag="STEP 4 OF 5"
      title="Goal Setting"
      sub="Set your fitness goal — lose weight, build muscle, or boost endurance."
      onNext={onNext}
      onBack={onBack}
      nextLabel="Analyze"
      nextDisabled={!canProceed}
      nextLoading={loading}
    >
      {error && (
        <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
          {error}
        </div>
      )}

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

      {needsWeight && (
        <Field
          id="goalWeight"
          label="Goal weight (kg)"
          type="number"
          placeholder="70"
          value={data.goalWeight}
          onChange={(e) => update({ goalWeight: e.target.value })}
        />
      )}
    </StepShell>
  );
}
