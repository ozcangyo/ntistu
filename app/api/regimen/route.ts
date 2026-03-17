import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.formData();
  const userMed = await prisma.userMedication.create({
    data: {
      userId: session.user.id,
      medicationId: String(body.get("medicationId")),
      strength: String(body.get("strength")),
      frequency: String(body.get("frequency")),
      scheduleTimes: String(body.get("scheduleTimes")).split(",").map((t) => t.trim()),
      withFood: body.get("withFood") === "on",
      startDate: new Date(String(body.get("startDate")))
    }
  });
  return NextResponse.redirect(new URL("/dashboard/regimen", req.url));
}
