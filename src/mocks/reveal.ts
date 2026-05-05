import type { RevealOrder } from "@qwik.dev/core";
import { server$ } from "@qwik.dev/router";

import { createCookie } from "./cookies";

// ---------------------------------------------------------------------------
// Mock card data
// ---------------------------------------------------------------------------

export type RevealItem = {
  title: string;
  delayMs: number;
  message: string;
  resolvedAt: string;
};

export const getMockRevealItem = server$(
  async (title: string, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    return {
      title,
      delayMs,
      message: `${title} resolved in ${delayMs}ms`,
      resolvedAt: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }),
    } satisfies RevealItem;
  },
);

// ---------------------------------------------------------------------------
// Reveal example preferences — order + collapsed are persisted in a cookie so
// refresh replays SSR with the chosen reveal ordering visible from the very
// first render, including the streaming Suspense fallbacks.
// ---------------------------------------------------------------------------

export type RevealPrefs = {
  order: RevealOrder;
  collapsed: boolean;
};

const VALID_REVEAL_ORDERS: RevealOrder[] = [
  "parallel",
  "sequential",
  "reverse",
  "together",
];

const DEFAULT_REVEAL_PREFS: RevealPrefs = {
  order: "sequential",
  collapsed: true,
};

const revealPrefsCookie = createCookie<RevealPrefs>({
  name: "reveal-prefs",
  parse: (raw) => {
    if (!raw) return DEFAULT_REVEAL_PREFS;
    try {
      const parsed = JSON.parse(raw) as Partial<RevealPrefs>;
      const order = VALID_REVEAL_ORDERS.includes(parsed.order as RevealOrder)
        ? (parsed.order as RevealOrder)
        : DEFAULT_REVEAL_PREFS.order;
      const collapsed =
        typeof parsed.collapsed === "boolean"
          ? parsed.collapsed
          : DEFAULT_REVEAL_PREFS.collapsed;
      return { order, collapsed };
    } catch {
      return DEFAULT_REVEAL_PREFS;
    }
  },
  serialize: (prefs) => JSON.stringify(prefs),
});

export const getRevealPrefsCookie = (): Promise<RevealPrefs> =>
  revealPrefsCookie.read();
export const setRevealPrefsCookie = (prefs: RevealPrefs): Promise<void> =>
  revealPrefsCookie.write(prefs);
