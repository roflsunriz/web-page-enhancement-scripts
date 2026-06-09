type ClickableElement = HTMLElement & {
  click: () => void;
};

const SCRIPT_ID = 'yahoo-mail-mark-read';
const BUTTON_CLASS = `${SCRIPT_ID}-button`;
const TOAST_ID = `${SCRIPT_ID}-toast`;
const FOLDER_LABEL_SELECTOR = '[data-cy="systemFolderLabel"], [data-cy="personalFolderLabel"]';
const FOLDER_UNREAD_BADGE_SELECTOR = '[title^="未読メール："]';
const CHECKBOX_ALL_SELECTOR = '[data-cy="mailListCheckBoxAll"]';
const CHECKBOX_ALL_INPUT_SELECTOR = '[data-cy="mailListCheckBoxAllInput"]';
const TOOLBAR_OTHERS_SELECTOR = '[data-cy="toolBarOthers"]';
const POPUP_MENU_READ_SELECTOR = '[data-cy="popupMenuRead"]';
const MARK_READ_TEXT = '既読にする';
const OPERATION_DELAY_MS = 180;
const FOLDER_SELECTION_DELAY_MS = 450;
const MENU_WAIT_TIMEOUT_MS = 3000;

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function getElementText(element: Element): string {
  return element.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

function isHTMLElement(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement;
}

function isClickableElement(element: Element | null): element is ClickableElement {
  return isHTMLElement(element) && typeof element.click === 'function';
}

function showToast(message: string, variant: 'info' | 'error' = 'info'): void {
  document.getElementById(TOAST_ID)?.remove();

  const toast = document.createElement('div');
  toast.id = TOAST_ID;
  toast.dataset.variant = variant;
  toast.textContent = message;
  document.body.append(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2200);
}

function getFolderName(label: Element): string {
  return getElementText(label) || 'このフォルダー';
}

function hasUnreadMail(row: Element): boolean {
  return row.querySelector(FOLDER_UNREAD_BADGE_SELECTOR) !== null;
}

function getFolderId(label: Element): string | null {
  return label.getAttribute('data-cy-identifier');
}

function isCurrentFolder(label: Element): boolean {
  const folderId = getFolderId(label);
  return folderId !== null && window.location.pathname.endsWith(`/list/${folderId}`);
}

async function selectFolder(label: Element): Promise<void> {
  if (!isClickableElement(label)) {
    throw new Error('フォルダーを選択できません。');
  }

  if (!isCurrentFolder(label)) {
    label.click();
    await sleep(FOLDER_SELECTION_DELAY_MS);
  }
}

function isAllSelected(): boolean {
  const input = document.querySelector<HTMLInputElement>(CHECKBOX_ALL_INPUT_SELECTOR);
  return input?.checked ?? false;
}

function clickAllCheckbox(): void {
  if (isAllSelected()) {
    return;
  }

  const checkbox = document.querySelector(CHECKBOX_ALL_SELECTOR);
  if (!isClickableElement(checkbox)) {
    throw new Error('メール一覧の全選択チェックボックスが見つかりません。');
  }

  checkbox.click();
}

function findMenuButton(): HTMLButtonElement | null {
  const button = document.querySelector<HTMLButtonElement>(TOOLBAR_OTHERS_SELECTOR);
  return button && !button.disabled ? button : null;
}

function findMarkReadMenuItem(): ClickableElement | null {
  const stableMenuItem = document.querySelector(POPUP_MENU_READ_SELECTOR);
  if (isClickableElement(stableMenuItem)) {
    return stableMenuItem;
  }

  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>('button, [role="menuitem"], [role="option"], li, div'),
  ).filter((candidate) => getElementText(candidate).includes(MARK_READ_TEXT));

  const exactCandidate = candidates.find((candidate) => getElementText(candidate) === MARK_READ_TEXT);
  if (exactCandidate) {
    return exactCandidate;
  }

  return candidates.find((candidate) => !Array.from(candidate.children).some((child) =>
    getElementText(child).includes(MARK_READ_TEXT),
  )) ?? null;
}

async function waitForMarkReadMenuItem(): Promise<ClickableElement> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < MENU_WAIT_TIMEOUT_MS) {
    const menuItem = findMarkReadMenuItem();
    if (menuItem) {
      return menuItem;
    }
    await sleep(80);
  }

  throw new Error('「既読にする」メニューが見つかりません。');
}

async function markCurrentFolderRead(label: Element, button: HTMLButtonElement): Promise<void> {
  const folderName = getFolderName(label);
  button.disabled = true;
  button.dataset.running = 'true';
  showToast(`${folderName} を開いています`);

  try {
    await selectFolder(label);
    showToast(`${folderName} のメールを選択しています`);
    clickAllCheckbox();
    await sleep(OPERATION_DELAY_MS);

    const menuButton = findMenuButton();
    if (!menuButton) {
      throw new Error('メール操作メニューが見つかりません。メールが存在しないか、選択できていない可能性があります。');
    }

    menuButton.click();
    const markReadMenuItem = await waitForMarkReadMenuItem();
    await sleep(OPERATION_DELAY_MS);
    markReadMenuItem.click();

    showToast(`${folderName} を既読にしました`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '既読化に失敗しました。';
    showToast(message, 'error');
  } finally {
    button.disabled = false;
    delete button.dataset.running;
  }
}

function createMarkReadButton(label: Element): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = BUTTON_CLASS;
  button.textContent = '既読';
  button.title = `${getFolderName(label)} の表示中メールをすべて既読にする`;
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    void markCurrentFolderRead(label, button);
  });
  return button;
}

function ensureFolderButtons(): void {
  const labels = Array.from(document.querySelectorAll(FOLDER_LABEL_SELECTOR));

  for (const label of labels) {
    const row = label.closest('li');
    if (!row) {
      continue;
    }

    const existingButton = row.querySelector(`.${BUTTON_CLASS}`);
    if (!hasUnreadMail(row)) {
      existingButton?.remove();
      continue;
    }

    if (existingButton) {
      continue;
    }
    row.append(createMarkReadButton(label));
  }
}

function injectStyles(): void {
  if (document.getElementById(`${SCRIPT_ID}-styles`)) {
    return;
  }

  const style = document.createElement('style');
  style.id = `${SCRIPT_ID}-styles`;
  style.textContent = `
    .${BUTTON_CLASS} {
      align-items: center;
      background: #ffffff;
      border: 1px solid #c9d3df;
      border-radius: 4px;
      color: #445564;
      cursor: pointer;
      display: inline-flex;
      flex: none;
      font: 700 11px/1.2 Helvetica, Arial, sans-serif;
      justify-content: center;
      margin-left: auto;
      min-height: 22px;
      min-width: 38px;
      padding: 2px 7px;
      white-space: nowrap;
    }

    .${BUTTON_CLASS}:hover {
      background: #f2f6fb;
      border-color: #8da4bd;
      color: #0057af;
    }

    .${BUTTON_CLASS}:disabled {
      cursor: wait;
      opacity: 0.7;
    }

    .${BUTTON_CLASS}[data-running="true"] {
      background: #eaf4ff;
      border-color: #66a6e8;
      color: #0057af;
    }

    #${TOAST_ID} {
      background: #263442;
      border-radius: 6px;
      bottom: 24px;
      box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
      color: #ffffff;
      font: 700 13px/1.4 Helvetica, Arial, sans-serif;
      max-width: 360px;
      padding: 10px 14px;
      position: fixed;
      right: 24px;
      z-index: 2147483647;
    }

    #${TOAST_ID}[data-variant="error"] {
      background: #b3261e;
    }
  `;
  document.head.append(style);
}

function startObserver(): void {
  if (!document.body) {
    return;
  }

  const observer = new MutationObserver(() => {
    ensureFolderButtons();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function initialize(): void {
  injectStyles();
  ensureFolderButtons();
  startObserver();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
