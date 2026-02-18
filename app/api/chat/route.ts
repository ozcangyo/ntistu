import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DISCLAIMER, detectRedFlags, emergencyBanner } from "@/lib/safety";
import { nextDoseFromTimes } from "@/lib/schedule";
import { evaluateOTC } from "@/lib/interactions";

const systemPrompt = `You are MedAI educational assistant. Never diagnose, prescribe, or alter individualized dosing.
Always output concise JSON-ready sections with keys: summary, currentMedications, interactionSafety, practicalGuidance, reminderStatus, redFlagEvaluation, disclaimer.
Include exact disclaimer: ${DISCLAIMER}`;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();
  const redFlagLevel = detectRedFlags(message || "");
  const regimen = await prisma.userMedication.findMany({ where: { userId: session.user.id }, include: { medication: true } });
  const rules = await prisma.interactionRule.findMany();
  const nextDose = regimen[0] ? nextDoseFromTimes(regimen[0].scheduleTimes) : null;

  let otcResult: any = null;
  const otcMatch = String(message).match(/take\s+([a-zA-Z0-9\-\s]+)\s+with my meds/i);
  if (otcMatch?.[1]) otcResult = evaluateOTC(otcMatch[1].trim(), regimen as any, rules);

  const context = {
    regimen: regimen.map((r) => ({ drug: r.medication.drugName, activeIngredient: r.medication.activeIngredient, schedule: r.scheduleTimes })),
    nextDose: nextDose ? { at: nextDose.next.toISOString(), remaining: nextDose.humanRemaining } : null,
    otcCheck: otcResult,
    redFlagLevel
  };

  let sections: any = {
    summary: ["Educational support only."],
    currentMedications: context.regimen,
    interactionSafety: otcResult || { riskLevel: "LOW", note: "No OTC requested." },
    practicalGuidance: ["Do not double dose after a missed dose.", "Use medication label and consult a pharmacist."],
    reminderStatus: context.nextDose,
    redFlagEvaluation: redFlagLevel,
    disclaimer: DISCLAIMER
  };

  if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User message: ${message}\nContext: ${JSON.stringify(context)}` }
      ],
      temperature: 0.2
    });
    const text = completion.choices[0]?.message?.content || "";
    sections.summary = [text];
  }

  return NextResponse.json({ sections, redFlagLevel, emergencyBanner: emergencyBanner(redFlagLevel), disclaimer: DISCLAIMER });
}
