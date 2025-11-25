/**
 * twitter-clean-timeline - ネットワークインターセプター（XHR & Fetch）
 */

import { createLogger } from '@/shared/logger';
import { extractTimelineData } from './timeline-parser';
import type { HomeTimelineResponse, TweetResult } from '@/shared/types';
import { MediaFilter } from '../filters/media-filter';
import { MuteFilter } from '../filters/mute-filter';
import { RetweetFilter } from '../filters/retweet-filter';
import { settings } from '../settings';

const logger = createLogger('twitter-clean-timeline:network');

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
  
  // デバッグモード時は全GraphQL URLをログ出力
  if (settings.debugMode && url.includes('/i/api/graphql/')) {
    logger.debug('GraphQL API検出:', url);
  }
  
  // HomeTimeline系のエンドポイントをすべてキャッチ
  // Twitter/Xは頻繁にエンドポイント名を変更するため、複数パターンに対応
  const timelinePatterns = [
    '/HomeTimeline',
    '/HomeLatestTimeline',
    '/ForYouTimeline',
    // 他のタイムライン系エンドポイントも追加可能
  ];
  
  return url.includes('/i/api/graphql/') && 
         timelinePatterns.some(pattern => url.includes(pattern));
}

/**
 * タイムラインJSONをフィルタリング
 */
function filterTimelineJson(response: HomeTimelineResponse): void {
  const timelineData = extractTimelineData(response);
  
  if (settings.debugMode) {
    logger.debug('タイムラインデータ抽出結果:', {
      hasData: !!timelineData,
      hasInstructions: !!timelineData?.instructions,
      instructionsCount: timelineData?.instructions?.length ?? 0,
    });
  }
  
  if (!timelineData?.instructions) {
    if (settings.debugMode) {
      logger.warn('タイムラインデータまたはinstructionsが見つかりません');
    }
    return;
  }

  let totalFiltered = 0;
  let totalProcessed = 0;

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
      
      totalProcessed++;

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

  if (settings.debugMode) {
    logger.info(`JSONフィルタリング完了: 処理=${totalProcessed}件, フィルタ=${totalFiltered}件`);
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
      if (settings.debugMode) {
        logger.info('タイムラインAPIをフック:', url);
      }
      
      this.addEventListener('readystatechange', function () {
        if (this.readyState !== 4) return;
        // @ts-expect-error - カスタムプロパティ
        if (this.__ctlPatched) return;
        // @ts-expect-error - カスタムプロパティ
        this.__ctlPatched = true;

        try {
          const rawText = origRespTextGet.call(this);
          if (typeof rawText !== 'string' || !rawText) {
            if (settings.debugMode) {
              logger.warn('レスポンスが空または文字列ではありません');
            }
            return;
          }

          const json = JSON.parse(rawText) as HomeTimelineResponse;
          
          if (settings.debugMode) {
            logger.debug('JSONパース成功、フィルタリング開始');
          }

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
          
          if (settings.debugMode) {
            logger.debug('レスポンス書き換え完了');
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

/**
 * Fetchフックをインストール
 */
export function installFetchHook(): void {
  // unsafeWindowを使用してページのネイティブfetchにアクセス
  const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const originalFetch = targetWindow.fetch;

  if (!originalFetch) {
    logger.error('fetch APIが見つかりません');
    return;
  }

  targetWindow.fetch = async function (...args: Parameters<typeof fetch>): Promise<Response> {
    const [resource] = args;
    const url = typeof resource === 'string' ? resource : resource instanceof Request ? resource.url : '';

    // デバッグモード時はすべてのfetch呼び出しをログ出力
    if (settings.debugMode && url.includes('/i/api/')) {
      logger.debug('Fetch API呼び出し検出:', url);
    }

    const shouldHook = isHomeTimelineUrl(url);

    if (shouldHook) {
      if (settings.debugMode) {
        logger.info('タイムラインAPIをフック (fetch):', url);
      }

      try {
        // オリジナルのfetchを実行
        const response = await originalFetch.apply(this, args);

        // レスポンスをクローンして処理（元のレスポンスは消費されないようにする）
        const clonedResponse = response.clone();
        
        const text = await clonedResponse.text();
        
        if (!text) {
          if (settings.debugMode) {
            logger.warn('レスポンスが空です');
          }
          return response;
        }

        const json = JSON.parse(text) as HomeTimelineResponse;
        
        if (settings.debugMode) {
          logger.debug('JSONパース成功、フィルタリング開始');
        }

        // JSONをフィルタリング
        filterTimelineJson(json);

        const newText = JSON.stringify(json);

        // 新しいレスポンスオブジェクトを作成
        const newResponse = new Response(newText, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });

        if (settings.debugMode) {
          logger.debug('レスポンス書き換え完了');
        }

        return newResponse;
      } catch (e) {
        logger.error('Fetchフックエラー', e);
        // エラーの場合は元のfetchを実行
        return originalFetch.apply(this, args);
      }
    }

    // フック対象外の場合は通常通り実行
    return originalFetch.apply(this, args);
  };

  logger.info('Fetchフックをインストールしました');
}

/**
 * すべてのネットワークフックをインストール
 */
export function installNetworkHooks(): void {
  installXHRHook();
  installFetchHook();
}

