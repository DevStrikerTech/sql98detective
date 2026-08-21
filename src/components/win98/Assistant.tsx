import { useEffect, useRef, useState } from "react";
import { Win98Icon } from "./Win98Icon";
import { useShellStore } from "@/lib/game/shellStore";
import { useGameStore } from "@/lib/game/gameStore";
import { assistantBarks } from "@/content/case001";

/** QUERY — a small, dry desktop helper. Appears briefly, then goes away. */
export function Assistant() {
  const line = useShellStore((s) => s.assistant);
  const clear = useShellStore((s) => s.clearAssistant);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!line) return;
    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setTyped(line.text.slice(0, i));
      if (i >= line.text.length) window.clearInterval(id);
    }, 18);
    const hide = window.setTimeout(clear, 7000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(hide);
    };
  }, [line, clear]);

  /* Idle muttering: QUERY gets bored while the detective reads. */
  const say = useShellStore((s) => s.say);
  const phase = useGameStore((s) => s.phase);
  const lineRef = useRef(line);
  lineRef.current = line;
  useEffect(() => {
    if (phase === "idle" || phase === "offered" || phase === "solved") return;
    let n = 0;
    const id = window.setInterval(() => {
      if (lineRef.current) return;
      say(assistantBarks[n % assistantBarks.length]!);
      n += 1;
    }, 42000);
    return () => window.clearInterval(id);
  }, [phase, say]);

  if (!line) return null;

  return (
    <div className="absolute right-2 bottom-[34px] z-[8500] w-[230px]">
      <div className="win98-out anim-snap-open bg-surface p-[3px]">
        <div className="win98-titlebar-active flex items-center gap-1 px-[3px] py-[2px]">
          <Win98Icon name="info" size={12} />
          <span className="flex-1 text-[11px] font-bold text-title-ink">QUERY.hlp</span>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={clear}
            className="win98-out h-[14px] w-[14px] bg-surface text-[9px] leading-none"
          >
            x
          </button>
        </div>
        <div className="flex gap-2 p-2">
          <Win98Icon name="sql-exe" size={24} />
          <p className="min-h-[42px] flex-1 text-[11px] leading-[1.45] text-ink">
            {typed}
            <span className="anim-blink">_</span>
          </p>
        </div>
      </div>
    </div>
  );
}
