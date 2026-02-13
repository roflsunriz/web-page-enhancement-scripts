// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      7.2.3
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

  const De={debug:"debug",info:"info",warn:"warn",error:"error"},F=t=>{const e=`[${t}]`,n={};return Object.keys(De).forEach(r=>{const i=De[r];n[r]=(...s)=>{(console[i]??console.log)(e,...s);};}),n};function Ee(){return typeof unsafeWindow<"u"?unsafeWindow:window}const Dt={small:.8,medium:1,big:1.4},Ht={defont:'"MS PGothic","Hiragino Kaku Gothic ProN","Hiragino Kaku Gothic Pro","Yu Gothic UI","Yu Gothic","Meiryo","Segoe UI","Osaka","Noto Sans CJK JP","Noto Sans JP","Source Han Sans JP","IPAPGothic","TakaoPGothic","Roboto","Helvetica Neue","Helvetica","Arial","sans-serif"',gothic:'"Noto Sans CJK JP","Noto Sans JP","Source Han Sans JP","Yu Gothic","Yu Gothic Medium","Meiryo","MS PGothic","Hiragino Kaku Gothic ProN","Segoe UI","Helvetica","Arial","sans-serif"',mincho:'"MS PMincho","MS Mincho","Hiragino Mincho ProN","Hiragino Mincho Pro","Yu Mincho","Noto Serif CJK JP","Noto Serif JP","Source Han Serif JP","Times New Roman","serif"'},ct={white:"#FFFFFC",red:"#FF8888",pink:"#FFA5CC",orange:"#FFBA66",yellow:"#FFFFAA",green:"#88FF88",cyan:"#88FFFF",blue:"#8899FF",purple:"#D9A5FF",black:"#444444",white2:"#CC9",red2:"#C03",pink2:"#F3C",orange2:"#F60",yellow2:"#990",green2:"#0C6",cyan2:"#0CC",blue2:"#39F",purple2:"#63C",black2:"#666"},ke=/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,Nt=/^[,.:;]+/,zt=/[,.:;]+$/,Ot=t=>{const e=t.trim();return e?ke.test(e)?e:e.replace(Nt,"").replace(zt,""):""},$t=t=>ke.test(t)?t.toUpperCase():null,dt=t=>{const e=t.trim();if(!e)return null;const n=e.toLowerCase().endsWith("px")?e.slice(0,-2):e,r=Number.parseFloat(n);return Number.isFinite(r)?r:null},Wt=t=>{const e=t.trim();if(!e)return null;if(e.endsWith("%")){const n=Number.parseFloat(e.slice(0,-1));return Number.isFinite(n)?n/100:null}return dt(e)},qt=t=>Number.isFinite(t)?Math.min(100,Math.max(-100,t)):0,Bt=t=>!Number.isFinite(t)||t===0?1:Math.min(5,Math.max(.25,t)),Ut=t=>t==="naka"||t==="ue"||t==="shita",Gt=t=>t==="small"||t==="medium"||t==="big",Kt=t=>t==="defont"||t==="gothic"||t==="mincho",jt=t=>t in ct,Yt=(t,e)=>{let n="naka",r="medium",i="defont",s=null,a=1,o=null,l=false,d=0,h=1;for(const m of t){const y=Ot(typeof m=="string"?m:"");if(!y)continue;if(ke.test(y)){const w=$t(y);if(w){s=w;continue}}const v=y.toLowerCase();if(Ut(v)){n=v;continue}if(Gt(v)){r=v;continue}if(Kt(v)){i=v;continue}if(jt(v)){s=ct[v].toUpperCase();continue}if(v==="_live"){o=.5;continue}if(v==="invisible"){a=0,l=true;continue}if(v.startsWith("ls:")||v.startsWith("letterspacing:")){const w=y.indexOf(":");if(w>=0){const S=dt(y.slice(w+1));S!==null&&(d=qt(S));}continue}if(v.startsWith("lh:")||v.startsWith("lineheight:")){const w=y.indexOf(":");if(w>=0){const S=Wt(y.slice(w+1));S!==null&&(h=Bt(S));}continue}}const c=Math.max(0,Math.min(1,a)),p=(s??e.defaultColor).toUpperCase(),u=typeof o=="number"?Math.max(0,Math.min(1,o)):null;return {layout:n,size:r,sizeScale:Dt[r],font:i,fontFamily:Ht[i],resolvedColor:p,colorOverride:s,opacityMultiplier:c,opacityOverride:u,isInvisible:l,letterSpacing:d,lineHeight:h}},Xt=/^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i,ne=t=>t.length===1?t.repeat(2):t,z=t=>Number.parseInt(t,16),B=t=>!Number.isFinite(t)||t<=0?0:t>=1?1:t,ht=(t,e)=>{const n=Xt.exec(t);if(!n)return t;const r=n[1];let i,s,a,o=1;r.length===3||r.length===4?(i=z(ne(r[0])),s=z(ne(r[1])),a=z(ne(r[2])),r.length===4&&(o=z(ne(r[3]))/255)):(i=z(r.slice(0,2)),s=z(r.slice(2,4)),a=z(r.slice(4,6)),r.length===8&&(o=z(r.slice(6,8))/255));const l=B(o*B(e));return `rgba(${i}, ${s}, ${a}, ${l})`},Jt=()=>({now:()=>typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now()}),pt=()=>Jt(),L=t=>t*1e3,Zt=t=>!Number.isFinite(t)||t<0?null:Math.round(t),Te=4e3,He=1800,Qt=3,en=.25,tn=32,nn=48,le=120,rn=4e3,pe=120,sn=800,an=2,Q=4e3,q=4e3,D=q+Te,on=1e3,Ne=1,ut=12,mt=24,_=.001,$=50,ln=5,cn=2,ze=8,dn=12,Oe={debug:0,info:1,warn:2,error:3},hn=(t,e,n)=>{const r=[`[${e}]`,...n];switch(t){case "debug":console.debug(...r);break;case "info":console.info(...r);break;case "warn":console.warn(...r);break;case "error":console.error(...r);break;default:console.log(...r);}},gt=(t,e={})=>{const{level:n="info",emitter:r=hn}=e,i=Oe[n],s=(a,o)=>{Oe[a]<i||r(a,t,o);};return {debug:(...a)=>s("debug",a),info:(...a)=>s("info",a),warn:(...a)=>s("warn",a),error:(...a)=>s("error",a)}},Ve=gt("CommentEngine:Comment"),$e=new WeakMap,pn=t=>{let e=$e.get(t);return e||(e=new Map,$e.set(t,e)),e},_e=(t,e)=>{if(!t)return 0;const n=`${t.font??""}::${e}`,r=pn(t),i=r.get(n);if(i!==void 0)return i;const s=t.measureText(e).width;return r.set(n,s),s},un=t=>{if(t.includes(`
`)){const e=t.split(/\r?\n/);return e.length>0?e:[""]}return [t]},We=t=>Math.max(24,t),ue=(t,e)=>{let n=0;const r=t.letterSpacing;for(const a of t.lines){const o=_e(e,a),l=a.length>1?r*(a.length-1):0,d=Math.max(0,o+l);d>n&&(n=d);}t.width=n;const i=Math.max(1,Math.floor(t.fontSize*t.lineHeightMultiplier));t.lineHeightPx=i;const s=t.lines.length>1?(t.lines.length-1)*i:0;t.height=t.fontSize+s;},mn=(t,e,n,r,i)=>{try{if(!e)throw new Error("Canvas context is required");if(!Number.isFinite(n)||!Number.isFinite(r))throw new Error("Canvas dimensions must be numbers");if(!i)throw new Error("Prepare options are required");const s=Math.max(n,1),a=We(Math.floor(r*.05)),o=We(Math.floor(a*t.sizeScale));t.fontSize=o,e.font=`${t.fontSize}px ${t.fontFamily}`,t.lines=un(t.text),ue(t,e);const l=!t.isScrolling&&(t.layout==="ue"||t.layout==="shita");if(l){const A=Math.max(1,s-ze*2);if(t.width>A){const N=Math.max(dn,Math.min(t.fontSize,Math.floor(a*.6))),he=A/Math.max(t.width,1),j=Math.max(N,Math.floor(t.fontSize*Math.min(he,1)));j<t.fontSize&&(t.fontSize=j,e.font=`${t.fontSize}px ${t.fontFamily}`,ue(t,e));let Fe=0;for(;t.width>A&&t.fontSize>N&&Fe<5;){const Rt=A/Math.max(t.width,1),Re=Math.max(N,Math.floor(t.fontSize*Math.max(Rt,.7)));Re>=t.fontSize?t.fontSize=Math.max(N,t.fontSize-1):t.fontSize=Re,e.font=`${t.fontSize}px ${t.fontFamily}`,ue(t,e),Fe+=1;}}}if(!t.isScrolling){t.bufferWidth=0;const A=l?ze:0,N=Math.max((s-t.width)/2,A),he=Math.max(A,s-t.width-A),j=Math.min(N,Math.max(he,A));t.virtualStartX=j,t.x=j,t.baseSpeed=0,t.speed=0,t.speedPixelsPerMs=0,t.visibleDurationMs=q,t.preCollisionDurationMs=q,t.totalDurationMs=q,t.reservationWidth=t.width,t.staticExpiryTimeMs=t.vposMs+q,t.lastUpdateTime=t.getTimeSource().now(),t.isPaused=!1;return}t.staticExpiryTimeMs=null;const d=_e(e,"??".repeat(150)),h=t.width*Math.max(i.bufferRatio,0);t.bufferWidth=Math.max(i.baseBufferPx,h);const c=Math.max(i.entryBufferPx,t.bufferWidth),p=t.scrollDirection,u=p==="rtl"?s+i.virtualExtension:-t.width-t.bufferWidth-i.virtualExtension,m=p==="rtl"?-t.width-t.bufferWidth-c:s+c,y=p==="rtl"?s+c:-c,v=p==="rtl"?u+t.width+t.bufferWidth:u-t.bufferWidth;t.virtualStartX=u,t.x=u,t.exitThreshold=m;const w=s>0?t.width/s:0,S=i.maxVisibleDurationMs===i.minVisibleDurationMs;let T=i.maxVisibleDurationMs;if(!S&&w>1){const A=Math.min(w,i.maxWidthRatio),N=i.maxVisibleDurationMs/Math.max(A,1);T=Math.max(i.minVisibleDurationMs,Math.floor(N));}const M=s+t.width+t.bufferWidth+c,It=Math.max(T,1),de=M/It,Pt=de*1e3/60;t.baseSpeed=Pt,t.speed=t.baseSpeed,t.speedPixelsPerMs=de;const At=Math.abs(m-u),Lt=p==="rtl"?Math.max(0,v-y):Math.max(0,y-v),Le=Math.max(de,Number.EPSILON);t.visibleDurationMs=T,t.preCollisionDurationMs=Math.max(0,Math.ceil(Lt/Le)),t.totalDurationMs=Math.max(t.preCollisionDurationMs,Math.ceil(At/Le));const Ft=t.width+t.bufferWidth+c;t.reservationWidth=Math.min(d,Ft),t.lastUpdateTime=t.getTimeSource().now(),t.isPaused=!1;}catch(s){throw Ve.error("Comment.prepare",s,{text:t.text,visibleWidth:n,canvasHeight:r,hasContext:!!e}),s}},ft=5,H={enabled:false,maxLogsPerCategory:ft},oe=new Map,gn=t=>{if(t===void 0||!Number.isFinite(t))return ft;const e=Math.max(1,Math.floor(t));return Math.min(1e4,e)},fn=t=>{H.enabled=!!t.enabled,H.maxLogsPerCategory=gn(t.maxLogsPerCategory),H.enabled||oe.clear();},O=()=>H.enabled,bn=t=>{const e=oe.get(t)??0;return e>=H.maxLogsPerCategory?(e===H.maxLogsPerCategory&&(console.debug(`[CommentOverlay][${t}]`,"Further logs suppressed."),oe.set(t,e+1)),false):(oe.set(t,e+1),true)},k=(t,...e)=>{H.enabled&&bn(t)&&console.debug(`[CommentOverlay][${t}]`,...e);},te=(t,e=32)=>t.length<=e?t:`${t.slice(0,e)}…`,yn=(t,e)=>{H.enabled&&(console.group(`[CommentOverlay][state-dump] ${t}`),console.table({"Current Time":`${e.currentTime.toFixed(2)}ms`,Duration:`${e.duration.toFixed(2)}ms`,"Is Playing":e.isPlaying,"Epoch ID":e.epochId,"Total Comments":e.totalComments,"Active Comments":e.activeComments,"Reserved Lanes":e.reservedLanes,"Final Phase":e.finalPhaseActive,"Playback Begun":e.playbackHasBegun,"Is Stalled":e.isStalled}),console.groupEnd());},vn=(t,e,n)=>{H.enabled&&k("epoch-change",`Epoch changed: ${t} → ${e} (reason: ${n})`);},C={hits:0,misses:0,creates:0,fallbacks:0,outlineCallsInCache:0,fillCallsInCache:0,outlineCallsInFallback:0,fillCallsInFallback:0,letterSpacingComments:0,normalComments:0,multiLineComments:0,totalCharactersDrawn:0,lastReported:0},qe=()=>{if(!O())return;const t=performance.now();if(t-C.lastReported<=5e3)return;const e=C.hits+C.misses,n=e>0?C.hits/e*100:0,r=C.creates>0?(C.totalCharactersDrawn/C.creates).toFixed(1):"0",i=C.outlineCallsInCache+C.outlineCallsInFallback,s=C.fillCallsInCache+C.fillCallsInFallback;console.log("[TextureCache Stats]",`
  Cache: Hits=${C.hits}, Misses=${C.misses}, Hit Rate=${n.toFixed(1)}%`,`
  Creates: ${C.creates}, Fallbacks: ${C.fallbacks}`,`
  Comments: Normal=${C.normalComments}, LetterSpacing=${C.letterSpacingComments}, MultiLine=${C.multiLineComments}`,`
  Draw Calls: Outline=${i}, Fill=${s}`,`
  Avg Characters/Comment: ${r}`),C.lastReported=t;},xn=()=>typeof OffscreenCanvas<"u",bt=(t,e,n)=>{if(t==="none")return {blur:0,alpha:0};const r={light:.06,medium:.1,strong:.15}[t],i={light:.6,medium:.8,strong:.95}[t],s=Math.max(2,e*r),a=B(n*i);return {blur:s,alpha:a}},yt=(t,e,n,r,i)=>(s,a,o,l=0)=>{if(s.length===0)return;const d=i+l,h=()=>{r==="cache"?o==="outline"?C.outlineCallsInCache++:C.fillCallsInCache++:o==="outline"?C.outlineCallsInFallback++:C.fillCallsInFallback++;};if(Math.abs(t.letterSpacing)<Number.EPSILON){h(),e.fillText(s,d,a);return}let c=d;for(let p=0;p<s.length;p+=1){const u=s[p];h(),e.fillText(u,c,a);const m=_e(n,u);c+=m,p<s.length-1&&(c+=t.letterSpacing);}},wn=t=>`v2::${t.text}::${t.fontSize}::${t.fontFamily}::${t.color}::${t.opacity}::${t.renderStyle}::${t.letterSpacing}::${t.lines.length}`,Sn=(t,e)=>{if(!xn())return null;const n=Math.abs(t.letterSpacing)>=Number.EPSILON,r=t.lines.length>1;n&&C.letterSpacingComments++,r&&C.multiLineComments++,!n&&!r&&C.normalComments++,C.totalCharactersDrawn+=t.text.length;const i=Math.max(10,t.fontSize*.5),s=Math.ceil(t.width+i*2),a=Math.ceil(t.height+i*2),o=new OffscreenCanvas(s,a),l=o.getContext("2d");if(!l)return null;l.save(),l.font=`${t.fontSize}px ${t.fontFamily}`;const d=B(t.opacity),h=i,c=t.lines.length>0?t.lines:[t.text],p=t.lines.length>1&&t.lineHeightPx>0?t.lineHeightPx:t.fontSize,u=i+t.fontSize,m=yt(t,l,e,"cache",h),y=ht(t.color,d),v=bt(t.shadowIntensity,t.fontSize,d);return O()&&console.log("[Shadow Debug - Cache]",`
  Text: "${t.text}"`,`
  FontSize: ${t.fontSize}`,`
  Shadow intensity: ${t.shadowIntensity}`,`
  Shadow blur: ${v.blur}px`,`
  Shadow alpha: ${v.alpha}`,`
  Fill style: ${y}`),l.save(),l.shadowColor=`rgba(0, 0, 0, ${v.alpha})`,l.shadowBlur=v.blur,l.shadowOffsetX=0,l.shadowOffsetY=0,l.fillStyle=y,c.forEach((w,S)=>{const T=u+S*p;m(w,T,"fill");}),l.restore(),l.restore(),o},Cn=(t,e,n)=>{C.fallbacks++,e.save(),e.font=`${t.fontSize}px ${t.fontFamily}`;const r=B(t.opacity),i=n??t.x,s=t.lines.length>0?t.lines:[t.text],a=t.lines.length>1&&t.lineHeightPx>0?t.lineHeightPx:t.fontSize,o=t.y+t.fontSize,l=yt(t,e,e,"fallback",i),d=ht(t.color,r),h=bt(t.shadowIntensity,t.fontSize,r);O()&&console.log("[Shadow Debug - Fallback]",`
  Text: "${t.text}"`,`
  FontSize: ${t.fontSize}`,`
  Shadow intensity: ${t.shadowIntensity}`,`
  Shadow blur: ${h.blur}px`,`
  Shadow alpha: ${h.alpha}`,`
  Fill style: ${d}`),e.save(),e.shadowColor=`rgba(0, 0, 0, ${h.alpha})`,e.shadowBlur=h.blur,e.shadowOffsetX=0,e.shadowOffsetY=0,e.fillStyle=d,s.forEach((c,p)=>{const u=o+p*a;l(c,u,"fill");}),e.restore(),e.restore();},Mn=(t,e,n)=>{try{if(!t.isActive||!e)return;const r=wn(t),i=t.getCachedTexture();if(t.getTextureCacheKey()!==r||!i){C.misses++,C.creates++;const a=Sn(t,e);t.setCachedTexture(a),t.setTextureCacheKey(r);}else C.hits++;const s=t.getCachedTexture();if(s){const a=n??t.x,o=Math.max(10,t.fontSize*.5);e.drawImage(s,a-o,t.y-o),qe();return}Cn(t,e,n),qe();}catch(r){Ve.error("Comment.draw",r,{text:t.text,isActive:t.isActive,hasContext:!!e,interpolatedX:n});}},En=t=>t==="ltr"?"ltr":"rtl",kn=t=>t==="ltr"?1:-1;class vt{text;vposMs;commands;layout;isScrolling;sizeScale;opacityMultiplier;opacityOverride;colorOverride;isInvisible;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily;opacity;activationTimeMs=null;staticExpiryTimeMs=null;isActive=false;hasShown=false;isPaused=false;lastUpdateTime=0;reservationWidth=0;bufferWidth=0;visibleDurationMs=0;totalDurationMs=0;preCollisionDurationMs=0;speedPixelsPerMs=0;virtualStartX=0;exitThreshold=0;scrollDirection="rtl";renderStyle="outline-only";shadowIntensity="medium";creationIndex=0;letterSpacing=0;lineHeightMultiplier=1;lineHeightPx=0;lines=[];epochId=0;directionSign=-1;timeSource;lastSyncedSettingsVersion=-1;cachedTexture=null;textureCacheKey="";constructor(e,n,r,i,s={}){if(typeof e!="string")throw new Error("Comment text must be a string");if(!Number.isFinite(n)||n<0)throw new Error("Comment vposMs must be a non-negative number");this.text=e,this.vposMs=n,this.commands=Array.isArray(r)?[...r]:[];const a=Yt(this.commands,{defaultColor:i.commentColor});this.layout=a.layout,this.isScrolling=this.layout==="naka",this.sizeScale=a.sizeScale,this.opacityMultiplier=a.opacityMultiplier,this.opacityOverride=a.opacityOverride,this.colorOverride=a.colorOverride,this.isInvisible=a.isInvisible,this.fontFamily=a.fontFamily,this.color=a.resolvedColor,this.opacity=this.getEffectiveOpacity(i.commentOpacity),this.renderStyle=i.renderStyle,this.shadowIntensity=i.shadowIntensity,this.letterSpacing=a.letterSpacing,this.lineHeightMultiplier=a.lineHeight,this.timeSource=s.timeSource??pt(),this.applyScrollDirection(i.scrollDirection),this.syncWithSettings(i,s.settingsVersion);}prepare(e,n,r,i){mn(this,e,n,r,i);}draw(e,n=null){Mn(this,e,n);}update(e=1,n=false){try{if(!this.isActive){this.isPaused=n;return}const r=this.timeSource.now();if(!this.isScrolling){this.isPaused=n,this.lastUpdateTime=r;return}if(n){this.isPaused=!0,this.lastUpdateTime=r;return}const i=(r-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*e,this.x+=this.speed*i*this.directionSign,(this.scrollDirection==="rtl"&&this.x<=this.exitThreshold||this.scrollDirection==="ltr"&&this.x>=this.exitThreshold)&&(this.isActive=!1),this.lastUpdateTime=r,this.isPaused=!1;}catch(r){Ve.error("Comment.update",r,{text:this.text,playbackRate:e,isPaused:n,isActive:this.isActive});}}syncWithSettings(e,n){typeof n=="number"&&n===this.lastSyncedSettingsVersion||(this.color=this.getEffectiveColor(e.commentColor),this.opacity=this.getEffectiveOpacity(e.commentOpacity),this.applyScrollDirection(e.scrollDirection),this.renderStyle=e.renderStyle,this.shadowIntensity=e.shadowIntensity,typeof n=="number"&&(this.lastSyncedSettingsVersion=n));}getEffectiveColor(e){const n=this.colorOverride??e;return typeof n!="string"||n.length===0?e:n.toUpperCase()}getEffectiveOpacity(e){if(typeof this.opacityOverride=="number")return B(this.opacityOverride);const n=e*this.opacityMultiplier;return Number.isFinite(n)?B(n):0}markActivated(e){this.activationTimeMs=e;}clearActivation(){this.activationTimeMs=null,this.isScrolling||(this.staticExpiryTimeMs=null),this.resetTextureCache();}hasStaticExpired(e){return this.isScrolling||this.staticExpiryTimeMs===null?false:e>=this.staticExpiryTimeMs}getDirectionSign(){return this.directionSign}getTimeSource(){return this.timeSource}getTextureCacheKey(){return this.textureCacheKey}setTextureCacheKey(e){this.textureCacheKey=e;}getCachedTexture(){return this.cachedTexture}setCachedTexture(e){this.cachedTexture=e;}resetTextureCache(){this.cachedTexture=null,this.textureCacheKey="";}applyScrollDirection(e){const n=En(e);this.scrollDirection=n,this.directionSign=kn(n);}}const Tn=4e3,me={commentColor:"#FFFFFF",commentOpacity:1,isCommentVisible:true,useContainerResizeObserver:true,ngWords:[],ngRegexps:[],scrollDirection:"rtl",renderStyle:"outline-only",syncMode:"raf",scrollVisibleDurationMs:Tn,useFixedLaneCount:false,fixedLaneCount:12,useDprScaling:true,shadowIntensity:"medium"},xt=()=>({...me,ngWords:[...me.ngWords],ngRegexps:[...me.ngRegexps]}),Vn=t=>Number.isFinite(t)?t<=0?0:t>=1?1:t:1,wt=(t,e=0)=>e===0?ln:cn,re=t=>{const e=t.scrollVisibleDurationMs,n=e==null?null:Number.isFinite(e)?Math.max(1,Math.floor(e)):null;return {...t,scrollDirection:t.scrollDirection==="ltr"?"ltr":"rtl",commentOpacity:Vn(t.commentOpacity),renderStyle:t.renderStyle==="classic"?"classic":"outline-only",scrollVisibleDurationMs:n,syncMode:t.syncMode==="video-frame"?"video-frame":"raf",useDprScaling:!!t.useDprScaling}},_n=t=>typeof window<"u"&&typeof window.requestAnimationFrame=="function"&&typeof window.cancelAnimationFrame=="function"?{request:e=>window.requestAnimationFrame(e),cancel:e=>window.cancelAnimationFrame(e)}:{request:e=>globalThis.setTimeout(()=>{e(t.now());},16),cancel:e=>{globalThis.clearTimeout(e);}},In=()=>typeof document>"u"?()=>{throw new Error("Document is not available. Provide a custom createCanvasElement implementation.")}:()=>document.createElement("canvas"),Pn=t=>{if(!t||typeof t!="object")return  false;const e=t;return typeof e.commentColor=="string"&&typeof e.commentOpacity=="number"&&typeof e.isCommentVisible=="boolean"},An=function(t){if(!Array.isArray(t)||t.length===0)return [];const e=[];this.commentDependencies.settingsVersion=this.settingsVersion;for(const n of t){const{text:r,vposMs:i,commands:s=[]}=n,a=te(r);if(this.isNGComment(r)){k("comment-skip-ng",{preview:a,vposMs:i});continue}const o=Zt(i);if(o===null){this.log.warn("CommentRenderer.addComment.invalidVpos",{text:r,vposMs:i}),k("comment-skip-invalid-vpos",{preview:a,vposMs:i});continue}if(this.comments.some(d=>d.text===r&&d.vposMs===o)||e.some(d=>d.text===r&&d.vposMs===o)){k("comment-skip-duplicate",{preview:a,vposMs:o});continue}const l=new vt(r,o,s,this._settings,this.commentDependencies);l.creationIndex=this.commentSequence++,l.epochId=this.epochId,e.push(l),k("comment-added",{preview:a,vposMs:o,commands:l.commands.length,layout:l.layout,isScrolling:l.isScrolling,invisible:l.isInvisible});}return e.length===0?[]:(this.comments.push(...e),this.finalPhaseActive&&(this.finalPhaseScheduleDirty=true),this.comments.sort((n,r)=>{const i=n.vposMs-r.vposMs;return Math.abs(i)>_?i:n.creationIndex-r.creationIndex}),e)},Ln=function(t,e,n=[]){const[r]=this.addComments([{text:t,vposMs:e,commands:n}]);return r??null},Fn=function(){if(this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.commentSequence=0,this.ctx&&this.canvas){const t=this.canvasDpr>0?this.canvasDpr:1,e=this.displayWidth>0?this.displayWidth:this.canvas.width/t,n=this.displayHeight>0?this.displayHeight:this.canvas.height/t;this.ctx.clearRect(0,0,e,n);}},Rn=function(){this.clearComments(),this.currentTime=0,this.resetFinalPhaseState(),this.playbackHasBegun=false,this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false;},St=function(){const t=this._settings,e=Array.isArray(t.ngWords)?t.ngWords:[];this.normalizedNgWords=e.filter(r=>typeof r=="string");const n=Array.isArray(t.ngRegexps)?t.ngRegexps:[];this.compiledNgRegexps=n.map(r=>{if(typeof r!="string")return null;try{return new RegExp(r,"i")}catch(i){return this.log.warn("CommentRenderer.invalidNgRegexp",i,{entry:r}),null}}).filter(r=>!!r);},Dn=function(t){return typeof t!="string"||t.length===0?false:this.normalizedNgWords.some(e=>e.length>0&&t.includes(e))?true:this.compiledNgRegexps.some(e=>e.test(t))},Hn=t=>{t.prototype.addComments=An,t.prototype.addComment=Ln,t.prototype.clearComments=Fn,t.prototype.resetState=Rn,t.prototype.rebuildNgMatchers=St,t.prototype.isNGComment=Dn;},Nn=function(){this.finalPhaseActive=false,this.finalPhaseStartTime=null,this.finalPhaseScheduleDirty=false,this.finalPhaseVposOverrides.clear();},zn=function(t){const e=this.epochId;if(this.epochId+=1,vn(e,this.epochId,t),this.eventHooks.onEpochChange){const n={previousEpochId:e,newEpochId:this.epochId,reason:t,timestamp:this.timeSource.now()};try{this.eventHooks.onEpochChange(n);}catch(r){this.log.error("CommentRenderer.incrementEpoch.callback",r,{info:n});}}this.comments.forEach(n=>{n.epochId=this.epochId;});},On=function(t){const e=this.timeSource.now();if(e-this.lastSnapshotEmitTime<this.snapshotEmitThrottleMs)return;const n={currentTime:this.currentTime,duration:this.duration,isPlaying:this.isPlaying,epochId:this.epochId,totalComments:this.comments.length,activeComments:this.activeComments.size,reservedLanes:this.reservedLanes.size,finalPhaseActive:this.finalPhaseActive,playbackHasBegun:this.playbackHasBegun,isStalled:this.isStalled};if(yn(t,n),this.eventHooks.onStateSnapshot)try{this.eventHooks.onStateSnapshot(n);}catch(r){this.log.error("CommentRenderer.emitStateSnapshot.callback",r);}this.lastSnapshotEmitTime=e;},$n=function(t){return this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline(),this.finalPhaseVposOverrides.get(t)??t.vposMs},Wn=function(t){if(!t.isScrolling)return q;const e=[];return Number.isFinite(t.visibleDurationMs)&&t.visibleDurationMs>0&&e.push(t.visibleDurationMs),Number.isFinite(t.totalDurationMs)&&t.totalDurationMs>0&&e.push(t.totalDurationMs),e.length>0?Math.max(...e):Te},qn=function(t){if(!this.finalPhaseActive||this.finalPhaseStartTime===null)return this.finalPhaseVposOverrides.delete(t),t.vposMs;this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline();const e=this.finalPhaseVposOverrides.get(t);if(e!==void 0)return e;const n=Math.max(t.vposMs,this.finalPhaseStartTime);return this.finalPhaseVposOverrides.set(t,n),n},Bn=function(){if(!this.finalPhaseActive||this.finalPhaseStartTime===null){this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=false;return}const t=this.finalPhaseStartTime,e=this.duration>0?this.duration:t+Q,n=Math.max(t+Q,e),r=this.comments.filter(l=>l.hasShown||l.isInvisible||this.isNGComment(l.text)?false:l.vposMs>=t-D).sort((l,d)=>{const h=l.vposMs-d.vposMs;return Math.abs(h)>_?h:l.creationIndex-d.creationIndex});if(this.finalPhaseVposOverrides.clear(),r.length===0){this.finalPhaseScheduleDirty=false;return}const i=Math.max(n-t,Q)/Math.max(r.length,1),s=Number.isFinite(i)?i:pe,a=Math.max(pe,Math.min(s,sn));let o=t;r.forEach((l,d)=>{const h=Math.max(1,this.getFinalPhaseDisplayDuration(l)),c=n-h;let p=Math.max(t,Math.min(o,c));Number.isFinite(p)||(p=t);const u=an*d;p+u<=c&&(p+=u),this.finalPhaseVposOverrides.set(l,p);const m=Math.max(pe,Math.min(h/2,a));o=p+m;}),this.finalPhaseScheduleDirty=false;},Un=t=>{t.prototype.resetFinalPhaseState=Nn,t.prototype.incrementEpoch=zn,t.prototype.emitStateSnapshot=On,t.prototype.getEffectiveCommentVpos=$n,t.prototype.getFinalPhaseDisplayDuration=Wn,t.prototype.resolveFinalPhaseVpos=qn,t.prototype.recomputeFinalPhaseTimeline=Bn;},Gn=function(){return !this.playbackHasBegun&&!this.isPlaying&&this.currentTime<=$},Kn=function(){this.playbackHasBegun||(this.isPlaying||this.currentTime>$)&&(this.playbackHasBegun=true);},jn=t=>{t.prototype.shouldSuppressRendering=Gn,t.prototype.updatePlaybackProgressState=Kn;},Yn=function(t){const e=this.videoElement,n=this.canvas,r=this.ctx;if(!e||!n||!r)return;const i=typeof t=="number"?t:L(e.currentTime);if(this.currentTime=i,this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.updatePlaybackProgressState(),this.skipDrawingForCurrentFrame=this.shouldSuppressRendering(),this.skipDrawingForCurrentFrame)return;const s=this.canvasDpr>0?this.canvasDpr:1,a=this.displayWidth>0?this.displayWidth:n.width/s,o=this.displayHeight>0?this.displayHeight:n.height/s,l=this.buildPrepareOptions(a),d=this.duration>0&&this.duration-this.currentTime<=rn;d&&!this.finalPhaseActive&&(this.finalPhaseActive=true,this.finalPhaseStartTime=this.currentTime,this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=true,r.clearRect(0,0,a,o),this.comments.forEach(c=>{c.isActive=false,c.clearActivation();}),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0),!d&&this.finalPhaseActive&&this.resetFinalPhaseState(),this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline(),this.pruneStaticLaneReservations(this.currentTime);for(const c of Array.from(this.activeComments)){const p=this.getEffectiveCommentVpos(c),u=p<this.currentTime-D,m=p>this.currentTime+D;if(u||m){c.isActive=false,this.activeComments.delete(c),c.clearActivation(),c.lane>=0&&(c.layout==="ue"?this.releaseStaticLane("ue",c.lane):c.layout==="shita"&&this.releaseStaticLane("shita",c.lane));continue}c.isScrolling&&c.hasShown&&(c.scrollDirection==="rtl"&&c.x<=c.exitThreshold||c.scrollDirection==="ltr"&&c.x>=c.exitThreshold)&&(c.isActive=false,this.activeComments.delete(c),c.clearActivation());}const h=this.getCommentsInTimeWindow(this.currentTime,D);for(const c of h){const p=O(),u=p?te(c.text):"";if(p&&k("comment-evaluate",{stage:"update",preview:u,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),currentTime:this.currentTime,isActive:c.isActive,hasShown:c.hasShown}),this.isNGComment(c.text)){p&&k("comment-eval-skip",{preview:u,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"ng-runtime"});continue}if(c.isInvisible){p&&k("comment-eval-skip",{preview:u,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"invisible"}),c.isActive=false,this.activeComments.delete(c),c.hasShown=true,c.clearActivation();continue}if(c.syncWithSettings(this._settings,this.settingsVersion),this.shouldActivateCommentAtTime(c,this.currentTime,u)&&this.activateComment(c,r,a,o,l,this.currentTime),c.isActive){if(c.layout!=="naka"&&c.hasStaticExpired(this.currentTime)){const m=c.layout==="ue"?"ue":"shita";this.releaseStaticLane(m,c.lane),c.isActive=false,this.activeComments.delete(c),c.clearActivation();continue}if(c.layout==="naka"&&this.getEffectiveCommentVpos(c)>this.currentTime+$){c.x=c.virtualStartX,c.lastUpdateTime=this.timeSource.now();continue}if(c.hasShown=true,c.update(this.playbackRate,!this.isPlaying),!c.isScrolling&&c.hasStaticExpired(this.currentTime)){const m=c.layout==="ue"?"ue":"shita";this.releaseStaticLane(m,c.lane),c.isActive=false,this.activeComments.delete(c),c.clearActivation();}}}},Xn=function(t){const e=this._settings.scrollVisibleDurationMs;let n=Te,r=He;return e!==null&&(n=e,r=Math.max(1,Math.min(e,He))),{visibleWidth:t,virtualExtension:on,maxVisibleDurationMs:n,minVisibleDurationMs:r,maxWidthRatio:Qt,bufferRatio:en,baseBufferPx:tn,entryBufferPx:nn}},Jn=function(t){const e=this.currentTime;this.pruneLaneReservations(e),this.pruneStaticLaneReservations(e);const n=this.getLanePriorityOrder(e),r=this.createLaneReservation(t,e);for(const s of n)if(this.isLaneAvailable(s,r,e))return this.storeLaneReservation(s,r),s;const i=n[0]??0;return this.storeLaneReservation(i,r),i},Zn=t=>{t.prototype.updateComments=Yn,t.prototype.buildPrepareOptions=Xn,t.prototype.findAvailableLane=Jn;},Qn=function(t,e){let n=0,r=t.length;for(;n<r;){const i=Math.floor((n+r)/2),s=t[i];s!==void 0&&s.totalEndTime+le<=e?n=i+1:r=i;}return n},er=function(t){for(const[e,n]of this.reservedLanes.entries()){const r=this.findFirstValidReservationIndex(n,t);r>=n.length?this.reservedLanes.delete(e):r>0&&this.reservedLanes.set(e,n.slice(r));}},tr=function(t){const e=i=>i.filter(s=>s.releaseTime>t),n=e(this.topStaticLaneReservations),r=e(this.bottomStaticLaneReservations);this.topStaticLaneReservations.length=0,this.topStaticLaneReservations.push(...n),this.bottomStaticLaneReservations.length=0,this.bottomStaticLaneReservations.push(...r);},nr=t=>{t.prototype.findFirstValidReservationIndex=Qn,t.prototype.pruneLaneReservations=er,t.prototype.pruneStaticLaneReservations=tr;},rr=function(t){let e=0,n=this.comments.length;for(;e<n;){const r=Math.floor((e+n)/2),i=this.comments[r];i!==void 0&&i.vposMs<t?e=r+1:n=r;}return e},ir=function(t,e){if(this.comments.length===0)return [];const n=t-e,r=t+e,i=this.findCommentIndexAtOrAfter(n),s=[];for(let a=i;a<this.comments.length;a++){const o=this.comments[a];if(o){if(o.vposMs>r)break;s.push(o);}}return s},sr=function(t){return t==="ue"?this.topStaticLaneReservations:this.bottomStaticLaneReservations},ar=function(t){return t==="ue"?this.topStaticLaneReservations.length:this.bottomStaticLaneReservations.length},or=function(t){const e=t==="ue"?"shita":"ue",n=this.getStaticLaneDepth(e),r=this.laneCount-n;return r<=0?-1:r-1},lr=function(t){return Math.max(0,this.laneCount-1-t)},cr=function(t,e,n,r){const i=Math.max(1,n),s=Math.max(r.height,r.fontSize),a=5,o=2;if(t==="ue"){let c=a;const p=this.getStaticReservations(t).filter(m=>m.lane<e).sort((m,y)=>m.lane-y.lane);for(const m of p){const y=m.yEnd-m.yStart;c+=y+o;}const u=Math.max(a,i-s-a);return Math.max(a,Math.min(c,u))}let l=i-a;const d=this.getStaticReservations(t).filter(c=>c.lane<e).sort((c,p)=>c.lane-p.lane);for(const c of d){const p=c.yEnd-c.yStart;l-=p+o;}const h=l-s;return Math.max(a,h)},dr=function(){const t=new Set;for(const e of this.topStaticLaneReservations)t.add(e.lane);for(const e of this.bottomStaticLaneReservations)t.add(this.getGlobalLaneIndexForBottom(e.lane));return t},hr=t=>{t.prototype.findCommentIndexAtOrAfter=rr,t.prototype.getCommentsInTimeWindow=ir,t.prototype.getStaticReservations=sr,t.prototype.getStaticLaneDepth=ar,t.prototype.getStaticLaneLimit=or,t.prototype.getGlobalLaneIndexForBottom=lr,t.prototype.resolveStaticCommentOffset=cr,t.prototype.getStaticReservedLaneSet=dr;},pr=function(t,e,n=""){const r=n.length>0&&O(),i=this.resolveFinalPhaseVpos(t);return this.finalPhaseActive&&this.finalPhaseStartTime!==null&&t.vposMs<this.finalPhaseStartTime-_?(r&&k("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"final-phase-trimmed",finalPhaseStartTime:this.finalPhaseStartTime}),this.finalPhaseVposOverrides.delete(t),false):t.isInvisible?(r&&k("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"invisible"}),false):t.isActive?(r&&k("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"already-active"}),false):t.hasShown&&i<=e?(r&&k("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"already-shown",currentTime:e}),false):i>e+$?(r&&k("comment-eval-pending",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"future",currentTime:e}),false):i<e-D?(r&&k("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"expired-window",currentTime:e}),false):(r&&k("comment-eval-ready",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,currentTime:e}),true)},ur=function(t,e,n,r,i,s){t.prepare(e,n,r,i);const a=this.resolveFinalPhaseVpos(t);if(O()&&k("comment-prepared",{preview:te(t.text),layout:t.layout,isScrolling:t.isScrolling,width:t.width,height:t.height,bufferWidth:t.bufferWidth,visibleDurationMs:t.visibleDurationMs,effectiveVposMs:a}),t.layout==="naka"){const o=Math.max(0,s-a),l=t.speedPixelsPerMs*o;if(this.finalPhaseActive&&this.finalPhaseStartTime!==null){const u=this.duration>0?this.duration:this.finalPhaseStartTime+Q,m=Math.max(this.finalPhaseStartTime+Q,u),y=t.width+n,v=y>0?y/Math.max(t.speedPixelsPerMs,1):0;if(a+v>m){const w=m-s,S=Math.max(0,w)*t.speedPixelsPerMs,T=t.scrollDirection==="rtl"?Math.max(t.virtualStartX-l,n-S):Math.min(t.virtualStartX+l,S-t.width);t.x=T;}else t.x=t.scrollDirection==="rtl"?t.virtualStartX-l:t.virtualStartX+l;}else t.x=t.scrollDirection==="rtl"?t.virtualStartX-l:t.virtualStartX+l;const d=this.findAvailableLane(t);t.lane=d;const h=Math.max(1,this.laneHeight),c=Math.max(0,r-t.height),p=d*h;t.y=Math.max(0,Math.min(p,c));}else {const o=t.layout==="ue"?"ue":"shita",l=this.assignStaticLane(o,t,r,s),d=this.resolveStaticCommentOffset(o,l,r,t);t.x=Math.max(0,Math.min(n-t.width,t.virtualStartX)),t.y=d,t.lane=o==="ue"?l:this.getGlobalLaneIndexForBottom(l),t.speed=0,t.baseSpeed=0,t.speedPixelsPerMs=0,t.visibleDurationMs=q;const h=s+t.visibleDurationMs;this.activeComments.add(t),t.isActive=true,t.hasShown=true,t.isPaused=!this.isPlaying,t.markActivated(s),t.lastUpdateTime=this.timeSource.now(),t.staticExpiryTimeMs=h,this.reserveStaticLane(o,t,l,h),O()&&k("comment-activate-static",{preview:te(t.text),lane:t.lane,position:o,displayEnd:h,effectiveVposMs:a});return}this.activeComments.add(t),t.isActive=true,t.hasShown=true,t.isPaused=!this.isPlaying,t.markActivated(s),t.lastUpdateTime=this.timeSource.now();},mr=function(t,e,n,r){const i=this.getStaticReservations(t),s=this.getStaticLaneLimit(t),a=s>=0?s+1:0,o=Array.from({length:a},(h,c)=>c);for(const h of o){const c=this.resolveStaticCommentOffset(t,h,n,e),p=Math.max(e.height,e.fontSize),u=wt(e.fontSize,h),m=c-u,y=c+p+u;if(!i.some(v=>v.releaseTime>r?!(y<=v.yStart||m>=v.yEnd):false))return h}let l=o[0]??0,d=Number.POSITIVE_INFINITY;for(const h of i)h.releaseTime<d&&(d=h.releaseTime,l=h.lane);return l},gr=function(t,e,n,r){const i=this.getStaticReservations(t),s=Math.max(e.height,e.fontSize),a=wt(e.fontSize,n),o=e.y-a,l=e.y+s+a;i.push({comment:e,releaseTime:r,yStart:o,yEnd:l,lane:n});},fr=function(t,e){if(e<0)return;const n=this.getStaticReservations(t),r=n.findIndex(i=>i.lane===e);r>=0&&n.splice(r,1);},br=t=>{t.prototype.shouldActivateCommentAtTime=pr,t.prototype.activateComment=ur,t.prototype.assignStaticLane=mr,t.prototype.reserveStaticLane=gr,t.prototype.releaseStaticLane=fr;},yr=function(t){const e=Array.from({length:this.laneCount},(s,a)=>a).sort((s,a)=>{const o=this.getLaneNextAvailableTime(s,t),l=this.getLaneNextAvailableTime(a,t);return Math.abs(o-l)<=_?s-a:o-l}),n=this.getStaticReservedLaneSet();if(n.size===0)return e;const r=e.filter(s=>!n.has(s));if(r.length===0)return e;const i=e.filter(s=>n.has(s));return [...r,...i]},vr=function(t,e){const n=this.reservedLanes.get(t);if(!n||n.length===0)return e;const r=this.findFirstValidReservationIndex(n,e),i=n[r];return i?Math.max(e,i.endTime+le):e},xr=function(t,e){const n=Math.max(t.speedPixelsPerMs,_),r=this.getEffectiveCommentVpos(t),i=Number.isFinite(r)?r:e,s=Math.max(0,i),a=s+t.preCollisionDurationMs+le,o=s+t.totalDurationMs+le;return {comment:t,startTime:s,endTime:Math.max(s,a),totalEndTime:Math.max(s,o),startLeft:t.virtualStartX,width:t.width,speed:n,buffer:t.bufferWidth,directionSign:t.getDirectionSign()}},wr=function(t,e,n){const r=this.reservedLanes.get(t);if(!r||r.length===0)return  true;const i=this.findFirstValidReservationIndex(r,n);for(let s=i;s<r.length;s+=1){const a=r[s];if(a&&this.areReservationsConflicting(a,e))return  false}return  true},Sr=function(t,e){const n=[...this.reservedLanes.get(t)??[],e].sort((r,i)=>r.totalEndTime-i.totalEndTime);this.reservedLanes.set(t,n);},Cr=function(t,e){const n=Math.max(t.startTime,e.startTime),r=Math.min(t.endTime,e.endTime);if(n>=r)return  false;const i=new Set([n,r,n+(r-n)/2]),s=this.solveLeftRightEqualityTime(t,e);s!==null&&s>=n-_&&s<=r+_&&i.add(s);const a=this.solveLeftRightEqualityTime(e,t);a!==null&&a>=n-_&&a<=r+_&&i.add(a);for(const o of i){if(o<n-_||o>r+_)continue;const l=this.computeForwardGap(t,e,o),d=this.computeForwardGap(e,t,o);if(l<=_&&d<=_)return  true}return  false},Mr=function(t,e,n){const r=this.getBufferedEdges(t,n),i=this.getBufferedEdges(e,n);return r.left-i.right},Er=function(t,e){const n=Math.max(0,e-t.startTime),r=t.speed*n,i=t.startLeft+t.directionSign*r,s=i-t.buffer,a=i+t.width+t.buffer;return {left:s,right:a}},kr=function(t,e){const n=t.directionSign,r=e.directionSign,i=r*e.speed-n*t.speed;if(Math.abs(i)<_)return null;const s=(e.startLeft+r*e.speed*e.startTime+e.width+e.buffer-t.startLeft-n*t.speed*t.startTime+t.buffer)/i;return Number.isFinite(s)?s:null},Tr=t=>{t.prototype.getLanePriorityOrder=yr,t.prototype.getLaneNextAvailableTime=vr,t.prototype.createLaneReservation=xr,t.prototype.isLaneAvailable=wr,t.prototype.storeLaneReservation=Sr,t.prototype.areReservationsConflicting=Cr,t.prototype.computeForwardGap=Mr,t.prototype.getBufferedEdges=Er,t.prototype.solveLeftRightEqualityTime=kr;},Vr=function(){const t=this.canvas,e=this.ctx;if(!t||!e)return;const n=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/n,i=this.displayHeight>0?this.displayHeight:t.height/n,s=this.timeSource.now();if(this.skipDrawingForCurrentFrame||this.shouldSuppressRendering()||this.isStalled){e.clearRect(0,0,r,i),this.lastDrawTime=s;return}e.clearRect(0,0,r,i);const a=Array.from(this.activeComments);if(this._settings.isCommentVisible){const o=(s-this.lastDrawTime)/16.666666666666668;a.sort((l,d)=>{const h=this.getEffectiveCommentVpos(l),c=this.getEffectiveCommentVpos(d),p=h-c;return Math.abs(p)>_?p:l.isScrolling!==d.isScrolling?l.isScrolling?1:-1:l.creationIndex-d.creationIndex}),a.forEach(l=>{const d=this.isPlaying&&!l.isPaused?l.x+l.getDirectionSign()*l.speed*o:l.x;l.draw(e,d);});}this.lastDrawTime=s;},_r=function(t){const e=this.videoElement,n=this.canvas,r=this.ctx;if(!e||!n||!r)return;const i=typeof t=="number"?t:L(e.currentTime);this.currentTime=i,this.lastDrawTime=this.timeSource.now();const s=this.canvasDpr>0?this.canvasDpr:1,a=this.displayWidth>0?this.displayWidth:n.width/s,o=this.displayHeight>0?this.displayHeight:n.height/s,l=this.buildPrepareOptions(a);this.getCommentsInTimeWindow(this.currentTime,D).forEach(d=>{if(this.isNGComment(d.text)||d.isInvisible){d.isActive=false,this.activeComments.delete(d),d.clearActivation();return}if(d.syncWithSettings(this._settings,this.settingsVersion),d.isActive=false,this.activeComments.delete(d),d.lane=-1,d.clearActivation(),this.shouldActivateCommentAtTime(d,this.currentTime)){this.activateComment(d,r,a,o,l,this.currentTime);return}this.getEffectiveCommentVpos(d)<this.currentTime-D?d.hasShown=true:d.hasShown=false;});},Ir=t=>{t.prototype.draw=Vr,t.prototype.performInitialSync=_r;},Pr=function(t){this.videoElement&&this._settings.isCommentVisible&&(this.pendingInitialSync&&(this.performInitialSync(t),this.pendingInitialSync=false),this.updateComments(t),this.draw());},Ar=function(){const t=this.frameId;this.frameId=null,t!==null&&this.animationFrameProvider.cancel(t),this.processFrame(),this.scheduleNextFrame();},Lr=function(t,e){this.videoFrameHandle=null;const n=typeof e?.mediaTime=="number"?e.mediaTime*1e3:void 0;this.processFrame(typeof n=="number"?n:void 0),this.scheduleNextFrame();},Fr=function(){if(this._settings.syncMode!=="video-frame")return  false;const t=this.videoElement;return !!t&&typeof t.requestVideoFrameCallback=="function"&&typeof t.cancelVideoFrameCallback=="function"},Rr=function(){const t=this.videoElement;if(t){if(this.shouldUseVideoFrameCallback()){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();const e=t.requestVideoFrameCallback;typeof e=="function"&&(this.videoFrameHandle=e.call(t,this.handleVideoFrame));return}this.cancelVideoFrameCallback(),this.frameId=this.animationFrameProvider.request(this.handleAnimationFrame);}},Dr=function(){this.frameId!==null&&(this.animationFrameProvider.cancel(this.frameId),this.frameId=null);},Hr=function(){if(this.videoFrameHandle===null)return;const t=this.videoElement;t&&typeof t.cancelVideoFrameCallback=="function"&&t.cancelVideoFrameCallback(this.videoFrameHandle),this.videoFrameHandle=null;},Nr=function(){this.stopAnimation(),this.scheduleNextFrame();},zr=function(){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();},Or=function(){const t=this.canvas,e=this.ctx,n=this.videoElement;if(!t||!e||!n)return;const r=L(n.currentTime),i=Math.abs(r-this.currentTime),s=this.timeSource.now();if(s-this.lastPlayResumeTime<this.playResumeSeekIgnoreDurationMs){this.currentTime=r,this._settings.isCommentVisible&&(this.lastDrawTime=s,this.draw());return}const a=i>$;if(this.currentTime=r,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),!a){this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());return}this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;const o=this.canvasDpr>0?this.canvasDpr:1,l=this.displayWidth>0?this.displayWidth:t.width/o,d=this.displayHeight>0?this.displayHeight:t.height/o,h=this.buildPrepareOptions(l);this.getCommentsInTimeWindow(this.currentTime,D).forEach(c=>{const p=O(),u=p?te(c.text):"";if(p&&k("comment-evaluate",{stage:"seek",preview:u,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),currentTime:this.currentTime,isActive:c.isActive,hasShown:c.hasShown}),this.isNGComment(c.text)){p&&k("comment-eval-skip",{preview:u,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"ng-runtime"}),c.isActive=false,this.activeComments.delete(c),c.clearActivation();return}if(c.isInvisible){p&&k("comment-eval-skip",{preview:u,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"invisible"}),c.isActive=false,this.activeComments.delete(c),c.hasShown=true,c.clearActivation();return}if(c.syncWithSettings(this._settings,this.settingsVersion),c.isActive=false,this.activeComments.delete(c),c.lane=-1,c.clearActivation(),this.shouldActivateCommentAtTime(c,this.currentTime,u)){this.activateComment(c,e,l,d,h,this.currentTime);return}this.getEffectiveCommentVpos(c)<this.currentTime-D?c.hasShown=true:c.hasShown=false;}),this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());},$r=t=>{t.prototype.processFrame=Pr,t.prototype.handleAnimationFrame=Ar,t.prototype.handleVideoFrame=Lr,t.prototype.shouldUseVideoFrameCallback=Fr,t.prototype.scheduleNextFrame=Rr,t.prototype.cancelAnimationFrameRequest=Dr,t.prototype.cancelVideoFrameCallback=Hr,t.prototype.startAnimation=Nr,t.prototype.stopAnimation=zr,t.prototype.onSeek=Or;},Wr=function(t,e){if(t)return t;if(e.parentElement)return e.parentElement;if(typeof document<"u"&&document.body)return document.body;throw new Error("Cannot resolve container element. Provide container explicitly when DOM is unavailable.")},qr=function(t){if(typeof getComputedStyle=="function"){getComputedStyle(t).position==="static"&&(t.style.position="relative");return}t.style.position||(t.style.position="relative");},Br=function(t){try{this.destroyCanvasOnly();const e=t instanceof HTMLVideoElement?t:t.video,n=t instanceof HTMLVideoElement?t.parentElement:t.container??t.video.parentElement,r=this.resolveContainer(n??null,e);this.videoElement=e,this.containerElement=r,this.lastVideoSource=this.getCurrentVideoSource(),this.duration=Number.isFinite(e.duration)?L(e.duration):0,this.currentTime=L(e.currentTime),this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.isStalled=!1,this.lastDrawTime=this.timeSource.now(),this.playbackHasBegun=this.isPlaying||this.currentTime>$,this.skipDrawingForCurrentFrame=this.shouldSuppressRendering();const i=this.createCanvasElement(),s=i.getContext("2d");if(!s)throw new Error("Failed to acquire 2D canvas context");i.style.position="absolute",i.style.top="0",i.style.left="0",i.style.pointerEvents="none",i.style.zIndex="1000";const a=this.containerElement;a instanceof HTMLElement&&(this.ensureContainerPositioning(a),a.appendChild(i)),this.canvas=i,this.ctx=s,this.resize(),this.calculateLaneMetrics(),this.setupVideoEventListeners(e),this.setupResizeHandling(e),this.setupFullscreenHandling(),this.setupVideoChangeDetection(e,r),this.startAnimation(),this.setupVisibilityHandling();}catch(e){throw this.log.error("CommentRenderer.initialize",e),e}},Ur=function(){this.stopAnimation(),this.cleanupResizeHandling(),this.runCleanupTasks(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.videoElement=null,this.containerElement=null,this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.resetFinalPhaseState(),this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.commentSequence=0,this.playbackHasBegun=false,this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false;},Gr=function(){this.stopAnimation(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.fullscreenActive=false;},Kr=t=>{t.prototype.resolveContainer=Wr,t.prototype.ensureContainerPositioning=qr,t.prototype.initialize=Br,t.prototype.destroy=Ur,t.prototype.destroyCanvasOnly=Gr;},jr=function(t){try{const e=()=>{this.isPlaying=!0,this.playbackHasBegun=!0;const p=this.timeSource.now();this.lastDrawTime=p,this.lastPlayResumeTime=p,this.comments.forEach(u=>{u.lastUpdateTime=p,u.isPaused=!1;});},n=()=>{this.isPlaying=!1;const p=this.timeSource.now();this.comments.forEach(u=>{u.lastUpdateTime=p,u.isPaused=!0;});},r=()=>{this.onSeek();},i=()=>{this.onSeek();},s=()=>{this.playbackRate=t.playbackRate;const p=this.timeSource.now();this.comments.forEach(u=>{u.lastUpdateTime=p;});},a=()=>{this.handleVideoMetadataLoaded(t);},o=()=>{this.duration=Number.isFinite(t.duration)?L(t.duration):0;},l=()=>{this.handleVideoSourceChange();},d=()=>{this.handleVideoStalled();},h=()=>{this.handleVideoCanPlay();},c=()=>{this.handleVideoCanPlay();};t.addEventListener("play",e),t.addEventListener("pause",n),t.addEventListener("seeking",r),t.addEventListener("seeked",i),t.addEventListener("ratechange",s),t.addEventListener("loadedmetadata",a),t.addEventListener("durationchange",o),t.addEventListener("emptied",l),t.addEventListener("waiting",d),t.addEventListener("canplay",h),t.addEventListener("playing",c),this.addCleanup(()=>t.removeEventListener("play",e)),this.addCleanup(()=>t.removeEventListener("pause",n)),this.addCleanup(()=>t.removeEventListener("seeking",r)),this.addCleanup(()=>t.removeEventListener("seeked",i)),this.addCleanup(()=>t.removeEventListener("ratechange",s)),this.addCleanup(()=>t.removeEventListener("loadedmetadata",a)),this.addCleanup(()=>t.removeEventListener("durationchange",o)),this.addCleanup(()=>t.removeEventListener("emptied",l)),this.addCleanup(()=>t.removeEventListener("waiting",d)),this.addCleanup(()=>t.removeEventListener("canplay",h)),this.addCleanup(()=>t.removeEventListener("playing",c));}catch(e){throw this.log.error("CommentRenderer.setupVideoEventListeners",e),e}},Yr=function(t){this.lastVideoSource=this.getCurrentVideoSource(),this.incrementEpoch("metadata-loaded"),this.handleVideoSourceChange(t),this.resize(),this.calculateLaneMetrics(),this.onSeek(),this.emitStateSnapshot("metadata-loaded");},Xr=function(){const t=this.canvas,e=this.ctx;if(!t||!e)return;this.isStalled=true;const n=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/n,i=this.displayHeight>0?this.displayHeight:t.height/n;e.clearRect(0,0,r,i),this.comments.forEach(s=>{s.isActive&&(s.lastUpdateTime=this.timeSource.now());});},Jr=function(){this.isStalled&&(this.isStalled=false,this.videoElement&&(this.currentTime=L(this.videoElement.currentTime),this.isPlaying=!this.videoElement.paused),this.lastDrawTime=this.timeSource.now());},Zr=function(t){const e=t??this.videoElement;if(!e){this.lastVideoSource=null,this.isPlaying=false,this.resetFinalPhaseState(),this.resetCommentActivity();return}const n=this.getCurrentVideoSource();n!==this.lastVideoSource&&(this.lastVideoSource=n,this.incrementEpoch("source-change"),this.syncVideoState(e),this.resetFinalPhaseState(),this.resetCommentActivity(),this.emitStateSnapshot("source-change"));},Qr=function(t){this.duration=Number.isFinite(t.duration)?L(t.duration):0,this.currentTime=L(t.currentTime),this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.isStalled=false,this.playbackHasBegun=this.isPlaying||this.currentTime>$,this.lastDrawTime=this.timeSource.now();},ei=function(){const t=this.timeSource.now(),e=this.canvas,n=this.ctx;if(this.resetFinalPhaseState(),this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false,this.playbackHasBegun=this.isPlaying||this.currentTime>$,e&&n){const r=this.canvasDpr>0?this.canvasDpr:1,i=this.displayWidth>0?this.displayWidth:e.width/r,s=this.displayHeight>0?this.displayHeight:e.height/r;n.clearRect(0,0,i,s);}this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.comments.forEach(r=>{r.isActive=false,r.isPaused=!this.isPlaying,r.hasShown=false,r.lane=-1,r.x=r.virtualStartX,r.speed=r.baseSpeed,r.lastUpdateTime=t,r.clearActivation();}),this.activeComments.clear();},ti=function(t,e){if(typeof MutationObserver>"u"){this.log.debug("MutationObserver is not available in this environment. Video change detection is disabled.");return}const n=new MutationObserver(i=>{for(const s of i){if(s.type==="attributes"&&s.attributeName==="src"){const a=s.target;let o=null,l=null;if((a instanceof HTMLVideoElement||a instanceof HTMLSourceElement)&&(o=typeof s.oldValue=="string"?s.oldValue:null,l=a.getAttribute("src")),o===l)continue;this.handleVideoSourceChange(t);return}if(s.type==="childList"){for(const a of s.addedNodes)if(a instanceof HTMLSourceElement){this.handleVideoSourceChange(t);return}for(const a of s.removedNodes)if(a instanceof HTMLSourceElement){this.handleVideoSourceChange(t);return}}}});n.observe(t,{attributes:true,attributeFilter:["src"],attributeOldValue:true,childList:true,subtree:true}),this.addCleanup(()=>n.disconnect());const r=new MutationObserver(i=>{for(const s of i)if(s.type==="childList"){for(const a of s.addedNodes){const o=this.extractVideoElement(a);if(o&&o!==this.videoElement){this.initialize(o);return}}for(const a of s.removedNodes){if(a===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}if(a instanceof Element){const o=a.querySelector("video");if(o&&o===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}}}}});r.observe(e,{childList:true,subtree:true}),this.addCleanup(()=>r.disconnect());},ni=function(t){if(t instanceof HTMLVideoElement)return t;if(t instanceof Element){const e=t.querySelector("video");if(e instanceof HTMLVideoElement)return e}return null},ri=t=>{t.prototype.setupVideoEventListeners=jr,t.prototype.handleVideoMetadataLoaded=Yr,t.prototype.handleVideoStalled=Xr,t.prototype.handleVideoCanPlay=Jr,t.prototype.handleVideoSourceChange=Zr,t.prototype.syncVideoState=Qr,t.prototype.resetCommentActivity=ei,t.prototype.setupVideoChangeDetection=ti,t.prototype.extractVideoElement=ni;},ii=function(){if(typeof document>"u"||typeof document.addEventListener!="function"||typeof document.removeEventListener!="function")return;const t=()=>{if(document.visibilityState!=="visible"){this.stopAnimation();return}this._settings.isCommentVisible&&(this.handleVisibilityRestore(),this.startAnimation());};document.addEventListener("visibilitychange",t),this.addCleanup(()=>document.removeEventListener("visibilitychange",t)),document.visibilityState!=="visible"&&this.stopAnimation();},si=function(){const t=this.canvas,e=this.ctx,n=this.videoElement;!t||!e||!n||(this.currentTime=L(n.currentTime),this.lastDrawTime=this.timeSource.now(),this.isPlaying=!n.paused,this.isStalled=false,this.pendingInitialSync=true,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),this.draw());},ai=function(t){const e=this._settings.isCommentVisible;if(this._settings.isCommentVisible=t,e===t)return;this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion;const n=this.canvas,r=this.ctx;if(!(!n||!r))if(t)this.lastDrawTime=this.timeSource.now(),this.pendingInitialSync=true,this.scheduleNextFrame();else {const i=this.canvasDpr>0?this.canvasDpr:1,s=this.displayWidth>0?this.displayWidth:n.width/i,a=this.displayHeight>0?this.displayHeight:n.height/i;r.clearRect(0,0,s,a);}},oi=t=>{t.prototype.setupVisibilityHandling=ii,t.prototype.handleVisibilityRestore=si,t.prototype.setCommentVisibility=ai;},li=function(t,e){const n=this.videoElement,r=this.canvas,i=this.ctx;if(!n||!r)return;const s=n.getBoundingClientRect(),a=this.canvasDpr>0?this.canvasDpr:1,o=this.displayWidth>0?this.displayWidth:r.width/a,l=this.displayHeight>0?this.displayHeight:r.height/a,d=t??s.width??o,h=e??s.height??l;if(!Number.isFinite(d)||!Number.isFinite(h)||d<=0||h<=0)return;const c=Math.max(1,Math.floor(d)),p=Math.max(1,Math.floor(h)),u=this.displayWidth>0?this.displayWidth:c,m=this.displayHeight>0?this.displayHeight:p,y=this._settings.useDprScaling?this.resolveDevicePixelRatio():1,v=Math.max(1,Math.round(c*y)),w=Math.max(1,Math.round(p*y));if(!(this.displayWidth!==c||this.displayHeight!==p||Math.abs(this.canvasDpr-y)>Number.EPSILON||r.width!==v||r.height!==w))return;this.displayWidth=c,this.displayHeight=p,this.canvasDpr=y,r.width=v,r.height=w,r.style.width=`${c}px`,r.style.height=`${p}px`,i&&(i.setTransform(1,0,0,1,0,0),this._settings.useDprScaling&&i.scale(y,y));const S=u>0?c/u:1,T=m>0?p/m:1;(S!==1||T!==1)&&this.comments.forEach(M=>{M.isActive&&(M.x*=S,M.y*=T,M.width*=S,M.fontSize=Math.max(mt,Math.floor(Math.max(1,M.fontSize)*T)),M.height=M.fontSize,M.virtualStartX*=S,M.exitThreshold*=S,M.baseSpeed*=S,M.speed*=S,M.speedPixelsPerMs*=S,M.bufferWidth*=S,M.reservationWidth*=S);}),this.calculateLaneMetrics();},ci=function(){if(typeof window>"u")return 1;const t=Number(window.devicePixelRatio);return !Number.isFinite(t)||t<=0?1:t},di=function(){const t=this.canvas;if(!t)return;const e=this.displayHeight>0?this.displayHeight:t.height/Math.max(this.canvasDpr,1),n=Math.max(mt,Math.floor(e*.05));this.laneHeight=n*1.2;const r=Math.floor(e/Math.max(this.laneHeight,1));if(this._settings.useFixedLaneCount){const i=Number.isFinite(this._settings.fixedLaneCount)?Math.floor(this._settings.fixedLaneCount):ut,s=Math.max(Ne,Math.min(r,i));this.laneCount=s;}else this.laneCount=Math.max(Ne,r);this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;},hi=function(t){if(this.cleanupResizeHandling(),this._settings.useContainerResizeObserver&&this.isResizeObserverAvailable){const e=this.resolveResizeObserverTarget(t),n=new ResizeObserver(r=>{for(const i of r){const{width:s,height:a}=i.contentRect;s>0&&a>0?this.resize(s,a):this.resize();}});n.observe(e),this.resizeObserver=n,this.resizeObserverTarget=e;}else if(typeof window<"u"&&typeof window.addEventListener=="function"){const e=()=>{this.resize();};window.addEventListener("resize",e),this.addCleanup(()=>window.removeEventListener("resize",e));}else this.log.debug("Resize handling is disabled because neither ResizeObserver nor window APIs are available.");},pi=function(){this.resizeObserver&&this.resizeObserverTarget&&this.resizeObserver.unobserve(this.resizeObserverTarget),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.resizeObserverTarget=null;},ui=t=>{t.prototype.resize=li,t.prototype.resolveDevicePixelRatio=ci,t.prototype.calculateLaneMetrics=di,t.prototype.setupResizeHandling=hi,t.prototype.cleanupResizeHandling=pi;},mi=function(){if(typeof document>"u"||typeof document.addEventListener!="function"||typeof document.removeEventListener!="function")return;const t=()=>{this.handleFullscreenChange();};["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(e=>{document.addEventListener(e,t),this.addCleanup(()=>document.removeEventListener(e,t));}),this.handleFullscreenChange();},gi=function(t){return this.resolveFullscreenContainer(t)||(t.parentElement??t)},fi=async function(){const t=this.canvas,e=this.videoElement;if(!t||!e)return;const n=this.containerElement??e.parentElement??null,r=this.getFullscreenElement(),i=this.resolveActiveOverlayContainer(e,n,r);if(!(i instanceof HTMLElement))return;t.parentElement!==i?(this.ensureContainerPositioning(i),i.appendChild(t)):this.ensureContainerPositioning(i);const s=(r instanceof HTMLElement&&r.contains(e)?r:null)!==null;this.fullscreenActive!==s&&(this.fullscreenActive=s,this.setupResizeHandling(e)),t.style.position="absolute",t.style.top="0",t.style.left="0",this.resize();},bi=function(t){const e=this.getFullscreenElement();return e instanceof HTMLElement&&(e===t||e.contains(t))?e:null},yi=function(t,e,n){return n instanceof HTMLElement&&n.contains(t)?n instanceof HTMLVideoElement&&e instanceof HTMLElement?e:n:e??null},vi=function(){if(typeof document>"u")return null;const t=document;return document.fullscreenElement??t.webkitFullscreenElement??t.mozFullScreenElement??t.msFullscreenElement??null},xi=t=>{t.prototype.setupFullscreenHandling=mi,t.prototype.resolveResizeObserverTarget=gi,t.prototype.handleFullscreenChange=fi,t.prototype.resolveFullscreenContainer=bi,t.prototype.resolveActiveOverlayContainer=yi,t.prototype.getFullscreenElement=vi;},wi=function(t){this.cleanupTasks.push(t);},Si=function(){for(;this.cleanupTasks.length>0;){const t=this.cleanupTasks.pop();try{t?.();}catch(e){this.log.error("CommentRenderer.cleanupTask",e);}}},Ci=t=>{t.prototype.addCleanup=wi,t.prototype.runCleanupTasks=Si;};class V{_settings;comments=[];activeComments=new Set;reservedLanes=new Map;topStaticLaneReservations=[];bottomStaticLaneReservations=[];log;timeSource;animationFrameProvider;createCanvasElement;commentDependencies;settingsVersion=0;normalizedNgWords=[];compiledNgRegexps=[];canvas=null;ctx=null;videoElement=null;containerElement=null;fullscreenActive=false;laneCount=ut;laneHeight=0;displayWidth=0;displayHeight=0;canvasDpr=1;currentTime=0;duration=0;playbackRate=1;isPlaying=true;isStalled=false;lastDrawTime=0;finalPhaseActive=false;finalPhaseStartTime=null;finalPhaseScheduleDirty=false;playbackHasBegun=false;skipDrawingForCurrentFrame=false;pendingInitialSync=false;finalPhaseVposOverrides=new Map;frameId=null;videoFrameHandle=null;resizeObserver=null;resizeObserverTarget=null;isResizeObserverAvailable=typeof ResizeObserver<"u";cleanupTasks=[];commentSequence=0;epochId=0;eventHooks;lastSnapshotEmitTime=0;snapshotEmitThrottleMs=1e3;lastPlayResumeTime=0;playResumeSeekIgnoreDurationMs=500;lastVideoSource=null;rebuildNgMatchers(){St.call(this);}constructor(e=null,n=void 0){let r,i;if(Pn(e))r=re({...e}),i=n??{};else {const s=e??n??{};i=typeof s=="object"?s:{},r=re(xt());}this._settings=re(r),this.timeSource=i.timeSource??pt(),this.animationFrameProvider=i.animationFrameProvider??_n(this.timeSource),this.createCanvasElement=i.createCanvasElement??In(),this.commentDependencies={timeSource:this.timeSource,settingsVersion:this.settingsVersion},this.log=gt(i.loggerNamespace??"CommentRenderer"),this.eventHooks=i.eventHooks??{},this.handleAnimationFrame=this.handleAnimationFrame.bind(this),this.handleVideoFrame=this.handleVideoFrame.bind(this),this.rebuildNgMatchers(),i.debug&&fn(i.debug);}get settings(){return this._settings}set settings(e){this._settings=re(e),this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion,this.rebuildNgMatchers();}getVideoElement(){return this.videoElement}getCurrentVideoSource(){const e=this.videoElement;if(!e)return null;if(typeof e.currentSrc=="string"&&e.currentSrc.length>0)return e.currentSrc;const n=e.getAttribute("src");if(n&&n.length>0)return n;const r=e.querySelector("source[src]");return r&&typeof r.src=="string"?r.src:null}getCommentsSnapshot(){return [...this.comments]}}Hn(V);Un(V);jn(V);Zn(V);nr(V);hr(V);br(V);Tr(V);Ir(V);$r(V);Kr(V);ri(V);oi(V);ui(V);xi(V);Ci(V);const W=()=>({...xt(),shadowIntensity:"strong",autoSearchEnabled:true}),Mi="v7.2.3";var Ei=typeof GM_addStyle<"u"?GM_addStyle:void 0,U=typeof GM_getValue<"u"?GM_getValue:void 0,G=typeof GM_setValue<"u"?GM_setValue:void 0,ki=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const Be="settings",Ue="currentVideo",Ge="lastDanimeIds",Ke="playbackSettings",je="manualSearchSettings",Ti=t=>({...t,ngWords:[...t.ngWords],ngRegexps:[...t.ngRegexps]}),Y={fixedModeEnabled:false,fixedRate:1.11},ie=t=>({fixedModeEnabled:t.fixedModeEnabled,fixedRate:t.fixedRate});class Ie{constructor(e){this.notifier=e,this.settings=W(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData(),this.playbackSettings=ie(Y),this.loadPlaybackSettings();}settings;currentVideo;observers=new Set;playbackSettings;playbackObservers=new Set;getSettings(){return Ti(this.settings)}loadSettings(){try{const e=U(Be,null);if(!e)return this.settings=W(),this.settings;if(typeof e=="string"){const n=JSON.parse(e);this.settings={...W(),...n,ngWords:Array.isArray(n?.ngWords)?[...n.ngWords]:[],ngRegexps:Array.isArray(n?.ngRegexps)?[...n.ngRegexps]:[]};}else this.settings={...W(),...e,ngWords:Array.isArray(e.ngWords)?[...e.ngWords]:[],ngRegexps:Array.isArray(e.ngRegexps)?[...e.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(e){return console.error("[SettingsManager] 設定の読み込みに失敗しました",e),this.notify("設定の読み込みに失敗しました","error"),this.settings=W(),this.settings}}getPlaybackSettings(){return ie(this.playbackSettings)}loadPlaybackSettings(){try{const e=U(Ke,null);if(!e)return this.playbackSettings=ie(Y),this.notifyPlaybackObservers(),this.playbackSettings;if(typeof e=="string"){const n=JSON.parse(e);this.playbackSettings={fixedModeEnabled:typeof n.fixedModeEnabled=="boolean"?n.fixedModeEnabled:Y.fixedModeEnabled,fixedRate:typeof n.fixedRate=="number"?n.fixedRate:Y.fixedRate};}else this.playbackSettings={fixedModeEnabled:e.fixedModeEnabled,fixedRate:e.fixedRate};return this.notifyPlaybackObservers(),this.playbackSettings}catch(e){return console.error("[SettingsManager] 再生設定の読み込みに失敗しました",e),this.notify("再生設定の読み込みに失敗しました","error"),this.playbackSettings=ie(Y),this.notifyPlaybackObservers(),this.playbackSettings}}updatePlaybackSettings(e){return this.playbackSettings={...this.playbackSettings,...e},this.savePlaybackSettings()}savePlaybackSettings(){try{return G(Ke,JSON.stringify(this.playbackSettings)),this.notifyPlaybackObservers(),!0}catch(e){return console.error("[SettingsManager] 再生設定の保存に失敗しました",e),this.notify("再生設定の保存に失敗しました","error"),false}}saveSettings(){try{return G(Be,JSON.stringify(this.settings)),this.notifyObservers(),this.notify("設定を保存しました","success"),!0}catch(e){return console.error("[SettingsManager] 設定の保存に失敗しました",e),this.notify("設定の保存に失敗しました","error"),false}}updateSettings(e){return this.settings={...this.settings,...e,ngWords:e.ngWords?[...e.ngWords]:[...this.settings.ngWords??[]],ngRegexps:e.ngRegexps?[...e.ngRegexps]:[...this.settings.ngRegexps??[]]},this.saveSettings()}addObserver(e){this.observers.add(e);}removeObserver(e){this.observers.delete(e);}addPlaybackObserver(e){this.playbackObservers.add(e);try{e(this.getPlaybackSettings());}catch(n){console.error("[SettingsManager] 再生設定の登録通知でエラー",n);}}removePlaybackObserver(e){this.playbackObservers.delete(e);}notifyObservers(){const e=this.getSettings();for(const n of this.observers)try{n(e);}catch(r){console.error("[SettingsManager] 設定変更通知でエラー",r);}}notifyPlaybackObservers(){const e=this.getPlaybackSettings();for(const n of this.playbackObservers)try{n(e);}catch(r){console.error("[SettingsManager] 再生設定通知でエラー",r);}}loadVideoData(){try{return U(Ue,null)??null}catch(e){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",e),this.notify("動画データの読み込みに失敗しました","error"),null}}saveVideoData(e,n){try{const r={videoId:n.videoId,title:n.title,viewCount:n.viewCount,commentCount:n.commentCount,mylistCount:n.mylistCount,postedAt:n.postedAt,thumbnail:n.thumbnail,owner:n.owner??null,channel:n.channel??null};return G(Ue,r),this.currentVideo=r,!0}catch(r){return console.error("[SettingsManager] 動画データの保存に失敗しました",r),this.notify("動画データの保存に失敗しました","error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(e){try{return G(Ge,e),!0}catch(n){return console.error("[SettingsManager] saveLastDanimeIds failed",n),this.notify("ID情報の保存に失敗しました","error"),false}}loadLastDanimeIds(){try{return U(Ge,null)??null}catch(e){return console.error("[SettingsManager] loadLastDanimeIds failed",e),this.notify("ID情報の読込に失敗しました","error"),null}}saveManualSearchSettings(e){try{return G(je,e),!0}catch(n){return console.error("[SettingsManager] saveManualSearchSettings failed",n),this.notify("検索設定の保存に失敗しました","error"),false}}loadManualSearchSettings(){try{return U(je,null)??null}catch(e){return console.error("[SettingsManager] loadManualSearchSettings failed",e),this.notify("検索設定の読込に失敗しました","error"),null}}notify(e,n="info"){this.notifier?.show(e,n);}}const Vi=new Set(["INPUT","TEXTAREA"]),ge=t=>t.length===1?t.toUpperCase():t,_i=t=>t?`${t}+`:"";class Ct{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(e,n,r){const i=this.createShortcutKey(ge(e),n);this.shortcuts.set(i,r);}removeShortcut(e,n){const r=this.createShortcutKey(ge(e),n);this.shortcuts.delete(r);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(e){this.isEnabled=e;}createShortcutKey(e,n){return `${_i(n)}${e}`}extractModifier(e){const n=[];return e.ctrlKey&&n.push("Ctrl"),e.altKey&&n.push("Alt"),e.shiftKey&&n.push("Shift"),e.metaKey&&n.push("Meta"),n.length>0?n.join("+"):null}handleKeyDown(e){if(!this.isEnabled)return;const r=e.target?.tagName??"";if(Vi.has(r))return;const i=this.extractModifier(e),s=this.createShortcutKey(ge(e.key),i),a=this.shortcuts.get(s);a&&(e.preventDefault(),a());}}const Ii=F("dAnime:CommentRenderer"),Ye=t=>({loggerNamespace:"dAnime:CommentRenderer",...t??{}}),Pi=t=>{if(!t||typeof t!="object")return  false;const e=t;return typeof e.commentColor=="string"&&typeof e.commentOpacity=="number"&&typeof e.isCommentVisible=="boolean"};class Z{renderer;keyboardHandler=null;constructor(e,n){Pi(e)||e===null?this.renderer=new V(e??null,Ye(n)):this.renderer=new V(Ye(e));}get settings(){return this.renderer.settings}set settings(e){this.renderer.settings=e;}initialize(e){this.renderer.initialize(e),this.setupKeyboardShortcuts();}addComment(e,n,r=[]){return this.renderer.addComment(e,n,r)}clearComments(){this.renderer.clearComments();}resetState(){this.renderer.resetState();}destroy(){this.teardownKeyboardShortcuts(),this.renderer.destroy();}updateSettings(e){this.renderer.settings=e;}getVideoElement(){return this.renderer.getVideoElement()}getCurrentVideoSource(){return this.renderer.getCurrentVideoSource()}getCommentsSnapshot(){return this.renderer.getCommentsSnapshot()}isNGComment(e){return this.renderer.isNGComment(e)}resize(e,n){this.renderer.resize(e,n);}setupKeyboardShortcuts(){this.teardownKeyboardShortcuts();const e=new Ct;e.addShortcut("C","Shift",()=>{try{const n=!this.renderer.settings.isCommentVisible;this.renderer.setCommentVisibility(n),this.syncGlobalSettings(this.renderer.settings);}catch(n){Ii.error("CommentRenderer.keyboardShortcut",n);}}),e.startListening(),this.keyboardHandler=e;}teardownKeyboardShortcuts(){this.keyboardHandler?.stopListening(),this.keyboardHandler=null;}syncGlobalSettings(e){window.dAniRenderer?.settingsManager?.updateSettings(e);}}class Pe{shadowRoot=null;container=null;createShadowDOM(e,n={mode:"closed"}){if(!e)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=e.attachShadow(n),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(e){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const n=document.createElement("style");n.textContent=e,this.shadowRoot.appendChild(n);}querySelector(e){return this.shadowRoot?this.shadowRoot.querySelector(e):null}querySelectorAll(e){return this.shadowRoot?this.shadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}setHTML(e){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=e;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const Ai=`\r
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
/* ============================================\r
   Cinematic Glass Card - 動画情報カード\r
   ============================================ */\r
.video-card {\r
  position: relative;\r
  overflow: hidden;\r
  border-radius: 16px;\r
  background: var(--bg-secondary);\r
  border: 1px solid rgba(255, 255, 255, 0.08);\r
  box-shadow:\r
    0 8px 32px rgba(0, 0, 0, 0.35),\r
    0 0 0 1px rgba(255, 255, 255, 0.04);\r
  transition:\r
    box-shadow 0.4s ease,\r
    border-color 0.4s ease,\r
    transform 0.3s ease;\r
}\r
\r
.video-card:hover {\r
  box-shadow:\r
    0 16px 48px rgba(127, 90, 240, 0.15),\r
    0 0 0 1px rgba(127, 90, 240, 0.2);\r
  border-color: rgba(127, 90, 240, 0.3);\r
  transform: translateY(-2px);\r
}\r
\r
/* 背景ブラー効果（Ambient Glow） */\r
.video-card__ambient {\r
  position: absolute;\r
  inset: 0;\r
  background-size: cover;\r
  background-position: center;\r
  opacity: 0.15;\r
  filter: blur(60px);\r
  transform: scale(1.2);\r
  pointer-events: none;\r
  transition: opacity 0.4s ease;\r
}\r
\r
.video-card:hover .video-card__ambient {\r
  opacity: 0.25;\r
}\r
\r
/* グラデーションオーバーレイ */\r
.video-card__gradient {\r
  position: absolute;\r
  inset: 0;\r
  background: linear-gradient(\r
    135deg,\r
    rgba(22, 22, 26, 0.95) 0%,\r
    rgba(22, 22, 26, 0.88) 50%,\r
    rgba(36, 38, 41, 0.8) 100%\r
  );\r
  pointer-events: none;\r
}\r
\r
/* カード本体 */\r
.video-card__body {\r
  position: relative;\r
  z-index: 1;\r
  display: flex;\r
  gap: 20px;\r
  padding: 20px;\r
}\r
\r
@media (max-width: 600px) {\r
  .video-card__body {\r
    flex-direction: column;\r
  }\r
}\r
\r
/* サムネイル */\r
.video-card__thumbnail {\r
  position: relative;\r
  flex-shrink: 0;\r
  width: 180px;\r
  aspect-ratio: 16 / 9;\r
  border-radius: 10px;\r
  overflow: hidden;\r
  background: var(--bg-primary);\r
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);\r
}\r
\r
.video-card__thumbnail img {\r
  width: 100%;\r
  height: 100%;\r
  object-fit: cover;\r
  transition: transform 0.5s ease;\r
}\r
\r
/* 情報セクション */\r
.video-card__info {\r
  flex: 1;\r
  display: flex;\r
  flex-direction: column;\r
  justify-content: space-between;\r
  gap: 12px;\r
  min-width: 0;\r
}\r
\r
/* 上部メタ行（ID & 日付） */\r
.video-card__meta-row {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  gap: 12px;\r
  font-size: 12px;\r
  color: var(--text-secondary);\r
  font-family: 'Fira Code', 'Consolas', monospace;\r
}\r
\r
.video-card__id {\r
  display: inline-flex;\r
  align-items: center;\r
  gap: 6px;\r
  padding: 4px 10px;\r
  background: rgba(255, 255, 255, 0.06);\r
  border: 1px solid rgba(255, 255, 255, 0.1);\r
  border-radius: 6px;\r
  cursor: pointer;\r
  transition: all 0.2s ease;\r
}\r
\r
.video-card__id:hover {\r
  background: rgba(127, 90, 240, 0.15);\r
  border-color: rgba(127, 90, 240, 0.4);\r
  color: var(--primary);\r
}\r
\r
.video-card__id-icon svg,\r
.video-card__date-icon svg {\r
  width: 12px;\r
  height: 12px;\r
  color: var(--primary);\r
}\r
\r
.video-card__date {\r
  display: inline-flex;\r
  align-items: center;\r
  gap: 6px;\r
}\r
\r
.video-card__date-icon svg {\r
  color: var(--text-secondary);\r
}\r
\r
/* メインコンテンツ（タイトル & 投稿者） */\r
.video-card__main {\r
  flex: 1;\r
}\r
\r
.video-card__title {\r
  margin: 0 0 8px;\r
  font-size: 18px;\r
  font-weight: 700;\r
  line-height: 1.4;\r
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
.video-card:hover .video-card__title {\r
  color: #C4B5FD;\r
}\r
\r
.video-card__owner {\r
  display: inline-flex;\r
  align-items: center;\r
  gap: 8px;\r
  font-size: 14px;\r
  color: var(--text-secondary);\r
  transition: color 0.2s ease;\r
  cursor: pointer;\r
}\r
\r
.video-card__owner:hover {\r
  color: var(--text-primary);\r
}\r
\r
.video-card__owner-icon svg {\r
  width: 14px;\r
  height: 14px;\r
  color: var(--text-secondary);\r
}\r
\r
/* 統計情報行 */\r
.video-card__stats {\r
  display: flex;\r
  align-items: center;\r
  gap: 16px;\r
  padding-top: 12px;\r
  border-top: 1px solid rgba(255, 255, 255, 0.08);\r
}\r
\r
.video-card__stat {\r
  display: inline-flex;\r
  align-items: center;\r
  gap: 6px;\r
  font-size: 13px;\r
  color: var(--text-secondary);\r
  transition: color 0.2s ease;\r
}\r
\r
.video-card__stat:hover {\r
  color: var(--text-primary);\r
}\r
\r
.video-card__stat-icon svg {\r
  width: 14px;\r
  height: 14px;\r
  color: var(--text-secondary);\r
}\r
\r
.video-card__stat-value {\r
  font-weight: 600;\r
  font-variant-numeric: tabular-nums;\r
}\r
\r
/* 空状態 */\r
.video-card--empty .video-card__title {\r
  color: var(--text-secondary);\r
}\r
\r
.video-card--empty .video-card__ambient {\r
  opacity: 0;\r
}\r
\r
/* ============================================\r
   レガシー: 現在の設定エリアのスタイル（後方互換）\r
   ============================================ */\r
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
border: 1px solid transparent;\r
border-radius: 999px;\r
color: var(--text-primary);\r
padding: 10px 18px;\r
font-weight: 500;\r
box-shadow: 0 10px 24px rgba(127, 90, 240, 0.35);\r
transition: all 0.25s ease;\r
}\r
\r
#searchButton:hover, #saveSettings:hover {\r
background: linear-gradient(135deg, #8B6AF5 0%, #7B54FF 100%);\r
box-shadow: 0 12px 28px rgba(127, 90, 240, 0.45);\r
transform: translateY(-2px);\r
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
/* ============================================\r
   表示タブ: 2カラムレイアウト\r
   ============================================ */\r
.display-panel {\r
  display: grid;\r
  grid-template-columns: 1fr 1fr;\r
  gap: 24px;\r
  height: 100%;\r
}\r
\r
@media (max-width: 900px) {\r
  .display-panel {\r
    grid-template-columns: 1fr;\r
  }\r
}\r
\r
.display-panel__controls {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 20px;\r
}\r
\r
.display-panel__preview {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 12px;\r
}\r
\r
/* セクション */\r
.display-section {\r
  background: rgba(0, 0, 0, 0.2);\r
  border: 1px solid rgba(255, 255, 255, 0.06);\r
  border-radius: 14px;\r
  padding: 18px;\r
}\r
\r
.display-section__header {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  margin-bottom: 16px;\r
}\r
\r
.display-section__title {\r
  margin: 0;\r
  font-size: 13px;\r
  font-weight: 600;\r
  color: var(--text-secondary);\r
  text-transform: uppercase;\r
  letter-spacing: 0.8px;\r
}\r
\r
.display-section__body {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 16px;\r
}\r
\r
/* 表示/非表示バッジ */\r
.visibility-badge {\r
  display: inline-flex;\r
  align-items: center;\r
  gap: 6px;\r
  padding: 6px 12px;\r
  border-radius: 999px;\r
  font-size: 12px;\r
  font-weight: 600;\r
  background: rgba(44, 182, 125, 0.15);\r
  color: var(--success);\r
  border: 1px solid rgba(44, 182, 125, 0.3);\r
  cursor: pointer;\r
  transition: all 0.25s ease;\r
  box-shadow: none;\r
}\r
\r
.visibility-badge:hover {\r
  background: rgba(44, 182, 125, 0.25);\r
  transform: none;\r
  box-shadow: none;\r
}\r
\r
.visibility-badge::after {\r
  display: none;\r
}\r
\r
.visibility-badge--off {\r
  background: rgba(229, 49, 112, 0.15);\r
  color: var(--danger);\r
  border-color: rgba(229, 49, 112, 0.3);\r
}\r
\r
.visibility-badge--off:hover {\r
  background: rgba(229, 49, 112, 0.25);\r
}\r
\r
.visibility-badge__icon {\r
  display: inline-flex;\r
  align-items: center;\r
  justify-content: center;\r
}\r
\r
.visibility-badge__icon svg {\r
  width: 14px;\r
  height: 14px;\r
}\r
\r
.visibility-badge__label {\r
  line-height: 1;\r
}\r
\r
/* カラー行 */\r
.color-row {\r
  display: flex;\r
  flex-wrap: wrap;\r
  align-items: center;\r
  gap: 12px;\r
  padding: 14px;\r
  background: rgba(255, 255, 255, 0.03);\r
  border: 1px solid rgba(255, 255, 255, 0.06);\r
  border-radius: 10px;\r
}\r
\r
.color-divider {\r
  width: 1px;\r
  height: 28px;\r
  background: rgba(255, 255, 255, 0.1);\r
}\r
\r
.color-custom {\r
  display: flex;\r
  align-items: center;\r
  gap: 8px;\r
  padding: 6px 10px;\r
  background: var(--bg-primary);\r
  border: 1px solid rgba(255, 255, 255, 0.1);\r
  border-radius: 8px;\r
  transition: border-color 0.2s ease;\r
}\r
\r
.color-custom:focus-within {\r
  border-color: var(--primary);\r
}\r
\r
.color-custom__hex-label {\r
  font-size: 11px;\r
  color: var(--text-secondary);\r
  font-weight: 500;\r
}\r
\r
.color-custom__hex-input {\r
  width: 72px;\r
  background: transparent;\r
  border: none;\r
  color: var(--text-primary);\r
  font-family: 'Fira Code', monospace;\r
  font-size: 13px;\r
  padding: 4px 0;\r
  margin: 0;\r
}\r
\r
.color-custom__hex-input:focus {\r
  outline: none;\r
  box-shadow: none;\r
}\r
\r
.color-custom__picker {\r
  width: 28px;\r
  height: 28px;\r
  padding: 0;\r
  border: none;\r
  border-radius: 6px;\r
  cursor: pointer;\r
  box-shadow: none;\r
}\r
\r
.color-custom__picker:hover {\r
  transform: none;\r
  box-shadow: none;\r
}\r
\r
/* 透明度スライダー行 */\r
.opacity-row {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 10px;\r
}\r
\r
.opacity-row__labels {\r
  display: flex;\r
  justify-content: space-between;\r
  align-items: center;\r
}\r
\r
.opacity-row__label {\r
  font-size: 13px;\r
  color: var(--text-secondary);\r
}\r
\r
.opacity-row__value {\r
  font-size: 13px;\r
  font-weight: 600;\r
  color: var(--text-primary);\r
  font-family: 'Fira Code', monospace;\r
}\r
\r
.opacity-slider {\r
  -webkit-appearance: none;\r
  appearance: none;\r
  width: 100%;\r
  height: 6px;\r
  background: rgba(255, 255, 255, 0.1);\r
  border-radius: 3px;\r
  cursor: pointer;\r
  margin: 0;\r
  padding: 0;\r
}\r
\r
.opacity-slider::-webkit-slider-thumb {\r
  -webkit-appearance: none;\r
  appearance: none;\r
  width: 18px;\r
  height: 18px;\r
  background: var(--primary);\r
  border-radius: 50%;\r
  cursor: pointer;\r
  box-shadow: 0 2px 8px rgba(127, 90, 240, 0.4);\r
  transition: transform 0.15s ease, box-shadow 0.15s ease;\r
}\r
\r
.opacity-slider::-webkit-slider-thumb:hover {\r
  transform: scale(1.15);\r
  box-shadow: 0 4px 12px rgba(127, 90, 240, 0.5);\r
}\r
\r
.opacity-slider::-moz-range-thumb {\r
  width: 18px;\r
  height: 18px;\r
  background: var(--primary);\r
  border: none;\r
  border-radius: 50%;\r
  cursor: pointer;\r
  box-shadow: 0 2px 8px rgba(127, 90, 240, 0.4);\r
}\r
\r
/* 再生速度オプション */\r
.playback-option {\r
  display: flex;\r
  align-items: center;\r
  gap: 14px;\r
  padding: 14px 16px;\r
  background: rgba(255, 255, 255, 0.03);\r
  border: 1px solid rgba(255, 255, 255, 0.08);\r
  border-radius: 12px;\r
  cursor: pointer;\r
  transition: all 0.25s ease;\r
}\r
\r
.playback-option:hover {\r
  background: rgba(127, 90, 240, 0.08);\r
  border-color: rgba(127, 90, 240, 0.3);\r
}\r
\r
.playback-option--active {\r
  background: rgba(127, 90, 240, 0.12);\r
  border-color: rgba(127, 90, 240, 0.4);\r
}\r
\r
.playback-option__icon-wrapper {\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  width: 40px;\r
  height: 40px;\r
  background: rgba(255, 255, 255, 0.06);\r
  border-radius: 10px;\r
  color: var(--text-secondary);\r
  transition: all 0.25s ease;\r
}\r
\r
.playback-option__icon-wrapper svg {\r
  width: 20px;\r
  height: 20px;\r
}\r
\r
.playback-option__icon-wrapper--active {\r
  background: var(--primary);\r
  color: var(--text-primary);\r
  box-shadow: 0 4px 12px rgba(127, 90, 240, 0.3);\r
}\r
\r
.playback-option__text {\r
  flex: 1;\r
  display: flex;\r
  flex-direction: column;\r
  gap: 2px;\r
}\r
\r
.playback-option__title {\r
  font-size: 14px;\r
  font-weight: 600;\r
  color: var(--text-primary);\r
}\r
\r
.playback-option__desc {\r
  font-size: 12px;\r
  color: var(--text-secondary);\r
}\r
\r
.playback-option__toggle {\r
  position: relative;\r
  width: 48px;\r
  height: 26px;\r
}\r
\r
.playback-option__checkbox {\r
  position: absolute;\r
  opacity: 0;\r
  width: 100%;\r
  height: 100%;\r
  cursor: pointer;\r
  z-index: 1;\r
  margin: 0;\r
}\r
\r
.playback-option__switch {\r
  position: absolute;\r
  top: 0;\r
  left: 0;\r
  width: 100%;\r
  height: 100%;\r
  background: rgba(255, 255, 255, 0.15);\r
  border-radius: 13px;\r
  transition: background 0.25s ease;\r
  pointer-events: none;\r
}\r
\r
.playback-option__switch::after {\r
  content: '';\r
  position: absolute;\r
  top: 3px;\r
  left: 3px;\r
  width: 20px;\r
  height: 20px;\r
  background: var(--text-primary);\r
  border-radius: 50%;\r
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);\r
}\r
\r
.playback-option__checkbox:checked + .playback-option__switch {\r
  background: var(--primary);\r
}\r
\r
.playback-option__checkbox:checked + .playback-option__switch::after {\r
  transform: translateX(22px);\r
}\r
\r
/* ライブプレビュー */\r
.preview-area {\r
  flex: 1;\r
  min-height: 180px;\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  background: rgba(0, 0, 0, 0.5);\r
  border: 1px dashed rgba(255, 255, 255, 0.15);\r
  border-radius: 14px;\r
  overflow: hidden;\r
}\r
\r
.preview-area__background {\r
  position: absolute;\r
  inset: 0;\r
  background: linear-gradient(135deg, rgba(127, 90, 240, 0.05) 0%, rgba(0, 0, 0, 0) 100%);\r
  z-index: 0;\r
}\r
\r
.preview-comment {\r
  position: relative;\r
  z-index: 1;\r
  font-size: 22px;\r
  font-weight: 700;\r
  white-space: nowrap;\r
  text-shadow:\r
    1px 1px 0 #000,\r
    -1px -1px 0 #000,\r
    1px -1px 0 #000,\r
    -1px 1px 0 #000,\r
    2px 2px 4px rgba(0, 0, 0, 0.5);\r
  animation: commentFloat 3s ease-in-out infinite;\r
}\r
\r
@keyframes commentFloat {\r
  0%, 100% { transform: translateX(-5px); }\r
  50% { transform: translateX(5px); }\r
}\r
\r
.preview-hidden-msg {\r
  position: relative;\r
  z-index: 1;\r
  display: flex;\r
  align-items: center;\r
  gap: 8px;\r
  color: var(--text-secondary);\r
  font-size: 14px;\r
}\r
\r
.preview-hidden-msg svg {\r
  width: 18px;\r
  height: 18px;\r
}\r
\r
.preview-area__label {\r
  position: absolute;\r
  bottom: 8px;\r
  right: 10px;\r
  font-size: 10px;\r
  color: rgba(255, 255, 255, 0.25);\r
  font-family: 'Fira Code', monospace;\r
  letter-spacing: 0.5px;\r
}\r
\r
.preview-note {\r
  margin: 0;\r
  font-size: 12px;\r
  color: var(--text-secondary);\r
  text-align: center;\r
}\r
\r
/* 旧スタイル（後方互換のため残す） */\r
.display-settings-item__note {\r
  margin: 4px 0 0;\r
  font-size: 12px;\r
  color: var(--text-secondary);\r
  line-height: 1.4;\r
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
#saveSettings:focus,\r
#searchButton:focus {\r
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
`,Li=`:host {
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
`,Fi=`:host {\r
--primary: #7F5AF0;\r
--accent: #FF8906;\r
}\r
\r
/* 自動ボタン専用の追加スタイル */\r
.auto-comment-button {\r
background: var(--primary);\r
color: white;\r
border: none;\r
padding: 6px 12px;\r
border-radius: 6px;\r
cursor: pointer;\r
font-size: 12px;\r
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\r
box-shadow: 0 2px 8px rgba(127, 90, 240, 0.3);\r
display: inline-flex;\r
align-items: center;\r
justify-content: center;\r
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\r
min-height: 32px;\r
white-space: nowrap;\r
}\r
\r
.auto-comment-button svg {\r
width: 16px;\r
height: 16px;\r
flex-shrink: 0;\r
}\r
\r
.auto-comment-button:hover {\r
background: var(--accent);\r
transform: translateY(-2px);\r
box-shadow: 0 4px 15px rgba(255, 137, 6, 0.4);\r
}\r
\r
.auto-comment-button:active {\r
transform: translateY(0);\r
box-shadow: 0 2px 8px rgba(127, 90, 240, 0.3);\r
}\r
`;class ee{static getCommonStyles(){return Ai}static getNotificationStyles(){return Li}static getAutoButtonStyles(){return Fi}}const Xe={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class b extends Pe{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new b),this.instance}static show(e,n="info",r=3e3){try{const i=this.getInstance();return i.initialize(),i.initialized?i.createNotification(e,n,r):null}catch(i){return console.error("[NotificationManager] show failed",i),null}}static removeNotification(e){this.getInstance().removeNotification(e.element);}show(e,n="info"){b.show(e,n);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 2147483647","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(ee.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(e){console.error("[NotificationManager] initialize failed",e),this.initialized=false;}}destroy(){b.notifications.forEach(e=>{e.timerId&&window.clearTimeout(e.timerId);}),b.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,b.instance=null;}createNotification(e,n,r){try{const i=this.querySelector(".notification-container");if(!i)throw new Error("Notification container not found");const s=Xe[n]??Xe.info,a=document.createElement("div");a.className=`notification-item ${n}`;const o=document.createElement("div");o.className="notification-icon",o.innerHTML=`<span>${s}</span>`,a.appendChild(o);const l=document.createElement("div");l.className="notification-content";const d=document.createElement("div");d.className="notification-type",d.textContent=n.charAt(0).toUpperCase()+n.slice(1),l.appendChild(d);const h=document.createElement("div");if(h.className="notification-message",e.includes("<"))h.innerHTML=e||"No message";else {const u=(e||"No message").split(`
`).map(m=>m.trim()).filter(m=>m.length>0).join("<br>");h.innerHTML=u;}l.appendChild(h),a.appendChild(l);const c=document.createElement("button");c.className="notification-close",c.innerHTML="&times;",c.addEventListener("click",()=>{this.removeNotification(a);}),a.appendChild(c),i.appendChild(a),requestAnimationFrame(()=>{a.classList.add("show");});const p={element:a,timerId:window.setTimeout(()=>{this.removeNotification(a);},r)};return b.notifications.push(p),p}catch(i){return console.error("[NotificationManager] createNotification failed",i),null}}removeNotification(e){if(!e)return;const n=b.notifications.find(r=>r.element===e);n?.timerId&&window.clearTimeout(n.timerId),e.classList.remove("show"),window.setTimeout(()=>{try{e.remove(),b.notifications=b.notifications.filter(r=>r.element!==e);}catch(r){console.error("[NotificationManager] removeNotification cleanup failed",r);}},500);}}const Mt="https://www.nicovideo.jp",Et=`${Mt}/search`,kt=`${Mt}/watch`,Je={searchBase:Et,watchBase:kt},Ri=t=>`${kt}/${t}`,Tt=t=>`${Et}/${encodeURIComponent(t)}`,ve=t=>new Promise((e,n)=>{ki({url:t.url,method:t.method??"GET",headers:t.headers,data:t.data,responseType:t.responseType??"text",timeout:t.timeout,onprogress:t.onprogress,onload:r=>{e({status:r.status,statusText:r.statusText,response:r.response,finalUrl:r.finalUrl,headers:r.responseHeaders});},onerror:r=>{const i=r?.error??"unknown error";n(new Error(`GM_xmlhttpRequest failed: ${i}`));},ontimeout:()=>{n(new Error("GM_xmlhttpRequest timeout"));}});}),fe=F("dAnime:NicoApiFetcher");class K{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(e){try{const n=this.sanitizeVideoId(e),i=(await ve({method:"GET",url:Ri(n),headers:{Accept:"text/html"}})).response,o=new DOMParser().parseFromString(i,"text/html").querySelector('meta[name="server-response"]');if(!o)throw new Error("API data element not found in response");const l=o.getAttribute("content");if(!l)throw new Error("API data content is empty");const d=this.decodeServerResponse(l),c=JSON.parse(d).data?.response;if(!c)throw new Error("Invalid API data structure");return this.apiData=c,c}catch(n){throw fe.error("NicoApiFetcher.fetchApiData",n),n}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const e=this.apiData.comment?.nvComment;if(!e?.server||!e.params||!e.threadKey)throw new Error("Required comment server data is missing");const n=await ve({method:"POST",url:`${e.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:e.params,threadKey:e.threadKey,additionals:{}})}),s=(JSON.parse(n.response).data?.threads??[]).filter(o=>o.fork==="main").sort((o,l)=>(l.commentCount||0)-(o.commentCount||0))[0];if(!s)throw new Error("Main thread not found in comment response");const a=(s.comments??[]).map(o=>({text:o.body??"",vposMs:o.vposMs??0,commands:o.commands??[]}));return this.comments=a,a}catch(e){throw fe.error("NicoApiFetcher.fetchComments",e),e}}async fetchAllData(e){return await this.fetchApiData(e),this.fetchComments()}sanitizeVideoId(e){try{let n=encodeURIComponent(e);return n=n.replace(/%([0-9A-F]{2})/gi,(r,i)=>{const s=parseInt(i,16);return s>=65&&s<=90||s>=97&&s<=122||s>=48&&s<=57||s===45||s===95||s===46||s===126?String.fromCharCode(s):r}),n}catch(n){return fe.error("NicoApiFetcher.sanitizeVideoId",n,{videoId:e}),e}}decodeServerResponse(e){try{return decodeURIComponent(e)}catch(n){try{const r=e.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(r)}catch{throw new Error(`API data decode failed: ${n.message}`)}}}}const Ze=F("dAnime:NicoVideoSearcher"),Di="dアニメストア ニコニコ支店";class R{cache=new Map;static isOfficialVideo(e,n){const r=e.owner?.nickname??e.owner?.name??e.channel?.name??"";return !!(r===Di||r===n||r.startsWith(n+" "))}static filterOfficialVideos(e,n){return e.filter(r=>R.isOfficialVideo(r,n))}async search(e){if(!e.trim())return [];if(this.cache.has(e))return this.cache.get(e)??[];const n=Tt(e),r=await this.fetchText(n),i=this.parseServerContext(r).map(o=>{const l=this.calculateLevenshteinDistance(e,o.title),d=Math.max(e.length,o.title.length),h=d>0?(1-l/d)*100:0;return {...o,levenshteinDistance:l,similarity:h}}),s=[],a=new Set;for(const o of i)o?.videoId&&(a.has(o.videoId)||(a.add(o.videoId),s.push(o)));return s.sort((o,l)=>{if(o.commentCount!==l.commentCount)return l.commentCount-o.commentCount;const d=o.similarity??-1,h=l.similarity??-1;return d!==h?h-d:l.viewCount-o.viewCount}),this.cache.set(e,s),s}async fetchText(e){return (await ve({method:"GET",url:e})).response}parseServerContext(e){try{const r=new DOMParser().parseFromString(e,"text/html").querySelector('meta[name="server-response"]');if(!r)return [];const i=r.getAttribute("content")??"",s=this.decodeHtmlEntities(i);let a;try{a=JSON.parse(s);}catch(o){return Ze.error("NicoVideoSearcher.parseServerContext",o),[]}return this.extractVideoItems(a??{})}catch(n){return Ze.error("NicoVideoSearcher.parseServerContext",n),[]}}decodeHtmlEntities(e){if(!e)return "";let n=e.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return n=n.replace(/&#(\d+);/g,(r,i)=>String.fromCharCode(parseInt(i,10))),n=n.replace(/&#x([0-9a-fA-F]+);/g,(r,i)=>String.fromCharCode(parseInt(i,16))),n}extractVideoItems(e){const n=[],r=s=>{const a=(s?.id??s?.contentId??s?.watchId??"").toString();if(!a)return;const o=(s?.title??s?.shortTitle??"").toString(),l=s?.count??{},d=Number(l.view??s?.viewCounter??0)||0,h=Number(l.comment??s?.commentCounter??0)||0,c=Number(l.mylist??s?.mylistCounter??0)||0,p=s?.thumbnail??{},u=(p.nHdUrl||p.listingUrl||p.largeUrl||p.middleUrl||p.url||s?.thumbnailUrl||"").toString(),m=(s?.registeredAt||s?.startTime||s?.postedDateTime||"")?.toString?.()??"",y=s?.owner&&typeof s.owner=="object"?{nickname:(s.owner.nickname??s.owner.name??"")||void 0,name:(s.owner.name??s.owner.nickname??"")||void 0}:null,v=(s?.isChannelVideo||s?.owner?.ownerType==="channel")&&s?.owner?{name:s.owner.name??""}:null;o&&n.push({videoId:a,title:o,viewCount:d,commentCount:h,mylistCount:c,thumbnail:u,postedAt:m,owner:y,channel:v});},i=s=>{if(!s)return;if(Array.isArray(s)){s.forEach(i);return}if(typeof s!="object"||s===null)return;const a=s;(a.id||a.contentId||a.watchId)&&r(a),Object.values(s).forEach(i);};return i(e),n}calculateLevenshteinDistance(e,n){const r=e?e.length:0,i=n?n.length:0;if(r===0)return i;if(i===0)return r;const s=new Array(i+1);for(let o=0;o<=i;++o){const l=s[o]=new Array(r+1);l[0]=o;}const a=s[0];for(let o=1;o<=r;++o)a[o]=o;for(let o=1;o<=i;++o)for(let l=1;l<=r;++l){const d=e[l-1]===n[o-1]?0:1;s[o][l]=Math.min(s[o-1][l]+1,s[o][l-1]+1,s[o-1][l-1]+d);}return s[i][r]}}const E={mypageHeaderTitle:".p-mypageHeader__title",mypageListContainer:".p-mypageMain",watchVideoElement:"video#video",mypageItem:".itemModule.list",mypageItemTitle:".line1",mypageEpisodeNumber:".number.line1 span",mypageEpisodeTitle:".episode.line1 span",watchPageAnimeTitle:".backInfoTxt1",watchPageEpisodeNumber:".backInfoTxt2",watchPageEpisodeTitle:".backInfoTxt3"};class Ae{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(e){this.delay=e;}getFuncId(e){return this.funcIds.has(e)||this.funcIds.set(e,this.nextId++),this.funcIds.get(e)??0}exec(e){const n=this.getFuncId(e),r=Date.now(),i=this.timers.get(n)?.lastExec??0,s=r-i;if(s>this.delay)e(),this.timers.set(n,{lastExec:r});else {clearTimeout(this.timers.get(n)?.timerId??void 0);const a=setTimeout(()=>{e(),this.timers.set(n,{lastExec:Date.now()});},this.delay-s);this.timers.set(n,{timerId:a,lastExec:i});}}execOnce(e){const n=this.getFuncId(e),r=this.timers.get(n);if(r?.executedOnce){r.timerId&&clearTimeout(r.timerId);return}r?.timerId&&clearTimeout(r.timerId);const i=setTimeout(()=>{try{e();}finally{this.timers.set(n,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(n,{timerId:i,executedOnce:false,scheduled:true});}cancel(e){const n=this.getFuncId(e),r=this.timers.get(n);r?.timerId&&clearTimeout(r.timerId),this.timers.delete(n);}resetExecution(e){const n=this.getFuncId(e),r=this.timers.get(n);r&&(r.timerId&&clearTimeout(r.timerId),this.timers.set(n,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,e]of this.timers)e.timerId&&clearTimeout(e.timerId);this.timers.clear(),this.funcIds.clear();}}const P=F("dAnime:VideoEventLogger");class Vt{constructor(e=""){this.prefix=e;}video=null;lastCurrentTime=0;eventListeners=new Map;isEnabled=true;TRACKED_EVENTS=["loadstart","loadedmetadata","loadeddata","canplay","canplaythrough","play","playing","pause","seeking","seeked","timeupdate","ended","emptied","stalled","suspend","waiting","error","abort"];enable(){this.isEnabled=true,P.info(`${this.prefix}:enabled`);}disable(){this.isEnabled=false,P.info(`${this.prefix}:disabled`);}attach(e){this.detach(),this.video=e,this.lastCurrentTime=e.currentTime,P.info(`${this.prefix}:attach`,{src:this.getVideoSource(e),duration:e.duration,currentTime:e.currentTime,readyState:e.readyState}),this.TRACKED_EVENTS.forEach(n=>{const r=()=>{this.handleEvent(n);};this.eventListeners.set(n,r),e.addEventListener(n,r);}),this.setupCurrentTimeWatcher();}detach(){this.video&&(this.eventListeners.forEach((e,n)=>{this.video?.removeEventListener(n,e);}),this.eventListeners.clear(),P.info(`${this.prefix}:detach`,{src:this.getVideoSource(this.video),finalTime:this.video.currentTime}),this.video=null);}handleEvent(e){if(!this.isEnabled||!this.video)return;const n=this.video,r={event:e,currentTime:n.currentTime,duration:n.duration,readyState:n.readyState,paused:n.paused,ended:n.ended,src:this.getVideoSource(n),networkState:n.networkState,timestamp:Date.now()},i=Math.abs(n.currentTime-this.lastCurrentTime);if(e==="timeupdate"){i>.1&&(this.lastCurrentTime=n.currentTime);return}switch(i>.1?(P.info(`${this.prefix}:event:${e}`,{...r,timeDiff:i.toFixed(2),direction:n.currentTime>this.lastCurrentTime?"forward":"backward"}),this.lastCurrentTime=n.currentTime):P.debug(`${this.prefix}:event:${e}`,r),e){case "error":P.error(`${this.prefix}:videoError`,new Error("Video error detected"),{errorCode:n.error?.code??null,errorMessage:n.error?.message??null,...r});break;case "ended":P.warn(`${this.prefix}:videoEnded`,{...r,message:"動画再生が終了しました"});break;case "emptied":P.warn(`${this.prefix}:videoEmptied`,{...r,message:"動画要素が空になりました（src変更の可能性）"});break;case "seeking":P.warn(`${this.prefix}:seeking`,{...r,from:this.lastCurrentTime,to:n.currentTime,diff:(n.currentTime-this.lastCurrentTime).toFixed(2)});break}}setupCurrentTimeWatcher(){if(!Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,"currentTime")?.set){P.warn(`${this.prefix}:currentTimeWatcher:unsupported`);return}P.debug(`${this.prefix}:currentTimeWatcher:setup`);}logManualSeek(e,n,r){this.isEnabled&&P.warn(`${this.prefix}:manualSeek`,{from:e.toFixed(2),to:n.toFixed(2),diff:(n-e).toFixed(2),reason:r,stackTrace:new Error().stack});}getVideoSource(e){const n=typeof e.currentSrc=="string"?e.currentSrc:"";if(n.length>0)return n.length>100?`${n.slice(0,100)}...`:n;const r=e.getAttribute("src")??"";return r.length>0?r.length>100?`${r.slice(0,100)}...`:r:null}}let be=null;function Qe(){return be||(be=new Vt("global")),be}const Hi=1e3,Ni=100,zi=30,et=1e4,tt=100,Oi=/watch\/(?:([a-z]{2}))?(\d+)/gi,x=F("dAnime:VideoSwitchHandler"),nt=t=>{if(!t?.video)return null;const e=t.video.registeredAt,n=e?new Date(e).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:t.video.id,title:t.video.title,viewCount:t.video.count?.view,mylistCount:t.video.count?.mylist,commentCount:t.video.count?.comment,postedAt:n,thumbnail:t.video.thumbnail?.url,owner:t.owner??null,channel:t.channel??null}},$i=t=>{const e=[];let n;for(;(n=Oi.exec(t))!==null;){const[,r="",i=""]=n;i&&e.push(`${r}${i}`);}return e};class xe{constructor(e,n,r,i=Hi,s=Ni){this.renderer=e,this.fetcher=n,this.settingsManager=r,this.monitorInterval=i,this.debounce=new Ae(s),this.videoEventLogger=new Vt("VideoSwitchHandler");}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=false;debounce;videoEventLogger;resetVideoSource(){x.info("videoSwitch:resetVideoSource",{previousSource:this.lastVideoSource,previousLastPreloadedCount:this.lastPreloadedComments?.length??0,previousPreloadedCount:this.preloadedComments?.length??0,previousNextVideoId:this.nextVideoId}),this.lastVideoSource=null,this.lastPreloadedComments=null,this.preloadedComments=null,this.nextVideoId=null;}updateRenderer(e){x.info("videoSwitch:updateRenderer",{oldRendererExists:!!this.renderer,newRendererExists:!!e}),this.renderer=e;}startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(e){if(this.isSwitching){x.warn("videoSwitch:alreadySwitching",{timestamp:Date.now()});return}this.isSwitching=true;try{x.warn("videoSwitch:entry",{videoElementProvided:!!e,currentRendererComments:this.renderer.getCommentsSnapshot().length,lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId,lastVideoSource:this.lastVideoSource,rendererVideoElement:this.renderer.getVideoElement()?"attached":"detached",rendererVideoSrc:this.renderer.getCurrentVideoSource(),sampleCurrentComments:this.renderer.getCommentsSnapshot().slice(0,3).map(h=>({text:h.text?.substring(0,30),vposMs:h.vposMs}))});const n=await this.resolveVideoElement(e)??null,r=this.preloadedComments??this.lastPreloadedComments??null,i=n?.dataset?.videoId??n?.getAttribute?.("data-video-id")??null,s=this.nextVideoId??i??this.lastVideoId;if(x.warn("videoSwitch:videoIdResolution",{videoId:s??null,nextVideoId:this.nextVideoId,elementId:i,lastVideoId:this.lastVideoId,hasBackupPreloaded:!!r,backupPreloadedCount:r?.length??0}),!n||!s&&!r){x.warn("videoSwitch:earlyReturn",{reason:n?"no videoId and no backup":"no video element",hasVideoElement:!!n,hasVideoId:!!s,hasBackupPreloaded:!!r}),this.handleMissingVideoInfo(r);return}x.warn("videoSwitch:start",{videoId:s??null,elementVideoId:n.dataset?.videoId??null,preloadedCount:r?.length??0,currentTime:n.currentTime,duration:n.duration,readyState:n.readyState,currentSrc:n.currentSrc,lastVideoSource:this.lastVideoSource}),b.show("動画の切り替わりを検知しました...","info"),this.videoEventLogger.attach(n),this.resetRendererState(n);const a=this.renderer.getVideoElement();if(a!==n&&n)x.debug("videoSwitch:rebind",{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof n.currentSrc=="string"&&n.currentSrc.length>0?n.currentSrc:n.getAttribute("src")??null}),this.renderer.initialize(n);else if(a===n&&n&&this.hasVideoSourceChanged(n))x.debug("videoSwitch:rebind:sameElement",{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(n)}),this.renderer.clearComments(),this.renderer.destroy(),this.renderer.initialize(n);else if(!a&&!n){x.warn("videoSwitch:missingVideoElement",{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let o=null;s&&(o=await this.fetchVideoApiData(s,r),o&&(this.persistVideoMetadata(o),this.lastVideoId=s));const l=await this.populateComments(s,r);l===0?(this.renderer.clearComments(),b.show("コメントを取得できませんでした","warning"),x.warn("videoSwitch:commentsMissing",{videoId:s??null})):x.warn("videoSwitch:commentsLoaded",{videoId:s??null,count:l}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(n);const d=this.renderer.getCommentsSnapshot();if(x.warn("videoSwitch:complete",{videoId:s??null,finalTime:n.currentTime,loadedCount:l,finalCommentsCount:d.length,rendererVideoSrc:this.renderer.getCurrentVideoSource(),sampleFinalComments:d.slice(0,5).map(h=>({text:h.text?.substring(0,30),vposMs:h.vposMs,vposSec:(h.vposMs/1e3).toFixed(2)}))}),o){const h=nt(o);if(h){const c=`コメントソースを更新しました: ${h.title??"不明なタイトル"}（${l}件）`;b.show(c,l>0?"success":"warning");}}}catch(n){x.error("videoSwitch:error",n,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),b.show(`動画切り替えエラー: ${n.message}`,"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}async resolveVideoElement(e){if(e){const i=this.getVideoSource(e),s=this.lastVideoSource;return (!i||i===s)&&await this.waitForSourceChange(e),e}const n=Date.now()+et;let r=null;for(;Date.now()<n;){const i=document.querySelector(E.watchVideoElement);if(i){r=i;const s=this.hasVideoSourceChanged(i);if(i.readyState>=2||!i.paused||s)return s&&(this.lastVideoSource=null),i}await new Promise(s=>window.setTimeout(s,tt));}return r}async waitForSourceChange(e){const n=this.getVideoSource(e);if(!n)return;const r=Date.now()+et;for(;Date.now()<r;){const i=this.getVideoSource(e);if(i&&i!==n){this.lastVideoSource=null;return}await new Promise(s=>window.setTimeout(s,tt));}}hasVideoSourceChanged(e){const n=this.getVideoSource(e);return n?this.lastVideoSource?this.lastVideoSource!==n:true:false}getVideoSource(e){if(!e)return null;const n=typeof e.currentSrc=="string"?e.currentSrc:"";if(n.length>0)return n;const r=e.getAttribute("src")??"";if(r.length>0)return r;const i=e.querySelector("source[src]");return i&&typeof i.src=="string"&&i.src.length>0?i.src:null}resetRendererState(e){const n=e.currentTime,r=this.getVideoSource(e),i=this.lastVideoSource!==r,s=this.renderer.getCommentsSnapshot().length;if(x.warn("videoSwitch:resetRendererState:before",{currentTime:n,duration:e.duration,src:r,lastSrc:this.lastVideoSource??null,sourceChanged:i,readyState:e.readyState,paused:e.paused,commentsCount:s}),i)try{this.videoEventLogger.logManualSeek(n,0,"resetRendererState: video source changed"),e.currentTime=0,x.warn("videoSwitch:resetRendererState:seeked",{currentTime:e.currentTime,timeDiff:e.currentTime-n});}catch(a){x.debug("videoSwitch:resetCurrentTimeFailed",a);}else x.warn("videoSwitch:resetRendererState:skipSeek",{reason:"same video source, skipping currentTime reset",currentTime:n,willClearComments:true});x.warn("videoSwitch:resetRendererState:clearingComments",{commentsBeforeClear:s,sourceChanged:i,currentVideoSrc:this.renderer.getCurrentVideoSource()}),this.renderer.clearComments(),x.warn("videoSwitch:resetRendererState:commentsCleared",{commentsAfterClear:this.renderer.getCommentsSnapshot().length,rendererVideoSrc:this.renderer.getCurrentVideoSource()});}async checkVideoEnd(){const e=this.renderer.getVideoElement();if(!(!e||!Number.isFinite(e.duration)||e.duration-e.currentTime>zi)){if(!this.nextVideoId){const r=async()=>{await this.findNextVideoId();};this.debounce.execOnce(r);}if(this.nextVideoId&&!this.preloadedComments){const r=async()=>{await this.preloadComments();};this.debounce.execOnce(r);}}}handleMissingVideoInfo(e){x.warn("videoSwitch:handleMissingVideoInfo",{hasBackupPreloaded:!!e,backupPreloadedCount:e?.length??0,hasLastPreloadedComments:!!this.lastPreloadedComments,lastPreloadedCount:this.lastPreloadedComments?.length??0,willClearComments:!e&&!this.lastPreloadedComments}),!e&&!this.lastPreloadedComments?(x.warn("videoSwitch:clearingCommentsInMissingInfo",{currentCommentCount:this.renderer.getCommentsSnapshot().length}),this.renderer.clearComments(),b.show("次の動画のコメントを取得できませんでした。コメント表示をクリアします。","warning")):x.info("videoSwitch:preservingComments",{reason:"backup or last preloaded comments available",currentCommentCount:this.renderer.getCommentsSnapshot().length});}async fetchVideoApiData(e,n){try{const r=await this.fetcher.fetchApiData(e);return x.debug("videoSwitch:apiFetched",{videoId:e}),r}catch(r){if(x.error("videoSwitch:apiFetchError",r,{videoId:e}),!n)throw r;return null}}persistVideoMetadata(e){const n=nt(e);n&&this.settingsManager.saveVideoData(n.title??"",n);}async populateComments(e,n){let r=null;if(x.warn("videoSwitch:populateComments:start",{videoId:e,backupPreloadedCount:n?.length??0,hasBackupPreloaded:!!n}),Array.isArray(n)&&n.length>0)r=n,x.warn("videoSwitch:populateComments:usingBackup",{count:r.length});else if(e)try{x.warn("videoSwitch:populateComments:fetching",{videoId:e}),r=await this.fetcher.fetchAllData(e),x.warn("videoSwitch:commentsFetched",{videoId:e,count:r.length});}catch(s){x.error("videoSwitch:commentsFetchError",s,{videoId:e}),b.show(`コメント取得エラー: ${s.message}`,"error"),r=null;}if(!r||r.length===0)return x.warn("videoSwitch:populateComments:noComments"),0;const i=r.filter(s=>!this.renderer.isNGComment(s.text));return x.warn("videoSwitch:populateComments:addingToRenderer",{filteredCount:i.length,totalCount:r.length,rendererCommentsBeforeAdd:this.renderer.getCommentsSnapshot().length,rendererVideoElement:this.renderer.getVideoElement()?"attached":"detached",rendererVideoSrc:this.renderer.getCurrentVideoSource()}),i.forEach((s,a)=>{this.renderer.addComment(s.text,s.vposMs,s.commands),a<3&&x.warn(`videoSwitch:populateComments:addedComment[${a}]`,{text:s.text.substring(0,30),vposMs:s.vposMs,vposSec:(s.vposMs/1e3).toFixed(2),commands:s.commands});}),x.warn("videoSwitch:populateComments:complete",{addedCount:i.length,rendererCommentsAfterAdd:this.renderer.getCommentsSnapshot().length,rendererVideoSrcAfterAdd:this.renderer.getCurrentVideoSource(),sampleComments:this.renderer.getCommentsSnapshot().slice(0,3).map(s=>({text:s.text?.substring(0,30),vposMs:s.vposMs}))}),this.lastPreloadedComments=[...i],i.length}async findNextVideoId(){try{const e=this.fetcher.lastApiData;if(!e)return;const n=e.series?.video?.next?.id;if(n){this.nextVideoId=n,x.debug("videoSwitch:detectedNext",{videoId:n});return}const r=e.video?.description??"";if(!r)return;const i=$i(r);if(i.length===0)return;const s=[...i].sort((a,o)=>{const l=parseInt(a.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(o.replace(/^[a-z]{2}/i,""),10)||0)-l});this.nextVideoId=s[0]??null,this.nextVideoId&&x.debug("videoSwitch:candidateFromDescription",{candidate:this.nextVideoId});}catch(e){x.error("videoSwitch:nextIdError",e,{lastVideoId:this.lastVideoId});}}async preloadComments(){if(this.nextVideoId)try{const n=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(r=>!this.renderer.isNGComment(r.text));this.preloadedComments=n.length>0?n:null,x.debug("videoSwitch:preloaded",{videoId:this.nextVideoId,count:n.length});}catch(e){x.error("videoSwitch:preloadError",e,{videoId:this.nextVideoId}),this.preloadedComments=null;}}}const Wi=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class _t{static initialize(){Ei(Wi);}}var qi="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z",Bi="M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z",Ui="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",Gi="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z",Ki="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z",ji="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z",Yi="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",Xi="M5,4V7H10.5V19H13.5V7H19V4H5Z",Ji="M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z",Zi="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",Qi="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",es="M8,5.14V19.14L19,12.14L8,5.14Z",ts="M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z",ns="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z",rs="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z";function I(t,e=24){const n=String(e),r=String(e);return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${t}"></path></svg>`}const rt=I(es),is=I(Ui),ss=I(Qi),se=I(Zi),ae=I(Gi),as=I(Ji),it=I(Xi),we=I(qi),Se=I(Yi),Ce=I(ji),os=I(ts),ls=I(Bi),cs=I(Ki),ds=I(ns),hs=I(rs),X=F("dAnime:SettingsUI"),f={searchInput:"#searchInput",searchAnimeTitle:"#searchAnimeTitle",searchEpisodeNumber:"#searchEpisodeNumber",searchEpisodeTitle:"#searchEpisodeTitle",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",opacitySlider:"#commentOpacity",opacityValue:"#opacityValue",visibilityToggle:"#commentVisibilityToggle",autoSearchToggle:"#autoSearchToggle",autoSearchOptionRow:"#autoSearchOptionRow",fixedPlaybackToggle:"#fixedPlaybackToggle",playbackOptionRow:"#playbackOptionRow",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",colorHexInput:"#colorHexInput",colorPickerInput:"#colorPickerInput",previewComment:"#previewComment",previewHiddenMsg:"#previewHiddenMsg",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",settingsModal:"#settingsModal",closeSettingsModal:"#closeSettingsModal",modalOverlay:".settings-modal__overlay",modalTabs:".settings-modal__tab",modalPane:".settings-modal__pane",searchSectionNote:"#searchSectionNote"},J=["search","display","ng"],st=`
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
`,ps=`
  .search-fields {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }
  .search-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .search-field-row {
    display: flex;
    gap: 12px;
  }
  .search-field--half {
    flex: 1;
  }
  .search-field__label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
  }
  .search-field__input {
    padding: 10px 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 14px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .search-field__input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.2);
  }
  .search-field__input::placeholder {
    color: var(--text-muted);
  }
  .search-safeguard-note {
    margin: 12px 0;
    padding: 10px 12px;
    background: rgba(44, 182, 125, 0.15);
    border: 1px solid rgba(44, 182, 125, 0.3);
    border-radius: 8px;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.5;
  }
  .search-safeguard-note strong {
    color: #2CB67D;
  }
`;class ce extends Pe{static FAB_HOST_ID="danime-settings-fab-host";settingsManager;fetcher;searcher;settings;playbackSettings;currentVideoInfo;hostElement=null;activeTab="search";modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;handleFabClick=e=>{e.preventDefault(),this.openSettingsModal();};handleOverlayClick=()=>{this.closeSettingsModal();};handleCloseClick=()=>{this.closeSettingsModal();};handlePlaybackSettingsChanged;constructor(e,n=new K,r=new R){super(),this.settingsManager=e,this.fetcher=n,this.searcher=r,this.settings=this.settingsManager.getSettings(),this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData(),this.handlePlaybackSettingsChanged=i=>{this.playbackSettings=i,this.applyPlaybackSettingsToUI();},this.settingsManager.addPlaybackObserver(this.handlePlaybackSettingsChanged);}insertIntoMypage(){const e=document.querySelector(E.mypageHeaderTitle);e&&(this.hostElement=this.createSettingsUI(),e.parentElement?.insertBefore(this.hostElement,e.nextSibling));}addAutoCommentButtons(){document.querySelectorAll(E.mypageItem).forEach(n=>{if(n.dataset.autoFillEnabled==="true")return;const r=n.querySelector(E.mypageItemTitle),i=n.querySelector(E.mypageEpisodeNumber),s=n.querySelector(E.mypageEpisodeTitle);if(!r||!s)return;const a=r.textContent?.trim()??"",o=i?.textContent?.trim()??"",l=s.textContent?.trim()??"";if(!a)return;const d=document.createElement("div");d.style.marginTop="8px",d.style.display="block";const h=d.attachShadow({mode:"open"}),c=document.createElement("style");c.textContent=ee.getAutoButtonStyles(),h.appendChild(c);const p=document.createElement("button");p.className="auto-comment-button",p.title="検索フォームにタイトル・話数・エピソードタイトルを入力",p.setAttribute("aria-label","検索フォームにタイトル・話数・エピソードタイトルを入力"),p.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,14H16L18,16V18H20V16L18,14V12H14M10,10H4V12H10M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H11.35C11.14,19.37 11,18.7 11,18A7,7 0 0,1 18,11C19.1,11 20.12,11.29 21,11.78V6M4,6H9.17L11.17,8H20V10H18V10.5C16.55,10.16 15,10.64 14,11.5V10H4M12,14H4V16H11.35C11.63,15.28 12.08,14.63 12.64,14.08L12,14Z" />
        </svg>
        <span style="margin-left: 6px; font-size: 12px; font-weight: 500;">フォーム入力</span>
      `,p.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation(),this.openSettingsModal(false),this.queryModalElement(`${f.modalTabs}[data-tab="search"]`)?.click();const v=this.queryModalElement(f.searchAnimeTitle),w=this.queryModalElement(f.searchEpisodeNumber),S=this.queryModalElement(f.searchEpisodeTitle);v&&(v.value=a),w&&o&&(w.value=o),S&&l&&(S.value=l),v?.focus({preventScroll:true});const T=[a];o&&T.push(o),l&&T.push(l),b.show(`「${T.join(" ")}」を検索フォームに入力しました`,"success");}),h.appendChild(p);const u=s.parentElement;if(u){const m=u.querySelector(".iconContainer");m?u.insertBefore(d,m):u.appendChild(d);}n.dataset.autoFillEnabled="true";});}async waitMypageListStable(){}tryRestoreByDanimeIds(){return  false}createSettingsUI(){const e=document.createElement("div");e.className="nico-comment-shadow-host settings-host",this.createShadowDOM(e),this.addStyles(ee.getCommonStyles());const n=this.buildSettingsHtml();return this.setHTML(n),this.applySettingsToUI(),this.addStyles(st),this.setupEventListeners(),e}buildSettingsHtml(){const e=a=>typeof a=="number"?a.toLocaleString():"-",n=a=>{if(!a)return "-";try{return new Date(a).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return a}},r=this.currentVideoInfo,i=r?.thumbnail??"",s=!!r?.videoId;return `
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="バージョン">${Mi}</span>
        </h2>

        <!-- Cinematic Glass Card -->
        <div class="video-card${s?"":" video-card--empty"}">
          <!-- 背景ブラー効果 -->
          <div
            class="video-card__ambient"
            id="currentVideoAmbient"
            style="background-image: url('${i}');"
          ></div>
          <div class="video-card__gradient"></div>

          <div class="video-card__body">
            <!-- サムネイル -->
            <div class="video-card__thumbnail">
              <img id="currentThumbnail" src="${i}" alt="サムネイル">
            </div>

            <!-- 情報セクション -->
            <div class="video-card__info">
              <!-- 上部: ID & 日付 -->
              <div class="video-card__meta-row">
                <div class="video-card__id" title="動画ID">
                  <span class="video-card__id-icon" aria-hidden="true">${as}</span>
                  <span class="sr-only">動画ID</span>
                  <span id="currentVideoId">${r?.videoId??"未設定"}</span>
                </div>
                <div class="video-card__date" title="投稿日">
                  <span class="video-card__date-icon" aria-hidden="true">${ls}</span>
                  <span class="sr-only">投稿日</span>
                  <span id="currentPostedAt">${n(r?.postedAt)}</span>
                </div>
              </div>

              <!-- 中央: タイトル & 投稿者 -->
              <div class="video-card__main">
                <h3 class="video-card__title" id="currentTitle">${r?.title??"オーバーレイする動画が未設定です"}</h3>
                <div class="video-card__owner" title="投稿者">
                  <span class="video-card__owner-icon" aria-hidden="true">${we}</span>
                  <span class="sr-only">投稿者</span>
                  <span id="currentOwner">${r?.owner?.nickname??r?.channel?.name??"-"}</span>
                </div>
              </div>

              <!-- 下部: 統計情報 -->
              <div class="video-card__stats">
                <div class="video-card__stat" title="再生数">
                  <span class="video-card__stat-icon" aria-hidden="true">${Se}</span>
                  <span class="sr-only">再生数</span>
                  <span class="video-card__stat-value" id="currentViewCount">${e(r?.viewCount)}</span>
                </div>
                <div class="video-card__stat" title="コメント数">
                  <span class="video-card__stat-icon" aria-hidden="true">${Ce}</span>
                  <span class="sr-only">コメント数</span>
                  <span class="video-card__stat-value" id="currentCommentCount">${e(r?.commentCount)}</span>
                </div>
                <div class="video-card__stat" title="マイリスト数">
                  <span class="video-card__stat-icon" aria-hidden="true">${os}</span>
                  <span class="sr-only">マイリスト数</span>
                  <span class="video-card__stat-value" id="currentMylistCount">${e(r?.mylistCount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}buildModalHtml(){const e=["#FFFFFF","#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF"].map(n=>`<button class="color-preset-btn" data-color="${n}" style="background-color: ${n}"></button>`).join("");return `
      <div id="settingsModal" class="settings-modal hidden" role="dialog" aria-modal="true" aria-labelledby="settingsModalTitle" aria-hidden="true">
        <div class="settings-modal__overlay"></div>
        <div class="settings-modal__content">
          <header class="settings-modal__header">
            <h3 id="settingsModalTitle">設定</h3>
            <button id="closeSettingsModal" class="settings-modal__close" type="button" aria-label="設定を閉じる">
              <span aria-hidden="true">${is}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${ae}</span>
              <span class="settings-modal__tab-label">検索</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="display" role="tab" aria-selected="false" aria-controls="settingsPaneDisplay" id="settingsTabDisplay" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${ss}</span>
              <span class="settings-modal__tab-label">表示</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${se}</span>
              <span class="settings-modal__tab-label">NG</span>
            </button>
          </div>
          <div class="settings-modal__panes">
            <section class="settings-modal__pane is-active" data-pane="search" role="tabpanel" id="settingsPaneSearch" aria-labelledby="settingsTabSearch">
              <div class="setting-group search-section">
                <h3>コメントをオーバーレイする動画を検索</h3>
                <p id="searchSectionNote" class="search-section__note" style="background: ${this.settings.autoSearchEnabled?"#7F5AF0":"#2CB67D"}; color: #FFFFFE; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
                  ${this.settings.autoSearchEnabled?`ℹ️ <strong>自動設定機能が有効です</strong><br>
                  視聴ページを開くと、アニメタイトル・話数・エピソードタイトルから自動的にコメント数が最も多いニコニコ動画を検索して表示します。<br>
                  手動で検索したい場合は、「表示」タブの自動検索を無効にしてから以下のフォームをご利用ください。`:`🔧 <strong>手動設定モード</strong><br>
                  自動検索が無効になっています。以下のフォームから動画を検索して選択してください。<br>
                  自動検索を有効にするには「表示」タブの自動検索を有効にしてください。`}
                </p>
                <div class="search-fields">
                  <div class="search-field">
                    <label for="searchAnimeTitle" class="search-field__label">アニメタイトル</label>
                    <input type="text" id="searchAnimeTitle" class="search-field__input" placeholder="例: 葬送のフリーレン">
                  </div>
                  <div class="search-field-row">
                    <div class="search-field search-field--half">
                      <label for="searchEpisodeNumber" class="search-field__label">話数</label>
                      <input type="text" id="searchEpisodeNumber" class="search-field__input" placeholder="例: 第1話">
                    </div>
                    <div class="search-field search-field--half">
                      <label for="searchEpisodeTitle" class="search-field__label">エピソードタイトル（任意）</label>
                      <input type="text" id="searchEpisodeTitle" class="search-field__input" placeholder="例: 冒険の終わり">
                    </div>
                  </div>
                </div>
                <div class="search-container">
                  <input type="text" id="searchInput" placeholder="または自由入力で検索" style="flex: 1;">
                  <button id="searchButton">検索</button>
                  <button id="openSearchPageDirect" class="open-search-page-direct-btn">検索ページ</button>
                </div>
                <p class="search-safeguard-note">
                  🛡️ <strong>公式動画セーフガード有効</strong>：アニメタイトルを入力すると、投稿者名が「アニメタイトル」「アニメタイトル 第Nクール」「dアニメストア ニコニコ支店」の公式動画のみが優先表示されます。エピソード切替時も公式動画のみが自動選択されます。
                </p>
                <div id="searchResults" class="search-results"></div>
              </div>
            </section>
            <section class="settings-modal__pane" data-pane="display" role="tabpanel" id="settingsPaneDisplay" aria-labelledby="settingsTabDisplay" aria-hidden="true">
              <div class="display-panel">
                <!-- 左カラム: コントロール -->
                <div class="display-panel__controls">
                  <!-- 外観セクション -->
                  <section class="display-section" aria-labelledby="displayAppearanceTitle">
                    <div class="display-section__header">
                      <h4 id="displayAppearanceTitle" class="display-section__title">外観</h4>
                      <button
                        id="commentVisibilityToggle"
                        type="button"
                        class="visibility-badge${this.settings.isCommentVisible?"":" visibility-badge--off"}"
                        aria-pressed="${this.settings.isCommentVisible?"true":"false"}"
                      >
                        <span class="visibility-badge__icon" aria-hidden="true">${this.settings.isCommentVisible?ae:se}</span>
                        <span class="visibility-badge__label">${this.settings.isCommentVisible?"表示中":"非表示"}</span>
                      </button>
                    </div>
                    <div class="display-section__body">
                      <!-- カラープリセット -->
                      <div class="color-row">
                        <div class="color-presets">
                          ${e}
                        </div>
                        <div class="color-divider"></div>
                        <div class="color-custom">
                          <span class="color-custom__hex-label">HEX</span>
                          <input
                            type="text"
                            id="colorHexInput"
                            class="color-custom__hex-input"
                            value="${this.settings.commentColor}"
                            maxlength="7"
                            spellcheck="false"
                          >
                          <input
                            type="color"
                            id="colorPickerInput"
                            class="color-custom__picker"
                            value="${this.settings.commentColor}"
                          >
                        </div>
                      </div>
                      <!-- 透明度スライダー -->
                      <div class="opacity-row">
                        <div class="opacity-row__labels">
                          <span class="opacity-row__label">不透明度</span>
                          <span class="opacity-row__value" id="opacityValue">${Math.round((this.settings.commentOpacity??1)*100)}%</span>
                        </div>
                        <input
                          type="range"
                          id="commentOpacity"
                          class="opacity-slider"
                          min="0.1"
                          max="1"
                          step="0.05"
                          value="${this.settings.commentOpacity??1}"
                        >
                      </div>
                    </div>
                  </section>

                  <!-- 自動検索セクション -->
                  <section class="display-section" aria-labelledby="displayAutoSearchTitle">
                    <h4 id="displayAutoSearchTitle" class="display-section__title">検索</h4>
                    <div
                      class="playback-option${this.settings.autoSearchEnabled?" playback-option--active":""}"
                      id="autoSearchOptionRow"
                      role="button"
                      tabindex="0"
                      aria-pressed="${this.settings.autoSearchEnabled?"true":"false"}"
                    >
                      <div class="playback-option__icon-wrapper${this.settings.autoSearchEnabled?" playback-option__icon-wrapper--active":""}">
                        ${hs}
                      </div>
                      <div class="playback-option__text">
                        <span class="playback-option__title">自動検索</span>
                        <span class="playback-option__desc">視聴ページ表示時に自動でコメントを設定</span>
                      </div>
                      <div class="playback-option__toggle">
                        <input
                          type="checkbox"
                          id="autoSearchToggle"
                          class="playback-option__checkbox"
                          ${this.settings.autoSearchEnabled?"checked":""}
                        >
                        <span class="playback-option__switch"></span>
                      </div>
                    </div>
                  </section>

                  <!-- 再生速度セクション -->
                  <section class="display-section" aria-labelledby="displayPlaybackTitle">
                    <h4 id="displayPlaybackTitle" class="display-section__title">再生</h4>
                    <div
                      class="playback-option${this.playbackSettings.fixedModeEnabled?" playback-option--active":""}"
                      id="playbackOptionRow"
                      role="button"
                      tabindex="0"
                      aria-pressed="${this.playbackSettings.fixedModeEnabled?"true":"false"}"
                    >
                      <div class="playback-option__icon-wrapper${this.playbackSettings.fixedModeEnabled?" playback-option__icon-wrapper--active":""}">
                        ${rt}
                      </div>
                      <div class="playback-option__text">
                        <span class="playback-option__title">1.11倍速モード</span>
                        <span class="playback-option__desc">24分アニメを約21分36秒で視聴</span>
                      </div>
                      <div class="playback-option__toggle">
                        <input
                          type="checkbox"
                          id="fixedPlaybackToggle"
                          class="playback-option__checkbox"
                          ${this.playbackSettings.fixedModeEnabled?"checked":""}
                        >
                        <span class="playback-option__switch"></span>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- 右カラム: ライブプレビュー -->
                <div class="display-panel__preview">
                  <h4 class="display-section__title">プレビュー</h4>
                  <div class="preview-area" id="previewArea">
                    <div class="preview-area__background"></div>
                    <div
                      class="preview-comment"
                      id="previewComment"
                      style="color: ${this.settings.commentColor}; opacity: ${this.settings.commentOpacity??1}; display: ${this.settings.isCommentVisible?"block":"none"};"
                    >
                      設定変更がすぐ反映されますwww
                    </div>
                    <div class="preview-hidden-msg" id="previewHiddenMsg" style="display: ${this.settings.isCommentVisible?"none":"flex"};">
                      ${se}
                      <span>コメント非表示中</span>
                    </div>
                    <span class="preview-area__label">Simulation Mode</span>
                  </div>
                  <p class="preview-note">実際の動画上の見え方をシミュレーションしています</p>
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
            <button id="saveSettings" type="button">設定を保存</button>
          </footer>
        </div>
      </div>
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupColorPresets(),this.setupColorPicker(),this.setupColorHexInput(),this.setupOpacitySlider(),this.setupVisibilityToggle(),this.setupAutoSearchToggle(),this.setupPlaybackToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch();}setupModalControls(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick);const e=this.createOrUpdateFab(),n=this.queryModalElement(f.settingsModal),r=this.queryModalElement(f.closeSettingsModal),i=this.queryModalElement(f.modalOverlay);this.modalElement=n??null,this.closeButtonElement=r??null,this.overlayElement=i??null,!(!n||!r||!i||!e)&&(this.fabElement?.removeEventListener("click",this.handleFabClick),e.addEventListener("click",this.handleFabClick),e.setAttribute("aria-controls",n.id),e.setAttribute("aria-haspopup","dialog"),e.setAttribute("aria-expanded","false"),this.fabElement=e,r.addEventListener("click",this.handleCloseClick),i.addEventListener("click",this.handleOverlayClick),this.shadowRoot?.addEventListener("keydown",s=>{const a=s;a.key==="Escape"&&!this.modalElement?.classList.contains("hidden")&&(a.preventDefault(),this.closeSettingsModal());}),this.applySettingsToUI());}setupModalTabs(){const e=Array.from(this.queryModalSelectorAll(f.modalTabs)),n=Array.from(this.queryModalSelectorAll(f.modalPane));if(e.length===0||n.length===0)return;const r=i=>{e.forEach(s=>{const o=this.toModalTabKey(s.dataset.tab)===i;s.classList.toggle("is-active",o),s.setAttribute("aria-selected",String(o)),s.setAttribute("tabindex",o?"0":"-1");}),n.forEach(s=>{const o=this.toModalTabKey(s.dataset.pane)===i;s.classList.toggle("is-active",o),s.setAttribute("aria-hidden",String(!o));}),this.activeTab=i;};e.forEach(i=>{i.addEventListener("click",()=>{const s=this.toModalTabKey(i.dataset.tab);s&&r(s);}),i.addEventListener("keydown",s=>{const a=s;if(a.key!=="ArrowRight"&&a.key!=="ArrowLeft")return;a.preventDefault();const o=this.toModalTabKey(i.dataset.tab);if(!o)return;const l=a.key==="ArrowRight"?1:-1,d=(J.indexOf(o)+l+J.length)%J.length,h=J[d];r(h),e.find(p=>this.toModalTabKey(p.dataset.tab)===h)?.focus({preventScroll:true});});}),r(this.activeTab);}openSettingsModal(e=true){!this.modalElement||!this.fabElement||(this.modalElement.classList.remove("hidden"),this.modalElement.setAttribute("aria-hidden","false"),this.fabElement.setAttribute("aria-expanded","true"),e&&this.queryModalElement(`${f.modalTabs}.is-active`)?.focus({preventScroll:true}));}closeSettingsModal(){!this.modalElement||!this.fabElement||(this.modalElement.classList.add("hidden"),this.modalElement.setAttribute("aria-hidden","true"),this.fabElement.setAttribute("aria-expanded","false"),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:true}));}toModalTabKey(e){return e&&J.includes(e)?e:null}setupColorPresets(){this.queryModalSelectorAll(".color-preset-btn").forEach(n=>{n.addEventListener("click",()=>{const r=n.dataset.color;r&&(this.settings.commentColor=r,this.updateColorUI(r),this.updatePreview());});});}setupColorPicker(){const e=this.queryModalElement(f.colorPickerInput);e&&e.addEventListener("input",()=>{this.settings.commentColor=e.value,this.updateColorUI(e.value),this.updatePreview();});}setupColorHexInput(){const e=this.queryModalElement(f.colorHexInput);e&&(e.addEventListener("input",()=>{const n=e.value.trim();/^#[0-9A-Fa-f]{6}$/.test(n)&&(this.settings.commentColor=n,this.updateColorUI(n,false),this.updatePreview());}),e.addEventListener("blur",()=>{e.value=this.settings.commentColor;}));}updateColorUI(e,n=true){const r=this.queryModalElement(f.colorPickerInput),i=this.queryModalElement(f.colorHexInput);r&&(r.value=e),i&&n&&(i.value=e);}setupOpacitySlider(){const e=this.queryModalElement(f.opacitySlider),n=this.queryModalElement(f.opacityValue);e&&(e.value=(this.settings.commentOpacity??1).toString(),e.addEventListener("input",()=>{const r=Number(e.value);Number.isNaN(r)||(this.settings.commentOpacity=r,n&&(n.textContent=`${Math.round(r*100)}%`),this.updatePreview());}));}setupVisibilityToggle(){const e=this.queryModalElement(f.visibilityToggle);e&&(e.addEventListener("click",()=>{this.settings.isCommentVisible=!this.settings.isCommentVisible,this.updateVisibilityToggleState(e),this.updatePreview();}),this.updateVisibilityToggleState(e));}setupAutoSearchToggle(){const e=this.queryModalElement(f.autoSearchToggle),n=this.queryModalElement(f.autoSearchOptionRow);if(!e||!n)return;const r=()=>{this.settings.autoSearchEnabled=!this.settings.autoSearchEnabled,this.updateAutoSearchToggleState(),this.updateSearchSectionNote(),this.settingsManager.updateSettings(this.settings),b.show(this.settings.autoSearchEnabled?"自動検索を有効にしました":"自動検索を無効にしました（手動設定モード）","success");};n.addEventListener("click",i=>{i.target.closest(".playback-option__toggle")||r();}),n.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),r());}),e.addEventListener("change",()=>{r();}),this.updateAutoSearchToggleState();}updateAutoSearchToggleState(){const e=this.settings.autoSearchEnabled,n=this.queryModalElement(f.autoSearchToggle),r=this.queryModalElement(f.autoSearchOptionRow),i=r?.querySelector(".playback-option__icon-wrapper");n&&(n.checked=e),r&&(r.classList.toggle("playback-option--active",e),r.setAttribute("aria-pressed",e?"true":"false")),i&&i.classList.toggle("playback-option__icon-wrapper--active",e);}updateSearchSectionNote(){const e=this.queryModalElement(f.searchSectionNote);if(!e)return;const n=this.settings.autoSearchEnabled;e.style.background=n?"#7F5AF0":"#2CB67D",e.innerHTML=n?`ℹ️ <strong>自動設定機能が有効です</strong><br>
        視聴ページを開くと、アニメタイトル・話数・エピソードタイトルから自動的にコメント数が最も多いニコニコ動画を検索して表示します。<br>
        手動で検索したい場合は、「表示」タブの自動検索を無効にしてから以下のフォームをご利用ください。`:`🔧 <strong>手動設定モード</strong><br>
        自動検索が無効になっています。以下のフォームから動画を検索して選択してください。<br>
        自動検索を有効にするには「表示」タブの自動検索を有効にしてください。`;}setupPlaybackToggle(){const e=this.queryModalElement(f.fixedPlaybackToggle),n=this.queryModalElement(f.playbackOptionRow);if(!e||!n)return;const r=()=>{const i=!this.playbackSettings.fixedModeEnabled,s={...this.playbackSettings,fixedModeEnabled:i};if(!this.settingsManager.updatePlaybackSettings(s)){b.show("再生速度の設定変更に失敗しました","error"),this.applyPlaybackSettingsToUI();return}this.playbackSettings=s,this.updatePlaybackToggleState(),b.show(i?`${this.formatPlaybackRateLabel(this.playbackSettings.fixedRate)}固定モードを有効にしました`:"固定再生モードを無効にしました","success");};n.addEventListener("click",i=>{i.target.closest(".playback-option__toggle")||r();}),n.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),r());}),e.addEventListener("change",()=>{r();}),this.updatePlaybackToggleState();}setupNgControls(){const e=this.queryModalElement(f.ngWords);e&&e.classList.remove("hidden");const n=this.queryModalElement(f.ngRegexps);n&&n.classList.remove("hidden");}setupSaveButton(){const e=this.queryModalElement(f.saveButton);e&&e.addEventListener("click",()=>this.saveSettings());}setupSearch(){const e=this.queryModalElement(f.searchInput),n=this.queryModalElement(f.searchAnimeTitle),r=this.queryModalElement(f.searchEpisodeNumber),i=this.queryModalElement(f.searchEpisodeTitle),s=this.queryModalElement(f.searchButton),a=this.queryModalElement(f.openSearchPage),o=this.settingsManager.loadManualSearchSettings();o&&(n&&(n.value=o.animeTitle),r&&(r.value=o.episodeNumber),i&&(i.value=o.episodeTitle));const l=()=>{const p=e?.value.trim()??"";if(p)return p;const u=n?.value.trim()??"",m=r?.value.trim()??"",y=i?.value.trim()??"";return [u,m,y].filter(Boolean).join(" ")},d=()=>{const p=n?.value.trim()??"",u=r?.value.trim()??"",m=i?.value.trim()??"";(p||u)&&this.settingsManager.saveManualSearchSettings({animeTitle:p,episodeNumber:u,episodeTitle:m});},h=async()=>{const p=l();if(!p){b.show("検索キーワードを入力してください","warning");return}d();const u=n?.value.trim()??"";await this.executeSearch(p,u);};s?.addEventListener("click",h);const c=p=>{p.key==="Enter"&&h();};e?.addEventListener("keydown",c),n?.addEventListener("keydown",c),r?.addEventListener("keydown",c),i?.addEventListener("keydown",c),a?.addEventListener("click",p=>{p.preventDefault();const u=l(),m=u?Tt(u):Je.searchBase;Ee().open(m,"_blank","noopener");});}async executeSearch(e,n){try{b.show(`「${e}」を検索中...`,"info");const r=await this.searcher.search(e);let i=r;if(n){const s=R.filterOfficialVideos(r,n);s.length>0?(i=s,X.info("SettingsUI.executeSearch:officialFiltered",{totalResults:r.length,officialResults:s.length,animeTitle:n})):(X.warn("SettingsUI.executeSearch:noOfficialVideos",{totalResults:r.length,animeTitle:n}),b.show("公式動画が見つかりませんでした。全ての検索結果を表示しています。","warning"));}return this.renderSearchResults(i,s=>this.renderSearchResultItem(s)),i.length===0&&b.show("検索結果が見つかりませんでした","warning"),i}catch(r){return X.error("SettingsUI.executeSearch",r),[]}}setSearchKeyword(e){const n=this.queryModalElement(f.searchInput);n&&(n.value=e,n.focus({preventScroll:true}));}renderSearchResults(e,n){const r=this.queryModalElement(f.searchResults);if(!r)return;r.innerHTML=e.map(s=>n(s)).join(""),r.querySelectorAll(".search-result-item").forEach((s,a)=>{s.addEventListener("click",()=>{const l=e[a];this.applySearchResult(l);});const o=s.querySelector(".open-search-page-direct-btn");o&&o.addEventListener("click",l=>{l.stopPropagation();});});}renderSearchResultItem(e){const n=this.formatSearchResultDate(e.postedAt),r=typeof e.similarity=="number"?`
          <div class="similarity-container" title="類似度: ${e.similarity.toFixed(2)}%">
            <div class="similarity-bar" style="width: ${e.similarity.toFixed(2)}%;"></div>
            <span class="similarity-text">${e.similarity.toFixed(0)}%</span>
          </div>
        `:"";return `
      <div class="search-result-item">
        <img src="${e.thumbnail}" alt="thumbnail">
        <div class="search-result-info">
          <div class="title">${e.title}</div>
          <div class="stats">
            <span class="stat-icon" title="再生">
              ${rt}
            </span>
            <span>${e.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="コメント">
              ${cs}
            </span>
            <span>${e.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="マイリスト">
              ${ds}
            </span>
            <span>${e.mylistCount.toLocaleString()}</span>
            ${r}
          </div>
          <div class="date">${n}</div>
          <a href="${Je.watchBase}/${e.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(e){try{const n=await this.fetcher.fetchApiData(e.videoId);await this.fetcher.fetchComments(),b.show(`「${e.title}」のコメントを設定しました`,"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(e,n));}catch(n){X.error("SettingsUI.applySearchResult",n);}}buildVideoMetadata(e,n){return {videoId:e.videoId,title:e.title,viewCount:n.video?.count?.view??e.viewCount,commentCount:n.video?.count?.comment??e.commentCount,mylistCount:n.video?.count?.mylist??e.mylistCount,postedAt:n.video?.registeredAt??e.postedAt,thumbnail:n.video?.thumbnail?.url??e.thumbnail,owner:n.owner??e.owner??void 0,channel:n.channel??e.channel??void 0}}applySettingsToUI(){const e=this.queryModalElement(f.opacitySlider),n=this.queryModalElement(f.opacityValue),r=this.queryModalElement(f.visibilityToggle),i=this.queryModalElement(f.colorPickerInput),s=this.queryModalElement(f.colorHexInput),a=this.queryModalElement(f.ngWords),o=this.queryModalElement(f.ngRegexps);e&&(e.value=(this.settings.commentOpacity??1).toString()),n&&(n.textContent=`${Math.round((this.settings.commentOpacity??1)*100)}%`),r&&this.updateVisibilityToggleState(r),i&&this.settings.commentColor&&(i.value=this.settings.commentColor),s&&this.settings.commentColor&&(s.value=this.settings.commentColor),a&&(a.value=(this.settings.ngWords??[]).join(`
`)),o&&(o.value=(this.settings.ngRegexps??[]).join(`
`)),this.applyPlaybackSettingsToUI(),this.updateAutoSearchToggleState(),this.updateSearchSectionNote(),this.updatePreview();}saveSettings(){const e=this.queryModalElement(f.opacitySlider),n=this.queryModalElement(f.ngWords),r=this.queryModalElement(f.ngRegexps);if(e){const i=Number(e.value);Number.isNaN(i)||(this.settings.commentOpacity=i);}n&&(this.settings.ngWords=n.value.split(`
`).map(i=>i.trim()).filter(Boolean)),r&&(this.settings.ngRegexps=r.value.split(`
`).map(i=>i.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings);}updateCurrentVideoInfo(e){this.currentVideoInfo=e,[["currentTitle",e.title??"-"],["currentVideoId",e.videoId??"-"],["currentOwner",e.owner?.nickname??e.channel?.name??"-"],["currentViewCount",this.formatNumber(e.viewCount)],["currentCommentCount",this.formatNumber(e.commentCount)],["currentMylistCount",this.formatNumber(e.mylistCount)],["currentPostedAt",this.formatSearchResultDate(e.postedAt)]].forEach(([a,o])=>{const l=this.querySelector(f[a]);l&&(l.textContent=o);});const r=this.querySelector(f.currentThumbnail);r&&e.thumbnail&&(r.src=e.thumbnail,r.alt=e.title??"サムネイル");const i=this.querySelector("#currentVideoAmbient");i&&e.thumbnail&&(i.style.backgroundImage=`url('${e.thumbnail}')`);const s=this.querySelector(".video-card");s&&s.classList.toggle("video-card--empty",!e.videoId);try{this.settingsManager.saveVideoData(e.title??"",e);}catch(a){X.error("SettingsUI.updateCurrentVideoInfo",a);}}formatNumber(e){return typeof e=="number"?e.toLocaleString():"-"}formatSearchResultDate(e){if(!e)return "-";const n=new Date(e);return Number.isNaN(n.getTime())?e:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(n)}formatPlaybackRateLabel(e){return `${(Number.isFinite(e)?e:1.11).toFixed(2).replace(/\.?0+$/,"")}倍`}updateVisibilityToggleState(e){const n=this.settings.isCommentVisible;e.classList.toggle("visibility-badge--off",!n),e.setAttribute("aria-pressed",n?"true":"false");const r=e.querySelector(".visibility-badge__icon"),i=e.querySelector(".visibility-badge__label");r&&(r.innerHTML=n?ae:se),i&&(i.textContent=n?"表示中":"非表示");}applyPlaybackSettingsToUI(){this.updatePlaybackToggleState();}updatePlaybackToggleState(){const e=this.playbackSettings.fixedModeEnabled,n=this.queryModalElement(f.fixedPlaybackToggle),r=this.queryModalElement(f.playbackOptionRow),i=r?.querySelector(".playback-option__icon-wrapper");n&&(n.checked=e),r&&(r.classList.toggle("playback-option--active",e),r.setAttribute("aria-pressed",e?"true":"false")),i&&i.classList.toggle("playback-option__icon-wrapper--active",e);}updatePreview(){const e=this.queryModalElement(f.previewComment),n=this.queryModalElement(f.previewHiddenMsg);e&&(e.style.color=this.settings.commentColor,e.style.opacity=String(this.settings.commentOpacity??1),e.style.display=this.settings.isCommentVisible?"block":"none"),n&&(n.style.display=this.settings.isCommentVisible?"none":"flex");}destroy(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),this.settingsManager.removePlaybackObserver(this.handlePlaybackSettingsChanged),super.destroy();}createOrUpdateFab(){if(!document.body)return null;let e=this.fabHostElement;!e||!e.isConnected?(e?.remove(),e=document.createElement("div"),e.id=ce.FAB_HOST_ID,e.style.position="fixed",e.style.bottom="32px",e.style.right="32px",e.style.zIndex="2147483646",e.style.display="inline-block",this.fabShadowRoot=e.attachShadow({mode:"open"}),document.body.appendChild(e),this.fabHostElement=e):this.fabShadowRoot||(this.fabShadowRoot=e.shadowRoot??e.attachShadow({mode:"open"}));const n=this.fabShadowRoot;if(!n)return null;let r=n.querySelector("style[data-role='fab-base-style']");r||(r=document.createElement("style"),r.dataset.role="fab-base-style",r.textContent=ee.getCommonStyles(),n.appendChild(r));let i=n.querySelector("style[data-role='fab-style']");i||(i=document.createElement("style"),i.dataset.role="fab-style",i.textContent=`
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
      `,n.appendChild(i));let s=n.querySelector("style[data-role='similarity-style']");s||(s=document.createElement("style"),s.dataset.role="similarity-style",s.textContent=st,n.appendChild(s));let a=n.querySelector("style[data-role='search-fields-style']");a||(a=document.createElement("style"),a.dataset.role="search-fields-style",a.textContent=ps,n.appendChild(a));let o=n.querySelector(".fab-container");o||(o=document.createElement("div"),o.className="fab-container",n.appendChild(o));let l=o.querySelector("button.fab-button");l||(l=document.createElement("button"),l.type="button",l.className="fab-button",o.appendChild(l)),l.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${ae}</span>
      <span class="fab-button__label">設定</span>
    `,l.setAttribute("aria-label","ニコニココメント設定を開く"),l.setAttribute("aria-haspopup","dialog");let d=o.querySelector(f.settingsModal);return d||(o.insertAdjacentHTML("beforeend",this.buildModalHtml()),d=o.querySelector(f.settingsModal)),this.modalElement=d??null,l}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener("click",this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null;}queryModalElement(e){return this.fabShadowRoot?this.fabShadowRoot.querySelector(e):null}queryModalSelectorAll(e){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}}const us=F("dAnime:PlaybackRateController"),ms=1,gs=200,fs=1e-4;class Me{constructor(e){this.settingsManager=e,this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.settingsObserver=n=>{this.playbackSettings=n,this.applyCurrentMode();},this.settingsManager.addPlaybackObserver(this.settingsObserver);}currentVideo=null;playbackSettings;settingsObserver;isApplying=false;retryTimer=null;handleLoadedMetadata=()=>{this.applyCurrentMode();};handleRateChange=()=>{this.isApplying||this.playbackSettings.fixedModeEnabled&&this.scheduleApply();};handlePlay=()=>{this.applyCurrentMode();};handleEmptied=()=>{this.scheduleApply();};bind(e){if(this.currentVideo===e){this.applyCurrentMode();return}this.detachVideoListeners(),this.cancelScheduledApply(),this.currentVideo=e,this.attachVideoListeners(e),this.applyCurrentMode();}unbind(){this.cancelScheduledApply(),this.detachVideoListeners(),this.currentVideo=null;}dispose(){this.unbind(),this.settingsManager.removePlaybackObserver(this.settingsObserver);}attachVideoListeners(e){e.addEventListener("loadedmetadata",this.handleLoadedMetadata),e.addEventListener("ratechange",this.handleRateChange),e.addEventListener("play",this.handlePlay),e.addEventListener("emptied",this.handleEmptied);}detachVideoListeners(){this.currentVideo&&(this.currentVideo.removeEventListener("loadedmetadata",this.handleLoadedMetadata),this.currentVideo.removeEventListener("ratechange",this.handleRateChange),this.currentVideo.removeEventListener("play",this.handlePlay),this.currentVideo.removeEventListener("emptied",this.handleEmptied));}applyCurrentMode(){const e=this.currentVideo;e&&(this.playbackSettings.fixedModeEnabled?this.setPlaybackRate(e,this.playbackSettings.fixedRate):this.setPlaybackRate(e,ms));}setPlaybackRate(e,n){if(!(!Number.isFinite(n)||n<=0)&&!(Math.abs(e.playbackRate-n)<=fs)){this.isApplying=true;try{e.playbackRate=n;}catch(r){us.warn("再生速度の設定に失敗しました",r),this.scheduleApply();}finally{window.setTimeout(()=>{this.isApplying=false;},0);}}}scheduleApply(){this.cancelScheduledApply(),this.retryTimer=window.setTimeout(()=>{this.retryTimer=null,this.applyCurrentMode();},gs);}cancelScheduledApply(){this.retryTimer!==null&&(window.clearTimeout(this.retryTimer),this.retryTimer=null);}}const at=async()=>{},bs=()=>{const t=Ee();if(!t.dAniRenderer){const e={};t.dAniRenderer={classes:{Comment:vt,CommentRenderer:Z,NicoApiFetcher:K,NotificationManager:b,StyleManager:_t,SettingsUI:ce,NicoVideoSearcher:R,VideoSwitchHandler:xe,SettingsManager:Ie,KeyboardShortcutHandler:Ct,DebounceExecutor:Ae,ShadowDOMComponent:Pe,ShadowStyleManager:ee,PlaybackRateController:Me},instances:e,utils:{initialize:at,initializeWithVideo:at},debug:{showState:()=>{console.log("Current instances:",e);},showSettings:()=>{const n=e.settingsManager;if(!n){console.log("SettingsManager not initialized");return}console.log("Current settings:",n.getSettings());},showComments:()=>{const n=e.renderer;if(!n){console.log("CommentRenderer not initialized");return}console.log("Current comments:",n.getCommentsSnapshot());}},defaultSettings:W};}return t.dAniRenderer},ys=100,vs=1e3,ot=3e3,xs=2e3,lt="cachedAnimeTitle",g=F("dAnime:WatchPageController");class ws{constructor(e){this.global=e;try{this.cachedAnimeTitle=U(lt,null),this.cachedAnimeTitle&&g.info("watchPageController:constructor:loadedCachedTitle",{cachedAnimeTitle:this.cachedAnimeTitle});}catch(n){g.error("watchPageController:constructor:loadCacheFailed",n),this.cachedAnimeTitle=null;}}initialized=false;switchDebounce=new Ae(vs);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;playbackRateController=null;lastPartId=null;partIdMonitorIntervalId=null;isPartIdChanging=false;cachedAnimeTitle=null;lastEpisodeNumber=null;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(e=>{window.addEventListener("load",()=>e(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const e=document.querySelector(E.watchVideoElement);if(!e){window.setTimeout(()=>this.waitForVideoElement(),ys);return}if(e.readyState===0){e.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(e);},{once:true});return}this.initializeWithVideo(e);}async initializeWithVideo(e){if(!this.initialized){this.initialized=true;try{b.show("コメントローダーを初期化中...");const n=b.getInstance(),r=this.global.settingsManager??new Ie(n);this.global.settingsManager=r,this.global.instances.settingsManager=r;const i=r.loadSettings();if(!i.isCommentVisible){g.info("watchPageController:initializeWithVideo:skipDueToVisibility",{isCommentVisible:i.isCommentVisible}),b.show("コメントは非表示に設定されています。設定を変更するにはフローティングボタンをクリックしてください。","info");return}if(!i.autoSearchEnabled){g.info("watchPageController:initializeWithVideo:manualMode",{autoSearchEnabled:i.autoSearchEnabled});const u=r.loadVideoData();if(!u?.videoId){b.show("手動設定モードです。フローティングボタンから検索タブを開いて動画を選択してください。","info");return}g.info("watchPageController:initializeWithVideo:manualMode:loadSavedVideo",{videoId:u.videoId,title:u.title}),await this.loadCommentsFromSavedVideo(e,r,u);return}if(await this.waitForMetadataElements(),!await this.autoSetupComments(r))throw new Error("視聴ページからの自動取得に失敗しました。メタデータが取得できませんでした。");const a=r.loadVideoData();if(!a?.videoId)throw new Error("動画データが見つかりません。");const o=new K;this.global.instances.fetcher=o,await o.fetchApiData(a.videoId);const l=await o.fetchComments(),d=this.mergeSettings(r.loadSettings()),h=new Z(d);h.initialize(e),this.global.instances.renderer=h,this.currentVideoElement=e;const c=this.playbackRateController??new Me(r);this.playbackRateController=c,this.global.instances.playbackRateController=c,c.bind(e),r.addObserver(u=>{h.settings=this.mergeSettings(u);}),l.forEach(u=>{h.addComment(u.text,u.vposMs,u.commands);});const p=new xe(h,o,r);p.startMonitoring(),this.global.instances.switchHandler=p,this.setupSwitchHandling(e,p),this.observeVideoElement(),this.startPartIdMonitoring(),b.show(`コメントの読み込みが完了しました（${l.length}件）`,"success");}catch(n){throw this.initialized=false,b.show(`初期化エラー: ${n.message}`,"error"),n}}}mergeSettings(e){const n=W();return {...n,...e,ngWords:[...e.ngWords??n.ngWords],ngRegexps:[...e.ngRegexps??n.ngRegexps]}}setupSwitchHandling(e,n){this.currentVideoElement=e,this.switchCallback=()=>{if(this.isPartIdChanging){g.info("watchPageController:switchBlocked",{reason:"partId change in progress"});return}const r=Date.now();if(r-this.lastSwitchTimestamp<ot){g.debug("watchPageController:switchCooldown",{timeSinceLastSwitch:r-this.lastSwitchTimestamp,cooldownMs:ot});return}this.lastSwitchTimestamp=r;const i=this.currentVideoElement;g.info("watchPageController:switchHandlerTriggered",{currentTime:i?.currentTime??null,duration:i?.duration??null}),n.onVideoSwitch(i);},this.global.utils.initializeWithVideo=async r=>{r&&(this.rebindVideoElement(r),this.playbackRateController?.bind(r),await n.onVideoSwitch(r));},this.currentVideoElement=e;}observeVideoElement(){const e=this.currentVideoElement;e&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{const n=document.querySelector(E.watchVideoElement);!n||n===this.currentVideoElement||this.rebindVideoElement(n);}),this.domMutationObserver.observe(document.body,{childList:true,subtree:true}),this.attachVideoEventListeners(e));}rebindVideoElement(e){this.detachVideoEventListeners(),this.currentVideoElement=e;const n=this.global.instances.renderer,r=this.global.instances.switchHandler;n&&(n.clearComments(),n.destroy(),n.initialize(e),n.resize()),this.playbackRateController?.bind(e),r&&(r.onVideoSwitch(e),this.setupSwitchHandling(e,r)),this.attachVideoEventListeners(e);}attachVideoEventListeners(e){this.detachVideoEventListeners(),Qe().attach(e);const r=()=>{this.switchCallback&&(g.info("watchPageController:eventTriggered",{currentTime:e.currentTime,duration:e.duration,ended:e.ended,paused:e.paused}),this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));};e.addEventListener("ended",r),e.addEventListener("loadedmetadata",r),e.addEventListener("emptied",r),this.videoEndedListener=r;}detachVideoEventListeners(){const e=this.currentVideoElement;Qe().detach(),e&&this.videoEndedListener&&(e.removeEventListener("ended",this.videoEndedListener),e.removeEventListener("loadedmetadata",this.videoEndedListener),e.removeEventListener("emptied",this.videoEndedListener)),this.videoEndedListener=null;}async waitForMetadataElements(e,n){const s=Date.now();for(let l=0;l<50;l++){const d=this.getCurrentPartId(),h=document.querySelector(E.watchPageAnimeTitle),c=document.querySelector(E.watchPageEpisodeNumber),p=document.querySelector(E.watchPageEpisodeTitle),u=h?.textContent?.trim()??"",m=c?.textContent?.trim()??"",y=p?.textContent?.trim()??"";if(l===0&&g.info("watchPageController:waitForMetadata:start",{currentPartId:d,expectedPartId:e,episodeNumber:m,episodeTitle:y,animeTitle:u||"(empty)",cachedAnimeTitle:this.cachedAnimeTitle||"(empty)",previousEpisodeNumber:n||"(none)"}),!e&&!this.cachedAnimeTitle&&l<20&&!u){await new Promise(M=>window.setTimeout(M,100));continue}if((!e||d===e)&&(m&&y)&&(!n||m!==n)){g.info("watchPageController:waitForMetadata:success",{attempts:l+1,waited:Date.now()-s,currentPartId:d,expectedPartId:e,episodeNumber:m,episodeTitle:y,animeTitle:u||"(empty)",previousEpisodeNumber:n||"(none)"});return}await new Promise(M=>window.setTimeout(M,100));}const a=document.querySelector(E.watchPageEpisodeNumber)?.textContent?.trim()??"",o=document.querySelector(E.watchPageEpisodeTitle)?.textContent?.trim()??"";throw g.error("watchPageController:waitForMetadata:timeout",{maxRetries:50,waited:Date.now()-s,currentPartId:this.getCurrentPartId(),expectedPartId:e,previousEpisodeNumber:n||"(none)",finalEpisodeNumber:a,finalEpisodeTitle:o}),new Error(`DOM更新のタイムアウト: partId=${e}, 前回エピソード="${n||"なし"}", 現在エピソード="${a}"`)}extractMetadataFromPage(){try{const e=document.querySelector(E.watchPageAnimeTitle),n=document.querySelector(E.watchPageEpisodeNumber),r=document.querySelector(E.watchPageEpisodeTitle);let i=e?.textContent?.trim()??"";const s=n?.textContent?.trim()??"",a=r?.textContent?.trim()??"";if(i){this.cachedAnimeTitle=i;try{G(lt,i),g.info("watchPageController:extractMetadata:cachedTitle",{animeTitle:i});}catch(o){g.error("watchPageController:extractMetadata:saveCacheFailed",o);}}else this.cachedAnimeTitle&&(i=this.cachedAnimeTitle,g.info("watchPageController:extractMetadata:usedCachedTitle",{cachedAnimeTitle:this.cachedAnimeTitle}));return g.info("watchPageController:extractMetadata:rawValues",{animeTitle:i||"(empty)",animeTitleElementExists:!!e,animeTitleFromCache:!e&&!!this.cachedAnimeTitle,episodeNumber:s,episodeNumberElementExists:!!n,episodeTitle:a,episodeTitleElementExists:!!r,currentPartId:this.getCurrentPartId()}),s?(i||g.warn("watchPageController:extractMetadata:noAnimeTitle",{hasCache:!!this.cachedAnimeTitle}),this.lastEpisodeNumber=s,{animeTitle:i,episodeNumber:s,episodeTitle:a}):(g.warn("watchPageController:extractMetadata:insufficient",{episodeNumber:s||"(empty)",episodeTitle:a||"(empty)"}),null)}catch(e){return g.error("watchPageController:extractMetadata:error",e),null}}async autoSetupComments(e){try{const n=this.extractMetadataFromPage();if(!n)return g.warn("watchPageController:autoSetup:noMetadata"),!1;if(!n.animeTitle)return g.warn("watchPageController:autoSetup:noAnimeTitle",{episodeNumber:n.episodeNumber,episodeTitle:n.episodeTitle,cachedAnimeTitle:this.cachedAnimeTitle}),b.show("アニメタイトルが取得できませんでした。検索精度が低下する可能性があります。","warning"),!1;const r=[n.animeTitle,n.episodeNumber,n.episodeTitle].filter(Boolean).join(" ");g.info("watchPageController:autoSetup",{keyword:r,animeTitle:n.animeTitle,episodeNumber:n.episodeNumber,episodeTitle:n.episodeTitle,usingCachedTitle:!!this.cachedAnimeTitle&&!n.animeTitle}),b.show(`「${r}」を検索中...`,"info");const s=await new R().search(r);if(s.length===0)return b.show("ニコニコ動画が見つかりませんでした","warning"),!1;const a=R.filterOfficialVideos(s,n.animeTitle);g.info("watchPageController:autoSetup:officialFilter",{totalResults:s.length,officialResults:a.length,animeTitle:n.animeTitle}),a.length===0&&(g.warn("watchPageController:autoSetup:noOfficialVideos",{animeTitle:n.animeTitle,firstResultOwner:s[0]?.owner?.nickname??s[0]?.channel?.name??"不明"}),b.show("公式動画が見つかりませんでした。検索結果の最初の動画を使用します。","warning"));const o=a.length>0?a[0]:s[0],d=await new K().fetchApiData(o.videoId),h={videoId:o.videoId,title:o.title,viewCount:d.video?.count?.view??o.viewCount,commentCount:d.video?.count?.comment??o.commentCount,mylistCount:d.video?.count?.mylist??o.mylistCount,postedAt:d.video?.registeredAt??o.postedAt,thumbnail:d.video?.thumbnail?.url??o.thumbnail,owner:d.owner??o.owner??null,channel:d.channel??o.channel??null};if(e.saveVideoData(o.title,h)){g.info("watchPageController:autoSetup:success",{videoId:o.videoId,title:o.title,commentCount:o.commentCount});const p=o.owner?.nickname||o.channel?.name||"不明",u=['<div style="font-weight: 600; margin-bottom: 8px;">ニコニコ動画を自動設定しました</div>','<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${it}</span>`,`  <span style="flex: 1; word-break: break-word;">${o.title}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${we}</span>`,`  <span>${p}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">','  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Se}</span>`,`    <span>${o.viewCount.toLocaleString()}</span>`,"  </div>",'  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ce}</span>`,`    <span>${o.commentCount.toLocaleString()}</span>`,"  </div>","</div>"].join("");return b.show(u,"success",5e3),!0}return !1}catch(n){return g.error("watchPageController:autoSetup:error",n),b.show(`自動設定エラー: ${n.message}`,"error"),false}}getCurrentPartId(){try{return new URLSearchParams(window.location.search).get("partId")}catch(e){return g.error("watchPageController:getCurrentPartId:error",e),null}}startPartIdMonitoring(){this.stopPartIdMonitoring(),this.lastPartId=this.getCurrentPartId(),this.partIdMonitorIntervalId=window.setInterval(()=>{this.checkPartIdChange();},xs);}stopPartIdMonitoring(){this.partIdMonitorIntervalId!==null&&(window.clearInterval(this.partIdMonitorIntervalId),this.partIdMonitorIntervalId=null);}async checkPartIdChange(){const e=this.getCurrentPartId();e===null||e===this.lastPartId||(g.warn("watchPageController:partIdChanged",{oldPartId:this.lastPartId,newPartId:e,url:window.location.href,timestamp:new Date().toISOString()}),this.lastPartId=e,await this.onPartIdChanged());}async waitForVideoReady(e){const i=Date.now();for(g.info("watchPageController:waitForVideoReady:start",{readyState:e.readyState,duration:e.duration,src:e.currentSrc});e.readyState<2&&Date.now()-i<5e3;)await new Promise(s=>window.setTimeout(s,100));g.info("watchPageController:waitForVideoReady:complete",{readyState:e.readyState,duration:e.duration,waited:Date.now()-i});}async onPartIdChanged(){this.isPartIdChanging=true;try{const e=this.global.settingsManager;if(!e){g.warn("watchPageController:onPartIdChanged:noSettingsManager");return}const n=e.getSettings();if(!n.isCommentVisible){g.info("watchPageController:onPartIdChanged:skipDueToVisibility",{isCommentVisible:n.isCommentVisible}),b.show("コメント非表示設定のためスキップしました","info");return}const r=this.lastEpisodeNumber??document.querySelector(E.watchPageEpisodeNumber)?.textContent?.trim()??null;if(!n.autoSearchEnabled){g.info("watchPageController:onPartIdChanged:manualMode",{autoSearchEnabled:n.autoSearchEnabled});const a=e.loadManualSearchSettings();if(!a?.animeTitle){b.show("手動設定モードです。フローティングボタンから検索タブを開いてアニメタイトルを設定してください。","info");const o=this.global.instances.renderer;o&&o.clearComments();return}await this.handleManualModeEpisodeSwitch(e,a.animeTitle,r);return}g.info("watchPageController:onPartIdChanged:start",{currentVideoElement:this.currentVideoElement?"present":"null",rendererExists:!!this.global.instances.renderer,switchHandlerExists:!!this.global.instances.switchHandler,isPartIdChanging:this.isPartIdChanging,newPartId:this.getCurrentPartId(),previousEpisodeNumber:r}),b.show("エピソード切り替えを検知しました...","info");const i=this.getCurrentPartId();g.info("watchPageController:onPartIdChanged:waitingForDomUpdate",{newPartId:i,previousEpisodeNumber:r});try{await this.waitForMetadataElements(i??void 0,r??void 0);}catch(a){g.error("watchPageController:onPartIdChanged:waitMetadataFailed",a),b.show(`DOM更新の待機に失敗しました: ${a.message}`,"error");return}const s=await this.autoSetupComments(e);if(g.info("watchPageController:onPartIdChanged:autoSetup",{success:s}),s){const a=e.loadVideoData();g.warn("watchPageController:onPartIdChanged:loadedVideoData",{videoId:a?.videoId??null,title:a?.title??null});const o=this.currentVideoElement??document.querySelector(E.watchVideoElement);if(g.warn("watchPageController:onPartIdChanged:videoElement",{videoElementFound:!!o,currentTime:o?.currentTime??null,duration:o?.duration??null,src:o?.currentSrc??null,readyState:o?.readyState??null}),o&&a?.videoId){await this.waitForVideoReady(o),o.dataset.videoId=a.videoId;const l=this.global.instances.renderer,d=this.global.instances.switchHandler;if(g.warn("watchPageController:onPartIdChanged:beforeSwitch",{rendererCommentCount:l?.getCommentsSnapshot().length??0,videoCurrentTime:o.currentTime,videoReadyState:o.readyState,videoSrc:o.currentSrc,videoId:a.videoId}),l&&d){g.warn("watchPageController:onPartIdChanged:destroyBefore",{commentsBeforeDestroy:l.getCommentsSnapshot().length,currentVideoSrc:l.getCurrentVideoSource(),videoElement:l.getVideoElement()?"attached":"detached"});const h=l.settings;l.destroy(),g.warn("watchPageController:onPartIdChanged:createNew",{savedSettings:h});const c=new Z(h,{loggerNamespace:"dAnime:CommentRenderer"});this.global.instances.renderer=c,g.warn("watchPageController:onPartIdChanged:reinitialize",{videoElementSrc:o.currentSrc,videoElementReadyState:o.readyState,videoElementCurrentTime:o.currentTime}),c.initialize(o),g.warn("watchPageController:onPartIdChanged:reinitializeComplete",{commentsAfterReinitialize:c.getCommentsSnapshot().length,newVideoSrc:c.getCurrentVideoSource()}),d.updateRenderer(c),d.resetVideoSource(),await d.onVideoSwitch(o),g.warn("watchPageController:onPartIdChanged:afterSwitch",{rendererCommentCount:c.getCommentsSnapshot().length,videoCurrentTime:o.currentTime,finalVideoSrc:c.getCurrentVideoSource()});}}}g.info("watchPageController:onPartIdChanged:complete");}catch(e){g.error("watchPageController:onPartIdChanged:error",e),b.show(`エピソード切り替えエラー: ${e.message}`,"error");}finally{this.isPartIdChanging=false,g.info("watchPageController:onPartIdChanged:flagReset",{isPartIdChanging:this.isPartIdChanging});}}async loadCommentsFromSavedVideo(e,n,r){try{const i=new K;this.global.instances.fetcher=i,await i.fetchApiData(r.videoId);const s=await i.fetchComments(),a=this.mergeSettings(n.loadSettings()),o=new Z(a);o.initialize(e),this.global.instances.renderer=o,this.currentVideoElement=e;const l=this.playbackRateController??new Me(n);this.playbackRateController=l,this.global.instances.playbackRateController=l,l.bind(e),n.addObserver(h=>{o.settings=this.mergeSettings(h);}),s.forEach(h=>{o.addComment(h.text,h.vposMs,h.commands);});const d=new xe(o,i,n);d.startMonitoring(),this.global.instances.switchHandler=d,this.setupSwitchHandling(e,d),this.observeVideoElement(),this.startPartIdMonitoring(),b.show(`【手動設定モード】コメントの読み込みが完了しました（${s.length}件）
動画: ${r.title}`,"success");}catch(i){g.error("watchPageController:loadCommentsFromSavedVideo:error",i),b.show(`コメント読み込みエラー: ${i.message}
フローティングボタンから別の動画を選択してください。`,"error");}}async handleManualModeEpisodeSwitch(e,n,r){try{const i=this.getCurrentPartId();g.info("watchPageController:manualModeSwitch:waitingForDomUpdate",{newPartId:i,previousEpisodeNumber:r,savedAnimeTitle:n});try{await this.waitForMetadataElements(i??void 0,r??void 0);}catch(w){g.error("watchPageController:manualModeSwitch:waitMetadataFailed",w),b.show(`DOM更新の待機に失敗しました: ${w.message}`,"error");return}const s=document.querySelector(E.watchPageEpisodeNumber)?.textContent?.trim()??"";if(!s){g.warn("watchPageController:manualModeSwitch:noEpisodeNumber"),b.show("エピソード話数を取得できませんでした","warning");return}const a=`${n} ${s}`;g.info("watchPageController:manualModeSwitch:search",{keyword:a,savedAnimeTitle:n,newEpisodeNumber:s}),b.show(`「${a}」を検索中...`,"info");const l=await new R().search(a);if(l.length===0){b.show("ニコニコ動画が見つかりませんでした。手動で検索してください。","warning");const w=this.global.instances.renderer;w&&w.clearComments();return}const d=R.filterOfficialVideos(l,n);if(g.info("watchPageController:manualModeSwitch:officialFilter",{totalResults:l.length,officialResults:d.length,savedAnimeTitle:n}),d.length===0){b.show("公式動画が見つかりませんでした。手動で検索してください。","warning");const w=this.global.instances.renderer;w&&w.clearComments();return}const h=d[0],p=await new K().fetchApiData(h.videoId),u={videoId:h.videoId,title:h.title,viewCount:p.video?.count?.view??h.viewCount,commentCount:p.video?.count?.comment??h.commentCount,mylistCount:p.video?.count?.mylist??h.mylistCount,postedAt:p.video?.registeredAt??h.postedAt,thumbnail:p.video?.thumbnail?.url??h.thumbnail,owner:p.owner??h.owner??null,channel:p.channel??h.channel??null};e.saveVideoData(h.title,u),e.saveManualSearchSettings({animeTitle:n,episodeNumber:s,episodeTitle:""});const m=this.currentVideoElement??document.querySelector(E.watchVideoElement);if(m){await this.waitForVideoReady(m),m.dataset.videoId=h.videoId;const w=this.global.instances.renderer,S=this.global.instances.switchHandler;if(w&&S){const T=w.settings;w.destroy();const M=new Z(T,{loggerNamespace:"dAnime:CommentRenderer"});this.global.instances.renderer=M,M.initialize(m),S.updateRenderer(M),S.resetVideoSource(),await S.onVideoSwitch(m);}}const y=h.owner?.nickname??h.channel?.name??"不明",v=['<div style="font-weight: 600; margin-bottom: 8px;">次のエピソードを自動設定しました</div>','<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${it}</span>`,`  <span style="flex: 1; word-break: break-word;">${h.title}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${we}</span>`,`  <span>${y}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">','  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Se}</span>`,`    <span>${h.viewCount.toLocaleString()}</span>`,"  </div>",'  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ce}</span>`,`    <span>${h.commentCount.toLocaleString()}</span>`,"  </div>","</div>"].join("");b.show(v,"success",5e3),g.info("watchPageController:manualModeSwitch:success",{videoId:h.videoId,title:h.title,commentCount:h.commentCount});}catch(i){g.error("watchPageController:manualModeSwitch:error",i),b.show(`エピソード切り替えエラー: ${i.message}`,"error");}}}const Ss=100;class Cs{constructor(e){this.global=e;}initialize(){const e=b.getInstance(),n=this.global.settingsManager??new Ie(e);this.global.settingsManager=n,this.global.instances.settingsManager=n;const r=new ce(n);this.waitForHeader(r);}waitForHeader(e){if(!document.querySelector(E.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(e),Ss);return}e.insertIntoMypage(),e.addAutoCommentButtons(),this.observeList(e);}observeList(e){const n=document.querySelector(E.mypageListContainer);if(!n)return;new MutationObserver(()=>{try{e.addAutoCommentButtons();}catch(i){console.error("[MypageController] auto comment buttons update failed",i);}}).observe(n,{childList:true,subtree:true});}}class Ms{log;global=bs();watchController=null;mypageController=null;constructor(){this.log=F("DanimeApp");}start(){this.log.info("starting renderer"),_t.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const e=location.pathname.toLowerCase();try{e.includes("/animestore/sc_d_pc")?(this.watchController=new ws(this.global),await this.watchController.initialize()):e.includes("/animestore/mp_viw_pc")?(this.mypageController=new Cs(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(n){this.log.error("initialization failed",n);}}acquireInstanceLock(){const e=Ee();return e.__dAnimeNicoCommentRenderer2Instance=(e.__dAnimeNicoCommentRenderer2Instance??0)+1,e.__dAnimeNicoCommentRenderer2Instance===1}}const ye=F("dAnimeNicoCommentRenderer2");async function Es(){ye.info("bootstrap start");try{new Ms().start(),ye.info("bootstrap completed");}catch(t){ye.error("bootstrap failed",t);}}Es();

})();