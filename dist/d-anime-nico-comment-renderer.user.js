// ==UserScript==
// @name         d-anime-nico-comment-renderer
// @namespace    dAnimeNicoCommentRenderer
// @version      7.7.0
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

(function(){"use strict";var e={debug:`debug`,info:`info`,warn:`warn`,error:`error`},t={debug:10,info:20,warn:30,error:40},n=e=>t[e]>=t.warn,r=t=>{let r=`[${t}]`,i={};return Object.keys(e).forEach(a=>{let o=e[a];i[a]=(...e)=>{n(a,t)&&(console[o]??console.log)(r,...e)}}),i};function i(){return typeof unsafeWindow<`u`?unsafeWindow:window}var a={small:.6666666666666666,medium:1,big:1.4444444444444444},o={defont:`Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic`,gothic:`"游ゴシック体","游ゴシック","Yu Gothic",YuGothic,yugothic,YuGo-Medium,"宋体",SimSun,Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic`,mincho:`"游明朝体","游明朝","Yu Mincho",YuMincho,yumincho,YuMin-Medium,"宋体",SimSun,Arial,"ＭＳ Ｐゴシック","MS PGothic",MSPGothic,MS-PGothic`},s={defont:`600`,gothic:``,mincho:``},c={white:`#FFFFFF`,red:`#FF0000`,pink:`#FFA5CC`,orange:`#FFBA66`,yellow:`#FFFFAA`,green:`#00FF00`,cyan:`#88FFFF`,blue:`#8899FF`,purple:`#D9A5FF`,black:`#000000`,white2:`#CC9`,red2:`#C03`,pink2:`#F3C`,orange2:`#F60`,yellow2:`#990`,green2:`#0C6`,cyan2:`#0CC`,blue2:`#39F`,purple2:`#63C`,black2:`#666`},l=/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,u=/^[,.:;]+/,d=/[,.:;]+$/,f=e=>{let t=e.trim();return t?l.test(t)?t:t.replace(u,``).replace(d,``):``},p=e=>l.test(e)?e.toUpperCase():null,m=e=>{let t=e.trim();if(!t)return null;let n=t.toLowerCase().endsWith(`px`)?t.slice(0,-2):t,r=Number.parseFloat(n);return Number.isFinite(r)?r:null},h=e=>{let t=e.trim();if(!t)return null;if(t.endsWith(`%`)){let e=Number.parseFloat(t.slice(0,-1));return Number.isFinite(e)?e/100:null}return m(t)},ee=e=>Number.isFinite(e)?Math.min(100,Math.max(-100,e)):0,g=e=>!Number.isFinite(e)||e===0?1:Math.min(5,Math.max(.25,e)),te=e=>e===`naka`||e===`ue`||e===`shita`,ne=e=>e===`small`||e===`medium`||e===`big`,re=e=>e===`defont`||e===`gothic`||e===`mincho`,ie=e=>e in c,ae=(e,t)=>{let n=`naka`,r=`medium`,i=`defont`,u=null,d=1,ae=null,oe=!1,se=!1,_=!1,v=0,ce=1;for(let t of e){let e=f(typeof t==`string`?t:``);if(!e)continue;if(l.test(e)){let t=p(e);if(t){u=t;continue}}let a=e.toLowerCase();if(te(a))n=a;else if(ne(a))r=a;else if(re(a))i=a;else if(ie(a))u=c[a].toUpperCase();else if(a===`_live`)ae=.5;else if(a===`invisible`)d=0,oe=!0;else if(a===`full`)se=!0;else if(a===`ender`)_=!0;else if(a.startsWith(`ls:`)||a.startsWith(`letterspacing:`)){let t=e.indexOf(`:`);if(t>=0){let n=m(e.slice(t+1));n!==null&&(v=ee(n))}}else if(a.startsWith(`lh:`)||a.startsWith(`lineheight:`)){let t=e.indexOf(`:`);if(t>=0){let n=h(e.slice(t+1));n!==null&&(ce=g(n))}}}let le=Math.max(0,Math.min(1,d)),ue=(u??t.defaultColor).toUpperCase(),y=typeof ae==`number`?Math.max(0,Math.min(1,ae)):null;return{layout:n,size:r,sizeScale:a[r],font:i,fontFamily:o[i],fontWeight:s[i],resolvedColor:ue,colorOverride:u,opacityMultiplier:le,opacityOverride:y,isInvisible:oe,isFull:se,isEnder:_,letterSpacing:v,lineHeight:ce}},oe=/^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i,se=e=>e.length===1?e.repeat(2):e,_=e=>Number.parseInt(e,16),v=e=>!Number.isFinite(e)||e<=0?0:e>=1?1:e,ce=(e,t)=>{let n=oe.exec(e);if(!n)return e;let r=n[1],i,a,o,s=1;r.length===3||r.length===4?(i=_(se(r[0])),a=_(se(r[1])),o=_(se(r[2])),r.length===4&&(s=_(se(r[3]))/255)):(i=_(r.slice(0,2)),a=_(r.slice(2,4)),o=_(r.slice(4,6)),r.length===8&&(s=_(r.slice(6,8))/255));let c=v(s*v(t));return`rgba(${i}, ${a}, ${o}, ${c})`},le=()=>({now:()=>typeof performance<`u`&&typeof performance.now==`function`?performance.now():Date.now()}),ue=()=>le(),y=e=>e*1e3,de=e=>!Number.isFinite(e)||e<0?null:Math.round(e),fe=6e3,pe=2700,me=3,he=.35,ge=48,_e=48,ve=0,b=3e3,ye=9e3,be=240,xe=1,Se=12,x=.001,Ce=50,we={debug:0,info:1,warn:2,error:3},Te=(e,t,n)=>{let r=[`[${t}]`,...n];switch(e){case`debug`:console.debug(...r);break;case`info`:console.info(...r);break;case`warn`:console.warn(...r);break;case`error`:console.error(...r);break;default:console.log(...r)}},Ee=(e,t={})=>{let{level:n=`info`,emitter:r=Te}=t,i=we[n],a=(t,n)=>{we[t]<i||r(t,e,n)};return{debug:(...e)=>a(`debug`,e),info:(...e)=>a(`info`,e),warn:(...e)=>a(`warn`,e),error:(...e)=>a(`error`,e)}},De=Ee(`CommentEngine:Comment`),Oe=new WeakMap,ke=e=>{let t=Oe.get(e);return t||(t=new Map,Oe.set(e,t)),t},Ae=(e,t)=>{if(!e)return 0;let n=`${e.font??``}::${t}`,r=ke(e),i=r.get(n);if(i!==void 0)return i;let a=e.measureText(t).width;return r.set(n,a),a},je=768,Me=.1,Ne=e=>Math.max(1,e)/je*Me,Pe={small:{resizeAtLineCount:7,normal:{fontSize:36,blockHeight:46.4650603532791,lineAdvance:36.0867458283901},resized:{fontSize:20,blockHeight:25.9252893924713,lineAdvance:20.065746307373}},medium:{resizeAtLineCount:5,normal:{fontSize:54,blockHeight:68.1645984649658,lineAdvance:57.8541674613953},resized:{fontSize:28,blockHeight:35.4883227944374,lineAdvance:30.0388290286064}},big:{resizeAtLineCount:3,normal:{fontSize:78,blockHeight:98.6615376472473,lineAdvance:90.4781694412232},resized:{fontSize:40,blockHeight:52.1674284785986,lineAdvance:47.7538447529078}}},Fe=({canvasHeight:e,size:t,lineCount:n,isEnder:r,lineHeightMultiplier:i})=>{let a=Math.max(1,e),o=Math.max(1,Math.floor(n)),s=Pe[t],c=!r&&o>=s.resizeAtLineCount,l=c?s.resized:s.normal,u=a/je,d=Math.max(1,l.fontSize*u),f=Math.abs(i-1)>2**-52,p=f?Math.max(1,d*i):Math.max(1,l.lineAdvance*u),m=d+(o-1)*p,h=(l.blockHeight+(o-1)*l.lineAdvance)*u;return{fontSize:d,lineAdvance:p,textHeight:m,slotHeight:f?m:Math.max(1,h-Ne(a)),wasResizedForLineCount:c}},Ie=1364,Le=1024,Re=4e3,ze=2e3,Be=1e3,Ve=e=>Math.max(0,e)/2+3,He=({visibleWidth:e,inkWidth:t,texturePaddingX:n,direction:r,traversalDurationMs:i=Re})=>{let a=Math.max(1,e),o=Math.max(0,t),s=Math.max(0,n),c=Math.max(1,i),l=Le/Ie*a,u=(a-l)/2,d=(l+o)/c,f=d*Be,p=r===`rtl`?u+l+s+f:u-o-s-f,m=r===`rtl`?-o-s:a+s,h=Math.abs(m-p)/Math.max(d,2**-52);return{renderLeft:u,renderWidth:l,pixelsPerMs:d,startX:p,exitX:m,collisionDurationMs:o/Math.max(d,2**-52),totalDurationMs:h}},Ue=768,We=.75,Ge=2,Ke=(e,t)=>Math.floor((e+2**-52)/t)*t,qe=({visibleWidth:e,canvasHeight:t,isFull:n,isEnder:r,lineCount:i,verticalFontSize:a,verticalTextWidth:o,originalFontSize:s,originalTextWidth:c})=>{let l=Math.max(.01,t/Ue),u=Ge*l,d=20*l,f=Math.max(1,e*(n?1:We)),p=!r&&i>1&&o>f,m=p?s:a,h=p?c:o,ee=p?f*2:f,g=m;h>ee&&(g=Ke(ee/h*m,u)),p&&!n&&(g-=u),g=Math.max(d,Math.min(m,g));let te=m>0?g/m*h:0,ne=1;return te>ee&&g<=d+2**-52&&(ne=Math.max(.1,Math.floor(ee/te*10)/10)),{fontSize:g,drawScale:ne,useOriginalMetrics:p,targetWidth:ee}},Je=e=>`${e.fontWeight?`${e.fontWeight} `:``}${e.fontSize}px ${e.fontFamily}`,Ye=`  `,Xe=e=>e.replaceAll(`	`,Ye),Ze=e=>{let t=Xe(e);if(t.includes(`
`)){let e=t.split(/\r?\n/);return e.length>0?e:[``]}return[t]},Qe=(e,t,n=Math.max(1,e.fontSize*e.lineHeightMultiplier))=>{let r=0,i=e.letterSpacing;for(let n of e.lines){let e=Ae(t,n),a=n.length>1?i*(n.length-1):0,o=Math.max(0,e+a);o>r&&(r=o)}e.width=r,e.lineHeightPx=Math.max(1,n);let a=e.lines.length>1?(e.lines.length-1)*e.lineHeightPx:0;e.height=e.fontSize+a},$e=(e,t,n)=>(t.font=`${e.fontWeight?`${e.fontWeight} `:``}${n}px ${e.fontFamily}`,Math.max(0,...e.lines.map(n=>{let r=n.length>1?e.letterSpacing*(n.length-1):0;return Math.max(0,Ae(t,n)+r)}))),et=(e,t,n,r,i)=>{try{if(!t)throw Error(`Canvas context is required`);if(!Number.isFinite(n)||!Number.isFinite(r))throw Error(`Canvas dimensions must be numbers`);if(!i)throw Error(`Prepare options are required`);let a=Math.max(n,1);e.lines=Ze(e.text);let o=Fe({canvasHeight:r,size:e.size,lineCount:e.lines.length,isEnder:e.isEnder,lineHeightMultiplier:e.lineHeightMultiplier});if(e.fontSize=o.fontSize,e.slotHeight=o.slotHeight,e.staticWidthScale=1,t.font=Je(e),Qe(e,t,o.lineAdvance),!e.isScrolling){let n=e.width,i=Fe({canvasHeight:r,size:e.size,lineCount:e.lines.length,isEnder:!0,lineHeightMultiplier:e.lineHeightMultiplier}),s=$e(e,t,i.fontSize),c=qe({visibleWidth:a,canvasHeight:r,isFull:e.isFull,isEnder:e.isEnder,lineCount:e.lines.length,verticalFontSize:o.fontSize,verticalTextWidth:n,originalFontSize:i.fontSize,originalTextWidth:s}),l=c.useOriginalMetrics?i:o,u=c.fontSize/Math.max(1,l.fontSize);e.fontSize=c.fontSize,e.staticWidthScale=c.drawScale,t.font=Je(e),Qe(e,t,l.lineAdvance*u),e.slotHeight=Math.max(1,l.slotHeight*u*c.drawScale)}if(!e.isScrolling){e.bufferWidth=0;let t=(a-e.width)/2;e.virtualStartX=t,e.x=t,e.baseSpeed=0,e.speed=0,e.speedPixelsPerMs=0,e.visibleDurationMs=b,e.preCollisionDurationMs=b,e.totalDurationMs=b,e.reservationWidth=e.width*e.staticWidthScale,e.staticExpiryTimeMs=e.vposMs+b,e.lastUpdateTime=e.getTimeSource().now(),e.isPaused=!1;return}e.staticExpiryTimeMs=null;let s=i.maxVisibleDurationMs===i.minVisibleDurationMs?i.maxVisibleDurationMs:Re,c=Ve(e.fontSize),l=He({visibleWidth:a,inkWidth:e.width,texturePaddingX:c,direction:e.scrollDirection,traversalDurationMs:s});e.bufferWidth=0,e.virtualStartX=l.startX,e.x=l.startX,e.exitThreshold=l.exitX,e.baseSpeed=l.pixelsPerMs*1e3/60,e.speed=e.baseSpeed,e.speedPixelsPerMs=l.pixelsPerMs,e.visibleDurationMs=s,e.preCollisionDurationMs=Math.ceil(l.collisionDurationMs),e.totalDurationMs=Math.ceil(l.totalDurationMs),e.reservationWidth=e.width,e.lastUpdateTime=e.getTimeSource().now(),e.isPaused=!1}catch(i){throw De.error(`Comment.prepare`,i,{text:e.text,visibleWidth:n,canvasHeight:r,hasContext:!!t}),i}},tt=5,S={enabled:!1,maxLogsPerCategory:tt},nt=new Map,rt=e=>e===void 0||!Number.isFinite(e)?tt:Math.min(1e4,Math.max(1,Math.floor(e))),it=e=>{S.enabled=!!e.enabled,S.maxLogsPerCategory=rt(e.maxLogsPerCategory),S.enabled||nt.clear()},at=()=>S.enabled,ot=e=>{let t=nt.get(e)??0;return t>=S.maxLogsPerCategory?(t===S.maxLogsPerCategory&&(console.debug(`[CommentOverlay][${e}]`,`Further logs suppressed.`),nt.set(e,t+1)),!1):(nt.set(e,t+1),!0)},C=(e,...t)=>{S.enabled&&ot(e)&&console.debug(`[CommentOverlay][${e}]`,...t)},st=(e,t=32)=>e.length<=t?e:`${e.slice(0,t)}…`,ct=(e,t)=>{S.enabled&&(console.group(`[CommentOverlay][state-dump] ${e}`),console.table({"Current Time":`${t.currentTime.toFixed(2)}ms`,Duration:`${t.duration.toFixed(2)}ms`,"Is Playing":t.isPlaying,"Epoch ID":t.epochId,"Total Comments":t.totalComments,"Active Comments":t.activeComments,"Reserved Lanes":t.reservedLanes,"Final Phase":t.finalPhaseActive,"Playback Begun":t.playbackHasBegun,"Is Stalled":t.isStalled}),console.groupEnd())},lt=(e,t,n)=>{S.enabled&&C(`epoch-change`,`Epoch changed: ${e} → ${t} (reason: ${n})`)},ut=e=>{if(typeof e==`string`)return e;if(e!=null)return String(e)},dt=()=>typeof performance<`u`&&typeof performance.now==`function`?performance.now():Date.now(),ft=e=>{if(typeof e.getTransform!=`function`)return;let t=e.getTransform();return[t.a,t.b,t.c,t.d,t.e,t.f]},pt=e=>{let t=e.canvas;return t?{canvasWidth:t.width,canvasHeight:t.height}:{}},mt=e=>e?{...e.no===void 0?{}:{no:e.no},...e.fork===void 0?{}:{fork:e.fork},...e.source===void 0?{}:{source:e.source},...e.threadId===void 0?{}:{threadId:e.threadId},...e.date===void 0?{}:{date:e.date},...e.userIdHash===void 0?{}:{userIdHash:e.userIdHash}}:{},ht=e=>({text:e.text,vposMs:e.vposMs,...mt(e.meta),layout:e.layout,lane:e.lane,fontSize:e.fontSize,width:e.width,height:e.height,lineHeightPx:e.lineHeightPx,slotHeight:e.slotHeight,color:e.color,opacity:e.opacity,creationIndex:e.creationIndex}),gt=(e,t,n,r)=>{let i=globalThis.__COMMENT_OVERLAY_TRACE__;globalThis.__COMMENT_OVERLAY_TRACE_ENABLED__!==!0||typeof i!=`function`||i({source:`comment-overlay`,op:e,timestampMs:dt(),font:t.font,fillStyle:ut(t.fillStyle),strokeStyle:ut(t.strokeStyle),lineWidth:t.lineWidth,lineJoin:t.lineJoin,globalAlpha:t.globalAlpha,shadowColor:t.shadowColor,shadowBlur:t.shadowBlur,shadowOffsetX:t.shadowOffsetX,shadowOffsetY:t.shadowOffsetY,transform:ft(t),...pt(t),comment:ht(n),...r})},_t=(e,t,n)=>{let r=globalThis.__COMMENT_OVERLAY_TRACE__;globalThis.__COMMENT_OVERLAY_TRACE_ENABLED__!==!0||typeof r!=`function`||r({source:`comment-overlay`,op:e,timestampMs:dt(),comment:ht(t),...n})},w={hits:0,misses:0,creates:0,fallbacks:0,outlineCallsInCache:0,fillCallsInCache:0,outlineCallsInFallback:0,fillCallsInFallback:0,letterSpacingComments:0,normalComments:0,multiLineComments:0,totalCharactersDrawn:0,lastReported:0},vt=()=>{if(!at())return;let e=performance.now();if(e-w.lastReported<=5e3)return;let t=w.hits+w.misses,n=t>0?w.hits/t*100:0,r=w.creates>0?(w.totalCharactersDrawn/w.creates).toFixed(1):`0`,i=w.outlineCallsInCache+w.outlineCallsInFallback,a=w.fillCallsInCache+w.fillCallsInFallback;console.log(`[TextureCache Stats]`,`
  Cache: Hits=${w.hits}, Misses=${w.misses}, Hit Rate=${n.toFixed(1)}%`,`
  Creates: ${w.creates}, Fallbacks: ${w.fallbacks}`,`
  Comments: Normal=${w.normalComments}, LetterSpacing=${w.letterSpacingComments}, MultiLine=${w.multiLineComments}`,`
  Draw Calls: Outline=${i}, Fill=${a}`,`
  Avg Characters/Comment: ${r}`),w.lastReported=e},yt=()=>typeof OffscreenCanvas<`u`,bt=(e,t,n)=>{if(e===`none`)return{blur:0,alpha:0};let r={light:.06,medium:.1,strong:.15}[e],i={light:.6,medium:.8,strong:.95}[e];return{blur:Math.max(2,t*r),alpha:v(n*i)}},xt=()=>2.8,St=.5,Ct=e=>{let t=e.trim().toLowerCase();if(t===`black`)return!0;let n=t.match(/^#([0-9a-f]{3,8})$/i);if(!n)return!1;let r=n[1],i=r.length===3||r.length===4,a=e=>e.length===1?`${e}${e}`:e,o=Number.parseInt(a(i?r[0]:r.slice(0,2)),16),s=Number.parseInt(a(i?r[1]:r.slice(2,4)),16),c=Number.parseInt(a(i?r[2]:r.slice(4,6)),16);return o===0&&s===0&&c===0},wt=e=>Ct(e.color)?`rgba(255, 255, 255, 0.4)`:`rgba(0, 0, 0, 0.4)`,Tt=(e,t)=>{if(!e.isScrolling)return t+e.fontSize;let n=e.fontSize<=18?e.fontSize*.08:0;return e.fontSize*1.5+n},Et=e=>{if(e.isScrolling&&e.lines.length>1){let t=Ve(e.fontSize);return{paddingX:t,paddingY:e.fontSize*.5,textureWidth:Math.ceil(e.width+t*2),textureHeight:Math.ceil(e.height+e.fontSize*1.25)}}if(!e.isScrolling){let t=Math.ceil(e.lines.length>1?e.height:e.height+e.fontSize/3);return{paddingX:0,paddingY:Math.max(0,(t-e.height)/2),textureWidth:Math.ceil(e.width+0),textureHeight:t}}let t=e.isScrolling?Ve(e.fontSize):Math.max(10,e.fontSize*.5),n=e.fontSize,r=e.isScrolling?Math.round(20/9*n):e.height+e.fontSize/3,i=Math.ceil(Math.max(e.height+Math.max(10,e.fontSize),r));return{paddingX:t,paddingY:e.isScrolling?e.fontSize*.5:Math.max(0,(i-e.height)/2),textureWidth:Math.ceil(e.width+t*2),textureHeight:i}},Dt=e=>e.isScrolling?1:e.staticWidthScale,Ot=(e,t)=>e.isScrolling?1:t,kt=(e,t,n,r,i)=>{let a=Ot(e,i),o=!e.isScrolling&&a!==1?t.width*(1-a)*St:0;return{x:n-r+o,scaleX:a,scaleY:i}},At=(e,t,n,r,i)=>(a,o,s,c=0)=>{if(a.length===0)return;let l=i+c,u=()=>{r===`cache`?s===`outline`?w.outlineCallsInCache++:w.fillCallsInCache++:s===`outline`?w.outlineCallsInFallback++:w.fillCallsInFallback++},d=(n,i,a)=>{u(),s===`outline`?(t.strokeText(n,i,o),gt(`strokeText`,t,e,{text:n,x:i,y:o,meta:{statsTarget:r,mode:s,...a}})):(t.fillText(n,i,o),gt(`fillText`,t,e,{text:n,x:i,y:o,meta:{statsTarget:r,mode:s,...a}}))};if(Math.abs(e.letterSpacing)<2**-52){d(a,l);return}let f=l;for(let t=0;t<a.length;t+=1){let r=a[t];d(r,f,{characterIndex:t});let i=Ae(n,r);f+=i,t<a.length-1&&(f+=e.letterSpacing)}},jt=e=>`v9::${e.text}::${e.fontSize}::${e.fontFamily}::${e.fontWeight}::${e.color}::${e.opacity}::${e.renderStyle}::${e.letterSpacing}::${e.lineHeightPx}::${e.width}::${e.height}::${e.staticWidthScale}::${e.lines.length}`,Mt=(e,t)=>{if(!yt())return null;let n=Math.abs(e.letterSpacing)>=2**-52,r=e.lines.length>1;n&&w.letterSpacingComments++,r&&w.multiLineComments++,!n&&!r&&w.normalComments++,w.totalCharactersDrawn+=e.text.length;let{paddingX:i,paddingY:a,textureWidth:o,textureHeight:s}=Et(e),c=new OffscreenCanvas(o,s),l=c.getContext(`2d`);if(!l)return null;l.save(),l.font=Je(e);let u=v(e.opacity),d=i,f=e.lines.length>0?e.lines:[e.text],p=e.lines.length>1&&e.lineHeightPx>0?e.lineHeightPx:e.fontSize,m=Tt(e,a),h=At(e,l,t,`cache`,d),ee=ce(e.color,u),g=e.renderStyle===`outline-only`,te=g?{blur:0,alpha:0}:bt(e.shadowIntensity,e.fontSize,u);return at()&&console.log(`[Shadow Debug - Cache]`,`
  Text: "${e.text}"`,`
  FontSize: ${e.fontSize}`,`
  Shadow intensity: ${e.shadowIntensity}`,`
  Shadow blur: ${te.blur}px`,`
  Shadow alpha: ${te.alpha}`,`
  Fill style: ${ee}`),l.save(),l.shadowColor=`rgba(0, 0, 0, ${te.alpha})`,l.shadowBlur=te.blur,l.shadowOffsetX=0,l.shadowOffsetY=0,l.lineJoin=`round`,l.lineWidth=xt(),l.strokeStyle=wt(e),l.fillStyle=ee,g&&f.forEach((e,t)=>{let n=m+t*p;h(e,n,`outline`)}),f.forEach((e,t)=>{let n=m+t*p;h(e,n,`fill`)}),l.restore(),l.restore(),c},Nt=(e,t,n)=>{w.fallbacks++,t.save(),t.font=Je(e);let r=v(e.opacity),i=n??e.x,a=e.lines.length>0?e.lines:[e.text],o=e.lines.length>1&&e.lineHeightPx>0?e.lineHeightPx:e.fontSize,s=e.y+e.fontSize;if(!e.isScrolling&&e.staticWidthScale!==1){let n=i+e.width/2;t.translate(n,e.y),t.scale(e.staticWidthScale,e.staticWidthScale),i=-e.width/2,s=e.fontSize}let c=At(e,t,t,`fallback`,i),l=ce(e.color,r),u=e.renderStyle===`outline-only`,d=u?{blur:0,alpha:0}:bt(e.shadowIntensity,e.fontSize,r);at()&&console.log(`[Shadow Debug - Fallback]`,`
  Text: "${e.text}"`,`
  FontSize: ${e.fontSize}`,`
  Shadow intensity: ${e.shadowIntensity}`,`
  Shadow blur: ${d.blur}px`,`
  Shadow alpha: ${d.alpha}`,`
  Fill style: ${l}`),t.save(),t.shadowColor=`rgba(0, 0, 0, ${d.alpha})`,t.shadowBlur=d.blur,t.shadowOffsetX=0,t.shadowOffsetY=0,t.lineJoin=`round`,t.lineWidth=xt(),t.strokeStyle=wt(e),t.fillStyle=l,u&&a.forEach((e,t)=>{let n=s+t*o;c(e,n,`outline`)}),a.forEach((e,t)=>{let n=s+t*o;c(e,n,`fill`)}),t.restore(),t.restore()},Pt=(e,t,n)=>{try{if(!e.isActive||!t)return;let r=jt(e),i=e.getCachedTexture();if(e.getTextureCacheKey()!==r||!i){w.misses++,w.creates++;let n=Mt(e,t);e.setCachedTexture(n),e.setTextureCacheKey(r)}else w.hits++;let a=e.getCachedTexture();if(a){let r=n??e.x,{paddingX:i,paddingY:o}=Et(e),s=Dt(e),c=kt(e,a,r,i,s),l=c.x,u=e.y-o;c.scaleX===1&&c.scaleY===1?t.drawImage(a,l,u):t.drawImage(a,l,u,a.width*c.scaleX,a.height*c.scaleY),gt(`drawImage`,t,e,{x:l,y:u,width:a.width*c.scaleX,height:a.height*c.scaleY,sourceWidth:a.width,sourceHeight:a.height,meta:{statsTarget:`cache`,paddingX:i,paddingY:o,drawScale:s,drawScaleX:c.scaleX,drawScaleY:c.scaleY}}),vt();return}Nt(e,t,n),vt()}catch(r){De.error(`Comment.draw`,r,{text:e.text,isActive:e.isActive,hasContext:!!t,interpolatedX:n})}},Ft=e=>e===`ltr`?`ltr`:`rtl`,It=e=>e===`ltr`?1:-1,Lt=class{text;vposMs;commands;layout;isScrolling;size;sizeScale;opacityMultiplier;opacityOverride;colorOverride;isInvisible;isFull;isEnder;meta;x=0;y=0;width=0;height=0;baseSpeed=0;speed=0;lane=-1;color;fontSize=0;fontFamily;fontWeight;opacity;activationTimeMs=null;staticExpiryTimeMs=null;isActive=!1;hasShown=!1;isPaused=!1;lastUpdateTime=0;reservationWidth=0;bufferWidth=0;visibleDurationMs=0;totalDurationMs=0;preCollisionDurationMs=0;speedPixelsPerMs=0;virtualStartX=0;exitThreshold=0;scrollDirection=`rtl`;renderStyle=`outline-only`;shadowIntensity=`medium`;creationIndex=0;letterSpacing=0;lineHeightMultiplier=1;lineHeightPx=0;slotHeight=0;staticWidthScale=1;lines=[];epochId=0;directionSign=-1;timeSource;lastSyncedSettingsVersion=-1;cachedTexture=null;textureCacheKey=``;constructor(e,t,n,r,i={},a=null){if(typeof e!=`string`)throw Error(`Comment text must be a string`);if(!Number.isFinite(t)||t<0)throw Error(`Comment vposMs must be a non-negative number`);this.text=e,this.vposMs=t,this.commands=Array.isArray(n)?[...n]:[],this.meta=a?{...a}:null;let o=ae(this.commands,{defaultColor:r.commentColor});this.layout=o.layout,this.isScrolling=this.layout===`naka`,this.size=o.size,this.sizeScale=o.sizeScale,this.opacityMultiplier=o.opacityMultiplier,this.opacityOverride=o.opacityOverride,this.colorOverride=o.colorOverride,this.isInvisible=o.isInvisible,this.isFull=o.isFull,this.isEnder=o.isEnder,this.fontFamily=o.fontFamily,this.fontWeight=o.fontWeight,this.color=o.resolvedColor,this.opacity=this.getEffectiveOpacity(r.commentOpacity),this.renderStyle=r.renderStyle,this.shadowIntensity=r.shadowIntensity,this.letterSpacing=o.letterSpacing,this.lineHeightMultiplier=o.lineHeight,this.timeSource=i.timeSource??ue(),this.applyScrollDirection(r.scrollDirection),this.syncWithSettings(r,i.settingsVersion)}prepare(e,t,n,r){et(this,e,t,n,r)}draw(e,t=null){Pt(this,e,t)}update(e=1,t=!1){try{if(!this.isActive){this.isPaused=t;return}let n=this.timeSource.now();if(!this.isScrolling){this.isPaused=t,this.lastUpdateTime=n;return}if(t){this.isPaused=!0,this.lastUpdateTime=n;return}let r=(n-this.lastUpdateTime)/(1e3/60);this.speed=this.baseSpeed*e,this.x+=this.speed*r*this.directionSign,(this.scrollDirection===`rtl`&&this.x<=this.exitThreshold||this.scrollDirection===`ltr`&&this.x>=this.exitThreshold)&&(this.isActive=!1),this.lastUpdateTime=n,this.isPaused=!1}catch(n){De.error(`Comment.update`,n,{text:this.text,playbackRate:e,isPaused:t,isActive:this.isActive})}}syncWithSettings(e,t){typeof t==`number`&&t===this.lastSyncedSettingsVersion||(this.color=this.getEffectiveColor(e.commentColor),this.opacity=this.getEffectiveOpacity(e.commentOpacity),this.applyScrollDirection(e.scrollDirection),this.renderStyle=e.renderStyle,this.shadowIntensity=e.shadowIntensity,typeof t==`number`&&(this.lastSyncedSettingsVersion=t))}getEffectiveColor(e){let t=this.colorOverride??e;return typeof t!=`string`||t.length===0?e:t.toUpperCase()}getEffectiveOpacity(e){if(typeof this.opacityOverride==`number`)return v(this.opacityOverride);let t=e*this.opacityMultiplier;return Number.isFinite(t)?v(t):0}markActivated(e){this.activationTimeMs=e}clearActivation(){this.activationTimeMs=null,this.isScrolling||(this.staticExpiryTimeMs=null),this.resetTextureCache()}hasStaticExpired(e){return this.isScrolling||this.staticExpiryTimeMs===null?!1:e>=this.staticExpiryTimeMs}getDirectionSign(){return this.directionSign}getTimeSource(){return this.timeSource}getTextureCacheKey(){return this.textureCacheKey}setTextureCacheKey(e){this.textureCacheKey=e}getCachedTexture(){return this.cachedTexture}setCachedTexture(e){this.cachedTexture=e}resetTextureCache(){this.cachedTexture=null,this.textureCacheKey=``}applyScrollDirection(e){let t=Ft(e);this.scrollDirection=t,this.directionSign=It(t)}},Rt={commentColor:`#FFFFFF`,commentOpacity:1,isCommentVisible:!0,useContainerResizeObserver:!0,ngWords:[],ngRegexps:[],scrollDirection:`rtl`,renderStyle:`outline-only`,syncMode:`raf`,scrollVisibleDurationMs:null,useFixedLaneCount:!1,fixedLaneCount:12,useDprScaling:!0,shadowIntensity:`medium`},zt=()=>({...Rt,ngWords:[...Rt.ngWords],ngRegexps:[...Rt.ngRegexps]}),Bt=e=>Number.isFinite(e)?e<=0?0:e>=1?1:e:1,Vt=e=>{let t=e.scrollVisibleDurationMs,n=t==null?null:Number.isFinite(t)?Math.max(1,Math.floor(t)):null;return{...e,scrollDirection:e.scrollDirection===`ltr`?`ltr`:`rtl`,commentOpacity:Bt(e.commentOpacity),renderStyle:e.renderStyle===`classic`?`classic`:`outline-only`,scrollVisibleDurationMs:n,syncMode:e.syncMode===`video-frame`?`video-frame`:`raf`,useDprScaling:!!e.useDprScaling}},Ht=e=>typeof window<`u`&&typeof window.requestAnimationFrame==`function`&&typeof window.cancelAnimationFrame==`function`?{request:e=>window.requestAnimationFrame(e),cancel:e=>window.cancelAnimationFrame(Number(e))}:{request:t=>globalThis.setTimeout(()=>{t(e.now())},16),cancel:e=>{globalThis.clearTimeout(e)}},Ut=()=>typeof document>`u`?()=>{throw Error(`Document is not available. Provide a custom createCanvasElement implementation.`)}:()=>document.createElement(`canvas`),Wt=e=>{if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.commentColor==`string`&&typeof t.commentOpacity==`number`&&typeof t.isCommentVisible==`boolean`},Gt=e=>{let t=e.meta?.no;return typeof t==`number`&&Number.isFinite(t)?t:null},Kt=function(e){if(!Array.isArray(e)||e.length===0)return[];let t=[];this.commentDependencies.settingsVersion=this.settingsVersion;for(let n of e){let{text:e,vposMs:r,commands:i=[],meta:a=null}=n,o=st(e);if(this.isNGComment(e)){C(`comment-skip-ng`,{preview:o,vposMs:r});continue}let s=de(r);if(s===null){this.log.warn(`CommentRenderer.addComment.invalidVpos`,{text:e,vposMs:r}),C(`comment-skip-invalid-vpos`,{preview:o,vposMs:r});continue}let c=a?.no===void 0?`fallback:${e}\0${s}`:`no:${a.source??``}:${a.fork??``}:${a.threadId??``}:${a.no}`,l=e=>e.meta?.no===void 0?`fallback:${e.text}\0${e.vposMs}`:`no:${e.meta.source??``}:${e.meta.fork??``}:${e.meta.threadId??``}:${e.meta.no}`;if(this.comments.some(e=>l(e)===c)||t.some(e=>l(e)===c)){C(`comment-skip-duplicate`,{preview:o,vposMs:s});continue}let u=new Lt(e,s,i,this._settings,this.commentDependencies,a);u.creationIndex=this.commentSequence++,u.epochId=this.epochId,t.push(u),C(`comment-added`,{preview:o,vposMs:s,commands:u.commands.length,layout:u.layout,isScrolling:u.isScrolling,invisible:u.isInvisible})}return t.length===0?[]:(this.comments.push(...t),this.comments.sort((e,t)=>{let n=e.vposMs-t.vposMs;if(Math.abs(n)>x)return n;let r=Gt(e),i=Gt(t);return r!==null&&i!==null&&Math.abs(r-i)>x?r-i:e.creationIndex-t.creationIndex}),t)},qt=function(e,t,n=[],r=null){let[i]=this.addComments([{text:e,vposMs:t,commands:n,meta:r}]);return i??null},Jt=function(){if(this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.commentSequence=0,this.ctx&&this.canvas){let e=this.canvasDpr>0?this.canvasDpr:1,t=this.displayWidth>0?this.displayWidth:this.canvas.width/e,n=this.displayHeight>0?this.displayHeight:this.canvas.height/e;this.ctx.clearRect(0,0,t,n)}},Yt=function(){this.clearComments(),this.currentTime=0,this.resetFinalPhaseState(),this.playbackHasBegun=!1,this.skipDrawingForCurrentFrame=!1,this.isStalled=!1,this.pendingInitialSync=!1},Xt=function(){let e=this._settings,t=Array.isArray(e.ngWords)?e.ngWords:[];this.normalizedNgWords=t.filter(e=>typeof e==`string`);let n=Array.isArray(e.ngRegexps)?e.ngRegexps:[];this.compiledNgRegexps=n.map(e=>{if(typeof e!=`string`)return null;try{return new RegExp(e,`i`)}catch(t){return this.log.warn(`CommentRenderer.invalidNgRegexp`,t,{entry:e}),null}}).filter(e=>!!e)},Zt=function(e){return typeof e!=`string`||e.length===0?!1:this.normalizedNgWords.some(t=>t.length>0&&e.includes(t))?!0:this.compiledNgRegexps.some(t=>t.test(e))},Qt=e=>{e.prototype.addComments=Kt,e.prototype.addComment=qt,e.prototype.clearComments=Jt,e.prototype.resetState=Yt,e.prototype.rebuildNgMatchers=Xt,e.prototype.isNGComment=Zt},$t=({vposMs:e,durationMs:t,isScrolling:n})=>{let r=Number.isFinite(t)&&t>0?Math.max(0,t-b):e,i=Math.min(e,r);return{displayVposMs:i,activationVposMs:n?Math.max(0,i-ze):i}},en=function(){this.finalPhaseActive=!1,this.finalPhaseStartTime=null,this.finalPhaseScheduleDirty=!1,this.finalPhaseVposOverrides.clear()},tn=function(e){let t=this.epochId;if(this.epochId+=1,lt(t,this.epochId,e),this.eventHooks.onEpochChange){let n={previousEpochId:t,newEpochId:this.epochId,reason:e,timestamp:this.timeSource.now()};try{this.eventHooks.onEpochChange(n)}catch(e){this.log.error(`CommentRenderer.incrementEpoch.callback`,e,{info:n})}}this.comments.forEach(e=>{e.epochId=this.epochId})},nn=function(e){let t=this.timeSource.now();if(t-this.lastSnapshotEmitTime<this.snapshotEmitThrottleMs)return;let n={currentTime:this.currentTime,duration:this.duration,isPlaying:this.isPlaying,epochId:this.epochId,totalComments:this.comments.length,activeComments:this.activeComments.size,reservedLanes:this.reservedLanes.size,finalPhaseActive:this.finalPhaseActive,playbackHasBegun:this.playbackHasBegun,isStalled:this.isStalled};if(ct(e,n),this.eventHooks.onStateSnapshot)try{this.eventHooks.onStateSnapshot(n)}catch(e){this.log.error(`CommentRenderer.emitStateSnapshot.callback`,e)}this.lastSnapshotEmitTime=t},rn=function(e){return $t({vposMs:e.vposMs,durationMs:this.duration,isScrolling:e.isScrolling}).activationVposMs},an=function(e){if(!e.isScrolling)return b;let t=[];return Number.isFinite(e.visibleDurationMs)&&e.visibleDurationMs>0&&t.push(e.visibleDurationMs),Number.isFinite(e.totalDurationMs)&&e.totalDurationMs>0&&t.push(e.totalDurationMs),t.length>0?Math.max(...t):fe},on=function(e){return this.getEffectiveCommentVpos(e)},sn=function(){this.finalPhaseVposOverrides.clear(),this.finalPhaseScheduleDirty=!1},cn=e=>{e.prototype.resetFinalPhaseState=en,e.prototype.incrementEpoch=tn,e.prototype.emitStateSnapshot=nn,e.prototype.getEffectiveCommentVpos=rn,e.prototype.getFinalPhaseDisplayDuration=an,e.prototype.resolveFinalPhaseVpos=on,e.prototype.recomputeFinalPhaseTimeline=sn},ln=function(){return!this.playbackHasBegun&&!this.isPlaying&&this.currentTime<=Ce},un=function(){this.playbackHasBegun||(this.isPlaying||this.currentTime>Ce)&&(this.playbackHasBegun=!0)},dn=e=>{e.prototype.shouldSuppressRendering=ln,e.prototype.updatePlaybackProgressState=un},fn=function(e){let t=this.videoElement,n=this.canvas,r=this.ctx;if(!t||!n||!r)return;let i=typeof e==`number`?e:y(t.currentTime);if(this.currentTime=i,this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.updatePlaybackProgressState(),this.skipDrawingForCurrentFrame=this.shouldSuppressRendering(),this.skipDrawingForCurrentFrame)return;let a=this.canvasDpr>0?this.canvasDpr:1,o=this.displayWidth>0?this.displayWidth:n.width/a,s=this.displayHeight>0?this.displayHeight:n.height/a,c=this.buildPrepareOptions(o);this.pruneStaticLaneReservations(this.currentTime);for(let e of Array.from(this.activeComments)){let t=this.getEffectiveCommentVpos(e),n=t<this.currentTime-ye,r=t>this.currentTime+ye;n||r?(e.isActive=!1,this.activeComments.delete(e),e.clearActivation(),e.lane>=0&&(e.layout===`ue`?this.releaseStaticLane(`ue`,e.lane):e.layout===`shita`&&this.releaseStaticLane(`shita`,e.lane))):e.isScrolling&&e.hasShown&&(e.scrollDirection===`rtl`&&e.x<=e.exitThreshold||e.scrollDirection===`ltr`&&e.x>=e.exitThreshold)&&(e.isActive=!1,this.activeComments.delete(e),e.clearActivation())}let l=this.getCommentsInTimeWindow(this.currentTime,ye);for(let e of l){let t=at(),n=t?st(e.text):``;if(t&&C(`comment-evaluate`,{stage:`update`,preview:n,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),currentTime:this.currentTime,isActive:e.isActive,hasShown:e.hasShown}),this.isNGComment(e.text))t&&C(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),reason:`ng-runtime`});else if(e.isInvisible)t&&C(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),reason:`invisible`}),e.isActive=!1,this.activeComments.delete(e),e.hasShown=!0,e.clearActivation();else if(e.syncWithSettings(this._settings,this.settingsVersion),this.shouldActivateCommentAtTime(e,this.currentTime,n)&&this.activateComment(e,r,o,s,c,this.currentTime),e.isActive){if(e.layout!==`naka`&&e.hasStaticExpired(this.currentTime)){let t=e.layout===`ue`?`ue`:`shita`;this.releaseStaticLane(t,e.lane),e.isActive=!1,this.activeComments.delete(e),e.clearActivation();continue}if(e.layout===`naka`&&this.getEffectiveCommentVpos(e)>this.currentTime+Ce){e.x=e.virtualStartX,e.lastUpdateTime=this.timeSource.now();continue}if(e.hasShown=!0,e.update(this.playbackRate,!this.isPlaying),!e.isScrolling&&e.hasStaticExpired(this.currentTime)){let t=e.layout===`ue`?`ue`:`shita`;this.releaseStaticLane(t,e.lane),e.isActive=!1,this.activeComments.delete(e),e.clearActivation()}}}},pn=function(e){let t=this._settings.scrollVisibleDurationMs,n=fe,r=pe;return t!==null&&(n=t,r=t),{visibleWidth:e,virtualExtension:be,maxVisibleDurationMs:n,minVisibleDurationMs:r,maxWidthRatio:me,bufferRatio:he,baseBufferPx:ge,entryBufferPx:_e}},mn=function(e){let t=this.currentTime;this.pruneLaneReservations(t),this.pruneStaticLaneReservations(t);let n=this.createLaneReservation(e,t),r=[...this.reservedLanes.values()].flat().filter(e=>this.areReservationsConflicting(e,n)).sort((e,t)=>e.verticalStart-t.verticalStart),i=Math.max(1,e.slotHeight||e.height),a=Math.max(1,this.displayHeight||this.canvas?.height||i),o=this._settings.useFixedLaneCount?Math.min(a,Math.max(i,this.laneCount*this.laneHeight)):a,s=Ne(a),c=[],l=[],u=0,d=!1;for(;;){c.push(u);let e=u+i,t=r.find(t=>!(t.verticalEnd<u||e<t.verticalStart));if(!t)break;if(l.push(`${t.comment.creationIndex}@${t.comment.vposMs}:${t.verticalStart.toFixed(3)}-${t.verticalEnd.toFixed(3)}`),u=t.verticalEnd+s,u+i>=o){d=!0,u=Math.random()*(o-i);break}}return n.verticalStart=u,n.verticalEnd=u+i,this.storeLaneReservation(u,n),_t(`laneDecision`,e,{meta:{currentTimeMs:t,selectedLane:u,selectedTop:u,selectedBottom:u+i,slotHeight:i,usedFallback:d,candidateLanes:c.map(e=>e.toFixed(3)).join(`,`),availableLanes:u.toFixed(3),nextAvailableTimes:``,blockedBy:l.join(`,`),reservationStartTimeMs:Math.round(n.startTime),reservationEndTimeMs:Math.round(n.endTime),reservationTotalEndTimeMs:Math.round(n.totalEndTime),reservationWidth:Math.round(n.width)}}),u},hn=e=>{e.prototype.updateComments=fn,e.prototype.buildPrepareOptions=pn,e.prototype.findAvailableLane=mn},gn=function(e,t){let n=0,r=e.length;for(;n<r;){let i=Math.floor((n+r)/2),a=e[i];a!==void 0&&a.totalEndTime+ve<=t?n=i+1:r=i}return n},_n=function(e){for(let[t,n]of this.reservedLanes.entries()){let r=this.findFirstValidReservationIndex(n,e);r>=n.length?this.reservedLanes.delete(t):r>0&&this.reservedLanes.set(t,n.slice(r))}},vn=function(e){let t=t=>t.filter(t=>t.releaseTime>e),n=t(this.topStaticLaneReservations),r=t(this.bottomStaticLaneReservations);this.topStaticLaneReservations.length=0,this.topStaticLaneReservations.push(...n),this.bottomStaticLaneReservations.length=0,this.bottomStaticLaneReservations.push(...r)},yn=e=>{e.prototype.findFirstValidReservationIndex=gn,e.prototype.pruneLaneReservations=_n,e.prototype.pruneStaticLaneReservations=vn},bn=function(e){let t=0,n=this.comments.length;for(;t<n;){let r=Math.floor((t+n)/2),i=this.comments[r];i!==void 0&&i.vposMs<e?t=r+1:n=r}return t},xn=function(e,t){if(this.comments.length===0)return[];let n=e-t,r=e+t,i=Math.max(0,this.duration-b-ze),a=this.duration>0&&r>=i,o=this.findCommentIndexAtOrAfter(n),s=[];for(let e=o;e<this.comments.length;e++){let t=this.comments[e];if(!t)continue;if(!a&&t.vposMs>r)break;let i=this.getEffectiveCommentVpos(t);i>=n&&i<=r&&s.push(t)}return s},Sn=function(e){return e===`ue`?this.topStaticLaneReservations:this.bottomStaticLaneReservations},Cn=function(e){return e===`ue`?this.topStaticLaneReservations.length:this.bottomStaticLaneReservations.length},wn=function(e){let t=e===`ue`?`shita`:`ue`,n=this.getStaticLaneDepth(t),r=this.laneCount-n;return r<=0?-1:r-1},Tn=function(e){return Math.max(0,this.laneCount-1-e)},En=function(e,t,n,r){let i=this.pendingStaticPlacementOffsets.get(r);if(i!==void 0)return this.pendingStaticPlacementOffsets.delete(r),i;let a=Math.max(1,n),o=Math.max(1,r.slotHeight||r.height),s=Ne(a);if(e===`ue`){let n=0,r=this.getStaticReservations(e).filter(e=>e.lane<t).sort((e,t)=>e.lane-t.lane);for(let e of r){let t=e.yEnd-e.yStart;n+=t+s}return n}let c=a,l=this.getStaticReservations(e).filter(e=>e.lane<t).sort((e,t)=>e.lane-t.lane);for(let e of l){let t=e.yEnd-e.yStart;c-=t+s}let u=c-o;return Math.max(0,u)},Dn=function(){let e=new Set;for(let t of this.topStaticLaneReservations)e.add(t.lane);for(let t of this.bottomStaticLaneReservations)e.add(this.getGlobalLaneIndexForBottom(t.lane));return e},On=e=>{e.prototype.findCommentIndexAtOrAfter=bn,e.prototype.getCommentsInTimeWindow=xn,e.prototype.getStaticReservations=Sn,e.prototype.getStaticLaneDepth=Cn,e.prototype.getStaticLaneLimit=wn,e.prototype.getGlobalLaneIndexForBottom=Tn,e.prototype.resolveStaticCommentOffset=En,e.prototype.getStaticReservedLaneSet=Dn},kn=e=>Math.max(1,e.slotHeight||e.height),An=({position:e,reservationHeight:t,displayHeight:n,reservations:r,currentTime:i,random:a=Math.random})=>{let o=Math.max(1,n),s=Math.max(1,t),c=Ne(o),l=r.filter(e=>e.releaseTime>i),u=e===`ue`?[0,...l.sort((e,t)=>e.yEnd-t.yEnd).map(e=>e.yEnd+c)]:[o-s,...l.sort((e,t)=>t.yStart-e.yStart).map(e=>e.yStart-c-s)];if(s<o){for(let e of u)if(!(e<0||e+s>o)&&!l.some(t=>!(e+s<=t.yStart||e>=t.yEnd)))return{y:e,usedFallback:!1};return{y:a()*(o-s),usedFallback:!0}}return{y:e===`ue`?0:o-s,usedFallback:l.length>0}},jn=function(e,t,n=``){let r=n.length>0&&at(),i=this.resolveFinalPhaseVpos(e);return e.isInvisible?(r&&C(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`invisible`}),!1):e.isActive?(r&&C(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`already-active`}),!1):e.hasShown&&i<=t?(r&&C(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`already-shown`,currentTime:t}),!1):i>t+Ce?(r&&C(`comment-eval-pending`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`future`,currentTime:t}),!1):i<t-ye?(r&&C(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`expired-window`,currentTime:t}),!1):!e.isScrolling&&i+b<=t?(r&&C(`comment-eval-skip`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,reason:`static-expired`,currentTime:t}),!1):(r&&C(`comment-eval-ready`,{preview:n,vposMs:e.vposMs,effectiveVposMs:i,currentTime:t}),!0)},Mn=function(e,t,n,r,i,a){e.prepare(t,n,r,i);let o=this.resolveFinalPhaseVpos(e);if(at()&&C(`comment-prepared`,{preview:st(e.text),layout:e.layout,isScrolling:e.isScrolling,width:e.width,height:e.height,bufferWidth:e.bufferWidth,visibleDurationMs:e.visibleDurationMs,effectiveVposMs:o}),e.layout===`naka`){let t=Math.max(0,a-o),n=e.speedPixelsPerMs*t;e.x=e.scrollDirection===`rtl`?e.virtualStartX-n:e.virtualStartX+n;let i=this.findAvailableLane(e),s=Math.max(1,this.laneHeight);e.lane=Math.max(0,Math.round(i/s));let c=Math.max(0,r-e.height);e.y=Math.max(0,Math.min(i,c))}else{let t=e.layout===`ue`?`ue`:`shita`,n=this.assignStaticLane(t,e,r,a),i=this.resolveStaticCommentOffset(t,n,r,e);e.x=e.virtualStartX,e.y=i,e.lane=t===`ue`?n:this.getGlobalLaneIndexForBottom(n),e.speed=0,e.baseSpeed=0,e.speedPixelsPerMs=0;let s=o+b;e.visibleDurationMs=Math.max(0,s-a),this.activeComments.add(e),e.isActive=!0,e.hasShown=!0,e.isPaused=!this.isPlaying,e.markActivated(a),e.lastUpdateTime=this.timeSource.now(),e.staticExpiryTimeMs=s,this.reserveStaticLane(t,e,n,s),at()&&C(`comment-activate-static`,{preview:st(e.text),lane:e.lane,position:t,displayEnd:s,effectiveVposMs:o});return}this.activeComments.add(e),e.isActive=!0,e.hasShown=!0,e.isPaused=!this.isPlaying,e.markActivated(a),e.lastUpdateTime=this.timeSource.now()},Nn=function(e,t,n,r){let i=this.getStaticReservations(e),a=An({position:e,reservationHeight:kn(t),displayHeight:n,reservations:i,currentTime:r});this.pendingStaticPlacementOffsets.set(t,a.y);let o=new Set(i.map(e=>e.lane)),s=0;for(;o.has(s);)s++;return s},Pn=function(e,t,n,r){let i=this.getStaticReservations(e),a=t.y,o=t.y+kn(t);i.push({comment:t,releaseTime:r,yStart:a,yEnd:o,lane:n})},Fn=function(e,t){if(t<0)return;let n=this.getStaticReservations(e),r=n.findIndex(n=>e===`shita`?this.getGlobalLaneIndexForBottom(n.lane)===t:n.lane===t);r>=0&&n.splice(r,1)},In=e=>{e.prototype.shouldActivateCommentAtTime=jn,e.prototype.activateComment=Mn,e.prototype.assignStaticLane=Nn,e.prototype.reserveStaticLane=Pn,e.prototype.releaseStaticLane=Fn},Ln=.001,Rn=function(){return Array.from({length:this.laneCount},(e,t)=>t)},zn=function(e,t){let n=this.reservedLanes.get(e);if(!n||n.length===0)return t;let r=n[this.findFirstValidReservationIndex(n,t)];return r?Math.max(t,r.endTime+ve):t},Bn=function(e,t){let n=Math.max(e.speedPixelsPerMs,x),r=this.getEffectiveCommentVpos(e),i=Math.max(0,Number.isFinite(r)?r:t),a=Number.isFinite(e.width)&&e.width>0?e.width:e.reservationWidth,o=i+(n>0?Math.max(a,0)/n:e.preCollisionDurationMs)+ve,s=i+e.totalDurationMs+ve;return{comment:e,startTime:i,endTime:Math.max(i,o),totalEndTime:Math.max(i,s),startLeft:e.virtualStartX,width:a,speed:n,buffer:0,directionSign:e.getDirectionSign(),verticalStart:0,verticalEnd:Math.max(1,e.slotHeight||e.height)}},Vn=function(e,t,n){let r=Math.max(1,t.verticalEnd-t.verticalStart);return t.verticalStart=e,t.verticalEnd=e+r,[...this.reservedLanes.values()].flat().every(e=>e.totalEndTime<=n||e.verticalEnd<t.verticalStart||t.verticalEnd<e.verticalStart||!this.areReservationsConflicting(e,t))},Hn=function(e,t){let n=[...this.reservedLanes.get(e)??[],t].sort((e,t)=>e.totalEndTime-t.totalEndTime);this.reservedLanes.set(e,n)},Un=function(e,t){if(e.directionSign===t.directionSign){let n=e.speed>0?Math.max(e.width,0)/e.speed:0,r=t.speed>0?Math.max(t.width,0)/t.speed:0,i=Math.max(n,r);return Math.abs(t.startTime-e.startTime)+Ln<i}let n=Math.max(e.startTime,t.startTime),r=Math.min(e.endTime,t.endTime);if(n>=r)return!1;let i=new Set([n,r,n+(r-n)/2]),a=this.solveLeftRightEqualityTime(e,t);a!==null&&a>=n-x&&a<=r+x&&i.add(a);let o=this.solveLeftRightEqualityTime(t,e);o!==null&&o>=n-x&&o<=r+x&&i.add(o);for(let a of i){if(a<n-x||a>r+x)continue;let i=this.computeForwardGap(e,t,a),o=this.computeForwardGap(t,e,a);if(i<=-24&&o<=-24)return!0}return!1},Wn=function(e,t,n){let r=this.getBufferedEdges(e,n),i=this.getBufferedEdges(t,n);return r.left-i.right},Gn=function(e,t){let n=Math.max(0,t-e.startTime),r=e.speed*n,i=e.startLeft+e.directionSign*r;return{left:i-e.buffer,right:i+e.width+e.buffer}},Kn=function(e,t){let n=e.directionSign,r=t.directionSign,i=r*t.speed-n*e.speed;if(Math.abs(i)<x)return null;let a=(t.startLeft+r*t.speed*t.startTime+t.width+t.buffer-e.startLeft-n*e.speed*e.startTime+e.buffer)/i;return Number.isFinite(a)?a:null},qn=e=>{e.prototype.getLanePriorityOrder=Rn,e.prototype.getLaneNextAvailableTime=zn,e.prototype.createLaneReservation=Bn,e.prototype.isLaneAvailable=Vn,e.prototype.storeLaneReservation=Hn,e.prototype.areReservationsConflicting=Un,e.prototype.computeForwardGap=Wn,e.prototype.getBufferedEdges=Gn,e.prototype.solveLeftRightEqualityTime=Kn},Jn=function(){let e=this.canvas,t=this.ctx;if(!e||!t)return;let n=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:e.width/n,i=this.displayHeight>0?this.displayHeight:e.height/n,a=this.timeSource.now();if(this.skipDrawingForCurrentFrame||this.shouldSuppressRendering()||this.isStalled){t.clearRect(0,0,r,i),this.lastDrawTime=a;return}t.clearRect(0,0,r,i);let o=Array.from(this.activeComments);if(this._settings.isCommentVisible){let e=(a-this.lastDrawTime)/16.666666666666668;o.sort((e,t)=>{let n=this.getEffectiveCommentVpos(e)-this.getEffectiveCommentVpos(t);return Math.abs(n)>x?n:e.isScrolling===t.isScrolling?e.creationIndex-t.creationIndex:e.isScrolling?1:-1}),o.forEach(n=>{let r=this.isPlaying&&!n.isPaused?n.x+n.getDirectionSign()*n.speed*e:n.x;n.draw(t,r)})}this.lastDrawTime=a},Yn=function(e){let t=this.videoElement,n=this.canvas,r=this.ctx;if(!t||!n||!r)return;let i=typeof e==`number`?e:y(t.currentTime);this.currentTime=i,this.lastDrawTime=this.timeSource.now();let a=this.canvasDpr>0?this.canvasDpr:1,o=this.displayWidth>0?this.displayWidth:n.width/a,s=this.displayHeight>0?this.displayHeight:n.height/a,c=this.buildPrepareOptions(o);this.activeComments.forEach(e=>{e.isActive=!1,e.clearActivation()}),this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.getCommentsInTimeWindow(this.currentTime,ye).forEach(e=>{this.isNGComment(e.text)||e.isInvisible?(e.isActive=!1,this.activeComments.delete(e),e.clearActivation()):(e.syncWithSettings(this._settings,this.settingsVersion),e.isActive=!1,this.activeComments.delete(e),e.lane=-1,e.hasShown=!1,e.clearActivation(),this.shouldActivateCommentAtTime(e,this.currentTime)?this.activateComment(e,r,o,s,c,this.currentTime):e.hasShown=this.getEffectiveCommentVpos(e)<this.currentTime-ye)})},Xn=e=>{e.prototype.draw=Jn,e.prototype.performInitialSync=Yn},Zn=function(e){this.videoElement&&this._settings.isCommentVisible&&(this.pendingInitialSync&&=(this.performInitialSync(e),!1),this.updateComments(e),this.draw())},Qn=function(){let e=this.frameId;this.frameId=null,e!==null&&this.animationFrameProvider.cancel(e),this.processFrame(),this.scheduleNextFrame()},$n=function(e,t){this.videoFrameHandle=null;let n=typeof t?.mediaTime==`number`?t.mediaTime*1e3:void 0;this.processFrame(typeof n==`number`?n:void 0),this.scheduleNextFrame()},er=function(){if(this._settings.syncMode!==`video-frame`)return!1;let e=this.videoElement;return!!e&&typeof e.requestVideoFrameCallback==`function`&&typeof e.cancelVideoFrameCallback==`function`},tr=function(){let e=this.videoElement;if(e){if(this.shouldUseVideoFrameCallback()){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback();let t=e.requestVideoFrameCallback;typeof t==`function`&&(this.videoFrameHandle=t.call(e,this.handleVideoFrame));return}this.cancelVideoFrameCallback(),this.frameId=this.animationFrameProvider.request(this.handleAnimationFrame)}},nr=function(){this.frameId!==null&&(this.animationFrameProvider.cancel(this.frameId),this.frameId=null)},rr=function(){if(this.videoFrameHandle===null)return;let e=this.videoElement;e&&typeof e.cancelVideoFrameCallback==`function`&&e.cancelVideoFrameCallback(this.videoFrameHandle),this.videoFrameHandle=null},ir=function(){this.stopAnimation(),this.scheduleNextFrame()},ar=function(){this.cancelAnimationFrameRequest(),this.cancelVideoFrameCallback()},or=function(){let e=this.canvas,t=this.ctx,n=this.videoElement;if(!e||!t||!n)return;let r=y(n.currentTime),i=Math.abs(r-this.currentTime),a=this.timeSource.now();if(a-this.lastPlayResumeTime<this.playResumeSeekIgnoreDurationMs){this.currentTime=r,this._settings.isCommentVisible&&(this.lastDrawTime=a,this.draw());return}let o=i>Ce;if(this.currentTime=r,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),!o){this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw());return}this.activeComments.clear(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0;let s=this.canvasDpr>0?this.canvasDpr:1,c=this.displayWidth>0?this.displayWidth:e.width/s,l=this.displayHeight>0?this.displayHeight:e.height/s,u=this.buildPrepareOptions(c);this.getCommentsInTimeWindow(this.currentTime,ye).forEach(e=>{let n=at(),r=n?st(e.text):``;n&&C(`comment-evaluate`,{stage:`seek`,preview:r,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),currentTime:this.currentTime,isActive:e.isActive,hasShown:e.hasShown}),this.isNGComment(e.text)?(n&&C(`comment-eval-skip`,{preview:r,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),reason:`ng-runtime`}),e.isActive=!1,this.activeComments.delete(e),e.clearActivation()):e.isInvisible?(n&&C(`comment-eval-skip`,{preview:r,vposMs:e.vposMs,effectiveVposMs:this.getEffectiveCommentVpos(e),reason:`invisible`}),e.isActive=!1,this.activeComments.delete(e),e.hasShown=!0,e.clearActivation()):(e.syncWithSettings(this._settings,this.settingsVersion),e.isActive=!1,this.activeComments.delete(e),e.lane=-1,e.hasShown=!1,e.clearActivation(),this.shouldActivateCommentAtTime(e,this.currentTime,r)?this.activateComment(e,t,c,l,u,this.currentTime):e.hasShown=this.getEffectiveCommentVpos(e)<this.currentTime-ye)}),this._settings.isCommentVisible&&(this.lastDrawTime=this.timeSource.now(),this.draw())},sr=e=>{e.prototype.processFrame=Zn,e.prototype.handleAnimationFrame=Qn,e.prototype.handleVideoFrame=$n,e.prototype.shouldUseVideoFrameCallback=er,e.prototype.scheduleNextFrame=tr,e.prototype.cancelAnimationFrameRequest=nr,e.prototype.cancelVideoFrameCallback=rr,e.prototype.startAnimation=ir,e.prototype.stopAnimation=ar,e.prototype.onSeek=or},cr=function(e,t){if(e)return e;if(t.parentElement)return t.parentElement;if(typeof document<`u`&&document.body)return document.body;throw Error(`Cannot resolve container element. Provide container explicitly when DOM is unavailable.`)},lr=function(e){typeof getComputedStyle==`function`?getComputedStyle(e).position===`static`&&(e.style.position=`relative`):e.style.position||(e.style.position=`relative`)},ur=function(e){try{this.destroyCanvasOnly();let t=e instanceof HTMLVideoElement?e:e.video,n=e instanceof HTMLVideoElement?e.parentElement:e.container??e.video.parentElement,r=this.resolveContainer(n??null,t);this.videoElement=t,this.containerElement=r,this.lastVideoSource=this.getCurrentVideoSource(),this.duration=Number.isFinite(t.duration)?y(t.duration):0,this.currentTime=y(t.currentTime),this.playbackRate=t.playbackRate,this.isPlaying=!t.paused,this.isStalled=!1,this.lastDrawTime=this.timeSource.now(),this.playbackHasBegun=this.isPlaying||this.currentTime>Ce,this.skipDrawingForCurrentFrame=this.shouldSuppressRendering();let i=this.createCanvasElement(),a=i.getContext(`2d`);if(!a)throw Error(`Failed to acquire 2D canvas context`);i.style.position=`absolute`,i.style.top=`0`,i.style.left=`0`,i.style.right=`0`,i.style.bottom=`0`,i.style.display=`block`,i.style.pointerEvents=`none`,i.style.zIndex=`2147483647`;let o=this.containerElement;o instanceof HTMLElement&&(this.ensureContainerPositioning(o),o.appendChild(i)),this.canvas=i,this.ctx=a,this.resize(),this.calculateLaneMetrics(),this.setupVideoEventListeners(t),this.setupResizeHandling(t),this.setupFullscreenHandling(),this.setupVideoChangeDetection(t,r),this.startAnimation(),this.setupVisibilityHandling()}catch(e){throw this.log.error(`CommentRenderer.initialize`,e),e}},dr=function(){this.stopAnimation(),this.cleanupResizeHandling(),this.runCleanupTasks(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.videoElement=null,this.containerElement=null,this.comments.length=0,this.activeComments.clear(),this.reservedLanes.clear(),this.resetFinalPhaseState(),this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.commentSequence=0,this.playbackHasBegun=!1,this.skipDrawingForCurrentFrame=!1,this.isStalled=!1,this.pendingInitialSync=!1},fr=function(){this.stopAnimation(),this.canvas&&this.canvas.remove(),this.canvas=null,this.ctx=null,this.displayWidth=0,this.displayHeight=0,this.canvasDpr=1,this.fullscreenActive=!1},pr=e=>{e.prototype.resolveContainer=cr,e.prototype.ensureContainerPositioning=lr,e.prototype.initialize=ur,e.prototype.destroy=dr,e.prototype.destroyCanvasOnly=fr},mr=function(e){try{let t=()=>{this.isPlaying=!0,this.playbackHasBegun=!0;let e=this.timeSource.now();this.lastDrawTime=e,this.lastPlayResumeTime=e,this.comments.forEach(t=>{t.lastUpdateTime=e,t.isPaused=!1})},n=()=>{this.isPlaying=!1;let e=this.timeSource.now();this.comments.forEach(t=>{t.lastUpdateTime=e,t.isPaused=!0})},r=()=>{this.onSeek()},i=()=>{this.onSeek()},a=()=>{this.playbackRate=e.playbackRate;let t=this.timeSource.now();this.comments.forEach(e=>{e.lastUpdateTime=t})},o=()=>{this.handleVideoMetadataLoaded(e)},s=()=>{this.duration=Number.isFinite(e.duration)?y(e.duration):0},c=()=>{this.handleVideoSourceChange()},l=()=>{this.handleVideoStalled()},u=()=>{this.handleVideoCanPlay()},d=()=>{this.handleVideoCanPlay()};e.addEventListener(`play`,t),e.addEventListener(`pause`,n),e.addEventListener(`seeking`,r),e.addEventListener(`seeked`,i),e.addEventListener(`ratechange`,a),e.addEventListener(`loadedmetadata`,o),e.addEventListener(`durationchange`,s),e.addEventListener(`emptied`,c),e.addEventListener(`waiting`,l),e.addEventListener(`canplay`,u),e.addEventListener(`playing`,d),this.addCleanup(()=>e.removeEventListener(`play`,t)),this.addCleanup(()=>e.removeEventListener(`pause`,n)),this.addCleanup(()=>e.removeEventListener(`seeking`,r)),this.addCleanup(()=>e.removeEventListener(`seeked`,i)),this.addCleanup(()=>e.removeEventListener(`ratechange`,a)),this.addCleanup(()=>e.removeEventListener(`loadedmetadata`,o)),this.addCleanup(()=>e.removeEventListener(`durationchange`,s)),this.addCleanup(()=>e.removeEventListener(`emptied`,c)),this.addCleanup(()=>e.removeEventListener(`waiting`,l)),this.addCleanup(()=>e.removeEventListener(`canplay`,u)),this.addCleanup(()=>e.removeEventListener(`playing`,d))}catch(e){throw this.log.error(`CommentRenderer.setupVideoEventListeners`,e),e}},hr=function(e){this.lastVideoSource=this.getCurrentVideoSource(),this.incrementEpoch(`metadata-loaded`),this.handleVideoSourceChange(e),this.resize(),this.calculateLaneMetrics(),this.onSeek(),this.emitStateSnapshot(`metadata-loaded`)},gr=function(){let e=this.canvas,t=this.ctx;if(!e||!t)return;this.isStalled=!0;let n=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:e.width/n,i=this.displayHeight>0?this.displayHeight:e.height/n;t.clearRect(0,0,r,i),this.comments.forEach(e=>{e.isActive&&(e.lastUpdateTime=this.timeSource.now())})},_r=function(){this.isStalled&&(this.isStalled=!1,this.videoElement&&(this.currentTime=y(this.videoElement.currentTime),this.isPlaying=!this.videoElement.paused),this.lastDrawTime=this.timeSource.now())},vr=function(e){let t=e??this.videoElement;if(!t){this.lastVideoSource=null,this.isPlaying=!1,this.resetFinalPhaseState(),this.resetCommentActivity();return}let n=this.getCurrentVideoSource();n!==this.lastVideoSource&&(this.lastVideoSource=n,this.incrementEpoch(`source-change`),this.syncVideoState(t),this.resetFinalPhaseState(),this.resetCommentActivity(),this.emitStateSnapshot(`source-change`))},yr=function(e){this.duration=Number.isFinite(e.duration)?y(e.duration):0,this.currentTime=y(e.currentTime),this.playbackRate=e.playbackRate,this.isPlaying=!e.paused,this.isStalled=!1,this.playbackHasBegun=this.isPlaying||this.currentTime>Ce,this.lastDrawTime=this.timeSource.now()},br=function(){let e=this.timeSource.now(),t=this.canvas,n=this.ctx;if(this.resetFinalPhaseState(),this.skipDrawingForCurrentFrame=!1,this.isStalled=!1,this.pendingInitialSync=!1,this.playbackHasBegun=this.isPlaying||this.currentTime>Ce,t&&n){let e=this.canvasDpr>0?this.canvasDpr:1,r=this.displayWidth>0?this.displayWidth:t.width/e,i=this.displayHeight>0?this.displayHeight:t.height/e;n.clearRect(0,0,r,i)}this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.comments.forEach(t=>{t.isActive=!1,t.isPaused=!this.isPlaying,t.hasShown=!1,t.lane=-1,t.x=t.virtualStartX,t.speed=t.baseSpeed,t.lastUpdateTime=e,t.clearActivation()}),this.activeComments.clear()},xr=function(e,t){if(typeof MutationObserver>`u`){this.log.debug(`MutationObserver is not available in this environment. Video change detection is disabled.`);return}let n=new MutationObserver(t=>{for(let n of t){if(n.type===`attributes`&&n.attributeName===`src`){let t=n.target,r=null,i=null;if((t instanceof HTMLVideoElement||t instanceof HTMLSourceElement)&&(r=typeof n.oldValue==`string`?n.oldValue:null,i=t.getAttribute(`src`)),r===i)continue;this.handleVideoSourceChange(e);return}if(n.type===`childList`){for(let t of n.addedNodes)if(t instanceof HTMLSourceElement){this.handleVideoSourceChange(e);return}for(let t of n.removedNodes)if(t instanceof HTMLSourceElement){this.handleVideoSourceChange(e);return}}}});n.observe(e,{attributes:!0,attributeFilter:[`src`],attributeOldValue:!0,childList:!0,subtree:!0}),this.addCleanup(()=>n.disconnect());let r=new MutationObserver(e=>{for(let t of e)if(t.type===`childList`){for(let e of t.addedNodes){let t=this.extractVideoElement(e);if(t&&t!==this.videoElement){this.initialize(t);return}}for(let e of t.removedNodes){if(e===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}if(e instanceof Element){let t=e.querySelector(`video`);if(t&&t===this.videoElement){this.videoElement=null,this.handleVideoSourceChange(null);return}}}}});r.observe(t,{childList:!0,subtree:!0}),this.addCleanup(()=>r.disconnect())},Sr=function(e){if(e instanceof HTMLVideoElement)return e;if(e instanceof Element){let t=e.querySelector(`video`);if(t instanceof HTMLVideoElement)return t}return null},Cr=e=>{e.prototype.setupVideoEventListeners=mr,e.prototype.handleVideoMetadataLoaded=hr,e.prototype.handleVideoStalled=gr,e.prototype.handleVideoCanPlay=_r,e.prototype.handleVideoSourceChange=vr,e.prototype.syncVideoState=yr,e.prototype.resetCommentActivity=br,e.prototype.setupVideoChangeDetection=xr,e.prototype.extractVideoElement=Sr},wr=function(){if(typeof document>`u`||typeof document.addEventListener!=`function`||typeof document.removeEventListener!=`function`)return;let e=()=>{document.visibilityState===`visible`?this._settings.isCommentVisible&&(this.handleVisibilityRestore(),this.startAnimation()):this.stopAnimation()};document.addEventListener(`visibilitychange`,e),this.addCleanup(()=>document.removeEventListener(`visibilitychange`,e)),document.visibilityState!==`visible`&&this.stopAnimation()},Tr=function(){let e=this.canvas,t=this.ctx,n=this.videoElement;e&&t&&n&&(this.currentTime=y(n.currentTime),this.lastDrawTime=this.timeSource.now(),this.isPlaying=!n.paused,this.isStalled=!1,this.pendingInitialSync=!0,this.resetFinalPhaseState(),this.updatePlaybackProgressState(),this.draw())},Er=function(e){let t=this._settings.isCommentVisible;if(this._settings.isCommentVisible=e,t===e)return;this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion;let n=this.canvas,r=this.ctx;if(n&&r){if(e)this.lastDrawTime=this.timeSource.now(),this.pendingInitialSync=!0,this.scheduleNextFrame();else{let e=this.canvasDpr>0?this.canvasDpr:1,t=this.displayWidth>0?this.displayWidth:n.width/e,i=this.displayHeight>0?this.displayHeight:n.height/e;r.clearRect(0,0,t,i)}}},Dr=e=>{e.prototype.setupVisibilityHandling=wr,e.prototype.handleVisibilityRestore=Tr,e.prototype.setCommentVisibility=Er},Or=768,kr=68.1645984649658,Ar=function(e,t){let n=this.videoElement,r=this.canvas,i=this.ctx;if(!n||!r)return;let a=(this.fullscreenActive&&r.parentElement instanceof HTMLElement?r.parentElement.getBoundingClientRect():null)??n.getBoundingClientRect(),o=this.canvasDpr>0?this.canvasDpr:1,s=this.displayWidth>0?this.displayWidth:r.width/o,c=this.displayHeight>0?this.displayHeight:r.height/o,l=e??a.width??s,u=t??a.height??c;if(!Number.isFinite(l)||!Number.isFinite(u)||l<=0||u<=0)return;let d=Math.max(1,Math.floor(l)),f=Math.max(1,Math.floor(u)),p=this._settings.useDprScaling?this.resolveDevicePixelRatio():1,m=Math.max(1,Math.round(d*p)),h=Math.max(1,Math.round(f*p));(this.displayWidth!==d||this.displayHeight!==f||Math.abs(this.canvasDpr-p)>2**-52||r.width!==m||r.height!==h)&&(this.displayWidth=d,this.displayHeight=f,this.canvasDpr=p,r.width=m,r.height=h,r.style.width=`${d}px`,r.style.height=`${f}px`,i&&(i.setTransform(1,0,0,1,0,0),this._settings.useDprScaling&&i.scale(p,p)),this.calculateLaneMetrics(),this.reservedLanes.clear(),this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0,this.performInitialSync(y(n.currentTime)),this.draw())},jr=function(){if(typeof window>`u`)return 1;let e=Number(window.devicePixelRatio);return!Number.isFinite(e)||e<=0?1:e},Mr=function(){let e=this.canvas;if(!e)return;let t=this.displayHeight>0?this.displayHeight:e.height/Math.max(this.canvasDpr,1);this.laneHeight=kr/Or*t;let n=Math.max(this.laneHeight,1),r=Math.floor(Math.max(0,t-n)/n);if(this._settings.useFixedLaneCount){let e=Number.isFinite(this._settings.fixedLaneCount)?Math.floor(this._settings.fixedLaneCount):Se,t=Math.max(xe,Math.min(r,e));this.laneCount=t}else this.laneCount=Math.max(xe,r);this.topStaticLaneReservations.length=0,this.bottomStaticLaneReservations.length=0},Nr=function(e){this.cleanupResizeHandling();let t=!1,n=()=>{if(t)return;t=!0;let e=()=>{t=!1,this.resize()};typeof requestAnimationFrame==`function`?requestAnimationFrame(e):e()};if(this._settings.useContainerResizeObserver&&this.isResizeObserverAvailable){let t=this.resolveResizeObserverTarget(e),n=new ResizeObserver(e=>{for(let t of e){let{width:e,height:n}=t.contentRect;e>0&&n>0?this.resize(e,n):this.resize()}});n.observe(t),this.resizeObserver=n,this.resizeObserverTarget=t}else this.log.debug(`Resize handling is disabled because neither ResizeObserver nor window APIs are available.`);typeof window<`u`&&typeof window.addEventListener==`function`&&(window.addEventListener(`resize`,n),this.addCleanup(()=>window.removeEventListener(`resize`,n)));let r=typeof window<`u`?window.visualViewport:void 0;r&&typeof r.addEventListener==`function`&&(r.addEventListener(`resize`,n),r.addEventListener(`scroll`,n),this.addCleanup(()=>{r.removeEventListener(`resize`,n),r.removeEventListener(`scroll`,n)}))},Pr=function(){this.resizeObserver&&this.resizeObserverTarget&&this.resizeObserver.unobserve(this.resizeObserverTarget),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.resizeObserverTarget=null},Fr=e=>{e.prototype.resize=Ar,e.prototype.resolveDevicePixelRatio=jr,e.prototype.calculateLaneMetrics=Mr,e.prototype.setupResizeHandling=Nr,e.prototype.cleanupResizeHandling=Pr},Ir=function(){if(typeof document>`u`||typeof document.addEventListener!=`function`||typeof document.removeEventListener!=`function`)return;let e=()=>{this.handleFullscreenChange()};[`fullscreenchange`,`webkitfullscreenchange`,`mozfullscreenchange`,`MSFullscreenChange`].forEach(t=>{document.addEventListener(t,e),this.addCleanup(()=>document.removeEventListener(t,e))}),this.handleFullscreenChange()},Lr=e=>{let t=()=>{let t=e.getFullscreenElement();if(t instanceof HTMLElement){let n=t.getBoundingClientRect();e.resize(n.width,n.height)}else e.resize()};typeof requestAnimationFrame==`function`&&requestAnimationFrame(t),typeof setTimeout==`function`&&setTimeout(t,80)},Rr=function(e){return this.resolveFullscreenContainer(e)||(e.parentElement??e)},zr=async function(){let e=this.canvas,t=this.videoElement;if(!e||!t)return;let n=this.containerElement??t.parentElement??null,r=this.getFullscreenElement(),i=this.resolveActiveOverlayContainer(t,n,r);if(!(i instanceof HTMLElement))return;e.parentElement===i?this.ensureContainerPositioning(i):(this.ensureContainerPositioning(i),i.appendChild(e));let a=r instanceof HTMLElement&&r.contains(t)?r:null,o=a!==null;if(this.fullscreenActive!==o&&(this.fullscreenActive=o,this.setupResizeHandling(t)),e.style.position=`absolute`,e.style.top=`0`,e.style.left=`0`,e.style.right=`0`,e.style.bottom=`0`,e.style.display=`block`,e.style.pointerEvents=`none`,e.style.zIndex=`2147483647`,a){let e=a.getBoundingClientRect();this.resize(e.width,e.height),Lr(this)}else this.resize(),Lr(this)},Br=function(e){let t=this.getFullscreenElement();return t instanceof HTMLElement&&(t===e||t.contains(e))?t:null},Vr=function(e,t,n){return n instanceof HTMLElement&&n.contains(e)?n instanceof HTMLVideoElement&&t instanceof HTMLElement?t:n:t??null},Hr=function(){if(typeof document>`u`)return null;let e=document;return document.fullscreenElement??e.webkitFullscreenElement??e.mozFullScreenElement??e.msFullscreenElement??null},Ur=e=>{e.prototype.setupFullscreenHandling=Ir,e.prototype.resolveResizeObserverTarget=Rr,e.prototype.handleFullscreenChange=zr,e.prototype.resolveFullscreenContainer=Br,e.prototype.resolveActiveOverlayContainer=Vr,e.prototype.getFullscreenElement=Hr},Wr=function(e){this.cleanupTasks.push(e)},Gr=function(){for(;this.cleanupTasks.length>0;){let e=this.cleanupTasks.pop();try{e?.()}catch(e){this.log.error(`CommentRenderer.cleanupTask`,e)}}},Kr=e=>{e.prototype.addCleanup=Wr,e.prototype.runCleanupTasks=Gr},T=class{_settings;comments=[];activeComments=new Set;reservedLanes=new Map;topStaticLaneReservations=[];bottomStaticLaneReservations=[];pendingStaticPlacementOffsets=new WeakMap;log;timeSource;animationFrameProvider;createCanvasElement;commentDependencies;settingsVersion=0;normalizedNgWords=[];compiledNgRegexps=[];canvas=null;ctx=null;videoElement=null;containerElement=null;fullscreenActive=!1;laneCount=Se;laneHeight=0;displayWidth=0;displayHeight=0;canvasDpr=1;currentTime=0;duration=0;playbackRate=1;isPlaying=!0;isStalled=!1;lastDrawTime=0;finalPhaseActive=!1;finalPhaseStartTime=null;finalPhaseScheduleDirty=!1;playbackHasBegun=!1;skipDrawingForCurrentFrame=!1;pendingInitialSync=!1;finalPhaseVposOverrides=new Map;frameId=null;videoFrameHandle=null;resizeObserver=null;resizeObserverTarget=null;isResizeObserverAvailable=typeof ResizeObserver<`u`;cleanupTasks=[];commentSequence=0;epochId=0;eventHooks;lastSnapshotEmitTime=0;snapshotEmitThrottleMs=1e3;lastPlayResumeTime=0;playResumeSeekIgnoreDurationMs=500;lastVideoSource=null;rebuildNgMatchers(){Xt.call(this)}constructor(e=null,t=void 0){let n,r;if(Wt(e))n=Vt({...e}),r=t??{};else{let i=e??t??{};r=typeof i==`object`?i:{},n=Vt(zt())}this._settings=Vt(n),this.timeSource=r.timeSource??ue(),this.animationFrameProvider=r.animationFrameProvider??Ht(this.timeSource),this.createCanvasElement=r.createCanvasElement??Ut(),this.commentDependencies={timeSource:this.timeSource,settingsVersion:this.settingsVersion},this.log=Ee(r.loggerNamespace??`CommentRenderer`),this.eventHooks=r.eventHooks??{},this.handleAnimationFrame=this.handleAnimationFrame.bind(this),this.handleVideoFrame=this.handleVideoFrame.bind(this),this.rebuildNgMatchers(),r.debug&&it(r.debug)}get settings(){return this._settings}set settings(e){this._settings=Vt(e),this.settingsVersion+=1,this.commentDependencies.settingsVersion=this.settingsVersion,this.rebuildNgMatchers()}getVideoElement(){return this.videoElement}getCurrentVideoSource(){let e=this.videoElement;if(!e)return null;if(typeof e.currentSrc==`string`&&e.currentSrc.length>0)return e.currentSrc;let t=e.getAttribute(`src`);if(t&&t.length>0)return t;let n=e.querySelector(`source[src]`);return n&&typeof n.src==`string`?n.src:null}getCommentsSnapshot(){return[...this.comments]}};Qt(T),cn(T),dn(T),hn(T),yn(T),On(T),In(T),qn(T),Xn(T),sr(T),pr(T),Cr(T),Dr(T),Fr(T),Ur(T),Kr(T);var qr=()=>({...zt(),shadowIntensity:`strong`,autoSearchEnabled:!0}),Jr=`v7.7.0`,Yr=typeof GM_addStyle<`u`?GM_addStyle:void 0,Xr=typeof GM_getValue<`u`?GM_getValue:void 0,Zr=typeof GM_setValue<`u`?GM_setValue:void 0,Qr=typeof GM_xmlhttpRequest<`u`?GM_xmlhttpRequest:void 0,$r=[`ja`,`en`,`zh-Hans`,`hi`,`es`,`fr`,`ar`,`pt`,`bn`,`ru`,`ur`],ei=new Set([`ar`,`ur`]);function ti(e){return ei.has(e)?`rtl`:`ltr`}function ni(e,t,n){let r=e[n],i={},a=e;for(let e of t)i[e]={...r,...a[e]??{}};return i}function ri(e,t){return ni(e,$r,t)}function ii(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(e,n)=>{let r=t[n];return r===void 0?e:String(r)})}function ai(e){let t=Object.keys(e.translations),n=e.defaultLocale,r=n=>{let r=n.toLowerCase(),i=e.aliases?.[r];if(i)return i;let a=t.find(e=>e.toLowerCase()===r);if(a)return a;let o=r.split(`-`)[0];return t.find(e=>e.toLowerCase().split(`-`)[0]===o)??null},i=()=>{let t=navigator.languages.length>0?navigator.languages:[navigator.language];for(let e of t){let t=r(e);if(t)return t}return e.fallbackLocale},a=t=>e.translations[n]?.[t]||e.translations[e.fallbackLocale]?.[t]||(e.translations[e.defaultLocale]?.[t]??t);return{locales:t,getLocale:()=>n,setLocale:e=>{n=e},detectBrowserLocale:i,t:a,format:(e,t)=>ii(a(e),t),getTranslations:(t=n)=>e.translations[t]??e.translations[e.fallbackLocale],getDirection:(e=n)=>ti(e),getMissingTranslationKeys:t=>{let n=e.translations[e.fallbackLocale],r=e.translations[t];return Object.keys(n).filter(e=>!r[e])}}}var oi=ai({translations:ri({ja:{color:`カラー`,commentColor:`コメントカラー`,commentOpacity:`不透明度`,commentSettings:`コメント設定`,commentSettingsPanel:`コメント設定パネル`,commentVisibility:`コメント表示`,commentVisibilityToggle:`コメント表示切替`,currentVideoUnset:`オーバーレイする動画が未設定です`,error:`エラー`,animeTitle:`アニメタイトル`,autoFillSearchForm:`検索フォームにタイトル・話数・エピソードタイトルを入力`,autoSearch:`自動検索`,autoSearchDescription:`視聴ページ表示時に自動でコメントを設定`,autoSearchDisabledManual:`自動検索を無効にしました（手動設定モード）`,autoSearchEnabled:`自動検索を有効にしました`,autoSearchInfo:`自動検索についての説明`,fixedPlaybackRate:`速度固定`,formInput:`フォーム入力`,freeInput:`自由入力`,idLoadFailed:`ID情報の読込に失敗しました`,idSaveFailed:`ID情報の保存に失敗しました`,info:`情報`,manualSearchLoadFailed:`検索設定の読込に失敗しました`,manualSearchSaveFailed:`検索設定の保存に失敗しました`,manualSearchPlaceholder:`検索キーワードを入力`,ngRegex:`NG正規表現`,ngRegexPlaceholder:`NG正規表現を1行ずつ入力`,ngTab:`NG`,ngWords:`NGワード`,ngWordsPlaceholder:`NGワードを1行ずつ入力`,noMessage:`メッセージはありません`,playbackRate:`再生速度`,playbackRateFixedToggle:`再生速度固定ON/OFF`,postedAt:`投稿日`,commentsSet:`「{title}」のコメントを設定しました`,autoSetupComplete:`ニコニコ動画を自動設定しました`,autoSetupError:`自動設定エラー: {message}`,commentsLoadComplete:`コメントの読み込みが完了しました（{count}件）`,commentsLoadErrorSelectAnother:`コメント読み込みエラー: {message}
フローティングボタンから別の動画を選択してください。`,commentsUnavailable:`コメントを取得できませんでした`,commentSourceUpdated:`コメントソースを更新しました: {title}（{count}件）`,commentFetchError:`コメント取得エラー: {message}`,domUpdateWaitFailed:`DOM更新の待機に失敗しました: {message}`,episodeChangeDetected:`エピソード切り替えを検知しました...`,episodeNumberMissing:`エピソード話数を取得できませんでした`,episodeSwitchError:`エピソード切り替えエラー: {message}`,initializationError:`初期化エラー: {message}`,initializingCommentLoader:`コメントローダーを初期化中...`,manualModeSelectAnimeTitle:`手動設定モードです。フローティングボタンから検索タブを開いてアニメタイトルを設定してください。`,manualModeSelectVideo:`手動設定モードです。フローティングボタンから検索タブを開いて動画を選択してください。`,manualModeCommentsLoadComplete:`【手動設定モード】コメントの読み込みが完了しました（{count}件）
動画: {title}`,metadataAutoFetchFailed:`視聴ページからの自動取得に失敗しました。メタデータが取得できませんでした。`,niconicoNotFound:`ニコニコ動画が見つかりませんでした`,niconicoNotFoundManual:`ニコニコ動画が見つかりませんでした。手動で検索してください。`,nextEpisodeAutoSetupComplete:`次のエピソードを自動設定しました`,nextVideoCommentsUnavailableClear:`次の動画のコメントを取得できませんでした。コメント表示をクリアします。`,noAnimeTitle:`アニメタイトルが取得できませんでした。検索精度が低下する可能性があります。`,officialVideoMissingUseFirst:`公式動画が見つかりませんでした。検索結果の最初の動画を使用します。`,officialVideoMissingManual:`公式動画が見つかりませんでした。手動で検索してください。`,officialVideoSafeguardInfo:`公式動画セーフガードについて`,unknownTitle:`不明なタイトル`,structuredInput:`詳細入力`,thumbnail:`サムネイル`,videoDataMissing:`動画データが見つかりません。`,videoId:`動画ID`,videoOwner:`投稿者`,videoSwitchDetected:`動画の切り替わりを検知しました...`,videoSwitchError:`動画切り替えエラー: {message}`,episodeNumber:`話数`,episodeTitleOptional:`エピソードタイトル（任意）`,commentCount:`コメント`,commentCountLong:`コメント数`,mylistCount:`マイリスト`,mylistCountLong:`マイリスト数`,officialVideoMissing:`公式動画が見つかりませんでした。全ての検索結果を表示しています。`,searchingKeyword:`「{keyword}」を検索中...`,searchKeywordRequired:`検索キーワードを入力してください`,searchNoResults:`検索結果が見つかりませんでした`,searchFormFilled:`「{keyword}」を検索フォームに入力しました`,similarity:`類似度: {score}%`,viewCount:`再生`,viewCountLong:`再生数`,search:`検索`,searchAnimePlaceholder:`例: 葬送のフリーレン`,searchEpisodeNumberPlaceholder:`例: 第1話`,searchEpisodeTitlePlaceholder:`例: 冒険の終わり`,searchFreeword:`フリーワード検索`,searchInputModeToggle:`入力モードを切り替え（詳細入力 / 自由入力）`,searchPage:`検索ページ`,searchTab:`検索`,searchVideoHeading:`コメントをオーバーレイする動画を検索`,saveSettings:`設定を保存`,settings:`設定`,settingsClose:`設定を閉じる`,settingsFabLabel:`ニコニココメント設定を開く`,playbackLoadFailed:`再生設定の読み込みに失敗しました`,playbackSaveFailed:`再生設定の保存に失敗しました`,settingsLoadFailed:`設定の読み込みに失敗しました`,settingsSaved:`設定を保存しました`,settingsSaveFailed:`設定の保存に失敗しました`,success:`成功`,videoDataLoadFailed:`動画データの読み込みに失敗しました`,videoDataSaveFailed:`動画データの保存に失敗しました`,warning:`警告`},en:{color:`Color`,commentColor:`Comment color`,commentOpacity:`Opacity`,commentSettings:`Comment settings`,commentSettingsPanel:`Comment settings panel`,commentVisibility:`Show comments`,commentVisibilityToggle:`Toggle comment visibility`,currentVideoUnset:`No overlay video is set`,error:`Error`,animeTitle:`Anime title`,autoFillSearchForm:`Fill the search form with title, episode number, and episode title`,autoSearch:`Auto search`,autoSearchDescription:`Set comments automatically when the watch page opens`,autoSearchDisabledManual:`Auto search disabled (manual setup mode)`,autoSearchEnabled:`Auto search enabled`,autoSearchInfo:`About auto search`,fixedPlaybackRate:`Lock speed`,formInput:`Fill form`,freeInput:`Free input`,idLoadFailed:`Failed to load ID information`,idSaveFailed:`Failed to save ID information`,info:`Info`,manualSearchLoadFailed:`Failed to load search settings`,manualSearchSaveFailed:`Failed to save search settings`,manualSearchPlaceholder:`Enter a search keyword`,ngRegex:`NG regular expressions`,ngRegexPlaceholder:`Enter one NG regular expression per line`,ngTab:`NG`,ngWords:`NG words`,ngWordsPlaceholder:`Enter one NG word per line`,noMessage:`No message`,playbackRate:`Playback speed`,playbackRateFixedToggle:`Playback speed lock on/off`,postedAt:`Posted at`,commentsSet:`Set comments from "{title}"`,autoSetupComplete:`Niconico video was set automatically`,autoSetupError:`Auto setup error: {message}`,commentsLoadComplete:`Finished loading comments ({count})`,commentsLoadErrorSelectAnother:`Comment loading error: {message}
Select another video from the floating button.`,commentsUnavailable:`Could not fetch comments`,commentSourceUpdated:`Updated comment source: {title} ({count})`,commentFetchError:`Comment fetch error: {message}`,domUpdateWaitFailed:`Failed to wait for DOM update: {message}`,episodeChangeDetected:`Detected episode change...`,episodeNumberMissing:`Could not get the episode number`,episodeSwitchError:`Episode switch error: {message}`,initializationError:`Initialization error: {message}`,initializingCommentLoader:`Initializing comment loader...`,manualModeSelectAnimeTitle:`Manual mode is enabled. Open the Search tab from the floating button and set an anime title.`,manualModeSelectVideo:`Manual mode is enabled. Open the Search tab from the floating button and select a video.`,manualModeCommentsLoadComplete:`[Manual mode] Finished loading comments ({count})
Video: {title}`,metadataAutoFetchFailed:`Automatic fetch from the watch page failed. Metadata could not be acquired.`,niconicoNotFound:`No Niconico video was found`,niconicoNotFoundManual:`No Niconico video was found. Search manually.`,nextEpisodeAutoSetupComplete:`Set up the next episode automatically`,nextVideoCommentsUnavailableClear:`Could not fetch comments for the next video. Clearing comment display.`,noAnimeTitle:`Could not get the anime title. Search accuracy may be reduced.`,officialVideoMissingUseFirst:`No official video was found. Using the first search result.`,officialVideoMissingManual:`No official video was found. Search manually.`,officialVideoSafeguardInfo:`About the official video safeguard`,unknownTitle:`Unknown title`,structuredInput:`Detailed input`,thumbnail:`Thumbnail`,videoDataMissing:`Video data was not found.`,videoId:`Video ID`,videoOwner:`Uploader`,videoSwitchDetected:`Detected video switch...`,videoSwitchError:`Video switch error: {message}`,episodeNumber:`Episode number`,episodeTitleOptional:`Episode title (optional)`,commentCount:`Comments`,commentCountLong:`Comment count`,mylistCount:`Mylist`,mylistCountLong:`Mylist count`,officialVideoMissing:`No official video was found. Showing all search results.`,searchingKeyword:`Searching for "{keyword}"...`,searchKeywordRequired:`Enter a search keyword`,searchNoResults:`No search results were found`,searchFormFilled:`Filled the search form with "{keyword}"`,similarity:`Similarity: {score}%`,viewCount:`Views`,viewCountLong:`View count`,search:`Search`,searchAnimePlaceholder:`Example: Frieren: Beyond Journey's End`,searchEpisodeNumberPlaceholder:`Example: Episode 1`,searchEpisodeTitlePlaceholder:`Example: The Journey's End`,searchFreeword:`Free-word search`,searchInputModeToggle:`Switch input mode (detailed / free input)`,searchPage:`Search page`,searchTab:`Search`,searchVideoHeading:`Search for the video to overlay comments from`,saveSettings:`Save settings`,settings:`Settings`,settingsClose:`Close settings`,settingsFabLabel:`Open Niconico comment settings`,playbackLoadFailed:`Failed to load playback settings`,playbackSaveFailed:`Failed to save playback settings`,settingsLoadFailed:`Failed to load settings`,settingsSaved:`Settings saved`,settingsSaveFailed:`Failed to save settings`,success:`Success`,videoDataLoadFailed:`Failed to load video data`,videoDataSaveFailed:`Failed to save video data`,warning:`Warning`},"zh-Hans":{color:`颜色`,commentColor:`评论颜色`,commentOpacity:`不透明度`,commentSettings:`评论设置`,commentSettingsPanel:`评论设置面板`,commentVisibility:`显示评论`,commentVisibilityToggle:`切换评论可见性`,currentVideoUnset:`未设置叠加视频`,error:`错误`,animeTitle:`动漫标题`,autoFillSearchForm:`在搜索表单中填写标题、剧集编号和剧集标题`,autoSearch:`自动搜索`,autoSearchDescription:`观看页面打开时自动设置评论`,autoSearchDisabledManual:`自动搜索禁用（手动设置模式）`,autoSearchEnabled:`自动搜索已启用`,autoSearchInfo:`关于自动搜索`,fixedPlaybackRate:`锁定速度`,formInput:`填写表格`,freeInput:`自由输入`,idLoadFailed:`加载ID信息失败`,idSaveFailed:`保存ID信息失败`,info:`信息`,manualSearchLoadFailed:`无法加载搜索设置`,manualSearchSaveFailed:`无法保存搜索设置`,manualSearchPlaceholder:`输入搜索关键字`,ngRegex:`NG正则表达式`,ngRegexPlaceholder:`每行输入一个 NG 正则表达式`,ngTab:`不合格`,ngWords:`NG词`,ngWordsPlaceholder:`每行输入一个 NG 字`,noMessage:`没有消息`,playbackRate:`播放速度`,playbackRateFixedToggle:`播放速度锁定开/关`,postedAt:`发表于`,commentsSet:`设置来自“{title}”的评论`,autoSetupComplete:`Niconico 视频已自动设置`,autoSetupError:`自动设置错误：{message}`,commentsLoadComplete:`评论加载完毕({count})`,commentsLoadErrorSelectAnother:`评论加载错误：{message}\\n从浮动按钮中选择另一个视频。`,commentsUnavailable:`无法获取评论`,commentSourceUpdated:`更新评论来源：{title}（{count}）`,commentFetchError:`评论获取错误：{message}`,domUpdateWaitFailed:`无法等待 DOM 更新：{message}`,episodeChangeDetected:`检测到情节变化...`,episodeNumberMissing:`无法获取剧集编号`,episodeSwitchError:`剧集切换错误：{message}`,initializationError:`初始化错误：{message}`,initializingCommentLoader:`正在初始化评论加载器...`,manualModeSelectAnimeTitle:`手动模式已启用。从浮动按钮打开“搜索”选项卡并设置动漫标题。`,manualModeSelectVideo:`手动模式已启用。从浮动按钮打开“搜索”选项卡并选择一个视频。`,manualModeCommentsLoadComplete:`[手动模式]评论加载完毕({count})\\n视频：{title}`,metadataAutoFetchFailed:`从观看页面自动获取失败。无法获取元数据。`,niconicoNotFound:`未找到 Niconico 视频`,niconicoNotFoundManual:`未找到 Niconico 视频。手动搜索。`,nextEpisodeAutoSetupComplete:`自动设置下一集`,nextVideoCommentsUnavailableClear:`无法获取下一个视频的评论。清除评论显示。`,noAnimeTitle:`无法获取动画标题。搜索准确度可能会降低。`,officialVideoMissingUseFirst:`没有找到官方视频。使用第一个搜索结果。`,officialVideoMissingManual:`没有找到官方视频。手动搜索。`,officialVideoSafeguardInfo:`关于官方视频保障`,unknownTitle:`未知标题`,structuredInput:`详细输入`,thumbnail:`缩略图`,videoDataMissing:`未找到视频数据。`,videoId:`视频ID`,videoOwner:`上传者`,videoSwitchDetected:`检测到视频切换...`,videoSwitchError:`视频切换错误：{message}`,episodeNumber:`集数`,episodeTitleOptional:`剧集标题（可选）`,commentCount:`评论`,commentCountLong:`评论数`,mylistCount:`我的列表`,mylistCountLong:`我的列表计数`,officialVideoMissing:`没有找到官方视频。显示所有搜索结果。`,searchingKeyword:`正在搜索“{keyword}”...`,searchKeywordRequired:`输入搜索关键字`,searchNoResults:`没有找到搜索结果`,searchFormFilled:`在搜索表单中填写“{keyword}”`,similarity:`相似度：{score}%`,viewCount:`意见`,viewCountLong:`观看次数`,search:`搜索`,searchAnimePlaceholder:`示例：Frieren：超越旅程的终点`,searchEpisodeNumberPlaceholder:`示例：第 1 集`,searchEpisodeTitlePlaceholder:`示例：旅程的终点`,searchFreeword:`自由词搜索`,searchInputModeToggle:`切换输入模式（详细/自由输入）`,searchPage:`搜索页面`,searchTab:`搜索`,searchVideoHeading:`搜索要覆盖评论的视频`,saveSettings:`保存设置`,settings:`设置`,settingsClose:`关闭设置`,settingsFabLabel:`打开niconico评论设置`,playbackLoadFailed:`无法加载播放设置`,playbackSaveFailed:`无法保存播放设置`,settingsLoadFailed:`无法加载设置`,settingsSaved:`设置已保存`,settingsSaveFailed:`保存设置失败`,success:`成功`,videoDataLoadFailed:`视频数据加载失败`,videoDataSaveFailed:`保存视频数据失败`,warning:`警告`},hi:{color:`रंग`,commentColor:`टिप्पणी रंग`,commentOpacity:`अपारदर्शिता`,commentSettings:`टिप्पणी सेटिंग`,commentSettingsPanel:`टिप्पणी सेटिंग पैनल`,commentVisibility:`टिप्पणियाँ दिखाएँ`,commentVisibilityToggle:`टिप्पणी दृश्यता टॉगल करें`,currentVideoUnset:`कोई ओवरले वीडियो सेट नहीं है`,error:`त्रुटि`,animeTitle:`एनीमे शीर्षक`,autoFillSearchForm:`शीर्षक, एपिसोड संख्या और एपिसोड शीर्षक के साथ खोज फ़ॉर्म भरें`,autoSearch:`स्वतः खोज`,autoSearchDescription:`दृश्य पृष्ठ खुलने पर स्वचालित रूप से टिप्पणियाँ सेट करें`,autoSearchDisabledManual:`स्वतः खोज अक्षम (मैन्युअल सेटअप मोड)`,autoSearchEnabled:`स्वतः खोज सक्षम`,autoSearchInfo:`ऑटो खोज के बारे में`,fixedPlaybackRate:`लॉक स्पीड`,formInput:`फॉर्म भरें`,freeInput:`मुफ़्त इनपुट`,idLoadFailed:`आईडी जानकारी लोड करने में विफल`,idSaveFailed:`आईडी जानकारी सहेजने में विफल`,info:`जानकारी`,manualSearchLoadFailed:`खोज सेटिंग लोड करने में विफल`,manualSearchSaveFailed:`खोज सेटिंग सहेजने में विफल`,manualSearchPlaceholder:`एक खोज कीवर्ड दर्ज करें`,ngRegex:`एनजी नियमित अभिव्यक्ति`,ngRegexPlaceholder:`प्रति पंक्ति एक एनजी रेगुलर एक्सप्रेशन दर्ज करें`,ngTab:`एनजी`,ngWords:`एनजी शब्द`,ngWordsPlaceholder:`प्रति पंक्ति एक एनजी शब्द दर्ज करें`,noMessage:`कोई संदेश नहीं`,playbackRate:`प्लेबैक गति`,playbackRateFixedToggle:`प्लेबैक स्पीड लॉक चालू/बंद`,postedAt:`पर पोस्ट किया गया`,commentsSet:`"{title}" से टिप्पणियाँ सेट करें`,autoSetupComplete:`निकोनिको वीडियो स्वचालित रूप से सेट किया गया था`,autoSetupError:`स्वतः सेटअप त्रुटि: {message}`,commentsLoadComplete:`टिप्पणियाँ लोड करना समाप्त ({count})`,commentsLoadErrorSelectAnother:`टिप्पणी लोड करने में त्रुटि: {message}\\nफ़्लोटिंग बटन से कोई अन्य वीडियो चुनें।`,commentsUnavailable:`टिप्पणियाँ प्राप्त नहीं की जा सकीं`,commentSourceUpdated:`अद्यतन टिप्पणी स्रोत: {title} ({count})`,commentFetchError:`टिप्पणी लाने में त्रुटि: {message}`,domUpdateWaitFailed:`DOM अपडेट के लिए प्रतीक्षा करने में विफल: {message}`,episodeChangeDetected:`एपिसोड में बदलाव का पता चला...`,episodeNumberMissing:`एपिसोड नंबर नहीं मिल सका`,episodeSwitchError:`एपिसोड स्विच त्रुटि: {message}`,initializationError:`आरंभीकरण त्रुटि: {message}`,initializingCommentLoader:`टिप्पणी लोडर प्रारंभ किया जा रहा है...`,manualModeSelectAnimeTitle:`मैनुअल मोड सक्षम है. फ़्लोटिंग बटन से खोज टैब खोलें और एनीमे शीर्षक सेट करें।`,manualModeSelectVideo:`मैनुअल मोड सक्षम है. फ़्लोटिंग बटन से खोज टैब खोलें और एक वीडियो चुनें।`,manualModeCommentsLoadComplete:`[मैन्युअल मोड] टिप्पणियाँ लोड करना समाप्त ({count})\\nवीडियो: {title}`,metadataAutoFetchFailed:`दृश्य पृष्ठ से स्वचालित फ़ेच विफल रहा. मेटाडेटा प्राप्त नहीं किया जा सका.`,niconicoNotFound:`कोई निकोनिको वीडियो नहीं मिला`,niconicoNotFoundManual:`कोई निकोनिको वीडियो नहीं मिला. मैन्युअल रूप से खोजें.`,nextEpisodeAutoSetupComplete:`अगला एपिसोड स्वचालित रूप से सेट करें`,nextVideoCommentsUnavailableClear:`अगले वीडियो के लिए टिप्पणियाँ नहीं मिल सकीं. टिप्पणी प्रदर्शन साफ़ करना.`,noAnimeTitle:`एनीमे शीर्षक नहीं मिल सका. खोज सटीकता कम हो सकती है.`,officialVideoMissingUseFirst:`कोई आधिकारिक वीडियो नहीं मिला. पहले खोज परिणाम का उपयोग करना.`,officialVideoMissingManual:`कोई आधिकारिक वीडियो नहीं मिला. मैन्युअल रूप से खोजें.`,officialVideoSafeguardInfo:`आधिकारिक वीडियो सुरक्षा के बारे में`,unknownTitle:`अज्ञात शीर्षक`,structuredInput:`विस्तृत इनपुट`,thumbnail:`थंबनेल`,videoDataMissing:`वीडियो डेटा नहीं मिला.`,videoId:`वीडियो आईडी`,videoOwner:`अपलोडर`,videoSwitchDetected:`वीडियो स्विच का पता चला...`,videoSwitchError:`वीडियो स्विच त्रुटि: {message}`,episodeNumber:`एपिसोड नंबर`,episodeTitleOptional:`एपिसोड का शीर्षक (वैकल्पिक)`,commentCount:`टिप्पणियाँ`,commentCountLong:`टिप्पणी गिनती`,mylistCount:`मेरी सूची`,mylistCountLong:`मेरी सूची गिनती`,officialVideoMissing:`कोई आधिकारिक वीडियो नहीं मिला. सभी खोज परिणाम दिखाए जा रहे हैं.`,searchingKeyword:`"{keyword}" खोज रहे हैं...`,searchKeywordRequired:`एक खोज कीवर्ड दर्ज करें`,searchNoResults:`कोई खोज परिणाम नहीं मिला`,searchFormFilled:`खोज फ़ॉर्म को "{keyword}" से भरें`,similarity:`समानता: {score}%`,viewCount:`दृश्य`,viewCountLong:`देखने की संख्या`,search:`खोजें`,searchAnimePlaceholder:`उदाहरण: फ्रिरेन: बियॉन्ड जर्नीज़ एंड`,searchEpisodeNumberPlaceholder:`उदाहरण: एपिसोड 1`,searchEpisodeTitlePlaceholder:`उदाहरण: यात्रा का अंत`,searchFreeword:`निःशुल्क शब्द खोज`,searchInputModeToggle:`इनपुट मोड स्विच करें (विस्तृत / निःशुल्क इनपुट)`,searchPage:`पेज खोजें`,searchTab:`खोजें`,searchVideoHeading:`टिप्पणियों को ओवरले करने के लिए वीडियो खोजें`,saveSettings:`सेटिंग्स सहेजें`,settings:`सेटिंग्स`,settingsClose:`सेटिंग्स बंद करें`,settingsFabLabel:`निकोनिको टिप्पणी सेटिंग खोलें`,playbackLoadFailed:`प्लेबैक सेटिंग लोड करने में विफल`,playbackSaveFailed:`प्लेबैक सेटिंग सहेजने में विफल`,settingsLoadFailed:`सेटिंग्स लोड करने में विफल`,settingsSaved:`सेटिंग्स सहेजी गईं`,settingsSaveFailed:`सेटिंग्स सहेजने में विफल`,success:`सफलता`,videoDataLoadFailed:`वीडियो डेटा लोड करने में विफल`,videoDataSaveFailed:`वीडियो डेटा सहेजने में विफल`,warning:`चेतावनी`},es:{color:`Color`,commentColor:`Color del comentario`,commentOpacity:`Opacidad`,commentSettings:`Configuración de comentarios`,commentSettingsPanel:`Panel de configuración de comentarios`,commentVisibility:`Mostrar comentarios`,commentVisibilityToggle:`Alternar visibilidad de comentarios`,currentVideoUnset:`No se ha establecido ningún vídeo superpuesto`,error:`error`,animeTitle:`Título del anime`,autoFillSearchForm:`Complete el formulario de búsqueda con título, número de episodio y título del episodio.`,autoSearch:`Búsqueda automática`,autoSearchDescription:`Establecer comentarios automáticamente cuando se abre la página de visualización`,autoSearchDisabledManual:`Búsqueda automática deshabilitada (modo de configuración manual)`,autoSearchEnabled:`Búsqueda automática habilitada`,autoSearchInfo:`Acerca de la búsqueda automática`,fixedPlaybackRate:`Velocidad de bloqueo`,formInput:`Rellenar formulario`,freeInput:`Entrada libre`,idLoadFailed:`No se pudo cargar la información de identificación`,idSaveFailed:`No se pudo guardar la información de identificación`,info:`Información`,manualSearchLoadFailed:`No se pudo cargar la configuración de búsqueda`,manualSearchSaveFailed:`No se pudo guardar la configuración de búsqueda`,manualSearchPlaceholder:`Introduzca una palabra clave de búsqueda`,ngRegex:`NG expresiones regulares`,ngRegexPlaceholder:`Ingrese una expresión regular NG por línea`,ngTab:`NG`,ngWords:`palabras NG`,ngWordsPlaceholder:`Ingrese una palabra NG por línea`,noMessage:`Ningún mensaje`,playbackRate:`Velocidad de reproducción`,playbackRateFixedToggle:`Activar/desactivar bloqueo de velocidad de reproducción`,postedAt:`Publicado en`,commentsSet:`Establecer comentarios de "{title}"`,autoSetupComplete:`El vídeo de Niconico se configuró automáticamente.`,autoSetupError:`Error de configuración automática: {message}`,commentsLoadComplete:`Terminado de cargar comentarios ({count})`,commentsLoadErrorSelectAnother:`Error al cargar el comentario: {message}\\nSelecciona otro vídeo desde el botón flotante.`,commentsUnavailable:`No se pudieron recuperar los comentarios`,commentSourceUpdated:`Fuente de comentarios actualizada: {title} ({count})`,commentFetchError:`Error al recuperar el comentario: {message}`,domUpdateWaitFailed:`No se pudo esperar la actualización de DOM: {message}`,episodeChangeDetected:`Cambio de episodio detectado...`,episodeNumberMissing:`No se pudo obtener el número del episodio.`,episodeSwitchError:`Error de cambio de episodio: {message}`,initializationError:`Error de inicialización: {message}`,initializingCommentLoader:`Inicializando el cargador de comentarios...`,manualModeSelectAnimeTitle:`El modo manual está habilitado. Abra la pestaña Buscar desde el botón flotante y establezca un título de anime.`,manualModeSelectVideo:`El modo manual está habilitado. Abra la pestaña Buscar desde el botón flotante y seleccione un video.`,manualModeCommentsLoadComplete:`[Modo manual] Finalizado la carga de comentarios ({count}) Vídeo\\n: {title}`,metadataAutoFetchFailed:`Error en la búsqueda automática desde la página de visualización. No se pudieron adquirir los metadatos.`,niconicoNotFound:`No se encontró ningún vídeo de Niconico`,niconicoNotFoundManual:`No se encontró ningún vídeo de Niconico. Buscar manualmente.`,nextEpisodeAutoSetupComplete:`Configurar el siguiente episodio automáticamente`,nextVideoCommentsUnavailableClear:`No se pudieron obtener comentarios para el siguiente video. Borrar visualización de comentarios.`,noAnimeTitle:`No se pudo obtener el título del anime. La precisión de la búsqueda puede verse reducida.`,officialVideoMissingUseFirst:`No se encontró ningún vídeo oficial. Usando el primer resultado de búsqueda.`,officialVideoMissingManual:`No se encontró ningún vídeo oficial. Buscar manualmente.`,officialVideoSafeguardInfo:`Acerca de la salvaguardia oficial del vídeo`,unknownTitle:`Título desconocido`,structuredInput:`Entrada detallada`,thumbnail:`Miniatura`,videoDataMissing:`No se encontraron datos de vídeo.`,videoId:`Identificación de vídeo`,videoOwner:`Cargador`,videoSwitchDetected:`Cambio de vídeo detectado...`,videoSwitchError:`Error de cambio de vídeo: {message}`,episodeNumber:`Número de episodio`,episodeTitleOptional:`Título del episodio (opcional)`,commentCount:`Comentarios`,commentCountLong:`Recuento de comentarios`,mylistCount:`Mi lista`,mylistCountLong:`Recuento de mi lista`,officialVideoMissing:`No se encontró ningún vídeo oficial. Mostrando todos los resultados de la búsqueda.`,searchingKeyword:`Buscando "{keyword}"...`,searchKeywordRequired:`Introduzca una palabra clave de búsqueda`,searchNoResults:`No se encontraron resultados de búsqueda`,searchFormFilled:`Rellenó el formulario de búsqueda con "{keyword}"`,similarity:`Similitud: {score}%`,viewCount:`Vistas`,viewCountLong:`Ver recuento`,search:`Buscar`,searchAnimePlaceholder:`Ejemplo: Frieren: Más allá del fin del viaje`,searchEpisodeNumberPlaceholder:`Ejemplo: episodio 1`,searchEpisodeTitlePlaceholder:`Ejemplo: el fin del viaje`,searchFreeword:`Búsqueda de palabras libre`,searchInputModeToggle:`Cambiar modo de entrada (entrada detallada/libre)`,searchPage:`Página de búsqueda`,searchTab:`Buscar`,searchVideoHeading:`Busque el vídeo para superponer comentarios`,saveSettings:`Guardar configuración`,settings:`Configuración`,settingsClose:`Cerrar configuración`,settingsFabLabel:`Abrir la configuración de comentarios de Niconico`,playbackLoadFailed:`No se pudo cargar la configuración de reproducción`,playbackSaveFailed:`No se pudo guardar la configuración de reproducción`,settingsLoadFailed:`No se pudo cargar la configuración`,settingsSaved:`Configuración guardada`,settingsSaveFailed:`No se pudo guardar la configuración`,success:`Éxito`,videoDataLoadFailed:`No se pudieron cargar los datos del video`,videoDataSaveFailed:`No se pudieron guardar los datos del video`,warning:`Advertencia`},fr:{color:`Couleur`,commentColor:`Couleur du commentaire`,commentOpacity:`Opacité`,commentSettings:`Paramètres des commentaires`,commentSettingsPanel:`Panneau de paramètres des commentaires`,commentVisibility:`Afficher les commentaires`,commentVisibilityToggle:`Activer/désactiver la visibilité des commentaires`,currentVideoUnset:`Aucune vidéo de superposition n'est définie`,error:`Erreur`,animeTitle:`Titre de l'anime`,autoFillSearchForm:`Remplissez le formulaire de recherche avec le titre, le numéro de l'épisode et le titre de l'épisode`,autoSearch:`Recherche automatique`,autoSearchDescription:`Définir automatiquement les commentaires à l'ouverture de la page de lecture`,autoSearchDisabledManual:`Recherche automatique désactivée (mode de configuration manuelle)`,autoSearchEnabled:`Recherche automatique activée`,autoSearchInfo:`À propos de la recherche automatique`,fixedPlaybackRate:`Vitesse de verrouillage`,formInput:`Remplir le formulaire`,freeInput:`Entrée gratuite`,idLoadFailed:`Échec du chargement des informations d'identification`,idSaveFailed:`Échec de l'enregistrement des informations d'identification`,info:`Informations`,manualSearchLoadFailed:`Échec du chargement des paramètres de recherche`,manualSearchSaveFailed:`Échec de l'enregistrement des paramètres de recherche`,manualSearchPlaceholder:`Entrez un mot-clé de recherche`,ngRegex:`Expressions régulières NG`,ngRegexPlaceholder:`Entrez une expression régulière NG par ligne`,ngTab:`NG`,ngWords:`Mots NG`,ngWordsPlaceholder:`Entrez un mot NG par ligne`,noMessage:`Aucun message`,playbackRate:`Vitesse de lecture`,playbackRateFixedToggle:`Verrouillage de la vitesse de lecture activé/désactivé`,postedAt:`Publié à`,commentsSet:`Définir les commentaires de "{title}"`,autoSetupComplete:`La vidéo de Niconico a été réglée automatiquement`,autoSetupError:`Erreur de configuration automatique\xA0: {message}`,commentsLoadComplete:`Chargement des commentaires terminé ({count})`,commentsLoadErrorSelectAnother:`Erreur de chargement du commentaire\xA0: {message}\\nSélectionnez une autre vidéo à partir du bouton flottant.`,commentsUnavailable:`Impossible de récupérer les commentaires`,commentSourceUpdated:`Source des commentaires mise à jour\xA0: {title} ({count})`,commentFetchError:`Erreur de récupération des commentaires\xA0:\xA0{message}`,domUpdateWaitFailed:`Échec de l'attente de la mise à jour du DOM\xA0: {message}`,episodeChangeDetected:`Changement d'épisode détecté...`,episodeNumberMissing:`Impossible d'obtenir le numéro de l'épisode`,episodeSwitchError:`Erreur de changement d'épisode\xA0: {message}`,initializationError:`Erreur d'initialisation\xA0: {message}`,initializingCommentLoader:`Initialisation du chargeur de commentaires...`,manualModeSelectAnimeTitle:`Le mode manuel est activé. Ouvrez l'onglet Recherche à partir du bouton flottant et définissez un titre d'anime.`,manualModeSelectVideo:`Le mode manuel est activé. Ouvrez l'onglet Recherche à partir du bouton flottant et sélectionnez une vidéo.`,manualModeCommentsLoadComplete:`[Mode manuel] Fin du chargement des commentaires ({count}) Vidéo\\n: {title}`,metadataAutoFetchFailed:`La récupération automatique à partir de la page de lecture a échoué. Les métadonnées n'ont pas pu être acquises.`,niconicoNotFound:`Aucune vidéo Niconico n'a été trouvée`,niconicoNotFoundManual:`Aucune vidéo Niconico n’a été trouvée. Recherchez manuellement.`,nextEpisodeAutoSetupComplete:`Configurer automatiquement le prochain épisode`,nextVideoCommentsUnavailableClear:`Impossible de récupérer les commentaires pour la prochaine vidéo. Effacement de l'affichage des commentaires.`,noAnimeTitle:`Impossible d'obtenir le titre de l'anime. La précision de la recherche peut être réduite.`,officialVideoMissingUseFirst:`Aucune vidéo officielle n'a été trouvée. Utilisation du premier résultat de recherche.`,officialVideoMissingManual:`Aucune vidéo officielle n'a été trouvée. Recherchez manuellement.`,officialVideoSafeguardInfo:`À propos de la sauvegarde vidéo officielle`,unknownTitle:`Titre inconnu`,structuredInput:`Entrée détaillée`,thumbnail:`Miniature`,videoDataMissing:`Les données vidéo n'ont pas été trouvées.`,videoId:`ID vidéo`,videoOwner:`Téléchargeur`,videoSwitchDetected:`Commutateur vidéo détecté...`,videoSwitchError:`Erreur de commutation vidéo\xA0: {message}`,episodeNumber:`Numéro de l'épisode`,episodeTitleOptional:`Titre de l'épisode (facultatif)`,commentCount:`Commentaires`,commentCountLong:`Nombre de commentaires`,mylistCount:`Ma liste`,mylistCountLong:`Nombre de ma liste`,officialVideoMissing:`Aucune vidéo officielle n'a été trouvée. Affichage de tous les résultats de recherche.`,searchingKeyword:`Recherche de "{keyword}"...`,searchKeywordRequired:`Entrez un mot-clé de recherche`,searchNoResults:`Aucun résultat de recherche n'a été trouvé`,searchFormFilled:`Rempli le formulaire de recherche avec "{keyword}"`,similarity:`Similitude\xA0:\xA0{score}\xA0%`,viewCount:`Vues`,viewCountLong:`Nombre de vues`,search:`Rechercher`,searchAnimePlaceholder:`Exemple\xA0: Frieren\xA0: Au-delà de la fin du voyage`,searchEpisodeNumberPlaceholder:`Exemple : Épisode 1`,searchEpisodeTitlePlaceholder:`Exemple\xA0: la fin du voyage`,searchFreeword:`Recherche de mots libre`,searchInputModeToggle:`Changer le mode d'entrée (entrée détaillée/libre)`,searchPage:`Page de recherche`,searchTab:`Rechercher`,searchVideoHeading:`Recherchez la vidéo à partir de laquelle superposer les commentaires`,saveSettings:`Enregistrer les paramètres`,settings:`Paramètres`,settingsClose:`Fermer les paramètres`,settingsFabLabel:`Ouvrir les paramètres des commentaires Niconico`,playbackLoadFailed:`Échec du chargement des paramètres de lecture`,playbackSaveFailed:`Échec de l'enregistrement des paramètres de lecture`,settingsLoadFailed:`Échec du chargement des paramètres`,settingsSaved:`Paramètres enregistrés`,settingsSaveFailed:`Échec de l'enregistrement des paramètres`,success:`Succès`,videoDataLoadFailed:`Échec du chargement des données vidéo`,videoDataSaveFailed:`Échec de l'enregistrement des données vidéo`,warning:`Avertissement`},ar:{color:`اللون`,commentColor:`لون التعليق`,commentOpacity:`العتامة`,commentSettings:`إعدادات التعليق`,commentSettingsPanel:`لوحة إعدادات التعليق`,commentVisibility:`عرض التعليقات`,commentVisibilityToggle:`تبديل رؤية التعليق`,currentVideoUnset:`لم يتم تعيين أي فيديو متراكب`,error:`خطأ`,animeTitle:`عنوان الأنمي`,autoFillSearchForm:`املأ نموذج البحث بالعنوان ورقم الحلقة وعنوان الحلقة`,autoSearch:`البحث التلقائي`,autoSearchDescription:`قم بتعيين التعليقات تلقائيًا عند فتح صفحة المشاهدة`,autoSearchDisabledManual:`تم تعطيل البحث التلقائي (وضع الإعداد اليدوي)`,autoSearchEnabled:`تم تمكين البحث التلقائي`,autoSearchInfo:`حول البحث التلقائي`,fixedPlaybackRate:`سرعة القفل`,formInput:`ملء النموذج`,freeInput:`مدخلات مجانية`,idLoadFailed:`فشل تحميل معلومات الهوية`,idSaveFailed:`فشل في حفظ معلومات الهوية`,info:`معلومات`,manualSearchLoadFailed:`فشل تحميل إعدادات البحث`,manualSearchSaveFailed:`فشل في حفظ إعدادات البحث`,manualSearchPlaceholder:`أدخل كلمة رئيسية للبحث`,ngRegex:`NG التعبيرات العادية`,ngRegexPlaceholder:`أدخل تعبيرًا عاديًا NG واحدًا في كل سطر`,ngTab:`نانوغرام`,ngWords:`كلمات نانوغرام`,ngWordsPlaceholder:`أدخل كلمة NG واحدة في كل سطر`,noMessage:`لا توجد رسالة`,playbackRate:`سرعة التشغيل`,playbackRateFixedToggle:`تشغيل/إيقاف قفل سرعة التشغيل`,postedAt:`نشر في`,commentsSet:`تعيين التعليقات من "{title}"`,autoSetupComplete:`تم ضبط فيديو Niconico تلقائيًا`,autoSetupError:`خطأ في الإعداد التلقائي: {message}`,commentsLoadComplete:`تم الانتهاء من تحميل التعليقات ({count})`,commentsLoadErrorSelectAnother:`خطأ في تحميل التعليق: {message}\\nحدد فيديو آخر من الزر العائم.`,commentsUnavailable:`تعذر جلب التعليقات`,commentSourceUpdated:`مصدر التعليق المحدث: {title} ({count})`,commentFetchError:`خطأ في جلب التعليق: {message}`,domUpdateWaitFailed:`فشل في انتظار تحديث DOM: {message}`,episodeChangeDetected:`تم الكشف عن تغيير الحلقة...`,episodeNumberMissing:`لم أستطع الحصول على رقم الحلقة`,episodeSwitchError:`خطأ في تبديل الحلقة: {message}`,initializationError:`خطأ في التهيئة: {message}`,initializingCommentLoader:`جارٍ تهيئة أداة تحميل التعليقات...`,manualModeSelectAnimeTitle:`تم تمكين الوضع اليدوي. افتح علامة التبويب "بحث" من الزر العائم وقم بتعيين عنوان لأنمي.`,manualModeSelectVideo:`تم تمكين الوضع اليدوي. افتح علامة التبويب "بحث" من الزر العائم وحدد مقطع فيديو.`,manualModeCommentsLoadComplete:`[الوضع اليدوي] انتهى تحميل التعليقات ({count}) فيديو\\n: {title}`,metadataAutoFetchFailed:`فشل الجلب التلقائي من صفحة المشاهدة. لا يمكن الحصول على بيانات التعريف.`,niconicoNotFound:`لم يتم العثور على فيديو Niconico`,niconicoNotFoundManual:`لم يتم العثور على فيديو Niconico. البحث يدويا.`,nextEpisodeAutoSetupComplete:`قم بإعداد الحلقة التالية تلقائيًا`,nextVideoCommentsUnavailableClear:`تعذر جلب التعليقات للفيديو التالي. مسح عرض التعليق.`,noAnimeTitle:`لم أستطع الحصول على عنوان الأنمي. قد يتم تقليل دقة البحث.`,officialVideoMissingUseFirst:`لم يتم العثور على فيديو رسمي. باستخدام نتيجة البحث الأولى.`,officialVideoMissingManual:`لم يتم العثور على فيديو رسمي. البحث يدويا.`,officialVideoSafeguardInfo:`حول حماية الفيديو الرسمية`,unknownTitle:`عنوان غير معروف`,structuredInput:`مدخلات مفصلة`,thumbnail:`صورة مصغرة`,videoDataMissing:`لم يتم العثور على بيانات الفيديو.`,videoId:`معرف الفيديو`,videoOwner:`الرافع`,videoSwitchDetected:`تم اكتشاف تبديل الفيديو...`,videoSwitchError:`خطأ في تبديل الفيديو: {message}`,episodeNumber:`رقم الحلقة`,episodeTitleOptional:`عنوان الحلقة (اختياري)`,commentCount:`التعليقات`,commentCountLong:`عدد التعليقات`,mylistCount:`قائمتي`,mylistCountLong:`عدد قائمتي`,officialVideoMissing:`لم يتم العثور على فيديو رسمي. إظهار كافة نتائج البحث.`,searchingKeyword:`البحث عن "{keyword}"...`,searchKeywordRequired:`أدخل كلمة رئيسية للبحث`,searchNoResults:`لم يتم العثور على نتائج البحث`,searchFormFilled:`املأ نموذج البحث بـ "{keyword}"`,similarity:`التشابه: {score}%`,viewCount:`وجهات النظر`,viewCountLong:`عدد المشاهدات`,search:`بحث`,searchAnimePlaceholder:`مثال: Frieren: ما بعد نهاية الرحلة`,searchEpisodeNumberPlaceholder:`مثال: الحلقة 1`,searchEpisodeTitlePlaceholder:`مثال: نهاية الرحلة`,searchFreeword:`البحث عن الكلمات الحرة`,searchInputModeToggle:`تبديل وضع الإدخال (الإدخال التفصيلي / المجاني)`,searchPage:`صفحة البحث`,searchTab:`بحث`,searchVideoHeading:`ابحث عن الفيديو لتراكب التعليقات منه`,saveSettings:`حفظ الإعدادات`,settings:`الإعدادات`,settingsClose:`إغلاق الإعدادات`,settingsFabLabel:`افتح إعدادات تعليق Niconico`,playbackLoadFailed:`فشل تحميل إعدادات التشغيل`,playbackSaveFailed:`فشل في حفظ إعدادات التشغيل`,settingsLoadFailed:`فشل تحميل الإعدادات`,settingsSaved:`تم حفظ الإعدادات`,settingsSaveFailed:`فشل في حفظ الإعدادات`,success:`النجاح`,videoDataLoadFailed:`فشل تحميل بيانات الفيديو`,videoDataSaveFailed:`فشل في حفظ بيانات الفيديو`,warning:`تحذير`},pt:{color:`Cor`,commentColor:`Cor do comentário`,commentOpacity:`Opacidade`,commentSettings:`Configurações de comentários`,commentSettingsPanel:`Painel de configurações de comentários`,commentVisibility:`Mostrar comentários`,commentVisibilityToggle:`Alternar visibilidade dos comentários`,currentVideoUnset:`Nenhum vídeo de sobreposição está definido`,error:`Erro`,animeTitle:`Título do anime`,autoFillSearchForm:`Preencha o formulário de pesquisa com título, número do episódio e título do episódio`,autoSearch:`Pesquisa automática`,autoSearchDescription:`Defina comentários automaticamente quando a página de exibição for aberta`,autoSearchDisabledManual:`Pesquisa automática desativada (modo de configuração manual)`,autoSearchEnabled:`Pesquisa automática ativada`,autoSearchInfo:`Sobre a pesquisa automática`,fixedPlaybackRate:`Velocidade de bloqueio`,formInput:`Preencher formulário`,freeInput:`Entrada gratuita`,idLoadFailed:`Falha ao carregar informações de ID`,idSaveFailed:`Falha ao salvar informações de ID`,info:`Informações`,manualSearchLoadFailed:`Falha ao carregar as configurações de pesquisa`,manualSearchSaveFailed:`Falha ao salvar as configurações de pesquisa`,manualSearchPlaceholder:`Insira uma palavra-chave de pesquisa`,ngRegex:`Expressões regulares NG`,ngRegexPlaceholder:`Insira uma expressão regular NG por linha`,ngTab:`NG`,ngWords:`Palavras NG`,ngWordsPlaceholder:`Insira uma palavra NG por linha`,noMessage:`Nenhuma mensagem`,playbackRate:`Velocidade de reprodução`,playbackRateFixedToggle:`Ativar/desativar bloqueio de velocidade de reprodução`,postedAt:`Postado em`,commentsSet:`Definir comentários de "{title}"`,autoSetupComplete:`O vídeo do Niconico foi definido automaticamente`,autoSetupError:`Erro de configuração automática: {message}`,commentsLoadComplete:`Comentários de carregamento concluídos ({count})`,commentsLoadErrorSelectAnother:`Erro ao carregar o comentário: {message}\\nSelecione outro vídeo no botão flutuante.`,commentsUnavailable:`Não foi possível buscar comentários`,commentSourceUpdated:`Fonte de comentários atualizada: {title} ({count})`,commentFetchError:`Erro de busca de comentário: {message}`,domUpdateWaitFailed:`Falha ao esperar pela atualização do DOM: {message}`,episodeChangeDetected:`Alteração de episódio detectada...`,episodeNumberMissing:`Não foi possível obter o número do episódio`,episodeSwitchError:`Erro de troca de episódio: {message}`,initializationError:`Erro de inicialização: {message}`,initializingCommentLoader:`Inicializando carregador de comentários...`,manualModeSelectAnimeTitle:`O modo manual está ativado. Abra a guia Pesquisar no botão flutuante e defina um título de anime.`,manualModeSelectVideo:`O modo manual está ativado. Abra a guia Pesquisar no botão flutuante e selecione um vídeo.`,manualModeCommentsLoadComplete:`[Modo manual] Carregamento de comentários concluído ({count}) Vídeo\\n: {title}`,metadataAutoFetchFailed:`Falha na busca automática da página de exibição. Não foi possível adquirir metadados.`,niconicoNotFound:`Nenhum vídeo do Niconico foi encontrado`,niconicoNotFoundManual:`Nenhum vídeo do Niconico foi encontrado. Pesquise manualmente.`,nextEpisodeAutoSetupComplete:`Configure o próximo episódio automaticamente`,nextVideoCommentsUnavailableClear:`Não foi possível buscar comentários para o próximo vídeo. Limpando a exibição de comentários.`,noAnimeTitle:`Não foi possível obter o título do anime. A precisão da pesquisa pode ser reduzida.`,officialVideoMissingUseFirst:`Nenhum vídeo oficial foi encontrado. Usando o primeiro resultado da pesquisa.`,officialVideoMissingManual:`Nenhum vídeo oficial foi encontrado. Pesquise manualmente.`,officialVideoSafeguardInfo:`Sobre a proteção oficial de vídeo`,unknownTitle:`Título desconhecido`,structuredInput:`Entrada detalhada`,thumbnail:`Miniatura`,videoDataMissing:`Os dados de vídeo não foram encontrados.`,videoId:`ID do vídeo`,videoOwner:`Carregador`,videoSwitchDetected:`Troca de vídeo detectada...`,videoSwitchError:`Erro de troca de vídeo: {message}`,episodeNumber:`Número do episódio`,episodeTitleOptional:`Título do episódio (opcional)`,commentCount:`Comentários`,commentCountLong:`Contagem de comentários`,mylistCount:`Minha lista`,mylistCountLong:`Contagem da minha lista`,officialVideoMissing:`Nenhum vídeo oficial foi encontrado. Mostrando todos os resultados da pesquisa.`,searchingKeyword:`Procurando por "{keyword}"...`,searchKeywordRequired:`Insira uma palavra-chave de pesquisa`,searchNoResults:`Nenhum resultado de pesquisa foi encontrado`,searchFormFilled:`Preenchido o formulário de pesquisa com "{keyword}"`,similarity:`Semelhança: {score}%`,viewCount:`Visualizações`,viewCountLong:`Contagem de visualizações`,search:`Pesquisar`,searchAnimePlaceholder:`Exemplo: Frieren: Além do Fim da Jornada`,searchEpisodeNumberPlaceholder:`Exemplo: Episódio 1`,searchEpisodeTitlePlaceholder:`Exemplo: O Fim da Jornada`,searchFreeword:`Pesquisa de palavras grátis`,searchInputModeToggle:`Alternar modo de entrada (entrada detalhada/livre)`,searchPage:`Página de pesquisa`,searchTab:`Pesquisar`,searchVideoHeading:`Procure o vídeo para sobrepor comentários`,saveSettings:`Salvar configurações`,settings:`Configurações`,settingsClose:`Fechar configurações`,settingsFabLabel:`Abra as configurações de comentários do Niconico`,playbackLoadFailed:`Falha ao carregar as configurações de reprodução`,playbackSaveFailed:`Falha ao salvar as configurações de reprodução`,settingsLoadFailed:`Falha ao carregar as configurações`,settingsSaved:`Configurações salvas`,settingsSaveFailed:`Falha ao salvar as configurações`,success:`Sucesso`,videoDataLoadFailed:`Falha ao carregar dados de vídeo`,videoDataSaveFailed:`Falha ao salvar dados de vídeo`,warning:`Aviso`},bn:{color:`রঙ`,commentColor:`মন্তব্যের রঙ`,commentOpacity:`অস্বচ্ছতা`,commentSettings:`মন্তব্য সেটিংস`,commentSettingsPanel:`মন্তব্য সেটিংস প্যানেল`,commentVisibility:`মন্তব্য দেখান`,commentVisibilityToggle:`মন্তব্যের দৃশ্যমানতা টগল করুন`,currentVideoUnset:`কোনো ওভারলে ভিডিও সেট করা নেই`,error:`ত্রুটি`,animeTitle:`এনিমে শিরোনাম`,autoFillSearchForm:`শিরোনাম, পর্ব সংখ্যা এবং পর্বের শিরোনাম দিয়ে অনুসন্ধান ফর্মটি পূরণ করুন`,autoSearch:`স্বয়ংক্রিয় অনুসন্ধান`,autoSearchDescription:`ওয়াচ পেজ খুললে স্বয়ংক্রিয়ভাবে মন্তব্য সেট করুন`,autoSearchDisabledManual:`স্বয়ংক্রিয় অনুসন্ধান অক্ষম (ম্যানুয়াল সেটআপ মোড)`,autoSearchEnabled:`স্বয়ংক্রিয় অনুসন্ধান সক্ষম`,autoSearchInfo:`স্বয়ংক্রিয় অনুসন্ধান সম্পর্কে`,fixedPlaybackRate:`লক স্পিড`,formInput:`ফর্ম পূরণ করুন`,freeInput:`বিনামূল্যে ইনপুট`,idLoadFailed:`আইডি তথ্য লোড করতে ব্যর্থ হয়েছে`,idSaveFailed:`আইডি তথ্য সংরক্ষণ করতে ব্যর্থ`,info:`তথ্য`,manualSearchLoadFailed:`অনুসন্ধান সেটিংস লোড করতে ব্যর্থ হয়েছে৷`,manualSearchSaveFailed:`অনুসন্ধান সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে`,manualSearchPlaceholder:`একটি অনুসন্ধান কীওয়ার্ড লিখুন`,ngRegex:`NG রেগুলার এক্সপ্রেশন`,ngRegexPlaceholder:`প্রতি লাইনে একটি NG রেগুলার এক্সপ্রেশন লিখুন`,ngTab:`এনজি`,ngWords:`এনজি শব্দ`,ngWordsPlaceholder:`প্রতি লাইনে একটি NG শব্দ লিখুন`,noMessage:`কোন বার্তা নেই`,playbackRate:`প্লেব্যাক গতি`,playbackRateFixedToggle:`প্লেব্যাক স্পিড লক চালু/বন্ধ`,postedAt:`এ পোস্ট করা হয়েছে`,commentsSet:`"{title}" থেকে মন্তব্য সেট করুন`,autoSetupComplete:`Niconico ভিডিও স্বয়ংক্রিয়ভাবে সেট করা হয়েছে`,autoSetupError:`স্বয়ংক্রিয় সেটআপ ত্রুটি: {message}`,commentsLoadComplete:`মন্তব্য লোড করা সমাপ্ত ({count})`,commentsLoadErrorSelectAnother:`মন্তব্য লোডিং ত্রুটি: {message}\\nভাসমান বোতাম থেকে অন্য ভিডিও নির্বাচন করুন৷`,commentsUnavailable:`মন্তব্য আনা যায়নি`,commentSourceUpdated:`আপডেট করা মন্তব্যের উৎস: {title} ({count})`,commentFetchError:`মন্তব্য আনা ত্রুটি: {message}`,domUpdateWaitFailed:`DOM আপডেটের জন্য অপেক্ষা করতে ব্যর্থ হয়েছে: {message}`,episodeChangeDetected:`এপিসোড পরিবর্তন শনাক্ত করা হয়েছে...`,episodeNumberMissing:`পর্ব নম্বর পাওয়া যায়নি`,episodeSwitchError:`এপিসোড সুইচ ত্রুটি: {message}`,initializationError:`সূচনা ত্রুটি: {message}`,initializingCommentLoader:`মন্তব্য লোডার শুরু করা হচ্ছে...`,manualModeSelectAnimeTitle:`ম্যানুয়াল মোড সক্রিয় করা হয়েছে। ভাসমান বোতাম থেকে অনুসন্ধান ট্যাবটি খুলুন এবং একটি অ্যানিমে শিরোনাম সেট করুন।`,manualModeSelectVideo:`ম্যানুয়াল মোড সক্রিয় করা হয়েছে। ভাসমান বোতাম থেকে অনুসন্ধান ট্যাবটি খুলুন এবং একটি ভিডিও নির্বাচন করুন।`,manualModeCommentsLoadComplete:`[ম্যানুয়াল মোড] মন্তব্য লোড করা সমাপ্ত ({count})\\nভিডিও: {title}`,metadataAutoFetchFailed:`দেখার পৃষ্ঠা থেকে স্বয়ংক্রিয়ভাবে আনা ব্যর্থ হয়েছে. মেটাডেটা অর্জন করা যায়নি।`,niconicoNotFound:`কোন নিকোনিকো ভিডিও পাওয়া যায়নি`,niconicoNotFoundManual:`কোন নিকোনিকো ভিডিও পাওয়া যায়নি. ম্যানুয়ালি অনুসন্ধান করুন।`,nextEpisodeAutoSetupComplete:`পরের পর্ব স্বয়ংক্রিয়ভাবে সেট আপ করুন`,nextVideoCommentsUnavailableClear:`পরবর্তী ভিডিওর জন্য মন্তব্য আনা যায়নি. মন্তব্য প্রদর্শন সাফ করা হচ্ছে।`,noAnimeTitle:`অ্যানিমে শিরোনাম পেতে পারিনি। অনুসন্ধান নির্ভুলতা হ্রাস হতে পারে.`,officialVideoMissingUseFirst:`কোনো অফিসিয়াল ভিডিও পাওয়া যায়নি। প্রথম অনুসন্ধান ফলাফল ব্যবহার করে.`,officialVideoMissingManual:`কোনো অফিসিয়াল ভিডিও পাওয়া যায়নি। ম্যানুয়ালি অনুসন্ধান করুন।`,officialVideoSafeguardInfo:`অফিসিয়াল ভিডিও সুরক্ষা সম্পর্কে`,unknownTitle:`অজানা শিরোনাম`,structuredInput:`বিস্তারিত ইনপুট`,thumbnail:`থাম্বনেইল`,videoDataMissing:`ভিডিও তথ্য পাওয়া যায়নি.`,videoId:`ভিডিও আইডি`,videoOwner:`আপলোডার`,videoSwitchDetected:`শনাক্ত করা ভিডিও সুইচ...`,videoSwitchError:`ভিডিও সুইচ ত্রুটি: {message}`,episodeNumber:`পর্ব সংখ্যা`,episodeTitleOptional:`পর্বের শিরোনাম (ঐচ্ছিক)`,commentCount:`মন্তব্য`,commentCountLong:`মন্তব্য গণনা`,mylistCount:`মাইলিস্ট`,mylistCountLong:`মাইলিস্ট গণনা`,officialVideoMissing:`কোনো অফিসিয়াল ভিডিও পাওয়া যায়নি। সমস্ত অনুসন্ধান ফলাফল দেখাচ্ছে.`,searchingKeyword:`"{keyword}" এর জন্য অনুসন্ধান করা হচ্ছে...`,searchKeywordRequired:`একটি অনুসন্ধান কীওয়ার্ড লিখুন`,searchNoResults:`কোন অনুসন্ধান ফলাফল পাওয়া যায়নি`,searchFormFilled:`"{keyword}" দিয়ে অনুসন্ধান ফর্ম পূরণ করুন`,similarity:`সাদৃশ্য: {score}%`,viewCount:`ভিউ`,viewCountLong:`ভিউ গণনা`,search:`অনুসন্ধান করুন`,searchAnimePlaceholder:`উদাহরণ: Frieren: Beyond Journey's End`,searchEpisodeNumberPlaceholder:`উদাহরণ: পর্ব 1`,searchEpisodeTitlePlaceholder:`উদাহরণ: The Journey's End`,searchFreeword:`বিনামূল্যে শব্দ অনুসন্ধান`,searchInputModeToggle:`ইনপুট মোড পরিবর্তন করুন (বিস্তারিত / বিনামূল্যে ইনপুট)`,searchPage:`অনুসন্ধান পৃষ্ঠা`,searchTab:`অনুসন্ধান করুন`,searchVideoHeading:`থেকে মন্তব্য ওভারলে ভিডিও জন্য অনুসন্ধান করুন`,saveSettings:`সেটিংস সংরক্ষণ করুন`,settings:`সেটিংস`,settingsClose:`সেটিংস বন্ধ করুন`,settingsFabLabel:`নিকোনিকো মন্তব্য সেটিংস খুলুন`,playbackLoadFailed:`প্লেব্যাক সেটিংস লোড করতে ব্যর্থ৷`,playbackSaveFailed:`প্লেব্যাক সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে৷`,settingsLoadFailed:`সেটিংস লোড করতে ব্যর্থ হয়েছে৷`,settingsSaved:`সেটিংস সংরক্ষিত`,settingsSaveFailed:`সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে`,success:`সফলতা`,videoDataLoadFailed:`ভিডিও ডেটা লোড করতে ব্যর্থ হয়েছে৷`,videoDataSaveFailed:`ভিডিও ডেটা সংরক্ষণ করতে ব্যর্থ হয়েছে৷`,warning:`সতর্কতা`},ru:{color:`Цвет`,commentColor:`Цвет комментария`,commentOpacity:`Непрозрачность`,commentSettings:`Настройки комментариев`,commentSettingsPanel:`Панель настроек комментариев`,commentVisibility:`Показать комментарии`,commentVisibilityToggle:`Переключить видимость комментариев`,currentVideoUnset:`Наложение видео не установлено.`,error:`Ошибка`,animeTitle:`Название аниме`,autoFillSearchForm:`Заполните форму поиска, указав название, номер эпизода и название эпизода.`,autoSearch:`Автоматический поиск`,autoSearchDescription:`Автоматически устанавливать комментарии при открытии страницы просмотра`,autoSearchDisabledManual:`Автоматический поиск отключен (режим ручной настройки)`,autoSearchEnabled:`Автоматический поиск включен`,autoSearchInfo:`Об автопоиске`,fixedPlaybackRate:`Скорость блокировки`,formInput:`Заполнить форму`,freeInput:`Бесплатный вход`,idLoadFailed:`Не удалось загрузить идентификационную информацию.`,idSaveFailed:`Не удалось сохранить идентификационную информацию.`,info:`Информация`,manualSearchLoadFailed:`Не удалось загрузить настройки поиска.`,manualSearchSaveFailed:`Не удалось сохранить настройки поиска.`,manualSearchPlaceholder:`Введите ключевое слово для поиска`,ngRegex:`Регулярные выражения NG`,ngRegexPlaceholder:`Введите одно регулярное выражение NG в каждой строке.`,ngTab:`НГ`,ngWords:`НГ слова`,ngWordsPlaceholder:`Введите по одному слову NG в строке`,noMessage:`Нет сообщения`,playbackRate:`Скорость воспроизведения`,playbackRateFixedToggle:`Блокировка скорости воспроизведения вкл./выкл.`,postedAt:`Опубликовано в`,commentsSet:`Установить комментарии от «{title}»`,autoSetupComplete:`Видео Niconico было установлено автоматически`,autoSetupError:`Ошибка автоматической настройки: {message}.`,commentsLoadComplete:`Загрузка комментариев завершена ({count}).`,commentsLoadErrorSelectAnother:`Ошибка загрузки комментария: {message}\\nВыберите другое видео с помощью плавающей кнопки.`,commentsUnavailable:`Не удалось получить комментарии.`,commentSourceUpdated:`Обновленный источник комментариев: {title} ({count})`,commentFetchError:`Ошибка получения комментария: {message}.`,domUpdateWaitFailed:`Не удалось дождаться обновления DOM: {message}.`,episodeChangeDetected:`Обнаружено изменение эпизода...`,episodeNumberMissing:`Не удалось получить номер серии`,episodeSwitchError:`Ошибка переключения эпизодов: {message}.`,initializationError:`Ошибка инициализации: {message}.`,initializingCommentLoader:`Инициализация загрузчика комментариев...`,manualModeSelectAnimeTitle:`Ручной режим включен. Откройте вкладку «Поиск» с помощью плавающей кнопки и установите название аниме.`,manualModeSelectVideo:`Ручной режим включен. Откройте вкладку «Поиск» с помощью плавающей кнопки и выберите видео.`,manualModeCommentsLoadComplete:`[Ручной режим] Загрузка комментариев завершена ({count}) Видео\\n: {title}`,metadataAutoFetchFailed:`Не удалось выполнить автоматическое получение со страницы просмотра. Метаданные не удалось получить.`,niconicoNotFound:`Видео Niconico не найдено`,niconicoNotFoundManual:`Видео Niconico не найдено. Поиск вручную.`,nextEpisodeAutoSetupComplete:`Автоматически настроить следующий выпуск`,nextVideoCommentsUnavailableClear:`Не удалось получить комментарии к следующему видео. Очистка отображения комментариев.`,noAnimeTitle:`Не удалось получить название аниме. Точность поиска может снизиться.`,officialVideoMissingUseFirst:`Официального видео не найдено. Использование первого результата поиска.`,officialVideoMissingManual:`Официального видео не найдено. Поиск вручную.`,officialVideoSafeguardInfo:`Об официальной видеоохране`,unknownTitle:`Неизвестное название`,structuredInput:`Подробный ввод`,thumbnail:`Миниатюра`,videoDataMissing:`Видеоданные не найдены.`,videoId:`Идентификатор видео`,videoOwner:`Загрузчик`,videoSwitchDetected:`Обнаружено переключение видео...`,videoSwitchError:`Ошибка видеопереключателя: {message}`,episodeNumber:`Номер серии`,episodeTitleOptional:`Название серии (необязательно)`,commentCount:`Комментарии`,commentCountLong:`Количество комментариев`,mylistCount:`Мой список`,mylistCountLong:`Количество в моем списке`,officialVideoMissing:`Официального видео не найдено. Показаны все результаты поиска.`,searchingKeyword:`Ищем "{keyword}"...`,searchKeywordRequired:`Введите ключевое слово для поиска`,searchNoResults:`Результаты поиска не найдены`,searchFormFilled:`Заполнил форму поиска с помощью «{keyword}»`,similarity:`Сходство: {score}%`,viewCount:`Просмотры`,viewCountLong:`Количество просмотров`,search:`Поиск`,searchAnimePlaceholder:`Пример: Frieren: Beyond Journey’s End`,searchEpisodeNumberPlaceholder:`Пример: Эпизод 1`,searchEpisodeTitlePlaceholder:`Пример: Конец путешествия`,searchFreeword:`Свободный поиск слов`,searchInputModeToggle:`Переключение режима ввода (детальный/свободный ввод)`,searchPage:`Страница поиска`,searchTab:`Поиск`,searchVideoHeading:`Найдите видео, из которого можно наложить комментарии.`,saveSettings:`Сохранить настройки`,settings:`Настройки`,settingsClose:`Закрыть настройки`,settingsFabLabel:`Открыть настройки комментариев Niconico`,playbackLoadFailed:`Не удалось загрузить настройки воспроизведения.`,playbackSaveFailed:`Не удалось сохранить настройки воспроизведения.`,settingsLoadFailed:`Не удалось загрузить настройки`,settingsSaved:`Настройки сохранены.`,settingsSaveFailed:`Не удалось сохранить настройки.`,success:`Успех`,videoDataLoadFailed:`Не удалось загрузить видеоданные.`,videoDataSaveFailed:`Не удалось сохранить видеоданные.`,warning:`Предупреждение`},ur:{color:`رنگ`,commentColor:`تبصرہ کا رنگ`,commentOpacity:`دھندلاپن`,commentSettings:`تبصرہ کی ترتیبات`,commentSettingsPanel:`تبصرہ کی ترتیبات کا پینل`,commentVisibility:`تبصرے دکھائیں۔`,commentVisibilityToggle:`تبصرے کی مرئیت کو ٹوگل کریں۔`,currentVideoUnset:`کوئی اوورلے ویڈیو سیٹ نہیں ہے۔`,error:`خرابی`,animeTitle:`موبائل فونز کا عنوان`,autoFillSearchForm:`سرچ فارم کو عنوان، قسط نمبر، اور قسط کے عنوان کے ساتھ پُر کریں۔`,autoSearch:`خودکار تلاش`,autoSearchDescription:`دیکھنے کا صفحہ کھلنے پر تبصرے خود بخود سیٹ کریں۔`,autoSearchDisabledManual:`خودکار تلاش غیر فعال (دستی سیٹ اپ موڈ)`,autoSearchEnabled:`خودکار تلاش فعال ہے۔`,autoSearchInfo:`خودکار تلاش کے بارے میں`,fixedPlaybackRate:`لاک رفتار`,formInput:`فارم پُر کریں۔`,freeInput:`مفت ان پٹ`,idLoadFailed:`ID کی معلومات لوڈ کرنے میں ناکام`,idSaveFailed:`ID کی معلومات محفوظ کرنے میں ناکام`,info:`معلومات`,manualSearchLoadFailed:`تلاش کی ترتیبات لوڈ کرنے میں ناکام`,manualSearchSaveFailed:`تلاش کی ترتیبات کو محفوظ کرنے میں ناکام`,manualSearchPlaceholder:`تلاش کا مطلوبہ لفظ درج کریں۔`,ngRegex:`NG ریگولر ایکسپریشنز`,ngRegexPlaceholder:`فی لائن ایک NG ریگولر ایکسپریشن درج کریں۔`,ngTab:`این جی`,ngWords:`NG الفاظ`,ngWordsPlaceholder:`فی لائن ایک NG لفظ درج کریں۔`,noMessage:`کوئی پیغام نہیں۔`,playbackRate:`پلے بیک کی رفتار`,playbackRateFixedToggle:`پلے بیک اسپیڈ لاک آن/آف`,postedAt:`پر پوسٹ کیا گیا۔`,commentsSet:`"{title}" سے تبصرے سیٹ کریں`,autoSetupComplete:`Niconico ویڈیو خود بخود ترتیب دی گئی تھی۔`,autoSetupError:`آٹو سیٹ اپ کی خرابی: {message}`,commentsLoadComplete:`تبصرے لوڈ کرنا مکمل ہو گیا ({count})`,commentsLoadErrorSelectAnother:`تبصرہ لوڈ کرنے میں خرابی: {message}\\nتیرتے بٹن سے ایک اور ویڈیو منتخب کریں۔`,commentsUnavailable:`تبصرے حاصل نہیں کر سکے۔`,commentSourceUpdated:`تجدید شدہ تبصرہ ماخذ: {title} ({count})`,commentFetchError:`تبصرہ کی بازیافت کی خرابی: {message}`,domUpdateWaitFailed:`DOM اپ ڈیٹ کا انتظار کرنے میں ناکام: {message}`,episodeChangeDetected:`ایپی سوڈ کی تبدیلی کا پتہ چلا...`,episodeNumberMissing:`قسط نمبر نہیں مل سکا`,episodeSwitchError:`ایپی سوڈ سوئچ کی خرابی: {message}`,initializationError:`ابتدائی غلطی: {message}`,initializingCommentLoader:`تبصرہ لوڈر شروع کیا جا رہا ہے...`,manualModeSelectAnimeTitle:`دستی موڈ فعال ہے۔ تیرتے ہوئے بٹن سے سرچ ٹیب کو کھولیں اور ایک anime عنوان سیٹ کریں۔`,manualModeSelectVideo:`دستی موڈ فعال ہے۔ تیرتے ہوئے بٹن سے سرچ ٹیب کھولیں اور ایک ویڈیو منتخب کریں۔`,manualModeCommentsLoadComplete:`[دستی موڈ] تبصرے کو لوڈ کرنا ({count})\\nویڈیو: {title}`,metadataAutoFetchFailed:`واچ پیج سے خودکار بازیافت ناکام ہو گئی۔ میٹا ڈیٹا حاصل نہیں کیا جا سکا۔`,niconicoNotFound:`Niconico کی کوئی ویڈیو نہیں ملی`,niconicoNotFoundManual:`Niconico کی کوئی ویڈیو نہیں ملی۔ دستی طور پر تلاش کریں۔`,nextEpisodeAutoSetupComplete:`اگلی قسط خود بخود ترتیب دیں۔`,nextVideoCommentsUnavailableClear:`اگلی ویڈیو کے لیے تبصرے حاصل نہیں کیے جا سکے۔ تبصرہ ڈسپلے کو صاف کرنا۔`,noAnimeTitle:`anime عنوان حاصل نہیں کر سکا۔ تلاش کی درستگی کم ہو سکتی ہے۔`,officialVideoMissingUseFirst:`کوئی سرکاری ویڈیو نہیں ملی۔ پہلے تلاش کا نتیجہ استعمال کرنا۔`,officialVideoMissingManual:`کوئی سرکاری ویڈیو نہیں ملی۔ دستی طور پر تلاش کریں۔`,officialVideoSafeguardInfo:`سرکاری ویڈیو حفاظت کے بارے میں`,unknownTitle:`نامعلوم عنوان`,structuredInput:`تفصیلی ان پٹ`,thumbnail:`تھمب نیل`,videoDataMissing:`ویڈیو ڈیٹا نہیں ملا۔`,videoId:`ویڈیو آئی ڈی`,videoOwner:`اپ لوڈ کرنے والا`,videoSwitchDetected:`ویڈیو سوئچ کا پتہ چلا...`,videoSwitchError:`ویڈیو سوئچ کی خرابی: {message}`,episodeNumber:`قسط نمبر`,episodeTitleOptional:`قسط کا عنوان (اختیاری)`,commentCount:`تبصرے`,commentCountLong:`تبصرہ شمار`,mylistCount:`مائی لسٹ`,mylistCountLong:`مائی لسٹ شمار`,officialVideoMissing:`کوئی سرکاری ویڈیو نہیں ملی۔ تلاش کے تمام نتائج دکھا رہا ہے۔`,searchingKeyword:`"{keyword}" تلاش کر رہا ہے...`,searchKeywordRequired:`تلاش کا مطلوبہ لفظ درج کریں۔`,searchNoResults:`تلاش کے کوئی نتائج نہیں ملے`,searchFormFilled:`"{keyword}" کے ساتھ تلاش کا فارم بھرا`,similarity:`مماثلت: {score}%`,viewCount:`مناظر`,viewCountLong:`دیکھنے کی تعداد`,search:`تلاش کریں۔`,searchAnimePlaceholder:`مثال: فریرین: سفر کے اختتام سے آگے`,searchEpisodeNumberPlaceholder:`مثال: قسط 1`,searchEpisodeTitlePlaceholder:`مثال: سفر کا اختتام`,searchFreeword:`مفت الفاظ کی تلاش`,searchInputModeToggle:`ان پٹ موڈ سوئچ کریں (تفصیلی / مفت ان پٹ)`,searchPage:`صفحہ تلاش کریں۔`,searchTab:`تلاش کریں۔`,searchVideoHeading:`تبصروں کو اوورلے کرنے کے لیے ویڈیو تلاش کریں۔`,saveSettings:`ترتیبات کو محفوظ کریں۔`,settings:`ترتیبات`,settingsClose:`ترتیبات بند کریں۔`,settingsFabLabel:`نیکونیکو تبصرہ کی ترتیبات کھولیں۔`,playbackLoadFailed:`پلے بیک کی ترتیبات لوڈ کرنے میں ناکام`,playbackSaveFailed:`پلے بیک کی ترتیبات کو محفوظ کرنے میں ناکام`,settingsLoadFailed:`ترتیبات لوڈ کرنے میں ناکام`,settingsSaved:`ترتیبات محفوظ ہو گئیں۔`,settingsSaveFailed:`ترتیبات کو محفوظ کرنے میں ناکام`,success:`کامیابی`,videoDataLoadFailed:`ویڈیو ڈیٹا لوڈ کرنے میں ناکام`,videoDataSaveFailed:`ویڈیو ڈیٹا محفوظ کرنے میں ناکام`,warning:`وارننگ`}},`en`),defaultLocale:`ja`,fallbackLocale:`en`});oi.setLocale(oi.detectBrowserLocale());function si(e){return oi.t(e)}var E=oi.format,D=oi.t,ci=6700,li=e=>{if(!e||typeof e!=`object`||Array.isArray(e))return{};let t=e;return t.scrollVisibleDurationMs===ci?{...t,scrollVisibleDurationMs:null}:t},ui=`settings`,di=`currentVideo`,fi=`lastDanimeIds`,pi=`playbackSettings`,mi=`manualSearchSettings`,hi=e=>({...e,ngWords:[...e.ngWords],ngRegexps:[...e.ngRegexps]}),gi={fixedModeEnabled:!1,fixedRate:1.11},_i=e=>({fixedModeEnabled:e.fixedModeEnabled,fixedRate:e.fixedRate}),vi=class{notifier;settings;currentVideo;observers=new Set;playbackSettings;playbackObservers=new Set;constructor(e){this.notifier=e,this.settings=qr(),this.currentVideo=null,this.loadSettings(),this.currentVideo=this.loadVideoData(),this.playbackSettings=_i(gi),this.loadPlaybackSettings()}getSettings(){return hi(this.settings)}loadSettings(){try{let e=Xr(ui,null);if(!e)return this.settings=qr(),this.settings;if(typeof e==`string`){let t=li(JSON.parse(e));this.settings={...qr(),...t,ngWords:Array.isArray(t?.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t?.ngRegexps)?[...t.ngRegexps]:[]}}else{let t=li(e);this.settings={...qr(),...t,ngWords:Array.isArray(t.ngWords)?[...t.ngWords]:[],ngRegexps:Array.isArray(t.ngRegexps)?[...t.ngRegexps]:[]}}return this.notifyObservers(),this.settings}catch(e){return console.error(`[SettingsManager] 設定の読み込みに失敗しました`,e),this.notify(D(`settingsLoadFailed`),`error`),this.settings=qr(),this.settings}}getPlaybackSettings(){return _i(this.playbackSettings)}loadPlaybackSettings(){try{let e=Xr(pi,null);if(!e)return this.playbackSettings=_i(gi),this.notifyPlaybackObservers(),this.playbackSettings;if(typeof e==`string`){let t=JSON.parse(e);this.playbackSettings={fixedModeEnabled:typeof t.fixedModeEnabled==`boolean`?t.fixedModeEnabled:gi.fixedModeEnabled,fixedRate:typeof t.fixedRate==`number`?t.fixedRate:gi.fixedRate}}else this.playbackSettings={fixedModeEnabled:e.fixedModeEnabled,fixedRate:e.fixedRate};return this.notifyPlaybackObservers(),this.playbackSettings}catch(e){return console.error(`[SettingsManager] 再生設定の読み込みに失敗しました`,e),this.notify(D(`playbackLoadFailed`),`error`),this.playbackSettings=_i(gi),this.notifyPlaybackObservers(),this.playbackSettings}}updatePlaybackSettings(e){return this.playbackSettings={...this.playbackSettings,...e},this.savePlaybackSettings()}savePlaybackSettings(){try{return Zr(pi,JSON.stringify(this.playbackSettings)),this.notifyPlaybackObservers(),!0}catch(e){return console.error(`[SettingsManager] 再生設定の保存に失敗しました`,e),this.notify(D(`playbackSaveFailed`),`error`),!1}}saveSettings(){let e=this.persistSettings();return e&&this.notify(D(`settingsSaved`),`success`),e}updateSettings(e){return this.settings={...this.settings,...e,ngWords:e.ngWords?[...e.ngWords]:[...this.settings.ngWords??[]],ngRegexps:e.ngRegexps?[...e.ngRegexps]:[...this.settings.ngRegexps??[]]},this.persistSettings()}persistSettings(){try{return Zr(ui,JSON.stringify(this.settings)),this.notifyObservers(),!0}catch(e){return console.error(`[SettingsManager] 設定の保存に失敗しました`,e),this.notify(D(`settingsSaveFailed`),`error`),!1}}addObserver(e){this.observers.add(e)}removeObserver(e){this.observers.delete(e)}addPlaybackObserver(e){this.playbackObservers.add(e);try{e(this.getPlaybackSettings())}catch(e){console.error(`[SettingsManager] 再生設定の登録通知でエラー`,e)}}removePlaybackObserver(e){this.playbackObservers.delete(e)}notifyObservers(){let e=this.getSettings();for(let t of this.observers)try{t(e)}catch(e){console.error(`[SettingsManager] 設定変更通知でエラー`,e)}}notifyPlaybackObservers(){let e=this.getPlaybackSettings();for(let t of this.playbackObservers)try{t(e)}catch(e){console.error(`[SettingsManager] 再生設定通知でエラー`,e)}}loadVideoData(){try{return Xr(di,null)??null}catch(e){return console.error(`[SettingsManager] 動画データの読み込みに失敗しました`,e),this.notify(D(`videoDataLoadFailed`),`error`),null}}saveVideoData(e,t){try{let e={videoId:t.videoId,title:t.title,viewCount:t.viewCount,commentCount:t.commentCount,mylistCount:t.mylistCount,postedAt:t.postedAt,thumbnail:t.thumbnail,owner:t.owner??null,channel:t.channel??null};return Zr(di,e),this.currentVideo=e,!0}catch(e){return console.error(`[SettingsManager] 動画データの保存に失敗しました`,e),this.notify(D(`videoDataSaveFailed`),`error`),!1}}getCurrentVideo(){return this.currentVideo?{...this.currentVideo}:null}saveLastDanimeIds(e){try{return Zr(fi,e),!0}catch(e){return console.error(`[SettingsManager] saveLastDanimeIds failed`,e),this.notify(D(`idSaveFailed`),`error`),!1}}loadLastDanimeIds(){try{return Xr(fi,null)??null}catch(e){return console.error(`[SettingsManager] loadLastDanimeIds failed`,e),this.notify(D(`idLoadFailed`),`error`),null}}saveManualSearchSettings(e){try{return Zr(mi,e),!0}catch(e){return console.error(`[SettingsManager] saveManualSearchSettings failed`,e),this.notify(D(`manualSearchSaveFailed`),`error`),!1}}loadManualSearchSettings(){try{return Xr(mi,null)??null}catch(e){return console.error(`[SettingsManager] loadManualSearchSettings failed`,e),this.notify(D(`manualSearchLoadFailed`),`error`),null}}notify(e,t=`info`){this.notifier?.show(e,t)}},yi=new Set([`INPUT`,`TEXTAREA`]),bi=e=>e.length===1?e.toUpperCase():e,xi=e=>e?`${e}+`:``,Si=class{shortcuts=new Map;boundHandler;isEnabled=!0;isListening=!1;constructor(){this.boundHandler=this.handleKeyDown.bind(this)}addShortcut(e,t,n){let r=this.createShortcutKey(bi(e),t);this.shortcuts.set(r,n)}removeShortcut(e,t){let n=this.createShortcutKey(bi(e),t);this.shortcuts.delete(n)}startListening(){this.isListening||=(document.addEventListener(`keydown`,this.boundHandler,!1),!0)}stopListening(){this.isListening&&=(document.removeEventListener(`keydown`,this.boundHandler,!1),!1)}setEnabled(e){this.isEnabled=e}createShortcutKey(e,t){return`${xi(t)}${e}`}extractModifier(e){let t=[];return e.ctrlKey&&t.push(`Ctrl`),e.altKey&&t.push(`Alt`),e.shiftKey&&t.push(`Shift`),e.metaKey&&t.push(`Meta`),t.length>0?t.join(`+`):null}handleKeyDown(e){if(!this.isEnabled)return;let t=e.target?.tagName??``;if(yi.has(t))return;let n=this.extractModifier(e),r=this.createShortcutKey(bi(e.key),n),i=this.shortcuts.get(r);i&&(e.preventDefault(),i())}},Ci=r(`dAnime:CommentRenderer`),wi=e=>({loggerNamespace:`dAnime:CommentRenderer`,...e??{}}),Ti=e=>{if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.commentColor==`string`&&typeof t.commentOpacity==`number`&&typeof t.isCommentVisible==`boolean`},Ei=class{renderer;keyboardHandler=null;constructor(e,t){this.renderer=Ti(e)||e===null?new T(e??null,wi(t)):new T(wi(e))}get settings(){return this.renderer.settings}set settings(e){this.renderer.settings=e}initialize(e){this.renderer.initialize(e),this.setupKeyboardShortcuts()}addComment(e,t,n=[]){return this.renderer.addComment(e,t,n)}clearComments(){this.renderer.clearComments()}resetState(){this.renderer.resetState()}destroy(){this.teardownKeyboardShortcuts(),this.renderer.destroy()}updateSettings(e){this.renderer.settings=e}getVideoElement(){return this.renderer.getVideoElement()}getCurrentVideoSource(){return this.renderer.getCurrentVideoSource()}getCommentsSnapshot(){return this.renderer.getCommentsSnapshot()}isNGComment(e){return this.renderer.isNGComment(e)}resize(e,t){this.renderer.resize(e,t)}setCommentVisibility(e){this.renderer.setCommentVisibility(e)}setupKeyboardShortcuts(){this.teardownKeyboardShortcuts();let e=new Si;e.addShortcut(`C`,`Shift`,()=>{try{let e=!this.renderer.settings.isCommentVisible;this.renderer.setCommentVisibility(e),this.syncGlobalSettings(this.renderer.settings)}catch(e){Ci.error(`CommentRenderer.keyboardShortcut`,e)}}),e.startListening(),this.keyboardHandler=e}teardownKeyboardShortcuts(){this.keyboardHandler?.stopListening(),this.keyboardHandler=null}syncGlobalSettings(e){(window.dAniRenderer?.settingsManager)?.updateSettings(e)}},Di=class{shadowRoot=null;container=null;createShadowDOM(e,t={mode:`closed`}){if(!e)throw Error(`Host element is required for shadow DOM creation`);return this.shadowRoot=e.attachShadow(t),this.container=document.createElement(`div`),this.shadowRoot.appendChild(this.container),this.shadowRoot}addStyles(e){if(!this.shadowRoot)throw Error(`Shadow root not initialized`);let t=document.createElement(`style`);t.textContent=e,this.shadowRoot.appendChild(t)}querySelector(e){return this.shadowRoot?this.shadowRoot.querySelector(e):null}querySelectorAll(e){return this.shadowRoot?this.shadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}setHTML(e){if(!this.container)throw Error(`Container not initialized`);this.container.innerHTML=e}destroy(){this.shadowRoot?.host&&this.shadowRoot.host.remove(),this.shadowRoot=null,this.container=null}},Oi=`\r
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
`,ki=`:host {
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
`,Ai=`:host {\r
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
`,ji=class{static getCommonStyles(){return Oi}static getNotificationStyles(){return ki}static getAutoButtonStyles(){return Ai}},Mi={success:`✔`,warning:`⚠`,error:`✖`,info:`ℹ`},O=class e extends Di{static instance=null;static notifications=[];hostElement=null;initialized=!1;static getInstance(){return this.instance||=new e,this.instance}static show(e,t=`info`,n=3e3){try{let r=this.getInstance();return r.initialize(),r.initialized?r.createNotification(e,t,n):null}catch(e){return console.error(`[NotificationManager] show failed`,e),null}}static removeNotification(e){this.getInstance().removeNotification(e.element)}show(t,n=`info`){e.show(t,n)}initialize(){if(!this.initialized)try{this.hostElement=document.createElement(`div`),this.hostElement.className=`nico-comment-shadow-host notification-host`,this.hostElement.style.cssText=`position: fixed;top: 0;right: 0;z-index: 2147483647;pointer-events: none`,document.body.appendChild(this.hostElement),this.createShadowDOM(this.hostElement),this.addStyles(ji.getNotificationStyles()),this.setHTML(`<div class="notification-container"></div>`),this.initialized=!0}catch(e){console.error(`[NotificationManager] initialize failed`,e),this.initialized=!1}}destroy(){e.notifications.forEach(e=>{e.timerId&&window.clearTimeout(e.timerId)}),e.notifications=[],this.hostElement?.parentNode&&this.hostElement.parentNode.removeChild(this.hostElement),this.hostElement=null,this.initialized=!1,e.instance=null}createNotification(t,n,r){try{let i=this.querySelector(`.notification-container`);if(!i)throw Error(`Notification container not found`);let a=Mi[n]??Mi.info,o=document.createElement(`div`);o.className=`notification-item ${n}`;let s=document.createElement(`div`);s.className=`notification-icon`,s.innerHTML=`<span>${a}</span>`,o.appendChild(s);let c=document.createElement(`div`);c.className=`notification-content`;let l=document.createElement(`div`);l.className=`notification-type`,l.textContent=si(n),c.appendChild(l);let u=document.createElement(`div`);u.className=`notification-message`,u.innerHTML=t.includes(`<`)?t||D(`noMessage`):(t||D(`noMessage`)).split(`
`).map(e=>e.trim()).filter(e=>e.length>0).join(`<br>`),c.appendChild(u),o.appendChild(c);let d=document.createElement(`button`);d.className=`notification-close`,d.innerHTML=`&times;`,d.addEventListener(`click`,()=>{this.removeNotification(o)}),o.appendChild(d),i.appendChild(o),requestAnimationFrame(()=>{o.classList.add(`show`)});let f={element:o,timerId:window.setTimeout(()=>{this.removeNotification(o)},r)};return e.notifications.push(f),f}catch(e){return console.error(`[NotificationManager] createNotification failed`,e),null}}removeNotification(t){if(!t)return;let n=e.notifications.find(e=>e.element===t);n?.timerId&&window.clearTimeout(n.timerId),t.classList.remove(`show`),window.setTimeout(()=>{try{t.remove(),e.notifications=e.notifications.filter(e=>e.element!==t)}catch(e){console.error(`[NotificationManager] removeNotification cleanup failed`,e)}},500)}},Ni=`https://www.nicovideo.jp`,Pi=`${Ni}/search`,Fi=`${Ni}/watch`,Ii={base:Ni,searchBase:Pi,watchBase:Fi},Li=e=>`${Fi}/${e}`,Ri=e=>`${Pi}/${encodeURIComponent(e)}`,zi=e=>new Promise((t,n)=>{Qr({url:e.url,method:e.method??`GET`,...e.anonymous===void 0?{}:{anonymous:e.anonymous},headers:e.headers,data:e.data,responseType:e.responseType??`text`,timeout:e.timeout,onprogress:e.onprogress,onload:e=>{t({status:e.status,statusText:e.statusText,response:e.response,finalUrl:e.finalUrl,headers:e.responseHeaders})},onerror:e=>{let t=e?.error??`unknown error`;n(Error(`GM_xmlhttpRequest failed: ${t}`))},ontimeout:()=>{n(Error(`GM_xmlhttpRequest timeout`))}})});function Bi(e){let t=Object.values(e).filter(e=>typeof e==`number`);return Object.entries(e).filter(([e,n])=>t.indexOf(+e)===-1).map(([e,t])=>t)}function Vi(e,t=`|`){return e.map(e=>ua(e)).join(t)}function Hi(e,t){return typeof t==`bigint`?t.toString():t}var Ui=class{constructor(e){this._getter=e,this._value=void 0}get value(){let e=this._getter;return e!==void 0&&(this._value=e(),this._getter=void 0),this._value}};function Wi(e){return new Ui(e)}function Gi(e){return e==null}function Ki(e){let t=+!!e.startsWith(`^`),n=e.endsWith(`$`)?e.length-1:e.length;return e.slice(t,n)}function qi(e,t){let n=e/t,r=Math.round(n),i=4*2**-52*Math.max(Math.abs(n),1);return Math.abs(n-r)<i?0:n-r}function Ji(e,t,n){Object.defineProperty(e,t,{value:n,writable:!0,enumerable:!0,configurable:!0})}function Yi(e){let t=Object.getOwnPropertyDescriptor(e,`shape`);return t?.get?t.get.raw:t?.value}function k(e){return Yi(e._zod.def)??e._zod.def.shape}function Xi(e,t,n){Object.defineProperty(e,t,{get(){let e=n();return Ji(this,t,e),e},enumerable:!0,configurable:!0})}function Zi(e,t,n){t in e?Ji(e,t,n):e[t]=n}function Qi(e,t,n,r){let i=k(t);for(let a of n){let n=Object.getOwnPropertyDescriptor(i,a);n.enumerable&&(n.get?Xi(e,a,()=>{let e=t._zod.def.shape[a];return r?r(e,a):e}):Zi(e,a,r?r(n.value,a):n.value))}}function $i(e,t){for(let n of Reflect.ownKeys(t)){let r=Object.getOwnPropertyDescriptor(t,n);r.enumerable&&(r.get?Xi(e,n,()=>t[n]):Zi(e,n,r.value))}}function A(...e){let t={};for(let n of e){let e=Object.getOwnPropertyDescriptors(n);Object.assign(t,e)}return Object.defineProperties({},t)}function ea(e){return JSON.stringify(e)}function ta(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,``).replace(/[\s_-]+/g,`-`).replace(/^-+|-+$/g,``)}var na=`captureStackTrace`in Error?Error.captureStackTrace:(...e)=>{};function ra(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}var ia=Wi(()=>{if(F.jitless||typeof navigator<`u`&&navigator?.userAgent?.includes(`Cloudflare`))return!1;try{return Function(``),!0}catch{return!1}});function aa(e){if(ra(e)===!1)return!1;let t=e.constructor;if(t===void 0||typeof t!=`function`)return!0;let n=t.prototype;return ra(n)!==!1&&Object.prototype.hasOwnProperty.call(n,`isPrototypeOf`)!==!1}function oa(e){return aa(e)?{...e}:Array.isArray(e)?[...e]:e instanceof Map?new Map(e):e instanceof Set?new Set(e):e}var sa=new Set([`string`,`number`,`symbol`]);function ca(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function la(e,t,n){let r=new e._zod.constr(t??e._zod.def);return(!t||n?.parent)&&(r._zod.parent=e),r}function j(e){let t=e;if(!t)return{};if(typeof t==`string`)return{error:()=>t};if(t?.message!==void 0){if(t?.error!==void 0)throw Error("Cannot specify both `message` and `error` params");t.error=t.message}return delete t.message,typeof t.error==`string`?{...t,error:()=>t.error}:t}function ua(e){return typeof e==`bigint`?e.toString()+`n`:typeof e==`string`?`"${e}"`:`${e}`}function da(e){return Object.keys(e).filter(t=>e[t]._zod.optin!==void 0&&e[t]._zod.optout===`optional`)}var fa={safeint:[-(2**53-1),2**53-1],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]},pa={int64:[BigInt(`-9223372036854775808`),BigInt(`9223372036854775807`)],uint64:[BigInt(0),BigInt(`18446744073709551615`)]};function ma(e,t){let n=e._zod.def,r=n.checks;if(r&&r.length>0)throw Error(`.pick() cannot be used on object schemas containing refinements`);let i={};return Qi(i,e,ha(e,t)),la(e,A(n,{shape:i,checks:[]}))}function ha(e,t){let n=k(e),r=[];for(let e of Reflect.ownKeys(t)){if(!Object.getOwnPropertyDescriptor(n,e)?.enumerable)throw Error(`Unrecognized key: "${String(e)}"`);t[e]&&r.push(e)}return r}function ga(e,t){let n=e._zod.def,r=n.checks;if(r&&r.length>0)throw Error(`.omit() cannot be used on object schemas containing refinements`);let i=new Set(ha(e,t)),a={};return Qi(a,e,Reflect.ownKeys(k(e)).filter(e=>!i.has(e))),la(e,A(n,{shape:a,checks:[]}))}function _a(e,t){if(!aa(t))throw Error(`Invalid input to extend: expected a plain object`);let n=e._zod.def.checks;if(n&&n.length>0){let n=k(e);for(let e of Reflect.ownKeys(t))if(Object.getOwnPropertyDescriptor(n,e)!==void 0)throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}return la(e,A(e._zod.def,{shape:va(e,t)}))}function va(e,t){let n={};return Qi(n,e,Reflect.ownKeys(k(e))),$i(n,t),n}function ya(e,t){if(!aa(t))throw Error(`Invalid input to safeExtend: expected a plain object`);return la(e,A(e._zod.def,{shape:va(e,t)}))}function ba(e,t){if(!t?._zod?.def)throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");if(e._zod.def.checks?.length)throw Error(`.merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.`);let n={};return Qi(n,e,Reflect.ownKeys(k(e))),Qi(n,t,Reflect.ownKeys(k(t))),la(e,A(e._zod.def,{shape:n,get catchall(){return t._zod.def.catchall},checks:t._zod.def.checks??[]}))}function xa(e,t,n,r=`partial`){let i=t._zod.def.checks;if(i&&i.length>0)throw Error(`.${r}() cannot be used on object schemas containing refinements`);let a=n?new Set(ha(t,n)):void 0,o={};return Qi(o,t,Reflect.ownKeys(k(t)),e&&((t,n)=>a&&!a.has(n)?t:new e({type:`optional`,innerType:t}))),la(t,A(t._zod.def,{shape:o,checks:[]}))}function Sa(e,t,n){let r=n?new Set(ha(t,n)):void 0,i={};return Qi(i,t,Reflect.ownKeys(k(t)),(t,n)=>r&&!r.has(n)?t:new e({type:`nonoptional`,innerType:t})),la(t,A(t._zod.def,{shape:i}))}function M(e,t=0){if(e.aborted===!0)return!0;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue!==!0)return!0;return!1}function Ca(e,t=0){if(e.aborted===!0)return!0;for(let n=t;n<e.issues.length;n++)if(e.issues[n]?.continue===!1)return!0;return!1}function wa(e,t){return t.map(t=>{var n;return(n=t).path??(n.path=[]),t.path.unshift(e),t})}function Ta(e){return typeof e==`string`?e:e?.message}function Ea(e){let t=[];for(let n of e??[]){let e=n._zod.def;if(!/_(length|size)$|_equals$/.test(e.check))break;let r=e.maximum??e.length??e.size;r>=0&&t.push([r,n])}return t}function Da(e,t,n){var r;for(let i=t;i<e.length;i++)(r=e[i]).schema??(r.schema=n)}function Oa(e,t,n){var r;let i=e.inst?._zod?.traits;i?.has(`$ZodType`)&&(i.has(`$ZodCheck`)?(r=e).schema??(r.schema=e.inst):e.schema=e.inst);let a=e.schema===e.inst?void 0:e.schema?._zod.def?.error,o=e.message?e.message:Ta(e.inst?._zod.def?.error?.(e))??Ta(a?.(e))??Ta(t?.error?.(e))??Ta(n.customError?.(e))??Ta(n.localeError?.(e))??`Invalid input`,s={};for(let t of Object.keys(e))t!==`inst`&&t!==`schema`&&t!==`continue`&&t!==`input`&&t!==`__proto__`&&(s[t]=e[t]);return s.path??=[],s.message=o,t?.reportInput&&(s.input=e.input),s}var ka=/[\uD800-\uDBFF]/;function Aa(e){let t=e.length;if(!ka.test(e))return t;let n=t;for(let r=0;r<t-1;r++)(e.charCodeAt(r)&64512)==55296&&(e.charCodeAt(r+1)&64512)==56320&&(n--,r++);return n}function ja(e){return Array.isArray(e)?`array`:typeof e==`string`?`string`:`unknown`}function Ma(e){let t=typeof e;switch(t){case`number`:return Number.isNaN(e)?`nan`:`number`;case`object`:{if(e===null)return`null`;if(Array.isArray(e))return`array`;let t=e;if(t&&Object.getPrototypeOf(t)!==Object.prototype&&`constructor`in t&&t.constructor)return t.constructor.name}}return t}function Na(...e){let[t,n,r]=e;return typeof t==`string`?{message:t,code:`custom`,input:n,inst:r}:{...t}}function Pa(e,t){for(let n in t){let r=Object.getOwnPropertyDescriptor(t,n);r.get?Object.defineProperty(e,n,{...r,enumerable:!1}):Ra(e,n,r.value)}}function Fa(e,t,n,r=!0){return Object.defineProperty(e,t,{configurable:!0,writable:!0,enumerable:r,value:n}),n}function Ia(e,t,n){return Fa(e,t,n,!1)}function La(e,t){for(let n in e){let r=e[n];Object.defineProperty(t,n,{configurable:!0,enumerable:!0,get(){return Fa(this,n,r(this))},set(e){Fa(this,n,e)}})}return t}function Ra(e,t,n){Object.defineProperty(e,t,{configurable:!0,get(){return this==null?n:Fa(this,t,n.bind(this))},set(e){Fa(this,t,e)}})}function za(e,t){let n=Object.getPrototypeOf(e);return t in n?void 0:n}var Ba,Va=!1,Ha={configurable:!0,get(){Va=!0}};function N(e,t,n){let r=Object.getPrototypeOf(e._zod);t in r&&Ba!==e._zod?Ba=void 0:(Ba=e._zod,Object.defineProperty(r,t,{configurable:!0,get(){Object.defineProperty(this,t,Ha);let e=Va;Va=!1;try{let r=n(this);return Va?delete this[t]:Object.defineProperty(this,t,{configurable:!0,writable:!0,value:r}),Va||=e,r}catch(n){throw delete this[t],Va||=e,n}},set(e){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:e})}}))}function Ua(e,t,n,r){let i=za(e,t);i&&Object.defineProperty(i,t,{configurable:!0,get(){let e={configurable:!0,writable:!0,enumerable:r,value:void 0};return Object.defineProperty(this,t,e),e.value=n(this),Object.defineProperty(this,t,e),e.value},set(e){Object.defineProperty(this,t,{configurable:!0,writable:!0,enumerable:r,value:e})}})}var Wa=`~constantCatch`;function Ga(e){let t=()=>e;return t[Wa]=!0,t}var Ka,qa={value:void 0,enumerable:!1},Ja=`captureStackTrace`in Error?Error:null;function Ya(e){let t=Ja;if(t){let n=t.stackTraceLimit;if(typeof n==`number`){try{t.stackTraceLimit=0}catch{return Ja=null,new e}try{return new e}finally{t.stackTraceLimit=n}}}return new e}function P(e,t,n,r){let i={};function a(e){this.def=e,this.constr=d,this.traits=new Set}a.prototype=i;let o=n,s=o&&new WeakSet;function c(n,r){if(!n._zod){qa.value=new a(r);try{Object.defineProperty(n,"_zod",qa)}finally{qa.value=void 0}}else if(n._zod.traits.has(e))return;if(n._zod.traits.add(e),t(n,r),s){let e=Object.getPrototypeOf(n),t=n._zod.constr.prototype,r=e;for(;r&&r!==t;)r=Object.getPrototypeOf(r);let i=r??e;s.has(i)||(s.add(i),Pa(i,o))}let i=d.prototype;for(let e in i)Object.prototype.hasOwnProperty.call(i,e)&&(e in n||(n[e]=i[e].bind(n)))}let l=r?.Parent??Object;class u extends l{}Object.defineProperty(u,"name",{value:e});function d(e){let t=r?.Parent?Ya(u):this;c(t,e);let n=t._zod.deferred;if(n){for(let e of n)e();t._zod.deferred=void 0}let i=globalThis.__zod_globalConfig?.postProcessor;return i&&i(t),t}return Object.defineProperty(d,"init",{value:c}),Object.defineProperty(d,Symbol.hasInstance,{value:t=>r?.Parent&&t instanceof r.Parent?!0:t?._zod?.traits?.has(e)}),Object.defineProperty(d,"name",{value:e}),d}var Xa=class extends Error{constructor(){super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`)}},Za=class extends Error{constructor(e){super(`Encountered unidirectional transform during encode: ${e}`),this.name=`ZodEncodeError`}};(Ka=globalThis).__zod_globalConfig??(Ka.__zod_globalConfig={});var F=globalThis.__zod_globalConfig;function I(e){return e&&Object.assign(F,e),F}function Qa(){let e=this._zod;return e.message??=JSON.stringify(e.def,Hi,2),e.message}function $a(e){this._zod.message=e}var eo={get:Qa,set:$a,enumerable:!0,configurable:!0},to={value:void 0,enumerable:!1},no=new WeakSet([Object.prototype,Error.prototype]),ro=P(`$ZodError`,(e,t)=>{e.name=`$ZodError`,to.value=t,Object.defineProperty(e,"issues",to),to.value=void 0,Object.defineProperty(e,"message",eo);let n=Object.getPrototypeOf(e);no.has(n)||(no.add(n),Object.defineProperty(n,"toString",{configurable:!0,enumerable:!1,get(){let e=()=>this.message;return Object.defineProperty(this,"toString",{value:e,configurable:!0,writable:!0}),e},set(e){Object.defineProperty(this,"toString",{value:e,configurable:!0,writable:!0})}}))});function io(e,t,n){return Object.prototype.hasOwnProperty.call(e,t)||(t===`__proto__`?Object.defineProperty(e,t,{value:n(),writable:!0,enumerable:!0,configurable:!0}):e[t]=n()),e[t]}function ao(e,t=e=>e.message){let n={},r=[];for(let i of e.issues)i.path.length>0?io(n,i.path[0],()=>[]).push(t(i)):r.push(t(i));return{formErrors:r,fieldErrors:n}}function oo(e,t=e=>e.message){let n={_errors:[]},r=(e,i=[])=>{for(let a of e.issues)if(a.code===`invalid_union`&&a.errors.length)a.errors.map(e=>r({issues:e},[...i,...a.path]));else if(a.code===`invalid_key`)r({issues:a.issues},[...i,...a.path]);else if(a.code===`invalid_element`)r({issues:a.issues},[...i,...a.path]);else{let e=[...i,...a.path];if(e.length===0)n._errors.push(t(a));else{let r=n,i=0;for(;i<e.length;){let n=e[i],o=i===e.length-1;if(n===`_errors`){o&&r._errors.push(t(a)),i++;continue}Object.prototype.hasOwnProperty.call(r,n)||Object.defineProperty(r,n,{value:{_errors:[]},enumerable:!0,writable:!0,configurable:!0});let s=r[n];o&&s._errors.push(t(a)),r=s,i++}}}};return r(e),n}function so(e,t){return{callee:t?.callee??e,Err:t?.Err}}var co=e=>{let t=(n,r,i,a)=>{let o=i?{...i,async:!1}:{async:!1},s=n._zod.run({value:r,issues:[]},o);if(s instanceof Promise)throw new Xa;if(s.issues.length){let n=new((a?.Err)??e)(s.issues.map(e=>Oa(e,o,I())));throw na(n,a?.callee??t),n}return s.value};return t},lo=e=>{let t=async(n,r,i,a)=>{let o=i?{...i,async:!0}:{async:!0},s=n._zod.run({value:r,issues:[]},o);if(s instanceof Promise&&(s=await s),s.issues.length){let n=new((a?.Err)??e)(s.issues.map(e=>Oa(e,o,I())));throw na(n,a?.callee??t),n}return s.value};return t},uo=e=>(t,n,r)=>{let i=r?{...r,async:!1}:{async:!1},a=t._zod.run({value:n,issues:[]},i);if(a instanceof Promise)throw new Xa;return a.issues.length?fo(e,a.issues,i):{success:!0,data:a.value}};function fo(e,t,n){let r;return{success:!1,get error(){return r||(r=new e(t.map(e=>Oa(e,n,I()))),t=void 0,n=void 0),r},set error(e){r=e,t=void 0,n=void 0}}}var po=e=>async(t,n,r)=>{let i=r?{...r,async:!0}:{async:!0},a=t._zod.run({value:n,issues:[]},i);return a instanceof Promise&&(a=await a),a.issues.length?fo(e,a.issues,i):{success:!0,data:a.value}},mo=Symbol.for(`zod.compile.invalid`),ho=Symbol.for(`zod.compile.fallback`),go=((e,t,n)=>{let r=e._zod.bag.validator;if(r!==void 0){if(r(t)!==mo)return!0;if(r.definite===!0&&n===void 0)return!1}return _o(e,t,n)});function _o(e,t,n){let r=n?{...n,async:!1,abortEarly:!0}:{async:!1,abortEarly:!0},i=e._zod.bag.fallbackRun,a;if(i?(r[ho]=!0,a=i({value:t,issues:[]},r)):a=e._zod.run({value:t,issues:[]},r),a instanceof Promise)throw new Xa;return a.issues.length===0}var vo=async(e,t,n)=>{let r=n?{...n,async:!0,abortEarly:!0}:{async:!0,abortEarly:!0},i=e._zod.run({value:t,issues:[]},r);return i instanceof Promise&&(i=await i),i.issues.length===0},yo=e=>{let t=co(e),n=(e,r,i,a)=>{let o=i?{...i,direction:`backward`}:{direction:`backward`};return t(e,r,o,so(n,a))};return n},bo=e=>{let t=co(e),n=(e,r,i,a)=>t(e,r,i,so(n,a));return n},xo=e=>{let t=lo(e),n=async(e,r,i,a)=>{let o=i?{...i,direction:`backward`}:{direction:`backward`};return await t(e,r,o,so(n,a))};return n},So=e=>{let t=lo(e),n=async(e,r,i,a)=>await t(e,r,i,so(n,a));return n},Co=e=>(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return uo(e)(t,n,i)},wo=e=>(t,n,r)=>uo(e)(t,n,r),To=e=>async(t,n,r)=>{let i=r?{...r,direction:`backward`}:{direction:`backward`};return po(e)(t,n,i)},Eo=e=>async(t,n,r)=>po(e)(t,n,r),Do=/^[cC][0-9a-z]{6,}$/,Oo=/^[0-9a-z]+$/,ko=/^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/,Ao=/^[0-9a-vA-V]{20}$/,jo=/^[A-Za-z0-9]{27}$/,Mo=/^[a-zA-Z0-9_-]{21}$/;function No(e){return RegExp(`^[a-zA-Z0-9_-]{${e}}$`)}var Po=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,Fo=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,Io=e=>e?RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,Lo=/^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,Ro=`^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;function zo(){return new RegExp(Ro,`u`)}var Bo=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Vo=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,Ho=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,Uo=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Wo=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,Go=/^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/,Ko=/^https?$/,qo=/^\+[1-9]\d{6,14}$/,Jo=`(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;function Yo(e){return RegExp(`^${e}$`)}var Xo=Yo(Jo);function Zo(e){let t=`(?:[01]\\d|2[0-3]):[0-5]\\d`;return typeof e.precision==`number`?e.precision===-1?`${t}`:e.precision===0?`${t}:[0-5]\\d`:`${t}:[0-5]\\d\\.\\d{${e.precision}}`:e.seconds?`${t}:[0-5]\\d(?:\\.\\d+)?`:`${t}(?::[0-5]\\d(?:\\.\\d+)?)?`}function Qo(e){return RegExp(`^${Zo(e)}$`)}function $o(e){let t=[`Z`];e.offset&&t.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);let n=`${Zo({precision:e.precision,seconds:!0})}(?:${t.join(`|`)})`,r=e.local?`${n}|${Zo({precision:e.precision})}`:n;return RegExp(`^${Jo}T(?:${r})$`)}var es=/^[\s\S]{0,}$/,ts=/^-?\d+(?:\.\d+)?$/,ns=/^[^A-Z]*$/,rs=/^[^a-z]*$/,L=P(`$ZodCheck`,(e,t)=>{var n;e._zod??={},e._zod.def=t,(n=e._zod).onattach??(n.onattach=[])}),is=e=>{let t=e.value;return!Gi(t)&&t.length!==void 0},as={number:`number`,bigint:`bigint`,object:`date`},os=P(`$ZodCheckLessThan`,(e,t)=>{L.init(e,t);let n=as[typeof t.value];e._zod.check=r=>{(t.inclusive?r.value<=t.value:r.value<t.value)||r.issues.push({origin:as[typeof r.value]??n,code:`too_big`,maximum:typeof t.value==`object`?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),ss=P(`$ZodCheckGreaterThan`,(e,t)=>{L.init(e,t);let n=as[typeof t.value];e._zod.check=r=>{(t.inclusive?r.value>=t.value:r.value>t.value)||r.issues.push({origin:as[typeof r.value]??n,code:`too_small`,minimum:typeof t.value==`object`?t.value.getTime():t.value,input:r.value,inclusive:t.inclusive,inst:e,continue:!t.abort})}}),cs=P(`$ZodCheckMultipleOf`,(e,t)=>{L.init(e,t),e._zod.check=n=>{if(typeof n.value!=typeof t.value)throw Error(`Cannot mix number and bigint in multiple_of check.`);(typeof n.value==`bigint`?t.value!==BigInt(0)&&n.value%t.value===BigInt(0):qi(n.value,t.value)===0)||n.issues.push({origin:typeof n.value,code:`not_multiple_of`,divisor:t.value,input:n.value,inst:e,continue:!t.abort})}}),ls=P(`$ZodCheckNumberFormat`,(e,t)=>{L.init(e,t),t.format=t.format||`float64`;let n=t.format?.includes(`int`),r=n?`int`:`number`,[i,a]=fa[t.format];e._zod.check=o=>{let s=o.value;if(n){if(!Number.isInteger(s)){o.issues.push({expected:r,format:t.format,code:`invalid_type`,continue:!1,input:s,inst:e});return}if(!Number.isSafeInteger(s)){s>0?o.issues.push({input:s,code:`too_big`,maximum:2**53-1,note:`Integers must be within the safe integer range.`,inst:e,origin:r,inclusive:!0,continue:!t.abort}):o.issues.push({input:s,code:`too_small`,minimum:-(2**53-1),note:`Integers must be within the safe integer range.`,inst:e,origin:r,inclusive:!0,continue:!t.abort});return}}s<i&&o.issues.push({origin:`number`,input:s,code:`too_small`,minimum:i,inclusive:!0,inst:e,continue:!t.abort}),s>a&&o.issues.push({origin:`number`,input:s,code:`too_big`,maximum:a,inclusive:!0,inst:e,continue:!t.abort})}}),us=P(`$ZodCheckMaxLength`,(e,t)=>{var n;L.init(e,t),(n=e._zod.def).when??(n.when=is),e._zod.check=n=>{let r=n.value,i=r.length;if((typeof r==`string`&&i>t.maximum?Aa(r):i)<=t.maximum)return;let a=ja(r);n.issues.push({origin:a,code:`too_big`,maximum:t.maximum,inclusive:!0,input:r,inst:e,continue:!t.abort})}}),ds=P(`$ZodCheckMinLength`,(e,t)=>{var n;L.init(e,t),(n=e._zod.def).when??(n.when=is),e._zod.check=n=>{let r=n.value,i=r.length;if((typeof r==`string`&&i>=t.minimum&&i<t.minimum*2?Aa(r):i)>=t.minimum)return;let a=ja(r);n.issues.push({origin:a,code:`too_small`,minimum:t.minimum,inclusive:!0,input:r,inst:e,continue:!t.abort})}}),fs=P(`$ZodCheckLengthEquals`,(e,t)=>{var n;L.init(e,t),(n=e._zod.def).when??(n.when=is),e._zod.check=n=>{let r=n.value,i=r.length,a=typeof r==`string`&&i>=t.length&&i<=t.length*2?Aa(r):i;if(a===t.length)return;let o=ja(r),s=a>t.length;n.issues.push({origin:o,...s?{code:`too_big`,maximum:t.length}:{code:`too_small`,minimum:t.length},inclusive:!0,exact:!0,input:n.value,inst:e,continue:!t.abort})}}),ps=P(`$ZodCheckStringFormat`,(e,t)=>{var n,r;L.init(e,t),t.pattern?(n=e._zod).check??(n.check=n=>{t.pattern.lastIndex=0,!t.pattern.test(n.value)&&n.issues.push({origin:`string`,code:`invalid_format`,format:t.format,input:n.value,...t.pattern?{pattern:t.pattern.toString()}:{},inst:e,continue:!t.abort})}):(r=e._zod).check??(r.check=()=>{})}),ms=P(`$ZodCheckRegex`,(e,t)=>{ps.init(e,t),e._zod.check=n=>{t.pattern.lastIndex=0,!t.pattern.test(n.value)&&n.issues.push({origin:`string`,code:`invalid_format`,format:`regex`,input:n.value,pattern:t.pattern.toString(),inst:e,continue:!t.abort})}}),hs=P(`$ZodCheckLowerCase`,(e,t)=>{t.pattern??=ns,ps.init(e,t)}),gs=P(`$ZodCheckUpperCase`,(e,t)=>{t.pattern??=rs,ps.init(e,t)}),_s=P(`$ZodCheckIncludes`,(e,t)=>{L.init(e,t);let n=ca(t.includes);t.pattern=new RegExp(typeof t.position==`number`?`^.{${t.position},}${n}`:n),e._zod.check=n=>{n.value.includes(t.includes,t.position)||n.issues.push({origin:`string`,code:`invalid_format`,format:`includes`,includes:t.includes,input:n.value,inst:e,continue:!t.abort})}}),vs=P(`$ZodCheckStartsWith`,(e,t)=>{L.init(e,t);let n=RegExp(`^${ca(t.prefix)}.*`);t.pattern??=n,e._zod.check=n=>{n.value.startsWith(t.prefix)||n.issues.push({origin:`string`,code:`invalid_format`,format:`starts_with`,prefix:t.prefix,input:n.value,inst:e,continue:!t.abort})}}),ys=P(`$ZodCheckEndsWith`,(e,t)=>{L.init(e,t);let n=RegExp(`.*${ca(t.suffix)}$`);t.pattern??=n,e._zod.check=n=>{n.value.endsWith(t.suffix)||n.issues.push({origin:`string`,code:`invalid_format`,format:`ends_with`,suffix:t.suffix,input:n.value,inst:e,continue:!t.abort})}}),bs=P(`$ZodCheckOverwrite`,(e,t)=>{L.init(e,t),e._zod.check=e=>{e.value=t.tx(e.value)}}),xs=class{constructor(e=[],t={}){this.content=[],this.indent=0,this.args=e,this.closed=t}indented(e){this.indent+=1;try{e(this)}finally{--this.indent}}write(e){if(typeof e==`function`){e(this,{execution:`sync`}),e(this,{execution:`async`});return}let t=e.split(`
`).filter(e=>e),n=Math.min(...t.map(e=>e.length-e.trimStart().length)),r=t.map(e=>e.slice(n)).map(e=>` `.repeat(this.indent*2)+e);for(let e of r)this.content.push(e)}compile(){let e=Function,t=this?.content??[``];return new e(...Object.keys(this.closed),`return function (${this.args.join(`, `)}) {\n${t.join(`
`)}\n};`)(...Object.values(this.closed))}},Ss={major:4,minor:6,patch:7},R=P(`$ZodType`,(e,t)=>{var n;e??={},e._zod.def=t,e._zod.bag=e._zod.bag||{},e._zod.version=Ss;let r=e._zod.def.checks,i=e._zod.traits.has(`$ZodCheck`)?[e,...r??[]]:r?.length?[...r]:[];for(let t of i)for(let n of t._zod.onattach)n(e);if(i.length===0)(n=e._zod).deferred??(n.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse});else{let t=(t,n,r)=>{if(t.memo)return t;let i=M(t),a;for(let o of n){if(o._zod.def.when){if(Ca(t)||!o._zod.def.when(t))continue}else if(i)continue;let n=t.issues.length,s=o._zod.check(t);if(s instanceof Promise&&r?.async===!1)throw new Xa;if(a||s instanceof Promise)a=(a??Promise.resolve()).then(async()=>{await s,t.issues.length!==n&&(Da(t.issues,n,e),i||=M(t,n))});else{if(t.issues.length===n)continue;Da(t.issues,n,e),i||=M(t,n)}}return a?a.then(()=>t):t},n=(n,r,a)=>{if(M(n))return n.aborted=!0,n;let o=t(r,i,a);if(o instanceof Promise){if(a.async===!1)throw new Xa;return o.then(t=>e._zod.parse(t,a))}return e._zod.parse(o,a)};e._zod.run=(r,a)=>{if(a.skipChecks)return e._zod.parse(r,a);if(a.direction===`backward`){let t=e._zod.parse({value:r.value,issues:[]},{...a,skipChecks:!0});return t instanceof Promise?t.then(e=>n(e,r,a)):n(t,r,a)}let o=e._zod.parse(r,a);if(o instanceof Promise){if(a.async===!1)throw new Xa;return o.then(e=>t(e,i,a))}return t(o,i,a)}}},{get"~standard"(){return Ia(this,`~standard`,Ts(this))},set"~standard"(e){Fa(this,`~standard`,e)}}),Cs=(e,t)=>e.issues.length?{issues:e.issues.map(e=>Oa(e,t,I()))}:{value:e.value};async function ws(e,t){let n={async:!0};return Cs(await e._zod.run({value:t,issues:[]},n),n)}function Ts(e){return{validate:t=>{let n={async:!1};try{let r=e._zod.run({value:t,issues:[]},n);if(!(r instanceof Promise))return Cs(r,n)}catch{}return ws(e,t)},vendor:`zod`,version:1}}var Es=P(`$ZodString`,(e,t)=>{R.init(e,t),e._zod.pattern=t.pattern??es,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=String(n.value)}catch{}return typeof n.value==`string`||n.issues.push({expected:`string`,code:`invalid_type`,input:n.value,inst:e}),n}}),z=P(`$ZodStringFormat`,(e,t)=>{ps.init(e,t),Es.init(e,t)}),Ds=P(`$ZodGUID`,(e,t)=>{t.pattern??=Fo,z.init(e,t)}),Os=P(`$ZodUUID`,(e,t)=>{if(t.version){let e={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[t.version];if(e===void 0)throw Error(`Invalid UUID version: "${t.version}"`);t.pattern??=Io(e)}else t.pattern??=Io();z.init(e,t)}),ks=P(`$ZodEmail`,(e,t)=>{t.pattern??=Lo,z.init(e,t)});function As(e){try{return typeof URL<`u`&&typeof URL.canParse==`function`?URL.canParse(e):(new URL(e),!0)}catch{return!1}}function js(e,t){return!(`normalize`in t)&&!(`hostname`in t)&&!(`protocol`in t)?As(e)||2:Ms(e,t)}function Ms(e,t){if(!t.normalize&&t.protocol?.source===Ko.source&&!/^https?:\/\//i.test(e))return 1;try{if(typeof URL<`u`){let t=URL;if(typeof t.parse==`function`)return t.parse(e)??2}return new URL(e)}catch{return 2}}var Ns=/[\t\n\r]/g;function Ps(e){return e.replace(Ns,``)}function Fs(e,t){return t.lastIndex=0,t.test(e.hostname)}function Is(e,t){return t.lastIndex=0,t.test(e.protocol.endsWith(`:`)?e.protocol.slice(0,-1):e.protocol)}var Ls=P(`$ZodURL`,(e,t)=>{z.init(e,t),e._zod.check=n=>{try{let r=n.value.trim(),i=js(r,t);if(i===1){n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid URL format`,input:n.value,inst:e,continue:!t.abort});return}if(i===2){n.issues.push({code:`invalid_format`,format:`url`,input:n.value,inst:e,continue:!t.abort});return}if(i===!0){n.value=Ps(r);return}t.hostname&&!Fs(i,t.hostname)&&n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid hostname`,pattern:t.hostname.source,input:n.value,inst:e,continue:!t.abort}),t.protocol&&!Is(i,t.protocol)&&n.issues.push({code:`invalid_format`,format:`url`,note:`Invalid protocol`,pattern:t.protocol.source,input:n.value,inst:e,continue:!t.abort}),n.value=t.normalize?i.href:Ps(r);return}catch{n.issues.push({code:`invalid_format`,format:`url`,input:n.value,inst:e,continue:!t.abort})}}}),Rs=P(`$ZodEmoji`,(e,t)=>{t.pattern??=zo(),z.init(e,t)}),zs=P(`$ZodNanoID`,(e,t)=>{if(t.length!==void 0&&(!Number.isInteger(t.length)||t.length<1))throw Error(`Invalid nanoid length: ${t.length}`);t.pattern??=t.length===void 0?Mo:No(t.length),z.init(e,t)}),Bs=P(`$ZodCUID`,(e,t)=>{t.pattern??=Do,z.init(e,t)}),Vs=P(`$ZodCUID2`,(e,t)=>{t.pattern??=Oo,z.init(e,t)}),Hs=P(`$ZodULID`,(e,t)=>{t.pattern??=ko,z.init(e,t)}),Us=P(`$ZodXID`,(e,t)=>{t.pattern??=Ao,z.init(e,t)}),Ws=P(`$ZodKSUID`,(e,t)=>{t.pattern??=jo,z.init(e,t)}),Gs=P(`$ZodISODateTime`,(e,t)=>{t.pattern??=$o(t),z.init(e,t)}),Ks=P(`$ZodISODate`,(e,t)=>{t.pattern??=Xo,z.init(e,t)}),qs=P(`$ZodISOTime`,(e,t)=>{t.pattern??=Qo(t),z.init(e,t)}),Js=P(`$ZodISODuration`,(e,t)=>{t.pattern??=Po,z.init(e,t)}),Ys=P(`$ZodIPv4`,(e,t)=>{t.pattern??=Bo,z.init(e,t)}),Xs=/^[0-9a-fA-F:.]+$/;function Zs(e){return Xs.test(e)?As(`http://[${e}]`):!1}var Qs=P(`$ZodIPv6`,(e,t)=>{t.pattern??=Vo,z.init(e,t),e._zod.check=n=>{Zs(n.value)||n.issues.push({code:`invalid_format`,format:`ipv6`,input:n.value,inst:e,continue:!t.abort})}}),$s=P(`$ZodCIDRv4`,(e,t)=>{t.pattern??=Ho,z.init(e,t)});function ec(e){let t=e.split(`/`);if(t.length!==2)return!1;let[n,r]=t;if(!r)return!1;let i=Number(r);return`${i}`!==r||i<0||i>128?!1:Zs(n)}var tc=P(`$ZodCIDRv6`,(e,t)=>{t.pattern??=Uo,z.init(e,t),e._zod.check=n=>{ec(n.value)||n.issues.push({code:`invalid_format`,format:`cidrv6`,input:n.value,inst:e,continue:!t.abort})}});function nc(e){if(e===``)return!0;if(/\s/.test(e)||e.length%4!=0)return!1;try{return atob(e),!0}catch{return!1}}var rc=/^[0-9a-zA-Z+/]*={0,2}$/,ic=P(`$ZodBase64`,(e,t)=>{t.pattern??=rc,z.init(e,t),e._zod.check=n=>{nc(n.value)||n.issues.push({code:`invalid_format`,format:`base64`,input:n.value,inst:e,continue:!t.abort})}}),ac=/^[A-Za-z0-9_-]*$/;function oc(e){if(!ac.test(e))return!1;let t=e.replace(/[-_]/g,e=>e===`-`?`+`:`/`);return nc(t.padEnd(Math.ceil(t.length/4)*4,`=`))}var sc=P(`$ZodBase64URL`,(e,t)=>{t.pattern??=ac,z.init(e,t),e._zod.check=n=>{oc(n.value)||n.issues.push({code:`invalid_format`,format:`base64url`,input:n.value,inst:e,continue:!t.abort})}}),cc=P(`$ZodE164`,(e,t)=>{t.pattern??=qo,z.init(e,t)});function lc(e,t=null){try{let n=e.split(`.`);if(n.length!==3)return!1;let[r]=n;if(!r)return!1;let i=JSON.parse(atob(r));return!(`typ`in i&&i?.typ!==`JWT`||!i.alg||t&&(!(`alg`in i)||i.alg!==t))}catch{return!1}}var uc=P(`$ZodJWT`,(e,t)=>{z.init(e,t),e._zod.check=n=>{lc(n.value,t.alg)||n.issues.push({code:`invalid_format`,format:`jwt`,input:n.value,inst:e,continue:!t.abort})}}),dc=P(`$ZodNumber`,(e,t)=>{R.init(e,t),e._zod.pattern=ts,e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=Number(n.value)}catch{}let i=n.value;if(typeof i==`number`&&!Number.isNaN(i)&&Number.isFinite(i))return n;let a=typeof i==`number`?Number.isNaN(i)?`NaN`:Number.isFinite(i)?void 0:String(i):void 0;return n.issues.push({expected:`number`,code:`invalid_type`,input:i,inst:e,...a?{received:a}:{}}),n}}),fc=P(`$ZodNumberFormat`,(e,t)=>{ls.init(e,t),dc.init(e,t)}),pc=P(`$ZodUnknown`,(e,t)=>{R.init(e,t),e._zod.parse=e=>e}),mc=P(`$ZodNever`,(e,t)=>{R.init(e,t),e._zod.parse=(t,n)=>(t.issues.push({expected:`never`,code:`invalid_type`,input:t.value,inst:e}),t)});function hc(e,t){let n=Ea(e._zod.def.checks);if(!n.length)return;let r=Math.min(...n.map(e=>e[0])),i=e._zod.parse;e._zod.parse=(n,a)=>{let o=t(n.value);if(o>r&&!a?.skipChecks&&a?.direction!==`backward`){for(let[t,r]of Ea(e._zod.def.checks))if(o>t&&r._zod.def.when(n)){let t=n.issues.length;return r._zod.check(n),n.issues[t].continue=!1,Da(n.issues,t,e),n}}return i(n,a)}}var gc=e=>Array.isArray(e)?e.length:-1;function _c(e,t,n){e.issues.length&&t.issues.push(...wa(n,e.issues)),t.value[n]=e.value}var vc=P(`$ZodArray`,(e,t)=>{R.init(e,t);let n=F.memoizer;n?.attach(e),e._zod.parse=(r,i)=>{let a=r.value;if(!Array.isArray(a))return r.issues.push({expected:`array`,code:`invalid_type`,input:a,inst:e}),r;r.value=n?n.alloc(e,r,Array(a.length),i):Array(a.length);let o=[],s=i?.abortEarly;for(let e=0;e<a.length;e++){let n=a[e],c=t.element._zod.run({value:n,issues:[]},i);if(c instanceof Promise)o.push(c.then(t=>_c(t,r,e)));else if(_c(c,r,e),s&&c.issues.length!==0&&M(c))break}return o.length?Promise.all(o).then(()=>r):r},hc(e,gc)});function yc(e,t,n,r,i,a){let o=n in r,s=a===`optional`;if(o||!s||i!==`optional`){if(e.issues.length){if(i!==void 0&&s&&!o)return;t.issues.push(...wa(n,e.issues))}!o&&i===void 0?e.issues.length||t.issues.push({code:`invalid_type`,expected:`nonoptional`,input:void 0,path:[n]}):e.value===void 0?(o||i===`defaulted`&&!s)&&(t.value[n]=void 0):t.value[n]=e.value}}var bc=[];function xc(e){let t=Object.keys(e.shape),n=Object.getOwnPropertySymbols(e.shape),r=n.length?n:bc,i=r.length?[...t,...r]:t;for(let t of i)if(!e.shape?.[t]?._zod?.traits?.has(`$ZodType`))throw Error(`Invalid element at key "${String(t)}": expected a Zod schema`);let a=da(e.shape);return{...e,allKeys:i,symbolKeys:r,keySet:new Set(t),numKeys:t.length,optionalKeys:new Set(a)}}function Sc(e,t,n,r,i,a,o){let s=[],c=i.keySet,l=i.catchall._zod,u=l.def.type,d=l.optin,f=l.optout,p=0;for(let i in t){if(o&&n.issues.length!==p){if(M(n,p))break;p=n.issues.length}if(c.has(i))continue;if(i===`__proto__`){u===`never`&&s.push(i);continue}if(u===`never`){s.push(i);continue}let a=l.run({value:t[i],issues:[]},r);a instanceof Promise?e.push(a.then(e=>yc(e,n,i,t,d,f))):yc(a,n,i,t,d,f)}return s.length&&n.issues.push({code:`unrecognized_keys`,keys:s,input:t,inst:a,continue:!0}),e.length?Promise.all(e).then(()=>n):n}var Cc=P(`$ZodObject`,(e,t)=>{R.init(e,t);let n=Object.getOwnPropertyDescriptor(t,`shape`),r=n?.get?n.get.raw:t.shape??{};if(r){let e=()=>{let n={...r};return Object.defineProperty(t,"shape",{value:n}),e.raw=n,n};e.raw=r,Object.defineProperty(t,"shape",{get:e})}let i=Wi(()=>xc(t));N(e,`propValues`,e=>{let t=e.def.shape,n={};for(let e in t){let r=t[e]._zod;if(r.values){Object.prototype.hasOwnProperty.call(n,e)||Ji(n,e,new Set);for(let t of r.values)n[e].add(t);r.optin!==void 0&&n[e].add(void 0)}}return n});let a=ra,o=t.catchall,s,c=F.memoizer;c?.attach(e),e._zod.parse=(t,n)=>{s??=i.value;let r=t.value;if(!a(r))return t.issues.push({expected:`object`,code:`invalid_type`,input:r,inst:e}),t;t.value=c?c.alloc(e,t,{},n):{};let l=[],u=s.shape,d=n?.abortEarly,f=t.issues.length;for(let e of s.allKeys){if(d&&t.issues.length!==f){if(M(t,f))break;f=t.issues.length}if(e===`__proto__`)continue;let i=u[e],a=i._zod.optin,o=i._zod.optout,s=i._zod.run({value:r[e],issues:[]},n);s instanceof Promise?l.push(s.then(n=>yc(n,t,e,r,a,o))):yc(s,t,e,r,a,o)}return o?Sc(l,r,t,n,i.value,e,d===!0):l.length?Promise.all(l).then(()=>t):t}}),wc=P(`$ZodObjectJIT`,(e,t)=>{Cc.init(e,t);let n=e._zod.parse,r=Wi(()=>xc(t)),i=F.memoizer,a=t=>{let n=r.value,a=n.symbolKeys,o=new xs([`payload`,`ctx`],{shape:t,inst:e,memo:i,syms:a}),s=e=>`shape[${e}]._zod.run({ value: input[${e}], issues: [] }, ctx)`,c=(e,t)=>`
          let ${e}_ab = false;
          for (let i = 0; i < ${e}.issues.length; i++) {
            const iss = ${e}.issues[i];
            iss.path = iss.path ? [${t}, ...iss.path] : [${t}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${e}_ab = true;
          }
          if (${e}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;o.write(`const input = payload.value;`);let l=Object.create(null),u=0;for(let e of n.allKeys)l[e]=`key_${u++}`;o.write(i?`const newResult = memo.alloc(inst, payload, {}, ctx);`:`const newResult = {};`);for(let e of n.allKeys){if(e===`__proto__`)continue;let n=l[e],r=typeof e==`symbol`?`syms[${a.indexOf(e)}]`:ea(e),i=`${r} in input`,u=t[e],d=u?._zod?.optin,f=d!==void 0,p=u?._zod?.optout===`optional`;if(o.write(`const ${n} = ${s(r)};`),f&&p){let e=d===`optional`?`${n}_present`:`${n}.value !== undefined || ${n}_present`;o.write(`
        const ${n}_present = ${i};
        if (!${n}.issues.length || ${n}_present) {
          if (${n}.issues.length) {${c(n,r)}
          }

          if (${e}) {
            newResult[${r}] = ${n}.value;
          }
        }

      `)}else f?(o.write(`
        if (${n}.issues.length) {${c(n,r)}
        }
      `),d===`defaulted`?o.write(`newResult[${r}] = ${n}.value;`):o.write(`
        if (${n}.value !== undefined || ${i}) {
          newResult[${r}] = ${n}.value;
        }
      `)):o.write(`
        const ${n}_present = ${i};
        if (${n}.issues.length) {${c(n,r)}
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${r}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${n}_present) {
          newResult[${r}] = ${n}.value;
        }

      `)}return o.write(`payload.value = newResult;`),o.write(`return payload;`),o.compile()},o,s=ra,c=!F.jitless,l=c&&ia.value,u=t.catchall,d;e._zod.parse=(i,f)=>{d??=r.value;let p=i.value;return s(p)?c&&l&&f?.async===!1&&f.jitless!==!0?(o||=a(t.shape),i=o(i,f),u?Sc([],p,i,f,d,e,f?.abortEarly===!0):i):n(i,f):(i.issues.push({expected:`object`,code:`invalid_type`,input:p,inst:e}),i)}});function Tc(e,t,n,r){for(let n of e)if(n.issues.length===0)return t.value=n.value,t;let i=e.filter(e=>!M(e));return i.length===1?(t.value=i[0].value,i[0]):(t.issues.push({code:`invalid_union`,input:t.value,inst:n,errors:e.map(e=>e.issues.map(e=>Oa(e,r,I())))}),t)}var Ec=P(`$ZodUnion`,(e,t)=>{R.init(e,t),N(e,`optin`,e=>e.def.options.some(e=>e._zod.optin===`defaulted`)?`defaulted`:e.def.options.some(e=>e._zod.optin!==void 0)?`optional`:void 0),N(e,`optout`,e=>e.def.options.some(e=>e._zod.optout===`optional`)?`optional`:void 0),N(e,`values`,e=>{if(e.def.options.every(e=>e._zod.values))return new Set(e.def.options.flatMap(e=>Array.from(e._zod.values)))}),N(e,`pattern`,e=>{if(e.def.options.every(e=>e._zod.pattern)){let t=e.def.options.map(e=>e._zod.pattern);return RegExp(`^(${t.map(e=>Ki(e.source)).join(`|`)})$`)}});let n=t.options.length===1?t.options[0]._zod.run:null;e._zod.parse=(r,i)=>{if(n)return n(r,i);let a=!1,o=[];for(let e of t.options){let t=e._zod.run({value:r.value,issues:[]},i);if(t instanceof Promise)o.push(t),a=!0;else{if(t.issues.length===0)return t;o.push(t)}}return a?Promise.all(o).then(t=>Tc(t,r,e,i)):Tc(o,r,e,i)}}),Dc=P(`$ZodIntersection`,(e,t)=>{R.init(e,t),e._zod.parse=(e,n)=>{let r=e.value,i=t.left._zod.run({value:r,issues:[]},n),a=t.right._zod.run({value:r,issues:[]},n);return i instanceof Promise||a instanceof Promise?Promise.all([i,a]).then(([t,n])=>kc(e,t,n)):kc(e,i,a)}});function Oc(e,t){if(e===t||e instanceof Date&&t instanceof Date&&+e==+t)return{valid:!0,data:e};if(aa(e)&&aa(t)){let n=Object.keys(t),r=Object.keys(e).filter(e=>n.indexOf(e)!==-1),i={...e,...t};Object.prototype.hasOwnProperty.call(i,`__proto__`)&&delete i.__proto__;for(let n of r){if(n===`__proto__`)continue;let r=Oc(e[n],t[n]);if(!r.valid)return{valid:!1,mergeErrorPath:[n,...r.mergeErrorPath]};i[n]=r.data}return{valid:!0,data:i}}if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return{valid:!1,mergeErrorPath:[]};let n=[];for(let r=0;r<e.length;r++){let i=e[r],a=t[r],o=Oc(i,a);if(!o.valid)return{valid:!1,mergeErrorPath:[r,...o.mergeErrorPath]};n.push(o.data)}return{valid:!0,data:n}}return{valid:!1,mergeErrorPath:[]}}function kc(e,t,n){let r=new Map,i,a=new Map,o=(e,t)=>{let n;if(e.code===`unrecognized_keys`&&!e.path?.length)i??=e,n=e.keys;else if(e.code===`invalid_key`&&e.origin===`record`&&e.path?.length===1){let t=String(e.path[0]);a.has(t)||a.set(t,e),n=[t]}else return!1;for(let e of n)r.has(e)||r.set(e,{}),r.get(e)[t]=!0;return!0};for(let n of t.issues)o(n,`l`)||e.issues.push(n);for(let t of n.issues)o(t,`r`)||e.issues.push(t);let s=[...r].filter(([,e])=>e.l&&e.r).map(([e])=>e);if(s.length){let t=i?s.filter(e=>i.keys.includes(e)):[];t.length&&e.issues.push({...i,keys:t});for(let n of s)!t.includes(n)&&a.has(n)&&e.issues.push(a.get(n))}let c=Oc(t.value,n.value);if(!c.valid){if(M(e))return e;throw Error(`Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`)}return e.value=c.data,e}var Ac=P(`$ZodEnum`,(e,t)=>{R.init(e,t);let n=Bi(t.entries),r=new Set(n);e._zod.values=r,N(e,`pattern`,e=>{let t=Bi(e.def.entries).filter(e=>sa.has(typeof e));return RegExp(t.length?`^(${t.map(e=>ca(e.toString())).join(`|`)})$`:`^[^\\s\\S]$`)}),e._zod.parse=(t,i)=>{let a=t.value;return r.has(a)||t.issues.push({code:`invalid_value`,values:n,input:a,inst:e}),t}}),jc=P(`$ZodTransform`,(e,t)=>{R.init(e,t),e._zod.optin=`optional`,F.memoizer?.guard(e),e._zod.parse=(n,r)=>{if(r.direction===`backward`)throw new Za(e.constructor.name);let i=t.transform(n.value,n);if(r.async)return(i instanceof Promise?i:Promise.resolve(i)).then(e=>(n.value=e,n));if(i instanceof Promise)throw new Xa;return n.value=i,n}});function Mc(e,t){return e.value=t.issues.length?void 0:t.value,e}var Nc=P(`$ZodOptional`,(e,t)=>{R.init(e,t),N(e,`optin`,e=>e.def.innerType._zod.optin===`defaulted`?`defaulted`:`optional`),e._zod.optout=`optional`,N(e,`values`,e=>{let t=e.def.innerType._zod.values;return t?new Set([...t,void 0]):void 0}),N(e,`pattern`,e=>{let t=e.def.innerType._zod.pattern;return t?RegExp(`^(${Ki(t.source)})?$`):void 0}),e._zod.parse=(e,n)=>{if(e.value===void 0){if(t.innerType._zod.optin!==`defaulted`)return e;let r=t.innerType._zod.run({value:e.value,issues:[]},n);return r instanceof Promise?r.then(t=>Mc(e,t)):Mc(e,r)}return t.innerType._zod.run(e,n)}}),Pc=P(`$ZodExactOptional`,(e,t)=>{Nc.init(e,t),N(e,`values`,e=>e.def.innerType._zod.values),N(e,`pattern`,e=>e.def.innerType._zod.pattern),e._zod.parse=(e,n)=>t.innerType._zod.run(e,n)}),Fc=P(`$ZodNullable`,(e,t)=>{R.init(e,t),N(e,`optin`,e=>e.def.innerType._zod.optin),N(e,`optout`,e=>e.def.innerType._zod.optout),N(e,`pattern`,e=>{let t=e.def.innerType._zod.pattern;return t?RegExp(`^(${Ki(t.source)}|null)$`):void 0}),N(e,`values`,e=>e.def.innerType._zod.values?new Set([...e.def.innerType._zod.values,null]):void 0),e._zod.parse=(e,n)=>e.value===null?e:t.innerType._zod.run(e,n)}),Ic=P(`$ZodDefault`,(e,t)=>{R.init(e,t),e._zod.optin=`defaulted`,N(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);if(e.value===void 0)return e.value=t.defaultValue,e;let r=t.innerType._zod.run(e,n);return r instanceof Promise?r.then(e=>Lc(e,t)):Lc(r,t)}});function Lc(e,t){return e.value===void 0&&(e.value=t.defaultValue),e}var Rc=P(`$ZodPrefault`,(e,t)=>{R.init(e,t),e._zod.optin=`defaulted`,N(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>(n.direction===`backward`||e.value===void 0&&(e.value=t.defaultValue),t.innerType._zod.run(e,n))}),zc=P(`$ZodNonOptional`,(e,t)=>{R.init(e,t),N(e,`values`,e=>{let t=e.def.innerType._zod.values;return t?new Set([...t].filter(e=>e!==void 0)):void 0}),e._zod.parse=(n,r)=>{let i=t.innerType._zod.run(n,r);return i instanceof Promise?i.then(t=>Bc(t,e)):Bc(i,e)}});function Bc(e,t){return!e.issues.length&&e.value===void 0&&e.issues.push({code:`invalid_type`,expected:`nonoptional`,input:e.value,inst:t}),e}function Vc(e,t,n,r){return t.issues.length?(e.value=n.catchValue({...t,value:e.value,error:{issues:t.issues.map(e=>Oa(e,r,I()))},input:e.value}),e):(e.value=t.value,t.memo&&(e.memo=!0),e)}var Hc=P(`$ZodCatch`,(e,t)=>{R.init(e,t),N(e,`optin`,e=>e.def.innerType._zod.optin===`defaulted`?`defaulted`:`optional`),N(e,`optout`,e=>e.def.innerType._zod.optout),N(e,`values`,e=>e.def.innerType._zod.values),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);let r=t.innerType._zod.run({value:e.value,issues:[]},n);return r instanceof Promise?r.then(r=>Vc(e,r,t,n)):Vc(e,r,t,n)}}),Uc=P(`$ZodPipe`,(e,t)=>{R.init(e,t),N(e,`values`,e=>e.def.in._zod.values),N(e,`optin`,e=>e.def.in._zod.optin),N(e,`optout`,e=>e.def.out._zod.optout),N(e,`propValues`,e=>e.def.in._zod.propValues),e._zod.parse=(e,n)=>{if(n.direction===`backward`){let r=t.out._zod.run(e,n);return r instanceof Promise?r.then(e=>Wc(e,t.in,n)):Wc(r,t.in,n)}let r=t.in._zod.run(e,n);return r instanceof Promise?r.then(e=>Wc(e,t.out,n)):Wc(r,t.out,n)}});function Wc(e,t,n){return e.issues.some(e=>e.code!==`unrecognized_keys`)?(e.aborted=!0,e):t._zod.run({value:e.value,issues:e.issues},n)}var Gc=P(`$ZodReadonly`,(e,t)=>{R.init(e,t),N(e,`propValues`,e=>e.def.innerType._zod.propValues),N(e,`values`,e=>e.def.innerType._zod.values),N(e,`optin`,e=>e.def.innerType?._zod?.optin),N(e,`optout`,e=>e.def.innerType?._zod?.optout),e._zod.parse=(e,n)=>{if(n.direction===`backward`)return t.innerType._zod.run(e,n);let r=t.innerType._zod.run(e,n);return r instanceof Promise?r.then(Kc):Kc(r)}});function Kc(e){return e.memo||(e.value=Object.freeze(e.value)),e}var qc=P(`$ZodCustom`,(e,t)=>{L.init(e,t),R.init(e,t),e._zod.parse=(e,t)=>e,e._zod.check=n=>{let r=n.value,i=t.fn(r);if(i instanceof Promise)return i.then(t=>Jc(t,n,r,e));Jc(i,n,r,e)}});function Jc(e,t,n,r){if(!e){let e={code:`custom`,input:n,inst:r,path:[...r._zod.def.path??[]],continue:!r._zod.def.abort};r._zod.def.params&&(e.params=r._zod.def.params),t.issues.push(Na(e))}}var Yc=class extends Error{constructor(){super(`Cannot parse a reference cycle that closes through a transform`),this.name=`ZodCyclicError`}},Xc=`~memo`,Zc=[];function Qc(e){return typeof e==`object`&&!!e}function $c(e){return e.map(e=>e.path?{...e,path:e.path.slice()}:{...e})}var el=new WeakMap,tl=0,nl=1,rl=2;function il(e,t,n){let r=el.get(e);if(r!==void 0)return r?rl:tl;if(t.has(e))return rl;t.add(e);let i=tl,a=e=>{if(i!==rl&&e?._zod){let r=il(e,t,n);r>i&&(i=r)}},o=(e,r)=>{let i=tl;for(let a of Reflect.ownKeys(e)){let o=Object.getOwnPropertyDescriptor(e,a);if(r&&!o.enumerable)continue;let s=o.get?nl:o.value?._zod?il(o.value,t,n):tl;s>i&&(i=s)}return i},s=e=>{e>i&&(i=e)},c=e._zod.def;switch(c.type){case`object`:{let e=Yi(c);s(e?o(e,!0):nl),a(c.catchall);break}case`array`:a(c.element);break;case`tuple`:for(let e of c.items)a(e);a(c.rest);break;case`record`:case`map`:a(c.keyType),a(c.valueType);break;case`set`:a(c.valueType);break;case`union`:for(let e of c.options)a(e);break;case`intersection`:a(c.left),a(c.right);break;case`optional`:case`nullable`:case`default`:case`prefault`:case`catch`:case`readonly`:case`nonoptional`:case`promise`:case`success`:a(c.innerType);break;case`pipe`:a(c.in),a(c.out);break;case`function`:a(c.input),a(c.output);break;case`lazy`:{let r=c._cachedInner??(n?e._zod.innerType:void 0);s(r?il(r,t,!1):nl);break}case`template_literal`:case`string`:case`number`:case`int`:case`boolean`:case`bigint`:case`symbol`:case`undefined`:case`null`:case`void`:case`never`:case`any`:case`unknown`:case`date`:case`nan`:case`enum`:case`literal`:case`file`:case`transform`:case`custom`:break;default:for(let e in c){let t=Object.getOwnPropertyDescriptor(c,e);if(!t||t.get)continue;let n=t.value;if(n&&typeof n==`object`){if(n._zod)a(n);else if(Array.isArray(n))for(let e of n)a(e)}}}return t.delete(e),al(e,i)}function al(e,t){return t!==nl&&el.set(e,t===rl),t}function ol(e,t){let n=e.buckets.get(t);return n||(n=new WeakMap,e.buckets.set(t,n)),n}var sl,cl=[],ll={alloc(e,t,n){let r=sl;if(!r)return n;sl=void 0;let i={value:n,issues:null};return r.set(t.value,i),cl.push(i),n},guard(e){var t;(t=e._zod).deferred??(t.deferred=[]),e._zod.deferred.push(()=>{let t=e._zod.parse,n=(e,n)=>{if(n.direction!==`backward`&&dl(n,e.value))throw new Yc;return t(e,n)};e._zod.parse=n,e._zod.run===t&&(e._zod.run=n)})},attach(e){var t;let n,r=!1,i,a;(t=e._zod).deferred??(t.deferred=[]),e._zod.deferred.push(()=>{let t=e._zod.parse,o=(s,c)=>{if(n===void 0){let i=il(e,new Set,!1);if(i===tl)return e._zod.parse=t,e._zod.run===o&&(e._zod.run=t),t(s,c);i===rl||r?n=!0:r=!0}let l=s.value;if(!Qc(l))return t(s,c);let u=c[Xc];u||(u={buckets:new WeakMap,backEdges:void 0},c[Xc]=u);let d;i===c?d=a:(d=ol(u,e),i=c,a=d);let f=d.get(l);if(f)return s.value=f.value,f.issues?f.issues.length&&s.issues.push(...$c(f.issues)):(s.memo=!0,u.backEdges??(u.backEdges=new WeakSet),u.backEdges.add(f.value)),s;sl=d;let p=cl.length,m=t(s,c);sl=void 0;let h=cl.length>p?cl.pop():void 0;return m instanceof Promise?m.then(e=>(h&&(h.issues=e.issues.length?$c(e.issues):Zc),e)):(h&&(h.issues=m.issues.length?$c(m.issues):Zc),m)};e._zod.parse=o,e._zod.run===t&&(e._zod.run=o)})}};function ul(){return ll}function dl(e,t){let n=e[Xc]?.backEdges;return n!==void 0&&Qc(t)&&n.has(t)}var fl=()=>{let e={string:{unit:`characters`,verb:`to have`},file:{unit:`bytes`,verb:`to have`},array:{unit:`items`,verb:`to have`},set:{unit:`items`,verb:`to have`},map:{unit:`entries`,verb:`to have`}};function t(t){return e[t]??null}let n={regex:`input`,email:`email address`,url:`URL`,emoji:`emoji`,uuid:`UUID`,uuidv4:`UUIDv4`,uuidv6:`UUIDv6`,nanoid:`nanoid`,guid:`GUID`,cuid:`cuid`,cuid2:`cuid2`,ulid:`ULID`,xid:`XID`,ksuid:`KSUID`,datetime:`ISO datetime`,date:`ISO date`,time:`ISO time`,duration:`ISO duration`,ipv4:`IPv4 address`,ipv6:`IPv6 address`,mac:`MAC address`,cidrv4:`IPv4 range`,cidrv6:`IPv6 range`,base64:`base64-encoded string`,base64url:`base64url-encoded string`,json_string:`JSON string`,e164:`E.164 number`,currency_code:`currency code`,credit_card:`credit card number`,iban:`IBAN`,jwt:`JWT`,template_literal:`input`},r={nan:`NaN`};function i(e,t){return e===`number`&&typeof t==`number`&&!Number.isFinite(t)?String(t):r[e]??e}return e=>{switch(e.code){case`invalid_type`:return`Invalid input: expected ${i(e.expected)}, received ${i(Ma(e.input),e.input)}`;case`invalid_value`:return e.values.length===1?`Invalid input: expected ${ua(e.values[0])}`:`Invalid option: expected one of ${Vi(e.values,`|`)}`;case`too_big`:{let n=e.exact?`exactly `:e.inclusive?`<=`:`<`,r=t(e.origin);return r?`Too big: expected ${e.origin??`value`} to have ${n}${e.maximum.toString()} ${r.unit??`elements`}`:`Too big: expected ${e.origin??`value`} to be ${n}${e.maximum.toString()}`}case`too_small`:{let n=e.exact?`exactly `:e.inclusive?`>=`:`>`,r=t(e.origin);return r?`Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}`:`Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`}case`invalid_format`:{let t=e;return t.format===`starts_with`?`Invalid string: must start with "${t.prefix}"`:t.format===`ends_with`?`Invalid string: must end with "${t.suffix}"`:t.format===`includes`?`Invalid string: must include "${t.includes}"`:t.format===`regex`?`Invalid string: must match pattern ${t.pattern}`:`Invalid ${n[t.format]??e.format}`}case`not_multiple_of`:return`Invalid number: must be a multiple of ${e.divisor}`;case`unrecognized_keys`:return`Unrecognized key${e.keys.length>1?`s`:``}: ${Vi(e.keys,`, `)}`;case`invalid_key`:return`Invalid key in ${e.origin}`;case`invalid_union`:return e.options&&Array.isArray(e.options)&&e.options.length>0?`Invalid discriminator value. Expected ${e.options.map(e=>`'${e}'`).join(` | `)}`:e.inclusive===!1?`Invalid input: more than one option matched`:`Invalid input`;case`invalid_element`:return`Invalid value in ${e.origin}`;default:return`Invalid input`}}};function pl(){return{localeError:fl()}}var ml,hl=class{constructor(){this._map=new WeakMap,this._idmap=new Map}add(e,...t){let n=t[0];return this._map.set(e,n),n&&typeof n==`object`&&`id`in n&&this._idmap.set(n.id,e),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(e){let t=this._map.get(e);return t&&typeof t==`object`&&`id`in t&&this._idmap.delete(t.id),this._map.delete(e),this}get(e){let t=e._zod.parent;if(t){let n={...this.get(t)??{}};delete n.id;let r={...n,...this._map.get(e)};return Object.keys(r).length?r:void 0}return this._map.get(e)}has(e){return this._map.has(e)}};function gl(){return new hl}(ml=globalThis).__zod_globalRegistry??(ml.__zod_globalRegistry=gl());var _l=globalThis.__zod_globalRegistry;function vl(e){return e.checks&&=[...e.checks],e}function yl(e,t){return new e(vl({type:`string`,...j(t)}))}function bl(e,t){return new e({type:`string`,format:`email`,check:`string_format`,abort:!1,...j(t)})}function xl(e,t){return new e({type:`string`,format:`guid`,check:`string_format`,abort:!1,...j(t)})}function Sl(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,...j(t)})}function Cl(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v4`,...j(t)})}function wl(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v6`,...j(t)})}function Tl(e,t){return new e({type:`string`,format:`uuid`,check:`string_format`,abort:!1,version:`v7`,...j(t)})}function El(e,t){return new e({type:`string`,format:`url`,check:`string_format`,abort:!1,...j(t)})}function Dl(e,t){return new e({type:`string`,format:`emoji`,check:`string_format`,abort:!1,...j(t)})}function Ol(e,t){return new e({type:`string`,format:`nanoid`,check:`string_format`,abort:!1,...j(t)})}function kl(e,t){return new e({type:`string`,format:`cuid`,check:`string_format`,abort:!1,...j(t)})}function Al(e,t){return new e({type:`string`,format:`cuid2`,check:`string_format`,abort:!1,...j(t)})}function jl(e,t){return new e({type:`string`,format:`ulid`,check:`string_format`,abort:!1,...j(t)})}function Ml(e,t){return new e({type:`string`,format:`xid`,check:`string_format`,abort:!1,...j(t)})}function Nl(e,t){return new e({type:`string`,format:`ksuid`,check:`string_format`,abort:!1,...j(t)})}function Pl(e,t){return new e({type:`string`,format:`ipv4`,check:`string_format`,abort:!1,...j(t)})}function Fl(e,t){return new e({type:`string`,format:`ipv6`,check:`string_format`,abort:!1,...j(t)})}function Il(e,t){return new e({type:`string`,format:`cidrv4`,check:`string_format`,abort:!1,...j(t)})}function Ll(e,t){return new e({type:`string`,format:`cidrv6`,check:`string_format`,abort:!1,...j(t)})}function Rl(e,t){return new e({type:`string`,format:`base64`,check:`string_format`,abort:!1,...j(t)})}function zl(e,t){return new e({type:`string`,format:`base64url`,check:`string_format`,abort:!1,...j(t)})}function Bl(e,t){return new e({type:`string`,format:`e164`,check:`string_format`,abort:!1,...j(t)})}function Vl(e,t){return new e({type:`string`,format:`jwt`,check:`string_format`,abort:!1,...j(t)})}function Hl(e,t){return new e({type:`string`,format:`datetime`,check:`string_format`,offset:!1,local:!1,precision:null,...j(t)})}function Ul(e,t){return new e({type:`string`,format:`date`,check:`string_format`,...j(t)})}function Wl(e,t){return new e({type:`string`,format:`time`,check:`string_format`,precision:null,...j(t)})}function Gl(e,t){return new e({type:`string`,format:`duration`,check:`string_format`,...j(t)})}function Kl(e,t){return new e(vl({type:`number`,checks:[],...j(t)}))}function ql(e,t){return new e({type:`number`,check:`number_format`,abort:!1,format:`safeint`,...j(t)})}function Jl(e){return new e({type:`unknown`})}function Yl(e,t){return new e({type:`never`,...j(t)})}function Xl(e,t){return new os({check:`less_than`,...j(t),value:e,inclusive:!1})}function Zl(e,t){return new os({check:`less_than`,...j(t),value:e,inclusive:!0})}function Ql(e,t){return new ss({check:`greater_than`,...j(t),value:e,inclusive:!1})}function $l(e,t){return new ss({check:`greater_than`,...j(t),value:e,inclusive:!0})}function eu(e,t){return new cs({check:`multiple_of`,...j(t),value:e})}function tu(e,t){return new us({check:`max_length`,...j(t),maximum:e})}function nu(e,t){return new ds({check:`min_length`,...j(t),minimum:e})}function ru(e,t){return new fs({check:`length_equals`,...j(t),length:e})}function iu(e,t){return new ms({check:`string_format`,format:`regex`,...j(t),pattern:e})}function au(e){return new hs({check:`string_format`,format:`lowercase`,...j(e)})}function ou(e){return new gs({check:`string_format`,format:`uppercase`,...j(e)})}function su(e,t){return new _s({check:`string_format`,format:`includes`,...j(t),includes:e})}function cu(e,t){return new vs({check:`string_format`,format:`starts_with`,...j(t),prefix:e})}function lu(e,t){return new ys({check:`string_format`,format:`ends_with`,...j(t),suffix:e})}function uu(e){return new bs({check:`overwrite`,tx:e})}function du(e){return uu(t=>t.normalize(e))}function fu(){return uu(e=>e.trim())}function pu(){return uu(e=>e.toLowerCase())}function mu(){return uu(e=>e.toUpperCase())}function hu(){return uu(e=>ta(e))}function gu(e,t,n){return new e({type:`array`,element:t,...j(n)})}function _u(e,t,n){return new e({type:`custom`,check:`custom`,fn:t,...j(n)})}function vu(e,t){let n=yu(t=>(t.addIssue=e=>{if(typeof e==`string`)t.issues.push(Na(e,t.value,n._zod.def));else{let r=e;r.fatal&&(r.continue=!1),r.code??=`custom`,`input`in r||(r.input=t.value),r.inst??=n,r.continue??=!n._zod.def.abort,t.issues.push(Na(r))}},e(t.value,t)),t);return n}function yu(e,t){let n=new L({check:`custom`,...j(t)});return n._zod.check=e,n}function bu(e,...t){for(let n of t)for(let t of Reflect.ownKeys(n))Object.prototype.propertyIsEnumerable.call(n,t)&&Ji(e,t,n[t]);return e}function xu(e){let t=e?.target??`draft-2020-12`;return t===`draft-4`&&(t=`draft-04`),t===`draft-7`&&(t=`draft-07`),{processors:e.processors??{},metadataRegistry:e?.metadata??_l,target:t,unrepresentable:e?.unrepresentable??`throw`,override:e?.override??(()=>{}),io:e?.io??`output`,counter:0,seen:new Map,sharedDefsExtractedFor:void 0,sharedEmitDoneFor:void 0,cycles:e?.cycles??`ref`,reused:e?.reused??`inline`,intersections:[],deferred:[],external:e?.external??void 0}}function Su(e,t,n,r,i){let a=typeof t.unrepresentable==`function`?t.unrepresentable({zodSchema:e,path:r.path,message:i}):t.unrepresentable;if(a===`any`)return!1;if(a===void 0||a===`throw`)throw Error(i);return Object.assign(n,a),!0}function B(e,t,n={path:[],schemaPath:[]}){var r;let i=e._zod.def,a=t.seen.get(e);if(a)return a.count++,n.schemaPath.includes(e)&&(a.cycle=n.path),a.schema;let o={schema:{},count:1,cycle:void 0,path:n.path};t.seen.set(e,o),t.sharedDefsExtractedFor=void 0,t.sharedEmitDoneFor=void 0;let s=e._zod.toJSONSchema?.();if(s)o.schema=s;else{let r={...n,schemaPath:[...n.schemaPath,e],path:n.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(t,o.schema,r);else{let n=o.schema,a=t.processors[i.type];if(!a)throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);a(e,t,n,r)}let a=e._zod.parent;a&&(o.ref||=a,B(a,t,r),t.seen.get(a).isParent=!0)}let c=t.metadataRegistry.get(e);return c&&bu(o.schema,c),t.io===`input`&&V(e)&&(delete o.schema.examples,delete o.schema.default),t.io===`input`&&`_prefault`in o.schema&&((r=o.schema).default??(r.default=o.schema._prefault)),delete o.schema._prefault,t.seen.get(e).schema}function Cu(e){return e.replace(/~/g,`~0`).replace(/\//g,`~1`)}function wu(e,t){let n=e.seen.get(t);if(!n)throw Error(`Unprocessed schema. This is a bug in Zod.`);if(e.external&&e.sharedDefsExtractedFor===e.external)return;let r=new Map;for(let t of e.seen.entries()){let n=e.metadataRegistry.get(t[0])?.id;if(n){let e=r.get(n);if(e&&e!==t[0])throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);r.set(n,t[0])}}let i=t=>{let r=e.target===`draft-2020-12`?`$defs`:`definitions`;if(e.external){let n=e.external.registry.get(t[0])?.id,i=e.external.uri??(e=>e);if(n)return{ref:i(n)};let a=t[1].defId??t[1].schema.id??`schema${e.counter++}`;return t[1].defId=a,{defId:a,ref:`${i(`__shared`)}#/${r}/${Cu(a)}`}}let i=`#/${r}/`;if(t[1]===n&&!t[1].schema.id)return{ref:`#`};let a=t[1].schema.id??`__schema${e.counter++}`;return{defId:a,ref:i+Cu(a)}},a=e=>{if(e[1].schema.$ref)return;let t=e[1],{ref:n,defId:r}=i(e);t.def={...t.schema},r&&(t.defId=r);let a=t.schema;for(let e in a)delete a[e];a.$ref=n};if(e.cycles===`throw`)for(let t of e.seen.entries()){let e=t[1];if(e.cycle)throw Error(`Cycle detected: #/${e.cycle?.join(`/`)}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(let n of e.seen.entries()){let r=n[1];if(t===n[0])a(n);else{if(e.external){let r=e.external.registry.get(n[0])?.id;if(t!==n[0]&&r){a(n);continue}}(e.metadataRegistry.get(n[0])?.id||r.cycle||r.count>1&&e.reused===`ref`)&&a(n)}}e.external&&(e.sharedDefsExtractedFor=e.external)}function Tu(e){let t=e.anyOf;if(!Array.isArray(t)||t.length===0||e.type!==void 0)return;let n=[];for(let e of t){if(!e||typeof e!=`object`)return;Tu(e);let t=Object.keys(e);if(t.length!==1||t[0]!==`type`)return;let r=e.type;for(let e of Array.isArray(r)?r:[r]){if(typeof e!=`string`)return;n.includes(e)||n.push(e)}}delete e.anyOf,e.type=n.length===1?n[0]:n}var Eu=new Set([`type`,`properties`,`required`,`additionalProperties`]),Du=[`oneOf`,`anyOf`];function Ou(e){let t=e.additionalProperties;return t===void 0||t===!1||typeof t!=`object`||!t?null:Object.keys(t).length?t:null}function ku(e){let t=[];for(let n of e){if(typeof n!=`object`||n.type!==`object`)return null;for(let e in n)if(!Eu.has(e))return null;t.push(n)}let n={},r=new Set;for(let e of t){for(let r in e.properties){if(Object.prototype.hasOwnProperty.call(n,r))continue;let e=[];for(let n of t){let t=n.properties?.[r]??Ou(n);t!=null&&(e.some(e=>JSON.stringify(e)===JSON.stringify(t))||e.push(t))}Ji(n,r,e.length===1?e[0]:ku(e)??{allOf:e})}for(let t of e.required??[])r.add(t)}let i={type:`object`,properties:n};if(r.size&&(i.required=[...r]),t.every(e=>e.additionalProperties===!1))i.additionalProperties=!1;else{let e=[];for(let n of t){let t=Ou(n);t&&!e.some(e=>JSON.stringify(e)===JSON.stringify(t))&&e.push(t)}e.length===1?i.additionalProperties=e[0]:e.length>1&&(i.additionalProperties={allOf:e})}return i}function Au(e){let t=e.allOf;if(!Array.isArray(t)||t.length<2)return;for(let t of Eu)if(t in e)return;let n=t.filter(e=>Du.some(t=>Array.isArray(e[t]))),r=null;if(!n.length)r=ku(t);else{let e=n[0],i=Du.find(t=>Array.isArray(e[t]));if(Object.keys(e).length!==1)return;let a=t.filter(t=>t!==e),o=e[i].map(e=>ku([...a,e]));if(o.some(e=>!e))return;r={[i]:o}}r&&(delete e.allOf,bu(e,r))}function ju(e,t){let n=e.seen.get(t);if(!n)throw Error(`Unprocessed schema. This is a bug in Zod.`);let r=t=>{let n=e.seen.get(t);if(n.ref===null)return;let i=n.def??n.schema,a={...i},o=n.ref;if(n.ref=null,o){r(o);let n=e.seen.get(o),s=n.schema;if(s.$ref&&(e.target===`draft-07`||e.target===`draft-04`||e.target===`openapi-3.0`)?(i.allOf=i.allOf??[],i.allOf.push(s)):bu(i,s),bu(i,a),t._zod.parent===o)for(let e in i)e!==`$ref`&&e!==`allOf`&&(e in a||delete i[e]);if(s.$ref&&n.def)for(let e in i)e!==`$ref`&&e!==`allOf`&&e in n.def&&JSON.stringify(i[e])===JSON.stringify(n.def[e])&&delete i[e]}let s=t._zod.parent;if(s&&s!==o){r(s);let t=e.seen.get(s);if(t?.schema.$ref&&(i.$ref=t.schema.$ref,t.def))for(let e in i)e!==`$ref`&&e!==`allOf`&&e in t.def&&JSON.stringify(i[e])===JSON.stringify(t.def[e])&&delete i[e]}e.override({zodSchema:t,jsonSchema:i,path:n.path??[]})};if(!e.external||e.sharedEmitDoneFor!==e.external){for(let t of[...e.seen.entries()].reverse())r(t[0]);if(e.target!==`openapi-3.0`)for(let t of e.seen.entries())Tu(t[1].def??t[1].schema);for(let t of e.deferred)t();if(e.intersections.length){let t=new Map;for(let n of e.seen.values())for(let e of[n.schema,n.def]){let n=e?.allOf;if(!Array.isArray(n))continue;let r=t.get(n);r?r.push(e):t.set(n,[e])}for(let n of e.intersections)for(let e of t.get(n)??[])Au(e)}}let i={};if(e.target===`draft-2020-12`?i.$schema=`https://json-schema.org/draft/2020-12/schema`:e.target===`draft-07`?i.$schema=`http://json-schema.org/draft-07/schema#`:e.target===`draft-04`?i.$schema=`http://json-schema.org/draft-04/schema#`:e.target,e.external?.uri){let n=e.external.registry.get(t)?.id;if(!n)throw Error("Schema is missing an `id` property");i.$id=e.external.uri(n)}bu(i,n.defId?n.schema:n.def??n.schema);let a=e.metadataRegistry.get(t)?.id;a!==void 0&&i.id===a&&delete i.id;let o=e.external?.defs??{};if(!e.external||e.sharedEmitDoneFor!==e.external)for(let t of e.seen.entries()){let e=t[1];e.def&&e.defId&&(e.def.id===e.defId&&delete e.def.id,Ji(o,e.defId,e.def))}e.external&&(e.sharedEmitDoneFor=e.external),e.external||Object.keys(o).length>0&&(e.target===`draft-2020-12`?i.$defs=o:i.definitions=o);try{let n=JSON.parse(JSON.stringify(i));return Object.defineProperty(n,"~standard",{value:{...t[`~standard`],jsonSchema:{input:Nu(t,`input`,e.processors),output:Nu(t,`output`,e.processors)}},enumerable:!1,writable:!1}),n}catch{throw Error(`Error converting schema to JSON.`)}}function V(e,t){let n=t??{seen:new Set};if(n.seen.has(e))return!1;n.seen.add(e);let r=e._zod.def;if(r.type===`transform`)return!0;if(r.type===`array`)return V(r.element,n);if(r.type===`set`)return V(r.valueType,n);if(r.type===`lazy`)return V(r.getter(),n);if(r.type===`promise`||r.type===`optional`||r.type===`nonoptional`||r.type===`nullable`||r.type===`readonly`||r.type==="default"||r.type===`prefault`||r.type===`catch`)return V(r.innerType,n);if(r.type===`intersection`)return V(r.left,n)||V(r.right,n);if(r.type===`record`||r.type===`map`)return V(r.keyType,n)||V(r.valueType,n);if(r.type===`pipe`)return e._zod.traits.has(`$ZodCodec`)?!0:V(r.in,n)||V(r.out,n);if(r.type===`object`){for(let e in r.shape)if(V(r.shape[e],n))return!0;return!1}if(r.type===`union`){for(let e of r.options)if(V(e,n))return!0;return!1}if(r.type===`tuple`){for(let e of r.items)if(V(e,n))return!0;return!!(r.rest&&V(r.rest,n))}return!1}var Mu=(e,t={})=>n=>{let r=xu({...n,processors:t});return B(e,r),wu(r,e),ju(r,e)},Nu=(e,t,n={})=>r=>{let{libraryOptions:i,target:a}=r??{},o=xu({...i??{},target:a,io:t,processors:n});return B(e,o),wu(o,e),ju(o,e)},Pu=(e,t,n)=>{(e[t]===void 0||n>e[t])&&(e[t]=n)},Fu=(e,t,n)=>{(e[t]===void 0||n<e[t])&&(e[t]=n)},Iu=(e,t)=>{Pu(e,`minimum`,t),Fu(e,`maximum`,t)},Lu=(e,t)=>{e.multipleOf??=[],e.multipleOf.includes(t)||e.multipleOf.push(t)},Ru=(e,t)=>{e.patterns??=new Set,e.patterns.add(t)},zu=(e,t)=>{e.mime=e.mime?e.mime.filter(e=>t.includes(e)):[...t]},Bu=(e,t)=>{e.format=t,t.includes(`int`)&&(e.isInt=!0)},Vu=(e,t)=>Pu(e,`minimum`,t.minimum),Hu=(e,t)=>Fu(e,`maximum`,t.maximum),Uu=e=>(t,n)=>{Bu(t,n.format);let[r,i]=e[n.format];Pu(t,`minimum`,r),Fu(t,`maximum`,i)},Wu={greater_than:(e,t)=>Pu(e,t.inclusive?`minimum`:`exclusiveMinimum`,t.value),less_than:(e,t)=>Fu(e,t.inclusive?`maximum`:`exclusiveMaximum`,t.value),multiple_of:(e,t)=>Lu(e,t.value),number_format:Uu(fa),bigint_format:Uu(pa),min_length:Vu,max_length:Hu,length_equals:(e,t)=>Iu(e,t.length),min_size:Vu,max_size:Hu,size_equals:(e,t)=>Iu(e,t.size),string_format:(e,t)=>{Bu(e,t.format),t.pattern&&Ru(e,t.pattern),(t.format===`base64`||t.format===`base64url`)&&(e.contentEncoding=t.format),(t.local||t.precision===-1)&&(e.laxFormat=!0)},mime_type:(e,t)=>zu(e,t.mime)};function H(e){let t={},n=e._zod.def,r=e._zod.traits.has(`$ZodCheck`)?[e,...n.checks??[]]:n.checks??[];for(let e of r)Wu[e._zod.def.check]?.(t,e._zod.def);let i=e._zod.bag;i.minimum!==void 0&&Pu(t,`minimum`,i.minimum),i.exclusiveMinimum!==void 0&&Pu(t,`exclusiveMinimum`,i.exclusiveMinimum),i.maximum!==void 0&&Fu(t,`maximum`,i.maximum),i.exclusiveMaximum!==void 0&&Fu(t,`exclusiveMaximum`,i.exclusiveMaximum),i.multipleOf!==void 0&&Lu(t,i.multipleOf),i.format!==void 0&&(t.format??=i.format,i.format.includes(`int`)&&(t.isInt=!0)),i.mime&&zu(t,i.mime);for(let e of i.patterns??[])Ru(t,e);return t}var Gu={guid:`uuid`,url:`uri`,datetime:`date-time`,json_string:`json-string`,regex:``},Ku=new Map([[rc,Wo],[ac,Go]]),qu=e=>Ku.get(e)??e,Ju=(e,t,n,r)=>{let i=n;i.type=`string`;let{minimum:a,maximum:o,format:s,patterns:c,contentEncoding:l,laxFormat:u}=H(e);if(typeof a==`number`&&(i.minLength=a),typeof o==`number`&&(i.maxLength=o),s&&(i.format=Gu[s]??s,i.format===``&&delete i.format,(s===`time`||u)&&delete i.format),l&&(i.contentEncoding=l),c&&c.size>0){let e=[...c].map(qu);e.length===1?i.pattern=e[0].source:e.length>1&&(i.allOf=[...e.map(e=>({...t.target===`draft-07`||t.target===`draft-04`||t.target===`openapi-3.0`?{type:`string`}:{},pattern:e.source}))])}},Yu=(e,t,n,r)=>{let i=n,{minimum:a,maximum:o,multipleOf:s,exclusiveMaximum:c,exclusiveMinimum:l,isInt:u}=H(e);i.type=u?`integer`:`number`;let d=typeof l==`number`&&l>=(a??-1/0),f=typeof c==`number`&&c<=(o??1/0),p=t.target===`draft-04`||t.target===`openapi-3.0`;if(d?p?(i.minimum=l,i.exclusiveMinimum=!0):i.exclusiveMinimum=l:typeof a==`number`&&(i.minimum=a),f?p?(i.maximum=c,i.exclusiveMaximum=!0):i.exclusiveMaximum=c:typeof o==`number`&&(i.maximum=o),s){let n=new Set;for(let a of s)Number.isFinite(a)&&a!==0?n.add(Math.abs(a)):Su(e,t,i,r,`A multipleOf divisor of ${a} cannot be represented in JSON Schema`);let[a,...o]=n;a!==void 0&&(i.multipleOf=a),o.length&&(i.allOf=[...i.allOf??[],...o.map(e=>({multipleOf:e}))])}},Xu=(e,t,n,r)=>{n.not={}},Zu=(e,t,n,r)=>{let i=e._zod.def,a=Bi(i.entries);a.length===0?n.not={}:(a.every(e=>typeof e==`number`)&&(n.type=`number`),a.every(e=>typeof e==`string`)&&(n.type=`string`),n.enum=a)},Qu=(e,t,n,r)=>{Su(e,t,n,r,`Custom types cannot be represented in JSON Schema`)},$u=(e,t,n,r)=>{Su(e,t,n,r,`Transforms cannot be represented in JSON Schema`)},ed=(e,t,n,r)=>{let i=n,a=e._zod.def,{minimum:o,maximum:s}=H(e);typeof o==`number`&&(i.minItems=o),typeof s==`number`&&(i.maxItems=s),i.type=`array`,i.items=B(a.element,t,{...r,path:[...r.path,`items`]})};function td(e){let t=e._zod.def;return t.type===`pipe`&&t.in._zod.traits.has(`$ZodTransform`)?td(t.out):t.type===`catch`?td(t.innerType):e._zod.optin}var nd=(e,t,n,r)=>{let i=n,a=e._zod.def,o=a.shape;if(Object.getOwnPropertySymbols(o).length&&Su(e,t,i,r,`Symbol keys cannot be represented in JSON Schema`))return;i.type=`object`,i.properties={};for(let e in o)Ji(i.properties,e,B(o[e],t,{...r,path:[...r.path,`properties`,e]}));let s=[];for(let e of Object.keys(o)){let n=a.shape[e];(t.io===`input`?td(n)===void 0:n._zod.optout===void 0)&&s.push(e)}s.length>0&&(i.required=s),a.catchall?._zod.def.type===`never`?i.additionalProperties=!1:a.catchall?a.catchall&&(i.additionalProperties=B(a.catchall,t,{...r,path:[...r.path,`additionalProperties`]})):t.io===`output`&&(i.additionalProperties=!1)},rd=(e,t,n,r)=>{let i=e._zod.def,a=i.inclusive===!1,o=i.options.map((e,n)=>B(e,t,{...r,path:[...r.path,a?`oneOf`:`anyOf`,n]}));a?n.oneOf=o:n.anyOf=o},id=(e,t,n,r)=>{let i=e._zod.def,a=B(i.left,t,{...r,path:[...r.path,`allOf`,0]}),o=B(i.right,t,{...r,path:[...r.path,`allOf`,1]}),s=e=>`allOf`in e&&Object.keys(e).length===1,c=[...s(a)?a.allOf:[a],...s(o)?o.allOf:[o]];n.allOf=c,t.intersections.push(c)},ad=(e,t,n,r)=>{let i=e._zod.def,a=B(i.innerType,t,r),o=t.seen.get(e);t.target===`openapi-3.0`?(o.ref=i.innerType,n.nullable=!0):n.anyOf=[a,{type:`null`}]},od=(e,t,n,r)=>{let i=e._zod.def;B(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType},sd=Symbol();function cd(e,t,n,r,i){let a=!1,o=JSON.stringify(e,(e,t)=>typeof t==`bigint`?(a=!0,null):t);return a?(Su(t,n,r,i,`BigInt defaults cannot be represented in JSON Schema`),sd):JSON.parse(o)}var ld=(e,t,n,r)=>{let i=e._zod.def;B(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType;let o=cd(i.defaultValue,e,t,n,r);o!==sd&&(n.default=o)},ud=(e,t,n,r)=>{let i=e._zod.def;B(i.innerType,t,r);let a=t.seen.get(e);if(a.ref=i.innerType,t.io!==`input`)return;let o=cd(i.defaultValue,e,t,n,r);o!==sd&&(n._prefault=o)},dd=(e,t,n,r)=>{let i=e._zod.def;B(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType;let o;try{o=i.catchValue(void 0)}catch{Su(e,t,n,r,`Dynamic catch values are not supported in JSON Schema`);return}n.default=o},fd=(e,t,n,r)=>{let i=e._zod.def,a=i.in._zod.traits.has(`$ZodTransform`),o=t.io===`input`?a?i.out:i.in:i.out;B(o,t,r);let s=t.seen.get(e);s.ref=o},pd=(e,t,n,r)=>{let i=e._zod.def;B(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType,n.readOnly=!0},md=(e,t,n,r)=>{let i=e._zod.def;B(i.innerType,t,r);let a=t.seen.get(e);a.ref=i.innerType},hd=new WeakSet([Object.prototype,Error.prototype]);function gd(e,t,n){Object.defineProperty(e,t,{configurable:!0,enumerable:!1,get(){let e=n(this);return Object.defineProperty(this,t,{value:e,configurable:!0,writable:!0}),e},set(e){Object.defineProperty(this,t,{value:e,configurable:!0,writable:!0})}})}var U=P(`ZodError`,(e,t)=>{ro.init(e,t),e.name=`ZodError`;let n=Object.getPrototypeOf(e);hd.has(n)||(hd.add(n),gd(n,`format`,e=>t=>oo(e,t)),gd(n,`flatten`,e=>t=>ao(e,t)),gd(n,`addIssue`,e=>t=>{e.issues.push(t),e.message=JSON.stringify(e.issues,Hi,2)}),gd(n,`addIssues`,e=>t=>{e.issues.push(...t),e.message=JSON.stringify(e.issues,Hi,2)}),Object.defineProperty(n,"isEmpty",{configurable:!0,enumerable:!1,get(){return this.issues.length===0}}))},void 0,{Parent:Error}),_d=co(U),vd=lo(U),yd=uo(U),bd=po(U),xd=yo(U),Sd=bo(U),Cd=xo(U),wd=So(U),Td=Co(U),Ed=wo(U),Dd=To(U),Od=Eo(U);function kd(){F.localeError||I(pl())}function Ad(){F.memoizer||I({memoizer:ul()})}var W=P(`ZodType`,(e,t)=>(kd(),R.init(e,t),e.def=t,e.type=t.type,e),{check(...e){let t=this.def;return this.clone(A(t,{checks:[...t.checks??[],...e.map(e=>typeof e==`function`?{_zod:{check:e,def:{check:`custom`},onattach:[]}}:e)]}),{parent:!0})},with(...e){return this.check(...e)},clone(e,t){return la(this,e,t)},brand(){return this},register(e,t){return e.add(this,t),this},refine(e,t){return this.check(Hf(e,t))},superRefine(e,t){return this.check(Uf(e,t))},overwrite(e){return this.check(uu(e))},optional(){return wf(this)},exactOptional(){return Ef(this)},nullable(){return Of(this)},nullish(){return wf(Of(this))},nonoptional(e){return Pf(this,e)},array(){return pf(this)},or(e){return gf([this,e])},and(e){return vf(this,e)},transform(e){return Rf(this,Sf(e))},default(e){return Af(this,e)},prefault(e){return Mf(this,e)},catch(e){return If(this,e)},pipe(e){return Rf(this,e)},readonly(){return Bf(this)},describe(e){let t=this.clone();return _l.add(t,{description:e}),t},meta(...e){if(e.length===0)return _l.get(this);let t=this.clone();return _l.add(t,e[0]),t},isOptional(){return this.safeParse(void 0).success},isNullable(){return this.safeParse(null).success},apply(e,...t){return t.length===0?e(this):e(this,...t)},get"~standard"(){return Ia(this,`~standard`,{...Ts(this),jsonSchema:{input:Nu(this,`input`),output:Nu(this,`output`)}})},set"~standard"(e){Fa(this,`~standard`,e)},parse:function e(t,n){return _d(this,t,n,{callee:e})},parseAsync:async function e(t,n){return await vd(this,t,n,{callee:e})},safeParse(e,t){return yd(this,e,t)},async safeParseAsync(e,t){return bd(this,e,t)},get spa(){return this?.safeParseAsync},set spa(e){Fa(this,`spa`,e)},validate(e,t){return go(this,e,t)},validateAsync(e,t){return vo(this,e,t)},encode:function e(t,n){return xd(this,t,n,{callee:e})},decode:function e(t,n){return Sd(this,t,n,{callee:e})},encodeAsync:async function e(t,n){return await Cd(this,t,n,{callee:e})},decodeAsync:async function e(t,n){return await wd(this,t,n,{callee:e})},safeEncode(e,t){return Td(this,e,t)},safeDecode(e,t){return Ed(this,e,t)},async safeEncodeAsync(e,t){return Dd(this,e,t)},async safeDecodeAsync(e,t){return Od(this,e,t)},toJSONSchema(e){return Mu(this,{})(e)},get description(){return _l.get(this)?.description},get _def(){return this._zod.def}}),jd=P(`_ZodString`,(e,t)=>{Es.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Ju(e,t,n,r)},La({format:e=>H(e).format??null,minLength:e=>H(e).minimum??null,maxLength:e=>H(e).maximum??null},{regex(...e){return this.check(iu(...e))},includes(...e){return this.check(su(...e))},startsWith(...e){return this.check(cu(...e))},endsWith(...e){return this.check(lu(...e))},min(...e){return this.check(nu(...e))},max(...e){return this.check(tu(...e))},length(...e){return this.check(ru(...e))},nonempty(...e){return this.check(nu(1,...e))},lowercase(e){return this.check(au(e))},uppercase(e){return this.check(ou(e))},trim(){return this.check(fu())},normalize(...e){return this.check(du(...e))},toLowerCase(){return this.check(pu())},toUpperCase(){return this.check(mu())},slugify(){return this.check(hu())}})),Md=P(`ZodString`,(e,t)=>{Es.init(e,t),jd.init(e,t)},{email(e){return this.check(bl(Rd,e))},url(e){return this.check(El(Vd,e))},jwt(e){return this.check(Vl(nf,e))},emoji(e){return this.check(Dl(Hd,e))},guid(e){return this.check(xl(zd,e))},uuid(e){return this.check(Sl(Bd,e))},uuidv4(e){return this.check(Cl(Bd,e))},uuidv6(e){return this.check(wl(Bd,e))},uuidv7(e){return this.check(Tl(Bd,e))},nanoid(e){return this.check(Ol(Ud,e))},cuid(e){return this.check(kl(Wd,e))},cuid2(e){return this.check(Al(Gd,e))},ulid(e){return this.check(jl(Kd,e))},base64(e){return this.check(Rl($d,e))},base64url(e){return this.check(zl(ef,e))},xid(e){return this.check(Ml(qd,e))},ksuid(e){return this.check(Nl(Jd,e))},ipv4(e){return this.check(Pl(Yd,e))},ipv6(e){return this.check(Fl(Xd,e))},cidrv4(e){return this.check(Il(Zd,e))},cidrv6(e){return this.check(Ll(Qd,e))},e164(e){return this.check(Bl(tf,e))},datetime(e){return this.check(Hl(Pd,e))},date(e){return this.check(Ul(Fd,e))},time(e){return this.check(Wl(Id,e))},duration(e){return this.check(Gl(Ld,e))}});function Nd(e){return yl(Md,e)}var G=P(`ZodStringFormat`,(e,t)=>{z.init(e,t),jd.init(e,t)}),Pd=P(`ZodISODateTime`,(e,t)=>{Gs.init(e,t),G.init(e,t)}),Fd=P(`ZodISODate`,(e,t)=>{Ks.init(e,t),G.init(e,t)}),Id=P(`ZodISOTime`,(e,t)=>{qs.init(e,t),G.init(e,t)}),Ld=P(`ZodISODuration`,(e,t)=>{Js.init(e,t),G.init(e,t)}),Rd=P(`ZodEmail`,(e,t)=>{ks.init(e,t),G.init(e,t)}),zd=P(`ZodGUID`,(e,t)=>{Ds.init(e,t),G.init(e,t)}),Bd=P(`ZodUUID`,(e,t)=>{Os.init(e,t),G.init(e,t)}),Vd=P(`ZodURL`,(e,t)=>{Ls.init(e,t),G.init(e,t)}),Hd=P(`ZodEmoji`,(e,t)=>{Rs.init(e,t),G.init(e,t)}),Ud=P(`ZodNanoID`,(e,t)=>{zs.init(e,t),G.init(e,t)}),Wd=P(`ZodCUID`,(e,t)=>{Bs.init(e,t),G.init(e,t)}),Gd=P(`ZodCUID2`,(e,t)=>{Vs.init(e,t),G.init(e,t)}),Kd=P(`ZodULID`,(e,t)=>{Hs.init(e,t),G.init(e,t)}),qd=P(`ZodXID`,(e,t)=>{Us.init(e,t),G.init(e,t)}),Jd=P(`ZodKSUID`,(e,t)=>{Ws.init(e,t),G.init(e,t)}),Yd=P(`ZodIPv4`,(e,t)=>{Ys.init(e,t),G.init(e,t)}),Xd=P(`ZodIPv6`,(e,t)=>{Qs.init(e,t),G.init(e,t)}),Zd=P(`ZodCIDRv4`,(e,t)=>{$s.init(e,t),G.init(e,t)}),Qd=P(`ZodCIDRv6`,(e,t)=>{tc.init(e,t),G.init(e,t)}),$d=P(`ZodBase64`,(e,t)=>{ic.init(e,t),G.init(e,t)}),ef=P(`ZodBase64URL`,(e,t)=>{sc.init(e,t),G.init(e,t)}),tf=P(`ZodE164`,(e,t)=>{cc.init(e,t),G.init(e,t)}),nf=P(`ZodJWT`,(e,t)=>{uc.init(e,t),G.init(e,t)}),rf=P(`ZodNumber`,(e,t)=>{dc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Yu(e,t,n,r),e.isFinite=!0},La({minValue:e=>{let{minimum:t,exclusiveMinimum:n}=H(e);return Math.max(t??-1/0,n??-1/0)},maxValue:e=>{let{maximum:t,exclusiveMaximum:n}=H(e);return Math.min(t??1/0,n??1/0)},isInt:e=>{let{isInt:t,multipleOf:n}=H(e);return!!t||!!n?.some(Number.isSafeInteger)},format:e=>H(e).format??null},{gt(e,t){return this.check(Ql(e,t))},gte(e,t){return this.check($l(e,t))},min(e,t){return this.check($l(e,t))},lt(e,t){return this.check(Xl(e,t))},lte(e,t){return this.check(Zl(e,t))},max(e,t){return this.check(Zl(e,t))},int(e){return this.check(sf(e))},safe(e){return this.check(sf(e))},positive(e){return this.check(Ql(0,e))},nonnegative(e){return this.check($l(0,e))},negative(e){return this.check(Xl(0,e))},nonpositive(e){return this.check(Zl(0,e))},multipleOf(e,t){return this.check(eu(e,t))},step(e,t){return this.check(eu(e,t))},finite(){return this}}));function af(e){return Kl(rf,e)}var of=P(`ZodNumberFormat`,(e,t)=>{fc.init(e,t),rf.init(e,t)});function sf(e){return ql(of,e)}var cf=P(`ZodUnknown`,(e,t)=>{pc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(e,t,n)=>void 0});function lf(){return Jl(cf)}var uf=P(`ZodNever`,(e,t)=>{mc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Xu(e,t,n,r)});function df(e){return Yl(uf,e)}var ff=P(`ZodArray`,(e,t)=>{Ad(),vc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>ed(e,t,n,r),e.element=t.element},{min(e,t){return this.check(nu(e,t))},nonempty(e){return this.check(nu(1,e))},max(e,t){return this.check(tu(e,t))},length(e,t){return this.check(ru(e,t))},unwrap(){return this.element}});function pf(e,t){return gu(ff,e,t)}var mf=P(`ZodObject`,(e,t)=>{Ad(),wc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>nd(e,t,n,r),Ua(e,`shape`,e=>e._zod.def.shape,!1)},{keyof(){return bf(Object.keys(this._zod.def.shape))},catchall(e){return this.clone(A(this._zod.def,{catchall:e}))},passthrough(){return this.clone(A(this._zod.def,{catchall:lf()}))},loose(){return this.clone(A(this._zod.def,{catchall:lf()}))},strict(){return this.clone(A(this._zod.def,{catchall:df()}))},strip(){return this.clone(A(this._zod.def,{catchall:void 0}))},extend(e){return _a(this,e)},safeExtend(e){return ya(this,e)},merge(e){return ba(this,e)},pick(e){return ma(this,e)},omit(e){return ga(this,e)},partial(...e){return xa(Cf,this,e[0])},exactPartial(...e){return xa(Tf,this,e[0],`exactPartial`)},required(...e){return Sa(Nf,this,e[0])}});function K(e,t){return new mf({type:`object`,shape:e??{},...j(t)})}var hf=P(`ZodUnion`,(e,t)=>{Ec.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>rd(e,t,n,r),e.options=t.options});function gf(e,t){return new hf({type:`union`,options:e,...j(t)})}var _f=P(`ZodIntersection`,(e,t)=>{Dc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>id(e,t,n,r)});function vf(e,t){return new _f({type:`intersection`,left:e,right:t})}var yf=P(`ZodEnum`,(e,t)=>{Ac.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Zu(e,t,n,r),e.enum=t.entries,e.options=[...e._zod.values];let n=new Set(Object.keys(t.entries));e.extract=(e,r)=>{let i={};for(let r of e)if(n.has(r))i[r]=t.entries[r];else throw Error(`Key ${r} not found in enum`);return new yf({...t,checks:[],...j(r),entries:i})},e.exclude=(e,r)=>{let i={...t.entries};for(let t of e)if(n.has(t))delete i[t];else throw Error(`Key ${t} not found in enum`);return new yf({...t,checks:[],...j(r),entries:i})}});function bf(e,t){return new yf({type:`enum`,entries:Array.isArray(e)?Object.fromEntries(e.map(e=>[e,e])):e,...j(t)})}var xf=P(`ZodTransform`,(e,t)=>{Ad(),jc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>$u(e,t,n,r),e._zod.parse=(n,r)=>{if(r.direction===`backward`)throw new Za(e.constructor.name);n.addIssue=r=>{if(typeof r==`string`)n.issues.push(Na(r,n.value,t));else{let t=r;t.fatal&&(t.continue=!1),t.code??=`custom`,`input`in t||(t.input=n.value),t.inst??=e,n.issues.push(Na(t))}};let i=t.transform(n.value,n);return i instanceof Promise?i.then(e=>(n.value=e,n)):(n.value=i,n)}});function Sf(e){return new xf({type:`transform`,transform:e})}var Cf=P(`ZodOptional`,(e,t)=>{Nc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>md(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function wf(e){return new Cf({type:`optional`,innerType:e})}var Tf=P(`ZodExactOptional`,(e,t)=>{Pc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>md(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function Ef(e){return new Tf({type:`optional`,innerType:e})}var Df=P(`ZodNullable`,(e,t)=>{Fc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>ad(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function Of(e){return new Df({type:`nullable`,innerType:e})}var kf=P(`ZodDefault`,(e,t)=>{Ic.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>ld(e,t,n,r),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap});function Af(e,t){return new kf({type:`default`,innerType:e,get defaultValue(){return typeof t==`function`?t():oa(t)}})}var jf=P(`ZodPrefault`,(e,t)=>{Rc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>ud(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function Mf(e,t){return new jf({type:`prefault`,innerType:e,get defaultValue(){return typeof t==`function`?t():oa(t)}})}var Nf=P(`ZodNonOptional`,(e,t)=>{zc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>od(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function Pf(e,t){return new Nf({type:`nonoptional`,innerType:e,...j(t)})}var Ff=P(`ZodCatch`,(e,t)=>{Hc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>dd(e,t,n,r),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap});function If(e,t){return new Ff({type:`catch`,innerType:e,catchValue:typeof t==`function`?t:Ga(t)})}var Lf=P(`ZodPipe`,(e,t)=>{Uc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>fd(e,t,n,r),e.in=t.in,e.out=t.out});function Rf(e,t){return new Lf({type:`pipe`,in:e,out:t})}var zf=P(`ZodReadonly`,(e,t)=>{Gc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>pd(e,t,n,r),e.unwrap=()=>e._zod.def.innerType});function Bf(e){return new zf({type:`readonly`,innerType:e})}var Vf=P(`ZodCustom`,(e,t)=>{qc.init(e,t),W.init(e,t),e._zod.processJSONSchema=(t,n,r)=>Qu(e,t,n,r)});function Hf(e,t={}){return _u(Vf,e,t)}function Uf(e,t){return vu(e,t)}var Wf=e=>typeof e==`object`&&!!e&&!Array.isArray(e),q=Nd().nullish().transform(e=>e??void 0),Gf=af().nullish().transform(e=>e??void 0),Kf=K({video:K({id:Nd().min(1),title:Nd(),count:K({view:Gf,mylist:Gf,comment:Gf}).nullish().transform(e=>e??void 0),registeredAt:q,thumbnail:K({url:q}).nullish().transform(e=>e??void 0),description:q}),comment:K({nvComment:K({server:q,params:lf().optional(),threadKey:q}).nullish().transform(e=>e??void 0)}).nullish().transform(e=>e??void 0),owner:K({nickname:q,name:q}).nullish().transform(e=>e??void 0),channel:K({name:q}).nullish().transform(e=>e??void 0),series:K({video:K({next:K({id:q}).nullish().transform(e=>e??void 0)}).nullish().transform(e=>e??void 0)}).nullish().transform(e=>e??void 0)});function qf(e){let t=e;if(e.trimStart().startsWith(`<`)){let n=new DOMParser().parseFromString(e,`text/html`).querySelector(`meta[name="server-response"]`)?.getAttribute(`content`);if(!n)throw Error(`Watch page response data is missing`);t=n}let n;try{n=JSON.parse(t)}catch{n=JSON.parse(decodeURIComponent(t))}if(!Wf(n)||!Wf(n.data))throw Error(`Invalid watch response`);if(Wf(n.meta)&&typeof n.meta.status==`number`&&(n.meta.status<200||n.meta.status>=300))throw Error(`Watch response failed (API ${n.meta.status})`);let r=Wf(n.data.response)?n.data.response:n.data,i=r;if(`$watchV4`in r){if(Wf(r.$watchV4)&&Wf(r.$watchV4.data))i={...r,...r.$watchV4.data};else if(!Wf(r.video))throw Error(`Invalid watchV4 response`)}let a=Kf.safeParse(i);if(!a.success)throw Error(`Incomplete watch response data`);return a.data}var Jf=r(`dAnime:NicoApiFetcher`),Yf=class{apiData=null;comments=null;get lastApiData(){return this.apiData}get cachedComments(){return this.comments}async fetchApiData(e){try{let t=await zi({method:`GET`,url:Li(this.sanitizeVideoId(e)),headers:{Accept:`text/html`}});if(t.status<200||t.status>=300)throw Error(`Watch page request failed (HTTP ${t.status})`);let n=qf(t.response);return this.apiData=n,n}catch(e){throw Jf.error(`NicoApiFetcher.fetchApiData`,e),e}}async fetchComments(){try{if(!this.apiData)throw Error(`API data must be fetched first`);let e=this.apiData.comment?.nvComment;if(!e?.server||!e.params||!e.threadKey)throw Error(`Required comment server data is missing`);let t=await zi({method:`POST`,url:`${e.server}/v1/threads`,headers:{"Content-Type":`application/json`,"x-client-os-type":`others`,"X-Frontend-Id":`6`,"X-Frontend-Version":`0`},data:JSON.stringify({params:e.params,threadKey:e.threadKey,additionals:{}})}),n=(JSON.parse(t.response).data?.threads??[]).filter(e=>e.fork===`main`).sort((e,t)=>(t.commentCount||0)-(e.commentCount||0))[0];if(!n)throw Error(`Main thread not found in comment response`);let r=(n.comments??[]).map(e=>({text:e.body??``,vposMs:e.vposMs??0,commands:e.commands??[]}));return this.comments=r,r}catch(e){throw Jf.error(`NicoApiFetcher.fetchComments`,e),e}}async fetchAllData(e){return await this.fetchApiData(e),this.fetchComments()}sanitizeVideoId(e){try{let t=encodeURIComponent(e);return t=t.replace(/%([0-9A-F]{2})/gi,(e,t)=>{let n=parseInt(t,16);return n>=65&&n<=90||n>=97&&n<=122||n>=48&&n<=57||n===45||n===95||n===46||n===126?String.fromCharCode(n):e}),t}catch(t){return Jf.error(`NicoApiFetcher.sanitizeVideoId`,t,{videoId:e}),e}}},Xf=r(`dAnime:NicoVideoSearcher`),Zf=`dアニメストア ニコニコ支店`,Qf=class e{cache=new Map;static isOfficialVideo(e,t){let n=e.owner?.nickname??e.owner?.name??e.channel?.name??``;return!!(n===Zf||n===t||n.startsWith(t+` `))}static filterOfficialVideos(t,n){return t.filter(t=>e.isOfficialVideo(t,n))}async search(e){if(!e.trim())return[];if(this.cache.has(e))return this.cache.get(e)??[];let t=Ri(e),n=await this.fetchText(t),r=this.parseServerContext(n).map(t=>{let n=this.calculateLevenshteinDistance(e,t.title),r=Math.max(e.length,t.title.length),i=r>0?(1-n/r)*100:0;return{...t,levenshteinDistance:n,similarity:i}}),i=[],a=new Set;for(let e of r)e?.videoId&&(a.has(e.videoId)||(a.add(e.videoId),i.push(e)));return i.sort((e,t)=>{if(e.commentCount!==t.commentCount)return t.commentCount-e.commentCount;let n=e.similarity??-1,r=t.similarity??-1;return n===r?t.viewCount-e.viewCount:r-n}),this.cache.set(e,i),i}async fetchText(e){return(await zi({method:`GET`,url:e})).response}parseServerContext(e){try{let t=new DOMParser().parseFromString(e,`text/html`).querySelector(`meta[name="server-response"]`);if(!t)return[];let n=t.getAttribute(`content`)??``,r=this.decodeHtmlEntities(n),i;try{i=JSON.parse(r)}catch(e){return Xf.error(`NicoVideoSearcher.parseServerContext`,e),[]}return this.extractVideoItems(i??{})}catch(e){return Xf.error(`NicoVideoSearcher.parseServerContext`,e),[]}}decodeHtmlEntities(e){if(!e)return``;let t=e.replace(/&quot;/g,`"`).replace(/&#39;/g,`'`).replace(/&amp;/g,`&`).replace(/&lt;/g,`<`).replace(/&gt;/g,`>`);return t=t.replace(/&#(\d+);/g,(e,t)=>String.fromCharCode(parseInt(t,10))),t=t.replace(/&#x([0-9a-fA-F]+);/g,(e,t)=>String.fromCharCode(parseInt(t,16))),t}extractVideoItems(e){let t=[],n=e=>{let n=(e?.id??e?.contentId??e?.watchId??``).toString();if(!n)return;let r=(e?.title??e?.shortTitle??``).toString(),i=e?.count??{},a=Number(i.view??e?.viewCounter??0)||0,o=Number(i.comment??e?.commentCounter??0)||0,s=Number(i.mylist??e?.mylistCounter??0)||0,c=e?.thumbnail??{},l=(c.nHdUrl||c.listingUrl||c.largeUrl||c.middleUrl||c.url||e?.thumbnailUrl||``).toString(),u=(e?.registeredAt||e?.startTime||e?.postedDateTime||``)?.toString?.()??``,d=e?.owner&&typeof e.owner==`object`?{nickname:(e.owner.nickname??e.owner.name??``)||void 0,name:(e.owner.name??e.owner.nickname??``)||void 0}:null,f=(e?.isChannelVideo||e?.owner?.ownerType===`channel`)&&e?.owner?{name:e.owner.name??``}:null;r&&t.push({videoId:n,title:r,viewCount:a,commentCount:o,mylistCount:s,thumbnail:l,postedAt:u,owner:d,channel:f})},r=e=>{if(!e)return;if(Array.isArray(e)){e.forEach(r);return}if(typeof e!=`object`||!e)return;let t=e;(t.id||t.contentId||t.watchId)&&n(t),Object.values(e).forEach(r)};return r(e),t}calculateLevenshteinDistance(e,t){let n=e?e.length:0,r=t?t.length:0;if(n===0)return r;if(r===0)return n;let i=Array(r+1);for(let e=0;e<=r;++e){let t=i[e]=Array(n+1);t[0]=e}let a=i[0];for(let e=1;e<=n;++e)a[e]=e;for(let a=1;a<=r;++a)for(let r=1;r<=n;++r){let n=e[r-1]===t[a-1]?0:1;i[a][r]=Math.min(i[a-1][r]+1,i[a][r-1]+1,i[a-1][r-1]+n)}return i[r][n]}},J={mypageHeaderTitle:`.p-mypageHeader__title`,mypageListContainer:`.p-mypageMain`,watchVideoElement:`video#video`,mypageItem:`.itemModule.list`,mypageItemTitle:`.line1`,mypageEpisodeNumber:`.number.line1 span`,mypageEpisodeTitle:`.episode.line1 span`,watchPageAnimeTitle:`.backInfoTxt1`,watchPageEpisodeNumber:`.backInfoTxt2`,watchPageEpisodeTitle:`.backInfoTxt3`,watchSettingButton:`.setting.mainButton`,watchButtonArea:`.buttonArea`},$f=class{delay;timers=new Map;funcIds=new Map;nextId=1;constructor(e){this.delay=e}getFuncId(e){return this.funcIds.has(e)||this.funcIds.set(e,this.nextId++),this.funcIds.get(e)??0}exec(e){let t=this.getFuncId(e),n=Date.now(),r=this.timers.get(t)?.lastExec??0,i=n-r;if(i>this.delay)e(),this.timers.set(t,{lastExec:n});else{clearTimeout(this.timers.get(t)?.timerId??void 0);let n=setTimeout(()=>{e(),this.timers.set(t,{lastExec:Date.now()})},this.delay-i);this.timers.set(t,{timerId:n,lastExec:r})}}execOnce(e){let t=this.getFuncId(e),n=this.timers.get(t);if(n?.executedOnce){n.timerId&&clearTimeout(n.timerId);return}n?.timerId&&clearTimeout(n.timerId);let r=setTimeout(()=>{try{e()}finally{this.timers.set(t,{executedOnce:!0,lastExec:Date.now(),timerId:null})}},this.delay);this.timers.set(t,{timerId:r,executedOnce:!1,scheduled:!0})}cancel(e){let t=this.getFuncId(e),n=this.timers.get(t);n?.timerId&&clearTimeout(n.timerId),this.timers.delete(t)}resetExecution(e){let t=this.getFuncId(e),n=this.timers.get(t);n&&(n.timerId&&clearTimeout(n.timerId),this.timers.set(t,{executedOnce:!1,scheduled:!1}))}clearAll(){for(let[,e]of this.timers)e.timerId&&clearTimeout(e.timerId);this.timers.clear(),this.funcIds.clear()}},Y=r(`dAnime:VideoEventLogger`),ep=class{prefix;video=null;lastCurrentTime=0;eventListeners=new Map;isEnabled=!0;TRACKED_EVENTS=[`loadstart`,`loadedmetadata`,`loadeddata`,`canplay`,`canplaythrough`,`play`,`playing`,`pause`,`seeking`,`seeked`,`timeupdate`,`ended`,`emptied`,`stalled`,`suspend`,`waiting`,`error`,`abort`];constructor(e=``){this.prefix=e}enable(){this.isEnabled=!0,Y.info(`${this.prefix}:enabled`)}disable(){this.isEnabled=!1,Y.info(`${this.prefix}:disabled`)}attach(e){this.detach(),this.video=e,this.lastCurrentTime=e.currentTime,Y.info(`${this.prefix}:attach`,{src:this.getVideoSource(e),duration:e.duration,currentTime:e.currentTime,readyState:e.readyState}),this.TRACKED_EVENTS.forEach(t=>{let n=()=>{this.handleEvent(t)};this.eventListeners.set(t,n),e.addEventListener(t,n)}),this.setupCurrentTimeWatcher()}detach(){this.video&&=(this.eventListeners.forEach((e,t)=>{this.video?.removeEventListener(t,e)}),this.eventListeners.clear(),Y.info(`${this.prefix}:detach`,{src:this.getVideoSource(this.video),finalTime:this.video.currentTime}),null)}handleEvent(e){if(!this.isEnabled||!this.video)return;let t=this.video,n={event:e,currentTime:t.currentTime,duration:t.duration,readyState:t.readyState,paused:t.paused,ended:t.ended,src:this.getVideoSource(t),networkState:t.networkState,timestamp:Date.now()},r=Math.abs(t.currentTime-this.lastCurrentTime);if(e===`timeupdate`)r>.1&&(this.lastCurrentTime=t.currentTime);else switch(r>.1?(Y.info(`${this.prefix}:event:${e}`,{...n,timeDiff:r.toFixed(2),direction:t.currentTime>this.lastCurrentTime?`forward`:`backward`}),this.lastCurrentTime=t.currentTime):Y.debug(`${this.prefix}:event:${e}`,n),e){case`error`:Y.error(`${this.prefix}:videoError`,Error(`Video error detected`),{errorCode:t.error?.code??null,errorMessage:t.error?.message??null,...n});break;case`ended`:Y.warn(`${this.prefix}:videoEnded`,{...n,message:`動画再生が終了しました`});break;case`emptied`:Y.warn(`${this.prefix}:videoEmptied`,{...n,message:`動画要素が空になりました（src変更の可能性）`});break;case`seeking`:Y.warn(`${this.prefix}:seeking`,{...n,from:this.lastCurrentTime,to:t.currentTime,diff:(t.currentTime-this.lastCurrentTime).toFixed(2)})}}setupCurrentTimeWatcher(){Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,`currentTime`)?.set?Y.debug(`${this.prefix}:currentTimeWatcher:setup`):Y.warn(`${this.prefix}:currentTimeWatcher:unsupported`)}logManualSeek(e,t,n){this.isEnabled&&Y.warn(`${this.prefix}:manualSeek`,{from:e.toFixed(2),to:t.toFixed(2),diff:(t-e).toFixed(2),reason:n,stackTrace:Error().stack})}getVideoSource(e){let t=typeof e.currentSrc==`string`?e.currentSrc:``;if(t.length>0)return t.length>100?`${t.slice(0,100)}...`:t;let n=e.getAttribute(`src`)??``;return n.length>0?n.length>100?`${n.slice(0,100)}...`:n:null}},tp=null;function np(){return tp||=new ep(`global`),tp}var rp=1e3,ip=100,ap=30,op=1e4,sp=100,cp=/watch\/(?:([a-z]{2}))?(\d+)/gi,X=r(`dAnime:VideoSwitchHandler`),lp=e=>{if(!e?.video)return null;let t=e.video.registeredAt,n=t?new Date(t).toLocaleString(`ja-JP`,{year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,hour12:!1}):void 0;return{videoId:e.video.id,title:e.video.title,viewCount:e.video.count?.view,mylistCount:e.video.count?.mylist,commentCount:e.video.count?.comment,postedAt:n,thumbnail:e.video.thumbnail?.url,owner:e.owner??null,channel:e.channel??null}},up=e=>{let t=[],n;for(;(n=cp.exec(e))!==null;){let[,e=``,r=``]=n;r&&t.push(`${e}${r}`)}return t},dp=class{renderer;fetcher;settingsManager;monitorInterval;nextVideoId=null;preloadedComments=null;lastPreloadedComments=null;lastVideoId=null;lastVideoSource=null;checkIntervalId=null;isSwitching=!1;debounce;videoEventLogger;constructor(e,t,n,r=rp,i=ip){this.renderer=e,this.fetcher=t,this.settingsManager=n,this.monitorInterval=r,this.debounce=new $f(i),this.videoEventLogger=new ep(`VideoSwitchHandler`)}resetVideoSource(){X.info(`videoSwitch:resetVideoSource`,{previousSource:this.lastVideoSource,previousLastPreloadedCount:this.lastPreloadedComments?.length??0,previousPreloadedCount:this.preloadedComments?.length??0,previousNextVideoId:this.nextVideoId}),this.lastVideoSource=null,this.lastPreloadedComments=null,this.preloadedComments=null,this.nextVideoId=null}updateRenderer(e){X.info(`videoSwitch:updateRenderer`,{oldRendererExists:!!this.renderer,newRendererExists:!!e}),this.renderer=e}startMonitoring(){this.stopMonitoring(),this.checkIntervalId=window.setInterval(()=>{this.checkVideoEnd()},this.monitorInterval)}stopMonitoring(){this.checkIntervalId&&=(window.clearInterval(this.checkIntervalId),null)}async onVideoSwitch(e){if(this.isSwitching)X.warn(`videoSwitch:alreadySwitching`,{timestamp:Date.now()});else{this.isSwitching=!0;try{X.warn(`videoSwitch:entry`,{videoElementProvided:!!e,currentRendererComments:this.renderer.getCommentsSnapshot().length,lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId,lastVideoSource:this.lastVideoSource,rendererVideoElement:this.renderer.getVideoElement()?`attached`:`detached`,rendererVideoSrc:this.renderer.getCurrentVideoSource(),sampleCurrentComments:this.renderer.getCommentsSnapshot().slice(0,3).map(e=>({text:e.text?.substring(0,30),vposMs:e.vposMs}))});let t=await this.resolveVideoElement(e)??null;if(t?.ended){X.info(`videoSwitch:skipEndedVideo`,{currentTime:t.currentTime,duration:t.duration,paused:t.paused});return}let n=this.preloadedComments??this.lastPreloadedComments??null,r=t?.dataset?.videoId??t?.getAttribute?.(`data-video-id`)??null,i=this.nextVideoId??r??this.lastVideoId;if(X.warn(`videoSwitch:videoIdResolution`,{videoId:i??null,nextVideoId:this.nextVideoId,elementId:r,lastVideoId:this.lastVideoId,hasBackupPreloaded:!!n,backupPreloadedCount:n?.length??0}),!t||!i&&!n){X.warn(`videoSwitch:earlyReturn`,{reason:t?`no videoId and no backup`:`no video element`,hasVideoElement:!!t,hasVideoId:!!i,hasBackupPreloaded:!!n}),this.handleMissingVideoInfo(n);return}X.warn(`videoSwitch:start`,{videoId:i??null,elementVideoId:t.dataset?.videoId??null,preloadedCount:n?.length??0,currentTime:t.currentTime,duration:t.duration,readyState:t.readyState,currentSrc:t.currentSrc,lastVideoSource:this.lastVideoSource}),O.show(D(`videoSwitchDetected`),`info`),this.videoEventLogger.attach(t),this.resetRendererState(t);let a=this.renderer.getVideoElement();if(a!==t&&t)X.debug(`videoSwitch:rebind`,{previousSrc:this.renderer.getCurrentVideoSource(),newSrc:typeof t.currentSrc==`string`&&t.currentSrc.length>0?t.currentSrc:t.getAttribute(`src`)??null}),this.renderer.initialize(t);else if(a===t&&t&&this.hasVideoSourceChanged(t))X.debug(`videoSwitch:rebind:sameElement`,{previousSrc:this.lastVideoSource??null,newSrc:this.getVideoSource(t)}),this.renderer.clearComments(),this.renderer.destroy(),this.renderer.initialize(t);else if(!a&&!t){X.warn(`videoSwitch:missingVideoElement`,{lastVideoId:this.lastVideoId,nextVideoId:this.nextVideoId}),this.isSwitching=!1;return}let o=null;if(i){let e=this.fetcher.lastApiData;o=n&&e?.video?.id===i?e:await this.fetchVideoApiData(i,n),o&&(this.persistVideoMetadata(o),this.lastVideoId=i)}let s=await this.populateComments(i,n);s===0?(this.renderer.clearComments(),O.show(D(`commentsUnavailable`),`warning`),X.warn(`videoSwitch:commentsMissing`,{videoId:i??null})):X.warn(`videoSwitch:commentsLoaded`,{videoId:i??null,count:s}),this.nextVideoId=null,this.preloadedComments=null,this.lastVideoSource=this.getVideoSource(t);let c=this.renderer.getCommentsSnapshot();if(X.warn(`videoSwitch:complete`,{videoId:i??null,finalTime:t.currentTime,loadedCount:s,finalCommentsCount:c.length,rendererVideoSrc:this.renderer.getCurrentVideoSource(),sampleFinalComments:c.slice(0,5).map(e=>({text:e.text?.substring(0,30),vposMs:e.vposMs,vposSec:(e.vposMs/1e3).toFixed(2)}))}),o){let e=lp(o);if(e){let t=E(`commentSourceUpdated`,{count:String(s),title:e.title??D(`unknownTitle`)});O.show(t,s>0?`success`:`warning`)}}}catch(e){X.error(`videoSwitch:error`,e,{nextVideoId:this.nextVideoId,lastVideoId:this.lastVideoId}),O.show(E(`videoSwitchError`,{message:e.message}),`error`),this.renderer.clearComments()}finally{this.isSwitching=!1}}}async resolveVideoElement(e){if(e){let t=this.getVideoSource(e),n=this.lastVideoSource;return t&&t!==n||await this.waitForSourceChange(e),e}let t=Date.now()+op,n=null;for(;Date.now()<t;){let e=document.querySelector(J.watchVideoElement);if(e){n=e;let t=this.hasVideoSourceChanged(e);if(e.readyState>=2||!e.paused||t)return t&&(this.lastVideoSource=null),e}await new Promise(e=>window.setTimeout(e,sp))}return n}async waitForSourceChange(e){let t=this.getVideoSource(e);if(!t)return;let n=Date.now()+op;for(;Date.now()<n;){let n=this.getVideoSource(e);if(n&&n!==t){this.lastVideoSource=null;return}await new Promise(e=>window.setTimeout(e,sp))}}hasVideoSourceChanged(e){let t=this.getVideoSource(e);return t?!this.lastVideoSource||this.lastVideoSource!==t:!1}getVideoSource(e){if(!e)return null;let t=typeof e.currentSrc==`string`?e.currentSrc:``;if(t.length>0)return t;let n=e.getAttribute(`src`)??``;if(n.length>0)return n;let r=e.querySelector(`source[src]`);return r&&typeof r.src==`string`&&r.src.length>0?r.src:null}resetRendererState(e){let t=this.getVideoSource(e),n=this.lastVideoSource!==t,r=this.renderer.getCommentsSnapshot().length;X.warn(`videoSwitch:resetRendererState:before`,{currentTime:e.currentTime,duration:e.duration,src:t,lastSrc:this.lastVideoSource??null,sourceChanged:n,readyState:e.readyState,paused:e.paused,commentsCount:r}),X.warn(`videoSwitch:resetRendererState:clearingComments`,{commentsBeforeClear:r,sourceChanged:n,currentVideoSrc:this.renderer.getCurrentVideoSource()}),this.renderer.clearComments(),X.warn(`videoSwitch:resetRendererState:commentsCleared`,{commentsAfterClear:this.renderer.getCommentsSnapshot().length,rendererVideoSrc:this.renderer.getCurrentVideoSource()})}async checkVideoEnd(){let e=this.renderer.getVideoElement();e&&Number.isFinite(e.duration)&&(e.duration-e.currentTime>ap||(this.nextVideoId||this.debounce.execOnce(async()=>{await this.findNextVideoId()}),this.nextVideoId&&!this.preloadedComments&&this.debounce.execOnce(async()=>{await this.preloadComments()})))}handleMissingVideoInfo(e){X.warn(`videoSwitch:handleMissingVideoInfo`,{hasBackupPreloaded:!!e,backupPreloadedCount:e?.length??0,hasLastPreloadedComments:!!this.lastPreloadedComments,lastPreloadedCount:this.lastPreloadedComments?.length??0,willClearComments:!e&&!this.lastPreloadedComments}),!e&&!this.lastPreloadedComments?(X.warn(`videoSwitch:clearingCommentsInMissingInfo`,{currentCommentCount:this.renderer.getCommentsSnapshot().length}),this.renderer.clearComments(),O.show(D(`nextVideoCommentsUnavailableClear`),`warning`)):X.info(`videoSwitch:preservingComments`,{reason:`backup or last preloaded comments available`,currentCommentCount:this.renderer.getCommentsSnapshot().length})}async fetchVideoApiData(e,t){try{let t=await this.fetcher.fetchApiData(e);return X.debug(`videoSwitch:apiFetched`,{videoId:e}),t}catch(n){if(X.error(`videoSwitch:apiFetchError`,n,{videoId:e}),!t)throw n;return null}}persistVideoMetadata(e){let t=lp(e);t&&this.settingsManager.saveVideoData(t.title??``,t)}async populateComments(e,t){let n=null;if(X.warn(`videoSwitch:populateComments:start`,{videoId:e,backupPreloadedCount:t?.length??0,hasBackupPreloaded:!!t}),Array.isArray(t)&&t.length>0)n=t,X.warn(`videoSwitch:populateComments:usingBackup`,{count:n.length});else if(e)try{X.warn(`videoSwitch:populateComments:fetching`,{videoId:e}),n=await this.fetcher.fetchComments(),X.warn(`videoSwitch:commentsFetched`,{videoId:e,count:n.length})}catch(t){X.error(`videoSwitch:commentsFetchError`,t,{videoId:e}),O.show(E(`commentFetchError`,{message:t.message}),`error`),n=null}if(!n||n.length===0)return X.warn(`videoSwitch:populateComments:noComments`),0;let r=n.filter(e=>!this.renderer.isNGComment(e.text));return X.warn(`videoSwitch:populateComments:addingToRenderer`,{filteredCount:r.length,totalCount:n.length,rendererCommentsBeforeAdd:this.renderer.getCommentsSnapshot().length,rendererVideoElement:this.renderer.getVideoElement()?`attached`:`detached`,rendererVideoSrc:this.renderer.getCurrentVideoSource()}),r.forEach((e,t)=>{this.renderer.addComment(e.text,e.vposMs,e.commands),t<3&&X.warn(`videoSwitch:populateComments:addedComment[${t}]`,{text:e.text.substring(0,30),vposMs:e.vposMs,vposSec:(e.vposMs/1e3).toFixed(2),commands:e.commands})}),X.warn(`videoSwitch:populateComments:complete`,{addedCount:r.length,rendererCommentsAfterAdd:this.renderer.getCommentsSnapshot().length,rendererVideoSrcAfterAdd:this.renderer.getCurrentVideoSource(),sampleComments:this.renderer.getCommentsSnapshot().slice(0,3).map(e=>({text:e.text?.substring(0,30),vposMs:e.vposMs}))}),this.lastPreloadedComments=[...r],r.length}async findNextVideoId(){try{let e=this.fetcher.lastApiData;if(!e)return;let t=e.series?.video?.next?.id;if(t){this.nextVideoId=t,X.debug(`videoSwitch:detectedNext`,{videoId:t});return}let n=e.video?.description??``;if(!n)return;let r=up(n);if(r.length===0)return;let i=[...r].sort((e,t)=>{let n=parseInt(e.replace(/^[a-z]{2}/i,``),10)||0;return(parseInt(t.replace(/^[a-z]{2}/i,``),10)||0)-n});this.nextVideoId=i[0]??null,this.nextVideoId&&X.debug(`videoSwitch:candidateFromDescription`,{candidate:this.nextVideoId})}catch(e){X.error(`videoSwitch:nextIdError`,e,{lastVideoId:this.lastVideoId})}}async preloadComments(){if(this.nextVideoId)try{let e=(await this.fetcher.fetchAllData(this.nextVideoId)).filter(e=>!this.renderer.isNGComment(e.text));this.preloadedComments=e.length>0?e:null,X.debug(`videoSwitch:preloaded`,{videoId:this.nextVideoId,count:e.length})}catch(e){X.error(`videoSwitch:preloadError`,e,{videoId:this.nextVideoId}),this.preloadedComments=null}}},fp=`
.nico-comment-shadow-host {
  display: block;
  position: relative;
}
`,pp=class{static initialize(){Yr(fp)}},mp=`M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z`,hp=`M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z`,gp=`M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z`,_p=`M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z`,vp=`M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z`,yp=`M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z`,bp=`M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z`,xp=`M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z`,Sp=`M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z`,Cp=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z`,wp=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z`,Tp=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z`,Ep=`M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z`,Dp=`M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z`,Op=`M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z`,kp=`M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z`,Ap=`M7,2V13H10V22L17,10H13L17,2H7Z`,jp=`M5,4V7H10.5V19H13.5V7H19V4H5Z`,Mp=`M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z`,Np=`M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z`,Pp=`M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z`,Fp=`M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z`,Ip=`M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z`,Lp=`M8,5.14V19.14L19,12.14L8,5.14Z`,Rp=`M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z`,zp=`M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z`,Bp=`M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9`,Vp=`M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z`,Hp=`M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z`,Up=`M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z`;function Z(e,t=24){return`<svg xmlns="http://www.w3.org/2000/svg" width="${String(t)}" height="${String(t)}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}Z(Op),Z(Dp),Z(Up),Z(vp);var Wp=Z(Lp);Z(zp),Z(Fp),Z(Ep),Z(Ap);var Gp=Z(Sp),Kp=Z(Ip),qp=Z(Pp),Jp=Z(Cp),Yp=Z(Np),Xp=Z(jp),Zp=Z(mp),Qp=Z(kp),$p=Z(Tp),em=Z(Rp),tm=Z(yp),nm=Z(wp),rm=Z(Vp);Z(_p),Z(bp),Z(xp),Z(gp),Z(hp);var im=Z(Mp),am=Z(Hp),om=Z(Bp),sm=r(`dAnime:SettingsUI`),Q={searchInput:`#searchInput`,searchAnimeTitle:`#searchAnimeTitle`,searchEpisodeNumber:`#searchEpisodeNumber`,searchEpisodeTitle:`#searchEpisodeTitle`,searchButton:`#searchButton`,openSearchPage:`#openSearchPageDirect`,searchResults:`#searchResults`,saveButton:`#saveSettings`,autoSearchToggle:`#autoSearchToggle`,autoSearchOptionRow:`#autoSearchOptionRow`,currentTitle:`#currentTitle`,currentVideoId:`#currentVideoId`,currentOwner:`#currentOwner`,currentViewCount:`#currentViewCount`,currentCommentCount:`#currentCommentCount`,currentMylistCount:`#currentMylistCount`,currentPostedAt:`#currentPostedAt`,currentThumbnail:`#currentThumbnail`,ngWords:`#ngWords`,ngRegexps:`#ngRegexps`,showNgWords:`#showNgWords`,showNgRegexps:`#showNgRegexp`,settingsModal:`#settingsModal`,closeSettingsModal:`#closeSettingsModal`,modalOverlay:`.settings-modal__overlay`,modalTabs:`.settings-modal__tab`,modalPane:`.settings-modal__pane`,searchModeToggle:`#searchModeToggle`,searchStructuredFields:`#searchStructuredFields`,searchFreeInputArea:`#searchFreeInputArea`},cm=[`search`,`ng`],lm=`
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
`,um=`
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
`,dm=class e extends Di{static FAB_HOST_ID=`danime-settings-fab-host`;settingsManager;fetcher;searcher;settings;currentVideoInfo;hostElement=null;activeTab=`search`;modalElement=null;overlayElement=null;closeButtonElement=null;fabElement=null;fabHostElement=null;fabShadowRoot=null;fabTooltipEl=null;autoSearchTooltipHtml=``;handleFabClick=e=>{e.preventDefault(),this.openSettingsModal()};handleOverlayClick=()=>{this.closeSettingsModal()};handleCloseClick=()=>{this.closeSettingsModal()};constructor(e,t=new Yf,n=new Qf){super(),this.settingsManager=e,this.fetcher=t,this.searcher=n,this.settings=this.settingsManager.getSettings(),this.currentVideoInfo=this.settingsManager.loadVideoData()}insertIntoMypage(){let e=document.querySelector(J.mypageHeaderTitle);e&&(this.hostElement=this.createSettingsUI(),e.parentElement?.insertBefore(this.hostElement,e.nextSibling))}addAutoCommentButtons(){document.querySelectorAll(J.mypageItem).forEach(e=>{if(e.dataset.autoFillEnabled===`true`)return;let t=e.querySelector(J.mypageItemTitle),n=e.querySelector(J.mypageEpisodeNumber),r=e.querySelector(J.mypageEpisodeTitle);if(!t||!r)return;let i=t.textContent?.trim()??``,a=n?.textContent?.trim()??``,o=r.textContent?.trim()??``;if(!i)return;let s=document.createElement(`div`);s.style.marginTop=`8px`,s.style.display=`block`;let c=s.attachShadow({mode:`open`}),l=document.createElement(`style`);l.textContent=ji.getAutoButtonStyles(),c.appendChild(l);let u=document.createElement(`button`);u.className=`auto-comment-button`,u.title=D(`autoFillSearchForm`),u.setAttribute(`aria-label`,D(`autoFillSearchForm`)),u.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,14H16L18,16V18H20V16L18,14V12H14M10,10H4V12H10M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H11.35C11.14,19.37 11,18.7 11,18A7,7 0 0,1 18,11C19.1,11 20.12,11.29 21,11.78V6M4,6H9.17L11.17,8H20V10H18V10.5C16.55,10.16 15,10.64 14,11.5V10H4M12,14H4V16H11.35C11.63,15.28 12.08,14.63 12.64,14.08L12,14Z" />
        </svg>
        <span style="margin-left: 6px; font-size: 12px; font-weight: 500;">${D(`formInput`)}</span>
      `,u.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),this.openSettingsModal(!1),this.queryModalElement(`${Q.modalTabs}[data-tab="search"]`)?.click();let t=this.queryModalElement(Q.searchAnimeTitle),n=this.queryModalElement(Q.searchEpisodeNumber),r=this.queryModalElement(Q.searchEpisodeTitle);t&&(t.value=i),n&&a&&(n.value=a),r&&o&&(r.value=o),t?.focus({preventScroll:!0});let s=[i];a&&s.push(a),o&&s.push(o),O.show(E(`searchFormFilled`,{keyword:s.join(` `)}),`success`)}),c.appendChild(u);let d=r.parentElement;if(d){let e=d.querySelector(`.iconContainer`);e?d.insertBefore(s,e):d.appendChild(s)}e.dataset.autoFillEnabled=`true`})}async waitMypageListStable(){}tryRestoreByDanimeIds(){return!1}createSettingsUI(){let e=document.createElement(`div`);e.className=`nico-comment-shadow-host settings-host`,this.createShadowDOM(e),this.addStyles(ji.getCommonStyles());let t=this.buildSettingsHtml();return this.setHTML(t),this.applySettingsToUI(),this.addStyles(lm),this.setupEventListeners(),e}buildSettingsHtml(){let e=e=>typeof e==`number`?e.toLocaleString():`-`,t=e=>{if(!e)return`-`;try{return new Date(e).toLocaleDateString(`ja-JP`,{year:`numeric`,month:`2-digit`,day:`2-digit`})}catch{return e}},n=this.currentVideoInfo,r=n?.thumbnail??``;return`
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="Version">${Jr}</span>
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
              <img id="currentThumbnail" src="${r}" alt="${D(`thumbnail`)}">
            </div>

            <!-- 情報セクション -->
            <div class="video-card__info">
              <!-- 上部: ID & 日付 -->
              <div class="video-card__meta-row">
                <div class="video-card__id" title="${D(`videoId`)}">
                  <span class="video-card__id-icon" aria-hidden="true">${Yp}</span>
                  <span class="sr-only">${D(`videoId`)}</span>
                  <span id="currentVideoId">${n?.videoId??D(`currentVideoUnset`)}</span>
                </div>
                <div class="video-card__date" title="${D(`postedAt`)}">
                  <span class="video-card__date-icon" aria-hidden="true">${tm}</span>
                  <span class="sr-only">${D(`postedAt`)}</span>
                  <span id="currentPostedAt">${t(n?.postedAt)}</span>
                </div>
              </div>

              <!-- 中央: タイトル & 投稿者 -->
              <div class="video-card__main">
                <h3 class="video-card__title" id="currentTitle">${n?.title??D(`currentVideoUnset`)}</h3>
                <div class="video-card__owner" title="${D(`videoOwner`)}">
                  <span class="video-card__owner-icon" aria-hidden="true">${Zp}</span>
                  <span class="sr-only">${D(`videoOwner`)}</span>
                  <span id="currentOwner">${n?.owner?.nickname??n?.channel?.name??`-`}</span>
                </div>
              </div>

              <!-- 下部: 統計情報 -->
              <div class="video-card__stats">
                <div class="video-card__stat" title="${D(`viewCountLong`)}">
                  <span class="video-card__stat-icon" aria-hidden="true">${Qp}</span>
                  <span class="sr-only">${D(`viewCountLong`)}</span>
                  <span class="video-card__stat-value" id="currentViewCount">${e(n?.viewCount)}</span>
                </div>
                <div class="video-card__stat" title="${D(`commentCountLong`)}">
                  <span class="video-card__stat-icon" aria-hidden="true">${$p}</span>
                  <span class="sr-only">${D(`commentCountLong`)}</span>
                  <span class="video-card__stat-value" id="currentCommentCount">${e(n?.commentCount)}</span>
                </div>
                <div class="video-card__stat" title="${D(`mylistCountLong`)}">
                  <span class="video-card__stat-icon" aria-hidden="true">${em}</span>
                  <span class="sr-only">${D(`mylistCountLong`)}</span>
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
            <h3 id="settingsModalTitle">${D(`settings`)}</h3>
            <button id="closeSettingsModal" class="settings-modal__close" type="button" aria-label="${D(`settingsClose`)}">
              <span aria-hidden="true">${Gp}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${Jp}</span>
              <span class="settings-modal__tab-label">${D(`searchTab`)}</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${qp}</span>
              <span class="settings-modal__tab-label">${D(`ngTab`)}</span>
            </button>
          </div>
          <div class="settings-modal__panes">
            <section class="settings-modal__pane is-active" data-pane="search" role="tabpanel" id="settingsPaneSearch" aria-labelledby="settingsTabSearch">
              <div class="setting-group search-section">
                <h3>${D(`searchVideoHeading`)}</h3>
                <div
                  class="playback-option${this.settings.autoSearchEnabled?` playback-option--active`:``}"
                  id="autoSearchOptionRow"
                  role="button"
                  tabindex="0"
                  aria-pressed="${this.settings.autoSearchEnabled?`true`:`false`}"
                  style="margin-bottom: 16px;"
                >
                  <div class="playback-option__icon-wrapper${this.settings.autoSearchEnabled?` playback-option__icon-wrapper--active`:``}">
                    ${am}
                  </div>
                  <div class="playback-option__text">
                    <span class="playback-option__title">${D(`autoSearch`)}</span>
                    <span class="playback-option__desc">${D(`autoSearchDescription`)}</span>
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
                  <div class="info-badge" id="autoSearchInfoBadge" tabindex="0" aria-label="${D(`autoSearchInfo`)}">
                    ${im}
                  </div>
                </div>

                <div class="search-mode-switch">
                  <span class="search-mode-switch__label search-mode-switch__label--active" id="searchModeLabelStructured">${D(`structuredInput`)}</span>
                  <label class="search-mode-switch__toggle" aria-label="${D(`searchInputModeToggle`)}">
                    <input type="checkbox" id="searchModeToggle" class="search-mode-switch__checkbox">
                    <span class="search-mode-switch__track"></span>
                    <span class="search-mode-switch__thumb"></span>
                  </label>
                  <span class="search-mode-switch__label" id="searchModeLabelFree">${D(`freeInput`)}</span>
                </div>

                <div class="search-fields" id="searchStructuredFields">
                  <div class="search-field">
                    <label for="searchAnimeTitle" class="search-field__label">${D(`animeTitle`)}</label>
                    <input type="text" id="searchAnimeTitle" class="search-field__input" placeholder="${D(`searchAnimePlaceholder`)}">
                  </div>
                  <div class="search-field-row">
                    <div class="search-field search-field--half">
                      <label for="searchEpisodeNumber" class="search-field__label">${D(`episodeNumber`)}</label>
                      <input type="text" id="searchEpisodeNumber" class="search-field__input" placeholder="${D(`searchEpisodeNumberPlaceholder`)}">
                    </div>
                    <div class="search-field search-field--half">
                      <label for="searchEpisodeTitle" class="search-field__label">${D(`episodeTitleOptional`)}</label>
                      <input type="text" id="searchEpisodeTitle" class="search-field__input" placeholder="${D(`searchEpisodeTitlePlaceholder`)}">
                    </div>
                  </div>
                </div>

                <div class="search-free-input" id="searchFreeInputArea" style="display:none;">
                  <div class="search-field">
                    <label for="searchInput" class="search-field__label">${D(`searchFreeword`)}</label>
                    <input type="text" id="searchInput" class="search-field__input" placeholder="${D(`manualSearchPlaceholder`)}">
                  </div>
                </div>

                <div class="search-container">
                  <button id="searchButton">${D(`search`)}</button>
                  <button id="openSearchPageDirect" class="open-search-page-direct-btn">${D(`searchPage`)}</button>
                  <div class="shield-badge" tabindex="0" aria-label="${D(`officialVideoSafeguardInfo`)}">
                    ${om}
                  </div>
                </div>
                <div id="searchResults" class="search-results"></div>
              </div>
            </section>
            <section class="settings-modal__pane" data-pane="ng" role="tabpanel" id="settingsPaneNg" aria-labelledby="settingsTabNg" aria-hidden="true">
              <div class="setting-group ng-settings">
                <div class="ng-settings__column" aria-labelledby="ngWordsTitle">
                  <h3 id="ngWordsTitle" class="ng-settings__title">${D(`ngWords`)}</h3>
                  <textarea class="ng-settings__textarea" id="ngWords" placeholder="${D(`ngWordsPlaceholder`)}">${(this.settings.ngWords??[]).join(`
`)}</textarea>
                </div>
                <div class="ng-settings__column" aria-labelledby="ngRegexTitle">
                  <h3 id="ngRegexTitle" class="ng-settings__title">${D(`ngRegex`)}</h3>
                  <textarea class="ng-settings__textarea" id="ngRegexps" placeholder="${D(`ngRegexPlaceholder`)}">${(this.settings.ngRegexps??[]).join(`
`)}</textarea>
                </div>
              </div>
            </section>
          </div>
          <footer class="settings-modal__footer">
            <button id="saveSettings" type="button">${D(`saveSettings`)}</button>
          </footer>
        </div>
      </div>
    `}setupEventListeners(){this.setupModalControls(),this.setupModalTabs(),this.setupAutoSearchToggle(),this.setupNgControls(),this.setupSaveButton(),this.setupSearch(),this.setupTooltipBadges()}setupModalControls(){this.closeButtonElement?.removeEventListener(`click`,this.handleCloseClick),this.overlayElement?.removeEventListener(`click`,this.handleOverlayClick);let e=this.createOrUpdateFab(),t=this.queryModalElement(Q.settingsModal),n=this.queryModalElement(Q.closeSettingsModal),r=this.queryModalElement(Q.modalOverlay);this.modalElement=t??null,this.closeButtonElement=n??null,this.overlayElement=r??null,t&&n&&r&&e&&(this.fabElement?.removeEventListener(`click`,this.handleFabClick),e.addEventListener(`click`,this.handleFabClick),e.setAttribute(`aria-controls`,t.id),e.setAttribute(`aria-haspopup`,`dialog`),e.setAttribute(`aria-expanded`,`false`),this.fabElement=e,n.addEventListener(`click`,this.handleCloseClick),r.addEventListener(`click`,this.handleOverlayClick),this.shadowRoot?.addEventListener(`keydown`,e=>{let t=e;t.key===`Escape`&&!this.modalElement?.classList.contains(`hidden`)&&(t.preventDefault(),this.closeSettingsModal())}),this.applySettingsToUI())}setupModalTabs(){let e=Array.from(this.queryModalSelectorAll(Q.modalTabs)),t=Array.from(this.queryModalSelectorAll(Q.modalPane));if(e.length===0||t.length===0)return;let n=n=>{e.forEach(e=>{let t=this.toModalTabKey(e.dataset.tab)===n;e.classList.toggle(`is-active`,t),e.setAttribute(`aria-selected`,String(t)),e.setAttribute(`tabindex`,t?`0`:`-1`)}),t.forEach(e=>{let t=this.toModalTabKey(e.dataset.pane)===n;e.classList.toggle(`is-active`,t),e.setAttribute(`aria-hidden`,String(!t))}),this.activeTab=n};e.forEach(t=>{t.addEventListener(`click`,()=>{let e=this.toModalTabKey(t.dataset.tab);e&&n(e)}),t.addEventListener(`keydown`,r=>{let i=r;if(i.key!==`ArrowRight`&&i.key!==`ArrowLeft`)return;i.preventDefault();let a=this.toModalTabKey(t.dataset.tab);if(!a)return;let o=i.key===`ArrowRight`?1:-1,s=cm[(cm.indexOf(a)+o+cm.length)%cm.length];n(s),e.find(e=>this.toModalTabKey(e.dataset.tab)===s)?.focus({preventScroll:!0})})}),n(this.activeTab)}openSettingsModal(e=!0){this.modalElement&&this.fabElement&&(this.modalElement.classList.remove(`hidden`),this.modalElement.setAttribute(`aria-hidden`,`false`),this.fabElement.setAttribute(`aria-expanded`,`true`),e&&this.queryModalElement(`${Q.modalTabs}.is-active`)?.focus({preventScroll:!0}))}closeSettingsModal(){this.modalElement&&this.fabElement&&(this.modalElement.classList.add(`hidden`),this.modalElement.setAttribute(`aria-hidden`,`true`),this.fabElement.setAttribute(`aria-expanded`,`false`),this.fabElement?.isConnected&&this.fabElement.focus({preventScroll:!0}))}toModalTabKey(e){return e&&cm.includes(e)?e:null}setupAutoSearchToggle(){let e=this.queryModalElement(Q.autoSearchToggle),t=this.queryModalElement(Q.autoSearchOptionRow);if(!e||!t)return;let n=()=>{this.settings.autoSearchEnabled=!this.settings.autoSearchEnabled,this.updateAutoSearchToggleState(),this.updateSearchSectionNote(),this.settingsManager.updateSettings(this.settings),O.show(this.settings.autoSearchEnabled?D(`autoSearchEnabled`):D(`autoSearchDisabledManual`),`success`)};t.addEventListener(`click`,e=>{e.target.closest(`.playback-option__toggle`)||n()}),t.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),n())}),e.addEventListener(`change`,()=>{n()}),this.updateAutoSearchToggleState()}updateAutoSearchToggleState(){let e=this.settings.autoSearchEnabled,t=this.queryModalElement(Q.autoSearchToggle),n=this.queryModalElement(Q.autoSearchOptionRow),r=n?.querySelector(`.playback-option__icon-wrapper`);t&&(t.checked=e),n&&(n.classList.toggle(`playback-option--active`,e),n.setAttribute(`aria-pressed`,e?`true`:`false`)),r&&r.classList.toggle(`playback-option__icon-wrapper--active`,e)}buildAutoSearchTooltipHtml(){return this.settings.autoSearchEnabled?`<strong style="color:#7F5AF0;">自動設定機能が有効です</strong><br>
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
      `,e.appendChild(t)}let t=document.createElement(`div`);t.className=`fab-floating-tooltip`,e.appendChild(t),this.fabTooltipEl=t}showFabTooltip(e,t,n){this.ensureFabTooltip();let r=this.fabTooltipEl;if(!r)return;let i=e.getBoundingClientRect();r.innerHTML=t,r.className=`fab-floating-tooltip fab-floating-tooltip--${n}`,r.style.display=`block`,r.style.width=`300px`;let a=i.right-300;a<8&&(a=8),a+300>window.innerWidth-8&&(a=window.innerWidth-300-8),r.style.left=`${a}px`,r.style.top=`0px`,requestAnimationFrame(()=>{if(r.style.display===`none`)return;let e=r.offsetHeight,t=i.top-8,n=window.innerHeight-i.bottom-8,a;a=t>=e?i.top-e-8:n>=e?i.bottom+8:Math.max(8,i.top-e-8),r.style.top=`${a}px`})}hideFabTooltip(){this.fabTooltipEl&&(this.fabTooltipEl.style.display=`none`)}shieldTooltipHtml=`<strong>公式動画セーフガード有効</strong><br>アニメタイトルを入力すると、投稿者名が「アニメタイトル」「アニメタイトル 第Nクール」「dアニメストア ニコニコ支店」の公式動画のみが優先表示されます。エピソード切替時も公式動画のみが自動選択されます。`;setupTooltipBadges(){let e=this.queryModalElement(`#autoSearchInfoBadge`),t=this.queryModalElement(`.shield-badge`);e&&(e.addEventListener(`mouseenter`,()=>{this.showFabTooltip(e,this.autoSearchTooltipHtml,`info`)}),e.addEventListener(`mouseleave`,()=>this.hideFabTooltip()),e.addEventListener(`focusin`,()=>{this.showFabTooltip(e,this.autoSearchTooltipHtml,`info`)}),e.addEventListener(`focusout`,()=>this.hideFabTooltip())),t&&(t.addEventListener(`mouseenter`,()=>{this.showFabTooltip(t,this.shieldTooltipHtml,`shield`)}),t.addEventListener(`mouseleave`,()=>this.hideFabTooltip()),t.addEventListener(`focusin`,()=>{this.showFabTooltip(t,this.shieldTooltipHtml,`shield`)}),t.addEventListener(`focusout`,()=>this.hideFabTooltip()))}setupNgControls(){let e=this.queryModalElement(Q.ngWords);e&&e.classList.remove(`hidden`);let t=this.queryModalElement(Q.ngRegexps);t&&t.classList.remove(`hidden`)}setupSaveButton(){let e=this.queryModalElement(Q.saveButton);e&&e.addEventListener(`click`,()=>this.saveSettings())}setupSearch(){let e=this.queryModalElement(Q.searchInput),t=this.queryModalElement(Q.searchAnimeTitle),n=this.queryModalElement(Q.searchEpisodeNumber),r=this.queryModalElement(Q.searchEpisodeTitle),a=this.queryModalElement(Q.searchButton),o=this.queryModalElement(Q.openSearchPage),s=this.queryModalElement(Q.searchModeToggle),c=this.settingsManager.loadManualSearchSettings();c&&(t&&(t.value=c.animeTitle),n&&(n.value=c.episodeNumber),r&&(r.value=c.episodeTitle));let l=()=>{let e=s?.checked??!1,t=this.queryModalElement(`#searchModeLabelStructured`),n=this.queryModalElement(`#searchModeLabelFree`);t&&t.classList.toggle(`search-mode-switch__label--active`,!e),n&&n.classList.toggle(`search-mode-switch__label--active`,e)},u=()=>{let e=s?.checked??!1,t=this.queryModalElement(Q.searchStructuredFields),n=this.queryModalElement(Q.searchFreeInputArea);t&&(t.style.display=e?`none`:``),n&&(n.style.display=e?``:`none`),l()};s?.addEventListener(`change`,u),u();let d=()=>s?.checked??!1,f=()=>d()?e?.value.trim()??``:[t?.value.trim()??``,n?.value.trim()??``,r?.value.trim()??``].filter(Boolean).join(` `),p=()=>{if(d())return;let e=t?.value.trim()??``,i=n?.value.trim()??``,a=r?.value.trim()??``;(e||i)&&this.settingsManager.saveManualSearchSettings({animeTitle:e,episodeNumber:i,episodeTitle:a})},m=async()=>{let e=f();if(!e){O.show(D(`searchKeywordRequired`),`warning`);return}p();let n=d()?``:t?.value.trim()??``;await this.executeSearch(e,n)};a?.addEventListener(`click`,m);let h=e=>{e.key===`Enter`&&m()};e?.addEventListener(`keydown`,h),t?.addEventListener(`keydown`,h),n?.addEventListener(`keydown`,h),r?.addEventListener(`keydown`,h),o?.addEventListener(`click`,e=>{e.preventDefault();let t=f(),n=t?Ri(t):Ii.searchBase;i().open(n,`_blank`,`noopener`)})}async executeSearch(e,t){try{O.show(E(`searchingKeyword`,{keyword:e}),`info`);let n=await this.searcher.search(e),r=n;if(t){let e=Qf.filterOfficialVideos(n,t);e.length>0?(r=e,sm.info(`SettingsUI.executeSearch:officialFiltered`,{totalResults:n.length,officialResults:e.length,animeTitle:t})):(sm.warn(`SettingsUI.executeSearch:noOfficialVideos`,{totalResults:n.length,animeTitle:t}),O.show(D(`officialVideoMissing`),`warning`))}return this.renderSearchResults(r,e=>this.renderSearchResultItem(e)),r.length===0&&O.show(D(`searchNoResults`),`warning`),r}catch(e){return sm.error(`SettingsUI.executeSearch`,e),[]}}setSearchKeyword(e){let t=this.queryModalElement(Q.searchInput);t&&(t.value=e,t.focus({preventScroll:!0}))}renderSearchResults(e,t){let n=this.queryModalElement(Q.searchResults);n&&(n.innerHTML=e.map(e=>t(e)).join(``),n.querySelectorAll(`.search-result-item`).forEach((t,n)=>{t.addEventListener(`click`,()=>{let t=e[n];this.applySearchResult(t)});let r=t.querySelector(`.open-search-page-direct-btn`);r&&r.addEventListener(`click`,e=>{e.stopPropagation()})}))}renderSearchResultItem(e){let t=this.formatSearchResultDate(e.postedAt),n=typeof e.similarity==`number`?`
          <div class="similarity-container" title="${E(`similarity`,{score:e.similarity.toFixed(2)})}">
            <div class="similarity-bar" style="width: ${e.similarity.toFixed(2)}%;"></div>
            <span class="similarity-text">${e.similarity.toFixed(0)}%</span>
          </div>
        `:``;return`
      <div class="search-result-item">
        <img src="${e.thumbnail}" alt="thumbnail">
        <div class="search-result-info">
          <div class="title">${e.title}</div>
          <div class="stats">
            <span class="stat-icon" title="${D(`viewCount`)}">
              ${Wp}
            </span>
            <span>${e.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="${D(`commentCount`)}">
              ${nm}
            </span>
            <span>${e.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="${D(`mylistCount`)}">
              ${rm}
            </span>
            <span>${e.mylistCount.toLocaleString()}</span>
            ${n}
          </div>
          <div class="date">${t}</div>
          <a href="${Ii.watchBase}/${e.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
          </a>
        </div>
      </div>
    `}async applySearchResult(e){try{let t=await this.fetcher.fetchApiData(e.videoId);await this.fetcher.fetchComments(),O.show(E(`commentsSet`,{title:e.title}),`success`),this.updateCurrentVideoInfo(this.buildVideoMetadata(e,t))}catch(e){sm.error(`SettingsUI.applySearchResult`,e)}}buildVideoMetadata(e,t){return{videoId:e.videoId,title:e.title,viewCount:t.video?.count?.view??e.viewCount,commentCount:t.video?.count?.comment??e.commentCount,mylistCount:t.video?.count?.mylist??e.mylistCount,postedAt:t.video?.registeredAt??e.postedAt,thumbnail:t.video?.thumbnail?.url??e.thumbnail,owner:t.owner??e.owner??void 0,channel:t.channel??e.channel??void 0}}applySettingsToUI(){let e=this.queryModalElement(Q.ngWords),t=this.queryModalElement(Q.ngRegexps);e&&(e.value=(this.settings.ngWords??[]).join(`
`)),t&&(t.value=(this.settings.ngRegexps??[]).join(`
`)),this.updateAutoSearchToggleState(),this.updateSearchSectionNote()}saveSettings(){let e=this.queryModalElement(Q.ngWords),t=this.queryModalElement(Q.ngRegexps);e&&(this.settings.ngWords=e.value.split(`
`).map(e=>e.trim()).filter(Boolean)),t&&(this.settings.ngRegexps=t.value.split(`
`).map(e=>e.trim()).filter(Boolean)),this.settingsManager.updateSettings(this.settings),O.show(D(`settingsSaved`),`success`)}updateCurrentVideoInfo(e){this.currentVideoInfo=e,[[`currentTitle`,e.title??`-`],[`currentVideoId`,e.videoId??`-`],[`currentOwner`,e.owner?.nickname??e.channel?.name??`-`],[`currentViewCount`,this.formatNumber(e.viewCount)],[`currentCommentCount`,this.formatNumber(e.commentCount)],[`currentMylistCount`,this.formatNumber(e.mylistCount)],[`currentPostedAt`,this.formatSearchResultDate(e.postedAt)]].forEach(([e,t])=>{let n=this.querySelector(Q[e]);n&&(n.textContent=t)});let t=this.querySelector(Q.currentThumbnail);t&&e.thumbnail&&(t.src=e.thumbnail,t.alt=e.title??D(`thumbnail`));let n=this.querySelector(`#currentVideoAmbient`);n&&e.thumbnail&&(n.style.backgroundImage=`url('${e.thumbnail}')`);let r=this.querySelector(`.video-card`);r&&r.classList.toggle(`video-card--empty`,!e.videoId);try{this.settingsManager.saveVideoData(e.title??``,e)}catch(e){sm.error(`SettingsUI.updateCurrentVideoInfo`,e)}}formatNumber(e){return typeof e==`number`?e.toLocaleString():`-`}formatSearchResultDate(e){if(!e)return`-`;let t=new Date(e);return Number.isNaN(t.getTime())?e:new Intl.DateTimeFormat(`ja-JP`,{year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,hourCycle:`h23`}).format(t)}destroy(){this.hideFabTooltip(),this.fabTooltipEl=null,this.closeButtonElement?.removeEventListener(`click`,this.handleCloseClick),this.overlayElement?.removeEventListener(`click`,this.handleOverlayClick),this.closeButtonElement=null,this.overlayElement=null,this.modalElement=null,this.removeFabElement(),super.destroy()}createOrUpdateFab(){if(!document.body)return null;let t=this.fabHostElement;!t||!t.isConnected?(t?.remove(),t=document.createElement(`div`),t.id=e.FAB_HOST_ID,t.style.position=`fixed`,t.style.bottom=`32px`,t.style.right=`32px`,t.style.zIndex=`2147483646`,t.style.display=`inline-block`,this.fabShadowRoot=t.attachShadow({mode:`open`}),document.body.appendChild(t),this.fabHostElement=t):this.fabShadowRoot||=t.shadowRoot??t.attachShadow({mode:`open`});let n=this.fabShadowRoot;if(!n)return null;let r=n.querySelector(`style[data-role='fab-base-style']`);r||(r=document.createElement(`style`),r.dataset.role=`fab-base-style`,r.textContent=ji.getCommonStyles(),n.appendChild(r));let i=n.querySelector(`style[data-role='fab-style']`);i||(i=document.createElement(`style`),i.dataset.role=`fab-style`,i.textContent=`
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
      `,n.appendChild(i));let a=n.querySelector(`style[data-role='similarity-style']`);a||(a=document.createElement(`style`),a.dataset.role=`similarity-style`,a.textContent=lm,n.appendChild(a));let o=n.querySelector(`style[data-role='search-fields-style']`);o||(o=document.createElement(`style`),o.dataset.role=`search-fields-style`,o.textContent=um,n.appendChild(o));let s=n.querySelector(`.fab-container`);s||(s=document.createElement(`div`),s.className=`fab-container`,n.appendChild(s));let c=s.querySelector(`button.fab-button`);c||(c=document.createElement(`button`),c.type=`button`,c.className=`fab-button`,s.appendChild(c)),c.innerHTML=`
      <span class="fab-button__icon" aria-hidden="true">${Jp}</span>
      <span class="fab-button__label">${D(`settings`)}</span>
    `,c.setAttribute(`aria-label`,D(`settingsFabLabel`)),c.setAttribute(`aria-haspopup`,`dialog`);let l=s.querySelector(Q.settingsModal);return l||=(s.insertAdjacentHTML(`beforeend`,this.buildModalHtml()),s.querySelector(Q.settingsModal)),this.modalElement=l??null,c}removeFabElement(){this.fabElement&&this.fabElement.removeEventListener(`click`,this.handleFabClick),this.fabHostElement?.isConnected&&this.fabHostElement.remove(),this.fabElement=null,this.fabHostElement=null,this.fabShadowRoot=null,this.fabTooltipEl=null}queryModalElement(e){return this.fabShadowRoot?this.fabShadowRoot.querySelector(e):null}queryModalSelectorAll(e){return this.fabShadowRoot?this.fabShadowRoot.querySelectorAll(e):document.createDocumentFragment().childNodes}},fm=r(`dAnime:PlaybackRateController`),pm=1,mm=200,hm=1e-4,gm=class{settingsManager;currentVideo=null;playbackSettings;settingsObserver;isApplying=!1;retryTimer=null;handleLoadedMetadata=()=>{this.applyCurrentMode()};handleRateChange=()=>{this.isApplying||this.playbackSettings.fixedModeEnabled&&this.scheduleApply()};handlePlay=()=>{this.applyCurrentMode()};handleEmptied=()=>{this.scheduleApply()};constructor(e){this.settingsManager=e,this.playbackSettings=this.settingsManager.getPlaybackSettings(),this.settingsObserver=e=>{this.playbackSettings=e,this.applyCurrentMode()},this.settingsManager.addPlaybackObserver(this.settingsObserver)}bind(e){this.currentVideo===e||(this.detachVideoListeners(),this.cancelScheduledApply(),this.currentVideo=e,this.attachVideoListeners(e)),this.applyCurrentMode()}unbind(){this.cancelScheduledApply(),this.detachVideoListeners(),this.currentVideo=null}dispose(){this.unbind(),this.settingsManager.removePlaybackObserver(this.settingsObserver)}attachVideoListeners(e){e.addEventListener(`loadedmetadata`,this.handleLoadedMetadata),e.addEventListener(`ratechange`,this.handleRateChange),e.addEventListener(`play`,this.handlePlay),e.addEventListener(`emptied`,this.handleEmptied)}detachVideoListeners(){this.currentVideo&&(this.currentVideo.removeEventListener(`loadedmetadata`,this.handleLoadedMetadata),this.currentVideo.removeEventListener(`ratechange`,this.handleRateChange),this.currentVideo.removeEventListener(`play`,this.handlePlay),this.currentVideo.removeEventListener(`emptied`,this.handleEmptied))}applyCurrentMode(){let e=this.currentVideo;e&&(this.playbackSettings.fixedModeEnabled?this.setPlaybackRate(e,this.playbackSettings.fixedRate):this.setPlaybackRate(e,pm))}setPlaybackRate(e,t){if(!(!Number.isFinite(t)||t<=0)&&!(Math.abs(e.playbackRate-t)<=hm)){this.isApplying=!0;try{e.playbackRate=t}catch(e){fm.warn(`再生速度の設定に失敗しました`,e),this.scheduleApply()}finally{window.setTimeout(()=>{this.isApplying=!1},0)}}}scheduleApply(){this.cancelScheduledApply(),this.retryTimer=window.setTimeout(()=>{this.retryTimer=null,this.applyCurrentMode()},mm)}cancelScheduledApply(){this.retryTimer!==null&&(window.clearTimeout(this.retryTimer),this.retryTimer=null)}},_m=async()=>{},vm=()=>{let e=i();if(!e.dAniRenderer){let t={};e.dAniRenderer={classes:{Comment:Lt,CommentRenderer:Ei,NicoApiFetcher:Yf,NotificationManager:O,StyleManager:pp,SettingsUI:dm,NicoVideoSearcher:Qf,VideoSwitchHandler:dp,SettingsManager:vi,KeyboardShortcutHandler:Si,DebounceExecutor:$f,ShadowDOMComponent:Di,ShadowStyleManager:ji,PlaybackRateController:gm},instances:t,utils:{initialize:_m,initializeWithVideo:_m},debug:{showState:()=>{console.log(`Current instances:`,t)},showSettings:()=>{let e=t.settingsManager;e?console.log(`Current settings:`,e.getSettings()):console.log(`SettingsManager not initialized`)},showComments:()=>{let e=t.renderer;e?console.log(`Current comments:`,e.getCommentsSnapshot()):console.log(`CommentRenderer not initialized`)}},defaultSettings:qr}}return e.dAniRenderer},ym=r(`dAnime:PlayerControlButton`),bm=`danime-pcb-host`,xm=100,Sm=150,Cm=class{settingsManager;btnWrapper=null;panelShadowRoot=null;isOpen=!1;mountRetryTimer=null;mouseHideTimer=null;settingsObserver=null;playbackObserver=null;constructor(e){this.settingsManager=e}mount(){if(document.getElementById(bm))return;let e=document.querySelector(J.watchSettingButton);e?(this.injectButton(e),ym.info(`playerControlButton:mounted`)):this.mountRetryTimer=window.setTimeout(()=>{this.mount()},xm)}destroy(){this.mountRetryTimer!==null&&(window.clearTimeout(this.mountRetryTimer),this.mountRetryTimer=null),this.cancelHideTimer(),this.settingsObserver&&=(this.settingsManager.removeObserver(this.settingsObserver),null),this.playbackObserver&&=(this.settingsManager.removePlaybackObserver(this.playbackObserver),null),this.closePanel(),this.btnWrapper?.remove(),this.btnWrapper=null,this.panelShadowRoot=null,ym.info(`playerControlButton:destroyed`)}injectButton(e){let t=document.createElement(`div`);t.id=bm,t.className=`mainButton`,t.style.cssText=`position:relative;z-index:500;cursor:pointer`;let n=document.createElement(`button`);n.type=`button`,n.title=D(`commentSettings`),n.setAttribute(`aria-label`,D(`commentSettingsPanel`)),n.setAttribute(`aria-expanded`,`false`),n.style.cssText=`width:100%;height:100%;background:transparent;border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;color:#ffffff`,n.innerHTML=Kp;let r=document.createElement(`div`),i=r.attachShadow({mode:`open`});this.panelShadowRoot=i,t.appendChild(n),t.appendChild(r),e.insertAdjacentElement(`beforebegin`,t),this.btnWrapper=t,this.buildPanel(i),t.addEventListener(`mouseenter`,()=>{this.cancelHideTimer(),this.openPanel()}),t.addEventListener(`mouseleave`,()=>{this.scheduleHide()}),this.registerObservers()}buildPanel(e){let t=this.settingsManager.getSettings(),n=this.settingsManager.getPlaybackSettings(),r=document.createElement(`style`);r.textContent=this.getPanelCSS(),e.appendChild(r);let i=document.createElement(`div`);i.className=`panel`,i.setAttribute(`hidden`,``),i.setAttribute(`role`,`dialog`),i.setAttribute(`aria-label`,D(`commentSettings`)),i.innerHTML=this.buildPanelHTML(t,n),e.appendChild(i),i.addEventListener(`mouseenter`,()=>{this.cancelHideTimer()}),i.addEventListener(`mouseleave`,()=>{this.scheduleHide()}),this.bindPanelEvents(e)}getPanelCSS(){return`
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
    `}buildPanelHTML(e,t){let n=e.isCommentVisible?Jp:qp,r=Math.round((e.commentOpacity??1)*100),i=t.fixedRate.toFixed(2),a=t.fixedModeEnabled?``:`disabled`;return`
      <p class="panel__title">${D(`commentSettings`)}</p>

      <div class="row">
        <span class="row__label">
          <span id="pcb-vis-icon">${n}</span>${D(`commentVisibility`)}
        </span>
        <label class="toggle" aria-label="${D(`commentVisibilityToggle`)}">
          <input type="checkbox" id="pcb-visibility" ${e.isCommentVisible?`checked`:``}>
          <span class="toggle__track"></span>
          <span class="toggle__thumb"></span>
        </label>
      </div>

      <div class="row">
        <span class="row__label">${D(`color`)}</span>
        <input type="color" id="pcb-color" class="color-picker"
               value="${e.commentColor}" title="${D(`commentColor`)}">
      </div>

      <div class="row row--stacked">
        <span class="row__label">${D(`commentOpacity`)}</span>
        <div class="slider-wrap">
          <input type="range" id="pcb-opacity" class="slider"
                 min="0.1" max="1" step="0.05" value="${e.commentOpacity??1}">
          <span class="slider__value" id="pcb-opacity-val">${r}%</span>
        </div>
      </div>

      <p class="section-title">${D(`playbackRate`)}</p>

      <div class="row">
        <span class="row__label">${D(`fixedPlaybackRate`)}</span>
        <label class="toggle" aria-label="${D(`playbackRateFixedToggle`)}">
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
    `}bindPanelEvents(e){let t=e.getElementById(`pcb-visibility`);t?.addEventListener(`change`,()=>{let n=e.getElementById(`pcb-vis-icon`);n&&(n.innerHTML=t.checked?Jp:qp),this.settingsManager.updateSettings({isCommentVisible:t.checked})});let n=e.getElementById(`pcb-color`);n?.addEventListener(`input`,()=>{this.settingsManager.updateSettings({commentColor:n.value})});let r=e.getElementById(`pcb-opacity`),i=e.getElementById(`pcb-opacity-val`);r?.addEventListener(`input`,()=>{let e=parseFloat(r.value);i&&(i.textContent=`${Math.round(e*100)}%`),this.settingsManager.updateSettings({commentOpacity:e})});let a=e.getElementById(`pcb-speed-mode`),o=e.getElementById(`pcb-speed-range`),s=e.getElementById(`pcb-speed-val`);a?.addEventListener(`change`,()=>{o&&(o.disabled=!a.checked),this.settingsManager.updatePlaybackSettings({fixedModeEnabled:a.checked})}),o?.addEventListener(`input`,()=>{let e=parseFloat(o.value);s&&(s.textContent=`${e.toFixed(2)}×`),this.settingsManager.updatePlaybackSettings({fixedRate:e})})}openPanel(){if(this.isOpen)return;let e=this.panelShadowRoot?.querySelector(`.panel`),t=this.btnWrapper?.querySelector(`button`);e&&(e.removeAttribute(`hidden`),t?.setAttribute(`aria-expanded`,`true`),this.isOpen=!0)}closePanel(){let e=this.panelShadowRoot?.querySelector(`.panel`),t=this.btnWrapper?.querySelector(`button`);e?.setAttribute(`hidden`,``),t?.setAttribute(`aria-expanded`,`false`),this.isOpen=!1}scheduleHide(){this.cancelHideTimer(),this.mouseHideTimer=window.setTimeout(()=>{this.closePanel()},Sm)}cancelHideTimer(){this.mouseHideTimer!==null&&(window.clearTimeout(this.mouseHideTimer),this.mouseHideTimer=null)}registerObservers(){this.settingsObserver=e=>{this.syncSettingsToPanel(e)},this.settingsManager.addObserver(this.settingsObserver),this.playbackObserver=e=>{this.syncPlaybackToPanel(e)},this.settingsManager.addPlaybackObserver(this.playbackObserver)}syncSettingsToPanel(e){let t=this.panelShadowRoot;if(!t)return;let n=t.getElementById(`pcb-visibility`);n&&(n.checked=e.isCommentVisible);let r=t.getElementById(`pcb-vis-icon`);r&&(r.innerHTML=e.isCommentVisible?Jp:qp);let i=t.getElementById(`pcb-color`);i&&(i.value=e.commentColor);let a=t.getElementById(`pcb-opacity`),o=t.getElementById(`pcb-opacity-val`);a&&(a.value=String(e.commentOpacity??1)),o&&(o.textContent=`${Math.round((e.commentOpacity??1)*100)}%`)}syncPlaybackToPanel(e){let t=this.panelShadowRoot;if(!t)return;let n=t.getElementById(`pcb-speed-mode`);n&&(n.checked=e.fixedModeEnabled);let r=t.getElementById(`pcb-speed-range`);r&&(r.disabled=!e.fixedModeEnabled,r.value=e.fixedRate.toFixed(2));let i=t.getElementById(`pcb-speed-val`);i&&(i.textContent=`${e.fixedRate.toFixed(2)}×`)}},wm=e=>e.autoSearchEnabled?`auto`:`manual`,Tm=100,Em=1e3,Dm=3e3,Om=2e3,km=`cachedAnimeTitle`,$=r(`dAnime:WatchPageController`),Am=class{global;initialized=!1;switchDebounce=new $f(Em);switchCallback=null;lastSwitchTimestamp=0;currentVideoElement=null;videoMutationObserver=null;domMutationObserver=null;videoEndedListener=null;playbackRateController=null;playerControlButton=null;lastPartId=null;partIdMonitorIntervalId=null;isPartIdChanging=!1;cachedAnimeTitle=null;lastEpisodeNumber=null;rendererSettingsObserver=null;constructor(e){this.global=e;try{this.cachedAnimeTitle=Xr(km,null),this.cachedAnimeTitle&&$.info(`watchPageController:constructor:loadedCachedTitle`,{cachedAnimeTitle:this.cachedAnimeTitle})}catch(e){$.error(`watchPageController:constructor:loadCacheFailed`,e),this.cachedAnimeTitle=null}}async initialize(){await this.ensureDocumentReady(),this.waitForVideoElement()}async ensureDocumentReady(){document.readyState!==`complete`&&await new Promise(e=>{window.addEventListener(`load`,()=>e(),{once:!0})})}waitForVideoElement(){if(this.initialized)return;let e=document.querySelector(J.watchVideoElement);e?e.readyState===0?e.addEventListener(`loadedmetadata`,()=>{this.initializeWithVideo(e)},{once:!0}):this.initializeWithVideo(e):window.setTimeout(()=>this.waitForVideoElement(),Tm)}async initializeWithVideo(e){if(!this.initialized){this.initialized=!0;try{O.show(D(`initializingCommentLoader`));let t=O.getInstance(),n=this.global.settingsManager??new vi(t);this.global.settingsManager=n,this.global.instances.settingsManager=n,this.playerControlButton||(this.playerControlButton=new Cm(n),this.playerControlButton.mount());let r=n.loadSettings();if(wm(r)===`manual`){$.info(`watchPageController:initializeWithVideo:manualMode`,{autoSearchEnabled:r.autoSearchEnabled});let t=n.loadVideoData();if(!t?.videoId){O.show(D(`manualModeSelectVideo`),`info`);return}$.info(`watchPageController:initializeWithVideo:manualMode:loadSavedVideo`,{videoId:t.videoId,title:t.title}),await this.loadCommentsFromSavedVideo(e,n,t);return}if(await this.waitForMetadataElements(),!await this.autoSetupComments(n))throw Error(D(`metadataAutoFetchFailed`));let i=n.loadVideoData();if(!i?.videoId)throw Error(D(`videoDataMissing`));let a=new Yf;this.global.instances.fetcher=a,await a.fetchApiData(i.videoId);let o=await a.fetchComments(),s=new Ei(this.mergeSettings(n.loadSettings()));s.initialize(e),this.global.instances.renderer=s,this.currentVideoElement=e;let c=this.playbackRateController??new gm(n);this.playbackRateController=c,this.global.instances.playbackRateController=c,c.bind(e),this.ensureRendererSettingsObserver(n),this.applyRendererSettings(n.loadSettings()),o.forEach(e=>{s.addComment(e.text,e.vposMs,e.commands)});let l=new dp(s,a,n);l.startMonitoring(),this.global.instances.switchHandler=l,this.setupSwitchHandling(e,l),this.observeVideoElement(),this.startPartIdMonitoring(),O.show(E(`commentsLoadComplete`,{count:String(o.length)}),`success`)}catch(e){throw this.initialized=!1,O.show(E(`initializationError`,{message:e.message}),`error`),e}}}mergeSettings(e){let t=qr();return{...t,...e,ngWords:[...e.ngWords??t.ngWords],ngRegexps:[...e.ngRegexps??t.ngRegexps]}}ensureRendererSettingsObserver(e){this.rendererSettingsObserver||(this.rendererSettingsObserver=e=>{this.applyRendererSettings(e)},e.addObserver(this.rendererSettingsObserver))}applyRendererSettings(e){let t=this.global.instances.renderer;if(!t)return;let n=this.mergeSettings(e);t.settings.isCommentVisible!==n.isCommentVisible&&t.setCommentVisibility(n.isCommentVisible),t.settings=n}setupSwitchHandling(e,t){this.currentVideoElement=e,this.switchCallback=()=>{if(this.isPartIdChanging){$.info(`watchPageController:switchBlocked`,{reason:`partId change in progress`});return}let e=Date.now();if(e-this.lastSwitchTimestamp<Dm){$.debug(`watchPageController:switchCooldown`,{timeSinceLastSwitch:e-this.lastSwitchTimestamp,cooldownMs:Dm});return}this.lastSwitchTimestamp=e;let n=this.currentVideoElement;$.info(`watchPageController:switchHandlerTriggered`,{currentTime:n?.currentTime??null,duration:n?.duration??null}),t.onVideoSwitch(n)},this.global.utils.initializeWithVideo=async e=>{e&&(this.rebindVideoElement(e),this.playbackRateController?.bind(e),await t.onVideoSwitch(e))},this.currentVideoElement=e}observeVideoElement(){let e=this.currentVideoElement;e&&(this.domMutationObserver?.disconnect(),this.domMutationObserver=new MutationObserver(()=>{let e=document.querySelector(J.watchVideoElement);e&&e!==this.currentVideoElement&&this.rebindVideoElement(e)}),this.domMutationObserver.observe(document.body,{childList:!0,subtree:!0}),this.attachVideoEventListeners(e))}rebindVideoElement(e){this.detachVideoEventListeners(),this.currentVideoElement=e;let t=this.global.instances.renderer,n=this.global.instances.switchHandler;t&&(t.clearComments(),t.destroy(),t.initialize(e),t.resize()),this.playbackRateController?.bind(e),n&&(n.onVideoSwitch(e),this.setupSwitchHandling(e,n)),this.attachVideoEventListeners(e)}attachVideoEventListeners(e){this.detachVideoEventListeners(),np().attach(e);let t=t=>{if(!this.switchCallback)return;let n=t.type,r=this.hasVideoSourceChanged(e);n===`ended`?$.info(`watchPageController:skipSwitchOnEnded`,{eventType:n,currentTime:e.currentTime,duration:e.duration,ended:e.ended,paused:e.paused,currentSrc:e.currentSrc||e.getAttribute(`src`)||null,sourceChanged:r}):($.info(`watchPageController:eventTriggered`,{eventType:n,currentTime:e.currentTime,duration:e.duration,ended:e.ended,paused:e.paused,sourceChanged:r}),this.switchDebounce.resetExecution(this.switchCallback),this.switchDebounce.execOnce(this.switchCallback))};e.addEventListener(`ended`,t),e.addEventListener(`loadedmetadata`,t),e.addEventListener(`emptied`,t),this.videoEndedListener=t}detachVideoEventListeners(){let e=this.currentVideoElement;np().detach(),e&&this.videoEndedListener&&(e.removeEventListener(`ended`,this.videoEndedListener),e.removeEventListener(`loadedmetadata`,this.videoEndedListener),e.removeEventListener(`emptied`,this.videoEndedListener)),this.videoEndedListener=null}hasVideoSourceChanged(e){let t=e.currentSrc||e.getAttribute(`src`)||e.querySelector(`source[src]`)?.getAttribute(`src`)||null,n=this.global.instances.renderer?.getCurrentVideoSource()??null;return t?!n||n!==t:!1}async waitForMetadataElements(e,t){let n=Date.now();for(let r=0;r<50;r++){let i=this.getCurrentPartId(),a=document.querySelector(J.watchPageAnimeTitle),o=document.querySelector(J.watchPageEpisodeNumber),s=document.querySelector(J.watchPageEpisodeTitle),c=a?.textContent?.trim()??``,l=o?.textContent?.trim()??``,u=s?.textContent?.trim()??``;if(r===0&&$.info(`watchPageController:waitForMetadata:start`,{currentPartId:i,expectedPartId:e,episodeNumber:l,episodeTitle:u,animeTitle:c||`(empty)`,cachedAnimeTitle:this.cachedAnimeTitle||`(empty)`,previousEpisodeNumber:t||`(none)`}),!e&&!this.cachedAnimeTitle&&r<20&&!c)await new Promise(e=>window.setTimeout(e,100));else{if((!e||i===e)&&l&&u&&(!t||l!==t)){$.info(`watchPageController:waitForMetadata:success`,{attempts:r+1,waited:Date.now()-n,currentPartId:i,expectedPartId:e,episodeNumber:l,episodeTitle:u,animeTitle:c||`(empty)`,previousEpisodeNumber:t||`(none)`});return}await new Promise(e=>window.setTimeout(e,100))}}let r=document.querySelector(J.watchPageEpisodeNumber)?.textContent?.trim()??``,i=document.querySelector(J.watchPageEpisodeTitle)?.textContent?.trim()??``;throw $.error(`watchPageController:waitForMetadata:timeout`,{maxRetries:50,waited:Date.now()-n,currentPartId:this.getCurrentPartId(),expectedPartId:e,previousEpisodeNumber:t||`(none)`,finalEpisodeNumber:r,finalEpisodeTitle:i}),Error(`DOM更新のタイムアウト: partId=${e}, 前回エピソード="${t||`なし`}", 現在エピソード="${r}"`)}extractMetadataFromPage(){try{let e=document.querySelector(J.watchPageAnimeTitle),t=document.querySelector(J.watchPageEpisodeNumber),n=document.querySelector(J.watchPageEpisodeTitle),r=e?.textContent?.trim()??``,i=t?.textContent?.trim()??``,a=n?.textContent?.trim()??``;if(r){this.cachedAnimeTitle=r;try{Zr(km,r),$.info(`watchPageController:extractMetadata:cachedTitle`,{animeTitle:r})}catch(e){$.error(`watchPageController:extractMetadata:saveCacheFailed`,e)}}else this.cachedAnimeTitle&&(r=this.cachedAnimeTitle,$.info(`watchPageController:extractMetadata:usedCachedTitle`,{cachedAnimeTitle:this.cachedAnimeTitle}));return $.info(`watchPageController:extractMetadata:rawValues`,{animeTitle:r||`(empty)`,animeTitleElementExists:!!e,animeTitleFromCache:!e&&!!this.cachedAnimeTitle,episodeNumber:i,episodeNumberElementExists:!!t,episodeTitle:a,episodeTitleElementExists:!!n,currentPartId:this.getCurrentPartId()}),i?(r||$.warn(`watchPageController:extractMetadata:noAnimeTitle`,{hasCache:!!this.cachedAnimeTitle}),this.lastEpisodeNumber=i,{animeTitle:r,episodeNumber:i,episodeTitle:a}):($.warn(`watchPageController:extractMetadata:insufficient`,{episodeNumber:i||`(empty)`,episodeTitle:a||`(empty)`}),null)}catch(e){return $.error(`watchPageController:extractMetadata:error`,e),null}}async autoSetupComments(e){try{let t=this.extractMetadataFromPage();if(!t)return $.warn(`watchPageController:autoSetup:noMetadata`),!1;if(!t.animeTitle)return $.warn(`watchPageController:autoSetup:noAnimeTitle`,{episodeNumber:t.episodeNumber,episodeTitle:t.episodeTitle,cachedAnimeTitle:this.cachedAnimeTitle}),O.show(D(`noAnimeTitle`),`warning`),!1;let n=[t.animeTitle,t.episodeNumber,t.episodeTitle].filter(Boolean).join(` `);$.info(`watchPageController:autoSetup`,{keyword:n,animeTitle:t.animeTitle,episodeNumber:t.episodeNumber,episodeTitle:t.episodeTitle,usingCachedTitle:!!this.cachedAnimeTitle&&!t.animeTitle}),O.show(E(`searchingKeyword`,{keyword:n}),`info`);let r=await new Qf().search(n);if(r.length===0)return O.show(D(`niconicoNotFound`),`warning`),!1;let i=Qf.filterOfficialVideos(r,t.animeTitle);$.info(`watchPageController:autoSetup:officialFilter`,{totalResults:r.length,officialResults:i.length,animeTitle:t.animeTitle}),i.length===0&&($.warn(`watchPageController:autoSetup:noOfficialVideos`,{animeTitle:t.animeTitle,firstResultOwner:r[0]?.owner?.nickname??r[0]?.channel?.name??`不明`}),O.show(D(`officialVideoMissingUseFirst`),`warning`));let a=i.length>0?i[0]:r[0],o={videoId:a.videoId,title:a.title,viewCount:a.viewCount,commentCount:a.commentCount,mylistCount:a.mylistCount,postedAt:a.postedAt,thumbnail:a.thumbnail,owner:a.owner??null,channel:a.channel??null};if(e.saveVideoData(a.title,o)){$.info(`watchPageController:autoSetup:success`,{videoId:a.videoId,title:a.title,commentCount:a.commentCount});let e=a.owner?.nickname||a.channel?.name||`不明`,t=[`<div style="font-weight: 600; margin-bottom: 8px;">${D(`autoSetupComplete`)}</div>`,`<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">`,`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Xp}</span>`,`  <span style="flex: 1; word-break: break-word;">${a.title}</span>`,`</div>`,`<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">`,`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Zp}</span>`,`  <span>${e}</span>`,`</div>`,`<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">`,`  <div style="display: flex; align-items: center; gap: 4px;">`,`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Qp}</span>`,`    <span>${a.viewCount.toLocaleString()}</span>`,`  </div>`,`  <div style="display: flex; align-items: center; gap: 4px;">`,`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${$p}</span>`,`    <span>${a.commentCount.toLocaleString()}</span>`,`  </div>`,`</div>`].join(``);return O.show(t,`success`,5e3),!0}return!1}catch(e){return $.error(`watchPageController:autoSetup:error`,e),O.show(E(`autoSetupError`,{message:e.message}),`error`),!1}}getCurrentPartId(){try{return new URLSearchParams(window.location.search).get(`partId`)}catch(e){return $.error(`watchPageController:getCurrentPartId:error`,e),null}}startPartIdMonitoring(){this.stopPartIdMonitoring(),this.lastPartId=this.getCurrentPartId(),this.partIdMonitorIntervalId=window.setInterval(()=>{this.checkPartIdChange()},Om)}stopPartIdMonitoring(){this.partIdMonitorIntervalId!==null&&(window.clearInterval(this.partIdMonitorIntervalId),this.partIdMonitorIntervalId=null)}async checkPartIdChange(){let e=this.getCurrentPartId();e!==null&&e!==this.lastPartId&&($.warn(`watchPageController:partIdChanged`,{oldPartId:this.lastPartId,newPartId:e,url:window.location.href,timestamp:new Date().toISOString()}),this.lastPartId=e,await this.onPartIdChanged())}async waitForVideoReady(e){let t=Date.now();for($.info(`watchPageController:waitForVideoReady:start`,{readyState:e.readyState,duration:e.duration,src:e.currentSrc});e.readyState<2&&Date.now()-t<5e3;)await new Promise(e=>window.setTimeout(e,100));$.info(`watchPageController:waitForVideoReady:complete`,{readyState:e.readyState,duration:e.duration,waited:Date.now()-t})}async onPartIdChanged(){this.isPartIdChanging=!0;try{let e=this.global.settingsManager;if(!e){$.warn(`watchPageController:onPartIdChanged:noSettingsManager`);return}let t=e.getSettings(),n=this.lastEpisodeNumber??document.querySelector(J.watchPageEpisodeNumber)?.textContent?.trim()??null;if(wm(t)===`manual`){$.info(`watchPageController:onPartIdChanged:manualMode`,{autoSearchEnabled:t.autoSearchEnabled});let r=e.loadManualSearchSettings();if(!r?.animeTitle){O.show(D(`manualModeSelectAnimeTitle`),`info`);let e=this.global.instances.renderer;e&&e.clearComments();return}await this.handleManualModeEpisodeSwitch(e,r.animeTitle,n);return}$.info(`watchPageController:onPartIdChanged:start`,{currentVideoElement:this.currentVideoElement?`present`:`null`,rendererExists:!!this.global.instances.renderer,switchHandlerExists:!!this.global.instances.switchHandler,isPartIdChanging:this.isPartIdChanging,newPartId:this.getCurrentPartId(),previousEpisodeNumber:n}),O.show(D(`episodeChangeDetected`),`info`);let r=this.getCurrentPartId();$.info(`watchPageController:onPartIdChanged:waitingForDomUpdate`,{newPartId:r,previousEpisodeNumber:n});try{await this.waitForMetadataElements(r??void 0,n??void 0)}catch(e){$.error(`watchPageController:onPartIdChanged:waitMetadataFailed`,e),O.show(E(`domUpdateWaitFailed`,{message:e.message}),`error`);return}let i=await this.autoSetupComments(e);if($.info(`watchPageController:onPartIdChanged:autoSetup`,{success:i}),i){let t=e.loadVideoData();$.warn(`watchPageController:onPartIdChanged:loadedVideoData`,{videoId:t?.videoId??null,title:t?.title??null});let n=this.currentVideoElement??document.querySelector(J.watchVideoElement);if($.warn(`watchPageController:onPartIdChanged:videoElement`,{videoElementFound:!!n,currentTime:n?.currentTime??null,duration:n?.duration??null,src:n?.currentSrc??null,readyState:n?.readyState??null}),n&&t?.videoId){await this.waitForVideoReady(n),n.dataset.videoId=t.videoId;let e=this.global.instances.renderer,r=this.global.instances.switchHandler;if($.warn(`watchPageController:onPartIdChanged:beforeSwitch`,{rendererCommentCount:e?.getCommentsSnapshot().length??0,videoCurrentTime:n.currentTime,videoReadyState:n.readyState,videoSrc:n.currentSrc,videoId:t.videoId}),e&&r){$.warn(`watchPageController:onPartIdChanged:destroyBefore`,{commentsBeforeDestroy:e.getCommentsSnapshot().length,currentVideoSrc:e.getCurrentVideoSource(),videoElement:e.getVideoElement()?`attached`:`detached`});let t=e.settings;e.destroy(),$.warn(`watchPageController:onPartIdChanged:createNew`,{savedSettings:t});let i=new Ei(t,{loggerNamespace:`dAnime:CommentRenderer`});this.global.instances.renderer=i,$.warn(`watchPageController:onPartIdChanged:reinitialize`,{videoElementSrc:n.currentSrc,videoElementReadyState:n.readyState,videoElementCurrentTime:n.currentTime}),i.initialize(n),$.warn(`watchPageController:onPartIdChanged:reinitializeComplete`,{commentsAfterReinitialize:i.getCommentsSnapshot().length,newVideoSrc:i.getCurrentVideoSource()}),r.updateRenderer(i),r.resetVideoSource(),await r.onVideoSwitch(n),$.warn(`watchPageController:onPartIdChanged:afterSwitch`,{rendererCommentCount:i.getCommentsSnapshot().length,videoCurrentTime:n.currentTime,finalVideoSrc:i.getCurrentVideoSource()})}}}$.info(`watchPageController:onPartIdChanged:complete`)}catch(e){$.error(`watchPageController:onPartIdChanged:error`,e),O.show(E(`episodeSwitchError`,{message:e.message}),`error`)}finally{this.isPartIdChanging=!1,$.info(`watchPageController:onPartIdChanged:flagReset`,{isPartIdChanging:this.isPartIdChanging})}}async loadCommentsFromSavedVideo(e,t,n){try{let r=new Yf;this.global.instances.fetcher=r,await r.fetchApiData(n.videoId);let i=await r.fetchComments(),a=new Ei(this.mergeSettings(t.loadSettings()));a.initialize(e),this.global.instances.renderer=a,this.currentVideoElement=e;let o=this.playbackRateController??new gm(t);this.playbackRateController=o,this.global.instances.playbackRateController=o,o.bind(e),this.ensureRendererSettingsObserver(t),this.applyRendererSettings(t.loadSettings()),i.forEach(e=>{a.addComment(e.text,e.vposMs,e.commands)});let s=new dp(a,r,t);s.startMonitoring(),this.global.instances.switchHandler=s,this.setupSwitchHandling(e,s),this.observeVideoElement(),this.startPartIdMonitoring(),O.show(E(`manualModeCommentsLoadComplete`,{count:String(i.length),title:n.title}),`success`)}catch(e){$.error(`watchPageController:loadCommentsFromSavedVideo:error`,e),O.show(E(`commentsLoadErrorSelectAnother`,{message:e.message}),`error`)}}async handleManualModeEpisodeSwitch(e,t,n){try{let r=this.getCurrentPartId();$.info(`watchPageController:manualModeSwitch:waitingForDomUpdate`,{newPartId:r,previousEpisodeNumber:n,savedAnimeTitle:t});try{await this.waitForMetadataElements(r??void 0,n??void 0)}catch(e){$.error(`watchPageController:manualModeSwitch:waitMetadataFailed`,e),O.show(E(`domUpdateWaitFailed`,{message:e.message}),`error`);return}let i=document.querySelector(J.watchPageEpisodeNumber)?.textContent?.trim()??``;if(!i){$.warn(`watchPageController:manualModeSwitch:noEpisodeNumber`),O.show(D(`episodeNumberMissing`),`warning`);return}let a=`${t} ${i}`;$.info(`watchPageController:manualModeSwitch:search`,{keyword:a,savedAnimeTitle:t,newEpisodeNumber:i}),O.show(E(`searchingKeyword`,{keyword:a}),`info`);let o=await new Qf().search(a);if(o.length===0){O.show(D(`niconicoNotFoundManual`),`warning`);let e=this.global.instances.renderer;e&&e.clearComments();return}let s=Qf.filterOfficialVideos(o,t);if($.info(`watchPageController:manualModeSwitch:officialFilter`,{totalResults:o.length,officialResults:s.length,savedAnimeTitle:t}),s.length===0){O.show(D(`officialVideoMissingManual`),`warning`);let e=this.global.instances.renderer;e&&e.clearComments();return}let c=s[0],l={videoId:c.videoId,title:c.title,viewCount:c.viewCount,commentCount:c.commentCount,mylistCount:c.mylistCount,postedAt:c.postedAt,thumbnail:c.thumbnail,owner:c.owner??null,channel:c.channel??null};e.saveVideoData(c.title,l),e.saveManualSearchSettings({animeTitle:t,episodeNumber:i,episodeTitle:``});let u=this.currentVideoElement??document.querySelector(J.watchVideoElement);if(u){await this.waitForVideoReady(u),u.dataset.videoId=c.videoId;let e=this.global.instances.renderer,t=this.global.instances.switchHandler;if(e&&t){let n=e.settings;e.destroy();let r=new Ei(n,{loggerNamespace:`dAnime:CommentRenderer`});this.global.instances.renderer=r,r.initialize(u),t.updateRenderer(r),t.resetVideoSource(),await t.onVideoSwitch(u)}}let d=c.owner?.nickname??c.channel?.name??`不明`,f=[`<div style="font-weight: 600; margin-bottom: 8px;">${D(`nextEpisodeAutoSetupComplete`)}</div>`,`<div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">`,`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Xp}</span>`,`  <span style="flex: 1; word-break: break-word;">${c.title}</span>`,`</div>`,`<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">`,`  <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Zp}</span>`,`  <span>${d}</span>`,`</div>`,`<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">`,`  <div style="display: flex; align-items: center; gap: 4px;">`,`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${Qp}</span>`,`    <span>${c.viewCount.toLocaleString()}</span>`,`  </div>`,`  <div style="display: flex; align-items: center; gap: 4px;">`,`    <span style="flex-shrink: 0; width: 18px; height: 18px; opacity: 0.8;">${$p}</span>`,`    <span>${c.commentCount.toLocaleString()}</span>`,`  </div>`,`</div>`].join(``);O.show(f,`success`,5e3),$.info(`watchPageController:manualModeSwitch:success`,{videoId:c.videoId,title:c.title,commentCount:c.commentCount})}catch(e){$.error(`watchPageController:manualModeSwitch:error`,e),O.show(E(`episodeSwitchError`,{message:e.message}),`error`)}}},jm=100,Mm=class{global;constructor(e){this.global=e}initialize(){let e=O.getInstance(),t=this.global.settingsManager??new vi(e);this.global.settingsManager=t,this.global.instances.settingsManager=t;let n=new dm(t);this.waitForHeader(n)}waitForHeader(e){document.querySelector(J.mypageHeaderTitle)?(e.insertIntoMypage(),e.addAutoCommentButtons(),this.observeList(e)):window.setTimeout(()=>this.waitForHeader(e),jm)}observeList(e){let t=document.querySelector(J.mypageListContainer);t&&new MutationObserver(()=>{try{e.addAutoCommentButtons()}catch(e){console.error(`[MypageController] auto comment buttons update failed`,e)}}).observe(t,{childList:!0,subtree:!0})}},Nm=class{log;global=vm();watchController=null;mypageController=null;constructor(){this.log=r(`DanimeApp`)}start(){this.log.info(`starting renderer`),pp.initialize(),this.global.utils.initialize=()=>this.initialize(),window.addEventListener(`load`,()=>{this.initialize()})}async initialize(){if(!this.acquireInstanceLock()){this.log.info(`renderer already initialized, skipping`);return}let e=location.pathname.toLowerCase();try{e.includes(`/animestore/sc_d_pc`)?(this.watchController=new Am(this.global),await this.watchController.initialize()):e.includes(`/animestore/mp_viw_pc`)?(this.mypageController=new Mm(this.global),this.mypageController.initialize()):this.log.info(`page not supported, initialization skipped`)}catch(e){this.log.error(`initialization failed`,e)}}acquireInstanceLock(){let e=i();return e.__dAnimeNicoCommentRenderer2Instance=(e.__dAnimeNicoCommentRenderer2Instance??0)+1,e.__dAnimeNicoCommentRenderer2Instance===1}},Pm=r(`dAnimeNicoCommentRenderer2`);async function Fm(){Pm.info(`bootstrap start`);try{new Nm().start(),Pm.info(`bootstrap completed`)}catch(e){Pm.error(`bootstrap failed`,e)}}Fm()})();
