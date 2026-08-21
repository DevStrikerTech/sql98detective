import { Win98Button } from "./Win98Button";

type Props = {
  onBegin: () => void;
};

export function FirstRunGuide({ onBegin }: Props) {
  return (
    <div className="absolute inset-0 z-[9300] flex items-center justify-center bg-boot/45 p-4">
      <div className="win98-out w-full max-w-[520px] bg-surface p-[3px]">
        <div className="win98-titlebar-active flex items-center gap-2 px-[4px] py-[2px]">
          <span className="text-[11px] font-bold tracking-[0.12em] text-title-ink">
            DETECTIVE DOG BRIEFING
          </span>
        </div>

        <div className="win98-field flex gap-3 bg-surface p-3">
          <pre className="win98-in shrink-0 bg-field px-3 py-2 text-[11px] leading-[1.1] text-ink">{` / \\__
(    @\\___
 /         O
/   (_____/
/_____/   U`}</pre>

          <div className="min-w-0 text-[11px] leading-[1.55] text-ink">
            <div className="mb-2 font-bold">Byte, precinct sniffer, reporting in.</div>
            <div>Short version:</div>
            <div>1. Watch the Inbox. The Chief will make this everybody's problem.</div>
            <div>2. Check the machine before you trust the people using it.</div>
            <div>3. SQL.exe is for proof. Suspicion is free, accusations are not.</div>
            <div className="mt-2 text-ink-disabled">
              Intro music plays until you begin. If your browser blocks autoplay, one click should
              wake it up.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-[3px] pt-[3px]">
          <div className="win98-in flex-1 truncate px-[5px] py-[2px] text-[11px] text-ink-disabled">
            First-time briefing only. After this, Byte trusts you to snoop unsupervised.
          </div>
          <Win98Button className="px-3 font-bold" onClick={onBegin}>
            START PLAYING
          </Win98Button>
        </div>
      </div>
    </div>
  );
}
