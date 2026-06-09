// 가벼운 UI/게임 효과음 (WebAudio). 사용자 제스처에서 호출.
let actx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!actx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    try { actx = new AC(); } catch { return null; }
  }
  if (actx.state === "suspended") actx.resume().catch(() => {});
  return actx;
}

// 기본 오실레이터 1발
function osc(type: OscillatorType, f0: number, f1: number, t: number, dur: number, peak: number) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(); o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + dur + 0.03);
}
function now() { const c = ac(); return c ? c.currentTime : 0; }

// ── UI ──
export function playClick() { osc("square", 740, 1320, now(), 0.11, 0.10); }
export function playLocked() { osc("square", 330, 220, now(), 0.18, 0.09); }

// ── 수집 / 뾱뾱 ──
export function playPop() { const t = now(); osc("sine", 320, 1000, t, 0.08, 0.12); }
export function playCollect() {
  const t = now();
  osc("square", 660, 660, t, 0.06, 0.08);
  osc("square", 880, 880, t + 0.07, 0.06, 0.08);
  osc("square", 1175, 1175, t + 0.14, 0.10, 0.09);
}

// ── 고양이 야옹 ──
export function playMeow() {
  const t = now();
  osc("triangle", 500, 840, t, 0.14, 0.11);
  osc("triangle", 860, 430, t + 0.12, 0.26, 0.11);
}

// ── 정답 / 성공 ──
export function playSuccess() {
  const t = now();
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => osc("triangle", f, f, t + i * 0.08, 0.16, 0.10));
}
// ── 오답 / 실패 ──
export function playWrong() {
  const t = now();
  osc("square", 311, 311, t, 0.12, 0.09);
  osc("square", 233, 220, t + 0.12, 0.22, 0.09);
}
// ── 반짝 / 잠금해제 ──
export function playSparkle() {
  const t = now();
  [1568, 1318, 1046, 1760].forEach((f, i) => osc("square", f, f, t + i * 0.05, 0.10, 0.06));
}

// ── 룰렛 돌리는 소리 (감속 틱 + 멈춤 딩) ──
export function playSpin() {
  const c = ac(); if (!c) return;
  let t = c.currentTime; let gap = 0.045;
  for (let i = 0; i < 60; i++) {
    osc("square", 1300, 1300, t, 0.018, 0.05);
    t += gap; gap *= 1.075;
    if (gap > 0.26) break;
  }
  osc("triangle", 880, 1320, t + 0.06, 0.2, 0.12);
}
// ── 당첨 팡파레 ──
export function playWin() {
  const t = now();
  [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => osc("square", f, f, t + i * 0.09, 0.18, 0.09));
  [1568, 2093].forEach((f, i) => osc("triangle", f, f, t + 0.5 + i * 0.08, 0.22, 0.07));
}
