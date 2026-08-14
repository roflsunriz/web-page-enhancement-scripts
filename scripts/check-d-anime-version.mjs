import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const userScriptPath = resolve(
  projectRoot,
  "dist/d-anime-nico-comment-renderer.user.js",
);
const metaScriptPath = resolve(
  projectRoot,
  "dist/d-anime-nico-comment-renderer.meta.js",
);

const extractMetadataVersion = (content, filePath) => {
  const match = content.match(/^\/\/ @version\s+(\S+)$/m);
  if (!match) {
    throw new Error(`@versionが見つかりません: ${filePath}`);
  }

  return match[1];
};

const escapeRegularExpression = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const run = async () => {
  const [userScript, metaScript] = await Promise.all([
    readFile(userScriptPath, "utf8"),
    readFile(metaScriptPath, "utf8"),
  ]);
  const userScriptVersion = extractMetadataVersion(userScript, userScriptPath);
  const metaScriptVersion = extractMetadataVersion(metaScript, metaScriptPath);

  if (userScriptVersion !== metaScriptVersion) {
    throw new Error(
      `配布ファイル間のバージョンが一致しません: user=${userScriptVersion}, meta=${metaScriptVersion}`,
    );
  }

  const uiVersion = `v${userScriptVersion}`;
  const quotedUiVersion = new RegExp(
    `(["'\`])${escapeRegularExpression(uiVersion)}\\1`,
  );
  if (!quotedUiVersion.test(userScript)) {
    throw new Error(
      `設定画面用のバージョン${uiVersion}が配布ファイルに見つかりません`,
    );
  }

  console.log(
    `d-anime version check passed: metadata=${userScriptVersion}, UI=${uiVersion}`,
  );
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
