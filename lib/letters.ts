// 숨겨둔 편지들 — 티켓으로 하나씩 해금. 내용은 자유롭게 수정하세요.
export interface Letter {
  id: string;
  from: string;       // 보낸 사람
  title: string;      // 봉투에 적힌 한 줄
  body: string;       // 편지 본문
  cost: number;       // 여는 데 필요한 티켓
}

export const LETTERS: Letter[] = [
  { id: "l1", from: "설렌 숯댕이", title: "오빠랑 처음 손 잡은 날", cost: 1,
    body: "헤헤 기억 나? 오빠가 손 내밀었는데 내가 막 부끄러워서 잡지도 못했던 거?? 숯 그렇게 수줍게 군 거 오빵이가 첨이야!" },
  { id: "l2", from: "힝구리 숯댕이", title: "생각에 잠길 때", cost: 1,
    body: "나는 원래 걱정도 많고 불안정한 성격인데 오빠가 오히려 무덤덤하게 대처해서 나도 덤덤이가 된 것 같기두. 헤헤" },
  { id: "l3", from: "유감자 숯댕이", title: "늙크크 모먼트", cost: 1,
    body: "오빠가 치는 장난이 참 유치뽕짝 아재개그 같은데 이상하게 내 맘에 쏙 들어서 자존심 상해 ㅋㅋㅋ" },
  { id: "l4", from: "미래의 ???", title: "???", cost: 1,
    body: "오빠랑 평생 같이 살고시퍼 ㅎㅎ 나중에 나랑... ...  이잉이ㅣ이잉잉잉!!!!(요청 시 음성지원) 역시 그렇지??" },
];
