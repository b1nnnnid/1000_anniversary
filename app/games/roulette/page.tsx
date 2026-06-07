"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { WISHES } from "@/lib/gameData";

const SEG = 360 / WISHES.length;
const COLORS = ["#F4D6E6", "#E2D0FB", "#C7E8D2", "#FBE6A8", "#F8C9DC", "#BFE0F5"];

export default function RoulettePage() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const couponCanvas = useRef<HTMLCanvasElement>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const i = Math.floor(Math.random() * WISHES.length);
    const center = i * SEG + SEG / 2;
    const targetMod = ((360 - center) % 360 + 360) % 360;
    const base = rotation + 360 * 5;
    let F = base - (base % 360) + targetMod;
    if (F <= rotation + 360 * 4) F += 360;
    setRotation(F);
    setTimeout(() => {
      setSpinning(false);
      setResult(i);
      fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: WISHES[i].title, emoji: WISHES[i].emoji }),
      }).catch(() => {});
    }, 4200);
  };

  const download = () => {
    if (result === null) return;
    const c = couponCanvas.current!;
    const ctx = c.getContext("2d")!;
    const W = 640, H = 360;
    c.width = W; c.height = H;
    // 배경
    ctx.fillStyle = "#FBF3F8"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#F4D6E6"; ctx.fillRect(0, 0, W, 70);
    // 점선 테두리
    ctx.strokeStyle = "#E8799F"; ctx.lineWidth = 4;
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.setLineDash([]);
    // 텍스트
    ctx.textAlign = "center";
    ctx.fillStyle = "#B85C82";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("우리의 1000일 ♥ 소원권", W / 2, 48);
    ctx.font = "90px sans-serif";
    ctx.fillText(WISHES[result].emoji, W / 2, 185);
    ctx.fillStyle = "#5A4A55";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText(WISHES[result].title, W / 2, 250);
    ctx.fillStyle = "#9A8A95";
    ctx.font = "18px sans-serif";
    ctx.fillText("이 쿠폰을 보여주면 들어드립니다 · " + new Date().toLocaleDateString("ko-KR"), W / 2, 300);

    const link = document.createElement("a");
    link.download = `소원권_${WISHES[result].title}.png`;
    link.href = c.toDataURL("image/png");
    link.click();
  };

  const gradient = WISHES.map((_, i) =>
    `${COLORS[i % COLORS.length]} ${i * SEG}deg ${(i + 1) * SEG}deg`
  ).join(", ");

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px", minHeight: "100vh", textAlign: "center" }}>
      <Link href="/map" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none", display: "block", textAlign: "left" }}>← 맵으로</Link>
      <h1 style={{ fontSize: 19, color: "#B85C82", margin: "10px 0 6px" }}>소원권 룰렛 🎁</h1>
      <p style={{ fontSize: 13, color: "#9A8A95", marginBottom: 18 }}>돌려서 소원권을 뽑고 이미지로 저장하세요</p>

      <div style={{ position: "relative", width: 280, height: 280, margin: "0 auto" }}>
        {/* 포인터 */}
        <div style={{
          position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent",
          borderTop: "20px solid #E8799F", zIndex: 5,
        }} />
        <div style={{
          width: 280, height: 280, borderRadius: "50%",
          background: `conic-gradient(${gradient})`,
          border: "8px solid #fff", boxShadow: "0 0 0 4px var(--lav)",
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? "transform 4s cubic-bezier(0.17,0.67,0.2,1)" : "none",
          position: "relative",
        }}>
          {WISHES.map((w, i) => {
            const a = (i * SEG + SEG / 2) * (Math.PI / 180);
            const rad = 95;
            const cx = 140 + rad * Math.sin(a);
            const cy = 140 - rad * Math.cos(a);
            return (
              <span key={i} style={{
                position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)",
                fontSize: 28,
              }}>{w.emoji}</span>
            );
          })}
        </div>
        {/* 가운데 버튼 */}
        <button onClick={spin} disabled={spinning} style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 64, height: 64, borderRadius: "50%", border: "4px solid #fff",
          background: spinning ? "#D9CBE8" : "var(--rose)", color: "#fff", fontSize: 13,
          boxShadow: "0 3px 0 rgba(124,90,150,0.3)", zIndex: 6,
        }}>{spinning ? "..." : "돌리기"}</button>
      </div>

      {result !== null && (
        <div className="pixel-border pop" style={{ background: "var(--cream)", borderRadius: 14, padding: 20, marginTop: 22 }}>
          <p style={{ fontSize: 44, margin: "2px 0" }}>{WISHES[result].emoji}</p>
          <p style={{ fontSize: 17, color: "#B85C82", margin: "4px 0 2px" }}>{WISHES[result].title}</p>
          <p style={{ fontSize: 13, color: "#9A8A95", marginBottom: 14 }}>당첨! 이미지로 저장해서 간직하세요</p>
          <button onClick={download} style={{
            background: "var(--rose)", color: "#fff", border: "none", borderRadius: 10,
            padding: "11px 22px", fontSize: 14, boxShadow: "0 3px 0 rgba(124,90,150,0.3)",
          }}>📥 쿠폰 이미지 저장</button>
        </div>
      )}

      <canvas ref={couponCanvas} style={{ display: "none" }} />
    </main>
  );
}
