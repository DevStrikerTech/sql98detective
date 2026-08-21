import { useEffect } from "react";
import { useGameStore } from "./gameStore";
import { useShellStore } from "./shellStore";
import { CASE_ID, clues } from "@/content/case001";
import type { AppId } from "@/lib/win98/windowStore";

export function useCaseFlow() {
  const phase = useGameStore((s) => s.phase);
  const offerCase = useGameStore((s) => s.offerCase);
  const discovered = useGameStore((s) => s.discoveredClues);
  const sqlUnlocked = useGameStore((s) => s.sqlUnlocked);

  const showDialog = useShellStore((s) => s.showDialog);
  const setFlashApp = useShellStore((s) => s.setFlashApp);
  const playCue = useShellStore((s) => s.playCue);

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

  return { statusFor };
}
