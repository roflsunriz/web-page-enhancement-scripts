// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      6.11.5
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

  const oe={debug:"debug",info:"info",warn:"warn",error:"error"},S=r=>{const e=`[${r}]`,t={};return Object.keys(oe).forEach(n=>{const i=oe[n];t[n]=(...s)=>{(console[i]??console.log)(e,...s);};}),t};function J(){return typeof unsafeWindow<"u"?unsafeWindow:window}const $={commentColor:"#FFFFFF",commentOpacity:1,isCommentVisible:true,useContainerResizeObserver:true,ngWords:[],ngRegexps:[],scrollDirection:"rtl",renderStyle:"outline-only",syncMode:"raf",scrollVisibleDurationMs:4e3,useFixedLaneCount:false,fixedLaneCount:12,useDprScaling:true,enableForceRefresh:true},v=()=>({...$,ngWords:[...$.ngWords],ngRegexps:[...$.ngRegexps]}),Ne="v7.0.0";var He=typeof GM_addStyle<"u"?GM_addStyle:void 0,R=typeof GM_getValue<"u"?GM_getValue:void 0,T=typeof GM_setValue<"u"?GM_setValue:void 0,De=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const ae="settings",le="currentVideo",ce="lastDanimeIds",de="playbackSettings",$e=r=>({...r,ngWords:[...r.ngWords],ngRegexps:[...r.ngRegexps]}),V={fixedModeEnabled:false,fixedRate:1.11},F=r=>({fixedModeEnabled:r.fixedModeEnabled,fixedRate:r.fixedRate});class Z{constructor(e){this.notifier=e,this.settings=v(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData(),this.playbackSettings=F(V),this.loadPlaybackSettings();}settings;currentVideo;observers=new Set;playbackSettings;playbackObservers=new Set;getSettings(){return $e(this.settings)}loadSettings(){try{const e=R(ae,null);if(!e)return this.settings=v(),this.settings;if(typeof e=="string"){const t=JSON.parse(e);this.settings={...v(),...t,ngWords:Array.isArray(t?.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t?.ngRegexps)?[...t.ngRegexps]:[]};}else this.settings={...v(),...e,ngWords:Array.isArray(e.ngWords)?[...e.ngWords]:[],ngRegexps:Array.isArray(e.ngRegexps)?[...e.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(e){return console.error("[SettingsManager] 設定の読み込みに失敗しました",e),this.notify("設定の読み込みに失敗しました","error"),this.settings=v(),this.settings}}getPlaybackSettings(){return F(this.playbackSettings)}loadPlaybackSettings(){try{const e=R(de,null);if(!e)return this.playbackSettings=F(V),this.notifyPlaybackObservers(),this.playbackSettings;if(typeof e=="string"){const t=JSON.parse(e);this.playbackSettings={fixedModeEnabled:typeof t.fixedModeEnabled=="boolean"?t.fixedModeEnabled:V.fixedModeEnabled,fixedRate:typeof t.fixedRate=="number"?t.fixedRate:V.fixedRate};}else this.playbackSettings={fixedModeEnabled:e.fixedModeEnabled,fixedRate:e.fixedRate};return this.notifyPlaybackObservers(),this.playbackSettings}catch(e){return console.error("[SettingsManager] 再生設定の読み込みに失敗しました",e),this.notify("再生設定の読み込みに失敗しました","error"),this.playbackSettings=F(V),this.notifyPlaybackObservers(),this.playbackSettings}}updatePlaybackSettings(e){return this.playbackSettings={...this.playbackSettings,...e},this.savePlaybackSettings()}savePlaybackSettings(){try{return T(de,JSON.stringify(this.playbackSettings)),this.notifyPlaybackObservers(),!0}catch(e){return console.error("[SettingsManager] 再生設定の保存に失敗しました",e),this.notify("再生設定の保存に失敗しました","error"),false}}saveSettings(){try{return T(ae,JSON.stringify(this.settings)),this.notifyObservers(),this.notify("設定を保存しました","success"),!0}catch(e){return console.error("[SettingsManager] 設定の保存に失敗しました",e),this.notify("設定の保存に失敗しました","error"),false}}updateSettings(e){return this.settings={...this.settings,...e,ngWords:e.ngWords?[...e.ngWords]:[...this.settings.ngWords],ngRegexps:e.ngRegexps?[...e.ngRegexps]:[...this.settings.ngRegexps]},this.saveSettings()}addObserver(e){this.observers.add(e);}removeObserver(e){this.observers.delete(e);}addPlaybackObserver(e){this.playbackObservers.add(e);try{e(this.getPlaybackSettings());}catch(t){console.error("[SettingsManager] 再生設定の登録通知でエラー",t);}}removePlaybackObserver(e){this.playbackObservers.delete(e);}notifyObservers(){const e=this.getSettings();for(const t of this.observers)try{t(e);}catch(n){console.error("[SettingsManager] 設定変更通知でエラー",n);}}notifyPlaybackObservers(){const e=this.getPlaybackSettings();for(const t of this.playbackObservers)try{t(e);}catch(n){console.error("[SettingsManager] 再生設定通知でエラー",n);}}loadVideoData(){try{return R(le,null)??null}catch(e){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",e),this.notify("動画データの読み込みに失敗しました","error"),null}}saveVideoData(e,t){try{const n={videoId:t.videoId,title:t.title,viewCount:t.viewCount,commentCount:t.commentCount,mylistCount:t.mylistCount,postedAt:t.postedAt,thumbnail:t.thumbnail,owner:t.owner??null,channel:t.channel??null};return T(le,n),this.currentVideo=n,!0}catch(n){return console.error("[SettingsManager] 動画データの保存に失敗しました",n),this.notify("動画データの保存に失敗しました","error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(e){try{return T(ce,e),!0}catch(t){return console.error("[SettingsManager] saveLastDanimeIds failed",t),this.notify("ID情報の保存に失敗しました","error"),false}}loadLastDanimeIds(){try{return R(ce,null)??null}catch(e){return console.error("[SettingsManager] loadLastDanimeIds failed",e),this.notify("ID情報の読込に失敗しました","error"),null}}notify(e,t="info"){this.notifier?.show(e,t);}}class z{text;vposMs;commands;constructor(e){this.text=e.text,this.vposMs=e.vposMs,this.commands=[...e.commands??[]];}}var qe=(function(){if(typeof document>"u")return "transform";for(var r=["oTransform","msTransform","mozTransform","webkitTransform","transform"],e=document.createElement("div").style,t=0;t<r.length;t++)if(r[t]in e)return r[t];return "transform"})();function Be(r){var e=document.createElement("div");if(e.style.cssText="position:absolute;",typeof r.render=="function"){var t=r.render();if(t instanceof HTMLElement)return e.appendChild(t),e}if(e.textContent=r.text,r.style)for(var n in r.style)e.style[n]=r.style[n];return e}function We(){var r=document.createElement("div");return r.style.cssText="overflow:hidden;white-space:nowrap;transform:translateZ(0);",r}function Ue(r){for(var e=r.lastChild;e;)r.removeChild(e),e=r.lastChild;}function Ge(r,e,t){r.style.width=e+"px",r.style.height=t+"px";}function Ke(){}function Ye(r,e){var t=document.createDocumentFragment(),n=0,i=null;for(n=0;n<e.length;n++)i=e[n],i.node=i.node||Be(i),t.appendChild(i.node);for(e.length&&r.appendChild(t),n=0;n<e.length;n++)i=e[n],i.width=i.width||i.node.offsetWidth,i.height=i.height||i.node.offsetHeight;}function je(r,e){e.node.style[qe]="translate("+e.x+"px,"+e.y+"px)";}function Je(r,e){r.removeChild(e.node),this.media||(e.node=null);}var Ze={name:"dom",init:We,clear:Ue,resize:Ge,framing:Ke,setup:Ye,render:je,remove:Je},w=typeof window<"u"&&window.devicePixelRatio||1,q=Object.create(null);function Xe(r,e){if(q[r])return q[r];var t=12,n=/(\d+(?:\.\d+)?)(px|%|em|rem)(?:\s*\/\s*(\d+(?:\.\d+)?)(px|%|em|rem)?)?/,i=r.match(n);if(i){var s=i[1]*1||10,a=i[2],o=i[3]*1||1.2,l=i[4];a==="%"&&(s*=e.container/100),a==="em"&&(s*=e.container),a==="rem"&&(s*=e.root),l==="px"&&(t=o),l==="%"&&(t=s*o/100),l==="em"&&(t=s*o),l==="rem"&&(t=e.root*o),l===void 0&&(t=s*o);}return q[r]=t,t}function Qe(r,e){if(typeof r.render=="function"){var t=r.render();if(t instanceof HTMLCanvasElement)return r.width=t.width,r.height=t.height,t}var n=document.createElement("canvas"),i=n.getContext("2d"),s=r.style||{};s.font=s.font||"10px sans-serif",s.textBaseline=s.textBaseline||"bottom";var a=s.lineWidth*1;a=a>0&&a!==1/0?Math.ceil(a):!!s.strokeStyle*1,i.font=s.font,r.width=r.width||Math.max(1,Math.ceil(i.measureText(r.text).width)+a*2),r.height=r.height||Math.ceil(Xe(s.font,e))+a*2,n.width=r.width*w,n.height=r.height*w,i.scale(w,w);for(var o in s)i[o]=s[o];var l=0;switch(s.textBaseline){case "top":case "hanging":l=a;break;case "middle":l=r.height>>1;break;default:l=r.height-a;}return s.strokeStyle&&i.strokeText(r.text,a,l),i.fillText(r.text,a,l),n}function he(r){return window.getComputedStyle(r,null).getPropertyValue("font-size").match(/(.+)px/)[1]*1}function et(r){var e=document.createElement("canvas");return e.context=e.getContext("2d"),e._fontSize={root:he(document.getElementsByTagName("html")[0]),container:he(r)},e}function tt(r,e){r.context.clearRect(0,0,r.width,r.height);for(var t=0;t<e.length;t++)e[t].canvas=null;}function nt(r,e,t){r.width=e*w,r.height=t*w,r.style.width=e+"px",r.style.height=t+"px";}function rt(r){r.context.clearRect(0,0,r.width,r.height);}function it(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.canvas=Qe(n,r._fontSize);}}function st(r,e){r.context.drawImage(e.canvas,e.x*w,e.y*w);}function ot(r,e){e.canvas=null;}var at={name:"canvas",init:et,clear:tt,resize:nt,framing:rt,setup:it,render:st,remove:ot},ue=(function(){if(typeof window<"u"){var r=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame;if(r)return r.bind(window)}return function(e){return setTimeout(e,50/3)}})(),lt=(function(){if(typeof window<"u"){var r=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame;if(r)return r.bind(window)}return clearTimeout})();function Ce(r,e,t){for(var n=0,i=0,s=r.length;i<s-1;)n=i+s>>1,t>=r[n][e]?i=n:s=n;return r[i]&&t<r[i][e]?i:s}function Ee(r){return /^(ltr|top|bottom)$/i.test(r)?r.toLowerCase():"rtl"}function O(){var r=9007199254740991;return [{range:0,time:-r,width:r,height:0},{range:r,time:r,width:0,height:0}]}function ke(r){r.ltr=O(),r.rtl=O(),r.top=O(),r.bottom=O();}function H(){return typeof window.performance<"u"&&window.performance.now?window.performance.now():Date.now()}function ct(r){var e=this,t=this.media?this.media.currentTime:H()/1e3,n=this.media?this.media.playbackRate:1;function i(x,f){if(f.mode==="top"||f.mode==="bottom")return t-x.time<e._.duration;var M=e._.width+x.width,E=M*(t-x.time)*n/e._.duration;if(x.width>E)return  true;var k=e._.duration+x.time-t,ie=e._.width+f.width,I=e.media?f.time:f._utc,se=ie*(t-I)*n/e._.duration,Pe=e._.width-se,ze=e._.duration*Pe/(e._.width+f.width);return k>ze}for(var s=this._.space[r.mode],a=0,o=0,l=1;l<s.length;l++){var c=s[l],d=r.height;if((r.mode==="top"||r.mode==="bottom")&&(d+=c.height),c.range-c.height-s[a].range>=d){o=l;break}i(c,r)&&(a=l);}var h=s[a].range,m={range:h+r.height,time:this.media?r.time:r._utc,width:r.width,height:r.height};return s.splice(a+1,o-a-1,m),r.mode==="bottom"?this._.height-r.height-h%this._.height:h%(this._.height-r.height)}function dt(r,e,t,n){return function(i){r(this._.stage);var s=i||H(),a=s/1e3,o=this.media?this.media.currentTime:a,l=this.media?this.media.playbackRate:1,c=null,d=0,h=0;for(h=this._.runningList.length-1;h>=0;h--)c=this._.runningList[h],d=this.media?c.time:c._utc,o-d>this._.duration&&(n(this._.stage,c),this._.runningList.splice(h,1));for(var m=[];this._.position<this.comments.length&&(c=this.comments[this._.position],d=this.media?c.time:c._utc,!(d>=o));){if(o-d>this._.duration){++this._.position;continue}this.media&&(c._utc=a-(this.media.currentTime-c.time)),m.push(c),++this._.position;}for(e(this._.stage,m),h=0;h<m.length;h++)c=m[h],c.y=ct.call(this,c),this._.runningList.push(c);for(h=0;h<this._.runningList.length;h++){c=this._.runningList[h];var x=this._.width+c.width,f=x*(a-c._utc)*l/this._.duration;c.mode==="ltr"&&(c.x=f-c.width),c.mode==="rtl"&&(c.x=this._.width-f),(c.mode==="top"||c.mode==="bottom")&&(c.x=this._.width-c.width>>1),t(this._.stage,c);}}}function X(){if(!this._.visible||!this._.paused)return this;if(this._.paused=false,this.media)for(var r=0;r<this._.runningList.length;r++){var e=this._.runningList[r];e._utc=H()/1e3-(this.media.currentTime-e.time);}var t=this,n=dt(this._.engine.framing.bind(this),this._.engine.setup.bind(this),this._.engine.render.bind(this),this._.engine.remove.bind(this));function i(s){n.call(t,s),t._.requestID=ue(i);}return this._.requestID=ue(i),this}function Q(){return !this._.visible||this._.paused?this:(this._.paused=true,lt(this._.requestID),this._.requestID=0,this)}function ee(){if(!this.media)return this;this.clear(),ke(this._.space);var r=Ce(this.comments,"time",this.media.currentTime);return this._.position=Math.max(0,r-1),this}function ht(r){r.play=X.bind(this),r.pause=Q.bind(this),r.seeking=ee.bind(this),this.media.addEventListener("play",r.play),this.media.addEventListener("pause",r.pause),this.media.addEventListener("playing",r.play),this.media.addEventListener("waiting",r.pause),this.media.addEventListener("seeking",r.seeking);}function ut(r){this.media.removeEventListener("play",r.play),this.media.removeEventListener("pause",r.pause),this.media.removeEventListener("playing",r.play),this.media.removeEventListener("waiting",r.pause),this.media.removeEventListener("seeking",r.seeking),r.play=null,r.pause=null,r.seeking=null;}function pt(r){this._={},this.container=r.container||document.createElement("div"),this.media=r.media,this._.visible=true,this.engine=(r.engine||"DOM").toLowerCase(),this._.engine=this.engine==="canvas"?at:Ze,this._.requestID=0,this._.speed=Math.max(0,r.speed)||144,this._.duration=4,this.comments=r.comments||[],this.comments.sort(function(t,n){return t.time-n.time});for(var e=0;e<this.comments.length;e++)this.comments[e].mode=Ee(this.comments[e].mode);return this._.runningList=[],this._.position=0,this._.paused=true,this.media&&(this._.listener={},ht.call(this,this._.listener)),this._.stage=this._.engine.init(this.container),this._.stage.style.cssText+="position:relative;pointer-events:none;",this.resize(),this.container.appendChild(this._.stage),this._.space={},ke(this._.space),(!this.media||!this.media.paused)&&(ee.call(this),X.call(this)),this}function mt(){if(!this.container)return this;Q.call(this),this.clear(),this.container.removeChild(this._.stage),this.media&&ut.call(this,this._.listener);for(var r in this)Object.prototype.hasOwnProperty.call(this,r)&&(this[r]=null);return this}var P=["mode","time","text","render","style"];function gt(r){if(!r||Object.prototype.toString.call(r)!=="[object Object]")return this;for(var e={},t=0;t<P.length;t++)r[P[t]]!==void 0&&(e[P[t]]=r[P[t]]);if(e.text=(e.text||"").toString(),e.mode=Ee(e.mode),e._utc=H()/1e3,this.media){var n=0;e.time===void 0?(e.time=this.media.currentTime,n=this._.position):(n=Ce(this.comments,"time",e.time),n<this._.position&&(this._.position+=1)),this.comments.splice(n,0,e);}else this.comments.push(e);return this}function ft(){return this._.visible?this:(this._.visible=true,this.media&&this.media.paused?this:(ee.call(this),X.call(this),this))}function bt(){return this._.visible?(Q.call(this),this.clear(),this._.visible=false,this):this}function yt(){return this._.engine.clear(this._.stage,this._.runningList),this._.runningList=[],this}function xt(){return this._.width=this.container.offsetWidth,this._.height=this.container.offsetHeight,this._.engine.resize(this._.stage,this._.width,this._.height),this._.duration=this._.width/this._.speed,this}var vt={get:function(){return this._.speed},set:function(r){return typeof r!="number"||isNaN(r)||!isFinite(r)||r<=0?this._.speed:(this._.speed=r,this._.width&&(this._.duration=this._.width/r),r)}};function C(r){r&&pt.call(this,r);}C.prototype.destroy=function(){return mt.call(this)};C.prototype.emit=function(r){return gt.call(this,r)};C.prototype.show=function(){return ft.call(this)};C.prototype.hide=function(){return bt.call(this)};C.prototype.clear=function(){return yt.call(this)};C.prototype.resize=function(){return xt.call(this)};Object.defineProperty(C.prototype,"speed",vt);const wt=new Set(["INPUT","TEXTAREA"]),B=r=>r.length===1?r.toUpperCase():r,St=r=>r?`${r}+`:"";class _e{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(e,t,n){const i=this.createShortcutKey(B(e),t);this.shortcuts.set(i,n);}removeShortcut(e,t){const n=this.createShortcutKey(B(e),t);this.shortcuts.delete(n);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(e){this.isEnabled=e;}createShortcutKey(e,t){return `${St(t)}${e}`}extractModifier(e){const t=[];return e.ctrlKey&&t.push("Ctrl"),e.altKey&&t.push("Alt"),e.shiftKey&&t.push("Shift"),e.metaKey&&t.push("Meta"),t.length>0?t.join("+"):null}handleKeyDown(e){if(!this.isEnabled)return;const n=e.target?.tagName??"";if(wt.has(n))return;const i=this.extractModifier(e),s=this.createShortcutKey(B(e.key),i),a=this.shortcuts.get(s);a&&(e.preventDefault(),a());}}const Ct={white:"#FFFFFF",red:"#FF0000",pink:"#FF8080",orange:"#FF9900",yellow:"#FFFF00",green:"#00FF00",cyan:"#00FFFF",blue:"#0000FF",purple:"#C000FF",black:"#000000",white2:"#CC9",red2:"#C03",pink2:"#F3C",orange2:"#F60",yellow2:"#990",green2:"#0C6",cyan2:"#0CC",blue2:"#39F",purple2:"#63C",black2:"#666"},Y={defont:'"MS PGothic","Hiragino Kaku Gothic ProN","Yu Gothic UI","Yu Gothic","Meiryo","Segoe UI","Osaka","Noto Sans JP","Source Han Sans JP","sans-serif"',gothic:'"Noto Sans JP","Noto Sans CJK JP","Yu Gothic","Yu Gothic Medium","Meiryo","MS PGothic","Segoe UI","Helvetica","Arial","sans-serif"',mincho:'"MS PMincho","MS Mincho","Hiragino Mincho ProN","Yu Mincho","Noto Serif JP","Source Han Serif JP","Times New Roman","serif"'},pe={small:.8,medium:1,big:1.4},Et=/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,kt=Y.defont,_t="0 0 3px rgba(0, 0, 0, 0.85), 0 0 6px rgba(0, 0, 0, 0.65)",Mt=16,W=1.2,Vt=r=>r.map(e=>e.trim()).filter(e=>e.length>0).map(e=>({raw:e,lower:e.toLowerCase()})),At=r=>{if(!r||typeof r!="object")return  false;const e=r;return typeof e.commentColor=="string"&&typeof e.commentOpacity=="number"&&typeof e.isCommentVisible=="boolean"&&Array.isArray(e.ngWords)&&Array.isArray(e.ngRegexps)},Lt=r=>!!r&&typeof r=="object"&&"video"in r&&r.video instanceof HTMLVideoElement,N=(r,e,t)=>Math.min(t,Math.max(e,r)),It=r=>N(r,0,1).toFixed(2);class Me{danmaku=null;hostElement=null;containerElement=null;videoElement=null;keyboardHandler=null;resizeObserver=null;settingsValue;ngRegexps=[];comments=[];commentCounter=0;currentVideoSource=null;logger;handleWindowResize=()=>{this.syncHostLayout();};constructor(e,t){let n={};At(e)||e===null?(this.settingsValue=e?this.cloneSettings(e):v(),n=t??{}):(this.settingsValue=v(),n=e??{}),this.logger=S(n.loggerNamespace??"dAnime:CommentRenderer"),this.cacheNgRegexps();}get settings(){return this.cloneSettings(this.settingsValue)}set settings(e){this.updateSettings(e);}initialize(e){const t=this.resolveVideoElement(e);this.destroyDanmaku(),this.createRenderer(t),this.setupKeyboardShortcuts();}addComment(e,t,n=[]){if(!e)return null;const i=[...n],s=new z({text:e,vposMs:t,commands:i}),a={id:++this.commentCounter,comment:s};return this.comments.push(a),this.emitDanmaku(s),s}clearComments(){this.comments=[],this.commentCounter=0,this.danmaku?.clear();}resetState(){this.replayAllComments();}hardReset(){if(!this.videoElement)return;const e=this.comments.map(t=>({id:t.id,comment:new z({text:t.comment.text,vposMs:t.comment.vposMs,commands:[...t.comment.commands]})}));this.comments=e,this.destroyDanmaku(),this.createRenderer(this.videoElement);}destroy(){this.teardownKeyboardShortcuts(),this.destroyDanmaku(),this.videoElement=null,this.currentVideoSource=null;}updateSettings(e){this.settingsValue=this.cloneSettings(e),this.cacheNgRegexps(),this.applyVisibility(),this.replayAllComments();}getVideoElement(){return this.videoElement}getCurrentVideoSource(){return this.currentVideoSource}getCommentsSnapshot(){return this.comments.map(e=>new z({text:e.comment.text,vposMs:e.comment.vposMs,commands:[...e.comment.commands]}))}isNGComment(e){const t=e.toLowerCase();return t?this.settingsValue.ngWords.some(n=>t.includes(n.toLowerCase()))?true:this.ngRegexps.some(n=>n.test(e)):false}resize(e,t){this.hostElement&&(typeof e=="number"&&typeof t=="number"?(this.hostElement.style.width=`${e}px`,this.hostElement.style.height=`${t}px`):this.syncHostLayout()),this.danmaku?.resize();}resolveVideoElement(e){if(e instanceof HTMLVideoElement)return e;if(Lt(e))return e.video;throw new Error("A valid HTMLVideoElement is required")}createRenderer(e){this.videoElement=e,this.currentVideoSource=this.getVideoSource(e);const t=this.createOverlayHost(e),n=document.createElement("div");n.className="danime-danmaku-container",n.style.position="absolute",n.style.inset="0",n.style.pointerEvents="none",n.style.overflow="hidden",n.style.willChange="transform",t.appendChild(n),this.hostElement=t,this.containerElement=n,this.danmaku=new C({container:n,media:e,comments:[],engine:"dom"}),this.applyVisibility(),this.setupResizeObserver(e),this.emitExistingComments();}createOverlayHost(e){const t=e.parentElement;if(!t)throw new Error("Video element must have a parent node");window.getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=document.createElement("div");return i.className="danime-danmaku-host",i.style.position="absolute",i.style.pointerEvents="none",i.style.zIndex="2147482000",i.style.display="block",i.style.transformOrigin="top left",t.appendChild(i),this.syncHostLayout(i,e),i}setupResizeObserver(e){this.teardownResizeObserver(),this.settingsValue.useContainerResizeObserver&&typeof ResizeObserver<"u"?(this.resizeObserver=new ResizeObserver(()=>{this.syncHostLayout();}),this.resizeObserver.observe(e)):this.resizeObserver=null,window.addEventListener("resize",this.handleWindowResize),this.syncHostLayout();}teardownResizeObserver(){this.resizeObserver?.disconnect(),this.resizeObserver=null,window.removeEventListener("resize",this.handleWindowResize);}syncHostLayout(e,t){const n=e??this.hostElement,i=t??this.videoElement;if(!n||!i)return;const{offsetTop:s,offsetLeft:a,clientWidth:o,clientHeight:l}=i;n.style.top=`${s}px`,n.style.left=`${a}px`,n.style.width=`${o}px`,n.style.height=`${l}px`;}emitExistingComments(){if(this.danmaku)for(const e of this.comments)this.emitDanmaku(e.comment);}replayAllComments(){this.danmaku&&(this.danmaku.clear(),this.emitExistingComments());}emitDanmaku(e){if(!this.danmaku)return;const t=this.buildDanmakuPayload(e);t&&this.danmaku.emit(t);}buildDanmakuPayload(e){const t=Vt(e.commands);if(this.hasCommand(t,"invisible"))return null;const n=this.resolveMode(t),i=this.resolveColor(t),s=this.getFontSize(t),a=this.getFontFamily(t),o=this.getLetterSpacing(t),l=this.getLineHeight(t),c=this.hasCommand(t,"_live")?.5:1,d={color:i,fontSize:`${s}px`,fontFamily:a,fontWeight:"600",whiteSpace:"pre",textShadow:_t,opacity:It(this.settingsValue.commentOpacity*c)};return o!==0&&(d.letterSpacing=`${o}px`),l!==W&&(d.lineHeight=l.toString()),{text:e.text,time:Math.max(0,e.vposMs/1e3),mode:n,style:d}}resolveMode(e){return this.hasCommand(e,"ue")?"top":this.hasCommand(e,"shita")?"bottom":this.hasCommand(e,"ltr")?"ltr":this.hasCommand(e,"rtl")?"rtl":this.settingsValue.scrollDirection==="ltr"?"ltr":"rtl"}resolveColor(e){for(const t of e){if(Et.test(t.raw))return t.raw.toUpperCase();const n=Ct[t.lower];if(n)return n}return this.settingsValue.commentColor.toUpperCase()}getFontSize(e){const t=this.videoElement,n=(t?.clientHeight??t?.videoHeight??360)/18||24,i=Math.max(Mt,Math.round(n)),s=e.find(o=>Object.prototype.hasOwnProperty.call(pe,o.lower)),a=s?pe[s.lower]:1;return Math.round(i*a)}getFontFamily(e){const t=e.find(n=>Object.prototype.hasOwnProperty.call(Y,n.lower));return t?Y[t.lower]:kt}getLetterSpacing(e){const t=e.find(s=>s.lower.startsWith("ls:")||s.lower.startsWith("letterspacing:"));if(!t)return 0;const[,n]=t.raw.split(":"),i=Number.parseFloat(n);return Number.isFinite(i)?N(i,-100,100):0}getLineHeight(e){const t=e.find(s=>s.lower.startsWith("lh:")||s.lower.startsWith("lineheight:"));if(!t)return W;const[,n]=t.raw.split(":"),i=Number.parseFloat(n);return !Number.isFinite(i)||i<=0?W:t.lower.includes("%")?N(i/100,.25,5):N(i,.25,5)}hasCommand(e,t){return e.some(n=>n.lower===t)}destroyDanmaku(){this.danmaku?.destroy(),this.danmaku=null,this.containerElement?.remove(),this.containerElement=null,this.hostElement?.remove(),this.hostElement=null,this.teardownResizeObserver();}setupKeyboardShortcuts(){this.teardownKeyboardShortcuts();const e=new _e;e.addShortcut("C","Shift",()=>{try{const t=this.settings,n={...t,isCommentVisible:!t.isCommentVisible};this.updateSettings(n),this.syncGlobalSettings(n);}catch(t){this.logger.error("CommentRenderer.keyboardShortcut",t);}}),e.startListening(),this.keyboardHandler=e;}teardownKeyboardShortcuts(){this.keyboardHandler?.stopListening(),this.keyboardHandler=null;}applyVisibility(){this.settingsValue.isCommentVisible?(this.containerElement?.style.removeProperty("visibility"),this.danmaku?.show()):(this.containerElement?.style.setProperty("visibility","hidden"),this.danmaku?.hide());}cacheNgRegexps(){this.ngRegexps=this.settingsValue.ngRegexps.map(e=>{try{return new RegExp(e)}catch(t){return this.logger.warn("Invalid NG regexp skipped",t,{pattern:e}),null}}).filter(e=>e!==null);}syncGlobalSettings(e){window.dAniRenderer?.settingsManager?.updateSettings(e);}cloneSettings(e){return {...e,ngWords:[...e.ngWords],ngRegexps:[...e.ngRegexps]}}getVideoSource(e){return e.currentSrc?e.currentSrc:typeof e.src=="string"&&e.src.length>0?e.src:null}}class te{shadowRoot=null;container=null;createShadowDOM(e,t={mode:"closed"}){if(!e)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=e.attachShadow(t),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(e){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const t=document.createElement("style");t.textContent=e,this.shadowRoot.appendChild(t);}querySelector(e){return this.shadowRoot?this.shadowRoot.querySelector(e):null}querySelectorAll(e){return this.shadowRoot?this.shadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}setHTML(e){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=e;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const Rt=`\r
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
`,Tt=`:host {
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
`,Ft=`:host {
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
`;class L{static getCommonStyles(){return Rt}static getNotificationStyles(){return Tt}static getAutoButtonStyles(){return Ft}}const me={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class p extends te{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new p),this.instance}static show(e,t="info",n=3e3){try{const i=this.getInstance();return i.initialize(),i.initialized?i.createNotification(e,t,n):null}catch(i){return console.error("[NotificationManager] show failed",i),null}}static removeNotification(e){this.getInstance().removeNotification(e.element);}show(e,t="info"){p.show(e,t);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 2147483647","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(L.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(e){console.error("[NotificationManager] initialize failed",e),this.initialized=false;}}destroy(){p.notifications.forEach(e=>{e.timerId&&window.clearTimeout(e.timerId);}),p.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,p.instance=null;}createNotification(e,t,n){try{const i=this.querySelector(".notification-container");if(!i)throw new Error("Notification container not found");const s=me[t]??me.info,a=document.createElement("div");a.className=`notification-item ${t}`;const o=document.createElement("div");o.className="notification-icon",o.innerHTML=`<span>${s}</span>`,a.appendChild(o);const l=document.createElement("div");l.className="notification-content";const c=document.createElement("div");c.className="notification-type",c.textContent=t.charAt(0).toUpperCase()+t.slice(1),l.appendChild(c);const d=document.createElement("div");d.className="notification-message",d.textContent=e||"No message",l.appendChild(d),a.appendChild(l);const h=document.createElement("button");h.className="notification-close",h.innerHTML="&times;",h.addEventListener("click",()=>{this.removeNotification(a);}),a.appendChild(h),i.appendChild(a),requestAnimationFrame(()=>{a.classList.add("show");});const m={element:a,timerId:window.setTimeout(()=>{this.removeNotification(a);},n)};return p.notifications.push(m),m}catch(i){return console.error("[NotificationManager] createNotification failed",i),null}}removeNotification(e){if(!e)return;const t=p.notifications.find(n=>n.element===e);t?.timerId&&window.clearTimeout(t.timerId),e.classList.remove("show"),window.setTimeout(()=>{try{e.remove(),p.notifications=p.notifications.filter(n=>n.element!==e);}catch(n){console.error("[NotificationManager] removeNotification cleanup failed",n);}},500);}}const Ve="https://www.nicovideo.jp",Ae=`${Ve}/search`,Le=`${Ve}/watch`,ge={searchBase:Ae,watchBase:Le},Ot=r=>`${Le}/${r}`,Ie=r=>`${Ae}/${encodeURIComponent(r)}`,j=r=>new Promise((e,t)=>{De({url:r.url,method:r.method??"GET",headers:r.headers,data:r.data,responseType:r.responseType??"text",timeout:r.timeout,onprogress:r.onprogress,onload:n=>{e({status:n.status,statusText:n.statusText,response:n.response,finalUrl:n.finalUrl,headers:n.responseHeaders});},onerror:n=>{const i=n?.error??"unknown error";t(new Error(`GM_xmlhttpRequest failed: ${i}`));},ontimeout:()=>{t(new Error("GM_xmlhttpRequest timeout"));}});}),U=S("dAnime:NicoApiFetcher");class ne{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(e){try{const t=this.sanitizeVideoId(e),i=(await j({method:"GET",url:Ot(t),headers:{Accept:"text/html"}})).response,o=new DOMParser().parseFromString(i,"text/html").querySelector('meta[name="server-response"]');if(!o)throw new Error("API data element not found in response");const l=o.getAttribute("content");if(!l)throw new Error("API data content is empty");const c=this.decodeServerResponse(l),h=JSON.parse(c).data?.response;if(!h)throw new Error("Invalid API data structure");return this.apiData=h,h}catch(t){throw U.error("NicoApiFetcher.fetchApiData",t),t}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const e=this.apiData.comment?.nvComment;if(!e?.server||!e.params||!e.threadKey)throw new Error("Required comment server data is missing");const t=await j({method:"POST",url:`${e.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:e.params,threadKey:e.threadKey,additionals:{}})}),s=(JSON.parse(t.response).data?.threads??[]).filter(o=>o.fork==="main").sort((o,l)=>(l.commentCount||0)-(o.commentCount||0))[0];if(!s)throw new Error("Main thread not found in comment response");const a=(s.comments??[]).map(o=>({text:o.body??"",vposMs:o.vposMs??0,commands:o.commands??[]}));return this.comments=a,a}catch(e){throw U.error("NicoApiFetcher.fetchComments",e),e}}async fetchAllData(e){return await this.fetchApiData(e),this.fetchComments()}sanitizeVideoId(e){try{let t=encodeURIComponent(e);return t=t.replace(/%([0-9A-F]{2})/gi,(n,i)=>{const s=parseInt(i,16);return s>=65&&s<=90||s>=97&&s<=122||s>=48&&s<=57||s===45||s===95||s===46||s===126?String.fromCharCode(s):n}),t}catch(t){return U.error("NicoApiFetcher.sanitizeVideoId",t,{videoId:e}),e}}decodeServerResponse(e){try{return decodeURIComponent(e)}catch(t){try{const n=e.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(n)}catch{throw new Error(`API data decode failed: ${t.message}`)}}}}const fe=S("dAnime:NicoVideoSearcher");class Re{cache=new Map;async search(e){if(!e.trim())return [];if(this.cache.has(e))return this.cache.get(e)??[];const t=Ie(e),n=await this.fetchText(t),i=this.parseServerContext(n).map(o=>{const l=this.calculateLevenshteinDistance(e,o.title),c=Math.max(e.length,o.title.length),d=c>0?(1-l/c)*100:0;return {...o,levenshteinDistance:l,similarity:d}}),s=[],a=new Set;for(const o of i)o?.videoId&&(a.has(o.videoId)||(a.add(o.videoId),s.push(o)));return s.sort((o,l)=>{const c=o.similarity??-1,d=l.similarity??-1;return c!==d?d-c:l.viewCount-o.viewCount}),this.cache.set(e,s),s}async fetchText(e){return (await j({method:"GET",url:e})).response}parseServerContext(e){try{const n=new DOMParser().parseFromString(e,"text/html").querySelector('meta[name="server-response"]');if(!n)return [];const i=n.getAttribute("content")??"",s=this.decodeHtmlEntities(i);let a;try{a=JSON.parse(s);}catch(o){return fe.error("NicoVideoSearcher.parseServerContext",o),[]}return this.extractVideoItems(a??{})}catch(t){return fe.error("NicoVideoSearcher.parseServerContext",t),[]}}decodeHtmlEntities(e){if(!e)return "";let t=e.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return t=t.replace(/&#(\d+);/g,(n,i)=>String.fromCharCode(parseInt(i,10))),t=t.replace(/&#x([0-9a-fA-F]+);/g,(n,i)=>String.fromCharCode(parseInt(i,16))),t}extractVideoItems(e){const t=[],n=s=>{const a=(s?.id??s?.contentId??s?.watchId??"").toString();if(!a)return;const o=(s?.title??s?.shortTitle??"").toString(),l=s?.count??{},c=Number(l.view??s?.viewCounter??0)||0,d=Number(l.comment??s?.commentCounter??0)||0,h=Number(l.mylist??s?.mylistCounter??0)||0,m=s?.thumbnail??{},x=(m.nHdUrl||m.listingUrl||m.largeUrl||m.middleUrl||m.url||s?.thumbnailUrl||"").toString(),f=(s?.registeredAt||s?.startTime||s?.postedDateTime||"")?.toString?.()??"",M=s?.owner&&typeof s.owner=="object"?{nickname:(s.owner.nickname??s.owner.name??"")||void 0,name:(s.owner.name??s.owner.nickname??"")||void 0}:null,E=(s?.isChannelVideo||s?.owner?.ownerType==="channel")&&s?.owner?{name:s.owner.name??""}:null;o&&t.push({videoId:a,title:o,viewCount:c,commentCount:d,mylistCount:h,thumbnail:x,postedAt:f,owner:M,channel:E});},i=s=>{if(!s)return;if(Array.isArray(s)){s.forEach(i);return}if(typeof s!="object"||s===null)return;const a=s;(a.id||a.contentId||a.watchId)&&n(a),Object.values(s).forEach(i);};return i(e),t}calculateLevenshteinDistance(e,t){const n=e?e.length:0,i=t?t.length:0;if(n===0)return i;if(i===0)return n;const s=new Array(i+1);for(let o=0;o<=i;++o){const l=s[o]=new Array(n+1);l[0]=o;}const a=s[0];for(let o=1;o<=n;++o)a[o]=o;for(let o=1;o<=i;++o)for(let l=1;l<=n;++l){const c=e[l-1]===t[o-1]?0:1;s[o][l]=Math.min(s[o-1][l]+1,s[o][l-1]+1,s[o-1][l-1]+c);}return s[i][n]}}const b={mypageHeaderTitle:".p-mypageHeader__title",mypageListContainer:".p-mypageMain",watchVideoElement:"video#video",mypageItem:".itemModule.list",mypageItemTitle:".line1",mypageEpisodeNumber:".number.line1 span",mypageEpisodeTitle:".episode.line1 span"};class re{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(e){this.delay=e;}getFuncId(e){return this.funcIds.has(e)||this.funcIds.set(e,this.nextId++),this.funcIds.get(e)??0}exec(e){const t=this.getFuncId(e),n=Date.now(),i=this.timers.get(t)?.lastExec??0,s=n-i;if(s>this.delay)e(),this.timers.set(t,{lastExec:n});else {clearTimeout(this.timers.get(t)?.timerId??void 0);const a=setTimeout(()=>{e(),this.timers.set(t,{lastExec:Date.now()});},this.delay-s);this.timers.set(t,{timerId:a,lastExec:i});}}execOnce(e){const t=this.getFuncId(e),n=this.timers.get(t);if(n?.executedOnce){n.timerId&&clearTimeout(n.timerId);return}n?.timerId&&clearTimeout(n.timerId);const i=setTimeout(()=>{try{e();}finally{this.timers.set(t,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(t,{timerId:i,executedOnce:false,scheduled:true});}cancel(e){const t=this.getFuncId(e),n=this.timers.get(t);n?.timerId&&clearTimeout(n.timerId),this.timers.delete(t);}resetExecution(e){const t=this.getFuncId(e),n=this.timers.get(t);n&&(n.timerId&&clearTimeout(n.timerId),this.timers.set(t,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,e]of this.timers)e.timerId&&clearTimeout(e.timerId);this.timers.clear(),this.funcIds.clear();}}const Pt=1e3,zt=100,Nt=30,be=1e4,ye=100,Ht=/watch\/(?:([a-z]{2}))?(\d+)/gi,g=S("dAnime:VideoSwitchHandler"),xe=r=>{if(!r?.video)return null;const e=r.video.registeredAt,t=e?new Date(e).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:r.video.id,title:r.video.title,viewCount:r.video.count?.view,mylistCount:r.video.count?.mylist,commentCount:r.video.count?.comment,postedAt:t,thumbnail:r.video.thumbnail?.url,owner:r.owner??null,channel:r.channel??null}},Dt=r=>{const e=[];let t;for(;(t=Ht.exec(r))!==null;){const[,n="",i=""]=t;i&&e.push(`${n}${i}`);}return e};class Te{constructor(e,t,n,i=Pt,s=zt){this.renderer=e,this.fetcher=t,this.settingsManager=n,this.monitorInterval=i,this.debounce=new re(s);}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=false;debounce;startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(e){if(!this.isSwitching){this.isSwitching=true;try{const t=await this.resolveVideoElement(e)??null,n=this.preloadedComments??this.lastPreloadedComments??null,i=t?.dataset?.videoId??t?.getAttribute?.("data-video-id")??null,s=this.nextVideoId??i??this.lastVideoId;if(!t||!s&&!n){this.handleMissingVideoInfo(n);return}g.info("videoSwitch:start",{videoId:s??null,elementVideoId:t.dataset?.videoId??null,preloadedCount:n?.length??0}),p.show("動画の切り替わりを検知しました...","info"),this.resetRendererState(t);const a=this.renderer.getVideoElement();if(a!==t&&t)g.debug("videoSwitch:rebind",{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof t.currentSrc=="string"&&t.currentSrc.length>0?t.currentSrc:t.getAttribute("src")??null}),this.renderer.initialize(t),this.renderer.hardReset();else if(a===t&&t&&this.hasVideoSourceChanged(t))g.debug("videoSwitch:rebind:sameElement",{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(t)}),this.renderer.clearComments(),this.renderer.destroy(),this.renderer.initialize(t),this.renderer.hardReset();else if(!a&&!t){g.warn("videoSwitch:missingVideoElement",{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let o=null;s&&(o=await this.fetchVideoApiData(s,n),o&&(this.persistVideoMetadata(o),this.lastVideoId=s));const l=await this.populateComments(s,n);if(l===0?(this.renderer.clearComments(),p.show("コメントを取得できませんでした","warning"),g.warn("videoSwitch:commentsMissing",{videoId:s??null})):g.info("videoSwitch:commentsLoaded",{videoId:s??null,count:l}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(t),o){const c=xe(o);if(c){const d=`コメントソースを更新しました: ${c.title??"不明なタイトル"}（${l}件）`;p.show(d,l>0?"success":"warning");}}}catch(t){g.error("videoSwitch:error",t,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),p.show(`動画切り替えエラー: ${t.message}`,"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}}async resolveVideoElement(e){if(e){const i=this.getVideoSource(e),s=this.lastVideoSource;return (!i||i===s)&&await this.waitForSourceChange(e),e}const t=Date.now()+be;let n=null;for(;Date.now()<t;){const i=document.querySelector(b.watchVideoElement);if(i){n=i;const s=this.hasVideoSourceChanged(i);if(i.readyState>=2||!i.paused||s)return s&&(this.lastVideoSource=null),i}await new Promise(s=>window.setTimeout(s,ye));}return n}async waitForSourceChange(e){const t=this.getVideoSource(e);if(!t)return;const n=Date.now()+be;for(;Date.now()<n;){const i=this.getVideoSource(e);if(i&&i!==t){this.lastVideoSource=null;return}await new Promise(s=>window.setTimeout(s,ye));}}hasVideoSourceChanged(e){const t=this.getVideoSource(e);return t?this.lastVideoSource?this.lastVideoSource!==t:true:false}getVideoSource(e){if(!e)return null;const t=typeof e.currentSrc=="string"?e.currentSrc:"";if(t.length>0)return t;const n=e.getAttribute("src")??"";if(n.length>0)return n;const i=e.querySelector("source[src]");return i&&typeof i.src=="string"&&i.src.length>0?i.src:null}resetRendererState(e){try{e.currentTime=0;}catch(t){g.debug("videoSwitch:resetCurrentTimeFailed",t);}this.renderer.clearComments(),this.renderer.hardReset();}async checkVideoEnd(){const e=this.renderer.getVideoElement();if(!(!e||!Number.isFinite(e.duration)||e.duration-e.currentTime>Nt)){if(!this.nextVideoId){const n=async()=>{await this.findNextVideoId();};this.debounce.execOnce(n);}if(this.nextVideoId&&!this.preloadedComments){const n=async()=>{await this.preloadComments();};this.debounce.execOnce(n);}}}handleMissingVideoInfo(e){e||(this.renderer.clearComments(),p.show("次の動画のコメントを取得できませんでした。コメント表示をクリアします。","warning"));}async fetchVideoApiData(e,t){try{const n=await this.fetcher.fetchApiData(e);return g.debug("videoSwitch:apiFetched",{videoId:e}),n}catch(n){if(g.error("videoSwitch:apiFetchError",n,{videoId:e}),!t)throw n;return null}}persistVideoMetadata(e){const t=xe(e);t&&this.settingsManager.saveVideoData(t.title??"",t);}async populateComments(e,t){let n=null;if(Array.isArray(t)&&t.length>0)n=t;else if(e)try{n=await this.fetcher.fetchAllData(e),g.debug("videoSwitch:commentsFetched",{videoId:e,count:n.length});}catch(s){g.error("videoSwitch:commentsFetchError",s,{videoId:e}),p.show(`コメント取得エラー: ${s.message}`,"error"),n=null;}if(!n||n.length===0)return 0;const i=n.filter(s=>!this.renderer.isNGComment(s.text));return i.forEach(s=>{this.renderer.addComment(s.text,s.vposMs,s.commands);}),this.lastPreloadedComments=[...i],i.length}async findNextVideoId(){try{const e=this.fetcher.lastApiData;if(!e)return;const t=e.series?.video?.next?.id;if(t){this.nextVideoId=t,g.debug("videoSwitch:detectedNext",{videoId:t});return}const n=e.video?.description??"";if(!n)return;const i=Dt(n);if(i.length===0)return;const s=[...i].sort((a,o)=>{const l=parseInt(a.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(o.replace(/^[a-z]{2}/i,""),10)||0)-l});this.nextVideoId=s[0]??null,this.nextVideoId&&g.debug("videoSwitch:candidateFromDescription",{candidate:this.nextVideoId});}catch(e){g.error("videoSwitch:nextIdError",e,{lastVideoId:this.lastVideoId});}}async preloadComments(){if(this.nextVideoId)try{const t=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(n=>!this.renderer.isNGComment(n.text));this.preloadedComments=t.length>0?t:null,g.debug("videoSwitch:preloaded",{videoId:this.nextVideoId,count:t.length});}catch(e){g.error("videoSwitch:preloadError",e,{videoId:this.nextVideoId}),this.preloadedComments=null;}}}const $t=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class Fe{static initialize(){He($t);}}var qt="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z",Bt="M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z",Wt="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",Ut="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z",Gt="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z",Kt="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z",Yt="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",jt="M5,4V7H10.5V19H13.5V7H19V4H5Z",Jt="M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z",Zt="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",Xt="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",Qt="M8,5.14V19.14L19,12.14L8,5.14Z",en="M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z",tn="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";function y(r,e=24){const t=String(e),n=String(e);return `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${n}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${r}"></path></svg>`}const ve=y(Qt),nn=y(Wt),rn=y(Xt),sn=y(Zt),G=y(Ut),on=y(Jt),an=y(jt),ln=y(qt),cn=y(Yt),dn=y(Kt),hn=y(en),un=y(Bt),pn=y(Gt),mn=y(tn),_=S("dAnime:SettingsUI"),u={searchInput:"#searchInput",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",opacitySelect:"#commentOpacity",visibilityToggle:"#commentVisibilityToggle",fixedPlaybackToggle:"#fixedPlaybackToggle",forceRefreshToggle:"#forceRefreshToggle",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",colorValue:".color-value",colorPreview:".color-preview",colorPickerInput:"#colorPickerInput",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",playCurrentVideo:"#playCurrentVideo",settingsModal:"#settingsModal",closeSettingsModal:"#closeSettingsModal",modalOverlay:".settings-modal__overlay",modalTabs:".settings-modal__tab",modalPane:".settings-modal__pane"},A=["search","display","ng"],we=`
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
`,gn=`
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
`;class D extends te{static FAB_HOST_ID="danime-settings-fab-host";settingsManager;fetcher;searcher;settings;playbackSettings;currentVideoInfo;hostElement=null;lastAutoButtonElement=null;activeTab="search";modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;handleFabClick=e=>{e.preventDefault(),this.openSettingsModal();};handleOverlayClick=()=>{this.closeSettingsModal();};handleCloseClick=()=>{this.closeSettingsModal();};handlePlaybackSettingsChanged;constructor(e,t=new ne,n=new Re){super(),this.settingsManager=e,this.fetcher=t,this.searcher=n,this.settings=this.settingsManager.getSettings(),this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData(),this.handlePlaybackSettingsChanged=i=>{this.playbackSettings=i,this.applyPlaybackSettingsToUI();},this.settingsManager.addPlaybackObserver(this.handlePlaybackSettingsChanged);}insertIntoMypage(){const e=document.querySelector(b.mypageHeaderTitle);e&&(this.hostElement=this.createSettingsUI(),e.parentElement?.insertBefore(this.hostElement,e.nextSibling),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(t){console.warn("[SettingsUI] restore failed:",t);}}));}addAutoCommentButtons(){document.querySelectorAll(b.mypageItem).forEach(t=>{const n=t.querySelector(b.mypageItemTitle);if(!n||n.querySelector(".auto-comment-button-host"))return;const i=n.querySelector("span")?.textContent?.trim()??"",s=t.querySelector(b.mypageEpisodeNumber)?.textContent?.trim()??"",a=t.querySelector(b.mypageEpisodeTitle)?.textContent?.trim()??"",o=document.createElement("div");o.className="nico-comment-shadow-host auto-comment-button-host",o.style.cssText="position:absolute;left:150px;top:3px;margin-left:8px;";const l=o.attachShadow({mode:"closed"}),c=document.createElement("style");c.textContent=L.getAutoButtonStyles(),l.appendChild(c);const d=document.createElement("button");d.className="auto-comment-button",d.innerHTML=G,d.setAttribute("aria-label","コメント設定"),d.setAttribute("title","コメント設定"),d.setAttribute("type","button"),d.addEventListener("click",async h=>{h.preventDefault(),h.stopPropagation(),h.stopImmediatePropagation();try{const m=[i,s,a].filter(Boolean).join(" ");this.openSettingsModal(!1),this.setSearchKeyword(m),this.lastAutoButtonElement=o;try{const f=t.querySelector('input[name="workId"]')?.value?.trim()??"",M=t.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),E=t.querySelector('a.textContainer[href*="partId="]');let k="";const I=(M?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);I?k=I[1]:E?.href&&(k=(new URL(E.href,location.origin).searchParams.get("partId")??"").trim()),f&&k&&this.settingsManager.saveLastDanimeIds({workId:f,partId:k});}catch(f){console.warn("[SettingsUI] save (workId, partId) skipped:",f);}const x=await this.executeSearch(m);if(x.length===0)return;await this.applySearchResult(x[0]);}catch(m){_.error("SettingsUI.autoCommentButton",m);}}),l.appendChild(d),n.appendChild(o),this.lastAutoButtonElement=o;}),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(t){console.warn("[SettingsUI] restore failed:",t);}});}async waitMypageListStable(){const e=document.querySelector(b.mypageListContainer);if(!e)return;let t=e.querySelectorAll(b.mypageItem).length;const n=Date.now()+1500;return new Promise(i=>{const s=new MutationObserver(()=>{const a=e.querySelectorAll(b.mypageItem).length;if(a!==t){t=a;return}Date.now()>=n&&(s.disconnect(),i());});s.observe(e,{childList:true,subtree:true}),setTimeout(()=>{try{s.disconnect();}catch(a){_.debug("waitMypageListStable: observer already disconnected",a);}i();},1600);})}tryRestoreByDanimeIds(){const e=this.settingsManager.loadLastDanimeIds();if(!e)return  false;const t=Array.from(document.querySelectorAll(b.mypageItem));for(const n of t){if(n.querySelector('input[name="workId"]')?.value?.trim()!==e.workId)continue;const s=n.querySelector('a.textContainer[href*="partId="]'),a=s?.href?(new URL(s.href,location.origin).searchParams.get("partId")??"")===e.partId:false,o=n.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),l=(()=>{const d=(o?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);return !!d&&d[1]===e.partId})();if(a||l){const c=n.querySelector(".auto-comment-button-host")??n;return this.lastAutoButtonElement=c,this.updatePlayButtonState(this.currentVideoInfo),true}}return  false}createSettingsUI(){const e=document.createElement("div");e.className="nico-comment-shadow-host settings-host",this.createShadowDOM(e),this.addStyles(L.getCommonStyles());const t=this.buildSettingsHtml();return this.setHTML(t),this.applySettingsToUI(),this.addStyles(we),this.setupEventListeners(),e}buildSettingsHtml(){const e=i=>typeof i=="number"?i.toLocaleString():"-",t=i=>{if(!i)return "-";try{return new Date(i).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return i}},n=this.currentVideoInfo;return `
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="バージョン">${Ne}</span>
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
                <span class="info-icon" aria-hidden="true">${on}</span>
                <span class="sr-only">動画ID</span>
                <span class="info-value" id="currentVideoId">${n?.videoId??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="タイトル">
                <span class="info-icon" aria-hidden="true">${an}</span>
                <span class="sr-only">タイトル</span>
                <span class="info-value" id="currentTitle">${n?.title??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="投稿者">
                <span class="info-icon" aria-hidden="true">${ln}</span>
                <span class="sr-only">投稿者</span>
                <span class="info-value" id="currentOwner">${n?.owner?.nickname??n?.channel?.name??"-"}</span>
              </div>
              <div class="info-item" role="listitem" title="再生数">
                <span class="info-icon" aria-hidden="true">${cn}</span>
                <span class="sr-only">再生数</span>
                <span class="info-value" id="currentViewCount">${e(n?.viewCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="コメント数">
                <span class="info-icon" aria-hidden="true">${dn}</span>
                <span class="sr-only">コメント数</span>
                <span class="info-value" id="currentCommentCount">${e(n?.commentCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="マイリスト数">
                <span class="info-icon" aria-hidden="true">${hn}</span>
                <span class="sr-only">マイリスト数</span>
                <span class="info-value" id="currentMylistCount">${e(n?.mylistCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="投稿日">
                <span class="info-icon" aria-hidden="true">${un}</span>
                <span class="sr-only">投稿日</span>
                <span class="info-value" id="currentPostedAt">${t(n?.postedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}buildModalHtml(){const e=["#FFFFFF","#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF"].map(n=>`<button class="color-preset-btn" data-color="${n}" style="background-color: ${n}"></button>`).join(""),t=["0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.75","0.8","0.9","1.0"].map(n=>`<option value="${n}">${n}</option>`).join("");return `
      <div id="settingsModal" class="settings-modal hidden" role="dialog" aria-modal="true" aria-labelledby="settingsModalTitle" aria-hidden="true">
        <div class="settings-modal__overlay"></div>
        <div class="settings-modal__content">
          <header class="settings-modal__header">
            <h3 id="settingsModalTitle">設定</h3>
            <button id="closeSettingsModal" class="settings-modal__close" type="button" aria-label="設定を閉じる">
              <span aria-hidden="true">${nn}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${G}</span>
              <span class="settings-modal__tab-label">検索</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="display" role="tab" aria-selected="false" aria-controls="settingsPaneDisplay" id="settingsTabDisplay" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${rn}</span>
              <span class="settings-modal__tab-label">表示</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${sn}</span>
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
                        ${e}
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
                          ${t}
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
              <span class="settings-modal__play-icon" aria-hidden="true">${ve}</span>
              <span class="settings-modal__play-label">動画を再生</span>
            </button>
            <button id="saveSettings" type="button">設定を保存</button>
          </footer>
        </div>
      </div>
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupColorPresets(),this.setupColorPicker(),this.setupOpacitySelect(),this.setupVisibilityToggle(),this.setupPlaybackToggle(),this.setupForceRefreshToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupPlayButton();}setupModalControls(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick);const e=this.createOrUpdateFab(),t=this.queryModalElement(u.settingsModal),n=this.queryModalElement(u.closeSettingsModal),i=this.queryModalElement(u.modalOverlay);this.modalElement=t??null,this.closeButtonElement=n??null,this.overlayElement=i??null,!(!t||!n||!i||!e)&&(this.fabElement?.removeEventListener("click",this.handleFabClick),e.addEventListener("click",this.handleFabClick),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-haspopup","dialog"),e.setAttribute("aria-expanded","false"),this.fabElement=e,n.addEventListener("click",this.handleCloseClick),i.addEventListener("click",this.handleOverlayClick),this.shadowRoot?.addEventListener("keydown",s=>{const a=s;a.key==="Escape"&&!this.modalElement?.classList.contains("hidden")&&(a.preventDefault(),this.closeSettingsModal());}),this.applySettingsToUI());}setupModalTabs(){const e=Array.from(this.queryModalSelectorAll(u.modalTabs)),t=Array.from(this.queryModalSelectorAll(u.modalPane));if(e.length===0||t.length===0)return;const n=i=>{e.forEach(s=>{const o=this.toModalTabKey(s.dataset.tab)===i;s.classList.toggle("is-active",o),s.setAttribute("aria-selected",String(o)),s.setAttribute("tabindex",o?"0":"-1");}),t.forEach(s=>{const o=this.toModalTabKey(s.dataset.pane)===i;s.classList.toggle("is-active",o),s.setAttribute("aria-hidden",String(!o));}),this.activeTab=i;};e.forEach(i=>{i.addEventListener("click",()=>{const s=this.toModalTabKey(i.dataset.tab);s&&n(s);}),i.addEventListener("keydown",s=>{const a=s;if(a.key!=="ArrowRight"&&a.key!=="ArrowLeft")return;a.preventDefault();const o=this.toModalTabKey(i.dataset.tab);if(!o)return;const l=a.key==="ArrowRight"?1:-1,c=(A.indexOf(o)+l+A.length)%A.length,d=A[c];n(d),e.find(m=>this.toModalTabKey(m.dataset.tab)===d)?.focus({preventScroll:true});});}),n(this.activeTab);}openSettingsModal(e=true){!this.modalElement||!this.fabElement||(this.modalElement.classList.remove("hidden"),this.modalElement.setAttribute("aria-hidden","false"),this.fabElement.setAttribute("aria-expanded","true"),e&&this.queryModalElement(`${u.modalTabs}.is-active`)?.focus({preventScroll:true}));}closeSettingsModal(){!this.modalElement||!this.fabElement||(this.modalElement.classList.add("hidden"),this.modalElement.setAttribute("aria-hidden","true"),this.fabElement.setAttribute("aria-expanded","false"),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:true}));}toModalTabKey(e){return e&&A.includes(e)?e:null}setupColorPresets(){this.queryModalSelectorAll(".color-preset-btn").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.color;if(!n)return;this.settings.commentColor=n;const i=this.queryModalElement(u.colorPreview),s=this.queryModalElement(u.colorValue);i&&(i.style.backgroundColor=n),s&&(s.textContent=n);});});}setupColorPicker(){const e=this.queryModalElement(u.colorPickerInput);e&&e.addEventListener("input",()=>{this.settings.commentColor=e.value;const t=this.queryModalElement(u.colorPreview),n=this.queryModalElement(u.colorValue);t&&(t.style.backgroundColor=e.value),n&&(n.textContent=e.value);});}setupOpacitySelect(){const e=this.queryModalElement(u.opacitySelect);e&&(e.value=this.settings.commentOpacity.toString(),e.addEventListener("change",()=>{const t=Number(e.value);Number.isNaN(t)||(this.settings.commentOpacity=t);}));}setupVisibilityToggle(){const e=this.queryModalElement(u.visibilityToggle);e&&(e.addEventListener("click",()=>{this.settings.isCommentVisible=!this.settings.isCommentVisible,this.updateVisibilityToggleState(e);}),this.updateVisibilityToggleState(e));}setupPlaybackToggle(){const e=this.queryModalElement(u.fixedPlaybackToggle);e&&(e.addEventListener("click",()=>{const t=!this.playbackSettings.fixedModeEnabled,n={...this.playbackSettings,fixedModeEnabled:t};if(!this.settingsManager.updatePlaybackSettings(n)){p.show("再生速度の設定変更に失敗しました","error"),this.applyPlaybackSettingsToUI();return}this.playbackSettings=n,this.updatePlaybackToggleState(e),p.show(t?`${this.formatPlaybackRateLabel(this.playbackSettings.fixedRate)}固定モードを有効にしました`:"固定再生モードを無効にしました","success");}),this.updatePlaybackToggleState(e));}setupForceRefreshToggle(){const e=this.queryModalElement(u.forceRefreshToggle);e&&(e.addEventListener("click",()=>{const t=this.settings.enableForceRefresh===false;this.settings.enableForceRefresh=t,this.updateForceRefreshToggleState(e);}),this.updateForceRefreshToggleState(e));}setupNgControls(){const e=this.queryModalElement(u.ngWords);e&&e.classList.remove("hidden");const t=this.queryModalElement(u.ngRegexps);t&&t.classList.remove("hidden");}setupSaveButton(){const e=this.queryModalElement(u.saveButton);e&&e.addEventListener("click",()=>this.saveSettings());}setupSearch(){const e=this.queryModalElement(u.searchInput),t=this.queryModalElement(u.searchButton),n=this.queryModalElement(u.openSearchPage),i=async()=>{const s=e?.value.trim();if(!s){p.show("キーワードを入力してください","warning");return}await this.executeSearch(s);};t?.addEventListener("click",i),e?.addEventListener("keydown",s=>{s.key==="Enter"&&i();}),n?.addEventListener("click",s=>{s.preventDefault();const a=e?.value.trim(),o=a?Ie(a):ge.searchBase;J().open(o,"_blank","noopener");});}async executeSearch(e){try{p.show(`「${e}」を検索中...`,"info");const t=await this.searcher.search(e);return this.renderSearchResults(t,n=>this.renderSearchResultItem(n)),t.length===0&&p.show("検索結果が見つかりませんでした","warning"),t}catch(t){return _.error("SettingsUI.executeSearch",t),[]}}setSearchKeyword(e){const t=this.queryModalElement(u.searchInput);t&&(t.value=e,t.focus({preventScroll:true}));}renderSearchResults(e,t){const n=this.queryModalElement(u.searchResults);if(!n)return;n.innerHTML=e.map(s=>t(s)).join(""),n.querySelectorAll(".search-result-item").forEach((s,a)=>{s.addEventListener("click",()=>{const l=e[a];this.applySearchResult(l);});const o=s.querySelector(".open-search-page-direct-btn");o&&o.addEventListener("click",l=>{l.stopPropagation();});});}renderSearchResultItem(e){const t=this.formatSearchResultDate(e.postedAt),n=typeof e.similarity=="number"?`
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
              ${ve}
            </span>
            <span>${e.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="コメント">
              ${pn}
            </span>
            <span>${e.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="マイリスト">
              ${mn}
            </span>
            <span>${e.mylistCount.toLocaleString()}</span>
            ${n}
          </div>
          <div class="date">${t}</div>
          <a href="${ge.watchBase}/${e.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(e){try{const t=await this.fetcher.fetchApiData(e.videoId);await this.fetcher.fetchComments(),p.show(`「${e.title}」のコメントを設定しました`,"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(e,t));}catch(t){_.error("SettingsUI.applySearchResult",t);}}buildVideoMetadata(e,t){return {videoId:e.videoId,title:e.title,viewCount:t.video?.count?.view??e.viewCount,commentCount:t.video?.count?.comment??e.commentCount,mylistCount:t.video?.count?.mylist??e.mylistCount,postedAt:t.video?.registeredAt??e.postedAt,thumbnail:t.video?.thumbnail?.url??e.thumbnail,owner:t.owner??e.owner??void 0,channel:t.channel??e.channel??void 0}}applySettingsToUI(){const e=this.queryModalElement(u.opacitySelect),t=this.queryModalElement(u.visibilityToggle),n=this.queryModalElement(u.colorPreview),i=this.queryModalElement(u.colorValue),s=this.queryModalElement(u.ngWords),a=this.queryModalElement(u.ngRegexps);e&&(e.value=this.settings.commentOpacity.toString()),t&&this.updateVisibilityToggleState(t),n&&(n.style.backgroundColor=this.settings.commentColor),i&&(i.textContent=this.settings.commentColor),s&&(s.value=this.settings.ngWords.join(`
`)),a&&(a.value=this.settings.ngRegexps.join(`
`)),this.applyPlaybackSettingsToUI(),this.updatePlayButtonState(this.currentVideoInfo);}saveSettings(){const e=this.queryModalElement(u.opacitySelect),t=this.queryModalElement(u.ngWords),n=this.queryModalElement(u.ngRegexps);if(e){const i=Number(e.value);Number.isNaN(i)||(this.settings.commentOpacity=i);}t&&(this.settings.ngWords=t.value.split(`
`).map(i=>i.trim()).filter(Boolean)),n&&(this.settings.ngRegexps=n.value.split(`
`).map(i=>i.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings)?p.show("設定を保存しました","success"):p.show("設定の保存に失敗しました","error");}updateCurrentVideoInfo(e){this.currentVideoInfo=e,[["currentTitle",e.title??"-"],["currentVideoId",e.videoId??"-"],["currentOwner",e.owner?.nickname??e.channel?.name??"-"],["currentViewCount",this.formatNumber(e.viewCount)],["currentCommentCount",this.formatNumber(e.commentCount)],["currentMylistCount",this.formatNumber(e.mylistCount)],["currentPostedAt",this.formatSearchResultDate(e.postedAt)]].forEach(([i,s])=>{const a=this.querySelector(u[i]);a&&(a.textContent=s);});const n=this.querySelector(u.currentThumbnail);n&&e.thumbnail&&(n.src=e.thumbnail,n.alt=e.title??"サムネイル");try{this.settingsManager.saveVideoData(e.title??"",e);}catch(i){_.error("SettingsUI.updateCurrentVideoInfo",i);}this.updatePlayButtonState(e);}formatNumber(e){return typeof e=="number"?e.toLocaleString():"-"}formatSearchResultDate(e){if(!e)return "-";const t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(t)}formatPlaybackRateLabel(e){return `${(Number.isFinite(e)?e:1.11).toFixed(2).replace(/\.?0+$/,"")}倍`}setupPlayButton(){const e=this.queryModalElement(u.playCurrentVideo);e&&(e.addEventListener("click",()=>{try{if(!this.currentVideoInfo?.videoId){p.show("再生できる動画が設定されていません","warning");return}const n=this.lastAutoButtonElement?.closest(".itemModule.list");if(this.lastAutoButtonElement){const i=n?.querySelector(".thumbnailContainer > a, .thumbnail-container > a");if(i){p.show(`「${this.currentVideoInfo?.title||"動画"}」を再生します...`,"success"),setTimeout(()=>{i.click();},300);return}}p.show("再生リンクが見つかりませんでした（対象アイテム内に限定して検索済み）","warning");}catch(t){_.error("SettingsUI.playCurrentVideo",t),p.show(`再生エラー: ${t.message}`,"error");}}),this.updatePlayButtonState(this.currentVideoInfo));}updatePlayButtonState(e){const t=this.queryModalElement(u.playCurrentVideo);if(!t)return;const n=!!e?.videoId;t.disabled=!n,t.setAttribute("aria-disabled",(!n).toString());}updateVisibilityToggleState(e){e.textContent=this.settings.isCommentVisible?"表示中":"非表示中",e.classList.toggle("off",!this.settings.isCommentVisible);}applyPlaybackSettingsToUI(){const e=this.queryModalElement(u.fixedPlaybackToggle);e&&this.updatePlaybackToggleState(e);}updatePlaybackToggleState(e){const t=this.playbackSettings.fixedModeEnabled;e.textContent=t?`${this.formatPlaybackRateLabel(this.playbackSettings.fixedRate)}固定中`:"標準速度",e.classList.toggle("off",!t),e.setAttribute("aria-pressed",t?"true":"false");}updateForceRefreshToggleState(e){const t=this.settings.enableForceRefresh!==false;e.textContent=t?"有効":"無効",e.classList.toggle("off",!t),e.setAttribute("aria-pressed",t?"true":"false");}destroy(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),this.settingsManager.removePlaybackObserver(this.handlePlaybackSettingsChanged),super.destroy();}createOrUpdateFab(){if(!document.body)return null;let e=this.fabHostElement;!e||!e.isConnected?(e?.remove(),e=document.createElement("div"),e.id=D.FAB_HOST_ID,e.style.position="fixed",e.style.bottom="32px",e.style.right="32px",e.style.zIndex="2147483646",e.style.display="inline-block",this.fabShadowRoot=e.attachShadow({mode:"open"}),document.body.appendChild(e),this.fabHostElement=e):this.fabShadowRoot||(this.fabShadowRoot=e.shadowRoot??e.attachShadow({mode:"open"}));const t=this.fabShadowRoot;if(!t)return null;let n=t.querySelector("style[data-role='fab-base-style']");n||(n=document.createElement("style"),n.dataset.role="fab-base-style",n.textContent=L.getCommonStyles(),t.appendChild(n));let i=t.querySelector("style[data-role='fab-style']");i||(i=document.createElement("style"),i.dataset.role="fab-style",i.textContent=`
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
      `,t.appendChild(i));let s=t.querySelector("style[data-role='similarity-style']");s||(s=document.createElement("style"),s.dataset.role="similarity-style",s.textContent=we,t.appendChild(s));let a=t.querySelector("style[data-role='modal-play-button-style']");a||(a=document.createElement("style"),a.dataset.role="modal-play-button-style",a.textContent=gn,t.appendChild(a));let o=t.querySelector(".fab-container");o||(o=document.createElement("div"),o.className="fab-container",t.appendChild(o));let l=o.querySelector("button.fab-button");l||(l=document.createElement("button"),l.type="button",l.className="fab-button",o.appendChild(l)),l.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${G}</span>
      <span class="fab-button__label">設定</span>
    `,l.setAttribute("aria-label","ニコニココメント設定を開く"),l.setAttribute("aria-haspopup","dialog");let c=o.querySelector(u.settingsModal);return c||(o.insertAdjacentHTML("beforeend",this.buildModalHtml()),c=o.querySelector(u.settingsModal)),this.modalElement=c??null,l}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener("click",this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null;}queryModalElement(e){return this.fabShadowRoot?this.fabShadowRoot.querySelector(e):null}queryModalSelectorAll(e){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}}const fn=S("dAnime:PlaybackRateController"),bn=1,yn=200,xn=1e-4;class Oe{constructor(e){this.settingsManager=e,this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.settingsObserver=t=>{this.playbackSettings=t,this.applyCurrentMode();},this.settingsManager.addPlaybackObserver(this.settingsObserver);}currentVideo=null;playbackSettings;settingsObserver;isApplying=false;retryTimer=null;handleLoadedMetadata=()=>{this.applyCurrentMode();};handleRateChange=()=>{this.isApplying||this.playbackSettings.fixedModeEnabled&&this.scheduleApply();};handlePlay=()=>{this.applyCurrentMode();};handleEmptied=()=>{this.scheduleApply();};bind(e){if(this.currentVideo===e){this.applyCurrentMode();return}this.detachVideoListeners(),this.cancelScheduledApply(),this.currentVideo=e,this.attachVideoListeners(e),this.applyCurrentMode();}unbind(){this.cancelScheduledApply(),this.detachVideoListeners(),this.currentVideo=null;}dispose(){this.unbind(),this.settingsManager.removePlaybackObserver(this.settingsObserver);}attachVideoListeners(e){e.addEventListener("loadedmetadata",this.handleLoadedMetadata),e.addEventListener("ratechange",this.handleRateChange),e.addEventListener("play",this.handlePlay),e.addEventListener("emptied",this.handleEmptied);}detachVideoListeners(){this.currentVideo&&(this.currentVideo.removeEventListener("loadedmetadata",this.handleLoadedMetadata),this.currentVideo.removeEventListener("ratechange",this.handleRateChange),this.currentVideo.removeEventListener("play",this.handlePlay),this.currentVideo.removeEventListener("emptied",this.handleEmptied));}applyCurrentMode(){const e=this.currentVideo;e&&(this.playbackSettings.fixedModeEnabled?this.setPlaybackRate(e,this.playbackSettings.fixedRate):this.setPlaybackRate(e,bn));}setPlaybackRate(e,t){if(!(!Number.isFinite(t)||t<=0)&&!(Math.abs(e.playbackRate-t)<=xn)){this.isApplying=true;try{e.playbackRate=t;}catch(n){fn.warn("再生速度の設定に失敗しました",n),this.scheduleApply();}finally{window.setTimeout(()=>{this.isApplying=false;},0);}}}scheduleApply(){this.cancelScheduledApply(),this.retryTimer=window.setTimeout(()=>{this.retryTimer=null,this.applyCurrentMode();},yn);}cancelScheduledApply(){this.retryTimer!==null&&(window.clearTimeout(this.retryTimer),this.retryTimer=null);}}const Se=async()=>{},vn=()=>{const r=J();if(!r.dAniRenderer){const e={};r.dAniRenderer={classes:{Comment:z,CommentRenderer:Me,NicoApiFetcher:ne,NotificationManager:p,StyleManager:Fe,SettingsUI:D,NicoVideoSearcher:Re,VideoSwitchHandler:Te,SettingsManager:Z,KeyboardShortcutHandler:_e,DebounceExecutor:re,ShadowDOMComponent:te,ShadowStyleManager:L,PlaybackRateController:Oe},instances:e,utils:{initialize:Se,initializeWithVideo:Se},debug:{showState:()=>{console.log("Current instances:",e);},showSettings:()=>{const t=e.settingsManager;if(!t){console.log("SettingsManager not initialized");return}console.log("Current settings:",t.getSettings());},showComments:()=>{const t=e.renderer;if(!t){console.log("CommentRenderer not initialized");return}console.log("Current comments:",t.getCommentsSnapshot());}},defaultSettings:v};}return r.dAniRenderer},wn=100,Sn=1e3,Cn=3e3,En=1e4;class kn{constructor(e){this.global=e;}initialized=false;switchDebounce=new re(Sn);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;playbackRateController=null;forceRefreshTimer=null;hasForceRefreshed=false;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(e=>{window.addEventListener("load",()=>e(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const e=document.querySelector(b.watchVideoElement);if(!e){window.setTimeout(()=>this.waitForVideoElement(),wn);return}if(e.readyState===0){e.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(e);},{once:true});return}this.initializeWithVideo(e);}async initializeWithVideo(e){if(!this.initialized){this.initialized=true;try{p.show("コメントローダーを初期化中...");const t=p.getInstance(),n=this.global.settingsManager??new Z(t);this.global.settingsManager=n,this.global.instances.settingsManager=n;const i=n.loadVideoData();if(!i?.videoId)throw new Error("動画データが見つかりません。マイページで設定してください。");const s=new ne;this.global.instances.fetcher=s,await s.fetchApiData(i.videoId);const a=await s.fetchComments(),o=this.mergeSettings(n.loadSettings()),l=new Me(o);l.initialize(e),this.global.instances.renderer=l,this.currentVideoElement=e;const c=this.playbackRateController??new Oe(n);this.playbackRateController=c,this.global.instances.playbackRateController=c,c.bind(e),n.addObserver(h=>{l.settings=this.mergeSettings(h);}),a.forEach(h=>{l.addComment(h.text,h.vposMs,h.commands);});const d=new Te(l,s,n);d.startMonitoring(),this.global.instances.switchHandler=d,this.setupSwitchHandling(e,d),this.observeVideoElement(),p.show(`コメントの読み込みが完了しました（${a.length}件）`,"success");}catch(t){throw this.initialized=false,p.show(`初期化エラー: ${t.message}`,"error"),t}}}mergeSettings(e){const t=v();return {...t,...e,ngWords:[...e.ngWords??t.ngWords],ngRegexps:[...e.ngRegexps??t.ngRegexps]}}setupSwitchHandling(e,t){this.currentVideoElement=e,this.switchCallback=()=>{const n=Date.now();if(n-this.lastSwitchTimestamp<Cn)return;this.lastSwitchTimestamp=n;const i=this.currentVideoElement;t.onVideoSwitch(i);},this.global.utils.initializeWithVideo=async n=>{n&&(this.rebindVideoElement(n),this.playbackRateController?.bind(n),await t.onVideoSwitch(n));},this.currentVideoElement=e;}observeVideoElement(){const e=this.currentVideoElement;e&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{const t=document.querySelector(b.watchVideoElement);!t||t===this.currentVideoElement||this.rebindVideoElement(t);}),this.domMutationObserver.observe(document.body,{childList:true,subtree:true}),this.attachVideoEventListeners(e));}rebindVideoElement(e){this.detachVideoEventListeners(),this.clearForceRefreshTimer(),this.hasForceRefreshed=false,this.currentVideoElement=e;const t=this.global.instances.renderer,n=this.global.instances.switchHandler;t&&(t.clearComments(),t.destroy(),t.initialize(e),t.hardReset(),t.resize()),this.playbackRateController?.bind(e),n&&(n.onVideoSwitch(e),this.setupSwitchHandling(e,n)),this.attachVideoEventListeners(e);}attachVideoEventListeners(e){this.detachVideoEventListeners();const t=()=>{this.switchCallback&&(this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));};e.addEventListener("ended",t),e.addEventListener("loadedmetadata",t),e.addEventListener("emptied",t),this.videoEndedListener=t,e.addEventListener("play",()=>{this.scheduleForceRefresh();},{once:true});}detachVideoEventListeners(){const e=this.currentVideoElement;e&&this.videoEndedListener&&(e.removeEventListener("ended",this.videoEndedListener),e.removeEventListener("loadedmetadata",this.videoEndedListener),e.removeEventListener("emptied",this.videoEndedListener)),this.videoEndedListener=null;}scheduleForceRefresh(){if(this.hasForceRefreshed)return;this.clearForceRefreshTimer();const e=this.global.instances.renderer,t=this.global.settingsManager;!e||!t||t.getSettings().enableForceRefresh===false||(this.forceRefreshTimer=setTimeout(()=>{this.forceRefreshComments();},En));}forceRefreshComments(){const e=this.global.instances.renderer;if(!(!e||this.hasForceRefreshed))try{const t=e.getCommentsSnapshot();if(t.length===0)return;e.clearComments(),e.hardReset(),t.forEach(n=>{const i=n.commands??[];e.addComment(n.text,n.vposMs,i);}),this.hasForceRefreshed=!0,this.clearForceRefreshTimer();}catch(t){console.error("[WatchPageController] Force refresh failed",t);}}clearForceRefreshTimer(){this.forceRefreshTimer!==null&&(clearTimeout(this.forceRefreshTimer),this.forceRefreshTimer=null);}}const _n=100;class Mn{constructor(e){this.global=e;}initialize(){const e=p.getInstance(),t=this.global.settingsManager??new Z(e);this.global.settingsManager=t,this.global.instances.settingsManager=t;const n=new D(t);this.waitForHeader(n);}waitForHeader(e){if(!document.querySelector(b.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(e),_n);return}e.insertIntoMypage(),e.addAutoCommentButtons(),this.observeList(e);}observeList(e){const t=document.querySelector(b.mypageListContainer);if(!t)return;new MutationObserver(()=>{try{e.addAutoCommentButtons();}catch(i){console.error("[MypageController] auto comment buttons update failed",i);}}).observe(t,{childList:true,subtree:true});}}class Vn{log;global=vn();watchController=null;mypageController=null;constructor(){this.log=S("DanimeApp");}start(){this.log.info("starting renderer"),Fe.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const e=location.pathname.toLowerCase();try{e.includes("/animestore/sc_d_pc")?(this.watchController=new kn(this.global),await this.watchController.initialize()):e.includes("/animestore/mp_viw_pc")?(this.mypageController=new Mn(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(t){this.log.error("initialization failed",t);}}acquireInstanceLock(){const e=J();return e.__dAnimeNicoCommentRenderer2Instance=(e.__dAnimeNicoCommentRenderer2Instance??0)+1,e.__dAnimeNicoCommentRenderer2Instance===1}}const K=S("dAnimeNicoCommentRenderer2");async function An(){K.info("bootstrap start");try{new Vn().start(),K.info("bootstrap completed");}catch(r){K.error("bootstrap failed",r);}}An();

})();