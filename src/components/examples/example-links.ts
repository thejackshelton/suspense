export type ExampleLink = {
  href: string;
  title: string;
  description: string;
};

export const exampleLinks: ExampleLink[] = [
  {
    href: "/examples/tracked-profile/",
    title: "Tracked server call",
    description:
      "Rerun an async server$ call whenever tracked signals change.",
  },
  {
    href: "/examples/delayed-search/",
    title: "Delayed search",
    description:
      "Bind an input to a signal and derive async search results from it.",
  },
  {
    href: "/examples/manual-refresh/",
    title: "Refresh on demand",
    description:
      "Call invalidate(info) manually and read that info in the next async run.",
  },
  {
    href: "/examples/error-state/",
    title: "Inline error state",
    description:
      "Use Suspense for pending work and render async errors beside the result.",
  },
];
