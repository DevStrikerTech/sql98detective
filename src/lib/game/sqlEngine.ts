import { accessLogs, type AccessLog } from "@/content/case001";

export type SqlOutcome = {
  status: "error" | "rows";
  statusText: string;
  message?: string;
  columns: string[];
  rows: string[][];
  correct: boolean;
  quip?: string;
};

const FIELD_ALIASES: Record<string, keyof AccessLog> = {
  username: "user",
  user: "user",
  filename: "file",
  file: "file",
  action: "action",
  time: "time",
  id: "id",
};

/** Tiny simulated query engine — enough to make the investigation feel real. */
export function runQuery(raw: string): SqlOutcome {
  const q = raw.trim().replace(/\s+/g, " ");
  const lower = q.toLowerCase();

  if (!lower) {
    return err("SYNTAX ERROR", "Empty query. Even the 90s needed input.");
  }
  if (/\bdrop\b|\bdelete from\b|\btruncate\b/.test(lower)) {
    return err(
      "PERMISSION DENIED",
      "You are investigating a deletion. Let's not add to the pile.",
      "Destroying the evidence is traditionally the suspect's job.",
    );
  }
  if (!lower.startsWith("select")) {
    return err("SYNTAX ERROR", "Expected SELECT at start of statement.", "Queries begin with SELECT. It's the law. Sort of.");
  }
  if (!/\bfrom\b/.test(lower)) {
    return err("SYNTAX ERROR", "Missing FROM clause.", "SELECT what, from where exactly?");
  }
  const tableMatch = lower.match(/from\s+([a-z_0-9]+)/);
  const table = tableMatch?.[1] ?? "";
  if (table !== "file_access_logs") {
    return err(
      "TABLE NOT FOUND",
      `Unknown table '${table || "?"}'. Available tables: file_access_logs`,
      "There is exactly one table on this machine. Try it.",
    );
  }

  const selectPart = lower.slice(6, lower.indexOf(" from")).trim();
  const wherePart = lower.includes(" where") ? lower.slice(lower.indexOf(" where") + 7) : "";

  const conditions: { field: keyof AccessLog; value: string }[] = [];
  let bad: string | null = null;
  for (const m of wherePart.matchAll(/([a-z_]+)\s*=\s*'([^']*)'/g)) {
    const field = FIELD_ALIASES[m[1]!];
    if (!field) bad = m[1]!;
    else conditions.push({ field, value: m[2]!.toLowerCase() });
  }
  if (bad) {
    return err(
      "UNKNOWN COLUMN",
      `Column '${bad}' does not exist. Columns: id, username, filename, action, time`,
      "Close. Wrong column though.",
    );
  }
  if (wherePart && conditions.length === 0) {
    return err(
      "SYNTAX ERROR",
      "WHERE clause could not be parsed. Values must be quoted, like 'payroll.xls'.",
      "Wrap your values in single quotes. The parser is fragile and it is 1998.",
    );
  }

  const matched = accessLogs.filter((row) =>
    conditions.every((c) => String(row[c.field]).toLowerCase() === c.value),
  );

  const wantsUser = /username|user|\*/.test(selectPart);
  const columns = selectPart.includes("*")
    ? ["ID", "USERNAME", "FILENAME", "ACTION", "TIME"]
    : wantsUser
      ? ["USERNAME"]
      : ["ID", "USERNAME", "FILENAME", "ACTION", "TIME"];

  const rows = matched.map((r) =>
    columns.length === 1 ? [r.user] : [String(r.id), r.user, r.file, r.action, r.time],
  );

  const correct = matched.length === 1 && matched[0]!.id === 5;

  let quip: string | undefined;
  if (matched.length === 0) quip = "No matching records. Somebody is either innocent or very careful.";
  else if (correct) quip = "One record. One name. Kevin appears to have SELECTed the wrong alibi.";
  else if (matched.length === accessLogs.length) quip = "Six suspects. Bold strategy.";
  else if (matched.length > 1)
    quip = "Unless everyone deleted payroll.xls, we may need to narrow that down.";

  return {
    status: "rows",
    statusText:
      matched.length === 0
        ? "NO MATCHING RECORDS"
        : `${matched.length} RECORD${matched.length === 1 ? "" : "S"} FOUND`,
    columns,
    rows,
    correct,
    ...(quip ? { quip } : {}),
  };
}

function err(statusText: string, message: string, quip?: string): SqlOutcome {
  return {
    status: "error",
    statusText,
    message,
    columns: [],
    rows: [],
    correct: false,
    ...(quip ? { quip } : {}),
  };
}

export const hints = [
  "Try filtering by filename. The one that vanished.",
  "The action you're looking for is DELETE.",
  "Try something like:\nWHERE filename = 'payroll.xls'\n  AND action = 'DELETE'",
];
