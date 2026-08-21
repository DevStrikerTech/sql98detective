import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TitleBar } from "./TitleBar";
import type { WindowState } from "@/lib/win98/windowStore";

type Props = {
  win: WindowState;
  active: boolean;
  children: React.ReactNode;
  menus?: string[] | undefined;
  statusText?: string | undefined;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onToggleMaximize: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
};

const TASKBAR_H = 28;

export function DesktopWindow({
  win,
  active,
  children,
  menus,
  statusText,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
}: Props) {
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (!drag.current) return;
      const x = Math.max(-40, e.clientX - drag.current.dx);
      const y = Math.max(0, Math.min(window.innerHeight - TASKBAR_H - 24, e.clientY - drag.current.dy));
      onMove(win.id, x, y);
    }
    function onPointerUp() {
      drag.current = null;
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [win.id, onMove]);

  if (win.minimized) return null;

  const style: React.CSSProperties = win.maximized
    ? { left: 0, top: 0, width: "100%", height: `calc(100% - ${TASKBAR_H}px)`, zIndex: win.z }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.z };

  return (
    <div
      role="dialog"
      aria-label={win.title}
      style={style}
      onPointerDown={() => onFocus(win.id)}
      className={cn(
        "win98-out anim-snap-open absolute flex flex-col bg-surface p-[3px]",
        active && "shadow-none",
      )}
    >
      <TitleBar
        title={win.title}
        icon={win.icon}
        active={active}
        onPointerDown={(e) => {
          if (win.maximized) return;
          drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
          onFocus(win.id);
        }}
        onDoubleClick={() => onToggleMaximize(win.id)}
        onMinimize={() => onMinimize(win.id)}
        onMaximize={() => onToggleMaximize(win.id)}
        onClose={() => onClose(win.id)}
      />

      {menus && menus.length > 0 && (
        <div className="flex h-[18px] items-center border-b border-surface-shadow px-[2px]">
          {menus.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setOpenMenu(openMenu === m ? null : m)}
              onBlur={() => setOpenMenu(null)}
              className={cn(
                "px-[7px] py-[2px] text-[11px]",
                openMenu === m ? "bg-select text-select-ink" : "hover:bg-surface-light",
              )}
            >
              <span className="underline decoration-1 underline-offset-2">{m.charAt(0)}</span>
              {m.slice(1)}
            </button>
          ))}
        </div>
      )}

      <div className="anim-redraw relative flex min-h-0 flex-1 flex-col">{children}</div>

      {statusText !== undefined && (
        <div className="mt-[3px] flex h-[18px] shrink-0 items-center gap-[3px]">
          <div className="win98-in flex-1 truncate px-[5px] py-[1px] text-[11px] text-ink">
            {statusText}
          </div>
          <div className="win98-in h-full w-[16px]" />
        </div>
      )}
    </div>
  );
}
