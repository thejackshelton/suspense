import { server$ } from "@qwik.dev/router";

export type Inventory = {
  item: string;
  available: number;
  delayMs: number;
  checkedAt: string;
};

export const checkMockInventory = server$(
  async (item: string, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    return {
      item,
      available: Math.floor(Math.random() * 8) + 1,
      delayMs,
      checkedAt: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }),
    } satisfies Inventory;
  },
);
