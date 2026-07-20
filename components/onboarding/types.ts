export type Gender = "Male" | "Female";
export type Goal = "weight-loss" | "muscle-gain" | "endurance" | "general-fitness" | "strength" | "flexibility" | "toning";
export type ActivityLevel = "low" | "medium" | "high";
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
  activityLevel: "medium",
  goalWeight: "",
  favoriteFoods: [],
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
  recommendations: string[] | string;
  workout_plan?: string;
  meal_suggestions: EnrichedFood[] | string;
  exercise_suggestions: EnrichedExercise[] | string;
}

export interface EnrichedExercise {
  text: string;
  exercise: {
    id: number;
    name: string;
    equipment: string;
    image: string;
    target_muscles: string[];
    category: string;
  } | null;
  scheduled_day: string | null;
  scheduled_time: string | null;
}

export interface EnrichedFood {
  text: string;
  food: {
    id: number;
    name: string;
    image: string;
    calories_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
    category: string;
  } | null;
  meal_time: string | null;
  time: string | null;
}

export interface Step5Response {
  message: string;
  profile_completed: boolean;
  ai_analysis: AiAnalysis | null;
  workout_plan?: string;
}

export const GOAL_MAP: Record<Goal, string> = {
  "weight-loss": "Lose weight",
  "muscle-gain": "Build muscle",
  "endurance": "Boost endurance",
  "general-fitness": "General Fitness",
  "strength": "Strength Training",
  "flexibility": "Flexibility & Mobility",
  "toning": "Toning / Body Recomp",
};

export const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "low", label: "Low Intensity" },
  { value: "medium", label: "Medium Intensity" },
  { value: "high", label: "High Intensity" },
];
