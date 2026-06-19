// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      7.3.12
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

  const je={debug:"debug",info:"info",warn:"warn",error:"error"},P=t=>{const e=`[${t}]`,n={};return Object.keys(je).forEach(r=>{const i=je[r];n[r]=(...s)=>{(console[i]??console.log)(e,...s);};}),n};function Pe(){return typeof unsafeWindow<"u"?unsafeWindow:window}const Tn={small:.6666666666666666,medium:1,big:1.4444444444444444},kn={defont:'Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic',gothic:'"游ゴシック体","游ゴシック","Yu Gothic",YuGothic,yugothic,YuGo-Medium,"宋体",SimSun,Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic',mincho:'"游明朝体","游明朝","Yu Mincho",YuMincho,yumincho,YuMin-Medium,"宋体",SimSun,Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic'},_n={defont:"600",gothic:"",mincho:""},qt={white:"#FFFFFF",red:"#FF0000",pink:"#FFA5CC",orange:"#FFBA66",yellow:"#FFFFAA",green:"#00FF00",cyan:"#88FFFF",blue:"#8899FF",purple:"#D9A5FF",black:"#000000",white2:"#CC9",red2:"#C03",pink2:"#F3C",orange2:"#F60",yellow2:"#990",green2:"#0C6",cyan2:"#0CC",blue2:"#39F",purple2:"#63C",black2:"#666"},Fe=/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,Vn=/^[,.:;]+/,In=/[,.:;]+$/,An=t=>{const e=t.trim();return e?Fe.test(e)?e:e.replace(Vn,"").replace(In,""):""},Ln=t=>Fe.test(t)?t.toUpperCase():null,Yt=t=>{const e=t.trim();if(!e)return null;const n=e.toLowerCase().endsWith("px")?e.slice(0,-2):e,r=Number.parseFloat(n);return Number.isFinite(r)?r:null},Pn=t=>{const e=t.trim();if(!e)return null;if(e.endsWith("%")){const n=Number.parseFloat(e.slice(0,-1));return Number.isFinite(n)?n/100:null}return Yt(e)},Fn=t=>Number.isFinite(t)?Math.min(100,Math.max(-100,t)):0,Rn=t=>!Number.isFinite(t)||t===0?1:Math.min(5,Math.max(.25,t)),Dn=t=>t==="naka"||t==="ue"||t==="shita",Hn=t=>t==="small"||t==="medium"||t==="big",zn=t=>t==="defont"||t==="gothic"||t==="mincho",On=t=>t in qt,Nn=(t,e)=>{let n="naka",r="medium",i="defont",s=null,a=1,o=null,l=false,d=false,h=false,c=0,u=1;for(const y of t){const f=An(typeof y=="string"?y:"");if(!f)continue;if(Fe.test(f)){const M=Ln(f);if(M){s=M;continue}}const v=f.toLowerCase();if(Dn(v)){n=v;continue}if(Hn(v)){r=v;continue}if(zn(v)){i=v;continue}if(On(v)){s=qt[v].toUpperCase();continue}if(v==="_live"){o=.5;continue}if(v==="invisible"){a=0,l=true;continue}if(v==="full"){d=true;continue}if(v==="ender"){h=true;continue}if(v.startsWith("ls:")||v.startsWith("letterspacing:")){const M=f.indexOf(":");if(M>=0){const k=Yt(f.slice(M+1));k!==null&&(c=Fn(k));}continue}if(v.startsWith("lh:")||v.startsWith("lineheight:")){const M=f.indexOf(":");if(M>=0){const k=Pn(f.slice(M+1));k!==null&&(u=Rn(k));}continue}}const p=Math.max(0,Math.min(1,a)),m=(s??e.defaultColor).toUpperCase(),x=typeof o=="number"?Math.max(0,Math.min(1,o)):null;return {layout:n,size:r,sizeScale:Tn[r],font:i,fontFamily:kn[i],fontWeight:_n[i],resolvedColor:m,colorOverride:s,opacityMultiplier:p,opacityOverride:x,isInvisible:l,isFull:d,isEnder:h,letterSpacing:c,lineHeight:u}},$n=/^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i,ae=t=>t.length===1?t.repeat(2):t,z=t=>Number.parseInt(t,16),$=t=>!Number.isFinite(t)||t<=0?0:t>=1?1:t,Re=(t,e)=>{const n=$n.exec(t);if(!n)return t;const r=n[1];let i,s,a,o=1;r.length===3||r.length===4?(i=z(ae(r[0])),s=z(ae(r[1])),a=z(ae(r[2])),r.length===4&&(o=z(ae(r[3]))/255)):(i=z(r.slice(0,2)),s=z(r.slice(2,4)),a=z(r.slice(4,6)),r.length===8&&(o=z(r.slice(6,8))/255));const l=$(o*$(e));return `rgba(${i}, ${s}, ${a}, ${l})`},Wn=()=>({now:()=>typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now()}),Ut=()=>Wn(),L=t=>t*1e3,Bn=t=>!Number.isFinite(t)||t<0?null:Math.round(t),De=6e3,Ke=2700,qn=3,Yn=.35,Un=48,Gn=48,ue=0,jn=6e3,be=120,Kn=800,Xn=2,ne=6e3,O=3e3,D=O+De,Zn=240,Jn=1800,Xe=1,Gt=12,Qn=24,A=.001,B=50,er=2300,Ze={debug:0,info:1,warn:2,error:3},tr=(t,e,n)=>{const r=[`[${e}]`,...n];switch(t){case "debug":console.debug(...r);break;case "info":console.info(...r);break;case "warn":console.warn(...r);break;case "error":console.error(...r);break;default:console.log(...r);}},jt=(t,e={})=>{const{level:n="info",emitter:r=tr}=e,i=Ze[n],s=(a,o)=>{Ze[a]<i||r(a,t,o);};return {debug:(...a)=>s("debug",a),info:(...a)=>s("info",a),warn:(...a)=>s("warn",a),error:(...a)=>s("error",a)}},He=jt("CommentEngine:Comment"),Je=new WeakMap,nr=t=>{let e=Je.get(t);return e||(e=new Map,Je.set(t,e)),e},ze=(t,e)=>{if(!t)return 0;const n=`${t.font??""}::${e}`,r=nr(t),i=r.get(n);if(i!==void 0)return i;const s=t.measureText(e).width;return r.set(n,s),s},pe=t=>`${t.fontWeight?`${t.fontWeight} `:""}${t.fontSize}px ${t.fontFamily}`,rr=27/665,Z=665,ir=12,sr="  ",ar=1252/597.38330078125,ve=[366/Z,510/Z,1662/Z],or=566/Z,lr=806/665,cr=808/665,Qe=1176/665,et=900/665,dr=1126/665,tt=810/665,hr=1126/665,nt=1046/665,rt=1254/665,ur=1140/665,pr=878/665,mr=.25,gr=160,fr=420,br=80,vr=.18,yr=400,xr=.2,wr=420,Sr=250,Cr=1.8,Mr=420,Er=20,Tr=.045,kr=850/1182,_r=t=>Math.max(.01,t/Z),N=(t,e)=>t*_r(e),Vr=t=>t.replaceAll("	",sr),Kt=/[\s\u00a0\u2000-\u200f\u202f\u205f\u3000]/g,Ir=t=>{const e=Vr(t);if(e.includes(`
`)){const n=e.split(/\r?\n/);return n.length>0?n:[""]}return [e]},it=(t,e=ir)=>Math.max(e,t),Ar=(t,e)=>{if(t.fontSize>=35)return Math.round(e*or);const n=t.text.split(/\r?\n/),r=Math.max(0,...n.map(i=>i.length));return t.isEnder&&r>=25||Math.max(0,...n.map(i=>(i.match(/\t/g)||[]).length))>=12||t.width>=1200?Math.round(e*ve[2]):t.width>=300?Math.round(e*ve[1]):Math.round(e*ve[0])},Lr=(t,e)=>Math.min(N(fr,e),Math.max(N(gr,e),t*mr)),Pr=(t,e)=>{const n=N(yr,e);return Math.min(N(wr,e),N(br,e)+t.width*vr+Math.max(0,t.width-n)*xr)},Fr=(t,e)=>Math.min(N(Mr,e),Math.max(0,t.width-N(Sr,e))*Cr),Rr=(t,e)=>{if(t.isFull)return t.width;const n=Math.max(t.sizeScale,1),r=t.width/n,i=e*kr;return Math.min(r,i)},Dr=t=>t.lines.filter(e=>e.replace(Kt,"").length>0).length,st=t=>t.lines.length>1&&Dr(t)===1,Hr=t=>t.lines.map(e=>e.replace(Kt,"")).filter(e=>e.length>0),at=t=>{if(t.lines.length<=1)return  false;const e=Hr(t);return e.length===1&&/^[●○◉◎]+$/u.test(e[0])},oe=t=>t.size==="big"||t.fontSize>=35,zr=(t,e)=>{let n=0;const r=t.letterSpacing;for(const a of t.lines){const o=ze(e,a),l=a.length>1?r*(a.length-1):0,d=Math.max(0,o+l);d>n&&(n=d);}t.width=n;const i=Math.max(1,Math.floor(t.fontSize*t.lineHeightMultiplier));t.lineHeightPx=i;const s=t.lines.length>1?(t.lines.length-1)*i:0;t.height=t.fontSize+s;},Or=(t,e,n,r,i)=>{try{if(!e)throw new Error("Canvas context is required");if(!Number.isFinite(n)||!Number.isFinite(r))throw new Error("Canvas dimensions must be numbers");if(!i)throw new Error("Prepare options are required");const s=Math.max(n,1),a=it(Math.floor(r*rr)),o=it(Math.floor(a*t.sizeScale));if(t.fontSize=o,e.font=pe(t),t.lines=Ir(t.text),zr(t,e),t.isScrolling&&t.isFull){const F=t.lines.length>1&&(t.fontFamily.includes("Yu Mincho")||t.fontFamily.includes("游明朝"));if(F&&t.hasSameVposFullMinchoEnder&&!t.isEnder&&oe(t))t.width=Math.round(r*(at(t)?nt:hr)),t.height=Math.max(t.height,Math.round(r*tt));else if(F&&t.hasSameVposFullMinchoEnder&&t.isEnder&&oe(t))t.width=Math.round(r*(st(t)?rt:Qe)),t.height=Math.max(t.height,Math.round(r*et));else if(F&&t.hasSameVposFullMinchoEnder&&t.isEnder)t.width=Math.round(r*(st(t)?rt:ur)),t.height=Math.max(t.height,Math.round(r*pr));else if(F&&oe(t))t.width=Math.round(r*(at(t)?nt:Qe)),t.height=Math.max(t.height,Math.round(r*et));else if(F)t.width=Math.round(r*dr),t.height=Math.max(t.height,Math.round(r*tt));else {const G=oe(t)?cr:lr;t.width=Ar(t,r),t.height=Math.max(t.height,Math.round(r*G));}}if(!t.isScrolling){const F=s+a*2.6666666666666665;t.width>=F*.95&&t.fontSize>=35?t.width=Math.round(r*ar):t.width=Math.min(t.width,F),t.bufferWidth=0;const G=(s-t.width)/2;t.virtualStartX=G,t.x=G,t.baseSpeed=0,t.speed=0,t.speedPixelsPerMs=0,t.visibleDurationMs=O,t.preCollisionDurationMs=O,t.totalDurationMs=O,t.reservationWidth=t.width,t.staticExpiryTimeMs=t.vposMs+O,t.lastUpdateTime=t.getTimeSource().now(),t.isPaused=!1;return}t.staticExpiryTimeMs=null;const l=ze(e,"??".repeat(150)),d=t.width,h=d*Math.max(i.bufferRatio,0);t.bufferWidth=Math.max(i.baseBufferPx,h);const c=Math.max(i.entryBufferPx,t.bufferWidth),u=t.scrollDirection,p=Math.min(1,r/Z),m=t.isFull?i.virtualExtension*p:i.virtualExtension,x=t.isFull?Lr(t.width,r):0,y=t.isFull?N(Er,r)+t.width*Tr:0,f=t.isFull?0:Pr(t,r),v=t.isFull?0:Fr(t,r),M=u==="rtl"?s+m+x+f:-d-t.bufferWidth-m-x-f,k=u==="rtl"?-d-t.bufferWidth-c+x-f-v:s+c-x+f+v,Y=u==="rtl"?s+c:-c;t.virtualStartX=M,t.x=M,t.exitThreshold=k;const U=s>0?d/s:0,vn=i.maxVisibleDurationMs===i.minVisibleDurationMs;let ge=i.maxVisibleDurationMs;if(!vn&&U>1&&!t.isFull){const F=Math.min(U,i.maxWidthRatio),G=i.maxVisibleDurationMs/Math.max(F,1);ge=Math.max(i.minVisibleDurationMs,Math.floor(G));}const yn=s+d+t.bufferWidth+c+m+y+f*2+v,xn=Math.max(ge,1),fe=yn/xn,wn=fe*1e3/60;t.baseSpeed=wn,t.speed=t.baseSpeed,t.speedPixelsPerMs=fe;const Sn=Math.abs(k-M),Ue=u==="rtl"?M+d+t.bufferWidth:M-t.bufferWidth,Cn=u==="rtl"?Math.max(0,Ue-Y):Math.max(0,Y-Ue),Ge=Math.max(fe,Number.EPSILON);t.visibleDurationMs=ge,t.preCollisionDurationMs=Math.max(0,Math.ceil(Cn/Ge)),t.totalDurationMs=Math.max(t.preCollisionDurationMs,Math.ceil(Sn/Ge));const Mn=d+t.bufferWidth+c,En=Rr(t,s);t.reservationWidth=Math.min(l,Math.max(Mn,En)),t.lastUpdateTime=t.getTimeSource().now(),t.isPaused=!1;}catch(s){throw He.error("Comment.prepare",s,{text:t.text,visibleWidth:n,canvasHeight:r,hasContext:!!e}),s}},Xt=5,H={enabled:false,maxLogsPerCategory:Xt},de=new Map,Nr=t=>{if(t===void 0||!Number.isFinite(t))return Xt;const e=Math.max(1,Math.floor(t));return Math.min(1e4,e)},$r=t=>{H.enabled=!!t.enabled,H.maxLogsPerCategory=Nr(t.maxLogsPerCategory),H.enabled||de.clear();},W=()=>H.enabled,Wr=t=>{const e=de.get(t)??0;return e>=H.maxLogsPerCategory?(e===H.maxLogsPerCategory&&(console.debug(`[CommentOverlay][${t}]`,"Further logs suppressed."),de.set(t,e+1)),false):(de.set(t,e+1),true)},T=(t,...e)=>{H.enabled&&Wr(t)&&console.debug(`[CommentOverlay][${t}]`,...e);},se=(t,e=32)=>t.length<=e?t:`${t.slice(0,e)}…`,Br=(t,e)=>{H.enabled&&(console.group(`[CommentOverlay][state-dump] ${t}`),console.table({"Current Time":`${e.currentTime.toFixed(2)}ms`,Duration:`${e.duration.toFixed(2)}ms`,"Is Playing":e.isPlaying,"Epoch ID":e.epochId,"Total Comments":e.totalComments,"Active Comments":e.activeComments,"Reserved Lanes":e.reservedLanes,"Final Phase":e.finalPhaseActive,"Playback Begun":e.playbackHasBegun,"Is Stalled":e.isStalled}),console.groupEnd());},qr=(t,e,n)=>{H.enabled&&T("epoch-change",`Epoch changed: ${t} → ${e} (reason: ${n})`);},ot=t=>{if(typeof t=="string")return t;if(t!=null)return String(t)},Zt=()=>typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now(),Yr=t=>{if(typeof t.getTransform!="function")return;const e=t.getTransform();return [e.a,e.b,e.c,e.d,e.e,e.f]},Ur=t=>{const e=t.canvas;return e?{canvasWidth:e.width,canvasHeight:e.height}:{}},Gr=t=>t?{...t.no!==void 0?{no:t.no}:{},...t.fork!==void 0?{fork:t.fork}:{},...t.source!==void 0?{source:t.source}:{},...t.threadId!==void 0?{threadId:t.threadId}:{},...t.date!==void 0?{date:t.date}:{},...t.userIdHash!==void 0?{userIdHash:t.userIdHash}:{}}:{},Jt=t=>({text:t.text,vposMs:t.vposMs,...Gr(t.meta),layout:t.layout,lane:t.lane,fontSize:t.fontSize,width:t.width,height:t.height,color:t.color,opacity:t.opacity,creationIndex:t.creationIndex}),Ee=(t,e,n,r)=>{const i=globalThis.__COMMENT_OVERLAY_TRACE__;globalThis.__COMMENT_OVERLAY_TRACE_ENABLED__!==true||typeof i!="function"||i({source:"comment-overlay",op:t,timestampMs:Zt(),font:e.font,fillStyle:ot(e.fillStyle),strokeStyle:ot(e.strokeStyle),lineWidth:e.lineWidth,lineJoin:e.lineJoin,globalAlpha:e.globalAlpha,shadowColor:e.shadowColor,shadowBlur:e.shadowBlur,shadowOffsetX:e.shadowOffsetX,shadowOffsetY:e.shadowOffsetY,transform:Yr(e),...Ur(e),comment:Jt(n),...r});},jr=(t,e,n)=>{const r=globalThis.__COMMENT_OVERLAY_TRACE__;globalThis.__COMMENT_OVERLAY_TRACE_ENABLED__!==true||typeof r!="function"||r({source:"comment-overlay",op:t,timestampMs:Zt(),comment:Jt(e),...n});},C={hits:0,misses:0,creates:0,fallbacks:0,outlineCallsInCache:0,fillCallsInCache:0,outlineCallsInFallback:0,fillCallsInFallback:0,letterSpacingComments:0,normalComments:0,multiLineComments:0,totalCharactersDrawn:0,lastReported:0},lt=()=>{if(!W())return;const t=performance.now();if(t-C.lastReported<=5e3)return;const e=C.hits+C.misses,n=e>0?C.hits/e*100:0,r=C.creates>0?(C.totalCharactersDrawn/C.creates).toFixed(1):"0",i=C.outlineCallsInCache+C.outlineCallsInFallback,s=C.fillCallsInCache+C.fillCallsInFallback;console.log("[TextureCache Stats]",`
  Cache: Hits=${C.hits}, Misses=${C.misses}, Hit Rate=${n.toFixed(1)}%`,`
  Creates: ${C.creates}, Fallbacks: ${C.fallbacks}`,`
  Comments: Normal=${C.normalComments}, LetterSpacing=${C.letterSpacingComments}, MultiLine=${C.multiLineComments}`,`
  Draw Calls: Outline=${i}, Fill=${s}`,`
  Avg Characters/Comment: ${r}`),C.lastReported=t;},Kr=()=>typeof OffscreenCanvas<"u",Oe=(t,e,n)=>{if(t==="none")return {blur:0,alpha:0};const r={light:.06,medium:.1,strong:.15}[t],i={light:.6,medium:.8,strong:.95}[t],s=Math.max(2,e*r),a=$(n*i);return {blur:s,alpha:a}},Ne=()=>2.8,Qt=665,Xr=566,Te=808,ct=Xr/Qt,dt=Te/Qt,Zr=1098,Jr=1530,ht=20.9,ut=58.9,pt=45.23908523908523/39,Qr=14.9,ei=41.9,ti=28.92708257149126/27,mt=20,gt=11.4,ft=31.4,bt=23.87692307692307,ni=2.4,ye=2,vt=66.9,yt=55.6,ri=59,ii=810,si=21.5,en=878,tn=900,ai=10,oi=6.75,li=16.75,ci=12.11423203055002,di=.5,hi=1.42,ui=.12,pi=t=>{const e=t.trim().toLowerCase();if(e==="black")return  true;const n=e.match(/^#([0-9a-f]{3,8})$/i);if(!n)return  false;const r=n[1],i=r.length===3||r.length===4,s=d=>d.length===1?`${d}${d}`:d,a=Number.parseInt(s(i?r[0]:r.slice(0,2)),16),o=Number.parseInt(s(i?r[1]:r.slice(2,4)),16),l=Number.parseInt(s(i?r[2]:r.slice(4,6)),16);return a===0&&o===0&&l===0},$e=t=>pi(t.color)?"rgba(255, 255, 255, 0.4)":"rgba(0, 0, 0, 0.4)",mi=(t,e)=>`${t.fontWeight?`${t.fontWeight} `:""}${e}px ${t.fontFamily}`,gi=(t,e)=>{if(!t.isScrolling)return e+t.fontSize;const n=t.fontSize<=18?t.fontSize*.08:0;return t.fontSize*1.5+n},nn=t=>{if(t.isScrolling&&t.isFull){if(t.hasSameVposFullMinchoEnder){const o=Math.ceil(t.height);return {paddingX:Math.max(10,t.fontSize*.5),paddingY:o>=tn?vt:o>=en?yt:si,textureWidth:Math.ceil(t.width),textureHeight:o}}const a=t.hasSameVposFullMinchoEnder&&t.isEnder?t.fontSize>=35?vt:yt:null;return {paddingX:Math.max(10,t.fontSize*.5),paddingY:a??(t.fontSize>=35?t.fontSize*.5:Math.max(18,t.fontSize))+ni,textureWidth:Math.ceil(t.width),textureHeight:Math.ceil(t.height)}}if(t.isScrolling&&t.lines.length>1){const a=t.fontSize*1.3333333333333333,o=t.fontSize;return {paddingX:a,paddingY:o,textureWidth:Math.ceil(t.width+a*2),textureHeight:Math.ceil(t.height+t.fontSize*6.1)}}if(!t.isScrolling){const a=Math.ceil(t.lines.length>1?t.height:t.height+t.fontSize/3);return {paddingX:0,paddingY:Math.max(0,(a-t.height)/2),textureWidth:Math.ceil(t.width+0),textureHeight:a}}const e=t.isScrolling?t.fontSize*1.15:Math.max(10,t.fontSize*.5),n=t.fontSize,r=t.isScrolling?Math.round(n*(40/9)):t.height+t.fontSize/3,i=Math.ceil(Math.max(t.height+Math.max(10,t.fontSize),r)),s=t.isScrolling?t.fontSize:Math.max(0,(i-t.height)/2);return {paddingX:e,paddingY:s,textureWidth:Math.ceil(t.isScrolling?t.width*2+e*2:t.width+e*2),textureHeight:i}},fi=t=>!t.isScrolling&&t.width>=1200&&t.fontSize>=35?.8:1,rn=t=>!t.isScrolling&&t.width>=1200&&t.fontSize>=35,sn=t=>rn(t)&&(t.fontFamily.includes("Yu Mincho")||t.fontFamily.includes("YuMincho")||t.fontFamily.includes("游明朝")),bi=(t,e)=>sn(t)?hi:e,vi=t=>Math.max(1,t.width+t.virtualStartX*2),yi=t=>t.isScrolling&&t.isFull&&t.hasSameVposFullMinchoEnder?ri*Math.min(1,t.height/ii):0,xi=(t,e,n,r,i)=>{const s=bi(t,i);if(sn(t))return {x:vi(t)*ui,scaleX:s,scaleY:i};const a=!t.isScrolling&&s!==1?e.width*(1-s)*di:0;return {x:n-r+a+yi(t),scaleX:s,scaleY:i}},We=(t,e,n,r,i)=>(s,a,o,l=0)=>{if(s.length===0)return;const d=i+l,h=()=>{r==="cache"?o==="outline"?C.outlineCallsInCache++:C.fillCallsInCache++:o==="outline"?C.outlineCallsInFallback++:C.fillCallsInFallback++;},c=(p,m,x)=>{if(h(),o==="outline"){e.strokeText(p,m,a),Ee("strokeText",e,t,{text:p,x:m,y:a,meta:{statsTarget:r,mode:o,...x}});return}e.fillText(p,m,a),Ee("fillText",e,t,{text:p,x:m,y:a,meta:{statsTarget:r,mode:o,...x}});};if(Math.abs(t.letterSpacing)<Number.EPSILON){c(s,d);return}let u=d;for(let p=0;p<s.length;p+=1){const m=s[p];c(m,u,{characterIndex:p});const x=ze(n,m);u+=x,p<s.length-1&&(u+=t.letterSpacing);}},wi=t=>`v8::${t.text}::${t.fontSize}::${t.fontFamily}::${t.fontWeight}::${t.color}::${t.opacity}::${t.renderStyle}::${t.letterSpacing}::${t.lineHeightPx}::${t.width}::${t.height}::${t.lines.length}`,xt=(t,e,n)=>{const r=new OffscreenCanvas(n.width,n.height),i=r.getContext("2d");if(!i)return null;i.save(),i.font=n.sourceFont?pe(t):mi(t,n.fontSize);const s=$(t.opacity),a=Re(t.color,s),o=t.renderStyle==="outline-only",l=o?{blur:0,alpha:0}:Oe(t.shadowIntensity,n.fontSize,s);i.shadowColor=`rgba(0, 0, 0, ${l.alpha})`,i.shadowBlur=l.blur,i.shadowOffsetX=0,i.shadowOffsetY=0,i.lineJoin="round",i.lineWidth=Ne(),i.strokeStyle=$e(t),i.fillStyle=a,typeof n.canvasScale=="number"&&i.scale(n.canvasScale,n.canvasScale);const d=t.lines.length>0?t.lines:[t.text],h=We(t,i,e,"cache",n.paddingX);return o&&d.forEach((c,u)=>{h(c,n.baselineY+u*n.lineHeight,"outline");}),d.forEach((c,u)=>{h(c,n.baselineY+u*n.lineHeight,"fill");}),i.restore(),r},Si=(t,e,n)=>{for(const r of n.traces??[])xt(t,e,r);return xt(t,e,n.output)},Ci=(t,e,n)=>{if(t.isScrolling&&t.isFull&&t.fontSize>=35&&Math.abs(e-t.height*(ct/dt))<=2&&Math.abs(n-e*(dt/ct))<=3){const r=n/Te;return {traces:[{width:Math.round(Zr*r),height:Math.round(Jr*r),fontSize:t.fontSize,paddingX:ht*r,baselineY:ut*r,lineHeight:t.fontSize*pt,sourceFont:true}],output:{width:e,height:n,fontSize:mt*r,paddingX:gt*r,baselineY:ft*r,lineHeight:bt*r}}}if(t.isScrolling&&t.isFull&&t.hasSameVposFullMinchoEnder){if(n<=en-1){const r=n/Te;return {output:{width:e,height:n,fontSize:mt*r,paddingX:gt*r,baselineY:ft*r,lineHeight:bt*r,canvasScale:ye}}}return n<tn?{output:{width:e,height:n,fontSize:t.fontSize,paddingX:Qr,baselineY:ei,lineHeight:t.fontSize*ti,canvasScale:ye,sourceFont:true}}:{output:{width:e,height:n,fontSize:t.fontSize,paddingX:ht,baselineY:ut,lineHeight:t.fontSize*pt,canvasScale:ye,sourceFont:true}}}return rn(t)?{output:{width:e,height:n,fontSize:ai,paddingX:oi,baselineY:li,lineHeight:ci}}:null},Mi=(t,e)=>{if(!Kr())return null;const n=Math.abs(t.letterSpacing)>=Number.EPSILON,r=t.lines.length>1;n&&C.letterSpacingComments++,r&&C.multiLineComments++,!n&&!r&&C.normalComments++,C.totalCharactersDrawn+=t.text.length;const{paddingX:i,paddingY:s,textureWidth:a,textureHeight:o}=nn(t),l=Ci(t,a,o);if(l)return Si(t,e,l);const d=new OffscreenCanvas(a,o),h=d.getContext("2d");if(!h)return null;h.save(),h.font=pe(t);const c=$(t.opacity),u=i,p=t.lines.length>0?t.lines:[t.text],m=t.lines.length>1&&t.lineHeightPx>0?t.lineHeightPx:t.fontSize,x=gi(t,s),y=We(t,h,e,"cache",u),f=Re(t.color,c),v=t.renderStyle==="outline-only",M=v?{blur:0,alpha:0}:Oe(t.shadowIntensity,t.fontSize,c);return W()&&console.log("[Shadow Debug - Cache]",`
  Text: "${t.text}"`,`
  FontSize: ${t.fontSize}`,`
  Shadow intensity: ${t.shadowIntensity}`,`
  Shadow blur: ${M.blur}px`,`
  Shadow alpha: ${M.alpha}`,`
  Fill style: ${f}`),h.save(),h.shadowColor=`rgba(0, 0, 0, ${M.alpha})`,h.shadowBlur=M.blur,h.shadowOffsetX=0,h.shadowOffsetY=0,h.lineJoin="round",h.lineWidth=Ne(),h.strokeStyle=$e(t),h.fillStyle=f,v&&p.forEach((k,Y)=>{const U=x+Y*m;y(k,U,"outline");}),p.forEach((k,Y)=>{const U=x+Y*m;y(k,U,"fill");}),h.restore(),h.restore(),d},Ei=(t,e,n)=>{C.fallbacks++,e.save(),e.font=pe(t);const r=$(t.opacity),i=n??t.x,s=t.lines.length>0?t.lines:[t.text],a=t.lines.length>1&&t.lineHeightPx>0?t.lineHeightPx:t.fontSize,o=t.y+t.fontSize,l=We(t,e,e,"fallback",i),d=Re(t.color,r),h=t.renderStyle==="outline-only",c=h?{blur:0,alpha:0}:Oe(t.shadowIntensity,t.fontSize,r);W()&&console.log("[Shadow Debug - Fallback]",`
  Text: "${t.text}"`,`
  FontSize: ${t.fontSize}`,`
  Shadow intensity: ${t.shadowIntensity}`,`
  Shadow blur: ${c.blur}px`,`
  Shadow alpha: ${c.alpha}`,`
  Fill style: ${d}`),e.save(),e.shadowColor=`rgba(0, 0, 0, ${c.alpha})`,e.shadowBlur=c.blur,e.shadowOffsetX=0,e.shadowOffsetY=0,e.lineJoin="round",e.lineWidth=Ne(),e.strokeStyle=$e(t),e.fillStyle=d,h&&s.forEach((u,p)=>{const m=o+p*a;l(u,m,"outline");}),s.forEach((u,p)=>{const m=o+p*a;l(u,m,"fill");}),e.restore(),e.restore();},Ti=(t,e,n)=>{try{if(!t.isActive||!e)return;const r=wi(t),i=t.getCachedTexture();if(t.getTextureCacheKey()!==r||!i){C.misses++,C.creates++;const a=Mi(t,e);t.setCachedTexture(a),t.setTextureCacheKey(r);}else C.hits++;const s=t.getCachedTexture();if(s){const a=n??t.x,{paddingX:o,paddingY:l}=nn(t),d=fi(t),h=xi(t,s,a,o,d),c=h.x,u=t.isScrolling?t.y:t.y-l;h.scaleX===1&&h.scaleY===1?e.drawImage(s,c,u):e.drawImage(s,c,u,s.width*h.scaleX,s.height*h.scaleY),Ee("drawImage",e,t,{x:c,y:u,width:s.width*h.scaleX,height:s.height*h.scaleY,sourceWidth:s.width,sourceHeight:s.height,meta:{statsTarget:"cache",paddingX:o,paddingY:l,drawScale:d,drawScaleX:h.scaleX,drawScaleY:h.scaleY}}),lt();return}Ei(t,e,n),lt();}catch(r){He.error("Comment.draw",r,{text:t.text,isActive:t.isActive,hasContext:!!e,interpolatedX:n});}},ki=t=>t==="ltr"?"ltr":"rtl",_i=t=>t==="ltr"?1:-1;class an{text;vposMs;commands;layout;isScrolling;size;sizeScale;opacityMultiplier;opacityOverride;colorOverride;isInvisible;isFull;isEnder;meta;hasSameVposFullMinchoEnder=false;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily;fontWeight;opacity;activationTimeMs=null;staticExpiryTimeMs=null;isActive=false;hasShown=false;isPaused=false;lastUpdateTime=0;reservationWidth=0;bufferWidth=0;visibleDurationMs=0;totalDurationMs=0;preCollisionDurationMs=0;speedPixelsPerMs=0;virtualStartX=0;exitThreshold=0;scrollDirection="rtl";renderStyle="outline-only";shadowIntensity="medium";creationIndex=0;letterSpacing=0;lineHeightMultiplier=1;lineHeightPx=0;lines=[];epochId=0;directionSign=-1;timeSource;lastSyncedSettingsVersion=-1;cachedTexture=null;textureCacheKey="";constructor(e,n,r,i,s={},a=null){if(typeof e!="string")throw new Error("Comment text must be a string");if(!Number.isFinite(n)||n<0)throw new Error("Comment vposMs must be a non-negative number");this.text=e,this.vposMs=n,this.commands=Array.isArray(r)?[...r]:[],this.meta=a?{...a}:null;const o=Nn(this.commands,{defaultColor:i.commentColor});this.layout=o.layout,this.isScrolling=this.layout==="naka",this.size=o.size,this.sizeScale=o.sizeScale,this.opacityMultiplier=o.opacityMultiplier,this.opacityOverride=o.opacityOverride,this.colorOverride=o.colorOverride,this.isInvisible=o.isInvisible,this.isFull=o.isFull,this.isEnder=o.isEnder,this.fontFamily=o.fontFamily,this.fontWeight=o.fontWeight,this.color=o.resolvedColor,this.opacity=this.getEffectiveOpacity(i.commentOpacity),this.renderStyle=i.renderStyle,this.shadowIntensity=i.shadowIntensity,this.letterSpacing=o.letterSpacing,this.lineHeightMultiplier=o.lineHeight,this.timeSource=s.timeSource??Ut(),this.applyScrollDirection(i.scrollDirection),this.syncWithSettings(i,s.settingsVersion);}prepare(e,n,r,i){Or(this,e,n,r,i);}draw(e,n=null){Ti(this,e,n);}update(e=1,n=false){try{if(!this.isActive){this.isPaused=n;return}const r=this.timeSource.now();if(!this.isScrolling){this.isPaused=n,this.lastUpdateTime=r;return}if(n){this.isPaused=!0,this.lastUpdateTime=r;return}const i=(r-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*e,this.x+=this.speed*i*this.directionSign,(this.scrollDirection==="rtl"&&this.x<=this.exitThreshold||this.scrollDirection==="ltr"&&this.x>=this.exitThreshold)&&(this.isActive=!1),this.lastUpdateTime=r,this.isPaused=!1;}catch(r){He.error("Comment.update",r,{text:this.text,playbackRate:e,isPaused:n,isActive:this.isActive});}}syncWithSettings(e,n){typeof n=="number"&&n===this.lastSyncedSettingsVersion||(this.color=this.getEffectiveColor(e.commentColor),this.opacity=this.getEffectiveOpacity(e.commentOpacity),this.applyScrollDirection(e.scrollDirection),this.renderStyle=e.renderStyle,this.shadowIntensity=e.shadowIntensity,typeof n=="number"&&(this.lastSyncedSettingsVersion=n));}getEffectiveColor(e){const n=this.colorOverride??e;return typeof n!="string"||n.length===0?e:n.toUpperCase()}getEffectiveOpacity(e){if(typeof this.opacityOverride=="number")return $(this.opacityOverride);const n=e*this.opacityMultiplier;return Number.isFinite(n)?$(n):0}markActivated(e){this.activationTimeMs=e;}clearActivation(){this.activationTimeMs=null,this.isScrolling||(this.staticExpiryTimeMs=null),this.resetTextureCache();}hasStaticExpired(e){return this.isScrolling||this.staticExpiryTimeMs===null?false:e>=this.staticExpiryTimeMs}getDirectionSign(){return this.directionSign}getTimeSource(){return this.timeSource}getTextureCacheKey(){return this.textureCacheKey}setTextureCacheKey(e){this.textureCacheKey=e;}getCachedTexture(){return this.cachedTexture}setCachedTexture(e){this.cachedTexture=e;}resetTextureCache(){this.cachedTexture=null,this.textureCacheKey="";}applyScrollDirection(e){const n=ki(e);this.scrollDirection=n,this.directionSign=_i(n);}}const Vi=6700,xe={commentColor:"#FFFFFF",commentOpacity:1,isCommentVisible:true,useContainerResizeObserver:true,ngWords:[],ngRegexps:[],scrollDirection:"rtl",renderStyle:"outline-only",syncMode:"raf",scrollVisibleDurationMs:Vi,useFixedLaneCount:false,fixedLaneCount:12,useDprScaling:true,shadowIntensity:"medium"},on=()=>({...xe,ngWords:[...xe.ngWords],ngRegexps:[...xe.ngRegexps]}),Ii=t=>Number.isFinite(t)?t<=0?0:t>=1?1:t:1,le=t=>{const e=t.scrollVisibleDurationMs,n=e==null?null:Number.isFinite(e)?Math.max(1,Math.floor(e)):null;return {...t,scrollDirection:t.scrollDirection==="ltr"?"ltr":"rtl",commentOpacity:Ii(t.commentOpacity),renderStyle:t.renderStyle==="classic"?"classic":"outline-only",scrollVisibleDurationMs:n,syncMode:t.syncMode==="video-frame"?"video-frame":"raf",useDprScaling:!!t.useDprScaling}},Ai=t=>typeof window<"u"&&typeof window.requestAnimationFrame=="function"&&typeof window.cancelAnimationFrame=="function"?{request:e=>window.requestAnimationFrame(e),cancel:e=>window.cancelAnimationFrame(Number(e))}:{request:e=>globalThis.setTimeout(()=>{e(t.now());},16),cancel:e=>{globalThis.clearTimeout(e);}},Li=()=>typeof document>"u"?()=>{throw new Error("Document is not available. Provide a custom createCanvasElement implementation.")}:()=>document.createElement("canvas"),Pi=t=>{if(!t||typeof t!="object")return  false;const e=t;return typeof e.commentColor=="string"&&typeof e.commentOpacity=="number"&&typeof e.isCommentVisible=="boolean"},wt=t=>t.isScrolling&&t.isFull&&t.text.includes(`
`)&&t.commands.some(e=>e.toLowerCase()==="mincho"),Fi=t=>{const e=new Set;t.forEach(n=>{n.isEnder&&wt(n)&&e.add(n.vposMs);}),t.forEach(n=>{n.hasSameVposFullMinchoEnder=e.has(n.vposMs)&&wt(n);});},St=t=>{const e=t.meta?.no;return typeof e=="number"&&Number.isFinite(e)?e:null},Ri=function(t){if(!Array.isArray(t)||t.length===0)return [];const e=[];this.commentDependencies.settingsVersion=this.settingsVersion;for(const n of t){const{text:r,vposMs:i,commands:s=[],meta:a=null}=n,o=se(r);if(this.isNGComment(r)){T("comment-skip-ng",{preview:o,vposMs:i});continue}const l=Bn(i);if(l===null){this.log.warn("CommentRenderer.addComment.invalidVpos",{text:r,vposMs:i}),T("comment-skip-invalid-vpos",{preview:o,vposMs:i});continue}const d=a?.no!==void 0?`no:${a.source??""}:${a.fork??""}:${a.threadId??""}:${a.no}`:`fallback:${r}\0${l}`,h=u=>u.meta?.no!==void 0?`no:${u.meta.source??""}:${u.meta.fork??""}:${u.meta.threadId??""}:${u.meta.no}`:`fallback:${u.text}\0${u.vposMs}`;if(this.comments.some(u=>h(u)===d)||e.some(u=>h(u)===d)){T("comment-skip-duplicate",{preview:o,vposMs:l});continue}const c=new an(r,l,s,this._settings,this.commentDependencies,a);c.creationIndex=this.commentSequence++,c.epochId=this.epochId,e.push(c),T("comment-added",{preview:o,vposMs:l,commands:c.commands.length,layout:c.layout,isScrolling:c.isScrolling,invisible:c.isInvisible});}return e.length===0?[]:(this.comments.push(...e),Fi(this.comments),this.finalPhaseActive&&(this.finalPhaseScheduleDirty=true),this.comments.sort((n,r)=>{const i=n.vposMs-r.vposMs;if(Math.abs(i)>A)return i;const s=St(n),a=St(r);return s!==null&&a!==null&&Math.abs(s-a)>A?s-a:n.creationIndex-r.creationIndex}),e)},Di=function(t,e,n=[],r=null){const[i]=this.addComments([{text:t,vposMs:e,commands:n,meta:r}]);return i??null},Hi=function(){if(this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.commentSequence=0,this.ctx&&this.canvas){const t=this.canvasDpr>0?this.canvasDpr:1,e=this.displayWidth>0?this.displayWidth:this.canvas.width/t,n=this.displayHeight>0?this.displayHeight:this.canvas.height/t;this.ctx.clearRect(0,0,e,n);}},zi=function(){this.clearComments(),this.currentTime=0,this.resetFinalPhaseState(),this.playbackHasBegun=false,this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false;},ln=function(){const t=this._settings,e=Array.isArray(t.ngWords)?t.ngWords:[];this.normalizedNgWords=e.filter(r=>typeof r=="string");const n=Array.isArray(t.ngRegexps)?t.ngRegexps:[];this.compiledNgRegexps=n.map(r=>{if(typeof r!="string")return null;try{return new RegExp(r,"i")}catch(i){return this.log.warn("CommentRenderer.invalidNgRegexp",i,{entry:r}),null}}).filter(r=>!!r);},Oi=function(t){return typeof t!="string"||t.length===0?false:this.normalizedNgWords.some(e=>e.length>0&&t.includes(e))?true:this.compiledNgRegexps.some(e=>e.test(t))},Ni=t=>{t.prototype.addComments=Ri,t.prototype.addComment=Di,t.prototype.clearComments=Hi,t.prototype.resetState=zi,t.prototype.rebuildNgMatchers=ln,t.prototype.isNGComment=Oi;},$i=function(){this.finalPhaseActive=false,this.finalPhaseStartTime=null,this.finalPhaseScheduleDirty=false,this.finalPhaseVposOverrides.clear();},Wi=function(t){const e=this.epochId;if(this.epochId+=1,qr(e,this.epochId,t),this.eventHooks.onEpochChange){const n={previousEpochId:e,newEpochId:this.epochId,reason:t,timestamp:this.timeSource.now()};try{this.eventHooks.onEpochChange(n);}catch(r){this.log.error("CommentRenderer.incrementEpoch.callback",r,{info:n});}}this.comments.forEach(n=>{n.epochId=this.epochId;});},Bi=function(t){const e=this.timeSource.now();if(e-this.lastSnapshotEmitTime<this.snapshotEmitThrottleMs)return;const n={currentTime:this.currentTime,duration:this.duration,isPlaying:this.isPlaying,epochId:this.epochId,totalComments:this.comments.length,activeComments:this.activeComments.size,reservedLanes:this.reservedLanes.size,finalPhaseActive:this.finalPhaseActive,playbackHasBegun:this.playbackHasBegun,isStalled:this.isStalled};if(Br(t,n),this.eventHooks.onStateSnapshot)try{this.eventHooks.onStateSnapshot(n);}catch(r){this.log.error("CommentRenderer.emitStateSnapshot.callback",r);}this.lastSnapshotEmitTime=e;},qi=function(t){this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline();const e=this.finalPhaseVposOverrides.get(t);return e!==void 0?e:cn(t)},cn=t=>{if(!t.isScrolling)return t.vposMs;const e=t.isFull?er:Jn;return Math.max(0,t.vposMs-e)},Yi=function(t){if(!t.isScrolling)return O;const e=[];return Number.isFinite(t.visibleDurationMs)&&t.visibleDurationMs>0&&e.push(t.visibleDurationMs),Number.isFinite(t.totalDurationMs)&&t.totalDurationMs>0&&e.push(t.totalDurationMs),e.length>0?Math.max(...e):De},Ui=function(t){if(!this.finalPhaseActive||this.finalPhaseStartTime===null)return this.finalPhaseVposOverrides.delete(t),cn(t);this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline();const e=this.finalPhaseVposOverrides.get(t);if(e!==void 0)return e;const n=Math.max(t.vposMs,this.finalPhaseStartTime);return this.finalPhaseVposOverrides.set(t,n),n},Gi=function(){if(!this.finalPhaseActive||this.finalPhaseStartTime===null){this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=false;return}const t=this.finalPhaseStartTime,e=this.duration>0?this.duration:t+ne,n=Math.max(t+ne,e),r=this.comments.filter(l=>l.hasShown||l.isInvisible||this.isNGComment(l.text)?false:l.vposMs>=t-D).sort((l,d)=>{const h=l.vposMs-d.vposMs;return Math.abs(h)>A?h:l.creationIndex-d.creationIndex});if(this.finalPhaseVposOverrides.clear(),r.length===0){this.finalPhaseScheduleDirty=false;return}const i=Math.max(n-t,ne)/Math.max(r.length,1),s=Number.isFinite(i)?i:be,a=Math.max(be,Math.min(s,Kn));let o=t;r.forEach((l,d)=>{const h=Math.max(1,this.getFinalPhaseDisplayDuration(l)),c=n-h;let u=Math.max(t,Math.min(o,c));Number.isFinite(u)||(u=t);const p=Xn*d;u+p<=c&&(u+=p),this.finalPhaseVposOverrides.set(l,u);const m=Math.max(be,Math.min(h/2,a));o=u+m;}),this.finalPhaseScheduleDirty=false;},ji=t=>{t.prototype.resetFinalPhaseState=$i,t.prototype.incrementEpoch=Wi,t.prototype.emitStateSnapshot=Bi,t.prototype.getEffectiveCommentVpos=qi,t.prototype.getFinalPhaseDisplayDuration=Yi,t.prototype.resolveFinalPhaseVpos=Ui,t.prototype.recomputeFinalPhaseTimeline=Gi;},Ki=function(){return !this.playbackHasBegun&&!this.isPlaying&&this.currentTime<=B},Xi=function(){this.playbackHasBegun||(this.isPlaying||this.currentTime>B)&&(this.playbackHasBegun=true);},Zi=t=>{t.prototype.shouldSuppressRendering=Ki,t.prototype.updatePlaybackProgressState=Xi;},Ji=function(t){const e=this.videoElement,n=this.canvas,r=this.ctx;if(!e||!n||!r)return;const i=typeof t=="number"?t:L(e.currentTime);if(this.currentTime=i,this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.updatePlaybackProgressState(),this.skipDrawingForCurrentFrame=this.shouldSuppressRendering(),this.skipDrawingForCurrentFrame)return;const s=this.canvasDpr>0?this.canvasDpr:1,a=this.displayWidth>0?this.displayWidth:n.width/s,o=this.displayHeight>0?this.displayHeight:n.height/s,l=this.buildPrepareOptions(a),d=this.duration>0&&this.duration-this.currentTime<=jn;d&&!this.finalPhaseActive&&(this.finalPhaseActive=true,this.finalPhaseStartTime=this.currentTime,this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=true,r.clearRect(0,0,a,o),this.comments.forEach(c=>{c.isActive=false,c.clearActivation();}),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0),!d&&this.finalPhaseActive&&this.resetFinalPhaseState(),this.finalPhaseActive&&this.finalPhaseScheduleDirty&&this.recomputeFinalPhaseTimeline(),this.pruneStaticLaneReservations(this.currentTime);for(const c of Array.from(this.activeComments)){const u=this.getEffectiveCommentVpos(c),p=u<this.currentTime-D,m=u>this.currentTime+D;if(p||m){c.isActive=false,this.activeComments.delete(c),c.clearActivation(),c.lane>=0&&(c.layout==="ue"?this.releaseStaticLane("ue",c.lane):c.layout==="shita"&&this.releaseStaticLane("shita",c.lane));continue}c.isScrolling&&c.hasShown&&(c.scrollDirection==="rtl"&&c.x<=c.exitThreshold||c.scrollDirection==="ltr"&&c.x>=c.exitThreshold)&&(c.isActive=false,this.activeComments.delete(c),c.clearActivation());}const h=this.getCommentsInTimeWindow(this.currentTime,D);for(const c of h){const u=W(),p=u?se(c.text):"";if(u&&T("comment-evaluate",{stage:"update",preview:p,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),currentTime:this.currentTime,isActive:c.isActive,hasShown:c.hasShown}),this.isNGComment(c.text)){u&&T("comment-eval-skip",{preview:p,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"ng-runtime"});continue}if(c.isInvisible){u&&T("comment-eval-skip",{preview:p,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"invisible"}),c.isActive=false,this.activeComments.delete(c),c.hasShown=true,c.clearActivation();continue}if(c.syncWithSettings(this._settings,this.settingsVersion),this.shouldActivateCommentAtTime(c,this.currentTime,p)&&this.activateComment(c,r,a,o,l,this.currentTime),c.isActive){if(c.layout!=="naka"&&c.hasStaticExpired(this.currentTime)){const m=c.layout==="ue"?"ue":"shita";this.releaseStaticLane(m,c.lane),c.isActive=false,this.activeComments.delete(c),c.clearActivation();continue}if(c.layout==="naka"&&this.getEffectiveCommentVpos(c)>this.currentTime+B){c.x=c.virtualStartX,c.lastUpdateTime=this.timeSource.now();continue}if(c.hasShown=true,c.update(this.playbackRate,!this.isPlaying),!c.isScrolling&&c.hasStaticExpired(this.currentTime)){const m=c.layout==="ue"?"ue":"shita";this.releaseStaticLane(m,c.lane),c.isActive=false,this.activeComments.delete(c),c.clearActivation();}}}},Qi=function(t){const e=this._settings.scrollVisibleDurationMs;let n=De,r=Ke;return e!==null&&(n=e,r=Math.max(1,Math.min(e,Ke))),{visibleWidth:t,virtualExtension:Zn,maxVisibleDurationMs:n,minVisibleDurationMs:r,maxWidthRatio:qn,bufferRatio:Yn,baseBufferPx:Un,entryBufferPx:Gn}},es=function(t){const e=this.currentTime;this.pruneLaneReservations(e),this.pruneStaticLaneReservations(e);const n=this.getLanePriorityOrder(e),r=this.createLaneReservation(t,e),i=n.map(l=>{const d=(this.reservedLanes.get(l)??[]).find(h=>this.areReservationsConflicting(h,r));return {lane:l,available:d===void 0,nextAvailableTime:this.getLaneNextAvailableTime(l,e),blocker:d}}),s=i.find(l=>l.available),a=n[n.length-1]??0,o=s?.lane??a;return this.storeLaneReservation(o,r),jr("laneDecision",t,{meta:{currentTimeMs:e,selectedLane:o,usedFallback:s===void 0,candidateLanes:i.map(l=>l.lane).join(","),availableLanes:i.filter(l=>l.available).map(l=>l.lane).join(","),nextAvailableTimes:i.map(l=>Math.round(l.nextAvailableTime)).join(","),blockedBy:i.map(l=>l.blocker?`${l.lane}:${l.blocker.comment.creationIndex}@${l.blocker.comment.vposMs}`:`${l.lane}:-`).join(","),reservationStartTimeMs:Math.round(r.startTime),reservationEndTimeMs:Math.round(r.endTime),reservationTotalEndTimeMs:Math.round(r.totalEndTime),reservationWidth:Math.round(r.width)}}),o},ts=t=>{t.prototype.updateComments=Ji,t.prototype.buildPrepareOptions=Qi,t.prototype.findAvailableLane=es;},ns=function(t,e){let n=0,r=t.length;for(;n<r;){const i=Math.floor((n+r)/2),s=t[i];s!==void 0&&s.totalEndTime+ue<=e?n=i+1:r=i;}return n},rs=function(t){for(const[e,n]of this.reservedLanes.entries()){const r=this.findFirstValidReservationIndex(n,t);r>=n.length?this.reservedLanes.delete(e):r>0&&this.reservedLanes.set(e,n.slice(r));}},is=function(t){const e=i=>i.filter(s=>s.releaseTime>t),n=e(this.topStaticLaneReservations),r=e(this.bottomStaticLaneReservations);this.topStaticLaneReservations.length=0,this.topStaticLaneReservations.push(...n),this.bottomStaticLaneReservations.length=0,this.bottomStaticLaneReservations.push(...r);},ss=t=>{t.prototype.findFirstValidReservationIndex=ns,t.prototype.pruneLaneReservations=rs,t.prototype.pruneStaticLaneReservations=is;},as=function(t){let e=0,n=this.comments.length;for(;e<n;){const r=Math.floor((e+n)/2),i=this.comments[r];i!==void 0&&i.vposMs<t?e=r+1:n=r;}return e},os=function(t,e){if(this.comments.length===0)return [];const n=t-e,r=t+e,i=this.findCommentIndexAtOrAfter(n),s=[];for(let a=i;a<this.comments.length;a++){const o=this.comments[a];if(o){if(o.vposMs>r)break;s.push(o);}}return s},ls=function(t){return t==="ue"?this.topStaticLaneReservations:this.bottomStaticLaneReservations},cs=function(t){return t==="ue"?this.topStaticLaneReservations.length:this.bottomStaticLaneReservations.length},ds=function(t){const e=t==="ue"?"shita":"ue",n=this.getStaticLaneDepth(e),r=this.laneCount-n;return r<=0?-1:r-1},hs=function(t){return Math.max(0,this.laneCount-1-t)},us=t=>{const e=Math.ceil(t.lines.length>1?t.height:t.height+t.fontSize/3);return Math.max(0,(e-t.height)/2)},ps=function(t,e,n,r){const i=Math.max(1,n),s=Math.max(r.height,r.fontSize),a=5,o=0,l=us(r);if(t==="ue"){const u=a+l;let p=u;const m=this.getStaticReservations(t).filter(y=>y.lane<e).sort((y,f)=>y.lane-f.lane);for(const y of m){const f=y.yEnd-y.yStart;p+=f+o;}const x=Math.max(a,i*2);return Math.max(u,Math.min(p,x))}let d=i-a;const h=this.getStaticReservations(t).filter(u=>u.lane<e).sort((u,p)=>u.lane-p.lane);for(const u of h){const p=u.yEnd-u.yStart;d-=p+o;}const c=d-s;return Math.max(a,c)},ms=function(){const t=new Set;for(const e of this.topStaticLaneReservations)t.add(e.lane);for(const e of this.bottomStaticLaneReservations)t.add(this.getGlobalLaneIndexForBottom(e.lane));return t},gs=t=>{t.prototype.findCommentIndexAtOrAfter=as,t.prototype.getCommentsInTimeWindow=os,t.prototype.getStaticReservations=ls,t.prototype.getStaticLaneDepth=cs,t.prototype.getStaticLaneLimit=ds,t.prototype.getGlobalLaneIndexForBottom=hs,t.prototype.resolveStaticCommentOffset=ps,t.prototype.getStaticReservedLaneSet=ms;},fs=t=>!t.isScrolling&&t.width>=1200&&t.fontSize>=35,dn=t=>Math.max(1,t.fontSize*(fs(t)?.46:1)),bs=function(t,e,n=""){const r=n.length>0&&W(),i=this.resolveFinalPhaseVpos(t);return this.finalPhaseActive&&this.finalPhaseStartTime!==null&&t.vposMs<this.finalPhaseStartTime-A?(r&&T("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"final-phase-trimmed",finalPhaseStartTime:this.finalPhaseStartTime}),this.finalPhaseVposOverrides.delete(t),false):t.isInvisible?(r&&T("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"invisible"}),false):t.isActive?(r&&T("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"already-active"}),false):t.hasShown&&i<=e?(r&&T("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"already-shown",currentTime:e}),false):i>e+B?(r&&T("comment-eval-pending",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"future",currentTime:e}),false):i<e-D?(r&&T("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"expired-window",currentTime:e}),false):!t.isScrolling&&i+O<=e?(r&&T("comment-eval-skip",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,reason:"static-expired",currentTime:e}),false):(r&&T("comment-eval-ready",{preview:n,vposMs:t.vposMs,effectiveVposMs:i,currentTime:e}),true)},vs=function(t,e,n,r,i,s){t.prepare(e,n,r,i);const a=this.resolveFinalPhaseVpos(t);if(W()&&T("comment-prepared",{preview:se(t.text),layout:t.layout,isScrolling:t.isScrolling,width:t.width,height:t.height,bufferWidth:t.bufferWidth,visibleDurationMs:t.visibleDurationMs,effectiveVposMs:a}),t.layout==="naka"){const o=Math.max(0,s-a),l=t.speedPixelsPerMs*o;if(this.finalPhaseActive&&this.finalPhaseStartTime!==null){const p=this.duration>0?this.duration:this.finalPhaseStartTime+ne,m=Math.max(this.finalPhaseStartTime+ne,p),x=t.width+n,y=x>0?x/Math.max(t.speedPixelsPerMs,1):0;if(a+y>m){const f=m-s,v=Math.max(0,f)*t.speedPixelsPerMs,M=t.scrollDirection==="rtl"?Math.max(t.virtualStartX-l,n-v):Math.min(t.virtualStartX+l,v-t.width);t.x=M;}else t.x=t.scrollDirection==="rtl"?t.virtualStartX-l:t.virtualStartX+l;}else t.x=t.scrollDirection==="rtl"?t.virtualStartX-l:t.virtualStartX+l;const d=this.findAvailableLane(t);t.lane=d;const h=Math.max(1,this.laneHeight),c=Math.max(0,r-t.height),u=d*h;t.y=t.isFull?0:Math.max(0,Math.min(u,c));}else {const o=t.layout==="ue"?"ue":"shita",l=this.assignStaticLane(o,t,r,s),d=this.resolveStaticCommentOffset(o,l,r,t);t.x=t.virtualStartX,t.y=d,t.lane=o==="ue"?l:this.getGlobalLaneIndexForBottom(l),t.speed=0,t.baseSpeed=0,t.speedPixelsPerMs=0;const h=a+O;t.visibleDurationMs=Math.max(0,h-s),this.activeComments.add(t),t.isActive=true,t.hasShown=true,t.isPaused=!this.isPlaying,t.markActivated(s),t.lastUpdateTime=this.timeSource.now(),t.staticExpiryTimeMs=h,this.reserveStaticLane(o,t,l,h),W()&&T("comment-activate-static",{preview:se(t.text),lane:t.lane,position:o,displayEnd:h,effectiveVposMs:a});return}this.activeComments.add(t),t.isActive=true,t.hasShown=true,t.isPaused=!this.isPlaying,t.markActivated(s),t.lastUpdateTime=this.timeSource.now();},ys=function(t,e,n,r){const i=this.getStaticReservations(t),s=dn(e),a=Math.max(1,s),o=Math.max(this.laneCount,Math.ceil(Math.max(1,n)/a)+i.length+1),l=Array.from({length:o},(c,u)=>u);for(const c of l){const u=this.resolveStaticCommentOffset(t,c,n,e),p=u,m=u+s;if(!i.some(x=>x.releaseTime>r?!(m<=x.yStart||p>=x.yEnd):false))return c}let d=l[0]??0,h=Number.POSITIVE_INFINITY;for(const c of i)c.releaseTime<h&&(h=c.releaseTime,d=c.lane);return d},xs=function(t,e,n,r){const i=this.getStaticReservations(t),s=e.y,a=e.y+dn(e);i.push({comment:e,releaseTime:r,yStart:s,yEnd:a,lane:n});},ws=function(t,e){if(e<0)return;const n=this.getStaticReservations(t),r=n.findIndex(i=>i.lane===e);r>=0&&n.splice(r,1);},Ss=t=>{t.prototype.shouldActivateCommentAtTime=bs,t.prototype.activateComment=vs,t.prototype.assignStaticLane=ys,t.prototype.reserveStaticLane=xs,t.prototype.releaseStaticLane=ws;},Cs=.001,Ms=function(){return Array.from({length:this.laneCount},(t,e)=>e)},Es=function(t,e){const n=this.reservedLanes.get(t);if(!n||n.length===0)return e;const r=this.findFirstValidReservationIndex(n,e),i=n[r];return i?Math.max(e,i.endTime+ue):e},Ts=function(t,e){const n=Math.max(t.speedPixelsPerMs,A),r=this.getEffectiveCommentVpos(t),i=Number.isFinite(r)?r:e,s=Math.max(0,i),a=Number.isFinite(t.width)&&t.width>0?t.width:t.reservationWidth,o=n>0?Math.max(a,0)/n:t.preCollisionDurationMs,l=s+o+ue,d=s+t.totalDurationMs+ue;return {comment:t,startTime:s,endTime:Math.max(s,l),totalEndTime:Math.max(s,d),startLeft:t.virtualStartX,width:a,speed:n,buffer:0,directionSign:t.getDirectionSign()}},ks=function(t,e,n){const r=this.reservedLanes.get(t);if(!r||r.length===0)return  true;const i=this.findFirstValidReservationIndex(r,n);for(let s=i;s<r.length;s+=1){const a=r[s];if(a&&this.areReservationsConflicting(a,e))return  false}return  true},_s=function(t,e){const n=[...this.reservedLanes.get(t)??[],e].sort((r,i)=>r.totalEndTime-i.totalEndTime);this.reservedLanes.set(t,n);},Vs=function(t,e){if(t.directionSign===e.directionSign){const o=t.speed>0?Math.max(t.width,0)/t.speed:0,l=e.speed>0?Math.max(e.width,0)/e.speed:0,d=Math.max(o,l);return Math.abs(e.startTime-t.startTime)+Cs<d}const n=Math.max(t.startTime,e.startTime),r=Math.min(t.endTime,e.endTime);if(n>=r)return  false;const i=new Set([n,r,n+(r-n)/2]),s=this.solveLeftRightEqualityTime(t,e);s!==null&&s>=n-A&&s<=r+A&&i.add(s);const a=this.solveLeftRightEqualityTime(e,t);a!==null&&a>=n-A&&a<=r+A&&i.add(a);for(const o of i){if(o<n-A||o>r+A)continue;const l=this.computeForwardGap(t,e,o),d=this.computeForwardGap(e,t,o);if(l<=-24&&d<=-24)return  true}return  false},Is=function(t,e,n){const r=this.getBufferedEdges(t,n),i=this.getBufferedEdges(e,n);return r.left-i.right},As=function(t,e){const n=Math.max(0,e-t.startTime),r=t.speed*n,i=t.startLeft+t.directionSign*r,s=i-t.buffer,a=i+t.width+t.buffer;return {left:s,right:a}},Ls=function(t,e){const n=t.directionSign,r=e.directionSign,i=r*e.speed-n*t.speed;if(Math.abs(i)<A)return null;const s=(e.startLeft+r*e.speed*e.startTime+e.width+e.buffer-t.startLeft-n*t.speed*t.startTime+t.buffer)/i;return Number.isFinite(s)?s:null},Ps=t=>{t.prototype.getLanePriorityOrder=Ms,t.prototype.getLaneNextAvailableTime=Es,t.prototype.createLaneReservation=Ts,t.prototype.isLaneAvailable=ks,t.prototype.storeLaneReservation=_s,t.prototype.areReservationsConflicting=Vs,t.prototype.computeForwardGap=Is,t.prototype.getBufferedEdges=As,t.prototype.solveLeftRightEqualityTime=Ls;},Fs=function(){const t=this.canvas,e=this.ctx;if(!t||!e)return;const n=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/n,i=this.displayHeight>0?this.displayHeight:t.height/n,s=this.timeSource.now();if(this.skipDrawingForCurrentFrame||this.shouldSuppressRendering()||this.isStalled){e.clearRect(0,0,r,i),this.lastDrawTime=s;return}e.clearRect(0,0,r,i);const a=Array.from(this.activeComments);if(this._settings.isCommentVisible){const o=(s-this.lastDrawTime)/16.666666666666668;a.sort((l,d)=>{const h=this.getEffectiveCommentVpos(l),c=this.getEffectiveCommentVpos(d),u=h-c;return Math.abs(u)>A?u:l.isScrolling!==d.isScrolling?l.isScrolling?1:-1:l.creationIndex-d.creationIndex}),a.forEach(l=>{const d=this.isPlaying&&!l.isPaused?l.x+l.getDirectionSign()*l.speed*o:l.x;l.draw(e,d);});}this.lastDrawTime=s;},Rs=function(t){const e=this.videoElement,n=this.canvas,r=this.ctx;if(!e||!n||!r)return;const i=typeof t=="number"?t:L(e.currentTime);this.currentTime=i,this.lastDrawTime=this.timeSource.now();const s=this.canvasDpr>0?this.canvasDpr:1,a=this.displayWidth>0?this.displayWidth:n.width/s,o=this.displayHeight>0?this.displayHeight:n.height/s,l=this.buildPrepareOptions(a);this.activeComments.forEach(d=>{d.isActive=false,d.clearActivation();}),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.getCommentsInTimeWindow(this.currentTime,D).forEach(d=>{if(this.isNGComment(d.text)||d.isInvisible){d.isActive=false,this.activeComments.delete(d),d.clearActivation();return}if(d.syncWithSettings(this._settings,this.settingsVersion),d.isActive=false,this.activeComments.delete(d),d.lane=-1,d.hasShown=false,d.clearActivation(),this.shouldActivateCommentAtTime(d,this.currentTime)){this.activateComment(d,r,a,o,l,this.currentTime);return}this.getEffectiveCommentVpos(d)<this.currentTime-D?d.hasShown=true:d.hasShown=false;});},Ds=t=>{t.prototype.draw=Fs,t.prototype.performInitialSync=Rs;},Hs=function(t){this.videoElement&&this._settings.isCommentVisible&&(this.pendingInitialSync&&(this.performInitialSync(t),this.pendingInitialSync=false),this.updateComments(t),this.draw());},zs=function(){const t=this.frameId;this.frameId=null,t!==null&&this.animationFrameProvider.cancel(t),this.processFrame(),this.scheduleNextFrame();},Os=function(t,e){this.videoFrameHandle=null;const n=typeof e?.mediaTime=="number"?e.mediaTime*1e3:void 0;this.processFrame(typeof n=="number"?n:void 0),this.scheduleNextFrame();},Ns=function(){if(this._settings.syncMode!=="video-frame")return  false;const t=this.videoElement;return !!t&&typeof t.requestVideoFrameCallback=="function"&&typeof t.cancelVideoFrameCallback=="function"},$s=function(){const t=this.videoElement;if(t){if(this.shouldUseVideoFrameCallback()){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();const e=t.requestVideoFrameCallback;typeof e=="function"&&(this.videoFrameHandle=e.call(t,this.handleVideoFrame));return}this.cancelVideoFrameCallback(),this.frameId=this.animationFrameProvider.request(this.handleAnimationFrame);}},Ws=function(){this.frameId!==null&&(this.animationFrameProvider.cancel(this.frameId),this.frameId=null);},Bs=function(){if(this.videoFrameHandle===null)return;const t=this.videoElement;t&&typeof t.cancelVideoFrameCallback=="function"&&t.cancelVideoFrameCallback(this.videoFrameHandle),this.videoFrameHandle=null;},qs=function(){this.stopAnimation(),this.scheduleNextFrame();},Ys=function(){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();},Us=function(){const t=this.canvas,e=this.ctx,n=this.videoElement;if(!t||!e||!n)return;const r=L(n.currentTime),i=Math.abs(r-this.currentTime),s=this.timeSource.now();if(s-this.lastPlayResumeTime<this.playResumeSeekIgnoreDurationMs){this.currentTime=r,this._settings.isCommentVisible&&(this.lastDrawTime=s,this.draw());return}const a=i>B;if(this.currentTime=r,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),!a){this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());return}this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;const o=this.canvasDpr>0?this.canvasDpr:1,l=this.displayWidth>0?this.displayWidth:t.width/o,d=this.displayHeight>0?this.displayHeight:t.height/o,h=this.buildPrepareOptions(l);this.getCommentsInTimeWindow(this.currentTime,D).forEach(c=>{const u=W(),p=u?se(c.text):"";if(u&&T("comment-evaluate",{stage:"seek",preview:p,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),currentTime:this.currentTime,isActive:c.isActive,hasShown:c.hasShown}),this.isNGComment(c.text)){u&&T("comment-eval-skip",{preview:p,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"ng-runtime"}),c.isActive=false,this.activeComments.delete(c),c.clearActivation();return}if(c.isInvisible){u&&T("comment-eval-skip",{preview:p,vposMs:c.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(c),reason:"invisible"}),c.isActive=false,this.activeComments.delete(c),c.hasShown=true,c.clearActivation();return}if(c.syncWithSettings(this._settings,this.settingsVersion),c.isActive=false,this.activeComments.delete(c),c.lane=-1,c.hasShown=false,c.clearActivation(),this.shouldActivateCommentAtTime(c,this.currentTime,p)){this.activateComment(c,e,l,d,h,this.currentTime);return}this.getEffectiveCommentVpos(c)<this.currentTime-D?c.hasShown=true:c.hasShown=false;}),this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());},Gs=t=>{t.prototype.processFrame=Hs,t.prototype.handleAnimationFrame=zs,t.prototype.handleVideoFrame=Os,t.prototype.shouldUseVideoFrameCallback=Ns,t.prototype.scheduleNextFrame=$s,t.prototype.cancelAnimationFrameRequest=Ws,t.prototype.cancelVideoFrameCallback=Bs,t.prototype.startAnimation=qs,t.prototype.stopAnimation=Ys,t.prototype.onSeek=Us;},js=function(t,e){if(t)return t;if(e.parentElement)return e.parentElement;if(typeof document<"u"&&document.body)return document.body;throw new Error("Cannot resolve container element. Provide container explicitly when DOM is unavailable.")},Ks=function(t){if(typeof getComputedStyle=="function"){getComputedStyle(t).position==="static"&&(t.style.position="relative");return}t.style.position||(t.style.position="relative");},Xs=function(t){try{this.destroyCanvasOnly();const e=t instanceof HTMLVideoElement?t:t.video,n=t instanceof HTMLVideoElement?t.parentElement:t.container??t.video.parentElement,r=this.resolveContainer(n??null,e);this.videoElement=e,this.containerElement=r,this.lastVideoSource=this.getCurrentVideoSource(),this.duration=Number.isFinite(e.duration)?L(e.duration):0,this.currentTime=L(e.currentTime),this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.isStalled=!1,this.lastDrawTime=this.timeSource.now(),this.playbackHasBegun=this.isPlaying||this.currentTime>B,this.skipDrawingForCurrentFrame=this.shouldSuppressRendering();const i=this.createCanvasElement(),s=i.getContext("2d");if(!s)throw new Error("Failed to acquire 2D canvas context");i.style.position="absolute",i.style.top="0",i.style.left="0",i.style.right="0",i.style.bottom="0",i.style.display="block",i.style.pointerEvents="none",i.style.zIndex="2147483647";const a=this.containerElement;a instanceof HTMLElement&&(this.ensureContainerPositioning(a),a.appendChild(i)),this.canvas=i,this.ctx=s,this.resize(),this.calculateLaneMetrics(),this.setupVideoEventListeners(e),this.setupResizeHandling(e),this.setupFullscreenHandling(),this.setupVideoChangeDetection(e,r),this.startAnimation(),this.setupVisibilityHandling();}catch(e){throw this.log.error("CommentRenderer.initialize",e),e}},Zs=function(){this.stopAnimation(),this.cleanupResizeHandling(),this.runCleanupTasks(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.videoElement=null,this.containerElement=null,this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.resetFinalPhaseState(),this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.commentSequence=0,this.playbackHasBegun=false,this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false;},Js=function(){this.stopAnimation(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.fullscreenActive=false;},Qs=t=>{t.prototype.resolveContainer=js,t.prototype.ensureContainerPositioning=Ks,t.prototype.initialize=Xs,t.prototype.destroy=Zs,t.prototype.destroyCanvasOnly=Js;},ea=function(t){try{const e=()=>{this.isPlaying=!0,this.playbackHasBegun=!0;const u=this.timeSource.now();this.lastDrawTime=u,this.lastPlayResumeTime=u,this.comments.forEach(p=>{p.lastUpdateTime=u,p.isPaused=!1;});},n=()=>{this.isPlaying=!1;const u=this.timeSource.now();this.comments.forEach(p=>{p.lastUpdateTime=u,p.isPaused=!0;});},r=()=>{this.onSeek();},i=()=>{this.onSeek();},s=()=>{this.playbackRate=t.playbackRate;const u=this.timeSource.now();this.comments.forEach(p=>{p.lastUpdateTime=u;});},a=()=>{this.handleVideoMetadataLoaded(t);},o=()=>{this.duration=Number.isFinite(t.duration)?L(t.duration):0;},l=()=>{this.handleVideoSourceChange();},d=()=>{this.handleVideoStalled();},h=()=>{this.handleVideoCanPlay();},c=()=>{this.handleVideoCanPlay();};t.addEventListener("play",e),t.addEventListener("pause",n),t.addEventListener("seeking",r),t.addEventListener("seeked",i),t.addEventListener("ratechange",s),t.addEventListener("loadedmetadata",a),t.addEventListener("durationchange",o),t.addEventListener("emptied",l),t.addEventListener("waiting",d),t.addEventListener("canplay",h),t.addEventListener("playing",c),this.addCleanup(()=>t.removeEventListener("play",e)),this.addCleanup(()=>t.removeEventListener("pause",n)),this.addCleanup(()=>t.removeEventListener("seeking",r)),this.addCleanup(()=>t.removeEventListener("seeked",i)),this.addCleanup(()=>t.removeEventListener("ratechange",s)),this.addCleanup(()=>t.removeEventListener("loadedmetadata",a)),this.addCleanup(()=>t.removeEventListener("durationchange",o)),this.addCleanup(()=>t.removeEventListener("emptied",l)),this.addCleanup(()=>t.removeEventListener("waiting",d)),this.addCleanup(()=>t.removeEventListener("canplay",h)),this.addCleanup(()=>t.removeEventListener("playing",c));}catch(e){throw this.log.error("CommentRenderer.setupVideoEventListeners",e),e}},ta=function(t){this.lastVideoSource=this.getCurrentVideoSource(),this.incrementEpoch("metadata-loaded"),this.handleVideoSourceChange(t),this.resize(),this.calculateLaneMetrics(),this.onSeek(),this.emitStateSnapshot("metadata-loaded");},na=function(){const t=this.canvas,e=this.ctx;if(!t||!e)return;this.isStalled=true;const n=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/n,i=this.displayHeight>0?this.displayHeight:t.height/n;e.clearRect(0,0,r,i),this.comments.forEach(s=>{s.isActive&&(s.lastUpdateTime=this.timeSource.now());});},ra=function(){this.isStalled&&(this.isStalled=false,this.videoElement&&(this.currentTime=L(this.videoElement.currentTime),this.isPlaying=!this.videoElement.paused),this.lastDrawTime=this.timeSource.now());},ia=function(t){const e=t??this.videoElement;if(!e){this.lastVideoSource=null,this.isPlaying=false,this.resetFinalPhaseState(),this.resetCommentActivity();return}const n=this.getCurrentVideoSource();n!==this.lastVideoSource&&(this.lastVideoSource=n,this.incrementEpoch("source-change"),this.syncVideoState(e),this.resetFinalPhaseState(),this.resetCommentActivity(),this.emitStateSnapshot("source-change"));},sa=function(t){this.duration=Number.isFinite(t.duration)?L(t.duration):0,this.currentTime=L(t.currentTime),this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.isStalled=false,this.playbackHasBegun=this.isPlaying||this.currentTime>B,this.lastDrawTime=this.timeSource.now();},aa=function(){const t=this.timeSource.now(),e=this.canvas,n=this.ctx;if(this.resetFinalPhaseState(),this.skipDrawingForCurrentFrame=false,this.isStalled=false,this.pendingInitialSync=false,this.playbackHasBegun=this.isPlaying||this.currentTime>B,e&&n){const r=this.canvasDpr>0?this.canvasDpr:1,i=this.displayWidth>0?this.displayWidth:e.width/r,s=this.displayHeight>0?this.displayHeight:e.height/r;n.clearRect(0,0,i,s);}this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.comments.forEach(r=>{r.isActive=false,r.isPaused=!this.isPlaying,r.hasShown=false,r.lane=-1,r.x=r.virtualStartX,r.speed=r.baseSpeed,r.lastUpdateTime=t,r.clearActivation();}),this.activeComments.clear();},oa=function(t,e){if(typeof MutationObserver>"u"){this.log.debug("MutationObserver is not available in this environment. Video change detection is disabled.");return}const n=new MutationObserver(i=>{for(const s of i){if(s.type==="attributes"&&s.attributeName==="src"){const a=s.target;let o=null,l=null;if((a instanceof HTMLVideoElement||a instanceof HTMLSourceElement)&&(o=typeof s.oldValue=="string"?s.oldValue:null,l=a.getAttribute("src")),o===l)continue;this.handleVideoSourceChange(t);return}if(s.type==="childList"){for(const a of s.addedNodes)if(a instanceof HTMLSourceElement){this.handleVideoSourceChange(t);return}for(const a of s.removedNodes)if(a instanceof HTMLSourceElement){this.handleVideoSourceChange(t);return}}}});n.observe(t,{attributes:true,attributeFilter:["src"],attributeOldValue:true,childList:true,subtree:true}),this.addCleanup(()=>n.disconnect());const r=new MutationObserver(i=>{for(const s of i)if(s.type==="childList"){for(const a of s.addedNodes){const o=this.extractVideoElement(a);if(o&&o!==this.videoElement){this.initialize(o);return}}for(const a of s.removedNodes){if(a===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}if(a instanceof Element){const o=a.querySelector("video");if(o&&o===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}}}}});r.observe(e,{childList:true,subtree:true}),this.addCleanup(()=>r.disconnect());},la=function(t){if(t instanceof HTMLVideoElement)return t;if(t instanceof Element){const e=t.querySelector("video");if(e instanceof HTMLVideoElement)return e}return null},ca=t=>{t.prototype.setupVideoEventListeners=ea,t.prototype.handleVideoMetadataLoaded=ta,t.prototype.handleVideoStalled=na,t.prototype.handleVideoCanPlay=ra,t.prototype.handleVideoSourceChange=ia,t.prototype.syncVideoState=sa,t.prototype.resetCommentActivity=aa,t.prototype.setupVideoChangeDetection=oa,t.prototype.extractVideoElement=la;},da=function(){if(typeof document>"u"||typeof document.addEventListener!="function"||typeof document.removeEventListener!="function")return;const t=()=>{if(document.visibilityState!=="visible"){this.stopAnimation();return}this._settings.isCommentVisible&&(this.handleVisibilityRestore(),this.startAnimation());};document.addEventListener("visibilitychange",t),this.addCleanup(()=>document.removeEventListener("visibilitychange",t)),document.visibilityState!=="visible"&&this.stopAnimation();},ha=function(){const t=this.canvas,e=this.ctx,n=this.videoElement;!t||!e||!n||(this.currentTime=L(n.currentTime),this.lastDrawTime=this.timeSource.now(),this.isPlaying=!n.paused,this.isStalled=false,this.pendingInitialSync=true,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),this.draw());},ua=function(t){const e=this._settings.isCommentVisible;if(this._settings.isCommentVisible=t,e===t)return;this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion;const n=this.canvas,r=this.ctx;if(!(!n||!r))if(t)this.lastDrawTime=this.timeSource.now(),this.pendingInitialSync=true,this.scheduleNextFrame();else {const i=this.canvasDpr>0?this.canvasDpr:1,s=this.displayWidth>0?this.displayWidth:n.width/i,a=this.displayHeight>0?this.displayHeight:n.height/i;r.clearRect(0,0,s,a);}},pa=t=>{t.prototype.setupVisibilityHandling=da,t.prototype.handleVisibilityRestore=ha,t.prototype.setCommentVisibility=ua;},ma=2.1,ga=function(t,e){const n=this.videoElement,r=this.canvas,i=this.ctx;if(!n||!r)return;const s=(this.fullscreenActive&&r.parentElement instanceof HTMLElement?r.parentElement.getBoundingClientRect():null)??n.getBoundingClientRect(),a=this.canvasDpr>0?this.canvasDpr:1,o=this.displayWidth>0?this.displayWidth:r.width/a,l=this.displayHeight>0?this.displayHeight:r.height/a,d=t??s.width??o,h=e??s.height??l;if(!Number.isFinite(d)||!Number.isFinite(h)||d<=0||h<=0)return;const c=Math.max(1,Math.floor(d)),u=Math.max(1,Math.floor(h)),p=this._settings.useDprScaling?this.resolveDevicePixelRatio():1,m=Math.max(1,Math.round(c*p)),x=Math.max(1,Math.round(u*p));(this.displayWidth!==c||this.displayHeight!==u||Math.abs(this.canvasDpr-p)>Number.EPSILON||r.width!==m||r.height!==x)&&(this.displayWidth=c,this.displayHeight=u,this.canvasDpr=p,r.width=m,r.height=x,r.style.width=`${c}px`,r.style.height=`${u}px`,i&&(i.setTransform(1,0,0,1,0,0),this._settings.useDprScaling&&i.scale(p,p)),this.calculateLaneMetrics(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.performInitialSync(L(n.currentTime)),this.draw());},fa=function(){if(typeof window>"u")return 1;const t=Number(window.devicePixelRatio);return !Number.isFinite(t)||t<=0?1:t},ba=function(){const t=this.canvas;if(!t)return;const e=this.displayHeight>0?this.displayHeight:t.height/Math.max(this.canvasDpr,1),n=Math.max(Qn,Math.floor(e*(27/665)));this.laneHeight=n*ma;const r=Math.max(this.laneHeight,1),i=Math.floor(Math.max(0,e-r)/r);if(this._settings.useFixedLaneCount){const s=Number.isFinite(this._settings.fixedLaneCount)?Math.floor(this._settings.fixedLaneCount):Gt,a=Math.max(Xe,Math.min(i,s));this.laneCount=a;}else this.laneCount=Math.max(Xe,i);this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;},va=function(t){this.cleanupResizeHandling();let e=false;const n=()=>{if(e)return;e=true;const i=()=>{e=false,this.resize();};if(typeof requestAnimationFrame=="function"){requestAnimationFrame(i);return}i();};if(this._settings.useContainerResizeObserver&&this.isResizeObserverAvailable){const i=this.resolveResizeObserverTarget(t),s=new ResizeObserver(a=>{for(const o of a){const{width:l,height:d}=o.contentRect;l>0&&d>0?this.resize(l,d):this.resize();}});s.observe(i),this.resizeObserver=s,this.resizeObserverTarget=i;}else this.log.debug("Resize handling is disabled because neither ResizeObserver nor window APIs are available.");typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("resize",n),this.addCleanup(()=>window.removeEventListener("resize",n)));const r=typeof window<"u"?window.visualViewport:void 0;r&&typeof r.addEventListener=="function"&&(r.addEventListener("resize",n),r.addEventListener("scroll",n),this.addCleanup(()=>{r.removeEventListener("resize",n),r.removeEventListener("scroll",n);}));},ya=function(){this.resizeObserver&&this.resizeObserverTarget&&this.resizeObserver.unobserve(this.resizeObserverTarget),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.resizeObserverTarget=null;},xa=t=>{t.prototype.resize=ga,t.prototype.resolveDevicePixelRatio=fa,t.prototype.calculateLaneMetrics=ba,t.prototype.setupResizeHandling=va,t.prototype.cleanupResizeHandling=ya;},wa=function(){if(typeof document>"u"||typeof document.addEventListener!="function"||typeof document.removeEventListener!="function")return;const t=()=>{this.handleFullscreenChange();};["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(e=>{document.addEventListener(e,t),this.addCleanup(()=>document.removeEventListener(e,t));}),this.handleFullscreenChange();},Ct=t=>{const e=()=>{const n=t.getFullscreenElement();if(n instanceof HTMLElement){const r=n.getBoundingClientRect();t.resize(r.width,r.height);return}t.resize();};typeof requestAnimationFrame=="function"&&requestAnimationFrame(e),typeof setTimeout=="function"&&setTimeout(e,80);},Sa=function(t){return this.resolveFullscreenContainer(t)||(t.parentElement??t)},Ca=async function(){const t=this.canvas,e=this.videoElement;if(!t||!e)return;const n=this.containerElement??e.parentElement??null,r=this.getFullscreenElement(),i=this.resolveActiveOverlayContainer(e,n,r);if(!(i instanceof HTMLElement))return;t.parentElement!==i?(this.ensureContainerPositioning(i),i.appendChild(t)):this.ensureContainerPositioning(i);const s=r instanceof HTMLElement&&r.contains(e)?r:null,a=s!==null;if(this.fullscreenActive!==a&&(this.fullscreenActive=a,this.setupResizeHandling(e)),t.style.position="absolute",t.style.top="0",t.style.left="0",t.style.right="0",t.style.bottom="0",t.style.display="block",t.style.pointerEvents="none",t.style.zIndex="2147483647",s){const o=s.getBoundingClientRect();this.resize(o.width,o.height),Ct(this);return}this.resize(),Ct(this);},Ma=function(t){const e=this.getFullscreenElement();return e instanceof HTMLElement&&(e===t||e.contains(t))?e:null},Ea=function(t,e,n){return n instanceof HTMLElement&&n.contains(t)?n instanceof HTMLVideoElement&&e instanceof HTMLElement?e:n:e??null},Ta=function(){if(typeof document>"u")return null;const t=document;return document.fullscreenElement??t.webkitFullscreenElement??t.mozFullScreenElement??t.msFullscreenElement??null},ka=t=>{t.prototype.setupFullscreenHandling=wa,t.prototype.resolveResizeObserverTarget=Sa,t.prototype.handleFullscreenChange=Ca,t.prototype.resolveFullscreenContainer=Ma,t.prototype.resolveActiveOverlayContainer=Ea,t.prototype.getFullscreenElement=Ta;},_a=function(t){this.cleanupTasks.push(t);},Va=function(){for(;this.cleanupTasks.length>0;){const t=this.cleanupTasks.pop();try{t?.();}catch(e){this.log.error("CommentRenderer.cleanupTask",e);}}},Ia=t=>{t.prototype.addCleanup=_a,t.prototype.runCleanupTasks=Va;};class _{_settings;comments=[];activeComments=new Set;reservedLanes=new Map;topStaticLaneReservations=[];bottomStaticLaneReservations=[];log;timeSource;animationFrameProvider;createCanvasElement;commentDependencies;settingsVersion=0;normalizedNgWords=[];compiledNgRegexps=[];canvas=null;ctx=null;videoElement=null;containerElement=null;fullscreenActive=false;laneCount=Gt;laneHeight=0;displayWidth=0;displayHeight=0;canvasDpr=1;currentTime=0;duration=0;playbackRate=1;isPlaying=true;isStalled=false;lastDrawTime=0;finalPhaseActive=false;finalPhaseStartTime=null;finalPhaseScheduleDirty=false;playbackHasBegun=false;skipDrawingForCurrentFrame=false;pendingInitialSync=false;finalPhaseVposOverrides=new Map;frameId=null;videoFrameHandle=null;resizeObserver=null;resizeObserverTarget=null;isResizeObserverAvailable=typeof ResizeObserver<"u";cleanupTasks=[];commentSequence=0;epochId=0;eventHooks;lastSnapshotEmitTime=0;snapshotEmitThrottleMs=1e3;lastPlayResumeTime=0;playResumeSeekIgnoreDurationMs=500;lastVideoSource=null;rebuildNgMatchers(){ln.call(this);}constructor(e=null,n=void 0){let r,i;if(Pi(e))r=le({...e}),i=n??{};else {const s=e??n??{};i=typeof s=="object"?s:{},r=le(on());}this._settings=le(r),this.timeSource=i.timeSource??Ut(),this.animationFrameProvider=i.animationFrameProvider??Ai(this.timeSource),this.createCanvasElement=i.createCanvasElement??Li(),this.commentDependencies={timeSource:this.timeSource,settingsVersion:this.settingsVersion},this.log=jt(i.loggerNamespace??"CommentRenderer"),this.eventHooks=i.eventHooks??{},this.handleAnimationFrame=this.handleAnimationFrame.bind(this),this.handleVideoFrame=this.handleVideoFrame.bind(this),this.rebuildNgMatchers(),i.debug&&$r(i.debug);}get settings(){return this._settings}set settings(e){this._settings=le(e),this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion,this.rebuildNgMatchers();}getVideoElement(){return this.videoElement}getCurrentVideoSource(){const e=this.videoElement;if(!e)return null;if(typeof e.currentSrc=="string"&&e.currentSrc.length>0)return e.currentSrc;const n=e.getAttribute("src");if(n&&n.length>0)return n;const r=e.querySelector("source[src]");return r&&typeof r.src=="string"?r.src:null}getCommentsSnapshot(){return [...this.comments]}}Ni(_);ji(_);Zi(_);ts(_);ss(_);gs(_);Ss(_);Ps(_);Ds(_);Gs(_);Qs(_);ca(_);pa(_);xa(_);ka(_);Ia(_);const q=()=>({...on(),shadowIntensity:"strong",autoSearchEnabled:true}),Aa="v7.3.12";var La=typeof GM_addStyle<"u"?GM_addStyle:void 0,j=typeof GM_getValue<"u"?GM_getValue:void 0,K=typeof GM_setValue<"u"?GM_setValue:void 0,Pa=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const Mt="settings",Et="currentVideo",Tt="lastDanimeIds",kt="playbackSettings",_t="manualSearchSettings",Fa=t=>({...t,ngWords:[...t.ngWords],ngRegexps:[...t.ngRegexps]}),J={fixedModeEnabled:false,fixedRate:1.11},ce=t=>({fixedModeEnabled:t.fixedModeEnabled,fixedRate:t.fixedRate});class Be{constructor(e){this.notifier=e,this.settings=q(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData(),this.playbackSettings=ce(J),this.loadPlaybackSettings();}settings;currentVideo;observers=new Set;playbackSettings;playbackObservers=new Set;getSettings(){return Fa(this.settings)}loadSettings(){try{const e=j(Mt,null);if(!e)return this.settings=q(),this.settings;if(typeof e=="string"){const n=JSON.parse(e);this.settings={...q(),...n,ngWords:Array.isArray(n?.ngWords)?[...n.ngWords]:[],ngRegexps:Array.isArray(n?.ngRegexps)?[...n.ngRegexps]:[]};}else this.settings={...q(),...e,ngWords:Array.isArray(e.ngWords)?[...e.ngWords]:[],ngRegexps:Array.isArray(e.ngRegexps)?[...e.ngRegexps]:[]};return this.notifyObservers(),this.settings}catch(e){return console.error("[SettingsManager] 設定の読み込みに失敗しました",e),this.notify("設定の読み込みに失敗しました","error"),this.settings=q(),this.settings}}getPlaybackSettings(){return ce(this.playbackSettings)}loadPlaybackSettings(){try{const e=j(kt,null);if(!e)return this.playbackSettings=ce(J),this.notifyPlaybackObservers(),this.playbackSettings;if(typeof e=="string"){const n=JSON.parse(e);this.playbackSettings={fixedModeEnabled:typeof n.fixedModeEnabled=="boolean"?n.fixedModeEnabled:J.fixedModeEnabled,fixedRate:typeof n.fixedRate=="number"?n.fixedRate:J.fixedRate};}else this.playbackSettings={fixedModeEnabled:e.fixedModeEnabled,fixedRate:e.fixedRate};return this.notifyPlaybackObservers(),this.playbackSettings}catch(e){return console.error("[SettingsManager] 再生設定の読み込みに失敗しました",e),this.notify("再生設定の読み込みに失敗しました","error"),this.playbackSettings=ce(J),this.notifyPlaybackObservers(),this.playbackSettings}}updatePlaybackSettings(e){return this.playbackSettings={...this.playbackSettings,...e},this.savePlaybackSettings()}savePlaybackSettings(){try{return K(kt,JSON.stringify(this.playbackSettings)),this.notifyPlaybackObservers(),!0}catch(e){return console.error("[SettingsManager] 再生設定の保存に失敗しました",e),this.notify("再生設定の保存に失敗しました","error"),false}}saveSettings(){const e=this.persistSettings();return e&&this.notify("設定を保存しました","success"),e}updateSettings(e){return this.settings={...this.settings,...e,ngWords:e.ngWords?[...e.ngWords]:[...this.settings.ngWords??[]],ngRegexps:e.ngRegexps?[...e.ngRegexps]:[...this.settings.ngRegexps??[]]},this.persistSettings()}persistSettings(){try{return K(Mt,JSON.stringify(this.settings)),this.notifyObservers(),!0}catch(e){return console.error("[SettingsManager] 設定の保存に失敗しました",e),this.notify("設定の保存に失敗しました","error"),false}}addObserver(e){this.observers.add(e);}removeObserver(e){this.observers.delete(e);}addPlaybackObserver(e){this.playbackObservers.add(e);try{e(this.getPlaybackSettings());}catch(n){console.error("[SettingsManager] 再生設定の登録通知でエラー",n);}}removePlaybackObserver(e){this.playbackObservers.delete(e);}notifyObservers(){const e=this.getSettings();for(const n of this.observers)try{n(e);}catch(r){console.error("[SettingsManager] 設定変更通知でエラー",r);}}notifyPlaybackObservers(){const e=this.getPlaybackSettings();for(const n of this.playbackObservers)try{n(e);}catch(r){console.error("[SettingsManager] 再生設定通知でエラー",r);}}loadVideoData(){try{return j(Et,null)??null}catch(e){return console.error("[SettingsManager] 動画データの読み込みに失敗しました",e),this.notify("動画データの読み込みに失敗しました","error"),null}}saveVideoData(e,n){try{const r={videoId:n.videoId,title:n.title,viewCount:n.viewCount,commentCount:n.commentCount,mylistCount:n.mylistCount,postedAt:n.postedAt,thumbnail:n.thumbnail,owner:n.owner??null,channel:n.channel??null};return K(Et,r),this.currentVideo=r,!0}catch(r){return console.error("[SettingsManager] 動画データの保存に失敗しました",r),this.notify("動画データの保存に失敗しました","error"),false}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(e){try{return K(Tt,e),!0}catch(n){return console.error("[SettingsManager] saveLastDanimeIds failed",n),this.notify("ID情報の保存に失敗しました","error"),false}}loadLastDanimeIds(){try{return j(Tt,null)??null}catch(e){return console.error("[SettingsManager] loadLastDanimeIds failed",e),this.notify("ID情報の読込に失敗しました","error"),null}}saveManualSearchSettings(e){try{return K(_t,e),!0}catch(n){return console.error("[SettingsManager] saveManualSearchSettings failed",n),this.notify("検索設定の保存に失敗しました","error"),false}}loadManualSearchSettings(){try{return j(_t,null)??null}catch(e){return console.error("[SettingsManager] loadManualSearchSettings failed",e),this.notify("検索設定の読込に失敗しました","error"),null}}notify(e,n="info"){this.notifier?.show(e,n);}}const Ra=new Set(["INPUT","TEXTAREA"]),we=t=>t.length===1?t.toUpperCase():t,Da=t=>t?`${t}+`:"";class hn{shortcuts=new Map;boundHandler;isEnabled=true;isListening=false;constructor(){this.boundHandler=this.handleKeyDown.bind(this);}addShortcut(e,n,r){const i=this.createShortcutKey(we(e),n);this.shortcuts.set(i,r);}removeShortcut(e,n){const r=this.createShortcutKey(we(e),n);this.shortcuts.delete(r);}startListening(){this.isListening||(document.addEventListener("keydown",this.boundHandler,false),this.isListening=true);}stopListening(){this.isListening&&(document.removeEventListener("keydown",this.boundHandler,false),this.isListening=false);}setEnabled(e){this.isEnabled=e;}createShortcutKey(e,n){return `${Da(n)}${e}`}extractModifier(e){const n=[];return e.ctrlKey&&n.push("Ctrl"),e.altKey&&n.push("Alt"),e.shiftKey&&n.push("Shift"),e.metaKey&&n.push("Meta"),n.length>0?n.join("+"):null}handleKeyDown(e){if(!this.isEnabled)return;const r=e.target?.tagName??"";if(Ra.has(r))return;const i=this.extractModifier(e),s=this.createShortcutKey(we(e.key),i),a=this.shortcuts.get(s);a&&(e.preventDefault(),a());}}const Ha=P("dAnime:CommentRenderer"),Vt=t=>({loggerNamespace:"dAnime:CommentRenderer",...t??{}}),za=t=>{if(!t||typeof t!="object")return  false;const e=t;return typeof e.commentColor=="string"&&typeof e.commentOpacity=="number"&&typeof e.isCommentVisible=="boolean"};class te{renderer;keyboardHandler=null;constructor(e,n){za(e)||e===null?this.renderer=new _(e??null,Vt(n)):this.renderer=new _(Vt(e));}get settings(){return this.renderer.settings}set settings(e){this.renderer.settings=e;}initialize(e){this.renderer.initialize(e),this.setupKeyboardShortcuts();}addComment(e,n,r=[]){return this.renderer.addComment(e,n,r)}clearComments(){this.renderer.clearComments();}resetState(){this.renderer.resetState();}destroy(){this.teardownKeyboardShortcuts(),this.renderer.destroy();}updateSettings(e){this.renderer.settings=e;}getVideoElement(){return this.renderer.getVideoElement()}getCurrentVideoSource(){return this.renderer.getCurrentVideoSource()}getCommentsSnapshot(){return this.renderer.getCommentsSnapshot()}isNGComment(e){return this.renderer.isNGComment(e)}resize(e,n){this.renderer.resize(e,n);}setCommentVisibility(e){this.renderer.setCommentVisibility(e);}setupKeyboardShortcuts(){this.teardownKeyboardShortcuts();const e=new hn;e.addShortcut("C","Shift",()=>{try{const n=!this.renderer.settings.isCommentVisible;this.renderer.setCommentVisibility(n),this.syncGlobalSettings(this.renderer.settings);}catch(n){Ha.error("CommentRenderer.keyboardShortcut",n);}}),e.startListening(),this.keyboardHandler=e;}teardownKeyboardShortcuts(){this.keyboardHandler?.stopListening(),this.keyboardHandler=null;}syncGlobalSettings(e){window.dAniRenderer?.settingsManager?.updateSettings(e);}}class qe{shadowRoot=null;container=null;createShadowDOM(e,n={mode:"closed"}){if(!e)throw new Error("Host element is required for shadow DOM creation");return this.shadowRoot=e.attachShadow(n),this.container=document.createElement("div"),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(e){if(!this.shadowRoot)throw new Error("Shadow root not initialized");const n=document.createElement("style");n.textContent=e,this.shadowRoot.appendChild(n);}querySelector(e){return this.shadowRoot?this.shadowRoot.querySelector(e):null}querySelectorAll(e){return this.shadowRoot?this.shadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}setHTML(e){if(!this.container)throw new Error("Container not initialized");this.container.innerHTML=e;}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null;}}const Oa=`\r
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
`,Na=`:host {
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
`,$a=`:host {\r
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
`;class re{static getCommonStyles(){return Oa}static getNotificationStyles(){return Na}static getAutoButtonStyles(){return $a}}const It={success:"✔",warning:"⚠",error:"✖",info:"ℹ"};class b extends qe{static instance=null;static notifications=[];hostElement=null;initialized=false;static getInstance(){return this.instance||(this.instance=new b),this.instance}static show(e,n="info",r=3e3){try{const i=this.getInstance();return i.initialize(),i.initialized?i.createNotification(e,n,r):null}catch(i){return console.error("[NotificationManager] show failed",i),null}}static removeNotification(e){this.getInstance().removeNotification(e.element);}show(e,n="info"){b.show(e,n);}initialize(){if(!this.initialized)try{this.hostElement=document.createElement("div"),this.hostElement.className="nico-comment-shadow-host notification-host",this.hostElement.style.cssText=["position: fixed","top: 0","right: 0","z-index: 2147483647","pointer-events: none"].join(";"),document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(re.getNotificationStyles()),this.setHTML('<div class="notification-container"></div>'),this.initialized=!0;}catch(e){console.error("[NotificationManager] initialize failed",e),this.initialized=false;}}destroy(){b.notifications.forEach(e=>{e.timerId&&window.clearTimeout(e.timerId);}),b.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=false,b.instance=null;}createNotification(e,n,r){try{const i=this.querySelector(".notification-container");if(!i)throw new Error("Notification container not found");const s=It[n]??It.info,a=document.createElement("div");a.className=`notification-item ${n}`;const o=document.createElement("div");o.className="notification-icon",o.innerHTML=`<span>${s}</span>`,a.appendChild(o);const l=document.createElement("div");l.className="notification-content";const d=document.createElement("div");d.className="notification-type",d.textContent=n.charAt(0).toUpperCase()+n.slice(1),l.appendChild(d);const h=document.createElement("div");if(h.className="notification-message",e.includes("<"))h.innerHTML=e||"No message";else {const p=(e||"No message").split(`
`).map(m=>m.trim()).filter(m=>m.length>0).join("<br>");h.innerHTML=p;}l.appendChild(h),a.appendChild(l);const c=document.createElement("button");c.className="notification-close",c.innerHTML="&times;",c.addEventListener("click",()=>{this.removeNotification(a);}),a.appendChild(c),i.appendChild(a),requestAnimationFrame(()=>{a.classList.add("show");});const u={element:a,timerId:window.setTimeout(()=>{this.removeNotification(a);},r)};return b.notifications.push(u),u}catch(i){return console.error("[NotificationManager] createNotification failed",i),null}}removeNotification(e){if(!e)return;const n=b.notifications.find(r=>r.element===e);n?.timerId&&window.clearTimeout(n.timerId),e.classList.remove("show"),window.setTimeout(()=>{try{e.remove(),b.notifications=b.notifications.filter(r=>r.element!==e);}catch(r){console.error("[NotificationManager] removeNotification cleanup failed",r);}},500);}}const un="https://www.nicovideo.jp",pn=`${un}/search`,mn=`${un}/watch`,At={searchBase:pn,watchBase:mn},Wa=t=>`${mn}/${t}`,gn=t=>`${pn}/${encodeURIComponent(t)}`,ke=t=>new Promise((e,n)=>{Pa({url:t.url,method:t.method??"GET",headers:t.headers,data:t.data,responseType:t.responseType??"text",timeout:t.timeout,onprogress:t.onprogress,onload:r=>{e({status:r.status,statusText:r.statusText,response:r.response,finalUrl:r.finalUrl,headers:r.responseHeaders});},onerror:r=>{const i=r?.error??"unknown error";n(new Error(`GM_xmlhttpRequest failed: ${i}`));},ontimeout:()=>{n(new Error("GM_xmlhttpRequest timeout"));}});}),Se=P("dAnime:NicoApiFetcher");class X{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(e){try{const n=this.sanitizeVideoId(e),i=(await ke({method:"GET",url:Wa(n),headers:{Accept:"text/html"}})).response,o=new DOMParser().parseFromString(i,"text/html").querySelector('meta[name="server-response"]');if(!o)throw new Error("API data element not found in response");const l=o.getAttribute("content");if(!l)throw new Error("API data content is empty");const d=this.decodeServerResponse(l),c=JSON.parse(d).data?.response;if(!c)throw new Error("Invalid API data structure");return this.apiData=c,c}catch(n){throw Se.error("NicoApiFetcher.fetchApiData",n),n}}async fetchComments(){try{if(!this.apiData)throw new Error("API data must be fetched first");const e=this.apiData.comment?.nvComment;if(!e?.server||!e.params||!e.threadKey)throw new Error("Required comment server data is missing");const n=await ke({method:"POST",url:`${e.server}/v1/threads`,headers:{"Content-Type":"application/json","x-client-os-type":"others","X-Frontend-Id":"6","X-Frontend-Version":"0"},data:JSON.stringify({params:e.params,threadKey:e.threadKey,additionals:{}})}),s=(JSON.parse(n.response).data?.threads??[]).filter(o=>o.fork==="main").sort((o,l)=>(l.commentCount||0)-(o.commentCount||0))[0];if(!s)throw new Error("Main thread not found in comment response");const a=(s.comments??[]).map(o=>({text:o.body??"",vposMs:o.vposMs??0,commands:o.commands??[]}));return this.comments=a,a}catch(e){throw Se.error("NicoApiFetcher.fetchComments",e),e}}async fetchAllData(e){return await this.fetchApiData(e),this.fetchComments()}sanitizeVideoId(e){try{let n=encodeURIComponent(e);return n=n.replace(/%([0-9A-F]{2})/gi,(r,i)=>{const s=parseInt(i,16);return s>=65&&s<=90||s>=97&&s<=122||s>=48&&s<=57||s===45||s===95||s===46||s===126?String.fromCharCode(s):r}),n}catch(n){return Se.error("NicoApiFetcher.sanitizeVideoId",n,{videoId:e}),e}}decodeServerResponse(e){try{return decodeURIComponent(e)}catch(n){try{const r=e.replace(/%(?![0-9A-F]{2})/gi,"%25");return decodeURIComponent(r)}catch{throw new Error(`API data decode failed: ${n.message}`)}}}}const Lt=P("dAnime:NicoVideoSearcher"),Ba="dアニメストア ニコニコ支店";class R{cache=new Map;static isOfficialVideo(e,n){const r=e.owner?.nickname??e.owner?.name??e.channel?.name??"";return !!(r===Ba||r===n||r.startsWith(n+" "))}static filterOfficialVideos(e,n){return e.filter(r=>R.isOfficialVideo(r,n))}async search(e){if(!e.trim())return [];if(this.cache.has(e))return this.cache.get(e)??[];const n=gn(e),r=await this.fetchText(n),i=this.parseServerContext(r).map(o=>{const l=this.calculateLevenshteinDistance(e,o.title),d=Math.max(e.length,o.title.length),h=d>0?(1-l/d)*100:0;return {...o,levenshteinDistance:l,similarity:h}}),s=[],a=new Set;for(const o of i)o?.videoId&&(a.has(o.videoId)||(a.add(o.videoId),s.push(o)));return s.sort((o,l)=>{if(o.commentCount!==l.commentCount)return l.commentCount-o.commentCount;const d=o.similarity??-1,h=l.similarity??-1;return d!==h?h-d:l.viewCount-o.viewCount}),this.cache.set(e,s),s}async fetchText(e){return (await ke({method:"GET",url:e})).response}parseServerContext(e){try{const r=new DOMParser().parseFromString(e,"text/html").querySelector('meta[name="server-response"]');if(!r)return [];const i=r.getAttribute("content")??"",s=this.decodeHtmlEntities(i);let a;try{a=JSON.parse(s);}catch(o){return Lt.error("NicoVideoSearcher.parseServerContext",o),[]}return this.extractVideoItems(a??{})}catch(n){return Lt.error("NicoVideoSearcher.parseServerContext",n),[]}}decodeHtmlEntities(e){if(!e)return "";let n=e.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return n=n.replace(/&#(\d+);/g,(r,i)=>String.fromCharCode(parseInt(i,10))),n=n.replace(/&#x([0-9a-fA-F]+);/g,(r,i)=>String.fromCharCode(parseInt(i,16))),n}extractVideoItems(e){const n=[],r=s=>{const a=(s?.id??s?.contentId??s?.watchId??"").toString();if(!a)return;const o=(s?.title??s?.shortTitle??"").toString(),l=s?.count??{},d=Number(l.view??s?.viewCounter??0)||0,h=Number(l.comment??s?.commentCounter??0)||0,c=Number(l.mylist??s?.mylistCounter??0)||0,u=s?.thumbnail??{},p=(u.nHdUrl||u.listingUrl||u.largeUrl||u.middleUrl||u.url||s?.thumbnailUrl||"").toString(),m=(s?.registeredAt||s?.startTime||s?.postedDateTime||"")?.toString?.()??"",x=s?.owner&&typeof s.owner=="object"?{nickname:(s.owner.nickname??s.owner.name??"")||void 0,name:(s.owner.name??s.owner.nickname??"")||void 0}:null,y=(s?.isChannelVideo||s?.owner?.ownerType==="channel")&&s?.owner?{name:s.owner.name??""}:null;o&&n.push({videoId:a,title:o,viewCount:d,commentCount:h,mylistCount:c,thumbnail:p,postedAt:m,owner:x,channel:y});},i=s=>{if(!s)return;if(Array.isArray(s)){s.forEach(i);return}if(typeof s!="object"||s===null)return;const a=s;(a.id||a.contentId||a.watchId)&&r(a),Object.values(s).forEach(i);};return i(e),n}calculateLevenshteinDistance(e,n){const r=e?e.length:0,i=n?n.length:0;if(r===0)return i;if(i===0)return r;const s=new Array(i+1);for(let o=0;o<=i;++o){const l=s[o]=new Array(r+1);l[0]=o;}const a=s[0];for(let o=1;o<=r;++o)a[o]=o;for(let o=1;o<=i;++o)for(let l=1;l<=r;++l){const d=e[l-1]===n[o-1]?0:1;s[o][l]=Math.min(s[o-1][l]+1,s[o][l-1]+1,s[o-1][l-1]+d);}return s[i][r]}}const E={mypageHeaderTitle:".p-mypageHeader__title",mypageListContainer:".p-mypageMain",watchVideoElement:"video#video",mypageItem:".itemModule.list",mypageItemTitle:".line1",mypageEpisodeNumber:".number.line1 span",mypageEpisodeTitle:".episode.line1 span",watchPageAnimeTitle:".backInfoTxt1",watchPageEpisodeNumber:".backInfoTxt2",watchPageEpisodeTitle:".backInfoTxt3",watchSettingButton:".setting.mainButton",watchButtonArea:".buttonArea"};class Ye{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(e){this.delay=e;}getFuncId(e){return this.funcIds.has(e)||this.funcIds.set(e,this.nextId++),this.funcIds.get(e)??0}exec(e){const n=this.getFuncId(e),r=Date.now(),i=this.timers.get(n)?.lastExec??0,s=r-i;if(s>this.delay)e(),this.timers.set(n,{lastExec:r});else {clearTimeout(this.timers.get(n)?.timerId??void 0);const a=setTimeout(()=>{e(),this.timers.set(n,{lastExec:Date.now()});},this.delay-s);this.timers.set(n,{timerId:a,lastExec:i});}}execOnce(e){const n=this.getFuncId(e),r=this.timers.get(n);if(r?.executedOnce){r.timerId&&clearTimeout(r.timerId);return}r?.timerId&&clearTimeout(r.timerId);const i=setTimeout(()=>{try{e();}finally{this.timers.set(n,{executedOnce:true,lastExec:Date.now(),timerId:null});}},this.delay);this.timers.set(n,{timerId:i,executedOnce:false,scheduled:true});}cancel(e){const n=this.getFuncId(e),r=this.timers.get(n);r?.timerId&&clearTimeout(r.timerId),this.timers.delete(n);}resetExecution(e){const n=this.getFuncId(e),r=this.timers.get(n);r&&(r.timerId&&clearTimeout(r.timerId),this.timers.set(n,{executedOnce:false,scheduled:false}));}clearAll(){for(const[,e]of this.timers)e.timerId&&clearTimeout(e.timerId);this.timers.clear(),this.funcIds.clear();}}const I=P("dAnime:VideoEventLogger");class fn{constructor(e=""){this.prefix=e;}video=null;lastCurrentTime=0;eventListeners=new Map;isEnabled=true;TRACKED_EVENTS=["loadstart","loadedmetadata","loadeddata","canplay","canplaythrough","play","playing","pause","seeking","seeked","timeupdate","ended","emptied","stalled","suspend","waiting","error","abort"];enable(){this.isEnabled=true,I.info(`${this.prefix}:enabled`);}disable(){this.isEnabled=false,I.info(`${this.prefix}:disabled`);}attach(e){this.detach(),this.video=e,this.lastCurrentTime=e.currentTime,I.info(`${this.prefix}:attach`,{src:this.getVideoSource(e),duration:e.duration,currentTime:e.currentTime,readyState:e.readyState}),this.TRACKED_EVENTS.forEach(n=>{const r=()=>{this.handleEvent(n);};this.eventListeners.set(n,r),e.addEventListener(n,r);}),this.setupCurrentTimeWatcher();}detach(){this.video&&(this.eventListeners.forEach((e,n)=>{this.video?.removeEventListener(n,e);}),this.eventListeners.clear(),I.info(`${this.prefix}:detach`,{src:this.getVideoSource(this.video),finalTime:this.video.currentTime}),this.video=null);}handleEvent(e){if(!this.isEnabled||!this.video)return;const n=this.video,r={event:e,currentTime:n.currentTime,duration:n.duration,readyState:n.readyState,paused:n.paused,ended:n.ended,src:this.getVideoSource(n),networkState:n.networkState,timestamp:Date.now()},i=Math.abs(n.currentTime-this.lastCurrentTime);if(e==="timeupdate"){i>.1&&(this.lastCurrentTime=n.currentTime);return}switch(i>.1?(I.info(`${this.prefix}:event:${e}`,{...r,timeDiff:i.toFixed(2),direction:n.currentTime>this.lastCurrentTime?"forward":"backward"}),this.lastCurrentTime=n.currentTime):I.debug(`${this.prefix}:event:${e}`,r),e){case "error":I.error(`${this.prefix}:videoError`,new Error("Video error detected"),{errorCode:n.error?.code??null,errorMessage:n.error?.message??null,...r});break;case "ended":I.warn(`${this.prefix}:videoEnded`,{...r,message:"動画再生が終了しました"});break;case "emptied":I.warn(`${this.prefix}:videoEmptied`,{...r,message:"動画要素が空になりました（src変更の可能性）"});break;case "seeking":I.warn(`${this.prefix}:seeking`,{...r,from:this.lastCurrentTime,to:n.currentTime,diff:(n.currentTime-this.lastCurrentTime).toFixed(2)});break}}setupCurrentTimeWatcher(){if(!Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,"currentTime")?.set){I.warn(`${this.prefix}:currentTimeWatcher:unsupported`);return}I.debug(`${this.prefix}:currentTimeWatcher:setup`);}logManualSeek(e,n,r){this.isEnabled&&I.warn(`${this.prefix}:manualSeek`,{from:e.toFixed(2),to:n.toFixed(2),diff:(n-e).toFixed(2),reason:r,stackTrace:new Error().stack});}getVideoSource(e){const n=typeof e.currentSrc=="string"?e.currentSrc:"";if(n.length>0)return n.length>100?`${n.slice(0,100)}...`:n;const r=e.getAttribute("src")??"";return r.length>0?r.length>100?`${r.slice(0,100)}...`:r:null}}let Ce=null;function Pt(){return Ce||(Ce=new fn("global")),Ce}const qa=1e3,Ya=100,Ua=30,Ft=1e4,Rt=100,Ga=/watch\/(?:([a-z]{2}))?(\d+)/gi,w=P("dAnime:VideoSwitchHandler"),Dt=t=>{if(!t?.video)return null;const e=t.video.registeredAt,n=e?new Date(e).toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):void 0;return {videoId:t.video.id,title:t.video.title,viewCount:t.video.count?.view,mylistCount:t.video.count?.mylist,commentCount:t.video.count?.comment,postedAt:n,thumbnail:t.video.thumbnail?.url,owner:t.owner??null,channel:t.channel??null}},ja=t=>{const e=[];let n;for(;(n=Ga.exec(t))!==null;){const[,r="",i=""]=n;i&&e.push(`${r}${i}`);}return e};class _e{constructor(e,n,r,i=qa,s=Ya){this.renderer=e,this.fetcher=n,this.settingsManager=r,this.monitorInterval=i,this.debounce=new Ye(s),this.videoEventLogger=new fn("VideoSwitchHandler");}nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=false;debounce;videoEventLogger;resetVideoSource(){w.info("videoSwitch:resetVideoSource",{previousSource:this.lastVideoSource,previousLastPreloadedCount:this.lastPreloadedComments?.length??0,previousPreloadedCount:this.preloadedComments?.length??0,previousNextVideoId:this.nextVideoId}),this.lastVideoSource=null,this.lastPreloadedComments=null,this.preloadedComments=null,this.nextVideoId=null;}updateRenderer(e){w.info("videoSwitch:updateRenderer",{oldRendererExists:!!this.renderer,newRendererExists:!!e}),this.renderer=e;}startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd();},this.monitorInterval);}stopMonitoring(){this.checkIntervalId&&(window.clearInterval(this.checkIntervalId),this.checkIntervalId=null);}async onVideoSwitch(e){if(this.isSwitching){w.warn("videoSwitch:alreadySwitching",{timestamp:Date.now()});return}this.isSwitching=true;try{w.warn("videoSwitch:entry",{videoElementProvided:!!e,currentRendererComments:this.renderer.getCommentsSnapshot().length,lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId,lastVideoSource:this.lastVideoSource,rendererVideoElement:this.renderer.getVideoElement()?"attached":"detached",rendererVideoSrc:this.renderer.getCurrentVideoSource(),sampleCurrentComments:this.renderer.getCommentsSnapshot().slice(0,3).map(h=>({text:h.text?.substring(0,30),vposMs:h.vposMs}))});const n=await this.resolveVideoElement(e)??null,r=this.preloadedComments??this.lastPreloadedComments??null,i=n?.dataset?.videoId??n?.getAttribute?.("data-video-id")??null,s=this.nextVideoId??i??this.lastVideoId;if(w.warn("videoSwitch:videoIdResolution",{videoId:s??null,nextVideoId:this.nextVideoId,elementId:i,lastVideoId:this.lastVideoId,hasBackupPreloaded:!!r,backupPreloadedCount:r?.length??0}),!n||!s&&!r){w.warn("videoSwitch:earlyReturn",{reason:n?"no videoId and no backup":"no video element",hasVideoElement:!!n,hasVideoId:!!s,hasBackupPreloaded:!!r}),this.handleMissingVideoInfo(r);return}w.warn("videoSwitch:start",{videoId:s??null,elementVideoId:n.dataset?.videoId??null,preloadedCount:r?.length??0,currentTime:n.currentTime,duration:n.duration,readyState:n.readyState,currentSrc:n.currentSrc,lastVideoSource:this.lastVideoSource}),b.show("動画の切り替わりを検知しました...","info"),this.videoEventLogger.attach(n),this.resetRendererState(n);const a=this.renderer.getVideoElement();if(a!==n&&n)w.debug("videoSwitch:rebind",{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof n.currentSrc=="string"&&n.currentSrc.length>0?n.currentSrc:n.getAttribute("src")??null}),this.renderer.initialize(n);else if(a===n&&n&&this.hasVideoSourceChanged(n))w.debug("videoSwitch:rebind:sameElement",{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(n)}),this.renderer.clearComments(),this.renderer.destroy(),this.renderer.initialize(n);else if(!a&&!n){w.warn("videoSwitch:missingVideoElement",{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let o=null;s&&(o=await this.fetchVideoApiData(s,r),o&&(this.persistVideoMetadata(o),this.lastVideoId=s));const l=await this.populateComments(s,r);l===0?(this.renderer.clearComments(),b.show("コメントを取得できませんでした","warning"),w.warn("videoSwitch:commentsMissing",{videoId:s??null})):w.warn("videoSwitch:commentsLoaded",{videoId:s??null,count:l}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(n);const d=this.renderer.getCommentsSnapshot();if(w.warn("videoSwitch:complete",{videoId:s??null,finalTime:n.currentTime,loadedCount:l,finalCommentsCount:d.length,rendererVideoSrc:this.renderer.getCurrentVideoSource(),sampleFinalComments:d.slice(0,5).map(h=>({text:h.text?.substring(0,30),vposMs:h.vposMs,vposSec:(h.vposMs/1e3).toFixed(2)}))}),o){const h=Dt(o);if(h){const c=`コメントソースを更新しました: ${h.title??"不明なタイトル"}（${l}件）`;b.show(c,l>0?"success":"warning");}}}catch(n){w.error("videoSwitch:error",n,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),b.show(`動画切り替えエラー: ${n.message}`,"error"),this.renderer.clearComments();}finally{this.isSwitching=false;}}async resolveVideoElement(e){if(e){const i=this.getVideoSource(e),s=this.lastVideoSource;return (!i||i===s)&&await this.waitForSourceChange(e),e}const n=Date.now()+Ft;let r=null;for(;Date.now()<n;){const i=document.querySelector(E.watchVideoElement);if(i){r=i;const s=this.hasVideoSourceChanged(i);if(i.readyState>=2||!i.paused||s)return s&&(this.lastVideoSource=null),i}await new Promise(s=>window.setTimeout(s,Rt));}return r}async waitForSourceChange(e){const n=this.getVideoSource(e);if(!n)return;const r=Date.now()+Ft;for(;Date.now()<r;){const i=this.getVideoSource(e);if(i&&i!==n){this.lastVideoSource=null;return}await new Promise(s=>window.setTimeout(s,Rt));}}hasVideoSourceChanged(e){const n=this.getVideoSource(e);return n?this.lastVideoSource?this.lastVideoSource!==n:true:false}getVideoSource(e){if(!e)return null;const n=typeof e.currentSrc=="string"?e.currentSrc:"";if(n.length>0)return n;const r=e.getAttribute("src")??"";if(r.length>0)return r;const i=e.querySelector("source[src]");return i&&typeof i.src=="string"&&i.src.length>0?i.src:null}resetRendererState(e){const n=e.currentTime,r=this.getVideoSource(e),i=this.lastVideoSource!==r,s=this.renderer.getCommentsSnapshot().length;if(w.warn("videoSwitch:resetRendererState:before",{currentTime:n,duration:e.duration,src:r,lastSrc:this.lastVideoSource??null,sourceChanged:i,readyState:e.readyState,paused:e.paused,commentsCount:s}),i)try{this.videoEventLogger.logManualSeek(n,0,"resetRendererState: video source changed"),e.currentTime=0,w.warn("videoSwitch:resetRendererState:seeked",{currentTime:e.currentTime,timeDiff:e.currentTime-n});}catch(a){w.debug("videoSwitch:resetCurrentTimeFailed",a);}else w.warn("videoSwitch:resetRendererState:skipSeek",{reason:"same video source, skipping currentTime reset",currentTime:n,willClearComments:true});w.warn("videoSwitch:resetRendererState:clearingComments",{commentsBeforeClear:s,sourceChanged:i,currentVideoSrc:this.renderer.getCurrentVideoSource()}),this.renderer.clearComments(),w.warn("videoSwitch:resetRendererState:commentsCleared",{commentsAfterClear:this.renderer.getCommentsSnapshot().length,rendererVideoSrc:this.renderer.getCurrentVideoSource()});}async checkVideoEnd(){const e=this.renderer.getVideoElement();if(!(!e||!Number.isFinite(e.duration)||e.duration-e.currentTime>Ua)){if(!this.nextVideoId){const r=async()=>{await this.findNextVideoId();};this.debounce.execOnce(r);}if(this.nextVideoId&&!this.preloadedComments){const r=async()=>{await this.preloadComments();};this.debounce.execOnce(r);}}}handleMissingVideoInfo(e){w.warn("videoSwitch:handleMissingVideoInfo",{hasBackupPreloaded:!!e,backupPreloadedCount:e?.length??0,hasLastPreloadedComments:!!this.lastPreloadedComments,lastPreloadedCount:this.lastPreloadedComments?.length??0,willClearComments:!e&&!this.lastPreloadedComments}),!e&&!this.lastPreloadedComments?(w.warn("videoSwitch:clearingCommentsInMissingInfo",{currentCommentCount:this.renderer.getCommentsSnapshot().length}),this.renderer.clearComments(),b.show("次の動画のコメントを取得できませんでした。コメント表示をクリアします。","warning")):w.info("videoSwitch:preservingComments",{reason:"backup or last preloaded comments available",currentCommentCount:this.renderer.getCommentsSnapshot().length});}async fetchVideoApiData(e,n){try{const r=await this.fetcher.fetchApiData(e);return w.debug("videoSwitch:apiFetched",{videoId:e}),r}catch(r){if(w.error("videoSwitch:apiFetchError",r,{videoId:e}),!n)throw r;return null}}persistVideoMetadata(e){const n=Dt(e);n&&this.settingsManager.saveVideoData(n.title??"",n);}async populateComments(e,n){let r=null;if(w.warn("videoSwitch:populateComments:start",{videoId:e,backupPreloadedCount:n?.length??0,hasBackupPreloaded:!!n}),Array.isArray(n)&&n.length>0)r=n,w.warn("videoSwitch:populateComments:usingBackup",{count:r.length});else if(e)try{w.warn("videoSwitch:populateComments:fetching",{videoId:e}),r=await this.fetcher.fetchAllData(e),w.warn("videoSwitch:commentsFetched",{videoId:e,count:r.length});}catch(s){w.error("videoSwitch:commentsFetchError",s,{videoId:e}),b.show(`コメント取得エラー: ${s.message}`,"error"),r=null;}if(!r||r.length===0)return w.warn("videoSwitch:populateComments:noComments"),0;const i=r.filter(s=>!this.renderer.isNGComment(s.text));return w.warn("videoSwitch:populateComments:addingToRenderer",{filteredCount:i.length,totalCount:r.length,rendererCommentsBeforeAdd:this.renderer.getCommentsSnapshot().length,rendererVideoElement:this.renderer.getVideoElement()?"attached":"detached",rendererVideoSrc:this.renderer.getCurrentVideoSource()}),i.forEach((s,a)=>{this.renderer.addComment(s.text,s.vposMs,s.commands),a<3&&w.warn(`videoSwitch:populateComments:addedComment[${a}]`,{text:s.text.substring(0,30),vposMs:s.vposMs,vposSec:(s.vposMs/1e3).toFixed(2),commands:s.commands});}),w.warn("videoSwitch:populateComments:complete",{addedCount:i.length,rendererCommentsAfterAdd:this.renderer.getCommentsSnapshot().length,rendererVideoSrcAfterAdd:this.renderer.getCurrentVideoSource(),sampleComments:this.renderer.getCommentsSnapshot().slice(0,3).map(s=>({text:s.text?.substring(0,30),vposMs:s.vposMs}))}),this.lastPreloadedComments=[...i],i.length}async findNextVideoId(){try{const e=this.fetcher.lastApiData;if(!e)return;const n=e.series?.video?.next?.id;if(n){this.nextVideoId=n,w.debug("videoSwitch:detectedNext",{videoId:n});return}const r=e.video?.description??"";if(!r)return;const i=ja(r);if(i.length===0)return;const s=[...i].sort((a,o)=>{const l=parseInt(a.replace(/^[a-z]{2}/i,""),10)||0;return (parseInt(o.replace(/^[a-z]{2}/i,""),10)||0)-l});this.nextVideoId=s[0]??null,this.nextVideoId&&w.debug("videoSwitch:candidateFromDescription",{candidate:this.nextVideoId});}catch(e){w.error("videoSwitch:nextIdError",e,{lastVideoId:this.lastVideoId});}}async preloadComments(){if(this.nextVideoId)try{const n=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(r=>!this.renderer.isNGComment(r.text));this.preloadedComments=n.length>0?n:null,w.debug("videoSwitch:preloaded",{videoId:this.nextVideoId,count:n.length});}catch(e){w.error("videoSwitch:preloadError",e,{videoId:this.nextVideoId}),this.preloadedComments=null;}}}const Ka=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`;class bn{static initialize(){La(Ka);}}var Xa="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z",Za="M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z",Ja="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",Qa="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z",eo="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z",to="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z",no="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",ro="M5,4V7H10.5V19H13.5V7H19V4H5Z",io="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",so="M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z",ao="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",oo="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",lo="M8,5.14V19.14L19,12.14L8,5.14Z",co="M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z",ho="M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9",uo="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z",po="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z";function V(t,e=24){const n=String(e),r=String(e);return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${t}"></path></svg>`}const mo=V(lo),go=V(Ja),fo=V(oo),he=V(ao),ie=V(Qa),bo=V(so),Ht=V(ro),Ve=V(Xa),Ie=V(no),Ae=V(to),vo=V(co),yo=V(Za),xo=V(eo),wo=V(uo),So=V(io),Co=V(po),Mo=V(ho),Q=P("dAnime:SettingsUI"),S={searchInput:"#searchInput",searchAnimeTitle:"#searchAnimeTitle",searchEpisodeNumber:"#searchEpisodeNumber",searchEpisodeTitle:"#searchEpisodeTitle",searchButton:"#searchButton",openSearchPage:"#openSearchPageDirect",searchResults:"#searchResults",saveButton:"#saveSettings",autoSearchToggle:"#autoSearchToggle",autoSearchOptionRow:"#autoSearchOptionRow",currentTitle:"#currentTitle",currentVideoId:"#currentVideoId",currentOwner:"#currentOwner",currentViewCount:"#currentViewCount",currentCommentCount:"#currentCommentCount",currentMylistCount:"#currentMylistCount",currentPostedAt:"#currentPostedAt",currentThumbnail:"#currentThumbnail",ngWords:"#ngWords",ngRegexps:"#ngRegexps",showNgWords:"#showNgWords",showNgRegexps:"#showNgRegexp",settingsModal:"#settingsModal",closeSettingsModal:"#closeSettingsModal",modalOverlay:".settings-modal__overlay",modalTabs:".settings-modal__tab",modalPane:".settings-modal__pane",searchModeToggle:"#searchModeToggle",searchStructuredFields:"#searchStructuredFields",searchFreeInputArea:"#searchFreeInputArea"},ee=["search","ng"],zt=`
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
`,Eo=`
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
`;class me extends qe{static FAB_HOST_ID="danime-settings-fab-host";settingsManager;fetcher;searcher;settings;currentVideoInfo;hostElement=null;activeTab="search";modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;fabTooltipEl=null;autoSearchTooltipHtml="";handleFabClick=e=>{e.preventDefault(),this.openSettingsModal();};handleOverlayClick=()=>{this.closeSettingsModal();};handleCloseClick=()=>{this.closeSettingsModal();};constructor(e,n=new X,r=new R){super(),this.settingsManager=e,this.fetcher=n,this.searcher=r,this.settings=this.settingsManager.getSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData();}insertIntoMypage(){const e=document.querySelector(E.mypageHeaderTitle);e&&(this.hostElement=this.createSettingsUI(),e.parentElement?.insertBefore(this.hostElement,e.nextSibling));}addAutoCommentButtons(){document.querySelectorAll(E.mypageItem).forEach(n=>{if(n.dataset.autoFillEnabled==="true")return;const r=n.querySelector(E.mypageItemTitle),i=n.querySelector(E.mypageEpisodeNumber),s=n.querySelector(E.mypageEpisodeTitle);if(!r||!s)return;const a=r.textContent?.trim()??"",o=i?.textContent?.trim()??"",l=s.textContent?.trim()??"";if(!a)return;const d=document.createElement("div");d.style.marginTop="8px",d.style.display="block";const h=d.attachShadow({mode:"open"}),c=document.createElement("style");c.textContent=re.getAutoButtonStyles(),h.appendChild(c);const u=document.createElement("button");u.className="auto-comment-button",u.title="検索フォームにタイトル・話数・エピソードタイトルを入力",u.setAttribute("aria-label","検索フォームにタイトル・話数・エピソードタイトルを入力"),u.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,14H16L18,16V18H20V16L18,14V12H14M10,10H4V12H10M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H11.35C11.14,19.37 11,18.7 11,18A7,7 0 0,1 18,11C19.1,11 20.12,11.29 21,11.78V6M4,6H9.17L11.17,8H20V10H18V10.5C16.55,10.16 15,10.64 14,11.5V10H4M12,14H4V16H11.35C11.63,15.28 12.08,14.63 12.64,14.08L12,14Z" />
        </svg>
        <span style="margin-left: 6px; font-size: 12px; font-weight: 500;">フォーム入力</span>
      `,u.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation(),this.openSettingsModal(false),this.queryModalElement(`${S.modalTabs}[data-tab="search"]`)?.click();const y=this.queryModalElement(S.searchAnimeTitle),f=this.queryModalElement(S.searchEpisodeNumber),v=this.queryModalElement(S.searchEpisodeTitle);y&&(y.value=a),f&&o&&(f.value=o),v&&l&&(v.value=l),y?.focus({preventScroll:true});const M=[a];o&&M.push(o),l&&M.push(l),b.show(`「${M.join(" ")}」を検索フォームに入力しました`,"success");}),h.appendChild(u);const p=s.parentElement;if(p){const m=p.querySelector(".iconContainer");m?p.insertBefore(d,m):p.appendChild(d);}n.dataset.autoFillEnabled="true";});}async waitMypageListStable(){}tryRestoreByDanimeIds(){return  false}createSettingsUI(){const e=document.createElement("div");e.className="nico-comment-shadow-host settings-host",this.createShadowDOM(e),this.addStyles(re.getCommonStyles());const n=this.buildSettingsHtml();return this.setHTML(n),this.applySettingsToUI(),this.addStyles(zt),this.setupEventListeners(),e}buildSettingsHtml(){const e=a=>typeof a=="number"?a.toLocaleString():"-",n=a=>{if(!a)return "-";try{return new Date(a).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"})}catch{return a}},r=this.currentVideoInfo,i=r?.thumbnail??"",s=!!r?.videoId;return `
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="バージョン">${Aa}</span>
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
                  <span class="video-card__id-icon" aria-hidden="true">${bo}</span>
                  <span class="sr-only">動画ID</span>
                  <span id="currentVideoId">${r?.videoId??"未設定"}</span>
                </div>
                <div class="video-card__date" title="投稿日">
                  <span class="video-card__date-icon" aria-hidden="true">${yo}</span>
                  <span class="sr-only">投稿日</span>
                  <span id="currentPostedAt">${n(r?.postedAt)}</span>
                </div>
              </div>

              <!-- 中央: タイトル & 投稿者 -->
              <div class="video-card__main">
                <h3 class="video-card__title" id="currentTitle">${r?.title??"オーバーレイする動画が未設定です"}</h3>
                <div class="video-card__owner" title="投稿者">
                  <span class="video-card__owner-icon" aria-hidden="true">${Ve}</span>
                  <span class="sr-only">投稿者</span>
                  <span id="currentOwner">${r?.owner?.nickname??r?.channel?.name??"-"}</span>
                </div>
              </div>

              <!-- 下部: 統計情報 -->
              <div class="video-card__stats">
                <div class="video-card__stat" title="再生数">
                  <span class="video-card__stat-icon" aria-hidden="true">${Ie}</span>
                  <span class="sr-only">再生数</span>
                  <span class="video-card__stat-value" id="currentViewCount">${e(r?.viewCount)}</span>
                </div>
                <div class="video-card__stat" title="コメント数">
                  <span class="video-card__stat-icon" aria-hidden="true">${Ae}</span>
                  <span class="sr-only">コメント数</span>
                  <span class="video-card__stat-value" id="currentCommentCount">${e(r?.commentCount)}</span>
                </div>
                <div class="video-card__stat" title="マイリスト数">
                  <span class="video-card__stat-icon" aria-hidden="true">${vo}</span>
                  <span class="sr-only">マイリスト数</span>
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
            <h3 id="settingsModalTitle">設定</h3>
            <button id="closeSettingsModal" class="settings-modal__close" type="button" aria-label="設定を閉じる">
              <span aria-hidden="true">${go}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${ie}</span>
              <span class="settings-modal__tab-label">検索</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${he}</span>
              <span class="settings-modal__tab-label">NG</span>
            </button>
          </div>
          <div class="settings-modal__panes">
            <section class="settings-modal__pane is-active" data-pane="search" role="tabpanel" id="settingsPaneSearch" aria-labelledby="settingsTabSearch">
              <div class="setting-group search-section">
                <h3>コメントをオーバーレイする動画を検索</h3>
                <div
                  class="playback-option${this.settings.autoSearchEnabled?" playback-option--active":""}"
                  id="autoSearchOptionRow"
                  role="button"
                  tabindex="0"
                  aria-pressed="${this.settings.autoSearchEnabled?"true":"false"}"
                  style="margin-bottom: 16px;"
                >
                  <div class="playback-option__icon-wrapper${this.settings.autoSearchEnabled?" playback-option__icon-wrapper--active":""}">
                    ${Co}
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
                  <div class="info-badge" id="autoSearchInfoBadge" tabindex="0" aria-label="自動検索についての説明">
                    ${So}
                  </div>
                </div>

                <div class="search-mode-switch">
                  <span class="search-mode-switch__label search-mode-switch__label--active" id="searchModeLabelStructured">詳細入力</span>
                  <label class="search-mode-switch__toggle" aria-label="入力モードを切り替え（詳細入力 / 自由入力）">
                    <input type="checkbox" id="searchModeToggle" class="search-mode-switch__checkbox">
                    <span class="search-mode-switch__track"></span>
                    <span class="search-mode-switch__thumb"></span>
                  </label>
                  <span class="search-mode-switch__label" id="searchModeLabelFree">自由入力</span>
                </div>

                <div class="search-fields" id="searchStructuredFields">
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

                <div class="search-free-input" id="searchFreeInputArea" style="display:none;">
                  <div class="search-field">
                    <label for="searchInput" class="search-field__label">フリーワード検索</label>
                    <input type="text" id="searchInput" class="search-field__input" placeholder="検索キーワードを入力">
                  </div>
                </div>

                <div class="search-container">
                  <button id="searchButton">検索</button>
                  <button id="openSearchPageDirect" class="open-search-page-direct-btn">検索ページ</button>
                  <div class="shield-badge" tabindex="0" aria-label="公式動画セーフガードについて">
                    ${Mo}
                  </div>
                </div>
                <div id="searchResults" class="search-results"></div>
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
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupAutoSearchToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupTooltipBadges();}setupModalControls(){this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick);const e=this.createOrUpdateFab(),n=this.queryModalElement(S.settingsModal),r=this.queryModalElement(S.closeSettingsModal),i=this.queryModalElement(S.modalOverlay);this.modalElement=n??null,this.closeButtonElement=r??null,this.overlayElement=i??null,!(!n||!r||!i||!e)&&(this.fabElement?.removeEventListener("click",this.handleFabClick),e.addEventListener("click",this.handleFabClick),e.setAttribute("aria-controls",n.id),e.setAttribute("aria-haspopup","dialog"),e.setAttribute("aria-expanded","false"),this.fabElement=e,r.addEventListener("click",this.handleCloseClick),i.addEventListener("click",this.handleOverlayClick),this.shadowRoot?.addEventListener("keydown",s=>{const a=s;a.key==="Escape"&&!this.modalElement?.classList.contains("hidden")&&(a.preventDefault(),this.closeSettingsModal());}),this.applySettingsToUI());}setupModalTabs(){const e=Array.from(this.queryModalSelectorAll(S.modalTabs)),n=Array.from(this.queryModalSelectorAll(S.modalPane));if(e.length===0||n.length===0)return;const r=i=>{e.forEach(s=>{const o=this.toModalTabKey(s.dataset.tab)===i;s.classList.toggle("is-active",o),s.setAttribute("aria-selected",String(o)),s.setAttribute("tabindex",o?"0":"-1");}),n.forEach(s=>{const o=this.toModalTabKey(s.dataset.pane)===i;s.classList.toggle("is-active",o),s.setAttribute("aria-hidden",String(!o));}),this.activeTab=i;};e.forEach(i=>{i.addEventListener("click",()=>{const s=this.toModalTabKey(i.dataset.tab);s&&r(s);}),i.addEventListener("keydown",s=>{const a=s;if(a.key!=="ArrowRight"&&a.key!=="ArrowLeft")return;a.preventDefault();const o=this.toModalTabKey(i.dataset.tab);if(!o)return;const l=a.key==="ArrowRight"?1:-1,d=(ee.indexOf(o)+l+ee.length)%ee.length,h=ee[d];r(h),e.find(u=>this.toModalTabKey(u.dataset.tab)===h)?.focus({preventScroll:true});});}),r(this.activeTab);}openSettingsModal(e=true){!this.modalElement||!this.fabElement||(this.modalElement.classList.remove("hidden"),this.modalElement.setAttribute("aria-hidden","false"),this.fabElement.setAttribute("aria-expanded","true"),e&&this.queryModalElement(`${S.modalTabs}.is-active`)?.focus({preventScroll:true}));}closeSettingsModal(){!this.modalElement||!this.fabElement||(this.modalElement.classList.add("hidden"),this.modalElement.setAttribute("aria-hidden","true"),this.fabElement.setAttribute("aria-expanded","false"),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:true}));}toModalTabKey(e){return e&&ee.includes(e)?e:null}setupAutoSearchToggle(){const e=this.queryModalElement(S.autoSearchToggle),n=this.queryModalElement(S.autoSearchOptionRow);if(!e||!n)return;const r=()=>{this.settings.autoSearchEnabled=!this.settings.autoSearchEnabled,this.updateAutoSearchToggleState(),this.updateSearchSectionNote(),this.settingsManager.updateSettings(this.settings),b.show(this.settings.autoSearchEnabled?"自動検索を有効にしました":"自動検索を無効にしました（手動設定モード）","success");};n.addEventListener("click",i=>{i.target.closest(".playback-option__toggle")||r();}),n.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),r());}),e.addEventListener("change",()=>{r();}),this.updateAutoSearchToggleState();}updateAutoSearchToggleState(){const e=this.settings.autoSearchEnabled,n=this.queryModalElement(S.autoSearchToggle),r=this.queryModalElement(S.autoSearchOptionRow),i=r?.querySelector(".playback-option__icon-wrapper");n&&(n.checked=e),r&&(r.classList.toggle("playback-option--active",e),r.setAttribute("aria-pressed",e?"true":"false")),i&&i.classList.toggle("playback-option__icon-wrapper--active",e);}buildAutoSearchTooltipHtml(){return this.settings.autoSearchEnabled?`<strong style="color:#7F5AF0;">自動設定機能が有効です</strong><br>
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
      `,e.appendChild(r);}const n=document.createElement("div");n.className="fab-floating-tooltip",e.appendChild(n),this.fabTooltipEl=n;}showFabTooltip(e,n,r){this.ensureFabTooltip();const i=this.fabTooltipEl;if(!i)return;const s=300,a=8,o=e.getBoundingClientRect();i.innerHTML=n,i.className=`fab-floating-tooltip fab-floating-tooltip--${r}`,i.style.display="block",i.style.width=`${s}px`;let l=o.right-s;l<a&&(l=a),l+s>window.innerWidth-a&&(l=window.innerWidth-s-a),i.style.left=`${l}px`,i.style.top="0px",requestAnimationFrame(()=>{if(i.style.display==="none")return;const d=i.offsetHeight,h=o.top-a,c=window.innerHeight-o.bottom-a;let u;h>=d?u=o.top-d-a:c>=d?u=o.bottom+a:u=Math.max(a,o.top-d-a),i.style.top=`${u}px`;});}hideFabTooltip(){this.fabTooltipEl&&(this.fabTooltipEl.style.display="none");}shieldTooltipHtml="<strong>公式動画セーフガード有効</strong><br>アニメタイトルを入力すると、投稿者名が「アニメタイトル」「アニメタイトル 第Nクール」「dアニメストア ニコニコ支店」の公式動画のみが優先表示されます。エピソード切替時も公式動画のみが自動選択されます。";setupTooltipBadges(){const e=this.queryModalElement("#autoSearchInfoBadge"),n=this.queryModalElement(".shield-badge");e&&(e.addEventListener("mouseenter",()=>{this.showFabTooltip(e,this.autoSearchTooltipHtml,"info");}),e.addEventListener("mouseleave",()=>this.hideFabTooltip()),e.addEventListener("focusin",()=>{this.showFabTooltip(e,this.autoSearchTooltipHtml,"info");}),e.addEventListener("focusout",()=>this.hideFabTooltip())),n&&(n.addEventListener("mouseenter",()=>{this.showFabTooltip(n,this.shieldTooltipHtml,"shield");}),n.addEventListener("mouseleave",()=>this.hideFabTooltip()),n.addEventListener("focusin",()=>{this.showFabTooltip(n,this.shieldTooltipHtml,"shield");}),n.addEventListener("focusout",()=>this.hideFabTooltip()));}setupNgControls(){const e=this.queryModalElement(S.ngWords);e&&e.classList.remove("hidden");const n=this.queryModalElement(S.ngRegexps);n&&n.classList.remove("hidden");}setupSaveButton(){const e=this.queryModalElement(S.saveButton);e&&e.addEventListener("click",()=>this.saveSettings());}setupSearch(){const e=this.queryModalElement(S.searchInput),n=this.queryModalElement(S.searchAnimeTitle),r=this.queryModalElement(S.searchEpisodeNumber),i=this.queryModalElement(S.searchEpisodeTitle),s=this.queryModalElement(S.searchButton),a=this.queryModalElement(S.openSearchPage),o=this.queryModalElement(S.searchModeToggle),l=this.settingsManager.loadManualSearchSettings();l&&(n&&(n.value=l.animeTitle),r&&(r.value=l.episodeNumber),i&&(i.value=l.episodeTitle));const d=()=>{const y=o?.checked??false,f=this.queryModalElement("#searchModeLabelStructured"),v=this.queryModalElement("#searchModeLabelFree");f&&f.classList.toggle("search-mode-switch__label--active",!y),v&&v.classList.toggle("search-mode-switch__label--active",y);},h=()=>{const y=o?.checked??false,f=this.queryModalElement(S.searchStructuredFields),v=this.queryModalElement(S.searchFreeInputArea);f&&(f.style.display=y?"none":""),v&&(v.style.display=y?"":"none"),d();};o?.addEventListener("change",h),h();const c=()=>o?.checked??false,u=()=>{if(c())return e?.value.trim()??"";const y=n?.value.trim()??"",f=r?.value.trim()??"",v=i?.value.trim()??"";return [y,f,v].filter(Boolean).join(" ")},p=()=>{if(c())return;const y=n?.value.trim()??"",f=r?.value.trim()??"",v=i?.value.trim()??"";(y||f)&&this.settingsManager.saveManualSearchSettings({animeTitle:y,episodeNumber:f,episodeTitle:v});},m=async()=>{const y=u();if(!y){b.show("検索キーワードを入力してください","warning");return}p();const f=c()?"":n?.value.trim()??"";await this.executeSearch(y,f);};s?.addEventListener("click",m);const x=y=>{y.key==="Enter"&&m();};e?.addEventListener("keydown",x),n?.addEventListener("keydown",x),r?.addEventListener("keydown",x),i?.addEventListener("keydown",x),a?.addEventListener("click",y=>{y.preventDefault();const f=u(),v=f?gn(f):At.searchBase;Pe().open(v,"_blank","noopener");});}async executeSearch(e,n){try{b.show(`「${e}」を検索中...`,"info");const r=await this.searcher.search(e);let i=r;if(n){const s=R.filterOfficialVideos(r,n);s.length>0?(i=s,Q.info("SettingsUI.executeSearch:officialFiltered",{totalResults:r.length,officialResults:s.length,animeTitle:n})):(Q.warn("SettingsUI.executeSearch:noOfficialVideos",{totalResults:r.length,animeTitle:n}),b.show("公式動画が見つかりませんでした。全ての検索結果を表示しています。","warning"));}return this.renderSearchResults(i,s=>this.renderSearchResultItem(s)),i.length===0&&b.show("検索結果が見つかりませんでした","warning"),i}catch(r){return Q.error("SettingsUI.executeSearch",r),[]}}setSearchKeyword(e){const n=this.queryModalElement(S.searchInput);n&&(n.value=e,n.focus({preventScroll:true}));}renderSearchResults(e,n){const r=this.queryModalElement(S.searchResults);if(!r)return;r.innerHTML=e.map(s=>n(s)).join(""),r.querySelectorAll(".search-result-item").forEach((s,a)=>{s.addEventListener("click",()=>{const l=e[a];this.applySearchResult(l);});const o=s.querySelector(".open-search-page-direct-btn");o&&o.addEventListener("click",l=>{l.stopPropagation();});});}renderSearchResultItem(e){const n=this.formatSearchResultDate(e.postedAt),r=typeof e.similarity=="number"?`
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
              ${mo}
            </span>
            <span>${e.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="コメント">
              ${xo}
            </span>
            <span>${e.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="マイリスト">
              ${wo}
            </span>
            <span>${e.mylistCount.toLocaleString()}</span>
            ${r}
          </div>
          <div class="date">${n}</div>
          <a href="${At.watchBase}/${e.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(e){try{const n=await this.fetcher.fetchApiData(e.videoId);await this.fetcher.fetchComments(),b.show(`「${e.title}」のコメントを設定しました`,"success"),this.updateCurrentVideoInfo(this.buildVideoMetadata(e,n));}catch(n){Q.error("SettingsUI.applySearchResult",n);}}buildVideoMetadata(e,n){return {videoId:e.videoId,title:e.title,viewCount:n.video?.count?.view??e.viewCount,commentCount:n.video?.count?.comment??e.commentCount,mylistCount:n.video?.count?.mylist??e.mylistCount,postedAt:n.video?.registeredAt??e.postedAt,thumbnail:n.video?.thumbnail?.url??e.thumbnail,owner:n.owner??e.owner??void 0,channel:n.channel??e.channel??void 0}}applySettingsToUI(){const e=this.queryModalElement(S.ngWords),n=this.queryModalElement(S.ngRegexps);e&&(e.value=(this.settings.ngWords??[]).join(`
`)),n&&(n.value=(this.settings.ngRegexps??[]).join(`
`)),this.updateAutoSearchToggleState(),this.updateSearchSectionNote();}saveSettings(){const e=this.queryModalElement(S.ngWords),n=this.queryModalElement(S.ngRegexps);e&&(this.settings.ngWords=e.value.split(`
`).map(r=>r.trim()).filter(Boolean)),n&&(this.settings.ngRegexps=n.value.split(`
`).map(r=>r.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings),b.show("設定を保存しました","success");}updateCurrentVideoInfo(e){this.currentVideoInfo=e,[["currentTitle",e.title??"-"],["currentVideoId",e.videoId??"-"],["currentOwner",e.owner?.nickname??e.channel?.name??"-"],["currentViewCount",this.formatNumber(e.viewCount)],["currentCommentCount",this.formatNumber(e.commentCount)],["currentMylistCount",this.formatNumber(e.mylistCount)],["currentPostedAt",this.formatSearchResultDate(e.postedAt)]].forEach(([a,o])=>{const l=this.querySelector(S[a]);l&&(l.textContent=o);});const r=this.querySelector(S.currentThumbnail);r&&e.thumbnail&&(r.src=e.thumbnail,r.alt=e.title??"サムネイル");const i=this.querySelector("#currentVideoAmbient");i&&e.thumbnail&&(i.style.backgroundImage=`url('${e.thumbnail}')`);const s=this.querySelector(".video-card");s&&s.classList.toggle("video-card--empty",!e.videoId);try{this.settingsManager.saveVideoData(e.title??"",e);}catch(a){Q.error("SettingsUI.updateCurrentVideoInfo",a);}}formatNumber(e){return typeof e=="number"?e.toLocaleString():"-"}formatSearchResultDate(e){if(!e)return "-";const n=new Date(e);return Number.isNaN(n.getTime())?e:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(n)}destroy(){this.hideFabTooltip(),this.fabTooltipEl=null,this.closeButtonElement?.removeEventListener("click",this.handleCloseClick),this.overlayElement?.removeEventListener("click",this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),super.destroy();}createOrUpdateFab(){if(!document.body)return null;let e=this.fabHostElement;!e||!e.isConnected?(e?.remove(),e=document.createElement("div"),e.id=me.FAB_HOST_ID,e.style.position="fixed",e.style.bottom="32px",e.style.right="32px",e.style.zIndex="2147483646",e.style.display="inline-block",this.fabShadowRoot=e.attachShadow({mode:"open"}),document.body.appendChild(e),this.fabHostElement=e):this.fabShadowRoot||(this.fabShadowRoot=e.shadowRoot??e.attachShadow({mode:"open"}));const n=this.fabShadowRoot;if(!n)return null;let r=n.querySelector("style[data-role='fab-base-style']");r||(r=document.createElement("style"),r.dataset.role="fab-base-style",r.textContent=re.getCommonStyles(),n.appendChild(r));let i=n.querySelector("style[data-role='fab-style']");i||(i=document.createElement("style"),i.dataset.role="fab-style",i.textContent=`
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
      `,n.appendChild(i));let s=n.querySelector("style[data-role='similarity-style']");s||(s=document.createElement("style"),s.dataset.role="similarity-style",s.textContent=zt,n.appendChild(s));let a=n.querySelector("style[data-role='search-fields-style']");a||(a=document.createElement("style"),a.dataset.role="search-fields-style",a.textContent=Eo,n.appendChild(a));let o=n.querySelector(".fab-container");o||(o=document.createElement("div"),o.className="fab-container",n.appendChild(o));let l=o.querySelector("button.fab-button");l||(l=document.createElement("button"),l.type="button",l.className="fab-button",o.appendChild(l)),l.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${ie}</span>
      <span class="fab-button__label">設定</span>
    `,l.setAttribute("aria-label","ニコニココメント設定を開く"),l.setAttribute("aria-haspopup","dialog");let d=o.querySelector(S.settingsModal);return d||(o.insertAdjacentHTML("beforeend",this.buildModalHtml()),d=o.querySelector(S.settingsModal)),this.modalElement=d??null,l}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener("click",this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null,this.fabTooltipEl=null;}queryModalElement(e){return this.fabShadowRoot?this.fabShadowRoot.querySelector(e):null}queryModalSelectorAll(e){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}}const To=P("dAnime:PlaybackRateController"),ko=1,_o=200,Vo=1e-4;class Le{constructor(e){this.settingsManager=e,this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.settingsObserver=n=>{this.playbackSettings=n,this.applyCurrentMode();},this.settingsManager.addPlaybackObserver(this.settingsObserver);}currentVideo=null;playbackSettings;settingsObserver;isApplying=false;retryTimer=null;handleLoadedMetadata=()=>{this.applyCurrentMode();};handleRateChange=()=>{this.isApplying||this.playbackSettings.fixedModeEnabled&&this.scheduleApply();};handlePlay=()=>{this.applyCurrentMode();};handleEmptied=()=>{this.scheduleApply();};bind(e){if(this.currentVideo===e){this.applyCurrentMode();return}this.detachVideoListeners(),this.cancelScheduledApply(),this.currentVideo=e,this.attachVideoListeners(e),this.applyCurrentMode();}unbind(){this.cancelScheduledApply(),this.detachVideoListeners(),this.currentVideo=null;}dispose(){this.unbind(),this.settingsManager.removePlaybackObserver(this.settingsObserver);}attachVideoListeners(e){e.addEventListener("loadedmetadata",this.handleLoadedMetadata),e.addEventListener("ratechange",this.handleRateChange),e.addEventListener("play",this.handlePlay),e.addEventListener("emptied",this.handleEmptied);}detachVideoListeners(){this.currentVideo&&(this.currentVideo.removeEventListener("loadedmetadata",this.handleLoadedMetadata),this.currentVideo.removeEventListener("ratechange",this.handleRateChange),this.currentVideo.removeEventListener("play",this.handlePlay),this.currentVideo.removeEventListener("emptied",this.handleEmptied));}applyCurrentMode(){const e=this.currentVideo;e&&(this.playbackSettings.fixedModeEnabled?this.setPlaybackRate(e,this.playbackSettings.fixedRate):this.setPlaybackRate(e,ko));}setPlaybackRate(e,n){if(!(!Number.isFinite(n)||n<=0)&&!(Math.abs(e.playbackRate-n)<=Vo)){this.isApplying=true;try{e.playbackRate=n;}catch(r){To.warn("再生速度の設定に失敗しました",r),this.scheduleApply();}finally{window.setTimeout(()=>{this.isApplying=false;},0);}}}scheduleApply(){this.cancelScheduledApply(),this.retryTimer=window.setTimeout(()=>{this.retryTimer=null,this.applyCurrentMode();},_o);}cancelScheduledApply(){this.retryTimer!==null&&(window.clearTimeout(this.retryTimer),this.retryTimer=null);}}const Ot=async()=>{},Io=()=>{const t=Pe();if(!t.dAniRenderer){const e={};t.dAniRenderer={classes:{Comment:an,CommentRenderer:te,NicoApiFetcher:X,NotificationManager:b,StyleManager:bn,SettingsUI:me,NicoVideoSearcher:R,VideoSwitchHandler:_e,SettingsManager:Be,KeyboardShortcutHandler:hn,DebounceExecutor:Ye,ShadowDOMComponent:qe,ShadowStyleManager:re,PlaybackRateController:Le},instances:e,utils:{initialize:Ot,initializeWithVideo:Ot},debug:{showState:()=>{console.log("Current instances:",e);},showSettings:()=>{const n=e.settingsManager;if(!n){console.log("SettingsManager not initialized");return}console.log("Current settings:",n.getSettings());},showComments:()=>{const n=e.renderer;if(!n){console.log("CommentRenderer not initialized");return}console.log("Current comments:",n.getCommentsSnapshot());}},defaultSettings:q};}return t.dAniRenderer},Nt=P("dAnime:PlayerControlButton"),$t="danime-pcb-host",Ao=100,Lo=150;class Po{constructor(e){this.settingsManager=e;}btnWrapper=null;panelShadowRoot=null;isOpen=false;mountRetryTimer=null;mouseHideTimer=null;settingsObserver=null;playbackObserver=null;mount(){if(document.getElementById($t))return;const e=document.querySelector(E.watchSettingButton);if(!e){this.mountRetryTimer=window.setTimeout(()=>{this.mount();},Ao);return}this.injectButton(e),Nt.info("playerControlButton:mounted");}destroy(){this.mountRetryTimer!==null&&(window.clearTimeout(this.mountRetryTimer),this.mountRetryTimer=null),this.cancelHideTimer(),this.settingsObserver&&(this.settingsManager.removeObserver(this.settingsObserver),this.settingsObserver=null),this.playbackObserver&&(this.settingsManager.removePlaybackObserver(this.playbackObserver),this.playbackObserver=null),this.closePanel(),this.btnWrapper?.remove(),this.btnWrapper=null,this.panelShadowRoot=null,Nt.info("playerControlButton:destroyed");}injectButton(e){const n=document.createElement("div");n.id=$t,n.className="mainButton",n.style.cssText="position:relative;z-index:500;cursor:pointer";const r=document.createElement("button");r.type="button",r.title="コメント設定",r.setAttribute("aria-label","コメント設定パネル"),r.setAttribute("aria-expanded","false"),r.style.cssText=["width:100%","height:100%","background:transparent","border:none","cursor:pointer","padding:0","display:flex","align-items:center","justify-content:center","color:#ffffff"].join(";"),r.innerHTML=fo;const i=document.createElement("div"),s=i.attachShadow({mode:"open"});this.panelShadowRoot=s,n.appendChild(r),n.appendChild(i),e.insertAdjacentElement("beforebegin",n),this.btnWrapper=n,this.buildPanel(s),n.addEventListener("mouseenter",()=>{this.cancelHideTimer(),this.openPanel();}),n.addEventListener("mouseleave",()=>{this.scheduleHide();}),this.registerObservers();}buildPanel(e){const n=this.settingsManager.getSettings(),r=this.settingsManager.getPlaybackSettings(),i=document.createElement("style");i.textContent=this.getPanelCSS(),e.appendChild(i);const s=document.createElement("div");s.className="panel",s.setAttribute("hidden",""),s.setAttribute("role","dialog"),s.setAttribute("aria-label","コメント設定"),s.innerHTML=this.buildPanelHTML(n,r),e.appendChild(s),s.addEventListener("mouseenter",()=>{this.cancelHideTimer();}),s.addEventListener("mouseleave",()=>{this.scheduleHide();}),this.bindPanelEvents(e);}getPanelCSS(){return `
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
    `}buildPanelHTML(e,n){const r=e.isCommentVisible?ie:he,i=Math.round((e.commentOpacity??1)*100),s=n.fixedRate.toFixed(2),a=n.fixedModeEnabled?"":"disabled";return `
      <p class="panel__title">コメント設定</p>

      <div class="row">
        <span class="row__label">
          <span id="pcb-vis-icon">${r}</span>コメント表示
        </span>
        <label class="toggle" aria-label="コメント表示切替">
          <input type="checkbox" id="pcb-visibility" ${e.isCommentVisible?"checked":""}>
          <span class="toggle__track"></span>
          <span class="toggle__thumb"></span>
        </label>
      </div>

      <div class="row">
        <span class="row__label">カラー</span>
        <input type="color" id="pcb-color" class="color-picker"
               value="${e.commentColor}" title="コメントカラー">
      </div>

      <div class="row row--stacked">
        <span class="row__label">不透明度</span>
        <div class="slider-wrap">
          <input type="range" id="pcb-opacity" class="slider"
                 min="0.1" max="1" step="0.05" value="${e.commentOpacity??1}">
          <span class="slider__value" id="pcb-opacity-val">${i}%</span>
        </div>
      </div>

      <p class="section-title">再生速度</p>

      <div class="row">
        <span class="row__label">速度固定</span>
        <label class="toggle" aria-label="再生速度固定ON/OFF">
          <input type="checkbox" id="pcb-speed-mode" ${n.fixedModeEnabled?"checked":""}>
          <span class="toggle__track"></span>
          <span class="toggle__thumb"></span>
        </label>
      </div>

      <div class="speed-range-row">
        <div class="slider-wrap">
          <input type="range" id="pcb-speed-range" class="slider"
                 min="1.0" max="1.5" step="0.01" value="${s}" ${a}>
          <span class="slider__value" id="pcb-speed-val">${s}×</span>
        </div>
      </div>
    `}bindPanelEvents(e){const n=e.getElementById("pcb-visibility");n?.addEventListener("change",()=>{const d=e.getElementById("pcb-vis-icon");d&&(d.innerHTML=n.checked?ie:he),this.settingsManager.updateSettings({isCommentVisible:n.checked});});const r=e.getElementById("pcb-color");r?.addEventListener("input",()=>{this.settingsManager.updateSettings({commentColor:r.value});});const i=e.getElementById("pcb-opacity"),s=e.getElementById("pcb-opacity-val");i?.addEventListener("input",()=>{const d=parseFloat(i.value);s&&(s.textContent=`${Math.round(d*100)}%`),this.settingsManager.updateSettings({commentOpacity:d});});const a=e.getElementById("pcb-speed-mode"),o=e.getElementById("pcb-speed-range"),l=e.getElementById("pcb-speed-val");a?.addEventListener("change",()=>{o&&(o.disabled=!a.checked),this.settingsManager.updatePlaybackSettings({fixedModeEnabled:a.checked});}),o?.addEventListener("input",()=>{const d=parseFloat(o.value);l&&(l.textContent=`${d.toFixed(2)}×`),this.settingsManager.updatePlaybackSettings({fixedRate:d});});}openPanel(){if(this.isOpen)return;const e=this.panelShadowRoot?.querySelector(".panel"),n=this.btnWrapper?.querySelector("button");e&&(e.removeAttribute("hidden"),n?.setAttribute("aria-expanded","true"),this.isOpen=true);}closePanel(){const e=this.panelShadowRoot?.querySelector(".panel"),n=this.btnWrapper?.querySelector("button");e?.setAttribute("hidden",""),n?.setAttribute("aria-expanded","false"),this.isOpen=false;}scheduleHide(){this.cancelHideTimer(),this.mouseHideTimer=window.setTimeout(()=>{this.closePanel();},Lo);}cancelHideTimer(){this.mouseHideTimer!==null&&(window.clearTimeout(this.mouseHideTimer),this.mouseHideTimer=null);}registerObservers(){this.settingsObserver=e=>{this.syncSettingsToPanel(e);},this.settingsManager.addObserver(this.settingsObserver),this.playbackObserver=e=>{this.syncPlaybackToPanel(e);},this.settingsManager.addPlaybackObserver(this.playbackObserver);}syncSettingsToPanel(e){const n=this.panelShadowRoot;if(!n)return;const r=n.getElementById("pcb-visibility");r&&(r.checked=e.isCommentVisible);const i=n.getElementById("pcb-vis-icon");i&&(i.innerHTML=e.isCommentVisible?ie:he);const s=n.getElementById("pcb-color");s&&(s.value=e.commentColor);const a=n.getElementById("pcb-opacity"),o=n.getElementById("pcb-opacity-val");a&&(a.value=String(e.commentOpacity??1)),o&&(o.textContent=`${Math.round((e.commentOpacity??1)*100)}%`);}syncPlaybackToPanel(e){const n=this.panelShadowRoot;if(!n)return;const r=n.getElementById("pcb-speed-mode");r&&(r.checked=e.fixedModeEnabled);const i=n.getElementById("pcb-speed-range");i&&(i.disabled=!e.fixedModeEnabled,i.value=e.fixedRate.toFixed(2));const s=n.getElementById("pcb-speed-val");s&&(s.textContent=`${e.fixedRate.toFixed(2)}×`);}}const Fo=100,Ro=1e3,Wt=3e3,Do=2e3,Bt="cachedAnimeTitle",g=P("dAnime:WatchPageController");class Ho{constructor(e){this.global=e;try{this.cachedAnimeTitle=j(Bt,null),this.cachedAnimeTitle&&g.info("watchPageController:constructor:loadedCachedTitle",{cachedAnimeTitle:this.cachedAnimeTitle});}catch(n){g.error("watchPageController:constructor:loadCacheFailed",n),this.cachedAnimeTitle=null;}}initialized=false;switchDebounce=new Ye(Ro);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;playbackRateController=null;playerControlButton=null;lastPartId=null;partIdMonitorIntervalId=null;isPartIdChanging=false;cachedAnimeTitle=null;lastEpisodeNumber=null;rendererSettingsObserver=null;async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement();}async ensureDocumentReady(){document.readyState!=="complete"&&await new Promise(e=>{window.addEventListener("load",()=>e(),{once:true});});}waitForVideoElement(){if(this.initialized)return;const e=document.querySelector(E.watchVideoElement);if(!e){window.setTimeout(()=>this.waitForVideoElement(),Fo);return}if(e.readyState===0){e.addEventListener("loadedmetadata",()=>{this.initializeWithVideo(e);},{once:true});return}this.initializeWithVideo(e);}async initializeWithVideo(e){if(!this.initialized){this.initialized=true;try{b.show("コメントローダーを初期化中...");const n=b.getInstance(),r=this.global.settingsManager??new Be(n);this.global.settingsManager=r,this.global.instances.settingsManager=r,this.playerControlButton||(this.playerControlButton=new Po(r),this.playerControlButton.mount());const i=r.loadSettings();if(!i.isCommentVisible){g.info("watchPageController:initializeWithVideo:skipDueToVisibility",{isCommentVisible:i.isCommentVisible}),b.show("コメントは非表示に設定されています。設定を変更するにはフローティングボタンをクリックしてください。","info");return}if(!i.autoSearchEnabled){g.info("watchPageController:initializeWithVideo:manualMode",{autoSearchEnabled:i.autoSearchEnabled});const p=r.loadVideoData();if(!p?.videoId){b.show("手動設定モードです。フローティングボタンから検索タブを開いて動画を選択してください。","info");return}g.info("watchPageController:initializeWithVideo:manualMode:loadSavedVideo",{videoId:p.videoId,title:p.title}),await this.loadCommentsFromSavedVideo(e,r,p);return}if(await this.waitForMetadataElements(),!await this.autoSetupComments(r))throw new Error("視聴ページからの自動取得に失敗しました。メタデータが取得できませんでした。");const a=r.loadVideoData();if(!a?.videoId)throw new Error("動画データが見つかりません。");const o=new X;this.global.instances.fetcher=o,await o.fetchApiData(a.videoId);const l=await o.fetchComments(),d=this.mergeSettings(r.loadSettings()),h=new te(d);h.initialize(e),this.global.instances.renderer=h,this.currentVideoElement=e;const c=this.playbackRateController??new Le(r);this.playbackRateController=c,this.global.instances.playbackRateController=c,c.bind(e),this.ensureRendererSettingsObserver(r),this.applyRendererSettings(r.loadSettings()),l.forEach(p=>{h.addComment(p.text,p.vposMs,p.commands);});const u=new _e(h,o,r);u.startMonitoring(),this.global.instances.switchHandler=u,this.setupSwitchHandling(e,u),this.observeVideoElement(),this.startPartIdMonitoring(),b.show(`コメントの読み込みが完了しました（${l.length}件）`,"success");}catch(n){throw this.initialized=false,b.show(`初期化エラー: ${n.message}`,"error"),n}}}mergeSettings(e){const n=q();return {...n,...e,ngWords:[...e.ngWords??n.ngWords],ngRegexps:[...e.ngRegexps??n.ngRegexps]}}ensureRendererSettingsObserver(e){this.rendererSettingsObserver||(this.rendererSettingsObserver=n=>{this.applyRendererSettings(n);},e.addObserver(this.rendererSettingsObserver));}applyRendererSettings(e){const n=this.global.instances.renderer;if(!n)return;const r=this.mergeSettings(e);n.settings.isCommentVisible!==r.isCommentVisible&&n.setCommentVisibility(r.isCommentVisible),n.settings=r;}setupSwitchHandling(e,n){this.currentVideoElement=e,this.switchCallback=()=>{if(this.isPartIdChanging){g.info("watchPageController:switchBlocked",{reason:"partId change in progress"});return}const r=Date.now();if(r-this.lastSwitchTimestamp<Wt){g.debug("watchPageController:switchCooldown",{timeSinceLastSwitch:r-this.lastSwitchTimestamp,cooldownMs:Wt});return}this.lastSwitchTimestamp=r;const i=this.currentVideoElement;g.info("watchPageController:switchHandlerTriggered",{currentTime:i?.currentTime??null,duration:i?.duration??null}),n.onVideoSwitch(i);},this.global.utils.initializeWithVideo=async r=>{r&&(this.rebindVideoElement(r),this.playbackRateController?.bind(r),await n.onVideoSwitch(r));},this.currentVideoElement=e;}observeVideoElement(){const e=this.currentVideoElement;e&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{const n=document.querySelector(E.watchVideoElement);!n||n===this.currentVideoElement||this.rebindVideoElement(n);}),this.domMutationObserver.observe(document.body,{childList:true,subtree:true}),this.attachVideoEventListeners(e));}rebindVideoElement(e){this.detachVideoEventListeners(),this.currentVideoElement=e;const n=this.global.instances.renderer,r=this.global.instances.switchHandler;n&&(n.clearComments(),n.destroy(),n.initialize(e),n.resize()),this.playbackRateController?.bind(e),r&&(r.onVideoSwitch(e),this.setupSwitchHandling(e,r)),this.attachVideoEventListeners(e);}attachVideoEventListeners(e){this.detachVideoEventListeners(),Pt().attach(e);const r=i=>{if(!this.switchCallback)return;const s=i.type,a=this.hasVideoSourceChanged(e);if(s==="ended"&&!a){g.info("watchPageController:skipSwitchOnEnded",{eventType:s,currentTime:e.currentTime,duration:e.duration,ended:e.ended,paused:e.paused,currentSrc:e.currentSrc||e.getAttribute("src")||null});return}g.info("watchPageController:eventTriggered",{eventType:s,currentTime:e.currentTime,duration:e.duration,ended:e.ended,paused:e.paused,sourceChanged:a}),this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback);};e.addEventListener("ended",r),e.addEventListener("loadedmetadata",r),e.addEventListener("emptied",r),this.videoEndedListener=r;}detachVideoEventListeners(){const e=this.currentVideoElement;Pt().detach(),e&&this.videoEndedListener&&(e.removeEventListener("ended",this.videoEndedListener),e.removeEventListener("loadedmetadata",this.videoEndedListener),e.removeEventListener("emptied",this.videoEndedListener)),this.videoEndedListener=null;}hasVideoSourceChanged(e){const n=e.currentSrc||e.getAttribute("src")||e.querySelector("source[src]")?.getAttribute("src")||null,r=this.global.instances.renderer?.getCurrentVideoSource()??null;return n?r?r!==n:true:false}async waitForMetadataElements(e,n){const s=Date.now();for(let l=0;l<50;l++){const d=this.getCurrentPartId(),h=document.querySelector(E.watchPageAnimeTitle),c=document.querySelector(E.watchPageEpisodeNumber),u=document.querySelector(E.watchPageEpisodeTitle),p=h?.textContent?.trim()??"",m=c?.textContent?.trim()??"",x=u?.textContent?.trim()??"";if(l===0&&g.info("watchPageController:waitForMetadata:start",{currentPartId:d,expectedPartId:e,episodeNumber:m,episodeTitle:x,animeTitle:p||"(empty)",cachedAnimeTitle:this.cachedAnimeTitle||"(empty)",previousEpisodeNumber:n||"(none)"}),!e&&!this.cachedAnimeTitle&&l<20&&!p){await new Promise(k=>window.setTimeout(k,100));continue}if((!e||d===e)&&(m&&x)&&(!n||m!==n)){g.info("watchPageController:waitForMetadata:success",{attempts:l+1,waited:Date.now()-s,currentPartId:d,expectedPartId:e,episodeNumber:m,episodeTitle:x,animeTitle:p||"(empty)",previousEpisodeNumber:n||"(none)"});return}await new Promise(k=>window.setTimeout(k,100));}const a=document.querySelector(E.watchPageEpisodeNumber)?.textContent?.trim()??"",o=document.querySelector(E.watchPageEpisodeTitle)?.textContent?.trim()??"";throw g.error("watchPageController:waitForMetadata:timeout",{maxRetries:50,waited:Date.now()-s,currentPartId:this.getCurrentPartId(),expectedPartId:e,previousEpisodeNumber:n||"(none)",finalEpisodeNumber:a,finalEpisodeTitle:o}),new Error(`DOM更新のタイムアウト: partId=${e}, 前回エピソード="${n||"なし"}", 現在エピソード="${a}"`)}extractMetadataFromPage(){try{const e=document.querySelector(E.watchPageAnimeTitle),n=document.querySelector(E.watchPageEpisodeNumber),r=document.querySelector(E.watchPageEpisodeTitle);let i=e?.textContent?.trim()??"";const s=n?.textContent?.trim()??"",a=r?.textContent?.trim()??"";if(i){this.cachedAnimeTitle=i;try{K(Bt,i),g.info("watchPageController:extractMetadata:cachedTitle",{animeTitle:i});}catch(o){g.error("watchPageController:extractMetadata:saveCacheFailed",o);}}else this.cachedAnimeTitle&&(i=this.cachedAnimeTitle,g.info("watchPageController:extractMetadata:usedCachedTitle",{cachedAnimeTitle:this.cachedAnimeTitle}));return g.info("watchPageController:extractMetadata:rawValues",{animeTitle:i||"(empty)",animeTitleElementExists:!!e,animeTitleFromCache:!e&&!!this.cachedAnimeTitle,episodeNumber:s,episodeNumberElementExists:!!n,episodeTitle:a,episodeTitleElementExists:!!r,currentPartId:this.getCurrentPartId()}),s?(i||g.warn("watchPageController:extractMetadata:noAnimeTitle",{hasCache:!!this.cachedAnimeTitle}),this.lastEpisodeNumber=s,{animeTitle:i,episodeNumber:s,episodeTitle:a}):(g.warn("watchPageController:extractMetadata:insufficient",{episodeNumber:s||"(empty)",episodeTitle:a||"(empty)"}),null)}catch(e){return g.error("watchPageController:extractMetadata:error",e),null}}async autoSetupComments(e){try{const n=this.extractMetadataFromPage();if(!n)return g.warn("watchPageController:autoSetup:noMetadata"),!1;if(!n.animeTitle)return g.warn("watchPageController:autoSetup:noAnimeTitle",{episodeNumber:n.episodeNumber,episodeTitle:n.episodeTitle,cachedAnimeTitle:this.cachedAnimeTitle}),b.show("アニメタイトルが取得できませんでした。検索精度が低下する可能性があります。","warning"),!1;const r=[n.animeTitle,n.episodeNumber,n.episodeTitle].filter(Boolean).join(" ");g.info("watchPageController:autoSetup",{keyword:r,animeTitle:n.animeTitle,episodeNumber:n.episodeNumber,episodeTitle:n.episodeTitle,usingCachedTitle:!!this.cachedAnimeTitle&&!n.animeTitle}),b.show(`「${r}」を検索中...`,"info");const s=await new R().search(r);if(s.length===0)return b.show("ニコニコ動画が見つかりませんでした","warning"),!1;const a=R.filterOfficialVideos(s,n.animeTitle);g.info("watchPageController:autoSetup:officialFilter",{totalResults:s.length,officialResults:a.length,animeTitle:n.animeTitle}),a.length===0&&(g.warn("watchPageController:autoSetup:noOfficialVideos",{animeTitle:n.animeTitle,firstResultOwner:s[0]?.owner?.nickname??s[0]?.channel?.name??"不明"}),b.show("公式動画が見つかりませんでした。検索結果の最初の動画を使用します。","warning"));const o=a.length>0?a[0]:s[0],d=await new X().fetchApiData(o.videoId),h={videoId:o.videoId,title:o.title,viewCount:d.video?.count?.view??o.viewCount,commentCount:d.video?.count?.comment??o.commentCount,mylistCount:d.video?.count?.mylist??o.mylistCount,postedAt:d.video?.registeredAt??o.postedAt,thumbnail:d.video?.thumbnail?.url??o.thumbnail,owner:d.owner??o.owner??null,channel:d.channel??o.channel??null};if(e.saveVideoData(o.title,h)){g.info("watchPageController:autoSetup:success",{videoId:o.videoId,title:o.title,commentCount:o.commentCount});const u=o.owner?.nickname||o.channel?.name||"不明",p=['<div style="font-weight: 600; margin-bottom: 8px;">ニコニコ動画を自動設定しました</div>','<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ht}</span>`,`  <span style="flex: 1; word-break: break-word;">${o.title}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ve}</span>`,`  <span>${u}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">','  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ie}</span>`,`    <span>${o.viewCount.toLocaleString()}</span>`,"  </div>",'  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ae}</span>`,`    <span>${o.commentCount.toLocaleString()}</span>`,"  </div>","</div>"].join("");return b.show(p,"success",5e3),!0}return !1}catch(n){return g.error("watchPageController:autoSetup:error",n),b.show(`自動設定エラー: ${n.message}`,"error"),false}}getCurrentPartId(){try{return new URLSearchParams(window.location.search).get("partId")}catch(e){return g.error("watchPageController:getCurrentPartId:error",e),null}}startPartIdMonitoring(){this.stopPartIdMonitoring(),this.lastPartId=this.getCurrentPartId(),this.partIdMonitorIntervalId=window.setInterval(()=>{this.checkPartIdChange();},Do);}stopPartIdMonitoring(){this.partIdMonitorIntervalId!==null&&(window.clearInterval(this.partIdMonitorIntervalId),this.partIdMonitorIntervalId=null);}async checkPartIdChange(){const e=this.getCurrentPartId();e===null||e===this.lastPartId||(g.warn("watchPageController:partIdChanged",{oldPartId:this.lastPartId,newPartId:e,url:window.location.href,timestamp:new Date().toISOString()}),this.lastPartId=e,await this.onPartIdChanged());}async waitForVideoReady(e){const i=Date.now();for(g.info("watchPageController:waitForVideoReady:start",{readyState:e.readyState,duration:e.duration,src:e.currentSrc});e.readyState<2&&Date.now()-i<5e3;)await new Promise(s=>window.setTimeout(s,100));g.info("watchPageController:waitForVideoReady:complete",{readyState:e.readyState,duration:e.duration,waited:Date.now()-i});}async onPartIdChanged(){this.isPartIdChanging=true;try{const e=this.global.settingsManager;if(!e){g.warn("watchPageController:onPartIdChanged:noSettingsManager");return}const n=e.getSettings();if(!n.isCommentVisible){g.info("watchPageController:onPartIdChanged:skipDueToVisibility",{isCommentVisible:n.isCommentVisible}),b.show("コメント非表示設定のためスキップしました","info");return}const r=this.lastEpisodeNumber??document.querySelector(E.watchPageEpisodeNumber)?.textContent?.trim()??null;if(!n.autoSearchEnabled){g.info("watchPageController:onPartIdChanged:manualMode",{autoSearchEnabled:n.autoSearchEnabled});const a=e.loadManualSearchSettings();if(!a?.animeTitle){b.show("手動設定モードです。フローティングボタンから検索タブを開いてアニメタイトルを設定してください。","info");const o=this.global.instances.renderer;o&&o.clearComments();return}await this.handleManualModeEpisodeSwitch(e,a.animeTitle,r);return}g.info("watchPageController:onPartIdChanged:start",{currentVideoElement:this.currentVideoElement?"present":"null",rendererExists:!!this.global.instances.renderer,switchHandlerExists:!!this.global.instances.switchHandler,isPartIdChanging:this.isPartIdChanging,newPartId:this.getCurrentPartId(),previousEpisodeNumber:r}),b.show("エピソード切り替えを検知しました...","info");const i=this.getCurrentPartId();g.info("watchPageController:onPartIdChanged:waitingForDomUpdate",{newPartId:i,previousEpisodeNumber:r});try{await this.waitForMetadataElements(i??void 0,r??void 0);}catch(a){g.error("watchPageController:onPartIdChanged:waitMetadataFailed",a),b.show(`DOM更新の待機に失敗しました: ${a.message}`,"error");return}const s=await this.autoSetupComments(e);if(g.info("watchPageController:onPartIdChanged:autoSetup",{success:s}),s){const a=e.loadVideoData();g.warn("watchPageController:onPartIdChanged:loadedVideoData",{videoId:a?.videoId??null,title:a?.title??null});const o=this.currentVideoElement??document.querySelector(E.watchVideoElement);if(g.warn("watchPageController:onPartIdChanged:videoElement",{videoElementFound:!!o,currentTime:o?.currentTime??null,duration:o?.duration??null,src:o?.currentSrc??null,readyState:o?.readyState??null}),o&&a?.videoId){await this.waitForVideoReady(o),o.dataset.videoId=a.videoId;const l=this.global.instances.renderer,d=this.global.instances.switchHandler;if(g.warn("watchPageController:onPartIdChanged:beforeSwitch",{rendererCommentCount:l?.getCommentsSnapshot().length??0,videoCurrentTime:o.currentTime,videoReadyState:o.readyState,videoSrc:o.currentSrc,videoId:a.videoId}),l&&d){g.warn("watchPageController:onPartIdChanged:destroyBefore",{commentsBeforeDestroy:l.getCommentsSnapshot().length,currentVideoSrc:l.getCurrentVideoSource(),videoElement:l.getVideoElement()?"attached":"detached"});const h=l.settings;l.destroy(),g.warn("watchPageController:onPartIdChanged:createNew",{savedSettings:h});const c=new te(h,{loggerNamespace:"dAnime:CommentRenderer"});this.global.instances.renderer=c,g.warn("watchPageController:onPartIdChanged:reinitialize",{videoElementSrc:o.currentSrc,videoElementReadyState:o.readyState,videoElementCurrentTime:o.currentTime}),c.initialize(o),g.warn("watchPageController:onPartIdChanged:reinitializeComplete",{commentsAfterReinitialize:c.getCommentsSnapshot().length,newVideoSrc:c.getCurrentVideoSource()}),d.updateRenderer(c),d.resetVideoSource(),await d.onVideoSwitch(o),g.warn("watchPageController:onPartIdChanged:afterSwitch",{rendererCommentCount:c.getCommentsSnapshot().length,videoCurrentTime:o.currentTime,finalVideoSrc:c.getCurrentVideoSource()});}}}g.info("watchPageController:onPartIdChanged:complete");}catch(e){g.error("watchPageController:onPartIdChanged:error",e),b.show(`エピソード切り替えエラー: ${e.message}`,"error");}finally{this.isPartIdChanging=false,g.info("watchPageController:onPartIdChanged:flagReset",{isPartIdChanging:this.isPartIdChanging});}}async loadCommentsFromSavedVideo(e,n,r){try{const i=new X;this.global.instances.fetcher=i,await i.fetchApiData(r.videoId);const s=await i.fetchComments(),a=this.mergeSettings(n.loadSettings()),o=new te(a);o.initialize(e),this.global.instances.renderer=o,this.currentVideoElement=e;const l=this.playbackRateController??new Le(n);this.playbackRateController=l,this.global.instances.playbackRateController=l,l.bind(e),this.ensureRendererSettingsObserver(n),this.applyRendererSettings(n.loadSettings()),s.forEach(h=>{o.addComment(h.text,h.vposMs,h.commands);});const d=new _e(o,i,n);d.startMonitoring(),this.global.instances.switchHandler=d,this.setupSwitchHandling(e,d),this.observeVideoElement(),this.startPartIdMonitoring(),b.show(`【手動設定モード】コメントの読み込みが完了しました（${s.length}件）
動画: ${r.title}`,"success");}catch(i){g.error("watchPageController:loadCommentsFromSavedVideo:error",i),b.show(`コメント読み込みエラー: ${i.message}
フローティングボタンから別の動画を選択してください。`,"error");}}async handleManualModeEpisodeSwitch(e,n,r){try{const i=this.getCurrentPartId();g.info("watchPageController:manualModeSwitch:waitingForDomUpdate",{newPartId:i,previousEpisodeNumber:r,savedAnimeTitle:n});try{await this.waitForMetadataElements(i??void 0,r??void 0);}catch(f){g.error("watchPageController:manualModeSwitch:waitMetadataFailed",f),b.show(`DOM更新の待機に失敗しました: ${f.message}`,"error");return}const s=document.querySelector(E.watchPageEpisodeNumber)?.textContent?.trim()??"";if(!s){g.warn("watchPageController:manualModeSwitch:noEpisodeNumber"),b.show("エピソード話数を取得できませんでした","warning");return}const a=`${n} ${s}`;g.info("watchPageController:manualModeSwitch:search",{keyword:a,savedAnimeTitle:n,newEpisodeNumber:s}),b.show(`「${a}」を検索中...`,"info");const l=await new R().search(a);if(l.length===0){b.show("ニコニコ動画が見つかりませんでした。手動で検索してください。","warning");const f=this.global.instances.renderer;f&&f.clearComments();return}const d=R.filterOfficialVideos(l,n);if(g.info("watchPageController:manualModeSwitch:officialFilter",{totalResults:l.length,officialResults:d.length,savedAnimeTitle:n}),d.length===0){b.show("公式動画が見つかりませんでした。手動で検索してください。","warning");const f=this.global.instances.renderer;f&&f.clearComments();return}const h=d[0],u=await new X().fetchApiData(h.videoId),p={videoId:h.videoId,title:h.title,viewCount:u.video?.count?.view??h.viewCount,commentCount:u.video?.count?.comment??h.commentCount,mylistCount:u.video?.count?.mylist??h.mylistCount,postedAt:u.video?.registeredAt??h.postedAt,thumbnail:u.video?.thumbnail?.url??h.thumbnail,owner:u.owner??h.owner??null,channel:u.channel??h.channel??null};e.saveVideoData(h.title,p),e.saveManualSearchSettings({animeTitle:n,episodeNumber:s,episodeTitle:""});const m=this.currentVideoElement??document.querySelector(E.watchVideoElement);if(m){await this.waitForVideoReady(m),m.dataset.videoId=h.videoId;const f=this.global.instances.renderer,v=this.global.instances.switchHandler;if(f&&v){const M=f.settings;f.destroy();const k=new te(M,{loggerNamespace:"dAnime:CommentRenderer"});this.global.instances.renderer=k,k.initialize(m),v.updateRenderer(k),v.resetVideoSource(),await v.onVideoSwitch(m);}}const x=h.owner?.nickname??h.channel?.name??"不明",y=['<div style="font-weight: 600; margin-bottom: 8px;">次のエピソードを自動設定しました</div>','<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ht}</span>`,`  <span style="flex: 1; word-break: break-word;">${h.title}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">',`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ve}</span>`,`  <span>${x}</span>`,"</div>",'<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">','  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ie}</span>`,`    <span>${h.viewCount.toLocaleString()}</span>`,"  </div>",'  <div style="display: flex; align-items: center; gap: 4px;">',`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Ae}</span>`,`    <span>${h.commentCount.toLocaleString()}</span>`,"  </div>","</div>"].join("");b.show(y,"success",5e3),g.info("watchPageController:manualModeSwitch:success",{videoId:h.videoId,title:h.title,commentCount:h.commentCount});}catch(i){g.error("watchPageController:manualModeSwitch:error",i),b.show(`エピソード切り替えエラー: ${i.message}`,"error");}}}const zo=100;class Oo{constructor(e){this.global=e;}initialize(){const e=b.getInstance(),n=this.global.settingsManager??new Be(e);this.global.settingsManager=n,this.global.instances.settingsManager=n;const r=new me(n);this.waitForHeader(r);}waitForHeader(e){if(!document.querySelector(E.mypageHeaderTitle)){window.setTimeout(()=>this.waitForHeader(e),zo);return}e.insertIntoMypage(),e.addAutoCommentButtons(),this.observeList(e);}observeList(e){const n=document.querySelector(E.mypageListContainer);if(!n)return;new MutationObserver(()=>{try{e.addAutoCommentButtons();}catch(i){console.error("[MypageController] auto comment buttons update failed",i);}}).observe(n,{childList:true,subtree:true});}}class No{log;global=Io();watchController=null;mypageController=null;constructor(){this.log=P("DanimeApp");}start(){this.log.info("starting renderer"),bn.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener("load",()=>{this.initialize();});}async initialize(){if(!this.acquireInstanceLock()){this.log.info("renderer already initialized, skipping");return}const e=location.pathname.toLowerCase();try{e.includes("/animestore/sc_d_pc")?(this.watchController=new Ho(this.global),await this.watchController.initialize()):e.includes("/animestore/mp_viw_pc")?(this.mypageController=new Oo(this.global),this.mypageController.initialize()):this.log.info("page not supported, initialization skipped");}catch(n){this.log.error("initialization failed",n);}}acquireInstanceLock(){const e=Pe();return e.__dAnimeNicoCommentRenderer2Instance=(e.__dAnimeNicoCommentRenderer2Instance??0)+1,e.__dAnimeNicoCommentRenderer2Instance===1}}const Me=P("dAnimeNicoCommentRenderer2");async function $o(){Me.info("bootstrap start");try{new No().start(),Me.info("bootstrap completed");}catch(t){Me.error("bootstrap failed",t);}}$o();

})();