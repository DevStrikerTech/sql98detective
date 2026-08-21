import { Win98Button } from "../Win98Button";
import { Win98Icon } from "../Win98Icon";
import { cn } from "@/lib/utils";
import { CASE_ID, CASE_TITLE, clues, suspects } from "@/content/case001";
import { useGameStore } from "@/lib/game/gameStore";

export function CaseFilesApp({ onRequest }: { onRequest: (what: string) => void }) {
  const phase = useGameStore((s) => s.phase);
  const discovered = useGameStore((s) => s.discoveredClues);
  const sqlUnlocked = useGameStore((s) => s.sqlUnlocked);

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
  const objective = solved
    ? "Case closed. File the paperwork."
    : discovered.length === 0
      ? "Inspect the computer for evidence."
      : !sqlUnlocked
        ? "Find the file access records in C:\\OFFICE\\LOGS\\."
        : phase === "revealed"
          ? "Confirm the accusation in SQL.exe."
          : "Interrogate the records with SQL.exe.";

  return (
    <div className="win98-scroll min-h-0 flex-1 overflow-auto bg-surface p-[2px]">
      {/* Manila-folder tab strip */}
      <div className="flex items-end gap-[2px] pl-1">
        <div className="win98-out border-b-0 bg-surface px-3 py-[2px] text-[11px] font-bold">
          Dossier
        </div>
        <div className="win98-out border-b-0 bg-surface px-3 py-[1px] text-[11px] text-ink-disabled">
          Suspects
        </div>
        <div className="win98-out border-b-0 bg-surface px-3 py-[1px] text-[11px] text-ink-disabled">
          Evidence
        </div>
      </div>

      <div className="win98-out bg-surface p-2">
        <div className="win98-field p-3">
          <div className="flex items-start justify-between gap-2 border-b-2 border-double border-surface-shadow pb-2">
            <div>
              <div className="text-[11px] tracking-[0.2em] text-ink-disabled">
                PRECINCT DATA SYSTEMS — CASE {CASE_ID}
              </div>
              <div className="text-[15px] font-bold tracking-wide text-ink">{CASE_TITLE}</div>
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

          <Section label="OBJECTIVE">
            <div className="text-[11px] text-ink">Determine who deleted payroll.xls.</div>
          </Section>

          <Section label="SUSPECTS">
            <div className="flex flex-wrap gap-2">
              {suspects.map((s) => (
                <div key={s.id} className="win98-groove flex w-[150px] gap-2 bg-surface p-[4px]">
                  <Win98Icon name="find" size={20} />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-ink">{s.name}</div>
                    <div className="text-[11px] text-ink-disabled">{s.role}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 space-y-[2px]">
              {suspects.map((s) => (
                <div key={s.id} className="text-[11px] text-ink-disabled">
                  <b className="text-ink">{s.name}:</b> {s.statement}
                </div>
              ))}
            </div>
          </Section>

          <Section label={`CLUES DISCOVERED — ${discovered.length} / ${clues.length}`}>
            <div className="win98-in bg-field p-2">
              {clues.map((c) => {
                const found = discovered.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className={cn(
                      "flex gap-2 py-[2px] text-[11px]",
                      found ? "text-ink" : "text-ink-disabled",
                    )}
                  >
                    <span className="w-[14px] shrink-0 text-center">{found ? "[X]" : "[ ]"}</span>
                    <span>
                      {found ? c.label : "— undiscovered —"}
                      {found && <span className="block text-ink-disabled">{c.detail}</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section label="CURRENT OBJECTIVE">
            <div className="text-[11px] font-bold text-ink">{objective}</div>
          </Section>
        </div>
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
