import { handleRedirect } from "./redirect-handler";

// スクリプトのエントリーポイント
// 現在のページのURLを渡してリダイレクト処理を開始します。
handleRedirect(window.location.href);