import { useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Button } from "../Win98Button";
import { accessLogs, clues, type AccessLog } from "@/content/case001";
import { useGameStore } from "@/lib/game/gameStore";
import { useShellStore } from "@/lib/game/shellStore";
import { useWindowStore } from "@/lib/win98/windowStore";

export function LogViewerApp() {
  const [sel, setSel] = useState<number | null>(null);
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

  const inspectRow = (row: AccessLog) => {
    setSel(row.id);
    if (!investigating) return;
    if (row.user === "kevin" && row.file === "payroll.xls") {
      const isNew = discoverClue("kevin-timing");
      if (isNew) {
        const clue = clues.find((c) => c.id === "kevin-timing");
        fireScreenFx("flicker");
        playCue("evidence");
        logEvidence({
          label: clue?.label ?? "Kevin's record",
          detail: clue?.detail ?? `DELETE payroll.xls @ ${row.time}`,
          index: Math.min(discoveredCount + 1, clues.length),
          total: clues.length,
        });
        showDialog({
          title: "EVIDENCE FOUND",
          message:
            `Record #${row.id}\n\nUSER: ${row.user}\nFILE: ${row.file}\nACTION: ${row.action}\nTIME: ${row.time}\n\n` +
            "Kevin stated he never touched payroll.xls. The log disagrees.",
          icon: "case-files",
          okLabel: "ADD TO CASE FILE",
          onOk: () => {
            if (!sqlUnlocked) {
              unlockSql();
              setFlashApp("sql-exe");
              openWindow("sql-exe");
              showDialog({
                title: "DATABASE QUERY ACCESS ENABLED",
                message:
                  "Sufficient evidence collected.\n\nSQL.exe may now interrogate file_access_logs.",
                icon: "sql-exe",
                okLabel: "OPEN SQL.exe",
              });
              say("Query engine online. Time to ask the records a direct question.");
            }
          },
        });
      }
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[3px]">
      <div className="shrink-0 text-[11px] text-ink">
        C:\OFFICE\LOGS\file_access.log — {accessLogs.length} records
      </div>
      <div className="win98-field win98-scroll min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {["ID", "USER", "FILE", "ACTION", "TIME"].map((h) => (
                <th
                  key={h}
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
                  investigating &&
                    r.user === "kevin" &&
                    r.file === "payroll.xls" &&
                    sel !== r.id &&
                    "font-bold",
                )}
              >
                <td className="px-[4px] py-[1px]">{r.id}</td>
                <td className="px-[4px] py-[1px]">{r.user}</td>
                <td className="px-[4px] py-[1px]">{r.file}</td>
                <td className="px-[4px] py-[1px]">{r.action}</td>
                <td className="px-[4px] py-[1px]">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="win98-in flex-1 truncate px-[5px] py-[2px] text-[11px] text-ink-disabled">
          {sel
            ? `Record #${sel} selected`
            : "Click a record to examine it. Records do not lie; people do."}
        </div>
        <Win98Button onClick={() => openWindow("sql-exe")}>Query...</Win98Button>
      </div>
    </div>
  );
}
