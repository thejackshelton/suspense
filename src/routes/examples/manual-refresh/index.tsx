import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import {
  AssistantHeading,
  AssistantMessage,
  UserMessage,
} from "~/components/chat/chat-message";
import { ChatThread } from "~/components/chat/chat-thread";
import { EXAMPLE_THREADS } from "~/components/chat/threads";
import { ManualRefreshExample } from "~/components/examples/manual-refresh";

const meta = EXAMPLE_THREADS.find((thread) => thread.slug === "manual-refresh")!;

export default component$(() => {
  return (
    <ChatThread
      title={meta.title}
      subtitle={meta.subtitle}
      composerPlaceholder="Ask about a different SKU…"
    >
      <UserMessage>
        <p>
          How many Qwik mugs do we have in stock? And let me check the sticker
          packs and beta badges too.
        </p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Refresh on demand with invalidate" />
        <p>
          This thread doesn't track any signals. Each button calls{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            inventory.invalidate(item)
          </code>
          , and that <em>item</em> shows up as the{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">info</code>{" "}
          argument inside the next async run. It's the right shape when you
          want a refresh to be a deliberate action instead of a reaction to
          state.
        </p>

        <ManualRefreshExample />
      </AssistantMessage>

      <UserMessage>
        <p>What if I want to refresh without changing the item?</p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Just call invalidate again" />
        <p>
          Calling{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            invalidate
          </code>{" "}
          with the same{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">info</code>{" "}
          will rerun the async callback. The previous value stays on screen,{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .loading
          </code>{" "}
          flips while the request is in flight, and the result swaps in once
          the server resolves.
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
        "A Qwik v2 useAsync$ example using manual invalidation and Suspense, shown as a chat thread.",
    },
  ],
};
