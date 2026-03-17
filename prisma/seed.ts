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
    ["Losartan","Cozaar","losartan","Antihypertensive","Hypertension","dizziness","kidney injury","pregnancy contraindicated","avoid in pregnancy","monitor renal function","use caution"],
    ["Hydrochlorothiazide","Microzide","hydrochlorothiazide","Diuretic","Hypertension, edema","urination, dizziness","electrolyte imbalance","anuria","discuss with OB","monitor electrolytes","caution"],
    ["Metformin","Glucophage","metformin","Antidiabetic","Type 2 diabetes","GI upset","lactic acidosis","severe renal impairment","review risk-benefit","avoid eGFR<30","hepatic disease caution"],
    ["Insulin glargine","Lantus","insulin glargine","Antidiabetic","Diabetes","hypoglycemia","severe hypoglycemia","hypersensitivity","per clinician","monitor","monitor"],
    ["Warfarin","Coumadin","warfarin","Anticoagulant","Thromboembolism prevention","bruising","major bleeding","pregnancy contraindicated","avoid in pregnancy","monitor INR","use caution"],
    ["Apixaban","Eliquis","apixaban","Anticoagulant","Atrial fibrillation, VTE","bleeding","major bleeding","active bleeding","consult OB","renal dose caution","hepatic caution"],
    ["Sertraline","Zoloft","sertraline","SSRI","Depression/anxiety","nausea","serotonin syndrome","MAOI use","per clinician","dose adjust possible","monitor"],
    ["Fluoxetine","Prozac","fluoxetine","SSRI","Depression","insomnia","serotonin syndrome","MAOI use","consult OB","usually safe","hepatic caution"],
    ["Diazepam","Valium","diazepam","Benzodiazepine","Anxiety/spasm","drowsy","resp depression","myasthenia gravis","avoid unless advised","caution","caution"],
    ["Alprazolam","Xanax","alprazolam","Benzodiazepine","Anxiety","sedation","resp depression","acute narrow-angle glaucoma","avoid unless advised","caution","caution"],
    ["Cetirizine","Zyrtec","cetirizine","Antihistamine","Allergy","dry mouth","sedation","hypersensitivity","generally okay","dose reduce if severe CKD","limited concerns"],
    ["Diphenhydramine","Benadryl","diphenhydramine","Sedating antihistamine","Allergy","drowsiness","confusion","narrow angle glaucoma","consult","elderly caution","caution"],
    ["Ibuprofen","Advil","ibuprofen","NSAID","Pain/fever","heartburn","GI bleed","ulcer disease","avoid late pregnancy","renal injury risk","hepatic caution"],
    ["Naproxen","Aleve","naproxen","NSAID","Pain/inflammation","GI upset","GI bleed","ulcer disease","avoid late pregnancy","renal risk","hepatic caution"],
    ["Atorvastatin","Lipitor","atorvastatin","Statin","Hyperlipidemia","muscle aches","rhabdomyolysis","active liver disease","avoid in pregnancy","monitor","monitor LFTs"],
    ["Rosuvastatin","Crestor","rosuvastatin","Statin","Hyperlipidemia","myalgia","rhabdomyolysis","active liver disease","avoid in pregnancy","renal caution","monitor"],
    ["Omeprazole","Prilosec","omeprazole","PPI","GERD","headache","C diff risk","hypersensitivity","generally safe","no major issue","caution long-term"],
    ["Pantoprazole","Protonix","pantoprazole","PPI","GERD","headache","hypomagnesemia","hypersensitivity","generally safe","no major issue","caution"],
    ["Acetaminophen","Tylenol","acetaminophen","Analgesic","Pain/fever","nausea","liver toxicity","severe liver disease","generally safe","usually safe","dose caution"],
    ["Aspirin","Bayer","acetylsalicylic acid","Antiplatelet","Pain / cardioprotection","dyspepsia","bleeding","active bleeding","avoid near delivery","renal caution","hepatic caution"],
    ["Vitamin D","","cholecalciferol","Supplement","Deficiency","mild GI upset","hypercalcemia","hypercalcemia","generally safe","generally safe","generally safe"],
    ["Vitamin B12","","cyanocobalamin","Supplement","Deficiency","rare rash","rare allergy","cobalt allergy","generally safe","generally safe","generally safe"],
    ["Magnesium","","magnesium","Supplement","Deficiency, cramps","diarrhea","high Mg in CKD","severe renal failure","consult","renal caution","safe"],
    ["Iron","","ferrous sulfate","Supplement","Iron deficiency","constipation","overdose","hemochromatosis","consult","safe","safe"],
    ["Calcium","","calcium carbonate","Supplement","Bone health","constipation","hypercalcemia","hypercalcemia","consult","kidney stone caution","safe"],
    ["Omega-3","","omega-3 fatty acids","Supplement","Triglycerides","fishy taste","bleeding risk","fish allergy","generally safe","safe","safe"],
    ["St. John's Wort","","hypericum perforatum","Herbal supplement","Mood support","GI upset","serotonin syndrome","bipolar caution","avoid unless advised","safe","safe"],
    ["Melatonin","","melatonin","Supplement","Sleep support","drowsiness","confusion","autoimmune caution","consult","safe","safe"]
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
    { kind: "DRUG_DRUG", a: "aspirin", b: "apixaban", riskLevel: "HIGH", mechanism: "Bleeding risk increases", recommendation: "Use only if clinician advised." },
    { kind: "DRUG_DRUG", a: "vitamin d", b: "amlodipine", riskLevel: "LOW", mechanism: "No major interaction expected", recommendation: "Use as directed." },
    { kind: "DRUG_DRUG", a: "magnesium", b: "levothyroxine", riskLevel: "MODERATE", mechanism: "Reduced absorption", recommendation: "Separate administration times." }
  ] });

  const hash = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({ where: { email: "admin@medai.local" }, update: {}, create: { email: "admin@medai.local", passwordHash: hash, role: "ADMIN", timezone: "UTC" } });

  console.log("Seed completed with expanded medications and supplements list");
}

main().finally(() => prisma.$disconnect());
