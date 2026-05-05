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
      "Like useEffect deps: changing name or delay reruns the profile request.",
    timestamp: "9:14 AM",
    group: "Today",
    href: "/examples/tracked-profile/",
  },
  {
    slug: "delayed-search",
    title: "Search the docs for me",
    subtitle:
      "Like a controlled input with async search tied to query state.",
    timestamp: "8:52 AM",
    group: "Today",
    href: "/examples/delayed-search/",
  },
  {
    slug: "manual-refresh",
    title: "Check inventory on demand",
    subtitle:
      "Qwik twist on manual refetch: invalidate(item) reruns useAsync$ and passes item to ctx.info.",
    timestamp: "Yesterday",
    group: "Yesterday",
    href: "/examples/manual-refresh/",
  },
  {
    slug: "error-state",
    title: "Generate a status report",
    subtitle:
      "Suspense handles pending UI; failed requests render inline errors.",
    timestamp: "Mon",
    group: "Last 7 days",
    href: "/examples/error-state/",
  },
  {
    slug: "stale-while-revalidate",
    title: "Refresh without flashing a fallback",
    subtitle:
      "Keep stale data visible while fresh data loads in the background.",
    timestamp: "Sun",
    group: "Last 7 days",
    href: "/examples/stale-while-revalidate/",
  },
  {
    slug: "local-search",
    title: "Search local and server data",
    subtitle:
      "Qwik twist: instant local filtering plus stale server results kept visible during refetch.",
    timestamp: "Sat",
    group: "Last 7 days",
    href: "/examples/local-search/",
  },
  {
    slug: "ab-testing",
    title: "Personalize with A/B tests",
    subtitle:
      "Each async section resolves independently, so slow tests do not block fast ones.",
    timestamp: "Fri",
    group: "Last 7 days",
    href: "/examples/ab-testing/",
  },
  {
    slug: "reveal-order",
    title: "Order how cards stream in",
    subtitle:
      "Choose card reveal order: parallel, sequential, reverse, or together.",
    timestamp: "Thu",
    group: "Last 7 days",
    href: "/examples/reveal-order/",
  },
];

export const ALL_THREADS: ChatThreadMeta[] = [HOME_THREAD, ...EXAMPLE_THREADS];
