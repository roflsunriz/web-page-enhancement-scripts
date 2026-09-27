# 開発への参加

変更前に [AGENTS.md](AGENTS.md) と [更新手順](how-to-update.md) を確認してください。ソースは `src/`、配布物は `dist/` にあります。配布物を直接編集せず、対象スクリプトの版を `vite.config.ts` で更新してビルドします。

PR には利用者から見た変更内容と検証結果を記載してください。`bun install --frozen-lockfile` の後、`bun run lint`、`bun run format`、`bun run type-check`、`bun run build`、`bun run test`、`bun audit` を実行します。実サイトでの確認条件と実行できなかった項目は [verification.md](verification.md) に残します。

変更履歴は [CHANGELOG.md](CHANGELOG.md) のスクリプト別バージョンに記載し、認証情報・個人データ・ローカル設定を含めないでください。
