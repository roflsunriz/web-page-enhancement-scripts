export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const consoleMethodByLevel: Record<LogLevel, keyof Console> = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
};

export const createLogger = (namespace: string): Logger => {
  const prefix = `[${namespace}]`;

  const logger = {} as Logger;

  (Object.keys(consoleMethodByLevel) as LogLevel[]).forEach((level) => {
    const method = consoleMethodByLevel[level];
    logger[level] = (...args: unknown[]) => {
      const consoleMethod = (console[method] ?? console.log) as (
        ...params: unknown[]
      ) => void;
      consoleMethod(prefix, ...args);
    };
  });

  return logger;
};
