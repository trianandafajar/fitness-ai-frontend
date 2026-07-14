export type Gender = "Male" | "Female";
export type Goal = "weight-loss" | "muscle-gain" | "endurance";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type DaysPerWeek = "1-2" | "3-4" | "5+";
export type TimeOfDay = "Morning" | "Afternoon" | "Evening";

export interface OnboardingData {
  name: string;
  dob: string;
  gender: Gender;
  height: string;
  weight: string;
  goal: Goal;
  activityLevel: ActivityLevel;
  goalWeight: string;
  favoriteFoods: string[];
  restrictions: string[];
  allergies: string[];
  medicalConditions: string;
  daysPerWeek: DaysPerWeek;
  sportTypes: string[];
  injuries: string;
  timeOfDay: TimeOfDay;
}

export const initialOnboardingData: OnboardingData = {
  name: "",
  dob: "",
  gender: "Male",
  height: "",
  weight: "",
  goal: "weight-loss",
  activityLevel: "moderate",
  goalWeight: "",
  favoriteFoods: ["Nasi Padang", "Sate"],
  restrictions: [],
  allergies: [],
  medicalConditions: "",
  daysPerWeek: "3-4",
  sportTypes: ["Gym / Weight lifting"],
  injuries: "",
  timeOfDay: "Afternoon",
};

export interface AiAnalysis {
  summary: string;
  recommendations: string;
  meal_suggestions: string;
  exercise_suggestions: string;
}

export interface Step5Response {
  message: string;
  profile_completed: boolean;
  ai_analysis: AiAnalysis | null;
}

export const GOAL_MAP: Record<Goal, string> = {
  "weight-loss": "Lose weight",
  "muscle-gain": "Build muscle",
  "endurance": "Boost endurance",
};

export const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "active", label: "Active" },
  { value: "very_active", label: "Very Active" },
];
