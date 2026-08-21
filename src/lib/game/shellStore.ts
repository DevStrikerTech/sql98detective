import { create } from "zustand";
import type { IconName } from "@/components/win98/Win98Icon";
import type { AppId } from "@/lib/win98/windowStore";
import { playCueSound } from "./audio";

export type ShellDialog = {
  title: string;
  message: string;
  icon?: IconName;
  okLabel?: string;
  cancelLabel?: string;
  onOk?: () => void;
};

export type AssistantLine = { id: number; text: string };

/** A short-lived "EVIDENCE LOGGED" slip that stamps itself onto the desktop. */
export type EvidenceToast = {
  id: number;
  label: string;
  detail?: string;
  index: number;
  total: number;
};

/** Full-screen retro effects: a CRT flicker or a monitor shudder. */
export type ScreenFx = { id: number; kind: "flicker" | "shake" };

type ShellStore = {
  dialog: ShellDialog | null;
  assistant: AssistantLine | null;
  flashApp: AppId | null;
  evidence: EvidenceToast | null;
  screenFx: ScreenFx | null;
  muted: boolean;
  /** Sound hooks — PC-speaker synth; swap for samples without changing callers. */
  playCue: (cue: SoundCue) => void;
  toggleMute: () => void;

  showDialog: (d: ShellDialog) => void;
  closeDialog: () => void;
  say: (text: string) => void;
  clearAssistant: () => void;
  setFlashApp: (app: AppId | null) => void;
  logEvidence: (e: Omit<EvidenceToast, "id">) => void;
  clearEvidence: () => void;
  fireScreenFx: (kind: ScreenFx["kind"]) => void;
};

export type SoundCue = "boot" | "message" | "error" | "query" | "evidence" | "solved";

let lineSeq = 0;

export const useShellStore = create<ShellStore>((set, get) => ({
  dialog: null,
  assistant: null,
  flashApp: null,
  evidence: null,
  screenFx: null,
  muted: false,

  playCue: (cue) => {
    if (get().muted) return;
    try {
      playCueSound(cue);
    } catch {
      /* audio is decoration; never break the investigation */
    }
  },
  toggleMute: () => set((s) => ({ muted: !s.muted })),

  showDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),
  say: (text) => set({ assistant: { id: ++lineSeq, text } }),
  clearAssistant: () => set({ assistant: null }),
  setFlashApp: (app) => set({ flashApp: app }),
  logEvidence: (e) => set({ evidence: { id: ++lineSeq, ...e } }),
  clearEvidence: () => set({ evidence: null }),
  fireScreenFx: (kind) => set({ screenFx: { id: ++lineSeq, kind } }),
}));
