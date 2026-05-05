import { component$, Suspense, useAsync$, useSignal } from "@qwik.dev/core";

import { searchMockDocs } from "~/mocks/async-examples";

import { DelayPicker, ExampleShell, QuickScan } from "./example-shell";
import { InlineLoader, ListFallback } from "./loading";

export const DelayedSearchExample = component$(() => {
  const query = useSignal("");
  const delayMs = useSignal(700);
  const results = useAsync$(async ({ track, previous }) => {
    const search = track(query);
    const selectedDelayMs = track(delayMs);
    const delay = previous ? selectedDelayMs : 0;

    return searchMockDocs(search, delay);
  });

  return (
    <ExampleShell>
      <QuickScan
        reactPattern="Controlled input + async search effect as the query changes."
        qwikPattern="bind:value plus useAsync$ tracking query and delay signals."
        refreshTrigger="Typing in the input or changing the delay slider."
        pendingUi="First load shows Suspense fallback; later searches show stale list + inline loader."
      />
      <label class="block space-y-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-400">
          Search docs
        </span>
        <input
          class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2"
          placeholder="Try async, suspense, or server"
          bind:value={query}
        />
      </label>

      <DelayPicker delayMs={delayMs} />

      <Suspense fallback={<ListFallback label="Searching mock docs" />} delay={120}>
        <div class="space-y-3">
          {results.loading && <InlineLoader label="Searching again" />}
          <ul class="space-y-3">
            {results.value.map((result) => (
              <li
                key={result.id}
                class="rounded-md border border-slate-800 bg-slate-900 p-4"
              >
                <h3 class="font-semibold text-white">{result.title}</h3>
                <p class="mt-1 text-sm leading-6 text-slate-300">
                  {result.summary}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Suspense>
    </ExampleShell>
  );
});
