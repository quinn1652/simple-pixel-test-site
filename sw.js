self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  if (!url.includes("connect.facebook.net")) return;

  if (url.includes("fbevents")) {
    event.respondWith(fetch(event.request).then(() => fetch("/fbevents.js")));
  } else if (url.includes("signals/config/")) {
    event.respondWith(
      fetch(event.request).then(() => fetch("/signals-config.js")),
    );
  }
});
