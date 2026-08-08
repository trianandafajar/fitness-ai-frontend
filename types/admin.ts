export interface AdminDashboardData {
  users_count: number;
  exercises_count: number;
  foods_count: number;
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  from: number | null;
  to: number | null;
}

export interface AdminExercise {
  id: number;
  name: string;
  equipment: string | null;
  target_muscles: string[];
  category_id: number;
  category: string;
  image: string | null;
  image_url: string | null;
  description: string | null;
}

export interface AdminFood {
  id: number;
  name: string;
  category_id: number;
  category: string;
  image: string | null;
  image_url: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  serving_unit: string | null;
}

export interface ExerciseCategory {
  id: number;
  name: string;
  slug: string;
}

export interface FoodCategory {
  id: number;
  name: string;
  slug: string;
}

export type ExercisePayload = {
  name: string;
  equipment?: string;
  target_muscles?: string[];
  category_id: number;
  image?: File | string | null;
  description?: string;
};

export type FoodPayload = {
  name: string;
  category_id: number;
  image?: File | string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  serving_unit?: string;
};
