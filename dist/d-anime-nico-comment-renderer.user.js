// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      6.2.0
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

  const ht={debug:"debug",info:"info",warn:"warn",error:"error"},k=r=>{const t=`[${r}]`,e={};return Object.keys(ht).forEach(n=>{const s=ht[n];e[n]=(...i)=>{(console[s]??console.log)(t,...i);};}),e};function nt(){return typeof unsafeWindow<"u"?unsafeWindow:window}const Yt={commentColor:"#FFFFFF",commentOpacity:.75,isCommentVisible:true,useContainerResizeObserver:true,ngWords:[],ngRegexps:[]},P=Yt,C=()=>({...P,ngWords:[...P.ngWords],ngRegexps:[...P.ngRegexps]}),Zt="v6.2.0";var Xt=typeof GM_addStyle<"u"?GM_addStyle:void 0,q=typeof GM_getValue<"u"?GM_getValue:void 0,W=typeof GM_setValue<"u"?GM_setValue:void 0,Jt=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const ut="settings",mt="currentVideo",pt="lastDanimeIds",Qt=r=>({...r,ngWords:[...r.ngWords],ngRegexps:[...r.ngRegexps]});class rt{constructor(t){this.notifier=t,this.settings=C(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData();}settings;currentVideo;observers=new Set;getSettings(){return Qt(this.settings)}loadSettings(){try{const t=q(ut,null);if(!t)return this.settings=C(),this.settings;if(typeof t=="string"){const e=JSON.parse(t);this.settings={...C(),...e,ngWords:Array.isArray(e?.ngWords)?[...e.ngWords]:[],ngRegexps:Array.isArray(e?.ngRegexps)?[...e.ngRegexps]:[]};}else this.settings={...C(),...t,ngWords:Array.isArray(t.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t.ngRegexps)?[...t.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(t){return console.error("[SettingsManager] 設定の読み込みに失敗しました",t),this.notify("設定の読み込みに失敗しました","error"),this.settings=C(),this.settings}}saveSettings(){try{return W(ut,JSON.stringify(this.settings)),this.notifyObservers(),this.notify("設定を保存しました","success"),!0}catch(t){return console.error("[SettingsManager] 設定の保存に失敗しました",t),this.notify("設定の保存に失敗しました","error"),false}}updateSettings(t){return this.settings={...this.settings,...t,ngWords:t.ngWords?[...t.ngWords]:[...this.settings.ngWords],ngRegexps:t.ngRegexps?[...t.ngRegexps]:[...this.settings.ngRegexps]},this.saveSettings()}addObserver(t){this.observers.add(t);}removeObserver(t){this.observers.delete(t);}notifyObservers(){const t=this.getSettings();for(const e of this.observers)try{e(t);}catch(n){console.error("[SettingsManager] 設定変更通知でエラー",n);}}loadVideoData(){try{return q(mt,null)??null}catch(t){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",t),this.notify("動画データの読み込みに失敗しました","error"),null}}saveVideoData(t,e){try{const n={videoId:e.videoId,title:e.title,viewCount:e.viewCount,commentCount:e.commentCount,mylistCount:e.mylistCount,postedAt:e.postedAt,thumbnail:e.thumbnail,owner:e.owner??null,channel:e.channel??null};return W(mt,n),this.currentVideo=n,!0}catch(n){return console.error("[SettingsManager] 動画データの保存に失敗しました",n),this.notify("動画データの保存に失敗しました","error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(t){try{return W(pt,t),!0}catch(e){return console.error("[SettingsManager] saveLastDanimeIds failed",e),this.notify("ID情報の保存に失敗しました","error"),false}}loadLastDanimeIds(){try{return q(pt,null)??null}catch(t){return console.error("[SettingsManager] loadLastDanimeIds failed",t),this.notify("ID情報の読込に失敗しました","error"),null}}notify(t,e="info"){this.notifier?.show(t,e);}}const B=k("dAnime:Comment");class te{text;vpos;commands;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily="Arial";opacity;isActive=false;hasShown=false;isPaused=false;lastUpdateTime=0;reservationWidth=0;constructor(t,e,n=[],s){if(typeof t!="string")throw new Error("Comment text must be a string");if(!Number.isFinite(e)||e<0)throw new Error("Comment vpos must be a non-negative number");this.text=t,this.vpos=e,this.commands=Array.isArray(n)?n:[],this.color=s.commentColor,this.opacity=s.commentOpacity;}prepare(t,e,n){try{if(!t)throw new Error("Canvas context is required");if(!Number.isFinite(e)||!Number.isFinite(n))throw new Error("Canvas dimensions must be numbers");this.fontSize=Math.max(24,Math.floor(n*.05)),t.font=`${this.fontSize}px ${this.fontFamily}`,this.width=t.measureText(this.text).width,this.height=this.fontSize;const s=t.measureText("あ".repeat(150)).width;this.reservationWidth=Math.min(s,this.width*5),this.x=e,this.baseSpeed=(e+this.reservationWidth)/720,this.speed=this.baseSpeed,this.lastUpdateTime=performance.now();}catch(s){throw B.error("Comment.prepare",s,{text:this.text,canvasWidth:e,canvasHeight:n,hasContext:!!t}),s}}update(t=1,e=false){try{if(!this.isActive||this.isPaused)return;const n=performance.now(),s=(n-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*t,this.x-=this.speed*s,this.x<-this.width&&(this.isActive=!1),this.lastUpdateTime=n,this.isPaused=e;}catch(n){B.error("Comment.update",n,{text:this.text,playbackRate:t,isPaused:e,isActive:this.isActive});}}draw(t,e=null){try{if(!this.isActive||!t)return;t.save(),t.globalAlpha=this.opacity,t.font=`${this.fontSize}px ${this.fontFamily}`;const n=e??this.x,s=this.y+this.fontSize;t.strokeStyle="#000000",t.lineWidth=Math.max(3,this.fontSize/8),t.lineJoin="round",t.strokeText(this.text,n,s),t.fillStyle=this.color,t.fillText(this.text,n,s),t.restore();}catch(n){B.error("Comment.draw",n,{text:this.text,isActive:this.isActive,hasContext:!!t,interpolatedX:e});}}}const ee=new Set(["INPUT","TEXTAREA"]),U=r=>r.length===1?r.toUpperCase():r,ne=r=>r?`${r}+`:"";class Rt{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(t,e,n){const s=this.createShortcutKey(U(t),e);this.shortcuts.set(s,n);}removeShortcut(t,e){const n=this.createShortcutKey(U(t),e);this.shortcuts.delete(n);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(t){this.isEnabled=t;}createShortcutKey(t,e){return `${ne(e)}${t}`}extractModifier(t){const e=[];return t.ctrlKey&&e.push("Ctrl"),t.altKey&&e.push("Alt"),t.shiftKey&&e.push("Shift"),t.metaKey&&e.push("Meta"),e.length>0?e.join("+"):null}handleKeyDown(t){if(!this.isEnabled)return;const n=t.target?.tagName??"";if(ee.has(n))return;const s=this.extractModifier(t),i=this.createShortcutKey(U(t.key),s),o=this.shortcuts.get(i);o&&(t.preventDefault(),o());}}var re=(function(){if(typeof document>"u")return "transform";for(var r=["oTransform","msTransform","mozTransform","webkitTransform","transform"],t=document.createElement("div").style,e=0;e<r.length;e++)if(r[e]in t)return r[e];return "transform"})();function ie(r){var t=document.createElement("div");if(t.style.cssText="position:absolute;",typeof r.render=="function"){var e=r.render();if(e instanceof HTMLElement)return t.appendChild(e),t}if(t.textContent=r.text,r.style)for(var n in r.style)t.style[n]=r.style[n];return t}function se(){var r=document.createElement("div");return r.style.cssText="overflow:hidden;white-space:nowrap;transform:translateZ(0);",r}function oe(r){for(var t=r.lastChild;t;)r.removeChild(t),t=r.lastChild;}function ae(r,t,e){r.style.width=t+"px",r.style.height=e+"px";}function le(){}function de(r,t){var e=document.createDocumentFragment(),n=0,s=null;for(n=0;n<t.length;n++)s=t[n],s.node=s.node||ie(s),e.appendChild(s.node);for(t.length&&r.appendChild(e),n=0;n<t.length;n++)s=t[n],s.width=s.width||s.node.offsetWidth,s.height=s.height||s.node.offsetHeight;}function ce(r,t){t.node.style[re]="translate("+t.x+"px,"+t.y+"px)";}function he(r,t){r.removeChild(t.node),this.media||(t.node=null);}var ue={name:"dom",init:se,clear:oe,resize:ae,framing:le,setup:de,render:ce,remove:he},E=typeof window<"u"&&window.devicePixelRatio||1,j=Object.create(null);function me(r,t){if(j[r])return j[r];var e=12,n=/(\d+(?:\.\d+)?)(px|%|em|rem)(?:\s*\/\s*(\d+(?:\.\d+)?)(px|%|em|rem)?)?/,s=r.match(n);if(s){var i=s[1]*1||10,o=s[2],a=s[3]*1||1.2,l=s[4];o==="%"&&(i*=t.container/100),o==="em"&&(i*=t.container),o==="rem"&&(i*=t.root),l==="px"&&(e=a),l==="%"&&(e=i*a/100),l==="em"&&(e=i*a),l==="rem"&&(e=t.root*a),l===void 0&&(e=i*a);}return j[r]=e,e}function pe(r,t){if(typeof r.render=="function"){var e=r.render();if(e instanceof HTMLCanvasElement)return r.width=e.width,r.height=e.height,e}var n=document.createElement("canvas"),s=n.getContext("2d"),i=r.style||{};i.font=i.font||"10px sans-serif",i.textBaseline=i.textBaseline||"bottom";var o=i.lineWidth*1;o=o>0&&o!==1/0?Math.ceil(o):!!i.strokeStyle*1,s.font=i.font,r.width=r.width||Math.max(1,Math.ceil(s.measureText(r.text).width)+o*2),r.height=r.height||Math.ceil(me(i.font,t))+o*2,n.width=r.width*E,n.height=r.height*E,s.scale(E,E);for(var a in i)s[a]=i[a];var l=0;switch(i.textBaseline){case "top":case "hanging":l=o;break;case "middle":l=r.height>>1;break;default:l=r.height-o;}return i.strokeStyle&&s.strokeText(r.text,o,l),s.fillText(r.text,o,l),n}function gt(r){return window.getComputedStyle(r,null).getPropertyValue("font-size").match(/(.+)px/)[1]*1}function ge(r){var t=document.createElement("canvas");return t.context=t.getContext("2d"),t._fontSize={root:gt(document.getElementsByTagName("html")[0]),container:gt(r)},t}function fe(r,t){r.context.clearRect(0,0,r.width,r.height);for(var e=0;e<t.length;e++)t[e].canvas=null;}function be(r,t,e){r.width=t*E,r.height=e*E,r.style.width=t+"px",r.style.height=e+"px";}function ye(r){r.context.clearRect(0,0,r.width,r.height);}function ve(r,t){for(var e=0;e<t.length;e++){var n=t[e];n.canvas=pe(n,r._fontSize);}}function xe(r,t){r.context.drawImage(t.canvas,t.x*E,t.y*E);}function we(r,t){t.canvas=null;}var _e={name:"canvas",init:ge,clear:fe,resize:be,framing:ye,setup:ve,render:xe,remove:we},ft=(function(){if(typeof window<"u"){var r=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame;if(r)return r.bind(window)}return function(t){return setTimeout(t,50/3)}})(),Se=(function(){if(typeof window<"u"){var r=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame;if(r)return r.bind(window)}return clearTimeout})();function zt(r,t,e){for(var n=0,s=0,i=r.length;s<i-1;)n=s+i>>1,e>=r[n][t]?s=n:i=n;return r[s]&&e<r[s][t]?s:i}function Ft(r){return /^(ltr|top|bottom)$/i.test(r)?r.toLowerCase():"rtl"}function z(){var r=9007199254740991;return [{range:0,time:-r,width:r,height:0},{range:r,time:r,width:0,height:0}]}function Dt(r){r.ltr=z(),r.rtl=z(),r.top=z(),r.bottom=z();}function $(){return typeof window.performance<"u"&&window.performance.now?window.performance.now():Date.now()}function Ce(r){var t=this,e=this.media?this.media.currentTime:$()/1e3,n=this.media?this.media.playbackRate:1;function s(b,g){if(g.mode==="top"||g.mode==="bottom")return e-b.time<t._.duration;var f=t._.width+b.width,_=f*(e-b.time)*n/t._.duration;if(b.width>_)return  true;var S=t._.duration+b.time-e,M=t._.width+g.width,R=t.media?g.time:g._utc,ct=M*(e-R)*n/t._.duration,Gt=t._.width-ct,Kt=t._.duration*Gt/(t._.width+g.width);return S>Kt}for(var i=this._.space[r.mode],o=0,a=0,l=1;l<i.length;l++){var d=i[l],c=r.height;if((r.mode==="top"||r.mode==="bottom")&&(c+=d.height),d.range-d.height-i[o].range>=c){a=l;break}s(d,r)&&(o=l);}var h=i[o].range,p={range:h+r.height,time:this.media?r.time:r._utc,width:r.width,height:r.height};return i.splice(o+1,a-o-1,p),r.mode==="bottom"?this._.height-r.height-h%this._.height:h%(this._.height-r.height)}function Ee(r,t,e,n){return function(s){r(this._.stage);var i=s||$(),o=i/1e3,a=this.media?this.media.currentTime:o,l=this.media?this.media.playbackRate:1,d=null,c=0,h=0;for(h=this._.runningList.length-1;h>=0;h--)d=this._.runningList[h],c=this.media?d.time:d._utc,a-c>this._.duration&&(n(this._.stage,d),this._.runningList.splice(h,1));for(var p=[];this._.position<this.comments.length&&(d=this.comments[this._.position],c=this.media?d.time:d._utc,!(c>=a));){if(a-c>this._.duration){++this._.position;continue}this.media&&(d._utc=o-(this.media.currentTime-d.time)),p.push(d),++this._.position;}for(t(this._.stage,p),h=0;h<p.length;h++)d=p[h],d.y=Ce.call(this,d),this._.runningList.push(d);for(h=0;h<this._.runningList.length;h++){d=this._.runningList[h];var b=this._.width+d.width,g=b*(o-d._utc)*l/this._.duration;d.mode==="ltr"&&(d.x=g-d.width),d.mode==="rtl"&&(d.x=this._.width-g),(d.mode==="top"||d.mode==="bottom")&&(d.x=this._.width-d.width>>1),e(this._.stage,d);}}}function it(){if(!this._.visible||!this._.paused)return this;if(this._.paused=false,this.media)for(var r=0;r<this._.runningList.length;r++){var t=this._.runningList[r];t._utc=$()/1e3-(this.media.currentTime-t.time);}var e=this,n=Ee(this._.engine.framing.bind(this),this._.engine.setup.bind(this),this._.engine.render.bind(this),this._.engine.remove.bind(this));function s(i){n.call(e,i),e._.requestID=ft(s);}return this._.requestID=ft(s),this}function st(){return !this._.visible||this._.paused?this:(this._.paused=true,Se(this._.requestID),this._.requestID=0,this)}function ot(){if(!this.media)return this;this.clear(),Dt(this._.space);var r=zt(this.comments,"time",this.media.currentTime);return this._.position=Math.max(0,r-1),this}function ke(r){r.play=it.bind(this),r.pause=st.bind(this),r.seeking=ot.bind(this),this.media.addEventListener("play",r.play),this.media.addEventListener("pause",r.pause),this.media.addEventListener("playing",r.play),this.media.addEventListener("waiting",r.pause),this.media.addEventListener("seeking",r.seeking);}function Ae(r){this.media.removeEventListener("play",r.play),this.media.removeEventListener("pause",r.pause),this.media.removeEventListener("playing",r.play),this.media.removeEventListener("waiting",r.pause),this.media.removeEventListener("seeking",r.seeking),r.play=null,r.pause=null,r.seeking=null;}function Ie(r){this._={},this.container=r.container||document.createElement("div"),this.media=r.media,this._.visible=true,this.engine=(r.engine||"DOM").toLowerCase(),this._.engine=this.engine==="canvas"?_e:ue,this._.requestID=0,this._.speed=Math.max(0,r.speed)||144,this._.duration=4,this.comments=r.comments||[],this.comments.sort(function(e,n){return e.time-n.time});for(var t=0;t<this.comments.length;t++)this.comments[t].mode=Ft(this.comments[t].mode);return this._.runningList=[],this._.position=0,this._.paused=true,this.media&&(this._.listener={},ke.call(this,this._.listener)),this._.stage=this._.engine.init(this.container),this._.stage.style.cssText+="position:relative;pointer-events:none;",this.resize(),this.container.appendChild(this._.stage),this._.space={},Dt(this._.space),(!this.media||!this.media.paused)&&(ot.call(this),it.call(this)),this}function Le(){if(!this.container)return this;st.call(this),this.clear(),this.container.removeChild(this._.stage),this.media&&Ae.call(this,this._.listener);for(var r in this)Object.prototype.hasOwnProperty.call(this,r)&&(this[r]=null);return this}var F=["mode","time","text","render","style"];function Me(r){if(!r||Object.prototype.toString.call(r)!=="[object Object]")return this;for(var t={},e=0;e<F.length;e++)r[F[e]]!==void 0&&(t[F[e]]=r[F[e]]);if(t.text=(t.text||"").toString(),t.mode=Ft(t.mode),t._utc=$()/1e3,this.media){var n=0;t.time===void 0?(t.time=this.media.currentTime,n=this._.position):(n=zt(this.comments,"time",t.time),n<this._.position&&(this._.position+=1)),this.comments.splice(n,0,t);}else this.comments.push(t);return this}function Ve(){return this._.visible?this:(this._.visible=true,this.media&&this.media.paused?this:(ot.call(this),it.call(this),this))}function Te(){return this._.visible?(st.call(this),this.clear(),this._.visible=false,this):this}function Re(){return this._.engine.clear(this._.stage,this._.runningList),this._.runningList=[],this}function ze(){return this._.width=this.container.offsetWidth,this._.height=this.container.offsetHeight,this._.engine.resize(this._.stage,this._.width,this._.height),this._.duration=this._.width/this._.speed,this}var Fe={get:function(){return this._.speed},set:function(r){return typeof r!="number"||isNaN(r)||!isFinite(r)||r<=0?this._.speed:(this._.speed=r,this._.width&&(this._.duration=this._.width/r),r)}};function A(r){r&&Ie.call(this,r);}A.prototype.destroy=function(){return Le.call(this)};A.prototype.emit=function(r){return Me.call(this,r)};A.prototype.show=function(){return Ve.call(this)};A.prototype.hide=function(){return Te.call(this)};A.prototype.clear=function(){return Re.call(this)};A.prototype.resize=function(){return ze.call(this)};Object.defineProperty(A.prototype,"speed",Fe);const O=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(r){return setTimeout(r,50/3)},X=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||clearTimeout;function Nt(r,t,e){let n=0,s=0,i=r.length;for(;s<i-1;)n=s+i>>1,e>=r[n][t]?s=n:i=n;return r[s]&&e<r[s][t]?s:i}function bt(r){return [...r||[]].sort((t,e)=>t.time-e.time).map(t=>{var e;return {...t,mode:(e=t.mode)!=null?e:"rtl"}})}function D(){return [{range:0,time:-9007199254740991,width:9007199254740991,height:0,_:{currentTime:-9007199254740991,maxLength:0,duration:-1}},{range:9007199254740991,time:9007199254740991,width:0,height:0,_:{currentTime:9007199254740991,maxLength:0,duration:-1}}]}function Ot(r){return r.ltr=D(),r.rtl=D(),r.top=D(),r.bottom=D(),r}function De(r){const t={};for(const e in r)if(Object.hasOwnProperty.call(r,e)){const n=r[e];typeof n=="function"?t[e]=n.bind(this):t[e]=n;}return t}function J(r,t,e){return Math.min(e,Math.max(r,t))}function Ne(r){const t=document.createElement("div");if(t.style.cssText="position:absolute;",typeof r.render=="function"){const e=r.render();if(e instanceof HTMLElement)return t.appendChild(e),t}return (r.mode==="top"||r.mode==="bottom")&&(t.style.left="50%",t.style.transform="translateX(-50%)"),t.style.willChange="transform, opacity",t.className="danmaku",t.textContent=r.text||"",r.style&&Object.assign(t.style,r.style),t}function Oe(){const r=document.createElement("div");return r.classList.add("danmaku-stage"),r.style.cssText="overflow:hidden;white-space:nowrap;transform:translateZ(0);position:relative;pointer-events:none;",r}function $e(r){let t=r.lastChild;for(;t;)r.removeChild(t),t=r.lastChild;}function He(r){r.style.width=r.width+"px",r.style.height=r.height+"px";}function Pe(r,t){const e=document.createDocumentFragment(),n=t.reduce((i,o)=>{let a=false;if(this._.merge){const l=[...this._.runningList,...i].find(d=>o.render?false:d.text===o.text&&d.mode===o.mode);l&&(a=true,l.node.dataset.count=parseInt(l.node.dataset.count||"1")+1+"",l.node.textContent=`(${l.node.dataset.count})${l.text}`);}if(!a){const l=Ne(o);e.appendChild(l),i.push({...o,node:l});}return i},[]);n.length&&r.appendChild(e);const s=this._.currentTime;return n.forEach(i=>{if(i.width=i.width||i.node.offsetWidth,i.height=i.height||i.node.offsetHeight,i.mode==="top"||i.mode==="bottom"){const o=J(4,this._.duration,9);i._={duration:o-(s-i.time),fullDuration:o};}else if(i.mode==="rtl"||i.mode==="ltr"){const o=this._.duration,a=i.mode==="rtl",l=i.width+r.width,d=(s-i.time)/o*l,c=a?r.width-d:d-i.width,h=a?-i.width:r.width;a?i.node.style.left=c+"px":i.node.style.right=h-d+"px",i._={duration:o-(s-i.time),fullDuration:this._.duration,end:h-c,currentTime:s,leftWidth:Math.abs(l-d),fullWidth:l};}}),n}function qe({cmt:r,playbackRate:t}){if(r.mode==="rtl"||r.mode==="ltr"){r.node.style.top=r.y+"px",r.node.style.transform="translateX(0)";const e=O(()=>{r.node.style.transform=`translateX(${r._.end}px)`,r.node.style.transition=`transform ${r._.duration/t}s linear`,this._.rafIds.delete(e);});this._.rafIds.add(e);}else r.mode==="top"?r.node.style.top=r.y+"px":r.mode==="bottom"&&(r.node.style.bottom=r.y+"px");}function We(r,t){r.removeChild(t.node);}function Be({comments:r,currentTime:t}){r.forEach(e=>{if(e.mode==="rtl"||e.mode==="ltr"){const n=e.mode==="rtl",s=(t-e._.currentTime)/e._.duration*e._.leftWidth;e.node.style.transition="",e.node.style.transform=`translateX(${n?"-":""}${s}px)`,e.node.style.animationPlayState="paused";}});}function Ue({comments:r,playbackRate:t,currentTime:e}){r.forEach(n=>{(n.mode==="rtl"||n.mode==="ltr")&&(n.node.style.animationPlayState="",n.node.style.transform=`translateX(${n._.end}px)`,n.node.style.transition=`transform ${(n._.duration-(e-n._.currentTime))/t}s linear`);});}var je={name:"dom",init:Oe,clear:$e,resize:He,setup:Pe,render:qe,remove:We,pause:Be,play:Ue};function Ge(r){const t=this._.currentTime,e=(d,c)=>{if(c.mode==="top"||c.mode==="bottom")return t-d.time<c._.fullDuration;const h=(t-d.time)/d._.fullDuration*d._.fullWidth;if(d.width>h)return  true;const p=d.width,b=d._.fullDuration-(t-d.time),g=d._.fullWidth*b/d._.fullDuration-d.width,f=d._.fullWidth/d._.fullDuration,_=c._.fullDuration-(t-c.time),S=c._.fullWidth*_/c._.fullDuration-c.width,M=c._.fullWidth/c._.fullDuration;return S>g+p?M>f?b>(S-(g+p))/(M-f):false:true},n=this._.space[r.mode];let s=0,i=0;for(let d=1;d<n.length;d++){const c=n[d];let h=r.height;if((r.mode==="top"||r.mode==="bottom")&&(h+=c.height),c.range-c.height-n[s].range>=h){i=d;break}e(c,r)&&(s=d);}const o=n[s].range,a={range:o+r.height,time:r.time,text:r.text,width:r.width,height:r.height,_:r._};let l=this._.stage.height-r.height;return (r.mode==="ltr"||r.mode==="rtl"||r.mode==="top")&&(l=l*this._.scrollAreaPercent),!this._.overlap&&o>l?null:(n.splice(s+1,i-s-1,a),this._.overlap?o%l:o)}function Ke(r,t,e){return function(){const n=this._.currentTime,s=this.media?this.media.playbackRate:1;for(let a=this._.runningList.length-1;a>=0;a--){const l=this._.runningList[a],d=l.time;n-d>l._.fullDuration&&(e(this._.stage,l),this._.runningList.splice(a,1));}const i=[];for(;this._.position<this.comments.length;){const a=this.comments[this._.position],l=a.time;if(l>=n)break;if(n-l>this._.duration){++this._.position;continue}i.push(a),++this._.position;}r(this._.stage,i).forEach(a=>{const l=Ge.call(this,a);if(l===null){e(this._.stage,a);return}a.y=l,t({cmt:a,playbackRate:s}),this._.runningList.push(a);});}}function Q(){if(!this._.visible||!this._.paused)return this;this.media&&this._.paused&&(this._.paused=false,this.refresh()),this._.paused=false;const r=Ke(this._.engine.setup,this._.engine.render,this._.engine.remove).bind(this),t=()=>{r(),this._.requestID=O(t);};return this._.requestID=O(t),this}function tt(){return !this._.visible||this._.paused?this:(this._.paused=true,X(this._.requestID),this._.requestID=0,this._.rafIds.forEach(X),this._.rafIds.clear(),this._.engine.pause({stage:this._.stage,comments:this._.runningList,currentTime:this._.currentTime}),this)}function I(){if(!this.media)return this;this.clear(),Ot(this._.space);const r=Nt(this.comments,"time",this._.currentTime-this._.duration);return this._.position=Math.max(0,r-1),this}function Ye(){if(this.media)return this.refresh(),this}function Ze(r){r.play=Q.bind(this),r.pause=tt.bind(this),r.seeking=I.bind(this),r.ratechange=Ye.bind(this),this.media.addEventListener("play",r.play),this.media.addEventListener("pause",r.pause),this.media.addEventListener("playing",r.play),this.media.addEventListener("waiting",r.pause),this.media.addEventListener("seeking",r.seeking),this.media.addEventListener("ratechange",r.ratechange);}function Xe(r){this.media.removeEventListener("play",r.play),this.media.removeEventListener("pause",r.pause),this.media.removeEventListener("playing",r.play),this.media.removeEventListener("waiting",r.pause),this.media.removeEventListener("seeking",r.seeking),this.media.removeEventListener("ratechange",r.ratechange),r.play=null,r.pause=null,r.seeking=null,r.ratechange=null;}class Je{constructor(t){var e,n,s;if(!t.container)throw new Error("container required");this._={visible:true,requestID:0,duration:4,engine:De.call(this,je),rafIds:new Set,runningList:[],position:0,paused:true,opacity:(e=t.opacity)!=null?e:1,overlap:(n=t.overlap)!=null?n:false,merge:(s=t.merge)!=null?s:false,scrollAreaPercent:J(.25,t.scrollAreaPercent||1,1),speed:t.speed?Math.max(0,t.speed):144},this.container=t.container,this.media=t.media,this.comments=bt(t.comments),Object.defineProperty(this._,"currentTime",{get:()=>this.media?this.media.currentTime:Date.now()/1e3}),this.media&&(this._.listener={},Ze.call(this,this._.listener)),this._.stage=this._.engine.init(this.container),this._.stage.style.opacity=this._.opacity+"",this.resize(),this.container.appendChild(this._.stage),this._.space=Ot({}),(!this.media||!this.media.paused)&&(I.call(this),Q.call(this));}get scrollAreaPercent(){return this._.scrollAreaPercent}set scrollAreaPercent(t){this._.scrollAreaPercent=J(.25,t||1,1),I.call(this);}get overlap(){return this._.overlap}set overlap(t){this._.overlap=t,I.call(this);}get merge(){return this._.merge}set merge(t){this._.merge=t,I.call(this);}get stage(){return this._.stage}get speed(){return this._.speed}set speed(t){typeof t!="number"||isNaN(t)||!isFinite(t)||t<=0||(this._.speed=t,this._.stage.width&&(this._.duration=this._.stage.width/t),this.refresh());}get opacity(){return this._.opacity}set opacity(t){typeof t!="number"||isNaN(t)||(t=Math.min(Math.max(t,0),1),this._.opacity=t,this._.stage.style.opacity=t+"");}show(){return this._.visible?this:(this._.visible=true,this.media&&this.media.paused?this:(I.call(this),Q.call(this),this))}resize(){return this._.stage.width=this.container.offsetWidth,this._.stage.height=this.container.offsetHeight,this._.engine.resize(this._.stage),this._.duration=this._.stage.width/this._.speed,this.refresh(),this}reload(t){return this.clear(),this.comments=bt(t),I.call(this),this}refresh(){return !this._.visible||this._.paused?this:(this._.engine.pause({stage:this._.stage,comments:this._.runningList,currentTime:this._.currentTime}),this._.rafIds.forEach(X),this._.rafIds.clear(),O(()=>{this._.engine.play({stage:this._.stage,comments:this._.runningList,playbackRate:this.media?this.media.playbackRate:1,currentTime:this._.currentTime,duration:this._.duration,rafIds:this._.rafIds});}),this)}hide(){return this._.visible?(tt.call(this),this.clear(),this._.visible=false,this):this}emit(t){const e=Object.assign({mode:"rtl",time:0},t);if(this.media){let n=0;e.time===void 0?(e.time=this.media.currentTime,n=this._.position):(n=Nt(this.comments,"time",e.time),n<this._.position&&(this._.position+=1)),this.comments.splice(n,0,e);}else e.time=Date.now()/1e3,this.comments.push(e);return this}destroy(){var t;return tt.call(this),this.clear(),(t=this._.stage.parentElement)==null||t.removeChild(this._.stage),this.media&&Xe.call(this,this._.listener),this}clear(){return this._.engine.clear(this._.stage,this._.runningList),this._.runningList=[],this}}const y=k("dAnime:CommentRenderer"),N=r=>r*1e3,Qe="bold",tn="'MS PGothic', 'sans-serif'",yt=24,en="1px 1px 2px #000, -1px -1px 2px #000, 1px -1px 2px #000, -1px 1px 2px #000",vt=2e3,xt=16,G=4,nn=18,rn=60,wt=1.2,_t=["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"],St=()=>{const r=document;return r.fullscreenElement??r.webkitFullscreenElement??r.mozFullScreenElement??r.msFullscreenElement??null};class $t{_settings;danmaku=null;allComments=[];lastEmittedIndex=-1;canvas=null;videoElement=null;currentTime=0;duration=0;finalPhaseActive=false;keyboardHandler=null;sizeObserver=null;isResizeObserverAvailable;container=null;resizeRetryHandle=null;fullscreenEventsAttached=false;scrollListenerAttached=false;watchdogCleanup=null;cachedFontSizePx=yt;isFirefox(){return /firefox/i.test(navigator.userAgent)}resolveDanmakuConstructor(){return this.isFirefox()?Je:A}waitVideoReady(t,e){const n=()=>t.readyState>=1&&(t.videoWidth??0)>0&&(t.videoHeight??0)>0;if(n()){e();return}const s=()=>{n()&&(t.removeEventListener("loadedmetadata",s),e());};t.addEventListener("loadedmetadata",s,{once:true});}constructor(t){this._settings=t?{...t}:C(),this.isResizeObserverAvailable=typeof ResizeObserver<"u";}get settings(){return this._settings}set settings(t){this._settings={...t};}initialize(t){try{y.debug("initialize:start",{readyState:t.readyState,duration:t.duration}),this.danmaku&&this.destroy(),this.videoElement=t,this.duration=N(t.duration),y.info("videoRenderer:boundVideo",{src:this.resolveVideoSource(t),videoId:t.dataset?.videoId??null,durationMs:this.duration});const e=document.createElement("div");e.style.position="absolute",e.style.pointerEvents="none",e.style.zIndex="1000",e.style.top="0px",e.style.left="0px";const n=t.getBoundingClientRect();e.style.width=`${n.width}px`,e.style.height=`${n.height}px`;const s=t.parentElement??document.body;s.style.position=s.style.position||"relative",s.appendChild(e),this.container=e;const i=()=>{const o=n.width/G,a=this.isFirefox(),l=this.resolveDanmakuConstructor(),d=a?"dom":"canvas";y.info("danmakuEngine:selected",{engineMode:d,library:a?"@ironkinoko/danmaku":"danmaku"}),this.danmaku=new l({container:e,media:t,comments:[],engine:d,speed:o}),this.bindDanmakuWatchdog(t),this.canvas=e.querySelector("canvas");const c=this.danmaku;let h=5;const p=setInterval(()=>{try{const b=c?._?.requestID??0,g=!!c?._?.paused;!t.paused&&(b===0||g)&&(c?.resize?.(),c?.play?.());}catch{}--h<=0&&clearInterval(p);},1e3);};t.readyState<1||(t.videoWidth??0)===0||(t.videoHeight??0)===0?this.waitVideoReady(t,i):i(),this.setupVideoEventListeners(t),this.setupKeyboardShortcuts(),this.setupResizeListener(e),y.debug("initialize:completed");}catch(e){throw y.error("CommentRenderer.initialize",e),e}}addComment(t,e,n){if(this.isNGComment(t)||this.allComments.some(o=>o.text===t&&o.time===e/1e3))return null;const i={text:t,time:e/1e3,style:this.createCommentStyle(),commands:n?[...n]:void 0};return this.allComments.push(i),this.allComments.sort((o,a)=>o.time-a.time),i}clearComments(){this.allComments=[],this.lastEmittedIndex=-1,this.finalPhaseActive=false,this.danmaku?.clear();}resetState(){this.clearComments(),this.currentTime=0,this.finalPhaseActive=false;}destroy(){const t=this.videoElement;t&&y.info("videoRenderer:unbindVideo",{src:this.resolveVideoSource(t),videoId:t.dataset?.videoId??null}),this.watchdogCleanup?.(),this.watchdogCleanup=null,this.keyboardHandler?.stopListening(),this.keyboardHandler=null,this.teardownResizeListener(),this.danmaku?.destroy(),this.danmaku=null,this.videoElement=null,this.container=null;}bindDanmakuWatchdog(t){this.watchdogCleanup?.();const e=this.danmaku;if(!e)return;const n=()=>!!(e._&&e._.paused),s=()=>e._&&e._.requestID||0,i=()=>{const f=e._&&e._.stage;if(!f)return null;const _=f.getBoundingClientRect();return {w:Math.round(_.width),h:Math.round(_.height)}};let o=i();const a=()=>{try{!t.paused&&n()&&s()===0&&(e.play?.(),y.debug("danmaku:resumed-by-watchdog",{ct:t.currentTime,rs:t.readyState}));}catch(f){y.warn("danmaku:resume-failed",f);}},l=()=>{try{e.seek?.(),y.debug("danmaku:seek-synced",{ct:t.currentTime});}catch(f){y.warn("danmaku:seek-sync-failed",f);}},d=()=>{try{const f=i();f&&o&&(f.w!==o.w||f.h!==o.h)&&(e.resize?.(),y.debug("danmaku:resized",{from:o,to:f})),o=f||o;}catch(f){y.warn("danmaku:resize-failed",f);}},c=()=>{a(),d();},h=()=>{a();},p=()=>{l(),a(),d();},b=()=>{l(),a();},g=()=>{a();};t.addEventListener("timeupdate",c),t.addEventListener("playing",h),t.addEventListener("loadedmetadata",p),t.addEventListener("seeked",b),t.addEventListener("ratechange",g),window.addEventListener("resize",d),document.addEventListener("fullscreenchange",d),this.watchdogCleanup=()=>{t.removeEventListener("timeupdate",c),t.removeEventListener("playing",h),t.removeEventListener("loadedmetadata",p),t.removeEventListener("seeked",b),t.removeEventListener("ratechange",g),window.removeEventListener("resize",d),document.removeEventListener("fullscreenchange",d);};}updateSettings(t){const e=this.settings;this.settings=t,this.danmaku&&this.syncWithDanmaku(e);}getVideoElement(){return this.videoElement}getCurrentVideoSource(){const t=this.videoElement;return t?this.resolveVideoSource(t):null}getCommentsSnapshot(){return this.allComments.map(t=>({...t,style:{...t.style},commands:t.commands?[...t.commands]:void 0}))}isNGComment(t){try{return typeof t!="string"||Array.isArray(this._settings.ngWords)&&this._settings.ngWords.some(e=>typeof e=="string"&&e.length&&t.includes(e))?!0:Array.isArray(this._settings.ngRegexps)?this._settings.ngRegexps.some(e=>{try{return typeof e=="string"&&e.length?new RegExp(e).test(t):!1}catch(n){return y.error("CommentRenderer.isNGComment.regex",n,{pattern:e,text:t}),!1}}):!1}catch(e){return y.error("CommentRenderer.isNGComment",e,{text:t}),true}}updateComments(){const t=this.videoElement;if(!t||!this.danmaku)return;this.currentTime=N(t.currentTime);const e=this.duration>0&&this.duration-this.currentTime<=1e4;e&&!this.finalPhaseActive&&(this.finalPhaseActive=true,this.danmaku.clear()),!e&&this.finalPhaseActive&&(this.finalPhaseActive=false);const n=this.currentTime+2e3;for(let s=this.lastEmittedIndex+1;s<this.allComments.length;s++){const i=this.allComments[s];if(i.time*1e3<n)this.isNGComment(i.text)||this.danmaku.emit({...i,style:this.createCommentStyle(i.style)}),this.lastEmittedIndex=s;else break}}onSeek(){if(!this.videoElement||!this.danmaku)return;this.finalPhaseActive=false,this.currentTime=N(this.videoElement.currentTime),this.danmaku.clear();const t=this.videoElement.currentTime;let e=-1;for(let n=0;n<this.allComments.length;n++)if(this.allComments[n].time>=t){e=n-1;break}this.lastEmittedIndex=e;}lastReportedZeroSize=false;resize(t,e){if(!this.danmaku||!this.container)return;this.resizeRetryHandle&&(cancelAnimationFrame(this.resizeRetryHandle),this.resizeRetryHandle=null);const n=this.videoElement,s=n?.getBoundingClientRect(),i=t??s?.width??this.container.clientWidth,o=e??s?.height??this.container.clientHeight;if(i<=0||o<=0){requestAnimationFrame(()=>this.resize());return}n&&s&&this.updateContainerPlacement(s);const a=window.devicePixelRatio||1;this.canvas&&this.canvas.getContext("2d")?.setTransform(a,0,0,a,0,0),this.container.style.width=`${i}px`,this.container.style.height=`${o}px`,this.danmaku.resize(),this.danmaku.speed=i/G*(this.videoElement?.playbackRate??1);}setupVideoEventListeners(t){try{t.addEventListener("seeking",()=>this.onSeek()),t.addEventListener("ratechange",()=>{if(this.danmaku){const n=(this.container?.clientWidth??0)/G;this.danmaku.speed=n*t.playbackRate;}}),t.addEventListener("timeupdate",()=>this.updateComments()),t.addEventListener("loadedmetadata",()=>{this.resize(),requestAnimationFrame(()=>this.resize());}),t.addEventListener("play",()=>{this.resize();});}catch(e){throw y.error("CommentRenderer.setupVideoEventListeners",e),e}}setupKeyboardShortcuts(){try{this.keyboardHandler=new Rt,this.keyboardHandler.addShortcut("C","Shift",()=>{try{this._settings.isCommentVisible=!this._settings.isCommentVisible,this._settings.isCommentVisible?this.danmaku?.show():this.danmaku?.hide(),window.dAniRenderer?.settingsManager?.updateSettings(this._settings);}catch(t){y.error(t,"CommentRenderer.keyboardShortcut");}}),this.keyboardHandler.startListening();}catch(t){y.error(t,"CommentRenderer.setupKeyboardShortcuts");}}_observedEl;_onFullscreenChange;_lastDpr=1;_handleWindowResize;setupResizeListener(t){try{this.teardownResizeListener(),this.isResizeObserverAvailable?(this.sizeObserver=new ResizeObserver(e=>{try{const n=e.find(s=>s.target===t);if(!n)return;n.contentRect.width<=0||n.contentRect.height<=0?requestAnimationFrame(()=>this.resize()):this.resize(n.contentRect.width,n.contentRect.height);}catch(n){y.error(n,"CommentRenderer.resizeObserver");}}),this.sizeObserver.observe(t)):window.addEventListener("resize",this.handleWindowResize),this.addViewportEventListeners(),this.resize(),requestAnimationFrame(()=>this.resize()),this.resize();}catch(e){y.error(e,"CommentRenderer.setupResizeListener");}}teardownResizeListener(){if(this.sizeObserver){if(this._observedEl)try{this.sizeObserver.unobserve(this._observedEl);}catch{}this.sizeObserver.disconnect(),this.sizeObserver=null;}this.isResizeObserverAvailable||window.removeEventListener("resize",this.handleWindowResize),this._onFullscreenChange&&(document.removeEventListener("fullscreenchange",this._onFullscreenChange),this._onFullscreenChange=void 0),this.removeViewportEventListeners();}forceResizeByRect(t){const e=t.getBoundingClientRect();this.resize(e.width,e.height);}handleWindowResize=()=>{this.resize();};handleWindowScroll=()=>{this.resize();};handleFullscreenChange=()=>{this.resize(),requestAnimationFrame(()=>{this.resize();});};addViewportEventListeners(){this.scrollListenerAttached||(window.addEventListener("scroll",this.handleWindowScroll,{passive:true}),this.scrollListenerAttached=true),this.fullscreenEventsAttached||(_t.forEach(t=>{document.addEventListener(t,this.handleFullscreenChange);}),this.fullscreenEventsAttached=true);}removeViewportEventListeners(){this.scrollListenerAttached&&(window.removeEventListener("scroll",this.handleWindowScroll),this.scrollListenerAttached=false),this.fullscreenEventsAttached&&(_t.forEach(t=>{document.removeEventListener(t,this.handleFullscreenChange);}),this.fullscreenEventsAttached=false);}updateContainerPlacement(t){const e=this.container,n=this.videoElement;if(!e||!n)return;this.syncContainerParent();const s=!!St(),i=e.parentElement;if(i){if(s)e.style.position="fixed",e.style.top=`${t.top}px`,e.style.left=`${t.left}px`;else {const o=i.getBoundingClientRect(),a=t.top-o.top,l=t.left-o.left;e.style.position="absolute",e.style.top=`${a}px`,e.style.left=`${l}px`;}e.style.width=`${t.width}px`,e.style.height=`${t.height}px`,e.style.overflow="hidden";}}syncContainerParent(){const t=this.container,e=this.videoElement;if(!t||!e)return;const n=St(),i=n?.contains(e)??false?n:e.parentElement;if(!i||t.parentElement===i)return;t.remove();const o=i instanceof HTMLElement?i.style:null;o&&!o.position&&(o.position="relative"),i.appendChild(t);}createCommentStyle(t){const e=this.computeFontSizePx(),n=this.composeFontString(t?.font,e),s=Number.isFinite(this._settings.commentOpacity)?Math.max(0,Math.min(1,this._settings.commentOpacity)):1,i=this.resolveStrokeWidth(t?.lineWidth,e);return {font:n,textShadow:t?.textShadow??en,color:this._settings.commentColor,fillStyle:this._settings.commentColor,strokeStyle:t?.strokeStyle??"#000000",lineWidth:i,opacity:s.toString(),globalAlpha:s}}computeFontSizePx(){const t=this.getContainerHeight();if(t<=0)return this.cachedFontSizePx=yt,this.cachedFontSizePx;const e=t/(xt*wt),n=Math.min(rn,Math.max(nn,e)),s=Math.round(n);return this.cachedFontSizePx=s,s}getContainerHeight(){if(this.container){const{height:n}=this.container.getBoundingClientRect();if(Number.isFinite(n)&&n>0)return n}const e=this.videoElement?.getBoundingClientRect()?.height;return Number.isFinite(e)&&e!==void 0&&e>0?e:this.cachedFontSizePx*xt*wt}composeFontString(t,e){if(typeof t=="string"&&t.trim().length>0){const n=/\d+(?:\.\d+)?px/iu;if(n.test(t))return t.replace(n,`${e}px`).trim()}return `${Qe} ${e}px ${tn}`}resolveStrokeWidth(t,e){return Number.isFinite(t)&&t!==void 0?t:Math.max(2,Math.floor(e/12))}applySettingsToComments(){this.allComments=this.allComments.map(t=>({...t,style:this.createCommentStyle(t.style)}));}syncWithDanmaku(t){const e=this.danmaku;if(!e||(this.settings.isCommentVisible?e.show():e.hide(),!(t.commentColor!==this.settings.commentColor||t.commentOpacity!==this.settings.commentOpacity||!this.areNgListsEqual(t,this.settings))))return;this.applySettingsToComments();const s=this.videoElement,i=s?N(s.currentTime):0,o=i-vt;e.clear(),this.allComments.filter(l=>{const d=l.time*1e3;return d>i+vt||d<o?false:!this.isNGComment(l.text)}).forEach(l=>{e.emit({...l,style:this.createCommentStyle(l.style)});});}areNgListsEqual(t,e){const n=t.ngWords??[],s=e.ngWords??[],i=t.ngRegexps??[],o=e.ngRegexps??[];return n.length!==s.length||i.length!==o.length||n.some((d,c)=>d!==s[c])?false:!i.some((d,c)=>d!==o[c])}resolveVideoSource(t){if(typeof t.currentSrc=="string"&&t.currentSrc.length>0)return t.currentSrc;const e=t.getAttribute("src");if(e&&e.length>0)return e;const n=t.querySelector("source[src]");return n&&typeof n.src=="string"&&n.src.length>0?n.src:null}}class at{shadowRoot=null;container=null;createShadowDOM(t,e={mode:"closed"}){if(!t)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=t.attachShadow(e),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(t){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const e=document.createElement("style");e.textContent=t,this.shadowRoot.appendChild(e);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}querySelectorAll(t){return this.shadowRoot?this.shadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}setHTML(t){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=t;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const sn=`\r
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
`,on=`:host {
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
`,an=`:host {
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
`;class T{static getCommonStyles(){return sn}static getNotificationStyles(){return on}static getAutoButtonStyles(){return an}}const Ct={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class m extends at{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new m),this.instance}static show(t,e="info",n=3e3){try{const s=this.getInstance();return s.initialize(),s.initialized?s.createNotification(t,e,n):null}catch(s){return console.error("[NotificationManager] show failed",s),null}}static removeNotification(t){this.getInstance().removeNotification(t.element);}show(t,e="info"){m.show(t,e);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 2147483647","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(T.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(t){console.error("[NotificationManager] initialize failed",t),this.initialized=false;}}destroy(){m.notifications.forEach(t=>{t.timerId&&window.clearTimeout(t.timerId);}),m.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,m.instance=null;}createNotification(t,e,n){try{const s=this.querySelector(".notification-container");if(!s)throw new Error("Notification container not found");const i=Ct[e]??Ct.info,o=document.createElement("div");o.className=`notification-item ${e}`;const a=document.createElement("div");a.className="notification-icon",a.innerHTML=`<span>${i}</span>`,o.appendChild(a);const l=document.createElement("div");l.className="notification-content";const d=document.createElement("div");d.className="notification-type",d.textContent=e.charAt(0).toUpperCase()+e.slice(1),l.appendChild(d);const c=document.createElement("div");c.className="notification-message",c.textContent=t||"No message",l.appendChild(c),o.appendChild(l);const h=document.createElement("button");h.className="notification-close",h.innerHTML="&times;",h.addEventListener("click",()=>{this.removeNotification(o);}),o.appendChild(h),s.appendChild(o),requestAnimationFrame(()=>{o.classList.add("show");});const p={element:o,timerId:window.setTimeout(()=>{this.removeNotification(o);},n)};return m.notifications.push(p),p}catch(s){return console.error("[NotificationManager] createNotification failed",s),null}}removeNotification(t){if(!t)return;const e=m.notifications.find(n=>n.element===t);e?.timerId&&window.clearTimeout(e.timerId),t.classList.remove("show"),window.setTimeout(()=>{try{t.remove(),m.notifications=m.notifications.filter(n=>n.element!==t);}catch(n){console.error("[NotificationManager] removeNotification cleanup failed",n);}},500);}}const Ht="https://www.nicovideo.jp",Pt=`${Ht}/search`,qt=`${Ht}/watch`,Et={searchBase:Pt,watchBase:qt},ln=r=>`${qt}/${r}`,Wt=r=>`${Pt}/${encodeURIComponent(r)}`,et=r=>new Promise((t,e)=>{Jt({url:r.url,method:r.method??"GET",headers:r.headers,data:r.data,responseType:r.responseType??"text",timeout:r.timeout,onprogress:r.onprogress,onload:n=>{t({status:n.status,statusText:n.statusText,response:n.response,finalUrl:n.finalUrl,headers:n.responseHeaders});},onerror:n=>{const s=n?.error??"unknown error";e(new Error(`GM_xmlhttpRequest failed: ${s}`));},ontimeout:()=>{e(new Error("GM_xmlhttpRequest timeout"));}});}),K=k("dAnime:NicoApiFetcher");class lt{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(t){try{const e=this.sanitizeVideoId(t),s=(await et({method:"GET",url:ln(e),headers:{Accept:"text/html"}})).response,a=new DOMParser().parseFromString(s,"text/html").querySelector('meta[name="server-response"]');if(!a)throw new Error("API data element not found in response");const l=a.getAttribute("content");if(!l)throw new Error("API data content is empty");const d=this.decodeServerResponse(l),h=JSON.parse(d).data?.response;if(!h)throw new Error("Invalid API data structure");return this.apiData=h,h}catch(e){throw K.error("NicoApiFetcher.fetchApiData",e),e}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const t=this.apiData.comment?.nvComment;if(!t?.server||!t.params||!t.threadKey)throw new Error("Required comment server data is missing");const e=await et({method:"POST",url:`${t.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:t.params,threadKey:t.threadKey,additionals:{}})}),i=(JSON.parse(e.response).data?.threads??[]).filter(a=>a.fork==="main").sort((a,l)=>(l.commentCount||0)-(a.commentCount||0))[0];if(!i)throw new Error("Main thread not found in comment response");const o=(i.comments??[]).map(a=>({text:a.body??"",vpos:a.vposMs??0,commands:a.commands??[]}));return this.comments=o,o}catch(t){throw K.error("NicoApiFetcher.fetchComments",t),t}}async fetchAllData(t){return await this.fetchApiData(t),this.fetchComments()}sanitizeVideoId(t){try{let e=encodeURIComponent(t);return e=e.replace(/%([0-9A-F]{2})/gi,(n,s)=>{const i=parseInt(s,16);return i>=65&&i<=90||i>=97&&i<=122||i>=48&&i<=57||i===45||i===95||i===46||i===126?String.fromCharCode(i):n}),e}catch(e){return K.error("NicoApiFetcher.sanitizeVideoId",e,{videoId:t}),t}}decodeServerResponse(t){try{return decodeURIComponent(t)}catch(e){try{const n=t.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(n)}catch{throw new Error(`API data decode failed: ${e.message}`)}}}}const kt=k("dAnime:NicoVideoSearcher");class Bt{cache=new Map;async search(t){if(!t.trim())return [];if(this.cache.has(t))return this.cache.get(t)??[];const e=Wt(t),n=await this.fetchText(e),s=this.parseServerContext(n).map(a=>{const l=this.calculateLevenshteinDistance(t,a.title),d=Math.max(t.length,a.title.length),c=d>0?(1-l/d)*100:0;return {...a,levenshteinDistance:l,similarity:c}}),i=[],o=new Set;for(const a of s)a?.videoId&&(o.has(a.videoId)||(o.add(a.videoId),i.push(a)));return i.sort((a,l)=>{const d=a.similarity??-1,c=l.similarity??-1;return d!==c?c-d:l.viewCount-a.viewCount}),this.cache.set(t,i),i}async fetchText(t){return (await et({method:"GET",url:t})).response}parseServerContext(t){try{const n=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!n)return [];const s=n.getAttribute("content")??"",i=this.decodeHtmlEntities(s);let o;try{o=JSON.parse(i);}catch(a){return kt.error("NicoVideoSearcher.parseServerContext",a),[]}return this.extractVideoItems(o??{})}catch(e){return kt.error("NicoVideoSearcher.parseServerContext",e),[]}}decodeHtmlEntities(t){if(!t)return "";let e=t.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return e=e.replace(/&#(\d+);/g,(n,s)=>String.fromCharCode(parseInt(s,10))),e=e.replace(/&#x([0-9a-fA-F]+);/g,(n,s)=>String.fromCharCode(parseInt(s,16))),e}extractVideoItems(t){const e=[],n=i=>{const o=(i?.id??i?.contentId??i?.watchId??"").toString();if(!o)return;const a=(i?.title??i?.shortTitle??"").toString(),l=i?.count??{},d=Number(l.view??i?.viewCounter??0)||0,c=Number(l.comment??i?.commentCounter??0)||0,h=Number(l.mylist??i?.mylistCounter??0)||0,p=i?.thumbnail??{},b=(p.nHdUrl||p.listingUrl||p.largeUrl||p.middleUrl||p.url||i?.thumbnailUrl||"").toString(),g=(i?.registeredAt||i?.startTime||i?.postedDateTime||"")?.toString?.()??"",f=i?.owner&&typeof i.owner=="object"?{nickname:(i.owner.nickname??i.owner.name??"")||void 0,name:(i.owner.name??i.owner.nickname??"")||void 0}:null,_=(i?.isChannelVideo||i?.owner?.ownerType==="channel")&&i?.owner?{name:i.owner.name??""}:null;a&&e.push({videoId:o,title:a,viewCount:d,commentCount:c,mylistCount:h,thumbnail:b,postedAt:g,owner:f,channel:_});},s=i=>{if(!i)return;if(Array.isArray(i)){i.forEach(s);return}if(typeof i!="object"||i===null)return;const o=i;(o.id||o.contentId||o.watchId)&&n(o),Object.values(i).forEach(s);};return s(t),e}calculateLevenshteinDistance(t,e){const n=t?t.length:0,s=e?e.length:0;if(n===0)return s;if(s===0)return n;const i=new Array(s+1);for(let a=0;a<=s;++a){const l=i[a]=new Array(n+1);l[0]=a;}const o=i[0];for(let a=1;a<=n;++a)o[a]=a;for(let a=1;a<=s;++a)for(let l=1;l<=n;++l){const d=t[l-1]===e[a-1]?0:1;i[a][l]=Math.min(i[a-1][l]+1,i[a][l-1]+1,i[a-1][l-1]+d);}return i[s][n]}}const x={mypageHeaderTitle:".p-mypageHeader__title",mypageListContainer:".p-mypageMain",watchVideoElement:"video#video",mypageItem:".itemModule.list",mypageItemTitle:".line1",mypageEpisodeNumber:".number.line1 span",mypageEpisodeTitle:".episode.line1 span"};class dt{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(t){this.delay=t;}getFuncId(t){return this.funcIds.has(t)||this.funcIds.set(t,this.nextId++),this.funcIds.get(t)??0}exec(t){const e=this.getFuncId(t),n=Date.now(),s=this.timers.get(e)?.lastExec??0,i=n-s;if(i>this.delay)t(),this.timers.set(e,{lastExec:n});else {clearTimeout(this.timers.get(e)?.timerId??void 0);const o=setTimeout(()=>{t(),this.timers.set(e,{lastExec:Date.now()});},this.delay-i);this.timers.set(e,{timerId:o,lastExec:s});}}execOnce(t){const e=this.getFuncId(t),n=this.timers.get(e);if(n?.executedOnce){n.timerId&&clearTimeout(n.timerId);return}n?.timerId&&clearTimeout(n.timerId);const s=setTimeout(()=>{try{t();}finally{this.timers.set(e,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(e,{timerId:s,executedOnce:false,scheduled:true});}cancel(t){const e=this.getFuncId(t),n=this.timers.get(e);n?.timerId&&clearTimeout(n.timerId),this.timers.delete(e);}resetExecution(t){const e=this.getFuncId(t),n=this.timers.get(e);n&&(n.timerId&&clearTimeout(n.timerId),this.timers.set(e,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,t]of this.timers)t.timerId&&clearTimeout(t.timerId);this.timers.clear(),this.funcIds.clear();}}const dn=1e3,cn=100,hn=30,At=1e4,It=100,un=/watch\/(?:([a-z]{2}))?(\d+)/gi,v=k("dAnime:VideoSwitchHandler"),Lt=r=>{if(!r?.video)return null;const t=r.video.registeredAt,e=t?new Date(t).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:r.video.id,title:r.video.title,viewCount:r.video.count?.view,mylistCount:r.video.count?.mylist,commentCount:r.video.count?.comment,postedAt:e,thumbnail:r.video.thumbnail?.url,owner:r.owner??null,channel:r.channel??null}},mn=r=>{const t=[];let e;for(;(e=un.exec(r))!==null;){const[,n="",s=""]=e;s&&t.push(`${n}${s}`);}return t};class Ut{constructor(t,e,n,s=dn,i=cn){this.renderer=t,this.fetcher=e,this.settingsManager=n,this.monitorInterval=s,this.debounce=new dt(i);}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=false;debounce;startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(t){if(!this.isSwitching){this.isSwitching=true;try{const e=await this.resolveVideoElement(t)??null,n=this.preloadedComments??this.lastPreloadedComments??null,s=e?.dataset?.videoId??e?.getAttribute?.("data-video-id")??null,i=this.nextVideoId??s??this.lastVideoId;if(!e||!i&&!n){this.handleMissingVideoInfo(n);return}v.info("videoSwitch:start",{videoId:i??null,elementVideoId:e.dataset?.videoId??null,preloadedCount:n?.length??0}),m.show("動画の切り替わりを検知しました...","info"),this.resetRendererState(e);const o=this.renderer.getVideoElement();if(o!==e&&e)v.debug("videoSwitch:rebind",{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof e.currentSrc=="string"&&e.currentSrc.length>0?e.currentSrc:e.getAttribute("src")??null}),this.renderer.initialize(e);else if(o===e&&e&&this.hasVideoSourceChanged(e))v.debug("videoSwitch:rebind:sameElement",{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(e)}),this.renderer.destroy(),this.renderer.initialize(e);else if(!o&&!e){v.warn("videoSwitch:missingVideoElement",{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let a=null;i&&(a=await this.fetchVideoApiData(i,n),a&&(this.persistVideoMetadata(a),this.lastVideoId=i));const l=await this.populateComments(i,n);if(l===0?(this.renderer.clearComments(),m.show("コメントを取得できませんでした","warning"),v.warn("videoSwitch:commentsMissing",{videoId:i??null})):v.info("videoSwitch:commentsLoaded",{videoId:i??null,count:l}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(e),a){const d=Lt(a);if(d){const c=`コメントソースを更新しました: ${d.title??"不明なタイトル"}（${l}件）`;m.show(c,l>0?"success":"warning");}}}catch(e){v.error("videoSwitch:error",e,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),m.show(`動画切り替えエラー: ${e.message}`,"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}}async resolveVideoElement(t){if(t){const s=this.getVideoSource(t),i=this.lastVideoSource;return (!s||s===i)&&await this.waitForSourceChange(t),t}const e=Date.now()+At;let n=null;for(;Date.now()<e;){const s=document.querySelector(x.watchVideoElement);if(s){n=s;const i=this.hasVideoSourceChanged(s);if(s.readyState>=2||!s.paused||i)return i&&(this.lastVideoSource=null),s}await new Promise(i=>window.setTimeout(i,It));}return n}async waitForSourceChange(t){const e=this.getVideoSource(t);if(!e)return;const n=Date.now()+At;for(;Date.now()<n;){const s=this.getVideoSource(t);if(s&&s!==e){this.lastVideoSource=null;return}await new Promise(i=>window.setTimeout(i,It));}}hasVideoSourceChanged(t){const e=this.getVideoSource(t);return e?this.lastVideoSource?this.lastVideoSource!==e:true:false}getVideoSource(t){if(!t)return null;const e=typeof t.currentSrc=="string"?t.currentSrc:"";if(e.length>0)return e;const n=t.getAttribute("src")??"";if(n.length>0)return n;const s=t.querySelector("source[src]");return s&&typeof s.src=="string"&&s.src.length>0?s.src:null}resetRendererState(t){try{t.currentTime=0;}catch(e){v.debug("videoSwitch:resetCurrentTimeFailed",e);}this.renderer.clearComments();}async checkVideoEnd(){const t=this.renderer.getVideoElement();if(!(!t||!Number.isFinite(t.duration)||t.duration-t.currentTime>hn)){if(!this.nextVideoId){const n=async()=>{await this.findNextVideoId();};this.debounce.execOnce(n);}if(this.nextVideoId&&!this.preloadedComments){const n=async()=>{await this.preloadComments();};this.debounce.execOnce(n);}}}handleMissingVideoInfo(t){t||(this.renderer.clearComments(),m.show("次の動画のコメントを取得できませんでした。コメント表示をクリアします。","warning"));}async fetchVideoApiData(t,e){try{const n=await this.fetcher.fetchApiData(t);return v.debug("videoSwitch:apiFetched",{videoId:t}),n}catch(n){if(v.error("videoSwitch:apiFetchError",n,{videoId:t}),!e)throw n;return null}}persistVideoMetadata(t){const e=Lt(t);e&&this.settingsManager.saveVideoData(e.title??"",e);}async populateComments(t,e){let n=null;if(Array.isArray(e)&&e.length>0)n=e;else if(t)try{n=await this.fetcher.fetchAllData(t),v.debug("videoSwitch:commentsFetched",{videoId:t,count:n.length});}catch(i){v.error("videoSwitch:commentsFetchError",i,{videoId:t}),m.show(`コメント取得エラー: ${i.message}`,"error"),n=null;}if(!n||n.length===0)return 0;const s=n.filter(i=>!this.renderer.isNGComment(i.text));return s.forEach(i=>{this.renderer.addComment(i.text,i.vpos,i.commands);}),this.lastPreloadedComments=[...s],s.length}async findNextVideoId(){try{const t=this.fetcher.lastApiData;if(!t)return;const e=t.series?.video?.next?.id;if(e){this.nextVideoId=e,v.debug("videoSwitch:detectedNext",{videoId:e});return}const n=t.video?.description??"";if(!n)return;const s=mn(n);if(s.length===0)return;const i=[...s].sort((o,a)=>{const l=parseInt(o.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(a.replace(/^[a-z]{2}/i,""),10)||0)-l});this.nextVideoId=i[0]??null,this.nextVideoId&&v.debug("videoSwitch:candidateFromDescription",{candidate:this.nextVideoId});}catch(t){v.error("videoSwitch:nextIdError",t,{lastVideoId:this.lastVideoId});}}async preloadComments(){if(this.nextVideoId)try{const e=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(n=>!this.renderer.isNGComment(n.text));this.preloadedComments=e.length>0?e:null,v.debug("videoSwitch:preloaded",{videoId:this.nextVideoId,count:e.length});}catch(t){v.error("videoSwitch:preloadError",t,{videoId:this.nextVideoId}),this.preloadedComments=null;}}}const pn=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class jt{static initialize(){Xt(pn);}}var gn="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z",fn="M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z",bn="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",yn="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z",vn="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z",xn="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z",wn="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",_n="M5,4V7H10.5V19H13.5V7H19V4H5Z",Sn="M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z",Cn="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",En="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",kn="M8,5.14V19.14L19,12.14L8,5.14Z",An="M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z",In="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";function w(r,t=24){const e=String(t),n=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${n}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${r}"></path></svg>`}const Mt=w(kn),Ln=w(bn),Mn=w(En),Vn=w(Cn),Y=w(yn),Tn=w(Sn),Rn=w(_n),zn=w(gn),Fn=w(wn),Dn=w(xn),Nn=w(An),On=w(fn),$n=w(vn),Hn=w(In),L=k("dAnime:SettingsUI"),u={searchInput:"#searchInput",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",opacitySelect:"#commentOpacity",visibilityToggle:"#commentVisibilityToggle",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",colorValue:".color-value",colorPreview:".color-preview",colorPickerInput:"#colorPickerInput",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",playCurrentVideo:"#playCurrentVideo",settingsModal:"#settingsModal",closeSettingsModal:"#closeSettingsModal",modalOverlay:".settings-modal__overlay",modalTabs:".settings-modal__tab",modalPane:".settings-modal__pane"},V=["search","display","ng"],Vt=`
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
`,Pn=`
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
`;class H extends at{static FAB_HOST_ID="danime-settings-fab-host";settingsManager;fetcher;searcher;settings;currentVideoInfo;hostElement=null;lastAutoButtonElement=null;activeTab="search";modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;handleFabClick=t=>{t.preventDefault(),this.openSettingsModal();};handleOverlayClick=()=>{this.closeSettingsModal();};handleCloseClick=()=>{this.closeSettingsModal();};constructor(t,e=new lt,n=new Bt){super(),this.settingsManager=t,this.fetcher=e,this.searcher=n,this.settings=this.settingsManager.getSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData();}insertIntoMypage(){const t=document.querySelector(x.mypageHeaderTitle);t&&(this.hostElement=this.createSettingsUI(),t.parentElement?.insertBefore(this.hostElement,t.nextSibling),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}}));}addAutoCommentButtons(){document.querySelectorAll(x.mypageItem).forEach(e=>{const n=e.querySelector(x.mypageItemTitle);if(!n||n.querySelector(".auto-comment-button-host"))return;const s=n.querySelector("span")?.textContent?.trim()??"",i=e.querySelector(x.mypageEpisodeNumber)?.textContent?.trim()??"",o=e.querySelector(x.mypageEpisodeTitle)?.textContent?.trim()??"",a=document.createElement("div");a.className="nico-comment-shadow-host auto-comment-button-host",a.style.cssText="position:absolute;left:150px;top:3px;margin-left:8px;";const l=a.attachShadow({mode:"closed"}),d=document.createElement("style");d.textContent=T.getAutoButtonStyles(),l.appendChild(d);const c=document.createElement("button");c.className="auto-comment-button",c.innerHTML=Y,c.setAttribute("aria-label","コメント設定"),c.setAttribute("title","コメント設定"),c.setAttribute("type","button"),c.addEventListener("click",async h=>{h.preventDefault(),h.stopPropagation(),h.stopImmediatePropagation();try{const p=[s,i,o].filter(Boolean).join(" ");this.openSettingsModal(!1),this.setSearchKeyword(p),this.lastAutoButtonElement=a;try{const g=e.querySelector('input[name="workId"]')?.value?.trim()??"",f=e.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),_=e.querySelector('a.textContainer[href*="partId="]');let S="";const R=(f?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);R?S=R[1]:_?.href&&(S=(new URL(_.href,location.origin).searchParams.get("partId")??"").trim()),g&&S&&this.settingsManager.saveLastDanimeIds({workId:g,partId:S});}catch(g){console.warn("[SettingsUI] save (workId, partId) skipped:",g);}const b=await this.executeSearch(p);if(b.length===0)return;await this.applySearchResult(b[0]);}catch(p){L.error("SettingsUI.autoCommentButton",p);}}),l.appendChild(c),n.appendChild(a),this.lastAutoButtonElement=a;}),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}});}async waitMypageListStable(){const t=document.querySelector(x.mypageListContainer);if(!t)return;let e=t.querySelectorAll(x.mypageItem).length;const n=Date.now()+1500;return new Promise(s=>{const i=new MutationObserver(()=>{const o=t.querySelectorAll(x.mypageItem).length;if(o!==e){e=o;return}Date.now()>=n&&(i.disconnect(),s());});i.observe(t,{childList:true,subtree:true}),setTimeout(()=>{try{i.disconnect();}catch(o){L.debug("waitMypageListStable: observer already disconnected",o);}s();},1600);})}tryRestoreByDanimeIds(){const t=this.settingsManager.loadLastDanimeIds();if(!t)return  false;const e=Array.from(document.querySelectorAll(x.mypageItem));for(const n of e){if(n.querySelector('input[name="workId"]')?.value?.trim()!==t.workId)continue;const i=n.querySelector('a.textContainer[href*="partId="]'),o=i?.href?(new URL(i.href,location.origin).searchParams.get("partId")??"")===t.partId:false,a=n.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),l=(()=>{const c=(a?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);return !!c&&c[1]===t.partId})();if(o||l){const d=n.querySelector(".auto-comment-button-host")??n;return this.lastAutoButtonElement=d,this.updatePlayButtonState(this.currentVideoInfo),true}}return  false}createSettingsUI(){const t=document.createElement("div");t.className="nico-comment-shadow-host settings-host",this.createShadowDOM(t),this.addStyles(T.getCommonStyles());const e=this.buildSettingsHtml();return this.setHTML(e),this.applySettingsToUI(),this.addStyles(Vt),this.setupEventListeners(),t}buildSettingsHtml(){const t=s=>typeof s=="number"?s.toLocaleString():"-",e=s=>{if(!s)return "-";try{return new Date(s).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return s}},n=this.currentVideoInfo;return `
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="バージョン">${Zt}</span>
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
                <span class="info-icon" aria-hidden="true">${Tn}</span>
                <span class="sr-only">動画ID</span>
                <span class="info-value" id="currentVideoId">${n?.videoId??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="タイトル">
                <span class="info-icon" aria-hidden="true">${Rn}</span>
                <span class="sr-only">タイトル</span>
                <span class="info-value" id="currentTitle">${n?.title??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="投稿者">
                <span class="info-icon" aria-hidden="true">${zn}</span>
                <span class="sr-only">投稿者</span>
                <span class="info-value" id="currentOwner">${n?.owner?.nickname??n?.channel?.name??"-"}</span>
              </div>
              <div class="info-item" role="listitem" title="再生数">
                <span class="info-icon" aria-hidden="true">${Fn}</span>
                <span class="sr-only">再生数</span>
                <span class="info-value" id="currentViewCount">${t(n?.viewCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="コメント数">
                <span class="info-icon" aria-hidden="true">${Dn}</span>
                <span class="sr-only">コメント数</span>
                <span class="info-value" id="currentCommentCount">${t(n?.commentCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="マイリスト数">
                <span class="info-icon" aria-hidden="true">${Nn}</span>
                <span class="sr-only">マイリスト数</span>
                <span class="info-value" id="currentMylistCount">${t(n?.mylistCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="投稿日">
                <span class="info-icon" aria-hidden="true">${On}</span>
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
              <span aria-hidden="true">${Ln}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${Y}</span>
              <span class="settings-modal__tab-label">検索</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="display" role="tab" aria-selected="false" aria-controls="settingsPaneDisplay" id="settingsTabDisplay" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${Mn}</span>
              <span class="settings-modal__tab-label">表示</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${Vn}</span>
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
              <span class="settings-modal__play-icon" aria-hidden="true">${Mt}</span>
              <span class="settings-modal__play-label">動画を再生</span>
            </button>
            <button id="saveSettings" type="button">設定を保存</button>
          </footer>
        </div>
      </div>
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupColorPresets(),this.setupColorPicker(),this.setupOpacitySelect(),this.setupVisibilityToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupPlayButton();}setupModalControls(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick);const t=this.createOrUpdateFab(),e=this.queryModalElement(u.settingsModal),n=this.queryModalElement(u.closeSettingsModal),s=this.queryModalElement(u.modalOverlay);this.modalElement=e??null,this.closeButtonElement=n??null,this.overlayElement=s??null,!(!e||!n||!s||!t)&&(this.fabElement?.removeEventListener("click",this.handleFabClick),t.addEventListener("click",this.handleFabClick),t.setAttribute("aria-controls",e.id),t.setAttribute("aria-haspopup","dialog"),t.setAttribute("aria-expanded","false"),this.fabElement=t,n.addEventListener("click",this.handleCloseClick),s.addEventListener("click",this.handleOverlayClick),this.shadowRoot?.addEventListener("keydown",i=>{const o=i;o.key==="Escape"&&!this.modalElement?.classList.contains("hidden")&&(o.preventDefault(),this.closeSettingsModal());}),this.applySettingsToUI());}setupModalTabs(){const t=Array.from(this.queryModalSelectorAll(u.modalTabs)),e=Array.from(this.queryModalSelectorAll(u.modalPane));if(t.length===0||e.length===0)return;const n=s=>{t.forEach(i=>{const a=this.toModalTabKey(i.dataset.tab)===s;i.classList.toggle("is-active",a),i.setAttribute("aria-selected",String(a)),i.setAttribute("tabindex",a?"0":"-1");}),e.forEach(i=>{const a=this.toModalTabKey(i.dataset.pane)===s;i.classList.toggle("is-active",a),i.setAttribute("aria-hidden",String(!a));}),this.activeTab=s;};t.forEach(s=>{s.addEventListener("click",()=>{const i=this.toModalTabKey(s.dataset.tab);i&&n(i);}),s.addEventListener("keydown",i=>{const o=i;if(o.key!=="ArrowRight"&&o.key!=="ArrowLeft")return;o.preventDefault();const a=this.toModalTabKey(s.dataset.tab);if(!a)return;const l=o.key==="ArrowRight"?1:-1,d=(V.indexOf(a)+l+V.length)%V.length,c=V[d];n(c),t.find(p=>this.toModalTabKey(p.dataset.tab)===c)?.focus({preventScroll:true});});}),n(this.activeTab);}openSettingsModal(t=true){!this.modalElement||!this.fabElement||(this.modalElement.classList.remove("hidden"),this.modalElement.setAttribute("aria-hidden","false"),this.fabElement.setAttribute("aria-expanded","true"),t&&this.queryModalElement(`${u.modalTabs}.is-active`)?.focus({preventScroll:true}));}closeSettingsModal(){!this.modalElement||!this.fabElement||(this.modalElement.classList.add("hidden"),this.modalElement.setAttribute("aria-hidden","true"),this.fabElement.setAttribute("aria-expanded","false"),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:true}));}toModalTabKey(t){return t&&V.includes(t)?t:null}setupColorPresets(){this.queryModalSelectorAll(".color-preset-btn").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.color;if(!n)return;this.settings.commentColor=n;const s=this.queryModalElement(u.colorPreview),i=this.queryModalElement(u.colorValue);s&&(s.style.backgroundColor=n),i&&(i.textContent=n);});});}setupColorPicker(){const t=this.queryModalElement(u.colorPickerInput);t&&t.addEventListener("input",()=>{this.settings.commentColor=t.value;const e=this.queryModalElement(u.colorPreview),n=this.queryModalElement(u.colorValue);e&&(e.style.backgroundColor=t.value),n&&(n.textContent=t.value);});}setupOpacitySelect(){const t=this.queryModalElement(u.opacitySelect);t&&(t.value=this.settings.commentOpacity.toString(),t.addEventListener("change",()=>{const e=Number(t.value);Number.isNaN(e)||(this.settings.commentOpacity=e);}));}setupVisibilityToggle(){const t=this.queryModalElement(u.visibilityToggle);t&&(t.addEventListener("click",()=>{this.settings.isCommentVisible=!this.settings.isCommentVisible,this.updateVisibilityToggleState(t);}),this.updateVisibilityToggleState(t));}setupNgControls(){const t=this.queryModalElement(u.ngWords);t&&t.classList.remove("hidden");const e=this.queryModalElement(u.ngRegexps);e&&e.classList.remove("hidden");}setupSaveButton(){const t=this.queryModalElement(u.saveButton);t&&t.addEventListener("click",()=>this.saveSettings());}setupSearch(){const t=this.queryModalElement(u.searchInput),e=this.queryModalElement(u.searchButton),n=this.queryModalElement(u.openSearchPage),s=async()=>{const i=t?.value.trim();if(!i){m.show("キーワードを入力してください","warning");return}await this.executeSearch(i);};e?.addEventListener("click",s),t?.addEventListener("keydown",i=>{i.key==="Enter"&&s();}),n?.addEventListener("click",i=>{i.preventDefault();const o=t?.value.trim(),a=o?Wt(o):Et.searchBase;nt().open(a,"_blank","noopener");});}async executeSearch(t){try{m.show(`「${t}」を検索中...`,"info");const e=await this.searcher.search(t);return this.renderSearchResults(e,n=>this.renderSearchResultItem(n)),e.length===0&&m.show("検索結果が見つかりませんでした","warning"),e}catch(e){return L.error("SettingsUI.executeSearch",e),[]}}setSearchKeyword(t){const e=this.queryModalElement(u.searchInput);e&&(e.value=t,e.focus({preventScroll:true}));}renderSearchResults(t,e){const n=this.queryModalElement(u.searchResults);if(!n)return;n.innerHTML=t.map(i=>e(i)).join(""),n.querySelectorAll(".search-result-item").forEach((i,o)=>{i.addEventListener("click",()=>{const l=t[o];this.applySearchResult(l);});const a=i.querySelector(".open-search-page-direct-btn");a&&a.addEventListener("click",l=>{l.stopPropagation();});});}renderSearchResultItem(t){const e=this.formatSearchResultDate(t.postedAt),n=typeof t.similarity=="number"?`
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
              ${Mt}
            </span>
            <span>${t.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="コメント">
              ${$n}
            </span>
            <span>${t.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="マイリスト">
              ${Hn}
            </span>
            <span>${t.mylistCount.toLocaleString()}</span>
            ${n}
          </div>
          <div class="date">${e}</div>
          <a href="${Et.watchBase}/${t.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(t){try{const e=await this.fetcher.fetchApiData(t.videoId);await this.fetcher.fetchComments(),m.show(`「${t.title}」のコメントを設定しました`,"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(t,e));}catch(e){L.error("SettingsUI.applySearchResult",e);}}buildVideoMetadata(t,e){return {videoId:t.videoId,title:t.title,viewCount:e.video?.count?.view??t.viewCount,commentCount:e.video?.count?.comment??t.commentCount,mylistCount:e.video?.count?.mylist??t.mylistCount,postedAt:e.video?.registeredAt??t.postedAt,thumbnail:e.video?.thumbnail?.url??t.thumbnail,owner:e.owner??t.owner??void 0,channel:e.channel??t.channel??void 0}}applySettingsToUI(){const t=this.queryModalElement(u.opacitySelect),e=this.queryModalElement(u.visibilityToggle),n=this.queryModalElement(u.colorPreview),s=this.queryModalElement(u.colorValue),i=this.queryModalElement(u.ngWords),o=this.queryModalElement(u.ngRegexps);t&&(t.value=this.settings.commentOpacity.toString()),e&&this.updateVisibilityToggleState(e),n&&(n.style.backgroundColor=this.settings.commentColor),s&&(s.textContent=this.settings.commentColor),i&&(i.value=this.settings.ngWords.join(`
`)),o&&(o.value=this.settings.ngRegexps.join(`
`)),this.updatePlayButtonState(this.currentVideoInfo);}saveSettings(){const t=this.queryModalElement(u.opacitySelect),e=this.queryModalElement(u.ngWords),n=this.queryModalElement(u.ngRegexps);if(t){const s=Number(t.value);Number.isNaN(s)||(this.settings.commentOpacity=s);}e&&(this.settings.ngWords=e.value.split(`
`).map(s=>s.trim()).filter(Boolean)),n&&(this.settings.ngRegexps=n.value.split(`
`).map(s=>s.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings)?m.show("設定を保存しました","success"):m.show("設定の保存に失敗しました","error");}updateCurrentVideoInfo(t){this.currentVideoInfo=t,[["currentTitle",t.title??"-"],["currentVideoId",t.videoId??"-"],["currentOwner",t.owner?.nickname??t.channel?.name??"-"],["currentViewCount",this.formatNumber(t.viewCount)],["currentCommentCount",this.formatNumber(t.commentCount)],["currentMylistCount",this.formatNumber(t.mylistCount)],["currentPostedAt",this.formatSearchResultDate(t.postedAt)]].forEach(([s,i])=>{const o=this.querySelector(u[s]);o&&(o.textContent=i);});const n=this.querySelector(u.currentThumbnail);n&&t.thumbnail&&(n.src=t.thumbnail,n.alt=t.title??"サムネイル");try{this.settingsManager.saveVideoData(t.title??"",t);}catch(s){L.error("SettingsUI.updateCurrentVideoInfo",s);}this.updatePlayButtonState(t);}formatNumber(t){return typeof t=="number"?t.toLocaleString():"-"}formatSearchResultDate(t){if(!t)return "-";const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(e)}setupPlayButton(){const t=this.queryModalElement(u.playCurrentVideo);t&&(t.addEventListener("click",()=>{try{if(!this.currentVideoInfo?.videoId){m.show("再生できる動画が設定されていません","warning");return}const n=this.lastAutoButtonElement?.closest(".itemModule.list");if(this.lastAutoButtonElement){const s=n?.querySelector(".thumbnailContainer > a, .thumbnail-container > a");if(s){m.show(`「${this.currentVideoInfo?.title||"動画"}」を再生します...`,"success"),setTimeout(()=>{s.click();},300);return}}m.show("再生リンクが見つかりませんでした（対象アイテム内に限定して検索済み）","warning");}catch(e){L.error("SettingsUI.playCurrentVideo",e),m.show(`再生エラー: ${e.message}`,"error");}}),this.updatePlayButtonState(this.currentVideoInfo));}updatePlayButtonState(t){const e=this.queryModalElement(u.playCurrentVideo);if(!e)return;const n=!!t?.videoId;e.disabled=!n,e.setAttribute("aria-disabled",(!n).toString());}updateVisibilityToggleState(t){t.textContent=this.settings.isCommentVisible?"表示中":"非表示中",t.classList.toggle("off",!this.settings.isCommentVisible);}destroy(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),super.destroy();}createOrUpdateFab(){if(!document.body)return null;let t=this.fabHostElement;!t||!t.isConnected?(t?.remove(),t=document.createElement("div"),t.id=H.FAB_HOST_ID,t.style.position="fixed",t.style.bottom="32px",t.style.right="32px",t.style.zIndex="2147483646",t.style.display="inline-block",this.fabShadowRoot=t.attachShadow({mode:"open"}),document.body.appendChild(t),this.fabHostElement=t):this.fabShadowRoot||(this.fabShadowRoot=t.shadowRoot??t.attachShadow({mode:"open"}));const e=this.fabShadowRoot;if(!e)return null;let n=e.querySelector("style[data-role='fab-base-style']");n||(n=document.createElement("style"),n.dataset.role="fab-base-style",n.textContent=T.getCommonStyles(),e.appendChild(n));let s=e.querySelector("style[data-role='fab-style']");s||(s=document.createElement("style"),s.dataset.role="fab-style",s.textContent=`
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
      `,e.appendChild(s));let i=e.querySelector("style[data-role='similarity-style']");i||(i=document.createElement("style"),i.dataset.role="similarity-style",i.textContent=Vt,e.appendChild(i));let o=e.querySelector("style[data-role='modal-play-button-style']");o||(o=document.createElement("style"),o.dataset.role="modal-play-button-style",o.textContent=Pn,e.appendChild(o));let a=e.querySelector(".fab-container");a||(a=document.createElement("div"),a.className="fab-container",e.appendChild(a));let l=a.querySelector("button.fab-button");l||(l=document.createElement("button"),l.type="button",l.className="fab-button",a.appendChild(l)),l.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${Y}</span>
      <span class="fab-button__label">設定</span>
    `,l.setAttribute("aria-label","ニコニココメント設定を開く"),l.setAttribute("aria-haspopup","dialog");let d=a.querySelector(u.settingsModal);return d||(a.insertAdjacentHTML("beforeend",this.buildModalHtml()),d=a.querySelector(u.settingsModal)),this.modalElement=d??null,l}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener("click",this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null;}queryModalElement(t){return this.fabShadowRoot?this.fabShadowRoot.querySelector(t):null}queryModalSelectorAll(t){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}}const Tt=async()=>{},qn=()=>{const r=nt();if(!r.dAniRenderer){const t={};r.dAniRenderer={classes:{Comment:te,CommentRenderer:$t,NicoApiFetcher:lt,NotificationManager:m,StyleManager:jt,SettingsUI:H,NicoVideoSearcher:Bt,VideoSwitchHandler:Ut,SettingsManager:rt,KeyboardShortcutHandler:Rt,DebounceExecutor:dt,ShadowDOMComponent:at,ShadowStyleManager:T},instances:t,utils:{initialize:Tt,initializeWithVideo:Tt},debug:{showState:()=>{console.log("Current instances:",t);},showSettings:()=>{const e=t.settingsManager;if(!e){console.log("SettingsManager not initialized");return}console.log("Current settings:",e.getSettings());},showComments:()=>{const e=t.renderer;if(!e){console.log("CommentRenderer not initialized");return}console.log("Current comments:",e.getCommentsSnapshot());}},defaultSettings:C};}return r.dAniRenderer},Wn=100,Bn=1e3,Un=3e3;class jn{constructor(t){this.global=t;}initialized=false;switchDebounce=new dt(Bn);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(t=>{window.addEventListener("load",()=>t(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const t=document.querySelector(x.watchVideoElement);if(!t){window.setTimeout(()=>this.waitForVideoElement(),Wn);return}if(t.readyState===0){t.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(t);},{once:true});return}this.initializeWithVideo(t);}async initializeWithVideo(t){if(!this.initialized){this.initialized=true;try{m.show("コメントローダーを初期化中...");const e=m.getInstance(),n=this.global.settingsManager??new rt(e);this.global.settingsManager=n,this.global.instances.settingsManager=n;const s=n.loadVideoData();if(!s?.videoId)throw new Error("動画データが見つかりません。マイページで設定してください。");const i=new lt;this.global.instances.fetcher=i,await i.fetchApiData(s.videoId);const o=await i.fetchComments(),a=this.mergeSettings(n.loadSettings()),l=new $t(a);l.initialize(t),this.global.instances.renderer=l,this.currentVideoElement=t,n.addObserver(c=>{l.settings=this.mergeSettings(c);}),o.forEach(c=>{l.addComment(c.text,c.vpos,c.commands);});const d=new Ut(l,i,n);d.startMonitoring(),this.global.instances.switchHandler=d,this.setupSwitchHandling(t,d),this.observeVideoElement(),m.show(`コメントの読み込みが完了しました（${o.length}件）`,"success");}catch(e){throw this.initialized=false,m.show(`初期化エラー: ${e.message}`,"error"),e}}}mergeSettings(t){const e=C();return {...e,...t,ngWords:[...t.ngWords??e.ngWords],ngRegexps:[...t.ngRegexps??e.ngRegexps]}}setupSwitchHandling(t,e){this.currentVideoElement=t,this.switchCallback=()=>{const n=Date.now();if(n-this.lastSwitchTimestamp<Un)return;this.lastSwitchTimestamp=n;const s=this.currentVideoElement;e.onVideoSwitch(s);},this.global.utils.initializeWithVideo=async n=>{n&&(this.rebindVideoElement(n),await e.onVideoSwitch(n));},this.currentVideoElement=t;}observeVideoElement(){const t=this.currentVideoElement;t&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{const e=document.querySelector(x.watchVideoElement);!e||e===this.currentVideoElement||this.rebindVideoElement(e);}),this.domMutationObserver.observe(document.body,{childList:true,subtree:true}),this.attachVideoEventListeners(t));}rebindVideoElement(t){this.detachVideoEventListeners(),this.currentVideoElement=t;const e=this.global.instances.renderer,n=this.global.instances.switchHandler;e&&(e.destroy(),e.initialize(t),e.resize()),n&&(n.onVideoSwitch(t),this.setupSwitchHandling(t,n)),this.attachVideoEventListeners(t);}attachVideoEventListeners(t){this.detachVideoEventListeners();const e=()=>{this.switchCallback&&(this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));};t.addEventListener("ended",e),t.addEventListener("loadedmetadata",e),t.addEventListener("emptied",e),this.videoEndedListener=e;}detachVideoEventListeners(){const t=this.currentVideoElement;t&&this.videoEndedListener&&(t.removeEventListener("ended",this.videoEndedListener),t.removeEventListener("loadedmetadata",this.videoEndedListener),t.removeEventListener("emptied",this.videoEndedListener)),this.videoEndedListener=null;}}const Gn=100;class Kn{constructor(t){this.global=t;}initialize(){const t=m.getInstance(),e=this.global.settingsManager??new rt(t);this.global.settingsManager=e,this.global.instances.settingsManager=e;const n=new H(e);this.waitForHeader(n);}waitForHeader(t){if(!document.querySelector(x.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(t),Gn);return}t.insertIntoMypage(),t.addAutoCommentButtons(),this.observeList(t);}observeList(t){const e=document.querySelector(x.mypageListContainer);if(!e)return;new MutationObserver(()=>{try{t.addAutoCommentButtons();}catch(s){console.error("[MypageController] auto comment buttons update failed",s);}}).observe(e,{childList:true,subtree:true});}}class Yn{log;global=qn();watchController=null;mypageController=null;constructor(){this.log=k("DanimeApp");}start(){this.log.info("starting renderer"),jt.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const t=location.pathname.toLowerCase();try{t.includes("/animestore/sc_d_pc")?(this.watchController=new jn(this.global),await this.watchController.initialize()):t.includes("/animestore/mp_viw_pc")?(this.mypageController=new Kn(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(e){this.log.error("initialization failed",e);}}acquireInstanceLock(){const t=nt();return t.__dAnimeNicoCommentRenderer2Instance=(t.__dAnimeNicoCommentRenderer2Instance??0)+1,t.__dAnimeNicoCommentRenderer2Instance===1}}const Z=k("dAnimeNicoCommentRenderer2");async function Zn(){Z.info("bootstrap start");try{new Yn().start(),Z.info("bootstrap completed");}catch(r){Z.error("bootstrap failed",r);}}Zn();

})();