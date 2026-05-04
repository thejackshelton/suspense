import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import { ErrorStateExample } from "~/components/examples/error-state";
import { ExamplePage } from "~/components/examples/example-page";

export default component$(() => {
  return (
    <ExamplePage
      eyebrow="Async error state"
      title="Inline error state"
      description="This example throws from the useAsync$ callback when the mock server report fails. Suspense handles pending work, while the async signal exposes the error."
    >
      <ErrorStateExample />
    </ExamplePage>
  );
});

export const head: DocumentHead = {
  title: "Inline error state | Qwik useAsync$ Examples",
  meta: [
    {
      name: "description",
      content:
        "A Qwik v2 useAsync$ example showing Suspense pending UI and inline error rendering.",
    },
  ],
};
