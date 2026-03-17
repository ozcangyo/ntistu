import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json({ items: [] });

  let localItems: any[] = [];
  try {
    localItems = await prisma.medicationMaster.findMany({
      where: {
        isVisible: true,
        OR: [
          { drugName: { contains: q, mode: "insensitive" } },
          { activeIngredient: { contains: q, mode: "insensitive" } },
          { drugClass: { contains: q, mode: "insensitive" } }
        ]
      },
      take: 20,
      orderBy: { drugName: "asc" }
    });
  } catch {
    localItems = [];
  }

  let remoteItems: any[] = [];
  try {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${encodeURIComponent(q)}+openfda.brand_name:${encodeURIComponent(q)}&limit=20`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      remoteItems = (json.results || []).map((r: any, idx: number) => ({
        id: `fda-${idx}-${r.id || q}`,
        drugName: r.openfda?.brand_name?.[0] || r.openfda?.generic_name?.[0] || q,
        activeIngredient: r.openfda?.substance_name?.[0] || r.openfda?.generic_name?.[0] || "Unknown",
        drugClass: r.openfda?.pharm_class_epc?.[0] || "External source",
        external: true
      }));
    }
  } catch {
    remoteItems = [];
  }

  const dedup = new Map<string, any>();
  [...localItems, ...remoteItems].forEach((i) => dedup.set(i.drugName?.toLowerCase(), i));
  return NextResponse.json({ items: Array.from(dedup.values()).slice(0, 30) });
}
