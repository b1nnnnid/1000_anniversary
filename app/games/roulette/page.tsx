"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WISHES } from "@/lib/gameData";
import GameIntro from "@/components/GameIntro";
import CharacterReaction from "@/components/CharacterReaction";
import { getProgress, changeTickets } from "@/lib/progressClient";

const TOTAL = WISHES.reduce((s, w) => s + w.weight, 0);
// 각 칸의 시작 각도/크기 (꼭대기 0°, 시계방향)
const SEGS = (() => {
  let acc = 0;
  return WISHES.map((w) => {
    const seg = { start: acc, sweep: (w.weight / TOTAL) * 360 };
    acc += seg.sweep;
    return seg;
  });
})();
const KIND_COLOR: Record<string, string> = { rare: "#FBE6A8", mid: "#C7E8D2", fun: "#E2D0FB", miss: "#F8C9D4" };
const KIND_BADGE: Record<string, string> = { rare: "✨ 희귀", mid: "보통", fun: "웃김 주의", miss: "꽝" };
const GARLAND = ["#E8799F", "#F2C76B", "#9FC7E8", "#C9A7F0", "#8FC9A0", "#F2A3C0", "#E8799F", "#F2C76B", "#9FC7E8"];
const SPIN_MS = 7000;

interface RecentCoupon { id: number; title: string; emoji: string; }

export default function RoulettePage() {
  const [phase, setPhase] = useState<"intro" | "wheel">("intro");
  const [tickets, setTickets] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [recent, setRecent] = useState<RecentCoupon[]>([]);
  const wheelRef = useRef<HTMLCanvasElement>(null);
  const couponCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => { getProgress().then((p) => setTickets(p.tickets)); }, []);

  const loadRecent = useCallback(() => {
    fetch("/api/coupons").then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setRecent(d.slice(0, 3)); })
      .catch(() => {});
  }, []);
  useEffect(loadRecent, [loadRecent]);

  // 룰렛 판 그리기 (가중치만큼 칸 크기 다르게)
  useEffect(() => {
    if (phase !== "wheel") return;
    const cv = wheelRef.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const R = 140;
    ctx.clearRect(0, 0, 280, 280);
    WISHES.forEach((w, i) => {
      const a0 = (SEGS[i].start - 90) * (Math.PI / 180);
      const a1 = (SEGS[i].start + SEGS[i].sweep - 90) * (Math.PI / 180);
      ctx.beginPath(); ctx.moveTo(R, R); ctx.arc(R, R, R - 2, a0, a1); ctx.closePath();
      ctx.fillStyle = KIND_COLOR[w.kind]; ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke();
      const mid = (SEGS[i].start + SEGS[i].sweep / 2 - 90) * (Math.PI / 180);
      const er = w.weight === 1 ? 108 : 90;
      ctx.font = `${w.weight === 1 ? 16 : 26}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(w.emoji, R + Math.cos(mid) * er, R + Math.sin(mid) * er);
    });
  }, [phase]);

  const spin = () => {
    if (spinning || !tickets || tickets < 1) return;
    setSpinning(true);
    setResult(null);
    setTickets((t) => (t ?? 1) - 1);
    changeTickets(-1).catch(() => {});

    // 칸 크기(가중치)에 비례한 추첨
    let rnd = Math.random() * TOTAL, i = 0;
    for (let k = 0; k < WISHES.length; k++) { rnd -= WISHES[k].weight; if (rnd <= 0) { i = k; break; } }
    // 칸 한가운데가 아니라 가장자리 근처에도 멈추게 → 아슬아슬
    const jitter = (Math.random() - 0.5) * SEGS[i].sweep * 0.72;
    const center = SEGS[i].start + SEGS[i].sweep / 2 + jitter;
    const targetMod = ((360 - center) % 360 + 360) % 360;
    const base = rotation + 360 * 7;
    let F = base - (base % 360) + targetMod;
    if (F <= rotation + 360 * 6) F += 360;
    setRotation(F);

    setTimeout(() => {
      setSpinning(false);
      setResult(i);
      if (WISHES[i].kind !== "miss") {
        fetch("/api/coupons", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: WISHES[i].title, emoji: WISHES[i].emoji }),
        }).then(loadRecent).catch(() => {});
      }
    }, SPIN_MS + 300);
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

  const noTicket = tickets !== null && tickets < 1;
  const mood = spinning ? "excited" : result === null ? "excited" : WISHES[result].kind === "miss" ? "sad" : "happy";
  const bubble = spinning ? "두근두근두근..." : result === null ? "어떤 게 나올까?" : WISHES[result].kind === "miss" ? "꽝이라니... 😭" : "꺄! 당첨이야!";

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh", textAlign: "center" }}>
      {phase === "intro" && (
        <GameIntro
          emoji="🎁"
          title="소원권 룰렛"
          desc={"퀴즈에서 얻은 기회로 룰렛을 돌려요.\n좁은 칸일수록 좋은 게 들어있다는 소문이..."}
          rules={[
            "룰렛 1회 = 기회 🎟 1장",
            "✨ 좁은 칸 = 진짜 좋은 소원권",
            "넓은 칸 = 웃긴 벌칙 (각오해)",
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

          {/* 가랜드 장식 */}
          <div style={{ display: "flex", justifyContent: "center", gap: 7, margin: "14px 0 4px" }}>
            {GARLAND.map((c, i) => (
              <div key={i} style={{
                width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent",
                borderTop: `15px solid ${c}`, transform: `translateY(${i % 2 === 0 ? 0 : 4}px)`,
              }} />
            ))}
          </div>
          <h1 style={{ fontSize: 19, color: "#B85C82", margin: "4px 0 16px" }}>소원권 룰렛 🎁</h1>

          <div style={{ position: "relative", width: 296, height: 296, margin: "0 auto" }}>
            <div style={{
              position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)",
              width: 0, height: 0, borderLeft: "13px solid transparent", borderRight: "13px solid transparent",
              borderTop: "22px solid #E8799F", zIndex: 5,
              filter: "drop-shadow(0 2px 0 rgba(124,90,150,0.3))",
            }} />
            <div style={{
              width: 296, height: 296, borderRadius: "50%", border: "8px solid #fff",
              boxShadow: "0 0 0 4px var(--lav), 0 6px 0 rgba(124,90,150,0.2)", overflow: "hidden",
            }}>
              <canvas ref={wheelRef} width={280} height={280} style={{
                width: 280, height: 280, display: "block",
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.1, 0.82, 0.18, 1.02)` : "none",
              }} />
            </div>
            <button onClick={spin} disabled={spinning || !tickets} style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 68, height: 68, borderRadius: "50%", border: "4px solid #fff",
              background: spinning || !tickets ? "#D9CBE8" : "var(--rose)", color: "#fff", fontSize: 12,
              boxShadow: "0 3px 0 rgba(124,90,150,0.3)", zIndex: 6,
            }}>{spinning ? "..." : "돌리기"}</button>
          </div>

          {/* 구경하는 캐릭터 */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 12 }}>
            <CharacterReaction mood={mood} size={86} />
            <div style={{
              background: "#fff", borderRadius: 12, padding: "8px 14px", fontSize: 13, color: "#6A5A66",
              boxShadow: "0 2px 0 rgba(124,90,150,0.15)", position: "relative",
            }}>{bubble}</div>
          </div>

          {result !== null && (
            <div className="pixel-border pop" style={{ background: "var(--cream)", borderRadius: 16, padding: 20, marginTop: 16 }}>
              <p style={{ fontSize: 44, margin: "2px 0" }}>{WISHES[result].emoji}</p>
              <p style={{ fontSize: 17, color: "#B85C82", margin: "4px 0 2px" }}>{WISHES[result].title}</p>
              {WISHES[result].kind === "miss" ? (
                <p style={{ fontSize: 12.5, color: "#9A8A95", marginBottom: 14 }}>아쉽지만 다음 기회에...</p>
              ) : (
                <p style={{ fontSize: 12.5, color: "#9A8A95", marginBottom: 14 }}>
                  {WISHES[result].kind === "rare" ? "✨ 희귀 소원권 당첨!" : "당첨!"} 이미지로 저장해서 간직하세요
                </p>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {WISHES[result].kind !== "miss" && (
                  <button className="btn-rose" onClick={download} style={{ fontSize: 13, padding: "11px 18px" }}>
                    📥 쿠폰 이미지 저장
                  </button>
                )}
                {tickets !== null && tickets > 0 && (
                  <button onClick={spin} style={{
                    background: "#fff", color: "#B85C82", border: "2px solid var(--lav)",
                    borderRadius: 12, padding: "11px 18px", fontSize: 13,
                  }}>한 번 더! (🎟 {tickets})</button>
                )}
              </div>
              {noTicket && (
                <p style={{ fontSize: 12, color: "#8A7A85", marginTop: 12, marginBottom: 0 }}>
                  기회를 다 썼어요 · <Link href="/games/quiz" style={{ color: "#B85C82" }}>퀴즈 풀고 더 얻기</Link>
                </p>
              )}
            </div>
          )}

          {/* 상품 목록 */}
          <div className="rule-card" style={{ marginTop: 18, textAlign: "left" }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#B85C82" }}>🎯 뭐가 들었나면...</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px 10px" }}>
              {WISHES.map((w, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#6A5A66" }}>
                  <span style={{ fontSize: 15 }}>{w.emoji}</span>
                  <span style={{ flex: 1, lineHeight: 1.3 }}>{w.title}</span>
                  <span style={{
                    fontSize: 9.5, padding: "2px 6px", borderRadius: 8, whiteSpace: "nowrap",
                    background: KIND_COLOR[w.kind], color: "#6A5A66",
                  }}>{KIND_BADGE[w.kind]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 뽑은 소원권 */}
          {recent.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <p style={{ fontSize: 11.5, color: "#9A8A95", margin: "0 0 6px" }}>최근 뽑은 소원권</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
                {recent.map((c) => (
                  <span key={c.id} className="chip">{c.emoji} {c.title}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <canvas ref={couponCanvas} style={{ display: "none" }} />
    </main>
  );
}
