"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { STAGES, Stage } from "@/lib/gameData";
import { getProgress } from "@/lib/progressClient";
import { markFlag } from "@/lib/flags";

export default function SlideshowPage() {
  const [slides, setSlides] = useState<Stage[]>([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [music, setMusic] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const stopMusic = useRef<(() => void) | null>(null);

  useEffect(() => {
    markFlag("slideshow");
    getProgress().then((p) => {
      const got = STAGES.filter((s) => p.collectedSpots.includes(s.id)).sort((a, b) => a.order - b.order);
      setSlides(got);
      setLoaded(true);
      if (got.length) setPlaying(true);
    });
  }, []);

  // 자동 넘기기
  useEffect(() => {
    if (!playing || slides.length === 0) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % slides.length), 4200);
    return () => clearTimeout(t);
  }, [playing, idx, slides.length]);

  // 잔잔한 배경 멜로디 (WebAudio)
  const toggleMusic = useCallback(() => {
    if (music) { stopMusic.current?.(); setMusic(false); return; }
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new Ctx();
    audioRef.current = ac;
    const notes = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33]; // C D E G E D
    let i = 0;
    const gain = ac.createGain(); gain.gain.value = 0.0001; gain.connect(ac.destination);
    gain.gain.exponentialRampToValueAtTime(0.12, ac.currentTime + 1);
    const iv = setInterval(() => {
      const o = ac.createOscillator(); o.type = "triangle";
      o.frequency.value = notes[i % notes.length]; i++;
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.5, ac.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.6);
      o.connect(g); g.connect(gain); o.start(); o.stop(ac.currentTime + 0.62);
    }, 620);
    stopMusic.current = () => { clearInterval(iv); gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.3); setTimeout(() => ac.close(), 400); };
    setMusic(true);
  }, [music]);

  useEffect(() => () => stopMusic.current?.(), []);

  if (loaded && slides.length === 0) {
    return (
      <main style={{ maxWidth: 460, margin: "0 auto", padding: "60px 20px", textAlign: "center", minHeight: "100dvh" }}>
        <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none", display: "block", textAlign: "left" }}>← 우리의 공간</Link>
        <p style={{ fontSize: 40, marginTop: 40 }}>🎞️</p>
        <p style={{ fontSize: 14, color: "#6A5A66", lineHeight: 1.7 }}>아직 모은 추억이 없어요.<br />맵에서 추억을 모으고 다시 와줘요!</p>
      </main>
    );
  }

  const s = slides[idx];

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 30px", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
        <button onClick={toggleMusic} className="chip" style={{ cursor: "pointer", border: "none" }}>
          {music ? "🔊 음악 끄기" : "🎵 음악 켜기"}
        </button>
      </div>
      <h1 style={{ fontSize: 18, color: "#B85C82", textAlign: "center", margin: "10px 0 14px" }}>우리의 1000일 추억 🎞️</h1>

      {s && (
        <div className="pixel-border" style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#000" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={s.id} src={s.photo} alt={s.title} className="kenburns"
            style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(90,40,70,0.7), transparent 45%)" }} />
          <div key={"c" + s.id} className="capt" style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 18px", color: "#fff", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.85 }}>{s.date}</p>
            <p style={{ margin: "4px 0 0", fontSize: 18 }}>{s.title}</p>
          </div>
          {[...Array(6)].map((_, i) => (
            <span key={i} style={{ position: "absolute", left: `${10 + i * 15}%`, bottom: -10, fontSize: 14 + (i % 3) * 4, animation: `rise ${3 + (i % 3)}s linear ${i * 0.6}s infinite`, pointerEvents: "none" }}>💗</span>
          ))}
        </div>
      )}

      {/* 진행 점 + 컨트롤 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "14px 0" }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`${i + 1}번째`}
            style={{ width: i === idx ? 18 : 7, height: 7, borderRadius: 4, border: "none", background: i === idx ? "var(--rose)" : "#E0D0DC", transition: "all .3s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        <button onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)} className="chip" style={{ border: "none", cursor: "pointer" }}>◀ 이전</button>
        <button onClick={() => setPlaying((p) => !p)} className="btn-rose" style={{ fontSize: 13, padding: "8px 18px" }}>{playing ? "⏸ 멈춤" : "▶ 재생"}</button>
        <button onClick={() => setIdx((i) => (i + 1) % slides.length)} className="chip" style={{ border: "none", cursor: "pointer" }}>다음 ▶</button>
      </div>

      <style>{`
        @keyframes kb { 0%{transform:scale(1)} 100%{transform:scale(1.12)} }
        .kenburns { animation: kb 4.6s ease-out forwards; }
        @keyframes capin { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .capt { animation: capin .8s ease-out; }
        @keyframes rise { 0%{transform:translateY(0);opacity:0} 20%{opacity:.9} 100%{transform:translateY(-220px);opacity:0} }
      `}</style>
    </main>
  );
}
