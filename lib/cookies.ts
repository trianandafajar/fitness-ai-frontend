import Cookies from "js-cookie";
import { NODE_ENV } from "@/lib/app-config";

const TOKEN_KEY = "access_token";
const PROFILE_KEY = "profile_completed";
const ADMIN_KEY = "is_admin";

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    secure: NODE_ENV === "production",
    sameSite: "lax",
  });
}

export function removeToken(): void {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(PROFILE_KEY);
  Cookies.remove(ADMIN_KEY);
}

export function getProfileCompleted(): boolean {
  return Cookies.get(PROFILE_KEY) === "true";
}

export function setProfileCompleted(): void {
  Cookies.set(PROFILE_KEY, "true", {
    expires: 7,
    secure: NODE_ENV === "production",
    sameSite: "lax",
  });
}

export function removeProfileCompleted(): void {
  Cookies.remove(PROFILE_KEY);
}

export function getIsAdmin(): boolean {
  return Cookies.get(ADMIN_KEY) === "true";
}

export function setIsAdmin(): void {
  Cookies.set(ADMIN_KEY, "true", {
    expires: 7,
    secure: NODE_ENV === "production",
    sameSite: "lax",
  });
}

export function removeIsAdmin(): void {
  Cookies.remove(ADMIN_KEY);
}
