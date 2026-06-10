"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PixelIcon from "@/components/PixelIcon";
import { parseKakao, analyze, Analysis } from "@/lib/kakao";
import { loadAnalyses, saveAnalysis, deleteAnalysis, SavedAnalysis } from "@/lib/kakaoStore";
import { getProgress, spendTicket } from "@/lib/progressClient";
import { markFlag } from "@/lib/flags";

const COST = 1; // 새 분석 1회당 티켓
const WD = ["일", "월", "화", "수", "목", "금", "토"];

function CountUp({ target, duration = 1000, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setV(target); return; }
    let raf = 0; const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return <>{v.toLocaleString()}{suffix}</>;
}

function Bar({ items, color, unit }: { items: { name?: string; word?: string; count: number }[]; color: string; unit: string }) {
  const [boot, setBoot] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBoot(true), 60); return () => clearTimeout(t); }, []);
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#6A5A66", width: 76, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name ?? it.word}</span>
          <div style={{ flex: 1, background: "#F1EFE8", borderRadius: 6, height: 16, overflow: "hidden" }}>
            <div style={{ width: boot ? `${(it.count / max) * 100}%` : "0%", height: "100%", background: color, borderRadius: 6, transition: `width .9s ${i * 0.06}s cubic-bezier(.22,.8,.24,1)` }} />
          </div>
          <span style={{ fontSize: 11, color: "#9A8A95", width: 52 }}>{it.count.toLocaleString()}{unit}</span>
        </div>
      ))}
    </div>
  );
}

function HourChart({ byHour, peak }: { byHour: number[]; peak: number }) {
  const [boot, setBoot] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBoot(true), 80); return () => clearTimeout(t); }, []);
  const max = Math.max(1, ...byHour);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 64 }}>
        {byHour.map((v, h) => (
          <div key={h} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
            <div style={{
              height: boot ? `${Math.max(4, (v / max) * 100)}%` : "0%",
              background: h === peak ? "#E8556F" : "#E8C0D2", borderRadius: 3,
              transition: `height .8s ${h * 0.018}s cubic-bezier(.22,.8,.24,1)`,
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#B7A6B1", marginTop: 4 }}>
        <span>0시</span><span>6시</span><span>12시</span><span>18시</span><span>23시</span>
      </div>
    </div>
  );
}

function Dashboard({ a: raw }: { a: Analysis }) {
  // 예전에 저장된 분석엔 새 필드가 없으므로 기본값으로 보정 (raw 를 먼저 펼친 뒤 누락분만 채움)
  const a: Analysis = {
    ...raw,
    laughs: raw.laughs ?? 0,
    loveWords: raw.loveWords ?? 0,
    hearts: raw.hearts ?? 0,
    mediaCount: raw.mediaCount ?? 0,
    peakHour: raw.peakHour ?? 0,
    longestStreak: raw.longestStreak ?? 0,
    byHour: raw.byHour ?? new Array(24).fill(0),
    topWeekday: raw.topWeekday ?? null,
    longestMsg: raw.longestMsg ?? null,
    firstDate: raw.firstDate ?? null,
    lastDate: raw.lastDate ?? null,
  };
  // 새 지표(byHour 등)가 있는 분석만 재미 카드 노출 — 예전 분석은 데이터가 없어 숨김
  const hasFun = Array.isArray(raw.byHour) && raw.byHour.length === 24;
  const card: React.CSSProperties = { background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 12, boxShadow: "0 3px 0 rgba(124,90,150,0.1)" };
  const ampm = a.peakHour < 12 ? "오전" : "오후";
  const h12 = a.peakHour % 12 === 0 ? 12 : a.peakHour % 12;
  return (
    <div className="slideup k-dash">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div style={{ ...card, marginBottom: 0, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 12, color: "#8A7A85" }}>총 메시지</p>
          <p style={{ margin: "2px 0 0", fontSize: 22, color: "#E8556F" }}><CountUp target={a.total} /></p>
        </div>
        <div style={{ ...card, marginBottom: 0, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 12, color: "#8A7A85" }}>대화한 날</p>
          <p style={{ margin: "2px 0 0", fontSize: 22, color: "#E8556F" }}><CountUp target={a.days} suffix="일" /></p>
        </div>
      </div>

      {!hasFun && (
        <p style={{ textAlign: "center", fontSize: 11.5, color: "#B07E96", background: "var(--cream)", borderRadius: 10, padding: "9px 12px", margin: "0 0 12px" }}>
          ✨ 이 분석은 예전 버전이라 새 재미 요소가 없어요. <b>＋ 새 분석</b>으로 다시 올리면 더 많이 볼 수 있어요!
        </p>
      )}

      {/* 재미 요소: 웃음·사랑·하트 하이라이트 */}
      {hasFun && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { icon: "laugh", v: a.laughs, label: "웃음" },
            { icon: "heart", v: a.loveWords, label: "사랑표현" },
            { icon: "heart", v: a.hearts, label: "하트" },
          ].map((x, i) => (
            <div key={x.label} className="k-pop" style={{ background: "linear-gradient(135deg,#fff,var(--cream))", borderRadius: 14, padding: "12px 6px", textAlign: "center", boxShadow: "0 2px 0 rgba(124,90,150,0.1)", animationDelay: `${i * 0.1}s` }}>
              <div className="k-bob" style={{ animationDelay: `${i * 0.3}s` }}><PixelIcon name={x.icon} size={22} /></div>
              <p style={{ margin: "3px 0 0", fontSize: 17, fontWeight: 800, color: "#E8556F" }}><CountUp target={x.v} /></p>
              <p style={{ margin: 0, fontSize: 10.5, color: "#9A8A95" }}>{x.label}</p>
            </div>
          ))}
        </div>
      )}

      <div style={card}><p style={{ margin: "0 0 10px", fontSize: 13, color: "#B85C82" }}><PixelIcon name="letter" size={13} /> 누가 더 많이 보냈을까</p><Bar items={a.bySender} color="#E8799F" unit="개" /></div>
      <div style={card}><p style={{ margin: "0 0 10px", fontSize: 13, color: "#B85C82" }}><PixelIcon name="chat" size={13} /> 누가 먼저 연락했을까</p><Bar items={a.firstByDay} color="#C9A7F0" unit="일" /></div>

      {/* 시간대 활동 */}
      {hasFun && (
        <div style={card}>
          <p style={{ margin: "0 0 4px", fontSize: 13, color: "#B85C82" }}><PixelIcon name="clock" size={13} /> 우리의 대화 시간대</p>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "#8A7A85" }}>가장 활발한 시간: <b style={{ color: "#E8556F" }}>{ampm} {h12}시</b></p>
          <HourChart byHour={a.byHour} peak={a.peakHour} />
        </div>
      )}

      {/* 요일 + 연속대화 */}
      {hasFun && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={{ ...card, marginBottom: 0, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#8A7A85" }}>제일 수다스러운 요일</p>
            <p style={{ margin: "4px 0 0", fontSize: 22, color: "#E8556F" }}>{a.topWeekday ? `${WD[a.topWeekday.day]}요일` : "-"}</p>
          </div>
          <div style={{ ...card, marginBottom: 0, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#8A7A85" }}>최장 연속 대화 <PixelIcon name="fire" size={12} /></p>
            <p style={{ margin: "4px 0 0", fontSize: 22, color: "#E8556F" }}><CountUp target={a.longestStreak} suffix="일" /></p>
          </div>
        </div>
      )}

      <div style={card}><p style={{ margin: "0 0 10px", fontSize: 13, color: "#B85C82" }}><PixelIcon name="word" size={13} /> 제일 많이 쓴 말</p><Bar items={a.words} color="#9FC7E8" unit="번" /></div>
      <div style={card}>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#B85C82" }}><PixelIcon name="moon" size={13} /> 새벽 감성 (0~5시)</p>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#8A7A85" }}>총 {a.lateTotal.toLocaleString()}개</p>
        <Bar items={a.lateNight} color="#7E6CC4" unit="개" />
      </div>

      {a.longestMsg && (
        <div style={card}>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "#B85C82" }}><PixelIcon name="letter" size={13} /> 가장 길게 쓴 메시지</p>
          <p style={{ margin: 0, fontSize: 12.5, color: "#5A4A55", lineHeight: 1.6, fontStyle: "italic" }}>&ldquo;{a.longestMsg.text}&rdquo;</p>
          <p style={{ margin: "6px 0 0", fontSize: 11, color: "#A89AA3", textAlign: "right" }}>— {a.longestMsg.sender} ({a.longestMsg.text.length}자)</p>
        </div>
      )}

      {a.busiestDay && (
        <div style={{ ...card, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#B85C82" }}><span className="k-bob" style={{ display: "inline-block" }}><PixelIcon name="fire" size={14} /></span> 가장 폭발한 날</p>
          <p style={{ margin: "6px 0 0", fontSize: 16, color: "#5A4A55" }}>{a.busiestDay.date}</p>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#E8556F" }}>하루에 {a.busiestDay.count.toLocaleString()}개!</p>
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: 12, color: "#8A7A85", marginTop: 8 }}>
        함께 나눈 글자 수: <b style={{ color: "#B85C82" }}>{a.totalChars.toLocaleString()}자</b> <PixelIcon name="word" size={12} />
        {a.mediaCount > 0 && <> · 사진·이모티콘 <b style={{ color: "#B85C82" }}>{a.mediaCount.toLocaleString()}개</b> <PixelIcon name="camera" size={12} /></>}
      </p>
    </div>
  );
}

function AnalyzingScreen() {
  const messages = ["대화를 불러오는 중", "메시지를 한 통씩 세는 중", "설렘 지수를 계산하는 중", "추억을 예쁘게 정리하는 중"];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx((i) => (i + 1) % messages.length), 700);
    return () => clearInterval(iv);
  }, []);
  const bubbles = [
    { me: false, w: 70 }, { me: true, w: 50 }, { me: false, w: 88 },
  ];
  return (
    <div style={{ padding: "30px 10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* 채팅 버블 등장 + 타이핑 */}
      <div style={{ width: "100%", maxWidth: 240, display: "grid", gap: 8, marginBottom: 22 }}>
        {bubbles.map((b, i) => (
          <div key={i} style={{ display: "flex", justifyContent: b.me ? "flex-end" : "flex-start" }}>
            <span className="k-bubble" style={{
              width: `${b.w}%`, height: 18, borderRadius: 10,
              background: b.me ? "var(--rose)" : "#fff",
              boxShadow: "0 2px 0 rgba(124,90,150,0.12)",
              animation: `k-bubble-in .5s ${i * 0.18}s both`,
            }} />
          </div>
        ))}
        {/* 타이핑 인디케이터 */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <span style={{ display: "inline-flex", gap: 4, background: "#fff", borderRadius: 12, padding: "8px 12px", boxShadow: "0 2px 0 rgba(124,90,150,0.12)" }}>
            {[0, 1, 2].map((d) => (
              <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8799F", animation: `k-typing 1.2s ${d * 0.18}s infinite` }} />
            ))}
          </span>
        </div>
      </div>
      <p key={idx} style={{ fontSize: 15, color: "#B85C82", margin: 0, animation: "k-fade .7s ease-in-out" }}>
        {messages[idx]}<span style={{ animation: "k-typing 1.2s 0s infinite" }}>.</span><span style={{ animation: "k-typing 1.2s .2s infinite" }}>.</span><span style={{ animation: "k-typing 1.2s .4s infinite" }}>.</span>
      </p>
      <div style={{ width: 200, height: 6, background: "#EAD9E4", borderRadius: 4, overflow: "hidden", marginTop: 16 }}>
        <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, var(--rose), var(--lav))", animation: "k-bar 2800ms linear forwards" }} />
      </div>
    </div>
  );
}

export default function KakaoPage() {
  const [list, setList] = useState<SavedAnalysis[]>([]);
  const [current, setCurrent] = useState<SavedAnalysis | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [tickets, setTickets] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // 저장된 분석 불러오기 (가장 최근 자동 표시) + 티켓 수
  useEffect(() => {
    const saved = loadAnalyses();
    setList(saved);
    if (saved.length) setCurrent(saved[0]);
    getProgress().then((p) => setTickets(p.tickets));
  }, []);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setErr(null);
    let msgs;
    try {
      const text = await f.text();
      msgs = parseKakao(text);
    } catch { setErr("파일을 읽는 중 문제가 생겼어요."); return; }
    if (msgs.length < 3) { setErr("대화를 못 읽었어요. 카카오톡 '대화 내보내기' .txt 파일이 맞는지 확인해줘요."); return; }
    if ((tickets ?? 0) < COST) { setErr(`분석에는 티켓 ${COST}장이 필요해요 (지금 ${tickets ?? 0}장)`); return; }

    // 로딩 연출 (약 2.8초)
    setAnalyzing(true);
    const result = analyze(msgs);
    await new Promise((r) => setTimeout(r, 2800));
    const left = await spendTicket(COST);
    setTickets(left);
    const item = saveAnalysis(f.name, result);
    setList(loadAnalyses());
    setCurrent(item);
    setAdding(false);
    setAnalyzing(false);
    markFlag("kakao");
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0 4px" }}>
        <h1 style={{ fontSize: 20, color: "#B85C82" }}>카톡 대화 분석 <PixelIcon name="chat" size={18} /></h1>
        <span className="chip"><PixelIcon name="ticket" size={14} /> {tickets ?? "..."}</span>
      </div>
      <p style={{ fontSize: 11.5, color: "#8A7A85", textAlign: "center", margin: "0 0 16px", lineHeight: 1.6 }}>
        카카오톡 → 대화방 → 메뉴 → 대화 내보내기(.txt)<br />
        새 분석 1회당 <b style={{ color: "#B85C82" }}>티켓 {COST}장</b> · <b style={{ color: "#B85C82" }}>이 기기 안에서만</b> 처리돼요.
      </p>

      {analyzing ? (
        <AnalyzingScreen />
      ) : (
        <>
          {(current === null || adding) && (
            <label style={{ display: "block", textAlign: "center", marginBottom: 18 }}>
              <span className="btn-rose" style={{ display: "inline-block" }}>📂 대화 txt 파일 선택 (티켓 {COST}장)</span>
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

          {/* 저장된 분석 목록 (날짜별) — 다시 보기는 무료 */}
          {list.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <p style={{ fontSize: 12, color: "#8A7A85", margin: "0 0 8px" }}>📑 저장된 분석 ({list.length}) · 다시 보기는 무료</p>
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
        </>
      )}
    </main>
  );
}
