import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "node:url";
import { defineConfig, globalIgnores } from "eslint/config";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  [globalIgnores(["**/*.js", "**/*.mjs"])],
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true,
        tsconfigRootDir,
      },
    },
  }
);
