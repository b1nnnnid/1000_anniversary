"use client";

import { useRouter } from "next/navigation";

export default function UsHub() {
  const router = useRouter();
  const go = (href: string) => () => router.push(href);

  return (
    <main style={{ maxWidth: 440, margin: "0 auto", padding: "14px 12px 30px", minHeight: "100dvh" }}>
      <button onClick={go("/map")} style={{ color: "#B85C82", fontSize: 13, background: "none", border: "none" }}>← 맵으로</button>
      <h1 style={{ fontSize: 20, color: "#B85C82", textAlign: "center", margin: "6px 0 2px" }}>우리집 🏡</h1>
      <p style={{ fontSize: 11.5, color: "#8A7A85", textAlign: "center", margin: "0 0 10px" }}>가구를 톡 눌러 즐겨보세요</p>

      <svg width="100%" viewBox="0 0 380 760" role="img" shapeRendering="crispEdges"
        style={{ display: "block", borderRadius: 16, border: "3px solid #fff", boxShadow: "0 0 0 3px var(--lav)" }}>
        <title>우리집 — 콘텐츠 허브</title>

        {/* 벽 / 바닥 / 러그 */}
        <rect x="0" y="0" width="380" height="330" fill="#F6E3EC" />
        <rect x="0" y="330" width="380" height="430" fill="#E8CBA4" />
        <rect x="0" y="326" width="380" height="6" fill="#D9B98C" />
        <ellipse cx="190" cy="470" rx="172" ry="120" fill="#F4D6E6" opacity="0.5" />
        <ellipse cx="190" cy="680" rx="150" ry="70" fill="#EAD9C0" opacity="0.5" />
        {/* 화분 (장식) */}
        <g><rect x="346" y="300" width="20" height="26" fill="#C98A6A" /><rect x="344" y="284" width="8" height="20" fill="#8FC9A0" /><rect x="354" y="280" width="8" height="24" fill="#8FC9A0" /><rect x="360" y="288" width="8" height="16" fill="#8FC9A0" /></g>
        {/* 벽 하트 장식 */}
        <path d="M196 30c0-4-7-5-7 0 0 3 7 8 7 8s7-5 7-8c0-5-7-4-7 0Z" fill="#F2A3C0" opacity="0.7" />

        <style>{`.hot{cursor:pointer} .hot:hover .obj{opacity:.82} .hot:active{transform:translateY(1px)} .lbl{font-family:sans-serif;fill:#7A5A68;text-anchor:middle}`}</style>

        {/* ===== 벽 1열 ===== */}
        {/* 운세: 창문+달 */}
        <g className="hot" onClick={go("/fortune")}>
          <rect x="14" y="20" width="80" height="92" fill="transparent" />
          <g className="obj">
            <rect x="18" y="24" width="62" height="56" fill="#BFE0F5" /><rect x="18" y="24" width="62" height="56" fill="none" stroke="#fff" strokeWidth="4" />
            <rect x="46" y="24" width="4" height="56" fill="#fff" /><rect x="18" y="50" width="62" height="4" fill="#fff" />
            <rect x="58" y="34" width="14" height="14" fill="#F2C76B" /><rect x="56" y="36" width="8" height="10" fill="#BFE0F5" />
          </g>
          <text className="lbl" x="49" y="98" fontSize="11">오늘의 운세</text>
        </g>
        {/* 함께한 시간: 달력 */}
        <g className="hot" onClick={go("/together")}>
          <rect x="108" y="20" width="64" height="92" fill="transparent" />
          <g className="obj">
            <rect x="116" y="24" width="48" height="44" fill="#fff" stroke="#E8799F" strokeWidth="3" /><rect x="116" y="24" width="48" height="12" fill="#E8799F" />
            <rect x="122" y="42" width="7" height="7" fill="#F4B8CC" /><rect x="133" y="42" width="7" height="7" fill="#F4B8CC" /><rect x="144" y="42" width="7" height="7" fill="#E8556F" />
            <rect x="122" y="54" width="7" height="7" fill="#F4B8CC" /><rect x="133" y="54" width="7" height="7" fill="#F4B8CC" />
          </g>
          <text className="lbl" x="140" y="98" fontSize="11">함께한 시간</text>
        </g>
        {/* 업적: 트로피 액자 */}
        <g className="hot" onClick={go("/achievements")}>
          <rect x="208" y="20" width="60" height="92" fill="transparent" />
          <g className="obj">
            <rect x="214" y="24" width="48" height="42" fill="#FBE6A8" stroke="#E0A94A" strokeWidth="3" />
            <rect x="228" y="32" width="20" height="16" fill="#F2C76B" /><rect x="224" y="34" width="6" height="8" fill="#E0A94A" /><rect x="246" y="34" width="6" height="8" fill="#E0A94A" /><rect x="234" y="48" width="8" height="6" fill="#E0A94A" /><rect x="230" y="54" width="16" height="4" fill="#E0A94A" />
          </g>
          <text className="lbl" x="238" y="98" fontSize="11">업적 도감</text>
        </g>
        {/* 소원권 보관함: 핀보드 */}
        <g className="hot" onClick={go("/wishes")}>
          <rect x="296" y="20" width="70" height="92" fill="transparent" />
          <g className="obj">
            <rect x="302" y="24" width="58" height="44" fill="#FBF3F8" stroke="#C98A6A" strokeWidth="3" />
            <rect x="308" y="30" width="20" height="13" fill="#F2C76B" /><rect x="334" y="30" width="20" height="13" fill="#F8C9DC" />
            <rect x="308" y="48" width="20" height="13" fill="#A8E0C8" /><rect x="334" y="48" width="20" height="13" fill="#C9A7F0" />
          </g>
          <text className="lbl" x="331" y="98" fontSize="11">소원권함</text>
        </g>

        {/* ===== 벽 2열: 추억 앨범 (사진 가랜드) ===== */}
        <g className="hot" onClick={go("/album")}>
          <rect x="30" y="140" width="320" height="74" fill="transparent" />
          <g className="obj">
            <path d="M40 152 Q190 138 340 156" fill="none" stroke="#C98A6A" strokeWidth="2" />
            <g><rect x="58" y="150" width="40" height="44" fill="#fff" transform="rotate(-6 78 172)" /><rect x="63" y="156" width="30" height="26" fill="#9FC7E8" transform="rotate(-6 78 172)" /></g>
            <g><rect x="170" y="146" width="40" height="44" fill="#fff" /><rect x="175" y="152" width="30" height="26" fill="#F4B8CC" /></g>
            <g><rect x="282" y="150" width="40" height="44" fill="#fff" transform="rotate(6 302 172)" /><rect x="287" y="156" width="30" height="26" fill="#A8E0C8" transform="rotate(6 302 172)" /></g>
          </g>
          <text className="lbl" x="190" y="210" fontSize="11">추억 앨범</text>
        </g>

        {/* ===== 바닥 1열 ===== */}
        {/* 슬라이드쇼: TV */}
        <g className="hot" onClick={go("/slideshow")}>
          <rect x="22" y="356" width="100" height="116" fill="transparent" />
          <g className="obj">
            <rect x="34" y="360" width="78" height="56" fill="#3F3B45" /><rect x="40" y="366" width="66" height="40" fill="#9FC7E8" />
            <path d="M70 386c0-5-8-6-8 0 0 4 8 9 8 9s8-5 8-9c0-6-8-5-8 0Z" fill="#fff" />
            <rect x="44" y="418" width="60" height="26" fill="#C7A07A" /><rect x="44" y="418" width="60" height="4" fill="#B8915F" />
          </g>
          <text className="lbl" x="73" y="462" fontSize="11">슬라이드쇼</text>
        </g>
        {/* 사주: 수정구 테이블 */}
        <g className="hot" onClick={go("/saju")}>
          <rect x="146" y="356" width="84" height="116" fill="transparent" />
          <g className="obj">
            <rect x="156" y="420" width="64" height="10" fill="#9C7A5A" /><rect x="162" y="430" width="6" height="22" fill="#8A6A48" /><rect x="208" y="430" width="6" height="22" fill="#8A6A48" />
            <circle cx="188" cy="404" r="18" fill="#C9A7F0" /><circle cx="182" cy="398" r="5" fill="#fff" /><rect x="178" y="420" width="20" height="5" fill="#F2C76B" />
          </g>
          <text className="lbl" x="188" y="462" fontSize="11">사주·궁합</text>
        </g>
        {/* 편지함 */}
        <g className="hot" onClick={go("/letters")}>
          <rect x="256" y="356" width="80" height="116" fill="transparent" />
          <g className="obj">
            <rect x="278" y="368" width="40" height="46" fill="#E8799F" /><rect x="278" y="368" width="40" height="13" fill="#D9719A" />
            <rect x="285" y="388" width="26" height="18" fill="#fff" /><path d="M285 388l13 9 13-9" fill="none" stroke="#F4B8CC" strokeWidth="2" />
            <rect x="294" y="414" width="8" height="30" fill="#B8915F" />
          </g>
          <text className="lbl" x="298" y="462" fontSize="11">편지함</text>
        </g>

        {/* ===== 바닥 2열 ===== */}
        {/* 룰렛: 뽑기 기계 */}
        <g className="hot" onClick={go("/games/roulette")}>
          <rect x="22" y="500" width="84" height="116" fill="transparent" />
          <g className="obj">
            <rect x="42" y="508" width="44" height="56" fill="#E8556F" /><circle cx="64" cy="526" r="14" fill="#FBF3F8" />
            <rect x="57" y="523" width="5" height="5" fill="#F2C76B" /><rect x="66" y="529" width="5" height="5" fill="#9FC7E8" /><rect x="61" y="519" width="5" height="5" fill="#C9A7F0" />
            <rect x="50" y="548" width="28" height="14" fill="#fff" />
          </g>
          <text className="lbl" x="64" y="606" fontSize="11">소원권 룰렛</text>
        </g>
        {/* 카드: 카드 테이블 */}
        <g className="hot" onClick={go("/cards")}>
          <rect x="120" y="500" width="120" height="116" fill="transparent" />
          <g className="obj">
            <rect x="134" y="540" width="92" height="40" rx="4" fill="#C7E8D2" stroke="#9FD9B8" strokeWidth="3" />
            <rect x="148" y="546" width="20" height="28" rx="2" fill="#fff" stroke="#E8799F" strokeWidth="2" transform="rotate(-8 158 560)" />
            <rect x="170" y="546" width="20" height="28" rx="2" fill="#fff" stroke="#9FC7E8" strokeWidth="2" />
            <rect x="192" y="546" width="20" height="28" rx="2" fill="#fff" stroke="#C9A7F0" strokeWidth="2" transform="rotate(8 202 560)" />
          </g>
          <text className="lbl" x="180" y="606" fontSize="11">커플 카드</text>
        </g>
        {/* 포토부스: 카메라 */}
        <g className="hot" onClick={go("/photobooth")}>
          <rect x="258" y="500" width="80" height="116" fill="transparent" />
          <g className="obj">
            <rect x="278" y="520" width="44" height="30" rx="4" fill="#5A4A55" /><rect x="284" y="526" width="30" height="18" rx="2" fill="#9FC7E8" /><circle cx="298" cy="535" r="7" fill="#fff" /><rect x="312" y="524" width="6" height="4" fill="#F2C76B" />
            <rect x="290" y="550" width="3" height="34" fill="#3F3B45" /><rect x="304" y="550" width="3" height="34" fill="#3F3B45" /><rect x="297" y="550" width="3" height="30" fill="#3F3B45" />
          </g>
          <text className="lbl" x="298" y="606" fontSize="11">포토부스</text>
        </g>

        {/* ===== 바닥 3열 ===== */}
        {/* 퀴즈: 아케이드 기계 */}
        <g className="hot" onClick={go("/games/quiz")}>
          <rect x="34" y="636" width="84" height="112" fill="transparent" />
          <g className="obj">
            <rect x="52" y="642" width="48" height="72" fill="#7E6CC4" /><rect x="58" y="650" width="36" height="26" fill="#2E2B33" /><rect x="64" y="656" width="8" height="6" fill="#F2C76B" /><rect x="78" y="660" width="8" height="6" fill="#9FC7E8" />
            <rect x="60" y="682" width="32" height="10" fill="#C9A7F0" /><circle cx="68" cy="700" r="4" fill="#E8799F" /><circle cx="84" cy="700" r="4" fill="#9FC7E8" />
          </g>
          <text className="lbl" x="76" y="742" fontSize="11">커플 퀴즈</text>
        </g>
        {/* 카톡 분석: 컴퓨터 책상 */}
        <g className="hot" onClick={go("/kakao")}>
          <rect x="150" y="636" width="184" height="112" fill="transparent" />
          <g className="obj">
            <rect x="200" y="648" width="80" height="50" fill="#5A4A55" /><rect x="206" y="654" width="68" height="38" fill="#BFE0F5" />
            <rect x="214" y="662" width="34" height="6" fill="#E8799F" /><rect x="214" y="672" width="48" height="6" fill="#9FC7E8" /><rect x="214" y="682" width="28" height="6" fill="#C9A7F0" />
            <rect x="232" y="698" width="16" height="8" fill="#3F3B45" /><rect x="182" y="706" width="120" height="8" fill="#9C7A5A" />
          </g>
          <text className="lbl" x="240" y="742" fontSize="11">카톡 대화 분석</text>
        </g>
      </svg>
    </main>
  );
}
