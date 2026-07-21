export const NODE_ENV = process.env.NODE_ENV || "development"
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "FitnessAI"
export const APP_BRAND = APP_NAME.split(" ")[0]
export const APP_TAGLINE = process.env.NEXT_PUBLIC_APP_TAGLINE || "Your personal AI coach that learns from your body."
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.fitnessai.app"
export const REVERB_HOST = process.env.NEXT_PUBLIC_REVERB_HOST || "reverb.fitnessai.app"
export const REVERB_APP_KEY = process.env.NEXT_PUBLIC_REVERB_APP_KEY || "reverb"
export const REVERB_PORT = Number(process.env.NEXT_PUBLIC_REVERB_PORT || "443")