// ==UserScript==
// @name         khinsider-direct-link-saver
// @namespace    khinsiderDirectLinkSaver
// @version      1.0.0
// @author       roflsunriz
// @description  KHInsiderのアルバムページから音声ファイルの直リンクを並列抽出して保存
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=downloads.khinsider.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/khinsider-direct-link-saver.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/khinsider-direct-link-saver.meta.js
// @match        https://downloads.khinsider.com/game-soundtracks/album/*
// @connect      downloads.khinsider.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  var P=typeof GM_addStyle<"u"?GM_addStyle:void 0,O=typeof GM_getValue<"u"?GM_getValue:void 0,D=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,K=typeof GM_setClipboard<"u"?GM_setClipboard:void 0,V=typeof GM_setValue<"u"?GM_setValue:void 0,Y=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;function S(t,e){D(t,e);}function z(t){P(t);}const B=Y;function k(t,e){V(t,e);}function M(t,e){return O(t,e)}function H(t,e){K(t,"text");}const c="khinsider-direct-link-saver",u=`${c}-panel`,w=`${c}-styles`,v=`${c}:links`,T=`${c}:concurrency`,y=4,U=1,L=12,F=3e4,X="mp3",j=["flac","m4a","aac","mp3"],C={flac:3,m4a:2,aac:2,mp3:1};let f=0,a=[];function b(t){return Number.isFinite(t)?Math.min(L,Math.max(U,Math.floor(t))):y}function R(){return b(M(T,y)??y)}function W(t){k(T,b(t));}function I(){return M(v,[])??[]}function g(t){k(v,t);}function q(t){try{const e=new URL(t,window.location.href),n=decodeURIComponent(e.pathname).toLowerCase();return j.find(r=>n.endsWith(`.${r}`))??null}catch{return null}}function Q(t){try{const e=new URL(t.href,window.location.href);return e.hostname===window.location.hostname&&q(e.href)===X}catch{return  false}}function E(t){return t.replace(/\s+/g," ").trim()}function J(t,e){const n=E(t.textContent??"");if(n.length>0&&!/^\d+:\d+$/.test(n)&&!/^\d+(?:\.\d+)?\s*(?:kb|mb|gb)$/i.test(n))return n;const o=t.closest("tr"),r=o?E(o.textContent??""):"";return r.length>0?r:`track-${String(e+1).padStart(2,"0")}`}function Z(){const t=new Set,e=[];for(const n of Array.from(document.querySelectorAll("a[href]"))){if(!Q(n))continue;const o=new URL(n.href,window.location.href);o.hash="";const r=o.href;t.has(r)||(t.add(r),e.push({index:e.length,title:J(n,e.length),url:r}));}return e}function tt(t){return new Promise((e,n)=>{B({method:"GET",url:t,timeout:F,responseType:"text",onload:o=>{e({status:o.status,statusText:o.statusText,responseText:o.responseText,finalUrl:o.finalUrl});},onerror:o=>{const r=typeof o.error=="string"?o.error:"request failed";n(new Error(r));},ontimeout:()=>{n(new Error("request timeout"));}});})}function et(t){return new DOMParser().parseFromString(t,"text/html")}function nt(t,e){const n=[],o=new Set;for(const r of Array.from(t.querySelectorAll("a[href]"))){const s=new URL(r.getAttribute("href")??"",e),i=q(s.href);!i||o.has(s.href)||(o.add(s.href),n.push({url:s.href,extension:i}));}return n}function ot(t){return t.reduce((e,n)=>{if(!e)return n;const o=C[e.extension];return C[n.extension]>o?n:e},null)}async function rt(t){const e=await tt(t.url);if(e.status<200||e.status>=300)throw new Error(`HTTP ${e.status} ${e.statusText}`);const n=et(e.responseText),o=ot(nt(n,e.finalUrl||t.url));return o?{...t,state:"done",directUrl:o.url,extension:o.extension,error:null}:{...t,state:"skipped",directUrl:null,extension:null,error:"音声ファイルの直リンクが見つかりません"}}function at(t){return t.map(e=>({...e,state:"pending",directUrl:null,extension:null,error:null}))}async function it(t,e,n){let o=0;async function r(){for(;o<t.length;){const i=o;o+=1,await n(t[i],i);}}const s=Math.min(e,t.length);await Promise.all(Array.from({length:s},()=>r()));}function _(t){return t.filter(e=>e.state==="done"&&e.directUrl!==null&&e.extension!==null).map(e=>({title:e.title,trackPageUrl:e.url,directUrl:e.directUrl,extension:e.extension}))}function G(t){return t.map(e=>e.directUrl).join(`
`)}function h(){return document.getElementById(u)}function d(t){const e=h()?.querySelector('[data-role="status"]');e&&(e.textContent=t);}function l(){const t=h();if(!t)return;const e=a.length>0?_(a):I(),n=t.querySelector('[data-role="output"]'),o=t.querySelector('[data-action="copy"]'),r=t.querySelector('[data-action="clear"]');n&&(n.value=G(e)),o&&(o.disabled=e.length===0),r&&(r.disabled=e.length===0);}function m(t){const e=t.filter(i=>i.state==="done").length,n=t.filter(i=>i.state==="failed").length,o=t.filter(i=>i.state==="skipped").length,r=e+n+o,s=t.length;d(`取得中: ${r}/${s} 保存 ${e} 失敗 ${n} スキップ ${o}`),l();}function p(t){const e=h();if(!e)return;e.querySelector('[data-action="start"]')?.toggleAttribute("disabled",t),e.querySelector('[data-action="stop"]')?.toggleAttribute("disabled",!t);const n=e.querySelector('[data-role="concurrency"]');n&&(n.disabled=t);}async function A(){const t=f+1;f=t;const e=Z();if(e.length===0){a=[],g([]),l(),d("末尾が.mp3の曲ページリンクが見つかりません");return}const n=R();if(a=at(e),p(true),m(a),await it(e,n,async(r,s)=>{if(f===t){a[s]={...a[s],state:"running"},m(a);try{a[s]=await rt(r);}catch(i){const N=i instanceof Error?i.message:"unknown error";a[s]={...r,state:"failed",directUrl:null,extension:null,error:N};}m(a);}}),f!==t){d("停止しました"),p(false);return}const o=_(a);g(o),l(),d(`完了: ${o.length}/${e.length}件の直リンクを保存しました`),p(false);}function ct(){f+=1,p(false),d("停止しました。進行中のリクエストは完了後に破棄されます");}function st(){const t=a.length>0?_(a):I();H(G(t)),d(`${t.length}件の直リンクをコピーしました`);}function ut(){a=[],g([]),l(),d("保存済みリンクを削除しました");}function dt(){const t=document.createElement("section");t.id=u,t.innerHTML=`
    <div class="${c}__header">
      <strong>KHInsider Direct Links</strong>
      <button type="button" data-action="hide" title="閉じる">×</button>
    </div>
    <div class="${c}__controls">
      <label>
        並列
        <input type="number" min="${U}" max="${L}" step="1" value="${R()}" data-role="concurrency">
      </label>
      <button type="button" data-action="start">取得</button>
      <button type="button" data-action="stop" disabled>停止</button>
      <button type="button" data-action="copy">コピー</button>
      <button type="button" data-action="clear">削除</button>
    </div>
    <div class="${c}__status" data-role="status">待機中</div>
    <textarea class="${c}__output" data-role="output" spellcheck="false"></textarea>
  `,t.querySelector('[data-action="start"]')?.addEventListener("click",()=>{A();}),t.querySelector('[data-action="stop"]')?.addEventListener("click",ct),t.querySelector('[data-action="copy"]')?.addEventListener("click",st),t.querySelector('[data-action="clear"]')?.addEventListener("click",ut),t.querySelector('[data-action="hide"]')?.addEventListener("click",()=>{t.hidden=true;});const e=t.querySelector('[data-role="concurrency"]');return e?.addEventListener("change",()=>{const n=b(Number(e.value));e.value=String(n),W(n);}),document.body.append(t),l(),t}function x(){const t=h()??dt();t.hidden=false,l();}function lt(){if(document.getElementById(w))return;z(`
    #${u} {
      background: #fff;
      border: 1px solid #9ca3af;
      border-radius: 8px;
      box-shadow: 0 12px 32px rgb(0 0 0 / 24%);
      color: #111827;
      font: 13px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      max-width: min(560px, calc(100vw - 24px));
      padding: 12px;
      position: fixed;
      right: 16px;
      top: 16px;
      width: 520px;
      z-index: 999999;
    }

    #${u}[hidden] {
      display: none;
    }

    .${c}__header,
    .${c}__controls {
      align-items: center;
      display: flex;
      gap: 8px;
    }

    .${c}__header {
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .${c}__controls {
      flex-wrap: wrap;
    }

    #${u} button,
    #${u} input {
      font: inherit;
    }

    #${u} button {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #111827;
      cursor: pointer;
      min-height: 28px;
      padding: 4px 9px;
    }

    #${u} button:hover:not(:disabled) {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    #${u} button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    #${u} label {
      align-items: center;
      display: inline-flex;
      gap: 5px;
    }

    #${u} input[type="number"] {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      min-height: 28px;
      padding: 3px 6px;
      width: 56px;
    }

    .${c}__status {
      color: #374151;
      margin: 10px 0 8px;
    }

    .${c}__output {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      box-sizing: border-box;
      font: 12px/1.45 ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
      height: 180px;
      resize: vertical;
      width: 100%;
    }
  `);const t=document.createElement("meta");t.id=w,document.head.append(t);}function $(){lt(),S("KHInsider直リンク抽出パネルを開く",x),S("KHInsider直リンク抽出を開始",()=>{x(),A();}),x();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",$,{once:true}):$();

})();