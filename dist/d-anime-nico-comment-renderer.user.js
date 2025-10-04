// ==UserScript==
// @name         dAnimeNicoCommentRenderer2
// @namespace    dAnimeNicoCommentRenderer2
// @version      5.0.0
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

  const z={debug:"debug",info:"info",warn:"warn",error:"error"},b=s=>{const t=`[${s}]`,n={};return Object.keys(z).forEach(e=>{const r=z[e];n[e]=(...i)=>{(console[r]??console.log)(t,...i);};}),n};function w(){return typeof unsafeWindow<"u"?unsafeWindow:window}const Z={commentColor:"#FFFFFF",commentOpacity:.75,isCommentVisible:true,ngWords:[],ngRegexps:[]},S=Z,f=()=>({...S,ngWords:[...S.ngWords],ngRegexps:[...S.ngRegexps]});var Q=typeof GM_addStyle<"u"?GM_addStyle:void 0,L=typeof GM_getValue<"u"?GM_getValue:void 0,F=typeof GM_setValue<"u"?GM_setValue:void 0,tt=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const D="settings",P="currentVideo",nt=s=>({...s,ngWords:[...s.ngWords],ngRegexps:[...s.ngRegexps]});class T{constructor(t){this.notifier=t,this.settings=f(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData();}settings;currentVideo;observers=new Set;getSettings(){return nt(this.settings)}loadSettings(){try{const t=L(D,null);if(!t)return this.settings=f(),this.settings;if(typeof t=="string"){const n=JSON.parse(t);this.settings={...f(),...n,ngWords:Array.isArray(n?.ngWords)?[...n.ngWords]:[],ngRegexps:Array.isArray(n?.ngRegexps)?[...n.ngRegexps]:[]};}else this.settings={...f(),...t,ngWords:Array.isArray(t.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t.ngRegexps)?[...t.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(t){return console.error("[SettingsManager] 設定の読み込みに失敗しました",t),this.notify("設定の読み込みに失敗しました","error"),this.settings=f(),this.settings}}saveSettings(){try{return F(D,JSON.stringify(this.settings)),this.notifyObservers(),this.notify("設定を保存しました","success"),!0}catch(t){return console.error("[SettingsManager] 設定の保存に失敗しました",t),this.notify("設定の保存に失敗しました","error"),false}}updateSettings(t){return this.settings={...this.settings,...t,ngWords:t.ngWords?[...t.ngWords]:[...this.settings.ngWords],ngRegexps:t.ngRegexps?[...t.ngRegexps]:[...this.settings.ngRegexps]},this.saveSettings()}addObserver(t){this.observers.add(t);}removeObserver(t){this.observers.delete(t);}notifyObservers(){const t=this.getSettings();for(const n of this.observers)try{n(t);}catch(e){console.error("[SettingsManager] 設定変更通知でエラー",e);}}loadVideoData(){try{return L(P,null)??null}catch(t){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",t),this.notify("動画データの読み込みに失敗しました","error"),null}}saveVideoData(t,n){try{const e={videoId:n.videoId,title:n.title,viewCount:n.viewCount,commentCount:n.commentCount,mylistCount:n.mylistCount,postedAt:n.postedAt,thumbnail:n.thumbnail,owner:n.owner??null,channel:n.channel??null};return F(P,e),this.currentVideo=e,!0}catch(e){return console.error("[SettingsManager] 動画データの保存に失敗しました",e),this.notify("動画データの保存に失敗しました","error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}notify(t,n="info"){this.notifier?.show(t,n);}}const C=b("dAnime:Comment");class ${text;vpos;commands;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily="Arial";opacity;isActive=false;hasShown=false;isPaused=false;lastUpdateTime=0;reservationWidth=0;constructor(t,n,e=[],r){if(typeof t!="string")throw new Error("Comment text must be a string");if(!Number.isFinite(n)||n<0)throw new Error("Comment vpos must be a non-negative number");this.text=t,this.vpos=n,this.commands=Array.isArray(e)?e:[],this.color=r.commentColor,this.opacity=r.commentOpacity;}prepare(t,n,e){try{if(!t)throw new Error("Canvas context is required");if(!Number.isFinite(n)||!Number.isFinite(e))throw new Error("Canvas dimensions must be numbers");this.fontSize=Math.max(24,Math.floor(e*.05)),t.font=`${this.fontSize}px ${this.fontFamily}`,this.width=t.measureText(this.text).width,this.height=this.fontSize;const r=t.measureText("あ".repeat(150)).width;this.reservationWidth=Math.min(r,this.width*5),this.x=n,this.baseSpeed=(n+this.reservationWidth)/720,this.speed=this.baseSpeed,this.lastUpdateTime=performance.now();}catch(r){throw C.error("Comment.prepare",r,{text:this.text,canvasWidth:n,canvasHeight:e,hasContext:!!t}),r}}update(t=1,n=false){try{if(!this.isActive||this.isPaused)return;const e=performance.now(),r=(e-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*t,this.x-=this.speed*r,this.x<-this.width&&(this.isActive=!1),this.lastUpdateTime=e,this.isPaused=n;}catch(e){C.error("Comment.update",e,{text:this.text,playbackRate:t,isPaused:n,isActive:this.isActive});}}draw(t,n=null){try{if(!this.isActive||!t)return;t.save(),t.globalAlpha=this.opacity,t.font=`${this.fontSize}px ${this.fontFamily}`;const e=n??this.x,r=this.y+this.fontSize;t.strokeStyle="#000000",t.lineWidth=Math.max(3,this.fontSize/8),t.lineJoin="round",t.strokeText(this.text,e,r),t.fillStyle=this.color,t.fillText(this.text,e,r),t.restore();}catch(e){C.error("Comment.draw",e,{text:this.text,isActive:this.isActive,hasContext:!!t,interpolatedX:n});}}}const et=new Set(["INPUT","TEXTAREA"]),k=s=>s.length===1?s.toUpperCase():s,rt=s=>s?`${s}+`:"";class H{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(t,n,e){const r=this.createShortcutKey(k(t),n);this.shortcuts.set(r,e);}removeShortcut(t,n){const e=this.createShortcutKey(k(t),n);this.shortcuts.delete(e);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(t){this.isEnabled=t;}createShortcutKey(t,n){return `${rt(n)}${t}`}extractModifier(t){const n=[];return t.ctrlKey&&n.push("Ctrl"),t.altKey&&n.push("Alt"),t.shiftKey&&n.push("Shift"),t.metaKey&&n.push("Meta"),n.length>0?n.join("+"):null}handleKeyDown(t){if(!this.isEnabled)return;const e=t.target?.tagName??"";if(et.has(e))return;const r=this.extractModifier(t),i=this.createShortcutKey(k(t.key),r),o=this.shortcuts.get(i);o&&(t.preventDefault(),o());}}const m=b("dAnime:CommentRenderer"),I=s=>s*1e3;class B{_settings;comments=[];reservedLanes=new Map;canvas=null;ctx=null;videoElement=null;laneCount=12;laneHeight=0;currentTime=0;duration=0;playbackRate=1;isPlaying=true;lastDrawTime=0;finalPhaseActive=false;virtualCanvasExtension=1e3;minLaneSpacing=1;frameId=null;keyboardHandler=null;constructor(t){this._settings=t?{...t}:f();}get settings(){return this._settings}set settings(t){this._settings={...t};}initialize(t){try{if(this.videoElement=t,this.duration=I(t.duration),this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),!this.ctx)throw new Error("Failed to acquire 2D canvas context");const n=t.getBoundingClientRect();if(n.width<=0||n.height<=0)throw new Error("Invalid video element dimensions");this.canvas.width=n.width,this.canvas.height=n.height,this.canvas.style.position="absolute",this.canvas.style.pointerEvents="none",this.canvas.style.zIndex="1000";const e=t.parentElement??document.body;e.style.position=e.style.position||"relative",e.appendChild(this.canvas),this.calculateLaneHeight(),this.setupVideoEventListeners(t),this.setupKeyboardShortcuts(),this.setupResizeListener(t),this.startAnimation();}catch(n){throw m.error("CommentRenderer.initialize",n),n}}addComment(t,n,e=[]){if(this.isNGComment(t)||this.comments.some(o=>o.text===t&&o.vpos===n))return null;const i=new $(t,n,e,this._settings);return this.comments.push(i),this.comments.sort((o,a)=>o.vpos-a.vpos),i}clearComments(){this.comments.length=0,this.ctx&&this.canvas&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}getCommentsSnapshot(){return [...this.comments]}destroy(){this.frameId&&(cancelAnimationFrame(this.frameId),this.frameId=null),this.keyboardHandler?.stopListening(),this.keyboardHandler=null,this.canvas&&(this.canvas.remove(),this.canvas=null),this.ctx=null,this.videoElement=null,this.comments.length=0,this.reservedLanes.clear();}updateSettings(t){this.settings=t;}getVideoElement(){return this.videoElement}isNGComment(t){try{return typeof t!="string"||Array.isArray(this._settings.ngWords)&&this._settings.ngWords.some(n=>typeof n=="string"&&n.length&&t.includes(n))?!0:Array.isArray(this._settings.ngRegexps)?this._settings.ngRegexps.some(n=>{try{return typeof n=="string"&&n.length?new RegExp(n).test(t):!1}catch(e){return m.error("CommentRenderer.isNGComment.regex",e,{pattern:n,text:t}),!1}}):!1}catch(n){return m.error("CommentRenderer.isNGComment",n,{text:t}),true}}calculateLaneHeight(){if(!this.canvas)return;const t=Math.max(24,Math.floor(this.canvas.height*.05));this.laneHeight=t*this.minLaneSpacing*1.2,this.laneCount=Math.max(1,Math.floor(this.canvas.height/this.laneHeight*.9));}updateComments(){const t=this.videoElement;if(!t||!this.ctx||!this.canvas)return;this.currentTime=I(t.currentTime),this.playbackRate=t.playbackRate,this.isPlaying=!t.paused;const n=this.duration>0&&this.duration-this.currentTime<=1e4;n&&!this.finalPhaseActive&&(this.finalPhaseActive=true,this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.comments.forEach(e=>{e.isActive=false;}),this.reservedLanes.clear()),!n&&this.finalPhaseActive&&(this.finalPhaseActive=false);for(const e of this.comments)this.isNGComment(e.text)||(e.color=this._settings.commentColor,e.opacity=this._settings.commentOpacity,e.isActive||(n?e.vpos>this.currentTime-1e4&&!e.hasShown:e.vpos>=this.currentTime-2e3&&e.vpos<=this.currentTime+2e3)&&(e.prepare(this.ctx,this.canvas.width+this.virtualCanvasExtension,this.canvas.height),e.lane=this.findAvailableLane(e),e.y=e.lane*this.laneHeight,e.x=this.canvas.width+this.virtualCanvasExtension,e.isActive=true,e.hasShown=true),e.isActive&&e.update(this.playbackRate,!this.isPlaying));this.comments.forEach(e=>{e.isActive&&e.x<-e.width&&(e.isActive=false);});}findAvailableLane(t){const n=this.currentTime,e=(t.reservationWidth+this.virtualCanvasExtension)/t.speed*2,r=this.minLaneSpacing;for(let i=0;i<this.laneCount;i+=1){let o=true;const a=this.reservedLanes.get(i)??[];for(const c of a){const p=n<c.endTime,h=Math.abs(i*this.laneHeight-c.comment.y)<t.height*r,u=Math.abs(t.x-c.comment.x)<Math.max(t.width,c.comment.width);if(p&&(h||u)){o=false;break}}if(o)return this.reservedLanes.has(i)||this.reservedLanes.set(i,[]),this.reservedLanes.get(i)?.push({comment:t,endTime:n+e,reservationWidth:t.reservationWidth}),i}return Math.floor(Math.random()*Math.max(this.laneCount,1))}draw(){if(!this.ctx||!this.canvas)return;this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);const t=this.comments.filter(e=>e.isActive),n=performance.now();if(this._settings.isCommentVisible){const e=(n-this.lastDrawTime)/16.666666666666668;t.forEach(r=>{const i=r.x-r.speed*e;r.draw(this.ctx,i);});}this.lastDrawTime=n;}update=()=>{this.videoElement&&this._settings.isCommentVisible&&(this.updateComments(),this.draw(),this.frameId=requestAnimationFrame(this.update));};startAnimation(){this.frameId&&cancelAnimationFrame(this.frameId),this.frameId=requestAnimationFrame(this.update);}onSeek(){!this.videoElement||!this.ctx||!this.canvas||(this.finalPhaseActive=false,this.currentTime=I(this.videoElement.currentTime),this.comments.forEach(t=>{if(t.vpos>=this.currentTime-4e3&&t.vpos<=this.currentTime+4e3){t.prepare(this.ctx,this.canvas.width,this.canvas.height),t.lane=this.findAvailableLane(t),t.y=t.lane*this.laneHeight;const n=(this.currentTime-t.vpos)/1e3,e=t.speed*n*60;t.x=this.canvas.width-e,t.isActive=t.x>-t.width,t.x<-t.width&&(t.isActive=false,t.hasShown=true);}else t.isActive=false;}),this.reservedLanes.clear());}resize(t){if(!this.canvas)return;const n=t.getBoundingClientRect(),e=this.canvas.width,r=this.canvas.height;this.canvas.width=n.width,this.canvas.height=n.height;const i=e?this.canvas.width/e:1,o=r?this.canvas.height/r:1;this.comments.forEach(a=>{a.isActive&&(a.x*=i,a.y*=o,a.baseSpeed*=i,a.speed*=i,a.fontSize=Math.max(24,Math.floor(this.canvas.height*.05)));}),this.calculateLaneHeight();}setupVideoEventListeners(t){try{t.addEventListener("play",()=>{this.isPlaying=!0;const n=performance.now();this.comments.forEach(e=>{e.lastUpdateTime=n,e.isPaused=!1;});}),t.addEventListener("pause",()=>{this.isPlaying=!1;}),t.addEventListener("seeking",()=>this.onSeek()),t.addEventListener("ratechange",()=>{this.playbackRate=t.playbackRate;});}catch(n){throw m.error("CommentRenderer.setupVideoEventListeners",n),n}}setupKeyboardShortcuts(){try{this.keyboardHandler=new H,this.keyboardHandler.addShortcut("C","Shift",()=>{try{this._settings.isCommentVisible=!this._settings.isCommentVisible,this._settings.isCommentVisible||this.comments.forEach(n=>{n.isActive=!1;}),window.dAniRenderer?.settingsManager?.updateSettings(this._settings);}catch(t){m.error(t,"CommentRenderer.keyboardShortcut");}}),this.keyboardHandler.startListening();}catch(t){m.error(t,"CommentRenderer.setupKeyboardShortcuts");}}setupResizeListener(t){try{window.addEventListener("resize",()=>{try{this.resize(t);}catch(n){m.error(n,"CommentRenderer.resize");}});}catch(n){m.error(n,"CommentRenderer.setupResizeListener");}}}class V{shadowRoot=null;container=null;createShadowDOM(t,n={mode:"closed"}){if(!t)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=t.attachShadow(n),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(t){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const n=document.createElement("style");n.textContent=t,this.shadowRoot.appendChild(n);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}querySelectorAll(t){return this.shadowRoot?this.shadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}setHTML(t){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=t;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const it=`\r
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
background: linear-gradient(90deg, var(--primary), var(--accent));\r
-webkit-background-clip: text;\r
-webkit-text-fill-color: transparent;\r
padding-bottom: 12px;\r
border-bottom: 2px solid var(--primary);\r
display: inline-block;\r
letter-spacing: 0.5px;\r
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
/* サムネイルラッパー */\r
.thumbnail-wrapper {
flex-shrink: 0;
width: 160px;
height: 120px;
position: relative;
}
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
.play-button:hover {
background: var(--accent);
transform: translate(-50%, -50%) scale(1.2);
box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}

.play-button:disabled {
opacity: 0.35;
cursor: not-allowed;
pointer-events: none;
transform: translate(-50%, -50%);
background: rgba(127, 90, 240, 0.5);
box-shadow: none;
}
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
.info-container {
flex: 1;
}

.info-container p {
margin: 8px 0;
color: var(--text-secondary);
display: flex;
align-items: center;
gap: 8px;
}

.info-container p::before {
content: '•';
color: var(--primary);
font-size: 20px;
}

.info-container span {
color: var(--text-primary);
font-weight: 500;
}
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
}\r
\r
.mask-button::before {\r
content: '🔒';\r
margin-right: 8px;\r
font-size: 16px;\r
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
.current-settings {
background: var(--bg-secondary);
padding: 16px;
border-radius: 8px;
border: 1px solid rgba(255, 255, 255, 0.05);
}
\r
.current-settings p {\r
margin: 8px 0;\r
color: var(--text-secondary);\r
}\r
\r
.current-settings span {
color: var(--text-primary);
margin-left: 8px;
font-weight: 500;
}
\r
/* 設定グループのレイアウト */\r
.display-settings-group {
display: grid;
grid-template-columns: minmax(0, 1fr) auto;
column-gap: 20px;
row-gap: 12px;
align-items: start;
}

.display-settings-group > h3 {
grid-column: 1 / -1;
margin-bottom: 12px;
}

.display-settings-group .color-setting {
grid-column: 1;
display: grid;
grid-template-columns: auto 1fr;
column-gap: 12px;
row-gap: 8px;
align-items: center;
max-width: none;
}

.display-settings-group .color-setting label {
grid-column: 1;
grid-row: 1;
margin: 0;
white-space: nowrap;
}

.display-settings-group .color-presets {
grid-column: 2;
grid-row: 1;
display: flex;
flex-wrap: wrap;
gap: 8px;
margin: 0;
max-width: none;
}

.display-settings-group .color-picker-container {
grid-column: 2;
grid-row: 2;
display: flex;
align-items: center;
gap: 8px;
margin: 0;
max-width: none;
}

.display-settings-group .color-picker {
min-width: 220px;
}

.display-settings-group .current-color-display {
grid-column: 2;
grid-row: 3;
margin-top: 0;
justify-content: flex-start;
}

.display-settings-group .opacity-setting {
grid-column: 2;
margin: 0;
align-self: center;
}

.display-settings-group .visibility-toggle {
grid-column: 1;
margin: 0;
align-self: start;
justify-self: start;
}

.color-setting {
display: flex;
align-items: center;
gap: 12px;
flex-wrap: wrap;
max-width: 320px;
}

.opacity-setting {
display: flex;
align-items: center;
gap: 12px;
margin-top: 10px;
flex-wrap: wrap;
}

.visibility-toggle {
margin-top: 8px;
}

.color-setting label,
.opacity-setting label {
display: flex;
align-items: center;
gap: 10px;
color: var(--text-primary);
font-weight: 500;
}
\r
/* カラープリセットのスタイル */\r
.color-presets {
display: flex;
flex-wrap: wrap;
gap: 8px;
margin: 6px 0 10px;
max-width: 320px;
}
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
.color-picker-container {
margin: 8px 0;
max-width: 320px;
}
\r
.color-picker-button {
background: var(--bg-primary) !important;
color: var(--text-primary) !important;
border: 1px solid rgba(255, 255, 255, 0.1) !important;
padding: 6px 12px;
display: inline-flex;
align-items: center;
}
\r
.color-picker-button::before {\r
content: '🎨';\r
margin-right: 8px;\r
}\r
\r
.color-picker-button:hover {\r
background: rgba(127, 90, 240, 0.1) !important;\r
color: var(--primary) !important;\r
border-color: var(--primary) !important;\r
}\r
\r
.color-picker {
margin-top: 14px;
padding: 16px;
background: var(--bg-primary);
border-radius: 10px;
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
animation: fadeIn 0.3s ease;
}

.color-picker-instruction {
margin: 0 0 8px;
font-size: 13px;
color: var(--text-secondary);
line-height: 1.3;
max-width: 240px;
padding: 6px 8px;
background: rgba(255, 255, 255, 0.04);
border-radius: 6px;
}
\r
@keyframes fadeIn {\r
from { opacity: 0; transform: translateY(-10px); }\r
to { opacity: 1; transform: translateY(0); }\r
}\r
\r
.color-picker input[type="color"] {
width: 100%;
height: 42px;
padding: 0;
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 8px;
cursor: pointer;
background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.15));
transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.color-picker input[type="color"]:hover {
box-shadow: 0 4px 12px rgba(127, 90, 240, 0.3);
transform: translateY(-1px);
}
\r
.current-color-display {\r
display: flex;\r
align-items: center;\r
gap: 10px;\r
margin-top: 12px;\r
font-size: 14px;\r
padding: 8px 12px;\r
background: var(--bg-secondary);\r
border-radius: 8px;\r
border: 1px solid rgba(255, 255, 255, 0.05);\r
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
#saveSettings:hover {\r
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
padding: 4px 10px;\r
border-radius: 6px;\r
cursor: pointer;\r
font-size: 12px;\r
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\r
box-shadow: 0 2px 8px rgba(127, 90, 240, 0.3);\r
display: inline-flex;\r
align-items: center;\r
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\r
}\r
\r
.auto-comment-button::before {\r
content: '💬';\r
margin-right: 4px;\r
font-size: 14px;\r
}\r
\r
.auto-comment-button:hover {\r
background: var(--accent);\r
transform: translateY(-2px) scale(1.05);\r
box-shadow: 0 4px 15px rgba(255, 137, 6, 0.4);\r
}\r
\r
/* 通知コンテナのスタイル */\r
.notification-container {\r
position: fixed;\r
top: 20px;\r
right: 20px;\r
z-index: 10000;\r
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
`,ot=`:host {
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
`,st=`:host {
--primary: #7F5AF0;
--accent: #FF8906;
}

/* 自動ボタン専用の追加スタイル */
.auto-comment-button {
background: var(--primary);
color: white;
border: none;\r
padding: 4px 10px;\r
border-radius: 6px;\r
cursor: pointer;\r
font-size: 12px;\r
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\r
box-shadow: 0 2px 8px rgba(127, 90, 240, 0.3);\r
display: inline-flex;\r
align-items: center;\r
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\r
}\r
\r
.auto-comment-button::before {\r
content: '💬';\r
margin-right: 4px;\r
font-size: 14px;\r
}\r
\r
.auto-comment-button:hover {\r
background: var(--accent);\r
transform: translateY(-2px) scale(1.05);\r
box-shadow: 0 4px 15px rgba(255, 137, 6, 0.4);\r
}\r
`;class v{static getCommonStyles(){return it}static getNotificationStyles(){return ot}static getAutoButtonStyles(){return st}}const O={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class d extends V{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new d),this.instance}static show(t,n="info",e=3e3){try{const r=this.getInstance();return r.initialize(),r.initialized?r.createNotification(t,n,e):null}catch(r){return console.error("[NotificationManager] show failed",r),null}}static removeNotification(t){this.getInstance().removeNotification(t.element);}show(t,n="info"){d.show(t,n);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 10000","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(v.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(t){console.error("[NotificationManager] initialize failed",t),this.initialized=false;}}destroy(){d.notifications.forEach(t=>{t.timerId&&window.clearTimeout(t.timerId);}),d.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,d.instance=null;}createNotification(t,n,e){try{const r=this.querySelector(".notification-container");if(!r)throw new Error("Notification container not found");const i=O[n]??O.info,o=document.createElement("div");o.className=`notification-item ${n}`;const a=document.createElement("div");a.className="notification-icon",a.innerHTML=`<span>${i}</span>`,o.appendChild(a);const c=document.createElement("div");c.className="notification-content";const p=document.createElement("div");p.className="notification-type",p.textContent=n.charAt(0).toUpperCase()+n.slice(1),c.appendChild(p);const h=document.createElement("div");h.className="notification-message",h.textContent=t||"No message",c.appendChild(h),o.appendChild(c);const u=document.createElement("button");u.className="notification-close",u.innerHTML="&times;",u.addEventListener("click",()=>{this.removeNotification(o);}),o.appendChild(u),r.appendChild(o),requestAnimationFrame(()=>{o.classList.add("show");});const g={element:o,timerId:window.setTimeout(()=>{this.removeNotification(o);},e)};return d.notifications.push(g),g}catch(r){return console.error("[NotificationManager] createNotification failed",r),null}}removeNotification(t){if(!t)return;const n=d.notifications.find(e=>e.element===t);n?.timerId&&window.clearTimeout(n.timerId),t.classList.remove("show"),window.setTimeout(()=>{try{t.remove(),d.notifications=d.notifications.filter(e=>e.element!==t);}catch(e){console.error("[NotificationManager] removeNotification cleanup failed",e);}},500);}}const R=s=>new Promise((t,n)=>{tt({url:s.url,method:s.method??"GET",headers:s.headers,data:s.data,responseType:s.responseType??"text",timeout:s.timeout,onprogress:s.onprogress,onload:e=>{t({status:e.status,statusText:e.statusText,response:e.response,finalUrl:e.finalUrl,headers:e.responseHeaders});},onerror:e=>{const r=e?.error??"unknown error";n(new Error(`GM_xmlhttpRequest failed: ${r}`));},ontimeout:()=>{n(new Error("GM_xmlhttpRequest timeout"));}});}),E=b("dAnime:NicoApiFetcher");class M{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(t){try{const n=this.sanitizeVideoId(t),r=(await R({method:"GET",url:`https://www.nicovideo.jp/watch/${n}`,headers:{Accept:"text/html"}})).response,a=new DOMParser().parseFromString(r,"text/html").querySelector('meta[name="server-response"]');if(!a)throw new Error("API data element not found in response");const c=a.getAttribute("content");if(!c)throw new Error("API data content is empty");const p=this.decodeServerResponse(c),u=JSON.parse(p).data?.response;if(!u)throw new Error("Invalid API data structure");return this.apiData=u,u}catch(n){throw E.error("NicoApiFetcher.fetchApiData",n),n}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const t=this.apiData.comment?.nvComment;if(!t?.server||!t.params||!t.threadKey)throw new Error("Required comment server data is missing");const n=await R({method:"POST",url:`${t.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:t.params,threadKey:t.threadKey,additionals:{}})}),i=(JSON.parse(n.response).data?.threads??[]).filter(a=>a.fork==="main").sort((a,c)=>(c.commentCount||0)-(a.commentCount||0))[0];if(!i)throw new Error("Main thread not found in comment response");const o=(i.comments??[]).map(a=>({text:a.body??"",vpos:a.vposMs??0,commands:a.commands??[]}));return this.comments=o,o}catch(t){throw E.error("NicoApiFetcher.fetchComments",t),t}}async fetchAllData(t){return await this.fetchApiData(t),this.fetchComments()}sanitizeVideoId(t){try{let n=encodeURIComponent(t);return n=n.replace(/%([0-9A-F]{2})/gi,(e,r)=>{const i=parseInt(r,16);return i>=65&&i<=90||i>=97&&i<=122||i>=48&&i<=57||i===45||i===95||i===46||i===126?String.fromCharCode(i):e}),n}catch(n){return E.error("NicoApiFetcher.sanitizeVideoId",n,{videoId:t}),t}}decodeServerResponse(t){try{return decodeURIComponent(t)}catch(n){try{const e=t.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(e)}catch{throw new Error(`API data decode failed: ${n.message}`)}}}}const _=b("dAnime:NicoVideoSearcher");class G{cache=new Map;async search(t){if(!t.trim())return [];if(this.cache.has(t))return this.cache.get(t)??[];const n=`https://www.nicovideo.jp/search/${encodeURIComponent(t)}`,e=await this.fetchText(n),r=this.parseServerContext(e),i=[],o=new Set;for(const a of r)a?.videoId&&(o.has(a.videoId)||(o.add(a.videoId),i.push(a)));return i.sort((a,c)=>c.viewCount-a.viewCount),this.cache.set(t,i),i}async fetchText(t){return (await R({method:"GET",url:t})).response}parseServerContext(t){try{const e=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!e)return [];const r=e.getAttribute("content")??"",i=this.decodeHtmlEntities(r);let o;try{o=JSON.parse(i);}catch(a){return _.error("NicoVideoSearcher.parseServerContext",a),[]}return this.extractVideoItems(o??{})}catch(n){return _.error("NicoVideoSearcher.parseServerContext",n),[]}}decodeHtmlEntities(t){if(!t)return "";let n=t.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return n=n.replace(/&#(\d+);/g,(e,r)=>String.fromCharCode(parseInt(r,10))),n=n.replace(/&#x([0-9a-fA-F]+);/g,(e,r)=>String.fromCharCode(parseInt(r,16))),n}extractVideoItems(t){const n=[],e=i=>{const o=(i?.id??i?.contentId??i?.watchId??"").toString();if(!o)return;const a=(i?.title??i?.shortTitle??"").toString(),c=i?.count??{},p=Number(c.view??i?.viewCounter??0)||0,h=Number(c.comment??i?.commentCounter??0)||0,u=Number(c.mylist??i?.mylistCounter??0)||0,g=i?.thumbnail??{},x=(g.nHdUrl||g.listingUrl||g.largeUrl||g.middleUrl||g.url||i?.thumbnailUrl||"").toString(),Y=(i?.registeredAt||i?.startTime||i?.postedDateTime||"")?.toString?.()??"",X=i?.owner&&typeof i.owner=="object"?{nickname:(i.owner.nickname??i.owner.name??"")||void 0,name:(i.owner.name??i.owner.nickname??"")||void 0}:null,J=(i?.isChannelVideo||i?.owner?.ownerType==="channel")&&i?.owner?{name:i.owner.name??""}:null;a&&n.push({videoId:o,title:a,viewCount:p,commentCount:h,mylistCount:u,thumbnail:x,postedAt:Y,owner:X,channel:J});},r=i=>{if(!i)return;if(Array.isArray(i)){i.forEach(r);return}if(typeof i!="object"||i===null)return;const o=i;(o.id||o.contentId||o.watchId)&&e(o),Object.values(i).forEach(r);};return r(t),n}}class N{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(t){this.delay=t;}getFuncId(t){return this.funcIds.has(t)||this.funcIds.set(t,this.nextId++),this.funcIds.get(t)??0}exec(t){const n=this.getFuncId(t),e=Date.now(),r=this.timers.get(n)?.lastExec??0,i=e-r;if(i>this.delay)t(),this.timers.set(n,{lastExec:e});else {clearTimeout(this.timers.get(n)?.timerId??void 0);const o=setTimeout(()=>{t(),this.timers.set(n,{lastExec:Date.now()});},this.delay-i);this.timers.set(n,{timerId:o,lastExec:r});}}execOnce(t){const n=this.getFuncId(t),e=this.timers.get(n);if(e?.executedOnce){e.timerId&&clearTimeout(e.timerId);return}e?.timerId&&clearTimeout(e.timerId);const r=setTimeout(()=>{try{t();}finally{this.timers.set(n,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(n,{timerId:r,executedOnce:false,scheduled:true});}cancel(t){const n=this.getFuncId(t),e=this.timers.get(n);e?.timerId&&clearTimeout(e.timerId),this.timers.delete(n);}resetExecution(t){const n=this.getFuncId(t),e=this.timers.get(n);e&&(e.timerId&&clearTimeout(e.timerId),this.timers.set(n,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,t]of this.timers)t.timerId&&clearTimeout(t.timerId);this.timers.clear(),this.funcIds.clear();}}const at=1e3,ct=100,lt=30,dt=/watch\/(?:([a-z]{2}))?(\d+)/gi,q=s=>{if(!s?.video)return null;const t=s.video.registeredAt,n=t?new Date(t).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:s.video.id,title:s.video.title,viewCount:s.video.count?.view,mylistCount:s.video.count?.mylist,commentCount:s.video.count?.comment,postedAt:n,thumbnail:s.video.thumbnail?.url,owner:s.owner??null,channel:s.channel??null}},ht=s=>{const t=[];let n;for(;(n=dt.exec(s))!==null;){const[,e="",r=""]=n;r&&t.push(`${e}${r}`);}return t};class U{constructor(t,n,e,r=at,i=ct){this.renderer=t,this.fetcher=n,this.settingsManager=e,this.monitorInterval=r,this.debounce=new N(i);}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;checkIntervalId=null;isSwitching=false;debounce;startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(t){if(!this.isSwitching){this.isSwitching=true;try{const n=this.preloadedComments??this.lastPreloadedComments??null,e=t?.dataset?.videoId??t?.getAttribute?.("data-video-id")??null,r=this.nextVideoId??e??this.lastVideoId;if(!t||!r&&!n){this.handleMissingVideoInfo(n);return}d.show("動画の切り替わりを検知しました...","info");let i=null;r&&(i=await this.fetchVideoApiData(r,n),i&&(this.persistVideoMetadata(i),this.lastVideoId=r)),this.renderer.clearComments();const o=await this.populateComments(r,n);if(o===0&&d.show("コメントを取得できませんでした","warning"),this.nextVideoId=null,this.preloadedComments=null,i){const a=q(i);if(a){const c=`コメントソースを更新しました: ${a.title??"不明なタイトル"}（${o}件）`;d.show(c,o>0?"success":"warning");}}}catch(n){console.error("[VideoSwitchHandler] 動画切り替え中にエラーが発生しました",n),d.show(`動画切り替えエラー: ${n.message}`,"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}}async checkVideoEnd(){const t=this.renderer.getVideoElement();if(!(!t||!Number.isFinite(t.duration)||t.duration-t.currentTime>lt)){if(!this.nextVideoId){const e=async()=>{await this.findNextVideoId();};this.debounce.execOnce(e);}if(this.nextVideoId&&!this.preloadedComments){const e=async()=>{await this.preloadComments();};this.debounce.execOnce(e);}}}handleMissingVideoInfo(t){t||(this.renderer.clearComments(),d.show("次の動画のコメントを取得できませんでした。コメント表示をクリアします。","warning"));}async fetchVideoApiData(t,n){try{return await this.fetcher.fetchApiData(t)}catch(e){if(console.error("[VideoSwitchHandler] API取得エラー",e),!n)throw e;return null}}persistVideoMetadata(t){const n=q(t);n&&this.settingsManager.saveVideoData(n.title??"",n);}async populateComments(t,n){let e=null;if(Array.isArray(n)&&n.length>0)e=n;else if(t)try{e=await this.fetcher.fetchAllData(t);}catch(i){console.error("[VideoSwitchHandler] コメント取得エラー",i),d.show(`コメント取得エラー: ${i.message}`,"error"),e=null;}if(!e||e.length===0)return 0;const r=e.filter(i=>!this.renderer.isNGComment(i.text));return r.forEach(i=>{this.renderer.addComment(i.text,i.vpos,i.commands);}),this.lastPreloadedComments=[...r],r.length}async findNextVideoId(){try{const t=this.fetcher.lastApiData;if(!t)return;const n=t.series?.video?.next?.id;if(n){this.nextVideoId=n;return}const e=t.video?.description??"";if(!e)return;const r=ht(e);if(r.length===0)return;const i=[...r].sort((o,a)=>{const c=parseInt(o.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(a.replace(/^[a-z]{2}/i,""),10)||0)-c});this.nextVideoId=i[0]??null;}catch(t){console.error("[VideoSwitchHandler] 次の動画ID取得エラー",t);}}async preloadComments(){if(this.nextVideoId)try{const n=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(e=>!this.renderer.isNGComment(e.text));this.preloadedComments=n.length>0?n:null;}catch(t){console.error("[VideoSwitchHandler] コメントプリロードエラー",t),this.preloadedComments=null;}}}const pt=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class j{static initialize(){Q(pt);}}const y=b("dAnime:SettingsUI"),l={searchInput:"#searchInput",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",opacitySelect:"#commentOpacity",visibilityToggle:"#commentVisibilityToggle",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",colorValue:".color-value",colorPreview:".color-preview",colorPicker:"#colorPicker",colorPickerInput:"#colorPickerInput",openColorPicker:"#openColorPicker",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",playCurrentVideo:"#playCurrentVideo"};class K extends V{settingsManager;fetcher;searcher;settings;currentVideoInfo;hostElement=null;lastAutoButtonElement=null;constructor(t,n=new M,e=new G){super(),this.settingsManager=t,this.fetcher=n,this.searcher=e,this.settings=this.settingsManager.getSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData();}insertIntoMypage(){const t=document.querySelector(".p-mypageHeader__title");t&&(this.hostElement=this.createSettingsUI(),t.parentElement?.insertBefore(this.hostElement,t.nextSibling));}addAutoCommentButtons(){document.querySelectorAll(".itemModule.list").forEach(n=>{const e=n.querySelector(".line1");if(!e||e.querySelector(".auto-comment-button-host"))return;const r=e.querySelector("span")?.textContent?.trim()??"",i=n.querySelector(".number.line1 span")?.textContent?.trim()??"",o=n.querySelector(".episode.line1 span")?.textContent?.trim()??"",a=document.createElement("div");a.className="nico-comment-shadow-host auto-comment-button-host",a.style.cssText="position:absolute;left:65px;top:3px;margin-left:8px;";const c=a.attachShadow({mode:"closed"}),p=document.createElement("style");p.textContent=v.getAutoButtonStyles(),c.appendChild(p);const h=document.createElement("button");h.className="auto-comment-button",h.textContent="コメント設定",h.setAttribute("type","button"),h.addEventListener("click",async u=>{u.preventDefault(),u.stopPropagation(),u.stopImmediatePropagation();try{const g=[r,i,o].filter(Boolean).join(" ");this.scrollToSettings(),this.setSearchKeyword(g);const x=await this.executeSearch(g);if(x.length===0)return;await this.applySearchResult(x[0]);}catch(g){y.error("SettingsUI.autoCommentButton",g);}}),c.appendChild(h),e.appendChild(a),this.lastAutoButtonElement=a;});}createSettingsUI(){const t=document.createElement("div");t.className="nico-comment-shadow-host settings-host",this.createShadowDOM(t),this.addStyles(v.getCommonStyles());const n=this.buildSettingsHtml();return this.setHTML(n),this.applySettingsToUI(),this.setupEventListeners(),t}buildSettingsHtml(){const t=r=>typeof r=="number"?r.toLocaleString():"-",n=r=>{if(!r)return "-";try{return new Date(r).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return r}},e=this.currentVideoInfo;return `
      <div class="nico-comment-settings">
        <h2>ニコニココメント設定</h2>
        <div class="setting-group search-section">
          <h3>ニコニコ動画検索</h3>
          <div class="search-container">
            <input type="text" id="searchInput" placeholder="作品名 や エピソード名 で検索">
            <button id="searchButton">検索</button>
            <button id="openSearchPageDirect" class="open-search-page-direct-btn">ニコニコ検索ページへ</button>
          </div>
          <div id="searchResults" class="search-results"></div>
        </div>
        <div class="setting-group current-settings">
          <h3>現在の設定</h3>
          <div id="currentVideoInfo" class="current-video-info">
            <div class="thumbnail-wrapper">
              <div class="thumbnail-container">
                <img id="currentThumbnail" src="${e?.thumbnail??""}" alt="サムネイル">
                <div class="thumbnail-overlay"></div>
              </div>
              <button id="playCurrentVideo" class="play-button" title="この動画を再生">
                <span class="play-icon">▶</span>
              </button>
            </div>
            <div class="info-container">
              <p>動画ID: <span id="currentVideoId">${e?.videoId??"未設定"}</span></p>
              <p>タイトル: <span id="currentTitle">${e?.title??"未設定"}</span></p>
              <p>投稿者: <span id="currentOwner">${e?.owner?.nickname??e?.channel?.name??"-"}</span></p>
              <p>再生数: <span id="currentViewCount">${t(e?.viewCount)}</span></p>
              <p>コメント数: <span id="currentCommentCount">${t(e?.commentCount)}</span></p>
              <p>マイリスト数: <span id="currentMylistCount">${t(e?.mylistCount)}</span></p>
              <p>投稿日: <span id="currentPostedAt">${n(e?.postedAt)}</span></p>
            </div>
          </div>
        </div>
        <div class="setting-group display-settings-group">
          <h3>表示設定</h3>
          <div class="color-setting">
            <label>コメント色:</label>
            <div class="color-presets">
              ${["#FFFFFF","#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF"].map(r=>`<button class="color-preset-btn" data-color="${r}" style="background-color: ${r}"></button>`).join("")}
            </div>
            <div class="color-picker-container">
              <button id="openColorPicker" class="color-picker-button">カラーピッカー</button>
              <div id="colorPicker" class="color-picker hidden">
                <p class="color-picker-instruction">下のボックスをクリックするとブラウザのカラーピッカーが開きます。</p>
                <input type="color" id="colorPickerInput" value="${this.settings.commentColor}">
              </div>
            </div>
            <span class="current-color-display">現在の色: <span class="color-preview" style="background-color: ${this.settings.commentColor}"></span><span class="color-value">${this.settings.commentColor}</span></span>
          </div>
          <div class="opacity-setting">
            <label>
              透明度:
              <select id="commentOpacity">
                ${["0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.75","0.8","0.9","1.0"].map(r=>`<option value="${r}">${r}</option>`).join("")}
              </select>
            </label>
          </div>
          <div class="visibility-toggle">
            <button id="commentVisibilityToggle" class="toggle-button${this.settings.isCommentVisible?"":" off"}">${this.settings.isCommentVisible?"表示中":"非表示中"}</button>
          </div>
        </div>
        <div class="setting-group">
          <h3>NGワード設定</h3>
          <div class="ng-words-container">
            <button id="showNgWords" class="mask-button">NGワードを表示</button>
            <textarea class="ng-words hidden" id="ngWords" placeholder="NGワードを1行ずつ入力">${this.settings.ngWords.join(`
`)}</textarea>
          </div>
        </div>
        <div class="setting-group">
          <h3>NG正規表現設定</h3>
          <div class="ng-regexp-container">
            <button id="showNgRegexp" class="mask-button">NG正規表現を表示</button>
            <textarea class="ng-words hidden" id="ngRegexps" placeholder="NG正規表現を1行ずつ入力">${this.settings.ngRegexps.join(`
`)}</textarea>
          </div>
        </div>
        <button id="saveSettings">設定を保存</button>
      </div>
    `}setupEventListeners(){this.setupColorPresets(),this.setupColorPicker(),this.setupOpacitySelect(),this.setupVisibilityToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupPlayButton();}setupColorPresets(){this.querySelectorAll(".color-preset-btn").forEach(n=>{n.addEventListener("click",()=>{const e=n.dataset.color;if(!e)return;this.settings.commentColor=e;const r=this.querySelector(l.colorPreview),i=this.querySelector(l.colorValue);r&&(r.style.backgroundColor=e),i&&(i.textContent=e);});});}setupColorPicker(){const t=this.querySelector(l.openColorPicker),n=this.querySelector(l.colorPicker),e=this.querySelector(l.colorPickerInput);!t||!n||!e||(t.addEventListener("click",()=>{n.classList.toggle("hidden");}),e.addEventListener("input",()=>{this.settings.commentColor=e.value;const r=this.querySelector(l.colorPreview),i=this.querySelector(l.colorValue);r&&(r.style.backgroundColor=e.value),i&&(i.textContent=e.value);}));}setupOpacitySelect(){const t=this.querySelector(l.opacitySelect);t&&(t.value=this.settings.commentOpacity.toString(),t.addEventListener("change",()=>{const n=Number(t.value);Number.isNaN(n)||(this.settings.commentOpacity=n);}));}setupVisibilityToggle(){const t=this.querySelector(l.visibilityToggle);t&&(t.addEventListener("click",()=>{this.settings.isCommentVisible=!this.settings.isCommentVisible,this.updateVisibilityToggleState(t);}),this.updateVisibilityToggleState(t));}setupNgControls(){const t=this.querySelector(l.ngWords),n=this.querySelector(l.ngRegexps),e=this.querySelector(l.showNgWords),r=this.querySelector(l.showNgRegexps);e?.addEventListener("click",()=>{t&&(t.classList.toggle("hidden"),e.textContent=t.classList.contains("hidden")?"NGワードを表示":"NGワードを非表示");}),r?.addEventListener("click",()=>{n&&(n.classList.toggle("hidden"),r.textContent=n.classList.contains("hidden")?"NG正規表現を表示":"NG正規表現を非表示");});}setupSaveButton(){const t=this.querySelector(l.saveButton);t&&t.addEventListener("click",()=>this.saveSettings());}setupSearch(){const t=this.querySelector(l.searchInput),n=this.querySelector(l.searchButton),e=this.querySelector(l.openSearchPage),r=async()=>{const i=t?.value.trim();if(!i){d.show("キーワードを入力してください","warning");return}await this.executeSearch(i);};n?.addEventListener("click",r),t?.addEventListener("keydown",i=>{i.key==="Enter"&&r();}),e?.addEventListener("click",i=>{i.preventDefault();const o=t?.value.trim(),a=o?`https://www.nicovideo.jp/search/${encodeURIComponent(o)}`:"https://www.nicovideo.jp/search";w().open(a,"_blank","noopener");});}async executeSearch(t){try{d.show(`「${t}」を検索中...`,"info");const n=await this.searcher.search(t);return this.renderSearchResults(n,e=>this.renderSearchResultItem(e)),n.length===0&&d.show("検索結果が見つかりませんでした","warning"),n}catch(n){return y.error("SettingsUI.executeSearch",n),[]}}scrollToSettings(){this.hostElement&&this.hostElement.scrollIntoView({behavior:"smooth",block:"start"});}setSearchKeyword(t){const n=this.querySelector(l.searchInput);n&&(n.value=t,n.focus({preventScroll:true}));}renderSearchResults(t,n){const e=this.querySelector(l.searchResults);if(!e)return;e.innerHTML=t.map(i=>n(i)).join(""),e.querySelectorAll(".search-result-item").forEach((i,o)=>{i.addEventListener("click",()=>{const a=t[o];this.applySearchResult(a);});});}renderSearchResultItem(t){const n=this.formatSearchResultDate(t.postedAt);return `
      <div class="search-result-item">
        <img src="${t.thumbnail}" alt="thumbnail">
        <div class="search-result-info">
          <div class="title">${t.title}</div>
          <div class="stats">再生 ${t.viewCount.toLocaleString()} / コメント ${t.commentCount.toLocaleString()} / マイリスト ${t.mylistCount.toLocaleString()}</div>
          <div class="date">${n}</div>
        </div>
      </div>
    `}async applySearchResult(t){try{const n=await this.fetcher.fetchApiData(t.videoId);await this.fetcher.fetchComments(),d.show(`「${t.title}」のコメントを設定しました`,"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(t,n));}catch(n){y.error("SettingsUI.applySearchResult",n);}}buildVideoMetadata(t,n){return {videoId:t.videoId,title:t.title,viewCount:n.video?.count?.view??t.viewCount,commentCount:n.video?.count?.comment??t.commentCount,mylistCount:n.video?.count?.mylist??t.mylistCount,postedAt:n.video?.registeredAt??t.postedAt,thumbnail:n.video?.thumbnail?.url??t.thumbnail,owner:n.owner??t.owner??void 0,channel:n.channel??t.channel??void 0}}applySettingsToUI(){const t=this.querySelector(l.opacitySelect),n=this.querySelector(l.visibilityToggle),e=this.querySelector(l.colorPreview),r=this.querySelector(l.colorValue),i=this.querySelector(l.ngWords),o=this.querySelector(l.ngRegexps);t&&(t.value=this.settings.commentOpacity.toString()),n&&this.updateVisibilityToggleState(n),e&&(e.style.backgroundColor=this.settings.commentColor),r&&(r.textContent=this.settings.commentColor),i&&(i.value=this.settings.ngWords.join(`
`)),o&&(o.value=this.settings.ngRegexps.join(`
`)),this.updatePlayButtonState(this.currentVideoInfo);}saveSettings(){const t=this.querySelector(l.opacitySelect),n=this.querySelector(l.ngWords),e=this.querySelector(l.ngRegexps);if(t){const r=Number(t.value);Number.isNaN(r)||(this.settings.commentOpacity=r);}n&&(this.settings.ngWords=n.value.split(`
`).map(r=>r.trim()).filter(Boolean)),e&&(this.settings.ngRegexps=e.value.split(`
`).map(r=>r.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings)?d.show("設定を保存しました","success"):d.show("設定の保存に失敗しました","error");}updateCurrentVideoInfo(t){this.currentVideoInfo=t,[["currentTitle",t.title??"-"],["currentVideoId",t.videoId??"-"],["currentOwner",t.owner?.nickname??t.channel?.name??"-"],["currentViewCount",this.formatNumber(t.viewCount)],["currentCommentCount",this.formatNumber(t.commentCount)],["currentMylistCount",this.formatNumber(t.mylistCount)],["currentPostedAt",this.formatSearchResultDate(t.postedAt)]].forEach(([r,i])=>{const o=this.querySelector(l[r]);o&&(o.textContent=i);});const e=this.querySelector(l.currentThumbnail);e&&t.thumbnail&&(e.src=t.thumbnail,e.alt=t.title??"サムネイル");try{this.settingsManager.saveVideoData(t.title??"",t);}catch(r){y.error("SettingsUI.updateCurrentVideoInfo",r);}this.updatePlayButtonState(t);}formatNumber(t){return typeof t=="number"?t.toLocaleString():"-"}formatSearchResultDate(t){if(!t)return "-";const n=new Date(t);return Number.isNaN(n.getTime())?t:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(n)}setupPlayButton(){const t=this.querySelector(l.playCurrentVideo);t&&(t.addEventListener("click",()=>{const n=this.currentVideoInfo?.videoId;if(!n){d.show("再生できる動画が設定されていません","warning");return}const e=`https://www.nicovideo.jp/watch/${encodeURIComponent(n)}`;w().open(e,"_blank","noopener");}),this.updatePlayButtonState(this.currentVideoInfo));}updatePlayButtonState(t){const n=this.querySelector(l.playCurrentVideo);if(!n)return;const e=!!t?.videoId;n.disabled=!e,n.setAttribute("aria-disabled",(!e).toString());}updateVisibilityToggleState(t){t.textContent=this.settings.isCommentVisible?"表示中":"非表示中",t.classList.toggle("off",!this.settings.isCommentVisible);}}const W=async()=>{},ut=()=>{const s=w();if(!s.dAniRenderer){const t={};s.dAniRenderer={classes:{Comment:$,CommentRenderer:B,NicoApiFetcher:M,NotificationManager:d,StyleManager:j,SettingsUI:K,NicoVideoSearcher:G,VideoSwitchHandler:U,SettingsManager:T,KeyboardShortcutHandler:H,DebounceExecutor:N,ShadowDOMComponent:V,ShadowStyleManager:v},instances:t,utils:{initialize:W,initializeWithVideo:W},debug:{showState:()=>{console.log("Current instances:",t);},showSettings:()=>{const n=t.settingsManager;if(!n){console.log("SettingsManager not initialized");return}console.log("Current settings:",n.getSettings());},showComments:()=>{const n=t.renderer;if(!n){console.log("CommentRenderer not initialized");return}console.log("Current comments:",n.getCommentsSnapshot());}},defaultSettings:f};}return s.dAniRenderer},gt="video#video",mt=100,ft=1e3,bt=3e3;class xt{constructor(t){this.global=t;}initialized=false;switchDebounce=new N(ft);switchCallback=null;lastSwitchTimestamp=0;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(t=>{window.addEventListener("load",()=>t(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const t=document.querySelector(gt);if(!t){window.setTimeout(()=>this.waitForVideoElement(),mt);return}if(t.readyState===0){t.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(t);},{once:true});return}this.initializeWithVideo(t);}async initializeWithVideo(t){if(!this.initialized){this.initialized=true;try{d.show("コメントローダーを初期化中...");const n=d.getInstance(),e=this.global.settingsManager??new T(n);this.global.settingsManager=e,this.global.instances.settingsManager=e;const r=e.loadVideoData();if(!r?.videoId)throw new Error("動画データが見つかりません。マイページで設定してください。");const i=new M;this.global.instances.fetcher=i,await i.fetchApiData(r.videoId);const o=await i.fetchComments(),a=this.mergeSettings(e.loadSettings()),c=new B(a);c.initialize(t),this.global.instances.renderer=c,e.addObserver(h=>{c.settings=this.mergeSettings(h);}),o.forEach(h=>{c.addComment(h.text,h.vpos,h.commands);});const p=new U(c,i,e);p.startMonitoring(),this.global.instances.switchHandler=p,this.setupSwitchHandling(t,p),d.show(`コメントの読み込みが完了しました（${o.length}件）`,"success");}catch(n){throw this.initialized=false,d.show(`初期化エラー: ${n.message}`,"error"),n}}}mergeSettings(t){const n=f();return {...n,...t,ngWords:[...t.ngWords??n.ngWords],ngRegexps:[...t.ngRegexps??n.ngRegexps]}}setupSwitchHandling(t,n){this.switchCallback=()=>{const r=Date.now();r-this.lastSwitchTimestamp<bt||(this.lastSwitchTimestamp=r,n.onVideoSwitch(t));},new MutationObserver(r=>{if(this.switchCallback)for(const i of r)i.type==="attributes"&&i.attributeName==="src"&&(this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));}).observe(t,{attributes:true,attributeFilter:["src"]}),t.addEventListener("ended",()=>{this.switchCallback&&(this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));}),this.global.utils.initializeWithVideo=async r=>{await n.onVideoSwitch(r);};}}const yt=".p-mypageHeader__title",wt=".p-mypageMain",vt=100;class St{constructor(t){this.global=t;}initialize(){const t=d.getInstance(),n=this.global.settingsManager??new T(t);this.global.settingsManager=n,this.global.instances.settingsManager=n;const e=new K(n);this.waitForHeader(e);}waitForHeader(t){if(!document.querySelector(yt)){window.setTimeout(()=>this.waitForHeader(t),vt);return}t.insertIntoMypage(),t.addAutoCommentButtons(),this.observeList(t);}observeList(t){const n=document.querySelector(wt);if(!n)return;new MutationObserver(()=>{try{t.addAutoCommentButtons();}catch(r){console.error("[MypageController] auto comment buttons update failed",r);}}).observe(n,{childList:true,subtree:true});}}class Ct{log;global=ut();watchController=null;mypageController=null;constructor(){this.log=b("DanimeApp");}start(){this.log.info("starting renderer"),j.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const t=location.pathname.toLowerCase();try{t.includes("/animestore/sc_d_pc")?(this.watchController=new xt(this.global),await this.watchController.initialize()):t.includes("/animestore/mp_viw_pc")?(this.mypageController=new St(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(n){this.log.error("initialization failed",n);}}acquireInstanceLock(){const t=w();return t.__dAnimeNicoCommentRenderer2Instance=(t.__dAnimeNicoCommentRenderer2Instance??0)+1,t.__dAnimeNicoCommentRenderer2Instance===1}}const A=b("dAnimeNicoCommentRenderer2");async function kt(){A.info("bootstrap start");try{new Ct().start(),A.info("bootstrap completed");}catch(s){A.error("bootstrap failed",s);}}kt();

})();