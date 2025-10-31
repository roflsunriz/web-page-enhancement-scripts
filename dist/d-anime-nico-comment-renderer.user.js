// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      6.4.1
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

  const X={debug:"debug",info:"info",warn:"warn",error:"error"},S=l=>{const t=`[${l}]`,e={};return Object.keys(X).forEach(n=>{const i=X[n];e[n]=(...r)=>{(console[i]??console.log)(t,...r);};}),e};function W(){return typeof unsafeWindow<"u"?unsafeWindow:window}const Mt={commentColor:"#FFFFFF",commentOpacity:.75,isCommentVisible:true,useContainerResizeObserver:true,ngWords:[],ngRegexps:[]},O=Mt,w=()=>({...O,ngWords:[...O.ngWords],ngRegexps:[...O.ngRegexps]}),At="v6.4.1";var _t=typeof GM_addStyle<"u"?GM_addStyle:void 0,N=typeof GM_getValue<"u"?GM_getValue:void 0,z=typeof GM_setValue<"u"?GM_setValue:void 0,It=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const Z="settings",J="currentVideo",Q="lastDanimeIds",Vt=l=>({...l,ngWords:[...l.ngWords],ngRegexps:[...l.ngRegexps]});class U{constructor(t){this.notifier=t,this.settings=w(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData();}settings;currentVideo;observers=new Set;getSettings(){return Vt(this.settings)}loadSettings(){try{const t=N(Z,null);if(!t)return this.settings=w(),this.settings;if(typeof t=="string"){const e=JSON.parse(t);this.settings={...w(),...e,ngWords:Array.isArray(e?.ngWords)?[...e.ngWords]:[],ngRegexps:Array.isArray(e?.ngRegexps)?[...e.ngRegexps]:[]};}else this.settings={...w(),...t,ngWords:Array.isArray(t.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t.ngRegexps)?[...t.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(t){return console.error("[SettingsManager] 設定の読み込みに失敗しました",t),this.notify("設定の読み込みに失敗しました","error"),this.settings=w(),this.settings}}saveSettings(){try{return z(Z,JSON.stringify(this.settings)),this.notifyObservers(),this.notify("設定を保存しました","success"),!0}catch(t){return console.error("[SettingsManager] 設定の保存に失敗しました",t),this.notify("設定の保存に失敗しました","error"),false}}updateSettings(t){return this.settings={...this.settings,...t,ngWords:t.ngWords?[...t.ngWords]:[...this.settings.ngWords],ngRegexps:t.ngRegexps?[...t.ngRegexps]:[...this.settings.ngRegexps]},this.saveSettings()}addObserver(t){this.observers.add(t);}removeObserver(t){this.observers.delete(t);}notifyObservers(){const t=this.getSettings();for(const e of this.observers)try{e(t);}catch(n){console.error("[SettingsManager] 設定変更通知でエラー",n);}}loadVideoData(){try{return N(J,null)??null}catch(t){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",t),this.notify("動画データの読み込みに失敗しました","error"),null}}saveVideoData(t,e){try{const n={videoId:e.videoId,title:e.title,viewCount:e.viewCount,commentCount:e.commentCount,mylistCount:e.mylistCount,postedAt:e.postedAt,thumbnail:e.thumbnail,owner:e.owner??null,channel:e.channel??null};return z(J,n),this.currentVideo=n,!0}catch(n){return console.error("[SettingsManager] 動画データの保存に失敗しました",n),this.notify("動画データの保存に失敗しました","error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(t){try{return z(Q,t),!0}catch(e){return console.error("[SettingsManager] saveLastDanimeIds failed",e),this.notify("ID情報の保存に失敗しました","error"),false}}loadLastDanimeIds(){try{return N(Q,null)??null}catch(t){return console.error("[SettingsManager] loadLastDanimeIds failed",t),this.notify("ID情報の読込に失敗しました","error"),null}}notify(t,e="info"){this.notifier?.show(t,e);}}const F=S("dAnime:Comment");class pt{text;vpos;commands;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily="Arial";opacity;isActive=false;hasShown=false;isPaused=false;lastUpdateTime=0;reservationWidth=0;bufferWidth=0;visibleDurationMs=0;totalDurationMs=0;preCollisionDurationMs=0;speedPixelsPerMs=0;virtualStartX=0;constructor(t,e,n=[],i){if(typeof t!="string")throw new Error("Comment text must be a string");if(!Number.isFinite(e)||e<0)throw new Error("Comment vpos must be a non-negative number");this.text=t,this.vpos=e,this.commands=Array.isArray(n)?n:[],this.color=i.commentColor,this.opacity=i.commentOpacity;}prepare(t,e,n,i){try{if(!t)throw new Error("Canvas context is required");if(!Number.isFinite(e)||!Number.isFinite(n))throw new Error("Canvas dimensions must be numbers");if(!i)throw new Error("Prepare options are required");const r=Math.max(e,1);this.fontSize=Math.max(24,Math.floor(n*.05)),t.font=`${this.fontSize}px ${this.fontFamily}`,this.width=t.measureText(this.text).width,this.height=this.fontSize;const s=t.measureText("��".repeat(150)).width,o=this.width*Math.max(i.bufferRatio,0);this.bufferWidth=Math.max(i.baseBufferPx,o);const a=Math.max(i.entryBufferPx,this.bufferWidth);this.virtualStartX=r+i.virtualExtension,this.x=this.virtualStartX;const c=this.width/r;let d=i.maxVisibleDurationMs;if(c>1){const Ct=Math.min(c,i.maxWidthRatio),Et=i.maxVisibleDurationMs/Math.max(Ct,1);d=Math.max(i.minVisibleDurationMs,Math.floor(Et));}const m=r+this.width+this.bufferWidth+a,p=Math.max(d,1),x=m/p,f=x*1e3/60;this.baseSpeed=f,this.speed=this.baseSpeed,this.speedPixelsPerMs=x;const _=this.virtualStartX+this.width+this.bufferWidth+a,E=r+a,M=this.virtualStartX+this.width+this.bufferWidth,R=Math.max(x,Number.EPSILON),k=Math.max(0,M-E);this.visibleDurationMs=d,this.preCollisionDurationMs=Math.max(0,Math.ceil(k/R)),this.totalDurationMs=Math.max(this.preCollisionDurationMs,Math.ceil(_/R));const Y=this.width+this.bufferWidth+a;this.reservationWidth=Math.min(s,Y),this.lastUpdateTime=performance.now(),this.isPaused=!1;}catch(r){throw F.error("Comment.prepare",r,{text:this.text,visibleWidth:e,canvasHeight:n,hasContext:!!t}),r}}update(t=1,e=false){try{if(!this.isActive){this.isPaused=e;return}const n=performance.now();if(e){this.isPaused=!0,this.lastUpdateTime=n;return}const i=(n-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*t,this.x-=this.speed*i,this.x<-this.width&&(this.isActive=!1),this.lastUpdateTime=n,this.isPaused=!1;}catch(n){F.error("Comment.update",n,{text:this.text,playbackRate:t,isPaused:e,isActive:this.isActive});}}draw(t,e=null){try{if(!this.isActive||!t)return;t.save(),t.globalAlpha=this.opacity,t.font=`${this.fontSize}px ${this.fontFamily}`;const n=e??this.x,i=this.y+this.fontSize;t.strokeStyle="#000000",t.lineWidth=Math.max(3,this.fontSize/8),t.lineJoin="round",t.strokeText(this.text,n,i);const r=Math.max(1,this.fontSize*.04),s=this.fontSize*.18;[{offsetMultiplier:1,blurMultiplier:.6,alpha:.45},{offsetMultiplier:2,blurMultiplier:1,alpha:.3},{offsetMultiplier:3.2,blurMultiplier:1.6,alpha:.18}].forEach(a=>{const c=r*a.offsetMultiplier;t.shadowColor=`rgba(0, 0, 0, ${a.alpha})`,t.shadowBlur=s*a.blurMultiplier,t.shadowOffsetX=c,t.shadowOffsetY=c,t.fillStyle=this.color,t.fillText(this.text,n,i);}),t.shadowColor="transparent",t.shadowBlur=0,t.shadowOffsetX=0,t.shadowOffsetY=0,t.fillStyle=this.color,t.fillText(this.text,n,i),t.restore();}catch(n){F.error("Comment.draw",n,{text:this.text,isActive:this.isActive,hasContext:!!t,interpolatedX:e});}}}const kt=new Set(["INPUT","TEXTAREA"]),D=l=>l.length===1?l.toUpperCase():l,Lt=l=>l?`${l}+`:"";class mt{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(t,e,n){const i=this.createShortcutKey(D(t),e);this.shortcuts.set(i,n);}removeShortcut(t,e){const n=this.createShortcutKey(D(t),e);this.shortcuts.delete(n);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(t){this.isEnabled=t;}createShortcutKey(t,e){return `${Lt(e)}${t}`}extractModifier(t){const e=[];return t.ctrlKey&&e.push("Ctrl"),t.altKey&&e.push("Alt"),t.shiftKey&&e.push("Shift"),t.metaKey&&e.push("Meta"),e.length>0?e.join("+"):null}handleKeyDown(t){if(!this.isEnabled)return;const n=t.target?.tagName??"";if(kt.has(n))return;const i=this.extractModifier(t),r=this.createShortcutKey(D(t.key),i),s=this.shortcuts.get(r);s&&(t.preventDefault(),s());}}const C=S("dAnime:CommentRenderer"),H=l=>l*1e3,tt=1e4,et=2e3,nt=4e3,Tt=1e3,Rt=4e3,Ot=1800,Nt=3,zt=.25,Ft=32,Dt=48,L=120,Ht=1,Pt=12,rt=24,v=.001;class gt{_settings;comments=[];reservedLanes=new Map;canvas=null;ctx=null;videoElement=null;containerElement=null;laneCount=Pt;laneHeight=0;currentTime=0;duration=0;playbackRate=1;isPlaying=true;lastDrawTime=0;finalPhaseActive=false;frameId=null;keyboardHandler=null;resizeObserver=null;resizeObserverTarget=null;isResizeObserverAvailable=typeof ResizeObserver<"u";cleanupTasks=[];constructor(t){this._settings=t?{...t}:w();}get settings(){return this._settings}set settings(t){this._settings={...t};}initialize(t){try{this.destroyCanvasOnly(),this.videoElement=t,this.containerElement=t.parentElement??document.body,this.duration=Number.isFinite(t.duration)?H(t.duration):0,this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.lastDrawTime=performance.now();const e=document.createElement("canvas"),n=e.getContext("2d");if(!n)throw new Error("Failed to acquire 2D canvas context");e.style.position="absolute",e.style.top="0",e.style.left="0",e.style.pointerEvents="none",e.style.zIndex="1000";const i=this.containerElement;i instanceof HTMLElement&&(getComputedStyle(i).position==="static"&&(i.style.position="relative"),i.appendChild(e)),this.canvas=e,this.ctx=n,this.resize(),this.calculateLaneMetrics(),this.setupVideoEventListeners(t),this.setupKeyboardShortcuts(),this.setupResizeHandling(t),this.startAnimation();}catch(e){throw C.error("CommentRenderer.initialize",e),e}}addComment(t,e,n=[]){if(this.isNGComment(t)||this.comments.some(s=>s.text===t&&s.vpos===e))return null;const r=new pt(t,e,n,this._settings);return this.comments.push(r),this.comments.sort((s,o)=>s.vpos-o.vpos),r}clearComments(){this.comments.length=0,this.reservedLanes.clear(),this.ctx&&this.canvas&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}resetState(){this.clearComments(),this.currentTime=0,this.finalPhaseActive=false;}destroy(){this.stopAnimation(),this.keyboardHandler?.stopListening(),this.keyboardHandler=null,this.cleanupResizeHandling(),this.runCleanupTasks(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.videoElement=null,this.containerElement=null,this.comments.length=0,this.reservedLanes.clear(),this.finalPhaseActive=false;}updateSettings(t){const e=this._settings.useContainerResizeObserver;this.settings=t,this.comments.forEach(n=>{n.color=this._settings.commentColor,n.opacity=this._settings.commentOpacity;}),!this._settings.isCommentVisible&&this.ctx&&this.canvas&&(this.comments.forEach(n=>{n.isActive=false;}),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)),e!==this._settings.useContainerResizeObserver&&this.videoElement&&this.setupResizeHandling(this.videoElement);}getVideoElement(){return this.videoElement}getCurrentVideoSource(){const t=this.videoElement;if(!t)return null;if(typeof t.currentSrc=="string"&&t.currentSrc.length>0)return t.currentSrc;const e=t.getAttribute("src");if(e&&e.length>0)return e;const n=t.querySelector("source[src]");return n&&typeof n.src=="string"?n.src:null}getCommentsSnapshot(){return [...this.comments]}isNGComment(t){try{return typeof t!="string"||Array.isArray(this._settings.ngWords)&&this._settings.ngWords.some(n=>typeof n=="string"&&n.length>0&&t.includes(n))?!0:Array.isArray(this._settings.ngRegexps)?this._settings.ngRegexps.some(e=>{if(typeof e!="string"||e.length===0)return !1;try{return new RegExp(e).test(t)}catch(n){return C.error("CommentRenderer.isNGComment.regex",n,{pattern:e,text:t}),!1}}):!1}catch(e){return C.error("CommentRenderer.isNGComment",e,{text:t}),true}}resize(t,e){const n=this.videoElement,i=this.canvas;if(!n||!i)return;const r=n.getBoundingClientRect(),s=t??r.width??i.width,o=e??r.height??i.height;if(!Number.isFinite(s)||!Number.isFinite(o)||s<=0||o<=0)return;const a=Math.max(1,Math.floor(s)),c=Math.max(1,Math.floor(o));if(!Number.isFinite(a)||!Number.isFinite(c))return;const d=i.width||a,m=i.height||c;if(d===a&&m===c)return;i.width=a,i.height=c,i.style.width=`${a}px`,i.style.height=`${c}px`;const p=d>0?a/d:1,x=m>0?c/m:1;(p!==1||x!==1)&&this.comments.forEach(f=>{f.isActive&&(f.x*=p,f.y*=x,f.baseSpeed*=p,f.speed*=p,f.fontSize=Math.max(rt,Math.floor(c*.05)));}),this.calculateLaneMetrics();}destroyCanvasOnly(){this.stopAnimation(),this.cleanupResizeHandling(),this.runCleanupTasks(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null;}calculateLaneMetrics(){const t=this.canvas;if(!t)return;const e=Math.max(rt,Math.floor(t.height*.05));this.laneHeight=e*1.2;const n=Math.floor(t.height/Math.max(this.laneHeight,1));this.laneCount=Math.max(Ht,n);}updateComments(){const t=this.videoElement,e=this.canvas,n=this.ctx;if(!t||!e||!n)return;this.currentTime=H(t.currentTime),this.playbackRate=t.playbackRate,this.isPlaying=!t.paused;const i=this.buildPrepareOptions(e.width),r=this.duration>0&&this.duration-this.currentTime<=tt;r&&!this.finalPhaseActive&&(this.finalPhaseActive=true,n.clearRect(0,0,e.width,e.height),this.comments.forEach(s=>{s.isActive=false;}),this.reservedLanes.clear()),!r&&this.finalPhaseActive&&(this.finalPhaseActive=false);for(const s of this.comments)this.isNGComment(s.text)||(s.color=this._settings.commentColor,s.opacity=this._settings.commentOpacity,s.isActive||(r?s.vpos>this.currentTime-tt&&!s.hasShown:s.vpos>=this.currentTime-et&&s.vpos<=this.currentTime+et)&&(s.prepare(n,e.width,e.height,i),s.lane=this.findAvailableLane(s),s.y=s.lane*this.laneHeight,s.x=s.virtualStartX,s.isActive=true,s.hasShown=true),s.isActive&&s.update(this.playbackRate,!this.isPlaying));for(const s of this.comments)s.isActive&&s.x<-s.width&&(s.isActive=false);}buildPrepareOptions(t){return {visibleWidth:t,virtualExtension:Tt,maxVisibleDurationMs:Rt,minVisibleDurationMs:Ot,maxWidthRatio:Nt,bufferRatio:zt,baseBufferPx:Ft,entryBufferPx:Dt}}findAvailableLane(t){const e=this.currentTime;this.pruneLaneReservations(e);const n=this.getLanePriorityOrder(e),i=this.createLaneReservation(t,e);for(const s of n)if(this.isLaneAvailable(s,i,e))return this.storeLaneReservation(s,i),s;const r=n[0]??0;return this.storeLaneReservation(r,i),r}pruneLaneReservations(t){for(const[e,n]of this.reservedLanes.entries()){const i=n.filter(r=>r.totalEndTime+L>t);i.length>0?this.reservedLanes.set(e,i):this.reservedLanes.delete(e);}}getLanePriorityOrder(t){return Array.from({length:this.laneCount},(n,i)=>i).sort((n,i)=>{const r=this.getLaneNextAvailableTime(n,t),s=this.getLaneNextAvailableTime(i,t);return Math.abs(r-s)<=v?n-i:r-s})}getLaneNextAvailableTime(t,e){const n=this.reservedLanes.get(t);if(!n||n.length===0)return e;let i=e;for(const r of n)i=Math.max(i,r.endTime);return i}createLaneReservation(t,e){const n=Math.max(t.speedPixelsPerMs,v),i=e+t.preCollisionDurationMs+L,r=e+t.totalDurationMs+L;return {comment:t,startTime:e,endTime:Math.max(e,i),totalEndTime:Math.max(e,r),startLeft:t.virtualStartX,width:t.width,speed:n,buffer:t.bufferWidth}}isLaneAvailable(t,e,n){const i=this.reservedLanes.get(t);if(!i||i.length===0)return  true;for(const r of i)if(!(r.totalEndTime+L<=n)&&this.areReservationsConflicting(r,e))return  false;return  true}storeLaneReservation(t,e){const i=[...this.reservedLanes.get(t)??[],e].sort((r,s)=>r.endTime-s.endTime);this.reservedLanes.set(t,i);}areReservationsConflicting(t,e){const n=Math.max(t.startTime,e.startTime),i=Math.min(t.endTime,e.endTime);if(n>=i)return  false;const r=new Set([n,i,n+(i-n)/2]),s=this.solveLeftRightEqualityTime(t,e);s!==null&&s>=n-v&&s<=i+v&&r.add(s);const o=this.solveLeftRightEqualityTime(e,t);o!==null&&o>=n-v&&o<=i+v&&r.add(o);for(const a of r){if(a<n-v||a>i+v)continue;const c=this.computeForwardGap(t,e,a),d=this.computeForwardGap(e,t,a);if(c<=v&&d<=v)return  true}return  false}computeForwardGap(t,e,n){const i=this.getBufferedEdges(t,n),r=this.getBufferedEdges(e,n);return i.left-r.right}getBufferedEdges(t,e){const n=Math.max(0,e-t.startTime),i=t.speed*n,r=t.startLeft-i,s=r-t.buffer,o=r+t.width+t.buffer;return {left:s,right:o}}solveLeftRightEqualityTime(t,e){const n=e.speed-t.speed;if(Math.abs(n)<v)return null;const r=(e.startLeft+e.speed*e.startTime+e.width+e.buffer-t.startLeft-t.speed*t.startTime+t.buffer)/n;return Number.isFinite(r)?r:null}draw(){const t=this.canvas,e=this.ctx;if(!t||!e)return;e.clearRect(0,0,t.width,t.height);const n=this.comments.filter(r=>r.isActive),i=performance.now();if(this._settings.isCommentVisible){const r=(i-this.lastDrawTime)/16.666666666666668;n.forEach(s=>{const o=s.x-s.speed*r;s.draw(e,o);});}this.lastDrawTime=i;}updateFrame=()=>{if(this.videoElement){if(!this._settings.isCommentVisible){this.frameId=requestAnimationFrame(this.updateFrame);return}this.updateComments(),this.draw(),this.frameId=requestAnimationFrame(this.updateFrame);}};startAnimation(){this.stopAnimation(),this.frameId=requestAnimationFrame(this.updateFrame);}stopAnimation(){this.frameId&&(cancelAnimationFrame(this.frameId),this.frameId=null);}onSeek(){const t=this.canvas,e=this.ctx,n=this.videoElement;if(!t||!e||!n)return;this.finalPhaseActive=false,this.currentTime=H(n.currentTime),this.reservedLanes.clear();const i=this.buildPrepareOptions(t.width);this.comments.forEach(r=>{if(r.vpos>=this.currentTime-nt&&r.vpos<=this.currentTime+nt){r.prepare(e,t.width,t.height,i),r.lane=this.findAvailableLane(r),r.y=r.lane*this.laneHeight;const s=(this.currentTime-r.vpos)/1e3,o=r.speed*s*60;r.x=r.virtualStartX-o,r.isActive=r.x>-r.width,r.x<-r.width&&(r.isActive=false,r.hasShown=true);}else r.isActive=false;});}setupVideoEventListeners(t){try{const e=()=>{this.isPlaying=!0;const s=performance.now();this.comments.forEach(o=>{o.lastUpdateTime=s,o.isPaused=!1;});},n=()=>{this.isPlaying=!1;},i=()=>{this.onSeek();},r=()=>{this.playbackRate=t.playbackRate;};t.addEventListener("play",e),t.addEventListener("pause",n),t.addEventListener("seeking",i),t.addEventListener("ratechange",r),this.addCleanup(()=>t.removeEventListener("play",e)),this.addCleanup(()=>t.removeEventListener("pause",n)),this.addCleanup(()=>t.removeEventListener("seeking",i)),this.addCleanup(()=>t.removeEventListener("ratechange",r));}catch(e){throw C.error("CommentRenderer.setupVideoEventListeners",e),e}}setupKeyboardShortcuts(){try{this.keyboardHandler?.stopListening(),this.keyboardHandler=new mt,this.keyboardHandler.addShortcut("C","Shift",()=>{try{this._settings.isCommentVisible=!this._settings.isCommentVisible,this._settings.isCommentVisible||(this.comments.forEach(e=>{e.isActive=!1;}),this.ctx&&this.canvas&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)),window.dAniRenderer?.settingsManager?.updateSettings(this._settings);}catch(t){C.error(t,"CommentRenderer.keyboardShortcut");}}),this.keyboardHandler.startListening();}catch(t){C.error(t,"CommentRenderer.setupKeyboardShortcuts");}}setupResizeHandling(t){if(this.cleanupResizeHandling(),this._settings.useContainerResizeObserver&&this.isResizeObserverAvailable){const e=t.parentElement??t,n=new ResizeObserver(i=>{for(const r of i){const{width:s,height:o}=r.contentRect;s>0&&o>0?this.resize(s,o):this.resize();}});n.observe(e),this.resizeObserver=n,this.resizeObserverTarget=e;}else {const e=()=>{this.resize();};window.addEventListener("resize",e),this.addCleanup(()=>window.removeEventListener("resize",e));}}cleanupResizeHandling(){this.resizeObserver&&this.resizeObserverTarget&&this.resizeObserver.unobserve(this.resizeObserverTarget),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.resizeObserverTarget=null;}addCleanup(t){this.cleanupTasks.push(t);}runCleanupTasks(){for(;this.cleanupTasks.length>0;){const t=this.cleanupTasks.pop();try{t?.();}catch(e){C.error("CommentRenderer.cleanupTask",e);}}}}class G{shadowRoot=null;container=null;createShadowDOM(t,e={mode:"closed"}){if(!t)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=t.attachShadow(e),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(t){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const e=document.createElement("style");e.textContent=t,this.shadowRoot.appendChild(e);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}querySelectorAll(t){return this.shadowRoot?this.shadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}setHTML(t){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=t;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const Bt=`\r
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
`,qt=`:host {
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
`,$t=`:host {
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
`;class V{static getCommonStyles(){return Bt}static getNotificationStyles(){return qt}static getAutoButtonStyles(){return $t}}const it={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class u extends G{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new u),this.instance}static show(t,e="info",n=3e3){try{const i=this.getInstance();return i.initialize(),i.initialized?i.createNotification(t,e,n):null}catch(i){return console.error("[NotificationManager] show failed",i),null}}static removeNotification(t){this.getInstance().removeNotification(t.element);}show(t,e="info"){u.show(t,e);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 2147483647","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(V.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(t){console.error("[NotificationManager] initialize failed",t),this.initialized=false;}}destroy(){u.notifications.forEach(t=>{t.timerId&&window.clearTimeout(t.timerId);}),u.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,u.instance=null;}createNotification(t,e,n){try{const i=this.querySelector(".notification-container");if(!i)throw new Error("Notification container not found");const r=it[e]??it.info,s=document.createElement("div");s.className=`notification-item ${e}`;const o=document.createElement("div");o.className="notification-icon",o.innerHTML=`<span>${r}</span>`,s.appendChild(o);const a=document.createElement("div");a.className="notification-content";const c=document.createElement("div");c.className="notification-type",c.textContent=e.charAt(0).toUpperCase()+e.slice(1),a.appendChild(c);const d=document.createElement("div");d.className="notification-message",d.textContent=t||"No message",a.appendChild(d),s.appendChild(a);const m=document.createElement("button");m.className="notification-close",m.innerHTML="&times;",m.addEventListener("click",()=>{this.removeNotification(s);}),s.appendChild(m),i.appendChild(s),requestAnimationFrame(()=>{s.classList.add("show");});const p={element:s,timerId:window.setTimeout(()=>{this.removeNotification(s);},n)};return u.notifications.push(p),p}catch(i){return console.error("[NotificationManager] createNotification failed",i),null}}removeNotification(t){if(!t)return;const e=u.notifications.find(n=>n.element===t);e?.timerId&&window.clearTimeout(e.timerId),t.classList.remove("show"),window.setTimeout(()=>{try{t.remove(),u.notifications=u.notifications.filter(n=>n.element!==t);}catch(n){console.error("[NotificationManager] removeNotification cleanup failed",n);}},500);}}const ft="https://www.nicovideo.jp",bt=`${ft}/search`,yt=`${ft}/watch`,st={searchBase:bt,watchBase:yt},Wt=l=>`${yt}/${l}`,xt=l=>`${bt}/${encodeURIComponent(l)}`,$=l=>new Promise((t,e)=>{It({url:l.url,method:l.method??"GET",headers:l.headers,data:l.data,responseType:l.responseType??"text",timeout:l.timeout,onprogress:l.onprogress,onload:n=>{t({status:n.status,statusText:n.statusText,response:n.response,finalUrl:n.finalUrl,headers:n.responseHeaders});},onerror:n=>{const i=n?.error??"unknown error";e(new Error(`GM_xmlhttpRequest failed: ${i}`));},ontimeout:()=>{e(new Error("GM_xmlhttpRequest timeout"));}});}),P=S("dAnime:NicoApiFetcher");class K{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(t){try{const e=this.sanitizeVideoId(t),i=(await $({method:"GET",url:Wt(e),headers:{Accept:"text/html"}})).response,o=new DOMParser().parseFromString(i,"text/html").querySelector('meta[name="server-response"]');if(!o)throw new Error("API data element not found in response");const a=o.getAttribute("content");if(!a)throw new Error("API data content is empty");const c=this.decodeServerResponse(a),m=JSON.parse(c).data?.response;if(!m)throw new Error("Invalid API data structure");return this.apiData=m,m}catch(e){throw P.error("NicoApiFetcher.fetchApiData",e),e}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const t=this.apiData.comment?.nvComment;if(!t?.server||!t.params||!t.threadKey)throw new Error("Required comment server data is missing");const e=await $({method:"POST",url:`${t.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:t.params,threadKey:t.threadKey,additionals:{}})}),r=(JSON.parse(e.response).data?.threads??[]).filter(o=>o.fork==="main").sort((o,a)=>(a.commentCount||0)-(o.commentCount||0))[0];if(!r)throw new Error("Main thread not found in comment response");const s=(r.comments??[]).map(o=>({text:o.body??"",vpos:o.vposMs??0,commands:o.commands??[]}));return this.comments=s,s}catch(t){throw P.error("NicoApiFetcher.fetchComments",t),t}}async fetchAllData(t){return await this.fetchApiData(t),this.fetchComments()}sanitizeVideoId(t){try{let e=encodeURIComponent(t);return e=e.replace(/%([0-9A-F]{2})/gi,(n,i)=>{const r=parseInt(i,16);return r>=65&&r<=90||r>=97&&r<=122||r>=48&&r<=57||r===45||r===95||r===46||r===126?String.fromCharCode(r):n}),e}catch(e){return P.error("NicoApiFetcher.sanitizeVideoId",e,{videoId:t}),t}}decodeServerResponse(t){try{return decodeURIComponent(t)}catch(e){try{const n=t.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(n)}catch{throw new Error(`API data decode failed: ${e.message}`)}}}}const ot=S("dAnime:NicoVideoSearcher");class vt{cache=new Map;async search(t){if(!t.trim())return [];if(this.cache.has(t))return this.cache.get(t)??[];const e=xt(t),n=await this.fetchText(e),i=this.parseServerContext(n).map(o=>{const a=this.calculateLevenshteinDistance(t,o.title),c=Math.max(t.length,o.title.length),d=c>0?(1-a/c)*100:0;return {...o,levenshteinDistance:a,similarity:d}}),r=[],s=new Set;for(const o of i)o?.videoId&&(s.has(o.videoId)||(s.add(o.videoId),r.push(o)));return r.sort((o,a)=>{const c=o.similarity??-1,d=a.similarity??-1;return c!==d?d-c:a.viewCount-o.viewCount}),this.cache.set(t,r),r}async fetchText(t){return (await $({method:"GET",url:t})).response}parseServerContext(t){try{const n=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!n)return [];const i=n.getAttribute("content")??"",r=this.decodeHtmlEntities(i);let s;try{s=JSON.parse(r);}catch(o){return ot.error("NicoVideoSearcher.parseServerContext",o),[]}return this.extractVideoItems(s??{})}catch(e){return ot.error("NicoVideoSearcher.parseServerContext",e),[]}}decodeHtmlEntities(t){if(!t)return "";let e=t.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return e=e.replace(/&#(\d+);/g,(n,i)=>String.fromCharCode(parseInt(i,10))),e=e.replace(/&#x([0-9a-fA-F]+);/g,(n,i)=>String.fromCharCode(parseInt(i,16))),e}extractVideoItems(t){const e=[],n=r=>{const s=(r?.id??r?.contentId??r?.watchId??"").toString();if(!s)return;const o=(r?.title??r?.shortTitle??"").toString(),a=r?.count??{},c=Number(a.view??r?.viewCounter??0)||0,d=Number(a.comment??r?.commentCounter??0)||0,m=Number(a.mylist??r?.mylistCounter??0)||0,p=r?.thumbnail??{},x=(p.nHdUrl||p.listingUrl||p.largeUrl||p.middleUrl||p.url||r?.thumbnailUrl||"").toString(),f=(r?.registeredAt||r?.startTime||r?.postedDateTime||"")?.toString?.()??"",_=r?.owner&&typeof r.owner=="object"?{nickname:(r.owner.nickname??r.owner.name??"")||void 0,name:(r.owner.name??r.owner.nickname??"")||void 0}:null,E=(r?.isChannelVideo||r?.owner?.ownerType==="channel")&&r?.owner?{name:r.owner.name??""}:null;o&&e.push({videoId:s,title:o,viewCount:c,commentCount:d,mylistCount:m,thumbnail:x,postedAt:f,owner:_,channel:E});},i=r=>{if(!r)return;if(Array.isArray(r)){r.forEach(i);return}if(typeof r!="object"||r===null)return;const s=r;(s.id||s.contentId||s.watchId)&&n(s),Object.values(r).forEach(i);};return i(t),e}calculateLevenshteinDistance(t,e){const n=t?t.length:0,i=e?e.length:0;if(n===0)return i;if(i===0)return n;const r=new Array(i+1);for(let o=0;o<=i;++o){const a=r[o]=new Array(n+1);a[0]=o;}const s=r[0];for(let o=1;o<=n;++o)s[o]=o;for(let o=1;o<=i;++o)for(let a=1;a<=n;++a){const c=t[a-1]===e[o-1]?0:1;r[o][a]=Math.min(r[o-1][a]+1,r[o][a-1]+1,r[o-1][a-1]+c);}return r[i][n]}}const b={mypageHeaderTitle:".p-mypageHeader__title",mypageListContainer:".p-mypageMain",watchVideoElement:"video#video",mypageItem:".itemModule.list",mypageItemTitle:".line1",mypageEpisodeNumber:".number.line1 span",mypageEpisodeTitle:".episode.line1 span"};class j{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(t){this.delay=t;}getFuncId(t){return this.funcIds.has(t)||this.funcIds.set(t,this.nextId++),this.funcIds.get(t)??0}exec(t){const e=this.getFuncId(t),n=Date.now(),i=this.timers.get(e)?.lastExec??0,r=n-i;if(r>this.delay)t(),this.timers.set(e,{lastExec:n});else {clearTimeout(this.timers.get(e)?.timerId??void 0);const s=setTimeout(()=>{t(),this.timers.set(e,{lastExec:Date.now()});},this.delay-r);this.timers.set(e,{timerId:s,lastExec:i});}}execOnce(t){const e=this.getFuncId(t),n=this.timers.get(e);if(n?.executedOnce){n.timerId&&clearTimeout(n.timerId);return}n?.timerId&&clearTimeout(n.timerId);const i=setTimeout(()=>{try{t();}finally{this.timers.set(e,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(e,{timerId:i,executedOnce:false,scheduled:true});}cancel(t){const e=this.getFuncId(t),n=this.timers.get(e);n?.timerId&&clearTimeout(n.timerId),this.timers.delete(e);}resetExecution(t){const e=this.getFuncId(t),n=this.timers.get(e);n&&(n.timerId&&clearTimeout(n.timerId),this.timers.set(e,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,t]of this.timers)t.timerId&&clearTimeout(t.timerId);this.timers.clear(),this.funcIds.clear();}}const Ut=1e3,Gt=100,Kt=30,at=1e4,lt=100,jt=/watch\/(?:([a-z]{2}))?(\d+)/gi,g=S("dAnime:VideoSwitchHandler"),ct=l=>{if(!l?.video)return null;const t=l.video.registeredAt,e=t?new Date(t).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:l.video.id,title:l.video.title,viewCount:l.video.count?.view,mylistCount:l.video.count?.mylist,commentCount:l.video.count?.comment,postedAt:e,thumbnail:l.video.thumbnail?.url,owner:l.owner??null,channel:l.channel??null}},Yt=l=>{const t=[];let e;for(;(e=jt.exec(l))!==null;){const[,n="",i=""]=e;i&&t.push(`${n}${i}`);}return t};class wt{constructor(t,e,n,i=Ut,r=Gt){this.renderer=t,this.fetcher=e,this.settingsManager=n,this.monitorInterval=i,this.debounce=new j(r);}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=false;debounce;startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(t){if(!this.isSwitching){this.isSwitching=true;try{const e=await this.resolveVideoElement(t)??null,n=this.preloadedComments??this.lastPreloadedComments??null,i=e?.dataset?.videoId??e?.getAttribute?.("data-video-id")??null,r=this.nextVideoId??i??this.lastVideoId;if(!e||!r&&!n){this.handleMissingVideoInfo(n);return}g.info("videoSwitch:start",{videoId:r??null,elementVideoId:e.dataset?.videoId??null,preloadedCount:n?.length??0}),u.show("動画の切り替わりを検知しました...","info"),this.resetRendererState(e);const s=this.renderer.getVideoElement();if(s!==e&&e)g.debug("videoSwitch:rebind",{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof e.currentSrc=="string"&&e.currentSrc.length>0?e.currentSrc:e.getAttribute("src")??null}),this.renderer.initialize(e);else if(s===e&&e&&this.hasVideoSourceChanged(e))g.debug("videoSwitch:rebind:sameElement",{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(e)}),this.renderer.destroy(),this.renderer.initialize(e);else if(!s&&!e){g.warn("videoSwitch:missingVideoElement",{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let o=null;r&&(o=await this.fetchVideoApiData(r,n),o&&(this.persistVideoMetadata(o),this.lastVideoId=r));const a=await this.populateComments(r,n);if(a===0?(this.renderer.clearComments(),u.show("コメントを取得できませんでした","warning"),g.warn("videoSwitch:commentsMissing",{videoId:r??null})):g.info("videoSwitch:commentsLoaded",{videoId:r??null,count:a}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(e),o){const c=ct(o);if(c){const d=`コメントソースを更新しました: ${c.title??"不明なタイトル"}（${a}件）`;u.show(d,a>0?"success":"warning");}}}catch(e){g.error("videoSwitch:error",e,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),u.show(`動画切り替えエラー: ${e.message}`,"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}}async resolveVideoElement(t){if(t){const i=this.getVideoSource(t),r=this.lastVideoSource;return (!i||i===r)&&await this.waitForSourceChange(t),t}const e=Date.now()+at;let n=null;for(;Date.now()<e;){const i=document.querySelector(b.watchVideoElement);if(i){n=i;const r=this.hasVideoSourceChanged(i);if(i.readyState>=2||!i.paused||r)return r&&(this.lastVideoSource=null),i}await new Promise(r=>window.setTimeout(r,lt));}return n}async waitForSourceChange(t){const e=this.getVideoSource(t);if(!e)return;const n=Date.now()+at;for(;Date.now()<n;){const i=this.getVideoSource(t);if(i&&i!==e){this.lastVideoSource=null;return}await new Promise(r=>window.setTimeout(r,lt));}}hasVideoSourceChanged(t){const e=this.getVideoSource(t);return e?this.lastVideoSource?this.lastVideoSource!==e:true:false}getVideoSource(t){if(!t)return null;const e=typeof t.currentSrc=="string"?t.currentSrc:"";if(e.length>0)return e;const n=t.getAttribute("src")??"";if(n.length>0)return n;const i=t.querySelector("source[src]");return i&&typeof i.src=="string"&&i.src.length>0?i.src:null}resetRendererState(t){try{t.currentTime=0;}catch(e){g.debug("videoSwitch:resetCurrentTimeFailed",e);}this.renderer.clearComments();}async checkVideoEnd(){const t=this.renderer.getVideoElement();if(!(!t||!Number.isFinite(t.duration)||t.duration-t.currentTime>Kt)){if(!this.nextVideoId){const n=async()=>{await this.findNextVideoId();};this.debounce.execOnce(n);}if(this.nextVideoId&&!this.preloadedComments){const n=async()=>{await this.preloadComments();};this.debounce.execOnce(n);}}}handleMissingVideoInfo(t){t||(this.renderer.clearComments(),u.show("次の動画のコメントを取得できませんでした。コメント表示をクリアします。","warning"));}async fetchVideoApiData(t,e){try{const n=await this.fetcher.fetchApiData(t);return g.debug("videoSwitch:apiFetched",{videoId:t}),n}catch(n){if(g.error("videoSwitch:apiFetchError",n,{videoId:t}),!e)throw n;return null}}persistVideoMetadata(t){const e=ct(t);e&&this.settingsManager.saveVideoData(e.title??"",e);}async populateComments(t,e){let n=null;if(Array.isArray(e)&&e.length>0)n=e;else if(t)try{n=await this.fetcher.fetchAllData(t),g.debug("videoSwitch:commentsFetched",{videoId:t,count:n.length});}catch(r){g.error("videoSwitch:commentsFetchError",r,{videoId:t}),u.show(`コメント取得エラー: ${r.message}`,"error"),n=null;}if(!n||n.length===0)return 0;const i=n.filter(r=>!this.renderer.isNGComment(r.text));return i.forEach(r=>{this.renderer.addComment(r.text,r.vpos,r.commands);}),this.lastPreloadedComments=[...i],i.length}async findNextVideoId(){try{const t=this.fetcher.lastApiData;if(!t)return;const e=t.series?.video?.next?.id;if(e){this.nextVideoId=e,g.debug("videoSwitch:detectedNext",{videoId:e});return}const n=t.video?.description??"";if(!n)return;const i=Yt(n);if(i.length===0)return;const r=[...i].sort((s,o)=>{const a=parseInt(s.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(o.replace(/^[a-z]{2}/i,""),10)||0)-a});this.nextVideoId=r[0]??null,this.nextVideoId&&g.debug("videoSwitch:candidateFromDescription",{candidate:this.nextVideoId});}catch(t){g.error("videoSwitch:nextIdError",t,{lastVideoId:this.lastVideoId});}}async preloadComments(){if(this.nextVideoId)try{const e=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(n=>!this.renderer.isNGComment(n.text));this.preloadedComments=e.length>0?e:null,g.debug("videoSwitch:preloaded",{videoId:this.nextVideoId,count:e.length});}catch(t){g.error("videoSwitch:preloadError",t,{videoId:this.nextVideoId}),this.preloadedComments=null;}}}const Xt=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class St{static initialize(){_t(Xt);}}var Zt="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z",Jt="M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z",Qt="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",te="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z",ee="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z",ne="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z",re="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",ie="M5,4V7H10.5V19H13.5V7H19V4H5Z",se="M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z",oe="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",ae="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",le="M8,5.14V19.14L19,12.14L8,5.14Z",ce="M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z",de="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";function y(l,t=24){const e=String(t),n=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${n}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${l}"></path></svg>`}const dt=y(le),he=y(Qt),ue=y(ae),pe=y(oe),B=y(te),me=y(se),ge=y(ie),fe=y(Zt),be=y(re),ye=y(ne),xe=y(ce),ve=y(Jt),we=y(ee),Se=y(de),A=S("dAnime:SettingsUI"),h={searchInput:"#searchInput",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",opacitySelect:"#commentOpacity",visibilityToggle:"#commentVisibilityToggle",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",colorValue:".color-value",colorPreview:".color-preview",colorPickerInput:"#colorPickerInput",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",playCurrentVideo:"#playCurrentVideo",settingsModal:"#settingsModal",closeSettingsModal:"#closeSettingsModal",modalOverlay:".settings-modal__overlay",modalTabs:".settings-modal__tab",modalPane:".settings-modal__pane"},I=["search","display","ng"],ht=`
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
`,Ce=`
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
`;class T extends G{static FAB_HOST_ID="danime-settings-fab-host";settingsManager;fetcher;searcher;settings;currentVideoInfo;hostElement=null;lastAutoButtonElement=null;activeTab="search";modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;handleFabClick=t=>{t.preventDefault(),this.openSettingsModal();};handleOverlayClick=()=>{this.closeSettingsModal();};handleCloseClick=()=>{this.closeSettingsModal();};constructor(t,e=new K,n=new vt){super(),this.settingsManager=t,this.fetcher=e,this.searcher=n,this.settings=this.settingsManager.getSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData();}insertIntoMypage(){const t=document.querySelector(b.mypageHeaderTitle);t&&(this.hostElement=this.createSettingsUI(),t.parentElement?.insertBefore(this.hostElement,t.nextSibling),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}}));}addAutoCommentButtons(){document.querySelectorAll(b.mypageItem).forEach(e=>{const n=e.querySelector(b.mypageItemTitle);if(!n||n.querySelector(".auto-comment-button-host"))return;const i=n.querySelector("span")?.textContent?.trim()??"",r=e.querySelector(b.mypageEpisodeNumber)?.textContent?.trim()??"",s=e.querySelector(b.mypageEpisodeTitle)?.textContent?.trim()??"",o=document.createElement("div");o.className="nico-comment-shadow-host auto-comment-button-host",o.style.cssText="position:absolute;left:150px;top:3px;margin-left:8px;";const a=o.attachShadow({mode:"closed"}),c=document.createElement("style");c.textContent=V.getAutoButtonStyles(),a.appendChild(c);const d=document.createElement("button");d.className="auto-comment-button",d.innerHTML=B,d.setAttribute("aria-label","コメント設定"),d.setAttribute("title","コメント設定"),d.setAttribute("type","button"),d.addEventListener("click",async m=>{m.preventDefault(),m.stopPropagation(),m.stopImmediatePropagation();try{const p=[i,r,s].filter(Boolean).join(" ");this.openSettingsModal(!1),this.setSearchKeyword(p),this.lastAutoButtonElement=o;try{const f=e.querySelector('input[name="workId"]')?.value?.trim()??"",_=e.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),E=e.querySelector('a.textContainer[href*="partId="]');let M="";const k=(_?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);k?M=k[1]:E?.href&&(M=(new URL(E.href,location.origin).searchParams.get("partId")??"").trim()),f&&M&&this.settingsManager.saveLastDanimeIds({workId:f,partId:M});}catch(f){console.warn("[SettingsUI] save (workId, partId) skipped:",f);}const x=await this.executeSearch(p);if(x.length===0)return;await this.applySearchResult(x[0]);}catch(p){A.error("SettingsUI.autoCommentButton",p);}}),a.appendChild(d),n.appendChild(o),this.lastAutoButtonElement=o;}),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}});}async waitMypageListStable(){const t=document.querySelector(b.mypageListContainer);if(!t)return;let e=t.querySelectorAll(b.mypageItem).length;const n=Date.now()+1500;return new Promise(i=>{const r=new MutationObserver(()=>{const s=t.querySelectorAll(b.mypageItem).length;if(s!==e){e=s;return}Date.now()>=n&&(r.disconnect(),i());});r.observe(t,{childList:true,subtree:true}),setTimeout(()=>{try{r.disconnect();}catch(s){A.debug("waitMypageListStable: observer already disconnected",s);}i();},1600);})}tryRestoreByDanimeIds(){const t=this.settingsManager.loadLastDanimeIds();if(!t)return  false;const e=Array.from(document.querySelectorAll(b.mypageItem));for(const n of e){if(n.querySelector('input[name="workId"]')?.value?.trim()!==t.workId)continue;const r=n.querySelector('a.textContainer[href*="partId="]'),s=r?.href?(new URL(r.href,location.origin).searchParams.get("partId")??"")===t.partId:false,o=n.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),a=(()=>{const d=(o?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);return !!d&&d[1]===t.partId})();if(s||a){const c=n.querySelector(".auto-comment-button-host")??n;return this.lastAutoButtonElement=c,this.updatePlayButtonState(this.currentVideoInfo),true}}return  false}createSettingsUI(){const t=document.createElement("div");t.className="nico-comment-shadow-host settings-host",this.createShadowDOM(t),this.addStyles(V.getCommonStyles());const e=this.buildSettingsHtml();return this.setHTML(e),this.applySettingsToUI(),this.addStyles(ht),this.setupEventListeners(),t}buildSettingsHtml(){const t=i=>typeof i=="number"?i.toLocaleString():"-",e=i=>{if(!i)return "-";try{return new Date(i).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return i}},n=this.currentVideoInfo;return `
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="バージョン">${At}</span>
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
                <span class="info-icon" aria-hidden="true">${me}</span>
                <span class="sr-only">動画ID</span>
                <span class="info-value" id="currentVideoId">${n?.videoId??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="タイトル">
                <span class="info-icon" aria-hidden="true">${ge}</span>
                <span class="sr-only">タイトル</span>
                <span class="info-value" id="currentTitle">${n?.title??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="投稿者">
                <span class="info-icon" aria-hidden="true">${fe}</span>
                <span class="sr-only">投稿者</span>
                <span class="info-value" id="currentOwner">${n?.owner?.nickname??n?.channel?.name??"-"}</span>
              </div>
              <div class="info-item" role="listitem" title="再生数">
                <span class="info-icon" aria-hidden="true">${be}</span>
                <span class="sr-only">再生数</span>
                <span class="info-value" id="currentViewCount">${t(n?.viewCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="コメント数">
                <span class="info-icon" aria-hidden="true">${ye}</span>
                <span class="sr-only">コメント数</span>
                <span class="info-value" id="currentCommentCount">${t(n?.commentCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="マイリスト数">
                <span class="info-icon" aria-hidden="true">${xe}</span>
                <span class="sr-only">マイリスト数</span>
                <span class="info-value" id="currentMylistCount">${t(n?.mylistCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="投稿日">
                <span class="info-icon" aria-hidden="true">${ve}</span>
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
              <span aria-hidden="true">${he}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${B}</span>
              <span class="settings-modal__tab-label">検索</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="display" role="tab" aria-selected="false" aria-controls="settingsPaneDisplay" id="settingsTabDisplay" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${ue}</span>
              <span class="settings-modal__tab-label">表示</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${pe}</span>
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
              <span class="settings-modal__play-icon" aria-hidden="true">${dt}</span>
              <span class="settings-modal__play-label">動画を再生</span>
            </button>
            <button id="saveSettings" type="button">設定を保存</button>
          </footer>
        </div>
      </div>
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupColorPresets(),this.setupColorPicker(),this.setupOpacitySelect(),this.setupVisibilityToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupPlayButton();}setupModalControls(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick);const t=this.createOrUpdateFab(),e=this.queryModalElement(h.settingsModal),n=this.queryModalElement(h.closeSettingsModal),i=this.queryModalElement(h.modalOverlay);this.modalElement=e??null,this.closeButtonElement=n??null,this.overlayElement=i??null,!(!e||!n||!i||!t)&&(this.fabElement?.removeEventListener("click",this.handleFabClick),t.addEventListener("click",this.handleFabClick),t.setAttribute("aria-controls",e.id),t.setAttribute("aria-haspopup","dialog"),t.setAttribute("aria-expanded","false"),this.fabElement=t,n.addEventListener("click",this.handleCloseClick),i.addEventListener("click",this.handleOverlayClick),this.shadowRoot?.addEventListener("keydown",r=>{const s=r;s.key==="Escape"&&!this.modalElement?.classList.contains("hidden")&&(s.preventDefault(),this.closeSettingsModal());}),this.applySettingsToUI());}setupModalTabs(){const t=Array.from(this.queryModalSelectorAll(h.modalTabs)),e=Array.from(this.queryModalSelectorAll(h.modalPane));if(t.length===0||e.length===0)return;const n=i=>{t.forEach(r=>{const o=this.toModalTabKey(r.dataset.tab)===i;r.classList.toggle("is-active",o),r.setAttribute("aria-selected",String(o)),r.setAttribute("tabindex",o?"0":"-1");}),e.forEach(r=>{const o=this.toModalTabKey(r.dataset.pane)===i;r.classList.toggle("is-active",o),r.setAttribute("aria-hidden",String(!o));}),this.activeTab=i;};t.forEach(i=>{i.addEventListener("click",()=>{const r=this.toModalTabKey(i.dataset.tab);r&&n(r);}),i.addEventListener("keydown",r=>{const s=r;if(s.key!=="ArrowRight"&&s.key!=="ArrowLeft")return;s.preventDefault();const o=this.toModalTabKey(i.dataset.tab);if(!o)return;const a=s.key==="ArrowRight"?1:-1,c=(I.indexOf(o)+a+I.length)%I.length,d=I[c];n(d),t.find(p=>this.toModalTabKey(p.dataset.tab)===d)?.focus({preventScroll:true});});}),n(this.activeTab);}openSettingsModal(t=true){!this.modalElement||!this.fabElement||(this.modalElement.classList.remove("hidden"),this.modalElement.setAttribute("aria-hidden","false"),this.fabElement.setAttribute("aria-expanded","true"),t&&this.queryModalElement(`${h.modalTabs}.is-active`)?.focus({preventScroll:true}));}closeSettingsModal(){!this.modalElement||!this.fabElement||(this.modalElement.classList.add("hidden"),this.modalElement.setAttribute("aria-hidden","true"),this.fabElement.setAttribute("aria-expanded","false"),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:true}));}toModalTabKey(t){return t&&I.includes(t)?t:null}setupColorPresets(){this.queryModalSelectorAll(".color-preset-btn").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.color;if(!n)return;this.settings.commentColor=n;const i=this.queryModalElement(h.colorPreview),r=this.queryModalElement(h.colorValue);i&&(i.style.backgroundColor=n),r&&(r.textContent=n);});});}setupColorPicker(){const t=this.queryModalElement(h.colorPickerInput);t&&t.addEventListener("input",()=>{this.settings.commentColor=t.value;const e=this.queryModalElement(h.colorPreview),n=this.queryModalElement(h.colorValue);e&&(e.style.backgroundColor=t.value),n&&(n.textContent=t.value);});}setupOpacitySelect(){const t=this.queryModalElement(h.opacitySelect);t&&(t.value=this.settings.commentOpacity.toString(),t.addEventListener("change",()=>{const e=Number(t.value);Number.isNaN(e)||(this.settings.commentOpacity=e);}));}setupVisibilityToggle(){const t=this.queryModalElement(h.visibilityToggle);t&&(t.addEventListener("click",()=>{this.settings.isCommentVisible=!this.settings.isCommentVisible,this.updateVisibilityToggleState(t);}),this.updateVisibilityToggleState(t));}setupNgControls(){const t=this.queryModalElement(h.ngWords);t&&t.classList.remove("hidden");const e=this.queryModalElement(h.ngRegexps);e&&e.classList.remove("hidden");}setupSaveButton(){const t=this.queryModalElement(h.saveButton);t&&t.addEventListener("click",()=>this.saveSettings());}setupSearch(){const t=this.queryModalElement(h.searchInput),e=this.queryModalElement(h.searchButton),n=this.queryModalElement(h.openSearchPage),i=async()=>{const r=t?.value.trim();if(!r){u.show("キーワードを入力してください","warning");return}await this.executeSearch(r);};e?.addEventListener("click",i),t?.addEventListener("keydown",r=>{r.key==="Enter"&&i();}),n?.addEventListener("click",r=>{r.preventDefault();const s=t?.value.trim(),o=s?xt(s):st.searchBase;W().open(o,"_blank","noopener");});}async executeSearch(t){try{u.show(`「${t}」を検索中...`,"info");const e=await this.searcher.search(t);return this.renderSearchResults(e,n=>this.renderSearchResultItem(n)),e.length===0&&u.show("検索結果が見つかりませんでした","warning"),e}catch(e){return A.error("SettingsUI.executeSearch",e),[]}}setSearchKeyword(t){const e=this.queryModalElement(h.searchInput);e&&(e.value=t,e.focus({preventScroll:true}));}renderSearchResults(t,e){const n=this.queryModalElement(h.searchResults);if(!n)return;n.innerHTML=t.map(r=>e(r)).join(""),n.querySelectorAll(".search-result-item").forEach((r,s)=>{r.addEventListener("click",()=>{const a=t[s];this.applySearchResult(a);});const o=r.querySelector(".open-search-page-direct-btn");o&&o.addEventListener("click",a=>{a.stopPropagation();});});}renderSearchResultItem(t){const e=this.formatSearchResultDate(t.postedAt),n=typeof t.similarity=="number"?`
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
              ${dt}
            </span>
            <span>${t.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="コメント">
              ${we}
            </span>
            <span>${t.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="マイリスト">
              ${Se}
            </span>
            <span>${t.mylistCount.toLocaleString()}</span>
            ${n}
          </div>
          <div class="date">${e}</div>
          <a href="${st.watchBase}/${t.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(t){try{const e=await this.fetcher.fetchApiData(t.videoId);await this.fetcher.fetchComments(),u.show(`「${t.title}」のコメントを設定しました`,"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(t,e));}catch(e){A.error("SettingsUI.applySearchResult",e);}}buildVideoMetadata(t,e){return {videoId:t.videoId,title:t.title,viewCount:e.video?.count?.view??t.viewCount,commentCount:e.video?.count?.comment??t.commentCount,mylistCount:e.video?.count?.mylist??t.mylistCount,postedAt:e.video?.registeredAt??t.postedAt,thumbnail:e.video?.thumbnail?.url??t.thumbnail,owner:e.owner??t.owner??void 0,channel:e.channel??t.channel??void 0}}applySettingsToUI(){const t=this.queryModalElement(h.opacitySelect),e=this.queryModalElement(h.visibilityToggle),n=this.queryModalElement(h.colorPreview),i=this.queryModalElement(h.colorValue),r=this.queryModalElement(h.ngWords),s=this.queryModalElement(h.ngRegexps);t&&(t.value=this.settings.commentOpacity.toString()),e&&this.updateVisibilityToggleState(e),n&&(n.style.backgroundColor=this.settings.commentColor),i&&(i.textContent=this.settings.commentColor),r&&(r.value=this.settings.ngWords.join(`
`)),s&&(s.value=this.settings.ngRegexps.join(`
`)),this.updatePlayButtonState(this.currentVideoInfo);}saveSettings(){const t=this.queryModalElement(h.opacitySelect),e=this.queryModalElement(h.ngWords),n=this.queryModalElement(h.ngRegexps);if(t){const i=Number(t.value);Number.isNaN(i)||(this.settings.commentOpacity=i);}e&&(this.settings.ngWords=e.value.split(`
`).map(i=>i.trim()).filter(Boolean)),n&&(this.settings.ngRegexps=n.value.split(`
`).map(i=>i.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings)?u.show("設定を保存しました","success"):u.show("設定の保存に失敗しました","error");}updateCurrentVideoInfo(t){this.currentVideoInfo=t,[["currentTitle",t.title??"-"],["currentVideoId",t.videoId??"-"],["currentOwner",t.owner?.nickname??t.channel?.name??"-"],["currentViewCount",this.formatNumber(t.viewCount)],["currentCommentCount",this.formatNumber(t.commentCount)],["currentMylistCount",this.formatNumber(t.mylistCount)],["currentPostedAt",this.formatSearchResultDate(t.postedAt)]].forEach(([i,r])=>{const s=this.querySelector(h[i]);s&&(s.textContent=r);});const n=this.querySelector(h.currentThumbnail);n&&t.thumbnail&&(n.src=t.thumbnail,n.alt=t.title??"サムネイル");try{this.settingsManager.saveVideoData(t.title??"",t);}catch(i){A.error("SettingsUI.updateCurrentVideoInfo",i);}this.updatePlayButtonState(t);}formatNumber(t){return typeof t=="number"?t.toLocaleString():"-"}formatSearchResultDate(t){if(!t)return "-";const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(e)}setupPlayButton(){const t=this.queryModalElement(h.playCurrentVideo);t&&(t.addEventListener("click",()=>{try{if(!this.currentVideoInfo?.videoId){u.show("再生できる動画が設定されていません","warning");return}const n=this.lastAutoButtonElement?.closest(".itemModule.list");if(this.lastAutoButtonElement){const i=n?.querySelector(".thumbnailContainer > a, .thumbnail-container > a");if(i){u.show(`「${this.currentVideoInfo?.title||"動画"}」を再生します...`,"success"),setTimeout(()=>{i.click();},300);return}}u.show("再生リンクが見つかりませんでした（対象アイテム内に限定して検索済み）","warning");}catch(e){A.error("SettingsUI.playCurrentVideo",e),u.show(`再生エラー: ${e.message}`,"error");}}),this.updatePlayButtonState(this.currentVideoInfo));}updatePlayButtonState(t){const e=this.queryModalElement(h.playCurrentVideo);if(!e)return;const n=!!t?.videoId;e.disabled=!n,e.setAttribute("aria-disabled",(!n).toString());}updateVisibilityToggleState(t){t.textContent=this.settings.isCommentVisible?"表示中":"非表示中",t.classList.toggle("off",!this.settings.isCommentVisible);}destroy(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),super.destroy();}createOrUpdateFab(){if(!document.body)return null;let t=this.fabHostElement;!t||!t.isConnected?(t?.remove(),t=document.createElement("div"),t.id=T.FAB_HOST_ID,t.style.position="fixed",t.style.bottom="32px",t.style.right="32px",t.style.zIndex="2147483646",t.style.display="inline-block",this.fabShadowRoot=t.attachShadow({mode:"open"}),document.body.appendChild(t),this.fabHostElement=t):this.fabShadowRoot||(this.fabShadowRoot=t.shadowRoot??t.attachShadow({mode:"open"}));const e=this.fabShadowRoot;if(!e)return null;let n=e.querySelector("style[data-role='fab-base-style']");n||(n=document.createElement("style"),n.dataset.role="fab-base-style",n.textContent=V.getCommonStyles(),e.appendChild(n));let i=e.querySelector("style[data-role='fab-style']");i||(i=document.createElement("style"),i.dataset.role="fab-style",i.textContent=`
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
      `,e.appendChild(i));let r=e.querySelector("style[data-role='similarity-style']");r||(r=document.createElement("style"),r.dataset.role="similarity-style",r.textContent=ht,e.appendChild(r));let s=e.querySelector("style[data-role='modal-play-button-style']");s||(s=document.createElement("style"),s.dataset.role="modal-play-button-style",s.textContent=Ce,e.appendChild(s));let o=e.querySelector(".fab-container");o||(o=document.createElement("div"),o.className="fab-container",e.appendChild(o));let a=o.querySelector("button.fab-button");a||(a=document.createElement("button"),a.type="button",a.className="fab-button",o.appendChild(a)),a.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${B}</span>
      <span class="fab-button__label">設定</span>
    `,a.setAttribute("aria-label","ニコニココメント設定を開く"),a.setAttribute("aria-haspopup","dialog");let c=o.querySelector(h.settingsModal);return c||(o.insertAdjacentHTML("beforeend",this.buildModalHtml()),c=o.querySelector(h.settingsModal)),this.modalElement=c??null,a}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener("click",this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null;}queryModalElement(t){return this.fabShadowRoot?this.fabShadowRoot.querySelector(t):null}queryModalSelectorAll(t){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}}const ut=async()=>{},Ee=()=>{const l=W();if(!l.dAniRenderer){const t={};l.dAniRenderer={classes:{Comment:pt,CommentRenderer:gt,NicoApiFetcher:K,NotificationManager:u,StyleManager:St,SettingsUI:T,NicoVideoSearcher:vt,VideoSwitchHandler:wt,SettingsManager:U,KeyboardShortcutHandler:mt,DebounceExecutor:j,ShadowDOMComponent:G,ShadowStyleManager:V},instances:t,utils:{initialize:ut,initializeWithVideo:ut},debug:{showState:()=>{console.log("Current instances:",t);},showSettings:()=>{const e=t.settingsManager;if(!e){console.log("SettingsManager not initialized");return}console.log("Current settings:",e.getSettings());},showComments:()=>{const e=t.renderer;if(!e){console.log("CommentRenderer not initialized");return}console.log("Current comments:",e.getCommentsSnapshot());}},defaultSettings:w};}return l.dAniRenderer},Me=100,Ae=1e3,_e=3e3;class Ie{constructor(t){this.global=t;}initialized=false;switchDebounce=new j(Ae);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(t=>{window.addEventListener("load",()=>t(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const t=document.querySelector(b.watchVideoElement);if(!t){window.setTimeout(()=>this.waitForVideoElement(),Me);return}if(t.readyState===0){t.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(t);},{once:true});return}this.initializeWithVideo(t);}async initializeWithVideo(t){if(!this.initialized){this.initialized=true;try{u.show("コメントローダーを初期化中...");const e=u.getInstance(),n=this.global.settingsManager??new U(e);this.global.settingsManager=n,this.global.instances.settingsManager=n;const i=n.loadVideoData();if(!i?.videoId)throw new Error("動画データが見つかりません。マイページで設定してください。");const r=new K;this.global.instances.fetcher=r,await r.fetchApiData(i.videoId);const s=await r.fetchComments(),o=this.mergeSettings(n.loadSettings()),a=new gt(o);a.initialize(t),this.global.instances.renderer=a,this.currentVideoElement=t,n.addObserver(d=>{a.settings=this.mergeSettings(d);}),s.forEach(d=>{a.addComment(d.text,d.vpos,d.commands);});const c=new wt(a,r,n);c.startMonitoring(),this.global.instances.switchHandler=c,this.setupSwitchHandling(t,c),this.observeVideoElement(),u.show(`コメントの読み込みが完了しました（${s.length}件）`,"success");}catch(e){throw this.initialized=false,u.show(`初期化エラー: ${e.message}`,"error"),e}}}mergeSettings(t){const e=w();return {...e,...t,ngWords:[...t.ngWords??e.ngWords],ngRegexps:[...t.ngRegexps??e.ngRegexps]}}setupSwitchHandling(t,e){this.currentVideoElement=t,this.switchCallback=()=>{const n=Date.now();if(n-this.lastSwitchTimestamp<_e)return;this.lastSwitchTimestamp=n;const i=this.currentVideoElement;e.onVideoSwitch(i);},this.global.utils.initializeWithVideo=async n=>{n&&(this.rebindVideoElement(n),await e.onVideoSwitch(n));},this.currentVideoElement=t;}observeVideoElement(){const t=this.currentVideoElement;t&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{const e=document.querySelector(b.watchVideoElement);!e||e===this.currentVideoElement||this.rebindVideoElement(e);}),this.domMutationObserver.observe(document.body,{childList:true,subtree:true}),this.attachVideoEventListeners(t));}rebindVideoElement(t){this.detachVideoEventListeners(),this.currentVideoElement=t;const e=this.global.instances.renderer,n=this.global.instances.switchHandler;e&&(e.destroy(),e.initialize(t),e.resize()),n&&(n.onVideoSwitch(t),this.setupSwitchHandling(t,n)),this.attachVideoEventListeners(t);}attachVideoEventListeners(t){this.detachVideoEventListeners();const e=()=>{this.switchCallback&&(this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));};t.addEventListener("ended",e),t.addEventListener("loadedmetadata",e),t.addEventListener("emptied",e),this.videoEndedListener=e;}detachVideoEventListeners(){const t=this.currentVideoElement;t&&this.videoEndedListener&&(t.removeEventListener("ended",this.videoEndedListener),t.removeEventListener("loadedmetadata",this.videoEndedListener),t.removeEventListener("emptied",this.videoEndedListener)),this.videoEndedListener=null;}}const Ve=100;class ke{constructor(t){this.global=t;}initialize(){const t=u.getInstance(),e=this.global.settingsManager??new U(t);this.global.settingsManager=e,this.global.instances.settingsManager=e;const n=new T(e);this.waitForHeader(n);}waitForHeader(t){if(!document.querySelector(b.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(t),Ve);return}t.insertIntoMypage(),t.addAutoCommentButtons(),this.observeList(t);}observeList(t){const e=document.querySelector(b.mypageListContainer);if(!e)return;new MutationObserver(()=>{try{t.addAutoCommentButtons();}catch(i){console.error("[MypageController] auto comment buttons update failed",i);}}).observe(e,{childList:true,subtree:true});}}class Le{log;global=Ee();watchController=null;mypageController=null;constructor(){this.log=S("DanimeApp");}start(){this.log.info("starting renderer"),St.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const t=location.pathname.toLowerCase();try{t.includes("/animestore/sc_d_pc")?(this.watchController=new Ie(this.global),await this.watchController.initialize()):t.includes("/animestore/mp_viw_pc")?(this.mypageController=new ke(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(e){this.log.error("initialization failed",e);}}acquireInstanceLock(){const t=W();return t.__dAnimeNicoCommentRenderer2Instance=(t.__dAnimeNicoCommentRenderer2Instance??0)+1,t.__dAnimeNicoCommentRenderer2Instance===1}}const q=S("dAnimeNicoCommentRenderer2");async function Te(){q.info("bootstrap start");try{new Le().start(),q.info("bootstrap completed");}catch(l){q.error("bootstrap failed",l);}}Te();

})();