// ==UserScript==
// @name         video-screen-off-detection-blocker
// @namespace    videoScreenOffDetectionBlocker
// @version      1.0.0
// @author       roflsunriz
// @description  Webページ上のvideo要素に対する画面オフ・バックグラウンド検知を遮断し、SPAで追加される動画にも追従する
// @license      MIT
// @icon         data:image/svg+xml,%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%0A%20%20%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2214%22%20fill%3D%22%230f172a%22%2F%3E%0A%20%20%3Crect%20x%3D%2211%22%20y%3D%2218%22%20width%3D%2242%22%20height%3D%2228%22%20rx%3D%225%22%20fill%3D%22%23e0f2fe%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M28%2025v14l12-7z%22%20fill%3D%22%230f172a%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M15%2049%2049%2015%22%20stroke%3D%22%2338bdf8%22%20stroke-width%3D%226%22%20stroke-linecap%3D%22round%22%2F%3E%0A%3C%2Fsvg%3E%0A
// @icon64       data:image/svg+xml,%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%0A%20%20%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2214%22%20fill%3D%22%230f172a%22%2F%3E%0A%20%20%3Crect%20x%3D%2211%22%20y%3D%2218%22%20width%3D%2242%22%20height%3D%2228%22%20rx%3D%225%22%20fill%3D%22%23e0f2fe%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M28%2025v14l12-7z%22%20fill%3D%22%230f172a%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M15%2049%2049%2015%22%20stroke%3D%22%2338bdf8%22%20stroke-width%3D%226%22%20stroke-linecap%3D%22round%22%2F%3E%0A%3C%2Fsvg%3E%0A
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/video-screen-off-detection-blocker.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/video-screen-off-detection-blocker.meta.js
// @match        *://*/*
// @sandbox      raw
// @grant        none
// @inject-into  page
// @run-at       document-start
// ==/UserScript==