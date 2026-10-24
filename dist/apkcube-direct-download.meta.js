// ==UserScript==
// @name         apkcube-direct-download
// @namespace    apkcubeDirectDownload
// @version      1.4.0
// @author       roflsunriz
// @description  Google Play上でAPKCube拒否を先回り判定し、確認済み代替配布元へ直接移動
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apkcube.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/apkcube-direct-download.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/apkcube-direct-download.meta.js
// @match        https://apkcube.com/*
// @match        https://play.google.com/store/apps/details*
// @sandbox      raw
// @connect      apkcube.com
// @connect      www.apkmirror.com
// @connect      tapi.pureapk.com
// @connect      en.uptodown.com
// @connect      *.en.uptodown.com
// @grant        GM_xmlhttpRequest
// @inject-into  page
// @run-at       document-start
// ==/UserScript==