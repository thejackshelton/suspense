/**
 * Barrel re-export. The mocks used to live in this single 500-line file —
 * each feature now has its own module under `src/mocks/`. This file remains
 * so existing `~/mocks/async-examples` imports keep working unchanged.
 *
 * If you're new to the codebase and looking for a specific mock, jump to
 * the per-feature file directly:
 *
 *   - profile.ts     — getMockProfile / Profile
 *   - docs.ts        — searchMockDocs / SearchResult
 *   - inventory.ts   — checkMockInventory / Inventory
 *   - metrics.ts     — getMockMetric / Metric
 *   - products.ts    — searchMockProducts / LOCAL_PRODUCTS / filterProducts
 *   - reports.ts     — getUnstableMockReport
 *   - ab-testing.ts  — segment cookie + 4 experiment server$ functions
 *   - reveal.ts      — getMockRevealItem + reveal-prefs cookie
 *   - cookies.ts     — generic createCookie<T> helper used by ab-testing & reveal
 */

export * from "./profile";
export * from "./docs";
export * from "./inventory";
export * from "./metrics";
export * from "./products";
export * from "./reports";
export * from "./ab-testing";
export * from "./reveal";
