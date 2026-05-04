import { component$ } from "@qwik.dev/core";

export const ListFallback = component$<{ label: string }>(({ label }) => {
  return (
    <div class="space-y-4 rounded-md border border-slate-800 bg-slate-950 p-4">
      <LoadingLabel label={label} />
      <div class="space-y-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            class="space-y-2 rounded-md border border-slate-800 bg-slate-900 p-3"
          >
            <div class="h-3 w-28 animate-pulse rounded bg-slate-700" />
            <div class="h-3 w-full animate-pulse rounded bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
});

export const LoadingLabel = component$<{ label: string }>(({ label }) => {
  return (
    <div class="flex items-center gap-3 text-sm font-medium text-cyan-100">
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
      <span>{label}...</span>
    </div>
  );
});

export const InlineLoader = component$<{ label: string }>(({ label }) => {
  return (
    <div class="flex items-center gap-3 rounded-md border border-cyan-300/30 bg-cyan-950/50 px-3 py-2 text-sm font-medium text-cyan-100">
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
      <span>{label}...</span>
    </div>
  );
});
