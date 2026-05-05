import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import {
  AssistantHeading,
  AssistantMessage,
  UserMessage,
} from "~/components/chat/chat-message";
import { ChatThread } from "~/components/chat/chat-thread";
import { EXAMPLE_THREADS } from "~/components/chat/threads";
import { RevealOrderExample } from "~/components/examples/reveal-order";

const meta = EXAMPLE_THREADS.find((thread) => thread.slug === "reveal-order")!;

export default component$(() => {
  return (
    <ChatThread
      title={meta.title}
      subtitle={meta.subtitle}
      composerPlaceholder="Ask about Reveal ordering…"
    >
      <UserMessage>
        <p>
          I have a row of cards that each load asynchronously. Some finish
          faster than others, and the result feels janky as they pop in. How do
          I control the order they appear in?
        </p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Reveal coordinates sibling Suspense boundaries" />
        <p>
          Wrap the row in{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            {"<Reveal>"}
          </code>
          . Each child boundary still has its own{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            {"<Suspense>"}
          </code>{" "}
          and its own{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            useAsync$
          </code>
          , but{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            Reveal
          </code>{" "}
          gates when each one is allowed to swap from fallback to content.
          Pick an order and click{" "}
          <strong class="text-slate-200">Restart run</strong> to replay the load
          sequence — or refresh the page to replay it as part of SSR. The
          chosen order and{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            collapsed
          </code>{" "}
          flag are saved to a cookie, so the very first paint after a refresh
          already uses your preferences:
        </p>

        <RevealOrderExample />
      </AssistantMessage>

      <UserMessage>
        <p>What do the four orders actually do?</p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="parallel · sequential · reverse · together" />
        <ul class="space-y-2">
          <li>
            <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
              parallel
            </code>{" "}
            (default) — every boundary reveals as soon as its own async work
            resolves. Fastest perceived load, but the order can feel chaotic.
          </li>
          <li>
            <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
              sequential
            </code>{" "}
            — boundaries reveal in document order. A card that resolves early
            still waits for every card before it. Layout stays predictable.
          </li>
          <li>
            <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
              reverse
            </code>{" "}
            — like sequential, but the tail of the list reveals first and the
            head reveals last. Useful for chat-style "newest first" lists.
          </li>
          <li>
            <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
              together
            </code>{" "}
            — nothing reveals until every boundary is ready, then they all swap
            in at once. Eliminates layout shift entirely at the cost of waiting
            on the slowest item.
          </li>
        </ul>
      </AssistantMessage>

      <UserMessage>
        <p>
          What's the{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            collapsed
          </code>{" "}
          checkbox for?
        </p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Collapsed placeholders during sequential reveal" />
        <p>
          With{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            order="sequential"
          </code>{" "}
          and{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            collapsed
          </code>
          , the boundaries that haven't been released yet keep their fallback
          slot collapsed instead of rendering a tall skeleton next to the
          revealed card. It keeps the row from "growing" all at once. Without{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            collapsed
          </code>
          , each fallback occupies its full size while waiting for its turn.
          The flag has no effect for any other order.
        </p>
      </AssistantMessage>

      <UserMessage>
        <p>How does the nested group behave?</p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Inner Reveal acts as one composite slot" />
        <p>
          A nested{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            {"<Reveal>"}
          </code>{" "}
          registers with its parent as a single slot. The outer group treats
          the entire inner block as one item — once the outer order releases
          it, the inner group then runs its own ordering on its children.
          That's why the inner pair always reveals in{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            parallel
          </code>{" "}
          here even when the outer is{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            sequential
          </code>
          : the outer holds them as a group, then the inner lets them race once
          released.
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
        "A Qwik v2 example of <Reveal> coordinating sibling Suspense boundaries with parallel, sequential, reverse, and together ordering.",
    },
  ],
};
