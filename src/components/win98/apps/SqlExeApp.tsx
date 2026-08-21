import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Button } from "../Win98Button";
import { Win98Icon } from "../Win98Icon";
import { createSqlEngine, type SqlOutcome } from "@/lib/game/sqlEngine";
import { sqlTable } from "@/content/case001";
import { useGameStore } from "@/lib/game/gameStore";
import { useShellStore } from "@/lib/game/shellStore";

const BOOT_LINES = [
  "SQL/98 Interactive Query Console v0.9b",
  "(c) 1998 Precinct Data Systems. All rights probably reserved.",
];

export function SqlExeApp() {
  const phase = useGameStore((s) => s.phase);
  const sqlUnlocked = useGameStore((s) => s.sqlUnlocked);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const consumeHint = useGameStore((s) => s.useHint);
  const revealCulprit = useGameStore((s) => s.revealCulprit);
  const solveCase = useGameStore((s) => s.solveCase);
  const say = useShellStore((s) => s.say);
  const playCue = useShellStore((s) => s.playCue);
  const fireScreenFx = useShellStore((s) => s.fireScreenFx);

  const { runQuery, hints } = useMemo(() => createSqlEngine(sqlTable), []);

  const [query, setQuery] = useState("SELECT username\nFROM file_access_logs\nWHERE ");
  const [lines, setLines] = useState<string[]>([...BOOT_LINES, "", "READY."]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("READY");
  const [result, setResult] = useState<SqlOutcome | null>(null);
  const [revealStep, setRevealStep] = useState(0);
  const outRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => clearTimeout(t));
    },
    [],
  );

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [lines, result]);

  if (!sqlUnlocked) {
    return (
      <div className="win98-in flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-terminal p-6 text-center font-mono text-terminal-ink">
        <Win98Icon name="sql-exe" size={40} />
        <div className="text-[14px] font-bold tracking-widest">QUERY ENGINE LOCKED</div>
        <p className="max-w-[320px] text-[12px] leading-[1.6] opacity-80">
          Collect enough evidence before interrogating the records.
        </p>
        <div className="text-[12px] opacity-60">
          {phase === "idle" || phase === "offered"
            ? "No active investigation."
            : "Hint: the machine keeps logs. C:\\OFFICE\\LOGS\\"}
        </div>
        <div className="mt-2 text-[12px]">
          {"C:\\PRECINCT>"} <span className="anim-blink">_</span>
        </div>
      </div>
    );
  }

  const push = (s: string) => setLines((l) => [...l, s]);

  const execute = () => {
    if (running) return;
    playCue("query");
    setRunning(true);
    setResult(null);
    setRevealStep(0);
    setStatus("EXECUTING QUERY...");
    setLines([]);
    const steps = [
      "CONNECTING TO EVIDENCE.MDB . . .",
      "SEARCHING RECORDS . . .",
      "FILTERING . . .",
    ];
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    steps.forEach((s, i) => {
      timers.current.push(window.setTimeout(() => push(s), 300 + i * 380));
    });
    timers.current.push(
      window.setTimeout(
        () => {
          const outcome = runQuery(query);
          setResult(outcome);
          setRunning(false);
          setStatus(outcome.statusText);
          push(outcome.status === "error" ? `** ${outcome.statusText} **` : outcome.statusText);
          if (outcome.message) push(outcome.message);
          if (outcome.quip) say(outcome.quip);
          if (outcome.correct) {
            revealCulprit();
            playCue("evidence");
            fireScreenFx("flicker");
            // Let the accusation land one beat at a time.
            [800, 1750, 2700, 3700].forEach((ms, i) => {

              timers.current.push(
                window.setTimeout(() => {
                  setRevealStep(i + 1);
                  playCue(i === 3 ? "solved" : "query");
                  if (i === 3) fireScreenFx("flicker");
                }, ms),
              );
            });
          } else {
            playCue("error");
            fireScreenFx("shake");
          }
        },
        300 + steps.length * 380 + 420,
      ),
    );
  };

  const clear = () => {
    setQuery("");
    setResult(null);
    setRevealStep(0);
    setLines([...BOOT_LINES, "", "READY."]);
    setStatus("READY");
  };

  const nextHint = () => {
    const idx = Math.min(hintsUsed, hints.length - 1);
    consumeHint();
    push(`HINT ${idx + 1}: ${hints[idx]!}`);
    setStatus(`HINT ${idx + 1} OF ${hints.length}`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[3px]">
      {/* toolbar */}
      <div className="win98-out flex shrink-0 items-center gap-1 bg-surface px-1 py-[2px]">
        <Win98Button className="min-w-0 px-2" onClick={execute} disabled={running}>
          ▶ Execute
        </Win98Button>
        <Win98Button className="min-w-0 px-2" onClick={clear} disabled={running}>
          Clear
        </Win98Button>
        <div className="mx-1 h-[16px] w-[2px] border-l border-surface-shadow border-r border-r-surface-hilite" />
        <Win98Button className="min-w-0 px-2" onClick={nextHint} disabled={running}>
          Hint
        </Win98Button>
        <span className="ml-auto pr-1 text-[11px] text-ink-disabled">Table: file_access_logs</span>
      </div>

      <div className="win98-groove shrink-0 bg-surface px-2 py-1 text-[11px]">
        <b>INVESTIGATION QUERY:</b> Find the user who deleted payroll.xls.
      </div>

      <div className="shrink-0">
        <label className="mb-[3px] block text-[11px] text-ink">Query:</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
          className="win98-field win98-scroll h-[54px] w-full resize-none p-[3px] font-mono text-[12px] text-ink outline-none"
          style={running ? { cursor: "wait" } : undefined}
        />
      </div>

      <div
        ref={outRef}
        className="win98-in win98-scroll min-h-0 flex-1 overflow-auto bg-terminal p-2 font-mono text-[12px] leading-[1.45] text-terminal-ink"
        style={running ? { cursor: "wait" } : undefined}
      >
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}

        {running && (
          <div className="mt-1">
            <span className="win98-marquee-bar inline-block h-[10px] w-[120px] align-middle" />
          </div>
        )}

        {result && result.status === "rows" && result.rows.length > 0 && (
          <table className="anim-redraw mt-2 border-collapse">
            <thead>
              <tr>
                {result.columns.map((c) => (
                  <th key={c} className="border border-terminal-ink/50 px-2 text-left">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((cell, j) => (
                    <td
                      key={j}
                      className={cn(
                        "border border-terminal-ink/50 px-2",
                        result.correct &&
                          String(cell).toLowerCase() === "kevin" &&
                          "anim-blink font-bold",
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {result?.correct && revealStep > 0 && (
          <div className="mt-3 border-t border-terminal-ink/40 pt-2">
            {[
              "1 row returned. Interesting.",
              "Kevin, on record: \"I never touched payroll.xls. Not once.\"",
              "The log, on record: 09:21:04 — DELETE — kevin — payroll.xls.",
              ">>> ONE NAME MATCHES. ONE NAME LIED. <<<",
            ]
              .slice(0, revealStep)
              .map((t, i) => (
                <div
                  key={t}
                  className={cn(
                    "anim-typeout",
                    i === 3 && "mt-1 anim-flicker text-[13px] font-bold tracking-[0.12em]",
                  )}
                >
                  {t}
                </div>
              ))}
          </div>
        )}


        {!running && (
          <div className="mt-2">
            {"C:\\PRECINCT>"} <span className="anim-blink">_</span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div
          className={cn(
            "win98-in flex-1 truncate px-[5px] py-[2px] text-[11px]",
            running ? "text-ink anim-blink" : "text-ink",
          )}
        >
          {status}
        </div>
        {result?.correct && revealStep >= 4 && phase !== "solved" && (
          <Win98Button
            className="anim-pulse-border font-bold tracking-[0.1em]"
            onClick={() => {
              solveCase();
              playCue("solved");
              fireScreenFx("flicker");
            }}
          >
            ACCUSE KEVIN
          </Win98Button>
        )}
      </div>
    </div>
  );
}
