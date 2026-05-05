// This file is the gentlest example in the repo and doubles as a Qwik
// primer. The other examples skip these breadcrumb comments — see the
// "Qwik for React devs" section in README.md for the full mapping.
import { component$, Suspense, useAsync$, useSignal } from "@qwik.dev/core";

import { getMockProfile, type Profile } from "~/mocks/async-examples";

import { DelayPicker, ExampleShell } from "./example-shell";
import { InlineLoader, LoadingLabel } from "./loading";

// `component$` defines a Qwik component. The `$` is a lazy-load boundary —
// like wrapping every component in `React.lazy`, but built in.
export const TrackedProfileExample = component$(() => {
  // `useSignal` is Qwik's `useState`. Read & write via `.value` (no setter).
  const name = useSignal("Ada");
  const delayMs = useSignal(900);

  // `useAsync$` is React Query / SWR in one hook: it runs an async callback,
  // tracks signals you read inside, and exposes `.value` / `.loading` /
  // `.error` / `.invalidate()` on the returned object.
  const profile = useAsync$(async ({ track, previous }) => {
    // `track(signal)` says "rerun this callback when `signal` changes" —
    // the inline equivalent of a React `useEffect` dependency array.
    const selectedName = track(name);
    const selectedDelayMs = track(delayMs);
    // `previous` is the value from the last run. Skipping the artificial
    // delay on the very first render keeps SSR snappy; updates keep the
    // full delay so you can watch the loading state.
    const delay = previous ? selectedDelayMs : 0;

    // `getMockProfile` is a `server$` function from src/mocks/profile.ts —
    // calling it from component code is RPC: the optimizer turns the call
    // site into a fetch to a generated endpoint.
    return getMockProfile(selectedName, delay);
  });

  return (
    <ExampleShell>
      <div class="flex flex-wrap gap-2">
        {["Ada", "Linus", "Grace"].map((person) => (
          <button
            key={person}
            // Array `class={[…]}` works natively — no `clsx` needed.
            class={[
              "cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition",
              name.value === person
                ? "border-cyan-300 bg-cyan-300 text-slate-950"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500",
            ]}
            // `onClick$` is a regular click handler. The `$` lets the
            // optimizer ship this function only when the click actually fires.
            onClick$={() => (name.value = person)}
          >
            {person}
          </button>
        ))}
      </div>

      <DelayPicker delayMs={delayMs} />

      {/* `<Suspense fallback>` renders the fallback while `.value` is
          pending. Works during SSR streaming too — the server flushes the
          fallback first, then streams the resolved content in. */}
      <Suspense fallback={<ProfileFallback delayMs={delayMs.value} />} delay={120}>
        <ProfileCard profile={profile.value} loading={profile.loading} />
      </Suspense>
    </ExampleShell>
  );
});

type ProfileCardProps = {
  profile: Profile;
  loading: boolean;
};

const ProfileCard = component$<ProfileCardProps>(({ profile, loading }) => {
  return (
    <article class="space-y-4 rounded-md border border-cyan-300/40 bg-cyan-950/40 p-4">
      {loading && <InlineLoader label="Loading new profile" />}
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold text-white">{profile.name}</h3>
          <p class="text-sm text-cyan-100">{profile.role}</p>
        </div>
        <span class="rounded-md bg-slate-950 px-2 py-1 text-xs font-medium text-cyan-200">
          {profile.delayMs}ms
        </span>
      </div>
      <p class="mt-4 text-sm text-slate-300">Resolved at {profile.requestedAt}</p>
    </article>
  );
});

const ProfileFallback = component$<{ delayMs: number }>(({ delayMs }) => {
  return (
    <div class="space-y-4 rounded-md border border-slate-800 bg-slate-950 p-4">
      <LoadingLabel label={`Waiting on a ${delayMs}ms mock profile request`} />
      <div class="space-y-3">
        <div class="h-4 w-32 animate-pulse rounded bg-slate-800" />
        <div class="h-3 w-48 animate-pulse rounded bg-slate-800" />
        <div class="h-3 w-24 animate-pulse rounded bg-slate-800" />
      </div>
    </div>
  );
});
