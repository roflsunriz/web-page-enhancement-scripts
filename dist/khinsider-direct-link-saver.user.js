// ==UserScript==
// @name         khinsider-direct-link-saver
// @namespace    khinsiderDirectLinkSaver
// @version      1.1.0
// @author       roflsunriz
// @description  KHInsiderのアルバムページから音声ファイルの直リンクを並列抽出してダウンロード
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=downloads.khinsider.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/khinsider-direct-link-saver.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/khinsider-direct-link-saver.meta.js
// @match        https://downloads.khinsider.com/game-soundtracks/album/*
// @connect      downloads.khinsider.com
// @connect      vgmtreasurechest.com
// @connect      *.vgmtreasurechest.com
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  var K=typeof GM_addStyle<"u"?GM_addStyle:void 0,z=typeof GM_download<"u"?GM_download:void 0,V=typeof GM_getValue<"u"?GM_getValue:void 0,B=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,H=typeof GM_setClipboard<"u"?GM_setClipboard:void 0,Y=typeof GM_setValue<"u"?GM_setValue:void 0,X=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;function g(t,e){B(t,e);}function j(t){K(t);}const W=X;function T(t,e){Y(t,e);}function U(t,e){return V(t,e)}function Q(t,e){H(t,"text");}const d="khinsider-direct-link-saver",l=`${d}-panel`,v=`${d}-styles`,I=`${d}:links`,R=`${d}:concurrency`,b=4,q=1,A=12,J=3e4,Z="mp3",tt=["flac","m4a","aac","mp3"],M={flac:3,m4a:2,aac:2,mp3:1};let p=0,h=0,c=[];function _(t){return Number.isFinite(t)?Math.min(A,Math.max(q,Math.floor(t))):b}function S(){return _(U(R,b)??b)}function et(t){T(R,_(t));}function $(){return U(I,[])??[]}function w(t){T(I,t);}function G(t){try{const e=new URL(t,window.location.href),o=decodeURIComponent(e.pathname).toLowerCase();return tt.find(r=>o.endsWith(`.${r}`))??null}catch{return null}}function nt(t){try{const e=new URL(t.href,window.location.href);return e.hostname===window.location.hostname&&G(e.href)===Z}catch{return  false}}function k(t){return t.replace(/\s+/g," ").trim()}function ot(t,e){const o=k(t.textContent??"");if(o.length>0&&!/^\d+:\d+$/.test(o)&&!/^\d+(?:\.\d+)?\s*(?:kb|mb|gb)$/i.test(o))return o;const n=t.closest("tr"),r=n?k(n.textContent??""):"";return r.length>0?r:`track-${String(e+1).padStart(2,"0")}`}function rt(){const t=new Set,e=[];for(const o of Array.from(document.querySelectorAll("a[href]"))){if(!nt(o))continue;const n=new URL(o.href,window.location.href);n.hash="";const r=n.href;t.has(r)||(t.add(r),e.push({index:e.length,title:ot(o,e.length),url:r}));}return e}function at(t){return new Promise((e,o)=>{W({method:"GET",url:t,timeout:J,responseType:"text",onload:n=>{e({status:n.status,statusText:n.statusText,responseText:n.responseText,finalUrl:n.finalUrl});},onerror:n=>{const r=typeof n.error=="string"?n.error:"request failed";o(new Error(r));},ontimeout:()=>{o(new Error("request timeout"));}});})}function it(t){return new DOMParser().parseFromString(t,"text/html")}function ct(t,e){const o=[],n=new Set;for(const r of Array.from(t.querySelectorAll("a[href]"))){const a=new URL(r.getAttribute("href")??"",e),i=G(a.href);!i||n.has(a.href)||(n.add(a.href),o.push({url:a.href,extension:i}));}return o}function dt(t){return t.reduce((e,o)=>{if(!e)return o;const n=M[e.extension];return M[o.extension]>n?o:e},null)}async function st(t){const e=await at(t.url);if(e.status<200||e.status>=300)throw new Error(`HTTP ${e.status} ${e.statusText}`);const o=it(e.responseText),n=dt(ct(o,e.finalUrl||t.url));return n?{...t,state:"done",directUrl:n.url,extension:n.extension,error:null}:{...t,state:"skipped",directUrl:null,extension:null,error:"音声ファイルの直リンクが見つかりません"}}function lt(t){return t.map(e=>({...e,state:"pending",directUrl:null,extension:null,error:null}))}async function N(t,e,o){let n=0;async function r(){for(;n<t.length;){const i=n;n+=1,await o(t[i],i);}}const a=Math.min(e,t.length);await Promise.all(Array.from({length:a},()=>r()));}function C(t){return t.filter(e=>e.state==="done"&&e.directUrl!==null&&e.extension!==null).map(e=>({title:e.title,trackPageUrl:e.url,directUrl:e.directUrl,extension:e.extension}))}function P(t){return t.map(e=>e.directUrl).join(`
`)}function ut(t){const e=new Set(["<",">",":",'"',"/","\\","|","?","*"]),o=t.split("").map(n=>e.has(n)||n.charCodeAt(0)<32?"_":n).join("").replace(/\s+/g," ").trim();return o.length>0?o:"track"}function ft(t,e){return `${String(e+1).padStart(2,"0")} ${ut(t.title)}.${t.extension}`}function y(){return document.getElementById(l)}function s(t){const e=y()?.querySelector('[data-role="status"]');e&&(e.textContent=t);}function f(){const t=y();if(!t)return;const e=c.length>0?C(c):$(),o=t.querySelector('[data-role="output"]'),n=t.querySelector('[data-action="copy"]'),r=t.querySelector('[data-action="clear"]'),a=t.querySelector('[data-action="download"]');o&&(o.value=P(e)),n&&(n.disabled=e.length===0),r&&(r.disabled=e.length===0),a&&(a.disabled=e.length===0);}function x(t){const e=t.filter(i=>i.state==="done").length,o=t.filter(i=>i.state==="failed").length,n=t.filter(i=>i.state==="skipped").length,r=e+o+n,a=t.length;s(`取得中: ${r}/${a} 保存 ${e} 失敗 ${o} スキップ ${n}`),f();}function u(t){const e=y();if(!e)return;e.querySelector('[data-action="start"]')?.toggleAttribute("disabled",t),e.querySelector('[data-action="start-download"]')?.toggleAttribute("disabled",t),e.querySelector('[data-action="stop"]')?.toggleAttribute("disabled",!t),e.querySelector('[data-action="download"]')?.toggleAttribute("disabled",t);const o=e.querySelector('[data-role="concurrency"]');o&&(o.disabled=t),t||f();}async function E(){const t=p+1;p=t;const e=rt();if(e.length===0)return c=[],w([]),f(),s("末尾が.mp3の曲ページリンクが見つかりません"),[];const o=S();if(c=lt(e),u(true),x(c),await N(e,o,async(r,a)=>{if(p===t){c[a]={...c[a],state:"running"},x(c);try{c[a]=await st(r);}catch(i){const F=i instanceof Error?i.message:"unknown error";c[a]={...r,state:"failed",directUrl:null,extension:null,error:F};}x(c);}}),p!==t)return s("停止しました"),u(false),[];const n=C(c);return w(n),f(),s(`完了: ${n.length}/${e.length}件の直リンクを保存しました`),u(false),n}function pt(){p+=1,u(false),s("停止しました。進行中のリクエストは完了後に破棄されます");}function ht(){const t=c.length>0?C(c):$();Q(P(t)),s(`${t.length}件の直リンクをコピーしました`);}function mt(){c=[],w([]),f(),s("保存済みリンクを削除しました");}function yt(t,e){return new Promise((o,n)=>{z({url:t.directUrl,name:e,saveAs:false,onload:()=>{o();},onerror:r=>{n(new Error(`download failed: ${r.error}`));},ontimeout:()=>{n(new Error("download timeout"));}});})}async function O(t=$()){const e=h+1;if(h=e,t.length===0){s("保存対象の音声リンクがありません");return}const o=S();let n=0,r=0;if(u(true),s(`ダウンロード中: 0/${t.length}`),await N(t,o,async(a,i)=>{if(h===e){try{await yt(a,ft(a,i)),n+=1;}catch{r+=1;}s(`ダウンロード中: ${n+r}/${t.length} 完了 ${n} 失敗 ${r}`);}}),h!==e){s("ダウンロードを停止しました"),u(false);return}s(`ダウンロード完了: 完了 ${n} 失敗 ${r}`),u(false);}async function D(){const t=await E();t.length>0&&await O(t);}function gt(){const t=document.createElement("section");t.id=l,t.innerHTML=`
    <div class="${d}__header">
      <strong>KHInsider Direct Links</strong>
      <button type="button" data-action="hide" title="閉じる">×</button>
    </div>
    <div class="${d}__controls">
      <label>
        並列
        <input type="number" min="${q}" max="${A}" step="1" value="${S()}" data-role="concurrency">
      </label>
      <button type="button" data-action="start">取得</button>
      <button type="button" data-action="start-download">取得して保存</button>
      <button type="button" data-action="download">保存</button>
      <button type="button" data-action="stop" disabled>停止</button>
      <button type="button" data-action="copy">コピー</button>
      <button type="button" data-action="clear">削除</button>
    </div>
    <div class="${d}__status" data-role="status">待機中</div>
    <textarea class="${d}__output" data-role="output" spellcheck="false"></textarea>
  `,t.querySelector('[data-action="start"]')?.addEventListener("click",()=>{E();}),t.querySelector('[data-action="start-download"]')?.addEventListener("click",()=>{D();}),t.querySelector('[data-action="download"]')?.addEventListener("click",()=>{O();}),t.querySelector('[data-action="stop"]')?.addEventListener("click",()=>{pt(),h+=1;}),t.querySelector('[data-action="copy"]')?.addEventListener("click",ht),t.querySelector('[data-action="clear"]')?.addEventListener("click",mt),t.querySelector('[data-action="hide"]')?.addEventListener("click",()=>{t.hidden=true;});const e=t.querySelector('[data-role="concurrency"]');return e?.addEventListener("change",()=>{const o=_(Number(e.value));e.value=String(o),et(o);}),document.body.append(t),f(),t}function m(){const t=y()??gt();t.hidden=false,f();}function xt(){if(document.getElementById(v))return;j(`
    #${l} {
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

    #${l}[hidden] {
      display: none;
    }

    .${d}__header,
    .${d}__controls {
      align-items: center;
      display: flex;
      gap: 8px;
    }

    .${d}__header {
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .${d}__controls {
      flex-wrap: wrap;
    }

    #${l} button,
    #${l} input {
      font: inherit;
    }

    #${l} button {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #111827;
      cursor: pointer;
      min-height: 28px;
      padding: 4px 9px;
    }

    #${l} button:hover:not(:disabled) {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    #${l} button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    #${l} label {
      align-items: center;
      display: inline-flex;
      gap: 5px;
    }

    #${l} input[type="number"] {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      min-height: 28px;
      padding: 3px 6px;
      width: 56px;
    }

    .${d}__status {
      color: #374151;
      margin: 10px 0 8px;
    }

    .${d}__output {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      box-sizing: border-box;
      font: 12px/1.45 ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
      height: 180px;
      resize: vertical;
      width: 100%;
    }
  `);const t=document.createElement("meta");t.id=v,document.head.append(t);}function L(){xt(),g("KHInsider直リンク抽出パネルを開く",m),g("KHInsider直リンク抽出を開始",()=>{m(),E();}),g("KHInsider音声ファイルを取得して保存",()=>{m(),D();}),m();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",L,{once:true}):L();

})();