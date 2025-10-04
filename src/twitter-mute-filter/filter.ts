import { settings } from './settings';
import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-mute-filter');

let muteRegexes: RegExp[] = [];

/**
 * 設定から正規表現の配列を生成・キャッシュします。
 */
export function updateMuteRegexes(): void {
  muteRegexes = settings.regexKeywords
    .filter((pattern) => pattern.trim() !== '')
    .map((pattern) => {
      try {
        return new RegExp(pattern);
      } catch (e) {
        logger.error(`無効な正規表現パターン: ${pattern}`, e);
        return null;
      }
    })
    .filter((regex): regex is RegExp => regex !== null);
}

/**
 * ツイートをミュートすべきか判定します。
 * @param tweetElement - 判定対象のツイート要素。
 * @returns ミュートする場合はtrue。
 */
function shouldMute(tweetElement: HTMLElement): boolean {
  if (!settings.enabled || !tweetElement.innerText) return false;

  const tweetText = tweetElement.innerText;

  // 文字列キーワードチェック
  for (const keyword of settings.stringKeywords) {
    if (keyword && tweetText.includes(keyword)) {
      logger.info(`ミュート (文字列一致): "${keyword}"`);
      return true;
    }
  }

  // 正規表現キーワードチェック
  for (const regex of muteRegexes) {
    if (regex.test(tweetText)) {
      logger.info(`ミュート (正規表現): "${regex.source}"`);
      return true;
    }
  }

  return false;
}

/**
 * 指定されたツイート要素を処理し、必要であれば非表示にします。
 * @param tweetElement - 処理対象のツイート要素。
 */
export function processTweet(tweetElement: HTMLElement): void {
  const container = tweetElement.closest<HTMLElement>('[data-testid="cellInnerDiv"], [data-testid="tweet"], article');
  if (container && !container.dataset.tfMuted && shouldMute(tweetElement)) {
    container.style.display = 'none';
    container.dataset.tfMuted = 'true';
  }
}