import { Win98Icon } from "../Win98Icon";

export function AboutApp() {
  return (
    <div className="win98-field flex min-h-0 flex-1 items-start gap-3 p-4">
      <Win98Icon name="info" size={32} />
      <div className="text-[11px] leading-[1.6] text-ink">
        <div className="text-[13px] font-bold">SQL 98: Digital Detective</div>
        <div className="text-ink-disabled">Version 0.1 (Shell Prototype)</div>
        <p className="mt-3">
          A crime-solving operating system for detectives who think in SELECT statements.
        </p>
        <p className="mt-2 text-ink-disabled">
          This build contains the desktop shell only. Case data, interrogations and the query engine
          arrive in a later release.
        </p>
      </div>
    </div>
  );
}
