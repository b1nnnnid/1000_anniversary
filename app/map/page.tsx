"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TrailMap from "@/components/TrailMap";
import GameDock from "@/components/GameDock";
import MemoryModal from "@/components/MemoryModal";
import Celebration from "@/components/Celebration";
import StageChallenge from "@/components/StageChallenge";
import DialogBox from "@/components/DialogBox";
import DateModal from "@/components/DateModal";
import PixelIcon from "@/components/PixelIcon";
import { Stage, Marker, STAGES, HEART_PIECES, CAT_INTRO, CAT_EVENTS, CAT_CONGRATS, THIEF_STEAL, THIEF_SAFE } from "@/lib/gameData";
import { getProgress, addCollected, addHeart, addTickets, spendTicket, resetProgress } from "@/lib/progressClient";
import { playMeow, playCollect, playPop, playSuccess, playWrong, playWin } from "@/lib/sfx";

export default function MapPage() {
  const router = useRouter();
  const [collected, setCollected] = useState<string[]>([]);
  const [tickets, setTickets] = useState(0);
  const [pieces, setPieces] = useState<string[]>([]);
  const [modal, setModal] = useState<Stage | null>(null);
  const [challenge, setChallenge] = useState<Stage | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [dialog, setDialog] = useState<{ lines: string[]; speaker?: string; intro?: boolean; congrats?: boolean; eventIdx?: number; markerId?: string; thief?: boolean } | null>(null);
  const [dateScene, setDateScene] = useState<Stage | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [thiefRun, setThiefRun] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ticketsRef = useRef(0);

  useEffect(() => {
    getProgress().then((p) => {
      setCollected(p.collectedSpots);
      setTickets(p.tickets);
      setPieces(p.heartPieces);
      // 노란 고양이 첫인사 — 맵 들어오자마자 바로
      if (!p.collectedSpots.includes("cat-intro")) {
        setTimeout(() => setDialog({ lines: CAT_INTRO, intro: true }), 450);
      }
    });
  }, []);

  useEffect(() => { ticketsRef.current = tickets; }, [tickets]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  // 티켓 직접 지급
  const reward = useCallback((n: number, label: string) => {
    const left = addTickets(n);
    setTickets(left);
    showToast(`${label} · 🎟 +${n}`);
  }, [showToast]);

  // 수집 항목 저장 (localStorage 우선 + DB)
  const saveSpot = useCallback((id: string) => { addCollected(id); }, []);

  const busy = !!(modal || challenge || celebrate || dialog || confirmReset || dateScene);
  const stageDone = collected.filter((id) => STAGES.some((s) => s.id === id)).length;
  const allCollected = STAGES.every((s) => collected.includes(s.id));
  const celebrated = collected.includes("reunion");
  const shownEvents = CAT_EVENTS.map((_, i) => collected.includes("cat-ev:" + i));
  const catActive = !celebrated && (!collected.includes("cat-intro") || shownEvents.some((v) => !v));
  // 이전 순서의 추억을 다 열어야 다음이 열린다 (상봉 후엔 잠금 해제)
  const lockedIds = celebrated ? [] : STAGES
    .filter((s) => !STAGES.filter((t) => t.order < s.order).every((t) => collected.includes(t.id)))
    .map((s) => s.id);

  const openMemory = useCallback((s: Stage) => {
    setModal(s);
    playPop();
    setCollected((c) => {
      if (c.includes(s.id)) return c;
      saveSpot(s.id);
      return [...c, s.id];
    });
  }, [saveSpot]);

  const onStage = useCallback((s: Stage) => {
    setCollected((c) => {
      // 상봉 후엔 데이트 장소로 입장!
      if (c.includes("reunion") && s.place) {
        setDateScene(s);
        if (!c.includes("date:" + s.id)) {
          saveSpot("date:" + s.id);
          showToast("💑 " + s.place.name + " 데이트!");
          return [...c, "date:" + s.id];
        }
        return c;
      }
      const locked = !STAGES.filter((t) => t.order < s.order).every((t) => c.includes(t.id));
      if (locked) { showToast("🔒 이전 추억부터 차례대로 열어줘!"); return c; }
      if (s.challenge && !c.includes("ch:" + s.id)) setChallenge(s);
      else openMemory(s);
      return c;
    });
  }, [openMemory, saveSpot, showToast]);

  const onChallengeDone = useCallback((success: boolean) => {
    const s = challenge;
    setChallenge(null);
    if (!s) return;
    if (success) {
      setCollected((c) => (c.includes("ch:" + s.id) ? c : [...c, "ch:" + s.id]));
      saveSpot("ch:" + s.id);
      playSuccess();
      reward(1, "미션 성공!");
    } else {
      playWrong();
      showToast("아쉽다! 추억은 열어줄게 💗");
    }
    openMemory(s);
  }, [challenge, openMemory, saveSpot, reward, showToast]);

  const onHeart = useCallback((id: string) => {
    setPieces((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      const p = addHeart(id); // localStorage 저장 + 티켓 +1
      setTickets(p.tickets);
      playCollect();
      showToast(`💗 하트 조각 발견! (${next.length}/${HEART_PIECES.length}) · 🎟 +1`);
      return next;
    });
  }, [showToast]);

  // 고양이가 다가와서 말 걸기
  const onCatTalk = useCallback(() => {
    playMeow();
    setCollected((c) => {
      if (!c.includes("cat-intro")) { setDialog({ lines: CAT_INTRO, intro: true }); return c; }
      const idx = CAT_EVENTS.findIndex((_, i) => !c.includes("cat-ev:" + i));
      if (idx >= 0) setDialog({ lines: CAT_EVENTS[idx], eventIdx: idx });
      return c;
    });
  }, []);

  // 표지판·과거의우리·벤치에 닿았을 때
  const onMarker = useCallback((m: Marker) => {
    setCollected((c) => {
      if (c.includes("mk:" + m.id)) return c; // 이미 읽음
      if (m.event === "thiefcat") {
        if (ticketsRef.current > 0) setDialog({ lines: [...m.lines, ...THIEF_STEAL], speaker: m.speaker, markerId: m.id, thief: true });
        else setDialog({ lines: [...m.lines, ...THIEF_SAFE], speaker: m.speaker, markerId: m.id });
      } else {
        setDialog({ lines: m.lines, speaker: m.speaker, markerId: m.id });
      }
      return c;
    });
  }, []);

  const onDialogEnd = useCallback(() => {
    setDialog((d) => {
      if (d?.markerId) {
        const key = "mk:" + d.markerId;
        setCollected((c) => (c.includes(key) ? c : [...c, key]));
        saveSpot(key);
      }
      if (d?.thief) {
        spendTicket(1).then((left) => setTickets(left));
        saveSpot("cat-thief");
        setCollected((c) => (c.includes("cat-thief") ? c : [...c, "cat-thief"]));
        showToast("검은 고양이가 티켓을 물고 도망쳤다! 🎟💨");
        setThiefRun((n) => n + 1);
      }
      if (d?.intro) {
        setCollected((c) => (c.includes("cat-intro") ? c : [...c, "cat-intro"]));
        saveSpot("cat-intro");
        reward(1, "고양이가 티켓을 줬다! 🐱");
      }
      if (d?.congrats) {
        setCollected((c) => (c.includes("cat-congrats") ? c : [...c, "cat-congrats"]));
        saveSpot("cat-congrats");
        showToast("❓퀴즈와 🎁룰렛이 열렸어요!");
      }
      if (typeof d?.eventIdx === "number") {
        const key = "cat-ev:" + d.eventIdx;
        setCollected((c) => (c.includes(key) ? c : [...c, key]));
        saveSpot(key);
      }
      return null;
    });
  }, [saveSpot, reward, showToast]);

  const onGoal = useCallback(() => {
    setCollected((c) => {
      if (!c.includes("reunion")) { setCelebrate(true); playWin(); }
      return c;
    });
  }, []);

  const onCelebrationClose = useCallback(() => {
    setCelebrate(false);
    setCollected((c) => {
      if (!c.includes("cat-congrats")) {
        setTimeout(() => setDialog({ lines: CAT_CONGRATS, congrats: true }), 700);
      }
      if (c.includes("reunion")) return c;
      saveSpot("reunion");
      return [...c, "reunion"];
    });
  }, [saveSpot]);

  const doReset = useCallback(async () => {
    await resetProgress();
    router.push("/");
  }, [router]);

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "12px 10px 28px", position: "relative" }}>
      <header style={{ position: "relative", marginBottom: 8 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 16, color: "#B85C82" }}>
            우리의 1000일 {celebrated ? "🌸" : "♥"}
          </h1>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            <span className="chip"><PixelIcon name="camera" size={14} /> {stageDone}/{STAGES.length}</span>
            <span className="chip"><PixelIcon name="heart" size={14} /> {pieces.length}/{HEART_PIECES.length}</span>
            <span className="chip"><PixelIcon name="ticket" size={14} /> {tickets}</span>
          </div>
        </div>
        <GameDock
          onHome={() => setConfirmReset(true)}
          gamesLocked={!celebrated}
          onLockedTry={() => showToast("🔒 추억탐방을 끝내면 열려요!")}
          onShowcaseLockedTry={() => showToast("🔒 모든 업적을 깨면 열려요!")}
        />
      </header>

      <TrailMap
        collected={collected} allCollected={allCollected} heartPieces={pieces}
        lockedIds={lockedIds} celebrated={celebrated} busy={busy} catActive={catActive}
        thiefRun={thiefRun}
        onStage={onStage} onGoal={onGoal} onHeart={onHeart} onCatTalk={onCatTalk} onMarker={onMarker}
      />

      {toast && (
        <div className="pop" style={{
          position: "fixed", left: "50%", bottom: 96, transform: "translateX(-50%)",
          background: "#fff", color: "#6A5A66", padding: "9px 16px", borderRadius: 12,
          fontSize: 13, whiteSpace: "nowrap", zIndex: 65, boxShadow: "0 3px 0 rgba(124,90,150,0.2)",
        }}>{toast}</div>
      )}

      {dialog && <DialogBox speaker={dialog.speaker ?? "🐱 길고양이"} lines={dialog.lines} onEnd={onDialogEnd} />}
      {dateScene && (
        <DateModal stage={dateScene} onClose={() => setDateScene(null)}
          onMemory={() => { const s = dateScene; setDateScene(null); setModal(s); }} />
      )}
      {challenge && <StageChallenge stage={challenge} onDone={onChallengeDone} />}
      {modal && <MemoryModal spot={modal} onClose={() => setModal(null)} />}
      {celebrate && <Celebration onClose={onCelebrationClose} />}

      {confirmReset && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 90, background: "rgba(90,74,85,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}>
          <div className="pop pixel-border" style={{ background: "var(--cream)", borderRadius: 16, padding: "22px 20px", textAlign: "center", maxWidth: 300 }}>
            <p style={{ fontSize: 36, margin: "0 0 6px" }}>🥺</p>
            <h2 style={{ fontSize: 16, color: "#B85C82", margin: "0 0 8px" }}>처음부터 다시 시작할까요?</h2>
            <p style={{ fontSize: 12.5, color: "#6A5A66", lineHeight: 1.7, margin: "0 0 16px" }}>
              모은 추억·하트·티켓·소원권이<br />전부 사라지고 온보딩으로 돌아가요.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={() => setConfirmReset(false)} style={{
                background: "#fff", color: "#6A5A66", border: "2px solid var(--lav)",
                borderRadius: 12, padding: "10px 18px", fontSize: 13,
              }}>취소</button>
              <button className="btn-rose" onClick={doReset} style={{ fontSize: 13, padding: "10px 18px" }}>
                초기화하고 처음으로
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
