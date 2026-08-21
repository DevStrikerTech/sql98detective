import { useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Icon } from "../Win98Icon";
import { drives } from "@/content/drives";

export function MyComputerApp() {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="win98-field win98-scroll flex-1 overflow-auto p-2">
      <div className="flex flex-wrap content-start gap-[2px]">
        {drives.map((d) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setSel(d.name)}
            className="flex w-[110px] flex-col items-center gap-1 p-2 text-center"
          >
            <Win98Icon name={d.icon} size={32} />
            <span
              className={cn(
                "px-[2px] text-[11px] leading-tight",
                sel === d.name ? "bg-select text-select-ink" : "text-ink",
              )}
            >
              {d.name}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-3 border-t border-surface-shadow pt-2 text-[11px] text-ink-disabled">
        {sel ? drives.find((d) => d.name === sel)?.detail : "7 object(s)"}
      </div>
    </div>
  );
}
