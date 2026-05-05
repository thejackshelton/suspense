import { component$, Slot } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";

import { ChatSidebar } from "./chat-sidebar";
import { ALL_THREADS, HOME_THREAD } from "./threads";

export const ChatShell = component$(() => {
  const { url } = useLocation();
  const activeSlug = resolveActiveSlug(url.pathname);

  return (
    <div class="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <ChatSidebar activeSlug={activeSlug} />
      <div class="flex h-screen min-w-0 flex-1 flex-col bg-slate-900">
        <Slot />
      </div>
    </div>
  );
});

function resolveActiveSlug(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, "/");

  for (const thread of ALL_THREADS) {
    if (thread.slug === "") {
      continue;
    }
    if (normalized.includes(`/examples/${thread.slug}`)) {
      return thread.slug;
    }
  }

  if (normalized === "/" || normalized === "") {
    return HOME_THREAD.slug;
  }

  return "";
}
