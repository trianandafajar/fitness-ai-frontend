export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  date_of_birth?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  fitness_goal?: string;
  activity_level?: string;
  goal_weight_kg?: number;
  dietary_preferences?: string[];
  dietary_restrictions?: string[];
  allergies?: string[];
  medical_conditions?: string | null;
  exercise_frequency?: string;
  exercise_types?: string[];
  injuries?: string | null;
  onboarding_step: number;
  profile_completed: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface MeResponse {
  user: User;
  profile: UserProfile;
}

export interface LogoutResponse {
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
}
