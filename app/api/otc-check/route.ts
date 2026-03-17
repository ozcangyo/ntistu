import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateOTC } from "@/lib/interactions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { otc } = await req.json();
  const regimen = await prisma.userMedication.findMany({ where: { userId: session.user.id }, include: { medication: { select: { drugName: true, activeIngredient: true, drugClass: true } } } });
  const rules = await prisma.interactionRule.findMany();
  return NextResponse.json(evaluateOTC(otc, regimen as any, rules));
}
