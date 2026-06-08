"use client";

import { useState } from "react";

interface Props {
  speaker: string;        // 예: "🐱 길고양이"
  lines: string[];
  onEnd: () => void;
}

// 화면 하단 RPG식 대화창 — 탭하면 다음 대사
export default function DialogBox({ speaker, lines, onEnd }: Props) {
  const [idx, setIdx] = useState(0);
  const next = () => {
    if (idx + 1 < lines.length) setIdx(idx + 1);
    else onEnd();
  };
  return (
    <div onClick={next} style={{ position: "fixed", inset: 0, zIndex: 70, cursor: "pointer" }}>
      <div className="pop pixel-border" style={{
        position: "absolute", left: "50%", bottom: 18, transform: "translateX(-50%)",
        width: "min(92%, 420px)", background: "var(--cream)", borderRadius: 14,
        padding: "12px 16px 10px",
      }}>
        <p style={{ margin: 0, fontSize: 12, color: "#B85C82" }}>{speaker}</p>
        <p key={idx} className="pop" style={{ margin: "6px 0 4px", fontSize: 14, lineHeight: 1.7, color: "#5A4A55", minHeight: 40 }}>
          {lines[idx]}
        </p>
        <p style={{ margin: 0, textAlign: "right", fontSize: 11, color: "#A89AA3" }}>
          {idx + 1}/{lines.length} ▼ 탭해서 계속
        </p>
      </div>
    </div>
  );
}
