import type { SqlTableConfig } from "@/lib/game/sqlEngine";
import type { Mail } from "@/content/emails";

/** When a follow-up message becomes visible in the inbox. */
export type FollowUpStage = "accepted" | "sql" | "solved";

/** Narrative mail that lands as the case advances. */
export type CaseFollowUp = Mail & { showAfter: FollowUpStage };

/**
 * A single line of enquiry in the lean investigation surface. Lean cases
 * (no bespoke browsable machine) collect their clues by pursuing leads.
 */
export type CaseLead = {
  id: string;
  /** The clue this lead files once pursued. Must be one of `clues`. */
  clueId: string;
  label: string;
  detail: string;
  /** Pursuing this lead brings the query engine online. */
  unlocksSql?: boolean;
};

/**
 * The contract between a case's content and the generic shell/engine components.
 * Each case exports one of these; the components accept one.
 * Adding a new case means satisfying this type — nothing else needs to change.
 */
export type CaseConfig = {
  id: string;
  title: string;
  /** One-paragraph brief shown in the Case Files dossier. */
  summary: string;

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

  /** The priority message that offers the case, shown in the Inbox. */
  assignment: {
    email: Mail;
    /** Blurb beside the ACCEPT button and in the "case assigned" dialog. */
    acceptSummary: string;
  };

  /** Mail that arrives as the case advances. May be empty. */
  followUps: CaseFollowUp[];

  /** One-line objective shown above the SQL query box. */
  sqlPrompt: string;
  /** Seed text placed in the SQL query editor. */
  sqlPlaceholder: string;
  /** Result value blinked when the correct row is returned (e.g. the culprit). */
  solutionHighlight: string;
  /** Label on the button that closes the case from the SQL console. */
  solveButtonLabel: string;

  /** Idle QUERY.hlp mutterings while the detective works. May be empty. */
  assistantBarks: string[];

  /**
   * Minimal investigation surface. Cases that ship a bespoke browsable machine
   * (Case 001's My Computer + Log Viewer) omit this; lean cases collect their
   * clues by pursuing these leads in the Case Files app.
   */
  leads?: CaseLead[];
};
