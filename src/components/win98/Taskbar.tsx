import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Icon } from "./Win98Icon";
import type { WindowState } from "@/lib/win98/windowStore";

type Props = {
  windows: WindowState[];
  activeId: string | null;
  startOpen: boolean;
  flashingId: string | null;
  onToggleStart: () => void;
  onTaskClick: (id: string) => void;
};

export function Taskbar({
  windows,
  activeId,
  startOpen,
  flashingId,
  onToggleStart,
  onTaskClick,
}: Props) {
  const clock = useClock();

  return (
    <div className="win98-out absolute inset-x-0 bottom-0 z-[7000] flex h-[28px] items-center gap-[3px] border-b-0 bg-surface px-[2px]">
      <button
        type="button"
        onClick={onToggleStart}
        className={cn(
          "flex h-[22px] items-center gap-[4px] bg-surface px-[4px] text-[11px] font-bold",
          startOpen ? "win98-in pt-[1px] pl-[5px]" : "win98-out",
        )}
      >
        <Win98Icon name="start" size={16} />
        Start
      </button>

      <div className="mx-[2px] h-[20px] w-[3px] border-l border-surface-shadow border-r border-r-surface-hilite" />

      <div className="flex min-w-0 flex-1 items-center gap-[3px]">
        {windows.map((w) => {
          const isActive = w.id === activeId && !w.minimized;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => onTaskClick(w.id)}
              className={cn(
                "flex h-[22px] w-[150px] min-w-0 items-center gap-[4px] bg-surface px-[4px] text-left text-[11px]",
                isActive ? "win98-in pt-[1px] pl-[5px] font-bold" : "win98-out",
                w.id === flashingId && "anim-flash",
              )}
            >
              <Win98Icon name={w.icon} size={14} />
              <span className="truncate">{w.title}</span>
            </button>
          );
        })}
      </div>

      <div className="win98-in flex h-[22px] shrink-0 items-center gap-[6px] px-[6px]">
        <Win98Icon name="speaker" size={14} />
        <Win98Icon name="find" size={14} />
        <span className="text-[11px] text-ink tabular-nums">{clock}</span>
      </div>
    </div>
  );
}

function useClock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }),
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return now;
}
