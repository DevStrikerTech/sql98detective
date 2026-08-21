import { create } from "zustand";
import type { AppId } from "@/lib/win98/windowStore";

export type GamePhase = "idle" | "offered" | "investigating" | "revealed" | "solved";

export type GameStore = {
  phase: GamePhase;
  currentCaseId: string | null;
  discoveredClues: string[];
  completedObjectives: string[];
  unlockedApps: AppId[];
  sqlUnlocked: boolean;
  hintsUsed: number;
  startedAt: number | null;
  finishedAt: number | null;

  offerCase: (caseId: string) => void;
  startCase: (caseId: string) => void;
  discoverClue: (clueId: string) => boolean;
  completeObjective: (objectiveId: string) => void;
  unlockApp: (app: AppId) => void;
  unlockSql: () => void;
  useHint: () => void;
  revealCulprit: () => void;
  solveCase: () => void;
  reset: () => void;
};

const DEFAULT_APPS: AppId[] = ["my-computer", "inbox", "case-files", "sql-exe", "recycle-bin"];

const INITIAL = {
  phase: "idle" as GamePhase,
  currentCaseId: null,
  discoveredClues: [] as string[],
  completedObjectives: [] as string[],
  unlockedApps: DEFAULT_APPS,
  sqlUnlocked: false,
  hintsUsed: 0,
  startedAt: null,
  finishedAt: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL,

  offerCase: (caseId) =>
    set((s) => (s.phase === "idle" ? { phase: "offered", currentCaseId: caseId } : s)),

  startCase: (caseId) =>
    set({
      phase: "investigating",
      currentCaseId: caseId,
      discoveredClues: [],
      completedObjectives: [],
      sqlUnlocked: false,
      hintsUsed: 0,
      startedAt: Date.now(),
      finishedAt: null,
    }),

  discoverClue: (clueId) => {
    if (get().discoveredClues.includes(clueId)) return false;
    set((s) => ({ discoveredClues: [...s.discoveredClues, clueId] }));
    return true;
  },

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

  unlockSql: () => set({ sqlUnlocked: true }),

  useHint: () => set((s) => ({ hintsUsed: s.hintsUsed + 1 })),

  revealCulprit: () => set((s) => (s.phase === "investigating" ? { phase: "revealed" } : s)),

  solveCase: () => set({ phase: "solved", finishedAt: Date.now() }),

  reset: () => set({ ...INITIAL }),
}));
