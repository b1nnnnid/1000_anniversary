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
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={spot.photo} alt={spot.title} style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }} />
            {spot.past && (
              <div className="floaty" style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "flex-start", gap: 5, maxWidth: 168 }}>
                <span style={{ fontSize: 22, opacity: 0.85, filter: "saturate(0.85)" }}>👫</span>
                <div style={{
                  background: "rgba(255,255,255,0.93)", border: "1.5px solid #E2B2CB", borderRadius: 10,
                  padding: "6px 9px", fontSize: 11, color: "#7A5A6C", lineHeight: 1.5,
                  boxShadow: "0 2px 0 rgba(124,90,150,0.15)",
                }}>
                  <b style={{ color: "#B85C82" }}>과거의 우리</b><br />{spot.past}
                </div>
              </div>
            )}
          </div>
        )}
        <p style={{ padding: "12px 16px", fontSize: 13, lineHeight: 1.7, color: "#6A5A66", margin: 0 }}>{spot.text}</p>
        <div style={{ padding: "0 16px 16px", textAlign: "center" }}>
          <button className="btn-rose" onClick={onClose} style={{ fontSize: 14, padding: "10px 24px" }}>닫기 ♥</button>
        </div>
      </div>
    </div>
  );
}
