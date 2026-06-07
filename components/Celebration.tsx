"use client";

export default function Celebration({ onClose }: { onClose: () => void }) {
  const confetti = ["🎉", "💗", "✨", "🎊", "⭐", "💕"];
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 80, background: "rgba(90,74,85,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflow: "hidden",
    }}>
      {[...Array(14)].map((_, i) => (
        <span key={i} style={{
          position: "absolute", top: `${(i * 37) % 100}%`, left: `${(i * 53) % 100}%`,
          fontSize: 22 + (i % 3) * 8, animation: `floaty ${1.6 + (i % 4) * 0.3}s ease-in-out infinite`,
        }}>{confetti[i % confetti.length]}</span>
      ))}
      <div onClick={(e) => e.stopPropagation()} className="pop pixel-border"
        style={{ background: "var(--cream)", borderRadius: 16, padding: "28px 22px", textAlign: "center", maxWidth: 300, position: "relative" }}>
        <p style={{ fontSize: 46, margin: 0 }}>💗</p>
        <h2 style={{ fontSize: 18, color: "#B85C82", margin: "8px 0" }}>1000일 축하해 ♥</h2>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#6A5A66" }}>
          모든 추억을 모았어요.<br />앞으로의 날들도 함께 걸어요.
        </p>
        <button className="btn-rose" onClick={onClose} style={{ marginTop: 12, fontSize: 14, padding: "11px 24px" }}>
          고마워 ♥
        </button>
      </div>
    </div>
  );
}
