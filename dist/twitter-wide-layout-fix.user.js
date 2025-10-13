// ==UserScript==
// @name         twitter-wide-layout-fix
// @namespace    twitterWideLayoutFix
// @version      2.1.0
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

  const L={debug:"debug",info:"info",warn:"warn",error:"error"},I=e=>{const t=`[${e}]`,n={};return Object.keys(L).forEach(d=>{const i=L[d];n[d]=(...u)=>{(console[i]??console.log)(t,...u);};}),n},_={wideLayoutClass:".r-1ye8kvj",wideLayoutXPath:"/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[5]"},k=I("twitter-wide-layout-fix"),l={css:"twitterWideLayoutFix_css",xpath:"twitterWideLayoutFix_xpath",width:"twitterWideLayoutFix_width"},r={css:[`${_.wideLayoutClass} {`,"    max-width: {{WIDTH}} !important;","}"].join(`
`),xpath:_.wideLayoutXPath,width:"900"};let o={css:GM_getValue(l.css,r.css),xpath:GM_getValue(l.xpath,r.xpath),width:GM_getValue(l.width,r.width)};function G(e){o={...o,...e},GM_setValue(l.css,o.css),GM_setValue(l.xpath,o.xpath),GM_setValue(l.width,o.width),k.info("Settings saved:",o);}let y=null;function C(e){const t=(e||"").trim();if(!t){const n=o.width.toString();return /^\d+(\.\d+)?$/.test(n)?`${n}px`:n}return /^\d+(\.\d+)?$/.test(t)?`${t}px`:t}function O(e,t){const n=C(t);return e.replace(/{{WIDTH}}/g,n)}function W(){const e=O(o.css,o.width);y?y.textContent=e:y=GM_addStyle(e),D();}function D(){const e=document.evaluate(o.xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;e&&e.style.setProperty("max-width",C(o.width),"important");}function F(){if(!document.body){window.addEventListener("DOMContentLoaded",()=>F());return}new MutationObserver(()=>D()).observe(document.body,{childList:true,subtree:true});}const b="twitter-wide-layout-fix-settings";function w(e,t){const n=document.createElement("label");n.style.cssText="display: flex; flex-direction: column; gap: 8px; font-size: 14px;";const d=document.createElement("span");return d.textContent=e,d.style.fontWeight="600",n.appendChild(d),n.appendChild(t),n}function g(e){const t=document.createElement("span");return t.textContent=e,t.style.cssText="font-size: 12px; color: #536471; line-height: 1.4;",t}function v(){document.getElementById(b)?.remove();}function $(){if(document.getElementById(b))return;const e=document.createElement("div");e.id=b,e.style.cssText=`
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
  `;const u=w("CSS",i),f=g("");u.appendChild(f),d.appendChild(u);const c=document.createElement("input");c.type="text",c.value=o.xpath,c.style.cssText=`
    width: 100%; font-size: 13px; padding: 8px;
    border: 1px solid #d0d7de; border-radius: 6px;
  `,d.appendChild(w("XPath",c));const s=document.createElement("input");s.type="text",s.value=o.width,s.placeholder=`例: ${r.width} または 80%`,s.style.cssText=`
    width: 100%; font-size: 13px; padding: 8px;
    border: 1px solid #d0d7de; border-radius: 6px;
  `;const m=w("幅 (width)",s),H=g("数値のみの場合はpxを自動付与し、単位付きの値はそのまま利用します。"),E=g("");m.appendChild(H),m.appendChild(E),d.appendChild(m);const T=()=>{const a=C(s.value.trim()||r.width),P=i.value.includes("{{WIDTH}}");E.textContent=P?`適用幅: ${a}（CSSとXPathに共通適用）`:`適用幅: ${a}（CSSに{{WIDTH}}が含まれていません）`;},S=()=>{const a=i.value.includes("{{WIDTH}}");f.textContent=a?"CSS内の{{WIDTH}}は幅設定で置換されます。":"CSSに{{WIDTH}}を含めると幅設定を共有できます。",T();};s.addEventListener("input",T),i.addEventListener("input",S),S();const x=document.createElement("div");x.style.cssText="display: flex; justify-content: flex-end; gap: 8px;";const p=document.createElement("button");p.type="button",p.textContent="キャンセル",p.style.cssText=`
    padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 999px;
    background: #f7f9f9; cursor: pointer;
  `,p.addEventListener("click",v);const h=document.createElement("button");h.type="submit",h.textContent="保存",h.style.cssText=`
    padding: 8px 14px; border: none; border-radius: 999px;
    background: #1d9bf0; color: #ffffff; cursor: pointer;
  `,x.appendChild(p),x.appendChild(h),d.appendChild(x),d.addEventListener("submit",a=>{a.preventDefault(),G({css:i.value,xpath:c.value.trim()||r.xpath,width:s.value.trim()||r.width}),W(),v();}),e.addEventListener("click",a=>{a.target===e&&v();}),document.body.appendChild(e),i.focus();}const z=I("twitter-wide-layout-fix");function M(){z.info("Initializing..."),W(),F(),GM_registerMenuCommand("Twitter Wide Layout Fix 設定",$);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",M):M();

})();