import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") throw new Error("Forbidden");
  return session.user;
}

export async function POST(req: Request) {
  try {
    const admin = await assertAdmin();
    const data = Object.fromEntries(await req.formData());
    const med = await prisma.medicationMaster.create({ data: {
      drugName: String(data.drugName), brandName: String(data.brandName || ""), activeIngredient: String(data.activeIngredient), drugClass: String(data.drugClass), indications: String(data.indications), sideEffectsCommon: String(data.sideEffectsCommon), sideEffectsSerious: String(data.sideEffectsSerious), contraindications: String(data.contraindications), warningsPregnancy: String(data.warningsPregnancy), warningsRenal: String(data.warningsRenal), warningsHepatic: String(data.warningsHepatic)
    } });
    await prisma.adminLog.create({ data: { adminUserId: admin.id, action: "CREATE", entity: "MedicationMaster", entityId: med.id, diffJson: med as any } });
    return NextResponse.redirect(new URL("/admin/medications", req.url));
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
