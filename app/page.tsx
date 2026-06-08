"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const COUPLE_SVG = (
  <svg width="240" height="170" viewBox="0 0 240 190" aria-hidden="true" shapeRendering="crispEdges">
    <ellipse cx="120" cy="172" rx="92" ry="13" fill="#E0D0EC" />
    <rect x="24" y="118" width="192" height="48" rx="14" fill="#C7E8D2" />
    <g transform="translate(48,52)">
      <rect x="16" y="16" width="40" height="28" fill="#FBE0CC" />
      <rect x="16" y="0" width="40" height="10" fill="#E889AC" /><rect x="12" y="6" width="48" height="14" fill="#E889AC" />
      <rect x="8" y="14" width="10" height="26" fill="#E889AC" /><rect x="54" y="14" width="10" height="26" fill="#E889AC" />
      <rect x="12" y="16" width="48" height="4" fill="#D9719A" /><rect x="50" y="0" width="12" height="9" fill="#E8556F" />
      <rect x="24" y="28" width="5" height="6" fill="#4A3A2E" /><rect x="43" y="28" width="5" height="6" fill="#4A3A2E" />
      <rect x="19" y="36" width="7" height="4" fill="#F8B8C8" /><rect x="46" y="36" width="7" height="4" fill="#F8B8C8" />
      <rect x="33" y="38" width="6" height="4" fill="#D96A7E" />
      <rect x="16" y="44" width="40" height="24" fill="#FFFFFF" /><rect x="12" y="60" width="48" height="10" fill="#FFFFFF" />
      <rect x="12" y="66" width="48" height="4" fill="#F4B8CC" /><rect x="30" y="44" width="12" height="5" fill="#F4B8CC" />
      <rect x="8" y="46" width="8" height="16" fill="#FBE0CC" /><rect x="56" y="48" width="10" height="8" fill="#FBE0CC" />
      <rect x="22" y="82" width="12" height="5" fill="#E8556F" /><rect x="38" y="82" width="12" height="5" fill="#E8556F" />
    </g>
    <g transform="translate(126,52)">
      <rect x="16" y="16" width="40" height="28" fill="#FBE0CC" />
      <rect x="16" y="0" width="40" height="10" fill="#3F3B45" /><rect x="12" y="6" width="48" height="12" fill="#3F3B45" />
      <rect x="8" y="8" width="8" height="6" fill="#3F3B45" /><rect x="56" y="6" width="8" height="6" fill="#3F3B45" />
      <rect x="24" y="28" width="5" height="6" fill="#4A3A2E" /><rect x="43" y="28" width="5" height="6" fill="#4A3A2E" />
      <rect x="33" y="39" width="6" height="3" fill="#C96A6A" />
      <rect x="16" y="44" width="40" height="22" fill="#A8CFF0" /><rect x="16" y="60" width="40" height="6" fill="#8FB8DC" />
      <rect x="28" y="44" width="16" height="4" fill="#FFFFFF" />
      <rect x="6" y="48" width="10" height="8" fill="#FBE0CC" /><rect x="56" y="46" width="8" height="16" fill="#FBE0CC" />
      <rect x="20" y="66" width="32" height="10" fill="#5A6B8C" /><rect x="24" y="76" width="8" height="8" fill="#5A6B8C" /><rect x="40" y="76" width="8" height="8" fill="#5A6B8C" />
      <rect x="22" y="84" width="12" height="5" fill="#FFFFFF" /><rect x="38" y="84" width="12" height="5" fill="#FFFFFF" />
    </g>
    <rect x="114" y="100" width="12" height="8" fill="#FBE0CC" />
    <path d="M120 30c0-9-14-11-14 0 0 8 14 16 14 16s14-8 14-16c0-11-14-9-14 0Z" fill="#E8799F" />
    <path d="M44 28c0-6-10-8-10 0 0 5 10 11 10 11s10-6 10-11c0-8-10-6-10 0Z" fill="#F2A3C0" />
    <path d="M196 38c0-6-10-7-10 0 0 5 10 11 10 11s10-6 10-11c0-7-10-6-10 0Z" fill="#C9A7F0" />
  </svg>
);

const SLIDES = [
  { emoji: "🚶‍♂️🚶‍♀️", title: "추억을 따라 걸어요", body: "캐릭터를 움직여 우리가 걸어온 길을 따라가요.\n스테이지에 도착하면 그날의 추억이 하나씩 열려요." },
  { emoji: "💗🐱🎟", title: "곳곳을 탐험해요", body: "풀숲에 숨은 하트 조각을 줍고, 길고양이와 이야기하고,\n작은 미션을 풀면 룰렛 기회(티켓)를 모을 수 있어요." },
  { emoji: "🌸💑", title: "끝엔 만남이 기다려요", body: "추억을 모두 모아 도착하면 둘이 만나고,\n세상이 분홍빛 데이트 월드로 바뀌어요." },
];

export default function Intro() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0=표지, 1~3=소개, 그 후 /map

  const next = () => {
    if (step < SLIDES.length) setStep(step + 1);
    else router.push("/map");
  };

  return (
    <main style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "28px 22px",
      textAlign: "center", maxWidth: 460, margin: "0 auto",
    }}>
      {step === 0 ? (
        <div key="cover" className="slideup" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="sparkle" style={{ fontSize: 13, color: "#B85C82", letterSpacing: 2 }}>OUR LITTLE WORLD</div>
          <h1 style={{ fontSize: 26, color: "#B85C82", margin: "10px 0 4px", lineHeight: 1.4 }}>우리의 1000일 ♥</h1>
          <p style={{ fontSize: 13, color: "#8A7A85", margin: "0 0 18px", lineHeight: 1.7 }}>
            함께 걸어온 길을 따라가는 작은 추억 여행
          </p>
          <div className="floaty">{COUPLE_SVG}</div>
          <button className="btn-rose" onClick={next} style={{ marginTop: 24 }}>여행 시작하기 →</button>
        </div>
      ) : (
        <div key={step} className="slideup" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div className="floaty" style={{ fontSize: 46, letterSpacing: 4, minHeight: 60 }}>{SLIDES[step - 1].emoji}</div>
          <h2 style={{ fontSize: 21, color: "#B85C82", margin: "16px 0 10px" }}>{SLIDES[step - 1].title}</h2>
          <p style={{ fontSize: 14, color: "#6A5A66", lineHeight: 1.8, whiteSpace: "pre-line", margin: 0 }}>
            {SLIDES[step - 1].body}
          </p>
          <button className="btn-rose" onClick={next} style={{ marginTop: 28 }}>
            {step < SLIDES.length ? "다음 →" : "시작하기 ♥"}
          </button>
        </div>
      )}

      {/* 진행 점 */}
      <div style={{ display: "flex", gap: 7, marginTop: 26 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            width: i === step ? 20 : 8, height: 8, borderRadius: 4,
            background: i === step ? "var(--rose)" : "#E0D0DC", transition: "all .3s",
          }} />
        ))}
      </div>
      {step > 0 && (
        <button onClick={() => router.push("/map")} style={{
          background: "none", border: "none", fontSize: 12, color: "#A89AA3",
          marginTop: 14, textDecoration: "underline",
        }}>건너뛰기</button>
      )}
    </main>
  );
}
