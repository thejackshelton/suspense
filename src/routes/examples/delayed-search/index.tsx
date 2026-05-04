import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import { DelayedSearchExample } from "~/components/examples/delayed-search";
import { ExamplePage } from "~/components/examples/example-page";

export default component$(() => {
  return (
    <ExamplePage
      eyebrow="Search with useAsync$"
      title="Delayed search"
      description="This example binds an input to a signal. useAsync$ tracks the query and delay, then calls a mock server search while Suspense renders the fallback."
    >
      <DelayedSearchExample />
    </ExamplePage>
  );
});

export const head: DocumentHead = {
  title: "Delayed search | Qwik useAsync$ Examples",
  meta: [
    {
      name: "description",
      content:
        "A Qwik v2 useAsync$ search example using signal tracking and Suspense.",
    },
  ],
};
