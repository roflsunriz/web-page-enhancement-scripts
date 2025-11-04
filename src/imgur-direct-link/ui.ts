import { createLogger } from '@/shared/logger';

// 再確認用のガード（多重防御）
const DIRECT_IMGUR_RE =
  /^https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(?:jpg|jpeg|png|gif|mp4|webm|webp|avif)$/i;

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
    white-space: pre-wrap;
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
  // 無効URLは早期離脱
  if (!DIRECT_IMGUR_RE.test(mediaUrl)) return;

  // 既存設置を重複させない
  if (!wrapper.style.position || wrapper.style.position === '') {
    wrapper.style.position = 'relative';
  }

  const container = document.createElement('div');
  container.id = `imgurCopyButton-container-${index}`;
  container.dataset.imgurDirectLinkButtonContainer = 'true';

  const shadowRoot = container.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host {
      position: absolute;
      top: 60px;
      right: 15px;
      z-index: 2147483647;
      /* ホバーでのガクガクを防ぐ: 常時配置して opacity だけ切替 */
      opacity: 0.1;
      transition: opacity 120ms ease;
      pointer-events: none; /* コンテナはイベントを拾わない */
    }
    .btn {
      font-size: 12px;
      padding: 6px 8px;
      border-radius: 6px;
      background: rgba(0,0,0,0.65);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      cursor: pointer;
      pointer-events: auto; /* ボタンのみクリック可能 */
      user-select: none;
      transition: transform 60ms ease-out, filter 60ms ease-out, box-shadow 60ms ease-out;
      position: relative;
      overflow: hidden;
    }
    .btn .particle {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ffd700;
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    .btn.explode .particle {
      animation: explode-particles 400ms ease-out;
    }
    @keyframes explode-particles {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      20% { transform: translate(-50%, -50%) scale(1); }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    .btn.explode .particle:nth-child(1) { animation: explode-particles 400ms ease-out, p1 400ms ease-out; } @keyframes p1 { to { transform: translate(30px, -30px); } }
    .btn.explode .particle:nth-child(2) { animation: explode-particles 400ms ease-out, p2 400ms ease-out; } @keyframes p2 { to { transform: translate(-25px, 28px); } }
    .btn.explode .particle:nth-child(3) { animation: explode-particles 400ms ease-out, p3 400ms ease-out; } @keyframes p3 { to { transform: translate(28px, 25px); } }
    .btn.explode .particle:nth-child(4) { animation: explode-particles 400ms ease-out, p4 400ms ease-out; } @keyframes p4 { to { transform: translate(-22px, -22px); } }
    .btn.explode .particle:nth-child(5) { animation: explode-particles 400ms ease-out, p5 400ms ease-out; } @keyframes p5 { to { transform: translate(25px, 0px); } }
    .btn.explode .particle:nth-child(6) { animation: explode-particles 400ms ease-out, p6 400ms ease-out; } @keyframes p6 { to { transform: translate(-25px, 0px); } }
    .btn.explode .particle:nth-child(7) { animation: explode-particles 400ms ease-out, p7 400ms ease-out; } @keyframes p7 { to { transform: translate(0, 25px); } }
    .btn.explode .particle:nth-child(8) { animation: explode-particles 400ms ease-out, p8 400ms ease-out; } @keyframes p8 { to { transform: translate(0, -25px); } }
    .btn.explode .particle:nth-child(9) { animation: explode-particles 400ms ease-out, p9 400ms ease-out; } @keyframes p9 { to { transform: translate(20px, 15px); } }
    .btn.explode .particle:nth-child(10) { animation: explode-particles 400ms ease-out, p10 400ms ease-out; } @keyframes p10 { to { transform: translate(-15px, -20px); } }
    .btn:hover { filter: brightness(1.12); }
    .btn:active {
      transform: translateY(1px);
      filter: brightness(0.9);
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
    }
    .btn[disabled] {
      opacity: .5;
      cursor: not-allowed;
    }
  `;

  const copyButton = document.createElement('button');
  copyButton.className = 'btn';
  copyButton.textContent = 'コピー';
  copyButton.title = 'ダイレクトリンクをコピー';

  // パーティクル用のspanを追加
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    copyButton.appendChild(particle);
  }
  // クリック1回で確実にコピー: pointerdown 優先（クリック競合対策）
  const doCopy = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (!DIRECT_IMGUR_RE.test(mediaUrl)) {
      showToast('直接リンクではありません（i.imgur.comのみ許可）', false);
      copyButton.setAttribute('disabled', 'true');
      return;
    }

    // アニメーションクラスを追加
    copyButton.classList.add('explode');
    copyButton.addEventListener('animationend', () => {
      copyButton.classList.remove('explode');
    }, { once: true });

    navigator.clipboard.writeText(mediaUrl)
      .then(() => showToast(`メディア${index + 1}のリンクをコピー:\n${mediaUrl}`))
      .catch((err) => {
        createLogger('ImgurDirectLinkCopier').error('クリップボードへのコピーに失敗: ', err);
        showToast('クリップボードへのコピーに失敗しました', false);
      });
  };
  copyButton.addEventListener('pointerdown', doCopy, { passive: false });
  copyButton.addEventListener('click', doCopy); // フォールバック

  shadowRoot.append(style, copyButton);
  wrapper.appendChild(container);

  // ===== ホバーのガクガク防止（フェード制御） =====
  let hideTimer: number | null = null;
  const setVisible = (v: boolean) => {
    if (v) {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      container.style.opacity = '1';
    } else {
      // 少し遅らせることでボタン上へ移動しても消えない
      hideTimer = window.setTimeout(() => {
        container.style.opacity = '0.1';
      }, 120);
    }
  };
  // ラッパー上で表示
  wrapper.addEventListener('mouseenter', () => setVisible(true), { passive: true });
  wrapper.addEventListener('mouseleave', () => setVisible(false), { passive: true });
  // ボタン上でも表示維持（Shadow DOM 内）
  container.addEventListener('mouseenter', () => setVisible(true), { passive: true });
  container.addEventListener('mouseleave', () => setVisible(false), { passive: true });
}