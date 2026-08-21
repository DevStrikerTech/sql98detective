import { cn } from "@/lib/utils";
import { Win98Icon, type IconName } from "./Win98Icon";

type Props = {
  title: string;
  icon?: IconName | undefined;
  active: boolean;
  onMinimize?: (() => void) | undefined;
  onMaximize?: (() => void) | undefined;
  onClose?: (() => void) | undefined;
  onPointerDown?: ((e: React.PointerEvent) => void) | undefined;
  onDoubleClick?: (() => void) | undefined;
};

function Glyph({ kind }: { kind: "min" | "max" | "close" }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" shapeRendering="crispEdges" aria-hidden="true">
      {kind === "min" && <rect x="1" y="6" width="6" height="2" fill="var(--color-ink)" />}
      {kind === "max" && (
        <>
          <rect x="0" y="0" width="9" height="8" fill="var(--color-ink)" />
          <rect x="1" y="2" width="7" height="5" fill="var(--color-surface)" />
        </>
      )}
      {kind === "close" && (
        <path
          d="M1 0 L4.5 3.5 L8 0 L9 1 L5.5 4.5 L9 8 L8 9 L4.5 5.5 L1 9 L0 8 L3.5 4.5 L0 1 Z"
          fill="var(--color-ink)"
        />
      )}
    </svg>
  );
}

export function TitleBar({
  title,
  icon,
  active,
  onMinimize,
  onMaximize,
  onClose,
  onPointerDown,
  onDoubleClick,
}: Props) {
  return (
    <div
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      className={cn(
        "flex h-[20px] shrink-0 items-center gap-1 px-[3px] py-[2px]",
        active ? "win98-titlebar-active" : "win98-titlebar-inactive",
      )}
    >
      {icon && (
        <span className="shrink-0">
          <Win98Icon name={icon} size={14} />
        </span>
      )}
      <span
        className={cn(
          "flex-1 truncate text-[11px] font-bold tracking-tight",
          active ? "text-title-ink" : "text-surface-light",
        )}
      >
        {title}
      </span>
      <div className="flex items-center gap-[2px]">
        <TitleButton onClick={onMinimize} label="Minimize">
          <Glyph kind="min" />
        </TitleButton>
        <TitleButton onClick={onMaximize} label="Maximize">
          <Glyph kind="max" />
        </TitleButton>
        <TitleButton onClick={onClose} label="Close" className="ml-[2px]">
          <Glyph kind="close" />
        </TitleButton>
      </div>
    </div>
  );
}

function TitleButton({
  children,
  onClick,
  label,
  className,
}: {
  children: React.ReactNode;
  onClick?: (() => void) | undefined;
  label: string;
  className?: string | undefined;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
      className={cn(
        "win98-out flex h-[16px] w-[16px] items-center justify-center bg-surface active:win98-in",
        className,
      )}
    >
      {children}
    </button>
  );
}
