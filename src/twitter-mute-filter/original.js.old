    // ==UserScript==
    // @name         Twitter文章完全ミュート
    // @namespace    twitter_mute_filter
    // @version      1.3
    // @description  公式ミュート機能は単語（とTwitterが認識した語句）にしか効きません。ブラウザ版Twitterでこれを解決します。正規表現対応、設定メニュー付き。シャドウDOM対応でページスタイルと衝突しません。
    // @author       roflsunriz
    // @match        https://twitter.com/*
    // @match        https://x.com/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
    // @grant        GM_getValue
    // @grant        GM_setValue
    // @grant        GM_registerMenuCommand
    // @grant        GM_addStyle
    // @grant        GM_xmlhttpRequest
	// @updateURL    https://gist.githubusercontent.com/roflsunriz/25b09cf3bfd4fa29a49a08e4ab7fdf6b/raw/twitter_mute_filter.user.js
    // @downloadURL  https://gist.githubusercontent.com/roflsunriz/25b09cf3bfd4fa29a49a08e4ab7fdf6b/raw/twitter_mute_filter.user.js
    // ==/UserScript==
     
    (function() {
      'use strict';
      
      // デフォルト設定
      const defaultSettings = {
          version: 1.2,
          stringKeywords: [],
          regexKeywords: [],
          lastImport: null,
          enabled: true // 機能のON/OFF状態
      };

      // 設定を取得
      let settings = GM_getValue('twitter_filter_settings', defaultSettings);
      
      // バージョンアップ時の設定マイグレーション
      if (!settings.hasOwnProperty('enabled')) {
          settings.enabled = true;
          GM_setValue('twitter_filter_settings', settings);
      }
      
      // 正規表現オブジェクトに変換
      const getRegexArray = () => {
          return settings.regexKeywords
              .filter(pattern => pattern.trim() !== '') // 空文字列をフィルター
              .map(pattern => {
                  try {
                      return new RegExp(pattern);
                  } catch (e) {
                      console.error(`Invalid regex pattern: ${pattern}`, e);
                      return null;
                  }
              }).filter(regex => regex !== null);
      };

      // ミュートワードリスト
      let muteList = {
          strings: [...settings.stringKeywords],
          regexes: getRegexArray()
      };

      // ツイートをミュートする関数
      const muteTweet = (element) => {
          // 機能が無効の場合は何もしない
          if (!settings.enabled) return false;
          
          if (!element || !element.innerText) return false;
          
          const tweetText = element.innerText;
          
          // 文字列キーワードチェック
          for (const keyword of muteList.strings) {
              // 空文字列は無視する
              if (!keyword) continue;
              
              if (tweetText.includes(keyword)) {
                  console.log(`[TwitterMuteFilter] ミュート (文字列一致): "${keyword}"`);
                  return true;
              }
          }
          
          // 正規表現キーワードチェック
          for (const regex of muteList.regexes) {
              if (regex.test(tweetText)) {
                  console.log(`[TwitterMuteFilter] ミュート (正規表現): "${regex}"`);
                  return true;
              }
          }
          
          return false;
      };

      // ツイートを処理する関数
      const processTweet = (tweetElement) => {
          if (muteTweet(tweetElement)) {
              // セルコンテナを探す（複数パターンに対応）
              const container = tweetElement.closest('[data-testid="cellInnerDiv"]') || 
                                tweetElement.closest('[data-testid="tweet"]') ||
                                tweetElement.closest('article');
              
              if (container) {
                  container.style.display = 'none';
                  // 処理済みとしてマーク
                  container.dataset.tfMuted = 'true';
              }
          }
      };

      // ミュート設定適用
      const applyMuteSettings = () => {
          // 機能が無効の場合は何もしない
          if (!settings.enabled) return;
          
          // すでに表示されているツイートに適用
          const tweetSelectors = [
              '[data-testid="tweet"]', 
              '[id^=id__]',
              'article[role="article"]'
          ];
          
          let count = 0;
          tweetSelectors.forEach(selector => {
              document.querySelectorAll(selector).forEach(tweet => {
                  // まだミュート処理されていない要素のみ処理
                  const container = tweet.closest('[data-testid="cellInnerDiv"]') || 
                                   tweet.closest('[data-testid="tweet"]') || 
                                   tweet.closest('article');
                  
                  if (container && !container.dataset.tfMuted) {
                      processTweet(tweet);
                      count++;
                  }
              });
          });
          
          console.log(`[TwitterMuteFilter] ${count}件のツイートをチェックしました`);
      };

      // 設定を保存する関数
      const saveSettings = () => {
          GM_setValue('twitter_filter_settings', settings);
          
          // ミュートリストを更新
          muteList.strings = [...settings.stringKeywords];
          muteList.regexes = getRegexArray();
          
          // 既存ツイートに適用
          applyMuteSettings();
      };

      // シャドウDOMコンテナを作成する関数
      const createShadowContainer = () => {
          const container = document.createElement('div');
          container.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 999999;
              pointer-events: none;
          `;
          
          const shadowRoot = container.attachShadow({ mode: 'closed' });
          
          // シャドウDOM内のスタイル
          const style = document.createElement('style');
          style.textContent = `
              .tf-modal-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(0, 0, 0, 0.7);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  z-index: 10000;
                  pointer-events: all;
              }
              .tf-modal {
                  background: white;
                  color: black;
                  border-radius: 16px;
                  padding: 20px;
                  width: 80%;
                  max-width: 600px;
                  max-height: 80vh;
                  overflow-y: auto;
                  display: flex;
                  flex-direction: column;
                  gap: 15px;
                  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
              }
              .tf-modal-title {
                  font-size: 1.5em;
                  font-weight: bold;
                  margin-bottom: 10px;
                  color: #1d9bf0;
              }
              .tf-modal-section {
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
              }
              .tf-toggle-section {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 15px;
                  background: #f7f9fa;
                  border-radius: 12px;
                  margin-bottom: 15px;
              }
              .tf-toggle-label {
                  font-weight: bold;
                  font-size: 1.1em;
                  color: #14171a;
              }
              .tf-toggle-switch {
                  position: relative;
                  width: 60px;
                  height: 30px;
                  background: #ccd6dd;
                  border-radius: 15px;
                  cursor: pointer;
                  transition: background 0.3s;
              }
              .tf-toggle-switch.active {
                  background: #1d9bf0;
              }
              .tf-toggle-slider {
                  position: absolute;
                  top: 3px;
                  left: 3px;
                  width: 24px;
                  height: 24px;
                  background: white;
                  border-radius: 50%;
                  transition: transform 0.3s;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }
              .tf-toggle-switch.active .tf-toggle-slider {
                  transform: translateX(30px);
              }
              .tf-textarea {
                  width: 100%;
                  height: 200px;
                  padding: 12px;
                  border: 2px solid #e1e8ed;
                  border-radius: 8px;
                  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                  font-size: 14px;
                  color: #14171a;
                  background: #ffffff;
                  resize: vertical;
                  transition: border-color 0.3s;
              }
              .tf-textarea:focus {
                  outline: none;
                  border-color: #1d9bf0;
              }
              .tf-button-row {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 15px;
                  gap: 10px;
              }
              .tf-button {
                  padding: 12px 20px;
                  border: none;
                  border-radius: 20px;
                  cursor: pointer;
                  font-weight: bold;
                  font-size: 14px;
                  transition: all 0.3s;
                  flex: 1;
              }
              .tf-save-button {
                  background: #1d9bf0;
                  color: white;
              }
              .tf-save-button:hover {
                  background: #1a8cd8;
              }
              .tf-cancel-button {
                  background: #e0e0e0;
                  color: #14171a;
              }
              .tf-cancel-button:hover {
                  background: #d0d0d0;
              }
              .tf-import-button {
                  background: #17bf63;
                  color: white;
              }
              .tf-import-button:hover {
                  background: #14a85f;
              }
              .tf-info {
                  font-size: 0.9em;
                  color: #657786;
                  background: #f7f9fa;
                  padding: 8px 12px;
                  border-radius: 8px;
                  border-left: 4px solid #1d9bf0;
              }
              .tf-keywords-container {
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
              }
              .tf-keyword-type {
                  font-weight: bold;
                  margin-bottom: 5px;
                  color: #14171a;
              }
              .tf-status-indicator {
                  font-size: 0.9em;
                  padding: 8px 12px;
                  border-radius: 8px;
                  text-align: center;
                  font-weight: bold;
              }
              .tf-status-enabled {
                  background: #d4edda;
                  color: #155724;
                  border: 1px solid #c3e6cb;
              }
              .tf-status-disabled {
                  background: #f8d7da;
                  color: #721c24;
                  border: 1px solid #f5c6cb;
              }
          `;
          
          shadowRoot.appendChild(style);
          
          return { container, shadowRoot };
      };

      // Twitterの公式ミュートキーワードを取得
      const fetchTwitterMuteKeywords = async () => {
          try {
              // Twitter設定ページが開いているか確認
              if (!location.href.includes('/settings/muted_keywords')) {
                  if (!confirm('Twitterのミュートキーワード設定ページに移動して取得します。よろしいですか？\n※現在のページから移動します')) {
                      return null;
                  }
                  
                  // 現在のタブで移動（新しいタブではなく）
                  location.href = 'https://twitter.com/settings/muted_keywords';
                  return null;
              }
              
              // キーワード収集用の配列
              const keywords = [];
              const processedItems = new Set();
              
              // スクロール前の位置を記憶
              const originalScrollPos = window.scrollY;
              
              // 表示されているミュートキーワードを収集する関数
              const collectVisibleKeywords = () => {
                  // キーワード検出方法を複数用意（UI変更に備える）
                  let foundCount = 0;
                  
                  // 方法1: 指定されたセレクタから直接キーワードを取得（最も信頼性が高い）
                  const keywordSpans = document.querySelectorAll("div[role='link'] > div > div[dir='ltr']:first-child > span");
                  
                  keywordSpans.forEach(span => {
                      const keywordValue = span.textContent.trim();
                      
                      // アイテム固有のIDを取得（内容をIDとして使用）
                      const itemId = keywordValue;
                      
                      // 既に処理済みなら追加しない
                      if (!keywordValue || processedItems.has(itemId)) return;
                      
                      // 明らかにキーワードではない場合は除外
                      if (keywordValue.length > 50 || 
                          keywordValue.match(/^(編集|削除|メニュー|Edit|Delete|Menu|Settings)/i)) {
                          return;
                      }
                      
                      // キーワードを追加
                      keywords.push(keywordValue);
                      processedItems.add(itemId);
                      foundCount++;
                      console.log(`[TwitterMuteFilter] キーワード検出 (方法1): "${keywordValue}"`);
                  });
                  
                  // 方法2: data-testid属性からの取得
                  if (foundCount === 0) {
                      const keywordElements = document.querySelectorAll('[data-testid="muteKeywordItem"]');
                      
                      keywordElements.forEach(item => {
                          const keywordValue = item.querySelector('[data-testid="muteKeywordValue"]')?.innerText?.trim();
                          
                          // アイテム固有のIDを取得
                          const itemId = item.dataset.id || keywordValue;
                          
                          // 既に処理済みなら追加しない
                          if (!keywordValue || processedItems.has(itemId)) return;
                          
                          // キーワードを追加
                          keywords.push(keywordValue);
                          processedItems.add(itemId);
                          foundCount++;
                          console.log(`[TwitterMuteFilter] キーワード検出 (方法2): "${keywordValue}"`);
                      });
                  }
                  
                  return foundCount;
              };
              
              // スクロールしながらキーワードを収集
              const scrollAndCollect = async () => {
                  const maxScrollAttempts = 50;
                  const scrollDelay = 800;
                  
                  // 初回のデータ収集
                  let foundCount = collectVisibleKeywords();
                  console.log(`[TwitterMuteFilter] 初回収集: ${foundCount}件のキーワードを検出`);
                  
                  let lastKeywordCount = keywords.length;
                  let noNewKeywordsCount = 0;
                  
                  // スクロールしながらキーワードを収集
                  for (let i = 0; i < maxScrollAttempts; i++) {
                      // 画面の半分程度スクロール
                      window.scrollBy(0, window.innerHeight * 0.7);
                      
                      // スクロール後に少し待機してコンテンツのロードを待つ
                      await new Promise(resolve => setTimeout(resolve, scrollDelay));
                      
                      // 新しく表示されたキーワードを収集
                      foundCount = collectVisibleKeywords();
                      console.log(`[TwitterMuteFilter] スクロール後収集 #${i+1}: ${foundCount}件の新規キーワード検出`);
                      
                      // 新しいキーワードが見つからなければカウント
                      if (keywords.length === lastKeywordCount) {
                          noNewKeywordsCount++;
                          // 3回連続で新しいキーワードが見つからなければ終了
                          if (noNewKeywordsCount >= 3) {
                              console.log(`[TwitterMuteFilter] ${noNewKeywordsCount}回連続で新規キーワードなし、取得終了`);
                              break;
                          }
                      } else {
                          lastKeywordCount = keywords.length;
                          noNewKeywordsCount = 0;
                      }
                      
                      // 短い待機を追加してUIの読み込みを確実にする
                      await new Promise(resolve => setTimeout(resolve, 200));
                  }
                  
                  // 元のスクロール位置に戻る
                  window.scrollTo(0, originalScrollPos);
                  
                  return keywords;
              };
              
              // スクロールしながらデータを収集
              const collectedKeywords = await scrollAndCollect();
              
              // 取得完了メッセージ
              if (collectedKeywords.length > 0) {
                  alert(`${collectedKeywords.length}件のミュートキーワードを取得しました。\n設定画面に戻るには「保存」ボタンをクリックしてください。`);
              } else {
                  alert('ミュートキーワードが見つかりませんでした。画面を更新してもう一度お試しください。');
              }
              
              return collectedKeywords;
          } catch (error) {
              console.error('[TwitterMuteFilter] ミュートキーワードの取得に失敗しました', error);
              alert('ミュートキーワードの取得に失敗しました。');
              return null;
          }
      };

      // 設定モーダルを表示
      const showSettingsModal = async () => {
          
          // シャドウDOMコンテナを作成
          const { container, shadowRoot } = createShadowContainer();
          
          // モーダルの作成
          const modal = document.createElement('div');
          modal.className = 'tf-modal-overlay';
          
          const statusClass = settings.enabled ? 'tf-status-enabled' : 'tf-status-disabled';
          const statusText = settings.enabled ? '機能は有効です' : '機能は無効です';
          
          modal.innerHTML = `
              <div class="tf-modal">
                  <div class="tf-modal-title">Twitter文章完全ミュート 設定 v1.2</div>
                  
                  <div class="tf-status-indicator ${statusClass}">
                      ${statusText}
                  </div>
                  
                  <div class="tf-toggle-section">
                      <div class="tf-toggle-label">ミュート機能を有効にする</div>
                      <div class="tf-toggle-switch ${settings.enabled ? 'active' : ''}" id="tf-toggle">
                          <div class="tf-toggle-slider"></div>
                      </div>
                  </div>
                  
                  <div class="tf-modal-section">
                      <div class="tf-keyword-type">通常ミュートキーワード</div>
                      <textarea class="tf-textarea" id="tf-string-keywords" placeholder="1行に1つのキーワードを入力してください">${settings.stringKeywords.join('\n')}</textarea>
                      <div class="tf-info">部分一致するツイートをミュートします</div>
                  </div>
                  
                  <div class="tf-modal-section">
                      <div class="tf-keyword-type">正規表現ミュートキーワード</div>
                      <textarea class="tf-textarea" id="tf-regex-keywords" placeholder="1行に1つの正規表現パターンを入力してください">${settings.regexKeywords.join('\n')}</textarea>
                      <div class="tf-info">例: 「テス(ト)?」は「テス」「テスト」にマッチします</div>
                  </div>
                  
                  <div class="tf-button-row">
                      <button class="tf-button tf-cancel-button" id="tf-cancel">キャンセル</button>
                      <button class="tf-button tf-import-button" id="tf-import">Twitter公式ミュートを取り込む</button>
                      <button class="tf-button tf-save-button" id="tf-save">保存</button>
                  </div>
              </div>
          `;
          
          shadowRoot.appendChild(modal);
          document.body.appendChild(container);
          
          // トグルスイッチのイベントリスナー
          const toggleSwitch = shadowRoot.getElementById('tf-toggle');
          const statusIndicator = shadowRoot.querySelector('.tf-status-indicator');
          
          toggleSwitch.addEventListener('click', () => {
              const isActive = toggleSwitch.classList.contains('active');
              
              if (isActive) {
                  toggleSwitch.classList.remove('active');
                  statusIndicator.className = 'tf-status-indicator tf-status-disabled';
                  statusIndicator.textContent = '機能は無効です';
              } else {
                  toggleSwitch.classList.add('active');
                  statusIndicator.className = 'tf-status-indicator tf-status-enabled';
                  statusIndicator.textContent = '機能は有効です';
              }
          });
          
          // イベントリスナー
          shadowRoot.getElementById('tf-cancel').addEventListener('click', () => {
              document.body.removeChild(container);
          });
          
          shadowRoot.getElementById('tf-import').addEventListener('click', async () => {
              // ミュートページにいる場合は直接キーワード取得を実行
              if (location.href.includes('/settings/muted_keywords')) {
                  // モーダルを一旦閉じる
                  document.body.removeChild(container);
                  
                  // キーワード取得を実行
                  const twitterKeywords = await fetchTwitterMuteKeywords();
                  
                  if (twitterKeywords && twitterKeywords.length > 0) {
                      // 既存の設定を取得
                      let currentSettings = GM_getValue('twitter_filter_settings', defaultSettings);
                      
                      // 取得したキーワードをマージ（重複チェック）
                      const newStringKeywords = [...new Set([...currentSettings.stringKeywords, ...twitterKeywords])];
                      
                      // 設定を更新
                      currentSettings.stringKeywords = newStringKeywords;
                      currentSettings.lastImport = new Date().toISOString();
                      
                      // 保存
                      GM_setValue('twitter_filter_settings', currentSettings);
                      
                      // 設定を更新
                      settings = currentSettings;
                      
                      // ミュートリストを更新
                      muteList.strings = [...settings.stringKeywords];
                      muteList.regexes = getRegexArray();
                      
                      // ホーム画面に戻る
                      location.href = 'https://twitter.com/home';
                  }
              } else {
                  // ミュートページにいない場合は移動する
                  // モーダルを一旦閉じる
                  document.body.removeChild(container);
                  
                  // Twitter設定ページへ移動
                  if (confirm('Twitterのミュートキーワード設定ページに移動します。よろしいですか？')) {
                      location.href = 'https://twitter.com/settings/muted_keywords';
                  }
              }
          });
          
          shadowRoot.getElementById('tf-save').addEventListener('click', () => {
              const stringKeywords = shadowRoot.getElementById('tf-string-keywords').value.split('\n')
                  .map(k => k.trim())
                  .filter(k => k !== ''); // 空文字列を完全に除外
              const regexKeywords = shadowRoot.getElementById('tf-regex-keywords').value.split('\n')
                  .map(k => k.trim())
                  .filter(k => k !== ''); // 空文字列を完全に除外
              
              // トグルスイッチの状態を取得
              const isEnabled = toggleSwitch.classList.contains('active');
              
              settings.stringKeywords = stringKeywords;
              settings.regexKeywords = regexKeywords;
              settings.enabled = isEnabled;
              
              saveSettings();
              document.body.removeChild(container);
              
              // 状態変更をユーザーに通知
              const message = isEnabled ? 
                  'ミュート設定を保存しました。機能は有効です。' : 
                  'ミュート設定を保存しました。機能は無効になっています。';
              
              // 簡易通知を表示
              const notification = document.createElement('div');
              notification.style.cssText = `
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  background: #1d9bf0;
                  color: white;
                  padding: 12px 20px;
                  border-radius: 8px;
                  z-index: 999999;
                  font-weight: bold;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
              `;
              notification.textContent = message;
              document.body.appendChild(notification);
              
              setTimeout(() => {
                  if (document.body.contains(notification)) {
                      document.body.removeChild(notification);
                  }
              }, 3000);
          });
      };

      // Tampermonkeyのメニューに登録
      GM_registerMenuCommand('ミュート設定', showSettingsModal);

      // 初期化時に既存ツイートを処理
      console.log('Twitter文章完全ミュート v1.2 初期化');
      
      // ページURLの変更を監視
      const observeUrlChanges = () => {
          // pushStateとreplaceStateをオーバーライド
          const originalPushState = history.pushState;
          const originalReplaceState = history.replaceState;
          
          history.pushState = function() {
              originalPushState.apply(this, arguments);
              handleUrlChange();
          };
          
          history.replaceState = function() {
              originalReplaceState.apply(this, arguments);
              handleUrlChange();
          };
          
          // popstateイベントも監視
          window.addEventListener('popstate', handleUrlChange);
          
          // URLが変更されたときの処理
          function handleUrlChange() {
              console.log('[TwitterMuteFilter] URL changed');
              
              // ミュート設定ページの場合はモーダルを表示
              if (location.href.includes('/settings/muted_keywords')) {
                  // 少し遅延させてUIが完全に読み込まれてから実行
                  setTimeout(() => {
                      showSettingsModal();
                  }, 1000);
              } else {
                  // 通常ページの場合は既存ツイートを処理
                  setTimeout(applyMuteSettings, 500);
              }
          }
      };
      
      // 初期化処理
      const initialize = () => {
          // 既存設定から空文字をフィルタリング（バージョンアップ時の修正）
          if (settings.stringKeywords.includes('') || settings.regexKeywords.includes('')) {
              console.log('[TwitterMuteFilter] 空のキーワードを削除しています...');
              settings.stringKeywords = settings.stringKeywords.filter(k => k !== '');
              settings.regexKeywords = settings.regexKeywords.filter(k => k !== '');
              saveSettings();
          }
          
          // 初期ミュート設定を適用
          setTimeout(applyMuteSettings, 1000);
          
          // URL変更の監視を開始
          observeUrlChanges();
          
          // 既にミュート設定ページにいる場合は設定画面を表示
          if (location.href.includes('/settings/muted_keywords')) {
              setTimeout(() => {
                  showSettingsModal();
              }, 1500);
          }
      };
      
      // MutationObserverでツイートを監視
      const observer = new MutationObserver((mutations) => {
          // 機能が無効の場合は何もしない
          if (!settings.enabled) return;
          
          for (const mutation of mutations) {
              if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                  for (const node of mutation.addedNodes) {
                      if (node.nodeType === Node.ELEMENT_NODE) {
                          // ツイート要素を検索
                          const tweets = node.querySelectorAll ? (
                              node.querySelectorAll('[data-testid="tweet"], [id^=id__]')
                          ) : [];
                          
                          tweets.forEach(processTweet);
                          
                          // 自身がツイート要素である場合も処理
                          if (node.dataset?.testid === 'tweet' || (node.id && node.id.startsWith('id__'))) {
                              processTweet(node);
                          }
                          
                          // タイムラインのセルが追加された場合にも対応
                          if (node.querySelector && node.querySelector('[data-testid="cellInnerDiv"]')) {
                              const cellTweets = node.querySelectorAll('[data-testid="tweet"], [id^=id__]');
                              cellTweets.forEach(processTweet);
                          }
                      }
                  }
              }
          }
      });
      
      // 監視開始
      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
      
      // 初期化を実行
      initialize();
  })();

