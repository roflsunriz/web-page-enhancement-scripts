// ==UserScript==
// @name         Twitter/X Wide Layout Fix
// @namespace    twitterWideLayoutFix
// @version      2.0.0
// @author       roflsunriz
// @description  Adjusts Twitter layout width using class and XPath selectors
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/0bc56fc90ea91c2b76aee92ce7250c60/raw/twitter_wide_layout_fix.user.js
// @updateURL    https://gist.githubusercontent.com/roflsunriz/0bc56fc90ea91c2b76aee92ce7250c60/raw/twitter_wide_layout_fix.user.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// ==/UserScript==

(function () {
  'use strict';

  const L={debug:"debug",info:"info",warn:"warn",error:"error"},_=e=>{const t=`[${e}]`,n={};return Object.keys(L).forEach(d=>{const i=L[d];n[d]=(...u)=>{(console[i]??console.log)(t,...u);};}),n},k=_("twitter-wide-layout-fix"),l={css:"twitterWideLayoutFix_css",xpath:"twitterWideLayoutFix_xpath",width:"twitterWideLayoutFix_width"},a={css:[".r-1ye8kvj {","    max-width: {{WIDTH}} !important;","}"].join(`
`),xpath:"/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[5]",width:"900"};let o={css:GM_getValue(l.css,a.css),xpath:GM_getValue(l.xpath,a.xpath),width:GM_getValue(l.width,a.width)};function G(e){o={...o,...e},GM_setValue(l.css,o.css),GM_setValue(l.xpath,o.xpath),GM_setValue(l.width,o.width),k.info("Settings saved:",o);}let y=null;function C(e){const t=(e||"").trim();if(!t){const n=o.width.toString();return /^\d+(\.\d+)?$/.test(n)?`${n}px`:n}return /^\d+(\.\d+)?$/.test(t)?`${t}px`:t}function O(e,t){const n=C(t);return e.replace(/{{WIDTH}}/g,n)}function I(){const e=O(o.css,o.width);y?y.textContent=e:y=GM_addStyle(e),W();}function W(){const e=document.evaluate(o.xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;e&&e.style.setProperty("max-width",C(o.width),"important");}function D(){if(!document.body){window.addEventListener("DOMContentLoaded",()=>D());return}new MutationObserver(()=>W()).observe(document.body,{childList:true,subtree:true});}const b="twitter-wide-layout-fix-settings";function g(e,t){const n=document.createElement("label");n.style.cssText="display: flex; flex-direction: column; gap: 8px; font-size: 14px;";const d=document.createElement("span");return d.textContent=e,d.style.fontWeight="600",n.appendChild(d),n.appendChild(t),n}function v(e){const t=document.createElement("span");return t.textContent=e,t.style.cssText="font-size: 12px; color: #536471; line-height: 1.4;",t}function w(){document.getElementById(b)?.remove();}function P(){if(document.getElementById(b))return;const e=document.createElement("div");e.id=b,e.style.cssText=`
    position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.55);
    z-index: 2147483647; display: flex; align-items: center; justify-content: center; padding: 16px;
  `;const t=document.createElement("div");t.style.cssText=`
    background: #ffffff; color: #0f1419; width: min(600px, 100%);
    max-height: 90vh; overflow: auto; padding: 24px; border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  `,e.appendChild(t);const n=document.createElement("h2");n.textContent="Twitter Wide Layout Fix 設定",n.style.marginTop="0",t.appendChild(n);const d=document.createElement("form");d.style.cssText="display: flex; flex-direction: column; gap: 16px;",t.appendChild(d);const i=document.createElement("textarea");i.value=o.css,i.style.cssText=`
    width: 100%; min-height: 120px; font-family: monospace; font-size: 13px;
    padding: 8px; border: 1px solid #d0d7de; border-radius: 6px;
  `;const u=g("CSS",i),f=v("");u.appendChild(f),d.appendChild(u);const c=document.createElement("input");c.type="text",c.value=o.xpath,c.style.cssText=`
    width: 100%; font-size: 13px; padding: 8px;
    border: 1px solid #d0d7de; border-radius: 6px;
  `,d.appendChild(g("XPath",c));const s=document.createElement("input");s.type="text",s.value=o.width,s.placeholder=`例: ${a.width} または 80%`,s.style.cssText=`
    width: 100%; font-size: 13px; padding: 8px;
    border: 1px solid #d0d7de; border-radius: 6px;
  `;const m=g("幅 (width)",s),F=v("数値のみの場合はpxを自動付与し、単位付きの値はそのまま利用します。"),E=v("");m.appendChild(F),m.appendChild(E),d.appendChild(m);const T=()=>{const r=C(s.value.trim()||a.width),H=i.value.includes("{{WIDTH}}");E.textContent=H?`適用幅: ${r}（CSSとXPathに共通適用）`:`適用幅: ${r}（CSSに{{WIDTH}}が含まれていません）`;},S=()=>{const r=i.value.includes("{{WIDTH}}");f.textContent=r?"CSS内の{{WIDTH}}は幅設定で置換されます。":"CSSに{{WIDTH}}を含めると幅設定を共有できます。",T();};s.addEventListener("input",T),i.addEventListener("input",S),S();const x=document.createElement("div");x.style.cssText="display: flex; justify-content: flex-end; gap: 8px;";const p=document.createElement("button");p.type="button",p.textContent="キャンセル",p.style.cssText=`
    padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 999px;
    background: #f7f9f9; cursor: pointer;
  `,p.addEventListener("click",w);const h=document.createElement("button");h.type="submit",h.textContent="保存",h.style.cssText=`
    padding: 8px 14px; border: none; border-radius: 999px;
    background: #1d9bf0; color: #ffffff; cursor: pointer;
  `,x.appendChild(p),x.appendChild(h),d.appendChild(x),d.addEventListener("submit",r=>{r.preventDefault(),G({css:i.value,xpath:c.value.trim()||a.xpath,width:s.value.trim()||a.width}),I(),w();}),e.addEventListener("click",r=>{r.target===e&&w();}),document.body.appendChild(e),i.focus();}const $=_("twitter-wide-layout-fix");function M(){$.info("Initializing..."),I(),D(),GM_registerMenuCommand("Twitter Wide Layout Fix 設定",P);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",M):M();

})();