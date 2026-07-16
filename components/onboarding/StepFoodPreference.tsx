import StepShell from "./StepShell";
import { Chip, ChipGroup } from "@/components/ui/Chip";
import AddChipInput from "@/components/ui/AddChipInput";
import { OnboardingData } from "./types";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
  error?: string;
}

const FAVORITE_FOODS = ["Nasi Padang", "Ayam Geprek", "Sate", "Soto", "Salad", "Gado-gado"];
const DIETARY_RESTRICTIONS = ["Halal", "Vegetarian", "Vegan", "No dairy", "Gluten-free"];
const ALLERGIES_ITEMS = ["Seafood", "Peanuts", "Soy", "Eggs", "Wheat", "Dairy"];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function StepFoodPreference({ data, update, onNext, onBack, loading, error }: Props) {
  return (
    <StepShell
      stepTag="STEP 3 OF 5"
      title="Food preferences"
      sub="The AI will prioritize your favorite foods when suggesting meal plans."
      onNext={onNext}
      onBack={onBack}
      nextLoading={loading}
    >
      {error && (
        <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
          {error}
        </div>
      )}

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
        {data.favoriteFoods
          .filter((item) => !FAVORITE_FOODS.includes(item))
          .map((item) => (
            <Chip
              key={item}
              label={item}
              selected={true}
              onClick={() => update({ favoriteFoods: data.favoriteFoods.filter((v) => v !== item) })}
            />
          ))}
      </ChipGroup>
      <AddChipInput
        onAdd={(v) => update({ favoriteFoods: [...data.favoriteFoods, v] })}
        placeholder="Type a food and press Enter..."
      />

      <label className="mb-2.5 mt-5 block text-[13px] font-semibold text-ink">Dietary restrictions</label>
      <ChipGroup>
        {DIETARY_RESTRICTIONS.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={data.restrictions.includes(item)}
            onClick={() => update({ restrictions: toggle(data.restrictions, item) })}
          />
        ))}
        {data.restrictions
          .filter((item) => !DIETARY_RESTRICTIONS.includes(item))
          .map((item) => (
            <Chip
              key={item}
              label={item}
              selected={true}
              onClick={() => update({ restrictions: data.restrictions.filter((v) => v !== item) })}
            />
          ))}
      </ChipGroup>
      <AddChipInput
        onAdd={(v) => update({ restrictions: [...data.restrictions, v] })}
        placeholder="Type a restriction and press Enter..."
      />

      <label className="mb-2.5 mt-5 block text-[13px] font-semibold text-ink">Allergies</label>
      <ChipGroup>
        {ALLERGIES_ITEMS.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={data.allergies.includes(item)}
            onClick={() => update({ allergies: toggle(data.allergies, item) })}
          />
        ))}
        {data.allergies
          .filter((item) => !ALLERGIES_ITEMS.includes(item))
          .map((item) => (
            <Chip
              key={item}
              label={item}
              selected={true}
              onClick={() => update({ allergies: data.allergies.filter((v) => v !== item) })}
            />
          ))}
      </ChipGroup>
      <AddChipInput
        onAdd={(v) => update({ allergies: [...data.allergies, v] })}
        placeholder="Type an allergy and press Enter..."
      />

      <label className="mb-1.75 mt-5 block text-[13px] font-semibold text-ink">Medical conditions (optional)</label>
      <textarea
        id="medicalConditions"
        placeholder="e.g. diabetes, hypertension, thyroid issues"
        value={data.medicalConditions}
        onChange={(e) => update({ medicalConditions: e.target.value })}
        rows={3}
        className="mb-4.5 w-full rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 py-3.25 font-sans text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-white resize-none"
      />
    </StepShell>
  );
}
