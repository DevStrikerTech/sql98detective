import { Win98Button } from "../Win98Button";
import { Win98Icon } from "../Win98Icon";

export function CaseFilesApp({ onRequest }: { onRequest: (what: string) => void }) {
  return (
    <div className="win98-field flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
      <Win98Icon name="case-files" size={40} />
      <div className="text-[13px] font-bold text-ink">No Active Investigation</div>
      <p className="max-w-[300px] text-[11px] leading-[1.6] text-ink-disabled">
        The evidence locker is empty and the coffee is cold. Assign a case to begin querying
        witnesses, suspects, and suspiciously well-organized spreadsheets.
      </p>
      <Win98Button onClick={() => onRequest("Case assignment")}>Request Case</Win98Button>
    </div>
  );
}
