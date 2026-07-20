// Replaced with the current build's stamp by scripts/build-sw.mjs, which emits
// public/sw.js. Two jobs: it makes this file's bytes differ on every deploy, so
// the browser's update check actually finds a new worker to install, and it
// keys the shell cache to the build whose HTML/chunks it holds.
const BUILD = "__LU_BUILD__";

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

// Progress is pushed to every open tab (not just the controlled one) so the
// first-run loading splash can show how far offline caching has got.
async function broadcast(message) {
  const clients = await self.clients.matchAll({
    includeUncontrolled: true,
    type: "window",
  });
  for (const client of clients) client.postMessage(message);
}

// Marks a shell cache as fully populated — its mere existence isn't proof,
// since an interrupted sync leaves a partial cache behind.
const SENTINEL = "/__lu-shell-complete";

async function syncShell(manifest, onRouteCached) {
  // Keyed by build, not by the manifest's content hash: route HTML embeds this
  // build's chunk URLs, so a code-only deploy must re-fetch it too.
  const cacheName = SHELL_PREFIX + BUILD;
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
      // Only routes count toward the loading bar; discovered chunks download in
      // the same pass but keeping them out of the tally keeps the total fixed.
      if (isRoute && onRouteCached) onRouteCached();
    });
    queue = [...discovered];
  }

  await cache.put(SENTINEL, new Response("ok"));
}

// Previous builds' shells, dropped only once this worker takes over. Deleting
// them at install time would pull the rug from under the old worker, which is
// still serving pages while this one waits for the user to accept the update.
async function dropStaleShells() {
  const keep = SHELL_PREFIX + BUILD;
  for (const key of await caches.keys()) {
    if (key.startsWith(SHELL_PREFIX) && key !== keep) await caches.delete(key);
  }
}

// ---------------------------------------------------------------------------
// Art fill: optimized world art, downloaded in the background after the
// shell is ready. Never blocks install, tolerates individual failures, and
// resumes from wherever it stopped on the next page load.
// ---------------------------------------------------------------------------

let artFillRunning = false;

async function fillArtCache(manifest, onAssetCached) {
  if (artFillRunning) return;
  artFillRunning = true;
  try {
    const cache = await caches.open(ART_CACHE);
    const cachedRequests = await cache.keys();
    const wanted = new Set(manifest.assets);
    await Promise.all(
      cachedRequests
        .filter((req) => !wanted.has(new URL(req.url).pathname))
        .map((req) => cache.delete(req))
    );
    const cached = new Set(
      cachedRequests
        .map((req) => new URL(req.url).pathname)
        .filter((url) => wanted.has(url))
    );
    const missing = manifest.assets.filter((url) => !cached.has(url));
    await inBatches(missing, async (url) => {
      try {
        const res = await fetch(url);
        if (res.ok) await cache.put(url, res);
      } catch {
        // Offline or quota pressure — the next warm-up run retries.
      } finally {
        // Count the attempt either way: a file that 404s or fails would
        // otherwise stall the bar short of 100% forever.
        if (onAssetCached) onAssetCached();
      }
    }, 4);
  } finally {
    artFillRunning = false;
  }
}

// Drives the offline-caching run and streams progress to open tabs. The bar's
// denominator is fixed (routes + art assets) so it only ever moves forward;
// discovered JS/CSS chunks download during the shell phase but aren't counted.
async function syncAll() {
  const manifest = await fetchManifest();
  const total = manifest.routes.length + manifest.assets.length;
  let cached = 0;
  const report = (phase) => broadcast({ type: "lu-progress", cached, total, phase });

  report("shell");
  await syncShell(manifest, () => {
    cached += 1;
    report("shell");
  });
  // A shell cached on a previous run fires no per-route callbacks; credit it in
  // full (and emit a report, since none fired) so the bar advances before art.
  if (cached < manifest.routes.length) cached = manifest.routes.length;
  report("shell");

  await fillArtCache(manifest, () => {
    cached += 1;
    report("art");
  });

  broadcast({ type: "lu-progress", cached: total, total, phase: "done", done: true });
}

// No skipWaiting here: on an update we precache the new build's shell and then
// sit in "waiting" so the page can offer a refresh instead of swapping the app
// out from under a child mid-lesson. On a first install there is no controller,
// so the browser activates us immediately anyway.
self.addEventListener("install", (event) => {
  event.waitUntil(fetchManifest().then(syncShell));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(dropStaleShells().then(() => self.clients.claim()));
});

self.addEventListener("message", (event) => {
  const data = event.data;
  if (data === "lu-sync") {
    event.waitUntil(
      // On any failure still signal "done" so the loading splash dismisses; the
      // fetch handler falls back to the network for anything that didn't cache.
      syncAll().catch(() =>
        broadcast({ type: "lu-progress", phase: "done", done: true })
      )
    );
    return;
  }
  // The page's update prompt was accepted — take over now; it reloads once
  // "controllerchange" fires.
  if (data === "lu-skip-waiting") self.skipWaiting();
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

  // Turbopack passes a worker's bootstrap configuration in the URL fragment.
  // Fetch requests never contain fragments, and responding from Cache Storage
  // makes the worker see the fragment-less response URL, so its bootstrap dies
  // with "Missing worker bootstrap config". Let the browser load top-level
  // workers directly; their hashed dependency chunks are still cached below.
  if (request.destination === "worker") return;

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
