// ==UserScript==
// @name         twitter-wide-layout-fix
// @namespace    twitterWideLayoutFix
// @version      2.2.0
// @author       roflsunriz
// @description  Adjusts Twitter layout width using class and XPath selectors
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-wide-layout-fix.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-wide-layout-fix.meta.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// ==/UserScript==

(function () {
  'use strict';

  const P={debug:"debug",info:"info",warn:"warn",error:"error"},G=e=>{const t=`[${e}]`,d={};return Object.keys(P).forEach(i=>{const s=P[i];d[i]=(...h)=>{(console[s]??console.log)(t,...h);};}),d},F={wideLayoutClass:".r-1ye8kvj",wideLayoutXPath:"/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[5]"},B=G("twitter-wide-layout-fix"),u={css:"twitterWideLayoutFix_css",xpath:"twitterWideLayoutFix_xpath",width:"twitterWideLayoutFix_width"},r={css:[`${F.wideLayoutClass} {`,"    max-width: {{WIDTH}} !important;","}"].join(`
`),xpath:F.wideLayoutXPath,width:"900"};let n={css:GM_getValue(u.css,r.css),xpath:GM_getValue(u.xpath,r.xpath),width:GM_getValue(u.width,r.width)};function O(e){n={...n,...e},GM_setValue(u.css,n.css),GM_setValue(u.xpath,n.xpath),GM_setValue(u.width,n.width),B.info("Settings saved:",n);}let E=null;function I(e){const t=(e||"").trim();if(!t){const d=n.width.toString();return /^\d+(\.\d+)?$/.test(d)?`${d}px`:d}return /^\d+(\.\d+)?$/.test(t)?`${t}px`:t}function N(e,t){const d=I(t);return e.replace(/{{WIDTH}}/g,d)}function W(){const e=N(n.css,n.width);E?E.textContent=e:E=GM_addStyle(e),$();}function $(){const e=document.evaluate(n.xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;e&&e.style.setProperty("max-width",I(n.width),"important");}function z(){if(!document.body){window.addEventListener("DOMContentLoaded",()=>z());return}new MutationObserver(()=>$()).observe(document.body,{childList:true,subtree:true});}const L="twitter-wide-layout-fix-settings";let v=null;function H(e,t){const d=document.createElement("label");d.style.cssText="display: flex; flex-direction: column; gap: 8px; font-size: 14px;";const i=document.createElement("span");return i.textContent=e,i.style.fontWeight="600",d.appendChild(i),d.appendChild(t),d}function T(e){const t=document.createElement("span");return t.textContent=e,t.style.cssText="font-size: 12px; color: #536471; line-height: 1.4;",t}function S(e){e&&v&&(O(v),W()),document.getElementById(L)?.remove(),v=null;}function X(){if(document.getElementById(L))return;v={css:n.css,xpath:n.xpath,width:n.width};const e=document.createElement("div");e.id=L,e.style.cssText=`
    position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.55);
    z-index: 2147483647; display: flex; align-items: center; justify-content: center; padding: 16px;
  `;const t=document.createElement("div");t.style.cssText=`
    background: #ffffff; color: #0f1419; width: min(600px, 100%);
    max-height: 90vh; overflow: auto; padding: 24px; border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  `,e.appendChild(t);const d=document.createElement("h2");d.textContent="Twitter Wide Layout Fix 設定",d.style.marginTop="0",t.appendChild(d);const i=document.createElement("form");i.style.cssText="display: flex; flex-direction: column; gap: 16px;",t.appendChild(i);const s=document.createElement("textarea");s.value=n.css,s.style.cssText=`
    width: 100%; min-height: 120px; font-family: monospace; font-size: 13px;
    padding: 8px; border: 1px solid #d0d7de; border-radius: 6px;
  `;const h=H("CSS",s),C=T("");h.appendChild(C),i.appendChild(h);const c=document.createElement("input");c.type="text",c.value=n.xpath,c.style.cssText=`
    width: 100%; font-size: 13px; padding: 8px;
    border: 1px solid #d0d7de; border-radius: 6px;
  `,i.appendChild(H("XPath",c));const p=document.createElement("div");p.style.cssText="display: flex; flex-direction: column; gap: 8px;";const m=document.createElement("span");m.textContent="幅 (width)",m.style.fontWeight="600",m.style.fontSize="14px",p.appendChild(m);const f=document.createElement("div");f.style.cssText="display: flex; gap: 12px; align-items: center;";const a=document.createElement("input");a.type="range",a.min="600",a.max="2000",a.step="10";const _=parseInt(n.width,10);a.value=isNaN(_)?"900":String(_),a.style.cssText="flex: 1; cursor: pointer;";const l=document.createElement("input");l.type="text",l.value=n.width,l.placeholder=`例: ${r.width} または 80%`,l.style.cssText=`
    width: 120px; font-size: 13px; padding: 8px;
    border: 1px solid #d0d7de; border-radius: 6px; text-align: center;
  `,f.appendChild(a),f.appendChild(l),p.appendChild(f);const R=T("数値のみの場合はpxを自動付与し、単位付きの値はそのまま利用します。スライダーで直感的に調整できます。"),M=T("");p.appendChild(R),p.appendChild(M),i.appendChild(p);const y=()=>{O({css:s.value,xpath:c.value.trim()||r.xpath,width:l.value.trim()||r.width}),W();},b=()=>{const o=I(l.value.trim()||r.width),V=s.value.includes("{{WIDTH}}");M.textContent=V?`適用幅: ${o}（CSSとXPathに共通適用）`:`適用幅: ${o}（CSSに{{WIDTH}}が含まれていません）`;},D=()=>{const o=s.value.includes("{{WIDTH}}");C.textContent=o?"CSS内の{{WIDTH}}は幅設定で置換されます。":"CSSに{{WIDTH}}を含めると幅設定を共有できます。",b();};a.addEventListener("input",()=>{l.value=a.value,b(),y();}),l.addEventListener("input",()=>{const o=parseInt(l.value,10);isNaN(o)||(a.value=String(o)),b(),y();}),s.addEventListener("input",()=>{D(),y();}),c.addEventListener("input",()=>{y();}),D();const g=document.createElement("div");g.style.cssText="display: flex; justify-content: flex-end; gap: 8px;";const x=document.createElement("button");x.type="button",x.textContent="キャンセル",x.style.cssText=`
    padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 999px;
    background: #f7f9f9; cursor: pointer;
  `,x.addEventListener("click",()=>S(true));const w=document.createElement("button");w.type="submit",w.textContent="保存",w.style.cssText=`
    padding: 8px 14px; border: none; border-radius: 999px;
    background: #1d9bf0; color: #ffffff; cursor: pointer;
  `,g.appendChild(x),g.appendChild(w),i.appendChild(g),i.addEventListener("submit",o=>{o.preventDefault(),S(false);}),e.addEventListener("click",o=>{o.target===e&&S(true);}),document.body.appendChild(e),s.focus();}const j=G("twitter-wide-layout-fix");function k(){j.info("Initializing..."),W(),z(),GM_registerMenuCommand("Twitter Wide Layout Fix 設定",X);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",k):k();

})();