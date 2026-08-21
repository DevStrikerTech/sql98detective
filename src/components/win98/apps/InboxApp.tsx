import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Win98Icon } from "../Win98Icon";
import { Win98Button } from "../Win98Button";
import { emails, type Mail } from "@/content/emails";
import {
  CASE_ID,
  caseEmail,
  caseFollowUps,
  mailActions,
  mailRoomChatter,
} from "@/content/case001";
import { useGameStore } from "@/lib/game/gameStore";
import { useShellStore } from "@/lib/game/shellStore";
import { useWindowStore } from "@/lib/win98/windowStore";

export function InboxApp() {
  const phase = useGameStore((s) => s.phase);
  const sqlUnlocked = useGameStore((s) => s.sqlUnlocked);
  const startCase = useGameStore((s) => s.startCase);
  const showDialog = useShellStore((s) => s.showDialog);
  const say = useShellStore((s) => s.say);
  const playCue = useShellStore((s) => s.playCue);
  const openWindow = useWindowStore((s) => s.open);

  const accepted = phase !== "idle" && phase !== "offered";

  const list: Mail[] = useMemo(() => {
    if (phase === "idle") return emails;
    const extras = caseFollowUps
      .filter((f) => {
        if (f.showAfter === "accepted") return accepted;
        if (f.showAfter === "sql") return sqlUnlocked;
        return phase === "solved";
      })
      .map(({ showAfter: _showAfter, ...m }) => m as Mail);
    return [...extras.slice().reverse(), caseEmail, ...emails];
  }, [phase, accepted, sqlUnlocked]);

  const [selectedId, setSelectedId] = useState<string>(list[0]!.id);
  const [read, setRead] = useState<string[]>([]);

  useEffect(() => {
    if (phase === "offered") setSelectedId(caseEmail.id);
  }, [phase]);

  useEffect(() => {
    setRead((r) => (r.includes(selectedId) ? r : [...r, selectedId]));
  }, [selectedId]);

  /* The mail room mutters to itself between deliveries. */
  const [chatter, setChatter] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setChatter((c) => (c + 1) % mailRoomChatter.length),
      11000,
    );
    return () => window.clearInterval(id);
  }, []);

  /* Anything that lands while the window is open gets a brief NEW flag. */
  const [seen, setSeen] = useState<string[]>(() => list.map((m) => m.id));
  const [fresh, setFresh] = useState<string[]>([]);
  useEffect(() => {
    const arrivals = list.map((m) => m.id).filter((id) => !seen.includes(id));
    if (arrivals.length === 0) return;
    setSeen((s) => [...s, ...arrivals]);
    setFresh(arrivals);
    playCue("message");
    const t = window.setTimeout(() => setFresh([]), 6000);
    return () => window.clearTimeout(t);
  }, [list, seen, playCue]);

  const mail = list.find((m) => m.id === selectedId) ?? list[0]!;
  const isCaseMail = mail.id === caseEmail.id;
  const unreadCount = list.filter((m) => !read.includes(m.id)).length;

  const accept = () => {
    startCase(CASE_ID);
    playCue("evidence");
    openWindow("case-files");
    showDialog({
      title: "Case Assigned",
      message:
        "CASE 001 — THE MISSING SPREADSHEET has been added to your Case Files.\n\nThree names. One deleted file. One morning.\n\nObjective: determine who deleted payroll.xls.",
      icon: "case-files",
      okLabel: "Get to work",
    });
    say("Investigation opened. Try the computer itself — files remember things people forget.");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[3px]">
      <div className="win98-groove flex shrink-0 items-center gap-2 bg-surface px-2 py-1 text-[11px]">
        <Win98Icon name="mail" size={12} />
        <span className="tracking-[0.14em] text-ink-disabled">PRECINCT MAIL SYSTEM v2.1</span>
        <span className="ml-auto text-ink-disabled">
          {phase === "offered" ? (
            <span className="anim-blink font-bold text-ink">!! PRIORITY MAIL WAITING !!</span>
          ) : (
            "Delivery: whenever the server feels like it"
          )}
        </span>
      </div>

      {/* A toolbar of buttons that all, in their own way, refuse. */}
      <div className="flex shrink-0 flex-wrap items-center gap-[3px]">
        {mailActions.map((a) => (
          <Win98Button
            key={a.label}
            className="px-2"
            onClick={() => {
              playCue("error");
              showDialog({ title: a.title, message: a.message, icon: "warning" });
            }}
          >
            {a.label}
          </Win98Button>
        ))}
        <span className="ml-auto pr-1 text-[11px] text-ink-disabled">
          Mailbox: DETECTIVE (shared)
        </span>
      </div>

      <div className="win98-field win98-scroll h-[120px] overflow-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {["!", "From", "Subject", "Received"].map((h) => (
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
              const urgent = m.id === caseEmail.id && !accepted;
              const unread = !read.includes(m.id);
              return (
                <tr
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={cn(
                    "cursor-default",
                    m.id === selectedId ? "bg-select text-select-ink" : "text-ink",
                  )}
                >
                  <td className="w-[14px] px-[3px] py-[1px] text-center font-bold">
                    {urgent ? <span className="anim-blink">!</span> : ""}
                  </td>
                  <td className="px-[4px] py-[1px] whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1",
                        (urgent || unread) && "font-bold",
                      )}
                    >
                      <span className={cn(urgent && "anim-blink")}>
                        <Win98Icon name={urgent ? "warning" : "mail"} size={12} />
                      </span>
                      {m.from}
                    </span>
                  </td>
                  <td className={cn("px-[4px] py-[1px]", (urgent || unread) && "font-bold")}>
                    {fresh.includes(m.id) && (
                      <span className="anim-stamp mr-1 border border-destructive px-[2px] text-[9px] font-bold tracking-[0.1em] text-destructive">
                        NEW
                      </span>
                    )}
                    {m.subject}
                  </td>
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
        <pre
          key={mail.id}
          className="anim-redraw font-ui text-[11px] leading-[1.5] whitespace-pre-wrap text-ink"
        >
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
                <Win98Button onClick={accept} className="anim-pulse-border font-bold">
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

      <div className="win98-in shrink-0 truncate px-[5px] py-[2px] text-[11px] text-ink-disabled">
        {list.length} message(s), {unreadCount} unread
        {phase === "offered" ? " — the Chief is waiting." : ` — ${mailRoomChatter[chatter]}`}
      </div>
    </div>
  );
}
