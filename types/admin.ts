export interface AdminDashboardData {
  users_count: number;
  exercises_count: number;
  foods_count: number;
}

export interface AdminExercise {
  id: number;
  name: string;
  equipment: string | null;
  target_muscles: string[];
  category: string;
  image: string | null;
  image_url: string | null;
  description: string | null;
}

export interface AdminFood {
  id: number;
  name: string;
  category: string;
  image: string | null;
  image_url: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  serving_unit: string | null;
}

export type ExercisePayload = {
  name: string;
  equipment?: string;
  target_muscles?: string[];
  category: string;
  image?: File | string | null;
  description?: string;
};

export type FoodPayload = {
  name: string;
  category: string;
  image?: File | string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  serving_unit?: string;
};
