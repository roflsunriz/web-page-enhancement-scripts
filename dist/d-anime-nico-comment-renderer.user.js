// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      6.8.0
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

  const gt={debug:"debug",info:"info",warn:"warn",error:"error"},_=o=>{const t=`[${o}]`,e={};return Object.keys(gt).forEach(n=>{const r=gt[n];e[n]=(...i)=>{(console[r]??console.log)(t,...i);};}),e};function ot(){return typeof unsafeWindow<"u"?unsafeWindow:window}const ft={debug:0,info:1,warn:2,error:3},ce=(o,t,e)=>{const n=[`[${t}]`,...e];switch(o){case "debug":console.debug(...n);break;case "info":console.info(...n);break;case "warn":console.warn(...n);break;case "error":console.error(...n);break;default:console.log(...n);}},Nt=(o,t={})=>{const{level:e="info",emitter:n=ce}=t,r=ft[e],i=(s,a)=>{ft[s]<r||n(s,o,a);};return {debug:(...s)=>i("debug",s),info:(...s)=>i("info",s),warn:(...s)=>i("warn",s),error:(...s)=>i("error",s)}},de={small:.8,medium:1,big:1.4},he={defont:'"MS PGothic","Hiragino Kaku Gothic ProN","Hiragino Kaku Gothic Pro","Yu Gothic UI","Yu Gothic","Meiryo","Segoe UI","Osaka","Noto Sans CJK JP","Noto Sans JP","Source Han Sans JP","IPAPGothic","TakaoPGothic","Roboto","Helvetica Neue","Helvetica","Arial","sans-serif"',gothic:'"Noto Sans CJK JP","Noto Sans JP","Source Han Sans JP","Yu Gothic","Yu Gothic Medium","Meiryo","MS PGothic","Hiragino Kaku Gothic ProN","Segoe UI","Helvetica","Arial","sans-serif"',mincho:'"MS PMincho","MS Mincho","Hiragino Mincho ProN","Hiragino Mincho Pro","Yu Mincho","Noto Serif CJK JP","Noto Serif JP","Source Han Serif JP","Times New Roman","serif"'},Ht={white:"#FFFFFF",red:"#FF0000",pink:"#FF8080",orange:"#FF9900",yellow:"#FFFF00",green:"#00FF00",cyan:"#00FFFF",blue:"#0000FF",purple:"#C000FF",black:"#000000",white2:"#CC9",red2:"#C03",pink2:"#F3C",orange2:"#F60",yellow2:"#990",green2:"#0C6",cyan2:"#0CC",blue2:"#39F",purple2:"#63C",black2:"#666"},lt=/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,ue=/^[,.:;]+/,pe=/[,.:;]+$/,me=o=>{const t=o.trim();return t?lt.test(t)?t:t.replace(ue,"").replace(pe,""):""},ge=o=>lt.test(o)?o.toUpperCase():null,zt=o=>{const t=o.trim();if(!t)return null;const e=t.toLowerCase().endsWith("px")?t.slice(0,-2):t,n=Number.parseFloat(e);return Number.isFinite(n)?n:null},fe=o=>{const t=o.trim();if(!t)return null;if(t.endsWith("%")){const e=Number.parseFloat(t.slice(0,-1));return Number.isFinite(e)?e/100:null}return zt(t)},be=o=>Number.isFinite(o)?Math.min(100,Math.max(-100,o)):0,ye=o=>!Number.isFinite(o)||o===0?1:Math.min(5,Math.max(.25,o)),ve=o=>o==="naka"||o==="ue"||o==="shita",xe=o=>o==="small"||o==="medium"||o==="big",we=o=>o==="defont"||o==="gothic"||o==="mincho",Se=o=>o in Ht,Ce=(o,t)=>{let e="naka",n="medium",r="defont",i=null,s=1,a=null,l=false,d=0,h=1;for(const b of o){const y=me(typeof b=="string"?b:"");if(!y)continue;if(lt.test(y)){const v=ge(y);if(v){i=v;continue}}const g=y.toLowerCase();if(ve(g)){e=g;continue}if(xe(g)){n=g;continue}if(we(g)){r=g;continue}if(Se(g)){i=Ht[g].toUpperCase();continue}if(g==="_live"){a=.5;continue}if(g==="invisible"){s=0,l=true;continue}if(g.startsWith("ls:")||g.startsWith("letterspacing:")){const v=y.indexOf(":");if(v>=0){const M=zt(y.slice(v+1));M!==null&&(d=be(M));}continue}if(g.startsWith("lh:")||g.startsWith("lineheight:")){const v=y.indexOf(":");if(v>=0){const M=fe(y.slice(v+1));M!==null&&(h=ye(M));}continue}}const c=Math.max(0,Math.min(1,s)),u=(i??t.defaultColor).toUpperCase(),m=typeof a=="number"?Math.max(0,Math.min(1,a)):null;return {layout:e,size:n,sizeScale:de[n],font:r,fontFamily:he[r],resolvedColor:u,colorOverride:i,opacityMultiplier:c,opacityOverride:m,isInvisible:l,letterSpacing:d,lineHeight:h}},tt=Nt("CommentEngine:Comment"),N=4e3,Me=/^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i,H=o=>!Number.isFinite(o)||o<=0?0:o>=1?1:o,$=o=>o.length===1?o.repeat(2):o,V=o=>Number.parseInt(o,16),Ee=(o,t)=>{const e=Me.exec(o);if(!e)return o;const n=e[1];let r,i,s,a=1;n.length===3||n.length===4?(r=V($(n[0])),i=V($(n[1])),s=V($(n[2])),n.length===4&&(a=V($(n[3]))/255)):(r=V(n.slice(0,2)),i=V(n.slice(2,4)),s=V(n.slice(4,6)),n.length===8&&(a=V(n.slice(6,8))/255));const l=H(a*H(t));return `rgba(${r}, ${i}, ${s}, ${l})`},ke=()=>({now:()=>typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now()}),Wt=()=>ke(),Ae=o=>o==="ltr"?"ltr":"rtl",Le=o=>o==="ltr"?1:-1;class qt{text;vposMs;commands;layout;isScrolling;sizeScale;opacityMultiplier;opacityOverride;colorOverride;isInvisible;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily;opacity;activationTimeMs=null;staticExpiryTimeMs=null;isActive=false;hasShown=false;isPaused=false;lastUpdateTime=0;reservationWidth=0;bufferWidth=0;visibleDurationMs=0;totalDurationMs=0;preCollisionDurationMs=0;speedPixelsPerMs=0;virtualStartX=0;exitThreshold=0;scrollDirection="rtl";renderStyle="outline-only";creationIndex=0;letterSpacing=0;lineHeightMultiplier=1;lineHeightPx=0;lines=[];directionSign=-1;timeSource;constructor(t,e,n,r,i={}){if(typeof t!="string")throw new Error("Comment text must be a string");if(!Number.isFinite(e)||e<0)throw new Error("Comment vposMs must be a non-negative number");this.text=t,this.vposMs=e,this.commands=Array.isArray(n)?[...n]:[];const s=Ce(this.commands,{defaultColor:r.commentColor});this.layout=s.layout,this.isScrolling=this.layout==="naka",this.sizeScale=s.sizeScale,this.opacityMultiplier=s.opacityMultiplier,this.opacityOverride=s.opacityOverride,this.colorOverride=s.colorOverride,this.isInvisible=s.isInvisible,this.fontFamily=s.fontFamily,this.color=s.resolvedColor,this.opacity=this.getEffectiveOpacity(r.commentOpacity),this.renderStyle=r.renderStyle,this.letterSpacing=s.letterSpacing,this.lineHeightMultiplier=s.lineHeight,this.timeSource=i.timeSource??Wt(),this.applyScrollDirection(r.scrollDirection),this.syncWithSettings(r);}prepare(t,e,n,r){try{if(!t)throw new Error("Canvas context is required");if(!Number.isFinite(e)||!Number.isFinite(n))throw new Error("Canvas dimensions must be numbers");if(!r)throw new Error("Prepare options are required");const i=Math.max(e,1),s=Math.max(24,Math.floor(n*.05)),a=Math.max(24,Math.floor(s*this.sizeScale));this.fontSize=a,t.font=`${this.fontSize}px ${this.fontFamily}`;const l=this.text.includes(`
`)?this.text.split(/\r?\n/):[this.text];this.lines=l.length>0?l:[""];let d=0;const h=this.letterSpacing;for(const L of this.lines){const Q=t.measureText(L).width,le=L.length>1?h*(L.length-1):0,mt=Math.max(0,Q+le);mt>d&&(d=mt);}this.width=d;const c=Math.max(1,Math.floor(this.fontSize*this.lineHeightMultiplier));if(this.lineHeightPx=c,this.height=this.fontSize+(this.lines.length>1?(this.lines.length-1)*c:0),!this.isScrolling){this.bufferWidth=0;const L=Math.max((i-this.width)/2,0);this.virtualStartX=L,this.x=L,this.baseSpeed=0,this.speed=0,this.speedPixelsPerMs=0,this.visibleDurationMs=N,this.preCollisionDurationMs=N,this.totalDurationMs=N,this.reservationWidth=this.width,this.staticExpiryTimeMs=this.vposMs+N,this.lastUpdateTime=this.timeSource.now(),this.isPaused=!1;return}this.staticExpiryTimeMs=null;const u=t.measureText("??".repeat(150)).width,m=this.width*Math.max(r.bufferRatio,0);this.bufferWidth=Math.max(r.baseBufferPx,m);const b=Math.max(r.entryBufferPx,this.bufferWidth),y=this.scrollDirection,g=y==="rtl"?i+r.virtualExtension:-this.width-this.bufferWidth-r.virtualExtension,v=y==="rtl"?-this.width-this.bufferWidth-b:i+b,M=y==="rtl"?i+b:-b,C=y==="rtl"?g+this.width+this.bufferWidth:g-this.bufferWidth;this.virtualStartX=g,this.x=g,this.exitThreshold=v;const R=i>0?this.width/i:0,w=r.maxVisibleDurationMs===r.minVisibleDurationMs;let J=r.maxVisibleDurationMs;if(!w&&R>1){const L=Math.min(R,r.maxWidthRatio),Q=r.maxVisibleDurationMs/Math.max(L,1);J=Math.max(r.minVisibleDurationMs,Math.floor(Q));}const ne=i+this.width+this.bufferWidth+b,re=Math.max(J,1),Z=ne/re,ie=Z*1e3/60;this.baseSpeed=ie,this.speed=this.baseSpeed,this.speedPixelsPerMs=Z;const se=Math.abs(v-g),ae=y==="rtl"?Math.max(0,C-M):Math.max(0,M-C),pt=Math.max(Z,Number.EPSILON);this.visibleDurationMs=J,this.preCollisionDurationMs=Math.max(0,Math.ceil(ae/pt)),this.totalDurationMs=Math.max(this.preCollisionDurationMs,Math.ceil(se/pt));const oe=this.width+this.bufferWidth+b;this.reservationWidth=Math.min(u,oe),this.lastUpdateTime=this.timeSource.now(),this.isPaused=!1;}catch(i){throw tt.error("Comment.prepare",i,{text:this.text,visibleWidth:e,canvasHeight:n,hasContext:!!t}),i}}update(t=1,e=false){try{if(!this.isActive){this.isPaused=e;return}const n=this.timeSource.now();if(!this.isScrolling){this.isPaused=e,this.lastUpdateTime=n;return}if(e){this.isPaused=!0,this.lastUpdateTime=n;return}const r=(n-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*t,this.x+=this.speed*r*this.directionSign,(this.scrollDirection==="rtl"&&this.x<=this.exitThreshold||this.scrollDirection==="ltr"&&this.x>=this.exitThreshold)&&(this.isActive=!1),this.lastUpdateTime=n,this.isPaused=!1;}catch(n){tt.error("Comment.update",n,{text:this.text,playbackRate:t,isPaused:e,isActive:this.isActive});}}draw(t,e=null){try{if(!this.isActive||!t)return;t.save(),t.font=`${this.fontSize}px ${this.fontFamily}`;const n=H(this.opacity),r=e??this.x,i=this.lines.length>0?this.lines:[this.text],s=this.lines.length>1&&this.lineHeightPx>0?this.lineHeightPx:this.fontSize,a=this.y+this.fontSize,l=(c,u,m)=>{if(c.length===0)return;if(Math.abs(this.letterSpacing)<Number.EPSILON){m==="stroke"?t.strokeText(c,r,u):t.fillText(c,r,u);return}let b=r;for(let y=0;y<c.length;y+=1){const g=c[y];m==="stroke"?t.strokeText(g,b,u):t.fillText(g,b,u);const v=t.measureText(g),M=Number.isFinite(v.width)?v.width:0;b+=M,y<c.length-1&&(b+=this.letterSpacing);}},d=()=>{t.globalAlpha=n,t.strokeStyle="#000000",t.lineWidth=Math.max(3,this.fontSize/8),t.lineJoin="round",i.forEach((c,u)=>{const m=a+u*s;l(c,m,"stroke");}),t.globalAlpha=1;},h=()=>{i.forEach((c,u)=>{const m=a+u*s;l(c,m,"fill");});};if(d(),this.renderStyle==="classic"){const c=Math.max(1,this.fontSize*.04),u=this.fontSize*.18;[{offsetXMultiplier:.9,offsetYMultiplier:1.1,blurMultiplier:.55,alpha:.52,rgb:"20, 28, 40"},{offsetXMultiplier:2.4,offsetYMultiplier:2.7,blurMultiplier:1.45,alpha:.32,rgb:"0, 0, 0"},{offsetXMultiplier:-.7,offsetYMultiplier:-.6,blurMultiplier:.4,alpha:.42,rgb:"255, 255, 255"}].forEach(m=>{const b=H(m.alpha*n);t.shadowColor=`rgba(${m.rgb}, ${b})`,t.shadowBlur=u*m.blurMultiplier,t.shadowOffsetX=c*m.offsetXMultiplier,t.shadowOffsetY=c*m.offsetYMultiplier,t.fillStyle="rgba(0, 0, 0, 0)",h();}),t.shadowColor="transparent",t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0;}else t.shadowColor="transparent",t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0;t.globalAlpha=1,t.fillStyle=Ee(this.color,n),h(),t.restore();}catch(n){tt.error("Comment.draw",n,{text:this.text,isActive:this.isActive,hasContext:!!t,interpolatedX:e});}}syncWithSettings(t){this.color=this.getEffectiveColor(t.commentColor),this.opacity=this.getEffectiveOpacity(t.commentOpacity),this.applyScrollDirection(t.scrollDirection),this.renderStyle=t.renderStyle;}getEffectiveColor(t){const e=this.colorOverride??t;return typeof e!="string"||e.length===0?t:e.toUpperCase()}getEffectiveOpacity(t){if(typeof this.opacityOverride=="number")return H(this.opacityOverride);const e=t*this.opacityMultiplier;return Number.isFinite(e)?H(e):0}markActivated(t){this.activationTimeMs=t;}clearActivation(){this.activationTimeMs=null,this.isScrolling||(this.staticExpiryTimeMs=null);}hasStaticExpired(t){return this.isScrolling||this.staticExpiryTimeMs===null?false:t>=this.staticExpiryTimeMs}getDirectionSign(){return this.directionSign}applyScrollDirection(t){const e=Ae(t);this.scrollDirection=e,this.directionSign=Le(e);}}const Ve=4e3,et={commentColor:"#FFFFFF",commentOpacity:1,isCommentVisible:true,useContainerResizeObserver:true,ngWords:[],ngRegexps:[],scrollDirection:"rtl",renderStyle:"outline-only",syncMode:"raf",scrollVisibleDurationMs:Ve,useFixedLaneCount:false,fixedLaneCount:12,useDprScaling:true},$t=()=>({...et,ngWords:[...et.ngWords],ngRegexps:[...et.ngRegexps]}),Bt=5,D={enabled:false,maxLogsPerCategory:Bt},j=new Map,Te=o=>{if(o===void 0||!Number.isFinite(o))return Bt;const t=Math.max(1,Math.floor(o));return Math.min(1e4,t)},Ie=o=>{D.enabled=!!o.enabled,D.maxLogsPerCategory=Te(o.maxLogsPerCategory),D.enabled||j.clear();},T=()=>D.enabled,_e=o=>{const t=j.get(o)??0;return t>=D.maxLogsPerCategory?(t===D.maxLogsPerCategory&&(console.debug(`[CommentOverlay][${o}]`,"Further logs suppressed."),j.set(o,t+1)),false):(j.set(o,t+1),true)},x=(o,...t)=>{D.enabled&&_e(o)&&console.debug(`[CommentOverlay][${o}]`,...t);},I=(o,t=32)=>o.length<=t?o:`${o.slice(0,t)}…`,P=o=>o*1e3,Re=o=>!Number.isFinite(o)||o<0?null:Math.round(o),Ut=4e3,bt=1800,Pe=3,Fe=.25,De=32,Oe=48,B=120,Ne=4e3,yt=N+Ut,He=1e3,vt=1,xt=12,wt=24,A=.001,St=50,ze=o=>Number.isFinite(o)?o<=0?0:o>=1?1:o:1,U=o=>{const t=o.scrollVisibleDurationMs,e=t==null?null:Number.isFinite(t)?Math.max(1,Math.floor(t)):null;return {...o,scrollDirection:o.scrollDirection==="ltr"?"ltr":"rtl",commentOpacity:ze(o.commentOpacity),renderStyle:o.renderStyle==="classic"?"classic":"outline-only",scrollVisibleDurationMs:e,syncMode:o.syncMode==="video-frame"?"video-frame":"raf",useDprScaling:!!o.useDprScaling}},We=o=>typeof window<"u"&&typeof window.requestAnimationFrame=="function"&&typeof window.cancelAnimationFrame=="function"?{request:t=>window.requestAnimationFrame(t),cancel:t=>window.cancelAnimationFrame(t)}:{request:t=>globalThis.setTimeout(()=>{t(o.now());},16),cancel:t=>{globalThis.clearTimeout(t);}},qe=()=>typeof document>"u"?()=>{throw new Error("Document is not available. Provide a custom createCanvasElement implementation.")}:()=>document.createElement("canvas"),$e=o=>{if(!o||typeof o!="object")return  false;const t=o;return typeof t.commentColor=="string"&&typeof t.commentOpacity=="number"&&typeof t.isCommentVisible=="boolean"};class Ct{_settings;comments=[];reservedLanes=new Map;topStaticLaneReservations=new Map;bottomStaticLaneReservations=new Map;log;timeSource;animationFrameProvider;createCanvasElement;commentDependencies;canvas=null;ctx=null;videoElement=null;containerElement=null;laneCount=xt;laneHeight=0;displayWidth=0;displayHeight=0;canvasDpr=1;currentTime=0;duration=0;playbackRate=1;isPlaying=true;lastDrawTime=0;finalPhaseActive=false;frameId=null;videoFrameHandle=null;resizeObserver=null;resizeObserverTarget=null;isResizeObserverAvailable=typeof ResizeObserver<"u";cleanupTasks=[];commentSequence=0;constructor(t=null,e=void 0){let n,r;if($e(t))n=U({...t}),r=e??{};else {const i=t??e??{};r=typeof i=="object"?i:{},n=U($t());}this.timeSource=r.timeSource??Wt(),this.animationFrameProvider=r.animationFrameProvider??We(this.timeSource),this.createCanvasElement=r.createCanvasElement??qe(),this.commentDependencies={timeSource:this.timeSource},this._settings=U(n),this.log=Nt(r.loggerNamespace??"CommentRenderer"),r.debug&&Ie(r.debug);}get settings(){return this._settings}set settings(t){this._settings=U(t);}resolveContainer(t,e){if(t)return t;if(e.parentElement)return e.parentElement;if(typeof document<"u"&&document.body)return document.body;throw new Error("Cannot resolve container element. Provide container explicitly when DOM is unavailable.")}ensureContainerPositioning(t){if(typeof getComputedStyle=="function"){getComputedStyle(t).position==="static"&&(t.style.position="relative");return}t.style.position||(t.style.position="relative");}initialize(t){try{this.destroyCanvasOnly();const e=t instanceof HTMLVideoElement?t:t.video,n=t instanceof HTMLVideoElement?t.parentElement:t.container??t.video.parentElement,r=this.resolveContainer(n??null,e);this.videoElement=e,this.containerElement=r,this.duration=Number.isFinite(e.duration)?P(e.duration):0,this.currentTime=P(e.currentTime),this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.lastDrawTime=this.timeSource.now();const i=this.createCanvasElement(),s=i.getContext("2d");if(!s)throw new Error("Failed to acquire 2D canvas context");i.style.position="absolute",i.style.top="0",i.style.left="0",i.style.pointerEvents="none",i.style.zIndex="1000";const a=this.containerElement;a instanceof HTMLElement&&(this.ensureContainerPositioning(a),a.appendChild(i)),this.canvas=i,this.ctx=s,this.resize(),this.calculateLaneMetrics(),this.setupVideoEventListeners(e),this.setupResizeHandling(e),this.setupVideoChangeDetection(e,r),this.startAnimation();}catch(e){throw this.log.error("CommentRenderer.initialize",e),e}}addComment(t,e,n=[]){const r=I(t);if(this.isNGComment(t))return x("comment-skip-ng",{preview:r,vposMs:e}),null;const i=Re(e);if(i===null)return this.log.warn("CommentRenderer.addComment.invalidVpos",{text:t,vposMs:e}),x("comment-skip-invalid-vpos",{preview:r,vposMs:e}),null;if(this.comments.some(a=>a.text===t&&a.vposMs===i))return x("comment-skip-duplicate",{preview:r,vposMs:i}),null;const s=new qt(t,i,n,this._settings,this.commentDependencies);return s.creationIndex=this.commentSequence++,x("comment-added",{preview:r,vposMs:i,commands:s.commands.length,layout:s.layout,isScrolling:s.isScrolling,invisible:s.isInvisible}),this.comments.push(s),this.comments.sort((a,l)=>{const d=a.vposMs-l.vposMs;return Math.abs(d)>A?d:a.creationIndex-l.creationIndex}),s}clearComments(){if(this.comments.length=0,this.reservedLanes.clear(),this.topStaticLaneReservations.clear(),this.bottomStaticLaneReservations.clear(),this.commentSequence=0,this.ctx&&this.canvas){const t=this.canvasDpr>0?this.canvasDpr:1,e=this.displayWidth>0?this.displayWidth:this.canvas.width/t,n=this.displayHeight>0?this.displayHeight:this.canvas.height/t;this.ctx.clearRect(0,0,e,n);}}resetState(){this.clearComments(),this.currentTime=0,this.finalPhaseActive=false;}destroy(){this.stopAnimation(),this.cleanupResizeHandling(),this.runCleanupTasks(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.videoElement=null,this.containerElement=null,this.comments.length=0,this.reservedLanes.clear(),this.finalPhaseActive=false,this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.commentSequence=0;}updateSettings(t){const e=this._settings.useContainerResizeObserver,n=this._settings.scrollDirection,r=this._settings.useDprScaling,i=this._settings.syncMode;this.settings=t;const s=n!==this._settings.scrollDirection,a=r!==this._settings.useDprScaling,l=i!==this._settings.syncMode;if(this.comments.forEach(d=>{d.syncWithSettings(this._settings);}),s&&this.resetCommentActivity(),!this._settings.isCommentVisible&&this.ctx&&this.canvas){this.comments.forEach(u=>{u.isActive=false,u.clearActivation();});const d=this.canvasDpr>0?this.canvasDpr:1,h=this.displayWidth>0?this.displayWidth:this.canvas.width/d,c=this.displayHeight>0?this.displayHeight:this.canvas.height/d;this.ctx.clearRect(0,0,h,c),this.reservedLanes.clear(),this.topStaticLaneReservations.clear(),this.bottomStaticLaneReservations.clear();}e!==this._settings.useContainerResizeObserver&&this.videoElement&&this.setupResizeHandling(this.videoElement),a&&this.resize(),l&&this.videoElement&&this.startAnimation();}getVideoElement(){return this.videoElement}getCurrentVideoSource(){const t=this.videoElement;if(!t)return null;if(typeof t.currentSrc=="string"&&t.currentSrc.length>0)return t.currentSrc;const e=t.getAttribute("src");if(e&&e.length>0)return e;const n=t.querySelector("source[src]");return n&&typeof n.src=="string"?n.src:null}getCommentsSnapshot(){return [...this.comments]}isNGComment(t){try{if(typeof t!="string")return !0;if(Array.isArray(this._settings.ngWords)&&this._settings.ngWords.length>0){const e=t.toLowerCase();if(this._settings.ngWords.some(n=>{if(typeof n!="string")return !1;const r=n.trim().toLowerCase();return r.length===0?!1:e.includes(r)}))return !0}return Array.isArray(this._settings.ngRegexps)?this._settings.ngRegexps.some(e=>{if(typeof e!="string"||e.length===0)return !1;try{return new RegExp(e).test(t)}catch(n){return this.log.error("CommentRenderer.isNGComment.regex",n,{pattern:e,text:t}),!1}}):!1}catch(e){return this.log.error("CommentRenderer.isNGComment",e,{text:t}),true}}resize(t,e){const n=this.videoElement,r=this.canvas,i=this.ctx;if(!n||!r)return;const s=n.getBoundingClientRect(),a=this.canvasDpr>0?this.canvasDpr:1,l=this.displayWidth>0?this.displayWidth:r.width/a,d=this.displayHeight>0?this.displayHeight:r.height/a,h=t??s.width??l,c=e??s.height??d;if(!Number.isFinite(h)||!Number.isFinite(c)||h<=0||c<=0)return;const u=Math.max(1,Math.floor(h)),m=Math.max(1,Math.floor(c)),b=this.displayWidth>0?this.displayWidth:u,y=this.displayHeight>0?this.displayHeight:m,g=this._settings.useDprScaling?this.resolveDevicePixelRatio():1,v=Math.max(1,Math.round(u*g)),M=Math.max(1,Math.round(m*g));if(!(this.displayWidth!==u||this.displayHeight!==m||Math.abs(this.canvasDpr-g)>Number.EPSILON||r.width!==v||r.height!==M))return;this.displayWidth=u,this.displayHeight=m,this.canvasDpr=g,r.width=v,r.height=M,r.style.width=`${u}px`,r.style.height=`${m}px`,i&&(i.setTransform(1,0,0,1,0,0),this._settings.useDprScaling&&i.scale(g,g));const C=b>0?u/b:1,R=y>0?m/y:1;(C!==1||R!==1)&&this.comments.forEach(w=>{w.isActive&&(w.x*=C,w.y*=R,w.width*=C,w.fontSize=Math.max(wt,Math.floor(Math.max(1,w.fontSize)*R)),w.height=w.fontSize,w.virtualStartX*=C,w.exitThreshold*=C,w.baseSpeed*=C,w.speed*=C,w.speedPixelsPerMs*=C,w.bufferWidth*=C,w.reservationWidth*=C);}),this.calculateLaneMetrics();}resolveDevicePixelRatio(){if(typeof window>"u")return 1;const t=Number(window.devicePixelRatio);return !Number.isFinite(t)||t<=0?1:t}destroyCanvasOnly(){this.stopAnimation(),this.cleanupResizeHandling(),this.runCleanupTasks(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1;}calculateLaneMetrics(){const t=this.canvas;if(!t)return;const e=this.displayHeight>0?this.displayHeight:t.height/Math.max(this.canvasDpr,1),n=Math.max(wt,Math.floor(e*.05));this.laneHeight=n*1.2;const r=Math.floor(e/Math.max(this.laneHeight,1));if(this._settings.useFixedLaneCount){const i=Number.isFinite(this._settings.fixedLaneCount)?Math.floor(this._settings.fixedLaneCount):xt,s=Math.max(vt,Math.min(r,i));this.laneCount=s;}else this.laneCount=Math.max(vt,r);this.topStaticLaneReservations.clear(),this.bottomStaticLaneReservations.clear();}updateComments(t){const e=this.videoElement,n=this.canvas,r=this.ctx;if(!e||!n||!r)return;const i=typeof t=="number"?t:P(e.currentTime);this.currentTime=i,this.playbackRate=e.playbackRate,this.isPlaying=!e.paused;const s=this.canvasDpr>0?this.canvasDpr:1,a=this.displayWidth>0?this.displayWidth:n.width/s,l=this.displayHeight>0?this.displayHeight:n.height/s,d=this.buildPrepareOptions(a),h=this.duration>0&&this.duration-this.currentTime<=Ne;h&&!this.finalPhaseActive&&(this.finalPhaseActive=true,r.clearRect(0,0,a,l),this.comments.forEach(c=>{c.isActive=false,c.clearActivation();}),this.reservedLanes.clear(),this.topStaticLaneReservations.clear(),this.bottomStaticLaneReservations.clear()),!h&&this.finalPhaseActive&&(this.finalPhaseActive=false),this.pruneStaticLaneReservations(this.currentTime);for(const c of this.comments){const u=T(),m=u?I(c.text):"";if(u&&x("comment-evaluate",{stage:"update",preview:m,vposMs:c.vposMs,currentTime:this.currentTime,isActive:c.isActive,hasShown:c.hasShown}),this.isNGComment(c.text)){u&&x("comment-eval-skip",{preview:m,vposMs:c.vposMs,reason:"ng-runtime"});continue}if(c.isInvisible){u&&x("comment-eval-skip",{preview:m,vposMs:c.vposMs,reason:"invisible"}),c.isActive=false,c.hasShown=true,c.clearActivation();continue}if(c.syncWithSettings(this._settings),this.shouldActivateCommentAtTime(c,this.currentTime,m)&&this.activateComment(c,r,a,l,d,this.currentTime),c.isActive){if(c.layout!=="naka"&&c.hasStaticExpired(this.currentTime)){const b=c.layout==="ue"?"ue":"shita";this.releaseStaticLane(b,c.lane),c.isActive=false,c.clearActivation();continue}if(c.layout==="naka"&&c.vposMs>this.currentTime+St){c.x=c.virtualStartX,c.lastUpdateTime=this.timeSource.now();continue}if(c.hasShown=true,c.update(this.playbackRate,!this.isPlaying),!c.isScrolling&&c.hasStaticExpired(this.currentTime)){const b=c.layout==="ue"?"ue":"shita";this.releaseStaticLane(b,c.lane),c.isActive=false,c.clearActivation();}}}for(const c of this.comments)c.isActive&&c.isScrolling&&(c.scrollDirection==="rtl"&&c.x<=c.exitThreshold||c.scrollDirection==="ltr"&&c.x>=c.exitThreshold)&&(c.isActive=false,c.clearActivation());}buildPrepareOptions(t){const e=this._settings.scrollVisibleDurationMs;let n=Ut,r=bt;return e!==null&&(n=e,r=Math.max(1,Math.min(e,bt))),{visibleWidth:t,virtualExtension:He,maxVisibleDurationMs:n,minVisibleDurationMs:r,maxWidthRatio:Pe,bufferRatio:Fe,baseBufferPx:De,entryBufferPx:Oe}}findAvailableLane(t){const e=this.currentTime;this.pruneLaneReservations(e),this.pruneStaticLaneReservations(e);const n=this.getLanePriorityOrder(e),r=this.createLaneReservation(t,e);for(const s of n)if(this.isLaneAvailable(s,r,e))return this.storeLaneReservation(s,r),s;const i=n[0]??0;return this.storeLaneReservation(i,r),i}pruneLaneReservations(t){for(const[e,n]of this.reservedLanes.entries()){const r=n.filter(i=>i.totalEndTime+B>t);r.length>0?this.reservedLanes.set(e,r):this.reservedLanes.delete(e);}}pruneStaticLaneReservations(t){for(const[e,n]of this.topStaticLaneReservations.entries())n<=t&&this.topStaticLaneReservations.delete(e);for(const[e,n]of this.bottomStaticLaneReservations.entries())n<=t&&this.bottomStaticLaneReservations.delete(e);}getStaticLaneMap(t){return t==="ue"?this.topStaticLaneReservations:this.bottomStaticLaneReservations}getStaticReservedLaneSet(){const t=new Set;for(const e of this.topStaticLaneReservations.keys())t.add(e);for(const e of this.bottomStaticLaneReservations.keys())t.add(e);return t}shouldActivateCommentAtTime(t,e,n=""){const r=n.length>0&&T();return t.isInvisible?(r&&x("comment-eval-skip",{preview:n,vposMs:t.vposMs,reason:"invisible"}),false):t.isActive?(r&&x("comment-eval-skip",{preview:n,vposMs:t.vposMs,reason:"already-active"}),false):t.vposMs>e+St?(r&&x("comment-eval-pending",{preview:n,vposMs:t.vposMs,reason:"future",currentTime:e}),false):t.vposMs<e-yt?(r&&x("comment-eval-skip",{preview:n,vposMs:t.vposMs,reason:"expired-window",currentTime:e}),false):(r&&x("comment-eval-ready",{preview:n,vposMs:t.vposMs,currentTime:e}),true)}activateComment(t,e,n,r,i,s){if(t.prepare(e,n,r,i),T()&&x("comment-prepared",{preview:I(t.text),layout:t.layout,isScrolling:t.isScrolling,width:t.width,height:t.height,bufferWidth:t.bufferWidth,visibleDurationMs:t.visibleDurationMs}),t.layout==="naka"){const h=Math.max(0,s-t.vposMs),c=t.speedPixelsPerMs*h,u=t.getDirectionSign(),m=t.virtualStartX+u*c,b=t.exitThreshold,y=t.scrollDirection;if(y==="rtl"&&m<=b||y==="ltr"&&m>=b){t.isActive=false,t.hasShown=true,t.clearActivation(),t.lane=-1,T()&&x("comment-skip-exited",{preview:I(t.text),vposMs:t.vposMs,referenceTime:s});return}t.lane=this.findAvailableLane(t),t.y=t.lane*this.laneHeight,t.x=m,t.isActive=true,t.hasShown=true,t.isPaused=!this.isPlaying,t.markActivated(s),t.lastUpdateTime=this.timeSource.now(),T()&&x("comment-activate-scroll",{preview:I(t.text),lane:t.lane,startX:t.x,width:t.width,visibleDurationMs:t.visibleDurationMs});return}const a=t.vposMs+N;if(s>a){t.isActive=false,t.hasShown=true,t.clearActivation(),t.lane=-1,T()&&x("comment-skip-expired",{preview:I(t.text),vposMs:t.vposMs,referenceTime:s,displayEnd:a});return}const l=t.layout==="ue"?"ue":"shita",d=this.assignStaticLane(l);t.lane=d,t.y=d*this.laneHeight,t.x=t.virtualStartX,t.isActive=true,t.hasShown=true,t.isPaused=!this.isPlaying,t.markActivated(s),t.lastUpdateTime=this.timeSource.now(),t.staticExpiryTimeMs=a,this.reserveStaticLane(l,d,a),T()&&x("comment-activate-static",{preview:I(t.text),lane:t.lane,position:l,displayEnd:a});}assignStaticLane(t){const e=this.getStaticLaneMap(t),n=Array.from({length:this.laneCount},(s,a)=>a);t==="shita"&&n.reverse();for(const s of n)if(!e.has(s))return s;let r=n[0]??0,i=Number.POSITIVE_INFINITY;for(const[s,a]of e.entries())a<i&&(i=a,r=s);return r}reserveStaticLane(t,e,n){this.getStaticLaneMap(t).set(e,n);}releaseStaticLane(t,e){e<0||this.getStaticLaneMap(t).delete(e);}getLanePriorityOrder(t){const e=Array.from({length:this.laneCount},(s,a)=>a).sort((s,a)=>{const l=this.getLaneNextAvailableTime(s,t),d=this.getLaneNextAvailableTime(a,t);return Math.abs(l-d)<=A?s-a:l-d}),n=this.getStaticReservedLaneSet();if(n.size===0)return e;const r=e.filter(s=>!n.has(s));if(r.length===0)return e;const i=e.filter(s=>n.has(s));return [...r,...i]}getLaneNextAvailableTime(t,e){const n=this.reservedLanes.get(t);if(!n||n.length===0)return e;let r=e;for(const i of n)r=Math.max(r,i.endTime);return r}createLaneReservation(t,e){const n=Math.max(t.speedPixelsPerMs,A),r=Number.isFinite(t.vposMs)?t.vposMs:e,i=Math.max(0,r),s=i+t.preCollisionDurationMs+B,a=i+t.totalDurationMs+B;return {comment:t,startTime:i,endTime:Math.max(i,s),totalEndTime:Math.max(i,a),startLeft:t.virtualStartX,width:t.width,speed:n,buffer:t.bufferWidth,directionSign:t.getDirectionSign()}}isLaneAvailable(t,e,n){const r=this.reservedLanes.get(t);if(!r||r.length===0)return  true;for(const i of r)if(!(i.totalEndTime+B<=n)&&this.areReservationsConflicting(i,e))return  false;return  true}storeLaneReservation(t,e){const n=[...this.reservedLanes.get(t)??[],e].sort((r,i)=>r.endTime-i.endTime);this.reservedLanes.set(t,n);}areReservationsConflicting(t,e){const n=Math.max(t.startTime,e.startTime),r=Math.min(t.endTime,e.endTime);if(n>=r)return  false;const i=new Set([n,r,n+(r-n)/2]),s=this.solveLeftRightEqualityTime(t,e);s!==null&&s>=n-A&&s<=r+A&&i.add(s);const a=this.solveLeftRightEqualityTime(e,t);a!==null&&a>=n-A&&a<=r+A&&i.add(a);for(const l of i){if(l<n-A||l>r+A)continue;const d=this.computeForwardGap(t,e,l),h=this.computeForwardGap(e,t,l);if(d<=A&&h<=A)return  true}return  false}computeForwardGap(t,e,n){const r=this.getBufferedEdges(t,n),i=this.getBufferedEdges(e,n);return r.left-i.right}getBufferedEdges(t,e){const n=Math.max(0,e-t.startTime),r=t.speed*n,i=t.startLeft+t.directionSign*r,s=i-t.buffer,a=i+t.width+t.buffer;return {left:s,right:a}}solveLeftRightEqualityTime(t,e){const n=t.directionSign,r=e.directionSign,i=r*e.speed-n*t.speed;if(Math.abs(i)<A)return null;const s=(e.startLeft+r*e.speed*e.startTime+e.width+e.buffer-t.startLeft-n*t.speed*t.startTime+t.buffer)/i;return Number.isFinite(s)?s:null}draw(){const t=this.canvas,e=this.ctx;if(!t||!e)return;const n=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/n,i=this.displayHeight>0?this.displayHeight:t.height/n;e.clearRect(0,0,r,i);const s=this.comments.filter(l=>l.isActive),a=this.timeSource.now();if(this._settings.isCommentVisible){const l=(a-this.lastDrawTime)/16.666666666666668;s.sort((d,h)=>{const c=d.vposMs-h.vposMs;return Math.abs(c)>A?c:d.isScrolling!==h.isScrolling?d.isScrolling?1:-1:d.creationIndex-h.creationIndex}),s.forEach(d=>{const h=this.isPlaying&&!d.isPaused?d.x+d.getDirectionSign()*d.speed*l:d.x;d.draw(e,h);});}this.lastDrawTime=a;}processFrame(t){this.videoElement&&this._settings.isCommentVisible&&(this.updateComments(t),this.draw());}handleAnimationFrame=()=>{const t=this.frameId;this.frameId=null,t!==null&&this.animationFrameProvider.cancel(t),this.processFrame(),this.scheduleNextFrame();};handleVideoFrame=(t,e)=>{this.videoFrameHandle=null;const n=typeof e?.mediaTime=="number"?e.mediaTime*1e3:void 0;this.processFrame(typeof n=="number"?n:void 0),this.scheduleNextFrame();};shouldUseVideoFrameCallback(){if(this._settings.syncMode!=="video-frame")return  false;const t=this.videoElement;return !!t&&typeof t.requestVideoFrameCallback=="function"&&typeof t.cancelVideoFrameCallback=="function"}scheduleNextFrame(){const t=this.videoElement;if(t){if(this.shouldUseVideoFrameCallback()){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();const e=t.requestVideoFrameCallback;typeof e=="function"&&(this.videoFrameHandle=e.call(t,this.handleVideoFrame));return}this.cancelVideoFrameCallback(),this.frameId=this.animationFrameProvider.request(this.handleAnimationFrame);}}cancelAnimationFrameRequest(){this.frameId!==null&&(this.animationFrameProvider.cancel(this.frameId),this.frameId=null);}cancelVideoFrameCallback(){if(this.videoFrameHandle===null)return;const t=this.videoElement;t&&typeof t.cancelVideoFrameCallback=="function"&&t.cancelVideoFrameCallback(this.videoFrameHandle),this.videoFrameHandle=null;}startAnimation(){this.stopAnimation(),this.scheduleNextFrame();}stopAnimation(){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();}onSeek(){const t=this.canvas,e=this.ctx,n=this.videoElement;if(!t||!e||!n)return;const r=P(n.currentTime);this.currentTime=r,this.finalPhaseActive=false,this.reservedLanes.clear(),this.topStaticLaneReservations.clear(),this.bottomStaticLaneReservations.clear();const i=this.canvasDpr>0?this.canvasDpr:1,s=this.displayWidth>0?this.displayWidth:t.width/i,a=this.displayHeight>0?this.displayHeight:t.height/i,l=this.buildPrepareOptions(s);this.comments.forEach(d=>{const h=T(),c=h?I(d.text):"";if(h&&x("comment-evaluate",{stage:"seek",preview:c,vposMs:d.vposMs,currentTime:this.currentTime,isActive:d.isActive,hasShown:d.hasShown}),this.isNGComment(d.text)){h&&x("comment-eval-skip",{preview:c,vposMs:d.vposMs,reason:"ng-runtime"}),d.isActive=false,d.clearActivation();return}if(d.isInvisible){h&&x("comment-eval-skip",{preview:c,vposMs:d.vposMs,reason:"invisible"}),d.isActive=false,d.hasShown=true,d.clearActivation();return}if(d.syncWithSettings(this._settings),d.isActive=false,d.lane=-1,d.clearActivation(),this.shouldActivateCommentAtTime(d,this.currentTime,c)){this.activateComment(d,e,s,a,l,this.currentTime);return}d.vposMs<this.currentTime-yt?d.hasShown=true:d.hasShown=false;}),this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());}setupVideoEventListeners(t){try{const e=()=>{this.isPlaying=!0;const h=this.timeSource.now();this.lastDrawTime=h,this.comments.forEach(c=>{c.lastUpdateTime=h,c.isPaused=!1;});},n=()=>{this.isPlaying=!1;const h=this.timeSource.now();this.comments.forEach(c=>{c.lastUpdateTime=h,c.isPaused=!0;});},r=()=>{this.onSeek();},i=()=>{this.onSeek();},s=()=>{this.playbackRate=t.playbackRate;const h=this.timeSource.now();this.comments.forEach(c=>{c.lastUpdateTime=h;});},a=()=>{this.handleVideoMetadataLoaded(t);},l=()=>{this.duration=Number.isFinite(t.duration)?P(t.duration):0;},d=()=>{this.handleVideoSourceChange();};t.addEventListener("play",e),t.addEventListener("pause",n),t.addEventListener("seeking",r),t.addEventListener("seeked",i),t.addEventListener("ratechange",s),t.addEventListener("loadedmetadata",a),t.addEventListener("durationchange",l),t.addEventListener("emptied",d),this.addCleanup(()=>t.removeEventListener("play",e)),this.addCleanup(()=>t.removeEventListener("pause",n)),this.addCleanup(()=>t.removeEventListener("seeking",r)),this.addCleanup(()=>t.removeEventListener("seeked",i)),this.addCleanup(()=>t.removeEventListener("ratechange",s)),this.addCleanup(()=>t.removeEventListener("loadedmetadata",a)),this.addCleanup(()=>t.removeEventListener("durationchange",l)),this.addCleanup(()=>t.removeEventListener("emptied",d));}catch(e){throw this.log.error("CommentRenderer.setupVideoEventListeners",e),e}}handleVideoMetadataLoaded(t){this.handleVideoSourceChange(t),this.resize(),this.calculateLaneMetrics(),this.onSeek();}handleVideoSourceChange(t){const e=t??this.videoElement;if(!e){this.isPlaying=false,this.finalPhaseActive=false,this.resetCommentActivity();return}this.syncVideoState(e),this.finalPhaseActive=false,this.resetCommentActivity();}syncVideoState(t){this.duration=Number.isFinite(t.duration)?P(t.duration):0,this.currentTime=P(t.currentTime),this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.lastDrawTime=this.timeSource.now();}resetCommentActivity(){const t=this.timeSource.now(),e=this.canvas,n=this.ctx;if(e&&n){const r=this.canvasDpr>0?this.canvasDpr:1,i=this.displayWidth>0?this.displayWidth:e.width/r,s=this.displayHeight>0?this.displayHeight:e.height/r;n.clearRect(0,0,i,s);}this.reservedLanes.clear(),this.topStaticLaneReservations.clear(),this.bottomStaticLaneReservations.clear(),this.comments.forEach(r=>{r.isActive=false,r.isPaused=!this.isPlaying,r.hasShown=false,r.lane=-1,r.x=r.virtualStartX,r.speed=r.baseSpeed,r.lastUpdateTime=t,r.clearActivation();});}setupVideoChangeDetection(t,e){if(typeof MutationObserver>"u"){this.log.debug("MutationObserver is not available in this environment. Video change detection is disabled.");return}const n=new MutationObserver(i=>{for(const s of i){if(s.type==="attributes"&&s.attributeName==="src"){const a=s.target;let l=null,d=null;if((a instanceof HTMLVideoElement||a instanceof HTMLSourceElement)&&(l=typeof s.oldValue=="string"?s.oldValue:null,d=a.getAttribute("src")),l===d)continue;this.handleVideoSourceChange(t);return}if(s.type==="childList"){for(const a of s.addedNodes)if(a instanceof HTMLSourceElement){this.handleVideoSourceChange(t);return}for(const a of s.removedNodes)if(a instanceof HTMLSourceElement){this.handleVideoSourceChange(t);return}}}});n.observe(t,{attributes:true,attributeFilter:["src"],attributeOldValue:true,childList:true,subtree:true}),this.addCleanup(()=>n.disconnect());const r=new MutationObserver(i=>{for(const s of i)if(s.type==="childList"){for(const a of s.addedNodes){const l=this.extractVideoElement(a);if(l&&l!==this.videoElement){this.initialize(l);return}}for(const a of s.removedNodes){if(a===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}if(a instanceof Element){const l=a.querySelector("video");if(l&&l===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}}}}});r.observe(e,{childList:true,subtree:true}),this.addCleanup(()=>r.disconnect());}extractVideoElement(t){if(t instanceof HTMLVideoElement)return t;if(t instanceof Element){const e=t.querySelector("video");if(e instanceof HTMLVideoElement)return e}return null}setupResizeHandling(t){if(this.cleanupResizeHandling(),this._settings.useContainerResizeObserver&&this.isResizeObserverAvailable){const e=t.parentElement??t,n=new ResizeObserver(r=>{for(const i of r){const{width:s,height:a}=i.contentRect;s>0&&a>0?this.resize(s,a):this.resize();}});n.observe(e),this.resizeObserver=n,this.resizeObserverTarget=e;}else if(typeof window<"u"&&typeof window.addEventListener=="function"){const e=()=>{this.resize();};window.addEventListener("resize",e),this.addCleanup(()=>window.removeEventListener("resize",e));}else this.log.debug("Resize handling is disabled because neither ResizeObserver nor window APIs are available.");}cleanupResizeHandling(){this.resizeObserver&&this.resizeObserverTarget&&this.resizeObserver.unobserve(this.resizeObserverTarget),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.resizeObserverTarget=null;}addCleanup(t){this.cleanupTasks.push(t);}runCleanupTasks(){for(;this.cleanupTasks.length>0;){const t=this.cleanupTasks.pop();try{t?.();}catch(e){this.log.error("CommentRenderer.cleanupTask",e);}}}}const F=()=>$t(),Be="v6.8.0";var Ue=typeof GM_addStyle<"u"?GM_addStyle:void 0,G=typeof GM_getValue<"u"?GM_getValue:void 0,K=typeof GM_setValue<"u"?GM_setValue:void 0,Ge=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const Mt="settings",Et="currentVideo",kt="lastDanimeIds",At="playbackSettings",Ke=o=>({...o,ngWords:[...o.ngWords],ngRegexps:[...o.ngRegexps]}),z={fixedModeEnabled:false,fixedRate:1.11},Y=o=>({fixedModeEnabled:o.fixedModeEnabled,fixedRate:o.fixedRate});class ct{constructor(t){this.notifier=t,this.settings=F(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData(),this.playbackSettings=Y(z),this.loadPlaybackSettings();}settings;currentVideo;observers=new Set;playbackSettings;playbackObservers=new Set;getSettings(){return Ke(this.settings)}loadSettings(){try{const t=G(Mt,null);if(!t)return this.settings=F(),this.settings;if(typeof t=="string"){const e=JSON.parse(t);this.settings={...F(),...e,ngWords:Array.isArray(e?.ngWords)?[...e.ngWords]:[],ngRegexps:Array.isArray(e?.ngRegexps)?[...e.ngRegexps]:[]};}else this.settings={...F(),...t,ngWords:Array.isArray(t.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t.ngRegexps)?[...t.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(t){return console.error("[SettingsManager] 設定の読み込みに失敗しました",t),this.notify("設定の読み込みに失敗しました","error"),this.settings=F(),this.settings}}getPlaybackSettings(){return Y(this.playbackSettings)}loadPlaybackSettings(){try{const t=G(At,null);if(!t)return this.playbackSettings=Y(z),this.notifyPlaybackObservers(),this.playbackSettings;if(typeof t=="string"){const e=JSON.parse(t);this.playbackSettings={fixedModeEnabled:typeof e.fixedModeEnabled=="boolean"?e.fixedModeEnabled:z.fixedModeEnabled,fixedRate:typeof e.fixedRate=="number"?e.fixedRate:z.fixedRate};}else this.playbackSettings={fixedModeEnabled:t.fixedModeEnabled,fixedRate:t.fixedRate};return this.notifyPlaybackObservers(),this.playbackSettings}catch(t){return console.error("[SettingsManager] 再生設定の読み込みに失敗しました",t),this.notify("再生設定の読み込みに失敗しました","error"),this.playbackSettings=Y(z),this.notifyPlaybackObservers(),this.playbackSettings}}updatePlaybackSettings(t){return this.playbackSettings={...this.playbackSettings,...t},this.savePlaybackSettings()}savePlaybackSettings(){try{return K(At,JSON.stringify(this.playbackSettings)),this.notifyPlaybackObservers(),!0}catch(t){return console.error("[SettingsManager] 再生設定の保存に失敗しました",t),this.notify("再生設定の保存に失敗しました","error"),false}}saveSettings(){try{return K(Mt,JSON.stringify(this.settings)),this.notifyObservers(),this.notify("設定を保存しました","success"),!0}catch(t){return console.error("[SettingsManager] 設定の保存に失敗しました",t),this.notify("設定の保存に失敗しました","error"),false}}updateSettings(t){return this.settings={...this.settings,...t,ngWords:t.ngWords?[...t.ngWords]:[...this.settings.ngWords],ngRegexps:t.ngRegexps?[...t.ngRegexps]:[...this.settings.ngRegexps]},this.saveSettings()}addObserver(t){this.observers.add(t);}removeObserver(t){this.observers.delete(t);}addPlaybackObserver(t){this.playbackObservers.add(t);try{t(this.getPlaybackSettings());}catch(e){console.error("[SettingsManager] 再生設定の登録通知でエラー",e);}}removePlaybackObserver(t){this.playbackObservers.delete(t);}notifyObservers(){const t=this.getSettings();for(const e of this.observers)try{e(t);}catch(n){console.error("[SettingsManager] 設定変更通知でエラー",n);}}notifyPlaybackObservers(){const t=this.getPlaybackSettings();for(const e of this.playbackObservers)try{e(t);}catch(n){console.error("[SettingsManager] 再生設定通知でエラー",n);}}loadVideoData(){try{return G(Et,null)??null}catch(t){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",t),this.notify("動画データの読み込みに失敗しました","error"),null}}saveVideoData(t,e){try{const n={videoId:e.videoId,title:e.title,viewCount:e.viewCount,commentCount:e.commentCount,mylistCount:e.mylistCount,postedAt:e.postedAt,thumbnail:e.thumbnail,owner:e.owner??null,channel:e.channel??null};return K(Et,n),this.currentVideo=n,!0}catch(n){return console.error("[SettingsManager] 動画データの保存に失敗しました",n),this.notify("動画データの保存に失敗しました","error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(t){try{return K(kt,t),!0}catch(e){return console.error("[SettingsManager] saveLastDanimeIds failed",e),this.notify("ID情報の保存に失敗しました","error"),false}}loadLastDanimeIds(){try{return G(kt,null)??null}catch(t){return console.error("[SettingsManager] loadLastDanimeIds failed",t),this.notify("ID情報の読込に失敗しました","error"),null}}notify(t,e="info"){this.notifier?.show(t,e);}}const Ye=new Set(["INPUT","TEXTAREA"]),nt=o=>o.length===1?o.toUpperCase():o,je=o=>o?`${o}+`:"";class Gt{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(t,e,n){const r=this.createShortcutKey(nt(t),e);this.shortcuts.set(r,n);}removeShortcut(t,e){const n=this.createShortcutKey(nt(t),e);this.shortcuts.delete(n);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(t){this.isEnabled=t;}createShortcutKey(t,e){return `${je(e)}${t}`}extractModifier(t){const e=[];return t.ctrlKey&&e.push("Ctrl"),t.altKey&&e.push("Alt"),t.shiftKey&&e.push("Shift"),t.metaKey&&e.push("Meta"),e.length>0?e.join("+"):null}handleKeyDown(t){if(!this.isEnabled)return;const n=t.target?.tagName??"";if(Ye.has(n))return;const r=this.extractModifier(t),i=this.createShortcutKey(nt(t.key),r),s=this.shortcuts.get(i);s&&(t.preventDefault(),s());}}const Xe=_("dAnime:CommentRenderer"),Lt=o=>({loggerNamespace:"dAnime:CommentRenderer",...o??{}}),Je=o=>{if(!o||typeof o!="object")return  false;const t=o;return typeof t.commentColor=="string"&&typeof t.commentOpacity=="number"&&typeof t.isCommentVisible=="boolean"};class Kt{renderer;keyboardHandler=null;constructor(t,e){Je(t)||t===null?this.renderer=new Ct(t??null,Lt(e)):this.renderer=new Ct(Lt(t));}get settings(){return this.renderer.settings}set settings(t){this.renderer.settings=t;}initialize(t){this.renderer.initialize(t),this.setupKeyboardShortcuts();}addComment(t,e,n=[]){return this.renderer.addComment(t,e,n)}clearComments(){this.renderer.clearComments();}resetState(){this.renderer.resetState();}destroy(){this.teardownKeyboardShortcuts(),this.renderer.destroy();}updateSettings(t){this.renderer.updateSettings(t);}getVideoElement(){return this.renderer.getVideoElement()}getCurrentVideoSource(){return this.renderer.getCurrentVideoSource()}getCommentsSnapshot(){return this.renderer.getCommentsSnapshot()}isNGComment(t){return this.renderer.isNGComment(t)}resize(t,e){this.renderer.resize(t,e);}setupKeyboardShortcuts(){this.teardownKeyboardShortcuts();const t=new Gt;t.addShortcut("C","Shift",()=>{try{const e=this.renderer.settings,n={...e,isCommentVisible:!e.isCommentVisible};this.renderer.updateSettings(n),this.syncGlobalSettings(n);}catch(e){Xe.error("CommentRenderer.keyboardShortcut",e);}}),t.startListening(),this.keyboardHandler=t;}teardownKeyboardShortcuts(){this.keyboardHandler?.stopListening(),this.keyboardHandler=null;}syncGlobalSettings(t){window.dAniRenderer?.settingsManager?.updateSettings(t);}}class dt{shadowRoot=null;container=null;createShadowDOM(t,e={mode:"closed"}){if(!t)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=t.attachShadow(e),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(t){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const e=document.createElement("style");e.textContent=t,this.shadowRoot.appendChild(e);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}querySelectorAll(t){return this.shadowRoot?this.shadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}setHTML(t){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=t;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const Ze=`\r
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
min-height: 55vh;\r
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
`,Qe=`:host {
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
`,tn=`:host {
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
`;class q{static getCommonStyles(){return Ze}static getNotificationStyles(){return Qe}static getAutoButtonStyles(){return tn}}const Vt={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class f extends dt{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new f),this.instance}static show(t,e="info",n=3e3){try{const r=this.getInstance();return r.initialize(),r.initialized?r.createNotification(t,e,n):null}catch(r){return console.error("[NotificationManager] show failed",r),null}}static removeNotification(t){this.getInstance().removeNotification(t.element);}show(t,e="info"){f.show(t,e);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 2147483647","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(q.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(t){console.error("[NotificationManager] initialize failed",t),this.initialized=false;}}destroy(){f.notifications.forEach(t=>{t.timerId&&window.clearTimeout(t.timerId);}),f.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,f.instance=null;}createNotification(t,e,n){try{const r=this.querySelector(".notification-container");if(!r)throw new Error("Notification container not found");const i=Vt[e]??Vt.info,s=document.createElement("div");s.className=`notification-item ${e}`;const a=document.createElement("div");a.className="notification-icon",a.innerHTML=`<span>${i}</span>`,s.appendChild(a);const l=document.createElement("div");l.className="notification-content";const d=document.createElement("div");d.className="notification-type",d.textContent=e.charAt(0).toUpperCase()+e.slice(1),l.appendChild(d);const h=document.createElement("div");h.className="notification-message",h.textContent=t||"No message",l.appendChild(h),s.appendChild(l);const c=document.createElement("button");c.className="notification-close",c.innerHTML="&times;",c.addEventListener("click",()=>{this.removeNotification(s);}),s.appendChild(c),r.appendChild(s),requestAnimationFrame(()=>{s.classList.add("show");});const u={element:s,timerId:window.setTimeout(()=>{this.removeNotification(s);},n)};return f.notifications.push(u),u}catch(r){return console.error("[NotificationManager] createNotification failed",r),null}}removeNotification(t){if(!t)return;const e=f.notifications.find(n=>n.element===t);e?.timerId&&window.clearTimeout(e.timerId),t.classList.remove("show"),window.setTimeout(()=>{try{t.remove(),f.notifications=f.notifications.filter(n=>n.element!==t);}catch(n){console.error("[NotificationManager] removeNotification cleanup failed",n);}},500);}}const Yt="https://www.nicovideo.jp",jt=`${Yt}/search`,Xt=`${Yt}/watch`,Tt={searchBase:jt,watchBase:Xt},en=o=>`${Xt}/${o}`,Jt=o=>`${jt}/${encodeURIComponent(o)}`,at=o=>new Promise((t,e)=>{Ge({url:o.url,method:o.method??"GET",headers:o.headers,data:o.data,responseType:o.responseType??"text",timeout:o.timeout,onprogress:o.onprogress,onload:n=>{t({status:n.status,statusText:n.statusText,response:n.response,finalUrl:n.finalUrl,headers:n.responseHeaders});},onerror:n=>{const r=n?.error??"unknown error";e(new Error(`GM_xmlhttpRequest failed: ${r}`));},ontimeout:()=>{e(new Error("GM_xmlhttpRequest timeout"));}});}),rt=_("dAnime:NicoApiFetcher");class ht{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(t){try{const e=this.sanitizeVideoId(t),r=(await at({method:"GET",url:en(e),headers:{Accept:"text/html"}})).response,a=new DOMParser().parseFromString(r,"text/html").querySelector('meta[name="server-response"]');if(!a)throw new Error("API data element not found in response");const l=a.getAttribute("content");if(!l)throw new Error("API data content is empty");const d=this.decodeServerResponse(l),c=JSON.parse(d).data?.response;if(!c)throw new Error("Invalid API data structure");return this.apiData=c,c}catch(e){throw rt.error("NicoApiFetcher.fetchApiData",e),e}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const t=this.apiData.comment?.nvComment;if(!t?.server||!t.params||!t.threadKey)throw new Error("Required comment server data is missing");const e=await at({method:"POST",url:`${t.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:t.params,threadKey:t.threadKey,additionals:{}})}),i=(JSON.parse(e.response).data?.threads??[]).filter(a=>a.fork==="main").sort((a,l)=>(l.commentCount||0)-(a.commentCount||0))[0];if(!i)throw new Error("Main thread not found in comment response");const s=(i.comments??[]).map(a=>({text:a.body??"",vposMs:a.vposMs??0,commands:a.commands??[]}));return this.comments=s,s}catch(t){throw rt.error("NicoApiFetcher.fetchComments",t),t}}async fetchAllData(t){return await this.fetchApiData(t),this.fetchComments()}sanitizeVideoId(t){try{let e=encodeURIComponent(t);return e=e.replace(/%([0-9A-F]{2})/gi,(n,r)=>{const i=parseInt(r,16);return i>=65&&i<=90||i>=97&&i<=122||i>=48&&i<=57||i===45||i===95||i===46||i===126?String.fromCharCode(i):n}),e}catch(e){return rt.error("NicoApiFetcher.sanitizeVideoId",e,{videoId:t}),t}}decodeServerResponse(t){try{return decodeURIComponent(t)}catch(e){try{const n=t.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(n)}catch{throw new Error(`API data decode failed: ${e.message}`)}}}}const It=_("dAnime:NicoVideoSearcher");class Zt{cache=new Map;async search(t){if(!t.trim())return [];if(this.cache.has(t))return this.cache.get(t)??[];const e=Jt(t),n=await this.fetchText(e),r=this.parseServerContext(n).map(a=>{const l=this.calculateLevenshteinDistance(t,a.title),d=Math.max(t.length,a.title.length),h=d>0?(1-l/d)*100:0;return {...a,levenshteinDistance:l,similarity:h}}),i=[],s=new Set;for(const a of r)a?.videoId&&(s.has(a.videoId)||(s.add(a.videoId),i.push(a)));return i.sort((a,l)=>{const d=a.similarity??-1,h=l.similarity??-1;return d!==h?h-d:l.viewCount-a.viewCount}),this.cache.set(t,i),i}async fetchText(t){return (await at({method:"GET",url:t})).response}parseServerContext(t){try{const n=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!n)return [];const r=n.getAttribute("content")??"",i=this.decodeHtmlEntities(r);let s;try{s=JSON.parse(i);}catch(a){return It.error("NicoVideoSearcher.parseServerContext",a),[]}return this.extractVideoItems(s??{})}catch(e){return It.error("NicoVideoSearcher.parseServerContext",e),[]}}decodeHtmlEntities(t){if(!t)return "";let e=t.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return e=e.replace(/&#(\d+);/g,(n,r)=>String.fromCharCode(parseInt(r,10))),e=e.replace(/&#x([0-9a-fA-F]+);/g,(n,r)=>String.fromCharCode(parseInt(r,16))),e}extractVideoItems(t){const e=[],n=i=>{const s=(i?.id??i?.contentId??i?.watchId??"").toString();if(!s)return;const a=(i?.title??i?.shortTitle??"").toString(),l=i?.count??{},d=Number(l.view??i?.viewCounter??0)||0,h=Number(l.comment??i?.commentCounter??0)||0,c=Number(l.mylist??i?.mylistCounter??0)||0,u=i?.thumbnail??{},m=(u.nHdUrl||u.listingUrl||u.largeUrl||u.middleUrl||u.url||i?.thumbnailUrl||"").toString(),b=(i?.registeredAt||i?.startTime||i?.postedDateTime||"")?.toString?.()??"",y=i?.owner&&typeof i.owner=="object"?{nickname:(i.owner.nickname??i.owner.name??"")||void 0,name:(i.owner.name??i.owner.nickname??"")||void 0}:null,g=(i?.isChannelVideo||i?.owner?.ownerType==="channel")&&i?.owner?{name:i.owner.name??""}:null;a&&e.push({videoId:s,title:a,viewCount:d,commentCount:h,mylistCount:c,thumbnail:m,postedAt:b,owner:y,channel:g});},r=i=>{if(!i)return;if(Array.isArray(i)){i.forEach(r);return}if(typeof i!="object"||i===null)return;const s=i;(s.id||s.contentId||s.watchId)&&n(s),Object.values(i).forEach(r);};return r(t),e}calculateLevenshteinDistance(t,e){const n=t?t.length:0,r=e?e.length:0;if(n===0)return r;if(r===0)return n;const i=new Array(r+1);for(let a=0;a<=r;++a){const l=i[a]=new Array(n+1);l[0]=a;}const s=i[0];for(let a=1;a<=n;++a)s[a]=a;for(let a=1;a<=r;++a)for(let l=1;l<=n;++l){const d=t[l-1]===e[a-1]?0:1;i[a][l]=Math.min(i[a-1][l]+1,i[a][l-1]+1,i[a-1][l-1]+d);}return i[r][n]}}const E={mypageHeaderTitle:".p-mypageHeader__title",mypageListContainer:".p-mypageMain",watchVideoElement:"video#video",mypageItem:".itemModule.list",mypageItemTitle:".line1",mypageEpisodeNumber:".number.line1 span",mypageEpisodeTitle:".episode.line1 span"};class ut{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(t){this.delay=t;}getFuncId(t){return this.funcIds.has(t)||this.funcIds.set(t,this.nextId++),this.funcIds.get(t)??0}exec(t){const e=this.getFuncId(t),n=Date.now(),r=this.timers.get(e)?.lastExec??0,i=n-r;if(i>this.delay)t(),this.timers.set(e,{lastExec:n});else {clearTimeout(this.timers.get(e)?.timerId??void 0);const s=setTimeout(()=>{t(),this.timers.set(e,{lastExec:Date.now()});},this.delay-i);this.timers.set(e,{timerId:s,lastExec:r});}}execOnce(t){const e=this.getFuncId(t),n=this.timers.get(e);if(n?.executedOnce){n.timerId&&clearTimeout(n.timerId);return}n?.timerId&&clearTimeout(n.timerId);const r=setTimeout(()=>{try{t();}finally{this.timers.set(e,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(e,{timerId:r,executedOnce:false,scheduled:true});}cancel(t){const e=this.getFuncId(t),n=this.timers.get(e);n?.timerId&&clearTimeout(n.timerId),this.timers.delete(e);}resetExecution(t){const e=this.getFuncId(t),n=this.timers.get(e);n&&(n.timerId&&clearTimeout(n.timerId),this.timers.set(e,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,t]of this.timers)t.timerId&&clearTimeout(t.timerId);this.timers.clear(),this.funcIds.clear();}}const nn=1e3,rn=100,sn=30,_t=1e4,Rt=100,an=/watch\/(?:([a-z]{2}))?(\d+)/gi,S=_("dAnime:VideoSwitchHandler"),Pt=o=>{if(!o?.video)return null;const t=o.video.registeredAt,e=t?new Date(t).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:o.video.id,title:o.video.title,viewCount:o.video.count?.view,mylistCount:o.video.count?.mylist,commentCount:o.video.count?.comment,postedAt:e,thumbnail:o.video.thumbnail?.url,owner:o.owner??null,channel:o.channel??null}},on=o=>{const t=[];let e;for(;(e=an.exec(o))!==null;){const[,n="",r=""]=e;r&&t.push(`${n}${r}`);}return t};class Qt{constructor(t,e,n,r=nn,i=rn){this.renderer=t,this.fetcher=e,this.settingsManager=n,this.monitorInterval=r,this.debounce=new ut(i);}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=false;debounce;startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(t){if(!this.isSwitching){this.isSwitching=true;try{const e=await this.resolveVideoElement(t)??null,n=this.preloadedComments??this.lastPreloadedComments??null,r=e?.dataset?.videoId??e?.getAttribute?.("data-video-id")??null,i=this.nextVideoId??r??this.lastVideoId;if(!e||!i&&!n){this.handleMissingVideoInfo(n);return}S.info("videoSwitch:start",{videoId:i??null,elementVideoId:e.dataset?.videoId??null,preloadedCount:n?.length??0}),f.show("動画の切り替わりを検知しました...","info"),this.resetRendererState(e);const s=this.renderer.getVideoElement();if(s!==e&&e)S.debug("videoSwitch:rebind",{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof e.currentSrc=="string"&&e.currentSrc.length>0?e.currentSrc:e.getAttribute("src")??null}),this.renderer.initialize(e);else if(s===e&&e&&this.hasVideoSourceChanged(e))S.debug("videoSwitch:rebind:sameElement",{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(e)}),this.renderer.destroy(),this.renderer.initialize(e);else if(!s&&!e){S.warn("videoSwitch:missingVideoElement",{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let a=null;i&&(a=await this.fetchVideoApiData(i,n),a&&(this.persistVideoMetadata(a),this.lastVideoId=i));const l=await this.populateComments(i,n);if(l===0?(this.renderer.clearComments(),f.show("コメントを取得できませんでした","warning"),S.warn("videoSwitch:commentsMissing",{videoId:i??null})):S.info("videoSwitch:commentsLoaded",{videoId:i??null,count:l}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(e),a){const d=Pt(a);if(d){const h=`コメントソースを更新しました: ${d.title??"不明なタイトル"}（${l}件）`;f.show(h,l>0?"success":"warning");}}}catch(e){S.error("videoSwitch:error",e,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),f.show(`動画切り替えエラー: ${e.message}`,"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}}async resolveVideoElement(t){if(t){const r=this.getVideoSource(t),i=this.lastVideoSource;return (!r||r===i)&&await this.waitForSourceChange(t),t}const e=Date.now()+_t;let n=null;for(;Date.now()<e;){const r=document.querySelector(E.watchVideoElement);if(r){n=r;const i=this.hasVideoSourceChanged(r);if(r.readyState>=2||!r.paused||i)return i&&(this.lastVideoSource=null),r}await new Promise(i=>window.setTimeout(i,Rt));}return n}async waitForSourceChange(t){const e=this.getVideoSource(t);if(!e)return;const n=Date.now()+_t;for(;Date.now()<n;){const r=this.getVideoSource(t);if(r&&r!==e){this.lastVideoSource=null;return}await new Promise(i=>window.setTimeout(i,Rt));}}hasVideoSourceChanged(t){const e=this.getVideoSource(t);return e?this.lastVideoSource?this.lastVideoSource!==e:true:false}getVideoSource(t){if(!t)return null;const e=typeof t.currentSrc=="string"?t.currentSrc:"";if(e.length>0)return e;const n=t.getAttribute("src")??"";if(n.length>0)return n;const r=t.querySelector("source[src]");return r&&typeof r.src=="string"&&r.src.length>0?r.src:null}resetRendererState(t){try{t.currentTime=0;}catch(e){S.debug("videoSwitch:resetCurrentTimeFailed",e);}this.renderer.clearComments();}async checkVideoEnd(){const t=this.renderer.getVideoElement();if(!(!t||!Number.isFinite(t.duration)||t.duration-t.currentTime>sn)){if(!this.nextVideoId){const n=async()=>{await this.findNextVideoId();};this.debounce.execOnce(n);}if(this.nextVideoId&&!this.preloadedComments){const n=async()=>{await this.preloadComments();};this.debounce.execOnce(n);}}}handleMissingVideoInfo(t){t||(this.renderer.clearComments(),f.show("次の動画のコメントを取得できませんでした。コメント表示をクリアします。","warning"));}async fetchVideoApiData(t,e){try{const n=await this.fetcher.fetchApiData(t);return S.debug("videoSwitch:apiFetched",{videoId:t}),n}catch(n){if(S.error("videoSwitch:apiFetchError",n,{videoId:t}),!e)throw n;return null}}persistVideoMetadata(t){const e=Pt(t);e&&this.settingsManager.saveVideoData(e.title??"",e);}async populateComments(t,e){let n=null;if(Array.isArray(e)&&e.length>0)n=e;else if(t)try{n=await this.fetcher.fetchAllData(t),S.debug("videoSwitch:commentsFetched",{videoId:t,count:n.length});}catch(i){S.error("videoSwitch:commentsFetchError",i,{videoId:t}),f.show(`コメント取得エラー: ${i.message}`,"error"),n=null;}if(!n||n.length===0)return 0;const r=n.filter(i=>!this.renderer.isNGComment(i.text));return r.forEach(i=>{this.renderer.addComment(i.text,i.vposMs,i.commands);}),this.lastPreloadedComments=[...r],r.length}async findNextVideoId(){try{const t=this.fetcher.lastApiData;if(!t)return;const e=t.series?.video?.next?.id;if(e){this.nextVideoId=e,S.debug("videoSwitch:detectedNext",{videoId:e});return}const n=t.video?.description??"";if(!n)return;const r=on(n);if(r.length===0)return;const i=[...r].sort((s,a)=>{const l=parseInt(s.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(a.replace(/^[a-z]{2}/i,""),10)||0)-l});this.nextVideoId=i[0]??null,this.nextVideoId&&S.debug("videoSwitch:candidateFromDescription",{candidate:this.nextVideoId});}catch(t){S.error("videoSwitch:nextIdError",t,{lastVideoId:this.lastVideoId});}}async preloadComments(){if(this.nextVideoId)try{const e=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(n=>!this.renderer.isNGComment(n.text));this.preloadedComments=e.length>0?e:null,S.debug("videoSwitch:preloaded",{videoId:this.nextVideoId,count:e.length});}catch(t){S.error("videoSwitch:preloadError",t,{videoId:this.nextVideoId}),this.preloadedComments=null;}}}const ln=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class te{static initialize(){Ue(ln);}}var cn="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z",dn="M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z",hn="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",un="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z",pn="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z",mn="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z",gn="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",fn="M5,4V7H10.5V19H13.5V7H19V4H5Z",bn="M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z",yn="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",vn="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",xn="M8,5.14V19.14L19,12.14L8,5.14Z",wn="M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z",Sn="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";function k(o,t=24){const e=String(t),n=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${n}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${o}"></path></svg>`}const Ft=k(xn),Cn=k(hn),Mn=k(vn),En=k(yn),it=k(un),kn=k(bn),An=k(fn),Ln=k(cn),Vn=k(gn),Tn=k(mn),In=k(wn),_n=k(dn),Rn=k(pn),Pn=k(Sn),O=_("dAnime:SettingsUI"),p={searchInput:"#searchInput",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",opacitySelect:"#commentOpacity",visibilityToggle:"#commentVisibilityToggle",fixedPlaybackToggle:"#fixedPlaybackToggle",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",colorValue:".color-value",colorPreview:".color-preview",colorPickerInput:"#colorPickerInput",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",playCurrentVideo:"#playCurrentVideo",settingsModal:"#settingsModal",closeSettingsModal:"#closeSettingsModal",modalOverlay:".settings-modal__overlay",modalTabs:".settings-modal__tab",modalPane:".settings-modal__pane"},W=["search","display","ng"],Dt=`
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
`,Fn=`
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
`;class X extends dt{static FAB_HOST_ID="danime-settings-fab-host";settingsManager;fetcher;searcher;settings;playbackSettings;currentVideoInfo;hostElement=null;lastAutoButtonElement=null;activeTab="search";modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;handleFabClick=t=>{t.preventDefault(),this.openSettingsModal();};handleOverlayClick=()=>{this.closeSettingsModal();};handleCloseClick=()=>{this.closeSettingsModal();};handlePlaybackSettingsChanged;constructor(t,e=new ht,n=new Zt){super(),this.settingsManager=t,this.fetcher=e,this.searcher=n,this.settings=this.settingsManager.getSettings(),this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData(),this.handlePlaybackSettingsChanged=r=>{this.playbackSettings=r,this.applyPlaybackSettingsToUI();},this.settingsManager.addPlaybackObserver(this.handlePlaybackSettingsChanged);}insertIntoMypage(){const t=document.querySelector(E.mypageHeaderTitle);t&&(this.hostElement=this.createSettingsUI(),t.parentElement?.insertBefore(this.hostElement,t.nextSibling),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}}));}addAutoCommentButtons(){document.querySelectorAll(E.mypageItem).forEach(e=>{const n=e.querySelector(E.mypageItemTitle);if(!n||n.querySelector(".auto-comment-button-host"))return;const r=n.querySelector("span")?.textContent?.trim()??"",i=e.querySelector(E.mypageEpisodeNumber)?.textContent?.trim()??"",s=e.querySelector(E.mypageEpisodeTitle)?.textContent?.trim()??"",a=document.createElement("div");a.className="nico-comment-shadow-host auto-comment-button-host",a.style.cssText="position:absolute;left:150px;top:3px;margin-left:8px;";const l=a.attachShadow({mode:"closed"}),d=document.createElement("style");d.textContent=q.getAutoButtonStyles(),l.appendChild(d);const h=document.createElement("button");h.className="auto-comment-button",h.innerHTML=it,h.setAttribute("aria-label","コメント設定"),h.setAttribute("title","コメント設定"),h.setAttribute("type","button"),h.addEventListener("click",async c=>{c.preventDefault(),c.stopPropagation(),c.stopImmediatePropagation();try{const u=[r,i,s].filter(Boolean).join(" ");this.openSettingsModal(!1),this.setSearchKeyword(u),this.lastAutoButtonElement=a;try{const b=e.querySelector('input[name="workId"]')?.value?.trim()??"",y=e.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),g=e.querySelector('a.textContainer[href*="partId="]');let v="";const C=(y?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);C?v=C[1]:g?.href&&(v=(new URL(g.href,location.origin).searchParams.get("partId")??"").trim()),b&&v&&this.settingsManager.saveLastDanimeIds({workId:b,partId:v});}catch(b){console.warn("[SettingsUI] save (workId, partId) skipped:",b);}const m=await this.executeSearch(u);if(m.length===0)return;await this.applySearchResult(m[0]);}catch(u){O.error("SettingsUI.autoCommentButton",u);}}),l.appendChild(h),n.appendChild(a),this.lastAutoButtonElement=a;}),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}});}async waitMypageListStable(){const t=document.querySelector(E.mypageListContainer);if(!t)return;let e=t.querySelectorAll(E.mypageItem).length;const n=Date.now()+1500;return new Promise(r=>{const i=new MutationObserver(()=>{const s=t.querySelectorAll(E.mypageItem).length;if(s!==e){e=s;return}Date.now()>=n&&(i.disconnect(),r());});i.observe(t,{childList:true,subtree:true}),setTimeout(()=>{try{i.disconnect();}catch(s){O.debug("waitMypageListStable: observer already disconnected",s);}r();},1600);})}tryRestoreByDanimeIds(){const t=this.settingsManager.loadLastDanimeIds();if(!t)return  false;const e=Array.from(document.querySelectorAll(E.mypageItem));for(const n of e){if(n.querySelector('input[name="workId"]')?.value?.trim()!==t.workId)continue;const i=n.querySelector('a.textContainer[href*="partId="]'),s=i?.href?(new URL(i.href,location.origin).searchParams.get("partId")??"")===t.partId:false,a=n.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),l=(()=>{const h=(a?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);return !!h&&h[1]===t.partId})();if(s||l){const d=n.querySelector(".auto-comment-button-host")??n;return this.lastAutoButtonElement=d,this.updatePlayButtonState(this.currentVideoInfo),true}}return  false}createSettingsUI(){const t=document.createElement("div");t.className="nico-comment-shadow-host settings-host",this.createShadowDOM(t),this.addStyles(q.getCommonStyles());const e=this.buildSettingsHtml();return this.setHTML(e),this.applySettingsToUI(),this.addStyles(Dt),this.setupEventListeners(),t}buildSettingsHtml(){const t=r=>typeof r=="number"?r.toLocaleString():"-",e=r=>{if(!r)return "-";try{return new Date(r).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return r}},n=this.currentVideoInfo;return `
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="バージョン">${Be}</span>
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
                <span class="info-icon" aria-hidden="true">${kn}</span>
                <span class="sr-only">動画ID</span>
                <span class="info-value" id="currentVideoId">${n?.videoId??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="タイトル">
                <span class="info-icon" aria-hidden="true">${An}</span>
                <span class="sr-only">タイトル</span>
                <span class="info-value" id="currentTitle">${n?.title??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="投稿者">
                <span class="info-icon" aria-hidden="true">${Ln}</span>
                <span class="sr-only">投稿者</span>
                <span class="info-value" id="currentOwner">${n?.owner?.nickname??n?.channel?.name??"-"}</span>
              </div>
              <div class="info-item" role="listitem" title="再生数">
                <span class="info-icon" aria-hidden="true">${Vn}</span>
                <span class="sr-only">再生数</span>
                <span class="info-value" id="currentViewCount">${t(n?.viewCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="コメント数">
                <span class="info-icon" aria-hidden="true">${Tn}</span>
                <span class="sr-only">コメント数</span>
                <span class="info-value" id="currentCommentCount">${t(n?.commentCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="マイリスト数">
                <span class="info-icon" aria-hidden="true">${In}</span>
                <span class="sr-only">マイリスト数</span>
                <span class="info-value" id="currentMylistCount">${t(n?.mylistCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="投稿日">
                <span class="info-icon" aria-hidden="true">${_n}</span>
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
              <span aria-hidden="true">${Cn}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${it}</span>
              <span class="settings-modal__tab-label">検索</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="display" role="tab" aria-selected="false" aria-controls="settingsPaneDisplay" id="settingsTabDisplay" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${Mn}</span>
              <span class="settings-modal__tab-label">表示</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${En}</span>
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
              <span class="settings-modal__play-icon" aria-hidden="true">${Ft}</span>
              <span class="settings-modal__play-label">動画を再生</span>
            </button>
            <button id="saveSettings" type="button">設定を保存</button>
          </footer>
        </div>
      </div>
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupColorPresets(),this.setupColorPicker(),this.setupOpacitySelect(),this.setupVisibilityToggle(),this.setupPlaybackToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupPlayButton();}setupModalControls(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick);const t=this.createOrUpdateFab(),e=this.queryModalElement(p.settingsModal),n=this.queryModalElement(p.closeSettingsModal),r=this.queryModalElement(p.modalOverlay);this.modalElement=e??null,this.closeButtonElement=n??null,this.overlayElement=r??null,!(!e||!n||!r||!t)&&(this.fabElement?.removeEventListener("click",this.handleFabClick),t.addEventListener("click",this.handleFabClick),t.setAttribute("aria-controls",e.id),t.setAttribute("aria-haspopup","dialog"),t.setAttribute("aria-expanded","false"),this.fabElement=t,n.addEventListener("click",this.handleCloseClick),r.addEventListener("click",this.handleOverlayClick),this.shadowRoot?.addEventListener("keydown",i=>{const s=i;s.key==="Escape"&&!this.modalElement?.classList.contains("hidden")&&(s.preventDefault(),this.closeSettingsModal());}),this.applySettingsToUI());}setupModalTabs(){const t=Array.from(this.queryModalSelectorAll(p.modalTabs)),e=Array.from(this.queryModalSelectorAll(p.modalPane));if(t.length===0||e.length===0)return;const n=r=>{t.forEach(i=>{const a=this.toModalTabKey(i.dataset.tab)===r;i.classList.toggle("is-active",a),i.setAttribute("aria-selected",String(a)),i.setAttribute("tabindex",a?"0":"-1");}),e.forEach(i=>{const a=this.toModalTabKey(i.dataset.pane)===r;i.classList.toggle("is-active",a),i.setAttribute("aria-hidden",String(!a));}),this.activeTab=r;};t.forEach(r=>{r.addEventListener("click",()=>{const i=this.toModalTabKey(r.dataset.tab);i&&n(i);}),r.addEventListener("keydown",i=>{const s=i;if(s.key!=="ArrowRight"&&s.key!=="ArrowLeft")return;s.preventDefault();const a=this.toModalTabKey(r.dataset.tab);if(!a)return;const l=s.key==="ArrowRight"?1:-1,d=(W.indexOf(a)+l+W.length)%W.length,h=W[d];n(h),t.find(u=>this.toModalTabKey(u.dataset.tab)===h)?.focus({preventScroll:true});});}),n(this.activeTab);}openSettingsModal(t=true){!this.modalElement||!this.fabElement||(this.modalElement.classList.remove("hidden"),this.modalElement.setAttribute("aria-hidden","false"),this.fabElement.setAttribute("aria-expanded","true"),t&&this.queryModalElement(`${p.modalTabs}.is-active`)?.focus({preventScroll:true}));}closeSettingsModal(){!this.modalElement||!this.fabElement||(this.modalElement.classList.add("hidden"),this.modalElement.setAttribute("aria-hidden","true"),this.fabElement.setAttribute("aria-expanded","false"),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:true}));}toModalTabKey(t){return t&&W.includes(t)?t:null}setupColorPresets(){this.queryModalSelectorAll(".color-preset-btn").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.color;if(!n)return;this.settings.commentColor=n;const r=this.queryModalElement(p.colorPreview),i=this.queryModalElement(p.colorValue);r&&(r.style.backgroundColor=n),i&&(i.textContent=n);});});}setupColorPicker(){const t=this.queryModalElement(p.colorPickerInput);t&&t.addEventListener("input",()=>{this.settings.commentColor=t.value;const e=this.queryModalElement(p.colorPreview),n=this.queryModalElement(p.colorValue);e&&(e.style.backgroundColor=t.value),n&&(n.textContent=t.value);});}setupOpacitySelect(){const t=this.queryModalElement(p.opacitySelect);t&&(t.value=this.settings.commentOpacity.toString(),t.addEventListener("change",()=>{const e=Number(t.value);Number.isNaN(e)||(this.settings.commentOpacity=e);}));}setupVisibilityToggle(){const t=this.queryModalElement(p.visibilityToggle);t&&(t.addEventListener("click",()=>{this.settings.isCommentVisible=!this.settings.isCommentVisible,this.updateVisibilityToggleState(t);}),this.updateVisibilityToggleState(t));}setupPlaybackToggle(){const t=this.queryModalElement(p.fixedPlaybackToggle);t&&(t.addEventListener("click",()=>{const e=!this.playbackSettings.fixedModeEnabled,n={...this.playbackSettings,fixedModeEnabled:e};if(!this.settingsManager.updatePlaybackSettings(n)){f.show("再生速度の設定変更に失敗しました","error"),this.applyPlaybackSettingsToUI();return}this.playbackSettings=n,this.updatePlaybackToggleState(t),f.show(e?`${this.formatPlaybackRateLabel(this.playbackSettings.fixedRate)}固定モードを有効にしました`:"固定再生モードを無効にしました","success");}),this.updatePlaybackToggleState(t));}setupNgControls(){const t=this.queryModalElement(p.ngWords);t&&t.classList.remove("hidden");const e=this.queryModalElement(p.ngRegexps);e&&e.classList.remove("hidden");}setupSaveButton(){const t=this.queryModalElement(p.saveButton);t&&t.addEventListener("click",()=>this.saveSettings());}setupSearch(){const t=this.queryModalElement(p.searchInput),e=this.queryModalElement(p.searchButton),n=this.queryModalElement(p.openSearchPage),r=async()=>{const i=t?.value.trim();if(!i){f.show("キーワードを入力してください","warning");return}await this.executeSearch(i);};e?.addEventListener("click",r),t?.addEventListener("keydown",i=>{i.key==="Enter"&&r();}),n?.addEventListener("click",i=>{i.preventDefault();const s=t?.value.trim(),a=s?Jt(s):Tt.searchBase;ot().open(a,"_blank","noopener");});}async executeSearch(t){try{f.show(`「${t}」を検索中...`,"info");const e=await this.searcher.search(t);return this.renderSearchResults(e,n=>this.renderSearchResultItem(n)),e.length===0&&f.show("検索結果が見つかりませんでした","warning"),e}catch(e){return O.error("SettingsUI.executeSearch",e),[]}}setSearchKeyword(t){const e=this.queryModalElement(p.searchInput);e&&(e.value=t,e.focus({preventScroll:true}));}renderSearchResults(t,e){const n=this.queryModalElement(p.searchResults);if(!n)return;n.innerHTML=t.map(i=>e(i)).join(""),n.querySelectorAll(".search-result-item").forEach((i,s)=>{i.addEventListener("click",()=>{const l=t[s];this.applySearchResult(l);});const a=i.querySelector(".open-search-page-direct-btn");a&&a.addEventListener("click",l=>{l.stopPropagation();});});}renderSearchResultItem(t){const e=this.formatSearchResultDate(t.postedAt),n=typeof t.similarity=="number"?`
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
              ${Ft}
            </span>
            <span>${t.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="コメント">
              ${Rn}
            </span>
            <span>${t.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="マイリスト">
              ${Pn}
            </span>
            <span>${t.mylistCount.toLocaleString()}</span>
            ${n}
          </div>
          <div class="date">${e}</div>
          <a href="${Tt.watchBase}/${t.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(t){try{const e=await this.fetcher.fetchApiData(t.videoId);await this.fetcher.fetchComments(),f.show(`「${t.title}」のコメントを設定しました`,"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(t,e));}catch(e){O.error("SettingsUI.applySearchResult",e);}}buildVideoMetadata(t,e){return {videoId:t.videoId,title:t.title,viewCount:e.video?.count?.view??t.viewCount,commentCount:e.video?.count?.comment??t.commentCount,mylistCount:e.video?.count?.mylist??t.mylistCount,postedAt:e.video?.registeredAt??t.postedAt,thumbnail:e.video?.thumbnail?.url??t.thumbnail,owner:e.owner??t.owner??void 0,channel:e.channel??t.channel??void 0}}applySettingsToUI(){const t=this.queryModalElement(p.opacitySelect),e=this.queryModalElement(p.visibilityToggle),n=this.queryModalElement(p.colorPreview),r=this.queryModalElement(p.colorValue),i=this.queryModalElement(p.ngWords),s=this.queryModalElement(p.ngRegexps);t&&(t.value=this.settings.commentOpacity.toString()),e&&this.updateVisibilityToggleState(e),n&&(n.style.backgroundColor=this.settings.commentColor),r&&(r.textContent=this.settings.commentColor),i&&(i.value=this.settings.ngWords.join(`
`)),s&&(s.value=this.settings.ngRegexps.join(`
`)),this.applyPlaybackSettingsToUI(),this.updatePlayButtonState(this.currentVideoInfo);}saveSettings(){const t=this.queryModalElement(p.opacitySelect),e=this.queryModalElement(p.ngWords),n=this.queryModalElement(p.ngRegexps);if(t){const r=Number(t.value);Number.isNaN(r)||(this.settings.commentOpacity=r);}e&&(this.settings.ngWords=e.value.split(`
`).map(r=>r.trim()).filter(Boolean)),n&&(this.settings.ngRegexps=n.value.split(`
`).map(r=>r.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings)?f.show("設定を保存しました","success"):f.show("設定の保存に失敗しました","error");}updateCurrentVideoInfo(t){this.currentVideoInfo=t,[["currentTitle",t.title??"-"],["currentVideoId",t.videoId??"-"],["currentOwner",t.owner?.nickname??t.channel?.name??"-"],["currentViewCount",this.formatNumber(t.viewCount)],["currentCommentCount",this.formatNumber(t.commentCount)],["currentMylistCount",this.formatNumber(t.mylistCount)],["currentPostedAt",this.formatSearchResultDate(t.postedAt)]].forEach(([r,i])=>{const s=this.querySelector(p[r]);s&&(s.textContent=i);});const n=this.querySelector(p.currentThumbnail);n&&t.thumbnail&&(n.src=t.thumbnail,n.alt=t.title??"サムネイル");try{this.settingsManager.saveVideoData(t.title??"",t);}catch(r){O.error("SettingsUI.updateCurrentVideoInfo",r);}this.updatePlayButtonState(t);}formatNumber(t){return typeof t=="number"?t.toLocaleString():"-"}formatSearchResultDate(t){if(!t)return "-";const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(e)}formatPlaybackRateLabel(t){return `${(Number.isFinite(t)?t:1.11).toFixed(2).replace(/\.?0+$/,"")}倍`}setupPlayButton(){const t=this.queryModalElement(p.playCurrentVideo);t&&(t.addEventListener("click",()=>{try{if(!this.currentVideoInfo?.videoId){f.show("再生できる動画が設定されていません","warning");return}const n=this.lastAutoButtonElement?.closest(".itemModule.list");if(this.lastAutoButtonElement){const r=n?.querySelector(".thumbnailContainer > a, .thumbnail-container > a");if(r){f.show(`「${this.currentVideoInfo?.title||"動画"}」を再生します...`,"success"),setTimeout(()=>{r.click();},300);return}}f.show("再生リンクが見つかりませんでした（対象アイテム内に限定して検索済み）","warning");}catch(e){O.error("SettingsUI.playCurrentVideo",e),f.show(`再生エラー: ${e.message}`,"error");}}),this.updatePlayButtonState(this.currentVideoInfo));}updatePlayButtonState(t){const e=this.queryModalElement(p.playCurrentVideo);if(!e)return;const n=!!t?.videoId;e.disabled=!n,e.setAttribute("aria-disabled",(!n).toString());}updateVisibilityToggleState(t){t.textContent=this.settings.isCommentVisible?"表示中":"非表示中",t.classList.toggle("off",!this.settings.isCommentVisible);}applyPlaybackSettingsToUI(){const t=this.queryModalElement(p.fixedPlaybackToggle);t&&this.updatePlaybackToggleState(t);}updatePlaybackToggleState(t){const e=this.playbackSettings.fixedModeEnabled;t.textContent=e?`${this.formatPlaybackRateLabel(this.playbackSettings.fixedRate)}固定中`:"標準速度",t.classList.toggle("off",!e),t.setAttribute("aria-pressed",e?"true":"false");}destroy(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),this.settingsManager.removePlaybackObserver(this.handlePlaybackSettingsChanged),super.destroy();}createOrUpdateFab(){if(!document.body)return null;let t=this.fabHostElement;!t||!t.isConnected?(t?.remove(),t=document.createElement("div"),t.id=X.FAB_HOST_ID,t.style.position="fixed",t.style.bottom="32px",t.style.right="32px",t.style.zIndex="2147483646",t.style.display="inline-block",this.fabShadowRoot=t.attachShadow({mode:"open"}),document.body.appendChild(t),this.fabHostElement=t):this.fabShadowRoot||(this.fabShadowRoot=t.shadowRoot??t.attachShadow({mode:"open"}));const e=this.fabShadowRoot;if(!e)return null;let n=e.querySelector("style[data-role='fab-base-style']");n||(n=document.createElement("style"),n.dataset.role="fab-base-style",n.textContent=q.getCommonStyles(),e.appendChild(n));let r=e.querySelector("style[data-role='fab-style']");r||(r=document.createElement("style"),r.dataset.role="fab-style",r.textContent=`
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
      `,e.appendChild(r));let i=e.querySelector("style[data-role='similarity-style']");i||(i=document.createElement("style"),i.dataset.role="similarity-style",i.textContent=Dt,e.appendChild(i));let s=e.querySelector("style[data-role='modal-play-button-style']");s||(s=document.createElement("style"),s.dataset.role="modal-play-button-style",s.textContent=Fn,e.appendChild(s));let a=e.querySelector(".fab-container");a||(a=document.createElement("div"),a.className="fab-container",e.appendChild(a));let l=a.querySelector("button.fab-button");l||(l=document.createElement("button"),l.type="button",l.className="fab-button",a.appendChild(l)),l.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${it}</span>
      <span class="fab-button__label">設定</span>
    `,l.setAttribute("aria-label","ニコニココメント設定を開く"),l.setAttribute("aria-haspopup","dialog");let d=a.querySelector(p.settingsModal);return d||(a.insertAdjacentHTML("beforeend",this.buildModalHtml()),d=a.querySelector(p.settingsModal)),this.modalElement=d??null,l}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener("click",this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null;}queryModalElement(t){return this.fabShadowRoot?this.fabShadowRoot.querySelector(t):null}queryModalSelectorAll(t){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}}const Dn=_("dAnime:PlaybackRateController"),On=1,Nn=200,Hn=1e-4;class ee{constructor(t){this.settingsManager=t,this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.settingsObserver=e=>{this.playbackSettings=e,this.applyCurrentMode();},this.settingsManager.addPlaybackObserver(this.settingsObserver);}currentVideo=null;playbackSettings;settingsObserver;isApplying=false;retryTimer=null;handleLoadedMetadata=()=>{this.applyCurrentMode();};handleRateChange=()=>{this.isApplying||this.playbackSettings.fixedModeEnabled&&this.scheduleApply();};handlePlay=()=>{this.applyCurrentMode();};handleEmptied=()=>{this.scheduleApply();};bind(t){if(this.currentVideo===t){this.applyCurrentMode();return}this.detachVideoListeners(),this.cancelScheduledApply(),this.currentVideo=t,this.attachVideoListeners(t),this.applyCurrentMode();}unbind(){this.cancelScheduledApply(),this.detachVideoListeners(),this.currentVideo=null;}dispose(){this.unbind(),this.settingsManager.removePlaybackObserver(this.settingsObserver);}attachVideoListeners(t){t.addEventListener("loadedmetadata",this.handleLoadedMetadata),t.addEventListener("ratechange",this.handleRateChange),t.addEventListener("play",this.handlePlay),t.addEventListener("emptied",this.handleEmptied);}detachVideoListeners(){this.currentVideo&&(this.currentVideo.removeEventListener("loadedmetadata",this.handleLoadedMetadata),this.currentVideo.removeEventListener("ratechange",this.handleRateChange),this.currentVideo.removeEventListener("play",this.handlePlay),this.currentVideo.removeEventListener("emptied",this.handleEmptied));}applyCurrentMode(){const t=this.currentVideo;t&&(this.playbackSettings.fixedModeEnabled?this.setPlaybackRate(t,this.playbackSettings.fixedRate):this.setPlaybackRate(t,On));}setPlaybackRate(t,e){if(!(!Number.isFinite(e)||e<=0)&&!(Math.abs(t.playbackRate-e)<=Hn)){this.isApplying=true;try{t.playbackRate=e;}catch(n){Dn.warn("再生速度の設定に失敗しました",n),this.scheduleApply();}finally{window.setTimeout(()=>{this.isApplying=false;},0);}}}scheduleApply(){this.cancelScheduledApply(),this.retryTimer=window.setTimeout(()=>{this.retryTimer=null,this.applyCurrentMode();},Nn);}cancelScheduledApply(){this.retryTimer!==null&&(window.clearTimeout(this.retryTimer),this.retryTimer=null);}}const Ot=async()=>{},zn=()=>{const o=ot();if(!o.dAniRenderer){const t={};o.dAniRenderer={classes:{Comment:qt,CommentRenderer:Kt,NicoApiFetcher:ht,NotificationManager:f,StyleManager:te,SettingsUI:X,NicoVideoSearcher:Zt,VideoSwitchHandler:Qt,SettingsManager:ct,KeyboardShortcutHandler:Gt,DebounceExecutor:ut,ShadowDOMComponent:dt,ShadowStyleManager:q,PlaybackRateController:ee},instances:t,utils:{initialize:Ot,initializeWithVideo:Ot},debug:{showState:()=>{console.log("Current instances:",t);},showSettings:()=>{const e=t.settingsManager;if(!e){console.log("SettingsManager not initialized");return}console.log("Current settings:",e.getSettings());},showComments:()=>{const e=t.renderer;if(!e){console.log("CommentRenderer not initialized");return}console.log("Current comments:",e.getCommentsSnapshot());}},defaultSettings:F};}return o.dAniRenderer},Wn=100,qn=1e3,$n=3e3;class Bn{constructor(t){this.global=t;}initialized=false;switchDebounce=new ut(qn);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;playbackRateController=null;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(t=>{window.addEventListener("load",()=>t(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const t=document.querySelector(E.watchVideoElement);if(!t){window.setTimeout(()=>this.waitForVideoElement(),Wn);return}if(t.readyState===0){t.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(t);},{once:true});return}this.initializeWithVideo(t);}async initializeWithVideo(t){if(!this.initialized){this.initialized=true;try{f.show("コメントローダーを初期化中...");const e=f.getInstance(),n=this.global.settingsManager??new ct(e);this.global.settingsManager=n,this.global.instances.settingsManager=n;const r=n.loadVideoData();if(!r?.videoId)throw new Error("動画データが見つかりません。マイページで設定してください。");const i=new ht;this.global.instances.fetcher=i,await i.fetchApiData(r.videoId);const s=await i.fetchComments(),a=this.mergeSettings(n.loadSettings()),l=new Kt(a);l.initialize(t),this.global.instances.renderer=l,this.currentVideoElement=t;const d=this.playbackRateController??new ee(n);this.playbackRateController=d,this.global.instances.playbackRateController=d,d.bind(t),n.addObserver(c=>{l.settings=this.mergeSettings(c);}),s.forEach(c=>{l.addComment(c.text,c.vposMs,c.commands);});const h=new Qt(l,i,n);h.startMonitoring(),this.global.instances.switchHandler=h,this.setupSwitchHandling(t,h),this.observeVideoElement(),f.show(`コメントの読み込みが完了しました（${s.length}件）`,"success");}catch(e){throw this.initialized=false,f.show(`初期化エラー: ${e.message}`,"error"),e}}}mergeSettings(t){const e=F();return {...e,...t,ngWords:[...t.ngWords??e.ngWords],ngRegexps:[...t.ngRegexps??e.ngRegexps]}}setupSwitchHandling(t,e){this.currentVideoElement=t,this.switchCallback=()=>{const n=Date.now();if(n-this.lastSwitchTimestamp<$n)return;this.lastSwitchTimestamp=n;const r=this.currentVideoElement;e.onVideoSwitch(r);},this.global.utils.initializeWithVideo=async n=>{n&&(this.rebindVideoElement(n),this.playbackRateController?.bind(n),await e.onVideoSwitch(n));},this.currentVideoElement=t;}observeVideoElement(){const t=this.currentVideoElement;t&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{const e=document.querySelector(E.watchVideoElement);!e||e===this.currentVideoElement||this.rebindVideoElement(e);}),this.domMutationObserver.observe(document.body,{childList:true,subtree:true}),this.attachVideoEventListeners(t));}rebindVideoElement(t){this.detachVideoEventListeners(),this.currentVideoElement=t;const e=this.global.instances.renderer,n=this.global.instances.switchHandler;e&&(e.destroy(),e.initialize(t),e.resize()),this.playbackRateController?.bind(t),n&&(n.onVideoSwitch(t),this.setupSwitchHandling(t,n)),this.attachVideoEventListeners(t);}attachVideoEventListeners(t){this.detachVideoEventListeners();const e=()=>{this.switchCallback&&(this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));};t.addEventListener("ended",e),t.addEventListener("loadedmetadata",e),t.addEventListener("emptied",e),this.videoEndedListener=e;}detachVideoEventListeners(){const t=this.currentVideoElement;t&&this.videoEndedListener&&(t.removeEventListener("ended",this.videoEndedListener),t.removeEventListener("loadedmetadata",this.videoEndedListener),t.removeEventListener("emptied",this.videoEndedListener)),this.videoEndedListener=null;}}const Un=100;class Gn{constructor(t){this.global=t;}initialize(){const t=f.getInstance(),e=this.global.settingsManager??new ct(t);this.global.settingsManager=e,this.global.instances.settingsManager=e;const n=new X(e);this.waitForHeader(n);}waitForHeader(t){if(!document.querySelector(E.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(t),Un);return}t.insertIntoMypage(),t.addAutoCommentButtons(),this.observeList(t);}observeList(t){const e=document.querySelector(E.mypageListContainer);if(!e)return;new MutationObserver(()=>{try{t.addAutoCommentButtons();}catch(r){console.error("[MypageController] auto comment buttons update failed",r);}}).observe(e,{childList:true,subtree:true});}}class Kn{log;global=zn();watchController=null;mypageController=null;constructor(){this.log=_("DanimeApp");}start(){this.log.info("starting renderer"),te.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const t=location.pathname.toLowerCase();try{t.includes("/animestore/sc_d_pc")?(this.watchController=new Bn(this.global),await this.watchController.initialize()):t.includes("/animestore/mp_viw_pc")?(this.mypageController=new Gn(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(e){this.log.error("initialization failed",e);}}acquireInstanceLock(){const t=ot();return t.__dAnimeNicoCommentRenderer2Instance=(t.__dAnimeNicoCommentRenderer2Instance??0)+1,t.__dAnimeNicoCommentRenderer2Instance===1}}const st=_("dAnimeNicoCommentRenderer2");async function Yn(){st.info("bootstrap start");try{new Kn().start(),st.info("bootstrap completed");}catch(o){st.error("bootstrap failed",o);}}Yn();

})();