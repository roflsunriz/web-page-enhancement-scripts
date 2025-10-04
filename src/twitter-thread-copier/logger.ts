const SCRIPT_NAME = "[TwitterThreadCopier]";

export const logger = {
  log: (message: unknown) => {
    console.log(SCRIPT_NAME, message);
  },
  error: (message: unknown) => {
    console.error(SCRIPT_NAME, message);
  },
};