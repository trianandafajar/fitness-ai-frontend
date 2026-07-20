import Field from "@/components/ui/Field";
import Segmented from "@/components/ui/Segmented";
import StepShell from "./StepShell";
import { OnboardingData } from "./types";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  loading?: boolean;
  error?: string;
}

export default function StepPersonalInfo({ data, update, onNext, loading, error }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const dobError = data.dob.length > 0 && data.dob > today ? "Date of birth cannot be in the future." : "";
  const canProceed = data.name.trim().length > 0 && data.dob.length > 0 && !dobError && data.height.trim().length > 0 && data.weight.trim().length > 0;

  return (
    <StepShell
      stepTag="STEP 1 OF 5"
      title="Body Input"
      sub="Your name, date of birth, gender, height, and weight."
      onNext={onNext}
      nextDisabled={!canProceed}
      nextLoading={loading}
    >
      {error && (
        <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field
            id="name"
            label="Full name"
            type="text"
            placeholder="Your name"
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </div>
        <div>
          <Field
            id="dob"
            label="Date of birth"
            type="date"
            max={today}
            value={data.dob}
            onChange={(e) => update({ dob: e.target.value })}
          />
          {dobError && (
            <p className="-mt-3 mb-4.5 text-[12.5px] font-medium text-orange-deep">
              {dobError}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.75 block text-[13px] font-semibold text-ink">Gender</label>
          <Segmented
            options={["Male", "Female"]}
            value={data.gender}
            onChange={(v) => update({ gender: v as OnboardingData["gender"] })}
          />
        </div>
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
    </StepShell>
  );
}
