import { cn } from "@/lib/utils";
import { Win98Icon, type IconName } from "./Win98Icon";

type Props = {
  label: string;
  icon: IconName;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
};

export function DesktopIcon({ label, icon, selected, onSelect, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onDoubleClick={onOpen}
      className="flex w-[76px] flex-col items-center gap-[3px] p-[4px] text-center outline-none"
    >
      <span className={cn(selected && "opacity-70 brightness-75")}>
        <Win98Icon name={icon} size={32} />
      </span>
      <span
        className={cn(
          "max-w-full px-[2px] text-[11px] leading-[1.15] break-words text-title-ink",
          selected ? "bg-select win98-focus-dots" : "bg-transparent",
        )}
        style={selected ? undefined : { textShadow: "1px 1px 0 rgba(0,0,0,.5)" }}
      >
        {label}
      </span>
    </button>
  );
}
