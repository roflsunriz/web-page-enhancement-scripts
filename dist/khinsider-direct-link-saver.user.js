// ==UserScript==
// @name         khinsider-direct-link-saver
// @namespace    khinsiderDirectLinkSaver
// @version      1.3.0
// @author       roflsunriz
// @description  KHInsiderのアルバムページから音声ファイルを並列ダウンロード
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
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  var O=typeof GM_addStyle<"u"?GM_addStyle:void 0,H=typeof GM_download<"u"?GM_download:void 0,V=typeof GM_getValue<"u"?GM_getValue:void 0,X=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,F=typeof GM_setValue<"u"?GM_setValue:void 0,z=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;function M(e,t){X(e,t);}function B(e){O(e);}const q=z;function K(e,t){F(e,t);}function Y(e,t){return V(e,t)}const a="khinsider-direct-link-saver",c=`${a}-panel`,T=`${a}-styles`,I=`${a}:concurrency`,b=4,L=1,P=12,N=3e4,W="mp3",Q=["flac","m4a","aac","mp3"],U={flac:3,m4a:2,aac:2,mp3:1};let m=0,g=0,d=[];function $(e){return Number.isFinite(e)?Math.min(P,Math.max(L,Math.floor(e))):b}function v(){return $(Y(I,b)??b)}function J(e){K(I,$(e));}function S(e){try{const t=new URL(e,window.location.href),r=decodeURIComponent(t.pathname).toLowerCase();return Q.find(o=>r.endsWith(`.${o}`))??null}catch{return null}}function Z(e){try{const t=new URL(e.href,window.location.href);return t.hostname===window.location.hostname&&S(t.href)===W}catch{return  false}}function A(e){return e.replace(/\s+/g," ").trim()}function j(e,t){const r=A(e.textContent??"");if(r.length>0&&!/^\d+:\d+$/.test(r)&&!/^\d+(?:\.\d+)?\s*(?:kb|mb|gb)$/i.test(r))return r;const n=e.closest("tr"),o=n?A(n.textContent??""):"";return o.length>0?o:`track-${String(t+1).padStart(2,"0")}`}function ee(){const e=new Set,t=[];for(const r of Array.from(document.querySelectorAll("a[href]"))){if(!Z(r))continue;const n=new URL(r.href,window.location.href);n.hash="";const o=n.href;e.has(o)||(e.add(o),t.push({index:t.length,title:j(r,t.length),url:o}));}return t}function te(e){return new Promise((t,r)=>{q({method:"GET",url:e,timeout:N,responseType:"text",onload:n=>{t({status:n.status,statusText:n.statusText,responseText:n.responseText,finalUrl:n.finalUrl,headers:n.responseHeaders});},onerror:n=>{const o=typeof n.error=="string"?n.error:"request failed";r(new Error(o));},ontimeout:()=>{r(new Error("request timeout"));}});})}function ne(e,t){return new Promise((r,n)=>{q({method:"HEAD",url:e,headers:{Referer:t},timeout:N,onload:o=>{r({status:o.status,statusText:o.statusText,finalUrl:o.finalUrl,headers:o.responseHeaders});},onerror:o=>{const i=typeof o.error=="string"?o.error:"request failed";n(new Error(i));},ontimeout:()=>{n(new Error("HEAD request timeout"));}});})}function re(e){return new DOMParser().parseFromString(e,"text/html")}function oe(e,t){const r=[],n=new Set;function o(i){if(!i)return;const s=new URL(i,t),l=S(s.href);!l||n.has(s.href)||(n.add(s.href),r.push({url:s.href,extension:l}));}for(const i of Array.from(e.querySelectorAll(".songDownloadLink")))o(i.closest("a[href]")?.getAttribute("href")??null);for(const i of Array.from(e.querySelectorAll("audio[src]")))o(i.getAttribute("src"));return r}function ae(e){return e.reduce((t,r)=>{if(!t)return r;const n=U[t.extension];return U[r.extension]>n?r:t},null)}async function ie(e){const t=await te(e.url);if(t.status<200||t.status>=300)throw new Error(`HTTP ${t.status} ${t.statusText}`);const r=re(t.responseText),n=ae(oe(r,t.finalUrl||e.url));return n?{...e,state:"done",directUrl:n.url,extension:n.extension,error:null}:{...e,state:"skipped",directUrl:null,extension:null,error:"音声ファイルの直リンクが見つかりません"}}function se(e){return e.map(t=>({...t,state:"pending",directUrl:null,extension:null,error:null}))}async function k(e,t,r){let n=0;async function o(s){for(;n<e.length;){const l=n;n+=1,await r(e[l],l,s);}}const i=Math.min(t,e.length);await Promise.all(Array.from({length:i},(s,l)=>o(l)));}function le(e){return e.filter(t=>t.state==="done"&&t.directUrl!==null&&t.extension!==null).map(t=>({title:t.title,trackPageUrl:t.url,directUrl:t.directUrl,extension:t.extension}))}function de(e){const t=new Set(["<",">",":",'"',"/","\\","|","?","*"]),r=e.split("").map(n=>t.has(n)||n.charCodeAt(0)<32?"_":n).join("").replace(/\s+/g," ").trim();return r.length>0?r:"track"}function ce(e,t){return `${String(t+1).padStart(2,"0")} ${de(e.title)}.${e.extension}`}function ue(e,t){const r=t.toLowerCase(),n=e.split(/\r?\n/).find(o=>o.toLowerCase().startsWith(`${r}:`));return n?n.slice(n.indexOf(":")+1).trim():null}function fe(e,t){if(e.status<200||e.status>=300)throw new Error(`HTTP ${e.status} ${e.statusText}`);const r=ue(e.headers,"content-type")??"";if(/text\/html/i.test(r))throw new Error("HTMLが返されたため音声ファイルとして保存できません");if(!S(e.finalUrl||t.directUrl))throw new Error("音声ファイルURLではないレスポンスにリダイレクトされました")}function p(){return document.getElementById(c)}function u(e){const t=p()?.querySelector('[data-role="status"]');t&&(t.textContent=e);}function G(e,t,r){const n=p();if(!n)return;const o=n.querySelector('[data-role="progress"]'),i=n.querySelector('[data-role="overall-bar"]'),s=n.querySelector('[data-role="lanes"]'),l=Math.min(r,t);o&&(o.hidden=t===0,o.setAttribute("data-stage",e)),i&&(i.style.width="0%"),s&&s.replaceChildren(...Array.from({length:l},(E,C)=>{const h=document.createElement("div");return h.className=`${a}__lane`,h.dataset.lane=String(C),h.dataset.state="idle",h.title=`${e} worker ${C+1}`,h}));}function _(e,t){const r=p()?.querySelector('[data-role="overall-bar"]');if(!r)return;const n=t>0?Math.round(e/t*100):0;r.style.width=`${Math.min(100,Math.max(0,n))}%`;}function y(e,t){const r=p()?.querySelector(`[data-lane="${e}"]`);r&&(r.dataset.state=t);}function w(e){const t=e.filter(s=>s.state==="done").length,r=e.filter(s=>s.state==="failed").length,n=e.filter(s=>s.state==="skipped").length,o=t+r+n,i=e.length;_(o,i),u(`解析中: ${o}/${i} 保存対象 ${t} 失敗 ${r} スキップ ${n}`);}function f(e){const t=p();if(!t)return;t.querySelector('[data-action="start-download"]')?.toggleAttribute("disabled",e),t.querySelector('[data-action="stop"]')?.toggleAttribute("disabled",!e);const r=t.querySelector('[data-role="concurrency"]');r&&(r.disabled=e);}async function pe(){const e=m+1;m=e;const t=ee();if(t.length===0)return d=[],u("末尾が.mp3の曲ページリンクが見つかりません"),[];const r=v();if(d=se(t),f(true),G("解析",t.length,r),w(d),await k(t,r,async(o,i,s)=>{if(m===e){y(s,"active"),d[i]={...d[i],state:"running"},w(d);try{d[i]=await ie(o);}catch(l){const E=l instanceof Error?l.message:"unknown error";d[i]={...o,state:"failed",directUrl:null,extension:null,error:E};}y(s,d[i].state==="done"?"done":"failed"),w(d);}}),m!==e)return u("停止しました"),f(false),[];const n=le(d);return _(t.length,t.length),u(`解析完了: ${n.length}/${t.length}件の音声ファイルを見つけました`),f(false),n}function he(){m+=1,f(false),u("停止しました。進行中のリクエストは完了後に破棄されます");}function me(e,t){return new Promise((r,n)=>{(async()=>{const o=await ne(e.directUrl,e.trackPageUrl);fe(o,e),H({url:o.finalUrl||e.directUrl,name:t,saveAs:false,onload:()=>{r();},onerror:i=>{n(new Error(`download failed: ${i.error}`));},ontimeout:()=>{n(new Error("download timeout"));}});})().catch(o=>{n(o instanceof Error?o:new Error("download failed"));});})}async function ge(e){const t=g+1;if(g=t,e.length===0){u("保存対象の音声リンクがありません");return}const r=v();let n=0,o=0;if(f(true),G("ダウンロード",e.length,r),u(`ダウンロード中: 0/${e.length}`),await k(e,r,async(i,s,l)=>{if(g===t){y(l,"active");try{await me(i,ce(i,s)),n+=1,y(l,"done");}catch{o+=1,y(l,"failed");}_(n+o,e.length),u(`ダウンロード中: ${n+o}/${e.length} 完了 ${n} 失敗 ${o}`);}}),g!==t){u("ダウンロードを停止しました"),f(false);return}_(e.length,e.length),u(`ダウンロード完了: 完了 ${n} 失敗 ${o}`),f(false);}async function D(){const e=await pe();e.length>0&&await ge(e);}function ye(){const e=document.createElement("section");e.id=c,e.innerHTML=`
    <div class="${a}__header">
      <strong>KHInsider Audio Saver</strong>
      <button type="button" data-action="hide" title="閉じる">×</button>
    </div>
    <div class="${a}__controls">
      <label>
        並列
        <input type="number" min="${L}" max="${P}" step="1" value="${v()}" data-role="concurrency">
      </label>
      <button type="button" data-action="start-download">保存開始</button>
      <button type="button" data-action="stop" disabled>停止</button>
    </div>
    <div class="${a}__status" data-role="status">待機中</div>
    <div class="${a}__progress" data-role="progress" hidden>
      <div class="${a}__overall">
        <div class="${a}__overall-bar" data-role="overall-bar"></div>
      </div>
      <div class="${a}__lanes" data-role="lanes"></div>
    </div>
  `,e.querySelector('[data-action="start-download"]')?.addEventListener("click",()=>{D();}),e.querySelector('[data-action="stop"]')?.addEventListener("click",()=>{he(),g+=1;}),e.querySelector('[data-action="hide"]')?.addEventListener("click",()=>{e.hidden=true;});const t=e.querySelector('[data-role="concurrency"]');return t?.addEventListener("change",()=>{const r=$(Number(t.value));t.value=String(r),J(r);}),document.body.append(e),e}function x(){const e=p()??ye();e.hidden=false;}function _e(){if(document.getElementById(T))return;B(`
    #${c} {
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

    #${c}[hidden] {
      display: none;
    }

    .${a}__header,
    .${a}__controls {
      align-items: center;
      display: flex;
      gap: 8px;
    }

    .${a}__header {
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .${a}__controls {
      flex-wrap: wrap;
    }

    #${c} button,
    #${c} input {
      font: inherit;
    }

    #${c} button {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #111827;
      cursor: pointer;
      min-height: 28px;
      padding: 4px 9px;
    }

    #${c} button:hover:not(:disabled) {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    #${c} button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    #${c} label {
      align-items: center;
      display: inline-flex;
      gap: 5px;
    }

    #${c} input[type="number"] {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      min-height: 28px;
      padding: 3px 6px;
      width: 56px;
    }

    .${a}__status {
      color: #374151;
      margin-top: 10px;
    }

    .${a}__progress {
      margin-top: 10px;
    }

    .${a}__progress[hidden] {
      display: none;
    }

    .${a}__overall {
      background: #e5e7eb;
      border-radius: 999px;
      height: 8px;
      overflow: hidden;
      width: 100%;
    }

    .${a}__overall-bar {
      background: #2563eb;
      height: 100%;
      transition: width 180ms ease;
      width: 0%;
    }

    .${a}__lanes {
      display: grid;
      gap: 4px;
      grid-template-columns: repeat(auto-fit, minmax(28px, 1fr));
      margin-top: 8px;
    }

    .${a}__lane {
      background: #e5e7eb;
      border-radius: 999px;
      height: 6px;
      overflow: hidden;
      position: relative;
    }

    .${a}__lane::before {
      background: #9ca3af;
      content: "";
      inset: 0;
      position: absolute;
      transform: translateX(-100%);
    }

    .${a}__lane[data-state="active"]::before {
      animation: ${a}-lane 850ms linear infinite;
      background: linear-gradient(90deg, transparent, #2563eb, transparent);
      width: 80%;
    }

    .${a}__lane[data-state="done"]::before {
      background: #16a34a;
      transform: translateX(0);
    }

    .${a}__lane[data-state="failed"]::before {
      background: #dc2626;
      transform: translateX(0);
    }

    @keyframes ${a}-lane {
      from {
        transform: translateX(-100%);
      }

      to {
        transform: translateX(140%);
      }
    }
  `);const e=document.createElement("meta");e.id=T,document.head.append(e);}function R(){_e(),M("KHInsider音声保存パネルを開く",x),M("KHInsider音声ファイルを取得して保存",()=>{x(),D();}),x();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",R,{once:true}):R();

})();