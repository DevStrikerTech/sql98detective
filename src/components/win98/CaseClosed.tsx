import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Button } from "./Win98Button";
import { TitleBar } from "./TitleBar";
import { useGameStore } from "@/lib/game/gameStore";
import { useShellStore } from "@/lib/game/shellStore";

/** The pay-off: flicker, redraw, a line-by-line report, then a big pixel stamp. */
export function CaseClosed({ onDismiss }: { onDismiss: () => void }) {
  const caseConfig = useGameStore((s) => s.caseConfig);
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const startedAt = useGameStore((s) => s.startedAt);
  const finishedAt = useGameStore((s) => s.finishedAt);
  const playCue = useShellStore((s) => s.playCue);
  const say = useShellStore((s) => s.say);
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [rows, setRows] = useState(0);
  const [epi, setEpi] = useState(0);

  const elapsed =
    startedAt && finishedAt ? Math.max(1, Math.round((finishedAt - startedAt) / 1000)) : null;
  const time = elapsed ? `${Math.floor(elapsed / 60)}m ${elapsed % 60}s` : "—";

  const report: [string, string, boolean?][] = caseConfig
    ? [
        ["CASE", caseConfig.id, true],
        ["TITLE", caseConfig.title],
        ["STATUS", "SOLVED"],
        ["TIME", time],
        ["HINTS USED", String(hintsUsed)],
        ["CONCLUSION", "Investigation complete."],
      ]
    : [];

  useEffect(() => {
    if (!caseConfig) return;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setStage(1), 550));
    report.forEach((_, i) => {
      timers.push(
        window.setTimeout(
          () => {
            setRows(i + 1);
            playCue("query");
          },
          700 + i * 190,
        ),
      );
    });
    const stampAt = 750 + report.length * 190;
    timers.push(
      window.setTimeout(() => {
        setStage(2);
        playCue("solved");
        say("Case closed.");
      }, stampAt),
    );
    timers.push(window.setTimeout(() => setStage(3), stampAt + 1500));
    caseConfig.epilogue.forEach((_, i) => {
      timers.push(
        window.setTimeout(
          () => {
            setEpi(i + 1);
            playCue("query");
          },
          stampAt + 1650 + i * 260,
        ),
      );
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseConfig, playCue, say]);

  const reportDone = rows >= report.length;

  if (!caseConfig || stage === 0) {
    return <div className="absolute inset-0 z-[9500] anim-flicker bg-surface-hilite" />;
  }

  return (
    <div className="win98-scanlines absolute inset-0 z-[9500] flex items-center justify-center bg-desktop/80">
      <div className="win98-out anim-snap-open relative w-[420px] bg-surface p-[3px]">
        <TitleBar
          title={`Case Report - CASE ${caseConfig.id}`}
          icon="case-files"
          active
          onClose={onDismiss}
        />

        <div className="relative anim-redraw win98-field m-[3px] p-4">
          <div className="text-[11px] tracking-[0.2em] text-ink-disabled">
            PRECINCT DATA SYSTEMS — CASE {caseConfig.id}
          </div>
          <div className="mb-3 text-[15px] font-bold tracking-wide text-ink">
            {caseConfig.title}
          </div>

          {report.slice(0, rows).map(([label, value, bold]) => (
            <Row key={label} label={label} value={value} bold={bold ?? false} />
          ))}
          {rows < report.length && (
            <div className="py-[3px] text-[11px] text-ink-disabled">
              COMPILING REPORT<span className="anim-blink">_</span>
            </div>
          )}

          {stage === 2 && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="anim-stamp border-[6px] border-destructive px-4 py-2 text-[34px] leading-none font-bold tracking-[0.15em] text-destructive"
                style={{ transform: "rotate(-11deg)" }}
              >
                CASE CLOSED
              </div>
            </div>
          )}
        </div>

        {stage === 3 && (
          <div className="win98-groove anim-snap-open mx-[3px] mb-2 flex items-start gap-2 bg-surface p-2">
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-[11px] tracking-[0.2em] text-ink-disabled">EPILOGUE</div>
              {caseConfig &&
                caseConfig.epilogue.slice(0, epi).map((line) => (
                  <div
                    key={line}
                    className="anim-typeout py-[1px] text-[11px] leading-[1.45] text-ink"
                  >
                    — {line}
                  </div>
                ))}
            </div>
            <div
              className="anim-stamp mt-3 mr-1 shrink-0 border-[3px] border-destructive px-2 py-[2px] text-[13px] leading-none font-bold tracking-[0.14em] text-destructive opacity-80"
              style={{ transform: "rotate(-11deg)" }}
            >
              CASE CLOSED
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-1 pb-3">
          <Win98Button
            onClick={onDismiss}
            className={cn("font-bold", stage >= 2 && "anim-pulse-border")}
          >
            {reportDone ? "RETURN TO DESKTOP" : "STAND DOWN"}
          </Win98Button>
          <span className="text-[11px] tracking-[0.1em] text-ink-disabled">
            {stage >= 3
              ? "Report filed. Chief Brannigan has been notified, loudly."
              : reportDone
                ? "Signing the report . . ."
                : "Stenographer is still typing."}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold: boolean }) {
  return (
    <div className="anim-typeout flex gap-2 border-b border-dotted border-surface-shadow py-[3px] text-[11px]">
      <span className="w-[130px] shrink-0 tracking-[0.1em] text-ink-disabled">{label}</span>
      <span className={bold ? "font-bold text-ink" : "text-ink"}>{value}</span>
    </div>
  );
}
