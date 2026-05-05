import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import {
  AssistantHeading,
  AssistantMessage,
  UserMessage,
} from "~/components/chat/chat-message";
import { ChatThread } from "~/components/chat/chat-thread";
import { EXAMPLE_THREADS } from "~/components/chat/threads";
import { ABTestingExample } from "~/components/examples/ab-testing";

const meta = EXAMPLE_THREADS.find((thread) => thread.slug === "ab-testing")!;

export default component$(() => {
  return (
    <ChatThread
      title={meta.title}
      subtitle={meta.subtitle}
      composerPlaceholder="Ask about multi-layer personalization…"
    >
      <UserMessage>
        <p>
          I need to run multiple A/B tests on the same page — hero copy, pricing
          tiers, recommendations, and a CTA. Won't that create a performance
          bottleneck?
        </p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Independent Suspense boundaries = no waterfall" />
        <p>
          Not at all. Each experiment gets its own{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            useAsync$
          </code>{" "}
          call wrapped in its own{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            {"<Suspense>"}
          </code>{" "}
          boundary. They fire in parallel — a slow recommendations engine
          (~1200ms) never blocks the fast CTA experiment (~200ms). Switch the
          user segment below and watch: the hero and CTA resolve first, pricing
          fills in next, and recommendations arrive last.
        </p>

        <ABTestingExample />
      </AssistantMessage>

      <UserMessage>
        <p>Why is this better than fetching all personalization in one call?</p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Granular boundaries beat monolithic fetches" />
        <p>
          A single "get all personalization" RPC means the entire page waits for
          the slowest experiment. With independent{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            {"<Suspense>"}
          </code>{" "}
          boundaries, fast experiments paint immediately while slow ones stream
          in. Each boundary shows its own skeleton, so the user sees progressive
          results instead of a single big spinner.
        </p>
        <p>
          The{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            previous
          </code>{" "}
          parameter in{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            useAsync$
          </code>{" "}
          lets you skip the delay on the very first render (SSR), so
          personalized content shows up instantly on initial page load. On
          subsequent segment changes, each layer refetches at its own pace with
          stale-while-revalidate behavior — the old variant stays visible with
          reduced opacity until the new one arrives.
        </p>
      </AssistantMessage>

      <UserMessage>
        <p>
          What if I want to add more experiments later — say a footer or banner?
        </p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Composable by design" />
        <p>
          Just add another{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            useAsync$
          </code>{" "}
          +{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            {"<Suspense>"}
          </code>{" "}
          pair. Each experiment is fully self-contained — it tracks the same
          segment signal, fetches its own data, and renders within its own
          boundary. There's no shared loading state to coordinate and no
          cascading re-renders. You can nest Suspense boundaries too: a
          recommendation card could have its own inner Suspense for loading
          detailed metadata after the list appears.
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
        "A Qwik v2 useAsync$ example showing multiple independent A/B tests with separate Suspense boundaries — no waterfall, no perf bottleneck.",
    },
  ],
};
