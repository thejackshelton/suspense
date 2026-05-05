import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import {
  AssistantHeading,
  AssistantMessage,
  UserMessage,
} from "~/components/chat/chat-message";
import { ChatThread } from "~/components/chat/chat-thread";
import { EXAMPLE_THREADS } from "~/components/chat/threads";
import { DelayedSearchExample } from "~/components/examples/delayed-search";

const meta = EXAMPLE_THREADS.find((thread) => thread.slug === "delayed-search")!;

export default component$(() => {
  return (
    <ChatThread
      title={meta.title}
      subtitle={meta.subtitle}
      composerPlaceholder="Refine your query…"
    >
      <UserMessage>
        <p>
          Can you search the docs for me? I want to type a query and see the
          results refresh as I go.
        </p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Search bound to a signal" />
        <p>
          Here's a search that binds the input directly to a signal. The async
          callback tracks both the query and the delay, then calls the mock{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            searchMockDocs
          </code>{" "}
          server function. Suspense handles the first load, then later queries
          keep showing the previous results while{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .loading
          </code>{" "}
          drives the inline refetch indicator.
        </p>

        <DelayedSearchExample />
      </AssistantMessage>

      <UserMessage>
        <p>Why doesn't the list disappear when I keep typing?</p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Stale-while-revalidate, basically" />
        <p>
          Once <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">.value</code>{" "}
          has resolved at least once, Qwik keeps showing it during the next
          fetch and exposes{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .loading
          </code>{" "}
          so you can render a subtle "refreshing" indicator. The Suspense
          fallback is only used for the very first load — or if you ever reset
          the async signal.
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
        "A Qwik v2 useAsync$ search example using signal tracking and Suspense, shown as a chat thread.",
    },
  ],
};
