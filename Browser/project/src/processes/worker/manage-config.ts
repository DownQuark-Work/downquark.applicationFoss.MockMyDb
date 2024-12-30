import { API_STOPLIGHT_RESOURCES as IMPORTED_STOPLIGHT_CONFIGURATION } from "../../resources/api.stoplight";
/**
 * The files fetched from this worker should be intercepted by the `sw-manage-config` service worker
 */
const workerCaches: [string, string][] = [
  [
    "API_STOPLIGHT_RESOURCES",
    "./cache-config/configuration.api.stoplight.json",
  ],
];

let whenFinalizedCallback: Function = () => {};
// const whenFinalized = (applyCallback:Function=()=>{}) {
//   applyCallback()
// }

const contentCache: Record<string, { _updated: number } & KeyValueObjectType> =
  {};

const loadFileToCache = async (currentCacheFetch: [string, string]) => {
  const [key, url] = currentCacheFetch;
  try {
    const response = await fetch(url);
    const data = await response.json();
    contentCache[key] = data;
  } catch {
    throw new Error(`Failed to fetch "${key}: ${url}"`);
  }
  cacheContent();
};

const useLatestConfiguration = () => {
  // if imported _updated is newer than fetched all is well
  // console.log(IMPORTED_STOPLIGHT_CONFIGURATION._updated, contentCache.API_STOPLIGHT_RESOURCES._updated);
  // console.log(IMPORTED_STOPLIGHT_CONFIGURATION._updated > contentCache.API_STOPLIGHT_RESOURCES._updated);

  if (
    IMPORTED_STOPLIGHT_CONFIGURATION._updated >
    contentCache.API_STOPLIGHT_RESOURCES._updated
  ) {
    whenFinalizedCallback();
    return;
  }

  /** otherwise, there has been a configuration change that was manually
   * uploaded outside of the typical deployment process (hotfix).
   * - requires updating the values of the imported configuration _without_
   *   affecting any other lifecycle/state events that could effect currently active users
   */
  const outOfDateKeys = Object.keys(IMPORTED_STOPLIGHT_CONFIGURATION),
    mostRecentKeys = Object.keys(contentCache.API_STOPLIGHT_RESOURCES);

  // console.log('IMPORTED_STOPLIGHT_CONFIGURATION::BEFORE',{...IMPORTED_STOPLIGHT_CONFIGURATION});
  outOfDateKeys.forEach((k) => delete IMPORTED_STOPLIGHT_CONFIGURATION[k]);
  mostRecentKeys.forEach(
    (k) =>
      (IMPORTED_STOPLIGHT_CONFIGURATION[k] =
        contentCache.API_STOPLIGHT_RESOURCES[k]),
  );
  // console.log('IMPORTED_STOPLIGHT_CONFIGURATION::AFTER',{...IMPORTED_STOPLIGHT_CONFIGURATION});

  // if the above fails, inform the user
  if (
    IMPORTED_STOPLIGHT_CONFIGURATION._updated !==
    contentCache.API_STOPLIGHT_RESOURCES._updated
  )
    throw new Error(
      "Incorrect External Service Configuration. Please reload and try again.",
    );

  whenFinalizedCallback();
};

let activeServiceWorker = false;
const cacheContent = () => {
  const curContent = workerCaches.shift();
  if (curContent) loadFileToCache(curContent);
  else if (activeServiceWorker) {
    // fully active state
    activeServiceWorker =
      navigator?.serviceWorker?.controller?.state === "activated";

    useLatestConfiguration();
  }
};

export const manageConfig = (cb: Function = () => {}) => {
  whenFinalizedCallback = cb;

  navigator.serviceWorker
    .register("./sw-manage-config.js", { scope: "./" }) // relative from `index.html`
    .then(function () {
      activeServiceWorker = true; // pre-active state
      cacheContent();
    })
    .catch(function (error) {
      // not imperative - no reason to throw
      // remember, this is secondary, mainly for failovers and updates
      // rely on local information first
      console.error("service worker failure: ", error);
      whenFinalizedCallback();
    });
};
