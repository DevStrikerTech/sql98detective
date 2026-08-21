import { useEffect, useState } from "react";
import { Win98Button } from "./Win98Button";

type Props = {
  step: number;
  musicPlaying: boolean;
  musicError: boolean;
  onStartBriefing: () => void;
  onNext: () => void;
  onBegin: () => void;
};

const BRIEFING_LINES = [
  "Watch the Inbox first. The Chief never whispers when a spreadsheet goes missing.",
  "Trust the machine before you trust the office. Files and logs remember more than suspects do.",
  "Use SQL.exe for proof, not vibes. Suspicion is cheap. A clean query is admissible.",
];

const DOG_FRAMES = [
  ` / \\__
(    @\\___
 /         O
/   (_____/
/_____/   U`,
  ` / \\__
(    -\\___
 /         O
/   (_____/
/_____/  U`,
];

export function FirstRunGuide({
  step,
  musicPlaying,
  musicError,
  onStartBriefing,
  onNext,
  onBegin,
}: Props) {
  const started = step >= 0;
  const lastStep = step >= BRIEFING_LINES.length - 1;
  const [frame, setFrame] = useState(0);
  const [typed, setTyped] = useState("");
  const activeLine = started ? (BRIEFING_LINES[step] ?? "") : "";
  const typingDone = !started || typed === activeLine;

  useEffect(() => {
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % DOG_FRAMES.length);
    }, 520);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!started) {
      setTyped("");
      return;
    }
    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      i = Math.min(activeLine.length, i + 2);
      setTyped(activeLine.slice(0, i));
      if (i >= activeLine.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [activeLine, started, step]);

  return (
    <div className="absolute inset-0 z-[9300] flex items-center justify-center bg-boot/45 p-4">
      <div className="win98-out anim-snap-open w-full max-w-[560px] bg-surface p-[3px]">
        <div className="win98-titlebar-active flex items-center gap-2 px-[4px] py-[2px]">
          <span className="text-[11px] font-bold tracking-[0.12em] text-title-ink">
            DETECTIVE DOG BRIEFING
          </span>
        </div>

        <div className="win98-field flex gap-3 bg-surface p-3">
          <div className="shrink-0">
            <div className="win98-in anim-blink-slow bg-field px-3 py-2 text-[11px] leading-[1.1] text-ink">
              <pre>{DOG_FRAMES[frame]}</pre>
            </div>
            <div className="mt-1 text-center text-[11px] font-bold tracking-[0.14em] text-ink-disabled">
              BYTE.DOG
            </div>
          </div>

          <div className="min-w-0 text-[11px] leading-[1.55] text-ink">
            <div className="mb-2 font-bold">Byte, precinct sniffer, reporting in.</div>

            {!started ? (
              <>
                <div className="win98-in bg-field px-2 py-2">
                  The short version is three clues long and safe for rookies.
                </div>
                <div className="mt-2 text-ink-disabled">
                  Click below to start the briefing and wake the intro theme.
                </div>
              </>
            ) : (
              <>
                <div className="win98-in mb-2 bg-field px-2 py-1 text-[11px] font-bold tracking-[0.14em] text-ink">
                  BRIEFING {step + 1} / {BRIEFING_LINES.length}
                </div>
                <div className="win98-groove bg-surface p-2">
                  <div className="text-[11px] leading-[1.55] text-ink">
                    {typed}
                    {!typingDone && <span className="anim-blink">_</span>}
                  </div>
                </div>
                <div className="mt-2 text-ink-disabled">
                  {musicPlaying
                    ? "Theme is running. Once you start playing, it cuts and the case begins."
                    : musicError
                      ? "Theme could not start automatically. Try the button again if you want another attempt."
                      : "Waking the theme..."}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-[3px] pt-[3px]">
          <div className="win98-in flex-1 truncate px-[5px] py-[2px] text-[11px] text-ink-disabled">
            {musicPlaying ? "THEME: ON" : musicError ? "THEME: OFF" : "THEME: STANDBY"}
            {" · "}
            First-time briefing only. After this, Byte trusts you to snoop unsupervised.
          </div>
          {!started ? (
            <>
              <Win98Button className="px-3" onClick={onBegin}>
                SKIP
              </Win98Button>
              <Win98Button className="px-3 font-bold" onClick={onStartBriefing}>
                BEGIN BRIEFING
              </Win98Button>
            </>
          ) : lastStep ? (
            <Win98Button className="px-3 font-bold" onClick={onBegin} disabled={!typingDone}>
              START PLAYING
            </Win98Button>
          ) : (
            <Win98Button className="px-3 font-bold" onClick={onNext} disabled={!typingDone}>
              NEXT TIP
            </Win98Button>
          )}
        </div>
      </div>
    </div>
  );
}
