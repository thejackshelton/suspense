import { server$ } from "@qwik.dev/router";

type ReportResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

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
