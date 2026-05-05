import { component$, Slot } from "@qwik.dev/core";

import { ChatComposer } from "./chat-composer";

type ChatThreadProps = {
  /** Title shown at the top of the chat. */
  title: string;
  /** Description rendered as a subtitle next to the title. */
  subtitle?: string;
  /** Optional placeholder for the decorative composer at the bottom. */
  composerPlaceholder?: string;
};

export const ChatThread = component$<ChatThreadProps>(
  ({ title, subtitle, composerPlaceholder }) => {
    return (
      <>
        <header class="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-800/80 bg-slate-900/80 px-4 py-3 backdrop-blur sm:px-8">
          <div class="grid h-9 w-9 place-items-center rounded-full bg-cyan-300/10 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-300/30">
            Q
          </div>
          <div class="min-w-0">
            <h1 class="truncate text-sm font-semibold text-white">{title}</h1>
            {subtitle ? (
              <p class="truncate text-xs text-slate-400">{subtitle}</p>
            ) : null}
          </div>
        </header>

        <main class="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          <div class="mx-auto flex w-full max-w-3xl flex-col gap-8">
            <Slot />
          </div>
        </main>

        <ChatComposer placeholder={composerPlaceholder} />
      </>
    );
  },
);
