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

export type Metric = {
  label: string;
  value: number;
  delayMs: number;
  recordedAt: string;
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

export const getMockMetric = server$(async (label: string, delayMs: number) => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  return {
    label,
    value: 800 + Math.floor(Math.random() * 400),
    delayMs,
    recordedAt: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }),
  } satisfies Metric;
});

export type LocalProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
};

export type EnrichedProduct = LocalProduct & {
  stock: number;
  rating: number;
  livePrice: number;
  checkedAt: string;
};

export const LOCAL_PRODUCTS: LocalProduct[] = [
  { id: 1, name: "Qwik Tee", category: "apparel", price: 29.99 },
  { id: 2, name: "Resumable Hoodie", category: "apparel", price: 59.99 },
  { id: 3, name: "Signal Stickers", category: "accessories", price: 4.99 },
  { id: 4, name: "JSX Mug", category: "drinkware", price: 14.99 },
  { id: 5, name: "Lazy-load Laptop Sleeve", category: "accessories", price: 24.99 },
  { id: 6, name: "SSR Cap", category: "apparel", price: 19.99 },
  { id: 7, name: "Hydration Bottle", category: "drinkware", price: 18.99 },
  { id: 8, name: "Component Pin Set", category: "accessories", price: 9.99 },
];

export const searchMockProducts = server$(
  async (query: string, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? LOCAL_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(normalizedQuery) ||
            p.category.toLowerCase().includes(normalizedQuery),
        )
      : LOCAL_PRODUCTS;

    return filtered.map((p) => ({
      ...p,
      stock: Math.floor(Math.random() * 50) + 1,
      rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      livePrice: +(p.price * (0.85 + Math.random() * 0.3)).toFixed(2),
      checkedAt: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }),
    })) satisfies EnrichedProduct[];
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
