import StepShell from "./StepShell";
import { Chip, ChipGroup } from "@/components/ui/Chip";
import { OnboardingData } from "./types";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FAVORITE_FOODS = ["Nasi Padang", "Ayam Geprek", "Sate", "Soto", "Salad", "Gado-gado"];
const RESTRICTIONS = ["Halal", "Vegetarian", "Seafood allergy", "Nut allergy"];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function StepFoodPreference({ data, update, onNext, onBack }: Props) {
  return (
    <StepShell
      stepTag="STEP 3 OF 5"
      title="Food preferences"
      sub="The AI will prioritize your favorite foods when suggesting meal plans."
      onNext={onNext}
      onBack={onBack}
    >
      <label className="mb-2.5 block text-[13px] font-semibold text-ink">Favorite foods</label>
      <ChipGroup>
        {FAVORITE_FOODS.map((food) => (
          <Chip
            key={food}
            label={food}
            selected={data.favoriteFoods.includes(food)}
            onClick={() => update({ favoriteFoods: toggle(data.favoriteFoods, food) })}
          />
        ))}
      </ChipGroup>

      <label className="mb-2.5 mt-5 block text-[13px] font-semibold text-ink">
        Restrictions / allergies
      </label>
      <ChipGroup>
        {RESTRICTIONS.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={data.restrictions.includes(item)}
            onClick={() => update({ restrictions: toggle(data.restrictions, item) })}
          />
        ))}
      </ChipGroup>
    </StepShell>
  );
}
