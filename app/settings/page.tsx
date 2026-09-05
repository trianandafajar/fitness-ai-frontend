"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, User, Ruler, Dumbbell, Heart, Scale, Activity, Zap, Feather, Target, KeyRound, Loader2, Check, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/services/profile.service";
import { authService } from "@/services/auth.service";
import { toast } from "@/components/ui/Toast";
import Field from "@/components/ui/Field";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter } from "@/components/ui/Drawer";
import { removeToken } from "@/lib/cookies";
import { authStore } from "@/stores/auth.store";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import Segmented from "@/components/ui/Segmented";
import { Chip, ChipGroup } from "@/components/ui/Chip";
import AddChipInput from "@/components/ui/AddChipInput";
import GoalCard from "@/components/onboarding/GoalCard";
import { GOAL_MAP } from "@/components/onboarding/types";

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
  { value: "low", label: "Low Intensity" },
  { value: "medium", label: "Medium Intensity" },
  { value: "high", label: "High Intensity" },
];

const FREQ_OPTIONS = [
  { value: "1-2", label: "1-2 /week" },
  { value: "3-4", label: "3-4 /week" },
  { value: "5+", label: "5+ /week" },
];

const SPORT_TYPES = ["Gym / Weight lifting", "Running", "Yoga", "Swimming", "Cycling"];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

const REVERSE_GOAL = Object.fromEntries(Object.entries(GOAL_MAP).map(([k, v]) => [v, k]));

function toFormData(profile: Record<string, unknown>): Record<string, unknown> {
  return {
    date_of_birth: (profile.date_of_birth as string) ?? "",
    gender: (profile.gender as string) ?? "",
    height_cm: profile.height_cm != null ? String(profile.height_cm) : "",
    weight_kg: profile.weight_kg != null ? String(profile.weight_kg) : "",
    fitness_goal: REVERSE_GOAL[profile.fitness_goal as string] ?? (profile.fitness_goal as string) ?? "",
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

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, fetchUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [emailMode, setEmailMode] = useState<"idle" | "enter" | "verify">("idle");
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimer = useRef<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "", email: "", date_of_birth: "", gender: "", height_cm: "", weight_kg: "",
    fitness_goal: "", activity_level: "", goal_weight_kg: "", dietary_preferences: [],
    dietary_restrictions: [], allergies: [], medical_conditions: "", exercise_frequency: "",
    exercise_types: [], injuries: "",
  });

  useEffect(() => {
    if (!user) {
      fetchUser().catch(() => {});
    }
  }, [fetchUser, user]);

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

  const clearCooldownTimer = useCallback(() => {
    if (cooldownTimer.current !== null) {
      window.clearInterval(cooldownTimer.current);
      cooldownTimer.current = null;
    }
  }, []);

  const startCooldown = useCallback((seconds: number) => {
    clearCooldownTimer();
    setCooldown(seconds);
    if (seconds <= 0) return;
    cooldownTimer.current = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearCooldownTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearCooldownTimer]);

  useEffect(() => {
    return () => clearCooldownTimer();
  }, [clearCooldownTimer]);

  useEffect(() => {
    if (!user || emailMode !== "idle") return;
    profileService
      .getEmailChangeStatus()
      .then((status) => {
        if (!status.pending) return;
        setNewEmail(status.new_email ?? "");
        setEmailMode("verify");
        startCooldown(status.resend_after ?? 0);
      })
      .catch(() => {});
  }, [user, emailMode, startCooldown]);

  const handleStartEmailChange = useCallback(async () => {
    const value = newEmail.trim();
    if (!value) {
      toast.error("Enter your new email address first");
      return;
    }

    setEmailBusy(true);
    setError("");
    try {
      const res = await profileService.initiateEmailChange(value);
      setEmailMode("verify");
      setCode("");
      startCooldown(res.resend_after ?? 60);
      toast.success("Verification code sent", { description: `Check ${value} for a 6-digit code.` });
    } catch (err: unknown) {
      const resp = err as { response?: { data?: { message?: string; errors?: Record<string, string[]>; retry_after?: number } } };
      const msg = resp?.response?.data;
      const desc = msg?.errors?.new_email?.[0] ?? msg?.message ?? "Could not send the code.";
      if (typeof msg?.retry_after === "number") {
        setEmailMode("verify");
        startCooldown(msg.retry_after);
      }
      toast.error("Failed to send code", { description: desc });
    } finally {
      setEmailBusy(false);
    }
  }, [newEmail, startCooldown]);

  const handleResendCode = useCallback(() => {
    void handleStartEmailChange();
  }, [handleStartEmailChange]);

  const handleVerifyEmail = useCallback(async () => {
    if (!code.trim()) {
      toast.error("Enter the verification code");
      return;
    }
    setEmailBusy(true);
    setError("");
    try {
      await profileService.verifyEmailChange(code.trim());
      setEmailMode("idle");
      setNewEmail("");
      setCode("");
      clearCooldownTimer();
      await fetchUser();
      setSuccess(true);
      toast.success("Email changed successfully");
      window.setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;
      const desc = msg?.errors?.code?.[0] ?? msg?.message ?? "Verification failed.";
      toast.error("Verification failed", { description: desc });
    } finally {
      setEmailBusy(false);
    }
  }, [code, clearCooldownTimer, fetchUser]);

  const handleCancelEmailChange = useCallback(async () => {
    setEmailBusy(true);
    try {
      await profileService.cancelEmailChange();
    } catch { } finally {
      setEmailBusy(false);
      setEmailMode("idle");
      setNewEmail("");
      setCode("");
      clearCooldownTimer();
    }
  }, [clearCooldownTimer]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    const body: Record<string, unknown> = {};

    if (form.name !== user?.name) body.name = form.name;
    body.date_of_birth = form.date_of_birth || null;
    body.gender = form.gender || null;
    body.height_cm = form.height_cm ? parseFloat(form.height_cm) : null;
    body.weight_kg = form.weight_kg ? parseFloat(form.weight_kg) : null;
    body.fitness_goal = form.fitness_goal || null;
    body.activity_level = form.activity_level || null;
    body.goal_weight_kg = form.goal_weight_kg ? parseFloat(form.goal_weight_kg) : null;
    body.dietary_preferences = form.dietary_preferences;
    body.dietary_restrictions = form.dietary_restrictions;
    body.allergies = form.allergies;
    body.medical_conditions = form.medical_conditions || null;
    body.exercise_frequency = form.exercise_frequency || null;
    body.exercise_types = form.exercise_types;
    body.injuries = form.injuries || null;

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

  async function handleDeleteAccount() {
    if (deleting) return;

    if (!deletePassword.trim()) {
      toast.error("Enter your password to continue");
      return;
    }

    setDeleting(true);
    try {
      await authService.deleteAccount(deletePassword.trim());
      removeToken();
      authStore.reset();
      toast.success("Account deleted");
      router.replace("/login");
    } catch (e: unknown) {
      const resp = e as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const msg = resp?.response?.data?.errors?.password?.[0] ?? resp?.response?.data?.message ?? "Failed to delete account";
      toast.error("Failed to delete account", { description: msg });
    } finally {
      setDeleting(false);
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
          <div className="mb-4 rounded-[10px] border border-success/30 bg-success/10 px-4 py-3 text-[13px] font-medium text-success">Profile updated successfully</div>
        )}
      {error && (
        <div className="mb-4 rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] font-medium text-danger">{error}</div>
      )}

      <div className="space-y-8">
        {/* Account Info */}
        <section className="rounded-2xl border border-line bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-ink-soft" />
            <h2 className="font-display text-base font-bold text-ink">Account</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-4">
            <Field id="name" label="Full name" type="text" value={form.name} onChange={(e) => update({ name: e.target.value })} />

            <div>
              <label className="mb-1.75 block text-[13px] font-semibold text-ink">Email</label>

              {emailMode === "idle" && (
                <div className="flex items-center gap-2">
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    readOnly
                    className="w-full rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 py-3.25 font-sans text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-card"
                  />
                  <button
                    type="button"
                    onClick={() => setEmailMode("enter")}
                    className="shrink-0 rounded-[10px] border-[1.5px] border-orange/30 px-3.5 py-3.25 text-[13px] font-semibold text-orange-deep transition hover:bg-orange-tint"
                  >
                    Change
                  </button>
                </div>
              )}

              {emailMode === "enter" && (
                <div className="space-y-2.5">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email address"
                    className="w-full rounded-[10px] border-[1.5px] border-line bg-card px-3.5 py-3.25 font-sans text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void handleStartEmailChange()}
                      disabled={emailBusy}
                      className="flex items-center justify-center gap-1.5 rounded-[10px] bg-orange px-3.5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-orange-deep disabled:opacity-50"
                    >
                      {emailBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                      Send code
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmailMode("idle"); setNewEmail(""); }}
                      disabled={emailBusy}
                      className="rounded-[10px] px-3.5 py-2.5 text-[13px] font-semibold text-ink-soft transition hover:text-ink disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {emailMode === "verify" && (
                <div className="space-y-2.5">
                  <div className="rounded-[10px] bg-orange-tint/60 px-3.5 py-2.5 text-[13px] text-ink">
                    A 6-digit code was sent to <span className="font-semibold">{newEmail}</span>. Enter it below to confirm the change.
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="6-digit code"
                      className="w-full rounded-[10px] border-[1.5px] border-line bg-card px-3.5 py-3.25 font-mono text-[14.5px] tracking-widest text-ink outline-none transition-colors placeholder:tracking-normal placeholder:text-ink-faint focus:border-orange"
                    />
                    <button
                      type="button"
                      onClick={() => void handleVerifyEmail()}
                      disabled={emailBusy || code.length !== 6}
                      className="flex shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-orange px-3.5 py-3.25 text-[13px] font-semibold text-white transition hover:bg-orange-deep disabled:opacity-50"
                    >
                      {emailBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Verify
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={emailBusy || cooldown > 0}
                      className="text-[12.5px] font-semibold text-orange-deep transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                    </button>
                    <span className="text-ink-faint">·</span>
                    <button
                      type="button"
                      onClick={() => void handleCancelEmailChange()}
                      disabled={emailBusy}
                      className="text-[12.5px] font-semibold text-ink-soft transition hover:text-ink disabled:opacity-50"
                    >
                      Cancel change
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Body Measurements */}
        <section className="rounded-2xl border border-line bg-card p-5">
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
              className="w-full rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 py-3.25 font-sans text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-card" />
          </div>
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
            <Field id="height" label="Height (cm)" type="number" placeholder="170" value={form.height_cm} onChange={(e) => update({ height_cm: e.target.value })} />
            <Field id="weight" label="Weight (kg)" type="number" placeholder="65" value={form.weight_kg} onChange={(e) => update({ weight_kg: e.target.value })} />
            <Field id="goalWeight" label="Goal Weight (kg)" type="number" placeholder="70" value={form.goal_weight_kg} onChange={(e) => update({ goal_weight_kg: e.target.value })} />
          </div>
        </section>

        {/* Fitness */}
        <section className="rounded-2xl border border-line bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-ink-soft" />
            <h2 className="font-display text-base font-bold text-ink">Fitness</h2>
          </div>

          <label className="mb-2.5 block text-[13px] font-semibold text-ink">Main Goal</label>
          {([
            { id: "weight-loss", icon: <Scale className="h-5 w-5" />, title: "Lose weight", description: "Focus on calorie deficit & cardio" },
            { id: "muscle-gain", icon: <Dumbbell className="h-5 w-5" />, title: "Build muscle", description: "Focus on weight training & protein surplus" },
            { id: "endurance", icon: <Heart className="h-5 w-5" />, title: "Boost endurance", description: "Focus on cardio & endurance training" },
            { id: "general-fitness", icon: <Activity className="h-5 w-5" />, title: "General Fitness", description: "Stay healthy and active every day" },
            { id: "strength", icon: <Zap className="h-5 w-5" />, title: "Strength Training", description: "Increase raw strength and power" },
            { id: "flexibility", icon: <Feather className="h-5 w-5" />, title: "Flexibility & Mobility", description: "Improve range of motion and posture" },
            { id: "toning", icon: <Target className="h-5 w-5" />, title: "Toning / Body Recomp", description: "Sculpt your body and reduce body fat" },
          ] as const).map((g) => (
            <GoalCard key={g.id} icon={g.icon} title={g.title} description={g.description}
              selected={form.fitness_goal === g.id} onClick={() => update({ fitness_goal: g.id })} />
          ))}

          <label className="mb-2.5 mt-5 block text-[13px] font-semibold text-ink">Activity Level</label>
          <div className="mb-5 grid grid-cols-3 gap-2">
            {ACTIVITY_OPTIONS.map((opt) => (
              <button key={opt.value} type="button" onClick={() => update({ activity_level: opt.value })}
                className={`rounded-[10px] border-[1.5px] px-3 py-2.5 text-center text-[13px] font-semibold transition-colors ${form.activity_level === opt.value ? "border-orange bg-orange text-white" : "border-line bg-card text-ink-soft hover:border-ink-faint"}`}>
                {opt.label}
              </button>
            ))}
          </div>

          <label className="mb-2.5 block text-[13px] font-semibold text-ink">Days per week</label>
          <Segmented className="mb-5" options={FREQ_OPTIONS.map((o) => o.value)}
            value={form.exercise_frequency} onChange={(v) => update({ exercise_frequency: v })} />

          <label className="mb-2.5 block text-[13px] font-semibold text-ink">Exercise Types</label>
          <ChipGroup>
            {SPORT_TYPES.map((sport) => (
              <Chip key={sport} label={sport} selected={form.exercise_types.includes(sport)}
                onClick={() => update({ exercise_types: toggle(form.exercise_types, sport) })} />
            ))}
            {form.exercise_types.filter((item) => !SPORT_TYPES.includes(item)).map((item) => (
              <Chip key={item} label={item} selected={true}
                onClick={() => update({ exercise_types: form.exercise_types.filter((v) => v !== item) })} />
            ))}
          </ChipGroup>
          <AddChipInput onAdd={(v) => update({ exercise_types: [...form.exercise_types, v] })}
            placeholder="Type an exercise and press Enter..." />

          <label className="mb-1.75 mt-5 block text-[13px] font-semibold text-ink">Injuries (optional)</label>
          <textarea id="injuries" placeholder="e.g. lower back pain, knee injury, shoulder issues"
            value={form.injuries} onChange={(e) => update({ injuries: e.target.value })}
            rows={3}
            className="mb-4.5 w-full rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 py-3.25 font-sans text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-card resize-none" />
        </section>

        {/* Health & Diet */}
        <section className="rounded-2xl border border-line bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-ink-soft" />
            <h2 className="font-display text-base font-bold text-ink">Health & Diet</h2>
          </div>

          <label className="mb-2.5 block text-[13px] font-semibold text-ink">Dietary Preferences</label>
          <ChipGroup>
            {form.dietary_preferences.map((item) => (
              <Chip key={item} label={item} selected={true}
                onClick={() => update({ dietary_preferences: form.dietary_preferences.filter((v) => v !== item) })} />
            ))}
          </ChipGroup>
          <AddChipInput onAdd={(v) => update({ dietary_preferences: [...form.dietary_preferences, v] })}
            placeholder="Type a food preference and press Enter..." />

          <label className="mb-2.5 mt-5 block text-[13px] font-semibold text-ink">Dietary Restrictions</label>
          <ChipGroup>
            {form.dietary_restrictions.map((item) => (
              <Chip key={item} label={item} selected={true}
                onClick={() => update({ dietary_restrictions: form.dietary_restrictions.filter((v) => v !== item) })} />
            ))}
          </ChipGroup>
          <AddChipInput onAdd={(v) => update({ dietary_restrictions: [...form.dietary_restrictions, v] })}
            placeholder="Type a restriction and press Enter..." />

          <label className="mb-2.5 mt-5 block text-[13px] font-semibold text-ink">Allergies</label>
          <ChipGroup>
            {form.allergies.map((item) => (
              <Chip key={item} label={item} selected={true}
                onClick={() => update({ allergies: form.allergies.filter((v) => v !== item) })} />
            ))}
          </ChipGroup>
          <AddChipInput onAdd={(v) => update({ allergies: [...form.allergies, v] })}
            placeholder="Type an allergy and press Enter..." />

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

        {/* Danger Zone */}
        <section className="rounded-2xl border border-danger/30 bg-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-danger" />
            <h2 className="font-display text-base font-bold text-ink">Danger Zone</h2>
          </div>
          <p className="mb-4 text-[13.5px] leading-5 text-ink-soft">
            Deleting your account will permanently remove your profile, schedules, logs, and all associated data. This action cannot be undone.
          </p>
          <button
            type="button"
            onClick={() => {
              setDeletePassword("");
              setDeleteOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 rounded-[10px] bg-danger px-4 py-3 text-sm font-semibold text-white transition hover:bg-danger/90"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </section>
      </div>

      <Drawer open={deleteOpen} onOpenChange={setDeleteOpen} side="bottom">
        <DrawerContent>
          <DrawerHeader className="items-center px-5 pb-4 pt-3 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
              <Trash2 size={24} />
            </div>

            <DrawerTitle className="font-display text-xl">Delete Account?</DrawerTitle>

            <p className="max-w-sm text-sm leading-6 text-ink-soft">
              This will permanently delete your account and all associated data. Enter your password to confirm.
            </p>
          </DrawerHeader>

          <DrawerBody>
            <Field
              id="delete-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your current password"
            />
          </DrawerBody>

          <DrawerFooter>
            <div className="grid grid-cols-2 gap-2.5">
              <ButtonSecondary
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="w-full py-3 text-sm"
              >
                Cancel
              </ButtonSecondary>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || !deletePassword}
                className="flex w-full items-center justify-center rounded-xl bg-danger px-4 py-3 text-sm font-semibold text-white transition hover:bg-danger/90 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
