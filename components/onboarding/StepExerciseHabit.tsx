import StepShell from "./StepShell";
import { Chip, ChipGroup } from "@/components/ui/Chip";
import AddChipInput from "@/components/ui/AddChipInput";
import Segmented from "@/components/ui/Segmented";
import { OnboardingData } from "./types";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
  error?: string;
}

const SPORT_TYPES = ["Gym / Weight lifting", "Running", "Yoga", "Swimming", "Cycling"];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function StepExerciseHabit({ data, update, onNext, onBack, loading, error }: Props) {
  return (
    <StepShell
      stepTag="STEP 4 OF 5"
      title="Your exercise habits"
      sub="So the AI workout schedule fits your daily routine."
      onNext={onNext}
      onBack={onBack}
      nextLabel="Analyze"
      nextLoading={loading}
    >
      {error && (
        <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
          {error}
        </div>
      )}

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
        {data.sportTypes
          .filter((item) => !SPORT_TYPES.includes(item))
          .map((item) => (
            <Chip
              key={item}
              label={item}
              selected={true}
              onClick={() => update({ sportTypes: data.sportTypes.filter((v) => v !== item) })}
            />
          ))}
      </ChipGroup>
      <AddChipInput
        onAdd={(v) => update({ sportTypes: [...data.sportTypes, v] })}
        placeholder="Type an exercise and press Enter..."
      />

      <label className="mb-2.5 mt-5 block text-[13px] font-semibold text-ink">
        Preferred workout time
      </label>
      <Segmented
        options={["Morning", "Afternoon", "Evening"]}
        value={data.timeOfDay}
        onChange={(v) => update({ timeOfDay: v as OnboardingData["timeOfDay"] })}
      />

      <label className="mb-1.75 mt-5 block text-[13px] font-semibold text-ink">Injuries (optional)</label>
      <textarea
        id="injuries"
        placeholder="e.g. lower back pain, knee injury, shoulder issues"
        value={data.injuries}
        onChange={(e) => update({ injuries: e.target.value })}
        rows={3}
        className="mb-4.5 w-full rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 py-3.25 font-sans text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-white resize-none"
      />
    </StepShell>
  );
}
