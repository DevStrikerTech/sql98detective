import type { AccessLog } from "@/lib/game/sqlEngine";
import type { CaseConfig } from "./caseTypes";

/**
 * CASE 002 — THE PHANTOM PRINT JOB
 *
 * Stub. Content is intentionally skeletal — this file proves the architecture
 * can support a second case without modifying any generic shell or Win98
 * primitive. To ship Case 002, fill in the narrative below and wire the
 * gameStore to accept a CaseConfig parameter in startCase().
 *
 * The SQL engine, query logic, hint system, and reveal ceremony are fully
 * reusable: pass caseConfig to createSqlEngine(caseConfig.sqlTable) and the
 * components work identically.
 */

const accessLogs: AccessLog[] = [
  { id: 1, user: "margaret", file: "q3_budget.pdf", action: "OPEN", time: "14:02" },
  { id: 2, user: "margaret", file: "q3_budget.pdf", action: "PRINT", time: "14:04" },
  { id: 3, user: "margaret", file: "q3_budget.pdf", action: "CLOSE", time: "14:05" },
  { id: 4, user: "derek", file: "q3_budget.pdf", action: "OPEN", time: "14:08" },
  { id: 5, user: "derek", file: "q3_budget.pdf", action: "PRINT", time: "14:09" },
  { id: 6, user: "derek", file: "q3_budget.pdf", action: "PRINT", time: "14:09" },
  { id: 7, user: "derek", file: "q3_budget.pdf", action: "PRINT", time: "14:09" },
  { id: 8, user: "derek", file: "q3_budget.pdf", action: "CLOSE", time: "14:11" },
];

export const caseConfig: CaseConfig = {
  id: "002",
  title: "THE PHANTOM PRINT JOB",

  sqlTable: {
    tableName: "file_access_logs",
    rows: accessLogs,
    correctRowId: 5,
    hints: [
      "Filter by action. Something happened three times in one minute.",
      "The action you want is PRINT.",
      "Try:\nWHERE action = 'PRINT'\n  AND filename = 'q3_budget.pdf'",
    ],
    quips: {
      empty: "No records match. Try a different column or value.",
      correct: "Three prints in one minute. The paper trail leads somewhere obvious.",
      all: "That is the whole morning. Narrow it down.",
      multiple: "Several candidates. The one who printed three times is not subtle.",
    },
  },

  warrantScript: [
    "ESTABLISHING LINK TO EVIDENCE.MDB . . . OK",
    "CASE 002 — THE PHANTOM PRINT JOB",
    "AUTHORISATION: Chief Brannigan (one eyebrow raised)",
    "PRIVILEGE GRANTED: READ file_access_logs",
    "",
    "Nineteen pages came out of PRN2 at 14:09. Nobody is claiming them.",
    "The log knows who stood at that printer. Ask it.",
  ],

  proofBrief: [
    {
      heading: "INCIDENT",
      line: "Nineteen pages of q3_budget.pdf, uncollected, in the out-tray.",
    },
    {
      heading: "QUESTION",
      line: "Who sent three print jobs in the same minute, then walked away?",
    },
  ],

  revealScript: [
    "Three PRINT entries. Same file. Same minute. One user.",
    'DEREK, on record: "I only clicked it once. It does that sometimes."',
    "THE LOG, on record: 14:09 — PRINT — derek — q3_budget.pdf. Three times.",
    "The printer does not have a favourite suspect either.",
    ">>> ONE NAME CLICKED THREE TIMES. ONE NAME OWNS NINETEEN PAGES. <<<",
  ],

  epilogue: [
    "DEREK — retrieved his pages from the out-tray. All nineteen.",
    "PRN2 — retired. Replaced by PRN3, which is now the bad printer.",
    "q3_budget.pdf — filed in triplicate. Accidentally.",
    "Chief Brannigan — requested fewer print jobs. In writing.",
  ],

  clues: [
    {
      id: "unclaimed-printout",
      label: "Nineteen pages of q3_budget.pdf found uncollected at 14:12",
      detail: "The pages were warm. Someone printed them and walked away.",
    },
    {
      id: "print-logs",
      label: "Print log records multiple PRINT operations in the same minute",
      detail: "file_access.log shows repeated PRINT entries between 14:08 and 14:11.",
    },
    {
      id: "derek-triple",
      label: "One user sent the same print job three times",
      detail: "Three identical PRINT entries at 14:09 for q3_budget.pdf. Same account.",
    },
  ],
};
