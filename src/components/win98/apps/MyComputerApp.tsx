import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Icon } from "../Win98Icon";
import { Win98Button } from "../Win98Button";
import { clues, fileSystem, precinctChatter, type FsNode } from "@/content/case001";
import type { ClueId } from "@/content/case001";

import { useGameStore } from "@/lib/game/gameStore";
import { useShellStore } from "@/lib/game/shellStore";
import { useWindowStore } from "@/lib/win98/windowStore";

export function MyComputerApp() {
  const [path, setPath] = useState<FsNode[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [chatter, setChatter] = useState(0);

  // The building keeps muttering to itself in the status bar.
  useEffect(() => {
    const id = window.setInterval(() => setChatter((c) => (c + 1) % precinctChatter.length), 9000);
    return () => window.clearInterval(id);
  }, []);

  const phase = useGameStore((s) => s.phase);
  const discoverClue = useGameStore((s) => s.discoverClue);
  const showDialog = useShellStore((s) => s.showDialog);
  const say = useShellStore((s) => s.say);
  const playCue = useShellStore((s) => s.playCue);
  const logEvidence = useShellStore((s) => s.logEvidence);
  const fireScreenFx = useShellStore((s) => s.fireScreenFx);
  const discoveredClues = useGameStore((s) => s.discoveredClues);
  const discoveredCount = discoveredClues.length;
  const openWindow = useWindowStore((s) => s.open);

  const items = path.length === 0 ? fileSystem : (path[path.length - 1]!.children ?? []);
  const location =
    path.length === 0
      ? "My Computer"
      : "C:\\" +
        path
          .slice(1)
          .map((n) => n.name)
          .join("\\");
  const selected = items.find((i) => i.name === sel) ?? null;
  const investigating = phase !== "idle" && phase !== "offered";

  const openNode = (node: FsNode) => {
    if (node.children) {
      setPath([...path, node]);
      setSel(null);
      return;
    }
    inspect(node);
  };

  /** Shared celebration for a brand-new clue: flash, chime, stamped slip. */
  const celebrate = (clueId: string) => {
    const clue = clues.find((c) => c.id === clueId);
    fireScreenFx("flicker");
    playCue("evidence");
    logEvidence({
      label: clue?.label ?? "New evidence",
      detail: clue?.detail ?? "",
      index: Math.min(discoveredCount + 1, clues.length),
      total: clues.length,
    });
  };

  const inspect = (node: FsNode) => {
    playCue("query");
    switch (node.action) {
      case "inspect-payroll": {
        const isNew = investigating && discoverClue("payroll-missing");
        showDialog({
          title: isNew ? "Evidence Found" : "payroll.xls - Properties",
          message:
            "payroll.xls\n\nStatus: FILE NOT FOUND\nLast known location: C:\\OFFICE\\DOCUMENTS\\payroll.xls\nLast modified: 09:21 AM\n\n" +
            (isNew
              ? "The file was removed, not moved. Something recorded the moment it happened."
              : "Still missing. Still 09:21."),
          icon: "warning",
          okLabel: isNew ? "ADD TO CASE FILE" : "OK",
        });
        if (isNew) {
          celebrate("payroll-missing");
          say("Deleted at 09:21. Suspiciously precise for an accident.");
        }
        break;
      }
      case "open-logs": {
        const isNew = investigating && discoverClue("access-logs");
        openWindow("log-viewer");
        if (isNew) {
          celebrate("access-logs");
          say("Six operations before 09:23. One of them is a confession.");
          showDialog({
            title: "EVIDENCE FOUND",
            message:
              "File access records contain activity for payroll.xls.\n\nSix operations were logged this morning between 09:11 and 09:23.",
            icon: "case-files",
            okLabel: "ADD TO CASE FILE",
          });
        }
        break;
      }
      case "gary-download": {
        showDialog({
          title: "Cannot Open File",
          message: `${node.name}\n\n${node.detail}\n\nThis machine refuses to run it, and honestly, good.`,
          icon: "warning",
        });
        say(
          "Evidence of questionable musical taste. Not necessarily evidence of spreadsheet murder.",
        );
        break;
      }
      default:
        showDialog({
          title: `${node.name} - Properties`,
          message: `${node.name}\n\n${node.detail}`,
          icon: node.kind === "folder" ? "folder" : "document",
        });
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[3px]">
      <div className="flex shrink-0 items-center gap-2">
        <Win98Button
          className="min-w-0 px-2"
          disabled={path.length === 0}
          onClick={() => {
            setPath(path.slice(0, -1));
            setSel(null);
          }}
        >
          ↑ Up
        </Win98Button>
        <span className="text-[11px] text-ink">Address:</span>
        <div className="win98-field flex-1 truncate px-[4px] py-[2px] text-[11px] text-ink">
          {location}
        </div>
      </div>

      <div className="win98-field win98-scroll min-h-0 flex-1 overflow-auto p-2">
        <div className="flex flex-wrap content-start gap-[2px]">
          {items.map((d) => (
            <button
              key={d.name}
              type="button"
              onClick={() => setSel(d.name)}
              onDoubleClick={() => openNode(d)}
              className="relative flex w-[112px] flex-col items-center gap-1 p-2 text-center"
            >
              {clueForNode(d) && discoveredClues.includes(clueForNode(d)!) && (
                <span
                  className="anim-stamp pointer-events-none absolute top-[4px] right-[2px] border border-destructive px-[2px] text-[9px] leading-[1.2] font-bold tracking-[0.1em] text-destructive"
                  style={{ transform: "rotate(-9deg)" }}
                >
                  LOGGED
                </span>
              )}
              <span className={cn(d.missing && "opacity-40 anim-blink")}>
                <Win98Icon name={d.icon} size={32} />
              </span>
              <span
                className={cn(
                  "px-[2px] text-[11px] leading-tight break-words",
                  sel === d.name ? "bg-select text-select-ink" : "text-ink",
                  d.missing && sel !== d.name && "text-ink-disabled line-through",
                )}
              >
                {d.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="win98-in flex-1 truncate px-[5px] py-[2px] text-[11px] text-ink-disabled">
          {selected ? selected.detail : `${items.length} object(s) — ${precinctChatter[chatter]}`}
        </div>
        <Win98Button disabled={!selected} onClick={() => selected && openNode(selected)}>
          Open
        </Win98Button>
      </div>
    </div>
  );
}

/** Which clue, if any, a file on this drive stands for. Presentation only. */
function clueForNode(node: FsNode): ClueId | null {
  if (node.action === "inspect-payroll") return "payroll-missing";
  if (node.action === "open-logs") return "access-logs";
  return null;
}
