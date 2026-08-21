import type { CaseConfig } from "./caseTypes";
import { caseConfig as case001 } from "./case001";
import { caseConfig as case002 } from "./case002";

export const caseRegistry: Record<string, CaseConfig> = {
  "001": case001,
  "002": case002,
};

export function getCaseConfig(caseId: string): CaseConfig {
  const config = caseRegistry[caseId];
  if (!config) throw new Error(`Case ${caseId} not found in registry`);
  return config;
}
