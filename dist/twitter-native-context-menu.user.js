// ==UserScript==
// @name         twitter-native-context-menu
// @namespace    twitterNativeContextMenu
// @version      1.0.0
// @author       roflsunriz
// @description  X/Twitterでブラウザ標準の右クリックメニューを使えるようにする
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-native-context-menu.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-native-context-menu.meta.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @sandbox      raw
// @grant        none
// @inject-into  page
// @run-at       document-start
// ==/UserScript==

(function(){"use strict";window.addEventListener(`contextmenu`,e=>e.stopImmediatePropagation(),!0)})();
