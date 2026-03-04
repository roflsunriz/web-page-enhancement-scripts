/**
 * dアニメストア 視聴ページ コントローラーボタン注入プローブ v5.2.0
 *
 * v5.1 の修正:
 *   - パネル bottom を 52px→70px に変更（シークバーとの重なりを解消）
 *   - ボタン z-index:500 追加（#dialog ダイアログより上に表示）
 *   - #dialog の z-index と .seekArea の位置を計測・記録
 *
 * v5.2 の修正:
 *   - プローブオーバーレイを左上(top:16px, left:16px)に移動
 *     （右下配置だとボタン・パネルと重なっていたため）
 *
 * 注入位置: .buttonArea 内の .setting.mainButton の直前
 *   [..., .volume, .space, .time, [★ここ], .setting, .fullscreen]
 */
(function () {
  'use strict';

  const PROBE_VERSION = '5.2.0';
  const OVERLAY_ID = '__danime-probe-overlay__';
  const BTN_HOST_ID = '__danime-probe-btn__';
  const PANEL_ID = '__danime-probe-panel__';
  const AUTO_FORCE_STYLE_ID = '__danime-probe-auto-force__';
  const MEASURE_FORCE_STYLE_ID = '__danime-probe-measure-force__';

  // クリーンアップ
  [OVERLAY_ID, BTN_HOST_ID, PANEL_ID, AUTO_FORCE_STYLE_ID, MEASURE_FORCE_STYLE_ID].forEach(
    (id) => document.getElementById(id)?.remove()
  );
  document.querySelectorAll('[data-probe="true"]').forEach((el) => el.remove());

  // ── SVGアイコン (fill="white" で明示) ─────────────────────────────────────
  const MDI_PALETTE = 'M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2C17.5,2 22,6 22,11A6,6 0 0,1 16,17H14.2C13.9,17 13.7,17.2 13.7,17.5C13.7,17.6 13.8,17.7 13.8,17.8C14.2,18.3 14.4,18.9 14.4,19.5C14.4,20.9 13.3,22 12,22M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C12.3,20 12.5,19.8 12.5,19.5C12.5,19.3 12.4,19.2 12.4,19.1C12,18.6 11.8,18 11.8,17.5C11.8,16.1 12.9,15 14.2,15H16A4,4 0 0,0 20,11C20,7.1 16.4,4 12,4M6.5,10C7.3,10 8,10.7 8,11.5C8,12.3 7.3,13 6.5,13C5.7,13 5,12.3 5,11.5C5,10.7 5.7,10 6.5,10M9.5,6C10.3,6 11,6.7 11,7.5C11,8.3 10.3,9 9.5,9C8.7,9 8,8.3 8,7.5C8,6.7 8.7,6 9.5,6M14.5,6C15.3,6 16,6.7 16,7.5C16,8.3 15.3,9 14.5,9C13.7,9 13,8.3 13,7.5C13,6.7 13.7,6 14.5,6M17.5,10C18.3,10 19,10.7 19,11.5C19,12.3 18.3,13 17.5,13C16.7,13 16,12.3 16,11.5C16,10.7 16.7,10 17.5,10Z';
  const MDI_COMMENT_OUTLINE = 'M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16H20V4H4V16H10Z';
  const MDI_CLOSE = 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z';

  function makeSvg(d, size = 24, fill = 'white') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" aria-hidden="true" focusable="false"><path d="${d}"></path></svg>`;
  }

  // ── ユーティリティ ────────────────────────────────────────────────────────

  function measure(el) {
    if (!el) return { found: false };
    const rect = el.getBoundingClientRect();
    const s = window.getComputedStyle(el);
    return {
      found: true,
      id: el.id || null,
      classList: [...el.classList].slice(0, 8),
      rect: { top: Math.round(rect.top), left: Math.round(rect.left), w: Math.round(rect.width), h: Math.round(rect.height) },
      style: {
        display: s.display,
        opacity: s.opacity,
        position: s.position,
        zIndex: s.zIndex,
        pointerEvents: s.pointerEvents,
        overflow: s.overflow,
        width: s.width,
        height: s.height,
      },
    };
  }

  function isEffectivelyVisible(el) {
    let cur = el;
    while (cur && cur !== document.documentElement) {
      const s = window.getComputedStyle(cur);
      if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) return false;
      cur = cur.parentElement;
    }
    const r = el?.getBoundingClientRect();
    return (r?.width ?? 0) > 0 && (r?.height ?? 0) > 0;
  }

  // ── 結果 ─────────────────────────────────────────────────────────────────

  const results = {
    meta: {
      probeVersion: PROBE_VERSION,
      timestamp: new Date().toISOString(),
      url: location.href,
      viewport: { width: window.innerWidth, height: window.innerHeight },
    },
    controller: null,
    injectedButton: null,
    injectedPanel: null,
    panelOpened: null,
    controllerClipCheck: null,
    summary: '',
  };

  const controller = document.querySelector('.controller');
  const videoWrapper = document.querySelector('.videoWrapper');
  const settingBtn = document.querySelector('.controller .setting.mainButton');
  const buttonArea = document.querySelector('.controller .buttonArea');

  results.controller = measure(controller);

  // ── #dialog / .seekArea の事前調査 ───────────────────────────────────────
  const dialogEl = document.querySelector('.controller #dialog');
  const seekAreaEl = document.querySelector('.controller .seekArea');
  results.dialog = dialogEl ? {
    ...measure(dialogEl),
    uiDialogZIndex: dialogEl.style.zIndex || window.getComputedStyle(dialogEl).zIndex,
  } : { found: false };
  results.seekArea = measure(seekAreaEl);
  console.log('[Probe v5.1] #dialog:', results.dialog);
  console.log('[Probe v5.1] .seekArea:', results.seekArea);

  // ── 計測用の一時強制表示（transition:none で reflow させて計測精度確保）────

  const measureForceStyle = document.createElement('style');
  measureForceStyle.id = MEASURE_FORCE_STYLE_ID;
  measureForceStyle.textContent = `.controller { opacity:1!important; pointer-events:auto!important; transition:none!important; }`;
  document.head.appendChild(measureForceStyle);
  void controller?.offsetHeight;

  // ── ボタン注入 ────────────────────────────────────────────────────────────

  // wrapper: .mainButton クラスで 44×50px を自動適用
  const btnWrapper = document.createElement('div');
  btnWrapper.id = BTN_HOST_ID;
  btnWrapper.setAttribute('data-probe', 'true');
  btnWrapper.className = 'mainButton';
  // ★ 視認用ハイライト（テスト時のみ）: 本番では削除
  // z-index を設定して #dialog(jQuery UI) より上に表示
  btnWrapper.style.cssText = [
    'position:relative',
    'cursor:pointer',
    'z-index:500',                               // #dialog より上
    'outline:2px solid rgba(100,160,255,0.9)',   // 青ボーダー
    'outline-offset:-3px',
    'border-radius:4px',
    'background:rgba(30,60,180,0.35)',           // 半透明青背景
    'box-shadow:0 0 8px rgba(80,140,255,0.5)',   // グロー
  ].join(';');

  const btn = document.createElement('button');
  btn.style.cssText = [
    'width:100%', 'height:100%',
    'background:transparent', 'border:none',
    'cursor:pointer', 'padding:0',
    'display:flex', 'align-items:center', 'justify-content:center',
  ].join(';');
  btn.title = 'Nico Comment Renderer 設定 [probe]';
  // fill="white" で明示（currentColor 依存なし）
  btn.innerHTML = makeSvg(MDI_PALETTE, 22, 'white');
  btnWrapper.appendChild(btn);

  // ── モックパネル ─────────────────────────────────────────────────────────

  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.setAttribute('data-probe', 'true');
  panel.style.cssText = [
    'display:none',
    'position:absolute',
    // bottom の計算:
    //   .buttonArea height=50px + .seekArea height≈15px = 65px
    //   さらに余裕を持たせて 70px → パネル bottom が seekArea top より上になる
    'bottom:70px',
    'right:0',
    'width:260px',
    'background:rgba(18,20,46,0.97)',
    'color:#e8eaff',
    'font:13px/1.6 sans-serif',
    'padding:14px 16px',
    'border-radius:10px 10px 0 10px',
    'border:1px solid rgba(80,110,220,0.7)',
    'box-shadow:0 -4px 24px rgba(0,0,0,0.8)',
    'z-index:300',           // controller(160) + canvas(1000) → 上に出す
    'pointer-events:auto',
    'box-sizing:border-box',
  ].join(';');

  panel.innerHTML = [
    `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">`,
    `  <span style="font-weight:700;font-size:12px;color:#a0b4ff;display:flex;align-items:center;gap:6px;">`,
    `    ${makeSvg(MDI_PALETTE, 15, '#a0b4ff')} Nico設定（モック v${PROBE_VERSION}）`,
    `  </span>`,
    `  <button id="__probe-panel-close__" style="background:none;border:none;cursor:pointer;color:#888;padding:2px;line-height:0;">`,
    `    ${makeSvg(MDI_CLOSE, 16, '#888')}`,
    `  </button>`,
    `</div>`,
    // コメント表示トグル
    `<label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:8px;">`,
    `  <input type="checkbox" checked id="__probe-toggle__" style="width:16px;height:16px;cursor:pointer;">`,
    `  <span style="font-size:12px;">コメントを表示</span>`,
    `</label>`,
    // 透明度スライダー
    `<div style="margin-bottom:8px;">`,
    `  <div style="font-size:11px;opacity:0.65;margin-bottom:3px;">コメント透明度: <span id="__probe-opacity-val__">80</span>%</div>`,
    `  <input type="range" min="0" max="100" value="80" id="__probe-opacity-slider__"`,
    `    style="width:100%;cursor:pointer;accent-color:#6080f0;">`,
    `</div>`,
    // 動画情報カード
    `<div style="background:rgba(255,255,255,0.06);border-radius:6px;padding:8px 10px;font-size:11px;line-height:1.8;">`,
    `  <div style="display:flex;align-items:center;gap:6px;">`,
    `    ${makeSvg(MDI_COMMENT_OUTLINE, 13, '#a0b4ff')}`,
    `    <span style="opacity:0.85;">動画: sm12345678（モック）</span>`,
    `  </div>`,
    `</div>`,
    `<div style="margin-top:10px;font-size:10px;opacity:0.35;text-align:center;">probe v${PROBE_VERSION} — 目視確認用</div>`,
  ].join('');

  btnWrapper.appendChild(panel);

  // ── DOM 挿入 ─────────────────────────────────────────────────────────────

  const insertTarget = settingBtn ?? null;
  if (insertTarget) {
    insertTarget.insertAdjacentElement('beforebegin', btnWrapper);
    console.log('[Probe v5] ✅ .setting直前 に注入');
  } else {
    buttonArea?.appendChild(btnWrapper);
    console.warn('[Probe v5] .setting が見つからないため buttonArea 末尾に追加');
  }

  // ── 強制表示中に計測 ─────────────────────────────────────────────────────

  results.injectedButton = measure(btnWrapper);
  results.injectedButton.effectivelyVisible = isEffectivelyVisible(btnWrapper);

  // パネルを一時的に開いて計測
  panel.style.display = 'block';
  results.injectedPanel = measure(panel);
  results.injectedPanel.effectivelyVisible = isEffectivelyVisible(panel);

  // .controller の overflow:hidden でパネルがクリップされるか確認
  const controllerRect = controller?.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  if (controllerRect) {
    results.controllerClipCheck = {
      controllerBounds: { top: Math.round(controllerRect.top), bottom: Math.round(controllerRect.bottom), left: Math.round(controllerRect.left), right: Math.round(controllerRect.right) },
      panelBounds: { top: Math.round(panelRect.top), bottom: Math.round(panelRect.bottom), left: Math.round(panelRect.left), right: Math.round(panelRect.right) },
      panelTopClipped: panelRect.top < controllerRect.top,
      panelBottomClipped: panelRect.bottom > controllerRect.bottom,
      panelLeftClipped: panelRect.left < controllerRect.left,
      panelRightClipped: panelRect.right > controllerRect.right,
    };
    const cc = results.controllerClipCheck;
    const anyClip = cc.panelTopClipped || cc.panelBottomClipped || cc.panelLeftClipped || cc.panelRightClipped;
    console.log(`[Probe v5] パネルクリップ確認: ${anyClip ? '⚠️ クリップされる' : '✅ クリップなし'}`, cc);
  }

  // パネルを閉じる（初期は閉じた状態）
  panel.style.display = 'none';

  // 計測用強制表示を解除
  measureForceStyle.remove();

  console.log('[Probe v5] 注入ボタン:', results.injectedButton?.rect, '/ effectivelyVisible(強制時):', results.injectedButton?.effectivelyVisible);

  // ── 【重要】自動強制表示（10秒間） ───────────────────────────────────────
  // 注入後すぐにコントローラーを表示し、パネルも開く。ユーザーが目視確認できるようにする。

  const autoForceStyle = document.createElement('style');
  autoForceStyle.id = AUTO_FORCE_STYLE_ID;
  autoForceStyle.textContent = `.controller { opacity:1!important; pointer-events:auto!important; }`;
  document.head.appendChild(autoForceStyle);

  // パネルも自動で開く
  panel.style.display = 'block';
  results.panelOpened = { openedAt: new Date().toISOString(), auto: true };

  console.log('[Probe v5] 🟢 コントローラーを10秒間強制表示。パレットアイコンを確認してください。');
  console.log('[Probe v5] ボタン画面座標: left=' + results.injectedButton?.rect?.left + ', top=' + results.injectedButton?.rect?.top);

  let countdown = 10;
  const countdownTimer = setInterval(() => {
    countdown--;
    const el = document.getElementById('__probe-countdown__');
    if (el) el.textContent = String(countdown);
    if (countdown <= 0) {
      clearInterval(countdownTimer);
      autoForceStyle.remove();
      panel.style.display = 'none';
      const el2 = document.getElementById('__probe-countdown-wrap__');
      if (el2) el2.style.display = 'none';
      console.log('[Probe v5] 強制表示終了。プレイヤーをホバーで通常のコントローラー表示確認へ。');
    }
  }, 1000);

  // ── イベント ─────────────────────────────────────────────────────────────

  btn.addEventListener('click', () => {
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) {
      results.panelOpened = { openedAt: new Date().toISOString(), auto: false };
      console.log('[Probe v5] パネル開');
    }
  });

  panel.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.closest('#__probe-panel-close__')) {
      panel.style.display = 'none';
    }
  });

  panel.querySelector('#__probe-opacity-slider__')?.addEventListener('input', (e) => {
    const val = e.target instanceof HTMLInputElement ? e.target.value : '80';
    const el = panel.querySelector('#__probe-opacity-val__');
    if (el) el.textContent = val;
  });

  // ── サマリー ─────────────────────────────────────────────────────────────

  results.summary = [
    `btn: left=${results.injectedButton?.rect?.left} (setting直前)`,
    `btn size: ${results.injectedButton?.rect?.w}×${results.injectedButton?.rect?.h}`,
    `btn effectivelyVisible: ${results.injectedButton?.effectivelyVisible}`,
    `panel clip: ${results.controllerClipCheck ? (Object.values({a:results.controllerClipCheck.panelTopClipped,b:results.controllerClipCheck.panelBottomClipped,c:results.controllerClipCheck.panelLeftClipped,d:results.controllerClipCheck.panelRightClipped}).some(Boolean) ? 'クリップあり' : 'なし') : '未計測'}`,
  ].join(' | ');

  // ── 結果オーバーレイ ──────────────────────────────────────────────────────

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.style.cssText = [
    // 右下はボタン(left=1127)・パネル(left=911-1171)と重なるため左上に配置
    'position:fixed', 'top:16px', 'left:16px',
    'background:rgba(10,10,28,0.97)', 'color:#d8dcff',
    'font:12px/1.6 monospace', 'padding:14px 16px',
    'border-radius:10px', 'border:1px solid #336',
    'box-shadow:0 6px 32px rgba(0,0,0,0.8)',
    'z-index:2147483647', 'max-width:400px',
  ].join(';');

  const btnRect = results.injectedButton?.rect;
  overlay.innerHTML = `
    <div style="font-weight:700;font-size:13px;color:#9ab;margin-bottom:8px;">🔬 Probe v${PROBE_VERSION}</div>

    <div id="__probe-countdown-wrap__" style="background:rgba(0,200,100,0.15);border:1px solid rgba(0,200,100,0.4);border-radius:6px;padding:8px 10px;margin-bottom:10px;font-size:12px;">
      🟢 コントローラーを自動表示中 <b id="__probe-countdown__">10</b> 秒<br>
      <span style="opacity:0.8;font-size:11px;">パレットアイコン ${makeSvg(MDI_PALETTE, 12, '#6af')} を確認してください</span>
    </div>

    <div style="font-size:11px;line-height:1.9;">
      ボタン位置: <b>left=${btnRect?.left ?? '?'}px, top=${btnRect?.top ?? '?'}px</b><br>
      ボタンサイズ: <b>${btnRect?.w ?? '?'}×${btnRect?.h ?? '?'}px</b><br>
      パネルクリップ: <b>${results.controllerClipCheck ? (Object.values({a:results.controllerClipCheck.panelTopClipped,b:results.controllerClipCheck.panelBottomClipped,c:results.controllerClipCheck.panelLeftClipped,d:results.controllerClipCheck.panelRightClipped}).some(Boolean) ? '⚠️ あり' : '✅ なし') : '未計測'}</b><br>
      seekArea: <b>top=${results.seekArea?.rect?.top ?? '?'}</b><br>
      #dialog z-index: <b>${results.dialog?.uiDialogZIndex ?? '?'}</b>
    </div>

    <div style="margin-top:10px;font-size:11px;opacity:0.75;">
      ▶ ${btnRect ? `画面左端から ${btnRect.left}px の位置` : '位置不明'}<br>
      ▶ プレイヤー下部コントロールバーの右側<br>
      ▶ ${makeSvg(MDI_PALETTE, 11, '#88aaff')} 青枠＋青背景のアイコンを探す
    </div>

    <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">
      <button id="__probe-toggle-force__" style="cursor:pointer;background:#226;color:#fff;border:1px solid #446;padding:5px 10px;border-radius:5px;font:11px sans-serif;">👁 手動強制ON</button>
      <button id="__probe-dl__" style="cursor:pointer;background:#4a5af0;color:#fff;border:none;padding:5px 10px;border-radius:5px;font:11px sans-serif;">📥 JSON DL</button>
      <button id="__probe-close__" style="cursor:pointer;background:#333;color:#fff;border:none;padding:5px 10px;border-radius:5px;font:11px sans-serif;">✕</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // 手動強制トグル
  let manualForce = null;
  document.getElementById('__probe-toggle-force__')?.addEventListener('click', () => {
    if (manualForce) {
      manualForce.remove();
      manualForce = null;
      document.getElementById('__probe-toggle-force__').textContent = '👁 手動強制ON';
    } else {
      manualForce = document.createElement('style');
      manualForce.textContent = '.controller { opacity:1!important; pointer-events:auto!important; }';
      document.head.appendChild(manualForce);
      document.getElementById('__probe-toggle-force__').textContent = '👁 手動強制OFF';
    }
  });

  document.getElementById('__probe-dl__')?.addEventListener('click', () => {
    results.injectedButton = measure(document.getElementById(BTN_HOST_ID));
    results.injectedPanel = measure(document.getElementById(PANEL_ID));
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `danime-probe-v5-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  document.getElementById('__probe-close__')?.addEventListener('click', () => {
    clearInterval(countdownTimer);
    overlay.remove();
    document.querySelectorAll('[data-probe="true"]').forEach((el) => el.remove());
    autoForceStyle.remove();
    manualForce?.remove();
  });

  console.log('[Probe v5] 完了。', results.summary);
  window.__daniomeProbeResults = results;
  return results;
})();
