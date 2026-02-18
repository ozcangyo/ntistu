import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DISCLAIMER, detectRedFlags, emergencyBanner } from "@/lib/safety";
import { nextDoseFromTimes } from "@/lib/schedule";
import { evaluateOTC } from "@/lib/interactions";

const systemPrompt = `You are MedAI educational assistant. Never diagnose, prescribe, or alter individualized dosing.
Always format response with: A) Summary, B) Your current medications, C) Interaction/safety checks, D) Practical guidance, E) Reminder status, F) Red-flag evaluation, G) Disclaimer.
Include exact disclaimer: ${DISCLAIMER}`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json().catch(() => ({}));
    const message = String(body?.message || "");
    const redFlagLevel = detectRedFlags(message);

    let regimen: any[] = [];
    let rules: any[] = [];

    try {
      if (session?.user?.id) {
        regimen = await prisma.userMedication.findMany({
          where: { userId: session.user.id },
          include: { medication: true }
        });
      }
      rules = await prisma.interactionRule.findMany();
    } catch {
      regimen = [];
      rules = [];
    }

    const nextDose = regimen[0] ? nextDoseFromTimes(regimen[0].scheduleTimes) : null;

    let otcResult: any = null;
    const otcMatch = message.match(/take\s+([a-zA-Z0-9\-\s'.]+)\s+with my meds/i);
    if (otcMatch?.[1]) otcResult = evaluateOTC(otcMatch[1].trim(), regimen as any, rules as any);

    const sections: any = {
      summary: ["Educational support only."],
      currentMedications: regimen.length
        ? regimen.map((r) => `${r.medication.drugName} (${r.medication.activeIngredient}) @ ${r.scheduleTimes.join(", ")}`)
        : ["No saved regimen context. Please login and add medications for personalized context."],
      interactionSafety: otcResult || { riskLevel: "LOW", note: "No OTC checker trigger found in the message." },
      practicalGuidance: ["Never double dose after missed dose.", "Use package label/leaflet and confirm with pharmacist."],
      reminderStatus: nextDose ? `Next dose: ${nextDose.next.toLocaleString()} (${nextDose.humanRemaining})` : "No next dose available.",
      redFlagEvaluation: redFlagLevel,
      disclaimer: DISCLAIMER
    };

    if (process.env.OPENAI_API_KEY) {
      try {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `User message: ${message}\nContext: ${JSON.stringify(sections)}` }
          ],
          temperature: 0.2
        });
        sections.summary = [completion.choices[0]?.message?.content || sections.summary[0]];
      } catch {
        sections.summary = ["AI service is temporarily unavailable. Showing safe fallback guidance."];
      }
    }

    return NextResponse.json({
      sections,
      redFlagLevel,
      emergencyBanner: emergencyBanner(redFlagLevel),
      disclaimer: DISCLAIMER,
      requiresLoginForFullContext: !session?.user?.id
    });
  } catch {
    return NextResponse.json(
      {
        sections: {
          summary: ["Unexpected error occurred. Please try again."],
          disclaimer: DISCLAIMER
        },
        redFlagLevel: "LOW",
        emergencyBanner: null,
        disclaimer: DISCLAIMER,
        requiresLoginForFullContext: true
      },
      { status: 200 }
    );
  }
}
