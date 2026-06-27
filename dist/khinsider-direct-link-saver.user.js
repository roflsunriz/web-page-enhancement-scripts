// ==UserScript==
// @name         khinsider-direct-link-saver
// @namespace    khinsiderDirectLinkSaver
// @version      1.4.0
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

  var B=typeof GM_addStyle<"u"?GM_addStyle:void 0,Y=typeof GM_download<"u"?GM_download:void 0,j=typeof GM_getValue<"u"?GM_getValue:void 0,W=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,Q=typeof GM_setValue<"u"?GM_setValue:void 0,Z=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;function U(e,t){W(e,t);}function J(e){B(e);}const N=Z;function ee(e,t){Q(e,t);}function te(e,t){return j(e,t)}const ne=new Set(["ar","ur"]);function oe(e){return ne.has(e)?"rtl":"ltr"}function re(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(n,o)=>{const r=t[o];return r===void 0?n:String(r)})}function ae(e){const t=Object.keys(e.translations);let n=e.defaultLocale;const o=l=>{const d=l.toLowerCase(),g=e.aliases?.[d];if(g)return g;const S=t.find(T=>T.toLowerCase()===d);if(S)return S;const z=d.split("-")[0];return t.find(T=>T.toLowerCase().split("-")[0]===z)??null},r=()=>{const l=navigator.languages.length>0?navigator.languages:[navigator.language];for(const d of l){const g=o(d);if(g)return g}return e.fallbackLocale},a=l=>{const d=e.translations[n]?.[l];if(d)return d;const g=e.translations[e.fallbackLocale]?.[l];return g||(e.translations[e.defaultLocale]?.[l]??l)};return {locales:t,getLocale:()=>n,setLocale:l=>{n=l;},detectBrowserLocale:r,t:a,format:(l,d)=>re(a(l),d),getTranslations:(l=n)=>e.translations[l]??e.translations[e.fallbackLocale],getDirection:(l=n)=>oe(l),getMissingTranslationKeys:l=>{const d=e.translations[e.fallbackLocale],g=e.translations[l];return Object.keys(d).filter(S=>!g[S])}}}const se={ja:{close:"閉じる",concurrency:"並列",startSave:"保存開始",stop:"停止",idle:"待機中",openPanel:"KHInsider音声保存パネルを開く",fetchAndSave:"KHInsider音声ファイルを取得して保存",noTrackLinks:"末尾が.mp3の曲ページリンクが見つかりません",noDirectAudio:"音声ファイルの直リンクが見つかりません",htmlResponse:"HTMLが返されたため音声ファイルとして保存できません",nonAudioRedirect:"音声ファイルURLではないレスポンスにリダイレクトされました",parsingStage:"解析",downloadStage:"ダウンロード",parsingProgress:"解析中: {completed}/{total} 保存対象 {done} 失敗 {failed} スキップ {skipped}",stopped:"停止しました",parsingComplete:"解析完了: {found}/{total}件の音声ファイルを見つけました",stopPending:"停止しました。進行中のリクエストは完了後に破棄されます",noAudioLinks:"保存対象の音声リンクがありません",downloading:"ダウンロード中: {completed}/{total}",downloadProgress:"ダウンロード中: {processed}/{total} 完了 {completed} 失敗 {failed}",downloadStopped:"ダウンロードを停止しました",downloadComplete:"ダウンロード完了: 完了 {completed} 失敗 {failed}"},en:{close:"Close",concurrency:"Concurrency",startSave:"Start saving",stop:"Stop",idle:"Idle",openPanel:"Open KHInsider audio saver panel",fetchAndSave:"Fetch and save KHInsider audio files",noTrackLinks:"No track page links ending in .mp3 were found",noDirectAudio:"No direct audio file link was found",htmlResponse:"HTML was returned, so it cannot be saved as an audio file",nonAudioRedirect:"Redirected to a response that is not an audio file URL",parsingStage:"Parsing",downloadStage:"Download",parsingProgress:"Parsing: {completed}/{total} targets {done} failed {failed} skipped {skipped}",stopped:"Stopped",parsingComplete:"Parsing complete: found {found}/{total} audio files",stopPending:"Stopped. In-flight requests will be discarded after they finish",noAudioLinks:"There are no audio links to save",downloading:"Downloading: {completed}/{total}",downloadProgress:"Downloading: {processed}/{total} complete {completed} failed {failed}",downloadStopped:"Download stopped",downloadComplete:"Download complete: complete {completed} failed {failed}"}},v=ae({translations:se,defaultLocale:"ja",fallbackLocale:"en"});v.setLocale(v.detectBrowserLocale());const u=v.t,b=v.format,ie=v.getDirection,s="khinsider-direct-link-saver",p=`${s}-panel`,P=`${s}-styles`,G=`${s}:concurrency`,k=4,O=1,H=12,K=3e4,le="mp3",de=["flac","m4a","aac","mp3"],I={flac:3,m4a:2,aac:2,mp3:1};let y=0,_=0,f=[];function A(e){return Number.isFinite(e)?Math.min(H,Math.max(O,Math.floor(e))):k}function M(){return A(te(G,k)??k)}function ce(e){ee(G,A(e));}function R(e){try{const t=new URL(e,window.location.href),n=decodeURIComponent(t.pathname).toLowerCase();return de.find(r=>n.endsWith(`.${r}`))??null}catch{return null}}function ue(e){try{const t=new URL(e.href,window.location.href);return t.hostname===window.location.hostname&&R(t.href)===le}catch{return  false}}function D(e){return e.replace(/\s+/g," ").trim()}function fe(e,t){const n=D(e.textContent??"");if(n.length>0&&!/^\d+:\d+$/.test(n)&&!/^\d+(?:\.\d+)?\s*(?:kb|mb|gb)$/i.test(n))return n;const o=e.closest("tr"),r=o?D(o.textContent??""):"";return r.length>0?r:`track-${String(t+1).padStart(2,"0")}`}function pe(){const e=new Set,t=[];for(const n of Array.from(document.querySelectorAll("a[href]"))){if(!ue(n))continue;const o=new URL(n.href,window.location.href);o.hash="";const r=o.href;e.has(r)||(e.add(r),t.push({index:t.length,title:fe(n,t.length),url:r}));}return t}function ge(e){return new Promise((t,n)=>{N({method:"GET",url:e,timeout:K,responseType:"text",onload:o=>{t({status:o.status,statusText:o.statusText,responseText:o.responseText,finalUrl:o.finalUrl,headers:o.responseHeaders});},onerror:o=>{const r=typeof o.error=="string"?o.error:"request failed";n(new Error(r));},ontimeout:()=>{n(new Error("request timeout"));}});})}function me(e,t){return new Promise((n,o)=>{N({method:"HEAD",url:e,headers:{Referer:t},timeout:K,onload:r=>{n({status:r.status,statusText:r.statusText,finalUrl:r.finalUrl,headers:r.responseHeaders});},onerror:r=>{const a=typeof r.error=="string"?r.error:"request failed";o(new Error(a));},ontimeout:()=>{o(new Error("HEAD request timeout"));}});})}function he(e){return new DOMParser().parseFromString(e,"text/html")}function we(e,t){const n=[],o=new Set;function r(a){if(!a)return;const i=new URL(a,t),c=R(i.href);!c||o.has(i.href)||(o.add(i.href),n.push({url:i.href,extension:c}));}for(const a of Array.from(e.querySelectorAll(".songDownloadLink")))r(a.closest("a[href]")?.getAttribute("href")??null);for(const a of Array.from(e.querySelectorAll("audio[src]")))r(a.getAttribute("src"));return n}function ye(e){return e.reduce((t,n)=>{if(!t)return n;const o=I[t.extension];return I[n.extension]>o?n:t},null)}async function _e(e){const t=await ge(e.url);if(t.status<200||t.status>=300)throw new Error(`HTTP ${t.status} ${t.statusText}`);const n=he(t.responseText),o=ye(we(n,t.finalUrl||e.url));return o?{...e,state:"done",directUrl:o.url,extension:o.extension,error:null}:{...e,state:"skipped",directUrl:null,extension:null,error:u("noDirectAudio")}}function be(e){return e.map(t=>({...t,state:"pending",directUrl:null,extension:null,error:null}))}async function F(e,t,n){let o=0;async function r(i){for(;o<e.length;){const c=o;o+=1,await n(e[c],c,i);}}const a=Math.min(t,e.length);await Promise.all(Array.from({length:a},(i,c)=>r(c)));}function xe(e){return e.filter(t=>t.state==="done"&&t.directUrl!==null&&t.extension!==null).map(t=>({title:t.title,trackPageUrl:t.url,directUrl:t.directUrl,extension:t.extension}))}function ve(e){const t=new Set(["<",">",":",'"',"/","\\","|","?","*"]),n=e.split("").map(o=>t.has(o)||o.charCodeAt(0)<32?"_":o).join("").replace(/\s+/g," ").trim();return n.length>0?n:"track"}function Se(e,t){return `${String(t+1).padStart(2,"0")} ${ve(e.title)}.${e.extension}`}function $e(e,t){const n=t.toLowerCase(),o=e.split(/\r?\n/).find(r=>r.toLowerCase().startsWith(`${n}:`));return o?o.slice(o.indexOf(":")+1).trim():null}function Ce(e,t){if(e.status<200||e.status>=300)throw new Error(`HTTP ${e.status} ${e.statusText}`);const n=$e(e.headers,"content-type")??"";if(/text\/html/i.test(n))throw new Error(u("htmlResponse"));if(!R(e.finalUrl||t.directUrl))throw new Error(u("nonAudioRedirect"))}function w(){return document.getElementById(p)}function m(e){const t=w()?.querySelector('[data-role="status"]');t&&(t.textContent=e);}function V(e,t,n){const o=w();if(!o)return;const r=o.querySelector('[data-role="progress"]'),a=o.querySelector('[data-role="overall-bar"]'),i=o.querySelector('[data-role="lanes"]'),c=Math.min(n,t);r&&(r.hidden=t===0,r.setAttribute("data-stage",e)),a&&(a.style.width="0%"),i&&i.replaceChildren(...Array.from({length:c},(C,l)=>{const d=document.createElement("div");return d.className=`${s}__lane`,d.dataset.lane=String(l),d.dataset.state="idle",d.title=`${e} worker ${l+1}`,d}));}function $(e,t){const n=w()?.querySelector('[data-role="overall-bar"]');if(!n)return;const o=t>0?Math.round(e/t*100):0;n.style.width=`${Math.min(100,Math.max(0,o))}%`;}function x(e,t){const n=w()?.querySelector(`[data-lane="${e}"]`);n&&(n.dataset.state=t);}function L(e){const t=e.filter(i=>i.state==="done").length,n=e.filter(i=>i.state==="failed").length,o=e.filter(i=>i.state==="skipped").length,r=t+n+o,a=e.length;$(r,a),m(b("parsingProgress",{completed:r,total:a,done:t,failed:n,skipped:o}));}function h(e){const t=w();if(!t)return;t.querySelector('[data-action="start-download"]')?.toggleAttribute("disabled",e),t.querySelector('[data-action="stop"]')?.toggleAttribute("disabled",!e);const n=t.querySelector('[data-role="concurrency"]');n&&(n.disabled=e);}async function Te(){const e=y+1;y=e;const t=pe();if(t.length===0)return f=[],m(u("noTrackLinks")),[];const n=M();if(f=be(t),h(true),V(u("parsingStage"),t.length,n),L(f),await F(t,n,async(r,a,i)=>{if(y===e){x(i,"active"),f[a]={...f[a],state:"running"},L(f);try{f[a]=await _e(r);}catch(c){const C=c instanceof Error?c.message:"unknown error";f[a]={...r,state:"failed",directUrl:null,extension:null,error:C};}x(i,f[a].state==="done"?"done":"failed"),L(f);}}),y!==e)return m(u("stopped")),h(false),[];const o=xe(f);return $(t.length,t.length),m(b("parsingComplete",{found:o.length,total:t.length})),h(false),o}function Le(){y+=1,h(false),m(u("stopPending"));}function Ee(e,t){return new Promise((n,o)=>{(async()=>{const r=await me(e.directUrl,e.trackPageUrl);Ce(r,e),Y({url:r.finalUrl||e.directUrl,name:t,saveAs:false,onload:()=>{n();},onerror:a=>{o(new Error(`download failed: ${a.error}`));},ontimeout:()=>{o(new Error("download timeout"));}});})().catch(r=>{o(r instanceof Error?r:new Error("download failed"));});})}async function ke(e){const t=_+1;if(_=t,e.length===0){m(u("noAudioLinks"));return}const n=M();let o=0,r=0;if(h(true),V(u("downloadStage"),e.length,n),m(b("downloading",{completed:0,total:e.length})),await F(e,n,async(a,i,c)=>{if(_===t){x(c,"active");try{await Ee(a,Se(a,i)),o+=1,x(c,"done");}catch{r+=1,x(c,"failed");}$(o+r,e.length),m(b("downloadProgress",{processed:o+r,total:e.length,completed:o,failed:r}));}}),_!==t){m(u("downloadStopped")),h(false);return}$(e.length,e.length),m(b("downloadComplete",{completed:o,failed:r})),h(false);}async function X(){const e=await Te();e.length>0&&await ke(e);}function Ae(){const e=document.createElement("section");e.id=p,e.dir=ie(),e.innerHTML=`
    <div class="${s}__header">
      <strong>KHInsider Audio Saver</strong>
      <button type="button" data-action="hide" title="${u("close")}">×</button>
    </div>
    <div class="${s}__controls">
      <label>
        ${u("concurrency")}
        <input type="number" min="${O}" max="${H}" step="1" value="${M()}" data-role="concurrency">
      </label>
      <button type="button" data-action="start-download">${u("startSave")}</button>
      <button type="button" data-action="stop" disabled>${u("stop")}</button>
    </div>
    <div class="${s}__status" data-role="status">${u("idle")}</div>
    <div class="${s}__progress" data-role="progress" hidden>
      <div class="${s}__overall">
        <div class="${s}__overall-bar" data-role="overall-bar"></div>
      </div>
      <div class="${s}__lanes" data-role="lanes"></div>
    </div>
  `,e.querySelector('[data-action="start-download"]')?.addEventListener("click",()=>{X();}),e.querySelector('[data-action="stop"]')?.addEventListener("click",()=>{Le(),_+=1;}),e.querySelector('[data-action="hide"]')?.addEventListener("click",()=>{e.hidden=true;});const t=e.querySelector('[data-role="concurrency"]');return t?.addEventListener("change",()=>{const n=A(Number(t.value));t.value=String(n),ce(n);}),document.body.append(e),e}function E(){const e=w()??Ae();e.hidden=false;}function Me(){if(document.getElementById(P))return;J(`
    #${p} {
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

    #${p}[hidden] {
      display: none;
    }

    .${s}__header,
    .${s}__controls {
      align-items: center;
      display: flex;
      gap: 8px;
    }

    .${s}__header {
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .${s}__controls {
      flex-wrap: wrap;
    }

    #${p} button,
    #${p} input {
      font: inherit;
    }

    #${p} button {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #111827;
      cursor: pointer;
      min-height: 28px;
      padding: 4px 9px;
    }

    #${p} button:hover:not(:disabled) {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    #${p} button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    #${p} label {
      align-items: center;
      display: inline-flex;
      gap: 5px;
    }

    #${p} input[type="number"] {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      min-height: 28px;
      padding: 3px 6px;
      width: 56px;
    }

    .${s}__status {
      color: #374151;
      margin-top: 10px;
    }

    .${s}__progress {
      margin-top: 10px;
    }

    .${s}__progress[hidden] {
      display: none;
    }

    .${s}__overall {
      background: #e5e7eb;
      border-radius: 999px;
      height: 8px;
      overflow: hidden;
      width: 100%;
    }

    .${s}__overall-bar {
      background: #2563eb;
      height: 100%;
      transition: width 180ms ease;
      width: 0%;
    }

    .${s}__lanes {
      display: grid;
      gap: 4px;
      grid-template-columns: repeat(auto-fit, minmax(28px, 1fr));
      margin-top: 8px;
    }

    .${s}__lane {
      background: #e5e7eb;
      border-radius: 999px;
      height: 6px;
      overflow: hidden;
      position: relative;
    }

    .${s}__lane::before {
      background: #9ca3af;
      content: "";
      inset: 0;
      position: absolute;
      transform: translateX(-100%);
    }

    .${s}__lane[data-state="active"]::before {
      animation: ${s}-lane 850ms linear infinite;
      background: linear-gradient(90deg, transparent, #2563eb, transparent);
      width: 80%;
    }

    .${s}__lane[data-state="done"]::before {
      background: #16a34a;
      transform: translateX(0);
    }

    .${s}__lane[data-state="failed"]::before {
      background: #dc2626;
      transform: translateX(0);
    }

    @keyframes ${s}-lane {
      from {
        transform: translateX(-100%);
      }

      to {
        transform: translateX(140%);
      }
    }
  `);const e=document.createElement("meta");e.id=P,document.head.append(e);}function q(){Me(),U(u("openPanel"),E),U(u("fetchAndSave"),()=>{E(),X();}),E();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",q,{once:true}):q();

})();