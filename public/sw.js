const CACHE_VERSION = "v3";
const SHELL_CACHE   = `city-explorer-shell-${CACHE_VERSION}`;
const IMAGE_CACHE   = `city-explorer-images-${CACHE_VERSION}`;
const MAX_IMAGES    = 60;

// Pages to pre-cache at install time so trekkers can read them offline
const DESTINATION_IDS = [
  "kathmandu","pokhara","lumbini","mustang","manang","ilam","kanyam",
  "chitwan","bhaktapur","bandipur","nagarkot","janakpur",
  "rara-lake","kalinchowk","tsum-valley","dhampus","gosaikunda",
];

const SHELL_URLS = [
  "/",
  "/auth/login",
  ...DESTINATION_IDS.map((id) => `/destinations/${id}`),
];

// ── Install: pre-cache all destination pages ──────────────────────
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then((c) =>
      // addAll fetches and caches; individual failures are swallowed so a
      // missing icon doesn't block the entire install
      Promise.allSettled(SHELL_URLS.map((url) => c.add(url)))
    )
  );
  self.skipWaiting();
});

// ── Activate: delete old cache versions ──────────────────────────
self.addEventListener("activate", (e) => {
  const keep = new Set([SHELL_CACHE, IMAGE_CACHE]);
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: two strategies by resource type ────────────────────────
self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip API calls — always go to the network
  if (url.pathname.startsWith("/api/")) return;

  // Images (Unsplash + local): cache-first, bounded LRU
  if (
    url.hostname === "images.unsplash.com" ||
    url.pathname.startsWith("/images/")
  ) {
    e.respondWith(cacheFirstImage(request));
    return;
  }

  // HTML pages + Next.js assets: network-first, fall back to cache
  e.respondWith(networkFirstWithFallback(request));
});

// Network-first: try fresh, cache on success, serve stale if offline
async function networkFirstWithFallback(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const fresh = await fetch(request);
    if (fresh.ok && new URL(request.url).origin === self.location.origin) {
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await cache.match(request);
    return cached ?? new Response("Offline — open this page while connected first.", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Cache-first for images, with a simple count-based eviction
async function cacheFirstImage(request) {
  const cache  = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      // Evict oldest entries when cache is full
      const keys = await cache.keys();
      if (keys.length >= MAX_IMAGES) {
        await cache.delete(keys[0]);
      }
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    return new Response("Image unavailable offline", { status: 503 });
  }
}
