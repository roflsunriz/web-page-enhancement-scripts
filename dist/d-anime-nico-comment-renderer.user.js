// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      7.6.1
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

(function(){"use strict";var e={debug:`debug`,info:`info`,warn:`warn`,error:`error`},t={debug:10,info:20,warn:30,error:40},n=e=>t[e]>=t.warn,r=t=>{let r=`[${t}]`,i={};return Object.keys(e).forEach(a=>{let o=e[a];i[a]=(...e)=>{n(a,t)&&(console[o]??console.log)(r,...e)}}),i};function i(){return typeof unsafeWindow<`u`?unsafeWindow:window}var a={small:.6666666666666666,medium:1,big:1.4444444444444444},o={defont:`Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic`,gothic:`"游ゴシック体","游ゴシック","Yu Gothic",YuGothic,yugothic,YuGo-Medium,"宋体",SimSun,Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic`,mincho:`"游明朝体","游明朝","Yu Mincho",YuMincho,yumincho,YuMin-Medium,"宋体",SimSun,Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic`},s={defont:`600`,gothic:``,mincho:``},c={white:`#FFFFFF`,red:`#FF0000`,pink:`#FFA5CC`,orange:`#FFBA66`,yellow:`#FFFFAA`,green:`#00FF00`,cyan:`#88FFFF`,blue:`#8899FF`,purple:`#D9A5FF`,black:`#000000`,white2:`#CC9`,red2:`#C03`,pink2:`#F3C`,orange2:`#F60`,yellow2:`#990`,green2:`#0C6`,cyan2:`#0CC`,blue2:`#39F`,purple2:`#63C`,black2:`#666`},l=/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,u=/^[,.:;]+/,d=/[,.:;]+$/,f=e=>{let t=e.trim();return t?l.test(t)?t:t.replace(u,``).replace(d,``):``},p=e=>l.test(e)?e.toUpperCase():null,m=e=>{let t=e.trim();if(!t)return null;let n=t.toLowerCase().endsWith(`px`)?t.slice(0,-2):t,r=Number.parseFloat(n);return Number.isFinite(r)?r:null},h=e=>{let t=e.trim();if(!t)return null;if(t.endsWith(`%`)){let e=Number.parseFloat(t.slice(0,-1));return Number.isFinite(e)?e/100:null}return m(t)},g=e=>Number.isFinite(e)?Math.min(100,Math.max(-100,e)):0,_=e=>!Number.isFinite(e)||e===0?1:Math.min(5,Math.max(.25,e)),v=e=>e===`naka`||e===`ue`||e===`shita`,y=e=>e===`small`||e===`medium`||e===`big`,ee=e=>e===`defont`||e===`gothic`||e===`mincho`,te=e=>e in c,ne=(e,t)=>{let n=`naka`,r=`medium`,i=`defont`,u=null,d=1,ne=null,b=!1,x=!1,S=!1,C=0,w=1;for(let t of e){let e=f(typeof t==`string`?t:``);if(!e)continue;if(l.test(e)){let t=p(e);if(t){u=t;continue}}let a=e.toLowerCase();if(v(a)){n=a;continue}if(y(a)){r=a;continue}if(ee(a)){i=a;continue}if(te(a)){u=c[a].toUpperCase();continue}if(a===`_live`){ne=.5;continue}if(a===`invisible`){d=0,b=!0;continue}if(a===`full`){x=!0;continue}if(a===`ender`){S=!0;continue}if(a.startsWith(`ls:`)||a.startsWith(`letterspacing:`)){let t=e.indexOf(`:`);if(t>=0){let n=m(e.slice(t+1));n!==null&&(C=g(n))}continue}if(a.startsWith(`lh:`)||a.startsWith(`lineheight:`)){let t=e.indexOf(`:`);if(t>=0){let n=h(e.slice(t+1));n!==null&&(w=_(n))}continue}}let re=Math.max(0,Math.min(1,d)),ie=(u??t.defaultColor).toUpperCase(),T=typeof ne==`number`?Math.max(0,Math.min(1,ne)):null;return{layout:n,size:r,sizeScale:a[r],font:i,fontFamily:o[i],fontWeight:s[i],resolvedColor:ie,colorOverride:u,opacityMultiplier:re,opacityOverride:T,isInvisible:b,isFull:x,isEnder:S,letterSpacing:C,lineHeight:w}},b=/^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i,x=e=>e.length===1?e.repeat(2):e,S=e=>Number.parseInt(e,16),C=e=>!Number.isFinite(e)||e<=0?0:e>=1?1:e,w=(e,t)=>{let n=b.exec(e);if(!n)return e;let r=n[1],i,a,o,s=1;r.length===3||r.length===4?(i=S(x(r[0])),a=S(x(r[1])),o=S(x(r[2])),r.length===4&&(s=S(x(r[3]))/255)):(i=S(r.slice(0,2)),a=S(r.slice(2,4)),o=S(r.slice(4,6)),r.length===8&&(s=S(r.slice(6,8))/255));let c=C(s*C(t));return`rgba(${i}, ${a}, ${o}, ${c})`},re=()=>({now:()=>typeof performance<`u`&&typeof performance.now==`function`?performance.now():Date.now()}),ie=()=>re(),T=e=>e*1e3,ae=e=>!Number.isFinite(e)||e<0?null:Math.round(e),oe=6e3,se=2700,ce=3,le=.35,ue=48,de=48,fe=0,pe=6e3,me=120,he=800,ge=2,_e=6e3,E=3e3,D=9e3,ve=240,ye=1800,be=1,xe=12,Se=24,O=.001,k=50,Ce=2300,we={debug:0,info:1,warn:2,error:3},Te=(e,t,n)=>{let r=[`[${t}]`,...n];switch(e){case`debug`:console.debug(...r);break;case`info`:console.info(...r);break;case`warn`:console.warn(...r);break;case`error`:console.error(...r);break;default:console.log(...r)}},Ee=(e,t={})=>{let{level:n=`info`,emitter:r=Te}=t,i=we[n],a=(t,n)=>{we[t]<i||r(t,e,n)};return{debug:(...e)=>a(`debug`,e),info:(...e)=>a(`info`,e),warn:(...e)=>a(`warn`,e),error:(...e)=>a(`error`,e)}},De=Ee(`CommentEngine:Comment`),Oe=new WeakMap,ke=e=>{let t=Oe.get(e);return t||(t=new Map,Oe.set(e,t)),t},Ae=(e,t)=>{if(!e)return 0;let n=`${e.font??``}::${t}`,r=ke(e),i=r.get(n);if(i!==void 0)return i;let a=e.measureText(t).width;return r.set(n,a),a},je=e=>`${e.fontWeight?`${e.fontWeight} `:``}${e.fontSize}px ${e.fontFamily}`,Me=27/665,A=665,Ne=12,Pe=`  `,Fe=1252/597.38330078125,Ie=[366/A,510/A,1662/A],Le=566/A,Re=806/665,ze=808/665,Be=1176/665,Ve=900/665,He=1126/665,Ue=810/665,We=1126/665,Ge=1046/665,Ke=1254/665,qe=1140/665,Je=878/665,Ye=.25,Xe=160,Ze=420,Qe=80,$e=.18,et=400,tt=.2,nt=420,rt=250,it=1.8,at=420,ot=20,st=.045,ct=850/1182,lt=e=>Math.max(.01,e/A),j=(e,t)=>e*lt(t),ut=e=>e.replaceAll(`	`,Pe),dt=/[\s\u00a0\u2000-\u200f\u202f\u205f\u3000]/g,ft=e=>{let t=ut(e);if(t.includes(`
`)){let e=t.split(/\r?\n/);return e.length>0?e:[``]}return[t]},pt=(e,t=Ne)=>Math.max(t,e),mt=(e,t)=>{if(e.fontSize>=35)return Math.round(t*Le);let n=e.text.split(/\r?\n/),r=Math.max(0,...n.map(e=>e.length));return e.isEnder&&r>=25||Math.max(0,...n.map(e=>(e.match(/\t/g)||[]).length))>=12||e.width>=1200?Math.round(t*Ie[2]):e.width>=300?Math.round(t*Ie[1]):Math.round(t*Ie[0])},ht=(e,t)=>Math.min(j(Ze,t),Math.max(j(Xe,t),e*Ye)),gt=(e,t)=>{let n=j(et,t);return Math.min(j(nt,t),j(Qe,t)+e.width*$e+Math.max(0,e.width-n)*tt)},_t=(e,t)=>Math.min(j(at,t),Math.max(0,e.width-j(rt,t))*it),vt=(e,t)=>{if(e.isFull)return e.width;let n=Math.max(e.sizeScale,1),r=e.width/n,i=t*ct;return Math.min(r,i)},yt=e=>e.lines.filter(e=>e.replace(dt,``).length>0).length,bt=e=>e.lines.length>1&&yt(e)===1,xt=e=>e.lines.map(e=>e.replace(dt,``)).filter(e=>e.length>0),St=e=>{if(e.lines.length<=1)return!1;let t=xt(e);return t.length===1&&/^[●○◉◎]+$/u.test(t[0])},Ct=e=>e.size===`big`||e.fontSize>=35,wt=(e,t)=>{let n=0,r=e.letterSpacing;for(let i of e.lines){let e=Ae(t,i),a=i.length>1?r*(i.length-1):0,o=Math.max(0,e+a);o>n&&(n=o)}e.width=n;let i=Math.max(1,Math.floor(e.fontSize*e.lineHeightMultiplier));e.lineHeightPx=i;let a=e.lines.length>1?(e.lines.length-1)*i:0;e.height=e.fontSize+a},Tt=(e,t,n,r,i)=>{try{if(!t)throw Error(`Canvas context is required`);if(!Number.isFinite(n)||!Number.isFinite(r))throw Error(`Canvas dimensions must be numbers`);if(!i)throw Error(`Prepare options are required`);let a=Math.max(n,1),o=pt(Math.floor(r*Me));if(e.fontSize=pt(Math.floor(o*e.sizeScale)),t.font=je(e),e.lines=ft(e.text),wt(e,t),e.isScrolling&&e.isFull){let t=e.lines.length>1&&(e.fontFamily.includes(`Yu Mincho`)||e.fontFamily.includes(`游明朝`));if(t&&e.hasSameVposFullMinchoEnder&&!e.isEnder&&Ct(e))e.width=Math.round(r*(St(e)?Ge:We)),e.height=Math.max(e.height,Math.round(r*Ue));else if(t&&e.hasSameVposFullMinchoEnder&&e.isEnder&&Ct(e))e.width=Math.round(r*(bt(e)?Ke:Be)),e.height=Math.max(e.height,Math.round(r*Ve));else if(t&&e.hasSameVposFullMinchoEnder&&e.isEnder)e.width=Math.round(r*(bt(e)?Ke:qe)),e.height=Math.max(e.height,Math.round(r*Je));else if(t&&Ct(e))e.width=Math.round(r*(St(e)?Ge:Be)),e.height=Math.max(e.height,Math.round(r*Ve));else if(t)e.width=Math.round(r*He),e.height=Math.max(e.height,Math.round(r*Ue));else{let t=Ct(e)?ze:Re;e.width=mt(e,r),e.height=Math.max(e.height,Math.round(r*t))}}if(!e.isScrolling){let t=a+o*2.6666666666666665;e.width>=t*.95&&e.fontSize>=35?e.width=Math.round(r*Fe):e.width=Math.min(e.width,t),e.bufferWidth=0;let n=(a-e.width)/2;e.virtualStartX=n,e.x=n,e.baseSpeed=0,e.speed=0,e.speedPixelsPerMs=0,e.visibleDurationMs=E,e.preCollisionDurationMs=E,e.totalDurationMs=E,e.reservationWidth=e.width,e.staticExpiryTimeMs=e.vposMs+E,e.lastUpdateTime=e.getTimeSource().now(),e.isPaused=!1;return}e.staticExpiryTimeMs=null;let s=Ae(t,`??`.repeat(150)),c=e.width,l=c*Math.max(i.bufferRatio,0);e.bufferWidth=Math.max(i.baseBufferPx,l);let u=Math.max(i.entryBufferPx,e.bufferWidth),d=e.scrollDirection,f=Math.min(1,r/A),p=e.isFull?i.virtualExtension*f:i.virtualExtension,m=e.isFull?ht(e.width,r):0,h=e.isFull?j(ot,r)+e.width*st:0,g=e.isFull?0:gt(e,r),_=e.isFull?0:_t(e,r),v=d===`rtl`?a+p+m+g:-c-e.bufferWidth-p-m-g,y=d===`rtl`?-c-e.bufferWidth-u+m-g-_:a+u-m+g+_,ee=d===`rtl`?a+u:-u;e.virtualStartX=v,e.x=v,e.exitThreshold=y;let te=a>0?c/a:0,ne=i.maxVisibleDurationMs===i.minVisibleDurationMs,b=i.maxVisibleDurationMs;if(!ne&&te>1&&!e.isFull){let e=Math.min(te,i.maxWidthRatio),t=i.maxVisibleDurationMs/Math.max(e,1);b=Math.max(i.minVisibleDurationMs,Math.floor(t))}let x=(a+c+e.bufferWidth+u+p+h+g*2+_)/Math.max(b,1);e.baseSpeed=x*1e3/60,e.speed=e.baseSpeed,e.speedPixelsPerMs=x;let S=Math.abs(y-v),C=d===`rtl`?v+c+e.bufferWidth:v-e.bufferWidth,w=d===`rtl`?Math.max(0,C-ee):Math.max(0,ee-C),re=Math.max(x,2**-52);e.visibleDurationMs=b,e.preCollisionDurationMs=Math.max(0,Math.ceil(w/re)),e.totalDurationMs=Math.max(e.preCollisionDurationMs,Math.ceil(S/re));let ie=c+e.bufferWidth+u,T=vt(e,a);e.reservationWidth=Math.min(s,Math.max(ie,T)),e.lastUpdateTime=e.getTimeSource().now(),e.isPaused=!1}catch(i){throw De.error(`Comment.prepare`,i,{text:e.text,visibleWidth:n,canvasHeight:r,hasContext:!!t}),i}},Et=5,M={enabled:!1,maxLogsPerCategory:Et},Dt=new Map,Ot=e=>e===void 0||!Number.isFinite(e)?Et:Math.min(1e4,Math.max(1,Math.floor(e))),kt=e=>{M.enabled=!!e.enabled,M.maxLogsPerCategory=Ot(e.maxLogsPerCategory),M.enabled||Dt.clear()},N=()=>M.enabled,At=e=>{let t=Dt.get(e)??0;return t>=M.maxLogsPerCategory?(t===M.maxLogsPerCategory&&(console.debug(`[CommentOverlay][${e}]`,`Further logs suppressed.`),Dt.set(e,t+1)),!1):(Dt.set(e,t+1),!0)},P=(e,...t)=>{M.enabled&&At(e)&&console.debug(`[CommentOverlay][${e}]`,...t)},F=(e,t=32)=>e.length<=t?e:`${e.slice(0,t)}…`,jt=(e,t)=>{M.enabled&&(console.group(`[CommentOverlay][state-dump] ${e}`),console.table({"Current Time":`${t.currentTime.toFixed(2)}ms`,Duration:`${t.duration.toFixed(2)}ms`,"Is Playing":t.isPlaying,"Epoch ID":t.epochId,"Total Comments":t.totalComments,"Active Comments":t.activeComments,"Reserved Lanes":t.reservedLanes,"Final Phase":t.finalPhaseActive,"Playback Begun":t.playbackHasBegun,"Is Stalled":t.isStalled}),console.groupEnd())},Mt=(e,t,n)=>{M.enabled&&P(`epoch-change`,`Epoch changed: ${e} → ${t} (reason: ${n})`)},Nt=e=>{if(typeof e==`string`)return e;if(e!=null)return String(e)},Pt=()=>typeof performance<`u`&&typeof performance.now==`function`?performance.now():Date.now(),Ft=e=>{if(typeof e.getTransform!=`function`)return;let t=e.getTransform();return[t.a,t.b,t.c,t.d,t.e,t.f]},It=e=>{let t=e.canvas;return t?{canvasWidth:t.width,canvasHeight:t.height}:{}},Lt=e=>e?{...e.no===void 0?{}:{no:e.no},...e.fork===void 0?{}:{fork:e.fork},...e.source===void 0?{}:{source:e.source},...e.threadId===void 0?{}:{threadId:e.threadId},...e.date===void 0?{}:{date:e.date},...e.userIdHash===void 0?{}:{userIdHash:e.userIdHash}}:{},Rt=e=>({text:e.text,vposMs:e.vposMs,...Lt(e.meta),layout:e.layout,lane:e.lane,fontSize:e.fontSize,width:e.width,height:e.height,color:e.color,opacity:e.opacity,creationIndex:e.creationIndex}),zt=(e,t,n,r)=>{let i=globalThis.__COMMENT_OVERLAY_TRACE__;globalThis.__COMMENT_OVERLAY_TRACE_ENABLED__!==!0||typeof i!=`function`||i({source:`comment-overlay`,op:e,timestampMs:Pt(),font:t.font,fillStyle:Nt(t.fillStyle),strokeStyle:Nt(t.strokeStyle),lineWidth:t.lineWidth,lineJoin:t.lineJoin,globalAlpha:t.globalAlpha,shadowColor:t.shadowColor,shadowBlur:t.shadowBlur,shadowOffsetX:t.shadowOffsetX,shadowOffsetY:t.shadowOffsetY,transform:Ft(t),...It(t),comment:Rt(n),...r})},Bt=(e,t,n)=>{let r=globalThis.__COMMENT_OVERLAY_TRACE__;globalThis.__COMMENT_OVERLAY_TRACE_ENABLED__!==!0||typeof r!=`function`||r({source:`comment-overlay`,op:e,timestampMs:Pt(),comment:Rt(t),...n})},I={hits:0,misses:0,creates:0,fallbacks:0,outlineCallsInCache:0,fillCallsInCache:0,outlineCallsInFallback:0,fillCallsInFallback:0,letterSpacingComments:0,normalComments:0,multiLineComments:0,totalCharactersDrawn:0,lastReported:0},Vt=()=>{if(!N())return;let e=performance.now();if(e-I.lastReported<=5e3)return;let t=I.hits+I.misses,n=t>0?I.hits/t*100:0,r=I.creates>0?(I.totalCharactersDrawn/I.creates).toFixed(1):`0`,i=I.outlineCallsInCache+I.outlineCallsInFallback,a=I.fillCallsInCache+I.fillCallsInFallback;console.log(`[TextureCache Stats]`,`
  Cache: Hits=${I.hits}, Misses=${I.misses}, Hit Rate=${n.toFixed(1)}%`,`
  Creates: ${I.creates}, Fallbacks: ${I.fallbacks}`,`
  Comments: Normal=${I.normalComments}, LetterSpacing=${I.letterSpacingComments}, MultiLine=${I.multiLineComments}`,`
  Draw Calls: Outline=${i}, Fill=${a}`,`
  Avg Characters/Comment: ${r}`),I.lastReported=e},Ht=()=>typeof OffscreenCanvas<`u`,Ut=(e,t,n)=>{if(e===`none`)return{blur:0,alpha:0};let r={light:.06,medium:.1,strong:.15}[e],i={light:.6,medium:.8,strong:.95}[e];return{blur:Math.max(2,t*r),alpha:C(n*i)}},Wt=()=>2.8,Gt=665,Kt=566,qt=808,Jt=Kt/Gt,Yt=qt/Gt,Xt=1098,Zt=1530,Qt=20.9,$t=58.9,en=45.23908523908523/39,tn=14.9,nn=41.9,rn=28.92708257149126/27,an=20,on=11.4,sn=31.4,cn=23.87692307692307,ln=2.4,un=2,dn=66.9,fn=55.6,pn=59,mn=810,hn=21.5,gn=878,_n=900,vn=10,yn=6.75,bn=16.75,xn=12.11423203055002,Sn=.5,Cn=1.42,wn=.12,Tn=e=>{let t=e.trim().toLowerCase();if(t===`black`)return!0;let n=t.match(/^#([0-9a-f]{3,8})$/i);if(!n)return!1;let r=n[1],i=r.length===3||r.length===4,a=e=>e.length===1?`${e}${e}`:e,o=Number.parseInt(a(i?r[0]:r.slice(0,2)),16),s=Number.parseInt(a(i?r[1]:r.slice(2,4)),16),c=Number.parseInt(a(i?r[2]:r.slice(4,6)),16);return o===0&&s===0&&c===0},En=e=>Tn(e.color)?`rgba(255, 255, 255, 0.4)`:`rgba(0, 0, 0, 0.4)`,Dn=(e,t)=>`${e.fontWeight?`${e.fontWeight} `:``}${t}px ${e.fontFamily}`,On=(e,t)=>{if(!e.isScrolling)return t+e.fontSize;let n=e.fontSize<=18?e.fontSize*.08:0;return e.fontSize*1.5+n},kn=e=>{if(e.isScrolling&&e.isFull){if(e.hasSameVposFullMinchoEnder){let t=Math.ceil(e.height);return{paddingX:Math.max(10,e.fontSize*.5),paddingY:t>=_n?dn:t>=gn?fn:hn,textureWidth:Math.ceil(e.width),textureHeight:t}}let t=e.hasSameVposFullMinchoEnder&&e.isEnder?e.fontSize>=35?dn:fn:null;return{paddingX:Math.max(10,e.fontSize*.5),paddingY:t??(e.fontSize>=35?e.fontSize*.5:Math.max(18,e.fontSize))+ln,textureWidth:Math.ceil(e.width),textureHeight:Math.ceil(e.height)}}if(e.isScrolling&&e.lines.length>1){let t=e.fontSize*1.3333333333333333;return{paddingX:t,paddingY:e.fontSize,textureWidth:Math.ceil(e.width+t*2),textureHeight:Math.ceil(e.height+e.fontSize*6.1)}}if(!e.isScrolling){let t=Math.ceil(e.lines.length>1?e.height:e.height+e.fontSize/3);return{paddingX:0,paddingY:Math.max(0,(t-e.height)/2),textureWidth:Math.ceil(e.width+0),textureHeight:t}}let t=e.isScrolling?e.fontSize*1.15:Math.max(10,e.fontSize*.5),n=e.fontSize,r=e.isScrolling?Math.round(40/9*n):e.height+e.fontSize/3,i=Math.ceil(Math.max(e.height+Math.max(10,e.fontSize),r));return{paddingX:t,paddingY:e.isScrolling?e.fontSize:Math.max(0,(i-e.height)/2),textureWidth:Math.ceil(e.isScrolling?e.width*2+t*2:e.width+t*2),textureHeight:i}},An=e=>!e.isScrolling&&e.width>=1200&&e.fontSize>=35?.8:1,jn=e=>!e.isScrolling&&e.width>=1200&&e.fontSize>=35,Mn=e=>jn(e)&&(e.fontFamily.includes(`Yu Mincho`)||e.fontFamily.includes(`YuMincho`)||e.fontFamily.includes(`游明朝`)),Nn=(e,t)=>Mn(e)?Cn:t,Pn=e=>Math.max(1,e.width+e.virtualStartX*2),Fn=e=>e.isScrolling&&e.isFull&&e.hasSameVposFullMinchoEnder?pn*Math.min(1,e.height/mn):0,In=(e,t,n,r,i)=>{let a=Nn(e,i);if(Mn(e))return{x:Pn(e)*wn,scaleX:a,scaleY:i};let o=!e.isScrolling&&a!==1?t.width*(1-a)*Sn:0;return{x:n-r+o+Fn(e),scaleX:a,scaleY:i}},Ln=(e,t,n,r,i)=>(a,o,s,c=0)=>{if(a.length===0)return;let l=i+c,u=()=>{r===`cache`?s===`outline`?I.outlineCallsInCache++:I.fillCallsInCache++:s===`outline`?I.outlineCallsInFallback++:I.fillCallsInFallback++},d=(n,i,a)=>{if(u(),s===`outline`){t.strokeText(n,i,o),zt(`strokeText`,t,e,{text:n,x:i,y:o,meta:{statsTarget:r,mode:s,...a}});return}t.fillText(n,i,o),zt(`fillText`,t,e,{text:n,x:i,y:o,meta:{statsTarget:r,mode:s,...a}})};if(Math.abs(e.letterSpacing)<2**-52){d(a,l);return}let f=l;for(let t=0;t<a.length;t+=1){let r=a[t];d(r,f,{characterIndex:t});let i=Ae(n,r);f+=i,t<a.length-1&&(f+=e.letterSpacing)}},Rn=e=>`v8::${e.text}::${e.fontSize}::${e.fontFamily}::${e.fontWeight}::${e.color}::${e.opacity}::${e.renderStyle}::${e.letterSpacing}::${e.lineHeightPx}::${e.width}::${e.height}::${e.lines.length}`,zn=(e,t,n)=>{let r=new OffscreenCanvas(n.width,n.height),i=r.getContext(`2d`);if(!i)return null;i.save(),i.font=n.sourceFont?je(e):Dn(e,n.fontSize);let a=C(e.opacity),o=w(e.color,a),s=e.renderStyle===`outline-only`,c=s?{blur:0,alpha:0}:Ut(e.shadowIntensity,n.fontSize,a);i.shadowColor=`rgba(0, 0, 0, ${c.alpha})`,i.shadowBlur=c.blur,i.shadowOffsetX=0,i.shadowOffsetY=0,i.lineJoin=`round`,i.lineWidth=Wt(),i.strokeStyle=En(e),i.fillStyle=o,typeof n.canvasScale==`number`&&i.scale(n.canvasScale,n.canvasScale);let l=e.lines.length>0?e.lines:[e.text],u=Ln(e,i,t,`cache`,n.paddingX);return s&&l.forEach((e,t)=>{u(e,n.baselineY+t*n.lineHeight,`outline`)}),l.forEach((e,t)=>{u(e,n.baselineY+t*n.lineHeight,`fill`)}),i.restore(),r},Bn=(e,t,n)=>{for(let r of n.traces??[])zn(e,t,r);return zn(e,t,n.output)},Vn=(e,t,n)=>{if(e.isScrolling&&e.isFull&&e.fontSize>=35&&Math.abs(t-e.height*(Jt/Yt))<=2&&Math.abs(n-Yt/Jt*t)<=3){let r=n/qt;return{traces:[{width:Math.round(Xt*r),height:Math.round(Zt*r),fontSize:e.fontSize,paddingX:Qt*r,baselineY:$t*r,lineHeight:e.fontSize*en,sourceFont:!0}],output:{width:t,height:n,fontSize:an*r,paddingX:on*r,baselineY:sn*r,lineHeight:cn*r}}}if(e.isScrolling&&e.isFull&&e.hasSameVposFullMinchoEnder){if(n<=gn-1){let e=n/qt;return{output:{width:t,height:n,fontSize:an*e,paddingX:on*e,baselineY:sn*e,lineHeight:cn*e,canvasScale:un}}}return n<_n?{output:{width:t,height:n,fontSize:e.fontSize,paddingX:tn,baselineY:nn,lineHeight:e.fontSize*rn,canvasScale:un,sourceFont:!0}}:{output:{width:t,height:n,fontSize:e.fontSize,paddingX:Qt,baselineY:$t,lineHeight:e.fontSize*en,canvasScale:un,sourceFont:!0}}}return jn(e)?{output:{width:t,height:n,fontSize:vn,paddingX:yn,baselineY:bn,lineHeight:xn}}:null},Hn=(e,t)=>{if(!Ht())return null;let n=Math.abs(e.letterSpacing)>=2**-52,r=e.lines.length>1;n&&I.letterSpacingComments++,r&&I.multiLineComments++,!n&&!r&&I.normalComments++,I.totalCharactersDrawn+=e.text.length;let{paddingX:i,paddingY:a,textureWidth:o,textureHeight:s}=kn(e),c=Vn(e,o,s);if(c)return Bn(e,t,c);let l=new OffscreenCanvas(o,s),u=l.getContext(`2d`);if(!u)return null;u.save(),u.font=je(e);let d=C(e.opacity),f=i,p=e.lines.length>0?e.lines:[e.text],m=e.lines.length>1&&e.lineHeightPx>0?e.lineHeightPx:e.fontSize,h=On(e,a),g=Ln(e,u,t,`cache`,f),_=w(e.color,d),v=e.renderStyle===`outline-only`,y=v?{blur:0,alpha:0}:Ut(e.shadowIntensity,e.fontSize,d);return N()&&console.log(`[Shadow Debug - Cache]`,`
  Text: "${e.text}"`,`
  FontSize: ${e.fontSize}`,`
  Shadow intensity: ${e.shadowIntensity}`,`
  Shadow blur: ${y.blur}px`,`
  Shadow alpha: ${y.alpha}`,`
  Fill style: ${_}`),u.save(),u.shadowColor=`rgba(0, 0, 0, ${y.alpha})`,u.shadowBlur=y.blur,u.shadowOffsetX=0,u.shadowOffsetY=0,u.lineJoin=`round`,u.lineWidth=Wt(),u.strokeStyle=En(e),u.fillStyle=_,v&&p.forEach((e,t)=>{let n=h+t*m;g(e,n,`outline`)}),p.forEach((e,t)=>{let n=h+t*m;g(e,n,`fill`)}),u.restore(),u.restore(),l},Un=(e,t,n)=>{I.fallbacks++,t.save(),t.font=je(e);let r=C(e.opacity),i=n??e.x,a=e.lines.length>0?e.lines:[e.text],o=e.lines.length>1&&e.lineHeightPx>0?e.lineHeightPx:e.fontSize,s=e.y+e.fontSize,c=Ln(e,t,t,`fallback`,i),l=w(e.color,r),u=e.renderStyle===`outline-only`,d=u?{blur:0,alpha:0}:Ut(e.shadowIntensity,e.fontSize,r);N()&&console.log(`[Shadow Debug - Fallback]`,`
  Text: "${e.text}"`,`
  FontSize: ${e.fontSize}`,`
  Shadow intensity: ${e.shadowIntensity}`,`
  Shadow blur: ${d.blur}px`,`
  Shadow alpha: ${d.alpha}`,`
  Fill style: ${l}`),t.save(),t.shadowColor=`rgba(0, 0, 0, ${d.alpha})`,t.shadowBlur=d.blur,t.shadowOffsetX=0,t.shadowOffsetY=0,t.lineJoin=`round`,t.lineWidth=Wt(),t.strokeStyle=En(e),t.fillStyle=l,u&&a.forEach((e,t)=>{let n=s+t*o;c(e,n,`outline`)}),a.forEach((e,t)=>{let n=s+t*o;c(e,n,`fill`)}),t.restore(),t.restore()},Wn=(e,t,n)=>{try{if(!e.isActive||!t)return;let r=Rn(e),i=e.getCachedTexture();if(e.getTextureCacheKey()!==r||!i){I.misses++,I.creates++;let n=Hn(e,t);e.setCachedTexture(n),e.setTextureCacheKey(r)}else I.hits++;let a=e.getCachedTexture();if(a){let r=n??e.x,{paddingX:i,paddingY:o}=kn(e),s=An(e),c=In(e,a,r,i,s),l=c.x,u=e.isScrolling?e.y:e.y-o;c.scaleX===1&&c.scaleY===1?t.drawImage(a,l,u):t.drawImage(a,l,u,a.width*c.scaleX,a.height*c.scaleY),zt(`drawImage`,t,e,{x:l,y:u,width:a.width*c.scaleX,height:a.height*c.scaleY,sourceWidth:a.width,sourceHeight:a.height,meta:{statsTarget:`cache`,paddingX:i,paddingY:o,drawScale:s,drawScaleX:c.scaleX,drawScaleY:c.scaleY}}),Vt();return}Un(e,t,n),Vt()}catch(r){De.error(`Comment.draw`,r,{text:e.text,isActive:e.isActive,hasContext:!!t,interpolatedX:n})}},Gn=e=>e===`ltr`?`ltr`:`rtl`,Kn=e=>e===`ltr`?1:-1,qn=class{text;vposMs;commands;layout;isScrolling;size;sizeScale;opacityMultiplier;opacityOverride;colorOverride;isInvisible;isFull;isEnder;meta;hasSameVposFullMinchoEnder=!1;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily;fontWeight;opacity;activationTimeMs=null;staticExpiryTimeMs=null;isActive=!1;hasShown=!1;isPaused=!1;lastUpdateTime=0;reservationWidth=0;bufferWidth=0;visibleDurationMs=0;totalDurationMs=0;preCollisionDurationMs=0;speedPixelsPerMs=0;virtualStartX=0;exitThreshold=0;scrollDirection=`rtl`;renderStyle=`outline-only`;shadowIntensity=`medium`;creationIndex=0;letterSpacing=0;lineHeightMultiplier=1;lineHeightPx=0;lines=[];epochId=0;directionSign=-1;timeSource;lastSyncedSettingsVersion=-1;cachedTexture=null;textureCacheKey=``;constructor(e,t,n,r,i={},a=null){if(typeof e!=`string`)throw Error(`Comment text must be a string`);if(!Number.isFinite(t)||t<0)throw Error(`Comment vposMs must be a non-negative number`);this.text=e,this.vposMs=t,this.commands=Array.isArray(n)?[...n]:[],this.meta=a?{...a}:null;let o=ne(this.commands,{defaultColor:r.commentColor});this.layout=o.layout,this.isScrolling=this.layout===`naka`,this.size=o.size,this.sizeScale=o.sizeScale,this.opacityMultiplier=o.opacityMultiplier,this.opacityOverride=o.opacityOverride,this.colorOverride=o.colorOverride,this.isInvisible=o.isInvisible,this.isFull=o.isFull,this.isEnder=o.isEnder,this.fontFamily=o.fontFamily,this.fontWeight=o.fontWeight,this.color=o.resolvedColor,this.opacity=this.getEffectiveOpacity(r.commentOpacity),this.renderStyle=r.renderStyle,this.shadowIntensity=r.shadowIntensity,this.letterSpacing=o.letterSpacing,this.lineHeightMultiplier=o.lineHeight,this.timeSource=i.timeSource??ie(),this.applyScrollDirection(r.scrollDirection),this.syncWithSettings(r,i.settingsVersion)}prepare(e,t,n,r){Tt(this,e,t,n,r)}draw(e,t=null){Wn(this,e,t)}update(e=1,t=!1){try{if(!this.isActive){this.isPaused=t;return}let n=this.timeSource.now();if(!this.isScrolling){this.isPaused=t,this.lastUpdateTime=n;return}if(t){this.isPaused=!0,this.lastUpdateTime=n;return}let r=(n-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*e,this.x+=this.speed*r*this.directionSign,(this.scrollDirection===`rtl`&&this.x<=this.exitThreshold||this.scrollDirection===`ltr`&&this.x>=this.exitThreshold)&&(this.isActive=!1),this.lastUpdateTime=n,this.isPaused=!1}catch(n){De.error(`Comment.update`,n,{text:this.text,playbackRate:e,isPaused:t,isActive:this.isActive})}}syncWithSettings(e,t){typeof t==`number`&&t===this.lastSyncedSettingsVersion||(this.color=this.getEffectiveColor(e.commentColor),this.opacity=this.getEffectiveOpacity(e.commentOpacity),this.applyScrollDirection(e.scrollDirection),this.renderStyle=e.renderStyle,this.shadowIntensity=e.shadowIntensity,typeof t==`number`&&(this.lastSyncedSettingsVersion=t))}getEffectiveColor(e){let t=this.colorOverride??e;return typeof t!=`string`||t.length===0?e:t.toUpperCase()}getEffectiveOpacity(e){if(typeof this.opacityOverride==`number`)return C(this.opacityOverride);let t=e*this.opacityMultiplier;return Number.isFinite(t)?C(t):0}markActivated(e){this.activationTimeMs=e}clearActivation(){this.activationTimeMs=null,this.isScrolling||(this.staticExpiryTimeMs=null),this.resetTextureCache()}hasStaticExpired(e){return this.isScrolling||this.staticExpiryTimeMs===null?!1:e>=this.staticExpiryTimeMs}getDirectionSign(){return this.directionSign}getTimeSource(){return this.timeSource}getTextureCacheKey(){return this.textureCacheKey}setTextureCacheKey(e){this.textureCacheKey=e}getCachedTexture(){return this.cachedTexture}setCachedTexture(e){this.cachedTexture=e}resetTextureCache(){this.cachedTexture=null,this.textureCacheKey=``}applyScrollDirection(e){let t=Gn(e);this.scrollDirection=t,this.directionSign=Kn(t)}},Jn={commentColor:`#FFFFFF`,commentOpacity:1,isCommentVisible:!0,useContainerResizeObserver:!0,ngWords:[],ngRegexps:[],scrollDirection:`rtl`,renderStyle:`outline-only`,syncMode:`raf`,scrollVisibleDurationMs:6700,useFixedLaneCount:!1,fixedLaneCount:12,useDprScaling:!0,shadowIntensity:`medium`},Yn=()=>({...Jn,ngWords:[...Jn.ngWords],ngRegexps:[...Jn.ngRegexps]}),Xn=e=>Number.isFinite(e)?e<=0?0:e>=1?1:e:1,Zn=e=>{let t=e.scrollVisibleDurationMs,n=t==null?null:Number.isFinite(t)?Math.max(1,Math.floor(t)):null;return{...e,scrollDirection:e.scrollDirection===`ltr`?`ltr`:`rtl`,commentOpacity:Xn(e.commentOpacity),renderStyle:e.renderStyle===`classic`?`classic`:`outline-only`,scrollVisibleDurationMs:n,syncMode:e.syncMode===`video-frame`?`video-frame`:`raf`,useDprScaling:!!e.useDprScaling}},Qn=e=>typeof window<`u`&&typeof window.requestAnimationFrame==`function`&&typeof window.cancelAnimationFrame==`function`?{request:e=>window.requestAnimationFrame(e),cancel:e=>window.cancelAnimationFrame(Number(e))}:{request:t=>globalThis.setTimeout(()=>{t(e.now())},16),cancel:e=>{globalThis.clearTimeout(e)}},$n=()=>typeof document>`u`?()=>{throw Error(`Document is not available. Provide a custom createCanvasElement implementation.`)}:()=>document.createElement(`canvas`),er=e=>{if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.commentColor==`string`&&typeof t.commentOpacity==`number`&&typeof t.isCommentVisible==`boolean`},tr=e=>e.isScrolling&&e.isFull&&e.text.includes(`
`)&&e.commands.some(e=>e.toLowerCase()===`mincho`),nr=e=>{let t=new Set;e.forEach(e=>{e.isEnder&&tr(e)&&t.add(e.vposMs)}),e.forEach(e=>{e.hasSameVposFullMinchoEnder=t.has(e.vposMs)&&tr(e)})},rr=e=>{let t=e.meta?.no;return typeof t==`number`&&Number.isFinite(t)?t:null},ir=function(e){if(!Array.isArray(e)||e.length===0)return[];let t=[];this.commentDependencies.settingsVersion=this.settingsVersion;for(let n of e){let{text:e,vposMs:r,commands:i=[],meta:a=null}=n,o=F(e);if(this.isNGComment(e)){P(`comment-skip-ng`,{preview:o,vposMs:r});continue}let s=ae(r);if(s===null){this.log.warn(`CommentRenderer.addComment.invalidVpos`,{text:e,vposMs:r}),P(`comment-skip-invalid-vpos`,{preview:o,vposMs:r});continue}let c=a?.no===void 0?`fallback:${e}\0${s}`:`no:${a.source??``}:${a.fork??``}:${a.threadId??``}:${a.no}`,l=e=>e.meta?.no===void 0?`fallback:${e.text}\0${e.vposMs}`:`no:${e.meta.source??``}:${e.meta.fork??``}:${e.meta.threadId??``}:${e.meta.no}`;if(this.comments.some(e=>l(e)===c)||t.some(e=>l(e)===c)){P(`comment-skip-duplicate`,{preview:o,vposMs:s});continue}let u=new qn(e,s,i,this._settings,this.commentDependencies,a);u.creationIndex=this.commentSequence++,u.epochId=this.epochId,t.push(u),P(`comment-added`,{preview:o,vposMs:s,commands:u.commands.length,layout:u.layout,isScrolling:u.isScrolling,invisible:u.isInvisible})}return t.length===0?[]:(this.comments.push(...t),nr(this.comments),this.finalPhaseActive&&(this.finalPhaseScheduleDirty=!0),this.comments.sort((e,t)=>{let n=e.vposMs-t.vposMs;if(Math.abs(n)>O)return n;let r=rr(e),i=rr(t);return r!==null&&i!==null&&Math.abs(r-i)>O?r-i:e.creationIndex-t.creationIndex}),t)},ar=function(e,t,n=[],r=null){let[i]=this.addComments([{text:e,vposMs:t,commands:n,meta:r}]);return i??null},or=function(){if(this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.commentSequence=0,this.ctx&&this.canvas){let e=this.canvasDpr>0?this.canvasDpr:1,t=this.displayWidth>0?this.displayWidth:this.canvas.width/e,n=this.displayHeight>0?this.displayHeight:this.canvas.height/e;this.ctx.clearRect(0,0,t,n)}},sr=function(){this.clearComments(),this.currentTime=0,this.resetFinalPhaseState(),this.playbackHasBegun=!1,this.skipDrawingForCurrentFrame=!1,this.isStalled=!1,this.pendingInitialSync=!1},cr=function(){let e=this._settings,t=Array.isArray(e.ngWords)?e.ngWords:[];this.normalizedNgWords=t.filter(e=>typeof e==`string`);let n=Array.isArray(e.ngRegexps)?e.ngRegexps:[];this.compiledNgRegexps=n.map(e=>{if(typeof e!=`string`)return null;try{return new RegExp(e,`i`)}catch(t){return this.log.warn(`CommentRenderer.invalidNgRegexp`,t,{entry:e}),null}}).filter(e=>!!e)},lr=function(e){return typeof e!=`string`||e.length===0?!1:this.normalizedNgWords.some(t=>t.length>0&&e.includes(t))?!0:this.compiledNgRegexps.some(t=>t.test(e))},ur=e=>{e.prototype.addComments=ir,e.prototype.addComment=ar,e.prototype.clearComments=or,e.prototype.resetState=sr,e.prototype.rebuildNgMatchers=cr,e.prototype.isNGComment=lr},dr=function(){this.finalPhaseActive=!1,this.finalPhaseStartTime=null,this.finalPhaseScheduleDirty=!1,this.finalPhaseVposOverrides.clear()},fr=function(e){let t=this.epochId;if(this.epochId+=1,Mt(t,this.epochId,e),this.eventHooks.onEpochChange){let n={previousEpochId:t,newEpochId:this.epochId,reason:e,timestamp:this.timeSource.now()};try{this.eventHooks.onEpochChange(n)}catch(e){this.log.error(`CommentRenderer.incrementEpoch.callback`,e,{info:n})}}this.comments.forEach(e=>{e.epochId=this.epochId})},pr=function(e){let t=this.timeSource.now();if(t-this.lastSnapshotEmitTime<this.snapshotEmitThrottleMs)return;let n={currentTime:this.currentTime,duration:this.duration,isPlaying:this.isPlaying,epochId:this.epochId,totalComments:this.comments.length,activeComments:this.activeComments.size,reservedLanes:this.reservedLanes.size,finalPhaseActive:this.finalPhaseActive,playbackHasBegun:this.playbackHasBegun,isStalled:this.isStalled};if(jt(e,n),this.eventHooks.onStateSnapshot)try{this.eventHooks.onStateSnapshot(n)}catch(e){this.log.error(`CommentRenderer.emitStateSnapshot.callback`,e)}this.lastSnapshotEmitTime=t},mr=function(e){this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline();let t=this.finalPhaseVposOverrides.get(e);return t===void 0?hr(e):t},hr=e=>{if(!e.isScrolling)return e.vposMs;let t=e.isFull?Ce:ye;return Math.max(0,e.vposMs-t)},gr=function(e){if(!e.isScrolling)return E;let t=[];return Number.isFinite(e.visibleDurationMs)&&e.visibleDurationMs>0&&t.push(e.visibleDurationMs),Number.isFinite(e.totalDurationMs)&&e.totalDurationMs>0&&t.push(e.totalDurationMs),t.length>0?Math.max(...t):oe},_r=function(e){if(!this.finalPhaseActive||this.finalPhaseStartTime===null)return this.finalPhaseVposOverrides.delete(e),hr(e);this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline();let t=this.finalPhaseVposOverrides.get(e);if(t!==void 0)return t;let n=Math.max(e.vposMs,this.finalPhaseStartTime);return this.finalPhaseVposOverrides.set(e,n),n},vr=function(){if(!this.finalPhaseActive||this.finalPhaseStartTime===null){this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=!1;return}let e=this.finalPhaseStartTime,t=this.duration>0?this.duration:e+_e,n=Math.max(e+_e,t),r=this.comments.filter(t=>t.hasShown||t.isInvisible||this.isNGComment(t.text)?!1:t.vposMs>=e-D).sort((e,t)=>{let n=e.vposMs-t.vposMs;return Math.abs(n)>O?n:e.creationIndex-t.creationIndex});if(this.finalPhaseVposOverrides.clear(),r.length===0){this.finalPhaseScheduleDirty=!1;return}let i=Math.max(n-e,_e)/Math.max(r.length,1),a=Math.max(me,Math.min(Number.isFinite(i)?i:me,he)),o=e;r.forEach((t,r)=>{let i=Math.max(1,this.getFinalPhaseDisplayDuration(t)),s=n-i,c=Math.max(e,Math.min(o,s));Number.isFinite(c)||(c=e);let l=ge*r;c+l<=s&&(c+=l),this.finalPhaseVposOverrides.set(t,c);let u=Math.max(me,Math.min(i/2,a));o=c+u}),this.finalPhaseScheduleDirty=!1},yr=e=>{e.prototype.resetFinalPhaseState=dr,e.prototype.incrementEpoch=fr,e.prototype.emitStateSnapshot=pr,e.prototype.getEffectiveCommentVpos=mr,e.prototype.getFinalPhaseDisplayDuration=gr,e.prototype.resolveFinalPhaseVpos=_r,e.prototype.recomputeFinalPhaseTimeline=vr},br=function(){return!this.playbackHasBegun&&!this.isPlaying&&this.currentTime<=k},xr=function(){this.playbackHasBegun||(this.isPlaying||this.currentTime>k)&&(this.playbackHasBegun=!0)},Sr=e=>{e.prototype.shouldSuppressRendering=br,e.prototype.updatePlaybackProgressState=xr},Cr=function(e){let t=this.videoElement,n=this.canvas,r=this.ctx;if(!t||!n||!r)return;let i=typeof e==`number`?e:T(t.currentTime);if(this.currentTime=i,this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.updatePlaybackProgressState(),this.skipDrawingForCurrentFrame=this.shouldSuppressRendering(),this.skipDrawingForCurrentFrame)return;let a=this.canvasDpr>0?this.canvasDpr:1,o=this.displayWidth>0?this.displayWidth:n.width/a,s=this.displayHeight>0?this.displayHeight:n.height/a,c=this.buildPrepareOptions(o),l=this.duration>0&&this.duration-this.currentTime<=pe;l&&!this.finalPhaseActive&&(this.finalPhaseActive=!0,this.finalPhaseStartTime=this.currentTime,this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=!0,r.clearRect(0,0,o,s),this.comments.forEach(e=>{e.isActive=!1,e.clearActivation()}),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0),!l&&this.finalPhaseActive&&this.resetFinalPhaseState(),this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline(),this.pruneStaticLaneReservations(this.currentTime);for(let e of Array.from(this.activeComments)){let t=this.getEffectiveCommentVpos(e),n=t<this.currentTime-D,r=t>this.currentTime+D;if(n||r){e.isActive=!1,this.activeComments.delete(e),e.clearActivation(),e.lane>=0&&(e.layout===`ue`?this.releaseStaticLane(`ue`,e.lane):e.layout===`shita`&&this.releaseStaticLane(`shita`,e.lane));continue}e.isScrolling&&e.hasShown&&(e.scrollDirection===`rtl`&&e.x<=e.exitThreshold||e.scrollDirection===`ltr`&&e.x>=e.exitThreshold)&&(e.isActive=!1,this.activeComments.delete(e),e.clearActivation())}let u=this.getCommentsInTimeWindow(this.currentTime,D);for(let e of u){let t=N(),n=t?F(e.text):``;if(t&&P(`comment-evaluate`,{stage:`update`,preview:n,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),currentTime:this.currentTime,isActive:e.isActive,hasShown:e.hasShown}),this.isNGComment(e.text)){t&&P(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),reason:`ng-runtime`});continue}if(e.isInvisible){t&&P(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),reason:`invisible`}),e.isActive=!1,this.activeComments.delete(e),e.hasShown=!0,e.clearActivation();continue}if(e.syncWithSettings(this._settings,this.settingsVersion),this.shouldActivateCommentAtTime(e,this.currentTime,n)&&this.activateComment(e,r,o,s,c,this.currentTime),e.isActive){if(e.layout!==`naka`&&e.hasStaticExpired(this.currentTime)){let t=e.layout===`ue`?`ue`:`shita`;this.releaseStaticLane(t,e.lane),e.isActive=!1,this.activeComments.delete(e),e.clearActivation();continue}if(e.layout===`naka`&&this.getEffectiveCommentVpos(e)>this.currentTime+k){e.x=e.virtualStartX,e.lastUpdateTime=this.timeSource.now();continue}if(e.hasShown=!0,e.update(this.playbackRate,!this.isPlaying),!e.isScrolling&&e.hasStaticExpired(this.currentTime)){let t=e.layout===`ue`?`ue`:`shita`;this.releaseStaticLane(t,e.lane),e.isActive=!1,this.activeComments.delete(e),e.clearActivation()}}}},wr=function(e){let t=this._settings.scrollVisibleDurationMs,n=oe,r=se;return t!==null&&(n=t,r=Math.max(1,Math.min(t,se))),{visibleWidth:e,virtualExtension:ve,maxVisibleDurationMs:n,minVisibleDurationMs:r,maxWidthRatio:ce,bufferRatio:le,baseBufferPx:ue,entryBufferPx:de}},Tr=function(e){let t=this.currentTime;this.pruneLaneReservations(t),this.pruneStaticLaneReservations(t);let n=this.getLanePriorityOrder(t),r=this.createLaneReservation(e,t),i=n.map(e=>{let n=(this.reservedLanes.get(e)??[]).find(e=>this.areReservationsConflicting(e,r));return{lane:e,available:n===void 0,nextAvailableTime:this.getLaneNextAvailableTime(e,t),blocker:n}}),a=i.find(e=>e.available),o=n[n.length-1]??0,s=a?.lane??o;return this.storeLaneReservation(s,r),Bt(`laneDecision`,e,{meta:{currentTimeMs:t,selectedLane:s,usedFallback:a===void 0,candidateLanes:i.map(e=>e.lane).join(`,`),availableLanes:i.filter(e=>e.available).map(e=>e.lane).join(`,`),nextAvailableTimes:i.map(e=>Math.round(e.nextAvailableTime)).join(`,`),blockedBy:i.map(e=>e.blocker?`${e.lane}:${e.blocker.comment.creationIndex}@${e.blocker.comment.vposMs}`:`${e.lane}:-`).join(`,`),reservationStartTimeMs:Math.round(r.startTime),reservationEndTimeMs:Math.round(r.endTime),reservationTotalEndTimeMs:Math.round(r.totalEndTime),reservationWidth:Math.round(r.width)}}),s},Er=e=>{e.prototype.updateComments=Cr,e.prototype.buildPrepareOptions=wr,e.prototype.findAvailableLane=Tr},Dr=function(e,t){let n=0,r=e.length;for(;n<r;){let i=Math.floor((n+r)/2),a=e[i];a!==void 0&&a.totalEndTime+fe<=t?n=i+1:r=i}return n},Or=function(e){for(let[t,n]of this.reservedLanes.entries()){let r=this.findFirstValidReservationIndex(n,e);r>=n.length?this.reservedLanes.delete(t):r>0&&this.reservedLanes.set(t,n.slice(r))}},kr=function(e){let t=t=>t.filter(t=>t.releaseTime>e),n=t(this.topStaticLaneReservations),r=t(this.bottomStaticLaneReservations);this.topStaticLaneReservations.length=0,this.topStaticLaneReservations.push(...n),this.bottomStaticLaneReservations.length=0,this.bottomStaticLaneReservations.push(...r)},Ar=e=>{e.prototype.findFirstValidReservationIndex=Dr,e.prototype.pruneLaneReservations=Or,e.prototype.pruneStaticLaneReservations=kr},jr=function(e){let t=0,n=this.comments.length;for(;t<n;){let r=Math.floor((t+n)/2),i=this.comments[r];i!==void 0&&i.vposMs<e?t=r+1:n=r}return t},Mr=function(e,t){if(this.comments.length===0)return[];let n=e-t,r=e+t,i=this.findCommentIndexAtOrAfter(n),a=[];for(let e=i;e<this.comments.length;e++){let t=this.comments[e];if(t){if(t.vposMs>r)break;a.push(t)}}return a},Nr=function(e){return e===`ue`?this.topStaticLaneReservations:this.bottomStaticLaneReservations},Pr=function(e){return e===`ue`?this.topStaticLaneReservations.length:this.bottomStaticLaneReservations.length},Fr=function(e){let t=e===`ue`?`shita`:`ue`,n=this.getStaticLaneDepth(t),r=this.laneCount-n;return r<=0?-1:r-1},Ir=function(e){return Math.max(0,this.laneCount-1-e)},Lr=e=>{let t=Math.ceil(e.lines.length>1?e.height:e.height+e.fontSize/3);return Math.max(0,(t-e.height)/2)},Rr=function(e,t,n,r){let i=Math.max(1,n),a=Math.max(r.height,r.fontSize),o=Lr(r);if(e===`ue`){let n=5+o,r=n,a=this.getStaticReservations(e).filter(e=>e.lane<t).sort((e,t)=>e.lane-t.lane);for(let e of a){let t=e.yEnd-e.yStart;r+=t+0}let s=Math.max(5,i*2);return Math.max(n,Math.min(r,s))}let s=i-5,c=this.getStaticReservations(e).filter(e=>e.lane<t).sort((e,t)=>e.lane-t.lane);for(let e of c){let t=e.yEnd-e.yStart;s-=t+0}let l=s-a;return Math.max(5,l)},zr=function(){let e=new Set;for(let t of this.topStaticLaneReservations)e.add(t.lane);for(let t of this.bottomStaticLaneReservations)e.add(this.getGlobalLaneIndexForBottom(t.lane));return e},Br=e=>{e.prototype.findCommentIndexAtOrAfter=jr,e.prototype.getCommentsInTimeWindow=Mr,e.prototype.getStaticReservations=Nr,e.prototype.getStaticLaneDepth=Pr,e.prototype.getStaticLaneLimit=Fr,e.prototype.getGlobalLaneIndexForBottom=Ir,e.prototype.resolveStaticCommentOffset=Rr,e.prototype.getStaticReservedLaneSet=zr},Vr=e=>!e.isScrolling&&e.width>=1200&&e.fontSize>=35,Hr=e=>Math.max(1,e.fontSize*(Vr(e)?.46:1)),Ur=function(e,t,n=``){let r=n.length>0&&N(),i=this.resolveFinalPhaseVpos(e);return this.finalPhaseActive&&this.finalPhaseStartTime!==null&&e.vposMs<this.finalPhaseStartTime-O?(r&&P(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`final-phase-trimmed`,finalPhaseStartTime:this.finalPhaseStartTime}),this.finalPhaseVposOverrides.delete(e),!1):e.isInvisible?(r&&P(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`invisible`}),!1):e.isActive?(r&&P(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`already-active`}),!1):e.hasShown&&i<=t?(r&&P(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`already-shown`,currentTime:t}),!1):i>t+k?(r&&P(`comment-eval-pending`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`future`,currentTime:t}),!1):i<t-D?(r&&P(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`expired-window`,currentTime:t}),!1):!e.isScrolling&&i+E<=t?(r&&P(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`static-expired`,currentTime:t}),!1):(r&&P(`comment-eval-ready`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,currentTime:t}),!0)},Wr=function(e,t,n,r,i,a){e.prepare(t,n,r,i);let o=this.resolveFinalPhaseVpos(e);if(N()&&P(`comment-prepared`,{preview:F(e.text),layout:e.layout,isScrolling:e.isScrolling,width:e.width,height:e.height,bufferWidth:e.bufferWidth,visibleDurationMs:e.visibleDurationMs,effectiveVposMs:o}),e.layout===`naka`){let t=Math.max(0,a-o),i=e.speedPixelsPerMs*t;if(this.finalPhaseActive&&this.finalPhaseStartTime!==null){let t=this.duration>0?this.duration:this.finalPhaseStartTime+_e,r=Math.max(this.finalPhaseStartTime+_e,t),s=e.width+n;if(o+(s>0?s/Math.max(e.speedPixelsPerMs,1):0)>r){let t=r-a,o=Math.max(0,t)*e.speedPixelsPerMs;e.x=e.scrollDirection===`rtl`?Math.max(e.virtualStartX-i,n-o):Math.min(e.virtualStartX+i,o-e.width)}else e.x=e.scrollDirection===`rtl`?e.virtualStartX-i:e.virtualStartX+i}else e.x=e.scrollDirection===`rtl`?e.virtualStartX-i:e.virtualStartX+i;let s=this.findAvailableLane(e);e.lane=s;let c=Math.max(1,this.laneHeight),l=Math.max(0,r-e.height),u=s*c;e.y=e.isFull?0:Math.max(0,Math.min(u,l))}else{let t=e.layout===`ue`?`ue`:`shita`,n=this.assignStaticLane(t,e,r,a),i=this.resolveStaticCommentOffset(t,n,r,e);e.x=e.virtualStartX,e.y=i,e.lane=t===`ue`?n:this.getGlobalLaneIndexForBottom(n),e.speed=0,e.baseSpeed=0,e.speedPixelsPerMs=0;let s=o+E;e.visibleDurationMs=Math.max(0,s-a),this.activeComments.add(e),e.isActive=!0,e.hasShown=!0,e.isPaused=!this.isPlaying,e.markActivated(a),e.lastUpdateTime=this.timeSource.now(),e.staticExpiryTimeMs=s,this.reserveStaticLane(t,e,n,s),N()&&P(`comment-activate-static`,{preview:F(e.text),lane:e.lane,position:t,displayEnd:s,effectiveVposMs:o});return}this.activeComments.add(e),e.isActive=!0,e.hasShown=!0,e.isPaused=!this.isPlaying,e.markActivated(a),e.lastUpdateTime=this.timeSource.now()},Gr=function(e,t,n,r){let i=this.getStaticReservations(e),a=Hr(t),o=Math.max(1,a),s=Math.max(this.laneCount,Math.ceil(Math.max(1,n)/o)+i.length+1),c=Array.from({length:s},(e,t)=>t);for(let o of c){let s=this.resolveStaticCommentOffset(e,o,n,t),c=s,l=s+a;if(!i.some(e=>e.releaseTime>r?!(l<=e.yStart||c>=e.yEnd):!1))return o}let l=c[0]??0,u=1/0;for(let e of i)e.releaseTime<u&&(u=e.releaseTime,l=e.lane);return l},Kr=function(e,t,n,r){let i=this.getStaticReservations(e),a=t.y,o=t.y+Hr(t);i.push({comment:t,releaseTime:r,yStart:a,yEnd:o,lane:n})},qr=function(e,t){if(t<0)return;let n=this.getStaticReservations(e),r=n.findIndex(e=>e.lane===t);r>=0&&n.splice(r,1)},Jr=e=>{e.prototype.shouldActivateCommentAtTime=Ur,e.prototype.activateComment=Wr,e.prototype.assignStaticLane=Gr,e.prototype.reserveStaticLane=Kr,e.prototype.releaseStaticLane=qr},Yr=.001,Xr=function(){return Array.from({length:this.laneCount},(e,t)=>t)},Zr=function(e,t){let n=this.reservedLanes.get(e);if(!n||n.length===0)return t;let r=n[this.findFirstValidReservationIndex(n,t)];return r?Math.max(t,r.endTime+fe):t},Qr=function(e,t){let n=Math.max(e.speedPixelsPerMs,O),r=this.getEffectiveCommentVpos(e),i=Math.max(0,Number.isFinite(r)?r:t),a=Number.isFinite(e.width)&&e.width>0?e.width:e.reservationWidth,o=i+(n>0?Math.max(a,0)/n:e.preCollisionDurationMs)+fe,s=i+e.totalDurationMs+fe;return{comment:e,startTime:i,endTime:Math.max(i,o),totalEndTime:Math.max(i,s),startLeft:e.virtualStartX,width:a,speed:n,buffer:0,directionSign:e.getDirectionSign()}},$r=function(e,t,n){let r=this.reservedLanes.get(e);if(!r||r.length===0)return!0;let i=this.findFirstValidReservationIndex(r,n);for(let e=i;e<r.length;e+=1){let n=r[e];if(n&&this.areReservationsConflicting(n,t))return!1}return!0},ei=function(e,t){let n=[...this.reservedLanes.get(e)??[],t].sort((e,t)=>e.totalEndTime-t.totalEndTime);this.reservedLanes.set(e,n)},ti=function(e,t){if(e.directionSign===t.directionSign){let n=e.speed>0?Math.max(e.width,0)/e.speed:0,r=t.speed>0?Math.max(t.width,0)/t.speed:0,i=Math.max(n,r);return Math.abs(t.startTime-e.startTime)+Yr<i}let n=Math.max(e.startTime,t.startTime),r=Math.min(e.endTime,t.endTime);if(n>=r)return!1;let i=new Set([n,r,n+(r-n)/2]),a=this.solveLeftRightEqualityTime(e,t);a!==null&&a>=n-O&&a<=r+O&&i.add(a);let o=this.solveLeftRightEqualityTime(t,e);o!==null&&o>=n-O&&o<=r+O&&i.add(o);for(let a of i){if(a<n-O||a>r+O)continue;let i=this.computeForwardGap(e,t,a),o=this.computeForwardGap(t,e,a);if(i<=-24&&o<=-24)return!0}return!1},ni=function(e,t,n){let r=this.getBufferedEdges(e,n),i=this.getBufferedEdges(t,n);return r.left-i.right},ri=function(e,t){let n=Math.max(0,t-e.startTime),r=e.speed*n,i=e.startLeft+e.directionSign*r;return{left:i-e.buffer,right:i+e.width+e.buffer}},ii=function(e,t){let n=e.directionSign,r=t.directionSign,i=r*t.speed-n*e.speed;if(Math.abs(i)<O)return null;let a=(t.startLeft+r*t.speed*t.startTime+t.width+t.buffer-e.startLeft-n*e.speed*e.startTime+e.buffer)/i;return Number.isFinite(a)?a:null},ai=e=>{e.prototype.getLanePriorityOrder=Xr,e.prototype.getLaneNextAvailableTime=Zr,e.prototype.createLaneReservation=Qr,e.prototype.isLaneAvailable=$r,e.prototype.storeLaneReservation=ei,e.prototype.areReservationsConflicting=ti,e.prototype.computeForwardGap=ni,e.prototype.getBufferedEdges=ri,e.prototype.solveLeftRightEqualityTime=ii},oi=function(){let e=this.canvas,t=this.ctx;if(!e||!t)return;let n=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:e.width/n,i=this.displayHeight>0?this.displayHeight:e.height/n,a=this.timeSource.now();if(this.skipDrawingForCurrentFrame||this.shouldSuppressRendering()||this.isStalled){t.clearRect(0,0,r,i),this.lastDrawTime=a;return}t.clearRect(0,0,r,i);let o=Array.from(this.activeComments);if(this._settings.isCommentVisible){let e=(a-this.lastDrawTime)/16.666666666666668;o.sort((e,t)=>{let n=this.getEffectiveCommentVpos(e)-this.getEffectiveCommentVpos(t);return Math.abs(n)>O?n:e.isScrolling===t.isScrolling?e.creationIndex-t.creationIndex:e.isScrolling?1:-1}),o.forEach(n=>{let r=this.isPlaying&&!n.isPaused?n.x+n.getDirectionSign()*n.speed*e:n.x;n.draw(t,r)})}this.lastDrawTime=a},si=function(e){let t=this.videoElement,n=this.canvas,r=this.ctx;if(!t||!n||!r)return;let i=typeof e==`number`?e:T(t.currentTime);this.currentTime=i,this.lastDrawTime=this.timeSource.now();let a=this.canvasDpr>0?this.canvasDpr:1,o=this.displayWidth>0?this.displayWidth:n.width/a,s=this.displayHeight>0?this.displayHeight:n.height/a,c=this.buildPrepareOptions(o);this.activeComments.forEach(e=>{e.isActive=!1,e.clearActivation()}),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.getCommentsInTimeWindow(this.currentTime,D).forEach(e=>{if(this.isNGComment(e.text)||e.isInvisible){e.isActive=!1,this.activeComments.delete(e),e.clearActivation();return}if(e.syncWithSettings(this._settings,this.settingsVersion),e.isActive=!1,this.activeComments.delete(e),e.lane=-1,e.hasShown=!1,e.clearActivation(),this.shouldActivateCommentAtTime(e,this.currentTime)){this.activateComment(e,r,o,s,c,this.currentTime);return}this.getEffectiveCommentVpos(e)<this.currentTime-D?e.hasShown=!0:e.hasShown=!1})},ci=e=>{e.prototype.draw=oi,e.prototype.performInitialSync=si},li=function(e){this.videoElement&&this._settings.isCommentVisible&&(this.pendingInitialSync&&=(this.performInitialSync(e),!1),this.updateComments(e),this.draw())},ui=function(){let e=this.frameId;this.frameId=null,e!==null&&this.animationFrameProvider.cancel(e),this.processFrame(),this.scheduleNextFrame()},di=function(e,t){this.videoFrameHandle=null;let n=typeof t?.mediaTime==`number`?t.mediaTime*1e3:void 0;this.processFrame(typeof n==`number`?n:void 0),this.scheduleNextFrame()},fi=function(){if(this._settings.syncMode!==`video-frame`)return!1;let e=this.videoElement;return!!e&&typeof e.requestVideoFrameCallback==`function`&&typeof e.cancelVideoFrameCallback==`function`},pi=function(){let e=this.videoElement;if(e){if(this.shouldUseVideoFrameCallback()){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();let t=e.requestVideoFrameCallback;typeof t==`function`&&(this.videoFrameHandle=t.call(e,this.handleVideoFrame));return}this.cancelVideoFrameCallback(),this.frameId=this.animationFrameProvider.request(this.handleAnimationFrame)}},mi=function(){this.frameId!==null&&(this.animationFrameProvider.cancel(this.frameId),this.frameId=null)},hi=function(){if(this.videoFrameHandle===null)return;let e=this.videoElement;e&&typeof e.cancelVideoFrameCallback==`function`&&e.cancelVideoFrameCallback(this.videoFrameHandle),this.videoFrameHandle=null},gi=function(){this.stopAnimation(),this.scheduleNextFrame()},_i=function(){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback()},vi=function(){let e=this.canvas,t=this.ctx,n=this.videoElement;if(!e||!t||!n)return;let r=T(n.currentTime),i=Math.abs(r-this.currentTime),a=this.timeSource.now();if(a-this.lastPlayResumeTime<this.playResumeSeekIgnoreDurationMs){this.currentTime=r,this._settings.isCommentVisible&&(this.lastDrawTime=a,this.draw());return}let o=i>k;if(this.currentTime=r,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),!o){this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());return}this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;let s=this.canvasDpr>0?this.canvasDpr:1,c=this.displayWidth>0?this.displayWidth:e.width/s,l=this.displayHeight>0?this.displayHeight:e.height/s,u=this.buildPrepareOptions(c);this.getCommentsInTimeWindow(this.currentTime,D).forEach(e=>{let n=N(),r=n?F(e.text):``;if(n&&P(`comment-evaluate`,{stage:`seek`,preview:r,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),currentTime:this.currentTime,isActive:e.isActive,hasShown:e.hasShown}),this.isNGComment(e.text)){n&&P(`comment-eval-skip`,{preview:r,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),reason:`ng-runtime`}),e.isActive=!1,this.activeComments.delete(e),e.clearActivation();return}if(e.isInvisible){n&&P(`comment-eval-skip`,{preview:r,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),reason:`invisible`}),e.isActive=!1,this.activeComments.delete(e),e.hasShown=!0,e.clearActivation();return}if(e.syncWithSettings(this._settings,this.settingsVersion),e.isActive=!1,this.activeComments.delete(e),e.lane=-1,e.hasShown=!1,e.clearActivation(),this.shouldActivateCommentAtTime(e,this.currentTime,r)){this.activateComment(e,t,c,l,u,this.currentTime);return}this.getEffectiveCommentVpos(e)<this.currentTime-D?e.hasShown=!0:e.hasShown=!1}),this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw())},yi=e=>{e.prototype.processFrame=li,e.prototype.handleAnimationFrame=ui,e.prototype.handleVideoFrame=di,e.prototype.shouldUseVideoFrameCallback=fi,e.prototype.scheduleNextFrame=pi,e.prototype.cancelAnimationFrameRequest=mi,e.prototype.cancelVideoFrameCallback=hi,e.prototype.startAnimation=gi,e.prototype.stopAnimation=_i,e.prototype.onSeek=vi},bi=function(e,t){if(e)return e;if(t.parentElement)return t.parentElement;if(typeof document<`u`&&document.body)return document.body;throw Error(`Cannot resolve container element. Provide container explicitly when DOM is unavailable.`)},xi=function(e){if(typeof getComputedStyle==`function`){getComputedStyle(e).position===`static`&&(e.style.position=`relative`);return}e.style.position||(e.style.position=`relative`)},Si=function(e){try{this.destroyCanvasOnly();let t=e instanceof HTMLVideoElement?e:e.video,n=e instanceof HTMLVideoElement?e.parentElement:e.container??e.video.parentElement,r=this.resolveContainer(n??null,t);this.videoElement=t,this.containerElement=r,this.lastVideoSource=this.getCurrentVideoSource(),this.duration=Number.isFinite(t.duration)?T(t.duration):0,this.currentTime=T(t.currentTime),this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.isStalled=!1,this.lastDrawTime=this.timeSource.now(),this.playbackHasBegun=this.isPlaying||this.currentTime>k,this.skipDrawingForCurrentFrame=this.shouldSuppressRendering();let i=this.createCanvasElement(),a=i.getContext(`2d`);if(!a)throw Error(`Failed to acquire 2D canvas context`);i.style.position=`absolute`,i.style.top=`0`,i.style.left=`0`,i.style.right=`0`,i.style.bottom=`0`,i.style.display=`block`,i.style.pointerEvents=`none`,i.style.zIndex=`2147483647`;let o=this.containerElement;o instanceof HTMLElement&&(this.ensureContainerPositioning(o),o.appendChild(i)),this.canvas=i,this.ctx=a,this.resize(),this.calculateLaneMetrics(),this.setupVideoEventListeners(t),this.setupResizeHandling(t),this.setupFullscreenHandling(),this.setupVideoChangeDetection(t,r),this.startAnimation(),this.setupVisibilityHandling()}catch(e){throw this.log.error(`CommentRenderer.initialize`,e),e}},Ci=function(){this.stopAnimation(),this.cleanupResizeHandling(),this.runCleanupTasks(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.videoElement=null,this.containerElement=null,this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.resetFinalPhaseState(),this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.commentSequence=0,this.playbackHasBegun=!1,this.skipDrawingForCurrentFrame=!1,this.isStalled=!1,this.pendingInitialSync=!1},wi=function(){this.stopAnimation(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.fullscreenActive=!1},Ti=e=>{e.prototype.resolveContainer=bi,e.prototype.ensureContainerPositioning=xi,e.prototype.initialize=Si,e.prototype.destroy=Ci,e.prototype.destroyCanvasOnly=wi},Ei=function(e){try{let t=()=>{this.isPlaying=!0,this.playbackHasBegun=!0;let e=this.timeSource.now();this.lastDrawTime=e,this.lastPlayResumeTime=e,this.comments.forEach(t=>{t.lastUpdateTime=e,t.isPaused=!1})},n=()=>{this.isPlaying=!1;let e=this.timeSource.now();this.comments.forEach(t=>{t.lastUpdateTime=e,t.isPaused=!0})},r=()=>{this.onSeek()},i=()=>{this.onSeek()},a=()=>{this.playbackRate=e.playbackRate;let t=this.timeSource.now();this.comments.forEach(e=>{e.lastUpdateTime=t})},o=()=>{this.handleVideoMetadataLoaded(e)},s=()=>{this.duration=Number.isFinite(e.duration)?T(e.duration):0},c=()=>{this.handleVideoSourceChange()},l=()=>{this.handleVideoStalled()},u=()=>{this.handleVideoCanPlay()},d=()=>{this.handleVideoCanPlay()};e.addEventListener(`play`,t),e.addEventListener(`pause`,n),e.addEventListener(`seeking`,r),e.addEventListener(`seeked`,i),e.addEventListener(`ratechange`,a),e.addEventListener(`loadedmetadata`,o),e.addEventListener(`durationchange`,s),e.addEventListener(`emptied`,c),e.addEventListener(`waiting`,l),e.addEventListener(`canplay`,u),e.addEventListener(`playing`,d),this.addCleanup(()=>e.removeEventListener(`play`,t)),this.addCleanup(()=>e.removeEventListener(`pause`,n)),this.addCleanup(()=>e.removeEventListener(`seeking`,r)),this.addCleanup(()=>e.removeEventListener(`seeked`,i)),this.addCleanup(()=>e.removeEventListener(`ratechange`,a)),this.addCleanup(()=>e.removeEventListener(`loadedmetadata`,o)),this.addCleanup(()=>e.removeEventListener(`durationchange`,s)),this.addCleanup(()=>e.removeEventListener(`emptied`,c)),this.addCleanup(()=>e.removeEventListener(`waiting`,l)),this.addCleanup(()=>e.removeEventListener(`canplay`,u)),this.addCleanup(()=>e.removeEventListener(`playing`,d))}catch(e){throw this.log.error(`CommentRenderer.setupVideoEventListeners`,e),e}},Di=function(e){this.lastVideoSource=this.getCurrentVideoSource(),this.incrementEpoch(`metadata-loaded`),this.handleVideoSourceChange(e),this.resize(),this.calculateLaneMetrics(),this.onSeek(),this.emitStateSnapshot(`metadata-loaded`)},Oi=function(){let e=this.canvas,t=this.ctx;if(!e||!t)return;this.isStalled=!0;let n=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:e.width/n,i=this.displayHeight>0?this.displayHeight:e.height/n;t.clearRect(0,0,r,i),this.comments.forEach(e=>{e.isActive&&(e.lastUpdateTime=this.timeSource.now())})},ki=function(){this.isStalled&&(this.isStalled=!1,this.videoElement&&(this.currentTime=T(this.videoElement.currentTime),this.isPlaying=!this.videoElement.paused),this.lastDrawTime=this.timeSource.now())},Ai=function(e){let t=e??this.videoElement;if(!t){this.lastVideoSource=null,this.isPlaying=!1,this.resetFinalPhaseState(),this.resetCommentActivity();return}let n=this.getCurrentVideoSource();n!==this.lastVideoSource&&(this.lastVideoSource=n,this.incrementEpoch(`source-change`),this.syncVideoState(t),this.resetFinalPhaseState(),this.resetCommentActivity(),this.emitStateSnapshot(`source-change`))},ji=function(e){this.duration=Number.isFinite(e.duration)?T(e.duration):0,this.currentTime=T(e.currentTime),this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.isStalled=!1,this.playbackHasBegun=this.isPlaying||this.currentTime>k,this.lastDrawTime=this.timeSource.now()},Mi=function(){let e=this.timeSource.now(),t=this.canvas,n=this.ctx;if(this.resetFinalPhaseState(),this.skipDrawingForCurrentFrame=!1,this.isStalled=!1,this.pendingInitialSync=!1,this.playbackHasBegun=this.isPlaying||this.currentTime>k,t&&n){let e=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/e,i=this.displayHeight>0?this.displayHeight:t.height/e;n.clearRect(0,0,r,i)}this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.comments.forEach(t=>{t.isActive=!1,t.isPaused=!this.isPlaying,t.hasShown=!1,t.lane=-1,t.x=t.virtualStartX,t.speed=t.baseSpeed,t.lastUpdateTime=e,t.clearActivation()}),this.activeComments.clear()},Ni=function(e,t){if(typeof MutationObserver>`u`){this.log.debug(`MutationObserver is not available in this environment. Video change detection is disabled.`);return}let n=new MutationObserver(t=>{for(let n of t){if(n.type===`attributes`&&n.attributeName===`src`){let t=n.target,r=null,i=null;if((t instanceof HTMLVideoElement||t instanceof HTMLSourceElement)&&(r=typeof n.oldValue==`string`?n.oldValue:null,i=t.getAttribute(`src`)),r===i)continue;this.handleVideoSourceChange(e);return}if(n.type===`childList`){for(let t of n.addedNodes)if(t instanceof HTMLSourceElement){this.handleVideoSourceChange(e);return}for(let t of n.removedNodes)if(t instanceof HTMLSourceElement){this.handleVideoSourceChange(e);return}}}});n.observe(e,{attributes:!0,attributeFilter:[`src`],attributeOldValue:!0,childList:!0,subtree:!0}),this.addCleanup(()=>n.disconnect());let r=new MutationObserver(e=>{for(let t of e)if(t.type===`childList`){for(let e of t.addedNodes){let t=this.extractVideoElement(e);if(t&&t!==this.videoElement){this.initialize(t);return}}for(let e of t.removedNodes){if(e===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}if(e instanceof Element){let t=e.querySelector(`video`);if(t&&t===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}}}}});r.observe(t,{childList:!0,subtree:!0}),this.addCleanup(()=>r.disconnect())},Pi=function(e){if(e instanceof HTMLVideoElement)return e;if(e instanceof Element){let t=e.querySelector(`video`);if(t instanceof HTMLVideoElement)return t}return null},Fi=e=>{e.prototype.setupVideoEventListeners=Ei,e.prototype.handleVideoMetadataLoaded=Di,e.prototype.handleVideoStalled=Oi,e.prototype.handleVideoCanPlay=ki,e.prototype.handleVideoSourceChange=Ai,e.prototype.syncVideoState=ji,e.prototype.resetCommentActivity=Mi,e.prototype.setupVideoChangeDetection=Ni,e.prototype.extractVideoElement=Pi},Ii=function(){if(typeof document>`u`||typeof document.addEventListener!=`function`||typeof document.removeEventListener!=`function`)return;let e=()=>{if(document.visibilityState!==`visible`){this.stopAnimation();return}this._settings.isCommentVisible&&(this.handleVisibilityRestore(),this.startAnimation())};document.addEventListener(`visibilitychange`,e),this.addCleanup(()=>document.removeEventListener(`visibilitychange`,e)),document.visibilityState!==`visible`&&this.stopAnimation()},Li=function(){let e=this.canvas,t=this.ctx,n=this.videoElement;!e||!t||!n||(this.currentTime=T(n.currentTime),this.lastDrawTime=this.timeSource.now(),this.isPlaying=!n.paused,this.isStalled=!1,this.pendingInitialSync=!0,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),this.draw())},Ri=function(e){let t=this._settings.isCommentVisible;if(this._settings.isCommentVisible=e,t===e)return;this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion;let n=this.canvas,r=this.ctx;if(!(!n||!r))if(e)this.lastDrawTime=this.timeSource.now(),this.pendingInitialSync=!0,this.scheduleNextFrame();else{let e=this.canvasDpr>0?this.canvasDpr:1,t=this.displayWidth>0?this.displayWidth:n.width/e,i=this.displayHeight>0?this.displayHeight:n.height/e;r.clearRect(0,0,t,i)}},zi=e=>{e.prototype.setupVisibilityHandling=Ii,e.prototype.handleVisibilityRestore=Li,e.prototype.setCommentVisibility=Ri},Bi=2.1,Vi=function(e,t){let n=this.videoElement,r=this.canvas,i=this.ctx;if(!n||!r)return;let a=(this.fullscreenActive&&r.parentElement instanceof HTMLElement?r.parentElement.getBoundingClientRect():null)??n.getBoundingClientRect(),o=this.canvasDpr>0?this.canvasDpr:1,s=this.displayWidth>0?this.displayWidth:r.width/o,c=this.displayHeight>0?this.displayHeight:r.height/o,l=e??a.width??s,u=t??a.height??c;if(!Number.isFinite(l)||!Number.isFinite(u)||l<=0||u<=0)return;let d=Math.max(1,Math.floor(l)),f=Math.max(1,Math.floor(u)),p=this._settings.useDprScaling?this.resolveDevicePixelRatio():1,m=Math.max(1,Math.round(d*p)),h=Math.max(1,Math.round(f*p));(this.displayWidth!==d||this.displayHeight!==f||Math.abs(this.canvasDpr-p)>2**-52||r.width!==m||r.height!==h)&&(this.displayWidth=d,this.displayHeight=f,this.canvasDpr=p,r.width=m,r.height=h,r.style.width=`${d}px`,r.style.height=`${f}px`,i&&(i.setTransform(1,0,0,1,0,0),this._settings.useDprScaling&&i.scale(p,p)),this.calculateLaneMetrics(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.performInitialSync(T(n.currentTime)),this.draw())},Hi=function(){if(typeof window>`u`)return 1;let e=Number(window.devicePixelRatio);return!Number.isFinite(e)||e<=0?1:e},Ui=function(){let e=this.canvas;if(!e)return;let t=this.displayHeight>0?this.displayHeight:e.height/Math.max(this.canvasDpr,1),n=Math.max(Se,Math.floor(27/665*t));this.laneHeight=n*Bi;let r=Math.max(this.laneHeight,1),i=Math.floor(Math.max(0,t-r)/r);if(this._settings.useFixedLaneCount){let e=Number.isFinite(this._settings.fixedLaneCount)?Math.floor(this._settings.fixedLaneCount):xe,t=Math.max(be,Math.min(i,e));this.laneCount=t}else this.laneCount=Math.max(be,i);this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0},Wi=function(e){this.cleanupResizeHandling();let t=!1,n=()=>{if(t)return;t=!0;let e=()=>{t=!1,this.resize()};if(typeof requestAnimationFrame==`function`){requestAnimationFrame(e);return}e()};if(this._settings.useContainerResizeObserver&&this.isResizeObserverAvailable){let t=this.resolveResizeObserverTarget(e),n=new ResizeObserver(e=>{for(let t of e){let{width:e,height:n}=t.contentRect;e>0&&n>0?this.resize(e,n):this.resize()}});n.observe(t),this.resizeObserver=n,this.resizeObserverTarget=t}else this.log.debug(`Resize handling is disabled because neither ResizeObserver nor window APIs are available.`);typeof window<`u`&&typeof window.addEventListener==`function`&&(window.addEventListener(`resize`,n),this.addCleanup(()=>window.removeEventListener(`resize`,n)));let r=typeof window<`u`?window.visualViewport:void 0;r&&typeof r.addEventListener==`function`&&(r.addEventListener(`resize`,n),r.addEventListener(`scroll`,n),this.addCleanup(()=>{r.removeEventListener(`resize`,n),r.removeEventListener(`scroll`,n)}))},Gi=function(){this.resizeObserver&&this.resizeObserverTarget&&this.resizeObserver.unobserve(this.resizeObserverTarget),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.resizeObserverTarget=null},Ki=e=>{e.prototype.resize=Vi,e.prototype.resolveDevicePixelRatio=Hi,e.prototype.calculateLaneMetrics=Ui,e.prototype.setupResizeHandling=Wi,e.prototype.cleanupResizeHandling=Gi},qi=function(){if(typeof document>`u`||typeof document.addEventListener!=`function`||typeof document.removeEventListener!=`function`)return;let e=()=>{this.handleFullscreenChange()};[`fullscreenchange`,`webkitfullscreenchange`,`mozfullscreenchange`,`MSFullscreenChange`].forEach(t=>{document.addEventListener(t,e),this.addCleanup(()=>document.removeEventListener(t,e))}),this.handleFullscreenChange()},Ji=e=>{let t=()=>{let t=e.getFullscreenElement();if(t instanceof HTMLElement){let n=t.getBoundingClientRect();e.resize(n.width,n.height);return}e.resize()};typeof requestAnimationFrame==`function`&&requestAnimationFrame(t),typeof setTimeout==`function`&&setTimeout(t,80)},Yi=function(e){return this.resolveFullscreenContainer(e)||(e.parentElement??e)},Xi=async function(){let e=this.canvas,t=this.videoElement;if(!e||!t)return;let n=this.containerElement??t.parentElement??null,r=this.getFullscreenElement(),i=this.resolveActiveOverlayContainer(t,n,r);if(!(i instanceof HTMLElement))return;e.parentElement===i?this.ensureContainerPositioning(i):(this.ensureContainerPositioning(i),i.appendChild(e));let a=r instanceof HTMLElement&&r.contains(t)?r:null,o=a!==null;if(this.fullscreenActive!==o&&(this.fullscreenActive=o,this.setupResizeHandling(t)),e.style.position=`absolute`,e.style.top=`0`,e.style.left=`0`,e.style.right=`0`,e.style.bottom=`0`,e.style.display=`block`,e.style.pointerEvents=`none`,e.style.zIndex=`2147483647`,a){let e=a.getBoundingClientRect();this.resize(e.width,e.height),Ji(this);return}this.resize(),Ji(this)},Zi=function(e){let t=this.getFullscreenElement();return t instanceof HTMLElement&&(t===e||t.contains(e))?t:null},Qi=function(e,t,n){return n instanceof HTMLElement&&n.contains(e)?n instanceof HTMLVideoElement&&t instanceof HTMLElement?t:n:t??null},$i=function(){if(typeof document>`u`)return null;let e=document;return document.fullscreenElement??e.webkitFullscreenElement??e.mozFullScreenElement??e.msFullscreenElement??null},ea=e=>{e.prototype.setupFullscreenHandling=qi,e.prototype.resolveResizeObserverTarget=Yi,e.prototype.handleFullscreenChange=Xi,e.prototype.resolveFullscreenContainer=Zi,e.prototype.resolveActiveOverlayContainer=Qi,e.prototype.getFullscreenElement=$i},ta=function(e){this.cleanupTasks.push(e)},na=function(){for(;this.cleanupTasks.length>0;){let e=this.cleanupTasks.pop();try{e?.()}catch(e){this.log.error(`CommentRenderer.cleanupTask`,e)}}},ra=e=>{e.prototype.addCleanup=ta,e.prototype.runCleanupTasks=na},L=class{_settings;comments=[];activeComments=new Set;reservedLanes=new Map;topStaticLaneReservations=[];bottomStaticLaneReservations=[];log;timeSource;animationFrameProvider;createCanvasElement;commentDependencies;settingsVersion=0;normalizedNgWords=[];compiledNgRegexps=[];canvas=null;ctx=null;videoElement=null;containerElement=null;fullscreenActive=!1;laneCount=xe;laneHeight=0;displayWidth=0;displayHeight=0;canvasDpr=1;currentTime=0;duration=0;playbackRate=1;isPlaying=!0;isStalled=!1;lastDrawTime=0;finalPhaseActive=!1;finalPhaseStartTime=null;finalPhaseScheduleDirty=!1;playbackHasBegun=!1;skipDrawingForCurrentFrame=!1;pendingInitialSync=!1;finalPhaseVposOverrides=new Map;frameId=null;videoFrameHandle=null;resizeObserver=null;resizeObserverTarget=null;isResizeObserverAvailable=typeof ResizeObserver<`u`;cleanupTasks=[];commentSequence=0;epochId=0;eventHooks;lastSnapshotEmitTime=0;snapshotEmitThrottleMs=1e3;lastPlayResumeTime=0;playResumeSeekIgnoreDurationMs=500;lastVideoSource=null;rebuildNgMatchers(){cr.call(this)}constructor(e=null,t=void 0){let n,r;if(er(e))n=Zn({...e}),r=t??{};else{let i=e??t??{};r=typeof i==`object`?i:{},n=Zn(Yn())}this._settings=Zn(n),this.timeSource=r.timeSource??ie(),this.animationFrameProvider=r.animationFrameProvider??Qn(this.timeSource),this.createCanvasElement=r.createCanvasElement??$n(),this.commentDependencies={timeSource:this.timeSource,settingsVersion:this.settingsVersion},this.log=Ee(r.loggerNamespace??`CommentRenderer`),this.eventHooks=r.eventHooks??{},this.handleAnimationFrame=this.handleAnimationFrame.bind(this),this.handleVideoFrame=this.handleVideoFrame.bind(this),this.rebuildNgMatchers(),r.debug&&kt(r.debug)}get settings(){return this._settings}set settings(e){this._settings=Zn(e),this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion,this.rebuildNgMatchers()}getVideoElement(){return this.videoElement}getCurrentVideoSource(){let e=this.videoElement;if(!e)return null;if(typeof e.currentSrc==`string`&&e.currentSrc.length>0)return e.currentSrc;let t=e.getAttribute(`src`);if(t&&t.length>0)return t;let n=e.querySelector(`source[src]`);return n&&typeof n.src==`string`?n.src:null}getCommentsSnapshot(){return[...this.comments]}};ur(L),yr(L),Sr(L),Er(L),Ar(L),Br(L),Jr(L),ai(L),ci(L),yi(L),Ti(L),Fi(L),zi(L),Ki(L),ea(L),ra(L);var R=()=>({...Yn(),shadowIntensity:`strong`,autoSearchEnabled:!0}),ia=`v7.6.0`,aa=typeof GM_addStyle<`u`?GM_addStyle:void 0,z=typeof GM_getValue<`u`?GM_getValue:void 0,B=typeof GM_setValue<`u`?GM_setValue:void 0,oa=typeof GM_xmlhttpRequest<`u`?GM_xmlhttpRequest:void 0,sa=[`ja`,`en`,`zh-Hans`,`hi`,`es`,`fr`,`ar`,`pt`,`bn`,`ru`,`ur`],ca=new Set([`ar`,`ur`]);function la(e){return ca.has(e)?`rtl`:`ltr`}function ua(e,t,n){let r=e[n],i={},a=e;for(let e of t)i[e]={...r,...a[e]??{}};return i}function da(e,t){return ua(e,sa,t)}function fa(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(e,n)=>{let r=t[n];return r===void 0?e:String(r)})}function pa(e){let t=Object.keys(e.translations),n=e.defaultLocale,r=n=>{let r=n.toLowerCase(),i=e.aliases?.[r];if(i)return i;let a=t.find(e=>e.toLowerCase()===r);if(a)return a;let o=r.split(`-`)[0];return t.find(e=>e.toLowerCase().split(`-`)[0]===o)??null},i=()=>{let t=navigator.languages.length>0?navigator.languages:[navigator.language];for(let e of t){let t=r(e);if(t)return t}return e.fallbackLocale},a=t=>e.translations[n]?.[t]||e.translations[e.fallbackLocale]?.[t]||(e.translations[e.defaultLocale]?.[t]??t);return{locales:t,getLocale:()=>n,setLocale:e=>{n=e},detectBrowserLocale:i,t:a,format:(e,t)=>fa(a(e),t),getTranslations:(t=n)=>e.translations[t]??e.translations[e.fallbackLocale],getDirection:(e=n)=>la(e),getMissingTranslationKeys:t=>{let n=e.translations[e.fallbackLocale],r=e.translations[t];return Object.keys(n).filter(e=>!r[e])}}}var ma=pa({translations:da({ja:{color:`カラー`,commentColor:`コメントカラー`,commentOpacity:`不透明度`,commentSettings:`コメント設定`,commentSettingsPanel:`コメント設定パネル`,commentVisibility:`コメント表示`,commentVisibilityToggle:`コメント表示切替`,currentVideoUnset:`オーバーレイする動画が未設定です`,error:`エラー`,animeTitle:`アニメタイトル`,autoFillSearchForm:`検索フォームにタイトル・話数・エピソードタイトルを入力`,autoSearch:`自動検索`,autoSearchDescription:`視聴ページ表示時に自動でコメントを設定`,autoSearchDisabledManual:`自動検索を無効にしました（手動設定モード）`,autoSearchEnabled:`自動検索を有効にしました`,autoSearchInfo:`自動検索についての説明`,fixedPlaybackRate:`速度固定`,formInput:`フォーム入力`,freeInput:`自由入力`,idLoadFailed:`ID情報の読込に失敗しました`,idSaveFailed:`ID情報の保存に失敗しました`,info:`情報`,manualSearchLoadFailed:`検索設定の読込に失敗しました`,manualSearchSaveFailed:`検索設定の保存に失敗しました`,manualSearchPlaceholder:`検索キーワードを入力`,ngRegex:`NG正規表現`,ngRegexPlaceholder:`NG正規表現を1行ずつ入力`,ngTab:`NG`,ngWords:`NGワード`,ngWordsPlaceholder:`NGワードを1行ずつ入力`,noMessage:`メッセージはありません`,playbackRate:`再生速度`,playbackRateFixedToggle:`再生速度固定ON/OFF`,postedAt:`投稿日`,commentsSet:`「{title}」のコメントを設定しました`,autoSetupComplete:`ニコニコ動画を自動設定しました`,autoSetupError:`自動設定エラー: {message}`,commentsHiddenSkip:`コメント非表示設定のためスキップしました`,commentsLoadComplete:`コメントの読み込みが完了しました（{count}件）`,commentsLoadErrorSelectAnother:`コメント読み込みエラー: {message}
フローティングボタンから別の動画を選択してください。`,commentsUnavailable:`コメントを取得できませんでした`,commentSourceUpdated:`コメントソースを更新しました: {title}（{count}件）`,commentFetchError:`コメント取得エラー: {message}`,domUpdateWaitFailed:`DOM更新の待機に失敗しました: {message}`,episodeChangeDetected:`エピソード切り替えを検知しました...`,episodeNumberMissing:`エピソード話数を取得できませんでした`,episodeSwitchError:`エピソード切り替えエラー: {message}`,initializationError:`初期化エラー: {message}`,initializingCommentLoader:`コメントローダーを初期化中...`,manualModeSelectAnimeTitle:`手動設定モードです。フローティングボタンから検索タブを開いてアニメタイトルを設定してください。`,manualModeSelectVideo:`手動設定モードです。フローティングボタンから検索タブを開いて動画を選択してください。`,manualModeCommentsLoadComplete:`【手動設定モード】コメントの読み込みが完了しました（{count}件）
動画: {title}`,metadataAutoFetchFailed:`視聴ページからの自動取得に失敗しました。メタデータが取得できませんでした。`,niconicoNotFound:`ニコニコ動画が見つかりませんでした`,niconicoNotFoundManual:`ニコニコ動画が見つかりませんでした。手動で検索してください。`,nextEpisodeAutoSetupComplete:`次のエピソードを自動設定しました`,nextVideoCommentsUnavailableClear:`次の動画のコメントを取得できませんでした。コメント表示をクリアします。`,noAnimeTitle:`アニメタイトルが取得できませんでした。検索精度が低下する可能性があります。`,officialVideoMissingUseFirst:`公式動画が見つかりませんでした。検索結果の最初の動画を使用します。`,officialVideoMissingManual:`公式動画が見つかりませんでした。手動で検索してください。`,officialVideoSafeguardInfo:`公式動画セーフガードについて`,unknownTitle:`不明なタイトル`,structuredInput:`詳細入力`,thumbnail:`サムネイル`,videoDataMissing:`動画データが見つかりません。`,videoId:`動画ID`,videoOwner:`投稿者`,videoSwitchDetected:`動画の切り替わりを検知しました...`,videoSwitchError:`動画切り替えエラー: {message}`,episodeNumber:`話数`,episodeTitleOptional:`エピソードタイトル（任意）`,commentCount:`コメント`,commentCountLong:`コメント数`,mylistCount:`マイリスト`,mylistCountLong:`マイリスト数`,officialVideoMissing:`公式動画が見つかりませんでした。全ての検索結果を表示しています。`,searchingKeyword:`「{keyword}」を検索中...`,searchKeywordRequired:`検索キーワードを入力してください`,searchNoResults:`検索結果が見つかりませんでした`,searchFormFilled:`「{keyword}」を検索フォームに入力しました`,similarity:`類似度: {score}%`,viewCount:`再生`,viewCountLong:`再生数`,search:`検索`,searchAnimePlaceholder:`例: 葬送のフリーレン`,searchEpisodeNumberPlaceholder:`例: 第1話`,searchEpisodeTitlePlaceholder:`例: 冒険の終わり`,searchFreeword:`フリーワード検索`,searchInputModeToggle:`入力モードを切り替え（詳細入力 / 自由入力）`,searchPage:`検索ページ`,searchTab:`検索`,searchVideoHeading:`コメントをオーバーレイする動画を検索`,saveSettings:`設定を保存`,settings:`設定`,settingsClose:`設定を閉じる`,settingsFabLabel:`ニコニココメント設定を開く`,playbackLoadFailed:`再生設定の読み込みに失敗しました`,playbackSaveFailed:`再生設定の保存に失敗しました`,settingsLoadFailed:`設定の読み込みに失敗しました`,settingsSaved:`設定を保存しました`,settingsSaveFailed:`設定の保存に失敗しました`,success:`成功`,videoDataLoadFailed:`動画データの読み込みに失敗しました`,videoDataSaveFailed:`動画データの保存に失敗しました`,warning:`警告`},en:{color:`Color`,commentColor:`Comment color`,commentOpacity:`Opacity`,commentSettings:`Comment settings`,commentSettingsPanel:`Comment settings panel`,commentVisibility:`Show comments`,commentVisibilityToggle:`Toggle comment visibility`,currentVideoUnset:`No overlay video is set`,error:`Error`,animeTitle:`Anime title`,autoFillSearchForm:`Fill the search form with title, episode number, and episode title`,autoSearch:`Auto search`,autoSearchDescription:`Set comments automatically when the watch page opens`,autoSearchDisabledManual:`Auto search disabled (manual setup mode)`,autoSearchEnabled:`Auto search enabled`,autoSearchInfo:`About auto search`,fixedPlaybackRate:`Lock speed`,formInput:`Fill form`,freeInput:`Free input`,idLoadFailed:`Failed to load ID information`,idSaveFailed:`Failed to save ID information`,info:`Info`,manualSearchLoadFailed:`Failed to load search settings`,manualSearchSaveFailed:`Failed to save search settings`,manualSearchPlaceholder:`Enter a search keyword`,ngRegex:`NG regular expressions`,ngRegexPlaceholder:`Enter one NG regular expression per line`,ngTab:`NG`,ngWords:`NG words`,ngWordsPlaceholder:`Enter one NG word per line`,noMessage:`No message`,playbackRate:`Playback speed`,playbackRateFixedToggle:`Playback speed lock on/off`,postedAt:`Posted at`,commentsSet:`Set comments from "{title}"`,autoSetupComplete:`Niconico video was set automatically`,autoSetupError:`Auto setup error: {message}`,commentsHiddenSkip:`Skipped because comments are hidden in settings`,commentsLoadComplete:`Finished loading comments ({count})`,commentsLoadErrorSelectAnother:`Comment loading error: {message}
Select another video from the floating button.`,commentsUnavailable:`Could not fetch comments`,commentSourceUpdated:`Updated comment source: {title} ({count})`,commentFetchError:`Comment fetch error: {message}`,domUpdateWaitFailed:`Failed to wait for DOM update: {message}`,episodeChangeDetected:`Detected episode change...`,episodeNumberMissing:`Could not get the episode number`,episodeSwitchError:`Episode switch error: {message}`,initializationError:`Initialization error: {message}`,initializingCommentLoader:`Initializing comment loader...`,manualModeSelectAnimeTitle:`Manual mode is enabled. Open the Search tab from the floating button and set an anime title.`,manualModeSelectVideo:`Manual mode is enabled. Open the Search tab from the floating button and select a video.`,manualModeCommentsLoadComplete:`[Manual mode] Finished loading comments ({count})
Video: {title}`,metadataAutoFetchFailed:`Automatic fetch from the watch page failed. Metadata could not be acquired.`,niconicoNotFound:`No Niconico video was found`,niconicoNotFoundManual:`No Niconico video was found. Search manually.`,nextEpisodeAutoSetupComplete:`Set up the next episode automatically`,nextVideoCommentsUnavailableClear:`Could not fetch comments for the next video. Clearing comment display.`,noAnimeTitle:`Could not get the anime title. Search accuracy may be reduced.`,officialVideoMissingUseFirst:`No official video was found. Using the first search result.`,officialVideoMissingManual:`No official video was found. Search manually.`,officialVideoSafeguardInfo:`About the official video safeguard`,unknownTitle:`Unknown title`,structuredInput:`Detailed input`,thumbnail:`Thumbnail`,videoDataMissing:`Video data was not found.`,videoId:`Video ID`,videoOwner:`Uploader`,videoSwitchDetected:`Detected video switch...`,videoSwitchError:`Video switch error: {message}`,episodeNumber:`Episode number`,episodeTitleOptional:`Episode title (optional)`,commentCount:`Comments`,commentCountLong:`Comment count`,mylistCount:`Mylist`,mylistCountLong:`Mylist count`,officialVideoMissing:`No official video was found. Showing all search results.`,searchingKeyword:`Searching for "{keyword}"...`,searchKeywordRequired:`Enter a search keyword`,searchNoResults:`No search results were found`,searchFormFilled:`Filled the search form with "{keyword}"`,similarity:`Similarity: {score}%`,viewCount:`Views`,viewCountLong:`View count`,search:`Search`,searchAnimePlaceholder:`Example: Frieren: Beyond Journey's End`,searchEpisodeNumberPlaceholder:`Example: Episode 1`,searchEpisodeTitlePlaceholder:`Example: The Journey's End`,searchFreeword:`Free-word search`,searchInputModeToggle:`Switch input mode (detailed / free input)`,searchPage:`Search page`,searchTab:`Search`,searchVideoHeading:`Search for the video to overlay comments from`,saveSettings:`Save settings`,settings:`Settings`,settingsClose:`Close settings`,settingsFabLabel:`Open Niconico comment settings`,playbackLoadFailed:`Failed to load playback settings`,playbackSaveFailed:`Failed to save playback settings`,settingsLoadFailed:`Failed to load settings`,settingsSaved:`Settings saved`,settingsSaveFailed:`Failed to save settings`,success:`Success`,videoDataLoadFailed:`Failed to load video data`,videoDataSaveFailed:`Failed to save video data`,warning:`Warning`},"zh-Hans":{color:`颜色`,commentColor:`评论颜色`,commentOpacity:`不透明度`,commentSettings:`评论设置`,commentSettingsPanel:`评论设置面板`,commentVisibility:`显示评论`,commentVisibilityToggle:`切换评论可见性`,currentVideoUnset:`未设置叠加视频`,error:`错误`,animeTitle:`动漫标题`,autoFillSearchForm:`在搜索表单中填写标题、剧集编号和剧集标题`,autoSearch:`自动搜索`,autoSearchDescription:`观看页面打开时自动设置评论`,autoSearchDisabledManual:`自动搜索禁用（手动设置模式）`,autoSearchEnabled:`自动搜索已启用`,autoSearchInfo:`关于自动搜索`,fixedPlaybackRate:`锁定速度`,formInput:`填写表格`,freeInput:`自由输入`,idLoadFailed:`加载ID信息失败`,idSaveFailed:`保存ID信息失败`,info:`信息`,manualSearchLoadFailed:`无法加载搜索设置`,manualSearchSaveFailed:`无法保存搜索设置`,manualSearchPlaceholder:`输入搜索关键字`,ngRegex:`NG正则表达式`,ngRegexPlaceholder:`每行输入一个 NG 正则表达式`,ngTab:`不合格`,ngWords:`NG词`,ngWordsPlaceholder:`每行输入一个 NG 字`,noMessage:`没有消息`,playbackRate:`播放速度`,playbackRateFixedToggle:`播放速度锁定开/关`,postedAt:`发表于`,commentsSet:`设置来自“{title}”的评论`,autoSetupComplete:`Niconico 视频已自动设置`,autoSetupError:`自动设置错误：{message}`,commentsHiddenSkip:`已跳过，因为评论隐藏在设置中`,commentsLoadComplete:`评论加载完毕({count})`,commentsLoadErrorSelectAnother:`评论加载错误：{message}\\n从浮动按钮中选择另一个视频。`,commentsUnavailable:`无法获取评论`,commentSourceUpdated:`更新评论来源：{title}（{count}）`,commentFetchError:`评论获取错误：{message}`,domUpdateWaitFailed:`无法等待 DOM 更新：{message}`,episodeChangeDetected:`检测到情节变化...`,episodeNumberMissing:`无法获取剧集编号`,episodeSwitchError:`剧集切换错误：{message}`,initializationError:`初始化错误：{message}`,initializingCommentLoader:`正在初始化评论加载器...`,manualModeSelectAnimeTitle:`手动模式已启用。从浮动按钮打开“搜索”选项卡并设置动漫标题。`,manualModeSelectVideo:`手动模式已启用。从浮动按钮打开“搜索”选项卡并选择一个视频。`,manualModeCommentsLoadComplete:`[手动模式]评论加载完毕({count})\\n视频：{title}`,metadataAutoFetchFailed:`从观看页面自动获取失败。无法获取元数据。`,niconicoNotFound:`未找到 Niconico 视频`,niconicoNotFoundManual:`未找到 Niconico 视频。手动搜索。`,nextEpisodeAutoSetupComplete:`自动设置下一集`,nextVideoCommentsUnavailableClear:`无法获取下一个视频的评论。清除评论显示。`,noAnimeTitle:`无法获取动画标题。搜索准确度可能会降低。`,officialVideoMissingUseFirst:`没有找到官方视频。使用第一个搜索结果。`,officialVideoMissingManual:`没有找到官方视频。手动搜索。`,officialVideoSafeguardInfo:`关于官方视频保障`,unknownTitle:`未知标题`,structuredInput:`详细输入`,thumbnail:`缩略图`,videoDataMissing:`未找到视频数据。`,videoId:`视频ID`,videoOwner:`上传者`,videoSwitchDetected:`检测到视频切换...`,videoSwitchError:`视频切换错误：{message}`,episodeNumber:`集数`,episodeTitleOptional:`剧集标题（可选）`,commentCount:`评论`,commentCountLong:`评论数`,mylistCount:`我的列表`,mylistCountLong:`我的列表计数`,officialVideoMissing:`没有找到官方视频。显示所有搜索结果。`,searchingKeyword:`正在搜索“{keyword}”...`,searchKeywordRequired:`输入搜索关键字`,searchNoResults:`没有找到搜索结果`,searchFormFilled:`在搜索表单中填写“{keyword}”`,similarity:`相似度：{score}%`,viewCount:`意见`,viewCountLong:`观看次数`,search:`搜索`,searchAnimePlaceholder:`示例：Frieren：超越旅程的终点`,searchEpisodeNumberPlaceholder:`示例：第 1 集`,searchEpisodeTitlePlaceholder:`示例：旅程的终点`,searchFreeword:`自由词搜索`,searchInputModeToggle:`切换输入模式（详细/自由输入）`,searchPage:`搜索页面`,searchTab:`搜索`,searchVideoHeading:`搜索要覆盖评论的视频`,saveSettings:`保存设置`,settings:`设置`,settingsClose:`关闭设置`,settingsFabLabel:`打开niconico评论设置`,playbackLoadFailed:`无法加载播放设置`,playbackSaveFailed:`无法保存播放设置`,settingsLoadFailed:`无法加载设置`,settingsSaved:`设置已保存`,settingsSaveFailed:`保存设置失败`,success:`成功`,videoDataLoadFailed:`视频数据加载失败`,videoDataSaveFailed:`保存视频数据失败`,warning:`警告`},hi:{color:`रंग`,commentColor:`टिप्पणी रंग`,commentOpacity:`अपारदर्शिता`,commentSettings:`टिप्पणी सेटिंग`,commentSettingsPanel:`टिप्पणी सेटिंग पैनल`,commentVisibility:`टिप्पणियाँ दिखाएँ`,commentVisibilityToggle:`टिप्पणी दृश्यता टॉगल करें`,currentVideoUnset:`कोई ओवरले वीडियो सेट नहीं है`,error:`त्रुटि`,animeTitle:`एनीमे शीर्षक`,autoFillSearchForm:`शीर्षक, एपिसोड संख्या और एपिसोड शीर्षक के साथ खोज फ़ॉर्म भरें`,autoSearch:`स्वतः खोज`,autoSearchDescription:`दृश्य पृष्ठ खुलने पर स्वचालित रूप से टिप्पणियाँ सेट करें`,autoSearchDisabledManual:`स्वतः खोज अक्षम (मैन्युअल सेटअप मोड)`,autoSearchEnabled:`स्वतः खोज सक्षम`,autoSearchInfo:`ऑटो खोज के बारे में`,fixedPlaybackRate:`लॉक स्पीड`,formInput:`फॉर्म भरें`,freeInput:`मुफ़्त इनपुट`,idLoadFailed:`आईडी जानकारी लोड करने में विफल`,idSaveFailed:`आईडी जानकारी सहेजने में विफल`,info:`जानकारी`,manualSearchLoadFailed:`खोज सेटिंग लोड करने में विफल`,manualSearchSaveFailed:`खोज सेटिंग सहेजने में विफल`,manualSearchPlaceholder:`एक खोज कीवर्ड दर्ज करें`,ngRegex:`एनजी नियमित अभिव्यक्ति`,ngRegexPlaceholder:`प्रति पंक्ति एक एनजी रेगुलर एक्सप्रेशन दर्ज करें`,ngTab:`एनजी`,ngWords:`एनजी शब्द`,ngWordsPlaceholder:`प्रति पंक्ति एक एनजी शब्द दर्ज करें`,noMessage:`कोई संदेश नहीं`,playbackRate:`प्लेबैक गति`,playbackRateFixedToggle:`प्लेबैक स्पीड लॉक चालू/बंद`,postedAt:`पर पोस्ट किया गया`,commentsSet:`"{title}" से टिप्पणियाँ सेट करें`,autoSetupComplete:`निकोनिको वीडियो स्वचालित रूप से सेट किया गया था`,autoSetupError:`स्वतः सेटअप त्रुटि: {message}`,commentsHiddenSkip:`छोड़ दिया गया क्योंकि टिप्पणियाँ सेटिंग्स में छिपी हुई हैं`,commentsLoadComplete:`टिप्पणियाँ लोड करना समाप्त ({count})`,commentsLoadErrorSelectAnother:`टिप्पणी लोड करने में त्रुटि: {message}\\nफ़्लोटिंग बटन से कोई अन्य वीडियो चुनें।`,commentsUnavailable:`टिप्पणियाँ प्राप्त नहीं की जा सकीं`,commentSourceUpdated:`अद्यतन टिप्पणी स्रोत: {title} ({count})`,commentFetchError:`टिप्पणी लाने में त्रुटि: {message}`,domUpdateWaitFailed:`DOM अपडेट के लिए प्रतीक्षा करने में विफल: {message}`,episodeChangeDetected:`एपिसोड में बदलाव का पता चला...`,episodeNumberMissing:`एपिसोड नंबर नहीं मिल सका`,episodeSwitchError:`एपिसोड स्विच त्रुटि: {message}`,initializationError:`आरंभीकरण त्रुटि: {message}`,initializingCommentLoader:`टिप्पणी लोडर प्रारंभ किया जा रहा है...`,manualModeSelectAnimeTitle:`मैनुअल मोड सक्षम है. फ़्लोटिंग बटन से खोज टैब खोलें और एनीमे शीर्षक सेट करें।`,manualModeSelectVideo:`मैनुअल मोड सक्षम है. फ़्लोटिंग बटन से खोज टैब खोलें और एक वीडियो चुनें।`,manualModeCommentsLoadComplete:`[मैन्युअल मोड] टिप्पणियाँ लोड करना समाप्त ({count})\\nवीडियो: {title}`,metadataAutoFetchFailed:`दृश्य पृष्ठ से स्वचालित फ़ेच विफल रहा. मेटाडेटा प्राप्त नहीं किया जा सका.`,niconicoNotFound:`कोई निकोनिको वीडियो नहीं मिला`,niconicoNotFoundManual:`कोई निकोनिको वीडियो नहीं मिला. मैन्युअल रूप से खोजें.`,nextEpisodeAutoSetupComplete:`अगला एपिसोड स्वचालित रूप से सेट करें`,nextVideoCommentsUnavailableClear:`अगले वीडियो के लिए टिप्पणियाँ नहीं मिल सकीं. टिप्पणी प्रदर्शन साफ़ करना.`,noAnimeTitle:`एनीमे शीर्षक नहीं मिल सका. खोज सटीकता कम हो सकती है.`,officialVideoMissingUseFirst:`कोई आधिकारिक वीडियो नहीं मिला. पहले खोज परिणाम का उपयोग करना.`,officialVideoMissingManual:`कोई आधिकारिक वीडियो नहीं मिला. मैन्युअल रूप से खोजें.`,officialVideoSafeguardInfo:`आधिकारिक वीडियो सुरक्षा के बारे में`,unknownTitle:`अज्ञात शीर्षक`,structuredInput:`विस्तृत इनपुट`,thumbnail:`थंबनेल`,videoDataMissing:`वीडियो डेटा नहीं मिला.`,videoId:`वीडियो आईडी`,videoOwner:`अपलोडर`,videoSwitchDetected:`वीडियो स्विच का पता चला...`,videoSwitchError:`वीडियो स्विच त्रुटि: {message}`,episodeNumber:`एपिसोड नंबर`,episodeTitleOptional:`एपिसोड का शीर्षक (वैकल्पिक)`,commentCount:`टिप्पणियाँ`,commentCountLong:`टिप्पणी गिनती`,mylistCount:`मेरी सूची`,mylistCountLong:`मेरी सूची गिनती`,officialVideoMissing:`कोई आधिकारिक वीडियो नहीं मिला. सभी खोज परिणाम दिखाए जा रहे हैं.`,searchingKeyword:`"{keyword}" खोज रहे हैं...`,searchKeywordRequired:`एक खोज कीवर्ड दर्ज करें`,searchNoResults:`कोई खोज परिणाम नहीं मिला`,searchFormFilled:`खोज फ़ॉर्म को "{keyword}" से भरें`,similarity:`समानता: {score}%`,viewCount:`दृश्य`,viewCountLong:`देखने की संख्या`,search:`खोजें`,searchAnimePlaceholder:`उदाहरण: फ्रिरेन: बियॉन्ड जर्नीज़ एंड`,searchEpisodeNumberPlaceholder:`उदाहरण: एपिसोड 1`,searchEpisodeTitlePlaceholder:`उदाहरण: यात्रा का अंत`,searchFreeword:`निःशुल्क शब्द खोज`,searchInputModeToggle:`इनपुट मोड स्विच करें (विस्तृत / निःशुल्क इनपुट)`,searchPage:`पेज खोजें`,searchTab:`खोजें`,searchVideoHeading:`टिप्पणियों को ओवरले करने के लिए वीडियो खोजें`,saveSettings:`सेटिंग्स सहेजें`,settings:`सेटिंग्स`,settingsClose:`सेटिंग्स बंद करें`,settingsFabLabel:`निकोनिको टिप्पणी सेटिंग खोलें`,playbackLoadFailed:`प्लेबैक सेटिंग लोड करने में विफल`,playbackSaveFailed:`प्लेबैक सेटिंग सहेजने में विफल`,settingsLoadFailed:`सेटिंग्स लोड करने में विफल`,settingsSaved:`सेटिंग्स सहेजी गईं`,settingsSaveFailed:`सेटिंग्स सहेजने में विफल`,success:`सफलता`,videoDataLoadFailed:`वीडियो डेटा लोड करने में विफल`,videoDataSaveFailed:`वीडियो डेटा सहेजने में विफल`,warning:`चेतावनी`},es:{color:`Color`,commentColor:`Color del comentario`,commentOpacity:`Opacidad`,commentSettings:`Configuración de comentarios`,commentSettingsPanel:`Panel de configuración de comentarios`,commentVisibility:`Mostrar comentarios`,commentVisibilityToggle:`Alternar visibilidad de comentarios`,currentVideoUnset:`No se ha establecido ningún vídeo superpuesto`,error:`error`,animeTitle:`Título del anime`,autoFillSearchForm:`Complete el formulario de búsqueda con título, número de episodio y título del episodio.`,autoSearch:`Búsqueda automática`,autoSearchDescription:`Establecer comentarios automáticamente cuando se abre la página de visualización`,autoSearchDisabledManual:`Búsqueda automática deshabilitada (modo de configuración manual)`,autoSearchEnabled:`Búsqueda automática habilitada`,autoSearchInfo:`Acerca de la búsqueda automática`,fixedPlaybackRate:`Velocidad de bloqueo`,formInput:`Rellenar formulario`,freeInput:`Entrada libre`,idLoadFailed:`No se pudo cargar la información de identificación`,idSaveFailed:`No se pudo guardar la información de identificación`,info:`Información`,manualSearchLoadFailed:`No se pudo cargar la configuración de búsqueda`,manualSearchSaveFailed:`No se pudo guardar la configuración de búsqueda`,manualSearchPlaceholder:`Introduzca una palabra clave de búsqueda`,ngRegex:`NG expresiones regulares`,ngRegexPlaceholder:`Ingrese una expresión regular NG por línea`,ngTab:`NG`,ngWords:`palabras NG`,ngWordsPlaceholder:`Ingrese una palabra NG por línea`,noMessage:`Ningún mensaje`,playbackRate:`Velocidad de reproducción`,playbackRateFixedToggle:`Activar/desactivar bloqueo de velocidad de reproducción`,postedAt:`Publicado en`,commentsSet:`Establecer comentarios de "{title}"`,autoSetupComplete:`El vídeo de Niconico se configuró automáticamente.`,autoSetupError:`Error de configuración automática: {message}`,commentsHiddenSkip:`Omitido porque los comentarios están ocultos en la configuración`,commentsLoadComplete:`Terminado de cargar comentarios ({count})`,commentsLoadErrorSelectAnother:`Error al cargar el comentario: {message}\\nSelecciona otro vídeo desde el botón flotante.`,commentsUnavailable:`No se pudieron recuperar los comentarios`,commentSourceUpdated:`Fuente de comentarios actualizada: {title} ({count})`,commentFetchError:`Error al recuperar el comentario: {message}`,domUpdateWaitFailed:`No se pudo esperar la actualización de DOM: {message}`,episodeChangeDetected:`Cambio de episodio detectado...`,episodeNumberMissing:`No se pudo obtener el número del episodio.`,episodeSwitchError:`Error de cambio de episodio: {message}`,initializationError:`Error de inicialización: {message}`,initializingCommentLoader:`Inicializando el cargador de comentarios...`,manualModeSelectAnimeTitle:`El modo manual está habilitado. Abra la pestaña Buscar desde el botón flotante y establezca un título de anime.`,manualModeSelectVideo:`El modo manual está habilitado. Abra la pestaña Buscar desde el botón flotante y seleccione un video.`,manualModeCommentsLoadComplete:`[Modo manual] Finalizado la carga de comentarios ({count}) Vídeo\\n: {title}`,metadataAutoFetchFailed:`Error en la búsqueda automática desde la página de visualización. No se pudieron adquirir los metadatos.`,niconicoNotFound:`No se encontró ningún vídeo de Niconico`,niconicoNotFoundManual:`No se encontró ningún vídeo de Niconico. Buscar manualmente.`,nextEpisodeAutoSetupComplete:`Configurar el siguiente episodio automáticamente`,nextVideoCommentsUnavailableClear:`No se pudieron obtener comentarios para el siguiente video. Borrar visualización de comentarios.`,noAnimeTitle:`No se pudo obtener el título del anime. La precisión de la búsqueda puede verse reducida.`,officialVideoMissingUseFirst:`No se encontró ningún vídeo oficial. Usando el primer resultado de búsqueda.`,officialVideoMissingManual:`No se encontró ningún vídeo oficial. Buscar manualmente.`,officialVideoSafeguardInfo:`Acerca de la salvaguardia oficial del vídeo`,unknownTitle:`Título desconocido`,structuredInput:`Entrada detallada`,thumbnail:`Miniatura`,videoDataMissing:`No se encontraron datos de vídeo.`,videoId:`Identificación de vídeo`,videoOwner:`Cargador`,videoSwitchDetected:`Cambio de vídeo detectado...`,videoSwitchError:`Error de cambio de vídeo: {message}`,episodeNumber:`Número de episodio`,episodeTitleOptional:`Título del episodio (opcional)`,commentCount:`Comentarios`,commentCountLong:`Recuento de comentarios`,mylistCount:`Mi lista`,mylistCountLong:`Recuento de mi lista`,officialVideoMissing:`No se encontró ningún vídeo oficial. Mostrando todos los resultados de la búsqueda.`,searchingKeyword:`Buscando "{keyword}"...`,searchKeywordRequired:`Introduzca una palabra clave de búsqueda`,searchNoResults:`No se encontraron resultados de búsqueda`,searchFormFilled:`Rellenó el formulario de búsqueda con "{keyword}"`,similarity:`Similitud: {score}%`,viewCount:`Vistas`,viewCountLong:`Ver recuento`,search:`Buscar`,searchAnimePlaceholder:`Ejemplo: Frieren: Más allá del fin del viaje`,searchEpisodeNumberPlaceholder:`Ejemplo: episodio 1`,searchEpisodeTitlePlaceholder:`Ejemplo: el fin del viaje`,searchFreeword:`Búsqueda de palabras libre`,searchInputModeToggle:`Cambiar modo de entrada (entrada detallada/libre)`,searchPage:`Página de búsqueda`,searchTab:`Buscar`,searchVideoHeading:`Busque el vídeo para superponer comentarios`,saveSettings:`Guardar configuración`,settings:`Configuración`,settingsClose:`Cerrar configuración`,settingsFabLabel:`Abrir la configuración de comentarios de Niconico`,playbackLoadFailed:`No se pudo cargar la configuración de reproducción`,playbackSaveFailed:`No se pudo guardar la configuración de reproducción`,settingsLoadFailed:`No se pudo cargar la configuración`,settingsSaved:`Configuración guardada`,settingsSaveFailed:`No se pudo guardar la configuración`,success:`Éxito`,videoDataLoadFailed:`No se pudieron cargar los datos del video`,videoDataSaveFailed:`No se pudieron guardar los datos del video`,warning:`Advertencia`},fr:{color:`Couleur`,commentColor:`Couleur du commentaire`,commentOpacity:`Opacité`,commentSettings:`Paramètres des commentaires`,commentSettingsPanel:`Panneau de paramètres des commentaires`,commentVisibility:`Afficher les commentaires`,commentVisibilityToggle:`Activer/désactiver la visibilité des commentaires`,currentVideoUnset:`Aucune vidéo de superposition n'est définie`,error:`Erreur`,animeTitle:`Titre de l'anime`,autoFillSearchForm:`Remplissez le formulaire de recherche avec le titre, le numéro de l'épisode et le titre de l'épisode`,autoSearch:`Recherche automatique`,autoSearchDescription:`Définir automatiquement les commentaires à l'ouverture de la page de lecture`,autoSearchDisabledManual:`Recherche automatique désactivée (mode de configuration manuelle)`,autoSearchEnabled:`Recherche automatique activée`,autoSearchInfo:`À propos de la recherche automatique`,fixedPlaybackRate:`Vitesse de verrouillage`,formInput:`Remplir le formulaire`,freeInput:`Entrée gratuite`,idLoadFailed:`Échec du chargement des informations d'identification`,idSaveFailed:`Échec de l'enregistrement des informations d'identification`,info:`Informations`,manualSearchLoadFailed:`Échec du chargement des paramètres de recherche`,manualSearchSaveFailed:`Échec de l'enregistrement des paramètres de recherche`,manualSearchPlaceholder:`Entrez un mot-clé de recherche`,ngRegex:`Expressions régulières NG`,ngRegexPlaceholder:`Entrez une expression régulière NG par ligne`,ngTab:`NG`,ngWords:`Mots NG`,ngWordsPlaceholder:`Entrez un mot NG par ligne`,noMessage:`Aucun message`,playbackRate:`Vitesse de lecture`,playbackRateFixedToggle:`Verrouillage de la vitesse de lecture activé/désactivé`,postedAt:`Publié à`,commentsSet:`Définir les commentaires de "{title}"`,autoSetupComplete:`La vidéo de Niconico a été réglée automatiquement`,autoSetupError:`Erreur de configuration automatique\xA0: {message}`,commentsHiddenSkip:`Ignoré car les commentaires sont masqués dans les paramètres`,commentsLoadComplete:`Chargement des commentaires terminé ({count})`,commentsLoadErrorSelectAnother:`Erreur de chargement du commentaire\xA0: {message}\\nSélectionnez une autre vidéo à partir du bouton flottant.`,commentsUnavailable:`Impossible de récupérer les commentaires`,commentSourceUpdated:`Source des commentaires mise à jour\xA0: {title} ({count})`,commentFetchError:`Erreur de récupération des commentaires\xA0:\xA0{message}`,domUpdateWaitFailed:`Échec de l'attente de la mise à jour du DOM\xA0: {message}`,episodeChangeDetected:`Changement d'épisode détecté...`,episodeNumberMissing:`Impossible d'obtenir le numéro de l'épisode`,episodeSwitchError:`Erreur de changement d'épisode\xA0: {message}`,initializationError:`Erreur d'initialisation\xA0: {message}`,initializingCommentLoader:`Initialisation du chargeur de commentaires...`,manualModeSelectAnimeTitle:`Le mode manuel est activé. Ouvrez l'onglet Recherche à partir du bouton flottant et définissez un titre d'anime.`,manualModeSelectVideo:`Le mode manuel est activé. Ouvrez l'onglet Recherche à partir du bouton flottant et sélectionnez une vidéo.`,manualModeCommentsLoadComplete:`[Mode manuel] Fin du chargement des commentaires ({count}) Vidéo\\n: {title}`,metadataAutoFetchFailed:`La récupération automatique à partir de la page de lecture a échoué. Les métadonnées n'ont pas pu être acquises.`,niconicoNotFound:`Aucune vidéo Niconico n'a été trouvée`,niconicoNotFoundManual:`Aucune vidéo Niconico n’a été trouvée. Recherchez manuellement.`,nextEpisodeAutoSetupComplete:`Configurer automatiquement le prochain épisode`,nextVideoCommentsUnavailableClear:`Impossible de récupérer les commentaires pour la prochaine vidéo. Effacement de l'affichage des commentaires.`,noAnimeTitle:`Impossible d'obtenir le titre de l'anime. La précision de la recherche peut être réduite.`,officialVideoMissingUseFirst:`Aucune vidéo officielle n'a été trouvée. Utilisation du premier résultat de recherche.`,officialVideoMissingManual:`Aucune vidéo officielle n'a été trouvée. Recherchez manuellement.`,officialVideoSafeguardInfo:`À propos de la sauvegarde vidéo officielle`,unknownTitle:`Titre inconnu`,structuredInput:`Entrée détaillée`,thumbnail:`Miniature`,videoDataMissing:`Les données vidéo n'ont pas été trouvées.`,videoId:`ID vidéo`,videoOwner:`Téléchargeur`,videoSwitchDetected:`Commutateur vidéo détecté...`,videoSwitchError:`Erreur de commutation vidéo\xA0: {message}`,episodeNumber:`Numéro de l'épisode`,episodeTitleOptional:`Titre de l'épisode (facultatif)`,commentCount:`Commentaires`,commentCountLong:`Nombre de commentaires`,mylistCount:`Ma liste`,mylistCountLong:`Nombre de ma liste`,officialVideoMissing:`Aucune vidéo officielle n'a été trouvée. Affichage de tous les résultats de recherche.`,searchingKeyword:`Recherche de "{keyword}"...`,searchKeywordRequired:`Entrez un mot-clé de recherche`,searchNoResults:`Aucun résultat de recherche n'a été trouvé`,searchFormFilled:`Rempli le formulaire de recherche avec "{keyword}"`,similarity:`Similitude\xA0:\xA0{score}\xA0%`,viewCount:`Vues`,viewCountLong:`Nombre de vues`,search:`Rechercher`,searchAnimePlaceholder:`Exemple\xA0: Frieren\xA0: Au-delà de la fin du voyage`,searchEpisodeNumberPlaceholder:`Exemple : Épisode 1`,searchEpisodeTitlePlaceholder:`Exemple\xA0: la fin du voyage`,searchFreeword:`Recherche de mots libre`,searchInputModeToggle:`Changer le mode d'entrée (entrée détaillée/libre)`,searchPage:`Page de recherche`,searchTab:`Rechercher`,searchVideoHeading:`Recherchez la vidéo à partir de laquelle superposer les commentaires`,saveSettings:`Enregistrer les paramètres`,settings:`Paramètres`,settingsClose:`Fermer les paramètres`,settingsFabLabel:`Ouvrir les paramètres des commentaires Niconico`,playbackLoadFailed:`Échec du chargement des paramètres de lecture`,playbackSaveFailed:`Échec de l'enregistrement des paramètres de lecture`,settingsLoadFailed:`Échec du chargement des paramètres`,settingsSaved:`Paramètres enregistrés`,settingsSaveFailed:`Échec de l'enregistrement des paramètres`,success:`Succès`,videoDataLoadFailed:`Échec du chargement des données vidéo`,videoDataSaveFailed:`Échec de l'enregistrement des données vidéo`,warning:`Avertissement`},ar:{color:`اللون`,commentColor:`لون التعليق`,commentOpacity:`العتامة`,commentSettings:`إعدادات التعليق`,commentSettingsPanel:`لوحة إعدادات التعليق`,commentVisibility:`عرض التعليقات`,commentVisibilityToggle:`تبديل رؤية التعليق`,currentVideoUnset:`لم يتم تعيين أي فيديو متراكب`,error:`خطأ`,animeTitle:`عنوان الأنمي`,autoFillSearchForm:`املأ نموذج البحث بالعنوان ورقم الحلقة وعنوان الحلقة`,autoSearch:`البحث التلقائي`,autoSearchDescription:`قم بتعيين التعليقات تلقائيًا عند فتح صفحة المشاهدة`,autoSearchDisabledManual:`تم تعطيل البحث التلقائي (وضع الإعداد اليدوي)`,autoSearchEnabled:`تم تمكين البحث التلقائي`,autoSearchInfo:`حول البحث التلقائي`,fixedPlaybackRate:`سرعة القفل`,formInput:`ملء النموذج`,freeInput:`مدخلات مجانية`,idLoadFailed:`فشل تحميل معلومات الهوية`,idSaveFailed:`فشل في حفظ معلومات الهوية`,info:`معلومات`,manualSearchLoadFailed:`فشل تحميل إعدادات البحث`,manualSearchSaveFailed:`فشل في حفظ إعدادات البحث`,manualSearchPlaceholder:`أدخل كلمة رئيسية للبحث`,ngRegex:`NG التعبيرات العادية`,ngRegexPlaceholder:`أدخل تعبيرًا عاديًا NG واحدًا في كل سطر`,ngTab:`نانوغرام`,ngWords:`كلمات نانوغرام`,ngWordsPlaceholder:`أدخل كلمة NG واحدة في كل سطر`,noMessage:`لا توجد رسالة`,playbackRate:`سرعة التشغيل`,playbackRateFixedToggle:`تشغيل/إيقاف قفل سرعة التشغيل`,postedAt:`نشر في`,commentsSet:`تعيين التعليقات من "{title}"`,autoSetupComplete:`تم ضبط فيديو Niconico تلقائيًا`,autoSetupError:`خطأ في الإعداد التلقائي: {message}`,commentsHiddenSkip:`تم تخطيه لأن التعليقات مخفية في الإعدادات`,commentsLoadComplete:`تم الانتهاء من تحميل التعليقات ({count})`,commentsLoadErrorSelectAnother:`خطأ في تحميل التعليق: {message}\\nحدد فيديو آخر من الزر العائم.`,commentsUnavailable:`تعذر جلب التعليقات`,commentSourceUpdated:`مصدر التعليق المحدث: {title} ({count})`,commentFetchError:`خطأ في جلب التعليق: {message}`,domUpdateWaitFailed:`فشل في انتظار تحديث DOM: {message}`,episodeChangeDetected:`تم الكشف عن تغيير الحلقة...`,episodeNumberMissing:`لم أستطع الحصول على رقم الحلقة`,episodeSwitchError:`خطأ في تبديل الحلقة: {message}`,initializationError:`خطأ في التهيئة: {message}`,initializingCommentLoader:`جارٍ تهيئة أداة تحميل التعليقات...`,manualModeSelectAnimeTitle:`تم تمكين الوضع اليدوي. افتح علامة التبويب "بحث" من الزر العائم وقم بتعيين عنوان لأنمي.`,manualModeSelectVideo:`تم تمكين الوضع اليدوي. افتح علامة التبويب "بحث" من الزر العائم وحدد مقطع فيديو.`,manualModeCommentsLoadComplete:`[الوضع اليدوي] انتهى تحميل التعليقات ({count}) فيديو\\n: {title}`,metadataAutoFetchFailed:`فشل الجلب التلقائي من صفحة المشاهدة. لا يمكن الحصول على بيانات التعريف.`,niconicoNotFound:`لم يتم العثور على فيديو Niconico`,niconicoNotFoundManual:`لم يتم العثور على فيديو Niconico. البحث يدويا.`,nextEpisodeAutoSetupComplete:`قم بإعداد الحلقة التالية تلقائيًا`,nextVideoCommentsUnavailableClear:`تعذر جلب التعليقات للفيديو التالي. مسح عرض التعليق.`,noAnimeTitle:`لم أستطع الحصول على عنوان الأنمي. قد يتم تقليل دقة البحث.`,officialVideoMissingUseFirst:`لم يتم العثور على فيديو رسمي. باستخدام نتيجة البحث الأولى.`,officialVideoMissingManual:`لم يتم العثور على فيديو رسمي. البحث يدويا.`,officialVideoSafeguardInfo:`حول حماية الفيديو الرسمية`,unknownTitle:`عنوان غير معروف`,structuredInput:`مدخلات مفصلة`,thumbnail:`صورة مصغرة`,videoDataMissing:`لم يتم العثور على بيانات الفيديو.`,videoId:`معرف الفيديو`,videoOwner:`الرافع`,videoSwitchDetected:`تم اكتشاف تبديل الفيديو...`,videoSwitchError:`خطأ في تبديل الفيديو: {message}`,episodeNumber:`رقم الحلقة`,episodeTitleOptional:`عنوان الحلقة (اختياري)`,commentCount:`التعليقات`,commentCountLong:`عدد التعليقات`,mylistCount:`قائمتي`,mylistCountLong:`عدد قائمتي`,officialVideoMissing:`لم يتم العثور على فيديو رسمي. إظهار كافة نتائج البحث.`,searchingKeyword:`البحث عن "{keyword}"...`,searchKeywordRequired:`أدخل كلمة رئيسية للبحث`,searchNoResults:`لم يتم العثور على نتائج البحث`,searchFormFilled:`املأ نموذج البحث بـ "{keyword}"`,similarity:`التشابه: {score}%`,viewCount:`وجهات النظر`,viewCountLong:`عدد المشاهدات`,search:`بحث`,searchAnimePlaceholder:`مثال: Frieren: ما بعد نهاية الرحلة`,searchEpisodeNumberPlaceholder:`مثال: الحلقة 1`,searchEpisodeTitlePlaceholder:`مثال: نهاية الرحلة`,searchFreeword:`البحث عن الكلمات الحرة`,searchInputModeToggle:`تبديل وضع الإدخال (الإدخال التفصيلي / المجاني)`,searchPage:`صفحة البحث`,searchTab:`بحث`,searchVideoHeading:`ابحث عن الفيديو لتراكب التعليقات منه`,saveSettings:`حفظ الإعدادات`,settings:`الإعدادات`,settingsClose:`إغلاق الإعدادات`,settingsFabLabel:`افتح إعدادات تعليق Niconico`,playbackLoadFailed:`فشل تحميل إعدادات التشغيل`,playbackSaveFailed:`فشل في حفظ إعدادات التشغيل`,settingsLoadFailed:`فشل تحميل الإعدادات`,settingsSaved:`تم حفظ الإعدادات`,settingsSaveFailed:`فشل في حفظ الإعدادات`,success:`النجاح`,videoDataLoadFailed:`فشل تحميل بيانات الفيديو`,videoDataSaveFailed:`فشل في حفظ بيانات الفيديو`,warning:`تحذير`},pt:{color:`Cor`,commentColor:`Cor do comentário`,commentOpacity:`Opacidade`,commentSettings:`Configurações de comentários`,commentSettingsPanel:`Painel de configurações de comentários`,commentVisibility:`Mostrar comentários`,commentVisibilityToggle:`Alternar visibilidade dos comentários`,currentVideoUnset:`Nenhum vídeo de sobreposição está definido`,error:`Erro`,animeTitle:`Título do anime`,autoFillSearchForm:`Preencha o formulário de pesquisa com título, número do episódio e título do episódio`,autoSearch:`Pesquisa automática`,autoSearchDescription:`Defina comentários automaticamente quando a página de exibição for aberta`,autoSearchDisabledManual:`Pesquisa automática desativada (modo de configuração manual)`,autoSearchEnabled:`Pesquisa automática ativada`,autoSearchInfo:`Sobre a pesquisa automática`,fixedPlaybackRate:`Velocidade de bloqueio`,formInput:`Preencher formulário`,freeInput:`Entrada gratuita`,idLoadFailed:`Falha ao carregar informações de ID`,idSaveFailed:`Falha ao salvar informações de ID`,info:`Informações`,manualSearchLoadFailed:`Falha ao carregar as configurações de pesquisa`,manualSearchSaveFailed:`Falha ao salvar as configurações de pesquisa`,manualSearchPlaceholder:`Insira uma palavra-chave de pesquisa`,ngRegex:`Expressões regulares NG`,ngRegexPlaceholder:`Insira uma expressão regular NG por linha`,ngTab:`NG`,ngWords:`Palavras NG`,ngWordsPlaceholder:`Insira uma palavra NG por linha`,noMessage:`Nenhuma mensagem`,playbackRate:`Velocidade de reprodução`,playbackRateFixedToggle:`Ativar/desativar bloqueio de velocidade de reprodução`,postedAt:`Postado em`,commentsSet:`Definir comentários de "{title}"`,autoSetupComplete:`O vídeo do Niconico foi definido automaticamente`,autoSetupError:`Erro de configuração automática: {message}`,commentsHiddenSkip:`Ignorado porque os comentários estão ocultos nas configurações`,commentsLoadComplete:`Comentários de carregamento concluídos ({count})`,commentsLoadErrorSelectAnother:`Erro ao carregar o comentário: {message}\\nSelecione outro vídeo no botão flutuante.`,commentsUnavailable:`Não foi possível buscar comentários`,commentSourceUpdated:`Fonte de comentários atualizada: {title} ({count})`,commentFetchError:`Erro de busca de comentário: {message}`,domUpdateWaitFailed:`Falha ao esperar pela atualização do DOM: {message}`,episodeChangeDetected:`Alteração de episódio detectada...`,episodeNumberMissing:`Não foi possível obter o número do episódio`,episodeSwitchError:`Erro de troca de episódio: {message}`,initializationError:`Erro de inicialização: {message}`,initializingCommentLoader:`Inicializando carregador de comentários...`,manualModeSelectAnimeTitle:`O modo manual está ativado. Abra a guia Pesquisar no botão flutuante e defina um título de anime.`,manualModeSelectVideo:`O modo manual está ativado. Abra a guia Pesquisar no botão flutuante e selecione um vídeo.`,manualModeCommentsLoadComplete:`[Modo manual] Carregamento de comentários concluído ({count}) Vídeo\\n: {title}`,metadataAutoFetchFailed:`Falha na busca automática da página de exibição. Não foi possível adquirir metadados.`,niconicoNotFound:`Nenhum vídeo do Niconico foi encontrado`,niconicoNotFoundManual:`Nenhum vídeo do Niconico foi encontrado. Pesquise manualmente.`,nextEpisodeAutoSetupComplete:`Configure o próximo episódio automaticamente`,nextVideoCommentsUnavailableClear:`Não foi possível buscar comentários para o próximo vídeo. Limpando a exibição de comentários.`,noAnimeTitle:`Não foi possível obter o título do anime. A precisão da pesquisa pode ser reduzida.`,officialVideoMissingUseFirst:`Nenhum vídeo oficial foi encontrado. Usando o primeiro resultado da pesquisa.`,officialVideoMissingManual:`Nenhum vídeo oficial foi encontrado. Pesquise manualmente.`,officialVideoSafeguardInfo:`Sobre a proteção oficial de vídeo`,unknownTitle:`Título desconhecido`,structuredInput:`Entrada detalhada`,thumbnail:`Miniatura`,videoDataMissing:`Os dados de vídeo não foram encontrados.`,videoId:`ID do vídeo`,videoOwner:`Carregador`,videoSwitchDetected:`Troca de vídeo detectada...`,videoSwitchError:`Erro de troca de vídeo: {message}`,episodeNumber:`Número do episódio`,episodeTitleOptional:`Título do episódio (opcional)`,commentCount:`Comentários`,commentCountLong:`Contagem de comentários`,mylistCount:`Minha lista`,mylistCountLong:`Contagem da minha lista`,officialVideoMissing:`Nenhum vídeo oficial foi encontrado. Mostrando todos os resultados da pesquisa.`,searchingKeyword:`Procurando por "{keyword}"...`,searchKeywordRequired:`Insira uma palavra-chave de pesquisa`,searchNoResults:`Nenhum resultado de pesquisa foi encontrado`,searchFormFilled:`Preenchido o formulário de pesquisa com "{keyword}"`,similarity:`Semelhança: {score}%`,viewCount:`Visualizações`,viewCountLong:`Contagem de visualizações`,search:`Pesquisar`,searchAnimePlaceholder:`Exemplo: Frieren: Além do Fim da Jornada`,searchEpisodeNumberPlaceholder:`Exemplo: Episódio 1`,searchEpisodeTitlePlaceholder:`Exemplo: O Fim da Jornada`,searchFreeword:`Pesquisa de palavras grátis`,searchInputModeToggle:`Alternar modo de entrada (entrada detalhada/livre)`,searchPage:`Página de pesquisa`,searchTab:`Pesquisar`,searchVideoHeading:`Procure o vídeo para sobrepor comentários`,saveSettings:`Salvar configurações`,settings:`Configurações`,settingsClose:`Fechar configurações`,settingsFabLabel:`Abra as configurações de comentários do Niconico`,playbackLoadFailed:`Falha ao carregar as configurações de reprodução`,playbackSaveFailed:`Falha ao salvar as configurações de reprodução`,settingsLoadFailed:`Falha ao carregar as configurações`,settingsSaved:`Configurações salvas`,settingsSaveFailed:`Falha ao salvar as configurações`,success:`Sucesso`,videoDataLoadFailed:`Falha ao carregar dados de vídeo`,videoDataSaveFailed:`Falha ao salvar dados de vídeo`,warning:`Aviso`},bn:{color:`রঙ`,commentColor:`মন্তব্যের রঙ`,commentOpacity:`অস্বচ্ছতা`,commentSettings:`মন্তব্য সেটিংস`,commentSettingsPanel:`মন্তব্য সেটিংস প্যানেল`,commentVisibility:`মন্তব্য দেখান`,commentVisibilityToggle:`মন্তব্যের দৃশ্যমানতা টগল করুন`,currentVideoUnset:`কোনো ওভারলে ভিডিও সেট করা নেই`,error:`ত্রুটি`,animeTitle:`এনিমে শিরোনাম`,autoFillSearchForm:`শিরোনাম, পর্ব সংখ্যা এবং পর্বের শিরোনাম দিয়ে অনুসন্ধান ফর্মটি পূরণ করুন`,autoSearch:`স্বয়ংক্রিয় অনুসন্ধান`,autoSearchDescription:`ওয়াচ পেজ খুললে স্বয়ংক্রিয়ভাবে মন্তব্য সেট করুন`,autoSearchDisabledManual:`স্বয়ংক্রিয় অনুসন্ধান অক্ষম (ম্যানুয়াল সেটআপ মোড)`,autoSearchEnabled:`স্বয়ংক্রিয় অনুসন্ধান সক্ষম`,autoSearchInfo:`স্বয়ংক্রিয় অনুসন্ধান সম্পর্কে`,fixedPlaybackRate:`লক স্পিড`,formInput:`ফর্ম পূরণ করুন`,freeInput:`বিনামূল্যে ইনপুট`,idLoadFailed:`আইডি তথ্য লোড করতে ব্যর্থ হয়েছে`,idSaveFailed:`আইডি তথ্য সংরক্ষণ করতে ব্যর্থ`,info:`তথ্য`,manualSearchLoadFailed:`অনুসন্ধান সেটিংস লোড করতে ব্যর্থ হয়েছে৷`,manualSearchSaveFailed:`অনুসন্ধান সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে`,manualSearchPlaceholder:`একটি অনুসন্ধান কীওয়ার্ড লিখুন`,ngRegex:`NG রেগুলার এক্সপ্রেশন`,ngRegexPlaceholder:`প্রতি লাইনে একটি NG রেগুলার এক্সপ্রেশন লিখুন`,ngTab:`এনজি`,ngWords:`এনজি শব্দ`,ngWordsPlaceholder:`প্রতি লাইনে একটি NG শব্দ লিখুন`,noMessage:`কোন বার্তা নেই`,playbackRate:`প্লেব্যাক গতি`,playbackRateFixedToggle:`প্লেব্যাক স্পিড লক চালু/বন্ধ`,postedAt:`এ পোস্ট করা হয়েছে`,commentsSet:`"{title}" থেকে মন্তব্য সেট করুন`,autoSetupComplete:`Niconico ভিডিও স্বয়ংক্রিয়ভাবে সেট করা হয়েছে`,autoSetupError:`স্বয়ংক্রিয় সেটআপ ত্রুটি: {message}`,commentsHiddenSkip:`বাদ দেওয়া হয়েছে কারণ মন্তব্যগুলি সেটিংসে লুকানো আছে৷`,commentsLoadComplete:`মন্তব্য লোড করা সমাপ্ত ({count})`,commentsLoadErrorSelectAnother:`মন্তব্য লোডিং ত্রুটি: {message}\\nভাসমান বোতাম থেকে অন্য ভিডিও নির্বাচন করুন৷`,commentsUnavailable:`মন্তব্য আনা যায়নি`,commentSourceUpdated:`আপডেট করা মন্তব্যের উৎস: {title} ({count})`,commentFetchError:`মন্তব্য আনা ত্রুটি: {message}`,domUpdateWaitFailed:`DOM আপডেটের জন্য অপেক্ষা করতে ব্যর্থ হয়েছে: {message}`,episodeChangeDetected:`এপিসোড পরিবর্তন শনাক্ত করা হয়েছে...`,episodeNumberMissing:`পর্ব নম্বর পাওয়া যায়নি`,episodeSwitchError:`এপিসোড সুইচ ত্রুটি: {message}`,initializationError:`সূচনা ত্রুটি: {message}`,initializingCommentLoader:`মন্তব্য লোডার শুরু করা হচ্ছে...`,manualModeSelectAnimeTitle:`ম্যানুয়াল মোড সক্রিয় করা হয়েছে। ভাসমান বোতাম থেকে অনুসন্ধান ট্যাবটি খুলুন এবং একটি অ্যানিমে শিরোনাম সেট করুন।`,manualModeSelectVideo:`ম্যানুয়াল মোড সক্রিয় করা হয়েছে। ভাসমান বোতাম থেকে অনুসন্ধান ট্যাবটি খুলুন এবং একটি ভিডিও নির্বাচন করুন।`,manualModeCommentsLoadComplete:`[ম্যানুয়াল মোড] মন্তব্য লোড করা সমাপ্ত ({count})\\nভিডিও: {title}`,metadataAutoFetchFailed:`দেখার পৃষ্ঠা থেকে স্বয়ংক্রিয়ভাবে আনা ব্যর্থ হয়েছে. মেটাডেটা অর্জন করা যায়নি।`,niconicoNotFound:`কোন নিকোনিকো ভিডিও পাওয়া যায়নি`,niconicoNotFoundManual:`কোন নিকোনিকো ভিডিও পাওয়া যায়নি. ম্যানুয়ালি অনুসন্ধান করুন।`,nextEpisodeAutoSetupComplete:`পরের পর্ব স্বয়ংক্রিয়ভাবে সেট আপ করুন`,nextVideoCommentsUnavailableClear:`পরবর্তী ভিডিওর জন্য মন্তব্য আনা যায়নি. মন্তব্য প্রদর্শন সাফ করা হচ্ছে।`,noAnimeTitle:`অ্যানিমে শিরোনাম পেতে পারিনি। অনুসন্ধান নির্ভুলতা হ্রাস হতে পারে.`,officialVideoMissingUseFirst:`কোনো অফিসিয়াল ভিডিও পাওয়া যায়নি। প্রথম অনুসন্ধান ফলাফল ব্যবহার করে.`,officialVideoMissingManual:`কোনো অফিসিয়াল ভিডিও পাওয়া যায়নি। ম্যানুয়ালি অনুসন্ধান করুন।`,officialVideoSafeguardInfo:`অফিসিয়াল ভিডিও সুরক্ষা সম্পর্কে`,unknownTitle:`অজানা শিরোনাম`,structuredInput:`বিস্তারিত ইনপুট`,thumbnail:`থাম্বনেইল`,videoDataMissing:`ভিডিও তথ্য পাওয়া যায়নি.`,videoId:`ভিডিও আইডি`,videoOwner:`আপলোডার`,videoSwitchDetected:`শনাক্ত করা ভিডিও সুইচ...`,videoSwitchError:`ভিডিও সুইচ ত্রুটি: {message}`,episodeNumber:`পর্ব সংখ্যা`,episodeTitleOptional:`পর্বের শিরোনাম (ঐচ্ছিক)`,commentCount:`মন্তব্য`,commentCountLong:`মন্তব্য গণনা`,mylistCount:`মাইলিস্ট`,mylistCountLong:`মাইলিস্ট গণনা`,officialVideoMissing:`কোনো অফিসিয়াল ভিডিও পাওয়া যায়নি। সমস্ত অনুসন্ধান ফলাফল দেখাচ্ছে.`,searchingKeyword:`"{keyword}" এর জন্য অনুসন্ধান করা হচ্ছে...`,searchKeywordRequired:`একটি অনুসন্ধান কীওয়ার্ড লিখুন`,searchNoResults:`কোন অনুসন্ধান ফলাফল পাওয়া যায়নি`,searchFormFilled:`"{keyword}" দিয়ে অনুসন্ধান ফর্ম পূরণ করুন`,similarity:`সাদৃশ্য: {score}%`,viewCount:`ভিউ`,viewCountLong:`ভিউ গণনা`,search:`অনুসন্ধান করুন`,searchAnimePlaceholder:`উদাহরণ: Frieren: Beyond Journey's End`,searchEpisodeNumberPlaceholder:`উদাহরণ: পর্ব 1`,searchEpisodeTitlePlaceholder:`উদাহরণ: The Journey's End`,searchFreeword:`বিনামূল্যে শব্দ অনুসন্ধান`,searchInputModeToggle:`ইনপুট মোড পরিবর্তন করুন (বিস্তারিত / বিনামূল্যে ইনপুট)`,searchPage:`অনুসন্ধান পৃষ্ঠা`,searchTab:`অনুসন্ধান করুন`,searchVideoHeading:`থেকে মন্তব্য ওভারলে ভিডিও জন্য অনুসন্ধান করুন`,saveSettings:`সেটিংস সংরক্ষণ করুন`,settings:`সেটিংস`,settingsClose:`সেটিংস বন্ধ করুন`,settingsFabLabel:`নিকোনিকো মন্তব্য সেটিংস খুলুন`,playbackLoadFailed:`প্লেব্যাক সেটিংস লোড করতে ব্যর্থ৷`,playbackSaveFailed:`প্লেব্যাক সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে৷`,settingsLoadFailed:`সেটিংস লোড করতে ব্যর্থ হয়েছে৷`,settingsSaved:`সেটিংস সংরক্ষিত`,settingsSaveFailed:`সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে`,success:`সফলতা`,videoDataLoadFailed:`ভিডিও ডেটা লোড করতে ব্যর্থ হয়েছে৷`,videoDataSaveFailed:`ভিডিও ডেটা সংরক্ষণ করতে ব্যর্থ হয়েছে৷`,warning:`সতর্কতা`},ru:{color:`Цвет`,commentColor:`Цвет комментария`,commentOpacity:`Непрозрачность`,commentSettings:`Настройки комментариев`,commentSettingsPanel:`Панель настроек комментариев`,commentVisibility:`Показать комментарии`,commentVisibilityToggle:`Переключить видимость комментариев`,currentVideoUnset:`Наложение видео не установлено.`,error:`Ошибка`,animeTitle:`Название аниме`,autoFillSearchForm:`Заполните форму поиска, указав название, номер эпизода и название эпизода.`,autoSearch:`Автоматический поиск`,autoSearchDescription:`Автоматически устанавливать комментарии при открытии страницы просмотра`,autoSearchDisabledManual:`Автоматический поиск отключен (режим ручной настройки)`,autoSearchEnabled:`Автоматический поиск включен`,autoSearchInfo:`Об автопоиске`,fixedPlaybackRate:`Скорость блокировки`,formInput:`Заполнить форму`,freeInput:`Бесплатный вход`,idLoadFailed:`Не удалось загрузить идентификационную информацию.`,idSaveFailed:`Не удалось сохранить идентификационную информацию.`,info:`Информация`,manualSearchLoadFailed:`Не удалось загрузить настройки поиска.`,manualSearchSaveFailed:`Не удалось сохранить настройки поиска.`,manualSearchPlaceholder:`Введите ключевое слово для поиска`,ngRegex:`Регулярные выражения NG`,ngRegexPlaceholder:`Введите одно регулярное выражение NG в каждой строке.`,ngTab:`НГ`,ngWords:`НГ слова`,ngWordsPlaceholder:`Введите по одному слову NG в строке`,noMessage:`Нет сообщения`,playbackRate:`Скорость воспроизведения`,playbackRateFixedToggle:`Блокировка скорости воспроизведения вкл./выкл.`,postedAt:`Опубликовано в`,commentsSet:`Установить комментарии от «{title}»`,autoSetupComplete:`Видео Niconico было установлено автоматически`,autoSetupError:`Ошибка автоматической настройки: {message}.`,commentsHiddenSkip:`Пропущено, поскольку комментарии скрыты в настройках.`,commentsLoadComplete:`Загрузка комментариев завершена ({count}).`,commentsLoadErrorSelectAnother:`Ошибка загрузки комментария: {message}\\nВыберите другое видео с помощью плавающей кнопки.`,commentsUnavailable:`Не удалось получить комментарии.`,commentSourceUpdated:`Обновленный источник комментариев: {title} ({count})`,commentFetchError:`Ошибка получения комментария: {message}.`,domUpdateWaitFailed:`Не удалось дождаться обновления DOM: {message}.`,episodeChangeDetected:`Обнаружено изменение эпизода...`,episodeNumberMissing:`Не удалось получить номер серии`,episodeSwitchError:`Ошибка переключения эпизодов: {message}.`,initializationError:`Ошибка инициализации: {message}.`,initializingCommentLoader:`Инициализация загрузчика комментариев...`,manualModeSelectAnimeTitle:`Ручной режим включен. Откройте вкладку «Поиск» с помощью плавающей кнопки и установите название аниме.`,manualModeSelectVideo:`Ручной режим включен. Откройте вкладку «Поиск» с помощью плавающей кнопки и выберите видео.`,manualModeCommentsLoadComplete:`[Ручной режим] Загрузка комментариев завершена ({count}) Видео\\n: {title}`,metadataAutoFetchFailed:`Не удалось выполнить автоматическое получение со страницы просмотра. Метаданные не удалось получить.`,niconicoNotFound:`Видео Niconico не найдено`,niconicoNotFoundManual:`Видео Niconico не найдено. Поиск вручную.`,nextEpisodeAutoSetupComplete:`Автоматически настроить следующий выпуск`,nextVideoCommentsUnavailableClear:`Не удалось получить комментарии к следующему видео. Очистка отображения комментариев.`,noAnimeTitle:`Не удалось получить название аниме. Точность поиска может снизиться.`,officialVideoMissingUseFirst:`Официального видео не найдено. Использование первого результата поиска.`,officialVideoMissingManual:`Официального видео не найдено. Поиск вручную.`,officialVideoSafeguardInfo:`Об официальной видеоохране`,unknownTitle:`Неизвестное название`,structuredInput:`Подробный ввод`,thumbnail:`Миниатюра`,videoDataMissing:`Видеоданные не найдены.`,videoId:`Идентификатор видео`,videoOwner:`Загрузчик`,videoSwitchDetected:`Обнаружено переключение видео...`,videoSwitchError:`Ошибка видеопереключателя: {message}`,episodeNumber:`Номер серии`,episodeTitleOptional:`Название серии (необязательно)`,commentCount:`Комментарии`,commentCountLong:`Количество комментариев`,mylistCount:`Мой список`,mylistCountLong:`Количество в моем списке`,officialVideoMissing:`Официального видео не найдено. Показаны все результаты поиска.`,searchingKeyword:`Ищем "{keyword}"...`,searchKeywordRequired:`Введите ключевое слово для поиска`,searchNoResults:`Результаты поиска не найдены`,searchFormFilled:`Заполнил форму поиска с помощью «{keyword}»`,similarity:`Сходство: {score}%`,viewCount:`Просмотры`,viewCountLong:`Количество просмотров`,search:`Поиск`,searchAnimePlaceholder:`Пример: Frieren: Beyond Journey’s End`,searchEpisodeNumberPlaceholder:`Пример: Эпизод 1`,searchEpisodeTitlePlaceholder:`Пример: Конец путешествия`,searchFreeword:`Свободный поиск слов`,searchInputModeToggle:`Переключение режима ввода (детальный/свободный ввод)`,searchPage:`Страница поиска`,searchTab:`Поиск`,searchVideoHeading:`Найдите видео, из которого можно наложить комментарии.`,saveSettings:`Сохранить настройки`,settings:`Настройки`,settingsClose:`Закрыть настройки`,settingsFabLabel:`Открыть настройки комментариев Niconico`,playbackLoadFailed:`Не удалось загрузить настройки воспроизведения.`,playbackSaveFailed:`Не удалось сохранить настройки воспроизведения.`,settingsLoadFailed:`Не удалось загрузить настройки`,settingsSaved:`Настройки сохранены.`,settingsSaveFailed:`Не удалось сохранить настройки.`,success:`Успех`,videoDataLoadFailed:`Не удалось загрузить видеоданные.`,videoDataSaveFailed:`Не удалось сохранить видеоданные.`,warning:`Предупреждение`},ur:{color:`رنگ`,commentColor:`تبصرہ کا رنگ`,commentOpacity:`دھندلاپن`,commentSettings:`تبصرہ کی ترتیبات`,commentSettingsPanel:`تبصرہ کی ترتیبات کا پینل`,commentVisibility:`تبصرے دکھائیں۔`,commentVisibilityToggle:`تبصرے کی مرئیت کو ٹوگل کریں۔`,currentVideoUnset:`کوئی اوورلے ویڈیو سیٹ نہیں ہے۔`,error:`خرابی`,animeTitle:`موبائل فونز کا عنوان`,autoFillSearchForm:`سرچ فارم کو عنوان، قسط نمبر، اور قسط کے عنوان کے ساتھ پُر کریں۔`,autoSearch:`خودکار تلاش`,autoSearchDescription:`دیکھنے کا صفحہ کھلنے پر تبصرے خود بخود سیٹ کریں۔`,autoSearchDisabledManual:`خودکار تلاش غیر فعال (دستی سیٹ اپ موڈ)`,autoSearchEnabled:`خودکار تلاش فعال ہے۔`,autoSearchInfo:`خودکار تلاش کے بارے میں`,fixedPlaybackRate:`لاک رفتار`,formInput:`فارم پُر کریں۔`,freeInput:`مفت ان پٹ`,idLoadFailed:`ID کی معلومات لوڈ کرنے میں ناکام`,idSaveFailed:`ID کی معلومات محفوظ کرنے میں ناکام`,info:`معلومات`,manualSearchLoadFailed:`تلاش کی ترتیبات لوڈ کرنے میں ناکام`,manualSearchSaveFailed:`تلاش کی ترتیبات کو محفوظ کرنے میں ناکام`,manualSearchPlaceholder:`تلاش کا مطلوبہ لفظ درج کریں۔`,ngRegex:`NG ریگولر ایکسپریشنز`,ngRegexPlaceholder:`فی لائن ایک NG ریگولر ایکسپریشن درج کریں۔`,ngTab:`این جی`,ngWords:`NG الفاظ`,ngWordsPlaceholder:`فی لائن ایک NG لفظ درج کریں۔`,noMessage:`کوئی پیغام نہیں۔`,playbackRate:`پلے بیک کی رفتار`,playbackRateFixedToggle:`پلے بیک اسپیڈ لاک آن/آف`,postedAt:`پر پوسٹ کیا گیا۔`,commentsSet:`"{title}" سے تبصرے سیٹ کریں`,autoSetupComplete:`Niconico ویڈیو خود بخود ترتیب دی گئی تھی۔`,autoSetupError:`آٹو سیٹ اپ کی خرابی: {message}`,commentsHiddenSkip:`چھوڑ دیا گیا کیونکہ تبصرے ترتیبات میں پوشیدہ ہیں۔`,commentsLoadComplete:`تبصرے لوڈ کرنا مکمل ہو گیا ({count})`,commentsLoadErrorSelectAnother:`تبصرہ لوڈ کرنے میں خرابی: {message}\\nتیرتے بٹن سے ایک اور ویڈیو منتخب کریں۔`,commentsUnavailable:`تبصرے حاصل نہیں کر سکے۔`,commentSourceUpdated:`تجدید شدہ تبصرہ ماخذ: {title} ({count})`,commentFetchError:`تبصرہ کی بازیافت کی خرابی: {message}`,domUpdateWaitFailed:`DOM اپ ڈیٹ کا انتظار کرنے میں ناکام: {message}`,episodeChangeDetected:`ایپی سوڈ کی تبدیلی کا پتہ چلا...`,episodeNumberMissing:`قسط نمبر نہیں مل سکا`,episodeSwitchError:`ایپی سوڈ سوئچ کی خرابی: {message}`,initializationError:`ابتدائی غلطی: {message}`,initializingCommentLoader:`تبصرہ لوڈر شروع کیا جا رہا ہے...`,manualModeSelectAnimeTitle:`دستی موڈ فعال ہے۔ تیرتے ہوئے بٹن سے سرچ ٹیب کو کھولیں اور ایک anime عنوان سیٹ کریں۔`,manualModeSelectVideo:`دستی موڈ فعال ہے۔ تیرتے ہوئے بٹن سے سرچ ٹیب کھولیں اور ایک ویڈیو منتخب کریں۔`,manualModeCommentsLoadComplete:`[دستی موڈ] تبصرے کو لوڈ کرنا ({count})\\nویڈیو: {title}`,metadataAutoFetchFailed:`واچ پیج سے خودکار بازیافت ناکام ہو گئی۔ میٹا ڈیٹا حاصل نہیں کیا جا سکا۔`,niconicoNotFound:`Niconico کی کوئی ویڈیو نہیں ملی`,niconicoNotFoundManual:`Niconico کی کوئی ویڈیو نہیں ملی۔ دستی طور پر تلاش کریں۔`,nextEpisodeAutoSetupComplete:`اگلی قسط خود بخود ترتیب دیں۔`,nextVideoCommentsUnavailableClear:`اگلی ویڈیو کے لیے تبصرے حاصل نہیں کیے جا سکے۔ تبصرہ ڈسپلے کو صاف کرنا۔`,noAnimeTitle:`anime عنوان حاصل نہیں کر سکا۔ تلاش کی درستگی کم ہو سکتی ہے۔`,officialVideoMissingUseFirst:`کوئی سرکاری ویڈیو نہیں ملی۔ پہلے تلاش کا نتیجہ استعمال کرنا۔`,officialVideoMissingManual:`کوئی سرکاری ویڈیو نہیں ملی۔ دستی طور پر تلاش کریں۔`,officialVideoSafeguardInfo:`سرکاری ویڈیو حفاظت کے بارے میں`,unknownTitle:`نامعلوم عنوان`,structuredInput:`تفصیلی ان پٹ`,thumbnail:`تھمب نیل`,videoDataMissing:`ویڈیو ڈیٹا نہیں ملا۔`,videoId:`ویڈیو آئی ڈی`,videoOwner:`اپ لوڈ کرنے والا`,videoSwitchDetected:`ویڈیو سوئچ کا پتہ چلا...`,videoSwitchError:`ویڈیو سوئچ کی خرابی: {message}`,episodeNumber:`قسط نمبر`,episodeTitleOptional:`قسط کا عنوان (اختیاری)`,commentCount:`تبصرے`,commentCountLong:`تبصرہ شمار`,mylistCount:`مائی لسٹ`,mylistCountLong:`مائی لسٹ شمار`,officialVideoMissing:`کوئی سرکاری ویڈیو نہیں ملی۔ تلاش کے تمام نتائج دکھا رہا ہے۔`,searchingKeyword:`"{keyword}" تلاش کر رہا ہے...`,searchKeywordRequired:`تلاش کا مطلوبہ لفظ درج کریں۔`,searchNoResults:`تلاش کے کوئی نتائج نہیں ملے`,searchFormFilled:`"{keyword}" کے ساتھ تلاش کا فارم بھرا`,similarity:`مماثلت: {score}%`,viewCount:`مناظر`,viewCountLong:`دیکھنے کی تعداد`,search:`تلاش کریں۔`,searchAnimePlaceholder:`مثال: فریرین: سفر کے اختتام سے آگے`,searchEpisodeNumberPlaceholder:`مثال: قسط 1`,searchEpisodeTitlePlaceholder:`مثال: سفر کا اختتام`,searchFreeword:`مفت الفاظ کی تلاش`,searchInputModeToggle:`ان پٹ موڈ سوئچ کریں (تفصیلی / مفت ان پٹ)`,searchPage:`صفحہ تلاش کریں۔`,searchTab:`تلاش کریں۔`,searchVideoHeading:`تبصروں کو اوورلے کرنے کے لیے ویڈیو تلاش کریں۔`,saveSettings:`ترتیبات کو محفوظ کریں۔`,settings:`ترتیبات`,settingsClose:`ترتیبات بند کریں۔`,settingsFabLabel:`نیکونیکو تبصرہ کی ترتیبات کھولیں۔`,playbackLoadFailed:`پلے بیک کی ترتیبات لوڈ کرنے میں ناکام`,playbackSaveFailed:`پلے بیک کی ترتیبات کو محفوظ کرنے میں ناکام`,settingsLoadFailed:`ترتیبات لوڈ کرنے میں ناکام`,settingsSaved:`ترتیبات محفوظ ہو گئیں۔`,settingsSaveFailed:`ترتیبات کو محفوظ کرنے میں ناکام`,success:`کامیابی`,videoDataLoadFailed:`ویڈیو ڈیٹا لوڈ کرنے میں ناکام`,videoDataSaveFailed:`ویڈیو ڈیٹا محفوظ کرنے میں ناکام`,warning:`وارننگ`}},`en`),defaultLocale:`ja`,fallbackLocale:`en`});ma.setLocale(ma.detectBrowserLocale());function ha(e){return ma.t(e)}var V=ma.format,H=ma.t,ga=`settings`,_a=`currentVideo`,va=`lastDanimeIds`,ya=`playbackSettings`,ba=`manualSearchSettings`,xa=e=>({...e,ngWords:[...e.ngWords],ngRegexps:[...e.ngRegexps]}),Sa={fixedModeEnabled:!1,fixedRate:1.11},Ca=e=>({fixedModeEnabled:e.fixedModeEnabled,fixedRate:e.fixedRate}),wa=class{notifier;settings;currentVideo;observers=new Set;playbackSettings;playbackObservers=new Set;constructor(e){this.notifier=e,this.settings=R(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData(),this.playbackSettings=Ca(Sa),this.loadPlaybackSettings()}getSettings(){return xa(this.settings)}loadSettings(){try{let e=z(ga,null);if(!e)return this.settings=R(),this.settings;if(typeof e==`string`){let t=JSON.parse(e);this.settings={...R(),...t,ngWords:Array.isArray(t?.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t?.ngRegexps)?[...t.ngRegexps]:[]}}else this.settings={...R(),...e,ngWords:Array.isArray(e.ngWords)?[...e.ngWords]:[],ngRegexps:Array.isArray(e.ngRegexps)?[...e.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(e){return console.error(`[SettingsManager] 設定の読み込みに失敗しました`,e),this.notify(H(`settingsLoadFailed`),`error`),this.settings=R(),this.settings}}getPlaybackSettings(){return Ca(this.playbackSettings)}loadPlaybackSettings(){try{let e=z(ya,null);if(!e)return this.playbackSettings=Ca(Sa),this.notifyPlaybackObservers(),this.playbackSettings;if(typeof e==`string`){let t=JSON.parse(e);this.playbackSettings={fixedModeEnabled:typeof t.fixedModeEnabled==`boolean`?t.fixedModeEnabled:Sa.fixedModeEnabled,fixedRate:typeof t.fixedRate==`number`?t.fixedRate:Sa.fixedRate}}else this.playbackSettings={fixedModeEnabled:e.fixedModeEnabled,fixedRate:e.fixedRate};return this.notifyPlaybackObservers(),this.playbackSettings}catch(e){return console.error(`[SettingsManager] 再生設定の読み込みに失敗しました`,e),this.notify(H(`playbackLoadFailed`),`error`),this.playbackSettings=Ca(Sa),this.notifyPlaybackObservers(),this.playbackSettings}}updatePlaybackSettings(e){return this.playbackSettings={...this.playbackSettings,...e},this.savePlaybackSettings()}savePlaybackSettings(){try{return B(ya,JSON.stringify(this.playbackSettings)),this.notifyPlaybackObservers(),!0}catch(e){return console.error(`[SettingsManager] 再生設定の保存に失敗しました`,e),this.notify(H(`playbackSaveFailed`),`error`),!1}}saveSettings(){let e=this.persistSettings();return e&&this.notify(H(`settingsSaved`),`success`),e}updateSettings(e){return this.settings={...this.settings,...e,ngWords:e.ngWords?[...e.ngWords]:[...this.settings.ngWords??[]],ngRegexps:e.ngRegexps?[...e.ngRegexps]:[...this.settings.ngRegexps??[]]},this.persistSettings()}persistSettings(){try{return B(ga,JSON.stringify(this.settings)),this.notifyObservers(),!0}catch(e){return console.error(`[SettingsManager] 設定の保存に失敗しました`,e),this.notify(H(`settingsSaveFailed`),`error`),!1}}addObserver(e){this.observers.add(e)}removeObserver(e){this.observers.delete(e)}addPlaybackObserver(e){this.playbackObservers.add(e);try{e(this.getPlaybackSettings())}catch(e){console.error(`[SettingsManager] 再生設定の登録通知でエラー`,e)}}removePlaybackObserver(e){this.playbackObservers.delete(e)}notifyObservers(){let e=this.getSettings();for(let t of this.observers)try{t(e)}catch(e){console.error(`[SettingsManager] 設定変更通知でエラー`,e)}}notifyPlaybackObservers(){let e=this.getPlaybackSettings();for(let t of this.playbackObservers)try{t(e)}catch(e){console.error(`[SettingsManager] 再生設定通知でエラー`,e)}}loadVideoData(){try{return z(_a,null)??null}catch(e){return console.error(`[SettingsManager] 動画データの読み込みに失敗しました`,e),this.notify(H(`videoDataLoadFailed`),`error`),null}}saveVideoData(e,t){try{let e={videoId:t.videoId,title:t.title,viewCount:t.viewCount,commentCount:t.commentCount,mylistCount:t.mylistCount,postedAt:t.postedAt,thumbnail:t.thumbnail,owner:t.owner??null,channel:t.channel??null};return B(_a,e),this.currentVideo=e,!0}catch(e){return console.error(`[SettingsManager] 動画データの保存に失敗しました`,e),this.notify(H(`videoDataSaveFailed`),`error`),!1}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(e){try{return B(va,e),!0}catch(e){return console.error(`[SettingsManager] saveLastDanimeIds failed`,e),this.notify(H(`idSaveFailed`),`error`),!1}}loadLastDanimeIds(){try{return z(va,null)??null}catch(e){return console.error(`[SettingsManager] loadLastDanimeIds failed`,e),this.notify(H(`idLoadFailed`),`error`),null}}saveManualSearchSettings(e){try{return B(ba,e),!0}catch(e){return console.error(`[SettingsManager] saveManualSearchSettings failed`,e),this.notify(H(`manualSearchSaveFailed`),`error`),!1}}loadManualSearchSettings(){try{return z(ba,null)??null}catch(e){return console.error(`[SettingsManager] loadManualSearchSettings failed`,e),this.notify(H(`manualSearchLoadFailed`),`error`),null}}notify(e,t=`info`){this.notifier?.show(e,t)}},Ta=new Set([`INPUT`,`TEXTAREA`]),Ea=e=>e.length===1?e.toUpperCase():e,Da=e=>e?`${e}+`:``,Oa=class{shortcuts=new Map;boundHandler;isEnabled=!0;isListening=!1;constructor(){this.boundHandler=this.handleKeyDown.bind(this)}addShortcut(e,t,n){let r=this.createShortcutKey(Ea(e),t);this.shortcuts.set(r,n)}removeShortcut(e,t){let n=this.createShortcutKey(Ea(e),t);this.shortcuts.delete(n)}startListening(){this.isListening||=(document.addEventListener(`keydown`,this.boundHandler,!1),!0)}stopListening(){this.isListening&&=(document.removeEventListener(`keydown`,this.boundHandler,!1),!1)}setEnabled(e){this.isEnabled=e}createShortcutKey(e,t){return`${Da(t)}${e}`}extractModifier(e){let t=[];return e.ctrlKey&&t.push(`Ctrl`),e.altKey&&t.push(`Alt`),e.shiftKey&&t.push(`Shift`),e.metaKey&&t.push(`Meta`),t.length>0?t.join(`+`):null}handleKeyDown(e){if(!this.isEnabled)return;let t=e.target?.tagName??``;if(Ta.has(t))return;let n=this.extractModifier(e),r=this.createShortcutKey(Ea(e.key),n),i=this.shortcuts.get(r);i&&(e.preventDefault(),i())}},ka=r(`dAnime:CommentRenderer`),Aa=e=>({loggerNamespace:`dAnime:CommentRenderer`,...e??{}}),ja=e=>{if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.commentColor==`string`&&typeof t.commentOpacity==`number`&&typeof t.isCommentVisible==`boolean`},Ma=class{renderer;keyboardHandler=null;constructor(e,t){ja(e)||e===null?this.renderer=new L(e??null,Aa(t)):this.renderer=new L(Aa(e))}get settings(){return this.renderer.settings}set settings(e){this.renderer.settings=e}initialize(e){this.renderer.initialize(e),this.setupKeyboardShortcuts()}addComment(e,t,n=[]){return this.renderer.addComment(e,t,n)}clearComments(){this.renderer.clearComments()}resetState(){this.renderer.resetState()}destroy(){this.teardownKeyboardShortcuts(),this.renderer.destroy()}updateSettings(e){this.renderer.settings=e}getVideoElement(){return this.renderer.getVideoElement()}getCurrentVideoSource(){return this.renderer.getCurrentVideoSource()}getCommentsSnapshot(){return this.renderer.getCommentsSnapshot()}isNGComment(e){return this.renderer.isNGComment(e)}resize(e,t){this.renderer.resize(e,t)}setCommentVisibility(e){this.renderer.setCommentVisibility(e)}setupKeyboardShortcuts(){this.teardownKeyboardShortcuts();let e=new Oa;e.addShortcut(`C`,`Shift`,()=>{try{let e=!this.renderer.settings.isCommentVisible;this.renderer.setCommentVisibility(e),this.syncGlobalSettings(this.renderer.settings)}catch(e){ka.error(`CommentRenderer.keyboardShortcut`,e)}}),e.startListening(),this.keyboardHandler=e}teardownKeyboardShortcuts(){this.keyboardHandler?.stopListening(),this.keyboardHandler=null}syncGlobalSettings(e){(window.dAniRenderer?.settingsManager)?.updateSettings(e)}},Na=class{shadowRoot=null;container=null;createShadowDOM(e,t={mode:`closed`}){if(!e)throw Error(`Host element is required for shadow DOM creation`);return this.shadowRoot=e.attachShadow(t),this.container=document.createElement(`div`),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(e){if(!this.shadowRoot)throw Error(`Shadow root not initialized`);let t=document.createElement(`style`);t.textContent=e,this.shadowRoot.appendChild(t)}querySelector(e){return this.shadowRoot?this.shadowRoot.querySelector(e):null}querySelectorAll(e){return this.shadowRoot?this.shadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}setHTML(e){if(!this.container)throw Error(`Container not initialized`);this.container.innerHTML=e}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null}},Pa=`\r
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
justify-content: flex-end;\r
align-items: center;\r
gap: 12px;\r
margin-bottom: 16px;\r
}\r
\r
a.open-search-page-direct-btn {\r
background: var(--bg-primary);\r
color: var(--text-secondary);\r
border: 1px solid rgba(255, 255, 255, 0.1);\r
border-radius: 8px;\r
padding: 4px 10px;\r
font-size: 12px;\r
}\r
\r
a.open-search-page-direct-btn:hover {\r
background: rgba(127, 90, 240, 0.1);\r
color: var(--primary);\r
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
#searchButton, #saveSettings, #openSearchPageDirect {\r
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
#searchButton:hover, #saveSettings:hover, #openSearchPageDirect:hover {\r
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
`,Fa=`:host {
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
`,Ia=`:host {\r
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
`,La=class{static getCommonStyles(){return Pa}static getNotificationStyles(){return Fa}static getAutoButtonStyles(){return Ia}},Ra={success:`✔`,warning:`⚠`,error:`✖`,info:`ℹ`},U=class e extends Na{static instance=null;static notifications=[];hostElement=null;initialized=!1;static getInstance(){return this.instance||=new e,this.instance}static show(e,t=`info`,n=3e3){try{let r=this.getInstance();return r.initialize(),r.initialized?r.createNotification(e,t,n):null}catch(e){return console.error(`[NotificationManager] show failed`,e),null}}static removeNotification(e){this.getInstance().removeNotification(e.element)}show(t,n=`info`){e.show(t,n)}initialize(){if(!this.initialized)try{this.hostElement=document.createElement(`div`),this.hostElement.className=`nico-comment-shadow-host notification-host`,this.hostElement.style.cssText=[`position: fixed`,`top: 0`,`right: 0`,`z-index: 2147483647`,`pointer-events: none`].join(`;`),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(La.getNotificationStyles()),this.setHTML(`<div class="notification-container"></div>`),this.initialized=!0}catch(e){console.error(`[NotificationManager] initialize failed`,e),this.initialized=!1}}destroy(){e.notifications.forEach(e=>{e.timerId&&window.clearTimeout(e.timerId)}),e.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=!1,e.instance=null}createNotification(t,n,r){try{let i=this.querySelector(`.notification-container`);if(!i)throw Error(`Notification container not found`);let a=Ra[n]??Ra.info,o=document.createElement(`div`);o.className=`notification-item ${n}`;let s=document.createElement(`div`);s.className=`notification-icon`,s.innerHTML=`<span>${a}</span>`,o.appendChild(s);let c=document.createElement(`div`);c.className=`notification-content`;let l=document.createElement(`div`);l.className=`notification-type`,l.textContent=ha(n),c.appendChild(l);let u=document.createElement(`div`);u.className=`notification-message`,t.includes(`<`)?u.innerHTML=t||H(`noMessage`):u.innerHTML=(t||H(`noMessage`)).split(`
`).map(e=>e.trim()).filter(e=>e.length>0).join(`<br>`),c.appendChild(u),o.appendChild(c);let d=document.createElement(`button`);d.className=`notification-close`,d.innerHTML=`&times;`,d.addEventListener(`click`,()=>{this.removeNotification(o)}),o.appendChild(d),i.appendChild(o),requestAnimationFrame(()=>{o.classList.add(`show`)});let f={element:o,timerId:window.setTimeout(()=>{this.removeNotification(o)},r)};return e.notifications.push(f),f}catch(e){return console.error(`[NotificationManager] createNotification failed`,e),null}}removeNotification(t){if(!t)return;let n=e.notifications.find(e=>e.element===t);n?.timerId&&window.clearTimeout(n.timerId),t.classList.remove(`show`),window.setTimeout(()=>{try{t.remove(),e.notifications=e.notifications.filter(e=>e.element!==t)}catch(e){console.error(`[NotificationManager] removeNotification cleanup failed`,e)}},500)}},za=`https://www.nicovideo.jp`,Ba=`${za}/search`,Va=`${za}/watch`,Ha=`https://twitter.com`,Ua=`https://t.co`,Wa={base:za,searchBase:Ba,watchBase:Va},Ga=e=>`${Va}/${e}`,Ka=e=>`${Ba}/${encodeURIComponent(e)}`;`${Ha}`,`${Ua}`;var qa=e=>new Promise((t,n)=>{oa({url:e.url,method:e.method??`GET`,headers:e.headers,data:e.data,responseType:e.responseType??`text`,timeout:e.timeout,onprogress:e.onprogress,onload:e=>{t({status:e.status,statusText:e.statusText,response:e.response,finalUrl:e.finalUrl,headers:e.responseHeaders})},onerror:e=>{let t=e?.error??`unknown error`;n(Error(`GM_xmlhttpRequest failed: ${t}`))},ontimeout:()=>{n(Error(`GM_xmlhttpRequest timeout`))}})}),Ja=r(`dAnime:NicoApiFetcher`),W=class{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(e){try{let t=(await qa({method:`GET`,url:Ga(this.sanitizeVideoId(e)),headers:{Accept:`text/html`}})).response,n=new DOMParser().parseFromString(t,`text/html`).querySelector(`meta[name="server-response"]`);if(!n)throw Error(`API data element not found in response`);let r=n.getAttribute(`content`);if(!r)throw Error(`API data content is empty`);let i=this.decodeServerResponse(r),a=JSON.parse(i).data?.response;if(!a)throw Error(`Invalid API data structure`);return this.apiData=a,a}catch(e){throw Ja.error(`NicoApiFetcher.fetchApiData`,e),e}}async fetchComments(){try{if(!this.apiData)throw Error(`API data must be fetched first`);let e=this.apiData.comment?.nvComment;if(!e?.server||!e.params||!e.threadKey)throw Error(`Required comment server data is missing`);let t=await qa({method:`POST`,url:`${e.server}/v1/threads`,headers:{"Content-Type":`application/json`,"x-client-os-type":`others`,"X-Frontend-Id":`6`,"X-Frontend-Version":`0`},data:JSON.stringify({params:e.params,threadKey:e.threadKey,additionals:{}})}),n=(JSON.parse(t.response).data?.threads??[]).filter(e=>e.fork===`main`).sort((e,t)=>(t.commentCount||0)-(e.commentCount||0))[0];if(!n)throw Error(`Main thread not found in comment response`);let r=(n.comments??[]).map(e=>({text:e.body??``,vposMs:e.vposMs??0,commands:e.commands??[]}));return this.comments=r,r}catch(e){throw Ja.error(`NicoApiFetcher.fetchComments`,e),e}}async fetchAllData(e){return await this.fetchApiData(e),this.fetchComments()}sanitizeVideoId(e){try{let t=encodeURIComponent(e);return t=t.replace(/%([0-9A-F]{2})/gi,(e,t)=>{let n=parseInt(t,16);return n>=65&&n<=90||n>=97&&n<=122||n>=48&&n<=57||n===45||n===95||n===46||n===126?String.fromCharCode(n):e}),t}catch(t){return Ja.error(`NicoApiFetcher.sanitizeVideoId`,t,{videoId:e}),e}}decodeServerResponse(e){try{return decodeURIComponent(e)}catch(t){try{let t=e.replace(/%(?![0-9A-F]{2})/gi,`%25`);return decodeURIComponent(t)}catch{throw Error(`API data decode failed: ${t.message}`)}}}},Ya=r(`dAnime:NicoVideoSearcher`),Xa=`dアニメストア ニコニコ支店`,G=class e{cache=new Map;static isOfficialVideo(e,t){let n=e.owner?.nickname??e.owner?.name??e.channel?.name??``;return!!(n===Xa||n===t||n.startsWith(t+` `))}static filterOfficialVideos(t,n){return t.filter(t=>e.isOfficialVideo(t,n))}async search(e){if(!e.trim())return[];if(this.cache.has(e))return this.cache.get(e)??[];let t=Ka(e),n=await this.fetchText(t),r=this.parseServerContext(n).map(t=>{let n=this.calculateLevenshteinDistance(e,t.title),r=Math.max(e.length,t.title.length),i=r>0?(1-n/r)*100:0;return{...t,levenshteinDistance:n,similarity:i}}),i=[],a=new Set;for(let e of r)e?.videoId&&(a.has(e.videoId)||(a.add(e.videoId),i.push(e)));return i.sort((e,t)=>{if(e.commentCount!==t.commentCount)return t.commentCount-e.commentCount;let n=e.similarity??-1,r=t.similarity??-1;return n===r?t.viewCount-e.viewCount:r-n}),this.cache.set(e,i),i}async fetchText(e){return(await qa({method:`GET`,url:e})).response}parseServerContext(e){try{let t=new DOMParser().parseFromString(e,`text/html`).querySelector(`meta[name="server-response"]`);if(!t)return[];let n=t.getAttribute(`content`)??``,r=this.decodeHtmlEntities(n),i;try{i=JSON.parse(r)}catch(e){return Ya.error(`NicoVideoSearcher.parseServerContext`,e),[]}return this.extractVideoItems(i??{})}catch(e){return Ya.error(`NicoVideoSearcher.parseServerContext`,e),[]}}decodeHtmlEntities(e){if(!e)return``;let t=e.replace(/&quot;/g,`"`).replace(/&#39;/g,`'`).replace(/&amp;/g,`&`).replace(/&lt;/g,`<`).replace(/&gt;/g,`>`);return t=t.replace(/&#(\d+);/g,(e,t)=>String.fromCharCode(parseInt(t,10))),t=t.replace(/&#x([0-9a-fA-F]+);/g,(e,t)=>String.fromCharCode(parseInt(t,16))),t}extractVideoItems(e){let t=[],n=e=>{let n=(e?.id??e?.contentId??e?.watchId??``).toString();if(!n)return;let r=(e?.title??e?.shortTitle??``).toString(),i=e?.count??{},a=Number(i.view??e?.viewCounter??0)||0,o=Number(i.comment??e?.commentCounter??0)||0,s=Number(i.mylist??e?.mylistCounter??0)||0,c=e?.thumbnail??{},l=(c.nHdUrl||c.listingUrl||c.largeUrl||c.middleUrl||c.url||e?.thumbnailUrl||``).toString(),u=(e?.registeredAt||e?.startTime||e?.postedDateTime||``)?.toString?.()??``,d=e?.owner&&typeof e.owner==`object`?{nickname:(e.owner.nickname??e.owner.name??``)||void 0,name:(e.owner.name??e.owner.nickname??``)||void 0}:null,f=(e?.isChannelVideo||e?.owner?.ownerType===`channel`)&&e?.owner?{name:e.owner.name??``}:null;r&&t.push({videoId:n,title:r,viewCount:a,commentCount:o,mylistCount:s,thumbnail:l,postedAt:u,owner:d,channel:f})},r=e=>{if(!e)return;if(Array.isArray(e)){e.forEach(r);return}if(typeof e!=`object`||!e)return;let t=e;(t.id||t.contentId||t.watchId)&&n(t),Object.values(e).forEach(r)};return r(e),t}calculateLevenshteinDistance(e,t){let n=e?e.length:0,r=t?t.length:0;if(n===0)return r;if(r===0)return n;let i=Array(r+1);for(let e=0;e<=r;++e){let t=i[e]=Array(n+1);t[0]=e}let a=i[0];for(let e=1;e<=n;++e)a[e]=e;for(let a=1;a<=r;++a)for(let r=1;r<=n;++r){let n=e[r-1]===t[a-1]?0:1;i[a][r]=Math.min(i[a-1][r]+1,i[a][r-1]+1,i[a-1][r-1]+n)}return i[r][n]}},K={mypageHeaderTitle:`.p-mypageHeader__title`,mypageListContainer:`.p-mypageMain`,watchVideoElement:`video#video`,mypageItem:`.itemModule.list`,mypageItemTitle:`.line1`,mypageEpisodeNumber:`.number.line1 span`,mypageEpisodeTitle:`.episode.line1 span`,watchPageAnimeTitle:`.backInfoTxt1`,watchPageEpisodeNumber:`.backInfoTxt2`,watchPageEpisodeTitle:`.backInfoTxt3`,watchSettingButton:`.setting.mainButton`,watchButtonArea:`.buttonArea`},Za=class{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(e){this.delay=e}getFuncId(e){return this.funcIds.has(e)||this.funcIds.set(e,this.nextId++),this.funcIds.get(e)??0}exec(e){let t=this.getFuncId(e),n=Date.now(),r=this.timers.get(t)?.lastExec??0,i=n-r;if(i>this.delay)e(),this.timers.set(t,{lastExec:n});else{clearTimeout(this.timers.get(t)?.timerId??void 0);let n=setTimeout(()=>{e(),this.timers.set(t,{lastExec:Date.now()})},this.delay-i);this.timers.set(t,{timerId:n,lastExec:r})}}execOnce(e){let t=this.getFuncId(e),n=this.timers.get(t);if(n?.executedOnce){n.timerId&&clearTimeout(n.timerId);return}n?.timerId&&clearTimeout(n.timerId);let r=setTimeout(()=>{try{e()}finally{this.timers.set(t,{executedOnce:!0,lastExec:Date.now(),timerId:null})}},this.delay);this.timers.set(t,{timerId:r,executedOnce:!1,scheduled:!0})}cancel(e){let t=this.getFuncId(e),n=this.timers.get(t);n?.timerId&&clearTimeout(n.timerId),this.timers.delete(t)}resetExecution(e){let t=this.getFuncId(e),n=this.timers.get(t);n&&(n.timerId&&clearTimeout(n.timerId),this.timers.set(t,{executedOnce:!1,scheduled:!1}))}clearAll(){for(let[,e]of this.timers)e.timerId&&clearTimeout(e.timerId);this.timers.clear(),this.funcIds.clear()}},q=r(`dAnime:VideoEventLogger`),Qa=class{prefix;video=null;lastCurrentTime=0;eventListeners=new Map;isEnabled=!0;TRACKED_EVENTS=[`loadstart`,`loadedmetadata`,`loadeddata`,`canplay`,`canplaythrough`,`play`,`playing`,`pause`,`seeking`,`seeked`,`timeupdate`,`ended`,`emptied`,`stalled`,`suspend`,`waiting`,`error`,`abort`];constructor(e=``){this.prefix=e}enable(){this.isEnabled=!0,q.info(`${this.prefix}:enabled`)}disable(){this.isEnabled=!1,q.info(`${this.prefix}:disabled`)}attach(e){this.detach(),this.video=e,this.lastCurrentTime=e.currentTime,q.info(`${this.prefix}:attach`,{src:this.getVideoSource(e),duration:e.duration,currentTime:e.currentTime,readyState:e.readyState}),this.TRACKED_EVENTS.forEach(t=>{let n=()=>{this.handleEvent(t)};this.eventListeners.set(t,n),e.addEventListener(t,n)}),this.setupCurrentTimeWatcher()}detach(){this.video&&=(this.eventListeners.forEach((e,t)=>{this.video?.removeEventListener(t,e)}),this.eventListeners.clear(),q.info(`${this.prefix}:detach`,{src:this.getVideoSource(this.video),finalTime:this.video.currentTime}),null)}handleEvent(e){if(!this.isEnabled||!this.video)return;let t=this.video,n={event:e,currentTime:t.currentTime,duration:t.duration,readyState:t.readyState,paused:t.paused,ended:t.ended,src:this.getVideoSource(t),networkState:t.networkState,timestamp:Date.now()},r=Math.abs(t.currentTime-this.lastCurrentTime);if(e===`timeupdate`){r>.1&&(this.lastCurrentTime=t.currentTime);return}switch(r>.1?(q.info(`${this.prefix}:event:${e}`,{...n,timeDiff:r.toFixed(2),direction:t.currentTime>this.lastCurrentTime?`forward`:`backward`}),this.lastCurrentTime=t.currentTime):q.debug(`${this.prefix}:event:${e}`,n),e){case`error`:q.error(`${this.prefix}:videoError`,Error(`Video error detected`),{errorCode:t.error?.code??null,errorMessage:t.error?.message??null,...n});break;case`ended`:q.warn(`${this.prefix}:videoEnded`,{...n,message:`動画再生が終了しました`});break;case`emptied`:q.warn(`${this.prefix}:videoEmptied`,{...n,message:`動画要素が空になりました（src変更の可能性）`});break;case`seeking`:q.warn(`${this.prefix}:seeking`,{...n,from:this.lastCurrentTime,to:t.currentTime,diff:(t.currentTime-this.lastCurrentTime).toFixed(2)});break}}setupCurrentTimeWatcher(){if(!Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,`currentTime`)?.set){q.warn(`${this.prefix}:currentTimeWatcher:unsupported`);return}q.debug(`${this.prefix}:currentTimeWatcher:setup`)}logManualSeek(e,t,n){this.isEnabled&&q.warn(`${this.prefix}:manualSeek`,{from:e.toFixed(2),to:t.toFixed(2),diff:(t-e).toFixed(2),reason:n,stackTrace:Error().stack})}getVideoSource(e){let t=typeof e.currentSrc==`string`?e.currentSrc:``;if(t.length>0)return t.length>100?`${t.slice(0,100)}...`:t;let n=e.getAttribute(`src`)??``;return n.length>0?n.length>100?`${n.slice(0,100)}...`:n:null}},$a=null;function eo(){return $a||=new Qa(`global`),$a}var to=1e3,no=100,ro=30,io=1e4,ao=100,oo=/watch\/(?:([a-z]{2}))?(\d+)/gi,J=r(`dAnime:VideoSwitchHandler`),so=e=>{if(!e?.video)return null;let t=e.video.registeredAt,n=t?new Date(t).toLocaleString(`ja-JP`,{year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,hour12:!1}):void 0;return{videoId:e.video.id,title:e.video.title,viewCount:e.video.count?.view,mylistCount:e.video.count?.mylist,commentCount:e.video.count?.comment,postedAt:n,thumbnail:e.video.thumbnail?.url,owner:e.owner??null,channel:e.channel??null}},co=e=>{let t=[],n;for(;(n=oo.exec(e))!==null;){let[,e=``,r=``]=n;r&&t.push(`${e}${r}`)}return t},lo=class{renderer;fetcher;settingsManager;monitorInterval;nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=!1;debounce;videoEventLogger;constructor(e,t,n,r=to,i=no){this.renderer=e,this.fetcher=t,this.settingsManager=n,this.monitorInterval=r,this.debounce=new Za(i),this.videoEventLogger=new Qa(`VideoSwitchHandler`)}resetVideoSource(){J.info(`videoSwitch:resetVideoSource`,{previousSource:this.lastVideoSource,previousLastPreloadedCount:this.lastPreloadedComments?.length??0,previousPreloadedCount:this.preloadedComments?.length??0,previousNextVideoId:this.nextVideoId}),this.lastVideoSource=null,this.lastPreloadedComments=null,this.preloadedComments=null,this.nextVideoId=null}updateRenderer(e){J.info(`videoSwitch:updateRenderer`,{oldRendererExists:!!this.renderer,newRendererExists:!!e}),this.renderer=e}startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd()},this.monitorInterval)}stopMonitoring(){this.checkIntervalId&&=(window.clearInterval(this.checkIntervalId),null)}async onVideoSwitch(e){if(this.isSwitching){J.warn(`videoSwitch:alreadySwitching`,{timestamp:Date.now()});return}this.isSwitching=!0;try{J.warn(`videoSwitch:entry`,{videoElementProvided:!!e,currentRendererComments:this.renderer.getCommentsSnapshot().length,lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId,lastVideoSource:this.lastVideoSource,rendererVideoElement:this.renderer.getVideoElement()?`attached`:`detached`,rendererVideoSrc:this.renderer.getCurrentVideoSource(),sampleCurrentComments:this.renderer.getCommentsSnapshot().slice(0,3).map(e=>({text:e.text?.substring(0,30),vposMs:e.vposMs}))});let t=await this.resolveVideoElement(e)??null,n=this.preloadedComments??this.lastPreloadedComments??null,r=t?.dataset?.videoId??t?.getAttribute?.(`data-video-id`)??null,i=this.nextVideoId??r??this.lastVideoId;if(J.warn(`videoSwitch:videoIdResolution`,{videoId:i??null,nextVideoId:this.nextVideoId,elementId:r,lastVideoId:this.lastVideoId,hasBackupPreloaded:!!n,backupPreloadedCount:n?.length??0}),!t||!i&&!n){J.warn(`videoSwitch:earlyReturn`,{reason:t?`no videoId and no backup`:`no video element`,hasVideoElement:!!t,hasVideoId:!!i,hasBackupPreloaded:!!n}),this.handleMissingVideoInfo(n);return}J.warn(`videoSwitch:start`,{videoId:i??null,elementVideoId:t.dataset?.videoId??null,preloadedCount:n?.length??0,currentTime:t.currentTime,duration:t.duration,readyState:t.readyState,currentSrc:t.currentSrc,lastVideoSource:this.lastVideoSource}),U.show(H(`videoSwitchDetected`),`info`),this.videoEventLogger.attach(t),this.resetRendererState(t);let a=this.renderer.getVideoElement();if(a!==t&&t)J.debug(`videoSwitch:rebind`,{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof t.currentSrc==`string`&&t.currentSrc.length>0?t.currentSrc:t.getAttribute(`src`)??null}),this.renderer.initialize(t);else if(a===t&&t&&this.hasVideoSourceChanged(t))J.debug(`videoSwitch:rebind:sameElement`,{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(t)}),this.renderer.clearComments(),this.renderer.destroy(),this.renderer.initialize(t);else if(!a&&!t){J.warn(`videoSwitch:missingVideoElement`,{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let o=null;i&&(o=await this.fetchVideoApiData(i,n),o&&(this.persistVideoMetadata(o),this.lastVideoId=i));let s=await this.populateComments(i,n);s===0?(this.renderer.clearComments(),U.show(H(`commentsUnavailable`),`warning`),J.warn(`videoSwitch:commentsMissing`,{videoId:i??null})):J.warn(`videoSwitch:commentsLoaded`,{videoId:i??null,count:s}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(t);let c=this.renderer.getCommentsSnapshot();if(J.warn(`videoSwitch:complete`,{videoId:i??null,finalTime:t.currentTime,loadedCount:s,finalCommentsCount:c.length,rendererVideoSrc:this.renderer.getCurrentVideoSource(),sampleFinalComments:c.slice(0,5).map(e=>({text:e.text?.substring(0,30),vposMs:e.vposMs,vposSec:(e.vposMs/1e3).toFixed(2)}))}),o){let e=so(o);if(e){let t=V(`commentSourceUpdated`,{count:String(s),title:e.title??H(`unknownTitle`)});U.show(t,s>0?`success`:`warning`)}}}catch(e){J.error(`videoSwitch:error`,e,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),U.show(V(`videoSwitchError`,{message:e.message}),`error`),this.renderer.clearComments()}finally{this.isSwitching=!1}}async resolveVideoElement(e){if(e){let t=this.getVideoSource(e),n=this.lastVideoSource;return(!t||t===n)&&await this.waitForSourceChange(e),e}let t=Date.now()+io,n=null;for(;Date.now()<t;){let e=document.querySelector(K.watchVideoElement);if(e){n=e;let t=this.hasVideoSourceChanged(e);if(e.readyState>=2||!e.paused||t)return t&&(this.lastVideoSource=null),e}await new Promise(e=>window.setTimeout(e,ao))}return n}async waitForSourceChange(e){let t=this.getVideoSource(e);if(!t)return;let n=Date.now()+io;for(;Date.now()<n;){let n=this.getVideoSource(e);if(n&&n!==t){this.lastVideoSource=null;return}await new Promise(e=>window.setTimeout(e,ao))}}hasVideoSourceChanged(e){let t=this.getVideoSource(e);return t?this.lastVideoSource?this.lastVideoSource!==t:!0:!1}getVideoSource(e){if(!e)return null;let t=typeof e.currentSrc==`string`?e.currentSrc:``;if(t.length>0)return t;let n=e.getAttribute(`src`)??``;if(n.length>0)return n;let r=e.querySelector(`source[src]`);return r&&typeof r.src==`string`&&r.src.length>0?r.src:null}resetRendererState(e){let t=e.currentTime,n=this.getVideoSource(e),r=this.lastVideoSource!==n,i=this.renderer.getCommentsSnapshot().length;if(J.warn(`videoSwitch:resetRendererState:before`,{currentTime:t,duration:e.duration,src:n,lastSrc:this.lastVideoSource??null,sourceChanged:r,readyState:e.readyState,paused:e.paused,commentsCount:i}),r)try{this.videoEventLogger.logManualSeek(t,0,`resetRendererState: video source changed`),e.currentTime=0,J.warn(`videoSwitch:resetRendererState:seeked`,{currentTime:e.currentTime,timeDiff:e.currentTime-t})}catch(e){J.debug(`videoSwitch:resetCurrentTimeFailed`,e)}else J.warn(`videoSwitch:resetRendererState:skipSeek`,{reason:`same video source, skipping currentTime reset`,currentTime:t,willClearComments:!0});J.warn(`videoSwitch:resetRendererState:clearingComments`,{commentsBeforeClear:i,sourceChanged:r,currentVideoSrc:this.renderer.getCurrentVideoSource()}),this.renderer.clearComments(),J.warn(`videoSwitch:resetRendererState:commentsCleared`,{commentsAfterClear:this.renderer.getCommentsSnapshot().length,rendererVideoSrc:this.renderer.getCurrentVideoSource()})}async checkVideoEnd(){let e=this.renderer.getVideoElement();!e||!Number.isFinite(e.duration)||e.duration-e.currentTime>ro||(this.nextVideoId||this.debounce.execOnce(async()=>{await this.findNextVideoId()}),this.nextVideoId&&!this.preloadedComments&&this.debounce.execOnce(async()=>{await this.preloadComments()}))}handleMissingVideoInfo(e){J.warn(`videoSwitch:handleMissingVideoInfo`,{hasBackupPreloaded:!!e,backupPreloadedCount:e?.length??0,hasLastPreloadedComments:!!this.lastPreloadedComments,lastPreloadedCount:this.lastPreloadedComments?.length??0,willClearComments:!e&&!this.lastPreloadedComments}),!e&&!this.lastPreloadedComments?(J.warn(`videoSwitch:clearingCommentsInMissingInfo`,{currentCommentCount:this.renderer.getCommentsSnapshot().length}),this.renderer.clearComments(),U.show(H(`nextVideoCommentsUnavailableClear`),`warning`)):J.info(`videoSwitch:preservingComments`,{reason:`backup or last preloaded comments available`,currentCommentCount:this.renderer.getCommentsSnapshot().length})}async fetchVideoApiData(e,t){try{let t=await this.fetcher.fetchApiData(e);return J.debug(`videoSwitch:apiFetched`,{videoId:e}),t}catch(n){if(J.error(`videoSwitch:apiFetchError`,n,{videoId:e}),!t)throw n;return null}}persistVideoMetadata(e){let t=so(e);t&&this.settingsManager.saveVideoData(t.title??``,t)}async populateComments(e,t){let n=null;if(J.warn(`videoSwitch:populateComments:start`,{videoId:e,backupPreloadedCount:t?.length??0,hasBackupPreloaded:!!t}),Array.isArray(t)&&t.length>0)n=t,J.warn(`videoSwitch:populateComments:usingBackup`,{count:n.length});else if(e)try{J.warn(`videoSwitch:populateComments:fetching`,{videoId:e}),n=await this.fetcher.fetchAllData(e),J.warn(`videoSwitch:commentsFetched`,{videoId:e,count:n.length})}catch(t){J.error(`videoSwitch:commentsFetchError`,t,{videoId:e}),U.show(V(`commentFetchError`,{message:t.message}),`error`),n=null}if(!n||n.length===0)return J.warn(`videoSwitch:populateComments:noComments`),0;let r=n.filter(e=>!this.renderer.isNGComment(e.text));return J.warn(`videoSwitch:populateComments:addingToRenderer`,{filteredCount:r.length,totalCount:n.length,rendererCommentsBeforeAdd:this.renderer.getCommentsSnapshot().length,rendererVideoElement:this.renderer.getVideoElement()?`attached`:`detached`,rendererVideoSrc:this.renderer.getCurrentVideoSource()}),r.forEach((e,t)=>{this.renderer.addComment(e.text,e.vposMs,e.commands),t<3&&J.warn(`videoSwitch:populateComments:addedComment[${t}]`,{text:e.text.substring(0,30),vposMs:e.vposMs,vposSec:(e.vposMs/1e3).toFixed(2),commands:e.commands})}),J.warn(`videoSwitch:populateComments:complete`,{addedCount:r.length,rendererCommentsAfterAdd:this.renderer.getCommentsSnapshot().length,rendererVideoSrcAfterAdd:this.renderer.getCurrentVideoSource(),sampleComments:this.renderer.getCommentsSnapshot().slice(0,3).map(e=>({text:e.text?.substring(0,30),vposMs:e.vposMs}))}),this.lastPreloadedComments=[...r],r.length}async findNextVideoId(){try{let e=this.fetcher.lastApiData;if(!e)return;let t=e.series?.video?.next?.id;if(t){this.nextVideoId=t,J.debug(`videoSwitch:detectedNext`,{videoId:t});return}let n=e.video?.description??``;if(!n)return;let r=co(n);if(r.length===0)return;let i=[...r].sort((e,t)=>{let n=parseInt(e.replace(/^[a-z]{2}/i,``),10)||0;return(parseInt(t.replace(/^[a-z]{2}/i,``),10)||0)-n});this.nextVideoId=i[0]??null,this.nextVideoId&&J.debug(`videoSwitch:candidateFromDescription`,{candidate:this.nextVideoId})}catch(e){J.error(`videoSwitch:nextIdError`,e,{lastVideoId:this.lastVideoId})}}async preloadComments(){if(this.nextVideoId)try{let e=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(e=>!this.renderer.isNGComment(e.text));this.preloadedComments=e.length>0?e:null,J.debug(`videoSwitch:preloaded`,{videoId:this.nextVideoId,count:e.length})}catch(e){J.error(`videoSwitch:preloadError`,e,{videoId:this.nextVideoId}),this.preloadedComments=null}}},uo=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`,fo=class{static initialize(){aa(uo)}},po=`M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z`,mo=`M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z`,ho=`M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z`,go=`M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z`,_o=`M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z`,vo=`M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z`,yo=`M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z`,bo=`M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z`,xo=`M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z`,So=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z`,Co=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z`,wo=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z`,To=`M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z`,Eo=`M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z`,Do=`M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z`,Oo=`M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z`,ko=`M7,2V13H10V22L17,10H13L17,2H7Z`,Ao=`M5,4V7H10.5V19H13.5V7H19V4H5Z`,jo=`M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z`,Mo=`M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z`,No=`M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z`,Po=`M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z`,Fo=`M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z`,Io=`M8,5.14V19.14L19,12.14L8,5.14Z`,Lo=`M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z`,Ro=`M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z`,zo=`M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9`,Bo=`M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z`,Vo=`M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z`,Ho=`M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z`;function Y(e,t=24){return`<svg xmlns="http://www.w3.org/2000/svg" width="${String(t)}" height="${String(t)}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}Y(Do),Y(Eo),Y(Ho),Y(_o);var Uo=Y(Io);Y(Ro),Y(Po),Y(To),Y(ko);var Wo=Y(xo),Go=Y(Fo),Ko=Y(No),qo=Y(So),Jo=Y(Mo),Yo=Y(Ao),Xo=Y(po),Zo=Y(Oo),Qo=Y(wo),$o=Y(Lo),es=Y(vo),ts=Y(Co),ns=Y(Bo);Y(go),Y(yo),Y(bo),Y(ho),Y(mo);var rs=Y(jo),is=Y(Vo),as=Y(zo),X=r(`dAnime:SettingsUI`),Z={searchInput:`#searchInput`,searchAnimeTitle:`#searchAnimeTitle`,searchEpisodeNumber:`#searchEpisodeNumber`,searchEpisodeTitle:`#searchEpisodeTitle`,searchButton:`#searchButton`,openSearchPage:`#openSearchPageDirect`,searchResults:`#searchResults`,saveButton:`#saveSettings`,autoSearchToggle:`#autoSearchToggle`,autoSearchOptionRow:`#autoSearchOptionRow`,currentTitle:`#currentTitle`,currentVideoId:`#currentVideoId`,currentOwner:`#currentOwner`,currentViewCount:`#currentViewCount`,currentCommentCount:`#currentCommentCount`,currentMylistCount:`#currentMylistCount`,currentPostedAt:`#currentPostedAt`,currentThumbnail:`#currentThumbnail`,ngWords:`#ngWords`,ngRegexps:`#ngRegexps`,showNgWords:`#showNgWords`,showNgRegexps:`#showNgRegexp`,settingsModal:`#settingsModal`,closeSettingsModal:`#closeSettingsModal`,modalOverlay:`.settings-modal__overlay`,modalTabs:`.settings-modal__tab`,modalPane:`.settings-modal__pane`,searchModeToggle:`#searchModeToggle`,searchStructuredFields:`#searchStructuredFields`,searchFreeInputArea:`#searchFreeInputArea`},Q=[`search`,`ng`],os=`
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
`,ss=`
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
    width: 100%;
    box-sizing: border-box;
  }
  .search-field__input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.2);
  }
  .search-field__input::placeholder {
    color: var(--text-muted);
  }
  .search-free-input {
    margin-bottom: 16px;
  }

  /* 入力モード切り替えスイッチ */
  .search-mode-switch {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding: 6px 0;
  }
  .search-mode-switch__label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
    user-select: none;
    cursor: pointer;
  }
  .search-mode-switch__label--active {
    color: var(--text-primary);
  }
  .search-mode-switch__toggle {
    position: relative;
    width: 40px;
    height: 20px;
    flex-shrink: 0;
    cursor: pointer;
  }
  .search-mode-switch__toggle input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }
  .search-mode-switch__track {
    position: absolute;
    inset: 0;
    background: rgba(127, 90, 240, 0.4);
    border-radius: 10px;
    transition: background 0.2s;
    cursor: pointer;
  }
  .search-mode-switch__thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 14px;
    height: 14px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.2s;
    pointer-events: none;
  }
  .search-mode-switch__toggle input:checked ~ .search-mode-switch__track {
    background: rgba(127, 90, 240, 0.4);
  }
  .search-mode-switch__toggle input:checked ~ .search-mode-switch__thumb {
    transform: translateX(20px);
  }
  .search-mode-switch__toggle input:focus-visible ~ .search-mode-switch__track {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  /* info バッジ（自動検索トグル横） */
  .info-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    cursor: help;
    flex-shrink: 0;
    color: rgba(127, 90, 240, 0.7);
    border-radius: 50%;
    transition: color 0.2s;
  }
  .info-badge:hover,
  .info-badge:focus-visible {
    color: var(--primary);
  }
  .info-badge svg {
    width: 16px;
    height: 16px;
  }

  /* 盾バッジ（検索ページボタン横） */
  .shield-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    cursor: help;
    flex-shrink: 0;
    color: rgba(44, 182, 125, 0.7);
    border-radius: 6px;
    transition: color 0.2s, background 0.2s;
  }
  .shield-badge:hover,
  .shield-badge:focus-visible {
    color: #2CB67D;
    background: rgba(44, 182, 125, 0.1);
  }
  .shield-badge svg {
    width: 18px;
    height: 18px;
  }
`,cs=class e extends Na{static FAB_HOST_ID=`danime-settings-fab-host`;settingsManager;fetcher;searcher;settings;currentVideoInfo;hostElement=null;activeTab=`search`;modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;fabTooltipEl=null;autoSearchTooltipHtml=``;handleFabClick=e=>{e.preventDefault(),this.openSettingsModal()};handleOverlayClick=()=>{this.closeSettingsModal()};handleCloseClick=()=>{this.closeSettingsModal()};constructor(e,t=new W,n=new G){super(),this.settingsManager=e,this.fetcher=t,this.searcher=n,this.settings=this.settingsManager.getSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData()}insertIntoMypage(){let e=document.querySelector(K.mypageHeaderTitle);e&&(this.hostElement=this.createSettingsUI(),e.parentElement?.insertBefore(this.hostElement,e.nextSibling))}addAutoCommentButtons(){document.querySelectorAll(K.mypageItem).forEach(e=>{if(e.dataset.autoFillEnabled===`true`)return;let t=e.querySelector(K.mypageItemTitle),n=e.querySelector(K.mypageEpisodeNumber),r=e.querySelector(K.mypageEpisodeTitle);if(!t||!r)return;let i=t.textContent?.trim()??``,a=n?.textContent?.trim()??``,o=r.textContent?.trim()??``;if(!i)return;let s=document.createElement(`div`);s.style.marginTop=`8px`,s.style.display=`block`;let c=s.attachShadow({mode:`open`}),l=document.createElement(`style`);l.textContent=La.getAutoButtonStyles(),c.appendChild(l);let u=document.createElement(`button`);u.className=`auto-comment-button`,u.title=H(`autoFillSearchForm`),u.setAttribute(`aria-label`,H(`autoFillSearchForm`)),u.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,14H16L18,16V18H20V16L18,14V12H14M10,10H4V12H10M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H11.35C11.14,19.37 11,18.7 11,18A7,7 0 0,1 18,11C19.1,11 20.12,11.29 21,11.78V6M4,6H9.17L11.17,8H20V10H18V10.5C16.55,10.16 15,10.64 14,11.5V10H4M12,14H4V16H11.35C11.63,15.28 12.08,14.63 12.64,14.08L12,14Z" />
        </svg>
        <span style="margin-left: 6px; font-size: 12px; font-weight: 500;">${H(`formInput`)}</span>
      `,u.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),this.openSettingsModal(!1),this.queryModalElement(`${Z.modalTabs}[data-tab="search"]`)?.click();let t=this.queryModalElement(Z.searchAnimeTitle),n=this.queryModalElement(Z.searchEpisodeNumber),r=this.queryModalElement(Z.searchEpisodeTitle);t&&(t.value=i),n&&a&&(n.value=a),r&&o&&(r.value=o),t?.focus({preventScroll:!0});let s=[i];a&&s.push(a),o&&s.push(o),U.show(V(`searchFormFilled`,{keyword:s.join(` `)}),`success`)}),c.appendChild(u);let d=r.parentElement;if(d){let e=d.querySelector(`.iconContainer`);e?d.insertBefore(s,e):d.appendChild(s)}e.dataset.autoFillEnabled=`true`})}async waitMypageListStable(){}tryRestoreByDanimeIds(){return!1}createSettingsUI(){let e=document.createElement(`div`);e.className=`nico-comment-shadow-host settings-host`,this.createShadowDOM(e),this.addStyles(La.getCommonStyles());let t=this.buildSettingsHtml();return this.setHTML(t),this.applySettingsToUI(),this.addStyles(os),this.setupEventListeners(),e}buildSettingsHtml(){let e=e=>typeof e==`number`?e.toLocaleString():`-`,t=e=>{if(!e)return`-`;try{return new Date(e).toLocaleDateString(`ja-JP`,{year:`numeric`,month:`2-digit`,day:`2-digit`})}catch{return e}},n=this.currentVideoInfo,r=n?.thumbnail??``;return`
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="Version">${ia}</span>
        </h2>

        <!-- Cinematic Glass Card -->
        <div class="video-card${n?.videoId?``:` video-card--empty`}">
          <!-- 背景ブラー効果 -->
          <div
            class="video-card__ambient"
            id="currentVideoAmbient"
            style="background-image: url('${r}');"
          ></div>
          <div class="video-card__gradient"></div>

          <div class="video-card__body">
            <!-- サムネイル -->
            <div class="video-card__thumbnail">
              <img id="currentThumbnail" src="${r}" alt="${H(`thumbnail`)}">
            </div>

            <!-- 情報セクション -->
            <div class="video-card__info">
              <!-- 上部: ID & 日付 -->
              <div class="video-card__meta-row">
                <div class="video-card__id" title="${H(`videoId`)}">
                  <span class="video-card__id-icon" aria-hidden="true">${Jo}</span>
                  <span class="sr-only">${H(`videoId`)}</span>
                  <span id="currentVideoId">${n?.videoId??H(`currentVideoUnset`)}</span>
                </div>
                <div class="video-card__date" title="${H(`postedAt`)}">
                  <span class="video-card__date-icon" aria-hidden="true">${es}</span>
                  <span class="sr-only">${H(`postedAt`)}</span>
                  <span id="currentPostedAt">${t(n?.postedAt)}</span>
                </div>
              </div>

              <!-- 中央: タイトル & 投稿者 -->
              <div class="video-card__main">
                <h3 class="video-card__title" id="currentTitle">${n?.title??H(`currentVideoUnset`)}</h3>
                <div class="video-card__owner" title="${H(`videoOwner`)}">
                  <span class="video-card__owner-icon" aria-hidden="true">${Xo}</span>
                  <span class="sr-only">${H(`videoOwner`)}</span>
                  <span id="currentOwner">${n?.owner?.nickname??n?.channel?.name??`-`}</span>
                </div>
              </div>

              <!-- 下部: 統計情報 -->
              <div class="video-card__stats">
                <div class="video-card__stat" title="${H(`viewCountLong`)}">
                  <span class="video-card__stat-icon" aria-hidden="true">${Zo}</span>
                  <span class="sr-only">${H(`viewCountLong`)}</span>
                  <span class="video-card__stat-value" id="currentViewCount">${e(n?.viewCount)}</span>
                </div>
                <div class="video-card__stat" title="${H(`commentCountLong`)}">
                  <span class="video-card__stat-icon" aria-hidden="true">${Qo}</span>
                  <span class="sr-only">${H(`commentCountLong`)}</span>
                  <span class="video-card__stat-value" id="currentCommentCount">${e(n?.commentCount)}</span>
                </div>
                <div class="video-card__stat" title="${H(`mylistCountLong`)}">
                  <span class="video-card__stat-icon" aria-hidden="true">${$o}</span>
                  <span class="sr-only">${H(`mylistCountLong`)}</span>
                  <span class="video-card__stat-value" id="currentMylistCount">${e(n?.mylistCount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}buildModalHtml(){return`
      <div id="settingsModal" class="settings-modal hidden" role="dialog" aria-modal="true" aria-labelledby="settingsModalTitle" aria-hidden="true">
        <div class="settings-modal__overlay"></div>
        <div class="settings-modal__content">
          <header class="settings-modal__header">
            <h3 id="settingsModalTitle">${H(`settings`)}</h3>
            <button id="closeSettingsModal" class="settings-modal__close" type="button" aria-label="${H(`settingsClose`)}">
              <span aria-hidden="true">${Wo}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${qo}</span>
              <span class="settings-modal__tab-label">${H(`searchTab`)}</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${Ko}</span>
              <span class="settings-modal__tab-label">${H(`ngTab`)}</span>
            </button>
          </div>
          <div class="settings-modal__panes">
            <section class="settings-modal__pane is-active" data-pane="search" role="tabpanel" id="settingsPaneSearch" aria-labelledby="settingsTabSearch">
              <div class="setting-group search-section">
                <h3>${H(`searchVideoHeading`)}</h3>
                <div
                  class="playback-option${this.settings.autoSearchEnabled?` playback-option--active`:``}"
                  id="autoSearchOptionRow"
                  role="button"
                  tabindex="0"
                  aria-pressed="${this.settings.autoSearchEnabled?`true`:`false`}"
                  style="margin-bottom: 16px;"
                >
                  <div class="playback-option__icon-wrapper${this.settings.autoSearchEnabled?` playback-option__icon-wrapper--active`:``}">
                    ${is}
                  </div>
                  <div class="playback-option__text">
                    <span class="playback-option__title">${H(`autoSearch`)}</span>
                    <span class="playback-option__desc">${H(`autoSearchDescription`)}</span>
                  </div>
                  <div class="playback-option__toggle">
                    <input
                      type="checkbox"
                      id="autoSearchToggle"
                      class="playback-option__checkbox"
                      ${this.settings.autoSearchEnabled?`checked`:``}
                    >
                    <span class="playback-option__switch"></span>
                  </div>
                  <div class="info-badge" id="autoSearchInfoBadge" tabindex="0" aria-label="${H(`autoSearchInfo`)}">
                    ${rs}
                  </div>
                </div>

                <div class="search-mode-switch">
                  <span class="search-mode-switch__label search-mode-switch__label--active" id="searchModeLabelStructured">${H(`structuredInput`)}</span>
                  <label class="search-mode-switch__toggle" aria-label="${H(`searchInputModeToggle`)}">
                    <input type="checkbox" id="searchModeToggle" class="search-mode-switch__checkbox">
                    <span class="search-mode-switch__track"></span>
                    <span class="search-mode-switch__thumb"></span>
                  </label>
                  <span class="search-mode-switch__label" id="searchModeLabelFree">${H(`freeInput`)}</span>
                </div>

                <div class="search-fields" id="searchStructuredFields">
                  <div class="search-field">
                    <label for="searchAnimeTitle" class="search-field__label">${H(`animeTitle`)}</label>
                    <input type="text" id="searchAnimeTitle" class="search-field__input" placeholder="${H(`searchAnimePlaceholder`)}">
                  </div>
                  <div class="search-field-row">
                    <div class="search-field search-field--half">
                      <label for="searchEpisodeNumber" class="search-field__label">${H(`episodeNumber`)}</label>
                      <input type="text" id="searchEpisodeNumber" class="search-field__input" placeholder="${H(`searchEpisodeNumberPlaceholder`)}">
                    </div>
                    <div class="search-field search-field--half">
                      <label for="searchEpisodeTitle" class="search-field__label">${H(`episodeTitleOptional`)}</label>
                      <input type="text" id="searchEpisodeTitle" class="search-field__input" placeholder="${H(`searchEpisodeTitlePlaceholder`)}">
                    </div>
                  </div>
                </div>

                <div class="search-free-input" id="searchFreeInputArea" style="display:none;">
                  <div class="search-field">
                    <label for="searchInput" class="search-field__label">${H(`searchFreeword`)}</label>
                    <input type="text" id="searchInput" class="search-field__input" placeholder="${H(`manualSearchPlaceholder`)}">
                  </div>
                </div>

                <div class="search-container">
                  <button id="searchButton">${H(`search`)}</button>
                  <button id="openSearchPageDirect" class="open-search-page-direct-btn">${H(`searchPage`)}</button>
                  <div class="shield-badge" tabindex="0" aria-label="${H(`officialVideoSafeguardInfo`)}">
                    ${as}
                  </div>
                </div>
                <div id="searchResults" class="search-results"></div>
              </div>
            </section>
            <section class="settings-modal__pane" data-pane="ng" role="tabpanel" id="settingsPaneNg" aria-labelledby="settingsTabNg" aria-hidden="true">
              <div class="setting-group ng-settings">
                <div class="ng-settings__column" aria-labelledby="ngWordsTitle">
                  <h3 id="ngWordsTitle" class="ng-settings__title">${H(`ngWords`)}</h3>
                  <textarea class="ng-settings__textarea" id="ngWords" placeholder="${H(`ngWordsPlaceholder`)}">${(this.settings.ngWords??[]).join(`
`)}</textarea>
                </div>
                <div class="ng-settings__column" aria-labelledby="ngRegexTitle">
                  <h3 id="ngRegexTitle" class="ng-settings__title">${H(`ngRegex`)}</h3>
                  <textarea class="ng-settings__textarea" id="ngRegexps" placeholder="${H(`ngRegexPlaceholder`)}">${(this.settings.ngRegexps??[]).join(`
`)}</textarea>
                </div>
              </div>
            </section>
          </div>
          <footer class="settings-modal__footer">
            <button id="saveSettings" type="button">${H(`saveSettings`)}</button>
          </footer>
        </div>
      </div>
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupAutoSearchToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupTooltipBadges()}setupModalControls(){this.closeButtonElement?.removeEventListener(`click`,this.handleCloseClick),this.overlayElement?.removeEventListener(`click`,this.handleOverlayClick);let e=this.createOrUpdateFab(),t=this.queryModalElement(Z.settingsModal),n=this.queryModalElement(Z.closeSettingsModal),r=this.queryModalElement(Z.modalOverlay);this.modalElement=t??null,this.closeButtonElement=n??null,this.overlayElement=r??null,!(!t||!n||!r||!e)&&(this.fabElement?.removeEventListener(`click`,this.handleFabClick),e.addEventListener(`click`,this.handleFabClick),e.setAttribute(`aria-controls`,t.id),e.setAttribute(`aria-haspopup`,`dialog`),e.setAttribute(`aria-expanded`,`false`),this.fabElement=e,n.addEventListener(`click`,this.handleCloseClick),r.addEventListener(`click`,this.handleOverlayClick),this.shadowRoot?.addEventListener(`keydown`,e=>{let t=e;t.key===`Escape`&&!this.modalElement?.classList.contains(`hidden`)&&(t.preventDefault(),this.closeSettingsModal())}),this.applySettingsToUI())}setupModalTabs(){let e=Array.from(this.queryModalSelectorAll(Z.modalTabs)),t=Array.from(this.queryModalSelectorAll(Z.modalPane));if(e.length===0||t.length===0)return;let n=n=>{e.forEach(e=>{let t=this.toModalTabKey(e.dataset.tab)===n;e.classList.toggle(`is-active`,t),e.setAttribute(`aria-selected`,String(t)),e.setAttribute(`tabindex`,t?`0`:`-1`)}),t.forEach(e=>{let t=this.toModalTabKey(e.dataset.pane)===n;e.classList.toggle(`is-active`,t),e.setAttribute(`aria-hidden`,String(!t))}),this.activeTab=n};e.forEach(t=>{t.addEventListener(`click`,()=>{let e=this.toModalTabKey(t.dataset.tab);e&&n(e)}),t.addEventListener(`keydown`,r=>{let i=r;if(i.key!==`ArrowRight`&&i.key!==`ArrowLeft`)return;i.preventDefault();let a=this.toModalTabKey(t.dataset.tab);if(!a)return;let o=i.key===`ArrowRight`?1:-1,s=Q[(Q.indexOf(a)+o+Q.length)%Q.length];n(s),e.find(e=>this.toModalTabKey(e.dataset.tab)===s)?.focus({preventScroll:!0})})}),n(this.activeTab)}openSettingsModal(e=!0){!this.modalElement||!this.fabElement||(this.modalElement.classList.remove(`hidden`),this.modalElement.setAttribute(`aria-hidden`,`false`),this.fabElement.setAttribute(`aria-expanded`,`true`),e&&this.queryModalElement(`${Z.modalTabs}.is-active`)?.focus({preventScroll:!0}))}closeSettingsModal(){!this.modalElement||!this.fabElement||(this.modalElement.classList.add(`hidden`),this.modalElement.setAttribute(`aria-hidden`,`true`),this.fabElement.setAttribute(`aria-expanded`,`false`),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:!0}))}toModalTabKey(e){return e&&Q.includes(e)?e:null}setupAutoSearchToggle(){let e=this.queryModalElement(Z.autoSearchToggle),t=this.queryModalElement(Z.autoSearchOptionRow);if(!e||!t)return;let n=()=>{this.settings.autoSearchEnabled=!this.settings.autoSearchEnabled,this.updateAutoSearchToggleState(),this.updateSearchSectionNote(),this.settingsManager.updateSettings(this.settings),U.show(this.settings.autoSearchEnabled?H(`autoSearchEnabled`):H(`autoSearchDisabledManual`),`success`)};t.addEventListener(`click`,e=>{e.target.closest(`.playback-option__toggle`)||n()}),t.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),n())}),e.addEventListener(`change`,()=>{n()}),this.updateAutoSearchToggleState()}updateAutoSearchToggleState(){let e=this.settings.autoSearchEnabled,t=this.queryModalElement(Z.autoSearchToggle),n=this.queryModalElement(Z.autoSearchOptionRow),r=n?.querySelector(`.playback-option__icon-wrapper`);t&&(t.checked=e),n&&(n.classList.toggle(`playback-option--active`,e),n.setAttribute(`aria-pressed`,e?`true`:`false`)),r&&r.classList.toggle(`playback-option__icon-wrapper--active`,e)}buildAutoSearchTooltipHtml(){return this.settings.autoSearchEnabled?`<strong style="color:#7F5AF0;">自動設定機能が有効です</strong><br>
        視聴ページを開くと、アニメタイトル・話数・エピソードタイトルから自動的にコメント数が最も多いニコニコ動画を検索して表示します。<br>
        手動で検索したい場合は、自動検索スイッチを無効にしてください。`:`<strong style="color:#2CB67D;">手動設定モードです</strong><br>
        自動検索が無効になっています。以下のフォームから動画を検索して選択してください。<br>
        自動検索を有効にするには自動検索スイッチを有効にしてください。`}updateSearchSectionNote(){this.autoSearchTooltipHtml=this.buildAutoSearchTooltipHtml();let e=this.queryModalElement(`#autoSearchInfoBadge`);e&&(e.style.color=this.settings.autoSearchEnabled?`rgba(127, 90, 240, 0.7)`:`rgba(44, 182, 125, 0.7)`)}ensureFabTooltip(){if(this.fabTooltipEl?.isConnected)return;let e=this.fabShadowRoot;if(!e)return;if(!e.querySelector(`style[data-role='fab-tooltip-style']`)){let t=document.createElement(`style`);t.dataset.role=`fab-tooltip-style`,t.textContent=`
        .fab-floating-tooltip {
          position: fixed;
          z-index: 2147483647;
          width: 300px;
          background: rgba(14, 14, 28, 0.98);
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 12px;
          font-family: sans-serif;
          color: rgba(200, 210, 255, 0.85);
          line-height: 1.6;
          box-shadow: 0 4px 20px rgba(0,0,0,0.7);
          pointer-events: none;
          white-space: normal;
          text-align: left;
          display: none;
          writing-mode: horizontal-tb;
          direction: ltr;
        }
        .fab-floating-tooltip--info {
          border: 1px solid rgba(127, 90, 240, 0.5);
        }
        .fab-floating-tooltip--shield {
          border: 1px solid rgba(44, 182, 125, 0.5);
        }
        .fab-floating-tooltip strong {
          display: inline;
        }
      `,e.appendChild(t)}let t=document.createElement(`div`);t.className=`fab-floating-tooltip`,e.appendChild(t),this.fabTooltipEl=t}showFabTooltip(e,t,n){this.ensureFabTooltip();let r=this.fabTooltipEl;if(!r)return;let i=e.getBoundingClientRect();r.innerHTML=t,r.className=`fab-floating-tooltip fab-floating-tooltip--${n}`,r.style.display=`block`,r.style.width=`300px`;let a=i.right-300;a<8&&(a=8),a+300>window.innerWidth-8&&(a=window.innerWidth-300-8),r.style.left=`${a}px`,r.style.top=`0px`,requestAnimationFrame(()=>{if(r.style.display===`none`)return;let e=r.offsetHeight,t=i.top-8,n=window.innerHeight-i.bottom-8,a;a=t>=e?i.top-e-8:n>=e?i.bottom+8:Math.max(8,i.top-e-8),r.style.top=`${a}px`})}hideFabTooltip(){this.fabTooltipEl&&(this.fabTooltipEl.style.display=`none`)}shieldTooltipHtml=`<strong>公式動画セーフガード有効</strong><br>アニメタイトルを入力すると、投稿者名が「アニメタイトル」「アニメタイトル 第Nクール」「dアニメストア ニコニコ支店」の公式動画のみが優先表示されます。エピソード切替時も公式動画のみが自動選択されます。`;setupTooltipBadges(){let e=this.queryModalElement(`#autoSearchInfoBadge`),t=this.queryModalElement(`.shield-badge`);e&&(e.addEventListener(`mouseenter`,()=>{this.showFabTooltip(e,this.autoSearchTooltipHtml,`info`)}),e.addEventListener(`mouseleave`,()=>this.hideFabTooltip()),e.addEventListener(`focusin`,()=>{this.showFabTooltip(e,this.autoSearchTooltipHtml,`info`)}),e.addEventListener(`focusout`,()=>this.hideFabTooltip())),t&&(t.addEventListener(`mouseenter`,()=>{this.showFabTooltip(t,this.shieldTooltipHtml,`shield`)}),t.addEventListener(`mouseleave`,()=>this.hideFabTooltip()),t.addEventListener(`focusin`,()=>{this.showFabTooltip(t,this.shieldTooltipHtml,`shield`)}),t.addEventListener(`focusout`,()=>this.hideFabTooltip()))}setupNgControls(){let e=this.queryModalElement(Z.ngWords);e&&e.classList.remove(`hidden`);let t=this.queryModalElement(Z.ngRegexps);t&&t.classList.remove(`hidden`)}setupSaveButton(){let e=this.queryModalElement(Z.saveButton);e&&e.addEventListener(`click`,()=>this.saveSettings())}setupSearch(){let e=this.queryModalElement(Z.searchInput),t=this.queryModalElement(Z.searchAnimeTitle),n=this.queryModalElement(Z.searchEpisodeNumber),r=this.queryModalElement(Z.searchEpisodeTitle),a=this.queryModalElement(Z.searchButton),o=this.queryModalElement(Z.openSearchPage),s=this.queryModalElement(Z.searchModeToggle),c=this.settingsManager.loadManualSearchSettings();c&&(t&&(t.value=c.animeTitle),n&&(n.value=c.episodeNumber),r&&(r.value=c.episodeTitle));let l=()=>{let e=s?.checked??!1,t=this.queryModalElement(`#searchModeLabelStructured`),n=this.queryModalElement(`#searchModeLabelFree`);t&&t.classList.toggle(`search-mode-switch__label--active`,!e),n&&n.classList.toggle(`search-mode-switch__label--active`,e)},u=()=>{let e=s?.checked??!1,t=this.queryModalElement(Z.searchStructuredFields),n=this.queryModalElement(Z.searchFreeInputArea);t&&(t.style.display=e?`none`:``),n&&(n.style.display=e?``:`none`),l()};s?.addEventListener(`change`,u),u();let d=()=>s?.checked??!1,f=()=>d()?e?.value.trim()??``:[t?.value.trim()??``,n?.value.trim()??``,r?.value.trim()??``].filter(Boolean).join(` `),p=()=>{if(d())return;let e=t?.value.trim()??``,i=n?.value.trim()??``,a=r?.value.trim()??``;(e||i)&&this.settingsManager.saveManualSearchSettings({animeTitle:e,episodeNumber:i,episodeTitle:a})},m=async()=>{let e=f();if(!e){U.show(H(`searchKeywordRequired`),`warning`);return}p();let n=d()?``:t?.value.trim()??``;await this.executeSearch(e,n)};a?.addEventListener(`click`,m);let h=e=>{e.key===`Enter`&&m()};e?.addEventListener(`keydown`,h),t?.addEventListener(`keydown`,h),n?.addEventListener(`keydown`,h),r?.addEventListener(`keydown`,h),o?.addEventListener(`click`,e=>{e.preventDefault();let t=f(),n=t?Ka(t):Wa.searchBase;i().open(n,`_blank`,`noopener`)})}async executeSearch(e,t){try{U.show(V(`searchingKeyword`,{keyword:e}),`info`);let n=await this.searcher.search(e),r=n;if(t){let e=G.filterOfficialVideos(n,t);e.length>0?(r=e,X.info(`SettingsUI.executeSearch:officialFiltered`,{totalResults:n.length,officialResults:e.length,animeTitle:t})):(X.warn(`SettingsUI.executeSearch:noOfficialVideos`,{totalResults:n.length,animeTitle:t}),U.show(H(`officialVideoMissing`),`warning`))}return this.renderSearchResults(r,e=>this.renderSearchResultItem(e)),r.length===0&&U.show(H(`searchNoResults`),`warning`),r}catch(e){return X.error(`SettingsUI.executeSearch`,e),[]}}setSearchKeyword(e){let t=this.queryModalElement(Z.searchInput);t&&(t.value=e,t.focus({preventScroll:!0}))}renderSearchResults(e,t){let n=this.queryModalElement(Z.searchResults);n&&(n.innerHTML=e.map(e=>t(e)).join(``),n.querySelectorAll(`.search-result-item`).forEach((t,n)=>{t.addEventListener(`click`,()=>{let t=e[n];this.applySearchResult(t)});let r=t.querySelector(`.open-search-page-direct-btn`);r&&r.addEventListener(`click`,e=>{e.stopPropagation()})}))}renderSearchResultItem(e){let t=this.formatSearchResultDate(e.postedAt),n=typeof e.similarity==`number`?`
          <div class="similarity-container" title="${V(`similarity`,{score:e.similarity.toFixed(2)})}">
            <div class="similarity-bar" style="width: ${e.similarity.toFixed(2)}%;"></div>
            <span class="similarity-text">${e.similarity.toFixed(0)}%</span>
          </div>
        `:``;return`
      <div class="search-result-item">
        <img src="${e.thumbnail}" alt="thumbnail">
        <div class="search-result-info">
          <div class="title">${e.title}</div>
          <div class="stats">
            <span class="stat-icon" title="${H(`viewCount`)}">
              ${Uo}
            </span>
            <span>${e.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="${H(`commentCount`)}">
              ${ts}
            </span>
            <span>${e.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="${H(`mylistCount`)}">
              ${ns}
            </span>
            <span>${e.mylistCount.toLocaleString()}</span>
            ${n}
          </div>
          <div class="date">${t}</div>
          <a href="${Wa.watchBase}/${e.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(e){try{let t=await this.fetcher.fetchApiData(e.videoId);await this.fetcher.fetchComments(),U.show(V(`commentsSet`,{title:e.title}),`success`),this.updateCurrentVideoInfo(this.buildVideoMetadata(e,t))}catch(e){X.error(`SettingsUI.applySearchResult`,e)}}buildVideoMetadata(e,t){return{videoId:e.videoId,title:e.title,viewCount:t.video?.count?.view??e.viewCount,commentCount:t.video?.count?.comment??e.commentCount,mylistCount:t.video?.count?.mylist??e.mylistCount,postedAt:t.video?.registeredAt??e.postedAt,thumbnail:t.video?.thumbnail?.url??e.thumbnail,owner:t.owner??e.owner??void 0,channel:t.channel??e.channel??void 0}}applySettingsToUI(){let e=this.queryModalElement(Z.ngWords),t=this.queryModalElement(Z.ngRegexps);e&&(e.value=(this.settings.ngWords??[]).join(`
`)),t&&(t.value=(this.settings.ngRegexps??[]).join(`
`)),this.updateAutoSearchToggleState(),this.updateSearchSectionNote()}saveSettings(){let e=this.queryModalElement(Z.ngWords),t=this.queryModalElement(Z.ngRegexps);e&&(this.settings.ngWords=e.value.split(`
`).map(e=>e.trim()).filter(Boolean)),t&&(this.settings.ngRegexps=t.value.split(`
`).map(e=>e.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings),U.show(H(`settingsSaved`),`success`)}updateCurrentVideoInfo(e){this.currentVideoInfo=e,[[`currentTitle`,e.title??`-`],[`currentVideoId`,e.videoId??`-`],[`currentOwner`,e.owner?.nickname??e.channel?.name??`-`],[`currentViewCount`,this.formatNumber(e.viewCount)],[`currentCommentCount`,this.formatNumber(e.commentCount)],[`currentMylistCount`,this.formatNumber(e.mylistCount)],[`currentPostedAt`,this.formatSearchResultDate(e.postedAt)]].forEach(([e,t])=>{let n=this.querySelector(Z[e]);n&&(n.textContent=t)});let t=this.querySelector(Z.currentThumbnail);t&&e.thumbnail&&(t.src=e.thumbnail,t.alt=e.title??H(`thumbnail`));let n=this.querySelector(`#currentVideoAmbient`);n&&e.thumbnail&&(n.style.backgroundImage=`url('${e.thumbnail}')`);let r=this.querySelector(`.video-card`);r&&r.classList.toggle(`video-card--empty`,!e.videoId);try{this.settingsManager.saveVideoData(e.title??``,e)}catch(e){X.error(`SettingsUI.updateCurrentVideoInfo`,e)}}formatNumber(e){return typeof e==`number`?e.toLocaleString():`-`}formatSearchResultDate(e){if(!e)return`-`;let t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(`ja-JP`,{year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,hourCycle:`h23`}).format(t)}destroy(){this.hideFabTooltip(),this.fabTooltipEl=null,this.closeButtonElement?.removeEventListener(`click`,this.handleCloseClick),this.overlayElement?.removeEventListener(`click`,this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),super.destroy()}createOrUpdateFab(){if(!document.body)return null;let t=this.fabHostElement;!t||!t.isConnected?(t?.remove(),t=document.createElement(`div`),t.id=e.FAB_HOST_ID,t.style.position=`fixed`,t.style.bottom=`32px`,t.style.right=`32px`,t.style.zIndex=`2147483646`,t.style.display=`inline-block`,this.fabShadowRoot=t.attachShadow({mode:`open`}),document.body.appendChild(t),this.fabHostElement=t):this.fabShadowRoot||=t.shadowRoot??t.attachShadow({mode:`open`});let n=this.fabShadowRoot;if(!n)return null;let r=n.querySelector(`style[data-role='fab-base-style']`);r||(r=document.createElement(`style`),r.dataset.role=`fab-base-style`,r.textContent=La.getCommonStyles(),n.appendChild(r));let i=n.querySelector(`style[data-role='fab-style']`);i||(i=document.createElement(`style`),i.dataset.role=`fab-style`,i.textContent=`
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
      `,n.appendChild(i));let a=n.querySelector(`style[data-role='similarity-style']`);a||(a=document.createElement(`style`),a.dataset.role=`similarity-style`,a.textContent=os,n.appendChild(a));let o=n.querySelector(`style[data-role='search-fields-style']`);o||(o=document.createElement(`style`),o.dataset.role=`search-fields-style`,o.textContent=ss,n.appendChild(o));let s=n.querySelector(`.fab-container`);s||(s=document.createElement(`div`),s.className=`fab-container`,n.appendChild(s));let c=s.querySelector(`button.fab-button`);c||(c=document.createElement(`button`),c.type=`button`,c.className=`fab-button`,s.appendChild(c)),c.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${qo}</span>
      <span class="fab-button__label">${H(`settings`)}</span>
    `,c.setAttribute(`aria-label`,H(`settingsFabLabel`)),c.setAttribute(`aria-haspopup`,`dialog`);let l=s.querySelector(Z.settingsModal);return l||=(s.insertAdjacentHTML(`beforeend`,this.buildModalHtml()),s.querySelector(Z.settingsModal)),this.modalElement=l??null,c}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener(`click`,this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null,this.fabTooltipEl=null}queryModalElement(e){return this.fabShadowRoot?this.fabShadowRoot.querySelector(e):null}queryModalSelectorAll(e){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}},ls=r(`dAnime:PlaybackRateController`),us=1,ds=200,fs=1e-4,ps=class{settingsManager;currentVideo=null;playbackSettings;settingsObserver;isApplying=!1;retryTimer=null;handleLoadedMetadata=()=>{this.applyCurrentMode()};handleRateChange=()=>{this.isApplying||this.playbackSettings.fixedModeEnabled&&this.scheduleApply()};handlePlay=()=>{this.applyCurrentMode()};handleEmptied=()=>{this.scheduleApply()};constructor(e){this.settingsManager=e,this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.settingsObserver=e=>{this.playbackSettings=e,this.applyCurrentMode()},this.settingsManager.addPlaybackObserver(this.settingsObserver)}bind(e){if(this.currentVideo===e){this.applyCurrentMode();return}this.detachVideoListeners(),this.cancelScheduledApply(),this.currentVideo=e,this.attachVideoListeners(e),this.applyCurrentMode()}unbind(){this.cancelScheduledApply(),this.detachVideoListeners(),this.currentVideo=null}dispose(){this.unbind(),this.settingsManager.removePlaybackObserver(this.settingsObserver)}attachVideoListeners(e){e.addEventListener(`loadedmetadata`,this.handleLoadedMetadata),e.addEventListener(`ratechange`,this.handleRateChange),e.addEventListener(`play`,this.handlePlay),e.addEventListener(`emptied`,this.handleEmptied)}detachVideoListeners(){this.currentVideo&&(this.currentVideo.removeEventListener(`loadedmetadata`,this.handleLoadedMetadata),this.currentVideo.removeEventListener(`ratechange`,this.handleRateChange),this.currentVideo.removeEventListener(`play`,this.handlePlay),this.currentVideo.removeEventListener(`emptied`,this.handleEmptied))}applyCurrentMode(){let e=this.currentVideo;e&&(this.playbackSettings.fixedModeEnabled?this.setPlaybackRate(e,this.playbackSettings.fixedRate):this.setPlaybackRate(e,us))}setPlaybackRate(e,t){if(!(!Number.isFinite(t)||t<=0)&&!(Math.abs(e.playbackRate-t)<=fs)){this.isApplying=!0;try{e.playbackRate=t}catch(e){ls.warn(`再生速度の設定に失敗しました`,e),this.scheduleApply()}finally{window.setTimeout(()=>{this.isApplying=!1},0)}}}scheduleApply(){this.cancelScheduledApply(),this.retryTimer=window.setTimeout(()=>{this.retryTimer=null,this.applyCurrentMode()},ds)}cancelScheduledApply(){this.retryTimer!==null&&(window.clearTimeout(this.retryTimer),this.retryTimer=null)}},ms=async()=>{},hs=()=>{let e=i();if(!e.dAniRenderer){let t={};e.dAniRenderer={classes:{Comment:qn,CommentRenderer:Ma,NicoApiFetcher:W,NotificationManager:U,StyleManager:fo,SettingsUI:cs,NicoVideoSearcher:G,VideoSwitchHandler:lo,SettingsManager:wa,KeyboardShortcutHandler:Oa,DebounceExecutor:Za,ShadowDOMComponent:Na,ShadowStyleManager:La,PlaybackRateController:ps},instances:t,utils:{initialize:ms,initializeWithVideo:ms},debug:{showState:()=>{console.log(`Current instances:`,t)},showSettings:()=>{let e=t.settingsManager;if(!e){console.log(`SettingsManager not initialized`);return}console.log(`Current settings:`,e.getSettings())},showComments:()=>{let e=t.renderer;if(!e){console.log(`CommentRenderer not initialized`);return}console.log(`Current comments:`,e.getCommentsSnapshot())}},defaultSettings:R}}return e.dAniRenderer},gs=r(`dAnime:PlayerControlButton`),_s=`danime-pcb-host`,vs=100,ys=150,bs=class{settingsManager;btnWrapper=null;panelShadowRoot=null;isOpen=!1;mountRetryTimer=null;mouseHideTimer=null;settingsObserver=null;playbackObserver=null;constructor(e){this.settingsManager=e}mount(){if(document.getElementById(_s))return;let e=document.querySelector(K.watchSettingButton);if(!e){this.mountRetryTimer=window.setTimeout(()=>{this.mount()},vs);return}this.injectButton(e),gs.info(`playerControlButton:mounted`)}destroy(){this.mountRetryTimer!==null&&(window.clearTimeout(this.mountRetryTimer),this.mountRetryTimer=null),this.cancelHideTimer(),this.settingsObserver&&=(this.settingsManager.removeObserver(this.settingsObserver),null),this.playbackObserver&&=(this.settingsManager.removePlaybackObserver(this.playbackObserver),null),this.closePanel(),this.btnWrapper?.remove(),this.btnWrapper=null,this.panelShadowRoot=null,gs.info(`playerControlButton:destroyed`)}injectButton(e){let t=document.createElement(`div`);t.id=_s,t.className=`mainButton`,t.style.cssText=`position:relative;z-index:500;cursor:pointer`;let n=document.createElement(`button`);n.type=`button`,n.title=H(`commentSettings`),n.setAttribute(`aria-label`,H(`commentSettingsPanel`)),n.setAttribute(`aria-expanded`,`false`),n.style.cssText=[`width:100%`,`height:100%`,`background:transparent`,`border:none`,`cursor:pointer`,`padding:0`,`display:flex`,`align-items:center`,`justify-content:center`,`color:#ffffff`].join(`;`),n.innerHTML=Go;let r=document.createElement(`div`),i=r.attachShadow({mode:`open`});this.panelShadowRoot=i,t.appendChild(n),t.appendChild(r),e.insertAdjacentElement(`beforebegin`,t),this.btnWrapper=t,this.buildPanel(i),t.addEventListener(`mouseenter`,()=>{this.cancelHideTimer(),this.openPanel()}),t.addEventListener(`mouseleave`,()=>{this.scheduleHide()}),this.registerObservers()}buildPanel(e){let t=this.settingsManager.getSettings(),n=this.settingsManager.getPlaybackSettings(),r=document.createElement(`style`);r.textContent=this.getPanelCSS(),e.appendChild(r);let i=document.createElement(`div`);i.className=`panel`,i.setAttribute(`hidden`,``),i.setAttribute(`role`,`dialog`),i.setAttribute(`aria-label`,H(`commentSettings`)),i.innerHTML=this.buildPanelHTML(t,n),e.appendChild(i),i.addEventListener(`mouseenter`,()=>{this.cancelHideTimer()}),i.addEventListener(`mouseleave`,()=>{this.scheduleHide()}),this.bindPanelEvents(e)}getPanelCSS(){return`
      :host {
        display: block;
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 260px;
        z-index: 300;
        pointer-events: none;
        writing-mode: horizontal-tb;
        direction: ltr;
      }
      .panel {
        pointer-events: auto;
        background: rgba(18, 20, 46, 0.97);
        color: #e8eaff;
        font: 12px/1.6 sans-serif;
        font-family: sans-serif;
        padding: 12px 14px;
        border-radius: 10px 10px 0 10px;
        border: 1px solid rgba(80, 110, 220, 0.7);
        box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.8);
        box-sizing: border-box;
        width: 260px;
        writing-mode: horizontal-tb;
        direction: ltr;
      }
      .panel[hidden] { display: none; }
      .panel__title {
        font-size: 11px;
        font-weight: 700;
        color: rgba(200, 210, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0 0 10px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(80, 110, 220, 0.3);
        white-space: nowrap;
      }
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 0;
      }
      .row + .row { border-top: 1px solid rgba(255, 255, 255, 0.06); }
      .row__label {
        font-size: 12px;
        color: #c8d0ff;
        display: flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .row__label svg { opacity: 0.7; flex-shrink: 0; }
      .row--stacked {
        flex-direction: column;
        align-items: stretch;
        gap: 3px;
      }
      .row--stacked .slider-wrap {
        margin-left: 0;
      }
      .toggle {
        position: relative;
        width: 36px;
        height: 20px;
        flex-shrink: 0;
      }
      .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }
      .toggle__track {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 10px;
        transition: background 0.2s;
        cursor: pointer;
      }
      .toggle__thumb {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 14px;
        height: 14px;
        background: #fff;
        border-radius: 50%;
        transition: transform 0.2s;
        pointer-events: none;
      }
      .toggle input:checked ~ .toggle__track { background: #7F5AF0; }
      .toggle input:checked ~ .toggle__thumb { transform: translateX(16px); }
      .toggle input:focus-visible ~ .toggle__track {
        outline: 2px solid #7F5AF0;
        outline-offset: 2px;
      }
      .color-picker {
        width: 28px;
        height: 22px;
        padding: 0;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        cursor: pointer;
        background: none;
      }
      .slider-wrap {
        flex: 1;
        margin-left: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .slider {
        flex: 1;
        -webkit-appearance: none;
        appearance: none;
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.2);
        outline: none;
        cursor: pointer;
      }
      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #7F5AF0;
        cursor: pointer;
      }
      .slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: none;
        background: #7F5AF0;
        cursor: pointer;
      }
      .slider:disabled { opacity: 0.35; cursor: not-allowed; }
      .slider:disabled::-webkit-slider-thumb { cursor: not-allowed; }
      .slider:disabled::-moz-range-thumb { cursor: not-allowed; }
      .slider__value {
        font-size: 11px;
        color: rgba(200, 210, 255, 0.8);
        min-width: 34px;
        text-align: right;
        white-space: nowrap;
      }
      .section-title {
        font-size: 10px;
        color: rgba(200, 210, 255, 0.5);
        margin: 8px 0 2px;
        padding-top: 8px;
        border-top: 1px solid rgba(80, 110, 220, 0.2);
      }
      .speed-range-row {
        padding: 4px 0 2px;
        display: flex;
        align-items: center;
      }
      .speed-range-row .slider-wrap { margin-left: 0; }
    `}buildPanelHTML(e,t){let n=e.isCommentVisible?qo:Ko,r=Math.round((e.commentOpacity??1)*100),i=t.fixedRate.toFixed(2),a=t.fixedModeEnabled?``:`disabled`;return`
      <p class="panel__title">${H(`commentSettings`)}</p>

      <div class="row">
        <span class="row__label">
          <span id="pcb-vis-icon">${n}</span>${H(`commentVisibility`)}
        </span>
        <label class="toggle" aria-label="${H(`commentVisibilityToggle`)}">
          <input type="checkbox" id="pcb-visibility" ${e.isCommentVisible?`checked`:``}>
          <span class="toggle__track"></span>
          <span class="toggle__thumb"></span>
        </label>
      </div>

      <div class="row">
        <span class="row__label">${H(`color`)}</span>
        <input type="color" id="pcb-color" class="color-picker"
               value="${e.commentColor}" title="${H(`commentColor`)}">
      </div>

      <div class="row row--stacked">
        <span class="row__label">${H(`commentOpacity`)}</span>
        <div class="slider-wrap">
          <input type="range" id="pcb-opacity" class="slider"
                 min="0.1" max="1" step="0.05" value="${e.commentOpacity??1}">
          <span class="slider__value" id="pcb-opacity-val">${r}%</span>
        </div>
      </div>

      <p class="section-title">${H(`playbackRate`)}</p>

      <div class="row">
        <span class="row__label">${H(`fixedPlaybackRate`)}</span>
        <label class="toggle" aria-label="${H(`playbackRateFixedToggle`)}">
          <input type="checkbox" id="pcb-speed-mode" ${t.fixedModeEnabled?`checked`:``}>
          <span class="toggle__track"></span>
          <span class="toggle__thumb"></span>
        </label>
      </div>

      <div class="speed-range-row">
        <div class="slider-wrap">
          <input type="range" id="pcb-speed-range" class="slider"
                 min="1.0" max="1.5" step="0.01" value="${i}" ${a}>
          <span class="slider__value" id="pcb-speed-val">${i}×</span>
        </div>
      </div>
    `}bindPanelEvents(e){let t=e.getElementById(`pcb-visibility`);t?.addEventListener(`change`,()=>{let n=e.getElementById(`pcb-vis-icon`);n&&(n.innerHTML=t.checked?qo:Ko),this.settingsManager.updateSettings({isCommentVisible:t.checked})});let n=e.getElementById(`pcb-color`);n?.addEventListener(`input`,()=>{this.settingsManager.updateSettings({commentColor:n.value})});let r=e.getElementById(`pcb-opacity`),i=e.getElementById(`pcb-opacity-val`);r?.addEventListener(`input`,()=>{let e=parseFloat(r.value);i&&(i.textContent=`${Math.round(e*100)}%`),this.settingsManager.updateSettings({commentOpacity:e})});let a=e.getElementById(`pcb-speed-mode`),o=e.getElementById(`pcb-speed-range`),s=e.getElementById(`pcb-speed-val`);a?.addEventListener(`change`,()=>{o&&(o.disabled=!a.checked),this.settingsManager.updatePlaybackSettings({fixedModeEnabled:a.checked})}),o?.addEventListener(`input`,()=>{let e=parseFloat(o.value);s&&(s.textContent=`${e.toFixed(2)}×`),this.settingsManager.updatePlaybackSettings({fixedRate:e})})}openPanel(){if(this.isOpen)return;let e=this.panelShadowRoot?.querySelector(`.panel`),t=this.btnWrapper?.querySelector(`button`);e&&(e.removeAttribute(`hidden`),t?.setAttribute(`aria-expanded`,`true`),this.isOpen=!0)}closePanel(){let e=this.panelShadowRoot?.querySelector(`.panel`),t=this.btnWrapper?.querySelector(`button`);e?.setAttribute(`hidden`,``),t?.setAttribute(`aria-expanded`,`false`),this.isOpen=!1}scheduleHide(){this.cancelHideTimer(),this.mouseHideTimer=window.setTimeout(()=>{this.closePanel()},ys)}cancelHideTimer(){this.mouseHideTimer!==null&&(window.clearTimeout(this.mouseHideTimer),this.mouseHideTimer=null)}registerObservers(){this.settingsObserver=e=>{this.syncSettingsToPanel(e)},this.settingsManager.addObserver(this.settingsObserver),this.playbackObserver=e=>{this.syncPlaybackToPanel(e)},this.settingsManager.addPlaybackObserver(this.playbackObserver)}syncSettingsToPanel(e){let t=this.panelShadowRoot;if(!t)return;let n=t.getElementById(`pcb-visibility`);n&&(n.checked=e.isCommentVisible);let r=t.getElementById(`pcb-vis-icon`);r&&(r.innerHTML=e.isCommentVisible?qo:Ko);let i=t.getElementById(`pcb-color`);i&&(i.value=e.commentColor);let a=t.getElementById(`pcb-opacity`),o=t.getElementById(`pcb-opacity-val`);a&&(a.value=String(e.commentOpacity??1)),o&&(o.textContent=`${Math.round((e.commentOpacity??1)*100)}%`)}syncPlaybackToPanel(e){let t=this.panelShadowRoot;if(!t)return;let n=t.getElementById(`pcb-speed-mode`);n&&(n.checked=e.fixedModeEnabled);let r=t.getElementById(`pcb-speed-range`);r&&(r.disabled=!e.fixedModeEnabled,r.value=e.fixedRate.toFixed(2));let i=t.getElementById(`pcb-speed-val`);i&&(i.textContent=`${e.fixedRate.toFixed(2)}×`)}},xs=100,Ss=1e3,Cs=3e3,ws=2e3,Ts=`cachedAnimeTitle`,$=r(`dAnime:WatchPageController`),Es=class{global;initialized=!1;switchDebounce=new Za(Ss);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;playbackRateController=null;playerControlButton=null;lastPartId=null;partIdMonitorIntervalId=null;isPartIdChanging=!1;cachedAnimeTitle=null;lastEpisodeNumber=null;rendererSettingsObserver=null;constructor(e){this.global=e;try{this.cachedAnimeTitle=z(Ts,null),this.cachedAnimeTitle&&$.info(`watchPageController:constructor:loadedCachedTitle`,{cachedAnimeTitle:this.cachedAnimeTitle})}catch(e){$.error(`watchPageController:constructor:loadCacheFailed`,e),this.cachedAnimeTitle=null}}async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement()}async ensureDocumentReady(){document.readyState!==`complete`&&await new Promise(e=>{window.addEventListener(`load`,()=>e(),{once:!0})})}waitForVideoElement(){if(this.initialized)return;let e=document.querySelector(K.watchVideoElement);if(!e){window.setTimeout(()=>this.waitForVideoElement(),xs);return}if(e.readyState===0){e.addEventListener(`loadedmetadata`,()=>{this.initializeWithVideo(e)},{once:!0});return}this.initializeWithVideo(e)}async initializeWithVideo(e){if(!this.initialized){this.initialized=!0;try{U.show(H(`initializingCommentLoader`));let t=U.getInstance(),n=this.global.settingsManager??new wa(t);this.global.settingsManager=n,this.global.instances.settingsManager=n,this.playerControlButton||(this.playerControlButton=new bs(n),this.playerControlButton.mount());let r=n.loadSettings();if(!r.isCommentVisible){$.info(`watchPageController:initializeWithVideo:skipDueToVisibility`,{isCommentVisible:r.isCommentVisible}),U.show(H(`commentsHiddenSkip`),`info`);return}if(!r.autoSearchEnabled){$.info(`watchPageController:initializeWithVideo:manualMode`,{autoSearchEnabled:r.autoSearchEnabled});let t=n.loadVideoData();if(!t?.videoId){U.show(H(`manualModeSelectVideo`),`info`);return}$.info(`watchPageController:initializeWithVideo:manualMode:loadSavedVideo`,{videoId:t.videoId,title:t.title}),await this.loadCommentsFromSavedVideo(e,n,t);return}if(await this.waitForMetadataElements(),!await this.autoSetupComments(n))throw Error(H(`metadataAutoFetchFailed`));let i=n.loadVideoData();if(!i?.videoId)throw Error(H(`videoDataMissing`));let a=new W;this.global.instances.fetcher=a,await a.fetchApiData(i.videoId);let o=await a.fetchComments(),s=new Ma(this.mergeSettings(n.loadSettings()));s.initialize(e),this.global.instances.renderer=s,this.currentVideoElement=e;let c=this.playbackRateController??new ps(n);this.playbackRateController=c,this.global.instances.playbackRateController=c,c.bind(e),this.ensureRendererSettingsObserver(n),this.applyRendererSettings(n.loadSettings()),o.forEach(e=>{s.addComment(e.text,e.vposMs,e.commands)});let l=new lo(s,a,n);l.startMonitoring(),this.global.instances.switchHandler=l,this.setupSwitchHandling(e,l),this.observeVideoElement(),this.startPartIdMonitoring(),U.show(V(`commentsLoadComplete`,{count:String(o.length)}),`success`)}catch(e){throw this.initialized=!1,U.show(V(`initializationError`,{message:e.message}),`error`),e}}}mergeSettings(e){let t=R();return{...t,...e,ngWords:[...e.ngWords??t.ngWords],ngRegexps:[...e.ngRegexps??t.ngRegexps]}}ensureRendererSettingsObserver(e){this.rendererSettingsObserver||(this.rendererSettingsObserver=e=>{this.applyRendererSettings(e)},e.addObserver(this.rendererSettingsObserver))}applyRendererSettings(e){let t=this.global.instances.renderer;if(!t)return;let n=this.mergeSettings(e);t.settings.isCommentVisible!==n.isCommentVisible&&t.setCommentVisibility(n.isCommentVisible),t.settings=n}setupSwitchHandling(e,t){this.currentVideoElement=e,this.switchCallback=()=>{if(this.isPartIdChanging){$.info(`watchPageController:switchBlocked`,{reason:`partId change in progress`});return}let e=Date.now();if(e-this.lastSwitchTimestamp<Cs){$.debug(`watchPageController:switchCooldown`,{timeSinceLastSwitch:e-this.lastSwitchTimestamp,cooldownMs:Cs});return}this.lastSwitchTimestamp=e;let n=this.currentVideoElement;$.info(`watchPageController:switchHandlerTriggered`,{currentTime:n?.currentTime??null,duration:n?.duration??null}),t.onVideoSwitch(n)},this.global.utils.initializeWithVideo=async e=>{e&&(this.rebindVideoElement(e),this.playbackRateController?.bind(e),await t.onVideoSwitch(e))},this.currentVideoElement=e}observeVideoElement(){let e=this.currentVideoElement;e&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{let e=document.querySelector(K.watchVideoElement);!e||e===this.currentVideoElement||this.rebindVideoElement(e)}),this.domMutationObserver.observe(document.body,{childList:!0,subtree:!0}),this.attachVideoEventListeners(e))}rebindVideoElement(e){this.detachVideoEventListeners(),this.currentVideoElement=e;let t=this.global.instances.renderer,n=this.global.instances.switchHandler;t&&(t.clearComments(),t.destroy(),t.initialize(e),t.resize()),this.playbackRateController?.bind(e),n&&(n.onVideoSwitch(e),this.setupSwitchHandling(e,n)),this.attachVideoEventListeners(e)}attachVideoEventListeners(e){this.detachVideoEventListeners(),eo().attach(e);let t=t=>{if(!this.switchCallback)return;let n=t.type,r=this.hasVideoSourceChanged(e);if(n===`ended`&&!r){$.info(`watchPageController:skipSwitchOnEnded`,{eventType:n,currentTime:e.currentTime,duration:e.duration,ended:e.ended,paused:e.paused,currentSrc:e.currentSrc||e.getAttribute(`src`)||null});return}$.info(`watchPageController:eventTriggered`,{eventType:n,currentTime:e.currentTime,duration:e.duration,ended:e.ended,paused:e.paused,sourceChanged:r}),this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback)};e.addEventListener(`ended`,t),e.addEventListener(`loadedmetadata`,t),e.addEventListener(`emptied`,t),this.videoEndedListener=t}detachVideoEventListeners(){let e=this.currentVideoElement;eo().detach(),e&&this.videoEndedListener&&(e.removeEventListener(`ended`,this.videoEndedListener),e.removeEventListener(`loadedmetadata`,this.videoEndedListener),e.removeEventListener(`emptied`,this.videoEndedListener)),this.videoEndedListener=null}hasVideoSourceChanged(e){let t=e.currentSrc||e.getAttribute(`src`)||e.querySelector(`source[src]`)?.getAttribute(`src`)||null,n=this.global.instances.renderer?.getCurrentVideoSource()??null;return t?n?n!==t:!0:!1}async waitForMetadataElements(e,t){let n=Date.now();for(let r=0;r<50;r++){let i=this.getCurrentPartId(),a=document.querySelector(K.watchPageAnimeTitle),o=document.querySelector(K.watchPageEpisodeNumber),s=document.querySelector(K.watchPageEpisodeTitle),c=a?.textContent?.trim()??``,l=o?.textContent?.trim()??``,u=s?.textContent?.trim()??``;if(r===0&&$.info(`watchPageController:waitForMetadata:start`,{currentPartId:i,expectedPartId:e,episodeNumber:l,episodeTitle:u,animeTitle:c||`(empty)`,cachedAnimeTitle:this.cachedAnimeTitle||`(empty)`,previousEpisodeNumber:t||`(none)`}),!e&&!this.cachedAnimeTitle&&r<20&&!c){await new Promise(e=>window.setTimeout(e,100));continue}if((!e||i===e)&&l&&u&&(!t||l!==t)){$.info(`watchPageController:waitForMetadata:success`,{attempts:r+1,waited:Date.now()-n,currentPartId:i,expectedPartId:e,episodeNumber:l,episodeTitle:u,animeTitle:c||`(empty)`,previousEpisodeNumber:t||`(none)`});return}await new Promise(e=>window.setTimeout(e,100))}let r=document.querySelector(K.watchPageEpisodeNumber)?.textContent?.trim()??``,i=document.querySelector(K.watchPageEpisodeTitle)?.textContent?.trim()??``;throw $.error(`watchPageController:waitForMetadata:timeout`,{maxRetries:50,waited:Date.now()-n,currentPartId:this.getCurrentPartId(),expectedPartId:e,previousEpisodeNumber:t||`(none)`,finalEpisodeNumber:r,finalEpisodeTitle:i}),Error(`DOM更新のタイムアウト: partId=${e}, 前回エピソード="${t||`なし`}", 現在エピソード="${r}"`)}extractMetadataFromPage(){try{let e=document.querySelector(K.watchPageAnimeTitle),t=document.querySelector(K.watchPageEpisodeNumber),n=document.querySelector(K.watchPageEpisodeTitle),r=e?.textContent?.trim()??``,i=t?.textContent?.trim()??``,a=n?.textContent?.trim()??``;if(r){this.cachedAnimeTitle=r;try{B(Ts,r),$.info(`watchPageController:extractMetadata:cachedTitle`,{animeTitle:r})}catch(e){$.error(`watchPageController:extractMetadata:saveCacheFailed`,e)}}else this.cachedAnimeTitle&&(r=this.cachedAnimeTitle,$.info(`watchPageController:extractMetadata:usedCachedTitle`,{cachedAnimeTitle:this.cachedAnimeTitle}));return $.info(`watchPageController:extractMetadata:rawValues`,{animeTitle:r||`(empty)`,animeTitleElementExists:!!e,animeTitleFromCache:!e&&!!this.cachedAnimeTitle,episodeNumber:i,episodeNumberElementExists:!!t,episodeTitle:a,episodeTitleElementExists:!!n,currentPartId:this.getCurrentPartId()}),i?(r||$.warn(`watchPageController:extractMetadata:noAnimeTitle`,{hasCache:!!this.cachedAnimeTitle}),this.lastEpisodeNumber=i,{animeTitle:r,episodeNumber:i,episodeTitle:a}):($.warn(`watchPageController:extractMetadata:insufficient`,{episodeNumber:i||`(empty)`,episodeTitle:a||`(empty)`}),null)}catch(e){return $.error(`watchPageController:extractMetadata:error`,e),null}}async autoSetupComments(e){try{let t=this.extractMetadataFromPage();if(!t)return $.warn(`watchPageController:autoSetup:noMetadata`),!1;if(!t.animeTitle)return $.warn(`watchPageController:autoSetup:noAnimeTitle`,{episodeNumber:t.episodeNumber,episodeTitle:t.episodeTitle,cachedAnimeTitle:this.cachedAnimeTitle}),U.show(H(`noAnimeTitle`),`warning`),!1;let n=[t.animeTitle,t.episodeNumber,t.episodeTitle].filter(Boolean).join(` `);$.info(`watchPageController:autoSetup`,{keyword:n,animeTitle:t.animeTitle,episodeNumber:t.episodeNumber,episodeTitle:t.episodeTitle,usingCachedTitle:!!this.cachedAnimeTitle&&!t.animeTitle}),U.show(V(`searchingKeyword`,{keyword:n}),`info`);let r=await new G().search(n);if(r.length===0)return U.show(H(`niconicoNotFound`),`warning`),!1;let i=G.filterOfficialVideos(r,t.animeTitle);$.info(`watchPageController:autoSetup:officialFilter`,{totalResults:r.length,officialResults:i.length,animeTitle:t.animeTitle}),i.length===0&&($.warn(`watchPageController:autoSetup:noOfficialVideos`,{animeTitle:t.animeTitle,firstResultOwner:r[0]?.owner?.nickname??r[0]?.channel?.name??`不明`}),U.show(H(`officialVideoMissingUseFirst`),`warning`));let a=i.length>0?i[0]:r[0],o=await new W().fetchApiData(a.videoId),s={videoId:a.videoId,title:a.title,viewCount:o.video?.count?.view??a.viewCount,commentCount:o.video?.count?.comment??a.commentCount,mylistCount:o.video?.count?.mylist??a.mylistCount,postedAt:o.video?.registeredAt??a.postedAt,thumbnail:o.video?.thumbnail?.url??a.thumbnail,owner:o.owner??a.owner??null,channel:o.channel??a.channel??null};if(e.saveVideoData(a.title,s)){$.info(`watchPageController:autoSetup:success`,{videoId:a.videoId,title:a.title,commentCount:a.commentCount});let e=a.owner?.nickname||a.channel?.name||`不明`,t=[`<div style="font-weight: 600; margin-bottom: 8px;">${H(`autoSetupComplete`)}</div>`,`<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">`,`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Yo}</span>`,`  <span style="flex: 1; word-break: break-word;">${a.title}</span>`,`</div>`,`<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">`,`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Xo}</span>`,`  <span>${e}</span>`,`</div>`,`<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">`,`  <div style="display: flex; align-items: center; gap: 4px;">`,`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Zo}</span>`,`    <span>${a.viewCount.toLocaleString()}</span>`,`  </div>`,`  <div style="display: flex; align-items: center; gap: 4px;">`,`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Qo}</span>`,`    <span>${a.commentCount.toLocaleString()}</span>`,`  </div>`,`</div>`].join(``);return U.show(t,`success`,5e3),!0}return!1}catch(e){return $.error(`watchPageController:autoSetup:error`,e),U.show(V(`autoSetupError`,{message:e.message}),`error`),!1}}getCurrentPartId(){try{return new URLSearchParams(window.location.search).get(`partId`)}catch(e){return $.error(`watchPageController:getCurrentPartId:error`,e),null}}startPartIdMonitoring(){this.stopPartIdMonitoring(),this.lastPartId=this.getCurrentPartId(),this.partIdMonitorIntervalId=window.setInterval(()=>{this.checkPartIdChange()},ws)}stopPartIdMonitoring(){this.partIdMonitorIntervalId!==null&&(window.clearInterval(this.partIdMonitorIntervalId),this.partIdMonitorIntervalId=null)}async checkPartIdChange(){let e=this.getCurrentPartId();e===null||e===this.lastPartId||($.warn(`watchPageController:partIdChanged`,{oldPartId:this.lastPartId,newPartId:e,url:window.location.href,timestamp:new Date().toISOString()}),this.lastPartId=e,await this.onPartIdChanged())}async waitForVideoReady(e){let t=Date.now();for($.info(`watchPageController:waitForVideoReady:start`,{readyState:e.readyState,duration:e.duration,src:e.currentSrc});e.readyState<2&&Date.now()-t<5e3;)await new Promise(e=>window.setTimeout(e,100));$.info(`watchPageController:waitForVideoReady:complete`,{readyState:e.readyState,duration:e.duration,waited:Date.now()-t})}async onPartIdChanged(){this.isPartIdChanging=!0;try{let e=this.global.settingsManager;if(!e){$.warn(`watchPageController:onPartIdChanged:noSettingsManager`);return}let t=e.getSettings();if(!t.isCommentVisible){$.info(`watchPageController:onPartIdChanged:skipDueToVisibility`,{isCommentVisible:t.isCommentVisible}),U.show(H(`commentsHiddenSkip`),`info`);return}let n=this.lastEpisodeNumber??document.querySelector(K.watchPageEpisodeNumber)?.textContent?.trim()??null;if(!t.autoSearchEnabled){$.info(`watchPageController:onPartIdChanged:manualMode`,{autoSearchEnabled:t.autoSearchEnabled});let r=e.loadManualSearchSettings();if(!r?.animeTitle){U.show(H(`manualModeSelectAnimeTitle`),`info`);let e=this.global.instances.renderer;e&&e.clearComments();return}await this.handleManualModeEpisodeSwitch(e,r.animeTitle,n);return}$.info(`watchPageController:onPartIdChanged:start`,{currentVideoElement:this.currentVideoElement?`present`:`null`,rendererExists:!!this.global.instances.renderer,switchHandlerExists:!!this.global.instances.switchHandler,isPartIdChanging:this.isPartIdChanging,newPartId:this.getCurrentPartId(),previousEpisodeNumber:n}),U.show(H(`episodeChangeDetected`),`info`);let r=this.getCurrentPartId();$.info(`watchPageController:onPartIdChanged:waitingForDomUpdate`,{newPartId:r,previousEpisodeNumber:n});try{await this.waitForMetadataElements(r??void 0,n??void 0)}catch(e){$.error(`watchPageController:onPartIdChanged:waitMetadataFailed`,e),U.show(V(`domUpdateWaitFailed`,{message:e.message}),`error`);return}let i=await this.autoSetupComments(e);if($.info(`watchPageController:onPartIdChanged:autoSetup`,{success:i}),i){let t=e.loadVideoData();$.warn(`watchPageController:onPartIdChanged:loadedVideoData`,{videoId:t?.videoId??null,title:t?.title??null});let n=this.currentVideoElement??document.querySelector(K.watchVideoElement);if($.warn(`watchPageController:onPartIdChanged:videoElement`,{videoElementFound:!!n,currentTime:n?.currentTime??null,duration:n?.duration??null,src:n?.currentSrc??null,readyState:n?.readyState??null}),n&&t?.videoId){await this.waitForVideoReady(n),n.dataset.videoId=t.videoId;let e=this.global.instances.renderer,r=this.global.instances.switchHandler;if($.warn(`watchPageController:onPartIdChanged:beforeSwitch`,{rendererCommentCount:e?.getCommentsSnapshot().length??0,videoCurrentTime:n.currentTime,videoReadyState:n.readyState,videoSrc:n.currentSrc,videoId:t.videoId}),e&&r){$.warn(`watchPageController:onPartIdChanged:destroyBefore`,{commentsBeforeDestroy:e.getCommentsSnapshot().length,currentVideoSrc:e.getCurrentVideoSource(),videoElement:e.getVideoElement()?`attached`:`detached`});let t=e.settings;e.destroy(),$.warn(`watchPageController:onPartIdChanged:createNew`,{savedSettings:t});let i=new Ma(t,{loggerNamespace:`dAnime:CommentRenderer`});this.global.instances.renderer=i,$.warn(`watchPageController:onPartIdChanged:reinitialize`,{videoElementSrc:n.currentSrc,videoElementReadyState:n.readyState,videoElementCurrentTime:n.currentTime}),i.initialize(n),$.warn(`watchPageController:onPartIdChanged:reinitializeComplete`,{commentsAfterReinitialize:i.getCommentsSnapshot().length,newVideoSrc:i.getCurrentVideoSource()}),r.updateRenderer(i),r.resetVideoSource(),await r.onVideoSwitch(n),$.warn(`watchPageController:onPartIdChanged:afterSwitch`,{rendererCommentCount:i.getCommentsSnapshot().length,videoCurrentTime:n.currentTime,finalVideoSrc:i.getCurrentVideoSource()})}}}$.info(`watchPageController:onPartIdChanged:complete`)}catch(e){$.error(`watchPageController:onPartIdChanged:error`,e),U.show(V(`episodeSwitchError`,{message:e.message}),`error`)}finally{this.isPartIdChanging=!1,$.info(`watchPageController:onPartIdChanged:flagReset`,{isPartIdChanging:this.isPartIdChanging})}}async loadCommentsFromSavedVideo(e,t,n){try{let r=new W;this.global.instances.fetcher=r,await r.fetchApiData(n.videoId);let i=await r.fetchComments(),a=new Ma(this.mergeSettings(t.loadSettings()));a.initialize(e),this.global.instances.renderer=a,this.currentVideoElement=e;let o=this.playbackRateController??new ps(t);this.playbackRateController=o,this.global.instances.playbackRateController=o,o.bind(e),this.ensureRendererSettingsObserver(t),this.applyRendererSettings(t.loadSettings()),i.forEach(e=>{a.addComment(e.text,e.vposMs,e.commands)});let s=new lo(a,r,t);s.startMonitoring(),this.global.instances.switchHandler=s,this.setupSwitchHandling(e,s),this.observeVideoElement(),this.startPartIdMonitoring(),U.show(V(`manualModeCommentsLoadComplete`,{count:String(i.length),title:n.title}),`success`)}catch(e){$.error(`watchPageController:loadCommentsFromSavedVideo:error`,e),U.show(V(`commentsLoadErrorSelectAnother`,{message:e.message}),`error`)}}async handleManualModeEpisodeSwitch(e,t,n){try{let r=this.getCurrentPartId();$.info(`watchPageController:manualModeSwitch:waitingForDomUpdate`,{newPartId:r,previousEpisodeNumber:n,savedAnimeTitle:t});try{await this.waitForMetadataElements(r??void 0,n??void 0)}catch(e){$.error(`watchPageController:manualModeSwitch:waitMetadataFailed`,e),U.show(V(`domUpdateWaitFailed`,{message:e.message}),`error`);return}let i=document.querySelector(K.watchPageEpisodeNumber)?.textContent?.trim()??``;if(!i){$.warn(`watchPageController:manualModeSwitch:noEpisodeNumber`),U.show(H(`episodeNumberMissing`),`warning`);return}let a=`${t} ${i}`;$.info(`watchPageController:manualModeSwitch:search`,{keyword:a,savedAnimeTitle:t,newEpisodeNumber:i}),U.show(V(`searchingKeyword`,{keyword:a}),`info`);let o=await new G().search(a);if(o.length===0){U.show(H(`niconicoNotFoundManual`),`warning`);let e=this.global.instances.renderer;e&&e.clearComments();return}let s=G.filterOfficialVideos(o,t);if($.info(`watchPageController:manualModeSwitch:officialFilter`,{totalResults:o.length,officialResults:s.length,savedAnimeTitle:t}),s.length===0){U.show(H(`officialVideoMissingManual`),`warning`);let e=this.global.instances.renderer;e&&e.clearComments();return}let c=s[0],l=await new W().fetchApiData(c.videoId),u={videoId:c.videoId,title:c.title,viewCount:l.video?.count?.view??c.viewCount,commentCount:l.video?.count?.comment??c.commentCount,mylistCount:l.video?.count?.mylist??c.mylistCount,postedAt:l.video?.registeredAt??c.postedAt,thumbnail:l.video?.thumbnail?.url??c.thumbnail,owner:l.owner??c.owner??null,channel:l.channel??c.channel??null};e.saveVideoData(c.title,u),e.saveManualSearchSettings({animeTitle:t,episodeNumber:i,episodeTitle:``});let d=this.currentVideoElement??document.querySelector(K.watchVideoElement);if(d){await this.waitForVideoReady(d),d.dataset.videoId=c.videoId;let e=this.global.instances.renderer,t=this.global.instances.switchHandler;if(e&&t){let n=e.settings;e.destroy();let r=new Ma(n,{loggerNamespace:`dAnime:CommentRenderer`});this.global.instances.renderer=r,r.initialize(d),t.updateRenderer(r),t.resetVideoSource(),await t.onVideoSwitch(d)}}let f=c.owner?.nickname??c.channel?.name??`不明`,p=[`<div style="font-weight: 600; margin-bottom: 8px;">${H(`nextEpisodeAutoSetupComplete`)}</div>`,`<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">`,`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Yo}</span>`,`  <span style="flex: 1; word-break: break-word;">${c.title}</span>`,`</div>`,`<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">`,`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Xo}</span>`,`  <span>${f}</span>`,`</div>`,`<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">`,`  <div style="display: flex; align-items: center; gap: 4px;">`,`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Zo}</span>`,`    <span>${c.viewCount.toLocaleString()}</span>`,`  </div>`,`  <div style="display: flex; align-items: center; gap: 4px;">`,`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Qo}</span>`,`    <span>${c.commentCount.toLocaleString()}</span>`,`  </div>`,`</div>`].join(``);U.show(p,`success`,5e3),$.info(`watchPageController:manualModeSwitch:success`,{videoId:c.videoId,title:c.title,commentCount:c.commentCount})}catch(e){$.error(`watchPageController:manualModeSwitch:error`,e),U.show(V(`episodeSwitchError`,{message:e.message}),`error`)}}},Ds=100,Os=class{global;constructor(e){this.global=e}initialize(){let e=U.getInstance(),t=this.global.settingsManager??new wa(e);this.global.settingsManager=t,this.global.instances.settingsManager=t;let n=new cs(t);this.waitForHeader(n)}waitForHeader(e){if(!document.querySelector(K.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(e),Ds);return}e.insertIntoMypage(),e.addAutoCommentButtons(),this.observeList(e)}observeList(e){let t=document.querySelector(K.mypageListContainer);t&&new MutationObserver(()=>{try{e.addAutoCommentButtons()}catch(e){console.error(`[MypageController] auto comment buttons update failed`,e)}}).observe(t,{childList:!0,subtree:!0})}},ks=class{log;global=hs();watchController=null;mypageController=null;constructor(){this.log=r(`DanimeApp`)}start(){this.log.info(`starting renderer`),fo.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener(`load`,()=>{this.initialize()})}async initialize(){if(!this.acquireInstanceLock()){this.log.info(`renderer already initialized, skipping`);return}let e=location.pathname.toLowerCase();try{e.includes(`/animestore/sc_d_pc`)?(this.watchController=new Es(this.global),await this.watchController.initialize()):e.includes(`/animestore/mp_viw_pc`)?(this.mypageController=new Os(this.global),this.mypageController.initialize()):this.log.info(`page not supported, initialization skipped`)}catch(e){this.log.error(`initialization failed`,e)}}acquireInstanceLock(){let e=i();return e.__dAnimeNicoCommentRenderer2Instance=(e.__dAnimeNicoCommentRenderer2Instance??0)+1,e.__dAnimeNicoCommentRenderer2Instance===1}},As=r(`dAnimeNicoCommentRenderer2`);async function js(){As.info(`bootstrap start`);try{new ks().start(),As.info(`bootstrap completed`)}catch(e){As.error(`bootstrap failed`,e)}}js()})();
