"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { markFlag } from "@/lib/flags";
import { Coupon, listCoupons, setCouponUsed } from "@/lib/couponsClient";
import PixelIcon from "@/components/PixelIcon";

const PAGE_BG = "#F3E7EF";

export default function WishesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [burst, setBurst] = useState<{ emoji: string } | null>(null);

  useEffect(() => { markFlag("wishes"); setCoupons(listCoupons()); setLoading(false); }, []);

  const toggle = (c: Coupon) => {
    const nowUsing = !c.used;
    setCoupons(setCouponUsed(c.id, nowUsing));
    if (nowUsing) {
      setBurst({ emoji: c.emoji });
      setTimeout(() => setBurst(null), 1100);
    }
  };

  const active = coupons.filter((c) => !c.used);
  const used = coupons.filter((c) => c.used);

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", textAlign: "center", margin: "12px 0 4px" }}>소원권 보관함 <PixelIcon name="ticket" size={18} /></h1>
      <p style={{ fontSize: 12, color: "#8A7A85", textAlign: "center", margin: "0 0 16px" }}>룰렛에서 뽑은 소원권을 모아둬요</p>

      {/* 통계 배너 */}
      {!loading && coupons.length > 0 && (
        <div className="pixel-border" style={{
          background: "linear-gradient(135deg, var(--cream), #fff)", borderRadius: 16,
          padding: "14px 16px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12,
          animation: "ticket-in .5s ease-out both",
        }}>
          <span className="floaty" style={{ fontSize: 34 }}>🎟️</span>
          <div style={{ flex: 1, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#E8556F" }}>{active.length}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#9A8A95" }}>사용 가능</p>
            </div>
            <div style={{ width: 1, background: "#EAD9E4" }} />
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#C0A7B6" }}>{used.length}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#9A8A95" }}>사용 완료</p>
            </div>
            <div style={{ width: 1, background: "#EAD9E4" }} />
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#B85C82" }}>{coupons.length}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#9A8A95" }}>전체</p>
            </div>
          </div>
        </div>
      )}

      {loading ? <p style={{ textAlign: "center", color: "#A89AA3" }}>불러오는 중...</p>
        : coupons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "34px 0", color: "#A89AA3" }}>
            <p className="sparkle" style={{ fontSize: 13, margin: "0 0 6px", color: "#C98AA6" }}>✦ ˚ ⋆ ｡ ✦</p>
            <p style={{ fontSize: 52, margin: "0 0 6px", animation: "gift-bob 2.6s ease-in-out infinite", display: "inline-block" }}>🎁</p>
            <p style={{ fontSize: 13 }}>아직 뽑은 소원권이 없어요.<br /><Link href="/games/roulette" style={{ color: "#B85C82", textDecoration: "underline" }}>룰렛 돌리러 가기</Link></p>
          </div>
        ) : (
          <>
            {active.map((c, i) => (
              <div key={c.id} className="pixel-border" style={{
                position: "relative", background: "#fff", borderRadius: 14, padding: "14px 16px",
                marginBottom: 12, display: "flex", alignItems: "center", gap: 14, overflow: "hidden",
                animation: `ticket-in .5s ${i * 0.07}s ease-out both`,
              }}>
                {/* 양옆 펀치홀 (티켓 스텁 느낌) */}
                <span style={{ position: "absolute", left: -8, top: "50%", marginTop: -8, width: 16, height: 16, borderRadius: "50%", background: PAGE_BG }} />
                <span style={{ position: "absolute", right: -8, top: "50%", marginTop: -8, width: 16, height: 16, borderRadius: "50%", background: PAGE_BG }} />
                {/* 지나가는 광택 */}
                <span className="shine-el" style={{
                  position: "absolute", top: 0, left: 0, width: 40, height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)",
                  animation: `shine-sweep 3.2s ${1 + i * 0.4}s ease-in-out infinite`,
                }} />
                <span className="floaty" style={{ fontSize: 32, animationDelay: `${i * 0.2}s` }}>{c.emoji}</span>
                {/* 절취선 */}
                <span style={{ alignSelf: "stretch", borderLeft: "2px dashed #EAD2DF", margin: "2px 0" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, color: "#5A4A55", fontWeight: 600 }}>{c.title}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 10.5, color: "#A89AA3" }}>🗓 {new Date(c.earnedAt).toLocaleDateString("ko-KR")} 획득</p>
                </div>
                <button onClick={() => toggle(c)} className="btn-rose" style={{ fontSize: 12, padding: "9px 13px", whiteSpace: "nowrap" }}>사용하기</button>
              </div>
            ))}

            {used.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "20px 0 10px" }}>
                  <span style={{ flex: 1, borderTop: "1px dashed #D9C7D2" }} />
                  <span style={{ fontSize: 12, color: "#A89AA3" }}>사용 완료 {used.length}</span>
                  <span style={{ flex: 1, borderTop: "1px dashed #D9C7D2" }} />
                </div>
                {used.map((c) => (
                  <div key={c.id} style={{
                    position: "relative", background: "#F1EFE8", borderRadius: 12, padding: "11px 14px",
                    marginBottom: 8, display: "flex", alignItems: "center", gap: 12, opacity: 0.85, overflow: "hidden",
                  }}>
                    <span style={{ fontSize: 24, filter: "grayscale(0.6)" }}>{c.emoji}</span>
                    <p style={{ flex: 1, margin: 0, fontSize: 13, color: "#9A8A95", textDecoration: "line-through" }}>{c.title}</p>
                    {/* 사용완료 스탬프 */}
                    <span style={{
                      fontSize: 10, color: "#D08AA6", border: "1.5px solid #E3B8CC", borderRadius: 6,
                      padding: "1px 6px", transform: "rotate(-12deg)", fontWeight: 700,
                    }}>USED</span>
                    <button onClick={() => toggle(c)} style={{ fontSize: 11, color: "#B85C82", background: "none", border: "none", textDecoration: "underline" }}>되돌리기</button>
                  </div>
                ))}
              </>
            )}

            <p style={{ textAlign: "center", fontSize: 11, color: "#B7A6B1", margin: "20px 0 0" }}>
              💡 소원권은 언제든 사용하고 되돌릴 수 있어요
            </p>
          </>
        )}

      {/* 사용 시 색종이 버스트 */}
      {burst && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[...Array(14)].map((_, i) => {
            const ang = (i / 14) * Math.PI * 2;
            const dist = 90 + (i % 3) * 30;
            const parts = ["🎉", "✨", "💗", "🌸", "⭐", burst.emoji];
            return (
              <span key={i} style={{
                position: "absolute", fontSize: 20 + (i % 3) * 8,
                ["--dx" as string]: `${Math.cos(ang) * dist}px`,
                ["--dy" as string]: `${Math.sin(ang) * dist}px`,
                ["--rot" as string]: `${(i % 2 ? 1 : -1) * 180}deg`,
                animation: `confetti-fly 1s ${(i % 4) * 0.04}s ease-out forwards`,
              }}>{parts[i % parts.length]}</span>
            );
          })}
        </div>
      )}
    </main>
  );
}
