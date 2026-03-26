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

(function () {
	'use strict';

	const e={mask:'[data-testid="mask"]',closeButton:'[data-testid="app-bar-close"]',dialog:'[role="dialog"]'};function c(){document.addEventListener("click",a=>{const t=a.target;if(!(t instanceof HTMLElement)||!t.matches(e.mask))return;const o=t.closest(e.dialog);if(!o)return;const s=o.querySelector(e.closeButton);s&&s.click();});}c();

})();