/**
 * X/Twitter スパム自動報告スクリプト
 * 
 * 使い方:
 * 1. ツイート詳細ページを開く (例: https://x.com/username/status/xxxxx)
 * 2. F12で開発者コンソールを開く
 * 3. このスクリプト全体をコピー＆ペーストして実行
 * 4. リプライに表示された「🚨」ボタンをクリック
 * 5. 自動でスパム報告→ブロックが実行されます
 * 
 * コマンド:
 * - autoSpamReporter.destroy() - スクリプトを停止して元に戻す
 * - autoSpamReporter.setAutoBlock(true/false) - 自動ブロックのON/OFF
 * - autoSpamReporter.stats - 報告統計を表示
 */

(function() {
  'use strict';

  // 既存のインスタンスがあれば破棄
  if (window.autoSpamReporter) {
    window.autoSpamReporter.destroy();
  }

  const CONFIG = {
    DEBUG: true,
    AUTO_BLOCK: true, // 自動ブロックを有効にする
    DELAYS: {
      MENU_OPEN: 300,      // メニューが開くまでの待機
      MENU_CLICK: 200,     // メニュー項目クリック後の待機
      DIALOG_LOAD: 500,    // ダイアログ読み込み待機
      STEP_INTERVAL: 400,  // 各ステップ間の待機
      ANIMATION: 300,      // アニメーション完了待機
    },
    MAX_RETRIES: 3,
    RETRY_DELAY: 500,
  };

  const SELECTORS = {
    tweet: 'article[data-testid="tweet"]',
    moreButton: '[data-testid="caret"]',
    reportMenuItem: '[data-testid="report"]',
    blockMenuItem: '[data-testid="block"]',
    menu: '[role="menu"]',
    menuItem: '[role="menuitem"]',
    dialog: '[role="dialog"]',
    nextButton: '[data-testid="ocfSettingsListNextButton"]',
    layersContainer: '#layers',
    primaryColumn: '[data-testid="primaryColumn"]',
  };

  const STYLES = {
    button: {
      position: 'absolute',
      right: '8px',
      top: '8px',
      zIndex: '9999',
      padding: '6px 10px',
      fontSize: '14px',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
      transition: 'all 0.2s ease',
    },
    buttonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.6)',
    },
    buttonProcessing: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      cursor: 'wait',
    },
    buttonDone: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    toast: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '16px 24px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      borderRadius: '12px',
      fontSize: '14px',
      zIndex: '99999',
      maxWidth: '400px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
  };

  class AutoSpamReporter {
    constructor() {
      this.observer = null;
      this.layersObserver = null;
      this.addedButtons = new Set();
      this.toastElement = null;
      this.isProcessing = false;
      this.currentTweet = null;
      this.autoBlock = CONFIG.AUTO_BLOCK;
      this.stats = {
        reported: 0,
        blocked: 0,
        errors: 0,
      };
      
      this.init();
    }

    log(...args) {
      if (CONFIG.DEBUG) {
        console.log('[AutoSpamReporter]', ...args);
      }
    }

    init() {
      this.log('自動スパム報告スクリプトを初期化中...');
      this.setupObserver();
      this.processExistingTweets();
      this.showToast('🚨 スパム自動報告モード\nリプライの「🚨」ボタンをクリック', 4000, 'info');
    }

    /**
     * 指定時間待機
     */
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 要素が出現するまで待機
     */
    async waitForElement(selector, timeout = 5000, parent = document) {
      const startTime = Date.now();
      
      while (Date.now() - startTime < timeout) {
        const element = parent.querySelector(selector);
        if (element) {
          return element;
        }
        await this.sleep(100);
      }
      
      return null;
    }

    /**
     * テキストを含む要素を探す
     */
    findElementByText(parent, tagName, textPattern) {
      const elements = parent.querySelectorAll(tagName);
      for (const el of elements) {
        const text = el.textContent || '';
        if (typeof textPattern === 'string') {
          if (text.includes(textPattern)) return el;
        } else if (textPattern instanceof RegExp) {
          if (textPattern.test(text)) return el;
        }
      }
      return null;
    }

    /**
     * MutationObserverをセットアップ
     */
    setupObserver() {
      this.observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
              if (node.matches(SELECTORS.tweet)) {
                this.addButtonToTweet(node);
              }
              node.querySelectorAll(SELECTORS.tweet).forEach(tweet => {
                this.addButtonToTweet(tweet);
              });
            }
          }
        }
      });

      const primaryColumn = document.querySelector(SELECTORS.primaryColumn);
      if (primaryColumn) {
        this.observer.observe(primaryColumn, { childList: true, subtree: true });
      } else {
        this.observer.observe(document.body, { childList: true, subtree: true });
      }
    }

    /**
     * 既存のツイートを処理
     */
    processExistingTweets() {
      document.querySelectorAll(SELECTORS.tweet).forEach(tweet => {
        this.addButtonToTweet(tweet);
      });
    }

    /**
     * メインツイートかどうかを判定
     */
    isMainTweet(tweetElement) {
      const allTweets = document.querySelectorAll(SELECTORS.tweet);
      return allTweets.length > 0 && allTweets[0] === tweetElement;
    }

    /**
     * ツイートにボタンを追加
     */
    addButtonToTweet(tweetElement) {
      if (this.addedButtons.has(tweetElement)) return;
      if (this.isMainTweet(tweetElement)) return;

      const button = document.createElement('button');
      button.textContent = '🚨';
      button.title = 'スパムとして報告＆ブロック';
      button.className = 'auto-spam-reporter-btn';
      Object.assign(button.style, STYLES.button);

      // ホバー効果
      button.addEventListener('mouseenter', () => {
        if (!this.isProcessing) {
          Object.assign(button.style, STYLES.buttonHover);
        }
      });
      button.addEventListener('mouseleave', () => {
        if (!this.isProcessing) {
          button.style.transform = '';
          button.style.boxShadow = STYLES.button.boxShadow;
        }
      });

      // ツイート要素をrelative positionに
      const currentPosition = window.getComputedStyle(tweetElement).position;
      if (currentPosition === 'static') {
        tweetElement.style.position = 'relative';
      }

      // クリックイベント
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.isProcessing) {
          this.showToast('⏳ 処理中です...', 2000, 'warning');
          return;
        }
        
        await this.startReportFlow(tweetElement, button);
      });

      tweetElement.appendChild(button);
      this.addedButtons.add(tweetElement);
    }

    /**
     * 報告フローを開始
     */
    async startReportFlow(tweetElement, button) {
      this.isProcessing = true;
      this.currentTweet = tweetElement;
      
      // ボタン状態を更新
      Object.assign(button.style, STYLES.buttonProcessing);
      button.textContent = '⏳';

      try {
        // ユーザー名を取得
        const userNameEl = tweetElement.querySelector('[data-testid="User-Name"]');
        const userName = userNameEl?.textContent?.match(/@[\w]+/)?.[0] || '不明';
        
        this.log(`報告開始: ${userName}`);
        this.showToast(`🔄 ${userName} を報告中...`, 0, 'processing');

        // Step 1: 3点メニューを開く
        const moreButton = tweetElement.querySelector(SELECTORS.moreButton);
        if (!moreButton) {
          throw new Error('3点メニューボタンが見つかりません');
        }
        
        moreButton.click();
        await this.sleep(CONFIG.DELAYS.MENU_OPEN);

        // Step 2: "ポストを報告" をクリック
        const reportItem = await this.waitForElement(SELECTORS.reportMenuItem, 3000);
        if (!reportItem) {
          throw new Error('「ポストを報告」が見つかりません');
        }
        
        reportItem.click();
        await this.sleep(CONFIG.DELAYS.DIALOG_LOAD);

        // Step 3: "スパム" を選択
        await this.selectSpamOption();
        await this.sleep(CONFIG.DELAYS.STEP_INTERVAL);

        // Step 4: 「次へ」ボタンをクリック
        await this.clickNextButton();
        await this.sleep(CONFIG.DELAYS.DIALOG_LOAD);

        // Step 5: 自動ブロックが有効なら実行
        if (this.autoBlock) {
          await this.clickBlockButton();
          await this.sleep(CONFIG.DELAYS.STEP_INTERVAL);
          this.stats.blocked++;
        }

        // Step 6: 完了ボタンをクリック
        await this.clickDoneButton();

        // 成功
        this.stats.reported++;
        Object.assign(button.style, STYLES.buttonDone);
        button.textContent = '✓';
        button.disabled = true;
        
        const message = this.autoBlock 
          ? `✅ ${userName} をスパム報告＆ブロックしました`
          : `✅ ${userName} をスパム報告しました`;
        this.showToast(message, 3000, 'success');
        
        this.log(`報告完了: ${userName}`);

      } catch (error) {
        this.stats.errors++;
        this.log('エラー:', error);
        
        // エラー時はボタンを元に戻す
        Object.assign(button.style, STYLES.button);
        button.textContent = '🚨';
        
        this.showToast(`❌ エラー: ${error.message}`, 4000, 'error');
        
        // ダイアログを閉じる試み
        await this.tryCloseDialog();
      }

      this.isProcessing = false;
      this.currentTweet = null;
    }

    /**
     * スクロール可能なコンテナを取得
     */
    getScrollableContainer() {
      // ダイアログ内のスクロール可能なコンテナを探す
      const dialog = document.querySelector(SELECTORS.dialog);
      if (!dialog) return null;

      // スクロール可能な要素を探す
      const scrollables = dialog.querySelectorAll('div');
      for (const el of scrollables) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
          return el;
        }
      }

      // フォールバック: ダイアログ自体
      return dialog;
    }

    /**
     * スクロールしながら要素を探す
     */
    async findElementWithScroll(container, finder, maxScrollAttempts = 10) {
      if (!container) {
        container = this.getScrollableContainer() || document.body;
      }

      // まず現在の位置で探す
      let element = finder();
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await this.sleep(200);
        return element;
      }

      // スクロールしながら探す
      const scrollStep = 200;
      let scrolled = 0;
      
      for (let i = 0; i < maxScrollAttempts; i++) {
        // 下にスクロール
        container.scrollTop += scrollStep;
        scrolled += scrollStep;
        await this.sleep(150);

        element = finder();
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await this.sleep(200);
          return element;
        }

        // スクロール上限に達したら終了
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          break;
        }
      }

      // 見つからなかった場合、上にスクロールして再度探す
      container.scrollTop = 0;
      await this.sleep(200);
      
      element = finder();
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await this.sleep(200);
        return element;
      }

      return null;
    }

    /**
     * スパムオプションを選択
     */
    async selectSpamOption() {
      // ダイアログ内で "スパム" を含むlabelを探す
      const dialog = await this.waitForElement(SELECTORS.dialog, 3000);
      if (!dialog) {
        throw new Error('報告ダイアログが見つかりません');
      }

      await this.sleep(CONFIG.DELAYS.DIALOG_LOAD);

      // スクロール可能なコンテナを取得
      const scrollContainer = this.getScrollableContainer();
      this.log('スクロールコンテナ:', scrollContainer);

      // スパムを含むlabelを探す（スクロールしながら）
      const spamLabel = await this.findElementWithScroll(scrollContainer, () => {
        // labelを探す
        const labels = document.querySelectorAll('label');
        for (const label of labels) {
          const text = label.textContent || '';
          if (text.includes('スパム') || text.toLowerCase().includes('spam')) {
            return label;
          }
        }

        // radioボタンを直接探す
        const radios = document.querySelectorAll('input[type="radio"]');
        for (const radio of radios) {
          const parent = radio.closest('label');
          if (parent) {
            const text = parent.textContent || '';
            if (text.includes('スパム') || text.toLowerCase().includes('spam')) {
              return parent;
            }
          }
        }

        // クリック可能なdivを探す（role="option" など）
        const clickables = document.querySelectorAll('[role="option"], [role="radio"], [role="menuitemradio"]');
        for (const el of clickables) {
          const text = el.textContent || '';
          if (text.includes('スパム') || text.toLowerCase().includes('spam')) {
            return el;
          }
        }

        return null;
      });

      if (!spamLabel) {
        throw new Error('「スパム」オプションが見つかりません');
      }

      this.log('スパムオプションをクリック');
      spamLabel.click();
      await this.sleep(CONFIG.DELAYS.MENU_CLICK);
    }

    /**
     * 「次へ」ボタンをクリック
     */
    async clickNextButton() {
      // スクロール可能なコンテナを取得
      const scrollContainer = this.getScrollableContainer();

      // 「次へ」ボタンを探す（スクロールしながら）
      const nextButton = await this.findElementWithScroll(scrollContainer, () => {
        // data-testidで探す
        let btn = document.querySelector(SELECTORS.nextButton);
        if (btn) {
          const text = btn.textContent?.trim() || '';
          // 「完了」ボタンでなければ返す
          if (text !== '完了' && text !== 'Done') {
            return btn;
          }
        }

        // テキストで探す
        const buttons = document.querySelectorAll('button, [role="button"]');
        for (const b of buttons) {
          const text = b.textContent?.trim() || '';
          if (text === '次へ' || text === 'Next') {
            return b;
          }
        }
        return null;
      });

      if (nextButton) {
        this.log('「次へ」ボタンをクリック');
        nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await this.sleep(200);
        nextButton.click();
        await this.sleep(CONFIG.DELAYS.ANIMATION);
      } else {
        this.log('「次へ」ボタンが見つかりません（スキップ）');
      }
    }

    /**
     * ブロックボタンをクリック
     */
    async clickBlockButton() {
      // スクロール可能なコンテナを取得
      const scrollContainer = this.getScrollableContainer();

      // "さんをブロック" を含むボタンを探す（スクロールしながら）
      const blockButton = await this.findElementWithScroll(scrollContainer, () => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          const text = btn.textContent || '';
          if (text.includes('さんをブロック') || text.includes('Block @')) {
            return btn;
          }
        }
        
        // div内のボタンテキストも探す
        const allElements = document.querySelectorAll('button, [role="button"]');
        for (const el of allElements) {
          const text = el.textContent || '';
          if (text.includes('さんをブロック') || text.includes('Block @')) {
            return el;
          }
        }
        
        return null;
      });

      if (!blockButton) {
        this.log('ブロックボタンが見つかりません（スキップ）');
        return;
      }

      this.log('ブロックボタンをクリック');
      blockButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await this.sleep(200);
      blockButton.click();
      await this.sleep(CONFIG.DELAYS.ANIMATION);
    }

    /**
     * 完了ボタンをクリック
     */
    async clickDoneButton() {
      // スクロール可能なコンテナを取得
      const scrollContainer = this.getScrollableContainer();

      // 完了/Doneボタンを探す（スクロールしながら）
      const doneButton = await this.findElementWithScroll(scrollContainer, () => {
        // data-testidで探す
        let btn = document.querySelector(SELECTORS.nextButton);
        if (btn) return btn;

        // テキストで探す
        const buttons = document.querySelectorAll('button, [role="button"]');
        for (const b of buttons) {
          const text = b.textContent?.trim() || '';
          if (text === '完了' || text === 'Done') {
            return b;
          }
        }
        return null;
      });

      if (doneButton) {
        this.log('完了ボタンをクリック');
        doneButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await this.sleep(200);
        doneButton.click();
        await this.sleep(CONFIG.DELAYS.ANIMATION);
      }
    }

    /**
     * ダイアログを閉じる試み
     */
    async tryCloseDialog() {
      // ESCキーを送信
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await this.sleep(200);
      
      // 閉じるボタンを探す
      const closeButtons = document.querySelectorAll('[aria-label="閉じる"], [aria-label="Close"]');
      for (const btn of closeButtons) {
        btn.click();
        await this.sleep(200);
      }
    }

    /**
     * トースト通知を表示
     */
    showToast(message, duration = 3000, type = 'info') {
      if (this.toastElement) {
        this.toastElement.remove();
      }

      const toast = document.createElement('div');
      toast.className = 'auto-spam-reporter-toast';
      
      // アイコンを設定
      const icons = {
        info: '📢',
        success: '✅',
        error: '❌',
        warning: '⚠️',
        processing: '🔄',
      };
      
      toast.innerHTML = `
        <span style="font-size: 20px;">${icons[type] || '📢'}</span>
        <span style="white-space: pre-line;">${message}</span>
      `;
      
      Object.assign(toast.style, STYLES.toast);
      
      // タイプに応じた色
      const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        processing: '#3b82f6',
      };
      if (colors[type]) {
        toast.style.borderLeft = `4px solid ${colors[type]}`;
      }

      document.body.appendChild(toast);
      this.toastElement = toast;

      if (duration > 0) {
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(100%)';
          setTimeout(() => toast.remove(), 300);
        }, duration);
      }
    }

    /**
     * 自動ブロックの設定
     */
    setAutoBlock(enabled) {
      this.autoBlock = enabled;
      this.showToast(`自動ブロック: ${enabled ? 'ON' : 'OFF'}`, 2000, 'info');
    }

    /**
     * スクリプトを停止
     */
    destroy() {
      if (this.observer) {
        this.observer.disconnect();
      }

      // 追加したボタンを削除
      document.querySelectorAll('.auto-spam-reporter-btn').forEach(btn => btn.remove());
      this.addedButtons.clear();

      // トーストを削除
      document.querySelectorAll('.auto-spam-reporter-toast').forEach(el => el.remove());

      this.log('スクリプトを停止しました');
      this.log('統計:', this.stats);
      delete window.autoSpamReporter;
    }
  }

  // グローバルに公開
  window.autoSpamReporter = new AutoSpamReporter();

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🚨 X/Twitter スパム自動報告スクリプト                           ║
╠════════════════════════════════════════════════════════════════╣
║  リプライの「🚨」ボタンをクリックすると自動で:                    ║
║    1. スパムとして報告                                          ║
║    2. ユーザーをブロック                                        ║
║                                                                ║
║  コマンド:                                                      ║
║  - autoSpamReporter.stats           : 報告統計を表示            ║
║  - autoSpamReporter.setAutoBlock(false) : 自動ブロックをOFF     ║
║  - autoSpamReporter.destroy()       : スクリプトを停止          ║
╚════════════════════════════════════════════════════════════════╝
  `);

})();

