import { create } from "zustand";
import type { IconName } from "@/components/win98/Win98Icon";
import type { AppId } from "@/lib/win98/windowStore";

export type ShellDialog = {
  title: string;
  message: string;
  icon?: IconName;
  okLabel?: string;
  cancelLabel?: string;
  onOk?: () => void;
};

export type AssistantLine = { id: number; text: string };

type ShellStore = {
  dialog: ShellDialog | null;
  assistant: AssistantLine | null;
  flashApp: AppId | null;
  /** Sound hooks — wired to no-ops for now, easy to swap for real audio. */
  playCue: (cue: SoundCue) => void;

  showDialog: (d: ShellDialog) => void;
  closeDialog: () => void;
  say: (text: string) => void;
  clearAssistant: () => void;
  setFlashApp: (app: AppId | null) => void;
};

export type SoundCue =
  | "boot"
  | "message"
  | "error"
  | "query"
  | "evidence"
  | "solved";

let lineSeq = 0;

export const useShellStore = create<ShellStore>((set) => ({
  dialog: null,
  assistant: null,
  flashApp: null,

  // Placeholder: no audio infrastructure in this milestone.
  playCue: () => {},

  showDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),
  say: (text) => set({ assistant: { id: ++lineSeq, text } }),
  clearAssistant: () => set({ assistant: null }),
  setFlashApp: (app) => set({ flashApp: app }),
}));
