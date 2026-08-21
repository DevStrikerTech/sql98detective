import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  square?: boolean;
};

/** Classic grey beveled push button: pops out, sinks in on press. */
export function Win98Button({ className, active, square, children, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "relative bg-surface font-ui text-[11px] text-ink select-none",
        square ? "h-4 w-4 p-0" : "min-w-[75px] px-3 py-[3px]",
        active ? "win98-in" : "win98-out",
        active && "pt-[4px] pb-[2px] pl-[13px]",
        "active:win98-in active:pt-[4px] active:pb-[2px]",
        "disabled:text-ink-disabled disabled:active:win98-out disabled:active:pt-[3px]",
        "focus-visible:win98-focus-dots outline-none",
        className,
      )}
    >
      {children}
    </button>
  );
}
