"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, User, Ruler, Dumbbell, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/services/profile.service";
import Field from "@/components/ui/Field";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import Segmented from "@/components/ui/Segmented";

type FormData = {
  name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  height_cm: string;
  weight_kg: string;
  fitness_goal: string;
  activity_level: string;
  goal_weight_kg: string;
  dietary_preferences: string[];
  dietary_restrictions: string[];
  allergies: string[];
  medical_conditions: string;
  exercise_frequency: string;
  exercise_types: string[];
  injuries: string;
};

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "active", label: "Active" },
  { value: "very_active", label: "Very Active" },
];

const FREQ_OPTIONS = [
  { value: "never", label: "Never" },
  { value: "1-2", label: "1-2 /week" },
  { value: "3-4", label: "3-4 /week" },
  { value: "5+", label: "5+ /week" },
];

const GOAL_OPTIONS = [
  { value: "weight-loss", label: "Lose Weight" },
  { value: "muscle-gain", label: "Build Muscle" },
  { value: "endurance", label: "Boost Endurance" },
];

function toFormData(profile: Record<string, unknown>): FormData {
  return {
    name: "",
    email: "",
    date_of_birth: (profile.date_of_birth as string) ?? "",
    gender: (profile.gender as string) ?? "",
    height_cm: profile.height_cm != null ? String(profile.height_cm) : "",
    weight_kg: profile.weight_kg != null ? String(profile.weight_kg) : "",
    fitness_goal: (profile.fitness_goal as string) ?? "",
    activity_level: (profile.activity_level as string) ?? "",
    goal_weight_kg: profile.goal_weight_kg != null ? String(profile.goal_weight_kg) : "",
    dietary_preferences: (profile.dietary_preferences as string[]) ?? [],
    dietary_restrictions: (profile.dietary_restrictions as string[]) ?? [],
    allergies: (profile.allergies as string[]) ?? [],
    medical_conditions: (profile.medical_conditions as string) ?? "",
    exercise_frequency: (profile.exercise_frequency as string) ?? "",
    exercise_types: (profile.exercise_types as string[]) ?? [],
    injuries: (profile.injuries as string) ?? "",
  };
}

function arrayInput(label: string, value: string[], onChange: (v: string[]) => void) {
  return (
    <div key={label} className="mb-4.5">
      <label className="mb-1.75 block text-[13px] font-semibold text-ink">{label}</label>
      <input
        type="text"
        placeholder="Separate items with commas"
        value={value.join(", ")}
        onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
        className="w-full rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 py-3.25 font-sans text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-white"
      />
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, fetchUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "", email: "", date_of_birth: "", gender: "", height_cm: "", weight_kg: "",
    fitness_goal: "", activity_level: "", goal_weight_kg: "", dietary_preferences: [],
    dietary_restrictions: [], allergies: [], medical_conditions: "", exercise_frequency: "",
    exercise_types: [], injuries: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
    if (profile) {
      setForm((prev) => ({ ...prev, ...toFormData(profile as unknown as Record<string, unknown>) }));
    }
  }, [user, profile]);

  function update(patch: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    const body: Record<string, unknown> = {};

    if (form.name !== user?.name) body.name = form.name;
    if (form.email !== user?.email) body.email = form.email;
    if (form.date_of_birth) body.date_of_birth = form.date_of_birth;
    if (form.gender) body.gender = form.gender;
    if (form.height_cm) body.height_cm = parseFloat(form.height_cm);
    if (form.weight_kg) body.weight_kg = parseFloat(form.weight_kg);
    if (form.fitness_goal) body.fitness_goal = form.fitness_goal;
    if (form.activity_level) body.activity_level = form.activity_level;
    if (form.goal_weight_kg) body.goal_weight_kg = parseFloat(form.goal_weight_kg);
    if (form.dietary_preferences.length) body.dietary_preferences = form.dietary_preferences;
    if (form.dietary_restrictions.length) body.dietary_restrictions = form.dietary_restrictions;
    if (form.allergies.length) body.allergies = form.allergies;
    if (form.medical_conditions) body.medical_conditions = form.medical_conditions;
    if (form.exercise_frequency) body.exercise_frequency = form.exercise_frequency;
    if (form.exercise_types.length) body.exercise_types = form.exercise_types;
    if (form.injuries) body.injuries = form.injuries;

    try {
      await profileService.update(body);
      await fetchUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save changes";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.push("/dashboard")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-ink-soft hover:bg-surface hover:text-ink">
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Settings</h1>
          <p className="text-[13.5px] text-ink-soft">Manage your profile and preferences</p>
        </div>
      </div>

      {success && (
        <div className="mb-4 rounded-[10px] border border-green-500/30 bg-green-500/5 px-4 py-3 text-[13px] font-medium text-green-600">Profile updated successfully</div>
      )}
      {error && (
        <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">{error}</div>
      )}

      <div className="space-y-8">
        {/* Account Info */}
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-ink-soft" />
            <h2 className="font-display text-base font-bold text-ink">Account</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-4">
            <Field id="name" label="Full name" type="text" value={form.name} onChange={(e) => update({ name: e.target.value })} />
            <Field id="email" label="Email" type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} />
          </div>
        </section>

        {/* Body Measurements */}
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Ruler className="h-5 w-5 text-ink-soft" />
            <h2 className="font-display text-base font-bold text-ink">Body Measurements</h2>
          </div>
          <div className="mb-4">
            <label className="mb-1.75 block text-[13px] font-semibold text-ink">Gender</label>
            <Segmented options={["male", "female", "other"]} value={form.gender} onChange={(v) => update({ gender: v })} />
          </div>
          <div className="mb-4">
            <label className="mb-1.75 block text-[13px] font-semibold text-ink">Date of Birth</label>
            <input id="dob" type="date" value={form.date_of_birth} onChange={(e) => update({ date_of_birth: e.target.value })}
              className="w-full rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 py-3.25 font-sans text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-white" />
          </div>
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
            <Field id="height" label="Height (cm)" type="number" placeholder="170" value={form.height_cm} onChange={(e) => update({ height_cm: e.target.value })} />
            <Field id="weight" label="Weight (kg)" type="number" placeholder="65" value={form.weight_kg} onChange={(e) => update({ weight_kg: e.target.value })} />
            <Field id="goalWeight" label="Goal Weight (kg)" type="number" placeholder="70" value={form.goal_weight_kg} onChange={(e) => update({ goal_weight_kg: e.target.value })} />
          </div>
        </section>

        {/* Fitness */}
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-ink-soft" />
            <h2 className="font-display text-base font-bold text-ink">Fitness</h2>
          </div>
          <div className="mb-4">
            <label className="mb-1.75 block text-[13px] font-semibold text-ink">Main Goal</label>
            <Segmented options={GOAL_OPTIONS.map((o) => o.value)} value={form.fitness_goal} onChange={(v) => update({ fitness_goal: v })} />
          </div>
          <div className="mb-4">
            <label className="mb-1.75 block text-[13px] font-semibold text-ink">Activity Level</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ACTIVITY_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => update({ activity_level: opt.value })}
                  className={`rounded-[10px] border-[1.5px] px-3 py-2.5 text-center text-[13px] font-semibold transition-colors ${form.activity_level === opt.value ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-ink-faint"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-1.75 block text-[13px] font-semibold text-ink">Exercise Frequency</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FREQ_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => update({ exercise_frequency: opt.value })}
                  className={`rounded-[10px] border-[1.5px] px-3 py-2.5 text-center text-[13px] font-semibold transition-colors ${form.exercise_frequency === opt.value ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-ink-faint"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {arrayInput("Exercise Types", form.exercise_types, (v) => update({ exercise_types: v }))}
          {arrayInput("Injuries", form.injuries ? [form.injuries] : [], (v) => update({ injuries: v[0] ?? "" }))}
        </section>

        {/* Health & Diet */}
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-ink-soft" />
            <h2 className="font-display text-base font-bold text-ink">Health & Diet</h2>
          </div>
          {arrayInput("Dietary Preferences", form.dietary_preferences, (v) => update({ dietary_preferences: v }))}
          {arrayInput("Dietary Restrictions", form.dietary_restrictions, (v) => update({ dietary_restrictions: v }))}
          {arrayInput("Allergies", form.allergies, (v) => update({ allergies: v }))}
          <Field id="medicalConditions" label="Medical Conditions" type="text" placeholder="Optional" value={form.medical_conditions} onChange={(e) => update({ medical_conditions: e.target.value })} />
        </section>

        {/* Save */}
        <div className="flex items-center gap-3">
          <ButtonSecondary onClick={() => router.push("/dashboard")}>Cancel</ButtonSecondary>
          <ButtonPrimary onClick={handleSave} disabled={saving}>
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Saving...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2"><Save className="h-4 w-4" /> Save Changes</span>
            )}
          </ButtonPrimary>
        </div>
      </div>
    </>
  );
}
