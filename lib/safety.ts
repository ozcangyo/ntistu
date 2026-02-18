export const DISCLAIMER = "This is not medical advice. Consult a licensed clinician/pharmacist.";

const emergencyKeywords = [
  "chest pain",
  "trouble breathing",
  "can\'t breathe",
  "severe allergic",
  "anaphylaxis",
  "stroke",
  "face droop",
  "slurred speech",
  "suicidal",
  "kill myself",
  "severe bleeding",
  "overdose"
];

export type TriageLevel = "LOW" | "MODERATE" | "HIGH" | "EMERGENCY";

export function detectRedFlags(text: string): TriageLevel {
  const normalized = text.toLowerCase();
  if (emergencyKeywords.some((k) => normalized.includes(k))) return "EMERGENCY";
  if (normalized.includes("faint") || normalized.includes("confused")) return "HIGH";
  if (normalized.includes("rash") || normalized.includes("vomit")) return "MODERATE";
  return "LOW";
}

export function emergencyBanner(level: TriageLevel) {
  if (level !== "EMERGENCY") return null;
  return "EMERGENCY: Seek immediate medical care or call your local emergency number now.";
}
