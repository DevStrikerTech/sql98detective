import { useEffect, useState } from "react";
import { Win98Button } from "./Win98Button";
import { TitleBar } from "./TitleBar";
import { CASE_ID, CASE_TITLE } from "@/content/case001";
import { useGameStore } from "@/lib/game/gameStore";

/** The pay-off: flicker, redraw, then a big pixel CASE CLOSED stamp. */
export function CaseClosed({ onDismiss }: { onDismiss: () => void }) {
  const hintsUsed = useGameStore((s) => s.hintsUsed);
  const startedAt = useGameStore((s) => s.startedAt);
  const finishedAt = useGameStore((s) => s.finishedAt);
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const a = window.setTimeout(() => setStage(1), 550);
    const b = window.setTimeout(() => setStage(2), 1250);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  const elapsed =
    startedAt && finishedAt ? Math.max(1, Math.round((finishedAt - startedAt) / 1000)) : null;
  const time = elapsed ? `${Math.floor(elapsed / 60)}m ${elapsed % 60}s` : "—";

  if (stage === 0) {
    return <div className="absolute inset-0 z-[9500] anim-flicker bg-surface-hilite" />;
  }

  return (
    <div className="absolute inset-0 z-[9500] flex items-center justify-center bg-desktop/70">
      <div className="win98-out anim-snap-open relative w-[420px] bg-surface p-[3px]">
        <TitleBar title="Case Report - CASE 001" icon="case-files" active onClose={onDismiss} />
        <div className="anim-redraw win98-field m-[3px] p-4">
          <div className="text-[11px] tracking-[0.2em] text-ink-disabled">
            PRECINCT DATA SYSTEMS — CASE {CASE_ID}
          </div>
          <div className="mb-3 text-[15px] font-bold tracking-wide text-ink">{CASE_TITLE}</div>

          <Row label="CULPRIT" value="KEVIN" bold />
          <Row label="CAUSE" value="Deleted payroll.xls at 09:21." />
          <Row label="SQL CONCEPTS USED" value="SELECT · WHERE · AND" />
          <Row label="TIME" value={time} />
          <Row label="HINTS USED" value={String(hintsUsed)} />
          <Row label="RANK" value={hintsUsed === 0 ? "DETECTIVE FIRST CLASS" : "DETECTIVE"} />

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
        <div className="flex justify-center gap-2 pb-3">
          <Win98Button onClick={onDismiss} className="font-bold">
            RETURN TO DESKTOP
          </Win98Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex gap-2 border-b border-dotted border-surface-shadow py-[3px] text-[11px]">
      <span className="w-[130px] shrink-0 tracking-[0.1em] text-ink-disabled">{label}</span>
      <span className={bold ? "font-bold text-ink" : "text-ink"}>{value}</span>
    </div>
  );
}
