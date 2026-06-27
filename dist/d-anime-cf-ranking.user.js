// ==UserScript==
// @name         d-anime-cf-ranking
// @namespace    dAnimeCfRanking
// @version      1.5.0
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

  const gt={debug:"debug",info:"info",warn:"warn",error:"error"},bt={debug:10,info:20,warn:30,error:40};let Xn=e=>bt[e]>=bt.warn;const F=e=>{const t=`[${e}]`,n={};return Object.keys(gt).forEach(r=>{const o=gt[r];n[r]=(...s)=>{if(!Xn(r))return;(console[o]??console.log)(t,...s);};}),n},Yn=[{label:"6時間",hours:6},{label:"12時間",hours:12},{label:"24時間",hours:24},{label:"48時間",hours:48},{label:"1週間",hours:168}],qt=1,Kt=168,Je={enabled:true,cacheTtlHours:24},Qn=10,er=3,tr=3e3,nr=500,rr=300,or="dAnimeCfRankingCache",P="metricsCache",sr=1;function l(e,t,n){function r(a,c){if(a._zod||Object.defineProperty(a,"_zod",{value:{def:c,constr:i,traits:new Set},enumerable:false}),a._zod.traits.has(e))return;a._zod.traits.add(e),t(a,c);const u=i.prototype,d=Object.keys(u);for(let f=0;f<d.length;f++){const p=d[f];p in a||(a[p]=u[p].bind(a));}}const o=n?.Parent??Object;class s extends o{}Object.defineProperty(s,"name",{value:e});function i(a){var c;const u=n?.Parent?new s:this;r(u,a),(c=u._zod).deferred??(c.deferred=[]);for(const d of u._zod.deferred)d();return u}return Object.defineProperty(i,"init",{value:r}),Object.defineProperty(i,Symbol.hasInstance,{value:a=>n?.Parent&&a instanceof n.Parent?true:a?._zod?.traits?.has(e)}),Object.defineProperty(i,"name",{value:e}),i}class ce extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");}}class Wt extends Error{constructor(t){super(`Encountered unidirectional transform during encode: ${t}`),this.name="ZodEncodeError";}}const Xt={};function Q(e){return Xt}function Yt(e){const t=Object.values(e).filter(r=>typeof r=="number");return Object.entries(e).filter(([r,o])=>t.indexOf(+r)===-1).map(([r,o])=>o)}function Qe(e,t){return typeof t=="bigint"?t.toString():t}function st(e){return {get value(){{const t=e();return Object.defineProperty(this,"value",{value:t}),t}}}}function it(e){return e==null}function at(e){const t=e.startsWith("^")?1:0,n=e.endsWith("$")?e.length-1:e.length;return e.slice(t,n)}function ir(e,t){const n=(e.toString().split(".")[1]||"").length,r=t.toString();let o=(r.split(".")[1]||"").length;if(o===0&&/\d?e-\d?/.test(r)){const c=r.match(/\d?e-(\d?)/);c?.[1]&&(o=Number.parseInt(c[1]));}const s=n>o?n:o,i=Number.parseInt(e.toFixed(s).replace(".","")),a=Number.parseInt(t.toFixed(s).replace(".",""));return i%a/10**s}const vt=Symbol("evaluating");function y(e,t,n){let r;Object.defineProperty(e,t,{get(){if(r!==vt)return r===void 0&&(r=vt,r=n()),r},set(o){Object.defineProperty(e,t,{value:o});},configurable:true});}function te(e,t,n){Object.defineProperty(e,t,{value:n,writable:true,enumerable:true,configurable:true});}function K(...e){const t={};for(const n of e){const r=Object.getOwnPropertyDescriptors(n);Object.assign(t,r);}return Object.defineProperties({},t)}function yt(e){return JSON.stringify(e)}function ar(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}const Qt="captureStackTrace"in Error?Error.captureStackTrace:(...e)=>{};function Oe(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}const cr=st(()=>{if(typeof navigator<"u"&&navigator?.userAgent?.includes("Cloudflare"))return  false;try{const e=Function;return new e(""),!0}catch{return  false}});function be(e){if(Oe(e)===false)return  false;const t=e.constructor;if(t===void 0||typeof t!="function")return  true;const n=t.prototype;return !(Oe(n)===false||Object.prototype.hasOwnProperty.call(n,"isPrototypeOf")===false)}function en(e){return be(e)?{...e}:Array.isArray(e)?[...e]:e}const ur=new Set(["string","number","symbol"]);function Fe(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function W(e,t,n){const r=new e._zod.constr(t??e._zod.def);return (!t||n?.parent)&&(r._zod.parent=e),r}function h(e){const t=e;if(!t)return {};if(typeof t=="string")return {error:()=>t};if(t?.message!==void 0){if(t?.error!==void 0)throw new Error("Cannot specify both `message` and `error` params");t.error=t.message;}return delete t.message,typeof t.error=="string"?{...t,error:()=>t.error}:t}function lr(e){return Object.keys(e).filter(t=>e[t]._zod.optin==="optional"&&e[t]._zod.optout==="optional")}const dr={safeint:[Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]};function fr(e,t){const n=e._zod.def,r=n.checks;if(r&&r.length>0)throw new Error(".pick() cannot be used on object schemas containing refinements");const s=K(e._zod.def,{get shape(){const i={};for(const a in t){if(!(a in n.shape))throw new Error(`Unrecognized key: "${a}"`);t[a]&&(i[a]=n.shape[a]);}return te(this,"shape",i),i},checks:[]});return W(e,s)}function pr(e,t){const n=e._zod.def,r=n.checks;if(r&&r.length>0)throw new Error(".omit() cannot be used on object schemas containing refinements");const s=K(e._zod.def,{get shape(){const i={...e._zod.def.shape};for(const a in t){if(!(a in n.shape))throw new Error(`Unrecognized key: "${a}"`);t[a]&&delete i[a];}return te(this,"shape",i),i},checks:[]});return W(e,s)}function hr(e,t){if(!be(t))throw new Error("Invalid input to extend: expected a plain object");const n=e._zod.def.checks;if(n&&n.length>0){const s=e._zod.def.shape;for(const i in t)if(Object.getOwnPropertyDescriptor(s,i)!==void 0)throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}const o=K(e._zod.def,{get shape(){const s={...e._zod.def.shape,...t};return te(this,"shape",s),s}});return W(e,o)}function mr(e,t){if(!be(t))throw new Error("Invalid input to safeExtend: expected a plain object");const n=K(e._zod.def,{get shape(){const r={...e._zod.def.shape,...t};return te(this,"shape",r),r}});return W(e,n)}function gr(e,t){const n=K(e._zod.def,{get shape(){const r={...e._zod.def.shape,...t._zod.def.shape};return te(this,"shape",r),r},get catchall(){return t._zod.def.catchall},checks:[]});return W(e,n)}function br(e,t,n){const o=t._zod.def.checks;if(o&&o.length>0)throw new Error(".partial() cannot be used on object schemas containing refinements");const i=K(t._zod.def,{get shape(){const a=t._zod.def.shape,c={...a};if(n)for(const u in n){if(!(u in a))throw new Error(`Unrecognized key: "${u}"`);n[u]&&(c[u]=e?new e({type:"optional",innerType:a[u]}):a[u]);}else for(const u in a)c[u]=e?new e({type:"optional",innerType:a[u]}):a[u];return te(this,"shape",c),c},checks:[]});return W(t,i)}function vr(e,t,n){const r=K(t._zod.def,{get shape(){const o=t._zod.def.shape,s={...o};if(n)for(const i in n){if(!(i in s))throw new Error(`Unrecognized key: "${i}"`);n[i]&&(s[i]=new e({type:"nonoptional",innerType:o[i]}));}else for(const i in o)s[i]=new e({type:"nonoptional",innerType:o[i]});return te(this,"shape",s),s}});return W(t,r)}function ie(e,t=0){if(e.aborted===true)return  true;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue!==true)return  true;return  false}function tn(e,t){return t.map(n=>{var r;return (r=n).path??(r.path=[]),n.path.unshift(e),n})}function ke(e){return typeof e=="string"?e:e?.message}function ee(e,t,n){const r={...e,path:e.path??[]};if(!e.message){const o=ke(e.inst?._zod.def?.error?.(e))??ke(t?.error?.(e))??ke(n.customError?.(e))??ke(n.localeError?.(e))??"Invalid input";r.message=o;}return delete r.inst,delete r.continue,t?.reportInput||delete r.input,r}function ct(e){return Array.isArray(e)?"array":typeof e=="string"?"string":"unknown"}function ve(...e){const[t,n,r]=e;return typeof t=="string"?{message:t,code:"custom",input:n,inst:r}:{...t}}const nn=(e,t)=>{e.name="$ZodError",Object.defineProperty(e,"_zod",{value:e._zod,enumerable:false}),Object.defineProperty(e,"issues",{value:t,enumerable:false}),e.message=JSON.stringify(t,Qe,2),Object.defineProperty(e,"toString",{value:()=>e.message,enumerable:false});},rn=l("$ZodError",nn),on=l("$ZodError",nn,{Parent:Error});function yr(e,t=n=>n.message){const n={},r=[];for(const o of e.issues)o.path.length>0?(n[o.path[0]]=n[o.path[0]]||[],n[o.path[0]].push(t(o))):r.push(t(o));return {formErrors:r,fieldErrors:n}}function kr(e,t=n=>n.message){const n={_errors:[]},r=o=>{for(const s of o.issues)if(s.code==="invalid_union"&&s.errors.length)s.errors.map(i=>r({issues:i}));else if(s.code==="invalid_key")r({issues:s.issues});else if(s.code==="invalid_element")r({issues:s.issues});else if(s.path.length===0)n._errors.push(t(s));else {let i=n,a=0;for(;a<s.path.length;){const c=s.path[a];a===s.path.length-1?(i[c]=i[c]||{_errors:[]},i[c]._errors.push(t(s))):i[c]=i[c]||{_errors:[]},i=i[c],a++;}}};return r(e),n}const ut=e=>(t,n,r,o)=>{const s=r?Object.assign(r,{async:false}):{async:false},i=t._zod.run({value:n,issues:[]},s);if(i instanceof Promise)throw new ce;if(i.issues.length){const a=new(o?.Err??e)(i.issues.map(c=>ee(c,s,Q())));throw Qt(a,o?.callee),a}return i.value},lt=e=>async(t,n,r,o)=>{const s=r?Object.assign(r,{async:true}):{async:true};let i=t._zod.run({value:n,issues:[]},s);if(i instanceof Promise&&(i=await i),i.issues.length){const a=new(o?.Err??e)(i.issues.map(c=>ee(c,s,Q())));throw Qt(a,o?.callee),a}return i.value},De=e=>(t,n,r)=>{const o=r?{...r,async:false}:{async:false},s=t._zod.run({value:n,issues:[]},o);if(s instanceof Promise)throw new ce;return s.issues.length?{success:false,error:new(e??rn)(s.issues.map(i=>ee(i,o,Q())))}:{success:true,data:s.value}},_r=De(on),je=e=>async(t,n,r)=>{const o=r?Object.assign(r,{async:true}):{async:true};let s=t._zod.run({value:n,issues:[]},o);return s instanceof Promise&&(s=await s),s.issues.length?{success:false,error:new e(s.issues.map(i=>ee(i,o,Q())))}:{success:true,data:s.value}},wr=je(on),Cr=e=>(t,n,r)=>{const o=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return ut(e)(t,n,o)},Sr=e=>(t,n,r)=>ut(e)(t,n,r),zr=e=>async(t,n,r)=>{const o=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return lt(e)(t,n,o)},xr=e=>async(t,n,r)=>lt(e)(t,n,r),$r=e=>(t,n,r)=>{const o=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return De(e)(t,n,o)},Tr=e=>(t,n,r)=>De(e)(t,n,r),Er=e=>async(t,n,r)=>{const o=r?Object.assign(r,{direction:"backward"}):{direction:"backward"};return je(e)(t,n,o)},Ir=e=>async(t,n,r)=>je(e)(t,n,r),Ar=/^[cC][^\s-]{8,}$/,Or=/^[0-9a-z]+$/,Rr=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,Nr=/^[0-9a-vA-V]{20}$/,Zr=/^[A-Za-z0-9]{27}$/,Lr=/^[a-zA-Z0-9_-]{21}$/,Pr=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,Mr=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,kt=e=>e?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,Fr=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,Dr="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function jr(){return new RegExp(Dr,"u")}const Vr=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Ur=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,Br=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,Hr=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Gr=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,sn=/^[A-Za-z0-9_-]*$/,Jr=/^\+[1-9]\d{6,14}$/,an="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",qr=new RegExp(`^${an}$`);function cn(e){const t="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof e.precision=="number"?e.precision===-1?`${t}`:e.precision===0?`${t}:[0-5]\\d`:`${t}:[0-5]\\d\\.\\d{${e.precision}}`:`${t}(?::[0-5]\\d(?:\\.\\d+)?)?`}function Kr(e){return new RegExp(`^${cn(e)}$`)}function Wr(e){const t=cn({precision:e.precision}),n=["Z"];e.local&&n.push(""),e.offset&&n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");const r=`${t}(?:${n.join("|")})`;return new RegExp(`^${an}T(?:${r})$`)}const Xr=e=>{const t=e?`[\\s\\S]{${e?.minimum??0},${e?.maximum??""}}`:"[\\s\\S]*";return new RegExp(`^${t}$`)},Yr=/^-?\d+$/,Qr=/^-?\d+(?:\.\d+)?$/,eo=/^(?:true|false)$/i,to=/^[^A-Z]*$/,no=/^[^a-z]*$/,A=l("$ZodCheck",(e,t)=>{var n;e._zod??(e._zod={}),e._zod.def=t,(n=e._zod).onattach??(n.onattach=[]);}),un={number:"number",bigint:"bigint",object:"date"},ln=l("$ZodCheckLessThan",(e,t)=>{A.init(e,t);const n=un[typeof t.value];e._zod.onattach.push(r=>{const o=r._zod.bag,s=(t.inclusive?o.maximum:o.exclusiveMaximum)??Number.POSITIVE_INFINITY;t.value<s&&(t.inclusive?o.maximum=t.value:o.exclusiveMaximum=t.value);}),e._zod.check=r=>{(t.inclusive?r.value<=t.value:r.value<t.value)||r.issues.push({origin:n,code:"too_big",maximum:typeof t.value=="object"?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort});};}),dn=l("$ZodCheckGreaterThan",(e,t)=>{A.init(e,t);const n=un[typeof t.value];e._zod.onattach.push(r=>{const o=r._zod.bag,s=(t.inclusive?o.minimum:o.exclusiveMinimum)??Number.NEGATIVE_INFINITY;t.value>s&&(t.inclusive?o.minimum=t.value:o.exclusiveMinimum=t.value);}),e._zod.check=r=>{(t.inclusive?r.value>=t.value:r.value>t.value)||r.issues.push({origin:n,code:"too_small",minimum:typeof t.value=="object"?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort});};}),ro=l("$ZodCheckMultipleOf",(e,t)=>{A.init(e,t),e._zod.onattach.push(n=>{var r;(r=n._zod.bag).multipleOf??(r.multipleOf=t.value);}),e._zod.check=n=>{if(typeof n.value!=typeof t.value)throw new Error("Cannot mix number and bigint in multiple_of check.");(typeof n.value=="bigint"?n.value%t.value===BigInt(0):ir(n.value,t.value)===0)||n.issues.push({origin:typeof n.value,code:"not_multiple_of",divisor:t.value,input:n.value,inst:e,continue:!t.abort});};}),oo=l("$ZodCheckNumberFormat",(e,t)=>{A.init(e,t),t.format=t.format||"float64";const n=t.format?.includes("int"),r=n?"int":"number",[o,s]=dr[t.format];e._zod.onattach.push(i=>{const a=i._zod.bag;a.format=t.format,a.minimum=o,a.maximum=s,n&&(a.pattern=Yr);}),e._zod.check=i=>{const a=i.value;if(n){if(!Number.isInteger(a)){i.issues.push({expected:r,format:t.format,code:"invalid_type",continue:false,input:a,inst:e});return}if(!Number.isSafeInteger(a)){a>0?i.issues.push({input:a,code:"too_big",maximum:Number.MAX_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:e,origin:r,inclusive:true,continue:!t.abort}):i.issues.push({input:a,code:"too_small",minimum:Number.MIN_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:e,origin:r,inclusive:true,continue:!t.abort});return}}a<o&&i.issues.push({origin:"number",input:a,code:"too_small",minimum:o,inclusive:true,inst:e,continue:!t.abort}),a>s&&i.issues.push({origin:"number",input:a,code:"too_big",maximum:s,inclusive:true,inst:e,continue:!t.abort});};}),so=l("$ZodCheckMaxLength",(e,t)=>{var n;A.init(e,t),(n=e._zod.def).when??(n.when=r=>{const o=r.value;return !it(o)&&o.length!==void 0}),e._zod.onattach.push(r=>{const o=r._zod.bag.maximum??Number.POSITIVE_INFINITY;t.maximum<o&&(r._zod.bag.maximum=t.maximum);}),e._zod.check=r=>{const o=r.value;if(o.length<=t.maximum)return;const i=ct(o);r.issues.push({origin:i,code:"too_big",maximum:t.maximum,inclusive:true,input:o,inst:e,continue:!t.abort});};}),io=l("$ZodCheckMinLength",(e,t)=>{var n;A.init(e,t),(n=e._zod.def).when??(n.when=r=>{const o=r.value;return !it(o)&&o.length!==void 0}),e._zod.onattach.push(r=>{const o=r._zod.bag.minimum??Number.NEGATIVE_INFINITY;t.minimum>o&&(r._zod.bag.minimum=t.minimum);}),e._zod.check=r=>{const o=r.value;if(o.length>=t.minimum)return;const i=ct(o);r.issues.push({origin:i,code:"too_small",minimum:t.minimum,inclusive:true,input:o,inst:e,continue:!t.abort});};}),ao=l("$ZodCheckLengthEquals",(e,t)=>{var n;A.init(e,t),(n=e._zod.def).when??(n.when=r=>{const o=r.value;return !it(o)&&o.length!==void 0}),e._zod.onattach.push(r=>{const o=r._zod.bag;o.minimum=t.length,o.maximum=t.length,o.length=t.length;}),e._zod.check=r=>{const o=r.value,s=o.length;if(s===t.length)return;const i=ct(o),a=s>t.length;r.issues.push({origin:i,...a?{code:"too_big",maximum:t.length}:{code:"too_small",minimum:t.length},inclusive:true,exact:true,input:r.value,inst:e,continue:!t.abort});};}),Ve=l("$ZodCheckStringFormat",(e,t)=>{var n,r;A.init(e,t),e._zod.onattach.push(o=>{const s=o._zod.bag;s.format=t.format,t.pattern&&(s.patterns??(s.patterns=new Set),s.patterns.add(t.pattern));}),t.pattern?(n=e._zod).check??(n.check=o=>{t.pattern.lastIndex=0,!t.pattern.test(o.value)&&o.issues.push({origin:"string",code:"invalid_format",format:t.format,input:o.value,...t.pattern?{pattern:t.pattern.toString()}:{},inst:e,continue:!t.abort});}):(r=e._zod).check??(r.check=()=>{});}),co=l("$ZodCheckRegex",(e,t)=>{Ve.init(e,t),e._zod.check=n=>{t.pattern.lastIndex=0,!t.pattern.test(n.value)&&n.issues.push({origin:"string",code:"invalid_format",format:"regex",input:n.value,pattern:t.pattern.toString(),inst:e,continue:!t.abort});};}),uo=l("$ZodCheckLowerCase",(e,t)=>{t.pattern??(t.pattern=to),Ve.init(e,t);}),lo=l("$ZodCheckUpperCase",(e,t)=>{t.pattern??(t.pattern=no),Ve.init(e,t);}),fo=l("$ZodCheckIncludes",(e,t)=>{A.init(e,t);const n=Fe(t.includes),r=new RegExp(typeof t.position=="number"?`^.{${t.position}}${n}`:n);t.pattern=r,e._zod.onattach.push(o=>{const s=o._zod.bag;s.patterns??(s.patterns=new Set),s.patterns.add(r);}),e._zod.check=o=>{o.value.includes(t.includes,t.position)||o.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:t.includes,input:o.value,inst:e,continue:!t.abort});};}),po=l("$ZodCheckStartsWith",(e,t)=>{A.init(e,t);const n=new RegExp(`^${Fe(t.prefix)}.*`);t.pattern??(t.pattern=n),e._zod.onattach.push(r=>{const o=r._zod.bag;o.patterns??(o.patterns=new Set),o.patterns.add(n);}),e._zod.check=r=>{r.value.startsWith(t.prefix)||r.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:t.prefix,input:r.value,inst:e,continue:!t.abort});};}),ho=l("$ZodCheckEndsWith",(e,t)=>{A.init(e,t);const n=new RegExp(`.*${Fe(t.suffix)}$`);t.pattern??(t.pattern=n),e._zod.onattach.push(r=>{const o=r._zod.bag;o.patterns??(o.patterns=new Set),o.patterns.add(n);}),e._zod.check=r=>{r.value.endsWith(t.suffix)||r.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:t.suffix,input:r.value,inst:e,continue:!t.abort});};}),mo=l("$ZodCheckOverwrite",(e,t)=>{A.init(e,t),e._zod.check=n=>{n.value=t.tx(n.value);};});class go{constructor(t=[]){this.content=[],this.indent=0,this&&(this.args=t);}indented(t){this.indent+=1,t(this),this.indent-=1;}write(t){if(typeof t=="function"){t(this,{execution:"sync"}),t(this,{execution:"async"});return}const r=t.split(`
`).filter(i=>i),o=Math.min(...r.map(i=>i.length-i.trimStart().length)),s=r.map(i=>i.slice(o)).map(i=>" ".repeat(this.indent*2)+i);for(const i of s)this.content.push(i);}compile(){const t=Function,n=this?.args,o=[...(this?.content??[""]).map(s=>`  ${s}`)];return new t(...n,o.join(`
`))}}const bo={major:4,minor:3,patch:6},z=l("$ZodType",(e,t)=>{var n;e??(e={}),e._zod.def=t,e._zod.bag=e._zod.bag||{},e._zod.version=bo;const r=[...e._zod.def.checks??[]];e._zod.traits.has("$ZodCheck")&&r.unshift(e);for(const o of r)for(const s of o._zod.onattach)s(e);if(r.length===0)(n=e._zod).deferred??(n.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse;});else {const o=(i,a,c)=>{let u=ie(i),d;for(const f of a){if(f._zod.def.when){if(!f._zod.def.when(i))continue}else if(u)continue;const p=i.issues.length,m=f._zod.check(i);if(m instanceof Promise&&c?.async===false)throw new ce;if(d||m instanceof Promise)d=(d??Promise.resolve()).then(async()=>{await m,i.issues.length!==p&&(u||(u=ie(i,p)));});else {if(i.issues.length===p)continue;u||(u=ie(i,p));}}return d?d.then(()=>i):i},s=(i,a,c)=>{if(ie(i))return i.aborted=true,i;const u=o(a,r,c);if(u instanceof Promise){if(c.async===false)throw new ce;return u.then(d=>e._zod.parse(d,c))}return e._zod.parse(u,c)};e._zod.run=(i,a)=>{if(a.skipChecks)return e._zod.parse(i,a);if(a.direction==="backward"){const u=e._zod.parse({value:i.value,issues:[]},{...a,skipChecks:true});return u instanceof Promise?u.then(d=>s(d,i,a)):s(u,i,a)}const c=e._zod.parse(i,a);if(c instanceof Promise){if(a.async===false)throw new ce;return c.then(u=>o(u,r,a))}return o(c,r,a)};}y(e,"~standard",()=>({validate:o=>{try{const s=_r(e,o);return s.success?{value:s.data}:{issues:s.error?.issues}}catch{return wr(e,o).then(i=>i.success?{value:i.data}:{issues:i.error?.issues})}},vendor:"zod",version:1}));}),dt=l("$ZodString",(e,t)=>{z.init(e,t),e._zod.pattern=[...e?._zod.bag?.patterns??[]].pop()??Xr(e._zod.bag),e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=String(n.value);}catch{}return typeof n.value=="string"||n.issues.push({expected:"string",code:"invalid_type",input:n.value,inst:e}),n};}),w=l("$ZodStringFormat",(e,t)=>{Ve.init(e,t),dt.init(e,t);}),vo=l("$ZodGUID",(e,t)=>{t.pattern??(t.pattern=Mr),w.init(e,t);}),yo=l("$ZodUUID",(e,t)=>{if(t.version){const r={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[t.version];if(r===void 0)throw new Error(`Invalid UUID version: "${t.version}"`);t.pattern??(t.pattern=kt(r));}else t.pattern??(t.pattern=kt());w.init(e,t);}),ko=l("$ZodEmail",(e,t)=>{t.pattern??(t.pattern=Fr),w.init(e,t);}),_o=l("$ZodURL",(e,t)=>{w.init(e,t),e._zod.check=n=>{try{const r=n.value.trim(),o=new URL(r);t.hostname&&(t.hostname.lastIndex=0,t.hostname.test(o.hostname)||n.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:t.hostname.source,input:n.value,inst:e,continue:!t.abort})),t.protocol&&(t.protocol.lastIndex=0,t.protocol.test(o.protocol.endsWith(":")?o.protocol.slice(0,-1):o.protocol)||n.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:t.protocol.source,input:n.value,inst:e,continue:!t.abort})),t.normalize?n.value=o.href:n.value=r;return}catch{n.issues.push({code:"invalid_format",format:"url",input:n.value,inst:e,continue:!t.abort});}};}),wo=l("$ZodEmoji",(e,t)=>{t.pattern??(t.pattern=jr()),w.init(e,t);}),Co=l("$ZodNanoID",(e,t)=>{t.pattern??(t.pattern=Lr),w.init(e,t);}),So=l("$ZodCUID",(e,t)=>{t.pattern??(t.pattern=Ar),w.init(e,t);}),zo=l("$ZodCUID2",(e,t)=>{t.pattern??(t.pattern=Or),w.init(e,t);}),xo=l("$ZodULID",(e,t)=>{t.pattern??(t.pattern=Rr),w.init(e,t);}),$o=l("$ZodXID",(e,t)=>{t.pattern??(t.pattern=Nr),w.init(e,t);}),To=l("$ZodKSUID",(e,t)=>{t.pattern??(t.pattern=Zr),w.init(e,t);}),Eo=l("$ZodISODateTime",(e,t)=>{t.pattern??(t.pattern=Wr(t)),w.init(e,t);}),Io=l("$ZodISODate",(e,t)=>{t.pattern??(t.pattern=qr),w.init(e,t);}),Ao=l("$ZodISOTime",(e,t)=>{t.pattern??(t.pattern=Kr(t)),w.init(e,t);}),Oo=l("$ZodISODuration",(e,t)=>{t.pattern??(t.pattern=Pr),w.init(e,t);}),Ro=l("$ZodIPv4",(e,t)=>{t.pattern??(t.pattern=Vr),w.init(e,t),e._zod.bag.format="ipv4";}),No=l("$ZodIPv6",(e,t)=>{t.pattern??(t.pattern=Ur),w.init(e,t),e._zod.bag.format="ipv6",e._zod.check=n=>{try{new URL(`http://[${n.value}]`);}catch{n.issues.push({code:"invalid_format",format:"ipv6",input:n.value,inst:e,continue:!t.abort});}};}),Zo=l("$ZodCIDRv4",(e,t)=>{t.pattern??(t.pattern=Br),w.init(e,t);}),Lo=l("$ZodCIDRv6",(e,t)=>{t.pattern??(t.pattern=Hr),w.init(e,t),e._zod.check=n=>{const r=n.value.split("/");try{if(r.length!==2)throw new Error;const[o,s]=r;if(!s)throw new Error;const i=Number(s);if(`${i}`!==s)throw new Error;if(i<0||i>128)throw new Error;new URL(`http://[${o}]`);}catch{n.issues.push({code:"invalid_format",format:"cidrv6",input:n.value,inst:e,continue:!t.abort});}};});function fn(e){if(e==="")return  true;if(e.length%4!==0)return  false;try{return atob(e),!0}catch{return  false}}const Po=l("$ZodBase64",(e,t)=>{t.pattern??(t.pattern=Gr),w.init(e,t),e._zod.bag.contentEncoding="base64",e._zod.check=n=>{fn(n.value)||n.issues.push({code:"invalid_format",format:"base64",input:n.value,inst:e,continue:!t.abort});};});function Mo(e){if(!sn.test(e))return  false;const t=e.replace(/[-_]/g,r=>r==="-"?"+":"/"),n=t.padEnd(Math.ceil(t.length/4)*4,"=");return fn(n)}const Fo=l("$ZodBase64URL",(e,t)=>{t.pattern??(t.pattern=sn),w.init(e,t),e._zod.bag.contentEncoding="base64url",e._zod.check=n=>{Mo(n.value)||n.issues.push({code:"invalid_format",format:"base64url",input:n.value,inst:e,continue:!t.abort});};}),Do=l("$ZodE164",(e,t)=>{t.pattern??(t.pattern=Jr),w.init(e,t);});function jo(e,t=null){try{const n=e.split(".");if(n.length!==3)return !1;const[r]=n;if(!r)return !1;const o=JSON.parse(atob(r));return !("typ"in o&&o?.typ!=="JWT"||!o.alg||t&&(!("alg"in o)||o.alg!==t))}catch{return  false}}const Vo=l("$ZodJWT",(e,t)=>{w.init(e,t),e._zod.check=n=>{jo(n.value,t.alg)||n.issues.push({code:"invalid_format",format:"jwt",input:n.value,inst:e,continue:!t.abort});};}),pn=l("$ZodNumber",(e,t)=>{z.init(e,t),e._zod.pattern=e._zod.bag.pattern??Qr,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=Number(n.value);}catch{}const o=n.value;if(typeof o=="number"&&!Number.isNaN(o)&&Number.isFinite(o))return n;const s=typeof o=="number"?Number.isNaN(o)?"NaN":Number.isFinite(o)?void 0:"Infinity":void 0;return n.issues.push({expected:"number",code:"invalid_type",input:o,inst:e,...s?{received:s}:{}}),n};}),Uo=l("$ZodNumberFormat",(e,t)=>{oo.init(e,t),pn.init(e,t);}),Bo=l("$ZodBoolean",(e,t)=>{z.init(e,t),e._zod.pattern=eo,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=!!n.value;}catch{}const o=n.value;return typeof o=="boolean"||n.issues.push({expected:"boolean",code:"invalid_type",input:o,inst:e}),n};}),Ho=l("$ZodUnknown",(e,t)=>{z.init(e,t),e._zod.parse=n=>n;}),Go=l("$ZodNever",(e,t)=>{z.init(e,t),e._zod.parse=(n,r)=>(n.issues.push({expected:"never",code:"invalid_type",input:n.value,inst:e}),n);});function _t(e,t,n){e.issues.length&&t.issues.push(...tn(n,e.issues)),t.value[n]=e.value;}const Jo=l("$ZodArray",(e,t)=>{z.init(e,t),e._zod.parse=(n,r)=>{const o=n.value;if(!Array.isArray(o))return n.issues.push({expected:"array",code:"invalid_type",input:o,inst:e}),n;n.value=Array(o.length);const s=[];for(let i=0;i<o.length;i++){const a=o[i],c=t.element._zod.run({value:a,issues:[]},r);c instanceof Promise?s.push(c.then(u=>_t(u,n,i))):_t(c,n,i);}return s.length?Promise.all(s).then(()=>n):n};});function Re(e,t,n,r,o){if(e.issues.length){if(o&&!(n in r))return;t.issues.push(...tn(n,e.issues));}e.value===void 0?n in r&&(t.value[n]=void 0):t.value[n]=e.value;}function hn(e){const t=Object.keys(e.shape);for(const r of t)if(!e.shape?.[r]?._zod?.traits?.has("$ZodType"))throw new Error(`Invalid element at key "${r}": expected a Zod schema`);const n=lr(e.shape);return {...e,keys:t,keySet:new Set(t),numKeys:t.length,optionalKeys:new Set(n)}}function mn(e,t,n,r,o,s){const i=[],a=o.keySet,c=o.catchall._zod,u=c.def.type,d=c.optout==="optional";for(const f in t){if(a.has(f))continue;if(u==="never"){i.push(f);continue}const p=c.run({value:t[f],issues:[]},r);p instanceof Promise?e.push(p.then(m=>Re(m,n,f,t,d))):Re(p,n,f,t,d);}return i.length&&n.issues.push({code:"unrecognized_keys",keys:i,input:t,inst:s}),e.length?Promise.all(e).then(()=>n):n}const qo=l("$ZodObject",(e,t)=>{if(z.init(e,t),!Object.getOwnPropertyDescriptor(t,"shape")?.get){const a=t.shape;Object.defineProperty(t,"shape",{get:()=>{const c={...a};return Object.defineProperty(t,"shape",{value:c}),c}});}const r=st(()=>hn(t));y(e._zod,"propValues",()=>{const a=t.shape,c={};for(const u in a){const d=a[u]._zod;if(d.values){c[u]??(c[u]=new Set);for(const f of d.values)c[u].add(f);}}return c});const o=Oe,s=t.catchall;let i;e._zod.parse=(a,c)=>{i??(i=r.value);const u=a.value;if(!o(u))return a.issues.push({expected:"object",code:"invalid_type",input:u,inst:e}),a;a.value={};const d=[],f=i.shape;for(const p of i.keys){const m=f[p],b=m._zod.optout==="optional",k=m._zod.run({value:u[p],issues:[]},c);k instanceof Promise?d.push(k.then(D=>Re(D,a,p,u,b))):Re(k,a,p,u,b);}return s?mn(d,u,a,c,r.value,e):d.length?Promise.all(d).then(()=>a):a};}),Ko=l("$ZodObjectJIT",(e,t)=>{qo.init(e,t);const n=e._zod.parse,r=st(()=>hn(t)),o=p=>{const m=new go(["shape","payload","ctx"]),b=r.value,k=v=>{const S=yt(v);return `shape[${S}]._zod.run({ value: input[${S}], issues: [] }, ctx)`};m.write("const input = payload.value;");const D=Object.create(null);let J=0;for(const v of b.keys)D[v]=`key_${J++}`;m.write("const newResult = {};");for(const v of b.keys){const S=D[v],O=yt(v),Wn=p[v]?._zod?.optout==="optional";m.write(`const ${S} = ${k(v)};`),Wn?m.write(`
        if (${S}.issues.length) {
          if (${O} in input) {
            payload.issues = payload.issues.concat(${S}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${O}, ...iss.path] : [${O}]
            })));
          }
        }
        
        if (${S}.value === undefined) {
          if (${O} in input) {
            newResult[${O}] = undefined;
          }
        } else {
          newResult[${O}] = ${S}.value;
        }
        
      `):m.write(`
        if (${S}.issues.length) {
          payload.issues = payload.issues.concat(${S}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${O}, ...iss.path] : [${O}]
          })));
        }
        
        if (${S}.value === undefined) {
          if (${O} in input) {
            newResult[${O}] = undefined;
          }
        } else {
          newResult[${O}] = ${S}.value;
        }
        
      `);}m.write("payload.value = newResult;"),m.write("return payload;");const j=m.compile();return (v,S)=>j(p,v,S)};let s;const i=Oe,a=!Xt.jitless,u=a&&cr.value,d=t.catchall;let f;e._zod.parse=(p,m)=>{f??(f=r.value);const b=p.value;return i(b)?a&&u&&m?.async===false&&m.jitless!==true?(s||(s=o(t.shape)),p=s(p,m),d?mn([],b,p,m,f,e):p):n(p,m):(p.issues.push({expected:"object",code:"invalid_type",input:b,inst:e}),p)};});function wt(e,t,n,r){for(const s of e)if(s.issues.length===0)return t.value=s.value,t;const o=e.filter(s=>!ie(s));return o.length===1?(t.value=o[0].value,o[0]):(t.issues.push({code:"invalid_union",input:t.value,inst:n,errors:e.map(s=>s.issues.map(i=>ee(i,r,Q())))}),t)}const Wo=l("$ZodUnion",(e,t)=>{z.init(e,t),y(e._zod,"optin",()=>t.options.some(o=>o._zod.optin==="optional")?"optional":void 0),y(e._zod,"optout",()=>t.options.some(o=>o._zod.optout==="optional")?"optional":void 0),y(e._zod,"values",()=>{if(t.options.every(o=>o._zod.values))return new Set(t.options.flatMap(o=>Array.from(o._zod.values)))}),y(e._zod,"pattern",()=>{if(t.options.every(o=>o._zod.pattern)){const o=t.options.map(s=>s._zod.pattern);return new RegExp(`^(${o.map(s=>at(s.source)).join("|")})$`)}});const n=t.options.length===1,r=t.options[0]._zod.run;e._zod.parse=(o,s)=>{if(n)return r(o,s);let i=false;const a=[];for(const c of t.options){const u=c._zod.run({value:o.value,issues:[]},s);if(u instanceof Promise)a.push(u),i=true;else {if(u.issues.length===0)return u;a.push(u);}}return i?Promise.all(a).then(c=>wt(c,o,e,s)):wt(a,o,e,s)};}),Xo=l("$ZodIntersection",(e,t)=>{z.init(e,t),e._zod.parse=(n,r)=>{const o=n.value,s=t.left._zod.run({value:o,issues:[]},r),i=t.right._zod.run({value:o,issues:[]},r);return s instanceof Promise||i instanceof Promise?Promise.all([s,i]).then(([c,u])=>Ct(n,c,u)):Ct(n,s,i)};});function et(e,t){if(e===t)return {valid:true,data:e};if(e instanceof Date&&t instanceof Date&&+e==+t)return {valid:true,data:e};if(be(e)&&be(t)){const n=Object.keys(t),r=Object.keys(e).filter(s=>n.indexOf(s)!==-1),o={...e,...t};for(const s of r){const i=et(e[s],t[s]);if(!i.valid)return {valid:false,mergeErrorPath:[s,...i.mergeErrorPath]};o[s]=i.data;}return {valid:true,data:o}}if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return {valid:false,mergeErrorPath:[]};const n=[];for(let r=0;r<e.length;r++){const o=e[r],s=t[r],i=et(o,s);if(!i.valid)return {valid:false,mergeErrorPath:[r,...i.mergeErrorPath]};n.push(i.data);}return {valid:true,data:n}}return {valid:false,mergeErrorPath:[]}}function Ct(e,t,n){const r=new Map;let o;for(const a of t.issues)if(a.code==="unrecognized_keys"){o??(o=a);for(const c of a.keys)r.has(c)||r.set(c,{}),r.get(c).l=true;}else e.issues.push(a);for(const a of n.issues)if(a.code==="unrecognized_keys")for(const c of a.keys)r.has(c)||r.set(c,{}),r.get(c).r=true;else e.issues.push(a);const s=[...r].filter(([,a])=>a.l&&a.r).map(([a])=>a);if(s.length&&o&&e.issues.push({...o,keys:s}),ie(e))return e;const i=et(t.value,n.value);if(!i.valid)throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(i.mergeErrorPath)}`);return e.value=i.data,e}const Yo=l("$ZodEnum",(e,t)=>{z.init(e,t);const n=Yt(t.entries),r=new Set(n);e._zod.values=r,e._zod.pattern=new RegExp(`^(${n.filter(o=>ur.has(typeof o)).map(o=>typeof o=="string"?Fe(o):o.toString()).join("|")})$`),e._zod.parse=(o,s)=>{const i=o.value;return r.has(i)||o.issues.push({code:"invalid_value",values:n,input:i,inst:e}),o};}),Qo=l("$ZodTransform",(e,t)=>{z.init(e,t),e._zod.parse=(n,r)=>{if(r.direction==="backward")throw new Wt(e.constructor.name);const o=t.transform(n.value,n);if(r.async)return (o instanceof Promise?o:Promise.resolve(o)).then(i=>(n.value=i,n));if(o instanceof Promise)throw new ce;return n.value=o,n};});function St(e,t){return e.issues.length&&t===void 0?{issues:[],value:void 0}:e}const gn=l("$ZodOptional",(e,t)=>{z.init(e,t),e._zod.optin="optional",e._zod.optout="optional",y(e._zod,"values",()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,void 0]):void 0),y(e._zod,"pattern",()=>{const n=t.innerType._zod.pattern;return n?new RegExp(`^(${at(n.source)})?$`):void 0}),e._zod.parse=(n,r)=>{if(t.innerType._zod.optin==="optional"){const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(s=>St(s,n.value)):St(o,n.value)}return n.value===void 0?n:t.innerType._zod.run(n,r)};}),es=l("$ZodExactOptional",(e,t)=>{gn.init(e,t),y(e._zod,"values",()=>t.innerType._zod.values),y(e._zod,"pattern",()=>t.innerType._zod.pattern),e._zod.parse=(n,r)=>t.innerType._zod.run(n,r);}),ts=l("$ZodNullable",(e,t)=>{z.init(e,t),y(e._zod,"optin",()=>t.innerType._zod.optin),y(e._zod,"optout",()=>t.innerType._zod.optout),y(e._zod,"pattern",()=>{const n=t.innerType._zod.pattern;return n?new RegExp(`^(${at(n.source)}|null)$`):void 0}),y(e._zod,"values",()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,null]):void 0),e._zod.parse=(n,r)=>n.value===null?n:t.innerType._zod.run(n,r);}),ns=l("$ZodDefault",(e,t)=>{z.init(e,t),e._zod.optin="optional",y(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(n,r)=>{if(r.direction==="backward")return t.innerType._zod.run(n,r);if(n.value===void 0)return n.value=t.defaultValue,n;const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(s=>zt(s,t)):zt(o,t)};});function zt(e,t){return e.value===void 0&&(e.value=t.defaultValue),e}const rs=l("$ZodPrefault",(e,t)=>{z.init(e,t),e._zod.optin="optional",y(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(n,r)=>(r.direction==="backward"||n.value===void 0&&(n.value=t.defaultValue),t.innerType._zod.run(n,r));}),os=l("$ZodNonOptional",(e,t)=>{z.init(e,t),y(e._zod,"values",()=>{const n=t.innerType._zod.values;return n?new Set([...n].filter(r=>r!==void 0)):void 0}),e._zod.parse=(n,r)=>{const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(s=>xt(s,e)):xt(o,e)};});function xt(e,t){return !e.issues.length&&e.value===void 0&&e.issues.push({code:"invalid_type",expected:"nonoptional",input:e.value,inst:t}),e}const ss=l("$ZodCatch",(e,t)=>{z.init(e,t),y(e._zod,"optin",()=>t.innerType._zod.optin),y(e._zod,"optout",()=>t.innerType._zod.optout),y(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(n,r)=>{if(r.direction==="backward")return t.innerType._zod.run(n,r);const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(s=>(n.value=s.value,s.issues.length&&(n.value=t.catchValue({...n,error:{issues:s.issues.map(i=>ee(i,r,Q()))},input:n.value}),n.issues=[]),n)):(n.value=o.value,o.issues.length&&(n.value=t.catchValue({...n,error:{issues:o.issues.map(s=>ee(s,r,Q()))},input:n.value}),n.issues=[]),n)};}),is=l("$ZodPipe",(e,t)=>{z.init(e,t),y(e._zod,"values",()=>t.in._zod.values),y(e._zod,"optin",()=>t.in._zod.optin),y(e._zod,"optout",()=>t.out._zod.optout),y(e._zod,"propValues",()=>t.in._zod.propValues),e._zod.parse=(n,r)=>{if(r.direction==="backward"){const s=t.out._zod.run(n,r);return s instanceof Promise?s.then(i=>_e(i,t.in,r)):_e(s,t.in,r)}const o=t.in._zod.run(n,r);return o instanceof Promise?o.then(s=>_e(s,t.out,r)):_e(o,t.out,r)};});function _e(e,t,n){return e.issues.length?(e.aborted=true,e):t._zod.run({value:e.value,issues:e.issues},n)}const as=l("$ZodReadonly",(e,t)=>{z.init(e,t),y(e._zod,"propValues",()=>t.innerType._zod.propValues),y(e._zod,"values",()=>t.innerType._zod.values),y(e._zod,"optin",()=>t.innerType?._zod?.optin),y(e._zod,"optout",()=>t.innerType?._zod?.optout),e._zod.parse=(n,r)=>{if(r.direction==="backward")return t.innerType._zod.run(n,r);const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then($t):$t(o)};});function $t(e){return e.value=Object.freeze(e.value),e}const cs=l("$ZodCustom",(e,t)=>{A.init(e,t),z.init(e,t),e._zod.parse=(n,r)=>n,e._zod.check=n=>{const r=n.value,o=t.fn(r);if(o instanceof Promise)return o.then(s=>Tt(s,n,r,e));Tt(o,n,r,e);};});function Tt(e,t,n,r){if(!e){const o={code:"custom",input:n,inst:r,path:[...r._zod.def.path??[]],continue:!r._zod.def.abort};r._zod.def.params&&(o.params=r._zod.def.params),t.issues.push(ve(o));}}var Et;class us{constructor(){this._map=new WeakMap,this._idmap=new Map;}add(t,...n){const r=n[0];return this._map.set(t,r),r&&typeof r=="object"&&"id"in r&&this._idmap.set(r.id,t),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(t){const n=this._map.get(t);return n&&typeof n=="object"&&"id"in n&&this._idmap.delete(n.id),this._map.delete(t),this}get(t){const n=t._zod.parent;if(n){const r={...this.get(n)??{}};delete r.id;const o={...r,...this._map.get(t)};return Object.keys(o).length?o:void 0}return this._map.get(t)}has(t){return this._map.has(t)}}function ls(){return new us}(Et=globalThis).__zod_globalRegistry??(Et.__zod_globalRegistry=ls());const me=globalThis.__zod_globalRegistry;function ds(e,t){return new e({type:"string",...h(t)})}function fs(e,t){return new e({type:"string",format:"email",check:"string_format",abort:false,...h(t)})}function It(e,t){return new e({type:"string",format:"guid",check:"string_format",abort:false,...h(t)})}function ps(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:false,...h(t)})}function hs(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:false,version:"v4",...h(t)})}function ms(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:false,version:"v6",...h(t)})}function gs(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:false,version:"v7",...h(t)})}function bs(e,t){return new e({type:"string",format:"url",check:"string_format",abort:false,...h(t)})}function vs(e,t){return new e({type:"string",format:"emoji",check:"string_format",abort:false,...h(t)})}function ys(e,t){return new e({type:"string",format:"nanoid",check:"string_format",abort:false,...h(t)})}function ks(e,t){return new e({type:"string",format:"cuid",check:"string_format",abort:false,...h(t)})}function _s(e,t){return new e({type:"string",format:"cuid2",check:"string_format",abort:false,...h(t)})}function ws(e,t){return new e({type:"string",format:"ulid",check:"string_format",abort:false,...h(t)})}function Cs(e,t){return new e({type:"string",format:"xid",check:"string_format",abort:false,...h(t)})}function Ss(e,t){return new e({type:"string",format:"ksuid",check:"string_format",abort:false,...h(t)})}function zs(e,t){return new e({type:"string",format:"ipv4",check:"string_format",abort:false,...h(t)})}function xs(e,t){return new e({type:"string",format:"ipv6",check:"string_format",abort:false,...h(t)})}function $s(e,t){return new e({type:"string",format:"cidrv4",check:"string_format",abort:false,...h(t)})}function Ts(e,t){return new e({type:"string",format:"cidrv6",check:"string_format",abort:false,...h(t)})}function Es(e,t){return new e({type:"string",format:"base64",check:"string_format",abort:false,...h(t)})}function Is(e,t){return new e({type:"string",format:"base64url",check:"string_format",abort:false,...h(t)})}function As(e,t){return new e({type:"string",format:"e164",check:"string_format",abort:false,...h(t)})}function Os(e,t){return new e({type:"string",format:"jwt",check:"string_format",abort:false,...h(t)})}function Rs(e,t){return new e({type:"string",format:"datetime",check:"string_format",offset:false,local:false,precision:null,...h(t)})}function Ns(e,t){return new e({type:"string",format:"date",check:"string_format",...h(t)})}function Zs(e,t){return new e({type:"string",format:"time",check:"string_format",precision:null,...h(t)})}function Ls(e,t){return new e({type:"string",format:"duration",check:"string_format",...h(t)})}function Ps(e,t){return new e({type:"number",checks:[],...h(t)})}function Ms(e,t){return new e({type:"number",check:"number_format",abort:false,format:"safeint",...h(t)})}function Fs(e,t){return new e({type:"boolean",...h(t)})}function Ds(e){return new e({type:"unknown"})}function js(e,t){return new e({type:"never",...h(t)})}function At(e,t){return new ln({check:"less_than",...h(t),value:e,inclusive:false})}function qe(e,t){return new ln({check:"less_than",...h(t),value:e,inclusive:true})}function Ot(e,t){return new dn({check:"greater_than",...h(t),value:e,inclusive:false})}function Ke(e,t){return new dn({check:"greater_than",...h(t),value:e,inclusive:true})}function Rt(e,t){return new ro({check:"multiple_of",...h(t),value:e})}function bn(e,t){return new so({check:"max_length",...h(t),maximum:e})}function Ne(e,t){return new io({check:"min_length",...h(t),minimum:e})}function vn(e,t){return new ao({check:"length_equals",...h(t),length:e})}function Vs(e,t){return new co({check:"string_format",format:"regex",...h(t),pattern:e})}function Us(e){return new uo({check:"string_format",format:"lowercase",...h(e)})}function Bs(e){return new lo({check:"string_format",format:"uppercase",...h(e)})}function Hs(e,t){return new fo({check:"string_format",format:"includes",...h(t),includes:e})}function Gs(e,t){return new po({check:"string_format",format:"starts_with",...h(t),prefix:e})}function Js(e,t){return new ho({check:"string_format",format:"ends_with",...h(t),suffix:e})}function de(e){return new mo({check:"overwrite",tx:e})}function qs(e){return de(t=>t.normalize(e))}function Ks(){return de(e=>e.trim())}function Ws(){return de(e=>e.toLowerCase())}function Xs(){return de(e=>e.toUpperCase())}function Ys(){return de(e=>ar(e))}function Qs(e,t,n){return new e({type:"array",element:t,...h(n)})}function ei(e,t,n){return new e({type:"custom",check:"custom",fn:t,...h(n)})}function ti(e){const t=ni(n=>(n.addIssue=r=>{if(typeof r=="string")n.issues.push(ve(r,n.value,t._zod.def));else {const o=r;o.fatal&&(o.continue=false),o.code??(o.code="custom"),o.input??(o.input=n.value),o.inst??(o.inst=t),o.continue??(o.continue=!t._zod.def.abort),n.issues.push(ve(o));}},e(n.value,n)));return t}function ni(e,t){const n=new A({check:"custom",...h(t)});return n._zod.check=e,n}function yn(e){let t=e?.target??"draft-2020-12";return t==="draft-4"&&(t="draft-04"),t==="draft-7"&&(t="draft-07"),{processors:e.processors??{},metadataRegistry:e?.metadata??me,target:t,unrepresentable:e?.unrepresentable??"throw",override:e?.override??(()=>{}),io:e?.io??"output",counter:0,seen:new Map,cycles:e?.cycles??"ref",reused:e?.reused??"inline",external:e?.external??void 0}}function E(e,t,n={path:[],schemaPath:[]}){var r;const o=e._zod.def,s=t.seen.get(e);if(s)return s.count++,n.schemaPath.includes(e)&&(s.cycle=n.path),s.schema;const i={schema:{},count:1,cycle:void 0,path:n.path};t.seen.set(e,i);const a=e._zod.toJSONSchema?.();if(a)i.schema=a;else {const d={...n,schemaPath:[...n.schemaPath,e],path:n.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(t,i.schema,d);else {const p=i.schema,m=t.processors[o.type];if(!m)throw new Error(`[toJSONSchema]: Non-representable type encountered: ${o.type}`);m(e,t,p,d);}const f=e._zod.parent;f&&(i.ref||(i.ref=f),E(f,t,d),t.seen.get(f).isParent=true);}const c=t.metadataRegistry.get(e);return c&&Object.assign(i.schema,c),t.io==="input"&&I(e)&&(delete i.schema.examples,delete i.schema.default),t.io==="input"&&i.schema._prefault&&((r=i.schema).default??(r.default=i.schema._prefault)),delete i.schema._prefault,t.seen.get(e).schema}function kn(e,t){const n=e.seen.get(t);if(!n)throw new Error("Unprocessed schema. This is a bug in Zod.");const r=new Map;for(const i of e.seen.entries()){const a=e.metadataRegistry.get(i[0])?.id;if(a){const c=r.get(a);if(c&&c!==i[0])throw new Error(`Duplicate schema id "${a}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);r.set(a,i[0]);}}const o=i=>{const a=e.target==="draft-2020-12"?"$defs":"definitions";if(e.external){const f=e.external.registry.get(i[0])?.id,p=e.external.uri??(b=>b);if(f)return {ref:p(f)};const m=i[1].defId??i[1].schema.id??`schema${e.counter++}`;return i[1].defId=m,{defId:m,ref:`${p("__shared")}#/${a}/${m}`}}if(i[1]===n)return {ref:"#"};const u=`#/${a}/`,d=i[1].schema.id??`__schema${e.counter++}`;return {defId:d,ref:u+d}},s=i=>{if(i[1].schema.$ref)return;const a=i[1],{ref:c,defId:u}=o(i);a.def={...a.schema},u&&(a.defId=u);const d=a.schema;for(const f in d)delete d[f];d.$ref=c;};if(e.cycles==="throw")for(const i of e.seen.entries()){const a=i[1];if(a.cycle)throw new Error(`Cycle detected: #/${a.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(const i of e.seen.entries()){const a=i[1];if(t===i[0]){s(i);continue}if(e.external){const u=e.external.registry.get(i[0])?.id;if(t!==i[0]&&u){s(i);continue}}if(e.metadataRegistry.get(i[0])?.id){s(i);continue}if(a.cycle){s(i);continue}if(a.count>1&&e.reused==="ref"){s(i);continue}}}function _n(e,t){const n=e.seen.get(t);if(!n)throw new Error("Unprocessed schema. This is a bug in Zod.");const r=i=>{const a=e.seen.get(i);if(a.ref===null)return;const c=a.def??a.schema,u={...c},d=a.ref;if(a.ref=null,d){r(d);const p=e.seen.get(d),m=p.schema;if(m.$ref&&(e.target==="draft-07"||e.target==="draft-04"||e.target==="openapi-3.0")?(c.allOf=c.allOf??[],c.allOf.push(m)):Object.assign(c,m),Object.assign(c,u),i._zod.parent===d)for(const k in c)k==="$ref"||k==="allOf"||k in u||delete c[k];if(m.$ref&&p.def)for(const k in c)k==="$ref"||k==="allOf"||k in p.def&&JSON.stringify(c[k])===JSON.stringify(p.def[k])&&delete c[k];}const f=i._zod.parent;if(f&&f!==d){r(f);const p=e.seen.get(f);if(p?.schema.$ref&&(c.$ref=p.schema.$ref,p.def))for(const m in c)m==="$ref"||m==="allOf"||m in p.def&&JSON.stringify(c[m])===JSON.stringify(p.def[m])&&delete c[m];}e.override({zodSchema:i,jsonSchema:c,path:a.path??[]});};for(const i of [...e.seen.entries()].reverse())r(i[0]);const o={};if(e.target==="draft-2020-12"?o.$schema="https://json-schema.org/draft/2020-12/schema":e.target==="draft-07"?o.$schema="http://json-schema.org/draft-07/schema#":e.target==="draft-04"?o.$schema="http://json-schema.org/draft-04/schema#":e.target,e.external?.uri){const i=e.external.registry.get(t)?.id;if(!i)throw new Error("Schema is missing an `id` property");o.$id=e.external.uri(i);}Object.assign(o,n.def??n.schema);const s=e.external?.defs??{};for(const i of e.seen.entries()){const a=i[1];a.def&&a.defId&&(s[a.defId]=a.def);}e.external||Object.keys(s).length>0&&(e.target==="draft-2020-12"?o.$defs=s:o.definitions=s);try{const i=JSON.parse(JSON.stringify(o));return Object.defineProperty(i,"~standard",{value:{...t["~standard"],jsonSchema:{input:Ze(t,"input",e.processors),output:Ze(t,"output",e.processors)}},enumerable:!1,writable:!1}),i}catch{throw new Error("Error converting schema to JSON.")}}function I(e,t){const n=t??{seen:new Set};if(n.seen.has(e))return  false;n.seen.add(e);const r=e._zod.def;if(r.type==="transform")return  true;if(r.type==="array")return I(r.element,n);if(r.type==="set")return I(r.valueType,n);if(r.type==="lazy")return I(r.getter(),n);if(r.type==="promise"||r.type==="optional"||r.type==="nonoptional"||r.type==="nullable"||r.type==="readonly"||r.type==="default"||r.type==="prefault")return I(r.innerType,n);if(r.type==="intersection")return I(r.left,n)||I(r.right,n);if(r.type==="record"||r.type==="map")return I(r.keyType,n)||I(r.valueType,n);if(r.type==="pipe")return I(r.in,n)||I(r.out,n);if(r.type==="object"){for(const o in r.shape)if(I(r.shape[o],n))return  true;return  false}if(r.type==="union"){for(const o of r.options)if(I(o,n))return  true;return  false}if(r.type==="tuple"){for(const o of r.items)if(I(o,n))return  true;return !!(r.rest&&I(r.rest,n))}return  false}const ri=(e,t={})=>n=>{const r=yn({...n,processors:t});return E(e,r),kn(r,e),_n(r,e)},Ze=(e,t,n={})=>r=>{const{libraryOptions:o,target:s}=r??{},i=yn({...o??{},target:s,io:t,processors:n});return E(e,i),kn(i,e),_n(i,e)},oi={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},si=(e,t,n,r)=>{const o=n;o.type="string";const{minimum:s,maximum:i,format:a,patterns:c,contentEncoding:u}=e._zod.bag;if(typeof s=="number"&&(o.minLength=s),typeof i=="number"&&(o.maxLength=i),a&&(o.format=oi[a]??a,o.format===""&&delete o.format,a==="time"&&delete o.format),u&&(o.contentEncoding=u),c&&c.size>0){const d=[...c];d.length===1?o.pattern=d[0].source:d.length>1&&(o.allOf=[...d.map(f=>({...t.target==="draft-07"||t.target==="draft-04"||t.target==="openapi-3.0"?{type:"string"}:{},pattern:f.source}))]);}},ii=(e,t,n,r)=>{const o=n,{minimum:s,maximum:i,format:a,multipleOf:c,exclusiveMaximum:u,exclusiveMinimum:d}=e._zod.bag;typeof a=="string"&&a.includes("int")?o.type="integer":o.type="number",typeof d=="number"&&(t.target==="draft-04"||t.target==="openapi-3.0"?(o.minimum=d,o.exclusiveMinimum=true):o.exclusiveMinimum=d),typeof s=="number"&&(o.minimum=s,typeof d=="number"&&t.target!=="draft-04"&&(d>=s?delete o.minimum:delete o.exclusiveMinimum)),typeof u=="number"&&(t.target==="draft-04"||t.target==="openapi-3.0"?(o.maximum=u,o.exclusiveMaximum=true):o.exclusiveMaximum=u),typeof i=="number"&&(o.maximum=i,typeof u=="number"&&t.target!=="draft-04"&&(u<=i?delete o.maximum:delete o.exclusiveMaximum)),typeof c=="number"&&(o.multipleOf=c);},ai=(e,t,n,r)=>{n.type="boolean";},ci=(e,t,n,r)=>{n.not={};},ui=(e,t,n,r)=>{},li=(e,t,n,r)=>{const o=e._zod.def,s=Yt(o.entries);s.every(i=>typeof i=="number")&&(n.type="number"),s.every(i=>typeof i=="string")&&(n.type="string"),n.enum=s;},di=(e,t,n,r)=>{if(t.unrepresentable==="throw")throw new Error("Custom types cannot be represented in JSON Schema")},fi=(e,t,n,r)=>{if(t.unrepresentable==="throw")throw new Error("Transforms cannot be represented in JSON Schema")},pi=(e,t,n,r)=>{const o=n,s=e._zod.def,{minimum:i,maximum:a}=e._zod.bag;typeof i=="number"&&(o.minItems=i),typeof a=="number"&&(o.maxItems=a),o.type="array",o.items=E(s.element,t,{...r,path:[...r.path,"items"]});},hi=(e,t,n,r)=>{const o=n,s=e._zod.def;o.type="object",o.properties={};const i=s.shape;for(const u in i)o.properties[u]=E(i[u],t,{...r,path:[...r.path,"properties",u]});const a=new Set(Object.keys(i)),c=new Set([...a].filter(u=>{const d=s.shape[u]._zod;return t.io==="input"?d.optin===void 0:d.optout===void 0}));c.size>0&&(o.required=Array.from(c)),s.catchall?._zod.def.type==="never"?o.additionalProperties=false:s.catchall?s.catchall&&(o.additionalProperties=E(s.catchall,t,{...r,path:[...r.path,"additionalProperties"]})):t.io==="output"&&(o.additionalProperties=false);},mi=(e,t,n,r)=>{const o=e._zod.def,s=o.inclusive===false,i=o.options.map((a,c)=>E(a,t,{...r,path:[...r.path,s?"oneOf":"anyOf",c]}));s?n.oneOf=i:n.anyOf=i;},gi=(e,t,n,r)=>{const o=e._zod.def,s=E(o.left,t,{...r,path:[...r.path,"allOf",0]}),i=E(o.right,t,{...r,path:[...r.path,"allOf",1]}),a=u=>"allOf"in u&&Object.keys(u).length===1,c=[...a(s)?s.allOf:[s],...a(i)?i.allOf:[i]];n.allOf=c;},bi=(e,t,n,r)=>{const o=e._zod.def,s=E(o.innerType,t,r),i=t.seen.get(e);t.target==="openapi-3.0"?(i.ref=o.innerType,n.nullable=true):n.anyOf=[s,{type:"null"}];},vi=(e,t,n,r)=>{const o=e._zod.def;E(o.innerType,t,r);const s=t.seen.get(e);s.ref=o.innerType;},yi=(e,t,n,r)=>{const o=e._zod.def;E(o.innerType,t,r);const s=t.seen.get(e);s.ref=o.innerType,n.default=JSON.parse(JSON.stringify(o.defaultValue));},ki=(e,t,n,r)=>{const o=e._zod.def;E(o.innerType,t,r);const s=t.seen.get(e);s.ref=o.innerType,t.io==="input"&&(n._prefault=JSON.parse(JSON.stringify(o.defaultValue)));},_i=(e,t,n,r)=>{const o=e._zod.def;E(o.innerType,t,r);const s=t.seen.get(e);s.ref=o.innerType;let i;try{i=o.catchValue(void 0);}catch{throw new Error("Dynamic catch values are not supported in JSON Schema")}n.default=i;},wi=(e,t,n,r)=>{const o=e._zod.def,s=t.io==="input"?o.in._zod.def.type==="transform"?o.out:o.in:o.out;E(s,t,r);const i=t.seen.get(e);i.ref=s;},Ci=(e,t,n,r)=>{const o=e._zod.def;E(o.innerType,t,r);const s=t.seen.get(e);s.ref=o.innerType,n.readOnly=true;},wn=(e,t,n,r)=>{const o=e._zod.def;E(o.innerType,t,r);const s=t.seen.get(e);s.ref=o.innerType;},Si=l("ZodISODateTime",(e,t)=>{Eo.init(e,t),C.init(e,t);});function zi(e){return Rs(Si,e)}const xi=l("ZodISODate",(e,t)=>{Io.init(e,t),C.init(e,t);});function $i(e){return Ns(xi,e)}const Ti=l("ZodISOTime",(e,t)=>{Ao.init(e,t),C.init(e,t);});function Ei(e){return Zs(Ti,e)}const Ii=l("ZodISODuration",(e,t)=>{Oo.init(e,t),C.init(e,t);});function Ai(e){return Ls(Ii,e)}const Oi=(e,t)=>{rn.init(e,t),e.name="ZodError",Object.defineProperties(e,{format:{value:n=>kr(e,n)},flatten:{value:n=>yr(e,n)},addIssue:{value:n=>{e.issues.push(n),e.message=JSON.stringify(e.issues,Qe,2);}},addIssues:{value:n=>{e.issues.push(...n),e.message=JSON.stringify(e.issues,Qe,2);}},isEmpty:{get(){return e.issues.length===0}}});},Z=l("ZodError",Oi,{Parent:Error}),Ri=ut(Z),Ni=lt(Z),Zi=De(Z),Li=je(Z),Pi=Cr(Z),Mi=Sr(Z),Fi=zr(Z),Di=xr(Z),ji=$r(Z),Vi=Tr(Z),Ui=Er(Z),Bi=Ir(Z),x=l("ZodType",(e,t)=>(z.init(e,t),Object.assign(e["~standard"],{jsonSchema:{input:Ze(e,"input"),output:Ze(e,"output")}}),e.toJSONSchema=ri(e,{}),e.def=t,e.type=t.type,Object.defineProperty(e,"_def",{value:t}),e.check=(...n)=>e.clone(K(t,{checks:[...t.checks??[],...n.map(r=>typeof r=="function"?{_zod:{check:r,def:{check:"custom"},onattach:[]}}:r)]}),{parent:true}),e.with=e.check,e.clone=(n,r)=>W(e,n,r),e.brand=()=>e,e.register=((n,r)=>(n.add(e,r),e)),e.parse=(n,r)=>Ri(e,n,r,{callee:e.parse}),e.safeParse=(n,r)=>Zi(e,n,r),e.parseAsync=async(n,r)=>Ni(e,n,r,{callee:e.parseAsync}),e.safeParseAsync=async(n,r)=>Li(e,n,r),e.spa=e.safeParseAsync,e.encode=(n,r)=>Pi(e,n,r),e.decode=(n,r)=>Mi(e,n,r),e.encodeAsync=async(n,r)=>Fi(e,n,r),e.decodeAsync=async(n,r)=>Di(e,n,r),e.safeEncode=(n,r)=>ji(e,n,r),e.safeDecode=(n,r)=>Vi(e,n,r),e.safeEncodeAsync=async(n,r)=>Ui(e,n,r),e.safeDecodeAsync=async(n,r)=>Bi(e,n,r),e.refine=(n,r)=>e.check(Ma(n,r)),e.superRefine=n=>e.check(Fa(n)),e.overwrite=n=>e.check(de(n)),e.optional=()=>Pt(e),e.exactOptional=()=>za(e),e.nullable=()=>Mt(e),e.nullish=()=>Pt(Mt(e)),e.nonoptional=n=>Aa(e,n),e.array=()=>ga(e),e.or=n=>ya([e,n]),e.and=n=>_a(e,n),e.transform=n=>Ft(e,Ca(n)),e.default=n=>Ta(e,n),e.prefault=n=>Ia(e,n),e.catch=n=>Ra(e,n),e.pipe=n=>Ft(e,n),e.readonly=()=>La(e),e.describe=n=>{const r=e.clone();return me.add(r,{description:n}),r},Object.defineProperty(e,"description",{get(){return me.get(e)?.description},configurable:true}),e.meta=(...n)=>{if(n.length===0)return me.get(e);const r=e.clone();return me.add(r,n[0]),r},e.isOptional=()=>e.safeParse(void 0).success,e.isNullable=()=>e.safeParse(null).success,e.apply=n=>n(e),e)),Cn=l("_ZodString",(e,t)=>{dt.init(e,t),x.init(e,t),e._zod.processJSONSchema=(r,o,s)=>si(e,r,o);const n=e._zod.bag;e.format=n.format??null,e.minLength=n.minimum??null,e.maxLength=n.maximum??null,e.regex=(...r)=>e.check(Vs(...r)),e.includes=(...r)=>e.check(Hs(...r)),e.startsWith=(...r)=>e.check(Gs(...r)),e.endsWith=(...r)=>e.check(Js(...r)),e.min=(...r)=>e.check(Ne(...r)),e.max=(...r)=>e.check(bn(...r)),e.length=(...r)=>e.check(vn(...r)),e.nonempty=(...r)=>e.check(Ne(1,...r)),e.lowercase=r=>e.check(Us(r)),e.uppercase=r=>e.check(Bs(r)),e.trim=()=>e.check(Ks()),e.normalize=(...r)=>e.check(qs(...r)),e.toLowerCase=()=>e.check(Ws()),e.toUpperCase=()=>e.check(Xs()),e.slugify=()=>e.check(Ys());}),Hi=l("ZodString",(e,t)=>{dt.init(e,t),Cn.init(e,t),e.email=n=>e.check(fs(Gi,n)),e.url=n=>e.check(bs(Ji,n)),e.jwt=n=>e.check(Os(ca,n)),e.emoji=n=>e.check(vs(qi,n)),e.guid=n=>e.check(It(Nt,n)),e.uuid=n=>e.check(ps(we,n)),e.uuidv4=n=>e.check(hs(we,n)),e.uuidv6=n=>e.check(ms(we,n)),e.uuidv7=n=>e.check(gs(we,n)),e.nanoid=n=>e.check(ys(Ki,n)),e.guid=n=>e.check(It(Nt,n)),e.cuid=n=>e.check(ks(Wi,n)),e.cuid2=n=>e.check(_s(Xi,n)),e.ulid=n=>e.check(ws(Yi,n)),e.base64=n=>e.check(Es(sa,n)),e.base64url=n=>e.check(Is(ia,n)),e.xid=n=>e.check(Cs(Qi,n)),e.ksuid=n=>e.check(Ss(ea,n)),e.ipv4=n=>e.check(zs(ta,n)),e.ipv6=n=>e.check(xs(na,n)),e.cidrv4=n=>e.check($s(ra,n)),e.cidrv6=n=>e.check(Ts(oa,n)),e.e164=n=>e.check(As(aa,n)),e.datetime=n=>e.check(zi(n)),e.date=n=>e.check($i(n)),e.time=n=>e.check(Ei(n)),e.duration=n=>e.check(Ai(n));});function U(e){return ds(Hi,e)}const C=l("ZodStringFormat",(e,t)=>{w.init(e,t),Cn.init(e,t);}),Gi=l("ZodEmail",(e,t)=>{ko.init(e,t),C.init(e,t);}),Nt=l("ZodGUID",(e,t)=>{vo.init(e,t),C.init(e,t);}),we=l("ZodUUID",(e,t)=>{yo.init(e,t),C.init(e,t);}),Ji=l("ZodURL",(e,t)=>{_o.init(e,t),C.init(e,t);}),qi=l("ZodEmoji",(e,t)=>{wo.init(e,t),C.init(e,t);}),Ki=l("ZodNanoID",(e,t)=>{Co.init(e,t),C.init(e,t);}),Wi=l("ZodCUID",(e,t)=>{So.init(e,t),C.init(e,t);}),Xi=l("ZodCUID2",(e,t)=>{zo.init(e,t),C.init(e,t);}),Yi=l("ZodULID",(e,t)=>{xo.init(e,t),C.init(e,t);}),Qi=l("ZodXID",(e,t)=>{$o.init(e,t),C.init(e,t);}),ea=l("ZodKSUID",(e,t)=>{To.init(e,t),C.init(e,t);}),ta=l("ZodIPv4",(e,t)=>{Ro.init(e,t),C.init(e,t);}),na=l("ZodIPv6",(e,t)=>{No.init(e,t),C.init(e,t);}),ra=l("ZodCIDRv4",(e,t)=>{Zo.init(e,t),C.init(e,t);}),oa=l("ZodCIDRv6",(e,t)=>{Lo.init(e,t),C.init(e,t);}),sa=l("ZodBase64",(e,t)=>{Po.init(e,t),C.init(e,t);}),ia=l("ZodBase64URL",(e,t)=>{Fo.init(e,t),C.init(e,t);}),aa=l("ZodE164",(e,t)=>{Do.init(e,t),C.init(e,t);}),ca=l("ZodJWT",(e,t)=>{Vo.init(e,t),C.init(e,t);}),Sn=l("ZodNumber",(e,t)=>{pn.init(e,t),x.init(e,t),e._zod.processJSONSchema=(r,o,s)=>ii(e,r,o),e.gt=(r,o)=>e.check(Ot(r,o)),e.gte=(r,o)=>e.check(Ke(r,o)),e.min=(r,o)=>e.check(Ke(r,o)),e.lt=(r,o)=>e.check(At(r,o)),e.lte=(r,o)=>e.check(qe(r,o)),e.max=(r,o)=>e.check(qe(r,o)),e.int=r=>e.check(Zt(r)),e.safe=r=>e.check(Zt(r)),e.positive=r=>e.check(Ot(0,r)),e.nonnegative=r=>e.check(Ke(0,r)),e.negative=r=>e.check(At(0,r)),e.nonpositive=r=>e.check(qe(0,r)),e.multipleOf=(r,o)=>e.check(Rt(r,o)),e.step=(r,o)=>e.check(Rt(r,o)),e.finite=()=>e;const n=e._zod.bag;e.minValue=Math.max(n.minimum??Number.NEGATIVE_INFINITY,n.exclusiveMinimum??Number.NEGATIVE_INFINITY)??null,e.maxValue=Math.min(n.maximum??Number.POSITIVE_INFINITY,n.exclusiveMaximum??Number.POSITIVE_INFINITY)??null,e.isInt=(n.format??"").includes("int")||Number.isSafeInteger(n.multipleOf??.5),e.isFinite=true,e.format=n.format??null;});function ge(e){return Ps(Sn,e)}const ua=l("ZodNumberFormat",(e,t)=>{Uo.init(e,t),Sn.init(e,t);});function Zt(e){return Ms(ua,e)}const la=l("ZodBoolean",(e,t)=>{Bo.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ai(e,n,r);});function da(e){return Fs(la,e)}const fa=l("ZodUnknown",(e,t)=>{Ho.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ui();});function Lt(){return Ds(fa)}const pa=l("ZodNever",(e,t)=>{Go.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ci(e,n,r);});function ha(e){return js(pa,e)}const ma=l("ZodArray",(e,t)=>{Jo.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>pi(e,n,r,o),e.element=t.element,e.min=(n,r)=>e.check(Ne(n,r)),e.nonempty=n=>e.check(Ne(1,n)),e.max=(n,r)=>e.check(bn(n,r)),e.length=(n,r)=>e.check(vn(n,r)),e.unwrap=()=>e.element;});function ga(e,t){return Qs(ma,e,t)}const ba=l("ZodObject",(e,t)=>{Ko.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>hi(e,n,r,o),y(e,"shape",()=>t.shape),e.keyof=()=>nt(Object.keys(e._zod.def.shape)),e.catchall=n=>e.clone({...e._zod.def,catchall:n}),e.passthrough=()=>e.clone({...e._zod.def,catchall:Lt()}),e.loose=()=>e.clone({...e._zod.def,catchall:Lt()}),e.strict=()=>e.clone({...e._zod.def,catchall:ha()}),e.strip=()=>e.clone({...e._zod.def,catchall:void 0}),e.extend=n=>hr(e,n),e.safeExtend=n=>mr(e,n),e.merge=n=>gr(e,n),e.pick=n=>fr(e,n),e.omit=n=>pr(e,n),e.partial=(...n)=>br(zn,e,n[0]),e.required=(...n)=>vr(xn,e,n[0]);});function Ee(e,t){const n={type:"object",shape:e??{},...h(t)};return new ba(n)}const va=l("ZodUnion",(e,t)=>{Wo.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>mi(e,n,r,o),e.options=t.options;});function ya(e,t){return new va({type:"union",options:e,...h(t)})}const ka=l("ZodIntersection",(e,t)=>{Xo.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>gi(e,n,r,o);});function _a(e,t){return new ka({type:"intersection",left:e,right:t})}const tt=l("ZodEnum",(e,t)=>{Yo.init(e,t),x.init(e,t),e._zod.processJSONSchema=(r,o,s)=>li(e,r,o),e.enum=t.entries,e.options=Object.values(t.entries);const n=new Set(Object.keys(t.entries));e.extract=(r,o)=>{const s={};for(const i of r)if(n.has(i))s[i]=t.entries[i];else throw new Error(`Key ${i} not found in enum`);return new tt({...t,checks:[],...h(o),entries:s})},e.exclude=(r,o)=>{const s={...t.entries};for(const i of r)if(n.has(i))delete s[i];else throw new Error(`Key ${i} not found in enum`);return new tt({...t,checks:[],...h(o),entries:s})};});function nt(e,t){const n=Array.isArray(e)?Object.fromEntries(e.map(r=>[r,r])):e;return new tt({type:"enum",entries:n,...h(t)})}const wa=l("ZodTransform",(e,t)=>{Qo.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>fi(e,n),e._zod.parse=(n,r)=>{if(r.direction==="backward")throw new Wt(e.constructor.name);n.addIssue=s=>{if(typeof s=="string")n.issues.push(ve(s,n.value,t));else {const i=s;i.fatal&&(i.continue=false),i.code??(i.code="custom"),i.input??(i.input=n.value),i.inst??(i.inst=e),n.issues.push(ve(i));}};const o=t.transform(n.value,n);return o instanceof Promise?o.then(s=>(n.value=s,n)):(n.value=o,n)};});function Ca(e){return new wa({type:"transform",transform:e})}const zn=l("ZodOptional",(e,t)=>{gn.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>wn(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function Pt(e){return new zn({type:"optional",innerType:e})}const Sa=l("ZodExactOptional",(e,t)=>{es.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>wn(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function za(e){return new Sa({type:"optional",innerType:e})}const xa=l("ZodNullable",(e,t)=>{ts.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>bi(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function Mt(e){return new xa({type:"nullable",innerType:e})}const $a=l("ZodDefault",(e,t)=>{ns.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>yi(e,n,r,o),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap;});function Ta(e,t){return new $a({type:"default",innerType:e,get defaultValue(){return typeof t=="function"?t():en(t)}})}const Ea=l("ZodPrefault",(e,t)=>{rs.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ki(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function Ia(e,t){return new Ea({type:"prefault",innerType:e,get defaultValue(){return typeof t=="function"?t():en(t)}})}const xn=l("ZodNonOptional",(e,t)=>{os.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>vi(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function Aa(e,t){return new xn({type:"nonoptional",innerType:e,...h(t)})}const Oa=l("ZodCatch",(e,t)=>{ss.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>_i(e,n,r,o),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap;});function Ra(e,t){return new Oa({type:"catch",innerType:e,catchValue:typeof t=="function"?t:()=>t})}const Na=l("ZodPipe",(e,t)=>{is.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>wi(e,n,r,o),e.in=t.in,e.out=t.out;});function Ft(e,t){return new Na({type:"pipe",in:e,out:t})}const Za=l("ZodReadonly",(e,t)=>{as.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>Ci(e,n,r,o),e.unwrap=()=>e._zod.def.innerType;});function La(e){return new Za({type:"readonly",innerType:e})}const Pa=l("ZodCustom",(e,t)=>{cs.init(e,t),x.init(e,t),e._zod.processJSONSchema=(n,r,o)=>di(e,n);});function Ma(e,t={}){return ei(Pa,e,t)}function Fa(e){return ti(e)}const Da=["en","zh-Hans","hi","es","fr","ar","pt","bn","ru","ur"],ja=["ja",...Da],Va=new Set(["ar","ur"]);function Ua(e){return Va.has(e)?"rtl":"ltr"}function Ba(e,t,n){const r=e[n],o={},s=e;for(const i of t)o[i]={...r,...s[i]??{}};return o}function Ha(e,t){return Ba(e,ja,t)}function Ga(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(n,r)=>{const o=t[r];return o===void 0?n:String(o)})}function Ja(e){const t=Object.keys(e.translations);let n=e.defaultLocale;const r=u=>{const d=u.toLowerCase(),f=e.aliases?.[d];if(f)return f;const p=t.find(b=>b.toLowerCase()===d);if(p)return p;const m=d.split("-")[0];return t.find(b=>b.toLowerCase().split("-")[0]===m)??null},o=()=>{const u=navigator.languages.length>0?navigator.languages:[navigator.language];for(const d of u){const f=r(d);if(f)return f}return e.fallbackLocale},s=u=>{const d=e.translations[n]?.[u];if(d)return d;const f=e.translations[e.fallbackLocale]?.[u];return f||(e.translations[e.defaultLocale]?.[u]??u)};return {locales:t,getLocale:()=>n,setLocale:u=>{n=u;},detectBrowserLocale:o,t:s,format:(u,d)=>Ga(s(u),d),getTranslations:(u=n)=>e.translations[u]??e.translations[e.fallbackLocale],getDirection:(u=n)=>Ua(u),getMissingTranslationKeys:u=>{const d=e.translations[e.fallbackLocale],f=e.translations[u];return Object.keys(d).filter(p=>!f[p])}}}const qa=Ha({ja:{cacheTtl:"キャッシュ有効期限 (TTL)",close:"閉じる",comment:"コメ",confirmed:"✓確定",dataRefresh:"データ更新",days:"{days}日",daysHours:"{days}日{hours}時間",detailRanking:"詳細ランキング",failed:"取得失敗",fetchFailed:`取得失敗: {message}
クリックでリトライ`,fetched:"取得",fetchedAt:"取得日時",fetching:"取得中...",hours:"{hours}時間",like:"いいね",metrics:"指標",metricsHeader:"▼ 指標 (生値 / 正規化)",mylist:"マイリス",pending:"未取得",points:"{score}点",progress:"{current} / {total} 作品取得済み ({percent}%)",rank:"順位",rankBadge:"{tier} - 第{rank}位({score}点)",rankingDisplayOff:"⚪ ランキング表示: OFF",rankingDisplayOn:"🔵 ランキング表示: ON",rankingSettings:"ニコニコランキング設定",refreshAll:"全作品を再取得",retryClick:"クリックでリトライ",score:"スコア",statusFinal:"確定",statusTemporary:"暫定",summary:"{status} / 対象 {target}件 / ランク表示 {ranked}件 / 取得失敗 {failed}件 / 未取得 {pending}件",target:"対象",temporary:"⏳暫定",title:"作品",totalScore:"総合スコア: {score}点",unknownError:"不明なエラー",video:"代表動画",view:"再生",weeks:"{weeks}週間"},en:{cacheTtl:"Cache TTL",close:"Close",comment:"Comments",confirmed:"✓ Final",dataRefresh:"Data refresh",days:"{days} day(s)",daysHours:"{days} day(s) {hours} hour(s)",detailRanking:"Detailed ranking",failed:"Failed",fetchFailed:`Fetch failed: {message}
Click to retry`,fetched:"Fetched",fetchedAt:"Fetched at",fetching:"Fetching...",hours:"{hours} hour(s)",like:"Likes",metrics:"Metrics",metricsHeader:"▼ Metrics (raw / normalized)",mylist:"Mylist",pending:"Pending",points:"{score} pts",progress:"{current} / {total} titles fetched ({percent}%)",rank:"Rank",rankBadge:"{tier} - #{rank} ({score} pts)",rankingDisplayOff:"⚪ Ranking display: OFF",rankingDisplayOn:"🔵 Ranking display: ON",rankingSettings:"Niconico Ranking Settings",refreshAll:"Refetch all titles",retryClick:"Click to retry",score:"Score",statusFinal:"Final",statusTemporary:"Temporary",summary:"{status} / Target {target} / Ranked {ranked} / Failed {failed} / Pending {pending}",target:"Target",temporary:"⏳ Temporary",title:"Title",totalScore:"Total score: {score} pts",unknownError:"Unknown error",video:"Representative video",view:"Views",weeks:"{weeks} week(s)"},"zh-Hans":{cacheTtl:"缓存 TTL",close:"关闭",comment:"评论",confirmed:"✓ 最终",dataRefresh:"数据刷新",days:"{days} 天",daysHours:"{days} 天 {hours} 小时",detailRanking:"详细排名",failed:"获取失败",fetchFailed:`获取失败：{message}
点击重试`,fetched:"已获取",fetchedAt:"获取时间",fetching:"正在获取...",hours:"{hours} 小时",like:"点赞",metrics:"指标",metricsHeader:"▼ 指标（原始 / 归一化）",mylist:"收藏",pending:"待获取",points:"{score} 分",progress:"已获取 {current} / {total} 部作品 ({percent}%)",rank:"排名",rankBadge:"{tier} - 第 {rank} 名（{score} 分）",rankingDisplayOff:"⚪ 排名显示：OFF",rankingDisplayOn:"🔵 排名显示：ON",rankingSettings:"Niconico 排名设置",refreshAll:"重新获取所有作品",retryClick:"点击重试",score:"分数",statusFinal:"最终",statusTemporary:"临时",summary:"{status} / 目标 {target} / 已排名 {ranked} / 失败 {failed} / 待获取 {pending}",target:"目标",temporary:"⏳ 临时",title:"作品",totalScore:"总分：{score} 分",unknownError:"未知错误",video:"代表视频",view:"播放",weeks:"{weeks} 周"},hi:{cacheTtl:"कैश TTL",close:"बंद करें",comment:"टिप्पणियां",confirmed:"✓ अंतिम",dataRefresh:"डेटा रीफ्रेश",days:"{days} दिन",daysHours:"{days} दिन {hours} घंटे",detailRanking:"विस्तृत रैंकिंग",failed:"प्राप्ति विफल",fetchFailed:`प्राप्ति विफल: {message}
फिर से प्रयास करने के लिए क्लिक करें`,fetched:"प्राप्त",fetchedAt:"प्राप्त समय",fetching:"प्राप्त किया जा रहा है...",hours:"{hours} घंटे",like:"लाइक",metrics:"मापदंड",metricsHeader:"▼ मापदंड (कच्चा / सामान्यीकृत)",mylist:"मायलिस्ट",pending:"लंबित",points:"{score} अंक",progress:"{current} / {total} शीर्षक प्राप्त ({percent}%)",rank:"रैंक",rankBadge:"{tier} - #{rank} ({score} अंक)",rankingDisplayOff:"⚪ रैंकिंग प्रदर्शन: OFF",rankingDisplayOn:"🔵 रैंकिंग प्रदर्शन: ON",rankingSettings:"Niconico रैंकिंग सेटिंग्स",refreshAll:"सभी शीर्षक फिर से प्राप्त करें",retryClick:"फिर से प्रयास करने के लिए क्लिक करें",score:"स्कोर",statusFinal:"अंतिम",statusTemporary:"अस्थायी",summary:"{status} / लक्ष्य {target} / रैंक किए गए {ranked} / विफल {failed} / लंबित {pending}",target:"लक्ष्य",temporary:"⏳ अस्थायी",title:"शीर्षक",totalScore:"कुल स्कोर: {score} अंक",unknownError:"अज्ञात त्रुटि",video:"प्रतिनिधि वीडियो",view:"दृश्य",weeks:"{weeks} सप्ताह"},es:{cacheTtl:"TTL de caché",close:"Cerrar",comment:"Comentarios",confirmed:"✓ Final",dataRefresh:"Actualización de datos",days:"{days} día(s)",daysHours:"{days} día(s) {hours} hora(s)",detailRanking:"Ranking detallado",failed:"Error",fetchFailed:`Error al obtener: {message}
Haz clic para reintentar`,fetched:"Obtenido",fetchedAt:"Obtenido a las",fetching:"Obteniendo...",hours:"{hours} hora(s)",like:"Me gusta",metrics:"Métricas",metricsHeader:"▼ Métricas (sin procesar / normalizadas)",mylist:"Mylist",pending:"Pendiente",points:"{score} pts",progress:"{current} / {total} títulos obtenidos ({percent}%)",rank:"Puesto",rankBadge:"{tier} - #{rank} ({score} pts)",rankingDisplayOff:"⚪ Mostrar ranking: OFF",rankingDisplayOn:"🔵 Mostrar ranking: ON",rankingSettings:"Configuración de ranking de Niconico",refreshAll:"Volver a obtener todos los títulos",retryClick:"Haz clic para reintentar",score:"Puntuación",statusFinal:"Final",statusTemporary:"Temporal",summary:"{status} / Objetivo {target} / Con ranking {ranked} / Fallidos {failed} / Pendientes {pending}",target:"Objetivo",temporary:"⏳ Temporal",title:"Título",totalScore:"Puntuación total: {score} pts",unknownError:"Error desconocido",video:"Video representativo",view:"Reproducciones",weeks:"{weeks} semana(s)"},fr:{cacheTtl:"TTL du cache",close:"Fermer",comment:"Commentaires",confirmed:"✓ Final",dataRefresh:"Actualisation des données",days:"{days} jour(s)",daysHours:"{days} jour(s) {hours} heure(s)",detailRanking:"Classement détaillé",failed:"Échec",fetchFailed:`Échec de récupération : {message}
Cliquez pour réessayer`,fetched:"Récupéré",fetchedAt:"Récupéré le",fetching:"Récupération...",hours:"{hours} heure(s)",like:"J'aime",metrics:"Indicateurs",metricsHeader:"▼ Indicateurs (bruts / normalisés)",mylist:"Mylist",pending:"En attente",points:"{score} pts",progress:"{current} / {total} titres récupérés ({percent}%)",rank:"Rang",rankBadge:"{tier} - n°{rank} ({score} pts)",rankingDisplayOff:"⚪ Affichage du classement : OFF",rankingDisplayOn:"🔵 Affichage du classement : ON",rankingSettings:"Paramètres du classement Niconico",refreshAll:"Récupérer tous les titres",retryClick:"Cliquez pour réessayer",score:"Score",statusFinal:"Final",statusTemporary:"Temporaire",summary:"{status} / Cible {target} / Classés {ranked} / Échecs {failed} / En attente {pending}",target:"Cible",temporary:"⏳ Temporaire",title:"Titre",totalScore:"Score total : {score} pts",unknownError:"Erreur inconnue",video:"Vidéo représentative",view:"Vues",weeks:"{weeks} semaine(s)"},ar:{cacheTtl:"مدة صلاحية التخزين المؤقت",close:"إغلاق",comment:"التعليقات",confirmed:"✓ نهائي",dataRefresh:"تحديث البيانات",days:"{days} يوم",daysHours:"{days} يوم {hours} ساعة",detailRanking:"الترتيب التفصيلي",failed:"فشل",fetchFailed:`فشل الجلب: {message}
انقر لإعادة المحاولة`,fetched:"تم الجلب",fetchedAt:"وقت الجلب",fetching:"جار الجلب...",hours:"{hours} ساعة",like:"الإعجابات",metrics:"المؤشرات",metricsHeader:"▼ المؤشرات (خام / مطبعة)",mylist:"Mylist",pending:"قيد الانتظار",points:"{score} نقطة",progress:"تم جلب {current} / {total} عنوان ({percent}%)",rank:"الترتيب",rankBadge:"{tier} - #{rank} ({score} نقطة)",rankingDisplayOff:"⚪ عرض الترتيب: OFF",rankingDisplayOn:"🔵 عرض الترتيب: ON",rankingSettings:"إعدادات ترتيب Niconico",refreshAll:"إعادة جلب كل العناوين",retryClick:"انقر لإعادة المحاولة",score:"النقاط",statusFinal:"نهائي",statusTemporary:"مؤقت",summary:"{status} / الهدف {target} / مرتبة {ranked} / فشل {failed} / انتظار {pending}",target:"الهدف",temporary:"⏳ مؤقت",title:"العنوان",totalScore:"المجموع: {score} نقطة",unknownError:"خطأ غير معروف",video:"الفيديو الممثل",view:"المشاهدات",weeks:"{weeks} أسبوع"},pt:{cacheTtl:"TTL do cache",close:"Fechar",comment:"Comentários",confirmed:"✓ Final",dataRefresh:"Atualização de dados",days:"{days} dia(s)",daysHours:"{days} dia(s) {hours} hora(s)",detailRanking:"Ranking detalhado",failed:"Falha",fetchFailed:`Falha ao buscar: {message}
Clique para tentar novamente`,fetched:"Obtido",fetchedAt:"Obtido em",fetching:"Buscando...",hours:"{hours} hora(s)",like:"Curtidas",metrics:"Métricas",metricsHeader:"▼ Métricas (brutas / normalizadas)",mylist:"Mylist",pending:"Pendente",points:"{score} pts",progress:"{current} / {total} títulos obtidos ({percent}%)",rank:"Rank",rankBadge:"{tier} - #{rank} ({score} pts)",rankingDisplayOff:"⚪ Exibição do ranking: OFF",rankingDisplayOn:"🔵 Exibição do ranking: ON",rankingSettings:"Configurações de ranking do Niconico",refreshAll:"Buscar todos os títulos novamente",retryClick:"Clique para tentar novamente",score:"Pontuação",statusFinal:"Final",statusTemporary:"Temporário",summary:"{status} / Alvo {target} / Ranqueados {ranked} / Falhas {failed} / Pendentes {pending}",target:"Alvo",temporary:"⏳ Temporário",title:"Título",totalScore:"Pontuação total: {score} pts",unknownError:"Erro desconhecido",video:"Vídeo representativo",view:"Visualizações",weeks:"{weeks} semana(s)"},bn:{cacheTtl:"ক্যাশ TTL",close:"বন্ধ করুন",comment:"মন্তব্য",confirmed:"✓ চূড়ান্ত",dataRefresh:"ডেটা রিফ্রেশ",days:"{days} দিন",daysHours:"{days} দিন {hours} ঘণ্টা",detailRanking:"বিস্তারিত র‍্যাঙ্কিং",failed:"ব্যর্থ",fetchFailed:`আনা ব্যর্থ: {message}
আবার চেষ্টা করতে ক্লিক করুন`,fetched:"আনা হয়েছে",fetchedAt:"আনার সময়",fetching:"আনা হচ্ছে...",hours:"{hours} ঘণ্টা",like:"লাইক",metrics:"মেট্রিক",metricsHeader:"▼ মেট্রিক (কাঁচা / স্বাভাবিকীকৃত)",mylist:"Mylist",pending:"অপেক্ষমাণ",points:"{score} পয়েন্ট",progress:"{current} / {total} শিরোনাম আনা হয়েছে ({percent}%)",rank:"র‍্যাঙ্ক",rankBadge:"{tier} - #{rank} ({score} পয়েন্ট)",rankingDisplayOff:"⚪ র‍্যাঙ্কিং প্রদর্শন: OFF",rankingDisplayOn:"🔵 র‍্যাঙ্কিং প্রদর্শন: ON",rankingSettings:"Niconico র‍্যাঙ্কিং সেটিংস",refreshAll:"সব শিরোনাম আবার আনুন",retryClick:"আবার চেষ্টা করতে ক্লিক করুন",score:"স্কোর",statusFinal:"চূড়ান্ত",statusTemporary:"অস্থায়ী",summary:"{status} / লক্ষ্য {target} / র‍্যাঙ্কড {ranked} / ব্যর্থ {failed} / অপেক্ষমাণ {pending}",target:"লক্ষ্য",temporary:"⏳ অস্থায়ী",title:"শিরোনাম",totalScore:"মোট স্কোর: {score} পয়েন্ট",unknownError:"অজানা ত্রুটি",video:"প্রতিনিধি ভিডিও",view:"ভিউ",weeks:"{weeks} সপ্তাহ"},ru:{cacheTtl:"TTL кэша",close:"Закрыть",comment:"Комментарии",confirmed:"✓ Итог",dataRefresh:"Обновление данных",days:"{days} дн.",daysHours:"{days} дн. {hours} ч.",detailRanking:"Подробный рейтинг",failed:"Ошибка",fetchFailed:`Не удалось получить: {message}
Нажмите, чтобы повторить`,fetched:"Получено",fetchedAt:"Получено в",fetching:"Получение...",hours:"{hours} ч.",like:"Лайки",metrics:"Метрики",metricsHeader:"▼ Метрики (сырые / нормализованные)",mylist:"Mylist",pending:"Ожидание",points:"{score} балл.",progress:"Получено {current} / {total} тайтлов ({percent}%)",rank:"Место",rankBadge:"{tier} - #{rank} ({score} балл.)",rankingDisplayOff:"⚪ Показ рейтинга: OFF",rankingDisplayOn:"🔵 Показ рейтинга: ON",rankingSettings:"Настройки рейтинга Niconico",refreshAll:"Получить все тайтлы заново",retryClick:"Нажмите, чтобы повторить",score:"Счет",statusFinal:"Итог",statusTemporary:"Временно",summary:"{status} / Цель {target} / В рейтинге {ranked} / Ошибки {failed} / Ожидание {pending}",target:"Цель",temporary:"⏳ Временно",title:"Название",totalScore:"Общий счет: {score} балл.",unknownError:"Неизвестная ошибка",video:"Представительное видео",view:"Просмотры",weeks:"{weeks} нед."},ur:{cacheTtl:"کیش TTL",close:"بند کریں",comment:"تبصرے",confirmed:"✓ حتمی",dataRefresh:"ڈیٹا ریفریش",days:"{days} دن",daysHours:"{days} دن {hours} گھنٹے",detailRanking:"تفصیلی رینکنگ",failed:"ناکام",fetchFailed:`حاصل کرنے میں ناکامی: {message}
دوبارہ کوشش کے لیے کلک کریں`,fetched:"حاصل شدہ",fetchedAt:"حاصل کرنے کا وقت",fetching:"حاصل کیا جا رہا ہے...",hours:"{hours} گھنٹے",like:"لائکس",metrics:"میٹرکس",metricsHeader:"▼ میٹرکس (خام / معمول پر)",mylist:"Mylist",pending:"زیر التوا",points:"{score} پوائنٹس",progress:"{current} / {total} عنوانات حاصل ہوئے ({percent}%)",rank:"رینک",rankBadge:"{tier} - #{rank} ({score} پوائنٹس)",rankingDisplayOff:"⚪ رینکنگ ڈسپلے: OFF",rankingDisplayOn:"🔵 رینکنگ ڈسپلے: ON",rankingSettings:"Niconico رینکنگ سیٹنگز",refreshAll:"تمام عنوانات دوبارہ حاصل کریں",retryClick:"دوبارہ کوشش کے لیے کلک کریں",score:"اسکور",statusFinal:"حتمی",statusTemporary:"عارضی",summary:"{status} / ہدف {target} / رینک شدہ {ranked} / ناکام {failed} / زیر التوا {pending}",target:"ہدف",temporary:"⏳ عارضی",title:"عنوان",totalScore:"کل اسکور: {score} پوائنٹس",unknownError:"نامعلوم خرابی",video:"نمائندہ ویڈیو",view:"ویوز",weeks:"{weeks} ہفتے"}},"en"),Le=Ja({translations:qa,defaultLocale:"ja",fallbackLocale:"en"});Le.setLocale(Le.detectBrowserLocale());const N=Le.format,g=Le.t,ue=F("dAnimeCfRanking:Settings"),$n=Ee({enabled:da(),cacheTtlHours:ge().min(qt).max(Kt)});Ee({title:U(),canonicalQuery:U(),representativeVideoId:U().nullable(),representativeVideo:Ee({videoId:U(),title:U(),postedAt:U(),uploaderType:nt(["danime","official","unknown"]),uploaderName:U()}).nullable(),metrics:Ee({viewCount:ge(),mylistCount:ge(),commentCount:ge(),likeCount:ge()}).nullable(),fetchedAt:U(),status:nt(["ok","failed","pending"]),failureReason:U().nullable()});const Tn="dAnimeCfRanking_settings";let L=null;const En=[];function Ka(){try{const e=GM_getValue(Tn,null);if(e===null)return L={...Je},L;const t=$n.safeParse(e);return t.success?(L=t.data,L):(ue.warn("Invalid settings found, using defaults",{error:t.error}),L={...Je},L)}catch(e){return ue.error("Failed to load settings",e),L={...Je},L}}function In(e){try{const t=$n.parse(e);GM_setValue(Tn,t),L=t;for(const n of En)try{n(t);}catch(r){ue.error("Settings change callback error",r);}ue.info("Settings saved",{settings:t});}catch(t){ue.error("Failed to save settings",t);}}function Ue(){return L===null?Ka():L}function Wa(e){En.push(e);}function Xa(){const e=Ue();In({...e,enabled:!e.enabled});}function Ya(){return Ue().cacheTtlHours*60*60*1e3}function Qa(){const e=Ue();GM_registerMenuCommand(e.enabled?g("rankingDisplayOn"):g("rankingDisplayOff"),()=>{Xa(),window.location.reload();}),ue.info("Menu commands registered",{enabled:e.enabled});}const R=F("dAnimeCfRanking:CacheManager");let ae=null;async function An(){return ae||new Promise((e,t)=>{const n=indexedDB.open(or,sr);n.onerror=()=>{R.error("Failed to open IndexedDB",n.error),t(n.error);},n.onsuccess=()=>{ae=n.result,R.info("IndexedDB initialized"),e(ae);},n.onupgradeneeded=r=>{const o=r.target.result;o.objectStoreNames.contains(P)&&o.deleteObjectStore(P);const s=o.createObjectStore(P,{keyPath:"title"});s.createIndex("status","status",{unique:false}),s.createIndex("fetchedAt","fetchedAt",{unique:false}),R.info("IndexedDB store created");};})}async function Be(){return ae||An()}async function ec(e){try{const t=await Be();return new Promise((n,r)=>{const i=t.transaction(P,"readonly").objectStore(P).get(e);i.onerror=()=>{R.error("Failed to get cache entry",i.error),r(i.error);},i.onsuccess=()=>{n(i.result);};})}catch(t){return R.error("getCacheEntry failed",t),null}}async function pe(e){try{const t=await Be();return new Promise((n,r)=>{const i=t.transaction(P,"readwrite").objectStore(P).put(e);i.onerror=()=>{R.error("Failed to set cache entry",i.error),r(i.error);},i.onsuccess=()=>{R.debug("Cache entry saved",{title:e.title,status:e.status}),n();};})}catch(t){R.error("setCacheEntry failed",t);}}async function tc(){try{const e=await Be();return new Promise((t,n)=>{const s=e.transaction(P,"readonly").objectStore(P).getAll();s.onerror=()=>{R.error("Failed to get all cache entries",s.error),n(s.error);},s.onsuccess=()=>{t(s.result);};})}catch(e){return R.error("getAllCacheEntries failed",e),[]}}async function nc(){try{const e=await Be();return new Promise((t,n)=>{const s=e.transaction(P,"readwrite").objectStore(P).clear();s.onerror=()=>{R.error("Failed to clear cache",s.error),n(s.error);},s.onsuccess=()=>{R.info("Cache cleared"),t();};})}catch(e){R.error("clearCache failed",e);}}function On(e){if(!e||e.status==="pending")return  false;const t=new Date(e.fetchedAt).getTime();if(isNaN(t))return  false;const r=Date.now()-t,o=Ya();return r<o}function rc(e,t){return {title:e,canonicalQuery:t,representativeVideoId:null,representativeVideo:null,metrics:null,fetchedAt:new Date().toISOString(),status:"pending",failureReason:null}}function oc(e,t){return {...e,...t,fetchedAt:new Date().toISOString(),status:"ok",failureReason:null}}function We(e,t){return {...e,fetchedAt:new Date().toISOString(),status:"failed",failureReason:t}}var sc="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",ic="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",ac="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",cc="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",uc="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z",lc="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z",rt="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z",Rn="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z";function G(e,t=24){const n=String(t),r=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}const X=F("dAnimeCfRanking:ControlPanel"),dc=`
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
`;function fc(e,t){const n=document.createElement("div");n.className="cf-ranking-control-panel-host";const r=n.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=dc,r.appendChild(o);const s=document.createElement("div");s.className="cf-ranking-panel",s.innerHTML=pc(e),r.appendChild(s);const i=s.querySelector(".toggle-switch"),a=s.querySelector(".panel-body"),c=s.querySelector(".ttl-slider"),u=s.querySelector(".ttl-value"),d=s.querySelectorAll(".ttl-preset-btn"),f=s.querySelector(".refresh-btn"),p=s.querySelector(".ranking-list-btn"),m=s.querySelector(".progress-text");let b={...e};i?.addEventListener("click",()=>{b.enabled=!b.enabled,k(),D(),t.onSettingsChange(b);}),c?.addEventListener("input",()=>{const v=parseInt(c.value,10);b.cacheTtlHours=v,J(),j();}),c?.addEventListener("change",()=>{t.onSettingsChange(b);}),d.forEach(v=>{v.addEventListener("click",()=>{const S=parseInt(v.dataset.hours??"24",10);b.cacheTtlHours=S,c&&(c.value=String(S)),J(),j(),t.onSettingsChange(b);});}),f?.addEventListener("click",()=>{t.onRefreshTrigger();}),p?.addEventListener("click",()=>{t.onOpenRankingList();});function k(){b.enabled?i?.classList.add("active"):i?.classList.remove("active");}function D(){b.enabled?a?.classList.remove("disabled"):a?.classList.add("disabled");}function J(){u&&(u.textContent=Nn(b.cacheTtlHours));}function j(){d.forEach(v=>{parseInt(v.dataset.hours??"0",10)===b.cacheTtlHours?v.classList.add("active"):v.classList.remove("active");});}return k(),D(),J(),j(),X.info("Control panel created",{settings:b}),{element:n,updateSettings(v){b={...v},c&&(c.value=String(v.cacheTtlHours)),k(),D(),J(),j();},updateProgress(v,S){if(m)if(S>0){const O=Math.round(v/S*100);m.textContent=N("progress",{current:String(v),percent:String(O),total:String(S)});}else m.textContent="";},setRefreshing(v){f&&(f.disabled=v,v?(f.classList.add("refreshing"),f.innerHTML=`${G(rt,16)} ${g("fetching")}`):(f.classList.remove("refreshing"),f.innerHTML=`${G(rt,16)} ${g("refreshAll")}`));}}}function pc(e){const t=e.enabled?"active":"",n=e.enabled?"":"disabled",r=Yn.map(o=>`<button class="ttl-preset-btn ${o.hours===e.cacheTtlHours?"active":""}" data-hours="${o.hours}">${o.label}</button>`).join("");return `
    <div class="panel-header">
      <div class="panel-title">
        ${G(cc,18)}
        <span>${g("rankingSettings")}</span>
      </div>
      <div class="toggle-container">
        <span class="toggle-label">${g("rank")}</span>
        <div class="toggle-switch ${t}" role="switch" aria-checked="${e.enabled}">
        </div>
      </div>
    </div>
    <div class="panel-body ${n}">
      <div class="control-section">
        <div class="section-title">${g("cacheTtl")}</div>
        <div class="ttl-container">
          <div class="ttl-slider-row">
            <input type="range" class="ttl-slider" 
                   min="${qt}" max="${Kt}" 
                   value="${e.cacheTtlHours}" step="1">
            <div class="ttl-value">${Nn(e.cacheTtlHours)}</div>
          </div>
          <div class="ttl-presets">
            ${r}
          </div>
        </div>
      </div>
      <div class="control-section">
        <div class="section-title">${g("dataRefresh")}</div>
        <div class="action-container">
          <button class="action-btn refresh-btn">
            ${G(rt,16)}
            ${g("refreshAll")}
          </button>
          <button class="action-btn ranking-list-btn">
            ${G(uc,16)}
            ${g("detailRanking")}
          </button>
          <div class="progress-text"></div>
        </div>
      </div>
    </div>
  `}function Nn(e){if(e<24)return N("hours",{hours:String(e)});if(e<168){const t=Math.floor(e/24),n=e%24;return n===0?N("days",{days:String(t)}):N("daysHours",{days:String(t),hours:String(n)})}else {const t=Math.floor(e/168);return N("weeks",{weeks:String(t)})}}function hc(){if(window.location.pathname.includes("shinban-")){const r=document.querySelector('.contentsWrapper > div[style*="max-width"]');if(r)return X.info("Found insertion point (shinban page): banner container"),{target:r,position:"afterend"}}const t=document.getElementById("kokuchi_txt");if(t)return X.info("Found insertion point (CF page): #kokuchi_txt"),{target:t,position:"afterend"};const n=document.querySelector(".contentsWrapper");return n?(X.info("Found insertion point (fallback): .contentsWrapper"),{target:n,position:"afterbegin"}):(X.warn("No insertion point found"),null)}function mc(e){const t=hc();return t?(t.target.insertAdjacentElement(t.position,e.element),X.info("Control panel inserted into page"),true):(X.error("Failed to find insertion point for control panel"),false)}const ne=F("dAnimeCfRanking:CardDetector"),He=[".itemModule.list[data-workid]",".itemModule.list"],gc=[".newTVtitle span",".textContainer h2 span"],bc=".check input[data-workid]",vc=".circleProgress",yc=".check",Zn="data-cf-ranking-badge",Dt="cf-ranking-badge";function ft(e){if(e.offsetParent===null){const n=window.getComputedStyle(e);if(n.display==="none")return  false;if(n.position==="fixed")return  true;let r=e.parentElement;for(;r;){if(window.getComputedStyle(r).display==="none")return  false;r=r.parentElement;}}const t=window.getComputedStyle(e);return !(t.display==="none"||t.visibility==="hidden")}function kc(){const e=new Set;for(const s of He)document.querySelectorAll(s).forEach(a=>e.add(a));const t=[],n=new Set,r=new Set;let o=0;return e.forEach(s=>{if(!ft(s)){o++;return}const i=Pe(s);i&&!n.has(i.title)&&!r.has(i.workId)&&(t.push(i),n.add(i.title),r.add(i.workId));}),ne.debug("Cards detected",{total:e.size,visible:t.length,hidden:o}),t}function _c(e){for(const t of gc){const r=e.querySelector(t)?.textContent?.trim();if(r)return r}return null}function Ln(e){const t=e.dataset.workid;if(t)return t;const n=e.querySelector(bc);return n?.dataset.workid?n.dataset.workid:null}function Pe(e){const t=Ln(e);if(!t)return null;const n=_c(e);if(!n)return ne.warn("Card has no title",{workId:t}),null;const r=wc(e);return {workId:t,title:n,element:e,insertionPoint:r}}function wc(e){const t=e.querySelector(vc),n=e.querySelector(yc);return t&&n?n:t&&t.nextElementSibling?t.nextElementSibling:n||(ne.warn("Insertion point not found",{workId:Ln(e),hasCircleProgress:!!t,hasCheck:!!n}),null)}function Me(e){return e.hasAttribute(Zn)}function Cc(e){e.setAttribute(Zn,"true");}function Sc(e){return e.filter(t=>!Me(t.element))}function Pn(e){return e instanceof HTMLElement?!!(e.classList.contains(Dt)||e.closest(`.${Dt}`)):false}function zc(e){return He.some(t=>e.matches(t))}function xc(e){const t=[];for(const n of He){const r=Array.from(e.querySelectorAll(n));t.push(...r);}return [...new Set(t)]}function $c(e){return new MutationObserver(n=>{const r=[],o=new Set;for(const s of n){if(s.type!=="childList")continue;const i=Array.from(s.addedNodes);for(const a of i){if(!(a instanceof HTMLElement)||Pn(a))continue;if(zc(a)){const u=Pe(a);u&&!Me(a)&&!o.has(u.workId)&&(r.push(u),o.add(u.workId));}xc(a).forEach(u=>{if(!Me(u)){const d=Pe(u);d&&!o.has(d.workId)&&(r.push(d),o.add(d.workId));}});}}r.length>0&&(ne.debug("New cards detected by observer",{count:r.length}),e(r));})}function Tc(e,t=document.body){e.observe(t,{childList:true,subtree:true}),ne.info("Card observer started");}function Ec(){const e=new Set;for(const t of He)document.querySelectorAll(t).forEach(r=>e.add(r));return [...e]}function Ic(e,t){let n=null;const r=new Set,o=()=>{const a=[];for(const c of r)if(e.has(c)&&ft(c)){const u=Pe(c);u&&!Me(c)&&(a.push(u),e.delete(c));}r.clear(),a.length>0&&(ne.debug("Cards became visible",{count:a.length}),t(a));},s=a=>{for(const c of e)(a.contains(c)||c.contains(a)||a===c)&&r.add(c);n!==null&&clearTimeout(n),n=setTimeout(()=>{n=null,o();},100);};return new MutationObserver(a=>{for(const c of a)if(c.type==="attributes"){const u=c.target;if(Pn(u))continue;s(u);}})}function Ac(e,t=document.body){e.observe(t,{attributes:true,attributeFilter:["style","class"],subtree:true}),ne.info("Visibility observer started");}const jt=F("dAnimeCfRanking:TitleNormalizer"),Oc={I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7,VIII:8,IX:9,X:10,XI:11,XII:12,XIII:13,XIV:14,XV:15,XVI:16,XVII:17,XVIII:18,XIX:19,XX:20},Mn=[{pattern:/[Ss]eason\s*0?(\d+)/,extractor:e=>parseInt(e[1],10)},{pattern:/(\d+)(?:st|nd|rd|th)\s*[Ss]eason/,extractor:e=>parseInt(e[1],10)},{pattern:/第0?(\d+)期/,extractor:e=>parseInt(e[1],10)},{pattern:new RegExp("(?<![第\\d])(\\d+)期(?![間])"),extractor:e=>parseInt(e[1],10)},{pattern:/[Pp]art\s*0?(\d+)/,extractor:e=>parseInt(e[1],10)},{pattern:/第0?(\d+)シリーズ/,extractor:e=>parseInt(e[1],10)},{pattern:/(\d+)(?:st|nd|rd|th)\s*シーズン/,extractor:e=>parseInt(e[1],10)},{pattern:/シーズン\s*0?(\d+)/,extractor:e=>parseInt(e[1],10)}],Fn=/(?:^|\s)(X{0,2}(?:IX|IV|V?I{0,3}))(?:\s|$|期|シーズン)/,Rc=[/続編/,/完結編/,/後編/,/前編/,/劇場版/,/OVA/,/OAD/,/特別編/,/番外編/];function Nc(e){for(const{pattern:n,extractor:r}of Mn){const o=e.match(n);if(o){const s=r(o);if(s!==null&&s>0&&s<=20)return s}}const t=e.match(Fn);if(t&&t[1]){const n=t[1].toUpperCase(),r=Oc[n];if(r!==void 0)return r}return null}function Zc(e){const t=e.trim();for(const s of Rc)if(s.test(t))return jt.debug("Skipping normalization (special pattern)",{title:e,pattern:s.source}),t;const n=Nc(t);if(n===null||new RegExp(`第0?${n}期`).test(t))return t;let r=t;for(const{pattern:s}of Mn)r=r.replace(s,"").trim();r=r.replace(Fn," ").trim(),r=r.replace(/\s+/g," ").trim(),r=r.replace(/[-\s]+$/,"").trim();const o=`${r} 第${n}期`;return jt.debug("Title normalized",{original:e,normalized:o,seasonNumber:n}),o}const Dn="https://www.nicovideo.jp",Lc=`${Dn}/search`,Pc=`${Dn}/watch`,Mc=e=>`${Pc}/${e}`,Fc=e=>`${Lc}/${encodeURIComponent(e)}`;var Dc=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const jc=e=>new Promise((t,n)=>{Dc({url:e.url,method:e.method??"GET",headers:e.headers,data:e.data,responseType:e.responseType??"text",timeout:e.timeout,onprogress:e.onprogress,onload:r=>{t({status:r.status,statusText:r.statusText,response:r.response,finalUrl:r.finalUrl,headers:r.responseHeaders});},onerror:r=>{const o=r?.error??"unknown error";n(new Error(`GM_xmlhttpRequest failed: ${o}`));},ontimeout:()=>{n(new Error("GM_xmlhttpRequest timeout"));}});}),B=F("dAnimeCfRanking:NicoApiClient"),Vc="dアニメストア ニコニコ支店";class le{searchCache=new Map;async search(t){if(!t.trim())return [];if(this.searchCache.has(t))return this.searchCache.get(t)??[];try{const n=Fc(t),r=await this.fetchText(n),o=this.parseServerResponse(r),s=this.deduplicateItems(o);return this.searchCache.set(t,s),B.debug("Search completed",{keyword:t,resultCount:s.length}),s}catch(n){return B.error("Search failed",n,{keyword:t}),[]}}async fetchMetrics(t){try{const n=Mc(t),r=await this.fetchText(n),o=this.parseWatchPageMetrics(r);return o?(B.debug("Metrics fetched",{videoId:t,metrics:o}),o):(B.warn("Failed to parse metrics from watch page",{videoId:t}),null)}catch(n){return B.error("Failed to fetch metrics",n,{videoId:t}),null}}static determineUploaderType(t,n){return t===Vc?"danime":t===n||t.startsWith(n+" ")?"official":"unknown"}static filterOfficialVideos(t,n){return t.filter(r=>{const o=le.determineUploaderType(r.ownerName,n);return o==="danime"||o==="official"})}static toRepresentativeVideo(t,n){return {videoId:t.videoId,title:t.title,postedAt:t.postedAt,uploaderType:le.determineUploaderType(t.ownerName,n),uploaderName:t.ownerName}}async fetchText(t){return (await jc({method:"GET",url:t,headers:{Accept:"text/html"}})).response}parseServerResponse(t){try{const r=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!r)return B.warn("server-response meta not found"),[];const o=r.getAttribute("content")??"",s=this.decodeHtmlEntities(o);let i;try{i=JSON.parse(s);}catch{return B.error("Failed to parse server-response JSON"),[]}return this.extractVideoItems(i)}catch(n){return B.error("parseServerResponse failed",n),[]}}parseWatchPageMetrics(t){try{const r=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!r)return null;const o=r.getAttribute("content")??"",s=this.decodeHtmlEntities(o),c=JSON.parse(s)?.data?.response?.video?.count;return c?{viewCount:c.view??0,mylistCount:c.mylist??0,commentCount:c.comment??0,likeCount:c.like??0}:null}catch(n){return B.error("parseWatchPageMetrics failed",n),null}}decodeHtmlEntities(t){if(!t)return "";let n=t.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return n=n.replace(/&#(\d+);/g,(r,o)=>String.fromCharCode(parseInt(o,10))),n=n.replace(/&#x([0-9a-fA-F]+);/g,(r,o)=>String.fromCharCode(parseInt(o,16))),n}extractVideoItems(t){const n=[],r=a=>{const c=(a?.id??a?.contentId??a?.watchId??"").toString();if(!c)return;const u=(a?.title??a?.shortTitle??"").toString();if(!u)return;const d=a?.count??{},f=Number(d.view??a?.viewCounter??0)||0,p=Number(d.comment??a?.commentCounter??0)||0,m=Number(d.mylist??a?.mylistCounter??0)||0,b=Number(d.like??a?.likeCounter??0)||0,k=a?.thumbnail??{},D=(k.nHdUrl||k.listingUrl||k.largeUrl||k.middleUrl||k.url||a?.thumbnailUrl||"").toString(),J=(a?.registeredAt||a?.startTime||a?.postedDateTime||"")?.toString?.()??"";let j="",v="user";a?.channel?.name?(j=a.channel.name,v="channel"):a?.owner&&(j=a.owner.name??a.owner.nickname??"",v=a.owner.ownerType==="channel"?"channel":"user"),a?.isChannelVideo&&(v="channel"),n.push({videoId:c,title:u,viewCount:f,commentCount:p,mylistCount:m,likeCount:b,thumbnail:D,postedAt:J,ownerName:j,ownerType:v});},i=(a,c)=>{if(c>10||n.length>=100||!a)return;if(Array.isArray(a)){for(const p of a){if(n.length>=100)return;i(p,c+1);}return}if(typeof a!="object"||a===null)return;const u=a;(u.id||u.contentId||u.watchId)&&r(u);const d=["data","items","searchResult","search","result","videos","list"],f=a;for(const p of d){if(n.length>=100)return;p in f&&i(f[p],c+1);}if(n.length===0&&c<7)for(const[p,m]of Object.entries(f)){if(n.length>=100)return;!d.includes(p)&&typeof m=="object"&&i(m,c+2);}};return i(t,0),n}deduplicateItems(t){const n=new Set,r=[];for(const o of t)o.videoId&&(n.has(o.videoId)||(n.add(o.videoId),r.push(o)));return r}}const se=F("dAnimeCfRanking:RepresentativeSelector");function Uc(e,t,n){if(e.length===0)return {success:false,video:null,failureReason:"検索結果が0件です"};const r=e.filter(a=>n.determineUploaderType(a.ownerName,t)==="danime"),o=e.filter(a=>n.determineUploaderType(a.ownerName,t)==="official"),s=Vt(r),i=Vt(o);if(se.debug("Candidate videos",{animeTitle:t,danimeCount:r.length,titleUploaderCount:o.length,danimeVideo:s?{id:s.videoId,views:s.viewCount}:null,titleVideo:i?{id:i.videoId,views:i.viewCount}:null}),s&&i){const a=s.viewCount??0,c=i.viewCount??0,u=a>=c?s:i,d=a>=c?"dAnime":"titleUploader";return se.info("Representative video selected (compared by viewCount)",{animeTitle:t,videoId:u.videoId,viewCount:u.viewCount,source:d,danimeViews:a,titleViews:c}),{success:true,video:u,failureReason:null}}return s?(se.info("Representative video selected (dAnime only)",{animeTitle:t,videoId:s.videoId,viewCount:s.viewCount}),{success:true,video:s,failureReason:null}):i?(se.info("Representative video selected (titleUploader only)",{animeTitle:t,videoId:i.videoId,viewCount:i.viewCount}),{success:true,video:i,failureReason:null}):(se.warn("No representative video found",{animeTitle:t,totalResults:e.length,danimeCount:r.length,titleUploaderCount:o.length}),{success:false,video:null,failureReason:`公式動画が見つかりませんでした（検索結果: ${e.length}件）`})}function Vt(e){if(e.length===0)return null;const t=e.filter(r=>{if(!r.postedAt)return  false;const o=new Date(r.postedAt);return !isNaN(o.getTime())});return t.length===0?(se.warn("No valid postedAt found, using first video"),e[0]):[...t].sort((r,o)=>{const s=new Date(r.postedAt).getTime(),i=new Date(o.postedAt).getTime();return s-i})[0]}const he=F("dAnimeCfRanking:FetchController");class Bc{queue=[];activeCount=0;maxConcurrent=er;apiClient;onComplete=null;processing=new Set;constructor(){this.apiClient=new le;}setOnComplete(t){this.onComplete=t;}async fetch(t,n=false){const r=Zc(t);if(!n){const o=await ec(t);if(o&&On(o))return he.debug("Cache hit",{title:t}),o}return this.processing.has(t)?new Promise((o,s)=>{this.queue.push({title:t,canonicalQuery:r,resolve:o,reject:s});}):new Promise((o,s)=>{this.queue.push({title:t,canonicalQuery:r,resolve:o,reject:s}),this.processQueue();})}async fetchBatch(t){const n=t.map(r=>this.fetch(r.title));return Promise.all(n)}processQueue(){for(;this.queue.length>0&&this.activeCount<this.maxConcurrent;){const t=this.queue.shift();if(!t)break;if(this.processing.has(t.title)){he.debug("Skipping duplicate request",{title:t.title});continue}this.processing.add(t.title),this.activeCount++,this.executeRequest(t).then(n=>{t.resolve(n),this.onComplete&&this.onComplete(t.title,n);}).catch(n=>{t.reject(n);}).finally(()=>{this.activeCount--,this.processing.delete(t.title),setTimeout(()=>this.processQueue(),0);});}}async executeRequest(t){const{title:n,canonicalQuery:r}=t,o=rc(n,r);await pe(o);try{const s=await this.apiClient.search(r);if(s.length===0){const i=await this.apiClient.search(n);if(i.length===0){const a=We(o,"検索結果が0件です");return await pe(a),a}return this.processSearchResults(o,i,n)}return this.processSearchResults(o,s,n)}catch(s){const i=s instanceof Error?s.message:"Unknown error";he.error("Fetch request failed",s,{title:n});const a=We(o,i);return await pe(a),a}}async processSearchResults(t,n,r){const o=Uc(n,r,le);if(!o.success||!o.video){const c=We(t,o.failureReason??"代表動画の選択に失敗しました");return await pe(c),c}const s=le.toRepresentativeVideo(o.video,r);let i={viewCount:o.video.viewCount,mylistCount:o.video.mylistCount,commentCount:o.video.commentCount,likeCount:o.video.likeCount};if(i.likeCount===0){const c=await this.apiClient.fetchMetrics(o.video.videoId);c&&(i=c);}const a=oc(t,{representativeVideoId:o.video.videoId,representativeVideo:s,metrics:i});return await pe(a),he.info("Fetch completed",{title:t.title,videoId:o.video.videoId,metrics:i}),a}clearQueue(){const t=[...this.queue];this.queue=[];for(const n of t)n.reject(new Error("Queue cleared"));he.info("Queue cleared",{count:t.length});}getStatus(){return {queueLength:this.queue.length,activeCount:this.activeCount}}}function Hc(){return new Bc}const Gc=F("dAnimeCfRanking:ScoreCalculator");function Jc(e){return e<=3?"S+++":e<=6?"S++":e<=10?"S+":e<=15?"S":e<=25?"A":e<=40?"B":e<=55?"C":e<=70?"D":e<=85?"E":e<=95?"F":"G"}function q(e){return Math.log10(e+1)}function qc(e){return {viewCount:q(e.viewCount),mylistCount:q(e.mylistCount),commentCount:q(e.commentCount),likeCount:q(e.likeCount)}}function Ce(e){if(e.length===0)return [];const t=Math.min(...e),n=Math.max(...e);return n===t?e.map(()=>0):e.map(r=>(r-t)/(n-t))}function Kc(e){const t=e.filter(f=>f.metrics!==null);if(t.length===0)return e.map(()=>null);const n=t.map(f=>q(f.metrics.viewCount)),r=t.map(f=>q(f.metrics.mylistCount)),o=t.map(f=>q(f.metrics.commentCount)),s=t.map(f=>q(f.metrics.likeCount)),i=Ce(n),a=Ce(r),c=Ce(o),u=Ce(s);let d=0;return e.map(f=>{if(f.metrics===null)return null;const p={viewCount:i[d],mylistCount:a[d],commentCount:c[d],likeCount:u[d]};return d++,p})}function Wc(e){return (e.viewCount+e.mylistCount+e.commentCount+e.likeCount)/4}function jn(e){const t=Kc(e),n=e.map((a,c)=>{const u=t[c];if(u===null||a.metrics===null)return {title:a.title,scoreData:null};const d=Wc(u),f=qc(a.metrics);return {title:a.title,scoreData:{totalScore:d,normalizedMetrics:u,logMetrics:f}}}),r=n.map((a,c)=>({...a,originalIndex:c})).filter(a=>a.scoreData!==null);r.sort((a,c)=>{const u=a.scoreData?.totalScore??0;return (c.scoreData?.totalScore??0)-u});const o=r.length,s=new Map;r.forEach((a,c)=>{s.set(a.originalIndex,c+1);});const i=n.map((a,c)=>{if(a.scoreData===null)return {title:a.title,rankData:null};const u=s.get(c)??0,d=o>0?u/o*100:100,f=Jc(d);return {title:a.title,rankData:{rank:u,totalCount:o,tier:f,score:a.scoreData}}});return Gc.debug("Ranks calculated",{inputCount:e.length,validCount:o}),i}const Xc=F("dAnimeCfRanking:RankBadge"),Yc={"S+++":{background:"linear-gradient(115deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 12%, rgba(255,255,255,0) 24%, rgba(255,255,255,0.55) 38%, rgba(255,255,255,0) 52%), linear-gradient(135deg, #6f4300 0%, #c98900 16%, #fff3a6 34%, #d99a00 50%, #fff8cf 64%, #b47500 78%, #f7c94a 100%)",text:"#241700",border:"#9f6a00",shadow:"inset 0 1px 0 rgba(255,255,255,0.72), inset 0 -1px 0 rgba(84,51,0,0.42), 0 1px 4px rgba(160,105,0,0.34)",textShadow:"0 1px 0 rgba(255,255,255,0.45)"},"S++":{background:"linear-gradient(115deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.3) 13%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.48) 39%, rgba(255,255,255,0) 53%), linear-gradient(135deg, #7c5200 0%, #d39a10 18%, #ffe887 34%, #c88700 50%, #fff4b8 65%, #a96b00 80%, #eeb735 100%)",text:"#241700",border:"#a16f08",shadow:"inset 0 1px 0 rgba(255,255,255,0.68), inset 0 -1px 0 rgba(86,56,0,0.4), 0 1px 4px rgba(150,100,0,0.3)",textShadow:"0 1px 0 rgba(255,255,255,0.42)"},"S+":{background:"linear-gradient(115deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.28) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.44) 40%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #8a6500 0%, #d6a619 18%, #ffe27a 34%, #be8500 50%, #fff1a8 66%, #9f7000 80%, #e4ad26 100%)",text:"#241700",border:"#a5790a",shadow:"inset 0 1px 0 rgba(255,255,255,0.64), inset 0 -1px 0 rgba(88,63,0,0.38), 0 1px 4px rgba(135,96,0,0.26)",textShadow:"0 1px 0 rgba(255,255,255,0.4)"},S:{background:"linear-gradient(115deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.26) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #957100 0%, #d1a124 18%, #ffdc6b 34%, #b98300 50%, #f7e49a 66%, #946800 80%, #d9a42a 100%)",text:"#261a00",border:"#9d750c",shadow:"inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(84,62,0,0.36), 0 1px 4px rgba(120,90,0,0.24)",textShadow:"0 1px 0 rgba(255,255,255,0.38)"},A:{background:"linear-gradient(115deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.34) 13%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.58) 39%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #777b80 0%, #c8ccd0 18%, #f7f8f8 34%, #a4a9ad 50%, #ffffff 64%, #8c9196 78%, #d8dbde 100%)",text:"#1e2328",border:"#8d9398",shadow:"inset 0 1px 0 rgba(255,255,255,0.78), inset 0 -1px 0 rgba(66,72,78,0.36), 0 1px 4px rgba(90,96,102,0.26)",textShadow:"0 1px 0 rgba(255,255,255,0.55)"},B:{background:"linear-gradient(115deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.22) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.36) 41%, rgba(255,255,255,0) 55%), linear-gradient(135deg, #5b2e10 0%, #a85d25 18%, #e0a05b 34%, #8a4519 50%, #f0be7b 66%, #6d3512 82%, #bd7430 100%)",text:"#fffaf3",border:"#7a3c15",shadow:"inset 0 1px 0 rgba(255,235,202,0.52), inset 0 -1px 0 rgba(45,22,7,0.52), 0 1px 4px rgba(95,48,17,0.32)",textShadow:"0 1px 1px rgba(45,22,7,0.72)"},C:{background:"#ffffff",text:"#333333",border:"#d7d7d7",shadow:"none",textShadow:"none"},D:{background:"#ffffff",text:"#333333",border:"#d7d7d7",shadow:"none",textShadow:"none"},E:{background:"#ffffff",text:"#333333",border:"#d7d7d7",shadow:"none",textShadow:"none"},F:{background:"#ffffff",text:"#333333",border:"#d7d7d7",shadow:"none",textShadow:"none"},G:{background:"#ffffff",text:"#333333",border:"#d7d7d7",shadow:"none",textShadow:"none"}},pt=`
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
`,Vn=`
  ${pt}
  background: #e0e0e0;
  color: #666;
  border: 1px solid #ccc;
`,Qc=`
  ${pt}
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ef9a9a;
`,eu=`
  display: inline-flex;
  vertical-align: middle;
`,tu=`
  display: inline-flex;
  vertical-align: middle;
  margin-left: 2px;
  opacity: 0.9;
`;let re=null;function Un(){return re||(re=document.createElement("div"),re.className="cf-ranking-global-tooltip",re.style.cssText=`
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
    `,document.body.appendChild(re)),re}function nu(e,t){const n=Un();n.textContent=e,n.style.display="block";const r=t.getBoundingClientRect(),o=n.getBoundingClientRect();let s=r.left+r.width/2-o.width/2,i=r.top-o.height-8;s<8&&(s=8),s+o.width>window.innerWidth-8&&(s=window.innerWidth-o.width-8),i<8&&(i=r.bottom+8),n.style.left=`${s}px`,n.style.top=`${i}px`;}function ru(){const e=Un();e.style.display="none";}function ou(e){const t=Yc[e];return `
    ${pt}
    background: ${t.background};
    color: ${t.text};
    border: 2px solid ${t.border};
    box-shadow: ${t.shadow};
    text-shadow: ${t.textShadow};
  `}function su(e){const t=document.createElement("div");return t.className="cf-ranking-badge cf-ranking-loading",t.setAttribute("style",Vn),t.innerHTML=ht(Rn),t.__cfRanking={title:e},t}function ht(e){return `<span style="${eu}">${G(e,14)}</span>`}function iu(e){return `<span style="${tu}">${G(e,12)}</span>`}function au(e,t){const n=(e.score.totalScore*100).toFixed(1),r=t?iu(ic):"";return `${N("rankBadge",{rank:String(e.rank),score:n,tier:e.tier})}${r}`}function cu(e,t,n,r,o=false){const s=e,i=s.__cfRanking?.title??n.title;if(e.onmouseenter=null,e.onmouseleave=null,e.onclick=null,n.status==="failed"||!t){e.className="cf-ranking-badge cf-ranking-error",e.setAttribute("style",Qc),e.innerHTML=ht(sc);const a=N("fetchFailed",{message:n.failureReason??g("unknownError")});s.__cfRanking={title:i,retryCallback:r,tooltipContent:a},Ut(e),r&&(e.onclick=()=>fu(s,i,r),e.style.cursor="pointer");}else {e.className="cf-ranking-badge cf-ranking-rank",e.setAttribute("style",ou(t.tier)),e.innerHTML=au(t,o),e.style.cursor="default";const a=uu(t,n,o),c=lu(a);s.__cfRanking={title:i,tooltipContent:c},Ut(e);}}function Ut(e){const t=e;e.onmouseenter=()=>{const n=t.__cfRanking?.tooltipContent;n&&nu(n,e),e.classList.contains("cf-ranking-rank")&&(e.style.transform="scale(1.1)");},e.onmouseleave=()=>{ru(),e.style.transform="scale(1)";};}function uu(e,t,n){return {rank:e.rank,totalCount:e.totalCount,tier:e.tier,totalScore:e.score.totalScore,rawMetrics:t.metrics??{viewCount:0,mylistCount:0,commentCount:0,likeCount:0},normalizedMetrics:e.score.normalizedMetrics,representativeVideo:t.representativeVideo,fetchedAt:t.fetchedAt,isRankingFinalized:n}}function lu(e){const t=[],n=e.isRankingFinalized?g("confirmed"):g("temporary");return t.push(`${N("rankBadge",{rank:String(e.rank),score:"",tier:e.tier}).replace("()","").replace("( pts)","")} / ${e.totalCount} ${g("title")} ${n}`),t.push(N("totalScore",{score:(e.totalScore*100).toFixed(1)})),t.push(""),t.push(g("metricsHeader")),t.push(`${g("view")}: ${Se(e.rawMetrics.viewCount)} / ${(e.normalizedMetrics.viewCount*100).toFixed(0)}%`),t.push(`${g("mylist")}: ${Se(e.rawMetrics.mylistCount)} / ${(e.normalizedMetrics.mylistCount*100).toFixed(0)}%`),t.push(`${g("comment")}: ${Se(e.rawMetrics.commentCount)} / ${(e.normalizedMetrics.commentCount*100).toFixed(0)}%`),t.push(`${g("like")}: ${Se(e.rawMetrics.likeCount)} / ${(e.normalizedMetrics.likeCount*100).toFixed(0)}%`),t.push(""),e.representativeVideo&&(t.push(`▼ ${g("video")}`),t.push(`${e.representativeVideo.title}`),t.push(`${Bt(e.representativeVideo.postedAt)} (${du(e.representativeVideo.uploaderType)})`)),t.push(""),t.push(`${g("fetched")}: ${Bt(e.fetchedAt)}`),t.join(`
`)}function Se(e){return e.toLocaleString("ja-JP")}function Bt(e){try{return new Date(e).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}catch{return e}}function du(e){switch(e){case "danime":return "dアニメストア ニコニコ支店";case "official":return "公式";default:return "不明"}}function fu(e,t,n){const r=Date.now(),o=e.__cfRanking?.lastRetryTime??0;if(r-o<tr){Xc.debug("Retry cooldown active",{title:t});return}e.__cfRanking&&(e.__cfRanking.lastRetryTime=r),e.className="cf-ranking-badge cf-ranking-loading",e.setAttribute("style",Vn),e.innerHTML=ht(Rn),n(t);}const Ht="cf-ranking-list-modal-host",pu=`
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
`;function hu(e,t){document.querySelector(`.${Ht}`)?.remove();const n=document.createElement("div");n.className=Ht;const r=n.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=pu,r.appendChild(o);const s=document.createElement("div");s.className="backdrop",s.innerHTML=mu(e,t),r.appendChild(s);const i=c=>{c.key==="Escape"&&a();},a=()=>{document.removeEventListener("keydown",i),n.remove();};s.addEventListener("click",c=>{c.target===s&&a();}),r.querySelector(".close-btn")?.addEventListener("click",a),document.addEventListener("keydown",i),document.body.appendChild(n);}function mu(e,t){const n=[...e].sort(gu),r=n.filter(a=>a.rankData!==null).length,o=n.filter(a=>a.cacheEntry?.status==="failed").length,s=n.length-r-o,i=g(t?"statusFinal":"statusTemporary");return `
    <section class="dialog" role="dialog" aria-modal="true" aria-label="${g("detailRanking")}">
      <header class="header">
        <div>
          <h2 class="title">${g("detailRanking")}</h2>
          <div class="summary">
            ${N("summary",{failed:String(o),pending:String(s),ranked:String(r),status:i,target:String(n.length)})}
          </div>
        </div>
        <button class="close-btn" type="button" aria-label="${g("close")}">
          ${G(ac,20)}
        </button>
      </header>
      <div class="body">
        <table>
          <thead>
            <tr>
              <th class="rank-cell">${g("rank")}</th>
              <th class="title-cell">${g("title")}</th>
              <th class="score-cell">${g("score")}</th>
              <th class="metrics-cell">${g("metrics")}</th>
              <th class="video-cell">${g("video")}</th>
              <th class="fetched-cell">${g("fetchedAt")}</th>
            </tr>
          </thead>
          <tbody>
            ${n.map(bu).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `}function gu(e,t){const n=e.rankData?.rank??Number.MAX_SAFE_INTEGER,r=t.rankData?.rank??Number.MAX_SAFE_INTEGER;return n!==r?n-r:e.title.localeCompare(t.title,"ja-JP")}function bu(e){const t=e.rankData,n=e.cacheEntry,r=n?.metrics;return `
    <tr>
      <td class="rank-cell">${vu(t,n)}</td>
      <td class="title-cell"><div class="title-text">${Y(e.title)}</div></td>
      <td class="score-cell">${t?N("points",{score:(t.score.totalScore*100).toFixed(1)}):'<span class="muted">-</span>'}</td>
      <td class="metrics-cell">${r?yu(r):'<span class="muted">-</span>'}</td>
      <td class="video-cell">${ku(n)}</td>
      <td class="fetched-cell">${n?Bn(n.fetchedAt):`<span class="muted">${g("pending")}</span>`}</td>
    </tr>
  `}function vu(e,t){return e?`
      <span class="rank">
        <span class="tier">${Y(e.tier)}</span>
        ${N("rankBadge",{rank:String(e.rank),score:"",tier:Y(e.tier)}).replace("()","").replace("( pts)","")}
      </span>
    `:t?.status==="failed"?`<span class="muted">${g("failed")}</span>`:`<span class="muted">${g("pending")}</span>`}function yu(e){return `
    <div class="metrics-grid">
      <span><span class="metric-label">${g("view")}</span> ${ze(e.viewCount)}</span>
      <span><span class="metric-label">${g("comment")}</span> ${ze(e.commentCount)}</span>
      <span><span class="metric-label">${g("mylist")}</span> ${ze(e.mylistCount)}</span>
      <span><span class="metric-label">${g("like")}</span> ${ze(e.likeCount)}</span>
    </div>
  `}function ku(e){const t=e?.representativeVideo;if(!t)return e?.failureReason?`<span class="muted">${Y(e.failureReason)}</span>`:'<span class="muted">-</span>';const n=`https://www.nicovideo.jp/watch/${encodeURIComponent(t.videoId)}`;return `
    <div class="video-title">${Y(t.title)}</div>
    <div class="muted">${Y(t.uploaderName)} / ${Bn(t.postedAt)}</div>
    <a class="video-link" href="${n}" target="_blank" rel="noopener noreferrer">
      ${G(lc,14)}
      ${Y(t.videoId)}
    </a>
  `}function ze(e){return e.toLocaleString("ja-JP")}function Bn(e){try{return new Date(e).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}catch{return e}}function Y(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}const $=F("dAnimeCfRanking");let _=[];const T=new Map,fe=new Map;let M=null,Gt=null,mt=null,Jt=null,Xe=null,Ye=false,xe=null;const Ie=new Set;let Hn=false,H=null,$e=false;const oe=new Set;let Ae=0,Te=null,V=false;async function _u(){$.info("d-anime-cf-ranking starting..."),console.log("[CF-RANKING DEBUG] === 初期化開始 ===");const e=Ue();if(Qa(),await An(),H=fc(e,{onSettingsChange:Iu,onRefreshTrigger:Au,onOpenRankingList:Nu}),mc(H),Wa(n=>{H?.updateSettings(n),Ru(n.enabled);}),!e.enabled){$.info("Ranking display is disabled");return}await Cu(),console.log("[CF-RANKING DEBUG] キャッシュ読み込み後:",{cacheEntryMapSize:T.size,cacheEntryTitles:Array.from(T.keys()).slice(0,10)}),M=Hc(),M.setOnComplete(ye);const t=Ec();_=await wu(),$.info("Cards detected",{count:_.length});for(const n of t)ft(n)||oe.add(n);if(console.log("[CF-RANKING DEBUG] カード検出:",{domTotal:t.length,visibleCards:_.length,hiddenCards:oe.size,cardTitles:_.map(n=>n.title).slice(0,10)}),_.length===0&&oe.size===0){$.warn("No cards found");return}Kn(_),console.log("[CF-RANKING DEBUG] バッジ挿入後:",{badgeMapSize:fe.size}),zu();for(const n of _)mt?.observe(n.element);Gt=$c(qn),Tc(Gt),oe.size>0&&(Jt=Ic(oe,Tu),Ac(Jt),$.info("Visibility observer started for hidden cards",{count:oe.size})),Hn=true,setTimeout(()=>{Jn();},500),setTimeout(()=>{Gn();},2e3),$.info("d-anime-cf-ranking initialized"),console.log("[CF-RANKING DEBUG] === 初期化完了 ===");}async function wu(){for(let n=0;n<30;n++){const r=kc();if(r.length>0)return r;await new Promise(o=>setTimeout(o,500));}return []}async function Cu(){try{const e=await tc();let t=0,n=0;for(const r of e)On(r)?(T.set(r.title,r),t++):n++;$.info("Loaded cached entries",{total:e.length,valid:t}),console.log("[CF-RANKING DEBUG] キャッシュ読み込み詳細:",{totalInIndexedDB:e.length,validEntries:t,invalidEntries:n,titles:e.map(r=>r.title).slice(0,20)});}catch(e){$.error("Failed to load cached entries",e);}}function Gn(){if(!M)return;console.log("[CF-RANKING DEBUG] === バックグラウンドフェッチ開始 ==="),console.log("[CF-RANKING DEBUG] allCards:",_.length),console.log("[CF-RANKING DEBUG] cacheEntryMap:",T.size);const e=_.filter(r=>T.has(r.title)),t=_.filter(r=>!T.has(r.title));if(console.log("[CF-RANKING DEBUG] キャッシュ状況:",{cached:e.length,uncached:t.length,uncachedTitles:t.map(r=>r.title).slice(0,10)}),t.length===0&&_.length>0){V=true,$.info("All cards cached, ranking finalized immediately"),console.log("[CF-RANKING DEBUG] 全カードキャッシュ済み - 即時確定"),Ge();return}Ae=0,ot();}function ot(){Te!==null&&clearTimeout(Te),Te=setTimeout(()=>{Te=null,Su();},300);}function Su(){if(!M||Ae>=_.length){V||(V=true,$.info("Ranking finalized",{total:T.size}),console.log("[CF-RANKING DEBUG] === フェッチ完了・順位確定 ==="),console.log("[CF-RANKING DEBUG] 最終状態:",{allCards:_.length,cacheEntryMap:T.size,badgeMap:fe.size}),Ge());return}const e=_[Ae];if(Ae++,!e||T.has(e.title)){ot();return}M.fetch(e.title).then(t=>{ye(e.title,t);}).catch(()=>{}).finally(()=>{ot();});}function zu(){mt=new IntersectionObserver(e=>{if(!Hn)return;let t=false;for(const n of e){const r=n.target,o=Ie.has(r),s=n.isIntersecting;o!==s&&(t=true,s?Ie.add(r):Ie.delete(r));}t&&xu();},{root:null,rootMargin:"50px",threshold:0});}function xu(){xe!==null&&clearTimeout(xe),xe=setTimeout(()=>{xe=null,Jn();},rr);}function Jn(){if(!M)return;const n=_.filter(r=>Ie.has(r.element)).slice(0,Qn).filter(r=>!T.has(r.title));if(n.length!==0)for(const r of n)M.fetch(r.title).then(o=>{ye(r.title,o);}).catch(o=>{$.error("Fetch failed",o,{title:r.title});});}function ye(e,t){T.has(e)||(T.set(e,t),$u());}function $u(){Ye=true,Xe===null&&(Xe=setTimeout(()=>{Xe=null,Ye&&(Ye=false,Ge());},nr));}function qn(e){console.log("[CF-RANKING DEBUG] === 新しいカード検出 ==="),console.log("[CF-RANKING DEBUG] 検出されたカード:",e.length);const t=new Set(_.map(o=>o.title)),n=e.filter(o=>!t.has(o.title)),r=e.filter(o=>t.has(o.title));if(console.log("[CF-RANKING DEBUG] 重複チェック:",{total:e.length,unique:n.length,duplicates:r.length,duplicateTitles:r.map(o=>o.title)}),n.length!==0){_=[..._,...n],console.log("[CF-RANKING DEBUG] allCards更新後:",_.length),Kn(n);for(const o of n)mt?.observe(o.element);V&&(V=false,Gn());}}function Tu(e){console.log("[CF-RANKING DEBUG] === カードが表示状態に変更 ==="),console.log("[CF-RANKING DEBUG] 新しく表示されたカード:",e.length),console.log("[CF-RANKING DEBUG] タイトル:",e.map(t=>t.title)),qn(e);}function Kn(e){const t=Sc(e);for(const n of t){if(!n.insertionPoint)continue;const r=su(n.title);n.insertionPoint.parentElement?.insertBefore(r,n.insertionPoint),fe.set(n.title,r),Cc(n.element);}}function Ge(){console.log("[CF-RANKING DEBUG] === 順位再計算 ===");const e=_.map(u=>{const d=T.get(u.title);return {title:u.title,metrics:d?.status==="ok"?d.metrics:null}}),t=e.filter(u=>u.metrics!==null);console.log("[CF-RANKING DEBUG] 順位計算入力:",{totalInputs:e.length,validInputs:t.length,invalidInputs:e.length-t.length,isRankingFinalized:V});const n=jn(e),r=n.filter(u=>u.rankData!==null),o=r.map(u=>u.rankData?.rank??0);console.log("[CF-RANKING DEBUG] 順位計算結果:",{totalOutputs:n.length,validRanks:r.length,minRank:Math.min(...o),maxRank:Math.max(...o),totalCount:r[0]?.rankData?.totalCount});let s=0,i=0,a=0,c=0;for(const u of n){const d=fe.get(u.title),f=T.get(u.title);if(!d){i++;continue}if(!f){a++;continue}if(f.status==="pending"){c++;continue}cu(d,u.rankData,f,Eu,V),s++;}console.log("[CF-RANKING DEBUG] バッジ更新結果:",{updated:s,skippedNoBadge:i,skippedNoEntry:a,skippedPending:c});}function Eu(e){M&&(T.delete(e),M.fetch(e,true).then(t=>{ye(e,t);}).catch(t=>{$.error("Retry failed",t,{title:e});}));}function Iu(e){$.info("Settings changed",{settings:e}),In(e);}async function Au(){if($e||!M){$.warn("Refresh already in progress or fetch controller not ready");return}$.info("Manual refresh triggered"),console.log("[CF-RANKING DEBUG] === マニュアル再調査開始 ==="),$e=true,H?.setRefreshing(true);try{await nc(),T.clear(),Ou(),V=!1;let e=0;const t=_.length;H?.updateProgress(e,t);for(const n of _){if(!$e)break;try{const r=await M.fetch(n.title,!0);ye(n.title,r),e++,H?.updateProgress(e,t);}catch(r){$.error("Refresh fetch failed",r,{title:n.title}),e++,H?.updateProgress(e,t);}await new Promise(r=>setTimeout(r,300));}V=!0,Ge(),$.info("Manual refresh completed",{total:e}),console.log("[CF-RANKING DEBUG] === マニュアル再調査完了 ===");}catch(e){$.error("Manual refresh failed",e);}finally{$e=false,H?.setRefreshing(false),H?.updateProgress(0,0);}}function Ou(){for(const e of fe.values())e.className="cf-ranking-badge cf-ranking-loading",e.setAttribute("style",`
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
    `),e.innerHTML='<span style="display: inline-flex; vertical-align: middle;"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z"/></svg></span>';}function Ru(e){for(const t of fe.values())t.style.display=e?"inline-flex":"none";}function Nu(){const e=_.map(o=>{const s=T.get(o.title);return {title:o.title,metrics:s?.status==="ok"?s.metrics:null}}),t=jn(e),n=new Map(t.map(o=>[o.title,o.rankData])),r=_.map(o=>({title:o.title,rankData:n.get(o.title)??null,cacheEntry:T.get(o.title)??null}));hu(r,V);}_u().catch(e=>{$.error("d-anime-cf-ranking failed to initialize",e);});

})();