import { server$ } from "@qwik.dev/router";

export type SearchResult = {
  id: number;
  title: string;
  summary: string;
};

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
