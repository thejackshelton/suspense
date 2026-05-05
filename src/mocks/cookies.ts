import { isBrowser } from "@qwik.dev/core";
import { server$ } from "@qwik.dev/router";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export type CookieDef<T> = {
  /** Cookie name on the wire. */
  name: string;
  /** Convert the decoded cookie string into a typed value (with defaults). */
  parse: (raw: string | undefined | null) => T;
  /** Convert the typed value into a plain string ready to be encoded. */
  serialize: (value: T) => string;
};

// `server$` callbacks must only close over module-level (or primitive)
// values — anything they capture has to be serializable across the QRL
// boundary. So these helpers stay at module scope and take the cookie name
// + raw value as runtime arguments. The user-supplied `parse` / `serialize`
// functions are invoked from the regular `read` / `write` methods below,
// outside any `server$` boundary.
const readCookieServer = server$(function (name: string) {
  return this.cookie.get(name)?.value ?? null;
});

const writeCookieServer = server$(function (name: string, raw: string) {
  this.cookie.set(name, raw, {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    httpOnly: false,
    sameSite: "lax",
  });
});

/**
 * Build a tiny read/write pair around a single cookie.
 *
 * Reading: tries `document.cookie` first to avoid an RPC round-trip; falls
 * back to `server$` during SSR (no `document`) or when the cookie is
 * httpOnly / otherwise unreadable from the browser.
 *
 * Writing: uses `document.cookie` in the browser for an instant, synchronous
 * write with no network cost; falls back to `server$` during SSR.
 *
 * `parse` and `serialize` work on **logical** strings (e.g. a raw segment
 * value or a JSON string). This helper handles `encodeURIComponent` /
 * `decodeURIComponent` around `document.cookie` so the call sites don't have
 * to worry about it.
 */
export function createCookie<T>(def: CookieDef<T>) {
  return {
    async read(): Promise<T> {
      if (isBrowser) {
        const match = document.cookie.match(
          new RegExp(`(?:^|;\\s*)${def.name}=([^;]*)`),
        );
        if (match) return def.parse(decodeURIComponent(match[1]));
      }
      const raw = await readCookieServer(def.name);
      return def.parse(raw);
    },
    async write(value: T): Promise<void> {
      const raw = def.serialize(value);
      if (isBrowser) {
        const encoded = encodeURIComponent(raw);
        document.cookie = `${def.name}=${encoded};path=/;max-age=${ONE_YEAR_SECONDS};samesite=lax`;
        return;
      }
      await writeCookieServer(def.name, raw);
    },
  };
}
