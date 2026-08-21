import type { SqlTableConfig } from "@/lib/game/sqlEngine";

/**
 * The contract between a case's content and the generic shell/engine components.
 * Each case exports one of these; the components accept one.
 * Adding a new case means satisfying this type — nothing else needs to change.
 */
export type CaseConfig = {
  id: string;
  title: string;

  /** Injected into createSqlEngine — the query engine is already parameterised. */
  sqlTable: SqlTableConfig;

  /** Typed line by line into the SQL console when the warrant arrives. */
  warrantScript: string[];

  /** Two-cell brief above the query box. Pressure, never answers. */
  proofBrief: { heading: string; line: string }[];

  /** Lines the console reveals one beat at a time after the correct query. */
  revealScript: string[];

  /** Lines printed in the case-closed report after the CASE CLOSED stamp. */
  epilogue: string[];

  /** Evidence the detective must file before the query engine unlocks. */
  clues: { id: string; label: string; detail: string }[];
};
