// 맵 배경음 (WebAudio 잔잔한 픽셀 멜로디). 선택을 localStorage에 기억.
let ctx: AudioContext | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let master: GainNode | null = null;

const KEY = "our1000days-bgm";
export function bgmPref(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "on";
}
function setPref(on: boolean) { try { localStorage.setItem(KEY, on ? "on" : "off"); } catch {} }

export function isPlaying() { return ctx !== null; }

export function startBgm() {
  if (ctx) return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);
  master.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.2);

  // 잔잔한 순환 멜로디 (C 메이저 펜타토닉)
  const notes = [523.25, 587.33, 659.25, 783.99, 587.33, 659.25, 783.99, 880.0, 659.25, 587.33];
  let i = 0;
  const playNote = () => {
    if (!ctx || !master) return;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = notes[i % notes.length];
    i++;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    o.connect(g); g.connect(master);
    o.start(); o.stop(ctx.currentTime + 0.72);
  };
  playNote();
  timer = setInterval(playNote, 680);
  setPref(true);
}

export function stopBgm() {
  if (timer) { clearInterval(timer); timer = null; }
  if (ctx && master) {
    const c = ctx, m = master;
    try { m.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.3); } catch {}
    setTimeout(() => { try { c.close(); } catch {} }, 400);
  }
  ctx = null; master = null;
  setPref(false);
}

export function toggleBgm(): boolean {
  if (ctx) { stopBgm(); return false; }
  startBgm(); return true;
}
