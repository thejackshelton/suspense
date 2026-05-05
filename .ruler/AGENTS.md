# Project Rules

This is a Qwik v2 playground app demonstrating `useAsync$`, `server$`, and `<Suspense>`.

## Tech Stack

- **Framework**: Qwik v2 (beta) with `@qwik.dev/core` and `@qwik.dev/router`
- **Build**: Vite with `qwikVite` and `qwikRouter` plugins
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm
- **Language**: TypeScript with ESM (`"type": "module"`)

## Conventions

- Always use TypeScript and ESM
- Always prefer Hono.js over Express.js for server code
- Use `component$` from `@qwik.dev/core` for all components
- Use `server$` for server-only logic
- Use `useAsync$` for async state, not route loaders
- Use `<Suspense>` to wrap UI that reads async `.value`
- Path alias `~/` maps to `src/`

## Project Structure

- `src/components/chat/` — Chat UI shell (sidebar, thread, messages, composer)
- `src/components/examples/` — Interactive example components
- `src/mocks/async-examples.ts` — Mock `server$` functions with artificial delays
- `src/routes/` — File-based routing via `@qwik.dev/router`
- Route files stay small and import components; example components own behavior

## Qwik v2 Async Pattern

```tsx
const data = useAsync$(async ({ track }) => {
  const dep = track(signal);
  return serverFunction(dep);
});

return (
  <Suspense fallback={<Loading />}>
    <Component value={data.value} loading={data.loading} />
  </Suspense>
);
```

- `track(signal)` reruns the async work when the signal changes
- `invalidate(info)` manually refreshes async work
- `.value`, `.loading`, `.error` are exposed on the async signal

## Experimental Features

Suspense is enabled via the Vite config:

```ts
qwikVite({ experimental: ["suspense", "noSPA"] })
```
