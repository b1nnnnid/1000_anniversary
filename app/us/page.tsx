"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import PixelIcon from "@/components/PixelIcon";

const ITEMS = [
  { href: "/together", icon: "clock", title: "함께한 시간", desc: "초 단위로 쌓이는 우리" },
  { href: "/album", icon: "camera", title: "추억 앨범", desc: "모은 추억 모아보기" },
  { href: "/wishes", icon: "ticket", title: "소원권 보관함", desc: "뽑은 소원권 관리" },
  { href: "/kakao", icon: "chat", title: "카톡 대화 분석", desc: "우리 대화 통계" },
  { href: "/slideshow", icon: "film", title: "추억 슬라이드쇼", desc: "1000일 헌정 영상" },
  { href: "/letters", icon: "letter", title: "숨겨둔 편지함", desc: "티켓으로 열기" },
  { href: "/saju", icon: "crystal", title: "커플 사주·궁합", desc: "티켓 열람권" },
  { href: "/fortune", icon: "moon", title: "오늘의 운세", desc: "티켓 열람권" },
  { href: "/cards", icon: "cards", title: "커플 카드", desc: "유형테스트·알아가기" },
  { href: "/photobooth", icon: "camera", title: "포토부스", desc: "픽셀 액자 사진" },
  { href: "/achievements", icon: "trophy", title: "업적 도감", desc: "달성 뱃지 모으기" },
  { href: "/games/quiz", icon: "bubble", title: "커플 퀴즈", desc: "조각 모으기" },
  { href: "/games/roulette", icon: "gift", title: "소원권 룰렛", desc: "티켓으로 돌리기" },
];

export default function UsHub() {
  const router = useRouter();
  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <button onClick={() => router.push("/map")} style={{ color: "#B85C82", fontSize: 13, background: "none", border: "none", textDecoration: "none" }}>← 맵으로</button>
      <h1 style={{ fontSize: 22, color: "#B85C82", textAlign: "center", margin: "10px 0 2px" }}>
        우리의 공간 <PixelIcon name="flower" size={20} />
      </h1>
      <p style={{ fontSize: 12, color: "#8A7A85", textAlign: "center", margin: "0 0 18px" }}>함께 즐길 수 있는 것들</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {ITEMS.map((it) => (
          <Link key={it.href} href={it.href} className="pixel-border"
            style={{ textDecoration: "none", background: "var(--cream)", borderRadius: 16, padding: "18px 12px", textAlign: "center", display: "block" }}>
            <div className="floaty"><PixelIcon name={it.icon} size={36} /></div>
            <p style={{ margin: "8px 0 2px", fontSize: 14, color: "#B85C82" }}>{it.title}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#9A8A95" }}>{it.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
