import { server$ } from "@qwik.dev/router";

export type Profile = {
  name: string;
  role: string;
  delayMs: number;
  requestedAt: string;
};

export type SearchResult = {
  id: number;
  title: string;
  summary: string;
};

export type Inventory = {
  item: string;
  available: number;
  delayMs: number;
  checkedAt: string;
};

export type Metric = {
  label: string;
  value: number;
  delayMs: number;
  recordedAt: string;
};

type ReportResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

export const getMockProfile = server$(async (name: string, delayMs: number) => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const roles: Record<string, string> = {
    Ada: "Compiler engineer",
    Linus: "Kernel maintainer",
    Grace: "Systems pioneer",
  };

  return {
    name,
    role: roles[name] ?? "Qwik developer",
    delayMs,
    requestedAt: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }),
  } satisfies Profile;
});

export const searchMockDocs = server$(async (query: string, delayMs: number) => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const docs = [
    {
      id: 1,
      title: "useAsync$",
      summary: "Creates an async signal for server calls, fetches, and long work.",
    },
    {
      id: 2,
      title: "Suspense",
      summary: "Shows fallback UI while async values below the boundary resolve.",
    },
    {
      id: 3,
      title: "server$",
      summary: "Runs code on the server and calls it from the browser like RPC.",
    },
  ];

  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return docs;
  }

  return docs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(normalizedQuery) ||
      doc.summary.toLowerCase().includes(normalizedQuery),
  ) satisfies SearchResult[];
});

export const checkMockInventory = server$(
  async (item: string, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    return {
      item,
      available: Math.floor(Math.random() * 8) + 1,
      delayMs,
      checkedAt: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }),
    } satisfies Inventory;
  },
);

export const getMockMetric = server$(async (label: string, delayMs: number) => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  return {
    label,
    value: 800 + Math.floor(Math.random() * 400),
    delayMs,
    recordedAt: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }),
  } satisfies Metric;
});

export type LocalProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
};

export type EnrichedProduct = LocalProduct & {
  stock: number;
  rating: number;
  livePrice: number;
  checkedAt: string;
};

export const LOCAL_PRODUCTS: LocalProduct[] = [
  { id: 1, name: "Qwik Tee", category: "apparel", price: 29.99 },
  { id: 2, name: "Resumable Hoodie", category: "apparel", price: 59.99 },
  { id: 3, name: "Signal Stickers", category: "accessories", price: 4.99 },
  { id: 4, name: "JSX Mug", category: "drinkware", price: 14.99 },
  { id: 5, name: "Lazy-load Laptop Sleeve", category: "accessories", price: 24.99 },
  { id: 6, name: "SSR Cap", category: "apparel", price: 19.99 },
  { id: 7, name: "Hydration Bottle", category: "drinkware", price: 18.99 },
  { id: 8, name: "Component Pin Set", category: "accessories", price: 9.99 },
];

export const searchMockProducts = server$(
  async (query: string, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? LOCAL_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(normalizedQuery) ||
            p.category.toLowerCase().includes(normalizedQuery),
        )
      : LOCAL_PRODUCTS;

    return filtered.map((p) => ({
      ...p,
      stock: Math.floor(Math.random() * 50) + 1,
      rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      livePrice: +(p.price * (0.85 + Math.random() * 0.3)).toFixed(2),
      checkedAt: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }),
    })) satisfies EnrichedProduct[];
  },
);

export const getUnstableMockReport = server$(
  async (shouldFail: boolean, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const seconds = (delayMs / 1000).toFixed(1);

    if (shouldFail) {
      return {
        ok: false,
        message: `The mock report failed after ${seconds}s: planned API failure.`,
      } satisfies ReportResult;
    }

    return {
      ok: true,
      message: `The report finished after a ${seconds}s server delay.`,
    } satisfies ReportResult;
  },
);

// ---------------------------------------------------------------------------
// A/B testing / multi-layer personalization mocks
// ---------------------------------------------------------------------------

export type UserSegment = "new" | "returning" | "premium";

export type HeroVariant = {
  experimentId: string;
  variant: "A" | "B" | "C";
  headline: string;
  subline: string;
  badgeColor: string;
  resolvedAt: string;
};

export type PricingTier = {
  experimentId: string;
  segment: UserSegment;
  tierName: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  highlighted: boolean;
  resolvedAt: string;
};

export type Recommendation = {
  id: number;
  title: string;
  category: string;
  score: number;
  reason: string;
};

export type RecommendationResult = {
  experimentId: string;
  segment: UserSegment;
  items: Recommendation[];
  resolvedAt: string;
};

export type CTAVariant = {
  experimentId: string;
  variant: string;
  label: string;
  tone: "urgent" | "friendly" | "minimal";
  resolvedAt: string;
};

const HERO_VARIANTS: Record<UserSegment, HeroVariant[]> = {
  new: [
    { experimentId: "hero-001", variant: "A", headline: "Ship faster with Qwik", subline: "Resumable apps that load in milliseconds.", badgeColor: "cyan", resolvedAt: "" },
    { experimentId: "hero-001", variant: "B", headline: "Zero hydration. Full speed.", subline: "Your next app deserves instant interactivity.", badgeColor: "violet", resolvedAt: "" },
  ],
  returning: [
    { experimentId: "hero-001", variant: "A", headline: "Welcome back, builder", subline: "Pick up where you left off — your projects are waiting.", badgeColor: "emerald", resolvedAt: "" },
    { experimentId: "hero-001", variant: "B", headline: "Ready to ship?", subline: "New features dropped since your last visit.", badgeColor: "amber", resolvedAt: "" },
  ],
  premium: [
    { experimentId: "hero-001", variant: "A", headline: "Your premium dashboard", subline: "Priority builds, advanced analytics, and more.", badgeColor: "amber", resolvedAt: "" },
    { experimentId: "hero-001", variant: "C", headline: "Exclusive early access", subline: "Try experimental features before anyone else.", badgeColor: "rose", resolvedAt: "" },
  ],
};

const PRICING_BY_SEGMENT: Record<UserSegment, PricingTier> = {
  new: { experimentId: "pricing-042", segment: "new", tierName: "Starter", monthlyPrice: 0, annualPrice: 0, features: ["1 project", "Community support", "Basic analytics"], highlighted: false, resolvedAt: "" },
  returning: { experimentId: "pricing-042", segment: "returning", tierName: "Pro", monthlyPrice: 19, annualPrice: 190, features: ["Unlimited projects", "Priority support", "Advanced analytics", "Team collaboration"], highlighted: true, resolvedAt: "" },
  premium: { experimentId: "pricing-042", segment: "premium", tierName: "Enterprise", monthlyPrice: 79, annualPrice: 790, features: ["Unlimited everything", "Dedicated support", "Custom integrations", "SLA guarantee", "SSO & audit logs"], highlighted: true, resolvedAt: "" },
};

const RECOMMENDATIONS: Record<UserSegment, Recommendation[]> = {
  new: [
    { id: 1, title: "Getting Started Guide", category: "docs", score: 0.97, reason: "Most new users start here" },
    { id: 2, title: "Qwik in 5 Minutes", category: "tutorial", score: 0.94, reason: "Quick interactive walkthrough" },
    { id: 3, title: "Component Basics", category: "docs", score: 0.91, reason: "Foundation for everything else" },
    { id: 4, title: "Starter Templates", category: "resource", score: 0.88, reason: "Clone and go" },
  ],
  returning: [
    { id: 5, title: "What's New in v2", category: "changelog", score: 0.96, reason: "Features since your last visit" },
    { id: 6, title: "useAsync$ Deep Dive", category: "tutorial", score: 0.93, reason: "Based on your reading history" },
    { id: 7, title: "Performance Patterns", category: "guide", score: 0.89, reason: "Popular with returning devs" },
    { id: 8, title: "Migration Guide", category: "docs", score: 0.85, reason: "Upgrade your existing projects" },
  ],
  premium: [
    { id: 9, title: "Edge Deployment", category: "guide", score: 0.98, reason: "Premium-only feature" },
    { id: 10, title: "Custom Serializers", category: "advanced", score: 0.95, reason: "Unlock advanced optimizations" },
    { id: 11, title: "Team Workspace Setup", category: "admin", score: 0.92, reason: "Manage your organization" },
    { id: 12, title: "Private Package Registry", category: "enterprise", score: 0.90, reason: "Enterprise-tier feature" },
  ],
};

const CTA_BY_SEGMENT: Record<UserSegment, CTAVariant[]> = {
  new: [
    { experimentId: "cta-017", variant: "urgent", label: "Start free — no credit card", tone: "urgent", resolvedAt: "" },
    { experimentId: "cta-017", variant: "friendly", label: "Try it out, it's free", tone: "friendly", resolvedAt: "" },
  ],
  returning: [
    { experimentId: "cta-017", variant: "urgent", label: "Upgrade now — 20% off this week", tone: "urgent", resolvedAt: "" },
    { experimentId: "cta-017", variant: "friendly", label: "See what you missed", tone: "friendly", resolvedAt: "" },
  ],
  premium: [
    { experimentId: "cta-017", variant: "minimal", label: "Open dashboard", tone: "minimal", resolvedAt: "" },
    { experimentId: "cta-017", variant: "friendly", label: "Explore new features", tone: "friendly", resolvedAt: "" },
  ],
};

function timestamp() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Fast experiment — hero headline variant (simulates ~300ms edge decision) */
export const getHeroExperiment = server$(
  async (segment: UserSegment, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    const variants = HERO_VARIANTS[segment];
    const pick = variants[Math.floor(Math.random() * variants.length)];
    return { ...pick, resolvedAt: timestamp() } satisfies HeroVariant;
  },
);

/** Medium experiment — personalized pricing (simulates ~600ms lookup) */
export const getPricingPersonalization = server$(
  async (segment: UserSegment, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return { ...PRICING_BY_SEGMENT[segment], resolvedAt: timestamp() } satisfies PricingTier;
  },
);

/** Slow experiment — ML-style recommendations (simulates ~1200ms model inference) */
export const getRecommendations = server$(
  async (segment: UserSegment, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return {
      experimentId: "recs-088",
      segment,
      items: RECOMMENDATIONS[segment],
      resolvedAt: timestamp(),
    } satisfies RecommendationResult;
  },
);

/** Fast experiment — CTA copy/tone variant (simulates ~200ms edge decision) */
export const getCTAExperiment = server$(
  async (segment: UserSegment, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    const variants = CTA_BY_SEGMENT[segment];
    const pick = variants[Math.floor(Math.random() * variants.length)];
    return { ...pick, resolvedAt: timestamp() } satisfies CTAVariant;
  },
);
