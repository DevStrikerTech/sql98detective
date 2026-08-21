import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Icon } from "../Win98Icon";
import { Win98Button } from "../Win98Button";
import { emails, type Mail } from "@/content/emails";
import { CASE_ID, caseEmail } from "@/content/case001";
import { useGameStore } from "@/lib/game/gameStore";
import { useShellStore } from "@/lib/game/shellStore";
import { useWindowStore } from "@/lib/win98/windowStore";

export function InboxApp() {
  const phase = useGameStore((s) => s.phase);
  const startCase = useGameStore((s) => s.startCase);
  const showDialog = useShellStore((s) => s.showDialog);
  const say = useShellStore((s) => s.say);
  const playCue = useShellStore((s) => s.playCue);
  const openWindow = useWindowStore((s) => s.open);

  const list: Mail[] = useMemo(
    () => (phase === "idle" ? emails : [caseEmail, ...emails]),
    [phase],
  );
  const [selectedId, setSelectedId] = useState<string>(list[0]!.id);
  const mail = list.find((m) => m.id === selectedId) ?? list[0]!;
  const isCaseMail = mail.id === caseEmail.id;
  const accepted = phase !== "idle" && phase !== "offered";

  const accept = () => {
    startCase(CASE_ID);
    playCue("evidence");
    openWindow("case-files");
    showDialog({
      title: "Case Assigned",
      message:
        "CASE 001 — THE MISSING SPREADSHEET has been added to your Case Files.\n\nObjective: determine who deleted payroll.xls.",
      icon: "case-files",
      okLabel: "Get to work",
    });
    say("Investigation opened. Try the computer itself — files remember things people forget.");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[3px]">
      <div className="win98-field win98-scroll h-[120px] overflow-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {["From", "Subject", "Received"].map((h) => (
                <th
                  key={h}
                  className="win98-out sticky top-0 bg-surface px-[4px] py-[2px] text-left font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((m) => {
              const urgent = m.id === caseEmail.id;
              return (
                <tr
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={cn(
                    "cursor-default",
                    m.id === selectedId ? "bg-select text-select-ink" : "text-ink",
                  )}
                >
                  <td className="px-[4px] py-[1px] whitespace-nowrap">
                    <span className={cn("inline-flex items-center gap-1", urgent && "font-bold")}>
                      <Win98Icon name={urgent ? "warning" : "mail"} size={12} />
                      {m.from}
                    </span>
                  </td>
                  <td className={cn("px-[4px] py-[1px]", urgent && "font-bold")}>{m.subject}</td>
                  <td className="px-[4px] py-[1px] whitespace-nowrap">{m.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="win98-field win98-scroll min-h-0 flex-1 overflow-auto p-2">
        <div className="mb-2 border-b border-surface-shadow pb-1 text-[11px]">
          <div>
            <b>From:</b> {mail.from}
          </div>
          <div>
            <b>Subject:</b> {mail.subject}
          </div>
        </div>
        <pre className="font-ui text-[11px] leading-[1.5] whitespace-pre-wrap text-ink">
          {mail.body}
        </pre>

        {isCaseMail && (
          <div className="win98-groove mt-3 flex items-center gap-3 bg-surface p-2">
            {accepted ? (
              <span className="text-[11px] text-ink">
                CASE 001 accepted. See Case Files for your objective.
              </span>
            ) : (
              <>
                <Win98Button onClick={accept} className="font-bold">
                  ACCEPT CASE
                </Win98Button>
                <span className="text-[11px] text-ink-disabled">
                  Opens CASE 001 — THE MISSING SPREADSHEET.
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
