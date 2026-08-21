import type { GamePhase } from "./gameStore";

export type Objective = { code: string; text: string; where: string };

/** Single source of truth for "what do I do next" — shown in the dossier and the ticker. */
export function currentObjective(args: {
  phase: GamePhase;
  discoveredCount: number;
  sqlUnlocked: boolean;
}): Objective {
  const { phase, discoveredCount, sqlUnlocked } = args;
  if (phase === "idle")
    return { code: "STANDBY", text: "No active case. Drink the cold coffee.", where: "Desktop" };
  if (phase === "offered")
    return { code: "OBJ-00", text: "Read the Chief's message and accept the case.", where: "Inbox" };
  if (phase === "solved")
    return { code: "CLOSED", text: "Case closed. File the paperwork.", where: "Case Files" };
  if (phase === "revealed")
    return { code: "OBJ-04", text: "Name your suspect. Accuse them.", where: "SQL.exe" };
  if (sqlUnlocked)
    return {
      code: "OBJ-03",
      text: "Interrogate file_access_logs for the DELETE on payroll.xls.",
      where: "SQL.exe",
    };
  if (discoveredCount === 0)
    return { code: "OBJ-01", text: "Search the office computer for evidence.", where: "My Computer" };
  if (discoveredCount === 1)
    return {
      code: "OBJ-02",
      text: "Pull the file access records in C:\\OFFICE\\LOGS\\.",
      where: "My Computer",
    };
  return {
    code: "OBJ-02B",
    text: "Read every record. Someone signed their name to a DELETE.",
    where: "Log Viewer",
  };
}
