import { component$, Slot, type Signal } from "@qwik.dev/core";

type ExampleShellProps = {
  title: string;
  description: string;
};

export const ExampleShell = component$<ExampleShellProps>((props) => {
  return (
    <section class="flex min-h-96 flex-col gap-5 rounded-lg border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/40">
      <div class="space-y-2">
        <h2 class="text-xl font-semibold text-white">{props.title}</h2>
        <p class="text-sm leading-6 text-slate-300">{props.description}</p>
      </div>
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
      <span class="text-sm font-medium text-slate-300">
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
