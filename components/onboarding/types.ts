export interface OnboardingData {
  name: string;
  dob: string;
  gender: "Male" | "Female";
  height: string;
  weight: string;
  goal: "weight-loss" | "muscle-gain" | "endurance";
  favoriteFoods: string[];
  restrictions: string[];
  daysPerWeek: "1-2" | "3-4" | "5+";
  sportTypes: string[];
  timeOfDay: "Morning" | "Afternoon" | "Evening";
}

export const initialOnboardingData: OnboardingData = {
  name: "",
  dob: "",
  gender: "Male",
  height: "",
  weight: "",
  goal: "weight-loss",
  favoriteFoods: ["Nasi Padang", "Sate"],
  restrictions: [],
  daysPerWeek: "3-4",
  sportTypes: ["Gym / Weight lifting"],
  timeOfDay: "Afternoon",
};

export interface AnalysisResult {
  bmi: number;
  bmiTag: string;
  bmr: number;
  fitnessLevel: string;
  targetCalories: number;
  note: string;
}

export function computeAnalysis(data: OnboardingData): AnalysisResult {
  const heightCm = parseFloat(data.height) || 170;
  const weightKg = parseFloat(data.weight) || 65;
  const heightM = heightCm / 100;

  const bmi = weightKg / (heightM * heightM);

  let bmiTag = "Normal";
  if (bmi < 18.5) bmiTag = "Underweight";
  else if (bmi >= 25 && bmi < 30) bmiTag = "Overweight";
  else if (bmi >= 30) bmiTag = "Obese";

  // Mifflin-St Jeor, simplified with an assumed age of 25
  const age = 25;
  const bmr =
    data.gender === "Male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const goalDelta =
    data.goal === "weight-loss" ? -350 : data.goal === "muscle-gain" ? 300 : 0;

  const goalLabel =
    data.goal === "weight-loss"
      ? "gradual weight loss"
      : data.goal === "muscle-gain"
      ? "muscle mass gain"
      : "improving body endurance";

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiTag,
    bmr: Math.round(bmr),
    fitnessLevel: data.daysPerWeek === "5+" ? "Intermediate" : "Beginner",
    targetCalories: Math.round(bmr + goalDelta),
    note: `Based on your profile, the AI recommends a ${goalLabel} program with ${data.daysPerWeek} exercise sessions per week in the ${data.timeOfDay.toLowerCase()}. Weekly meals have been prepared from your favorite foods.`,
  };
}
