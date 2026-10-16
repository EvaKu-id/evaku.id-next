"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { DEFAULT_THRESHOLDS, type PassabilityThresholds } from "@/lib/thresholds";
import { DEFAULT_WEIGHTS, type ScoreWeights } from "@/lib/scoring";

interface SettingsState {
  thresholds: PassabilityThresholds;
  weights: ScoreWeights;
  setThresholds: (thresholds: PassabilityThresholds) => void;
  setWeights: (weights: ScoreWeights) => void;
  reset: () => void;
}

// Private windows and blocked site data make localStorage throw; settings then live in memory only.
const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {}
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {}
  },
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      thresholds: DEFAULT_THRESHOLDS,
      weights: DEFAULT_WEIGHTS,
      setThresholds: (thresholds) => set({ thresholds }),
      setWeights: (weights) => set({ weights }),
      reset: () => set({ thresholds: DEFAULT_THRESHOLDS, weights: DEFAULT_WEIGHTS }),
    }),
    {
      name: "evaku:settings",
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: ({ thresholds, weights }) => ({ thresholds, weights }),
    },
  ),
);
