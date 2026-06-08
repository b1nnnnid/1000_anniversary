import Link from "next/link";

// 온보딩(시작) 화면 — 두 캐릭터가 함께
export default function Intro() {
  return (
    <main style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px 20px",
      textAlign: "center", maxWidth: 480, margin: "0 auto",
    }}>
      <div className="sparkle" style={{ fontSize: 13, color: "#B85C82", letterSpacing: 2 }}>OUR LITTLE WORLD</div>
      <h1 style={{ fontSize: 26, color: "#B85C82", margin: "10px 0 4px", lineHeight: 1.4 }}>
        우리의 1000일 ♥
      </h1>
      <p style={{ fontSize: 13, color: "#8A7A85", margin: "0 0 22px", lineHeight: 1.7 }}>
        캐릭터를 움직여 우리가 걸어온 길을<br />하나씩 따라가 보는 작은 추억 여행
      </p>

      <svg width="240" height="190" viewBox="0 0 240 190" className="floaty" aria-hidden="true" shapeRendering="crispEdges">
        <ellipse cx="120" cy="172" rx="92" ry="13" fill="#E0D0EC" />
        <rect x="24" y="118" width="192" height="48" rx="14" fill="#C7E8D2" />

        {/* 여자친구: 핑크 단발 + 리본 + 흰 원피스 */}
        <g transform="translate(48,52)">
          <rect x="16" y="16" width="40" height="28" fill="#FBE0CC" />
          <rect x="16" y="0" width="40" height="10" fill="#E889AC" />
          <rect x="12" y="6" width="48" height="14" fill="#E889AC" />
          <rect x="8" y="14" width="10" height="26" fill="#E889AC" />
          <rect x="54" y="14" width="10" height="26" fill="#E889AC" />
          <rect x="12" y="16" width="48" height="4" fill="#D9719A" />
          <rect x="50" y="0" width="12" height="9" fill="#E8556F" />
          <rect x="47" y="3" width="5" height="5" fill="#C73A57" />
          <rect x="24" y="28" width="5" height="6" fill="#4A3A2E" />
          <rect x="43" y="28" width="5" height="6" fill="#4A3A2E" />
          <rect x="19" y="36" width="7" height="4" fill="#F8B8C8" />
          <rect x="46" y="36" width="7" height="4" fill="#F8B8C8" />
          <rect x="33" y="38" width="6" height="4" fill="#D96A7E" />
          <rect x="16" y="44" width="40" height="24" fill="#FFFFFF" />
          <rect x="12" y="60" width="48" height="10" fill="#FFFFFF" />
          <rect x="12" y="66" width="48" height="4" fill="#F4B8CC" />
          <rect x="30" y="44" width="12" height="5" fill="#F4B8CC" />
          <rect x="8" y="46" width="8" height="16" fill="#FBE0CC" />
          <rect x="56" y="48" width="10" height="8" fill="#FBE0CC" />
          <rect x="24" y="70" width="8" height="12" fill="#FBE0CC" />
          <rect x="40" y="70" width="8" height="12" fill="#FBE0CC" />
          <rect x="22" y="82" width="12" height="5" fill="#E8556F" />
          <rect x="38" y="82" width="12" height="5" fill="#E8556F" />
        </g>

        {/* 남자친구: 흑발 + 하늘 셔츠 */}
        <g transform="translate(126,52)">
          <rect x="16" y="16" width="40" height="28" fill="#FBE0CC" />
          <rect x="16" y="0" width="40" height="10" fill="#3F3B45" />
          <rect x="12" y="6" width="48" height="12" fill="#3F3B45" />
          <rect x="8" y="8" width="8" height="6" fill="#3F3B45" />
          <rect x="56" y="6" width="8" height="6" fill="#3F3B45" />
          <rect x="12" y="18" width="6" height="10" fill="#3F3B45" />
          <rect x="54" y="18" width="6" height="10" fill="#3F3B45" />
          <rect x="24" y="28" width="5" height="6" fill="#4A3A2E" />
          <rect x="43" y="28" width="5" height="6" fill="#4A3A2E" />
          <rect x="33" y="39" width="6" height="3" fill="#C96A6A" />
          <rect x="16" y="44" width="40" height="22" fill="#A8CFF0" />
          <rect x="16" y="60" width="40" height="6" fill="#8FB8DC" />
          <rect x="28" y="44" width="16" height="4" fill="#FFFFFF" />
          <rect x="6" y="48" width="10" height="8" fill="#FBE0CC" />
          <rect x="56" y="46" width="8" height="16" fill="#FBE0CC" />
          <rect x="20" y="66" width="32" height="10" fill="#5A6B8C" />
          <rect x="24" y="76" width="8" height="8" fill="#5A6B8C" />
          <rect x="40" y="76" width="8" height="8" fill="#5A6B8C" />
          <rect x="22" y="84" width="12" height="5" fill="#FFFFFF" />
          <rect x="38" y="84" width="12" height="5" fill="#FFFFFF" />
        </g>

        {/* 맞잡은 손 */}
        <rect x="114" y="100" width="12" height="8" fill="#FBE0CC" />

        {/* 하트들 */}
        <path d="M120 30c0-9-14-11-14 0 0 8 14 16 14 16s14-8 14-16c0-11-14-9-14 0Z" fill="#E8799F" />
        <path d="M44 28c0-6-10-8-10 0 0 5 10 11 10 11s10-6 10-11c0-8-10-6-10 0Z" fill="#F2A3C0" />
        <path d="M196 38c0-6-10-7-10 0 0 5 10 11 10 11s10-6 10-11c0-7-10-6-10 0Z" fill="#C9A7F0" />
      </svg>

      <Link href="/map" className="btn-rose" style={{ marginTop: 26, textDecoration: "none", display: "inline-block" }}>
        여행 시작하기 →
      </Link>
      <p style={{ fontSize: 11, color: "#A89AA3", marginTop: 14 }}>
        방향키 · WASD · 화면 버튼으로 움직여요
      </p>
    </main>
  );
}
