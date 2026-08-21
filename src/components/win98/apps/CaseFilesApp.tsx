import { useEffect, useRef, useState } from "react";
import { Win98Button } from "../Win98Button";
import { Win98Icon } from "../Win98Icon";
import { cn } from "@/lib/utils";
import {
  CASE_ID,
  CASE_TITLE,
  caseHeat,
  clueNotes,
  clues,
  dossierChatter,
  suspectObservations,
  suspects,
  type ClueId,
} from "@/content/case001";
import { useGameStore } from "@/lib/game/gameStore";
import { currentObjective } from "@/lib/game/objective";

type Tab = "dossier" | "suspects" | "evidence";

export function CaseFilesApp({ onRequest }: { onRequest: (what: string) => void }) {
  const phase = useGameStore((s) => s.phase);
  const discovered = useGameStore((s) => s.discoveredClues);
  const sqlUnlocked = useGameStore((s) => s.sqlUnlocked);
  const [tab, setTab] = useState<Tab>("dossier");

  /* Purely presentational: a "NEW" flag on the Evidence tab until it is read. */
  const [unread, setUnread] = useState(0);
  const seen = useRef(discovered.length);
  useEffect(() => {
    if (discovered.length > seen.current) {
      setUnread((u) => u + (discovered.length - seen.current));
    }
    seen.current = discovered.length;
  }, [discovered.length]);
  useEffect(() => {
    if (tab === "evidence") setUnread(0);
  }, [tab, discovered.length]);

  /* Idle desk noise along the bottom of the folder. */
  const [chatter, setChatter] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setChatter((c) => c + 1), 11000);
    return () => window.clearInterval(id);
  }, []);

  if (phase === "idle" || phase === "offered") {
    return (
      <div className="win98-field flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
        <Win98Icon name="case-files" size={40} />
        <div className="text-[13px] font-bold text-ink">No Active Investigation</div>
        <p className="max-w-[300px] text-[11px] leading-[1.6] text-ink-disabled">
          The evidence locker is empty and the coffee is cold.
          {phase === "offered" ? " Check the Inbox — something just came in." : ""}
        </p>
        <Win98Button onClick={() => onRequest("Case assignment")}>Request Case</Win98Button>
      </div>
    );
  }

  const solved = phase === "solved";
  const objective = currentObjective({
    phase,
    discoveredCount: discovered.length,
    sqlUnlocked,
  });

  const brokenCount = suspects.filter(
    (s) => !!s.contradictedBy && discovered.includes(s.contradictedBy),
  ).length;
  const heat = caseHeat[Math.min(discovered.length, caseHeat.length - 1)] ?? caseHeat[0]!;

  const tabs: [Tab, string][] = [
    ["dossier", "Dossier"],
    ["suspects", "Suspects"],
    ["evidence", `Evidence (${discovered.length})`],
  ];

  const latestClue = discovered[discovered.length - 1] as ClueId | undefined;
  const latestNote = latestClue ? clueNotes[latestClue] : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="win98-scroll min-h-0 flex-1 overflow-auto bg-surface p-[2px]">
        {/* Manila-folder tab strip */}
        <div className="flex items-end gap-[2px] pl-1">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "win98-out relative border-b-0 bg-surface px-3 text-[11px]",
                tab === id ? "py-[3px] font-bold text-ink" : "py-[1px] text-ink-disabled",
              )}
            >
              {label}
              {id === "evidence" && unread > 0 && tab !== "evidence" && (
                <span className="anim-blink ml-1 font-bold text-destructive">NEW</span>
              )}
            </button>
          ))}
        </div>

        <div className="win98-out bg-surface p-2">
          <div className="win98-field p-3">
            <div className="flex items-start justify-between gap-2 border-b-2 border-double border-surface-shadow pb-2">
              <div>
                <div className="text-[11px] tracking-[0.2em] text-ink-disabled">
                  PRECINCT DATA SYSTEMS — CASE {CASE_ID}
                </div>
                <div className="text-[15px] font-bold tracking-wide text-ink">{CASE_TITLE}</div>
                <div className="text-[11px] text-ink-disabled">
                  Assigned by Chief Brannigan · 8/24/98 · 3rd Floor, Precinct 98
                </div>
              </div>
              <div
                className={cn(
                  "shrink-0 border-2 px-2 py-[2px] text-[11px] font-bold tracking-widest",
                  solved ? "border-ink text-ink" : "border-destructive text-destructive",
                )}
                style={{ transform: "rotate(-6deg)" }}
              >
                {solved ? "CLOSED" : "OPEN"}
              </div>
            </div>

            {tab === "dossier" && (
              <div className="anim-redraw">
                <Section label="OBJECTIVE">
                  <div className="text-[11px] text-ink">Determine who deleted payroll.xls.</div>
                </Section>

                <Section label="SUMMARY">
                  <p className="text-[11px] leading-[1.6] text-ink">
                    payroll.xls left C:\OFFICE\DOCUMENTS at 09:21 and did not come back. Three
                    people were logged onto the office machine that morning. All three have an
                    account of their movements. Only one of those accounts has to survive contact
                    with the access log.
                  </p>
                </Section>

                <Section label={`PROGRESS — ${discovered.length} / ${clues.length} EXHIBITS`}>
                  <div className="flex items-center gap-2">
                    <div className="win98-in h-[12px] flex-1 bg-field p-[1px]">
                      <div
                        className="h-full bg-title transition-[width] duration-500"
                        style={{ width: `${(discovered.length / clues.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-ink">
                      {Math.round((discovered.length / clues.length) * 100)}%
                    </span>
                  </div>
                  <div className="mt-1 flex gap-1">
                    {clues.map((c, i) => (
                      <span
                        key={c.id}
                        className={cn(
                          "win98-out px-[5px] py-[1px] text-[11px]",
                          discovered.includes(c.id)
                            ? "font-bold text-ink"
                            : "text-ink-disabled opacity-70",
                        )}
                      >
                        {discovered.includes(c.id) ? "■" : "□"} EXHIBIT{" "}
                        {String.fromCharCode(65 + i)}
                      </span>
                    ))}
                  </div>
                </Section>

                <Section label={`CASE TEMPERATURE — ${heat.label}`}>
                  <div className="win98-groove flex items-center gap-2 bg-surface p-2">
                    <div className="flex gap-[2px]">
                      {clues.map((c, i) => (
                        <span
                          key={c.id}
                          className={cn(
                            "win98-in h-[14px] w-[9px]",
                            i < discovered.length
                              ? i >= clues.length - 1
                                ? "anim-blink bg-destructive"
                                : "bg-title"
                              : "bg-field",
                          )}
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1 text-[11px] leading-[1.5] text-ink">
                      {heat.line}
                    </div>
                  </div>
                  {brokenCount > 0 && (
                    <div className="anim-redraw mt-1 text-[11px] font-bold text-destructive">
                      <span className="anim-blink mr-1">!</span>
                      {brokenCount} statement(s) no longer survive the record. See Suspects.
                    </div>
                  )}
                  {sqlUnlocked && (
                    <div className="anim-redraw mt-1 text-[11px] text-ink">
                      Query access is live. The log will answer, but only in SQL.
                    </div>
                  )}
                </Section>

                {latestNote && (
                  <Section label="LAST ENTRY IN THE NOTEBOOK">
                    <div className="win98-groove bg-surface p-2">
                      <div className="text-[11px] leading-[1.5] text-ink italic">
                        “{latestNote.note}”
                      </div>
                      <div className="mt-[2px] text-[11px] text-ink-disabled">
                        — filed {latestNote.filedAt}, in biro, slightly smudged
                      </div>
                    </div>
                  </Section>
                )}

                <Section label={`CURRENT OBJECTIVE — ${objective.code}`}>
                  <div className="win98-groove anim-pulse-border bg-surface p-2">
                    <div className="text-[11px] font-bold text-ink">
                      <span className="anim-blink mr-1">▸</span>
                      {objective.text}
                    </div>
                    <div className="mt-[2px] text-[11px] tracking-[0.1em] text-ink-disabled">
                      GO TO: {objective.where.toUpperCase()}
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {tab === "suspects" && (
              <div className="anim-redraw mt-2 space-y-2">
                {suspects.map((s) => {
                  const busted = !!s.contradictedBy && discovered.includes(s.contradictedBy);
                  return (
                    <div key={s.id} className="win98-groove relative bg-surface p-2">
                      <div className="flex gap-2">
                        <Win98Icon name="find" size={24} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-[11px] font-bold text-ink">
                              {s.name} — <span className="font-normal">{s.role}</span>
                            </div>
                            <span
                              className={cn(
                                "win98-out px-[4px] text-[11px] tracking-[0.1em]",
                                busted ? "font-bold text-destructive" : "text-ink-disabled",
                              )}
                            >
                              {busted ? "STORY BROKEN" : "STORY HOLDS — FOR NOW"}
                            </span>
                          </div>
                          <div className="text-[11px] text-ink-disabled">{s.desk}</div>
                          <div className="mt-1 text-[11px] leading-[1.5] text-ink">
                            {s.statement}
                          </div>
                          <div className="mt-1 text-[11px] text-ink-disabled">
                            <b className="text-ink">ALIBI:</b> {s.alibi}
                          </div>
                          <div className="text-[11px] text-ink-disabled">
                            <b className="text-ink">NOTE:</b> {s.tell}
                          </div>
                        </div>
                      </div>
                      {busted && (
                        <div
                          className="anim-stamp pointer-events-none absolute top-2 right-2 border-[3px] border-destructive px-[6px] text-[12px] font-bold tracking-[0.16em] text-destructive opacity-90"
                          style={{ transform: "rotate(-8deg)" }}
                        >
                          STATEMENT DISPUTED
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {tab === "evidence" && (
              <div className="anim-redraw">
                <Section label={`EXHIBITS FILED — ${discovered.length} / ${clues.length}`}>
                  <div className="win98-in bg-field p-2">
                    {clues.map((c, i) => {
                      const found = discovered.includes(c.id);
                      const note = clueNotes[c.id];
                      return (
                        <div
                          key={c.id}
                          className={cn(
                            "flex gap-2 border-b border-dotted border-surface-shadow py-[4px] text-[11px] last:border-b-0",
                            found ? "anim-redraw text-ink" : "text-ink-disabled",
                          )}
                        >
                          <span className="w-[14px] shrink-0 text-center">
                            {found ? "[X]" : "[ ]"}
                          </span>
                          <span className="min-w-0">
                            {found ? (
                              <>
                                <b>EXHIBIT {String.fromCharCode(65 + i)}.</b> {c.label}
                                <span className="block text-ink-disabled">{c.detail}</span>
                                <span className="mt-[2px] block border-l-2 border-surface-shadow pl-2 text-ink italic">
                                  “{note.note}”
                                </span>
                                <span className="block text-ink-disabled">
                                  NEXT: {note.lead} · logged {note.filedAt}
                                </span>
                              </>
                            ) : (
                              <>— sealed until discovered —</>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Section>
                <div className="mt-2 text-[11px] text-ink-disabled">
                  Evidence is logged automatically as you examine the machine. Nothing here was
                  typed by a human, which is exactly why it is admissible.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="win98-groove shrink-0 bg-surface px-2 py-[2px] text-[11px] text-ink-disabled">
        {dossierChatter[chatter % dossierChatter.length]}
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <div className="mb-1 text-[11px] font-bold tracking-[0.15em] text-ink-disabled">{label}</div>
      {children}
    </div>
  );
}
