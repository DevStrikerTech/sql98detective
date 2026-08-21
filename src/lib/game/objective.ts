import type { GamePhase } from "./gameStore";
import type { CaseConfig } from "@/content/caseTypes";

export type Objective = { code: string; text: string; where: string };

/** Single source of truth for "what do I do next" — shown in the dossier and the ticker. */
export function currentObjective(args: {
  phase: GamePhase;
  discoveredCount: number;
  sqlUnlocked: boolean;
  caseConfig?: CaseConfig | null;
}): Objective {
  const { phase, discoveredCount, sqlUnlocked, caseConfig } = args;
  if (phase === "idle")
    return {
      code: "STANDBY",
      text: "No active case. The coffee is cold and so is the trail.",
      where: "Desktop",
    };
  if (phase === "offered")
    return {
      code: "OBJ-00",
      text: "The Chief is standing near your desk. Read the message. Take the case.",
      where: "Inbox",
    };
  if (phase === "solved")
    return {
      code: "CLOSED",
      text: "Case closed. File it before the Chief invents another one.",
      where: "Case Files",
    };
  if (phase === "revealed")
    return {
      code: "OBJ-04",
      text: "The log said it out loud. Now you do. On the record, no hedging.",
      where: "SQL.exe",
    };
  if (sqlUnlocked)
    return {
      code: "OBJ-03",
      text: caseConfig
        ? `Suspicion is free. Proof costs one query. ${caseConfig.sqlPrompt}`
        : "Suspicion is free. Proof costs one query. Ask the record directly.",
      where: "SQL.exe",
    };

  // Lean cases collect their clues by pursuing leads in the Case Files app.
  if (caseConfig?.leads) {
    const total = caseConfig.leads.length;
    return {
      code: "OBJ-01",
      text: `Pursue the leads and file the evidence — ${discoveredCount} of ${total} so far.`,
      where: "Case Files",
    };
  }

  if (discoveredCount === 0)
    return {
      code: "OBJ-01",
      text: "Start where the file was. C:\\OFFICE\\DOCUMENTS.",
      where: "My Computer",
    };
  if (discoveredCount === 1)
    return {
      code: "OBJ-02",
      text: "The machine wrote the morning down. Find C:\\OFFICE\\LOGS\\.",
      where: "My Computer",
    };
  return {
    code: "OBJ-02B",
    text: "Read every record. Somebody signed their name to something.",
    where: "Log Viewer",
  };
}
