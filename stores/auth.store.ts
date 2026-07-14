import type { AuthState, User, UserProfile } from "@/types/auth";
import { getToken } from "@/lib/cookies";

type Listener = () => void;

const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: !!getToken(),
};

function createStore(initial: AuthState) {
  let state = { ...initial };
  const listeners = new Set<Listener>();

  return {
    getState: () => state,
    setState: (partial: Partial<AuthState>) => {
      state = { ...state, ...partial };
      listeners.forEach((fn) => fn());
    },
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    reset: () => {
      state = { ...initialState, isAuthenticated: !!getToken() };
      listeners.forEach((fn) => fn());
    },
    setUser: (user: User) => {
      state = { ...state, user, isAuthenticated: true };
      listeners.forEach((fn) => fn());
    },
    setProfile: (profile: UserProfile) => {
      state = { ...state, profile };
      listeners.forEach((fn) => fn());
    },
  };
}

export const authStore = createStore(initialState);
