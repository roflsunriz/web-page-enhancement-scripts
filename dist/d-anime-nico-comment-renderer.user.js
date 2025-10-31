// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      6.2.3
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

  const Et={debug:"debug",info:"info",warn:"warn",error:"error"},R=r=>{const t=`[${r}]`,e={};return Object.keys(Et).forEach(n=>{const i=Et[n];e[n]=(...s)=>{(console[i]??console.log)(t,...s);};}),e};function yt(){return typeof unsafeWindow<"u"?unsafeWindow:window}const Ee={commentColor:"#FFFFFF",commentOpacity:.75,isCommentVisible:true,useContainerResizeObserver:true,ngWords:[],ngRegexps:[]},nt=Ee,L=()=>({...nt,ngWords:[...nt.ngWords],ngRegexps:[...nt.ngRegexps]}),Ce="v6.2.3";var Te=typeof GM_addStyle<"u"?GM_addStyle:void 0,it=typeof GM_getValue<"u"?GM_getValue:void 0,rt=typeof GM_setValue<"u"?GM_setValue:void 0,Ie=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const Ct="settings",Tt="currentVideo",It="lastDanimeIds",Ae=r=>({...r,ngWords:[...r.ngWords],ngRegexps:[...r.ngRegexps]});class bt{constructor(t){this.notifier=t,this.settings=L(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData();}settings;currentVideo;observers=new Set;getSettings(){return Ae(this.settings)}loadSettings(){try{const t=it(Ct,null);if(!t)return this.settings=L(),this.settings;if(typeof t=="string"){const e=JSON.parse(t);this.settings={...L(),...e,ngWords:Array.isArray(e?.ngWords)?[...e.ngWords]:[],ngRegexps:Array.isArray(e?.ngRegexps)?[...e.ngRegexps]:[]};}else this.settings={...L(),...t,ngWords:Array.isArray(t.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t.ngRegexps)?[...t.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(t){return console.error("[SettingsManager] 設定の読み込みに失敗しました",t),this.notify("設定の読み込みに失敗しました","error"),this.settings=L(),this.settings}}saveSettings(){try{return rt(Ct,JSON.stringify(this.settings)),this.notifyObservers(),this.notify("設定を保存しました","success"),!0}catch(t){return console.error("[SettingsManager] 設定の保存に失敗しました",t),this.notify("設定の保存に失敗しました","error"),false}}updateSettings(t){return this.settings={...this.settings,...t,ngWords:t.ngWords?[...t.ngWords]:[...this.settings.ngWords],ngRegexps:t.ngRegexps?[...t.ngRegexps]:[...this.settings.ngRegexps]},this.saveSettings()}addObserver(t){this.observers.add(t);}removeObserver(t){this.observers.delete(t);}notifyObservers(){const t=this.getSettings();for(const e of this.observers)try{e(t);}catch(n){console.error("[SettingsManager] 設定変更通知でエラー",n);}}loadVideoData(){try{return it(Tt,null)??null}catch(t){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",t),this.notify("動画データの読み込みに失敗しました","error"),null}}saveVideoData(t,e){try{const n={videoId:e.videoId,title:e.title,viewCount:e.viewCount,commentCount:e.commentCount,mylistCount:e.mylistCount,postedAt:e.postedAt,thumbnail:e.thumbnail,owner:e.owner??null,channel:e.channel??null};return rt(Tt,n),this.currentVideo=n,!0}catch(n){return console.error("[SettingsManager] 動画データの保存に失敗しました",n),this.notify("動画データの保存に失敗しました","error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(t){try{return rt(It,t),!0}catch(e){return console.error("[SettingsManager] saveLastDanimeIds failed",e),this.notify("ID情報の保存に失敗しました","error"),false}}loadLastDanimeIds(){try{return it(It,null)??null}catch(t){return console.error("[SettingsManager] loadLastDanimeIds failed",t),this.notify("ID情報の読込に失敗しました","error"),null}}notify(t,e="info"){this.notifier?.show(t,e);}}const st=R("dAnime:Comment");class Me{text;vpos;commands;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily="Arial";opacity;isActive=false;hasShown=false;isPaused=false;lastUpdateTime=0;reservationWidth=0;constructor(t,e,n=[],i){if(typeof t!="string")throw new Error("Comment text must be a string");if(!Number.isFinite(e)||e<0)throw new Error("Comment vpos must be a non-negative number");this.text=t,this.vpos=e,this.commands=Array.isArray(n)?n:[],this.color=i.commentColor,this.opacity=i.commentOpacity;}prepare(t,e,n){try{if(!t)throw new Error("Canvas context is required");if(!Number.isFinite(e)||!Number.isFinite(n))throw new Error("Canvas dimensions must be numbers");this.fontSize=Math.max(24,Math.floor(n*.05)),t.font=`${this.fontSize}px ${this.fontFamily}`,this.width=t.measureText(this.text).width,this.height=this.fontSize;const i=t.measureText("あ".repeat(150)).width;this.reservationWidth=Math.min(i,this.width*5),this.x=e,this.baseSpeed=(e+this.reservationWidth)/720,this.speed=this.baseSpeed,this.lastUpdateTime=performance.now();}catch(i){throw st.error("Comment.prepare",i,{text:this.text,canvasWidth:e,canvasHeight:n,hasContext:!!t}),i}}update(t=1,e=false){try{if(!this.isActive||this.isPaused)return;const n=performance.now(),i=(n-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*t,this.x-=this.speed*i,this.x<-this.width&&(this.isActive=!1),this.lastUpdateTime=n,this.isPaused=e;}catch(n){st.error("Comment.update",n,{text:this.text,playbackRate:t,isPaused:e,isActive:this.isActive});}}draw(t,e=null){try{if(!this.isActive||!t)return;t.save(),t.globalAlpha=this.opacity,t.font=`${this.fontSize}px ${this.fontFamily}`;const n=e??this.x,i=this.y+this.fontSize;t.strokeStyle="#000000",t.lineWidth=Math.max(3,this.fontSize/8),t.lineJoin="round",t.strokeText(this.text,n,i),t.fillStyle=this.color,t.fillText(this.text,n,i),t.restore();}catch(n){st.error("Comment.draw",n,{text:this.text,isActive:this.isActive,hasContext:!!t,interpolatedX:e});}}}const Le=new Set(["INPUT","TEXTAREA"]),ot=r=>r.length===1?r.toUpperCase():r,Ve=r=>r?`${r}+`:"";class te{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(t,e,n){const i=this.createShortcutKey(ot(t),e);this.shortcuts.set(i,n);}removeShortcut(t,e){const n=this.createShortcutKey(ot(t),e);this.shortcuts.delete(n);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(t){this.isEnabled=t;}createShortcutKey(t,e){return `${Ve(e)}${t}`}extractModifier(t){const e=[];return t.ctrlKey&&e.push("Ctrl"),t.altKey&&e.push("Alt"),t.shiftKey&&e.push("Shift"),t.metaKey&&e.push("Meta"),e.length>0?e.join("+"):null}handleKeyDown(t){if(!this.isEnabled)return;const n=t.target?.tagName??"";if(Le.has(n))return;const i=this.extractModifier(t),s=this.createShortcutKey(ot(t.key),i),o=this.shortcuts.get(s);o&&(t.preventDefault(),o());}}var ze=(function(){if(typeof document>"u")return "transform";for(var r=["oTransform","msTransform","mozTransform","webkitTransform","transform"],t=document.createElement("div").style,e=0;e<r.length;e++)if(r[e]in t)return r[e];return "transform"})();function Re(r){var t=document.createElement("div");if(t.style.cssText="position:absolute;",typeof r.render=="function"){var e=r.render();if(e instanceof HTMLElement)return t.appendChild(e),t}if(t.textContent=r.text,r.style)for(var n in r.style)t.style[n]=r.style[n];return t}function Ne(){var r=document.createElement("div");return r.style.cssText="overflow:hidden;white-space:nowrap;transform:translateZ(0);",r}function De(r){for(var t=r.lastChild;t;)r.removeChild(t),t=r.lastChild;}function Pe(r,t,e){r.style.width=t+"px",r.style.height=e+"px";}function Fe(){}function Oe(r,t){var e=document.createDocumentFragment(),n=0,i=null;for(n=0;n<t.length;n++)i=t[n],i.node=i.node||Re(i),e.appendChild(i.node);for(t.length&&r.appendChild(e),n=0;n<t.length;n++)i=t[n],i.width=i.width||i.node.offsetWidth,i.height=i.height||i.node.offsetHeight;}function $e(r,t){t.node.style[ze]="translate("+t.x+"px,"+t.y+"px)";}function He(r,t){r.removeChild(t.node),this.media||(t.node=null);}var We={name:"dom",init:Ne,clear:De,resize:Pe,framing:Fe,setup:Oe,render:$e,remove:He},V=typeof window<"u"&&window.devicePixelRatio||1,at=Object.create(null);function qe(r,t){if(at[r])return at[r];var e=12,n=/(\d+(?:\.\d+)?)(px|%|em|rem)(?:\s*\/\s*(\d+(?:\.\d+)?)(px|%|em|rem)?)?/,i=r.match(n);if(i){var s=i[1]*1||10,o=i[2],a=i[3]*1||1.2,l=i[4];o==="%"&&(s*=t.container/100),o==="em"&&(s*=t.container),o==="rem"&&(s*=t.root),l==="px"&&(e=a),l==="%"&&(e=s*a/100),l==="em"&&(e=s*a),l==="rem"&&(e=t.root*a),l===void 0&&(e=s*a);}return at[r]=e,e}function Be(r,t){if(typeof r.render=="function"){var e=r.render();if(e instanceof HTMLCanvasElement)return r.width=e.width,r.height=e.height,e}var n=document.createElement("canvas"),i=n.getContext("2d"),s=r.style||{};s.font=s.font||"10px sans-serif",s.textBaseline=s.textBaseline||"bottom";var o=s.lineWidth*1;o=o>0&&o!==1/0?Math.ceil(o):!!s.strokeStyle*1,i.font=s.font,r.width=r.width||Math.max(1,Math.ceil(i.measureText(r.text).width)+o*2),r.height=r.height||Math.ceil(qe(s.font,t))+o*2,n.width=r.width*V,n.height=r.height*V,i.scale(V,V);for(var a in s)i[a]=s[a];var l=0;switch(s.textBaseline){case "top":case "hanging":l=o;break;case "middle":l=r.height>>1;break;default:l=r.height-o;}return s.strokeStyle&&i.strokeText(r.text,o,l),i.fillText(r.text,o,l),n}function At(r){return window.getComputedStyle(r,null).getPropertyValue("font-size").match(/(.+)px/)[1]*1}function je(r){var t=document.createElement("canvas");return t.context=t.getContext("2d"),t._fontSize={root:At(document.getElementsByTagName("html")[0]),container:At(r)},t}function Ue(r,t){r.context.clearRect(0,0,r.width,r.height);for(var e=0;e<t.length;e++)t[e].canvas=null;}function Ge(r,t,e){r.width=t*V,r.height=e*V,r.style.width=t+"px",r.style.height=e+"px";}function Ye(r){r.context.clearRect(0,0,r.width,r.height);}function Ke(r,t){for(var e=0;e<t.length;e++){var n=t[e];n.canvas=Be(n,r._fontSize);}}function Xe(r,t){r.context.drawImage(t.canvas,t.x*V,t.y*V);}function Ze(r,t){t.canvas=null;}var Je={name:"canvas",init:je,clear:Ue,resize:Ge,framing:Ye,setup:Ke,render:Xe,remove:Ze},Mt=(function(){if(typeof window<"u"){var r=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame;if(r)return r.bind(window)}return function(t){return setTimeout(t,50/3)}})(),Qe=(function(){if(typeof window<"u"){var r=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame;if(r)return r.bind(window)}return clearTimeout})();function ee(r,t,e){for(var n=0,i=0,s=r.length;i<s-1;)n=i+s>>1,e>=r[n][t]?i=n:s=n;return r[i]&&e<r[i][t]?i:s}function ne(r){return /^(ltr|top|bottom)$/i.test(r)?r.toLowerCase():"rtl"}function Y(){var r=9007199254740991;return [{range:0,time:-r,width:r,height:0},{range:r,time:r,width:0,height:0}]}function ie(r){r.ltr=Y(),r.rtl=Y(),r.top=Y(),r.bottom=Y();}function Q(){return typeof window.performance<"u"&&window.performance.now?window.performance.now():Date.now()}function tn(r){var t=this,e=this.media?this.media.currentTime:Q()/1e3,n=this.media?this.media.playbackRate:1;function i(m,y){if(y.mode==="top"||y.mode==="bottom")return e-m.time<t._.duration;var w=t._.width+m.width,I=w*(e-m.time)*n/t._.duration;if(m.width>I)return  true;var b=t._.duration+m.time-e,_=t._.width+y.width,A=t.media?y.time:y._utc,G=_*(e-A)*n/t._.duration,Se=t._.width-G,ke=t._.duration*Se/(t._.width+y.width);return b>ke}for(var s=this._.space[r.mode],o=0,a=0,l=1;l<s.length;l++){var c=s[l],d=r.height;if((r.mode==="top"||r.mode==="bottom")&&(d+=c.height),c.range-c.height-s[o].range>=d){a=l;break}i(c,r)&&(o=l);}var h=s[o].range,u={range:h+r.height,time:this.media?r.time:r._utc,width:r.width,height:r.height};return s.splice(o+1,a-o-1,u),r.mode==="bottom"?this._.height-r.height-h%this._.height:h%(this._.height-r.height)}function en(r,t,e,n){return function(i){r(this._.stage);var s=i||Q(),o=s/1e3,a=this.media?this.media.currentTime:o,l=this.media?this.media.playbackRate:1,c=null,d=0,h=0;for(h=this._.runningList.length-1;h>=0;h--)c=this._.runningList[h],d=this.media?c.time:c._utc,a-d>this._.duration&&(n(this._.stage,c),this._.runningList.splice(h,1));for(var u=[];this._.position<this.comments.length&&(c=this.comments[this._.position],d=this.media?c.time:c._utc,!(d>=a));){if(a-d>this._.duration){++this._.position;continue}this.media&&(c._utc=o-(this.media.currentTime-c.time)),u.push(c),++this._.position;}for(t(this._.stage,u),h=0;h<u.length;h++)c=u[h],c.y=tn.call(this,c),this._.runningList.push(c);for(h=0;h<this._.runningList.length;h++){c=this._.runningList[h];var m=this._.width+c.width,y=m*(o-c._utc)*l/this._.duration;c.mode==="ltr"&&(c.x=y-c.width),c.mode==="rtl"&&(c.x=this._.width-y),(c.mode==="top"||c.mode==="bottom")&&(c.x=this._.width-c.width>>1),e(this._.stage,c);}}}function vt(){if(!this._.visible||!this._.paused)return this;if(this._.paused=false,this.media)for(var r=0;r<this._.runningList.length;r++){var t=this._.runningList[r];t._utc=Q()/1e3-(this.media.currentTime-t.time);}var e=this,n=en(this._.engine.framing.bind(this),this._.engine.setup.bind(this),this._.engine.render.bind(this),this._.engine.remove.bind(this));function i(s){n.call(e,s),e._.requestID=Mt(i);}return this._.requestID=Mt(i),this}function xt(){return !this._.visible||this._.paused?this:(this._.paused=true,Qe(this._.requestID),this._.requestID=0,this)}function wt(){if(!this.media)return this;this.clear(),ie(this._.space);var r=ee(this.comments,"time",this.media.currentTime);return this._.position=Math.max(0,r-1),this}function nn(r){r.play=vt.bind(this),r.pause=xt.bind(this),r.seeking=wt.bind(this),this.media.addEventListener("play",r.play),this.media.addEventListener("pause",r.pause),this.media.addEventListener("playing",r.play),this.media.addEventListener("waiting",r.pause),this.media.addEventListener("seeking",r.seeking);}function rn(r){this.media.removeEventListener("play",r.play),this.media.removeEventListener("pause",r.pause),this.media.removeEventListener("playing",r.play),this.media.removeEventListener("waiting",r.pause),this.media.removeEventListener("seeking",r.seeking),r.play=null,r.pause=null,r.seeking=null;}function sn(r){this._={},this.container=r.container||document.createElement("div"),this.media=r.media,this._.visible=true,this.engine=(r.engine||"DOM").toLowerCase(),this._.engine=this.engine==="canvas"?Je:We,this._.requestID=0,this._.speed=Math.max(0,r.speed)||144,this._.duration=4,this.comments=r.comments||[],this.comments.sort(function(e,n){return e.time-n.time});for(var t=0;t<this.comments.length;t++)this.comments[t].mode=ne(this.comments[t].mode);return this._.runningList=[],this._.position=0,this._.paused=true,this.media&&(this._.listener={},nn.call(this,this._.listener)),this._.stage=this._.engine.init(this.container),this._.stage.style.cssText+="position:relative;pointer-events:none;",this.resize(),this.container.appendChild(this._.stage),this._.space={},ie(this._.space),(!this.media||!this.media.paused)&&(wt.call(this),vt.call(this)),this}function on(){if(!this.container)return this;xt.call(this),this.clear(),this.container.removeChild(this._.stage),this.media&&rn.call(this,this._.listener);for(var r in this)Object.prototype.hasOwnProperty.call(this,r)&&(this[r]=null);return this}var K=["mode","time","text","render","style"];function an(r){if(!r||Object.prototype.toString.call(r)!=="[object Object]")return this;for(var t={},e=0;e<K.length;e++)r[K[e]]!==void 0&&(t[K[e]]=r[K[e]]);if(t.text=(t.text||"").toString(),t.mode=ne(t.mode),t._utc=Q()/1e3,this.media){var n=0;t.time===void 0?(t.time=this.media.currentTime,n=this._.position):(n=ee(this.comments,"time",t.time),n<this._.position&&(this._.position+=1)),this.comments.splice(n,0,t);}else this.comments.push(t);return this}function ln(){return this._.visible?this:(this._.visible=true,this.media&&this.media.paused?this:(wt.call(this),vt.call(this),this))}function cn(){return this._.visible?(xt.call(this),this.clear(),this._.visible=false,this):this}function dn(){return this._.engine.clear(this._.stage,this._.runningList),this._.runningList=[],this}function hn(){return this._.width=this.container.offsetWidth,this._.height=this.container.offsetHeight,this._.engine.resize(this._.stage,this._.width,this._.height),this._.duration=this._.width/this._.speed,this}var un={get:function(){return this._.speed},set:function(r){return typeof r!="number"||isNaN(r)||!isFinite(r)||r<=0?this._.speed:(this._.speed=r,this._.width&&(this._.duration=this._.width/r),r)}};function N(r){r&&sn.call(this,r);}N.prototype.destroy=function(){return on.call(this)};N.prototype.emit=function(r){return an.call(this,r)};N.prototype.show=function(){return ln.call(this)};N.prototype.hide=function(){return cn.call(this)};N.prototype.clear=function(){return dn.call(this)};N.prototype.resize=function(){return hn.call(this)};Object.defineProperty(N.prototype,"speed",un);class mn{constructor(){this._fx=[],this._init=true,this._lock=false,this._finishDefers=new Set;}_next(){if(!this._lock)if(this._lock=true,this._fx.length===0)this._init=true,this._finishDefers.forEach(t=>t.resolve()),this._finishDefers.clear();else {const t=this._fx.shift();t&&t(()=>{this._lock=false,this._next();});}}add(t){this._fx.push(t),this._init&&(this._lock=false,this._init=false,this._next());}awaitFinish(){if(this._init)return Promise.resolve();const t={};return this._finishDefers.add(t),new Promise(e=>{t.resolve=e;})}}const re=Object.prototype.toString,pn=r=>re.call(r).slice(8,-1).toLowerCase(),se=Array.isArray,oe=r=>r!==null&&typeof r=="object",fn=r=>typeof r=="number",gn=r=>oe(r)&&typeof r.then=="function",B=r=>re.call(r)==="[object Object]",yn=typeof Set!="function"||!Set.prototype.has?()=>false:r=>oe(r)&&r instanceof Set,bn=([r,t],e)=>{if(e===r||e===t)return  true;const n=Math.min(r,t),i=n===r?t:r;return n<e&&e<i},vn=r=>{for(const t in r)return  false;return  true},Lt=r=>typeof r=="number"||typeof r=="bigint"||typeof r=="string"||typeof r=="symbol"||typeof r=="boolean"||r===void 0||r===null,xn=r=>r===" "||r==="	"||r===`
`||r==="\r"||r==="\f"||r==="\v";let k;const wn=r=>{if(!k){k=[];for(let t=0;t<256;++t)k.push((t+256).toString(16).slice(1));}return (k[r[0]]+k[r[1]]+k[r[2]]+k[r[3]]+"-"+k[r[4]]+k[r[5]]+"-"+k[r[6]]+k[r[7]]+"-"+k[r[8]]+k[r[9]]+"-"+k[r[10]]+k[r[11]]+k[r[12]]+k[r[13]]+k[r[14]]+k[r[15]]).toLowerCase()};let F,O;const _n=()=>{if(O||(O=new Uint8Array(256),F=O.length),F>240){for(let r=0;r<256;r++)O[r]=Math.floor(Math.random()*256);F=0;}return O.slice(F,F+=16)},Sn=()=>{const r=_n();return r[6]=r[6]&15|64,r[8]=r[8]&63|128,wn(r)},lt=(r,t,e=17)=>new Promise(n=>{if(r===0){n();return}let i=-1,s=Date.now();const o=()=>{for(;++i<r;){if(t(i)===false){n();break}if(i===r-1)n();else {const a=Date.now();if(a-s>e){s=a,pt(o);break}}}};o();});class kn{expr;i=0;priority={"+":1,"-":1,"*":2,"/":2,"%":2};constructor(t){this.expr=t;}calculateOperation(t,e){const n=t.pop(),i=t.pop();if(i!==void 0&&n!==void 0)switch(e){case "+":t.push(i+n);break;case "-":t.push(i-n);break;case "*":t.push(i*n);break;case "/":t.push(i/n);break;case "%":t.push(i%n);break;default:throw new Error(`Invalid operator: "${e}"`)}}evaluate(t){if(t.length===0)return NaN;const e=[],n=[];for(const s of t)if(typeof s=="string"){const o=this.priority[s];for(;n.length>0&&this.priority[Vt(n)]>=o;)this.calculateOperation(e,n.pop());n.push(s);}else e.push(s);for(;n.length>0;)this.calculateOperation(e,n.pop());const i=e.pop();return typeof i=="number"?i:NaN}tokenizer(){const t=[];if(!this.expr)return t;let e="";const n=()=>{e&&(t.push(Number(e)),e="");};for(;this.i<this.expr.length;this.i++){const i=this.expr[this.i];if(!xn(i))if(i==="+"||i==="-"){const s=Vt(t);!e&&(!s||s in this.priority)?e+=i:(n(),t.push(i));}else if(i==="*"||i==="/"||i==="%")n(),t.push(i);else if(i==="(")this.i++,t.push(this.evaluate(this.tokenizer()));else {if(i===")")return this.i++,n(),t;e+=i;}}return n(),t}}const En=r=>{const t="',\",`,:,;,[,{,=,var,let,const,return".split(",");for(const e of t)if(r.includes(e))return  false;return !/[^\+\-\*\/\%\s]+\(/.test(r)},Cn=(r,t)=>{const{units:e,verify:n,actuator:i,exec:s=true}=t||{};if(n&&!En(r))throw new Error(`Invalid expression: "${r}"`);r=r.replace(/(-?\d+(\.\d+)?|NaN|Infinity)([^\d\s\+\-\*\/\.\(\)]+)?/g,(o,a,l,c,d)=>{if(!c)return a;const h=e&&(e[c]||e.default);if(!h)throw new Error(`Invalid unit: "${c}"`);return String(h(a,c,r))});try{if(i)return i(r,!!s);{if(!s)return r;const o=new kn(r);return o.evaluate(o.tokenizer())}}catch(o){throw new Error(`Invalid expression: "${r}", error: "${o}"`)}};function p(r,t){if(!r)throw new Error(t)}const pt=r=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(r):typeof process<"u"&&typeof process.nextTick=="function"?process.nextTick(r):setTimeout(r,17);},z=()=>typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now(),Vt=(r,t=0)=>r[r.length+t-1],P=(r,t)=>Object.hasOwnProperty.call(r,t),zt=r=>!Number.isFinite(r)||Number.isInteger(r)?0:String(r).split(".")[1].length,Tn=(r=0,t=0)=>{if(t===r)return t;t<r&&(r=[t,t=r][0]);const e=Number((Math.random()*(t-r)+r).toFixed(Math.max(zt(r),zt(t))));return e>t?t:e<r?r:e},In=r=>{let t,e=false;function n(...i){return e||(e=true,t=r.apply(this,i)),t}return n},J=(r,t)=>{if(se(r)){const e=r.indexOf(t);return e>-1?(r.splice(e,1),true):false}else return r.has(t)?(r.delete(t),true):false};function Rt(r,t){if(t=t||(e=>e),se(r))return r.map((e,n)=>t(e,n));if(yn(r)){const e=new Set;for(const n of r)e.add(t(n));return e}if(B(r)){const e={};for(const n in r)e[n]=t(r[n],n);return e}throw new Error(`Invalid type "${pn(r)}"`)}const An=(r,t,e=false)=>t.reduce((n,i)=>(i in r&&(!e||r[i]!==void 0)&&(n[i]=r[i]),n),{}),Mn=(r,t)=>Object.keys(r).reduce((e,n)=>(t.includes(n)||(e[n]=r[n]),e),{}),Ln=()=>{let r,t;return {promise:new Promise((n,i)=>{r=i,t=n;}),resolve:t,reject:r}},Vn=({ms:r,processor:t})=>{const e=[],n=()=>{setTimeout(()=>{const i=[],s=[];for(const{value:o,resolve:a}of e)i.push(o),s.push(a);e.length=0,t(i);for(const o of s)o();},r);};return i=>{const s=Ln();return e.length===0&&n(),e.push({value:i,resolve:s.resolve}),s.promise}},M=Symbol("internal_hooks"),ft=Symbol("invalid_condition_value"),ae="__performance_monitor__",zn=typeof window<"u";let Rn=1;const j=()=>Rn++;let Nn=1;const Dn=()=>Nn++;let Pn=1;const Fn=()=>Pn++,le=(r,t)=>{if(!B(t))return  false;if(r!==t){for(const e in r)if(!(e in t))return  false}return  true},Nt=(r,t)=>{let e=t;const n=r.split(".");for(let i=0,s=n.length;i<s;i++){if(!e)return ft;let o=n[i];o.startsWith("[")&&o.endsWith("]")&&(o=Number(o.slice(1,-1))),e=e[o];}return e};class g{constructor(t,e="SyncHook",n){this.listeners=new Set,this.tags=new WeakMap,this.errors=new Set,this.type=e,this._locked=false,this.context=typeof t>"u"?null:t,n!==M&&(this.before=new g(null,"SyncHook",M),this.after=new g(null,"SyncHook",M));}_emitError(t,e,n){if(this.errors.size>0)this.errors.forEach(i=>i({tag:n,hook:e,error:t,type:this.type}));else throw t}isEmpty(){return this.listeners.size===0}lock(){return this._locked=true,this.before&&this.before.lock(),this.after&&this.after.lock(),this}unlock(){return this._locked=false,this.before&&this.before.unlock(),this.after&&this.after.unlock(),this}on(t,e){return p(!this._locked,"The current hook is now locked."),typeof t=="function"&&(e=t,t=""),p(typeof e=="function",`Invalid parameter in "${this.type}".`),t&&typeof t=="string"&&this.tags.set(e,t),this.listeners.add(e),this}once(t,e){typeof t=="function"&&(e=t,t="");const n=this;return this.on(t,function i(...s){return n.remove(i,M),e.apply(this,s)}),this}emit(...t){var e,n,i;if(this.listeners.size>0){const s=j();let o=null;!((e=this.after)===null||e===void 0)&&e.isEmpty()||(o=Object.create(null)),(n=this.before)===null||n===void 0||n.emit(s,this.type,this.context,t),this.listeners.forEach(a=>{const l=this.tags.get(a);o&&l&&(o[l]=Date.now());const c=()=>{o&&l&&(o[l]=Date.now()-o[l]);};try{a.apply(this.context,t),c();}catch(d){c(),this._emitError(d,a,l);}}),(i=this.after)===null||i===void 0||i.emit(s,this.type,this.context,t,o);}}remove(t,e){return e!==M&&p(!this._locked,"The current hook is now locked."),this.listeners.delete(t),this}removeAll(){return p(!this._locked,"The current hook is now locked."),this.listeners.clear(),this}listenError(t){p(!this._locked,"The current hook is now locked."),this.errors.add(t);}clone(){return new this.constructor(this.context,this.type,this.before?null:M)}}class ce extends g{constructor(t){super(t,"AsyncHook");}emit(...t){var e,n;let i,s;const o=Array.from(this.listeners);let a=null;if(o.length>0){i=j(),!((e=this.after)===null||e===void 0)&&e.isEmpty()||(a=Object.create(null)),(n=this.before)===null||n===void 0||n.emit(i,this.type,this.context,t);let l=0;const c=d=>{if(d===false)return  false;if(l<o.length){let h;const u=o[l++],m=this.tags.get(u);a&&m&&(a[m]=Date.now());const y=()=>{a&&m&&(a[m]=Date.now()-a[m]);};try{h=u.apply(this.context,t);}catch(w){return y(),this._emitError(w,u,m),c(d)}return Promise.resolve(h).finally(y).then(c).catch(w=>(this._emitError(w,u,m),c(d)))}else return d};s=c();}return Promise.resolve(s).then(l=>{var c;return o.length>0&&((c=this.after)===null||c===void 0||c.emit(i,this.type,this.context,t,a)),l})}}class de extends g{constructor(t){super(t,"SyncWaterfallHook");}emit(t){var e,n,i;if(p(B(t),`"${this.type}" hook response data must be an object.`),this.listeners.size>0){const s=j();let o=null;!((e=this.after)===null||e===void 0)&&e.isEmpty()||(o=Object.create(null)),(n=this.before)===null||n===void 0||n.emit(s,this.type,this.context,[t]);for(const a of this.listeners){const l=this.tags.get(a);o&&l&&(o[l]=Date.now());const c=()=>{o&&l&&(o[l]=Date.now()-o[l]);};try{const d=a.call(this.context,t);p(le(t,d),`The return value of hook "${this.type}" is incorrect.`),t=d,c();}catch(d){c(),this._emitError(d,a,l);}}(i=this.after)===null||i===void 0||i.emit(s,this.type,this.context,[t],o);}return t}}class On extends g{constructor(t){super(t,"AsyncParallelHook");}emit(...t){var e,n;let i,s=null;const o=this.listeners.size,a=[];if(o>0){i=j(),!((e=this.after)===null||e===void 0)&&e.isEmpty()||(s=Object.create(null)),(n=this.before)===null||n===void 0||n.emit(i,this.type,this.context,t);for(const l of this.listeners)a.push(Promise.resolve().then(()=>{const c=this.tags.get(l);s&&c&&(s[c]=Date.now());const d=()=>{s&&c&&(s[c]=Date.now()-s[c]);};try{const h=l.apply(this.context,t);return gn(h)?Promise.resolve(h).catch(u=>(d(),this._emitError(u,l,c),null)):(d(),h)}catch(h){return this._emitError(h,l,c),null}}));}return Promise.all(a).then(()=>{var l;o>0&&((l=this.after)===null||l===void 0||l.emit(i,this.type,this.context,t,s));})}}class $n extends g{constructor(t){super(t,"AsyncWaterfallHook");}emit(t){var e,n;p(B(t),`"${this.type}" hook response data must be an object.`);let i=0,s,o=null;const a=Array.from(this.listeners);if(a.length>0){s=j(),!((e=this.after)===null||e===void 0)&&e.isEmpty()||(o=Object.create(null)),(n=this.before)===null||n===void 0||n.emit(s,this.type,this.context,[t]);const l=c=>{if(c===false)return  false;if(p(le(t,c),`The return value of hook "${this.type}" is incorrect.`),t=c,i<a.length){let d;const h=a[i++],u=this.tags.get(h);o&&u&&(o[u]=Date.now());const m=()=>{o&&u&&(o[u]=Date.now()-o[u]);};try{d=h.call(this.context,c);}catch(y){return m(),this._emitError(y,h,u),l(c)}return Promise.resolve(d).finally(m).then(l).catch(y=>(this._emitError(y,h,u),l(c)))}return t};return Promise.resolve(l(t)).then(c=>{var d;return (d=this.after)===null||d===void 0||d.emit(s,this.type,this.context,[c],o),c})}else return Promise.resolve(t)}}function Hn(r,t){let e={},n=false;const i=`${ae}${Fn()}`;let s=new Map,o=Object.create(null),a=Object.create(null);const l=(c,d)=>d&&d[c]||t;for(const c in r.lifecycle)e[c]=function(...d){let h;for(const u in a){const[m,y,w,I]=a[u],b=l(c,w);if(c===y&&(h=Nt(b,d),h!==ft)){const _=Lt(h)?o[h]:s.get(h);if(_){const A=_[`${u}_${m}`];typeof A=="number"&&I.emit({endArgs:d,endContext:this,events:[m,y],equalValue:h,time:Date.now()-A});}}if(c===m&&(h=h||Nt(b,d),h!==ft)){let _;const A=`${u}_${m}`,G=Date.now();Lt(h)?(_=o[h],_||(_=Object.create(null),o[h]=_)):(_=s.get(h),_||(_=Object.create(null),s.set(h,_))),_[A]=G;}}};return r.use({hooks:e,name:i}),{close(){n||(n=true,s.clear(),o=Object.create(null),a=Object.create(null),this._taskHooks.hs.forEach(c=>c.removeAll()),this._taskHooks.hs.clear(),r.remove(i));},monitor(c,d,h){p(!n,"Unable to add tasks to a closed performance observer.");const u=Dn(),m=new g,y=[c,d,h,m];return a[u]=y,this._taskHooks.add(m),m},_taskHooks:{hs:new Set,watch:new Set,add(c){this.hs.add(c),this.watch.forEach(d=>d(c));}}}}function Wn(r,t,e){const n=`[${e||"debug"}_performance]`,i=s=>{typeof t=="function"?t({tag:e,e:s}):console.log(`${n}(${s.events[0]} -> ${s.events[1]}): ${s.time}`,s.endArgs,s.endContext);};r._taskHooks.watch.add(s=>s.on(i)),r._taskHooks.hs.forEach(s=>s.on(i));}function qn(r,t){let{tag:e,group:n,filter:i,receiver:s,listenError:o,logPluginTime:a,errorReceiver:l,performance:c,performanceReceiver:d}=t,h=null,u=Object.create(null);const m=`[${e||"debug"}]: `;"group"in t||(n=zn),"listenError"in t||(o=true),"logPluginTime"in t||(a=true),c&&Wn(c,d,e);const y=b=>{let _=`${m}${b.name}_${b.id}(t, args, ctx`;return _+=a?", pt)":")",_},w=r.beforeEach(b=>{u[b.id]={t:Date.now()},typeof s!="function"&&(console.time(y(b)),n&&console.groupCollapsed(b.name));}),I=r.afterEach(b=>{let _=null;if(typeof i=="string"){if(b.name.startsWith(i)){n&&console.groupEnd();return}}else if(typeof i=="function"&&(_=Date.now()-u[b.id].t,i({e:b,tag:e,time:_}))){n&&console.groupEnd();return}typeof s=="function"?(_===null&&(_=Date.now()-u[b.id].t),s({e:b,tag:e,time:_})):(console.timeLog(y(b),b.args,b.context,a?b.pluginExecTime:""),n&&console.groupEnd());});return o&&(h=r.listenError(b=>{typeof l=="function"?l(b):console.error(`[${e}]: The error originated from "${b.tag}.${b.name}(${b.type})".
`,`The hook function is: ${String(b.hook)}

`,b.error);})),()=>{w(),I(),h&&h(),u=Object.create(null),c&&c.close();}}const Bn={SyncHook:g,AsyncHook:ce,AsyncParallelHook:On,SyncWaterfallHook:de,AsyncWaterfallHook:$n};class tt{constructor(t){this._locked=false,this._debugs=new Set,this._performances=new Set,this._lockListenSet=new Set,this.plugins=Object.create(null),this.lifecycle=t||Object.create(null);}_onEmitLifeHook(t,e){p(!this._locked,`The plugin system is locked and cannot add "${t}" hook.`);let n=Object.create(null);for(const i in this.lifecycle)n[i]=(s,o,a,l,c)=>{e(Object.freeze({id:s,type:o,args:l,context:a,name:i,pluginExecTime:c}));},this.lifecycle[i][t].on(n[i]);return ()=>{for(const i in this.lifecycle)this.lifecycle[i][t].remove(n[i]);n=Object.create(null);}}listenLock(t){this._lockListenSet.add(t);}lock(){this._locked=true;for(const t in this.lifecycle)this.lifecycle[t].lock();this._lockListenSet.size>0&&this._lockListenSet.forEach(t=>t(true));}unlock(){this._locked=false;for(const t in this.lifecycle)this.lifecycle[t].unlock();this._lockListenSet.size>0&&this._lockListenSet.forEach(t=>t(false));}beforeEach(t){return this._onEmitLifeHook("before",t)}afterEach(t){return this._onEmitLifeHook("after",t)}performance(t){p(!this._locked,"The plugin system is locked and performance cannot be monitored."),p(t&&typeof t=="string","A judgment `conditions` is required to use `performance`.");const e=Hn(this,t),{close:n}=e,i=()=>(p(!this._locked,"The plugin system is locked and removal operations are not allowed."),this._performances.delete(i),n.call(e));return e.close=i,this._performances.add(i),e}removeAllPerformance(){p(!this._locked,"The plugin system is locked and removal operations are not allowed."),this._performances.forEach(t=>t());}debug(t={}){p(!this._locked,"The plugin system is locked and the debugger cannot be added.");const e=qn(this,t),n=()=>{p(!this._locked,"The plugin system is locked and removal operations are not allowed."),this._debugs.delete(n),e();};return this._debugs.add(n),n}removeAllDebug(){p(!this._locked,"The plugin system is locked and removal operations are not allowed."),this._debugs.forEach(t=>t());}getPluginApis(t){return this.plugins[t].apis}listenError(t){p(!this._locked,"The plugin system is locked and cannot listen for errors.");const e=Object.create(null);for(const n in this.lifecycle)e[n]=i=>{t(Object.assign(i,{name:n}));},this.lifecycle[n].listenError(e[n]);return ()=>{p(!this._locked,"The plugin system is locked and the listening error cannot be removed.");for(const n in this.lifecycle)this.lifecycle[n].errors.delete(e[n]);}}useRefine(t){return this.use(t,M)}use(t,e){p(!this._locked,`The plugin system is locked and new plugins cannot be added${t.name?`(${t.name})`:""}.`),typeof t=="function"&&(t=t(this)),p(B(t),"Invalid plugin configuration."),e===M&&(t={version:t.version,name:t.name||Sn(),hooks:Mn(t,["name","version"])});const{name:n}=t;p(n&&typeof n=="string",'Plugin must provide a "name".'),p(!this.isUsed(n),`Repeat to register plugin hooks "${n}".`);const i=(s,o)=>{if(s)for(const a in s){p(P(this.lifecycle,a),`"${a}" hook is not defined in plugin "${n}".`);const l=n.startsWith(ae)?"":n;o?this.lifecycle[a].once(l,s[a]):this.lifecycle[a].on(l,s[a]);}};return i(t.hooks,false),i(t.onceHooks,true),this.plugins[n]=t,t}remove(t){if(p(!this._locked,"The plugin system has been locked and the plugin cannot be cleared."),p(t,'Must provide a "name".'),P(this.plugins,t)){const e=this.plugins[t],n=i=>{if(i)for(const s in i)this.lifecycle[s].remove(i[s]);};n(e.hooks),n(e.onceHooks),delete this.plugins[t];}}pickLifyCycle(t){return An(this.lifecycle,t)}isUsed(t){return p(t,'Must provide a "name".'),P(this.plugins,t)}create(t){return new tt(t(Bn))}clone(t){const e=Object.create(null);for(const i in this.lifecycle)e[i]=this.lifecycle[i].clone();const n=new this.constructor(e);if(t)for(const i in this.plugins)n.use(this.plugins[i]);return n}}/*!
   * danmu.js
   * (c) 2024-2025 Imtaotao
   * Released under the MIT License.
   */class jn{_container;isLock=false;index;location;list;constructor({index:t,list:e,location:n,container:i}){this.list=e,this.index=t,this.location=n,this._container=i;}get width(){return this._container.width}get height(){return this.location.bottom-this.location.top}each(t){for(const e of Array.from(this.list))if(t(e)===false)break}lock(){this.isLock=true;}unlock(){this.isLock=false;}clear(){this.each(t=>t.destroy());}_add(t){this.list.push(t);}_remove(t){J(this.list,t);}_updateLocation(t){this.location=t;}_last(t){for(let e=this.list.length-1;e>=0;e--){const n=this.list[e-t];if(n&&!n.paused&&n.loops===0&&n.type==="facile")return n}return null}}const v=Symbol(),U={danmu:1,bridge:1,runtime:1,container:1},H=r=>pt(()=>pt(r)),he=(r,t)=>{const e=Math.floor(Math.random()*t);return r.has(e)?he(r,t):e},Dt=(r,t)=>Cn(r,{units:{px:e=>e,"%":e=>Number(e)/100*t}}),ue=r=>new Promise(t=>{const e=In(()=>{r.removeEventListener("transitionend",e),t();});r.addEventListener("transitionend",e);});class Un{width=0;height=0;node;parentNode=null;_parentWidth=0;_parentHeight=0;_size={x:{start:0,end:"100%"},y:{start:0,end:"100%"}};constructor(){this.node=document.createElement("div"),this.node.setAttribute("data-danmu-container",String(U.container++)),this.setStyle("overflow","hidden"),this.setStyle("position","relative"),this.setStyle("top","0"),this.setStyle("left","0");}_sizeToNumber(){const t=Object.create(null),e=(n,i)=>typeof n=="string"?n?Dt(n,i):0:n;return t.x=Rt(this._size.x,n=>e(n,this._parentWidth)),t.y=Rt(this._size.y,n=>e(n,this._parentHeight)),t}_mount(t){this._unmount(),this.parentNode=t,this._format(),this.parentNode.appendChild(this.node);}_unmount(){this.parentNode=null,this.node.parentNode&&this.node.parentNode.removeChild(this.node);}_updateSize({x:t,y:e}){const n=i=>typeof i=="string"||typeof i=="number";t&&(n(t.end)&&(this._size.x.end=t.end),n(t.start)&&(this._size.x.start=t.start)),e&&(n(e.end)&&(this._size.y.end=e.end),n(e.start)&&(this._size.y.start=e.start));}_toNumber(t,e){let n=typeof e=="number"?e:Dt(e,this[t]);return n>this[t]&&(n=this[t]),p(!Number.isNaN(n),`${e} is not a number`),n}_format(){if(this.parentNode){const n=getComputedStyle(this.parentNode);this._parentWidth=Number(n.width.replace("px","")),this._parentHeight=Number(n.height.replace("px",""));}const{x:t,y:e}=this._sizeToNumber();this.width=t.end-t.start,this.height=e.end-e.start,this.setStyle("left",`${t.start}px`),this.setStyle("top",`${e.start}px`),this.setStyle("width",`${this.width}px`),this.setStyle("height",`${this.height}px`);}setStyle(t,e){this.node.style[t]=e;}}function me(){return new tt({hide:new g,show:new g,pause:new g,resume:new g,beforeMove:new g,moved:new g,createNode:new g,appendNode:new g,removeNode:new g,beforeDestroy:new ce,destroyed:new g})}function Gn(){const{lifecycle:r}=me();return new tt({$show:r.show,$hide:r.hide,$pause:r.pause,$resume:r.resume,$beforeMove:r.beforeMove,$moved:r.moved,$createNode:r.createNode,$appendNode:r.appendNode,$removeNode:r.removeNode,$beforeDestroy:r.beforeDestroy,$destroyed:r.destroyed,format:new g,start:new g,stop:new g,show:new g,hide:new g,freeze:new g,unfreeze:new g,finished:new g,clear:new g,mount:new g,unmount:new g,init:new g,limitWarning:new g,push:new g,render:new g,updateOptions:new g,willRender:new de})}const Pt="$",ct=[];function Ft(r){const t={name:`__danmaku_plugin_${U.bridge++}__`};if(ct.length)for(const[e,n]of ct)t[n]=(...i)=>r.lifecycle[e].emit(...i);else {const e=Object.keys(r.lifecycle);for(const n of e)if(n.startsWith(Pt)){const i=n.replace(Pt,"");ct.push([n,i]),t[i]=(...s)=>r.lifecycle[n].emit(...s);}}return t}class W{_options;data;loops=0;isLoop=false;paused=false;moving=false;isEnded=false;isFixedDuration=false;rate;duration;recorder;nextFrame=H;type="facile";track=null;node=null;moveTimer=null;position={x:0,y:0};pluginSystem=me();_internalStatuses;_initData;constructor(t){this._options=t,this.data=t.data,this.rate=t.rate,this.duration=t.duration,this._internalStatuses=t.internalStatuses,this._initData={duration:t.duration,width:t.container.width},this.recorder={pauseTime:0,startTime:0,prevPauseTime:0};}_delInTrack(){this._options.delInTrack(this),this.track&&this.track._remove(this);}_summaryWidth(){return this._options.container.width+this.getWidth()}_getMovePercent(){const{pauseTime:t,startTime:e,prevPauseTime:n}=this.recorder,s=((this.paused?n:z())-e-t)/this.actualDuration();return this._options.progress&&this._options.progress>0?s+this._options.progress:s}_getMoveDistance(){return this.moving?this._getMovePercent()*this._summaryWidth():0}_getSpeed(){const t=this._summaryWidth();return t==null?0:t/this.actualDuration()}_createNode(){this.node||(this.node=document.createElement("div"),this._setStartStatus(),this.node.__danmaku__=this,this.pluginSystem.lifecycle.createNode.emit(this,this.node));}_appendNode(t){!this.node||this.node.parentNode===t||(t.appendChild(this.node),this.pluginSystem.lifecycle.appendNode.emit(this,this.node));}_removeNode(t){if(!this.node)return;const e=this.node.parentNode;e&&(e.removeChild(this.node),t!==v&&this.pluginSystem.lifecycle.removeNode.emit(this,this.node));}_setOff(){return new Promise(t=>{if(!this.node){this.moving=false,this.isEnded=true,t();return}for(const o in this._internalStatuses.styles)this.setStyle(o,this._internalStatuses.styles[o]);const e=this.getWidth(),n=this._options.container.width+e,i=this.direction==="left"?1:-1;this._internalStatuses.viewStatus==="hide"?this.hide(v):this.show(v);const s=this.actualDuration();if(this.setStyle("transform",`translateX(${i*n}px)`),this.setStyle("transition",`transform linear ${s}ms`),this._options.progress&&this._options.progress>0){const o=this._options.progress*s;this.setStyle("transitionDelay",`${ -1*o}ms`);}this.direction!=="none"&&this.setStyle(this.direction,`-${e}px`),this.moving=true,this.recorder.startTime=z(),this.pluginSystem.lifecycle.beforeMove.emit(this),ue(this.node).then(()=>{this.loops++,this.moving=false,this.isEnded=true,this.pluginSystem.lifecycle.moved.emit(this),t();});})}_setStartStatus(){this._internalStatuses.viewStatus==="hide"?this.hide(v):this.show(v),this.setStyle("zIndex","0"),this.setStyle("opacity","0"),this.setStyle("transform",""),this.setStyle("transition",""),this.setStyle("position","absolute"),this.setStyle("top",`${this.position.y}px`),this.direction!=="none"&&this.setStyle(this.direction,"0");}_updatePosition(t){typeof t.x=="number"&&(this.position.x=t.x),typeof t.y=="number"&&(this.position.y=t.y,this.setStyle("top",`${t.y}px`));}_updateTrack(t){this.track=t,t&&t._add(this);}_updateDuration(t,e=true){this.isFixedDuration=true,this.duration=t,e&&(this._initData.duration=t);}_format(t,e,n){if(this.isEnded){this.destroy();return}if(this._options.container.height!==e&&this.getHeight()+n.location.bottom>this._options.container.height){this.destroy();return}if(this._options.container.width!==t){const{width:i,duration:s}=this._initData,o=(i+this.getWidth())/s;this._updateDuration(this._summaryWidth()/o,false),this.paused||(this.pause(v),this.resume(v));}}_reset(){this.loops=0,this.paused=false,this.moving=false,this.position={x:0,y:0},this._removeNode(),this._delInTrack(),this._setStartStatus(),this._updateTrack(null),this.setStyle("top",""),this.moveTimer&&(this.moveTimer.clear(),this.moveTimer=null),this.recorder={pauseTime:0,startTime:0,prevPauseTime:0},this._initData={duration:this._options.duration,width:this._options.container.width};}get direction(){return this._options.direction}actualDuration(){return this.duration/this.rate}setloop(){this.isLoop=true;}unloop(){this.isLoop=false;}getHeight(){return this.node&&this.node.clientHeight||0}getWidth(){return this.node&&this.node.clientWidth||0}pause(t){if(!this.moving||this.paused)return;let e=this._getMoveDistance();if(Number.isNaN(e))return;const n=this.direction==="left"?1:-1;this.paused=true,this.recorder.prevPauseTime=z(),this.setStyle("zIndex","2"),this.setStyle("transitionDuration","0ms"),this.setStyle("transform",`translateX(${e*n}px)`),t!==v&&this.pluginSystem.lifecycle.pause.emit(this);}resume(t){if(!this.moving||!this.paused)return;const e=this._summaryWidth(),n=this.direction==="left"?1:-1,i=(1-this._getMovePercent())*this.actualDuration();this.paused=false,this.recorder.pauseTime+=z()-this.recorder.prevPauseTime,this.recorder.prevPauseTime=0,this.setStyle("zIndex","0"),this.setStyle("transitionDuration",`${i}ms`),this.setStyle("transform",`translateX(${e*n}px)`),this.setStyle("transitionDelay",""),t!==v&&this.pluginSystem.lifecycle.resume.emit(this);}hide(t){this.setStyle("visibility","hidden"),this.setStyle("pointerEvents","none"),t!==v&&this.pluginSystem.lifecycle.hide.emit(this);}show(t){this.setStyle("visibility","visible"),this.setStyle("pointerEvents","auto"),t!==v&&this.pluginSystem.lifecycle.show.emit(this);}async destroy(t){await this.pluginSystem.lifecycle.beforeDestroy.emit(this,t),this.moving=false,this._delInTrack(),this._removeNode(),this.moveTimer&&(this.moveTimer.clear(),this.moveTimer=null),this.pluginSystem.lifecycle.destroyed.emit(this,t),this.node=null;}setStyle(t,e){this.node&&(this.node.style[t]=e);}remove(t){this.pluginSystem.remove(t);}use(t){return typeof t=="function"&&(t=t(this)),t.name||(t.name=`__facile_danmaku_plugin_${U.danmu++}__`),this.pluginSystem.useRefine(t),t}}class pe extends W{_options;position;type="flexible";constructor(t){super(t),this._options=t,this.position=t.position||{x:0,y:0};}_getSpeed(){if(this.direction==="none")return 0;const{duration:t}=this._initData;return (this.direction==="right"?this.position.x+this.getWidth():this.position.x)/t}_setOff(){return new Promise(t=>{if(!this.node){this.moving=false,this.isEnded=true,t();return}const e=()=>{this.loops++,this.moving=false,this.isEnded=true,this.moveTimer&&(this.moveTimer.clear(),this.moveTimer=null),this.pluginSystem.lifecycle.moved.emit(this),t();};for(const n in this._internalStatuses.styles)this.setStyle(n,this._internalStatuses.styles[n]);if(this.moving=true,this.recorder.startTime=z(),this.pluginSystem.lifecycle.beforeMove.emit(this),this.direction==="none"){let n=setTimeout(e,this.actualDuration());this.moveTimer={cb:e,clear(){clearTimeout(n),n=null;}};}else {const n=this.direction==="left"?this._options.container.width:-this.getWidth();this.setStyle("transition",`transform linear ${this.actualDuration()}ms`),this.setStyle("transform",`translateX(${n}px) translateY(${this.position.y}px)`),ue(this.node).then(e);}})}_setStartStatus(){this.setStyle("zIndex","1"),this.setStyle("transform",""),this.setStyle("transition",""),this.setStyle("position","absolute"),this.setStyle("transform",`translateX(${this.position.x}px) translateY(${this.position.y}px)`),this._internalStatuses.viewStatus==="hide"?this.hide(v):this.show(v);}_updatePosition(t){let e=false;typeof t.x=="number"&&(this.position.x=t.x,e=true),typeof t.y=="number"&&(this.position.y=t.y,e=true),e&&this.setStyle("transform",`translateX(${this.position.x}px) translateY(${this.position.y}px)`);}_getMovePercent(t){const{pauseTime:e,startTime:n,prevPauseTime:i}=this.recorder;return ((this.paused?i:z())-n-e)/(t?this._initData.duration/this.rate:this.actualDuration())}_getMoveDistance(){if(!this.moving)return 0;let t,{x:e}=this.position;const n=this._initData.width-this._options.container.width;if(this.direction==="none")t=e-n;else {const i=this._getMovePercent(true);this.direction==="left"?t=e+(this._options.container.width-e)*i:t=e-(e+this.getWidth())*i-n;}return t}_format(){if(this.direction==="left")return;if(this.direction==="none"){this.setStyle("transform",`translateX(${this._getMoveDistance()}px) translateY(${this.position.y}px)`);return}const t=this._initData.width-this._options.container.width,e=this.position.x+this.getWidth();this._updateDuration((e-t)/this._getSpeed(),false),this.paused?(this.resume(v),this.pause(v)):(this.pause(v),this.resume(v));}pause(t){!this.moving||this.paused||(this.paused=true,this.recorder.prevPauseTime=z(),this.direction==="none"?this.moveTimer&&this.moveTimer.clear():(this.setStyle("zIndex","3"),this.setStyle("transitionDuration","0ms"),this.setStyle("transform",`translateX(${this._getMoveDistance()}px) translateY(${this.position.y}px)`)),t!==v&&this.pluginSystem.lifecycle.pause.emit(this));}resume(t){if(!this.moving||!this.paused)return;this.paused=false,this.recorder.pauseTime+=z()-this.recorder.prevPauseTime,this.recorder.prevPauseTime=0;const e=(1-this._getMovePercent())*this.actualDuration();if(this.direction==="none"){if(this.moveTimer){let n=setTimeout(this.moveTimer.cb||(()=>{}),e);this.moveTimer.clear=()=>{clearTimeout(n),n=null;};}}else {const n=this.direction==="left"?this._options.container.width:-this.getWidth();this.setStyle("zIndex","1"),this.setStyle("transitionDuration",`${e}ms`),this.setStyle("transform",`translateX(${n}px) translateY(${this.position.y}px)`);}t!==v&&this.pluginSystem.lifecycle.resume.emit(this);}remove(t){this.pluginSystem.remove(t);}use(t){return typeof t=="function"&&(t=t(this)),t.name||(t.name=`__flexible_danmaku_plugin_${U.danmu++}__`),this.pluginSystem.useRefine(t),t}}class Yn{_options;rows=0;container=new Un;tracks=[];_fx=new mn;_sets={view:new Set,flexible:new Set,stash:[]};_addDestroyQueue=Vn({ms:3e3,processor:t=>t.forEach(e=>e.destroy())});constructor(t){this._options=t;}len(){const{stash:t,view:e,flexible:n}=this._sets;return {stash:t.length,flexible:n.size,view:e.size+n.size,all:e.size+n.size+t.length}}add(t,e,n){const i=t instanceof W?t:{data:t,options:e};this._sets.stash[n?"unshift":"push"](i);}updateOptions(t){this._options=Object.assign(this._options,t),P(t,"gap")&&(this._options.gap=this.container._toNumber("width",this._options.gap)),P(t,"trackHeight")&&this.format();}clear(t){if(!t||t==="facile"){for(let e=0;e<this.tracks.length;e++)this.tracks[e].clear();this._sets.view.clear(),this._sets.stash.length=0;}if(!t||t==="flexible"){for(const e of this._sets.flexible)e.destroy();this._sets.flexible.clear();}}each(t){for(const e of this._sets.flexible)if(!e.isEnded&&t(e)===false)return;for(const e of this._sets.view)if(!e.isEnded&&t(e)===false)return}asyncEach(t){let e=false;const n=Array.from(this._sets.flexible);return lt(n.length,i=>{if(!n[i].isEnded&&t(n[i])===false)return e=true,false},17).then(()=>{if(e)return;const i=Array.from(this._sets.view);return lt(i.length,s=>{if(!i[s].isEnded)return t(i[s])},17)})}format(){const{width:t,height:e}=this.container;this.container._format();const{gap:n,trackHeight:i}=this._options;this._options.gap=this.container._toNumber("width",n);const s=this.container._toNumber("height",i);if(s<=0){for(let a=0;a<this.tracks.length;a++)this.tracks[a].clear();return}const o=this.rows=+(this.container.height/s).toFixed(0);for(let a=0;a<o;a++){const l=this.tracks[a],c=s*a,d=s*(a+1)-1,h=(d-c)/2+c,u={top:c,middle:h,bottom:d};if(d>this.container.height)this.rows--,l&&(this.tracks[a].clear(),this.tracks.splice(a,1));else if(l)l.location.middle>this.container.height?this.tracks[a].clear():l.each(m=>{m._format(t,e,l);}),l._updateLocation(u);else {const m=new jn({index:a,list:[],location:u,container:this.container});this.tracks.push(m);}}if(this.tracks.length>this.rows){for(let a=this.rows;a<this.tracks.length;a++)this.tracks[a].clear();this.tracks.splice(this.rows,this.tracks.length-this.rows);}for(const a of this._sets.flexible)a.position.y>this.container.height?a.destroy():t!==this.container.width&&a._format();}renderFlexibleDanmaku(t,e,{hooks:n,statuses:i,danmakuPlugin:s}){p(this.container,"Container not formatted"),n.render.call(null,"flexible");const o=this._create("flexible",t,e,i);if(o.position.x>this.container.width||o.position.y>this.container.height)return  false;e.plugin&&o.use(e.plugin),o.use(s);const{prevent:a}=n.willRender.call(null,{type:"flexible",danmaku:o,prevent:false,trackIndex:null});if(this._options.rate>0&&a!==true){const l=()=>{o._createNode(),this._sets.flexible.add(o),this._setAction(o,i).then(c=>{if(c){console.error('Currently in a freeze state, unable to render "FlexibleDanmaku"');return}if(o.isLoop){o._setStartStatus(),l();return}o.destroy(),this.len().all===0&&n.finished.call(null);});};return l(),true}return  false}renderFacileDanmaku({hooks:t,statuses:e,danmakuPlugin:n}){const{mode:i,limits:s}=this._options,o=()=>{const a=this.len();let l=a.stash;if(typeof s.view=="number"){const c=s.view-a.view;l>c&&(l=c);}if(i==="strict"&&l>this.rows&&(l=this.rows),!(l<=0))return t.render.call(null,"facile"),lt(l,()=>this._consumeFacileDanmaku(e,n,t))};i==="strict"?this._fx.add(a=>{const l=o();l?l.then(a):a();}):o();}_consumeFacileDanmaku(t,e,n){let i;const s=this._sets.stash.shift();if(!s)return;const o=this._getTrack();if(!o)return this._sets.stash.unshift(s),false;s instanceof W?i=s:(i=this._create("facile",s.data,s.options,t),s.options.plugin&&i.use(s.options.plugin),i.use(e));const{prevent:a}=n.willRender.call(null,{type:"facile",danmaku:i,prevent:false,trackIndex:o.index});if(this._options.rate>0&&a!==true){i._createNode(),i._appendNode(this.container.node),i._updateTrack(o);const l=()=>{this._sets.view.add(i),this._setAction(i,t).then(h=>{if(h){i._reset(),this._sets.view.delete(i),this._sets.stash.unshift(i);return}if(i.isLoop){i._setStartStatus(),l();return}this._addDestroyQueue(i),this.len().all===0&&n.finished.call(null);});};let c=0;const d=()=>{H(()=>{const h=i.getHeight();if(h===0&&++c<20)d();else {const u=o.location.middle-h/2;if(u+h>this.container.height)return;i._updatePosition({y:u}),l();}});};d();}}_setAction(t,e){return new Promise(n=>{H(()=>{if(e.freeze===true){n(true);return}const{mode:i,durationRange:s}=this._options;if(t.type==="facile"){const o=this._calculateSpeed(t._options.speed);if(o)t._updateDuration(t._summaryWidth()/o,true);else if(i==="strict"||i==="adaptive"){p(t.track,"Track not found");const a=t.track._last(1);if(a&&t.loops===0){const l=this._collisionPrediction(a,t);if(l!==null){if(bn(s,l))t._updateDuration(l,true);else if(i==="strict"){n(true);return}}}}}else t.type==="flexible"&&t.use({appendNode:()=>{const o=this._calculateSpeed(t._options.speed);o&&t._updateDuration((t.position.x+t.getWidth())/o,true);}});t._appendNode(this.container.node),H(()=>{e.freeze===true?(t._removeNode(v),n(true)):t._setOff().then(()=>n(false));});});})}_create(t,e,n,i){p(this.container,"Container not formatted");const s={data:e,internalStatuses:i,rate:n.rate,speed:n.speed,container:this.container,duration:n.duration,direction:n.direction,progress:n.progress,delInTrack:o=>{J(this._sets.view,o),J(t==="facile"?this._sets.stash:this._sets.flexible,o);}};if(t==="facile")return new W(s);{const o=new pe(s),{position:a}=n;if(typeof a=="function")o.use({appendNode:()=>{let{x:l,y:c}=a(o,this.container);l=this.container._toNumber("width",l),c=this.container._toNumber("height",c),o._updatePosition({x:l,y:c});}});else {const l=this.container._toNumber("width",a.x),c=this.container._toNumber("height",a.y);o._updatePosition({x:l,y:c});}return o}}_calculateSpeed(t){return t&&typeof t=="string"&&(t=this.container._toNumber("width",t),p(fn(t)&&t>0,`The speed must > 0, but the current value is "${t}"`)),t}_getTrack(t=new Set,e){if(this.rows===0)return null;const{gap:n,mode:i}=this._options;if(t.size===this.tracks.length)return i==="adaptive"&&e||null;const s=he(t,this.rows),o=this.tracks[s];if(!o.isLock){if(i==="none")return o;const a=o._last(0);if(!a)return o;const l=a.getWidth();if(l>0&&a._getMoveDistance()>=n+l)return o}return t.add(s),this._getTrack(t,o)}_collisionPrediction(t,e){const n=e._getSpeed(),i=t._getSpeed(),s=n-i;if(s<=0)return null;const o=e.getWidth(),a=t.getWidth(),{gap:l}=this._options;if((t._getMoveDistance()-o-a-l)/s>=e.duration)return null;p(this.container,"Container not formatted");const h=(1-t._getMovePercent())*t.duration,u=(o+l)*h/this.container.width;return h+u}}class Kn{options;version="0.18.0";nextFrame=H;statuses=Object.create(null);pluginSystem=Gn();_engine;_renderTimer=null;_internalStatuses=Object.create(null);constructor(t){this.options=t,this._engine=new Yn(t),this._internalStatuses.freeze=false,this._internalStatuses.viewStatus="show",this._internalStatuses.styles=Object.create(null),this._internalStatuses.styles.opacity="",this.pluginSystem.lifecycle.init.emit(this);}_mergeOptions(t){const e=t||Object.create(null);if("rate"in e||(e.rate=this.options.rate),"speed"in e||(e.speed=this.options.speed),"direction"in e||(e.direction=this.options.direction),!("duration"in e)){const n=Tn(...this.options.durationRange);p(n>0,`Invalid duration "${n}"`),e.duration=n;}return e}_setViewStatus(t,e){return new Promise(n=>{if(this._internalStatuses.viewStatus===t){n();return}this._internalStatuses.viewStatus=t,this.pluginSystem.lifecycle[t].emit(),this._engine.asyncEach(i=>{if(this._internalStatuses.viewStatus===t)(!e||e(i)!==true)&&i[t]();else return  false}).then(n);})}get container(){return this._engine.container}get trackCount(){return this._engine.tracks.length}len(){return this._engine.len()}isShow(){return this._internalStatuses.viewStatus==="show"}isFreeze(){return this._internalStatuses.freeze===true}isPlaying(){return this._renderTimer!==null}isDanmaku(t){return t instanceof W||t instanceof pe}each(t){this._engine.each(t);}asyncEach(t){return this._engine.asyncEach(t)}getTrack(t){return t=t>=0?t:this.trackCount+t,this._engine.tracks[t]}freeze({preventEvents:t=[]}={}){let e,n;t.includes("stop")&&(e=v),t.includes("pause")&&(n=v),this.stopPlaying(e),this.each(i=>i.pause(n)),this._internalStatuses.freeze=true,this.pluginSystem.lifecycle.freeze.emit();}unfreeze({preventEvents:t=[]}={}){let e,n;t.includes("start")&&(e=v),t.includes("resume")&&(n=v),this.each(i=>i.resume(n)),this.startPlaying(e),this._internalStatuses.freeze=false,this.pluginSystem.lifecycle.unfreeze.emit();}format(){this._engine.format(),this.pluginSystem.lifecycle.format.emit();}mount(t,{clear:e=true}={}){if(t){if(typeof t=="string"){const n=document.querySelector(t);p(n,`Invalid selector "${t}"`),t=n;}this.isPlaying()&&e&&this.clear(null,v),this._engine.container._mount(t),this.format(),this.pluginSystem.lifecycle.mount.emit(t);}}unmount(){const{parentNode:t}=this.container;this.container._unmount(),this.pluginSystem.lifecycle.unmount.emit(t);}clear(t,e){this._engine.clear(t),e!==v&&this.pluginSystem.lifecycle.clear.emit(t);}updateOptions(t,e){this._engine.updateOptions(t),this.options=Object.assign(this.options,t),P(t,"interval")&&(this.stopPlaying(v),this.startPlaying(v)),this.pluginSystem.lifecycle.updateOptions.emit(t,e);}startPlaying(t){if(this.isPlaying())return;t!==v&&this.pluginSystem.lifecycle.start.emit();const e=()=>{this._renderTimer=setTimeout(e,this.options.interval),this.render();};e();}stopPlaying(t){this.isPlaying()&&(this._renderTimer&&clearTimeout(this._renderTimer),this._renderTimer=null,t!==v&&this.pluginSystem.lifecycle.stop.emit());}show(t){return this._setViewStatus("show",t)}hide(t){return this._setViewStatus("hide",t)}canPush(t){let e=true;const n=t==="facile",{limits:i}=this.options,{stash:s,view:o}=this._engine.len();return n?e=s<i.stash:typeof i.view=="number"&&(e=o<i.view),e}unshift(t,e){return this.push(t,e,v)}push(t,e,n){if(!this.canPush("facile")){const{stash:s}=this.options.limits,o=this.pluginSystem.lifecycle.limitWarning;return o.isEmpty()?console.warn(`The number of danmu in temporary storage exceeds the limit (${s})`):o.emit("facile",s),false}const i=n===v;return this.isDanmaku(t)||(e=this._mergeOptions(e)),this._engine.add(t,e,i),this.pluginSystem.lifecycle.push.emit(t,"facile",i),true}pushFlexibleDanmaku(t,e){if(!this.isPlaying()||typeof e.duration=="number"&&e.duration<0)return  false;if(!this.canPush("flexible")){const{view:i}=this.options.limits,s=this.pluginSystem.lifecycle.limitWarning;return s.isEmpty()?console.warn(`The number of danmu in view exceeds the limit (${i})`):s.emit("flexible",i||0),false}return this._engine.renderFlexibleDanmaku(t,this._mergeOptions(e),{statuses:this._internalStatuses,danmakuPlugin:Ft(this.pluginSystem),hooks:{finished:()=>this.pluginSystem.lifecycle.finished.emit(),render:i=>this.pluginSystem.lifecycle.render.emit(i),willRender:i=>this.pluginSystem.lifecycle.willRender.emit(i)}})?(this.pluginSystem.lifecycle.push.emit(t,"flexible",false),true):false}updateOccludedUrl(t,e){let n;if(e){if(typeof e=="string"){const i=document.querySelector(e);p(i,`Invalid selector "${e}"`),e=i;}n=(i,s)=>e.style[i]=s;}else n=(i,s)=>this.container.setStyle(i,s);t?(p(typeof t=="string",`Invalid url "${t}"`),n("maskImage",`url("${t}")`),n("webkitMaskImage",`url("${t}")`),n("maskSize","cover"),n("webkitMaskSize","cover")):(n("maskImage","none"),n("webkitMaskImage","none"));}render(){this._engine.renderFacileDanmaku({statuses:this._internalStatuses,danmakuPlugin:Ft(this.pluginSystem),hooks:{finished:()=>this.pluginSystem.lifecycle.finished.emit(),render:t=>this.pluginSystem.lifecycle.render.emit(t),willRender:t=>this.pluginSystem.lifecycle.willRender.emit(t)}});}remove(t){this.pluginSystem.remove(t);}use(t){return typeof t=="function"&&(t=t(this)),t.name||(t.name=`__runtime_plugin_${U.runtime++}__`),this.pluginSystem.useRefine(t),t}setStyle(t,e){const{styles:n}=this._internalStatuses;n[t]!==e&&(n[t]=e,this._engine.asyncEach(i=>{i.moving&&i.setStyle(t,e);}));}setOpacity(t){typeof t=="string"&&(t=Number(t)),t<0?t=0:t>1&&(t=1),this.setStyle("opacity",String(t));}setArea(t){vn(t)||(this._engine.container._updateSize(t),this.format());}setGap(t){this.updateOptions({gap:t},"gap");}setMode(t){this.updateOptions({mode:t},"mode");}setSpeed(t){this.updateOptions({speed:t},"speed");}setRate(t){t!==this.options.rate&&this.updateOptions({rate:t},"rate");}setInterval(t){this.updateOptions({interval:t},"interval");}setTrackHeight(t){this.updateOptions({trackHeight:t},"trackHeight");}setDurationRange(t){this.updateOptions({durationRange:t},"durationRange");}setDirection(t){this.updateOptions({direction:t},"direction");}setLimits({view:t,stash:e}){let n=false;const i=Object.assign({},this.options.limits);typeof t=="number"&&(n=true,i.view=t),typeof e=="number"&&(n=true,i.stash=e),n&&this.updateOptions({limits:i},"limits");}}const Xn=r=>{const t=Object.assign({gap:0,rate:1,limits:{},interval:500,mode:"strict",direction:"right",trackHeight:"20%",durationRange:[4e3,6e3]},r);return p(t.gap>=0,"Gap must be greater than or equal to 0"),typeof t.limits.stash!="number"&&(t.limits.stash=1/0),t};function Zn(r){const t=Xn(r),e=new Kn(t);if(t.plugin){const n=Array.isArray(t.plugin)?t.plugin:[t.plugin];for(const i of n)e.use(i);e.pluginSystem.lifecycle.init.emit(e);}return e}const S=R("dAnime:CommentRenderer"),X=r=>r*1e3,Jn="bold",Qn="'MS PGothic', 'sans-serif'",Ot=24,ti="1px 1px 2px #000, -1px -1px 2px #000, 1px -1px 2px #000, -1px 1px 2px #000",$t=2e3,Ht=16,ei=24,Z=4,ni=18,ii=60,Wt=1.2,qt=["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"];class dt{constructor(t,e,n,i,s,o){this.container=t,this.media=e,this.laneCount=i,this.baseDurationMs=s,this.applyStyle=o,this.durationMs=s,this.host=document.createElement("div"),this.host.style.position="absolute",this.host.style.top="0",this.host.style.left="0",this.host.style.width="100%",this.host.style.height="100%",this.host.style.pointerEvents="none",this.container.appendChild(this.host),this.manager=Zn({direction:"right",gap:0,interval:16,trackHeight:`${Math.max(24,Math.floor(this.container.clientHeight/(this.laneCount||1))||24)}px`,durationRange:[this.durationMs,this.durationMs],mode:"strict",rate:1,limits:{stash:Number.POSITIVE_INFINITY}}),this.manager.container.setStyle("position","absolute"),this.manager.container.setStyle("top","0"),this.manager.container.setStyle("left","0"),this.manager.container.setStyle("width","100%"),this.manager.container.setStyle("height","100%"),this.manager.container.setStyle("pointerEvents","none");const a={name:"danime-comment-style",$createNode:(h,u)=>{u.textContent=h.data.text,u.style.position="absolute",u.style.whiteSpace="nowrap",u.style.pointerEvents="none",u.style.willChange="transform",this.applyStyle(u,h.data.style);},$appendNode:(h,u)=>{this.applyStyle(u,h.data.style);}};this.manager.use(a),this.manager.mount(this.host),this.manager.setGap(0),this.manager.setLimits({view:Number.POSITIVE_INFINITY,stash:Number.POSITIVE_INFINITY}),this.manager.setRate(1),this.manager.setDirection("right"),this.updateLayoutMetrics(),this.manager.startPlaying();const l=()=>{this.isFrozen=false,this.syncPlaybackState();},c=()=>{this.isFrozen=true,this.syncPlaybackState();},d=()=>{this.playbackRate=this.media.playbackRate||1,this.syncPlaybackState();};this.media.addEventListener("play",l),this.media.addEventListener("pause",c),this.media.addEventListener("ratechange",d),this.cleanupTasks.push(()=>{this.media.removeEventListener("play",l),this.media.removeEventListener("pause",c),this.media.removeEventListener("ratechange",d);}),this.speed=n,this.resize(),this.syncPlaybackState();}manager;host;cleanupTasks=[];speedPerMs=0;playbackRate=1;isFrozen=false;width=0;height=0;durationMs;get speed(){return this.speedPerMs*1e3}set speed(t){const e=Number.isFinite(t)&&t>0?t/1e3:0;this.speedPerMs=e,this.updateTiming();}emit(t){const e={...t,style:t.style?{...t.style}:void 0};this.manager.push(e,{duration:this.durationMs,direction:"left",rate:1,speed:this.speedPerMs>0?this.speedPerMs:void 0});}clear(){this.manager.clear();}resize(){const t=this.container.getBoundingClientRect();t.width<=0||t.height<=0||(this.width=t.width,this.height=t.height,this.host.style.width=`${this.width}px`,this.host.style.height=`${this.height}px`,this.manager.container.setStyle("width",`${this.width}px`),this.manager.container.setStyle("height",`${this.height}px`),this.manager.container.width=this.width,this.manager.container.height=this.height,this.manager.setLimits({view:Number.POSITIVE_INFINITY,stash:Number.POSITIVE_INFINITY}),this.updateLayoutMetrics(),this.updateTiming());}play(){this.manager.startPlaying();}pause(){this.manager.stopPlaying();}show(){this.manager.show();}hide(){this.manager.hide();}seek(){this.clear();}destroy(){this.clear(),this.manager.stopPlaying(),this.manager.unmount(),this.cleanupTasks.forEach(t=>{try{t();}catch{}}),this.cleanupTasks.length=0,this.host.remove();}updateTiming(){if(this.width<=0)return;const t=this.speedPerMs>0?Math.max(500,Math.round(this.width/this.speedPerMs)):this.baseDurationMs;this.durationMs=t,this.manager.setDurationRange([this.durationMs,this.durationMs]);const e=this.speedPerMs>0?this.speedPerMs:this.durationMs>0?this.width/this.durationMs:0;e>0?this.manager.setSpeed(e):this.manager.setSpeed(void 0);}syncPlaybackState(){const t=this.media.paused||this.media.readyState<2,e=this.media.playbackRate||this.playbackRate||1;this.playbackRate=e,this.manager.setRate(e>0?e:1),t||this.isFrozen?(this.manager.freeze(),this.manager.stopPlaying()):(this.manager.unfreeze(),this.manager.isPlaying()||this.manager.startPlaying());}updateLayoutMetrics(){if(this.width<=0||this.height<=0)return;const t=Math.max(18,Math.floor(this.height/Math.max(1,this.laneCount)));this.manager.setTrackHeight(t);const e=Math.max(t,this.width*.02);this.manager.setGap(Math.round(e)),this.manager.setLimits({view:Number.POSITIVE_INFINITY,stash:Number.POSITIVE_INFINITY});}}const Bt=()=>{const r=document;return r.fullscreenElement??r.webkitFullscreenElement??r.mozFullScreenElement??r.msFullscreenElement??null};class fe{_settings;danmaku=null;allComments=[];lastEmittedIndex=-1;canvas=null;videoElement=null;currentTime=0;duration=0;finalPhaseActive=false;keyboardHandler=null;sizeObserver=null;isResizeObserverAvailable;container=null;resizeRetryHandle=null;fullscreenEventsAttached=false;scrollListenerAttached=false;watchdogCleanup=null;cachedFontSizePx=Ot;applyDanmuStyleToNode=(t,e)=>{if(e?.font)t.style.font=e.font;else {const a=this.computeFontSizePx();t.style.font=this.composeFontString(void 0,a);}e?.color?t.style.color=e.color:t.style.color=this._settings.commentColor;const n=typeof e?.textShadow=="string"&&e.textShadow.trim().length>0?e.textShadow:"1px 1px 3px rgba(0, 0, 0, 0.85)";t.style.textShadow=n;const i=typeof e?.opacity=="string"&&e.opacity.length>0?e.opacity:void 0,s=typeof e?.globalAlpha=="number"?e.globalAlpha.toString():void 0;t.style.opacity=i??s??"1";const o=typeof e?.strokeStyle=="string"&&e.strokeStyle.length>0?e.strokeStyle:null;if(o&&e?.lineWidth!==void 0){const a=typeof e.lineWidth=="number"?e.lineWidth:Number(e.lineWidth)||0,l=Number.isFinite(a)?Math.min(Math.max(a,0),1.5):0;l>0?(t.style.setProperty("-webkit-text-stroke",`${l}px ${o}`),t.style.setProperty("text-stroke",`${l}px ${o}`)):(t.style.removeProperty("-webkit-text-stroke"),t.style.removeProperty("text-stroke"));}(!e?.strokeStyle||e.lineWidth===void 0)&&(t.style.removeProperty("-webkit-text-stroke"),t.style.removeProperty("text-stroke"));};isFirefox(){return /firefox/i.test(navigator.userAgent)}waitVideoReady(t,e){const n=()=>t.readyState>=1&&(t.videoWidth??0)>0&&(t.videoHeight??0)>0;if(n()){e();return}const i=()=>{n()&&(t.removeEventListener("loadedmetadata",i),e());};t.addEventListener("loadedmetadata",i,{once:true});}constructor(t){this._settings=t?{...t}:L(),this.isResizeObserverAvailable=typeof ResizeObserver<"u";}get settings(){return this._settings}set settings(t){this._settings={...t};}initialize(t){try{S.debug("initialize:start",{readyState:t.readyState,duration:t.duration}),this.danmaku&&this.destroy(),this.videoElement=t,this.duration=X(t.duration),S.info("videoRenderer:boundVideo",{src:this.resolveVideoSource(t),videoId:t.dataset?.videoId??null,durationMs:this.duration});const e=document.createElement("div");e.style.position="absolute",e.style.pointerEvents="none",e.style.zIndex="1000",e.style.top="0px",e.style.left="0px";const n=t.getBoundingClientRect();e.style.width=`${n.width}px`,e.style.height=`${n.height}px`;const i=t.parentElement??document.body;i.style.position=i.style.position||"relative",i.appendChild(e),this.container=e;const s=()=>{const o=n.width/Z;if(this.isFirefox())S.info("danmakuEngine:selected",{engineMode:"dom",library:"danmu"}),this.danmaku=new dt(e,t,o,ei,Z*1e3,this.applyDanmuStyleToNode),this.canvas=null;else {const a="canvas";S.info("danmakuEngine:selected",{engineMode:a,library:"danmaku"}),this.danmaku=new N({container:e,media:t,comments:[],engine:a,speed:o}),this.bindDanmakuWatchdog(t),this.canvas=e.querySelector("canvas");const l=this.danmaku;let c=5;const d=window.setInterval(()=>{try{const h=l?._?.requestID??0,u=!!l?._?.paused;!t.paused&&(h===0||u)&&(l?.resize?.(),l?.play?.());}catch{}c-=1,c<=0&&window.clearInterval(d);},1e3);}};t.readyState<1||(t.videoWidth??0)===0||(t.videoHeight??0)===0?this.waitVideoReady(t,s):s(),this.setupVideoEventListeners(t),this.setupKeyboardShortcuts(),this.setupResizeListener(e),S.debug("initialize:completed");}catch(e){throw S.error("CommentRenderer.initialize",e),e}}addComment(t,e,n){if(this.isNGComment(t)||this.allComments.some(o=>o.text===t&&o.time===e/1e3))return null;const s={text:t,time:e/1e3,style:this.createCommentStyle(),commands:n?[...n]:void 0};return this.allComments.push(s),this.allComments.sort((o,a)=>o.time-a.time),s}clearComments(){this.allComments=[],this.lastEmittedIndex=-1,this.finalPhaseActive=false,this.danmaku?.clear();}resetState(){this.clearComments(),this.currentTime=0,this.finalPhaseActive=false;}destroy(){const t=this.videoElement;t&&S.info("videoRenderer:unbindVideo",{src:this.resolveVideoSource(t),videoId:t.dataset?.videoId??null}),this.watchdogCleanup?.(),this.watchdogCleanup=null,this.keyboardHandler?.stopListening(),this.keyboardHandler=null,this.teardownResizeListener(),this.danmaku?.destroy(),this.danmaku=null,this.videoElement=null,this.container=null;}bindDanmakuWatchdog(t){if(this.watchdogCleanup?.(),!this.danmaku||this.danmaku instanceof dt){this.watchdogCleanup=null;return}const e=this.danmaku;if(!e)return;const n=()=>!!(e._&&e._.paused),i=()=>e._&&e._.requestID||0,s=()=>{const w=e._&&e._.stage;if(!w)return null;const I=w.getBoundingClientRect();return {w:Math.round(I.width),h:Math.round(I.height)}};let o=s();const a=()=>{try{!t.paused&&n()&&i()===0&&(e.play?.(),S.debug("danmaku:resumed-by-watchdog",{ct:t.currentTime,rs:t.readyState}));}catch(w){S.warn("danmaku:resume-failed",w);}},l=()=>{try{e.seek?.(),S.debug("danmaku:seek-synced",{ct:t.currentTime});}catch(w){S.warn("danmaku:seek-sync-failed",w);}},c=()=>{try{const w=s();w&&o&&(w.w!==o.w||w.h!==o.h)&&(e.resize?.(),S.debug("danmaku:resized",{from:o,to:w})),o=w||o;}catch(w){S.warn("danmaku:resize-failed",w);}},d=()=>{a(),c();},h=()=>{a();},u=()=>{l(),a(),c();},m=()=>{l(),a();},y=()=>{a();};t.addEventListener("timeupdate",d),t.addEventListener("playing",h),t.addEventListener("loadedmetadata",u),t.addEventListener("seeked",m),t.addEventListener("ratechange",y),window.addEventListener("resize",c),document.addEventListener("fullscreenchange",c),this.watchdogCleanup=()=>{t.removeEventListener("timeupdate",d),t.removeEventListener("playing",h),t.removeEventListener("loadedmetadata",u),t.removeEventListener("seeked",m),t.removeEventListener("ratechange",y),window.removeEventListener("resize",c),document.removeEventListener("fullscreenchange",c);};}updateSettings(t){const e=this.settings;this.settings=t,this.danmaku&&this.syncWithDanmaku(e);}getVideoElement(){return this.videoElement}getCurrentVideoSource(){const t=this.videoElement;return t?this.resolveVideoSource(t):null}getCommentsSnapshot(){return this.allComments.map(t=>({...t,style:{...t.style},commands:t.commands?[...t.commands]:void 0}))}isNGComment(t){try{return typeof t!="string"||Array.isArray(this._settings.ngWords)&&this._settings.ngWords.some(e=>typeof e=="string"&&e.length&&t.includes(e))?!0:Array.isArray(this._settings.ngRegexps)?this._settings.ngRegexps.some(e=>{try{return typeof e=="string"&&e.length?new RegExp(e).test(t):!1}catch(n){return S.error("CommentRenderer.isNGComment.regex",n,{pattern:e,text:t}),!1}}):!1}catch(e){return S.error("CommentRenderer.isNGComment",e,{text:t}),true}}updateComments(){const t=this.videoElement;if(!t||!this.danmaku)return;this.currentTime=X(t.currentTime);const e=this.duration>0&&this.duration-this.currentTime<=1e4;e&&!this.finalPhaseActive&&(this.finalPhaseActive=true,this.danmaku.clear()),!e&&this.finalPhaseActive&&(this.finalPhaseActive=false);const n=this.danmaku instanceof dt?250:2e3,i=this.currentTime+n;for(let s=this.lastEmittedIndex+1;s<this.allComments.length;s++){const o=this.allComments[s];if(o.time*1e3<=i)this.isNGComment(o.text)||this.danmaku.emit({...o,style:this.createCommentStyle(o.style)}),this.lastEmittedIndex=s;else break}}onSeek(){if(!this.videoElement||!this.danmaku)return;this.finalPhaseActive=false,this.currentTime=X(this.videoElement.currentTime),this.danmaku.clear();const t=this.videoElement.currentTime;let e=-1;for(let n=0;n<this.allComments.length;n++)if(this.allComments[n].time>=t){e=n-1;break}this.lastEmittedIndex=e;}lastReportedZeroSize=false;resize(t,e){if(!this.danmaku||!this.container)return;this.resizeRetryHandle&&(cancelAnimationFrame(this.resizeRetryHandle),this.resizeRetryHandle=null);const n=this.videoElement,i=n?.getBoundingClientRect(),s=t??i?.width??this.container.clientWidth,o=e??i?.height??this.container.clientHeight;if(s<=0||o<=0){requestAnimationFrame(()=>this.resize());return}n&&i&&this.updateContainerPlacement(i);const a=window.devicePixelRatio||1;this.canvas&&this.canvas.getContext("2d")?.setTransform(a,0,0,a,0,0),this.container.style.width=`${s}px`,this.container.style.height=`${o}px`,this.danmaku.resize(),this.danmaku.speed=s/Z*(this.videoElement?.playbackRate??1);}setupVideoEventListeners(t){try{t.addEventListener("seeking",()=>this.onSeek()),t.addEventListener("ratechange",()=>{if(this.danmaku){const n=(this.container?.clientWidth??0)/Z;this.danmaku.speed=n*t.playbackRate;}}),t.addEventListener("timeupdate",()=>this.updateComments()),t.addEventListener("loadedmetadata",()=>{this.resize(),requestAnimationFrame(()=>this.resize());}),t.addEventListener("play",()=>{this.resize();});}catch(e){throw S.error("CommentRenderer.setupVideoEventListeners",e),e}}setupKeyboardShortcuts(){try{this.keyboardHandler=new te,this.keyboardHandler.addShortcut("C","Shift",()=>{try{this._settings.isCommentVisible=!this._settings.isCommentVisible,this._settings.isCommentVisible?this.danmaku?.show():this.danmaku?.hide(),window.dAniRenderer?.settingsManager?.updateSettings(this._settings);}catch(t){S.error(t,"CommentRenderer.keyboardShortcut");}}),this.keyboardHandler.startListening();}catch(t){S.error(t,"CommentRenderer.setupKeyboardShortcuts");}}_observedEl;_onFullscreenChange;_lastDpr=1;_handleWindowResize;setupResizeListener(t){try{this.teardownResizeListener(),this.isResizeObserverAvailable?(this.sizeObserver=new ResizeObserver(e=>{try{const n=e.find(i=>i.target===t);if(!n)return;n.contentRect.width<=0||n.contentRect.height<=0?requestAnimationFrame(()=>this.resize()):this.resize(n.contentRect.width,n.contentRect.height);}catch(n){S.error(n,"CommentRenderer.resizeObserver");}}),this.sizeObserver.observe(t)):window.addEventListener("resize",this.handleWindowResize),this.addViewportEventListeners(),this.resize(),requestAnimationFrame(()=>this.resize()),this.resize();}catch(e){S.error(e,"CommentRenderer.setupResizeListener");}}teardownResizeListener(){if(this.sizeObserver){if(this._observedEl)try{this.sizeObserver.unobserve(this._observedEl);}catch{}this.sizeObserver.disconnect(),this.sizeObserver=null;}this.isResizeObserverAvailable||window.removeEventListener("resize",this.handleWindowResize),this._onFullscreenChange&&(document.removeEventListener("fullscreenchange",this._onFullscreenChange),this._onFullscreenChange=void 0),this.removeViewportEventListeners();}forceResizeByRect(t){const e=t.getBoundingClientRect();this.resize(e.width,e.height);}handleWindowResize=()=>{this.resize();};handleWindowScroll=()=>{this.resize();};handleFullscreenChange=()=>{this.resize(),requestAnimationFrame(()=>{this.resize();});};addViewportEventListeners(){this.scrollListenerAttached||(window.addEventListener("scroll",this.handleWindowScroll,{passive:true}),this.scrollListenerAttached=true),this.fullscreenEventsAttached||(qt.forEach(t=>{document.addEventListener(t,this.handleFullscreenChange);}),this.fullscreenEventsAttached=true);}removeViewportEventListeners(){this.scrollListenerAttached&&(window.removeEventListener("scroll",this.handleWindowScroll),this.scrollListenerAttached=false),this.fullscreenEventsAttached&&(qt.forEach(t=>{document.removeEventListener(t,this.handleFullscreenChange);}),this.fullscreenEventsAttached=false);}updateContainerPlacement(t){const e=this.container,n=this.videoElement;if(!e||!n)return;this.syncContainerParent();const i=!!Bt(),s=e.parentElement;if(s){if(i)e.style.position="fixed",e.style.top=`${t.top}px`,e.style.left=`${t.left}px`;else {const o=s.getBoundingClientRect(),a=t.top-o.top,l=t.left-o.left;e.style.position="absolute",e.style.top=`${a}px`,e.style.left=`${l}px`;}e.style.width=`${t.width}px`,e.style.height=`${t.height}px`,e.style.overflow="hidden";}}syncContainerParent(){const t=this.container,e=this.videoElement;if(!t||!e)return;const n=Bt(),s=n?.contains(e)??false?n:e.parentElement;if(!s||t.parentElement===s)return;t.remove();const o=s instanceof HTMLElement?s.style:null;o&&!o.position&&(o.position="relative"),s.appendChild(t);}createCommentStyle(t){const e=this.computeFontSizePx(),n=this.composeFontString(t?.font,e),i=Number.isFinite(this._settings.commentOpacity)?Math.max(0,Math.min(1,this._settings.commentOpacity)):1,s=this.resolveStrokeWidth(t?.lineWidth,e);return {font:n,textShadow:t?.textShadow??ti,color:this._settings.commentColor,fillStyle:this._settings.commentColor,strokeStyle:t?.strokeStyle??"#000000",lineWidth:s,opacity:i.toString(),globalAlpha:i}}computeFontSizePx(){const t=this.getContainerHeight();if(t<=0)return this.cachedFontSizePx=Ot,this.cachedFontSizePx;const e=t/(Ht*Wt),n=Math.min(ii,Math.max(ni,e)),i=Math.round(n);return this.cachedFontSizePx=i,i}getContainerHeight(){if(this.container){const{height:n}=this.container.getBoundingClientRect();if(Number.isFinite(n)&&n>0)return n}const e=this.videoElement?.getBoundingClientRect()?.height;return Number.isFinite(e)&&e!==void 0&&e>0?e:this.cachedFontSizePx*Ht*Wt}composeFontString(t,e){if(typeof t=="string"&&t.trim().length>0){const n=/\d+(?:\.\d+)?px/iu;if(n.test(t))return t.replace(n,`${e}px`).trim()}return `${Jn} ${e}px ${Qn}`}resolveStrokeWidth(t,e){return Number.isFinite(t)&&t!==void 0?t:Math.max(2,Math.floor(e/12))}applySettingsToComments(){this.allComments=this.allComments.map(t=>({...t,style:this.createCommentStyle(t.style)}));}syncWithDanmaku(t){const e=this.danmaku;if(!e||(this.settings.isCommentVisible?e.show():e.hide(),!(t.commentColor!==this.settings.commentColor||t.commentOpacity!==this.settings.commentOpacity||!this.areNgListsEqual(t,this.settings))))return;this.applySettingsToComments();const i=this.videoElement,s=i?X(i.currentTime):0,o=s-$t;e.clear(),this.allComments.filter(l=>{const c=l.time*1e3;return c>s+$t||c<o?false:!this.isNGComment(l.text)}).forEach(l=>{e.emit({...l,style:this.createCommentStyle(l.style)});});}areNgListsEqual(t,e){const n=t.ngWords??[],i=e.ngWords??[],s=t.ngRegexps??[],o=e.ngRegexps??[];return n.length!==i.length||s.length!==o.length||n.some((c,d)=>c!==i[d])?false:!s.some((c,d)=>c!==o[d])}resolveVideoSource(t){if(typeof t.currentSrc=="string"&&t.currentSrc.length>0)return t.currentSrc;const e=t.getAttribute("src");if(e&&e.length>0)return e;const n=t.querySelector("source[src]");return n&&typeof n.src=="string"&&n.src.length>0?n.src:null}}class _t{shadowRoot=null;container=null;createShadowDOM(t,e={mode:"closed"}){if(!t)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=t.attachShadow(e),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(t){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const e=document.createElement("style");e.textContent=t,this.shadowRoot.appendChild(e);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}querySelectorAll(t){return this.shadowRoot?this.shadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}setHTML(t){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=t;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const ri=`\r
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
`,si=`:host {
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
`,oi=`:host {
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
`;class q{static getCommonStyles(){return ri}static getNotificationStyles(){return si}static getAutoButtonStyles(){return oi}}const jt={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class x extends _t{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new x),this.instance}static show(t,e="info",n=3e3){try{const i=this.getInstance();return i.initialize(),i.initialized?i.createNotification(t,e,n):null}catch(i){return console.error("[NotificationManager] show failed",i),null}}static removeNotification(t){this.getInstance().removeNotification(t.element);}show(t,e="info"){x.show(t,e);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 2147483647","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(q.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(t){console.error("[NotificationManager] initialize failed",t),this.initialized=false;}}destroy(){x.notifications.forEach(t=>{t.timerId&&window.clearTimeout(t.timerId);}),x.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,x.instance=null;}createNotification(t,e,n){try{const i=this.querySelector(".notification-container");if(!i)throw new Error("Notification container not found");const s=jt[e]??jt.info,o=document.createElement("div");o.className=`notification-item ${e}`;const a=document.createElement("div");a.className="notification-icon",a.innerHTML=`<span>${s}</span>`,o.appendChild(a);const l=document.createElement("div");l.className="notification-content";const c=document.createElement("div");c.className="notification-type",c.textContent=e.charAt(0).toUpperCase()+e.slice(1),l.appendChild(c);const d=document.createElement("div");d.className="notification-message",d.textContent=t||"No message",l.appendChild(d),o.appendChild(l);const h=document.createElement("button");h.className="notification-close",h.innerHTML="&times;",h.addEventListener("click",()=>{this.removeNotification(o);}),o.appendChild(h),i.appendChild(o),requestAnimationFrame(()=>{o.classList.add("show");});const u={element:o,timerId:window.setTimeout(()=>{this.removeNotification(o);},n)};return x.notifications.push(u),u}catch(i){return console.error("[NotificationManager] createNotification failed",i),null}}removeNotification(t){if(!t)return;const e=x.notifications.find(n=>n.element===t);e?.timerId&&window.clearTimeout(e.timerId),t.classList.remove("show"),window.setTimeout(()=>{try{t.remove(),x.notifications=x.notifications.filter(n=>n.element!==t);}catch(n){console.error("[NotificationManager] removeNotification cleanup failed",n);}},500);}}const ge="https://www.nicovideo.jp",ye=`${ge}/search`,be=`${ge}/watch`,Ut={searchBase:ye,watchBase:be},ai=r=>`${be}/${r}`,ve=r=>`${ye}/${encodeURIComponent(r)}`,gt=r=>new Promise((t,e)=>{Ie({url:r.url,method:r.method??"GET",headers:r.headers,data:r.data,responseType:r.responseType??"text",timeout:r.timeout,onprogress:r.onprogress,onload:n=>{t({status:n.status,statusText:n.statusText,response:n.response,finalUrl:n.finalUrl,headers:n.responseHeaders});},onerror:n=>{const i=n?.error??"unknown error";e(new Error(`GM_xmlhttpRequest failed: ${i}`));},ontimeout:()=>{e(new Error("GM_xmlhttpRequest timeout"));}});}),ht=R("dAnime:NicoApiFetcher");class St{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(t){try{const e=this.sanitizeVideoId(t),i=(await gt({method:"GET",url:ai(e),headers:{Accept:"text/html"}})).response,a=new DOMParser().parseFromString(i,"text/html").querySelector('meta[name="server-response"]');if(!a)throw new Error("API data element not found in response");const l=a.getAttribute("content");if(!l)throw new Error("API data content is empty");const c=this.decodeServerResponse(l),h=JSON.parse(c).data?.response;if(!h)throw new Error("Invalid API data structure");return this.apiData=h,h}catch(e){throw ht.error("NicoApiFetcher.fetchApiData",e),e}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const t=this.apiData.comment?.nvComment;if(!t?.server||!t.params||!t.threadKey)throw new Error("Required comment server data is missing");const e=await gt({method:"POST",url:`${t.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:t.params,threadKey:t.threadKey,additionals:{}})}),s=(JSON.parse(e.response).data?.threads??[]).filter(a=>a.fork==="main").sort((a,l)=>(l.commentCount||0)-(a.commentCount||0))[0];if(!s)throw new Error("Main thread not found in comment response");const o=(s.comments??[]).map(a=>({text:a.body??"",vpos:a.vposMs??0,commands:a.commands??[]}));return this.comments=o,o}catch(t){throw ht.error("NicoApiFetcher.fetchComments",t),t}}async fetchAllData(t){return await this.fetchApiData(t),this.fetchComments()}sanitizeVideoId(t){try{let e=encodeURIComponent(t);return e=e.replace(/%([0-9A-F]{2})/gi,(n,i)=>{const s=parseInt(i,16);return s>=65&&s<=90||s>=97&&s<=122||s>=48&&s<=57||s===45||s===95||s===46||s===126?String.fromCharCode(s):n}),e}catch(e){return ht.error("NicoApiFetcher.sanitizeVideoId",e,{videoId:t}),t}}decodeServerResponse(t){try{return decodeURIComponent(t)}catch(e){try{const n=t.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(n)}catch{throw new Error(`API data decode failed: ${e.message}`)}}}}const Gt=R("dAnime:NicoVideoSearcher");class xe{cache=new Map;async search(t){if(!t.trim())return [];if(this.cache.has(t))return this.cache.get(t)??[];const e=ve(t),n=await this.fetchText(e),i=this.parseServerContext(n).map(a=>{const l=this.calculateLevenshteinDistance(t,a.title),c=Math.max(t.length,a.title.length),d=c>0?(1-l/c)*100:0;return {...a,levenshteinDistance:l,similarity:d}}),s=[],o=new Set;for(const a of i)a?.videoId&&(o.has(a.videoId)||(o.add(a.videoId),s.push(a)));return s.sort((a,l)=>{const c=a.similarity??-1,d=l.similarity??-1;return c!==d?d-c:l.viewCount-a.viewCount}),this.cache.set(t,s),s}async fetchText(t){return (await gt({method:"GET",url:t})).response}parseServerContext(t){try{const n=new DOMParser().parseFromString(t,"text/html").querySelector('meta[name="server-response"]');if(!n)return [];const i=n.getAttribute("content")??"",s=this.decodeHtmlEntities(i);let o;try{o=JSON.parse(s);}catch(a){return Gt.error("NicoVideoSearcher.parseServerContext",a),[]}return this.extractVideoItems(o??{})}catch(e){return Gt.error("NicoVideoSearcher.parseServerContext",e),[]}}decodeHtmlEntities(t){if(!t)return "";let e=t.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return e=e.replace(/&#(\d+);/g,(n,i)=>String.fromCharCode(parseInt(i,10))),e=e.replace(/&#x([0-9a-fA-F]+);/g,(n,i)=>String.fromCharCode(parseInt(i,16))),e}extractVideoItems(t){const e=[],n=s=>{const o=(s?.id??s?.contentId??s?.watchId??"").toString();if(!o)return;const a=(s?.title??s?.shortTitle??"").toString(),l=s?.count??{},c=Number(l.view??s?.viewCounter??0)||0,d=Number(l.comment??s?.commentCounter??0)||0,h=Number(l.mylist??s?.mylistCounter??0)||0,u=s?.thumbnail??{},m=(u.nHdUrl||u.listingUrl||u.largeUrl||u.middleUrl||u.url||s?.thumbnailUrl||"").toString(),y=(s?.registeredAt||s?.startTime||s?.postedDateTime||"")?.toString?.()??"",w=s?.owner&&typeof s.owner=="object"?{nickname:(s.owner.nickname??s.owner.name??"")||void 0,name:(s.owner.name??s.owner.nickname??"")||void 0}:null,I=(s?.isChannelVideo||s?.owner?.ownerType==="channel")&&s?.owner?{name:s.owner.name??""}:null;a&&e.push({videoId:o,title:a,viewCount:c,commentCount:d,mylistCount:h,thumbnail:m,postedAt:y,owner:w,channel:I});},i=s=>{if(!s)return;if(Array.isArray(s)){s.forEach(i);return}if(typeof s!="object"||s===null)return;const o=s;(o.id||o.contentId||o.watchId)&&n(o),Object.values(s).forEach(i);};return i(t),e}calculateLevenshteinDistance(t,e){const n=t?t.length:0,i=e?e.length:0;if(n===0)return i;if(i===0)return n;const s=new Array(i+1);for(let a=0;a<=i;++a){const l=s[a]=new Array(n+1);l[0]=a;}const o=s[0];for(let a=1;a<=n;++a)o[a]=a;for(let a=1;a<=i;++a)for(let l=1;l<=n;++l){const c=t[l-1]===e[a-1]?0:1;s[a][l]=Math.min(s[a-1][l]+1,s[a][l-1]+1,s[a-1][l-1]+c);}return s[i][n]}}const C={mypageHeaderTitle:".p-mypageHeader__title",mypageListContainer:".p-mypageMain",watchVideoElement:"video#video",mypageItem:".itemModule.list",mypageItemTitle:".line1",mypageEpisodeNumber:".number.line1 span",mypageEpisodeTitle:".episode.line1 span"};class kt{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(t){this.delay=t;}getFuncId(t){return this.funcIds.has(t)||this.funcIds.set(t,this.nextId++),this.funcIds.get(t)??0}exec(t){const e=this.getFuncId(t),n=Date.now(),i=this.timers.get(e)?.lastExec??0,s=n-i;if(s>this.delay)t(),this.timers.set(e,{lastExec:n});else {clearTimeout(this.timers.get(e)?.timerId??void 0);const o=setTimeout(()=>{t(),this.timers.set(e,{lastExec:Date.now()});},this.delay-s);this.timers.set(e,{timerId:o,lastExec:i});}}execOnce(t){const e=this.getFuncId(t),n=this.timers.get(e);if(n?.executedOnce){n.timerId&&clearTimeout(n.timerId);return}n?.timerId&&clearTimeout(n.timerId);const i=setTimeout(()=>{try{t();}finally{this.timers.set(e,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(e,{timerId:i,executedOnce:false,scheduled:true});}cancel(t){const e=this.getFuncId(t),n=this.timers.get(e);n?.timerId&&clearTimeout(n.timerId),this.timers.delete(e);}resetExecution(t){const e=this.getFuncId(t),n=this.timers.get(e);n&&(n.timerId&&clearTimeout(n.timerId),this.timers.set(e,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,t]of this.timers)t.timerId&&clearTimeout(t.timerId);this.timers.clear(),this.funcIds.clear();}}const li=1e3,ci=100,di=30,Yt=1e4,Kt=100,hi=/watch\/(?:([a-z]{2}))?(\d+)/gi,E=R("dAnime:VideoSwitchHandler"),Xt=r=>{if(!r?.video)return null;const t=r.video.registeredAt,e=t?new Date(t).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:r.video.id,title:r.video.title,viewCount:r.video.count?.view,mylistCount:r.video.count?.mylist,commentCount:r.video.count?.comment,postedAt:e,thumbnail:r.video.thumbnail?.url,owner:r.owner??null,channel:r.channel??null}},ui=r=>{const t=[];let e;for(;(e=hi.exec(r))!==null;){const[,n="",i=""]=e;i&&t.push(`${n}${i}`);}return t};class we{constructor(t,e,n,i=li,s=ci){this.renderer=t,this.fetcher=e,this.settingsManager=n,this.monitorInterval=i,this.debounce=new kt(s);}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=false;debounce;startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(t){if(!this.isSwitching){this.isSwitching=true;try{const e=await this.resolveVideoElement(t)??null,n=this.preloadedComments??this.lastPreloadedComments??null,i=e?.dataset?.videoId??e?.getAttribute?.("data-video-id")??null,s=this.nextVideoId??i??this.lastVideoId;if(!e||!s&&!n){this.handleMissingVideoInfo(n);return}E.info("videoSwitch:start",{videoId:s??null,elementVideoId:e.dataset?.videoId??null,preloadedCount:n?.length??0}),x.show("動画の切り替わりを検知しました...","info"),this.resetRendererState(e);const o=this.renderer.getVideoElement();if(o!==e&&e)E.debug("videoSwitch:rebind",{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof e.currentSrc=="string"&&e.currentSrc.length>0?e.currentSrc:e.getAttribute("src")??null}),this.renderer.initialize(e);else if(o===e&&e&&this.hasVideoSourceChanged(e))E.debug("videoSwitch:rebind:sameElement",{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(e)}),this.renderer.destroy(),this.renderer.initialize(e);else if(!o&&!e){E.warn("videoSwitch:missingVideoElement",{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let a=null;s&&(a=await this.fetchVideoApiData(s,n),a&&(this.persistVideoMetadata(a),this.lastVideoId=s));const l=await this.populateComments(s,n);if(l===0?(this.renderer.clearComments(),x.show("コメントを取得できませんでした","warning"),E.warn("videoSwitch:commentsMissing",{videoId:s??null})):E.info("videoSwitch:commentsLoaded",{videoId:s??null,count:l}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(e),a){const c=Xt(a);if(c){const d=`コメントソースを更新しました: ${c.title??"不明なタイトル"}（${l}件）`;x.show(d,l>0?"success":"warning");}}}catch(e){E.error("videoSwitch:error",e,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),x.show(`動画切り替えエラー: ${e.message}`,"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}}async resolveVideoElement(t){if(t){const i=this.getVideoSource(t),s=this.lastVideoSource;return (!i||i===s)&&await this.waitForSourceChange(t),t}const e=Date.now()+Yt;let n=null;for(;Date.now()<e;){const i=document.querySelector(C.watchVideoElement);if(i){n=i;const s=this.hasVideoSourceChanged(i);if(i.readyState>=2||!i.paused||s)return s&&(this.lastVideoSource=null),i}await new Promise(s=>window.setTimeout(s,Kt));}return n}async waitForSourceChange(t){const e=this.getVideoSource(t);if(!e)return;const n=Date.now()+Yt;for(;Date.now()<n;){const i=this.getVideoSource(t);if(i&&i!==e){this.lastVideoSource=null;return}await new Promise(s=>window.setTimeout(s,Kt));}}hasVideoSourceChanged(t){const e=this.getVideoSource(t);return e?this.lastVideoSource?this.lastVideoSource!==e:true:false}getVideoSource(t){if(!t)return null;const e=typeof t.currentSrc=="string"?t.currentSrc:"";if(e.length>0)return e;const n=t.getAttribute("src")??"";if(n.length>0)return n;const i=t.querySelector("source[src]");return i&&typeof i.src=="string"&&i.src.length>0?i.src:null}resetRendererState(t){try{t.currentTime=0;}catch(e){E.debug("videoSwitch:resetCurrentTimeFailed",e);}this.renderer.clearComments();}async checkVideoEnd(){const t=this.renderer.getVideoElement();if(!(!t||!Number.isFinite(t.duration)||t.duration-t.currentTime>di)){if(!this.nextVideoId){const n=async()=>{await this.findNextVideoId();};this.debounce.execOnce(n);}if(this.nextVideoId&&!this.preloadedComments){const n=async()=>{await this.preloadComments();};this.debounce.execOnce(n);}}}handleMissingVideoInfo(t){t||(this.renderer.clearComments(),x.show("次の動画のコメントを取得できませんでした。コメント表示をクリアします。","warning"));}async fetchVideoApiData(t,e){try{const n=await this.fetcher.fetchApiData(t);return E.debug("videoSwitch:apiFetched",{videoId:t}),n}catch(n){if(E.error("videoSwitch:apiFetchError",n,{videoId:t}),!e)throw n;return null}}persistVideoMetadata(t){const e=Xt(t);e&&this.settingsManager.saveVideoData(e.title??"",e);}async populateComments(t,e){let n=null;if(Array.isArray(e)&&e.length>0)n=e;else if(t)try{n=await this.fetcher.fetchAllData(t),E.debug("videoSwitch:commentsFetched",{videoId:t,count:n.length});}catch(s){E.error("videoSwitch:commentsFetchError",s,{videoId:t}),x.show(`コメント取得エラー: ${s.message}`,"error"),n=null;}if(!n||n.length===0)return 0;const i=n.filter(s=>!this.renderer.isNGComment(s.text));return i.forEach(s=>{this.renderer.addComment(s.text,s.vpos,s.commands);}),this.lastPreloadedComments=[...i],i.length}async findNextVideoId(){try{const t=this.fetcher.lastApiData;if(!t)return;const e=t.series?.video?.next?.id;if(e){this.nextVideoId=e,E.debug("videoSwitch:detectedNext",{videoId:e});return}const n=t.video?.description??"";if(!n)return;const i=ui(n);if(i.length===0)return;const s=[...i].sort((o,a)=>{const l=parseInt(o.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(a.replace(/^[a-z]{2}/i,""),10)||0)-l});this.nextVideoId=s[0]??null,this.nextVideoId&&E.debug("videoSwitch:candidateFromDescription",{candidate:this.nextVideoId});}catch(t){E.error("videoSwitch:nextIdError",t,{lastVideoId:this.lastVideoId});}}async preloadComments(){if(this.nextVideoId)try{const e=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(n=>!this.renderer.isNGComment(n.text));this.preloadedComments=e.length>0?e:null,E.debug("videoSwitch:preloaded",{videoId:this.nextVideoId,count:e.length});}catch(t){E.error("videoSwitch:preloadError",t,{videoId:this.nextVideoId}),this.preloadedComments=null;}}}const mi=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class _e{static initialize(){Te(mi);}}var pi="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z",fi="M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z",gi="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",yi="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z",bi="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z",vi="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z",xi="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",wi="M5,4V7H10.5V19H13.5V7H19V4H5Z",_i="M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z",Si="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",ki="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",Ei="M8,5.14V19.14L19,12.14L8,5.14Z",Ci="M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z",Ti="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z";function T(r,t=24){const e=String(t),n=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${n}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${r}"></path></svg>`}const Zt=T(Ei),Ii=T(gi),Ai=T(ki),Mi=T(Si),ut=T(yi),Li=T(_i),Vi=T(wi),zi=T(pi),Ri=T(xi),Ni=T(vi),Di=T(Ci),Pi=T(fi),Fi=T(bi),Oi=T(Ti),D=R("dAnime:SettingsUI"),f={searchInput:"#searchInput",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",opacitySelect:"#commentOpacity",visibilityToggle:"#commentVisibilityToggle",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",colorValue:".color-value",colorPreview:".color-preview",colorPickerInput:"#colorPickerInput",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",playCurrentVideo:"#playCurrentVideo",settingsModal:"#settingsModal",closeSettingsModal:"#closeSettingsModal",modalOverlay:".settings-modal__overlay",modalTabs:".settings-modal__tab",modalPane:".settings-modal__pane"},$=["search","display","ng"],Jt=`
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
`,$i=`
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
`;class et extends _t{static FAB_HOST_ID="danime-settings-fab-host";settingsManager;fetcher;searcher;settings;currentVideoInfo;hostElement=null;lastAutoButtonElement=null;activeTab="search";modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;handleFabClick=t=>{t.preventDefault(),this.openSettingsModal();};handleOverlayClick=()=>{this.closeSettingsModal();};handleCloseClick=()=>{this.closeSettingsModal();};constructor(t,e=new St,n=new xe){super(),this.settingsManager=t,this.fetcher=e,this.searcher=n,this.settings=this.settingsManager.getSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData();}insertIntoMypage(){const t=document.querySelector(C.mypageHeaderTitle);t&&(this.hostElement=this.createSettingsUI(),t.parentElement?.insertBefore(this.hostElement,t.nextSibling),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}}));}addAutoCommentButtons(){document.querySelectorAll(C.mypageItem).forEach(e=>{const n=e.querySelector(C.mypageItemTitle);if(!n||n.querySelector(".auto-comment-button-host"))return;const i=n.querySelector("span")?.textContent?.trim()??"",s=e.querySelector(C.mypageEpisodeNumber)?.textContent?.trim()??"",o=e.querySelector(C.mypageEpisodeTitle)?.textContent?.trim()??"",a=document.createElement("div");a.className="nico-comment-shadow-host auto-comment-button-host",a.style.cssText="position:absolute;left:150px;top:3px;margin-left:8px;";const l=a.attachShadow({mode:"closed"}),c=document.createElement("style");c.textContent=q.getAutoButtonStyles(),l.appendChild(c);const d=document.createElement("button");d.className="auto-comment-button",d.innerHTML=ut,d.setAttribute("aria-label","コメント設定"),d.setAttribute("title","コメント設定"),d.setAttribute("type","button"),d.addEventListener("click",async h=>{h.preventDefault(),h.stopPropagation(),h.stopImmediatePropagation();try{const u=[i,s,o].filter(Boolean).join(" ");this.openSettingsModal(!1),this.setSearchKeyword(u),this.lastAutoButtonElement=a;try{const y=e.querySelector('input[name="workId"]')?.value?.trim()??"",w=e.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),I=e.querySelector('a.textContainer[href*="partId="]');let b="";const A=(w?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);A?b=A[1]:I?.href&&(b=(new URL(I.href,location.origin).searchParams.get("partId")??"").trim()),y&&b&&this.settingsManager.saveLastDanimeIds({workId:y,partId:b});}catch(y){console.warn("[SettingsUI] save (workId, partId) skipped:",y);}const m=await this.executeSearch(u);if(m.length===0)return;await this.applySearchResult(m[0]);}catch(u){D.error("SettingsUI.autoCommentButton",u);}}),l.appendChild(d),n.appendChild(a),this.lastAutoButtonElement=a;}),this.waitMypageListStable().then(()=>{try{this.tryRestoreByDanimeIds();}catch(e){console.warn("[SettingsUI] restore failed:",e);}});}async waitMypageListStable(){const t=document.querySelector(C.mypageListContainer);if(!t)return;let e=t.querySelectorAll(C.mypageItem).length;const n=Date.now()+1500;return new Promise(i=>{const s=new MutationObserver(()=>{const o=t.querySelectorAll(C.mypageItem).length;if(o!==e){e=o;return}Date.now()>=n&&(s.disconnect(),i());});s.observe(t,{childList:true,subtree:true}),setTimeout(()=>{try{s.disconnect();}catch(o){D.debug("waitMypageListStable: observer already disconnected",o);}i();},1600);})}tryRestoreByDanimeIds(){const t=this.settingsManager.loadLastDanimeIds();if(!t)return  false;const e=Array.from(document.querySelectorAll(C.mypageItem));for(const n of e){if(n.querySelector('input[name="workId"]')?.value?.trim()!==t.workId)continue;const s=n.querySelector('a.textContainer[href*="partId="]'),o=s?.href?(new URL(s.href,location.origin).searchParams.get("partId")??"")===t.partId:false,a=n.querySelector(".thumbnailContainer > a, .thumbnail-container > a"),l=(()=>{const d=(a?.getAttribute("onclick")??"").match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);return !!d&&d[1]===t.partId})();if(o||l){const c=n.querySelector(".auto-comment-button-host")??n;return this.lastAutoButtonElement=c,this.updatePlayButtonState(this.currentVideoInfo),true}}return  false}createSettingsUI(){const t=document.createElement("div");t.className="nico-comment-shadow-host settings-host",this.createShadowDOM(t),this.addStyles(q.getCommonStyles());const e=this.buildSettingsHtml();return this.setHTML(e),this.applySettingsToUI(),this.addStyles(Jt),this.setupEventListeners(),t}buildSettingsHtml(){const t=i=>typeof i=="number"?i.toLocaleString():"-",e=i=>{if(!i)return "-";try{return new Date(i).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return i}},n=this.currentVideoInfo;return `
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="バージョン">${Ce}</span>
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
                <span class="info-icon" aria-hidden="true">${Li}</span>
                <span class="sr-only">動画ID</span>
                <span class="info-value" id="currentVideoId">${n?.videoId??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="タイトル">
                <span class="info-icon" aria-hidden="true">${Vi}</span>
                <span class="sr-only">タイトル</span>
                <span class="info-value" id="currentTitle">${n?.title??"未設定"}</span>
              </div>
              <div class="info-item info-item--wide" role="listitem" title="投稿者">
                <span class="info-icon" aria-hidden="true">${zi}</span>
                <span class="sr-only">投稿者</span>
                <span class="info-value" id="currentOwner">${n?.owner?.nickname??n?.channel?.name??"-"}</span>
              </div>
              <div class="info-item" role="listitem" title="再生数">
                <span class="info-icon" aria-hidden="true">${Ri}</span>
                <span class="sr-only">再生数</span>
                <span class="info-value" id="currentViewCount">${t(n?.viewCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="コメント数">
                <span class="info-icon" aria-hidden="true">${Ni}</span>
                <span class="sr-only">コメント数</span>
                <span class="info-value" id="currentCommentCount">${t(n?.commentCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="マイリスト数">
                <span class="info-icon" aria-hidden="true">${Di}</span>
                <span class="sr-only">マイリスト数</span>
                <span class="info-value" id="currentMylistCount">${t(n?.mylistCount)}</span>
              </div>
              <div class="info-item" role="listitem" title="投稿日">
                <span class="info-icon" aria-hidden="true">${Pi}</span>
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
              <span aria-hidden="true">${Ii}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${ut}</span>
              <span class="settings-modal__tab-label">検索</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="display" role="tab" aria-selected="false" aria-controls="settingsPaneDisplay" id="settingsTabDisplay" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${Ai}</span>
              <span class="settings-modal__tab-label">表示</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${Mi}</span>
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
              <span class="settings-modal__play-icon" aria-hidden="true">${Zt}</span>
              <span class="settings-modal__play-label">動画を再生</span>
            </button>
            <button id="saveSettings" type="button">設定を保存</button>
          </footer>
        </div>
      </div>
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupColorPresets(),this.setupColorPicker(),this.setupOpacitySelect(),this.setupVisibilityToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupPlayButton();}setupModalControls(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick);const t=this.createOrUpdateFab(),e=this.queryModalElement(f.settingsModal),n=this.queryModalElement(f.closeSettingsModal),i=this.queryModalElement(f.modalOverlay);this.modalElement=e??null,this.closeButtonElement=n??null,this.overlayElement=i??null,!(!e||!n||!i||!t)&&(this.fabElement?.removeEventListener("click",this.handleFabClick),t.addEventListener("click",this.handleFabClick),t.setAttribute("aria-controls",e.id),t.setAttribute("aria-haspopup","dialog"),t.setAttribute("aria-expanded","false"),this.fabElement=t,n.addEventListener("click",this.handleCloseClick),i.addEventListener("click",this.handleOverlayClick),this.shadowRoot?.addEventListener("keydown",s=>{const o=s;o.key==="Escape"&&!this.modalElement?.classList.contains("hidden")&&(o.preventDefault(),this.closeSettingsModal());}),this.applySettingsToUI());}setupModalTabs(){const t=Array.from(this.queryModalSelectorAll(f.modalTabs)),e=Array.from(this.queryModalSelectorAll(f.modalPane));if(t.length===0||e.length===0)return;const n=i=>{t.forEach(s=>{const a=this.toModalTabKey(s.dataset.tab)===i;s.classList.toggle("is-active",a),s.setAttribute("aria-selected",String(a)),s.setAttribute("tabindex",a?"0":"-1");}),e.forEach(s=>{const a=this.toModalTabKey(s.dataset.pane)===i;s.classList.toggle("is-active",a),s.setAttribute("aria-hidden",String(!a));}),this.activeTab=i;};t.forEach(i=>{i.addEventListener("click",()=>{const s=this.toModalTabKey(i.dataset.tab);s&&n(s);}),i.addEventListener("keydown",s=>{const o=s;if(o.key!=="ArrowRight"&&o.key!=="ArrowLeft")return;o.preventDefault();const a=this.toModalTabKey(i.dataset.tab);if(!a)return;const l=o.key==="ArrowRight"?1:-1,c=($.indexOf(a)+l+$.length)%$.length,d=$[c];n(d),t.find(u=>this.toModalTabKey(u.dataset.tab)===d)?.focus({preventScroll:true});});}),n(this.activeTab);}openSettingsModal(t=true){!this.modalElement||!this.fabElement||(this.modalElement.classList.remove("hidden"),this.modalElement.setAttribute("aria-hidden","false"),this.fabElement.setAttribute("aria-expanded","true"),t&&this.queryModalElement(`${f.modalTabs}.is-active`)?.focus({preventScroll:true}));}closeSettingsModal(){!this.modalElement||!this.fabElement||(this.modalElement.classList.add("hidden"),this.modalElement.setAttribute("aria-hidden","true"),this.fabElement.setAttribute("aria-expanded","false"),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:true}));}toModalTabKey(t){return t&&$.includes(t)?t:null}setupColorPresets(){this.queryModalSelectorAll(".color-preset-btn").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.color;if(!n)return;this.settings.commentColor=n;const i=this.queryModalElement(f.colorPreview),s=this.queryModalElement(f.colorValue);i&&(i.style.backgroundColor=n),s&&(s.textContent=n);});});}setupColorPicker(){const t=this.queryModalElement(f.colorPickerInput);t&&t.addEventListener("input",()=>{this.settings.commentColor=t.value;const e=this.queryModalElement(f.colorPreview),n=this.queryModalElement(f.colorValue);e&&(e.style.backgroundColor=t.value),n&&(n.textContent=t.value);});}setupOpacitySelect(){const t=this.queryModalElement(f.opacitySelect);t&&(t.value=this.settings.commentOpacity.toString(),t.addEventListener("change",()=>{const e=Number(t.value);Number.isNaN(e)||(this.settings.commentOpacity=e);}));}setupVisibilityToggle(){const t=this.queryModalElement(f.visibilityToggle);t&&(t.addEventListener("click",()=>{this.settings.isCommentVisible=!this.settings.isCommentVisible,this.updateVisibilityToggleState(t);}),this.updateVisibilityToggleState(t));}setupNgControls(){const t=this.queryModalElement(f.ngWords);t&&t.classList.remove("hidden");const e=this.queryModalElement(f.ngRegexps);e&&e.classList.remove("hidden");}setupSaveButton(){const t=this.queryModalElement(f.saveButton);t&&t.addEventListener("click",()=>this.saveSettings());}setupSearch(){const t=this.queryModalElement(f.searchInput),e=this.queryModalElement(f.searchButton),n=this.queryModalElement(f.openSearchPage),i=async()=>{const s=t?.value.trim();if(!s){x.show("キーワードを入力してください","warning");return}await this.executeSearch(s);};e?.addEventListener("click",i),t?.addEventListener("keydown",s=>{s.key==="Enter"&&i();}),n?.addEventListener("click",s=>{s.preventDefault();const o=t?.value.trim(),a=o?ve(o):Ut.searchBase;yt().open(a,"_blank","noopener");});}async executeSearch(t){try{x.show(`「${t}」を検索中...`,"info");const e=await this.searcher.search(t);return this.renderSearchResults(e,n=>this.renderSearchResultItem(n)),e.length===0&&x.show("検索結果が見つかりませんでした","warning"),e}catch(e){return D.error("SettingsUI.executeSearch",e),[]}}setSearchKeyword(t){const e=this.queryModalElement(f.searchInput);e&&(e.value=t,e.focus({preventScroll:true}));}renderSearchResults(t,e){const n=this.queryModalElement(f.searchResults);if(!n)return;n.innerHTML=t.map(s=>e(s)).join(""),n.querySelectorAll(".search-result-item").forEach((s,o)=>{s.addEventListener("click",()=>{const l=t[o];this.applySearchResult(l);});const a=s.querySelector(".open-search-page-direct-btn");a&&a.addEventListener("click",l=>{l.stopPropagation();});});}renderSearchResultItem(t){const e=this.formatSearchResultDate(t.postedAt),n=typeof t.similarity=="number"?`
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
              ${Zt}
            </span>
            <span>${t.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="コメント">
              ${Fi}
            </span>
            <span>${t.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="マイリスト">
              ${Oi}
            </span>
            <span>${t.mylistCount.toLocaleString()}</span>
            ${n}
          </div>
          <div class="date">${e}</div>
          <a href="${Ut.watchBase}/${t.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(t){try{const e=await this.fetcher.fetchApiData(t.videoId);await this.fetcher.fetchComments(),x.show(`「${t.title}」のコメントを設定しました`,"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(t,e));}catch(e){D.error("SettingsUI.applySearchResult",e);}}buildVideoMetadata(t,e){return {videoId:t.videoId,title:t.title,viewCount:e.video?.count?.view??t.viewCount,commentCount:e.video?.count?.comment??t.commentCount,mylistCount:e.video?.count?.mylist??t.mylistCount,postedAt:e.video?.registeredAt??t.postedAt,thumbnail:e.video?.thumbnail?.url??t.thumbnail,owner:e.owner??t.owner??void 0,channel:e.channel??t.channel??void 0}}applySettingsToUI(){const t=this.queryModalElement(f.opacitySelect),e=this.queryModalElement(f.visibilityToggle),n=this.queryModalElement(f.colorPreview),i=this.queryModalElement(f.colorValue),s=this.queryModalElement(f.ngWords),o=this.queryModalElement(f.ngRegexps);t&&(t.value=this.settings.commentOpacity.toString()),e&&this.updateVisibilityToggleState(e),n&&(n.style.backgroundColor=this.settings.commentColor),i&&(i.textContent=this.settings.commentColor),s&&(s.value=this.settings.ngWords.join(`
`)),o&&(o.value=this.settings.ngRegexps.join(`
`)),this.updatePlayButtonState(this.currentVideoInfo);}saveSettings(){const t=this.queryModalElement(f.opacitySelect),e=this.queryModalElement(f.ngWords),n=this.queryModalElement(f.ngRegexps);if(t){const i=Number(t.value);Number.isNaN(i)||(this.settings.commentOpacity=i);}e&&(this.settings.ngWords=e.value.split(`
`).map(i=>i.trim()).filter(Boolean)),n&&(this.settings.ngRegexps=n.value.split(`
`).map(i=>i.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings)?x.show("設定を保存しました","success"):x.show("設定の保存に失敗しました","error");}updateCurrentVideoInfo(t){this.currentVideoInfo=t,[["currentTitle",t.title??"-"],["currentVideoId",t.videoId??"-"],["currentOwner",t.owner?.nickname??t.channel?.name??"-"],["currentViewCount",this.formatNumber(t.viewCount)],["currentCommentCount",this.formatNumber(t.commentCount)],["currentMylistCount",this.formatNumber(t.mylistCount)],["currentPostedAt",this.formatSearchResultDate(t.postedAt)]].forEach(([i,s])=>{const o=this.querySelector(f[i]);o&&(o.textContent=s);});const n=this.querySelector(f.currentThumbnail);n&&t.thumbnail&&(n.src=t.thumbnail,n.alt=t.title??"サムネイル");try{this.settingsManager.saveVideoData(t.title??"",t);}catch(i){D.error("SettingsUI.updateCurrentVideoInfo",i);}this.updatePlayButtonState(t);}formatNumber(t){return typeof t=="number"?t.toLocaleString():"-"}formatSearchResultDate(t){if(!t)return "-";const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(e)}setupPlayButton(){const t=this.queryModalElement(f.playCurrentVideo);t&&(t.addEventListener("click",()=>{try{if(!this.currentVideoInfo?.videoId){x.show("再生できる動画が設定されていません","warning");return}const n=this.lastAutoButtonElement?.closest(".itemModule.list");if(this.lastAutoButtonElement){const i=n?.querySelector(".thumbnailContainer > a, .thumbnail-container > a");if(i){x.show(`「${this.currentVideoInfo?.title||"動画"}」を再生します...`,"success"),setTimeout(()=>{i.click();},300);return}}x.show("再生リンクが見つかりませんでした（対象アイテム内に限定して検索済み）","warning");}catch(e){D.error("SettingsUI.playCurrentVideo",e),x.show(`再生エラー: ${e.message}`,"error");}}),this.updatePlayButtonState(this.currentVideoInfo));}updatePlayButtonState(t){const e=this.queryModalElement(f.playCurrentVideo);if(!e)return;const n=!!t?.videoId;e.disabled=!n,e.setAttribute("aria-disabled",(!n).toString());}updateVisibilityToggleState(t){t.textContent=this.settings.isCommentVisible?"表示中":"非表示中",t.classList.toggle("off",!this.settings.isCommentVisible);}destroy(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),super.destroy();}createOrUpdateFab(){if(!document.body)return null;let t=this.fabHostElement;!t||!t.isConnected?(t?.remove(),t=document.createElement("div"),t.id=et.FAB_HOST_ID,t.style.position="fixed",t.style.bottom="32px",t.style.right="32px",t.style.zIndex="2147483646",t.style.display="inline-block",this.fabShadowRoot=t.attachShadow({mode:"open"}),document.body.appendChild(t),this.fabHostElement=t):this.fabShadowRoot||(this.fabShadowRoot=t.shadowRoot??t.attachShadow({mode:"open"}));const e=this.fabShadowRoot;if(!e)return null;let n=e.querySelector("style[data-role='fab-base-style']");n||(n=document.createElement("style"),n.dataset.role="fab-base-style",n.textContent=q.getCommonStyles(),e.appendChild(n));let i=e.querySelector("style[data-role='fab-style']");i||(i=document.createElement("style"),i.dataset.role="fab-style",i.textContent=`
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
      `,e.appendChild(i));let s=e.querySelector("style[data-role='similarity-style']");s||(s=document.createElement("style"),s.dataset.role="similarity-style",s.textContent=Jt,e.appendChild(s));let o=e.querySelector("style[data-role='modal-play-button-style']");o||(o=document.createElement("style"),o.dataset.role="modal-play-button-style",o.textContent=$i,e.appendChild(o));let a=e.querySelector(".fab-container");a||(a=document.createElement("div"),a.className="fab-container",e.appendChild(a));let l=a.querySelector("button.fab-button");l||(l=document.createElement("button"),l.type="button",l.className="fab-button",a.appendChild(l)),l.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${ut}</span>
      <span class="fab-button__label">設定</span>
    `,l.setAttribute("aria-label","ニコニココメント設定を開く"),l.setAttribute("aria-haspopup","dialog");let c=a.querySelector(f.settingsModal);return c||(a.insertAdjacentHTML("beforeend",this.buildModalHtml()),c=a.querySelector(f.settingsModal)),this.modalElement=c??null,l}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener("click",this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null;}queryModalElement(t){return this.fabShadowRoot?this.fabShadowRoot.querySelector(t):null}queryModalSelectorAll(t){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(t):document.createDocumentFragment().childNodes}}const Qt=async()=>{},Hi=()=>{const r=yt();if(!r.dAniRenderer){const t={};r.dAniRenderer={classes:{Comment:Me,CommentRenderer:fe,NicoApiFetcher:St,NotificationManager:x,StyleManager:_e,SettingsUI:et,NicoVideoSearcher:xe,VideoSwitchHandler:we,SettingsManager:bt,KeyboardShortcutHandler:te,DebounceExecutor:kt,ShadowDOMComponent:_t,ShadowStyleManager:q},instances:t,utils:{initialize:Qt,initializeWithVideo:Qt},debug:{showState:()=>{console.log("Current instances:",t);},showSettings:()=>{const e=t.settingsManager;if(!e){console.log("SettingsManager not initialized");return}console.log("Current settings:",e.getSettings());},showComments:()=>{const e=t.renderer;if(!e){console.log("CommentRenderer not initialized");return}console.log("Current comments:",e.getCommentsSnapshot());}},defaultSettings:L};}return r.dAniRenderer},Wi=100,qi=1e3,Bi=3e3;class ji{constructor(t){this.global=t;}initialized=false;switchDebounce=new kt(qi);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(t=>{window.addEventListener("load",()=>t(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const t=document.querySelector(C.watchVideoElement);if(!t){window.setTimeout(()=>this.waitForVideoElement(),Wi);return}if(t.readyState===0){t.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(t);},{once:true});return}this.initializeWithVideo(t);}async initializeWithVideo(t){if(!this.initialized){this.initialized=true;try{x.show("コメントローダーを初期化中...");const e=x.getInstance(),n=this.global.settingsManager??new bt(e);this.global.settingsManager=n,this.global.instances.settingsManager=n;const i=n.loadVideoData();if(!i?.videoId)throw new Error("動画データが見つかりません。マイページで設定してください。");const s=new St;this.global.instances.fetcher=s,await s.fetchApiData(i.videoId);const o=await s.fetchComments(),a=this.mergeSettings(n.loadSettings()),l=new fe(a);l.initialize(t),this.global.instances.renderer=l,this.currentVideoElement=t,n.addObserver(d=>{l.settings=this.mergeSettings(d);}),o.forEach(d=>{l.addComment(d.text,d.vpos,d.commands);});const c=new we(l,s,n);c.startMonitoring(),this.global.instances.switchHandler=c,this.setupSwitchHandling(t,c),this.observeVideoElement(),x.show(`コメントの読み込みが完了しました（${o.length}件）`,"success");}catch(e){throw this.initialized=false,x.show(`初期化エラー: ${e.message}`,"error"),e}}}mergeSettings(t){const e=L();return {...e,...t,ngWords:[...t.ngWords??e.ngWords],ngRegexps:[...t.ngRegexps??e.ngRegexps]}}setupSwitchHandling(t,e){this.currentVideoElement=t,this.switchCallback=()=>{const n=Date.now();if(n-this.lastSwitchTimestamp<Bi)return;this.lastSwitchTimestamp=n;const i=this.currentVideoElement;e.onVideoSwitch(i);},this.global.utils.initializeWithVideo=async n=>{n&&(this.rebindVideoElement(n),await e.onVideoSwitch(n));},this.currentVideoElement=t;}observeVideoElement(){const t=this.currentVideoElement;t&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{const e=document.querySelector(C.watchVideoElement);!e||e===this.currentVideoElement||this.rebindVideoElement(e);}),this.domMutationObserver.observe(document.body,{childList:true,subtree:true}),this.attachVideoEventListeners(t));}rebindVideoElement(t){this.detachVideoEventListeners(),this.currentVideoElement=t;const e=this.global.instances.renderer,n=this.global.instances.switchHandler;e&&(e.destroy(),e.initialize(t),e.resize()),n&&(n.onVideoSwitch(t),this.setupSwitchHandling(t,n)),this.attachVideoEventListeners(t);}attachVideoEventListeners(t){this.detachVideoEventListeners();const e=()=>{this.switchCallback&&(this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback));};t.addEventListener("ended",e),t.addEventListener("loadedmetadata",e),t.addEventListener("emptied",e),this.videoEndedListener=e;}detachVideoEventListeners(){const t=this.currentVideoElement;t&&this.videoEndedListener&&(t.removeEventListener("ended",this.videoEndedListener),t.removeEventListener("loadedmetadata",this.videoEndedListener),t.removeEventListener("emptied",this.videoEndedListener)),this.videoEndedListener=null;}}const Ui=100;class Gi{constructor(t){this.global=t;}initialize(){const t=x.getInstance(),e=this.global.settingsManager??new bt(t);this.global.settingsManager=e,this.global.instances.settingsManager=e;const n=new et(e);this.waitForHeader(n);}waitForHeader(t){if(!document.querySelector(C.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(t),Ui);return}t.insertIntoMypage(),t.addAutoCommentButtons(),this.observeList(t);}observeList(t){const e=document.querySelector(C.mypageListContainer);if(!e)return;new MutationObserver(()=>{try{t.addAutoCommentButtons();}catch(i){console.error("[MypageController] auto comment buttons update failed",i);}}).observe(e,{childList:true,subtree:true});}}class Yi{log;global=Hi();watchController=null;mypageController=null;constructor(){this.log=R("DanimeApp");}start(){this.log.info("starting renderer"),_e.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const t=location.pathname.toLowerCase();try{t.includes("/animestore/sc_d_pc")?(this.watchController=new ji(this.global),await this.watchController.initialize()):t.includes("/animestore/mp_viw_pc")?(this.mypageController=new Gi(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(e){this.log.error("initialization failed",e);}}acquireInstanceLock(){const t=yt();return t.__dAnimeNicoCommentRenderer2Instance=(t.__dAnimeNicoCommentRenderer2Instance??0)+1,t.__dAnimeNicoCommentRenderer2Instance===1}}const mt=R("dAnimeNicoCommentRenderer2");async function Ki(){mt.info("bootstrap start");try{new Yi().start(),mt.info("bootstrap completed");}catch(r){mt.error("bootstrap failed",r);}}Ki();

})();