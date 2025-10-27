// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      5.5.2
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

  const tt={debug:"debug",info:"info",warn:"warn",error:"error"},S=r=>{const t=`[${r}]`,e={};return Object.keys(tt).forEach(n=>{const i=tt[n];e[n]=(...o)=>{(console[i]??console.log)(t,...o);};}),e};function q(){return typeof unsafeWindow<"u"?unsafeWindow:window}const Rt={commentColor:"#FFFFFF",commentOpacity:.75,isCommentVisible:true,ngWords:[],ngRegexps:[]},V=Rt,x=()=>({...V,ngWords:[...V.ngWords],ngRegexps:[...V.ngRegexps]});var Lt=typeof GM_addStyle<"u"?GM_addStyle:void 0,M=typeof GM_getValue<"u"?GM_getValue:void 0,N=typeof GM_setValue<"u"?GM_setValue:void 0,zt=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const et="settings",nt="currentVideo",rt="lastDanimeIds",Vt=r=>({...r,ngWords:[...r.ngWords],ngRegexps:[...r.ngRegexps]});class H{constructor(t){this.notifier=t,this.settings=x(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData();}settings;currentVideo;observers=new Set;getSettings(){return Vt(this.settings)}loadSettings(){try{const t=M(et,null);if(!t)return this.settings=x(),this.settings;if(typeof t=="string"){const e=JSON.parse(t);this.settings={...x(),...e,ngWords:Array.isArray(e?.ngWords)?[...e.ngWords]:[],ngRegexps:Array.isArray(e?.ngRegexps)?[...e.ngRegexps]:[]};}else this.settings={...x(),...t,ngWords:Array.isArray(t.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t.ngRegexps)?[...t.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(t){return console.error("[SettingsManager] 設定の読み込みに失敗しました",t),this.notify("設定の読み込みに失敗しました","error"),this.settings=x(),this.settings}}saveSettings(){try{return N(et,JSON.stringify(this.settings)),this.notifyObservers(),this.notify("設定を保存しました","success"),!0}catch(t){return console.error("[SettingsManager] 設定の保存に失敗しました",t),this.notify("設定の保存に失敗しました","error"),false}}updateSettings(t){return this.settings={...this.settings,...t,ngWords:t.ngWords?[...t.ngWords]:[...this.settings.ngWords],ngRegexps:t.ngRegexps?[...t.ngRegexps]:[...this.settings.ngRegexps]},this.saveSettings()}addObserver(t){this.observers.add(t);}removeObserver(t){this.observers.delete(t);}notifyObservers(){const t=this.getSettings();for(const e of this.observers)try{e(t);}catch(n){console.error("[SettingsManager] 設定変更通知でエラー",n);}}loadVideoData(){try{return M(nt,null)??null}catch(t){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",t),this.notify("動画データの読み込みに失敗しました","error"),null}}saveVideoData(t,e){try{const n={videoId:e.videoId,title:e.title,viewCount:e.viewCount,commentCount:e.commentCount,mylistCount:e.mylistCount,postedAt:e.postedAt,thumbnail:e.thumbnail,owner:e.owner??null,channel:e.channel??null};return N(nt,n),this.currentVideo=n,!0}catch(n){return console.error("[SettingsManager] 動画データの保存に失敗しました",n),this.notify("動画データの保存に失敗しました","error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(t){try{return N(rt,t),!0}catch(e){return console.error("[SettingsManager] saveLastDanimeIds failed",e),this.notify("ID情報の保存に失敗しました","error"),false}}loadLastDanimeIds(){try{return M(rt,null)??null}catch(t){return console.error("[SettingsManager] loadLastDanimeIds failed",t),this.notify("ID情報の読込に失敗しました","error"),null}}notify(t,e="info"){this.notifier?.show(t,e);}}const D=S("dAnime:Comment");class Mt{text;vpos;commands;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily="Arial";opacity;isActive=false;hasShown=false;isPaused=false;lastUpdateTime=0;reservationWidth=0;constructor(t,e,n=[],i){if(typeof t!="string")throw new Error("Comment text must be a string");if(!Number.isFinite(e)||e<0)throw new Error("Comment vpos must be a non-negative number");this.text=t,this.vpos=e,this.commands=Array.isArray(n)?n:[],this.color=i.commentColor,this.opacity=i.commentOpacity;}prepare(t,e,n){try{if(!t)throw new Error("Canvas context is required");if(!Number.isFinite(e)||!Number.isFinite(n))throw new Error("Canvas dimensions must be numbers");this.fontSize=Math.max(24,Math.floor(n*.05)),t.font=`${this.fontSize}px ${this.fontFamily}`,this.width=t.measureText(this.text).width,this.height=this.fontSize;const i=t.measureText("あ".repeat(150)).width;this.reservationWidth=Math.min(i,this.width*5),this.x=e,this.baseSpeed=(e+this.reservationWidth)/720,this.speed=this.baseSpeed,this.lastUpdateTime=performance.now();}catch(i){throw D.error("Comment.prepare",i,{text:this.text,canvasWidth:e,canvasHeight:n,hasContext:!!t}),i}}update(t=1,e=false){try{if(!this.isActive||this.isPaused)return;const n=performance.now(),i=(n-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*t,this.x-=this.speed*i,this.x<-this.width&&(this.isActive=!1),this.lastUpdateTime=n,this.isPaused=e;}catch(n){D.error("Comment.update",n,{text:this.text,playbackRate:t,isPaused:e,isActive:this.isActive});}}draw(t,e=null){try{if(!this.isActive||!t)return;t.save(),t.globalAlpha=this.opacity,t.font=`${this.fontSize}px ${this.fontFamily}`;const n=e??this.x,i=this.y+this.fontSize;t.strokeStyle="#000000",t.lineWidth=Math.max(3,this.fontSize/8),t.lineJoin="round",t.strokeText(this.text,n,i),t.fillStyle=this.color,t.fillText(this.text,n,i),t.restore();}catch(n){D.error("Comment.draw",n,{text:this.text,isActive:this.isActive,hasContext:!!t,interpolatedX:e});}}}const Nt=new Set(["INPUT","TEXTAREA"]),F=r=>r.length===1?r.toUpperCase():r,Dt=r=>r?`${r}+`:"";class ft{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(t,e,n){const i=this.createShortcutKey(F(t),e);this.shortcuts.set(i,n);}removeShortcut(t,e){const n=this.createShortcutKey(F(t),e);this.shortcuts.delete(n);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(t){this.isEnabled=t;}createShortcutKey(t,e){return `${Dt(e)}${t}`}extractModifier(t){const e=[];return t.ctrlKey&&e.push("Ctrl"),t.altKey&&e.push("Alt"),t.shiftKey&&e.push("Shift"),t.metaKey&&e.push("Meta"),e.length>0?e.join("+"):null}handleKeyDown(t){if(!this.isEnabled)return;const n=t.target?.tagName??"";if(Nt.has(n))return;const i=this.extractModifier(t),o=this.createShortcutKey(F(t.key),i),s=this.shortcuts.get(o);s&&(t.preventDefault(),s());}}var Ft=(function(){if(typeof document>"u")return "transform";for(var r=["oTransform","msTransform","mozTransform","webkitTransform","transform"],t=document.createElement("div").style,e=0;e<r.length;e++)if(r[e]in t)return r[e];return "transform"})();function Ot(r){var t=document.createElement("div");if(t.style.cssText="position:absolute;",typeof r.render=="function"){var e=r.render();if(e instanceof HTMLElement)return t.appendChild(e),t}if(t.textContent=r.text,r.style)for(var n in r.style)t.style[n]=r.style[n];return t}function Pt(){var r=document.createElement("div");return r.style.cssText="overflow:hidden;white-space:nowrap;transform:translateZ(0);",r}function $t(r){for(var t=r.lastChild;t;)r.removeChild(t),t=r.lastChild;}function Wt(r,t,e){r.style.width=t+"px",r.style.height=e+"px";}function Bt(){}function qt(r,t){var e=document.createDocumentFragment(),n=0,i=null;for(n=0;n<t.length;n++)i=t[n],i.node=i.node||Ot(i),e.appendChild(i.node);for(t.length&&r.appendChild(e),n=0;n<t.length;n++)i=t[n],i.width=i.width||i.node.offsetWidth,i.height=i.height||i.node.offsetHeight;}function Ht(r,t){t.node.style[Ft]="translate("+t.x+"px,"+t.y+"px)";}function Ut(r,t){r.removeChild(t.node),this.media||(t.node=null);}var Gt={name:"dom",init:Pt,clear:$t,resize:Wt,framing:Bt,setup:qt,render:Ht,remove:Ut},v=typeof window<"u"&&window.devicePixelRatio||1,O=Object.create(null);function jt(r,t){if(O[r])return O[r];var e=12,n=/(\d+(?:\.\d+)?)(px|%|em|rem)(?:\s*\/\s*(\d+(?:\.\d+)?)(px|%|em|rem)?)?/,i=r.match(n);if(i){var o=i[1]*1||10,s=i[2],a=i[3]*1||1.2,c=i[4];s==="%"&&(o*=t.container/100),s==="em"&&(o*=t.container),s==="rem"&&(o*=t.root),c==="px"&&(e=a),c==="%"&&(e=o*a/100),c==="em"&&(e=o*a),c==="rem"&&(e=t.root*a),c===void 0&&(e=o*a);}return O[r]=e,e}function Kt(r,t){if(typeof r.render=="function"){var e=r.render();if(e instanceof HTMLCanvasElement)return r.width=e.width,r.height=e.height,e}var n=document.createElement("canvas"),i=n.getContext("2d"),o=r.style||{};o.font=o.font||"10px sans-serif",o.textBaseline=o.textBaseline||"bottom";var s=o.lineWidth*1;s=s>0&&s!==1/0?Math.ceil(s):!!o.strokeStyle*1,i.font=o.font,r.width=r.width||Math.max(1,Math.ceil(i.measureText(r.text).width)+s*2),r.height=r.height||Math.ceil(jt(o.font,t))+s*2,n.width=r.width*v,n.height=r.height*v,i.scale(v,v);for(var a in o)i[a]=o[a];var c=0;switch(o.textBaseline){case "top":case "hanging":c=s;break;case "middle":c=r.height>>1;break;default:c=r.height-s;}return o.strokeStyle&&i.strokeText(r.text,s,c),i.fillText(r.text,s,c),n}function it(r){return window.getComputedStyle(r,null).getPropertyValue("font-size").match(/(.+)px/)[1]*1}function Yt(r){var t=document.createElement("canvas");return t.context=t.getContext("2d"),t._fontSize={root:it(document.getElementsByTagName("html")[0]),container:it(r)},t}function Xt(r,t){r.context.clearRect(0,0,r.width,r.height);for(var e=0;e<t.length;e++)t[e].canvas=null;}function Jt(r,t,e){r.width=t*v,r.height=e*v,r.style.width=t+"px",r.style.height=e+"px";}function Zt(r){r.context.clearRect(0,0,r.width,r.height);}function Qt(r,t){for(var e=0;e<t.length;e++){var n=t[e];n.canvas=Kt(n,r._fontSize);}}function te(r,t){r.context.drawImage(t.canvas,t.x*v,t.y*v);}function ee(r,t){t.canvas=null;}var ne={name:"canvas",init:Yt,clear:Xt,resize:Jt,framing:Zt,setup:Qt,render:te,remove:ee},ot=(function(){if(typeof window<"u"){var r=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame;if(r)return r.bind(window)}return function(t){return setTimeout(t,50/3)}})(),re=(function(){if(typeof window<"u"){var r=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame;if(r)return r.bind(window)}return clearTimeout})();function bt(r,t,e){for(var n=0,i=0,o=r.length;i<o-1;)n=i+o>>1,e>=r[n][t]?i=n:o=n;return r[i]&&e<r[i][t]?i:o}function yt(r){return /^(ltr|top|bottom)$/i.test(r)?r.toLowerCase():"rtl"}function _(){var r=9007199254740991;return [{range:0,time:-r,width:r,height:0},{range:r,time:r,width:0,height:0}]}function xt(r){r.ltr=_(),r.rtl=_(),r.top=_(),r.bottom=_();}function z(){return typeof window.performance<"u"&&window.performance.now?window.performance.now():Date.now()}function ie(r){var t=this,e=this.media?this.media.currentTime:z()/1e3,n=this.media?this.media.playbackRate:1;function i(f,g){if(g.mode==="top"||g.mode==="bottom")return e-f.time<t._.duration;var I=t._.width+f.width,C=I*(e-f.time)*n/t._.duration;if(f.width>C)return  true;var k=t._.duration+f.time-e,Z=t._.width+g.width,A=t.media?g.time:g._utc,Q=Z*(e-A)*n/t._.duration,_t=t._.width-Q,Tt=t._.duration*_t/(t._.width+g.width);return k>Tt}for(var o=this._.space[r.mode],s=0,a=0,c=1;c<o.length;c++){var l=o[c],d=r.height;if((r.mode==="top"||r.mode==="bottom")&&(d+=l.height),l.range-l.height-o[s].range>=d){a=c;break}i(l,r)&&(s=c);}var h=o[s].range,m={range:h+r.height,time:this.media?r.time:r._utc,width:r.width,height:r.height};return o.splice(s+1,a-s-1,m),r.mode==="bottom"?this._.height-r.height-h%this._.height:h%(this._.height-r.height)}function oe(r,t,e,n){return function(i){r(this._.stage);var o=i||z(),s=o/1e3,a=this.media?this.media.currentTime:s,c=this.media?this.media.playbackRate:1,l=null,d=0,h=0;for(h=this._.runningList.length-1;h>=0;h--)l=this._.runningList[h],d=this.media?l.time:l._utc,a-d>this._.duration&&(n(this._.stage,l),this._.runningList.splice(h,1));for(var m=[];this._.position<this.comments.length&&(l=this.comments[this._.position],d=this.media?l.time:l._utc,!(d>=a));){if(a-d>this._.duration){++this._.position;continue}this.media&&(l._utc=s-(this.media.currentTime-l.time)),m.push(l),++this._.position;}for(t(this._.stage,m),h=0;h<m.length;h++)l=m[h],l.y=ie.call(this,l),this._.runningList.push(l);for(h=0;h<this._.runningList.length;h++){l=this._.runningList[h];var f=this._.width+l.width,g=f*(s-l._utc)*c/this._.duration;l.mode==="ltr"&&(l.x=g-l.width),l.mode==="rtl"&&(l.x=this._.width-g),(l.mode==="top"||l.mode==="bottom")&&(l.x=this._.width-l.width>>1),e(this._.stage,l);}}}function U(){if(!this._.visible||!this._.paused)return this;if(this._.paused=false,this.media)for(var r=0;r<this._.runningList.length;r++){var t=this._.runningList[r];t._utc=z()/1e3-(this.media.currentTime-t.time);}var e=this,n=oe(this._.engine.framing.bind(this),this._.engine.setup.bind(this),this._.engine.render.bind(this),this._.engine.remove.bind(this));function i(o){n.call(e,o),e._.requestID=ot(i);}return this._.requestID=ot(i),this}function G(){return !this._.visible||this._.paused?this:(this._.paused=true,re(this._.requestID),this._.requestID=0,this)}function j(){if(!this.media)return this;this.clear(),xt(this._.space);var r=bt(this.comments,"time",this.media.currentTime);return this._.position=Math.max(0,r-1),this}function se(r){r.play=U.bind(this),r.pause=G.bind(this),r.seeking=j.bind(this),this.media.addEventListener("play",r.play),this.media.addEventListener("pause",r.pause),this.media.addEventListener("playing",r.play),this.media.addEventListener("waiting",r.pause),this.media.addEventListener("seeking",r.seeking);}function ae(r){this.media.removeEventListener("play",r.play),this.media.removeEventListener("pause",r.pause),this.media.removeEventListener("playing",r.play),this.media.removeEventListener("waiting",r.pause),this.media.removeEventListener("seeking",r.seeking),r.play=null,r.pause=null,r.seeking=null;}function ce(r){this._={},this.container=r.container||document.createElement("div"),this.media=r.media,this._.visible=true,this.engine=(r.engine||"DOM").toLowerCase(),this._.engine=this.engine==="canvas"?ne:Gt,this._.requestID=0,this._.speed=Math.max(0,r.speed)||144,this._.duration=4,this.comments=r.comments||[],this.comments.sort(function(e,n){return e.time-n.time});for(var t=0;t<this.comments.length;t++)this.comments[t].mode=yt(this.comments[t].mode);return this._.runningList=[],this._.position=0,this._.paused=true,this.media&&(this._.listener={},se.call(this,this._.listener)),this._.stage=this._.engine.init(this.container),this._.stage.style.cssText+="position:relative;pointer-events:none;",this.resize(),this.container.appendChild(this._.stage),this._.space={},xt(this._.space),(!this.media||!this.media.paused)&&(j.call(this),U.call(this)),this}function le(){if(!this.container)return this;G.call(this),this.clear(),this.container.removeChild(this._.stage),this.media&&ae.call(this,this._.listener);for(var r in this)Object.prototype.hasOwnProperty.call(this,r)&&(this[r]=null);return this}var T=["mode","time","text","render","style"];function de(r){if(!r||Object.prototype.toString.call(r)!=="[object Object]")return this;for(var t={},e=0;e<T.length;e++)r[T[e]]!==void 0&&(t[T[e]]=r[T[e]]);if(t.text=(t.text||"").toString(),t.mode=yt(t.mode),t._utc=z()/1e3,this.media){var n=0;t.time===void 0?(t.time=this.media.currentTime,n=this._.position):(n=bt(this.comments,"time",t.time),n<this._.position&&(this._.position+=1)),this.comments.splice(n,0,t);}else this.comments.push(t);return this}function he(){return this._.visible?this:(this._.visible=true,this.media&&this.media.paused?this:(j.call(this),U.call(this),this))}function ue(){return this._.visible?(G.call(this),this.clear(),this._.visible=false,this):this}function pe(){return this._.engine.clear(this._.stage,this._.runningList),this._.runningList=[],this}function me(){return this._.width=this.container.offsetWidth,this._.height=this.container.offsetHeight,this._.engine.resize(this._.stage,this._.width,this._.height),this._.duration=this._.width/this._.speed,this}var ge={get:function(){return this._.speed},set:function(r){return typeof r!="number"||isNaN(r)||!isFinite(r)||r<=0?this._.speed:(this._.speed=r,this._.width&&(this._.duration=this._.width/r),r)}};function w(r){r&&ce.call(this,r);}w.prototype.destroy=function(){return le.call(this)};w.prototype.emit=function(r){return de.call(this,r)};w.prototype.show=function(){return he.call(this)};w.prototype.hide=function(){return ue.call(this)};w.prototype.clear=function(){return pe.call(this)};w.prototype.resize=function(){return me.call(this)};Object.defineProperty(w.prototype,"speed",ge);const y=S("dAnime:CommentRenderer"),R=r=>r*1e3,fe="bold",be="'MS PGothic', 'sans-serif'",st=24,ye="1px 1px 2px #000, -1px -1px 2px #000, 1px -1px 2px #000, -1px 1px 2px #000",at=2e3,ct=16,xe=18,ve=60,lt=1.2,dt=["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"],P=()=>{const r=document;return r.fullscreenElement??r.webkitFullscreenElement??r.mozFullScreenElement??r.msFullscreenElement??null};class vt{_settings;danmaku=null;allComments=[];lastEmittedIndex=-1;canvas=null;videoElement=null;currentTime=0;duration=0;finalPhaseActive=false;keyboardHandler=null;sizeObserver=null;isResizeObserverAvailable;container=null;fullscreenEventsAttached=false;scrollListenerAttached=false;cachedFontSizePx=st;constructor(t){this._settings=t?{...t}:x(),this.isResizeObserverAvailable=typeof ResizeObserver<"u";}get settings(){return this._settings}set settings(t){this._settings={...t};}initialize(t){try{this.logDebug("initialize:start",{readyState:t.readyState,duration:t.duration}),this.danmaku&&this.destroy(),this.videoElement=t,this.duration=R(t.duration);const e=document.createElement("div");e.style.position="absolute",e.style.pointerEvents="none",e.style.zIndex="1000",e.style.top="0px",e.style.left="0px";const n=t.getBoundingClientRect();e.style.width=`${n.width}px`,e.style.height=`${n.height}px`;const i=t.parentElement??document.body;i.style.position=i.style.position||"relative",i.appendChild(e),this.container=e,this.logDebug("initialize:containerCreated",{containerParent:i.tagName,width:n.width,height:n.height}),this.danmaku=new w({container:e,media:t,comments:[],engine:"canvas",speed:144}),this.canvas=e.querySelector("canvas"),this.setupVideoEventListeners(t),this.setupKeyboardShortcuts(),this.setupResizeListener(e,t),this.logDebug("initialize:completed");}catch(e){throw y.error("CommentRenderer.initialize",e),e}}addComment(t,e,n){if(this.isNGComment(t)||this.allComments.some(s=>s.text===t&&s.time===e/1e3))return null;const o={text:t,time:e/1e3,style:this.createCommentStyle(),commands:n?[...n]:void 0};return this.allComments.push(o),this.allComments.sort((s,a)=>s.time-a.time),o}clearComments(){this.allComments=[],this.lastEmittedIndex=-1,this.finalPhaseActive=false,this.danmaku?.clear();}destroy(){this.keyboardHandler?.stopListening(),this.keyboardHandler=null,this.teardownResizeListener(),this.danmaku?.destroy(),this.danmaku=null,this.videoElement=null,this.container=null;}updateSettings(t){const e=this.settings;this.settings=t,this.danmaku&&this.syncWithDanmaku(e);}getVideoElement(){return this.videoElement}getCommentsSnapshot(){return this.allComments.map(t=>({...t,style:{...t.style},commands:t.commands?[...t.commands]:void 0}))}isNGComment(t){try{return typeof t!="string"||Array.isArray(this._settings.ngWords)&&this._settings.ngWords.some(e=>typeof e=="string"&&e.length&&t.includes(e))?!0:Array.isArray(this._settings.ngRegexps)?this._settings.ngRegexps.some(e=>{try{return typeof e=="string"&&e.length?new RegExp(e).test(t):!1}catch(n){return y.error("CommentRenderer.isNGComment.regex",n,{pattern:e,text:t}),!1}}):!1}catch(e){return y.error("CommentRenderer.isNGComment",e,{text:t}),true}}updateComments(){const t=this.videoElement;if(!t||!this.danmaku)return;this.currentTime=R(t.currentTime);const e=this.duration>0&&this.duration-this.currentTime<=1e4;e&&!this.finalPhaseActive&&(this.finalPhaseActive=true,this.danmaku.clear()),!e&&this.finalPhaseActive&&(this.finalPhaseActive=false);const n=this.currentTime+2e3;for(let i=this.lastEmittedIndex+1;i<this.allComments.length;i++){const o=this.allComments[i];if(o.time*1e3<n)this.isNGComment(o.text)||this.danmaku.emit({...o,style:this.createCommentStyle(o.style)}),this.lastEmittedIndex=i;else break}}onSeek(){if(!this.videoElement||!this.danmaku)return;this.finalPhaseActive=false,this.currentTime=R(this.videoElement.currentTime),this.danmaku.clear();const t=this.videoElement.currentTime;let e=-1;for(let n=0;n<this.allComments.length;n++)if(this.allComments[n].time>=t){e=n-1;break}this.lastEmittedIndex=e;}resize(t,e){if(!this.danmaku||!this.container){this.logDebug("resize:skipped:noInstance",{hasDanmaku:!!this.danmaku,hasContainer:!!this.container});return}const n=this.videoElement,i=n?.getBoundingClientRect(),o=t??i?.width??this.container.clientWidth,s=e??i?.height??this.container.clientHeight;if(o<=0||s<=0){this.logDebug("resize:skipped:invalidSize",{width:o,height:s});return}n&&i&&this.updateContainerPlacement(i),this.container.style.width=`${o}px`,this.container.style.height=`${s}px`,this.danmaku.resize(),this.logDebug("resize:applied",{width:o,height:s});}setupVideoEventListeners(t){try{t.addEventListener("seeking",()=>this.onSeek()),t.addEventListener("ratechange",()=>{this.danmaku&&(this.danmaku.speed=144*t.playbackRate);}),t.addEventListener("timeupdate",()=>this.updateComments());}catch(e){throw y.error("CommentRenderer.setupVideoEventListeners",e),e}}setupKeyboardShortcuts(){try{this.keyboardHandler=new ft,this.keyboardHandler.addShortcut("C","Shift",()=>{try{this._settings.isCommentVisible=!this._settings.isCommentVisible,this._settings.isCommentVisible?this.danmaku?.show():this.danmaku?.hide(),window.dAniRenderer?.settingsManager?.updateSettings(this._settings);}catch(t){y.error(t,"CommentRenderer.keyboardShortcut");}}),this.keyboardHandler.startListening();}catch(t){y.error(t,"CommentRenderer.setupKeyboardShortcuts");}}setupResizeListener(t,e){try{this.teardownResizeListener(),this.isResizeObserverAvailable?(this.sizeObserver=new ResizeObserver(n=>{try{const i=n.find(o=>o.target===e);if(!i){this.logDebug("resizeObserver:entryMissing");return}this.resize(i.contentRect.width,i.contentRect.height);}catch(i){y.error(i,"CommentRenderer.resizeObserver");}}),this.sizeObserver.observe(e),this.logDebug("setupResizeListener:observer",{observer:"ResizeObserver"})):(window.addEventListener("resize",this.handleWindowResize),this.logDebug("setupResizeListener:fallback",{observer:"window"})),this.addViewportEventListeners(),this.resize();}catch(n){y.error(n,"CommentRenderer.setupResizeListener");}}teardownResizeListener(){this.sizeObserver&&(this.sizeObserver.disconnect(),this.sizeObserver=null,this.logDebug("teardownResizeListener:observerDetached")),this.isResizeObserverAvailable||(window.removeEventListener("resize",this.handleWindowResize),this.logDebug("teardownResizeListener:fallbackDetached")),this.removeViewportEventListeners();}handleWindowResize=()=>{this.logDebug("event:windowResize"),this.resize();};handleWindowScroll=()=>{this.logDebug("event:windowScroll"),this.resize();};handleFullscreenChange=()=>{this.logDebug("event:fullscreenChange",{fullscreenElement:P()?.nodeName??null}),this.resize();};addViewportEventListeners(){this.scrollListenerAttached||(window.addEventListener("scroll",this.handleWindowScroll,{passive:true}),this.scrollListenerAttached=true,this.logDebug("viewportListeners:scrollAttached")),this.fullscreenEventsAttached||(dt.forEach(t=>{document.addEventListener(t,this.handleFullscreenChange);}),this.fullscreenEventsAttached=true,this.logDebug("viewportListeners:fullscreenAttached"));}removeViewportEventListeners(){this.scrollListenerAttached&&(window.removeEventListener("scroll",this.handleWindowScroll),this.scrollListenerAttached=false,this.logDebug("viewportListeners:scrollRemoved")),this.fullscreenEventsAttached&&(dt.forEach(t=>{document.removeEventListener(t,this.handleFullscreenChange);}),this.fullscreenEventsAttached=false,this.logDebug("viewportListeners:fullscreenRemoved"));}updateContainerPlacement(t){const e=this.container,n=this.videoElement;if(!e||!n){this.logDebug("placement:skipped",{hasContainer:!!e,hasVideo:!!n});return}this.syncContainerParent();const i=!!P(),o=e.parentElement;if(!o){this.logDebug("placement:noParent");return}if(i)e.style.position="fixed",e.style.top=`${t.top}px`,e.style.left=`${t.left}px`;else {const s=o.getBoundingClientRect(),a=t.top-s.top,c=t.left-s.left;e.style.position="absolute",e.style.top=`${a}px`,e.style.left=`${c}px`;}e.style.width=`${t.width}px`,e.style.height=`${t.height}px`,e.style.overflow="hidden",this.logDebug("placement:updated",{top:t.top,left:t.left,width:t.width,height:t.height,isFullscreen:i,parentTag:e.parentElement?.nodeName??null});}syncContainerParent(){const t=this.container,e=this.videoElement;if(!t||!e){this.logDebug("syncParent:skipped",{hasContainer:!!t,hasVideo:!!e});return}const n=P(),i=n?.contains(e)??false,o=i?n:e.parentElement;if(!o){this.logDebug("syncParent:noTarget",{isVideoInFullscreen:i,fullscreenElement:n?.nodeName??null});return}if(t.parentElement===o){this.logDebug("syncParent:alreadyAttached",{parentTag:o.nodeName});return}t.remove();const s=o instanceof HTMLElement?o.style:null;s&&!s.position&&(s.position="relative"),o.appendChild(t),this.logDebug("syncParent:reparented",{parentTag:o.nodeName,isFullscreen:i});}createCommentStyle(t){const e=this.computeFontSizePx(),n=this.composeFontString(t?.font,e),i=Number.isFinite(this._settings.commentOpacity)?Math.max(0,Math.min(1,this._settings.commentOpacity)):1,o=this.resolveStrokeWidth(t?.lineWidth,e);return {font:n,textShadow:t?.textShadow??ye,color:this._settings.commentColor,fillStyle:this._settings.commentColor,strokeStyle:t?.strokeStyle??"#000000",lineWidth:o,opacity:i.toString(),globalAlpha:i}}computeFontSizePx(){const t=this.getContainerHeight();if(t<=0)return this.cachedFontSizePx=st,this.cachedFontSizePx;const e=t/(ct*lt),n=Math.min(ve,Math.max(xe,e)),i=Math.round(n);return this.cachedFontSizePx=i,i}getContainerHeight(){if(this.container){const{height:n}=this.container.getBoundingClientRect();if(Number.isFinite(n)&&n>0)return n}const e=this.videoElement?.getBoundingClientRect()?.height;return Number.isFinite(e)&&e!==void 0&&e>0?e:this.cachedFontSizePx*ct*lt}composeFontString(t,e){if(typeof t=="string"&&t.trim().length>0){const n=/\d+(?:\.\d+)?px/iu;if(n.test(t))return t.replace(n,`${e}px`).trim()}return `${fe} ${e}px ${be}`}resolveStrokeWidth(t,e){return Number.isFinite(t)&&t!==void 0?t:Math.max(2,Math.floor(e/12))}applySettingsToComments(){this.allComments=this.allComments.map(t=>({...t,style:this.createCommentStyle(t.style)}));}syncWithDanmaku(t){const e=this.danmaku;if(!e||(this.settings.isCommentVisible?e.show():e.hide(),!(t.commentColor!==this.settings.commentColor||t.commentOpacity!==this.settings.commentOpacity||!this.areNgListsEqual(t,this.settings))))return;this.applySettingsToComments();const i=this.videoElement,o=i?R(i.currentTime):0,s=o-at;e.clear(),this.allComments.filter(c=>{const l=c.time*1e3;return l>o+at||l<s?false:!this.isNGComment(c.text)}).forEach(c=>{e.emit({...c,style:this.createCommentStyle(c.style)});});}areNgListsEqual(t,e){const n=t.ngWords??[],i=e.ngWords??[],o=t.ngRegexps??[],s=e.ngRegexps??[];return n.length!==i.length||o.length!==s.length||n.some((l,d)=>l!==i[d])?false:!o.some((l,d)=>l!==s[d])}logDebug(t,e){if(e){y.debug(t,e);return}y.debug(t);}}class K{shadowRoot=null;container=null;createShadowDOM(t,e={mode:"closed"}){if(!t)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=t.attachShadow(e),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(t){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const e=document.createElement("style");e.textContent=t,this.shadowRoot.appendChild(e);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}querySelectorAll(t){return this.shadowRoot?this.shadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}setHTML(t){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=t;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const we=`\r
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
.mask-button {
width: 100%;
text-align: left;
padding: 12px 16px;
background: var(--bg-primary);
color: var(--text-primary);\r
border: 1px solid rgba(255, 255, 255, 0.1);\r
border-radius: 8px;\r
cursor: pointer;\r
transition: all 0.3s ease;\r
margin-bottom: 12px;\r
position: relative;
overflow: hidden;
display: flex;
align-items: center;
gap: 8px;
}
\r
.mask-button__icon svg {
width: 18px;
height: 18px;
}
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
gap: 8px;
}
\r
.color-picker-button__icon svg {
width: 20px;
height: 20px;
}
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
\r
.auto-comment-button svg {
width: 16px;
height: 16px;
}
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
`,Se=`:host {
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
`,Ce=`:host {
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
`;class L{static getCommonStyles(){return we}static getNotificationStyles(){return Se}static getAutoButtonStyles(){return Ce}}const ht={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class p extends K{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new p),this.instance}static show(t,e="info",n=3e3){try{const i=this.getInstance();return i.initialize(),i.initialized?i.createNotification(t,e,n):null}catch(i){return console.error("[NotificationManager] show failed",i),null}}static removeNotification(t){this.getInstance().removeNotification(t.element);}show(t,e="info"){p.show(t,e);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 10000","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(L.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(t){console.error("[NotificationManager] initialize failed",t),this.initialized=false;}}destroy(){p.notifications.forEach(t=>{t.timerId&&window.clearTimeout(t.timerId);}),p.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,p.instance=null;}createNotification(t,e,n){try{const i=this.querySelector(".notification-container");if(!i)throw new Error("Notification container not found");const o=ht[e]??ht.info,s=document.createElement("div");s.className=`notification-item ${e}`;const a=document.createElement("div");a.className="notification-icon",a.innerHTML=`<span>${o}</span>`,s.appendChild(a);const c=document.createElement("div");c.className="notification-content";const l=document.createElement("div");l.className="notification-type",l.textContent=e.charAt(0).toUpperCase()+e.slice(1),c.appendChild(l);const d=document.createElement("div");d.className="notification-message",d.textContent=t||"No message",c.appendChild(d),s.appendChild(c);const h=document.createElement("button");h.className="notification-close",h.innerHTML="&times;",h.addEventListener("click",()=>{this.removeNotification(s);}),s.appendChild(h),i.appendChild(s),requestAnimationFrame(()=>{s.classList.add("show");});const m={element:s,timerId:window.setTimeout(()=>{this.removeNotification(s);},n)};return p.notifications.push(m),m}catch(i){return console.error("[NotificationManager] createNotification failed",i),null}}removeNotification(t){if(!t)return;const e=p.notifications.find(n=>n.element===t);e?.timerId&&window.clearTimeout(e.timerId),t.classList.remove("show"),window.setTimeout(()=>{try{t.remove(),p.notifications=p.notifications.filter(n=>n.element!==t);}catch(n){console.error("[NotificationManager] removeNotification cleanup failed",n);}},500);}}const wt="https://www.nicovideo.jp",St=`${wt}/search`,ke=`${wt}/watch`,Ee={searchBase:St},Ie=r=>`${ke}/${r}`,Ct=r=>`${St}/${encodeURIComponent(r)}`,B=r=>new Promise((t,e)=>{zt({url:r.url,method:r.method??"GET",headers:r.headers,data:r.data,responseType:r.responseType??"text",timeout:r.timeout,onprogress:r.onprogress,onload:n=>{t({status:n.status,statusText:n.statusText,response:n.response,finalUrl:n.finalUrl,headers:n.responseHeaders});},onerror:n=>{const i=n?.error??"unknown error";e(new Error(`GM_xmlhttpRequest failed: ${i}`));},ontimeout:()=>{e(new Error("GM_xmlhttpRequest timeout"));}});}),$=S("dAnime:NicoApiFetcher");class Y{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(t){try{const e=this.sanitizeVideoId(t),i=(await B({method:"GET",url:Ie(e),headers:{Accept:"text/html"}})).response,a=new DOMParser().parseFromString(i,"text/html").querySelector('meta[name="server-response"]');if(!a)throw new Error("API data element not found in response");const c=a.getAttribute("content");if(!c)throw new Error("API data content is empty");const l=this.decodeServerResponse(c),h=JSON.parse(l).data?.response;if(!h)throw new Error("Invalid API data structure");return this.apiData=h,h}catch(e){throw $.error("NicoApiFetcher.fetchApiData",e),e}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const t=this.apiData.comment?.nvComment;if(!t?.server||!t.params||!t.threadKey)throw new Error("Required comment server data is missing");const e=await B({method:"POST",url:`${t.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:t.params,threadKey:t.threadKey,additionals:{}})}),o=(JSON.parse(e.response).data?.threads??[]).filter(a=>a.fork==="main").sort((a,c)=>(c.commentCount||0)-(a.commentCount||0))[0];if(!o)throw new Error("Main thread not found in comment response");const s=(o.comments??[]).map(a=>({text:a.body??"",vpos:a.vposMs??0,commands:a.commands??[]}));return this.comments=s,s}catch(t){throw $.error("NicoApiFetcher.fetchComments",t),t}}async fetchAllData(t){return await this.fetchApiData(t),this.fetchComments()}sanitizeVideoId(t){try{let e=encodeURIComponent(t);return e=e.replace(/%([0-9A-F]{2})/gi,(n,i)=>{const o=parseInt(i,16);return o>=65&&o<=90||o>=97&&o<=122||o>=48&&o<=57||o===45||o===95||o===46||o===126?String.fromCharCode(o):n}),e}catch(e){return $.error("NicoApiFetcher.sanitizeVideoId",e,{videoId:t}),t}}decodeServerResponse(t){try{return decodeURIComponent(t)}catch(e){try{const n=t.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(n)}catch{throw new Error(`API data decode failed: ${e.message}`)}}}}const ut=S("dAnime:NicoVideoSearcher");class kt{cache=new Map;async search(t){if(!t.trim())return [];if(this.cache.has(t))return this.cache.get(t)??[];const e=Ct(t),n=await this.fetchText(e),i=this.parseServerContext(n),o=[],s=new Set;for(const a of i)a?.videoId&&(s.has(a.videoId)||(s.add(a.videoId),o.push(a)));return o.sort((a,c)=>c.viewCount-a.viewCount),this.cache.set(t,o),o}async fetchText(t){return (await B({method:"GET",url:t})).response}parseServerContext(t){try{const n=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!n)return [];const i=n.getAttribute("content")??"",o=this.decodeHtmlEntities(i);let s;try{s=JSON.parse(o);}catch(a){return ut.error("NicoVideoSearcher.parseServerContext",a),[]}return this.extractVideoItems(s??{})}catch(e){return ut.error("NicoVideoSearcher.parseServerContext",e),[]}}decodeHtmlEntities(t){if(!t)return "";let e=t.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return e=e.replace(/&#(\d+);/g,(n,i)=>String.fromCharCode(parseInt(i,10))),e=e.replace(/&#x([0-9a-fA-F]+);/g,(n,i)=>String.fromCharCode(parseInt(i,16))),e}extractVideoItems(t){const e=[],n=o=>{const s=(o?.id??o?.contentId??o?.watchId??"").toString();if(!s)return;const a=(o?.title??o?.shortTitle??"").toString(),c=o?.count??{},l=Number(c.view??o?.viewCounter??0)||0,d=Number(c.comment??o?.commentCounter??0)||0,h=Number(c.mylist??o?.mylistCounter??0)||0,m=o?.thumbnail??{},f=(m.nHdUrl||m.listingUrl||m.largeUrl||m.middleUrl||m.url||o?.thumbnailUrl||"").toString(),g=(o?.registeredAt||o?.startTime||o?.postedDateTime||"")?.toString?.()??"",I=o?.owner&&typeof o.owner=="object"?{nickname:(o.owner.nickname??o.owner.name??"")||void 0,name:(o.owner.name??o.owner.nickname??"")||void 0}:null,C=(o?.isChannelVideo||o?.owner?.ownerType==="channel")&&o?.owner?{name:o.owner.name??""}:null;a&&e.push({videoId:s,title:a,viewCount:l,commentCount:d,mylistCount:h,thumbnail:f,postedAt:g,owner:I,channel:C});},i=o=>{if(!o)return;if(Array.isArray(o)){o.forEach(i);return}if(typeof o!="object"||o===null)return;const s=o;(s.id||s.contentId||s.watchId)&&n(s),Object.values(o).forEach(i);};return i(t),e}}class X{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(t){this.delay=t;}getFuncId(t){return this.funcIds.has(t)||this.funcIds.set(t,this.nextId++),this.funcIds.get(t)??0}exec(t){const e=this.getFuncId(t),n=Date.now(),i=this.timers.get(e)?.lastExec??0,o=n-i;if(o>this.delay)t(),this.timers.set(e,{lastExec:n});else {clearTimeout(this.timers.get(e)?.timerId??void 0);const s=setTimeout(()=>{t(),this.timers.set(e,{lastExec:Date.now()});},this.delay-o);this.timers.set(e,{timerId:s,lastExec:i});}}execOnce(t){const e=this.getFuncId(t),n=this.timers.get(e);if(n?.executedOnce){n.timerId&&clearTimeout(n.timerId);return}n?.timerId&&clearTimeout(n.timerId);const i=setTimeout(()=>{try{t();}finally{this.timers.set(e,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(e,{timerId:i,executedOnce:false,scheduled:true});}cancel(t){const e=this.getFuncId(t),n=this.timers.get(e);n?.timerId&&clearTimeout(n.timerId),this.timers.delete(e);}resetExecution(t){const e=this.getFuncId(t),n=this.timers.get(e);n&&(n.timerId&&clearTimeout(n.timerId),this.timers.set(e,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,t]of this.timers)t.timerId&&clearTimeout(t.timerId);this.timers.clear(),this.funcIds.clear();}}const Ae=1e3,_e=100,Te=30,Re=/watch\/(?:([a-z]{2}))?(\d+)/gi,pt=r=>{if(!r?.video)return null;const t=r.video.registeredAt,e=t?new Date(t).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:r.video.id,title:r.video.title,viewCount:r.video.count?.view,mylistCount:r.video.count?.mylist,commentCount:r.video.count?.comment,postedAt:e,thumbnail:r.video.thumbnail?.url,owner:r.owner??null,channel:r.channel??null}},Le=r=>{const t=[];let e;for(;(e=Re.exec(r))!==null;){const[,n="",i=""]=e;i&&t.push(`${n}${i}`);}return t};class Et{constructor(t,e,n,i=Ae,o=_e){this.renderer=t,this.fetcher=e,this.settingsManager=n,this.monitorInterval=i,this.debounce=new X(o);}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;checkIntervalId=null;isSwitching=false;debounce;startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(t){if(!this.isSwitching){this.isSwitching=true;try{const e=this.preloadedComments??this.lastPreloadedComments??null,n=t?.dataset?.videoId??t?.getAttribute?.("data-video-id")??null,i=this.nextVideoId??n??this.lastVideoId;if(!t||!i&&!e){this.handleMissingVideoInfo(e);return}p.show("動画の切り替わりを検知しました...","info");const o=this.renderer.getVideoElement();o!==t&&t&&(o&&this.renderer.destroy(),this.renderer.initialize(t));let s=null;i&&(s=await this.fetchVideoApiData(i,e),s&&(this.persistVideoMetadata(s),this.lastVideoId=i));const a=await this.populateComments(i,e);if(a===0&&(this.renderer.clearComments(),p.show("コメントを取得できませんでした","warning")),this.nextVideoId=null,this.preloadedComments=null,s){const c=pt(s);if(c){const l=`コメントソースを更新しました: ${c.title??"不明なタイトル"}（${a}件）`;p.show(l,a>0?"success":"warning");}}}catch(e){console.error("[VideoSwitchHandler] 動画切り替え中にエラーが発生しました",e),p.show(`動画切り替えエラー: ${e.message}`,"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}}async checkVideoEnd(){const t=this.renderer.getVideoElement();if(!(!t||!Number.isFinite(t.duration)||t.duration-t.currentTime>Te)){if(!this.nextVideoId){const n=async()=>{await this.findNextVideoId();};this.debounce.execOnce(n);}if(this.nextVideoId&&!this.preloadedComments){const n=async()=>{await this.preloadComments();};this.debounce.execOnce(n);}}}handleMissingVideoInfo(t){t||(this.renderer.clearComments(),p.show("次の動画のコメントを取得できませんでした。コメント表示をクリアします。","warning"));}async fetchVideoApiData(t,e){try{return await this.fetcher.fetchApiData(t)}catch(n){if(console.error("[VideoSwitchHandler] API取得エラー",n),!e)throw n;return null}}persistVideoMetadata(t){const e=pt(t);e&&this.settingsManager.saveVideoData(e.title??"",e);}async populateComments(t,e){let n=null;if(Array.isArray(e)&&e.length>0)n=e;else if(t)try{n=await this.fetcher.fetchAllData(t);}catch(o){console.error("[VideoSwitchHandler] コメント取得エラー",o),p.show(`コメント取得エラー: ${o.message}`,"error"),n=null;}if(!n||n.length===0)return 0;const i=n.filter(o=>!this.renderer.isNGComment(o.text));return i.forEach(o=>{this.renderer.addComment(o.text,o.vpos,o.commands);}),this.lastPreloadedComments=[...i],i.length}async findNextVideoId(){try{const t=this.fetcher.lastApiData;if(!t)return;const e=t.series?.video?.next?.id;if(e){this.nextVideoId=e;return}const n=t.video?.description??"";if(!n)return;const i=Le(n);if(i.length===0)return;const o=[...i].sort((s,a)=>{const c=parseInt(s.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(a.replace(/^[a-z]{2}/i,""),10)||0)-c});this.nextVideoId=o[0]??null;}catch(t){console.error("[VideoSwitchHandler] 次の動画ID取得エラー",t);}}async preloadComments(){if(this.nextVideoId)try{const e=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(n=>!this.renderer.isNGComment(n.text));this.preloadedComments=e.length>0?e:null;}catch(t){console.error("[VideoSwitchHandler] コメントプリロードエラー",t),this.preloadedComments=null;}}}const ze=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class It{static initialize(){Lt(ze);}}var Ve="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z",Me="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",Ne="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z";function J(r,t=24){const e=String(t),n=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${n}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${r}"></path></svg>`}const De=J(Ne),mt=J(Me),Fe=J(Ve),b={mypageHeaderTitle:".p-mypageHeader__title",mypageListContainer:".p-mypageMain",watchVideoElement:"video#video",mypageItem:".itemModule.list",mypageItemTitle:".line1",mypageEpisodeNumber:".number.line1 span",mypageEpisodeTitle:".episode.line1 span"},E=S("dAnime:SettingsUI"),u={searchInput:"#searchInput",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",opacitySelect:"#commentOpacity",visibilityToggle:"#commentVisibilityToggle",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",colorValue:".color-value",colorPreview:".color-preview",colorPicker:"#colorPicker",colorPickerInput:"#colorPickerInput",openColorPicker:"#openColorPicker",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",playCurrentVideo:"#playCurrentVideo"};class At extends K{settingsManager;fetcher;searcher;settings;currentVideoInfo;hostElement=null;lastAutoButtonElement=null;constructor(t,e=new Y,n=new kt){super(),this.settingsManager=t,this.fetcher=e,this.searcher=n,this.settings=this.settingsManager.getSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData();}insertIntoMypage(){const t=document.querySelector(b.mypageHeaderTitle);t&&(this.hostElement=this.createSettingsUI(),t.parentElement?.insertBefore(this.hostElement,t.nextSibling),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}}));}addAutoCommentButtons(){document.querySelectorAll(b.mypageItem).forEach(e=>{const n=e.querySelector(b.mypageItemTitle);if(!n||n.querySelector(".auto-comment-button-host"))return;const i=n.querySelector("span")?.textContent?.trim()??"",o=e.querySelector(b.mypageEpisodeNumber)?.textContent?.trim()??"",s=e.querySelector(b.mypageEpisodeTitle)?.textContent?.trim()??"",a=document.createElement("div");a.className="nico-comment-shadow-host auto-comment-button-host",a.style.cssText="position:absolute;left:150px;top:3px;margin-left:8px;";const c=a.attachShadow({mode:"closed"}),l=document.createElement("style");l.textContent=L.getAutoButtonStyles(),c.appendChild(l);const d=document.createElement("button");d.className="auto-comment-button",d.innerHTML=Fe,d.setAttribute("aria-label","コメント設定"),d.setAttribute("title","コメント設定"),d.setAttribute("type","button"),d.addEventListener("click",async h=>{h.preventDefault(),h.stopPropagation(),h.stopImmediatePropagation();try{const m=[i,o,s].filter(Boolean).join(" ");this.scrollToSettings(),this.setSearchKeyword(m),this.lastAutoButtonElement=a;try{const g=e.querySelector('input[name="workId"]')?.value?.trim()??"",I=e.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),C=e.querySelector('a.textContainer[href*="partId="]');let k="";const A=(I?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);A?k=A[1]:C?.href&&(k=(new URL(C.href,location.origin).searchParams.get("partId")??"").trim()),g&&k&&this.settingsManager.saveLastDanimeIds({workId:g,partId:k});}catch(g){console.warn("[SettingsUI] save (workId, partId) skipped:",g);}const f=await this.executeSearch(m);if(f.length===0)return;await this.applySearchResult(f[0]);}catch(m){E.error("SettingsUI.autoCommentButton",m);}}),c.appendChild(d),n.appendChild(a),this.lastAutoButtonElement=a;}),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}});}async waitMypageListStable(){const t=document.querySelector(b.mypageListContainer);if(!t)return;let e=t.querySelectorAll(b.mypageItem).length;const n=Date.now()+1500;return new Promise(i=>{const o=new MutationObserver(()=>{const s=t.querySelectorAll(b.mypageItem).length;if(s!==e){e=s;return}Date.now()>=n&&(o.disconnect(),i());});o.observe(t,{childList:true,subtree:true}),setTimeout(()=>{try{o.disconnect();}catch(s){E.debug("waitMypageListStable: observer already disconnected",s);}i();},1600);})}tryRestoreByDanimeIds(){const t=this.settingsManager.loadLastDanimeIds();if(!t)return  false;const e=Array.from(document.querySelectorAll(b.mypageItem));for(const n of e){if(n.querySelector('input[name="workId"]')?.value?.trim()!==t.workId)continue;const o=n.querySelector('a.textContainer[href*="partId="]'),s=o?.href?(new URL(o.href,location.origin).searchParams.get("partId")??"")===t.partId:false,a=n.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),c=(()=>{const d=(a?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);return !!d&&d[1]===t.partId})();if(s||c){const l=n.querySelector(".auto-comment-button-host")??n;return this.lastAutoButtonElement=l,this.updatePlayButtonState(this.currentVideoInfo),true}}return  false}createSettingsUI(){const t=document.createElement("div");t.className="nico-comment-shadow-host settings-host",this.createShadowDOM(t),this.addStyles(L.getCommonStyles());const e=this.buildSettingsHtml();return this.setHTML(e),this.applySettingsToUI(),this.setupEventListeners(),t}buildSettingsHtml(){const t=i=>typeof i=="number"?i.toLocaleString():"-",e=i=>{if(!i)return "-";try{return new Date(i).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return i}},n=this.currentVideoInfo;return `
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
                <img id="currentThumbnail" src="${n?.thumbnail??""}" alt="サムネイル">
                <div class="thumbnail-overlay"></div>
              </div>
              <button id="playCurrentVideo" class="play-button" title="この動画を再生">
                <span class="play-icon">▶</span>
              </button>
            </div>
            <div class="info-container">
              <p>動画ID: <span id="currentVideoId">${n?.videoId??"未設定"}</span></p>
              <p>タイトル: <span id="currentTitle">${n?.title??"未設定"}</span></p>
              <p>投稿者: <span id="currentOwner">${n?.owner?.nickname??n?.channel?.name??"-"}</span></p>
              <p>再生数: <span id="currentViewCount">${t(n?.viewCount)}</span></p>
              <p>コメント数: <span id="currentCommentCount">${t(n?.commentCount)}</span></p>
              <p>マイリスト数: <span id="currentMylistCount">${t(n?.mylistCount)}</span></p>
              <p>投稿日: <span id="currentPostedAt">${e(n?.postedAt)}</span></p>
            </div>
          </div>
        </div>
        <div class="setting-group display-settings-group">
          <h3>表示設定</h3>
          <div class="color-setting">
            <label>コメント色:</label>
            <div class="color-presets">
              ${["#FFFFFF","#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF"].map(i=>`<button class="color-preset-btn" data-color="${i}" style="background-color: ${i}"></button>`).join("")}
            </div>
          <div class="color-picker-container">
              <button id="openColorPicker" class="color-picker-button" type="button">
                <span class="color-picker-button__icon" aria-hidden="true">${De}</span>
                <span class="color-picker-button__text">カラーピッカー</span>
              </button>
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
                ${["0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.75","0.8","0.9","1.0"].map(i=>`<option value="${i}">${i}</option>`).join("")}
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
            <button id="showNgWords" class="mask-button" type="button">
              <span class="mask-button__icon" aria-hidden="true">${mt}</span>
              <span class="mask-button__text">NGワードを表示</span>
            </button>
            <textarea class="ng-words hidden" id="ngWords" placeholder="NGワードを1行ずつ入力">${this.settings.ngWords.join(`
`)}</textarea>
          </div>
        </div>
        <div class="setting-group">
          <h3>NG正規表現設定</h3>
          <div class="ng-regexp-container">
            <button id="showNgRegexp" class="mask-button" type="button">
              <span class="mask-button__icon" aria-hidden="true">${mt}</span>
              <span class="mask-button__text">NG正規表現を表示</span>
            </button>
            <textarea class="ng-words hidden" id="ngRegexps" placeholder="NG正規表現を1行ずつ入力">${this.settings.ngRegexps.join(`
`)}</textarea>
          </div>
        </div>
        <button id="saveSettings">設定を保存</button>
      </div>
    `}setupEventListeners(){this.setupColorPresets(),this.setupColorPicker(),this.setupOpacitySelect(),this.setupVisibilityToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupPlayButton();}setupColorPresets(){this.querySelectorAll(".color-preset-btn").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.color;if(!n)return;this.settings.commentColor=n;const i=this.querySelector(u.colorPreview),o=this.querySelector(u.colorValue);i&&(i.style.backgroundColor=n),o&&(o.textContent=n);});});}setupColorPicker(){const t=this.querySelector(u.openColorPicker),e=this.querySelector(u.colorPicker),n=this.querySelector(u.colorPickerInput);!t||!e||!n||(t.addEventListener("click",()=>{e.classList.toggle("hidden");}),n.addEventListener("input",()=>{this.settings.commentColor=n.value;const i=this.querySelector(u.colorPreview),o=this.querySelector(u.colorValue);i&&(i.style.backgroundColor=n.value),o&&(o.textContent=n.value);}));}setupOpacitySelect(){const t=this.querySelector(u.opacitySelect);t&&(t.value=this.settings.commentOpacity.toString(),t.addEventListener("change",()=>{const e=Number(t.value);Number.isNaN(e)||(this.settings.commentOpacity=e);}));}setupVisibilityToggle(){const t=this.querySelector(u.visibilityToggle);t&&(t.addEventListener("click",()=>{this.settings.isCommentVisible=!this.settings.isCommentVisible,this.updateVisibilityToggleState(t);}),this.updateVisibilityToggleState(t));}setupNgControls(){const t=this.querySelector(u.ngWords),e=this.querySelector(u.ngRegexps),n=this.querySelector(u.showNgWords),i=this.querySelector(u.showNgRegexps);n?.addEventListener("click",()=>{if(!t||!n)return;t.classList.toggle("hidden");const o=t.classList.contains("hidden")?"NGワードを表示":"NGワードを非表示";this.updateMaskButtonText(n,o);}),i?.addEventListener("click",()=>{if(!e||!i)return;e.classList.toggle("hidden");const o=e.classList.contains("hidden")?"NG正規表現を表示":"NG正規表現を非表示";this.updateMaskButtonText(i,o);});}setupSaveButton(){const t=this.querySelector(u.saveButton);t&&t.addEventListener("click",()=>this.saveSettings());}setupSearch(){const t=this.querySelector(u.searchInput),e=this.querySelector(u.searchButton),n=this.querySelector(u.openSearchPage),i=async()=>{const o=t?.value.trim();if(!o){p.show("キーワードを入力してください","warning");return}await this.executeSearch(o);};e?.addEventListener("click",i),t?.addEventListener("keydown",o=>{o.key==="Enter"&&i();}),n?.addEventListener("click",o=>{o.preventDefault();const s=t?.value.trim(),a=s?Ct(s):Ee.searchBase;q().open(a,"_blank","noopener");});}async executeSearch(t){try{p.show(`「${t}」を検索中...`,"info");const e=await this.searcher.search(t);return this.renderSearchResults(e,n=>this.renderSearchResultItem(n)),e.length===0&&p.show("検索結果が見つかりませんでした","warning"),e}catch(e){return E.error("SettingsUI.executeSearch",e),[]}}scrollToSettings(){this.hostElement&&this.hostElement.scrollIntoView({behavior:"smooth",block:"start"});}setSearchKeyword(t){const e=this.querySelector(u.searchInput);e&&(e.value=t,e.focus({preventScroll:true}));}renderSearchResults(t,e){const n=this.querySelector(u.searchResults);if(!n)return;n.innerHTML=t.map(o=>e(o)).join(""),n.querySelectorAll(".search-result-item").forEach((o,s)=>{o.addEventListener("click",()=>{const a=t[s];this.applySearchResult(a);});});}renderSearchResultItem(t){const e=this.formatSearchResultDate(t.postedAt);return `
      <div class="search-result-item">
        <img src="${t.thumbnail}" alt="thumbnail">
        <div class="search-result-info">
          <div class="title">${t.title}</div>
          <div class="stats">再生 ${t.viewCount.toLocaleString()} / コメント ${t.commentCount.toLocaleString()} / マイリスト ${t.mylistCount.toLocaleString()}</div>
          <div class="date">${e}</div>
        </div>
      </div>
    `}async applySearchResult(t){try{const e=await this.fetcher.fetchApiData(t.videoId);await this.fetcher.fetchComments(),p.show(`「${t.title}」のコメントを設定しました`,"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(t,e));}catch(e){E.error("SettingsUI.applySearchResult",e);}}buildVideoMetadata(t,e){return {videoId:t.videoId,title:t.title,viewCount:e.video?.count?.view??t.viewCount,commentCount:e.video?.count?.comment??t.commentCount,mylistCount:e.video?.count?.mylist??t.mylistCount,postedAt:e.video?.registeredAt??t.postedAt,thumbnail:e.video?.thumbnail?.url??t.thumbnail,owner:e.owner??t.owner??void 0,channel:e.channel??t.channel??void 0}}applySettingsToUI(){const t=this.querySelector(u.opacitySelect),e=this.querySelector(u.visibilityToggle),n=this.querySelector(u.colorPreview),i=this.querySelector(u.colorValue),o=this.querySelector(u.ngWords),s=this.querySelector(u.ngRegexps);t&&(t.value=this.settings.commentOpacity.toString()),e&&this.updateVisibilityToggleState(e),n&&(n.style.backgroundColor=this.settings.commentColor),i&&(i.textContent=this.settings.commentColor),o&&(o.value=this.settings.ngWords.join(`
`)),s&&(s.value=this.settings.ngRegexps.join(`
`)),this.updatePlayButtonState(this.currentVideoInfo);}saveSettings(){const t=this.querySelector(u.opacitySelect),e=this.querySelector(u.ngWords),n=this.querySelector(u.ngRegexps);if(t){const i=Number(t.value);Number.isNaN(i)||(this.settings.commentOpacity=i);}e&&(this.settings.ngWords=e.value.split(`
`).map(i=>i.trim()).filter(Boolean)),n&&(this.settings.ngRegexps=n.value.split(`
`).map(i=>i.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings)?p.show("設定を保存しました","success"):p.show("設定の保存に失敗しました","error");}updateCurrentVideoInfo(t){this.currentVideoInfo=t,[["currentTitle",t.title??"-"],["currentVideoId",t.videoId??"-"],["currentOwner",t.owner?.nickname??t.channel?.name??"-"],["currentViewCount",this.formatNumber(t.viewCount)],["currentCommentCount",this.formatNumber(t.commentCount)],["currentMylistCount",this.formatNumber(t.mylistCount)],["currentPostedAt",this.formatSearchResultDate(t.postedAt)]].forEach(([i,o])=>{const s=this.querySelector(u[i]);s&&(s.textContent=o);});const n=this.querySelector(u.currentThumbnail);n&&t.thumbnail&&(n.src=t.thumbnail,n.alt=t.title??"サムネイル");try{this.settingsManager.saveVideoData(t.title??"",t);}catch(i){E.error("SettingsUI.updateCurrentVideoInfo",i);}this.updatePlayButtonState(t);}formatNumber(t){return typeof t=="number"?t.toLocaleString():"-"}formatSearchResultDate(t){if(!t)return "-";const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(e)}setupPlayButton(){const t=this.querySelector(u.playCurrentVideo);t&&(t.addEventListener("click",()=>{try{if(!this.currentVideoInfo?.videoId){p.show("再生できる動画が設定されていません","warning");return}const n=this.lastAutoButtonElement?.closest(".itemModule.list");if(this.lastAutoButtonElement){const i=n?.querySelector(".thumbnailContainer > a, .thumbnail-container > a");if(i){p.show(`「${this.currentVideoInfo?.title||"動画"}」を再生します...`,"success"),setTimeout(()=>{i.click();},300);return}}p.show("再生リンクが見つかりませんでした（対象アイテム内に限定して検索済み）","warning");}catch(e){E.error("SettingsUI.playCurrentVideo",e),p.show(`再生エラー: ${e.message}`,"error");}}),this.updatePlayButtonState(this.currentVideoInfo));}updatePlayButtonState(t){const e=this.querySelector(u.playCurrentVideo);if(!e)return;const n=!!t?.videoId;e.disabled=!n,e.setAttribute("aria-disabled",(!n).toString());}updateVisibilityToggleState(t){t.textContent=this.settings.isCommentVisible?"表示中":"非表示中",t.classList.toggle("off",!this.settings.isCommentVisible);}updateMaskButtonText(t,e){const n=t.querySelector(".mask-button__text");n&&(n.textContent=e);}}const gt=async()=>{},Oe=()=>{const r=q();if(!r.dAniRenderer){const t={};r.dAniRenderer={classes:{Comment:Mt,CommentRenderer:vt,NicoApiFetcher:Y,NotificationManager:p,StyleManager:It,SettingsUI:At,NicoVideoSearcher:kt,VideoSwitchHandler:Et,SettingsManager:H,KeyboardShortcutHandler:ft,DebounceExecutor:X,ShadowDOMComponent:K,ShadowStyleManager:L},instances:t,utils:{initialize:gt,initializeWithVideo:gt},debug:{showState:()=>{console.log("Current instances:",t);},showSettings:()=>{const e=t.settingsManager;if(!e){console.log("SettingsManager not initialized");return}console.log("Current settings:",e.getSettings());},showComments:()=>{const e=t.renderer;if(!e){console.log("CommentRenderer not initialized");return}console.log("Current comments:",e.getCommentsSnapshot());}},defaultSettings:x};}return r.dAniRenderer},Pe=100,$e=1e3,We=3e3;class Be{constructor(t){this.global=t;}initialized=false;switchDebounce=new X($e);switchCallback=null;lastSwitchTimestamp=0;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(t=>{window.addEventListener("load",()=>t(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const t=document.querySelector(b.watchVideoElement);if(!t){window.setTimeout(()=>this.waitForVideoElement(),Pe);return}if(t.readyState===0){t.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(t);},{once:true});return}this.initializeWithVideo(t);}async initializeWithVideo(t){if(!this.initialized){this.initialized=true;try{p.show("コメントローダーを初期化中...");const e=p.getInstance(),n=this.global.settingsManager??new H(e);this.global.settingsManager=n,this.global.instances.settingsManager=n;const i=n.loadVideoData();if(!i?.videoId)throw new Error("動画データが見つかりません。マイページで設定してください。");const o=new Y;this.global.instances.fetcher=o,await o.fetchApiData(i.videoId);const s=await o.fetchComments(),a=this.mergeSettings(n.loadSettings()),c=new vt(a);c.initialize(t),this.global.instances.renderer=c,n.addObserver(d=>{c.settings=this.mergeSettings(d);}),s.forEach(d=>{c.addComment(d.text,d.vpos,d.commands);});const l=new Et(c,o,n);l.startMonitoring(),this.global.instances.switchHandler=l,this.setupSwitchHandling(t,l),p.show(`コメントの読み込みが完了しました（${s.length}件）`,"success");}catch(e){throw this.initialized=false,p.show(`初期化エラー: ${e.message}`,"error"),e}}}mergeSettings(t){const e=x();return {...e,...t,ngWords:[...t.ngWords??e.ngWords],ngRegexps:[...t.ngRegexps??e.ngRegexps]}}setupSwitchHandling(t,e){this.switchCallback=()=>{const i=Date.now();i-this.lastSwitchTimestamp<We||(this.lastSwitchTimestamp=i,e.onVideoSwitch(t));},new MutationObserver(i=>{if(this.switchCallback)for(const o of i)o.type==="attributes"&&o.attributeName==="src"&&(this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));}).observe(t,{attributes:true,attributeFilter:["src"]}),t.addEventListener("ended",()=>{this.switchCallback&&(this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));}),this.global.utils.initializeWithVideo=async i=>{await e.onVideoSwitch(i);};}}const qe=100;class He{constructor(t){this.global=t;}initialize(){const t=p.getInstance(),e=this.global.settingsManager??new H(t);this.global.settingsManager=e,this.global.instances.settingsManager=e;const n=new At(e);this.waitForHeader(n);}waitForHeader(t){if(!document.querySelector(b.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(t),qe);return}t.insertIntoMypage(),t.addAutoCommentButtons(),this.observeList(t);}observeList(t){const e=document.querySelector(b.mypageListContainer);if(!e)return;new MutationObserver(()=>{try{t.addAutoCommentButtons();}catch(i){console.error("[MypageController] auto comment buttons update failed",i);}}).observe(e,{childList:true,subtree:true});}}class Ue{log;global=Oe();watchController=null;mypageController=null;constructor(){this.log=S("DanimeApp");}start(){this.log.info("starting renderer"),It.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const t=location.pathname.toLowerCase();try{t.includes("/animestore/sc_d_pc")?(this.watchController=new Be(this.global),await this.watchController.initialize()):t.includes("/animestore/mp_viw_pc")?(this.mypageController=new He(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(e){this.log.error("initialization failed",e);}}acquireInstanceLock(){const t=q();return t.__dAnimeNicoCommentRenderer2Instance=(t.__dAnimeNicoCommentRenderer2Instance??0)+1,t.__dAnimeNicoCommentRenderer2Instance===1}}const W=S("dAnimeNicoCommentRenderer2");async function Ge(){W.info("bootstrap start");try{new Ue().start(),W.info("bootstrap completed");}catch(r){W.error("bootstrap failed",r);}}Ge();

})();