import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import { ExamplePage } from "~/components/examples/example-page";
import { TrackedProfileExample } from "~/components/examples/tracked-profile";

export default component$(() => {
  return (
    <ExamplePage
      eyebrow="Tracked useAsync$"
      title="Tracked server call"
      description="This example tracks the selected person and delay. When either signal changes, useAsync$ reruns the server$ function and Suspense covers the pending state."
    >
      <TrackedProfileExample />
    </ExamplePage>
  );
});

export const head: DocumentHead = {
  title: "Tracked server call | Qwik useAsync$ Examples",
  meta: [
    {
      name: "description",
      content:
        "A Qwik v2 useAsync$ example that tracks signals and renders with Suspense.",
    },
  ],
};
