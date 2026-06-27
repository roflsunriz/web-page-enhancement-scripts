import { createI18n, type LocaleCode } from "@/shared/i18n";

type RankingLocale = Extract<LocaleCode, "ja" | "en">;

type TranslationKey =
  | "cacheTtl"
  | "close"
  | "comment"
  | "confirmed"
  | "dataRefresh"
  | "days"
  | "daysHours"
  | "detailRanking"
  | "failed"
  | "fetchFailed"
  | "fetched"
  | "fetchedAt"
  | "fetching"
  | "hours"
  | "like"
  | "metrics"
  | "metricsHeader"
  | "mylist"
  | "pending"
  | "points"
  | "progress"
  | "rank"
  | "rankBadge"
  | "rankingDisplayOff"
  | "rankingDisplayOn"
  | "rankingSettings"
  | "refreshAll"
  | "retryClick"
  | "score"
  | "statusFinal"
  | "statusTemporary"
  | "summary"
  | "target"
  | "temporary"
  | "title"
  | "totalScore"
  | "unknownError"
  | "video"
  | "view"
  | "weeks";

const translations = {
  ja: {
    cacheTtl: "キャッシュ有効期限 (TTL)",
    close: "閉じる",
    comment: "コメ",
    confirmed: "✓確定",
    dataRefresh: "データ更新",
    days: "{days}日",
    daysHours: "{days}日{hours}時間",
    detailRanking: "詳細ランキング",
    failed: "取得失敗",
    fetchFailed: "取得失敗: {message}\nクリックでリトライ",
    fetched: "取得",
    fetchedAt: "取得日時",
    fetching: "取得中...",
    hours: "{hours}時間",
    like: "いいね",
    metrics: "指標",
    metricsHeader: "▼ 指標 (生値 / 正規化)",
    mylist: "マイリス",
    pending: "未取得",
    points: "{score}点",
    progress: "{current} / {total} 作品取得済み ({percent}%)",
    rank: "順位",
    rankBadge: "{tier} - 第{rank}位({score}点)",
    rankingDisplayOff: "⚪ ランキング表示: OFF",
    rankingDisplayOn: "🔵 ランキング表示: ON",
    rankingSettings: "ニコニコランキング設定",
    refreshAll: "全作品を再取得",
    retryClick: "クリックでリトライ",
    score: "スコア",
    statusFinal: "確定",
    statusTemporary: "暫定",
    summary:
      "{status} / 対象 {target}件 / ランク表示 {ranked}件 / 取得失敗 {failed}件 / 未取得 {pending}件",
    target: "対象",
    temporary: "⏳暫定",
    title: "作品",
    totalScore: "総合スコア: {score}点",
    unknownError: "不明なエラー",
    video: "代表動画",
    view: "再生",
    weeks: "{weeks}週間",
  },
  en: {
    cacheTtl: "Cache TTL",
    close: "Close",
    comment: "Comments",
    confirmed: "✓ Final",
    dataRefresh: "Data refresh",
    days: "{days} day(s)",
    daysHours: "{days} day(s) {hours} hour(s)",
    detailRanking: "Detailed ranking",
    failed: "Failed",
    fetchFailed: "Fetch failed: {message}\nClick to retry",
    fetched: "Fetched",
    fetchedAt: "Fetched at",
    fetching: "Fetching...",
    hours: "{hours} hour(s)",
    like: "Likes",
    metrics: "Metrics",
    metricsHeader: "▼ Metrics (raw / normalized)",
    mylist: "Mylist",
    pending: "Pending",
    points: "{score} pts",
    progress: "{current} / {total} titles fetched ({percent}%)",
    rank: "Rank",
    rankBadge: "{tier} - #{rank} ({score} pts)",
    rankingDisplayOff: "⚪ Ranking display: OFF",
    rankingDisplayOn: "🔵 Ranking display: ON",
    rankingSettings: "Niconico Ranking Settings",
    refreshAll: "Refetch all titles",
    retryClick: "Click to retry",
    score: "Score",
    statusFinal: "Final",
    statusTemporary: "Temporary",
    summary:
      "{status} / Target {target} / Ranked {ranked} / Failed {failed} / Pending {pending}",
    target: "Target",
    temporary: "⏳ Temporary",
    title: "Title",
    totalScore: "Total score: {score} pts",
    unknownError: "Unknown error",
    video: "Representative video",
    view: "Views",
    weeks: "{weeks} week(s)",
  },
} satisfies Record<RankingLocale, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, RankingLocale>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const format = i18n.format;
export const t = i18n.t;
