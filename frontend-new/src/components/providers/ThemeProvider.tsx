"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const loadFromStorage = useThemeStore((state) => state.loadFromStorage);

  useEffect(() => {
    // Initial load
    loadFromStorage();

    // Listen for localStorage changes from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "zakladua-settings") {
        loadFromStorage();
      }
    };

    // Listen for custom event (for same-tab updates)
    const handleThemeChange = () => {
      loadFromStorage();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("themeChanged", handleThemeChange);
    
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, [loadFromStorage]);

  return <>{children}</>;
}

// Helper to dispatch theme change event
export function dispatchThemeChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("themeChanged"));
  }
}
