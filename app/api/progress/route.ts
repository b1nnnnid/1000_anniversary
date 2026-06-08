import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const FRAG_PER_TICKET = 5;

async function getOrCreate() {
  let p = await prisma.progress.findFirst();
  if (!p) p = await prisma.progress.create({ data: {} });
  return p;
}

function shape(p: { collectedSpots: string; hearts: number; tickets: number; heartPieces: string; fragments: number }) {
  return {
    collectedSpots: JSON.parse(p.collectedSpots) as string[],
    hearts: p.hearts,
    tickets: p.tickets,
    fragments: p.fragments,
    heartPieces: JSON.parse(p.heartPieces) as string[],
  };
}

export async function GET() {
  return NextResponse.json(shape(await getOrCreate()));
}

export async function POST(req: Request) {
  const body = await req.json();
  const p = await getOrCreate();
  const collected: string[] = JSON.parse(p.collectedSpots);
  const pieces: string[] = JSON.parse(p.heartPieces);
  let hearts = p.hearts;
  let tickets = p.tickets;
  let fragments = p.fragments;

  if (body.collectSpot && !collected.includes(body.collectSpot)) {
    collected.push(body.collectSpot);
    hearts += 1;
  }
  if (body.collectHeart && !pieces.includes(body.collectHeart)) {
    pieces.push(body.collectHeart);
    fragments += 1; // 하트 조각 1개 = 티켓 조각 1개
  }
  if (typeof body.addFragments === "number") fragments += body.addFragments;
  if (typeof body.addHearts === "number") hearts += body.addHearts;
  if (typeof body.spendTicket === "number") tickets = Math.max(0, tickets - body.spendTicket);

  // 조각 5개 모이면 티켓으로 자동 합성
  if (fragments >= FRAG_PER_TICKET) {
    const gained = Math.floor(fragments / FRAG_PER_TICKET);
    tickets += gained;
    fragments = fragments % FRAG_PER_TICKET;
  }

  const updated = await prisma.progress.update({
    where: { id: p.id },
    data: { collectedSpots: JSON.stringify(collected), heartPieces: JSON.stringify(pieces), hearts, tickets, fragments },
  });
  return NextResponse.json(shape(updated));
}

export async function DELETE() {
  await prisma.coupon.deleteMany();
  await prisma.progress.deleteMany();
  return NextResponse.json({ ok: true });
}
