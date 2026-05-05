import { server$ } from "@qwik.dev/router";

export type Metric = {
  label: string;
  value: number;
  delayMs: number;
  recordedAt: string;
};

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
