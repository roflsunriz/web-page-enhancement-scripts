/**
 * twitter-clean-timeline - 置き換えフィルタ
 */

import { settings } from '../settings';
import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-clean-timeline:replace-filter');

export class ReplaceFilter {
  private compiledReplacements: Array<{
    pattern: RegExp | string;
    to: string;
    isRegex: boolean;
  }> = [];

  constructor() {
    this.updateReplacements();
  }

  get name(): string {
    return 'replace';
  }

  get enabled(): boolean {
    return settings.replaceFilter.enabled;
  }

  /**
   * 置き換えルールを更新（設定変更時に呼び出す）
   */
  updateReplacements(): void {
    this.compiledReplacements = settings.replaceFilter.replacements
      .filter((r) => r.from.trim() !== '')
      .map((replacement) => {
        if (replacement.isRegex) {
          try {
            return {
              pattern: new RegExp(replacement.from, 'g'),
              to: replacement.to,
              isRegex: true,
            };
          } catch (e) {
            logger.error(`無効な正規表現パターン: ${replacement.from}`, e);
            return null;
          }
        } else {
          return {
            pattern: replacement.from,
            to: replacement.to,
            isRegex: false,
          };
        }
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }

  /**
   * 要素内のテキストノードを置き換える
   */
  replaceInElement(element: HTMLElement): void {
    if (!this.enabled || this.compiledReplacements.length === 0) {
      return;
    }

    // すでに処理済みかチェック
    if (element.dataset.ctlReplaced === 'true') {
      return;
    }

    try {
      this.replaceTextNodes(element);
      element.dataset.ctlReplaced = 'true';
    } catch (e) {
      logger.error('テキスト置き換え中にエラーが発生しました', e);
    }
  }

  /**
   * テキストノードを再帰的に走査して置き換え
   */
  private replaceTextNodes(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const textNode = node as Text;
      let text = textNode.textContent ?? '';
      let modified = false;

      for (const replacement of this.compiledReplacements) {
        if (replacement.isRegex) {
          const pattern = replacement.pattern as RegExp;
          if (pattern.test(text)) {
            text = text.replace(pattern, replacement.to);
            modified = true;
          }
        } else {
          const pattern = replacement.pattern as string;
          if (text.includes(pattern)) {
            text = text.split(pattern).join(replacement.to);
            modified = true;
          }
        }
      }

      if (modified) {
        textNode.textContent = text;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      
      // スクリプト、スタイル、入力要素は除外
      if (
        element.tagName === 'SCRIPT' ||
        element.tagName === 'STYLE' ||
        element.tagName === 'INPUT' ||
        element.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // 子ノードを再帰的に処理
      const childNodes = Array.from(node.childNodes);
      for (const child of childNodes) {
        this.replaceTextNodes(child);
      }
    }
  }
}

