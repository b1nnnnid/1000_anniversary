"use client";

export default function HelpModal({ onClose }: { onClose: () => void }) {
  const Row = ({ k, v }: { k: string; v: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
      <span style={{ flexShrink: 0, minWidth: 84, fontSize: 12, color: "#B85C82", fontWeight: 700 }}>{k}</span>
      <span style={{ fontSize: 12.5, color: "#6A5A66", lineHeight: 1.5 }}>{v}</span>
    </div>
  );
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 95, background: "rgba(90,74,85,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="pop pixel-border"
        style={{ background: "var(--cream)", borderRadius: 16, maxWidth: 320, width: "100%", padding: "20px 18px" }}>
        <h2 style={{ fontSize: 17, color: "#B85C82", textAlign: "center", margin: "0 0 14px" }}>조작법 ❓</h2>
        <Row k="이동" v="화면 아래 방향 버튼 또는 키보드 방향키 / WASD" />
        <Row k="추억 열기" v="사진 액자 스팟에 캐릭터를 올려놓기" />
        <Row k="숨은 하트" v="풀숲 구석을 돌아다니며 💗 줍기 (티켓 +1)" />
        <Row k="고양이" v="❗ 뜨면 다가와 말 걸어요. 가까이 가도 OK" />
        <Row k="우리집" v="우측 💗 버튼 → 콘텐츠 모음 (탐방 완료 후 열림)" />
        <Row k="처음으로" v="우측 🏠 버튼 → 진행 초기화" />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button className="btn-rose" onClick={onClose} style={{ fontSize: 14, padding: "10px 24px" }}>알겠어요 ♥</button>
        </div>
      </div>
    </div>
  );
}
