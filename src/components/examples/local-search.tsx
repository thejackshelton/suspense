import { component$, Suspense, useAsync$, useSignal } from "@qwik.dev/core";

import {
  LOCAL_PRODUCTS,
  searchMockProducts,
  type EnrichedProduct,
  type LocalProduct,
} from "~/mocks/async-examples";

import { DelayPicker, ExampleShell } from "./example-shell";
import { InlineLoader, ListFallback } from "./loading";

export const LocalSearchExample = component$(() => {
  const query = useSignal("");
  const delayMs = useSignal(1200);

  const serverResults = useAsync$<EnrichedProduct[]>(
    async ({ track, previous }) => {
      const search = track(query);
      const selectedDelayMs = track(delayMs);
      const delay = previous ? selectedDelayMs : 0;

      return searchMockProducts(search, delay);
    },
  );

  const localFiltered = filterLocal(query.value);

  return (
    <ExampleShell>
      <label class="block space-y-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-400">
          Search products
        </span>
        <input
          class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2"
          placeholder="Try apparel, mug, or stickers"
          bind:value={query}
        />
      </label>

      <DelayPicker delayMs={delayMs} />

      <div class="grid gap-4 md:grid-cols-2">
        <section class="space-y-3">
          <h3 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span class="inline-block h-2 w-2 rounded-full bg-amber-300" />
            Local (instant)
          </h3>
          <ul class="space-y-2">
            {localFiltered.map((p) => (
              <LocalProductCard key={p.id} product={p} />
            ))}
            {localFiltered.length === 0 && (
              <p class="py-4 text-center text-sm text-slate-500">
                No local matches
              </p>
            )}
          </ul>
        </section>

        <section class="space-y-3">
          <h3 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span class="inline-block h-2 w-2 rounded-full bg-emerald-300" />
            Server (enriched)
          </h3>
          <Suspense
            fallback={<ListFallback label="Loading server catalog" />}
            delay={120}
          >
            {serverResults.loading && (
              <InlineLoader label="Fetching live data" />
            )}
            <ul class="space-y-2">
              {serverResults.value.map((p) => (
                <EnrichedProductCard
                  key={p.id}
                  product={p}
                  stale={serverResults.loading}
                />
              ))}
              {serverResults.value.length === 0 && (
                <p class="py-4 text-center text-sm text-slate-500">
                  No server matches
                </p>
              )}
            </ul>
          </Suspense>
        </section>
      </div>
    </ExampleShell>
  );
});

function filterLocal(query: string): LocalProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return LOCAL_PRODUCTS;
  return LOCAL_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  );
}

const LocalProductCard = component$<{ product: LocalProduct }>(
  ({ product }) => {
    return (
      <li class="rounded-md border border-slate-800 bg-slate-900 px-3 py-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-white">{product.name}</span>
          <span class="text-xs text-slate-400">${product.price}</span>
        </div>
        <span class="mt-0.5 text-xs text-slate-500">{product.category}</span>
      </li>
    );
  },
);

type EnrichedCardProps = {
  product: EnrichedProduct;
  stale: boolean;
};

const EnrichedProductCard = component$<EnrichedCardProps>(
  ({ product, stale }) => {
    const priceChanged = product.livePrice !== product.price;
    return (
      <li
        class={[
          "rounded-md border bg-slate-900 px-3 py-2 transition",
          stale ? "border-amber-300/40 opacity-70" : "border-slate-800",
        ]}
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-white">{product.name}</span>
          <div class="flex items-center gap-2">
            {priceChanged ? (
              <>
                <span class="text-xs text-slate-500 line-through">
                  ${product.price}
                </span>
                <span class="text-xs font-semibold text-emerald-300">
                  ${product.livePrice}
                </span>
              </>
            ) : (
              <span class="text-xs text-slate-400">${product.price}</span>
            )}
          </div>
        </div>
        <div class="mt-1 flex items-center gap-3 text-xs text-slate-400">
          <span>{product.stock} in stock</span>
          <span>★ {product.rating}</span>
          <span
            class={[
              "ml-auto rounded px-1.5 py-0.5 text-[10px] font-semibold",
              stale
                ? "bg-amber-300 text-slate-950"
                : "bg-emerald-300 text-slate-950",
            ]}
          >
            {stale ? "Stale" : "Live"}
          </span>
        </div>
      </li>
    );
  },
);
