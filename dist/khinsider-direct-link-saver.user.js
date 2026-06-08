// ==UserScript==
// @name         khinsider-direct-link-saver
// @namespace    khinsiderDirectLinkSaver
// @version      1.1.1
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

  var B=typeof GM_addStyle<"u"?GM_addStyle:void 0,F=typeof GM_download<"u"?GM_download:void 0,K=typeof GM_getValue<"u"?GM_getValue:void 0,V=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,Y=typeof GM_setClipboard<"u"?GM_setClipboard:void 0,j=typeof GM_setValue<"u"?GM_setValue:void 0,W=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;function x(t,e){V(t,e);}function X(t){B(t);}const k=W;function R(t,e){j(t,e);}function I(t,e){return K(t,e)}function Q(t,e){Y(t,"text");}const c="khinsider-direct-link-saver",l=`${c}-panel`,U=`${c}-styles`,q=`${c}:links`,A=`${c}:concurrency`,w=4,G=1,N=12,J=3e4,Z=12e4,tt="mp3",et=["flac","m4a","aac","mp3"],L={flac:3,m4a:2,aac:2,mp3:1};let p=0,h=0,s=[];function _(t){return Number.isFinite(t)?Math.min(N,Math.max(G,Math.floor(t))):w}function S(){return _(I(A,w)??w)}function nt(t){R(A,_(t));}function E(){return I(q,[])??[]}function g(t){R(q,t);}function $(t){try{const e=new URL(t,window.location.href),o=decodeURIComponent(e.pathname).toLowerCase();return et.find(r=>o.endsWith(`.${r}`))??null}catch{return null}}function ot(t){try{const e=new URL(t.href,window.location.href);return e.hostname===window.location.hostname&&$(e.href)===tt}catch{return  false}}function T(t){return t.replace(/\s+/g," ").trim()}function rt(t,e){const o=T(t.textContent??"");if(o.length>0&&!/^\d+:\d+$/.test(o)&&!/^\d+(?:\.\d+)?\s*(?:kb|mb|gb)$/i.test(o))return o;const n=t.closest("tr"),r=n?T(n.textContent??""):"";return r.length>0?r:`track-${String(e+1).padStart(2,"0")}`}function at(){const t=new Set,e=[];for(const o of Array.from(document.querySelectorAll("a[href]"))){if(!ot(o))continue;const n=new URL(o.href,window.location.href);n.hash="";const r=n.href;t.has(r)||(t.add(r),e.push({index:e.length,title:rt(o,e.length),url:r}));}return e}function it(t){return new Promise((e,o)=>{k({method:"GET",url:t,timeout:J,responseType:"text",onload:n=>{e({status:n.status,statusText:n.statusText,responseText:n.responseText,finalUrl:n.finalUrl});},onerror:n=>{const r=typeof n.error=="string"?n.error:"request failed";o(new Error(r));},ontimeout:()=>{o(new Error("request timeout"));}});})}function st(t,e){return new Promise((o,n)=>{k({method:"GET",url:t,headers:{Referer:e},timeout:Z,responseType:"blob",onload:r=>{o({status:r.status,statusText:r.statusText,response:r.response,finalUrl:r.finalUrl,headers:r.responseHeaders});},onerror:r=>{const a=typeof r.error=="string"?r.error:"request failed";n(new Error(a));},ontimeout:()=>{n(new Error("download request timeout"));}});})}function ct(t){return new DOMParser().parseFromString(t,"text/html")}function dt(t,e){const o=[],n=new Set;for(const r of Array.from(t.querySelectorAll("a[href]"))){const a=new URL(r.getAttribute("href")??"",e),i=$(a.href);!i||n.has(a.href)||(n.add(a.href),o.push({url:a.href,extension:i}));}return o}function lt(t){return t.reduce((e,o)=>{if(!e)return o;const n=L[e.extension];return L[o.extension]>n?o:e},null)}async function ut(t){const e=await it(t.url);if(e.status<200||e.status>=300)throw new Error(`HTTP ${e.status} ${e.statusText}`);const o=ct(e.responseText),n=lt(dt(o,e.finalUrl||t.url));return n?{...t,state:"done",directUrl:n.url,extension:n.extension,error:null}:{...t,state:"skipped",directUrl:null,extension:null,error:"音声ファイルの直リンクが見つかりません"}}function ft(t){return t.map(e=>({...e,state:"pending",directUrl:null,extension:null,error:null}))}async function O(t,e,o){let n=0;async function r(){for(;n<t.length;){const i=n;n+=1,await o(t[i],i);}}const a=Math.min(e,t.length);await Promise.all(Array.from({length:a},()=>r()));}function v(t){return t.filter(e=>e.state==="done"&&e.directUrl!==null&&e.extension!==null).map(e=>({title:e.title,trackPageUrl:e.url,directUrl:e.directUrl,extension:e.extension}))}function P(t){return t.map(e=>e.directUrl).join(`
`)}function pt(t){const e=new Set(["<",">",":",'"',"/","\\","|","?","*"]),o=t.split("").map(n=>e.has(n)||n.charCodeAt(0)<32?"_":n).join("").replace(/\s+/g," ").trim();return o.length>0?o:"track"}function ht(t,e){return `${String(e+1).padStart(2,"0")} ${pt(t.title)}.${t.extension}`}function mt(t,e){const o=e.toLowerCase(),n=t.split(/\r?\n/).find(r=>r.toLowerCase().startsWith(`${o}:`));return n?n.slice(n.indexOf(":")+1).trim():null}async function yt(t){const e=await t.slice(0,512).text();return /^\s*(?:<!doctype\s+html|<html|<head|<body)/i.test(e)}async function xt(t,e){if(t.status<200||t.status>=300)throw new Error(`HTTP ${t.status} ${t.statusText}`);const o=mt(t.headers,"content-type")??t.response.type;if(/text\/html/i.test(o)||await yt(t.response))throw new Error("HTMLが返されたため音声ファイルとして保存できません");if(t.response.size===0)throw new Error("空のファイルが返されました");if(!$(t.finalUrl||e.directUrl))throw new Error("音声ファイルURLではないレスポンスにリダイレクトされました")}function y(){return document.getElementById(l)}function d(t){const e=y()?.querySelector('[data-role="status"]');e&&(e.textContent=t);}function f(){const t=y();if(!t)return;const e=s.length>0?v(s):E(),o=t.querySelector('[data-role="output"]'),n=t.querySelector('[data-action="copy"]'),r=t.querySelector('[data-action="clear"]'),a=t.querySelector('[data-action="download"]');o&&(o.value=P(e)),n&&(n.disabled=e.length===0),r&&(r.disabled=e.length===0),a&&(a.disabled=e.length===0);}function b(t){const e=t.filter(i=>i.state==="done").length,o=t.filter(i=>i.state==="failed").length,n=t.filter(i=>i.state==="skipped").length,r=e+o+n,a=t.length;d(`取得中: ${r}/${a} 保存 ${e} 失敗 ${o} スキップ ${n}`),f();}function u(t){const e=y();if(!e)return;e.querySelector('[data-action="start"]')?.toggleAttribute("disabled",t),e.querySelector('[data-action="start-download"]')?.toggleAttribute("disabled",t),e.querySelector('[data-action="stop"]')?.toggleAttribute("disabled",!t),e.querySelector('[data-action="download"]')?.toggleAttribute("disabled",t);const o=e.querySelector('[data-role="concurrency"]');o&&(o.disabled=t),t||f();}async function C(){const t=p+1;p=t;const e=at();if(e.length===0)return s=[],g([]),f(),d("末尾が.mp3の曲ページリンクが見つかりません"),[];const o=S();if(s=ft(e),u(true),b(s),await O(e,o,async(r,a)=>{if(p===t){s[a]={...s[a],state:"running"},b(s);try{s[a]=await ut(r);}catch(i){const z=i instanceof Error?i.message:"unknown error";s[a]={...r,state:"failed",directUrl:null,extension:null,error:z};}b(s);}}),p!==t)return d("停止しました"),u(false),[];const n=v(s);return g(n),f(),d(`完了: ${n.length}/${e.length}件の直リンクを保存しました`),u(false),n}function bt(){p+=1,u(false),d("停止しました。進行中のリクエストは完了後に破棄されます");}function wt(){const t=s.length>0?v(s):E();Q(P(t)),d(`${t.length}件の直リンクをコピーしました`);}function gt(){s=[],g([]),f(),d("保存済みリンクを削除しました");}function _t(t,e){return new Promise((o,n)=>{(async()=>{const r=await st(t.directUrl,t.trackPageUrl);await xt(r,t);const a=URL.createObjectURL(r.response);F({url:a,name:e,saveAs:false,onload:()=>{URL.revokeObjectURL(a),o();},onerror:i=>{URL.revokeObjectURL(a),n(new Error(`download failed: ${i.error}`));},ontimeout:()=>{URL.revokeObjectURL(a),n(new Error("download timeout"));}});})().catch(r=>{n(r instanceof Error?r:new Error("download failed"));});})}async function D(t=E()){const e=h+1;if(h=e,t.length===0){d("保存対象の音声リンクがありません");return}const o=S();let n=0,r=0;if(u(true),d(`ダウンロード中: 0/${t.length}`),await O(t,o,async(a,i)=>{if(h===e){try{await _t(a,ht(a,i)),n+=1;}catch{r+=1;}d(`ダウンロード中: ${n+r}/${t.length} 完了 ${n} 失敗 ${r}`);}}),h!==e){d("ダウンロードを停止しました"),u(false);return}d(`ダウンロード完了: 完了 ${n} 失敗 ${r}`),u(false);}async function H(){const t=await C();t.length>0&&await D(t);}function St(){const t=document.createElement("section");t.id=l,t.innerHTML=`
    <div class="${c}__header">
      <strong>KHInsider Direct Links</strong>
      <button type="button" data-action="hide" title="閉じる">×</button>
    </div>
    <div class="${c}__controls">
      <label>
        並列
        <input type="number" min="${G}" max="${N}" step="1" value="${S()}" data-role="concurrency">
      </label>
      <button type="button" data-action="start">取得</button>
      <button type="button" data-action="start-download">取得して保存</button>
      <button type="button" data-action="download">保存</button>
      <button type="button" data-action="stop" disabled>停止</button>
      <button type="button" data-action="copy">コピー</button>
      <button type="button" data-action="clear">削除</button>
    </div>
    <div class="${c}__status" data-role="status">待機中</div>
    <textarea class="${c}__output" data-role="output" spellcheck="false"></textarea>
  `,t.querySelector('[data-action="start"]')?.addEventListener("click",()=>{C();}),t.querySelector('[data-action="start-download"]')?.addEventListener("click",()=>{H();}),t.querySelector('[data-action="download"]')?.addEventListener("click",()=>{D();}),t.querySelector('[data-action="stop"]')?.addEventListener("click",()=>{bt(),h+=1;}),t.querySelector('[data-action="copy"]')?.addEventListener("click",wt),t.querySelector('[data-action="clear"]')?.addEventListener("click",gt),t.querySelector('[data-action="hide"]')?.addEventListener("click",()=>{t.hidden=true;});const e=t.querySelector('[data-role="concurrency"]');return e?.addEventListener("change",()=>{const o=_(Number(e.value));e.value=String(o),nt(o);}),document.body.append(t),f(),t}function m(){const t=y()??St();t.hidden=false,f();}function Et(){if(document.getElementById(U))return;X(`
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
  `);const t=document.createElement("meta");t.id=U,document.head.append(t);}function M(){Et(),x("KHInsider直リンク抽出パネルを開く",m),x("KHInsider直リンク抽出を開始",()=>{m(),C();}),x("KHInsider音声ファイルを取得して保存",()=>{m(),H();}),m();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",M,{once:true}):M();

})();