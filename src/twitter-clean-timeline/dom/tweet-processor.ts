/**
 * twitter-clean-timeline - ツイート要素処理
 */

import { removeTweetElement } from './tweet-remover';
import { MediaFilter } from '../filters/media-filter';
import { MuteFilter } from '../filters/mute-filter';
import { RetweetFilter } from '../filters/retweet-filter';
import { ReplaceFilter } from '../filters/replace-filter';
import { createLogger } from '@/shared/logger';
import { settings } from '../settings';

const logger = createLogger('twitter-clean-timeline:processor');

// フィルタインスタンス
const mediaFilter = new MediaFilter();
const muteFilter = new MuteFilter();
const retweetFilter = new RetweetFilter();
const replaceFilter = new ReplaceFilter();

/**
 * ミュートフィルタの正規表現を更新（設定変更時に呼び出す）
 */
export function updateMuteFilterRegexes(): void {
  muteFilter.updateMuteRegexes();
}

/**
 * 置き換えフィルタのルールを更新（設定変更時に呼び出す）
 */
export function updateReplaceFilterRules(): void {
  replaceFilter.updateReplacements();
}

/**
 * ツイート要素をフィルタ処理
 */
export function processTweetElement(element: HTMLElement): void {
  if (!element) return;

  // 最初に置き換えフィルタを適用（削除前に実行）
  replaceFilter.replaceInElement(element);

  // 各フィルタを順次適用（JSON版は使えないのでDOM版のみ）
  const filters = [mediaFilter, muteFilter, retweetFilter];

  for (const filter of filters) {
    const result = filter.shouldHideFromDOM(element);
    
    if (result.shouldHide) {
      const reason = result.reason ?? filter.name;
      
      if (settings.debugMode) {
        logger.debug(`ツイートをフィルタ: ${reason}`);
      }
      
      removeTweetElement(element, reason);
      return; // 1つでもフィルタに引っかかったら削除して終了
    }
  }
}

