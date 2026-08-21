import { useEffect, useState } from "react";
import { bootLines } from "@/content/boot";

type Phase = "bios" | "splash";

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("bios");

  useEffect(() => {
    if (phase !== "bios") return;
    if (count >= bootLines.length) {
      const t = setTimeout(() => setPhase("splash"), 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c + 1), count === 0 ? 260 : 130);
    return () => clearTimeout(t);
  }, [count, phase]);

  useEffect(() => {
    if (phase !== "splash") return;
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  if (phase === "bios") {
    return (
      <button
        type="button"
        onClick={onDone}
        className="absolute inset-0 z-[9500] w-full cursor-default bg-boot p-6 text-left font-mono text-[13px] leading-[1.5] text-terminal-ink"
        aria-label="Skip boot sequence"
      >
        {bootLines.slice(0, count).map((l, i) => (
          <div key={i}>{l || " "}</div>
        ))}
        <span className="anim-blink">█</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onDone}
      className="anim-flicker absolute inset-0 z-[9500] flex w-full cursor-default flex-col items-center justify-center bg-boot"
      aria-label="Skip splash screen"
    >
      <div className="text-center">
        <div className="text-[46px] leading-none font-bold tracking-tight text-surface-hilite">
          SQL<span className="text-terminal-ink">98</span>
        </div>
        <div className="mt-2 text-[13px] tracking-[0.35em] text-surface-light uppercase">
          Digital Detective
        </div>
      </div>
      <div className="win98-in mt-10 h-[16px] w-[240px] overflow-hidden bg-surface">
        <div className="win98-marquee-bar h-full w-full" />
      </div>
      <div className="mt-3 text-[11px] text-surface-light">Starting up your investigation...</div>
    </button>
  );
}
