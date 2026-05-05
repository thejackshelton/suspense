import { component$ } from "@qwik.dev/core";

type ChatComposerProps = {
  /** Placeholder shown in the decorative input. */
  placeholder?: string;
};

/**
 * Decorative chat input pinned to the bottom of the thread. The send button is
 * intentionally inert — every example is interactive through its embedded
 * controls instead.
 */
export const ChatComposer = component$<ChatComposerProps>(
  ({ placeholder = "Message Suspense…" }) => {
    return (
      <div class="border-t border-slate-800/80 bg-slate-900/80 px-4 pb-6 pt-4 backdrop-blur sm:px-8">
        <form
          class="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 p-2 shadow-lg shadow-slate-950/40 focus-within:border-cyan-300/60"
          preventdefault:submit
          onSubmit$={() => {
            /* the demo composer is intentionally inert */
          }}
        >
          <textarea
            class="min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-500"
            rows={1}
            placeholder={placeholder}
            aria-label="Send a message"
          />
          <button
            type="submit"
            class="grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-cyan-300 text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Send"
            disabled
          >
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
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </form>
        <p class="mx-auto mt-2 max-w-3xl text-center text-xs text-slate-500">
          The composer is decorative — interact with the embedded examples to see
          useAsync$ rerun.
        </p>
      </div>
    );
  },
);
