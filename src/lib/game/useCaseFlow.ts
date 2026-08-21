import { useEffect } from "react";
import { useGameStore } from "./gameStore";
import { useShellStore } from "./shellStore";
import { CASE_ID, clues } from "@/content/case001";
import { useWindowStore, type AppId } from "@/lib/win98/windowStore";

export function useCaseFlow() {
  const phase = useGameStore((s) => s.phase);
  const offerCase = useGameStore((s) => s.offerCase);
  const discovered = useGameStore((s) => s.discoveredClues);
  const sqlUnlocked = useGameStore((s) => s.sqlUnlocked);

  const showDialog = useShellStore((s) => s.showDialog);
  const setFlashApp = useShellStore((s) => s.setFlashApp);
  const playCue = useShellStore((s) => s.playCue);
  const fireScreenFx = useShellStore((s) => s.fireScreenFx);
  const say = useShellStore((s) => s.say);
  const openWindow = useWindowStore((s) => s.open);

  useEffect(() => {
    if (phase !== "idle") return;
    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        fireScreenFx("shake");
        playCue("message");
      }, 3900),
    );
    timers.push(
      window.setTimeout(() => {
        offerCase(CASE_ID);
        setFlashApp("inbox");
        fireScreenFx("flicker");
        playCue("message");
        showDialog({
          title: "!!! PRIORITY MESSAGE !!!",
          message:
            "INCOMING PRIORITY TRANSMISSION — 09:47\n\nFrom: Chief Brannigan\nSubject: URGENT!!! payroll.xls IS GONE\n\nThe Chief is typing in all caps. That is never good.\nOpen the Inbox.",
          icon: "mail",
          okLabel: "OPEN INBOX",
          onOk: () => openWindow("inbox"),
        });
        say("Priority message. Somebody upstairs is already sweating.");
      }, 4200),
    );
    return () => timers.forEach(clearTimeout);
  }, [phase, offerCase, setFlashApp, playCue, showDialog, fireScreenFx, say, openWindow]);

  const statusFor = (app: AppId): string | undefined => {
    switch (app) {
      case "my-computer":
        return "Double-click to open";
      case "inbox":
        return phase === "idle" ? "5 message(s), 3 unread" : "6 message(s), 1 urgent";
      case "case-files":
        return phase === "idle" || phase === "offered"
          ? "No case assigned  ·  folder empty"
          : `CASE ${CASE_ID} — ${discovered.length}/${clues.length} exhibits filed`;
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

  return { statusFor };
}
