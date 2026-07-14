import Field from "@/components/ui/Field";
import Segmented from "@/components/ui/Segmented";
import StepShell from "./StepShell";
import { OnboardingData } from "./types";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export default function StepPersonalInfo({ data, update, onNext }: Props) {
  const canProceed = data.name.trim().length > 0 && data.dob.length > 0;

  return (
    <StepShell
      stepTag="STEP 1 OF 5"
      title="Let's get to know you"
      sub="This basic data helps the AI calculate your body's needs accurately."
      onNext={onNext}
      nextDisabled={!canProceed}
    >
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
        <Field
          id="dob"
          label="Date of birth"
          type="date"
          value={data.dob}
          onChange={(e) => update({ dob: e.target.value })}
        />
        <div>
          <label className="mb-1.75 block text-[13px] font-semibold text-ink">Gender</label>
          <Segmented
            options={["Male", "Female"]}
            value={data.gender}
            onChange={(v) => update({ gender: v as OnboardingData["gender"] })}
          />
        </div>
      </div>
    </StepShell>
  );
}
