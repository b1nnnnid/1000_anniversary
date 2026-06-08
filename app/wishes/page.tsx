"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { markFlag } from "@/lib/flags";

interface Coupon { id: number; title: string; emoji: string; used: boolean; earnedAt: string; }

export default function WishesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetch("/api/coupons").then((r) => r.json())
    .then((d) => setCoupons(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { markFlag("wishes"); load(); }, []);

  const toggle = (c: Coupon) => {
    setCoupons((cs) => cs.map((x) => (x.id === c.id ? { ...x, used: !x.used } : x)));
    fetch("/api/coupons", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id, used: !c.used }) }).catch(() => {});
  };

  const active = coupons.filter((c) => !c.used);
  const used = coupons.filter((c) => c.used);

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", textAlign: "center", margin: "12px 0 4px" }}>소원권 보관함 🎟</h1>
      <p style={{ fontSize: 12, color: "#8A7A85", textAlign: "center", margin: "0 0 16px" }}>룰렛에서 뽑은 소원권을 모아둬요</p>

      {loading ? <p style={{ textAlign: "center", color: "#A89AA3" }}>불러오는 중...</p>
        : coupons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: "#A89AA3" }}>
            <p style={{ fontSize: 40, margin: 0 }}>🎁</p>
            <p style={{ fontSize: 13 }}>아직 뽑은 소원권이 없어요.<br /><Link href="/games/roulette" style={{ color: "#B85C82" }}>룰렛 돌리러 가기</Link></p>
          </div>
        ) : (
          <>
            {active.map((c) => (
              <div key={c.id} className="pixel-border" style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 30 }}>{c.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, color: "#5A4A55" }}>{c.title}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 10.5, color: "#A89AA3" }}>{new Date(c.earnedAt).toLocaleDateString("ko-KR")} 획득</p>
                </div>
                <button onClick={() => toggle(c)} className="btn-rose" style={{ fontSize: 12, padding: "8px 12px" }}>사용하기</button>
              </div>
            ))}
            {used.length > 0 && (
              <>
                <p style={{ fontSize: 12, color: "#A89AA3", margin: "18px 0 8px" }}>사용 완료 ({used.length})</p>
                {used.map((c) => (
                  <div key={c.id} style={{ background: "#F1EFE8", borderRadius: 12, padding: "10px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, opacity: 0.7 }}>
                    <span style={{ fontSize: 24, filter: "grayscale(0.5)" }}>{c.emoji}</span>
                    <p style={{ flex: 1, margin: 0, fontSize: 13, color: "#9A8A95", textDecoration: "line-through" }}>{c.title}</p>
                    <button onClick={() => toggle(c)} style={{ fontSize: 11, color: "#B85C82", background: "none", border: "none", textDecoration: "underline" }}>되돌리기</button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
    </main>
  );
}
