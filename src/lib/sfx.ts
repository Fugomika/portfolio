// Tiny square-wave UI blips via WebAudio — no audio files, ~zero payload.
// Only ever called after an explicit user gesture, and only when SFX is opted in.

let ctx: AudioContext | null = null;

function tone(freq: number, at: number, dur: number, gain: number) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ctx.currentTime + at);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(ctx.currentTime + at);
  osc.stop(ctx.currentTime + at + dur);
}

export function playSfx(kind: "blip" | "toggle" | "ping" | "fanfare") {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    switch (kind) {
      case "blip":
        tone(660, 0, 0.06, 0.03);
        break;
      case "toggle":
        tone(440, 0, 0.05, 0.03);
        tone(880, 0.05, 0.07, 0.03);
        break;
      case "ping":
        tone(1200, 0, 0.09, 0.025);
        tone(1600, 0.07, 0.12, 0.02);
        break;
      case "fanfare":
        tone(523, 0, 0.1, 0.035);
        tone(659, 0.1, 0.1, 0.035);
        tone(784, 0.2, 0.1, 0.035);
        tone(1047, 0.3, 0.25, 0.04);
        break;
    }
  } catch {
    // Audio is decorative — never let it break the page.
  }
}
