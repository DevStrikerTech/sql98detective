import { cn } from "@/lib/utils";
import { Win98Icon, type IconName } from "./Win98Icon";
import type { AppId } from "@/lib/win98/windowStore";

type Props = {
  onOpenApp: (app: AppId) => void;
  onShutdown: () => void;
  onNotImplemented: (what: string) => void;
  onClose: () => void;
};

type Item = {
  label: string;
  icon: IconName;
  arrow?: boolean;
  action: () => void;
};

export function StartMenu({ onOpenApp, onShutdown, onNotImplemented, onClose }: Props) {
  const run = (fn: () => void) => () => {
    fn();
    onClose();
  };

  const top: Item[] = [
    { label: "Programs", icon: "programs", arrow: true, action: () => onOpenApp("sql-exe") },
    { label: "Case Files", icon: "case-files", action: () => onOpenApp("case-files") },
    { label: "Inbox", icon: "inbox", action: () => onOpenApp("inbox") },
    { label: "Settings", icon: "settings", arrow: true, action: () => onNotImplemented("Settings") },
    { label: "Find Suspect...", icon: "find", action: () => onNotImplemented("Find") },
    { label: "Help", icon: "help", action: () => onOpenApp("about") },
    { label: "Run...", icon: "sql-exe", action: () => onNotImplemented("Run") },
  ];

  return (
    <div className="win98-out anim-snap-open absolute bottom-[28px] left-0 z-[8000] flex w-[210px] bg-surface p-[3px]">
      <div className="win98-titlebar-active flex w-[22px] shrink-0 items-end justify-center pb-3">
        <span
          className="text-[13px] font-bold whitespace-nowrap text-title-ink"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          SQL<span className="font-normal opacity-80">98</span>
        </span>
      </div>
      <div className="flex-1">
        {top.map((item) => (
          <MenuRow key={item.label} item={item} onRun={run} />
        ))}
        <div className="my-[3px] border-t border-surface-shadow border-b border-b-surface-hilite" />
        <MenuRow
          item={{ label: "Shut Down...", icon: "shutdown", action: onShutdown }}
          onRun={run}
        />
      </div>
    </div>
  );
}

function MenuRow({ item, onRun }: { item: Item; onRun: (fn: () => void) => () => void }) {
  return (
    <button
      type="button"
      onClick={onRun(item.action)}
      className={cn(
        "group flex w-full items-center gap-2 px-[6px] py-[4px] text-left",
        "hover:bg-select hover:text-select-ink",
      )}
    >
      <Win98Icon name={item.icon} size={20} />
      <span className="flex-1 text-[11px]">{item.label}</span>
      {item.arrow && <span className="text-[9px]">▶</span>}
    </button>
  );
}
