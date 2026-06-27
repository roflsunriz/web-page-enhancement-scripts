import type { LoadingSpinner } from "../ui/loading-spinner";

/**
 * 画像収集の結果を表すインターフェース。
 * initialUrls: すぐに表示できる画像のURL配列。
 * onValidated: バックグラウンド検証中に、その時点で表示できるURL配列を返すコールバックを受け取る関数。
 */
export interface CollectionResult {
  initialUrls: string[];
  onValidated: (callback: (allUrls: string[]) => void) => void;
}

/**
 * 画像コレクターの共通インターフェース。
 */
export interface ICollector {
  /**
   * 進行状況を表示するためのスピナーインスタンスを設定します。
   * @param spinner LoadingSpinnerのインスタンス
   */
  setSpinner(spinner: LoadingSpinner | null): void;

  /**
   * 画像収集処理を実行します。
   * @returns 画像収集の結果
   */
  collect(): Promise<CollectionResult>;
}
