import StepShell from "./StepShell";
import { Chip, ChipGroup } from "@/components/ui/Chip";
import Segmented from "@/components/ui/Segmented";
import { OnboardingData } from "./types";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SPORT_TYPES = ["Gym / Weight lifting", "Running", "Yoga", "Swimming", "Cycling"];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function StepExerciseHabit({ data, update, onNext, onBack }: Props) {
  return (
    <StepShell
      stepTag="STEP 4 OF 5"
      title="Your exercise habits"
      sub="So the AI workout schedule fits your daily routine."
      onNext={onNext}
      onBack={onBack}
      nextLabel="Analyze"
    >
      <label className="mb-2.5 block text-[13px] font-semibold text-ink">
        How many days per week?
      </label>
      <Segmented
        className="mb-5"
        options={["1-2", "3-4", "5+"]}
        value={data.daysPerWeek}
        onChange={(v) => update({ daysPerWeek: v as OnboardingData["daysPerWeek"] })}
      />

      <label className="mb-2.5 block text-[13px] font-semibold text-ink">
        Favorite exercise types
      </label>
      <ChipGroup>
        {SPORT_TYPES.map((sport) => (
          <Chip
            key={sport}
            label={sport}
            selected={data.sportTypes.includes(sport)}
            onClick={() => update({ sportTypes: toggle(data.sportTypes, sport) })}
          />
        ))}
      </ChipGroup>

      <label className="mb-2.5 mt-5 block text-[13px] font-semibold text-ink">
        Preferred workout time
      </label>
      <Segmented
        options={["Morning", "Afternoon", "Evening"]}
        value={data.timeOfDay}
        onChange={(v) => update({ timeOfDay: v as OnboardingData["timeOfDay"] })}
      />
    </StepShell>
  );
}
