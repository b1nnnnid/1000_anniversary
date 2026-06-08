"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { parseKakao, analyze, Analysis } from "@/lib/kakao";
import { loadAnalyses, saveAnalysis, deleteAnalysis, SavedAnalysis } from "@/lib/kakaoStore";

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

function Dashboard({ a }: { a: Analysis }) {
  const card: React.CSSProperties = { background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 12, boxShadow: "0 3px 0 rgba(124,90,150,0.1)" };
  return (
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
      <div style={card}><p style={{ margin: "0 0 10px", fontSize: 13, color: "#B85C82" }}>💌 누가 더 많이 보냈을까</p><Bar items={a.bySender} color="#E8799F" unit="개" /></div>
      <div style={card}><p style={{ margin: "0 0 10px", fontSize: 13, color: "#B85C82" }}>👋 누가 먼저 연락했을까</p><Bar items={a.firstByDay} color="#C9A7F0" unit="일" /></div>
      <div style={card}><p style={{ margin: "0 0 10px", fontSize: 13, color: "#B85C82" }}>🔤 제일 많이 쓴 말</p><Bar items={a.words} color="#9FC7E8" unit="번" /></div>
      <div style={card}>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#B85C82" }}>🌙 새벽 감성 (0~5시)</p>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#8A7A85" }}>총 {a.lateTotal.toLocaleString()}개</p>
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
  );
}

export default function KakaoPage() {
  const [list, setList] = useState<SavedAnalysis[]>([]);
  const [current, setCurrent] = useState<SavedAnalysis | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // 저장된 분석 불러오기 (가장 최근 자동 표시)
  useEffect(() => {
    const saved = loadAnalyses();
    setList(saved);
    if (saved.length) setCurrent(saved[0]);
  }, []);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setErr(null);
    try {
      const text = await f.text();
      const msgs = parseKakao(text);
      if (msgs.length < 3) { setErr("대화를 못 읽었어요. 카카오톡 '대화 내보내기' .txt 파일이 맞는지 확인해줘요."); return; }
      const item = saveAnalysis(f.name, analyze(msgs));
      setList(loadAnalyses());
      setCurrent(item);
      setAdding(false);
    } catch { setErr("파일을 읽는 중 문제가 생겼어요."); }
    e.target.value = "";
  };

  const remove = (id: string) => {
    const next = deleteAnalysis(id);
    setList(next);
    if (current?.id === id) setCurrent(next[0] ?? null);
  };

  const fmt = (ts: number) => new Date(ts).toLocaleString("ko-KR", { year: "2-digit", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", textAlign: "center", margin: "12px 0 4px" }}>카톡 대화 분석 💬</h1>
      <p style={{ fontSize: 11.5, color: "#8A7A85", textAlign: "center", margin: "0 0 16px", lineHeight: 1.6 }}>
        카카오톡 → 대화방 → 메뉴 → 대화 내보내기(.txt)<br />
        <b style={{ color: "#B85C82" }}>분석·저장 모두 이 기기 안에서만</b> 처리돼요.
      </p>

      {(current === null || adding) && (
        <label style={{ display: "block", textAlign: "center", marginBottom: 18 }}>
          <span className="btn-rose" style={{ display: "inline-block" }}>📂 대화 txt 파일 선택</span>
          <input type="file" accept=".txt" onChange={onFile} style={{ display: "none" }} />
        </label>
      )}
      {err && <p style={{ color: "#A33333", fontSize: 13, textAlign: "center" }}>{err}</p>}

      {current && !adding && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#5A4A55", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current.fileName}</p>
              <p style={{ margin: "1px 0 0", fontSize: 10.5, color: "#A89AA3" }}>{fmt(current.savedAt)} 분석</p>
            </div>
            <button onClick={() => setAdding(true)} style={{ flexShrink: 0, marginLeft: 10, background: "#fff", color: "#B85C82", border: "2px solid var(--lav)", borderRadius: 10, padding: "8px 12px", fontSize: 12 }}>＋ 새 분석</button>
          </div>
          <Dashboard a={current.analysis} />
        </>
      )}

      {/* 저장된 분석 목록 (날짜별) */}
      {list.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <p style={{ fontSize: 12, color: "#8A7A85", margin: "0 0 8px" }}>📑 저장된 분석 ({list.length})</p>
          <div style={{ display: "grid", gap: 8 }}>
            {list.map((it) => {
              const sel = current?.id === it.id;
              return (
                <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 8, background: sel ? "var(--blush)" : "#fff", borderRadius: 12, padding: "10px 12px", boxShadow: "0 2px 0 rgba(124,90,150,0.1)" }}>
                  <button onClick={() => { setCurrent(it); setAdding(false); }} style={{ flex: 1, minWidth: 0, textAlign: "left", background: "none", border: "none", cursor: "pointer" }}>
                    <p style={{ margin: 0, fontSize: 12.5, color: "#5A4A55", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.fileName}</p>
                    <p style={{ margin: "1px 0 0", fontSize: 10.5, color: "#9A8A95" }}>{fmt(it.savedAt)} · 메시지 {it.analysis.total.toLocaleString()}개</p>
                  </button>
                  <button onClick={() => remove(it.id)} aria-label="삭제" style={{ flexShrink: 0, background: "none", border: "none", color: "#C9A7B4", fontSize: 16, cursor: "pointer" }}>✕</button>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 10.5, color: "#B8AEB4", textAlign: "center", marginTop: 12 }}>
            ※ &quot;처음으로&quot;로 초기화하면 저장된 분석도 모두 지워져요
          </p>
        </div>
      )}
    </main>
  );
}
