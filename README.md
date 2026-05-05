# Qwik v2 useAsync$ and Suspense Examples

This app is a small Qwik v2 playground for `useAsync$`, `server$`, and
`<Suspense>`, dressed up like a ChatGPT-style chat app. Each "thread" in the
sidebar is one example, and the user/assistant turns explain what is happening
around an embedded interactive demo.

Useful links:

- [Qwik v2 Docs](https://qwikdev-v2-iframe-bp-fix.qwik-8nx.pages.dev/docs/core/state/#computed-values)
- [Qwik GitHub](https://github.com/QwikDev/qwik/tree/build/v2)
- [Vite](https://vitejs.dev/)

## Qwik v2 Async APIs

Qwik v2 keeps async work close to the component that renders it. These examples
use three APIs together:

- `server$`: Defines server-only logic that can be called from component code.
  The mock functions under `src/mocks/` use delays so the loading states are
  easy to see.
- `useAsync$`: Creates an async signal. The callback can read tracked signals,
  call server functions, expose `.value`, report `.loading`, surface `.error`,
  and rerun through `.invalidate()`.
- `<Suspense>`: Wraps async UI and renders a fallback while async values below
  the boundary are pending.

The important pattern is that `useAsync$` owns the async value, and `<Suspense>`
owns the pending UI around the part of the tree that reads that value.

## Qwik for React devs

If you're coming from React, here's a side-by-side concept map for everything
you'll see in this repo. The short version: Qwik looks like JSX + hooks, but
every `*$` suffix is a lazy-load boundary the optimizer can split out of the
initial bundle.

| React                                          | Qwik                                                   | Notes                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `function MyComp() { … }`                      | `component$(() => …)`                                  | The `$` makes the component a lazy-loadable chunk.                                     |
| `useState(0)`                                  | `useSignal(0)`                                         | Read & write via `.value`. No setter function.                                         |
| `useEffect(() => …, [dep])`                    | `useTask$(({ track }) => { track(dep); … })`           | Runs on the **server** during SSR + on the client. Awaited before first render.        |
| `useEffect(() => …, [])` (browser only)        | `useVisibleTask$(() => …)`                             | Runs only after the component is hydrated/visible in the browser.                      |
| `useMemo(() => f(x), [x])`                     | `useComputed$(() => f(x.value))`                       | Auto-tracks signals you read inside.                                                   |
| `props.children`                               | `<Slot />`                                             | Slots are placed by name; no `children` prop.                                          |
| `onClick={(e) => …}`                           | `onClick$={(e) => …}`                                  | The `$` lets the optimizer ship the handler only when the event actually fires.        |
| `clsx("a", cond && "b")`                       | `class={["a", cond && "b"]}`                           | Native — array classes are supported out of the box.                                   |
| `<input value={x} onChange={e => set(e…)} />`  | `<input bind:value={signal} />`                        | Two-way bind to a signal, like Vue's `v-model`.                                        |
| API route + `fetch`                            | `server$(async () => …)`                               | Call the server function from component code; the optimizer turns it into RPC.         |
| React 18 `<Suspense>` (mostly client)          | `<Suspense fallback>`                                  | Same idea, also works during SSR streaming.                                            |
| React Query / SWR / `useEffect`+`useState`     | `useAsync$`                                            | Exposes `.value`, `.loading`, `.error`, `.invalidate()`.                               |
| `React.lazy` + `Suspense` for code-splitting   | The `$` suffix anywhere (`component$`, `onClick$`, …)  | Every `$` is a code-split point; you don't pick a few special ones.                    |

A few patterns you'll see repeated in the examples:

- `useAsync$(async ({ track, previous }) => { track(signal); return server$Fn(...); })`
  is the workhorse. `track(signal)` says "rerun when this changes" (the React
  equivalent of a `useEffect` dependency array, but expressed inline). `previous`
  is the value from the last run — the examples use `previous ? delayMs : 0` to
  skip the artificial delay on the very first render so SSR is fast.
- `useTask$` is awaited before the first render commits. That's why the reveal
  example reads its cookie inside `useTask$` — by the time the JSX commits, the
  cookie value is already in the signal, so SSR streams the right state from
  the very first byte.
- Cookie persistence in this repo is wrapped in [`src/mocks/cookies.ts`](src/mocks/cookies.ts)
  via a generic `createCookie<T>` factory. Both the A/B-testing segment and the
  reveal-order preferences are built on it, so you only have to learn the
  pattern once.

**On resumability** — Qwik ships zero JS at boot. Functions you wrote with `$`
are downloaded on demand when their event fires. That's why everything async
in this repo is `*$` (`component$`, `useAsync$`, `onClick$`, `server$`, etc.):
those `$` markers are the lazy-load boundaries.

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

Use `track(signal)` when the async work should rerun after a signal changes.
Use `invalidate(info)` when a user action should refresh the async work
manually. If the async callback throws, the async signal exposes that error so
the component can render an inline error state.

## Threads

The landing page at `/` is the welcome thread. Every other thread lives under
`/examples/...` and embeds one demo:

- `/examples/tracked-profile/` — Tracked server call. Watches the selected
  person and delay signals, then reruns the mock profile request.
- `/examples/delayed-search/` — Delayed search. Binds a search input to a
  signal and derives filtered results with a mock server search.
- `/examples/manual-refresh/` — Refresh on demand. Calls `invalidate(item)`
  from a button and reads `info` in the next `useAsync$` run.
- `/examples/error-state/` — Inline error state. Throws from the async
  callback when the mock report fails, then renders `.error` beside the
  Suspense fallback behavior.
- `/examples/stale-while-revalidate/` — Stale-while-revalidate. Keeps the
  previous `.value` visible while `.loading` is true, then swaps in the
  fresh value without flashing a Suspense fallback.
- `/examples/local-search/` — Local-first search with server enrichment.
  Filters a local product list instantly while `useAsync$` fetches enriched
  server results in the background.
- `/examples/ab-testing/` — Multi-layer A/B testing. Four independent
  Suspense boundaries (hero, pricing, recommendations, CTA) resolve at
  different speeds so fast experiments never wait on slow ones.
- `/examples/reveal-order/` — Reveal ordering. Wraps sibling Suspense
  boundaries in `<Reveal>` to coordinate `parallel`, `sequential`,
  `reverse`, and `together` reveal order, plus a nested group. The
  selected order is persisted in a cookie so a refresh replays SSR with
  that ordering from the very first paint.

## Project Structure

```text
src/
  components/
    chat/
      chat-shell.tsx       # sidebar + main-column layout used by the route layout
      chat-sidebar.tsx     # left navigation with the list of "chat threads"
      chat-thread.tsx      # header + scrolling message list + composer
      chat-message.tsx     # user and assistant message rows
      chat-composer.tsx    # decorative ChatGPT-style input at the bottom
      threads.ts           # thread metadata (title, subtitle, route)
    examples/
      ab-testing.tsx               # one example component
      delayed-search.tsx           # one example component
      error-state.tsx              # one example component
      example-shell.tsx            # shared card and delay picker UI
      loading.tsx                  # shared Suspense fallback/loading UI
      local-search.tsx             # one example component
      manual-refresh.tsx           # one example component
      reveal-order.tsx             # one example component
      stale-while-revalidate.tsx   # one example component
      tracked-profile.tsx          # one example component
  mocks/
    async-examples.ts      # barrel re-export — keeps existing imports working
    cookies.ts             # generic createCookie<T> factory (used by ab-testing + reveal)
    profile.ts             # getMockProfile / Profile
    docs.ts                # searchMockDocs / SearchResult
    inventory.ts           # checkMockInventory / Inventory
    metrics.ts             # getMockMetric / Metric
    products.ts            # searchMockProducts / LOCAL_PRODUCTS / filterProducts
    reports.ts             # getUnstableMockReport
    ab-testing.ts          # segment cookie + 4 experiment server$ functions
    reveal.ts              # getMockRevealItem + reveal-prefs cookie
  routes/
    layout.tsx             # mounts the chat shell around every route
    index.tsx              # welcome thread
    examples/
      tracked-profile/index.tsx
      delayed-search/index.tsx
      manual-refresh/index.tsx
      error-state/index.tsx
      stale-while-revalidate/index.tsx
      local-search/index.tsx
      ab-testing/index.tsx
      reveal-order/index.tsx
```

The route files stay small and import components. The example components own
the interactive behavior. The mock functions are separate from the UI so
server-side behavior is easy to inspect.

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

## AI Agent Rules

This repo uses [`@intellectronica/ruler`](https://github.com/intellectronica/ruler)
to keep AI coding assistant instructions in sync across Cursor, Claude Code,
OpenAI Codex, GitHub Copilot, and any other supported agent.

All rules live in `.ruler/AGENTS.md`. After editing, run:

```shell
npx ruler apply
```

This distributes the rules to each agent's config file (`AGENTS.md`, `CLAUDE.md`,
`.codex/config.toml`, etc.). The generated files are gitignored — only `.ruler/`
is committed.
