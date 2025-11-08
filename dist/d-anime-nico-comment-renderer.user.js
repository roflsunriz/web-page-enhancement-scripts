// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      6.11.4
// @author       roflsunriz
// @description  Render NicoNico style comments on dAnime Store player.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animestore.docomo.ne.jp
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/d-anime-nico-comment-renderer.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/d-anime-nico-comment-renderer.meta.js
// @match        https://animestore.docomo.ne.jp/animestore/sc_d_pc*
// @match        https://animestore.docomo.ne.jp/animestore/mp_viw_pc*
// @connect      nicovideo.jp
// @connect      *.nicovideo.jp
// @connect      public.nvcomment.nicovideo.jp
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const At={debug:"debug",info:"info",warn:"warn",error:"error"},z=o=>{const t=`[${o}]`,e={};return Object.keys(At).forEach(n=>{const i=At[n];e[n]=(...r)=>{(console[i]??console.log)(t,...r);};}),e};function vt(){return typeof unsafeWindow<"u"?unsafeWindow:window}const Vt={debug:0,info:1,warn:2,error:3},be=(o,t,e)=>{const n=[`[${t}]`,...e];switch(o){case "debug":console.debug(...n);break;case "info":console.info(...n);break;case "warn":console.warn(...n);break;case "error":console.error(...n);break;default:console.log(...n);}},Zt=(o,t={})=>{const{level:e="info",emitter:n=be}=t,i=Vt[e],r=(s,a)=>{Vt[s]<i||n(s,o,a);};return {debug:(...s)=>r("debug",s),info:(...s)=>r("info",s),warn:(...s)=>r("warn",s),error:(...s)=>r("error",s)}},ye={small:.8,medium:1,big:1.4},ve={defont:'"MS PGothic","Hiragino Kaku Gothic ProN","Hiragino Kaku Gothic Pro","Yu Gothic UI","Yu Gothic","Meiryo","Segoe UI","Osaka","Noto Sans CJK JP","Noto Sans JP","Source Han Sans JP","IPAPGothic","TakaoPGothic","Roboto","Helvetica Neue","Helvetica","Arial","sans-serif"',gothic:'"Noto Sans CJK JP","Noto Sans JP","Source Han Sans JP","Yu Gothic","Yu Gothic Medium","Meiryo","MS PGothic","Hiragino Kaku Gothic ProN","Segoe UI","Helvetica","Arial","sans-serif"',mincho:'"MS PMincho","MS Mincho","Hiragino Mincho ProN","Hiragino Mincho Pro","Yu Mincho","Noto Serif CJK JP","Noto Serif JP","Source Han Serif JP","Times New Roman","serif"'},Qt={white:"#FFFFFF",red:"#FF0000",pink:"#FF8080",orange:"#FF9900",yellow:"#FFFF00",green:"#00FF00",cyan:"#00FFFF",blue:"#0000FF",purple:"#C000FF",black:"#000000",white2:"#CC9",red2:"#C03",pink2:"#F3C",orange2:"#F60",yellow2:"#990",green2:"#0C6",cyan2:"#0CC",blue2:"#39F",purple2:"#63C",black2:"#666"},xt=/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,xe=/^[,.:;]+/,Se=/[,.:;]+$/,we=o=>{const t=o.trim();return t?xt.test(t)?t:t.replace(xe,"").replace(Se,""):""},Ce=o=>xt.test(o)?o.toUpperCase():null,te=o=>{const t=o.trim();if(!t)return null;const e=t.toLowerCase().endsWith("px")?t.slice(0,-2):t,n=Number.parseFloat(e);return Number.isFinite(n)?n:null},Me=o=>{const t=o.trim();if(!t)return null;if(t.endsWith("%")){const e=Number.parseFloat(t.slice(0,-1));return Number.isFinite(e)?e/100:null}return te(t)},Ee=o=>Number.isFinite(o)?Math.min(100,Math.max(-100,o)):0,ke=o=>!Number.isFinite(o)||o===0?1:Math.min(5,Math.max(.25,o)),Te=o=>o==="naka"||o==="ue"||o==="shita",Ae=o=>o==="small"||o==="medium"||o==="big",Ve=o=>o==="defont"||o==="gothic"||o==="mincho",Le=o=>o in Qt,Re=(o,t)=>{let e="naka",n="medium",i="defont",r=null,s=1,a=null,c=false,l=0,h=1;for(const p of o){const f=we(typeof p=="string"?p:"");if(!f)continue;if(xt.test(f)){const y=Ce(f);if(y){r=y;continue}}const g=f.toLowerCase();if(Te(g)){e=g;continue}if(Ae(g)){n=g;continue}if(Ve(g)){i=g;continue}if(Le(g)){r=Qt[g].toUpperCase();continue}if(g==="_live"){a=.5;continue}if(g==="invisible"){s=0,c=true;continue}if(g.startsWith("ls:")||g.startsWith("letterspacing:")){const y=f.indexOf(":");if(y>=0){const C=te(f.slice(y+1));C!==null&&(l=Ee(C));}continue}if(g.startsWith("lh:")||g.startsWith("lineheight:")){const y=f.indexOf(":");if(y>=0){const C=Me(f.slice(y+1));C!==null&&(h=ke(C));}continue}}const u=Math.max(0,Math.min(1,s)),m=(r??t.defaultColor).toUpperCase(),d=typeof a=="number"?Math.max(0,Math.min(1,a)):null;return {layout:e,size:n,sizeScale:ye[n],font:i,fontFamily:ve[i],resolvedColor:m,colorOverride:r,opacityMultiplier:u,opacityOverride:d,isInvisible:c,letterSpacing:l,lineHeight:h}},ee=5,P={enabled:false,maxLogsPerCategory:ee},rt=new Map,Ie=o=>{if(o===void 0||!Number.isFinite(o))return ee;const t=Math.max(1,Math.floor(o));return Math.min(1e4,t)},Fe=o=>{P.enabled=!!o.enabled,P.maxLogsPerCategory=Ie(o.maxLogsPerCategory),P.enabled||rt.clear();},D=()=>P.enabled,Pe=o=>{const t=rt.get(o)??0;return t>=P.maxLogsPerCategory?(t===P.maxLogsPerCategory&&(console.debug(`[CommentOverlay][${o}]`,"Further logs suppressed."),rt.set(o,t+1)),false):(rt.set(o,t+1),true)},M=(o,...t)=>{P.enabled&&Pe(o)&&console.debug(`[CommentOverlay][${o}]`,...t);},_=(o,t=32)=>o.length<=t?o:`${o.slice(0,t)}…`,De=o=>{P.enabled&&o.length!==0&&(console.group(`[CommentOverlay][ghost-detection] Detected ${o.length} ghost comment(s)`),o.forEach((t,e)=>{console.log(`#${e+1}:`,`"${_(t.text)}"`,`vpos=${t.vposMs}ms`,`epoch=${t.epochId}`,`reason=${t.reason}`);}),console.groupEnd());},_e=(o,t)=>{P.enabled&&(console.group(`[CommentOverlay][state-dump] ${o}`),console.table({"Current Time":`${t.currentTime.toFixed(2)}ms`,Duration:`${t.duration.toFixed(2)}ms`,"Is Playing":t.isPlaying,"Epoch ID":t.epochId,"Total Comments":t.totalComments,"Active Comments":t.activeComments,"Reserved Lanes":t.reservedLanes,"Final Phase":t.finalPhaseActive,"Playback Begun":t.playbackHasBegun,"Is Stalled":t.isStalled}),console.groupEnd());},He=(o,t,e)=>{P.enabled&&M("epoch-change",`Epoch changed: ${o} → ${t} (reason: ${e})`);},lt=Zt("CommentEngine:Comment"),Lt=new WeakMap,Oe=o=>{let t=Lt.get(o);return t||(t=new Map,Lt.set(o,t)),t},Z=(o,t)=>{if(!o)return 0;const e=`${o.font??""}::${t}`,n=Oe(o),i=n.get(e);if(i!==void 0)return i;const r=o.measureText(t).width;return n.set(e,r),r},B=4e3,ze=/^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i,Rt=8,Ne=12,F=o=>!Number.isFinite(o)||o<=0?0:o>=1?1:o,Q=o=>o.length===1?o.repeat(2):o,O=o=>Number.parseInt(o,16),It=(o,t)=>{const e=ze.exec(o);if(!e)return o;const n=e[1];let i,r,s,a=1;n.length===3||n.length===4?(i=O(Q(n[0])),r=O(Q(n[1])),s=O(Q(n[2])),n.length===4&&(a=O(Q(n[3]))/255)):(i=O(n.slice(0,2)),r=O(n.slice(2,4)),s=O(n.slice(4,6)),n.length===8&&(a=O(n.slice(6,8))/255));const c=F(a*F(t));return `rgba(${i}, ${r}, ${s}, ${c})`},$e=()=>({now:()=>typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now()}),ne=()=>$e(),We=o=>o==="ltr"?"ltr":"rtl",qe=o=>o==="ltr"?1:-1;class v{text;vposMs;commands;layout;isScrolling;sizeScale;opacityMultiplier;opacityOverride;colorOverride;isInvisible;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily;opacity;activationTimeMs=null;staticExpiryTimeMs=null;isActive=false;hasShown=false;isPaused=false;lastUpdateTime=0;reservationWidth=0;bufferWidth=0;visibleDurationMs=0;totalDurationMs=0;preCollisionDurationMs=0;speedPixelsPerMs=0;virtualStartX=0;exitThreshold=0;scrollDirection="rtl";renderStyle="outline-only";creationIndex=0;letterSpacing=0;lineHeightMultiplier=1;lineHeightPx=0;lines=[];epochId=0;directionSign=-1;timeSource;lastSyncedSettingsVersion=-1;cachedTexture=null;textureCacheKey="";constructor(t,e,n,i,r={}){if(typeof t!="string")throw new Error("Comment text must be a string");if(!Number.isFinite(e)||e<0)throw new Error("Comment vposMs must be a non-negative number");this.text=t,this.vposMs=e,this.commands=Array.isArray(n)?[...n]:[];const s=Re(this.commands,{defaultColor:i.commentColor});this.layout=s.layout,this.isScrolling=this.layout==="naka",this.sizeScale=s.sizeScale,this.opacityMultiplier=s.opacityMultiplier,this.opacityOverride=s.opacityOverride,this.colorOverride=s.colorOverride,this.isInvisible=s.isInvisible,this.fontFamily=s.fontFamily,this.color=s.resolvedColor,this.opacity=this.getEffectiveOpacity(i.commentOpacity),this.renderStyle=i.renderStyle,this.letterSpacing=s.letterSpacing,this.lineHeightMultiplier=s.lineHeight,this.timeSource=r.timeSource??ne(),this.applyScrollDirection(i.scrollDirection),this.syncWithSettings(i,r.settingsVersion);}prepare(t,e,n,i){try{if(!t)throw new Error("Canvas context is required");if(!Number.isFinite(e)||!Number.isFinite(n))throw new Error("Canvas dimensions must be numbers");if(!i)throw new Error("Prepare options are required");const r=Math.max(e,1),s=Math.max(24,Math.floor(n*.05)),a=Math.max(24,Math.floor(s*this.sizeScale));this.fontSize=a,t.font=`${this.fontSize}px ${this.fontFamily}`;const c=this.text.includes(`
`)?this.text.split(/\r?\n/):[this.text];this.lines=c.length>0?c:[""],this.updateTextMetrics(t);const l=!this.isScrolling&&(this.layout==="ue"||this.layout==="shita");if(l){const L=Math.max(1,r-Rt*2);if(this.width>L){const H=Math.max(Ne,Math.min(this.fontSize,Math.floor(s*.6))),ot=L/Math.max(this.width,1),K=Math.max(H,Math.floor(this.fontSize*Math.min(ot,1)));K<this.fontSize&&(this.fontSize=K,t.font=`${this.fontSize}px ${this.fontFamily}`,this.updateTextMetrics(t));let kt=0;for(;this.width>L&&this.fontSize>H&&kt<5;){const fe=L/Math.max(this.width,1),Tt=Math.max(H,Math.floor(this.fontSize*Math.max(fe,.7)));Tt>=this.fontSize?this.fontSize=Math.max(H,this.fontSize-1):this.fontSize=Tt,t.font=`${this.fontSize}px ${this.fontFamily}`,this.updateTextMetrics(t),kt+=1;}}}if(!this.isScrolling){this.bufferWidth=0;const L=l?Rt:0,H=Math.max((r-this.width)/2,L),ot=Math.max(L,r-this.width-L),K=Math.min(H,Math.max(ot,L));this.virtualStartX=K,this.x=K,this.baseSpeed=0,this.speed=0,this.speedPixelsPerMs=0,this.visibleDurationMs=B,this.preCollisionDurationMs=B,this.totalDurationMs=B,this.reservationWidth=this.width,this.staticExpiryTimeMs=this.vposMs+B,this.lastUpdateTime=this.timeSource.now(),this.isPaused=!1;return}this.staticExpiryTimeMs=null;const h=Z(t,"??".repeat(150)),u=this.width*Math.max(i.bufferRatio,0);this.bufferWidth=Math.max(i.baseBufferPx,u);const m=Math.max(i.entryBufferPx,this.bufferWidth),d=this.scrollDirection,p=d==="rtl"?r+i.virtualExtension:-this.width-this.bufferWidth-i.virtualExtension,f=d==="rtl"?-this.width-this.bufferWidth-m:r+m,g=d==="rtl"?r+m:-m,y=d==="rtl"?p+this.width+this.bufferWidth:p-this.bufferWidth;this.virtualStartX=p,this.x=p,this.exitThreshold=f;const C=r>0?this.width/r:0,w=i.maxVisibleDurationMs===i.minVisibleDurationMs;let E=i.maxVisibleDurationMs;if(!w&&C>1){const L=Math.min(C,i.maxWidthRatio),H=i.maxVisibleDurationMs/Math.max(L,1);E=Math.max(i.minVisibleDurationMs,Math.floor(H));}const S=r+this.width+this.bufferWidth+m,N=Math.max(E,1),$=S/N,G=$*1e3/60;this.baseSpeed=G,this.speed=this.baseSpeed,this.speedPixelsPerMs=$;const at=Math.abs(f-p),pe=d==="rtl"?Math.max(0,y-g):Math.max(0,g-y),Et=Math.max($,Number.EPSILON);this.visibleDurationMs=E,this.preCollisionDurationMs=Math.max(0,Math.ceil(pe/Et)),this.totalDurationMs=Math.max(this.preCollisionDurationMs,Math.ceil(at/Et));const ge=this.width+this.bufferWidth+m;this.reservationWidth=Math.min(h,ge),this.lastUpdateTime=this.timeSource.now(),this.isPaused=!1;}catch(r){throw lt.error("Comment.prepare",r,{text:this.text,visibleWidth:e,canvasHeight:n,hasContext:!!t}),r}}update(t=1,e=false){try{if(!this.isActive){this.isPaused=e;return}const n=this.timeSource.now();if(!this.isScrolling){this.isPaused=e,this.lastUpdateTime=n;return}if(e){this.isPaused=!0,this.lastUpdateTime=n;return}const i=(n-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*t,this.x+=this.speed*i*this.directionSign,(this.scrollDirection==="rtl"&&this.x<=this.exitThreshold||this.scrollDirection==="ltr"&&this.x>=this.exitThreshold)&&(this.isActive=!1),this.lastUpdateTime=n,this.isPaused=!1;}catch(n){lt.error("Comment.update",n,{text:this.text,playbackRate:t,isPaused:e,isActive:this.isActive});}}generateTextureCacheKey(){return `v2::${this.text}::${this.fontSize}::${this.fontFamily}::${this.color}::${this.opacity}::${this.renderStyle}::${this.letterSpacing}::${this.lines.length}`}static cacheStats={hits:0,misses:0,creates:0,fallbacks:0,outlineCallsInCache:0,fillCallsInCache:0,outlineCallsInFallback:0,fillCallsInFallback:0,letterSpacingComments:0,normalComments:0,multiLineComments:0,totalCharactersDrawn:0,lastReported:0};static reportCacheStats(){if(!D())return;const t=performance.now();if(t-v.cacheStats.lastReported>5e3){const e=v.cacheStats.hits+v.cacheStats.misses,n=e>0?v.cacheStats.hits/e*100:0,i=v.cacheStats.creates>0?(v.cacheStats.totalCharactersDrawn/v.cacheStats.creates).toFixed(1):"0",r=v.cacheStats.outlineCallsInCache+v.cacheStats.outlineCallsInFallback,s=v.cacheStats.fillCallsInCache+v.cacheStats.fillCallsInFallback;console.log("[TextureCache Stats]",`
  Cache: Hits=${v.cacheStats.hits}, Misses=${v.cacheStats.misses}, Hit Rate=${n.toFixed(1)}%`,`
  Creates: ${v.cacheStats.creates}, Fallbacks: ${v.cacheStats.fallbacks}`,`
  Comments: Normal=${v.cacheStats.normalComments}, LetterSpacing=${v.cacheStats.letterSpacingComments}, MultiLine=${v.cacheStats.multiLineComments}`,`
  Draw Calls: Outline=${r}, Fill=${s}`,`
  Avg Characters/Comment: ${i}`),v.cacheStats.lastReported=t;}}isOffscreenCanvasSupported(){return typeof OffscreenCanvas<"u"}createTextureCanvas(t){if(!this.isOffscreenCanvasSupported())return null;const e=Math.abs(this.letterSpacing)>=Number.EPSILON,n=this.lines.length>1;e&&v.cacheStats.letterSpacingComments++,n&&v.cacheStats.multiLineComments++,!e&&!n&&v.cacheStats.normalComments++,v.cacheStats.totalCharactersDrawn+=this.text.length;const i=Math.max(10,this.fontSize*.5),r=Math.ceil(this.width+i*2),s=Math.ceil(this.height+i*2),a=new OffscreenCanvas(r,s),c=a.getContext("2d");if(!c)return null;c.save(),c.font=`${this.fontSize}px ${this.fontFamily}`;const l=F(this.opacity),h=i,u=this.lines.length>0?this.lines:[this.text],m=this.lines.length>1&&this.lineHeightPx>0?this.lineHeightPx:this.fontSize,d=i+this.fontSize,p=this.createSegmentDrawer(c,t,"cache",h),f=this.getOutlineOffsets(),g=()=>{const w=F(l*.6);c.save(),c.fillStyle=`rgba(0, 0, 0, ${w})`;for(const[E,S]of f)u.forEach((N,$)=>{const G=d+$*m+S;p(N,G,"outline",E);});c.restore();},y=w=>{c.save(),c.fillStyle=w,u.forEach((E,S)=>{const N=d+S*m;p(E,N,"fill");}),c.restore();};if(g(),this.renderStyle==="classic"){const w=Math.max(1,this.fontSize*.04),E=this.fontSize*.18;[{offsetXMultiplier:.9,offsetYMultiplier:1.1,blurMultiplier:.55,alpha:.52,rgb:"20, 28, 40"},{offsetXMultiplier:2.4,offsetYMultiplier:2.7,blurMultiplier:1.45,alpha:.32,rgb:"0, 0, 0"},{offsetXMultiplier:-0.7,offsetYMultiplier:-0.6,blurMultiplier:.4,alpha:.42,rgb:"255, 255, 255"}].forEach(S=>{const N=F(S.alpha*l);c.save(),c.shadowColor=`rgba(${S.rgb}, ${N})`,c.shadowBlur=E*S.blurMultiplier,c.shadowOffsetX=w*S.offsetXMultiplier,c.shadowOffsetY=w*S.offsetYMultiplier,c.fillStyle="rgba(0, 0, 0, 0)",u.forEach(($,G)=>{const at=d+G*m;p($,at,"fill");}),c.restore();});}const C=It(this.color,l);return y(C),c.restore(),a}draw(t,e=null){try{if(!this.isActive||!t)return;const n=this.generateTextureCacheKey();if(this.textureCacheKey!==n||!this.cachedTexture?(v.cacheStats.misses++,v.cacheStats.creates++,this.cachedTexture=this.createTextureCanvas(t),this.textureCacheKey=n):v.cacheStats.hits++,this.cachedTexture){const p=e??this.x,f=Math.max(10,this.fontSize*.5);t.drawImage(this.cachedTexture,p-f,this.y-f),v.reportCacheStats();return}v.cacheStats.fallbacks++,t.save(),t.font=`${this.fontSize}px ${this.fontFamily}`;const i=F(this.opacity),r=e??this.x,s=this.lines.length>0?this.lines:[this.text],a=this.lines.length>1&&this.lineHeightPx>0?this.lineHeightPx:this.fontSize,c=this.y+this.fontSize,l=this.createSegmentDrawer(t,t,"fallback",r),h=this.getOutlineOffsets(),u=()=>{const p=F(i*.6);t.save(),t.fillStyle=`rgba(0, 0, 0, ${p})`;for(const[f,g]of h)s.forEach((y,C)=>{const w=c+C*a+g;l(y,w,"outline",f);});t.restore();},m=p=>{t.save(),t.fillStyle=p,s.forEach((f,g)=>{const y=c+g*a;l(f,y,"fill");}),t.restore();};if(u(),this.renderStyle==="classic"){const p=Math.max(1,this.fontSize*.04),f=this.fontSize*.18;[{offsetXMultiplier:.9,offsetYMultiplier:1.1,blurMultiplier:.55,alpha:.52,rgb:"20, 28, 40"},{offsetXMultiplier:2.4,offsetYMultiplier:2.7,blurMultiplier:1.45,alpha:.32,rgb:"0, 0, 0"},{offsetXMultiplier:-.7,offsetYMultiplier:-.6,blurMultiplier:.4,alpha:.42,rgb:"255, 255, 255"}].forEach(g=>{const y=F(g.alpha*i);t.save(),t.shadowColor=`rgba(${g.rgb}, ${y})`,t.shadowBlur=f*g.blurMultiplier,t.shadowOffsetX=p*g.offsetXMultiplier,t.shadowOffsetY=p*g.offsetYMultiplier,t.fillStyle="rgba(0, 0, 0, 0)",s.forEach((C,w)=>{const E=c+w*a;l(C,E,"fill");}),t.restore();});}const d=It(this.color,i);m(d),t.restore(),v.reportCacheStats();}catch(n){lt.error("Comment.draw",n,{text:this.text,isActive:this.isActive,hasContext:!!t,interpolatedX:e});}}syncWithSettings(t,e){typeof e=="number"&&e===this.lastSyncedSettingsVersion||(this.color=this.getEffectiveColor(t.commentColor),this.opacity=this.getEffectiveOpacity(t.commentOpacity),this.applyScrollDirection(t.scrollDirection),this.renderStyle=t.renderStyle,typeof e=="number"&&(this.lastSyncedSettingsVersion=e));}getEffectiveColor(t){const e=this.colorOverride??t;return typeof e!="string"||e.length===0?t:e.toUpperCase()}getEffectiveOpacity(t){if(typeof this.opacityOverride=="number")return F(this.opacityOverride);const e=t*this.opacityMultiplier;return Number.isFinite(e)?F(e):0}markActivated(t){this.activationTimeMs=t;}clearActivation(){this.activationTimeMs=null,this.isScrolling||(this.staticExpiryTimeMs=null),this.cachedTexture=null,this.textureCacheKey="";}hasStaticExpired(t){return this.isScrolling||this.staticExpiryTimeMs===null?false:t>=this.staticExpiryTimeMs}getDirectionSign(){return this.directionSign}applyScrollDirection(t){const e=We(t);this.scrollDirection=e,this.directionSign=qe(e);}createSegmentDrawer(t,e,n,i){return (r,s,a,c=0)=>{if(r.length===0)return;const l=r.match(/^[\u3000\u00A0]+/),h=l?l[0].length:0,u=h>0?Z(e,l[0]):0,m=i+u+c,d=h>0?r.substring(h):r,p=()=>{n==="cache"?a==="outline"?v.cacheStats.outlineCallsInCache++:v.cacheStats.fillCallsInCache++:a==="outline"?v.cacheStats.outlineCallsInFallback++:v.cacheStats.fillCallsInFallback++;};if(Math.abs(this.letterSpacing)<Number.EPSILON){p(),t.fillText(d,m,s);return}let f=m;for(let g=0;g<d.length;g+=1){const y=d[g];p(),t.fillText(y,f,s);const C=Z(e,y);f+=C,g<d.length-1&&(f+=this.letterSpacing);}}}getOutlineOffsets(){const t=Math.max(1,Math.round(this.fontSize*.08)),e=[[-t,0],[t,0],[0,-t],[0,t]];if(t>1){const n=Math.max(1,Math.round(t*.7));e.push([-n,-n],[-n,n],[n,-n],[n,n]);}return e}updateTextMetrics(t){let e=0;const n=this.letterSpacing;for(const s of this.lines){const a=Z(t,s),c=s.length>1?n*(s.length-1):0,l=Math.max(0,a+c);l>e&&(e=l);}this.width=e;const i=Math.max(1,Math.floor(this.fontSize*this.lineHeightMultiplier));this.lineHeightPx=i;const r=this.lines.length>1?(this.lines.length-1)*i:0;this.height=this.fontSize+r;}}const Be=4e3,ct={commentColor:"#FFFFFF",commentOpacity:1,isCommentVisible:true,useContainerResizeObserver:true,ngWords:[],ngRegexps:[],scrollDirection:"rtl",renderStyle:"outline-only",syncMode:"raf",scrollVisibleDurationMs:Be,useFixedLaneCount:false,fixedLaneCount:12,useDprScaling:true},ie=()=>({...ct,ngWords:[...ct.ngWords],ngRegexps:[...ct.ngRegexps]}),R=o=>o*1e3,Ue=o=>!Number.isFinite(o)||o<0?null:Math.round(o),bt=4e3,Ft=1800,Ge=3,Ke=.25,Ye=32,je=48,ht=120,Xe=4e3,dt=120,Je=800,Ze=2,Y=4e3,I=B+bt,Qe=1e3,Pt=1,Dt=12,_t=24,T=.001,W=50,tn=.05,en=10,nn=o=>Number.isFinite(o)?o<=0?0:o>=1?1:o:1,ut=o=>Math.max(en,Math.floor(o*tn)),tt=o=>{const t=o.scrollVisibleDurationMs,e=t==null?null:Number.isFinite(t)?Math.max(1,Math.floor(t)):null;return {...o,scrollDirection:o.scrollDirection==="ltr"?"ltr":"rtl",commentOpacity:nn(o.commentOpacity),renderStyle:o.renderStyle==="classic"?"classic":"outline-only",scrollVisibleDurationMs:e,syncMode:o.syncMode==="video-frame"?"video-frame":"raf",useDprScaling:!!o.useDprScaling}},rn=o=>typeof window<"u"&&typeof window.requestAnimationFrame=="function"&&typeof window.cancelAnimationFrame=="function"?{request:t=>window.requestAnimationFrame(t),cancel:t=>window.cancelAnimationFrame(t)}:{request:t=>globalThis.setTimeout(()=>{t(o.now());},16),cancel:t=>{globalThis.clearTimeout(t);}},sn=()=>typeof document>"u"?()=>{throw new Error("Document is not available. Provide a custom createCanvasElement implementation.")}:()=>document.createElement("canvas"),an=o=>{if(!o||typeof o!="object")return  false;const t=o;return typeof t.commentColor=="string"&&typeof t.commentOpacity=="number"&&typeof t.isCommentVisible=="boolean"};class Ht{_settings;comments=[];activeComments=new Set;reservedLanes=new Map;topStaticLaneReservations=[];bottomStaticLaneReservations=[];log;timeSource;animationFrameProvider;createCanvasElement;commentDependencies;settingsVersion=0;normalizedNgWords=[];compiledNgRegexps=[];canvas=null;ctx=null;videoElement=null;containerElement=null;fullscreenActive=false;laneCount=Dt;laneHeight=0;displayWidth=0;displayHeight=0;canvasDpr=1;currentTime=0;duration=0;playbackRate=1;isPlaying=true;isStalled=false;lastDrawTime=0;finalPhaseActive=false;finalPhaseStartTime=null;finalPhaseScheduleDirty=false;playbackHasBegun=false;skipDrawingForCurrentFrame=false;pendingInitialSync=false;finalPhaseVposOverrides=new Map;frameId=null;videoFrameHandle=null;resizeObserver=null;resizeObserverTarget=null;isResizeObserverAvailable=typeof ResizeObserver<"u";cleanupTasks=[];commentSequence=0;epochId=0;eventHooks;enableAutoGhostDetection;lastSnapshotEmitTime=0;snapshotEmitThrottleMs=1e3;constructor(t=null,e=void 0){let n,i;if(an(t))n=tt({...t}),i=e??{};else {const r=t??e??{};i=typeof r=="object"?r:{},n=tt(ie());}this._settings=tt(n),this.timeSource=i.timeSource??ne(),this.animationFrameProvider=i.animationFrameProvider??rn(this.timeSource),this.createCanvasElement=i.createCanvasElement??sn(),this.commentDependencies={timeSource:this.timeSource,settingsVersion:this.settingsVersion},this.log=Zt(i.loggerNamespace??"CommentRenderer"),this.eventHooks=i.eventHooks??{},this.enableAutoGhostDetection=i.enableAutoGhostDetection??true,this.rebuildNgMatchers(),i.debug&&Fe(i.debug);}get settings(){return this._settings}set settings(t){this._settings=tt(t),this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion,this.rebuildNgMatchers();}resolveContainer(t,e){if(t)return t;if(e.parentElement)return e.parentElement;if(typeof document<"u"&&document.body)return document.body;throw new Error("Cannot resolve container element. Provide container explicitly when DOM is unavailable.")}ensureContainerPositioning(t){if(typeof getComputedStyle=="function"){getComputedStyle(t).position==="static"&&(t.style.position="relative");return}t.style.position||(t.style.position="relative");}initialize(t){try{this.destroyCanvasOnly();const e=t instanceof HTMLVideoElement?t:t.video,n=t instanceof HTMLVideoElement?t.parentElement:t.container??t.video.parentElement,i=this.resolveContainer(n??null,e);this.videoElement=e,this.containerElement=i,this.duration=Number.isFinite(e.duration)?R(e.duration):0,this.currentTime=R(e.currentTime),this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.isStalled=!1,this.lastDrawTime=this.timeSource.now(),this.playbackHasBegun=this.isPlaying||this.currentTime>W,this.skipDrawingForCurrentFrame=this.shouldSuppressRendering();const r=this.createCanvasElement(),s=r.getContext("2d");if(!s)throw new Error("Failed to acquire 2D canvas context");r.style.position="absolute",r.style.top="0",r.style.left="0",r.style.pointerEvents="none",r.style.zIndex="1000";const a=this.containerElement;a instanceof HTMLElement&&(this.ensureContainerPositioning(a),a.appendChild(r)),this.canvas=r,this.ctx=s,this.resize(),this.calculateLaneMetrics(),this.setupVideoEventListeners(e),this.setupResizeHandling(e),this.setupFullscreenHandling(),this.setupVideoChangeDetection(e,i),this.startAnimation(),this.setupVisibilityHandling();}catch(e){throw this.log.error("CommentRenderer.initialize",e),e}}addComments(t){if(!Array.isArray(t)||t.length===0)return [];const e=[];this.commentDependencies.settingsVersion=this.settingsVersion;for(const n of t){const{text:i,vposMs:r,commands:s=[]}=n,a=_(i);if(this.isNGComment(i)){M("comment-skip-ng",{preview:a,vposMs:r});continue}const c=Ue(r);if(c===null){this.log.warn("CommentRenderer.addComment.invalidVpos",{text:i,vposMs:r}),M("comment-skip-invalid-vpos",{preview:a,vposMs:r});continue}if(this.comments.some(h=>h.text===i&&h.vposMs===c)||e.some(h=>h.text===i&&h.vposMs===c)){M("comment-skip-duplicate",{preview:a,vposMs:c});continue}const l=new v(i,c,s,this._settings,this.commentDependencies);l.creationIndex=this.commentSequence++,l.epochId=this.epochId,e.push(l),M("comment-added",{preview:a,vposMs:c,commands:l.commands.length,layout:l.layout,isScrolling:l.isScrolling,invisible:l.isInvisible});}return e.length===0?[]:(this.comments.push(...e),this.finalPhaseActive&&(this.finalPhaseScheduleDirty=true),this.comments.sort((n,i)=>{const r=n.vposMs-i.vposMs;return Math.abs(r)>T?r:n.creationIndex-i.creationIndex}),e)}addComment(t,e,n=[]){const[i]=this.addComments([{text:t,vposMs:e,commands:n}]);return i??null}clearComments(){if(this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.commentSequence=0,this.ctx&&this.canvas){const t=this.canvasDpr>0?this.canvasDpr:1,e=this.displayWidth>0?this.displayWidth:this.canvas.width/t,n=this.displayHeight>0?this.displayHeight:this.canvas.height/t;this.ctx.clearRect(0,0,e,n);}}resetState(){this.clearComments(),this.currentTime=0,this.resetFinalPhaseState(),this.playbackHasBegun=false,this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false;}destroy(){this.stopAnimation(),this.cleanupResizeHandling(),this.runCleanupTasks(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.videoElement=null,this.containerElement=null,this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.resetFinalPhaseState(),this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.commentSequence=0,this.playbackHasBegun=false,this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false;}hardReset(){const t=this.canvas,e=this.ctx,n=this.detectGhostComments();if(n.length>0&&this.removeGhostComments(n),this.incrementEpoch("manual-reset"),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.comments.forEach(i=>{i.isActive=false,i.hasShown=false,i.lane=-1,i.clearActivation(),i.epochId=this.epochId;}),t&&e){const i=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/i,s=this.displayHeight>0?this.displayHeight:t.height/i;e.clearRect(0,0,r,s);}this.pendingInitialSync=true,this.resetFinalPhaseState(),this.emitStateSnapshot("hardReset");}resetFinalPhaseState(){this.finalPhaseActive=false,this.finalPhaseStartTime=null,this.finalPhaseScheduleDirty=false,this.finalPhaseVposOverrides.clear();}incrementEpoch(t){const e=this.epochId;if(this.epochId+=1,He(e,this.epochId,t),this.eventHooks.onEpochChange){const n={previousEpochId:e,newEpochId:this.epochId,reason:t,timestamp:this.timeSource.now()};try{this.eventHooks.onEpochChange(n);}catch(i){this.log.error("CommentRenderer.incrementEpoch.callback",i,{info:n});}}this.comments.forEach(n=>{n.epochId=this.epochId;});}detectGhostComments(){if(!this.enableAutoGhostDetection)return [];const t=[],e=this.timeSource.now(),n=I*2;for(const i of this.comments){if(!i.isActive)continue;let r=null;i.epochId!==this.epochId?r="epoch-mismatch":i.activationTimeMs!==null&&e-i.activationTimeMs>n?r="stale-activation":this.activeComments.has(i)||(r="orphaned"),r!==null&&t.push({comment:{text:i.text,vposMs:i.vposMs,epochId:i.epochId},reason:r,detectedAt:e});}return t}removeGhostComments(t){if(t.length===0)return;const e=new Set(t.map(n=>n.comment.text));for(const n of this.comments)e.has(n.text)&&n.vposMs===t[0]?.comment.vposMs&&(n.isActive=false,this.activeComments.delete(n),n.clearActivation());if(De(t.map(n=>({text:n.comment.text,vposMs:n.comment.vposMs,epochId:n.comment.epochId,reason:n.reason}))),this.eventHooks.onGhostCommentDetected)try{this.eventHooks.onGhostCommentDetected(t);}catch(n){this.log.error("CommentRenderer.removeGhostComments.callback",n);}}emitStateSnapshot(t){const e=this.timeSource.now();if(e-this.lastSnapshotEmitTime<this.snapshotEmitThrottleMs)return;const n={currentTime:this.currentTime,duration:this.duration,isPlaying:this.isPlaying,epochId:this.epochId,totalComments:this.comments.length,activeComments:this.activeComments.size,reservedLanes:this.reservedLanes.size,finalPhaseActive:this.finalPhaseActive,playbackHasBegun:this.playbackHasBegun,isStalled:this.isStalled};if(_e(t,n),this.eventHooks.onStateSnapshot)try{this.eventHooks.onStateSnapshot(n);}catch(i){this.log.error("CommentRenderer.emitStateSnapshot.callback",i);}this.lastSnapshotEmitTime=e;}getEffectiveCommentVpos(t){return this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline(),this.finalPhaseVposOverrides.get(t)??t.vposMs}getFinalPhaseDisplayDuration(t){if(!t.isScrolling)return B;const e=[];return Number.isFinite(t.visibleDurationMs)&&t.visibleDurationMs>0&&e.push(t.visibleDurationMs),Number.isFinite(t.totalDurationMs)&&t.totalDurationMs>0&&e.push(t.totalDurationMs),e.length>0?Math.max(...e):bt}resolveFinalPhaseVpos(t){if(!this.finalPhaseActive||this.finalPhaseStartTime===null)return this.finalPhaseVposOverrides.delete(t),t.vposMs;this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline();const e=this.finalPhaseVposOverrides.get(t);if(e!==void 0)return e;const n=Math.max(t.vposMs,this.finalPhaseStartTime);return this.finalPhaseVposOverrides.set(t,n),n}recomputeFinalPhaseTimeline(){if(!this.finalPhaseActive||this.finalPhaseStartTime===null){this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=false;return}const t=this.finalPhaseStartTime,e=this.duration>0?this.duration:t+Y,n=Math.max(t+Y,e),i=this.comments.filter(l=>l.hasShown||l.isInvisible||this.isNGComment(l.text)?false:l.vposMs>=t-I).sort((l,h)=>{const u=l.vposMs-h.vposMs;return Math.abs(u)>T?u:l.creationIndex-h.creationIndex});if(this.finalPhaseVposOverrides.clear(),i.length===0){this.finalPhaseScheduleDirty=false;return}const r=Math.max(n-t,Y)/Math.max(i.length,1),s=Number.isFinite(r)?r:dt,a=Math.max(dt,Math.min(s,Je));let c=t;i.forEach((l,h)=>{const u=Math.max(1,this.getFinalPhaseDisplayDuration(l)),m=n-u;let d=Math.max(t,Math.min(c,m));Number.isFinite(d)||(d=t);const p=Ze*h;d+p<=m&&(d+=p),this.finalPhaseVposOverrides.set(l,d);const f=Math.max(dt,Math.min(u/2,a));c=d+f;}),this.finalPhaseScheduleDirty=false;}shouldSuppressRendering(){return !this.playbackHasBegun&&!this.isPlaying&&this.currentTime<=W}updatePlaybackProgressState(){this.playbackHasBegun||(this.isPlaying||this.currentTime>W)&&(this.playbackHasBegun=true);}updateSettings(t){const e=this._settings.useContainerResizeObserver,n=this._settings.scrollDirection,i=this._settings.useDprScaling,r=this._settings.syncMode;this.settings=t;const s=n!==this._settings.scrollDirection,a=i!==this._settings.useDprScaling,c=r!==this._settings.syncMode;if(this.comments.forEach(l=>{l.syncWithSettings(this._settings,this.settingsVersion);}),s&&this.resetCommentActivity(),!this._settings.isCommentVisible&&this.ctx&&this.canvas){this.comments.forEach(m=>{m.isActive=false,m.clearActivation();}),this.activeComments.clear();const l=this.canvasDpr>0?this.canvasDpr:1,h=this.displayWidth>0?this.displayWidth:this.canvas.width/l,u=this.displayHeight>0?this.displayHeight:this.canvas.height/l;this.ctx.clearRect(0,0,h,u),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;}e!==this._settings.useContainerResizeObserver&&this.videoElement&&this.setupResizeHandling(this.videoElement),a&&this.resize(),c&&this.videoElement&&this.startAnimation(),this.calculateLaneMetrics();}getVideoElement(){return this.videoElement}getCurrentVideoSource(){const t=this.videoElement;if(!t)return null;if(typeof t.currentSrc=="string"&&t.currentSrc.length>0)return t.currentSrc;const e=t.getAttribute("src");if(e&&e.length>0)return e;const n=t.querySelector("source[src]");return n&&typeof n.src=="string"?n.src:null}getCommentsSnapshot(){return [...this.comments]}rebuildNgMatchers(){const t=[],e=[],n=Array.isArray(this._settings.ngWords)?this._settings.ngWords:[];for(const r of n){if(typeof r!="string")continue;const s=r.trim().toLowerCase();s.length!==0&&t.push(s);}const i=Array.isArray(this._settings.ngRegexps)?this._settings.ngRegexps:[];for(const r of i)if(!(typeof r!="string"||r.length===0))try{e.push(new RegExp(r));}catch(s){this.log.error("CommentRenderer.rebuildNgMatchers.regex",s,{pattern:r});}this.normalizedNgWords=t,this.compiledNgRegexps=e;}isNGComment(t){try{if(typeof t!="string")return !0;if(this.normalizedNgWords.length>0){const e=t.toLowerCase();if(this.normalizedNgWords.some(n=>e.includes(n)))return !0}return this.compiledNgRegexps.length>0?this.compiledNgRegexps.some(e=>e.test(t)):!1}catch(e){return this.log.error("CommentRenderer.isNGComment",e,{text:t}),true}}resize(t,e){const n=this.videoElement,i=this.canvas,r=this.ctx;if(!n||!i)return;const s=n.getBoundingClientRect(),a=this.canvasDpr>0?this.canvasDpr:1,c=this.displayWidth>0?this.displayWidth:i.width/a,l=this.displayHeight>0?this.displayHeight:i.height/a,h=t??s.width??c,u=e??s.height??l;if(!Number.isFinite(h)||!Number.isFinite(u)||h<=0||u<=0)return;const m=Math.max(1,Math.floor(h)),d=Math.max(1,Math.floor(u)),p=this.displayWidth>0?this.displayWidth:m,f=this.displayHeight>0?this.displayHeight:d,g=this._settings.useDprScaling?this.resolveDevicePixelRatio():1,y=Math.max(1,Math.round(m*g)),C=Math.max(1,Math.round(d*g));if(!(this.displayWidth!==m||this.displayHeight!==d||Math.abs(this.canvasDpr-g)>Number.EPSILON||i.width!==y||i.height!==C))return;this.displayWidth=m,this.displayHeight=d,this.canvasDpr=g,i.width=y,i.height=C,i.style.width=`${m}px`,i.style.height=`${d}px`,r&&(r.setTransform(1,0,0,1,0,0),this._settings.useDprScaling&&r.scale(g,g));const w=p>0?m/p:1,E=f>0?d/f:1;(w!==1||E!==1)&&this.comments.forEach(S=>{S.isActive&&(S.x*=w,S.y*=E,S.width*=w,S.fontSize=Math.max(_t,Math.floor(Math.max(1,S.fontSize)*E)),S.height=S.fontSize,S.virtualStartX*=w,S.exitThreshold*=w,S.baseSpeed*=w,S.speed*=w,S.speedPixelsPerMs*=w,S.bufferWidth*=w,S.reservationWidth*=w);}),this.calculateLaneMetrics();}resolveDevicePixelRatio(){if(typeof window>"u")return 1;const t=Number(window.devicePixelRatio);return !Number.isFinite(t)||t<=0?1:t}destroyCanvasOnly(){this.stopAnimation(),this.cleanupResizeHandling(),this.runCleanupTasks(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.fullscreenActive=false;}calculateLaneMetrics(){const t=this.canvas;if(!t)return;const e=this.displayHeight>0?this.displayHeight:t.height/Math.max(this.canvasDpr,1),n=Math.max(_t,Math.floor(e*.05));this.laneHeight=n*1.2;const i=Math.floor(e/Math.max(this.laneHeight,1));if(this._settings.useFixedLaneCount){const r=Number.isFinite(this._settings.fixedLaneCount)?Math.floor(this._settings.fixedLaneCount):Dt,s=Math.max(Pt,Math.min(i,r));this.laneCount=s;}else this.laneCount=Math.max(Pt,i);this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;}updateComments(t){const e=this.videoElement,n=this.canvas,i=this.ctx;if(!e||!n||!i)return;const r=this.detectGhostComments();r.length>0&&this.removeGhostComments(r);const s=typeof t=="number"?t:R(e.currentTime);if(this.currentTime=s,this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.updatePlaybackProgressState(),this.skipDrawingForCurrentFrame=this.shouldSuppressRendering(),this.skipDrawingForCurrentFrame)return;const a=this.canvasDpr>0?this.canvasDpr:1,c=this.displayWidth>0?this.displayWidth:n.width/a,l=this.displayHeight>0?this.displayHeight:n.height/a,h=this.buildPrepareOptions(c),u=this.duration>0&&this.duration-this.currentTime<=Xe;u&&!this.finalPhaseActive&&(this.finalPhaseActive=true,this.finalPhaseStartTime=this.currentTime,this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=true,i.clearRect(0,0,c,l),this.comments.forEach(d=>{d.isActive=false,d.clearActivation();}),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0),!u&&this.finalPhaseActive&&this.resetFinalPhaseState(),this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline(),this.pruneStaticLaneReservations(this.currentTime);const m=this.getCommentsInTimeWindow(this.currentTime,I);for(const d of m){const p=D(),f=p?_(d.text):"";if(p&&M("comment-evaluate",{stage:"update",preview:f,vposMs:d.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(d),currentTime:this.currentTime,isActive:d.isActive,hasShown:d.hasShown}),this.isNGComment(d.text)){p&&M("comment-eval-skip",{preview:f,vposMs:d.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(d),reason:"ng-runtime"});continue}if(d.isInvisible){p&&M("comment-eval-skip",{preview:f,vposMs:d.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(d),reason:"invisible"}),d.isActive=false,this.activeComments.delete(d),d.hasShown=true,d.clearActivation();continue}if(d.syncWithSettings(this._settings,this.settingsVersion),this.shouldActivateCommentAtTime(d,this.currentTime,f)&&this.activateComment(d,i,c,l,h,this.currentTime),d.isActive){if(d.layout!=="naka"&&d.hasStaticExpired(this.currentTime)){const g=d.layout==="ue"?"ue":"shita";this.releaseStaticLane(g,d.lane),d.isActive=false,this.activeComments.delete(d),d.clearActivation();continue}if(d.layout==="naka"&&this.getEffectiveCommentVpos(d)>this.currentTime+W){d.x=d.virtualStartX,d.lastUpdateTime=this.timeSource.now();continue}if(d.hasShown=true,d.update(this.playbackRate,!this.isPlaying),!d.isScrolling&&d.hasStaticExpired(this.currentTime)){const g=d.layout==="ue"?"ue":"shita";this.releaseStaticLane(g,d.lane),d.isActive=false,this.activeComments.delete(d),d.clearActivation();}}}for(const d of this.comments)d.isActive&&d.isScrolling&&(d.scrollDirection==="rtl"&&d.x<=d.exitThreshold||d.scrollDirection==="ltr"&&d.x>=d.exitThreshold)&&(d.isActive=false,this.activeComments.delete(d),d.clearActivation());}buildPrepareOptions(t){const e=this._settings.scrollVisibleDurationMs;let n=bt,i=Ft;return e!==null&&(n=e,i=Math.max(1,Math.min(e,Ft))),{visibleWidth:t,virtualExtension:Qe,maxVisibleDurationMs:n,minVisibleDurationMs:i,maxWidthRatio:Ge,bufferRatio:Ke,baseBufferPx:Ye,entryBufferPx:je}}findAvailableLane(t){const e=this.currentTime;this.pruneLaneReservations(e),this.pruneStaticLaneReservations(e);const n=this.getLanePriorityOrder(e),i=this.createLaneReservation(t,e);for(const s of n)if(this.isLaneAvailable(s,i,e))return this.storeLaneReservation(s,i),s;const r=n[0]??0;return this.storeLaneReservation(r,i),r}findFirstValidReservationIndex(t,e){let n=0,i=t.length;for(;n<i;){const r=Math.floor((n+i)/2),s=t[r];s!==void 0&&s.totalEndTime+ht<=e?n=r+1:i=r;}return n}pruneLaneReservations(t){for(const[e,n]of this.reservedLanes.entries()){const i=this.findFirstValidReservationIndex(n,t);i>=n.length?this.reservedLanes.delete(e):i>0&&this.reservedLanes.set(e,n.slice(i));}}pruneStaticLaneReservations(t){const e=r=>r.filter(s=>s.releaseTime>t),n=e(this.topStaticLaneReservations),i=e(this.bottomStaticLaneReservations);this.topStaticLaneReservations.length=0,this.topStaticLaneReservations.push(...n),this.bottomStaticLaneReservations.length=0,this.bottomStaticLaneReservations.push(...i);}findCommentIndexAtOrAfter(t){let e=0,n=this.comments.length;for(;e<n;){const i=Math.floor((e+n)/2),r=this.comments[i];r!==void 0&&r.vposMs<t?e=i+1:n=i;}return e}getCommentsInTimeWindow(t,e){if(this.comments.length===0)return [];const n=t-e,i=t+e,r=this.findCommentIndexAtOrAfter(n),s=[];for(let a=r;a<this.comments.length;a++){const c=this.comments[a];if(c===void 0||c.vposMs>i)break;s.push(c);}return s}getStaticReservations(t){return t==="ue"?this.topStaticLaneReservations:this.bottomStaticLaneReservations}getStaticLaneDepth(t){const e=this.getStaticReservations(t);if(e.length===0)return 0;let n=-1;for(const i of e)i.lane>n&&(n=i.lane);return Math.max(0,n+1)}getStaticLaneLimit(t){const e=t==="ue"?"shita":"ue",n=this.getStaticLaneDepth(e),i=this.laneCount-n;return i<=0?-1:i-1}getGlobalLaneIndexForBottom(t){const e=Math.max(1,this.laneCount),n=Math.max(0,t);return Math.max(0,e-1-n)}resolveStaticCommentOffset(t,e,n,i){const r=Math.max(1,n),s=Math.max(i.height,i.fontSize),a=ut(i.fontSize);if(t==="ue"){const l=e*this.laneHeight,h=a,u=Math.max(a,r-s-a);return Math.max(h,Math.min(l,u))}const c=r-e*this.laneHeight-s-a;return Math.max(a,c)}getStaticReservedLaneSet(){const t=new Set;for(const e of this.topStaticLaneReservations)t.add(e.lane);for(const e of this.bottomStaticLaneReservations)t.add(this.getGlobalLaneIndexForBottom(e.lane));return t}shouldActivateCommentAtTime(t,e,n=""){const i=n.length>0&&D(),r=this.resolveFinalPhaseVpos(t);return this.finalPhaseActive&&this.finalPhaseStartTime!==null&&t.vposMs<this.finalPhaseStartTime-T?(i&&M("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:r,reason:"final-phase-trimmed",finalPhaseStartTime:this.finalPhaseStartTime}),this.finalPhaseVposOverrides.delete(t),false):t.isInvisible?(i&&M("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:r,reason:"invisible"}),false):t.isActive?(i&&M("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:r,reason:"already-active"}),false):r>e+W?(i&&M("comment-eval-pending",{preview:n,vposMs:t.vposMs,effectiveVposMs:r,reason:"future",currentTime:e}),false):r<e-I?(i&&M("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:r,reason:"expired-window",currentTime:e}),false):(i&&M("comment-eval-ready",{preview:n,vposMs:t.vposMs,effectiveVposMs:r,currentTime:e}),true)}activateComment(t,e,n,i,r,s){t.prepare(e,n,i,r);const a=this.resolveFinalPhaseVpos(t);if(D()&&M("comment-prepared",{preview:_(t.text),layout:t.layout,isScrolling:t.isScrolling,width:t.width,height:t.height,bufferWidth:t.bufferWidth,visibleDurationMs:t.visibleDurationMs,effectiveVposMs:a}),t.layout==="naka"){const u=Math.max(0,s-a),m=t.speedPixelsPerMs*u;if(this.finalPhaseActive&&this.finalPhaseStartTime!==null){const y=this.duration>0?this.duration:this.finalPhaseStartTime+Y,C=Math.max(this.finalPhaseStartTime+Y,y),w=Math.abs(t.exitThreshold-t.virtualStartX),E=C-a;if(E>0&&w>0){const S=w/E;S>t.speedPixelsPerMs&&(t.speedPixelsPerMs=S,t.baseSpeed=S*(1e3/60),t.speed=t.baseSpeed,t.totalDurationMs=Math.ceil(w/S));}}const d=t.getDirectionSign(),p=t.virtualStartX+d*m,f=t.exitThreshold,g=t.scrollDirection;if(g==="rtl"&&p<=f||g==="ltr"&&p>=f){t.isActive=false,this.activeComments.delete(t),t.hasShown=true,t.clearActivation(),t.lane=-1,D()&&M("comment-skip-exited",{preview:_(t.text),vposMs:t.vposMs,effectiveVposMs:a,referenceTime:s});return}t.lane=this.findAvailableLane(t),t.y=t.lane*this.laneHeight,t.x=p,t.isActive=true,this.activeComments.add(t),t.hasShown=true,t.isPaused=!this.isPlaying,t.markActivated(s),t.lastUpdateTime=this.timeSource.now(),D()&&M("comment-activate-scroll",{preview:_(t.text),lane:t.lane,startX:t.x,width:t.width,visibleDurationMs:t.visibleDurationMs,effectiveVposMs:a});return}const c=a+B;if(s>c){t.isActive=false,this.activeComments.delete(t),t.hasShown=true,t.clearActivation(),t.lane=-1,D()&&M("comment-skip-expired",{preview:_(t.text),vposMs:t.vposMs,effectiveVposMs:a,referenceTime:s,displayEnd:c});return}const l=t.layout==="ue"?"ue":"shita",h=this.assignStaticLane(l,t,i,s);t.lane=h,t.y=this.resolveStaticCommentOffset(l,h,i,t),t.x=t.virtualStartX,t.isActive=true,this.activeComments.add(t),t.hasShown=true,t.isPaused=!this.isPlaying,t.markActivated(s),t.lastUpdateTime=this.timeSource.now(),t.staticExpiryTimeMs=c,this.reserveStaticLane(l,t,h,c),D()&&M("comment-activate-static",{preview:_(t.text),lane:t.lane,position:l,displayEnd:c,effectiveVposMs:a});}assignStaticLane(t,e,n,i){const r=this.getStaticReservations(t),s=this.getStaticLaneLimit(t),a=s>=0?s+1:0,c=Array.from({length:a},(u,m)=>m);for(const u of c){const m=this.resolveStaticCommentOffset(t,u,n,e),d=Math.max(e.height,e.fontSize),p=ut(e.fontSize),f=m-p,g=m+d+p;if(!r.some(y=>y.releaseTime>i?!(g<=y.yStart||f>=y.yEnd):false))return u}let l=c[0]??0,h=Number.POSITIVE_INFINITY;for(const u of r)u.releaseTime<h&&(h=u.releaseTime,l=u.lane);return l}reserveStaticLane(t,e,n,i){const r=this.getStaticReservations(t),s=Math.max(e.height,e.fontSize),a=ut(e.fontSize),c=e.y-a,l=e.y+s+a;r.push({comment:e,releaseTime:i,yStart:c,yEnd:l,lane:n});}releaseStaticLane(t,e){if(e<0)return;const n=this.getStaticReservations(t),i=n.findIndex(r=>r.lane===e);i>=0&&n.splice(i,1);}getLanePriorityOrder(t){const e=Array.from({length:this.laneCount},(s,a)=>a).sort((s,a)=>{const c=this.getLaneNextAvailableTime(s,t),l=this.getLaneNextAvailableTime(a,t);return Math.abs(c-l)<=T?s-a:c-l}),n=this.getStaticReservedLaneSet();if(n.size===0)return e;const i=e.filter(s=>!n.has(s));if(i.length===0)return e;const r=e.filter(s=>n.has(s));return [...i,...r]}getLaneNextAvailableTime(t,e){const n=this.reservedLanes.get(t);if(!n||n.length===0)return e;const i=this.findFirstValidReservationIndex(n,e);let r=e;for(let s=i;s<n.length;s++){const a=n[s];a!==void 0&&(r=Math.max(r,a.endTime));}return r}createLaneReservation(t,e){const n=Math.max(t.speedPixelsPerMs,T),i=this.getEffectiveCommentVpos(t),r=Number.isFinite(i)?i:e,s=Math.max(0,r),a=s+t.preCollisionDurationMs+ht,c=s+t.totalDurationMs+ht;return {comment:t,startTime:s,endTime:Math.max(s,a),totalEndTime:Math.max(s,c),startLeft:t.virtualStartX,width:t.width,speed:n,buffer:t.bufferWidth,directionSign:t.getDirectionSign()}}isLaneAvailable(t,e,n){const i=this.reservedLanes.get(t);if(!i||i.length===0)return  true;const r=this.findFirstValidReservationIndex(i,n);for(let s=r;s<i.length;s++){const a=i[s];if(a===void 0)break;if(this.areReservationsConflicting(a,e))return  false}return  true}storeLaneReservation(t,e){const n=[...this.reservedLanes.get(t)??[],e].sort((i,r)=>i.totalEndTime-r.totalEndTime);this.reservedLanes.set(t,n);}areReservationsConflicting(t,e){const n=Math.max(t.startTime,e.startTime),i=Math.min(t.endTime,e.endTime);if(n>=i)return  false;const r=new Set([n,i,n+(i-n)/2]),s=this.solveLeftRightEqualityTime(t,e);s!==null&&s>=n-T&&s<=i+T&&r.add(s);const a=this.solveLeftRightEqualityTime(e,t);a!==null&&a>=n-T&&a<=i+T&&r.add(a);for(const c of r){if(c<n-T||c>i+T)continue;const l=this.computeForwardGap(t,e,c),h=this.computeForwardGap(e,t,c);if(l<=T&&h<=T)return  true}return  false}computeForwardGap(t,e,n){const i=this.getBufferedEdges(t,n),r=this.getBufferedEdges(e,n);return i.left-r.right}getBufferedEdges(t,e){const n=Math.max(0,e-t.startTime),i=t.speed*n,r=t.startLeft+t.directionSign*i,s=r-t.buffer,a=r+t.width+t.buffer;return {left:s,right:a}}solveLeftRightEqualityTime(t,e){const n=t.directionSign,i=e.directionSign,r=i*e.speed-n*t.speed;if(Math.abs(r)<T)return null;const s=(e.startLeft+i*e.speed*e.startTime+e.width+e.buffer-t.startLeft-n*t.speed*t.startTime+t.buffer)/r;return Number.isFinite(s)?s:null}draw(){const t=this.canvas,e=this.ctx;if(!t||!e)return;const n=this.canvasDpr>0?this.canvasDpr:1,i=this.displayWidth>0?this.displayWidth:t.width/n,r=this.displayHeight>0?this.displayHeight:t.height/n,s=this.timeSource.now();if(this.skipDrawingForCurrentFrame||this.shouldSuppressRendering()||this.isStalled){e.clearRect(0,0,i,r),this.lastDrawTime=s;return}e.clearRect(0,0,i,r);const a=Array.from(this.activeComments);if(this._settings.isCommentVisible){const c=(s-this.lastDrawTime)/16.666666666666668;a.sort((l,h)=>{const u=this.getEffectiveCommentVpos(l),m=this.getEffectiveCommentVpos(h),d=u-m;return Math.abs(d)>T?d:l.isScrolling!==h.isScrolling?l.isScrolling?1:-1:l.creationIndex-h.creationIndex}),a.forEach(l=>{const h=this.isPlaying&&!l.isPaused?l.x+l.getDirectionSign()*l.speed*c:l.x;l.draw(e,h);});}this.lastDrawTime=s;}performInitialSync(t){const e=this.videoElement,n=this.canvas,i=this.ctx;if(!e||!n||!i)return;const r=typeof t=="number"?t:R(e.currentTime);this.currentTime=r,this.lastDrawTime=this.timeSource.now();const s=this.canvasDpr>0?this.canvasDpr:1,a=this.displayWidth>0?this.displayWidth:n.width/s,c=this.displayHeight>0?this.displayHeight:n.height/s,l=this.buildPrepareOptions(a);this.getCommentsInTimeWindow(this.currentTime,I).forEach(h=>{if(this.isNGComment(h.text)||h.isInvisible){h.isActive=false,this.activeComments.delete(h),h.clearActivation();return}if(h.syncWithSettings(this._settings,this.settingsVersion),h.isActive=false,this.activeComments.delete(h),h.lane=-1,h.clearActivation(),this.shouldActivateCommentAtTime(h,this.currentTime)){this.activateComment(h,i,a,c,l,this.currentTime);return}this.getEffectiveCommentVpos(h)<this.currentTime-I?h.hasShown=true:h.hasShown=false;});}processFrame(t){this.videoElement&&this._settings.isCommentVisible&&(this.pendingInitialSync&&(this.performInitialSync(t),this.pendingInitialSync=false),this.updateComments(t),this.draw());}handleAnimationFrame=()=>{const t=this.frameId;this.frameId=null,t!==null&&this.animationFrameProvider.cancel(t),this.processFrame(),this.scheduleNextFrame();};handleVideoFrame=(t,e)=>{this.videoFrameHandle=null;const n=typeof e?.mediaTime=="number"?e.mediaTime*1e3:void 0;this.processFrame(typeof n=="number"?n:void 0),this.scheduleNextFrame();};shouldUseVideoFrameCallback(){if(this._settings.syncMode!=="video-frame")return  false;const t=this.videoElement;return !!t&&typeof t.requestVideoFrameCallback=="function"&&typeof t.cancelVideoFrameCallback=="function"}scheduleNextFrame(){const t=this.videoElement;if(t){if(this.shouldUseVideoFrameCallback()){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();const e=t.requestVideoFrameCallback;typeof e=="function"&&(this.videoFrameHandle=e.call(t,this.handleVideoFrame));return}this.cancelVideoFrameCallback(),this.frameId=this.animationFrameProvider.request(this.handleAnimationFrame);}}cancelAnimationFrameRequest(){this.frameId!==null&&(this.animationFrameProvider.cancel(this.frameId),this.frameId=null);}cancelVideoFrameCallback(){if(this.videoFrameHandle===null)return;const t=this.videoElement;t&&typeof t.cancelVideoFrameCallback=="function"&&t.cancelVideoFrameCallback(this.videoFrameHandle),this.videoFrameHandle=null;}startAnimation(){this.stopAnimation(),this.scheduleNextFrame();}stopAnimation(){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();}onSeek(){const t=this.canvas,e=this.ctx,n=this.videoElement;if(!t||!e||!n)return;const i=R(n.currentTime);this.currentTime=i,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;const r=this.canvasDpr>0?this.canvasDpr:1,s=this.displayWidth>0?this.displayWidth:t.width/r,a=this.displayHeight>0?this.displayHeight:t.height/r,c=this.buildPrepareOptions(s);this.getCommentsInTimeWindow(this.currentTime,I).forEach(l=>{const h=D(),u=h?_(l.text):"";if(h&&M("comment-evaluate",{stage:"seek",preview:u,vposMs:l.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(l),currentTime:this.currentTime,isActive:l.isActive,hasShown:l.hasShown}),this.isNGComment(l.text)){h&&M("comment-eval-skip",{preview:u,vposMs:l.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(l),reason:"ng-runtime"}),l.isActive=false,this.activeComments.delete(l),l.clearActivation();return}if(l.isInvisible){h&&M("comment-eval-skip",{preview:u,vposMs:l.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(l),reason:"invisible"}),l.isActive=false,this.activeComments.delete(l),l.hasShown=true,l.clearActivation();return}if(l.syncWithSettings(this._settings,this.settingsVersion),l.isActive=false,this.activeComments.delete(l),l.lane=-1,l.clearActivation(),this.shouldActivateCommentAtTime(l,this.currentTime,u)){this.activateComment(l,e,s,a,c,this.currentTime);return}this.getEffectiveCommentVpos(l)<this.currentTime-I?l.hasShown=true:l.hasShown=false;}),this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());}setupVideoEventListeners(t){try{const e=()=>{this.isPlaying=!0,this.playbackHasBegun=!0;const d=this.timeSource.now();this.lastDrawTime=d,this.pendingInitialSync||this.hardReset(),this.comments.forEach(p=>{p.lastUpdateTime=d,p.isPaused=!1;});},n=()=>{this.isPlaying=!1;const d=this.timeSource.now();this.comments.forEach(p=>{p.lastUpdateTime=d,p.isPaused=!0;});},i=()=>{this.onSeek();},r=()=>{this.onSeek();},s=()=>{this.playbackRate=t.playbackRate;const d=this.timeSource.now();this.comments.forEach(p=>{p.lastUpdateTime=d;});},a=()=>{this.handleVideoMetadataLoaded(t);},c=()=>{this.duration=Number.isFinite(t.duration)?R(t.duration):0;},l=()=>{this.handleVideoSourceChange();},h=()=>{this.handleVideoStalled();},u=()=>{this.handleVideoCanPlay();},m=()=>{this.handleVideoCanPlay();};t.addEventListener("play",e),t.addEventListener("pause",n),t.addEventListener("seeking",i),t.addEventListener("seeked",r),t.addEventListener("ratechange",s),t.addEventListener("loadedmetadata",a),t.addEventListener("durationchange",c),t.addEventListener("emptied",l),t.addEventListener("waiting",h),t.addEventListener("canplay",u),t.addEventListener("playing",m),this.addCleanup(()=>t.removeEventListener("play",e)),this.addCleanup(()=>t.removeEventListener("pause",n)),this.addCleanup(()=>t.removeEventListener("seeking",i)),this.addCleanup(()=>t.removeEventListener("seeked",r)),this.addCleanup(()=>t.removeEventListener("ratechange",s)),this.addCleanup(()=>t.removeEventListener("loadedmetadata",a)),this.addCleanup(()=>t.removeEventListener("durationchange",c)),this.addCleanup(()=>t.removeEventListener("emptied",l)),this.addCleanup(()=>t.removeEventListener("waiting",h)),this.addCleanup(()=>t.removeEventListener("canplay",u)),this.addCleanup(()=>t.removeEventListener("playing",m));}catch(e){throw this.log.error("CommentRenderer.setupVideoEventListeners",e),e}}handleVideoMetadataLoaded(t){this.incrementEpoch("metadata-loaded"),this.handleVideoSourceChange(t),this.resize(),this.calculateLaneMetrics(),this.hardReset(),this.onSeek(),this.emitStateSnapshot("metadata-loaded");}handleVideoStalled(){const t=this.canvas,e=this.ctx;if(!t||!e)return;this.isStalled=true;const n=this.canvasDpr>0?this.canvasDpr:1,i=this.displayWidth>0?this.displayWidth:t.width/n,r=this.displayHeight>0?this.displayHeight:t.height/n;e.clearRect(0,0,i,r),this.comments.forEach(s=>{s.isActive&&(s.lastUpdateTime=this.timeSource.now());});}handleVideoCanPlay(){this.isStalled&&(this.isStalled=false,this.videoElement&&(this.currentTime=R(this.videoElement.currentTime),this.isPlaying=!this.videoElement.paused),this.lastDrawTime=this.timeSource.now());}handleVideoSourceChange(t){const e=t??this.videoElement;if(!e){this.isPlaying=false,this.resetFinalPhaseState(),this.resetCommentActivity();return}this.incrementEpoch("source-change"),this.syncVideoState(e),this.resetFinalPhaseState(),this.resetCommentActivity(),this.emitStateSnapshot("source-change");}syncVideoState(t){this.duration=Number.isFinite(t.duration)?R(t.duration):0,this.currentTime=R(t.currentTime),this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.isStalled=false,this.playbackHasBegun=this.isPlaying||this.currentTime>W,this.lastDrawTime=this.timeSource.now();}resetCommentActivity(){const t=this.timeSource.now(),e=this.canvas,n=this.ctx;if(this.resetFinalPhaseState(),this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false,this.playbackHasBegun=this.isPlaying||this.currentTime>W,e&&n){const i=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:e.width/i,s=this.displayHeight>0?this.displayHeight:e.height/i;n.clearRect(0,0,r,s);}this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.comments.forEach(i=>{i.isActive=false,i.isPaused=!this.isPlaying,i.hasShown=false,i.lane=-1,i.x=i.virtualStartX,i.speed=i.baseSpeed,i.lastUpdateTime=t,i.clearActivation();}),this.activeComments.clear();}setupVideoChangeDetection(t,e){if(typeof MutationObserver>"u"){this.log.debug("MutationObserver is not available in this environment. Video change detection is disabled.");return}const n=new MutationObserver(r=>{for(const s of r){if(s.type==="attributes"&&s.attributeName==="src"){const a=s.target;let c=null,l=null;if((a instanceof HTMLVideoElement||a instanceof HTMLSourceElement)&&(c=typeof s.oldValue=="string"?s.oldValue:null,l=a.getAttribute("src")),c===l)continue;this.handleVideoSourceChange(t);return}if(s.type==="childList"){for(const a of s.addedNodes)if(a instanceof HTMLSourceElement){this.handleVideoSourceChange(t);return}for(const a of s.removedNodes)if(a instanceof HTMLSourceElement){this.handleVideoSourceChange(t);return}}}});n.observe(t,{attributes:true,attributeFilter:["src"],attributeOldValue:true,childList:true,subtree:true}),this.addCleanup(()=>n.disconnect());const i=new MutationObserver(r=>{for(const s of r)if(s.type==="childList"){for(const a of s.addedNodes){const c=this.extractVideoElement(a);if(c&&c!==this.videoElement){this.initialize(c);return}}for(const a of s.removedNodes){if(a===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}if(a instanceof Element){const c=a.querySelector("video");if(c&&c===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}}}}});i.observe(e,{childList:true,subtree:true}),this.addCleanup(()=>i.disconnect());}extractVideoElement(t){if(t instanceof HTMLVideoElement)return t;if(t instanceof Element){const e=t.querySelector("video");if(e instanceof HTMLVideoElement)return e}return null}setupVisibilityHandling(){if(typeof document>"u"||typeof document.addEventListener!="function"||typeof document.removeEventListener!="function")return;const t=()=>{if(document.visibilityState!=="visible"){this.stopAnimation();return}this._settings.isCommentVisible&&(this.handleVisibilityRestore(),this.startAnimation());};document.addEventListener("visibilitychange",t),this.addCleanup(()=>document.removeEventListener("visibilitychange",t)),document.visibilityState!=="visible"&&this.stopAnimation();}handleVisibilityRestore(){const t=this.canvas,e=this.ctx,n=this.videoElement;if(!t||!e||!n)return;this.currentTime=R(n.currentTime),this.isPlaying=!n.paused,this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;const i=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/i,s=this.displayHeight>0?this.displayHeight:t.height/i;e.clearRect(0,0,r,s);const a=this.buildPrepareOptions(r),c=this.timeSource.now();this.getCommentsInTimeWindow(this.currentTime,I).forEach(l=>{if(this.isNGComment(l.text)||l.isInvisible){l.isActive=false,this.activeComments.delete(l),l.clearActivation();return}l.syncWithSettings(this._settings,this.settingsVersion),l.isActive=false,this.activeComments.delete(l),l.lane=-1,l.clearActivation(),l.lastUpdateTime=c,this.shouldActivateCommentAtTime(l,this.currentTime)&&this.activateComment(l,e,r,s,a,this.currentTime);const h=this.getEffectiveCommentVpos(l);h<this.currentTime-I?l.hasShown=true:h>this.currentTime&&(l.hasShown=false);}),this.lastDrawTime=c;}setupResizeHandling(t){if(this.cleanupResizeHandling(),this._settings.useContainerResizeObserver&&this.isResizeObserverAvailable){const e=this.resolveResizeObserverTarget(t),n=new ResizeObserver(i=>{for(const r of i){const{width:s,height:a}=r.contentRect;s>0&&a>0?this.resize(s,a):this.resize();}});n.observe(e),this.resizeObserver=n,this.resizeObserverTarget=e;}else if(typeof window<"u"&&typeof window.addEventListener=="function"){const e=()=>{this.resize();};window.addEventListener("resize",e),this.addCleanup(()=>window.removeEventListener("resize",e));}else this.log.debug("Resize handling is disabled because neither ResizeObserver nor window APIs are available.");}cleanupResizeHandling(){this.resizeObserver&&this.resizeObserverTarget&&this.resizeObserver.unobserve(this.resizeObserverTarget),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.resizeObserverTarget=null;}setupFullscreenHandling(){if(typeof document>"u"||typeof document.addEventListener!="function"||typeof document.removeEventListener!="function")return;const t=()=>{this.handleFullscreenChange();};["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(e=>{document.addEventListener(e,t),this.addCleanup(()=>document.removeEventListener(e,t));}),this.handleFullscreenChange();}resolveResizeObserverTarget(t){return this.resolveFullscreenContainer(t)||(t.parentElement??t)}async handleFullscreenChange(){const t=this.canvas,e=this.videoElement;if(!t||!e)return;const n=this.containerElement??e.parentElement??null,i=this.getFullscreenElement(),r=this.resolveActiveOverlayContainer(e,n,i);if(!(r instanceof HTMLElement))return;t.parentElement!==r?(this.ensureContainerPositioning(r),r.appendChild(t)):this.ensureContainerPositioning(r);const s=(i instanceof HTMLElement&&i.contains(e)?i:null)!==null;this.fullscreenActive!==s&&(this.fullscreenActive=s,this.setupResizeHandling(e)),t.style.position="absolute",t.style.top="0",t.style.left="0",this.resize();}resolveFullscreenContainer(t){const e=this.getFullscreenElement();return e instanceof HTMLElement&&(e===t||e.contains(t))?e:null}resolveActiveOverlayContainer(t,e,n){return n instanceof HTMLElement&&n.contains(t)?n instanceof HTMLVideoElement&&e instanceof HTMLElement?e:n:e??null}getFullscreenElement(){if(typeof document>"u")return null;const t=document;return document.fullscreenElement??t.webkitFullscreenElement??t.mozFullScreenElement??t.msFullscreenElement??null}addCleanup(t){this.cleanupTasks.push(t);}runCleanupTasks(){for(;this.cleanupTasks.length>0;){const t=this.cleanupTasks.pop();try{t?.();}catch(e){this.log.error("CommentRenderer.cleanupTask",e);}}}}const q=()=>({...ie(),enableForceRefresh:true}),on="v6.11.4";var ln=typeof GM_addStyle<"u"?GM_addStyle:void 0,et=typeof GM_getValue<"u"?GM_getValue:void 0,nt=typeof GM_setValue<"u"?GM_setValue:void 0,cn=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const Ot="settings",zt="currentVideo",Nt="lastDanimeIds",$t="playbackSettings",hn=o=>({...o,ngWords:[...o.ngWords],ngRegexps:[...o.ngRegexps]}),j={fixedModeEnabled:false,fixedRate:1.11},it=o=>({fixedModeEnabled:o.fixedModeEnabled,fixedRate:o.fixedRate});class St{constructor(t){this.notifier=t,this.settings=q(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData(),this.playbackSettings=it(j),this.loadPlaybackSettings();}settings;currentVideo;observers=new Set;playbackSettings;playbackObservers=new Set;getSettings(){return hn(this.settings)}loadSettings(){try{const t=et(Ot,null);if(!t)return this.settings=q(),this.settings;if(typeof t=="string"){const e=JSON.parse(t);this.settings={...q(),...e,ngWords:Array.isArray(e?.ngWords)?[...e.ngWords]:[],ngRegexps:Array.isArray(e?.ngRegexps)?[...e.ngRegexps]:[]};}else this.settings={...q(),...t,ngWords:Array.isArray(t.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t.ngRegexps)?[...t.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(t){return console.error("[SettingsManager] 設定の読み込みに失敗しました",t),this.notify("設定の読み込みに失敗しました","error"),this.settings=q(),this.settings}}getPlaybackSettings(){return it(this.playbackSettings)}loadPlaybackSettings(){try{const t=et($t,null);if(!t)return this.playbackSettings=it(j),this.notifyPlaybackObservers(),this.playbackSettings;if(typeof t=="string"){const e=JSON.parse(t);this.playbackSettings={fixedModeEnabled:typeof e.fixedModeEnabled=="boolean"?e.fixedModeEnabled:j.fixedModeEnabled,fixedRate:typeof e.fixedRate=="number"?e.fixedRate:j.fixedRate};}else this.playbackSettings={fixedModeEnabled:t.fixedModeEnabled,fixedRate:t.fixedRate};return this.notifyPlaybackObservers(),this.playbackSettings}catch(t){return console.error("[SettingsManager] 再生設定の読み込みに失敗しました",t),this.notify("再生設定の読み込みに失敗しました","error"),this.playbackSettings=it(j),this.notifyPlaybackObservers(),this.playbackSettings}}updatePlaybackSettings(t){return this.playbackSettings={...this.playbackSettings,...t},this.savePlaybackSettings()}savePlaybackSettings(){try{return nt($t,JSON.stringify(this.playbackSettings)),this.notifyPlaybackObservers(),!0}catch(t){return console.error("[SettingsManager] 再生設定の保存に失敗しました",t),this.notify("再生設定の保存に失敗しました","error"),false}}saveSettings(){try{return nt(Ot,JSON.stringify(this.settings)),this.notifyObservers(),this.notify("設定を保存しました","success"),!0}catch(t){return console.error("[SettingsManager] 設定の保存に失敗しました",t),this.notify("設定の保存に失敗しました","error"),false}}updateSettings(t){return this.settings={...this.settings,...t,ngWords:t.ngWords?[...t.ngWords]:[...this.settings.ngWords],ngRegexps:t.ngRegexps?[...t.ngRegexps]:[...this.settings.ngRegexps]},this.saveSettings()}addObserver(t){this.observers.add(t);}removeObserver(t){this.observers.delete(t);}addPlaybackObserver(t){this.playbackObservers.add(t);try{t(this.getPlaybackSettings());}catch(e){console.error("[SettingsManager] 再生設定の登録通知でエラー",e);}}removePlaybackObserver(t){this.playbackObservers.delete(t);}notifyObservers(){const t=this.getSettings();for(const e of this.observers)try{e(t);}catch(n){console.error("[SettingsManager] 設定変更通知でエラー",n);}}notifyPlaybackObservers(){const t=this.getPlaybackSettings();for(const e of this.playbackObservers)try{e(t);}catch(n){console.error("[SettingsManager] 再生設定通知でエラー",n);}}loadVideoData(){try{return et(zt,null)??null}catch(t){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",t),this.notify("動画データの読み込みに失敗しました","error"),null}}saveVideoData(t,e){try{const n={videoId:e.videoId,title:e.title,viewCount:e.viewCount,commentCount:e.commentCount,mylistCount:e.mylistCount,postedAt:e.postedAt,thumbnail:e.thumbnail,owner:e.owner??null,channel:e.channel??null};return nt(zt,n),this.currentVideo=n,!0}catch(n){return console.error("[SettingsManager] 動画データの保存に失敗しました",n),this.notify("動画データの保存に失敗しました","error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(t){try{return nt(Nt,t),!0}catch(e){return console.error("[SettingsManager] saveLastDanimeIds failed",e),this.notify("ID情報の保存に失敗しました","error"),false}}loadLastDanimeIds(){try{return et(Nt,null)??null}catch(t){return console.error("[SettingsManager] loadLastDanimeIds failed",t),this.notify("ID情報の読込に失敗しました","error"),null}}notify(t,e="info"){this.notifier?.show(t,e);}}const dn=new Set(["INPUT","TEXTAREA"]),mt=o=>o.length===1?o.toUpperCase():o,un=o=>o?`${o}+`:"";class re{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(t,e,n){const i=this.createShortcutKey(mt(t),e);this.shortcuts.set(i,n);}removeShortcut(t,e){const n=this.createShortcutKey(mt(t),e);this.shortcuts.delete(n);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(t){this.isEnabled=t;}createShortcutKey(t,e){return `${un(e)}${t}`}extractModifier(t){const e=[];return t.ctrlKey&&e.push("Ctrl"),t.altKey&&e.push("Alt"),t.shiftKey&&e.push("Shift"),t.metaKey&&e.push("Meta"),e.length>0?e.join("+"):null}handleKeyDown(t){if(!this.isEnabled)return;const n=t.target?.tagName??"";if(dn.has(n))return;const i=this.extractModifier(t),r=this.createShortcutKey(mt(t.key),i),s=this.shortcuts.get(r);s&&(t.preventDefault(),s());}}const mn=z("dAnime:CommentRenderer"),Wt=o=>({loggerNamespace:"dAnime:CommentRenderer",...o??{}}),pn=o=>{if(!o||typeof o!="object")return  false;const t=o;return typeof t.commentColor=="string"&&typeof t.commentOpacity=="number"&&typeof t.isCommentVisible=="boolean"};class se{renderer;keyboardHandler=null;constructor(t,e){pn(t)||t===null?this.renderer=new Ht(t??null,Wt(e)):this.renderer=new Ht(Wt(t));}get settings(){return this.renderer.settings}set settings(t){this.renderer.settings=t;}initialize(t){this.renderer.initialize(t),this.setupKeyboardShortcuts();}addComment(t,e,n=[]){return this.renderer.addComment(t,e,n)}clearComments(){this.renderer.clearComments();}resetState(){this.renderer.resetState();}hardReset(){this.renderer.hardReset();}destroy(){this.teardownKeyboardShortcuts(),this.renderer.destroy();}updateSettings(t){this.renderer.updateSettings(t);}getVideoElement(){return this.renderer.getVideoElement()}getCurrentVideoSource(){return this.renderer.getCurrentVideoSource()}getCommentsSnapshot(){return this.renderer.getCommentsSnapshot()}isNGComment(t){return this.renderer.isNGComment(t)}resize(t,e){this.renderer.resize(t,e);}setupKeyboardShortcuts(){this.teardownKeyboardShortcuts();const t=new re;t.addShortcut("C","Shift",()=>{try{const e=this.renderer.settings,n={...e,isCommentVisible:!e.isCommentVisible};this.renderer.updateSettings(n),this.syncGlobalSettings(n);}catch(e){mn.error("CommentRenderer.keyboardShortcut",e);}}),t.startListening(),this.keyboardHandler=t;}teardownKeyboardShortcuts(){this.keyboardHandler?.stopListening(),this.keyboardHandler=null;}syncGlobalSettings(t){window.dAniRenderer?.settingsManager?.updateSettings(t);}}class wt{shadowRoot=null;container=null;createShadowDOM(t,e={mode:"closed"}){if(!t)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=t.attachShadow(e),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(t){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const e=document.createElement("style");e.textContent=t,this.shadowRoot.appendChild(e);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}querySelectorAll(t){return this.shadowRoot?this.shadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}setHTML(t){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=t;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const gn=`\r
/* 基本カラーパレット - ダークモード */\r
:host {\r
--primary: #7F5AF0;       /* プライマリカラー：鮮やかな紫 */\r
--secondary: #2CB67D;     /* セカンダリカラー：ミントグリーン */\r
--accent: #FF8906;        /* アクセントカラー：オレンジ */\r
--bg-primary: #16161A;    /* 背景：暗めのグレー */\r
--bg-secondary: #242629;  /* セカンダリ背景：少し明るいグレー */\r
--text-primary: #FFFFFE;  /* メインテキスト：白 */\r
--text-secondary: #94A1B2; /* セカンダリテキスト：薄いグレー */\r
--danger: #E53170;        /* 警告・エラー：ピンク */\r
--success: #2CB67D;       /* 成功：グリーン */\r
--highlight: rgba(127, 90, 240, 0.2); /* 強調表示：紫の半透明 */\r
}\r
\r
* {\r
box-sizing: border-box;\r
}\r
\r
/* 全体のスタイル */\r
.nico-comment-settings {\r
background: var(--bg-primary);\r
color: var(--text-primary);\r
padding: 24px;\r
border-radius: 16px;\r
box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05);\r
margin: 25px 0;\r
max-width: 800px;\r
font-size: 15px;\r
backdrop-filter: blur(10px);\r
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\r
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\r
}\r
\r
.nico-comment-settings:hover {\r
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);\r
transform: translateY(-2px);\r
}\r
\r
/* ヘッダースタイル */\r
.nico-comment-settings h2 {\r
margin: 0 0 28px;\r
font-size: 24px;\r
color: var(--text-primary);\r
font-weight: 700;\r
display: flex;\r
align-items: center;\r
gap: 12px;\r
padding-bottom: 12px;\r
border-bottom: 2px solid var(--primary);\r
letter-spacing: 0.5px;\r
}\r
\r
.settings-title {\r
display: inline-block;\r
background: linear-gradient(90deg, var(--primary), var(--accent));\r
-webkit-background-clip: text;\r
background-clip: text;\r
-webkit-text-fill-color: transparent;\r
}\r
\r
.version-badge {\r
display: inline-flex;\r
align-items: center;\r
gap: 6px;\r
padding: 4px 12px;\r
border-radius: 999px;\r
background: rgba(127, 90, 240, 0.2);\r
color: var(--text-primary);\r
font-size: 14px;\r
font-weight: 600;\r
border: 1px solid rgba(127, 90, 240, 0.4);\r
letter-spacing: 0.3px;\r
}\r
\r
.nico-comment-settings .setting-group {\r
margin-bottom: 28px;\r
background: var(--bg-secondary);\r
padding: 20px;\r
border-radius: 12px;\r
border: 1px solid rgba(255, 255, 255, 0.05);\r
position: relative;\r
overflow: hidden;\r
transition: all 0.3s ease;\r
}\r
\r
.nico-comment-settings .setting-group:hover {\r
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);\r
transform: translateY(-2px);\r
border-color: rgba(127, 90, 240, 0.3);\r
}\r
\r
.nico-comment-settings .setting-group::before {\r
content: '';\r
position: absolute;\r
top: 0;\r
left: 0;\r
width: 4px;\r
height: 100%;\r
background: var(--primary);\r
opacity: 0.7;\r
}\r
\r
.nico-comment-settings .setting-group h3 {\r
margin: 0 0 16px;\r
font-size: 18px;\r
color: var(--primary);\r
position: relative;\r
display: inline-block;\r
font-weight: 600;\r
}\r
\r
.nico-comment-settings .setting-group h3::after {\r
content: '';\r
position: absolute;\r
bottom: -4px;\r
left: 0;\r
width: 100%;\r
height: 2px;\r
background: linear-gradient(90deg, var(--primary), transparent);\r
}\r
\r
/* 検索関連のスタイル */\r
.search-container {\r
display: flex;\r
gap: 12px;\r
margin-bottom: 16px;\r
}\r
\r
.open-search-page-direct-btn {\r
background: var(--bg-primary) !important;\r
color: var(--text-secondary) !important;\r
border: 1px solid rgba(255, 255, 255, 0.1) !important;\r
border-radius: 8px;\r
}\r
\r
.open-search-page-direct-btn:hover {\r
background: rgba(127, 90, 240, 0.1) !important;\r
color: var(--primary) !important;\r
}\r
\r
.search-container input[type="text"] {\r
flex: 1;\r
background: var(--bg-primary);\r
color: var(--text-primary);\r
border: 1px solid rgba(255, 255, 255, 0.1);\r
transition: all 0.3s ease;\r
padding: 10px 12px;\r
border-radius: 8px;\r
font-size: 14px;\r
}\r
\r
.search-container input[type="text"]:focus {\r
border-color: var(--primary);\r
box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.3);\r
outline: none;\r
}\r
\r
.search-results {\r
max-height: 350px;\r
overflow-y: auto;\r
margin-top: 16px;\r
border: 1px solid rgba(255, 255, 255, 0.05);\r
border-radius: 8px;\r
background: var(--bg-primary);\r
scrollbar-width: thin;\r
scrollbar-color: var(--primary) var(--bg-primary);\r
}\r
\r
.search-results::-webkit-scrollbar {\r
width: 8px;\r
}\r
\r
.search-results::-webkit-scrollbar-track {\r
background: var(--bg-primary);\r
border-radius: 8px;\r
}\r
\r
.search-results::-webkit-scrollbar-thumb {\r
background-color: var(--primary);\r
border-radius: 8px;\r
border: 2px solid var(--bg-primary);\r
}\r
\r
.search-result-item {\r
display: flex;\r
padding: 14px;\r
border-bottom: 1px solid rgba(255, 255, 255, 0.05);\r
cursor: pointer;\r
transition: all 0.3s ease;\r
position: relative;\r
overflow: hidden;\r
}\r
\r
.search-result-item::before {\r
content: '';\r
position: absolute;\r
top: 0;\r
left: 0;\r
width: 0;\r
height: 100%;\r
background: linear-gradient(90deg, var(--primary), transparent);\r
opacity: 0;\r
transition: opacity 0.3s ease, width 0.3s ease;\r
z-index: 0;\r
}\r
\r
.search-result-item:hover {\r
background: rgba(127, 90, 240, 0.1);\r
transform: translateX(4px);\r
}\r
\r
.search-result-item:hover::before {\r
opacity: 0.1;\r
width: 100%;\r
}\r
\r
.search-result-item img {\r
width: 100px;\r
height: 75px;\r
object-fit: cover;\r
border-radius: 8px;\r
border: 2px solid rgba(255, 255, 255, 0.1);\r
transition: all 0.3s ease;\r
z-index: 1;\r
}\r
\r
.search-result-item:hover img {\r
border-color: var(--primary);\r
transform: scale(1.05);\r
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\r
}\r
\r
.search-result-info {\r
margin-left: 16px;\r
flex: 1;\r
z-index: 1;\r
}\r
\r
.search-result-info .title {\r
font-weight: 600;\r
margin-bottom: 6px;\r
color: var(--text-primary);\r
display: -webkit-box;\r
-webkit-line-clamp: 2;\r
line-clamp: 2;\r
-webkit-box-orient: vertical;\r
overflow: hidden;\r
text-overflow: ellipsis;\r
transition: color 0.3s ease;\r
}\r
\r
.search-result-item:hover .title {\r
color: var(--primary);\r
}\r
\r
.search-result-info .stats {\r
font-size: 13px;\r
color: var(--text-secondary);\r
margin-bottom: 4px;\r
display: flex;\r
gap: 12px;\r
}\r
\r
.search-result-info .date {\r
font-size: 13px;\r
color: var(--text-secondary);\r
opacity: 0.8;\r
display: inline-block;\r
}\r
\r
/* 入力要素のスタイル */\r
.nico-comment-settings input[type="text"],\r
.nico-comment-settings input[type="number"] {\r
width: 100%;\r
padding: 10px 12px;\r
background: var(--bg-primary);\r
color: var(--text-primary);\r
border: 1px solid rgba(255, 255, 255, 0.1);\r
border-radius: 8px;\r
margin-bottom: 14px;\r
font-size: 14px;\r
transition: all 0.3s ease;\r
}\r
\r
.nico-comment-settings input[type="text"]:focus,\r
.nico-comment-settings input[type="number"]:focus {\r
border-color: var(--primary);\r
box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.2);\r
outline: none;\r
}\r
\r
/* 透明度入力欄のスタイル */\r
.opacity-setting input[type="number"] {\r
width: 80px;\r
text-align: right;\r
padding-right: 12px;\r
}\r
\r
.nico-comment-settings input[type="color"] {\r
width: 50px;\r
height: 50px;\r
padding: 0;\r
border: none;\r
border-radius: 50%;\r
cursor: pointer;\r
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\r
transition: all 0.3s ease;\r
}\r
\r
.nico-comment-settings input[type="color"]:hover {\r
transform: scale(1.1);\r
box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);\r
}\r
\r
/* 現在の設定エリアのスタイル */\r
.current-video-info {\r
display: flex;\r
gap: 24px;\r
align-items: flex-start;\r
background: rgba(0, 0, 0, 0.2);\r
border-radius: 10px;\r
padding: 16px;\r
border: 1px solid rgba(255, 255, 255, 0.05);\r
box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);\r
position: relative;\r
}\r
\r
.info-container {\r
display: grid;\r
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\r
gap: 12px 16px;\r
flex: 1;\r
font-size: 14px;\r
}\r
\r
.info-item {\r
display: flex;\r
align-items: center;\r
gap: 12px;\r
padding: 10px 14px;\r
background: rgba(255, 255, 255, 0.04);\r
border-radius: 10px;\r
border: 1px solid rgba(255, 255, 255, 0.08);\r
box-shadow: inset 0 0 0 1px rgba(127, 90, 240, 0.08);\r
color: var(--text-primary);\r
transition: transform 0.2s ease, box-shadow 0.2s ease;\r
position: relative;\r
}\r
\r
.info-item--wide {\r
grid-column: 1 / -1;\r
}\r
\r
.info-item:hover {\r
transform: translateY(-1px);\r
box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);\r
}\r
\r
.info-icon {\r
display: inline-flex;\r
align-items: center;\r
justify-content: center;\r
color: var(--primary);\r
flex-shrink: 0;\r
}\r
\r
.info-icon svg {\r
width: 20px;\r
height: 20px;\r
}\r
\r
.info-value {\r
font-size: 15px;\r
font-weight: 600;\r
line-height: 1.3;\r
color: var(--text-primary);\r
word-break: break-word;\r
}\r
\r
.sr-only {\r
position: absolute;\r
width: 1px;\r
height: 1px;\r
padding: 0;\r
margin: -1px;\r
overflow: hidden;\r
clip: rect(0 0 0 0);\r
white-space: nowrap;\r
border: 0;\r
}\r
\r
/* サムネイルラッパー */\r
.thumbnail-wrapper {\r
flex-shrink: 0;\r
width: 160px;\r
height: 120px;\r
position: relative;\r
}\r
\r
.thumbnail-container {\r
width: 100%;\r
height: 100%;\r
border-radius: 10px;\r
overflow: hidden;\r
background: var(--bg-primary);\r
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);\r
border: 2px solid rgba(255, 255, 255, 0.05);\r
transition: all 0.3s ease;\r
position: relative;\r
}\r
\r
.thumbnail-overlay {\r
position: absolute;\r
top: 0;\r
left: 0;\r
width: 100%;\r
height: 100%;\r
background: rgba(0, 0, 0, 0);\r
transition: all 0.3s ease;\r
z-index: 5;\r
}\r
\r
.thumbnail-wrapper:hover .thumbnail-overlay {\r
background: rgba(0, 0, 0, 0.4);\r
}\r
\r
/* 再生ボタンのスタイル */\r
.play-button {\r
position: absolute;\r
left: 50%;\r
top: 50%;\r
transform: translate(-50%, -50%);\r
width: 50px;\r
height: 50px;\r
border-radius: 50%;\r
background: rgba(127, 90, 240, 0.9);\r
color: white;\r
border: none;\r
cursor: pointer;\r
opacity: 0;\r
transition: all 0.3s ease;\r
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);\r
display: flex;\r
align-items: center;\r
justify-content: center;\r
z-index: 10;\r
}\r
\r
.play-icon {\r
font-size: 24px;\r
margin-left: 4px;\r
}\r
\r
.thumbnail-wrapper:hover .play-button {\r
opacity: 1;\r
transform: translate(-50%, -50%) scale(1.1);\r
}\r
\r
.play-button:hover {\r
background: var(--accent);\r
transform: translate(-50%, -50%) scale(1.2);\r
box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);\r
}\r
\r
.play-button:disabled {\r
opacity: 0.35;\r
cursor: not-allowed;\r
pointer-events: none;\r
transform: translate(-50%, -50%);\r
background: rgba(127, 90, 240, 0.5);\r
box-shadow: none;\r
}\r
\r
.thumbnail-container img {\r
width: 100%;\r
height: 100%;\r
object-fit: cover;\r
transition: all 0.3s ease;\r
}\r
\r
.thumbnail-wrapper:hover .thumbnail-container {\r
transform: scale(1.05);\r
border-color: var(--primary);\r
}\r
\r
.thumbnail-wrapper:hover .thumbnail-container img {\r
transform: scale(1.1);\r
}\r
\r
.info-container {\r
flex: 1;\r
}\r
\r
.info-container p {\r
margin: 8px 0;\r
color: var(--text-secondary);\r
display: flex;\r
align-items: center;\r
gap: 8px;\r
}\r
\r
.info-container p::before {\r
content: '•';\r
color: var(--primary);\r
font-size: 20px;\r
}\r
\r
.info-container span {\r
color: var(--text-primary);\r
font-weight: 500;\r
}\r
\r
/* 透明度設定のスタイル */\r
.opacity-setting select {\r
padding: 8px 12px;\r
background: var(--bg-primary);\r
color: var(--text-primary);\r
border: 1px solid rgba(255, 255, 255, 0.1);\r
border-radius: 8px;\r
font-size: 14px;\r
width: 100px;\r
cursor: pointer;\r
appearance: none;\r
-webkit-appearance: none;\r
background-image: url('data:image/svg+xml;charset=US-ASCII,<svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 9L13 1" stroke="%237F5AF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');\r
background-repeat: no-repeat;\r
background-position: right 10px center;\r
padding-right: 30px;\r
transition: all 0.3s ease;\r
}\r
\r
.opacity-setting select:focus {\r
border-color: var(--primary);\r
box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.2);\r
outline: none;\r
}\r
\r
/* NGワード関連のスタイル */\r
.ng-words-container,\r
.ng-regexp-container {\r
margin-bottom: 18px;\r
}\r
\r
.ng-words {\r
width: 100%;\r
height: 120px;\r
padding: 12px;\r
background: var(--bg-primary);\r
color: var(--text-primary);\r
border: 1px solid rgba(255, 255, 255, 0.1);\r
border-radius: 8px;\r
resize: vertical;\r
font-family: 'Fira Code', monospace;\r
font-size: 14px;\r
margin-top: 12px;\r
line-height: 1.5;\r
transition: all 0.3s ease;\r
}\r
\r
.ng-words:focus {\r
border-color: var(--primary);\r
box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.2);\r
outline: none;\r
}\r
\r
.mask-button {\r
width: 100%;\r
text-align: left;\r
padding: 12px 16px;\r
background: var(--bg-primary);\r
color: var(--text-primary);\r
border: 1px solid rgba(255, 255, 255, 0.1);\r
border-radius: 8px;\r
cursor: pointer;\r
transition: all 0.3s ease;\r
margin-bottom: 12px;\r
position: relative;\r
overflow: hidden;\r
display: flex;\r
align-items: center;\r
gap: 8px;\r
}\r
\r
.mask-button__icon svg {\r
width: 18px;\r
height: 18px;\r
}\r
\r
.mask-button::after {\r
content: '';\r
position: absolute;\r
top: 0;\r
left: 0;\r
width: 0;\r
height: 100%;\r
background: linear-gradient(90deg, var(--primary), transparent);\r
opacity: 0.1;\r
transition: width 0.3s ease;\r
z-index: 0;\r
}\r
\r
.mask-button:hover {\r
background: rgba(127, 90, 240, 0.1);\r
border-color: var(--primary);\r
transform: translateY(-2px);\r
}\r
\r
.mask-button:hover::after {\r
width: 100%;\r
}\r
\r
/* ボタンスタイル */\r
.nico-comment-settings button {\r
background: var(--primary);\r
color: var(--text-primary);\r
border: none;\r
padding: 10px 18px;\r
border-radius: 8px;\r
cursor: pointer;\r
font-size: 14px;\r
font-weight: 500;\r
position: relative;\r
overflow: hidden;\r
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\r
box-shadow: 0 4px 12px rgba(127, 90, 240, 0.3);\r
}\r
\r
.nico-comment-settings button::after {\r
content: '';\r
position: absolute;\r
top: 0;\r
left: 0;\r
width: 100%;\r
height: 100%;\r
background: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));\r
opacity: 0;\r
transition: opacity 0.3s ease;\r
}\r
\r
.nico-comment-settings button:hover {\r
background: var(--primary);\r
transform: translateY(-3px);\r
box-shadow: 0 8px 20px rgba(127, 90, 240, 0.4);\r
}\r
\r
.nico-comment-settings button:hover::after {\r
opacity: 1;\r
}\r
\r
.nico-comment-settings button:active {\r
transform: translateY(1px);\r
box-shadow: 0 2px 8px rgba(127, 90, 240, 0.2);\r
}\r
\r
#searchButton, #saveSettings {\r
background: linear-gradient(135deg, var(--primary) 0%, #6E44FF 100%);\r
border-radius: 8px;\r
color: var(--text-primary);\r
}\r
\r
.toggle-button {\r
position: relative;\r
background: var(--primary);\r
color: white;\r
border: none;\r
padding: 10px 18px;\r
border-radius: 8px;\r
cursor: pointer;\r
transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r
padding-left: 40px;\r
margin-top: 8px;\r
}\r
\r
.toggle-button::before {\r
content: '';\r
position: absolute;\r
left: 12px;\r
top: 50%;\r
transform: translateY(-50%);\r
width: 18px;\r
height: 18px;\r
background-color: rgba(255, 255, 255, 0.9);\r
border-radius: 50%;\r
transition: all 0.3s ease;\r
box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);\r
}\r
\r
.toggle-button.off {\r
background: var(--bg-primary);\r
color: var(--text-secondary);\r
padding-left: 18px;\r
padding-right: 40px;\r
border: 1px solid rgba(255, 255, 255, 0.1);\r
}\r
\r
.toggle-button.off::before {\r
left: auto;\r
right: 12px;\r
background-color: var(--text-secondary);\r
box-shadow: none;\r
}\r
\r
/* その他のユーティリティクラス */\r
.hidden {\r
display: none !important;\r
}\r
\r
.current-settings {\r
background: var(--bg-secondary);\r
padding: 16px;\r
border-radius: 8px;\r
border: 1px solid rgba(255, 255, 255, 0.05);\r
}\r
\r
.current-settings p {\r
margin: 8px 0;\r
color: var(--text-secondary);\r
}\r
\r
.current-settings span {\r
color: var(--text-primary);\r
margin-left: 8px;\r
font-weight: 500;\r
}\r
\r
/* 設定グループのレイアウト */\r
.display-settings-group > h3 {\r
margin-bottom: 12px;\r
}\r
\r
.display-settings-grid {\r
display: grid;\r
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\r
gap: 16px;\r
margin-top: 12px;\r
}\r
\r
.display-settings-item {\r
background: rgba(0, 0, 0, 0.25);\r
border: 1px solid rgba(255, 255, 255, 0.08);\r
border-radius: 12px;\r
padding: 16px;\r
display: flex;\r
flex-direction: column;\r
gap: 12px;\r
min-height: 32vh;\r
box-shadow: inset 0 0 0 1px rgba(127, 90, 240, 0.05);\r
}\r
\r
.display-settings-item--color {\r
grid-column: span 2;\r
}\r
\r
@media (max-width: 720px) {\r
.display-settings-item--color {\r
grid-column: span 1;\r
}\r
}\r
\r
.display-settings-item__title {\r
margin: 0;\r
font-size: 15px;\r
font-weight: 600;\r
color: var(--text-primary);\r
letter-spacing: 0.2px;\r
}\r
\r
.display-settings-item__body {\r
display: flex;\r
flex-direction: column;\r
gap: 12px;\r
}\r
\r
.opacity-setting {\r
display: flex;\r
align-items: center;\r
gap: 12px;\r
flex-wrap: wrap;\r
color: var(--text-primary);\r
font-weight: 500;\r
}\r
\r
.opacity-setting__label {\r
font-size: 13px;\r
color: var(--text-secondary);\r
}\r
\r
.visibility-toggle {\r
display: flex;\r
align-items: center;\r
}\r
\r
.color-picker {\r
display: grid;\r
grid-template-columns: auto 1fr auto;\r
gap: 12px;\r
align-items: center;\r
padding: 12px;\r
border-radius: 10px;\r
border: 1px solid rgba(255, 255, 255, 0.08);\r
background: rgba(255, 255, 255, 0.03);\r
}\r
\r
.color-picker__label {\r
font-size: 13px;\r
color: var(--text-secondary);\r
font-weight: 500;\r
}\r
\r
.color-picker__note {\r
margin: 0;\r
font-size: 12px;\r
color: var(--text-secondary);\r
line-height: 1.4;\r
}\r
\r
/* カラープリセットのスタイル */\r
.color-presets {\r
display: flex;\r
flex-wrap: wrap;\r
gap: 8px;\r
margin: 0;\r
}\r
\r
.color-preset-btn {\r
width: 36px;\r
height: 36px;\r
border: 2px solid transparent;\r
border-radius: 50%;\r
cursor: pointer;\r
padding: 0;\r
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\r
margin: 0;\r
}\r
\r
.color-preset-btn:hover {\r
transform: scale(1.2) rotate(5deg);\r
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);\r
z-index: 10;\r
}\r
\r
.color-preset-btn.selected {\r
border-color: var(--text-primary);\r
box-shadow: 0 0 0 4px rgba(127, 90, 240, 0.3);\r
}\r
\r
/* カラーピッカーのスタイル */\r
.color-picker input[type="color"] {\r
width: 72px;\r
height: 40px;\r
padding: 0;\r
border: 1px solid rgba(255, 255, 255, 0.2);\r
border-radius: 8px;\r
cursor: pointer;\r
background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.15));\r
transition: box-shadow 0.2s ease, transform 0.2s ease;\r
}\r
\r
.color-picker input[type="color"]:hover {\r
box-shadow: 0 4px 12px rgba(127, 90, 240, 0.3);\r
transform: translateY(-1px);\r
}\r
\r
.current-color-display {\r
display: flex;\r
align-items: center;\r
gap: 10px;\r
font-size: 14px;\r
padding: 8px 12px;\r
background: var(--bg-secondary);\r
border-radius: 8px;\r
border: 1px solid rgba(255, 255, 255, 0.05);\r
}\r
\r
.color-picker .current-color-display {\r
grid-column: 1 / -1;\r
margin: 0;\r
justify-content: flex-start;\r
}\r
\r
.color-preview {\r
display: inline-block;\r
width: 24px;\r
height: 24px;\r
border: 1px solid rgba(255, 255, 255, 0.2);\r
border-radius: 50%;\r
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\r
}\r
\r
.color-value {\r
color: var(--text-primary);\r
font-family: 'Fira Code', monospace;\r
letter-spacing: 0.5px;\r
}\r
\r
.color-picker__note {\r
grid-column: 1 / -1;\r
background: rgba(255, 255, 255, 0.04);\r
padding: 8px 10px;\r
border-radius: 8px;\r
}\r
\r
.ng-settings {\r
display: grid;\r
grid-template-columns: repeat(2, minmax(0, 1fr));\r
gap: 16px;\r
}\r
\r
@media (max-width: 640px) {\r
.ng-settings {\r
grid-template-columns: 1fr;\r
}\r
}\r
\r
.ng-settings__column {\r
display: flex;\r
flex-direction: column;\r
gap: 12px;\r
}\r
\r
.ng-settings__title {\r
margin: 0;\r
font-size: 15px;\r
font-weight: 600;\r
color: var(--text-primary);\r
letter-spacing: 0.2px;\r
}\r
\r
.ng-settings__textarea {\r
min-height: 60vh;\r
padding: 12px;\r
border-radius: 10px;\r
border: 1px solid rgba(255, 255, 255, 0.08);\r
background: rgba(255, 255, 255, 0.03);\r
color: var(--text-primary);\r
font-size: 13px;\r
line-height: 1.5;\r
resize: vertical;\r
box-shadow: inset 0 0 0 1px rgba(127, 90, 240, 0.05);\r
}\r
\r
.ng-settings__textarea:focus {\r
outline: none;\r
border-color: rgba(127, 90, 240, 0.6);\r
box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.25);\r
background: rgba(255, 255, 255, 0.06);\r
}\r
\r
/* 通知のアニメーション */\r
@keyframes notification-slide-in {\r
0% { transform: translateY(20px); opacity: 0; }\r
100% { transform: translateY(0); opacity: 1; }\r
}\r
\r
@keyframes notification-slide-out {\r
0% { transform: translateY(0); opacity: 1; }\r
100% { transform: translateY(-20px); opacity: 0; }\r
}\r
\r
/* 設定グループのアニメーション */\r
.setting-group {\r
animation: settingGroupAppear 0.5s cubic-bezier(0.26, 0.86, 0.44, 0.985) backwards;\r
}\r
\r
.setting-group:nth-child(1) { animation-delay: 0.1s; }\r
.setting-group:nth-child(2) { animation-delay: 0.2s; }\r
.setting-group:nth-child(3) { animation-delay: 0.3s; }\r
.setting-group:nth-child(4) { animation-delay: 0.4s; }\r
.setting-group:nth-child(5) { animation-delay: 0.5s; }\r
\r
@keyframes settingGroupAppear {\r
0% {\r
opacity: 0;\r
transform: translateY(20px);\r
}\r
100% {\r
opacity: 1;\r
transform: translateY(0);\r
}\r
}\r
\r
/* ボタンプレス効果 */\r
.nico-comment-settings button:active {\r
transform: scale(0.95);\r
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);\r
transition: transform 0.1s, box-shadow 0.1s;\r
}\r
\r
/* カラープリセットのホバー効果を強化 */\r
.color-preset-btn {\r
position: relative;\r
overflow: hidden;\r
}\r
\r
.color-preset-btn::after {\r
content: '';\r
position: absolute;\r
top: 0;\r
left: 0;\r
width: 100%;\r
height: 100%;\r
background: radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%);\r
opacity: 0;\r
transition: opacity 0.3s;\r
}\r
\r
.color-preset-btn:hover::after {\r
opacity: 0.5;\r
}\r
\r
/* 検索結果アイテムの選択アニメーション */\r
.search-result-item.selected {\r
background: rgba(127, 90, 240, 0.2);\r
border-left: 4px solid var(--primary);\r
padding-left: 10px;\r
transform: scale(1.02);\r
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);\r
}\r
\r
/* 保存ボタンのパルスアニメーション */\r
@keyframes pulse {\r
0% {\r
box-shadow: 0 0 0 0 rgba(127, 90, 240, 0.7);\r
}\r
70% {\r
box-shadow: 0 0 0 10px rgba(127, 90, 240, 0);\r
}\r
100% {\r
box-shadow: 0 0 0 0 rgba(127, 90, 240, 0);\r
}\r
}\r
\r
#saveSettings {\r
position: relative;\r
overflow: hidden;\r
}\r
\r
#saveSettings:hover,\r
#searchButton:hover,\r
.settings-modal__play-button:hover {\r
animation: pulse 1.5s infinite;\r
}\r
\r
#saveSettings::before {\r
content: '';\r
position: absolute;\r
top: 0;\r
left: -100%;\r
width: 100%;\r
height: 100%;\r
background: linear-gradient(\r
90deg,\r
rgba(255, 255, 255, 0) 0%,\r
rgba(255, 255, 255, 0.2) 50%,\r
rgba(255, 255, 255, 0) 100%\r
);\r
transition: left 0.7s;\r
}\r
\r
#saveSettings:hover::before {\r
left: 100%;\r
}\r
\r
/* 設定UIタイトルのアニメーション */\r
.nico-comment-settings h2 {\r
position: relative;\r
overflow: hidden;\r
}\r
\r
.nico-comment-settings h2::after {\r
content: '';\r
position: absolute;\r
bottom: 0;\r
left: 0;\r
width: 100%;\r
height: 2px;\r
background: linear-gradient(90deg, var(--primary), var(--accent));\r
transform: translateX(-100%);\r
animation: slideIn 1.5s forwards;\r
}\r
\r
@keyframes slideIn {\r
to { transform: translateX(0); }\r
}\r
\r
/* 設定グループヘッダーのアニメーション */\r
.nico-comment-settings .setting-group h3 {\r
position: relative;\r
z-index: 1;\r
}\r
\r
.nico-comment-settings .setting-group h3::before {\r
content: '';\r
position: absolute;\r
z-index: -1;\r
left: -5px;\r
top: -2px;\r
width: 30px;\r
height: 30px;\r
background: var(--primary);\r
opacity: 0.1;\r
border-radius: 50%;\r
transform: scale(0);\r
transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);\r
}\r
\r
.nico-comment-settings .setting-group:hover h3::before {\r
transform: scale(1);\r
}\r
\r
/* トグルボタンのアニメーション */\r
.toggle-button::before {\r
transition: left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),\r
right 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),\r
background-color 0.3s ease;\r
}\r
\r
/* サーチボタンのローディングアニメーション */\r
@keyframes spin {\r
0% { transform: rotate(0deg); }\r
100% { transform: rotate(360deg); }\r
}\r
\r
.loading-spin {\r
position: relative;\r
color: transparent !important;\r
}\r
\r
.loading-spin::after {\r
content: '';\r
position: absolute;\r
top: 50%;\r
left: 50%;\r
margin-top: -8px;\r
margin-left: -8px;\r
width: 16px;\r
height: 16px;\r
border: 2px solid rgba(255, 255, 255, 0.3);\r
border-radius: 50%;\r
border-top-color: white;\r
animation: spin 0.7s linear infinite;\r
}\r
\r
/* 自動コメントボタンのスタイル */\r
.auto-comment-button {\r
background: var(--primary);\r
color: white;\r
border: none;\r
padding: 4px;\r
border-radius: 6px;\r
cursor: pointer;\r
font-size: 12px;\r
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\r
box-shadow: 0 2px 8px rgba(127, 90, 240, 0.3);\r
display: inline-flex;\r
align-items: center;\r
justify-content: center;\r
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\r
min-width: 28px;\r
min-height: 28px;\r
}\r
\r
.auto-comment-button svg {\r
width: 16px;\r
height: 16px;\r
}\r
\r
.auto-comment-button:hover {\r
background: var(--accent);\r
transform: translateY(-2px) scale(1.05);\r
box-shadow: 0 4px 15px rgba(255, 137, 6, 0.4);\r
}\r
\r
.settings-modal {\r
position: fixed;\r
top: 0;\r
left: 0;\r
right: 0;\r
bottom: 0;\r
display: flex;\r
align-items: center;\r
justify-content: center;\r
padding: 32px;\r
z-index: 2147483645;\r
}\r
\r
.settings-modal.hidden {\r
display: none !important;\r
}\r
\r
.settings-modal__overlay {\r
position: absolute;\r
top: 0;\r
left: 0;\r
right: 0;\r
bottom: 0;\r
background: rgba(0, 0, 0, 0.7);\r
backdrop-filter: blur(2px);\r
}\r
\r
.settings-modal__content {\r
position: relative;\r
z-index: 1;\r
background: var(--bg-primary);\r
border-radius: 18px;\r
padding: 24px;\r
width: 60vw;\r
height: 90vh;\r
color: var(--text-primary);\r
display: flex;\r
flex-direction: column;\r
border: 1px solid rgba(255, 255, 255, 0.08);\r
box-shadow: 0 24px 48px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.04);\r
overflow: hidden;\r
}\r
\r
.settings-modal__header {\r
display: flex;\r
align-items: center;\r
justify-content: space-between;\r
margin-bottom: 16px;\r
gap: 16px;\r
}\r
\r
.settings-modal__header h3 {\r
margin: 0;\r
font-size: 20px;\r
color: var(--text-primary);\r
font-weight: 600;\r
}\r
\r
.settings-modal__close {\r
background: transparent;\r
color: var(--text-secondary);\r
box-shadow: none;\r
width: 40px;\r
height: 40px;\r
padding: 0;\r
border-radius: 50%;\r
border: none;\r
}\r
\r
.settings-modal__close:hover {\r
color: var(--text-primary);\r
background: rgba(255, 255, 255, 0.08);\r
}\r
\r
.settings-modal__close:active {\r
transform: scale(0.95);\r
}\r
\r
.settings-modal__close::after {\r
display: none;\r
}\r
\r
.settings-modal__close svg {\r
width: 22px;\r
height: 22px;\r
}\r
\r
.settings-modal__tabs {\r
display: flex;\r
flex-wrap: wrap;\r
gap: 12px;\r
margin-bottom: 16px;\r
}\r
\r
.settings-modal__tab {\r
background: transparent;\r
color: var(--text-secondary);\r
box-shadow: none;\r
border: 1px solid rgba(255, 255, 255, 0.08);\r
border-radius: 999px;\r
padding: 10px 18px;\r
display: inline-flex;\r
align-items: center;\r
gap: 8px;\r
font-weight: 500;\r
transition: all 0.25s ease;\r
}\r
\r
.settings-modal__tab:hover {\r
color: var(--text-primary);\r
border-color: rgba(255, 255, 255, 0.24);\r
background: rgba(127, 90, 240, 0.08);\r
}\r
\r
.settings-modal__tab.is-active {\r
color: var(--text-primary);\r
background: linear-gradient(135deg, var(--primary) 0%, #6E44FF 100%);\r
border-color: transparent;\r
box-shadow: 0 10px 24px rgba(127, 90, 240, 0.35);\r
}\r
\r
.settings-modal__tab::after {\r
display: none;\r
}\r
\r
.settings-modal__tab-icon {\r
display: inline-flex;\r
align-items: center;\r
justify-content: center;\r
}\r
\r
.settings-modal__tab-icon svg {\r
width: 18px;\r
height: 18px;\r
}\r
\r
.settings-modal__panes {\r
flex: 1;\r
overflow-y: auto;\r
padding-right: 8px;\r
margin-right: -8px;\r
}\r
\r
.settings-modal__pane {\r
display: none;\r
}\r
\r
.settings-modal__pane.is-active {\r
display: block;\r
animation: fadeIn 0.25s ease;\r
}\r
\r
.settings-modal__footer {\r
margin-top: 16px;\r
display: flex;\r
justify-content: flex-end;\r
gap: 12px;\r
}\r
\r
.settings-modal__footer button {\r
min-width: 140px;\r
}\r
\r
/* 通知コンテナのスタイル */\r
.notification-container {\r
position: fixed;\r
top: 20px;\r
right: 20px;\r
display: flex;\r
flex-direction: column;\r
gap: 12px;\r
max-width: 400px;\r
pointer-events: none;\r
}\r
\r
.notification-item {\r
background: var(--bg-secondary);\r
color: var(--text-primary);\r
padding: 16px;\r
border-radius: 12px;\r
font-size: 14px;\r
word-break: break-word;\r
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05);\r
display: flex;\r
align-items: center;\r
gap: 12px;\r
transform: translateX(100px);\r
opacity: 0;\r
transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;\r
backdrop-filter: blur(10px);\r
width: 100%;\r
box-sizing: border-box;\r
pointer-events: auto;\r
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\r
}\r
\r
.notification-item.show {\r
transform: translateX(0);\r
opacity: 1;\r
}\r
\r
.notification-icon {\r
width: 32px;\r
height: 32px;\r
border-radius: 50%;\r
display: flex;\r
align-items: center;\r
justify-content: center;\r
flex-shrink: 0;\r
font-size: 16px;\r
}\r
\r
.notification-content {\r
flex: 1;\r
display: flex;\r
flex-direction: column;\r
}\r
\r
.notification-type {\r
font-weight: 600;\r
font-size: 14px;\r
margin-bottom: 4px;\r
}\r
\r
.notification-message {\r
line-height: 1.4;\r
}\r
\r
.notification-close {\r
background: none;\r
border: none;\r
color: var(--text-secondary);\r
font-size: 20px;\r
cursor: pointer;\r
padding: 0;\r
margin: 0;\r
line-height: 1;\r
opacity: 0.7;\r
transition: all 0.2s ease;\r
}\r
\r
.notification-close:hover {\r
opacity: 1;\r
color: var(--text-primary);\r
}\r
\r
/* 通知タイプ別のスタイル */\r
.notification-item.success .notification-icon {\r
background: var(--success);\r
box-shadow: 0 2px 8px rgba(44, 182, 125, 0.5);\r
}\r
\r
.notification-item.success .notification-type {\r
color: var(--success);\r
}\r
\r
.notification-item.warning .notification-icon {\r
background: var(--accent);\r
box-shadow: 0 2px 8px rgba(255, 137, 6, 0.5);\r
}\r
\r
.notification-item.warning .notification-type {\r
color: var(--accent);\r
}\r
\r
.notification-item.error .notification-icon {\r
background: var(--danger);\r
box-shadow: 0 2px 8px rgba(229, 49, 112, 0.5);\r
}\r
\r
.notification-item.error .notification-type {\r
color: var(--danger);\r
}\r
\r
.notification-item.info .notification-icon {\r
background: var(--primary);\r
box-shadow: 0 2px 8px rgba(127, 90, 240, 0.5);\r
}\r
\r
.notification-item.info .notification-type {\r
color: var(--primary);\r
}\r
\r
.notification-item.success {\r
border-left: 4px solid var(--success);\r
}\r
\r
.notification-item.warning {\r
border-left: 4px solid var(--accent);\r
}\r
\r
.notification-item.error {\r
border-left: 4px solid var(--danger);\r
}\r
\r
.notification-item.info {\r
border-left: 4px solid var(--primary);\r
}\r
\r
`,fn=`:host {
--primary: #7F5AF0;
--accent: #FF8906;
--bg-secondary: #242629;
--text-primary: #FFFFFE;
--text-secondary: #94A1B2;
--danger: #E53170;
--success: #2CB67D;
}

/* 通知専用の追加スタイル */
.notification-container {
position: fixed;
top: 20px;
right: 20px;
z-index: 10000;
display: flex;
flex-direction: column;
gap: 12px;
max-width: 400px;
pointer-events: none;
}

.notification-item {
background: var(--bg-secondary);
color: var(--text-primary);
padding: 16px;
border-radius: 12px;
font-size: 14px;
word-break: break-word;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05);
display: flex;
align-items: center;
gap: 12px;
transform: translateX(100px);
opacity: 0;
transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
backdrop-filter: blur(10px);
width: 100%;
box-sizing: border-box;
pointer-events: auto;
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.notification-item.show {
transform: translateX(0);
opacity: 1;
}

.notification-icon {
width: 32px;
height: 32px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
font-size: 16px;
}

.notification-content {
flex: 1;
display: flex;
flex-direction: column;
}

.notification-type {
font-weight: 600;
font-size: 14px;
margin-bottom: 4px;
}

.notification-message {
line-height: 1.4;
}

.notification-close {
background: none;
border: none;
color: var(--text-secondary);
font-size: 20px;
cursor: pointer;
padding: 0;
margin: 0;
line-height: 1;
opacity: 0.7;
transition: all 0.2s ease;
}

.notification-close:hover {
opacity: 1;
color: var(--text-primary);
}

.notification-item.success .notification-icon {
background: var(--success);
box-shadow: 0 2px 8px rgba(44, 182, 125, 0.5);
}

.notification-item.success .notification-type {
color: var(--success);
}

.notification-item.warning .notification-icon {
background: var(--accent);
box-shadow: 0 2px 8px rgba(255, 137, 6, 0.5);
}

.notification-item.warning .notification-type {
color: var(--accent);
}

.notification-item.error .notification-icon {
background: var(--danger);
box-shadow: 0 2px 8px rgba(229, 49, 112, 0.5);
}

.notification-item.error .notification-type {
color: var(--danger);
}

.notification-item.info .notification-icon {
background: var(--primary);
box-shadow: 0 2px 8px rgba(127, 90, 240, 0.5);
}

.notification-item.info .notification-type {
color: var(--primary);
}

.notification-item.success {
border-left: 4px solid var(--success);
}

.notification-item.warning {
border-left: 4px solid var(--accent);
}

.notification-item.error {
border-left: 4px solid var(--danger);
}

.notification-item.info {
border-left: 4px solid var(--primary);
}
`,bn=`:host {
--primary: #7F5AF0;
--accent: #FF8906;
}

/* 自動ボタン専用の追加スタイル */
.auto-comment-button {
background: var(--primary);
color: white;
border: none;
padding: 4px;
border-radius: 6px;
cursor: pointer;
font-size: 12px;
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
box-shadow: 0 2px 8px rgba(127, 90, 240, 0.3);
display: inline-flex;
align-items: center;
justify-content: center;
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
min-width: 28px;
min-height: 28px;
}

.auto-comment-button svg {
width: 16px;
height: 16px;
}

.auto-comment-button:hover {
background: var(--accent);
transform: translateY(-2px) scale(1.05);
box-shadow: 0 4px 15px rgba(255, 137, 6, 0.4);\r
}\r
`;class J{static getCommonStyles(){return gn}static getNotificationStyles(){return fn}static getAutoButtonStyles(){return bn}}const qt={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class x extends wt{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new x),this.instance}static show(t,e="info",n=3e3){try{const i=this.getInstance();return i.initialize(),i.initialized?i.createNotification(t,e,n):null}catch(i){return console.error("[NotificationManager] show failed",i),null}}static removeNotification(t){this.getInstance().removeNotification(t.element);}show(t,e="info"){x.show(t,e);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 2147483647","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(J.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(t){console.error("[NotificationManager] initialize failed",t),this.initialized=false;}}destroy(){x.notifications.forEach(t=>{t.timerId&&window.clearTimeout(t.timerId);}),x.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,x.instance=null;}createNotification(t,e,n){try{const i=this.querySelector(".notification-container");if(!i)throw new Error("Notification container not found");const r=qt[e]??qt.info,s=document.createElement("div");s.className=`notification-item ${e}`;const a=document.createElement("div");a.className="notification-icon",a.innerHTML=`<span>${r}</span>`,s.appendChild(a);const c=document.createElement("div");c.className="notification-content";const l=document.createElement("div");l.className="notification-type",l.textContent=e.charAt(0).toUpperCase()+e.slice(1),c.appendChild(l);const h=document.createElement("div");h.className="notification-message",h.textContent=t||"No message",c.appendChild(h),s.appendChild(c);const u=document.createElement("button");u.className="notification-close",u.innerHTML="&times;",u.addEventListener("click",()=>{this.removeNotification(s);}),s.appendChild(u),i.appendChild(s),requestAnimationFrame(()=>{s.classList.add("show");});const m={element:s,timerId:window.setTimeout(()=>{this.removeNotification(s);},n)};return x.notifications.push(m),m}catch(i){return console.error("[NotificationManager] createNotification failed",i),null}}removeNotification(t){if(!t)return;const e=x.notifications.find(n=>n.element===t);e?.timerId&&window.clearTimeout(e.timerId),t.classList.remove("show"),window.setTimeout(()=>{try{t.remove(),x.notifications=x.notifications.filter(n=>n.element!==t);}catch(n){console.error("[NotificationManager] removeNotification cleanup failed",n);}},500);}}const ae="https://www.nicovideo.jp",oe=`${ae}/search`,le=`${ae}/watch`,Bt={searchBase:oe,watchBase:le},yn=o=>`${le}/${o}`,ce=o=>`${oe}/${encodeURIComponent(o)}`,yt=o=>new Promise((t,e)=>{cn({url:o.url,method:o.method??"GET",headers:o.headers,data:o.data,responseType:o.responseType??"text",timeout:o.timeout,onprogress:o.onprogress,onload:n=>{t({status:n.status,statusText:n.statusText,response:n.response,finalUrl:n.finalUrl,headers:n.responseHeaders});},onerror:n=>{const i=n?.error??"unknown error";e(new Error(`GM_xmlhttpRequest failed: ${i}`));},ontimeout:()=>{e(new Error("GM_xmlhttpRequest timeout"));}});}),pt=z("dAnime:NicoApiFetcher");class Ct{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(t){try{const e=this.sanitizeVideoId(t),i=(await yt({method:"GET",url:yn(e),headers:{Accept:"text/html"}})).response,a=new DOMParser().parseFromString(i,"text/html").querySelector('meta[name="server-response"]');if(!a)throw new Error("API data element not found in response");const c=a.getAttribute("content");if(!c)throw new Error("API data content is empty");const l=this.decodeServerResponse(c),u=JSON.parse(l).data?.response;if(!u)throw new Error("Invalid API data structure");return this.apiData=u,u}catch(e){throw pt.error("NicoApiFetcher.fetchApiData",e),e}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const t=this.apiData.comment?.nvComment;if(!t?.server||!t.params||!t.threadKey)throw new Error("Required comment server data is missing");const e=await yt({method:"POST",url:`${t.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:t.params,threadKey:t.threadKey,additionals:{}})}),r=(JSON.parse(e.response).data?.threads??[]).filter(a=>a.fork==="main").sort((a,c)=>(c.commentCount||0)-(a.commentCount||0))[0];if(!r)throw new Error("Main thread not found in comment response");const s=(r.comments??[]).map(a=>({text:a.body??"",vposMs:a.vposMs??0,commands:a.commands??[]}));return this.comments=s,s}catch(t){throw pt.error("NicoApiFetcher.fetchComments",t),t}}async fetchAllData(t){return await this.fetchApiData(t),this.fetchComments()}sanitizeVideoId(t){try{let e=encodeURIComponent(t);return e=e.replace(/%([0-9A-F]{2})/gi,(n,i)=>{const r=parseInt(i,16);return r>=65&&r<=90||r>=97&&r<=122||r>=48&&r<=57||r===45||r===95||r===46||r===126?String.fromCharCode(r):n}),e}catch(e){return pt.error("NicoApiFetcher.sanitizeVideoId",e,{videoId:t}),t}}decodeServerResponse(t){try{return decodeURIComponent(t)}catch(e){try{const n=t.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(n)}catch{throw new Error(`API data decode failed: ${e.message}`)}}}}const Ut=z("dAnime:NicoVideoSearcher");class he{cache=new Map;async search(t){if(!t.trim())return [];if(this.cache.has(t))return this.cache.get(t)??[];const e=ce(t),n=await this.fetchText(e),i=this.parseServerContext(n).map(a=>{const c=this.calculateLevenshteinDistance(t,a.title),l=Math.max(t.length,a.title.length),h=l>0?(1-c/l)*100:0;return {...a,levenshteinDistance:c,similarity:h}}),r=[],s=new Set;for(const a of i)a?.videoId&&(s.has(a.videoId)||(s.add(a.videoId),r.push(a)));return r.sort((a,c)=>{const l=a.similarity??-1,h=c.similarity??-1;return l!==h?h-l:c.viewCount-a.viewCount}),this.cache.set(t,r),r}async fetchText(t){return (await yt({method:"GET",url:t})).response}parseServerContext(t){try{const n=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!n)return [];const i=n.getAttribute("content")??"",r=this.decodeHtmlEntities(i);let s;try{s=JSON.parse(r);}catch(a){return Ut.error("NicoVideoSearcher.parseServerContext",a),[]}return this.extractVideoItems(s??{})}catch(e){return Ut.error("NicoVideoSearcher.parseServerContext",e),[]}}decodeHtmlEntities(t){if(!t)return "";let e=t.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return e=e.replace(/&#(\d+);/g,(n,i)=>String.fromCharCode(parseInt(i,10))),e=e.replace(/&#x([0-9a-fA-F]+);/g,(n,i)=>String.fromCharCode(parseInt(i,16))),e}extractVideoItems(t){const e=[],n=r=>{const s=(r?.id??r?.contentId??r?.watchId??"").toString();if(!s)return;const a=(r?.title??r?.shortTitle??"").toString(),c=r?.count??{},l=Number(c.view??r?.viewCounter??0)||0,h=Number(c.comment??r?.commentCounter??0)||0,u=Number(c.mylist??r?.mylistCounter??0)||0,m=r?.thumbnail??{},d=(m.nHdUrl||m.listingUrl||m.largeUrl||m.middleUrl||m.url||r?.thumbnailUrl||"").toString(),p=(r?.registeredAt||r?.startTime||r?.postedDateTime||"")?.toString?.()??"",f=r?.owner&&typeof r.owner=="object"?{nickname:(r.owner.nickname??r.owner.name??"")||void 0,name:(r.owner.name??r.owner.nickname??"")||void 0}:null,g=(r?.isChannelVideo||r?.owner?.ownerType==="channel")&&r?.owner?{name:r.owner.name??""}:null;a&&e.push({videoId:s,title:a,viewCount:l,commentCount:h,mylistCount:u,thumbnail:d,postedAt:p,owner:f,channel:g});},i=r=>{if(!r)return;if(Array.isArray(r)){r.forEach(i);return}if(typeof r!="object"||r===null)return;const s=r;(s.id||s.contentId||s.watchId)&&n(s),Object.values(r).forEach(i);};return i(t),e}calculateLevenshteinDistance(t,e){const n=t?t.length:0,i=e?e.length:0;if(n===0)return i;if(i===0)return n;const r=new Array(i+1);for(let a=0;a<=i;++a){const c=r[a]=new Array(n+1);c[0]=a;}const s=r[0];for(let a=1;a<=n;++a)s[a]=a;for(let a=1;a<=i;++a)for(let c=1;c<=n;++c){const l=t[c-1]===e[a-1]?0:1;r[a][c]=Math.min(r[a-1][c]+1,r[a][c-1]+1,r[a-1][c-1]+l);}return r[i][n]}}const A={mypageHeaderTitle:".p-mypageHeader__title",mypageListContainer:".p-mypageMain",watchVideoElement:"video#video",mypageItem:".itemModule.list",mypageItemTitle:".line1",mypageEpisodeNumber:".number.line1 span",mypageEpisodeTitle:".episode.line1 span"};class Mt{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(t){this.delay=t;}getFuncId(t){return this.funcIds.has(t)||this.funcIds.set(t,this.nextId++),this.funcIds.get(t)??0}exec(t){const e=this.getFuncId(t),n=Date.now(),i=this.timers.get(e)?.lastExec??0,r=n-i;if(r>this.delay)t(),this.timers.set(e,{lastExec:n});else {clearTimeout(this.timers.get(e)?.timerId??void 0);const s=setTimeout(()=>{t(),this.timers.set(e,{lastExec:Date.now()});},this.delay-r);this.timers.set(e,{timerId:s,lastExec:i});}}execOnce(t){const e=this.getFuncId(t),n=this.timers.get(e);if(n?.executedOnce){n.timerId&&clearTimeout(n.timerId);return}n?.timerId&&clearTimeout(n.timerId);const i=setTimeout(()=>{try{t();}finally{this.timers.set(e,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(e,{timerId:i,executedOnce:false,scheduled:true});}cancel(t){const e=this.getFuncId(t),n=this.timers.get(e);n?.timerId&&clearTimeout(n.timerId),this.timers.delete(e);}resetExecution(t){const e=this.getFuncId(t),n=this.timers.get(e);n&&(n.timerId&&clearTimeout(n.timerId),this.timers.set(e,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,t]of this.timers)t.timerId&&clearTimeout(t.timerId);this.timers.clear(),this.funcIds.clear();}}const vn=1e3,xn=100,Sn=30,Gt=1e4,Kt=100,wn=/watch\/(?:([a-z]{2}))?(\d+)/gi,k=z("dAnime:VideoSwitchHandler"),Yt=o=>{if(!o?.video)return null;const t=o.video.registeredAt,e=t?new Date(t).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:o.video.id,title:o.video.title,viewCount:o.video.count?.view,mylistCount:o.video.count?.mylist,commentCount:o.video.count?.comment,postedAt:e,thumbnail:o.video.thumbnail?.url,owner:o.owner??null,channel:o.channel??null}},Cn=o=>{const t=[];let e;for(;(e=wn.exec(o))!==null;){const[,n="",i=""]=e;i&&t.push(`${n}${i}`);}return t};class de{constructor(t,e,n,i=vn,r=xn){this.renderer=t,this.fetcher=e,this.settingsManager=n,this.monitorInterval=i,this.debounce=new Mt(r);}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=false;debounce;startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(t){if(!this.isSwitching){this.isSwitching=true;try{const e=await this.resolveVideoElement(t)??null,n=this.preloadedComments??this.lastPreloadedComments??null,i=e?.dataset?.videoId??e?.getAttribute?.("data-video-id")??null,r=this.nextVideoId??i??this.lastVideoId;if(!e||!r&&!n){this.handleMissingVideoInfo(n);return}k.info("videoSwitch:start",{videoId:r??null,elementVideoId:e.dataset?.videoId??null,preloadedCount:n?.length??0}),x.show("動画の切り替わりを検知しました...","info"),this.resetRendererState(e);const s=this.renderer.getVideoElement();if(s!==e&&e)k.debug("videoSwitch:rebind",{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof e.currentSrc=="string"&&e.currentSrc.length>0?e.currentSrc:e.getAttribute("src")??null}),this.renderer.initialize(e),this.renderer.hardReset();else if(s===e&&e&&this.hasVideoSourceChanged(e))k.debug("videoSwitch:rebind:sameElement",{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(e)}),this.renderer.clearComments(),this.renderer.destroy(),this.renderer.initialize(e),this.renderer.hardReset();else if(!s&&!e){k.warn("videoSwitch:missingVideoElement",{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let a=null;r&&(a=await this.fetchVideoApiData(r,n),a&&(this.persistVideoMetadata(a),this.lastVideoId=r));const c=await this.populateComments(r,n);if(c===0?(this.renderer.clearComments(),x.show("コメントを取得できませんでした","warning"),k.warn("videoSwitch:commentsMissing",{videoId:r??null})):k.info("videoSwitch:commentsLoaded",{videoId:r??null,count:c}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(e),a){const l=Yt(a);if(l){const h=`コメントソースを更新しました: ${l.title??"不明なタイトル"}（${c}件）`;x.show(h,c>0?"success":"warning");}}}catch(e){k.error("videoSwitch:error",e,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),x.show(`動画切り替えエラー: ${e.message}`,"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}}async resolveVideoElement(t){if(t){const i=this.getVideoSource(t),r=this.lastVideoSource;return (!i||i===r)&&await this.waitForSourceChange(t),t}const e=Date.now()+Gt;let n=null;for(;Date.now()<e;){const i=document.querySelector(A.watchVideoElement);if(i){n=i;const r=this.hasVideoSourceChanged(i);if(i.readyState>=2||!i.paused||r)return r&&(this.lastVideoSource=null),i}await new Promise(r=>window.setTimeout(r,Kt));}return n}async waitForSourceChange(t){const e=this.getVideoSource(t);if(!e)return;const n=Date.now()+Gt;for(;Date.now()<n;){const i=this.getVideoSource(t);if(i&&i!==e){this.lastVideoSource=null;return}await new Promise(r=>window.setTimeout(r,Kt));}}hasVideoSourceChanged(t){const e=this.getVideoSource(t);return e?this.lastVideoSource?this.lastVideoSource!==e:true:false}getVideoSource(t){if(!t)return null;const e=typeof t.currentSrc=="string"?t.currentSrc:"";if(e.length>0)return e;const n=t.getAttribute("src")??"";if(n.length>0)return n;const i=t.querySelector("source[src]");return i&&typeof i.src=="string"&&i.src.length>0?i.src:null}resetRendererState(t){try{t.currentTime=0;}catch(e){k.debug("videoSwitch:resetCurrentTimeFailed",e);}this.renderer.clearComments(),this.renderer.hardReset();}async checkVideoEnd(){const t=this.renderer.getVideoElement();if(!(!t||!Number.isFinite(t.duration)||t.duration-t.currentTime>Sn)){if(!this.nextVideoId){const n=async()=>{await this.findNextVideoId();};this.debounce.execOnce(n);}if(this.nextVideoId&&!this.preloadedComments){const n=async()=>{await this.preloadComments();};this.debounce.execOnce(n);}}}handleMissingVideoInfo(t){t||(this.renderer.clearComments(),x.show("次の動画のコメントを取得できませんでした。コメント表示をクリアします。","warning"));}async fetchVideoApiData(t,e){try{const n=await this.fetcher.fetchApiData(t);return k.debug("videoSwitch:apiFetched",{videoId:t}),n}catch(n){if(k.error("videoSwitch:apiFetchError",n,{videoId:t}),!e)throw n;return null}}persistVideoMetadata(t){const e=Yt(t);e&&this.settingsManager.saveVideoData(e.title??"",e);}async populateComments(t,e){let n=null;if(Array.isArray(e)&&e.length>0)n=e;else if(t)try{n=await this.fetcher.fetchAllData(t),k.debug("videoSwitch:commentsFetched",{videoId:t,count:n.length});}catch(r){k.error("videoSwitch:commentsFetchError",r,{videoId:t}),x.show(`コメント取得エラー: ${r.message}`,"error"),n=null;}if(!n||n.length===0)return 0;const i=n.filter(r=>!this.renderer.isNGComment(r.text));return i.forEach(r=>{this.renderer.addComment(r.text,r.vposMs,r.commands);}),this.lastPreloadedComments=[...i],i.length}async findNextVideoId(){try{const t=this.fetcher.lastApiData;if(!t)return;const e=t.series?.video?.next?.id;if(e){this.nextVideoId=e,k.debug("videoSwitch:detectedNext",{videoId:e});return}const n=t.video?.description??"";if(!n)return;const i=Cn(n);if(i.length===0)return;const r=[...i].sort((s,a)=>{const c=parseInt(s.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(a.replace(/^[a-z]{2}/i,""),10)||0)-c});this.nextVideoId=r[0]??null,this.nextVideoId&&k.debug("videoSwitch:candidateFromDescription",{candidate:this.nextVideoId});}catch(t){k.error("videoSwitch:nextIdError",t,{lastVideoId:this.lastVideoId});}}async preloadComments(){if(this.nextVideoId)try{const e=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(n=>!this.renderer.isNGComment(n.text));this.preloadedComments=e.length>0?e:null,k.debug("videoSwitch:preloaded",{videoId:this.nextVideoId,count:e.length});}catch(t){k.error("videoSwitch:preloadError",t,{videoId:this.nextVideoId}),this.preloadedComments=null;}}}const Mn=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class ue{static initialize(){ln(Mn);}}var En="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z",kn="M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z",Tn="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",An="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z",Vn="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z",Ln="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z",Rn="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",In="M5,4V7H10.5V19H13.5V7H19V4H5Z",Fn="M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z",Pn="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",Dn="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",_n="M8,5.14V19.14L19,12.14L8,5.14Z",Hn="M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z",On="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";function V(o,t=24){const e=String(t),n=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${n}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${o}"></path></svg>`}const jt=V(_n),zn=V(Tn),Nn=V(Dn),$n=V(Pn),gt=V(An),Wn=V(Fn),qn=V(In),Bn=V(En),Un=V(Rn),Gn=V(Ln),Kn=V(Hn),Yn=V(kn),jn=V(Vn),Xn=V(On),U=z("dAnime:SettingsUI"),b={searchInput:"#searchInput",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",opacitySelect:"#commentOpacity",visibilityToggle:"#commentVisibilityToggle",fixedPlaybackToggle:"#fixedPlaybackToggle",forceRefreshToggle:"#forceRefreshToggle",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",colorValue:".color-value",colorPreview:".color-preview",colorPickerInput:"#colorPickerInput",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",playCurrentVideo:"#playCurrentVideo",settingsModal:"#settingsModal",closeSettingsModal:"#closeSettingsModal",modalOverlay:".settings-modal__overlay",modalTabs:".settings-modal__tab",modalPane:".settings-modal__pane"},X=["search","display","ng"],Xt=`
  .similarity-container {
    position: relative;
    width: 100px;
    height: 18px;
    background-color: var(--bg-primary);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .similarity-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--secondary), var(--primary));
    opacity: 0.6;
    transition: width 0.3s ease;
  }
  .similarity-text {
    position: relative;
    z-index: 1;
    font-size: 12px;
    color: var(--text-primary);
    font-weight: 600;
  }
`,Jn=`
  .settings-modal__footer {
    align-items: center;
  }
  .settings-modal__play-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: var(--primary);
    color: var(--text-primary);
    border-radius: 8px;
    text-align: center;
  }
  .settings-modal__play-icon svg {
    width: 18px;
    height: 18px;
    display:inline-block;
    text-align: center;
  }
  .settings-modal__play-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;class st extends wt{static FAB_HOST_ID="danime-settings-fab-host";settingsManager;fetcher;searcher;settings;playbackSettings;currentVideoInfo;hostElement=null;lastAutoButtonElement=null;activeTab="search";modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;handleFabClick=t=>{t.preventDefault(),this.openSettingsModal();};handleOverlayClick=()=>{this.closeSettingsModal();};handleCloseClick=()=>{this.closeSettingsModal();};handlePlaybackSettingsChanged;constructor(t,e=new Ct,n=new he){super(),this.settingsManager=t,this.fetcher=e,this.searcher=n,this.settings=this.settingsManager.getSettings(),this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData(),this.handlePlaybackSettingsChanged=i=>{this.playbackSettings=i,this.applyPlaybackSettingsToUI();},this.settingsManager.addPlaybackObserver(this.handlePlaybackSettingsChanged);}insertIntoMypage(){const t=document.querySelector(A.mypageHeaderTitle);t&&(this.hostElement=this.createSettingsUI(),t.parentElement?.insertBefore(this.hostElement,t.nextSibling),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}}));}addAutoCommentButtons(){document.querySelectorAll(A.mypageItem).forEach(e=>{const n=e.querySelector(A.mypageItemTitle);if(!n||n.querySelector(".auto-comment-button-host"))return;const i=n.querySelector("span")?.textContent?.trim()??"",r=e.querySelector(A.mypageEpisodeNumber)?.textContent?.trim()??"",s=e.querySelector(A.mypageEpisodeTitle)?.textContent?.trim()??"",a=document.createElement("div");a.className="nico-comment-shadow-host auto-comment-button-host",a.style.cssText="position:absolute;left:150px;top:3px;margin-left:8px;";const c=a.attachShadow({mode:"closed"}),l=document.createElement("style");l.textContent=J.getAutoButtonStyles(),c.appendChild(l);const h=document.createElement("button");h.className="auto-comment-button",h.innerHTML=gt,h.setAttribute("aria-label","コメント設定"),h.setAttribute("title","コメント設定"),h.setAttribute("type","button"),h.addEventListener("click",async u=>{u.preventDefault(),u.stopPropagation(),u.stopImmediatePropagation();try{const m=[i,r,s].filter(Boolean).join(" ");this.openSettingsModal(!1),this.setSearchKeyword(m),this.lastAutoButtonElement=a;try{const p=e.querySelector('input[name="workId"]')?.value?.trim()??"",f=e.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),g=e.querySelector('a.textContainer[href*="partId="]');let y="";const w=(f?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);w?y=w[1]:g?.href&&(y=(new URL(g.href,location.origin).searchParams.get("partId")??"").trim()),p&&y&&this.settingsManager.saveLastDanimeIds({workId:p,partId:y});}catch(p){console.warn("[SettingsUI] save (workId, partId) skipped:",p);}const d=await this.executeSearch(m);if(d.length===0)return;await this.applySearchResult(d[0]);}catch(m){U.error("SettingsUI.autoCommentButton",m);}}),c.appendChild(h),n.appendChild(a),this.lastAutoButtonElement=a;}),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}});}async waitMypageListStable(){const t=document.querySelector(A.mypageListContainer);if(!t)return;let e=t.querySelectorAll(A.mypageItem).length;const n=Date.now()+1500;return new Promise(i=>{const r=new MutationObserver(()=>{const s=t.querySelectorAll(A.mypageItem).length;if(s!==e){e=s;return}Date.now()>=n&&(r.disconnect(),i());});r.observe(t,{childList:true,subtree:true}),setTimeout(()=>{try{r.disconnect();}catch(s){U.debug("waitMypageListStable: observer already disconnected",s);}i();},1600);})}tryRestoreByDanimeIds(){const t=this.settingsManager.loadLastDanimeIds();if(!t)return  false;const e=Array.from(document.querySelectorAll(A.mypageItem));for(const n of e){if(n.querySelector('input[name="workId"]')?.value?.trim()!==t.workId)continue;const r=n.querySelector('a.textContainer[href*="partId="]'),s=r?.href?(new URL(r.href,location.origin).searchParams.get("partId")??"")===t.partId:false,a=n.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),c=(()=>{const h=(a?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);return !!h&&h[1]===t.partId})();if(s||c){const l=n.querySelector(".auto-comment-button-host")??n;return this.lastAutoButtonElement=l,this.updatePlayButtonState(this.currentVideoInfo),true}}return  false}createSettingsUI(){const t=document.createElement("div");t.className="nico-comment-shadow-host settings-host",this.createShadowDOM(t),this.addStyles(J.getCommonStyles());const e=this.buildSettingsHtml();return this.setHTML(e),this.applySettingsToUI(),this.addStyles(Xt),this.setupEventListeners(),t}buildSettingsHtml(){const t=i=>typeof i=="number"?i.toLocaleString():"-",e=i=>{if(!i)return "-";try{return new Date(i).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return i}},n=this.currentVideoInfo;return `
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="バージョン">${on}</span>
        </h2>
        <div class="setting-group current-settings">
          <h3>オーバーレイする動画</h3>
          <div id="currentVideoInfo" class="current-video-info">
            <div class="thumbnail-wrapper">
              <div class="thumbnail-container">
                <img id="currentThumbnail" src="${n?.thumbnail??""}" alt="サムネイル">
                <div class="thumbnail-overlay"></div>
              </div>
            </div>
            <div class="info-container" role="list">
              <div class="info-item info-item--wide" role="listitem" title="動画ID">
                <span class="info-icon" aria-hidden="true">${Wn}</span>
                <span class="sr-only">動画ID</span>
                <span class="info-value" id="currentVideoId">${n?.videoId??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="タイトル">
                <span class="info-icon" aria-hidden="true">${qn}</span>
                <span class="sr-only">タイトル</span>
                <span class="info-value" id="currentTitle">${n?.title??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="投稿者">
                <span class="info-icon" aria-hidden="true">${Bn}</span>
                <span class="sr-only">投稿者</span>
                <span class="info-value" id="currentOwner">${n?.owner?.nickname??n?.channel?.name??"-"}</span>
              </div>
              <div class="info-item" role="listitem" title="再生数">
                <span class="info-icon" aria-hidden="true">${Un}</span>
                <span class="sr-only">再生数</span>
                <span class="info-value" id="currentViewCount">${t(n?.viewCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="コメント数">
                <span class="info-icon" aria-hidden="true">${Gn}</span>
                <span class="sr-only">コメント数</span>
                <span class="info-value" id="currentCommentCount">${t(n?.commentCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="マイリスト数">
                <span class="info-icon" aria-hidden="true">${Kn}</span>
                <span class="sr-only">マイリスト数</span>
                <span class="info-value" id="currentMylistCount">${t(n?.mylistCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="投稿日">
                <span class="info-icon" aria-hidden="true">${Yn}</span>
                <span class="sr-only">投稿日</span>
                <span class="info-value" id="currentPostedAt">${e(n?.postedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}buildModalHtml(){const t=["#FFFFFF","#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF"].map(n=>`<button class="color-preset-btn" data-color="${n}" style="background-color: ${n}"></button>`).join(""),e=["0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.75","0.8","0.9","1.0"].map(n=>`<option value="${n}">${n}</option>`).join("");return `
      <div id="settingsModal" class="settings-modal hidden" role="dialog" aria-modal="true" aria-labelledby="settingsModalTitle" aria-hidden="true">
        <div class="settings-modal__overlay"></div>
        <div class="settings-modal__content">
          <header class="settings-modal__header">
            <h3 id="settingsModalTitle">設定</h3>
            <button id="closeSettingsModal" class="settings-modal__close" type="button" aria-label="設定を閉じる">
              <span aria-hidden="true">${zn}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${gt}</span>
              <span class="settings-modal__tab-label">検索</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="display" role="tab" aria-selected="false" aria-controls="settingsPaneDisplay" id="settingsTabDisplay" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${Nn}</span>
              <span class="settings-modal__tab-label">表示</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${$n}</span>
              <span class="settings-modal__tab-label">NG</span>
            </button>
          </div>
          <div class="settings-modal__panes">
            <section class="settings-modal__pane is-active" data-pane="search" role="tabpanel" id="settingsPaneSearch" aria-labelledby="settingsTabSearch">
              <div class="setting-group search-section">
                <h3>コメントをオーバーレイする動画を検索</h3>
                <div class="search-container">
                  <input type="text" id="searchInput" placeholder="作品名 や エピソード名 で検索">
                  <button id="searchButton">検索</button>
                  <button id="openSearchPageDirect" class="open-search-page-direct-btn">検索ページ</button>
                </div>
                <div id="searchResults" class="search-results"></div>
              </div>
            </section>
            <section class="settings-modal__pane" data-pane="display" role="tabpanel" id="settingsPaneDisplay" aria-labelledby="settingsTabDisplay" aria-hidden="true">
              <div class="setting-group display-settings-group">
                <h3>表示設定</h3>
                <div class="display-settings-grid">
                  <section class="display-settings-item display-settings-item--color" aria-labelledby="displaySettingsColorTitle">
                    <h4 id="displaySettingsColorTitle" class="display-settings-item__title">コメント色</h4>
                    <div class="display-settings-item__body">
                      <div class="color-presets">
                        ${t}
                      </div>
                      <div class="color-picker">
                        <label class="color-picker__label" for="colorPickerInput">カスタムカラー</label>
                        <input type="color" id="colorPickerInput" value="${this.settings.commentColor}">
                        <span class="current-color-display">
                          <span class="color-preview" style="background-color: ${this.settings.commentColor}"></span>
                          <span class="color-value">${this.settings.commentColor}</span>
                        </span>
                      </div>
                      <p class="color-picker__note">プリセットで近い色を選んでから細かく調整できます。</p>
                    </div>
                  </section>
                  <section class="display-settings-item" aria-labelledby="displaySettingsOpacityTitle">
                    <h4 id="displaySettingsOpacityTitle" class="display-settings-item__title">透明度</h4>
                    <div class="display-settings-item__body">
                      <label class="opacity-setting" for="commentOpacity">
                        <span class="opacity-setting__label">透明度</span>
                        <select id="commentOpacity">
                          ${e}
                        </select>
                      </label>
                    </div>
                  </section>
                  <section class="display-settings-item" aria-labelledby="displaySettingsVisibilityTitle">
                    <h4 id="displaySettingsVisibilityTitle" class="display-settings-item__title">表示 / 非表示</h4>
                    <div class="display-settings-item__body">
                      <button id="commentVisibilityToggle" class="toggle-button${this.settings.isCommentVisible?"":" off"}">${this.settings.isCommentVisible?"表示中":"非表示中"}</button>
                    </div>
                  </section>
                  <section class="display-settings-item" aria-labelledby="displaySettingsPlaybackTitle">
                    <h4 id="displaySettingsPlaybackTitle" class="display-settings-item__title">再生速度</h4>
                    <div class="display-settings-item__body">
                      <button
                        id="fixedPlaybackToggle"
                        class="toggle-button${this.playbackSettings.fixedModeEnabled?"":" off"}"
                        type="button"
                        aria-pressed="${this.playbackSettings.fixedModeEnabled?"true":"false"}"
                      >
                        ${this.playbackSettings.fixedModeEnabled?`${this.formatPlaybackRateLabel(this.playbackSettings.fixedRate)}固定中`:"標準速度"}
                      </button>
                      <p class="display-settings-item__note">1.11倍の固定再生モードを有効にすると視聴時間を少し節約できます。</p>
                      <p class="display-settings-item__note">参考:アニメ1話24分の場合、21分36秒で視聴可能です。</p>
                    </div>
                  </section>
                  <section class="display-settings-item" aria-labelledby="displaySettingsForceRefreshTitle">
                    <h4 id="displaySettingsForceRefreshTitle" class="display-settings-item__title">再起動処理</h4>
                    <div class="display-settings-item__body">
                      <button
                        id="forceRefreshToggle"
                        class="toggle-button${this.settings.enableForceRefresh!==false?"":" off"}"
                        type="button"
                        aria-pressed="${this.settings.enableForceRefresh!==false?"true":"false"}"
                      >
                        ${this.settings.enableForceRefresh!==false?"有効":"無効"}
                      </button>
                      <p class="display-settings-item__note">動画再生後10秒後にコメントエンジンを再初期化して強制再描画します。</p>
                      <p class="display-settings-item__note">初期化後に描画済みコメントが残る問題の回避用です。</p>
                    </div>
                  </section>
                </div>
              </div>
            </section>
            <section class="settings-modal__pane" data-pane="ng" role="tabpanel" id="settingsPaneNg" aria-labelledby="settingsTabNg" aria-hidden="true">
              <div class="setting-group ng-settings">
                <div class="ng-settings__column" aria-labelledby="ngWordsTitle">
                  <h3 id="ngWordsTitle" class="ng-settings__title">NGワード</h3>
                  <textarea class="ng-settings__textarea" id="ngWords" placeholder="NGワードを1行ずつ入力">${this.settings.ngWords.join(`
`)}</textarea>
                </div>
                <div class="ng-settings__column" aria-labelledby="ngRegexTitle">
                  <h3 id="ngRegexTitle" class="ng-settings__title">NG正規表現</h3>
                  <textarea class="ng-settings__textarea" id="ngRegexps" placeholder="NG正規表現を1行ずつ入力">${this.settings.ngRegexps.join(`
`)}</textarea>
                </div>
              </div>
            </section>
          </div>
          <footer class="settings-modal__footer">
            <button id="playCurrentVideo" class="settings-modal__play-button" type="button" title="この動画を再生">
              <span class="settings-modal__play-icon" aria-hidden="true">${jt}</span>
              <span class="settings-modal__play-label">動画を再生</span>
            </button>
            <button id="saveSettings" type="button">設定を保存</button>
          </footer>
        </div>
      </div>
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupColorPresets(),this.setupColorPicker(),this.setupOpacitySelect(),this.setupVisibilityToggle(),this.setupPlaybackToggle(),this.setupForceRefreshToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupPlayButton();}setupModalControls(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick);const t=this.createOrUpdateFab(),e=this.queryModalElement(b.settingsModal),n=this.queryModalElement(b.closeSettingsModal),i=this.queryModalElement(b.modalOverlay);this.modalElement=e??null,this.closeButtonElement=n??null,this.overlayElement=i??null,!(!e||!n||!i||!t)&&(this.fabElement?.removeEventListener("click",this.handleFabClick),t.addEventListener("click",this.handleFabClick),t.setAttribute("aria-controls",e.id),t.setAttribute("aria-haspopup","dialog"),t.setAttribute("aria-expanded","false"),this.fabElement=t,n.addEventListener("click",this.handleCloseClick),i.addEventListener("click",this.handleOverlayClick),this.shadowRoot?.addEventListener("keydown",r=>{const s=r;s.key==="Escape"&&!this.modalElement?.classList.contains("hidden")&&(s.preventDefault(),this.closeSettingsModal());}),this.applySettingsToUI());}setupModalTabs(){const t=Array.from(this.queryModalSelectorAll(b.modalTabs)),e=Array.from(this.queryModalSelectorAll(b.modalPane));if(t.length===0||e.length===0)return;const n=i=>{t.forEach(r=>{const a=this.toModalTabKey(r.dataset.tab)===i;r.classList.toggle("is-active",a),r.setAttribute("aria-selected",String(a)),r.setAttribute("tabindex",a?"0":"-1");}),e.forEach(r=>{const a=this.toModalTabKey(r.dataset.pane)===i;r.classList.toggle("is-active",a),r.setAttribute("aria-hidden",String(!a));}),this.activeTab=i;};t.forEach(i=>{i.addEventListener("click",()=>{const r=this.toModalTabKey(i.dataset.tab);r&&n(r);}),i.addEventListener("keydown",r=>{const s=r;if(s.key!=="ArrowRight"&&s.key!=="ArrowLeft")return;s.preventDefault();const a=this.toModalTabKey(i.dataset.tab);if(!a)return;const c=s.key==="ArrowRight"?1:-1,l=(X.indexOf(a)+c+X.length)%X.length,h=X[l];n(h),t.find(m=>this.toModalTabKey(m.dataset.tab)===h)?.focus({preventScroll:true});});}),n(this.activeTab);}openSettingsModal(t=true){!this.modalElement||!this.fabElement||(this.modalElement.classList.remove("hidden"),this.modalElement.setAttribute("aria-hidden","false"),this.fabElement.setAttribute("aria-expanded","true"),t&&this.queryModalElement(`${b.modalTabs}.is-active`)?.focus({preventScroll:true}));}closeSettingsModal(){!this.modalElement||!this.fabElement||(this.modalElement.classList.add("hidden"),this.modalElement.setAttribute("aria-hidden","true"),this.fabElement.setAttribute("aria-expanded","false"),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:true}));}toModalTabKey(t){return t&&X.includes(t)?t:null}setupColorPresets(){this.queryModalSelectorAll(".color-preset-btn").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.color;if(!n)return;this.settings.commentColor=n;const i=this.queryModalElement(b.colorPreview),r=this.queryModalElement(b.colorValue);i&&(i.style.backgroundColor=n),r&&(r.textContent=n);});});}setupColorPicker(){const t=this.queryModalElement(b.colorPickerInput);t&&t.addEventListener("input",()=>{this.settings.commentColor=t.value;const e=this.queryModalElement(b.colorPreview),n=this.queryModalElement(b.colorValue);e&&(e.style.backgroundColor=t.value),n&&(n.textContent=t.value);});}setupOpacitySelect(){const t=this.queryModalElement(b.opacitySelect);t&&(t.value=this.settings.commentOpacity.toString(),t.addEventListener("change",()=>{const e=Number(t.value);Number.isNaN(e)||(this.settings.commentOpacity=e);}));}setupVisibilityToggle(){const t=this.queryModalElement(b.visibilityToggle);t&&(t.addEventListener("click",()=>{this.settings.isCommentVisible=!this.settings.isCommentVisible,this.updateVisibilityToggleState(t);}),this.updateVisibilityToggleState(t));}setupPlaybackToggle(){const t=this.queryModalElement(b.fixedPlaybackToggle);t&&(t.addEventListener("click",()=>{const e=!this.playbackSettings.fixedModeEnabled,n={...this.playbackSettings,fixedModeEnabled:e};if(!this.settingsManager.updatePlaybackSettings(n)){x.show("再生速度の設定変更に失敗しました","error"),this.applyPlaybackSettingsToUI();return}this.playbackSettings=n,this.updatePlaybackToggleState(t),x.show(e?`${this.formatPlaybackRateLabel(this.playbackSettings.fixedRate)}固定モードを有効にしました`:"固定再生モードを無効にしました","success");}),this.updatePlaybackToggleState(t));}setupForceRefreshToggle(){const t=this.queryModalElement(b.forceRefreshToggle);t&&(t.addEventListener("click",()=>{const e=this.settings.enableForceRefresh===false;this.settings.enableForceRefresh=e,this.updateForceRefreshToggleState(t);}),this.updateForceRefreshToggleState(t));}setupNgControls(){const t=this.queryModalElement(b.ngWords);t&&t.classList.remove("hidden");const e=this.queryModalElement(b.ngRegexps);e&&e.classList.remove("hidden");}setupSaveButton(){const t=this.queryModalElement(b.saveButton);t&&t.addEventListener("click",()=>this.saveSettings());}setupSearch(){const t=this.queryModalElement(b.searchInput),e=this.queryModalElement(b.searchButton),n=this.queryModalElement(b.openSearchPage),i=async()=>{const r=t?.value.trim();if(!r){x.show("キーワードを入力してください","warning");return}await this.executeSearch(r);};e?.addEventListener("click",i),t?.addEventListener("keydown",r=>{r.key==="Enter"&&i();}),n?.addEventListener("click",r=>{r.preventDefault();const s=t?.value.trim(),a=s?ce(s):Bt.searchBase;vt().open(a,"_blank","noopener");});}async executeSearch(t){try{x.show(`「${t}」を検索中...`,"info");const e=await this.searcher.search(t);return this.renderSearchResults(e,n=>this.renderSearchResultItem(n)),e.length===0&&x.show("検索結果が見つかりませんでした","warning"),e}catch(e){return U.error("SettingsUI.executeSearch",e),[]}}setSearchKeyword(t){const e=this.queryModalElement(b.searchInput);e&&(e.value=t,e.focus({preventScroll:true}));}renderSearchResults(t,e){const n=this.queryModalElement(b.searchResults);if(!n)return;n.innerHTML=t.map(r=>e(r)).join(""),n.querySelectorAll(".search-result-item").forEach((r,s)=>{r.addEventListener("click",()=>{const c=t[s];this.applySearchResult(c);});const a=r.querySelector(".open-search-page-direct-btn");a&&a.addEventListener("click",c=>{c.stopPropagation();});});}renderSearchResultItem(t){const e=this.formatSearchResultDate(t.postedAt),n=typeof t.similarity=="number"?`
          <div class="similarity-container" title="類似度: ${t.similarity.toFixed(2)}%">
            <div class="similarity-bar" style="width: ${t.similarity.toFixed(2)}%;"></div>
            <span class="similarity-text">${t.similarity.toFixed(0)}%</span>
          </div>
        `:"";return `
      <div class="search-result-item">
        <img src="${t.thumbnail}" alt="thumbnail">
        <div class="search-result-info">
          <div class="title">${t.title}</div>
          <div class="stats">
            <span class="stat-icon" title="再生">
              ${jt}
            </span>
            <span>${t.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="コメント">
              ${jn}
            </span>
            <span>${t.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="マイリスト">
              ${Xn}
            </span>
            <span>${t.mylistCount.toLocaleString()}</span>
            ${n}
          </div>
          <div class="date">${e}</div>
          <a href="${Bt.watchBase}/${t.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(t){try{const e=await this.fetcher.fetchApiData(t.videoId);await this.fetcher.fetchComments(),x.show(`「${t.title}」のコメントを設定しました`,"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(t,e));}catch(e){U.error("SettingsUI.applySearchResult",e);}}buildVideoMetadata(t,e){return {videoId:t.videoId,title:t.title,viewCount:e.video?.count?.view??t.viewCount,commentCount:e.video?.count?.comment??t.commentCount,mylistCount:e.video?.count?.mylist??t.mylistCount,postedAt:e.video?.registeredAt??t.postedAt,thumbnail:e.video?.thumbnail?.url??t.thumbnail,owner:e.owner??t.owner??void 0,channel:e.channel??t.channel??void 0}}applySettingsToUI(){const t=this.queryModalElement(b.opacitySelect),e=this.queryModalElement(b.visibilityToggle),n=this.queryModalElement(b.colorPreview),i=this.queryModalElement(b.colorValue),r=this.queryModalElement(b.ngWords),s=this.queryModalElement(b.ngRegexps);t&&(t.value=this.settings.commentOpacity.toString()),e&&this.updateVisibilityToggleState(e),n&&(n.style.backgroundColor=this.settings.commentColor),i&&(i.textContent=this.settings.commentColor),r&&(r.value=this.settings.ngWords.join(`
`)),s&&(s.value=this.settings.ngRegexps.join(`
`)),this.applyPlaybackSettingsToUI(),this.updatePlayButtonState(this.currentVideoInfo);}saveSettings(){const t=this.queryModalElement(b.opacitySelect),e=this.queryModalElement(b.ngWords),n=this.queryModalElement(b.ngRegexps);if(t){const i=Number(t.value);Number.isNaN(i)||(this.settings.commentOpacity=i);}e&&(this.settings.ngWords=e.value.split(`
`).map(i=>i.trim()).filter(Boolean)),n&&(this.settings.ngRegexps=n.value.split(`
`).map(i=>i.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings)?x.show("設定を保存しました","success"):x.show("設定の保存に失敗しました","error");}updateCurrentVideoInfo(t){this.currentVideoInfo=t,[["currentTitle",t.title??"-"],["currentVideoId",t.videoId??"-"],["currentOwner",t.owner?.nickname??t.channel?.name??"-"],["currentViewCount",this.formatNumber(t.viewCount)],["currentCommentCount",this.formatNumber(t.commentCount)],["currentMylistCount",this.formatNumber(t.mylistCount)],["currentPostedAt",this.formatSearchResultDate(t.postedAt)]].forEach(([i,r])=>{const s=this.querySelector(b[i]);s&&(s.textContent=r);});const n=this.querySelector(b.currentThumbnail);n&&t.thumbnail&&(n.src=t.thumbnail,n.alt=t.title??"サムネイル");try{this.settingsManager.saveVideoData(t.title??"",t);}catch(i){U.error("SettingsUI.updateCurrentVideoInfo",i);}this.updatePlayButtonState(t);}formatNumber(t){return typeof t=="number"?t.toLocaleString():"-"}formatSearchResultDate(t){if(!t)return "-";const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(e)}formatPlaybackRateLabel(t){return `${(Number.isFinite(t)?t:1.11).toFixed(2).replace(/\.?0+$/,"")}倍`}setupPlayButton(){const t=this.queryModalElement(b.playCurrentVideo);t&&(t.addEventListener("click",()=>{try{if(!this.currentVideoInfo?.videoId){x.show("再生できる動画が設定されていません","warning");return}const n=this.lastAutoButtonElement?.closest(".itemModule.list");if(this.lastAutoButtonElement){const i=n?.querySelector(".thumbnailContainer > a, .thumbnail-container > a");if(i){x.show(`「${this.currentVideoInfo?.title||"動画"}」を再生します...`,"success"),setTimeout(()=>{i.click();},300);return}}x.show("再生リンクが見つかりませんでした（対象アイテム内に限定して検索済み）","warning");}catch(e){U.error("SettingsUI.playCurrentVideo",e),x.show(`再生エラー: ${e.message}`,"error");}}),this.updatePlayButtonState(this.currentVideoInfo));}updatePlayButtonState(t){const e=this.queryModalElement(b.playCurrentVideo);if(!e)return;const n=!!t?.videoId;e.disabled=!n,e.setAttribute("aria-disabled",(!n).toString());}updateVisibilityToggleState(t){t.textContent=this.settings.isCommentVisible?"表示中":"非表示中",t.classList.toggle("off",!this.settings.isCommentVisible);}applyPlaybackSettingsToUI(){const t=this.queryModalElement(b.fixedPlaybackToggle);t&&this.updatePlaybackToggleState(t);}updatePlaybackToggleState(t){const e=this.playbackSettings.fixedModeEnabled;t.textContent=e?`${this.formatPlaybackRateLabel(this.playbackSettings.fixedRate)}固定中`:"標準速度",t.classList.toggle("off",!e),t.setAttribute("aria-pressed",e?"true":"false");}updateForceRefreshToggleState(t){const e=this.settings.enableForceRefresh!==false;t.textContent=e?"有効":"無効",t.classList.toggle("off",!e),t.setAttribute("aria-pressed",e?"true":"false");}destroy(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),this.settingsManager.removePlaybackObserver(this.handlePlaybackSettingsChanged),super.destroy();}createOrUpdateFab(){if(!document.body)return null;let t=this.fabHostElement;!t||!t.isConnected?(t?.remove(),t=document.createElement("div"),t.id=st.FAB_HOST_ID,t.style.position="fixed",t.style.bottom="32px",t.style.right="32px",t.style.zIndex="2147483646",t.style.display="inline-block",this.fabShadowRoot=t.attachShadow({mode:"open"}),document.body.appendChild(t),this.fabHostElement=t):this.fabShadowRoot||(this.fabShadowRoot=t.shadowRoot??t.attachShadow({mode:"open"}));const e=this.fabShadowRoot;if(!e)return null;let n=e.querySelector("style[data-role='fab-base-style']");n||(n=document.createElement("style"),n.dataset.role="fab-base-style",n.textContent=J.getCommonStyles(),e.appendChild(n));let i=e.querySelector("style[data-role='fab-style']");i||(i=document.createElement("style"),i.dataset.role="fab-style",i.textContent=`
        :host {
          all: initial;
        }

        .fab-container {
          position: relative;
          display: inline-block;
        }

        .fab-button {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #7F5AF0 0%, #6E44FF 100%);
          color: #FFFFFE;
          box-shadow: 0 18px 36px rgba(36, 13, 78, 0.55);
          padding: 0;
          border: none;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          font: inherit;
        }

        .fab-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 42px rgba(36, 13, 78, 0.6);
        }

        .fab-button:active {
          transform: scale(0.96);
        }

        .fab-button__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .fab-button__icon svg {
          width: 28px;
          height: 28px;
        }

        .fab-button__label {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }
      `,e.appendChild(i));let r=e.querySelector("style[data-role='similarity-style']");r||(r=document.createElement("style"),r.dataset.role="similarity-style",r.textContent=Xt,e.appendChild(r));let s=e.querySelector("style[data-role='modal-play-button-style']");s||(s=document.createElement("style"),s.dataset.role="modal-play-button-style",s.textContent=Jn,e.appendChild(s));let a=e.querySelector(".fab-container");a||(a=document.createElement("div"),a.className="fab-container",e.appendChild(a));let c=a.querySelector("button.fab-button");c||(c=document.createElement("button"),c.type="button",c.className="fab-button",a.appendChild(c)),c.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${gt}</span>
      <span class="fab-button__label">設定</span>
    `,c.setAttribute("aria-label","ニコニココメント設定を開く"),c.setAttribute("aria-haspopup","dialog");let l=a.querySelector(b.settingsModal);return l||(a.insertAdjacentHTML("beforeend",this.buildModalHtml()),l=a.querySelector(b.settingsModal)),this.modalElement=l??null,c}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener("click",this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null;}queryModalElement(t){return this.fabShadowRoot?this.fabShadowRoot.querySelector(t):null}queryModalSelectorAll(t){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}}const Zn=z("dAnime:PlaybackRateController"),Qn=1,ti=200,ei=1e-4;class me{constructor(t){this.settingsManager=t,this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.settingsObserver=e=>{this.playbackSettings=e,this.applyCurrentMode();},this.settingsManager.addPlaybackObserver(this.settingsObserver);}currentVideo=null;playbackSettings;settingsObserver;isApplying=false;retryTimer=null;handleLoadedMetadata=()=>{this.applyCurrentMode();};handleRateChange=()=>{this.isApplying||this.playbackSettings.fixedModeEnabled&&this.scheduleApply();};handlePlay=()=>{this.applyCurrentMode();};handleEmptied=()=>{this.scheduleApply();};bind(t){if(this.currentVideo===t){this.applyCurrentMode();return}this.detachVideoListeners(),this.cancelScheduledApply(),this.currentVideo=t,this.attachVideoListeners(t),this.applyCurrentMode();}unbind(){this.cancelScheduledApply(),this.detachVideoListeners(),this.currentVideo=null;}dispose(){this.unbind(),this.settingsManager.removePlaybackObserver(this.settingsObserver);}attachVideoListeners(t){t.addEventListener("loadedmetadata",this.handleLoadedMetadata),t.addEventListener("ratechange",this.handleRateChange),t.addEventListener("play",this.handlePlay),t.addEventListener("emptied",this.handleEmptied);}detachVideoListeners(){this.currentVideo&&(this.currentVideo.removeEventListener("loadedmetadata",this.handleLoadedMetadata),this.currentVideo.removeEventListener("ratechange",this.handleRateChange),this.currentVideo.removeEventListener("play",this.handlePlay),this.currentVideo.removeEventListener("emptied",this.handleEmptied));}applyCurrentMode(){const t=this.currentVideo;t&&(this.playbackSettings.fixedModeEnabled?this.setPlaybackRate(t,this.playbackSettings.fixedRate):this.setPlaybackRate(t,Qn));}setPlaybackRate(t,e){if(!(!Number.isFinite(e)||e<=0)&&!(Math.abs(t.playbackRate-e)<=ei)){this.isApplying=true;try{t.playbackRate=e;}catch(n){Zn.warn("再生速度の設定に失敗しました",n),this.scheduleApply();}finally{window.setTimeout(()=>{this.isApplying=false;},0);}}}scheduleApply(){this.cancelScheduledApply(),this.retryTimer=window.setTimeout(()=>{this.retryTimer=null,this.applyCurrentMode();},ti);}cancelScheduledApply(){this.retryTimer!==null&&(window.clearTimeout(this.retryTimer),this.retryTimer=null);}}const Jt=async()=>{},ni=()=>{const o=vt();if(!o.dAniRenderer){const t={};o.dAniRenderer={classes:{Comment:v,CommentRenderer:se,NicoApiFetcher:Ct,NotificationManager:x,StyleManager:ue,SettingsUI:st,NicoVideoSearcher:he,VideoSwitchHandler:de,SettingsManager:St,KeyboardShortcutHandler:re,DebounceExecutor:Mt,ShadowDOMComponent:wt,ShadowStyleManager:J,PlaybackRateController:me},instances:t,utils:{initialize:Jt,initializeWithVideo:Jt},debug:{showState:()=>{console.log("Current instances:",t);},showSettings:()=>{const e=t.settingsManager;if(!e){console.log("SettingsManager not initialized");return}console.log("Current settings:",e.getSettings());},showComments:()=>{const e=t.renderer;if(!e){console.log("CommentRenderer not initialized");return}console.log("Current comments:",e.getCommentsSnapshot());}},defaultSettings:q};}return o.dAniRenderer},ii=100,ri=1e3,si=3e3,ai=1e4;class oi{constructor(t){this.global=t;}initialized=false;switchDebounce=new Mt(ri);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;playbackRateController=null;forceRefreshTimer=null;hasForceRefreshed=false;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(t=>{window.addEventListener("load",()=>t(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const t=document.querySelector(A.watchVideoElement);if(!t){window.setTimeout(()=>this.waitForVideoElement(),ii);return}if(t.readyState===0){t.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(t);},{once:true});return}this.initializeWithVideo(t);}async initializeWithVideo(t){if(!this.initialized){this.initialized=true;try{x.show("コメントローダーを初期化中...");const e=x.getInstance(),n=this.global.settingsManager??new St(e);this.global.settingsManager=n,this.global.instances.settingsManager=n;const i=n.loadVideoData();if(!i?.videoId)throw new Error("動画データが見つかりません。マイページで設定してください。");const r=new Ct;this.global.instances.fetcher=r,await r.fetchApiData(i.videoId);const s=await r.fetchComments(),a=this.mergeSettings(n.loadSettings()),c=new se(a);c.initialize(t),this.global.instances.renderer=c,this.currentVideoElement=t;const l=this.playbackRateController??new me(n);this.playbackRateController=l,this.global.instances.playbackRateController=l,l.bind(t),n.addObserver(u=>{c.settings=this.mergeSettings(u);}),s.forEach(u=>{c.addComment(u.text,u.vposMs,u.commands);});const h=new de(c,r,n);h.startMonitoring(),this.global.instances.switchHandler=h,this.setupSwitchHandling(t,h),this.observeVideoElement(),x.show(`コメントの読み込みが完了しました（${s.length}件）`,"success");}catch(e){throw this.initialized=false,x.show(`初期化エラー: ${e.message}`,"error"),e}}}mergeSettings(t){const e=q();return {...e,...t,ngWords:[...t.ngWords??e.ngWords],ngRegexps:[...t.ngRegexps??e.ngRegexps]}}setupSwitchHandling(t,e){this.currentVideoElement=t,this.switchCallback=()=>{const n=Date.now();if(n-this.lastSwitchTimestamp<si)return;this.lastSwitchTimestamp=n;const i=this.currentVideoElement;e.onVideoSwitch(i);},this.global.utils.initializeWithVideo=async n=>{n&&(this.rebindVideoElement(n),this.playbackRateController?.bind(n),await e.onVideoSwitch(n));},this.currentVideoElement=t;}observeVideoElement(){const t=this.currentVideoElement;t&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{const e=document.querySelector(A.watchVideoElement);!e||e===this.currentVideoElement||this.rebindVideoElement(e);}),this.domMutationObserver.observe(document.body,{childList:true,subtree:true}),this.attachVideoEventListeners(t));}rebindVideoElement(t){this.detachVideoEventListeners(),this.clearForceRefreshTimer(),this.hasForceRefreshed=false,this.currentVideoElement=t;const e=this.global.instances.renderer,n=this.global.instances.switchHandler;e&&(e.clearComments(),e.destroy(),e.initialize(t),e.hardReset(),e.resize()),this.playbackRateController?.bind(t),n&&(n.onVideoSwitch(t),this.setupSwitchHandling(t,n)),this.attachVideoEventListeners(t);}attachVideoEventListeners(t){this.detachVideoEventListeners();const e=()=>{this.switchCallback&&(this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));};t.addEventListener("ended",e),t.addEventListener("loadedmetadata",e),t.addEventListener("emptied",e),this.videoEndedListener=e,t.addEventListener("play",()=>{this.scheduleForceRefresh();},{once:true});}detachVideoEventListeners(){const t=this.currentVideoElement;t&&this.videoEndedListener&&(t.removeEventListener("ended",this.videoEndedListener),t.removeEventListener("loadedmetadata",this.videoEndedListener),t.removeEventListener("emptied",this.videoEndedListener)),this.videoEndedListener=null;}scheduleForceRefresh(){if(this.hasForceRefreshed)return;this.clearForceRefreshTimer();const t=this.global.instances.renderer,e=this.global.settingsManager;!t||!e||e.getSettings().enableForceRefresh===false||(this.forceRefreshTimer=setTimeout(()=>{this.forceRefreshComments();},ai));}forceRefreshComments(){const t=this.global.instances.renderer;if(!(!t||this.hasForceRefreshed))try{const e=t.getCommentsSnapshot();if(e.length===0)return;t.clearComments(),t.hardReset(),e.forEach(n=>{const i=n.commands??[];t.addComment(n.text,n.vposMs,i);}),this.hasForceRefreshed=!0,this.clearForceRefreshTimer();}catch(e){console.error("[WatchPageController] Force refresh failed",e);}}clearForceRefreshTimer(){this.forceRefreshTimer!==null&&(clearTimeout(this.forceRefreshTimer),this.forceRefreshTimer=null);}}const li=100;class ci{constructor(t){this.global=t;}initialize(){const t=x.getInstance(),e=this.global.settingsManager??new St(t);this.global.settingsManager=e,this.global.instances.settingsManager=e;const n=new st(e);this.waitForHeader(n);}waitForHeader(t){if(!document.querySelector(A.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(t),li);return}t.insertIntoMypage(),t.addAutoCommentButtons(),this.observeList(t);}observeList(t){const e=document.querySelector(A.mypageListContainer);if(!e)return;new MutationObserver(()=>{try{t.addAutoCommentButtons();}catch(i){console.error("[MypageController] auto comment buttons update failed",i);}}).observe(e,{childList:true,subtree:true});}}class hi{log;global=ni();watchController=null;mypageController=null;constructor(){this.log=z("DanimeApp");}start(){this.log.info("starting renderer"),ue.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const t=location.pathname.toLowerCase();try{t.includes("/animestore/sc_d_pc")?(this.watchController=new oi(this.global),await this.watchController.initialize()):t.includes("/animestore/mp_viw_pc")?(this.mypageController=new ci(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(e){this.log.error("initialization failed",e);}}acquireInstanceLock(){const t=vt();return t.__dAnimeNicoCommentRenderer2Instance=(t.__dAnimeNicoCommentRenderer2Instance??0)+1,t.__dAnimeNicoCommentRenderer2Instance===1}}const ft=z("dAnimeNicoCommentRenderer2");async function di(){ft.info("bootstrap start");try{new hi().start(),ft.info("bootstrap completed");}catch(o){ft.error("bootstrap failed",o);}}di();

})();