// ==UserScript==
// @name         khinsider-direct-link-saver
// @namespace    khinsiderDirectLinkSaver
// @version      1.1.2
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

  var V=typeof GM_addStyle<"u"?GM_addStyle:void 0,z=typeof GM_download<"u"?GM_download:void 0,B=typeof GM_getValue<"u"?GM_getValue:void 0,Y=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,X=typeof GM_setClipboard<"u"?GM_setClipboard:void 0,W=typeof GM_setValue<"u"?GM_setValue:void 0,Q=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;function x(t,e){Y(t,e);}function j(t){V(t);}const R=Q;function q(t,e){W(t,e);}function A(t,e){return B(t,e)}function J(t,e){X(t,"text");}const d="khinsider-direct-link-saver",l=`${d}-panel`,U=`${d}-styles`,I=`${d}:links`,G=`${d}:concurrency`,b=4,N=1,P=12,D=3e4,Z="mp3",tt=["flac","m4a","aac","mp3"],L={flac:3,m4a:2,aac:2,mp3:1};let p=0,h=0,s=[];function S(t){return Number.isFinite(t)?Math.min(P,Math.max(N,Math.floor(t))):b}function E(){return S(A(G,b)??b)}function et(t){q(G,S(t));}function $(){return A(I,[])??[]}function _(t){q(I,t);}function C(t){try{const e=new URL(t,window.location.href),o=decodeURIComponent(e.pathname).toLowerCase();return tt.find(r=>o.endsWith(`.${r}`))??null}catch{return null}}function nt(t){try{const e=new URL(t.href,window.location.href);return e.hostname===window.location.hostname&&C(e.href)===Z}catch{return  false}}function T(t){return t.replace(/\s+/g," ").trim()}function ot(t,e){const o=T(t.textContent??"");if(o.length>0&&!/^\d+:\d+$/.test(o)&&!/^\d+(?:\.\d+)?\s*(?:kb|mb|gb)$/i.test(o))return o;const n=t.closest("tr"),r=n?T(n.textContent??""):"";return r.length>0?r:`track-${String(e+1).padStart(2,"0")}`}function rt(){const t=new Set,e=[];for(const o of Array.from(document.querySelectorAll("a[href]"))){if(!nt(o))continue;const n=new URL(o.href,window.location.href);n.hash="";const r=n.href;t.has(r)||(t.add(r),e.push({index:e.length,title:ot(o,e.length),url:r}));}return e}function at(t){return new Promise((e,o)=>{R({method:"GET",url:t,timeout:D,responseType:"text",onload:n=>{e({status:n.status,statusText:n.statusText,responseText:n.responseText,finalUrl:n.finalUrl,headers:n.responseHeaders});},onerror:n=>{const r=typeof n.error=="string"?n.error:"request failed";o(new Error(r));},ontimeout:()=>{o(new Error("request timeout"));}});})}function it(t,e){return new Promise((o,n)=>{R({method:"HEAD",url:t,headers:{Referer:e},timeout:D,onload:r=>{o({status:r.status,statusText:r.statusText,finalUrl:r.finalUrl,headers:r.responseHeaders});},onerror:r=>{const a=typeof r.error=="string"?r.error:"request failed";n(new Error(a));},ontimeout:()=>{n(new Error("HEAD request timeout"));}});})}function st(t){return new DOMParser().parseFromString(t,"text/html")}function dt(t,e){const o=[],n=new Set;function r(a){if(!a)return;const i=new URL(a,e),m=C(i.href);!m||n.has(i.href)||(n.add(i.href),o.push({url:i.href,extension:m}));}for(const a of Array.from(t.querySelectorAll(".songDownloadLink")))r(a.closest("a[href]")?.getAttribute("href")??null);for(const a of Array.from(t.querySelectorAll("audio[src]")))r(a.getAttribute("src"));return o}function ct(t){return t.reduce((e,o)=>{if(!e)return o;const n=L[e.extension];return L[o.extension]>n?o:e},null)}async function lt(t){const e=await at(t.url);if(e.status<200||e.status>=300)throw new Error(`HTTP ${e.status} ${e.statusText}`);const o=st(e.responseText),n=ct(dt(o,e.finalUrl||t.url));return n?{...t,state:"done",directUrl:n.url,extension:n.extension,error:null}:{...t,state:"skipped",directUrl:null,extension:null,error:"音声ファイルの直リンクが見つかりません"}}function ut(t){return t.map(e=>({...e,state:"pending",directUrl:null,extension:null,error:null}))}async function O(t,e,o){let n=0;async function r(){for(;n<t.length;){const i=n;n+=1,await o(t[i],i);}}const a=Math.min(e,t.length);await Promise.all(Array.from({length:a},()=>r()));}function v(t){return t.filter(e=>e.state==="done"&&e.directUrl!==null&&e.extension!==null).map(e=>({title:e.title,trackPageUrl:e.url,directUrl:e.directUrl,extension:e.extension}))}function H(t){return t.map(e=>e.directUrl).join(`
`)}function ft(t){const e=new Set(["<",">",":",'"',"/","\\","|","?","*"]),o=t.split("").map(n=>e.has(n)||n.charCodeAt(0)<32?"_":n).join("").replace(/\s+/g," ").trim();return o.length>0?o:"track"}function pt(t,e){return `${String(e+1).padStart(2,"0")} ${ft(t.title)}.${t.extension}`}function ht(t,e){const o=e.toLowerCase(),n=t.split(/\r?\n/).find(r=>r.toLowerCase().startsWith(`${o}:`));return n?n.slice(n.indexOf(":")+1).trim():null}function mt(t,e){if(t.status<200||t.status>=300)throw new Error(`HTTP ${t.status} ${t.statusText}`);const o=ht(t.headers,"content-type")??"";if(/text\/html/i.test(o))throw new Error("HTMLが返されたため音声ファイルとして保存できません");if(!C(t.finalUrl||e.directUrl))throw new Error("音声ファイルURLではないレスポンスにリダイレクトされました")}function g(){return document.getElementById(l)}function c(t){const e=g()?.querySelector('[data-role="status"]');e&&(e.textContent=t);}function f(){const t=g();if(!t)return;const e=s.length>0?v(s):$(),o=t.querySelector('[data-role="output"]'),n=t.querySelector('[data-action="copy"]'),r=t.querySelector('[data-action="clear"]'),a=t.querySelector('[data-action="download"]');o&&(o.value=H(e)),n&&(n.disabled=e.length===0),r&&(r.disabled=e.length===0),a&&(a.disabled=e.length===0);}function w(t){const e=t.filter(i=>i.state==="done").length,o=t.filter(i=>i.state==="failed").length,n=t.filter(i=>i.state==="skipped").length,r=e+o+n,a=t.length;c(`取得中: ${r}/${a} 保存 ${e} 失敗 ${o} スキップ ${n}`),f();}function u(t){const e=g();if(!e)return;e.querySelector('[data-action="start"]')?.toggleAttribute("disabled",t),e.querySelector('[data-action="start-download"]')?.toggleAttribute("disabled",t),e.querySelector('[data-action="stop"]')?.toggleAttribute("disabled",!t),e.querySelector('[data-action="download"]')?.toggleAttribute("disabled",t);const o=e.querySelector('[data-role="concurrency"]');o&&(o.disabled=t),t||f();}async function M(){const t=p+1;p=t;const e=rt();if(e.length===0)return s=[],_([]),f(),c("末尾が.mp3の曲ページリンクが見つかりません"),[];const o=E();if(s=ut(e),u(true),w(s),await O(e,o,async(r,a)=>{if(p===t){s[a]={...s[a],state:"running"},w(s);try{s[a]=await lt(r);}catch(i){const m=i instanceof Error?i.message:"unknown error";s[a]={...r,state:"failed",directUrl:null,extension:null,error:m};}w(s);}}),p!==t)return c("停止しました"),u(false),[];const n=v(s);return _(n),f(),c(`完了: ${n.length}/${e.length}件の直リンクを保存しました`),u(false),n}function yt(){p+=1,u(false),c("停止しました。進行中のリクエストは完了後に破棄されます");}function gt(){const t=s.length>0?v(s):$();J(H(t)),c(`${t.length}件の直リンクをコピーしました`);}function xt(){s=[],_([]),f(),c("保存済みリンクを削除しました");}function wt(t,e){return new Promise((o,n)=>{(async()=>{const r=await it(t.directUrl,t.trackPageUrl);mt(r,t),z({url:r.finalUrl||t.directUrl,name:e,saveAs:false,onload:()=>{o();},onerror:a=>{n(new Error(`download failed: ${a.error}`));},ontimeout:()=>{n(new Error("download timeout"));}});})().catch(r=>{n(r instanceof Error?r:new Error("download failed"));});})}async function F(t=$()){const e=h+1;if(h=e,t.length===0){c("保存対象の音声リンクがありません");return}const o=E();let n=0,r=0;if(u(true),c(`ダウンロード中: 0/${t.length}`),await O(t,o,async(a,i)=>{if(h===e){try{await wt(a,pt(a,i)),n+=1;}catch{r+=1;}c(`ダウンロード中: ${n+r}/${t.length} 完了 ${n} 失敗 ${r}`);}}),h!==e){c("ダウンロードを停止しました"),u(false);return}c(`ダウンロード完了: 完了 ${n} 失敗 ${r}`),u(false);}async function K(){const t=await M();t.length>0&&await F(t);}function bt(){const t=document.createElement("section");t.id=l,t.innerHTML=`
    <div class="${d}__header">
      <strong>KHInsider Direct Links</strong>
      <button type="button" data-action="hide" title="閉じる">×</button>
    </div>
    <div class="${d}__controls">
      <label>
        並列
        <input type="number" min="${N}" max="${P}" step="1" value="${E()}" data-role="concurrency">
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
  `,t.querySelector('[data-action="start"]')?.addEventListener("click",()=>{M();}),t.querySelector('[data-action="start-download"]')?.addEventListener("click",()=>{K();}),t.querySelector('[data-action="download"]')?.addEventListener("click",()=>{F();}),t.querySelector('[data-action="stop"]')?.addEventListener("click",()=>{yt(),h+=1;}),t.querySelector('[data-action="copy"]')?.addEventListener("click",gt),t.querySelector('[data-action="clear"]')?.addEventListener("click",xt),t.querySelector('[data-action="hide"]')?.addEventListener("click",()=>{t.hidden=true;});const e=t.querySelector('[data-role="concurrency"]');return e?.addEventListener("change",()=>{const o=S(Number(e.value));e.value=String(o),et(o);}),document.body.append(t),f(),t}function y(){const t=g()??bt();t.hidden=false,f();}function _t(){if(document.getElementById(U))return;j(`
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
  `);const t=document.createElement("meta");t.id=U,document.head.append(t);}function k(){_t(),x("KHInsider直リンク抽出パネルを開く",y),x("KHInsider直リンク抽出を開始",()=>{y(),M();}),x("KHInsider音声ファイルを取得して保存",()=>{y(),K();}),y();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",k,{once:true}):k();

})();