"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const POSES = ["같이 앉아있기", "꼭 껴안기", "나란히 눕기", "새근새근 자기"];

export default function UsHub() {
  const router = useRouter();
  const go = (href: string) => () => router.push(href);
  const [pose, setPose] = useState(0);
  const cyclePose = () => setPose((p) => (p + 1) % POSES.length);

  return (
    <main style={{ maxWidth: 440, margin: "0 auto", padding: "12px 12px 28px", minHeight: "100dvh" }}>
      <button onClick={go("/map")} style={{ color: "#B85C82", fontSize: 13, background: "none", border: "none", fontFamily: "var(--font-pixel)" }}>← 맵으로</button>
      <h1 style={{ fontSize: 19, color: "#B85C82", textAlign: "center", margin: "4px 0 2px" }}>우리집 🏡</h1>
      <p style={{ fontSize: 11, color: "#8A7A85", textAlign: "center", margin: "0 0 8px" }}>가구를 톡 누르면 그 콘텐츠로 가요</p>

      <svg width="100%" viewBox="0 0 380 540" role="img" shapeRendering="crispEdges"
        style={{ display: "block", borderRadius: 16, border: "3px solid #fff", boxShadow: "0 0 0 3px var(--lav)" }}>
        <title>우리집 — 콘텐츠 허브</title>
        <style>{`
          text{font-family:'Galmuri11','Galmuri14',monospace;fill:#6E5462}
          .hot{cursor:pointer}
          .hot:hover .obj{opacity:.85}
          .hot:active{transform:translateY(1px)}
          .lbl{text-anchor:middle;font-size:9px;fill:#8A6E7C}
        `}</style>

        {/* ===== 방 구조 ===== */}
        <rect x="0" y="0" width="380" height="300" fill="#F3DCE7" />
        <rect x="0" y="300" width="380" height="240" fill="#E6C7A0" />
        <rect x="0" y="296" width="380" height="6" fill="#D6B488" />
        {/* 벽 몰딩 */}
        <rect x="0" y="92" width="380" height="3" fill="#EAD0DC" />
        {/* 바닥 결 */}
        <g opacity="0.4" stroke="#D6B488" strokeWidth="1">
          <line x1="0" y1="340" x2="380" y2="340" /><line x1="0" y1="392" x2="380" y2="392" /><line x1="0" y1="448" x2="380" y2="448" />
        </g>
        {/* 러그 */}
        <ellipse cx="190" cy="452" rx="150" ry="56" fill="#EFC9DC" />
        <ellipse cx="190" cy="452" rx="150" ry="56" fill="none" stroke="#E2B2CB" strokeWidth="3" />

        {/* ===== 벽: 창문(운세) ===== */}
        <g className="hot" onClick={go("/fortune")}>
          <rect x="16" y="22" width="64" height="68" fill="transparent" />
          <g className="obj">
            <rect x="20" y="26" width="56" height="56" fill="#1E2742" /><rect x="24" y="30" width="48" height="48" fill="#2E3A66" />
            <rect x="46" y="30" width="4" height="48" fill="#1E2742" /><rect x="24" y="52" width="48" height="4" fill="#1E2742" />
            <rect x="56" y="36" width="12" height="12" fill="#F2C76B" /><rect x="54" y="38" width="7" height="9" fill="#2E3A66" />
            <rect x="30" y="38" width="3" height="3" fill="#fff" /><rect x="38" y="62" width="3" height="3" fill="#fff" /><rect x="60" y="64" width="3" height="3" fill="#fff" />
            <rect x="16" y="22" width="64" height="68" fill="none" stroke="#fff" strokeWidth="4" />
          </g>
          <text className="lbl" x="48" y="100">운세</text>
        </g>

        {/* 벽: 달력(함께한 시간) */}
        <g className="hot" onClick={go("/together")}>
          <rect x="96" y="26" width="48" height="62" fill="transparent" />
          <g className="obj">
            <rect x="100" y="30" width="40" height="40" fill="#fff" stroke="#E8799F" strokeWidth="3" /><rect x="100" y="30" width="40" height="11" fill="#E8799F" />
            <rect x="106" y="46" width="6" height="6" fill="#F4B8CC" /><rect x="116" y="46" width="6" height="6" fill="#F4B8CC" /><rect x="126" y="46" width="6" height="6" fill="#E8556F" />
            <rect x="106" y="56" width="6" height="6" fill="#F4B8CC" />
          </g>
          <text className="lbl" x="120" y="84">함께한 시간</text>
        </g>

        {/* 벽: 메달 액자(업적) */}
        <g className="hot" onClick={go("/achievements")}>
          <rect x="160" y="28" width="44" height="58" fill="transparent" />
          <g className="obj">
            <rect x="164" y="32" width="36" height="34" fill="#FBE6A8" stroke="#E0A94A" strokeWidth="3" />
            <circle cx="182" cy="46" r="8" fill="#F2C76B" stroke="#E0A94A" strokeWidth="2" /><rect x="178" y="54" width="3" height="7" fill="#E8556F" /><rect x="183" y="54" width="3" height="7" fill="#9FC7E8" />
          </g>
          <text className="lbl" x="182" y="80">업적</text>
        </g>

        {/* 벽: 우편함(편지함) */}
        <g className="hot" onClick={go("/letters")}>
          <rect x="216" y="30" width="46" height="58" fill="transparent" />
          <g className="obj">
            <rect x="224" y="34" width="32" height="26" fill="#E8799F" /><rect x="224" y="34" width="32" height="8" fill="#D9719A" />
            <rect x="230" y="44" width="20" height="13" fill="#fff" /><path d="M230 44l10 6 10-6" fill="none" stroke="#F4B8CC" strokeWidth="2" />
            <rect x="238" y="60" width="4" height="8" fill="#B8915F" />
          </g>
          <text className="lbl" x="240" y="82">편지함</text>
        </g>

        {/* 벽 선반 + 소원권 항아리 */}
        <g className="hot" onClick={go("/wishes")}>
          <rect x="280" y="36" width="76" height="56" fill="transparent" />
          <g className="obj">
            <rect x="282" y="76" width="72" height="6" fill="#C7A07A" />
            <rect x="300" y="48" width="34" height="28" rx="4" fill="#BFE0F5" opacity="0.85" />
            <rect x="305" y="52" width="9" height="6" fill="#F2C76B" /><rect x="318" y="56" width="9" height="6" fill="#F8C9DC" /><rect x="308" y="62" width="9" height="6" fill="#A8E0C8" />
            <rect x="298" y="46" width="38" height="4" fill="#9FC7E8" />
          </g>
          <text className="lbl" x="317" y="92">소원권함</text>
        </g>

        {/* ===== 왼쪽 책장(추억 앨범) ===== */}
        <g className="hot" onClick={go("/album")}>
          <rect x="10" y="150" width="76" height="150" fill="transparent" />
          <g className="obj">
            <rect x="12" y="152" width="72" height="146" fill="#B98A5E" />
            <rect x="16" y="156" width="64" height="40" fill="#8A6242" /><rect x="16" y="200" width="64" height="40" fill="#8A6242" /><rect x="16" y="244" width="64" height="50" fill="#8A6242" />
            <rect x="20" y="160" width="9" height="32" fill="#E8799F" /><rect x="30" y="160" width="9" height="32" fill="#9FC7E8" /><rect x="41" y="162" width="9" height="30" fill="#F2C76B" /><rect x="52" y="160" width="9" height="32" fill="#A8E0C8" /><rect x="63" y="164" width="9" height="28" fill="#C9A7F0" />
            <rect x="22" y="206" width="9" height="28" fill="#C9A7F0" /><rect x="33" y="204" width="9" height="30" fill="#E8799F" /><rect x="44" y="206" width="9" height="28" fill="#9FC7E8" /><rect x="55" y="208" width="9" height="26" fill="#F2C76B" />
            <rect x="26" y="252" width="44" height="36" fill="#fff" /><rect x="26" y="252" width="44" height="7" fill="#F4D6E6" /><rect x="32" y="263" width="32" height="20" fill="#BFE0F5" /><path d="M48 283c0-6-9-7-9 0 0 5 9 10 9 10s9-5 9-10c0-7-9-6-9 0Z" fill="#F2A3C0" />
          </g>
          <text className="lbl" x="48" y="296" fill="#fff">추억 앨범</text>
        </g>

        {/* ===== 가운데 미디어장 (TV=슬라이드쇼, 카메라=포토부스) ===== */}
        <g>
          <rect x="100" y="250" width="130" height="48" fill="#C49A6E" /><rect x="100" y="250" width="130" height="6" fill="#B0865A" />
          <rect x="108" y="276" width="6" height="22" fill="#A87C50" /><rect x="216" y="276" width="6" height="22" fill="#A87C50" />
        </g>
        <g className="hot" onClick={go("/slideshow")}>
          <rect x="104" y="200" width="84" height="54" fill="transparent" />
          <g className="obj">
            <rect x="110" y="204" width="72" height="46" fill="#3F3B45" /><rect x="116" y="210" width="60" height="34" fill="#9FC7E8" />
            <path d="M146 227c0-5-8-6-8 0 0 4 8 9 8 9s8-5 8-9c0-6-8-5-8 0Z" fill="#fff" />
          </g>
          <text className="lbl" x="146" y="268" fill="#fff">슬라이드쇼</text>
        </g>
        <g className="hot" onClick={go("/photobooth")}>
          <rect x="190" y="218" width="44" height="34" fill="transparent" />
          <g className="obj">
            <rect x="196" y="224" width="34" height="22" rx="3" fill="#5A4A55" /><rect x="200" y="228" width="22" height="14" rx="2" fill="#BFE0F5" /><circle cx="211" cy="235" r="6" fill="#fff" /><rect x="223" y="221" width="6" height="4" fill="#F2C76B" />
          </g>
          <text className="lbl" x="212" y="268" fill="#fff">포토부스</text>
        </g>

        {/* ===== 오른쪽 코너 책상 (수정구=사주, 카드, 노트북=카톡분석) ===== */}
        <g>
          <rect x="250" y="248" width="116" height="14" fill="#C49A6E" /><rect x="250" y="248" width="116" height="5" fill="#B0865A" />
          <rect x="256" y="262" width="7" height="36" fill="#A87C50" /><rect x="354" y="262" width="7" height="36" fill="#A87C50" />
        </g>
        <g className="hot" onClick={go("/saju")}>
          <rect x="258" y="218" width="36" height="32" fill="transparent" />
          <g className="obj">
            <circle cx="276" cy="234" r="14" fill="#C9A7F0" /><circle cx="271" cy="229" r="4" fill="#fff" /><rect x="268" y="246" width="16" height="4" fill="#F2C76B" />
          </g>
          <text className="lbl" x="276" y="290">사주</text>
        </g>
        <g className="hot" onClick={go("/cards")}>
          <rect x="298" y="226" width="30" height="24" fill="transparent" />
          <g className="obj">
            <rect x="302" y="232" width="14" height="18" rx="2" fill="#fff" stroke="#E8799F" strokeWidth="2" transform="rotate(-10 309 241)" />
            <rect x="312" y="230" width="14" height="18" rx="2" fill="#fff" stroke="#9FC7E8" strokeWidth="2" transform="rotate(8 319 239)" />
          </g>
          <text className="lbl" x="314" y="290">카드</text>
        </g>
        <g className="hot" onClick={go("/kakao")}>
          <rect x="330" y="222" width="36" height="28" fill="transparent" />
          <g className="obj">
            <rect x="334" y="228" width="30" height="20" fill="#5A4A55" /><rect x="337" y="231" width="24" height="14" fill="#BFE0F5" />
            <rect x="340" y="234" width="12" height="3" fill="#E8799F" /><rect x="340" y="239" width="16" height="3" fill="#9FC7E8" />
            <rect x="330" y="248" width="38" height="3" fill="#A87C50" />
          </g>
          <text className="lbl" x="349" y="290">카톡 분석</text>
        </g>

        {/* ===== 앞쪽: 룰렛(가챠) ===== */}
        <g className="hot" onClick={go("/games/roulette")}>
          <rect x="92" y="382" width="62" height="96" fill="transparent" />
          <g className="obj">
            <rect x="100" y="392" width="46" height="78" fill="#E8556F" /><rect x="100" y="392" width="46" height="78" fill="none" stroke="#C73A57" strokeWidth="2" />
            <circle cx="123" cy="414" r="16" fill="#FBF3F8" />
            <rect x="115" y="410" width="6" height="6" fill="#F2C76B" /><rect x="124" y="416" width="6" height="6" fill="#9FC7E8" /><rect x="119" y="406" width="6" height="6" fill="#C9A7F0" /><rect x="126" y="408" width="6" height="6" fill="#A8E0C8" />
            <rect x="110" y="440" width="26" height="16" fill="#fff" /><rect x="116" y="444" width="14" height="9" fill="#F4D6E6" />
          </g>
          <text className="lbl" x="123" y="476">룰렛</text>
        </g>

        {/* ===== 앞쪽: 아케이드(퀴즈) ===== */}
        <g className="hot" onClick={go("/games/quiz")}>
          <rect x="232" y="382" width="62" height="96" fill="transparent" />
          <g className="obj">
            <rect x="240" y="392" width="46" height="78" fill="#7E6CC4" /><rect x="240" y="392" width="46" height="78" fill="none" stroke="#5E4FA0" strokeWidth="2" />
            <rect x="246" y="400" width="34" height="26" fill="#2E2B33" /><rect x="252" y="406" width="9" height="7" fill="#F2C76B" /><rect x="266" y="410" width="9" height="7" fill="#9FC7E8" />
            <rect x="248" y="432" width="30" height="9" fill="#C9A7F0" /><circle cx="257" cy="452" r="5" fill="#E8799F" /><circle cx="272" cy="452" r="5" fill="#9FC7E8" />
          </g>
          <text className="lbl" x="263" y="476">퀴즈</text>
        </g>

        {/* ===== 가운데 커플 (탭하면 행동 바뀜) ===== */}
        <g className="hot" onClick={cyclePose}>
          <rect x="150" y="392" width="84" height="76" fill="transparent" />
          {pose === 0 && (
            <g className="obj">
              <path d="M188 410c0-5-7-6-7 0 0 4 7 9 7 9s7-5 7-9c0-6-7-5-7 0Z" fill="#F2A3C0" />
              {/* 남자 */}
              <rect x="160" y="420" width="16" height="5" fill="#3F3B45" /><rect x="160" y="424" width="3" height="5" fill="#3F3B45" /><rect x="173" y="424" width="3" height="5" fill="#3F3B45" />
              <rect x="162" y="425" width="12" height="8" fill="#FBE0CC" /><rect x="164" y="428" width="2" height="2" fill="#4A3A2E" /><rect x="170" y="428" width="2" height="2" fill="#4A3A2E" />
              <rect x="160" y="433" width="16" height="13" fill="#A8CFF0" /><rect x="160" y="446" width="16" height="6" fill="#5A6B8C" />
              {/* 여자 */}
              <rect x="190" y="418" width="16" height="6" fill="#E889AC" /><rect x="189" y="423" width="3" height="9" fill="#E889AC" /><rect x="204" y="423" width="3" height="9" fill="#E889AC" />
              <rect x="192" y="425" width="12" height="8" fill="#FBE0CC" /><rect x="194" y="428" width="2" height="2" fill="#4A3A2E" /><rect x="200" y="428" width="2" height="2" fill="#4A3A2E" /><rect x="193" y="431" width="2" height="1" fill="#F4A8B8" /><rect x="201" y="431" width="2" height="1" fill="#F4A8B8" />
              <rect x="190" y="433" width="16" height="13" fill="#fff" /><rect x="189" y="444" width="18" height="4" fill="#fff" /><rect x="193" y="448" width="10" height="4" fill="#FBE0CC" />
            </g>
          )}
          {pose === 1 && (
            <g className="obj">
              <path d="M186 406c0-6-9-7-9 0 0 5 9 11 9 11s9-6 9-11c0-7-9-6-9 0Z" fill="#E8556F" />
              {/* 남자 (왼쪽, 팔로 감쌈) */}
              <rect x="166" y="422" width="16" height="5" fill="#3F3B45" />
              <rect x="168" y="427" width="12" height="8" fill="#FBE0CC" /><rect x="170" y="430" width="2" height="2" fill="#4A3A2E" /><rect x="176" y="430" width="2" height="2" fill="#4A3A2E" />
              <rect x="164" y="435" width="18" height="14" fill="#A8CFF0" />
              <rect x="180" y="430" width="16" height="5" fill="#FBE0CC" />
              {/* 여자 (오른쪽, 기댐) */}
              <rect x="186" y="421" width="16" height="6" fill="#E889AC" /><rect x="185" y="426" width="3" height="8" fill="#E889AC" /><rect x="200" y="426" width="3" height="8" fill="#E889AC" />
              <rect x="188" y="427" width="12" height="8" fill="#FBE0CC" /><rect x="190" y="430" width="2" height="2" fill="#4A3A2E" /><rect x="196" y="430" width="2" height="2" fill="#4A3A2E" /><rect x="189" y="433" width="2" height="1" fill="#F4A8B8" /><rect x="197" y="433" width="2" height="1" fill="#F4A8B8" />
              <rect x="186" y="435" width="17" height="14" fill="#fff" />
            </g>
          )}
          {pose === 2 && (
            <g className="obj">
              {/* 누운 남자 (위) */}
              <rect x="156" y="420" width="10" height="9" fill="#3F3B45" /><rect x="160" y="421" width="6" height="7" fill="#FBE0CC" /><rect x="162" y="424" width="2" height="2" fill="#4A3A2E" />
              <rect x="166" y="421" width="50" height="9" fill="#A8CFF0" /><rect x="206" y="422" width="14" height="7" fill="#5A6B8C" />
              {/* 누운 여자 (아래) */}
              <rect x="156" y="434" width="11" height="10" fill="#E889AC" /><rect x="160" y="436" width="6" height="7" fill="#FBE0CC" /><rect x="162" y="439" width="2" height="2" fill="#4A3A2E" />
              <rect x="167" y="435" width="48" height="10" fill="#fff" /><rect x="205" y="437" width="14" height="7" fill="#FBE0CC" />
              <path d="M204 410c0-5-7-6-7 0 0 4 7 9 7 9s7-5 7-9c0-6-7-5-7 0Z" fill="#F2A3C0" />
            </g>
          )}
          {pose === 3 && (
            <g className="obj">
              {/* 자는 남자 */}
              <rect x="156" y="422" width="10" height="9" fill="#3F3B45" /><rect x="160" y="423" width="6" height="7" fill="#FBE0CC" /><rect x="161" y="426" width="3" height="1" fill="#4A3A2E" />
              <rect x="166" y="423" width="50" height="9" fill="#9FB8D8" /><rect x="166" y="423" width="50" height="3" fill="#8AA6CC" />
              {/* 자는 여자 */}
              <rect x="156" y="435" width="11" height="10" fill="#E889AC" /><rect x="160" y="437" width="6" height="7" fill="#FBE0CC" /><rect x="161" y="440" width="3" height="1" fill="#4A3A2E" />
              <rect x="167" y="436" width="48" height="10" fill="#F0E4F0" /><rect x="167" y="436" width="48" height="3" fill="#E2D2E2" />
              <text x="206" y="416" fontSize="10" fill="#8A6E7C">z</text><text x="214" y="408" fontSize="13" fill="#8A6E7C">Z</text>
            </g>
          )}
          <text x="192" y="464" fontSize="10" fill="#B85C82" textAnchor="middle">{POSES[pose]} 💕</text>
        </g>
      </svg>
      <p style={{ fontSize: 10.5, color: "#A89AA3", textAlign: "center", marginTop: 8 }}>가운데 커플을 톡 누르면 다른 행동을 해요</p>
    </main>
  );
}
