self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  if (!url.includes("connect.facebook.net")) return;

  if (url.includes("fbevents")) {
    event.respondWith(fetch("/fbevents.js"));
  } else if (url.includes("signals/config/")) {
    event.respondWith(fetch("/signals-config.js"));
  }
});
