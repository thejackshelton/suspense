import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

import {
  AssistantHeading,
  AssistantMessage,
  UserMessage,
} from "~/components/chat/chat-message";
import { ChatThread } from "~/components/chat/chat-thread";
import { EXAMPLE_THREADS, HOME_THREAD } from "~/components/chat/threads";

export default component$(() => {
  return (
    <ChatThread
      title={HOME_THREAD.title}
      subtitle={HOME_THREAD.subtitle}
      composerPlaceholder="Ask about useAsync$, server$, or Suspense…"
    >
      <UserMessage>
        <p>What is this place?</p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="Welcome" />
        <p>
          This is a small Qwik v2 playground for{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            useAsync$
          </code>
          ,{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            server$
          </code>
          , and{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            &lt;Suspense&gt;
          </code>
          , dressed up like a chat app. Each conversation in the sidebar runs a
          mock server function with an artificial delay so the loading and
          pending UI is easy to see — no route loaders involved.
        </p>
        <p class="text-slate-300">
          Pick a thread on the left, or start with one of the four demos below.
        </p>

        <ul class="grid gap-3 sm:grid-cols-2">
          {EXAMPLE_THREADS.map((thread) => (
            <li key={thread.slug}>
              <a
                class="group block h-full rounded-xl border border-slate-700/70 bg-slate-950/60 p-4 transition hover:border-cyan-300/60 hover:bg-slate-900"
                href={thread.href}
              >
                <p class="text-sm font-semibold text-white group-hover:text-cyan-100">
                  {thread.title}
                </p>
                <p class="mt-1 text-xs leading-5 text-slate-400">
                  {thread.subtitle}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </AssistantMessage>

      <UserMessage>
        <p>How do these APIs fit together?</p>
      </UserMessage>

      <AssistantMessage>
        <AssistantHeading label="The shape" />
        <p>
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            useAsync$
          </code>{" "}
          owns the async value. Inside its callback you read tracked signals,
          call{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            server$
          </code>{" "}
          functions, and return a result. The async signal exposes{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .value
          </code>
          ,{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .loading
          </code>
          ,{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .error
          </code>
          , and{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .invalidate()
          </code>
          .
        </p>
        <p>
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            &lt;Suspense&gt;
          </code>{" "}
          wraps the part of the tree that reads{" "}
          <code class="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
            .value
          </code>{" "}
          and renders a fallback while it is pending. Each demo thread shows one
          piece of this story.
        </p>
      </AssistantMessage>
    </ChatThread>
  );
});

export const head: DocumentHead = {
  title: "Suspense — Qwik v2 useAsync$ chat playground",
  meta: [
    {
      name: "description",
      content:
        "A ChatGPT-style playground for Qwik v2 useAsync$, server$, and Suspense.",
    },
  ],
};
