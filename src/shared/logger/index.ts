export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

type LogFilter = (level: LogLevel, namespace: string) => boolean;

const consoleMethodByLevel: Record<LogLevel, keyof Console> = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
};

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

let shouldLog: LogFilter = (level) =>
  levelPriority[level] >= levelPriority.warn;

export const configureLoggerFilter = (filter: LogFilter): void => {
  shouldLog = filter;
};

export const createLogger = (namespace: string): Logger => {
  const prefix = `[${namespace}]`;

  const logger = {} as Logger;

  (Object.keys(consoleMethodByLevel) as LogLevel[]).forEach((level) => {
    const method = consoleMethodByLevel[level];
    logger[level] = (...args: unknown[]) => {
      if (!shouldLog(level, namespace)) {
        return;
      }
      const consoleMethod = (console[method] ?? console.log) as (
        ...params: unknown[]
      ) => void;
      consoleMethod(prefix, ...args);
    };
  });

  return logger;
};
