// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      6.15.5
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

  const At={debug:"debug",info:"info",warn:"warn",error:"error"},F=e=>{const t=`[${e}]`,n={};return Object.keys(At).forEach(i=>{const r=At[i];n[i]=(...s)=>{(console[r]??console.log)(t,...s);};}),n};function vt(){return typeof unsafeWindow<"u"?unsafeWindow:window}const De={small:.8,medium:1,big:1.4},He={defont:'"MS PGothic","Hiragino Kaku Gothic ProN","Hiragino Kaku Gothic Pro","Yu Gothic UI","Yu Gothic","Meiryo","Segoe UI","Osaka","Noto Sans CJK JP","Noto Sans JP","Source Han Sans JP","IPAPGothic","TakaoPGothic","Roboto","Helvetica Neue","Helvetica","Arial","sans-serif"',gothic:'"Noto Sans CJK JP","Noto Sans JP","Source Han Sans JP","Yu Gothic","Yu Gothic Medium","Meiryo","MS PGothic","Hiragino Kaku Gothic ProN","Segoe UI","Helvetica","Arial","sans-serif"',mincho:'"MS PMincho","MS Mincho","Hiragino Mincho ProN","Hiragino Mincho Pro","Yu Mincho","Noto Serif CJK JP","Noto Serif JP","Source Han Serif JP","Times New Roman","serif"'},ne={white:"#FFFFFC",red:"#FF8888",pink:"#FFA5CC",orange:"#FFBA66",yellow:"#FFFFAA",green:"#88FF88",cyan:"#88FFFF",blue:"#8899FF",purple:"#D9A5FF",black:"#444444",white2:"#CC9",red2:"#C03",pink2:"#F3C",orange2:"#F60",yellow2:"#990",green2:"#0C6",cyan2:"#0CC",blue2:"#39F",purple2:"#63C",black2:"#666"},xt=/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,Oe=/^[,.:;]+/,Ne=/[,.:;]+$/,ze=e=>{const t=e.trim();return t?xt.test(t)?t:t.replace(Oe,"").replace(Ne,""):""},$e=e=>xt.test(e)?e.toUpperCase():null,ie=e=>{const t=e.trim();if(!t)return null;const n=t.toLowerCase().endsWith("px")?t.slice(0,-2):t,i=Number.parseFloat(n);return Number.isFinite(i)?i:null},We=e=>{const t=e.trim();if(!t)return null;if(t.endsWith("%")){const n=Number.parseFloat(t.slice(0,-1));return Number.isFinite(n)?n/100:null}return ie(t)},Be=e=>Number.isFinite(e)?Math.min(100,Math.max(-100,e)):0,qe=e=>!Number.isFinite(e)||e===0?1:Math.min(5,Math.max(.25,e)),Ue=e=>e==="naka"||e==="ue"||e==="shita",Ge=e=>e==="small"||e==="medium"||e==="big",Ke=e=>e==="defont"||e==="gothic"||e==="mincho",Ye=e=>e in ne,je=(e,t)=>{let n="naka",i="medium",r="defont",s=null,a=1,o=null,l=false,d=0,u=1;for(const p of e){const v=ze(typeof p=="string"?p:"");if(!v)continue;if(xt.test(v)){const M=$e(v);if(M){s=M;continue}}const y=v.toLowerCase();if(Ue(y)){n=y;continue}if(Ge(y)){i=y;continue}if(Ke(y)){r=y;continue}if(Ye(y)){s=ne[y].toUpperCase();continue}if(y==="_live"){o=.5;continue}if(y==="invisible"){a=0,l=true;continue}if(y.startsWith("ls:")||y.startsWith("letterspacing:")){const M=v.indexOf(":");if(M>=0){const S=ie(v.slice(M+1));S!==null&&(d=Be(S));}continue}if(y.startsWith("lh:")||y.startsWith("lineheight:")){const M=v.indexOf(":");if(M>=0){const S=We(v.slice(M+1));S!==null&&(u=qe(S));}continue}}const c=Math.max(0,Math.min(1,a)),h=(s??t.defaultColor).toUpperCase(),m=typeof o=="number"?Math.max(0,Math.min(1,o)):null;return {layout:n,size:i,sizeScale:De[i],font:r,fontFamily:He[r],resolvedColor:h,colorOverride:s,opacityMultiplier:c,opacityOverride:m,isInvisible:l,letterSpacing:d,lineHeight:u}},Xe=/^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i,J=e=>e.length===1?e.repeat(2):e,O=e=>Number.parseInt(e,16),B=e=>!Number.isFinite(e)||e<=0?0:e>=1?1:e,re=(e,t)=>{const n=Xe.exec(e);if(!n)return e;const i=n[1];let r,s,a,o=1;i.length===3||i.length===4?(r=O(J(i[0])),s=O(J(i[1])),a=O(J(i[2])),i.length===4&&(o=O(J(i[3]))/255)):(r=O(i.slice(0,2)),s=O(i.slice(2,4)),a=O(i.slice(4,6)),i.length===8&&(o=O(i.slice(6,8))/255));const l=B(o*B(t));return `rgba(${r}, ${s}, ${a}, ${l})`},Je=()=>({now:()=>typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now()}),se=()=>Je(),R=e=>e*1e3,Ze=e=>!Number.isFinite(e)||e<0?null:Math.round(e),wt=4e3,Lt=1800,Qe=3,tn=.25,en=32,nn=48,rt=120,rn=4e3,dt=120,sn=800,an=2,K=4e3,W=4e3,_=W+wt,on=1e3,Rt=1,ae=12,oe=24,k=.001,z=50,ln=5,cn=2,Ft=8,dn=12,hn=500,un=3e3,_t={debug:0,info:1,warn:2,error:3},mn=(e,t,n)=>{const i=[`[${t}]`,...n];switch(e){case "debug":console.debug(...i);break;case "info":console.info(...i);break;case "warn":console.warn(...i);break;case "error":console.error(...i);break;default:console.log(...i);}},le=(e,t={})=>{const{level:n="info",emitter:i=mn}=t,r=_t[n],s=(a,o)=>{_t[a]<r||i(a,e,o);};return {debug:(...a)=>s("debug",a),info:(...a)=>s("info",a),warn:(...a)=>s("warn",a),error:(...a)=>s("error",a)}},St=le("CommentEngine:Comment"),Dt=new WeakMap,pn=e=>{let t=Dt.get(e);return t||(t=new Map,Dt.set(e,t)),t},Ct=(e,t)=>{if(!e)return 0;const n=`${e.font??""}::${t}`,i=pn(e),r=i.get(n);if(r!==void 0)return r;const s=e.measureText(t).width;return i.set(n,s),s},gn=e=>{if(e.includes(`
`)){const t=e.split(/\r?\n/);return t.length>0?t:[""]}return [e]},Ht=e=>Math.max(24,e),ht=(e,t)=>{let n=0;const i=e.letterSpacing;for(const a of e.lines){const o=Ct(t,a),l=a.length>1?i*(a.length-1):0,d=Math.max(0,o+l);d>n&&(n=d);}e.width=n;const r=Math.max(1,Math.floor(e.fontSize*e.lineHeightMultiplier));e.lineHeightPx=r;const s=e.lines.length>1?(e.lines.length-1)*r:0;e.height=e.fontSize+s;},fn=(e,t,n,i,r)=>{try{if(!t)throw new Error("Canvas context is required");if(!Number.isFinite(n)||!Number.isFinite(i))throw new Error("Canvas dimensions must be numbers");if(!r)throw new Error("Prepare options are required");const s=Math.max(n,1),a=Ht(Math.floor(i*.05)),o=Ht(Math.floor(a*e.sizeScale));e.fontSize=o,t.font=`${e.fontSize}px ${e.fontFamily}`,e.lines=gn(e.text),ht(e,t);const l=!e.isScrolling&&(e.layout==="ue"||e.layout==="shita");if(l){const L=Math.max(1,s-Ft*2);if(e.width>L){const H=Math.max(dn,Math.min(e.fontSize,Math.floor(a*.6))),ct=L/Math.max(e.width,1),q=Math.max(H,Math.floor(e.fontSize*Math.min(ct,1)));q<e.fontSize&&(e.fontSize=q,t.font=`${e.fontSize}px ${e.fontFamily}`,ht(e,t));let Pt=0;for(;e.width>L&&e.fontSize>H&&Pt<5;){const _e=L/Math.max(e.width,1),It=Math.max(H,Math.floor(e.fontSize*Math.max(_e,.7)));It>=e.fontSize?e.fontSize=Math.max(H,e.fontSize-1):e.fontSize=It,t.font=`${e.fontSize}px ${e.fontFamily}`,ht(e,t),Pt+=1;}}}if(!e.isScrolling){e.bufferWidth=0;const L=l?Ft:0,H=Math.max((s-e.width)/2,L),ct=Math.max(L,s-e.width-L),q=Math.min(H,Math.max(ct,L));e.virtualStartX=q,e.x=q,e.baseSpeed=0,e.speed=0,e.speedPixelsPerMs=0,e.visibleDurationMs=W,e.preCollisionDurationMs=W,e.totalDurationMs=W,e.reservationWidth=e.width,e.staticExpiryTimeMs=e.vposMs+W,e.lastUpdateTime=e.getTimeSource().now(),e.isPaused=!1;return}e.staticExpiryTimeMs=null;const d=Ct(t,"??".repeat(150)),u=e.width*Math.max(r.bufferRatio,0);e.bufferWidth=Math.max(r.baseBufferPx,u);const c=Math.max(r.entryBufferPx,e.bufferWidth),h=e.scrollDirection,m=h==="rtl"?s+r.virtualExtension:-e.width-e.bufferWidth-r.virtualExtension,p=h==="rtl"?-e.width-e.bufferWidth-c:s+c,v=h==="rtl"?s+c:-c,y=h==="rtl"?m+e.width+e.bufferWidth:m-e.bufferWidth;e.virtualStartX=m,e.x=m,e.exitThreshold=p;const M=s>0?e.width/s:0,S=r.maxVisibleDurationMs===r.minVisibleDurationMs;let A=r.maxVisibleDurationMs;if(!S&&M>1){const L=Math.min(M,r.maxWidthRatio),H=r.maxVisibleDurationMs/Math.max(L,1);A=Math.max(r.minVisibleDurationMs,Math.floor(H));}const T=s+e.width+e.bufferWidth+c,Ie=Math.max(A,1),lt=T/Ie,Ae=lt*1e3/60;e.baseSpeed=Ae,e.speed=e.baseSpeed,e.speedPixelsPerMs=lt;const Le=Math.abs(p-m),Re=h==="rtl"?Math.max(0,y-v):Math.max(0,v-y),Vt=Math.max(lt,Number.EPSILON);e.visibleDurationMs=A,e.preCollisionDurationMs=Math.max(0,Math.ceil(Re/Vt)),e.totalDurationMs=Math.max(e.preCollisionDurationMs,Math.ceil(Le/Vt));const Fe=e.width+e.bufferWidth+c;e.reservationWidth=Math.min(d,Fe),e.lastUpdateTime=e.getTimeSource().now(),e.isPaused=!1;}catch(s){throw St.error("Comment.prepare",s,{text:e.text,visibleWidth:n,canvasHeight:i,hasContext:!!t}),s}},ce=5,D={enabled:false,maxLogsPerCategory:ce},it=new Map,bn=e=>{if(e===void 0||!Number.isFinite(e))return ce;const t=Math.max(1,Math.floor(e));return Math.min(1e4,t)},yn=e=>{D.enabled=!!e.enabled,D.maxLogsPerCategory=bn(e.maxLogsPerCategory),D.enabled||it.clear();},N=()=>D.enabled,vn=e=>{const t=it.get(e)??0;return t>=D.maxLogsPerCategory?(t===D.maxLogsPerCategory&&(console.debug(`[CommentOverlay][${e}]`,"Further logs suppressed."),it.set(e,t+1)),false):(it.set(e,t+1),true)},C=(e,...t)=>{D.enabled&&vn(e)&&console.debug(`[CommentOverlay][${e}]`,...t);},Y=(e,t=32)=>e.length<=t?e:`${e.slice(0,t)}…`,xn=(e,t)=>{D.enabled&&(console.group(`[CommentOverlay][state-dump] ${e}`),console.table({"Current Time":`${t.currentTime.toFixed(2)}ms`,Duration:`${t.duration.toFixed(2)}ms`,"Is Playing":t.isPlaying,"Epoch ID":t.epochId,"Total Comments":t.totalComments,"Active Comments":t.activeComments,"Reserved Lanes":t.reservedLanes,"Final Phase":t.finalPhaseActive,"Playback Begun":t.playbackHasBegun,"Is Stalled":t.isStalled}),console.groupEnd());},wn=(e,t,n)=>{D.enabled&&C("epoch-change",`Epoch changed: ${e} → ${t} (reason: ${n})`);},x={hits:0,misses:0,creates:0,fallbacks:0,outlineCallsInCache:0,fillCallsInCache:0,outlineCallsInFallback:0,fillCallsInFallback:0,letterSpacingComments:0,normalComments:0,multiLineComments:0,totalCharactersDrawn:0,lastReported:0},Ot=()=>{if(!N())return;const e=performance.now();if(e-x.lastReported<=5e3)return;const t=x.hits+x.misses,n=t>0?x.hits/t*100:0,i=x.creates>0?(x.totalCharactersDrawn/x.creates).toFixed(1):"0",r=x.outlineCallsInCache+x.outlineCallsInFallback,s=x.fillCallsInCache+x.fillCallsInFallback;console.log("[TextureCache Stats]",`
  Cache: Hits=${x.hits}, Misses=${x.misses}, Hit Rate=${n.toFixed(1)}%`,`
  Creates: ${x.creates}, Fallbacks: ${x.fallbacks}`,`
  Comments: Normal=${x.normalComments}, LetterSpacing=${x.letterSpacingComments}, MultiLine=${x.multiLineComments}`,`
  Draw Calls: Outline=${r}, Fill=${s}`,`
  Avg Characters/Comment: ${i}`),x.lastReported=e;},Sn=()=>typeof OffscreenCanvas<"u",de=(e,t,n)=>{if(e==="none")return {blur:0,alpha:0};const i={light:.06,medium:.1,strong:.15}[e],r={light:.6,medium:.8,strong:.95}[e],s=Math.max(2,t*i),a=B(n*r);return {blur:s,alpha:a}},he=(e,t,n,i,r)=>(s,a,o,l=0)=>{if(s.length===0)return;const d=r+l,u=()=>{i==="cache"?o==="outline"?x.outlineCallsInCache++:x.fillCallsInCache++:o==="outline"?x.outlineCallsInFallback++:x.fillCallsInFallback++;};if(Math.abs(e.letterSpacing)<Number.EPSILON){u(),t.fillText(s,d,a);return}let c=d;for(let h=0;h<s.length;h+=1){const m=s[h];u(),t.fillText(m,c,a);const p=Ct(n,m);c+=p,h<s.length-1&&(c+=e.letterSpacing);}},Cn=e=>`v2::${e.text}::${e.fontSize}::${e.fontFamily}::${e.color}::${e.opacity}::${e.renderStyle}::${e.letterSpacing}::${e.lines.length}`,Mn=(e,t)=>{if(!Sn())return null;const n=Math.abs(e.letterSpacing)>=Number.EPSILON,i=e.lines.length>1;n&&x.letterSpacingComments++,i&&x.multiLineComments++,!n&&!i&&x.normalComments++,x.totalCharactersDrawn+=e.text.length;const r=Math.max(10,e.fontSize*.5),s=Math.ceil(e.width+r*2),a=Math.ceil(e.height+r*2),o=new OffscreenCanvas(s,a),l=o.getContext("2d");if(!l)return null;l.save(),l.font=`${e.fontSize}px ${e.fontFamily}`;const d=B(e.opacity),u=r,c=e.lines.length>0?e.lines:[e.text],h=e.lines.length>1&&e.lineHeightPx>0?e.lineHeightPx:e.fontSize,m=r+e.fontSize,p=he(e,l,t,"cache",u),v=re(e.color,d),y=de(e.shadowIntensity,e.fontSize,d);return N()&&console.log("[Shadow Debug - Cache]",`
  Text: "${e.text}"`,`
  FontSize: ${e.fontSize}`,`
  Shadow intensity: ${e.shadowIntensity}`,`
  Shadow blur: ${y.blur}px`,`
  Shadow alpha: ${y.alpha}`,`
  Fill style: ${v}`),l.save(),l.shadowColor=`rgba(0, 0, 0, ${y.alpha})`,l.shadowBlur=y.blur,l.shadowOffsetX=0,l.shadowOffsetY=0,l.fillStyle=v,c.forEach((M,S)=>{const A=m+S*h;p(M,A,"fill");}),l.restore(),l.restore(),o},En=(e,t,n)=>{x.fallbacks++,t.save(),t.font=`${e.fontSize}px ${e.fontFamily}`;const i=B(e.opacity),r=n??e.x,s=e.lines.length>0?e.lines:[e.text],a=e.lines.length>1&&e.lineHeightPx>0?e.lineHeightPx:e.fontSize,o=e.y+e.fontSize,l=he(e,t,t,"fallback",r),d=re(e.color,i),u=de(e.shadowIntensity,e.fontSize,i);N()&&console.log("[Shadow Debug - Fallback]",`
  Text: "${e.text}"`,`
  FontSize: ${e.fontSize}`,`
  Shadow intensity: ${e.shadowIntensity}`,`
  Shadow blur: ${u.blur}px`,`
  Shadow alpha: ${u.alpha}`,`
  Fill style: ${d}`),t.save(),t.shadowColor=`rgba(0, 0, 0, ${u.alpha})`,t.shadowBlur=u.blur,t.shadowOffsetX=0,t.shadowOffsetY=0,t.fillStyle=d,s.forEach((c,h)=>{const m=o+h*a;l(c,m,"fill");}),t.restore(),t.restore();},Tn=(e,t,n)=>{try{if(!e.isActive||!t)return;const i=Cn(e),r=e.getCachedTexture();if(e.getTextureCacheKey()!==i||!r){x.misses++,x.creates++;const a=Mn(e,t);e.setCachedTexture(a),e.setTextureCacheKey(i);}else x.hits++;const s=e.getCachedTexture();if(s){const a=n??e.x,o=Math.max(10,e.fontSize*.5);t.drawImage(s,a-o,e.y-o),Ot();return}En(e,t,n),Ot();}catch(i){St.error("Comment.draw",i,{text:e.text,isActive:e.isActive,hasContext:!!t,interpolatedX:n});}},kn=e=>e==="ltr"?"ltr":"rtl",Vn=e=>e==="ltr"?1:-1;class ue{text;vposMs;commands;layout;isScrolling;sizeScale;opacityMultiplier;opacityOverride;colorOverride;isInvisible;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily;opacity;activationTimeMs=null;staticExpiryTimeMs=null;isActive=false;hasShown=false;isPaused=false;lastUpdateTime=0;reservationWidth=0;bufferWidth=0;visibleDurationMs=0;totalDurationMs=0;preCollisionDurationMs=0;speedPixelsPerMs=0;virtualStartX=0;exitThreshold=0;scrollDirection="rtl";renderStyle="outline-only";shadowIntensity="medium";creationIndex=0;letterSpacing=0;lineHeightMultiplier=1;lineHeightPx=0;lines=[];epochId=0;directionSign=-1;timeSource;lastSyncedSettingsVersion=-1;cachedTexture=null;textureCacheKey="";constructor(t,n,i,r,s={}){if(typeof t!="string")throw new Error("Comment text must be a string");if(!Number.isFinite(n)||n<0)throw new Error("Comment vposMs must be a non-negative number");this.text=t,this.vposMs=n,this.commands=Array.isArray(i)?[...i]:[];const a=je(this.commands,{defaultColor:r.commentColor});this.layout=a.layout,this.isScrolling=this.layout==="naka",this.sizeScale=a.sizeScale,this.opacityMultiplier=a.opacityMultiplier,this.opacityOverride=a.opacityOverride,this.colorOverride=a.colorOverride,this.isInvisible=a.isInvisible,this.fontFamily=a.fontFamily,this.color=a.resolvedColor,this.opacity=this.getEffectiveOpacity(r.commentOpacity),this.renderStyle=r.renderStyle,this.shadowIntensity=r.shadowIntensity,this.letterSpacing=a.letterSpacing,this.lineHeightMultiplier=a.lineHeight,this.timeSource=s.timeSource??se(),this.applyScrollDirection(r.scrollDirection),this.syncWithSettings(r,s.settingsVersion);}prepare(t,n,i,r){fn(this,t,n,i,r);}draw(t,n=null){Tn(this,t,n);}update(t=1,n=false){try{if(!this.isActive){this.isPaused=n;return}const i=this.timeSource.now();if(!this.isScrolling){this.isPaused=n,this.lastUpdateTime=i;return}if(n){this.isPaused=!0,this.lastUpdateTime=i;return}const r=(i-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*t,this.x+=this.speed*r*this.directionSign,(this.scrollDirection==="rtl"&&this.x<=this.exitThreshold||this.scrollDirection==="ltr"&&this.x>=this.exitThreshold)&&(this.isActive=!1),this.lastUpdateTime=i,this.isPaused=!1;}catch(i){St.error("Comment.update",i,{text:this.text,playbackRate:t,isPaused:n,isActive:this.isActive});}}syncWithSettings(t,n){typeof n=="number"&&n===this.lastSyncedSettingsVersion||(this.color=this.getEffectiveColor(t.commentColor),this.opacity=this.getEffectiveOpacity(t.commentOpacity),this.applyScrollDirection(t.scrollDirection),this.renderStyle=t.renderStyle,this.shadowIntensity=t.shadowIntensity,typeof n=="number"&&(this.lastSyncedSettingsVersion=n));}getEffectiveColor(t){const n=this.colorOverride??t;return typeof n!="string"||n.length===0?t:n.toUpperCase()}getEffectiveOpacity(t){if(typeof this.opacityOverride=="number")return B(this.opacityOverride);const n=t*this.opacityMultiplier;return Number.isFinite(n)?B(n):0}markActivated(t){this.activationTimeMs=t;}clearActivation(){this.activationTimeMs=null,this.isScrolling||(this.staticExpiryTimeMs=null),this.resetTextureCache();}hasStaticExpired(t){return this.isScrolling||this.staticExpiryTimeMs===null?false:t>=this.staticExpiryTimeMs}getDirectionSign(){return this.directionSign}getTimeSource(){return this.timeSource}getTextureCacheKey(){return this.textureCacheKey}setTextureCacheKey(t){this.textureCacheKey=t;}getCachedTexture(){return this.cachedTexture}setCachedTexture(t){this.cachedTexture=t;}resetTextureCache(){this.cachedTexture=null,this.textureCacheKey="";}applyScrollDirection(t){const n=kn(t);this.scrollDirection=n,this.directionSign=Vn(n);}}const Pn=4e3,ut={commentColor:"#FFFFFF",commentOpacity:1,isCommentVisible:true,useContainerResizeObserver:true,ngWords:[],ngRegexps:[],scrollDirection:"rtl",renderStyle:"outline-only",syncMode:"raf",scrollVisibleDurationMs:Pn,useFixedLaneCount:false,fixedLaneCount:12,useDprScaling:true,enableAutoHardReset:true,shadowIntensity:"medium"},me=()=>({...ut,ngWords:[...ut.ngWords],ngRegexps:[...ut.ngRegexps]}),In=e=>Number.isFinite(e)?e<=0?0:e>=1?1:e:1,pe=(e,t=0)=>t===0?ln:cn,Z=e=>{const t=e.scrollVisibleDurationMs,n=t==null?null:Number.isFinite(t)?Math.max(1,Math.floor(t)):null;return {...e,scrollDirection:e.scrollDirection==="ltr"?"ltr":"rtl",commentOpacity:In(e.commentOpacity),renderStyle:e.renderStyle==="classic"?"classic":"outline-only",scrollVisibleDurationMs:n,syncMode:e.syncMode==="video-frame"?"video-frame":"raf",useDprScaling:!!e.useDprScaling,enableAutoHardReset:e.enableAutoHardReset!==false}},An=e=>typeof window<"u"&&typeof window.requestAnimationFrame=="function"&&typeof window.cancelAnimationFrame=="function"?{request:t=>window.requestAnimationFrame(t),cancel:t=>window.cancelAnimationFrame(t)}:{request:t=>globalThis.setTimeout(()=>{t(e.now());},16),cancel:t=>{globalThis.clearTimeout(t);}},Ln=()=>typeof document>"u"?()=>{throw new Error("Document is not available. Provide a custom createCanvasElement implementation.")}:()=>document.createElement("canvas"),Rn=e=>{if(!e||typeof e!="object")return  false;const t=e;return typeof t.commentColor=="string"&&typeof t.commentOpacity=="number"&&typeof t.isCommentVisible=="boolean"},Fn=function(e){if(!Array.isArray(e)||e.length===0)return [];const t=[];this.commentDependencies.settingsVersion=this.settingsVersion;for(const n of e){const{text:i,vposMs:r,commands:s=[]}=n,a=Y(i);if(this.isNGComment(i)){C("comment-skip-ng",{preview:a,vposMs:r});continue}const o=Ze(r);if(o===null){this.log.warn("CommentRenderer.addComment.invalidVpos",{text:i,vposMs:r}),C("comment-skip-invalid-vpos",{preview:a,vposMs:r});continue}if(this.comments.some(d=>d.text===i&&d.vposMs===o)||t.some(d=>d.text===i&&d.vposMs===o)){C("comment-skip-duplicate",{preview:a,vposMs:o});continue}const l=new ue(i,o,s,this._settings,this.commentDependencies);l.creationIndex=this.commentSequence++,l.epochId=this.epochId,t.push(l),C("comment-added",{preview:a,vposMs:o,commands:l.commands.length,layout:l.layout,isScrolling:l.isScrolling,invisible:l.isInvisible});}return t.length===0?[]:(this.comments.push(...t),this.finalPhaseActive&&(this.finalPhaseScheduleDirty=true),this.comments.sort((n,i)=>{const r=n.vposMs-i.vposMs;return Math.abs(r)>k?r:n.creationIndex-i.creationIndex}),t)},_n=function(e,t,n=[]){const[i]=this.addComments([{text:e,vposMs:t,commands:n}]);return i??null},Dn=function(){if(this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.commentSequence=0,this.ctx&&this.canvas){const e=this.canvasDpr>0?this.canvasDpr:1,t=this.displayWidth>0?this.displayWidth:this.canvas.width/e,n=this.displayHeight>0?this.displayHeight:this.canvas.height/e;this.ctx.clearRect(0,0,t,n);}},Hn=function(){this.clearComments(),this.currentTime=0,this.resetFinalPhaseState(),this.playbackHasBegun=false,this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false;},ge=function(){const e=this._settings,t=Array.isArray(e.ngWords)?e.ngWords:[];this.normalizedNgWords=t.filter(i=>typeof i=="string");const n=Array.isArray(e.ngRegexps)?e.ngRegexps:[];this.compiledNgRegexps=n.map(i=>{if(typeof i!="string")return null;try{return new RegExp(i,"i")}catch(r){return this.log.warn("CommentRenderer.invalidNgRegexp",r,{entry:i}),null}}).filter(i=>!!i);},On=function(e){return typeof e!="string"||e.length===0?false:this.normalizedNgWords.some(t=>t.length>0&&e.includes(t))?true:this.compiledNgRegexps.some(t=>t.test(e))},Nn=e=>{e.prototype.addComments=Fn,e.prototype.addComment=_n,e.prototype.clearComments=Dn,e.prototype.resetState=Hn,e.prototype.rebuildNgMatchers=ge,e.prototype.isNGComment=On;},zn=function(){const e=this.canvas,t=this.ctx,n=this.timeSource.now();if(this.lastHardResetAt=n,this.incrementEpoch("manual-reset"),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.comments.forEach(i=>{i.isActive=false,i.hasShown=false,i.lane=-1,i.clearActivation(),i.epochId=this.epochId;}),e&&t){const i=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:e.width/i,s=this.displayHeight>0?this.displayHeight:e.height/i;t.clearRect(0,0,r,s);}this.pendingInitialSync=true,this.resetFinalPhaseState(),this.emitStateSnapshot("hardReset");},$n=function(){this.finalPhaseActive=false,this.finalPhaseStartTime=null,this.finalPhaseScheduleDirty=false,this.finalPhaseVposOverrides.clear();},Wn=function(e){const t=this.epochId;if(this.epochId+=1,wn(t,this.epochId,e),this.eventHooks.onEpochChange){const n={previousEpochId:t,newEpochId:this.epochId,reason:e,timestamp:this.timeSource.now()};try{this.eventHooks.onEpochChange(n);}catch(i){this.log.error("CommentRenderer.incrementEpoch.callback",i,{info:n});}}this.comments.forEach(n=>{n.epochId=this.epochId;});},Bn=function(e){const t=this.timeSource.now();if(t-this.lastSnapshotEmitTime<this.snapshotEmitThrottleMs)return;const n={currentTime:this.currentTime,duration:this.duration,isPlaying:this.isPlaying,epochId:this.epochId,totalComments:this.comments.length,activeComments:this.activeComments.size,reservedLanes:this.reservedLanes.size,finalPhaseActive:this.finalPhaseActive,playbackHasBegun:this.playbackHasBegun,isStalled:this.isStalled};if(xn(e,n),this.eventHooks.onStateSnapshot)try{this.eventHooks.onStateSnapshot(n);}catch(i){this.log.error("CommentRenderer.emitStateSnapshot.callback",i);}this.lastSnapshotEmitTime=t;},qn=function(e){return this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline(),this.finalPhaseVposOverrides.get(e)??e.vposMs},Un=function(e){if(!e.isScrolling)return W;const t=[];return Number.isFinite(e.visibleDurationMs)&&e.visibleDurationMs>0&&t.push(e.visibleDurationMs),Number.isFinite(e.totalDurationMs)&&e.totalDurationMs>0&&t.push(e.totalDurationMs),t.length>0?Math.max(...t):wt},Gn=function(e){if(!this.finalPhaseActive||this.finalPhaseStartTime===null)return this.finalPhaseVposOverrides.delete(e),e.vposMs;this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline();const t=this.finalPhaseVposOverrides.get(e);if(t!==void 0)return t;const n=Math.max(e.vposMs,this.finalPhaseStartTime);return this.finalPhaseVposOverrides.set(e,n),n},Kn=function(){if(!this.finalPhaseActive||this.finalPhaseStartTime===null){this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=false;return}const e=this.finalPhaseStartTime,t=this.duration>0?this.duration:e+K,n=Math.max(e+K,t),i=this.comments.filter(l=>l.hasShown||l.isInvisible||this.isNGComment(l.text)?false:l.vposMs>=e-_).sort((l,d)=>{const u=l.vposMs-d.vposMs;return Math.abs(u)>k?u:l.creationIndex-d.creationIndex});if(this.finalPhaseVposOverrides.clear(),i.length===0){this.finalPhaseScheduleDirty=false;return}const r=Math.max(n-e,K)/Math.max(i.length,1),s=Number.isFinite(r)?r:dt,a=Math.max(dt,Math.min(s,sn));let o=e;i.forEach((l,d)=>{const u=Math.max(1,this.getFinalPhaseDisplayDuration(l)),c=n-u;let h=Math.max(e,Math.min(o,c));Number.isFinite(h)||(h=e);const m=an*d;h+m<=c&&(h+=m),this.finalPhaseVposOverrides.set(l,h);const p=Math.max(dt,Math.min(u/2,a));o=h+p;}),this.finalPhaseScheduleDirty=false;},Yn=e=>{e.prototype.hardReset=zn,e.prototype.resetFinalPhaseState=$n,e.prototype.incrementEpoch=Wn,e.prototype.emitStateSnapshot=Bn,e.prototype.getEffectiveCommentVpos=qn,e.prototype.getFinalPhaseDisplayDuration=Un,e.prototype.resolveFinalPhaseVpos=Gn,e.prototype.recomputeFinalPhaseTimeline=Kn;},jn=function(){return !this.playbackHasBegun&&!this.isPlaying&&this.currentTime<=z},Xn=function(){this.playbackHasBegun||(this.isPlaying||this.currentTime>z)&&(this.playbackHasBegun=true);},Jn=e=>{e.prototype.shouldSuppressRendering=jn,e.prototype.updatePlaybackProgressState=Xn;},Zn=function(e){const t=this.videoElement,n=this.canvas,i=this.ctx;if(!t||!n||!i)return;const r=typeof e=="number"?e:R(t.currentTime);if(this.currentTime=r,this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.updatePlaybackProgressState(),this.skipDrawingForCurrentFrame=this.shouldSuppressRendering(),this.skipDrawingForCurrentFrame)return;const s=this.canvasDpr>0?this.canvasDpr:1,a=this.displayWidth>0?this.displayWidth:n.width/s,o=this.displayHeight>0?this.displayHeight:n.height/s,l=this.buildPrepareOptions(a),d=this.duration>0&&this.duration-this.currentTime<=rn;d&&!this.finalPhaseActive&&(this.finalPhaseActive=true,this.finalPhaseStartTime=this.currentTime,this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=true,i.clearRect(0,0,a,o),this.comments.forEach(c=>{c.isActive=false,c.clearActivation();}),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0),!d&&this.finalPhaseActive&&this.resetFinalPhaseState(),this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline(),this.pruneStaticLaneReservations(this.currentTime);for(const c of Array.from(this.activeComments)){const h=this.getEffectiveCommentVpos(c),m=h<this.currentTime-_,p=h>this.currentTime+_;if(m||p){c.isActive=false,this.activeComments.delete(c),c.clearActivation(),c.lane>=0&&(c.layout==="ue"?this.releaseStaticLane("ue",c.lane):c.layout==="shita"&&this.releaseStaticLane("shita",c.lane));continue}c.isScrolling&&c.hasShown&&(c.scrollDirection==="rtl"&&c.x<=c.exitThreshold||c.scrollDirection==="ltr"&&c.x>=c.exitThreshold)&&(c.isActive=false,this.activeComments.delete(c),c.clearActivation());}const u=this.getCommentsInTimeWindow(this.currentTime,_);for(const c of u){const h=N(),m=h?Y(c.text):"";if(h&&C("comment-evaluate",{stage:"update",preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),currentTime:this.currentTime,isActive:c.isActive,hasShown:c.hasShown}),this.isNGComment(c.text)){h&&C("comment-eval-skip",{preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"ng-runtime"});continue}if(c.isInvisible){h&&C("comment-eval-skip",{preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"invisible"}),c.isActive=false,this.activeComments.delete(c),c.hasShown=true,c.clearActivation();continue}if(c.syncWithSettings(this._settings,this.settingsVersion),this.shouldActivateCommentAtTime(c,this.currentTime,m)&&this.activateComment(c,i,a,o,l,this.currentTime),c.isActive){if(c.layout!=="naka"&&c.hasStaticExpired(this.currentTime)){const p=c.layout==="ue"?"ue":"shita";this.releaseStaticLane(p,c.lane),c.isActive=false,this.activeComments.delete(c),c.clearActivation();continue}if(c.layout==="naka"&&this.getEffectiveCommentVpos(c)>this.currentTime+z){c.x=c.virtualStartX,c.lastUpdateTime=this.timeSource.now();continue}if(c.hasShown=true,c.update(this.playbackRate,!this.isPlaying),!c.isScrolling&&c.hasStaticExpired(this.currentTime)){const p=c.layout==="ue"?"ue":"shita";this.releaseStaticLane(p,c.lane),c.isActive=false,this.activeComments.delete(c),c.clearActivation();}}}},Qn=function(e){const t=this._settings.scrollVisibleDurationMs;let n=wt,i=Lt;return t!==null&&(n=t,i=Math.max(1,Math.min(t,Lt))),{visibleWidth:e,virtualExtension:on,maxVisibleDurationMs:n,minVisibleDurationMs:i,maxWidthRatio:Qe,bufferRatio:tn,baseBufferPx:en,entryBufferPx:nn}},ti=function(e){const t=this.currentTime;this.pruneLaneReservations(t),this.pruneStaticLaneReservations(t);const n=this.getLanePriorityOrder(t),i=this.createLaneReservation(e,t);for(const s of n)if(this.isLaneAvailable(s,i,t))return this.storeLaneReservation(s,i),s;const r=n[0]??0;return this.storeLaneReservation(r,i),r},ei=e=>{e.prototype.updateComments=Zn,e.prototype.buildPrepareOptions=Qn,e.prototype.findAvailableLane=ti;},ni=function(e,t){let n=0,i=e.length;for(;n<i;){const r=Math.floor((n+i)/2),s=e[r];s!==void 0&&s.totalEndTime+rt<=t?n=r+1:i=r;}return n},ii=function(e){for(const[t,n]of this.reservedLanes.entries()){const i=this.findFirstValidReservationIndex(n,e);i>=n.length?this.reservedLanes.delete(t):i>0&&this.reservedLanes.set(t,n.slice(i));}},ri=function(e){const t=r=>r.filter(s=>s.releaseTime>e),n=t(this.topStaticLaneReservations),i=t(this.bottomStaticLaneReservations);this.topStaticLaneReservations.length=0,this.topStaticLaneReservations.push(...n),this.bottomStaticLaneReservations.length=0,this.bottomStaticLaneReservations.push(...i);},si=e=>{e.prototype.findFirstValidReservationIndex=ni,e.prototype.pruneLaneReservations=ii,e.prototype.pruneStaticLaneReservations=ri;},ai=function(e){let t=0,n=this.comments.length;for(;t<n;){const i=Math.floor((t+n)/2),r=this.comments[i];r!==void 0&&r.vposMs<e?t=i+1:n=i;}return t},oi=function(e,t){if(this.comments.length===0)return [];const n=e-t,i=e+t,r=this.findCommentIndexAtOrAfter(n),s=[];for(let a=r;a<this.comments.length;a++){const o=this.comments[a];if(o){if(o.vposMs>i)break;s.push(o);}}return s},li=function(e){return e==="ue"?this.topStaticLaneReservations:this.bottomStaticLaneReservations},ci=function(e){return e==="ue"?this.topStaticLaneReservations.length:this.bottomStaticLaneReservations.length},di=function(e){const t=e==="ue"?"shita":"ue",n=this.getStaticLaneDepth(t),i=this.laneCount-n;return i<=0?-1:i-1},hi=function(e){return Math.max(0,this.laneCount-1-e)},ui=function(e,t,n,i){const r=Math.max(1,n),s=Math.max(i.height,i.fontSize),a=5,o=2;if(e==="ue"){let c=a;const h=this.getStaticReservations(e).filter(p=>p.lane<t).sort((p,v)=>p.lane-v.lane);for(const p of h){const v=p.yEnd-p.yStart;c+=v+o;}const m=Math.max(a,r-s-a);return Math.max(a,Math.min(c,m))}let l=r-a;const d=this.getStaticReservations(e).filter(c=>c.lane<t).sort((c,h)=>c.lane-h.lane);for(const c of d){const h=c.yEnd-c.yStart;l-=h+o;}const u=l-s;return Math.max(a,u)},mi=function(){const e=new Set;for(const t of this.topStaticLaneReservations)e.add(t.lane);for(const t of this.bottomStaticLaneReservations)e.add(this.getGlobalLaneIndexForBottom(t.lane));return e},pi=e=>{e.prototype.findCommentIndexAtOrAfter=ai,e.prototype.getCommentsInTimeWindow=oi,e.prototype.getStaticReservations=li,e.prototype.getStaticLaneDepth=ci,e.prototype.getStaticLaneLimit=di,e.prototype.getGlobalLaneIndexForBottom=hi,e.prototype.resolveStaticCommentOffset=ui,e.prototype.getStaticReservedLaneSet=mi;},gi=function(e,t,n=""){const i=n.length>0&&N(),r=this.resolveFinalPhaseVpos(e);return this.finalPhaseActive&&this.finalPhaseStartTime!==null&&e.vposMs<this.finalPhaseStartTime-k?(i&&C("comment-eval-skip",{preview:n,vposMs:e.vposMs,effectiveVposMs:r,reason:"final-phase-trimmed",finalPhaseStartTime:this.finalPhaseStartTime}),this.finalPhaseVposOverrides.delete(e),false):e.isInvisible?(i&&C("comment-eval-skip",{preview:n,vposMs:e.vposMs,effectiveVposMs:r,reason:"invisible"}),false):e.isActive?(i&&C("comment-eval-skip",{preview:n,vposMs:e.vposMs,effectiveVposMs:r,reason:"already-active"}),false):e.hasShown&&r<=t?(i&&C("comment-eval-skip",{preview:n,vposMs:e.vposMs,effectiveVposMs:r,reason:"already-shown",currentTime:t}),false):r>t+z?(i&&C("comment-eval-pending",{preview:n,vposMs:e.vposMs,effectiveVposMs:r,reason:"future",currentTime:t}),false):r<t-_?(i&&C("comment-eval-skip",{preview:n,vposMs:e.vposMs,effectiveVposMs:r,reason:"expired-window",currentTime:t}),false):(i&&C("comment-eval-ready",{preview:n,vposMs:e.vposMs,effectiveVposMs:r,currentTime:t}),true)},fi=function(e,t,n,i,r,s){e.prepare(t,n,i,r);const a=this.resolveFinalPhaseVpos(e);if(N()&&C("comment-prepared",{preview:Y(e.text),layout:e.layout,isScrolling:e.isScrolling,width:e.width,height:e.height,bufferWidth:e.bufferWidth,visibleDurationMs:e.visibleDurationMs,effectiveVposMs:a}),e.layout==="naka"){const o=Math.max(0,s-a),l=e.speedPixelsPerMs*o;if(this.finalPhaseActive&&this.finalPhaseStartTime!==null){const m=this.duration>0?this.duration:this.finalPhaseStartTime+K,p=Math.max(this.finalPhaseStartTime+K,m),v=e.width+n,y=v>0?v/Math.max(e.speedPixelsPerMs,1):0;if(a+y>p){const M=p-s,S=Math.max(0,M)*e.speedPixelsPerMs,A=e.scrollDirection==="rtl"?Math.max(e.virtualStartX-l,n-S):Math.min(e.virtualStartX+l,S-e.width);e.x=A;}else e.x=e.scrollDirection==="rtl"?e.virtualStartX-l:e.virtualStartX+l;}else e.x=e.scrollDirection==="rtl"?e.virtualStartX-l:e.virtualStartX+l;const d=this.findAvailableLane(e);e.lane=d;const u=Math.max(1,this.laneHeight),c=Math.max(0,i-e.height),h=d*u;e.y=Math.max(0,Math.min(h,c));}else {const o=e.layout==="ue"?"ue":"shita",l=this.assignStaticLane(o,e,i,s),d=this.resolveStaticCommentOffset(o,l,i,e);e.x=Math.max(0,Math.min(n-e.width,e.virtualStartX)),e.y=d,e.lane=o==="ue"?l:this.getGlobalLaneIndexForBottom(l),e.speed=0,e.baseSpeed=0,e.speedPixelsPerMs=0,e.visibleDurationMs=W;const u=s+e.visibleDurationMs;this.activeComments.add(e),e.isActive=true,e.hasShown=true,e.isPaused=!this.isPlaying,e.markActivated(s),e.lastUpdateTime=this.timeSource.now(),e.staticExpiryTimeMs=u,this.reserveStaticLane(o,e,l,u),N()&&C("comment-activate-static",{preview:Y(e.text),lane:e.lane,position:o,displayEnd:u,effectiveVposMs:a});return}this.activeComments.add(e),e.isActive=true,e.hasShown=true,e.isPaused=!this.isPlaying,e.markActivated(s),e.lastUpdateTime=this.timeSource.now();},bi=function(e,t,n,i){const r=this.getStaticReservations(e),s=this.getStaticLaneLimit(e),a=s>=0?s+1:0,o=Array.from({length:a},(u,c)=>c);for(const u of o){const c=this.resolveStaticCommentOffset(e,u,n,t),h=Math.max(t.height,t.fontSize),m=pe(t.fontSize,u),p=c-m,v=c+h+m;if(!r.some(y=>y.releaseTime>i?!(v<=y.yStart||p>=y.yEnd):false))return u}let l=o[0]??0,d=Number.POSITIVE_INFINITY;for(const u of r)u.releaseTime<d&&(d=u.releaseTime,l=u.lane);return l},yi=function(e,t,n,i){const r=this.getStaticReservations(e),s=Math.max(t.height,t.fontSize),a=pe(t.fontSize,n),o=t.y-a,l=t.y+s+a;r.push({comment:t,releaseTime:i,yStart:o,yEnd:l,lane:n});},vi=function(e,t){if(t<0)return;const n=this.getStaticReservations(e),i=n.findIndex(r=>r.lane===t);i>=0&&n.splice(i,1);},xi=e=>{e.prototype.shouldActivateCommentAtTime=gi,e.prototype.activateComment=fi,e.prototype.assignStaticLane=bi,e.prototype.reserveStaticLane=yi,e.prototype.releaseStaticLane=vi;},wi=function(e){const t=Array.from({length:this.laneCount},(s,a)=>a).sort((s,a)=>{const o=this.getLaneNextAvailableTime(s,e),l=this.getLaneNextAvailableTime(a,e);return Math.abs(o-l)<=k?s-a:o-l}),n=this.getStaticReservedLaneSet();if(n.size===0)return t;const i=t.filter(s=>!n.has(s));if(i.length===0)return t;const r=t.filter(s=>n.has(s));return [...i,...r]},Si=function(e,t){const n=this.reservedLanes.get(e);if(!n||n.length===0)return t;const i=this.findFirstValidReservationIndex(n,t),r=n[i];return r?Math.max(t,r.endTime+rt):t},Ci=function(e,t){const n=Math.max(e.speedPixelsPerMs,k),i=this.getEffectiveCommentVpos(e),r=Number.isFinite(i)?i:t,s=Math.max(0,r),a=s+e.preCollisionDurationMs+rt,o=s+e.totalDurationMs+rt;return {comment:e,startTime:s,endTime:Math.max(s,a),totalEndTime:Math.max(s,o),startLeft:e.virtualStartX,width:e.width,speed:n,buffer:e.bufferWidth,directionSign:e.getDirectionSign()}},Mi=function(e,t,n){const i=this.reservedLanes.get(e);if(!i||i.length===0)return  true;const r=this.findFirstValidReservationIndex(i,n);for(let s=r;s<i.length;s+=1){const a=i[s];if(a&&this.areReservationsConflicting(a,t))return  false}return  true},Ei=function(e,t){const n=[...this.reservedLanes.get(e)??[],t].sort((i,r)=>i.totalEndTime-r.totalEndTime);this.reservedLanes.set(e,n);},Ti=function(e,t){const n=Math.max(e.startTime,t.startTime),i=Math.min(e.endTime,t.endTime);if(n>=i)return  false;const r=new Set([n,i,n+(i-n)/2]),s=this.solveLeftRightEqualityTime(e,t);s!==null&&s>=n-k&&s<=i+k&&r.add(s);const a=this.solveLeftRightEqualityTime(t,e);a!==null&&a>=n-k&&a<=i+k&&r.add(a);for(const o of r){if(o<n-k||o>i+k)continue;const l=this.computeForwardGap(e,t,o),d=this.computeForwardGap(t,e,o);if(l<=k&&d<=k)return  true}return  false},ki=function(e,t,n){const i=this.getBufferedEdges(e,n),r=this.getBufferedEdges(t,n);return i.left-r.right},Vi=function(e,t){const n=Math.max(0,t-e.startTime),i=e.speed*n,r=e.startLeft+e.directionSign*i,s=r-e.buffer,a=r+e.width+e.buffer;return {left:s,right:a}},Pi=function(e,t){const n=e.directionSign,i=t.directionSign,r=i*t.speed-n*e.speed;if(Math.abs(r)<k)return null;const s=(t.startLeft+i*t.speed*t.startTime+t.width+t.buffer-e.startLeft-n*e.speed*e.startTime+e.buffer)/r;return Number.isFinite(s)?s:null},Ii=e=>{e.prototype.getLanePriorityOrder=wi,e.prototype.getLaneNextAvailableTime=Si,e.prototype.createLaneReservation=Ci,e.prototype.isLaneAvailable=Mi,e.prototype.storeLaneReservation=Ei,e.prototype.areReservationsConflicting=Ti,e.prototype.computeForwardGap=ki,e.prototype.getBufferedEdges=Vi,e.prototype.solveLeftRightEqualityTime=Pi;},Ai=function(){const e=this.canvas,t=this.ctx;if(!e||!t)return;const n=this.canvasDpr>0?this.canvasDpr:1,i=this.displayWidth>0?this.displayWidth:e.width/n,r=this.displayHeight>0?this.displayHeight:e.height/n,s=this.timeSource.now();if(this.skipDrawingForCurrentFrame||this.shouldSuppressRendering()||this.isStalled){t.clearRect(0,0,i,r),this.lastDrawTime=s;return}t.clearRect(0,0,i,r);const a=Array.from(this.activeComments);if(this._settings.isCommentVisible){const o=(s-this.lastDrawTime)/16.666666666666668;a.sort((l,d)=>{const u=this.getEffectiveCommentVpos(l),c=this.getEffectiveCommentVpos(d),h=u-c;return Math.abs(h)>k?h:l.isScrolling!==d.isScrolling?l.isScrolling?1:-1:l.creationIndex-d.creationIndex}),a.forEach(l=>{const d=this.isPlaying&&!l.isPaused?l.x+l.getDirectionSign()*l.speed*o:l.x;l.draw(t,d);});}this.lastDrawTime=s;},Li=function(e){const t=this.videoElement,n=this.canvas,i=this.ctx;if(!t||!n||!i)return;const r=typeof e=="number"?e:R(t.currentTime);this.currentTime=r,this.lastDrawTime=this.timeSource.now();const s=this.canvasDpr>0?this.canvasDpr:1,a=this.displayWidth>0?this.displayWidth:n.width/s,o=this.displayHeight>0?this.displayHeight:n.height/s,l=this.buildPrepareOptions(a);this.getCommentsInTimeWindow(this.currentTime,_).forEach(d=>{if(this.isNGComment(d.text)||d.isInvisible){d.isActive=false,this.activeComments.delete(d),d.clearActivation();return}if(d.syncWithSettings(this._settings,this.settingsVersion),d.isActive=false,this.activeComments.delete(d),d.lane=-1,d.clearActivation(),this.shouldActivateCommentAtTime(d,this.currentTime)){this.activateComment(d,i,a,o,l,this.currentTime);return}this.getEffectiveCommentVpos(d)<this.currentTime-_?d.hasShown=true:d.hasShown=false;});},Ri=e=>{e.prototype.draw=Ai,e.prototype.performInitialSync=Li;},Fi=function(e){this.videoElement&&this._settings.isCommentVisible&&(this.pendingInitialSync&&(this.performInitialSync(e),this.pendingInitialSync=false),this.updateComments(e),this.draw());},_i=function(){const e=this.frameId;this.frameId=null,e!==null&&this.animationFrameProvider.cancel(e),this.processFrame(),this.scheduleNextFrame();},Di=function(e,t){this.videoFrameHandle=null;const n=typeof t?.mediaTime=="number"?t.mediaTime*1e3:void 0;this.processFrame(typeof n=="number"?n:void 0),this.scheduleNextFrame();},Hi=function(){if(this._settings.syncMode!=="video-frame")return  false;const e=this.videoElement;return !!e&&typeof e.requestVideoFrameCallback=="function"&&typeof e.cancelVideoFrameCallback=="function"},Oi=function(){const e=this.videoElement;if(e){if(this.shouldUseVideoFrameCallback()){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();const t=e.requestVideoFrameCallback;typeof t=="function"&&(this.videoFrameHandle=t.call(e,this.handleVideoFrame));return}this.cancelVideoFrameCallback(),this.frameId=this.animationFrameProvider.request(this.handleAnimationFrame);}},Ni=function(){this.frameId!==null&&(this.animationFrameProvider.cancel(this.frameId),this.frameId=null);},zi=function(){if(this.videoFrameHandle===null)return;const e=this.videoElement;e&&typeof e.cancelVideoFrameCallback=="function"&&e.cancelVideoFrameCallback(this.videoFrameHandle),this.videoFrameHandle=null;},$i=function(){this.stopAnimation(),this.scheduleNextFrame();},Wi=function(){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();},Bi=function(){const e=this.canvas,t=this.ctx,n=this.videoElement;if(!e||!t||!n)return;const i=R(n.currentTime),r=Math.abs(i-this.currentTime),s=this.timeSource.now();if(s-this.lastPlayResumeTime<this.playResumeSeekIgnoreDurationMs){this.currentTime=i,this._settings.isCommentVisible&&(this.lastDrawTime=s,this.draw());return}const a=r>z;if(this.currentTime=i,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),!a){this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());return}this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;const o=this.canvasDpr>0?this.canvasDpr:1,l=this.displayWidth>0?this.displayWidth:e.width/o,d=this.displayHeight>0?this.displayHeight:e.height/o,u=this.buildPrepareOptions(l);this.getCommentsInTimeWindow(this.currentTime,_).forEach(c=>{const h=N(),m=h?Y(c.text):"";if(h&&C("comment-evaluate",{stage:"seek",preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),currentTime:this.currentTime,isActive:c.isActive,hasShown:c.hasShown}),this.isNGComment(c.text)){h&&C("comment-eval-skip",{preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"ng-runtime"}),c.isActive=false,this.activeComments.delete(c),c.clearActivation();return}if(c.isInvisible){h&&C("comment-eval-skip",{preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"invisible"}),c.isActive=false,this.activeComments.delete(c),c.hasShown=true,c.clearActivation();return}if(c.syncWithSettings(this._settings,this.settingsVersion),c.isActive=false,this.activeComments.delete(c),c.lane=-1,c.clearActivation(),this.shouldActivateCommentAtTime(c,this.currentTime,m)){this.activateComment(c,t,l,d,u,this.currentTime);return}this.getEffectiveCommentVpos(c)<this.currentTime-_?c.hasShown=true:c.hasShown=false;}),this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());},qi=e=>{e.prototype.processFrame=Fi,e.prototype.handleAnimationFrame=_i,e.prototype.handleVideoFrame=Di,e.prototype.shouldUseVideoFrameCallback=Hi,e.prototype.scheduleNextFrame=Oi,e.prototype.cancelAnimationFrameRequest=Ni,e.prototype.cancelVideoFrameCallback=zi,e.prototype.startAnimation=$i,e.prototype.stopAnimation=Wi,e.prototype.onSeek=Bi;},bt=e=>e._settings.enableAutoHardReset,j=(e,t)=>{!bt(e)||e.timeSource.now()-e.lastHardResetAt<e.autoHardResetDedupWindowMs||e.hardReset();},Ui=e=>{bt(e)&&(e.initialPlaybackAutoResetTriggered||e.initialPlaybackAutoResetTimer===null&&(e.initialPlaybackAutoResetTimer=globalThis.setTimeout(()=>{e.initialPlaybackAutoResetTimer=null,bt(e)&&(e.initialPlaybackAutoResetTriggered=true,j(e));},e.initialPlaybackAutoResetDelayMs)));},X=e=>{e.initialPlaybackAutoResetTimer!==null&&(globalThis.clearTimeout(e.initialPlaybackAutoResetTimer),e.initialPlaybackAutoResetTimer=null),e.initialPlaybackAutoResetTriggered=false;},Gi=function(e,t){if(e)return e;if(t.parentElement)return t.parentElement;if(typeof document<"u"&&document.body)return document.body;throw new Error("Cannot resolve container element. Provide container explicitly when DOM is unavailable.")},Ki=function(e){if(typeof getComputedStyle=="function"){getComputedStyle(e).position==="static"&&(e.style.position="relative");return}e.style.position||(e.style.position="relative");},Yi=function(e){try{this.destroyCanvasOnly();const t=e instanceof HTMLVideoElement?e:e.video,n=e instanceof HTMLVideoElement?e.parentElement:e.container??e.video.parentElement,i=this.resolveContainer(n??null,t);this.videoElement=t,this.containerElement=i,this.lastVideoSource=this.getCurrentVideoSource(),this.duration=Number.isFinite(t.duration)?R(t.duration):0,this.currentTime=R(t.currentTime),this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.isStalled=!1,this.lastDrawTime=this.timeSource.now(),this.playbackHasBegun=this.isPlaying||this.currentTime>z,this.skipDrawingForCurrentFrame=this.shouldSuppressRendering();const r=this.createCanvasElement(),s=r.getContext("2d");if(!s)throw new Error("Failed to acquire 2D canvas context");r.style.position="absolute",r.style.top="0",r.style.left="0",r.style.pointerEvents="none",r.style.zIndex="1000";const a=this.containerElement;a instanceof HTMLElement&&(this.ensureContainerPositioning(a),a.appendChild(r)),this.canvas=r,this.ctx=s,this.resize(),this.calculateLaneMetrics(),this.setupVideoEventListeners(t),this.setupResizeHandling(t),this.setupFullscreenHandling(),this.setupVideoChangeDetection(t,i),this.startAnimation(),this.setupVisibilityHandling();}catch(t){throw this.log.error("CommentRenderer.initialize",t),t}},ji=function(){this.stopAnimation(),this.cleanupResizeHandling(),this.runCleanupTasks(),X(this),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.videoElement=null,this.containerElement=null,this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.resetFinalPhaseState(),this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.commentSequence=0,this.playbackHasBegun=false,this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false;},Xi=function(){this.stopAnimation(),X(this),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.fullscreenActive=false;},Ji=e=>{e.prototype.resolveContainer=Gi,e.prototype.ensureContainerPositioning=Ki,e.prototype.initialize=Yi,e.prototype.destroy=ji,e.prototype.destroyCanvasOnly=Xi;},Zi=function(e){try{const t=()=>{const h=this.isPlaying;this.isPlaying=!0,this.playbackHasBegun=!0;const m=this.timeSource.now();this.lastDrawTime=m,this.lastPlayResumeTime=m,this.comments.forEach(p=>{p.lastUpdateTime=m,p.isPaused=!1;}),h||j(this,"play-resume"),Ui(this);},n=()=>{this.isPlaying=!1;const h=this.timeSource.now();this.comments.forEach(m=>{m.lastUpdateTime=h,m.isPaused=!0;});},i=()=>{this.onSeek();},r=()=>{this.onSeek(),j(this,"seeked");},s=()=>{this.playbackRate=e.playbackRate;const h=this.timeSource.now();this.comments.forEach(m=>{m.lastUpdateTime=h;});},a=()=>{this.handleVideoMetadataLoaded(e);},o=()=>{this.duration=Number.isFinite(e.duration)?R(e.duration):0;},l=()=>{this.handleVideoSourceChange();},d=()=>{this.handleVideoStalled();},u=()=>{this.handleVideoCanPlay();},c=()=>{this.handleVideoCanPlay();};e.addEventListener("play",t),e.addEventListener("pause",n),e.addEventListener("seeking",i),e.addEventListener("seeked",r),e.addEventListener("ratechange",s),e.addEventListener("loadedmetadata",a),e.addEventListener("durationchange",o),e.addEventListener("emptied",l),e.addEventListener("waiting",d),e.addEventListener("canplay",u),e.addEventListener("playing",c),this.addCleanup(()=>e.removeEventListener("play",t)),this.addCleanup(()=>e.removeEventListener("pause",n)),this.addCleanup(()=>e.removeEventListener("seeking",i)),this.addCleanup(()=>e.removeEventListener("seeked",r)),this.addCleanup(()=>e.removeEventListener("ratechange",s)),this.addCleanup(()=>e.removeEventListener("loadedmetadata",a)),this.addCleanup(()=>e.removeEventListener("durationchange",o)),this.addCleanup(()=>e.removeEventListener("emptied",l)),this.addCleanup(()=>e.removeEventListener("waiting",d)),this.addCleanup(()=>e.removeEventListener("canplay",u)),this.addCleanup(()=>e.removeEventListener("playing",c));}catch(t){throw this.log.error("CommentRenderer.setupVideoEventListeners",t),t}},Qi=function(e){this.lastVideoSource=this.getCurrentVideoSource(),this.incrementEpoch("metadata-loaded"),this.handleVideoSourceChange(e),this.resize(),this.calculateLaneMetrics(),this.hardReset(),this.onSeek(),this.emitStateSnapshot("metadata-loaded"),X(this);},tr=function(){const e=this.canvas,t=this.ctx;if(!e||!t)return;this.isStalled=true;const n=this.canvasDpr>0?this.canvasDpr:1,i=this.displayWidth>0?this.displayWidth:e.width/n,r=this.displayHeight>0?this.displayHeight:e.height/n;t.clearRect(0,0,i,r),this.comments.forEach(s=>{s.isActive&&(s.lastUpdateTime=this.timeSource.now());});},er=function(){this.isStalled&&(this.isStalled=false,this.videoElement&&(this.currentTime=R(this.videoElement.currentTime),this.isPlaying=!this.videoElement.paused),this.lastDrawTime=this.timeSource.now());},nr=function(e){const t=e??this.videoElement;if(!t){this.lastVideoSource=null,this.isPlaying=false,this.resetFinalPhaseState(),this.resetCommentActivity(),X(this);return}const n=this.getCurrentVideoSource();n!==this.lastVideoSource&&(this.lastVideoSource=n,this.incrementEpoch("source-change"),this.syncVideoState(t),this.resetFinalPhaseState(),this.resetCommentActivity(),this.emitStateSnapshot("source-change"),X(this));},ir=function(e){this.duration=Number.isFinite(e.duration)?R(e.duration):0,this.currentTime=R(e.currentTime),this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.isStalled=false,this.playbackHasBegun=this.isPlaying||this.currentTime>z,this.lastDrawTime=this.timeSource.now();},rr=function(){const e=this.timeSource.now(),t=this.canvas,n=this.ctx;if(this.resetFinalPhaseState(),this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false,this.playbackHasBegun=this.isPlaying||this.currentTime>z,t&&n){const i=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/i,s=this.displayHeight>0?this.displayHeight:t.height/i;n.clearRect(0,0,r,s);}this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.comments.forEach(i=>{i.isActive=false,i.isPaused=!this.isPlaying,i.hasShown=false,i.lane=-1,i.x=i.virtualStartX,i.speed=i.baseSpeed,i.lastUpdateTime=e,i.clearActivation();}),this.activeComments.clear();},sr=function(e,t){if(typeof MutationObserver>"u"){this.log.debug("MutationObserver is not available in this environment. Video change detection is disabled.");return}const n=new MutationObserver(r=>{for(const s of r){if(s.type==="attributes"&&s.attributeName==="src"){const a=s.target;let o=null,l=null;if((a instanceof HTMLVideoElement||a instanceof HTMLSourceElement)&&(o=typeof s.oldValue=="string"?s.oldValue:null,l=a.getAttribute("src")),o===l)continue;this.handleVideoSourceChange(e);return}if(s.type==="childList"){for(const a of s.addedNodes)if(a instanceof HTMLSourceElement){this.handleVideoSourceChange(e);return}for(const a of s.removedNodes)if(a instanceof HTMLSourceElement){this.handleVideoSourceChange(e);return}}}});n.observe(e,{attributes:true,attributeFilter:["src"],attributeOldValue:true,childList:true,subtree:true}),this.addCleanup(()=>n.disconnect());const i=new MutationObserver(r=>{for(const s of r)if(s.type==="childList"){for(const a of s.addedNodes){const o=this.extractVideoElement(a);if(o&&o!==this.videoElement){this.initialize(o);return}}for(const a of s.removedNodes){if(a===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}if(a instanceof Element){const o=a.querySelector("video");if(o&&o===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}}}}});i.observe(t,{childList:true,subtree:true}),this.addCleanup(()=>i.disconnect());},ar=function(e){if(e instanceof HTMLVideoElement)return e;if(e instanceof Element){const t=e.querySelector("video");if(t instanceof HTMLVideoElement)return t}return null},or=e=>{e.prototype.setupVideoEventListeners=Zi,e.prototype.handleVideoMetadataLoaded=Qi,e.prototype.handleVideoStalled=tr,e.prototype.handleVideoCanPlay=er,e.prototype.handleVideoSourceChange=nr,e.prototype.syncVideoState=ir,e.prototype.resetCommentActivity=rr,e.prototype.setupVideoChangeDetection=sr,e.prototype.extractVideoElement=ar;},lr=function(){if(typeof document>"u"||typeof document.addEventListener!="function"||typeof document.removeEventListener!="function")return;const e=()=>{if(document.visibilityState!=="visible"){this.stopAnimation();return}this._settings.isCommentVisible&&(this.handleVisibilityRestore(),this.startAnimation());};document.addEventListener("visibilitychange",e),this.addCleanup(()=>document.removeEventListener("visibilitychange",e)),document.visibilityState!=="visible"&&this.stopAnimation();},cr=function(){const e=this.canvas,t=this.ctx,n=this.videoElement;!e||!t||!n||(this.currentTime=R(n.currentTime),this.lastDrawTime=this.timeSource.now(),this.isPlaying=!n.paused,this.isStalled=false,this.pendingInitialSync=true,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),j(this),this.draw());},dr=e=>{e.prototype.setupVisibilityHandling=lr,e.prototype.handleVisibilityRestore=cr;},hr=function(e,t){const n=this.videoElement,i=this.canvas,r=this.ctx;if(!n||!i)return;const s=n.getBoundingClientRect(),a=this.canvasDpr>0?this.canvasDpr:1,o=this.displayWidth>0?this.displayWidth:i.width/a,l=this.displayHeight>0?this.displayHeight:i.height/a,d=e??s.width??o,u=t??s.height??l;if(!Number.isFinite(d)||!Number.isFinite(u)||d<=0||u<=0)return;const c=Math.max(1,Math.floor(d)),h=Math.max(1,Math.floor(u)),m=this.displayWidth>0?this.displayWidth:c,p=this.displayHeight>0?this.displayHeight:h,v=this._settings.useDprScaling?this.resolveDevicePixelRatio():1,y=Math.max(1,Math.round(c*v)),M=Math.max(1,Math.round(h*v));if(!(this.displayWidth!==c||this.displayHeight!==h||Math.abs(this.canvasDpr-v)>Number.EPSILON||i.width!==y||i.height!==M))return;this.displayWidth=c,this.displayHeight=h,this.canvasDpr=v,i.width=y,i.height=M,i.style.width=`${c}px`,i.style.height=`${h}px`,r&&(r.setTransform(1,0,0,1,0,0),this._settings.useDprScaling&&r.scale(v,v));const S=m>0?c/m:1,A=p>0?h/p:1;(S!==1||A!==1)&&this.comments.forEach(T=>{T.isActive&&(T.x*=S,T.y*=A,T.width*=S,T.fontSize=Math.max(oe,Math.floor(Math.max(1,T.fontSize)*A)),T.height=T.fontSize,T.virtualStartX*=S,T.exitThreshold*=S,T.baseSpeed*=S,T.speed*=S,T.speedPixelsPerMs*=S,T.bufferWidth*=S,T.reservationWidth*=S);}),this.calculateLaneMetrics(),j(this);},ur=function(){if(typeof window>"u")return 1;const e=Number(window.devicePixelRatio);return !Number.isFinite(e)||e<=0?1:e},mr=function(){const e=this.canvas;if(!e)return;const t=this.displayHeight>0?this.displayHeight:e.height/Math.max(this.canvasDpr,1),n=Math.max(oe,Math.floor(t*.05));this.laneHeight=n*1.2;const i=Math.floor(t/Math.max(this.laneHeight,1));if(this._settings.useFixedLaneCount){const r=Number.isFinite(this._settings.fixedLaneCount)?Math.floor(this._settings.fixedLaneCount):ae,s=Math.max(Rt,Math.min(i,r));this.laneCount=s;}else this.laneCount=Math.max(Rt,i);this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;},pr=function(e){if(this.cleanupResizeHandling(),this._settings.useContainerResizeObserver&&this.isResizeObserverAvailable){const t=this.resolveResizeObserverTarget(e),n=new ResizeObserver(i=>{for(const r of i){const{width:s,height:a}=r.contentRect;s>0&&a>0?this.resize(s,a):this.resize();}});n.observe(t),this.resizeObserver=n,this.resizeObserverTarget=t;}else if(typeof window<"u"&&typeof window.addEventListener=="function"){const t=()=>{this.resize();};window.addEventListener("resize",t),this.addCleanup(()=>window.removeEventListener("resize",t));}else this.log.debug("Resize handling is disabled because neither ResizeObserver nor window APIs are available.");},gr=function(){this.resizeObserver&&this.resizeObserverTarget&&this.resizeObserver.unobserve(this.resizeObserverTarget),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.resizeObserverTarget=null;},fr=e=>{e.prototype.resize=hr,e.prototype.resolveDevicePixelRatio=ur,e.prototype.calculateLaneMetrics=mr,e.prototype.setupResizeHandling=pr,e.prototype.cleanupResizeHandling=gr;},br=function(){if(typeof document>"u"||typeof document.addEventListener!="function"||typeof document.removeEventListener!="function")return;const e=()=>{this.handleFullscreenChange();};["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(t=>{document.addEventListener(t,e),this.addCleanup(()=>document.removeEventListener(t,e));}),this.handleFullscreenChange();},yr=function(e){return this.resolveFullscreenContainer(e)||(e.parentElement??e)},vr=async function(){const e=this.canvas,t=this.videoElement;if(!e||!t)return;const n=this.containerElement??t.parentElement??null,i=this.getFullscreenElement(),r=this.resolveActiveOverlayContainer(t,n,i);if(!(r instanceof HTMLElement))return;e.parentElement!==r?(this.ensureContainerPositioning(r),r.appendChild(e)):this.ensureContainerPositioning(r);const s=(i instanceof HTMLElement&&i.contains(t)?i:null)!==null;this.fullscreenActive!==s&&(this.fullscreenActive=s,this.setupResizeHandling(t)),e.style.position="absolute",e.style.top="0",e.style.left="0",this.resize();},xr=function(e){const t=this.getFullscreenElement();return t instanceof HTMLElement&&(t===e||t.contains(e))?t:null},wr=function(e,t,n){return n instanceof HTMLElement&&n.contains(e)?n instanceof HTMLVideoElement&&t instanceof HTMLElement?t:n:t??null},Sr=function(){if(typeof document>"u")return null;const e=document;return document.fullscreenElement??e.webkitFullscreenElement??e.mozFullScreenElement??e.msFullscreenElement??null},Cr=e=>{e.prototype.setupFullscreenHandling=br,e.prototype.resolveResizeObserverTarget=yr,e.prototype.handleFullscreenChange=vr,e.prototype.resolveFullscreenContainer=xr,e.prototype.resolveActiveOverlayContainer=wr,e.prototype.getFullscreenElement=Sr;},Mr=function(e){this.cleanupTasks.push(e);},Er=function(){for(;this.cleanupTasks.length>0;){const e=this.cleanupTasks.pop();try{e?.();}catch(t){this.log.error("CommentRenderer.cleanupTask",t);}}},Tr=e=>{e.prototype.addCleanup=Mr,e.prototype.runCleanupTasks=Er;};class E{_settings;comments=[];activeComments=new Set;reservedLanes=new Map;topStaticLaneReservations=[];bottomStaticLaneReservations=[];log;timeSource;animationFrameProvider;createCanvasElement;commentDependencies;settingsVersion=0;normalizedNgWords=[];compiledNgRegexps=[];canvas=null;ctx=null;videoElement=null;containerElement=null;fullscreenActive=false;laneCount=ae;laneHeight=0;displayWidth=0;displayHeight=0;canvasDpr=1;currentTime=0;duration=0;playbackRate=1;isPlaying=true;isStalled=false;lastDrawTime=0;finalPhaseActive=false;finalPhaseStartTime=null;finalPhaseScheduleDirty=false;playbackHasBegun=false;skipDrawingForCurrentFrame=false;pendingInitialSync=false;finalPhaseVposOverrides=new Map;frameId=null;videoFrameHandle=null;resizeObserver=null;resizeObserverTarget=null;isResizeObserverAvailable=typeof ResizeObserver<"u";cleanupTasks=[];commentSequence=0;epochId=0;eventHooks;lastSnapshotEmitTime=0;snapshotEmitThrottleMs=1e3;lastPlayResumeTime=0;playResumeSeekIgnoreDurationMs=500;lastVideoSource=null;lastHardResetAt=0;autoHardResetDedupWindowMs=hn;initialPlaybackAutoResetDelayMs=un;initialPlaybackAutoResetTimer=null;initialPlaybackAutoResetTriggered=false;rebuildNgMatchers(){ge.call(this);}constructor(t=null,n=void 0){let i,r;if(Rn(t))i=Z({...t}),r=n??{};else {const s=t??n??{};r=typeof s=="object"?s:{},i=Z(me());}this._settings=Z(i),this.timeSource=r.timeSource??se(),this.animationFrameProvider=r.animationFrameProvider??An(this.timeSource),this.createCanvasElement=r.createCanvasElement??Ln(),this.commentDependencies={timeSource:this.timeSource,settingsVersion:this.settingsVersion},this.log=le(r.loggerNamespace??"CommentRenderer"),this.eventHooks=r.eventHooks??{},this.handleAnimationFrame=this.handleAnimationFrame.bind(this),this.handleVideoFrame=this.handleVideoFrame.bind(this),this.rebuildNgMatchers(),r.debug&&yn(r.debug);}get settings(){return this._settings}set settings(t){this._settings=Z(t),this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion,this.rebuildNgMatchers();}getVideoElement(){return this.videoElement}getCurrentVideoSource(){const t=this.videoElement;if(!t)return null;if(typeof t.currentSrc=="string"&&t.currentSrc.length>0)return t.currentSrc;const n=t.getAttribute("src");if(n&&n.length>0)return n;const i=t.querySelector("source[src]");return i&&typeof i.src=="string"?i.src:null}getCommentsSnapshot(){return [...this.comments]}}Nn(E);Yn(E);Jn(E);ei(E);si(E);pi(E);xi(E);Ii(E);Ri(E);qi(E);Ji(E);or(E);dr(E);fr(E);Cr(E);Tr(E);const $=()=>({...me(),enableAutoHardReset:true,shadowIntensity:"strong"}),kr="v6.15.5";var Vr=typeof GM_addStyle<"u"?GM_addStyle:void 0,Q=typeof GM_getValue<"u"?GM_getValue:void 0,tt=typeof GM_setValue<"u"?GM_setValue:void 0,Pr=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const Nt="settings",zt="currentVideo",$t="lastDanimeIds",Wt="playbackSettings",Ir=e=>({...e,ngWords:[...e.ngWords],ngRegexps:[...e.ngRegexps]}),U={fixedModeEnabled:false,fixedRate:1.11},et=e=>({fixedModeEnabled:e.fixedModeEnabled,fixedRate:e.fixedRate});class Mt{constructor(t){this.notifier=t,this.settings=$(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData(),this.playbackSettings=et(U),this.loadPlaybackSettings();}settings;currentVideo;observers=new Set;playbackSettings;playbackObservers=new Set;getSettings(){return Ir(this.settings)}loadSettings(){try{const t=Q(Nt,null);if(!t)return this.settings=$(),this.settings;if(typeof t=="string"){const n=JSON.parse(t);this.settings={...$(),...n,ngWords:Array.isArray(n?.ngWords)?[...n.ngWords]:[],ngRegexps:Array.isArray(n?.ngRegexps)?[...n.ngRegexps]:[]};}else this.settings={...$(),...t,ngWords:Array.isArray(t.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t.ngRegexps)?[...t.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(t){return console.error("[SettingsManager] 設定の読み込みに失敗しました",t),this.notify("設定の読み込みに失敗しました","error"),this.settings=$(),this.settings}}getPlaybackSettings(){return et(this.playbackSettings)}loadPlaybackSettings(){try{const t=Q(Wt,null);if(!t)return this.playbackSettings=et(U),this.notifyPlaybackObservers(),this.playbackSettings;if(typeof t=="string"){const n=JSON.parse(t);this.playbackSettings={fixedModeEnabled:typeof n.fixedModeEnabled=="boolean"?n.fixedModeEnabled:U.fixedModeEnabled,fixedRate:typeof n.fixedRate=="number"?n.fixedRate:U.fixedRate};}else this.playbackSettings={fixedModeEnabled:t.fixedModeEnabled,fixedRate:t.fixedRate};return this.notifyPlaybackObservers(),this.playbackSettings}catch(t){return console.error("[SettingsManager] 再生設定の読み込みに失敗しました",t),this.notify("再生設定の読み込みに失敗しました","error"),this.playbackSettings=et(U),this.notifyPlaybackObservers(),this.playbackSettings}}updatePlaybackSettings(t){return this.playbackSettings={...this.playbackSettings,...t},this.savePlaybackSettings()}savePlaybackSettings(){try{return tt(Wt,JSON.stringify(this.playbackSettings)),this.notifyPlaybackObservers(),!0}catch(t){return console.error("[SettingsManager] 再生設定の保存に失敗しました",t),this.notify("再生設定の保存に失敗しました","error"),false}}saveSettings(){try{return tt(Nt,JSON.stringify(this.settings)),this.notifyObservers(),this.notify("設定を保存しました","success"),!0}catch(t){return console.error("[SettingsManager] 設定の保存に失敗しました",t),this.notify("設定の保存に失敗しました","error"),false}}updateSettings(t){return this.settings={...this.settings,...t,ngWords:t.ngWords?[...t.ngWords]:[...this.settings.ngWords??[]],ngRegexps:t.ngRegexps?[...t.ngRegexps]:[...this.settings.ngRegexps??[]]},this.saveSettings()}addObserver(t){this.observers.add(t);}removeObserver(t){this.observers.delete(t);}addPlaybackObserver(t){this.playbackObservers.add(t);try{t(this.getPlaybackSettings());}catch(n){console.error("[SettingsManager] 再生設定の登録通知でエラー",n);}}removePlaybackObserver(t){this.playbackObservers.delete(t);}notifyObservers(){const t=this.getSettings();for(const n of this.observers)try{n(t);}catch(i){console.error("[SettingsManager] 設定変更通知でエラー",i);}}notifyPlaybackObservers(){const t=this.getPlaybackSettings();for(const n of this.playbackObservers)try{n(t);}catch(i){console.error("[SettingsManager] 再生設定通知でエラー",i);}}loadVideoData(){try{return Q(zt,null)??null}catch(t){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",t),this.notify("動画データの読み込みに失敗しました","error"),null}}saveVideoData(t,n){try{const i={videoId:n.videoId,title:n.title,viewCount:n.viewCount,commentCount:n.commentCount,mylistCount:n.mylistCount,postedAt:n.postedAt,thumbnail:n.thumbnail,owner:n.owner??null,channel:n.channel??null};return tt(zt,i),this.currentVideo=i,!0}catch(i){return console.error("[SettingsManager] 動画データの保存に失敗しました",i),this.notify("動画データの保存に失敗しました","error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(t){try{return tt($t,t),!0}catch(n){return console.error("[SettingsManager] saveLastDanimeIds failed",n),this.notify("ID情報の保存に失敗しました","error"),false}}loadLastDanimeIds(){try{return Q($t,null)??null}catch(t){return console.error("[SettingsManager] loadLastDanimeIds failed",t),this.notify("ID情報の読込に失敗しました","error"),null}}notify(t,n="info"){this.notifier?.show(t,n);}}const Ar=new Set(["INPUT","TEXTAREA"]),mt=e=>e.length===1?e.toUpperCase():e,Lr=e=>e?`${e}+`:"";class fe{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(t,n,i){const r=this.createShortcutKey(mt(t),n);this.shortcuts.set(r,i);}removeShortcut(t,n){const i=this.createShortcutKey(mt(t),n);this.shortcuts.delete(i);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(t){this.isEnabled=t;}createShortcutKey(t,n){return `${Lr(n)}${t}`}extractModifier(t){const n=[];return t.ctrlKey&&n.push("Ctrl"),t.altKey&&n.push("Alt"),t.shiftKey&&n.push("Shift"),t.metaKey&&n.push("Meta"),n.length>0?n.join("+"):null}handleKeyDown(t){if(!this.isEnabled)return;const i=t.target?.tagName??"";if(Ar.has(i))return;const r=this.extractModifier(t),s=this.createShortcutKey(mt(t.key),r),a=this.shortcuts.get(s);a&&(t.preventDefault(),a());}}const Rr=F("dAnime:CommentRenderer"),Bt=e=>({loggerNamespace:"dAnime:CommentRenderer",...e??{}}),Fr=e=>{if(!e||typeof e!="object")return  false;const t=e;return typeof t.commentColor=="string"&&typeof t.commentOpacity=="number"&&typeof t.isCommentVisible=="boolean"};class be{renderer;keyboardHandler=null;constructor(t,n){Fr(t)||t===null?this.renderer=new E(t??null,Bt(n)):this.renderer=new E(Bt(t));}get settings(){return this.renderer.settings}set settings(t){this.renderer.settings=t;}initialize(t){this.renderer.initialize(t),this.setupKeyboardShortcuts();}addComment(t,n,i=[]){return this.renderer.addComment(t,n,i)}clearComments(){this.renderer.clearComments();}resetState(){this.renderer.resetState();}hardReset(){this.renderer.hardReset();}destroy(){this.teardownKeyboardShortcuts(),this.renderer.destroy();}updateSettings(t){this.renderer.updateSettings(t);}getVideoElement(){return this.renderer.getVideoElement()}getCurrentVideoSource(){return this.renderer.getCurrentVideoSource()}getCommentsSnapshot(){return this.renderer.getCommentsSnapshot()}isNGComment(t){return this.renderer.isNGComment(t)}resize(t,n){this.renderer.resize(t,n);}setupKeyboardShortcuts(){this.teardownKeyboardShortcuts();const t=new fe;t.addShortcut("C","Shift",()=>{try{const n=this.renderer.settings,i={...n,isCommentVisible:!n.isCommentVisible};this.renderer.updateSettings(i),this.syncGlobalSettings(i);}catch(n){Rr.error("CommentRenderer.keyboardShortcut",n);}}),t.startListening(),this.keyboardHandler=t;}teardownKeyboardShortcuts(){this.keyboardHandler?.stopListening(),this.keyboardHandler=null;}syncGlobalSettings(t){window.dAniRenderer?.settingsManager?.updateSettings(t);}}class Et{shadowRoot=null;container=null;createShadowDOM(t,n={mode:"closed"}){if(!t)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=t.attachShadow(n),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(t){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const n=document.createElement("style");n.textContent=t,this.shadowRoot.appendChild(n);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}querySelectorAll(t){return this.shadowRoot?this.shadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}setHTML(t){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=t;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const _r=`\r
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
`,Dr=`:host {
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
max-width: 480px;
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
line-height: 1.6;
font-size: 13px;
}

.notification-message svg {
display: inline-block;
vertical-align: middle;
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
`,Hr=`:host {
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
`;class st{static getCommonStyles(){return _r}static getNotificationStyles(){return Dr}static getAutoButtonStyles(){return Hr}}const qt={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class b extends Et{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new b),this.instance}static show(t,n="info",i=3e3){try{const r=this.getInstance();return r.initialize(),r.initialized?r.createNotification(t,n,i):null}catch(r){return console.error("[NotificationManager] show failed",r),null}}static removeNotification(t){this.getInstance().removeNotification(t.element);}show(t,n="info"){b.show(t,n);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 2147483647","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(st.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(t){console.error("[NotificationManager] initialize failed",t),this.initialized=false;}}destroy(){b.notifications.forEach(t=>{t.timerId&&window.clearTimeout(t.timerId);}),b.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,b.instance=null;}createNotification(t,n,i){try{const r=this.querySelector(".notification-container");if(!r)throw new Error("Notification container not found");const s=qt[n]??qt.info,a=document.createElement("div");a.className=`notification-item ${n}`;const o=document.createElement("div");o.className="notification-icon",o.innerHTML=`<span>${s}</span>`,a.appendChild(o);const l=document.createElement("div");l.className="notification-content";const d=document.createElement("div");d.className="notification-type",d.textContent=n.charAt(0).toUpperCase()+n.slice(1),l.appendChild(d);const u=document.createElement("div");if(u.className="notification-message",t.includes("<"))u.innerHTML=t||"No message";else {const m=(t||"No message").split(`
`).map(p=>p.trim()).filter(p=>p.length>0).join("<br>");u.innerHTML=m;}l.appendChild(u),a.appendChild(l);const c=document.createElement("button");c.className="notification-close",c.innerHTML="&times;",c.addEventListener("click",()=>{this.removeNotification(a);}),a.appendChild(c),r.appendChild(a),requestAnimationFrame(()=>{a.classList.add("show");});const h={element:a,timerId:window.setTimeout(()=>{this.removeNotification(a);},i)};return b.notifications.push(h),h}catch(r){return console.error("[NotificationManager] createNotification failed",r),null}}removeNotification(t){if(!t)return;const n=b.notifications.find(i=>i.element===t);n?.timerId&&window.clearTimeout(n.timerId),t.classList.remove("show"),window.setTimeout(()=>{try{t.remove(),b.notifications=b.notifications.filter(i=>i.element!==t);}catch(i){console.error("[NotificationManager] removeNotification cleanup failed",i);}},500);}}const ye="https://www.nicovideo.jp",ve=`${ye}/search`,xe=`${ye}/watch`,Ut={searchBase:ve,watchBase:xe},Or=e=>`${xe}/${e}`,we=e=>`${ve}/${encodeURIComponent(e)}`,yt=e=>new Promise((t,n)=>{Pr({url:e.url,method:e.method??"GET",headers:e.headers,data:e.data,responseType:e.responseType??"text",timeout:e.timeout,onprogress:e.onprogress,onload:i=>{t({status:i.status,statusText:i.statusText,response:i.response,finalUrl:i.finalUrl,headers:i.responseHeaders});},onerror:i=>{const r=i?.error??"unknown error";n(new Error(`GM_xmlhttpRequest failed: ${r}`));},ontimeout:()=>{n(new Error("GM_xmlhttpRequest timeout"));}});}),pt=F("dAnime:NicoApiFetcher");class at{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(t){try{const n=this.sanitizeVideoId(t),r=(await yt({method:"GET",url:Or(n),headers:{Accept:"text/html"}})).response,o=new DOMParser().parseFromString(r,"text/html").querySelector('meta[name="server-response"]');if(!o)throw new Error("API data element not found in response");const l=o.getAttribute("content");if(!l)throw new Error("API data content is empty");const d=this.decodeServerResponse(l),c=JSON.parse(d).data?.response;if(!c)throw new Error("Invalid API data structure");return this.apiData=c,c}catch(n){throw pt.error("NicoApiFetcher.fetchApiData",n),n}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const t=this.apiData.comment?.nvComment;if(!t?.server||!t.params||!t.threadKey)throw new Error("Required comment server data is missing");const n=await yt({method:"POST",url:`${t.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:t.params,threadKey:t.threadKey,additionals:{}})}),s=(JSON.parse(n.response).data?.threads??[]).filter(o=>o.fork==="main").sort((o,l)=>(l.commentCount||0)-(o.commentCount||0))[0];if(!s)throw new Error("Main thread not found in comment response");const a=(s.comments??[]).map(o=>({text:o.body??"",vposMs:o.vposMs??0,commands:o.commands??[]}));return this.comments=a,a}catch(t){throw pt.error("NicoApiFetcher.fetchComments",t),t}}async fetchAllData(t){return await this.fetchApiData(t),this.fetchComments()}sanitizeVideoId(t){try{let n=encodeURIComponent(t);return n=n.replace(/%([0-9A-F]{2})/gi,(i,r)=>{const s=parseInt(r,16);return s>=65&&s<=90||s>=97&&s<=122||s>=48&&s<=57||s===45||s===95||s===46||s===126?String.fromCharCode(s):i}),n}catch(n){return pt.error("NicoApiFetcher.sanitizeVideoId",n,{videoId:t}),t}}decodeServerResponse(t){try{return decodeURIComponent(t)}catch(n){try{const i=t.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(i)}catch{throw new Error(`API data decode failed: ${n.message}`)}}}}const Gt=F("dAnime:NicoVideoSearcher");class Tt{cache=new Map;async search(t){if(!t.trim())return [];if(this.cache.has(t))return this.cache.get(t)??[];const n=we(t),i=await this.fetchText(n),r=this.parseServerContext(i).map(o=>{const l=this.calculateLevenshteinDistance(t,o.title),d=Math.max(t.length,o.title.length),u=d>0?(1-l/d)*100:0;return {...o,levenshteinDistance:l,similarity:u}}),s=[],a=new Set;for(const o of r)o?.videoId&&(a.has(o.videoId)||(a.add(o.videoId),s.push(o)));return s.sort((o,l)=>{if(o.commentCount!==l.commentCount)return l.commentCount-o.commentCount;const d=o.similarity??-1,u=l.similarity??-1;return d!==u?u-d:l.viewCount-o.viewCount}),this.cache.set(t,s),s}async fetchText(t){return (await yt({method:"GET",url:t})).response}parseServerContext(t){try{const i=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!i)return [];const r=i.getAttribute("content")??"",s=this.decodeHtmlEntities(r);let a;try{a=JSON.parse(s);}catch(o){return Gt.error("NicoVideoSearcher.parseServerContext",o),[]}return this.extractVideoItems(a??{})}catch(n){return Gt.error("NicoVideoSearcher.parseServerContext",n),[]}}decodeHtmlEntities(t){if(!t)return "";let n=t.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return n=n.replace(/&#(\d+);/g,(i,r)=>String.fromCharCode(parseInt(r,10))),n=n.replace(/&#x([0-9a-fA-F]+);/g,(i,r)=>String.fromCharCode(parseInt(r,16))),n}extractVideoItems(t){const n=[],i=s=>{const a=(s?.id??s?.contentId??s?.watchId??"").toString();if(!a)return;const o=(s?.title??s?.shortTitle??"").toString(),l=s?.count??{},d=Number(l.view??s?.viewCounter??0)||0,u=Number(l.comment??s?.commentCounter??0)||0,c=Number(l.mylist??s?.mylistCounter??0)||0,h=s?.thumbnail??{},m=(h.nHdUrl||h.listingUrl||h.largeUrl||h.middleUrl||h.url||s?.thumbnailUrl||"").toString(),p=(s?.registeredAt||s?.startTime||s?.postedDateTime||"")?.toString?.()??"",v=s?.owner&&typeof s.owner=="object"?{nickname:(s.owner.nickname??s.owner.name??"")||void 0,name:(s.owner.name??s.owner.nickname??"")||void 0}:null,y=(s?.isChannelVideo||s?.owner?.ownerType==="channel")&&s?.owner?{name:s.owner.name??""}:null;o&&n.push({videoId:a,title:o,viewCount:d,commentCount:u,mylistCount:c,thumbnail:m,postedAt:p,owner:v,channel:y});},r=s=>{if(!s)return;if(Array.isArray(s)){s.forEach(r);return}if(typeof s!="object"||s===null)return;const a=s;(a.id||a.contentId||a.watchId)&&i(a),Object.values(s).forEach(r);};return r(t),n}calculateLevenshteinDistance(t,n){const i=t?t.length:0,r=n?n.length:0;if(i===0)return r;if(r===0)return i;const s=new Array(r+1);for(let o=0;o<=r;++o){const l=s[o]=new Array(i+1);l[0]=o;}const a=s[0];for(let o=1;o<=i;++o)a[o]=o;for(let o=1;o<=r;++o)for(let l=1;l<=i;++l){const d=t[l-1]===n[o-1]?0:1;s[o][l]=Math.min(s[o-1][l]+1,s[o][l-1]+1,s[o-1][l-1]+d);}return s[r][i]}}const I={mypageHeaderTitle:".p-mypageHeader__title",mypageListContainer:".p-mypageMain",watchVideoElement:"video#video",mypageItem:".itemModule.list",mypageItemTitle:".line1",mypageEpisodeNumber:".number.line1 span",mypageEpisodeTitle:".episode.line1 span",watchPageAnimeTitle:".backInfoTxt1",watchPageEpisodeNumber:".backInfoTxt2",watchPageEpisodeTitle:".backInfoTxt3"};class kt{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(t){this.delay=t;}getFuncId(t){return this.funcIds.has(t)||this.funcIds.set(t,this.nextId++),this.funcIds.get(t)??0}exec(t){const n=this.getFuncId(t),i=Date.now(),r=this.timers.get(n)?.lastExec??0,s=i-r;if(s>this.delay)t(),this.timers.set(n,{lastExec:i});else {clearTimeout(this.timers.get(n)?.timerId??void 0);const a=setTimeout(()=>{t(),this.timers.set(n,{lastExec:Date.now()});},this.delay-s);this.timers.set(n,{timerId:a,lastExec:r});}}execOnce(t){const n=this.getFuncId(t),i=this.timers.get(n);if(i?.executedOnce){i.timerId&&clearTimeout(i.timerId);return}i?.timerId&&clearTimeout(i.timerId);const r=setTimeout(()=>{try{t();}finally{this.timers.set(n,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(n,{timerId:r,executedOnce:false,scheduled:true});}cancel(t){const n=this.getFuncId(t),i=this.timers.get(n);i?.timerId&&clearTimeout(i.timerId),this.timers.delete(n);}resetExecution(t){const n=this.getFuncId(t),i=this.timers.get(n);i&&(i.timerId&&clearTimeout(i.timerId),this.timers.set(n,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,t]of this.timers)t.timerId&&clearTimeout(t.timerId);this.timers.clear(),this.funcIds.clear();}}const P=F("dAnime:VideoEventLogger");class Se{constructor(t=""){this.prefix=t;}video=null;lastCurrentTime=0;eventListeners=new Map;isEnabled=true;TRACKED_EVENTS=["loadstart","loadedmetadata","loadeddata","canplay","canplaythrough","play","playing","pause","seeking","seeked","timeupdate","ended","emptied","stalled","suspend","waiting","error","abort"];enable(){this.isEnabled=true,P.info(`${this.prefix}:enabled`);}disable(){this.isEnabled=false,P.info(`${this.prefix}:disabled`);}attach(t){this.detach(),this.video=t,this.lastCurrentTime=t.currentTime,P.info(`${this.prefix}:attach`,{src:this.getVideoSource(t),duration:t.duration,currentTime:t.currentTime,readyState:t.readyState}),this.TRACKED_EVENTS.forEach(n=>{const i=()=>{this.handleEvent(n);};this.eventListeners.set(n,i),t.addEventListener(n,i);}),this.setupCurrentTimeWatcher();}detach(){this.video&&(this.eventListeners.forEach((t,n)=>{this.video?.removeEventListener(n,t);}),this.eventListeners.clear(),P.info(`${this.prefix}:detach`,{src:this.getVideoSource(this.video),finalTime:this.video.currentTime}),this.video=null);}handleEvent(t){if(!this.isEnabled||!this.video)return;const n=this.video,i={event:t,currentTime:n.currentTime,duration:n.duration,readyState:n.readyState,paused:n.paused,ended:n.ended,src:this.getVideoSource(n),networkState:n.networkState,timestamp:Date.now()},r=Math.abs(n.currentTime-this.lastCurrentTime);if(t==="timeupdate"){r>.1&&(this.lastCurrentTime=n.currentTime);return}switch(r>.1?(P.info(`${this.prefix}:event:${t}`,{...i,timeDiff:r.toFixed(2),direction:n.currentTime>this.lastCurrentTime?"forward":"backward"}),this.lastCurrentTime=n.currentTime):P.debug(`${this.prefix}:event:${t}`,i),t){case "error":P.error(`${this.prefix}:videoError`,new Error("Video error detected"),{errorCode:n.error?.code??null,errorMessage:n.error?.message??null,...i});break;case "ended":P.warn(`${this.prefix}:videoEnded`,{...i,message:"動画再生が終了しました"});break;case "emptied":P.warn(`${this.prefix}:videoEmptied`,{...i,message:"動画要素が空になりました（src変更の可能性）"});break;case "seeking":P.warn(`${this.prefix}:seeking`,{...i,from:this.lastCurrentTime,to:n.currentTime,diff:(n.currentTime-this.lastCurrentTime).toFixed(2)});break}}setupCurrentTimeWatcher(){if(!Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,"currentTime")?.set){P.warn(`${this.prefix}:currentTimeWatcher:unsupported`);return}P.debug(`${this.prefix}:currentTimeWatcher:setup`);}logManualSeek(t,n,i){this.isEnabled&&P.warn(`${this.prefix}:manualSeek`,{from:t.toFixed(2),to:n.toFixed(2),diff:(n-t).toFixed(2),reason:i,stackTrace:new Error().stack});}getVideoSource(t){const n=typeof t.currentSrc=="string"?t.currentSrc:"";if(n.length>0)return n.length>100?`${n.slice(0,100)}...`:n;const i=t.getAttribute("src")??"";return i.length>0?i.length>100?`${i.slice(0,100)}...`:i:null}}let gt=null;function Kt(){return gt||(gt=new Se("global")),gt}const Nr=1e3,zr=100,$r=30,Yt=1e4,jt=100,Wr=/watch\/(?:([a-z]{2}))?(\d+)/gi,g=F("dAnime:VideoSwitchHandler"),Xt=e=>{if(!e?.video)return null;const t=e.video.registeredAt,n=t?new Date(t).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:e.video.id,title:e.video.title,viewCount:e.video.count?.view,mylistCount:e.video.count?.mylist,commentCount:e.video.count?.comment,postedAt:n,thumbnail:e.video.thumbnail?.url,owner:e.owner??null,channel:e.channel??null}},Br=e=>{const t=[];let n;for(;(n=Wr.exec(e))!==null;){const[,i="",r=""]=n;r&&t.push(`${i}${r}`);}return t};class Ce{constructor(t,n,i,r=Nr,s=zr){this.renderer=t,this.fetcher=n,this.settingsManager=i,this.monitorInterval=r,this.debounce=new kt(s),this.videoEventLogger=new Se("VideoSwitchHandler");}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=false;debounce;videoEventLogger;resetVideoSource(){g.info("videoSwitch:resetVideoSource",{previousSource:this.lastVideoSource}),this.lastVideoSource=null;}startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(t){if(this.isSwitching){g.warn("videoSwitch:alreadySwitching",{timestamp:Date.now()});return}this.isSwitching=true;try{g.warn("videoSwitch:entry",{videoElementProvided:!!t,currentRendererComments:this.renderer.getCommentsSnapshot().length,lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId,lastVideoSource:this.lastVideoSource});const n=await this.resolveVideoElement(t)??null,i=this.preloadedComments??this.lastPreloadedComments??null,r=n?.dataset?.videoId??n?.getAttribute?.("data-video-id")??null,s=this.nextVideoId??r??this.lastVideoId;if(g.warn("videoSwitch:videoIdResolution",{videoId:s??null,nextVideoId:this.nextVideoId,elementId:r,lastVideoId:this.lastVideoId,hasBackupPreloaded:!!i,backupPreloadedCount:i?.length??0}),!n||!s&&!i){g.warn("videoSwitch:earlyReturn",{reason:n?"no videoId and no backup":"no video element",hasVideoElement:!!n,hasVideoId:!!s,hasBackupPreloaded:!!i}),this.handleMissingVideoInfo(i);return}g.warn("videoSwitch:start",{videoId:s??null,elementVideoId:n.dataset?.videoId??null,preloadedCount:i?.length??0,currentTime:n.currentTime,duration:n.duration,readyState:n.readyState,currentSrc:n.currentSrc,lastVideoSource:this.lastVideoSource}),b.show("動画の切り替わりを検知しました...","info"),this.videoEventLogger.attach(n),this.resetRendererState(n);const a=this.renderer.getVideoElement();if(a!==n&&n)g.debug("videoSwitch:rebind",{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof n.currentSrc=="string"&&n.currentSrc.length>0?n.currentSrc:n.getAttribute("src")??null}),this.renderer.initialize(n);else if(a===n&&n&&this.hasVideoSourceChanged(n))g.debug("videoSwitch:rebind:sameElement",{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(n)}),this.renderer.clearComments(),this.renderer.destroy(),this.renderer.initialize(n);else if(!a&&!n){g.warn("videoSwitch:missingVideoElement",{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let o=null;s&&(o=await this.fetchVideoApiData(s,i),o&&(this.persistVideoMetadata(o),this.lastVideoId=s));const l=await this.populateComments(s,i);if(l===0?(this.renderer.clearComments(),b.show("コメントを取得できませんでした","warning"),g.warn("videoSwitch:commentsMissing",{videoId:s??null})):g.warn("videoSwitch:commentsLoaded",{videoId:s??null,count:l}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(n),g.warn("videoSwitch:complete",{videoId:s??null,finalTime:n.currentTime,loadedCount:l,finalCommentsCount:this.renderer.getCommentsSnapshot().length}),o){const d=Xt(o);if(d){const u=`コメントソースを更新しました: ${d.title??"不明なタイトル"}（${l}件）`;b.show(u,l>0?"success":"warning");}}}catch(n){g.error("videoSwitch:error",n,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),b.show(`動画切り替えエラー: ${n.message}`,"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}async resolveVideoElement(t){if(t){const r=this.getVideoSource(t),s=this.lastVideoSource;return (!r||r===s)&&await this.waitForSourceChange(t),t}const n=Date.now()+Yt;let i=null;for(;Date.now()<n;){const r=document.querySelector(I.watchVideoElement);if(r){i=r;const s=this.hasVideoSourceChanged(r);if(r.readyState>=2||!r.paused||s)return s&&(this.lastVideoSource=null),r}await new Promise(s=>window.setTimeout(s,jt));}return i}async waitForSourceChange(t){const n=this.getVideoSource(t);if(!n)return;const i=Date.now()+Yt;for(;Date.now()<i;){const r=this.getVideoSource(t);if(r&&r!==n){this.lastVideoSource=null;return}await new Promise(s=>window.setTimeout(s,jt));}}hasVideoSourceChanged(t){const n=this.getVideoSource(t);return n?this.lastVideoSource?this.lastVideoSource!==n:true:false}getVideoSource(t){if(!t)return null;const n=typeof t.currentSrc=="string"?t.currentSrc:"";if(n.length>0)return n;const i=t.getAttribute("src")??"";if(i.length>0)return i;const r=t.querySelector("source[src]");return r&&typeof r.src=="string"&&r.src.length>0?r.src:null}resetRendererState(t){const n=t.currentTime,i=this.getVideoSource(t),r=this.lastVideoSource!==i,s=this.renderer.getCommentsSnapshot().length;if(g.warn("videoSwitch:resetRendererState:before",{currentTime:n,duration:t.duration,src:i,lastSrc:this.lastVideoSource??null,sourceChanged:r,readyState:t.readyState,paused:t.paused,commentsCount:s}),r)try{this.videoEventLogger.logManualSeek(n,0,"resetRendererState: video source changed"),t.currentTime=0,g.warn("videoSwitch:resetRendererState:seeked",{currentTime:t.currentTime,timeDiff:t.currentTime-n});}catch(a){g.debug("videoSwitch:resetCurrentTimeFailed",a);}else g.warn("videoSwitch:resetRendererState:skipSeek",{reason:"same video source, skipping currentTime reset",currentTime:n,willClearComments:true});g.warn("videoSwitch:resetRendererState:clearingComments",{commentsBeforeClear:s,sourceChanged:r}),r?(g.warn("videoSwitch:resetRendererState:hardReset",{reason:"video source changed, using hardReset for complete cleanup"}),this.renderer.hardReset()):this.renderer.clearComments(),g.warn("videoSwitch:resetRendererState:commentsCleared",{commentsAfterClear:this.renderer.getCommentsSnapshot().length,usedHardReset:r});}async checkVideoEnd(){const t=this.renderer.getVideoElement();if(!(!t||!Number.isFinite(t.duration)||t.duration-t.currentTime>$r)){if(!this.nextVideoId){const i=async()=>{await this.findNextVideoId();};this.debounce.execOnce(i);}if(this.nextVideoId&&!this.preloadedComments){const i=async()=>{await this.preloadComments();};this.debounce.execOnce(i);}}}handleMissingVideoInfo(t){g.warn("videoSwitch:handleMissingVideoInfo",{hasBackupPreloaded:!!t,backupPreloadedCount:t?.length??0,hasLastPreloadedComments:!!this.lastPreloadedComments,lastPreloadedCount:this.lastPreloadedComments?.length??0,willClearComments:!t&&!this.lastPreloadedComments}),!t&&!this.lastPreloadedComments?(g.warn("videoSwitch:clearingCommentsInMissingInfo",{currentCommentCount:this.renderer.getCommentsSnapshot().length}),this.renderer.clearComments(),b.show("次の動画のコメントを取得できませんでした。コメント表示をクリアします。","warning")):g.info("videoSwitch:preservingComments",{reason:"backup or last preloaded comments available",currentCommentCount:this.renderer.getCommentsSnapshot().length});}async fetchVideoApiData(t,n){try{const i=await this.fetcher.fetchApiData(t);return g.debug("videoSwitch:apiFetched",{videoId:t}),i}catch(i){if(g.error("videoSwitch:apiFetchError",i,{videoId:t}),!n)throw i;return null}}persistVideoMetadata(t){const n=Xt(t);n&&this.settingsManager.saveVideoData(n.title??"",n);}async populateComments(t,n){let i=null;if(g.warn("videoSwitch:populateComments:start",{videoId:t,backupPreloadedCount:n?.length??0,hasBackupPreloaded:!!n}),Array.isArray(n)&&n.length>0)i=n,g.warn("videoSwitch:populateComments:usingBackup",{count:i.length});else if(t)try{g.warn("videoSwitch:populateComments:fetching",{videoId:t}),i=await this.fetcher.fetchAllData(t),g.warn("videoSwitch:commentsFetched",{videoId:t,count:i.length});}catch(s){g.error("videoSwitch:commentsFetchError",s,{videoId:t}),b.show(`コメント取得エラー: ${s.message}`,"error"),i=null;}if(!i||i.length===0)return g.warn("videoSwitch:populateComments:noComments"),0;const r=i.filter(s=>!this.renderer.isNGComment(s.text));return g.warn("videoSwitch:populateComments:addingToRenderer",{filteredCount:r.length,totalCount:i.length,rendererCommentsBeforeAdd:this.renderer.getCommentsSnapshot().length}),r.forEach(s=>{this.renderer.addComment(s.text,s.vposMs,s.commands);}),g.warn("videoSwitch:populateComments:complete",{addedCount:r.length,rendererCommentsAfterAdd:this.renderer.getCommentsSnapshot().length}),this.lastPreloadedComments=[...r],r.length}async findNextVideoId(){try{const t=this.fetcher.lastApiData;if(!t)return;const n=t.series?.video?.next?.id;if(n){this.nextVideoId=n,g.debug("videoSwitch:detectedNext",{videoId:n});return}const i=t.video?.description??"";if(!i)return;const r=Br(i);if(r.length===0)return;const s=[...r].sort((a,o)=>{const l=parseInt(a.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(o.replace(/^[a-z]{2}/i,""),10)||0)-l});this.nextVideoId=s[0]??null,this.nextVideoId&&g.debug("videoSwitch:candidateFromDescription",{candidate:this.nextVideoId});}catch(t){g.error("videoSwitch:nextIdError",t,{lastVideoId:this.lastVideoId});}}async preloadComments(){if(this.nextVideoId)try{const n=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(i=>!this.renderer.isNGComment(i.text));this.preloadedComments=n.length>0?n:null,g.debug("videoSwitch:preloaded",{videoId:this.nextVideoId,count:n.length});}catch(t){g.error("videoSwitch:preloadError",t,{videoId:this.nextVideoId}),this.preloadedComments=null;}}}const qr=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class Me{static initialize(){Vr(qr);}}var Ur="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z",Gr="M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z",Kr="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",Yr="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z",jr="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z",Xr="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z",Jr="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",Zr="M5,4V7H10.5V19H13.5V7H19V4H5Z",Qr="M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z",ts="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",es="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",ns="M8,5.14V19.14L19,12.14L8,5.14Z",is="M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z",rs="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";function V(e,t=24){const n=String(t),i=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${i}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}const Jt=V(ns),ss=V(Kr),as=V(es),os=V(ts),Zt=V(Yr),ls=V(Qr),Ee=V(Zr),Te=V(Ur),ke=V(Jr),Ve=V(Xr),cs=V(is),ds=V(Gr),hs=V(jr),us=V(rs),nt=F("dAnime:SettingsUI"),f={searchInput:"#searchInput",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",opacitySelect:"#commentOpacity",visibilityToggle:"#commentVisibilityToggle",fixedPlaybackToggle:"#fixedPlaybackToggle",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",colorValue:".color-value",colorPreview:".color-preview",colorPickerInput:"#colorPickerInput",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",playCurrentVideo:"#playCurrentVideo",settingsModal:"#settingsModal",closeSettingsModal:"#closeSettingsModal",modalOverlay:".settings-modal__overlay",modalTabs:".settings-modal__tab",modalPane:".settings-modal__pane"},G=["search","display","ng"],Qt=`
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
`,ms=`
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
`;class ot extends Et{static FAB_HOST_ID="danime-settings-fab-host";settingsManager;fetcher;searcher;settings;playbackSettings;currentVideoInfo;hostElement=null;lastAutoButtonElement=null;activeTab="search";modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;handleFabClick=t=>{t.preventDefault(),this.openSettingsModal();};handleOverlayClick=()=>{this.closeSettingsModal();};handleCloseClick=()=>{this.closeSettingsModal();};handlePlaybackSettingsChanged;constructor(t,n=new at,i=new Tt){super(),this.settingsManager=t,this.fetcher=n,this.searcher=i,this.settings=this.settingsManager.getSettings(),this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData(),this.handlePlaybackSettingsChanged=r=>{this.playbackSettings=r,this.applyPlaybackSettingsToUI();},this.settingsManager.addPlaybackObserver(this.handlePlaybackSettingsChanged);}insertIntoMypage(){const t=document.querySelector(I.mypageHeaderTitle);t&&(this.hostElement=this.createSettingsUI(),t.parentElement?.insertBefore(this.hostElement,t.nextSibling));}addAutoCommentButtons(){}async waitMypageListStable(){}tryRestoreByDanimeIds(){return  false}createSettingsUI(){const t=document.createElement("div");t.className="nico-comment-shadow-host settings-host",this.createShadowDOM(t),this.addStyles(st.getCommonStyles());const n=this.buildSettingsHtml();return this.setHTML(n),this.applySettingsToUI(),this.addStyles(Qt),this.setupEventListeners(),t}buildSettingsHtml(){const t=r=>typeof r=="number"?r.toLocaleString():"-",n=r=>{if(!r)return "-";try{return new Date(r).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return r}},i=this.currentVideoInfo;return `
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="バージョン">${kr}</span>
        </h2>
        <div class="setting-group current-settings">
          <h3>オーバーレイする動画</h3>
          <div id="currentVideoInfo" class="current-video-info">
            <div class="thumbnail-wrapper">
              <div class="thumbnail-container">
                <img id="currentThumbnail" src="${i?.thumbnail??""}" alt="サムネイル">
                <div class="thumbnail-overlay"></div>
              </div>
            </div>
            <div class="info-container" role="list">
              <div class="info-item info-item--wide" role="listitem" title="動画ID">
                <span class="info-icon" aria-hidden="true">${ls}</span>
                <span class="sr-only">動画ID</span>
                <span class="info-value" id="currentVideoId">${i?.videoId??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="タイトル">
                <span class="info-icon" aria-hidden="true">${Ee}</span>
                <span class="sr-only">タイトル</span>
                <span class="info-value" id="currentTitle">${i?.title??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="投稿者">
                <span class="info-icon" aria-hidden="true">${Te}</span>
                <span class="sr-only">投稿者</span>
                <span class="info-value" id="currentOwner">${i?.owner?.nickname??i?.channel?.name??"-"}</span>
              </div>
              <div class="info-item" role="listitem" title="再生数">
                <span class="info-icon" aria-hidden="true">${ke}</span>
                <span class="sr-only">再生数</span>
                <span class="info-value" id="currentViewCount">${t(i?.viewCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="コメント数">
                <span class="info-icon" aria-hidden="true">${Ve}</span>
                <span class="sr-only">コメント数</span>
                <span class="info-value" id="currentCommentCount">${t(i?.commentCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="マイリスト数">
                <span class="info-icon" aria-hidden="true">${cs}</span>
                <span class="sr-only">マイリスト数</span>
                <span class="info-value" id="currentMylistCount">${t(i?.mylistCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="投稿日">
                <span class="info-icon" aria-hidden="true">${ds}</span>
                <span class="sr-only">投稿日</span>
                <span class="info-value" id="currentPostedAt">${n(i?.postedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}buildModalHtml(){const t=["#FFFFFF","#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF"].map(i=>`<button class="color-preset-btn" data-color="${i}" style="background-color: ${i}"></button>`).join(""),n=["0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.75","0.8","0.9","1.0"].map(i=>`<option value="${i}">${i}</option>`).join("");return `
      <div id="settingsModal" class="settings-modal hidden" role="dialog" aria-modal="true" aria-labelledby="settingsModalTitle" aria-hidden="true">
        <div class="settings-modal__overlay"></div>
        <div class="settings-modal__content">
          <header class="settings-modal__header">
            <h3 id="settingsModalTitle">設定</h3>
            <button id="closeSettingsModal" class="settings-modal__close" type="button" aria-label="設定を閉じる">
              <span aria-hidden="true">${ss}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${Zt}</span>
              <span class="settings-modal__tab-label">検索</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="display" role="tab" aria-selected="false" aria-controls="settingsPaneDisplay" id="settingsTabDisplay" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${as}</span>
              <span class="settings-modal__tab-label">表示</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${os}</span>
              <span class="settings-modal__tab-label">NG</span>
            </button>
          </div>
          <div class="settings-modal__panes">
            <section class="settings-modal__pane is-active" data-pane="search" role="tabpanel" id="settingsPaneSearch" aria-labelledby="settingsTabSearch">
              <div class="setting-group search-section">
                <h3>コメントをオーバーレイする動画を検索</h3>
                <p class="search-section__note" style="background: #7F5AF0; color: #FFFFFE; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
                  ℹ️ <strong>自動設定機能が有効です</strong><br>
                  視聴ページを開くと、アニメタイトル・話数・エピソードタイトルから自動的にコメント数が最も多いニコニコ動画を検索して表示します。<br>
                  手動で検索したい場合は、以下のフォームをご利用ください。
                </p>
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
                          ${n}
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
                </div>
              </div>
            </section>
            <section class="settings-modal__pane" data-pane="ng" role="tabpanel" id="settingsPaneNg" aria-labelledby="settingsTabNg" aria-hidden="true">
              <div class="setting-group ng-settings">
                <div class="ng-settings__column" aria-labelledby="ngWordsTitle">
                  <h3 id="ngWordsTitle" class="ng-settings__title">NGワード</h3>
                  <textarea class="ng-settings__textarea" id="ngWords" placeholder="NGワードを1行ずつ入力">${(this.settings.ngWords??[]).join(`
`)}</textarea>
                </div>
                <div class="ng-settings__column" aria-labelledby="ngRegexTitle">
                  <h3 id="ngRegexTitle" class="ng-settings__title">NG正規表現</h3>
                  <textarea class="ng-settings__textarea" id="ngRegexps" placeholder="NG正規表現を1行ずつ入力">${(this.settings.ngRegexps??[]).join(`
`)}</textarea>
                </div>
              </div>
            </section>
          </div>
          <footer class="settings-modal__footer">
            <button id="playCurrentVideo" class="settings-modal__play-button" type="button" title="この動画を再生">
              <span class="settings-modal__play-icon" aria-hidden="true">${Jt}</span>
              <span class="settings-modal__play-label">動画を再生</span>
            </button>
            <button id="saveSettings" type="button">設定を保存</button>
          </footer>
        </div>
      </div>
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupColorPresets(),this.setupColorPicker(),this.setupOpacitySelect(),this.setupVisibilityToggle(),this.setupPlaybackToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupPlayButton();}setupModalControls(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick);const t=this.createOrUpdateFab(),n=this.queryModalElement(f.settingsModal),i=this.queryModalElement(f.closeSettingsModal),r=this.queryModalElement(f.modalOverlay);this.modalElement=n??null,this.closeButtonElement=i??null,this.overlayElement=r??null,!(!n||!i||!r||!t)&&(this.fabElement?.removeEventListener("click",this.handleFabClick),t.addEventListener("click",this.handleFabClick),t.setAttribute("aria-controls",n.id),t.setAttribute("aria-haspopup","dialog"),t.setAttribute("aria-expanded","false"),this.fabElement=t,i.addEventListener("click",this.handleCloseClick),r.addEventListener("click",this.handleOverlayClick),this.shadowRoot?.addEventListener("keydown",s=>{const a=s;a.key==="Escape"&&!this.modalElement?.classList.contains("hidden")&&(a.preventDefault(),this.closeSettingsModal());}),this.applySettingsToUI());}setupModalTabs(){const t=Array.from(this.queryModalSelectorAll(f.modalTabs)),n=Array.from(this.queryModalSelectorAll(f.modalPane));if(t.length===0||n.length===0)return;const i=r=>{t.forEach(s=>{const o=this.toModalTabKey(s.dataset.tab)===r;s.classList.toggle("is-active",o),s.setAttribute("aria-selected",String(o)),s.setAttribute("tabindex",o?"0":"-1");}),n.forEach(s=>{const o=this.toModalTabKey(s.dataset.pane)===r;s.classList.toggle("is-active",o),s.setAttribute("aria-hidden",String(!o));}),this.activeTab=r;};t.forEach(r=>{r.addEventListener("click",()=>{const s=this.toModalTabKey(r.dataset.tab);s&&i(s);}),r.addEventListener("keydown",s=>{const a=s;if(a.key!=="ArrowRight"&&a.key!=="ArrowLeft")return;a.preventDefault();const o=this.toModalTabKey(r.dataset.tab);if(!o)return;const l=a.key==="ArrowRight"?1:-1,d=(G.indexOf(o)+l+G.length)%G.length,u=G[d];i(u),t.find(h=>this.toModalTabKey(h.dataset.tab)===u)?.focus({preventScroll:true});});}),i(this.activeTab);}openSettingsModal(t=true){!this.modalElement||!this.fabElement||(this.modalElement.classList.remove("hidden"),this.modalElement.setAttribute("aria-hidden","false"),this.fabElement.setAttribute("aria-expanded","true"),t&&this.queryModalElement(`${f.modalTabs}.is-active`)?.focus({preventScroll:true}));}closeSettingsModal(){!this.modalElement||!this.fabElement||(this.modalElement.classList.add("hidden"),this.modalElement.setAttribute("aria-hidden","true"),this.fabElement.setAttribute("aria-expanded","false"),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:true}));}toModalTabKey(t){return t&&G.includes(t)?t:null}setupColorPresets(){this.queryModalSelectorAll(".color-preset-btn").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.color;if(!i)return;this.settings.commentColor=i;const r=this.queryModalElement(f.colorPreview),s=this.queryModalElement(f.colorValue);r&&(r.style.backgroundColor=i),s&&(s.textContent=i);});});}setupColorPicker(){const t=this.queryModalElement(f.colorPickerInput);t&&t.addEventListener("input",()=>{this.settings.commentColor=t.value;const n=this.queryModalElement(f.colorPreview),i=this.queryModalElement(f.colorValue);n&&(n.style.backgroundColor=t.value),i&&(i.textContent=t.value);});}setupOpacitySelect(){const t=this.queryModalElement(f.opacitySelect);t&&(t.value=(this.settings.commentOpacity??1).toString(),t.addEventListener("change",()=>{const n=Number(t.value);Number.isNaN(n)||(this.settings.commentOpacity=n);}));}setupVisibilityToggle(){const t=this.queryModalElement(f.visibilityToggle);t&&(t.addEventListener("click",()=>{this.settings.isCommentVisible=!this.settings.isCommentVisible,this.updateVisibilityToggleState(t);}),this.updateVisibilityToggleState(t));}setupPlaybackToggle(){const t=this.queryModalElement(f.fixedPlaybackToggle);t&&(t.addEventListener("click",()=>{const n=!this.playbackSettings.fixedModeEnabled,i={...this.playbackSettings,fixedModeEnabled:n};if(!this.settingsManager.updatePlaybackSettings(i)){b.show("再生速度の設定変更に失敗しました","error"),this.applyPlaybackSettingsToUI();return}this.playbackSettings=i,this.updatePlaybackToggleState(t),b.show(n?`${this.formatPlaybackRateLabel(this.playbackSettings.fixedRate)}固定モードを有効にしました`:"固定再生モードを無効にしました","success");}),this.updatePlaybackToggleState(t));}setupNgControls(){const t=this.queryModalElement(f.ngWords);t&&t.classList.remove("hidden");const n=this.queryModalElement(f.ngRegexps);n&&n.classList.remove("hidden");}setupSaveButton(){const t=this.queryModalElement(f.saveButton);t&&t.addEventListener("click",()=>this.saveSettings());}setupSearch(){const t=this.queryModalElement(f.searchInput),n=this.queryModalElement(f.searchButton),i=this.queryModalElement(f.openSearchPage),r=async()=>{const s=t?.value.trim();if(!s){b.show("キーワードを入力してください","warning");return}await this.executeSearch(s);};n?.addEventListener("click",r),t?.addEventListener("keydown",s=>{s.key==="Enter"&&r();}),i?.addEventListener("click",s=>{s.preventDefault();const a=t?.value.trim(),o=a?we(a):Ut.searchBase;vt().open(o,"_blank","noopener");});}async executeSearch(t){try{b.show(`「${t}」を検索中...`,"info");const n=await this.searcher.search(t);return this.renderSearchResults(n,i=>this.renderSearchResultItem(i)),n.length===0&&b.show("検索結果が見つかりませんでした","warning"),n}catch(n){return nt.error("SettingsUI.executeSearch",n),[]}}setSearchKeyword(t){const n=this.queryModalElement(f.searchInput);n&&(n.value=t,n.focus({preventScroll:true}));}renderSearchResults(t,n){const i=this.queryModalElement(f.searchResults);if(!i)return;i.innerHTML=t.map(s=>n(s)).join(""),i.querySelectorAll(".search-result-item").forEach((s,a)=>{s.addEventListener("click",()=>{const l=t[a];this.applySearchResult(l);});const o=s.querySelector(".open-search-page-direct-btn");o&&o.addEventListener("click",l=>{l.stopPropagation();});});}renderSearchResultItem(t){const n=this.formatSearchResultDate(t.postedAt),i=typeof t.similarity=="number"?`
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
              ${Jt}
            </span>
            <span>${t.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="コメント">
              ${hs}
            </span>
            <span>${t.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="マイリスト">
              ${us}
            </span>
            <span>${t.mylistCount.toLocaleString()}</span>
            ${i}
          </div>
          <div class="date">${n}</div>
          <a href="${Ut.watchBase}/${t.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(t){try{const n=await this.fetcher.fetchApiData(t.videoId);await this.fetcher.fetchComments(),b.show(`「${t.title}」のコメントを設定しました`,"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(t,n));}catch(n){nt.error("SettingsUI.applySearchResult",n);}}buildVideoMetadata(t,n){return {videoId:t.videoId,title:t.title,viewCount:n.video?.count?.view??t.viewCount,commentCount:n.video?.count?.comment??t.commentCount,mylistCount:n.video?.count?.mylist??t.mylistCount,postedAt:n.video?.registeredAt??t.postedAt,thumbnail:n.video?.thumbnail?.url??t.thumbnail,owner:n.owner??t.owner??void 0,channel:n.channel??t.channel??void 0}}applySettingsToUI(){const t=this.queryModalElement(f.opacitySelect),n=this.queryModalElement(f.visibilityToggle),i=this.queryModalElement(f.colorPreview),r=this.queryModalElement(f.colorValue),s=this.queryModalElement(f.ngWords),a=this.queryModalElement(f.ngRegexps);t&&(t.value=(this.settings.commentOpacity??1).toString()),n&&this.updateVisibilityToggleState(n),i&&this.settings.commentColor&&(i.style.backgroundColor=this.settings.commentColor),r&&this.settings.commentColor&&(r.textContent=this.settings.commentColor),s&&(s.value=(this.settings.ngWords??[]).join(`
`)),a&&(a.value=(this.settings.ngRegexps??[]).join(`
`)),this.applyPlaybackSettingsToUI(),this.updatePlayButtonState(this.currentVideoInfo);}saveSettings(){const t=this.queryModalElement(f.opacitySelect),n=this.queryModalElement(f.ngWords),i=this.queryModalElement(f.ngRegexps);if(t){const r=Number(t.value);Number.isNaN(r)||(this.settings.commentOpacity=r);}n&&(this.settings.ngWords=n.value.split(`
`).map(r=>r.trim()).filter(Boolean)),i&&(this.settings.ngRegexps=i.value.split(`
`).map(r=>r.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings);}updateCurrentVideoInfo(t){this.currentVideoInfo=t,[["currentTitle",t.title??"-"],["currentVideoId",t.videoId??"-"],["currentOwner",t.owner?.nickname??t.channel?.name??"-"],["currentViewCount",this.formatNumber(t.viewCount)],["currentCommentCount",this.formatNumber(t.commentCount)],["currentMylistCount",this.formatNumber(t.mylistCount)],["currentPostedAt",this.formatSearchResultDate(t.postedAt)]].forEach(([r,s])=>{const a=this.querySelector(f[r]);a&&(a.textContent=s);});const i=this.querySelector(f.currentThumbnail);i&&t.thumbnail&&(i.src=t.thumbnail,i.alt=t.title??"サムネイル");try{this.settingsManager.saveVideoData(t.title??"",t);}catch(r){nt.error("SettingsUI.updateCurrentVideoInfo",r);}this.updatePlayButtonState(t);}formatNumber(t){return typeof t=="number"?t.toLocaleString():"-"}formatSearchResultDate(t){if(!t)return "-";const n=new Date(t);return Number.isNaN(n.getTime())?t:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(n)}formatPlaybackRateLabel(t){return `${(Number.isFinite(t)?t:1.11).toFixed(2).replace(/\.?0+$/,"")}倍`}setupPlayButton(){const t=this.queryModalElement(f.playCurrentVideo);t&&(t.addEventListener("click",()=>{try{if(!this.currentVideoInfo?.videoId){b.show("再生できる動画が設定されていません","warning");return}const i=this.lastAutoButtonElement?.closest(".itemModule.list");if(this.lastAutoButtonElement){const r=i?.querySelector(".thumbnailContainer > a, .thumbnail-container > a");if(r){b.show(`「${this.currentVideoInfo?.title||"動画"}」を再生します...`,"success"),setTimeout(()=>{r.click();},300);return}}b.show("再生リンクが見つかりませんでした（対象アイテム内に限定して検索済み）","warning");}catch(n){nt.error("SettingsUI.playCurrentVideo",n),b.show(`再生エラー: ${n.message}`,"error");}}),this.updatePlayButtonState(this.currentVideoInfo));}updatePlayButtonState(t){const n=this.queryModalElement(f.playCurrentVideo);if(!n)return;const i=!!t?.videoId;n.disabled=!i,n.setAttribute("aria-disabled",(!i).toString());}updateVisibilityToggleState(t){t.textContent=this.settings.isCommentVisible?"表示中":"非表示中",t.classList.toggle("off",!this.settings.isCommentVisible);}applyPlaybackSettingsToUI(){const t=this.queryModalElement(f.fixedPlaybackToggle);t&&this.updatePlaybackToggleState(t);}updatePlaybackToggleState(t){const n=this.playbackSettings.fixedModeEnabled;t.textContent=n?`${this.formatPlaybackRateLabel(this.playbackSettings.fixedRate)}固定中`:"標準速度",t.classList.toggle("off",!n),t.setAttribute("aria-pressed",n?"true":"false");}destroy(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),this.settingsManager.removePlaybackObserver(this.handlePlaybackSettingsChanged),super.destroy();}createOrUpdateFab(){if(!document.body)return null;let t=this.fabHostElement;!t||!t.isConnected?(t?.remove(),t=document.createElement("div"),t.id=ot.FAB_HOST_ID,t.style.position="fixed",t.style.bottom="32px",t.style.right="32px",t.style.zIndex="2147483646",t.style.display="inline-block",this.fabShadowRoot=t.attachShadow({mode:"open"}),document.body.appendChild(t),this.fabHostElement=t):this.fabShadowRoot||(this.fabShadowRoot=t.shadowRoot??t.attachShadow({mode:"open"}));const n=this.fabShadowRoot;if(!n)return null;let i=n.querySelector("style[data-role='fab-base-style']");i||(i=document.createElement("style"),i.dataset.role="fab-base-style",i.textContent=st.getCommonStyles(),n.appendChild(i));let r=n.querySelector("style[data-role='fab-style']");r||(r=document.createElement("style"),r.dataset.role="fab-style",r.textContent=`
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
      `,n.appendChild(r));let s=n.querySelector("style[data-role='similarity-style']");s||(s=document.createElement("style"),s.dataset.role="similarity-style",s.textContent=Qt,n.appendChild(s));let a=n.querySelector("style[data-role='modal-play-button-style']");a||(a=document.createElement("style"),a.dataset.role="modal-play-button-style",a.textContent=ms,n.appendChild(a));let o=n.querySelector(".fab-container");o||(o=document.createElement("div"),o.className="fab-container",n.appendChild(o));let l=o.querySelector("button.fab-button");l||(l=document.createElement("button"),l.type="button",l.className="fab-button",o.appendChild(l)),l.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${Zt}</span>
      <span class="fab-button__label">設定</span>
    `,l.setAttribute("aria-label","ニコニココメント設定を開く"),l.setAttribute("aria-haspopup","dialog");let d=o.querySelector(f.settingsModal);return d||(o.insertAdjacentHTML("beforeend",this.buildModalHtml()),d=o.querySelector(f.settingsModal)),this.modalElement=d??null,l}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener("click",this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null;}queryModalElement(t){return this.fabShadowRoot?this.fabShadowRoot.querySelector(t):null}queryModalSelectorAll(t){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}}const ps=F("dAnime:PlaybackRateController"),gs=1,fs=200,bs=1e-4;class Pe{constructor(t){this.settingsManager=t,this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.settingsObserver=n=>{this.playbackSettings=n,this.applyCurrentMode();},this.settingsManager.addPlaybackObserver(this.settingsObserver);}currentVideo=null;playbackSettings;settingsObserver;isApplying=false;retryTimer=null;handleLoadedMetadata=()=>{this.applyCurrentMode();};handleRateChange=()=>{this.isApplying||this.playbackSettings.fixedModeEnabled&&this.scheduleApply();};handlePlay=()=>{this.applyCurrentMode();};handleEmptied=()=>{this.scheduleApply();};bind(t){if(this.currentVideo===t){this.applyCurrentMode();return}this.detachVideoListeners(),this.cancelScheduledApply(),this.currentVideo=t,this.attachVideoListeners(t),this.applyCurrentMode();}unbind(){this.cancelScheduledApply(),this.detachVideoListeners(),this.currentVideo=null;}dispose(){this.unbind(),this.settingsManager.removePlaybackObserver(this.settingsObserver);}attachVideoListeners(t){t.addEventListener("loadedmetadata",this.handleLoadedMetadata),t.addEventListener("ratechange",this.handleRateChange),t.addEventListener("play",this.handlePlay),t.addEventListener("emptied",this.handleEmptied);}detachVideoListeners(){this.currentVideo&&(this.currentVideo.removeEventListener("loadedmetadata",this.handleLoadedMetadata),this.currentVideo.removeEventListener("ratechange",this.handleRateChange),this.currentVideo.removeEventListener("play",this.handlePlay),this.currentVideo.removeEventListener("emptied",this.handleEmptied));}applyCurrentMode(){const t=this.currentVideo;t&&(this.playbackSettings.fixedModeEnabled?this.setPlaybackRate(t,this.playbackSettings.fixedRate):this.setPlaybackRate(t,gs));}setPlaybackRate(t,n){if(!(!Number.isFinite(n)||n<=0)&&!(Math.abs(t.playbackRate-n)<=bs)){this.isApplying=true;try{t.playbackRate=n;}catch(i){ps.warn("再生速度の設定に失敗しました",i),this.scheduleApply();}finally{window.setTimeout(()=>{this.isApplying=false;},0);}}}scheduleApply(){this.cancelScheduledApply(),this.retryTimer=window.setTimeout(()=>{this.retryTimer=null,this.applyCurrentMode();},fs);}cancelScheduledApply(){this.retryTimer!==null&&(window.clearTimeout(this.retryTimer),this.retryTimer=null);}}const te=async()=>{},ys=()=>{const e=vt();if(!e.dAniRenderer){const t={};e.dAniRenderer={classes:{Comment:ue,CommentRenderer:be,NicoApiFetcher:at,NotificationManager:b,StyleManager:Me,SettingsUI:ot,NicoVideoSearcher:Tt,VideoSwitchHandler:Ce,SettingsManager:Mt,KeyboardShortcutHandler:fe,DebounceExecutor:kt,ShadowDOMComponent:Et,ShadowStyleManager:st,PlaybackRateController:Pe},instances:t,utils:{initialize:te,initializeWithVideo:te},debug:{showState:()=>{console.log("Current instances:",t);},showSettings:()=>{const n=t.settingsManager;if(!n){console.log("SettingsManager not initialized");return}console.log("Current settings:",n.getSettings());},showComments:()=>{const n=t.renderer;if(!n){console.log("CommentRenderer not initialized");return}console.log("Current comments:",n.getCommentsSnapshot());}},defaultSettings:$};}return e.dAniRenderer},vs=100,xs=1e3,ee=3e3,ws=2e3,w=F("dAnime:WatchPageController");class Ss{constructor(t){this.global=t;}initialized=false;switchDebounce=new kt(xs);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;playbackRateController=null;lastPartId=null;partIdMonitorIntervalId=null;isPartIdChanging=false;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(t=>{window.addEventListener("load",()=>t(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const t=document.querySelector(I.watchVideoElement);if(!t){window.setTimeout(()=>this.waitForVideoElement(),vs);return}if(t.readyState===0){t.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(t);},{once:true});return}this.initializeWithVideo(t);}async initializeWithVideo(t){if(!this.initialized){this.initialized=true;try{b.show("コメントローダーを初期化中...");const n=b.getInstance(),i=this.global.settingsManager??new Mt(n);if(this.global.settingsManager=i,this.global.instances.settingsManager=i,await this.waitForMetadataElements(),!await this.autoSetupComments(i))throw new Error("視聴ページからの自動取得に失敗しました。メタデータが取得できませんでした。");const s=i.loadVideoData();if(!s?.videoId)throw new Error("動画データが見つかりません。");const a=new at;this.global.instances.fetcher=a,await a.fetchApiData(s.videoId);const o=await a.fetchComments(),l=this.mergeSettings(i.loadSettings()),d=new be(l);d.initialize(t),this.global.instances.renderer=d,this.currentVideoElement=t;const u=this.playbackRateController??new Pe(i);this.playbackRateController=u,this.global.instances.playbackRateController=u,u.bind(t),i.addObserver(h=>{d.settings=this.mergeSettings(h);}),o.forEach(h=>{d.addComment(h.text,h.vposMs,h.commands);});const c=new Ce(d,a,i);c.startMonitoring(),this.global.instances.switchHandler=c,this.setupSwitchHandling(t,c),this.observeVideoElement(),this.startPartIdMonitoring(),b.show(`コメントの読み込みが完了しました（${o.length}件）`,"success");}catch(n){throw this.initialized=false,b.show(`初期化エラー: ${n.message}`,"error"),n}}}mergeSettings(t){const n=$();return {...n,...t,ngWords:[...t.ngWords??n.ngWords],ngRegexps:[...t.ngRegexps??n.ngRegexps]}}setupSwitchHandling(t,n){this.currentVideoElement=t,this.switchCallback=()=>{if(this.isPartIdChanging){w.info("watchPageController:switchBlocked",{reason:"partId change in progress"});return}const i=Date.now();if(i-this.lastSwitchTimestamp<ee){w.debug("watchPageController:switchCooldown",{timeSinceLastSwitch:i-this.lastSwitchTimestamp,cooldownMs:ee});return}this.lastSwitchTimestamp=i;const r=this.currentVideoElement;w.info("watchPageController:switchHandlerTriggered",{currentTime:r?.currentTime??null,duration:r?.duration??null}),n.onVideoSwitch(r);},this.global.utils.initializeWithVideo=async i=>{i&&(this.rebindVideoElement(i),this.playbackRateController?.bind(i),await n.onVideoSwitch(i));},this.currentVideoElement=t;}observeVideoElement(){const t=this.currentVideoElement;t&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{const n=document.querySelector(I.watchVideoElement);!n||n===this.currentVideoElement||this.rebindVideoElement(n);}),this.domMutationObserver.observe(document.body,{childList:true,subtree:true}),this.attachVideoEventListeners(t));}rebindVideoElement(t){this.detachVideoEventListeners(),this.currentVideoElement=t;const n=this.global.instances.renderer,i=this.global.instances.switchHandler;n&&(n.clearComments(),n.destroy(),n.initialize(t),n.resize()),this.playbackRateController?.bind(t),i&&(i.onVideoSwitch(t),this.setupSwitchHandling(t,i)),this.attachVideoEventListeners(t);}attachVideoEventListeners(t){this.detachVideoEventListeners(),Kt().attach(t);const i=()=>{this.switchCallback&&(w.info("watchPageController:eventTriggered",{currentTime:t.currentTime,duration:t.duration,ended:t.ended,paused:t.paused}),this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));};t.addEventListener("ended",i),t.addEventListener("loadedmetadata",i),t.addEventListener("emptied",i),this.videoEndedListener=i;}detachVideoEventListeners(){const t=this.currentVideoElement;Kt().detach(),t&&this.videoEndedListener&&(t.removeEventListener("ended",this.videoEndedListener),t.removeEventListener("loadedmetadata",this.videoEndedListener),t.removeEventListener("emptied",this.videoEndedListener)),this.videoEndedListener=null;}async waitForMetadataElements(){for(let i=0;i<50;i++){const r=document.querySelector(I.watchPageAnimeTitle),s=document.querySelector(I.watchPageEpisodeNumber),a=document.querySelector(I.watchPageEpisodeTitle),o=r?.textContent?.trim()??"",l=s?.textContent?.trim()??"",d=a?.textContent?.trim()??"";if(o&&l&&d)return;await new Promise(u=>window.setTimeout(u,100));}w.warn("watchPageController:waitForMetadata:timeout",{maxRetries:50});}extractMetadataFromPage(){try{const t=document.querySelector(I.watchPageAnimeTitle),n=document.querySelector(I.watchPageEpisodeNumber),i=document.querySelector(I.watchPageEpisodeTitle),r=t?.textContent?.trim()??"",s=n?.textContent?.trim()??"",a=i?.textContent?.trim()??"";return !r||!s||!a?null:{animeTitle:r,episodeNumber:s,episodeTitle:a}}catch(t){return w.error("watchPageController:extractMetadata:error",t),null}}async autoSetupComments(t){try{const n=this.extractMetadataFromPage();if(!n)return !1;const i=[n.animeTitle,n.episodeNumber,n.episodeTitle].filter(Boolean).join(" ");w.info("watchPageController:autoSetup",{keyword:i,animeTitle:n.animeTitle,episodeNumber:n.episodeNumber,episodeTitle:n.episodeTitle}),b.show(`「${i}」を検索中...`,"info");const s=await new Tt().search(i);if(s.length===0)return b.show("ニコニコ動画が見つかりませんでした","warning"),!1;const a=s[0],l=await new at().fetchApiData(a.videoId),d={videoId:a.videoId,title:a.title,viewCount:l.video?.count?.view??a.viewCount,commentCount:l.video?.count?.comment??a.commentCount,mylistCount:l.video?.count?.mylist??a.mylistCount,postedAt:l.video?.registeredAt??a.postedAt,thumbnail:l.video?.thumbnail?.url??a.thumbnail,owner:l.owner??a.owner??null,channel:l.channel??a.channel??null};if(t.saveVideoData(a.title,d)){w.info("watchPageController:autoSetup:success",{videoId:a.videoId,title:a.title,commentCount:a.commentCount});const c=a.owner?.nickname||a.channel?.name||"不明",h=['<div style="font-weight: 600; margin-bottom: 8px;">ニコニコ動画を自動設定しました</div>','<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ee}</span>`,`  <span style="flex: 1; word-break: break-word;">${a.title}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Te}</span>`,`  <span>${c}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">','  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${ke}</span>`,`    <span>${a.viewCount.toLocaleString()}</span>`,"  </div>",'  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ve}</span>`,`    <span>${a.commentCount.toLocaleString()}</span>`,"  </div>","</div>"].join("");return b.show(h,"success",5e3),!0}return !1}catch(n){return w.error("watchPageController:autoSetup:error",n),b.show(`自動設定エラー: ${n.message}`,"error"),false}}getCurrentPartId(){try{return new URLSearchParams(window.location.search).get("partId")}catch(t){return w.error("watchPageController:getCurrentPartId:error",t),null}}startPartIdMonitoring(){this.stopPartIdMonitoring(),this.lastPartId=this.getCurrentPartId(),this.partIdMonitorIntervalId=window.setInterval(()=>{this.checkPartIdChange();},ws);}stopPartIdMonitoring(){this.partIdMonitorIntervalId!==null&&(window.clearInterval(this.partIdMonitorIntervalId),this.partIdMonitorIntervalId=null);}async checkPartIdChange(){const t=this.getCurrentPartId();t===null||t===this.lastPartId||(w.warn("watchPageController:partIdChanged",{oldPartId:this.lastPartId,newPartId:t,url:window.location.href,timestamp:new Date().toISOString()}),this.lastPartId=t,await this.onPartIdChanged());}async waitForVideoReady(t){const r=Date.now();for(w.info("watchPageController:waitForVideoReady:start",{readyState:t.readyState,duration:t.duration,src:t.currentSrc});t.readyState<2&&Date.now()-r<5e3;)await new Promise(s=>window.setTimeout(s,100));w.info("watchPageController:waitForVideoReady:complete",{readyState:t.readyState,duration:t.duration,waited:Date.now()-r});}async onPartIdChanged(){this.isPartIdChanging=true;try{const t=this.global.settingsManager;if(!t){w.warn("watchPageController:onPartIdChanged:noSettingsManager");return}w.info("watchPageController:onPartIdChanged:start",{currentVideoElement:this.currentVideoElement?"present":"null",rendererExists:!!this.global.instances.renderer,switchHandlerExists:!!this.global.instances.switchHandler,isPartIdChanging:this.isPartIdChanging}),b.show("エピソード切り替えを検知しました...","info");const n=await this.autoSetupComments(t);if(w.info("watchPageController:onPartIdChanged:autoSetup",{success:n}),n){const i=t.loadVideoData();w.warn("watchPageController:onPartIdChanged:loadedVideoData",{videoId:i?.videoId??null,title:i?.title??null});const r=this.currentVideoElement??document.querySelector(I.watchVideoElement);if(w.warn("watchPageController:onPartIdChanged:videoElement",{videoElementFound:!!r,currentTime:r?.currentTime??null,duration:r?.duration??null,src:r?.currentSrc??null,readyState:r?.readyState??null}),r&&i?.videoId){await this.waitForVideoReady(r),r.dataset.videoId=i.videoId;const s=this.global.instances.renderer,a=this.global.instances.switchHandler;w.warn("watchPageController:onPartIdChanged:beforeSwitch",{rendererCommentCount:s?.getCommentsSnapshot().length??0,videoCurrentTime:r.currentTime,videoReadyState:r.readyState,videoSrc:r.currentSrc,videoId:i.videoId}),s&&a&&(w.warn("watchPageController:onPartIdChanged:hardResetBefore",{commentsBeforeReset:s.getCommentsSnapshot().length}),s.hardReset(),w.warn("watchPageController:onPartIdChanged:hardResetAfter",{commentsAfterReset:s.getCommentsSnapshot().length}),a.resetVideoSource(),await a.onVideoSwitch(r),w.warn("watchPageController:onPartIdChanged:afterSwitch",{rendererCommentCount:s.getCommentsSnapshot().length,videoCurrentTime:r.currentTime}));}}w.info("watchPageController:onPartIdChanged:complete");}catch(t){w.error("watchPageController:onPartIdChanged:error",t),b.show(`エピソード切り替えエラー: ${t.message}`,"error");}finally{this.isPartIdChanging=false,w.info("watchPageController:onPartIdChanged:flagReset",{isPartIdChanging:this.isPartIdChanging});}}}const Cs=100;class Ms{constructor(t){this.global=t;}initialize(){const t=b.getInstance(),n=this.global.settingsManager??new Mt(t);this.global.settingsManager=n,this.global.instances.settingsManager=n;const i=new ot(n);this.waitForHeader(i);}waitForHeader(t){if(!document.querySelector(I.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(t),Cs);return}t.insertIntoMypage(),t.addAutoCommentButtons(),this.observeList(t);}observeList(t){const n=document.querySelector(I.mypageListContainer);if(!n)return;new MutationObserver(()=>{try{t.addAutoCommentButtons();}catch(r){console.error("[MypageController] auto comment buttons update failed",r);}}).observe(n,{childList:true,subtree:true});}}class Es{log;global=ys();watchController=null;mypageController=null;constructor(){this.log=F("DanimeApp");}start(){this.log.info("starting renderer"),Me.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const t=location.pathname.toLowerCase();try{t.includes("/animestore/sc_d_pc")?(this.watchController=new Ss(this.global),await this.watchController.initialize()):t.includes("/animestore/mp_viw_pc")?(this.mypageController=new Ms(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(n){this.log.error("initialization failed",n);}}acquireInstanceLock(){const t=vt();return t.__dAnimeNicoCommentRenderer2Instance=(t.__dAnimeNicoCommentRenderer2Instance??0)+1,t.__dAnimeNicoCommentRenderer2Instance===1}}const ft=F("dAnimeNicoCommentRenderer2");async function Ts(){ft.info("bootstrap start");try{new Es().start(),ft.info("bootstrap completed");}catch(e){ft.error("bootstrap failed",e);}}Ts();

})();