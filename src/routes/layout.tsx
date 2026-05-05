import { component$, Slot } from "@qwik.dev/core";

import { ChatShell } from "~/components/chat/chat-shell";

export default component$(() => {
  return (
    <ChatShell>
      <Slot />
    </ChatShell>
  );
});
