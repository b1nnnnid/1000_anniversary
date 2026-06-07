import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

async function getOrCreate() {
  let p = await prisma.progress.findFirst();
  if (!p) p = await prisma.progress.create({ data: {} });
  return p;
}

export async function GET() {
  const p = await getOrCreate();
  return NextResponse.json({
    collectedSpots: JSON.parse(p.collectedSpots) as string[],
    hearts: p.hearts,
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const p = await getOrCreate();
  const collected: string[] = JSON.parse(p.collectedSpots);
  let hearts = p.hearts;

  if (body.collectSpot && !collected.includes(body.collectSpot)) {
    collected.push(body.collectSpot);
    hearts += 1;
  }
  if (typeof body.addHearts === "number") hearts += body.addHearts;

  const updated = await prisma.progress.update({
    where: { id: p.id },
    data: { collectedSpots: JSON.stringify(collected), hearts },
  });
  return NextResponse.json({
    collectedSpots: JSON.parse(updated.collectedSpots) as string[],
    hearts: updated.hearts,
  });
}
