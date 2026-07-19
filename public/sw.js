const SHELL_PREFIX = "lu-shell-";
const ART_CACHE = "lu-art";
const RUNTIME_CACHE = "lu-runtime";
const MANIFEST_URL = "/offline-manifest";

// ---------------------------------------------------------------------------
// Shell sync: precache every route's HTML plus the build assets they reference
// so never-visited pages work offline. Runs at install and again whenever the
// page pings us and the offline manifest's version has changed (the SW file
// itself doesn't change on content edits, so install alone isn't enough).
// ---------------------------------------------------------------------------

async function fetchManifest() {
  const res = await fetch(MANIFEST_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`offline manifest ${res.status}`);
  return res.json();
}

// Build-asset references show up three ways: absolute /_next/static/ URLs in
// HTML, url() refs in CSS (fonts), and bare "static/chunks/…" string literals
// inside JS — the latter is how chunks loaded at runtime (dynamic imports,
// `new Worker(...)`) are addressed, so JS must be scanned too.
function extractRefs(text) {
  const refs = new Set();
  for (const m of text.match(/\/_next\/static\/[^"'\\\s)>]+/g) || []) {
    refs.add(m);
  }
  for (const m of text.matchAll(/"(static\/(?:chunks|media)\/[^"\\\s]+)"/g)) {
    refs.add(`/_next/${m[1]}`);
  }
  return refs;
}

async function inBatches(items, worker, batchSize = 6) {
  for (let i = 0; i < items.length; i += batchSize) {
    await Promise.all(items.slice(i, i + batchSize).map(worker));
  }
}

// Marks a shell cache as fully populated — its mere existence isn't proof,
// since an interrupted sync leaves a partial cache behind.
const SENTINEL = "/__lu-shell-complete";

async function syncShell(manifest) {
  const cacheName = SHELL_PREFIX + manifest.version;
  {
    const existing = await caches.open(cacheName);
    if (await existing.match(SENTINEL)) return;
  }
  const cache = await caches.open(cacheName);

  const seen = new Set(manifest.routes);
  let queue = [...manifest.routes];
  while (queue.length) {
    const discovered = new Set();
    await inBatches(queue, async (url) => {
      const isRoute = !url.startsWith("/_next/");
      const res = await fetch(url);
      if (!res.ok) {
        // Routes must all cache or the shell is broken; JS-derived refs are
        // speculative (any "static/chunks/…" literal matches) and may 404.
        if (isRoute) throw new Error(`shell ${url} ${res.status}`);
        return;
      }
      if (isRoute || /\.(js|css)$/.test(url)) {
        for (const ref of extractRefs(await res.clone().text())) {
          if (!seen.has(ref)) {
            seen.add(ref);
            discovered.add(ref);
          }
        }
      }
      await cache.put(url, res);
    });
    queue = [...discovered];
  }

  await cache.put(SENTINEL, new Response("ok"));

  // Shell is complete — drop caches from previous builds.
  for (const key of await caches.keys()) {
    if (key.startsWith(SHELL_PREFIX) && key !== cacheName) {
      await caches.delete(key);
    }
  }
}

// ---------------------------------------------------------------------------
// Art fill: ~270 MB of world art, downloaded in the background after the
// shell is ready. Never blocks install, tolerates individual failures, and
// resumes from wherever it stopped on the next page load.
// ---------------------------------------------------------------------------

let artFillRunning = false;

async function fillArtCache(manifest) {
  if (artFillRunning) return;
  artFillRunning = true;
  try {
    const cache = await caches.open(ART_CACHE);
    const cached = new Set(
      (await cache.keys()).map((req) => new URL(req.url).pathname)
    );
    const missing = manifest.assets.filter((url) => !cached.has(url));
    await inBatches(missing, async (url) => {
      try {
        const res = await fetch(url);
        if (res.ok) await cache.put(url, res);
      } catch {
        // Offline or quota pressure — the next warm-up run retries.
      }
    }, 4);
  } finally {
    artFillRunning = false;
  }
}

async function syncAll() {
  const manifest = await fetchManifest();
  await syncShell(manifest);
  await fillArtCache(manifest);
}

self.addEventListener("install", (event) => {
  event.waitUntil(fetchManifest().then(syncShell));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data === "lu-sync") {
    event.waitUntil(syncAll().catch(() => {}));
  }
});

// ---------------------------------------------------------------------------
// Fetch: cache-first for content-addressed/immutable files, network-first for
// everything else so deploys show up immediately, cache as offline fallback.
// ---------------------------------------------------------------------------

function isImmutable(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/universe/") ||
    url.pathname.startsWith("/icon-")
  );
}

function runtimeCacheName(url) {
  return url.pathname.startsWith("/universe/") ? ART_CACHE : RUNTIME_CACHE;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isImmutable(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches
                .open(runtimeCacheName(url))
                .then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request, { ignoreSearch: true });
        if (cached) return cached;
        if (request.mode === "navigate") {
          const home = await caches.match("/");
          if (home) return home;
        }
        return Response.error();
      })
  );
});
