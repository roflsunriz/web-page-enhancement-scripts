(() => {
  let node = document.querySelector("video"),
    key;
  while (
    node &&
    !(key = Object.keys(node).find((k) => k.startsWith("__reactFiber$")))
  )
    node = node.parentElement;
  if (!node) return { opened: false };
  let root = node[key];
  while (root.return) root = root.return;
  root = root.stateNode.current;
  const queue = [root],
    seen = new Set();
  let budget = 20000;
  function visit(o, depth) {
    if (!o || typeof o !== "object" || seen.has(o) || depth > 8 || budget-- < 0)
      return false;
    seen.add(o);
    if (
      typeof o.openSheet === "function" &&
      typeof o.currentSheet === "string"
    ) {
      window.__premiumSheet = o;
      o.openSheet(window.__premiumDesiredSheet);
      return true;
    }
    if (!(Array.isArray(o) || Object.getPrototypeOf(o) === Object.prototype))
      return false;
    for (const d of Object.values(Object.getOwnPropertyDescriptors(o)))
      if (
        "value" in d &&
        d.value &&
        typeof d.value === "object" &&
        visit(d.value, depth + 1)
      )
        return true;
    return false;
  }
  while (queue.length && budget > 0) {
    const f = queue.pop();
    if (visit(f.memoizedState, 0) || visit(f.updateQueue?.memoCache, 0))
      return { opened: true };
    if (f.child) queue.push(f.child);
    if (f.sibling) queue.push(f.sibling);
  }
  return { opened: false };
})();
