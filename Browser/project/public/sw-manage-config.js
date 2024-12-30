// While overkill for this specific sample in which there is only one cache,
// this is one best practice that can be followed in general to keep track of
// multiple caches used by a given service worker, and keep them all versioned.
// It maps a shorthand identifier for a cache to a specific, versioned cache name.

// Note that since global state is discarded in between service worker restarts, these
// variables will be reinitialized each time the service worker handles an event, and you
// should not attempt to change their values inside an event handler. (Treat them as constants.)

// The discarded state allows this implementation follow 12 Factor App Best Practices

var CACHE_VERSION = 1; // increment this to force pages that use this service worker to start using a fresh cache
var CURRENT_CACHES = {
  ConfigApi: "config-api-v" + CACHE_VERSION,
};

// allows immediate update when new config needs to be used
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // scales to handle multiple versioned caches.
  var expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHES));
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (!expectedCacheNamesSet.has(cacheName)) {
            // If this cache name isn't present in the set of "expected" cache names, then delete it.
            console.log("Deleting out of date cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

self.addEventListener("fetch", function (event) {
  // console.log('fetching', event.request.url) // keep for debug
  event.respondWith(
    caches.open(CURRENT_CACHES.ConfigApi).then(function (cache) {
      return cache
        .match(event.request)
        .then(function (cachedFile) {
          if (cachedFile) {
            // return cached file if exists
            // console.log(' cachedFile:', cachedFile) // keep for debug
            return cachedFile;
          }
          // event.request not in cache
          // `fetch()` the resource.

          // `clone()` due to `fetch()` and `cache.put()` consuming the request
          //  copy original to fulfill the initial resource request.
          return fetch(event.request.clone()).then(function (response) {
            // keep for debug
            // console.log('  Response for %s from network is: %O', event.request.url, response);

            if (
              response.status < 400 && // omit error responses
              response.headers.has("content-type") && // ensure not blocked by CORS
              response.headers
                .get("content-type")
                .match(/application\/json/i) && // ensure valid file type
              /cache-config/i.test(response.url) // ensure caching from correct location
            ) {
              // same as above: `clone()` to allow original request to be loaded after caching completes
              // console.log('  Caching the response to', event.request.url) // keep for debug
              cache.put(event.request, response.clone());
            }
            /* else { // Keep for debug if/when new caches added
             console.log('  Not caching the response to', event.request.url);
             console.log('with headers: ',{response})
          } */

            // Return the original response object, which will be used to fulfill the resource request.
            return response;
          });
        })
        .catch(function (error) {
          // not imperative - no reason to throw
          console.error("  Error in fetch handler:", error);
        });
    }),
  );
});
