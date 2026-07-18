import { api } from "@/lib/axios";

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
}

export interface AiAnalysis {
  summary: string;
  recommendations: string;
  meal_suggestions: EnrichedFood[];
  exercise_suggestions: EnrichedExercise[];
}

export const aiAnalysisService = {
  getMyAnalysis() {
    return api.get<{ data: AiAnalysis }>("/ai-analysis");
  },
};
