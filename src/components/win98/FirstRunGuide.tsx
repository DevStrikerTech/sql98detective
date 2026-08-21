import { useEffect, useState } from "react";
import { Win98Button } from "./Win98Button";

type Props = {
  onBegin: () => void;
};

const LINES = [
  "Name's Byte. Precinct sniffer. I find the smell, you find the name.",
  "Read the Inbox first. Then poke around the machine — files remember things people forget.",
  "When you're sure, open SQL.exe and make the record say it out loud.",
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

export function FirstRunGuide({ onBegin }: Props) {
  const [step, setStep] = useState(0);
  const [frame, setFrame] = useState(0);
  const [typed, setTyped] = useState("");
  const activeLine = LINES[step] ?? "";
  const typingDone = typed === activeLine;
  const lastStep = step >= LINES.length - 1;

  useEffect(() => {
    const id = window.setInterval(() => setFrame((f) => (f + 1) % DOG_FRAMES.length), 520);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      i = Math.min(activeLine.length, i + 2);
      setTyped(activeLine.slice(0, i));
      if (i >= activeLine.length) window.clearInterval(id);
    }, 22);
    return () => window.clearInterval(id);
  }, [activeLine, step]);

  return (
    <div className="absolute inset-0 z-[9300] flex items-center justify-center bg-boot/50 p-4">
      <div className="win98-out anim-snap-open w-full max-w-[480px] bg-surface p-[3px]">
        <div className="win98-titlebar-active flex items-center gap-2 px-[4px] py-[2px]">
          <span className="text-[11px] font-bold tracking-[0.12em] text-title-ink">
            BYTE.DOG — Precinct Sniffer
          </span>
        </div>

        <div className="flex gap-3 p-3">
          <div className="shrink-0">
            <div className="win98-in bg-field px-3 py-2 font-mono text-[11px] leading-[1.1] text-ink">
              <pre className="anim-blink-slow">{DOG_FRAMES[frame]}</pre>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div className="win98-groove bg-surface p-2">
              <div className="min-h-[36px] text-[11px] leading-[1.55] text-ink">
                {typed}
                {!typingDone && <span className="anim-blink">_</span>}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-[11px] text-ink-disabled">
                {step + 1} / {LINES.length}
              </span>
              <div className="flex gap-2">
                <Win98Button className="px-3" onClick={onBegin}>
                  SKIP
                </Win98Button>
                {lastStep ? (
                  <Win98Button className="px-3 font-bold" onClick={onBegin} disabled={!typingDone}>
                    LET'S GO
                  </Win98Button>
                ) : (
                  <Win98Button
                    className="px-3 font-bold"
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!typingDone}
                  >
                    NEXT
                  </Win98Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="win98-in mx-[3px] mb-[3px] truncate px-[5px] py-[2px] text-[11px] text-ink-disabled">
          First-time briefing only. After this, Byte trusts you to snoop unsupervised.
        </div>
      </div>
    </div>
  );
}
