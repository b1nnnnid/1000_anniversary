"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

/* ───────────────────────────────────────────────────────────────
   전체보기 인트로 시네마틱 (~28초)
   여캐 단독 → 남캐 단독 → 길목에서 반함 → 핑크길 동행 →
   비/장애물 협력 → 100·200·365·730일 표지판+성장 → 1000일 도달 →
   앞에 펼쳐진 길들. 끝나면 onDone().
   ─────────────────────────────────────────────────────────────── */

const W = 180, H = 360;
const GROUND = 300;           // 캐릭터 발 y
const HZ = 196;               // 지평선 y

type Expr = "normal" | "love" | "effort" | "happy";

const PHASES = [
  { key: "girl", dur: 3600 },
  { key: "boy", dur: 3600 },
  { key: "meet", dur: 4400 },
  { key: "together", dur: 3000 },
  { key: "rain", dur: 4600 },
  { key: "grow", dur: 5200 },
  { key: "finale", dur: 3800 },
] as const;
const TOTAL = PHASES.reduce((s, p) => s + p.dur, 0);

const CAPTION: Record<string, string> = {
  girl: "각자의 길을 걷던 두 사람",
  boy: "각자의 길을 걷던 두 사람",
  meet: "운명처럼, 한 길목에서",
  together: "이제 함께 걷기 시작 ♥",
  rain: "비가 와도, 함께라면",
  grow: "100일, 200일… 함께 자라며",
  finale: "그리고, 우리의 1000일 ♥",
};

const SKIN = "#FBE0CC", EYE = "#4A3A2E";
const PAL = {
  girl: { hair: "#E889AC", top: "#FFFFFF", trim: "#F4B8CC", dress: true, shoe: "#E8799F", pants: "#F4B8CC" },
  boy: { hair: "#3F3B45", top: "#A8CFF0", trim: "#8FB8DC", dress: false, shoe: "#5A4A55", pants: "#5A6B8C" },
};

const R = (x: number, y: number, w: number, h: number, f: string, key: string) =>
  <rect key={key} x={x} y={y} width={w} height={h} fill={f} />;

// 앱의 리액션 캐릭터(drawReaction) 디자인을 그대로 옮긴 SVG 스프라이트.
// 로컬 그리드(중앙 x=20, 발 y=35) 기준, 발 중앙(x,y)에 배치.
function Person({ who, frame, expr, x, y, scale }: {
  who: "girl" | "boy"; frame: 0 | 1; expr: Expr; x: number; y: number; scale: number;
}) {
  const hair = who === "girl" ? "#E889AC" : "#3F3B45";
  const happy = expr === "love" || expr === "happy";
  const oy = frame === 1 ? -1 : 0;
  const e: ReactNode[] = [];
  const g = (gx: number, gy: number, gw: number, gh: number, c: string, k: string) =>
    e.push(R(gx, gy + oy, gw, gh, c, k));

  // ── 머리 ──
  g(12, 7, 16, 5, hair, "h1");
  if (who === "girl") { g(11, 9, 3, 11, hair, "hl"); g(26, 9, 3, 11, hair, "hr"); g(23, 5, 4, 3, "#E8556F", "rb1"); g(20, 6, 3, 2, "#E8556F", "rb2"); }
  else { g(11, 9, 3, 6, hair, "hl"); g(26, 9, 3, 6, hair, "hr"); g(10, 6, 4, 4, hair, "ht1"); g(26, 5, 4, 4, hair, "ht2"); }
  g(14, 12, 12, 9, SKIN, "face");

  // ── 표정 ──
  if (happy) {
    g(16, 15, 1, 1, EYE, "e1"); g(17, 14, 1, 1, EYE, "e2"); g(18, 15, 1, 1, EYE, "e3");
    g(21, 15, 1, 1, EYE, "e4"); g(22, 14, 1, 1, EYE, "e5"); g(23, 15, 1, 1, EYE, "e6");
    g(18, 18, 4, 2, EYE, "m1"); g(19, 19, 2, 1, "#F08CA0", "m2");
    g(15, 17, 2, 1, "#F4A8B8", "c1"); g(23, 17, 2, 1, "#F4A8B8", "c2");
  } else {
    g(16, 14, 2, 2, EYE, "e1"); g(22, 14, 2, 2, EYE, "e2"); g(16, 14, 1, 1, "#fff", "e3"); g(22, 14, 1, 1, "#fff", "e4");
    g(19, 18, 2, 2, EYE, "m1"); g(15, 17, 2, 1, "#F4A8B8", "c1"); g(23, 17, 2, 1, "#F4A8B8", "c2");
  }

  // ── 몸통 + 다리 ──
  const l0 = frame === 0;
  let aY = 29, aH = 4, bY = 29, bH = 4;
  if (!happy) { if (l0) { bY = 30; bH = 3; } else { aY = 30; aH = 3; } }
  if (who === "girl") {
    g(14, 21, 12, 8, "#FFFFFF", "b1"); g(14, 27, 12, 2, "#F4B8CC", "b2");
    g(16, aY, 3, aH, SKIN, "lg1"); g(21, bY, 3, bH, SKIN, "lg2");
    g(16, aY + aH, 3, 2, "#E8556F", "sh1"); g(21, bY + bH, 3, 2, "#E8556F", "sh2");
  } else {
    g(14, 21, 12, 8, "#A8CFF0", "b1"); g(14, 27, 12, 2, "#8FB8DC", "b2");
    g(16, aY, 3, aH, "#5A6B8C", "lg1"); g(21, bY, 3, bH, "#5A6B8C", "lg2");
    g(16, aY + aH, 3, 2, "#FFFFFF", "sh1"); g(21, bY + bH, 3, 2, "#FFFFFF", "sh2");
  }

  // ── 팔 ──
  if (happy) { const ay = l0 ? 17 : 15; g(11, ay, 3, 5, SKIN, "a1"); g(26, ay, 3, 5, SKIN, "a2"); }
  else g(17, 23, 6, 3, SKIN, "a1");

  // ── 이펙트 ──
  if (expr === "love") {
    const heart = (hx: number, hy: number, c: string, k: string) => {
      g(hx, hy, 2, 2, c, k + "a"); g(hx + 3, hy, 2, 2, c, k + "b"); g(hx, hy + 2, 5, 2, c, k + "c"); g(hx + 1, hy + 4, 3, 1, c, k + "d"); g(hx + 2, hy + 5, 1, 1, c, k + "e");
    };
    if (l0) { heart(4, 10, "#E8799F", "ha"); heart(31, 14, "#F2A3C0", "hb"); }
    else { heart(3, 8, "#F2A3C0", "ha"); heart(32, 11, "#E8799F", "hb"); }
  } else if (expr === "effort") {
    g(7, 11, 2, 3, "#9FD9F0", "sw1"); g(31, 9, 2, 3, "#9FD9F0", "sw2");
  } else if (expr === "happy") {
    const sx = l0 ? 0 : 1;
    g(6 + sx, 12, 1, 3, "#F2C76B", "sp1"); g(5 + sx, 13, 3, 1, "#F2C76B", "sp2");
    g(32 - sx, 9, 1, 3, "#F2C76B", "sp3"); g(31 - sx, 10, 3, 1, "#F2C76B", "sp4");
  }

  const S = scale * 1.3;
  return <g transform={`translate(${x - 20 * S} ${y - 35 * S}) scale(${S})`}>{e}</g>;
}

function Heart({ cx, cy, s, c, o = 1 }: { cx: number; cy: number; s: number; c: string; o?: number }) {
  return <path transform={`translate(${cx} ${cy}) scale(${s})`} opacity={o}
    d="M0 2 C0 0 -3 -1 -4 1 C-5 3 -2 5 0 7 C2 5 5 3 4 1 C3 -1 0 0 0 2 Z" fill={c} />;
}

function Sign({ x, label, scale = 1 }: { x: number; label: string; scale?: number }) {
  const w = 46, bx = x - w / 2;
  return (
    <g transform={`translate(0 ${(1 - scale) * 30})`}>
      <rect x={x - 2} y={HZ + 8} width="4" height="36" fill="#9A6B3A" />
      <rect x={bx} y={HZ - 8} width={w} height="24" rx="3" fill="#FBF3F8" stroke="#C49A6E" strokeWidth="2.5" />
      <text x={x} y={HZ + 8} textAnchor="middle" fontFamily="Galmuri11, monospace" fontSize="13" fill="#B85C82">{label}</text>
    </g>
  );
}

export default function IntroCinematic({ onDone }: { onDone: () => void }) {
  const [el, setEl] = useState(0);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(false);

  const finish = () => { if (!doneRef.current) { doneRef.current = true; cancelAnimationFrame(rafRef.current); onDone(); } };

  useEffect(() => {
    const loop = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const e = now - startRef.current;
      setEl(e);
      if (e >= TOTAL) { finish(); return; }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 현재 페이즈 + 진행도
  let t = el, idx = 0;
  for (; idx < PHASES.length; idx++) { if (t < PHASES[idx].dur) break; t -= PHASES[idx].dur; }
  if (idx >= PHASES.length) idx = PHASES.length - 1;
  const key = PHASES[idx].key;
  const p = Math.min(1, t / PHASES[idx].dur);
  const wf: 0 | 1 = (Math.floor(el / 150) % 2) as 0 | 1;

  // 색 테마
  const pink = key === "together" || key === "rain" || key === "grow" || key === "finale";
  const dark = key === "rain";
  const skyTop = key === "finale" ? "#FBD9C4" : dark ? "#3A3550" : "#CDEBD8";
  const skyBot = key === "finale" ? "#F7C9DC" : dark ? "#4A4566" : "#E3F4E0";
  const grass = dark ? "#2E5A44" : "#BFE6C8";
  const grassDk = dark ? "#244B38" : "#A7D8B6";
  const path = pink ? (dark ? "#C98AA8" : "#F4C6DC") : "#EAD0AE";
  const pathDk = pink ? (dark ? "#B06888" : "#E2B2CB") : "#D8B488";

  // 캐릭터 배치
  let girl: { x: number; sc: number; ex: Expr } | null = null;
  let boy: { x: number; sc: number; ex: Expr } | null = null;
  let yG = GROUND, yB = GROUND;
  const extra: ReactNode[] = [];

  if (key === "girl") girl = { x: 90, sc: 2.5, ex: "normal" };
  else if (key === "boy") boy = { x: 90, sc: 2.5, ex: "normal" };
  else if (key === "together") { girl = { x: 66, sc: 2.0, ex: "happy" }; boy = { x: 116, sc: 2.0, ex: "happy" }; }
  else if (key === "meet") {
    const k = Math.min(1, p / 0.6);
    const love = p > 0.62;
    girl = { x: 34 + k * 32, sc: 2.0, ex: love ? "love" : "normal" };
    boy = { x: 150 - k * 34, sc: 2.0, ex: love ? "love" : "normal" };
    if (love) {
      const hop = Math.abs(Math.sin(el / 110)) * 4;
      yG = GROUND - hop; yB = GROUND - hop;
      for (let i = 0; i < 6; i++) {
        const ph = (el / 22 + i * 34) % 130;
        extra.push(<Heart key={"mh" + i} cx={90 + Math.sin(el / 280 + i) * 16} cy={GROUND - 40 - ph} s={1 + (i % 2) * 0.5} c="#E8556F" o={Math.max(0, 1 - ph / 130)} />);
      }
    }
  } else if (key === "rain") {
    const obs = p > 0.36 && p < 0.74;
    const hop = obs ? Math.max(0, Math.sin((p - 0.36) / 0.38 * Math.PI)) * 16 : 0;
    girl = { x: 66, sc: 2.0, ex: "effort" }; boy = { x: 116, sc: 2.0, ex: "effort" };
    yG = GROUND - hop * 0.7; yB = GROUND - hop;
    if (p < 0.74) extra.push(
      <g key="log">
        <rect x="80" y={GROUND - 14} width="22" height="14" rx="6" fill="#8A5A36" />
        <rect x="80" y={GROUND - 14} width="22" height="5" rx="2" fill="#A06E44" />
        <ellipse cx="80" cy={GROUND - 7} rx="3.5" ry="6" fill="#6E4528" />
      </g>
    );
    // 비
    for (let i = 0; i < 34; i++) {
      const rx = (i * 23 + el * 0.18) % (W + 20) - 10;
      const ry = (i * 53 + el * 0.9) % (H + 20) - 10;
      extra.push(<line key={"rn" + i} x1={rx} y1={ry} x2={rx - 2} y2={ry + 9} stroke="#BFE0F5" strokeWidth="1.5" opacity="0.7" />);
    }
  } else if (key === "grow") {
    const gp = p * 4, step = Math.min(3, Math.floor(gp)), local = gp - step;
    const sc = 1.9 + step * 0.12;
    girl = { x: 66, sc, ex: "happy" }; boy = { x: 116, sc, ex: "happy" };
    const labels = ["100일", "200일", "1년", "2년"];
    const sx = (W + 24) - local * (W + 60);
    extra.push(<Sign key="sg" x={sx} label={labels[step]} scale={Math.min(1, 1.3 - Math.abs(sx - 90) / 120)} />);
  } else if (key === "finale") {
    girl = { x: 70, sc: 2.45, ex: "happy" }; boy = { x: 110, sc: 2.45, ex: "happy" };
    extra.push(<Sign key="k1000" x={90} label="1000일 ♥" scale={Math.min(1, p / 0.3 + 0.4)} />);
    if (p > 0.5) {
      const sp = (p - 0.5) / 0.5;
      [-1, -0.5, 0.5, 1].forEach((d, i) =>
        extra.push(<polygon key={"fp" + i} opacity={sp}
          points={`${90 + d * 6},${HZ} ${90 + d * 10},${HZ} ${90 + d * (70 + i * 14) + 18},360 ${90 + d * (70 + i * 14) - 18},360`}
          fill={i % 2 ? "#F4C6DC" : "#F8D6E6"} />));
      for (let i = 0; i < 7; i++) {
        const ph = (el / 16 + i * 40) % 150;
        extra.push(<Heart key={"fh" + i} cx={30 + i * 20} cy={HZ - 6 - ph * 0.4} s={1 + (i % 3) * 0.4} c="#E8799F" o={Math.max(0, 1 - ph / 150) * sp} />);
      }
    }
  }

  // 스크롤 풀숲
  const tufts: ReactNode[] = [];
  for (let i = 0; i < 10; i++) {
    const ty = HZ + ((el * 0.05 + i * 28) % (H - HZ + 20));
    const depth = (ty - HZ) / (H - HZ);
    const side = i % 2 ? 1 : -1;
    const tx = 90 + side * (10 + depth * 78);
    const sc = 0.4 + depth * 1.3;
    tufts.push(<g key={"tf" + i} transform={`translate(${tx} ${ty}) scale(${sc})`}>
      <rect x="-4" y="-3" width="8" height="4" fill={grassDk} /><rect x="-2" y="-6" width="4" height="4" fill={grass} />
    </g>);
  }

  const caption = CAPTION[key];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges"
        style={{ width: "100%", height: "100%" }} role="img" aria-label="우리의 1000일 인트로 애니메이션">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={skyTop} /><stop offset="1" stopColor={skyBot} />
          </linearGradient>
        </defs>
        {/* 하늘 */}
        <rect x="0" y="0" width={W} height={HZ + 4} fill="url(#sky)" />
        {/* 해/달 */}
        {key === "finale"
          ? <circle cx="138" cy="48" r="20" fill="#FBE3B0" opacity="0.9" />
          : dark ? <circle cx="40" cy="42" r="13" fill="#E8E0F0" opacity="0.7" />
            : <circle cx="40" cy="40" r="15" fill="#FBE9A8" opacity="0.85" />}
        {/* 잔디 */}
        <rect x="0" y={HZ} width={W} height={H - HZ} fill={grass} />
        <rect x="0" y={HZ} width={W} height="4" fill={grassDk} />
        {/* 길 (원근 사다리꼴) */}
        {key === "meet" && (
          <>
            <polygon points={`78,${HZ} 88,${HZ} 96,260 70,260`} fill={pathDk} opacity="0.9" />
            <polygon points={`92,${HZ} 102,${HZ} 110,260 84,260`} fill={pathDk} opacity="0.9" />
          </>
        )}
        <polygon points={`82,${HZ} 98,${HZ} 142,360 38,360`} fill={path} />
        <polygon points={`88,${HZ} 92,${HZ} 104,360 76,360`} fill={pathDk} opacity="0.45" />
        {tufts}
        {extra}
        {girl && <Person who="girl" frame={wf} expr={girl.ex} x={girl.x} y={yG} scale={girl.sc} />}
        {boy && <Person who="boy" frame={wf} expr={boy.ex} x={boy.x} y={yB} scale={boy.sc} />}
        {/* 비 어둠 오버레이 */}
        {dark && <rect x="0" y="0" width={W} height={H} fill="#1A1630" opacity="0.28" />}
        {/* 캡션 */}
        <rect x="14" y="18" width={W - 28} height="22" rx="11" fill="#FFFFFF" opacity="0.82" />
        <text x={W / 2} y="33" textAnchor="middle" fontFamily="Galmuri11, monospace" fontSize="11" fill="#B85C82">{caption}</text>
      </svg>

      {/* 스킵 */}
      <button onClick={finish} aria-label="건너뛰기"
        style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.85)", color: "#B85C82", border: "none", borderRadius: 999, padding: "7px 14px", fontSize: 12, fontFamily: "var(--font-pixel)", boxShadow: "0 2px 0 rgba(124,90,150,0.25)" }}>
        건너뛰기 ⏭
      </button>
      {/* 진행바 */}
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: `${(el / TOTAL) * 100}%`, background: "linear-gradient(90deg,#E8799F,#CDB8E6)" }} />
    </div>
  );
}
