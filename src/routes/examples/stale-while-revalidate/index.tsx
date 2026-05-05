import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import {
  AssistantHeading,
  AssistantMessage,
  UserMessage,
} from "~/components/chat/chat-message";
import { ChatThread } from "~/components/chat/chat-thread";
import { EXAMPLE_THREADS } from "~/components/chat/threads";
import { StaleWhileRevalidateExample } from "~/components/examples/stale-while-revalidate";

const meta = EXAMPLE_THREADS.find(
  (thread) => thread.slug === "stale-while-revalidate",
)!;

export default component$(() => {
  return (
    <ChatThread
      title={meta.title}
      subtitle={meta.subtitle}
      composerPlaceholder="Ask about loading, .value, and previous data…"
    >
      <UserMessage>
        <p>
          When I refresh, I don't want the screen to flash a skeleton again. Can
          I keep the old number while the new one is fetching?
        </p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Stale-while-revalidate" />
        <p>
          Yes — that's the default behavior of{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            useAsync$
          </code>
          . Once the signal has resolved at least once, reading{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .value
          </code>{" "}
          during a refetch returns the previous value instead of throwing the
          fetch promise. Because nothing throws,{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            &lt;Suspense&gt;
          </code>{" "}
          stays satisfied and never falls back to the skeleton again.
        </p>
        <p>
          The component uses{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .loading
          </code>{" "}
          to label the visible reading as <em>Stale</em> and dim the card while
          the new request is in flight. When the new value resolves the card
          flips back to <em>Live</em> with the fresh number and timestamp.
        </p>

        <StaleWhileRevalidateExample />
      </AssistantMessage>

      <UserMessage>
        <p>What is "previous" giving me here?</p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="ctx.previous vs signal.value" />
        <p>
          The async callback receives a{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            previous
          </code>{" "}
          field — the result of the last successful run, or{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            undefined
          </code>{" "}
          on the first run. This example uses it as an "is this the initial
          load?" check so the first request resolves with{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            0ms
          </code>{" "}
          delay (don't ruin SSR), but every refresh after that goes through the
          1.1s mock delay so the stale-state UI is easy to see.
        </p>
        <p>
          On the read side,{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            metric.value
          </code>{" "}
          is what your JSX should render. While{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            metric.loading
          </code>{" "}
          is{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            true
          </code>
          , that value is the previous one — so dim it, badge it as stale, and
          let the new value swap in cleanly.
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
        "A Qwik v2 useAsync$ example that keeps the previous value visible while a refetch is in flight, shown as a chat thread.",
    },
  ],
};
