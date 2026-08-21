import { useCallback, useEffect, useRef, useState } from "react";
import { DesktopIcon } from "./DesktopIcon";
import { DesktopWindow } from "./DesktopWindow";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { Win98Dialog } from "./Win98Dialog";
import { Assistant } from "./Assistant";
import { CaseClosed } from "./CaseClosed";
import { EvidenceToast } from "./EvidenceToast";
import { ObjectiveTicker } from "./ObjectiveTicker";
import { ScreenFxLayer } from "./ScreenFxLayer";
import { FirstRunGuide } from "./FirstRunGuide";
import { MyComputerApp } from "./apps/MyComputerApp";
import { InboxApp } from "./apps/InboxApp";
import { CaseFilesApp } from "./apps/CaseFilesApp";
import { SqlExeApp } from "./apps/SqlExeApp";
import { LogViewerApp } from "./apps/LogViewerApp";
import { RecycleBinApp } from "./apps/RecycleBinApp";
import { AboutApp } from "./apps/AboutApp";
import {
  useWindowStore,
  useActiveWindowId,
  type AppId,
  type WindowState,
} from "@/lib/win98/windowStore";
import { useGameStore } from "@/lib/game/gameStore";
import { useShellStore } from "@/lib/game/shellStore";
import { useCaseFlow } from "@/lib/game/useCaseFlow";
import { caseRegistry } from "@/content/caseRegistry";
import type { IconName } from "./Win98Icon";

const desktopIcons: { app: AppId; label: string; icon: IconName }[] = [
  { app: "my-computer", label: "My Computer", icon: "my-computer" },
  { app: "inbox", label: "Inbox", icon: "inbox" },
  { app: "case-files", label: "Case Files", icon: "case-files" },
  { app: "sql-exe", label: "SQL.exe", icon: "sql-exe" },
  { app: "recycle-bin", label: "Recycle Bin", icon: "recycle-bin" },
];

const menusFor: Partial<Record<AppId, string[]>> = {
  "my-computer": ["File", "Edit", "View", "Help"],
  inbox: ["File", "Edit", "Compose", "Help"],
  "case-files": ["File", "View", "Help"],
  "sql-exe": ["File", "Query", "Options", "Help"],
  "log-viewer": ["File", "View", "Help"],
  "recycle-bin": ["File", "Edit", "View", "Help"],
};

const FIRST_RUN_KEY = "sql98-first-run-guide-v3";
const INTRO_THEME_PATH = "/audio/intro-theme.mp3";

export function Desktop() {
  const windows = useWindowStore((s) => s.windows);
  const open = useWindowStore((s) => s.open);
  const focus = useWindowStore((s) => s.focus);
  const close = useWindowStore((s) => s.close);
  const minimize = useWindowStore((s) => s.minimize);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const move = useWindowStore((s) => s.move);
  const toggleFromTaskbar = useWindowStore((s) => s.toggleFromTaskbar);
  const activeId = useActiveWindowId();

  const phase = useGameStore((s) => s.phase);
  const resetGame = useGameStore((s) => s.reset);
  const offerCase = useGameStore((s) => s.offerCase);

  const dialog = useShellStore((s) => s.dialog);
  const showDialog = useShellStore((s) => s.showDialog);
  const closeDialog = useShellStore((s) => s.closeDialog);
  const flashApp = useShellStore((s) => s.flashApp);
  const setFlashApp = useShellStore((s) => s.setFlashApp);
  const muted = useShellStore((s) => s.muted);

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [flashingId, setFlashingId] = useState<string | null>(null);
  const [frozen, setFrozen] = useState(false);
  const [reportDismissed, setReportDismissed] = useState(false);
  const [guideVisible, setGuideVisible] = useState(false);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(FIRST_RUN_KEY)) {
      setGuideVisible(true);
    }
  }, []);

  // Play intro theme while the guide is up; stop on dismiss or mute.
  useEffect(() => {
    if (!guideVisible || muted) {
      introAudioRef.current?.pause();
      return;
    }
    const audio = introAudioRef.current ?? new Audio(INTRO_THEME_PATH);
    introAudioRef.current = audio;
    audio.loop = true;
    audio.volume = 0.4;
    void audio.play().catch(() => {});
    return () => {
      audio.pause();
    };
  }, [guideVisible, muted]);

  const { statusFor } = useCaseFlow(guideVisible);

  const openApp = useCallback(
    (app: AppId) => {
      open(app);
      setStartOpen(false);
    },
    [open],
  );

  const caseList = Object.values(caseRegistry).map((c) => ({ id: c.id, title: c.title }));

  const loadCase = useCallback(
    (caseId: string) => {
      const config = caseRegistry[caseId];
      if (!config) return;
      const begin = () => {
        resetGame();
        offerCase(config.id, config);
        setFlashApp("inbox");
        open("inbox");
      };
      // A case in progress would be set aside — confirm before wiping it.
      if (phase !== "idle") {
        showDialog({
          title: "Load Case?",
          message: `Loading CASE ${config.id} — ${config.title} sets aside the current investigation.\n\nProgress is not saved.`,
          icon: "warning",
          okLabel: "LOAD CASE",
          onOk: begin,
        });
      } else {
        begin();
      }
    },
    [phase, resetGame, offerCase, setFlashApp, open, showDialog],
  );

  const dismissGuide = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(FIRST_RUN_KEY, "seen");
    }
    const audio = introAudioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setGuideVisible(false);
  }, []);

  const newestWindowId = windows[windows.length - 1]?.id ?? null;
  useEffect(() => {
    if (!newestWindowId) return;
    setFlashingId(newestWindowId);
    const t = setTimeout(() => setFlashingId(null), 600);
    return () => clearTimeout(t);
  }, [newestWindowId]);

  useEffect(() => {
    if (!flashApp) return;
    const t = setTimeout(() => setFlashApp(null), 4000);
    return () => clearTimeout(t);
  }, [flashApp, setFlashApp]);

  const notImplemented = (what: string) => {
    setFrozen(true);
    setStartOpen(false);
    setTimeout(() => {
      setFrozen(false);
      showDialog({
        title: `${what} - Error`,
        message: `${what} is not available in this build.\n\nThe responsible module is still on a floppy disk somewhere in the evidence locker.`,
      });
    }, 700);
  };

  return (
    <div
      className="win98-wallpaper relative h-screen w-screen overflow-hidden"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedIcon(null);
          setStartOpen(false);
        }
      }}
      style={frozen ? { cursor: "wait" } : undefined}
    >
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {desktopIcons.map((d) => (
          <div key={d.app} className={flashApp === d.app ? "anim-flash" : undefined}>
            <DesktopIcon
              label={d.label}
              icon={d.icon}
              selected={selectedIcon === d.app}
              onSelect={() => setSelectedIcon(d.app)}
              onOpen={() => openApp(d.app)}
            />
          </div>
        ))}
      </div>

      <div className={frozen ? "pointer-events-none" : undefined}>
        {windows.map((win) => (
          <DesktopWindow
            key={win.id}
            win={win}
            active={win.id === activeId}
            menus={menusFor[win.app]}
            statusText={statusFor(win.app)}
            onFocus={focus}
            onClose={close}
            onMinimize={minimize}
            onToggleMaximize={toggleMaximize}
            onMove={move}
          >
            {renderApp(win, notImplemented)}
          </DesktopWindow>
        ))}
      </div>

      {startOpen && (
        <StartMenu
          onOpenApp={openApp}
          onShutdown={() =>
            showDialog({
              title: "Shut Down Windows",
              message:
                "It is now safe to keep investigating.\n\n(Shutting down has been disabled by your Chief.)",
            })
          }
          onNotImplemented={notImplemented}
          onClose={() => setStartOpen(false)}
          cases={caseList}
          onLoadCase={loadCase}
        />
      )}

      <Taskbar
        windows={windows}
        activeId={activeId}
        startOpen={startOpen}
        flashingId={flashingId}
        onToggleStart={() => setStartOpen((s) => !s)}
        onTaskClick={toggleFromTaskbar}
      />

      <ObjectiveTicker />
      <EvidenceToast />
      <ScreenFxLayer />
      <Assistant />
      {guideVisible && <FirstRunGuide onBegin={dismissGuide} />}

      {dialog && (
        <Win98Dialog
          title={dialog.title}
          icon={dialog.icon ?? "warning"}
          message={<span className="whitespace-pre-wrap">{dialog.message}</span>}
          buttons={[
            {
              label: dialog.okLabel ?? "OK",
              onClick: () => {
                const cb = dialog.onOk;
                closeDialog();
                cb?.();
              },
            },
          ]}
          onClose={closeDialog}
        />
      )}

      {phase === "solved" && !reportDismissed && (
        <CaseClosed onDismiss={() => setReportDismissed(true)} />
      )}
    </div>
  );
}

function renderApp(win: WindowState, notImplemented: (what: string) => void) {
  switch (win.app) {
    case "my-computer":
      return <MyComputerApp />;
    case "inbox":
      return <InboxApp />;
    case "case-files":
      return <CaseFilesApp onRequest={notImplemented} />;
    case "sql-exe":
      return <SqlExeApp />;
    case "log-viewer":
      return <LogViewerApp />;
    case "recycle-bin":
      return <RecycleBinApp />;
    case "about":
      return <AboutApp />;
    default:
      return null;
  }
}
