export type DetectedLang = "en" | "tr" | "ku";

const trHints = ["ve", "ilaç", "sağlık", "nasıl", "nedir", "miyim", "için", "doktor"];
const kuHints = ["چەند", "دەرمان", "تەنەو", "چۆن", "ئایا", "بۆ", "سڵاو"];

export function detectMessageLanguage(text: string): DetectedLang {
  const lower = text.toLowerCase();
  if (kuHints.some((h) => lower.includes(h))) return "ku";
  if (trHints.some((h) => lower.includes(h))) return "tr";
  return "en";
}

export function localizedOutOfScope(lang: DetectedLang) {
  if (lang === "tr") return "Bu platform yalnızca ilaç ve sağlık bilgileri konusunda destek sunmaktadır.";
  if (lang === "ku") return "ئەم پلاتفۆرمە تەنها لە بابەتی دەرمان و زانیاری تەندروستی پشتگیری پێشکەش دەکات.";
  return "This platform provides support only for medication and health information.";
}

const domainKeywords = [
  "med", "drug", "medicine", "dose", "dosage", "interaction", "side effect", "symptom", "health", "otc", "supplement",
  "pill", "tablet", "capsule", "doctor", "pharmacy", "pharmacist", "disease", "treatment", "pain",
  "ilaç", "doz", "etkileşim", "yan etki", "semptom", "sağlık", "eczacı", "doktor",
  "دەرمان", "تەندروستی", "نیشانە", "ئێش", "دۆز"
];

export function isMedicalDomainQuestion(text: string) {
  const lower = text.toLowerCase();
  return domainKeywords.some((k) => lower.includes(k));
}
