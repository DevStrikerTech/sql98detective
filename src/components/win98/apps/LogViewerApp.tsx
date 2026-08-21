import { useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Button } from "../Win98Button";
import { Win98Icon } from "../Win98Icon";
import {
  accessLogs,
  clues,
  logCrossRefs,
  logNotes,
  suspects,
  TIMELINE_END,
  TIMELINE_START,
  type AccessLog,
} from "@/content/case001";
import { useGameStore } from "@/lib/game/gameStore";
import { useShellStore } from "@/lib/game/shellStore";
import { useWindowStore } from "@/lib/win98/windowStore";

export function LogViewerApp() {
  const [sel, setSel] = useState<number | null>(null);
  const [examined, setExamined] = useState<number[]>([]);
  const phase = useGameStore((s) => s.phase);
  const discoverClue = useGameStore((s) => s.discoverClue);
  const sqlUnlocked = useGameStore((s) => s.sqlUnlocked);
  const unlockSql = useGameStore((s) => s.unlockSql);
  const showDialog = useShellStore((s) => s.showDialog);
  const say = useShellStore((s) => s.say);
  const setFlashApp = useShellStore((s) => s.setFlashApp);
  const playCue = useShellStore((s) => s.playCue);
  const logEvidence = useShellStore((s) => s.logEvidence);
  const fireScreenFx = useShellStore((s) => s.fireScreenFx);
  const discoveredCount = useGameStore((s) => s.discoveredClues.length);
  const openWindow = useWindowStore((s) => s.open);
  const investigating = phase !== "idle" && phase !== "offered";

  const selRow = accessLogs.find((r) => r.id === sel) ?? null;
  const selSuspect = selRow ? suspects.find((s) => s.id === selRow.user) : undefined;

  const inspectRow = (row: AccessLog) => {
    setSel(row.id);
    setExamined((e) => (e.includes(row.id) ? e : [...e, row.id]));
    playCue("query");
    if (!investigating) return;
    if (row.user === "kevin" && row.file === "payroll.xls") {
      const isNew = discoverClue("kevin-timing");
      if (isNew) {
        const clue = clues.find((c) => c.id === "kevin-timing");
        fireScreenFx("flicker");
        playCue("evidence");
        setFlashApp("case-files");
        logEvidence({
          label: clue?.label ?? "Kevin's record",
          detail: clue?.detail ?? `DELETE payroll.xls @ ${row.time}`,
          index: Math.min(discoveredCount + 1, clues.length),
          total: clues.length,
        });
        window.setTimeout(() => {
          showDialog({
            title: "EVIDENCE FOUND",
            message:
              `Record #${row.id}\n\nUSER: ${row.user}\nFILE: ${row.file}\nACTION: ${row.action}\nTIME: ${row.time}\n\n` +
              'KEVIN, ON RECORD: "I never touched payroll.xls."\nTHE MACHINE, ON RECORD: 09:21.\n\nOne of them is a computer.',
            icon: "case-files",
            okLabel: "ADD TO CASE FILE",
            onOk: () => {
              if (!sqlUnlocked) {
                unlockSql();
                setFlashApp("sql-exe");
                openWindow("sql-exe");
                window.setTimeout(() => {
                  fireScreenFx("flicker");
                  showDialog({
                    title: "DATABASE QUERY ACCESS ENABLED",
                    message:
                      "Sufficient evidence collected.\n\nSQL.exe may now interrogate file_access_logs.\n\nA log entry is a rumour. A query result is testimony.",
                    icon: "sql-exe",
                    okLabel: "OPEN SQL.exe",
                  });
                }, 480);
                say("Query engine online. Time to ask the records a direct question.");
              }
            },
          });
        }, 520);
      }
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[3px]">
      <div className="win98-groove shrink-0 bg-surface px-2 py-1 text-[11px] text-ink">
        C:\OFFICE\LOGS\file_access.log — {accessLogs.length} records · {examined.length} examined
      </div>

      {/* The morning, laid out end to end. Click a tick to pull the record. */}
      <div className="win98-groove shrink-0 bg-surface px-2 pt-[3px] pb-1">
        <div className="mb-[3px] text-[11px] tracking-[0.14em] text-ink-disabled">
          THE MORNING — 09:10 TO 09:25
        </div>
        <div className="win98-in relative h-[22px] bg-field">
          {accessLogs.map((r, idx) => {
            const [h, m] = r.time.split(":").map(Number);
            const pct = ((h! * 60 + m! - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100;
            const sameTimeBefore = accessLogs.slice(0, idx).filter((p) => p.time === r.time).length;
            const isExamined = examined.includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                title={`RECORD #${r.id} — click to examine`}
                onClick={() => inspectRow(r)}
                style={{ left: `calc(${pct}% + ${sameTimeBefore * 9}px)` }}
                className={cn(
                  "absolute top-[3px] h-[16px] w-[7px] -translate-x-1/2 border border-surface-shadow",
                  isExamined && r.action === "DELETE" ? "bg-destructive" : "bg-surface-hilite",
                  sel === r.id && "anim-blink border-ink",
                  !isExamined && "opacity-60",
                )}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[11px] text-ink-disabled">
          <span>09:10</span>
          <span>one tick = one record. Click to pull it.</span>
          <span>09:25</span>
        </div>
      </div>

      <div className="win98-field win98-scroll min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {["", "ID", "USER", "FILE", "ACTION", "TIME"].map((h, i) => (
                <th
                  key={i}
                  className="win98-out sticky top-0 bg-surface px-[4px] py-[2px] text-left font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono">
            {accessLogs.map((r) => (
              <tr
                key={r.id}
                onClick={() => inspectRow(r)}
                className={cn(
                  "cursor-default hover:bg-surface-hilite",
                  sel === r.id ? "bg-select text-select-ink" : "text-ink",
                )}
              >
                <td className="w-[16px] px-[3px] py-[1px]">{examined.includes(r.id) ? "»" : ""}</td>
                <td className="px-[4px] py-[1px]">{r.id}</td>
                <td className="px-[4px] py-[1px]">{r.user}</td>
                <td className="px-[4px] py-[1px]">{r.file}</td>
                <td
                  className={cn(
                    "px-[4px] py-[1px]",
                    r.action === "DELETE" && examined.includes(r.id) && "font-bold",
                  )}
                >
                  {r.action}
                </td>
                <td className="px-[4px] py-[1px]">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Examination pane — the detective's magnifying glass over one record. */}
      <div className="win98-in shrink-0 bg-field p-2">
        {selRow ? (
          <div key={selRow.id} className="anim-redraw flex gap-2">
            <Win98Icon name="find" size={20} />
            <div className="min-w-0 text-[11px] leading-[1.5]">
              <div className="font-bold text-ink">
                RECORD #{selRow.id} — {selRow.user} · {selRow.action} · {selRow.time}
              </div>
              <div className="text-ink">{logNotes[selRow.id]}</div>
              {logCrossRefs[selRow.id] && (
                <div className="anim-typeout mt-[2px] border-l-2 border-surface-shadow pl-[5px] text-ink">
                  {logCrossRefs[selRow.id]}
                </div>
              )}
              {selSuspect && (
                <div className="mt-[2px] text-ink-disabled">
                  <b className="text-ink">{selSuspect.name} SAYS:</b> {selSuspect.statement}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-ink-disabled">
            Click a record to examine it. Records do not lie; people do.
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="win98-in flex-1 truncate px-[5px] py-[2px] text-[11px] text-ink-disabled">
          {examined.length === accessLogs.length
            ? "All six records examined. The pattern is doing most of the work now."
            : `${accessLogs.length - examined.length} record(s) not yet examined`}
        </div>
        <Win98Button onClick={() => openWindow("sql-exe")}>Query...</Win98Button>
      </div>
    </div>
  );
}
