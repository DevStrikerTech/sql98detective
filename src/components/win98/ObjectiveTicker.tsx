import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Icon } from "./Win98Icon";
import { useGameStore } from "@/lib/game/gameStore";
import { currentObjective } from "@/lib/game/objective";

/**
 * A pinned "note to self" strip above the taskbar. In-universe guidance:
 * always tells the detective the next move without turning into a tutorial.
 */
export function ObjectiveTicker() {
  const phase = useGameStore((s) => s.phase);
  const caseConfig = useGameStore((s) => s.caseConfig);
  const discovered = useGameStore((s) => s.discoveredClues);
  const sqlUnlocked = useGameStore((s) => s.sqlUnlocked);
  const [collapsed, setCollapsed] = useState(false);
  const [pulse, setPulse] = useState(false);

  const obj = currentObjective({
    phase,
    discoveredCount: discovered.length,
    sqlUnlocked,
    caseConfig,
  });

  useEffect(() => {
    setPulse(true);
    const t = window.setTimeout(() => setPulse(false), 1400);
    return () => window.clearTimeout(t);
  }, [obj.code]);

  if (phase === "idle" || !caseConfig) return null;

  return (
    <div className="absolute bottom-[34px] left-2 z-[8400] w-[280px]">
      <div className={cn("win98-out bg-surface p-[2px]", pulse && "anim-flash")}>
        <div className="win98-titlebar-active flex items-center gap-1 px-[3px] py-[1px]">
          <Win98Icon name="case-files" size={12} />
          <span className="flex-1 text-[11px] font-bold tracking-[0.1em] text-title-ink">
            CASE {caseConfig.id} — {obj.code}
          </span>
          <button
            type="button"
            aria-label={collapsed ? "Expand objective" : "Collapse objective"}
            onClick={() => setCollapsed((c) => !c)}
            className="win98-out h-[14px] w-[14px] bg-surface text-[9px] leading-none text-ink"
          >
            {collapsed ? "▲" : "▼"}
          </button>
        </div>
        {!collapsed && (
          <div className="win98-field m-[2px] p-2">
            <div className="text-[11px] leading-[1.45] text-ink">
              <span className="anim-blink mr-1 font-bold">▸</span>
              {obj.text}
            </div>
            {(sqlUnlocked || phase === "revealed") && phase !== "solved" && (
              <div className="mt-1 win98-in bg-field px-[5px] py-[1px] text-[11px] font-bold tracking-[0.14em] text-ink">
                <span className="anim-blink">●</span>{" "}
                {phase === "revealed" ? "NAME IN HAND — CLOSE IT" : "CLOSING IN — PROOF PENDING"}
              </div>
            )}
            <div className="mt-1 flex items-center justify-between gap-2 text-[11px] tracking-[0.1em] text-ink-disabled">
              <span>LOCATION: {obj.where.toUpperCase()}</span>
              <span className="font-bold text-ink">
                {caseConfig.clues.map((c) => (discovered.includes(c.id) ? "■" : "□")).join(" ")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
