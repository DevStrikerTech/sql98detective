import { useEffect } from "react";
import { Win98Icon } from "./Win98Icon";
import { useShellStore } from "@/lib/game/shellStore";

/**
 * A little evidence slip that snaps in, gets rubber-stamped, then goes away.
 * Purely presentational feedback for `logEvidence` — no game state of its own.
 */
export function EvidenceToast() {
  const evidence = useShellStore((s) => s.evidence);
  const clear = useShellStore((s) => s.clearEvidence);

  useEffect(() => {
    if (!evidence) return;
    const t = window.setTimeout(clear, 4200);
    return () => window.clearTimeout(t);
  }, [evidence, clear]);

  if (!evidence) return null;

  return (
    <div
      key={evidence.id}
      className="pointer-events-none absolute top-3 right-3 z-[8800] w-[268px]"
    >
      <div className="win98-out anim-snap-open relative bg-surface p-[3px]">
        <div className="win98-titlebar-active flex items-center gap-1 px-[3px] py-[2px]">
          <Win98Icon name="case-files" size={12} />
          <span className="flex-1 text-[11px] font-bold tracking-[0.12em] text-title-ink">
            EVIDENCE LOGGED
          </span>
        </div>
        <div className="win98-field m-[3px] overflow-hidden p-2">
          <div className="anim-redraw flex gap-2">
            <Win98Icon name="find" size={24} />
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-ink">{evidence.label}</div>
              {evidence.detail && (
                <div className="text-[11px] leading-[1.4] text-ink-disabled">{evidence.detail}</div>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 pr-[46px]">
            <span className="text-[11px] tracking-[0.1em] text-ink-disabled">CLUES</span>
            <div className="win98-in h-[10px] flex-1 bg-field p-[1px]">
              <div
                className="h-full bg-title transition-[width] duration-500"
                style={{ width: `${(evidence.index / evidence.total) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-ink">
              {evidence.index}/{evidence.total}
            </span>
          </div>

          <div
            className="anim-stamp pointer-events-none absolute right-3 bottom-2 border-[3px] border-destructive px-[6px] text-[13px] font-bold tracking-[0.18em] text-destructive opacity-90"
            style={{ transform: "rotate(-9deg)" }}
          >
            FILED
          </div>
        </div>
      </div>
    </div>
  );
}
