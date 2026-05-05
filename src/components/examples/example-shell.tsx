import { component$, Slot, type Signal } from "@qwik.dev/core";

/**
 * Container for the interactive part of an example. The chat message around
 * each example provides the title and explanation, so this shell only needs to
 * group the controls and result.
 */
export const ExampleShell = component$(() => {
  return (
    <section class="flex flex-col gap-5 rounded-xl border border-slate-700/70 bg-slate-950/70 p-4 shadow-inner shadow-slate-950/40">
      <Slot />
    </section>
  );
});

type DelayPickerProps = {
  delayMs: Signal<number>;
};

export const DelayPicker = component$<DelayPickerProps>(({ delayMs }) => {
  return (
    <label class="block space-y-2">
      <span class="text-xs font-medium uppercase tracking-wide text-slate-400">
        Delay: {delayMs.value}ms
      </span>
      <input
        class="w-full accent-cyan-300"
        type="range"
        min={300}
        max={1800}
        step={100}
        bind:value={delayMs}
      />
    </label>
  );
});
