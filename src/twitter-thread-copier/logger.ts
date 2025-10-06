const SCRIPT_NAME = "[TwitterThreadCopier]";

export const logger = {
  log: (message: unknown) => {
    console.log(SCRIPT_NAME, message);
  },
  error: (message: unknown) => {
    console.error(SCRIPT_NAME, message);
  },
  warn: (message: unknown, error?: unknown) => {
    if (error) {
      console.warn(SCRIPT_NAME, message, error);
    } else {
      console.warn(SCRIPT_NAME, message);
    }
  },
};