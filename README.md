# Qwik v2 useAsync$ and Suspense Examples

This app is a small Qwik v2 playground for `useAsync$`, `server$`, and
`<Suspense>`. The main page shows every example together, and each example also
has its own route so the code can be read one topic at a time.

Useful links:

- [Qwik Docs](https://qwik.dev/)
- [Qwik GitHub](https://github.com/QwikDev/qwik)
- [Vite](https://vitejs.dev/)

## Qwik v2 Async APIs

Qwik v2 keeps async work close to the component that renders it. These examples
use three APIs together:

- `server$`: Defines server-only logic that can be called from component code.
  The mock functions in `src/mocks/async-examples.ts` use delays so the loading
  states are easy to see.
- `useAsync$`: Creates an async signal. The callback can read tracked signals,
  call server functions, expose `.value`, report `.loading`, surface `.error`,
  and rerun through `.invalidate()`.
- `<Suspense>`: Wraps async UI and renders a fallback while async values below
  the boundary are pending.

The important pattern is that `useAsync$` owns the async value, and `<Suspense>`
owns the pending UI around the part of the tree that reads that value.

## useAsync$ With Suspense

A tracked example usually follows this shape:

```tsx
const delayMs = useSignal(900);
const profile = useAsync$(async ({ track }) => {
  const delay = track(delayMs);
  return getMockProfile("Ada", delay);
});

return (
  <Suspense fallback={<ProfileFallback delayMs={delayMs.value} />} delay={120}>
    <ProfileCard profile={profile.value} loading={profile.loading} />
  </Suspense>
);
```

Use `track(signal)` when the async work should rerun after a signal changes. Use
`invalidate(info)` when a user action should refresh the async work manually. If
the async callback throws, the async signal exposes that error so the component
can render an inline error state.

## Examples

The landing page at `/` imports all examples and renders them in one grid:

- Tracked server call: Watches the selected person and delay signals, then
  reruns the mock profile request.
- Delayed search: Binds a search input to a signal and derives filtered results
  with a mock server search.
- Refresh on demand: Calls `invalidate(item)` from a button and reads `info` in
  the next `useAsync$` run.
- Inline error state: Throws from the async callback when the mock report fails,
  then renders `.error` beside the Suspense fallback behavior.

Each example also has a focused page:

- `/examples/tracked-profile/`
- `/examples/delayed-search/`
- `/examples/manual-refresh/`
- `/examples/error-state/`

## Project Structure

The code is split so a human can scan by responsibility:

```text
src/
  components/
    examples/
      async-examples-grid.tsx  # all examples on the landing page
      delayed-search.tsx       # one example component
      error-state.tsx          # one example component
      example-links.ts         # route metadata used by nav cards
      example-page.tsx         # shared shell for individual example pages
      example-shell.tsx        # shared card and delay picker UI
      loading.tsx              # shared Suspense fallback/loading UI
      manual-refresh.tsx       # one example component
      tracked-profile.tsx      # one example component
  mocks/
    async-examples.ts          # mock server$ functions and shared types
  routes/
    index.tsx                  # all examples on one page
    examples/
      tracked-profile/index.tsx
      delayed-search/index.tsx
      manual-refresh/index.tsx
      error-state/index.tsx
```

The route files stay small and import components. The example components own the
interactive behavior. The mock functions are separate from the UI so server-side
behavior is easy to inspect.

## Suspense Note

Suspense is enabled through the Qwik Vite optimizer:

```ts
qwikVite({
  experimental: ["suspense", "noSPA"],
});
```

Suspense support is still experimental in this Qwik v2 setup, so behavior may
change as the beta evolves.

## Development

Run the Vite dev server:

```shell
pnpm dev
```

Run type checks:

```shell
pnpm build.types
```

Run the full build:

```shell
pnpm build
```
