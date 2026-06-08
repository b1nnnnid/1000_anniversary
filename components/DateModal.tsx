"use client";

import DateScene from "@/components/DateScene";
import { Stage } from "@/lib/gameData";

const THEME: Record<string, string[]> = {
  park: ["🌳", "🌸", "🍦"], cinema: ["🎬", "🍿", "🥤"], cafe: ["☕", "🍪", "🧁"],
  restaurant: ["🍝", "🥟", "🍻"], beach: ["🌊", "⛱️", "🐚"], amusement: ["🎡", "🎠", "🎈"],
};
const TIP: Record<string, string> = {
  park: "그네를 타는 둘 — 화면을 톡 누르면 하트가 퐁퐁!",
  cinema: "영화 보는 둘 — 화면을 누르면 하트가 퐁퐁!",
  cafe: "커피 마시는 둘 — 화면을 누르면 하트가 퐁퐁!",
  restaurant: "건배하는 둘 — 화면을 누르면 하트가 퐁퐁!",
  beach: "파라솔 아래 둘 — 화면을 누르면 하트가 퐁퐁!",
  amusement: "관람차 타는 둘 — 화면을 누르면 하트가 퐁퐁!",
};

interface Props { stage: Stage; onClose: () => void; onMemory: () => void; }

export default function DateModal({ stage, onClose, onMemory }: Props) {
  const place = stage.place!;
  const deco = THEME[place.kind] ?? THEME.park;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 60, background: "rgba(90,74,85,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 14,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="pop pixel-border"
        style={{ background: "var(--cream)", borderRadius: 16, maxWidth: 340, width: "100%", overflow: "hidden", textAlign: "center" }}>
        <div style={{ background: "var(--blush)", padding: "8px 14px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#B85C82" }}>💑 데이트 중</span>
          <span style={{ fontSize: 16 }}>{deco.map((d, i) => <span key={i} style={{ marginLeft: 3 }}>{d}</span>)}</span>
        </div>

        <DateScene kind={place.kind} />

        <div style={{ padding: "10px 16px 16px" }}>
          <h2 style={{ fontSize: 17, color: "#B85C82", margin: "0 0 4px" }}>{place.name}</h2>
          <p style={{ fontSize: 11.5, color: "#A89AA3", margin: "0 0 8px" }}>{TIP[place.kind]}</p>
          <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "#6A5A66", margin: "0 0 12px" }}>{place.desc}</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={onMemory} style={{
              background: "#fff", color: "#B85C82", border: "2px solid var(--lav)",
              borderRadius: 12, padding: "10px 14px", fontSize: 12.5,
            }}>📷 그날의 추억</button>
            <button className="btn-rose" onClick={onClose} style={{ fontSize: 13, padding: "10px 18px" }}>좋았어 ♥</button>
          </div>
        </div>
      </div>
    </div>
  );
}
