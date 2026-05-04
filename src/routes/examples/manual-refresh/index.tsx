import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import { ExamplePage } from "~/components/examples/example-page";
import { ManualRefreshExample } from "~/components/examples/manual-refresh";

export default component$(() => {
  return (
    <ExamplePage
      eyebrow="Manual invalidation"
      title="Refresh on demand"
      description="This example keeps the async work untracked until a button calls invalidate(item). The item is passed into the next useAsync$ run as info."
    >
      <ManualRefreshExample />
    </ExamplePage>
  );
});

export const head: DocumentHead = {
  title: "Refresh on demand | Qwik useAsync$ Examples",
  meta: [
    {
      name: "description",
      content:
        "A Qwik v2 useAsync$ example using manual invalidation and Suspense.",
    },
  ],
};
