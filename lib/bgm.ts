// 맵 배경음 (WebAudio 칩튠: 코드 진행 + 베이스 + 아르페지오 + 멜로디 + 가벼운 드럼).
// C–G–Am–F 순환. 선택을 localStorage에 기억.
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sched: ReturnType<typeof setInterval> | null = null;
let step = 0;
let nextTime = 0;

const KEY = "our1000days-bgm";
export function bgmPref(): boolean {
  if (typeof window === "undefined") return false;
  // 기본값 ON: 사용자가 명시적으로 끈 경우("off")에만 꺼짐
  return localStorage.getItem(KEY) !== "off";
}
function setPref(on: boolean) { try { localStorage.setItem(KEY, on ? "on" : "off"); } catch {} }

export function isPlaying() { return ctx !== null; }

// ── 화성/멜로디 (C 메이저) ──
type Chord = { triad: number[]; bass: number; mel: number[] };
const CHORDS: Chord[] = [
  { triad: [261.63, 329.63, 392.00], bass: 65.41, mel: [329.63, 392.00, 523.25, 392.00, 440.00, 392.00, 329.63, 261.63] }, // C
  { triad: [246.94, 293.66, 392.00], bass: 98.00, mel: [293.66, 392.00, 493.88, 587.33, 493.88, 392.00, 293.66, 246.94] }, // G
  { triad: [220.00, 261.63, 329.63], bass: 110.00, mel: [261.63, 329.63, 440.00, 523.25, 659.25, 523.25, 440.00, 329.63] }, // Am
  { triad: [220.00, 261.63, 349.23], bass: 87.31, mel: [261.63, 349.23, 440.00, 523.25, 440.00, 349.23, 261.63, 220.00] }, // F
];

const TEMPO = 104;
const SIXTEENTH = 60 / TEMPO / 4; // 초

function tone(type: OscillatorType, freq: number, time: number, dur: number, gain: number) {
  if (!ctx || !master) return;
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(gain, time + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  o.connect(g); g.connect(master); o.start(time); o.stop(time + dur + 0.03);
}
function kick(time: number) {
  if (!ctx || !master) return;
  const o = ctx.createOscillator(); o.type = "sine";
  o.frequency.setValueAtTime(150, time);
  o.frequency.exponentialRampToValueAtTime(45, time + 0.12);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.28, time);
  g.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);
  o.connect(g); g.connect(master); o.start(time); o.stop(time + 0.2);
}
function hat(time: number) {
  if (!ctx || !master) return;
  const len = Math.floor(ctx.sampleRate * 0.05);
  const b = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  const s = ctx.createBufferSource(); s.buffer = b;
  const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 6500;
  const g = ctx.createGain(); g.gain.value = 0.045;
  s.connect(hp); hp.connect(g); g.connect(master); s.start(time);
}

function scheduleStep(s: number, time: number) {
  const bar = Math.floor(s / 16) % 4;
  const ch = CHORDS[bar];
  const inBar = s % 16;
  // 패드 (마디 시작에 트라이앵글 화음 지속)
  if (inBar === 0) for (const f of ch.triad) tone("triangle", f, time, SIXTEENTH * 16, 0.05);
  // 베이스 (매 박, 옥타브 바운스)
  if (inBar % 4 === 0) {
    const beat = inBar / 4;
    tone("triangle", ch.bass * (beat % 2 ? 2 : 1), time, SIXTEENTH * 3.4, 0.17);
  }
  // 아르페지오 (16분)
  tone("square", ch.triad[s % 3] * 2, time, SIXTEENTH * 0.85, 0.035);
  // 멜로디 (8분)
  if (inBar % 2 === 0) tone("square", ch.mel[inBar / 2], time, SIXTEENTH * 1.7, 0.10);
  // 드럼
  if (inBar === 0 || inBar === 8) kick(time);
  if (inBar % 4 === 2) hat(time);
}

export function startBgm() {
  if (ctx) return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);
  master.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 1.0);

  step = 0;
  nextTime = ctx.currentTime + 0.1;
  const loop = () => {
    if (!ctx) return;
    while (nextTime < ctx.currentTime + 0.13) {
      scheduleStep(step, nextTime);
      nextTime += SIXTEENTH;
      step++;
    }
  };
  loop();
  sched = setInterval(loop, 25);
  setPref(true);
}

export function stopBgm() {
  if (sched) { clearInterval(sched); sched = null; }
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

// 자동재생이 브라우저 정책으로 suspended 된 경우, 제스처에서 재개
export function resumeBgm() {
  if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
}
