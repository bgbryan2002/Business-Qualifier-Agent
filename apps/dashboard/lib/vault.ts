/**
 * Build-time vault reader.
 *
 * - Server-only. Never imported from a client component.
 * - Reads obsidian-vault/ markdown + JSON, parses frontmatter via gray-matter,
 *   pulls fenced JSON blocks ("```json ... ```") out of memo / packet bodies.
 * - Returns plain JSON-serializable objects so server components can safely
 *   pass them through to client components.
 * - Schemas mirror obsidian-vault/00-Claude-Control/SCHEMAS.md. Runtime
 *   validation is intentionally permissive: missing fields are coerced to
 *   sensible defaults rather than throwing — the vault is a living document
 *   and the dashboard's job is to show gaps, not crash on them.
 */

import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Resolve repo root relative to this file. The dashboard lives at
// <repo>/apps/dashboard/lib/vault.ts so the vault is two levels up.
const REPO_ROOT = path.resolve(process.cwd(), "..", "..");
const VAULT_ROOT = path.join(REPO_ROOT, "obsidian-vault");

export type HardGateResult = "pass" | "fail" | "unknown";

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
  scoring_weights_override?: Record<string, unknown>;
}

export interface ListingPacket {
  listing_id: string;
  business_name?: string;
  industry?: string;
  naics_code?: string;
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
  source?: {
    source_type?: string;
    source_url_or_path?: string;
    as_of_date?: string;
  };
  raw_text?: string;
  gaps_to_fill?: string[];
  // From frontmatter
  status: string;
  title: string;
  confidence: number;
  as_of_date: string;
  tags: string[];
  source_url?: string;
  // Body for display
  body_markdown: string;
}

export interface DealAssessment {
  listing_id: string;
  buyer_id: string;
  score_0_100: number | null;
  fit_summary: string;
  scored_at: string;
  subscores?: {
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
  diligence_packet_id?: string;
  top_risks?: string[];
  top_opportunities?: string[];
  // Frontmatter
  status: string;
  confidence: number;
  retraction_reason?: string;
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
  red_flags?: string[];
  follow_up_actions?: string[];
  // Frontmatter
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
  is_draft: boolean;
  is_retracted: boolean;
}

export interface Skill {
  id: string;
  title: string;
  category: string;
  source_url: string;
  source_repo?: string;
  license: string;
  confidence: number;
  status: string;
  tags: string[];
  body_markdown: string;
}

export interface EntityAdvisory {
  listing_id: string;
  buyer_id: string;
  options_considered: Array<{
    structure?: string;
    rationale?: string;
    tradeoffs?: string[];
    open_questions_for_advisor?: string[];
  }>;
  human_signoff_required: boolean;
  signoff_checklist_path?: string;
}

export interface RunLogEntry {
  date: string;
  phase: string;
  headline: string;
  anchor: string;
}

// ---------- Helpers ----------

function safeReadDir(dir: string): string[] {
  try {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

function safeReadFile(file: string): string | null {
  try {
    if (!fs.existsSync(file)) return null;
    return fs.readFileSync(file, "utf-8");
  } catch {
    return null;
  }
}

/** Pull the first fenced ```json``` block out of a markdown body. */
function extractJsonBlock(body: string): unknown | null {
  const match = body.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
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

export function getBuyer(id = "buyer-001"): BuyerProfile | null {
  const file = path.join(VAULT_ROOT, "02-Buyers", "profiles", `${id}.json`);
  const raw = safeReadFile(file);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BuyerProfile;
  } catch {
    return null;
  }
}

export function listBuyers(): BuyerProfile[] {
  const dir = path.join(VAULT_ROOT, "02-Buyers", "profiles");
  const files = safeReadDir(dir).filter((f) => f.endsWith(".json"));
  const out: BuyerProfile[] = [];
  for (const f of files) {
    const id = f.replace(/\.json$/, "");
    const b = getBuyer(id);
    if (b) out.push(b);
  }
  return out;
}

export function listListings(): ListingPacket[] {
  const dir = path.join(VAULT_ROOT, "03-Deals", "listings", "draft");
  const files = safeReadDir(dir).filter((f) => f.endsWith(".md"));
  const out: ListingPacket[] = [];
  for (const f of files) {
    const raw = safeReadFile(path.join(dir, f));
    if (!raw) continue;
    const parsed = matter(raw);
    const fm = parsed.data as Record<string, unknown>;
    const json =
      (extractJsonBlock(parsed.content) as Record<string, unknown> | null) ?? {};
    // Derive listing_id: prefer JSON, fall back to filename prefix (e.g. "L007-...md").
    const fmId = toStringSafe(fm.id);
    const fileListingId = f.match(/^(L\d+)/)?.[1];
    const listingId = toStringSafe(json.listing_id) || fileListingId || fmId || f.replace(/\.md$/, "");
    out.push({
      listing_id: listingId,
      business_name: toStringSafe(json.business_name) || undefined,
      industry: toStringSafe(json.industry) || undefined,
      naics_code: toStringSafe(json.naics_code) || undefined,
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
      source: (json.source as ListingPacket["source"]) || undefined,
      raw_text: toStringSafe(json.raw_text) || undefined,
      gaps_to_fill: toStringArray(json.gaps_to_fill),
      status: toStringSafe(fm.status, "draft"),
      title: toStringSafe(fm.title, toStringSafe(json.business_name, "Untitled listing")),
      confidence: toNumber(fm.confidence, 0),
      as_of_date: toStringSafe(fm.as_of_date),
      tags: toStringArray(fm.tags),
      source_url: toStringSafe(fm.source_url) || undefined,
      body_markdown: parsed.content,
    });
  }
  return out;
}

export function getListing(listingId: string): ListingPacket | null {
  return listListings().find((l) => l.listing_id === listingId) ?? null;
}

export function listAssessments(): DealAssessment[] {
  const dir = path.join(VAULT_ROOT, "03-Deals", "scored", "draft");
  const files = safeReadDir(dir).filter((f) => f.endsWith(".md"));
  const out: DealAssessment[] = [];
  for (const f of files) {
    const raw = safeReadFile(path.join(dir, f));
    if (!raw) continue;
    const parsed = matter(raw);
    const fm = parsed.data as Record<string, unknown>;
    const json =
      (extractJsonBlock(parsed.content) as Record<string, unknown> | null) ?? {};
    const hg = (json.hard_gates as Record<string, unknown>) || {};
    const fileListingId = f.match(/^(L\d+)/)?.[1];
    const listingId = toStringSafe(json.listing_id) || fileListingId || "";
    out.push({
      listing_id: listingId,
      buyer_id: toStringSafe(json.buyer_id, "buyer-001"),
      score_0_100:
        typeof json.score_0_100 === "number"
          ? json.score_0_100
          : json.score_0_100 === null
            ? null
            : null,
      fit_summary: toStringSafe(json.fit_summary),
      scored_at: toStringSafe(json.scored_at),
      subscores: (json.subscores as DealAssessment["subscores"]) || undefined,
      hard_gates: {
        target_owner_profit:
          (toStringSafe(hg.target_owner_profit, "unknown") as HardGateResult) ?? "unknown",
        financing_feasibility:
          (toStringSafe(hg.financing_feasibility, "unknown") as HardGateResult) ?? "unknown",
        license_transferability:
          (toStringSafe(hg.license_transferability, "unknown") as HardGateResult) ?? "unknown",
      },
      diligence_packet_id: toStringSafe(json.diligence_packet_id) || undefined,
      top_risks: toStringArray(json.top_risks),
      top_opportunities: toStringArray(json.top_opportunities),
      status: toStringSafe(fm.status, toStringSafe(json.status, "draft")),
      confidence: toNumber(fm.confidence, 0),
      retraction_reason: toStringSafe(json.retraction_reason) || undefined,
      body_markdown: parsed.content,
    });
  }
  return out;
}

export function getAssessment(listingId: string): DealAssessment | null {
  return listAssessments().find((a) => a.listing_id === listingId) ?? null;
}

export function listDueDiligence(): DueDiligencePacket[] {
  const dir = path.join(VAULT_ROOT, "03-Deals", "due-diligence", "draft");
  const files = safeReadDir(dir).filter((f) => f.endsWith(".md"));
  const out: DueDiligencePacket[] = [];
  for (const f of files) {
    const raw = safeReadFile(path.join(dir, f));
    if (!raw) continue;
    const parsed = matter(raw);
    const fm = parsed.data as Record<string, unknown>;
    const json =
      (extractJsonBlock(parsed.content) as Record<string, unknown> | null) ?? {};
    const claims = Array.isArray(json.claims) ? (json.claims as unknown[]) : [];
    const fileListingId = f.match(/^(L\d+)/)?.[1];
    out.push({
      listing_id: toStringSafe(json.listing_id) || fileListingId || "",
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
    });
  }
  return out;
}

export function getDueDiligence(listingId: string): DueDiligencePacket | null {
  return listDueDiligence().find((d) => d.listing_id === listingId) ?? null;
}

function readMemosFromDir(dir: string, isDraft: boolean): Memo[] {
  const files = safeReadDir(dir).filter((f) => f.endsWith(".md"));
  const out: Memo[] = [];
  for (const f of files) {
    const raw = safeReadFile(path.join(dir, f));
    if (!raw) continue;
    const parsed = matter(raw);
    const fm = parsed.data as Record<string, unknown>;
    const id = toStringSafe(fm.id, f.replace(/\.md$/, ""));
    // memo id like "L004-memo" — derive listing id
    const listingId = id.replace(/-memo$/i, "");
    const status = toStringSafe(fm.status, "draft");
    out.push({
      id,
      listing_id: listingId,
      title: toStringSafe(fm.title, id),
      status,
      as_of_date: toStringSafe(fm.as_of_date),
      source_url: toStringSafe(fm.source_url) || undefined,
      body_markdown: parsed.content,
      is_draft: isDraft,
      is_retracted:
        status === "rejected" ||
        status === "retracted" ||
        /retract/i.test(toStringSafe(fm.title)),
    });
  }
  return out;
}

export function listMemos(): Memo[] {
  const draftDir = path.join(VAULT_ROOT, "03-Deals", "memos", "draft");
  const publishedDir = path.join(VAULT_ROOT, "03-Deals", "memos", "published");
  return [...readMemosFromDir(draftDir, true), ...readMemosFromDir(publishedDir, false)];
}

export function getMemo(id: string): Memo | null {
  return listMemos().find((m) => m.id === id) ?? null;
}

export function getMemoForListing(listingId: string): Memo | null {
  return listMemos().find((m) => m.listing_id === listingId) ?? null;
}

export function listSkills(): Skill[] {
  const root = path.join(VAULT_ROOT, "01-Skills");
  const out: Skill[] = [];
  const categories = safeReadDir(root).filter((c) =>
    fs.statSync(path.join(root, c)).isDirectory()
  );
  for (const cat of categories) {
    const catDir = path.join(root, cat);
    const files = safeReadDir(catDir).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      const raw = safeReadFile(path.join(catDir, f));
      if (!raw) continue;
      const parsed = matter(raw);
      const fm = parsed.data as Record<string, unknown>;
      out.push({
        id: toStringSafe(fm.id, f.replace(/\.md$/, "")),
        title: toStringSafe(fm.title, f.replace(/\.md$/, "")),
        category: toStringSafe(fm.category, cat),
        source_url: toStringSafe(fm.source_url),
        source_repo: toStringSafe(fm.source_repo) || undefined,
        license: toStringSafe(fm.license, "unverified"),
        confidence: toNumber(fm.confidence, 0),
        status: toStringSafe(fm.status, "accepted"),
        tags: toStringArray(fm.tags),
        body_markdown: parsed.content,
      });
    }
  }
  return out;
}

export function getEntityAdvisory(_listingId: string): EntityAdvisory | null {
  // No entity advisory records exist yet. Schema-ready but returns null.
  return null;
}

/**
 * Parse the last N entries from RUN-LOG.md.
 * Entry format: `## YYYY-MM-DD — Phase X — Headline`
 */
export function getRecentRunLogEntries(limit = 5): RunLogEntry[] {
  const file = path.join(REPO_ROOT, "RUN-LOG.md");
  const raw = safeReadFile(file);
  if (!raw) return [];
  const lines = raw.split("\n");
  const entries: RunLogEntry[] = [];
  for (const line of lines) {
    const m = line.match(/^##\s+(\d{4}-\d{2}-\d{2})\s+—\s+([^—]+?)\s+—\s+(.+)$/);
    if (m) {
      entries.push({
        date: m[1].trim(),
        phase: m[2].trim(),
        headline: m[3].trim(),
        anchor: m[3]
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      });
    }
  }
  // Most-recent first
  return entries.reverse().slice(0, limit);
}

// ---------- Joined / derived ----------

export interface DealRow {
  listing: ListingPacket;
  assessment: DealAssessment | null;
  diligence: DueDiligencePacket | null;
  memo: Memo | null;
}

export function listDealRows(): DealRow[] {
  const listings = listListings();
  const assessments = listAssessments();
  const dd = listDueDiligence();
  const memos = listMemos();
  return listings.map((listing) => ({
    listing,
    assessment: assessments.find((a) => a.listing_id === listing.listing_id) ?? null,
    diligence: dd.find((d) => d.listing_id === listing.listing_id) ?? null,
    memo: memos.find((m) => m.listing_id === listing.listing_id) ?? null,
  }));
}

export function getDealRow(listingId: string): DealRow | null {
  const listing = getListing(listingId);
  if (!listing) return null;
  return {
    listing,
    assessment: getAssessment(listingId),
    diligence: getDueDiligence(listingId),
    memo: getMemoForListing(listingId),
  };
}

/** Broker-pattern flag: asking / SDE < 1.5×, per search-rubric-buyer-001.md */
export function detectBrokerPattern(listing: ListingPacket): {
  flagged: boolean;
  ratio: number | null;
  pattern: "sub-1.5x-sde" | null;
} {
  const asking = listing.asking_price_usd;
  const sde = listing.sde_or_ebitda_usd;
  if (!asking || !sde || sde <= 0) return { flagged: false, ratio: null, pattern: null };
  const ratio = asking / sde;
  if (ratio < 1.5) return { flagged: true, ratio, pattern: "sub-1.5x-sde" };
  return { flagged: false, ratio, pattern: null };
}

export function isRetracted(row: DealRow): boolean {
  return (
    row.listing.status === "retracted" ||
    row.listing.status === "rejected" ||
    row.assessment?.status === "retracted" ||
    row.assessment?.status === "rejected" ||
    /retract/i.test(row.listing.tags.join(" ")) ||
    /retract/i.test(row.assessment?.body_markdown ?? "")
  );
}
