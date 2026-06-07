"use client";

import { Stage } from "@/lib/gameData";

export default function MemoryModal({ spot, onClose }: { spot: Stage; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 60, background: "rgba(90,74,85,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="pop pixel-border"
        style={{ background: "var(--cream)", borderRadius: 16, maxWidth: 320, width: "100%", overflow: "hidden" }}>
        <div style={{ background: "var(--blush)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ color: "#B85C82", fontSize: 15 }}>{spot.title}</strong>
          {spot.date && <span style={{ fontSize: 11, color: "#B85C82" }}>{spot.date}</span>}
        </div>
        {spot.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={spot.photo} alt={spot.title} style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }} />
        )}
        <p style={{ padding: "12px 16px", fontSize: 13, lineHeight: 1.7, color: "#6A5A66", margin: 0 }}>{spot.text}</p>
        <div style={{ padding: "0 16px 16px", textAlign: "center" }}>
          <button className="btn-rose" onClick={onClose} style={{ fontSize: 14, padding: "10px 24px" }}>닫기 ♥</button>
        </div>
      </div>
    </div>
  );
}
