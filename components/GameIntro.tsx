"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface Props {
  emoji: string;
  title: string;
  desc: string;
  rules: string[];
  startLabel: string;
  onStart: () => void;
  disabled?: boolean;
  hint?: ReactNode;   // 시작 불가일 때 안내 (예: 퀴즈 풀러 가기)
}

// 게임 시작 전 인트로 화면 (퀴즈/룰렛 공용)
export default function GameIntro({ emoji, title, desc, rules, startLabel, onStart, disabled, hint }: Props) {
  return (
    <div className="slideup" style={{ textAlign: "center", paddingTop: 26 }}>
      <div className="floaty" style={{ fontSize: 62, lineHeight: 1 }}>{emoji}</div>
      <h1 style={{ fontSize: 21, color: "#B85C82", margin: "14px 0 8px" }}>{title}</h1>
      <p style={{ fontSize: 13, color: "#8A7A85", lineHeight: 1.7, margin: "0 0 18px", whiteSpace: "pre-line" }}>{desc}</p>

      <div className="rule-card" style={{ maxWidth: 300, margin: "0 auto 22px" }}>
        {rules.map((r, i) => (
          <p key={i} style={{ margin: i === 0 ? 0 : "8px 0 0", fontSize: 12.5, color: "#6A5A66", lineHeight: 1.6 }}>
            <span style={{ color: "#E8799F" }}>♥</span> {r}
          </p>
        ))}
      </div>

      <button className="btn-rose" onClick={onStart} disabled={disabled} style={{ fontSize: 15, minWidth: 180 }}>
        {startLabel}
      </button>
      {hint && <div style={{ marginTop: 14 }}>{hint}</div>}
      <p style={{ marginTop: 18 }}>
        <Link href="/map" style={{ fontSize: 12, color: "#A89AA3", textDecoration: "none" }}>← 맵으로 돌아가기</Link>
      </p>
    </div>
  );
}
