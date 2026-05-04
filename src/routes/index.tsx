import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import { AsyncExamplesGrid } from "~/components/examples/async-examples-grid";

export default component$(() => {
  return (
    <main class="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div class="mx-auto flex max-w-5xl flex-col gap-8">
        <header class="space-y-3">
          <p class="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Qwik v2 async examples
          </p>
          <h1 class="text-3xl font-semibold text-white sm:text-5xl">
            useAsync$ with server$ and Suspense
          </h1>
          <p class="max-w-3xl text-base leading-7 text-slate-300">
            Each example uses a delayed mock server function. There are no route
            loaders or other loaders involved.
          </p>
        </header>

        <AsyncExamplesGrid />
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Qwik v2 useAsync$ Suspense Examples",
  meta: [
    {
      name: "description",
      content: "Qwik v2 server$, useAsync$, and Suspense examples with mock delays.",
    },
  ],
};
