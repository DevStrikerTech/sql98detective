import { create } from "zustand";
import type { AppId } from "@/lib/win98/windowStore";

export type GamePhase = "idle" | "investigating" | "solved";

export type GameStore = {
  phase: GamePhase;
  currentCaseId: string | null;
  discoveredClues: string[];
  completedObjectives: string[];
  unlockedApps: AppId[];

  startCase: (caseId: string) => void;
  discoverClue: (clueId: string) => void;
  completeObjective: (objectiveId: string) => void;
  unlockApp: (app: AppId) => void;
  solveCase: () => void;
  reset: () => void;
};

const DEFAULT_APPS: AppId[] = ["my-computer", "inbox", "case-files", "sql-exe", "recycle-bin"];

export const useGameStore = create<GameStore>((set) => ({
  phase: "idle",
  currentCaseId: null,
  discoveredClues: [],
  completedObjectives: [],
  unlockedApps: DEFAULT_APPS,

  startCase: (caseId) =>
    set({
      phase: "investigating",
      currentCaseId: caseId,
      discoveredClues: [],
      completedObjectives: [],
    }),

  discoverClue: (clueId) =>
    set((s) => ({
      discoveredClues: s.discoveredClues.includes(clueId)
        ? s.discoveredClues
        : [...s.discoveredClues, clueId],
    })),

  completeObjective: (objectiveId) =>
    set((s) => ({
      completedObjectives: s.completedObjectives.includes(objectiveId)
        ? s.completedObjectives
        : [...s.completedObjectives, objectiveId],
    })),

  unlockApp: (app) =>
    set((s) => ({
      unlockedApps: s.unlockedApps.includes(app) ? s.unlockedApps : [...s.unlockedApps, app],
    })),

  solveCase: () => set({ phase: "solved" }),

  reset: () =>
    set({
      phase: "idle",
      currentCaseId: null,
      discoveredClues: [],
      completedObjectives: [],
      unlockedApps: DEFAULT_APPS,
    }),
}));
