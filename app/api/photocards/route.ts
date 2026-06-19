import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 포토부스에서 즉석으로 남긴 1000일 추억카드
export async function GET() {
  const cards = await prisma.photoCard.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(cards);
}

export async function POST(req: Request) {
  const body = await req.json();
  const image: string = body.image ?? "";
  if (!image.startsWith("data:image")) {
    return NextResponse.json({ error: "이미지가 없어요" }, { status: 400 });
  }
  const card = await prisma.photoCard.create({
    data: {
      title: (body.title ?? "우리의 1000일").slice(0, 40),
      message: (body.message ?? "").slice(0, 120),
      date: body.date ?? "",
      dday: typeof body.dday === "number" ? body.dday : 1000,
      image,
    },
  });
  return NextResponse.json(card);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.photoCard.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
