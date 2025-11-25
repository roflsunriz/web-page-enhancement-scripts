/**
 * twitter-clean-timeline - XHRインターセプター
 */

import { createLogger } from '@/shared/logger';
import { extractTimelineData } from './timeline-parser';
import type { HomeTimelineResponse, TweetResult } from '../types';
import { MediaFilter } from '../filters/media-filter';
import { MuteFilter } from '../filters/mute-filter';
import { RetweetFilter } from '../filters/retweet-filter';
import { settings } from '../settings';

const logger = createLogger('twitter-clean-timeline:xhr');

// フィルタインスタンス
const mediaFilter = new MediaFilter();
const muteFilter = new MuteFilter();
const retweetFilter = new RetweetFilter();

/**
 * ミュートフィルタの正規表現を更新
 */
export function updateXHRMuteFilterRegexes(): void {
  muteFilter.updateMuteRegexes();
}

/**
 * URLがHomeTimelineのGraphQLエンドポイントか判定
 */
function isHomeTimelineUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('/i/api/graphql/') && url.includes('/HomeTimeline');
}

/**
 * タイムラインJSONをフィルタリング
 */
function filterTimelineJson(response: HomeTimelineResponse): void {
  const timelineData = extractTimelineData(response);
  if (!timelineData?.instructions) return;

  let totalFiltered = 0;

  for (const instruction of timelineData.instructions) {
    if (!instruction?.type || !Array.isArray(instruction.entries)) continue;

    // AddEntries系のみ対象
    if (!String(instruction.type).includes('AddEntries')) continue;

    const originalLength = instruction.entries.length;

    instruction.entries = instruction.entries.filter((entry) => {
      const content = entry?.content;
      if (!content) return true;

      // カーソルは必ず残す（無限スクロールが壊れるため）
      if (content.entryType === 'TimelineTimelineCursor') return true;

      // TimelineTimelineItem以外は素通し
      if (content.entryType !== 'TimelineTimelineItem') return true;

      const tweet: TweetResult | undefined =
        content.itemContent?.tweet_results?.result;

      if (!tweet) return true;

      // 各フィルタを適用
      const filters = [mediaFilter, muteFilter, retweetFilter];

      for (const filter of filters) {
        const result = filter.shouldHideFromJSON(tweet);
        if (result.shouldHide) {
          if (settings.debugMode) {
            logger.debug(`JSON フィルタ: ${result.reason ?? filter.name}`);
          }
          return false; // このエントリを削除
        }
      }

      return true; // エントリを保持
    });

    const filtered = originalLength - instruction.entries.length;
    totalFiltered += filtered;
  }

  if (totalFiltered > 0 && settings.debugMode) {
    logger.info(`JSONから ${totalFiltered} 件のツイートをフィルタしました`);
  }
}

/**
 * XHRフックをインストール
 */
export function installXHRHook(): void {
  const XHRProto = XMLHttpRequest.prototype;

  const respTextDesc = Object.getOwnPropertyDescriptor(XHRProto, 'responseText');
  const respDesc = Object.getOwnPropertyDescriptor(XHRProto, 'response');

  if (!respTextDesc?.get || !respDesc?.get) {
    logger.error('XMLHttpRequest.prototype の記述子を取得できません');
    return;
  }

  const origRespTextGet = respTextDesc.get;

  const origOpen = XHRProto.open;
  const origSend = XHRProto.send;

  // open をフック
  XHRProto.open = function (method: string, url: string | URL, ...args: unknown[]) {
    // @ts-expect-error - カスタムプロパティ
    this.__ctlUrl = typeof url === 'string' ? url : String(url);
    // @ts-expect-error - arguments型の問題を回避
    return origOpen.apply(this, [method, url, ...args]);
  };

  // send をフック
  XHRProto.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
    // @ts-expect-error - カスタムプロパティ
    const url = this.__ctlUrl as string | undefined;
    const shouldHook = isHomeTimelineUrl(url ?? '');

    if (shouldHook) {
      this.addEventListener('readystatechange', function () {
        if (this.readyState !== 4) return;
        // @ts-expect-error - カスタムプロパティ
        if (this.__ctlPatched) return;
        // @ts-expect-error - カスタムプロパティ
        this.__ctlPatched = true;

        try {
          const rawText = origRespTextGet.call(this);
          if (typeof rawText !== 'string' || !rawText) return;

          const json = JSON.parse(rawText) as HomeTimelineResponse;

          // JSONをフィルタリング
          filterTimelineJson(json);

          const newText = JSON.stringify(json);

          // responseText を差し替え
          Object.defineProperty(this, 'responseText', {
            configurable: true,
            get() {
              return newText;
            },
          });

          // response を差し替え
          if (this.responseType === '' || this.responseType === 'text') {
            Object.defineProperty(this, 'response', {
              configurable: true,
              get() {
                return newText;
              },
            });
          } else if (this.responseType === 'json') {
            const newJson = JSON.parse(newText);
            Object.defineProperty(this, 'response', {
              configurable: true,
              get() {
                return newJson;
              },
            });
          }
        } catch (e) {
          logger.error('XHRフックエラー', e);
        }
      });
    }

    return origSend.call(this, body);
  };

  logger.info('XHRフックをインストールしました');
}

