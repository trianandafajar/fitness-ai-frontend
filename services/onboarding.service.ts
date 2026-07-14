import { api } from "@/lib/axios";

export interface Step1Payload {
  date_of_birth: string;
  gender: string;
}

export interface Step2Payload {
  height_cm: number;
  weight_kg: number;
  fitness_goal: string;
  activity_level: string;
  goal_weight_kg?: number;
}

export interface Step3Payload {
  dietary_preferences?: string[];
  dietary_restrictions?: string[];
  allergies?: string[];
  medical_conditions?: string;
}

export interface Step4Payload {
  exercise_frequency: string;
  exercise_types: string[];
  injuries?: string;
}

export const onboardingService = {
  step1(payload: Step1Payload) {
    return api.post("/onboarding/step1", payload);
  },

  step2(payload: Step2Payload) {
    return api.post("/onboarding/step2", payload);
  },

  step3(payload: Step3Payload) {
    return api.post("/onboarding/step3", payload);
  },

  step4(payload: Step4Payload) {
    return api.post("/onboarding/step4", payload);
  },

  step5() {
    return api.post("/onboarding/step5");
  },
};
