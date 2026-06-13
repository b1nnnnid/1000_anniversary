"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PixelIcon from "@/components/PixelIcon";
import CharacterReaction from "@/components/CharacterReaction";
import CinematicOverlay from "@/components/CinematicOverlay";
import { getProgress } from "@/lib/progressClient";
import { getUnlocks } from "@/lib/unlocks";
import { getFlags } from "@/lib/flags";
import { computeAchievements } from "@/lib/achievements";

/* ───────── 편집 포인트: 만든 사람 소개 / 자랑 문구 ─────────
   아래 CREDIT 값만 바꾸면 크레딧 카드 내용이 바뀝니다.            */
const CREDIT = {
  maker: "숯댕이",
  title: "💝 Made with love by 숯댕이",
  lines: [
    "1000일을 기념하며 한 땀 한 땀 직접 만들었어요.",
    "우리가 함께 걸어온 길을, 작은 세계로 담았어요.",
  ],
  stack: ["Next.js", "React", "TypeScript", "픽셀아트", "Canvas"],
  version: "v1.0 · 2026.06",
};
/* ──────────────────────────────────────────────────────────── */

// 정성 스탯 (실제 콘텐츠 개수 — 스크롤 시 숫자가 카운트업)
const STATS: { to: number; prefix?: string; label: string }[] = [
  { to: 15, label: "화면" },
  { to: 7, label: "추억" },
  { to: 20, label: "업적" },
  { to: 8, label: "숨은하트" },
  { to: 4, label: "편지" },
  { to: 1000, prefix: "D+", label: "함께한 날" },
];

// D-day 미니 타임라인 이정표 (pct = 1000일 기준 위치 %)
const MILES: { pct: number; label: string }[] = [
  { pct: 0, label: "처음" },
  { pct: 10, label: "100일" },
  { pct: 36.5, label: "1년" },
  { pct: 73, label: "2년" },
  { pct: 100, label: "1000일" },
];

// 배경에 은은히 떠다니는 장식
const BG: { e: string; l: string; t: string; s: number; o: number; d: string; anim: string }[] = [
  { e: "💗", l: "6%", t: "8%", s: 16, o: 0.5, d: "0s", anim: "drift" },
  { e: "✨", l: "88%", t: "14%", s: 13, o: 0.55, d: "1.2s", anim: "twinkle" },
  { e: "⭐", l: "14%", t: "30%", s: 12, o: 0.4, d: "2.1s", anim: "twinkle" },
  { e: "💞", l: "82%", t: "42%", s: 15, o: 0.45, d: "0.6s", anim: "drift" },
  { e: "✨", l: "10%", t: "56%", s: 12, o: 0.5, d: "1.8s", anim: "twinkle" },
  { e: "💗", l: "90%", t: "66%", s: 14, o: 0.42, d: "2.6s", anim: "drift" },
  { e: "⭐", l: "8%", t: "80%", s: 11, o: 0.4, d: "0.9s", anim: "twinkle" },
  { e: "💞", l: "85%", t: "90%", s: 15, o: 0.45, d: "1.5s", anim: "drift" },
];

// 미니 화면 프레임 (카드 안의 작은 목업)
function Mini({ children, bg = "#FBF3F8", pad = 10 }: { children: ReactNode; bg?: string; pad?: number }) {
  return (
    <div style={{ background: bg, borderRadius: 10, padding: pad, boxShadow: "inset 0 0 0 1px rgba(124,90,150,0.08)" }}>
      {children}
    </div>
  );
}

// 땀 뻘뻘 흘리며 컴퓨터로 작업하는 여자 캐릭터 (픽셀 애니메이션)
function GirlAtComputer({ size = 104 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96" shapeRendering="crispEdges"
      role="img" aria-label="컴퓨터로 작업하며 땀 흘리는 캐릭터" style={{ display: "block" }}>
      {/* 데스크 */}
      <rect x="0" y="70" width="120" height="4" fill="#D6B488" />
      <rect x="0" y="74" width="120" height="22" fill="#C49A6E" />
      {/* 머리카락 뒤 + 옆머리 */}
      <rect x="46" y="12" width="32" height="30" fill="#E889AC" />
      <rect x="44" y="16" width="6" height="26" fill="#E889AC" />
      <rect x="74" y="16" width="6" height="26" fill="#E889AC" />
      {/* 얼굴 */}
      <rect x="52" y="20" width="20" height="20" fill="#FBE0CC" />
      {/* 앞머리 */}
      <rect x="50" y="14" width="24" height="8" fill="#E889AC" />
      <rect x="50" y="20" width="6" height="5" fill="#E889AC" />
      <rect x="68" y="20" width="6" height="5" fill="#E889AC" />
      {/* 살짝 올라간 부드러운 눈썹 (귀엽고 야무진) */}
      <rect x="54" y="27" width="2" height="2" fill="#D79AAE" />
      <rect x="56" y="26" width="3" height="2" fill="#D79AAE" />
      <rect x="61" y="26" width="3" height="2" fill="#D79AAE" />
      <rect x="64" y="27" width="2" height="2" fill="#D79AAE" />
      {/* 크고 초롱초롱한 눈 */}
      <rect x="54" y="29" width="5" height="4" fill="#4A3A2E" />
      <rect x="65" y="29" width="5" height="4" fill="#4A3A2E" />
      <rect x="55" y="29" width="2" height="2" fill="#FFFFFF" />
      <rect x="66" y="29" width="2" height="2" fill="#FFFFFF" />
      <rect x="57" y="32" width="1" height="1" fill="#FFFFFF" />
      <rect x="68" y="32" width="1" height="1" fill="#FFFFFF" />
      {/* 볼 홍조 + 앙 다문 작은 입 */}
      <rect x="52" y="34" width="3" height="3" fill="#F4A3BE" />
      <rect x="69" y="34" width="3" height="3" fill="#F4A3BE" />
      <rect x="60" y="36" width="4" height="3" fill="#C96A6A" />
      <rect x="61" y="37" width="2" height="1" fill="#E89AA0" />
      {/* 상의 */}
      <rect x="50" y="40" width="24" height="14" fill="#FFFFFF" />
      <rect x="58" y="40" width="8" height="3" fill="#F4B8CC" />
      {/* 타이핑하는 팔 (좌우 번갈아) */}
      <g className="gw-typeL"><rect x="44" y="46" width="7" height="16" fill="#FBE0CC" /><rect x="43" y="60" width="10" height="6" fill="#FBE0CC" /></g>
      <g className="gw-typeR"><rect x="73" y="46" width="7" height="16" fill="#FBE0CC" /><rect x="71" y="60" width="10" height="6" fill="#FBE0CC" /></g>
      {/* 노트북 */}
      <rect x="40" y="50" width="44" height="3" className="gw-screen" fill="#BFE0F5" />
      <rect x="40" y="52" width="44" height="20" fill="#5A4A55" />
      <rect x="59" y="59" width="6" height="6" fill="#E8799F" />
      <rect x="36" y="70" width="52" height="5" fill="#7A6A75" />
      {/* 얼굴에 흐르는 땀 두 방울 */}
      <g className="gw-drip"><rect x="71" y="25" width="3" height="4" fill="#9FD9F0" /><rect x="72" y="24" width="1" height="2" fill="#D6F2FF" /></g>
      <g className="gw-drip" style={{ animationDelay: ".75s" }}><rect x="50" y="27" width="3" height="4" fill="#9FD9F0" /></g>
      {/* 머리 위로 튀는 땀 */}
      <g className="gw-fling" style={{ animationDelay: ".2s" }}><rect x="80" y="16" width="4" height="5" fill="#9FD9F0" /><rect x="81" y="15" width="2" height="2" fill="#D6F2FF" /></g>
      <g className="gw-fling2" style={{ animationDelay: "1s" }}><rect x="40" y="18" width="4" height="5" fill="#9FD9F0" /></g>
    </svg>
  );
}

const tile = (label: string, emoji: string) => (
  <div className="stagger" style={{ background: "#fff", borderRadius: 9, padding: "9px 3px", textAlign: "center", boxShadow: "0 2px 0 rgba(124,90,150,0.1)" }}>
    <span style={{ fontSize: 20 }}>{emoji}</span>
    <p style={{ margin: "3px 0 0", fontSize: 9, color: "#B85C82" }}>{label}</p>
  </div>
);

// ── 16개 화면 정의 ──
type ScreenDef = { n: string; route: string; icon: string; title: string; blurb: string; mock: ReactNode };

const SCREENS: ScreenDef[] = [
  {
    n: "01", route: "/", icon: "heart", title: "인트로 — 우리의 1000일",
    blurb: "표지에서 시작하는 작은 추억 여행. 함께 떠나봐요.",
    mock: (
      <Mini bg="#F3DCE7">
        <div style={{ textAlign: "center", padding: "6px 0" }}>
          <div className="stagger" style={{ fontSize: 10, letterSpacing: 2, color: "#B85C82" }}>OUR LITTLE WORLD</div>
          <div className="stagger" style={{ fontSize: 15, color: "#B85C82", fontWeight: 700, margin: "4px 0" }}>우리의 1000일 ♥</div>
          <div className="stagger floaty" style={{ display: "flex", justifyContent: "center", gap: 0, marginTop: 2 }}>
            <CharacterReaction mood="happy" who="boy" size={56} />
            <span style={{ marginLeft: -16 }}><CharacterReaction mood="excited" who="girl" size={56} /></span>
          </div>
        </div>
      </Mini>
    ),
  },
  {
    n: "02", route: "/map", icon: "camera", title: "추억탐방 맵",
    blurb: "함께 걸어온 길을 따라가요. 스테이지마다 그날의 추억이 열려요.",
    mock: (
      <Mini>
        <svg width="100%" viewBox="0 0 140 80" shapeRendering="crispEdges" style={{ borderRadius: 8, display: "block" }}>
          <rect width="140" height="80" fill="#CDEBD8" />
          <path d="M60 0 L60 32 L98 32 L98 80" stroke="#F3E3CE" strokeWidth="15" fill="none" />
          <path d="M60 0 L60 32 L98 32 L98 80" stroke="#EAD0AE" strokeWidth="15" strokeDasharray="2 12" fill="none" />
          <g><rect x="14" y="18" width="14" height="14" fill="#A7D8B6" /><rect x="18" y="10" width="8" height="10" fill="#BCE6C8" /><rect x="20" y="32" width="3" height="5" fill="#C7A07A" /></g>
          <g transform="translate(44,8)"><rect width="20" height="20" fill="#fff" /><rect width="20" height="5" fill="#F4D6E6" /><rect x="4" y="8" width="12" height="9" fill="#BFE0F5" /><rect x="7" y="-6" width="6" height="6" fill="#E8799F" /></g>
          <g transform="translate(90,46)">
            <rect x="2" y="8" width="12" height="10" fill="#A8CFF0" /><rect x="4" y="2" width="8" height="7" fill="#FBE0CC" />
            <rect x="3" y="0" width="10" height="4" fill="#3F3B45" /><rect x="5" y="4" width="2" height="2" fill="#4A3A2E" /><rect x="9" y="4" width="2" height="2" fill="#4A3A2E" />
          </g>
          <g transform="translate(108,18)"><rect x="0" y="0" width="10" height="10" fill="#E8556F" opacity="0.9" /></g>
        </svg>
      </Mini>
    ),
  },
  {
    n: "03", route: "/us", icon: "home", title: "우리집 — 콘텐츠 허브",
    blurb: "모든 콘텐츠로 통하는 우리만의 방. 가구를 톡 누르면 화면이 열려요.",
    mock: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {tile("룰렛", "🎁")}{tile("편지함", "💌")}{tile("사주", "🔮")}
        {tile("유형테스트", "🃏")}{tile("포토부스", "📸")}{tile("업적", "🏆")}
      </div>
    ),
  },
  {
    n: "04", route: "/album", icon: "camera", title: "추억 앨범",
    blurb: "우리가 함께 걸어온 순간들을 모아봐요.",
    mock: (
      <Mini bg="#E6C7A0">
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {["#F2A3C0", "#9FC7E8", "#A8E0C8"].map((c, i) => (
            <div key={i} className="stagger" style={{ background: "#fff", padding: "4px 4px 10px", borderRadius: 3, transform: `rotate(${i * 6 - 6}deg)`, boxShadow: "0 2px 0 rgba(124,90,150,0.18)" }}>
              <div style={{ width: 34, height: 30, background: c, borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </Mini>
    ),
  },
  {
    n: "06", route: "/letters", icon: "letter", title: "편지함",
    blurb: "곳곳에 숨겨둔 편지들. 하나씩 열어보면 마음이 도착해요.",
    mock: (
      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        {["#E8799F", "#C9A7F0", "#9FC7E8"].map((c, i) => (
          <div key={i} className="stagger floaty" style={{ animationDelay: `${i * 0.3}s` }}>
            <div style={{ width: 44, height: 34, background: c, borderRadius: 4, position: "relative", boxShadow: "0 2px 0 rgba(124,90,150,0.18)" }}>
              <div style={{ position: "absolute", inset: 0, margin: "auto", width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: `17px solid rgba(255,255,255,0.55)` }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "07", route: "/together", icon: "clock", title: "함께한 시간",
    blurb: "처음 만난 날부터 오늘까지. 우리가 쌓아온 시간을 숫자로 확인해요.",
    mock: (
      <Mini>
        <div style={{ textAlign: "center" }}>
          <div className="stagger" style={{ fontSize: 11, color: "#8A7A85" }}>함께한 지</div>
          <div className="stagger" style={{ fontSize: 26, color: "#E8799F", fontWeight: 700, letterSpacing: 1 }}>D+1000 💗</div>
          <div className="stagger" style={{ fontSize: 10, color: "#A89AA3", marginTop: 2 }}>24,000 시간 · 1,440,000 분</div>
        </div>
      </Mini>
    ),
  },
  {
    n: "08", route: "/fortune", icon: "moon", title: "오늘의 운세",
    blurb: "오늘 우리에게 찾아올 작은 행운. 달과 별이 알려줘요.",
    mock: (
      <Mini bg="#2E3A66">
        <div style={{ textAlign: "center", padding: "4px 0" }}>
          <span className="stagger floaty" style={{ fontSize: 30 }}>🌙</span>
          <span className="stagger twinkle" style={{ fontSize: 14, margin: "0 6px" }}>⭐</span>
          <span className="stagger twinkle" style={{ fontSize: 11 }}>✨</span>
          <p className="stagger" style={{ margin: "6px 0 0", fontSize: 11, color: "#F2C76B" }}>오늘의 커플 운세 ★★★★☆</p>
        </div>
      </Mini>
    ),
  },
  {
    n: "09", route: "/saju", icon: "crystal", title: "사주 풀이",
    blurb: "우리 둘의 사주로 보는 인연. 수정구슬 속 이야기.",
    mock: (
      <Mini>
        <div style={{ textAlign: "center", padding: "2px 0" }}>
          <span className="stagger floaty" style={{ fontSize: 34 }}>🔮</span>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 4 }}>
            <span className="stagger chip" style={{ fontSize: 10 }}>천생연분</span>
            <span className="stagger chip" style={{ fontSize: 10 }}>궁합 98%</span>
          </div>
        </div>
      </Mini>
    ),
  },
  {
    n: "10", route: "/cards", icon: "cards", title: "커플 유형 테스트",
    blurb: "우리는 어떤 커플일까? 카드를 뽑아 우리만의 유형을 발견해요.",
    mock: (
      <Mini bg="#F3DCE7">
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {["💕", "🌟", "🍀"].map((e, i) => (
            <div key={i} className="stagger" style={{ width: 32, height: 44, background: "#fff", borderRadius: 5, border: "2px solid #E8799F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transform: `rotate(${i * 8 - 8}deg)`, boxShadow: "0 2px 0 rgba(124,90,150,0.18)" }}>{e}</div>
          ))}
        </div>
      </Mini>
    ),
  },
  {
    n: "11", route: "/kakao", icon: "chat", title: "카톡 대화 분석",
    blurb: "우리 대화 속 말투와 마음을 분석해주는 작은 리포트.",
    mock: (
      <Mini>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="stagger" style={{ alignSelf: "flex-start", background: "#fff", borderRadius: 8, padding: "3px 8px", fontSize: 10, color: "#6A5A66" }}>오늘도 사랑해 💗</span>
          <span className="stagger" style={{ alignSelf: "flex-end", background: "#FAE100", borderRadius: 8, padding: "3px 8px", fontSize: 10, color: "#3A1D1D" }}>나도 더 많이 ♥</span>
          <div className="stagger" style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 22, marginTop: 2, justifyContent: "center" }}>
            {[10, 16, 8, 20, 13].map((h, i) => <div key={i} style={{ width: 7, height: h, background: i % 2 ? "#9FC7E8" : "#E8799F", borderRadius: 2 }} />)}
          </div>
        </div>
      </Mini>
    ),
  },
  {
    n: "12", route: "/photobooth", icon: "camera", title: "포토부스",
    blurb: "픽셀 프레임으로 찰칵. 우리만의 네 컷 사진을 저장해요.",
    mock: (
      <Mini bg="#5A4A55">
        <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
          <span className="stagger" style={{ fontSize: 26 }}>📸</span>
          <div className="stagger" style={{ background: "#fff", padding: 3, borderRadius: 3 }}>
            {["#F4B8CC", "#BFE0F5", "#A8E0C8"].map((c, i) => <div key={i} style={{ width: 24, height: 12, background: c, marginBottom: i < 2 ? 2 : 0, borderRadius: 1 }} />)}
          </div>
        </div>
      </Mini>
    ),
  },
  {
    n: "13", route: "/games/roulette", icon: "gift", title: "소원권 룰렛",
    blurb: "모은 티켓으로 룰렛을 돌려요. 오늘의 소원은 무엇이 당첨될까?",
    mock: (
      <Mini>
        <div style={{ textAlign: "center" }}>
          <svg width="68" height="68" viewBox="0 0 68 68" className="stagger" style={{ display: "inline-block" }}>
            {["#E8799F", "#F2C76B", "#9FC7E8", "#A8E0C8", "#C9A7F0", "#F4B8CC"].map((c, i) => {
              const a0 = (i * 60 - 90) * Math.PI / 180, a1 = ((i + 1) * 60 - 90) * Math.PI / 180;
              return <path key={i} d={`M34 34 L${34 + 30 * Math.cos(a0)} ${34 + 30 * Math.sin(a0)} A30 30 0 0 1 ${34 + 30 * Math.cos(a1)} ${34 + 30 * Math.sin(a1)} Z`} fill={c} />;
            })}
            <circle cx="34" cy="34" r="7" fill="#fff" />
            <path d="M34 2 l5 9 h-10 z" fill="#B85C82" />
          </svg>
          <p className="stagger" style={{ margin: "4px 0 0", fontSize: 10, color: "#B85C82" }}>🎟 → 돌리기!</p>
        </div>
      </Mini>
    ),
  },
  {
    n: "14", route: "/games/quiz", icon: "bubble", title: "커플 퀴즈",
    blurb: "서로를 얼마나 알까? O/X로 풀어보는 우리만의 퀴즈.",
    mock: (
      <Mini bg="#2E2B33">
        <p className="stagger" style={{ margin: "0 0 6px", fontSize: 10, color: "#fff", textAlign: "center" }}>우리 첫 데이트 장소는?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <span className="stagger" style={{ width: 30, height: 30, borderRadius: "50%", background: "#E8799F", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>O</span>
          <span className="stagger" style={{ width: 30, height: 30, borderRadius: "50%", background: "#9FC7E8", color: "#244", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>X</span>
        </div>
      </Mini>
    ),
  },
  {
    n: "15", route: "/wishes", icon: "ticket", title: "소원권 보관함",
    blurb: "룰렛으로 얻은 소원권을 모아두는 곳. 언제든 꺼내 쓸 수 있어요.",
    mock: (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {["어깨 마사지 1회 🤍", "주말 영화 데이트 🎬", "디저트 사주기 🍰"].map((t, i) => (
          <div key={i} className="stagger" style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF7DE", border: "1px dashed #E0A94A", borderRadius: 8, padding: "6px 10px" }}>
            <PixelIcon name="ticket" size={16} />
            <span style={{ fontSize: 11, color: "#9A6B1A" }}>{t}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "16", route: "/achievements", icon: "trophy", title: "업적 도감",
    blurb: "20개의 업적을 모으는 컬렉션. 모두 채우면… 이 페이지가 열려요. 🔓",
    mock: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5 }}>
        {["🌱", "🐱", "💖", "📷", "🌸", "💌", "🔮", "🏆"].map((e, i) => (
          <div key={i} className="stagger" style={{ background: "var(--cream)", border: "2px solid #fff", boxShadow: "0 0 0 2px #CDB8E6", borderRadius: 8, padding: "7px 0", textAlign: "center", fontSize: 16 }}>{e}</div>
        ))}
      </div>
    ),
  },
];

export default function Showcase() {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "locked" | "open">("loading");
  const [got, setGot] = useState(0);
  const [totalAch, setTotalAch] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cine, setCine] = useState(false);
  const [giftMsg, setGiftMsg] = useState(false);
  const openGift = () => { try { window.open("https://soft-gingersnap-4e722e.netlify.app/", "_blank", "noopener,noreferrer"); } catch {} };
  const onGiftClick = () => {
    let seen = false;
    try { seen = !!localStorage.getItem("gift-seen"); } catch {}
    if (seen) { openGift(); return; }
    try { localStorage.setItem("gift-seen", "1"); } catch {}
    setGiftMsg(true);
  };
  const rootRef = useRef<HTMLDivElement>(null);

  // 잠금 판정: 모든 업적 달성 여부
  useEffect(() => {
    getProgress().then((p) => {
      const list = computeAchievements({ collected: p.collectedSpots, pieces: p.heartPieces, unlocks: getUnlocks(), flags: getFlags() });
      const done = list.filter((a) => a.unlocked).length;
      setGot(done); setTotalAch(list.length);
      setPhase(done === list.length && list.length > 0 ? "open" : "locked");
    });
  }, []);

  // 첫 방문이면 시네마틱 자동재생 (1회)
  useEffect(() => {
    if (phase !== "open") return;
    try { if (!localStorage.getItem("showcase-cine-seen")) setCine(true); } catch {}
  }, [phase]);

  const endCine = () => { setCine(false); try { localStorage.setItem("showcase-cine-seen", "1"); } catch {} };

  // 스크롤 등장 애니메이션 + 진행바
  useEffect(() => {
    if (phase !== "open") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));

    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [phase]);

  // 정성 스탯 숫자 카운트업 (화면에 들어올 때 0 → 목표값)
  useEffect(() => {
    if (phase !== "open") return;
    const nums = Array.from(document.querySelectorAll<HTMLElement>(".countup"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        const to = Number(el.dataset.to || "0");
        const pre = el.dataset.prefix || "";
        const t0 = performance.now(), dur = 1100;
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / dur);
          el.textContent = pre + Math.round((1 - Math.pow(1 - k, 3)) * to);
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    nums.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [phase]);

  if (phase === "loading") {
    return <main style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", color: "#B85C82", fontSize: 13 }}>불러오는 중…</main>;
  }

  if (phase === "locked") {
    const left = totalAch - got;
    return (
      <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 22px", textAlign: "center", maxWidth: 460, margin: "0 auto" }}>
        <div className="unlock-glow" style={{ width: 92, height: 92, borderRadius: "50%", background: "#E2DCE0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <PixelIcon name="lock" size={40} />
        </div>
        <h1 style={{ fontSize: 21, color: "#B85C82", marginBottom: 8 }}>아직 잠겨 있어요 🔒</h1>
        <p style={{ fontSize: 13, color: "#6A5A66", lineHeight: 1.8, margin: 0 }}>
          모든 업적을 모으면 우리의 모든 화면을<br />한 번에 둘러보는 쇼케이스가 열려요.
        </p>
        <div style={{ margin: "18px 0 6px", width: 220, maxWidth: "80%" }}>
          <div className="scroll-rail" style={{ height: 12, borderRadius: 6, overflow: "hidden" }}>
            <div className="scroll-fill" style={{ height: "100%", width: `${totalAch ? (got / totalAch) * 100 : 0}%` }} />
          </div>
          <p style={{ fontSize: 12, color: "#8A7A85", marginTop: 8 }}>{got} / {totalAch} 달성 · {left}개 남았어요</p>
        </div>
        <Link href="/achievements" className="btn-rose" style={{ marginTop: 16, textDecoration: "none", display: "inline-block" }}>업적 도감 보러가기 →</Link>
        <Link href="/us" style={{ marginTop: 14, fontSize: 12, color: "#A89AA3", textDecoration: "underline" }}>우리집으로 돌아가기</Link>
      </main>
    );
  }

  // ── 열림: 풀 쇼케이스 ──
  return (
    <main ref={rootRef} style={{ maxWidth: 460, margin: "0 auto", padding: "0 0 60px", position: "relative", overflowX: "clip" }}>
      {/* 인트로 시네마틱 (첫 방문 자동재생 / 다시보기) */}
      {cine && <CinematicOverlay onDone={endCine} />}

      {/* 배경에 은은히 떠다니는 장식 (클릭 통과) */}
      <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {BG.map((b, i) => (
          <span key={i} className={b.anim} style={{ position: "absolute", left: b.l, top: b.t, fontSize: b.s, opacity: b.o, animationDelay: b.d }}>{b.e}</span>
        ))}
      </div>

      {/* 상단 스크롤 진행바 */}
      <div className="scroll-rail" style={{ position: "sticky", top: 0, zIndex: 40, height: 5, width: "100%" }}>
        <div className="scroll-fill" style={{ height: "100%", width: `${progress * 100}%` }} />
      </div>

      <div style={{ padding: "0 16px", position: "relative", zIndex: 1 }}>
        <Link href="/us" style={{ display: "inline-block", marginTop: 14, color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리집</Link>

        {/* 히어로 */}
        <section style={{ position: "relative", textAlign: "center", padding: "26px 0 18px", overflow: "hidden" }}>
          <span className="drift" style={{ position: "absolute", left: "12%", top: 10, fontSize: 18, opacity: 0.7 }}>💗</span>
          <span className="drift" style={{ position: "absolute", right: "14%", top: 28, fontSize: 14, opacity: 0.6, animationDelay: "1.4s" }}>✨</span>
          <span className="drift" style={{ position: "absolute", left: "20%", bottom: 6, fontSize: 13, opacity: 0.5, animationDelay: "2.6s" }}>⭐</span>
          <div className="sparkle" style={{ fontSize: 11, letterSpacing: 2, color: "#B85C82" }}>OUR LITTLE WORLD · ALL SCREENS</div>
          <h1 style={{ fontSize: 24, color: "#B85C82", margin: "8px 0 4px", lineHeight: 1.4 }}>한눈에 보는 우리의 1000일 🎞️</h1>
          <p style={{ fontSize: 12, color: "#8A7A85", margin: 0 }}>스크롤하면 모든 화면이 하나씩 펼쳐져요</p>
          <button onClick={() => setCine(true)} className="chip" style={{ cursor: "pointer", border: "none", marginTop: 12, fontSize: 11 }}>🎬 인트로 영상 다시보기</button>
          <div className="floaty" style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <CharacterReaction mood="happy" who="boy" size={92} />
            <span style={{ marginLeft: -22 }}><CharacterReaction mood="excited" who="girl" size={92} /></span>
          </div>
          <div className="floaty" style={{ marginTop: 6, fontSize: 18, color: "#C9A0B4" }}>⌄</div>
        </section>

        {/* 화면 카드들 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {SCREENS.map((s, i) => (
            <button
              key={s.route + s.n}
              onClick={() => router.push(s.route)}
              className={`reveal ${i % 2 === 0 ? "from-left" : "from-right"}`}
              style={{
                textAlign: "left", border: "3px solid #fff", background: "#FBF3F8",
                boxShadow: "0 0 0 3px var(--lav), 4px 6px 0 rgba(124,90,150,0.22)",
                borderRadius: 16, padding: 14, cursor: "pointer", width: "100%",
              }}
            >
              <div className="stagger" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <span className="num-badge" style={{ background: "var(--rose)", color: "#fff", borderRadius: 999, minWidth: 26, height: 22, padding: "0 8px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, boxShadow: "0 2px 0 rgba(124,90,150,0.25)" }}>{String(i + 1).padStart(2, "0")}</span>
                <PixelIcon name={s.icon} size={18} />
                <span style={{ fontSize: 14, color: "#B85C82", fontWeight: 700 }}>{s.title}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#C9A0B4" }}>→</span>
              </div>
              <div className="stagger">{s.mock}</div>
              <p className="stagger" style={{ margin: "9px 0 0", fontSize: 11, color: "#8A7A85", lineHeight: 1.6 }}>{s.blurb}</p>
            </button>
          ))}
        </div>

        {/* D-day 미니 타임라인 */}
        <section className="reveal" style={{ marginTop: 22, border: "3px solid #fff", background: "#FBF3F8", boxShadow: "0 0 0 3px var(--lav), 4px 6px 0 rgba(124,90,150,0.22)", borderRadius: 16, padding: "16px 18px 14px" }}>
          <div className="stagger" style={{ fontSize: 12.5, color: "#B85C82", fontWeight: 700, textAlign: "center", marginBottom: 18 }}>우리가 걸어온 1000일 🐾</div>
          <div className="stagger" style={{ position: "relative", height: 26, margin: "0 6px" }}>
            <div style={{ position: "absolute", top: 11, left: 0, right: 0, height: 4, borderRadius: 2, background: "#E7D7E4" }} />
            <div className="trail-fill" style={{ position: "absolute", top: 11, left: 0, width: "100%", height: 4, borderRadius: 2, background: "linear-gradient(90deg, var(--rose), var(--lav))" }}>
              <span style={{ position: "absolute", right: -9, top: -13, fontSize: 17 }}>💗</span>
            </div>
            {MILES.map((m) => (
              <div key={m.label} style={{ position: "absolute", left: `${m.pct}%`, top: 7, transform: "translateX(-50%)", width: 11, height: 11, borderRadius: "50%", background: "#fff", border: "3px solid var(--rose)", boxSizing: "border-box" }} />
            ))}
          </div>
          <div style={{ position: "relative", height: 16, margin: "6px 6px 0" }}>
            {MILES.map((m) => (
              <span key={m.label} className="stagger" style={{ position: "absolute", left: `${m.pct}%`, transform: `translateX(${m.pct === 0 ? "0" : m.pct === 100 ? "-100%" : "-50%"})`, fontSize: 9, color: "#A89AA3", whiteSpace: "nowrap" }}>{m.label}</span>
            ))}
          </div>
        </section>

        {/* 크레딧 (편집용 플레이스홀더) */}
        <section className="reveal" style={{ marginTop: 22, border: "3px solid #fff", background: "#FBF3F8", boxShadow: "0 0 0 3px var(--lav), 4px 6px 0 rgba(124,90,150,0.22)", borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
          <div className="stagger" style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <GirlAtComputer size={112} />
          </div>
          <div className="stagger" style={{ fontSize: 14, color: "#B85C82", fontWeight: 700 }}>{CREDIT.title}</div>
          <div className="stagger" style={{ fontSize: 11.5, color: "#8A7A85", lineHeight: 1.8, marginTop: 7 }}>
            {CREDIT.lines.map((l, i) => <div key={i}>{l}</div>)}
          </div>

          {/* 정성 스탯 (카운트업) */}
          <div className="stagger" style={{ fontSize: 10.5, color: "#B85C82", marginTop: 16 }}>이만큼의 마음을 담았어요 💗</div>
          <div className="stagger" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px 16px", marginTop: 10 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: "center", minWidth: 44 }}>
                <div className="countup" data-to={s.to} data-prefix={s.prefix || ""} style={{ fontSize: 19, color: "#E8799F", fontWeight: 700, lineHeight: 1.1 }}>{s.prefix || ""}0</div>
                <div style={{ fontSize: 9, color: "#A89AA3", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="stagger" style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap", marginTop: 16, paddingTop: 14, borderTop: "1px dashed #E7D7E4" }}>
            {CREDIT.stack.map((t) => (
              <span key={t} className="chip" style={{ fontSize: 10 }}>{t}</span>
            ))}
          </div>
          <div className="stagger" style={{ fontFamily: "monospace", fontSize: 10, color: "#9A8A95", letterSpacing: 0.5, marginTop: 12 }}>{CREDIT.version}</div>
        </section>

        {/* 엔딩 */}
        <section className="reveal" style={{ textAlign: "center", marginTop: 22, padding: "10px 0" }}>
          <div className="stagger sparkle" style={{ fontSize: 30 }}>💖</div>
          <p className="stagger" style={{ fontSize: 13, color: "#B85C82", margin: "8px 0 2px", fontWeight: 700 }}>여기까지가 우리의 1000일.</p>
          <p className="stagger" style={{ fontSize: 11, color: "#A89AA3", margin: 0 }}>그리고 앞으로의 날들도, 계속 ♥</p>
        </section>

        {/* 숨은 깜짝선물 — 끝까지 온 사람에게만 (살짝 숨긴 🎁 → 첫 클릭 시 메시지 1회) */}
        <section className="reveal" style={{ textAlign: "center", marginTop: 16, padding: "4px 0 8px" }}>
          {!giftMsg ? (
            <button onClick={onGiftClick} aria-label="깜짝선물"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, opacity: 0.85, padding: 6, lineHeight: 1 }}>
              🎁
            </button>
          ) : (
            <div className="reveal">
              <p style={{ fontSize: 12.5, color: "#B85C82", fontWeight: 700, margin: "0 0 10px" }}>이건 그냥 내 깜짝선물! 🎁</p>
              <button onClick={() => { setGiftMsg(false); openGift(); }}
                style={{ padding: "8px 18px", borderRadius: 12, cursor: "pointer",
                  background: "var(--cream)", border: "1px dashed #E7D7E4", color: "#B85C82", fontSize: 12, fontWeight: 700 }}>
                열어보기 →
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
