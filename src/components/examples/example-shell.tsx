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

type QuickScanProps = {
  reactPattern: string;
  qwikPattern: string;
  refreshTrigger: string;
  pendingUi: string;
};

/**
 * Compact orientation panel shown at the top of each demo.
 * It gives React-first readers a fast "what am I looking at?" map.
 */
export const QuickScan = component$<QuickScanProps>(
  ({ reactPattern, qwikPattern, refreshTrigger, pendingUi }) => {
    return (
      <aside class="space-y-2 rounded-md border border-slate-700 bg-slate-900/70 p-3">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-cyan-200">
          Quick scan (React -&gt; Qwik)
        </p>
        <dl class="grid gap-2 text-xs leading-5">
          <div>
            <dt class="text-slate-400">React pattern</dt>
            <dd class="text-slate-200">{reactPattern}</dd>
          </div>
          <div>
            <dt class="text-slate-400">Qwik shape</dt>
            <dd class="text-slate-200">{qwikPattern}</dd>
          </div>
          <div>
            <dt class="text-slate-400">What causes a rerun</dt>
            <dd class="text-slate-200">{refreshTrigger}</dd>
          </div>
          <div>
            <dt class="text-slate-400">Pending UI behavior</dt>
            <dd class="text-slate-200">{pendingUi}</dd>
          </div>
        </dl>
      </aside>
    );
  },
);

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
