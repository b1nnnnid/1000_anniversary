import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const HEARTS_PER_TICKET = 5;

async function getOrCreate() {
  let p = await prisma.progress.findFirst();
  if (!p) p = await prisma.progress.create({ data: {} });
  return p;
}

function shape(p: { collectedSpots: string; hearts: number; tickets: number; heartPieces: string }) {
  return {
    collectedSpots: JSON.parse(p.collectedSpots) as string[],
    hearts: p.hearts,
    tickets: p.tickets,
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

  if (body.collectSpot && !collected.includes(body.collectSpot)) {
    collected.push(body.collectSpot);
    hearts += 1;
  }
  if (body.collectHeart && !pieces.includes(body.collectHeart)) {
    pieces.push(body.collectHeart);
    if (pieces.length % HEARTS_PER_TICKET === 0) tickets += 1; // 5개마다 티켓
  }
  if (typeof body.addHearts === "number") hearts += body.addHearts;
  if (typeof body.addTickets === "number") tickets = Math.max(0, tickets + body.addTickets);

  const updated = await prisma.progress.update({
    where: { id: p.id },
    data: {
      collectedSpots: JSON.stringify(collected),
      heartPieces: JSON.stringify(pieces),
      hearts, tickets,
    },
  });
  return NextResponse.json(shape(updated));
}
