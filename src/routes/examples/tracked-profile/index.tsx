import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import {
  AssistantHeading,
  AssistantMessage,
  UserMessage,
} from "~/components/chat/chat-message";
import { ChatThread } from "~/components/chat/chat-thread";
import { EXAMPLE_THREADS } from "~/components/chat/threads";
import { TrackedProfileExample } from "~/components/examples/tracked-profile";

const meta = EXAMPLE_THREADS.find((thread) => thread.slug === "tracked-profile")!;

export default component$(() => {
  return (
    <ChatThread
      title={meta.title}
      subtitle={meta.subtitle}
      composerPlaceholder="Ask about a different person, or change the delay…"
    >
      <UserMessage>
        <p>
          Can you look up Ada's profile? I'd also like to flip between Linus and
          Grace, and tweak how long the request takes.
        </p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Tracked useAsync$" />
        <p>
          Sure. The component below stores the selected name and delay in two
          signals, and{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            useAsync$
          </code>{" "}
          tracks both. Whenever either changes, the async callback reruns and
          calls the mock{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            getMockProfile
          </code>{" "}
          server function. While the new value is pending,{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            &lt;Suspense&gt;
          </code>{" "}
          shows a fallback.
        </p>

        <TrackedProfileExample />
      </AssistantMessage>

      <UserMessage>
        <p>What is the inline spinner doing on top of the result?</p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Why the inline loader appears" />
        <p>
          Suspense holds the fallback until the new value is ready. After the
          first resolve, the previous{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .value
          </code>{" "}
          stays visible during a refetch, and the async signal flips{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .loading
          </code>{" "}
          to <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">true</code>
          . The example reads that flag and renders an inline loader so you can
          see when the server call is in flight.
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
        "A Qwik v2 useAsync$ example that tracks signals and renders with Suspense, shown as a chat thread.",
    },
  ],
};
