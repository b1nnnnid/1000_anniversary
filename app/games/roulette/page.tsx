"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WISHES } from "@/lib/gameData";
import GameIntro from "@/components/GameIntro";
import { getProgress, changeTickets } from "@/lib/progressClient";

const SEG = 360 / WISHES.length;
const COLORS = ["#F4D6E6", "#E2D0FB", "#C7E8D2", "#FBE6A8", "#F8C9DC", "#BFE0F5"];

export default function RoulettePage() {
  const [phase, setPhase] = useState<"intro" | "wheel">("intro");
  const [tickets, setTickets] = useState<number | null>(null); // null = 로딩중
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const couponCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    getProgress().then((p) => setTickets(p.tickets));
  }, []);

  const spin = () => {
    if (spinning || !tickets || tickets < 1) return;
    setSpinning(true);
    setResult(null);
    setTickets((t) => (t ?? 1) - 1);
    changeTickets(-1).catch(() => {});

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
    ctx.fillStyle = "#FBF3F8"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#F4D6E6"; ctx.fillRect(0, 0, W, 70);
    ctx.strokeStyle = "#E8799F"; ctx.lineWidth = 4;
    ctx.setLineDash([12, 8]); ctx.strokeRect(20, 20, W - 40, H - 40); ctx.setLineDash([]);
    ctx.textAlign = "center";
    ctx.fillStyle = "#B85C82"; ctx.font = "bold 26px Galmuri11, sans-serif";
    ctx.fillText("우리의 1000일 ♥ 소원권", W / 2, 48);
    ctx.font = "90px sans-serif"; ctx.fillText(WISHES[result].emoji, W / 2, 185);
    ctx.fillStyle = "#5A4A55"; ctx.font = "bold 34px Galmuri11, sans-serif";
    ctx.fillText(WISHES[result].title, W / 2, 250);
    ctx.fillStyle = "#9A8A95"; ctx.font = "18px Galmuri11, sans-serif";
    ctx.fillText("이 쿠폰을 보여주면 들어드립니다 · " + new Date().toLocaleDateString("ko-KR"), W / 2, 300);
    const link = document.createElement("a");
    link.download = `소원권_${WISHES[result].title}.png`;
    link.href = c.toDataURL("image/png");
    link.click();
  };

  const gradient = WISHES.map((_, i) => `${COLORS[i % COLORS.length]} ${i * SEG}deg ${(i + 1) * SEG}deg`).join(", ");
  const noTicket = tickets !== null && tickets < 1;

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px", minHeight: "100dvh", textAlign: "center" }}>
      {phase === "intro" && (
        <GameIntro
          emoji="🎁"
          title="소원권 룰렛"
          desc={"퀴즈에서 얻은 기회로 룰렛을 돌리고\n당첨된 소원권을 이미지로 간직해요."}
          rules={[
            "룰렛 1회 = 기회 🎟 1장",
            "기회는 커플 퀴즈에서 얻을 수 있어요",
            `지금 보유한 기회: 🎟 ${tickets === null ? "..." : tickets}장`,
          ]}
          startLabel={noTicket ? "기회가 없어요" : "룰렛 돌리러 가기 →"}
          onStart={() => setPhase("wheel")}
          disabled={tickets === null || noTicket}
          hint={noTicket && (
            <Link href="/games/quiz" style={{ fontSize: 13, color: "#B85C82", textDecoration: "underline" }}>
              💭 퀴즈 풀고 기회 얻으러 가기
            </Link>
          )}
        />
      )}

      {phase === "wheel" && (
        <div className="slideup">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/map" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 맵으로</Link>
            <span className="chip">🎟 {tickets ?? "..."}</span>
          </div>
          <h1 style={{ fontSize: 19, color: "#B85C82", margin: "12px 0 18px" }}>소원권 룰렛 🎁</h1>

          <div style={{ position: "relative", width: 280, height: 280, margin: "0 auto" }}>
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
                const cx = 140 + 95 * Math.sin(a);
                const cy = 140 - 95 * Math.cos(a);
                return (
                  <span key={i} style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", fontSize: 28 }}>
                    {w.emoji}
                  </span>
                );
              })}
            </div>
            <button onClick={spin} disabled={spinning || !tickets} style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 66, height: 66, borderRadius: "50%", border: "4px solid #fff",
              background: spinning || !tickets ? "#D9CBE8" : "var(--rose)", color: "#fff", fontSize: 12,
              boxShadow: "0 3px 0 rgba(124,90,150,0.3)", zIndex: 6,
            }}>{spinning ? "두근두근" : "돌리기"}</button>
          </div>

          {!spinning && result === null && noTicket && (
            <p style={{ fontSize: 13, color: "#8A7A85", marginTop: 18 }}>
              기회를 다 썼어요 ·{" "}
              <Link href="/games/quiz" style={{ color: "#B85C82" }}>퀴즈 풀고 더 얻기</Link>
            </p>
          )}

          {result !== null && (
            <div className="pixel-border pop" style={{ background: "var(--cream)", borderRadius: 16, padding: 20, marginTop: 22 }}>
              <p style={{ fontSize: 44, margin: "2px 0" }}>{WISHES[result].emoji}</p>
              <p style={{ fontSize: 17, color: "#B85C82", margin: "4px 0 2px" }}>{WISHES[result].title}</p>
              <p style={{ fontSize: 12.5, color: "#9A8A95", marginBottom: 14 }}>당첨! 이미지로 저장해서 간직하세요</p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-rose" onClick={download} style={{ fontSize: 13, padding: "11px 18px" }}>
                  📥 쿠폰 이미지 저장
                </button>
                {tickets !== null && tickets > 0 && (
                  <button onClick={spin} style={{
                    background: "#fff", color: "#B85C82", border: "2px solid var(--lav)",
                    borderRadius: 12, padding: "11px 18px", fontSize: 13,
                  }}>한 번 더! (🎟 {tickets})</button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <canvas ref={couponCanvas} style={{ display: "none" }} />
    </main>
  );
}
