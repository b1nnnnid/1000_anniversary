import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

async function getOrCreate() {
  let p = await prisma.progress.findFirst();
  if (!p) p = await prisma.progress.create({ data: {} });
  return p;
}

function shape(p: { collectedSpots: string; hearts: number; tickets: number }) {
  return {
    collectedSpots: JSON.parse(p.collectedSpots) as string[],
    hearts: p.hearts,
    tickets: p.tickets,
  };
}

export async function GET() {
  return NextResponse.json(shape(await getOrCreate()));
}

export async function POST(req: Request) {
  const body = await req.json();
  const p = await getOrCreate();
  const collected: string[] = JSON.parse(p.collectedSpots);
  let hearts = p.hearts;
  let tickets = p.tickets;

  if (body.collectSpot && !collected.includes(body.collectSpot)) {
    collected.push(body.collectSpot);
    hearts += 1;
  }
  if (typeof body.addHearts === "number") hearts += body.addHearts;
  if (typeof body.addTickets === "number") tickets = Math.max(0, tickets + body.addTickets);

  const updated = await prisma.progress.update({
    where: { id: p.id },
    data: { collectedSpots: JSON.stringify(collected), hearts, tickets },
  });
  return NextResponse.json(shape(updated));
}
