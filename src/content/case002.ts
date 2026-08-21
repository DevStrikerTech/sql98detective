import type { AccessLog } from "@/lib/game/sqlEngine";
import type { CaseConfig } from "./caseTypes";

/**
 * CASE 002 — THE PHANTOM PRINT JOB
 *
 * A lean, second case that proves the shell runs any case that satisfies
 * CaseConfig. It has no bespoke browsable machine; instead it collects its
 * clues through the generic "leads" surface in the Case Files app. The SQL
 * engine, warrant ceremony, reveal, and case-closed report are all reused.
 *
 * Puzzle shape matches the engine: the winning query returns exactly one row,
 * the decisive record (`correctRowId`). Two people opened q3_budget.pdf, but
 * only one sent it to the printer — that single PRINT is the unique answer.
 */

const accessLogs: AccessLog[] = [
  { id: 1, user: "margaret", file: "q3_budget.pdf", action: "OPEN", time: "14:02" },
  { id: 2, user: "margaret", file: "q3_budget.pdf", action: "CLOSE", time: "14:05" },
  { id: 3, user: "priya", file: "agenda.doc", action: "PRINT", time: "14:07" },
  { id: 4, user: "derek", file: "q3_budget.pdf", action: "OPEN", time: "14:08" },
  { id: 5, user: "derek", file: "q3_budget.pdf", action: "PRINT", time: "14:09" },
  { id: 6, user: "derek", file: "q3_budget.pdf", action: "CLOSE", time: "14:11" },
  { id: 7, user: "priya", file: "agenda.doc", action: "CLOSE", time: "14:12" },
];

export const caseConfig: CaseConfig = {
  id: "002",
  title: "THE PHANTOM PRINT JOB",
  summary:
    "Nineteen pages of q3_budget.pdf came out of PRN2 at 14:09 and nobody came to collect them. Two people had the file open that afternoon — but the log records only one of them sending it to the printer.",

  sqlTable: {
    tableName: "file_access_logs",
    rows: accessLogs,
    correctRowId: 5,
    hints: [
      "Two people opened the budget. Only one sent it to the printer.",
      "Filter by the file, then by the action: PRINT.",
      "Try:\nWHERE filename = 'q3_budget.pdf'\n  AND action = 'PRINT'",
    ],
    quips: {
      empty: "No records match. Try a different column or value.",
      correct: "One PRINT of the budget, one name attached. The out-tray has an owner.",
      all: "That is the whole afternoon. Narrow it down.",
      multiple: "More than one record. Narrow it to the budget, then to PRINT.",
    },
  },

  warrantScript: [
    "ESTABLISHING LINK TO EVIDENCE.MDB . . . OK",
    "CASE 002 — THE PHANTOM PRINT JOB",
    "AUTHORISATION: Chief Brannigan (one eyebrow raised)",
    "PRIVILEGE GRANTED: READ file_access_logs",
    "",
    "Nineteen pages came out of PRN2 at 14:09. Nobody is claiming them.",
    "Two people opened the file. Ask the log which one printed it.",
  ],

  proofBrief: [
    {
      heading: "INCIDENT",
      line: "Nineteen pages of q3_budget.pdf, uncollected, in the out-tray.",
    },
    {
      heading: "QUESTION",
      line: "Two people opened it. Who actually sent it to PRN2?",
    },
  ],

  revealScript: [
    "One PRINT of the budget. One name attached to it.",
    'DEREK, on record: "I only ever read it. I never hit print."',
    "THE LOG, on record: 14:09 — PRINT — derek — q3_budget.pdf.",
    "Margaret opened it and closed it. She never went near the printer.",
    ">>> ONE NAME OPENED IT. ONE NAME PRINTED IT. SAME NAME. <<<",
  ],

  epilogue: [
    "DEREK — retrieved his nineteen pages from the out-tray. Eventually.",
    "MARGARET — cleared. She only ever read the file.",
    "PRN2 — the out-tray was emptied, at last.",
    "Chief Brannigan — filed the budget himself. In a locked drawer.",
  ],

  clues: [
    {
      id: "unclaimed-printout",
      label: "Nineteen pages of q3_budget.pdf found uncollected at 14:12",
      detail: "The pages were warm. Someone printed them and walked away.",
    },
    {
      id: "print-logs",
      label: "Access log shows who opened the budget and who printed it",
      detail: "file_access.log records OPEN, PRINT and CLOSE events between 14:02 and 14:12.",
    },
    {
      id: "derek-print",
      label: "Only one account sent q3_budget.pdf to the printer",
      detail: "A single PRINT of q3_budget.pdf at 14:09, tied to one user.",
    },
  ],

  assignment: {
    email: {
      id: "case-002",
      from: "Chief Brannigan",
      subject: "the printer situation",
      date: "8/25/98 14:15",
      body: "DETECTIVE.\n\nPRN2 spat out nineteen pages of the Q3 budget at 14:09. Nobody has come to collect them. Finance is nervous about a budget draft sitting warm in an open tray.\n\nTwo people had that file open this afternoon. Only one of them sent it to the printer. The machine wrote down which.\n\nFind me the name. The log keeps the receipts.\n\n— Chief Brannigan\n  (standing by the out-tray, holding the pages)",
    },
    acceptSummary: "Opens CASE 002 — THE PHANTOM PRINT JOB.",
  },

  followUps: [],

  sqlPrompt: "Find who sent q3_budget.pdf to the printer.",
  sqlPlaceholder: "SELECT username\nFROM file_access_logs\nWHERE ",
  solutionHighlight: "derek",
  solveButtonLabel: "ACCUSE DEREK",

  assistantBarks: [
    "The printer never lies. It just keeps receipts.",
    "Two people opened the file. Only one printed it.",
    "Reading a file is not the same as printing it. The log knows the difference.",
    "PRN2 is jammed again. Not evidence. Just Tuesday.",
    "Someone has taped a sign to the printer. It says PLEASE.",
  ],

  leadsChatter: [
    "PRN2 status: ONLINE, RESENTFUL.",
    "Toner low. Toner has been low since March.",
    "The out-tray now has its own coffee ring.",
    "Derek has walked past the printer four times without looking at it.",
    "Somebody in Finance is refreshing the print queue like it will confess.",
    "Nineteen pages. Still warm. Still nobody's.",
  ],

  leads: [
    {
      id: "lead-out-tray",
      clueId: "unclaimed-printout",
      label: "Inspect the out-tray on PRN2",
      detail: "Nineteen warm pages of q3_budget.pdf, uncollected at 14:12.",
    },
    {
      id: "lead-print-log",
      clueId: "print-logs",
      label: "Pull the printer access log",
      detail: "Who opened q3_budget.pdf, and who actually printed it, between 14:02 and 14:12.",
    },
    {
      id: "lead-match-job",
      clueId: "derek-print",
      label: "Match the PRINT job to a name",
      detail: "One PRINT of q3_budget.pdf at 14:09, tied to a single account.",
      unlocksSql: true,
    },
  ],
};
