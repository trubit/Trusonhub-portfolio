import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      mode: "dark",
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === "light" ? "dark" : "light",
        })),
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "trusonhub-theme",
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);

