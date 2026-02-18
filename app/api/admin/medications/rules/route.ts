import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const data = Object.fromEntries(await req.formData());
  const rule = await prisma.interactionRule.create({ data: { kind: String(data.kind) as any, a: String(data.a), b: String(data.b), riskLevel: String(data.riskLevel) as any, mechanism: String(data.mechanism), recommendation: String(data.recommendation) } });
  await prisma.adminLog.create({ data: { adminUserId: session.user.id, action: "CREATE", entity: "InteractionRule", entityId: rule.id, diffJson: rule as any } });
  return NextResponse.redirect(new URL(req.headers.get("referer") || "/admin/medications", req.url));
}
