"use client";

import { useState } from "react";
import Link from "next/link";
import { parseKakao, analyze, Analysis } from "@/lib/kakao";

function Bar({ items, color, unit }: { items: { name?: string; word?: string; count: number }[]; color: string; unit: string }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#6A5A66", width: 76, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name ?? it.word}</span>
          <div style={{ flex: 1, background: "#F1EFE8", borderRadius: 6, height: 16, overflow: "hidden" }}>
            <div style={{ width: `${(it.count / max) * 100}%`, height: "100%", background: color, borderRadius: 6 }} />
          </div>
          <span style={{ fontSize: 11, color: "#9A8A95", width: 52 }}>{it.count.toLocaleString()}{unit}</span>
        </div>
      ))}
    </div>
  );
}

export default function KakaoPage() {
  const [a, setA] = useState<Analysis | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setErr(null);
    try {
      const text = await f.text();
      const msgs = parseKakao(text);
      if (msgs.length < 3) { setErr("대화를 못 읽었어요. 카카오톡 '대화 내보내기'로 받은 .txt 파일이 맞는지 확인해줘요."); return; }
      setA(analyze(msgs));
    } catch { setErr("파일을 읽는 중 문제가 생겼어요."); }
  };

  const card: React.CSSProperties = { background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 12, boxShadow: "0 3px 0 rgba(124,90,150,0.1)" };

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", textAlign: "center", margin: "12px 0 4px" }}>카톡 대화 분석 💬</h1>
      <p style={{ fontSize: 11.5, color: "#8A7A85", textAlign: "center", margin: "0 0 16px", lineHeight: 1.6 }}>
        카카오톡 → 대화방 → 메뉴 → 대화 내보내기(.txt)로 받은 파일을 올려줘요.<br />
        <b style={{ color: "#B85C82" }}>분석은 전부 이 기기 안에서만 처리</b>되고 어디에도 전송되지 않아요.
      </p>

      <label style={{ display: "block", textAlign: "center", marginBottom: 18 }}>
        <span className="btn-rose" style={{ display: "inline-block" }}>📂 대화 txt 파일 선택</span>
        <input type="file" accept=".txt" onChange={onFile} style={{ display: "none" }} />
      </label>

      {err && <p style={{ color: "#A33333", fontSize: 13, textAlign: "center" }}>{err}</p>}

      {a && (
        <div className="slideup">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ ...card, marginBottom: 0, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#8A7A85" }}>총 메시지</p>
              <p style={{ margin: "2px 0 0", fontSize: 22, color: "#E8556F" }}>{a.total.toLocaleString()}</p>
            </div>
            <div style={{ ...card, marginBottom: 0, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#8A7A85" }}>대화한 날</p>
              <p style={{ margin: "2px 0 0", fontSize: 22, color: "#E8556F" }}>{a.days.toLocaleString()}일</p>
            </div>
          </div>

          <div style={card}>
            <p style={{ margin: "0 0 10px", fontSize: 13, color: "#B85C82" }}>💌 누가 더 많이 보냈을까</p>
            <Bar items={a.bySender} color="#E8799F" unit="개" />
          </div>

          <div style={card}>
            <p style={{ margin: "0 0 10px", fontSize: 13, color: "#B85C82" }}>👋 누가 먼저 연락했을까 (날마다 첫 메시지)</p>
            <Bar items={a.firstByDay} color="#C9A7F0" unit="일" />
          </div>

          <div style={card}>
            <p style={{ margin: "0 0 10px", fontSize: 13, color: "#B85C82" }}>🔤 우리가 제일 많이 쓴 말</p>
            <Bar items={a.words} color="#9FC7E8" unit="번" />
          </div>

          <div style={card}>
            <p style={{ margin: "0 0 4px", fontSize: 13, color: "#B85C82" }}>🌙 새벽 감성 (0~5시)</p>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: "#8A7A85" }}>총 {a.lateTotal.toLocaleString()}개의 새벽 메시지</p>
            <Bar items={a.lateNight} color="#7E6CC4" unit="개" />
          </div>

          {a.busiestDay && (
            <div style={{ ...card, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#B85C82" }}>🔥 가장 폭발한 날</p>
              <p style={{ margin: "6px 0 0", fontSize: 16, color: "#5A4A55" }}>{a.busiestDay.date}</p>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "#E8556F" }}>하루에 {a.busiestDay.count.toLocaleString()}개!</p>
            </div>
          )}

          <p style={{ textAlign: "center", fontSize: 12, color: "#8A7A85", marginTop: 8 }}>
            함께 나눈 글자 수: <b style={{ color: "#B85C82" }}>{a.totalChars.toLocaleString()}자</b> ✍️
          </p>
        </div>
      )}
    </main>
  );
}
