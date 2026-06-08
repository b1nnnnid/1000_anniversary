"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { START_DATE, elapsed } from "@/lib/config";

export default function TogetherPage() {
  const [e, setE] = useState(() => elapsed());
  useEffect(() => {
    const iv = setInterval(() => setE(elapsed()), 100);
    return () => clearInterval(iv);
  }, []);

  const milestones = [100, 200, 300, 365, 500, 700, 1000, 2000];
  const next = milestones.find((m) => m >= e.dday) ?? (Math.ceil(e.dday / 1000) * 1000);

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 18px 36px", minHeight: "100dvh", textAlign: "center" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none", display: "block", textAlign: "left" }}>← 우리의 공간</Link>
      <p className="sparkle" style={{ fontSize: 12, color: "#B85C82", letterSpacing: 2, marginTop: 16 }}>SINCE 2023.10.08</p>
      <h1 style={{ fontSize: 22, color: "#B85C82", margin: "6px 0 2px" }}>우리가 함께한 시간 💗</h1>

      <div className="pixel-border" style={{ background: "var(--cream)", borderRadius: 18, padding: "22px 16px", margin: "20px 0" }}>
        <p style={{ fontSize: 13, color: "#8A7A85", margin: 0 }}>오늘로</p>
        <p style={{ fontSize: 40, color: "#E8556F", margin: "2px 0", lineHeight: 1.1 }}>{e.dday.toLocaleString()}<span style={{ fontSize: 20 }}>일째</span></p>
        <p style={{ fontSize: 15, color: "#6A5A66", margin: "8px 0 0" }}>
          {e.days}일 {String(e.h).padStart(2, "0")}:{String(e.m).padStart(2, "0")}:{String(e.s).padStart(2, "0")}
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, padding: "16px", boxShadow: "0 3px 0 rgba(124,90,150,0.12)" }}>
        <p style={{ fontSize: 12, color: "#8A7A85", margin: "0 0 4px" }}>우리가 함께한 총 시간(초)</p>
        <p style={{ fontSize: 26, color: "#B85C82", margin: 0, fontVariantNumeric: "tabular-nums" }}>
          {e.totalSeconds.toLocaleString()} 초
        </p>
        <p style={{ fontSize: 12, color: "#A89AA3", margin: "6px 0 0" }}>지금 이 순간에도 1초씩 쌓이는 중 ⏳</p>
      </div>

      <p style={{ fontSize: 13, color: "#6A5A66", marginTop: 22 }}>
        다음 기념일 <b style={{ color: "#B85C82" }}>{next.toLocaleString()}일</b>까지{" "}
        <b style={{ color: "#E8556F" }}>D-{Math.max(0, next - e.dday)}</b>
      </p>
    </main>
  );
}
