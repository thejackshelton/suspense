import {
  component$,
  Suspense,
  useAsync$,
  useSignal,
  useTask$,
} from "@qwik.dev/core";

import {
  getCTAExperiment,
  getHeroExperiment,
  getPricingPersonalization,
  getRecommendations,
  getSegmentCookie,
  setSegmentCookie,
  type CTAVariant,
  type HeroVariant,
  type PricingTier,
  type RecommendationResult,
  type UserSegment,
} from "~/mocks/async-examples";

import { ExampleShell, QuickScan } from "./example-shell";
import { InlineLoader, LoadingLabel } from "./loading";

const SEGMENTS: { value: UserSegment; label: string }[] = [
  { value: "new", label: "New visitor" },
  { value: "returning", label: "Returning user" },
  { value: "premium", label: "Premium member" },
];

/**
 * Each personalization layer has a different simulated latency:
 *   hero ~300ms, pricing ~600ms, recs ~1200ms, CTA ~200ms
 * Because each layer lives in its own Suspense boundary, the fast ones
 * resolve immediately while the slow recommendation engine keeps loading —
 * no waterfall, no blocking.
 */
export const ABTestingExample = component$(() => {
  const segment = useSignal<UserSegment>("new");

  // Restore persisted segment from cookie (runs during SSR, no flash)
  useTask$(async () => {
    segment.value = await getSegmentCookie();
  });

  const hero = useAsync$<HeroVariant>(async ({ track, previous }) => {
    const seg = track(segment);
    return getHeroExperiment(seg, previous ? 300 : 0);
  });

  const pricing = useAsync$<PricingTier>(async ({ track, previous }) => {
    const seg = track(segment);
    return getPricingPersonalization(seg, previous ? 600 : 0);
  });

  const recs = useAsync$<RecommendationResult>(async ({ track, previous }) => {
    const seg = track(segment);
    return getRecommendations(seg, previous ? 1200 : 0);
  });

  const cta = useAsync$<CTAVariant>(async ({ track, previous }) => {
    const seg = track(segment);
    return getCTAExperiment(seg, previous ? 200 : 0);
  });

  return (
    <ExampleShell>
      <QuickScan
        reactPattern="Multiple independent async widgets on one page."
        qwikPattern="One useAsync$ + Suspense boundary per personalization layer."
        refreshTrigger="Changing the user segment (also persisted in a cookie)."
        pendingUi="Fast layers resolve first; slow layers keep their own fallbacks."
      />
      <div class="space-y-1">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-400">
          User segment
        </span>
        <div class="flex flex-wrap gap-2">
          {SEGMENTS.map((s) => (
            <button
              key={s.value}
              class={[
                "cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition",
                segment.value === s.value
                  ? "border-cyan-300 bg-cyan-300 text-slate-950"
                  : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500",
              ]}
              onClick$={async () => {
                segment.value = s.value;
                await setSegmentCookie(s.value);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p class="text-xs text-slate-500">
          Switch segments — your choice is saved and remembered on reload.
        </p>
      </div>

      {/* ── Layer 1: Hero headline (fast ~300ms) ────────────────────── */}
      <Suspense fallback={<HeroFallback />} delay={120}>
        <HeroCard hero={hero.value} loading={hero.loading} />
      </Suspense>

      <div class="grid gap-4 lg:grid-cols-2">
        {/* ── Layer 2: Pricing (medium ~600ms) ─────────────────────── */}
        <Suspense fallback={<PricingFallback />} delay={120}>
          <PricingCard pricing={pricing.value} loading={pricing.loading} />
        </Suspense>

        {/* ── Layer 3: Recommendations (slow ~1200ms) ──────────────── */}
        <Suspense fallback={<RecsFallback />} delay={120}>
          <RecsCard recs={recs.value} loading={recs.loading} />
        </Suspense>
      </div>

      {/* ── Layer 4: CTA (fast ~200ms) ─────────────────────────────── */}
      <Suspense fallback={<CTAFallback />} delay={120}>
        <CTACard cta={cta.value} loading={cta.loading} />
      </Suspense>

      <TimingLegend />
    </ExampleShell>
  );
});

// ---------------------------------------------------------------------------
// Layer cards
// ---------------------------------------------------------------------------

const HeroCard = component$<{ hero: HeroVariant; loading: boolean }>(
  ({ hero, loading }) => {
    const colors: Record<string, string> = {
      cyan: "border-cyan-300/40 bg-cyan-950/30",
      violet: "border-violet-300/40 bg-violet-950/30",
      emerald: "border-emerald-300/40 bg-emerald-950/30",
      amber: "border-amber-300/40 bg-amber-950/30",
      rose: "border-rose-300/40 bg-rose-950/30",
    };
    return (
      <article
        class={[
          "relative space-y-2 rounded-lg border p-5 transition",
          colors[hero.badgeColor] ?? "border-slate-700 bg-slate-900",
          loading && "opacity-60",
        ]}
      >
        {loading && <InlineLoader label="Resolving hero variant" />}
        <ExperimentBadge id={hero.experimentId} variant={hero.variant} />
        <h2 class="text-xl font-bold text-white">{hero.headline}</h2>
        <p class="text-sm text-slate-300">{hero.subline}</p>
        <ResolvedTimestamp at={hero.resolvedAt} />
      </article>
    );
  },
);

const PricingCard = component$<{ pricing: PricingTier; loading: boolean }>(
  ({ pricing, loading }) => {
    return (
      <article
        class={[
          "space-y-3 rounded-lg border p-4 transition",
          pricing.highlighted
            ? "border-amber-300/40 bg-amber-950/20"
            : "border-slate-700 bg-slate-900",
          loading && "opacity-60",
        ]}
      >
        {loading && <InlineLoader label="Personalizing pricing" />}
        <ExperimentBadge id={pricing.experimentId} variant={pricing.segment} />
        <div class="flex items-end gap-2">
          <span class="text-2xl font-bold text-white">
            {pricing.monthlyPrice === 0
              ? "Free"
              : `$${pricing.monthlyPrice}/mo`}
          </span>
          {pricing.annualPrice > 0 && (
            <span class="text-xs text-slate-400">
              or ${pricing.annualPrice}/yr
            </span>
          )}
        </div>
        <p class="text-sm font-semibold text-slate-200">{pricing.tierName}</p>
        <ul class="space-y-1">
          {pricing.features.map((f) => (
            <li key={f} class="flex items-center gap-2 text-xs text-slate-300">
              <span class="text-emerald-400">✓</span> {f}
            </li>
          ))}
        </ul>
        <ResolvedTimestamp at={pricing.resolvedAt} />
      </article>
    );
  },
);

const RecsCard = component$<{
  recs: RecommendationResult;
  loading: boolean;
}>(({ recs, loading }) => {
  return (
    <article
      class={[
        "space-y-3 rounded-lg border border-slate-700 bg-slate-900 p-4 transition",
        loading && "opacity-60",
      ]}
    >
      {loading && <InlineLoader label="Computing recommendations" />}
      <ExperimentBadge id={recs.experimentId} variant={recs.segment} />
      <ul class="space-y-2">
        {recs.items.map((item) => (
          <li
            key={item.id}
            class="rounded-md border border-slate-800 bg-slate-950 px-3 py-2"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-white">{item.title}</span>
              <span class="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-200">
                {(item.score * 100).toFixed(0)}%
              </span>
            </div>
            <p class="mt-0.5 text-xs text-slate-400">{item.reason}</p>
          </li>
        ))}
      </ul>
      <ResolvedTimestamp at={recs.resolvedAt} />
    </article>
  );
});

const CTACard = component$<{ cta: CTAVariant; loading: boolean }>(
  ({ cta, loading }) => {
    const toneStyles: Record<string, string> = {
      urgent:
        "border-rose-400/60 bg-rose-500 text-white hover:bg-rose-400",
      friendly:
        "border-cyan-300/60 bg-cyan-300 text-slate-950 hover:bg-cyan-200",
      minimal:
        "border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700",
    };
    return (
      <article
        class={[
          "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-900 p-4 transition",
          loading && "opacity-60",
        ]}
      >
        <div class="space-y-1">
          {loading && <InlineLoader label="Resolving CTA" />}
          <ExperimentBadge id={cta.experimentId} variant={cta.variant} />
          <ResolvedTimestamp at={cta.resolvedAt} />
        </div>
        <button
          class={[
            "cursor-pointer rounded-md border px-5 py-2.5 text-sm font-semibold transition",
            toneStyles[cta.tone] ?? toneStyles.friendly,
          ]}
        >
          {cta.label}
        </button>
      </article>
    );
  },
);

// ---------------------------------------------------------------------------
// Skeleton fallbacks — one per layer so each boundary has its own placeholder
// ---------------------------------------------------------------------------

const HeroFallback = component$(() => (
  <div class="space-y-3 rounded-lg border border-slate-800 bg-slate-950 p-5">
    <LoadingLabel label="Resolving hero experiment" />
    <div class="h-5 w-48 animate-pulse rounded bg-slate-800" />
    <div class="h-3 w-64 animate-pulse rounded bg-slate-800" />
  </div>
));

const PricingFallback = component$(() => (
  <div class="space-y-3 rounded-lg border border-slate-800 bg-slate-950 p-4">
    <LoadingLabel label="Personalizing pricing" />
    <div class="h-7 w-24 animate-pulse rounded bg-slate-800" />
    <div class="space-y-1.5">
      {[0, 1, 2].map((i) => (
        <div key={i} class="h-3 w-40 animate-pulse rounded bg-slate-800" />
      ))}
    </div>
  </div>
));

const RecsFallback = component$(() => (
  <div class="space-y-3 rounded-lg border border-slate-800 bg-slate-950 p-4">
    <LoadingLabel label="Computing recommendations" />
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        class="space-y-1.5 rounded-md border border-slate-800 bg-slate-900 p-3"
      >
        <div class="h-3 w-32 animate-pulse rounded bg-slate-700" />
        <div class="h-3 w-48 animate-pulse rounded bg-slate-800" />
      </div>
    ))}
  </div>
));

const CTAFallback = component$(() => (
  <div class="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
    <LoadingLabel label="Resolving CTA experiment" />
    <div class="h-10 w-36 animate-pulse rounded-md bg-slate-800" />
  </div>
));

// ---------------------------------------------------------------------------
// Shared UI bits
// ---------------------------------------------------------------------------

const ExperimentBadge = component$<{ id: string; variant: string }>(
  ({ id, variant }) => (
    <div class="flex items-center gap-2">
      <span class="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
        {id}
      </span>
      <span class="rounded bg-cyan-900/60 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-200">
        variant: {variant}
      </span>
    </div>
  ),
);

const ResolvedTimestamp = component$<{ at: string }>(({ at }) => (
  <p class="text-[11px] text-slate-500">Resolved at {at}</p>
));

const TimingLegend = component$(() => (
  <div class="flex flex-wrap gap-x-5 gap-y-1 border-t border-slate-800 pt-3 text-[11px] text-slate-500">
    <span>
      <span class="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Hero
      ~300ms
    </span>
    <span>
      <span class="inline-block h-2 w-2 rounded-full bg-amber-400" /> Pricing
      ~600ms
    </span>
    <span>
      <span class="inline-block h-2 w-2 rounded-full bg-rose-400" /> Recs
      ~1200ms
    </span>
    <span>
      <span class="inline-block h-2 w-2 rounded-full bg-cyan-400" /> CTA
      ~200ms
    </span>
  </div>
));
