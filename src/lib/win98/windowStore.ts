import { create } from "zustand";
import type { IconName } from "@/components/win98/Win98Icon";

export type AppId =
  "my-computer" | "inbox" | "case-files" | "sql-exe" | "recycle-bin" | "about" | "log-viewer";

export type WindowState = {
  id: string;
  app: AppId;
  title: string;
  icon: IconName;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

export type AppDef = {
  title: string;
  icon: IconName;
  width: number;
  height: number;
};

export const APPS: Record<AppId, AppDef> = {
  "my-computer": { title: "My Computer", icon: "my-computer", width: 480, height: 320 },
  inbox: { title: "Inbox - Detective Mail", icon: "inbox", width: 560, height: 360 },
  "case-files": { title: "Case Files", icon: "case-files", width: 520, height: 430 },
  "sql-exe": { title: "SQL.exe", icon: "sql-exe", width: 580, height: 480 },
  "recycle-bin": { title: "Recycle Bin", icon: "recycle-bin", width: 460, height: 300 },
  "log-viewer": {
    title: "ACCESS_LOGS.DAT - Log Viewer",
    icon: "document",
    width: 470,
    height: 300,
  },
  about: { title: "About SQL 98", icon: "info", width: 380, height: 230 },
};

type WindowStore = {
  windows: WindowState[];
  topZ: number;

  open: (app: AppId) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  toggleFromTaskbar: (id: string) => void;
};

let seq = 0;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  topZ: 10,

  open: (app) => {
    const { windows, topZ } = get();
    const existing = windows.find((w) => w.app === app);
    if (existing) {
      get().focus(existing.id);
      return;
    }
    const def = APPS[app];
    const offset = (seq++ % 6) * 22;
    const nextZ = topZ + 1;
    set({
      topZ: nextZ,
      windows: [
        ...windows,
        {
          id: `${app}-${Date.now()}`,
          app,
          title: def.title,
          icon: def.icon,
          x: 60 + offset,
          y: 40 + offset,
          width: def.width,
          height: def.height,
          z: nextZ,
          minimized: false,
          maximized: false,
        },
      ],
    });
  },

  close: (id) => {
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) }));
  },

  focus: (id) => {
    set((s) => {
      const nextZ = s.topZ + 1;
      return {
        topZ: nextZ,
        windows: s.windows.map((w) => (w.id === id ? { ...w, z: nextZ, minimized: false } : w)),
      };
    });
  },

  minimize: (id) => {
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    }));
  },

  toggleMaximize: (id) => {
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    }));
  },

  move: (id, x, y) => {
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    }));
  },

  toggleFromTaskbar: (id) => {
    const { windows } = get();
    const win = windows.find((w) => w.id === id);
    if (!win) return;
    const isTop = windows.every((w) => w.z <= win.z);
    if (win.minimized) {
      get().focus(id);
    } else if (isTop) {
      get().minimize(id);
    } else {
      get().focus(id);
    }
  },
}));

export function useActiveWindowId(): string | null {
  return useWindowStore((s) => {
    const visible = s.windows.filter((w) => !w.minimized);
    if (visible.length === 0) return null;
    let top = visible[0]!;
    for (let i = 1; i < visible.length; i++) {
      if (visible[i]!.z > top.z) top = visible[i]!;
    }
    return top.id;
  });
}
