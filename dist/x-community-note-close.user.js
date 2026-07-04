// ==UserScript==
// @name         x-community-note-close
// @namespace    xCommunityNoteClose
// @version      1.0.0
// @author       roflsunriz
// @description  X/Twitterのコミュニティノート評価モーダルをバックドロップクリックで閉じる
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/x-community-note-close.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/x-community-note-close.meta.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-end
// ==/UserScript==

(function(){"use strict";var e={mask:`[data-testid="mask"]`,closeButton:`[data-testid="app-bar-close"]`,dialog:`[role="dialog"]`};function t(){document.addEventListener(`click`,t=>{let n=t.target;if(!(n instanceof HTMLElement)||!n.matches(e.mask))return;let r=n.closest(e.dialog);if(!r)return;let i=r.querySelector(e.closeButton);i&&i.click()})}t()})();
