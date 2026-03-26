const SELECTORS = {
  mask: '[data-testid="mask"]',
  closeButton: '[data-testid="app-bar-close"]',
  dialog: '[role="dialog"]',
} as const;

export function setupBackdropClose(): void {
  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches(SELECTORS.mask)) return;

    const dialog = target.closest(SELECTORS.dialog);
    if (!dialog) return;

    const closeButton = dialog.querySelector<HTMLButtonElement>(SELECTORS.closeButton);
    if (!closeButton) return;

    closeButton.click();
  });
}
