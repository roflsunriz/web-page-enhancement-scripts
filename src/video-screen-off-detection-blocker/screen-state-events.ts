export const SCREEN_STATE_EVENT_TYPES = [
  "visibilitychange",
  "webkitvisibilitychange",
  "mozvisibilitychange",
  "msvisibilitychange",
  "freeze",
  "pagehide",
  "blur",
  "focus",
] as const;

const screenStateEventTypeSet = new Set<string>(SCREEN_STATE_EVENT_TYPES);

export const isScreenStateEventType = (eventType: string): boolean =>
  screenStateEventTypeSet.has(eventType);
