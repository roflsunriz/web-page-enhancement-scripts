import {
  SCREEN_STATE_EVENT_TYPES,
  isScreenStateEventType,
} from "./screen-state-events";

const INSTALLATION_KEY = Symbol.for(
  "videoScreenOffDetectionBlocker.screenStateSpooferInstalled",
);

const nativeAddEventListener = EventTarget.prototype.addEventListener;

type EventListenerOptions = boolean | AddEventListenerOptions;

const getGlobalState = (): Record<PropertyKey, unknown> =>
  window as unknown as Record<PropertyKey, unknown>;

const suppressScreenStateEvent = (event: Event): void => {
  event.stopImmediatePropagation();
  event.stopPropagation();
};

const addScreenStateEventGuards = (target: EventTarget): void => {
  SCREEN_STATE_EVENT_TYPES.forEach((eventType) => {
    nativeAddEventListener.call(target, eventType, suppressScreenStateEvent, {
      capture: true,
    });
  });
};

const isProtectedEventTarget = (target: EventTarget): boolean =>
  target === window ||
  target === document ||
  target instanceof HTMLVideoElement;

const patchAddEventListener = (): void => {
  const addEventListener = function (
    this: EventTarget,
    eventType: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions,
  ): void {
    if (isProtectedEventTarget(this) && isScreenStateEventType(eventType)) {
      return;
    }

    nativeAddEventListener.call(this, eventType, listener, options);
  };

  Object.defineProperty(EventTarget.prototype, "addEventListener", {
    configurable: true,
    writable: true,
    value: addEventListener,
  });
};

const overwriteDocumentGetter = (
  propertyName: string,
  value: boolean | string,
): void => {
  Object.defineProperty(Document.prototype, propertyName, {
    configurable: true,
    enumerable: true,
    get: (): boolean | string => value,
  });
};

const overwriteHasFocus = (): void => {
  Object.defineProperty(Document.prototype, "hasFocus", {
    configurable: true,
    writable: true,
    value: (): boolean => true,
  });
};

const disableScreenStateEventHandlers = (target: EventTarget): void => {
  SCREEN_STATE_EVENT_TYPES.forEach((eventType) => {
    Object.defineProperty(target, `on${eventType}`, {
      configurable: true,
      enumerable: true,
      get: (): null => null,
      set: (): void => undefined,
    });
  });
};

const installDocumentStateSpoofs = (): void => {
  overwriteDocumentGetter("hidden", false);
  overwriteDocumentGetter("visibilityState", "visible");
  overwriteDocumentGetter("webkitHidden", false);
  overwriteDocumentGetter("webkitVisibilityState", "visible");
  overwriteHasFocus();
};

export const addVideoScreenStateEventGuards = (
  video: HTMLVideoElement,
): void => {
  addScreenStateEventGuards(video);
};

export const installScreenStateSpoofer = (): void => {
  const globalState = getGlobalState();

  if (globalState[INSTALLATION_KEY] === true) {
    return;
  }

  globalState[INSTALLATION_KEY] = true;

  addScreenStateEventGuards(window);
  addScreenStateEventGuards(document);
  installDocumentStateSpoofs();
  disableScreenStateEventHandlers(window);
  disableScreenStateEventHandlers(document);
  patchAddEventListener();
};
