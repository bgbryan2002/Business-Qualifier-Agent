/**
 * Portfolio build-time vault reader.
 *
 * Scoped to the THREE actionable listings (L002, L003, L004) plus the buyer
 * profile and a few RUN-LOG entries. Mirrors apps/dashboard/lib/vault.ts in
 * shape so schemas stay in sync; differs in narrative selection.
 *
 * Server-only. Never imported from a client component.
 */

import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

const REPO_ROOT = path.resolve(process.cwd(), "..", "..");
const VAULT_ROOT = path.join(REPO_ROOT, "obsidian-vault");

export const NARRATIVE_LISTING_IDS = ["L002", "L003", "L004"] as const;
export type NarrativeListingId = (typeof NARRATIVE_LISTING_IDS)[number];

export type HardGateResult = "pass" | "fail" | "unknown";
export type DealClassification = "negotiable" | "future-target" | "flagged";

export interface BuyerProfile {
  id: string;
  as_of_date: string;
  capital: {
    liquid_usd: number;
    borrowing_capacity_usd: number;
    target_owner_profit_usd: number;
    sba_eligibility: "likely" | "unlikely" | "unknown";
  };
  operator_profile: {
    hours_per_week_available: number;
    involvement_level: string;
    skills: string[];
    industries_lived: string[];
  };
  geography: {
    home_metro: string;
    willing_to_relocate: boolean;
    max_commute_minutes: number;
    preferred_states: string[];
  };
  industry_preferences: {
    must_have: string[];
    must_avoid: string[];
    open_to: string[];
    license_willingness: string;
  };
  deal_constraints: {
    min_revenue_usd?: number;
    max_purchase_price?: number;
    max_payback_years?: number;
    min_seller_financing?: number;
    deal_breakers?: string[];
  };
}

export interface ListingPacket {
  listing_id: string;
  business_name?: string;
  industry?: string;
  state?: string;
  city?: string;
  asking_price_usd?: number;
  annual_revenue_usd?: number;
  sde_or_ebitda_usd?: number;
  metric_type?: "SDE" | "EBITDA" | "unknown";
  year_established?: number;
  employees?: number;
  real_estate?: string;
  owner_hours_per_week?: number | null;
  license_required?: string | null;
  broker?: string | null;
  source_url?: string;
  source_url_listing?: string;
  raw_text?: string;
  gaps_to_fill: string[];
  status: string;
  title: string;
  confidence: number;
  as_of_date: string;
  tags: string[];
  body_markdown: string;
}

export interface DealAssessment {
  listing_id: string;
  buyer_id: string;
  score_0_100: number | null;
  fit_summary: string;
  scored_at: string;
  subscores: {
    cash_flow_fit?: number;
    operator_fit?: number;
    geography_fit?: number;
    industry_fit?: number;
    deal_structure_fit?: number;
    diligence_risk?: number;
  };
  hard_gates: {
    target_owner_profit: HardGateResult;
    financing_feasibility: HardGateResult;
    license_transferability: HardGateResult;
  };
  top_risks: string[];
  top_opportunities: string[];
  status: string;
  confidence: number;
  body_markdown: string;
}

export interface DueDiligenceClaim {
  category: string;
  claim: string;
  source_url: string;
  retrieved_at: string;
  confidence: number;
  note?: string;
}

export interface DueDiligencePacket {
  listing_id: string;
  as_of_date: string;
  researcher_id: string;
  claims: DueDiligenceClaim[];
  red_flags: string[];
  follow_up_actions: string[];
  status: string;
  confidence: number;
  body_markdown: string;
}

export interface Memo {
  id: string;
  listing_id: string;
  title: string;
  status: string;
  as_of_date: string;
  source_url?: string;
  body_markdown: string;
}

export interface RunLogEntry {
  date: string;
  phase: string;
  headline: string;
  body: string;
  anchor: string;
}

export interface NarrativeDeal {
  id: NarrativeListingId;
  classification: DealClassification;
  one_line: string;
  listing: ListingPacket;
  assessment: DealAssessment | null;
  diligence: DueDiligencePacket | null;
  memo: Memo | null;
}

// ---------- Helpers ----------

function safeReadFile(file: string): string | null {
  try {
    if (!fs.existsSync(file)) return null;
    return fs.readFileSync(file, "utf-8");
  } catch {
    return null;
  }
}

function extractJsonBlock(body: string): Record<string, unknown> | null {
  const match = body.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function toNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

function toStringSafe(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  return [];
}

// ---------- Readers ----------

export function getBuyer(id = "buyer-001"): BuyerProfile {
  const file = path.join(VAULT_ROOT, "02-Buyers", "profiles", `${id}.json`);
  const raw = safeReadFile(file);
  if (!raw) {
    throw new Error(`Buyer profile not found at ${file}`);
  }
  return JSON.parse(raw) as BuyerProfile;
}

function listingFile(id: NarrativeListingId): string {
  const map: Record<NarrativeListingId, string> = {
    L002: "L002-franchise-cleaning-north-atlanta.md",
    L003: "L003-fedex-routes-atlanta.md",
    L004: "L004-gasket-replacement-savannah.md",
  };
  return path.join(VAULT_ROOT, "03-Deals", "listings", "draft", map[id]);
}

export function getListing(id: NarrativeListingId): ListingPacket {
  const file = listingFile(id);
  const raw = safeReadFile(file);
  if (!raw) throw new Error(`Listing ${id} not found at ${file}`);
  const parsed = matter(raw);
  const fm = parsed.data as Record<string, unknown>;
  const json = extractJsonBlock(parsed.content) ?? {};
  const source = (json.source as Record<string, unknown>) || {};
  return {
    listing_id: toStringSafe(json.listing_id, id),
    business_name: toStringSafe(json.business_name) || undefined,
    industry: toStringSafe(json.industry) || undefined,
    state: toStringSafe(json.state) || undefined,
    city: toStringSafe(json.city) || undefined,
    asking_price_usd:
      typeof json.asking_price_usd === "number" ? json.asking_price_usd : undefined,
    annual_revenue_usd:
      typeof json.annual_revenue_usd === "number" ? json.annual_revenue_usd : undefined,
    sde_or_ebitda_usd:
      typeof json.sde_or_ebitda_usd === "number" ? json.sde_or_ebitda_usd : undefined,
    metric_type: (json.metric_type as ListingPacket["metric_type"]) || undefined,
    year_established:
      typeof json.year_established === "number" ? json.year_established : undefined,
    employees: typeof json.employees === "number" ? json.employees : undefined,
    real_estate: toStringSafe(json.real_estate) || undefined,
    owner_hours_per_week:
      typeof json.owner_hours_per_week === "number"
        ? json.owner_hours_per_week
        : json.owner_hours_per_week === null
          ? null
          : undefined,
    license_required:
      typeof json.license_required === "string"
        ? json.license_required
        : json.license_required === null
          ? null
          : undefined,
    broker:
      typeof json.broker === "string"
        ? json.broker
        : json.broker === null
          ? null
          : undefined,
    source_url: toStringSafe(fm.source_url) || undefined,
    source_url_listing: toStringSafe(source.source_url_or_path) || undefined,
    raw_text: toStringSafe(json.raw_text) || undefined,
    gaps_to_fill: toStringArray(json.gaps_to_fill),
    status: toStringSafe(fm.status, "draft"),
    title: toStringSafe(fm.title, id),
    confidence: toNumber(fm.confidence, 0),
    as_of_date: toStringSafe(fm.as_of_date),
    tags: toStringArray(fm.tags),
    body_markdown: parsed.content,
  };
}

function assessmentFile(id: NarrativeListingId): string {
  return path.join(VAULT_ROOT, "03-Deals", "scored", "draft", `${id}-assessment.md`);
}

export function getAssessment(id: NarrativeListingId): DealAssessment | null {
  const raw = safeReadFile(assessmentFile(id));
  if (!raw) return null;
  const parsed = matter(raw);
  const fm = parsed.data as Record<string, unknown>;
  const json = extractJsonBlock(parsed.content) ?? {};
  const hg = (json.hard_gates as Record<string, unknown>) || {};
  const sub = (json.subscores as Record<string, unknown>) || {};
  return {
    listing_id: toStringSafe(json.listing_id, id),
    buyer_id: toStringSafe(json.buyer_id, "buyer-001"),
    score_0_100:
      typeof json.score_0_100 === "number"
        ? json.score_0_100
        : json.score_0_100 === null
          ? null
          : null,
    fit_summary: toStringSafe(json.fit_summary),
    scored_at: toStringSafe(json.scored_at),
    subscores: {
      cash_flow_fit: typeof sub.cash_flow_fit === "number" ? sub.cash_flow_fit : undefined,
      operator_fit: typeof sub.operator_fit === "number" ? sub.operator_fit : undefined,
      geography_fit: typeof sub.geography_fit === "number" ? sub.geography_fit : undefined,
      industry_fit: typeof sub.industry_fit === "number" ? sub.industry_fit : undefined,
      deal_structure_fit:
        typeof sub.deal_structure_fit === "number" ? sub.deal_structure_fit : undefined,
      diligence_risk: typeof sub.diligence_risk === "number" ? sub.diligence_risk : undefined,
    },
    hard_gates: {
      target_owner_profit:
        (toStringSafe(hg.target_owner_profit, "unknown") as HardGateResult) ?? "unknown",
      financing_feasibility:
        (toStringSafe(hg.financing_feasibility, "unknown") as HardGateResult) ?? "unknown",
      license_transferability:
        (toStringSafe(hg.license_transferability, "unknown") as HardGateResult) ?? "unknown",
    },
    top_risks: toStringArray(json.top_risks),
    top_opportunities: toStringArray(json.top_opportunities),
    status: toStringSafe(fm.status, "draft"),
    confidence: toNumber(fm.confidence, 0),
    body_markdown: parsed.content,
  };
}

function ddFile(id: NarrativeListingId): string {
  return path.join(VAULT_ROOT, "03-Deals", "due-diligence", "draft", `${id}-dd.md`);
}

export function getDueDiligence(id: NarrativeListingId): DueDiligencePacket | null {
  const raw = safeReadFile(ddFile(id));
  if (!raw) return null;
  const parsed = matter(raw);
  const fm = parsed.data as Record<string, unknown>;
  const json = extractJsonBlock(parsed.content) ?? {};
  const claims = Array.isArray(json.claims) ? (json.claims as unknown[]) : [];
  return {
    listing_id: toStringSafe(json.listing_id, id),
    as_of_date: toStringSafe(json.as_of_date),
    researcher_id: toStringSafe(json.researcher_id),
    claims: claims.map((c) => {
      const rec = c as Record<string, unknown>;
      return {
        category: toStringSafe(rec.category, "uncategorized"),
        claim: toStringSafe(rec.claim),
        source_url: toStringSafe(rec.source_url),
        retrieved_at: toStringSafe(rec.retrieved_at),
        confidence: toNumber(rec.confidence, 0),
        note: toStringSafe(rec.note) || undefined,
      };
    }),
    red_flags: toStringArray(json.red_flags),
    follow_up_actions: toStringArray(json.follow_up_actions),
    status: toStringSafe(fm.status, "draft"),
    confidence: toNumber(fm.confidence, 0),
    body_markdown: parsed.content,
  };
}

function memoFile(id: NarrativeListingId): string {
  return path.join(VAULT_ROOT, "03-Deals", "memos", "draft", `${id}-memo.md`);
}

export function getMemo(id: NarrativeListingId): Memo | null {
  const file = memoFile(id);
  const raw = safeReadFile(file);
  if (!raw) return null;
  const parsed = matter(raw);
  const fm = parsed.data as Record<string, unknown>;
  return {
    id: toStringSafe(fm.id, `${id}-memo`),
    listing_id: id,
    title: toStringSafe(fm.title, `${id}-memo`),
    status: toStringSafe(fm.status, "draft"),
    as_of_date: toStringSafe(fm.as_of_date),
    source_url: toStringSafe(fm.source_url) || undefined,
    body_markdown: parsed.content,
  };
}

const CLASSIFICATION: Record<NarrativeListingId, { classification: DealClassification; one_line: string }> = {
  L002: {
    classification: "negotiable",
    one_line: "Right business, gap conversation. Negotiate to close the thirty-three-thousand-dollar shortfall.",
  },
  L003: {
    classification: "future-target",
    one_line: "The right model, the wrong moment. Build the capital; this becomes possible in eighteen to twenty-four months.",
  },
  L004: {
    classification: "flagged",
    one_line: "What the system caught. Geography fail, plus a broker-pattern footprint that mattered later.",
  },
};

export function getNarrativeDeal(id: NarrativeListingId): NarrativeDeal {
  return {
    id,
    classification: CLASSIFICATION[id].classification,
    one_line: CLASSIFICATION[id].one_line,
    listing: getListing(id),
    assessment: getAssessment(id),
    diligence: getDueDiligence(id),
    memo: getMemo(id),
  };
}

export function getNarrativeDeals(): NarrativeDeal[] {
  return NARRATIVE_LISTING_IDS.map((id) => getNarrativeDeal(id));
}

/**
 * Parse RUN-LOG.md for the system-integrity narrative.
 * Each entry is delimited by `## YYYY-MM-DD — Phase X — Headline`.
 */
export function getRunLogNarrative(): RunLogEntry[] {
  const file = path.join(REPO_ROOT, "RUN-LOG.md");
  const raw = safeReadFile(file);
  if (!raw) return [];
  const lines = raw.split("\n");
  const entries: RunLogEntry[] = [];
  let current: RunLogEntry | null = null;
  for (const line of lines) {
    const m = line.match(/^##\s+(\d{4}-\d{2}-\d{2})\s+—\s+([^—]+?)\s+—\s+(.+)$/);
    if (m) {
      if (current) entries.push(current);
      current = {
        date: m[1].trim(),
        phase: m[2].trim(),
        headline: m[3].trim(),
        body: "",
        anchor: m[3]
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      };
    } else if (current) {
      current.body += line + "\n";
    }
  }
  if (current) entries.push(current);
  // System-integrity surface wants the L007/L008 retraction + broker-pattern hardening + phase 3 partial.
  // Return the four Phase-3 entries in chronological order so the timeline reads naturally.
  return entries
    .filter((e) => /phase 3/i.test(e.phase) || /broker|retraction|verification|widened/i.test(e.headline))
    .slice(-6);
}

// ---------- Markdown rendering ----------

const _mdCache = new Map<string, string>();

export async function renderMarkdown(md: string): Promise<string> {
  const cached = _mdCache.get(md);
  if (cached) return cached;
  const file = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(md);
  const html = file.toString();
  _mdCache.set(md, html);
  return html;
}

// ---------- Derived numbers for /thesis and /next-steps ----------

export interface BuyerNumbers {
  liquid_usd: number;
  borrowing_capacity_usd: number;
  target_owner_profit_usd: number;
  hours_per_week: number;
  home_metro: string;
  as_of_date: string;
}

export function getBuyerNumbers(buyer = "buyer-001"): BuyerNumbers {
  const b = getBuyer(buyer);
  return {
    liquid_usd: b.capital.liquid_usd,
    borrowing_capacity_usd: b.capital.borrowing_capacity_usd,
    target_owner_profit_usd: b.capital.target_owner_profit_usd,
    hours_per_week: b.operator_profile.hours_per_week_available,
    home_metro: b.geography.home_metro,
    as_of_date: b.as_of_date,
  };
}
