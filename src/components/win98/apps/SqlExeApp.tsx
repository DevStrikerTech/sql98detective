import { useState } from "react";
import { Win98Button } from "../Win98Button";

export function SqlExeApp() {
  const [query, setQuery] = useState("SELECT * FROM suspects WHERE alibi IS NULL;");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[3px]">
      <div className="win98-in win98-scroll min-h-0 flex-1 overflow-auto bg-terminal p-2 font-mono text-[12px] leading-[1.45] text-terminal-ink">
        <div>SQL/98 Interactive Query Console v0.9b</div>
        <div>(c) 1998 Precinct Data Systems. All rights probably reserved.</div>
        <div className="mt-2">Connecting to EVIDENCE.MDB . . . . . . . . . [ OK ]</div>
        <div>Loading suspect index . . . . . . . . . . . [ OK ]</div>
        <div>Verifying detective badge . . . . . . . . . [ PENDING ]</div>
        <div className="mt-2 opacity-80">
          Query engine is OFFLINE. Execution is disabled until a case is assigned.
        </div>
        <div className="mt-2">
          {"C:\\PRECINCT>"} <span className="anim-blink">_</span>
        </div>
      </div>

      <div className="shrink-0">
        <label className="mb-[3px] block text-[11px] text-ink">Query:</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
          className="win98-field win98-scroll h-[56px] w-full resize-none p-[3px] font-mono text-[12px] text-ink outline-none"
        />
        <div className="mt-[4px] flex items-center gap-2">
          <Win98Button disabled title="Requires an active investigation">
            Execute
          </Win98Button>
          <Win98Button disabled>Explain</Win98Button>
          <span className="text-[11px] text-ink-disabled">
            Execute disabled — no active investigation.
          </span>
        </div>
      </div>
    </div>
  );
}
