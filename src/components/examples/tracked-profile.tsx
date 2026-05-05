import { component$, Suspense, useAsync$, useSignal } from "@qwik.dev/core";

import { getMockProfile, type Profile } from "~/mocks/async-examples";

import { DelayPicker, ExampleShell } from "./example-shell";
import { InlineLoader, LoadingLabel } from "./loading";

export const TrackedProfileExample = component$(() => {
  const name = useSignal("Ada");
  const delayMs = useSignal(900);
  const profile = useAsync$(async ({ track }) => {
    const selectedName = track(name);
    const selectedDelayMs = track(delayMs);

    return getMockProfile(selectedName, selectedDelayMs);
  });

  return (
    <ExampleShell>
      <div class="flex flex-wrap gap-2">
        {["Ada", "Linus", "Grace"].map((person) => (
          <button
            key={person}
            class={[
              "rounded-md border px-3 py-2 text-sm font-medium transition",
              name.value === person
                ? "border-cyan-300 bg-cyan-300 text-slate-950"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500",
            ]}
            onClick$={() => (name.value = person)}
          >
            {person}
          </button>
        ))}
      </div>

      <DelayPicker delayMs={delayMs} />

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
