import {
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiRayStartArrow,
} from "@mdi/js";
import { TWITTER_SELECTORS } from "@/shared/constants/twitter";
import { renderMdiSvg } from "@/shared/icons/mdi";
import { format, t } from "./i18n.js";
import { state } from "./state.js";

const CONTROL_CLASS = "twitter-thread-copier-tweet-tools";
const SELECTED_TWEET_CLASS = "twitter-thread-copier-tweet-selected";
const START_TWEET_CLASS = "twitter-thread-copier-tweet-start";
const STYLE_ID = "twitter-thread-copier-tweet-tools-style";

const ICONS = {
  SELECT: renderMdiSvg(mdiCheckboxBlankOutline, 20),
  SELECTED: renderMdiSvg(mdiCheckboxMarked, 20),
  START: renderMdiSvg(mdiRayStartArrow, 20),
};

interface TweetControlHandlers {
  onToggleSelection: (tweetElement: HTMLElement, tweetId: string) => void;
  onToggleStartPoint: (tweetElement: HTMLElement, tweetId: string) => void;
}

/**
 * X標準のツイートアクション行へ、コピー範囲指定用の操作を追加する。
 */
class TweetControlsManager {
  private handlers: TweetControlHandlers | null = null;
  private observer: MutationObserver | null = null;
  private refreshScheduled = false;

  public init(handlers: TweetControlHandlers): void {
    this.handlers = handlers;
    this.ensureStyle();
    this.refresh();

    if (!this.observer) {
      this.observer = new MutationObserver(() => this.scheduleRefresh());
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  public refresh(): void {
    document
      .querySelectorAll<HTMLElement>(TWITTER_SELECTORS.article)
      .forEach((tweetElement) => this.attachControls(tweetElement));
    this.sync();
  }

  public sync(): void {
    const selectionOrder = new Map<string, number>();
    state.selectedTweetIds.forEach((tweetId, index) => {
      selectionOrder.set(tweetId, index + 1);
    });

    document
      .querySelectorAll<HTMLElement>(TWITTER_SELECTORS.article)
      .forEach((tweetElement) => {
        const tweetId = this.extractTweetId(tweetElement);
        if (!tweetId) {
          return;
        }

        const selectedOrder = selectionOrder.get(tweetId);
        const isSelected = selectedOrder !== undefined;
        const isStartPoint = state.startFromTweetId === tweetId;
        tweetElement.classList.toggle(SELECTED_TWEET_CLASS, isSelected);
        tweetElement.classList.toggle(START_TWEET_CLASS, isStartPoint);

        const selectButton = tweetElement.querySelector<HTMLButtonElement>(
          `.${CONTROL_CLASS} [data-twitter-thread-copier-action="select"]`,
        );
        if (selectButton) {
          const label = isSelected
            ? format("selectedTitle", { order: String(selectedOrder) })
            : t("selectTweet");
          selectButton.classList.toggle("is-active", isSelected);
          const visualState = isSelected ? `selected-${selectedOrder}` : "idle";
          if (selectButton.dataset.twitterThreadCopierState !== visualState) {
            selectButton.innerHTML = isSelected
              ? `${ICONS.SELECTED}<span class="selection-order">${selectedOrder}</span>`
              : ICONS.SELECT;
            selectButton.dataset.twitterThreadCopierState = visualState;
          }
          selectButton.title = label;
          selectButton.setAttribute("aria-label", label);
          selectButton.setAttribute("aria-pressed", String(isSelected));
        }

        const startButton = tweetElement.querySelector<HTMLButtonElement>(
          `.${CONTROL_CLASS} [data-twitter-thread-copier-action="start"]`,
        );
        if (startButton) {
          const label = isStartPoint
            ? t("startPointReset")
            : t("startPointTitle");
          startButton.classList.toggle("is-active", isStartPoint);
          startButton.title = label;
          startButton.setAttribute("aria-label", label);
          startButton.setAttribute("aria-pressed", String(isStartPoint));
        }
      });
  }

  public destroy(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.refreshScheduled = false;
    document
      .querySelectorAll(`.${CONTROL_CLASS}`)
      .forEach((node) => node.remove());
    document
      .querySelectorAll(`.${SELECTED_TWEET_CLASS}, .${START_TWEET_CLASS}`)
      .forEach((node) => {
        node.classList.remove(SELECTED_TWEET_CLASS, START_TWEET_CLASS);
      });
    document.getElementById(STYLE_ID)?.remove();
    this.handlers = null;
  }

  private scheduleRefresh(): void {
    if (this.refreshScheduled) {
      return;
    }
    this.refreshScheduled = true;
    queueMicrotask(() => {
      this.refreshScheduled = false;
      if (!this.observer) {
        return;
      }
      this.refresh();
    });
  }

  private attachControls(tweetElement: HTMLElement): void {
    const tweetId = this.extractTweetId(tweetElement);
    const actionGroup = this.findActionGroup(tweetElement);
    if (!tweetId || !actionGroup || !this.handlers) {
      return;
    }
    if (actionGroup.querySelector(`:scope > .${CONTROL_CLASS}`)) {
      return;
    }

    const controls = document.createElement("div");
    controls.className = CONTROL_CLASS;
    controls.setAttribute(
      "aria-label",
      `${t("copyThread")}: ${t("selectTweet")} / ${t("startPointTitle")}`,
    );

    const nativeAction = actionGroup.querySelector<HTMLElement>(
      '[data-testid="reply"]',
    );
    if (nativeAction) {
      const nativeIcon = nativeAction.querySelector<SVGElement>("svg");
      controls.style.setProperty(
        "--twitter-thread-copier-action-color",
        getComputedStyle(nativeIcon ?? nativeAction).color,
      );
    }

    const selectButton = this.createActionButton("select", t("selectTweet"));
    selectButton.innerHTML = ICONS.SELECT;
    selectButton.dataset.twitterThreadCopierState = "idle";
    selectButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.handlers?.onToggleSelection(tweetElement, tweetId);
    });

    const startButton = this.createActionButton("start", t("startPointTitle"));
    startButton.innerHTML = ICONS.START;
    startButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.handlers?.onToggleStartPoint(tweetElement, tweetId);
    });

    controls.append(selectButton, startButton);
    actionGroup.appendChild(controls);
  }

  private createActionButton(
    action: "select" | "start",
    label: string,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.twitterThreadCopierAction = action;
    button.title = label;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", "false");
    return button;
  }

  private findActionGroup(tweetElement: HTMLElement): HTMLElement | null {
    return (
      Array.from(
        tweetElement.querySelectorAll<HTMLElement>(TWITTER_SELECTORS.roleGroup),
      ).find((group) => group.querySelector('[data-testid="reply"]')) ?? null
    );
  }

  private extractTweetId(tweetElement: HTMLElement): string | null {
    const timestampLink = tweetElement
      .querySelector("time")
      ?.closest<HTMLAnchorElement>('a[href*="/status/"]');
    const fallbackLink = Array.from(
      tweetElement.querySelectorAll<HTMLAnchorElement>('a[href*="/status/"]'),
    ).find((link) => /\/status\/\d+\/?$/.test(link.pathname));
    const tweetLink = timestampLink ?? fallbackLink;
    return tweetLink?.pathname.match(/\/status\/(\d+)/)?.[1] ?? null;
  }

  private ensureStyle(): void {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${CONTROL_CLASS} {
        align-self: stretch;
        color: var(--twitter-thread-copier-action-color, rgb(113, 118, 123));
        direction: ltr;
        display: flex;
        flex: 0 0 auto;
        gap: 2px;
        align-items: center;
        justify-content: flex-end;
        margin-inline-start: 2px;
      }
      .${CONTROL_CLASS} button {
        appearance: none;
        background: transparent;
        border: 0;
        border-radius: 9999px;
        color: inherit;
        cursor: pointer;
        display: grid;
        flex: 0 0 34px;
        height: 34px;
        padding: 0;
        place-items: center;
        position: relative;
        transition: background-color 0.15s ease, color 0.15s ease;
        width: 34px;
      }
      .${CONTROL_CLASS} button:hover {
        background: rgba(29, 155, 240, 0.1);
        color: rgb(29, 155, 240);
      }
      .${CONTROL_CLASS} button:focus-visible {
        outline: 2px solid rgb(29, 155, 240);
        outline-offset: 2px;
      }
      .${CONTROL_CLASS} button[data-twitter-thread-copier-action="select"].is-active {
        background: rgba(29, 155, 240, 0.14);
        color: rgb(29, 155, 240);
      }
      .${CONTROL_CLASS} button[data-twitter-thread-copier-action="start"].is-active {
        background: rgba(0, 186, 124, 0.14);
        color: rgb(0, 186, 124);
      }
      .${CONTROL_CLASS} svg {
        display: block;
        height: 20px;
        width: 20px;
      }
      .${CONTROL_CLASS} .selection-order {
        align-items: center;
        background: rgb(29, 155, 240);
        border-radius: 9999px;
        color: white;
        display: flex;
        font: 700 10px/1 system-ui, sans-serif;
        height: 15px;
        justify-content: center;
        min-width: 15px;
        padding-inline: 2px;
        position: absolute;
        inset-block-start: -1px;
        inset-inline-end: -2px;
      }
      ${TWITTER_SELECTORS.article}.${SELECTED_TWEET_CLASS} {
        background-color: rgba(29, 155, 240, 0.045);
        position: relative;
      }
      ${TWITTER_SELECTORS.article}.${START_TWEET_CLASS} {
        background-color: rgba(0, 186, 124, 0.045);
        position: relative;
      }
      ${TWITTER_SELECTORS.article}.${SELECTED_TWEET_CLASS}::before,
      ${TWITTER_SELECTORS.article}.${START_TWEET_CLASS}::before {
        background: rgb(29, 155, 240);
        content: "";
        inset-block: 0;
        inset-inline-start: 0;
        pointer-events: none;
        position: absolute;
        width: 3px;
      }
      ${TWITTER_SELECTORS.article}.${START_TWEET_CLASS}::before {
        background: rgb(0, 186, 124);
      }
      @media (max-width: 600px) {
        .${CONTROL_CLASS} {
          gap: 0;
          margin-inline-start: 0;
        }
        .${CONTROL_CLASS} button {
          flex-basis: 30px;
          height: 30px;
          width: 30px;
        }
        .${CONTROL_CLASS} svg {
          height: 18px;
          width: 18px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .${CONTROL_CLASS} button {
          transition: none;
        }
      }
    `;
    (document.head ?? document.documentElement).appendChild(style);
  }
}

export const tweetControlsManager = new TweetControlsManager();
