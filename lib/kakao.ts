// 카카오톡 내보내기(txt) 파서 — PC/모바일 두 형식 지원, 전부 브라우저에서만 처리
export interface Msg { date: string | null; sender: string; hour: number; text: string; }

function to24(ampm: string, h: number) {
  if (ampm === "오전") return h === 12 ? 0 : h;
  return h === 12 ? 12 : h + 12;
}

export function parseKakao(raw: string): Msg[] {
  const lines = raw.split(/\r?\n/);
  const msgs: Msg[] = [];
  let curDate: string | null = null;

  const sep = /^-{5,}\s*(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/;
  const pc = /^\[(.+?)\]\s*\[(오전|오후)\s*(\d{1,2}):(\d{2})\]\s*(.*)$/;
  // 모바일: "2023년 10월 8일 오전 2:30, 이름 : 메시지" 또는 "2023. 10. 8. 오전 2:30, 이름 : 메시지"
  const mob = /^(\d{4})[.\s년]+(\d{1,2})[.\s월]+(\d{1,2})[.\s일]*\s*(오전|오후)\s*(\d{1,2}):(\d{2}),\s*(.+?)\s*:\s*([\s\S]*)$/;

  for (const line of lines) {
    const sm = line.match(sep);
    if (sm) { curDate = `${sm[1]}-${sm[2].padStart(2, "0")}-${sm[3].padStart(2, "0")}`; continue; }

    const mm = line.match(mob);
    if (mm) {
      msgs.push({
        date: `${mm[1]}-${mm[2].padStart(2, "0")}-${mm[3].padStart(2, "0")}`,
        sender: mm[7].trim(), hour: to24(mm[4], parseInt(mm[5])), text: mm[8].trim(),
      });
      continue;
    }
    const pm = line.match(pc);
    if (pm) {
      msgs.push({ date: curDate, sender: pm[1].trim(), hour: to24(pm[2], parseInt(pm[3])), text: pm[5].trim() });
      continue;
    }
    // 이어지는 줄(멀티라인 메시지)
    if (msgs.length && line.trim() && !line.startsWith("저장한 날짜") && !line.includes("님과 카카오톡 대화")) {
      msgs[msgs.length - 1].text += " " + line.trim();
    }
  }
  return msgs;
}

const STOP = new Set([
  "사진", "이모티콘", "동영상", "삭제된", "메시지입니다", "삭제된메시지입니다", "샵검색", "음성메시지",
  "그래", "그리고", "그래서", "근데", "진짜", "그냥", "지금", "나는", "내가", "너는", "우리", "오늘",
  "그거", "이거", "저거", "그게", "ㅋㅋ", "ㅋㅋㅋ", "ㅎㅎ", "ㅠㅠ", "응응", "그러게", "아니", "맞아",
  "https", "www", "com", "net",
]);

export interface Analysis {
  total: number;
  bySender: { name: string; count: number }[];
  words: { word: string; count: number }[];
  firstByDay: { name: string; count: number }[];
  lateNight: { name: string; count: number }[];
  lateTotal: number;
  busiestDay: { date: string; count: number } | null;
  totalChars: number;
  days: number;
}

export function analyze(msgs: Msg[]): Analysis {
  const senderCnt: Record<string, number> = {};
  const wordCnt: Record<string, number> = {};
  const firstSeen: Record<string, string> = {}; // date -> sender
  const dayCnt: Record<string, number> = {};
  const late: Record<string, number> = {};
  let totalChars = 0, lateTotal = 0;

  for (const m of msgs) {
    senderCnt[m.sender] = (senderCnt[m.sender] || 0) + 1;
    totalChars += m.text.length;
    if (m.date) {
      dayCnt[m.date] = (dayCnt[m.date] || 0) + 1;
      if (!firstSeen[m.date]) firstSeen[m.date] = m.sender;
    }
    if (m.hour >= 0 && m.hour < 5) { late[m.sender] = (late[m.sender] || 0) + 1; lateTotal++; }
    for (const w of m.text.split(/[^가-힣A-Za-z0-9]+/)) {
      if (w.length < 2 || STOP.has(w) || /^[ㄱ-ㅎㅏ-ㅣ]+$/.test(w)) continue;
      wordCnt[w] = (wordCnt[w] || 0) + 1;
    }
  }

  const firstCnt: Record<string, number> = {};
  for (const d in firstSeen) firstCnt[firstSeen[d]] = (firstCnt[firstSeen[d]] || 0) + 1;

  const top = (o: Record<string, number>, n: number) =>
    Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);

  const busiest = top(dayCnt, 1)[0];

  return {
    total: msgs.length,
    bySender: top(senderCnt, 6).map(([name, count]) => ({ name, count })),
    words: top(wordCnt, 12).map(([word, count]) => ({ word, count })),
    firstByDay: top(firstCnt, 6).map(([name, count]) => ({ name, count })),
    lateNight: top(late, 6).map(([name, count]) => ({ name, count })),
    lateTotal,
    busiestDay: busiest ? { date: busiest[0], count: busiest[1] } : null,
    totalChars,
    days: Object.keys(dayCnt).length,
  };
}
