import { server$ } from "@qwik.dev/router";

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

// Shared filter helper — same function runs on server AND browser.
// This is plain JS with no platform dependencies so it works anywhere.
export function filterProducts<T extends LocalProduct>(
  products: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  );
}

export const searchMockProducts = server$(
  async (query: string, delayMs: number) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    // Uses the same filterProducts helper that the browser uses locally
    const filtered = filterProducts(LOCAL_PRODUCTS, query);

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
