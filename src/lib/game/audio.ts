/**
 * Tiny PC-speaker style synth. No audio assets, no network — just square waves.
 * Seam: swap `playCueSound` for a sample player later without touching callers.
 */
import type { SoundCue } from "./shellStore";

type Note = { f: number; d: number; type?: OscillatorType; gain?: number };

const CUES: Record<SoundCue, Note[]> = {
  boot: [
    { f: 392, d: 90 },
    { f: 523, d: 90 },
    { f: 784, d: 180 },
  ],
  message: [
    { f: 880, d: 70 },
    { f: 0, d: 40 },
    { f: 1174, d: 120 },
  ],
  error: [
    { f: 196, d: 130, type: "sawtooth" },
    { f: 147, d: 220, type: "sawtooth" },
  ],
  query: [
    { f: 1046, d: 30, gain: 0.05 },
    { f: 0, d: 30 },
    { f: 1046, d: 30, gain: 0.05 },
  ],
  evidence: [
    { f: 659, d: 60 },
    { f: 988, d: 60 },
    { f: 1318, d: 140 },
  ],
  solved: [
    { f: 523, d: 110 },
    { f: 659, d: 110 },
    { f: 784, d: 110 },
    { f: 1046, d: 320 },
  ],
};

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function playSequence(notes: Note[]) {
  const ac = getCtx();
  if (!ac) return () => {};
  let t = ac.currentTime + 0.01;
  const active: OscillatorNode[] = [];
  for (const n of notes) {
    const dur = n.d / 1000;
    if (n.f > 0) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = n.type ?? "square";
      osc.frequency.setValueAtTime(n.f, t);
      g.gain.setValueAtTime(n.gain ?? 0.075, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g).connect(ac.destination);
      osc.start(t);
      osc.stop(t + dur);
      active.push(osc);
    }
    t += dur;
  }
  return () => {
    const now = ac.currentTime;
    for (const osc of active) {
      try {
        osc.stop(now + 0.01);
      } catch {
        /* already finished */
      }
    }
  };
}

const BOOT_THEME: Note[] = [
  { f: 392, d: 70, gain: 0.04 },
  { f: 523, d: 70, gain: 0.04 },
  { f: 659, d: 70, gain: 0.045 },
  { f: 784, d: 110, gain: 0.05 },
  { f: 0, d: 35 },
  { f: 659, d: 60, gain: 0.04 },
  { f: 784, d: 60, gain: 0.045 },
  { f: 988, d: 70, gain: 0.045 },
  { f: 1174, d: 130, gain: 0.05 },
  { f: 0, d: 45 },
  { f: 1046, d: 60, type: "triangle", gain: 0.03 },
  { f: 784, d: 60, type: "triangle", gain: 0.03 },
  { f: 880, d: 70, gain: 0.04 },
  { f: 1046, d: 70, gain: 0.045 },
  { f: 1318, d: 180, gain: 0.05 },
];

export function playCueSound(cue: SoundCue) {
  void playSequence(CUES[cue]);
}

/** Short arcade-style startup sting for the loading screen. */
export function playBootTheme() {
  return playSequence(BOOT_THEME);
}
