import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, StaleWhileRevalidate, CacheFirst, NetworkOnly } from "serwist";

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: /\/card\/me/,
      handler: new StaleWhileRevalidate({
        cacheName: "card-me-cache",
      }),
    },
    {
      matcher: /\/card\/qr/,
      handler: new NetworkOnly(),
    },
    {
      matcher: /\/card\/verify/,
      handler: new NetworkOnly(),
    },
    {
      matcher: /\/card\/devices/,
      handler: new NetworkOnly(),
    },
    {
      matcher: /^https:\/\/.*\.r2\.cloudflarestorage\.com\/.*/,
      handler: new CacheFirst({
        cacheName: "photos-cache",
      }),
    },
  ],
});

serwist.addEventListeners();