import { useEffect, useState } from "react";
import { useShellStore } from "@/lib/game/shellStore";

/** Full-screen CRT reactions: a hard flicker or a monitor shudder. */
export function ScreenFxLayer() {
  const fx = useShellStore((s) => s.screenFx);
  const [active, setActive] = useState<typeof fx>(null);

  useEffect(() => {
    if (!fx) return;
    setActive(fx);
    const t = window.setTimeout(() => setActive(null), fx.kind === "shake" ? 420 : 320);
    return () => window.clearTimeout(t);
  }, [fx]);

  if (!active) return null;

  return (
    <div
      key={active.id}
      className={
        active.kind === "flicker"
          ? "anim-crt-burst pointer-events-none absolute inset-0 z-[9600] bg-surface-hilite"
          : "anim-scanline-sweep pointer-events-none absolute inset-0 z-[9600]"
      }
    />
  );
}
