"use client";

import { useState, useEffect, useMemo, ReactNode } from "react";
import { useRouter } from "next/navigation";
import PixelIcon from "@/components/PixelIcon";

// 픽셀 하트 도트 좌표 (7x6)
const HEART_MAP = [[0, 1, 1, 0, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 1, 0, 0, 0]];
const HEART_CELLS: { x: number; y: number }[] = [];
HEART_MAP.forEach((row, rr) => row.forEach((v, cc) => { if (v) HEART_CELLS.push({ x: cc * 13, y: rr * 13 }); }));

const COUPLE_SVG = (
  <svg width="220" height="156" viewBox="0 0 240 190" aria-hidden="true" shapeRendering="crispEdges">
    <ellipse cx="120" cy="172" rx="92" ry="13" fill="#E0D0EC" />
    <rect x="24" y="118" width="192" height="48" rx="14" fill="#C7E8D2" />
    <g transform="translate(48,52)">
      <rect x="16" y="16" width="40" height="28" fill="#FBE0CC" />
      <rect x="16" y="0" width="40" height="10" fill="#E889AC" /><rect x="12" y="6" width="48" height="14" fill="#E889AC" />
      <rect x="8" y="14" width="10" height="26" fill="#E889AC" /><rect x="54" y="14" width="10" height="26" fill="#E889AC" />
      <rect x="12" y="16" width="48" height="4" fill="#D9719A" /><rect x="50" y="0" width="12" height="9" fill="#E8556F" />
      <rect x="24" y="28" width="5" height="6" fill="#4A3A2E" /><rect x="43" y="28" width="5" height="6" fill="#4A3A2E" />
      <rect x="19" y="36" width="7" height="4" fill="#F8B8C8" /><rect x="46" y="36" width="7" height="4" fill="#F8B8C8" />
      <rect x="33" y="38" width="6" height="4" fill="#D96A7E" />
      <rect x="16" y="44" width="40" height="24" fill="#FFFFFF" /><rect x="12" y="60" width="48" height="10" fill="#FFFFFF" />
      <rect x="12" y="66" width="48" height="4" fill="#F4B8CC" /><rect x="30" y="44" width="12" height="5" fill="#F4B8CC" />
      <rect x="8" y="46" width="8" height="16" fill="#FBE0CC" /><rect x="56" y="48" width="10" height="8" fill="#FBE0CC" />
      <rect x="22" y="82" width="12" height="5" fill="#E8556F" /><rect x="38" y="82" width="12" height="5" fill="#E8556F" />
    </g>
    <g transform="translate(126,52)">
      <rect x="16" y="16" width="40" height="28" fill="#FBE0CC" />
      <rect x="16" y="0" width="40" height="10" fill="#3F3B45" /><rect x="12" y="6" width="48" height="12" fill="#3F3B45" />
      <rect x="8" y="8" width="8" height="6" fill="#3F3B45" /><rect x="56" y="6" width="8" height="6" fill="#3F3B45" />
      <rect x="24" y="28" width="5" height="6" fill="#4A3A2E" /><rect x="43" y="28" width="5" height="6" fill="#4A3A2E" />
      <rect x="33" y="39" width="6" height="3" fill="#C96A6A" />
      <rect x="16" y="44" width="40" height="22" fill="#A8CFF0" /><rect x="16" y="60" width="40" height="6" fill="#8FB8DC" />
      <rect x="28" y="44" width="16" height="4" fill="#FFFFFF" />
      <rect x="6" y="48" width="10" height="8" fill="#FBE0CC" /><rect x="56" y="46" width="8" height="16" fill="#FBE0CC" />
      <rect x="20" y="66" width="32" height="10" fill="#5A6B8C" /><rect x="24" y="76" width="8" height="8" fill="#5A6B8C" /><rect x="40" y="76" width="8" height="8" fill="#5A6B8C" />
      <rect x="22" y="84" width="12" height="5" fill="#FFFFFF" /><rect x="38" y="84" width="12" height="5" fill="#FFFFFF" />
    </g>
    <rect x="114" y="100" width="12" height="8" fill="#FBE0CC" />
    <path d="M120 30c0-9-14-11-14 0 0 8 14 16 14 16s14-8 14-16c0-11-14-9-14 0Z" fill="#E8799F" />
    <path d="M44 28c0-6-10-8-10 0 0 5 10 11 10 11s10-6 10-11c0-8-10-6-10 0Z" fill="#F2A3C0" />
    <path d="M196 38c0-6-10-7-10 0 0 5 10 11 10 11s10-6 10-11c0-7-10-6-10 0Z" fill="#C9A7F0" />
  </svg>
);

// 가짜 화면 프레임
function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="pixel-border" style={{ background: "var(--cream)", borderRadius: 16, padding: "12px 12px 14px", width: "100%", maxWidth: 280 }}>
      {children}
    </div>
  );
}

// 슬라이드 1: 추억탐방 미리보기
const PreviewMap = (
  <Screen>
    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 8 }}>
      <span className="chip" style={{ fontSize: 10 }}><PixelIcon name="camera" size={12} /> 0/7</span>
      <span className="chip" style={{ fontSize: 10 }}><PixelIcon name="heart" size={12} /> 0/8</span>
      <span className="chip" style={{ fontSize: 10 }}><PixelIcon name="ticket" size={12} /> 0</span>
    </div>
    <svg width="100%" viewBox="0 0 120 96" shapeRendering="crispEdges" style={{ borderRadius: 8, display: "block" }}>
      <rect width="120" height="96" fill="#CDEBD8" />
      <path d="M52 0 L52 40 L84 40 L84 96" stroke="#F3E3CE" strokeWidth="16" fill="none" />
      <path d="M52 0 L52 40 L84 40 L84 96" stroke="#EAD0AE" strokeWidth="16" strokeDasharray="2 13" fill="none" />
      <g><rect x="14" y="20" width="14" height="14" fill="#A7D8B6" /><rect x="18" y="12" width="8" height="10" fill="#BCE6C8" /><rect x="20" y="34" width="3" height="5" fill="#C7A07A" /></g>
      <g transform="translate(40,8)"><rect x="0" y="0" width="20" height="20" fill="#fff" /><rect x="0" y="0" width="20" height="5" fill="#F4D6E6" /><rect x="4" y="8" width="12" height="9" fill="#BFE0F5" /><rect x="7" y="-6" width="6" height="6" fill="#E8799F" /></g>
      <g transform="translate(76,52)">
        <rect x="2" y="8" width="12" height="10" fill="#A8CFF0" /><rect x="4" y="2" width="8" height="7" fill="#FBE0CC" />
        <rect x="3" y="0" width="10" height="4" fill="#3F3B45" /><rect x="5" y="4" width="2" height="2" fill="#4A3A2E" /><rect x="9" y="4" width="2" height="2" fill="#4A3A2E" />
        <rect x="4" y="18" width="4" height="4" fill="#5A6B8C" /><rect x="9" y="18" width="4" height="4" fill="#5A6B8C" />
      </g>
    </svg>
  </Screen>
);

// 슬라이드 2: 미니게임 & 티켓
const PreviewGames = (
  <Screen>
    <p style={{ margin: "2px 0 10px", fontSize: 12, color: "#2F7A52", textAlign: "center" }}>미션 성공! 🎟 +1</p>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
      <PixelIcon name="ticket" size={20} /><PixelIcon name="ticket" size={20} /><PixelIcon name="ticket" size={20} />
      <span style={{ fontSize: 14, color: "#B85C82", margin: "0 4px" }}>→</span>
      <PixelIcon name="ticket" size={22} />
    </div>
    <div style={{ display: "flex", justifyContent: "center", gap: 10, borderTop: "1px dashed #E0D0DC", paddingTop: 10 }}>
      <span style={{ fontSize: 11, color: "#8A7A85", display: "flex", alignItems: "center", gap: 3 }}><PixelIcon name="heart" size={13} /> 숨은하트</span>
      <span style={{ fontSize: 11, color: "#8A7A85", display: "flex", alignItems: "center", gap: 3 }}><PixelIcon name="cat" size={14} /> 고양이</span>
      <span style={{ fontSize: 11, color: "#8A7A85", display: "flex", alignItems: "center", gap: 3 }}><PixelIcon name="bubble" size={13} /> 퀴즈</span>
    </div>
  </Screen>
);

// 슬라이드 3: 우리의 공간
const HUB = [
  { icon: "gift", label: "룰렛" }, { icon: "letter", label: "편지함" }, { icon: "crystal", label: "사주" },
  { icon: "moon", label: "운세" }, { icon: "cards", label: "유형테스트" }, { icon: "trophy", label: "업적" },
];
const PreviewHub = (
  <Screen>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      {HUB.map((h) => (
        <div key={h.icon} style={{ background: "#fff", borderRadius: 10, padding: "10px 4px", textAlign: "center", boxShadow: "0 2px 0 rgba(124,90,150,0.1)" }}>
          <PixelIcon name={h.icon} size={26} />
          <p style={{ margin: "4px 0 0", fontSize: 9.5, color: "#B85C82" }}>{h.label}</p>
        </div>
      ))}
    </div>
  </Screen>
);

// 슬라이드 4: 엔딩 티저 (스포 금지)
const PreviewTeaser = (
  <Screen>
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <div className="floaty" style={{ position: "relative", display: "inline-block" }}>
        <PixelIcon name="gift" size={64} />
        <span className="sparkle" style={{ position: "absolute", top: -6, right: -10 }}><PixelIcon name="sparkle" size={20} /></span>
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 13, color: "#B85C82" }}>추억을 다 모으면...?</p>
      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#A89AA3" }}>끝까지 가면 알게 돼요 (비밀 ✨)</p>
    </div>
  </Screen>
);

const SLIDES: { title: string; body: string; preview: ReactNode }[] = [
  { title: "추억을 따라 걸어요", body: "캐릭터를 움직여 우리가 걸어온 길을 따라가요.\n스테이지에 닿으면 그날의 추억이 하나씩 열려요.", preview: PreviewMap },
  { title: "모으고, 풀고, 즐겨요", body: "숨은 하트·고양이·미니 미션으로 티켓 조각을 모아\n소원권 룰렛을 돌릴 수 있어요.", preview: PreviewGames },
  { title: "우리의 공간엔 가득", body: "편지함, 사주·운세, 커플 유형 테스트,\n포토부스, 룰렛, 업적까지 즐길 게 많아요.", preview: PreviewHub },
  { title: "그리고 마지막엔...", body: "추억을 끝까지 모으면 특별한 순간이 기다려요.\n어떤 일일지는 직접 확인해봐요!", preview: PreviewTeaser },
];

// 표지 연출: 타이핑 → 1000 카운트업 → 픽셀 하트 조립 → 제목·커플 등장
function CoverIntro({ onStart }: { onStart: () => void }) {
  const [phase, setPhase] = useState<"type" | "count" | "assemble" | "done">("type");
  const [typed, setTyped] = useState("");
  const [num, setNum] = useState(0);
  const offs = useMemo(() => HEART_CELLS.map(() => ({ dx: Math.round((Math.random() - 0.5) * 200), dy: Math.round((Math.random() - 0.5) * 200) })), []);
  const FULL = "2023.10.08 — 우리 이야기가 시작된 날";

  useEffect(() => {
    if (phase !== "type") return;
    let i = 0;
    const id = setInterval(() => { i++; setTyped(FULL.slice(0, i)); if (i >= FULL.length) { clearInterval(id); setTimeout(() => setPhase("count"), 450); } }, 45);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "count") return;
    let raf = 0; const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1400);
      setNum(Math.round(1000 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick); else setTimeout(() => setPhase("assemble"), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== "assemble") return;
    const t = setTimeout(() => setPhase("done"), 900);
    return () => clearTimeout(t);
  }, [phase]);

  const skip = () => { setTyped(FULL); setNum(1000); setPhase("done"); };
  const showHeart = phase === "assemble" || phase === "done";

  return (
    <div className="slideup" onClick={phase === "done" ? undefined : skip}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 340 }}>
      {phase === "type" && (
        <p style={{ fontFamily: "var(--font-pixel)", fontSize: 13, color: "#B85C82", minHeight: 20, margin: 0 }}>{typed}<span className="cover-cur" /></p>
      )}
      {phase === "count" && (
        <p style={{ fontSize: 52, color: "#E8556F", fontWeight: 700, margin: 0, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{num.toLocaleString()}<span style={{ fontSize: 20 }}>일</span></p>
      )}
      {showHeart && (
        <div style={{ position: "relative", width: 91, height: 78, margin: "0 auto 6px" }}>
          {HEART_CELLS.map((cell, i) => (
            <span key={i} className="cover-cell" style={{ left: cell.x, top: cell.y, ["--dx" as string]: `${offs[i].dx}px`, ["--dy" as string]: `${offs[i].dy}px`, animationDelay: `${i * 0.03}s` }} />
          ))}
        </div>
      )}
      {phase === "done" && (
        <div className="pop" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="sparkle" style={{ fontSize: 13, color: "#B85C82", letterSpacing: 2 }}>OUR LITTLE WORLD</div>
          <h1 style={{ fontSize: 26, color: "#B85C82", margin: "8px 0 4px", lineHeight: 1.4 }}>우리의 1000일 ♥</h1>
          <p style={{ fontSize: 13, color: "#8A7A85", margin: "0 0 14px", lineHeight: 1.7 }}>함께 걸어온 길을 따라가는 작은 추억 여행</p>
          <div className="floaty">{COUPLE_SVG}</div>
          <button className="btn-rose" onClick={onStart} style={{ marginTop: 20 }}>여행 시작하기 →</button>
        </div>
      )}
      {phase !== "done" && (
        <p style={{ fontSize: 11, color: "#C5B7C0", marginTop: 18, margin: "18px 0 0" }}>탭하면 바로 시작 ›</p>
      )}
    </div>
  );
}

export default function Intro() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const total = SLIDES.length + 1; // 표지 + 4

  const next = () => { if (step < SLIDES.length) setStep(step + 1); else router.push("/map"); };

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "26px 22px", textAlign: "center", maxWidth: 460, margin: "0 auto" }}>
      {step === 0 ? (
        <CoverIntro key="cover" onStart={next} />
      ) : (
        <div key={step} className="slideup" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          {SLIDES[step - 1].preview}
          <h2 style={{ fontSize: 20, color: "#B85C82", margin: "18px 0 8px" }}>{SLIDES[step - 1].title}</h2>
          <p style={{ fontSize: 13.5, color: "#6A5A66", lineHeight: 1.8, whiteSpace: "pre-line", margin: 0 }}>{SLIDES[step - 1].body}</p>
          <button className="btn-rose" onClick={next} style={{ marginTop: 22 }}>{step < SLIDES.length ? "다음 →" : "시작하기 ♥"}</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 7, marginTop: 24 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 4, background: i === step ? "var(--rose)" : "#E0D0DC", transition: "all .3s" }} />
        ))}
      </div>
      {step > 0 && (
        <button onClick={() => router.push("/map")} style={{ background: "none", border: "none", fontSize: 12, color: "#A89AA3", marginTop: 14, textDecoration: "underline" }}>건너뛰기</button>
      )}
    </main>
  );
}
