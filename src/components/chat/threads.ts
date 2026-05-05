export type ChatThreadMeta = {
  /** URL slug for the route. The home thread uses an empty slug. */
  slug: string;
  /** Sidebar label, kept short like a real ChatGPT history entry. */
  title: string;
  /** Sub-line shown under the title in the chat header. */
  subtitle: string;
  /** Relative time string used in the sidebar grouping. */
  timestamp: string;
  /** Group label, like ChatGPT's "Today" / "Yesterday" sections. */
  group: "Today" | "Yesterday" | "Last 7 days";
  /** Full URL used by sidebar links. */
  href: string;
};

export const HOME_THREAD: ChatThreadMeta = {
  slug: "",
  title: "Welcome to Suspense",
  subtitle: "An overview of useAsync$, server$, and Suspense.",
  timestamp: "Just now",
  group: "Today",
  href: "/",
};

export const EXAMPLE_THREADS: ChatThreadMeta[] = [
  {
    slug: "tracked-profile",
    title: "Look up Ada's profile",
    subtitle:
      "Tracked useAsync$ — reruns the server$ call when the name or delay signal changes.",
    timestamp: "9:14 AM",
    group: "Today",
    href: "/examples/tracked-profile/",
  },
  {
    slug: "delayed-search",
    title: "Search the docs for me",
    subtitle:
      "Bind an input to a signal, and let useAsync$ derive search results from it.",
    timestamp: "8:52 AM",
    group: "Today",
    href: "/examples/delayed-search/",
  },
  {
    slug: "manual-refresh",
    title: "Check inventory on demand",
    subtitle:
      "invalidate(item) reruns useAsync$ with that item exposed as info — no tracked signals.",
    timestamp: "Yesterday",
    group: "Yesterday",
    href: "/examples/manual-refresh/",
  },
  {
    slug: "error-state",
    title: "Generate a status report",
    subtitle:
      "Suspense covers pending UI while the async signal exposes thrown errors inline.",
    timestamp: "Mon",
    group: "Last 7 days",
    href: "/examples/error-state/",
  },
  {
    slug: "stale-while-revalidate",
    title: "Refresh without flashing a fallback",
    subtitle:
      "Keep the previous .value visible while .loading is true, then swap in the new value.",
    timestamp: "Sun",
    group: "Last 7 days",
    href: "/examples/stale-while-revalidate/",
  },
  {
    slug: "local-search",
    title: "Search local and server data",
    subtitle:
      "Filter a local product list instantly while useAsync$ fetches enriched server results.",
    timestamp: "Sat",
    group: "Last 7 days",
    href: "/examples/local-search/",
  },
  {
    slug: "ab-testing",
    title: "Personalize with A/B tests",
    subtitle:
      "Multiple independent Suspense boundaries let each experiment resolve at its own pace — no waterfall.",
    timestamp: "Fri",
    group: "Last 7 days",
    href: "/examples/ab-testing/",
  },
];

export const ALL_THREADS: ChatThreadMeta[] = [HOME_THREAD, ...EXAMPLE_THREADS];
