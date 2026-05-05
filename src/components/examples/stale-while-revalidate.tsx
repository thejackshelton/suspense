import { component$, Suspense, useAsync$ } from "@qwik.dev/core";

import { getMockMetric, type Metric } from "~/mocks/async-examples";

import { ExampleShell, QuickScan } from "./example-shell";
import { InlineLoader, ListFallback } from "./loading";

export const StaleWhileRevalidateExample = component$(() => {
  const metric = useAsync$<Metric>(async ({ previous }) => {
    const delay = previous ? 1100 : 0;

    return getMockMetric("Active visitors", delay);
  });

  return (
    <ExampleShell>
      <QuickScan
        reactPattern="SWR/React Query stale-while-revalidate on manual refresh."
        qwikPattern="useAsync$ keeps previous .value while .loading is true."
        refreshTrigger="Refresh button calls metric.invalidate()."
        pendingUi="Card stays visible with stale badge; no fallback flash after first load."
      />
      <div class="flex items-center justify-between gap-3">
        <p class="text-xs uppercase tracking-wide text-slate-400">
          Refresh keeps the previous reading on screen until the new one lands.
        </p>
        <button
          class="cursor-pointer rounded-md border border-cyan-300 bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={metric.loading}
          onClick$={() => metric.invalidate()}
        >
          {metric.loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <Suspense fallback={<ListFallback label="Reading first sample" />} delay={120}>
        <MetricCard metric={metric.value} loading={metric.loading} />
      </Suspense>
    </ExampleShell>
  );
});

type MetricCardProps = {
  metric: Metric;
  loading: boolean;
};

const MetricCard = component$<MetricCardProps>(({ metric, loading }) => {
  return (
    <article
      class={[
        "space-y-4 rounded-md border bg-slate-950 p-4 transition",
        loading ? "border-cyan-300/40 opacity-70" : "border-slate-800",
      ]}
    >
      {loading && <InlineLoader label="Fetching a fresh reading" />}
      <div class="flex items-end justify-between gap-4">
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
            {metric.label}
          </p>
          <p class="mt-1 text-3xl font-semibold tabular-nums text-white">
            {metric.value.toLocaleString()}
          </p>
        </div>
        <span
          class={[
            "rounded-md px-2 py-1 text-xs font-semibold",
            loading
              ? "bg-amber-300 text-slate-950"
              : "bg-emerald-300 text-slate-950",
          ]}
        >
          {loading ? "Stale" : "Live"}
        </span>
      </div>
      <p class="text-sm text-slate-400">
        Recorded at <span class="text-slate-200">{metric.recordedAt}</span>
      </p>
    </article>
  );
});
