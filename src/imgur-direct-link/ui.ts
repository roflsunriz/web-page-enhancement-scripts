import { createLogger } from '@/shared/logger';

/**
 * 成功・失敗メッセージをトースト通知で表示します。
 * @param message 表示するメッセージ
 * @param isSuccess 成功メッセージかどうか (デフォルト: true)
 */
export function showToast(message: string, isSuccess = true): void {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${isSuccess ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 16px;
    border-radius: 4px;
    z-index: 2147483647;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: opacity 0.5s ease;
    opacity: 1;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

/**
 * メディアリンクをコピーするためのボタンを内包したShadow DOMを生成し、ページに追加します。
 * @param index ボタンのインデックス（複数メディア対応のため）
 * @param mediaUrl コピー対象のメディアURL
 * @param wrapper ボタンを追加する親要素
 */
export function createShadowButton(index: number, mediaUrl: string, wrapper: HTMLElement): void {
  const container = document.createElement('div');
  container.id = `imgurCopyButton-container-${index}`;

  const shadowRoot = container.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = `
    .copy-button {
        position: absolute;
        top: 60px;
        right: 10px;
        z-index: 1000;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .copy-button:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: translateY(-2px);
    }
  `;

  const copyButton = document.createElement('button');
  copyButton.className = 'copy-button';
  copyButton.textContent = `メディア${index + 1}をコピー`;

  copyButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(mediaUrl).then(() => {
      showToast(`メディア${index + 1}のリンクがコピーされました:\n${mediaUrl}`);
    }).catch(err => {
      createLogger('ImgurDirectLinkCopier').error('クリップボードへのコピーに失敗しました: ', err);
      showToast('クリップボードへのコピーに失敗しました', false);
    });
  });

  shadowRoot.append(style, copyButton);

  wrapper.style.position = 'relative';
  wrapper.appendChild(container);
}