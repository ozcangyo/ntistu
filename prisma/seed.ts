import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.sourceLink.deleteMany();
  await prisma.interactionRule.deleteMany();
  await prisma.medicationMaster.deleteMany();
  await prisma.adminLog.deleteMany();

  const meds = [
    ["Lisinopril","Zestril","lisinopril","Antihypertensive","Hypertension","cough,dizziness","angioedema","pregnancy contraindicated","avoid in pregnancy","monitor creatinine","monitor potassium"],
    ["Amlodipine","Norvasc","amlodipine","Antihypertensive","Hypertension, angina","ankle swelling","hypotension","severe aortic stenosis caution","discuss with OB","use cautiously","usually safe"],
    ["Metformin","Glucophage","metformin","Antidiabetic","Type 2 diabetes","GI upset","lactic acidosis","severe renal impairment","review risk-benefit","avoid eGFR<30","hepatic disease caution"],
    ["Warfarin","Coumadin","warfarin","Anticoagulant","Thromboembolism prevention","bruising","major bleeding","pregnancy contraindicated","avoid in pregnancy","monitor INR","use caution"],
    ["Sertraline","Zoloft","sertraline","SSRI","Depression/anxiety","nausea","serotonin syndrome","MAOI use","per clinician","dose adjust possible","monitor"],
    ["Diazepam","Valium","diazepam","Benzodiazepine","Anxiety/spasm","drowsy","resp depression","myasthenia gravis","avoid unless advised","caution","caution"],
    ["Cetirizine","Zyrtec","cetirizine","Antihistamine","Allergy","dry mouth","sedation","hypersensitivity","generally okay","dose reduce if severe CKD","limited concerns"],
    ["Ibuprofen","Advil","ibuprofen","NSAID","Pain/fever","heartburn","GI bleed","ulcer disease","avoid late pregnancy","renal injury risk","hepatic caution"],
    ["Atorvastatin","Lipitor","atorvastatin","Statin","Hyperlipidemia","muscle aches","rhabdomyolysis","active liver disease","avoid in pregnancy","monitor","monitor LFTs"],
    ["Omeprazole","Prilosec","omeprazole","PPI","GERD","headache","C diff risk","hypersensitivity","generally safe","no major issue","caution long-term"]
  ];

  for (const m of meds) {
    const med = await prisma.medicationMaster.create({ data: {
      drugName:m[0], brandName:m[1], activeIngredient:m[2], drugClass:m[3], indications:m[4], sideEffectsCommon:m[5], sideEffectsSerious:m[6], contraindications:m[7], warningsPregnancy:m[8], warningsRenal:m[9], warningsHepatic:m[10], isVisible:true
    }});
    await prisma.sourceLink.create({ data: { medicationId: med.id, type: "url", value: "https://www.fda.gov/drugs", label: "FDA" } });
  }

  await prisma.interactionRule.createMany({ data: [
    { kind: "DRUG_DRUG", a: "ibuprofen", b: "warfarin", riskLevel: "HIGH", mechanism: "Increased bleeding risk", recommendation: "Avoid combination unless clinician directs; ask pharmacist." },
    { kind: "DRUG_CLASS", a: "sedating antihistamine", b: "benzodiazepine", riskLevel: "HIGH", mechanism: "Additive CNS depression", recommendation: "Avoid co-use; monitor sedation, seek pharmacist advice." },
    { kind: "OTC_CLASS", a: "st. john's wort", b: "ssri", riskLevel: "HIGH", mechanism: "Serotonergic effects", recommendation: "Avoid due to serotonin syndrome risk." },
    { kind: "DRUG_DRUG", a: "vitamin d", b: "amlodipine", riskLevel: "LOW", mechanism: "No major interaction expected", recommendation: "Use as directed." }
  ] });

  const hash = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({ where: { email: "admin@medai.local" }, update: {}, create: { email: "admin@medai.local", passwordHash: hash, role: "ADMIN", timezone: "UTC" } });

  console.log("Seed completed");
}

main().finally(() => prisma.$disconnect());
