import { useCallback, useEffect, useState } from "react";
import { DesktopIcon } from "./DesktopIcon";
import { DesktopWindow } from "./DesktopWindow";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { Win98Dialog } from "./Win98Dialog";
import { Assistant } from "./Assistant";
import { CaseClosed } from "./CaseClosed";
import { MyComputerApp } from "./apps/MyComputerApp";
import { InboxApp } from "./apps/InboxApp";
import { CaseFilesApp } from "./apps/CaseFilesApp";
import { SqlExeApp } from "./apps/SqlExeApp";
import { LogViewerApp } from "./apps/LogViewerApp";
import { RecycleBinApp } from "./apps/RecycleBinApp";
import { AboutApp } from "./apps/AboutApp";
import { useWindowStore, useActiveWindowId, type AppId, type WindowState } from "@/lib/win98/windowStore";
import { useGameStore } from "@/lib/game/gameStore";
import { useShellStore } from "@/lib/game/shellStore";
import { CASE_ID, clues } from "@/content/case001";
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
  const offerCase = useGameStore((s) => s.offerCase);
  const discovered = useGameStore((s) => s.discoveredClues);
  const sqlUnlocked = useGameStore((s) => s.sqlUnlocked);

  const dialog = useShellStore((s) => s.dialog);
  const showDialog = useShellStore((s) => s.showDialog);
  const closeDialog = useShellStore((s) => s.closeDialog);
  const flashApp = useShellStore((s) => s.flashApp);
  const setFlashApp = useShellStore((s) => s.setFlashApp);
  const playCue = useShellStore((s) => s.playCue);

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [flashingId, setFlashingId] = useState<string | null>(null);
  const [frozen, setFrozen] = useState(false);
  const [reportDismissed, setReportDismissed] = useState(false);

  const openApp = useCallback(
    (app: AppId) => {
      open(app);
      setStartOpen(false);
    },
    [open],
  );

  useEffect(() => {
    const last = windows[windows.length - 1];
    if (!last) return;
    setFlashingId(last.id);
    const t = setTimeout(() => setFlashingId(null), 600);
    return () => clearTimeout(t);
  }, [windows.length]);

  /* Stage 1 — the quiet desktop, then an incoming message. */
  useEffect(() => {
    if (phase !== "idle") return;
    const t = setTimeout(() => {
      offerCase(CASE_ID);
      setFlashApp("inbox");
      playCue("message");
      showDialog({
        title: "New Message Received",
        message:
          "From: Chief Brannigan\nSubject: URGENT!!! payroll.xls IS GONE\n\nOpen the Inbox to read it.",
        icon: "mail",
        okLabel: "OK",
      });
    }, 4200);
    return () => clearTimeout(t);
  }, [phase, offerCase, setFlashApp, playCue, showDialog]);

  /* Clear icon flashing after a few blinks. */
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

  const statusFor = (app: AppId): string | undefined => {
    switch (app) {
      case "my-computer":
        return "Double-click to open";
      case "inbox":
        return phase === "idle" ? "5 message(s), 3 unread" : "6 message(s), 1 urgent";
      case "case-files":
        return phase === "idle" || phase === "offered"
          ? "No case assigned"
          : `CASE ${CASE_ID} — ${discovered.length}/${clues.length} clues`;
      case "sql-exe":
        return sqlUnlocked ? "Query engine online" : "Query engine locked";
      case "log-viewer":
        return "6 record(s)";
      case "recycle-bin":
        return "5 object(s)  1.20 MB";
      default:
        return undefined;
    }
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

      <Assistant />

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
