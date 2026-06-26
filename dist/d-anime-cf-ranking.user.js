// ==UserScript==
// @name         d-anime-cf-ranking
// @namespace    dAnimeCfRanking
// @version      1.3.0
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

(function () {
  'use strict';

  const pt={debug:"debug",info:"info",warn:"warn",error:"error"},ht={debug:10,info:20,warn:30,error:40};let qn=e=>ht[e]>=ht.warn;const M=e=>{const t=`[${e}]`,n={};return Object.keys(pt).forEach(r=>{const o=pt[r];n[r]=(...i)=>{if(!qn(r))return;(console[o]??console.log)(t,...i);};}),n},Kn=[{label:"6時間",hours:6},{label:"12時間",hours:12},{label:"24時間",hours:24},{label:"48時間",hours:48},{label:"1週間",hours:168}],Gt=1,Ht=168,Be={enabled:true,cacheTtlHours:24},Wn=10,Xn=3,Yn=3e3,Qn=500,er=300,tr="dAnimeCfRankingCache",Z="metricsCache",nr=1;function l(e,t,n){function r(a,c){if(a._zod||Object.defineProperty(a,"_zod",{value:{def:c,constr:s,traits:new Set},enumerable:false}),a._zod.traits.has(e))return;a._zod.traits.add(e),t(a,c);const u=s.prototype,d=Object.keys(u);for(let f=0;f<d.length;f++){const p=d[f];p in a||(a[p]=u[p].bind(a));}}const o=n?.Parent??Object;class i extends o{}Object.defineProperty(i,"name",{value:e});function s(a){var c;const u=n?.Parent?new i:this;r(u,a),(c=u._zod).deferred??(c.deferred=[]);for(const d of u._zod.deferred)d();return u}return Object.defineProperty(s,"init",{value:r}),Object.defineProperty(s,Symbol.hasInstance,{value:a=>n?.Parent&&a instanceof n.Parent?true:a?._zod?.traits?.has(e)}),Object.defineProperty(s,"name",{value:e}),s}class se extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");}}class Jt extends Error{constructor(t){super(`Encountered unidirectional transform during encode: ${t}`),this.name="ZodEncodeError";}}const qt={};function W(e){return qt}function Kt(e){const t=Object.values(e).filter(r=>typeof r=="number");return Object.entries(e).filter(([r,o])=>t.indexOf(+r)===-1).map(([r,o])=>o)}function We(e,t){return typeof t=="bigint"?t.toString():t}function nt(e){return {get value(){{const t=e();return Object.defineProperty(this,"value",{value:t}),t}}}}function rt(e){return e==null}function ot(e){const t=e.startsWith("^")?1:0,n=e.endsWith("$")?e.length-1:e.length;return e.slice(t,n)}function rr(e,t){const n=(e.toString().split(".")[1]||"").length,r=t.toString();let o=(r.split(".")[1]||"").length;if(o===0&&/\d?e-\d?/.test(r)){const c=r.match(/\d?e-(\d?)/);c?.[1]&&(o=Number.parseInt(c[1]));}const i=n>o?n:o,s=Number.parseInt(e.toFixed(i).replace(".","")),a=Number.parseInt(t.toFixed(i).replace(".",""));return s%a/10**i}const mt=Symbol("evaluating");function v(e,t,n){let r;Object.defineProperty(e,t,{get(){if(r!==mt)return r===void 0&&(r=mt,r=n()),r},set(o){Object.defineProperty(e,t,{value:o});},configurable:true});}function Y(e,t,n){Object.defineProperty(e,t,{value:n,writable:true,enumerable:true,configurable:true});}function J(...e){const t={};for(const n of e){const r=Object.getOwnPropertyDescriptors(n);Object.assign(t,r);}return Object.defineProperties({},t)}function gt(e){return JSON.stringify(e)}function or(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}const Wt="captureStackTrace"in Error?Error.captureStackTrace:(...e)=>{};function Te(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}const ir=nt(()=>{if(typeof navigator<"u"&&navigator?.userAgent?.includes("Cloudflare"))return  false;try{const e=Function;return new e(""),!0}catch{return  false}});function me(e){if(Te(e)===false)return  false;const t=e.constructor;if(t===void 0||typeof t!="function")return  true;const n=t.prototype;return !(Te(n)===false||Object.prototype.hasOwnProperty.call(n,"isPrototypeOf")===false)}function Xt(e){return me(e)?{...e}:Array.isArray(e)?[...e]:e}const sr=new Set(["string","number","symbol"]);function Pe(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function q(e,t,n){const r=new e._zod.constr(t??e._zod.def);return (!t||n?.parent)&&(r._zod.parent=e),r}function h(e){const t=e;if(!t)return {};if(typeof t=="string")return {error:()=>t};if(t?.message!==void 0){if(t?.error!==void 0)throw new Error("Cannot specify both `message` and `error` params");t.error=t.message;}return delete t.message,typeof t.error=="string"?{...t,error:()=>t.error}:t}function ar(e){return Object.keys(e).filter(t=>e[t]._zod.optin==="optional"&&e[t]._zod.optout==="optional")}const cr={safeint:[Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]};function ur(e,t){const n=e._zod.def,r=n.checks;if(r&&r.length>0)throw new Error(".pick() cannot be used on object schemas containing refinements");const i=J(e._zod.def,{get shape(){const s={};for(const a in t){if(!(a in n.shape))throw new Error(`Unrecognized key: "${a}"`);t[a]&&(s[a]=n.shape[a]);}return Y(this,"shape",s),s},checks:[]});return q(e,i)}function lr(e,t){const n=e._zod.def,r=n.checks;if(r&&r.length>0)throw new Error(".omit() cannot be used on object schemas containing refinements");const i=J(e._zod.def,{get shape(){const s={...e._zod.def.shape};for(const a in t){if(!(a in n.shape))throw new Error(`Unrecognized key: "${a}"`);t[a]&&delete s[a];}return Y(this,"shape",s),s},checks:[]});return q(e,i)}function dr(e,t){if(!me(t))throw new Error("Invalid input to extend: expected a plain object");const n=e._zod.def.checks;if(n&&n.length>0){const i=e._zod.def.shape;for(const s in t)if(Object.getOwnPropertyDescriptor(i,s)!==void 0)throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}const o=J(e._zod.def,{get shape(){const i={...e._zod.def.shape,...t};return Y(this,"shape",i),i}});return q(e,o)}function fr(e,t){if(!me(t))throw new Error("Invalid input to safeExtend: expected a plain object");const n=J(e._zod.def,{get shape(){const r={...e._zod.def.shape,...t};return Y(this,"shape",r),r}});return q(e,n)}function pr(e,t){const n=J(e._zod.def,{get shape(){const r={...e._zod.def.shape,...t._zod.def.shape};return Y(this,"shape",r),r},get catchall(){return t._zod.def.catchall},checks:[]});return q(e,n)}function hr(e,t,n){const o=t._zod.def.checks;if(o&&o.length>0)throw new Error(".partial() cannot be used on object schemas containing refinements");const s=J(t._zod.def,{get shape(){const a=t._zod.def.shape,c={...a};if(n)for(const u in n){if(!(u in a))throw new Error(`Unrecognized key: "${u}"`);n[u]&&(c[u]=e?new e({type:"optional",innerType:a[u]}):a[u]);}else for(const u in a)c[u]=e?new e({type:"optional",innerType:a[u]}):a[u];return Y(this,"shape",c),c},checks:[]});return q(t,s)}function mr(e,t,n){const r=J(t._zod.def,{get shape(){const o=t._zod.def.shape,i={...o};if(n)for(const s in n){if(!(s in i))throw new Error(`Unrecognized key: "${s}"`);n[s]&&(i[s]=new e({type:"nonoptional",innerType:o[s]}));}else for(const s in o)i[s]=new e({type:"nonoptional",innerType:o[s]});return Y(this,"shape",i),i}});return q(t,r)}function re(e,t=0){if(e.aborted===true)return  true;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue!==true)return  true;return  false}function Yt(e,t){return t.map(n=>{var r;return (r=n).path??(r.path=[]),n.path.unshift(e),n})}function ve(e){return typeof e=="string"?e:e?.message}function X(e,t,n){const r={...e,path:e.path??[]};if(!e.message){const o=ve(e.inst?._zod.def?.error?.(e))??ve(t?.error?.(e))??ve(n.customError?.(e))??ve(n.localeError?.(e))??"Invalid input";r.message=o;}return delete r.inst,delete r.continue,t?.reportInput||delete r.input,r}function it(e){return Array.isArray(e)?"array":typeof e=="string"?"string":"unknown"}function ge(...e){const[t,n,r]=e;return typeof t=="string"?{message:t,code:"custom",input:n,inst:r}:{...t}}const Qt=(e,t)=>{e.name="$ZodError",Object.defineProperty(e,"_zod",{value:e._zod,enumerable:false}),Object.defineProperty(e,"issues",{value:t,enumerable:false}),e.message=JSON.stringify(t,We,2),Object.defineProperty(e,"toString",{value:()=>e.message,enumerable:false});},en=l("$ZodError",Qt),tn=l("$ZodError",Qt,{Parent:Error});function gr(e,t=n=>n.message){const n={},r=[];for(const o of e.issues)o.path.length>0?(n[o.path[0]]=n[o.path[0]]||[],n[o.path[0]].push(t(o))):r.push(t(o));return {formErrors:r,fieldErrors:n}}function br(e,t=n=>n.message){const n={_errors:[]},r=o=>{for(const i of o.issues)if(i.code==="invalid_union"&&i.errors.length)i.errors.map(s=>r({issues:s}));else if(i.code==="invalid_key")r({issues:i.issues});else if(i.code==="invalid_element")r({issues:i.issues});else if(i.path.length===0)n._errors.push(t(i));else {let s=n,a=0;for(;a<i.path.length;){const c=i.path[a];a===i.path.length-1?(s[c]=s[c]||{_errors:[]},s[c]._errors.push(t(i))):s[c]=s[c]||{_errors:[]},s=s[c],a++;}}};return r(e),n}const st=e=>(t,n,r,o)=>{const i=r?Object.assign(r,{async:false}):{async:false},s=t._zod.run({value:n,issues:[]},i);if(s instanceof Promise)throw new se;if(s.issues.length){const a=new(o?.Err??e)(s.issues.map(c=>X(c,i,W())));throw Wt(a,o?.callee),a}return s.value},at=e=>async(t,n,r,o)=>{const i=r?Object.assign(r,{async:true}):{async:true};let s=t._zod.run({value:n,issues:[]},i);if(s instanceof Promise&&(s=await s),s.issues.length){const a=new(o?.Err??e)(s.issues.map(c=>X(c,i,W())));throw Wt(a,o?.callee),a}return s.value},Me=e=>(t,n,r)=>{const o=r?{...r,async:false}:{async:false},i=t._zod.run({value:n,issues:[]},o);if(i instanceof Promise)throw new se;return i.issues.length?{success:false,error:new(e??en)(i.issues.map(s=>X(s,o,W())))}:{success:true,data:i.value}},vr=Me(tn),Le=e=>async(t,n,r)=>{const o=r?Object.assign(r,{async:true}):{async:true};let i=t._zod.run({value:n,issues:[]},o);return i instanceof Promise&&(i=await i),i.issues.length?{success:false,error:new e(i.issues.map(s=>X(s,o,W())))}:{success:true,data:i.value}},_r=Le(tn),wr=e=>(t,n,r)=>{const o=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return st(e)(t,n,o)},yr=e=>(t,n,r)=>st(e)(t,n,r),kr=e=>async(t,n,r)=>{const o=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return at(e)(t,n,o)},Cr=e=>async(t,n,r)=>at(e)(t,n,r),xr=e=>(t,n,r)=>{const o=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return Me(e)(t,n,o)},zr=e=>(t,n,r)=>Me(e)(t,n,r),Sr=e=>async(t,n,r)=>{const o=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return Le(e)(t,n,o)},$r=e=>async(t,n,r)=>Le(e)(t,n,r),Ir=/^[cC][^\s-]{8,}$/,Er=/^[0-9a-z]+$/,Tr=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,Ar=/^[0-9a-vA-V]{20}$/,Nr=/^[A-Za-z0-9]{27}$/,Or=/^[a-zA-Z0-9_-]{21}$/,Rr=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,Zr=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,bt=e=>e?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,Pr=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,Mr="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function Lr(){return new RegExp(Mr,"u")}const Dr=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Fr=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,jr=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,Vr=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Ur=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,nn=/^[A-Za-z0-9_-]*$/,Br=/^\+[1-9]\d{6,14}$/,rn="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",Gr=new RegExp(`^${rn}$`);function on(e){const t="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof e.precision=="number"?e.precision===-1?`${t}`:e.precision===0?`${t}:[0-5]\\d`:`${t}:[0-5]\\d\\.\\d{${e.precision}}`:`${t}(?::[0-5]\\d(?:\\.\\d+)?)?`}function Hr(e){return new RegExp(`^${on(e)}$`)}function Jr(e){const t=on({precision:e.precision}),n=["Z"];e.local&&n.push(""),e.offset&&n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");const r=`${t}(?:${n.join("|")})`;return new RegExp(`^${rn}T(?:${r})$`)}const qr=e=>{const t=e?`[\\s\\S]{${e?.minimum??0},${e?.maximum??""}}`:"[\\s\\S]*";return new RegExp(`^${t}$`)},Kr=/^-?\d+$/,Wr=/^-?\d+(?:\.\d+)?$/,Xr=/^(?:true|false)$/i,Yr=/^[^A-Z]*$/,Qr=/^[^a-z]*$/,T=l("$ZodCheck",(e,t)=>{var n;e._zod??(e._zod={}),e._zod.def=t,(n=e._zod).onattach??(n.onattach=[]);}),sn={number:"number",bigint:"bigint",object:"date"},an=l("$ZodCheckLessThan",(e,t)=>{T.init(e,t);const n=sn[typeof t.value];e._zod.onattach.push(r=>{const o=r._zod.bag,i=(t.inclusive?o.maximum:o.exclusiveMaximum)??Number.POSITIVE_INFINITY;t.value<i&&(t.inclusive?o.maximum=t.value:o.exclusiveMaximum=t.value);}),e._zod.check=r=>{(t.inclusive?r.value<=t.value:r.value<t.value)||r.issues.push({origin:n,code:"too_big",maximum:typeof t.value=="object"?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort});};}),cn=l("$ZodCheckGreaterThan",(e,t)=>{T.init(e,t);const n=sn[typeof t.value];e._zod.onattach.push(r=>{const o=r._zod.bag,i=(t.inclusive?o.minimum:o.exclusiveMinimum)??Number.NEGATIVE_INFINITY;t.value>i&&(t.inclusive?o.minimum=t.value:o.exclusiveMinimum=t.value);}),e._zod.check=r=>{(t.inclusive?r.value>=t.value:r.value>t.value)||r.issues.push({origin:n,code:"too_small",minimum:typeof t.value=="object"?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort});};}),eo=l("$ZodCheckMultipleOf",(e,t)=>{T.init(e,t),e._zod.onattach.push(n=>{var r;(r=n._zod.bag).multipleOf??(r.multipleOf=t.value);}),e._zod.check=n=>{if(typeof n.value!=typeof t.value)throw new Error("Cannot mix number and bigint in multiple_of check.");(typeof n.value=="bigint"?n.value%t.value===BigInt(0):rr(n.value,t.value)===0)||n.issues.push({origin:typeof n.value,code:"not_multiple_of",divisor:t.value,input:n.value,inst:e,continue:!t.abort});};}),to=l("$ZodCheckNumberFormat",(e,t)=>{T.init(e,t),t.format=t.format||"float64";const n=t.format?.includes("int"),r=n?"int":"number",[o,i]=cr[t.format];e._zod.onattach.push(s=>{const a=s._zod.bag;a.format=t.format,a.minimum=o,a.maximum=i,n&&(a.pattern=Kr);}),e._zod.check=s=>{const a=s.value;if(n){if(!Number.isInteger(a)){s.issues.push({expected:r,format:t.format,code:"invalid_type",continue:false,input:a,inst:e});return}if(!Number.isSafeInteger(a)){a>0?s.issues.push({input:a,code:"too_big",maximum:Number.MAX_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:e,origin:r,inclusive:true,continue:!t.abort}):s.issues.push({input:a,code:"too_small",minimum:Number.MIN_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:e,origin:r,inclusive:true,continue:!t.abort});return}}a<o&&s.issues.push({origin:"number",input:a,code:"too_small",minimum:o,inclusive:true,inst:e,continue:!t.abort}),a>i&&s.issues.push({origin:"number",input:a,code:"too_big",maximum:i,inclusive:true,inst:e,continue:!t.abort});};}),no=l("$ZodCheckMaxLength",(e,t)=>{var n;T.init(e,t),(n=e._zod.def).when??(n.when=r=>{const o=r.value;return !rt(o)&&o.length!==void 0}),e._zod.onattach.push(r=>{const o=r._zod.bag.maximum??Number.POSITIVE_INFINITY;t.maximum<o&&(r._zod.bag.maximum=t.maximum);}),e._zod.check=r=>{const o=r.value;if(o.length<=t.maximum)return;const s=it(o);r.issues.push({origin:s,code:"too_big",maximum:t.maximum,inclusive:true,input:o,inst:e,continue:!t.abort});};}),ro=l("$ZodCheckMinLength",(e,t)=>{var n;T.init(e,t),(n=e._zod.def).when??(n.when=r=>{const o=r.value;return !rt(o)&&o.length!==void 0}),e._zod.onattach.push(r=>{const o=r._zod.bag.minimum??Number.NEGATIVE_INFINITY;t.minimum>o&&(r._zod.bag.minimum=t.minimum);}),e._zod.check=r=>{const o=r.value;if(o.length>=t.minimum)return;const s=it(o);r.issues.push({origin:s,code:"too_small",minimum:t.minimum,inclusive:true,input:o,inst:e,continue:!t.abort});};}),oo=l("$ZodCheckLengthEquals",(e,t)=>{var n;T.init(e,t),(n=e._zod.def).when??(n.when=r=>{const o=r.value;return !rt(o)&&o.length!==void 0}),e._zod.onattach.push(r=>{const o=r._zod.bag;o.minimum=t.length,o.maximum=t.length,o.length=t.length;}),e._zod.check=r=>{const o=r.value,i=o.length;if(i===t.length)return;const s=it(o),a=i>t.length;r.issues.push({origin:s,...a?{code:"too_big",maximum:t.length}:{code:"too_small",minimum:t.length},inclusive:true,exact:true,input:r.value,inst:e,continue:!t.abort});};}),De=l("$ZodCheckStringFormat",(e,t)=>{var n,r;T.init(e,t),e._zod.onattach.push(o=>{const i=o._zod.bag;i.format=t.format,t.pattern&&(i.patterns??(i.patterns=new Set),i.patterns.add(t.pattern));}),t.pattern?(n=e._zod).check??(n.check=o=>{t.pattern.lastIndex=0,!t.pattern.test(o.value)&&o.issues.push({origin:"string",code:"invalid_format",format:t.format,input:o.value,...t.pattern?{pattern:t.pattern.toString()}:{},inst:e,continue:!t.abort});}):(r=e._zod).check??(r.check=()=>{});}),io=l("$ZodCheckRegex",(e,t)=>{De.init(e,t),e._zod.check=n=>{t.pattern.lastIndex=0,!t.pattern.test(n.value)&&n.issues.push({origin:"string",code:"invalid_format",format:"regex",input:n.value,pattern:t.pattern.toString(),inst:e,continue:!t.abort});};}),so=l("$ZodCheckLowerCase",(e,t)=>{t.pattern??(t.pattern=Yr),De.init(e,t);}),ao=l("$ZodCheckUpperCase",(e,t)=>{t.pattern??(t.pattern=Qr),De.init(e,t);}),co=l("$ZodCheckIncludes",(e,t)=>{T.init(e,t);const n=Pe(t.includes),r=new RegExp(typeof t.position=="number"?`^.{${t.position}}${n}`:n);t.pattern=r,e._zod.onattach.push(o=>{const i=o._zod.bag;i.patterns??(i.patterns=new Set),i.patterns.add(r);}),e._zod.check=o=>{o.value.includes(t.includes,t.position)||o.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:t.includes,input:o.value,inst:e,continue:!t.abort});};}),uo=l("$ZodCheckStartsWith",(e,t)=>{T.init(e,t);const n=new RegExp(`^${Pe(t.prefix)}.*`);t.pattern??(t.pattern=n),e._zod.onattach.push(r=>{const o=r._zod.bag;o.patterns??(o.patterns=new Set),o.patterns.add(n);}),e._zod.check=r=>{r.value.startsWith(t.prefix)||r.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:t.prefix,input:r.value,inst:e,continue:!t.abort});};}),lo=l("$ZodCheckEndsWith",(e,t)=>{T.init(e,t);const n=new RegExp(`.*${Pe(t.suffix)}$`);t.pattern??(t.pattern=n),e._zod.onattach.push(r=>{const o=r._zod.bag;o.patterns??(o.patterns=new Set),o.patterns.add(n);}),e._zod.check=r=>{r.value.endsWith(t.suffix)||r.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:t.suffix,input:r.value,inst:e,continue:!t.abort});};}),fo=l("$ZodCheckOverwrite",(e,t)=>{T.init(e,t),e._zod.check=n=>{n.value=t.tx(n.value);};});class po{constructor(t=[]){this.content=[],this.indent=0,this&&(this.args=t);}indented(t){this.indent+=1,t(this),this.indent-=1;}write(t){if(typeof t=="function"){t(this,{execution:"sync"}),t(this,{execution:"async"});return}const r=t.split(`
`).filter(s=>s),o=Math.min(...r.map(s=>s.length-s.trimStart().length)),i=r.map(s=>s.slice(o)).map(s=>" ".repeat(this.indent*2)+s);for(const s of i)this.content.push(s);}compile(){const t=Function,n=this?.args,o=[...(this?.content??[""]).map(i=>`  ${i}`)];return new t(...n,o.join(`
`))}}const ho={major:4,minor:3,patch:6},x=l("$ZodType",(e,t)=>{var n;e??(e={}),e._zod.def=t,e._zod.bag=e._zod.bag||{},e._zod.version=ho;const r=[...e._zod.def.checks??[]];e._zod.traits.has("$ZodCheck")&&r.unshift(e);for(const o of r)for(const i of o._zod.onattach)i(e);if(r.length===0)(n=e._zod).deferred??(n.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse;});else {const o=(s,a,c)=>{let u=re(s),d;for(const f of a){if(f._zod.def.when){if(!f._zod.def.when(s))continue}else if(u)continue;const p=s.issues.length,m=f._zod.check(s);if(m instanceof Promise&&c?.async===false)throw new se;if(d||m instanceof Promise)d=(d??Promise.resolve()).then(async()=>{await m,s.issues.length!==p&&(u||(u=re(s,p)));});else {if(s.issues.length===p)continue;u||(u=re(s,p));}}return d?d.then(()=>s):s},i=(s,a,c)=>{if(re(s))return s.aborted=true,s;const u=o(a,r,c);if(u instanceof Promise){if(c.async===false)throw new se;return u.then(d=>e._zod.parse(d,c))}return e._zod.parse(u,c)};e._zod.run=(s,a)=>{if(a.skipChecks)return e._zod.parse(s,a);if(a.direction==="backward"){const u=e._zod.parse({value:s.value,issues:[]},{...a,skipChecks:true});return u instanceof Promise?u.then(d=>i(d,s,a)):i(u,s,a)}const c=e._zod.parse(s,a);if(c instanceof Promise){if(a.async===false)throw new se;return c.then(u=>o(u,r,a))}return o(c,r,a)};}v(e,"~standard",()=>({validate:o=>{try{const i=vr(e,o);return i.success?{value:i.data}:{issues:i.error?.issues}}catch{return _r(e,o).then(s=>s.success?{value:s.data}:{issues:s.error?.issues})}},vendor:"zod",version:1}));}),ct=l("$ZodString",(e,t)=>{x.init(e,t),e._zod.pattern=[...e?._zod.bag?.patterns??[]].pop()??qr(e._zod.bag),e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=String(n.value);}catch{}return typeof n.value=="string"||n.issues.push({expected:"string",code:"invalid_type",input:n.value,inst:e}),n};}),y=l("$ZodStringFormat",(e,t)=>{De.init(e,t),ct.init(e,t);}),mo=l("$ZodGUID",(e,t)=>{t.pattern??(t.pattern=Zr),y.init(e,t);}),go=l("$ZodUUID",(e,t)=>{if(t.version){const r={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[t.version];if(r===void 0)throw new Error(`Invalid UUID version: "${t.version}"`);t.pattern??(t.pattern=bt(r));}else t.pattern??(t.pattern=bt());y.init(e,t);}),bo=l("$ZodEmail",(e,t)=>{t.pattern??(t.pattern=Pr),y.init(e,t);}),vo=l("$ZodURL",(e,t)=>{y.init(e,t),e._zod.check=n=>{try{const r=n.value.trim(),o=new URL(r);t.hostname&&(t.hostname.lastIndex=0,t.hostname.test(o.hostname)||n.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:t.hostname.source,input:n.value,inst:e,continue:!t.abort})),t.protocol&&(t.protocol.lastIndex=0,t.protocol.test(o.protocol.endsWith(":")?o.protocol.slice(0,-1):o.protocol)||n.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:t.protocol.source,input:n.value,inst:e,continue:!t.abort})),t.normalize?n.value=o.href:n.value=r;return}catch{n.issues.push({code:"invalid_format",format:"url",input:n.value,inst:e,continue:!t.abort});}};}),_o=l("$ZodEmoji",(e,t)=>{t.pattern??(t.pattern=Lr()),y.init(e,t);}),wo=l("$ZodNanoID",(e,t)=>{t.pattern??(t.pattern=Or),y.init(e,t);}),yo=l("$ZodCUID",(e,t)=>{t.pattern??(t.pattern=Ir),y.init(e,t);}),ko=l("$ZodCUID2",(e,t)=>{t.pattern??(t.pattern=Er),y.init(e,t);}),Co=l("$ZodULID",(e,t)=>{t.pattern??(t.pattern=Tr),y.init(e,t);}),xo=l("$ZodXID",(e,t)=>{t.pattern??(t.pattern=Ar),y.init(e,t);}),zo=l("$ZodKSUID",(e,t)=>{t.pattern??(t.pattern=Nr),y.init(e,t);}),So=l("$ZodISODateTime",(e,t)=>{t.pattern??(t.pattern=Jr(t)),y.init(e,t);}),$o=l("$ZodISODate",(e,t)=>{t.pattern??(t.pattern=Gr),y.init(e,t);}),Io=l("$ZodISOTime",(e,t)=>{t.pattern??(t.pattern=Hr(t)),y.init(e,t);}),Eo=l("$ZodISODuration",(e,t)=>{t.pattern??(t.pattern=Rr),y.init(e,t);}),To=l("$ZodIPv4",(e,t)=>{t.pattern??(t.pattern=Dr),y.init(e,t),e._zod.bag.format="ipv4";}),Ao=l("$ZodIPv6",(e,t)=>{t.pattern??(t.pattern=Fr),y.init(e,t),e._zod.bag.format="ipv6",e._zod.check=n=>{try{new URL(`http://[${n.value}]`);}catch{n.issues.push({code:"invalid_format",format:"ipv6",input:n.value,inst:e,continue:!t.abort});}};}),No=l("$ZodCIDRv4",(e,t)=>{t.pattern??(t.pattern=jr),y.init(e,t);}),Oo=l("$ZodCIDRv6",(e,t)=>{t.pattern??(t.pattern=Vr),y.init(e,t),e._zod.check=n=>{const r=n.value.split("/");try{if(r.length!==2)throw new Error;const[o,i]=r;if(!i)throw new Error;const s=Number(i);if(`${s}`!==i)throw new Error;if(s<0||s>128)throw new Error;new URL(`http://[${o}]`);}catch{n.issues.push({code:"invalid_format",format:"cidrv6",input:n.value,inst:e,continue:!t.abort});}};});function un(e){if(e==="")return  true;if(e.length%4!==0)return  false;try{return atob(e),!0}catch{return  false}}const Ro=l("$ZodBase64",(e,t)=>{t.pattern??(t.pattern=Ur),y.init(e,t),e._zod.bag.contentEncoding="base64",e._zod.check=n=>{un(n.value)||n.issues.push({code:"invalid_format",format:"base64",input:n.value,inst:e,continue:!t.abort});};});function Zo(e){if(!nn.test(e))return  false;const t=e.replace(/[-_]/g,r=>r==="-"?"+":"/"),n=t.padEnd(Math.ceil(t.length/4)*4,"=");return un(n)}const Po=l("$ZodBase64URL",(e,t)=>{t.pattern??(t.pattern=nn),y.init(e,t),e._zod.bag.contentEncoding="base64url",e._zod.check=n=>{Zo(n.value)||n.issues.push({code:"invalid_format",format:"base64url",input:n.value,inst:e,continue:!t.abort});};}),Mo=l("$ZodE164",(e,t)=>{t.pattern??(t.pattern=Br),y.init(e,t);});function Lo(e,t=null){try{const n=e.split(".");if(n.length!==3)return !1;const[r]=n;if(!r)return !1;const o=JSON.parse(atob(r));return !("typ"in o&&o?.typ!=="JWT"||!o.alg||t&&(!("alg"in o)||o.alg!==t))}catch{return  false}}const Do=l("$ZodJWT",(e,t)=>{y.init(e,t),e._zod.check=n=>{Lo(n.value,t.alg)||n.issues.push({code:"invalid_format",format:"jwt",input:n.value,inst:e,continue:!t.abort});};}),ln=l("$ZodNumber",(e,t)=>{x.init(e,t),e._zod.pattern=e._zod.bag.pattern??Wr,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=Number(n.value);}catch{}const o=n.value;if(typeof o=="number"&&!Number.isNaN(o)&&Number.isFinite(o))return n;const i=typeof o=="number"?Number.isNaN(o)?"NaN":Number.isFinite(o)?void 0:"Infinity":void 0;return n.issues.push({expected:"number",code:"invalid_type",input:o,inst:e,...i?{received:i}:{}}),n};}),Fo=l("$ZodNumberFormat",(e,t)=>{to.init(e,t),ln.init(e,t);}),jo=l("$ZodBoolean",(e,t)=>{x.init(e,t),e._zod.pattern=Xr,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=!!n.value;}catch{}const o=n.value;return typeof o=="boolean"||n.issues.push({expected:"boolean",code:"invalid_type",input:o,inst:e}),n};}),Vo=l("$ZodUnknown",(e,t)=>{x.init(e,t),e._zod.parse=n=>n;}),Uo=l("$ZodNever",(e,t)=>{x.init(e,t),e._zod.parse=(n,r)=>(n.issues.push({expected:"never",code:"invalid_type",input:n.value,inst:e}),n);});function vt(e,t,n){e.issues.length&&t.issues.push(...Yt(n,e.issues)),t.value[n]=e.value;}const Bo=l("$ZodArray",(e,t)=>{x.init(e,t),e._zod.parse=(n,r)=>{const o=n.value;if(!Array.isArray(o))return n.issues.push({expected:"array",code:"invalid_type",input:o,inst:e}),n;n.value=Array(o.length);const i=[];for(let s=0;s<o.length;s++){const a=o[s],c=t.element._zod.run({value:a,issues:[]},r);c instanceof Promise?i.push(c.then(u=>vt(u,n,s))):vt(c,n,s);}return i.length?Promise.all(i).then(()=>n):n};});function Ae(e,t,n,r,o){if(e.issues.length){if(o&&!(n in r))return;t.issues.push(...Yt(n,e.issues));}e.value===void 0?n in r&&(t.value[n]=void 0):t.value[n]=e.value;}function dn(e){const t=Object.keys(e.shape);for(const r of t)if(!e.shape?.[r]?._zod?.traits?.has("$ZodType"))throw new Error(`Invalid element at key "${r}": expected a Zod schema`);const n=ar(e.shape);return {...e,keys:t,keySet:new Set(t),numKeys:t.length,optionalKeys:new Set(n)}}function fn(e,t,n,r,o,i){const s=[],a=o.keySet,c=o.catchall._zod,u=c.def.type,d=c.optout==="optional";for(const f in t){if(a.has(f))continue;if(u==="never"){s.push(f);continue}const p=c.run({value:t[f],issues:[]},r);p instanceof Promise?e.push(p.then(m=>Ae(m,n,f,t,d))):Ae(p,n,f,t,d);}return s.length&&n.issues.push({code:"unrecognized_keys",keys:s,input:t,inst:i}),e.length?Promise.all(e).then(()=>n):n}const Go=l("$ZodObject",(e,t)=>{if(x.init(e,t),!Object.getOwnPropertyDescriptor(t,"shape")?.get){const a=t.shape;Object.defineProperty(t,"shape",{get:()=>{const c={...a};return Object.defineProperty(t,"shape",{value:c}),c}});}const r=nt(()=>dn(t));v(e._zod,"propValues",()=>{const a=t.shape,c={};for(const u in a){const d=a[u]._zod;if(d.values){c[u]??(c[u]=new Set);for(const f of d.values)c[u].add(f);}}return c});const o=Te,i=t.catchall;let s;e._zod.parse=(a,c)=>{s??(s=r.value);const u=a.value;if(!o(u))return a.issues.push({expected:"object",code:"invalid_type",input:u,inst:e}),a;a.value={};const d=[],f=s.shape;for(const p of s.keys){const m=f[p],b=m._zod.optout==="optional",_=m._zod.run({value:u[p],issues:[]},c);_ instanceof Promise?d.push(_.then(L=>Ae(L,a,p,u,b))):Ae(_,a,p,u,b);}return i?fn(d,u,a,c,r.value,e):d.length?Promise.all(d).then(()=>a):a};}),Ho=l("$ZodObjectJIT",(e,t)=>{Go.init(e,t);const n=e._zod.parse,r=nt(()=>dn(t)),o=p=>{const m=new po(["shape","payload","ctx"]),b=r.value,_=g=>{const C=gt(g);return `shape[${C}]._zod.run({ value: input[${C}], issues: [] }, ctx)`};m.write("const input = payload.value;");const L=Object.create(null);let G=0;for(const g of b.keys)L[g]=`key_${G++}`;m.write("const newResult = {};");for(const g of b.keys){const C=L[g],A=gt(g),Jn=p[g]?._zod?.optout==="optional";m.write(`const ${C} = ${_(g)};`),Jn?m.write(`
        if (${C}.issues.length) {
          if (${A} in input) {
            payload.issues = payload.issues.concat(${C}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${A}, ...iss.path] : [${A}]
            })));
          }
        }
        
        if (${C}.value === undefined) {
          if (${A} in input) {
            newResult[${A}] = undefined;
          }
        } else {
          newResult[${A}] = ${C}.value;
        }
        
      `):m.write(`
        if (${C}.issues.length) {
          payload.issues = payload.issues.concat(${C}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${A}, ...iss.path] : [${A}]
          })));
        }
        
        if (${C}.value === undefined) {
          if (${A} in input) {
            newResult[${A}] = undefined;
          }
        } else {
          newResult[${A}] = ${C}.value;
        }
        
      `);}m.write("payload.value = newResult;"),m.write("return payload;");const D=m.compile();return (g,C)=>D(p,g,C)};let i;const s=Te,a=!qt.jitless,u=a&&ir.value,d=t.catchall;let f;e._zod.parse=(p,m)=>{f??(f=r.value);const b=p.value;return s(b)?a&&u&&m?.async===false&&m.jitless!==true?(i||(i=o(t.shape)),p=i(p,m),d?fn([],b,p,m,f,e):p):n(p,m):(p.issues.push({expected:"object",code:"invalid_type",input:b,inst:e}),p)};});function _t(e,t,n,r){for(const i of e)if(i.issues.length===0)return t.value=i.value,t;const o=e.filter(i=>!re(i));return o.length===1?(t.value=o[0].value,o[0]):(t.issues.push({code:"invalid_union",input:t.value,inst:n,errors:e.map(i=>i.issues.map(s=>X(s,r,W())))}),t)}const Jo=l("$ZodUnion",(e,t)=>{x.init(e,t),v(e._zod,"optin",()=>t.options.some(o=>o._zod.optin==="optional")?"optional":void 0),v(e._zod,"optout",()=>t.options.some(o=>o._zod.optout==="optional")?"optional":void 0),v(e._zod,"values",()=>{if(t.options.every(o=>o._zod.values))return new Set(t.options.flatMap(o=>Array.from(o._zod.values)))}),v(e._zod,"pattern",()=>{if(t.options.every(o=>o._zod.pattern)){const o=t.options.map(i=>i._zod.pattern);return new RegExp(`^(${o.map(i=>ot(i.source)).join("|")})$`)}});const n=t.options.length===1,r=t.options[0]._zod.run;e._zod.parse=(o,i)=>{if(n)return r(o,i);let s=false;const a=[];for(const c of t.options){const u=c._zod.run({value:o.value,issues:[]},i);if(u instanceof Promise)a.push(u),s=true;else {if(u.issues.length===0)return u;a.push(u);}}return s?Promise.all(a).then(c=>_t(c,o,e,i)):_t(a,o,e,i)};}),qo=l("$ZodIntersection",(e,t)=>{x.init(e,t),e._zod.parse=(n,r)=>{const o=n.value,i=t.left._zod.run({value:o,issues:[]},r),s=t.right._zod.run({value:o,issues:[]},r);return i instanceof Promise||s instanceof Promise?Promise.all([i,s]).then(([c,u])=>wt(n,c,u)):wt(n,i,s)};});function Xe(e,t){if(e===t)return {valid:true,data:e};if(e instanceof Date&&t instanceof Date&&+e==+t)return {valid:true,data:e};if(me(e)&&me(t)){const n=Object.keys(t),r=Object.keys(e).filter(i=>n.indexOf(i)!==-1),o={...e,...t};for(const i of r){const s=Xe(e[i],t[i]);if(!s.valid)return {valid:false,mergeErrorPath:[i,...s.mergeErrorPath]};o[i]=s.data;}return {valid:true,data:o}}if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return {valid:false,mergeErrorPath:[]};const n=[];for(let r=0;r<e.length;r++){const o=e[r],i=t[r],s=Xe(o,i);if(!s.valid)return {valid:false,mergeErrorPath:[r,...s.mergeErrorPath]};n.push(s.data);}return {valid:true,data:n}}return {valid:false,mergeErrorPath:[]}}function wt(e,t,n){const r=new Map;let o;for(const a of t.issues)if(a.code==="unrecognized_keys"){o??(o=a);for(const c of a.keys)r.has(c)||r.set(c,{}),r.get(c).l=true;}else e.issues.push(a);for(const a of n.issues)if(a.code==="unrecognized_keys")for(const c of a.keys)r.has(c)||r.set(c,{}),r.get(c).r=true;else e.issues.push(a);const i=[...r].filter(([,a])=>a.l&&a.r).map(([a])=>a);if(i.length&&o&&e.issues.push({...o,keys:i}),re(e))return e;const s=Xe(t.value,n.value);if(!s.valid)throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(s.mergeErrorPath)}`);return e.value=s.data,e}const Ko=l("$ZodEnum",(e,t)=>{x.init(e,t);const n=Kt(t.entries),r=new Set(n);e._zod.values=r,e._zod.pattern=new RegExp(`^(${n.filter(o=>sr.has(typeof o)).map(o=>typeof o=="string"?Pe(o):o.toString()).join("|")})$`),e._zod.parse=(o,i)=>{const s=o.value;return r.has(s)||o.issues.push({code:"invalid_value",values:n,input:s,inst:e}),o};}),Wo=l("$ZodTransform",(e,t)=>{x.init(e,t),e._zod.parse=(n,r)=>{if(r.direction==="backward")throw new Jt(e.constructor.name);const o=t.transform(n.value,n);if(r.async)return (o instanceof Promise?o:Promise.resolve(o)).then(s=>(n.value=s,n));if(o instanceof Promise)throw new se;return n.value=o,n};});function yt(e,t){return e.issues.length&&t===void 0?{issues:[],value:void 0}:e}const pn=l("$ZodOptional",(e,t)=>{x.init(e,t),e._zod.optin="optional",e._zod.optout="optional",v(e._zod,"values",()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,void 0]):void 0),v(e._zod,"pattern",()=>{const n=t.innerType._zod.pattern;return n?new RegExp(`^(${ot(n.source)})?$`):void 0}),e._zod.parse=(n,r)=>{if(t.innerType._zod.optin==="optional"){const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(i=>yt(i,n.value)):yt(o,n.value)}return n.value===void 0?n:t.innerType._zod.run(n,r)};}),Xo=l("$ZodExactOptional",(e,t)=>{pn.init(e,t),v(e._zod,"values",()=>t.innerType._zod.values),v(e._zod,"pattern",()=>t.innerType._zod.pattern),e._zod.parse=(n,r)=>t.innerType._zod.run(n,r);}),Yo=l("$ZodNullable",(e,t)=>{x.init(e,t),v(e._zod,"optin",()=>t.innerType._zod.optin),v(e._zod,"optout",()=>t.innerType._zod.optout),v(e._zod,"pattern",()=>{const n=t.innerType._zod.pattern;return n?new RegExp(`^(${ot(n.source)}|null)$`):void 0}),v(e._zod,"values",()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,null]):void 0),e._zod.parse=(n,r)=>n.value===null?n:t.innerType._zod.run(n,r);}),Qo=l("$ZodDefault",(e,t)=>{x.init(e,t),e._zod.optin="optional",v(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(n,r)=>{if(r.direction==="backward")return t.innerType._zod.run(n,r);if(n.value===void 0)return n.value=t.defaultValue,n;const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(i=>kt(i,t)):kt(o,t)};});function kt(e,t){return e.value===void 0&&(e.value=t.defaultValue),e}const ei=l("$ZodPrefault",(e,t)=>{x.init(e,t),e._zod.optin="optional",v(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(n,r)=>(r.direction==="backward"||n.value===void 0&&(n.value=t.defaultValue),t.innerType._zod.run(n,r));}),ti=l("$ZodNonOptional",(e,t)=>{x.init(e,t),v(e._zod,"values",()=>{const n=t.innerType._zod.values;return n?new Set([...n].filter(r=>r!==void 0)):void 0}),e._zod.parse=(n,r)=>{const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(i=>Ct(i,e)):Ct(o,e)};});function Ct(e,t){return !e.issues.length&&e.value===void 0&&e.issues.push({code:"invalid_type",expected:"nonoptional",input:e.value,inst:t}),e}const ni=l("$ZodCatch",(e,t)=>{x.init(e,t),v(e._zod,"optin",()=>t.innerType._zod.optin),v(e._zod,"optout",()=>t.innerType._zod.optout),v(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(n,r)=>{if(r.direction==="backward")return t.innerType._zod.run(n,r);const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(i=>(n.value=i.value,i.issues.length&&(n.value=t.catchValue({...n,error:{issues:i.issues.map(s=>X(s,r,W()))},input:n.value}),n.issues=[]),n)):(n.value=o.value,o.issues.length&&(n.value=t.catchValue({...n,error:{issues:o.issues.map(i=>X(i,r,W()))},input:n.value}),n.issues=[]),n)};}),ri=l("$ZodPipe",(e,t)=>{x.init(e,t),v(e._zod,"values",()=>t.in._zod.values),v(e._zod,"optin",()=>t.in._zod.optin),v(e._zod,"optout",()=>t.out._zod.optout),v(e._zod,"propValues",()=>t.in._zod.propValues),e._zod.parse=(n,r)=>{if(r.direction==="backward"){const i=t.out._zod.run(n,r);return i instanceof Promise?i.then(s=>_e(s,t.in,r)):_e(i,t.in,r)}const o=t.in._zod.run(n,r);return o instanceof Promise?o.then(i=>_e(i,t.out,r)):_e(o,t.out,r)};});function _e(e,t,n){return e.issues.length?(e.aborted=true,e):t._zod.run({value:e.value,issues:e.issues},n)}const oi=l("$ZodReadonly",(e,t)=>{x.init(e,t),v(e._zod,"propValues",()=>t.innerType._zod.propValues),v(e._zod,"values",()=>t.innerType._zod.values),v(e._zod,"optin",()=>t.innerType?._zod?.optin),v(e._zod,"optout",()=>t.innerType?._zod?.optout),e._zod.parse=(n,r)=>{if(r.direction==="backward")return t.innerType._zod.run(n,r);const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(xt):xt(o)};});function xt(e){return e.value=Object.freeze(e.value),e}const ii=l("$ZodCustom",(e,t)=>{T.init(e,t),x.init(e,t),e._zod.parse=(n,r)=>n,e._zod.check=n=>{const r=n.value,o=t.fn(r);if(o instanceof Promise)return o.then(i=>zt(i,n,r,e));zt(o,n,r,e);};});function zt(e,t,n,r){if(!e){const o={code:"custom",input:n,inst:r,path:[...r._zod.def.path??[]],continue:!r._zod.def.abort};r._zod.def.params&&(o.params=r._zod.def.params),t.issues.push(ge(o));}}var St;class si{constructor(){this._map=new WeakMap,this._idmap=new Map;}add(t,...n){const r=n[0];return this._map.set(t,r),r&&typeof r=="object"&&"id"in r&&this._idmap.set(r.id,t),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(t){const n=this._map.get(t);return n&&typeof n=="object"&&"id"in n&&this._idmap.delete(n.id),this._map.delete(t),this}get(t){const n=t._zod.parent;if(n){const r={...this.get(n)??{}};delete r.id;const o={...r,...this._map.get(t)};return Object.keys(o).length?o:void 0}return this._map.get(t)}has(t){return this._map.has(t)}}function ai(){return new si}(St=globalThis).__zod_globalRegistry??(St.__zod_globalRegistry=ai());const pe=globalThis.__zod_globalRegistry;function ci(e,t){return new e({type:"string",...h(t)})}function ui(e,t){return new e({type:"string",format:"email",check:"string_format",abort:false,...h(t)})}function $t(e,t){return new e({type:"string",format:"guid",check:"string_format",abort:false,...h(t)})}function li(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:false,...h(t)})}function di(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:false,version:"v4",...h(t)})}function fi(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:false,version:"v6",...h(t)})}function pi(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:false,version:"v7",...h(t)})}function hi(e,t){return new e({type:"string",format:"url",check:"string_format",abort:false,...h(t)})}function mi(e,t){return new e({type:"string",format:"emoji",check:"string_format",abort:false,...h(t)})}function gi(e,t){return new e({type:"string",format:"nanoid",check:"string_format",abort:false,...h(t)})}function bi(e,t){return new e({type:"string",format:"cuid",check:"string_format",abort:false,...h(t)})}function vi(e,t){return new e({type:"string",format:"cuid2",check:"string_format",abort:false,...h(t)})}function _i(e,t){return new e({type:"string",format:"ulid",check:"string_format",abort:false,...h(t)})}function wi(e,t){return new e({type:"string",format:"xid",check:"string_format",abort:false,...h(t)})}function yi(e,t){return new e({type:"string",format:"ksuid",check:"string_format",abort:false,...h(t)})}function ki(e,t){return new e({type:"string",format:"ipv4",check:"string_format",abort:false,...h(t)})}function Ci(e,t){return new e({type:"string",format:"ipv6",check:"string_format",abort:false,...h(t)})}function xi(e,t){return new e({type:"string",format:"cidrv4",check:"string_format",abort:false,...h(t)})}function zi(e,t){return new e({type:"string",format:"cidrv6",check:"string_format",abort:false,...h(t)})}function Si(e,t){return new e({type:"string",format:"base64",check:"string_format",abort:false,...h(t)})}function $i(e,t){return new e({type:"string",format:"base64url",check:"string_format",abort:false,...h(t)})}function Ii(e,t){return new e({type:"string",format:"e164",check:"string_format",abort:false,...h(t)})}function Ei(e,t){return new e({type:"string",format:"jwt",check:"string_format",abort:false,...h(t)})}function Ti(e,t){return new e({type:"string",format:"datetime",check:"string_format",offset:false,local:false,precision:null,...h(t)})}function Ai(e,t){return new e({type:"string",format:"date",check:"string_format",...h(t)})}function Ni(e,t){return new e({type:"string",format:"time",check:"string_format",precision:null,...h(t)})}function Oi(e,t){return new e({type:"string",format:"duration",check:"string_format",...h(t)})}function Ri(e,t){return new e({type:"number",checks:[],...h(t)})}function Zi(e,t){return new e({type:"number",check:"number_format",abort:false,format:"safeint",...h(t)})}function Pi(e,t){return new e({type:"boolean",...h(t)})}function Mi(e){return new e({type:"unknown"})}function Li(e,t){return new e({type:"never",...h(t)})}function It(e,t){return new an({check:"less_than",...h(t),value:e,inclusive:false})}function Ge(e,t){return new an({check:"less_than",...h(t),value:e,inclusive:true})}function Et(e,t){return new cn({check:"greater_than",...h(t),value:e,inclusive:false})}function He(e,t){return new cn({check:"greater_than",...h(t),value:e,inclusive:true})}function Tt(e,t){return new eo({check:"multiple_of",...h(t),value:e})}function hn(e,t){return new no({check:"max_length",...h(t),maximum:e})}function Ne(e,t){return new ro({check:"min_length",...h(t),minimum:e})}function mn(e,t){return new oo({check:"length_equals",...h(t),length:e})}function Di(e,t){return new io({check:"string_format",format:"regex",...h(t),pattern:e})}function Fi(e){return new so({check:"string_format",format:"lowercase",...h(e)})}function ji(e){return new ao({check:"string_format",format:"uppercase",...h(e)})}function Vi(e,t){return new co({check:"string_format",format:"includes",...h(t),includes:e})}function Ui(e,t){return new uo({check:"string_format",format:"starts_with",...h(t),prefix:e})}function Bi(e,t){return new lo({check:"string_format",format:"ends_with",...h(t),suffix:e})}function ue(e){return new fo({check:"overwrite",tx:e})}function Gi(e){return ue(t=>t.normalize(e))}function Hi(){return ue(e=>e.trim())}function Ji(){return ue(e=>e.toLowerCase())}function qi(){return ue(e=>e.toUpperCase())}function Ki(){return ue(e=>or(e))}function Wi(e,t,n){return new e({type:"array",element:t,...h(n)})}function Xi(e,t,n){return new e({type:"custom",check:"custom",fn:t,...h(n)})}function Yi(e){const t=Qi(n=>(n.addIssue=r=>{if(typeof r=="string")n.issues.push(ge(r,n.value,t._zod.def));else {const o=r;o.fatal&&(o.continue=false),o.code??(o.code="custom"),o.input??(o.input=n.value),o.inst??(o.inst=t),o.continue??(o.continue=!t._zod.def.abort),n.issues.push(ge(o));}},e(n.value,n)));return t}function Qi(e,t){const n=new T({check:"custom",...h(t)});return n._zod.check=e,n}function gn(e){let t=e?.target??"draft-2020-12";return t==="draft-4"&&(t="draft-04"),t==="draft-7"&&(t="draft-07"),{processors:e.processors??{},metadataRegistry:e?.metadata??pe,target:t,unrepresentable:e?.unrepresentable??"throw",override:e?.override??(()=>{}),io:e?.io??"output",counter:0,seen:new Map,cycles:e?.cycles??"ref",reused:e?.reused??"inline",external:e?.external??void 0}}function I(e,t,n={path:[],schemaPath:[]}){var r;const o=e._zod.def,i=t.seen.get(e);if(i)return i.count++,n.schemaPath.includes(e)&&(i.cycle=n.path),i.schema;const s={schema:{},count:1,cycle:void 0,path:n.path};t.seen.set(e,s);const a=e._zod.toJSONSchema?.();if(a)s.schema=a;else {const d={...n,schemaPath:[...n.schemaPath,e],path:n.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(t,s.schema,d);else {const p=s.schema,m=t.processors[o.type];if(!m)throw new Error(`[toJSONSchema]: Non-representable type encountered: ${o.type}`);m(e,t,p,d);}const f=e._zod.parent;f&&(s.ref||(s.ref=f),I(f,t,d),t.seen.get(f).isParent=true);}const c=t.metadataRegistry.get(e);return c&&Object.assign(s.schema,c),t.io==="input"&&E(e)&&(delete s.schema.examples,delete s.schema.default),t.io==="input"&&s.schema._prefault&&((r=s.schema).default??(r.default=s.schema._prefault)),delete s.schema._prefault,t.seen.get(e).schema}function bn(e,t){const n=e.seen.get(t);if(!n)throw new Error("Unprocessed schema. This is a bug in Zod.");const r=new Map;for(const s of e.seen.entries()){const a=e.metadataRegistry.get(s[0])?.id;if(a){const c=r.get(a);if(c&&c!==s[0])throw new Error(`Duplicate schema id "${a}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);r.set(a,s[0]);}}const o=s=>{const a=e.target==="draft-2020-12"?"$defs":"definitions";if(e.external){const f=e.external.registry.get(s[0])?.id,p=e.external.uri??(b=>b);if(f)return {ref:p(f)};const m=s[1].defId??s[1].schema.id??`schema${e.counter++}`;return s[1].defId=m,{defId:m,ref:`${p("__shared")}#/${a}/${m}`}}if(s[1]===n)return {ref:"#"};const u=`#/${a}/`,d=s[1].schema.id??`__schema${e.counter++}`;return {defId:d,ref:u+d}},i=s=>{if(s[1].schema.$ref)return;const a=s[1],{ref:c,defId:u}=o(s);a.def={...a.schema},u&&(a.defId=u);const d=a.schema;for(const f in d)delete d[f];d.$ref=c;};if(e.cycles==="throw")for(const s of e.seen.entries()){const a=s[1];if(a.cycle)throw new Error(`Cycle detected: #/${a.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(const s of e.seen.entries()){const a=s[1];if(t===s[0]){i(s);continue}if(e.external){const u=e.external.registry.get(s[0])?.id;if(t!==s[0]&&u){i(s);continue}}if(e.metadataRegistry.get(s[0])?.id){i(s);continue}if(a.cycle){i(s);continue}if(a.count>1&&e.reused==="ref"){i(s);continue}}}function vn(e,t){const n=e.seen.get(t);if(!n)throw new Error("Unprocessed schema. This is a bug in Zod.");const r=s=>{const a=e.seen.get(s);if(a.ref===null)return;const c=a.def??a.schema,u={...c},d=a.ref;if(a.ref=null,d){r(d);const p=e.seen.get(d),m=p.schema;if(m.$ref&&(e.target==="draft-07"||e.target==="draft-04"||e.target==="openapi-3.0")?(c.allOf=c.allOf??[],c.allOf.push(m)):Object.assign(c,m),Object.assign(c,u),s._zod.parent===d)for(const _ in c)_==="$ref"||_==="allOf"||_ in u||delete c[_];if(m.$ref&&p.def)for(const _ in c)_==="$ref"||_==="allOf"||_ in p.def&&JSON.stringify(c[_])===JSON.stringify(p.def[_])&&delete c[_];}const f=s._zod.parent;if(f&&f!==d){r(f);const p=e.seen.get(f);if(p?.schema.$ref&&(c.$ref=p.schema.$ref,p.def))for(const m in c)m==="$ref"||m==="allOf"||m in p.def&&JSON.stringify(c[m])===JSON.stringify(p.def[m])&&delete c[m];}e.override({zodSchema:s,jsonSchema:c,path:a.path??[]});};for(const s of [...e.seen.entries()].reverse())r(s[0]);const o={};if(e.target==="draft-2020-12"?o.$schema="https://json-schema.org/draft/2020-12/schema":e.target==="draft-07"?o.$schema="http://json-schema.org/draft-07/schema#":e.target==="draft-04"?o.$schema="http://json-schema.org/draft-04/schema#":e.target,e.external?.uri){const s=e.external.registry.get(t)?.id;if(!s)throw new Error("Schema is missing an `id` property");o.$id=e.external.uri(s);}Object.assign(o,n.def??n.schema);const i=e.external?.defs??{};for(const s of e.seen.entries()){const a=s[1];a.def&&a.defId&&(i[a.defId]=a.def);}e.external||Object.keys(i).length>0&&(e.target==="draft-2020-12"?o.$defs=i:o.definitions=i);try{const s=JSON.parse(JSON.stringify(o));return Object.defineProperty(s,"~standard",{value:{...t["~standard"],jsonSchema:{input:Oe(t,"input",e.processors),output:Oe(t,"output",e.processors)}},enumerable:!1,writable:!1}),s}catch{throw new Error("Error converting schema to JSON.")}}function E(e,t){const n=t??{seen:new Set};if(n.seen.has(e))return  false;n.seen.add(e);const r=e._zod.def;if(r.type==="transform")return  true;if(r.type==="array")return E(r.element,n);if(r.type==="set")return E(r.valueType,n);if(r.type==="lazy")return E(r.getter(),n);if(r.type==="promise"||r.type==="optional"||r.type==="nonoptional"||r.type==="nullable"||r.type==="readonly"||r.type==="default"||r.type==="prefault")return E(r.innerType,n);if(r.type==="intersection")return E(r.left,n)||E(r.right,n);if(r.type==="record"||r.type==="map")return E(r.keyType,n)||E(r.valueType,n);if(r.type==="pipe")return E(r.in,n)||E(r.out,n);if(r.type==="object"){for(const o in r.shape)if(E(r.shape[o],n))return  true;return  false}if(r.type==="union"){for(const o of r.options)if(E(o,n))return  true;return  false}if(r.type==="tuple"){for(const o of r.items)if(E(o,n))return  true;return !!(r.rest&&E(r.rest,n))}return  false}const es=(e,t={})=>n=>{const r=gn({...n,processors:t});return I(e,r),bn(r,e),vn(r,e)},Oe=(e,t,n={})=>r=>{const{libraryOptions:o,target:i}=r??{},s=gn({...o??{},target:i,io:t,processors:n});return I(e,s),bn(s,e),vn(s,e)},ts={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},ns=(e,t,n,r)=>{const o=n;o.type="string";const{minimum:i,maximum:s,format:a,patterns:c,contentEncoding:u}=e._zod.bag;if(typeof i=="number"&&(o.minLength=i),typeof s=="number"&&(o.maxLength=s),a&&(o.format=ts[a]??a,o.format===""&&delete o.format,a==="time"&&delete o.format),u&&(o.contentEncoding=u),c&&c.size>0){const d=[...c];d.length===1?o.pattern=d[0].source:d.length>1&&(o.allOf=[...d.map(f=>({...t.target==="draft-07"||t.target==="draft-04"||t.target==="openapi-3.0"?{type:"string"}:{},pattern:f.source}))]);}},rs=(e,t,n,r)=>{const o=n,{minimum:i,maximum:s,format:a,multipleOf:c,exclusiveMaximum:u,exclusiveMinimum:d}=e._zod.bag;typeof a=="string"&&a.includes("int")?o.type="integer":o.type="number",typeof d=="number"&&(t.target==="draft-04"||t.target==="openapi-3.0"?(o.minimum=d,o.exclusiveMinimum=true):o.exclusiveMinimum=d),typeof i=="number"&&(o.minimum=i,typeof d=="number"&&t.target!=="draft-04"&&(d>=i?delete o.minimum:delete o.exclusiveMinimum)),typeof u=="number"&&(t.target==="draft-04"||t.target==="openapi-3.0"?(o.maximum=u,o.exclusiveMaximum=true):o.exclusiveMaximum=u),typeof s=="number"&&(o.maximum=s,typeof u=="number"&&t.target!=="draft-04"&&(u<=s?delete o.maximum:delete o.exclusiveMaximum)),typeof c=="number"&&(o.multipleOf=c);},os=(e,t,n,r)=>{n.type="boolean";},is=(e,t,n,r)=>{n.not={};},ss=(e,t,n,r)=>{},as=(e,t,n,r)=>{const o=e._zod.def,i=Kt(o.entries);i.every(s=>typeof s=="number")&&(n.type="number"),i.every(s=>typeof s=="string")&&(n.type="string"),n.enum=i;},cs=(e,t,n,r)=>{if(t.unrepresentable==="throw")throw new Error("Custom types cannot be represented in JSON Schema")},us=(e,t,n,r)=>{if(t.unrepresentable==="throw")throw new Error("Transforms cannot be represented in JSON Schema")},ls=(e,t,n,r)=>{const o=n,i=e._zod.def,{minimum:s,maximum:a}=e._zod.bag;typeof s=="number"&&(o.minItems=s),typeof a=="number"&&(o.maxItems=a),o.type="array",o.items=I(i.element,t,{...r,path:[...r.path,"items"]});},ds=(e,t,n,r)=>{const o=n,i=e._zod.def;o.type="object",o.properties={};const s=i.shape;for(const u in s)o.properties[u]=I(s[u],t,{...r,path:[...r.path,"properties",u]});const a=new Set(Object.keys(s)),c=new Set([...a].filter(u=>{const d=i.shape[u]._zod;return t.io==="input"?d.optin===void 0:d.optout===void 0}));c.size>0&&(o.required=Array.from(c)),i.catchall?._zod.def.type==="never"?o.additionalProperties=false:i.catchall?i.catchall&&(o.additionalProperties=I(i.catchall,t,{...r,path:[...r.path,"additionalProperties"]})):t.io==="output"&&(o.additionalProperties=false);},fs=(e,t,n,r)=>{const o=e._zod.def,i=o.inclusive===false,s=o.options.map((a,c)=>I(a,t,{...r,path:[...r.path,i?"oneOf":"anyOf",c]}));i?n.oneOf=s:n.anyOf=s;},ps=(e,t,n,r)=>{const o=e._zod.def,i=I(o.left,t,{...r,path:[...r.path,"allOf",0]}),s=I(o.right,t,{...r,path:[...r.path,"allOf",1]}),a=u=>"allOf"in u&&Object.keys(u).length===1,c=[...a(i)?i.allOf:[i],...a(s)?s.allOf:[s]];n.allOf=c;},hs=(e,t,n,r)=>{const o=e._zod.def,i=I(o.innerType,t,r),s=t.seen.get(e);t.target==="openapi-3.0"?(s.ref=o.innerType,n.nullable=true):n.anyOf=[i,{type:"null"}];},ms=(e,t,n,r)=>{const o=e._zod.def;I(o.innerType,t,r);const i=t.seen.get(e);i.ref=o.innerType;},gs=(e,t,n,r)=>{const o=e._zod.def;I(o.innerType,t,r);const i=t.seen.get(e);i.ref=o.innerType,n.default=JSON.parse(JSON.stringify(o.defaultValue));},bs=(e,t,n,r)=>{const o=e._zod.def;I(o.innerType,t,r);const i=t.seen.get(e);i.ref=o.innerType,t.io==="input"&&(n._prefault=JSON.parse(JSON.stringify(o.defaultValue)));},vs=(e,t,n,r)=>{const o=e._zod.def;I(o.innerType,t,r);const i=t.seen.get(e);i.ref=o.innerType;let s;try{s=o.catchValue(void 0);}catch{throw new Error("Dynamic catch values are not supported in JSON Schema")}n.default=s;},_s=(e,t,n,r)=>{const o=e._zod.def,i=t.io==="input"?o.in._zod.def.type==="transform"?o.out:o.in:o.out;I(i,t,r);const s=t.seen.get(e);s.ref=i;},ws=(e,t,n,r)=>{const o=e._zod.def;I(o.innerType,t,r);const i=t.seen.get(e);i.ref=o.innerType,n.readOnly=true;},_n=(e,t,n,r)=>{const o=e._zod.def;I(o.innerType,t,r);const i=t.seen.get(e);i.ref=o.innerType;},ys=l("ZodISODateTime",(e,t)=>{So.init(e,t),k.init(e,t);});function ks(e){return Ti(ys,e)}const Cs=l("ZodISODate",(e,t)=>{$o.init(e,t),k.init(e,t);});function xs(e){return Ai(Cs,e)}const zs=l("ZodISOTime",(e,t)=>{Io.init(e,t),k.init(e,t);});function Ss(e){return Ni(zs,e)}const $s=l("ZodISODuration",(e,t)=>{Eo.init(e,t),k.init(e,t);});function Is(e){return Oi($s,e)}const Es=(e,t)=>{en.init(e,t),e.name="ZodError",Object.defineProperties(e,{format:{value:n=>br(e,n)},flatten:{value:n=>gr(e,n)},addIssue:{value:n=>{e.issues.push(n),e.message=JSON.stringify(e.issues,We,2);}},addIssues:{value:n=>{e.issues.push(...n),e.message=JSON.stringify(e.issues,We,2);}},isEmpty:{get(){return e.issues.length===0}}});},O=l("ZodError",Es,{Parent:Error}),Ts=st(O),As=at(O),Ns=Me(O),Os=Le(O),Rs=wr(O),Zs=yr(O),Ps=kr(O),Ms=Cr(O),Ls=xr(O),Ds=zr(O),Fs=Sr(O),js=$r(O),z=l("ZodType",(e,t)=>(x.init(e,t),Object.assign(e["~standard"],{jsonSchema:{input:Oe(e,"input"),output:Oe(e,"output")}}),e.toJSONSchema=es(e,{}),e.def=t,e.type=t.type,Object.defineProperty(e,"_def",{value:t}),e.check=(...n)=>e.clone(J(t,{checks:[...t.checks??[],...n.map(r=>typeof r=="function"?{_zod:{check:r,def:{check:"custom"},onattach:[]}}:r)]}),{parent:true}),e.with=e.check,e.clone=(n,r)=>q(e,n,r),e.brand=()=>e,e.register=((n,r)=>(n.add(e,r),e)),e.parse=(n,r)=>Ts(e,n,r,{callee:e.parse}),e.safeParse=(n,r)=>Ns(e,n,r),e.parseAsync=async(n,r)=>As(e,n,r,{callee:e.parseAsync}),e.safeParseAsync=async(n,r)=>Os(e,n,r),e.spa=e.safeParseAsync,e.encode=(n,r)=>Rs(e,n,r),e.decode=(n,r)=>Zs(e,n,r),e.encodeAsync=async(n,r)=>Ps(e,n,r),e.decodeAsync=async(n,r)=>Ms(e,n,r),e.safeEncode=(n,r)=>Ls(e,n,r),e.safeDecode=(n,r)=>Ds(e,n,r),e.safeEncodeAsync=async(n,r)=>Fs(e,n,r),e.safeDecodeAsync=async(n,r)=>js(e,n,r),e.refine=(n,r)=>e.check(Za(n,r)),e.superRefine=n=>e.check(Pa(n)),e.overwrite=n=>e.check(ue(n)),e.optional=()=>Rt(e),e.exactOptional=()=>ka(e),e.nullable=()=>Zt(e),e.nullish=()=>Rt(Zt(e)),e.nonoptional=n=>Ia(e,n),e.array=()=>pa(e),e.or=n=>ga([e,n]),e.and=n=>va(e,n),e.transform=n=>Pt(e,wa(n)),e.default=n=>za(e,n),e.prefault=n=>$a(e,n),e.catch=n=>Ta(e,n),e.pipe=n=>Pt(e,n),e.readonly=()=>Oa(e),e.describe=n=>{const r=e.clone();return pe.add(r,{description:n}),r},Object.defineProperty(e,"description",{get(){return pe.get(e)?.description},configurable:true}),e.meta=(...n)=>{if(n.length===0)return pe.get(e);const r=e.clone();return pe.add(r,n[0]),r},e.isOptional=()=>e.safeParse(void 0).success,e.isNullable=()=>e.safeParse(null).success,e.apply=n=>n(e),e)),wn=l("_ZodString",(e,t)=>{ct.init(e,t),z.init(e,t),e._zod.processJSONSchema=(r,o,i)=>ns(e,r,o);const n=e._zod.bag;e.format=n.format??null,e.minLength=n.minimum??null,e.maxLength=n.maximum??null,e.regex=(...r)=>e.check(Di(...r)),e.includes=(...r)=>e.check(Vi(...r)),e.startsWith=(...r)=>e.check(Ui(...r)),e.endsWith=(...r)=>e.check(Bi(...r)),e.min=(...r)=>e.check(Ne(...r)),e.max=(...r)=>e.check(hn(...r)),e.length=(...r)=>e.check(mn(...r)),e.nonempty=(...r)=>e.check(Ne(1,...r)),e.lowercase=r=>e.check(Fi(r)),e.uppercase=r=>e.check(ji(r)),e.trim=()=>e.check(Hi()),e.normalize=(...r)=>e.check(Gi(...r)),e.toLowerCase=()=>e.check(Ji()),e.toUpperCase=()=>e.check(qi()),e.slugify=()=>e.check(Ki());}),Vs=l("ZodString",(e,t)=>{ct.init(e,t),wn.init(e,t),e.email=n=>e.check(ui(Us,n)),e.url=n=>e.check(hi(Bs,n)),e.jwt=n=>e.check(Ei(ia,n)),e.emoji=n=>e.check(mi(Gs,n)),e.guid=n=>e.check($t(At,n)),e.uuid=n=>e.check(li(we,n)),e.uuidv4=n=>e.check(di(we,n)),e.uuidv6=n=>e.check(fi(we,n)),e.uuidv7=n=>e.check(pi(we,n)),e.nanoid=n=>e.check(gi(Hs,n)),e.guid=n=>e.check($t(At,n)),e.cuid=n=>e.check(bi(Js,n)),e.cuid2=n=>e.check(vi(qs,n)),e.ulid=n=>e.check(_i(Ks,n)),e.base64=n=>e.check(Si(na,n)),e.base64url=n=>e.check($i(ra,n)),e.xid=n=>e.check(wi(Ws,n)),e.ksuid=n=>e.check(yi(Xs,n)),e.ipv4=n=>e.check(ki(Ys,n)),e.ipv6=n=>e.check(Ci(Qs,n)),e.cidrv4=n=>e.check(xi(ea,n)),e.cidrv6=n=>e.check(zi(ta,n)),e.e164=n=>e.check(Ii(oa,n)),e.datetime=n=>e.check(ks(n)),e.date=n=>e.check(xs(n)),e.time=n=>e.check(Ss(n)),e.duration=n=>e.check(Is(n));});function j(e){return ci(Vs,e)}const k=l("ZodStringFormat",(e,t)=>{y.init(e,t),wn.init(e,t);}),Us=l("ZodEmail",(e,t)=>{bo.init(e,t),k.init(e,t);}),At=l("ZodGUID",(e,t)=>{mo.init(e,t),k.init(e,t);}),we=l("ZodUUID",(e,t)=>{go.init(e,t),k.init(e,t);}),Bs=l("ZodURL",(e,t)=>{vo.init(e,t),k.init(e,t);}),Gs=l("ZodEmoji",(e,t)=>{_o.init(e,t),k.init(e,t);}),Hs=l("ZodNanoID",(e,t)=>{wo.init(e,t),k.init(e,t);}),Js=l("ZodCUID",(e,t)=>{yo.init(e,t),k.init(e,t);}),qs=l("ZodCUID2",(e,t)=>{ko.init(e,t),k.init(e,t);}),Ks=l("ZodULID",(e,t)=>{Co.init(e,t),k.init(e,t);}),Ws=l("ZodXID",(e,t)=>{xo.init(e,t),k.init(e,t);}),Xs=l("ZodKSUID",(e,t)=>{zo.init(e,t),k.init(e,t);}),Ys=l("ZodIPv4",(e,t)=>{To.init(e,t),k.init(e,t);}),Qs=l("ZodIPv6",(e,t)=>{Ao.init(e,t),k.init(e,t);}),ea=l("ZodCIDRv4",(e,t)=>{No.init(e,t),k.init(e,t);}),ta=l("ZodCIDRv6",(e,t)=>{Oo.init(e,t),k.init(e,t);}),na=l("ZodBase64",(e,t)=>{Ro.init(e,t),k.init(e,t);}),ra=l("ZodBase64URL",(e,t)=>{Po.init(e,t),k.init(e,t);}),oa=l("ZodE164",(e,t)=>{Mo.init(e,t),k.init(e,t);}),ia=l("ZodJWT",(e,t)=>{Do.init(e,t),k.init(e,t);}),yn=l("ZodNumber",(e,t)=>{ln.init(e,t),z.init(e,t),e._zod.processJSONSchema=(r,o,i)=>rs(e,r,o),e.gt=(r,o)=>e.check(Et(r,o)),e.gte=(r,o)=>e.check(He(r,o)),e.min=(r,o)=>e.check(He(r,o)),e.lt=(r,o)=>e.check(It(r,o)),e.lte=(r,o)=>e.check(Ge(r,o)),e.max=(r,o)=>e.check(Ge(r,o)),e.int=r=>e.check(Nt(r)),e.safe=r=>e.check(Nt(r)),e.positive=r=>e.check(Et(0,r)),e.nonnegative=r=>e.check(He(0,r)),e.negative=r=>e.check(It(0,r)),e.nonpositive=r=>e.check(Ge(0,r)),e.multipleOf=(r,o)=>e.check(Tt(r,o)),e.step=(r,o)=>e.check(Tt(r,o)),e.finite=()=>e;const n=e._zod.bag;e.minValue=Math.max(n.minimum??Number.NEGATIVE_INFINITY,n.exclusiveMinimum??Number.NEGATIVE_INFINITY)??null,e.maxValue=Math.min(n.maximum??Number.POSITIVE_INFINITY,n.exclusiveMaximum??Number.POSITIVE_INFINITY)??null,e.isInt=(n.format??"").includes("int")||Number.isSafeInteger(n.multipleOf??.5),e.isFinite=true,e.format=n.format??null;});function he(e){return Ri(yn,e)}const sa=l("ZodNumberFormat",(e,t)=>{Fo.init(e,t),yn.init(e,t);});function Nt(e){return Zi(sa,e)}const aa=l("ZodBoolean",(e,t)=>{jo.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>os(e,n,r);});function ca(e){return Pi(aa,e)}const ua=l("ZodUnknown",(e,t)=>{Vo.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ss();});function Ot(){return Mi(ua)}const la=l("ZodNever",(e,t)=>{Uo.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>is(e,n,r);});function da(e){return Li(la,e)}const fa=l("ZodArray",(e,t)=>{Bo.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ls(e,n,r,o),e.element=t.element,e.min=(n,r)=>e.check(Ne(n,r)),e.nonempty=n=>e.check(Ne(1,n)),e.max=(n,r)=>e.check(hn(n,r)),e.length=(n,r)=>e.check(mn(n,r)),e.unwrap=()=>e.element;});function pa(e,t){return Wi(fa,e,t)}const ha=l("ZodObject",(e,t)=>{Ho.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ds(e,n,r,o),v(e,"shape",()=>t.shape),e.keyof=()=>Qe(Object.keys(e._zod.def.shape)),e.catchall=n=>e.clone({...e._zod.def,catchall:n}),e.passthrough=()=>e.clone({...e._zod.def,catchall:Ot()}),e.loose=()=>e.clone({...e._zod.def,catchall:Ot()}),e.strict=()=>e.clone({...e._zod.def,catchall:da()}),e.strip=()=>e.clone({...e._zod.def,catchall:void 0}),e.extend=n=>dr(e,n),e.safeExtend=n=>fr(e,n),e.merge=n=>pr(e,n),e.pick=n=>ur(e,n),e.omit=n=>lr(e,n),e.partial=(...n)=>hr(kn,e,n[0]),e.required=(...n)=>mr(Cn,e,n[0]);});function $e(e,t){const n={type:"object",shape:e??{},...h(t)};return new ha(n)}const ma=l("ZodUnion",(e,t)=>{Jo.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>fs(e,n,r,o),e.options=t.options;});function ga(e,t){return new ma({type:"union",options:e,...h(t)})}const ba=l("ZodIntersection",(e,t)=>{qo.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ps(e,n,r,o);});function va(e,t){return new ba({type:"intersection",left:e,right:t})}const Ye=l("ZodEnum",(e,t)=>{Ko.init(e,t),z.init(e,t),e._zod.processJSONSchema=(r,o,i)=>as(e,r,o),e.enum=t.entries,e.options=Object.values(t.entries);const n=new Set(Object.keys(t.entries));e.extract=(r,o)=>{const i={};for(const s of r)if(n.has(s))i[s]=t.entries[s];else throw new Error(`Key ${s} not found in enum`);return new Ye({...t,checks:[],...h(o),entries:i})},e.exclude=(r,o)=>{const i={...t.entries};for(const s of r)if(n.has(s))delete i[s];else throw new Error(`Key ${s} not found in enum`);return new Ye({...t,checks:[],...h(o),entries:i})};});function Qe(e,t){const n=Array.isArray(e)?Object.fromEntries(e.map(r=>[r,r])):e;return new Ye({type:"enum",entries:n,...h(t)})}const _a=l("ZodTransform",(e,t)=>{Wo.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>us(e,n),e._zod.parse=(n,r)=>{if(r.direction==="backward")throw new Jt(e.constructor.name);n.addIssue=i=>{if(typeof i=="string")n.issues.push(ge(i,n.value,t));else {const s=i;s.fatal&&(s.continue=false),s.code??(s.code="custom"),s.input??(s.input=n.value),s.inst??(s.inst=e),n.issues.push(ge(s));}};const o=t.transform(n.value,n);return o instanceof Promise?o.then(i=>(n.value=i,n)):(n.value=o,n)};});function wa(e){return new _a({type:"transform",transform:e})}const kn=l("ZodOptional",(e,t)=>{pn.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>_n(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function Rt(e){return new kn({type:"optional",innerType:e})}const ya=l("ZodExactOptional",(e,t)=>{Xo.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>_n(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function ka(e){return new ya({type:"optional",innerType:e})}const Ca=l("ZodNullable",(e,t)=>{Yo.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>hs(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function Zt(e){return new Ca({type:"nullable",innerType:e})}const xa=l("ZodDefault",(e,t)=>{Qo.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>gs(e,n,r,o),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap;});function za(e,t){return new xa({type:"default",innerType:e,get defaultValue(){return typeof t=="function"?t():Xt(t)}})}const Sa=l("ZodPrefault",(e,t)=>{ei.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>bs(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function $a(e,t){return new Sa({type:"prefault",innerType:e,get defaultValue(){return typeof t=="function"?t():Xt(t)}})}const Cn=l("ZodNonOptional",(e,t)=>{ti.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ms(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function Ia(e,t){return new Cn({type:"nonoptional",innerType:e,...h(t)})}const Ea=l("ZodCatch",(e,t)=>{ni.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>vs(e,n,r,o),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap;});function Ta(e,t){return new Ea({type:"catch",innerType:e,catchValue:typeof t=="function"?t:()=>t})}const Aa=l("ZodPipe",(e,t)=>{ri.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>_s(e,n,r,o),e.in=t.in,e.out=t.out;});function Pt(e,t){return new Aa({type:"pipe",in:e,out:t})}const Na=l("ZodReadonly",(e,t)=>{oi.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ws(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function Oa(e){return new Na({type:"readonly",innerType:e})}const Ra=l("ZodCustom",(e,t)=>{ii.init(e,t),z.init(e,t),e._zod.processJSONSchema=(n,r,o)=>cs(e,n);});function Za(e,t={}){return Xi(Ra,e,t)}function Pa(e){return Yi(e)}const ae=M("dAnimeCfRanking:Settings"),xn=$e({enabled:ca(),cacheTtlHours:he().min(Gt).max(Ht)});$e({title:j(),canonicalQuery:j(),representativeVideoId:j().nullable(),representativeVideo:$e({videoId:j(),title:j(),postedAt:j(),uploaderType:Qe(["danime","official","unknown"]),uploaderName:j()}).nullable(),metrics:$e({viewCount:he(),mylistCount:he(),commentCount:he(),likeCount:he()}).nullable(),fetchedAt:j(),status:Qe(["ok","failed","pending"]),failureReason:j().nullable()});const zn="dAnimeCfRanking_settings";let R=null;const Sn=[];function Ma(){try{const e=GM_getValue(zn,null);if(e===null)return R={...Be},R;const t=xn.safeParse(e);return t.success?(R=t.data,R):(ae.warn("Invalid settings found, using defaults",{error:t.error}),R={...Be},R)}catch(e){return ae.error("Failed to load settings",e),R={...Be},R}}function $n(e){try{const t=xn.parse(e);GM_setValue(zn,t),R=t;for(const n of Sn)try{n(t);}catch(r){ae.error("Settings change callback error",r);}ae.info("Settings saved",{settings:t});}catch(t){ae.error("Failed to save settings",t);}}function Fe(){return R===null?Ma():R}function La(e){Sn.push(e);}function Da(){const e=Fe();$n({...e,enabled:!e.enabled});}function Fa(){return Fe().cacheTtlHours*60*60*1e3}function ja(){const e=Fe();GM_registerMenuCommand(e.enabled?"🔵 ランキング表示: ON":"⚪ ランキング表示: OFF",()=>{Da(),window.location.reload();}),ae.info("Menu commands registered",{enabled:e.enabled});}const N=M("dAnimeCfRanking:CacheManager");let oe=null;async function In(){return oe||new Promise((e,t)=>{const n=indexedDB.open(tr,nr);n.onerror=()=>{N.error("Failed to open IndexedDB",n.error),t(n.error);},n.onsuccess=()=>{oe=n.result,N.info("IndexedDB initialized"),e(oe);},n.onupgradeneeded=r=>{const o=r.target.result;o.objectStoreNames.contains(Z)&&o.deleteObjectStore(Z);const i=o.createObjectStore(Z,{keyPath:"title"});i.createIndex("status","status",{unique:false}),i.createIndex("fetchedAt","fetchedAt",{unique:false}),N.info("IndexedDB store created");};})}async function je(){return oe||In()}async function Va(e){try{const t=await je();return new Promise((n,r)=>{const s=t.transaction(Z,"readonly").objectStore(Z).get(e);s.onerror=()=>{N.error("Failed to get cache entry",s.error),r(s.error);},s.onsuccess=()=>{n(s.result);};})}catch(t){return N.error("getCacheEntry failed",t),null}}async function de(e){try{const t=await je();return new Promise((n,r)=>{const s=t.transaction(Z,"readwrite").objectStore(Z).put(e);s.onerror=()=>{N.error("Failed to set cache entry",s.error),r(s.error);},s.onsuccess=()=>{N.debug("Cache entry saved",{title:e.title,status:e.status}),n();};})}catch(t){N.error("setCacheEntry failed",t);}}async function Ua(){try{const e=await je();return new Promise((t,n)=>{const i=e.transaction(Z,"readonly").objectStore(Z).getAll();i.onerror=()=>{N.error("Failed to get all cache entries",i.error),n(i.error);},i.onsuccess=()=>{t(i.result);};})}catch(e){return N.error("getAllCacheEntries failed",e),[]}}async function Ba(){try{const e=await je();return new Promise((t,n)=>{const i=e.transaction(Z,"readwrite").objectStore(Z).clear();i.onerror=()=>{N.error("Failed to clear cache",i.error),n(i.error);},i.onsuccess=()=>{N.info("Cache cleared"),t();};})}catch(e){N.error("clearCache failed",e);}}function En(e){if(!e||e.status==="pending")return  false;const t=new Date(e.fetchedAt).getTime();if(isNaN(t))return  false;const r=Date.now()-t,o=Fa();return r<o}function Ga(e,t){return {title:e,canonicalQuery:t,representativeVideoId:null,representativeVideo:null,metrics:null,fetchedAt:new Date().toISOString(),status:"pending",failureReason:null}}function Ha(e,t){return {...e,...t,fetchedAt:new Date().toISOString(),status:"ok",failureReason:null}}function Je(e,t){return {...e,fetchedAt:new Date().toISOString(),status:"failed",failureReason:t}}var Ja="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",qa="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",Ka="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",Wa="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",Xa="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z",Ya="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",et="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z",Tn="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z";function B(e,t=24){const n=String(t),r=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}const K=M("dAnimeCfRanking:ControlPanel"),Qa=`
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
`;function ec(e,t){const n=document.createElement("div");n.className="cf-ranking-control-panel-host";const r=n.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=Qa,r.appendChild(o);const i=document.createElement("div");i.className="cf-ranking-panel",i.innerHTML=tc(e),r.appendChild(i);const s=i.querySelector(".toggle-switch"),a=i.querySelector(".panel-body"),c=i.querySelector(".ttl-slider"),u=i.querySelector(".ttl-value"),d=i.querySelectorAll(".ttl-preset-btn"),f=i.querySelector(".refresh-btn"),p=i.querySelector(".ranking-list-btn"),m=i.querySelector(".progress-text");let b={...e};s?.addEventListener("click",()=>{b.enabled=!b.enabled,_(),L(),t.onSettingsChange(b);}),c?.addEventListener("input",()=>{const g=parseInt(c.value,10);b.cacheTtlHours=g,G(),D();}),c?.addEventListener("change",()=>{t.onSettingsChange(b);}),d.forEach(g=>{g.addEventListener("click",()=>{const C=parseInt(g.dataset.hours??"24",10);b.cacheTtlHours=C,c&&(c.value=String(C)),G(),D(),t.onSettingsChange(b);});}),f?.addEventListener("click",()=>{t.onRefreshTrigger();}),p?.addEventListener("click",()=>{t.onOpenRankingList();});function _(){b.enabled?s?.classList.add("active"):s?.classList.remove("active");}function L(){b.enabled?a?.classList.remove("disabled"):a?.classList.add("disabled");}function G(){u&&(u.textContent=An(b.cacheTtlHours));}function D(){d.forEach(g=>{parseInt(g.dataset.hours??"0",10)===b.cacheTtlHours?g.classList.add("active"):g.classList.remove("active");});}return _(),L(),G(),D(),K.info("Control panel created",{settings:b}),{element:n,updateSettings(g){b={...g},c&&(c.value=String(g.cacheTtlHours)),_(),L(),G(),D();},updateProgress(g,C){if(m)if(C>0){const A=Math.round(g/C*100);m.textContent=`${g} / ${C} 作品取得済み (${A}%)`;}else m.textContent="";},setRefreshing(g){f&&(f.disabled=g,g?(f.classList.add("refreshing"),f.innerHTML=`${B(et,16)} 取得中...`):(f.classList.remove("refreshing"),f.innerHTML=`${B(et,16)} 全作品を再取得`));}}}function tc(e){const t=e.enabled?"active":"",n=e.enabled?"":"disabled",r=Kn.map(o=>`<button class="ttl-preset-btn ${o.hours===e.cacheTtlHours?"active":""}" data-hours="${o.hours}">${o.label}</button>`).join("");return `
    <div class="panel-header">
      <div class="panel-title">
        ${B(Wa,18)}
        <span>ニコニコランキング設定</span>
      </div>
      <div class="toggle-container">
        <span class="toggle-label">表示</span>
        <div class="toggle-switch ${t}" role="switch" aria-checked="${e.enabled}">
        </div>
      </div>
    </div>
    <div class="panel-body ${n}">
      <div class="control-section">
        <div class="section-title">キャッシュ有効期限 (TTL)</div>
        <div class="ttl-container">
          <div class="ttl-slider-row">
            <input type="range" class="ttl-slider" 
                   min="${Gt}" max="${Ht}" 
                   value="${e.cacheTtlHours}" step="1">
            <div class="ttl-value">${An(e.cacheTtlHours)}</div>
          </div>
          <div class="ttl-presets">
            ${r}
          </div>
        </div>
      </div>
      <div class="control-section">
        <div class="section-title">データ更新</div>
        <div class="action-container">
          <button class="action-btn refresh-btn">
            ${B(et,16)}
            全作品を再取得
          </button>
          <button class="action-btn ranking-list-btn">
            ${B(Xa,16)}
            詳細ランキング
          </button>
          <div class="progress-text"></div>
        </div>
      </div>
    </div>
  `}function An(e){if(e<24)return `${e}時間`;if(e<168){const t=Math.floor(e/24),n=e%24;return n===0?`${t}日`:`${t}日${n}時間`}else return `${Math.floor(e/168)}週間`}function nc(){if(window.location.pathname.includes("shinban-")){const r=document.querySelector('.contentsWrapper > div[style*="max-width"]');if(r)return K.info("Found insertion point (shinban page): banner container"),{target:r,position:"afterend"}}const t=document.getElementById("kokuchi_txt");if(t)return K.info("Found insertion point (CF page): #kokuchi_txt"),{target:t,position:"afterend"};const n=document.querySelector(".contentsWrapper");return n?(K.info("Found insertion point (fallback): .contentsWrapper"),{target:n,position:"afterbegin"}):(K.warn("No insertion point found"),null)}function rc(e){const t=nc();return t?(t.target.insertAdjacentElement(t.position,e.element),K.info("Control panel inserted into page"),true):(K.error("Failed to find insertion point for control panel"),false)}const Q=M("dAnimeCfRanking:CardDetector"),Ve=[".itemModule.list[data-workid]",".itemModule.list"],oc=[".newTVtitle span",".textContainer h2 span"],ic=".check input[data-workid]",sc=".circleProgress",ac=".check",Nn="data-cf-ranking-badge",Mt="cf-ranking-badge";function ut(e){if(e.offsetParent===null){const n=window.getComputedStyle(e);if(n.display==="none")return  false;if(n.position==="fixed")return  true;let r=e.parentElement;for(;r;){if(window.getComputedStyle(r).display==="none")return  false;r=r.parentElement;}}const t=window.getComputedStyle(e);return !(t.display==="none"||t.visibility==="hidden")}function cc(){const e=new Set;for(const i of Ve)document.querySelectorAll(i).forEach(a=>e.add(a));const t=[],n=new Set,r=new Set;let o=0;return e.forEach(i=>{if(!ut(i)){o++;return}const s=Re(i);s&&!n.has(s.title)&&!r.has(s.workId)&&(t.push(s),n.add(s.title),r.add(s.workId));}),Q.debug("Cards detected",{total:e.size,visible:t.length,hidden:o}),t}function uc(e){for(const t of oc){const r=e.querySelector(t)?.textContent?.trim();if(r)return r}return null}function On(e){const t=e.dataset.workid;if(t)return t;const n=e.querySelector(ic);return n?.dataset.workid?n.dataset.workid:null}function Re(e){const t=On(e);if(!t)return null;const n=uc(e);if(!n)return Q.warn("Card has no title",{workId:t}),null;const r=lc(e);return {workId:t,title:n,element:e,insertionPoint:r}}function lc(e){const t=e.querySelector(sc),n=e.querySelector(ac);return t&&n?n:t&&t.nextElementSibling?t.nextElementSibling:n||(Q.warn("Insertion point not found",{workId:On(e),hasCircleProgress:!!t,hasCheck:!!n}),null)}function Ze(e){return e.hasAttribute(Nn)}function dc(e){e.setAttribute(Nn,"true");}function fc(e){return e.filter(t=>!Ze(t.element))}function Rn(e){return e instanceof HTMLElement?!!(e.classList.contains(Mt)||e.closest(`.${Mt}`)):false}function pc(e){return Ve.some(t=>e.matches(t))}function hc(e){const t=[];for(const n of Ve){const r=Array.from(e.querySelectorAll(n));t.push(...r);}return [...new Set(t)]}function mc(e){return new MutationObserver(n=>{const r=[],o=new Set;for(const i of n){if(i.type!=="childList")continue;const s=Array.from(i.addedNodes);for(const a of s){if(!(a instanceof HTMLElement)||Rn(a))continue;if(pc(a)){const u=Re(a);u&&!Ze(a)&&!o.has(u.workId)&&(r.push(u),o.add(u.workId));}hc(a).forEach(u=>{if(!Ze(u)){const d=Re(u);d&&!o.has(d.workId)&&(r.push(d),o.add(d.workId));}});}}r.length>0&&(Q.debug("New cards detected by observer",{count:r.length}),e(r));})}function gc(e,t=document.body){e.observe(t,{childList:true,subtree:true}),Q.info("Card observer started");}function bc(){const e=new Set;for(const t of Ve)document.querySelectorAll(t).forEach(r=>e.add(r));return [...e]}function vc(e,t){let n=null;const r=new Set,o=()=>{const a=[];for(const c of r)if(e.has(c)&&ut(c)){const u=Re(c);u&&!Ze(c)&&(a.push(u),e.delete(c));}r.clear(),a.length>0&&(Q.debug("Cards became visible",{count:a.length}),t(a));},i=a=>{for(const c of e)(a.contains(c)||c.contains(a)||a===c)&&r.add(c);n!==null&&clearTimeout(n),n=setTimeout(()=>{n=null,o();},100);};return new MutationObserver(a=>{for(const c of a)if(c.type==="attributes"){const u=c.target;if(Rn(u))continue;i(u);}})}function _c(e,t=document.body){e.observe(t,{attributes:true,attributeFilter:["style","class"],subtree:true}),Q.info("Visibility observer started");}const Lt=M("dAnimeCfRanking:TitleNormalizer"),wc={I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7,VIII:8,IX:9,X:10,XI:11,XII:12,XIII:13,XIV:14,XV:15,XVI:16,XVII:17,XVIII:18,XIX:19,XX:20},Zn=[{pattern:/[Ss]eason\s*0?(\d+)/,extractor:e=>parseInt(e[1],10)},{pattern:/(\d+)(?:st|nd|rd|th)\s*[Ss]eason/,extractor:e=>parseInt(e[1],10)},{pattern:/第0?(\d+)期/,extractor:e=>parseInt(e[1],10)},{pattern:new RegExp("(?<![第\\d])(\\d+)期(?![間])"),extractor:e=>parseInt(e[1],10)},{pattern:/[Pp]art\s*0?(\d+)/,extractor:e=>parseInt(e[1],10)},{pattern:/第0?(\d+)シリーズ/,extractor:e=>parseInt(e[1],10)},{pattern:/(\d+)(?:st|nd|rd|th)\s*シーズン/,extractor:e=>parseInt(e[1],10)},{pattern:/シーズン\s*0?(\d+)/,extractor:e=>parseInt(e[1],10)}],Pn=/(?:^|\s)(X{0,2}(?:IX|IV|V?I{0,3}))(?:\s|$|期|シーズン)/,yc=[/続編/,/完結編/,/後編/,/前編/,/劇場版/,/OVA/,/OAD/,/特別編/,/番外編/];function kc(e){for(const{pattern:n,extractor:r}of Zn){const o=e.match(n);if(o){const i=r(o);if(i!==null&&i>0&&i<=20)return i}}const t=e.match(Pn);if(t&&t[1]){const n=t[1].toUpperCase(),r=wc[n];if(r!==void 0)return r}return null}function Cc(e){const t=e.trim();for(const i of yc)if(i.test(t))return Lt.debug("Skipping normalization (special pattern)",{title:e,pattern:i.source}),t;const n=kc(t);if(n===null||new RegExp(`第0?${n}期`).test(t))return t;let r=t;for(const{pattern:i}of Zn)r=r.replace(i,"").trim();r=r.replace(Pn," ").trim(),r=r.replace(/\s+/g," ").trim(),r=r.replace(/[-\s]+$/,"").trim();const o=`${r} 第${n}期`;return Lt.debug("Title normalized",{original:e,normalized:o,seasonNumber:n}),o}const Mn="https://www.nicovideo.jp",xc=`${Mn}/search`,zc=`${Mn}/watch`,Sc=e=>`${zc}/${e}`,$c=e=>`${xc}/${encodeURIComponent(e)}`;var Ic=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const Ec=e=>new Promise((t,n)=>{Ic({url:e.url,method:e.method??"GET",headers:e.headers,data:e.data,responseType:e.responseType??"text",timeout:e.timeout,onprogress:e.onprogress,onload:r=>{t({status:r.status,statusText:r.statusText,response:r.response,finalUrl:r.finalUrl,headers:r.responseHeaders});},onerror:r=>{const o=r?.error??"unknown error";n(new Error(`GM_xmlhttpRequest failed: ${o}`));},ontimeout:()=>{n(new Error("GM_xmlhttpRequest timeout"));}});}),V=M("dAnimeCfRanking:NicoApiClient"),Tc="dアニメストア ニコニコ支店";class ce{searchCache=new Map;async search(t){if(!t.trim())return [];if(this.searchCache.has(t))return this.searchCache.get(t)??[];try{const n=$c(t),r=await this.fetchText(n),o=this.parseServerResponse(r),i=this.deduplicateItems(o);return this.searchCache.set(t,i),V.debug("Search completed",{keyword:t,resultCount:i.length}),i}catch(n){return V.error("Search failed",n,{keyword:t}),[]}}async fetchMetrics(t){try{const n=Sc(t),r=await this.fetchText(n),o=this.parseWatchPageMetrics(r);return o?(V.debug("Metrics fetched",{videoId:t,metrics:o}),o):(V.warn("Failed to parse metrics from watch page",{videoId:t}),null)}catch(n){return V.error("Failed to fetch metrics",n,{videoId:t}),null}}static determineUploaderType(t,n){return t===Tc?"danime":t===n||t.startsWith(n+" ")?"official":"unknown"}static filterOfficialVideos(t,n){return t.filter(r=>{const o=ce.determineUploaderType(r.ownerName,n);return o==="danime"||o==="official"})}static toRepresentativeVideo(t,n){return {videoId:t.videoId,title:t.title,postedAt:t.postedAt,uploaderType:ce.determineUploaderType(t.ownerName,n),uploaderName:t.ownerName}}async fetchText(t){return (await Ec({method:"GET",url:t,headers:{Accept:"text/html"}})).response}parseServerResponse(t){try{const r=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!r)return V.warn("server-response meta not found"),[];const o=r.getAttribute("content")??"",i=this.decodeHtmlEntities(o);let s;try{s=JSON.parse(i);}catch{return V.error("Failed to parse server-response JSON"),[]}return this.extractVideoItems(s)}catch(n){return V.error("parseServerResponse failed",n),[]}}parseWatchPageMetrics(t){try{const r=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!r)return null;const o=r.getAttribute("content")??"",i=this.decodeHtmlEntities(o),c=JSON.parse(i)?.data?.response?.video?.count;return c?{viewCount:c.view??0,mylistCount:c.mylist??0,commentCount:c.comment??0,likeCount:c.like??0}:null}catch(n){return V.error("parseWatchPageMetrics failed",n),null}}decodeHtmlEntities(t){if(!t)return "";let n=t.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return n=n.replace(/&#(\d+);/g,(r,o)=>String.fromCharCode(parseInt(o,10))),n=n.replace(/&#x([0-9a-fA-F]+);/g,(r,o)=>String.fromCharCode(parseInt(o,16))),n}extractVideoItems(t){const n=[],r=a=>{const c=(a?.id??a?.contentId??a?.watchId??"").toString();if(!c)return;const u=(a?.title??a?.shortTitle??"").toString();if(!u)return;const d=a?.count??{},f=Number(d.view??a?.viewCounter??0)||0,p=Number(d.comment??a?.commentCounter??0)||0,m=Number(d.mylist??a?.mylistCounter??0)||0,b=Number(d.like??a?.likeCounter??0)||0,_=a?.thumbnail??{},L=(_.nHdUrl||_.listingUrl||_.largeUrl||_.middleUrl||_.url||a?.thumbnailUrl||"").toString(),G=(a?.registeredAt||a?.startTime||a?.postedDateTime||"")?.toString?.()??"";let D="",g="user";a?.channel?.name?(D=a.channel.name,g="channel"):a?.owner&&(D=a.owner.name??a.owner.nickname??"",g=a.owner.ownerType==="channel"?"channel":"user"),a?.isChannelVideo&&(g="channel"),n.push({videoId:c,title:u,viewCount:f,commentCount:p,mylistCount:m,likeCount:b,thumbnail:L,postedAt:G,ownerName:D,ownerType:g});},s=(a,c)=>{if(c>10||n.length>=100||!a)return;if(Array.isArray(a)){for(const p of a){if(n.length>=100)return;s(p,c+1);}return}if(typeof a!="object"||a===null)return;const u=a;(u.id||u.contentId||u.watchId)&&r(u);const d=["data","items","searchResult","search","result","videos","list"],f=a;for(const p of d){if(n.length>=100)return;p in f&&s(f[p],c+1);}if(n.length===0&&c<7)for(const[p,m]of Object.entries(f)){if(n.length>=100)return;!d.includes(p)&&typeof m=="object"&&s(m,c+2);}};return s(t,0),n}deduplicateItems(t){const n=new Set,r=[];for(const o of t)o.videoId&&(n.has(o.videoId)||(n.add(o.videoId),r.push(o)));return r}}const ne=M("dAnimeCfRanking:RepresentativeSelector");function Ac(e,t,n){if(e.length===0)return {success:false,video:null,failureReason:"検索結果が0件です"};const r=e.filter(a=>n.determineUploaderType(a.ownerName,t)==="danime"),o=e.filter(a=>n.determineUploaderType(a.ownerName,t)==="official"),i=Dt(r),s=Dt(o);if(ne.debug("Candidate videos",{animeTitle:t,danimeCount:r.length,titleUploaderCount:o.length,danimeVideo:i?{id:i.videoId,views:i.viewCount}:null,titleVideo:s?{id:s.videoId,views:s.viewCount}:null}),i&&s){const a=i.viewCount??0,c=s.viewCount??0,u=a>=c?i:s,d=a>=c?"dAnime":"titleUploader";return ne.info("Representative video selected (compared by viewCount)",{animeTitle:t,videoId:u.videoId,viewCount:u.viewCount,source:d,danimeViews:a,titleViews:c}),{success:true,video:u,failureReason:null}}return i?(ne.info("Representative video selected (dAnime only)",{animeTitle:t,videoId:i.videoId,viewCount:i.viewCount}),{success:true,video:i,failureReason:null}):s?(ne.info("Representative video selected (titleUploader only)",{animeTitle:t,videoId:s.videoId,viewCount:s.viewCount}),{success:true,video:s,failureReason:null}):(ne.warn("No representative video found",{animeTitle:t,totalResults:e.length,danimeCount:r.length,titleUploaderCount:o.length}),{success:false,video:null,failureReason:`公式動画が見つかりませんでした（検索結果: ${e.length}件）`})}function Dt(e){if(e.length===0)return null;const t=e.filter(r=>{if(!r.postedAt)return  false;const o=new Date(r.postedAt);return !isNaN(o.getTime())});return t.length===0?(ne.warn("No valid postedAt found, using first video"),e[0]):[...t].sort((r,o)=>{const i=new Date(r.postedAt).getTime(),s=new Date(o.postedAt).getTime();return i-s})[0]}const fe=M("dAnimeCfRanking:FetchController");class Nc{queue=[];activeCount=0;maxConcurrent=Xn;apiClient;onComplete=null;processing=new Set;constructor(){this.apiClient=new ce;}setOnComplete(t){this.onComplete=t;}async fetch(t,n=false){const r=Cc(t);if(!n){const o=await Va(t);if(o&&En(o))return fe.debug("Cache hit",{title:t}),o}return this.processing.has(t)?new Promise((o,i)=>{this.queue.push({title:t,canonicalQuery:r,resolve:o,reject:i});}):new Promise((o,i)=>{this.queue.push({title:t,canonicalQuery:r,resolve:o,reject:i}),this.processQueue();})}async fetchBatch(t){const n=t.map(r=>this.fetch(r.title));return Promise.all(n)}processQueue(){for(;this.queue.length>0&&this.activeCount<this.maxConcurrent;){const t=this.queue.shift();if(!t)break;if(this.processing.has(t.title)){fe.debug("Skipping duplicate request",{title:t.title});continue}this.processing.add(t.title),this.activeCount++,this.executeRequest(t).then(n=>{t.resolve(n),this.onComplete&&this.onComplete(t.title,n);}).catch(n=>{t.reject(n);}).finally(()=>{this.activeCount--,this.processing.delete(t.title),setTimeout(()=>this.processQueue(),0);});}}async executeRequest(t){const{title:n,canonicalQuery:r}=t,o=Ga(n,r);await de(o);try{const i=await this.apiClient.search(r);if(i.length===0){const s=await this.apiClient.search(n);if(s.length===0){const a=Je(o,"検索結果が0件です");return await de(a),a}return this.processSearchResults(o,s,n)}return this.processSearchResults(o,i,n)}catch(i){const s=i instanceof Error?i.message:"Unknown error";fe.error("Fetch request failed",i,{title:n});const a=Je(o,s);return await de(a),a}}async processSearchResults(t,n,r){const o=Ac(n,r,ce);if(!o.success||!o.video){const c=Je(t,o.failureReason??"代表動画の選択に失敗しました");return await de(c),c}const i=ce.toRepresentativeVideo(o.video,r);let s={viewCount:o.video.viewCount,mylistCount:o.video.mylistCount,commentCount:o.video.commentCount,likeCount:o.video.likeCount};if(s.likeCount===0){const c=await this.apiClient.fetchMetrics(o.video.videoId);c&&(s=c);}const a=Ha(t,{representativeVideoId:o.video.videoId,representativeVideo:i,metrics:s});return await de(a),fe.info("Fetch completed",{title:t.title,videoId:o.video.videoId,metrics:s}),a}clearQueue(){const t=[...this.queue];this.queue=[];for(const n of t)n.reject(new Error("Queue cleared"));fe.info("Queue cleared",{count:t.length});}getStatus(){return {queueLength:this.queue.length,activeCount:this.activeCount}}}function Oc(){return new Nc}const Rc=M("dAnimeCfRanking:ScoreCalculator");function Zc(e){return e<=3?"S+++":e<=6?"S++":e<=10?"S+":e<=15?"S":e<=25?"A":e<=40?"B":e<=55?"C":e<=70?"D":e<=85?"E":e<=95?"F":"G"}function H(e){return Math.log10(e+1)}function Pc(e){return {viewCount:H(e.viewCount),mylistCount:H(e.mylistCount),commentCount:H(e.commentCount),likeCount:H(e.likeCount)}}function ye(e){if(e.length===0)return [];const t=Math.min(...e),n=Math.max(...e);return n===t?e.map(()=>0):e.map(r=>(r-t)/(n-t))}function Mc(e){const t=e.filter(f=>f.metrics!==null);if(t.length===0)return e.map(()=>null);const n=t.map(f=>H(f.metrics.viewCount)),r=t.map(f=>H(f.metrics.mylistCount)),o=t.map(f=>H(f.metrics.commentCount)),i=t.map(f=>H(f.metrics.likeCount)),s=ye(n),a=ye(r),c=ye(o),u=ye(i);let d=0;return e.map(f=>{if(f.metrics===null)return null;const p={viewCount:s[d],mylistCount:a[d],commentCount:c[d],likeCount:u[d]};return d++,p})}function Lc(e){return (e.viewCount+e.mylistCount+e.commentCount+e.likeCount)/4}function Ln(e){const t=Mc(e),n=e.map((a,c)=>{const u=t[c];if(u===null||a.metrics===null)return {title:a.title,scoreData:null};const d=Lc(u),f=Pc(a.metrics);return {title:a.title,scoreData:{totalScore:d,normalizedMetrics:u,logMetrics:f}}}),r=n.map((a,c)=>({...a,originalIndex:c})).filter(a=>a.scoreData!==null);r.sort((a,c)=>{const u=a.scoreData?.totalScore??0;return (c.scoreData?.totalScore??0)-u});const o=r.length,i=new Map;r.forEach((a,c)=>{i.set(a.originalIndex,c+1);});const s=n.map((a,c)=>{if(a.scoreData===null)return {title:a.title,rankData:null};const u=i.get(c)??0,d=o>0?u/o*100:100,f=Zc(d);return {title:a.title,rankData:{rank:u,totalCount:o,tier:f,score:a.scoreData}}});return Rc.debug("Ranks calculated",{inputCount:e.length,validCount:o}),s}const Dc=M("dAnimeCfRanking:RankBadge"),Fc={"S+++":{background:"linear-gradient(115deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 12%, rgba(255,255,255,0) 24%, rgba(255,255,255,0.55) 38%, rgba(255,255,255,0) 52%), linear-gradient(135deg, #6f4300 0%, #c98900 16%, #fff3a6 34%, #d99a00 50%, #fff8cf 64%, #b47500 78%, #f7c94a 100%)",text:"#241700",border:"#9f6a00",shadow:"inset 0 1px 0 rgba(255,255,255,0.72), inset 0 -1px 0 rgba(84,51,0,0.42), 0 1px 4px rgba(160,105,0,0.34)",textShadow:"0 1px 0 rgba(255,255,255,0.45)"},"S++":{background:"linear-gradient(115deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.3) 13%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.48) 39%, rgba(255,255,255,0) 53%), linear-gradient(135deg, #7c5200 0%, #d39a10 18%, #ffe887 34%, #c88700 50%, #fff4b8 65%, #a96b00 80%, #eeb735 100%)",text:"#241700",border:"#a16f08",shadow:"inset 0 1px 0 rgba(255,255,255,0.68), inset 0 -1px 0 rgba(86,56,0,0.4), 0 1px 4px rgba(150,100,0,0.3)",textShadow:"0 1px 0 rgba(255,255,255,0.42)"},"S+":{background:"linear-gradient(115deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.28) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.44) 40%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #8a6500 0%, #d6a619 18%, #ffe27a 34%, #be8500 50%, #fff1a8 66%, #9f7000 80%, #e4ad26 100%)",text:"#241700",border:"#a5790a",shadow:"inset 0 1px 0 rgba(255,255,255,0.64), inset 0 -1px 0 rgba(88,63,0,0.38), 0 1px 4px rgba(135,96,0,0.26)",textShadow:"0 1px 0 rgba(255,255,255,0.4)"},S:{background:"linear-gradient(115deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.26) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #957100 0%, #d1a124 18%, #ffdc6b 34%, #b98300 50%, #f7e49a 66%, #946800 80%, #d9a42a 100%)",text:"#261a00",border:"#9d750c",shadow:"inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(84,62,0,0.36), 0 1px 4px rgba(120,90,0,0.24)",textShadow:"0 1px 0 rgba(255,255,255,0.38)"},A:{background:"linear-gradient(115deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.34) 13%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.58) 39%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #777b80 0%, #c8ccd0 18%, #f7f8f8 34%, #a4a9ad 50%, #ffffff 64%, #8c9196 78%, #d8dbde 100%)",text:"#1e2328",border:"#8d9398",shadow:"inset 0 1px 0 rgba(255,255,255,0.78), inset 0 -1px 0 rgba(66,72,78,0.36), 0 1px 4px rgba(90,96,102,0.26)",textShadow:"0 1px 0 rgba(255,255,255,0.55)"},B:{background:"linear-gradient(115deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.22) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.36) 41%, rgba(255,255,255,0) 55%), linear-gradient(135deg, #5b2e10 0%, #a85d25 18%, #e0a05b 34%, #8a4519 50%, #f0be7b 66%, #6d3512 82%, #bd7430 100%)",text:"#fffaf3",border:"#7a3c15",shadow:"inset 0 1px 0 rgba(255,235,202,0.52), inset 0 -1px 0 rgba(45,22,7,0.52), 0 1px 4px rgba(95,48,17,0.32)",textShadow:"0 1px 1px rgba(45,22,7,0.72)"},C:{background:"#ffffff",text:"#333333",border:"#d7d7d7",shadow:"none",textShadow:"none"},D:{background:"#ffffff",text:"#333333",border:"#d7d7d7",shadow:"none",textShadow:"none"},E:{background:"#ffffff",text:"#333333",border:"#d7d7d7",shadow:"none",textShadow:"none"},F:{background:"#ffffff",text:"#333333",border:"#d7d7d7",shadow:"none",textShadow:"none"},G:{background:"#ffffff",text:"#333333",border:"#d7d7d7",shadow:"none",textShadow:"none"}},lt=`
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
`,Dn=`
  ${lt}
  background: #e0e0e0;
  color: #666;
  border: 1px solid #ccc;
`,jc=`
  ${lt}
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ef9a9a;
`,Vc=`
  display: inline-flex;
  vertical-align: middle;
`,Uc=`
  display: inline-flex;
  vertical-align: middle;
  margin-left: 2px;
  opacity: 0.9;
`;let ee=null;function Fn(){return ee||(ee=document.createElement("div"),ee.className="cf-ranking-global-tooltip",ee.style.cssText=`
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
    `,document.body.appendChild(ee)),ee}function Bc(e,t){const n=Fn();n.textContent=e,n.style.display="block";const r=t.getBoundingClientRect(),o=n.getBoundingClientRect();let i=r.left+r.width/2-o.width/2,s=r.top-o.height-8;i<8&&(i=8),i+o.width>window.innerWidth-8&&(i=window.innerWidth-o.width-8),s<8&&(s=r.bottom+8),n.style.left=`${i}px`,n.style.top=`${s}px`;}function Gc(){const e=Fn();e.style.display="none";}function Hc(e){const t=Fc[e];return `
    ${lt}
    background: ${t.background};
    color: ${t.text};
    border: 2px solid ${t.border};
    box-shadow: ${t.shadow};
    text-shadow: ${t.textShadow};
  `}function Jc(e){const t=document.createElement("div");return t.className="cf-ranking-badge cf-ranking-loading",t.setAttribute("style",Dn),t.innerHTML=dt(Tn),t.__cfRanking={title:e},t}function dt(e){return `<span style="${Vc}">${B(e,14)}</span>`}function qc(e){return `<span style="${Uc}">${B(e,12)}</span>`}function Kc(e,t){const n=(e.score.totalScore*100).toFixed(1),r=t?qc(qa):"";return `${e.tier} - 第${e.rank}位(${n}点)${r}`}function Wc(e,t,n,r,o=false){const i=e,s=i.__cfRanking?.title??n.title;if(e.onmouseenter=null,e.onmouseleave=null,e.onclick=null,n.status==="failed"||!t){e.className="cf-ranking-badge cf-ranking-error",e.setAttribute("style",jc),e.innerHTML=dt(Ja);const a=`取得失敗: ${n.failureReason??"不明なエラー"}
クリックでリトライ`;i.__cfRanking={title:s,retryCallback:r,tooltipContent:a},Ft(e),r&&(e.onclick=()=>eu(i,s,r),e.style.cursor="pointer");}else {e.className="cf-ranking-badge cf-ranking-rank",e.setAttribute("style",Hc(t.tier)),e.innerHTML=Kc(t,o),e.style.cursor="default";const a=Xc(t,n,o),c=Yc(a);i.__cfRanking={title:s,tooltipContent:c},Ft(e);}}function Ft(e){const t=e;e.onmouseenter=()=>{const n=t.__cfRanking?.tooltipContent;n&&Bc(n,e),e.classList.contains("cf-ranking-rank")&&(e.style.transform="scale(1.1)");},e.onmouseleave=()=>{Gc(),e.style.transform="scale(1)";};}function Xc(e,t,n){return {rank:e.rank,totalCount:e.totalCount,tier:e.tier,totalScore:e.score.totalScore,rawMetrics:t.metrics??{viewCount:0,mylistCount:0,commentCount:0,likeCount:0},normalizedMetrics:e.score.normalizedMetrics,representativeVideo:t.representativeVideo,fetchedAt:t.fetchedAt,isRankingFinalized:n}}function Yc(e){const t=[],n=e.isRankingFinalized?"✓確定":"⏳暫定";return t.push(`【${e.tier}ランク】第${e.rank}位 / ${e.totalCount}作品中 ${n}`),t.push(`総合スコア: ${(e.totalScore*100).toFixed(1)}点`),t.push(""),t.push("▼ 指標 (生値 / 正規化)"),t.push(`再生: ${ke(e.rawMetrics.viewCount)} / ${(e.normalizedMetrics.viewCount*100).toFixed(0)}%`),t.push(`マイリスト: ${ke(e.rawMetrics.mylistCount)} / ${(e.normalizedMetrics.mylistCount*100).toFixed(0)}%`),t.push(`コメント: ${ke(e.rawMetrics.commentCount)} / ${(e.normalizedMetrics.commentCount*100).toFixed(0)}%`),t.push(`いいね: ${ke(e.rawMetrics.likeCount)} / ${(e.normalizedMetrics.likeCount*100).toFixed(0)}%`),t.push(""),e.representativeVideo&&(t.push("▼ 代表動画"),t.push(`${e.representativeVideo.title}`),t.push(`投稿: ${jt(e.representativeVideo.postedAt)} (${Qc(e.representativeVideo.uploaderType)})`)),t.push(""),t.push(`取得: ${jt(e.fetchedAt)}`),t.join(`
`)}function ke(e){return e.toLocaleString("ja-JP")}function jt(e){try{return new Date(e).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}catch{return e}}function Qc(e){switch(e){case "danime":return "dアニメストア ニコニコ支店";case "official":return "公式";default:return "不明"}}function eu(e,t,n){const r=Date.now(),o=e.__cfRanking?.lastRetryTime??0;if(r-o<Yn){Dc.debug("Retry cooldown active",{title:t});return}e.__cfRanking&&(e.__cfRanking.lastRetryTime=r),e.className="cf-ranking-badge cf-ranking-loading",e.setAttribute("style",Dn),e.innerHTML=dt(Tn),n(t);}const Vt="cf-ranking-list-modal-host",tu=`
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
`;function nu(e,t){document.querySelector(`.${Vt}`)?.remove();const n=document.createElement("div");n.className=Vt;const r=n.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=tu,r.appendChild(o);const i=document.createElement("div");i.className="backdrop",i.innerHTML=ru(e,t),r.appendChild(i);const s=c=>{c.key==="Escape"&&a();},a=()=>{document.removeEventListener("keydown",s),n.remove();};i.addEventListener("click",c=>{c.target===i&&a();}),r.querySelector(".close-btn")?.addEventListener("click",a),document.addEventListener("keydown",s),document.body.appendChild(n);}function ru(e,t){const n=[...e].sort(ou),r=n.filter(a=>a.rankData!==null).length,o=n.filter(a=>a.cacheEntry?.status==="failed").length,i=n.length-r-o;return `
    <section class="dialog" role="dialog" aria-modal="true" aria-label="作品詳細ランキング">
      <header class="header">
        <div>
          <h2 class="title">作品詳細ランキング</h2>
          <div class="summary">
            ${t?"確定":"暫定"} / 対象 ${n.length}件 / ランク表示 ${r}件 / 取得失敗 ${o}件 / 未取得 ${i}件
          </div>
        </div>
        <button class="close-btn" type="button" aria-label="閉じる">
          ${B(Ka,20)}
        </button>
      </header>
      <div class="body">
        <table>
          <thead>
            <tr>
              <th class="rank-cell">順位</th>
              <th class="title-cell">作品</th>
              <th class="score-cell">スコア</th>
              <th class="metrics-cell">指標</th>
              <th class="video-cell">代表動画</th>
              <th class="fetched-cell">取得日時</th>
            </tr>
          </thead>
          <tbody>
            ${n.map(iu).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `}function ou(e,t){const n=e.rankData?.rank??Number.MAX_SAFE_INTEGER,r=t.rankData?.rank??Number.MAX_SAFE_INTEGER;return n!==r?n-r:e.title.localeCompare(t.title,"ja-JP")}function iu(e){const t=e.rankData,n=e.cacheEntry,r=n?.metrics;return `
    <tr>
      <td class="rank-cell">${su(t,n)}</td>
      <td class="title-cell"><div class="title-text">${ie(e.title)}</div></td>
      <td class="score-cell">${t?`${(t.score.totalScore*100).toFixed(1)}点`:'<span class="muted">-</span>'}</td>
      <td class="metrics-cell">${r?au(r):'<span class="muted">-</span>'}</td>
      <td class="video-cell">${cu(n)}</td>
      <td class="fetched-cell">${n?jn(n.fetchedAt):'<span class="muted">未取得</span>'}</td>
    </tr>
  `}function su(e,t){return e?`
      <span class="rank">
        <span class="tier">${ie(e.tier)}</span>
        第${e.rank}位
      </span>
    `:t?.status==="failed"?'<span class="muted">取得失敗</span>':'<span class="muted">未取得</span>'}function au(e){return `
    <div class="metrics-grid">
      <span><span class="metric-label">再生</span> ${Ce(e.viewCount)}</span>
      <span><span class="metric-label">コメ</span> ${Ce(e.commentCount)}</span>
      <span><span class="metric-label">マイリス</span> ${Ce(e.mylistCount)}</span>
      <span><span class="metric-label">いいね</span> ${Ce(e.likeCount)}</span>
    </div>
  `}function cu(e){const t=e?.representativeVideo;if(!t)return e?.failureReason?`<span class="muted">${ie(e.failureReason)}</span>`:'<span class="muted">-</span>';const n=`https://www.nicovideo.jp/watch/${encodeURIComponent(t.videoId)}`;return `
    <div class="video-title">${ie(t.title)}</div>
    <div class="muted">${ie(t.uploaderName)} / ${jn(t.postedAt)}</div>
    <a class="video-link" href="${n}" target="_blank" rel="noopener noreferrer">
      ${B(Ya,14)}
      ${ie(t.videoId)}
    </a>
  `}function Ce(e){return e.toLocaleString("ja-JP")}function jn(e){try{return new Date(e).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}catch{return e}}function ie(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}const S=M("dAnimeCfRanking");let w=[];const $=new Map,le=new Map;let P=null,Ut=null,ft=null,Bt=null,qe=null,Ke=false,xe=null;const Ie=new Set;let Vn=false,U=null,ze=false;const te=new Set;let Ee=0,Se=null,F=false;async function uu(){S.info("d-anime-cf-ranking starting..."),console.log("[CF-RANKING DEBUG] === 初期化開始 ===");const e=Fe();if(ja(),await In(),U=ec(e,{onSettingsChange:vu,onRefreshTrigger:_u,onOpenRankingList:ku}),rc(U),La(n=>{U?.updateSettings(n),yu(n.enabled);}),!e.enabled){S.info("Ranking display is disabled");return}await du(),console.log("[CF-RANKING DEBUG] キャッシュ読み込み後:",{cacheEntryMapSize:$.size,cacheEntryTitles:Array.from($.keys()).slice(0,10)}),P=Oc(),P.setOnComplete(be);const t=bc();w=await lu(),S.info("Cards detected",{count:w.length});for(const n of t)ut(n)||te.add(n);if(console.log("[CF-RANKING DEBUG] カード検出:",{domTotal:t.length,visibleCards:w.length,hiddenCards:te.size,cardTitles:w.map(n=>n.title).slice(0,10)}),w.length===0&&te.size===0){S.warn("No cards found");return}Hn(w),console.log("[CF-RANKING DEBUG] バッジ挿入後:",{badgeMapSize:le.size}),pu();for(const n of w)ft?.observe(n.element);Ut=mc(Gn),gc(Ut),te.size>0&&(Bt=vc(te,gu),_c(Bt),S.info("Visibility observer started for hidden cards",{count:te.size})),Vn=true,setTimeout(()=>{Bn();},500),setTimeout(()=>{Un();},2e3),S.info("d-anime-cf-ranking initialized"),console.log("[CF-RANKING DEBUG] === 初期化完了 ===");}async function lu(){for(let n=0;n<30;n++){const r=cc();if(r.length>0)return r;await new Promise(o=>setTimeout(o,500));}return []}async function du(){try{const e=await Ua();let t=0,n=0;for(const r of e)En(r)?($.set(r.title,r),t++):n++;S.info("Loaded cached entries",{total:e.length,valid:t}),console.log("[CF-RANKING DEBUG] キャッシュ読み込み詳細:",{totalInIndexedDB:e.length,validEntries:t,invalidEntries:n,titles:e.map(r=>r.title).slice(0,20)});}catch(e){S.error("Failed to load cached entries",e);}}function Un(){if(!P)return;console.log("[CF-RANKING DEBUG] === バックグラウンドフェッチ開始 ==="),console.log("[CF-RANKING DEBUG] allCards:",w.length),console.log("[CF-RANKING DEBUG] cacheEntryMap:",$.size);const e=w.filter(r=>$.has(r.title)),t=w.filter(r=>!$.has(r.title));if(console.log("[CF-RANKING DEBUG] キャッシュ状況:",{cached:e.length,uncached:t.length,uncachedTitles:t.map(r=>r.title).slice(0,10)}),t.length===0&&w.length>0){F=true,S.info("All cards cached, ranking finalized immediately"),console.log("[CF-RANKING DEBUG] 全カードキャッシュ済み - 即時確定"),Ue();return}Ee=0,tt();}function tt(){Se!==null&&clearTimeout(Se),Se=setTimeout(()=>{Se=null,fu();},300);}function fu(){if(!P||Ee>=w.length){F||(F=true,S.info("Ranking finalized",{total:$.size}),console.log("[CF-RANKING DEBUG] === フェッチ完了・順位確定 ==="),console.log("[CF-RANKING DEBUG] 最終状態:",{allCards:w.length,cacheEntryMap:$.size,badgeMap:le.size}),Ue());return}const e=w[Ee];if(Ee++,!e||$.has(e.title)){tt();return}P.fetch(e.title).then(t=>{be(e.title,t);}).catch(()=>{}).finally(()=>{tt();});}function pu(){ft=new IntersectionObserver(e=>{if(!Vn)return;let t=false;for(const n of e){const r=n.target,o=Ie.has(r),i=n.isIntersecting;o!==i&&(t=true,i?Ie.add(r):Ie.delete(r));}t&&hu();},{root:null,rootMargin:"50px",threshold:0});}function hu(){xe!==null&&clearTimeout(xe),xe=setTimeout(()=>{xe=null,Bn();},er);}function Bn(){if(!P)return;const n=w.filter(r=>Ie.has(r.element)).slice(0,Wn).filter(r=>!$.has(r.title));if(n.length!==0)for(const r of n)P.fetch(r.title).then(o=>{be(r.title,o);}).catch(o=>{S.error("Fetch failed",o,{title:r.title});});}function be(e,t){$.has(e)||($.set(e,t),mu());}function mu(){Ke=true,qe===null&&(qe=setTimeout(()=>{qe=null,Ke&&(Ke=false,Ue());},Qn));}function Gn(e){console.log("[CF-RANKING DEBUG] === 新しいカード検出 ==="),console.log("[CF-RANKING DEBUG] 検出されたカード:",e.length);const t=new Set(w.map(o=>o.title)),n=e.filter(o=>!t.has(o.title)),r=e.filter(o=>t.has(o.title));if(console.log("[CF-RANKING DEBUG] 重複チェック:",{total:e.length,unique:n.length,duplicates:r.length,duplicateTitles:r.map(o=>o.title)}),n.length!==0){w=[...w,...n],console.log("[CF-RANKING DEBUG] allCards更新後:",w.length),Hn(n);for(const o of n)ft?.observe(o.element);F&&(F=false,Un());}}function gu(e){console.log("[CF-RANKING DEBUG] === カードが表示状態に変更 ==="),console.log("[CF-RANKING DEBUG] 新しく表示されたカード:",e.length),console.log("[CF-RANKING DEBUG] タイトル:",e.map(t=>t.title)),Gn(e);}function Hn(e){const t=fc(e);for(const n of t){if(!n.insertionPoint)continue;const r=Jc(n.title);n.insertionPoint.parentElement?.insertBefore(r,n.insertionPoint),le.set(n.title,r),dc(n.element);}}function Ue(){console.log("[CF-RANKING DEBUG] === 順位再計算 ===");const e=w.map(u=>{const d=$.get(u.title);return {title:u.title,metrics:d?.status==="ok"?d.metrics:null}}),t=e.filter(u=>u.metrics!==null);console.log("[CF-RANKING DEBUG] 順位計算入力:",{totalInputs:e.length,validInputs:t.length,invalidInputs:e.length-t.length,isRankingFinalized:F});const n=Ln(e),r=n.filter(u=>u.rankData!==null),o=r.map(u=>u.rankData?.rank??0);console.log("[CF-RANKING DEBUG] 順位計算結果:",{totalOutputs:n.length,validRanks:r.length,minRank:Math.min(...o),maxRank:Math.max(...o),totalCount:r[0]?.rankData?.totalCount});let i=0,s=0,a=0,c=0;for(const u of n){const d=le.get(u.title),f=$.get(u.title);if(!d){s++;continue}if(!f){a++;continue}if(f.status==="pending"){c++;continue}Wc(d,u.rankData,f,bu,F),i++;}console.log("[CF-RANKING DEBUG] バッジ更新結果:",{updated:i,skippedNoBadge:s,skippedNoEntry:a,skippedPending:c});}function bu(e){P&&($.delete(e),P.fetch(e,true).then(t=>{be(e,t);}).catch(t=>{S.error("Retry failed",t,{title:e});}));}function vu(e){S.info("Settings changed",{settings:e}),$n(e);}async function _u(){if(ze||!P){S.warn("Refresh already in progress or fetch controller not ready");return}S.info("Manual refresh triggered"),console.log("[CF-RANKING DEBUG] === マニュアル再調査開始 ==="),ze=true,U?.setRefreshing(true);try{await Ba(),$.clear(),wu(),F=!1;let e=0;const t=w.length;U?.updateProgress(e,t);for(const n of w){if(!ze)break;try{const r=await P.fetch(n.title,!0);be(n.title,r),e++,U?.updateProgress(e,t);}catch(r){S.error("Refresh fetch failed",r,{title:n.title}),e++,U?.updateProgress(e,t);}await new Promise(r=>setTimeout(r,300));}F=!0,Ue(),S.info("Manual refresh completed",{total:e}),console.log("[CF-RANKING DEBUG] === マニュアル再調査完了 ===");}catch(e){S.error("Manual refresh failed",e);}finally{ze=false,U?.setRefreshing(false),U?.updateProgress(0,0);}}function wu(){for(const e of le.values())e.className="cf-ranking-badge cf-ranking-loading",e.setAttribute("style",`
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
    `),e.innerHTML='<span style="display: inline-flex; vertical-align: middle;"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z"/></svg></span>';}function yu(e){for(const t of le.values())t.style.display=e?"inline-flex":"none";}function ku(){const e=w.map(o=>{const i=$.get(o.title);return {title:o.title,metrics:i?.status==="ok"?i.metrics:null}}),t=Ln(e),n=new Map(t.map(o=>[o.title,o.rankData])),r=w.map(o=>({title:o.title,rankData:n.get(o.title)??null,cacheEntry:$.get(o.title)??null}));nu(r,F);}uu().catch(e=>{S.error("d-anime-cf-ranking failed to initialize",e);});

})();