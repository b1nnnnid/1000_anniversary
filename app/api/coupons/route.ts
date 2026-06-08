import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const coupons = await prisma.coupon.findMany({ orderBy: { earnedAt: "desc" } });
  return NextResponse.json(coupons);
}

export async function POST(req: Request) {
  const { title, emoji } = await req.json();
  const coupon = await prisma.coupon.create({ data: { title, emoji: emoji ?? "🎁" } });
  return NextResponse.json(coupon);
}

export async function PATCH(req: Request) {
  const { id, used } = await req.json();
  const coupon = await prisma.coupon.update({ where: { id }, data: { used } });
  return NextResponse.json(coupon);
}
