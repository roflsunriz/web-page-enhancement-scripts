/**
 * X/Twitter スパム報告自動化 - 診断・要素調査スニペット
 * 
 * 使い方:
 * 1. ツイート詳細ページを開く (例: https://x.com/username/status/xxxxx)
 * 2. F12で開発者コンソールを開く
 * 3. このスクリプト全体をコピー＆ペーストして実行
 * 4. リプライに表示された「🚨」ボタンをクリック
 * 5. 報告フローを手動で進めながら要素情報を収集
 * 6. spamReporter.downloadReport() でJSONをダウンロード
 * 
 * コマンド:
 * - spamReporter.downloadReport() - 収集データをJSONダウンロード
 * - spamReporter.clearData() - 収集データをクリア
 * - spamReporter.destroy() - スクリプトを停止して元に戻す
 * - spamReporter.captureElement(element, name) - 任意の要素を記録
 */

(function() {
  'use strict';

  // 既存のインスタンスがあれば破棄
  if (window.spamReporter) {
    window.spamReporter.destroy();
  }

  const CONFIG = {
    DEBUG: true,
    BUTTON_STYLES: {
      position: 'absolute',
      right: '8px',
      top: '8px',
      zIndex: '9999',
      padding: '4px 8px',
      fontSize: '12px',
      background: 'rgba(239, 68, 68, 0.9)',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    TOAST_STYLES: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '12px 20px',
      background: 'rgba(0, 0, 0, 0.85)',
      color: 'white',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: '99999',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      transition: 'opacity 0.3s ease',
    },
  };

  const SELECTORS = {
    tweet: 'article[data-testid="tweet"]',
    moreButton: '[data-testid="caret"]',
    menuItem: '[role="menuitem"]',
    dropdown: '[data-testid="Dropdown"]',
    layersContainer: '#layers',
    primaryColumn: '[data-testid="primaryColumn"]',
    dialog: '[role="dialog"]',
    button: 'button',
    radioInput: 'input[type="radio"]',
    checkbox: 'input[type="checkbox"]',
  };

  class SpamReporterDiagnostic {
    constructor() {
      this.collectedData = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        steps: [],
        elements: {},
      };
      this.observer = null;
      this.addedButtons = new Set();
      this.toastElement = null;
      this.currentStep = null;
      
      this.init();
    }

    log(...args) {
      if (CONFIG.DEBUG) {
        console.log('[SpamReporter]', ...args);
      }
    }

    init() {
      this.log('診断スクリプトを初期化中...');
      this.setupObserver();
      this.processExistingTweets();
      this.setupLayersObserver();
      this.showToast('🔍 スパム報告診断モード開始\nリプライの「🚨」ボタンをクリックして開始', 5000);
    }

    /**
     * 要素の詳細情報を取得
     */
    getElementInfo(element, extraInfo = {}) {
      if (!element) return null;

      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      
      // 属性を収集
      const attributes = {};
      for (const attr of element.attributes) {
        attributes[attr.name] = attr.value;
      }

      // 子要素の概要
      const children = Array.from(element.children).map(child => ({
        tagName: child.tagName.toLowerCase(),
        className: child.className,
        testId: child.getAttribute('data-testid'),
        role: child.getAttribute('role'),
        textContent: child.textContent?.slice(0, 50),
      }));

      return {
        tagName: element.tagName.toLowerCase(),
        id: element.id,
        className: element.className,
        attributes,
        textContent: element.textContent?.slice(0, 200),
        innerText: element.innerText?.slice(0, 200),
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
        computedStyle: {
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          opacity: computedStyle.opacity,
          position: computedStyle.position,
        },
        childCount: element.children.length,
        children: children.slice(0, 5),
        xpath: this.getXPath(element),
        selector: this.generateSelector(element),
        ...extraInfo,
      };
    }

    /**
     * XPathを生成
     */
    getXPath(element) {
      if (!element) return '';
      
      const parts = [];
      let current = element;
      
      while (current && current.nodeType === Node.ELEMENT_NODE) {
        let index = 1;
        let sibling = current.previousElementSibling;
        
        while (sibling) {
          if (sibling.tagName === current.tagName) {
            index++;
          }
          sibling = sibling.previousElementSibling;
        }
        
        const tagName = current.tagName.toLowerCase();
        const part = index > 1 ? `${tagName}[${index}]` : tagName;
        parts.unshift(part);
        current = current.parentElement;
      }
      
      return '/' + parts.join('/');
    }

    /**
     * CSSセレクタを生成
     */
    generateSelector(element) {
      if (!element) return '';
      
      // data-testid優先
      const testId = element.getAttribute('data-testid');
      if (testId) {
        return `[data-testid="${testId}"]`;
      }
      
      // role属性
      const role = element.getAttribute('role');
      if (role) {
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel) {
          return `[role="${role}"][aria-label="${ariaLabel}"]`;
        }
        return `[role="${role}"]`;
      }
      
      // id
      if (element.id) {
        return `#${element.id}`;
      }
      
      // クラス + タグ
      const tagName = element.tagName.toLowerCase();
      if (element.className && typeof element.className === 'string') {
        const classes = element.className.split(' ').filter(c => c && !c.startsWith('css-'));
        if (classes.length > 0) {
          return `${tagName}.${classes.slice(0, 2).join('.')}`;
        }
      }
      
      return tagName;
    }

    /**
     * 要素をキャプチャして記録
     */
    captureElement(element, name, extraInfo = {}) {
      const info = this.getElementInfo(element, extraInfo);
      if (info) {
        this.collectedData.elements[name] = info;
        this.log(`要素をキャプチャ: ${name}`, info);
        this.showToast(`✅ ${name} をキャプチャしました`, 2000);
      }
      return info;
    }

    /**
     * ステップを記録
     */
    recordStep(stepName, data = {}) {
      const step = {
        name: stepName,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        ...data,
      };
      this.collectedData.steps.push(step);
      this.currentStep = stepName;
      this.log(`ステップ記録: ${stepName}`, step);
    }

    /**
     * MutationObserverをセットアップ（ツイート検出用）
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
     * #layers監視（モーダル・ドロップダウン検出用）
     */
    setupLayersObserver() {
      const layers = document.querySelector(SELECTORS.layersContainer);
      if (!layers) {
        this.log('警告: #layers が見つかりません');
        return;
      }

      const layersObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
              this.handleLayerAdded(node);
            }
          }
        }
      });

      layersObserver.observe(layers, { childList: true, subtree: true });
      this.layersObserver = layersObserver;
    }

    /**
     * レイヤー要素が追加されたときの処理
     */
    handleLayerAdded(node) {
      // ドロップダウンメニュー検出
      const dropdown = node.querySelector('[role="menu"]') || (node.matches('[role="menu"]') ? node : null);
      if (dropdown) {
        this.log('ドロップダウンメニューを検出');
        this.captureElement(dropdown, 'dropdown_menu');
        
        // メニュー項目を記録
        const menuItems = dropdown.querySelectorAll('[role="menuitem"]');
        menuItems.forEach((item, index) => {
          this.captureElement(item, `menuitem_${index}`, {
            text: item.textContent?.trim(),
          });
        });
        
        this.highlightReportOption(dropdown);
      }

      // ダイアログ検出
      const dialog = node.querySelector('[role="dialog"]') || (node.matches('[role="dialog"]') ? node : null);
      if (dialog) {
        this.log('ダイアログを検出');
        this.captureElement(dialog, `dialog_${Date.now()}`);
        this.analyzeDialog(dialog);
      }
    }

    /**
     * 「報告する」オプションをハイライト
     */
    highlightReportOption(dropdown) {
      const menuItems = dropdown.querySelectorAll('[role="menuitem"]');
      
      for (const item of menuItems) {
        const text = item.textContent?.trim() || '';
        
        // 報告関連のメニュー項目を探す
        if (text.includes('報告') || text.includes('Report')) {
          this.captureElement(item, 'report_menuitem', { text });
          item.style.outline = '3px solid red';
          item.style.background = 'rgba(255, 0, 0, 0.1)';
          this.showToast(`🎯 「${text}」を検出しました\nクリックして次へ進んでください`, 3000);
          break;
        }
      }
    }

    /**
     * ダイアログの内容を解析
     */
    analyzeDialog(dialog) {
      const title = dialog.querySelector('h1, h2, [role="heading"]');
      if (title) {
        this.captureElement(title, 'dialog_title', { text: title.textContent?.trim() });
      }

      // ラジオボタンを探す（報告理由選択）
      const radioButtons = dialog.querySelectorAll('input[type="radio"], [role="radio"]');
      radioButtons.forEach((radio, index) => {
        const label = radio.closest('label') || radio.parentElement;
        const text = label?.textContent?.trim() || '';
        
        this.captureElement(radio, `radio_${index}`, { 
          text,
          checked: radio.checked,
          value: radio.value,
        });
        
        // スパム関連の選択肢をハイライト
        if (text.includes('スパム') || text.includes('spam') || text.includes('Spam')) {
          radio.closest('label')?.style.setProperty('outline', '3px solid red');
          this.showToast(`🎯 「${text}」を検出しました`, 3000);
        }
      });

      // 選択可能なdivを探す（役割がラジオボタン的なもの）
      const clickableDivs = dialog.querySelectorAll('[role="button"], [role="option"]');
      clickableDivs.forEach((div, index) => {
        const text = div.textContent?.trim() || '';
        if (text.includes('スパム') || text.includes('spam') || text.includes('Spam')) {
          this.captureElement(div, `spam_option_${index}`, { text });
          div.style.outline = '3px solid red';
          this.showToast(`🎯 「${text}」を検出しました`, 3000);
        }
      });

      // ボタンを探す
      const buttons = dialog.querySelectorAll('button, [role="button"]');
      buttons.forEach((button, index) => {
        const text = button.textContent?.trim() || '';
        this.captureElement(button, `button_${index}`, { text });
        
        // ブロック関連のボタンをハイライト
        if (text.includes('ブロック') || text.includes('Block')) {
          button.style.outline = '3px solid orange';
          this.showToast(`🎯 「${text}」ボタンを検出しました`, 3000);
        }
        
        // 次へ/送信ボタン
        if (text.includes('次') || text.includes('Next') || text.includes('送信') || text.includes('Submit')) {
          button.style.outline = '3px solid blue';
        }
      });
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
     * ツイートにボタンを追加
     */
    addButtonToTweet(tweetElement) {
      // 既に追加済みならスキップ
      if (this.addedButtons.has(tweetElement)) return;
      
      // メインツイート（最初のツイート）はスキップ
      const isMainTweet = this.isMainTweet(tweetElement);
      if (isMainTweet) {
        this.log('メインツイートをスキップ');
        return;
      }

      // ボタンを作成
      const button = document.createElement('button');
      button.textContent = '🚨';
      button.title = 'スパムとして報告する（診断モード）';
      Object.assign(button.style, CONFIG.BUTTON_STYLES);

      // ツイート要素をrelative positionにする
      const currentPosition = window.getComputedStyle(tweetElement).position;
      if (currentPosition === 'static') {
        tweetElement.style.position = 'relative';
      }

      // クリックイベント
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.startReportFlow(tweetElement);
      });

      tweetElement.appendChild(button);
      this.addedButtons.add(tweetElement);
    }

    /**
     * メインツイートかどうかを判定
     */
    isMainTweet(tweetElement) {
      // ツイート詳細ページの最初のツイートは通常より大きい
      const rect = tweetElement.getBoundingClientRect();
      const allTweets = document.querySelectorAll(SELECTORS.tweet);
      
      if (allTweets.length > 0 && allTweets[0] === tweetElement) {
        // 位置で判断（最初のツイートがメインツイート）
        return true;
      }
      
      return false;
    }

    /**
     * 報告フローを開始
     */
    startReportFlow(tweetElement) {
      this.recordStep('start_report_flow', {
        tweet: this.getElementInfo(tweetElement),
      });

      // ツイートの情報を取得
      const userName = tweetElement.querySelector('[data-testid="User-Name"]');
      const tweetText = tweetElement.querySelector('[data-testid="tweetText"]');
      
      this.captureElement(tweetElement, 'target_tweet', {
        userName: userName?.textContent?.trim(),
        tweetText: tweetText?.textContent?.slice(0, 100),
      });

      // 3点メニューボタンを探す
      const moreButton = tweetElement.querySelector(SELECTORS.moreButton);
      
      if (moreButton) {
        this.captureElement(moreButton, 'more_button');
        this.showToast('🔍 3点メニューボタンを検出\nクリックしてメニューを開きます...', 2000);
        
        // 自動でクリック
        setTimeout(() => {
          moreButton.click();
          this.recordStep('clicked_more_button');
        }, 500);
      } else {
        this.showToast('⚠️ 3点メニューボタンが見つかりません', 3000);
        this.log('3点メニューボタンが見つかりません', {
          tweetElement,
          innerHTML: tweetElement.innerHTML.slice(0, 500),
        });
      }
    }

    /**
     * トースト通知を表示
     */
    showToast(message, duration = 3000) {
      // 既存のトーストを削除
      if (this.toastElement) {
        this.toastElement.remove();
      }

      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = Object.entries(CONFIG.TOAST_STYLES)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');
      toast.style.whiteSpace = 'pre-line';

      document.body.appendChild(toast);
      this.toastElement = toast;

      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    /**
     * 収集データをJSONでダウンロード
     */
    downloadReport() {
      const data = {
        ...this.collectedData,
        downloadedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spam-reporter-diagnostic-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showToast('📥 診断データをダウンロードしました', 3000);
      this.log('診断データ:', data);
    }

    /**
     * 収集データをクリア
     */
    clearData() {
      this.collectedData = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        steps: [],
        elements: {},
      };
      this.showToast('🗑️ 収集データをクリアしました', 2000);
    }

    /**
     * スクリプトを停止
     */
    destroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
      if (this.layersObserver) {
        this.layersObserver.disconnect();
      }

      // 追加したボタンを削除
      this.addedButtons.forEach(tweet => {
        const button = tweet.querySelector('button[title*="スパム"]');
        if (button) {
          button.remove();
        }
      });
      this.addedButtons.clear();

      if (this.toastElement) {
        this.toastElement.remove();
      }

      this.log('診断スクリプトを停止しました');
      delete window.spamReporter;
    }
  }

  // グローバルに公開
  window.spamReporter = new SpamReporterDiagnostic();

  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🔍 X/Twitter スパム報告診断モード                           ║
╠════════════════════════════════════════════════════════════╣
║  リプライの「🚨」ボタンをクリックして報告フローを開始          ║
║                                                            ║
║  コマンド:                                                  ║
║  - spamReporter.downloadReport() : データをJSONダウンロード  ║
║  - spamReporter.clearData()      : 収集データをクリア        ║
║  - spamReporter.destroy()        : スクリプトを停止          ║
║  - spamReporter.captureElement(el, name) : 要素を手動記録    ║
╚════════════════════════════════════════════════════════════╝
  `);

})();

