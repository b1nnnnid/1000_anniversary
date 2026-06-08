"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import PixelIcon from "@/components/PixelIcon";
import { getProgress } from "@/lib/progressClient";
import { isUnlocked, buyUnlock } from "@/lib/unlocks";

interface Props { unlockKey: string; title: string; iconName?: string; cost?: number; children: ReactNode; }

// 티켓을 내고 한 번 열면 이후로는 계속 볼 수 있는 잠금 게이트
export default function TicketGate({ unlockKey, title, iconName = "crystal", cost = 1, children }: Props) {
  const [state, setState] = useState<"loading" | "locked" | "open">("loading");
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
    setState("open");
    setBusy(false);
  };

  if (state === "loading") return null;
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
