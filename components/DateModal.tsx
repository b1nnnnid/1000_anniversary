"use client";

import { useEffect, useState } from "react";
import CharacterReaction from "@/components/CharacterReaction";
import { Stage } from "@/lib/gameData";

const THEME: Record<string, { bg: string; deco: string[] }> = {
  park:       { bg: "#E2F2E6", deco: ["🌳", "🌸", "🍦"] },
  cinema:     { bg: "#E9E3F6", deco: ["🎬", "🍿", "🥤"] },
  cafe:       { bg: "#F7EBDD", deco: ["☕", "🍪", "🧁"] },
  restaurant: { bg: "#FBE9E0", deco: ["🍝", "🥟", "🍻"] },
  beach:      { bg: "#E2F1FB", deco: ["🌊", "⛱️", "🐚"] },
  amusement:  { bg: "#FBE8F2", deco: ["🎡", "🎠", "🎈"] },
};

const btnStyle: React.CSSProperties = {
  background: "none", border: "none", padding: 0, cursor: "pointer", lineHeight: 1,
};

// ── 장소별 미니 액티비티 ──────────────────────────────

function CafeActivity() {
  const [fill, setFill] = useState(0); // 0~3
  const done = fill >= 3;
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "#8A7A85", margin: "0 0 6px" }}>
        {done ? "🎨 하트 라떼아트 완성! 마시기 아깝다" : "컵을 탭해서 라떼 채우기"}
      </p>
      <button onClick={() => !done && setFill(fill + 1)} style={btnStyle} aria-label="라떼 채우기">
        <div className={done ? "pop" : ""} style={{
          width: 64, height: 56, margin: "0 auto", borderRadius: "0 0 18px 18px",
          border: "4px solid #9C7A5A", borderTop: "4px solid #9C7A5A",
          position: "relative", overflow: "hidden", background: "#FFF8EE",
        }}>
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0,
            height: `${fill * 33}%`, background: "#C89A6B", transition: "height .35s ease",
          }} />
          {done && <span style={{ position: "absolute", left: "50%", top: "46%", transform: "translate(-50%,-50%)", fontSize: 22 }}>💗</span>}
        </div>
      </button>
      <p style={{ fontSize: 18, margin: "6px 0 0", visibility: fill > 0 && !done ? "visible" : "hidden" }}>☁️</p>
    </div>
  );
}

function CinemaActivity() {
  const FRAMES = ["🌅", "🚶‍♂️🚶‍♀️", "💑", "💗", "🎆"];
  const [frame, setFrame] = useState(-1);
  useEffect(() => {
    if (frame < 0 || frame >= FRAMES.length - 1) return;
    const t = setTimeout(() => setFrame(frame + 1), 700);
    return () => clearTimeout(t);
  }, [frame, FRAMES.length]);
  const playing = frame >= 0 && frame < FRAMES.length - 1;
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "#8A7A85", margin: "0 0 6px" }}>
        {frame === FRAMES.length - 1 ? "🎬 우리 이야기, 메인 상영작" : "스크린을 탭해서 상영 시작"}
      </p>
      <button onClick={() => !playing && setFrame(0)} style={{ ...btnStyle, width: "100%" }} aria-label="상영">
        <div style={{
          width: 150, height: 72, margin: "0 auto", background: "#2E2B33",
          borderRadius: 8, border: "4px solid #F2C76B",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
        }}>
          <span key={frame} className="pop">{frame < 0 ? "▶" : FRAMES[frame]}</span>
        </div>
      </button>
    </div>
  );
}

function RestaurantActivity() {
  const [cheers, setCheers] = useState(0);
  const [shake, setShake] = useState(false);
  const clink = () => {
    setCheers(cheers + 1); setShake(true);
    setTimeout(() => setShake(false), 350);
  };
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "#8A7A85", margin: "0 0 6px" }}>
        {cheers >= 3 ? "오늘도 맛있게 먹자! 🥂" : "잔을 탭해서 건배하기"}
      </p>
      <button onClick={clink} style={btnStyle} aria-label="건배">
        <span style={{
          fontSize: 44, display: "inline-block",
          transform: shake ? "rotate(-12deg) scale(1.15)" : "none", transition: "transform .15s",
        }}>🍻</span>
      </button>
      <p className={shake ? "pop" : ""} style={{ fontSize: 14, color: "#B85C82", margin: "4px 0 0", minHeight: 20 }}>
        {cheers > 0 ? `짠! × ${cheers}` : ""}
      </p>
    </div>
  );
}

function ParkActivity() {
  const STAGES_IC = ["🍦", "🍦", "🍦", "🥲"];
  const [bite, setBite] = useState(0);
  const done = bite >= 3;
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "#8A7A85", margin: "0 0 6px" }}>
        {done ? "다 먹었다... 한 입만 더?" : "아이스크림 나눠 먹기 (탭!)"}
      </p>
      <button onClick={() => (done ? setBite(0) : setBite(bite + 1))} style={btnStyle} aria-label="아이스크림">
        <span key={bite} className="pop" style={{ fontSize: 44, display: "inline-block", transform: `scale(${1 - bite * 0.13})` }}>
          {STAGES_IC[bite]}
        </span>
      </button>
      <p style={{ fontSize: 12, color: "#B85C82", margin: "4px 0 0", minHeight: 18 }}>
        {done ? "(탭하면 새 아이스크림)" : bite > 0 ? "냠.." + "냠".repeat(bite) : ""}
      </p>
    </div>
  );
}

function BeachActivity() {
  const SPOTS = [{ l: 14, t: 58 }, { l: 48, t: 70 }, { l: 76, t: 52 }];
  const [found, setFound] = useState<number[]>([]);
  const done = found.length === 3;
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "#8A7A85", margin: "0 0 6px" }}>
        {done ? "조개 3개 수집! 귀에 대 보자 🐚" : `모래 속 조개를 찾아줘 (${found.length}/3)`}
      </p>
      <div style={{
        position: "relative", width: "100%", maxWidth: 220, height: 90, margin: "0 auto",
        background: "linear-gradient(#9FC7E8 0 38%, #FBE6C8 38% 100%)", borderRadius: 10, overflow: "hidden",
      }}>
        <span style={{ position: "absolute", left: 6, top: 4, fontSize: 13 }}>🌊</span>
        {SPOTS.map((sp, i) => (
          <button key={i} onClick={() => !found.includes(i) && setFound([...found, i])}
            aria-label={`조개 ${i + 1}`}
            style={{
              ...btnStyle, position: "absolute", left: `${sp.l}%`, top: `${sp.t}%`,
              fontSize: found.includes(i) ? 22 : 13, opacity: found.includes(i) ? 1 : 0.55,
              transform: "translate(-50%,-50%)",
            }}>🐚</button>
        ))}
        {done && <span className="pop" style={{ position: "absolute", left: "50%", top: "30%", transform: "translateX(-50%)", fontSize: 20 }}>✨</span>}
      </div>
    </div>
  );
}

function AmusementActivity() {
  const [deg, setDeg] = useState(0);
  const done = deg >= 360;
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "#8A7A85", margin: "0 0 6px" }}>
        {done ? "한 바퀴 완주! 꼭대기에서 소원 빌었다 🎆" : "관람차를 탭해서 한 바퀴 돌기"}
      </p>
      <button onClick={() => !done && setDeg(deg + 60)} style={btnStyle} aria-label="관람차">
        <span style={{
          fontSize: 52, display: "inline-block",
          transform: `rotate(${deg}deg)`, transition: "transform .45s cubic-bezier(.3,1.3,.5,1)",
        }}>🎡</span>
      </button>
      <p className={done ? "pop" : ""} style={{ fontSize: 16, margin: "4px 0 0", minHeight: 22 }}>
        {done ? "🎆✨🎇" : `${Math.round((deg / 360) * 100)}%`}
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────────────

interface Props {
  stage: Stage;
  onClose: () => void;
  onMemory: () => void;
}

export default function DateModal({ stage, onClose, onMemory }: Props) {
  const place = stage.place!;
  const t = THEME[place.kind] ?? THEME.park;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 60, background: "rgba(90,74,85,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 14,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="pop pixel-border"
        style={{ background: "var(--cream)", borderRadius: 16, maxWidth: 330, width: "100%", overflow: "hidden", textAlign: "center" }}>
        <div style={{ background: t.bg, padding: "10px 12px 2px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px", fontSize: 19 }}>
            {t.deco.map((d, i) => (
              <span key={i} className="floaty" style={{ animationDelay: `${i * 0.4}s` }}>{d}</span>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CharacterReaction mood="happy" who="boy" size={80} />
            <CharacterReaction mood="happy" who="girl" size={80} />
          </div>
        </div>

        <div style={{ padding: "10px 16px 16px" }}>
          <p style={{ margin: 0, fontSize: 11, color: "#9A8A95" }}>💑 데이트 중</p>
          <h2 style={{ fontSize: 17, color: "#B85C82", margin: "2px 0 10px" }}>{place.name}</h2>

          <div style={{ background: "#fff", borderRadius: 12, padding: "12px 10px", marginBottom: 10, boxShadow: "0 2px 0 rgba(124,90,150,0.12)" }}>
            {place.kind === "cafe" && <CafeActivity />}
            {place.kind === "cinema" && <CinemaActivity />}
            {place.kind === "restaurant" && <RestaurantActivity />}
            {place.kind === "park" && <ParkActivity />}
            {place.kind === "beach" && <BeachActivity />}
            {place.kind === "amusement" && <AmusementActivity />}
          </div>

          <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "#6A5A66", margin: "0 0 12px" }}>{place.desc}</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={onMemory} style={{
              background: "#fff", color: "#B85C82", border: "2px solid var(--lav)",
              borderRadius: 12, padding: "10px 14px", fontSize: 12.5,
            }}>📷 그날의 추억</button>
            <button className="btn-rose" onClick={onClose} style={{ fontSize: 13, padding: "10px 18px" }}>
              좋았어 ♥
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
