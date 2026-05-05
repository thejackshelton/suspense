import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import {
  AssistantHeading,
  AssistantMessage,
  UserMessage,
} from "~/components/chat/chat-message";
import { ChatThread } from "~/components/chat/chat-thread";
import { EXAMPLE_THREADS } from "~/components/chat/threads";
import { LocalSearchExample } from "~/components/examples/local-search";

const meta = EXAMPLE_THREADS.find((thread) => thread.slug === "local-search")!;

export default component$(() => {
  return (
    <ChatThread
      title={meta.title}
      subtitle={meta.subtitle}
      composerPlaceholder="Ask about local vs server data…"
    >
      <UserMessage>
        <p>
          When I search a product catalog, I don't want to wait for the server
          every time. Can I filter local data instantly and update it when the
          server responds?
        </p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Two-lane search: instant local + enriched server" />
        <p>
          Think of this demo as two data lanes. Lane 1 is instant: a static
          local list filtered synchronously in the browser. Lane 2 is enriched:{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            useAsync$
          </code>{" "}
          tracks the same query signal and calls a{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            server$
          </code>{" "}
          function for richer fields (live pricing, stock, ratings). Qwik keeps
          the previous server value during refetch, so the server column never
          blanks out.
        </p>

        <LocalSearchExample />
      </AssistantMessage>

      <UserMessage>
        <p>Why are both columns showing different data?</p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Why they differ (and why that helps UX)" />
        <p>
          The left column is a plain in-memory filter — it uses the static{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            LOCAL_PRODUCTS
          </code>{" "}
          array and runs synchronously whenever the signal changes. There's no
          network round-trip, so results appear instantly.
        </p>
        <p>
          The right column calls the server via{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            searchMockProducts
          </code>
          , which adds a simulated delay and returns extra fields like{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            stock
          </code>
          ,{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            rating
          </code>
          , and a live price. While that request is in flight, the previous
          server results stay visible and get re-filtered with your latest query
          (gray <em>Stale</em> cards) — that's{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .loading
          </code>{" "}
          plus a small client-side refinement step.
        </p>
      </AssistantMessage>
    </ChatThread>
  );
});

export const head: DocumentHead = {
  title: `${meta.title} — Suspense playground`,
  meta: [
    {
      name: "description",
      content:
        "A Qwik v2 useAsync$ example that filters local data instantly while fetching enriched server results, shown as a chat thread.",
    },
  ],
};
