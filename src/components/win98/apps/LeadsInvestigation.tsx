import { cn } from "@/lib/utils";
import { Win98Button } from "../Win98Button";
import { Win98Icon } from "../Win98Icon";
import type { CaseConfig, CaseLead } from "@/content/caseTypes";
import { useGameStore } from "@/lib/game/gameStore";
import { useShellStore } from "@/lib/game/shellStore";
import { useWindowStore } from "@/lib/win98/windowStore";

/**
 * The generic investigation surface for lean cases — those with no bespoke
 * browsable machine. Leads are pursued in order; each files its clue, and the
 * lead marked `unlocksSql` brings the query engine online. Entirely driven by
 * CaseConfig, so any case that supplies `leads` is fully playable here.
 */
export function LeadsInvestigation({ caseConfig }: { caseConfig: CaseConfig }) {
  const leads = caseConfig.leads ?? [];
  const phase = useGameStore((s) => s.phase);
  const discovered = useGameStore((s) => s.discoveredClues);
  const sqlUnlocked = useGameStore((s) => s.sqlUnlocked);
  const discoverClue = useGameStore((s) => s.discoverClue);
  const unlockSql = useGameStore((s) => s.unlockSql);

  const showDialog = useShellStore((s) => s.showDialog);
  const say = useShellStore((s) => s.say);
  const playCue = useShellStore((s) => s.playCue);
  const logEvidence = useShellStore((s) => s.logEvidence);
  const setFlashApp = useShellStore((s) => s.setFlashApp);
  const fireScreenFx = useShellStore((s) => s.fireScreenFx);
  const openWindow = useWindowStore((s) => s.open);

  const solved = phase === "solved";
  const filedCount = leads.filter((l) => discovered.includes(l.clueId)).length;
  const total = leads.length;

  const pursue = (lead: CaseLead) => {
    if (discovered.includes(lead.clueId)) return;
    if (!discoverClue(lead.clueId)) return;
    const clue = caseConfig.clues.find((c) => c.id === lead.clueId);
    fireScreenFx("flicker");
    playCue("evidence");
    setFlashApp("case-files");
    logEvidence({
      label: clue?.label ?? lead.label,
      detail: clue?.detail ?? lead.detail,
      index: Math.min(filedCount + 1, total),
      total,
    });
    if (lead.unlocksSql && !sqlUnlocked) {
      unlockSql();
      setFlashApp("sql-exe");
      openWindow("sql-exe");
      window.setTimeout(() => {
        fireScreenFx("flicker");
        showDialog({
          title: "DATABASE QUERY ACCESS ENABLED",
          message:
            "Sufficient evidence collected.\n\nSQL.exe may now interrogate " +
            `${caseConfig.sqlTable.tableName}.\n\n` +
            "A lead is a rumour. A query result is testimony.",
          icon: "sql-exe",
          okLabel: "OPEN SQL.exe",
        });
      }, 480);
      say("Query engine online. Time to ask the records a direct question.");
    } else {
      say("Filed. The record is starting to take shape.");
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="win98-scroll min-h-0 flex-1 overflow-auto bg-surface p-[2px]">
        <div className="win98-out bg-surface p-2">
          <div className="win98-field p-3">
            <div className="flex items-start justify-between gap-2 border-b-2 border-double border-surface-shadow pb-2">
              <div>
                <div className="text-[11px] tracking-[0.2em] text-ink-disabled">
                  PRECINCT DATA SYSTEMS — CASE {caseConfig.id}
                </div>
                <div className="text-[15px] font-bold tracking-wide text-ink">
                  {caseConfig.title}
                </div>
                <div className="text-[11px] text-ink-disabled">
                  Assigned by Chief Brannigan · 3rd Floor, Precinct 98
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

            <Section label="SUMMARY">
              <p className="text-[11px] leading-[1.6] text-ink">{caseConfig.summary}</p>
            </Section>

            <Section label={`PROGRESS — ${filedCount} / ${total} LEADS FILED`}>
              <div className="flex items-center gap-2">
                <div className="win98-in h-[12px] flex-1 bg-field p-[1px]">
                  <div
                    className="h-full bg-title transition-[width] duration-500"
                    style={{ width: `${total ? (filedCount / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-ink">
                  {Math.round(total ? (filedCount / total) * 100 : 0)}%
                </span>
              </div>
            </Section>

            <Section label="LEADS">
              <div className="win98-in bg-field p-2">
                {leads.map((lead, i) => {
                  const filed = discovered.includes(lead.clueId);
                  // Leads are pursued in order: the previous one must be filed.
                  const prevFiled = i === 0 || discovered.includes(leads[i - 1]!.clueId);
                  return (
                    <div
                      key={lead.id}
                      className={cn(
                        "flex items-start gap-2 border-b border-dotted border-surface-shadow py-[6px] last:border-b-0",
                        filed ? "text-ink" : prevFiled ? "text-ink" : "text-ink-disabled",
                      )}
                    >
                      <span className="mt-[1px] shrink-0">
                        <Win98Icon name={filed ? "case-files" : "find"} size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold">
                          LEAD {String.fromCharCode(65 + i)}. {lead.label}
                        </div>
                        <div className="text-[11px] leading-[1.5] text-ink-disabled">
                          {filed || prevFiled ? lead.detail : "— follow the earlier lead first —"}
                        </div>
                      </div>
                      <div className="shrink-0 self-center">
                        {filed ? (
                          <span
                            className="anim-stamp inline-block border border-destructive px-[4px] text-[9px] font-bold tracking-[0.1em] text-destructive"
                            style={{ transform: "rotate(-8deg)" }}
                          >
                            FILED
                          </span>
                        ) : (
                          <Win98Button
                            className="px-2"
                            disabled={!prevFiled || solved}
                            onClick={() => pursue(lead)}
                          >
                            PURSUE
                          </Win98Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {sqlUnlocked && !solved && (
                <div className="anim-redraw mt-1 text-[11px] text-ink">
                  Query access is live. Open SQL.exe and ask the record directly.
                </div>
              )}
            </Section>
          </div>
        </div>
      </div>

      <div className="win98-groove shrink-0 bg-surface px-2 py-[2px] text-[11px] text-ink-disabled">
        {solved
          ? "Case closed. The paperwork, for once, agrees with itself."
          : filedCount === total
            ? "Every lead filed. The query engine is waiting."
            : "Leads are logged automatically as you pursue them."}
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
