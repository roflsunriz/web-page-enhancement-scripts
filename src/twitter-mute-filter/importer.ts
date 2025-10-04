import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-mute-filter');

/**
 * Twitterの公式ミュートキーワードを取得します。
 * @returns 取得したキーワードの配列、またはnull。
 */
export async function fetchTwitterMuteKeywords(): Promise<string[] | null> {
  try {
    if (!window.location.href.includes('/settings/muted_keywords')) {
      if (
        !confirm(
          'Twitterのミュートキーワード設定ページに移動して取得します。よろしいですか？\n※現在のページから移動します',
        )
      ) {
        return null;
      }
      window.location.href = 'https://twitter.com/settings/muted_keywords';
      return null;
    }

    const keywords: string[] = [];
    const processedItems = new Set<string>();
    const originalScrollPos = window.scrollY;

    const collectVisibleKeywords = (): number => {
      let foundCount = 0;
      const keywordSpans = document.querySelectorAll<HTMLElement>(
        "div[role='link'] > div > div[dir='ltr']:first-child > span",
      );

      keywordSpans.forEach((span) => {
        const keywordValue = span.textContent?.trim();
        if (!keywordValue || processedItems.has(keywordValue)) return;

        if (keywordValue.length > 50 || keywordValue.match(/^(編集|削除|メニュー|Edit|Delete|Menu|Settings)/i)) {
          return;
        }

        keywords.push(keywordValue);
        processedItems.add(keywordValue);
        foundCount++;
        logger.info(`キーワード検出: "${keywordValue}"`);
      });
      return foundCount;
    };

    const scrollAndCollect = async (): Promise<string[]> => {
      const maxScrollAttempts = 50;
      const scrollDelay = 800;
      let lastKeywordCount = 0;
      let noNewKeywordsCount = 0;

      for (let i = 0; i < maxScrollAttempts; i++) {
        window.scrollBy(0, window.innerHeight * 0.7);
        await new Promise((resolve) => setTimeout(resolve, scrollDelay));
        collectVisibleKeywords();

        if (keywords.length === lastKeywordCount) {
          noNewKeywordsCount++;
          if (noNewKeywordsCount >= 3) break;
        } else {
          lastKeywordCount = keywords.length;
          noNewKeywordsCount = 0;
        }
      }
      window.scrollTo(0, originalScrollPos);
      return keywords;
    };

    const collectedKeywords = await scrollAndCollect();

    if (collectedKeywords.length > 0) {
      alert(`${collectedKeywords.length}件のミュートキーワードを取得しました。\n設定を保存してください。`);
    } else {
      alert('ミュートキーワードが見つかりませんでした。画面を更新してもう一度お試しください。');
    }

    return collectedKeywords;
  } catch (error) {
    logger.error('ミュートキーワードの取得に失敗しました', error);
    alert('ミュートキーワードの取得に失敗しました。');
    return null;
  }
}