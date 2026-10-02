(() => {
  let node = document.querySelector("video"),
    key;
  while (
    node &&
    !(key = Object.keys(node).find((k) => k.startsWith("__reactFiber$")))
  )
    node = node.parentElement;
  if (!node) return { error: "no root" };
  let root = node[key];
  while (root.return) root = root.return;
  root = root.stateNode.current;
  const seen = new Set(),
    controllers = new Map(),
    hooks = [],
    stores = new Set();
  let budget = 30000;
  const candidate = (o) =>
    o &&
    typeof o.getVideoElement === "function" &&
    typeof o.initializeWatch === "function" &&
    typeof o.setPlaybackRate === "function";
  function inspect(o, depth, path) {
    if (!o || typeof o !== "object" || seen.has(o) || depth > 7 || budget-- < 0)
      return;
    seen.add(o);
    if (
      typeof o.get === "function" &&
      typeof o.set === "function" &&
      typeof o.sub === "function"
    )
      stores.add(o);
    if (candidate(o)) {
      if (!controllers.has(o))
        controllers.set(o, {
          path,
          premium: o.context?.isPremium,
          watchId: o.watch?.video?.id,
          sameVideo: o.getVideoElement() === document.querySelector("video"),
          sameOld: o === window.__nicoLiveRetired,
          flip: o.isFlip(),
          rate: o.getPlaybackRate(),
          disposedCount: o.disposes?.length,
        });
      return;
    }
    if (
      Array.isArray(o) &&
      candidate(o[0]) &&
      typeof o[1]?.get === "function" &&
      typeof o[2]?.read === "function"
    )
      hooks.push({ path, sameCurrent: o[1].get(o[2]) === o[0] });
    if (!(Array.isArray(o) || Object.getPrototypeOf(o) === Object.prototype))
      return;
    for (const [k, d] of Object.entries(Object.getOwnPropertyDescriptors(o)))
      if ("value" in d && d.value && typeof d.value === "object")
        inspect(d.value, depth + 1, path + "." + k);
  }
  const queue = [root];
  let count = 0;
  while (queue.length && budget > 0) {
    const f = queue.pop();
    count++;
    inspect(f.memoizedProps, 0, "props");
    inspect(f.memoizedState, 0, "state");
    inspect(f.updateQueue?.memoCache, 0, "cache");
    if (f.child) queue.push(f.child);
    if (f.sibling) queue.push(f.sibling);
  }
  window.__activeControllerProbe = [...controllers.keys()].filter(
    (c) => c.watch.video.id === location.pathname.split("/").pop(),
  );
  window.__nicoLiveStores = [...stores];
  return {
    fiberCount: count,
    budget,
    controllers: [...controllers.values()],
    hooks,
  };
})();
