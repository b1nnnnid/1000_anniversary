"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import PixelIcon from "@/components/PixelIcon";
import { getProgress } from "@/lib/progressClient";
import { isUnlocked, buyUnlock } from "@/lib/unlocks";

interface Props {
  unlockKey: string;
  title: string;
  iconName?: string;
  cost?: number;
  children: ReactNode;
  /** 티켓을 처음 사용해 열 때 보여줄 로딩 연출 시간(ms). 미설정 시 즉시 공개 */
  revealMs?: number;
  /** 로딩 중 번갈아 보여줄 문구들 */
  revealMessages?: string[];
}

function RevealScreen({ iconName, messages, durationMs }: { iconName: string; messages: string[]; durationMs: number }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (messages.length <= 1) return;
    const step = Math.max(700, Math.floor(durationMs / messages.length));
    const iv = setInterval(() => setIdx((i) => (i + 1) % messages.length), step);
    return () => clearInterval(iv);
  }, [messages.length, durationMs]);

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes rv-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes rv-glow { 0%,100% { opacity:.25; transform: scale(.85);} 50% { opacity:.7; transform: scale(1.15);} }
        @keyframes rv-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rv-twinkle { 0%,100% { opacity:.2; transform: scale(.6);} 50% { opacity:1; transform: scale(1.1);} }
        @keyframes rv-fade { 0% { opacity:0; transform: translateY(6px);} 12%,88% { opacity:1; transform:none;} 100% { opacity:0; transform: translateY(-6px);} }
        @keyframes rv-dot { 0%,80%,100% { opacity:.2; } 40% { opacity:1; } }
        @keyframes rv-bar { from { width: 0; } to { width: 100%; } }
        @media (prefers-reduced-motion: reduce){ .rv-anim { animation-duration: .001s !important; } }
      `}</style>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        {/* 배경 반짝이 */}
        <div style={{ position: "relative", width: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {["✦", "˖", "✧", "⋆", "✦", "·"].map((s, i) => (
            <span key={i} className="rv-anim" style={{
              position: "absolute", fontSize: 12 + (i % 3) * 6, color: "#D9A7C4",
              top: `${[6, 18, 70, 84, 40, 12][i]}%`, left: `${[14, 80, 8, 74, 92, 46][i]}%`,
              animation: `rv-twinkle ${1.4 + (i % 3) * 0.4}s ${i * 0.2}s ease-in-out infinite`,
            }}>{s}</span>
          ))}
          {/* 후광 */}
          <span className="rv-anim" style={{
            position: "absolute", width: 110, height: 110, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,121,159,.45), transparent 70%)",
            animation: "rv-glow 2s ease-in-out infinite",
          }} />
          {/* 공전하는 별 */}
          <span className="rv-anim" style={{ position: "absolute", width: 150, height: 150, animation: "rv-orbit 3.2s linear infinite" }}>
            <span style={{ position: "absolute", top: -2, left: "50%", marginLeft: -8, fontSize: 16 }}>⭐</span>
            <span style={{ position: "absolute", bottom: -2, left: "50%", marginLeft: -8, fontSize: 12 }}>✨</span>
          </span>
          {/* 중앙 아이콘 */}
          <span className="rv-anim" style={{ animation: "rv-bob 2.2s ease-in-out infinite" }}>
            <PixelIcon name={iconName} size={76} />
          </span>
        </div>

        {/* 문구 */}
        <p key={idx} className="rv-anim" style={{
          marginTop: 26, fontSize: 15, color: "#B85C82", minHeight: 22,
          animation: `rv-fade ${Math.max(700, Math.floor(durationMs / Math.max(1, messages.length)))}ms ease-in-out`,
        }}>
          {messages[idx]}
          <span className="rv-anim" style={{ animation: "rv-dot 1.2s 0s infinite" }}>.</span>
          <span className="rv-anim" style={{ animation: "rv-dot 1.2s .2s infinite" }}>.</span>
          <span className="rv-anim" style={{ animation: "rv-dot 1.2s .4s infinite" }}>.</span>
        </p>

        {/* 진행 막대 */}
        <div style={{ width: 180, height: 6, background: "#EAD9E4", borderRadius: 4, overflow: "hidden", marginTop: 16 }}>
          <div className="rv-anim" style={{
            height: "100%", borderRadius: 4,
            background: "linear-gradient(90deg, var(--rose), var(--lav))",
            animation: `rv-bar ${durationMs}ms linear forwards`,
          }} />
        </div>
      </div>
    </main>
  );
}

// 티켓을 내고 한 번 열면 이후로는 계속 볼 수 있는 잠금 게이트
export default function TicketGate({ unlockKey, title, iconName = "crystal", cost = 1, children, revealMs, revealMessages }: Props) {
  const [state, setState] = useState<"loading" | "locked" | "revealing" | "open">("loading");
  const [tickets, setTickets] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isUnlocked(unlockKey)) { setState("open"); return; }
    getProgress().then((p) => { setTickets(p.tickets); setState(isUnlocked(unlockKey) ? "open" : "locked"); });
  }, [unlockKey]);

  const open = async () => {
    if (busy || tickets < cost) return;
    setBusy(true);
    const left = await buyUnlock(unlockKey, cost);
    setTickets(left);
    if (revealMs && revealMessages && revealMessages.length > 0) {
      setState("revealing");
      setTimeout(() => setState("open"), revealMs);
    } else {
      setState("open");
    }
    setBusy(false);
  };

  if (state === "loading") return null;
  if (state === "revealing") return <RevealScreen iconName={iconName} messages={revealMessages!} durationMs={revealMs!} />;
  if (state === "open") return <>{children}</>;

  const enough = tickets >= cost;
  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div className="floaty" style={{ position: "relative" }}>
          <PixelIcon name={iconName} size={72} />
          <span style={{ position: "absolute", right: -8, bottom: -4 }}><PixelIcon name="lock" size={28} /></span>
        </div>
        <h1 style={{ fontSize: 19, color: "#B85C82", margin: "18px 0 6px" }}>{title}</h1>
        <p style={{ fontSize: 13, color: "#8A7A85", lineHeight: 1.7, margin: "0 0 20px" }}>
          이 콘텐츠는 <b style={{ color: "#B85C82" }}>티켓 {cost}장</b>으로 열 수 있어요.<br />
          한 번 열면 계속 볼 수 있어요.
        </p>
        <p className="chip" style={{ marginBottom: 16 }}><PixelIcon name="ticket" size={14} /> 보유 티켓 {tickets}장</p>
        {enough ? (
          <button className="btn-rose" onClick={open} disabled={busy} style={{ fontSize: 15 }}>
            티켓 {cost}장으로 열기
          </button>
        ) : (
          <>
            <button className="btn-rose" disabled style={{ fontSize: 15, opacity: 0.5 }}>티켓이 부족해요</button>
            <Link href="/games/quiz" style={{ marginTop: 14, fontSize: 13, color: "#B85C82", textDecoration: "underline" }}>
              퀴즈·미션으로 티켓 모으러 가기
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
