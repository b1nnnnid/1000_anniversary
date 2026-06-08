"use client";

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

interface Props {
  stage: Stage;
  onClose: () => void;
  onMemory: () => void; // 옛 추억 다시 보기
}

// 상봉 후: 데이트 장소에 입장한 둘의 장면
export default function DateModal({ stage, onClose, onMemory }: Props) {
  const place = stage.place!;
  const t = THEME[place.kind] ?? THEME.park;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 60, background: "rgba(90,74,85,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="pop pixel-border"
        style={{ background: "var(--cream)", borderRadius: 16, maxWidth: 320, width: "100%", overflow: "hidden", textAlign: "center" }}>
        <div style={{ background: t.bg, padding: "14px 12px 6px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px", fontSize: 22 }}>
            {t.deco.map((d, i) => (
              <span key={i} className="floaty" style={{ animationDelay: `${i * 0.4}s` }}>{d}</span>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CharacterReaction mood="happy" who="boy" size={96} />
            <CharacterReaction mood="happy" who="girl" size={96} />
          </div>
        </div>
        <div style={{ padding: "12px 16px 16px" }}>
          <p style={{ margin: 0, fontSize: 11, color: "#9A8A95" }}>💑 데이트 중</p>
          <h2 style={{ fontSize: 17, color: "#B85C82", margin: "4px 0 8px" }}>{place.name}</h2>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "#6A5A66", margin: "0 0 14px" }}>{place.desc}</p>
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
