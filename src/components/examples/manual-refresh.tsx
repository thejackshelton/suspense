import { component$, Suspense, useAsync$, useSignal } from "@qwik.dev/core";

import { checkMockInventory, type Inventory } from "~/mocks/async-examples";

import { ExampleShell, QuickScan } from "./example-shell";
import { InlineLoader, ListFallback } from "./loading";

export const ManualRefreshExample = component$(() => {
  const selectedItem = useSignal("Qwik mug");
  const inventory = useAsync$<Inventory>(async ({ info, previous }) => {
    const item = typeof info === "string" ? info : "Qwik mug";
    const delay = previous ? 1000 : 0;

    return checkMockInventory(item, delay);
  });

  return (
    <ExampleShell>
      <QuickScan
        reactPattern="Click-to-refetch flow (similar to queryClient.invalidateQueries)."
        qwikPattern="useAsync$ reruns through invalidate(item), read as ctx.info."
        refreshTrigger="Clicking an item button (manual only, no tracked signals)."
        pendingUi="Existing inventory stays visible while loading flag marks refresh."
      />
      <div class="flex flex-wrap gap-2">
        {["Qwik mug", "Sticker pack", "Beta badge"].map((item) => (
          <button
            key={item}
            class={[
              "cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition",
              selectedItem.value === item
                ? "border-cyan-300 bg-cyan-300 text-slate-950"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-300 hover:text-white",
            ]}
            onClick$={() => {
              selectedItem.value = item;
              inventory.invalidate(item);
            }}
          >
            Check {item}
          </button>
        ))}
      </div>

      <Suspense fallback={<ListFallback label="Checking inventory" />} delay={120}>
        <InventoryCard
          inventory={inventory.value}
          loading={inventory.loading}
          pendingItem={selectedItem.value}
        />
      </Suspense>
    </ExampleShell>
  );
});

type InventoryCardProps = {
  inventory: Inventory;
  loading: boolean;
  pendingItem: string;
};

const InventoryCard = component$<InventoryCardProps>(
  ({ inventory, loading, pendingItem }) => {
    return (
      <article class="space-y-4 rounded-md border border-slate-800 bg-slate-950 p-4">
        {loading && <InlineLoader label={`Checking ${pendingItem}`} />}
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-semibold text-white">{inventory.item}</h3>
            <p class="mt-1 text-sm text-slate-300">
              {inventory.available} available after {inventory.delayMs}ms
            </p>
          </div>
          {loading && (
            <span class="rounded-md bg-amber-300 px-2 py-1 text-xs font-semibold text-slate-950">
              Refreshing
            </span>
          )}
        </div>
        <p class="mt-4 text-sm text-slate-400">
          Checked at {inventory.checkedAt}
        </p>
      </article>
    );
  },
);
