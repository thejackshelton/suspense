import {
  component$,
  Reveal,
  Suspense,
  useAsync$,
  useSignal,
  useTask$,
  type RevealOrder,
} from "@qwik.dev/core";

import {
  getMockRevealItem,
  getRevealPrefsCookie,
  setRevealPrefsCookie,
  type RevealItem,
} from "~/mocks/async-examples";

import { ExampleShell, QuickScan } from "./example-shell";

/**
 * Longest mock card delay (`C` at 1700ms) plus a small buffer so the button's
 * loading spinner outlasts the final card swapping in. Used as the timeout
 * for clearing `isRestarting` after a Restart run click.
 */
const RESTART_DURATION_MS = 1900;

const ORDERS: { value: RevealOrder; label: string; description: string }[] = [
  {
    value: "parallel",
    label: "parallel",
    description: "Each card reveals as soon as it resolves.",
  },
  {
    value: "sequential",
    label: "sequential",
    description: "Cards reveal in document order, even if a later one finishes first.",
  },
  {
    value: "reverse",
    label: "reverse",
    description: "Cards reveal from last to first — the tail leads.",
  },
  {
    value: "together",
    label: "together",
    description: "Nothing renders until every card has resolved.",
  },
];

export const RevealOrderExample = component$(() => {
  const order = useSignal<RevealOrder>("sequential");
  const collapsed = useSignal(true);
  const seed = useSignal(1);
  // True from the moment Restart run is clicked until the longest mock card
  // has had time to resolve. Drives the button's spinner + disabled state.
  const isRestarting = useSignal(false);
  // Stays false for this page session until the first Restart run click.
  // Drives the glowy "click me" hint on initial load.
  const hasRestarted = useSignal(false);

  // Restore preferences from the cookie before the first render. Because
  // useTask$ awaits before the JSX is committed, this resolves during SSR —
  // which means the streamed Suspense fallbacks already use the saved order.
  useTask$(async () => {
    const prefs = await getRevealPrefsCookie();
    order.value = prefs.order;
    collapsed.value = prefs.collapsed;
  });

  return (
    <ExampleShell>
      <QuickScan
        reactPattern="Coordinate when sibling async cards are allowed to reveal."
        qwikPattern="Reveal wraps Suspense children and controls swap ordering."
        refreshTrigger="Changing order/collapsed options, then clicking Restart run."
        pendingUi="Fallback cards release in selected order: parallel, sequential, reverse, or together."
      />
      <div class="space-y-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-400">
          Reveal order
        </span>
        <div class="flex flex-wrap gap-2">
          {ORDERS.map((o) => (
            <button
              key={o.value}
              class={[
                "cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition",
                order.value === o.value
                  ? "border-cyan-300 bg-cyan-300 text-slate-950"
                  : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500",
              ]}
              onClick$={async () => {
                order.value = o.value;
                await setRevealPrefsCookie({
                  order: o.value,
                  collapsed: collapsed.value,
                });
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p class="text-xs text-slate-500">
          {ORDERS.find((o) => o.value === order.value)?.description}
        </p>
        <p class="text-[11px] text-slate-500">
          Saved to a cookie — refresh the page to replay SSR with this order.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-4">
        <label
          class={[
            "flex items-center gap-2 text-sm",
            order.value === "sequential"
              ? "text-slate-200"
              : "text-slate-500",
          ]}
        >
          <input
            type="checkbox"
            class="h-4 w-4 cursor-pointer accent-cyan-300 disabled:cursor-not-allowed"
            checked={collapsed.value}
            disabled={order.value !== "sequential"}
            onInput$={async (_, el) => {
              collapsed.value = el.checked;
              await setRevealPrefsCookie({
                order: order.value,
                collapsed: el.checked,
              });
            }}
          />
          <span>
            collapsed <em class="text-slate-500">(sequential only)</em>
          </span>
        </label>

        <div class="relative inline-flex items-center">
          {!hasRestarted.value && !isRestarting.value && (
            <span
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-md bg-cyan-300/30"
            />
          )}
          <button
            disabled={isRestarting.value}
            class={[
              "cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition disabled:cursor-wait",
              isRestarting.value
                ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-100"
                : !hasRestarted.value
                  ? "animate-pulse border-cyan-300 bg-cyan-300 text-slate-950 shadow-[0_0_18px_rgba(103,232,249,0.45)] hover:bg-cyan-200"
                  : "border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-300/40 hover:text-cyan-200",
            ]}
            onClick$={() => {
              hasRestarted.value = true;
              isRestarting.value = true;
              seed.value++;
              setTimeout(() => {
                isRestarting.value = false;
              }, RESTART_DURATION_MS);
            }}
          >
            {isRestarting.value ? (
              <span class="flex items-center gap-2">
                <span class="h-3 w-3 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                Restarting…
              </span>
            ) : (
              <span>Restart run</span>
            )}
          </button>
        </div>
        {!hasRestarted.value && !isRestarting.value && (
          <span class="animate-pulse text-xs font-medium text-cyan-300/90">
            ← click to play this run
          </span>
        )}
        <span class="text-xs text-slate-500">
          {isRestarting.value ? "Loading run #" : "Run #"}
          {seed.value}
        </span>
      </div>

      <section class="space-y-3">
        <h3 class="text-sm font-semibold text-slate-200">Primary group</h3>
        <p class="text-xs text-slate-400">
          Three siblings under one{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            {`<Reveal order="${order.value}">`}
          </code>
          . Watch how they swap in as each resolves.
        </p>
        {seed.value > 0 && (
          <div key={`primary-${seed.value}`}>
            <Reveal order={order.value} collapsed={collapsed.value}>
              <div class="grid gap-3 sm:grid-cols-3">
                <AsyncCard title="A" delay={500} />
                <AsyncCard title="B" delay={1100} />
                <AsyncCard title="C" delay={1700} />
              </div>
            </Reveal>
          </div>
        )}
      </section>

      <section class="space-y-3">
        <h3 class="text-sm font-semibold text-slate-200">Nested group</h3>
        <p class="text-xs text-slate-400">
          The outer group uses{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            order="{order.value}"
          </code>
          . The inner group is always{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            order="parallel"
          </code>{" "}
          — it registers as a single composite slot in the outer group, then each
          inner card reveals on its own once the outer releases it.
        </p>
        {seed.value > 0 && (
          <div key={`nested-${seed.value}`}>
            <Reveal order={order.value} collapsed={collapsed.value}>
              <div class="grid gap-3 lg:grid-cols-3">
                <AsyncCard title="Outer-1" delay={700} />
                <Reveal order="parallel">
                  <div class="grid gap-3">
                    <AsyncCard title="Inner-1" delay={900} nested />
                    <AsyncCard title="Inner-2" delay={1300} nested />
                  </div>
                </Reveal>
                <AsyncCard title="Outer-2" delay={1500} />
              </div>
            </Reveal>
          </div>
        )}
      </section>

      <TimingLegend />
    </ExampleShell>
  );
});

type AsyncCardProps = {
  title: string;
  delay: number;
  nested?: boolean;
};

const AsyncCard = component$<AsyncCardProps>(({ title, delay, nested }) => {
  const item = useAsync$<RevealItem>(async () => {
    return getMockRevealItem(title, delay);
  });

  return (
    <Suspense fallback={<RevealCardFallback title={title} delay={delay} nested={nested} />}>
      <RevealCard item={item.value} nested={nested} />
    </Suspense>
  );
});

type RevealCardProps = {
  item: RevealItem;
  nested?: boolean;
};

const RevealCard = component$<RevealCardProps>(({ item, nested }) => {
  return (
    <article
      class={[
        "space-y-2 rounded-lg border border-solid p-4",
        nested
          ? "border-violet-300/40 bg-violet-950/30"
          : "border-cyan-300/40 bg-cyan-950/40",
      ]}
    >
      <div class="flex h-5 items-center justify-between">
        <span
          class={[
            "text-sm font-semibold leading-5",
            nested ? "text-violet-100" : "text-white",
          ]}
        >
          {item.title}
        </span>
        <span class="rounded bg-slate-950 px-1.5 py-0.5 text-[10px] font-mono leading-4 text-slate-300">
          {item.delayMs}ms
        </span>
      </div>
      <p class="text-xs leading-4 text-slate-300">{item.message}</p>
      <p class="text-[11px] leading-4 text-slate-500">
        Resolved at {item.resolvedAt}
      </p>
    </article>
  );
});

type RevealCardFallbackProps = {
  title: string;
  delay: number;
  nested?: boolean;
};

/**
 * Outline placeholder — same dimensions, padding, gap and border radius as the
 * loaded card so SSR streams a perfectly shaped silhouette and content swaps
 * in without any layout shift. Title + delay are rendered eagerly so the user
 * still sees what is loading; the two text rows are skeleton bars matched to
 * the line-height of the real `<p>` rows.
 */
const RevealCardFallback = component$<RevealCardFallbackProps>(
  ({ title, delay, nested }) => {
    return (
      <article
        class={[
          "space-y-2 rounded-lg border border-dashed p-4",
          nested
            ? "border-violet-300/40 bg-violet-950/10"
            : "border-cyan-300/40 bg-cyan-950/10",
        ]}
        aria-busy="true"
        aria-live="polite"
      >
        <div class="flex h-5 items-center justify-between">
          <span
            class={[
              "flex items-center gap-2 text-sm font-semibold leading-5",
              nested ? "text-violet-200/70" : "text-cyan-100/70",
            ]}
          >
            <span
              class={[
                "h-3 w-3 animate-spin rounded-full border-2 border-t-transparent",
                nested ? "border-violet-300" : "border-cyan-300",
              ]}
            />
            {title}
          </span>
          <span class="rounded bg-slate-950 px-1.5 py-0.5 text-[10px] font-mono leading-4 text-slate-400">
            {delay}ms
          </span>
        </div>
        <div class="h-4 w-3/4 animate-pulse rounded bg-slate-800/60" />
        <div class="h-4 w-1/2 animate-pulse rounded bg-slate-800/60" />
      </article>
    );
  },
);

const TimingLegend = component$(() => (
  <div class="flex flex-wrap gap-x-5 gap-y-1 border-t border-slate-800 pt-3 text-[11px] text-slate-500">
    <span>
      <span class="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-400" />A
      ~500ms
    </span>
    <span>
      <span class="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-400" />B
      ~1100ms
    </span>
    <span>
      <span class="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-400" />C
      ~1700ms
    </span>
    <span>
      <span class="mr-1 inline-block h-2 w-2 rounded-full bg-violet-400" />
      Inner cards 900–1300ms
    </span>
    <span>
      <span class="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-400" />
      Outer cards 700–1500ms
    </span>
  </div>
));
