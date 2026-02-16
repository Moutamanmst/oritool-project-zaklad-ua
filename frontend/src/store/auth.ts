import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthResponse } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (response: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (response: AuthResponse) =>
        set({
          user: response.user,
          token: response.accessToken,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "zaklad-auth",
    }
  )
);

