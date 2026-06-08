"use client";

import CharacterReaction from "@/components/CharacterReaction";

export default function Celebration({ onClose }: { onClose: () => void }) {
  const confetti = ["🎉", "💗", "✨", "🌸", "⭐", "💕"];
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 80, background: "rgba(90,74,85,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflow: "hidden",
    }}>
      {[...Array(16)].map((_, i) => (
        <span key={i} style={{
          position: "absolute", top: `${(i * 37) % 100}%`, left: `${(i * 53) % 100}%`,
          fontSize: 22 + (i % 3) * 8, animation: `floaty ${1.4 + (i % 4) * 0.3}s ease-in-out infinite`,
        }}>{confetti[i % confetti.length]}</span>
      ))}
      <div className="pop pixel-border" style={{
        background: "var(--cream)", borderRadius: 16, padding: "24px 20px",
        textAlign: "center", maxWidth: 320, position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 0 }}>
          <CharacterReaction mood="happy" who="boy" size={104} />
          <CharacterReaction mood="happy" who="girl" size={104} />
        </div>
        <h2 style={{ fontSize: 18, color: "#B85C82", margin: "6px 0" }}>드디어 만났다! 1000일 축하해 ♥</h2>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#6A5A66", margin: "0 0 14px" }}>
          모든 추억을 모아 여기까지 와줬구나.<br />
          이제부터는 <b style={{ color: "#B85C82" }}>손잡고 같이 걷자!</b><br />
          (세상이 분홍빛으로 변했어요 🌸)
        </p>
        <button className="btn-rose" onClick={onClose} style={{ fontSize: 14, padding: "11px 24px" }}>
          좋아, 같이 가자 ♥
        </button>
      </div>
    </div>
  );
}
