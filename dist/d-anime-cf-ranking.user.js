// ==UserScript==
// @name         d-anime-cf-ranking
// @namespace    dAnimeCfRanking
// @version      1.5.1
// @author       roflsunriz
// @description  dアニメストアのCFページに作品の人気度ランキング（ニコニコ動画指標）を表示
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animestore.docomo.ne.jp
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/d-anime-cf-ranking.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/d-anime-cf-ranking.meta.js
// @match        https://animestore.docomo.ne.jp/animestore/CF/*
// @match        https://animestore.docomo.ne.jp/animestore/CF/shinban-*
// @connect      nicovideo.jp
// @connect      *.nicovideo.jp
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function(){"use strict";var e={debug:`debug`,info:`info`,warn:`warn`,error:`error`},t={debug:10,info:20,warn:30,error:40},n=e=>t[e]>=t.warn,r=t=>{let r=`[${t}]`,i={};return Object.keys(e).forEach(a=>{let o=e[a];i[a]=(...e)=>{n(a,t)&&(console[o]??console.log)(r,...e)}}),i},i=[{label:`6時間`,hours:6},{label:`12時間`,hours:12},{label:`24時間`,hours:24},{label:`48時間`,hours:48},{label:`1週間`,hours:168}],a={enabled:!0,cacheTtlHours:24},o=`dAnimeCfRankingCache`,s=`metricsCache`,c;function l(e,t,n){function r(n,r){if(n._zod||Object.defineProperty(n,"_zod",{value:{def:r,constr:o,traits:new Set},enumerable:!1}),n._zod.traits.has(e))return;n._zod.traits.add(e),t(n,r);let i=o.prototype,a=Object.keys(i);for(let e=0;e<a.length;e++){let t=a[e];t in n||(n[t]=i[t].bind(n))}}let i=n?.Parent??Object;class a extends i{}Object.defineProperty(a,"name",{value:e});function o(e){var t;let i=n?.Parent?new a:this;r(i,e),(t=i._zod).deferred??(t.deferred=[]);for(let e of i._zod.deferred)e();return i}return Object.defineProperty(o,"init",{value:r}),Object.defineProperty(o,Symbol.hasInstance,{value:t=>n?.Parent&&t instanceof n.Parent?!0:t?._zod?.traits?.has(e)}),Object.defineProperty(o,"name",{value:e}),o}var u=class extends Error{constructor(){super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`)}},d=class extends Error{constructor(e){super(`Encountered unidirectional transform during encode: ${e}`),this.name=`ZodEncodeError`}};(c=globalThis).__zod_globalConfig??(c.__zod_globalConfig={});var f=globalThis.__zod_globalConfig;function p(e){return e&&Object.assign(f,e),f}function m(e){let t=Object.values(e).filter(e=>typeof e==`number`);return Object.entries(e).filter(([e,n])=>t.indexOf(+e)===-1).map(([e,t])=>t)}function h(e,t){return typeof t==`bigint`?t.toString():t}function g(e){return{get value(){{let t=e();return Object.defineProperty(this,"value",{value:t}),t}throw Error(`cached value already set`)}}}function _(e){return e==null}function v(e){let t=+!!e.startsWith(`^`),n=e.endsWith(`$`)?e.length-1:e.length;return e.slice(t,n)}function ee(e,t){let n=e/t,r=Math.round(n),i=2**-52*Math.max(Math.abs(n),1);return Math.abs(n-r)<i?0:n-r}var te=Symbol(`evaluating`);function y(e,t,n){let r;Object.defineProperty(e,t,{get(){if(r!==te)return r===void 0&&(r=te,r=n()),r},set(n){Object.defineProperty(e,t,{value:n})},configurable:!0})}function b(e,t,n){Object.defineProperty(e,t,{value:n,writable:!0,enumerable:!0,configurable:!0})}function x(...e){let t={};for(let n of e){let e=Object.getOwnPropertyDescriptors(n);Object.assign(t,e)}return Object.defineProperties({},t)}function ne(e){return JSON.stringify(e)}function re(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,``).replace(/[\s_-]+/g,`-`).replace(/^-+|-+$/g,``)}var ie=`captureStackTrace`in Error?Error.captureStackTrace:(...e)=>{};function ae(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}var oe=g(()=>{if(f.jitless||typeof navigator<`u`&&navigator?.userAgent?.includes(`Cloudflare`))return!1;try{return Function(``),!0}catch{return!1}});function se(e){if(ae(e)===!1)return!1;let t=e.constructor;if(t===void 0||typeof t!=`function`)return!0;let n=t.prototype;return!(ae(n)===!1||Object.prototype.hasOwnProperty.call(n,`isPrototypeOf`)===!1)}function ce(e){return se(e)?{...e}:Array.isArray(e)?[...e]:e instanceof Map?new Map(e):e instanceof Set?new Set(e):e}var le=new Set([`string`,`number`,`symbol`]);function ue(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function S(e,t,n){let r=new e._zod.constr(t??e._zod.def);return(!t||n?.parent)&&(r._zod.parent=e),r}function C(e){let t=e;if(!t)return{};if(typeof t==`string`)return{error:()=>t};if(t?.message!==void 0){if(t?.error!==void 0)throw Error("Cannot specify both `message` and `error` params");t.error=t.message}return delete t.message,typeof t.error==`string`?{...t,error:()=>t.error}:t}function de(e){return Object.keys(e).filter(t=>e[t]._zod.optin===`optional`&&e[t]._zod.optout===`optional`)}var fe={safeint:[-(2**53-1),2**53-1],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]};function pe(e,t){let n=e._zod.def,r=n.checks;if(r&&r.length>0)throw Error(`.pick() cannot be used on object schemas containing refinements`);return S(e,x(e._zod.def,{get shape(){let e={};for(let r in t){if(!(r in n.shape))throw Error(`Unrecognized key: "${r}"`);t[r]&&(e[r]=n.shape[r])}return b(this,`shape`,e),e},checks:[]}))}function me(e,t){let n=e._zod.def,r=n.checks;if(r&&r.length>0)throw Error(`.omit() cannot be used on object schemas containing refinements`);return S(e,x(e._zod.def,{get shape(){let r={...e._zod.def.shape};for(let e in t){if(!(e in n.shape))throw Error(`Unrecognized key: "${e}"`);t[e]&&delete r[e]}return b(this,`shape`,r),r},checks:[]}))}function he(e,t){if(!se(t))throw Error(`Invalid input to extend: expected a plain object`);let n=e._zod.def.checks;if(n&&n.length>0){let n=e._zod.def.shape;for(let e in t)if(Object.getOwnPropertyDescriptor(n,e)!==void 0)throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}return S(e,x(e._zod.def,{get shape(){let n={...e._zod.def.shape,...t};return b(this,`shape`,n),n}}))}function ge(e,t){if(!se(t))throw Error(`Invalid input to safeExtend: expected a plain object`);return S(e,x(e._zod.def,{get shape(){let n={...e._zod.def.shape,...t};return b(this,`shape`,n),n}}))}function _e(e,t){if(e._zod.def.checks?.length)throw Error(`.merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.`);return S(e,x(e._zod.def,{get shape(){let n={...e._zod.def.shape,...t._zod.def.shape};return b(this,`shape`,n),n},get catchall(){return t._zod.def.catchall},checks:t._zod.def.checks??[]}))}function ve(e,t,n){let r=t._zod.def.checks;if(r&&r.length>0)throw Error(`.partial() cannot be used on object schemas containing refinements`);return S(t,x(t._zod.def,{get shape(){let r=t._zod.def.shape,i={...r};if(n)for(let t in n){if(!(t in r))throw Error(`Unrecognized key: "${t}"`);n[t]&&(i[t]=e?new e({type:`optional`,innerType:r[t]}):r[t])}else for(let t in r)i[t]=e?new e({type:`optional`,innerType:r[t]}):r[t];return b(this,`shape`,i),i},checks:[]}))}function ye(e,t,n){return S(t,x(t._zod.def,{get shape(){let r=t._zod.def.shape,i={...r};if(n)for(let t in n){if(!(t in i))throw Error(`Unrecognized key: "${t}"`);n[t]&&(i[t]=new e({type:`nonoptional`,innerType:r[t]}))}else for(let t in r)i[t]=new e({type:`nonoptional`,innerType:r[t]});return b(this,`shape`,i),i}}))}function w(e,t=0){if(e.aborted===!0)return!0;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue!==!0)return!0;return!1}function be(e,t=0){if(e.aborted===!0)return!0;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue===!1)return!0;return!1}function xe(e,t){return t.map(t=>{var n;return(n=t).path??(n.path=[]),t.path.unshift(e),t})}function Se(e){return typeof e==`string`?e:e?.message}function T(e,t,n){let r=e.message?e.message:Se(e.inst?._zod.def?.error?.(e))??Se(t?.error?.(e))??Se(n.customError?.(e))??Se(n.localeError?.(e))??`Invalid input`,{inst:i,continue:a,input:o,...s}=e;return s.path??=[],s.message=r,t?.reportInput&&(s.input=o),s}function Ce(e){return Array.isArray(e)?`array`:typeof e==`string`?`string`:`unknown`}function we(...e){let[t,n,r]=e;return typeof t==`string`?{message:t,code:`custom`,input:n,inst:r}:{...t}}var Te=(e,t)=>{e.name=`$ZodError`,Object.defineProperty(e,"_zod",{value:e._zod,enumerable:!1}),Object.defineProperty(e,"issues",{value:t,enumerable:!1}),e.message=JSON.stringify(t,h,2),Object.defineProperty(e,"toString",{value:()=>e.message,enumerable:!1})},Ee=l(`$ZodError`,Te),De=l(`$ZodError`,Te,{Parent:Error});function Oe(e,t=e=>e.message){let n={},r=[];for(let i of e.issues)i.path.length>0?(n[i.path[0]]=n[i.path[0]]||[],n[i.path[0]].push(t(i))):r.push(t(i));return{formErrors:r,fieldErrors:n}}function ke(e,t=e=>e.message){let n={_errors:[]},r=(e,i=[])=>{for(let a of e.issues)if(a.code===`invalid_union`&&a.errors.length)a.errors.map(e=>r({issues:e},[...i,...a.path]));else if(a.code===`invalid_key`)r({issues:a.issues},[...i,...a.path]);else if(a.code===`invalid_element`)r({issues:a.issues},[...i,...a.path]);else{let e=[...i,...a.path];if(e.length===0)n._errors.push(t(a));else{let r=n,i=0;for(;i<e.length;){let n=e[i];i===e.length-1?(r[n]=r[n]||{_errors:[]},r[n]._errors.push(t(a))):r[n]=r[n]||{_errors:[]},r=r[n],i++}}}};return r(e),n}var Ae=e=>(t,n,r,i)=>{let a=r?{...r,async:!1}:{async:!1},o=t._zod.run({value:n,issues:[]},a);if(o instanceof Promise)throw new u;if(o.issues.length){let t=new((i?.Err)??e)(o.issues.map(e=>T(e,a,p())));throw ie(t,i?.callee),t}return o.value},je=e=>async(t,n,r,i)=>{let a=r?{...r,async:!0}:{async:!0},o=t._zod.run({value:n,issues:[]},a);if(o instanceof Promise&&(o=await o),o.issues.length){let t=new((i?.Err)??e)(o.issues.map(e=>T(e,a,p())));throw ie(t,i?.callee),t}return o.value},Me=e=>(t,n,r)=>{let i=r?{...r,async:!1}:{async:!1},a=t._zod.run({value:n,issues:[]},i);if(a instanceof Promise)throw new u;return a.issues.length?{success:!1,error:new(e??Ee)(a.issues.map(e=>T(e,i,p())))}:{success:!0,data:a.value}},Ne=Me(De),Pe=e=>async(t,n,r)=>{let i=r?{...r,async:!0}:{async:!0},a=t._zod.run({value:n,issues:[]},i);return a instanceof Promise&&(a=await a),a.issues.length?{success:!1,error:new e(a.issues.map(e=>T(e,i,p())))}:{success:!0,data:a.value}},Fe=Pe(De),Ie=e=>(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return Ae(e)(t,n,i)},Le=e=>(t,n,r)=>Ae(e)(t,n,r),Re=e=>async(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return je(e)(t,n,i)},ze=e=>async(t,n,r)=>je(e)(t,n,r),Be=e=>(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return Me(e)(t,n,i)},Ve=e=>(t,n,r)=>Me(e)(t,n,r),He=e=>async(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return Pe(e)(t,n,i)},Ue=e=>async(t,n,r)=>Pe(e)(t,n,r),We=/^[cC][0-9a-z]{6,}$/,Ge=/^[0-9a-z]+$/,Ke=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,qe=/^[0-9a-vA-V]{20}$/,Je=/^[A-Za-z0-9]{27}$/,Ye=/^[a-zA-Z0-9_-]{21}$/,Xe=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,Ze=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,Qe=e=>e?RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,$e=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,et=`^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;function tt(){return new RegExp(et,`u`)}var nt=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,rt=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,it=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,at=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,ot=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,st=/^[A-Za-z0-9_-]*$/,ct=/^https?$/,lt=/^\+[1-9]\d{6,14}$/,ut=`(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`,dt=RegExp(`^${ut}$`);function ft(e){let t=`(?:[01]\\d|2[0-3]):[0-5]\\d`;return typeof e.precision==`number`?e.precision===-1?`${t}`:e.precision===0?`${t}:[0-5]\\d`:`${t}:[0-5]\\d\\.\\d{${e.precision}}`:`${t}(?::[0-5]\\d(?:\\.\\d+)?)?`}function pt(e){return RegExp(`^${ft(e)}$`)}function mt(e){let t=ft({precision:e.precision}),n=[`Z`];e.local&&n.push(``),e.offset&&n.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);let r=`${t}(?:${n.join(`|`)})`;return RegExp(`^${ut}T(?:${r})$`)}var ht=e=>{let t=e?`[\\s\\S]{${e?.minimum??0},${e?.maximum??``}}`:`[\\s\\S]*`;return RegExp(`^${t}$`)},gt=/^-?\d+$/,_t=/^-?\d+(?:\.\d+)?$/,vt=/^(?:true|false)$/i,yt=/^[^A-Z]*$/,bt=/^[^a-z]*$/,E=l(`$ZodCheck`,(e,t)=>{var n;e._zod??={},e._zod.def=t,(n=e._zod).onattach??(n.onattach=[])}),xt={number:`number`,bigint:`bigint`,object:`date`},St=l(`$ZodCheckLessThan`,(e,t)=>{E.init(e,t);let n=xt[typeof t.value];e._zod.onattach.push(e=>{let n=e._zod.bag,r=(t.inclusive?n.maximum:n.exclusiveMaximum)??1/0;t.value<r&&(t.inclusive?n.maximum=t.value:n.exclusiveMaximum=t.value)}),e._zod.check=r=>{(t.inclusive?r.value<=t.value:r.value<t.value)||r.issues.push({origin:n,code:`too_big`,maximum:typeof t.value==`object`?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),Ct=l(`$ZodCheckGreaterThan`,(e,t)=>{E.init(e,t);let n=xt[typeof t.value];e._zod.onattach.push(e=>{let n=e._zod.bag,r=(t.inclusive?n.minimum:n.exclusiveMinimum)??-1/0;t.value>r&&(t.inclusive?n.minimum=t.value:n.exclusiveMinimum=t.value)}),e._zod.check=r=>{(t.inclusive?r.value>=t.value:r.value>t.value)||r.issues.push({origin:n,code:`too_small`,minimum:typeof t.value==`object`?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),wt=l(`$ZodCheckMultipleOf`,(e,t)=>{E.init(e,t),e._zod.onattach.push(e=>{var n;(n=e._zod.bag).multipleOf??(n.multipleOf=t.value)}),e._zod.check=n=>{if(typeof n.value!=typeof t.value)throw Error(`Cannot mix number and bigint in multiple_of check.`);(typeof n.value==`bigint`?n.value%t.value===BigInt(0):ee(n.value,t.value)===0)||n.issues.push({origin:typeof n.value,code:`not_multiple_of`,divisor:t.value,input:n.value,inst:e,continue:!t.abort})}}),Tt=l(`$ZodCheckNumberFormat`,(e,t)=>{E.init(e,t),t.format=t.format||`float64`;let n=t.format?.includes(`int`),r=n?`int`:`number`,[i,a]=fe[t.format];e._zod.onattach.push(e=>{let r=e._zod.bag;r.format=t.format,r.minimum=i,r.maximum=a,n&&(r.pattern=gt)}),e._zod.check=o=>{let s=o.value;if(n){if(!Number.isInteger(s)){o.issues.push({expected:r,format:t.format,code:`invalid_type`,continue:!1,input:s,inst:e});return}if(!Number.isSafeInteger(s)){s>0?o.issues.push({input:s,code:`too_big`,maximum:2**53-1,note:`Integers must be within the safe integer range.`,inst:e,origin:r,inclusive:!0,continue:!t.abort}):o.issues.push({input:s,code:`too_small`,minimum:-(2**53-1),note:`Integers must be within the safe integer range.`,inst:e,origin:r,inclusive:!0,continue:!t.abort});return}}s<i&&o.issues.push({origin:`number`,input:s,code:`too_small`,minimum:i,inclusive:!0,inst:e,continue:!t.abort}),s>a&&o.issues.push({origin:`number`,input:s,code:`too_big`,maximum:a,inclusive:!0,inst:e,continue:!t.abort})}}),Et=l(`$ZodCheckMaxLength`,(e,t)=>{var n;E.init(e,t),(n=e._zod.def).when??(n.when=e=>{let t=e.value;return!_(t)&&t.length!==void 0}),e._zod.onattach.push(e=>{let n=e._zod.bag.maximum??1/0;t.maximum<n&&(e._zod.bag.maximum=t.maximum)}),e._zod.check=n=>{let r=n.value;if(r.length<=t.maximum)return;let i=Ce(r);n.issues.push({origin:i,code:`too_big`,maximum:t.maximum,inclusive:!0,input:r,inst:e,continue:!t.abort})}}),Dt=l(`$ZodCheckMinLength`,(e,t)=>{var n;E.init(e,t),(n=e._zod.def).when??(n.when=e=>{let t=e.value;return!_(t)&&t.length!==void 0}),e._zod.onattach.push(e=>{let n=e._zod.bag.minimum??-1/0;t.minimum>n&&(e._zod.bag.minimum=t.minimum)}),e._zod.check=n=>{let r=n.value;if(r.length>=t.minimum)return;let i=Ce(r);n.issues.push({origin:i,code:`too_small`,minimum:t.minimum,inclusive:!0,input:r,inst:e,continue:!t.abort})}}),Ot=l(`$ZodCheckLengthEquals`,(e,t)=>{var n;E.init(e,t),(n=e._zod.def).when??(n.when=e=>{let t=e.value;return!_(t)&&t.length!==void 0}),e._zod.onattach.push(e=>{let n=e._zod.bag;n.minimum=t.length,n.maximum=t.length,n.length=t.length}),e._zod.check=n=>{let r=n.value,i=r.length;if(i===t.length)return;let a=Ce(r),o=i>t.length;n.issues.push({origin:a,...o?{code:`too_big`,maximum:t.length}:{code:`too_small`,minimum:t.length},inclusive:!0,exact:!0,input:n.value,inst:e,continue:!t.abort})}}),kt=l(`$ZodCheckStringFormat`,(e,t)=>{var n,r;E.init(e,t),e._zod.onattach.push(e=>{let n=e._zod.bag;n.format=t.format,t.pattern&&(n.patterns??=new Set,n.patterns.add(t.pattern))}),t.pattern?(n=e._zod).check??(n.check=n=>{t.pattern.lastIndex=0,!t.pattern.test(n.value)&&n.issues.push({origin:`string`,code:`invalid_format`,format:t.format,input:n.value,...t.pattern?{pattern:t.pattern.toString()}:{},inst:e,continue:!t.abort})}):(r=e._zod).check??(r.check=()=>{})}),At=l(`$ZodCheckRegex`,(e,t)=>{kt.init(e,t),e._zod.check=n=>{t.pattern.lastIndex=0,!t.pattern.test(n.value)&&n.issues.push({origin:`string`,code:`invalid_format`,format:`regex`,input:n.value,pattern:t.pattern.toString(),inst:e,continue:!t.abort})}}),jt=l(`$ZodCheckLowerCase`,(e,t)=>{t.pattern??=yt,kt.init(e,t)}),Mt=l(`$ZodCheckUpperCase`,(e,t)=>{t.pattern??=bt,kt.init(e,t)}),Nt=l(`$ZodCheckIncludes`,(e,t)=>{E.init(e,t);let n=ue(t.includes),r=new RegExp(typeof t.position==`number`?`^.{${t.position}}${n}`:n);t.pattern=r,e._zod.onattach.push(e=>{let t=e._zod.bag;t.patterns??=new Set,t.patterns.add(r)}),e._zod.check=n=>{n.value.includes(t.includes,t.position)||n.issues.push({origin:`string`,code:`invalid_format`,format:`includes`,includes:t.includes,input:n.value,inst:e,continue:!t.abort})}}),Pt=l(`$ZodCheckStartsWith`,(e,t)=>{E.init(e,t);let n=RegExp(`^${ue(t.prefix)}.*`);t.pattern??=n,e._zod.onattach.push(e=>{let t=e._zod.bag;t.patterns??=new Set,t.patterns.add(n)}),e._zod.check=n=>{n.value.startsWith(t.prefix)||n.issues.push({origin:`string`,code:`invalid_format`,format:`starts_with`,prefix:t.prefix,input:n.value,inst:e,continue:!t.abort})}}),Ft=l(`$ZodCheckEndsWith`,(e,t)=>{E.init(e,t);let n=RegExp(`.*${ue(t.suffix)}$`);t.pattern??=n,e._zod.onattach.push(e=>{let t=e._zod.bag;t.patterns??=new Set,t.patterns.add(n)}),e._zod.check=n=>{n.value.endsWith(t.suffix)||n.issues.push({origin:`string`,code:`invalid_format`,format:`ends_with`,suffix:t.suffix,input:n.value,inst:e,continue:!t.abort})}}),It=l(`$ZodCheckOverwrite`,(e,t)=>{E.init(e,t),e._zod.check=e=>{e.value=t.tx(e.value)}}),Lt=class{constructor(e=[]){this.content=[],this.indent=0,this&&(this.args=e)}indented(e){this.indent+=1,e(this),--this.indent}write(e){if(typeof e==`function`){e(this,{execution:`sync`}),e(this,{execution:`async`});return}let t=e.split(`
`).filter(e=>e),n=Math.min(...t.map(e=>e.length-e.trimStart().length)),r=t.map(e=>e.slice(n)).map(e=>` `.repeat(this.indent*2)+e);for(let e of r)this.content.push(e)}compile(){let e=Function,t=this?.args,n=[...(this?.content??[``]).map(e=>`  ${e}`)];return new e(...t,n.join(`
`))}},Rt={major:4,minor:4,patch:3},D=l(`$ZodType`,(e,t)=>{var n;e??={},e._zod.def=t,e._zod.bag=e._zod.bag||{},e._zod.version=Rt;let r=[...e._zod.def.checks??[]];e._zod.traits.has(`$ZodCheck`)&&r.unshift(e);for(let t of r)for(let n of t._zod.onattach)n(e);if(r.length===0)(n=e._zod).deferred??(n.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse});else{let t=(e,t,n)=>{let r=w(e),i;for(let a of t){if(a._zod.def.when){if(be(e)||!a._zod.def.when(e))continue}else if(r)continue;let t=e.issues.length,o=a._zod.check(e);if(o instanceof Promise&&n?.async===!1)throw new u;if(i||o instanceof Promise)i=(i??Promise.resolve()).then(async()=>{await o,e.issues.length!==t&&(r||=w(e,t))});else{if(e.issues.length===t)continue;r||=w(e,t)}}return i?i.then(()=>e):e},n=(n,i,a)=>{if(w(n))return n.aborted=!0,n;let o=t(i,r,a);if(o instanceof Promise){if(a.async===!1)throw new u;return o.then(t=>e._zod.parse(t,a))}return e._zod.parse(o,a)};e._zod.run=(i,a)=>{if(a.skipChecks)return e._zod.parse(i,a);if(a.direction===`backward`){let t=e._zod.parse({value:i.value,issues:[]},{...a,skipChecks:!0});return t instanceof Promise?t.then(e=>n(e,i,a)):n(t,i,a)}let o=e._zod.parse(i,a);if(o instanceof Promise){if(a.async===!1)throw new u;return o.then(e=>t(e,r,a))}return t(o,r,a)}}y(e,`~standard`,()=>({validate:t=>{try{let n=Ne(e,t);return n.success?{value:n.data}:{issues:n.error?.issues}}catch{return Fe(e,t).then(e=>e.success?{value:e.data}:{issues:e.error?.issues})}},vendor:`zod`,version:1}))}),zt=l(`$ZodString`,(e,t)=>{D.init(e,t),e._zod.pattern=[...e?._zod.bag?.patterns??[]].pop()??ht(e._zod.bag),e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=String(n.value)}catch{}return typeof n.value==`string`||n.issues.push({expected:`string`,code:`invalid_type`,input:n.value,inst:e}),n}}),O=l(`$ZodStringFormat`,(e,t)=>{kt.init(e,t),zt.init(e,t)}),Bt=l(`$ZodGUID`,(e,t)=>{t.pattern??=Ze,O.init(e,t)}),Vt=l(`$ZodUUID`,(e,t)=>{if(t.version){let e={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[t.version];if(e===void 0)throw Error(`Invalid UUID version: "${t.version}"`);t.pattern??=Qe(e)}else t.pattern??=Qe();O.init(e,t)}),Ht=l(`$ZodEmail`,(e,t)=>{t.pattern??=$e,O.init(e,t)}),Ut=l(`$ZodURL`,(e,t)=>{O.init(e,t),e._zod.check=n=>{try{let r=n.value.trim();if(!t.normalize&&t.protocol?.source===ct.source&&!/^https?:\/\//i.test(r)){n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid URL format`,input:n.value,inst:e,continue:!t.abort});return}let i=new URL(r);t.hostname&&(t.hostname.lastIndex=0,t.hostname.test(i.hostname)||n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid hostname`,pattern:t.hostname.source,input:n.value,inst:e,continue:!t.abort})),t.protocol&&(t.protocol.lastIndex=0,t.protocol.test(i.protocol.endsWith(`:`)?i.protocol.slice(0,-1):i.protocol)||n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid protocol`,pattern:t.protocol.source,input:n.value,inst:e,continue:!t.abort})),t.normalize?n.value=i.href:n.value=r;return}catch{n.issues.push({code:`invalid_format`,format:`url`,input:n.value,inst:e,continue:!t.abort})}}}),Wt=l(`$ZodEmoji`,(e,t)=>{t.pattern??=tt(),O.init(e,t)}),Gt=l(`$ZodNanoID`,(e,t)=>{t.pattern??=Ye,O.init(e,t)}),Kt=l(`$ZodCUID`,(e,t)=>{t.pattern??=We,O.init(e,t)}),qt=l(`$ZodCUID2`,(e,t)=>{t.pattern??=Ge,O.init(e,t)}),Jt=l(`$ZodULID`,(e,t)=>{t.pattern??=Ke,O.init(e,t)}),Yt=l(`$ZodXID`,(e,t)=>{t.pattern??=qe,O.init(e,t)}),Xt=l(`$ZodKSUID`,(e,t)=>{t.pattern??=Je,O.init(e,t)}),Zt=l(`$ZodISODateTime`,(e,t)=>{t.pattern??=mt(t),O.init(e,t)}),Qt=l(`$ZodISODate`,(e,t)=>{t.pattern??=dt,O.init(e,t)}),$t=l(`$ZodISOTime`,(e,t)=>{t.pattern??=pt(t),O.init(e,t)}),en=l(`$ZodISODuration`,(e,t)=>{t.pattern??=Xe,O.init(e,t)}),tn=l(`$ZodIPv4`,(e,t)=>{t.pattern??=nt,O.init(e,t),e._zod.bag.format=`ipv4`}),nn=l(`$ZodIPv6`,(e,t)=>{t.pattern??=rt,O.init(e,t),e._zod.bag.format=`ipv6`,e._zod.check=n=>{try{new URL(`http://[${n.value}]`)}catch{n.issues.push({code:`invalid_format`,format:`ipv6`,input:n.value,inst:e,continue:!t.abort})}}}),rn=l(`$ZodCIDRv4`,(e,t)=>{t.pattern??=it,O.init(e,t)}),an=l(`$ZodCIDRv6`,(e,t)=>{t.pattern??=at,O.init(e,t),e._zod.check=n=>{let r=n.value.split(`/`);try{if(r.length!==2)throw Error();let[e,t]=r;if(!t)throw Error();let n=Number(t);if(`${n}`!==t||n<0||n>128)throw Error();new URL(`http://[${e}]`)}catch{n.issues.push({code:`invalid_format`,format:`cidrv6`,input:n.value,inst:e,continue:!t.abort})}}});function on(e){if(e===``)return!0;if(/\s/.test(e)||e.length%4!=0)return!1;try{return atob(e),!0}catch{return!1}}var sn=l(`$ZodBase64`,(e,t)=>{t.pattern??=ot,O.init(e,t),e._zod.bag.contentEncoding=`base64`,e._zod.check=n=>{on(n.value)||n.issues.push({code:`invalid_format`,format:`base64`,input:n.value,inst:e,continue:!t.abort})}});function cn(e){if(!st.test(e))return!1;let t=e.replace(/[-_]/g,e=>e===`-`?`+`:`/`);return on(t.padEnd(Math.ceil(t.length/4)*4,`=`))}var ln=l(`$ZodBase64URL`,(e,t)=>{t.pattern??=st,O.init(e,t),e._zod.bag.contentEncoding=`base64url`,e._zod.check=n=>{cn(n.value)||n.issues.push({code:`invalid_format`,format:`base64url`,input:n.value,inst:e,continue:!t.abort})}}),un=l(`$ZodE164`,(e,t)=>{t.pattern??=lt,O.init(e,t)});function dn(e,t=null){try{let n=e.split(`.`);if(n.length!==3)return!1;let[r]=n;if(!r)return!1;let i=JSON.parse(atob(r));return!(`typ`in i&&i?.typ!==`JWT`||!i.alg||t&&(!(`alg`in i)||i.alg!==t))}catch{return!1}}var fn=l(`$ZodJWT`,(e,t)=>{O.init(e,t),e._zod.check=n=>{dn(n.value,t.alg)||n.issues.push({code:`invalid_format`,format:`jwt`,input:n.value,inst:e,continue:!t.abort})}}),pn=l(`$ZodNumber`,(e,t)=>{D.init(e,t),e._zod.pattern=e._zod.bag.pattern??_t,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=Number(n.value)}catch{}let i=n.value;if(typeof i==`number`&&!Number.isNaN(i)&&Number.isFinite(i))return n;let a=typeof i==`number`?Number.isNaN(i)?`NaN`:Number.isFinite(i)?void 0:`Infinity`:void 0;return n.issues.push({expected:`number`,code:`invalid_type`,input:i,inst:e,...a?{received:a}:{}}),n}}),mn=l(`$ZodNumberFormat`,(e,t)=>{Tt.init(e,t),pn.init(e,t)}),hn=l(`$ZodBoolean`,(e,t)=>{D.init(e,t),e._zod.pattern=vt,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=!!n.value}catch{}let i=n.value;return typeof i==`boolean`||n.issues.push({expected:`boolean`,code:`invalid_type`,input:i,inst:e}),n}}),gn=l(`$ZodUnknown`,(e,t)=>{D.init(e,t),e._zod.parse=e=>e}),_n=l(`$ZodNever`,(e,t)=>{D.init(e,t),e._zod.parse=(t,n)=>(t.issues.push({expected:`never`,code:`invalid_type`,input:t.value,inst:e}),t)});function vn(e,t,n){e.issues.length&&t.issues.push(...xe(n,e.issues)),t.value[n]=e.value}var yn=l(`$ZodArray`,(e,t)=>{D.init(e,t),e._zod.parse=(n,r)=>{let i=n.value;if(!Array.isArray(i))return n.issues.push({expected:`array`,code:`invalid_type`,input:i,inst:e}),n;n.value=Array(i.length);let a=[];for(let e=0;e<i.length;e++){let o=i[e],s=t.element._zod.run({value:o,issues:[]},r);s instanceof Promise?a.push(s.then(t=>vn(t,n,e))):vn(s,n,e)}return a.length?Promise.all(a).then(()=>n):n}});function bn(e,t,n,r,i,a){let o=n in r;if(e.issues.length){if(i&&a&&!o)return;t.issues.push(...xe(n,e.issues))}if(!o&&!i){e.issues.length||t.issues.push({code:`invalid_type`,expected:`nonoptional`,input:void 0,path:[n]});return}e.value===void 0?o&&(t.value[n]=void 0):t.value[n]=e.value}function xn(e){let t=Object.keys(e.shape);for(let n of t)if(!e.shape?.[n]?._zod?.traits?.has(`$ZodType`))throw Error(`Invalid element at key "${n}": expected a Zod schema`);let n=de(e.shape);return{...e,keys:t,keySet:new Set(t),numKeys:t.length,optionalKeys:new Set(n)}}function Sn(e,t,n,r,i,a){let o=[],s=i.keySet,c=i.catchall._zod,l=c.def.type,u=c.optin===`optional`,d=c.optout===`optional`;for(let i in t){if(i===`__proto__`||s.has(i))continue;if(l===`never`){o.push(i);continue}let a=c.run({value:t[i],issues:[]},r);a instanceof Promise?e.push(a.then(e=>bn(e,n,i,t,u,d))):bn(a,n,i,t,u,d)}return o.length&&n.issues.push({code:`unrecognized_keys`,keys:o,input:t,inst:a}),e.length?Promise.all(e).then(()=>n):n}var Cn=l(`$ZodObject`,(e,t)=>{if(D.init(e,t),!Object.getOwnPropertyDescriptor(t,`shape`)?.get){let e=t.shape;Object.defineProperty(t,"shape",{get:()=>{let n={...e};return Object.defineProperty(t,"shape",{value:n}),n}})}let n=g(()=>xn(t));y(e._zod,`propValues`,()=>{let e=t.shape,n={};for(let t in e){let r=e[t]._zod;if(r.values){n[t]??(n[t]=new Set);for(let e of r.values)n[t].add(e)}}return n});let r=ae,i=t.catchall,a;e._zod.parse=(t,o)=>{a??=n.value;let s=t.value;if(!r(s))return t.issues.push({expected:`object`,code:`invalid_type`,input:s,inst:e}),t;t.value={};let c=[],l=a.shape;for(let e of a.keys){let n=l[e],r=n._zod.optin===`optional`,i=n._zod.optout===`optional`,a=n._zod.run({value:s[e],issues:[]},o);a instanceof Promise?c.push(a.then(n=>bn(n,t,e,s,r,i))):bn(a,t,e,s,r,i)}return i?Sn(c,s,t,o,n.value,e):c.length?Promise.all(c).then(()=>t):t}}),wn=l(`$ZodObjectJIT`,(e,t)=>{Cn.init(e,t);let n=e._zod.parse,r=g(()=>xn(t)),i=e=>{let t=new Lt([`shape`,`payload`,`ctx`]),n=r.value,i=e=>{let t=ne(e);return`shape[${t}]._zod.run({ value: input[${t}], issues: [] }, ctx)`};t.write(`const input = payload.value;`);let a=Object.create(null),o=0;for(let e of n.keys)a[e]=`key_${o++}`;t.write(`const newResult = {};`);for(let r of n.keys){let n=a[r],o=ne(r),s=e[r],c=s?._zod?.optin===`optional`,l=s?._zod?.optout===`optional`;t.write(`const ${n} = ${i(r)};`),c&&l?t.write(`
        if (${n}.issues.length) {
          if (${o} in input) {
            payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${o}, ...iss.path] : [${o}]
            })));
          }
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `):c?t.write(`
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `):t.write(`
        const ${n}_present = ${o} in input;
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${o}]
          });
        }

        if (${n}_present) {
          if (${n}.value === undefined) {
            newResult[${o}] = undefined;
          } else {
            newResult[${o}] = ${n}.value;
          }
        }

      `)}t.write(`payload.value = newResult;`),t.write(`return payload;`);let s=t.compile();return(t,n)=>s(e,t,n)},a,o=ae,s=!f.jitless,c=s&&oe.value,l=t.catchall,u;e._zod.parse=(d,f)=>{u??=r.value;let p=d.value;return o(p)?s&&c&&f?.async===!1&&f.jitless!==!0?(a||=i(t.shape),d=a(d,f),l?Sn([],p,d,f,u,e):d):n(d,f):(d.issues.push({expected:`object`,code:`invalid_type`,input:p,inst:e}),d)}});function Tn(e,t,n,r){for(let n of e)if(n.issues.length===0)return t.value=n.value,t;let i=e.filter(e=>!w(e));return i.length===1?(t.value=i[0].value,i[0]):(t.issues.push({code:`invalid_union`,input:t.value,inst:n,errors:e.map(e=>e.issues.map(e=>T(e,r,p())))}),t)}var En=l(`$ZodUnion`,(e,t)=>{D.init(e,t),y(e._zod,`optin`,()=>t.options.some(e=>e._zod.optin===`optional`)?`optional`:void 0),y(e._zod,`optout`,()=>t.options.some(e=>e._zod.optout===`optional`)?`optional`:void 0),y(e._zod,`values`,()=>{if(t.options.every(e=>e._zod.values))return new Set(t.options.flatMap(e=>Array.from(e._zod.values)))}),y(e._zod,`pattern`,()=>{if(t.options.every(e=>e._zod.pattern)){let e=t.options.map(e=>e._zod.pattern);return RegExp(`^(${e.map(e=>v(e.source)).join(`|`)})$`)}});let n=t.options.length===1?t.options[0]._zod.run:null;e._zod.parse=(r,i)=>{if(n)return n(r,i);let a=!1,o=[];for(let e of t.options){let t=e._zod.run({value:r.value,issues:[]},i);if(t instanceof Promise)o.push(t),a=!0;else{if(t.issues.length===0)return t;o.push(t)}}return a?Promise.all(o).then(t=>Tn(t,r,e,i)):Tn(o,r,e,i)}}),Dn=l(`$ZodIntersection`,(e,t)=>{D.init(e,t),e._zod.parse=(e,n)=>{let r=e.value,i=t.left._zod.run({value:r,issues:[]},n),a=t.right._zod.run({value:r,issues:[]},n);return i instanceof Promise||a instanceof Promise?Promise.all([i,a]).then(([t,n])=>kn(e,t,n)):kn(e,i,a)}});function On(e,t){if(e===t||e instanceof Date&&t instanceof Date&&+e==+t)return{valid:!0,data:e};if(se(e)&&se(t)){let n=Object.keys(t),r=Object.keys(e).filter(e=>n.indexOf(e)!==-1),i={...e,...t};for(let n of r){let r=On(e[n],t[n]);if(!r.valid)return{valid:!1,mergeErrorPath:[n,...r.mergeErrorPath]};i[n]=r.data}return{valid:!0,data:i}}if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return{valid:!1,mergeErrorPath:[]};let n=[];for(let r=0;r<e.length;r++){let i=e[r],a=t[r],o=On(i,a);if(!o.valid)return{valid:!1,mergeErrorPath:[r,...o.mergeErrorPath]};n.push(o.data)}return{valid:!0,data:n}}return{valid:!1,mergeErrorPath:[]}}function kn(e,t,n){let r=new Map,i;for(let n of t.issues)if(n.code===`unrecognized_keys`){i??=n;for(let e of n.keys)r.has(e)||r.set(e,{}),r.get(e).l=!0}else e.issues.push(n);for(let t of n.issues)if(t.code===`unrecognized_keys`)for(let e of t.keys)r.has(e)||r.set(e,{}),r.get(e).r=!0;else e.issues.push(t);let a=[...r].filter(([,e])=>e.l&&e.r).map(([e])=>e);if(a.length&&i&&e.issues.push({...i,keys:a}),w(e))return e;let o=On(t.value,n.value);if(!o.valid)throw Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);return e.value=o.data,e}var An=l(`$ZodEnum`,(e,t)=>{D.init(e,t);let n=m(t.entries),r=new Set(n);e._zod.values=r,e._zod.pattern=RegExp(`^(${n.filter(e=>le.has(typeof e)).map(e=>typeof e==`string`?ue(e):e.toString()).join(`|`)})$`),e._zod.parse=(t,i)=>{let a=t.value;return r.has(a)||t.issues.push({code:`invalid_value`,values:n,input:a,inst:e}),t}}),jn=l(`$ZodTransform`,(e,t)=>{D.init(e,t),e._zod.optin=`optional`,e._zod.parse=(n,r)=>{if(r.direction===`backward`)throw new d(e.constructor.name);let i=t.transform(n.value,n);if(r.async)return(i instanceof Promise?i:Promise.resolve(i)).then(e=>(n.value=e,n.fallback=!0,n));if(i instanceof Promise)throw new u;return n.value=i,n.fallback=!0,n}});function Mn(e,t){return t===void 0&&(e.issues.length||e.fallback)?{issues:[],value:void 0}:e}var Nn=l(`$ZodOptional`,(e,t)=>{D.init(e,t),e._zod.optin=`optional`,e._zod.optout=`optional`,y(e._zod,`values`,()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,void 0]):void 0),y(e._zod,`pattern`,()=>{let e=t.innerType._zod.pattern;return e?RegExp(`^(${v(e.source)})?$`):void 0}),e._zod.parse=(e,n)=>{if(t.innerType._zod.optin===`optional`){let r=e.value,i=t.innerType._zod.run(e,n);return i instanceof Promise?i.then(e=>Mn(e,r)):Mn(i,r)}return e.value===void 0?e:t.innerType._zod.run(e,n)}}),Pn=l(`$ZodExactOptional`,(e,t)=>{Nn.init(e,t),y(e._zod,`values`,()=>t.innerType._zod.values),y(e._zod,`pattern`,()=>t.innerType._zod.pattern),e._zod.parse=(e,n)=>t.innerType._zod.run(e,n)}),Fn=l(`$ZodNullable`,(e,t)=>{D.init(e,t),y(e._zod,`optin`,()=>t.innerType._zod.optin),y(e._zod,`optout`,()=>t.innerType._zod.optout),y(e._zod,`pattern`,()=>{let e=t.innerType._zod.pattern;return e?RegExp(`^(${v(e.source)}|null)$`):void 0}),y(e._zod,`values`,()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,null]):void 0),e._zod.parse=(e,n)=>e.value===null?e:t.innerType._zod.run(e,n)}),In=l(`$ZodDefault`,(e,t)=>{D.init(e,t),e._zod.optin=`optional`,y(e._zod,`values`,()=>t.innerType._zod.values),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);if(e.value===void 0)return e.value=t.defaultValue,e;let r=t.innerType._zod.run(e,n);return r instanceof Promise?r.then(e=>Ln(e,t)):Ln(r,t)}});function Ln(e,t){return e.value===void 0&&(e.value=t.defaultValue),e}var Rn=l(`$ZodPrefault`,(e,t)=>{D.init(e,t),e._zod.optin=`optional`,y(e._zod,`values`,()=>t.innerType._zod.values),e._zod.parse=(e,n)=>(n.direction===`backward`||e.value===void 0&&(e.value=t.defaultValue),t.innerType._zod.run(e,n))}),zn=l(`$ZodNonOptional`,(e,t)=>{D.init(e,t),y(e._zod,`values`,()=>{let e=t.innerType._zod.values;return e?new Set([...e].filter(e=>e!==void 0)):void 0}),e._zod.parse=(n,r)=>{let i=t.innerType._zod.run(n,r);return i instanceof Promise?i.then(t=>Bn(t,e)):Bn(i,e)}});function Bn(e,t){return!e.issues.length&&e.value===void 0&&e.issues.push({code:`invalid_type`,expected:`nonoptional`,input:e.value,inst:t}),e}var Vn=l(`$ZodCatch`,(e,t)=>{D.init(e,t),e._zod.optin=`optional`,y(e._zod,`optout`,()=>t.innerType._zod.optout),y(e._zod,`values`,()=>t.innerType._zod.values),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);let r=t.innerType._zod.run(e,n);return r instanceof Promise?r.then(r=>(e.value=r.value,r.issues.length&&(e.value=t.catchValue({...e,error:{issues:r.issues.map(e=>T(e,n,p()))},input:e.value}),e.issues=[],e.fallback=!0),e)):(e.value=r.value,r.issues.length&&(e.value=t.catchValue({...e,error:{issues:r.issues.map(e=>T(e,n,p()))},input:e.value}),e.issues=[],e.fallback=!0),e)}}),Hn=l(`$ZodPipe`,(e,t)=>{D.init(e,t),y(e._zod,`values`,()=>t.in._zod.values),y(e._zod,`optin`,()=>t.in._zod.optin),y(e._zod,`optout`,()=>t.out._zod.optout),y(e._zod,`propValues`,()=>t.in._zod.propValues),e._zod.parse=(e,n)=>{if(n.direction===`backward`){let r=t.out._zod.run(e,n);return r instanceof Promise?r.then(e=>Un(e,t.in,n)):Un(r,t.in,n)}let r=t.in._zod.run(e,n);return r instanceof Promise?r.then(e=>Un(e,t.out,n)):Un(r,t.out,n)}});function Un(e,t,n){return e.issues.length?(e.aborted=!0,e):t._zod.run({value:e.value,issues:e.issues,fallback:e.fallback},n)}var Wn=l(`$ZodReadonly`,(e,t)=>{D.init(e,t),y(e._zod,`propValues`,()=>t.innerType._zod.propValues),y(e._zod,`values`,()=>t.innerType._zod.values),y(e._zod,`optin`,()=>t.innerType?._zod?.optin),y(e._zod,`optout`,()=>t.innerType?._zod?.optout),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);let r=t.innerType._zod.run(e,n);return r instanceof Promise?r.then(Gn):Gn(r)}});function Gn(e){return e.value=Object.freeze(e.value),e}var Kn=l(`$ZodCustom`,(e,t)=>{E.init(e,t),D.init(e,t),e._zod.parse=(e,t)=>e,e._zod.check=n=>{let r=n.value,i=t.fn(r);if(i instanceof Promise)return i.then(t=>qn(t,n,r,e));qn(i,n,r,e)}});function qn(e,t,n,r){if(!e){let e={code:`custom`,input:n,inst:r,path:[...r._zod.def.path??[]],continue:!r._zod.def.abort};r._zod.def.params&&(e.params=r._zod.def.params),t.issues.push(we(e))}}var Jn,Yn=class{constructor(){this._map=new WeakMap,this._idmap=new Map}add(e,...t){let n=t[0];return this._map.set(e,n),n&&typeof n==`object`&&`id`in n&&this._idmap.set(n.id,e),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(e){let t=this._map.get(e);return t&&typeof t==`object`&&`id`in t&&this._idmap.delete(t.id),this._map.delete(e),this}get(e){let t=e._zod.parent;if(t){let n={...this.get(t)??{}};delete n.id;let r={...n,...this._map.get(e)};return Object.keys(r).length?r:void 0}return this._map.get(e)}has(e){return this._map.has(e)}};function Xn(){return new Yn}(Jn=globalThis).__zod_globalRegistry??(Jn.__zod_globalRegistry=Xn());var Zn=globalThis.__zod_globalRegistry;function Qn(e,t){return new e({type:`string`,...C(t)})}function $n(e,t){return new e({type:`string`,format:`email`,check:`string_format`,abort:!1,...C(t)})}function er(e,t){return new e({type:`string`,format:`guid`,check:`string_format`,abort:!1,...C(t)})}function tr(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,...C(t)})}function nr(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v4`,...C(t)})}function rr(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v6`,...C(t)})}function ir(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v7`,...C(t)})}function ar(e,t){return new e({type:`string`,format:`url`,check:`string_format`,abort:!1,...C(t)})}function or(e,t){return new e({type:`string`,format:`emoji`,check:`string_format`,abort:!1,...C(t)})}function sr(e,t){return new e({type:`string`,format:`nanoid`,check:`string_format`,abort:!1,...C(t)})}function cr(e,t){return new e({type:`string`,format:`cuid`,check:`string_format`,abort:!1,...C(t)})}function lr(e,t){return new e({type:`string`,format:`cuid2`,check:`string_format`,abort:!1,...C(t)})}function ur(e,t){return new e({type:`string`,format:`ulid`,check:`string_format`,abort:!1,...C(t)})}function dr(e,t){return new e({type:`string`,format:`xid`,check:`string_format`,abort:!1,...C(t)})}function fr(e,t){return new e({type:`string`,format:`ksuid`,check:`string_format`,abort:!1,...C(t)})}function pr(e,t){return new e({type:`string`,format:`ipv4`,check:`string_format`,abort:!1,...C(t)})}function mr(e,t){return new e({type:`string`,format:`ipv6`,check:`string_format`,abort:!1,...C(t)})}function hr(e,t){return new e({type:`string`,format:`cidrv4`,check:`string_format`,abort:!1,...C(t)})}function gr(e,t){return new e({type:`string`,format:`cidrv6`,check:`string_format`,abort:!1,...C(t)})}function _r(e,t){return new e({type:`string`,format:`base64`,check:`string_format`,abort:!1,...C(t)})}function vr(e,t){return new e({type:`string`,format:`base64url`,check:`string_format`,abort:!1,...C(t)})}function yr(e,t){return new e({type:`string`,format:`e164`,check:`string_format`,abort:!1,...C(t)})}function br(e,t){return new e({type:`string`,format:`jwt`,check:`string_format`,abort:!1,...C(t)})}function xr(e,t){return new e({type:`string`,format:`datetime`,check:`string_format`,offset:!1,local:!1,precision:null,...C(t)})}function Sr(e,t){return new e({type:`string`,format:`date`,check:`string_format`,...C(t)})}function Cr(e,t){return new e({type:`string`,format:`time`,check:`string_format`,precision:null,...C(t)})}function wr(e,t){return new e({type:`string`,format:`duration`,check:`string_format`,...C(t)})}function Tr(e,t){return new e({type:`number`,checks:[],...C(t)})}function Er(e,t){return new e({type:`number`,check:`number_format`,abort:!1,format:`safeint`,...C(t)})}function Dr(e,t){return new e({type:`boolean`,...C(t)})}function Or(e){return new e({type:`unknown`})}function kr(e,t){return new e({type:`never`,...C(t)})}function Ar(e,t){return new St({check:`less_than`,...C(t),value:e,inclusive:!1})}function jr(e,t){return new St({check:`less_than`,...C(t),value:e,inclusive:!0})}function Mr(e,t){return new Ct({check:`greater_than`,...C(t),value:e,inclusive:!1})}function Nr(e,t){return new Ct({check:`greater_than`,...C(t),value:e,inclusive:!0})}function Pr(e,t){return new wt({check:`multiple_of`,...C(t),value:e})}function Fr(e,t){return new Et({check:`max_length`,...C(t),maximum:e})}function Ir(e,t){return new Dt({check:`min_length`,...C(t),minimum:e})}function Lr(e,t){return new Ot({check:`length_equals`,...C(t),length:e})}function Rr(e,t){return new At({check:`string_format`,format:`regex`,...C(t),pattern:e})}function zr(e){return new jt({check:`string_format`,format:`lowercase`,...C(e)})}function Br(e){return new Mt({check:`string_format`,format:`uppercase`,...C(e)})}function Vr(e,t){return new Nt({check:`string_format`,format:`includes`,...C(t),includes:e})}function Hr(e,t){return new Pt({check:`string_format`,format:`starts_with`,...C(t),prefix:e})}function Ur(e,t){return new Ft({check:`string_format`,format:`ends_with`,...C(t),suffix:e})}function Wr(e){return new It({check:`overwrite`,tx:e})}function Gr(e){return Wr(t=>t.normalize(e))}function Kr(){return Wr(e=>e.trim())}function qr(){return Wr(e=>e.toLowerCase())}function Jr(){return Wr(e=>e.toUpperCase())}function Yr(){return Wr(e=>re(e))}function Xr(e,t,n){return new e({type:`array`,element:t,...C(n)})}function Zr(e,t,n){return new e({type:`custom`,check:`custom`,fn:t,...C(n)})}function Qr(e,t){let n=$r(t=>(t.addIssue=e=>{if(typeof e==`string`)t.issues.push(we(e,t.value,n._zod.def));else{let r=e;r.fatal&&(r.continue=!1),r.code??=`custom`,r.input??=t.value,r.inst??=n,r.continue??=!n._zod.def.abort,t.issues.push(we(r))}},e(t.value,t)),t);return n}function $r(e,t){let n=new E({check:`custom`,...C(t)});return n._zod.check=e,n}function ei(e){let t=e?.target??`draft-2020-12`;return t===`draft-4`&&(t=`draft-04`),t===`draft-7`&&(t=`draft-07`),{processors:e.processors??{},metadataRegistry:e?.metadata??Zn,target:t,unrepresentable:e?.unrepresentable??`throw`,override:e?.override??(()=>{}),io:e?.io??`output`,counter:0,seen:new Map,cycles:e?.cycles??`ref`,reused:e?.reused??`inline`,external:e?.external??void 0}}function k(e,t,n={path:[],schemaPath:[]}){var r;let i=e._zod.def,a=t.seen.get(e);if(a)return a.count++,n.schemaPath.includes(e)&&(a.cycle=n.path),a.schema;let o={schema:{},count:1,cycle:void 0,path:n.path};t.seen.set(e,o);let s=e._zod.toJSONSchema?.();if(s)o.schema=s;else{let r={...n,schemaPath:[...n.schemaPath,e],path:n.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(t,o.schema,r);else{let n=o.schema,a=t.processors[i.type];if(!a)throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);a(e,t,n,r)}let a=e._zod.parent;a&&(o.ref||=a,k(a,t,r),t.seen.get(a).isParent=!0)}let c=t.metadataRegistry.get(e);return c&&Object.assign(o.schema,c),t.io===`input`&&A(e)&&(delete o.schema.examples,delete o.schema.default),t.io===`input`&&`_prefault`in o.schema&&((r=o.schema).default??(r.default=o.schema._prefault)),delete o.schema._prefault,t.seen.get(e).schema}function ti(e,t){let n=e.seen.get(t);if(!n)throw Error(`Unprocessed schema. This is a bug in Zod.`);let r=new Map;for(let t of e.seen.entries()){let n=e.metadataRegistry.get(t[0])?.id;if(n){let e=r.get(n);if(e&&e!==t[0])throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);r.set(n,t[0])}}let i=t=>{let r=e.target===`draft-2020-12`?`$defs`:`definitions`;if(e.external){let n=e.external.registry.get(t[0])?.id,i=e.external.uri??(e=>e);if(n)return{ref:i(n)};let a=t[1].defId??t[1].schema.id??`schema${e.counter++}`;return t[1].defId=a,{defId:a,ref:`${i(`__shared`)}#/${r}/${a}`}}if(t[1]===n)return{ref:`#`};let i=`#/${r}/`,a=t[1].schema.id??`__schema${e.counter++}`;return{defId:a,ref:i+a}},a=e=>{if(e[1].schema.$ref)return;let t=e[1],{ref:n,defId:r}=i(e);t.def={...t.schema},r&&(t.defId=r);let a=t.schema;for(let e in a)delete a[e];a.$ref=n};if(e.cycles===`throw`)for(let t of e.seen.entries()){let e=t[1];if(e.cycle)throw Error(`Cycle detected: #/${e.cycle?.join(`/`)}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(let n of e.seen.entries()){let r=n[1];if(t===n[0]){a(n);continue}if(e.external){let r=e.external.registry.get(n[0])?.id;if(t!==n[0]&&r){a(n);continue}}if(e.metadataRegistry.get(n[0])?.id){a(n);continue}if(r.cycle){a(n);continue}if(r.count>1&&e.reused===`ref`){a(n);continue}}}function ni(e,t){let n=e.seen.get(t);if(!n)throw Error(`Unprocessed schema. This is a bug in Zod.`);let r=t=>{let n=e.seen.get(t);if(n.ref===null)return;let i=n.def??n.schema,a={...i},o=n.ref;if(n.ref=null,o){r(o);let n=e.seen.get(o),s=n.schema;if(s.$ref&&(e.target===`draft-07`||e.target===`draft-04`||e.target===`openapi-3.0`)?(i.allOf=i.allOf??[],i.allOf.push(s)):Object.assign(i,s),Object.assign(i,a),t._zod.parent===o)for(let e in i)e===`$ref`||e===`allOf`||e in a||delete i[e];if(s.$ref&&n.def)for(let e in i)e===`$ref`||e===`allOf`||e in n.def&&JSON.stringify(i[e])===JSON.stringify(n.def[e])&&delete i[e]}let s=t._zod.parent;if(s&&s!==o){r(s);let t=e.seen.get(s);if(t?.schema.$ref&&(i.$ref=t.schema.$ref,t.def))for(let e in i)e===`$ref`||e===`allOf`||e in t.def&&JSON.stringify(i[e])===JSON.stringify(t.def[e])&&delete i[e]}e.override({zodSchema:t,jsonSchema:i,path:n.path??[]})};for(let t of[...e.seen.entries()].reverse())r(t[0]);let i={};if(e.target===`draft-2020-12`?i.$schema=`https://json-schema.org/draft/2020-12/schema`:e.target===`draft-07`?i.$schema=`http://json-schema.org/draft-07/schema#`:e.target===`draft-04`?i.$schema=`http://json-schema.org/draft-04/schema#`:e.target,e.external?.uri){let n=e.external.registry.get(t)?.id;if(!n)throw Error("Schema is missing an `id` property");i.$id=e.external.uri(n)}Object.assign(i,n.def??n.schema);let a=e.metadataRegistry.get(t)?.id;a!==void 0&&i.id===a&&delete i.id;let o=e.external?.defs??{};for(let t of e.seen.entries()){let e=t[1];e.def&&e.defId&&(e.def.id===e.defId&&delete e.def.id,o[e.defId]=e.def)}e.external||Object.keys(o).length>0&&(e.target===`draft-2020-12`?i.$defs=o:i.definitions=o);try{let n=JSON.parse(JSON.stringify(i));return Object.defineProperty(n,"~standard",{value:{...t[`~standard`],jsonSchema:{input:ii(t,`input`,e.processors),output:ii(t,`output`,e.processors)}},enumerable:!1,writable:!1}),n}catch{throw Error(`Error converting schema to JSON.`)}}function A(e,t){let n=t??{seen:new Set};if(n.seen.has(e))return!1;n.seen.add(e);let r=e._zod.def;if(r.type===`transform`)return!0;if(r.type===`array`)return A(r.element,n);if(r.type===`set`)return A(r.valueType,n);if(r.type===`lazy`)return A(r.getter(),n);if(r.type===`promise`||r.type===`optional`||r.type===`nonoptional`||r.type===`nullable`||r.type===`readonly`||r.type==="default"||r.type===`prefault`)return A(r.innerType,n);if(r.type===`intersection`)return A(r.left,n)||A(r.right,n);if(r.type===`record`||r.type===`map`)return A(r.keyType,n)||A(r.valueType,n);if(r.type===`pipe`)return e._zod.traits.has(`$ZodCodec`)?!0:A(r.in,n)||A(r.out,n);if(r.type===`object`){for(let e in r.shape)if(A(r.shape[e],n))return!0;return!1}if(r.type===`union`){for(let e of r.options)if(A(e,n))return!0;return!1}if(r.type===`tuple`){for(let e of r.items)if(A(e,n))return!0;return!!(r.rest&&A(r.rest,n))}return!1}var ri=(e,t={})=>n=>{let r=ei({...n,processors:t});return k(e,r),ti(r,e),ni(r,e)},ii=(e,t,n={})=>r=>{let{libraryOptions:i,target:a}=r??{},o=ei({...i??{},target:a,io:t,processors:n});return k(e,o),ti(o,e),ni(o,e)},ai={guid:`uuid`,url:`uri`,datetime:`date-time`,json_string:`json-string`,regex:``},oi=(e,t,n,r)=>{let i=n;i.type=`string`;let{minimum:a,maximum:o,format:s,patterns:c,contentEncoding:l}=e._zod.bag;if(typeof a==`number`&&(i.minLength=a),typeof o==`number`&&(i.maxLength=o),s&&(i.format=ai[s]??s,i.format===``&&delete i.format,s===`time`&&delete i.format),l&&(i.contentEncoding=l),c&&c.size>0){let e=[...c];e.length===1?i.pattern=e[0].source:e.length>1&&(i.allOf=[...e.map(e=>({...t.target===`draft-07`||t.target===`draft-04`||t.target===`openapi-3.0`?{type:`string`}:{},pattern:e.source}))])}},si=(e,t,n,r)=>{let i=n,{minimum:a,maximum:o,format:s,multipleOf:c,exclusiveMaximum:l,exclusiveMinimum:u}=e._zod.bag;typeof s==`string`&&s.includes(`int`)?i.type=`integer`:i.type=`number`;let d=typeof u==`number`&&u>=(a??-1/0),f=typeof l==`number`&&l<=(o??1/0),p=t.target===`draft-04`||t.target===`openapi-3.0`;d?p?(i.minimum=u,i.exclusiveMinimum=!0):i.exclusiveMinimum=u:typeof a==`number`&&(i.minimum=a),f?p?(i.maximum=l,i.exclusiveMaximum=!0):i.exclusiveMaximum=l:typeof o==`number`&&(i.maximum=o),typeof c==`number`&&(i.multipleOf=c)},ci=(e,t,n,r)=>{n.type=`boolean`},li=(e,t,n,r)=>{n.not={}},ui=(e,t,n,r)=>{let i=e._zod.def,a=m(i.entries);a.every(e=>typeof e==`number`)&&(n.type=`number`),a.every(e=>typeof e==`string`)&&(n.type=`string`),n.enum=a},di=(e,t,n,r)=>{if(t.unrepresentable===`throw`)throw Error(`Custom types cannot be represented in JSON Schema`)},fi=(e,t,n,r)=>{if(t.unrepresentable===`throw`)throw Error(`Transforms cannot be represented in JSON Schema`)},pi=(e,t,n,r)=>{let i=n,a=e._zod.def,{minimum:o,maximum:s}=e._zod.bag;typeof o==`number`&&(i.minItems=o),typeof s==`number`&&(i.maxItems=s),i.type=`array`,i.items=k(a.element,t,{...r,path:[...r.path,`items`]})},mi=(e,t,n,r)=>{let i=n,a=e._zod.def;i.type=`object`,i.properties={};let o=a.shape;for(let e in o)i.properties[e]=k(o[e],t,{...r,path:[...r.path,`properties`,e]});let s=new Set(Object.keys(o)),c=new Set([...s].filter(e=>{let n=a.shape[e]._zod;return t.io===`input`?n.optin===void 0:n.optout===void 0}));c.size>0&&(i.required=Array.from(c)),a.catchall?._zod.def.type===`never`?i.additionalProperties=!1:a.catchall?a.catchall&&(i.additionalProperties=k(a.catchall,t,{...r,path:[...r.path,`additionalProperties`]})):t.io===`output`&&(i.additionalProperties=!1)},hi=(e,t,n,r)=>{let i=e._zod.def,a=i.inclusive===!1,o=i.options.map((e,n)=>k(e,t,{...r,path:[...r.path,a?`oneOf`:`anyOf`,n]}));a?n.oneOf=o:n.anyOf=o},gi=(e,t,n,r)=>{let i=e._zod.def,a=k(i.left,t,{...r,path:[...r.path,`allOf`,0]}),o=k(i.right,t,{...r,path:[...r.path,`allOf`,1]}),s=e=>`allOf`in e&&Object.keys(e).length===1;n.allOf=[...s(a)?a.allOf:[a],...s(o)?o.allOf:[o]]},_i=(e,t,n,r)=>{let i=e._zod.def,a=k(i.innerType,t,r),o=t.seen.get(e);t.target===`openapi-3.0`?(o.ref=i.innerType,n.nullable=!0):n.anyOf=[a,{type:`null`}]},vi=(e,t,n,r)=>{let i=e._zod.def;k(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType},yi=(e,t,n,r)=>{let i=e._zod.def;k(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType,n.default=JSON.parse(JSON.stringify(i.defaultValue))},bi=(e,t,n,r)=>{let i=e._zod.def;k(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType,t.io===`input`&&(n._prefault=JSON.parse(JSON.stringify(i.defaultValue)))},xi=(e,t,n,r)=>{let i=e._zod.def;k(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType;let o;try{o=i.catchValue(void 0)}catch{throw Error(`Dynamic catch values are not supported in JSON Schema`)}n.default=o},Si=(e,t,n,r)=>{let i=e._zod.def,a=i.in._zod.traits.has(`$ZodTransform`),o=t.io===`input`?a?i.out:i.in:i.out;k(o,t,r);let s=t.seen.get(e);s.ref=o},Ci=(e,t,n,r)=>{let i=e._zod.def;k(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType,n.readOnly=!0},wi=(e,t,n,r)=>{let i=e._zod.def;k(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType},Ti=l(`ZodISODateTime`,(e,t)=>{Zt.init(e,t),P.init(e,t)});function Ei(e){return xr(Ti,e)}var Di=l(`ZodISODate`,(e,t)=>{Qt.init(e,t),P.init(e,t)});function Oi(e){return Sr(Di,e)}var ki=l(`ZodISOTime`,(e,t)=>{$t.init(e,t),P.init(e,t)});function Ai(e){return Cr(ki,e)}var ji=l(`ZodISODuration`,(e,t)=>{en.init(e,t),P.init(e,t)});function Mi(e){return wr(ji,e)}var j=l(`ZodError`,(e,t)=>{Ee.init(e,t),e.name=`ZodError`,Object.defineProperties(e,{format:{value:t=>ke(e,t)},flatten:{value:t=>Oe(e,t)},addIssue:{value:t=>{e.issues.push(t),e.message=JSON.stringify(e.issues,h,2)}},addIssues:{value:t=>{e.issues.push(...t),e.message=JSON.stringify(e.issues,h,2)}},isEmpty:{get(){return e.issues.length===0}}})},{Parent:Error}),Ni=Ae(j),Pi=je(j),Fi=Me(j),Ii=Pe(j),Li=Ie(j),Ri=Le(j),zi=Re(j),Bi=ze(j),Vi=Be(j),Hi=Ve(j),Ui=He(j),Wi=Ue(j),Gi=new WeakMap;function Ki(e,t,n){let r=Object.getPrototypeOf(e),i=Gi.get(r);if(i||(i=new Set,Gi.set(r,i)),!i.has(t)){i.add(t);for(let e in n){let t=n[e];Object.defineProperty(r,e,{configurable:!0,enumerable:!1,get(){let n=t.bind(this);return Object.defineProperty(this,e,{configurable:!0,writable:!0,enumerable:!0,value:n}),n},set(t){Object.defineProperty(this,e,{configurable:!0,writable:!0,enumerable:!0,value:t})}})}}}var M=l(`ZodType`,(e,t)=>(D.init(e,t),Object.assign(e[`~standard`],{jsonSchema:{input:ii(e,`input`),output:ii(e,`output`)}}),e.toJSONSchema=ri(e,{}),e.def=t,e.type=t.type,Object.defineProperty(e,"_def",{value:t}),e.parse=(t,n)=>Ni(e,t,n,{callee:e.parse}),e.safeParse=(t,n)=>Fi(e,t,n),e.parseAsync=async(t,n)=>Pi(e,t,n,{callee:e.parseAsync}),e.safeParseAsync=async(t,n)=>Ii(e,t,n),e.spa=e.safeParseAsync,e.encode=(t,n)=>Li(e,t,n),e.decode=(t,n)=>Ri(e,t,n),e.encodeAsync=async(t,n)=>zi(e,t,n),e.decodeAsync=async(t,n)=>Bi(e,t,n),e.safeEncode=(t,n)=>Vi(e,t,n),e.safeDecode=(t,n)=>Hi(e,t,n),e.safeEncodeAsync=async(t,n)=>Ui(e,t,n),e.safeDecodeAsync=async(t,n)=>Wi(e,t,n),Ki(e,`ZodType`,{check(...e){let t=this.def;return this.clone(x(t,{checks:[...t.checks??[],...e.map(e=>typeof e==`function`?{_zod:{check:e,def:{check:`custom`},onattach:[]}}:e)]}),{parent:!0})},with(...e){return this.check(...e)},clone(e,t){return S(this,e,t)},brand(){return this},register(e,t){return e.add(this,t),this},refine(e,t){return this.check(to(e,t))},superRefine(e,t){return this.check(no(e,t))},overwrite(e){return this.check(Wr(e))},optional(){return La(this)},exactOptional(){return za(this)},nullable(){return Va(this)},nullish(){return La(Va(this))},nonoptional(e){return qa(this,e)},array(){return Ta(this)},or(e){return ka([this,e])},and(e){return ja(this,e)},transform(e){return Za(this,Fa(e))},default(e){return Ua(this,e)},prefault(e){return Ga(this,e)},catch(e){return Ya(this,e)},pipe(e){return Za(this,e)},readonly(){return $a(this)},describe(e){let t=this.clone();return Zn.add(t,{description:e}),t},meta(...e){if(e.length===0)return Zn.get(this);let t=this.clone();return Zn.add(t,e[0]),t},isOptional(){return this.safeParse(void 0).success},isNullable(){return this.safeParse(null).success},apply(e){return e(this)}}),Object.defineProperty(e,"description",{get(){return Zn.get(e)?.description},configurable:!0}),e)),qi=l(`_ZodString`,(e,t)=>{zt.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>oi(e,t,n,r);let n=e._zod.bag;e.format=n.format??null,e.minLength=n.minimum??null,e.maxLength=n.maximum??null,Ki(e,`_ZodString`,{regex(...e){return this.check(Rr(...e))},includes(...e){return this.check(Vr(...e))},startsWith(...e){return this.check(Hr(...e))},endsWith(...e){return this.check(Ur(...e))},min(...e){return this.check(Ir(...e))},max(...e){return this.check(Fr(...e))},length(...e){return this.check(Lr(...e))},nonempty(...e){return this.check(Ir(1,...e))},lowercase(e){return this.check(zr(e))},uppercase(e){return this.check(Br(e))},trim(){return this.check(Kr())},normalize(...e){return this.check(Gr(...e))},toLowerCase(){return this.check(qr())},toUpperCase(){return this.check(Jr())},slugify(){return this.check(Yr())}})}),Ji=l(`ZodString`,(e,t)=>{zt.init(e,t),qi.init(e,t),e.email=t=>e.check($n(Yi,t)),e.url=t=>e.check(ar(Qi,t)),e.jwt=t=>e.check(br(pa,t)),e.emoji=t=>e.check(or($i,t)),e.guid=t=>e.check(er(Xi,t)),e.uuid=t=>e.check(tr(Zi,t)),e.uuidv4=t=>e.check(nr(Zi,t)),e.uuidv6=t=>e.check(rr(Zi,t)),e.uuidv7=t=>e.check(ir(Zi,t)),e.nanoid=t=>e.check(sr(ea,t)),e.guid=t=>e.check(er(Xi,t)),e.cuid=t=>e.check(cr(ta,t)),e.cuid2=t=>e.check(lr(na,t)),e.ulid=t=>e.check(ur(ra,t)),e.base64=t=>e.check(_r(ua,t)),e.base64url=t=>e.check(vr(da,t)),e.xid=t=>e.check(dr(ia,t)),e.ksuid=t=>e.check(fr(aa,t)),e.ipv4=t=>e.check(pr(oa,t)),e.ipv6=t=>e.check(mr(sa,t)),e.cidrv4=t=>e.check(hr(ca,t)),e.cidrv6=t=>e.check(gr(la,t)),e.e164=t=>e.check(yr(fa,t)),e.datetime=t=>e.check(Ei(t)),e.date=t=>e.check(Oi(t)),e.time=t=>e.check(Ai(t)),e.duration=t=>e.check(Mi(t))});function N(e){return Qn(Ji,e)}var P=l(`ZodStringFormat`,(e,t)=>{O.init(e,t),qi.init(e,t)}),Yi=l(`ZodEmail`,(e,t)=>{Ht.init(e,t),P.init(e,t)}),Xi=l(`ZodGUID`,(e,t)=>{Bt.init(e,t),P.init(e,t)}),Zi=l(`ZodUUID`,(e,t)=>{Vt.init(e,t),P.init(e,t)}),Qi=l(`ZodURL`,(e,t)=>{Ut.init(e,t),P.init(e,t)}),$i=l(`ZodEmoji`,(e,t)=>{Wt.init(e,t),P.init(e,t)}),ea=l(`ZodNanoID`,(e,t)=>{Gt.init(e,t),P.init(e,t)}),ta=l(`ZodCUID`,(e,t)=>{Kt.init(e,t),P.init(e,t)}),na=l(`ZodCUID2`,(e,t)=>{qt.init(e,t),P.init(e,t)}),ra=l(`ZodULID`,(e,t)=>{Jt.init(e,t),P.init(e,t)}),ia=l(`ZodXID`,(e,t)=>{Yt.init(e,t),P.init(e,t)}),aa=l(`ZodKSUID`,(e,t)=>{Xt.init(e,t),P.init(e,t)}),oa=l(`ZodIPv4`,(e,t)=>{tn.init(e,t),P.init(e,t)}),sa=l(`ZodIPv6`,(e,t)=>{nn.init(e,t),P.init(e,t)}),ca=l(`ZodCIDRv4`,(e,t)=>{rn.init(e,t),P.init(e,t)}),la=l(`ZodCIDRv6`,(e,t)=>{an.init(e,t),P.init(e,t)}),ua=l(`ZodBase64`,(e,t)=>{sn.init(e,t),P.init(e,t)}),da=l(`ZodBase64URL`,(e,t)=>{ln.init(e,t),P.init(e,t)}),fa=l(`ZodE164`,(e,t)=>{un.init(e,t),P.init(e,t)}),pa=l(`ZodJWT`,(e,t)=>{fn.init(e,t),P.init(e,t)}),ma=l(`ZodNumber`,(e,t)=>{pn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>si(e,t,n,r),Ki(e,`ZodNumber`,{gt(e,t){return this.check(Mr(e,t))},gte(e,t){return this.check(Nr(e,t))},min(e,t){return this.check(Nr(e,t))},lt(e,t){return this.check(Ar(e,t))},lte(e,t){return this.check(jr(e,t))},max(e,t){return this.check(jr(e,t))},int(e){return this.check(_a(e))},safe(e){return this.check(_a(e))},positive(e){return this.check(Mr(0,e))},nonnegative(e){return this.check(Nr(0,e))},negative(e){return this.check(Ar(0,e))},nonpositive(e){return this.check(jr(0,e))},multipleOf(e,t){return this.check(Pr(e,t))},step(e,t){return this.check(Pr(e,t))},finite(){return this}});let n=e._zod.bag;e.minValue=Math.max(n.minimum??-1/0,n.exclusiveMinimum??-1/0)??null,e.maxValue=Math.min(n.maximum??1/0,n.exclusiveMaximum??1/0)??null,e.isInt=(n.format??``).includes(`int`)||Number.isSafeInteger(n.multipleOf??.5),e.isFinite=!0,e.format=n.format??null});function ha(e){return Tr(ma,e)}var ga=l(`ZodNumberFormat`,(e,t)=>{mn.init(e,t),ma.init(e,t)});function _a(e){return Er(ga,e)}var va=l(`ZodBoolean`,(e,t)=>{hn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>ci(e,t,n,r)});function ya(e){return Dr(va,e)}var ba=l(`ZodUnknown`,(e,t)=>{gn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(e,t,n)=>void 0});function xa(){return Or(ba)}var Sa=l(`ZodNever`,(e,t)=>{_n.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>li(e,t,n,r)});function Ca(e){return kr(Sa,e)}var wa=l(`ZodArray`,(e,t)=>{yn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>pi(e,t,n,r),e.element=t.element,Ki(e,`ZodArray`,{min(e,t){return this.check(Ir(e,t))},nonempty(e){return this.check(Ir(1,e))},max(e,t){return this.check(Fr(e,t))},length(e,t){return this.check(Lr(e,t))},unwrap(){return this.element}})});function Ta(e,t){return Xr(wa,e,t)}var Ea=l(`ZodObject`,(e,t)=>{wn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>mi(e,t,n,r),y(e,`shape`,()=>t.shape),Ki(e,`ZodObject`,{keyof(){return Na(Object.keys(this._zod.def.shape))},catchall(e){return this.clone({...this._zod.def,catchall:e})},passthrough(){return this.clone({...this._zod.def,catchall:xa()})},loose(){return this.clone({...this._zod.def,catchall:xa()})},strict(){return this.clone({...this._zod.def,catchall:Ca()})},strip(){return this.clone({...this._zod.def,catchall:void 0})},extend(e){return he(this,e)},safeExtend(e){return ge(this,e)},merge(e){return _e(this,e)},pick(e){return pe(this,e)},omit(e){return me(this,e)},partial(...e){return ve(Ia,this,e[0])},required(...e){return ye(Ka,this,e[0])}})});function Da(e,t){return new Ea({type:`object`,shape:e??{},...C(t)})}var Oa=l(`ZodUnion`,(e,t)=>{En.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>hi(e,t,n,r),e.options=t.options});function ka(e,t){return new Oa({type:`union`,options:e,...C(t)})}var Aa=l(`ZodIntersection`,(e,t)=>{Dn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>gi(e,t,n,r)});function ja(e,t){return new Aa({type:`intersection`,left:e,right:t})}var Ma=l(`ZodEnum`,(e,t)=>{An.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>ui(e,t,n,r),e.enum=t.entries,e.options=Object.values(t.entries);let n=new Set(Object.keys(t.entries));e.extract=(e,r)=>{let i={};for(let r of e)if(n.has(r))i[r]=t.entries[r];else throw Error(`Key ${r} not found in enum`);return new Ma({...t,checks:[],...C(r),entries:i})},e.exclude=(e,r)=>{let i={...t.entries};for(let t of e)if(n.has(t))delete i[t];else throw Error(`Key ${t} not found in enum`);return new Ma({...t,checks:[],...C(r),entries:i})}});function Na(e,t){return new Ma({type:`enum`,entries:Array.isArray(e)?Object.fromEntries(e.map(e=>[e,e])):e,...C(t)})}var Pa=l(`ZodTransform`,(e,t)=>{jn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>fi(e,t,n,r),e._zod.parse=(n,r)=>{if(r.direction===`backward`)throw new d(e.constructor.name);n.addIssue=r=>{if(typeof r==`string`)n.issues.push(we(r,n.value,t));else{let t=r;t.fatal&&(t.continue=!1),t.code??=`custom`,t.input??=n.value,t.inst??=e,n.issues.push(we(t))}};let i=t.transform(n.value,n);return i instanceof Promise?i.then(e=>(n.value=e,n.fallback=!0,n)):(n.value=i,n.fallback=!0,n)}});function Fa(e){return new Pa({type:`transform`,transform:e})}var Ia=l(`ZodOptional`,(e,t)=>{Nn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>wi(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function La(e){return new Ia({type:`optional`,innerType:e})}var Ra=l(`ZodExactOptional`,(e,t)=>{Pn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>wi(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function za(e){return new Ra({type:`optional`,innerType:e})}var Ba=l(`ZodNullable`,(e,t)=>{Fn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>_i(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function Va(e){return new Ba({type:`nullable`,innerType:e})}var Ha=l(`ZodDefault`,(e,t)=>{In.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>yi(e,t,n,r),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap});function Ua(e,t){return new Ha({type:`default`,innerType:e,get defaultValue(){return typeof t==`function`?t():ce(t)}})}var Wa=l(`ZodPrefault`,(e,t)=>{Rn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>bi(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function Ga(e,t){return new Wa({type:`prefault`,innerType:e,get defaultValue(){return typeof t==`function`?t():ce(t)}})}var Ka=l(`ZodNonOptional`,(e,t)=>{zn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>vi(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function qa(e,t){return new Ka({type:`nonoptional`,innerType:e,...C(t)})}var Ja=l(`ZodCatch`,(e,t)=>{Vn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>xi(e,t,n,r),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap});function Ya(e,t){return new Ja({type:`catch`,innerType:e,catchValue:typeof t==`function`?t:()=>t})}var Xa=l(`ZodPipe`,(e,t)=>{Hn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Si(e,t,n,r),e.in=t.in,e.out=t.out});function Za(e,t){return new Xa({type:`pipe`,in:e,out:t})}var Qa=l(`ZodReadonly`,(e,t)=>{Wn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Ci(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function $a(e){return new Qa({type:`readonly`,innerType:e})}var eo=l(`ZodCustom`,(e,t)=>{Kn.init(e,t),M.init(e,t),e._zod.processJSONSchema=(t,n,r)=>di(e,t,n,r)});function to(e,t={}){return Zr(eo,e,t)}function no(e,t){return Qr(e,t)}var ro=[`ja`,`en`,`zh-Hans`,`hi`,`es`,`fr`,`ar`,`pt`,`bn`,`ru`,`ur`],io=new Set([`ar`,`ur`]);function ao(e){return io.has(e)?`rtl`:`ltr`}function oo(e,t,n){let r=e[n],i={},a=e;for(let e of t)i[e]={...r,...a[e]??{}};return i}function so(e,t){return oo(e,ro,t)}function co(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(e,n)=>{let r=t[n];return r===void 0?e:String(r)})}function lo(e){let t=Object.keys(e.translations),n=e.defaultLocale,r=n=>{let r=n.toLowerCase(),i=e.aliases?.[r];if(i)return i;let a=t.find(e=>e.toLowerCase()===r);if(a)return a;let o=r.split(`-`)[0];return t.find(e=>e.toLowerCase().split(`-`)[0]===o)??null},i=()=>{let t=navigator.languages.length>0?navigator.languages:[navigator.language];for(let e of t){let t=r(e);if(t)return t}return e.fallbackLocale},a=t=>e.translations[n]?.[t]||e.translations[e.fallbackLocale]?.[t]||(e.translations[e.defaultLocale]?.[t]??t);return{locales:t,getLocale:()=>n,setLocale:e=>{n=e},detectBrowserLocale:i,t:a,format:(e,t)=>co(a(e),t),getTranslations:(t=n)=>e.translations[t]??e.translations[e.fallbackLocale],getDirection:(e=n)=>ao(e),getMissingTranslationKeys:t=>{let n=e.translations[e.fallbackLocale],r=e.translations[t];return Object.keys(n).filter(e=>!r[e])}}}var uo=lo({translations:so({ja:{cacheTtl:`キャッシュ有効期限 (TTL)`,close:`閉じる`,comment:`コメ`,confirmed:`✓確定`,dataRefresh:`データ更新`,days:`{days}日`,daysHours:`{days}日{hours}時間`,detailRanking:`詳細ランキング`,failed:`取得失敗`,fetchFailed:`取得失敗: {message}
クリックでリトライ`,fetched:`取得`,fetchedAt:`取得日時`,fetching:`取得中...`,hours:`{hours}時間`,like:`いいね`,metrics:`指標`,metricsHeader:`▼ 指標 (生値 / 正規化)`,mylist:`マイリス`,pending:`未取得`,points:`{score}点`,progress:`{current} / {total} 作品取得済み ({percent}%)`,rank:`順位`,rankBadge:`{tier} - 第{rank}位({score}点)`,rankingDisplayOff:`⚪ ランキング表示: OFF`,rankingDisplayOn:`🔵 ランキング表示: ON`,rankingSettings:`ニコニコランキング設定`,refreshAll:`全作品を再取得`,retryClick:`クリックでリトライ`,score:`スコア`,statusFinal:`確定`,statusTemporary:`暫定`,summary:`{status} / 対象 {target}件 / ランク表示 {ranked}件 / 取得失敗 {failed}件 / 未取得 {pending}件`,target:`対象`,temporary:`⏳暫定`,title:`作品`,totalScore:`総合スコア: {score}点`,unknownError:`不明なエラー`,video:`代表動画`,view:`再生`,weeks:`{weeks}週間`},en:{cacheTtl:`Cache TTL`,close:`Close`,comment:`Comments`,confirmed:`✓ Final`,dataRefresh:`Data refresh`,days:`{days} day(s)`,daysHours:`{days} day(s) {hours} hour(s)`,detailRanking:`Detailed ranking`,failed:`Failed`,fetchFailed:`Fetch failed: {message}
Click to retry`,fetched:`Fetched`,fetchedAt:`Fetched at`,fetching:`Fetching...`,hours:`{hours} hour(s)`,like:`Likes`,metrics:`Metrics`,metricsHeader:`▼ Metrics (raw / normalized)`,mylist:`Mylist`,pending:`Pending`,points:`{score} pts`,progress:`{current} / {total} titles fetched ({percent}%)`,rank:`Rank`,rankBadge:`{tier} - #{rank} ({score} pts)`,rankingDisplayOff:`⚪ Ranking display: OFF`,rankingDisplayOn:`🔵 Ranking display: ON`,rankingSettings:`Niconico Ranking Settings`,refreshAll:`Refetch all titles`,retryClick:`Click to retry`,score:`Score`,statusFinal:`Final`,statusTemporary:`Temporary`,summary:`{status} / Target {target} / Ranked {ranked} / Failed {failed} / Pending {pending}`,target:`Target`,temporary:`⏳ Temporary`,title:`Title`,totalScore:`Total score: {score} pts`,unknownError:`Unknown error`,video:`Representative video`,view:`Views`,weeks:`{weeks} week(s)`},"zh-Hans":{cacheTtl:`缓存 TTL`,close:`关闭`,comment:`评论`,confirmed:`✓ 最终`,dataRefresh:`数据刷新`,days:`{days} 天`,daysHours:`{days} 天 {hours} 小时`,detailRanking:`详细排名`,failed:`获取失败`,fetchFailed:`获取失败：{message}
点击重试`,fetched:`已获取`,fetchedAt:`获取时间`,fetching:`正在获取...`,hours:`{hours} 小时`,like:`点赞`,metrics:`指标`,metricsHeader:`▼ 指标（原始 / 归一化）`,mylist:`收藏`,pending:`待获取`,points:`{score} 分`,progress:`已获取 {current} / {total} 部作品 ({percent}%)`,rank:`排名`,rankBadge:`{tier} - 第 {rank} 名（{score} 分）`,rankingDisplayOff:`⚪ 排名显示：OFF`,rankingDisplayOn:`🔵 排名显示：ON`,rankingSettings:`Niconico 排名设置`,refreshAll:`重新获取所有作品`,retryClick:`点击重试`,score:`分数`,statusFinal:`最终`,statusTemporary:`临时`,summary:`{status} / 目标 {target} / 已排名 {ranked} / 失败 {failed} / 待获取 {pending}`,target:`目标`,temporary:`⏳ 临时`,title:`作品`,totalScore:`总分：{score} 分`,unknownError:`未知错误`,video:`代表视频`,view:`播放`,weeks:`{weeks} 周`},hi:{cacheTtl:`कैश TTL`,close:`बंद करें`,comment:`टिप्पणियां`,confirmed:`✓ अंतिम`,dataRefresh:`डेटा रीफ्रेश`,days:`{days} दिन`,daysHours:`{days} दिन {hours} घंटे`,detailRanking:`विस्तृत रैंकिंग`,failed:`प्राप्ति विफल`,fetchFailed:`प्राप्ति विफल: {message}
फिर से प्रयास करने के लिए क्लिक करें`,fetched:`प्राप्त`,fetchedAt:`प्राप्त समय`,fetching:`प्राप्त किया जा रहा है...`,hours:`{hours} घंटे`,like:`लाइक`,metrics:`मापदंड`,metricsHeader:`▼ मापदंड (कच्चा / सामान्यीकृत)`,mylist:`मायलिस्ट`,pending:`लंबित`,points:`{score} अंक`,progress:`{current} / {total} शीर्षक प्राप्त ({percent}%)`,rank:`रैंक`,rankBadge:`{tier} - #{rank} ({score} अंक)`,rankingDisplayOff:`⚪ रैंकिंग प्रदर्शन: OFF`,rankingDisplayOn:`🔵 रैंकिंग प्रदर्शन: ON`,rankingSettings:`Niconico रैंकिंग सेटिंग्स`,refreshAll:`सभी शीर्षक फिर से प्राप्त करें`,retryClick:`फिर से प्रयास करने के लिए क्लिक करें`,score:`स्कोर`,statusFinal:`अंतिम`,statusTemporary:`अस्थायी`,summary:`{status} / लक्ष्य {target} / रैंक किए गए {ranked} / विफल {failed} / लंबित {pending}`,target:`लक्ष्य`,temporary:`⏳ अस्थायी`,title:`शीर्षक`,totalScore:`कुल स्कोर: {score} अंक`,unknownError:`अज्ञात त्रुटि`,video:`प्रतिनिधि वीडियो`,view:`दृश्य`,weeks:`{weeks} सप्ताह`},es:{cacheTtl:`TTL de caché`,close:`Cerrar`,comment:`Comentarios`,confirmed:`✓ Final`,dataRefresh:`Actualización de datos`,days:`{days} día(s)`,daysHours:`{days} día(s) {hours} hora(s)`,detailRanking:`Ranking detallado`,failed:`Error`,fetchFailed:`Error al obtener: {message}
Haz clic para reintentar`,fetched:`Obtenido`,fetchedAt:`Obtenido a las`,fetching:`Obteniendo...`,hours:`{hours} hora(s)`,like:`Me gusta`,metrics:`Métricas`,metricsHeader:`▼ Métricas (sin procesar / normalizadas)`,mylist:`Mylist`,pending:`Pendiente`,points:`{score} pts`,progress:`{current} / {total} títulos obtenidos ({percent}%)`,rank:`Puesto`,rankBadge:`{tier} - #{rank} ({score} pts)`,rankingDisplayOff:`⚪ Mostrar ranking: OFF`,rankingDisplayOn:`🔵 Mostrar ranking: ON`,rankingSettings:`Configuración de ranking de Niconico`,refreshAll:`Volver a obtener todos los títulos`,retryClick:`Haz clic para reintentar`,score:`Puntuación`,statusFinal:`Final`,statusTemporary:`Temporal`,summary:`{status} / Objetivo {target} / Con ranking {ranked} / Fallidos {failed} / Pendientes {pending}`,target:`Objetivo`,temporary:`⏳ Temporal`,title:`Título`,totalScore:`Puntuación total: {score} pts`,unknownError:`Error desconocido`,video:`Video representativo`,view:`Reproducciones`,weeks:`{weeks} semana(s)`},fr:{cacheTtl:`TTL du cache`,close:`Fermer`,comment:`Commentaires`,confirmed:`✓ Final`,dataRefresh:`Actualisation des données`,days:`{days} jour(s)`,daysHours:`{days} jour(s) {hours} heure(s)`,detailRanking:`Classement détaillé`,failed:`Échec`,fetchFailed:`Échec de récupération : {message}
Cliquez pour réessayer`,fetched:`Récupéré`,fetchedAt:`Récupéré le`,fetching:`Récupération...`,hours:`{hours} heure(s)`,like:`J'aime`,metrics:`Indicateurs`,metricsHeader:`▼ Indicateurs (bruts / normalisés)`,mylist:`Mylist`,pending:`En attente`,points:`{score} pts`,progress:`{current} / {total} titres récupérés ({percent}%)`,rank:`Rang`,rankBadge:`{tier} - n°{rank} ({score} pts)`,rankingDisplayOff:`⚪ Affichage du classement : OFF`,rankingDisplayOn:`🔵 Affichage du classement : ON`,rankingSettings:`Paramètres du classement Niconico`,refreshAll:`Récupérer tous les titres`,retryClick:`Cliquez pour réessayer`,score:`Score`,statusFinal:`Final`,statusTemporary:`Temporaire`,summary:`{status} / Cible {target} / Classés {ranked} / Échecs {failed} / En attente {pending}`,target:`Cible`,temporary:`⏳ Temporaire`,title:`Titre`,totalScore:`Score total : {score} pts`,unknownError:`Erreur inconnue`,video:`Vidéo représentative`,view:`Vues`,weeks:`{weeks} semaine(s)`},ar:{cacheTtl:`مدة صلاحية التخزين المؤقت`,close:`إغلاق`,comment:`التعليقات`,confirmed:`✓ نهائي`,dataRefresh:`تحديث البيانات`,days:`{days} يوم`,daysHours:`{days} يوم {hours} ساعة`,detailRanking:`الترتيب التفصيلي`,failed:`فشل`,fetchFailed:`فشل الجلب: {message}
انقر لإعادة المحاولة`,fetched:`تم الجلب`,fetchedAt:`وقت الجلب`,fetching:`جار الجلب...`,hours:`{hours} ساعة`,like:`الإعجابات`,metrics:`المؤشرات`,metricsHeader:`▼ المؤشرات (خام / مطبعة)`,mylist:`Mylist`,pending:`قيد الانتظار`,points:`{score} نقطة`,progress:`تم جلب {current} / {total} عنوان ({percent}%)`,rank:`الترتيب`,rankBadge:`{tier} - #{rank} ({score} نقطة)`,rankingDisplayOff:`⚪ عرض الترتيب: OFF`,rankingDisplayOn:`🔵 عرض الترتيب: ON`,rankingSettings:`إعدادات ترتيب Niconico`,refreshAll:`إعادة جلب كل العناوين`,retryClick:`انقر لإعادة المحاولة`,score:`النقاط`,statusFinal:`نهائي`,statusTemporary:`مؤقت`,summary:`{status} / الهدف {target} / مرتبة {ranked} / فشل {failed} / انتظار {pending}`,target:`الهدف`,temporary:`⏳ مؤقت`,title:`العنوان`,totalScore:`المجموع: {score} نقطة`,unknownError:`خطأ غير معروف`,video:`الفيديو الممثل`,view:`المشاهدات`,weeks:`{weeks} أسبوع`},pt:{cacheTtl:`TTL do cache`,close:`Fechar`,comment:`Comentários`,confirmed:`✓ Final`,dataRefresh:`Atualização de dados`,days:`{days} dia(s)`,daysHours:`{days} dia(s) {hours} hora(s)`,detailRanking:`Ranking detalhado`,failed:`Falha`,fetchFailed:`Falha ao buscar: {message}
Clique para tentar novamente`,fetched:`Obtido`,fetchedAt:`Obtido em`,fetching:`Buscando...`,hours:`{hours} hora(s)`,like:`Curtidas`,metrics:`Métricas`,metricsHeader:`▼ Métricas (brutas / normalizadas)`,mylist:`Mylist`,pending:`Pendente`,points:`{score} pts`,progress:`{current} / {total} títulos obtidos ({percent}%)`,rank:`Rank`,rankBadge:`{tier} - #{rank} ({score} pts)`,rankingDisplayOff:`⚪ Exibição do ranking: OFF`,rankingDisplayOn:`🔵 Exibição do ranking: ON`,rankingSettings:`Configurações de ranking do Niconico`,refreshAll:`Buscar todos os títulos novamente`,retryClick:`Clique para tentar novamente`,score:`Pontuação`,statusFinal:`Final`,statusTemporary:`Temporário`,summary:`{status} / Alvo {target} / Ranqueados {ranked} / Falhas {failed} / Pendentes {pending}`,target:`Alvo`,temporary:`⏳ Temporário`,title:`Título`,totalScore:`Pontuação total: {score} pts`,unknownError:`Erro desconhecido`,video:`Vídeo representativo`,view:`Visualizações`,weeks:`{weeks} semana(s)`},bn:{cacheTtl:`ক্যাশ TTL`,close:`বন্ধ করুন`,comment:`মন্তব্য`,confirmed:`✓ চূড়ান্ত`,dataRefresh:`ডেটা রিফ্রেশ`,days:`{days} দিন`,daysHours:`{days} দিন {hours} ঘণ্টা`,detailRanking:`বিস্তারিত র‍্যাঙ্কিং`,failed:`ব্যর্থ`,fetchFailed:`আনা ব্যর্থ: {message}
আবার চেষ্টা করতে ক্লিক করুন`,fetched:`আনা হয়েছে`,fetchedAt:`আনার সময়`,fetching:`আনা হচ্ছে...`,hours:`{hours} ঘণ্টা`,like:`লাইক`,metrics:`মেট্রিক`,metricsHeader:`▼ মেট্রিক (কাঁচা / স্বাভাবিকীকৃত)`,mylist:`Mylist`,pending:`অপেক্ষমাণ`,points:`{score} পয়েন্ট`,progress:`{current} / {total} শিরোনাম আনা হয়েছে ({percent}%)`,rank:`র‍্যাঙ্ক`,rankBadge:`{tier} - #{rank} ({score} পয়েন্ট)`,rankingDisplayOff:`⚪ র‍্যাঙ্কিং প্রদর্শন: OFF`,rankingDisplayOn:`🔵 র‍্যাঙ্কিং প্রদর্শন: ON`,rankingSettings:`Niconico র‍্যাঙ্কিং সেটিংস`,refreshAll:`সব শিরোনাম আবার আনুন`,retryClick:`আবার চেষ্টা করতে ক্লিক করুন`,score:`স্কোর`,statusFinal:`চূড়ান্ত`,statusTemporary:`অস্থায়ী`,summary:`{status} / লক্ষ্য {target} / র‍্যাঙ্কড {ranked} / ব্যর্থ {failed} / অপেক্ষমাণ {pending}`,target:`লক্ষ্য`,temporary:`⏳ অস্থায়ী`,title:`শিরোনাম`,totalScore:`মোট স্কোর: {score} পয়েন্ট`,unknownError:`অজানা ত্রুটি`,video:`প্রতিনিধি ভিডিও`,view:`ভিউ`,weeks:`{weeks} সপ্তাহ`},ru:{cacheTtl:`TTL кэша`,close:`Закрыть`,comment:`Комментарии`,confirmed:`✓ Итог`,dataRefresh:`Обновление данных`,days:`{days} дн.`,daysHours:`{days} дн. {hours} ч.`,detailRanking:`Подробный рейтинг`,failed:`Ошибка`,fetchFailed:`Не удалось получить: {message}
Нажмите, чтобы повторить`,fetched:`Получено`,fetchedAt:`Получено в`,fetching:`Получение...`,hours:`{hours} ч.`,like:`Лайки`,metrics:`Метрики`,metricsHeader:`▼ Метрики (сырые / нормализованные)`,mylist:`Mylist`,pending:`Ожидание`,points:`{score} балл.`,progress:`Получено {current} / {total} тайтлов ({percent}%)`,rank:`Место`,rankBadge:`{tier} - #{rank} ({score} балл.)`,rankingDisplayOff:`⚪ Показ рейтинга: OFF`,rankingDisplayOn:`🔵 Показ рейтинга: ON`,rankingSettings:`Настройки рейтинга Niconico`,refreshAll:`Получить все тайтлы заново`,retryClick:`Нажмите, чтобы повторить`,score:`Счет`,statusFinal:`Итог`,statusTemporary:`Временно`,summary:`{status} / Цель {target} / В рейтинге {ranked} / Ошибки {failed} / Ожидание {pending}`,target:`Цель`,temporary:`⏳ Временно`,title:`Название`,totalScore:`Общий счет: {score} балл.`,unknownError:`Неизвестная ошибка`,video:`Представительное видео`,view:`Просмотры`,weeks:`{weeks} нед.`},ur:{cacheTtl:`کیش TTL`,close:`بند کریں`,comment:`تبصرے`,confirmed:`✓ حتمی`,dataRefresh:`ڈیٹا ریفریش`,days:`{days} دن`,daysHours:`{days} دن {hours} گھنٹے`,detailRanking:`تفصیلی رینکنگ`,failed:`ناکام`,fetchFailed:`حاصل کرنے میں ناکامی: {message}
دوبارہ کوشش کے لیے کلک کریں`,fetched:`حاصل شدہ`,fetchedAt:`حاصل کرنے کا وقت`,fetching:`حاصل کیا جا رہا ہے...`,hours:`{hours} گھنٹے`,like:`لائکس`,metrics:`میٹرکس`,metricsHeader:`▼ میٹرکس (خام / معمول پر)`,mylist:`Mylist`,pending:`زیر التوا`,points:`{score} پوائنٹس`,progress:`{current} / {total} عنوانات حاصل ہوئے ({percent}%)`,rank:`رینک`,rankBadge:`{tier} - #{rank} ({score} پوائنٹس)`,rankingDisplayOff:`⚪ رینکنگ ڈسپلے: OFF`,rankingDisplayOn:`🔵 رینکنگ ڈسپلے: ON`,rankingSettings:`Niconico رینکنگ سیٹنگز`,refreshAll:`تمام عنوانات دوبارہ حاصل کریں`,retryClick:`دوبارہ کوشش کے لیے کلک کریں`,score:`اسکور`,statusFinal:`حتمی`,statusTemporary:`عارضی`,summary:`{status} / ہدف {target} / رینک شدہ {ranked} / ناکام {failed} / زیر التوا {pending}`,target:`ہدف`,temporary:`⏳ عارضی`,title:`عنوان`,totalScore:`کل اسکور: {score} پوائنٹس`,unknownError:`نامعلوم خرابی`,video:`نمائندہ ویڈیو`,view:`ویوز`,weeks:`{weeks} ہفتے`}},`en`),defaultLocale:`ja`,fallbackLocale:`en`});uo.setLocale(uo.detectBrowserLocale());var F=uo.format,I=uo.t,fo=r(`dAnimeCfRanking:Settings`),po=Da({enabled:ya(),cacheTtlHours:ha().min(1).max(168)});Da({title:N(),canonicalQuery:N(),representativeVideoId:N().nullable(),representativeVideo:Da({videoId:N(),title:N(),postedAt:N(),uploaderType:Na([`danime`,`official`,`unknown`]),uploaderName:N()}).nullable(),metrics:Da({viewCount:ha(),mylistCount:ha(),commentCount:ha(),likeCount:ha()}).nullable(),fetchedAt:N(),status:Na([`ok`,`failed`,`pending`]),failureReason:N().nullable()});var mo=`dAnimeCfRanking_settings`,L=null,ho=[];function go(){try{let e=GM_getValue(mo,null);if(e===null)return L={...a},L;let t=po.safeParse(e);return t.success?(L=t.data,L):(fo.warn(`Invalid settings found, using defaults`,{error:t.error}),L={...a},L)}catch(e){return fo.error(`Failed to load settings`,e),L={...a},L}}function _o(e){try{let t=po.parse(e);GM_setValue(mo,t),L=t;for(let e of ho)try{e(t)}catch(e){fo.error(`Settings change callback error`,e)}fo.info(`Settings saved`,{settings:t})}catch(e){fo.error(`Failed to save settings`,e)}}function vo(){return L===null?go():L}function yo(e){ho.push(e)}function bo(){let e=vo();_o({...e,enabled:!e.enabled})}function xo(){return vo().cacheTtlHours*60*60*1e3}function So(){let e=vo();GM_registerMenuCommand(e.enabled?I(`rankingDisplayOn`):I(`rankingDisplayOff`),()=>{bo(),window.location.reload()}),fo.info(`Menu commands registered`,{enabled:e.enabled})}var R=r(`dAnimeCfRanking:CacheManager`),Co=null;async function wo(){return Co||new Promise((e,t)=>{let n=indexedDB.open(o,1);n.onerror=()=>{R.error(`Failed to open IndexedDB`,n.error),t(n.error)},n.onsuccess=()=>{Co=n.result,R.info(`IndexedDB initialized`),e(Co)},n.onupgradeneeded=e=>{let t=e.target.result;t.objectStoreNames.contains(`metricsCache`)&&t.deleteObjectStore(s);let n=t.createObjectStore(s,{keyPath:`title`});n.createIndex(`status`,`status`,{unique:!1}),n.createIndex(`fetchedAt`,`fetchedAt`,{unique:!1}),R.info(`IndexedDB store created`)}})}async function To(){return Co||wo()}async function Eo(e){try{let t=await To();return new Promise((n,r)=>{let i=t.transaction(s,`readonly`).objectStore(s).get(e);i.onerror=()=>{R.error(`Failed to get cache entry`,i.error),r(i.error)},i.onsuccess=()=>{n(i.result)}})}catch(e){return R.error(`getCacheEntry failed`,e),null}}async function Do(e){try{let t=await To();return new Promise((n,r)=>{let i=t.transaction(s,`readwrite`).objectStore(s).put(e);i.onerror=()=>{R.error(`Failed to set cache entry`,i.error),r(i.error)},i.onsuccess=()=>{R.debug(`Cache entry saved`,{title:e.title,status:e.status}),n()}})}catch(e){R.error(`setCacheEntry failed`,e)}}async function Oo(){try{let e=await To();return new Promise((t,n)=>{let r=e.transaction(s,`readonly`).objectStore(s).getAll();r.onerror=()=>{R.error(`Failed to get all cache entries`,r.error),n(r.error)},r.onsuccess=()=>{t(r.result)}})}catch(e){return R.error(`getAllCacheEntries failed`,e),[]}}async function ko(){try{let e=await To();return new Promise((t,n)=>{let r=e.transaction(s,`readwrite`).objectStore(s).clear();r.onerror=()=>{R.error(`Failed to clear cache`,r.error),n(r.error)},r.onsuccess=()=>{R.info(`Cache cleared`),t()}})}catch(e){R.error(`clearCache failed`,e)}}function Ao(e){if(!e||e.status===`pending`)return!1;let t=new Date(e.fetchedAt).getTime();return isNaN(t)?!1:Date.now()-t<xo()}function jo(e,t){return{title:e,canonicalQuery:t,representativeVideoId:null,representativeVideo:null,metrics:null,fetchedAt:new Date().toISOString(),status:`pending`,failureReason:null}}function Mo(e,t){return{...e,...t,fetchedAt:new Date().toISOString(),status:`ok`,failureReason:null}}function No(e,t){return{...e,fetchedAt:new Date().toISOString(),status:`failed`,failureReason:t}}var Po=`M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z`,Fo=`M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z`,Io=`M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z`,Lo=`M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z`,Ro=`M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z`,zo=`M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z`,Bo=`M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z`,Vo=`M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z`,Ho=`M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z`,Uo=`M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z`,Wo=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z`,Go=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z`,Ko=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z`,qo=`M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z`,Jo=`M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z`,Yo=`M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z`,Xo=`M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z`,Zo=`M7,2V13H10V22L17,10H13L17,2H7Z`,Qo=`M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z`,$o=`M5,4V7H10.5V19H13.5V7H19V4H5Z`,es=`M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z`,ts=`M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z`,ns=`M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z`,rs=`M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z`,is=`M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z`,as=`M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z`,os=`M8,5.14V19.14L19,12.14L8,5.14Z`,ss=`M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z`,cs=`M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z`,ls=`M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9`,us=`M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z`,ds=`M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z`,fs=`M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z`;function z(e,t=24){return`<svg xmlns="http://www.w3.org/2000/svg" width="${String(t)}" height="${String(t)}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}z(Yo),z(Jo),z(fs),z(Ro),z(os),z(cs),z(rs),z(qo),z(Zo),z(Ho),z(as),z(ns),z(Wo),z(ts),z($o),z(Po),z(Xo),z(Ko),z(ss),z(zo),z(Go),z(us),z(Lo),z(Bo),z(Vo),z(Io),z(Fo),z(es),z(ds),z(ls);var B=r(`dAnimeCfRanking:ControlPanel`),ps=`
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .cf-ranking-panel {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 1px solid #0f3460;
    border-radius: 12px;
    padding: 16px;
    margin: 16px auto;
    max-width: 800px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    color: #e0e0e0;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .panel-title svg {
    fill: #e94560;
  }

  .toggle-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toggle-label {
    font-size: 12px;
    color: #aaa;
  }

  .toggle-switch {
    position: relative;
    width: 44px;
    height: 24px;
    background: #333;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .toggle-switch.active {
    background: #e94560;
  }

  .toggle-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  .toggle-switch.active::after {
    transform: translateX(20px);
  }

  .panel-body {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-start;
  }

  .panel-body.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .control-section {
    flex: 1;
    min-width: 200px;
  }

  .section-title {
    font-size: 11px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  /* TTLコントロール */
  .ttl-container {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 12px;
  }

  .ttl-slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .ttl-slider {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: #333;
    border-radius: 3px;
    outline: none;
  }

  .ttl-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: #e94560;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .ttl-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .ttl-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #e94560;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }

  .ttl-value {
    min-width: 60px;
    text-align: right;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .ttl-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .ttl-preset-btn {
    padding: 4px 10px;
    font-size: 11px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: #ccc;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ttl-preset-btn:hover {
    background: rgba(233, 69, 96, 0.3);
    border-color: #e94560;
  }

  .ttl-preset-btn.active {
    background: #e94560;
    border-color: #e94560;
    color: #fff;
  }

  /* リフレッシュボタン */
  .action-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .refresh-btn {
    background: linear-gradient(135deg, #e94560 0%, #c73659 100%);
  }

  .ranking-list-btn {
    background: linear-gradient(135deg, #2f7dd3 0%, #235fa6 100%);
  }

  .action-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(233, 69, 96, 0.4);
  }

  .ranking-list-btn:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(47, 125, 211, 0.4);
  }

  .action-btn:disabled {
    background: #444;
    cursor: not-allowed;
  }

  .action-btn svg {
    fill: currentColor;
  }

  .refresh-btn.refreshing svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .progress-text {
    font-size: 11px;
    color: #888;
    text-align: center;
  }

  /* レスポンシブ */
  @media (max-width: 600px) {
    .cf-ranking-panel {
      margin: 8px;
      padding: 12px;
    }

    .panel-body {
      flex-direction: column;
    }

    .control-section {
      width: 100%;
    }
  }
`;function ms(e,t){let n=document.createElement(`div`);n.className=`cf-ranking-control-panel-host`;let r=n.attachShadow({mode:`open`}),i=document.createElement(`style`);i.textContent=ps,r.appendChild(i);let a=document.createElement(`div`);a.className=`cf-ranking-panel`,a.innerHTML=hs(e),r.appendChild(a);let o=a.querySelector(`.toggle-switch`),s=a.querySelector(`.panel-body`),c=a.querySelector(`.ttl-slider`),l=a.querySelector(`.ttl-value`),u=a.querySelectorAll(`.ttl-preset-btn`),d=a.querySelector(`.refresh-btn`),f=a.querySelector(`.ranking-list-btn`),p=a.querySelector(`.progress-text`),m={...e};o?.addEventListener(`click`,()=>{m.enabled=!m.enabled,h(),g(),t.onSettingsChange(m)}),c?.addEventListener(`input`,()=>{let e=parseInt(c.value,10);m.cacheTtlHours=e,_(),v()}),c?.addEventListener(`change`,()=>{t.onSettingsChange(m)}),u.forEach(e=>{e.addEventListener(`click`,()=>{let n=parseInt(e.dataset.hours??`24`,10);m.cacheTtlHours=n,c&&(c.value=String(n)),_(),v(),t.onSettingsChange(m)})}),d?.addEventListener(`click`,()=>{t.onRefreshTrigger()}),f?.addEventListener(`click`,()=>{t.onOpenRankingList()});function h(){m.enabled?o?.classList.add(`active`):o?.classList.remove(`active`)}function g(){m.enabled?s?.classList.remove(`disabled`):s?.classList.add(`disabled`)}function _(){l&&(l.textContent=gs(m.cacheTtlHours))}function v(){u.forEach(e=>{parseInt(e.dataset.hours??`0`,10)===m.cacheTtlHours?e.classList.add(`active`):e.classList.remove(`active`)})}return h(),g(),_(),v(),B.info(`Control panel created`,{settings:m}),{element:n,updateSettings(e){m={...e},c&&(c.value=String(e.cacheTtlHours)),h(),g(),_(),v()},updateProgress(e,t){if(p)if(t>0){let n=Math.round(e/t*100);p.textContent=F(`progress`,{current:String(e),percent:String(n),total:String(t)})}else p.textContent=``},setRefreshing(e){d&&(d.disabled=e,e?(d.classList.add(`refreshing`),d.innerHTML=`${z(cs,16)} ${I(`fetching`)}`):(d.classList.remove(`refreshing`),d.innerHTML=`${z(cs,16)} ${I(`refreshAll`)}`))}}}function hs(e){let t=e.enabled?`active`:``,n=e.enabled?``:`disabled`,r=i.map(t=>`<button class="ttl-preset-btn ${t.hours===e.cacheTtlHours?`active`:``}" data-hours="${t.hours}">${t.label}</button>`).join(``);return`
    <div class="panel-header">
      <div class="panel-title">
        ${z(Uo,18)}
        <span>${I(`rankingSettings`)}</span>
      </div>
      <div class="toggle-container">
        <span class="toggle-label">${I(`rank`)}</span>
        <div class="toggle-switch ${t}" role="switch" aria-checked="${e.enabled}">
        </div>
      </div>
    </div>
    <div class="panel-body ${n}">
      <div class="control-section">
        <div class="section-title">${I(`cacheTtl`)}</div>
        <div class="ttl-container">
          <div class="ttl-slider-row">
            <input type="range" class="ttl-slider"
                   min="1" max="168"
                   value="${e.cacheTtlHours}" step="1">
            <div class="ttl-value">${gs(e.cacheTtlHours)}</div>
          </div>
          <div class="ttl-presets">
            ${r}
          </div>
        </div>
      </div>
      <div class="control-section">
        <div class="section-title">${I(`dataRefresh`)}</div>
        <div class="action-container">
          <button class="action-btn refresh-btn">
            ${z(cs,16)}
            ${I(`refreshAll`)}
          </button>
          <button class="action-btn ranking-list-btn">
            ${z(Qo,16)}
            ${I(`detailRanking`)}
          </button>
          <div class="progress-text"></div>
        </div>
      </div>
    </div>
  `}function gs(e){if(e<24)return F(`hours`,{hours:String(e)});if(e<168){let t=Math.floor(e/24),n=e%24;return n===0?F(`days`,{days:String(t)}):F(`daysHours`,{days:String(t),hours:String(n)})}else{let t=Math.floor(e/168);return F(`weeks`,{weeks:String(t)})}}function _s(){if(window.location.pathname.includes(`shinban-`)){let e=document.querySelector(`.contentsWrapper > div[style*="max-width"]`);if(e)return B.info(`Found insertion point (shinban page): banner container`),{target:e,position:`afterend`}}let e=document.getElementById(`kokuchi_txt`);if(e)return B.info(`Found insertion point (CF page): #kokuchi_txt`),{target:e,position:`afterend`};let t=document.querySelector(`.contentsWrapper`);return t?(B.info(`Found insertion point (fallback): .contentsWrapper`),{target:t,position:`afterbegin`}):(B.warn(`No insertion point found`),null)}function vs(e){let t=_s();return t?(t.target.insertAdjacentElement(t.position,e.element),B.info(`Control panel inserted into page`),!0):(B.error(`Failed to find insertion point for control panel`),!1)}var V=r(`dAnimeCfRanking:CardDetector`),ys=[`.itemModule.list[data-workid]`,`.itemModule.list`],bs=[`.newTVtitle span`,`.textContainer h2 span`],xs=`.check input[data-workid]`,Ss=`.circleProgress`,Cs=`.check`,ws=`data-cf-ranking-badge`,Ts=`cf-ranking-badge`;function Es(e){if(e.offsetParent===null){let t=window.getComputedStyle(e);if(t.display===`none`)return!1;if(t.position===`fixed`)return!0;let n=e.parentElement;for(;n;){if(window.getComputedStyle(n).display===`none`)return!1;n=n.parentElement}}let t=window.getComputedStyle(e);return!(t.display===`none`||t.visibility===`hidden`)}function Ds(){let e=new Set;for(let t of ys)document.querySelectorAll(t).forEach(t=>e.add(t));let t=[],n=new Set,r=new Set,i=0;return e.forEach(e=>{if(!Es(e)){i++;return}let a=As(e);a&&!n.has(a.title)&&!r.has(a.workId)&&(t.push(a),n.add(a.title),r.add(a.workId))}),V.debug(`Cards detected`,{total:e.size,visible:t.length,hidden:i}),t}function Os(e){for(let t of bs){let n=e.querySelector(t)?.textContent?.trim();if(n)return n}return null}function ks(e){let t=e.dataset.workid;if(t)return t;let n=e.querySelector(xs);return n?.dataset.workid?n.dataset.workid:null}function As(e){let t=ks(e);if(!t)return null;let n=Os(e);return n?{workId:t,title:n,element:e,insertionPoint:js(e)}:(V.warn(`Card has no title`,{workId:t}),null)}function js(e){let t=e.querySelector(Ss),n=e.querySelector(Cs);return t&&n?n:t&&t.nextElementSibling?t.nextElementSibling:n||(V.warn(`Insertion point not found`,{workId:ks(e),hasCircleProgress:!!t,hasCheck:!!n}),null)}function Ms(e){return e.hasAttribute(ws)}function Ns(e){e.setAttribute(ws,`true`)}function Ps(e){return e.filter(e=>!Ms(e.element))}function Fs(e){return e instanceof HTMLElement?!!(e.classList.contains(Ts)||e.closest(`.${Ts}`)):!1}function Is(e){return ys.some(t=>e.matches(t))}function Ls(e){let t=[];for(let n of ys){let r=Array.from(e.querySelectorAll(n));t.push(...r)}return[...new Set(t)]}function Rs(e){return new MutationObserver(t=>{let n=[],r=new Set;for(let e of t){if(e.type!==`childList`)continue;let t=Array.from(e.addedNodes);for(let e of t)if(e instanceof HTMLElement&&!Fs(e)){if(Is(e)){let t=As(e);t&&!Ms(e)&&!r.has(t.workId)&&(n.push(t),r.add(t.workId))}Ls(e).forEach(e=>{if(!Ms(e)){let t=As(e);t&&!r.has(t.workId)&&(n.push(t),r.add(t.workId))}})}}n.length>0&&(V.debug(`New cards detected by observer`,{count:n.length}),e(n))})}function zs(e,t=document.body){e.observe(t,{childList:!0,subtree:!0}),V.info(`Card observer started`)}function Bs(){let e=new Set;for(let t of ys)document.querySelectorAll(t).forEach(t=>e.add(t));return[...e]}function Vs(e,t){let n=null,r=new Set,i=()=>{let n=[];for(let t of r)if(e.has(t)&&Es(t)){let r=As(t);r&&!Ms(t)&&(n.push(r),e.delete(t))}r.clear(),n.length>0&&(V.debug(`Cards became visible`,{count:n.length}),t(n))},a=t=>{for(let n of e)(t.contains(n)||n.contains(t)||t===n)&&r.add(n);n!==null&&clearTimeout(n),n=setTimeout(()=>{n=null,i()},100)};return new MutationObserver(e=>{for(let t of e)if(t.type===`attributes`){let e=t.target;if(Fs(e))continue;a(e)}})}function Hs(e,t=document.body){e.observe(t,{attributes:!0,attributeFilter:[`style`,`class`],subtree:!0}),V.info(`Visibility observer started`)}var Us=r(`dAnimeCfRanking:TitleNormalizer`),Ws={I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7,VIII:8,IX:9,X:10,XI:11,XII:12,XIII:13,XIV:14,XV:15,XVI:16,XVII:17,XVIII:18,XIX:19,XX:20},Gs=[{pattern:/[Ss]eason\s*0?(\d+)/,extractor:e=>parseInt(e[1],10)},{pattern:/(\d+)(?:st|nd|rd|th)\s*[Ss]eason/,extractor:e=>parseInt(e[1],10)},{pattern:/第0?(\d+)期/,extractor:e=>parseInt(e[1],10)},{pattern:/(?<![第\d])(\d+)期(?![間])/,extractor:e=>parseInt(e[1],10)},{pattern:/[Pp]art\s*0?(\d+)/,extractor:e=>parseInt(e[1],10)},{pattern:/第0?(\d+)シリーズ/,extractor:e=>parseInt(e[1],10)},{pattern:/(\d+)(?:st|nd|rd|th)\s*シーズン/,extractor:e=>parseInt(e[1],10)},{pattern:/シーズン\s*0?(\d+)/,extractor:e=>parseInt(e[1],10)}],Ks=/(?:^|\s)(X{0,2}(?:IX|IV|V?I{0,3}))(?:\s|$|期|シーズン)/,qs=[/続編/,/完結編/,/後編/,/前編/,/劇場版/,/OVA/,/OAD/,/特別編/,/番外編/];function Js(e){for(let{pattern:t,extractor:n}of Gs){let r=e.match(t);if(r){let e=n(r);if(e!==null&&e>0&&e<=20)return e}}let t=e.match(Ks);if(t&&t[1]){let e=Ws[t[1].toUpperCase()];if(e!==void 0)return e}return null}function Ys(e){let t=e.trim();for(let n of qs)if(n.test(t))return Us.debug(`Skipping normalization (special pattern)`,{title:e,pattern:n.source}),t;let n=Js(t);if(n===null||RegExp(`第0?${n}期`).test(t))return t;let r=t;for(let{pattern:e}of Gs)r=r.replace(e,``).trim();r=r.replace(Ks,` `).trim(),r=r.replace(/\s+/g,` `).trim(),r=r.replace(/[-\s]+$/,``).trim();let i=`${r} 第${n}期`;return Us.debug(`Title normalized`,{original:e,normalized:i,seasonNumber:n}),i}var Xs=`https://www.nicovideo.jp`,Zs=`${Xs}/search`,Qs=`${Xs}/watch`,$s=`https://twitter.com`,ec=`https://t.co`,tc=e=>`${Qs}/${e}`,nc=e=>`${Zs}/${encodeURIComponent(e)}`;`${$s}`,`${ec}`;var rc=typeof GM_xmlhttpRequest<`u`?GM_xmlhttpRequest:void 0,ic=e=>new Promise((t,n)=>{rc({url:e.url,method:e.method??`GET`,headers:e.headers,data:e.data,responseType:e.responseType??`text`,timeout:e.timeout,onprogress:e.onprogress,onload:e=>{t({status:e.status,statusText:e.statusText,response:e.response,finalUrl:e.finalUrl,headers:e.responseHeaders})},onerror:e=>{let t=e?.error??`unknown error`;n(Error(`GM_xmlhttpRequest failed: ${t}`))},ontimeout:()=>{n(Error(`GM_xmlhttpRequest timeout`))}})}),H=r(`dAnimeCfRanking:NicoApiClient`),ac=`dアニメストア ニコニコ支店`,oc=class e{searchCache=new Map;async search(e){if(!e.trim())return[];if(this.searchCache.has(e))return this.searchCache.get(e)??[];try{let t=nc(e),n=await this.fetchText(t),r=this.parseServerResponse(n),i=this.deduplicateItems(r);return this.searchCache.set(e,i),H.debug(`Search completed`,{keyword:e,resultCount:i.length}),i}catch(t){return H.error(`Search failed`,t,{keyword:e}),[]}}async fetchMetrics(e){try{let t=tc(e),n=await this.fetchText(t),r=this.parseWatchPageMetrics(n);return r?(H.debug(`Metrics fetched`,{videoId:e,metrics:r}),r):(H.warn(`Failed to parse metrics from watch page`,{videoId:e}),null)}catch(t){return H.error(`Failed to fetch metrics`,t,{videoId:e}),null}}static determineUploaderType(e,t){return e===ac?`danime`:e===t||e.startsWith(t+` `)?`official`:`unknown`}static filterOfficialVideos(t,n){return t.filter(t=>{let r=e.determineUploaderType(t.ownerName,n);return r===`danime`||r===`official`})}static toRepresentativeVideo(t,n){return{videoId:t.videoId,title:t.title,postedAt:t.postedAt,uploaderType:e.determineUploaderType(t.ownerName,n),uploaderName:t.ownerName}}async fetchText(e){return(await ic({method:`GET`,url:e,headers:{Accept:`text/html`}})).response}parseServerResponse(e){try{let t=new DOMParser().parseFromString(e,`text/html`).querySelector(`meta[name="server-response"]`);if(!t)return H.warn(`server-response meta not found`),[];let n=t.getAttribute(`content`)??``,r=this.decodeHtmlEntities(n),i;try{i=JSON.parse(r)}catch{return H.error(`Failed to parse server-response JSON`),[]}return this.extractVideoItems(i)}catch(e){return H.error(`parseServerResponse failed`,e),[]}}parseWatchPageMetrics(e){try{let t=new DOMParser().parseFromString(e,`text/html`).querySelector(`meta[name="server-response"]`);if(!t)return null;let n=t.getAttribute(`content`)??``,r=this.decodeHtmlEntities(n),i=JSON.parse(r)?.data?.response?.video?.count;return i?{viewCount:i.view??0,mylistCount:i.mylist??0,commentCount:i.comment??0,likeCount:i.like??0}:null}catch(e){return H.error(`parseWatchPageMetrics failed`,e),null}}decodeHtmlEntities(e){if(!e)return``;let t=e.replace(/&quot;/g,`"`).replace(/&#39;/g,`'`).replace(/&amp;/g,`&`).replace(/&lt;/g,`<`).replace(/&gt;/g,`>`);return t=t.replace(/&#(\d+);/g,(e,t)=>String.fromCharCode(parseInt(t,10))),t=t.replace(/&#x([0-9a-fA-F]+);/g,(e,t)=>String.fromCharCode(parseInt(t,16))),t}extractVideoItems(e){let t=[],n=e=>{let n=(e?.id??e?.contentId??e?.watchId??``).toString();if(!n)return;let r=(e?.title??e?.shortTitle??``).toString();if(!r)return;let i=e?.count??{},a=Number(i.view??e?.viewCounter??0)||0,o=Number(i.comment??e?.commentCounter??0)||0,s=Number(i.mylist??e?.mylistCounter??0)||0,c=Number(i.like??e?.likeCounter??0)||0,l=e?.thumbnail??{},u=(l.nHdUrl||l.listingUrl||l.largeUrl||l.middleUrl||l.url||e?.thumbnailUrl||``).toString(),d=(e?.registeredAt||e?.startTime||e?.postedDateTime||``)?.toString?.()??``,f=``,p=`user`;e?.channel?.name?(f=e.channel.name,p=`channel`):e?.owner&&(f=e.owner.name??e.owner.nickname??``,p=e.owner.ownerType===`channel`?`channel`:`user`),e?.isChannelVideo&&(p=`channel`),t.push({videoId:n,title:r,viewCount:a,commentCount:o,mylistCount:s,likeCount:c,thumbnail:u,postedAt:d,ownerName:f,ownerType:p})},r=(e,i)=>{if(i>10||t.length>=100||!e)return;if(Array.isArray(e)){for(let n of e){if(t.length>=100)return;r(n,i+1)}return}if(typeof e!=`object`||!e)return;let a=e;(a.id||a.contentId||a.watchId)&&n(a);let o=[`data`,`items`,`searchResult`,`search`,`result`,`videos`,`list`],s=e;for(let e of o){if(t.length>=100)return;e in s&&r(s[e],i+1)}if(t.length===0&&i<7)for(let[e,n]of Object.entries(s)){if(t.length>=100)return;!o.includes(e)&&typeof n==`object`&&r(n,i+2)}};return r(e,0),t}deduplicateItems(e){let t=new Set,n=[];for(let r of e)r.videoId&&(t.has(r.videoId)||(t.add(r.videoId),n.push(r)));return n}},U=r(`dAnimeCfRanking:RepresentativeSelector`);function sc(e,t,n){if(e.length===0)return{success:!1,video:null,failureReason:`検索結果が0件です`};let r=e.filter(e=>n.determineUploaderType(e.ownerName,t)===`danime`),i=e.filter(e=>n.determineUploaderType(e.ownerName,t)===`official`),a=cc(r),o=cc(i);if(U.debug(`Candidate videos`,{animeTitle:t,danimeCount:r.length,titleUploaderCount:i.length,danimeVideo:a?{id:a.videoId,views:a.viewCount}:null,titleVideo:o?{id:o.videoId,views:o.viewCount}:null}),a&&o){let e=a.viewCount??0,n=o.viewCount??0,r=e>=n?a:o,i=e>=n?`dAnime`:`titleUploader`;return U.info(`Representative video selected (compared by viewCount)`,{animeTitle:t,videoId:r.videoId,viewCount:r.viewCount,source:i,danimeViews:e,titleViews:n}),{success:!0,video:r,failureReason:null}}return a?(U.info(`Representative video selected (dAnime only)`,{animeTitle:t,videoId:a.videoId,viewCount:a.viewCount}),{success:!0,video:a,failureReason:null}):o?(U.info(`Representative video selected (titleUploader only)`,{animeTitle:t,videoId:o.videoId,viewCount:o.viewCount}),{success:!0,video:o,failureReason:null}):(U.warn(`No representative video found`,{animeTitle:t,totalResults:e.length,danimeCount:r.length,titleUploaderCount:i.length}),{success:!1,video:null,failureReason:`公式動画が見つかりませんでした（検索結果: ${e.length}件）`})}function cc(e){if(e.length===0)return null;let t=e.filter(e=>{if(!e.postedAt)return!1;let t=new Date(e.postedAt);return!isNaN(t.getTime())});return t.length===0?(U.warn(`No valid postedAt found, using first video`),e[0]):[...t].sort((e,t)=>new Date(e.postedAt).getTime()-new Date(t.postedAt).getTime())[0]}var lc=r(`dAnimeCfRanking:FetchController`),uc=class{queue=[];activeCount=0;maxConcurrent=3;apiClient;onComplete=null;processing=new Set;constructor(){this.apiClient=new oc}setOnComplete(e){this.onComplete=e}async fetch(e,t=!1){let n=Ys(e);if(!t){let t=await Eo(e);if(t&&Ao(t))return lc.debug(`Cache hit`,{title:e}),t}return this.processing.has(e)?new Promise((t,r)=>{this.queue.push({title:e,canonicalQuery:n,resolve:t,reject:r})}):new Promise((t,r)=>{this.queue.push({title:e,canonicalQuery:n,resolve:t,reject:r}),this.processQueue()})}async fetchBatch(e){let t=e.map(e=>this.fetch(e.title));return Promise.all(t)}processQueue(){for(;this.queue.length>0&&this.activeCount<this.maxConcurrent;){let e=this.queue.shift();if(!e)break;if(this.processing.has(e.title)){lc.debug(`Skipping duplicate request`,{title:e.title});continue}this.processing.add(e.title),this.activeCount++,this.executeRequest(e).then(t=>{e.resolve(t),this.onComplete&&this.onComplete(e.title,t)}).catch(t=>{e.reject(t)}).finally(()=>{this.activeCount--,this.processing.delete(e.title),setTimeout(()=>this.processQueue(),0)})}}async executeRequest(e){let{title:t,canonicalQuery:n}=e,r=jo(t,n);await Do(r);try{let e=await this.apiClient.search(n);if(e.length===0){let e=await this.apiClient.search(t);if(e.length===0){let e=No(r,`検索結果が0件です`);return await Do(e),e}return this.processSearchResults(r,e,t)}return this.processSearchResults(r,e,t)}catch(e){let n=e instanceof Error?e.message:`Unknown error`;lc.error(`Fetch request failed`,e,{title:t});let i=No(r,n);return await Do(i),i}}async processSearchResults(e,t,n){let r=sc(t,n,oc);if(!r.success||!r.video){let t=No(e,r.failureReason??`代表動画の選択に失敗しました`);return await Do(t),t}let i=oc.toRepresentativeVideo(r.video,n),a={viewCount:r.video.viewCount,mylistCount:r.video.mylistCount,commentCount:r.video.commentCount,likeCount:r.video.likeCount};if(a.likeCount===0){let e=await this.apiClient.fetchMetrics(r.video.videoId);e&&(a=e)}let o=Mo(e,{representativeVideoId:r.video.videoId,representativeVideo:i,metrics:a});return await Do(o),lc.info(`Fetch completed`,{title:e.title,videoId:r.video.videoId,metrics:a}),o}clearQueue(){let e=[...this.queue];this.queue=[];for(let t of e)t.reject(Error(`Queue cleared`));lc.info(`Queue cleared`,{count:e.length})}getStatus(){return{queueLength:this.queue.length,activeCount:this.activeCount}}};function dc(){return new uc}var fc=r(`dAnimeCfRanking:ScoreCalculator`);function pc(e){return e<=3?`S+++`:e<=6?`S++`:e<=10?`S+`:e<=15?`S`:e<=25?`A`:e<=40?`B`:e<=55?`C`:e<=70?`D`:e<=85?`E`:e<=95?`F`:`G`}function W(e){return Math.log10(e+1)}function mc(e){return{viewCount:W(e.viewCount),mylistCount:W(e.mylistCount),commentCount:W(e.commentCount),likeCount:W(e.likeCount)}}function hc(e){if(e.length===0)return[];let t=Math.min(...e),n=Math.max(...e);return n===t?e.map(()=>0):e.map(e=>(e-t)/(n-t))}function gc(e){let t=e.filter(e=>e.metrics!==null);if(t.length===0)return e.map(()=>null);let n=t.map(e=>W(e.metrics.viewCount)),r=t.map(e=>W(e.metrics.mylistCount)),i=t.map(e=>W(e.metrics.commentCount)),a=t.map(e=>W(e.metrics.likeCount)),o=hc(n),s=hc(r),c=hc(i),l=hc(a),u=0;return e.map(e=>{if(e.metrics===null)return null;let t={viewCount:o[u],mylistCount:s[u],commentCount:c[u],likeCount:l[u]};return u++,t})}function _c(e){return(e.viewCount+e.mylistCount+e.commentCount+e.likeCount)/4}function vc(e){let t=gc(e),n=e.map((e,n)=>{let r=t[n];if(r===null||e.metrics===null)return{title:e.title,scoreData:null};let i=_c(r),a=mc(e.metrics);return{title:e.title,scoreData:{totalScore:i,normalizedMetrics:r,logMetrics:a}}}),r=n.map((e,t)=>({...e,originalIndex:t})).filter(e=>e.scoreData!==null);r.sort((e,t)=>{let n=e.scoreData?.totalScore??0;return(t.scoreData?.totalScore??0)-n});let i=r.length,a=new Map;r.forEach((e,t)=>{a.set(e.originalIndex,t+1)});let o=n.map((e,t)=>{if(e.scoreData===null)return{title:e.title,rankData:null};let n=a.get(t)??0,r=pc(i>0?n/i*100:100);return{title:e.title,rankData:{rank:n,totalCount:i,tier:r,score:e.scoreData}}});return fc.debug(`Ranks calculated`,{inputCount:e.length,validCount:i}),o}var yc=r(`dAnimeCfRanking:RankBadge`),bc={"S+++":{background:`linear-gradient(115deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 12%, rgba(255,255,255,0) 24%, rgba(255,255,255,0.55) 38%, rgba(255,255,255,0) 52%), linear-gradient(135deg, #6f4300 0%, #c98900 16%, #fff3a6 34%, #d99a00 50%, #fff8cf 64%, #b47500 78%, #f7c94a 100%)`,text:`#241700`,border:`#9f6a00`,shadow:`inset 0 1px 0 rgba(255,255,255,0.72), inset 0 -1px 0 rgba(84,51,0,0.42), 0 1px 4px rgba(160,105,0,0.34)`,textShadow:`0 1px 0 rgba(255,255,255,0.45)`},"S++":{background:`linear-gradient(115deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.3) 13%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.48) 39%, rgba(255,255,255,0) 53%), linear-gradient(135deg, #7c5200 0%, #d39a10 18%, #ffe887 34%, #c88700 50%, #fff4b8 65%, #a96b00 80%, #eeb735 100%)`,text:`#241700`,border:`#a16f08`,shadow:`inset 0 1px 0 rgba(255,255,255,0.68), inset 0 -1px 0 rgba(86,56,0,0.4), 0 1px 4px rgba(150,100,0,0.3)`,textShadow:`0 1px 0 rgba(255,255,255,0.42)`},"S+":{background:`linear-gradient(115deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.28) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.44) 40%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #8a6500 0%, #d6a619 18%, #ffe27a 34%, #be8500 50%, #fff1a8 66%, #9f7000 80%, #e4ad26 100%)`,text:`#241700`,border:`#a5790a`,shadow:`inset 0 1px 0 rgba(255,255,255,0.64), inset 0 -1px 0 rgba(88,63,0,0.38), 0 1px 4px rgba(135,96,0,0.26)`,textShadow:`0 1px 0 rgba(255,255,255,0.4)`},S:{background:`linear-gradient(115deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.26) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #957100 0%, #d1a124 18%, #ffdc6b 34%, #b98300 50%, #f7e49a 66%, #946800 80%, #d9a42a 100%)`,text:`#261a00`,border:`#9d750c`,shadow:`inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(84,62,0,0.36), 0 1px 4px rgba(120,90,0,0.24)`,textShadow:`0 1px 0 rgba(255,255,255,0.38)`},A:{background:`linear-gradient(115deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.34) 13%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.58) 39%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #777b80 0%, #c8ccd0 18%, #f7f8f8 34%, #a4a9ad 50%, #ffffff 64%, #8c9196 78%, #d8dbde 100%)`,text:`#1e2328`,border:`#8d9398`,shadow:`inset 0 1px 0 rgba(255,255,255,0.78), inset 0 -1px 0 rgba(66,72,78,0.36), 0 1px 4px rgba(90,96,102,0.26)`,textShadow:`0 1px 0 rgba(255,255,255,0.55)`},B:{background:`linear-gradient(115deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.22) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.36) 41%, rgba(255,255,255,0) 55%), linear-gradient(135deg, #5b2e10 0%, #a85d25 18%, #e0a05b 34%, #8a4519 50%, #f0be7b 66%, #6d3512 82%, #bd7430 100%)`,text:`#fffaf3`,border:`#7a3c15`,shadow:`inset 0 1px 0 rgba(255,235,202,0.52), inset 0 -1px 0 rgba(45,22,7,0.52), 0 1px 4px rgba(95,48,17,0.32)`,textShadow:`0 1px 1px rgba(45,22,7,0.72)`},C:{background:`#ffffff`,text:`#333333`,border:`#d7d7d7`,shadow:`none`,textShadow:`none`},D:{background:`#ffffff`,text:`#333333`,border:`#d7d7d7`,shadow:`none`,textShadow:`none`},E:{background:`#ffffff`,text:`#333333`,border:`#d7d7d7`,shadow:`none`,textShadow:`none`},F:{background:`#ffffff`,text:`#333333`,border:`#d7d7d7`,shadow:`none`,textShadow:`none`},G:{background:`#ffffff`,text:`#333333`,border:`#d7d7d7`,shadow:`none`,textShadow:`none`}},xc=`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  margin: 0 4px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  transition: transform 0.1s ease;
`,Sc=`
  ${xc}
  background: #e0e0e0;
  color: #666;
  border: 1px solid #ccc;
`,Cc=`
  ${xc}
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ef9a9a;
`,wc=`
  display: inline-flex;
  vertical-align: middle;
`,Tc=`
  display: inline-flex;
  vertical-align: middle;
  margin-left: 2px;
  opacity: 0.9;
`,G=null;function Ec(){return G||(G=document.createElement(`div`),G.className=`cf-ranking-global-tooltip`,G.style.cssText=`
      position: fixed;
      background: rgba(0, 0, 0, 0.95);
      color: #fff;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: normal;
      white-space: pre-line;
      z-index: 2147483647;
      pointer-events: none;
      max-width: 320px;
      min-width: 220px;
      line-height: 1.6;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      display: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `,document.body.appendChild(G)),G}function Dc(e,t){let n=Ec();n.textContent=e,n.style.display=`block`;let r=t.getBoundingClientRect(),i=n.getBoundingClientRect(),a=r.left+r.width/2-i.width/2,o=r.top-i.height-8;a<8&&(a=8),a+i.width>window.innerWidth-8&&(a=window.innerWidth-i.width-8),o<8&&(o=r.bottom+8),n.style.left=`${a}px`,n.style.top=`${o}px`}function Oc(){let e=Ec();e.style.display=`none`}function kc(e){let t=bc[e];return`
    ${xc}
    background: ${t.background};
    color: ${t.text};
    border: 2px solid ${t.border};
    box-shadow: ${t.shadow};
    text-shadow: ${t.textShadow};
  `}function Ac(e){let t=document.createElement(`div`);return t.className=`cf-ranking-badge cf-ranking-loading`,t.setAttribute(`style`,Sc),t.innerHTML=jc(fs),t.__cfRanking={title:e},t}function jc(e){return`<span style="${wc}">${z(e,14)}</span>`}function Mc(e){return`<span style="${Tc}">${z(e,12)}</span>`}function Nc(e,t){let n=(e.score.totalScore*100).toFixed(1),r=t?Mc(Vo):``;return`${F(`rankBadge`,{rank:String(e.rank),score:n,tier:e.tier})}${r}`}function Pc(e,t,n,r,i=!1){let a=e,o=a.__cfRanking?.title??n.title;e.onmouseenter=null,e.onmouseleave=null,e.onclick=null,n.status===`failed`||!t?(e.className=`cf-ranking-badge cf-ranking-error`,e.setAttribute(`style`,Cc),e.innerHTML=jc(Io),a.__cfRanking={title:o,retryCallback:r,tooltipContent:F(`fetchFailed`,{message:n.failureReason??I(`unknownError`)})},Fc(e),r&&(e.onclick=()=>Vc(a,o,r),e.style.cursor=`pointer`)):(e.className=`cf-ranking-badge cf-ranking-rank`,e.setAttribute(`style`,kc(t.tier)),e.innerHTML=Nc(t,i),e.style.cursor=`default`,a.__cfRanking={title:o,tooltipContent:Lc(Ic(t,n,i))},Fc(e))}function Fc(e){let t=e;e.onmouseenter=()=>{let n=t.__cfRanking?.tooltipContent;n&&Dc(n,e),e.classList.contains(`cf-ranking-rank`)&&(e.style.transform=`scale(1.1)`)},e.onmouseleave=()=>{Oc(),e.style.transform=`scale(1)`}}function Ic(e,t,n){return{rank:e.rank,totalCount:e.totalCount,tier:e.tier,totalScore:e.score.totalScore,rawMetrics:t.metrics??{viewCount:0,mylistCount:0,commentCount:0,likeCount:0},normalizedMetrics:e.score.normalizedMetrics,representativeVideo:t.representativeVideo,fetchedAt:t.fetchedAt,isRankingFinalized:n}}function Lc(e){let t=[],n=e.isRankingFinalized?I(`confirmed`):I(`temporary`);return t.push(`${F(`rankBadge`,{rank:String(e.rank),score:``,tier:e.tier}).replace(`()`,``).replace(`( pts)`,``)} / ${e.totalCount} ${I(`title`)} ${n}`),t.push(F(`totalScore`,{score:(e.totalScore*100).toFixed(1)})),t.push(``),t.push(I(`metricsHeader`)),t.push(`${I(`view`)}: ${Rc(e.rawMetrics.viewCount)} / ${(e.normalizedMetrics.viewCount*100).toFixed(0)}%`),t.push(`${I(`mylist`)}: ${Rc(e.rawMetrics.mylistCount)} / ${(e.normalizedMetrics.mylistCount*100).toFixed(0)}%`),t.push(`${I(`comment`)}: ${Rc(e.rawMetrics.commentCount)} / ${(e.normalizedMetrics.commentCount*100).toFixed(0)}%`),t.push(`${I(`like`)}: ${Rc(e.rawMetrics.likeCount)} / ${(e.normalizedMetrics.likeCount*100).toFixed(0)}%`),t.push(``),e.representativeVideo&&(t.push(`▼ ${I(`video`)}`),t.push(`${e.representativeVideo.title}`),t.push(`${zc(e.representativeVideo.postedAt)} (${Bc(e.representativeVideo.uploaderType)})`)),t.push(``),t.push(`${I(`fetched`)}: ${zc(e.fetchedAt)}`),t.join(`
`)}function Rc(e){return e.toLocaleString(`ja-JP`)}function zc(e){try{return new Date(e).toLocaleDateString(`ja-JP`,{year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`})}catch{return e}}function Bc(e){switch(e){case`danime`:return`dアニメストア ニコニコ支店`;case`official`:return`公式`;default:return`不明`}}function Vc(e,t,n){let r=Date.now();if(r-(e.__cfRanking?.lastRetryTime??0)<3e3){yc.debug(`Retry cooldown active`,{title:t});return}e.__cfRanking&&(e.__cfRanking.lastRetryTime=r),e.className=`cf-ranking-badge cf-ranking-loading`,e.setAttribute(`style`,Sc),e.innerHTML=jc(fs),n(t)}var Hc=`cf-ranking-list-modal-host`,Uc=`
  :host {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(3, 8, 18, 0.72);
  }

  .dialog {
    width: min(1180px, 100%);
    max-height: min(820px, calc(100vh - 48px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #101827;
    color: #eef4ff;
    border: 1px solid rgba(154, 180, 210, 0.28);
    border-radius: 8px;
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.44);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(154, 180, 210, 0.18);
  }

  .title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .summary {
    margin-top: 4px;
    color: #a9b7ca;
    font-size: 12px;
  }

  .close-btn {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    background: rgba(255, 255, 255, 0.08);
    color: #eef4ff;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 6px;
    cursor: pointer;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.14);
  }

  .body {
    overflow: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid rgba(154, 180, 210, 0.14);
    vertical-align: top;
    text-align: left;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #152033;
    color: #b9c7d9;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0;
  }

  td {
    font-size: 12px;
    line-height: 1.45;
  }

  .rank-cell {
    width: 82px;
  }

  .title-cell {
    width: 25%;
  }

  .score-cell {
    width: 92px;
  }

  .metrics-cell {
    width: 260px;
  }

  .video-cell {
    width: 30%;
  }

  .fetched-cell {
    width: 132px;
  }

  .rank {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    color: #fff;
  }

  .tier {
    min-width: 34px;
    padding: 2px 6px;
    text-align: center;
    color: #101827;
    background: #f3c84d;
    border-radius: 4px;
    font-size: 11px;
  }

  .muted {
    color: #8ea0b8;
  }

  .title-text {
    overflow-wrap: anywhere;
    font-weight: 650;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px 10px;
  }

  .metric-label {
    color: #8ea0b8;
  }

  .video-title {
    overflow-wrap: anywhere;
  }

  .video-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    color: #79b8ff;
    text-decoration: none;
  }

  .video-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 760px) {
    .backdrop {
      align-items: stretch;
      padding: 10px;
    }

    .dialog {
      max-height: calc(100vh - 20px);
    }

    table,
    thead,
    tbody,
    tr,
    th,
    td {
      display: block;
    }

    thead {
      display: none;
    }

    tr {
      padding: 12px;
      border-bottom: 1px solid rgba(154, 180, 210, 0.18);
    }

    td {
      width: auto !important;
      padding: 4px 0;
      border-bottom: 0;
    }
  }
`;function Wc(e,t){document.querySelector(`.${Hc}`)?.remove();let n=document.createElement(`div`);n.className=Hc;let r=n.attachShadow({mode:`open`}),i=document.createElement(`style`);i.textContent=Uc,r.appendChild(i);let a=document.createElement(`div`);a.className=`backdrop`,a.innerHTML=Gc(e,t),r.appendChild(a);let o=e=>{e.key===`Escape`&&s()},s=()=>{document.removeEventListener(`keydown`,o),n.remove()};a.addEventListener(`click`,e=>{e.target===a&&s()}),r.querySelector(`.close-btn`)?.addEventListener(`click`,s),document.addEventListener(`keydown`,o),document.body.appendChild(n)}function Gc(e,t){let n=[...e].sort(Kc),r=n.filter(e=>e.rankData!==null).length,i=n.filter(e=>e.cacheEntry?.status===`failed`).length,a=n.length-r-i,o=I(t?`statusFinal`:`statusTemporary`);return`
    <section class="dialog" role="dialog" aria-modal="true" aria-label="${I(`detailRanking`)}">
      <header class="header">
        <div>
          <h2 class="title">${I(`detailRanking`)}</h2>
          <div class="summary">
            ${F(`summary`,{failed:String(i),pending:String(a),ranked:String(r),status:o,target:String(n.length)})}
          </div>
        </div>
        <button class="close-btn" type="button" aria-label="${I(`close`)}">
          ${z(Ho,20)}
        </button>
      </header>
      <div class="body">
        <table>
          <thead>
            <tr>
              <th class="rank-cell">${I(`rank`)}</th>
              <th class="title-cell">${I(`title`)}</th>
              <th class="score-cell">${I(`score`)}</th>
              <th class="metrics-cell">${I(`metrics`)}</th>
              <th class="video-cell">${I(`video`)}</th>
              <th class="fetched-cell">${I(`fetchedAt`)}</th>
            </tr>
          </thead>
          <tbody>
            ${n.map(qc).join(``)}
          </tbody>
        </table>
      </div>
    </section>
  `}function Kc(e,t){let n=e.rankData?.rank??2**53-1,r=t.rankData?.rank??2**53-1;return n===r?e.title.localeCompare(t.title,`ja-JP`):n-r}function qc(e){let t=e.rankData,n=e.cacheEntry,r=n?.metrics;return`
    <tr>
      <td class="rank-cell">${Jc(t,n)}</td>
      <td class="title-cell"><div class="title-text">${K(e.title)}</div></td>
      <td class="score-cell">${t?F(`points`,{score:(t.score.totalScore*100).toFixed(1)}):`<span class="muted">-</span>`}</td>
      <td class="metrics-cell">${r?Yc(r):`<span class="muted">-</span>`}</td>
      <td class="video-cell">${Xc(n)}</td>
      <td class="fetched-cell">${n?Qc(n.fetchedAt):`<span class="muted">${I(`pending`)}</span>`}</td>
    </tr>
  `}function Jc(e,t){return e?`
      <span class="rank">
        <span class="tier">${K(e.tier)}</span>
        ${F(`rankBadge`,{rank:String(e.rank),score:``,tier:K(e.tier)}).replace(`()`,``).replace(`( pts)`,``)}
      </span>
    `:t?.status===`failed`?`<span class="muted">${I(`failed`)}</span>`:`<span class="muted">${I(`pending`)}</span>`}function Yc(e){return`
    <div class="metrics-grid">
      <span><span class="metric-label">${I(`view`)}</span> ${Zc(e.viewCount)}</span>
      <span><span class="metric-label">${I(`comment`)}</span> ${Zc(e.commentCount)}</span>
      <span><span class="metric-label">${I(`mylist`)}</span> ${Zc(e.mylistCount)}</span>
      <span><span class="metric-label">${I(`like`)}</span> ${Zc(e.likeCount)}</span>
    </div>
  `}function Xc(e){let t=e?.representativeVideo;if(!t)return e?.failureReason?`<span class="muted">${K(e.failureReason)}</span>`:`<span class="muted">-</span>`;let n=`https://www.nicovideo.jp/watch/${encodeURIComponent(t.videoId)}`;return`
    <div class="video-title">${K(t.title)}</div>
    <div class="muted">${K(t.uploaderName)} / ${Qc(t.postedAt)}</div>
    <a class="video-link" href="${n}" target="_blank" rel="noopener noreferrer">
      ${z(is,14)}
      ${K(t.videoId)}
    </a>
  `}function Zc(e){return e.toLocaleString(`ja-JP`)}function Qc(e){try{return new Date(e).toLocaleString(`ja-JP`,{year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`})}catch{return e}}function K(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}var q=r(`dAnimeCfRanking`),J=[],Y=new Map,X=new Map,Z=null,$c=null,el=null,tl=null,nl=null,rl=!1,il=null,al=new Set,ol=!1,Q=null,sl=!1,cl=new Set,ll=0,ul=null,$=!1;async function dl(){q.info(`d-anime-cf-ranking starting...`),console.log(`[CF-RANKING DEBUG] === 初期化開始 ===`);let e=vo();if(So(),await wo(),Q=ms(e,{onSettingsChange:Dl,onRefreshTrigger:Ol,onOpenRankingList:jl}),vs(Q),yo(e=>{Q?.updateSettings(e),Al(e.enabled)}),!e.enabled){q.info(`Ranking display is disabled`);return}await pl(),console.log(`[CF-RANKING DEBUG] キャッシュ読み込み後:`,{cacheEntryMapSize:Y.size,cacheEntryTitles:Array.from(Y.keys()).slice(0,10)}),Z=dc(),Z.setOnComplete(bl);let t=Bs();J=await fl(),q.info(`Cards detected`,{count:J.length});for(let e of t)Es(e)||cl.add(e);if(console.log(`[CF-RANKING DEBUG] カード検出:`,{domTotal:t.length,visibleCards:J.length,hiddenCards:cl.size,cardTitles:J.map(e=>e.title).slice(0,10)}),J.length===0&&cl.size===0){q.warn(`No cards found`);return}wl(J),console.log(`[CF-RANKING DEBUG] バッジ挿入後:`,{badgeMapSize:X.size}),_l();for(let e of J)el?.observe(e.element);$c=Rs(Sl),zs($c),cl.size>0&&(tl=Vs(cl,Cl),Hs(tl),q.info(`Visibility observer started for hidden cards`,{count:cl.size})),ol=!0,setTimeout(()=>{yl()},500),setTimeout(()=>{ml()},2e3),q.info(`d-anime-cf-ranking initialized`),console.log(`[CF-RANKING DEBUG] === 初期化完了 ===`)}async function fl(){for(let e=0;e<30;e++){let e=Ds();if(e.length>0)return e;await new Promise(e=>setTimeout(e,500))}return[]}async function pl(){try{let e=await Oo(),t=0,n=0;for(let r of e)Ao(r)?(Y.set(r.title,r),t++):n++;q.info(`Loaded cached entries`,{total:e.length,valid:t}),console.log(`[CF-RANKING DEBUG] キャッシュ読み込み詳細:`,{totalInIndexedDB:e.length,validEntries:t,invalidEntries:n,titles:e.map(e=>e.title).slice(0,20)})}catch(e){q.error(`Failed to load cached entries`,e)}}function ml(){if(!Z)return;console.log(`[CF-RANKING DEBUG] === バックグラウンドフェッチ開始 ===`),console.log(`[CF-RANKING DEBUG] allCards:`,J.length),console.log(`[CF-RANKING DEBUG] cacheEntryMap:`,Y.size);let e=J.filter(e=>Y.has(e.title)),t=J.filter(e=>!Y.has(e.title));if(console.log(`[CF-RANKING DEBUG] キャッシュ状況:`,{cached:e.length,uncached:t.length,uncachedTitles:t.map(e=>e.title).slice(0,10)}),t.length===0&&J.length>0){$=!0,q.info(`All cards cached, ranking finalized immediately`),console.log(`[CF-RANKING DEBUG] 全カードキャッシュ済み - 即時確定`),Tl();return}ll=0,hl()}function hl(){ul!==null&&clearTimeout(ul),ul=setTimeout(()=>{ul=null,gl()},300)}function gl(){if(!Z||ll>=J.length){$||($=!0,q.info(`Ranking finalized`,{total:Y.size}),console.log(`[CF-RANKING DEBUG] === フェッチ完了・順位確定 ===`),console.log(`[CF-RANKING DEBUG] 最終状態:`,{allCards:J.length,cacheEntryMap:Y.size,badgeMap:X.size}),Tl());return}let e=J[ll];if(ll++,!e||Y.has(e.title)){hl();return}Z.fetch(e.title).then(t=>{bl(e.title,t)}).catch(()=>{}).finally(()=>{hl()})}function _l(){el=new IntersectionObserver(e=>{if(!ol)return;let t=!1;for(let n of e){let e=n.target,r=al.has(e),i=n.isIntersecting;r!==i&&(t=!0,i?al.add(e):al.delete(e))}t&&vl()},{root:null,rootMargin:`50px`,threshold:0})}function vl(){il!==null&&clearTimeout(il),il=setTimeout(()=>{il=null,yl()},300)}function yl(){if(!Z)return;let e=J.filter(e=>al.has(e.element)).slice(0,10).filter(e=>!Y.has(e.title));if(e.length!==0)for(let t of e)Z.fetch(t.title).then(e=>{bl(t.title,e)}).catch(e=>{q.error(`Fetch failed`,e,{title:t.title})})}function bl(e,t){Y.has(e)||(Y.set(e,t),xl())}function xl(){rl=!0,nl===null&&(nl=setTimeout(()=>{nl=null,rl&&(rl=!1,Tl())},500))}function Sl(e){console.log(`[CF-RANKING DEBUG] === 新しいカード検出 ===`),console.log(`[CF-RANKING DEBUG] 検出されたカード:`,e.length);let t=new Set(J.map(e=>e.title)),n=e.filter(e=>!t.has(e.title)),r=e.filter(e=>t.has(e.title));if(console.log(`[CF-RANKING DEBUG] 重複チェック:`,{total:e.length,unique:n.length,duplicates:r.length,duplicateTitles:r.map(e=>e.title)}),n.length!==0){J=[...J,...n],console.log(`[CF-RANKING DEBUG] allCards更新後:`,J.length),wl(n);for(let e of n)el?.observe(e.element);$&&($=!1,ml())}}function Cl(e){console.log(`[CF-RANKING DEBUG] === カードが表示状態に変更 ===`),console.log(`[CF-RANKING DEBUG] 新しく表示されたカード:`,e.length),console.log(`[CF-RANKING DEBUG] タイトル:`,e.map(e=>e.title)),Sl(e)}function wl(e){let t=Ps(e);for(let e of t){if(!e.insertionPoint)continue;let t=Ac(e.title);e.insertionPoint.parentElement?.insertBefore(t,e.insertionPoint),X.set(e.title,t),Ns(e.element)}}function Tl(){console.log(`[CF-RANKING DEBUG] === 順位再計算 ===`);let e=J.map(e=>{let t=Y.get(e.title);return{title:e.title,metrics:t?.status===`ok`?t.metrics:null}}),t=e.filter(e=>e.metrics!==null);console.log(`[CF-RANKING DEBUG] 順位計算入力:`,{totalInputs:e.length,validInputs:t.length,invalidInputs:e.length-t.length,isRankingFinalized:$});let n=vc(e),r=n.filter(e=>e.rankData!==null),i=r.map(e=>e.rankData?.rank??0);console.log(`[CF-RANKING DEBUG] 順位計算結果:`,{totalOutputs:n.length,validRanks:r.length,minRank:Math.min(...i),maxRank:Math.max(...i),totalCount:r[0]?.rankData?.totalCount});let a=0,o=0,s=0,c=0;for(let e of n){let t=X.get(e.title),n=Y.get(e.title);if(!t){o++;continue}if(!n){s++;continue}if(n.status===`pending`){c++;continue}Pc(t,e.rankData,n,El,$),a++}console.log(`[CF-RANKING DEBUG] バッジ更新結果:`,{updated:a,skippedNoBadge:o,skippedNoEntry:s,skippedPending:c})}function El(e){Z&&(Y.delete(e),Z.fetch(e,!0).then(t=>{bl(e,t)}).catch(t=>{q.error(`Retry failed`,t,{title:e})}))}function Dl(e){q.info(`Settings changed`,{settings:e}),_o(e)}async function Ol(){if(sl||!Z){q.warn(`Refresh already in progress or fetch controller not ready`);return}q.info(`Manual refresh triggered`),console.log(`[CF-RANKING DEBUG] === マニュアル再調査開始 ===`),sl=!0,Q?.setRefreshing(!0);try{await ko(),Y.clear(),kl(),$=!1;let e=0,t=J.length;Q?.updateProgress(e,t);for(let n of J){if(!sl)break;try{let r=await Z.fetch(n.title,!0);bl(n.title,r),e++,Q?.updateProgress(e,t)}catch(r){q.error(`Refresh fetch failed`,r,{title:n.title}),e++,Q?.updateProgress(e,t)}await new Promise(e=>setTimeout(e,300))}$=!0,Tl(),q.info(`Manual refresh completed`,{total:e}),console.log(`[CF-RANKING DEBUG] === マニュアル再調査完了 ===`)}catch(e){q.error(`Manual refresh failed`,e)}finally{sl=!1,Q?.setRefreshing(!1),Q?.updateProgress(0,0)}}function kl(){for(let e of X.values())e.className=`cf-ranking-badge cf-ranking-loading`,e.setAttribute(`style`,`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 2px 6px;
      margin: 0 4px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      position: relative;
      white-space: nowrap;
      transition: transform 0.1s ease;
      background: #e0e0e0;
      color: #666;
      border: 1px solid #ccc;
    `),e.innerHTML=`<span style="display: inline-flex; vertical-align: middle;"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z"/></svg></span>`}function Al(e){for(let t of X.values())t.style.display=e?`inline-flex`:`none`}function jl(){let e=vc(J.map(e=>{let t=Y.get(e.title);return{title:e.title,metrics:t?.status===`ok`?t.metrics:null}})),t=new Map(e.map(e=>[e.title,e.rankData]));Wc(J.map(e=>({title:e.title,rankData:t.get(e.title)??null,cacheEntry:Y.get(e.title)??null})),$)}dl().catch(e=>{q.error(`d-anime-cf-ranking failed to initialize`,e)})})();
