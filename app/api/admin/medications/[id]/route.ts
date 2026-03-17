import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function adminUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session.user;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const data = Object.fromEntries(await req.formData());
  const method = String(data._method || "put").toLowerCase();

  if (method === "delete") {
    await prisma.medicationMaster.delete({ where: { id: params.id } });
    await prisma.adminLog.create({ data: { adminUserId: admin.id, action: "DELETE", entity: "MedicationMaster", entityId: params.id, diffJson: data as any } });
    return NextResponse.redirect(new URL("/admin/medications", req.url));
  }

  if (method === "patch") {
    const source = await prisma.sourceLink.create({ data: { medicationId: params.id, type: String(data.sourceType) as any, value: String(data.sourceValue), label: String(data.sourceLabel || "") } });
    await prisma.adminLog.create({ data: { adminUserId: admin.id, action: "ADD_SOURCE", entity: "SourceLink", entityId: source.id, diffJson: source as any } });
    return NextResponse.redirect(new URL(`/admin/medications/${params.id}`, req.url));
  }

  const updated = await prisma.medicationMaster.update({
    where: { id: params.id },
    data: {
      drugName: String(data.drugName), brandName: String(data.brandName || ""), activeIngredient: String(data.activeIngredient), drugClass: String(data.drugClass), indications: String(data.indications), sideEffectsCommon: String(data.sideEffectsCommon), sideEffectsSerious: String(data.sideEffectsSerious), contraindications: String(data.contraindications), warningsPregnancy: String(data.warningsPregnancy), warningsRenal: String(data.warningsRenal), warningsHepatic: String(data.warningsHepatic), isVisible: data.isVisible === "on"
    }
  });
  await prisma.adminLog.create({ data: { adminUserId: admin.id, action: "UPDATE", entity: "MedicationMaster", entityId: updated.id, diffJson: updated as any } });
  return NextResponse.redirect(new URL(`/admin/medications/${params.id}`, req.url));
}
