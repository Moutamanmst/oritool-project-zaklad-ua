"use client";

import { create } from "zustand";

type PrimaryColor = "amber" | "blue" | "green" | "purple" | "red";

interface ThemeSettings {
  primaryColor: PrimaryColor;
  darkTheme: boolean;
  enableAnimations: boolean;
}

interface ThemeStore extends ThemeSettings {
  setTheme: (settings: Partial<ThemeSettings>) => void;
  loadFromStorage: () => void;
}

const defaultTheme: ThemeSettings = {
  primaryColor: "amber",
  darkTheme: true,
  enableAnimations: true,
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  ...defaultTheme,

  setTheme: (settings) => {
    set((state) => ({ ...state, ...settings }));
    applyThemeToDOM(get());
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    
    try {
      const saved = localStorage.getItem("zakladua-settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        const newSettings = {
          primaryColor: parsed.primaryColor || defaultTheme.primaryColor,
          darkTheme: parsed.darkTheme ?? defaultTheme.darkTheme,
          enableAnimations: parsed.enableAnimations ?? defaultTheme.enableAnimations,
        };
        set(newSettings);
        applyThemeToDOM(newSettings);
      }
    } catch (e) {
      console.error("Failed to load theme settings:", e);
    }
  },
}));

function applyThemeToDOM(settings: ThemeSettings) {
  if (typeof window === "undefined") return;
  
  const root = document.documentElement;

  // Apply color theme via data attribute
  root.setAttribute("data-theme-color", settings.primaryColor);

  // Apply dark/light mode
  if (settings.darkTheme) {
    root.classList.add("dark");
    root.classList.remove("light");
    document.body.style.background = "linear-gradient(180deg, #09090b 0%, #18181b 100%)";
    document.body.style.color = "#f4f4f5";
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
    document.body.style.background = "linear-gradient(180deg, #f4f4f5 0%, #e4e4e7 100%)";
    document.body.style.color = "#18181b";
  }

  // Apply animations preference
  if (settings.enableAnimations) {
    root.classList.remove("no-animations");
  } else {
    root.classList.add("no-animations");
  }
  
  console.log("Theme applied:", settings);
}
