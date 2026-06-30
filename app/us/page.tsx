"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CharacterReaction from "@/components/CharacterReaction";
import PixelIcon from "@/components/PixelIcon";
import { Mood } from "@/lib/pixelArt";

const LINES = [
  "오늘도 사랑해 💕", "여기가 우리집이야~", "뭐 하고 놀까?",
  "같이 있어서 좋아 ♥", "심심해, 놀자!", "너가 최고야!",
  "안아줘 🤗", "보고 있어도 보고 싶어",
];
const MOODS: Mood[] = ["happy", "excited"];

// 둥실둥실 떠 있는 구름 모양 이름표 (시안 A 톤 + 구름 실루엣 + bob 애니메이션)
function CloudLabel({ cx, cy, hw, label, fs = 9.5, delay = 0 }: {
  cx: number; cy: number; hw: number; label: string; fs?: number; delay?: number;
}) {
  const ry = 8;
  const puffs = (dr: number) => (
    <>
      <ellipse cx={cx} cy={cy} rx={hw + dr} ry={ry + dr} />
      <circle cx={cx - hw * 0.52} cy={cy} r={ry * 0.8 + dr} />
      <circle cx={cx + hw * 0.52} cy={cy} r={ry * 0.8 + dr} />
      <circle cx={cx - hw * 0.26} cy={cy - ry * 0.7} r={ry * 0.95 + dr} />
      <circle cx={cx + hw * 0.26} cy={cy - ry * 0.6} r={ry * 0.8 + dr} />
    </>
  );
  return (
    <g style={{ pointerEvents: "none" }}>
      {/* 바닥 그림자 (떠 있는 느낌) — bob 하지 않고 고정 */}
      <ellipse cx={cx} cy={cy + ry + 4} rx={hw * 0.82} ry={3} fill="rgba(110,80,110,0.13)" />
      <g className="cloud-lbl" style={{ animationDelay: `${delay}s` }}>
        <g fill="#E2B2CB">{puffs(2)}</g>
        <g fill="#FFFDF8">{puffs(0)}</g>
        <text x={cx} y={cy + fs * 0.35} textAnchor="middle" fontSize={fs} fill="#B85C82" fontWeight={700}>{label}</text>
      </g>
    </g>
  );
}

export default function UsHub() {
  const router = useRouter();
  const go = (href: string) => () => router.push(href);
  const [line, setLine] = useState(0);
  const [mood, setMood] = useState(0);
  const poke = () => { setLine((l) => (l + 1) % LINES.length); setMood((m) => (m + 1) % MOODS.length); };

  return (
    <main style={{ maxWidth: 440, margin: "0 auto", padding: "12px 12px 24px", minHeight: "100dvh" }}>
      <button onClick={go("/map")} style={{ color: "#B85C82", fontSize: 13, background: "none", border: "none", fontFamily: "var(--font-pixel)" }}>← 맵으로</button>
      <h1 style={{ fontSize: 19, color: "#B85C82", textAlign: "center", margin: "4px 0 2px" }}>우리집 <PixelIcon name="home" size={17} /></h1>
      <p style={{ fontSize: 11, color: "#8A7A85", textAlign: "center", margin: "0 0 8px" }}>반짝이는 가구를 톡 눌러보세요</p>

      <div style={{ position: "relative" }}>
        <svg width="100%" viewBox="0 0 380 680" role="img" shapeRendering="crispEdges"
          style={{ display: "block", borderRadius: 16, border: "3px solid #fff", boxShadow: "0 0 0 3px var(--lav)" }}>
          <title>우리집 — 콘텐츠 허브</title>
          <style>{`
            text{font-family:'Galmuri11','Galmuri14',monospace}
            .hot{cursor:pointer}
            .hot:hover .obj{opacity:.85}
            .ring{fill:none;stroke:#F2C76B;stroke-width:2;stroke-dasharray:5 6;stroke-linecap:round;animation:ring 1.5s linear infinite}
            @keyframes ring{0%{stroke-dashoffset:0;opacity:.4}50%{opacity:1}100%{stroke-dashoffset:-22;opacity:.4}}
            .cloud-lbl{animation:us-bob 3s ease-in-out infinite}
            @keyframes us-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
          `}</style>

          {/* 방 구조 */}
          <rect x="0" y="0" width="380" height="300" fill="#F3DCE7" />
          <rect x="0" y="300" width="380" height="380" fill="#E6C7A0" />
          <rect x="0" y="296" width="380" height="6" fill="#D6B488" />
          <rect x="0" y="92" width="380" height="3" fill="#EAD0DC" />
          <g opacity="0.4" stroke="#D6B488" strokeWidth="1">
            <line x1="0" y1="340" x2="380" y2="340" /><line x1="0" y1="392" x2="380" y2="392" /><line x1="0" y1="452" x2="380" y2="452" />
          </g>
          <ellipse cx="190" cy="548" rx="156" ry="56" fill="#EFC9DC" />
          <ellipse cx="190" cy="548" rx="156" ry="56" fill="none" stroke="#E2B2CB" strokeWidth="3" />

          {/* 운세 */}
          <g className="hot" onClick={go("/fortune")}>
            <g className="obj">
              <rect x="20" y="26" width="56" height="56" fill="#1E2742" /><rect x="24" y="30" width="48" height="48" fill="#2E3A66" />
              <rect x="46" y="30" width="4" height="48" fill="#1E2742" /><rect x="24" y="52" width="48" height="4" fill="#1E2742" />
              <rect x="56" y="36" width="12" height="12" fill="#F2C76B" /><rect x="54" y="38" width="7" height="9" fill="#2E3A66" />
              <rect x="30" y="38" width="3" height="3" fill="#fff" /><rect x="38" y="62" width="3" height="3" fill="#fff" /><rect x="60" y="64" width="3" height="3" fill="#fff" />
              <rect x="16" y="22" width="64" height="64" fill="none" stroke="#fff" strokeWidth="4" />
            </g>
            <rect className="ring" x="12" y="18" width="72" height="72" rx="8" />
          </g>

          {/* 함께한 시간 */}
          <g className="hot" onClick={go("/together")}>
            <g className="obj">
              <rect x="100" y="30" width="40" height="40" fill="#fff" stroke="#E8799F" strokeWidth="3" /><rect x="100" y="30" width="40" height="11" fill="#E8799F" />
              <rect x="106" y="46" width="6" height="6" fill="#F4B8CC" /><rect x="116" y="46" width="6" height="6" fill="#F4B8CC" /><rect x="126" y="46" width="6" height="6" fill="#E8556F" />
              <rect x="106" y="56" width="6" height="6" fill="#F4B8CC" />
            </g>
            <rect className="ring" x="94" y="24" width="52" height="52" rx="8" />
          </g>

          {/* 업적 */}
          <g className="hot" onClick={go("/achievements")}>
            <g className="obj">
              <rect x="164" y="32" width="36" height="34" fill="#FBE6A8" stroke="#E0A94A" strokeWidth="3" />
              <circle cx="182" cy="46" r="8" fill="#F2C76B" stroke="#E0A94A" strokeWidth="2" /><rect x="178" y="54" width="3" height="7" fill="#E8556F" /><rect x="183" y="54" width="3" height="7" fill="#9FC7E8" />
            </g>
            <rect className="ring" x="158" y="26" width="48" height="46" rx="8" />
          </g>

          {/* 편지함 */}
          <g className="hot" onClick={go("/letters")}>
            <g className="obj">
              <rect x="224" y="34" width="32" height="26" fill="#E8799F" /><rect x="224" y="34" width="32" height="8" fill="#D9719A" />
              <rect x="230" y="44" width="20" height="13" fill="#fff" /><path d="M230 44l10 6 10-6" fill="none" stroke="#F4B8CC" strokeWidth="2" />
              <rect x="238" y="60" width="4" height="10" fill="#B8915F" />
            </g>
            <rect className="ring" x="218" y="28" width="44" height="48" rx="8" />
          </g>

          {/* 소원권 */}
          <g className="hot" onClick={go("/wishes")}>
            <g className="obj">
              <rect x="282" y="74" width="72" height="6" fill="#C7A07A" />
              <rect x="300" y="46" width="34" height="28" rx="4" fill="#BFE0F5" opacity="0.85" />
              <rect x="305" y="50" width="9" height="6" fill="#F2C76B" /><rect x="318" y="54" width="9" height="6" fill="#F8C9DC" /><rect x="308" y="60" width="9" height="6" fill="#A8E0C8" />
              <rect x="298" y="44" width="38" height="4" fill="#9FC7E8" />
            </g>
            <rect className="ring" x="296" y="40" width="44" height="40" rx="8" />
          </g>

          {/* 추억 앨범 */}
          <g className="hot" onClick={go("/album")}>
            <g className="obj">
              <rect x="12" y="152" width="72" height="146" fill="#B98A5E" />
              <rect x="16" y="156" width="64" height="40" fill="#8A6242" /><rect x="16" y="200" width="64" height="40" fill="#8A6242" /><rect x="16" y="244" width="64" height="50" fill="#8A6242" />
              <rect x="20" y="160" width="9" height="32" fill="#E8799F" /><rect x="30" y="160" width="9" height="32" fill="#9FC7E8" /><rect x="41" y="162" width="9" height="30" fill="#F2C76B" /><rect x="52" y="160" width="9" height="32" fill="#A8E0C8" /><rect x="63" y="164" width="9" height="28" fill="#C9A7F0" />
              <rect x="22" y="206" width="9" height="28" fill="#C9A7F0" /><rect x="33" y="204" width="9" height="30" fill="#E8799F" /><rect x="44" y="206" width="9" height="28" fill="#9FC7E8" /><rect x="55" y="208" width="9" height="26" fill="#F2C76B" />
              <rect x="26" y="252" width="44" height="36" fill="#fff" /><rect x="26" y="252" width="44" height="7" fill="#F4D6E6" /><rect x="32" y="263" width="32" height="20" fill="#BFE0F5" /><path d="M48 283c0-6-9-7-9 0 0 5 9 10 9 10s9-5 9-10c0-7-9-6-9 0Z" fill="#F2A3C0" />
            </g>
            <rect className="ring" x="8" y="148" width="80" height="154" rx="8" />
          </g>

          {/* 미디어장 */}
          <g>
            <rect x="100" y="250" width="130" height="48" fill="#C49A6E" /><rect x="100" y="250" width="130" height="6" fill="#B0865A" />
            <rect x="108" y="276" width="6" height="22" fill="#A87C50" /><rect x="216" y="276" width="6" height="22" fill="#A87C50" />
          </g>
          {/* 포토부스 */}
          <g className="hot" onClick={go("/photobooth")}>
            <g className="obj">
              <rect x="196" y="224" width="34" height="22" rx="3" fill="#5A4A55" /><rect x="200" y="228" width="22" height="14" rx="2" fill="#BFE0F5" /><circle cx="211" cy="235" r="6" fill="#fff" /><rect x="223" y="221" width="6" height="4" fill="#F2C76B" />
            </g>
            <rect className="ring" x="192" y="218" width="42" height="32" rx="8" />
          </g>

          {/* 코너 책상 */}
          <g>
            <rect x="250" y="248" width="116" height="14" fill="#C49A6E" /><rect x="250" y="248" width="116" height="5" fill="#B0865A" />
            <rect x="256" y="262" width="7" height="36" fill="#A87C50" /><rect x="354" y="262" width="7" height="36" fill="#A87C50" />
          </g>
          {/* 사주 */}
          <g className="hot" onClick={go("/saju")}>
            <g className="obj">
              <circle cx="276" cy="234" r="14" fill="#C9A7F0" /><circle cx="271" cy="229" r="4" fill="#fff" /><rect x="268" y="246" width="16" height="4" fill="#F2C76B" />
            </g>
            <rect className="ring" x="258" y="216" width="36" height="36" rx="8" />
          </g>
          {/* 카드 */}
          <g className="hot" onClick={go("/cards")}>
            <g className="obj">
              <rect x="302" y="232" width="14" height="18" rx="2" fill="#fff" stroke="#E8799F" strokeWidth="2" transform="rotate(-10 309 241)" />
              <rect x="312" y="230" width="14" height="18" rx="2" fill="#fff" stroke="#9FC7E8" strokeWidth="2" transform="rotate(8 319 239)" />
            </g>
            <rect className="ring" x="298" y="224" width="32" height="30" rx="8" />
          </g>
          {/* 카톡 분석 */}
          <g className="hot" onClick={go("/kakao")}>
            <g className="obj">
              <rect x="334" y="228" width="30" height="20" fill="#5A4A55" /><rect x="337" y="231" width="24" height="14" fill="#BFE0F5" />
              <rect x="340" y="234" width="12" height="3" fill="#E8799F" /><rect x="340" y="239" width="16" height="3" fill="#9FC7E8" />
              <rect x="330" y="248" width="38" height="3" fill="#A87C50" />
            </g>
            <rect className="ring" x="330" y="224" width="38" height="30" rx="8" />
          </g>

          {/* 룰렛 */}
          <g className="hot" onClick={go("/games/roulette")}>
            <g className="obj">
              <rect x="34" y="546" width="46" height="78" fill="#E8556F" /><rect x="34" y="546" width="46" height="78" fill="none" stroke="#C73A57" strokeWidth="2" />
              <circle cx="57" cy="568" r="16" fill="#FBF3F8" />
              <rect x="49" y="564" width="6" height="6" fill="#F2C76B" /><rect x="58" y="570" width="6" height="6" fill="#9FC7E8" /><rect x="53" y="560" width="6" height="6" fill="#C9A7F0" /><rect x="60" y="562" width="6" height="6" fill="#A8E0C8" />
              <rect x="44" y="594" width="26" height="16" fill="#fff" /><rect x="50" y="598" width="14" height="9" fill="#F4D6E6" />
            </g>
            <rect className="ring" x="30" y="542" width="54" height="86" rx="8" />
          </g>

          {/* 퀴즈 */}
          <g className="hot" onClick={go("/games/quiz")}>
            <g className="obj">
              <rect x="300" y="546" width="46" height="78" fill="#7E6CC4" /><rect x="300" y="546" width="46" height="78" fill="none" stroke="#5E4FA0" strokeWidth="2" />
              <rect x="306" y="554" width="34" height="26" fill="#2E2B33" /><rect x="312" y="560" width="9" height="7" fill="#F2C76B" /><rect x="326" y="564" width="9" height="7" fill="#9FC7E8" />
              <rect x="308" y="586" width="30" height="9" fill="#C9A7F0" /><circle cx="317" cy="606" r="5" fill="#E8799F" /><circle cx="332" cy="606" r="5" fill="#9FC7E8" />
            </g>
            <rect className="ring" x="296" y="542" width="54" height="86" rx="8" />
          </g>

          {/* 가구 이름표 — 둥실둥실 구름 태그 */}
          <CloudLabel cx={48} cy={105} hw={20} label="운세" delay={0} />
          <CloudLabel cx={120} cy={105} hw={37} label="함께한 시간" fs={9} delay={0.5} />
          <CloudLabel cx={182} cy={105} hw={20} label="업적" delay={1.0} />
          <CloudLabel cx={240} cy={105} hw={27} label="편지함" delay={1.5} />
          <CloudLabel cx={318} cy={105} hw={27} label="소원권" delay={0.8} />
          <CloudLabel cx={48} cy={312} hw={34} label="추억 앨범" fs={9} delay={0.3} />
          <CloudLabel cx={213} cy={305} hw={27} label="포토부스" fs={8.5} delay={1.2} />
          <CloudLabel cx={276} cy={322} hw={17} label="사주" fs={8.5} delay={0.6} />
          <CloudLabel cx={314} cy={305} hw={17} label="유형" fs={8.5} delay={1.7} />
          <CloudLabel cx={349} cy={322} hw={17} label="카톡" fs={8.5} delay={0.2} />
          <CloudLabel cx={57} cy={642} hw={20} label="룰렛" fs={10} delay={0.9} />
          <CloudLabel cx={323} cy={642} hw={20} label="퀴즈" fs={10} delay={1.4} />
        </svg>

        {/* ===== 가운데 커플 (크게 + 표정 + 말풍선) — SVG 위 HTML 오버레이 ===== */}
        {/* 정렬용 래퍼(translate로 중앙 고정)와 흔들림 애니메이션 래퍼를 분리.
            .floaty의 keyframes transform이 인라인 translate(-50%,-50%)를 덮어쓰지 않도록 함 */}
        {/* 위치용 래퍼는 클릭 통과(pointerEvents:none), 캐릭터 본체만 클릭 가능하게 해서
            주변 가구가 잘못 눌리지 않도록 함 */}
        <div style={{ position: "absolute", left: "50%", top: "70%", transform: "translate(-50%,-50%)", textAlign: "center", width: "100%", pointerEvents: "none" }}>
          <div className="floaty" onClick={poke} style={{ display: "inline-block", cursor: "pointer", pointerEvents: "auto" }}>
          <div style={{
            display: "inline-block", background: "#fff", border: "2px solid #E2B2CB", borderRadius: 12,
            padding: "6px 14px", fontSize: 13, color: "#B85C82", fontFamily: "var(--font-pixel)",
            boxShadow: "0 3px 0 rgba(124,90,150,0.18)", position: "relative", marginBottom: 4,
          }}>
            {LINES[line]}
            <span style={{ position: "absolute", left: "50%", bottom: -8, transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "8px solid #E2B2CB" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
            <CharacterReaction mood={MOODS[mood]} who="boy" size={140} />
            <span style={{ marginLeft: -32 }}><CharacterReaction mood={MOODS[mood]} who="girl" size={140} /></span>
          </div>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 10.5, color: "#A89AA3", textAlign: "center", marginTop: 8 }}>가운데 커플을 톡 누르면 말을 걸어요 💬</p>
    </main>
  );
}
