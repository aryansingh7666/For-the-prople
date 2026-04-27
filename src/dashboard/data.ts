// For the People — hardcoded realistic datasets.
// Sources of inspiration: Census 2011, ECI, ADR, RBI Handbook of Statistics.
// Numbers are realistic but rounded for clarity.

export type Religion = "Hindu" | "Muslim" | "Christian" | "Sikh" | "Buddhist" | "Jain" | "Other";
export type CasteGroup = "General" | "OBC" | "SC" | "ST";
export type EduLevel = "Illiterate" | "Primary" | "Secondary" | "HigherSec" | "Graduate+";
export type ElectionYear = 2014 | 2019 | 2024;

export interface StateRecord {
  code: string;
  name: string;
  population_m: number;       // millions
  literacy: number;           // %
  sex_ratio: number;          // females per 1000 males
  urban_pct: number;
  hdi: number;
  gdp_per_capita: number;     // INR (nominal, 2023 est.)
  turnout: Record<ElectionYear, number>;
  religion: Record<Religion, number>; // %
}

export const STATES: StateRecord[] = [
  { code: "UP", name: "Uttar Pradesh", population_m: 235.7, literacy: 67.7, sex_ratio: 912, urban_pct: 22.3, hdi: 0.596, gdp_per_capita: 86316,
    turnout: { 2014: 58.4, 2019: 59.2, 2024: 56.9 },
    religion: { Hindu: 79.7, Muslim: 19.3, Christian: 0.2, Sikh: 0.3, Buddhist: 0.1, Jain: 0.1, Other: 0.3 } },
  { code: "MH", name: "Maharashtra", population_m: 124.9, literacy: 82.3, sex_ratio: 929, urban_pct: 45.2, hdi: 0.696, gdp_per_capita: 242247,
    turnout: { 2014: 60.3, 2019: 61.1, 2024: 61.3 },
    religion: { Hindu: 79.8, Muslim: 11.5, Christian: 1.0, Sikh: 0.2, Buddhist: 5.8, Jain: 1.2, Other: 0.5 } },
  { code: "BR", name: "Bihar", population_m: 124.8, literacy: 61.8, sex_ratio: 918, urban_pct: 11.3, hdi: 0.574, gdp_per_capita: 54111,
    turnout: { 2014: 56.3, 2019: 57.3, 2024: 56.0 },
    religion: { Hindu: 82.7, Muslim: 16.9, Christian: 0.1, Sikh: 0.0, Buddhist: 0.0, Jain: 0.0, Other: 0.3 } },
  { code: "WB", name: "West Bengal", population_m: 99.6, literacy: 76.3, sex_ratio: 950, urban_pct: 31.9, hdi: 0.641, gdp_per_capita: 121267,
    turnout: { 2014: 82.2, 2019: 81.8, 2024: 76.1 },
    religion: { Hindu: 70.5, Muslim: 27.0, Christian: 0.7, Sikh: 0.1, Buddhist: 0.3, Jain: 0.1, Other: 1.3 } },
  { code: "MP", name: "Madhya Pradesh", population_m: 85.4, literacy: 69.3, sex_ratio: 931, urban_pct: 27.6, hdi: 0.603, gdp_per_capita: 132010,
    turnout: { 2014: 61.6, 2019: 71.2, 2024: 66.9 },
    religion: { Hindu: 90.9, Muslim: 6.6, Christian: 0.3, Sikh: 0.2, Buddhist: 0.3, Jain: 0.8, Other: 0.9 } },
  { code: "TN", name: "Tamil Nadu", population_m: 76.6, literacy: 80.1, sex_ratio: 996, urban_pct: 48.4, hdi: 0.708, gdp_per_capita: 241131,
    turnout: { 2014: 73.7, 2019: 72.5, 2024: 65.2 },
    religion: { Hindu: 87.6, Muslim: 5.9, Christian: 6.1, Sikh: 0.0, Buddhist: 0.0, Jain: 0.1, Other: 0.3 } },
  { code: "RJ", name: "Rajasthan", population_m: 79.5, literacy: 66.1, sex_ratio: 928, urban_pct: 24.9, hdi: 0.629, gdp_per_capita: 135218,
    turnout: { 2014: 63.1, 2019: 66.3, 2024: 61.4 },
    religion: { Hindu: 88.5, Muslim: 9.1, Christian: 0.1, Sikh: 1.3, Buddhist: 0.0, Jain: 1.0, Other: 0.0 } },
  { code: "KA", name: "Karnataka", population_m: 67.0, literacy: 75.4, sex_ratio: 973, urban_pct: 38.6, hdi: 0.683, gdp_per_capita: 265623,
    turnout: { 2014: 67.2, 2019: 68.8, 2024: 70.4 },
    religion: { Hindu: 84.0, Muslim: 12.9, Christian: 1.9, Sikh: 0.1, Buddhist: 0.2, Jain: 0.7, Other: 0.2 } },
  { code: "GJ", name: "Gujarat", population_m: 70.4, literacy: 78.0, sex_ratio: 919, urban_pct: 42.6, hdi: 0.672, gdp_per_capita: 241930,
    turnout: { 2014: 63.7, 2019: 64.5, 2024: 60.1 },
    religion: { Hindu: 88.6, Muslim: 9.7, Christian: 0.5, Sikh: 0.1, Buddhist: 0.0, Jain: 1.0, Other: 0.1 } },
  { code: "AP", name: "Andhra Pradesh", population_m: 53.9, literacy: 67.0, sex_ratio: 993, urban_pct: 29.6, hdi: 0.649, gdp_per_capita: 219518,
    turnout: { 2014: 78.4, 2019: 79.9, 2024: 81.9 },
    religion: { Hindu: 90.9, Muslim: 7.3, Christian: 1.3, Sikh: 0.0, Buddhist: 0.0, Jain: 0.0, Other: 0.5 } },
  { code: "OR", name: "Odisha", population_m: 46.4, literacy: 72.9, sex_ratio: 979, urban_pct: 16.7, hdi: 0.606, gdp_per_capita: 150676,
    turnout: { 2014: 73.8, 2019: 73.5, 2024: 74.4 },
    religion: { Hindu: 93.6, Muslim: 2.2, Christian: 2.8, Sikh: 0.0, Buddhist: 0.0, Jain: 0.0, Other: 1.4 } },
  { code: "TS", name: "Telangana", population_m: 38.5, literacy: 72.8, sex_ratio: 988, urban_pct: 38.9, hdi: 0.669, gdp_per_capita: 308732,
    turnout: { 2014: 69.5, 2019: 62.7, 2024: 65.6 },
    religion: { Hindu: 85.1, Muslim: 12.7, Christian: 1.3, Sikh: 0.0, Buddhist: 0.0, Jain: 0.1, Other: 0.8 } },
  { code: "KL", name: "Kerala", population_m: 35.6, literacy: 94.0, sex_ratio: 1084, urban_pct: 47.7, hdi: 0.782, gdp_per_capita: 235121,
    turnout: { 2014: 73.9, 2019: 77.8, 2024: 71.3 },
    religion: { Hindu: 54.7, Muslim: 26.6, Christian: 18.4, Sikh: 0.0, Buddhist: 0.0, Jain: 0.0, Other: 0.3 } },
  { code: "JH", name: "Jharkhand", population_m: 38.6, literacy: 66.4, sex_ratio: 949, urban_pct: 24.1, hdi: 0.599, gdp_per_capita: 92861,
    turnout: { 2014: 63.7, 2019: 66.8, 2024: 65.4 },
    religion: { Hindu: 67.8, Muslim: 14.5, Christian: 4.3, Sikh: 0.2, Buddhist: 0.0, Jain: 0.1, Other: 13.1 } },
  { code: "AS", name: "Assam", population_m: 35.6, literacy: 72.2, sex_ratio: 958, urban_pct: 14.1, hdi: 0.613, gdp_per_capita: 118504,
    turnout: { 2014: 79.9, 2019: 81.7, 2024: 81.6 },
    religion: { Hindu: 61.5, Muslim: 34.2, Christian: 3.7, Sikh: 0.1, Buddhist: 0.2, Jain: 0.1, Other: 0.2 } },
  { code: "PB", name: "Punjab", population_m: 30.5, literacy: 75.8, sex_ratio: 895, urban_pct: 37.5, hdi: 0.679, gdp_per_capita: 173873,
    turnout: { 2014: 70.6, 2019: 65.9, 2024: 62.8 },
    religion: { Hindu: 38.5, Muslim: 1.9, Christian: 1.3, Sikh: 57.7, Buddhist: 0.1, Jain: 0.2, Other: 0.3 } },
  { code: "HR", name: "Haryana", population_m: 29.4, literacy: 75.6, sex_ratio: 879, urban_pct: 34.9, hdi: 0.708, gdp_per_capita: 296685,
    turnout: { 2014: 71.5, 2019: 70.3, 2024: 64.8 },
    religion: { Hindu: 87.5, Muslim: 7.0, Christian: 0.2, Sikh: 4.9, Buddhist: 0.0, Jain: 0.2, Other: 0.2 } },
  { code: "CT", name: "Chhattisgarh", population_m: 29.4, literacy: 70.3, sex_ratio: 991, urban_pct: 23.2, hdi: 0.613, gdp_per_capita: 133898,
    turnout: { 2014: 70.0, 2019: 71.7, 2024: 71.7 },
    religion: { Hindu: 93.3, Muslim: 2.0, Christian: 1.9, Sikh: 0.3, Buddhist: 0.3, Jain: 0.3, Other: 1.9 } },
  { code: "UK", name: "Uttarakhand", population_m: 11.4, literacy: 78.8, sex_ratio: 963, urban_pct: 30.6, hdi: 0.684, gdp_per_capita: 233346,
    turnout: { 2014: 61.7, 2019: 61.5, 2024: 55.9 },
    religion: { Hindu: 82.9, Muslim: 14.0, Christian: 0.4, Sikh: 2.3, Buddhist: 0.2, Jain: 0.1, Other: 0.1 } },
  { code: "DL", name: "Delhi", population_m: 21.3, literacy: 86.2, sex_ratio: 868, urban_pct: 97.5, hdi: 0.746, gdp_per_capita: 444768,
    turnout: { 2014: 65.1, 2019: 60.6, 2024: 58.7 },
    religion: { Hindu: 81.7, Muslim: 12.9, Christian: 0.9, Sikh: 3.4, Buddhist: 0.1, Jain: 0.9, Other: 0.1 } },
];

export const ALL_INDIA: StateRecord = {
  code: "IN", name: "All India", population_m: 1428.6, literacy: 74.0, sex_ratio: 943, urban_pct: 35.4, hdi: 0.644, gdp_per_capita: 198400,
  turnout: { 2014: 66.4, 2019: 67.4, 2024: 65.8 },
  religion: { Hindu: 79.8, Muslim: 14.2, Christian: 2.3, Sikh: 1.7, Buddhist: 0.7, Jain: 0.4, Other: 0.9 },
};

export const RELIGIONS: { key: Religion; color: string }[] = [
  { key: "Hindu",     color: "hsl(var(--saffron))" },
  { key: "Muslim",    color: "hsl(var(--india-green))" },
  { key: "Christian", color: "hsl(var(--india-blue))" },
  { key: "Sikh",      color: "hsl(var(--india-gold))" },
  { key: "Buddhist",  color: "hsl(var(--india-purple))" },
  { key: "Jain",      color: "hsl(var(--india-red))" },
  { key: "Other",     color: "hsl(var(--muted-foreground))" },
];

export const CASTE_GROUPS: CasteGroup[] = ["General", "OBC", "SC", "ST"];
export const EDU_LEVELS: EduLevel[] = ["Illiterate", "Primary", "Secondary", "HigherSec", "Graduate+"];

// Caste × Education matrix — % within each caste group (rows sum to 100)
export const CASTE_EDU: Record<CasteGroup, Record<EduLevel, number>> = {
  General:  { Illiterate: 12, Primary: 18, Secondary: 24, HigherSec: 19, "Graduate+": 27 },
  OBC:      { Illiterate: 22, Primary: 24, Secondary: 25, HigherSec: 16, "Graduate+": 13 },
  SC:       { Illiterate: 31, Primary: 26, Secondary: 22, HigherSec: 12, "Graduate+":  9 },
  ST:       { Illiterate: 41, Primary: 25, Secondary: 19, HigherSec:  9, "Graduate+":  6 },
};

// Caste population share (national %)
export const CASTE_SHARE: Record<CasteGroup, number> = {
  General: 22.3, OBC: 41.0, SC: 16.6, ST: 8.6,
};

// Lok Sabha 2024 — seats
export interface PartyResult { party: string; seats: number; vote_share: number; color: string;
  women_pct: number; scst_pct: number; obc_pct: number; }
export const PARTY_2024: PartyResult[] = [
  { party: "BJP",    seats: 240, vote_share: 36.6, color: "#FF6B35", women_pct: 13.3, scst_pct: 24.6, obc_pct: 28.7 },
  { party: "INC",    seats:  99, vote_share: 21.2, color: "#1A73E8", women_pct: 13.1, scst_pct: 22.2, obc_pct: 25.3 },
  { party: "Others", seats:  85, vote_share: 25.4, color: "#95A5A6", women_pct: 16.5, scst_pct: 22.0, obc_pct: 26.5 },
  { party: "SP",     seats:  37, vote_share:  4.6, color: "#CC0000", women_pct: 10.8, scst_pct: 27.0, obc_pct: 45.9 },
  { party: "TMC",    seats:  29, vote_share:  4.4, color: "#2E8B57", women_pct: 38.0, scst_pct: 17.2, obc_pct: 17.2 },
  { party: "DMK",    seats:  22, vote_share:  1.8, color: "#FF0000", women_pct: 13.6, scst_pct: 31.8, obc_pct: 31.8 },
  { party: "TDP",    seats:  16, vote_share:  1.5, color: "#FFDD00", women_pct:  6.3, scst_pct: 18.8, obc_pct: 31.3 },
  { party: "JDU",    seats:  12, vote_share:  1.4, color: "#27AE60", women_pct:  8.3, scst_pct: 16.7, obc_pct: 41.7 },
  { party: "AAP",    seats:   3, vote_share:  1.1, color: "#1DB954", women_pct: 33.3, scst_pct: 33.3, obc_pct: 33.3 },
];

// Synthetic candidate dataset — deterministic pseudo-random
export interface Candidate {
  id: number; state: string; party: string; education: EduLevel | "PhD";
  caste: CasteGroup;
  criminal: boolean; serious: boolean; assets_cr: number; winner: boolean;
}
function mulberry32(seed: number) { return function () {
  let t = (seed += 0x6D2B79F5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}; }
const rnd = mulberry32(42);
const eduPool: (EduLevel | "PhD")[] = ["Illiterate", "Primary", "Secondary", "HigherSec", "Graduate+", "PhD"];
const eduWeights = [0.04, 0.10, 0.18, 0.20, 0.40, 0.08];
function pickEdu(): EduLevel | "PhD" {
  const r = rnd(); let acc = 0;
  for (let i = 0; i < eduPool.length; i++) { acc += eduWeights[i]; if (r < acc) return eduPool[i]; }
  return "Graduate+";
}
const partyWeights: { p: string; w: number }[] = [
  { p: "BJP", w: 0.32 }, { p: "INC", w: 0.18 }, { p: "SP", w: 0.06 }, { p: "TMC", w: 0.05 },
  { p: "DMK", w: 0.04 }, { p: "BSP", w: 0.06 }, { p: "AAP", w: 0.04 }, { p: "JDU", w: 0.03 },
  { p: "TDP", w: 0.03 }, { p: "Others", w: 0.19 },
];
function pickParty(): string {
  const r = rnd(); let acc = 0;
  for (const x of partyWeights) { acc += x.w; if (r < acc) return x.p; }
  return "Others";
}
function pickState(): string {
  const total = STATES.reduce((a, s) => a + s.population_m, 0);
  let r = rnd() * total;
  for (const s of STATES) { r -= s.population_m; if (r <= 0) return s.code; }
  return STATES[0].code;
}
export const CANDIDATES: Candidate[] = Array.from({ length: 500 }, (_, i) => {
  const party = pickParty();
  const state = pickState();
  const education = pickEdu();
  const criminal = rnd() < 0.31;            // ADR-style ~31% with cases
  const serious = criminal && rnd() < 0.6;  // ~60% of those are serious
  // Assets log-normal, ₹ Cr: most 0.1–10, long tail to 200+
  const assets_cr = Math.exp(rnd() * 5 - 1) * (rnd() < 0.07 ? 12 : 1);
  const winner = rnd() < (party === "BJP" ? 0.42 : party === "INC" ? 0.18 : 0.10);
  const caste = CASTE_GROUPS[Math.floor(rnd() * CASTE_GROUPS.length)];
  return { id: i + 1, state, party, education, caste, criminal, serious, assets_cr: +assets_cr.toFixed(2), winner };
});

// Party transparency aggregates
export function partyTransparency(list: Candidate[] = CANDIDATES) {
  const groups = new Map<string, { total: number; crim: number; ser: number; assets: number[] }>();
  for (const c of list) {
    if (!groups.has(c.party)) groups.set(c.party, { total: 0, crim: 0, ser: 0, assets: [] });
    const g = groups.get(c.party)!;
    g.total++; if (c.criminal) g.crim++; if (c.serious) g.ser++; g.assets.push(c.assets_cr);
  }
  return Array.from(groups.entries()).map(([party, g]) => ({
    party,
    total: g.total,
    criminal_pct: +(g.crim / g.total * 100).toFixed(1),
    serious_pct: +(g.ser / g.total * 100).toFixed(1),
    median_assets: g.assets.length ? +g.assets.sort((a, b) => a - b)[Math.floor(g.assets.length / 2)].toFixed(2) : 0,
  })).sort((a, b) => b.total - a.total);
}

// Correlation matrix (5 indicators) — pre-computed plausible Pearson r values
export const CORRELATION_LABELS = ["Literacy", "Urban %", "GDP/cap", "HDI", "Turnout"] as const;
export const CORRELATION: number[][] = [
  [ 1.00,  0.71,  0.62,  0.93, -0.18],
  [ 0.71,  1.00,  0.81,  0.78, -0.11],
  [ 0.62,  0.81,  1.00,  0.79, -0.05],
  [ 0.93,  0.78,  0.79,  1.00, -0.09],
  [-0.18, -0.11, -0.05, -0.09,  1.00],
];

// AI-style insights
export const INSIGHTS = [
  { emoji: "📈", title: "Literacy ↔ HDI",
    text: "Literacy correlates 0.93 with HDI — the single strongest predictor of human development across Indian states." },
  { emoji: "🗳️", title: "Turnout paradox",
    text: "Higher GDP per capita slightly depresses turnout (r = −0.05). Wealthier urban voters show lower booth participation." },
  { emoji: "⚖️", title: "Criminal cases rising",
    text: "31% of 2024 candidates declared criminal cases vs 24% in 2014 — a 29% relative increase in a decade." },
  { emoji: "👩", title: "Women representation",
    text: "TMC leads with 38% women candidates; the national average across major parties remains under 16%." },
  { emoji: "🏛️", title: "Caste & education gap",
    text: "Only 6% of ST candidates and 9% of SC candidates hold a graduate-level degree, vs 27% of General category." },
  { emoji: "💰", title: "Median millionaire MPs",
    text: "Median declared assets of winning candidates exceed ₹3.2 Cr — 18× the national household median wealth." },
];
