import { InteractionRule, RiskLevel, UserMedication } from "@prisma/client";

export type RegimenItem = UserMedication & {
  medication: { drugName: string; activeIngredient: string; drugClass: string };
};

export function evaluateOTC(otc: string, regimen: RegimenItem[], rules: InteractionRule[]) {
  const checks = regimen.flatMap((r) => {
    return rules.filter((rule) => {
      const left = rule.a.toLowerCase();
      const right = rule.b.toLowerCase();
      const otcLower = otc.toLowerCase();
      const med = r.medication.drugName.toLowerCase();
      const ing = r.medication.activeIngredient.toLowerCase();
      const cls = r.medication.drugClass.toLowerCase();

      if (rule.kind === "DRUG_DRUG") {
        return (left === otcLower && (right === med || right === ing)) || (right === otcLower && (left === med || left === ing));
      }
      if (rule.kind === "DRUG_CLASS") {
        return (left === otcLower && right === cls) || (right === otcLower && left === cls);
      }
      return left === otcLower || right === otcLower;
    }).map((rule) => ({
      medication: r.medication.drugName,
      riskLevel: rule.riskLevel,
      mechanism: rule.mechanism,
      recommendation: rule.recommendation
    }));
  });

  if (!checks.length) {
    return {
      riskLevel: "LOW" as RiskLevel,
      explanation: "No direct high-confidence rule match found in this MVP database.",
      actions: "Use label directions and ask a pharmacist if uncertain.",
      checks
    };
  }

  const highest = checks.some((c) => c.riskLevel === "HIGH")
    ? "HIGH"
    : checks.some((c) => c.riskLevel === "MODERATE")
      ? "MODERATE"
      : "LOW";

  return {
    riskLevel: highest as RiskLevel,
    explanation: checks.map((c) => `${c.medication}: ${c.mechanism}`).join("; "),
    actions: checks.map((c) => c.recommendation).join(" "),
    checks
  };
}
