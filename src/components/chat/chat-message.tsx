import { component$, Slot } from "@qwik.dev/core";

type UserMessageProps = {
  /** Initials shown inside the user avatar circle. */
  initials?: string;
};

export const UserMessage = component$<UserMessageProps>(
  ({ initials = "PJ" }) => {
    return (
      <div class="flex justify-end">
        <div class="flex max-w-[85%] items-start gap-3 sm:max-w-[75%]">
          <div class="rounded-2xl rounded-br-sm border border-slate-700/70 bg-slate-800/80 px-4 py-3 text-sm leading-6 text-slate-100 shadow-sm">
            <Slot />
          </div>
          <span class="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-700 text-xs font-semibold text-slate-100">
            {initials}
          </span>
        </div>
      </div>
    );
  },
);

export const AssistantMessage = component$(() => {
  return (
    <div class="flex w-full gap-4">
      <span class="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-300 text-xs font-bold text-slate-950">
        Q
      </span>
      <div class="min-w-0 flex-1 space-y-4 text-sm leading-7 text-slate-100">
        <Slot />
      </div>
    </div>
  );
});

type AssistantHeadingProps = {
  label: string;
};

export const AssistantHeading = component$<AssistantHeadingProps>(({ label }) => {
  return (
    <p class="text-xs font-semibold uppercase tracking-wide text-cyan-300">
      {label}
    </p>
  );
});
