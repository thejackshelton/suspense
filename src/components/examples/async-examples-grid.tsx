import { component$ } from "@qwik.dev/core";

import { DelayedSearchExample } from "./delayed-search";
import { ErrorStateExample } from "./error-state";
import { exampleLinks } from "./example-links";
import { ManualRefreshExample } from "./manual-refresh";
import { TrackedProfileExample } from "./tracked-profile";

export const AsyncExamplesGrid = component$(() => {
  return (
    <div class="space-y-6">
      <nav class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {exampleLinks.map((example) => (
          <a
            key={example.href}
            class="rounded-lg border border-slate-800 bg-slate-900/70 p-4 transition hover:border-cyan-300 hover:bg-slate-900"
            href={example.href}
          >
            <h2 class="font-semibold text-white">{example.title}</h2>
            <p class="mt-2 text-sm leading-6 text-slate-300">
              {example.description}
            </p>
          </a>
        ))}
      </nav>

      <div class="grid gap-6 lg:grid-cols-2">
        <TrackedProfileExample />
        <DelayedSearchExample />
        <ManualRefreshExample />
        <ErrorStateExample />
      </div>
    </div>
  );
});
