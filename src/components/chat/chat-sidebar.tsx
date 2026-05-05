import { component$ } from "@qwik.dev/core";

import {
  EXAMPLE_THREADS,
  HOME_THREAD,
  type ChatThreadMeta,
} from "./threads";

type ChatSidebarProps = {
  /** Slug of the thread that is currently active. Home thread uses an empty slug. */
  activeSlug: string;
};

export const ChatSidebar = component$<ChatSidebarProps>(({ activeSlug }) => {
  const groups = groupByGroup(EXAMPLE_THREADS);

  return (
    <aside class="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/95 md:flex">
      <div class="flex items-center justify-between gap-2 px-3 pt-4">
        <a
          href={HOME_THREAD.href}
          class="flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-slate-900"
        >
          <span class="grid h-7 w-7 place-items-center rounded-md bg-cyan-300 text-sm font-bold text-slate-950">
            S
          </span>
          <span class="text-sm font-semibold text-white">Suspense</span>
        </a>
        <a
          href={HOME_THREAD.href}
          aria-label="Start a new chat"
          class="grid h-9 w-9 place-items-center rounded-md border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
        >
          <NewChatIcon />
        </a>
      </div>

      <a
        href={HOME_THREAD.href}
        class={[
          "mx-3 mt-3 flex items-center gap-2 rounded-md border border-slate-800 px-3 py-2 text-sm font-medium transition",
          activeSlug === ""
            ? "bg-slate-900 text-cyan-200"
            : "bg-slate-950 text-slate-200 hover:border-cyan-300/40 hover:bg-slate-900",
        ]}
      >
        <NewChatIcon />
        <span>New chat</span>
      </a>

      <nav class="mt-4 flex-1 overflow-y-auto px-2 pb-4">
        {groups.map((group) => (
          <div key={group.label} class="mb-4">
            <p class="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              {group.label}
            </p>
            <ul class="space-y-0.5">
              {group.threads.map((thread) => (
                <li key={thread.slug}>
                  <a
                    href={thread.href}
                    class={[
                      "block rounded-md px-3 py-2 text-sm leading-snug transition",
                      activeSlug === thread.slug
                        ? "bg-cyan-300/10 text-cyan-100 ring-1 ring-cyan-300/30"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white",
                    ]}
                  >
                    <span class="block truncate font-medium">{thread.title}</span>
                    <span class="mt-0.5 block truncate text-xs text-slate-500">
                      {thread.timestamp}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div class="border-t border-slate-800/80 px-3 py-3 text-xs leading-5 text-slate-500">
        <p>
          Demo only — every thread runs against the mock{" "}
          <code class="rounded bg-slate-900 px-1 py-0.5 text-cyan-200">server$</code>{" "}
          functions in
          <span class="ml-1 font-mono text-slate-400">src/mocks</span>.
        </p>
      </div>
    </aside>
  );
});

function groupByGroup(threads: ChatThreadMeta[]) {
  const order: ChatThreadMeta["group"][] = ["Today", "Yesterday", "Last 7 days"];
  return order
    .map((label) => ({
      label,
      threads: threads.filter((thread) => thread.group === label),
    }))
    .filter((group) => group.threads.length > 0);
}

const NewChatIcon = component$(() => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
});
