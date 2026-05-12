import { setClipboard } from '@/shared/userscript';

type RepoType = 'model' | 'dataset' | 'space';

type RepoContext = {
  repoId: string;
  repoName: string;
  repoType: RepoType;
  revision: string;
};

const SCRIPT_ID = 'hf-download-command-copier';
const BUTTON_CLASS = 'hf-download-command-copier-button';
const HEADER_BUTTON_ID = `${SCRIPT_ID}-header-button`;
const TOAST_ID = `${SCRIPT_ID}-toast`;
const DEFAULT_REVISION = 'main';
const DEFAULT_QUANTIZATION = 'Q4_K_S';
const RESERVED_ROOT_SEGMENTS = new Set([
  'blog',
  'chat',
  'collections',
  'docs',
  'enterprise',
  'join',
  'leaderboards',
  'login',
  'models',
  'new',
  'notifications',
  'organizations',
  'posts',
  'pricing',
  'search',
  'settings',
  'spaces',
  'tasks',
]);

function shellQuote(value: string): string {
  if (/^[A-Za-z0-9._/@:+-]+$/.test(value)) {
    return value;
  }

  return `"${value.replace(/(["\\$`])/g, '\\$1')}"`;
}

function getPathSegments(): string[] {
  return window.location.pathname
    .split('/')
    .map((segment) => decodeURIComponent(segment))
    .filter(Boolean);
}

function parseRepoContext(): RepoContext | null {
  const segments = getPathSegments();
  let repoType: RepoType = 'model';
  let offset = 0;

  if (segments[0] === 'datasets') {
    repoType = 'dataset';
    offset = 1;
  } else if (segments[0] === 'spaces') {
    repoType = 'space';
    offset = 1;
  }

  const owner = segments[offset];
  const repo = segments[offset + 1];
  if (!owner || !repo) {
    return null;
  }
  if (repoType === 'model' && RESERVED_ROOT_SEGMENTS.has(owner)) {
    return null;
  }

  const marker = segments[offset + 2];
  const revision = marker === 'tree' || marker === 'blob'
    ? segments[offset + 3] ?? DEFAULT_REVISION
    : DEFAULT_REVISION;

  return {
    repoId: `${owner}/${repo}`,
    repoName: repo,
    repoType,
    revision,
  };
}

function getRepoTypeOption(repoType: RepoType): string {
  return repoType === 'model' ? '' : ` --repo-type ${repoType}`;
}

function getDefaultQuantizationIncludeOption(context: RepoContext): string {
  if (context.repoType !== 'model') {
    return '';
  }

  const hasDefaultQuantization = getQuantizedFilePaths(context).some((filePath) =>
    filePath.includes(DEFAULT_QUANTIZATION),
  );
  return hasDefaultQuantization ? ` --include ${shellQuote(`*${DEFAULT_QUANTIZATION}*`)}` : '';
}

function createRepoDownloadCommand(context: RepoContext): string {
  const revisionOption = context.revision === DEFAULT_REVISION ? '' : ` --revision ${shellQuote(context.revision)}`;
  return `hf download ${shellQuote(context.repoId)}${getRepoTypeOption(context.repoType)}${getDefaultQuantizationIncludeOption(context)}${revisionOption} --local-dir .`;
}

function createFileDownloadCommand(context: RepoContext, filePath: string): string {
  const revisionOption = context.revision === DEFAULT_REVISION ? '' : ` --revision ${shellQuote(context.revision)}`;
  return `hf download ${shellQuote(context.repoId)} ${shellQuote(filePath)}${getRepoTypeOption(context.repoType)}${revisionOption} --local-dir .`;
}

function parseBlobPath(href: string, context: RepoContext): string | null {
  const url = new URL(href, window.location.origin);
  const segments = url.pathname
    .split('/')
    .map((segment) => decodeURIComponent(segment))
    .filter(Boolean);
  const blobIndex = segments.indexOf('blob');
  if (blobIndex < 0) {
    return null;
  }

  const repoIdSegments = context.repoType === 'model'
    ? segments.slice(0, blobIndex)
    : segments.slice(1, blobIndex);
  if (repoIdSegments.join('/') !== context.repoId) {
    return null;
  }

  const filePath = segments.slice(blobIndex + 2).join('/');
  return filePath.length > 0 ? filePath : null;
}

function getQuantizedFilePathsFromLinks(context: RepoContext): string[] {
  return Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="/blob/"]'))
    .map((link) => parseBlobPath(link.href, context))
    .filter((filePath): filePath is string => filePath !== null && filePath.endsWith('.gguf'));
}

function getQuantizedFilePathsFromHydrationData(): string[] {
  const hydrators = Array.from(document.querySelectorAll<HTMLElement>('[data-props*="ggufFilePaths"]'));
  for (const hydrator of hydrators) {
    const dataProps = hydrator.getAttribute('data-props');
    if (!dataProps) {
      continue;
    }

    const ggufFilePathsMatch = dataProps.match(/"ggufFilePaths":\[(.*?)\]/s);
    if (!ggufFilePathsMatch) {
      continue;
    }

    const filePaths = Array.from(ggufFilePathsMatch[1].matchAll(/"([^"]+\.gguf)"/g)).map(
      (match) => match[1],
    );
    if (filePaths.length > 0) {
      return filePaths;
    }
  }

  return [];
}

function getQuantizedFilePaths(context: RepoContext): string[] {
  const linkFilePaths = getQuantizedFilePathsFromLinks(context);
  if (linkFilePaths.length > 0) {
    return linkFilePaths;
  }

  return getQuantizedFilePathsFromHydrationData();
}

function showToast(message: string): void {
  const existing = document.getElementById(TOAST_ID);
  existing?.remove();

  const toast = document.createElement('div');
  toast.id = TOAST_ID;
  toast.textContent = message;
  document.body.append(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 1800);
}

function copyCommand(command: string, button: HTMLButtonElement): void {
  setClipboard(command);

  const previousText = button.textContent;
  button.textContent = 'Copied';
  button.setAttribute('data-copied', 'true');
  showToast('hf download command copied');

  window.setTimeout(() => {
    button.textContent = previousText ?? 'Copy hf';
    button.removeAttribute('data-copied');
  }, 1400);
}

function createButton(label: string, title: string, command: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = BUTTON_CLASS;
  button.textContent = label;
  button.title = title;
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    copyCommand(command, button);
  });
  return button;
}

function findHeaderInsertionTarget(): Element | null {
  const heading = document.querySelector('main h1');
  if (!heading) {
    return null;
  }

  return heading.parentElement;
}

function ensureHeaderButton(context: RepoContext): void {
  if (document.getElementById(HEADER_BUTTON_ID)) {
    return;
  }

  const target = findHeaderInsertionTarget();
  if (!target) {
    return;
  }

  const button = createButton(
    'Copy hf download',
    'Copy hf CLI command to download this repository',
    createRepoDownloadCommand(context),
  );
  button.id = HEADER_BUTTON_ID;
  button.setAttribute('data-variant', 'header');
  target.append(button);
}

function ensureFileButtons(context: RepoContext): void {
  const fileLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="/blob/"]'));

  for (const fileLink of fileLinks) {
    const filePath = parseBlobPath(fileLink.href, context);
    if (!filePath) {
      continue;
    }

    const row = fileLink.closest('li');
    const existingButtons = row
      ? Array.from(row.querySelectorAll<HTMLButtonElement>(`.${BUTTON_CLASS}[data-file-path]`))
      : [];
    const hasExistingButton = existingButtons.some(
      (button) => button.getAttribute('data-file-path') === filePath,
    );
    if (!row || hasExistingButton) {
      continue;
    }

    const button = createButton(
      'hf',
      `Copy hf CLI command to download ${filePath}`,
      createFileDownloadCommand(context, filePath),
    );
    button.setAttribute('data-file-path', filePath);
    button.setAttribute('data-variant', 'file');

    const fileNameContainer = fileLink.parentElement;
    if (fileNameContainer) {
      fileNameContainer.append(button);
    }
  }
}

function injectStyles(): void {
  const styleId = `${SCRIPT_ID}-styles`;
  if (document.getElementById(styleId)) {
    return;
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .${BUTTON_CLASS} {
      align-items: center;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #374151;
      cursor: pointer;
      display: inline-flex;
      flex: none;
      font: 600 12px/1.2 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      gap: 4px;
      margin-left: 8px;
      min-height: 22px;
      padding: 3px 8px;
      transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
      white-space: nowrap;
    }

    .${BUTTON_CLASS}:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
      color: #111827;
    }

    .${BUTTON_CLASS}[data-copied="true"] {
      background: #ecfdf5;
      border-color: #34d399;
      color: #047857;
    }

    .${BUTTON_CLASS}[data-variant="header"] {
      margin-left: 12px;
      min-height: 30px;
      padding: 5px 11px;
    }

    html.dark .${BUTTON_CLASS} {
      background: #111827;
      border-color: #374151;
      color: #d1d5db;
    }

    html.dark .${BUTTON_CLASS}:hover {
      background: #1f2937;
      border-color: #4b5563;
      color: #f9fafb;
    }

    html.dark .${BUTTON_CLASS}[data-copied="true"] {
      background: #052e26;
      border-color: #10b981;
      color: #a7f3d0;
    }

    #${TOAST_ID} {
      background: #111827;
      border-radius: 8px;
      bottom: 24px;
      box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
      color: #ffffff;
      font: 600 13px/1.4 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      padding: 10px 14px;
      position: fixed;
      right: 24px;
      z-index: 99999;
    }
  `;
  document.head.append(style);
}

function updateButtons(): void {
  const context = parseRepoContext();
  if (!context) {
    return;
  }

  injectStyles();
  ensureHeaderButton(context);
  ensureFileButtons(context);
}

function startObserver(): void {
  if (!document.body) {
    return;
  }

  let currentUrl = window.location.href;
  const observer = new MutationObserver(() => {
    updateButtons();

    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      document.getElementById(HEADER_BUTTON_ID)?.remove();
      updateButtons();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function initialize(): void {
  updateButtons();
  startObserver();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
