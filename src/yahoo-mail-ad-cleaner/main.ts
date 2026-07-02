const SCRIPT_ID = "yahoo-mail-ad-cleaner";
const STYLE_ID = `${SCRIPT_ID}-styles`;

const AD_SLOT_SELECTORS = [
  "#tagYadsListTop",
  "#tagYadsSideColumn",
  "#tagYadsDetail",
] as const;
const COLLAPSED_ATTRIBUTE = `data-${SCRIPT_ID}-collapsed`;

const COLLAPSIBLE_PARENT_SELECTORS = [
  "#tagYadsListTop",
  "#tagYadsSideColumn",
  "#tagYadsDetail",
] as const;

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    ${AD_SLOT_SELECTORS.join(",\n    ")} {
      display: none !important;
    }

    [data-${SCRIPT_ID}-collapsed="true"] {
      display: none !important;
    }
  `;
  document.documentElement.append(style);
}

function isHTMLElement(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement;
}

function hasVisibleContent(element: HTMLElement): boolean {
  return Array.from(element.children).some((child) => {
    if (!isHTMLElement(child)) {
      return false;
    }

    if (AD_SLOT_SELECTORS.some((selector) => child.matches(selector))) {
      return false;
    }

    const style = window.getComputedStyle(child);
    const rect = child.getBoundingClientRect();
    return style.display !== "none" && rect.width > 0 && rect.height > 0;
  });
}

function collapseEmptyAdParent(adSlot: Element): void {
  const parent = adSlot.parentElement;
  if (!parent) {
    return;
  }

  parent.removeAttribute(COLLAPSED_ATTRIBUTE);
  if (hasVisibleContent(parent)) {
    return;
  }

  parent.setAttribute(COLLAPSED_ATTRIBUTE, "true");
}

function cleanAdSlots(): void {
  for (const selector of COLLAPSIBLE_PARENT_SELECTORS) {
    const adSlot = document.querySelector(selector);
    if (adSlot) {
      collapseEmptyAdParent(adSlot);
    }
  }
}

function startObserver(): void {
  if (!document.body) {
    return;
  }

  const observer = new MutationObserver(() => {
    cleanAdSlots();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function initialize(): void {
  injectStyles();
  cleanAdSlots();
  startObserver();
}

injectStyles();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
