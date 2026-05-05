import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import {
  AssistantHeading,
  AssistantMessage,
  UserMessage,
} from "~/components/chat/chat-message";
import { ChatThread } from "~/components/chat/chat-thread";
import { EXAMPLE_THREADS } from "~/components/chat/threads";
import { ErrorStateExample } from "~/components/examples/error-state";

const meta = EXAMPLE_THREADS.find((thread) => thread.slug === "error-state")!;

export default component$(() => {
  return (
    <ChatThread
      title={meta.title}
      subtitle={meta.subtitle}
      composerPlaceholder="Try a successful run, or force a failure…"
    >
      <UserMessage>
        <p>
          Generate a status report for me. I want to see what happens when the
          server fails halfway through, too.
        </p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Inline error state" />
        <p>
          The async callback below throws when the mock report fails. Suspense
          handles the pending UI on the first run, and after that the async
          signal exposes the rejection on{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .error
          </code>{" "}
          so the component can render an inline message right next to the
          result.
        </p>

        <ErrorStateExample />
      </AssistantMessage>

      <UserMessage>
        <p>Should errors always live next to the result, or higher up?</p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Whichever you prefer" />
        <p>
          For tightly-scoped failures — a single card refusing to load — keeping{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .error
          </code>{" "}
          inline keeps the rest of the thread interactive. For unrecoverable
          failures, you can also let the error throw past Suspense to a
          higher-level <em>ErrorBoundary</em> the same way you would with a
          synchronous render error.
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
        "A Qwik v2 useAsync$ example showing Suspense pending UI and inline error rendering, shown as a chat thread.",
    },
  ],
};
