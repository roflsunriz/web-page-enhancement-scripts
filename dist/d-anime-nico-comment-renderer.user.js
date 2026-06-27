// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      7.5.0
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

  const Ze={debug:"debug",info:"info",warn:"warn",error:"error"},Je={debug:10,info:20,warn:30,error:40};let In=t=>Je[t]>=Je.warn;const R=t=>{const e=`[${t}]`,n={};return Object.keys(Ze).forEach(r=>{const i=Ze[r];n[r]=(...a)=>{if(!In(r))return;(console[i]??console.log)(e,...a);};}),n};function De(){return typeof unsafeWindow<"u"?unsafeWindow:window}const An={small:.6666666666666666,medium:1,big:1.4444444444444444},Ln={defont:'Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic',gothic:'"游ゴシック体","游ゴシック","Yu Gothic",YuGothic,yugothic,YuGo-Medium,"宋体",SimSun,Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic',mincho:'"游明朝体","游明朝","Yu Mincho",YuMincho,yumincho,YuMin-Medium,"宋体",SimSun,Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic'},Fn={defont:"600",gothic:"",mincho:""},Kt={white:"#FFFFFF",red:"#FF0000",pink:"#FFA5CC",orange:"#FFBA66",yellow:"#FFFFAA",green:"#00FF00",cyan:"#88FFFF",blue:"#8899FF",purple:"#D9A5FF",black:"#000000",white2:"#CC9",red2:"#C03",pink2:"#F3C",orange2:"#F60",yellow2:"#990",green2:"#0C6",cyan2:"#0CC",blue2:"#39F",purple2:"#63C",black2:"#666"},He=/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,Pn=/^[,.:;]+/,Rn=/[,.:;]+$/,Dn=t=>{const e=t.trim();return e?He.test(e)?e:e.replace(Pn,"").replace(Rn,""):""},Hn=t=>He.test(t)?t.toUpperCase():null,jt=t=>{const e=t.trim();if(!e)return null;const n=e.toLowerCase().endsWith("px")?e.slice(0,-2):e,r=Number.parseFloat(n);return Number.isFinite(r)?r:null},zn=t=>{const e=t.trim();if(!e)return null;if(e.endsWith("%")){const n=Number.parseFloat(e.slice(0,-1));return Number.isFinite(n)?n/100:null}return jt(e)},On=t=>Number.isFinite(t)?Math.min(100,Math.max(-100,t)):0,Nn=t=>!Number.isFinite(t)||t===0?1:Math.min(5,Math.max(.25,t)),$n=t=>t==="naka"||t==="ue"||t==="shita",Wn=t=>t==="small"||t==="medium"||t==="big",Bn=t=>t==="defont"||t==="gothic"||t==="mincho",qn=t=>t in Kt,Un=(t,e)=>{let n="naka",r="medium",i="defont",a=null,s=1,o=null,l=false,d=false,h=false,c=0,u=1;for(const x of t){const b=Dn(typeof x=="string"?x:"");if(!b)continue;if(He.test(b)){const E=Hn(b);if(E){a=E;continue}}const y=b.toLowerCase();if($n(y)){n=y;continue}if(Wn(y)){r=y;continue}if(Bn(y)){i=y;continue}if(qn(y)){a=Kt[y].toUpperCase();continue}if(y==="_live"){o=.5;continue}if(y==="invisible"){s=0,l=true;continue}if(y==="full"){d=true;continue}if(y==="ender"){h=true;continue}if(y.startsWith("ls:")||y.startsWith("letterspacing:")){const E=b.indexOf(":");if(E>=0){const V=jt(b.slice(E+1));V!==null&&(c=On(V));}continue}if(y.startsWith("lh:")||y.startsWith("lineheight:")){const E=b.indexOf(":");if(E>=0){const V=zn(b.slice(E+1));V!==null&&(u=Nn(V));}continue}}const m=Math.max(0,Math.min(1,s)),g=(a??e.defaultColor).toUpperCase(),w=typeof o=="number"?Math.max(0,Math.min(1,o)):null;return {layout:n,size:r,sizeScale:An[r],font:i,fontFamily:Ln[i],fontWeight:Fn[i],resolvedColor:g,colorOverride:a,opacityMultiplier:m,opacityOverride:w,isInvisible:l,isFull:d,isEnder:h,letterSpacing:c,lineHeight:u}},Yn=/^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i,ce=t=>t.length===1?t.repeat(2):t,N=t=>Number.parseInt(t,16),B=t=>!Number.isFinite(t)||t<=0?0:t>=1?1:t,ze=(t,e)=>{const n=Yn.exec(t);if(!n)return t;const r=n[1];let i,a,s,o=1;r.length===3||r.length===4?(i=N(ce(r[0])),a=N(ce(r[1])),s=N(ce(r[2])),r.length===4&&(o=N(ce(r[3]))/255)):(i=N(r.slice(0,2)),a=N(r.slice(2,4)),s=N(r.slice(4,6)),r.length===8&&(o=N(r.slice(6,8))/255));const l=B(o*B(e));return `rgba(${i}, ${a}, ${s}, ${l})`},Gn=()=>({now:()=>typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now()}),Xt=()=>Gn(),P=t=>t*1e3,Kn=t=>!Number.isFinite(t)||t<0?null:Math.round(t),Oe=6e3,Qe=2700,jn=3,Xn=.35,Zn=48,Jn=48,ge=0,Qn=6e3,xe=120,er=800,tr=2,ie=6e3,$=3e3,z=$+Oe,nr=240,rr=1800,et=1,Zt=12,ir=24,F=.001,U=50,ar=2300,tt={debug:0,info:1,warn:2,error:3},sr=(t,e,n)=>{const r=[`[${e}]`,...n];switch(t){case "debug":console.debug(...r);break;case "info":console.info(...r);break;case "warn":console.warn(...r);break;case "error":console.error(...r);break;default:console.log(...r);}},Jt=(t,e={})=>{const{level:n="info",emitter:r=sr}=e,i=tt[n],a=(s,o)=>{tt[s]<i||r(s,t,o);};return {debug:(...s)=>a("debug",s),info:(...s)=>a("info",s),warn:(...s)=>a("warn",s),error:(...s)=>a("error",s)}},Ne=Jt("CommentEngine:Comment"),nt=new WeakMap,or=t=>{let e=nt.get(t);return e||(e=new Map,nt.set(t,e)),e},$e=(t,e)=>{if(!t)return 0;const n=`${t.font??""}::${e}`,r=or(t),i=r.get(n);if(i!==void 0)return i;const a=t.measureText(e).width;return r.set(n,a),a},fe=t=>`${t.fontWeight?`${t.fontWeight} `:""}${t.fontSize}px ${t.fontFamily}`,lr=27/665,Q=665,cr=12,dr="  ",hr=1252/597.38330078125,we=[366/Q,510/Q,1662/Q],ur=566/Q,pr=806/665,mr=808/665,rt=1176/665,it=900/665,gr=1126/665,at=810/665,fr=1126/665,st=1046/665,ot=1254/665,br=1140/665,vr=878/665,yr=.25,xr=160,wr=420,Sr=80,Cr=.18,Mr=400,Er=.2,Tr=420,kr=250,Vr=1.8,_r=420,Ir=20,Ar=.045,Lr=850/1182,Fr=t=>Math.max(.01,t/Q),W=(t,e)=>t*Fr(e),Pr=t=>t.replaceAll("	",dr),Qt=/[\s\u00a0\u2000-\u200f\u202f\u205f\u3000]/g,Rr=t=>{const e=Pr(t);if(e.includes(`
`)){const n=e.split(/\r?\n/);return n.length>0?n:[""]}return [e]},lt=(t,e=cr)=>Math.max(e,t),Dr=(t,e)=>{if(t.fontSize>=35)return Math.round(e*ur);const n=t.text.split(/\r?\n/),r=Math.max(0,...n.map(i=>i.length));return t.isEnder&&r>=25||Math.max(0,...n.map(i=>(i.match(/\t/g)||[]).length))>=12||t.width>=1200?Math.round(e*we[2]):t.width>=300?Math.round(e*we[1]):Math.round(e*we[0])},Hr=(t,e)=>Math.min(W(wr,e),Math.max(W(xr,e),t*yr)),zr=(t,e)=>{const n=W(Mr,e);return Math.min(W(Tr,e),W(Sr,e)+t.width*Cr+Math.max(0,t.width-n)*Er)},Or=(t,e)=>Math.min(W(_r,e),Math.max(0,t.width-W(kr,e))*Vr),Nr=(t,e)=>{if(t.isFull)return t.width;const n=Math.max(t.sizeScale,1),r=t.width/n,i=e*Lr;return Math.min(r,i)},$r=t=>t.lines.filter(e=>e.replace(Qt,"").length>0).length,ct=t=>t.lines.length>1&&$r(t)===1,Wr=t=>t.lines.map(e=>e.replace(Qt,"")).filter(e=>e.length>0),dt=t=>{if(t.lines.length<=1)return  false;const e=Wr(t);return e.length===1&&/^[●○◉◎]+$/u.test(e[0])},de=t=>t.size==="big"||t.fontSize>=35,Br=(t,e)=>{let n=0;const r=t.letterSpacing;for(const s of t.lines){const o=$e(e,s),l=s.length>1?r*(s.length-1):0,d=Math.max(0,o+l);d>n&&(n=d);}t.width=n;const i=Math.max(1,Math.floor(t.fontSize*t.lineHeightMultiplier));t.lineHeightPx=i;const a=t.lines.length>1?(t.lines.length-1)*i:0;t.height=t.fontSize+a;},qr=(t,e,n,r,i)=>{try{if(!e)throw new Error("Canvas context is required");if(!Number.isFinite(n)||!Number.isFinite(r))throw new Error("Canvas dimensions must be numbers");if(!i)throw new Error("Prepare options are required");const a=Math.max(n,1),s=lt(Math.floor(r*lr)),o=lt(Math.floor(s*t.sizeScale));if(t.fontSize=o,e.font=fe(t),t.lines=Rr(t.text),Br(t,e),t.isScrolling&&t.isFull){const D=t.lines.length>1&&(t.fontFamily.includes("Yu Mincho")||t.fontFamily.includes("游明朝"));if(D&&t.hasSameVposFullMinchoEnder&&!t.isEnder&&de(t))t.width=Math.round(r*(dt(t)?st:fr)),t.height=Math.max(t.height,Math.round(r*at));else if(D&&t.hasSameVposFullMinchoEnder&&t.isEnder&&de(t))t.width=Math.round(r*(ct(t)?ot:rt)),t.height=Math.max(t.height,Math.round(r*it));else if(D&&t.hasSameVposFullMinchoEnder&&t.isEnder)t.width=Math.round(r*(ct(t)?ot:br)),t.height=Math.max(t.height,Math.round(r*vr));else if(D&&de(t))t.width=Math.round(r*(dt(t)?st:rt)),t.height=Math.max(t.height,Math.round(r*it));else if(D)t.width=Math.round(r*gr),t.height=Math.max(t.height,Math.round(r*at));else {const j=de(t)?mr:pr;t.width=Dr(t,r),t.height=Math.max(t.height,Math.round(r*j));}}if(!t.isScrolling){const D=a+s*2.6666666666666665;t.width>=D*.95&&t.fontSize>=35?t.width=Math.round(r*hr):t.width=Math.min(t.width,D),t.bufferWidth=0;const j=(a-t.width)/2;t.virtualStartX=j,t.x=j,t.baseSpeed=0,t.speed=0,t.speedPixelsPerMs=0,t.visibleDurationMs=$,t.preCollisionDurationMs=$,t.totalDurationMs=$,t.reservationWidth=t.width,t.staticExpiryTimeMs=t.vposMs+$,t.lastUpdateTime=t.getTimeSource().now(),t.isPaused=!1;return}t.staticExpiryTimeMs=null;const l=$e(e,"??".repeat(150)),d=t.width,h=d*Math.max(i.bufferRatio,0);t.bufferWidth=Math.max(i.baseBufferPx,h);const c=Math.max(i.entryBufferPx,t.bufferWidth),u=t.scrollDirection,m=Math.min(1,r/Q),g=t.isFull?i.virtualExtension*m:i.virtualExtension,w=t.isFull?Hr(t.width,r):0,x=t.isFull?W(Ir,r)+t.width*Ar:0,b=t.isFull?0:zr(t,r),y=t.isFull?0:Or(t,r),E=u==="rtl"?a+g+w+b:-d-t.bufferWidth-g-w-b,V=u==="rtl"?-d-t.bufferWidth-c+w-b-y:a+c-w+b+y,G=u==="rtl"?a+c:-c;t.virtualStartX=E,t.x=E,t.exitThreshold=V;const K=a>0?d/a:0,Sn=i.maxVisibleDurationMs===i.minVisibleDurationMs;let ve=i.maxVisibleDurationMs;if(!Sn&&K>1&&!t.isFull){const D=Math.min(K,i.maxWidthRatio),j=i.maxVisibleDurationMs/Math.max(D,1);ve=Math.max(i.minVisibleDurationMs,Math.floor(j));}const Cn=a+d+t.bufferWidth+c+g+x+b*2+y,Mn=Math.max(ve,1),ye=Cn/Mn,En=ye*1e3/60;t.baseSpeed=En,t.speed=t.baseSpeed,t.speedPixelsPerMs=ye;const Tn=Math.abs(V-E),je=u==="rtl"?E+d+t.bufferWidth:E-t.bufferWidth,kn=u==="rtl"?Math.max(0,je-G):Math.max(0,G-je),Xe=Math.max(ye,Number.EPSILON);t.visibleDurationMs=ve,t.preCollisionDurationMs=Math.max(0,Math.ceil(kn/Xe)),t.totalDurationMs=Math.max(t.preCollisionDurationMs,Math.ceil(Tn/Xe));const Vn=d+t.bufferWidth+c,_n=Nr(t,a);t.reservationWidth=Math.min(l,Math.max(Vn,_n)),t.lastUpdateTime=t.getTimeSource().now(),t.isPaused=!1;}catch(a){throw Ne.error("Comment.prepare",a,{text:t.text,visibleWidth:n,canvasHeight:r,hasContext:!!e}),a}},en=5,O={enabled:false,maxLogsPerCategory:en},pe=new Map,Ur=t=>{if(t===void 0||!Number.isFinite(t))return en;const e=Math.max(1,Math.floor(t));return Math.min(1e4,e)},Yr=t=>{O.enabled=!!t.enabled,O.maxLogsPerCategory=Ur(t.maxLogsPerCategory),O.enabled||pe.clear();},q=()=>O.enabled,Gr=t=>{const e=pe.get(t)??0;return e>=O.maxLogsPerCategory?(e===O.maxLogsPerCategory&&(console.debug(`[CommentOverlay][${t}]`,"Further logs suppressed."),pe.set(t,e+1)),false):(pe.set(t,e+1),true)},k=(t,...e)=>{O.enabled&&Gr(t)&&console.debug(`[CommentOverlay][${t}]`,...e);},oe=(t,e=32)=>t.length<=e?t:`${t.slice(0,e)}…`,Kr=(t,e)=>{O.enabled&&(console.group(`[CommentOverlay][state-dump] ${t}`),console.table({"Current Time":`${e.currentTime.toFixed(2)}ms`,Duration:`${e.duration.toFixed(2)}ms`,"Is Playing":e.isPlaying,"Epoch ID":e.epochId,"Total Comments":e.totalComments,"Active Comments":e.activeComments,"Reserved Lanes":e.reservedLanes,"Final Phase":e.finalPhaseActive,"Playback Begun":e.playbackHasBegun,"Is Stalled":e.isStalled}),console.groupEnd());},jr=(t,e,n)=>{O.enabled&&k("epoch-change",`Epoch changed: ${t} → ${e} (reason: ${n})`);},ht=t=>{if(typeof t=="string")return t;if(t!=null)return String(t)},tn=()=>typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now(),Xr=t=>{if(typeof t.getTransform!="function")return;const e=t.getTransform();return [e.a,e.b,e.c,e.d,e.e,e.f]},Zr=t=>{const e=t.canvas;return e?{canvasWidth:e.width,canvasHeight:e.height}:{}},Jr=t=>t?{...t.no!==void 0?{no:t.no}:{},...t.fork!==void 0?{fork:t.fork}:{},...t.source!==void 0?{source:t.source}:{},...t.threadId!==void 0?{threadId:t.threadId}:{},...t.date!==void 0?{date:t.date}:{},...t.userIdHash!==void 0?{userIdHash:t.userIdHash}:{}}:{},nn=t=>({text:t.text,vposMs:t.vposMs,...Jr(t.meta),layout:t.layout,lane:t.lane,fontSize:t.fontSize,width:t.width,height:t.height,color:t.color,opacity:t.opacity,creationIndex:t.creationIndex}),Ve=(t,e,n,r)=>{const i=globalThis.__COMMENT_OVERLAY_TRACE__;globalThis.__COMMENT_OVERLAY_TRACE_ENABLED__!==true||typeof i!="function"||i({source:"comment-overlay",op:t,timestampMs:tn(),font:e.font,fillStyle:ht(e.fillStyle),strokeStyle:ht(e.strokeStyle),lineWidth:e.lineWidth,lineJoin:e.lineJoin,globalAlpha:e.globalAlpha,shadowColor:e.shadowColor,shadowBlur:e.shadowBlur,shadowOffsetX:e.shadowOffsetX,shadowOffsetY:e.shadowOffsetY,transform:Xr(e),...Zr(e),comment:nn(n),...r});},Qr=(t,e,n)=>{const r=globalThis.__COMMENT_OVERLAY_TRACE__;globalThis.__COMMENT_OVERLAY_TRACE_ENABLED__!==true||typeof r!="function"||r({source:"comment-overlay",op:t,timestampMs:tn(),comment:nn(e),...n});},M={hits:0,misses:0,creates:0,fallbacks:0,outlineCallsInCache:0,fillCallsInCache:0,outlineCallsInFallback:0,fillCallsInFallback:0,letterSpacingComments:0,normalComments:0,multiLineComments:0,totalCharactersDrawn:0,lastReported:0},ut=()=>{if(!q())return;const t=performance.now();if(t-M.lastReported<=5e3)return;const e=M.hits+M.misses,n=e>0?M.hits/e*100:0,r=M.creates>0?(M.totalCharactersDrawn/M.creates).toFixed(1):"0",i=M.outlineCallsInCache+M.outlineCallsInFallback,a=M.fillCallsInCache+M.fillCallsInFallback;console.log("[TextureCache Stats]",`
  Cache: Hits=${M.hits}, Misses=${M.misses}, Hit Rate=${n.toFixed(1)}%`,`
  Creates: ${M.creates}, Fallbacks: ${M.fallbacks}`,`
  Comments: Normal=${M.normalComments}, LetterSpacing=${M.letterSpacingComments}, MultiLine=${M.multiLineComments}`,`
  Draw Calls: Outline=${i}, Fill=${a}`,`
  Avg Characters/Comment: ${r}`),M.lastReported=t;},ei=()=>typeof OffscreenCanvas<"u",We=(t,e,n)=>{if(t==="none")return {blur:0,alpha:0};const r={light:.06,medium:.1,strong:.15}[t],i={light:.6,medium:.8,strong:.95}[t],a=Math.max(2,e*r),s=B(n*i);return {blur:a,alpha:s}},Be=()=>2.8,rn=665,ti=566,_e=808,pt=ti/rn,mt=_e/rn,ni=1098,ri=1530,gt=20.9,ft=58.9,bt=45.23908523908523/39,ii=14.9,ai=41.9,si=28.92708257149126/27,vt=20,yt=11.4,xt=31.4,wt=23.87692307692307,oi=2.4,Se=2,St=66.9,Ct=55.6,li=59,ci=810,di=21.5,an=878,sn=900,hi=10,ui=6.75,pi=16.75,mi=12.11423203055002,gi=.5,fi=1.42,bi=.12,vi=t=>{const e=t.trim().toLowerCase();if(e==="black")return  true;const n=e.match(/^#([0-9a-f]{3,8})$/i);if(!n)return  false;const r=n[1],i=r.length===3||r.length===4,a=d=>d.length===1?`${d}${d}`:d,s=Number.parseInt(a(i?r[0]:r.slice(0,2)),16),o=Number.parseInt(a(i?r[1]:r.slice(2,4)),16),l=Number.parseInt(a(i?r[2]:r.slice(4,6)),16);return s===0&&o===0&&l===0},qe=t=>vi(t.color)?"rgba(255, 255, 255, 0.4)":"rgba(0, 0, 0, 0.4)",yi=(t,e)=>`${t.fontWeight?`${t.fontWeight} `:""}${e}px ${t.fontFamily}`,xi=(t,e)=>{if(!t.isScrolling)return e+t.fontSize;const n=t.fontSize<=18?t.fontSize*.08:0;return t.fontSize*1.5+n},on=t=>{if(t.isScrolling&&t.isFull){if(t.hasSameVposFullMinchoEnder){const o=Math.ceil(t.height);return {paddingX:Math.max(10,t.fontSize*.5),paddingY:o>=sn?St:o>=an?Ct:di,textureWidth:Math.ceil(t.width),textureHeight:o}}const s=t.hasSameVposFullMinchoEnder&&t.isEnder?t.fontSize>=35?St:Ct:null;return {paddingX:Math.max(10,t.fontSize*.5),paddingY:s??(t.fontSize>=35?t.fontSize*.5:Math.max(18,t.fontSize))+oi,textureWidth:Math.ceil(t.width),textureHeight:Math.ceil(t.height)}}if(t.isScrolling&&t.lines.length>1){const s=t.fontSize*1.3333333333333333,o=t.fontSize;return {paddingX:s,paddingY:o,textureWidth:Math.ceil(t.width+s*2),textureHeight:Math.ceil(t.height+t.fontSize*6.1)}}if(!t.isScrolling){const s=Math.ceil(t.lines.length>1?t.height:t.height+t.fontSize/3);return {paddingX:0,paddingY:Math.max(0,(s-t.height)/2),textureWidth:Math.ceil(t.width+0),textureHeight:s}}const e=t.isScrolling?t.fontSize*1.15:Math.max(10,t.fontSize*.5),n=t.fontSize,r=t.isScrolling?Math.round(n*(40/9)):t.height+t.fontSize/3,i=Math.ceil(Math.max(t.height+Math.max(10,t.fontSize),r)),a=t.isScrolling?t.fontSize:Math.max(0,(i-t.height)/2);return {paddingX:e,paddingY:a,textureWidth:Math.ceil(t.isScrolling?t.width*2+e*2:t.width+e*2),textureHeight:i}},wi=t=>!t.isScrolling&&t.width>=1200&&t.fontSize>=35?.8:1,ln=t=>!t.isScrolling&&t.width>=1200&&t.fontSize>=35,cn=t=>ln(t)&&(t.fontFamily.includes("Yu Mincho")||t.fontFamily.includes("YuMincho")||t.fontFamily.includes("游明朝")),Si=(t,e)=>cn(t)?fi:e,Ci=t=>Math.max(1,t.width+t.virtualStartX*2),Mi=t=>t.isScrolling&&t.isFull&&t.hasSameVposFullMinchoEnder?li*Math.min(1,t.height/ci):0,Ei=(t,e,n,r,i)=>{const a=Si(t,i);if(cn(t))return {x:Ci(t)*bi,scaleX:a,scaleY:i};const s=!t.isScrolling&&a!==1?e.width*(1-a)*gi:0;return {x:n-r+s+Mi(t),scaleX:a,scaleY:i}},Ue=(t,e,n,r,i)=>(a,s,o,l=0)=>{if(a.length===0)return;const d=i+l,h=()=>{r==="cache"?o==="outline"?M.outlineCallsInCache++:M.fillCallsInCache++:o==="outline"?M.outlineCallsInFallback++:M.fillCallsInFallback++;},c=(m,g,w)=>{if(h(),o==="outline"){e.strokeText(m,g,s),Ve("strokeText",e,t,{text:m,x:g,y:s,meta:{statsTarget:r,mode:o,...w}});return}e.fillText(m,g,s),Ve("fillText",e,t,{text:m,x:g,y:s,meta:{statsTarget:r,mode:o,...w}});};if(Math.abs(t.letterSpacing)<Number.EPSILON){c(a,d);return}let u=d;for(let m=0;m<a.length;m+=1){const g=a[m];c(g,u,{characterIndex:m});const w=$e(n,g);u+=w,m<a.length-1&&(u+=t.letterSpacing);}},Ti=t=>`v8::${t.text}::${t.fontSize}::${t.fontFamily}::${t.fontWeight}::${t.color}::${t.opacity}::${t.renderStyle}::${t.letterSpacing}::${t.lineHeightPx}::${t.width}::${t.height}::${t.lines.length}`,Mt=(t,e,n)=>{const r=new OffscreenCanvas(n.width,n.height),i=r.getContext("2d");if(!i)return null;i.save(),i.font=n.sourceFont?fe(t):yi(t,n.fontSize);const a=B(t.opacity),s=ze(t.color,a),o=t.renderStyle==="outline-only",l=o?{blur:0,alpha:0}:We(t.shadowIntensity,n.fontSize,a);i.shadowColor=`rgba(0, 0, 0, ${l.alpha})`,i.shadowBlur=l.blur,i.shadowOffsetX=0,i.shadowOffsetY=0,i.lineJoin="round",i.lineWidth=Be(),i.strokeStyle=qe(t),i.fillStyle=s,typeof n.canvasScale=="number"&&i.scale(n.canvasScale,n.canvasScale);const d=t.lines.length>0?t.lines:[t.text],h=Ue(t,i,e,"cache",n.paddingX);return o&&d.forEach((c,u)=>{h(c,n.baselineY+u*n.lineHeight,"outline");}),d.forEach((c,u)=>{h(c,n.baselineY+u*n.lineHeight,"fill");}),i.restore(),r},ki=(t,e,n)=>{for(const r of n.traces??[])Mt(t,e,r);return Mt(t,e,n.output)},Vi=(t,e,n)=>{if(t.isScrolling&&t.isFull&&t.fontSize>=35&&Math.abs(e-t.height*(pt/mt))<=2&&Math.abs(n-e*(mt/pt))<=3){const r=n/_e;return {traces:[{width:Math.round(ni*r),height:Math.round(ri*r),fontSize:t.fontSize,paddingX:gt*r,baselineY:ft*r,lineHeight:t.fontSize*bt,sourceFont:true}],output:{width:e,height:n,fontSize:vt*r,paddingX:yt*r,baselineY:xt*r,lineHeight:wt*r}}}if(t.isScrolling&&t.isFull&&t.hasSameVposFullMinchoEnder){if(n<=an-1){const r=n/_e;return {output:{width:e,height:n,fontSize:vt*r,paddingX:yt*r,baselineY:xt*r,lineHeight:wt*r,canvasScale:Se}}}return n<sn?{output:{width:e,height:n,fontSize:t.fontSize,paddingX:ii,baselineY:ai,lineHeight:t.fontSize*si,canvasScale:Se,sourceFont:true}}:{output:{width:e,height:n,fontSize:t.fontSize,paddingX:gt,baselineY:ft,lineHeight:t.fontSize*bt,canvasScale:Se,sourceFont:true}}}return ln(t)?{output:{width:e,height:n,fontSize:hi,paddingX:ui,baselineY:pi,lineHeight:mi}}:null},_i=(t,e)=>{if(!ei())return null;const n=Math.abs(t.letterSpacing)>=Number.EPSILON,r=t.lines.length>1;n&&M.letterSpacingComments++,r&&M.multiLineComments++,!n&&!r&&M.normalComments++,M.totalCharactersDrawn+=t.text.length;const{paddingX:i,paddingY:a,textureWidth:s,textureHeight:o}=on(t),l=Vi(t,s,o);if(l)return ki(t,e,l);const d=new OffscreenCanvas(s,o),h=d.getContext("2d");if(!h)return null;h.save(),h.font=fe(t);const c=B(t.opacity),u=i,m=t.lines.length>0?t.lines:[t.text],g=t.lines.length>1&&t.lineHeightPx>0?t.lineHeightPx:t.fontSize,w=xi(t,a),x=Ue(t,h,e,"cache",u),b=ze(t.color,c),y=t.renderStyle==="outline-only",E=y?{blur:0,alpha:0}:We(t.shadowIntensity,t.fontSize,c);return q()&&console.log("[Shadow Debug - Cache]",`
  Text: "${t.text}"`,`
  FontSize: ${t.fontSize}`,`
  Shadow intensity: ${t.shadowIntensity}`,`
  Shadow blur: ${E.blur}px`,`
  Shadow alpha: ${E.alpha}`,`
  Fill style: ${b}`),h.save(),h.shadowColor=`rgba(0, 0, 0, ${E.alpha})`,h.shadowBlur=E.blur,h.shadowOffsetX=0,h.shadowOffsetY=0,h.lineJoin="round",h.lineWidth=Be(),h.strokeStyle=qe(t),h.fillStyle=b,y&&m.forEach((V,G)=>{const K=w+G*g;x(V,K,"outline");}),m.forEach((V,G)=>{const K=w+G*g;x(V,K,"fill");}),h.restore(),h.restore(),d},Ii=(t,e,n)=>{M.fallbacks++,e.save(),e.font=fe(t);const r=B(t.opacity),i=n??t.x,a=t.lines.length>0?t.lines:[t.text],s=t.lines.length>1&&t.lineHeightPx>0?t.lineHeightPx:t.fontSize,o=t.y+t.fontSize,l=Ue(t,e,e,"fallback",i),d=ze(t.color,r),h=t.renderStyle==="outline-only",c=h?{blur:0,alpha:0}:We(t.shadowIntensity,t.fontSize,r);q()&&console.log("[Shadow Debug - Fallback]",`
  Text: "${t.text}"`,`
  FontSize: ${t.fontSize}`,`
  Shadow intensity: ${t.shadowIntensity}`,`
  Shadow blur: ${c.blur}px`,`
  Shadow alpha: ${c.alpha}`,`
  Fill style: ${d}`),e.save(),e.shadowColor=`rgba(0, 0, 0, ${c.alpha})`,e.shadowBlur=c.blur,e.shadowOffsetX=0,e.shadowOffsetY=0,e.lineJoin="round",e.lineWidth=Be(),e.strokeStyle=qe(t),e.fillStyle=d,h&&a.forEach((u,m)=>{const g=o+m*s;l(u,g,"outline");}),a.forEach((u,m)=>{const g=o+m*s;l(u,g,"fill");}),e.restore(),e.restore();},Ai=(t,e,n)=>{try{if(!t.isActive||!e)return;const r=Ti(t),i=t.getCachedTexture();if(t.getTextureCacheKey()!==r||!i){M.misses++,M.creates++;const s=_i(t,e);t.setCachedTexture(s),t.setTextureCacheKey(r);}else M.hits++;const a=t.getCachedTexture();if(a){const s=n??t.x,{paddingX:o,paddingY:l}=on(t),d=wi(t),h=Ei(t,a,s,o,d),c=h.x,u=t.isScrolling?t.y:t.y-l;h.scaleX===1&&h.scaleY===1?e.drawImage(a,c,u):e.drawImage(a,c,u,a.width*h.scaleX,a.height*h.scaleY),Ve("drawImage",e,t,{x:c,y:u,width:a.width*h.scaleX,height:a.height*h.scaleY,sourceWidth:a.width,sourceHeight:a.height,meta:{statsTarget:"cache",paddingX:o,paddingY:l,drawScale:d,drawScaleX:h.scaleX,drawScaleY:h.scaleY}}),ut();return}Ii(t,e,n),ut();}catch(r){Ne.error("Comment.draw",r,{text:t.text,isActive:t.isActive,hasContext:!!e,interpolatedX:n});}},Li=t=>t==="ltr"?"ltr":"rtl",Fi=t=>t==="ltr"?1:-1;class dn{text;vposMs;commands;layout;isScrolling;size;sizeScale;opacityMultiplier;opacityOverride;colorOverride;isInvisible;isFull;isEnder;meta;hasSameVposFullMinchoEnder=false;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily;fontWeight;opacity;activationTimeMs=null;staticExpiryTimeMs=null;isActive=false;hasShown=false;isPaused=false;lastUpdateTime=0;reservationWidth=0;bufferWidth=0;visibleDurationMs=0;totalDurationMs=0;preCollisionDurationMs=0;speedPixelsPerMs=0;virtualStartX=0;exitThreshold=0;scrollDirection="rtl";renderStyle="outline-only";shadowIntensity="medium";creationIndex=0;letterSpacing=0;lineHeightMultiplier=1;lineHeightPx=0;lines=[];epochId=0;directionSign=-1;timeSource;lastSyncedSettingsVersion=-1;cachedTexture=null;textureCacheKey="";constructor(e,n,r,i,a={},s=null){if(typeof e!="string")throw new Error("Comment text must be a string");if(!Number.isFinite(n)||n<0)throw new Error("Comment vposMs must be a non-negative number");this.text=e,this.vposMs=n,this.commands=Array.isArray(r)?[...r]:[],this.meta=s?{...s}:null;const o=Un(this.commands,{defaultColor:i.commentColor});this.layout=o.layout,this.isScrolling=this.layout==="naka",this.size=o.size,this.sizeScale=o.sizeScale,this.opacityMultiplier=o.opacityMultiplier,this.opacityOverride=o.opacityOverride,this.colorOverride=o.colorOverride,this.isInvisible=o.isInvisible,this.isFull=o.isFull,this.isEnder=o.isEnder,this.fontFamily=o.fontFamily,this.fontWeight=o.fontWeight,this.color=o.resolvedColor,this.opacity=this.getEffectiveOpacity(i.commentOpacity),this.renderStyle=i.renderStyle,this.shadowIntensity=i.shadowIntensity,this.letterSpacing=o.letterSpacing,this.lineHeightMultiplier=o.lineHeight,this.timeSource=a.timeSource??Xt(),this.applyScrollDirection(i.scrollDirection),this.syncWithSettings(i,a.settingsVersion);}prepare(e,n,r,i){qr(this,e,n,r,i);}draw(e,n=null){Ai(this,e,n);}update(e=1,n=false){try{if(!this.isActive){this.isPaused=n;return}const r=this.timeSource.now();if(!this.isScrolling){this.isPaused=n,this.lastUpdateTime=r;return}if(n){this.isPaused=!0,this.lastUpdateTime=r;return}const i=(r-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*e,this.x+=this.speed*i*this.directionSign,(this.scrollDirection==="rtl"&&this.x<=this.exitThreshold||this.scrollDirection==="ltr"&&this.x>=this.exitThreshold)&&(this.isActive=!1),this.lastUpdateTime=r,this.isPaused=!1;}catch(r){Ne.error("Comment.update",r,{text:this.text,playbackRate:e,isPaused:n,isActive:this.isActive});}}syncWithSettings(e,n){typeof n=="number"&&n===this.lastSyncedSettingsVersion||(this.color=this.getEffectiveColor(e.commentColor),this.opacity=this.getEffectiveOpacity(e.commentOpacity),this.applyScrollDirection(e.scrollDirection),this.renderStyle=e.renderStyle,this.shadowIntensity=e.shadowIntensity,typeof n=="number"&&(this.lastSyncedSettingsVersion=n));}getEffectiveColor(e){const n=this.colorOverride??e;return typeof n!="string"||n.length===0?e:n.toUpperCase()}getEffectiveOpacity(e){if(typeof this.opacityOverride=="number")return B(this.opacityOverride);const n=e*this.opacityMultiplier;return Number.isFinite(n)?B(n):0}markActivated(e){this.activationTimeMs=e;}clearActivation(){this.activationTimeMs=null,this.isScrolling||(this.staticExpiryTimeMs=null),this.resetTextureCache();}hasStaticExpired(e){return this.isScrolling||this.staticExpiryTimeMs===null?false:e>=this.staticExpiryTimeMs}getDirectionSign(){return this.directionSign}getTimeSource(){return this.timeSource}getTextureCacheKey(){return this.textureCacheKey}setTextureCacheKey(e){this.textureCacheKey=e;}getCachedTexture(){return this.cachedTexture}setCachedTexture(e){this.cachedTexture=e;}resetTextureCache(){this.cachedTexture=null,this.textureCacheKey="";}applyScrollDirection(e){const n=Li(e);this.scrollDirection=n,this.directionSign=Fi(n);}}const Pi=6700,Ce={commentColor:"#FFFFFF",commentOpacity:1,isCommentVisible:true,useContainerResizeObserver:true,ngWords:[],ngRegexps:[],scrollDirection:"rtl",renderStyle:"outline-only",syncMode:"raf",scrollVisibleDurationMs:Pi,useFixedLaneCount:false,fixedLaneCount:12,useDprScaling:true,shadowIntensity:"medium"},hn=()=>({...Ce,ngWords:[...Ce.ngWords],ngRegexps:[...Ce.ngRegexps]}),Ri=t=>Number.isFinite(t)?t<=0?0:t>=1?1:t:1,he=t=>{const e=t.scrollVisibleDurationMs,n=e==null?null:Number.isFinite(e)?Math.max(1,Math.floor(e)):null;return {...t,scrollDirection:t.scrollDirection==="ltr"?"ltr":"rtl",commentOpacity:Ri(t.commentOpacity),renderStyle:t.renderStyle==="classic"?"classic":"outline-only",scrollVisibleDurationMs:n,syncMode:t.syncMode==="video-frame"?"video-frame":"raf",useDprScaling:!!t.useDprScaling}},Di=t=>typeof window<"u"&&typeof window.requestAnimationFrame=="function"&&typeof window.cancelAnimationFrame=="function"?{request:e=>window.requestAnimationFrame(e),cancel:e=>window.cancelAnimationFrame(Number(e))}:{request:e=>globalThis.setTimeout(()=>{e(t.now());},16),cancel:e=>{globalThis.clearTimeout(e);}},Hi=()=>typeof document>"u"?()=>{throw new Error("Document is not available. Provide a custom createCanvasElement implementation.")}:()=>document.createElement("canvas"),zi=t=>{if(!t||typeof t!="object")return  false;const e=t;return typeof e.commentColor=="string"&&typeof e.commentOpacity=="number"&&typeof e.isCommentVisible=="boolean"},Et=t=>t.isScrolling&&t.isFull&&t.text.includes(`
`)&&t.commands.some(e=>e.toLowerCase()==="mincho"),Oi=t=>{const e=new Set;t.forEach(n=>{n.isEnder&&Et(n)&&e.add(n.vposMs);}),t.forEach(n=>{n.hasSameVposFullMinchoEnder=e.has(n.vposMs)&&Et(n);});},Tt=t=>{const e=t.meta?.no;return typeof e=="number"&&Number.isFinite(e)?e:null},Ni=function(t){if(!Array.isArray(t)||t.length===0)return [];const e=[];this.commentDependencies.settingsVersion=this.settingsVersion;for(const n of t){const{text:r,vposMs:i,commands:a=[],meta:s=null}=n,o=oe(r);if(this.isNGComment(r)){k("comment-skip-ng",{preview:o,vposMs:i});continue}const l=Kn(i);if(l===null){this.log.warn("CommentRenderer.addComment.invalidVpos",{text:r,vposMs:i}),k("comment-skip-invalid-vpos",{preview:o,vposMs:i});continue}const d=s?.no!==void 0?`no:${s.source??""}:${s.fork??""}:${s.threadId??""}:${s.no}`:`fallback:${r}\0${l}`,h=u=>u.meta?.no!==void 0?`no:${u.meta.source??""}:${u.meta.fork??""}:${u.meta.threadId??""}:${u.meta.no}`:`fallback:${u.text}\0${u.vposMs}`;if(this.comments.some(u=>h(u)===d)||e.some(u=>h(u)===d)){k("comment-skip-duplicate",{preview:o,vposMs:l});continue}const c=new dn(r,l,a,this._settings,this.commentDependencies,s);c.creationIndex=this.commentSequence++,c.epochId=this.epochId,e.push(c),k("comment-added",{preview:o,vposMs:l,commands:c.commands.length,layout:c.layout,isScrolling:c.isScrolling,invisible:c.isInvisible});}return e.length===0?[]:(this.comments.push(...e),Oi(this.comments),this.finalPhaseActive&&(this.finalPhaseScheduleDirty=true),this.comments.sort((n,r)=>{const i=n.vposMs-r.vposMs;if(Math.abs(i)>F)return i;const a=Tt(n),s=Tt(r);return a!==null&&s!==null&&Math.abs(a-s)>F?a-s:n.creationIndex-r.creationIndex}),e)},$i=function(t,e,n=[],r=null){const[i]=this.addComments([{text:t,vposMs:e,commands:n,meta:r}]);return i??null},Wi=function(){if(this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.commentSequence=0,this.ctx&&this.canvas){const t=this.canvasDpr>0?this.canvasDpr:1,e=this.displayWidth>0?this.displayWidth:this.canvas.width/t,n=this.displayHeight>0?this.displayHeight:this.canvas.height/t;this.ctx.clearRect(0,0,e,n);}},Bi=function(){this.clearComments(),this.currentTime=0,this.resetFinalPhaseState(),this.playbackHasBegun=false,this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false;},un=function(){const t=this._settings,e=Array.isArray(t.ngWords)?t.ngWords:[];this.normalizedNgWords=e.filter(r=>typeof r=="string");const n=Array.isArray(t.ngRegexps)?t.ngRegexps:[];this.compiledNgRegexps=n.map(r=>{if(typeof r!="string")return null;try{return new RegExp(r,"i")}catch(i){return this.log.warn("CommentRenderer.invalidNgRegexp",i,{entry:r}),null}}).filter(r=>!!r);},qi=function(t){return typeof t!="string"||t.length===0?false:this.normalizedNgWords.some(e=>e.length>0&&t.includes(e))?true:this.compiledNgRegexps.some(e=>e.test(t))},Ui=t=>{t.prototype.addComments=Ni,t.prototype.addComment=$i,t.prototype.clearComments=Wi,t.prototype.resetState=Bi,t.prototype.rebuildNgMatchers=un,t.prototype.isNGComment=qi;},Yi=function(){this.finalPhaseActive=false,this.finalPhaseStartTime=null,this.finalPhaseScheduleDirty=false,this.finalPhaseVposOverrides.clear();},Gi=function(t){const e=this.epochId;if(this.epochId+=1,jr(e,this.epochId,t),this.eventHooks.onEpochChange){const n={previousEpochId:e,newEpochId:this.epochId,reason:t,timestamp:this.timeSource.now()};try{this.eventHooks.onEpochChange(n);}catch(r){this.log.error("CommentRenderer.incrementEpoch.callback",r,{info:n});}}this.comments.forEach(n=>{n.epochId=this.epochId;});},Ki=function(t){const e=this.timeSource.now();if(e-this.lastSnapshotEmitTime<this.snapshotEmitThrottleMs)return;const n={currentTime:this.currentTime,duration:this.duration,isPlaying:this.isPlaying,epochId:this.epochId,totalComments:this.comments.length,activeComments:this.activeComments.size,reservedLanes:this.reservedLanes.size,finalPhaseActive:this.finalPhaseActive,playbackHasBegun:this.playbackHasBegun,isStalled:this.isStalled};if(Kr(t,n),this.eventHooks.onStateSnapshot)try{this.eventHooks.onStateSnapshot(n);}catch(r){this.log.error("CommentRenderer.emitStateSnapshot.callback",r);}this.lastSnapshotEmitTime=e;},ji=function(t){this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline();const e=this.finalPhaseVposOverrides.get(t);return e!==void 0?e:pn(t)},pn=t=>{if(!t.isScrolling)return t.vposMs;const e=t.isFull?ar:rr;return Math.max(0,t.vposMs-e)},Xi=function(t){if(!t.isScrolling)return $;const e=[];return Number.isFinite(t.visibleDurationMs)&&t.visibleDurationMs>0&&e.push(t.visibleDurationMs),Number.isFinite(t.totalDurationMs)&&t.totalDurationMs>0&&e.push(t.totalDurationMs),e.length>0?Math.max(...e):Oe},Zi=function(t){if(!this.finalPhaseActive||this.finalPhaseStartTime===null)return this.finalPhaseVposOverrides.delete(t),pn(t);this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline();const e=this.finalPhaseVposOverrides.get(t);if(e!==void 0)return e;const n=Math.max(t.vposMs,this.finalPhaseStartTime);return this.finalPhaseVposOverrides.set(t,n),n},Ji=function(){if(!this.finalPhaseActive||this.finalPhaseStartTime===null){this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=false;return}const t=this.finalPhaseStartTime,e=this.duration>0?this.duration:t+ie,n=Math.max(t+ie,e),r=this.comments.filter(l=>l.hasShown||l.isInvisible||this.isNGComment(l.text)?false:l.vposMs>=t-z).sort((l,d)=>{const h=l.vposMs-d.vposMs;return Math.abs(h)>F?h:l.creationIndex-d.creationIndex});if(this.finalPhaseVposOverrides.clear(),r.length===0){this.finalPhaseScheduleDirty=false;return}const i=Math.max(n-t,ie)/Math.max(r.length,1),a=Number.isFinite(i)?i:xe,s=Math.max(xe,Math.min(a,er));let o=t;r.forEach((l,d)=>{const h=Math.max(1,this.getFinalPhaseDisplayDuration(l)),c=n-h;let u=Math.max(t,Math.min(o,c));Number.isFinite(u)||(u=t);const m=tr*d;u+m<=c&&(u+=m),this.finalPhaseVposOverrides.set(l,u);const g=Math.max(xe,Math.min(h/2,s));o=u+g;}),this.finalPhaseScheduleDirty=false;},Qi=t=>{t.prototype.resetFinalPhaseState=Yi,t.prototype.incrementEpoch=Gi,t.prototype.emitStateSnapshot=Ki,t.prototype.getEffectiveCommentVpos=ji,t.prototype.getFinalPhaseDisplayDuration=Xi,t.prototype.resolveFinalPhaseVpos=Zi,t.prototype.recomputeFinalPhaseTimeline=Ji;},ea=function(){return !this.playbackHasBegun&&!this.isPlaying&&this.currentTime<=U},ta=function(){this.playbackHasBegun||(this.isPlaying||this.currentTime>U)&&(this.playbackHasBegun=true);},na=t=>{t.prototype.shouldSuppressRendering=ea,t.prototype.updatePlaybackProgressState=ta;},ra=function(t){const e=this.videoElement,n=this.canvas,r=this.ctx;if(!e||!n||!r)return;const i=typeof t=="number"?t:P(e.currentTime);if(this.currentTime=i,this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.updatePlaybackProgressState(),this.skipDrawingForCurrentFrame=this.shouldSuppressRendering(),this.skipDrawingForCurrentFrame)return;const a=this.canvasDpr>0?this.canvasDpr:1,s=this.displayWidth>0?this.displayWidth:n.width/a,o=this.displayHeight>0?this.displayHeight:n.height/a,l=this.buildPrepareOptions(s),d=this.duration>0&&this.duration-this.currentTime<=Qn;d&&!this.finalPhaseActive&&(this.finalPhaseActive=true,this.finalPhaseStartTime=this.currentTime,this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=true,r.clearRect(0,0,s,o),this.comments.forEach(c=>{c.isActive=false,c.clearActivation();}),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0),!d&&this.finalPhaseActive&&this.resetFinalPhaseState(),this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline(),this.pruneStaticLaneReservations(this.currentTime);for(const c of Array.from(this.activeComments)){const u=this.getEffectiveCommentVpos(c),m=u<this.currentTime-z,g=u>this.currentTime+z;if(m||g){c.isActive=false,this.activeComments.delete(c),c.clearActivation(),c.lane>=0&&(c.layout==="ue"?this.releaseStaticLane("ue",c.lane):c.layout==="shita"&&this.releaseStaticLane("shita",c.lane));continue}c.isScrolling&&c.hasShown&&(c.scrollDirection==="rtl"&&c.x<=c.exitThreshold||c.scrollDirection==="ltr"&&c.x>=c.exitThreshold)&&(c.isActive=false,this.activeComments.delete(c),c.clearActivation());}const h=this.getCommentsInTimeWindow(this.currentTime,z);for(const c of h){const u=q(),m=u?oe(c.text):"";if(u&&k("comment-evaluate",{stage:"update",preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),currentTime:this.currentTime,isActive:c.isActive,hasShown:c.hasShown}),this.isNGComment(c.text)){u&&k("comment-eval-skip",{preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"ng-runtime"});continue}if(c.isInvisible){u&&k("comment-eval-skip",{preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"invisible"}),c.isActive=false,this.activeComments.delete(c),c.hasShown=true,c.clearActivation();continue}if(c.syncWithSettings(this._settings,this.settingsVersion),this.shouldActivateCommentAtTime(c,this.currentTime,m)&&this.activateComment(c,r,s,o,l,this.currentTime),c.isActive){if(c.layout!=="naka"&&c.hasStaticExpired(this.currentTime)){const g=c.layout==="ue"?"ue":"shita";this.releaseStaticLane(g,c.lane),c.isActive=false,this.activeComments.delete(c),c.clearActivation();continue}if(c.layout==="naka"&&this.getEffectiveCommentVpos(c)>this.currentTime+U){c.x=c.virtualStartX,c.lastUpdateTime=this.timeSource.now();continue}if(c.hasShown=true,c.update(this.playbackRate,!this.isPlaying),!c.isScrolling&&c.hasStaticExpired(this.currentTime)){const g=c.layout==="ue"?"ue":"shita";this.releaseStaticLane(g,c.lane),c.isActive=false,this.activeComments.delete(c),c.clearActivation();}}}},ia=function(t){const e=this._settings.scrollVisibleDurationMs;let n=Oe,r=Qe;return e!==null&&(n=e,r=Math.max(1,Math.min(e,Qe))),{visibleWidth:t,virtualExtension:nr,maxVisibleDurationMs:n,minVisibleDurationMs:r,maxWidthRatio:jn,bufferRatio:Xn,baseBufferPx:Zn,entryBufferPx:Jn}},aa=function(t){const e=this.currentTime;this.pruneLaneReservations(e),this.pruneStaticLaneReservations(e);const n=this.getLanePriorityOrder(e),r=this.createLaneReservation(t,e),i=n.map(l=>{const d=(this.reservedLanes.get(l)??[]).find(h=>this.areReservationsConflicting(h,r));return {lane:l,available:d===void 0,nextAvailableTime:this.getLaneNextAvailableTime(l,e),blocker:d}}),a=i.find(l=>l.available),s=n[n.length-1]??0,o=a?.lane??s;return this.storeLaneReservation(o,r),Qr("laneDecision",t,{meta:{currentTimeMs:e,selectedLane:o,usedFallback:a===void 0,candidateLanes:i.map(l=>l.lane).join(","),availableLanes:i.filter(l=>l.available).map(l=>l.lane).join(","),nextAvailableTimes:i.map(l=>Math.round(l.nextAvailableTime)).join(","),blockedBy:i.map(l=>l.blocker?`${l.lane}:${l.blocker.comment.creationIndex}@${l.blocker.comment.vposMs}`:`${l.lane}:-`).join(","),reservationStartTimeMs:Math.round(r.startTime),reservationEndTimeMs:Math.round(r.endTime),reservationTotalEndTimeMs:Math.round(r.totalEndTime),reservationWidth:Math.round(r.width)}}),o},sa=t=>{t.prototype.updateComments=ra,t.prototype.buildPrepareOptions=ia,t.prototype.findAvailableLane=aa;},oa=function(t,e){let n=0,r=t.length;for(;n<r;){const i=Math.floor((n+r)/2),a=t[i];a!==void 0&&a.totalEndTime+ge<=e?n=i+1:r=i;}return n},la=function(t){for(const[e,n]of this.reservedLanes.entries()){const r=this.findFirstValidReservationIndex(n,t);r>=n.length?this.reservedLanes.delete(e):r>0&&this.reservedLanes.set(e,n.slice(r));}},ca=function(t){const e=i=>i.filter(a=>a.releaseTime>t),n=e(this.topStaticLaneReservations),r=e(this.bottomStaticLaneReservations);this.topStaticLaneReservations.length=0,this.topStaticLaneReservations.push(...n),this.bottomStaticLaneReservations.length=0,this.bottomStaticLaneReservations.push(...r);},da=t=>{t.prototype.findFirstValidReservationIndex=oa,t.prototype.pruneLaneReservations=la,t.prototype.pruneStaticLaneReservations=ca;},ha=function(t){let e=0,n=this.comments.length;for(;e<n;){const r=Math.floor((e+n)/2),i=this.comments[r];i!==void 0&&i.vposMs<t?e=r+1:n=r;}return e},ua=function(t,e){if(this.comments.length===0)return [];const n=t-e,r=t+e,i=this.findCommentIndexAtOrAfter(n),a=[];for(let s=i;s<this.comments.length;s++){const o=this.comments[s];if(o){if(o.vposMs>r)break;a.push(o);}}return a},pa=function(t){return t==="ue"?this.topStaticLaneReservations:this.bottomStaticLaneReservations},ma=function(t){return t==="ue"?this.topStaticLaneReservations.length:this.bottomStaticLaneReservations.length},ga=function(t){const e=t==="ue"?"shita":"ue",n=this.getStaticLaneDepth(e),r=this.laneCount-n;return r<=0?-1:r-1},fa=function(t){return Math.max(0,this.laneCount-1-t)},ba=t=>{const e=Math.ceil(t.lines.length>1?t.height:t.height+t.fontSize/3);return Math.max(0,(e-t.height)/2)},va=function(t,e,n,r){const i=Math.max(1,n),a=Math.max(r.height,r.fontSize),s=5,o=0,l=ba(r);if(t==="ue"){const u=s+l;let m=u;const g=this.getStaticReservations(t).filter(x=>x.lane<e).sort((x,b)=>x.lane-b.lane);for(const x of g){const b=x.yEnd-x.yStart;m+=b+o;}const w=Math.max(s,i*2);return Math.max(u,Math.min(m,w))}let d=i-s;const h=this.getStaticReservations(t).filter(u=>u.lane<e).sort((u,m)=>u.lane-m.lane);for(const u of h){const m=u.yEnd-u.yStart;d-=m+o;}const c=d-a;return Math.max(s,c)},ya=function(){const t=new Set;for(const e of this.topStaticLaneReservations)t.add(e.lane);for(const e of this.bottomStaticLaneReservations)t.add(this.getGlobalLaneIndexForBottom(e.lane));return t},xa=t=>{t.prototype.findCommentIndexAtOrAfter=ha,t.prototype.getCommentsInTimeWindow=ua,t.prototype.getStaticReservations=pa,t.prototype.getStaticLaneDepth=ma,t.prototype.getStaticLaneLimit=ga,t.prototype.getGlobalLaneIndexForBottom=fa,t.prototype.resolveStaticCommentOffset=va,t.prototype.getStaticReservedLaneSet=ya;},wa=t=>!t.isScrolling&&t.width>=1200&&t.fontSize>=35,mn=t=>Math.max(1,t.fontSize*(wa(t)?.46:1)),Sa=function(t,e,n=""){const r=n.length>0&&q(),i=this.resolveFinalPhaseVpos(t);return this.finalPhaseActive&&this.finalPhaseStartTime!==null&&t.vposMs<this.finalPhaseStartTime-F?(r&&k("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"final-phase-trimmed",finalPhaseStartTime:this.finalPhaseStartTime}),this.finalPhaseVposOverrides.delete(t),false):t.isInvisible?(r&&k("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"invisible"}),false):t.isActive?(r&&k("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"already-active"}),false):t.hasShown&&i<=e?(r&&k("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"already-shown",currentTime:e}),false):i>e+U?(r&&k("comment-eval-pending",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"future",currentTime:e}),false):i<e-z?(r&&k("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"expired-window",currentTime:e}),false):!t.isScrolling&&i+$<=e?(r&&k("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"static-expired",currentTime:e}),false):(r&&k("comment-eval-ready",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,currentTime:e}),true)},Ca=function(t,e,n,r,i,a){t.prepare(e,n,r,i);const s=this.resolveFinalPhaseVpos(t);if(q()&&k("comment-prepared",{preview:oe(t.text),layout:t.layout,isScrolling:t.isScrolling,width:t.width,height:t.height,bufferWidth:t.bufferWidth,visibleDurationMs:t.visibleDurationMs,effectiveVposMs:s}),t.layout==="naka"){const o=Math.max(0,a-s),l=t.speedPixelsPerMs*o;if(this.finalPhaseActive&&this.finalPhaseStartTime!==null){const m=this.duration>0?this.duration:this.finalPhaseStartTime+ie,g=Math.max(this.finalPhaseStartTime+ie,m),w=t.width+n,x=w>0?w/Math.max(t.speedPixelsPerMs,1):0;if(s+x>g){const b=g-a,y=Math.max(0,b)*t.speedPixelsPerMs,E=t.scrollDirection==="rtl"?Math.max(t.virtualStartX-l,n-y):Math.min(t.virtualStartX+l,y-t.width);t.x=E;}else t.x=t.scrollDirection==="rtl"?t.virtualStartX-l:t.virtualStartX+l;}else t.x=t.scrollDirection==="rtl"?t.virtualStartX-l:t.virtualStartX+l;const d=this.findAvailableLane(t);t.lane=d;const h=Math.max(1,this.laneHeight),c=Math.max(0,r-t.height),u=d*h;t.y=t.isFull?0:Math.max(0,Math.min(u,c));}else {const o=t.layout==="ue"?"ue":"shita",l=this.assignStaticLane(o,t,r,a),d=this.resolveStaticCommentOffset(o,l,r,t);t.x=t.virtualStartX,t.y=d,t.lane=o==="ue"?l:this.getGlobalLaneIndexForBottom(l),t.speed=0,t.baseSpeed=0,t.speedPixelsPerMs=0;const h=s+$;t.visibleDurationMs=Math.max(0,h-a),this.activeComments.add(t),t.isActive=true,t.hasShown=true,t.isPaused=!this.isPlaying,t.markActivated(a),t.lastUpdateTime=this.timeSource.now(),t.staticExpiryTimeMs=h,this.reserveStaticLane(o,t,l,h),q()&&k("comment-activate-static",{preview:oe(t.text),lane:t.lane,position:o,displayEnd:h,effectiveVposMs:s});return}this.activeComments.add(t),t.isActive=true,t.hasShown=true,t.isPaused=!this.isPlaying,t.markActivated(a),t.lastUpdateTime=this.timeSource.now();},Ma=function(t,e,n,r){const i=this.getStaticReservations(t),a=mn(e),s=Math.max(1,a),o=Math.max(this.laneCount,Math.ceil(Math.max(1,n)/s)+i.length+1),l=Array.from({length:o},(c,u)=>u);for(const c of l){const u=this.resolveStaticCommentOffset(t,c,n,e),m=u,g=u+a;if(!i.some(w=>w.releaseTime>r?!(g<=w.yStart||m>=w.yEnd):false))return c}let d=l[0]??0,h=Number.POSITIVE_INFINITY;for(const c of i)c.releaseTime<h&&(h=c.releaseTime,d=c.lane);return d},Ea=function(t,e,n,r){const i=this.getStaticReservations(t),a=e.y,s=e.y+mn(e);i.push({comment:e,releaseTime:r,yStart:a,yEnd:s,lane:n});},Ta=function(t,e){if(e<0)return;const n=this.getStaticReservations(t),r=n.findIndex(i=>i.lane===e);r>=0&&n.splice(r,1);},ka=t=>{t.prototype.shouldActivateCommentAtTime=Sa,t.prototype.activateComment=Ca,t.prototype.assignStaticLane=Ma,t.prototype.reserveStaticLane=Ea,t.prototype.releaseStaticLane=Ta;},Va=.001,_a=function(){return Array.from({length:this.laneCount},(t,e)=>e)},Ia=function(t,e){const n=this.reservedLanes.get(t);if(!n||n.length===0)return e;const r=this.findFirstValidReservationIndex(n,e),i=n[r];return i?Math.max(e,i.endTime+ge):e},Aa=function(t,e){const n=Math.max(t.speedPixelsPerMs,F),r=this.getEffectiveCommentVpos(t),i=Number.isFinite(r)?r:e,a=Math.max(0,i),s=Number.isFinite(t.width)&&t.width>0?t.width:t.reservationWidth,o=n>0?Math.max(s,0)/n:t.preCollisionDurationMs,l=a+o+ge,d=a+t.totalDurationMs+ge;return {comment:t,startTime:a,endTime:Math.max(a,l),totalEndTime:Math.max(a,d),startLeft:t.virtualStartX,width:s,speed:n,buffer:0,directionSign:t.getDirectionSign()}},La=function(t,e,n){const r=this.reservedLanes.get(t);if(!r||r.length===0)return  true;const i=this.findFirstValidReservationIndex(r,n);for(let a=i;a<r.length;a+=1){const s=r[a];if(s&&this.areReservationsConflicting(s,e))return  false}return  true},Fa=function(t,e){const n=[...this.reservedLanes.get(t)??[],e].sort((r,i)=>r.totalEndTime-i.totalEndTime);this.reservedLanes.set(t,n);},Pa=function(t,e){if(t.directionSign===e.directionSign){const o=t.speed>0?Math.max(t.width,0)/t.speed:0,l=e.speed>0?Math.max(e.width,0)/e.speed:0,d=Math.max(o,l);return Math.abs(e.startTime-t.startTime)+Va<d}const n=Math.max(t.startTime,e.startTime),r=Math.min(t.endTime,e.endTime);if(n>=r)return  false;const i=new Set([n,r,n+(r-n)/2]),a=this.solveLeftRightEqualityTime(t,e);a!==null&&a>=n-F&&a<=r+F&&i.add(a);const s=this.solveLeftRightEqualityTime(e,t);s!==null&&s>=n-F&&s<=r+F&&i.add(s);for(const o of i){if(o<n-F||o>r+F)continue;const l=this.computeForwardGap(t,e,o),d=this.computeForwardGap(e,t,o);if(l<=-24&&d<=-24)return  true}return  false},Ra=function(t,e,n){const r=this.getBufferedEdges(t,n),i=this.getBufferedEdges(e,n);return r.left-i.right},Da=function(t,e){const n=Math.max(0,e-t.startTime),r=t.speed*n,i=t.startLeft+t.directionSign*r,a=i-t.buffer,s=i+t.width+t.buffer;return {left:a,right:s}},Ha=function(t,e){const n=t.directionSign,r=e.directionSign,i=r*e.speed-n*t.speed;if(Math.abs(i)<F)return null;const a=(e.startLeft+r*e.speed*e.startTime+e.width+e.buffer-t.startLeft-n*t.speed*t.startTime+t.buffer)/i;return Number.isFinite(a)?a:null},za=t=>{t.prototype.getLanePriorityOrder=_a,t.prototype.getLaneNextAvailableTime=Ia,t.prototype.createLaneReservation=Aa,t.prototype.isLaneAvailable=La,t.prototype.storeLaneReservation=Fa,t.prototype.areReservationsConflicting=Pa,t.prototype.computeForwardGap=Ra,t.prototype.getBufferedEdges=Da,t.prototype.solveLeftRightEqualityTime=Ha;},Oa=function(){const t=this.canvas,e=this.ctx;if(!t||!e)return;const n=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/n,i=this.displayHeight>0?this.displayHeight:t.height/n,a=this.timeSource.now();if(this.skipDrawingForCurrentFrame||this.shouldSuppressRendering()||this.isStalled){e.clearRect(0,0,r,i),this.lastDrawTime=a;return}e.clearRect(0,0,r,i);const s=Array.from(this.activeComments);if(this._settings.isCommentVisible){const o=(a-this.lastDrawTime)/16.666666666666668;s.sort((l,d)=>{const h=this.getEffectiveCommentVpos(l),c=this.getEffectiveCommentVpos(d),u=h-c;return Math.abs(u)>F?u:l.isScrolling!==d.isScrolling?l.isScrolling?1:-1:l.creationIndex-d.creationIndex}),s.forEach(l=>{const d=this.isPlaying&&!l.isPaused?l.x+l.getDirectionSign()*l.speed*o:l.x;l.draw(e,d);});}this.lastDrawTime=a;},Na=function(t){const e=this.videoElement,n=this.canvas,r=this.ctx;if(!e||!n||!r)return;const i=typeof t=="number"?t:P(e.currentTime);this.currentTime=i,this.lastDrawTime=this.timeSource.now();const a=this.canvasDpr>0?this.canvasDpr:1,s=this.displayWidth>0?this.displayWidth:n.width/a,o=this.displayHeight>0?this.displayHeight:n.height/a,l=this.buildPrepareOptions(s);this.activeComments.forEach(d=>{d.isActive=false,d.clearActivation();}),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.getCommentsInTimeWindow(this.currentTime,z).forEach(d=>{if(this.isNGComment(d.text)||d.isInvisible){d.isActive=false,this.activeComments.delete(d),d.clearActivation();return}if(d.syncWithSettings(this._settings,this.settingsVersion),d.isActive=false,this.activeComments.delete(d),d.lane=-1,d.hasShown=false,d.clearActivation(),this.shouldActivateCommentAtTime(d,this.currentTime)){this.activateComment(d,r,s,o,l,this.currentTime);return}this.getEffectiveCommentVpos(d)<this.currentTime-z?d.hasShown=true:d.hasShown=false;});},$a=t=>{t.prototype.draw=Oa,t.prototype.performInitialSync=Na;},Wa=function(t){this.videoElement&&this._settings.isCommentVisible&&(this.pendingInitialSync&&(this.performInitialSync(t),this.pendingInitialSync=false),this.updateComments(t),this.draw());},Ba=function(){const t=this.frameId;this.frameId=null,t!==null&&this.animationFrameProvider.cancel(t),this.processFrame(),this.scheduleNextFrame();},qa=function(t,e){this.videoFrameHandle=null;const n=typeof e?.mediaTime=="number"?e.mediaTime*1e3:void 0;this.processFrame(typeof n=="number"?n:void 0),this.scheduleNextFrame();},Ua=function(){if(this._settings.syncMode!=="video-frame")return  false;const t=this.videoElement;return !!t&&typeof t.requestVideoFrameCallback=="function"&&typeof t.cancelVideoFrameCallback=="function"},Ya=function(){const t=this.videoElement;if(t){if(this.shouldUseVideoFrameCallback()){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();const e=t.requestVideoFrameCallback;typeof e=="function"&&(this.videoFrameHandle=e.call(t,this.handleVideoFrame));return}this.cancelVideoFrameCallback(),this.frameId=this.animationFrameProvider.request(this.handleAnimationFrame);}},Ga=function(){this.frameId!==null&&(this.animationFrameProvider.cancel(this.frameId),this.frameId=null);},Ka=function(){if(this.videoFrameHandle===null)return;const t=this.videoElement;t&&typeof t.cancelVideoFrameCallback=="function"&&t.cancelVideoFrameCallback(this.videoFrameHandle),this.videoFrameHandle=null;},ja=function(){this.stopAnimation(),this.scheduleNextFrame();},Xa=function(){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();},Za=function(){const t=this.canvas,e=this.ctx,n=this.videoElement;if(!t||!e||!n)return;const r=P(n.currentTime),i=Math.abs(r-this.currentTime),a=this.timeSource.now();if(a-this.lastPlayResumeTime<this.playResumeSeekIgnoreDurationMs){this.currentTime=r,this._settings.isCommentVisible&&(this.lastDrawTime=a,this.draw());return}const s=i>U;if(this.currentTime=r,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),!s){this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());return}this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;const o=this.canvasDpr>0?this.canvasDpr:1,l=this.displayWidth>0?this.displayWidth:t.width/o,d=this.displayHeight>0?this.displayHeight:t.height/o,h=this.buildPrepareOptions(l);this.getCommentsInTimeWindow(this.currentTime,z).forEach(c=>{const u=q(),m=u?oe(c.text):"";if(u&&k("comment-evaluate",{stage:"seek",preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),currentTime:this.currentTime,isActive:c.isActive,hasShown:c.hasShown}),this.isNGComment(c.text)){u&&k("comment-eval-skip",{preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"ng-runtime"}),c.isActive=false,this.activeComments.delete(c),c.clearActivation();return}if(c.isInvisible){u&&k("comment-eval-skip",{preview:m,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"invisible"}),c.isActive=false,this.activeComments.delete(c),c.hasShown=true,c.clearActivation();return}if(c.syncWithSettings(this._settings,this.settingsVersion),c.isActive=false,this.activeComments.delete(c),c.lane=-1,c.hasShown=false,c.clearActivation(),this.shouldActivateCommentAtTime(c,this.currentTime,m)){this.activateComment(c,e,l,d,h,this.currentTime);return}this.getEffectiveCommentVpos(c)<this.currentTime-z?c.hasShown=true:c.hasShown=false;}),this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());},Ja=t=>{t.prototype.processFrame=Wa,t.prototype.handleAnimationFrame=Ba,t.prototype.handleVideoFrame=qa,t.prototype.shouldUseVideoFrameCallback=Ua,t.prototype.scheduleNextFrame=Ya,t.prototype.cancelAnimationFrameRequest=Ga,t.prototype.cancelVideoFrameCallback=Ka,t.prototype.startAnimation=ja,t.prototype.stopAnimation=Xa,t.prototype.onSeek=Za;},Qa=function(t,e){if(t)return t;if(e.parentElement)return e.parentElement;if(typeof document<"u"&&document.body)return document.body;throw new Error("Cannot resolve container element. Provide container explicitly when DOM is unavailable.")},es=function(t){if(typeof getComputedStyle=="function"){getComputedStyle(t).position==="static"&&(t.style.position="relative");return}t.style.position||(t.style.position="relative");},ts=function(t){try{this.destroyCanvasOnly();const e=t instanceof HTMLVideoElement?t:t.video,n=t instanceof HTMLVideoElement?t.parentElement:t.container??t.video.parentElement,r=this.resolveContainer(n??null,e);this.videoElement=e,this.containerElement=r,this.lastVideoSource=this.getCurrentVideoSource(),this.duration=Number.isFinite(e.duration)?P(e.duration):0,this.currentTime=P(e.currentTime),this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.isStalled=!1,this.lastDrawTime=this.timeSource.now(),this.playbackHasBegun=this.isPlaying||this.currentTime>U,this.skipDrawingForCurrentFrame=this.shouldSuppressRendering();const i=this.createCanvasElement(),a=i.getContext("2d");if(!a)throw new Error("Failed to acquire 2D canvas context");i.style.position="absolute",i.style.top="0",i.style.left="0",i.style.right="0",i.style.bottom="0",i.style.display="block",i.style.pointerEvents="none",i.style.zIndex="2147483647";const s=this.containerElement;s instanceof HTMLElement&&(this.ensureContainerPositioning(s),s.appendChild(i)),this.canvas=i,this.ctx=a,this.resize(),this.calculateLaneMetrics(),this.setupVideoEventListeners(e),this.setupResizeHandling(e),this.setupFullscreenHandling(),this.setupVideoChangeDetection(e,r),this.startAnimation(),this.setupVisibilityHandling();}catch(e){throw this.log.error("CommentRenderer.initialize",e),e}},ns=function(){this.stopAnimation(),this.cleanupResizeHandling(),this.runCleanupTasks(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.videoElement=null,this.containerElement=null,this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.resetFinalPhaseState(),this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.commentSequence=0,this.playbackHasBegun=false,this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false;},rs=function(){this.stopAnimation(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.fullscreenActive=false;},is=t=>{t.prototype.resolveContainer=Qa,t.prototype.ensureContainerPositioning=es,t.prototype.initialize=ts,t.prototype.destroy=ns,t.prototype.destroyCanvasOnly=rs;},as=function(t){try{const e=()=>{this.isPlaying=!0,this.playbackHasBegun=!0;const u=this.timeSource.now();this.lastDrawTime=u,this.lastPlayResumeTime=u,this.comments.forEach(m=>{m.lastUpdateTime=u,m.isPaused=!1;});},n=()=>{this.isPlaying=!1;const u=this.timeSource.now();this.comments.forEach(m=>{m.lastUpdateTime=u,m.isPaused=!0;});},r=()=>{this.onSeek();},i=()=>{this.onSeek();},a=()=>{this.playbackRate=t.playbackRate;const u=this.timeSource.now();this.comments.forEach(m=>{m.lastUpdateTime=u;});},s=()=>{this.handleVideoMetadataLoaded(t);},o=()=>{this.duration=Number.isFinite(t.duration)?P(t.duration):0;},l=()=>{this.handleVideoSourceChange();},d=()=>{this.handleVideoStalled();},h=()=>{this.handleVideoCanPlay();},c=()=>{this.handleVideoCanPlay();};t.addEventListener("play",e),t.addEventListener("pause",n),t.addEventListener("seeking",r),t.addEventListener("seeked",i),t.addEventListener("ratechange",a),t.addEventListener("loadedmetadata",s),t.addEventListener("durationchange",o),t.addEventListener("emptied",l),t.addEventListener("waiting",d),t.addEventListener("canplay",h),t.addEventListener("playing",c),this.addCleanup(()=>t.removeEventListener("play",e)),this.addCleanup(()=>t.removeEventListener("pause",n)),this.addCleanup(()=>t.removeEventListener("seeking",r)),this.addCleanup(()=>t.removeEventListener("seeked",i)),this.addCleanup(()=>t.removeEventListener("ratechange",a)),this.addCleanup(()=>t.removeEventListener("loadedmetadata",s)),this.addCleanup(()=>t.removeEventListener("durationchange",o)),this.addCleanup(()=>t.removeEventListener("emptied",l)),this.addCleanup(()=>t.removeEventListener("waiting",d)),this.addCleanup(()=>t.removeEventListener("canplay",h)),this.addCleanup(()=>t.removeEventListener("playing",c));}catch(e){throw this.log.error("CommentRenderer.setupVideoEventListeners",e),e}},ss=function(t){this.lastVideoSource=this.getCurrentVideoSource(),this.incrementEpoch("metadata-loaded"),this.handleVideoSourceChange(t),this.resize(),this.calculateLaneMetrics(),this.onSeek(),this.emitStateSnapshot("metadata-loaded");},os=function(){const t=this.canvas,e=this.ctx;if(!t||!e)return;this.isStalled=true;const n=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/n,i=this.displayHeight>0?this.displayHeight:t.height/n;e.clearRect(0,0,r,i),this.comments.forEach(a=>{a.isActive&&(a.lastUpdateTime=this.timeSource.now());});},ls=function(){this.isStalled&&(this.isStalled=false,this.videoElement&&(this.currentTime=P(this.videoElement.currentTime),this.isPlaying=!this.videoElement.paused),this.lastDrawTime=this.timeSource.now());},cs=function(t){const e=t??this.videoElement;if(!e){this.lastVideoSource=null,this.isPlaying=false,this.resetFinalPhaseState(),this.resetCommentActivity();return}const n=this.getCurrentVideoSource();n!==this.lastVideoSource&&(this.lastVideoSource=n,this.incrementEpoch("source-change"),this.syncVideoState(e),this.resetFinalPhaseState(),this.resetCommentActivity(),this.emitStateSnapshot("source-change"));},ds=function(t){this.duration=Number.isFinite(t.duration)?P(t.duration):0,this.currentTime=P(t.currentTime),this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.isStalled=false,this.playbackHasBegun=this.isPlaying||this.currentTime>U,this.lastDrawTime=this.timeSource.now();},hs=function(){const t=this.timeSource.now(),e=this.canvas,n=this.ctx;if(this.resetFinalPhaseState(),this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false,this.playbackHasBegun=this.isPlaying||this.currentTime>U,e&&n){const r=this.canvasDpr>0?this.canvasDpr:1,i=this.displayWidth>0?this.displayWidth:e.width/r,a=this.displayHeight>0?this.displayHeight:e.height/r;n.clearRect(0,0,i,a);}this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.comments.forEach(r=>{r.isActive=false,r.isPaused=!this.isPlaying,r.hasShown=false,r.lane=-1,r.x=r.virtualStartX,r.speed=r.baseSpeed,r.lastUpdateTime=t,r.clearActivation();}),this.activeComments.clear();},us=function(t,e){if(typeof MutationObserver>"u"){this.log.debug("MutationObserver is not available in this environment. Video change detection is disabled.");return}const n=new MutationObserver(i=>{for(const a of i){if(a.type==="attributes"&&a.attributeName==="src"){const s=a.target;let o=null,l=null;if((s instanceof HTMLVideoElement||s instanceof HTMLSourceElement)&&(o=typeof a.oldValue=="string"?a.oldValue:null,l=s.getAttribute("src")),o===l)continue;this.handleVideoSourceChange(t);return}if(a.type==="childList"){for(const s of a.addedNodes)if(s instanceof HTMLSourceElement){this.handleVideoSourceChange(t);return}for(const s of a.removedNodes)if(s instanceof HTMLSourceElement){this.handleVideoSourceChange(t);return}}}});n.observe(t,{attributes:true,attributeFilter:["src"],attributeOldValue:true,childList:true,subtree:true}),this.addCleanup(()=>n.disconnect());const r=new MutationObserver(i=>{for(const a of i)if(a.type==="childList"){for(const s of a.addedNodes){const o=this.extractVideoElement(s);if(o&&o!==this.videoElement){this.initialize(o);return}}for(const s of a.removedNodes){if(s===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}if(s instanceof Element){const o=s.querySelector("video");if(o&&o===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}}}}});r.observe(e,{childList:true,subtree:true}),this.addCleanup(()=>r.disconnect());},ps=function(t){if(t instanceof HTMLVideoElement)return t;if(t instanceof Element){const e=t.querySelector("video");if(e instanceof HTMLVideoElement)return e}return null},ms=t=>{t.prototype.setupVideoEventListeners=as,t.prototype.handleVideoMetadataLoaded=ss,t.prototype.handleVideoStalled=os,t.prototype.handleVideoCanPlay=ls,t.prototype.handleVideoSourceChange=cs,t.prototype.syncVideoState=ds,t.prototype.resetCommentActivity=hs,t.prototype.setupVideoChangeDetection=us,t.prototype.extractVideoElement=ps;},gs=function(){if(typeof document>"u"||typeof document.addEventListener!="function"||typeof document.removeEventListener!="function")return;const t=()=>{if(document.visibilityState!=="visible"){this.stopAnimation();return}this._settings.isCommentVisible&&(this.handleVisibilityRestore(),this.startAnimation());};document.addEventListener("visibilitychange",t),this.addCleanup(()=>document.removeEventListener("visibilitychange",t)),document.visibilityState!=="visible"&&this.stopAnimation();},fs=function(){const t=this.canvas,e=this.ctx,n=this.videoElement;!t||!e||!n||(this.currentTime=P(n.currentTime),this.lastDrawTime=this.timeSource.now(),this.isPlaying=!n.paused,this.isStalled=false,this.pendingInitialSync=true,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),this.draw());},bs=function(t){const e=this._settings.isCommentVisible;if(this._settings.isCommentVisible=t,e===t)return;this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion;const n=this.canvas,r=this.ctx;if(!(!n||!r))if(t)this.lastDrawTime=this.timeSource.now(),this.pendingInitialSync=true,this.scheduleNextFrame();else {const i=this.canvasDpr>0?this.canvasDpr:1,a=this.displayWidth>0?this.displayWidth:n.width/i,s=this.displayHeight>0?this.displayHeight:n.height/i;r.clearRect(0,0,a,s);}},vs=t=>{t.prototype.setupVisibilityHandling=gs,t.prototype.handleVisibilityRestore=fs,t.prototype.setCommentVisibility=bs;},ys=2.1,xs=function(t,e){const n=this.videoElement,r=this.canvas,i=this.ctx;if(!n||!r)return;const a=(this.fullscreenActive&&r.parentElement instanceof HTMLElement?r.parentElement.getBoundingClientRect():null)??n.getBoundingClientRect(),s=this.canvasDpr>0?this.canvasDpr:1,o=this.displayWidth>0?this.displayWidth:r.width/s,l=this.displayHeight>0?this.displayHeight:r.height/s,d=t??a.width??o,h=e??a.height??l;if(!Number.isFinite(d)||!Number.isFinite(h)||d<=0||h<=0)return;const c=Math.max(1,Math.floor(d)),u=Math.max(1,Math.floor(h)),m=this._settings.useDprScaling?this.resolveDevicePixelRatio():1,g=Math.max(1,Math.round(c*m)),w=Math.max(1,Math.round(u*m));(this.displayWidth!==c||this.displayHeight!==u||Math.abs(this.canvasDpr-m)>Number.EPSILON||r.width!==g||r.height!==w)&&(this.displayWidth=c,this.displayHeight=u,this.canvasDpr=m,r.width=g,r.height=w,r.style.width=`${c}px`,r.style.height=`${u}px`,i&&(i.setTransform(1,0,0,1,0,0),this._settings.useDprScaling&&i.scale(m,m)),this.calculateLaneMetrics(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.performInitialSync(P(n.currentTime)),this.draw());},ws=function(){if(typeof window>"u")return 1;const t=Number(window.devicePixelRatio);return !Number.isFinite(t)||t<=0?1:t},Ss=function(){const t=this.canvas;if(!t)return;const e=this.displayHeight>0?this.displayHeight:t.height/Math.max(this.canvasDpr,1),n=Math.max(ir,Math.floor(e*(27/665)));this.laneHeight=n*ys;const r=Math.max(this.laneHeight,1),i=Math.floor(Math.max(0,e-r)/r);if(this._settings.useFixedLaneCount){const a=Number.isFinite(this._settings.fixedLaneCount)?Math.floor(this._settings.fixedLaneCount):Zt,s=Math.max(et,Math.min(i,a));this.laneCount=s;}else this.laneCount=Math.max(et,i);this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;},Cs=function(t){this.cleanupResizeHandling();let e=false;const n=()=>{if(e)return;e=true;const i=()=>{e=false,this.resize();};if(typeof requestAnimationFrame=="function"){requestAnimationFrame(i);return}i();};if(this._settings.useContainerResizeObserver&&this.isResizeObserverAvailable){const i=this.resolveResizeObserverTarget(t),a=new ResizeObserver(s=>{for(const o of s){const{width:l,height:d}=o.contentRect;l>0&&d>0?this.resize(l,d):this.resize();}});a.observe(i),this.resizeObserver=a,this.resizeObserverTarget=i;}else this.log.debug("Resize handling is disabled because neither ResizeObserver nor window APIs are available.");typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("resize",n),this.addCleanup(()=>window.removeEventListener("resize",n)));const r=typeof window<"u"?window.visualViewport:void 0;r&&typeof r.addEventListener=="function"&&(r.addEventListener("resize",n),r.addEventListener("scroll",n),this.addCleanup(()=>{r.removeEventListener("resize",n),r.removeEventListener("scroll",n);}));},Ms=function(){this.resizeObserver&&this.resizeObserverTarget&&this.resizeObserver.unobserve(this.resizeObserverTarget),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.resizeObserverTarget=null;},Es=t=>{t.prototype.resize=xs,t.prototype.resolveDevicePixelRatio=ws,t.prototype.calculateLaneMetrics=Ss,t.prototype.setupResizeHandling=Cs,t.prototype.cleanupResizeHandling=Ms;},Ts=function(){if(typeof document>"u"||typeof document.addEventListener!="function"||typeof document.removeEventListener!="function")return;const t=()=>{this.handleFullscreenChange();};["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(e=>{document.addEventListener(e,t),this.addCleanup(()=>document.removeEventListener(e,t));}),this.handleFullscreenChange();},kt=t=>{const e=()=>{const n=t.getFullscreenElement();if(n instanceof HTMLElement){const r=n.getBoundingClientRect();t.resize(r.width,r.height);return}t.resize();};typeof requestAnimationFrame=="function"&&requestAnimationFrame(e),typeof setTimeout=="function"&&setTimeout(e,80);},ks=function(t){return this.resolveFullscreenContainer(t)||(t.parentElement??t)},Vs=async function(){const t=this.canvas,e=this.videoElement;if(!t||!e)return;const n=this.containerElement??e.parentElement??null,r=this.getFullscreenElement(),i=this.resolveActiveOverlayContainer(e,n,r);if(!(i instanceof HTMLElement))return;t.parentElement!==i?(this.ensureContainerPositioning(i),i.appendChild(t)):this.ensureContainerPositioning(i);const a=r instanceof HTMLElement&&r.contains(e)?r:null,s=a!==null;if(this.fullscreenActive!==s&&(this.fullscreenActive=s,this.setupResizeHandling(e)),t.style.position="absolute",t.style.top="0",t.style.left="0",t.style.right="0",t.style.bottom="0",t.style.display="block",t.style.pointerEvents="none",t.style.zIndex="2147483647",a){const o=a.getBoundingClientRect();this.resize(o.width,o.height),kt(this);return}this.resize(),kt(this);},_s=function(t){const e=this.getFullscreenElement();return e instanceof HTMLElement&&(e===t||e.contains(t))?e:null},Is=function(t,e,n){return n instanceof HTMLElement&&n.contains(t)?n instanceof HTMLVideoElement&&e instanceof HTMLElement?e:n:e??null},As=function(){if(typeof document>"u")return null;const t=document;return document.fullscreenElement??t.webkitFullscreenElement??t.mozFullScreenElement??t.msFullscreenElement??null},Ls=t=>{t.prototype.setupFullscreenHandling=Ts,t.prototype.resolveResizeObserverTarget=ks,t.prototype.handleFullscreenChange=Vs,t.prototype.resolveFullscreenContainer=_s,t.prototype.resolveActiveOverlayContainer=Is,t.prototype.getFullscreenElement=As;},Fs=function(t){this.cleanupTasks.push(t);},Ps=function(){for(;this.cleanupTasks.length>0;){const t=this.cleanupTasks.pop();try{t?.();}catch(e){this.log.error("CommentRenderer.cleanupTask",e);}}},Rs=t=>{t.prototype.addCleanup=Fs,t.prototype.runCleanupTasks=Ps;};class I{_settings;comments=[];activeComments=new Set;reservedLanes=new Map;topStaticLaneReservations=[];bottomStaticLaneReservations=[];log;timeSource;animationFrameProvider;createCanvasElement;commentDependencies;settingsVersion=0;normalizedNgWords=[];compiledNgRegexps=[];canvas=null;ctx=null;videoElement=null;containerElement=null;fullscreenActive=false;laneCount=Zt;laneHeight=0;displayWidth=0;displayHeight=0;canvasDpr=1;currentTime=0;duration=0;playbackRate=1;isPlaying=true;isStalled=false;lastDrawTime=0;finalPhaseActive=false;finalPhaseStartTime=null;finalPhaseScheduleDirty=false;playbackHasBegun=false;skipDrawingForCurrentFrame=false;pendingInitialSync=false;finalPhaseVposOverrides=new Map;frameId=null;videoFrameHandle=null;resizeObserver=null;resizeObserverTarget=null;isResizeObserverAvailable=typeof ResizeObserver<"u";cleanupTasks=[];commentSequence=0;epochId=0;eventHooks;lastSnapshotEmitTime=0;snapshotEmitThrottleMs=1e3;lastPlayResumeTime=0;playResumeSeekIgnoreDurationMs=500;lastVideoSource=null;rebuildNgMatchers(){un.call(this);}constructor(e=null,n=void 0){let r,i;if(zi(e))r=he({...e}),i=n??{};else {const a=e??n??{};i=typeof a=="object"?a:{},r=he(hn());}this._settings=he(r),this.timeSource=i.timeSource??Xt(),this.animationFrameProvider=i.animationFrameProvider??Di(this.timeSource),this.createCanvasElement=i.createCanvasElement??Hi(),this.commentDependencies={timeSource:this.timeSource,settingsVersion:this.settingsVersion},this.log=Jt(i.loggerNamespace??"CommentRenderer"),this.eventHooks=i.eventHooks??{},this.handleAnimationFrame=this.handleAnimationFrame.bind(this),this.handleVideoFrame=this.handleVideoFrame.bind(this),this.rebuildNgMatchers(),i.debug&&Yr(i.debug);}get settings(){return this._settings}set settings(e){this._settings=he(e),this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion,this.rebuildNgMatchers();}getVideoElement(){return this.videoElement}getCurrentVideoSource(){const e=this.videoElement;if(!e)return null;if(typeof e.currentSrc=="string"&&e.currentSrc.length>0)return e.currentSrc;const n=e.getAttribute("src");if(n&&n.length>0)return n;const r=e.querySelector("source[src]");return r&&typeof r.src=="string"?r.src:null}getCommentsSnapshot(){return [...this.comments]}}Ui(I);Qi(I);na(I);sa(I);da(I);xa(I);ka(I);za(I);$a(I);Ja(I);is(I);ms(I);vs(I);Es(I);Ls(I);Rs(I);const Y=()=>({...hn(),shadowIntensity:"strong",autoSearchEnabled:true}),Ds="v7.5.0";var Hs=typeof GM_addStyle<"u"?GM_addStyle:void 0,X=typeof GM_getValue<"u"?GM_getValue:void 0,Z=typeof GM_setValue<"u"?GM_setValue:void 0,zs=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const Os=new Set(["ar","ur"]);function Ns(t){return Os.has(t)?"rtl":"ltr"}function $s(t,e){return t.replace(/\{([a-zA-Z0-9_]+)\}/g,(n,r)=>{const i=e[r];return i===void 0?n:String(i)})}function Ws(t){const e=Object.keys(t.translations);let n=t.defaultLocale;const r=d=>{const h=d.toLowerCase(),c=t.aliases?.[h];if(c)return c;const u=e.find(g=>g.toLowerCase()===h);if(u)return u;const m=h.split("-")[0];return e.find(g=>g.toLowerCase().split("-")[0]===m)??null},i=()=>{const d=navigator.languages.length>0?navigator.languages:[navigator.language];for(const h of d){const c=r(h);if(c)return c}return t.fallbackLocale},a=d=>{const h=t.translations[n]?.[d];if(h)return h;const c=t.translations[t.fallbackLocale]?.[d];return c||(t.translations[t.defaultLocale]?.[d]??d)};return {locales:e,getLocale:()=>n,setLocale:d=>{n=d;},detectBrowserLocale:i,t:a,format:(d,h)=>$s(a(d),h),getTranslations:(d=n)=>t.translations[d]??t.translations[t.fallbackLocale],getDirection:(d=n)=>Ns(d),getMissingTranslationKeys:d=>{const h=t.translations[t.fallbackLocale],c=t.translations[d];return Object.keys(h).filter(u=>!c[u])}}}const Bs={ja:{color:"カラー",commentColor:"コメントカラー",commentOpacity:"不透明度",commentSettings:"コメント設定",commentSettingsPanel:"コメント設定パネル",commentVisibility:"コメント表示",commentVisibilityToggle:"コメント表示切替",currentVideoUnset:"オーバーレイする動画が未設定です",error:"エラー",animeTitle:"アニメタイトル",autoFillSearchForm:"検索フォームにタイトル・話数・エピソードタイトルを入力",autoSearch:"自動検索",autoSearchDescription:"視聴ページ表示時に自動でコメントを設定",autoSearchDisabledManual:"自動検索を無効にしました（手動設定モード）",autoSearchEnabled:"自動検索を有効にしました",autoSearchInfo:"自動検索についての説明",fixedPlaybackRate:"速度固定",formInput:"フォーム入力",freeInput:"自由入力",idLoadFailed:"ID情報の読込に失敗しました",idSaveFailed:"ID情報の保存に失敗しました",info:"情報",manualSearchLoadFailed:"検索設定の読込に失敗しました",manualSearchSaveFailed:"検索設定の保存に失敗しました",manualSearchPlaceholder:"検索キーワードを入力",ngRegex:"NG正規表現",ngRegexPlaceholder:"NG正規表現を1行ずつ入力",ngTab:"NG",ngWords:"NGワード",ngWordsPlaceholder:"NGワードを1行ずつ入力",noMessage:"メッセージはありません",playbackRate:"再生速度",playbackRateFixedToggle:"再生速度固定ON/OFF",postedAt:"投稿日",commentsSet:"「{title}」のコメントを設定しました",autoSetupComplete:"ニコニコ動画を自動設定しました",autoSetupError:"自動設定エラー: {message}",commentsHiddenSkip:"コメント非表示設定のためスキップしました",commentsLoadComplete:"コメントの読み込みが完了しました（{count}件）",commentsLoadErrorSelectAnother:`コメント読み込みエラー: {message}
フローティングボタンから別の動画を選択してください。`,commentsUnavailable:"コメントを取得できませんでした",commentSourceUpdated:"コメントソースを更新しました: {title}（{count}件）",commentFetchError:"コメント取得エラー: {message}",domUpdateWaitFailed:"DOM更新の待機に失敗しました: {message}",episodeChangeDetected:"エピソード切り替えを検知しました...",episodeNumberMissing:"エピソード話数を取得できませんでした",episodeSwitchError:"エピソード切り替えエラー: {message}",initializationError:"初期化エラー: {message}",initializingCommentLoader:"コメントローダーを初期化中...",manualModeSelectAnimeTitle:"手動設定モードです。フローティングボタンから検索タブを開いてアニメタイトルを設定してください。",manualModeSelectVideo:"手動設定モードです。フローティングボタンから検索タブを開いて動画を選択してください。",manualModeCommentsLoadComplete:`【手動設定モード】コメントの読み込みが完了しました（{count}件）
動画: {title}`,metadataAutoFetchFailed:"視聴ページからの自動取得に失敗しました。メタデータが取得できませんでした。",niconicoNotFound:"ニコニコ動画が見つかりませんでした",niconicoNotFoundManual:"ニコニコ動画が見つかりませんでした。手動で検索してください。",nextEpisodeAutoSetupComplete:"次のエピソードを自動設定しました",nextVideoCommentsUnavailableClear:"次の動画のコメントを取得できませんでした。コメント表示をクリアします。",noAnimeTitle:"アニメタイトルが取得できませんでした。検索精度が低下する可能性があります。",officialVideoMissingUseFirst:"公式動画が見つかりませんでした。検索結果の最初の動画を使用します。",officialVideoMissingManual:"公式動画が見つかりませんでした。手動で検索してください。",officialVideoSafeguardInfo:"公式動画セーフガードについて",unknownTitle:"不明なタイトル",structuredInput:"詳細入力",thumbnail:"サムネイル",videoDataMissing:"動画データが見つかりません。",videoId:"動画ID",videoOwner:"投稿者",videoSwitchDetected:"動画の切り替わりを検知しました...",videoSwitchError:"動画切り替えエラー: {message}",episodeNumber:"話数",episodeTitleOptional:"エピソードタイトル（任意）",commentCount:"コメント",commentCountLong:"コメント数",mylistCount:"マイリスト",mylistCountLong:"マイリスト数",officialVideoMissing:"公式動画が見つかりませんでした。全ての検索結果を表示しています。",searchingKeyword:"「{keyword}」を検索中...",searchKeywordRequired:"検索キーワードを入力してください",searchNoResults:"検索結果が見つかりませんでした",searchFormFilled:"「{keyword}」を検索フォームに入力しました",similarity:"類似度: {score}%",viewCount:"再生",viewCountLong:"再生数",search:"検索",searchAnimePlaceholder:"例: 葬送のフリーレン",searchEpisodeNumberPlaceholder:"例: 第1話",searchEpisodeTitlePlaceholder:"例: 冒険の終わり",searchFreeword:"フリーワード検索",searchInputModeToggle:"入力モードを切り替え（詳細入力 / 自由入力）",searchPage:"検索ページ",searchTab:"検索",searchVideoHeading:"コメントをオーバーレイする動画を検索",saveSettings:"設定を保存",settings:"設定",settingsClose:"設定を閉じる",settingsFabLabel:"ニコニココメント設定を開く",playbackLoadFailed:"再生設定の読み込みに失敗しました",playbackSaveFailed:"再生設定の保存に失敗しました",settingsLoadFailed:"設定の読み込みに失敗しました",settingsSaved:"設定を保存しました",settingsSaveFailed:"設定の保存に失敗しました",success:"成功",videoDataLoadFailed:"動画データの読み込みに失敗しました",videoDataSaveFailed:"動画データの保存に失敗しました",warning:"警告"},en:{color:"Color",commentColor:"Comment color",commentOpacity:"Opacity",commentSettings:"Comment settings",commentSettingsPanel:"Comment settings panel",commentVisibility:"Show comments",commentVisibilityToggle:"Toggle comment visibility",currentVideoUnset:"No overlay video is set",error:"Error",animeTitle:"Anime title",autoFillSearchForm:"Fill the search form with title, episode number, and episode title",autoSearch:"Auto search",autoSearchDescription:"Set comments automatically when the watch page opens",autoSearchDisabledManual:"Auto search disabled (manual setup mode)",autoSearchEnabled:"Auto search enabled",autoSearchInfo:"About auto search",fixedPlaybackRate:"Lock speed",formInput:"Fill form",freeInput:"Free input",idLoadFailed:"Failed to load ID information",idSaveFailed:"Failed to save ID information",info:"Info",manualSearchLoadFailed:"Failed to load search settings",manualSearchSaveFailed:"Failed to save search settings",manualSearchPlaceholder:"Enter a search keyword",ngRegex:"NG regular expressions",ngRegexPlaceholder:"Enter one NG regular expression per line",ngTab:"NG",ngWords:"NG words",ngWordsPlaceholder:"Enter one NG word per line",noMessage:"No message",playbackRate:"Playback speed",playbackRateFixedToggle:"Playback speed lock on/off",postedAt:"Posted at",commentsSet:'Set comments from "{title}"',autoSetupComplete:"Niconico video was set automatically",autoSetupError:"Auto setup error: {message}",commentsHiddenSkip:"Skipped because comments are hidden in settings",commentsLoadComplete:"Finished loading comments ({count})",commentsLoadErrorSelectAnother:`Comment loading error: {message}
Select another video from the floating button.`,commentsUnavailable:"Could not fetch comments",commentSourceUpdated:"Updated comment source: {title} ({count})",commentFetchError:"Comment fetch error: {message}",domUpdateWaitFailed:"Failed to wait for DOM update: {message}",episodeChangeDetected:"Detected episode change...",episodeNumberMissing:"Could not get the episode number",episodeSwitchError:"Episode switch error: {message}",initializationError:"Initialization error: {message}",initializingCommentLoader:"Initializing comment loader...",manualModeSelectAnimeTitle:"Manual mode is enabled. Open the Search tab from the floating button and set an anime title.",manualModeSelectVideo:"Manual mode is enabled. Open the Search tab from the floating button and select a video.",manualModeCommentsLoadComplete:`[Manual mode] Finished loading comments ({count})
Video: {title}`,metadataAutoFetchFailed:"Automatic fetch from the watch page failed. Metadata could not be acquired.",niconicoNotFound:"No Niconico video was found",niconicoNotFoundManual:"No Niconico video was found. Search manually.",nextEpisodeAutoSetupComplete:"Set up the next episode automatically",nextVideoCommentsUnavailableClear:"Could not fetch comments for the next video. Clearing comment display.",noAnimeTitle:"Could not get the anime title. Search accuracy may be reduced.",officialVideoMissingUseFirst:"No official video was found. Using the first search result.",officialVideoMissingManual:"No official video was found. Search manually.",officialVideoSafeguardInfo:"About the official video safeguard",unknownTitle:"Unknown title",structuredInput:"Detailed input",thumbnail:"Thumbnail",videoDataMissing:"Video data was not found.",videoId:"Video ID",videoOwner:"Uploader",videoSwitchDetected:"Detected video switch...",videoSwitchError:"Video switch error: {message}",episodeNumber:"Episode number",episodeTitleOptional:"Episode title (optional)",commentCount:"Comments",commentCountLong:"Comment count",mylistCount:"Mylist",mylistCountLong:"Mylist count",officialVideoMissing:"No official video was found. Showing all search results.",searchingKeyword:'Searching for "{keyword}"...',searchKeywordRequired:"Enter a search keyword",searchNoResults:"No search results were found",searchFormFilled:'Filled the search form with "{keyword}"',similarity:"Similarity: {score}%",viewCount:"Views",viewCountLong:"View count",search:"Search",searchAnimePlaceholder:"Example: Frieren: Beyond Journey's End",searchEpisodeNumberPlaceholder:"Example: Episode 1",searchEpisodeTitlePlaceholder:"Example: The Journey's End",searchFreeword:"Free-word search",searchInputModeToggle:"Switch input mode (detailed / free input)",searchPage:"Search page",searchTab:"Search",searchVideoHeading:"Search for the video to overlay comments from",saveSettings:"Save settings",settings:"Settings",settingsClose:"Close settings",settingsFabLabel:"Open Niconico comment settings",playbackLoadFailed:"Failed to load playback settings",playbackSaveFailed:"Failed to save playback settings",settingsLoadFailed:"Failed to load settings",settingsSaved:"Settings saved",settingsSaveFailed:"Failed to save settings",success:"Success",videoDataLoadFailed:"Failed to load video data",videoDataSaveFailed:"Failed to save video data",warning:"Warning"}},le=Ws({translations:Bs,defaultLocale:"ja",fallbackLocale:"en"});le.setLocale(le.detectBrowserLocale());function qs(t){return le.t(t)}const _=le.format,p=le.t,Vt="settings",_t="currentVideo",It="lastDanimeIds",At="playbackSettings",Lt="manualSearchSettings",Us=t=>({...t,ngWords:[...t.ngWords],ngRegexps:[...t.ngRegexps]}),ee={fixedModeEnabled:false,fixedRate:1.11},ue=t=>({fixedModeEnabled:t.fixedModeEnabled,fixedRate:t.fixedRate});class Ye{constructor(e){this.notifier=e,this.settings=Y(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData(),this.playbackSettings=ue(ee),this.loadPlaybackSettings();}settings;currentVideo;observers=new Set;playbackSettings;playbackObservers=new Set;getSettings(){return Us(this.settings)}loadSettings(){try{const e=X(Vt,null);if(!e)return this.settings=Y(),this.settings;if(typeof e=="string"){const n=JSON.parse(e);this.settings={...Y(),...n,ngWords:Array.isArray(n?.ngWords)?[...n.ngWords]:[],ngRegexps:Array.isArray(n?.ngRegexps)?[...n.ngRegexps]:[]};}else this.settings={...Y(),...e,ngWords:Array.isArray(e.ngWords)?[...e.ngWords]:[],ngRegexps:Array.isArray(e.ngRegexps)?[...e.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(e){return console.error("[SettingsManager] 設定の読み込みに失敗しました",e),this.notify(p("settingsLoadFailed"),"error"),this.settings=Y(),this.settings}}getPlaybackSettings(){return ue(this.playbackSettings)}loadPlaybackSettings(){try{const e=X(At,null);if(!e)return this.playbackSettings=ue(ee),this.notifyPlaybackObservers(),this.playbackSettings;if(typeof e=="string"){const n=JSON.parse(e);this.playbackSettings={fixedModeEnabled:typeof n.fixedModeEnabled=="boolean"?n.fixedModeEnabled:ee.fixedModeEnabled,fixedRate:typeof n.fixedRate=="number"?n.fixedRate:ee.fixedRate};}else this.playbackSettings={fixedModeEnabled:e.fixedModeEnabled,fixedRate:e.fixedRate};return this.notifyPlaybackObservers(),this.playbackSettings}catch(e){return console.error("[SettingsManager] 再生設定の読み込みに失敗しました",e),this.notify(p("playbackLoadFailed"),"error"),this.playbackSettings=ue(ee),this.notifyPlaybackObservers(),this.playbackSettings}}updatePlaybackSettings(e){return this.playbackSettings={...this.playbackSettings,...e},this.savePlaybackSettings()}savePlaybackSettings(){try{return Z(At,JSON.stringify(this.playbackSettings)),this.notifyPlaybackObservers(),!0}catch(e){return console.error("[SettingsManager] 再生設定の保存に失敗しました",e),this.notify(p("playbackSaveFailed"),"error"),false}}saveSettings(){const e=this.persistSettings();return e&&this.notify(p("settingsSaved"),"success"),e}updateSettings(e){return this.settings={...this.settings,...e,ngWords:e.ngWords?[...e.ngWords]:[...this.settings.ngWords??[]],ngRegexps:e.ngRegexps?[...e.ngRegexps]:[...this.settings.ngRegexps??[]]},this.persistSettings()}persistSettings(){try{return Z(Vt,JSON.stringify(this.settings)),this.notifyObservers(),!0}catch(e){return console.error("[SettingsManager] 設定の保存に失敗しました",e),this.notify(p("settingsSaveFailed"),"error"),false}}addObserver(e){this.observers.add(e);}removeObserver(e){this.observers.delete(e);}addPlaybackObserver(e){this.playbackObservers.add(e);try{e(this.getPlaybackSettings());}catch(n){console.error("[SettingsManager] 再生設定の登録通知でエラー",n);}}removePlaybackObserver(e){this.playbackObservers.delete(e);}notifyObservers(){const e=this.getSettings();for(const n of this.observers)try{n(e);}catch(r){console.error("[SettingsManager] 設定変更通知でエラー",r);}}notifyPlaybackObservers(){const e=this.getPlaybackSettings();for(const n of this.playbackObservers)try{n(e);}catch(r){console.error("[SettingsManager] 再生設定通知でエラー",r);}}loadVideoData(){try{return X(_t,null)??null}catch(e){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",e),this.notify(p("videoDataLoadFailed"),"error"),null}}saveVideoData(e,n){try{const r={videoId:n.videoId,title:n.title,viewCount:n.viewCount,commentCount:n.commentCount,mylistCount:n.mylistCount,postedAt:n.postedAt,thumbnail:n.thumbnail,owner:n.owner??null,channel:n.channel??null};return Z(_t,r),this.currentVideo=r,!0}catch(r){return console.error("[SettingsManager] 動画データの保存に失敗しました",r),this.notify(p("videoDataSaveFailed"),"error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(e){try{return Z(It,e),!0}catch(n){return console.error("[SettingsManager] saveLastDanimeIds failed",n),this.notify(p("idSaveFailed"),"error"),false}}loadLastDanimeIds(){try{return X(It,null)??null}catch(e){return console.error("[SettingsManager] loadLastDanimeIds failed",e),this.notify(p("idLoadFailed"),"error"),null}}saveManualSearchSettings(e){try{return Z(Lt,e),!0}catch(n){return console.error("[SettingsManager] saveManualSearchSettings failed",n),this.notify(p("manualSearchSaveFailed"),"error"),false}}loadManualSearchSettings(){try{return X(Lt,null)??null}catch(e){return console.error("[SettingsManager] loadManualSearchSettings failed",e),this.notify(p("manualSearchLoadFailed"),"error"),null}}notify(e,n="info"){this.notifier?.show(e,n);}}const Ys=new Set(["INPUT","TEXTAREA"]),Me=t=>t.length===1?t.toUpperCase():t,Gs=t=>t?`${t}+`:"";class gn{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(e,n,r){const i=this.createShortcutKey(Me(e),n);this.shortcuts.set(i,r);}removeShortcut(e,n){const r=this.createShortcutKey(Me(e),n);this.shortcuts.delete(r);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(e){this.isEnabled=e;}createShortcutKey(e,n){return `${Gs(n)}${e}`}extractModifier(e){const n=[];return e.ctrlKey&&n.push("Ctrl"),e.altKey&&n.push("Alt"),e.shiftKey&&n.push("Shift"),e.metaKey&&n.push("Meta"),n.length>0?n.join("+"):null}handleKeyDown(e){if(!this.isEnabled)return;const r=e.target?.tagName??"";if(Ys.has(r))return;const i=this.extractModifier(e),a=this.createShortcutKey(Me(e.key),i),s=this.shortcuts.get(a);s&&(e.preventDefault(),s());}}const Ks=R("dAnime:CommentRenderer"),Ft=t=>({loggerNamespace:"dAnime:CommentRenderer",...t??{}}),js=t=>{if(!t||typeof t!="object")return  false;const e=t;return typeof e.commentColor=="string"&&typeof e.commentOpacity=="number"&&typeof e.isCommentVisible=="boolean"};class re{renderer;keyboardHandler=null;constructor(e,n){js(e)||e===null?this.renderer=new I(e??null,Ft(n)):this.renderer=new I(Ft(e));}get settings(){return this.renderer.settings}set settings(e){this.renderer.settings=e;}initialize(e){this.renderer.initialize(e),this.setupKeyboardShortcuts();}addComment(e,n,r=[]){return this.renderer.addComment(e,n,r)}clearComments(){this.renderer.clearComments();}resetState(){this.renderer.resetState();}destroy(){this.teardownKeyboardShortcuts(),this.renderer.destroy();}updateSettings(e){this.renderer.settings=e;}getVideoElement(){return this.renderer.getVideoElement()}getCurrentVideoSource(){return this.renderer.getCurrentVideoSource()}getCommentsSnapshot(){return this.renderer.getCommentsSnapshot()}isNGComment(e){return this.renderer.isNGComment(e)}resize(e,n){this.renderer.resize(e,n);}setCommentVisibility(e){this.renderer.setCommentVisibility(e);}setupKeyboardShortcuts(){this.teardownKeyboardShortcuts();const e=new gn;e.addShortcut("C","Shift",()=>{try{const n=!this.renderer.settings.isCommentVisible;this.renderer.setCommentVisibility(n),this.syncGlobalSettings(this.renderer.settings);}catch(n){Ks.error("CommentRenderer.keyboardShortcut",n);}}),e.startListening(),this.keyboardHandler=e;}teardownKeyboardShortcuts(){this.keyboardHandler?.stopListening(),this.keyboardHandler=null;}syncGlobalSettings(e){window.dAniRenderer?.settingsManager?.updateSettings(e);}}class Ge{shadowRoot=null;container=null;createShadowDOM(e,n={mode:"closed"}){if(!e)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=e.attachShadow(n),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(e){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const n=document.createElement("style");n.textContent=e,this.shadowRoot.appendChild(n);}querySelector(e){return this.shadowRoot?this.shadowRoot.querySelector(e):null}querySelectorAll(e){return this.shadowRoot?this.shadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}setHTML(e){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=e;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const Xs=`\r
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
`,Zs=`:host {
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
`,Js=`:host {\r
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
`;class ae{static getCommonStyles(){return Xs}static getNotificationStyles(){return Zs}static getAutoButtonStyles(){return Js}}const Pt={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class v extends Ge{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new v),this.instance}static show(e,n="info",r=3e3){try{const i=this.getInstance();return i.initialize(),i.initialized?i.createNotification(e,n,r):null}catch(i){return console.error("[NotificationManager] show failed",i),null}}static removeNotification(e){this.getInstance().removeNotification(e.element);}show(e,n="info"){v.show(e,n);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 2147483647","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(ae.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(e){console.error("[NotificationManager] initialize failed",e),this.initialized=false;}}destroy(){v.notifications.forEach(e=>{e.timerId&&window.clearTimeout(e.timerId);}),v.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,v.instance=null;}createNotification(e,n,r){try{const i=this.querySelector(".notification-container");if(!i)throw new Error("Notification container not found");const a=Pt[n]??Pt.info,s=document.createElement("div");s.className=`notification-item ${n}`;const o=document.createElement("div");o.className="notification-icon",o.innerHTML=`<span>${a}</span>`,s.appendChild(o);const l=document.createElement("div");l.className="notification-content";const d=document.createElement("div");d.className="notification-type",d.textContent=qs(n),l.appendChild(d);const h=document.createElement("div");if(h.className="notification-message",e.includes("<"))h.innerHTML=e||p("noMessage");else {const m=(e||p("noMessage")).split(`
`).map(g=>g.trim()).filter(g=>g.length>0).join("<br>");h.innerHTML=m;}l.appendChild(h),s.appendChild(l);const c=document.createElement("button");c.className="notification-close",c.innerHTML="&times;",c.addEventListener("click",()=>{this.removeNotification(s);}),s.appendChild(c),i.appendChild(s),requestAnimationFrame(()=>{s.classList.add("show");});const u={element:s,timerId:window.setTimeout(()=>{this.removeNotification(s);},r)};return v.notifications.push(u),u}catch(i){return console.error("[NotificationManager] createNotification failed",i),null}}removeNotification(e){if(!e)return;const n=v.notifications.find(r=>r.element===e);n?.timerId&&window.clearTimeout(n.timerId),e.classList.remove("show"),window.setTimeout(()=>{try{e.remove(),v.notifications=v.notifications.filter(r=>r.element!==e);}catch(r){console.error("[NotificationManager] removeNotification cleanup failed",r);}},500);}}const fn="https://www.nicovideo.jp",bn=`${fn}/search`,vn=`${fn}/watch`,Rt={searchBase:bn,watchBase:vn},Qs=t=>`${vn}/${t}`,yn=t=>`${bn}/${encodeURIComponent(t)}`,Ie=t=>new Promise((e,n)=>{zs({url:t.url,method:t.method??"GET",headers:t.headers,data:t.data,responseType:t.responseType??"text",timeout:t.timeout,onprogress:t.onprogress,onload:r=>{e({status:r.status,statusText:r.statusText,response:r.response,finalUrl:r.finalUrl,headers:r.responseHeaders});},onerror:r=>{const i=r?.error??"unknown error";n(new Error(`GM_xmlhttpRequest failed: ${i}`));},ontimeout:()=>{n(new Error("GM_xmlhttpRequest timeout"));}});}),Ee=R("dAnime:NicoApiFetcher");class J{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(e){try{const n=this.sanitizeVideoId(e),i=(await Ie({method:"GET",url:Qs(n),headers:{Accept:"text/html"}})).response,o=new DOMParser().parseFromString(i,"text/html").querySelector('meta[name="server-response"]');if(!o)throw new Error("API data element not found in response");const l=o.getAttribute("content");if(!l)throw new Error("API data content is empty");const d=this.decodeServerResponse(l),c=JSON.parse(d).data?.response;if(!c)throw new Error("Invalid API data structure");return this.apiData=c,c}catch(n){throw Ee.error("NicoApiFetcher.fetchApiData",n),n}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const e=this.apiData.comment?.nvComment;if(!e?.server||!e.params||!e.threadKey)throw new Error("Required comment server data is missing");const n=await Ie({method:"POST",url:`${e.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:e.params,threadKey:e.threadKey,additionals:{}})}),a=(JSON.parse(n.response).data?.threads??[]).filter(o=>o.fork==="main").sort((o,l)=>(l.commentCount||0)-(o.commentCount||0))[0];if(!a)throw new Error("Main thread not found in comment response");const s=(a.comments??[]).map(o=>({text:o.body??"",vposMs:o.vposMs??0,commands:o.commands??[]}));return this.comments=s,s}catch(e){throw Ee.error("NicoApiFetcher.fetchComments",e),e}}async fetchAllData(e){return await this.fetchApiData(e),this.fetchComments()}sanitizeVideoId(e){try{let n=encodeURIComponent(e);return n=n.replace(/%([0-9A-F]{2})/gi,(r,i)=>{const a=parseInt(i,16);return a>=65&&a<=90||a>=97&&a<=122||a>=48&&a<=57||a===45||a===95||a===46||a===126?String.fromCharCode(a):r}),n}catch(n){return Ee.error("NicoApiFetcher.sanitizeVideoId",n,{videoId:e}),e}}decodeServerResponse(e){try{return decodeURIComponent(e)}catch(n){try{const r=e.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(r)}catch{throw new Error(`API data decode failed: ${n.message}`)}}}}const Dt=R("dAnime:NicoVideoSearcher"),eo="dアニメストア ニコニコ支店";class H{cache=new Map;static isOfficialVideo(e,n){const r=e.owner?.nickname??e.owner?.name??e.channel?.name??"";return !!(r===eo||r===n||r.startsWith(n+" "))}static filterOfficialVideos(e,n){return e.filter(r=>H.isOfficialVideo(r,n))}async search(e){if(!e.trim())return [];if(this.cache.has(e))return this.cache.get(e)??[];const n=yn(e),r=await this.fetchText(n),i=this.parseServerContext(r).map(o=>{const l=this.calculateLevenshteinDistance(e,o.title),d=Math.max(e.length,o.title.length),h=d>0?(1-l/d)*100:0;return {...o,levenshteinDistance:l,similarity:h}}),a=[],s=new Set;for(const o of i)o?.videoId&&(s.has(o.videoId)||(s.add(o.videoId),a.push(o)));return a.sort((o,l)=>{if(o.commentCount!==l.commentCount)return l.commentCount-o.commentCount;const d=o.similarity??-1,h=l.similarity??-1;return d!==h?h-d:l.viewCount-o.viewCount}),this.cache.set(e,a),a}async fetchText(e){return (await Ie({method:"GET",url:e})).response}parseServerContext(e){try{const r=new DOMParser().parseFromString(e,"text/html").querySelector('meta[name="server-response"]');if(!r)return [];const i=r.getAttribute("content")??"",a=this.decodeHtmlEntities(i);let s;try{s=JSON.parse(a);}catch(o){return Dt.error("NicoVideoSearcher.parseServerContext",o),[]}return this.extractVideoItems(s??{})}catch(n){return Dt.error("NicoVideoSearcher.parseServerContext",n),[]}}decodeHtmlEntities(e){if(!e)return "";let n=e.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return n=n.replace(/&#(\d+);/g,(r,i)=>String.fromCharCode(parseInt(i,10))),n=n.replace(/&#x([0-9a-fA-F]+);/g,(r,i)=>String.fromCharCode(parseInt(i,16))),n}extractVideoItems(e){const n=[],r=a=>{const s=(a?.id??a?.contentId??a?.watchId??"").toString();if(!s)return;const o=(a?.title??a?.shortTitle??"").toString(),l=a?.count??{},d=Number(l.view??a?.viewCounter??0)||0,h=Number(l.comment??a?.commentCounter??0)||0,c=Number(l.mylist??a?.mylistCounter??0)||0,u=a?.thumbnail??{},m=(u.nHdUrl||u.listingUrl||u.largeUrl||u.middleUrl||u.url||a?.thumbnailUrl||"").toString(),g=(a?.registeredAt||a?.startTime||a?.postedDateTime||"")?.toString?.()??"",w=a?.owner&&typeof a.owner=="object"?{nickname:(a.owner.nickname??a.owner.name??"")||void 0,name:(a.owner.name??a.owner.nickname??"")||void 0}:null,x=(a?.isChannelVideo||a?.owner?.ownerType==="channel")&&a?.owner?{name:a.owner.name??""}:null;o&&n.push({videoId:s,title:o,viewCount:d,commentCount:h,mylistCount:c,thumbnail:m,postedAt:g,owner:w,channel:x});},i=a=>{if(!a)return;if(Array.isArray(a)){a.forEach(i);return}if(typeof a!="object"||a===null)return;const s=a;(s.id||s.contentId||s.watchId)&&r(s),Object.values(a).forEach(i);};return i(e),n}calculateLevenshteinDistance(e,n){const r=e?e.length:0,i=n?n.length:0;if(r===0)return i;if(i===0)return r;const a=new Array(i+1);for(let o=0;o<=i;++o){const l=a[o]=new Array(r+1);l[0]=o;}const s=a[0];for(let o=1;o<=r;++o)s[o]=o;for(let o=1;o<=i;++o)for(let l=1;l<=r;++l){const d=e[l-1]===n[o-1]?0:1;a[o][l]=Math.min(a[o-1][l]+1,a[o][l-1]+1,a[o-1][l-1]+d);}return a[i][r]}}const T={mypageHeaderTitle:".p-mypageHeader__title",mypageListContainer:".p-mypageMain",watchVideoElement:"video#video",mypageItem:".itemModule.list",mypageItemTitle:".line1",mypageEpisodeNumber:".number.line1 span",mypageEpisodeTitle:".episode.line1 span",watchPageAnimeTitle:".backInfoTxt1",watchPageEpisodeNumber:".backInfoTxt2",watchPageEpisodeTitle:".backInfoTxt3",watchSettingButton:".setting.mainButton",watchButtonArea:".buttonArea"};class Ke{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(e){this.delay=e;}getFuncId(e){return this.funcIds.has(e)||this.funcIds.set(e,this.nextId++),this.funcIds.get(e)??0}exec(e){const n=this.getFuncId(e),r=Date.now(),i=this.timers.get(n)?.lastExec??0,a=r-i;if(a>this.delay)e(),this.timers.set(n,{lastExec:r});else {clearTimeout(this.timers.get(n)?.timerId??void 0);const s=setTimeout(()=>{e(),this.timers.set(n,{lastExec:Date.now()});},this.delay-a);this.timers.set(n,{timerId:s,lastExec:i});}}execOnce(e){const n=this.getFuncId(e),r=this.timers.get(n);if(r?.executedOnce){r.timerId&&clearTimeout(r.timerId);return}r?.timerId&&clearTimeout(r.timerId);const i=setTimeout(()=>{try{e();}finally{this.timers.set(n,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(n,{timerId:i,executedOnce:false,scheduled:true});}cancel(e){const n=this.getFuncId(e),r=this.timers.get(n);r?.timerId&&clearTimeout(r.timerId),this.timers.delete(n);}resetExecution(e){const n=this.getFuncId(e),r=this.timers.get(n);r&&(r.timerId&&clearTimeout(r.timerId),this.timers.set(n,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,e]of this.timers)e.timerId&&clearTimeout(e.timerId);this.timers.clear(),this.funcIds.clear();}}const L=R("dAnime:VideoEventLogger");class xn{constructor(e=""){this.prefix=e;}video=null;lastCurrentTime=0;eventListeners=new Map;isEnabled=true;TRACKED_EVENTS=["loadstart","loadedmetadata","loadeddata","canplay","canplaythrough","play","playing","pause","seeking","seeked","timeupdate","ended","emptied","stalled","suspend","waiting","error","abort"];enable(){this.isEnabled=true,L.info(`${this.prefix}:enabled`);}disable(){this.isEnabled=false,L.info(`${this.prefix}:disabled`);}attach(e){this.detach(),this.video=e,this.lastCurrentTime=e.currentTime,L.info(`${this.prefix}:attach`,{src:this.getVideoSource(e),duration:e.duration,currentTime:e.currentTime,readyState:e.readyState}),this.TRACKED_EVENTS.forEach(n=>{const r=()=>{this.handleEvent(n);};this.eventListeners.set(n,r),e.addEventListener(n,r);}),this.setupCurrentTimeWatcher();}detach(){this.video&&(this.eventListeners.forEach((e,n)=>{this.video?.removeEventListener(n,e);}),this.eventListeners.clear(),L.info(`${this.prefix}:detach`,{src:this.getVideoSource(this.video),finalTime:this.video.currentTime}),this.video=null);}handleEvent(e){if(!this.isEnabled||!this.video)return;const n=this.video,r={event:e,currentTime:n.currentTime,duration:n.duration,readyState:n.readyState,paused:n.paused,ended:n.ended,src:this.getVideoSource(n),networkState:n.networkState,timestamp:Date.now()},i=Math.abs(n.currentTime-this.lastCurrentTime);if(e==="timeupdate"){i>.1&&(this.lastCurrentTime=n.currentTime);return}switch(i>.1?(L.info(`${this.prefix}:event:${e}`,{...r,timeDiff:i.toFixed(2),direction:n.currentTime>this.lastCurrentTime?"forward":"backward"}),this.lastCurrentTime=n.currentTime):L.debug(`${this.prefix}:event:${e}`,r),e){case "error":L.error(`${this.prefix}:videoError`,new Error("Video error detected"),{errorCode:n.error?.code??null,errorMessage:n.error?.message??null,...r});break;case "ended":L.warn(`${this.prefix}:videoEnded`,{...r,message:"動画再生が終了しました"});break;case "emptied":L.warn(`${this.prefix}:videoEmptied`,{...r,message:"動画要素が空になりました（src変更の可能性）"});break;case "seeking":L.warn(`${this.prefix}:seeking`,{...r,from:this.lastCurrentTime,to:n.currentTime,diff:(n.currentTime-this.lastCurrentTime).toFixed(2)});break}}setupCurrentTimeWatcher(){if(!Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,"currentTime")?.set){L.warn(`${this.prefix}:currentTimeWatcher:unsupported`);return}L.debug(`${this.prefix}:currentTimeWatcher:setup`);}logManualSeek(e,n,r){this.isEnabled&&L.warn(`${this.prefix}:manualSeek`,{from:e.toFixed(2),to:n.toFixed(2),diff:(n-e).toFixed(2),reason:r,stackTrace:new Error().stack});}getVideoSource(e){const n=typeof e.currentSrc=="string"?e.currentSrc:"";if(n.length>0)return n.length>100?`${n.slice(0,100)}...`:n;const r=e.getAttribute("src")??"";return r.length>0?r.length>100?`${r.slice(0,100)}...`:r:null}}let Te=null;function Ht(){return Te||(Te=new xn("global")),Te}const to=1e3,no=100,ro=30,zt=1e4,Ot=100,io=/watch\/(?:([a-z]{2}))?(\d+)/gi,S=R("dAnime:VideoSwitchHandler"),Nt=t=>{if(!t?.video)return null;const e=t.video.registeredAt,n=e?new Date(e).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:t.video.id,title:t.video.title,viewCount:t.video.count?.view,mylistCount:t.video.count?.mylist,commentCount:t.video.count?.comment,postedAt:n,thumbnail:t.video.thumbnail?.url,owner:t.owner??null,channel:t.channel??null}},ao=t=>{const e=[];let n;for(;(n=io.exec(t))!==null;){const[,r="",i=""]=n;i&&e.push(`${r}${i}`);}return e};class Ae{constructor(e,n,r,i=to,a=no){this.renderer=e,this.fetcher=n,this.settingsManager=r,this.monitorInterval=i,this.debounce=new Ke(a),this.videoEventLogger=new xn("VideoSwitchHandler");}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=false;debounce;videoEventLogger;resetVideoSource(){S.info("videoSwitch:resetVideoSource",{previousSource:this.lastVideoSource,previousLastPreloadedCount:this.lastPreloadedComments?.length??0,previousPreloadedCount:this.preloadedComments?.length??0,previousNextVideoId:this.nextVideoId}),this.lastVideoSource=null,this.lastPreloadedComments=null,this.preloadedComments=null,this.nextVideoId=null;}updateRenderer(e){S.info("videoSwitch:updateRenderer",{oldRendererExists:!!this.renderer,newRendererExists:!!e}),this.renderer=e;}startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(e){if(this.isSwitching){S.warn("videoSwitch:alreadySwitching",{timestamp:Date.now()});return}this.isSwitching=true;try{S.warn("videoSwitch:entry",{videoElementProvided:!!e,currentRendererComments:this.renderer.getCommentsSnapshot().length,lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId,lastVideoSource:this.lastVideoSource,rendererVideoElement:this.renderer.getVideoElement()?"attached":"detached",rendererVideoSrc:this.renderer.getCurrentVideoSource(),sampleCurrentComments:this.renderer.getCommentsSnapshot().slice(0,3).map(h=>({text:h.text?.substring(0,30),vposMs:h.vposMs}))});const n=await this.resolveVideoElement(e)??null,r=this.preloadedComments??this.lastPreloadedComments??null,i=n?.dataset?.videoId??n?.getAttribute?.("data-video-id")??null,a=this.nextVideoId??i??this.lastVideoId;if(S.warn("videoSwitch:videoIdResolution",{videoId:a??null,nextVideoId:this.nextVideoId,elementId:i,lastVideoId:this.lastVideoId,hasBackupPreloaded:!!r,backupPreloadedCount:r?.length??0}),!n||!a&&!r){S.warn("videoSwitch:earlyReturn",{reason:n?"no videoId and no backup":"no video element",hasVideoElement:!!n,hasVideoId:!!a,hasBackupPreloaded:!!r}),this.handleMissingVideoInfo(r);return}S.warn("videoSwitch:start",{videoId:a??null,elementVideoId:n.dataset?.videoId??null,preloadedCount:r?.length??0,currentTime:n.currentTime,duration:n.duration,readyState:n.readyState,currentSrc:n.currentSrc,lastVideoSource:this.lastVideoSource}),v.show(p("videoSwitchDetected"),"info"),this.videoEventLogger.attach(n),this.resetRendererState(n);const s=this.renderer.getVideoElement();if(s!==n&&n)S.debug("videoSwitch:rebind",{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof n.currentSrc=="string"&&n.currentSrc.length>0?n.currentSrc:n.getAttribute("src")??null}),this.renderer.initialize(n);else if(s===n&&n&&this.hasVideoSourceChanged(n))S.debug("videoSwitch:rebind:sameElement",{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(n)}),this.renderer.clearComments(),this.renderer.destroy(),this.renderer.initialize(n);else if(!s&&!n){S.warn("videoSwitch:missingVideoElement",{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let o=null;a&&(o=await this.fetchVideoApiData(a,r),o&&(this.persistVideoMetadata(o),this.lastVideoId=a));const l=await this.populateComments(a,r);l===0?(this.renderer.clearComments(),v.show(p("commentsUnavailable"),"warning"),S.warn("videoSwitch:commentsMissing",{videoId:a??null})):S.warn("videoSwitch:commentsLoaded",{videoId:a??null,count:l}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(n);const d=this.renderer.getCommentsSnapshot();if(S.warn("videoSwitch:complete",{videoId:a??null,finalTime:n.currentTime,loadedCount:l,finalCommentsCount:d.length,rendererVideoSrc:this.renderer.getCurrentVideoSource(),sampleFinalComments:d.slice(0,5).map(h=>({text:h.text?.substring(0,30),vposMs:h.vposMs,vposSec:(h.vposMs/1e3).toFixed(2)}))}),o){const h=Nt(o);if(h){const c=_("commentSourceUpdated",{count:String(l),title:h.title??p("unknownTitle")});v.show(c,l>0?"success":"warning");}}}catch(n){S.error("videoSwitch:error",n,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),v.show(_("videoSwitchError",{message:n.message}),"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}async resolveVideoElement(e){if(e){const i=this.getVideoSource(e),a=this.lastVideoSource;return (!i||i===a)&&await this.waitForSourceChange(e),e}const n=Date.now()+zt;let r=null;for(;Date.now()<n;){const i=document.querySelector(T.watchVideoElement);if(i){r=i;const a=this.hasVideoSourceChanged(i);if(i.readyState>=2||!i.paused||a)return a&&(this.lastVideoSource=null),i}await new Promise(a=>window.setTimeout(a,Ot));}return r}async waitForSourceChange(e){const n=this.getVideoSource(e);if(!n)return;const r=Date.now()+zt;for(;Date.now()<r;){const i=this.getVideoSource(e);if(i&&i!==n){this.lastVideoSource=null;return}await new Promise(a=>window.setTimeout(a,Ot));}}hasVideoSourceChanged(e){const n=this.getVideoSource(e);return n?this.lastVideoSource?this.lastVideoSource!==n:true:false}getVideoSource(e){if(!e)return null;const n=typeof e.currentSrc=="string"?e.currentSrc:"";if(n.length>0)return n;const r=e.getAttribute("src")??"";if(r.length>0)return r;const i=e.querySelector("source[src]");return i&&typeof i.src=="string"&&i.src.length>0?i.src:null}resetRendererState(e){const n=e.currentTime,r=this.getVideoSource(e),i=this.lastVideoSource!==r,a=this.renderer.getCommentsSnapshot().length;if(S.warn("videoSwitch:resetRendererState:before",{currentTime:n,duration:e.duration,src:r,lastSrc:this.lastVideoSource??null,sourceChanged:i,readyState:e.readyState,paused:e.paused,commentsCount:a}),i)try{this.videoEventLogger.logManualSeek(n,0,"resetRendererState: video source changed"),e.currentTime=0,S.warn("videoSwitch:resetRendererState:seeked",{currentTime:e.currentTime,timeDiff:e.currentTime-n});}catch(s){S.debug("videoSwitch:resetCurrentTimeFailed",s);}else S.warn("videoSwitch:resetRendererState:skipSeek",{reason:"same video source, skipping currentTime reset",currentTime:n,willClearComments:true});S.warn("videoSwitch:resetRendererState:clearingComments",{commentsBeforeClear:a,sourceChanged:i,currentVideoSrc:this.renderer.getCurrentVideoSource()}),this.renderer.clearComments(),S.warn("videoSwitch:resetRendererState:commentsCleared",{commentsAfterClear:this.renderer.getCommentsSnapshot().length,rendererVideoSrc:this.renderer.getCurrentVideoSource()});}async checkVideoEnd(){const e=this.renderer.getVideoElement();if(!(!e||!Number.isFinite(e.duration)||e.duration-e.currentTime>ro)){if(!this.nextVideoId){const r=async()=>{await this.findNextVideoId();};this.debounce.execOnce(r);}if(this.nextVideoId&&!this.preloadedComments){const r=async()=>{await this.preloadComments();};this.debounce.execOnce(r);}}}handleMissingVideoInfo(e){S.warn("videoSwitch:handleMissingVideoInfo",{hasBackupPreloaded:!!e,backupPreloadedCount:e?.length??0,hasLastPreloadedComments:!!this.lastPreloadedComments,lastPreloadedCount:this.lastPreloadedComments?.length??0,willClearComments:!e&&!this.lastPreloadedComments}),!e&&!this.lastPreloadedComments?(S.warn("videoSwitch:clearingCommentsInMissingInfo",{currentCommentCount:this.renderer.getCommentsSnapshot().length}),this.renderer.clearComments(),v.show(p("nextVideoCommentsUnavailableClear"),"warning")):S.info("videoSwitch:preservingComments",{reason:"backup or last preloaded comments available",currentCommentCount:this.renderer.getCommentsSnapshot().length});}async fetchVideoApiData(e,n){try{const r=await this.fetcher.fetchApiData(e);return S.debug("videoSwitch:apiFetched",{videoId:e}),r}catch(r){if(S.error("videoSwitch:apiFetchError",r,{videoId:e}),!n)throw r;return null}}persistVideoMetadata(e){const n=Nt(e);n&&this.settingsManager.saveVideoData(n.title??"",n);}async populateComments(e,n){let r=null;if(S.warn("videoSwitch:populateComments:start",{videoId:e,backupPreloadedCount:n?.length??0,hasBackupPreloaded:!!n}),Array.isArray(n)&&n.length>0)r=n,S.warn("videoSwitch:populateComments:usingBackup",{count:r.length});else if(e)try{S.warn("videoSwitch:populateComments:fetching",{videoId:e}),r=await this.fetcher.fetchAllData(e),S.warn("videoSwitch:commentsFetched",{videoId:e,count:r.length});}catch(a){S.error("videoSwitch:commentsFetchError",a,{videoId:e}),v.show(_("commentFetchError",{message:a.message}),"error"),r=null;}if(!r||r.length===0)return S.warn("videoSwitch:populateComments:noComments"),0;const i=r.filter(a=>!this.renderer.isNGComment(a.text));return S.warn("videoSwitch:populateComments:addingToRenderer",{filteredCount:i.length,totalCount:r.length,rendererCommentsBeforeAdd:this.renderer.getCommentsSnapshot().length,rendererVideoElement:this.renderer.getVideoElement()?"attached":"detached",rendererVideoSrc:this.renderer.getCurrentVideoSource()}),i.forEach((a,s)=>{this.renderer.addComment(a.text,a.vposMs,a.commands),s<3&&S.warn(`videoSwitch:populateComments:addedComment[${s}]`,{text:a.text.substring(0,30),vposMs:a.vposMs,vposSec:(a.vposMs/1e3).toFixed(2),commands:a.commands});}),S.warn("videoSwitch:populateComments:complete",{addedCount:i.length,rendererCommentsAfterAdd:this.renderer.getCommentsSnapshot().length,rendererVideoSrcAfterAdd:this.renderer.getCurrentVideoSource(),sampleComments:this.renderer.getCommentsSnapshot().slice(0,3).map(a=>({text:a.text?.substring(0,30),vposMs:a.vposMs}))}),this.lastPreloadedComments=[...i],i.length}async findNextVideoId(){try{const e=this.fetcher.lastApiData;if(!e)return;const n=e.series?.video?.next?.id;if(n){this.nextVideoId=n,S.debug("videoSwitch:detectedNext",{videoId:n});return}const r=e.video?.description??"";if(!r)return;const i=ao(r);if(i.length===0)return;const a=[...i].sort((s,o)=>{const l=parseInt(s.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(o.replace(/^[a-z]{2}/i,""),10)||0)-l});this.nextVideoId=a[0]??null,this.nextVideoId&&S.debug("videoSwitch:candidateFromDescription",{candidate:this.nextVideoId});}catch(e){S.error("videoSwitch:nextIdError",e,{lastVideoId:this.lastVideoId});}}async preloadComments(){if(this.nextVideoId)try{const n=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(r=>!this.renderer.isNGComment(r.text));this.preloadedComments=n.length>0?n:null,S.debug("videoSwitch:preloaded",{videoId:this.nextVideoId,count:n.length});}catch(e){S.error("videoSwitch:preloadError",e,{videoId:this.nextVideoId}),this.preloadedComments=null;}}}const so=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class wn{static initialize(){Hs(so);}}var oo="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z",lo="M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z",co="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",ho="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z",uo="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z",po="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z",mo="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",go="M5,4V7H10.5V19H13.5V7H19V4H5Z",fo="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",bo="M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z",vo="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",yo="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",xo="M8,5.14V19.14L19,12.14L8,5.14Z",wo="M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z",So="M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9",Co="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z",Mo="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z";function A(t,e=24){const n=String(e),r=String(e);return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${t}"></path></svg>`}const Eo=A(xo),To=A(co),ko=A(yo),me=A(vo),se=A(ho),Vo=A(bo),$t=A(go),Le=A(oo),Fe=A(mo),Pe=A(po),_o=A(wo),Io=A(lo),Ao=A(uo),Lo=A(Co),Fo=A(fo),Po=A(Mo),Ro=A(So),te=R("dAnime:SettingsUI"),C={searchInput:"#searchInput",searchAnimeTitle:"#searchAnimeTitle",searchEpisodeNumber:"#searchEpisodeNumber",searchEpisodeTitle:"#searchEpisodeTitle",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",autoSearchToggle:"#autoSearchToggle",autoSearchOptionRow:"#autoSearchOptionRow",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",settingsModal:"#settingsModal",closeSettingsModal:"#closeSettingsModal",modalOverlay:".settings-modal__overlay",modalTabs:".settings-modal__tab",modalPane:".settings-modal__pane",searchModeToggle:"#searchModeToggle",searchStructuredFields:"#searchStructuredFields",searchFreeInputArea:"#searchFreeInputArea"},ne=["search","ng"],Wt=`
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
`,Do=`
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
`;class be extends Ge{static FAB_HOST_ID="danime-settings-fab-host";settingsManager;fetcher;searcher;settings;currentVideoInfo;hostElement=null;activeTab="search";modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;fabTooltipEl=null;autoSearchTooltipHtml="";handleFabClick=e=>{e.preventDefault(),this.openSettingsModal();};handleOverlayClick=()=>{this.closeSettingsModal();};handleCloseClick=()=>{this.closeSettingsModal();};constructor(e,n=new J,r=new H){super(),this.settingsManager=e,this.fetcher=n,this.searcher=r,this.settings=this.settingsManager.getSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData();}insertIntoMypage(){const e=document.querySelector(T.mypageHeaderTitle);e&&(this.hostElement=this.createSettingsUI(),e.parentElement?.insertBefore(this.hostElement,e.nextSibling));}addAutoCommentButtons(){document.querySelectorAll(T.mypageItem).forEach(n=>{if(n.dataset.autoFillEnabled==="true")return;const r=n.querySelector(T.mypageItemTitle),i=n.querySelector(T.mypageEpisodeNumber),a=n.querySelector(T.mypageEpisodeTitle);if(!r||!a)return;const s=r.textContent?.trim()??"",o=i?.textContent?.trim()??"",l=a.textContent?.trim()??"";if(!s)return;const d=document.createElement("div");d.style.marginTop="8px",d.style.display="block";const h=d.attachShadow({mode:"open"}),c=document.createElement("style");c.textContent=ae.getAutoButtonStyles(),h.appendChild(c);const u=document.createElement("button");u.className="auto-comment-button",u.title=p("autoFillSearchForm"),u.setAttribute("aria-label",p("autoFillSearchForm")),u.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,14H16L18,16V18H20V16L18,14V12H14M10,10H4V12H10M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H11.35C11.14,19.37 11,18.7 11,18A7,7 0 0,1 18,11C19.1,11 20.12,11.29 21,11.78V6M4,6H9.17L11.17,8H20V10H18V10.5C16.55,10.16 15,10.64 14,11.5V10H4M12,14H4V16H11.35C11.63,15.28 12.08,14.63 12.64,14.08L12,14Z" />
        </svg>
        <span style="margin-left: 6px; font-size: 12px; font-weight: 500;">${p("formInput")}</span>
      `,u.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),this.openSettingsModal(false),this.queryModalElement(`${C.modalTabs}[data-tab="search"]`)?.click();const x=this.queryModalElement(C.searchAnimeTitle),b=this.queryModalElement(C.searchEpisodeNumber),y=this.queryModalElement(C.searchEpisodeTitle);x&&(x.value=s),b&&o&&(b.value=o),y&&l&&(y.value=l),x?.focus({preventScroll:true});const E=[s];o&&E.push(o),l&&E.push(l),v.show(_("searchFormFilled",{keyword:E.join(" ")}),"success");}),h.appendChild(u);const m=a.parentElement;if(m){const g=m.querySelector(".iconContainer");g?m.insertBefore(d,g):m.appendChild(d);}n.dataset.autoFillEnabled="true";});}async waitMypageListStable(){}tryRestoreByDanimeIds(){return  false}createSettingsUI(){const e=document.createElement("div");e.className="nico-comment-shadow-host settings-host",this.createShadowDOM(e),this.addStyles(ae.getCommonStyles());const n=this.buildSettingsHtml();return this.setHTML(n),this.applySettingsToUI(),this.addStyles(Wt),this.setupEventListeners(),e}buildSettingsHtml(){const e=s=>typeof s=="number"?s.toLocaleString():"-",n=s=>{if(!s)return "-";try{return new Date(s).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return s}},r=this.currentVideoInfo,i=r?.thumbnail??"",a=!!r?.videoId;return `
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="Version">${Ds}</span>
        </h2>

        <!-- Cinematic Glass Card -->
        <div class="video-card${a?"":" video-card--empty"}">
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
              <img id="currentThumbnail" src="${i}" alt="${p("thumbnail")}">
            </div>

            <!-- 情報セクション -->
            <div class="video-card__info">
              <!-- 上部: ID & 日付 -->
              <div class="video-card__meta-row">
                <div class="video-card__id" title="${p("videoId")}">
                  <span class="video-card__id-icon" aria-hidden="true">${Vo}</span>
                  <span class="sr-only">${p("videoId")}</span>
                  <span id="currentVideoId">${r?.videoId??p("currentVideoUnset")}</span>
                </div>
                <div class="video-card__date" title="${p("postedAt")}">
                  <span class="video-card__date-icon" aria-hidden="true">${Io}</span>
                  <span class="sr-only">${p("postedAt")}</span>
                  <span id="currentPostedAt">${n(r?.postedAt)}</span>
                </div>
              </div>

              <!-- 中央: タイトル & 投稿者 -->
              <div class="video-card__main">
                <h3 class="video-card__title" id="currentTitle">${r?.title??p("currentVideoUnset")}</h3>
                <div class="video-card__owner" title="${p("videoOwner")}">
                  <span class="video-card__owner-icon" aria-hidden="true">${Le}</span>
                  <span class="sr-only">${p("videoOwner")}</span>
                  <span id="currentOwner">${r?.owner?.nickname??r?.channel?.name??"-"}</span>
                </div>
              </div>

              <!-- 下部: 統計情報 -->
              <div class="video-card__stats">
                <div class="video-card__stat" title="${p("viewCountLong")}">
                  <span class="video-card__stat-icon" aria-hidden="true">${Fe}</span>
                  <span class="sr-only">${p("viewCountLong")}</span>
                  <span class="video-card__stat-value" id="currentViewCount">${e(r?.viewCount)}</span>
                </div>
                <div class="video-card__stat" title="${p("commentCountLong")}">
                  <span class="video-card__stat-icon" aria-hidden="true">${Pe}</span>
                  <span class="sr-only">${p("commentCountLong")}</span>
                  <span class="video-card__stat-value" id="currentCommentCount">${e(r?.commentCount)}</span>
                </div>
                <div class="video-card__stat" title="${p("mylistCountLong")}">
                  <span class="video-card__stat-icon" aria-hidden="true">${_o}</span>
                  <span class="sr-only">${p("mylistCountLong")}</span>
                  <span class="video-card__stat-value" id="currentMylistCount">${e(r?.mylistCount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}buildModalHtml(){return `
      <div id="settingsModal" class="settings-modal hidden" role="dialog" aria-modal="true" aria-labelledby="settingsModalTitle" aria-hidden="true">
        <div class="settings-modal__overlay"></div>
        <div class="settings-modal__content">
          <header class="settings-modal__header">
            <h3 id="settingsModalTitle">${p("settings")}</h3>
            <button id="closeSettingsModal" class="settings-modal__close" type="button" aria-label="${p("settingsClose")}">
              <span aria-hidden="true">${To}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${se}</span>
              <span class="settings-modal__tab-label">${p("searchTab")}</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${me}</span>
              <span class="settings-modal__tab-label">${p("ngTab")}</span>
            </button>
          </div>
          <div class="settings-modal__panes">
            <section class="settings-modal__pane is-active" data-pane="search" role="tabpanel" id="settingsPaneSearch" aria-labelledby="settingsTabSearch">
              <div class="setting-group search-section">
                <h3>${p("searchVideoHeading")}</h3>
                <div
                  class="playback-option${this.settings.autoSearchEnabled?" playback-option--active":""}"
                  id="autoSearchOptionRow"
                  role="button"
                  tabindex="0"
                  aria-pressed="${this.settings.autoSearchEnabled?"true":"false"}"
                  style="margin-bottom: 16px;"
                >
                  <div class="playback-option__icon-wrapper${this.settings.autoSearchEnabled?" playback-option__icon-wrapper--active":""}">
                    ${Po}
                  </div>
                  <div class="playback-option__text">
                    <span class="playback-option__title">${p("autoSearch")}</span>
                    <span class="playback-option__desc">${p("autoSearchDescription")}</span>
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
                  <div class="info-badge" id="autoSearchInfoBadge" tabindex="0" aria-label="${p("autoSearchInfo")}">
                    ${Fo}
                  </div>
                </div>

                <div class="search-mode-switch">
                  <span class="search-mode-switch__label search-mode-switch__label--active" id="searchModeLabelStructured">${p("structuredInput")}</span>
                  <label class="search-mode-switch__toggle" aria-label="${p("searchInputModeToggle")}">
                    <input type="checkbox" id="searchModeToggle" class="search-mode-switch__checkbox">
                    <span class="search-mode-switch__track"></span>
                    <span class="search-mode-switch__thumb"></span>
                  </label>
                  <span class="search-mode-switch__label" id="searchModeLabelFree">${p("freeInput")}</span>
                </div>

                <div class="search-fields" id="searchStructuredFields">
                  <div class="search-field">
                    <label for="searchAnimeTitle" class="search-field__label">${p("animeTitle")}</label>
                    <input type="text" id="searchAnimeTitle" class="search-field__input" placeholder="${p("searchAnimePlaceholder")}">
                  </div>
                  <div class="search-field-row">
                    <div class="search-field search-field--half">
                      <label for="searchEpisodeNumber" class="search-field__label">${p("episodeNumber")}</label>
                      <input type="text" id="searchEpisodeNumber" class="search-field__input" placeholder="${p("searchEpisodeNumberPlaceholder")}">
                    </div>
                    <div class="search-field search-field--half">
                      <label for="searchEpisodeTitle" class="search-field__label">${p("episodeTitleOptional")}</label>
                      <input type="text" id="searchEpisodeTitle" class="search-field__input" placeholder="${p("searchEpisodeTitlePlaceholder")}">
                    </div>
                  </div>
                </div>

                <div class="search-free-input" id="searchFreeInputArea" style="display:none;">
                  <div class="search-field">
                    <label for="searchInput" class="search-field__label">${p("searchFreeword")}</label>
                    <input type="text" id="searchInput" class="search-field__input" placeholder="${p("manualSearchPlaceholder")}">
                  </div>
                </div>

                <div class="search-container">
                  <button id="searchButton">${p("search")}</button>
                  <button id="openSearchPageDirect" class="open-search-page-direct-btn">${p("searchPage")}</button>
                  <div class="shield-badge" tabindex="0" aria-label="${p("officialVideoSafeguardInfo")}">
                    ${Ro}
                  </div>
                </div>
                <div id="searchResults" class="search-results"></div>
              </div>
            </section>
            <section class="settings-modal__pane" data-pane="ng" role="tabpanel" id="settingsPaneNg" aria-labelledby="settingsTabNg" aria-hidden="true">
              <div class="setting-group ng-settings">
                <div class="ng-settings__column" aria-labelledby="ngWordsTitle">
                  <h3 id="ngWordsTitle" class="ng-settings__title">${p("ngWords")}</h3>
                  <textarea class="ng-settings__textarea" id="ngWords" placeholder="${p("ngWordsPlaceholder")}">${(this.settings.ngWords??[]).join(`
`)}</textarea>
                </div>
                <div class="ng-settings__column" aria-labelledby="ngRegexTitle">
                  <h3 id="ngRegexTitle" class="ng-settings__title">${p("ngRegex")}</h3>
                  <textarea class="ng-settings__textarea" id="ngRegexps" placeholder="${p("ngRegexPlaceholder")}">${(this.settings.ngRegexps??[]).join(`
`)}</textarea>
                </div>
              </div>
            </section>
          </div>
          <footer class="settings-modal__footer">
            <button id="saveSettings" type="button">${p("saveSettings")}</button>
          </footer>
        </div>
      </div>
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupAutoSearchToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupTooltipBadges();}setupModalControls(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick);const e=this.createOrUpdateFab(),n=this.queryModalElement(C.settingsModal),r=this.queryModalElement(C.closeSettingsModal),i=this.queryModalElement(C.modalOverlay);this.modalElement=n??null,this.closeButtonElement=r??null,this.overlayElement=i??null,!(!n||!r||!i||!e)&&(this.fabElement?.removeEventListener("click",this.handleFabClick),e.addEventListener("click",this.handleFabClick),e.setAttribute("aria-controls",n.id),e.setAttribute("aria-haspopup","dialog"),e.setAttribute("aria-expanded","false"),this.fabElement=e,r.addEventListener("click",this.handleCloseClick),i.addEventListener("click",this.handleOverlayClick),this.shadowRoot?.addEventListener("keydown",a=>{const s=a;s.key==="Escape"&&!this.modalElement?.classList.contains("hidden")&&(s.preventDefault(),this.closeSettingsModal());}),this.applySettingsToUI());}setupModalTabs(){const e=Array.from(this.queryModalSelectorAll(C.modalTabs)),n=Array.from(this.queryModalSelectorAll(C.modalPane));if(e.length===0||n.length===0)return;const r=i=>{e.forEach(a=>{const o=this.toModalTabKey(a.dataset.tab)===i;a.classList.toggle("is-active",o),a.setAttribute("aria-selected",String(o)),a.setAttribute("tabindex",o?"0":"-1");}),n.forEach(a=>{const o=this.toModalTabKey(a.dataset.pane)===i;a.classList.toggle("is-active",o),a.setAttribute("aria-hidden",String(!o));}),this.activeTab=i;};e.forEach(i=>{i.addEventListener("click",()=>{const a=this.toModalTabKey(i.dataset.tab);a&&r(a);}),i.addEventListener("keydown",a=>{const s=a;if(s.key!=="ArrowRight"&&s.key!=="ArrowLeft")return;s.preventDefault();const o=this.toModalTabKey(i.dataset.tab);if(!o)return;const l=s.key==="ArrowRight"?1:-1,d=(ne.indexOf(o)+l+ne.length)%ne.length,h=ne[d];r(h),e.find(u=>this.toModalTabKey(u.dataset.tab)===h)?.focus({preventScroll:true});});}),r(this.activeTab);}openSettingsModal(e=true){!this.modalElement||!this.fabElement||(this.modalElement.classList.remove("hidden"),this.modalElement.setAttribute("aria-hidden","false"),this.fabElement.setAttribute("aria-expanded","true"),e&&this.queryModalElement(`${C.modalTabs}.is-active`)?.focus({preventScroll:true}));}closeSettingsModal(){!this.modalElement||!this.fabElement||(this.modalElement.classList.add("hidden"),this.modalElement.setAttribute("aria-hidden","true"),this.fabElement.setAttribute("aria-expanded","false"),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:true}));}toModalTabKey(e){return e&&ne.includes(e)?e:null}setupAutoSearchToggle(){const e=this.queryModalElement(C.autoSearchToggle),n=this.queryModalElement(C.autoSearchOptionRow);if(!e||!n)return;const r=()=>{this.settings.autoSearchEnabled=!this.settings.autoSearchEnabled,this.updateAutoSearchToggleState(),this.updateSearchSectionNote(),this.settingsManager.updateSettings(this.settings),v.show(this.settings.autoSearchEnabled?p("autoSearchEnabled"):p("autoSearchDisabledManual"),"success");};n.addEventListener("click",i=>{i.target.closest(".playback-option__toggle")||r();}),n.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),r());}),e.addEventListener("change",()=>{r();}),this.updateAutoSearchToggleState();}updateAutoSearchToggleState(){const e=this.settings.autoSearchEnabled,n=this.queryModalElement(C.autoSearchToggle),r=this.queryModalElement(C.autoSearchOptionRow),i=r?.querySelector(".playback-option__icon-wrapper");n&&(n.checked=e),r&&(r.classList.toggle("playback-option--active",e),r.setAttribute("aria-pressed",e?"true":"false")),i&&i.classList.toggle("playback-option__icon-wrapper--active",e);}buildAutoSearchTooltipHtml(){return this.settings.autoSearchEnabled?`<strong style="color:#7F5AF0;">自動設定機能が有効です</strong><br>
        視聴ページを開くと、アニメタイトル・話数・エピソードタイトルから自動的にコメント数が最も多いニコニコ動画を検索して表示します。<br>
        手動で検索したい場合は、自動検索スイッチを無効にしてください。`:`<strong style="color:#2CB67D;">手動設定モードです</strong><br>
        自動検索が無効になっています。以下のフォームから動画を検索して選択してください。<br>
        自動検索を有効にするには自動検索スイッチを有効にしてください。`}updateSearchSectionNote(){this.autoSearchTooltipHtml=this.buildAutoSearchTooltipHtml();const e=this.queryModalElement("#autoSearchInfoBadge");e&&(e.style.color=this.settings.autoSearchEnabled?"rgba(127, 90, 240, 0.7)":"rgba(44, 182, 125, 0.7)");}ensureFabTooltip(){if(this.fabTooltipEl?.isConnected)return;const e=this.fabShadowRoot;if(!e)return;if(!e.querySelector("style[data-role='fab-tooltip-style']")){const r=document.createElement("style");r.dataset.role="fab-tooltip-style",r.textContent=`
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
      `,e.appendChild(r);}const n=document.createElement("div");n.className="fab-floating-tooltip",e.appendChild(n),this.fabTooltipEl=n;}showFabTooltip(e,n,r){this.ensureFabTooltip();const i=this.fabTooltipEl;if(!i)return;const a=300,s=8,o=e.getBoundingClientRect();i.innerHTML=n,i.className=`fab-floating-tooltip fab-floating-tooltip--${r}`,i.style.display="block",i.style.width=`${a}px`;let l=o.right-a;l<s&&(l=s),l+a>window.innerWidth-s&&(l=window.innerWidth-a-s),i.style.left=`${l}px`,i.style.top="0px",requestAnimationFrame(()=>{if(i.style.display==="none")return;const d=i.offsetHeight,h=o.top-s,c=window.innerHeight-o.bottom-s;let u;h>=d?u=o.top-d-s:c>=d?u=o.bottom+s:u=Math.max(s,o.top-d-s),i.style.top=`${u}px`;});}hideFabTooltip(){this.fabTooltipEl&&(this.fabTooltipEl.style.display="none");}shieldTooltipHtml="<strong>公式動画セーフガード有効</strong><br>アニメタイトルを入力すると、投稿者名が「アニメタイトル」「アニメタイトル 第Nクール」「dアニメストア ニコニコ支店」の公式動画のみが優先表示されます。エピソード切替時も公式動画のみが自動選択されます。";setupTooltipBadges(){const e=this.queryModalElement("#autoSearchInfoBadge"),n=this.queryModalElement(".shield-badge");e&&(e.addEventListener("mouseenter",()=>{this.showFabTooltip(e,this.autoSearchTooltipHtml,"info");}),e.addEventListener("mouseleave",()=>this.hideFabTooltip()),e.addEventListener("focusin",()=>{this.showFabTooltip(e,this.autoSearchTooltipHtml,"info");}),e.addEventListener("focusout",()=>this.hideFabTooltip())),n&&(n.addEventListener("mouseenter",()=>{this.showFabTooltip(n,this.shieldTooltipHtml,"shield");}),n.addEventListener("mouseleave",()=>this.hideFabTooltip()),n.addEventListener("focusin",()=>{this.showFabTooltip(n,this.shieldTooltipHtml,"shield");}),n.addEventListener("focusout",()=>this.hideFabTooltip()));}setupNgControls(){const e=this.queryModalElement(C.ngWords);e&&e.classList.remove("hidden");const n=this.queryModalElement(C.ngRegexps);n&&n.classList.remove("hidden");}setupSaveButton(){const e=this.queryModalElement(C.saveButton);e&&e.addEventListener("click",()=>this.saveSettings());}setupSearch(){const e=this.queryModalElement(C.searchInput),n=this.queryModalElement(C.searchAnimeTitle),r=this.queryModalElement(C.searchEpisodeNumber),i=this.queryModalElement(C.searchEpisodeTitle),a=this.queryModalElement(C.searchButton),s=this.queryModalElement(C.openSearchPage),o=this.queryModalElement(C.searchModeToggle),l=this.settingsManager.loadManualSearchSettings();l&&(n&&(n.value=l.animeTitle),r&&(r.value=l.episodeNumber),i&&(i.value=l.episodeTitle));const d=()=>{const x=o?.checked??false,b=this.queryModalElement("#searchModeLabelStructured"),y=this.queryModalElement("#searchModeLabelFree");b&&b.classList.toggle("search-mode-switch__label--active",!x),y&&y.classList.toggle("search-mode-switch__label--active",x);},h=()=>{const x=o?.checked??false,b=this.queryModalElement(C.searchStructuredFields),y=this.queryModalElement(C.searchFreeInputArea);b&&(b.style.display=x?"none":""),y&&(y.style.display=x?"":"none"),d();};o?.addEventListener("change",h),h();const c=()=>o?.checked??false,u=()=>{if(c())return e?.value.trim()??"";const x=n?.value.trim()??"",b=r?.value.trim()??"",y=i?.value.trim()??"";return [x,b,y].filter(Boolean).join(" ")},m=()=>{if(c())return;const x=n?.value.trim()??"",b=r?.value.trim()??"",y=i?.value.trim()??"";(x||b)&&this.settingsManager.saveManualSearchSettings({animeTitle:x,episodeNumber:b,episodeTitle:y});},g=async()=>{const x=u();if(!x){v.show(p("searchKeywordRequired"),"warning");return}m();const b=c()?"":n?.value.trim()??"";await this.executeSearch(x,b);};a?.addEventListener("click",g);const w=x=>{x.key==="Enter"&&g();};e?.addEventListener("keydown",w),n?.addEventListener("keydown",w),r?.addEventListener("keydown",w),i?.addEventListener("keydown",w),s?.addEventListener("click",x=>{x.preventDefault();const b=u(),y=b?yn(b):Rt.searchBase;De().open(y,"_blank","noopener");});}async executeSearch(e,n){try{v.show(_("searchingKeyword",{keyword:e}),"info");const r=await this.searcher.search(e);let i=r;if(n){const a=H.filterOfficialVideos(r,n);a.length>0?(i=a,te.info("SettingsUI.executeSearch:officialFiltered",{totalResults:r.length,officialResults:a.length,animeTitle:n})):(te.warn("SettingsUI.executeSearch:noOfficialVideos",{totalResults:r.length,animeTitle:n}),v.show(p("officialVideoMissing"),"warning"));}return this.renderSearchResults(i,a=>this.renderSearchResultItem(a)),i.length===0&&v.show(p("searchNoResults"),"warning"),i}catch(r){return te.error("SettingsUI.executeSearch",r),[]}}setSearchKeyword(e){const n=this.queryModalElement(C.searchInput);n&&(n.value=e,n.focus({preventScroll:true}));}renderSearchResults(e,n){const r=this.queryModalElement(C.searchResults);if(!r)return;r.innerHTML=e.map(a=>n(a)).join(""),r.querySelectorAll(".search-result-item").forEach((a,s)=>{a.addEventListener("click",()=>{const l=e[s];this.applySearchResult(l);});const o=a.querySelector(".open-search-page-direct-btn");o&&o.addEventListener("click",l=>{l.stopPropagation();});});}renderSearchResultItem(e){const n=this.formatSearchResultDate(e.postedAt),r=typeof e.similarity=="number"?`
          <div class="similarity-container" title="${_("similarity",{score:e.similarity.toFixed(2)})}">
            <div class="similarity-bar" style="width: ${e.similarity.toFixed(2)}%;"></div>
            <span class="similarity-text">${e.similarity.toFixed(0)}%</span>
          </div>
        `:"";return `
      <div class="search-result-item">
        <img src="${e.thumbnail}" alt="thumbnail">
        <div class="search-result-info">
          <div class="title">${e.title}</div>
          <div class="stats">
            <span class="stat-icon" title="${p("viewCount")}">
              ${Eo}
            </span>
            <span>${e.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="${p("commentCount")}">
              ${Ao}
            </span>
            <span>${e.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="${p("mylistCount")}">
              ${Lo}
            </span>
            <span>${e.mylistCount.toLocaleString()}</span>
            ${r}
          </div>
          <div class="date">${n}</div>
          <a href="${Rt.watchBase}/${e.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(e){try{const n=await this.fetcher.fetchApiData(e.videoId);await this.fetcher.fetchComments(),v.show(_("commentsSet",{title:e.title}),"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(e,n));}catch(n){te.error("SettingsUI.applySearchResult",n);}}buildVideoMetadata(e,n){return {videoId:e.videoId,title:e.title,viewCount:n.video?.count?.view??e.viewCount,commentCount:n.video?.count?.comment??e.commentCount,mylistCount:n.video?.count?.mylist??e.mylistCount,postedAt:n.video?.registeredAt??e.postedAt,thumbnail:n.video?.thumbnail?.url??e.thumbnail,owner:n.owner??e.owner??void 0,channel:n.channel??e.channel??void 0}}applySettingsToUI(){const e=this.queryModalElement(C.ngWords),n=this.queryModalElement(C.ngRegexps);e&&(e.value=(this.settings.ngWords??[]).join(`
`)),n&&(n.value=(this.settings.ngRegexps??[]).join(`
`)),this.updateAutoSearchToggleState(),this.updateSearchSectionNote();}saveSettings(){const e=this.queryModalElement(C.ngWords),n=this.queryModalElement(C.ngRegexps);e&&(this.settings.ngWords=e.value.split(`
`).map(r=>r.trim()).filter(Boolean)),n&&(this.settings.ngRegexps=n.value.split(`
`).map(r=>r.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings),v.show(p("settingsSaved"),"success");}updateCurrentVideoInfo(e){this.currentVideoInfo=e,[["currentTitle",e.title??"-"],["currentVideoId",e.videoId??"-"],["currentOwner",e.owner?.nickname??e.channel?.name??"-"],["currentViewCount",this.formatNumber(e.viewCount)],["currentCommentCount",this.formatNumber(e.commentCount)],["currentMylistCount",this.formatNumber(e.mylistCount)],["currentPostedAt",this.formatSearchResultDate(e.postedAt)]].forEach(([s,o])=>{const l=this.querySelector(C[s]);l&&(l.textContent=o);});const r=this.querySelector(C.currentThumbnail);r&&e.thumbnail&&(r.src=e.thumbnail,r.alt=e.title??p("thumbnail"));const i=this.querySelector("#currentVideoAmbient");i&&e.thumbnail&&(i.style.backgroundImage=`url('${e.thumbnail}')`);const a=this.querySelector(".video-card");a&&a.classList.toggle("video-card--empty",!e.videoId);try{this.settingsManager.saveVideoData(e.title??"",e);}catch(s){te.error("SettingsUI.updateCurrentVideoInfo",s);}}formatNumber(e){return typeof e=="number"?e.toLocaleString():"-"}formatSearchResultDate(e){if(!e)return "-";const n=new Date(e);return Number.isNaN(n.getTime())?e:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(n)}destroy(){this.hideFabTooltip(),this.fabTooltipEl=null,this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),super.destroy();}createOrUpdateFab(){if(!document.body)return null;let e=this.fabHostElement;!e||!e.isConnected?(e?.remove(),e=document.createElement("div"),e.id=be.FAB_HOST_ID,e.style.position="fixed",e.style.bottom="32px",e.style.right="32px",e.style.zIndex="2147483646",e.style.display="inline-block",this.fabShadowRoot=e.attachShadow({mode:"open"}),document.body.appendChild(e),this.fabHostElement=e):this.fabShadowRoot||(this.fabShadowRoot=e.shadowRoot??e.attachShadow({mode:"open"}));const n=this.fabShadowRoot;if(!n)return null;let r=n.querySelector("style[data-role='fab-base-style']");r||(r=document.createElement("style"),r.dataset.role="fab-base-style",r.textContent=ae.getCommonStyles(),n.appendChild(r));let i=n.querySelector("style[data-role='fab-style']");i||(i=document.createElement("style"),i.dataset.role="fab-style",i.textContent=`
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
      `,n.appendChild(i));let a=n.querySelector("style[data-role='similarity-style']");a||(a=document.createElement("style"),a.dataset.role="similarity-style",a.textContent=Wt,n.appendChild(a));let s=n.querySelector("style[data-role='search-fields-style']");s||(s=document.createElement("style"),s.dataset.role="search-fields-style",s.textContent=Do,n.appendChild(s));let o=n.querySelector(".fab-container");o||(o=document.createElement("div"),o.className="fab-container",n.appendChild(o));let l=o.querySelector("button.fab-button");l||(l=document.createElement("button"),l.type="button",l.className="fab-button",o.appendChild(l)),l.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${se}</span>
      <span class="fab-button__label">${p("settings")}</span>
    `,l.setAttribute("aria-label",p("settingsFabLabel")),l.setAttribute("aria-haspopup","dialog");let d=o.querySelector(C.settingsModal);return d||(o.insertAdjacentHTML("beforeend",this.buildModalHtml()),d=o.querySelector(C.settingsModal)),this.modalElement=d??null,l}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener("click",this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null,this.fabTooltipEl=null;}queryModalElement(e){return this.fabShadowRoot?this.fabShadowRoot.querySelector(e):null}queryModalSelectorAll(e){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}}const Ho=R("dAnime:PlaybackRateController"),zo=1,Oo=200,No=1e-4;class Re{constructor(e){this.settingsManager=e,this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.settingsObserver=n=>{this.playbackSettings=n,this.applyCurrentMode();},this.settingsManager.addPlaybackObserver(this.settingsObserver);}currentVideo=null;playbackSettings;settingsObserver;isApplying=false;retryTimer=null;handleLoadedMetadata=()=>{this.applyCurrentMode();};handleRateChange=()=>{this.isApplying||this.playbackSettings.fixedModeEnabled&&this.scheduleApply();};handlePlay=()=>{this.applyCurrentMode();};handleEmptied=()=>{this.scheduleApply();};bind(e){if(this.currentVideo===e){this.applyCurrentMode();return}this.detachVideoListeners(),this.cancelScheduledApply(),this.currentVideo=e,this.attachVideoListeners(e),this.applyCurrentMode();}unbind(){this.cancelScheduledApply(),this.detachVideoListeners(),this.currentVideo=null;}dispose(){this.unbind(),this.settingsManager.removePlaybackObserver(this.settingsObserver);}attachVideoListeners(e){e.addEventListener("loadedmetadata",this.handleLoadedMetadata),e.addEventListener("ratechange",this.handleRateChange),e.addEventListener("play",this.handlePlay),e.addEventListener("emptied",this.handleEmptied);}detachVideoListeners(){this.currentVideo&&(this.currentVideo.removeEventListener("loadedmetadata",this.handleLoadedMetadata),this.currentVideo.removeEventListener("ratechange",this.handleRateChange),this.currentVideo.removeEventListener("play",this.handlePlay),this.currentVideo.removeEventListener("emptied",this.handleEmptied));}applyCurrentMode(){const e=this.currentVideo;e&&(this.playbackSettings.fixedModeEnabled?this.setPlaybackRate(e,this.playbackSettings.fixedRate):this.setPlaybackRate(e,zo));}setPlaybackRate(e,n){if(!(!Number.isFinite(n)||n<=0)&&!(Math.abs(e.playbackRate-n)<=No)){this.isApplying=true;try{e.playbackRate=n;}catch(r){Ho.warn("再生速度の設定に失敗しました",r),this.scheduleApply();}finally{window.setTimeout(()=>{this.isApplying=false;},0);}}}scheduleApply(){this.cancelScheduledApply(),this.retryTimer=window.setTimeout(()=>{this.retryTimer=null,this.applyCurrentMode();},Oo);}cancelScheduledApply(){this.retryTimer!==null&&(window.clearTimeout(this.retryTimer),this.retryTimer=null);}}const Bt=async()=>{},$o=()=>{const t=De();if(!t.dAniRenderer){const e={};t.dAniRenderer={classes:{Comment:dn,CommentRenderer:re,NicoApiFetcher:J,NotificationManager:v,StyleManager:wn,SettingsUI:be,NicoVideoSearcher:H,VideoSwitchHandler:Ae,SettingsManager:Ye,KeyboardShortcutHandler:gn,DebounceExecutor:Ke,ShadowDOMComponent:Ge,ShadowStyleManager:ae,PlaybackRateController:Re},instances:e,utils:{initialize:Bt,initializeWithVideo:Bt},debug:{showState:()=>{console.log("Current instances:",e);},showSettings:()=>{const n=e.settingsManager;if(!n){console.log("SettingsManager not initialized");return}console.log("Current settings:",n.getSettings());},showComments:()=>{const n=e.renderer;if(!n){console.log("CommentRenderer not initialized");return}console.log("Current comments:",n.getCommentsSnapshot());}},defaultSettings:Y};}return t.dAniRenderer},qt=R("dAnime:PlayerControlButton"),Ut="danime-pcb-host",Wo=100,Bo=150;class qo{constructor(e){this.settingsManager=e;}btnWrapper=null;panelShadowRoot=null;isOpen=false;mountRetryTimer=null;mouseHideTimer=null;settingsObserver=null;playbackObserver=null;mount(){if(document.getElementById(Ut))return;const e=document.querySelector(T.watchSettingButton);if(!e){this.mountRetryTimer=window.setTimeout(()=>{this.mount();},Wo);return}this.injectButton(e),qt.info("playerControlButton:mounted");}destroy(){this.mountRetryTimer!==null&&(window.clearTimeout(this.mountRetryTimer),this.mountRetryTimer=null),this.cancelHideTimer(),this.settingsObserver&&(this.settingsManager.removeObserver(this.settingsObserver),this.settingsObserver=null),this.playbackObserver&&(this.settingsManager.removePlaybackObserver(this.playbackObserver),this.playbackObserver=null),this.closePanel(),this.btnWrapper?.remove(),this.btnWrapper=null,this.panelShadowRoot=null,qt.info("playerControlButton:destroyed");}injectButton(e){const n=document.createElement("div");n.id=Ut,n.className="mainButton",n.style.cssText="position:relative;z-index:500;cursor:pointer";const r=document.createElement("button");r.type="button",r.title=p("commentSettings"),r.setAttribute("aria-label",p("commentSettingsPanel")),r.setAttribute("aria-expanded","false"),r.style.cssText=["width:100%","height:100%","background:transparent","border:none","cursor:pointer","padding:0","display:flex","align-items:center","justify-content:center","color:#ffffff"].join(";"),r.innerHTML=ko;const i=document.createElement("div"),a=i.attachShadow({mode:"open"});this.panelShadowRoot=a,n.appendChild(r),n.appendChild(i),e.insertAdjacentElement("beforebegin",n),this.btnWrapper=n,this.buildPanel(a),n.addEventListener("mouseenter",()=>{this.cancelHideTimer(),this.openPanel();}),n.addEventListener("mouseleave",()=>{this.scheduleHide();}),this.registerObservers();}buildPanel(e){const n=this.settingsManager.getSettings(),r=this.settingsManager.getPlaybackSettings(),i=document.createElement("style");i.textContent=this.getPanelCSS(),e.appendChild(i);const a=document.createElement("div");a.className="panel",a.setAttribute("hidden",""),a.setAttribute("role","dialog"),a.setAttribute("aria-label",p("commentSettings")),a.innerHTML=this.buildPanelHTML(n,r),e.appendChild(a),a.addEventListener("mouseenter",()=>{this.cancelHideTimer();}),a.addEventListener("mouseleave",()=>{this.scheduleHide();}),this.bindPanelEvents(e);}getPanelCSS(){return `
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
    `}buildPanelHTML(e,n){const r=e.isCommentVisible?se:me,i=Math.round((e.commentOpacity??1)*100),a=n.fixedRate.toFixed(2),s=n.fixedModeEnabled?"":"disabled";return `
      <p class="panel__title">${p("commentSettings")}</p>

      <div class="row">
        <span class="row__label">
          <span id="pcb-vis-icon">${r}</span>${p("commentVisibility")}
        </span>
        <label class="toggle" aria-label="${p("commentVisibilityToggle")}">
          <input type="checkbox" id="pcb-visibility" ${e.isCommentVisible?"checked":""}>
          <span class="toggle__track"></span>
          <span class="toggle__thumb"></span>
        </label>
      </div>

      <div class="row">
        <span class="row__label">${p("color")}</span>
        <input type="color" id="pcb-color" class="color-picker"
               value="${e.commentColor}" title="${p("commentColor")}">
      </div>

      <div class="row row--stacked">
        <span class="row__label">${p("commentOpacity")}</span>
        <div class="slider-wrap">
          <input type="range" id="pcb-opacity" class="slider"
                 min="0.1" max="1" step="0.05" value="${e.commentOpacity??1}">
          <span class="slider__value" id="pcb-opacity-val">${i}%</span>
        </div>
      </div>

      <p class="section-title">${p("playbackRate")}</p>

      <div class="row">
        <span class="row__label">${p("fixedPlaybackRate")}</span>
        <label class="toggle" aria-label="${p("playbackRateFixedToggle")}">
          <input type="checkbox" id="pcb-speed-mode" ${n.fixedModeEnabled?"checked":""}>
          <span class="toggle__track"></span>
          <span class="toggle__thumb"></span>
        </label>
      </div>

      <div class="speed-range-row">
        <div class="slider-wrap">
          <input type="range" id="pcb-speed-range" class="slider"
                 min="1.0" max="1.5" step="0.01" value="${a}" ${s}>
          <span class="slider__value" id="pcb-speed-val">${a}×</span>
        </div>
      </div>
    `}bindPanelEvents(e){const n=e.getElementById("pcb-visibility");n?.addEventListener("change",()=>{const d=e.getElementById("pcb-vis-icon");d&&(d.innerHTML=n.checked?se:me),this.settingsManager.updateSettings({isCommentVisible:n.checked});});const r=e.getElementById("pcb-color");r?.addEventListener("input",()=>{this.settingsManager.updateSettings({commentColor:r.value});});const i=e.getElementById("pcb-opacity"),a=e.getElementById("pcb-opacity-val");i?.addEventListener("input",()=>{const d=parseFloat(i.value);a&&(a.textContent=`${Math.round(d*100)}%`),this.settingsManager.updateSettings({commentOpacity:d});});const s=e.getElementById("pcb-speed-mode"),o=e.getElementById("pcb-speed-range"),l=e.getElementById("pcb-speed-val");s?.addEventListener("change",()=>{o&&(o.disabled=!s.checked),this.settingsManager.updatePlaybackSettings({fixedModeEnabled:s.checked});}),o?.addEventListener("input",()=>{const d=parseFloat(o.value);l&&(l.textContent=`${d.toFixed(2)}×`),this.settingsManager.updatePlaybackSettings({fixedRate:d});});}openPanel(){if(this.isOpen)return;const e=this.panelShadowRoot?.querySelector(".panel"),n=this.btnWrapper?.querySelector("button");e&&(e.removeAttribute("hidden"),n?.setAttribute("aria-expanded","true"),this.isOpen=true);}closePanel(){const e=this.panelShadowRoot?.querySelector(".panel"),n=this.btnWrapper?.querySelector("button");e?.setAttribute("hidden",""),n?.setAttribute("aria-expanded","false"),this.isOpen=false;}scheduleHide(){this.cancelHideTimer(),this.mouseHideTimer=window.setTimeout(()=>{this.closePanel();},Bo);}cancelHideTimer(){this.mouseHideTimer!==null&&(window.clearTimeout(this.mouseHideTimer),this.mouseHideTimer=null);}registerObservers(){this.settingsObserver=e=>{this.syncSettingsToPanel(e);},this.settingsManager.addObserver(this.settingsObserver),this.playbackObserver=e=>{this.syncPlaybackToPanel(e);},this.settingsManager.addPlaybackObserver(this.playbackObserver);}syncSettingsToPanel(e){const n=this.panelShadowRoot;if(!n)return;const r=n.getElementById("pcb-visibility");r&&(r.checked=e.isCommentVisible);const i=n.getElementById("pcb-vis-icon");i&&(i.innerHTML=e.isCommentVisible?se:me);const a=n.getElementById("pcb-color");a&&(a.value=e.commentColor);const s=n.getElementById("pcb-opacity"),o=n.getElementById("pcb-opacity-val");s&&(s.value=String(e.commentOpacity??1)),o&&(o.textContent=`${Math.round((e.commentOpacity??1)*100)}%`);}syncPlaybackToPanel(e){const n=this.panelShadowRoot;if(!n)return;const r=n.getElementById("pcb-speed-mode");r&&(r.checked=e.fixedModeEnabled);const i=n.getElementById("pcb-speed-range");i&&(i.disabled=!e.fixedModeEnabled,i.value=e.fixedRate.toFixed(2));const a=n.getElementById("pcb-speed-val");a&&(a.textContent=`${e.fixedRate.toFixed(2)}×`);}}const Uo=100,Yo=1e3,Yt=3e3,Go=2e3,Gt="cachedAnimeTitle",f=R("dAnime:WatchPageController");class Ko{constructor(e){this.global=e;try{this.cachedAnimeTitle=X(Gt,null),this.cachedAnimeTitle&&f.info("watchPageController:constructor:loadedCachedTitle",{cachedAnimeTitle:this.cachedAnimeTitle});}catch(n){f.error("watchPageController:constructor:loadCacheFailed",n),this.cachedAnimeTitle=null;}}initialized=false;switchDebounce=new Ke(Yo);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;playbackRateController=null;playerControlButton=null;lastPartId=null;partIdMonitorIntervalId=null;isPartIdChanging=false;cachedAnimeTitle=null;lastEpisodeNumber=null;rendererSettingsObserver=null;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(e=>{window.addEventListener("load",()=>e(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const e=document.querySelector(T.watchVideoElement);if(!e){window.setTimeout(()=>this.waitForVideoElement(),Uo);return}if(e.readyState===0){e.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(e);},{once:true});return}this.initializeWithVideo(e);}async initializeWithVideo(e){if(!this.initialized){this.initialized=true;try{v.show(p("initializingCommentLoader"));const n=v.getInstance(),r=this.global.settingsManager??new Ye(n);this.global.settingsManager=r,this.global.instances.settingsManager=r,this.playerControlButton||(this.playerControlButton=new qo(r),this.playerControlButton.mount());const i=r.loadSettings();if(!i.isCommentVisible){f.info("watchPageController:initializeWithVideo:skipDueToVisibility",{isCommentVisible:i.isCommentVisible}),v.show(p("commentsHiddenSkip"),"info");return}if(!i.autoSearchEnabled){f.info("watchPageController:initializeWithVideo:manualMode",{autoSearchEnabled:i.autoSearchEnabled});const m=r.loadVideoData();if(!m?.videoId){v.show(p("manualModeSelectVideo"),"info");return}f.info("watchPageController:initializeWithVideo:manualMode:loadSavedVideo",{videoId:m.videoId,title:m.title}),await this.loadCommentsFromSavedVideo(e,r,m);return}if(await this.waitForMetadataElements(),!await this.autoSetupComments(r))throw new Error(p("metadataAutoFetchFailed"));const s=r.loadVideoData();if(!s?.videoId)throw new Error(p("videoDataMissing"));const o=new J;this.global.instances.fetcher=o,await o.fetchApiData(s.videoId);const l=await o.fetchComments(),d=this.mergeSettings(r.loadSettings()),h=new re(d);h.initialize(e),this.global.instances.renderer=h,this.currentVideoElement=e;const c=this.playbackRateController??new Re(r);this.playbackRateController=c,this.global.instances.playbackRateController=c,c.bind(e),this.ensureRendererSettingsObserver(r),this.applyRendererSettings(r.loadSettings()),l.forEach(m=>{h.addComment(m.text,m.vposMs,m.commands);});const u=new Ae(h,o,r);u.startMonitoring(),this.global.instances.switchHandler=u,this.setupSwitchHandling(e,u),this.observeVideoElement(),this.startPartIdMonitoring(),v.show(_("commentsLoadComplete",{count:String(l.length)}),"success");}catch(n){throw this.initialized=false,v.show(_("initializationError",{message:n.message}),"error"),n}}}mergeSettings(e){const n=Y();return {...n,...e,ngWords:[...e.ngWords??n.ngWords],ngRegexps:[...e.ngRegexps??n.ngRegexps]}}ensureRendererSettingsObserver(e){this.rendererSettingsObserver||(this.rendererSettingsObserver=n=>{this.applyRendererSettings(n);},e.addObserver(this.rendererSettingsObserver));}applyRendererSettings(e){const n=this.global.instances.renderer;if(!n)return;const r=this.mergeSettings(e);n.settings.isCommentVisible!==r.isCommentVisible&&n.setCommentVisibility(r.isCommentVisible),n.settings=r;}setupSwitchHandling(e,n){this.currentVideoElement=e,this.switchCallback=()=>{if(this.isPartIdChanging){f.info("watchPageController:switchBlocked",{reason:"partId change in progress"});return}const r=Date.now();if(r-this.lastSwitchTimestamp<Yt){f.debug("watchPageController:switchCooldown",{timeSinceLastSwitch:r-this.lastSwitchTimestamp,cooldownMs:Yt});return}this.lastSwitchTimestamp=r;const i=this.currentVideoElement;f.info("watchPageController:switchHandlerTriggered",{currentTime:i?.currentTime??null,duration:i?.duration??null}),n.onVideoSwitch(i);},this.global.utils.initializeWithVideo=async r=>{r&&(this.rebindVideoElement(r),this.playbackRateController?.bind(r),await n.onVideoSwitch(r));},this.currentVideoElement=e;}observeVideoElement(){const e=this.currentVideoElement;e&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{const n=document.querySelector(T.watchVideoElement);!n||n===this.currentVideoElement||this.rebindVideoElement(n);}),this.domMutationObserver.observe(document.body,{childList:true,subtree:true}),this.attachVideoEventListeners(e));}rebindVideoElement(e){this.detachVideoEventListeners(),this.currentVideoElement=e;const n=this.global.instances.renderer,r=this.global.instances.switchHandler;n&&(n.clearComments(),n.destroy(),n.initialize(e),n.resize()),this.playbackRateController?.bind(e),r&&(r.onVideoSwitch(e),this.setupSwitchHandling(e,r)),this.attachVideoEventListeners(e);}attachVideoEventListeners(e){this.detachVideoEventListeners(),Ht().attach(e);const r=i=>{if(!this.switchCallback)return;const a=i.type,s=this.hasVideoSourceChanged(e);if(a==="ended"&&!s){f.info("watchPageController:skipSwitchOnEnded",{eventType:a,currentTime:e.currentTime,duration:e.duration,ended:e.ended,paused:e.paused,currentSrc:e.currentSrc||e.getAttribute("src")||null});return}f.info("watchPageController:eventTriggered",{eventType:a,currentTime:e.currentTime,duration:e.duration,ended:e.ended,paused:e.paused,sourceChanged:s}),this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback);};e.addEventListener("ended",r),e.addEventListener("loadedmetadata",r),e.addEventListener("emptied",r),this.videoEndedListener=r;}detachVideoEventListeners(){const e=this.currentVideoElement;Ht().detach(),e&&this.videoEndedListener&&(e.removeEventListener("ended",this.videoEndedListener),e.removeEventListener("loadedmetadata",this.videoEndedListener),e.removeEventListener("emptied",this.videoEndedListener)),this.videoEndedListener=null;}hasVideoSourceChanged(e){const n=e.currentSrc||e.getAttribute("src")||e.querySelector("source[src]")?.getAttribute("src")||null,r=this.global.instances.renderer?.getCurrentVideoSource()??null;return n?r?r!==n:true:false}async waitForMetadataElements(e,n){const a=Date.now();for(let l=0;l<50;l++){const d=this.getCurrentPartId(),h=document.querySelector(T.watchPageAnimeTitle),c=document.querySelector(T.watchPageEpisodeNumber),u=document.querySelector(T.watchPageEpisodeTitle),m=h?.textContent?.trim()??"",g=c?.textContent?.trim()??"",w=u?.textContent?.trim()??"";if(l===0&&f.info("watchPageController:waitForMetadata:start",{currentPartId:d,expectedPartId:e,episodeNumber:g,episodeTitle:w,animeTitle:m||"(empty)",cachedAnimeTitle:this.cachedAnimeTitle||"(empty)",previousEpisodeNumber:n||"(none)"}),!e&&!this.cachedAnimeTitle&&l<20&&!m){await new Promise(V=>window.setTimeout(V,100));continue}if((!e||d===e)&&(g&&w)&&(!n||g!==n)){f.info("watchPageController:waitForMetadata:success",{attempts:l+1,waited:Date.now()-a,currentPartId:d,expectedPartId:e,episodeNumber:g,episodeTitle:w,animeTitle:m||"(empty)",previousEpisodeNumber:n||"(none)"});return}await new Promise(V=>window.setTimeout(V,100));}const s=document.querySelector(T.watchPageEpisodeNumber)?.textContent?.trim()??"",o=document.querySelector(T.watchPageEpisodeTitle)?.textContent?.trim()??"";throw f.error("watchPageController:waitForMetadata:timeout",{maxRetries:50,waited:Date.now()-a,currentPartId:this.getCurrentPartId(),expectedPartId:e,previousEpisodeNumber:n||"(none)",finalEpisodeNumber:s,finalEpisodeTitle:o}),new Error(`DOM更新のタイムアウト: partId=${e}, 前回エピソード="${n||"なし"}", 現在エピソード="${s}"`)}extractMetadataFromPage(){try{const e=document.querySelector(T.watchPageAnimeTitle),n=document.querySelector(T.watchPageEpisodeNumber),r=document.querySelector(T.watchPageEpisodeTitle);let i=e?.textContent?.trim()??"";const a=n?.textContent?.trim()??"",s=r?.textContent?.trim()??"";if(i){this.cachedAnimeTitle=i;try{Z(Gt,i),f.info("watchPageController:extractMetadata:cachedTitle",{animeTitle:i});}catch(o){f.error("watchPageController:extractMetadata:saveCacheFailed",o);}}else this.cachedAnimeTitle&&(i=this.cachedAnimeTitle,f.info("watchPageController:extractMetadata:usedCachedTitle",{cachedAnimeTitle:this.cachedAnimeTitle}));return f.info("watchPageController:extractMetadata:rawValues",{animeTitle:i||"(empty)",animeTitleElementExists:!!e,animeTitleFromCache:!e&&!!this.cachedAnimeTitle,episodeNumber:a,episodeNumberElementExists:!!n,episodeTitle:s,episodeTitleElementExists:!!r,currentPartId:this.getCurrentPartId()}),a?(i||f.warn("watchPageController:extractMetadata:noAnimeTitle",{hasCache:!!this.cachedAnimeTitle}),this.lastEpisodeNumber=a,{animeTitle:i,episodeNumber:a,episodeTitle:s}):(f.warn("watchPageController:extractMetadata:insufficient",{episodeNumber:a||"(empty)",episodeTitle:s||"(empty)"}),null)}catch(e){return f.error("watchPageController:extractMetadata:error",e),null}}async autoSetupComments(e){try{const n=this.extractMetadataFromPage();if(!n)return f.warn("watchPageController:autoSetup:noMetadata"),!1;if(!n.animeTitle)return f.warn("watchPageController:autoSetup:noAnimeTitle",{episodeNumber:n.episodeNumber,episodeTitle:n.episodeTitle,cachedAnimeTitle:this.cachedAnimeTitle}),v.show(p("noAnimeTitle"),"warning"),!1;const r=[n.animeTitle,n.episodeNumber,n.episodeTitle].filter(Boolean).join(" ");f.info("watchPageController:autoSetup",{keyword:r,animeTitle:n.animeTitle,episodeNumber:n.episodeNumber,episodeTitle:n.episodeTitle,usingCachedTitle:!!this.cachedAnimeTitle&&!n.animeTitle}),v.show(_("searchingKeyword",{keyword:r}),"info");const a=await new H().search(r);if(a.length===0)return v.show(p("niconicoNotFound"),"warning"),!1;const s=H.filterOfficialVideos(a,n.animeTitle);f.info("watchPageController:autoSetup:officialFilter",{totalResults:a.length,officialResults:s.length,animeTitle:n.animeTitle}),s.length===0&&(f.warn("watchPageController:autoSetup:noOfficialVideos",{animeTitle:n.animeTitle,firstResultOwner:a[0]?.owner?.nickname??a[0]?.channel?.name??"不明"}),v.show(p("officialVideoMissingUseFirst"),"warning"));const o=s.length>0?s[0]:a[0],d=await new J().fetchApiData(o.videoId),h={videoId:o.videoId,title:o.title,viewCount:d.video?.count?.view??o.viewCount,commentCount:d.video?.count?.comment??o.commentCount,mylistCount:d.video?.count?.mylist??o.mylistCount,postedAt:d.video?.registeredAt??o.postedAt,thumbnail:d.video?.thumbnail?.url??o.thumbnail,owner:d.owner??o.owner??null,channel:d.channel??o.channel??null};if(e.saveVideoData(o.title,h)){f.info("watchPageController:autoSetup:success",{videoId:o.videoId,title:o.title,commentCount:o.commentCount});const u=o.owner?.nickname||o.channel?.name||"不明",m=[`<div style="font-weight: 600; margin-bottom: 8px;">${p("autoSetupComplete")}</div>`,'<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${$t}</span>`,`  <span style="flex: 1; word-break: break-word;">${o.title}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Le}</span>`,`  <span>${u}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">','  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Fe}</span>`,`    <span>${o.viewCount.toLocaleString()}</span>`,"  </div>",'  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Pe}</span>`,`    <span>${o.commentCount.toLocaleString()}</span>`,"  </div>","</div>"].join("");return v.show(m,"success",5e3),!0}return !1}catch(n){return f.error("watchPageController:autoSetup:error",n),v.show(_("autoSetupError",{message:n.message}),"error"),false}}getCurrentPartId(){try{return new URLSearchParams(window.location.search).get("partId")}catch(e){return f.error("watchPageController:getCurrentPartId:error",e),null}}startPartIdMonitoring(){this.stopPartIdMonitoring(),this.lastPartId=this.getCurrentPartId(),this.partIdMonitorIntervalId=window.setInterval(()=>{this.checkPartIdChange();},Go);}stopPartIdMonitoring(){this.partIdMonitorIntervalId!==null&&(window.clearInterval(this.partIdMonitorIntervalId),this.partIdMonitorIntervalId=null);}async checkPartIdChange(){const e=this.getCurrentPartId();e===null||e===this.lastPartId||(f.warn("watchPageController:partIdChanged",{oldPartId:this.lastPartId,newPartId:e,url:window.location.href,timestamp:new Date().toISOString()}),this.lastPartId=e,await this.onPartIdChanged());}async waitForVideoReady(e){const i=Date.now();for(f.info("watchPageController:waitForVideoReady:start",{readyState:e.readyState,duration:e.duration,src:e.currentSrc});e.readyState<2&&Date.now()-i<5e3;)await new Promise(a=>window.setTimeout(a,100));f.info("watchPageController:waitForVideoReady:complete",{readyState:e.readyState,duration:e.duration,waited:Date.now()-i});}async onPartIdChanged(){this.isPartIdChanging=true;try{const e=this.global.settingsManager;if(!e){f.warn("watchPageController:onPartIdChanged:noSettingsManager");return}const n=e.getSettings();if(!n.isCommentVisible){f.info("watchPageController:onPartIdChanged:skipDueToVisibility",{isCommentVisible:n.isCommentVisible}),v.show(p("commentsHiddenSkip"),"info");return}const r=this.lastEpisodeNumber??document.querySelector(T.watchPageEpisodeNumber)?.textContent?.trim()??null;if(!n.autoSearchEnabled){f.info("watchPageController:onPartIdChanged:manualMode",{autoSearchEnabled:n.autoSearchEnabled});const s=e.loadManualSearchSettings();if(!s?.animeTitle){v.show(p("manualModeSelectAnimeTitle"),"info");const o=this.global.instances.renderer;o&&o.clearComments();return}await this.handleManualModeEpisodeSwitch(e,s.animeTitle,r);return}f.info("watchPageController:onPartIdChanged:start",{currentVideoElement:this.currentVideoElement?"present":"null",rendererExists:!!this.global.instances.renderer,switchHandlerExists:!!this.global.instances.switchHandler,isPartIdChanging:this.isPartIdChanging,newPartId:this.getCurrentPartId(),previousEpisodeNumber:r}),v.show(p("episodeChangeDetected"),"info");const i=this.getCurrentPartId();f.info("watchPageController:onPartIdChanged:waitingForDomUpdate",{newPartId:i,previousEpisodeNumber:r});try{await this.waitForMetadataElements(i??void 0,r??void 0);}catch(s){f.error("watchPageController:onPartIdChanged:waitMetadataFailed",s),v.show(_("domUpdateWaitFailed",{message:s.message}),"error");return}const a=await this.autoSetupComments(e);if(f.info("watchPageController:onPartIdChanged:autoSetup",{success:a}),a){const s=e.loadVideoData();f.warn("watchPageController:onPartIdChanged:loadedVideoData",{videoId:s?.videoId??null,title:s?.title??null});const o=this.currentVideoElement??document.querySelector(T.watchVideoElement);if(f.warn("watchPageController:onPartIdChanged:videoElement",{videoElementFound:!!o,currentTime:o?.currentTime??null,duration:o?.duration??null,src:o?.currentSrc??null,readyState:o?.readyState??null}),o&&s?.videoId){await this.waitForVideoReady(o),o.dataset.videoId=s.videoId;const l=this.global.instances.renderer,d=this.global.instances.switchHandler;if(f.warn("watchPageController:onPartIdChanged:beforeSwitch",{rendererCommentCount:l?.getCommentsSnapshot().length??0,videoCurrentTime:o.currentTime,videoReadyState:o.readyState,videoSrc:o.currentSrc,videoId:s.videoId}),l&&d){f.warn("watchPageController:onPartIdChanged:destroyBefore",{commentsBeforeDestroy:l.getCommentsSnapshot().length,currentVideoSrc:l.getCurrentVideoSource(),videoElement:l.getVideoElement()?"attached":"detached"});const h=l.settings;l.destroy(),f.warn("watchPageController:onPartIdChanged:createNew",{savedSettings:h});const c=new re(h,{loggerNamespace:"dAnime:CommentRenderer"});this.global.instances.renderer=c,f.warn("watchPageController:onPartIdChanged:reinitialize",{videoElementSrc:o.currentSrc,videoElementReadyState:o.readyState,videoElementCurrentTime:o.currentTime}),c.initialize(o),f.warn("watchPageController:onPartIdChanged:reinitializeComplete",{commentsAfterReinitialize:c.getCommentsSnapshot().length,newVideoSrc:c.getCurrentVideoSource()}),d.updateRenderer(c),d.resetVideoSource(),await d.onVideoSwitch(o),f.warn("watchPageController:onPartIdChanged:afterSwitch",{rendererCommentCount:c.getCommentsSnapshot().length,videoCurrentTime:o.currentTime,finalVideoSrc:c.getCurrentVideoSource()});}}}f.info("watchPageController:onPartIdChanged:complete");}catch(e){f.error("watchPageController:onPartIdChanged:error",e),v.show(_("episodeSwitchError",{message:e.message}),"error");}finally{this.isPartIdChanging=false,f.info("watchPageController:onPartIdChanged:flagReset",{isPartIdChanging:this.isPartIdChanging});}}async loadCommentsFromSavedVideo(e,n,r){try{const i=new J;this.global.instances.fetcher=i,await i.fetchApiData(r.videoId);const a=await i.fetchComments(),s=this.mergeSettings(n.loadSettings()),o=new re(s);o.initialize(e),this.global.instances.renderer=o,this.currentVideoElement=e;const l=this.playbackRateController??new Re(n);this.playbackRateController=l,this.global.instances.playbackRateController=l,l.bind(e),this.ensureRendererSettingsObserver(n),this.applyRendererSettings(n.loadSettings()),a.forEach(h=>{o.addComment(h.text,h.vposMs,h.commands);});const d=new Ae(o,i,n);d.startMonitoring(),this.global.instances.switchHandler=d,this.setupSwitchHandling(e,d),this.observeVideoElement(),this.startPartIdMonitoring(),v.show(_("manualModeCommentsLoadComplete",{count:String(a.length),title:r.title}),"success");}catch(i){f.error("watchPageController:loadCommentsFromSavedVideo:error",i),v.show(_("commentsLoadErrorSelectAnother",{message:i.message}),"error");}}async handleManualModeEpisodeSwitch(e,n,r){try{const i=this.getCurrentPartId();f.info("watchPageController:manualModeSwitch:waitingForDomUpdate",{newPartId:i,previousEpisodeNumber:r,savedAnimeTitle:n});try{await this.waitForMetadataElements(i??void 0,r??void 0);}catch(b){f.error("watchPageController:manualModeSwitch:waitMetadataFailed",b),v.show(_("domUpdateWaitFailed",{message:b.message}),"error");return}const a=document.querySelector(T.watchPageEpisodeNumber)?.textContent?.trim()??"";if(!a){f.warn("watchPageController:manualModeSwitch:noEpisodeNumber"),v.show(p("episodeNumberMissing"),"warning");return}const s=`${n} ${a}`;f.info("watchPageController:manualModeSwitch:search",{keyword:s,savedAnimeTitle:n,newEpisodeNumber:a}),v.show(_("searchingKeyword",{keyword:s}),"info");const l=await new H().search(s);if(l.length===0){v.show(p("niconicoNotFoundManual"),"warning");const b=this.global.instances.renderer;b&&b.clearComments();return}const d=H.filterOfficialVideos(l,n);if(f.info("watchPageController:manualModeSwitch:officialFilter",{totalResults:l.length,officialResults:d.length,savedAnimeTitle:n}),d.length===0){v.show(p("officialVideoMissingManual"),"warning");const b=this.global.instances.renderer;b&&b.clearComments();return}const h=d[0],u=await new J().fetchApiData(h.videoId),m={videoId:h.videoId,title:h.title,viewCount:u.video?.count?.view??h.viewCount,commentCount:u.video?.count?.comment??h.commentCount,mylistCount:u.video?.count?.mylist??h.mylistCount,postedAt:u.video?.registeredAt??h.postedAt,thumbnail:u.video?.thumbnail?.url??h.thumbnail,owner:u.owner??h.owner??null,channel:u.channel??h.channel??null};e.saveVideoData(h.title,m),e.saveManualSearchSettings({animeTitle:n,episodeNumber:a,episodeTitle:""});const g=this.currentVideoElement??document.querySelector(T.watchVideoElement);if(g){await this.waitForVideoReady(g),g.dataset.videoId=h.videoId;const b=this.global.instances.renderer,y=this.global.instances.switchHandler;if(b&&y){const E=b.settings;b.destroy();const V=new re(E,{loggerNamespace:"dAnime:CommentRenderer"});this.global.instances.renderer=V,V.initialize(g),y.updateRenderer(V),y.resetVideoSource(),await y.onVideoSwitch(g);}}const w=h.owner?.nickname??h.channel?.name??"不明",x=[`<div style="font-weight: 600; margin-bottom: 8px;">${p("nextEpisodeAutoSetupComplete")}</div>`,'<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${$t}</span>`,`  <span style="flex: 1; word-break: break-word;">${h.title}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Le}</span>`,`  <span>${w}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">','  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Fe}</span>`,`    <span>${h.viewCount.toLocaleString()}</span>`,"  </div>",'  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Pe}</span>`,`    <span>${h.commentCount.toLocaleString()}</span>`,"  </div>","</div>"].join("");v.show(x,"success",5e3),f.info("watchPageController:manualModeSwitch:success",{videoId:h.videoId,title:h.title,commentCount:h.commentCount});}catch(i){f.error("watchPageController:manualModeSwitch:error",i),v.show(_("episodeSwitchError",{message:i.message}),"error");}}}const jo=100;class Xo{constructor(e){this.global=e;}initialize(){const e=v.getInstance(),n=this.global.settingsManager??new Ye(e);this.global.settingsManager=n,this.global.instances.settingsManager=n;const r=new be(n);this.waitForHeader(r);}waitForHeader(e){if(!document.querySelector(T.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(e),jo);return}e.insertIntoMypage(),e.addAutoCommentButtons(),this.observeList(e);}observeList(e){const n=document.querySelector(T.mypageListContainer);if(!n)return;new MutationObserver(()=>{try{e.addAutoCommentButtons();}catch(i){console.error("[MypageController] auto comment buttons update failed",i);}}).observe(n,{childList:true,subtree:true});}}class Zo{log;global=$o();watchController=null;mypageController=null;constructor(){this.log=R("DanimeApp");}start(){this.log.info("starting renderer"),wn.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const e=location.pathname.toLowerCase();try{e.includes("/animestore/sc_d_pc")?(this.watchController=new Ko(this.global),await this.watchController.initialize()):e.includes("/animestore/mp_viw_pc")?(this.mypageController=new Xo(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(n){this.log.error("initialization failed",n);}}acquireInstanceLock(){const e=De();return e.__dAnimeNicoCommentRenderer2Instance=(e.__dAnimeNicoCommentRenderer2Instance??0)+1,e.__dAnimeNicoCommentRenderer2Instance===1}}const ke=R("dAnimeNicoCommentRenderer2");async function Jo(){ke.info("bootstrap start");try{new Zo().start(),ke.info("bootstrap completed");}catch(t){ke.error("bootstrap failed",t);}}Jo();

})();