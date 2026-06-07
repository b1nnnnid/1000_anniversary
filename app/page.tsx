import Link from "next/link";

// 온보딩(시작) 화면
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

      <svg width="220" height="200" viewBox="0 0 220 200" className="floaty" aria-hidden="true">
        <ellipse cx="110" cy="178" rx="78" ry="14" fill="#E0D0EC" />
        <rect x="34" y="120" width="152" height="52" rx="14" fill="#C7E8D2" />
        <path d="M40 120 Q110 96 180 120" fill="#CDEBD8" />
        <rect x="96" y="78" width="28" height="30" rx="6" fill="#FBE0CC" />
        <rect x="92" y="66" width="36" height="20" rx="8" fill="#7A5A8E" />
        <rect x="96" y="60" width="28" height="12" rx="6" fill="#A07FB8" />
        <rect x="102" y="86" width="4" height="4" fill="#4A3A2E" />
        <rect x="114" y="86" width="4" height="4" fill="#4A3A2E" />
        <rect x="100" y="92" width="4" height="2" fill="#F4A8B8" />
        <rect x="116" y="92" width="4" height="2" fill="#F4A8B8" />
        <rect x="92" y="106" width="36" height="26" rx="8" fill="#9FC7E8" />
        <rect x="98" y="132" width="9" height="14" rx="3" fill="#6B8AA8" />
        <rect x="113" y="132" width="9" height="14" rx="3" fill="#6B8AA8" />
        <path d="M150 70c0-9-15-11-15 0 0 8 15 17 15 17s15-9 15-17c0-11-15-9-15 0Z" fill="#E8799F" />
        <path d="M60 96c0-7-12-9-12 0 0 6 12 13 12 13s12-7 12-13c0-9-12-7-12 0Z" fill="#F2A3C0" />
        <path d="M168 110c0-6-10-7-10 0 0 5 10 11 10 11s10-6 10-11c0-7-10-6-10 0Z" fill="#C9A7F0" />
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
