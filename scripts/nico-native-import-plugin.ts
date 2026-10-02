import type { Plugin } from "vite";

/** Keep the official site's native ESM module instance; SystemJS creates another one. */
export function nicoNativeImportPlugin(): Plugin {
  const marker = "__nicoPlayerNativeImport__";
  return {
    name: "nico-player-native-import",
    apply: "build",
    enforce: "pre",
    transform(code, id) {
      if (
        !id
          .replaceAll("\\", "/")
          .endsWith("/src/nico-player-premium-controls/main.ts")
      )
        return;
      const expression = "import(/* @vite-ignore */ url)";
      if (code.split(expression).length !== 2)
        throw new Error("Expected one official native import");
      return { code: code.replace(expression, `${marker}(url)`), map: null };
    },
    // Run after monkey has produced its IIFE. Restoring before that would select SystemJS.
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        const output = Object.values(bundle).find(
          (item) => item.fileName === "nico-player-premium-controls.user.js",
        );
        if (!output || output.type !== "chunk")
          throw new Error("Missing Nico userscript bundle");
        if (
          output.code.split(`${marker}(`).length !== 2 ||
          output.code.includes("System.register")
        ) {
          throw new Error("Unexpected Nico native import output");
        }
        output.code = output.code.replace(`${marker}(`, "import(");
      },
    },
  };
}
