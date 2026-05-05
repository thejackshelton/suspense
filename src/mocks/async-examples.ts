import { server$ } from "@qwik.dev/router";

export type Profile = {
  name: string;
  role: string;
  delayMs: number;
  requestedAt: string;
};

export type SearchResult = {
  id: number;
  title: string;
  summary: string;
};

export type Inventory = {
  item: string;
  available: number;
  delayMs: number;
  checkedAt: string;
};

type ReportResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

export const getMockProfile = server$(async (name: string, delayMs: number) => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const roles: Record<string, string> = {
    Ada: "Compiler engineer",
    Linus: "Kernel maintainer",
    Grace: "Systems pioneer",
  };

  return {
    name,
    role: roles[name] ?? "Qwik developer",
    delayMs,
    requestedAt: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }),
  } satisfies Profile;
});

export const searchMockDocs = server$(async (query: string, delayMs: number) => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const docs = [
    {
      id: 1,
      title: "useAsync$",
      summary: "Creates an async signal for server calls, fetches, and long work.",
    },
    {
      id: 2,
      title: "Suspense",
      summary: "Shows fallback UI while async values below the boundary resolve.",
    },
    {
      id: 3,
      title: "server$",
      summary: "Runs code on the server and calls it from the browser like RPC.",
    },
  ];

  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return docs;
  }

  return docs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(normalizedQuery) ||
      doc.summary.toLowerCase().includes(normalizedQuery),
  ) satisfies SearchResult[];
});

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

export const getUnstableMockReport = server$(
  async (shouldFail: boolean, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const seconds = (delayMs / 1000).toFixed(1);

    if (shouldFail) {
      return {
        ok: false,
        message: `The mock report failed after ${seconds}s: planned API failure.`,
      } satisfies ReportResult;
    }

    return {
      ok: true,
      message: `The report finished after a ${seconds}s server delay.`,
    } satisfies ReportResult;
  },
);
