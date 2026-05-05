import { server$ } from "@qwik.dev/router";

export type Profile = {
  name: string;
  role: string;
  delayMs: number;
  requestedAt: string;
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
