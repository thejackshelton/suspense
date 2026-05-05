import { component$, Suspense, useAsync$, useSignal } from "@qwik.dev/core";

import { getUnstableMockReport } from "~/mocks/async-examples";

import { ExampleShell } from "./example-shell";
import { InlineLoader, ListFallback } from "./loading";

export const ErrorStateExample = component$(() => {
  const shouldFail = useSignal(false);
  const report = useAsync$(async ({ track, previous }) => {
    const fail = track(shouldFail);
    const delay = previous ? 1200 : 0;
    const result = await getUnstableMockReport(fail, delay);

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result.message;
  });

  return (
    <ExampleShell>
      <button
        class="w-fit cursor-pointer rounded-md border border-rose-400 bg-rose-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-rose-300"
        onClick$={() => (shouldFail.value = !shouldFail.value)}
      >
        {shouldFail.value ? "Run successful report" : "Run failing report"}
      </button>

      <Suspense fallback={<ListFallback label="Building report" />} delay={120}>
        {report.error ? (
          <div class="space-y-3">
            {report.loading && <InlineLoader label="Running report" />}
            <div class="rounded-md border border-rose-400/50 bg-rose-950/60 p-4 text-sm leading-6 text-rose-100">
              {report.error.message || "The mock report failed."}
            </div>
          </div>
        ) : (
          <div class="space-y-3">
            {report.loading && <InlineLoader label="Running report" />}
            <div class="rounded-md border border-emerald-400/40 bg-emerald-950/50 p-4 text-sm leading-6 text-emerald-100">
              {report.value}
            </div>
          </div>
        )}
      </Suspense>
    </ExampleShell>
  );
});
