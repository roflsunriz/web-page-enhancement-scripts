// ==UserScript==
// @name         image-collector
// @namespace    imageCollector
// @version      5.1.0
// @author       roflsunriz
// @description  Collect images from various hosts and export as archive.
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/image-collector.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/image-collector.meta.js
// @match        *://*
// @match        *://*/*
// @connect      *
// @connect      */*
// @connect      imgur.com
// @connect      flickr.com
// @connect      pinterest.com
// @connect      deviantart.com
// @connect      artstation.com
// @connect      500px.com
// @connect      unsplash.com
// @connect      pexels.com
// @connect      pixiv.net
// @connect      tinypic.com
// @connect      postimages.org
// @connect      imgbox.com
// @connect      imagebam.com
// @connect      imagevenue.com
// @connect      imageshack.us
// @connect      photobucket.com
// @connect      freeimage.host
// @connect      ibb.co
// @connect      imgbb.com
// @connect      gyazo.com
// @connect      twitter.com
// @connect      x.com
// @connect      instagram.com
// @connect      facebook.com
// @connect      reddit.com
// @connect      tumblr.com
// @connect      weibo.com
// @connect      vk.com
// @connect      example.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';

    const Ct={debug:"debug",info:"info",warn:"warn",error:"error"},C=i=>{const t=`[${i}]`,e={};return Object.keys(Ct).forEach(r=>{const o=Ct[r];e[r]=(...s)=>{(console[o]??console.log)(t,...s);};}),e},Zt={debugMode:false,showZipButton:true,singleImageTest:false};class te{state;constructor(t){this.state={...Zt,...t};}get snapshot(){return {...this.state}}get debugMode(){return this.state.debugMode}get showZipButton(){return this.state.showZipButton}get singleImageTest(){return this.state.singleImageTest}isDebugEnabled(){return this.state.debugMode===true}setDebugMode(t){return this.state.debugMode=!!t,this.state.debugMode}setShowZipButton(t){return this.state.showZipButton=!!t,this.state.showZipButton}setSingleImageTest(t){return this.state.singleImageTest=!!t,this.state.singleImageTest}update(t){this.state={...this.state,...t};}}var ee=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,re=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;function kt(){return typeof unsafeWindow<"u"?unsafeWindow:window}function oe(i,t){ee(i,t);}function se(i,t,e){const r=kt();r.setImageCollectorDebug=o=>{const s=i.setDebugMode(o);return t.info(`デバッグモード: ${s?"オン":"オフ"}`),s},r.setImageCollectorZipButton=o=>{const s=i.setShowZipButton(o);return t.info(`ZIPボタン: ${s?"表示":"非表示"}`),e.setZipButtonVisibility(s),s},r.setSingleImageTest=o=>{const s=i.setSingleImageTest(o);return t.info(`単一画像テストモード: ${s?"オン":"オフ"}`),s};}const et=i=>new Promise((t,e)=>{re({url:i.url,method:i.method??"GET",headers:i.headers,data:i.data,responseType:i.responseType??"text",timeout:i.timeout,onprogress:i.onprogress,onload:r=>{t({status:r.status,statusText:r.statusText,response:r.response,finalUrl:r.finalUrl,headers:r.responseHeaders});},onerror:r=>{const o=r?.error??"unknown error";e(new Error(`GM_xmlhttpRequest failed: ${o}`));},ontimeout:()=>{e(new Error("GM_xmlhttpRequest timeout"));}});});class Tt{constructor(t){this.logger=t;}minSize=50;maxSize=5e3;maxFileSize=5*1024*1024;deletedImageSizes=[{width:320,height:320},{width:161,height:81}];async isValidImage(t){if(!t||!this.isImageUrl(t))return  false;try{const e=await this.getImageMetadata(t);return !e||this.isDeletedImage(e)||e.width<this.minSize||e.height<this.minSize||e.width>this.maxSize||e.height>this.maxSize?!1:e.size>this.maxFileSize?"large":!0}catch(e){return this.logger.error("画像のメタデータ取得中にエラーが発生しました",e instanceof Error?e:void 0,{url:t}),false}}isDeletedImage(t){return this.deletedImageSizes.some(e=>e.width===t.width&&e.height===t.height)}createPlaceholder(t,e){try{const r=document.createElement("div");r.classList.add("ic","image-placeholder");const o=document.createElement("div");o.classList.add("ic","size-info"),o.textContent=`サイズ: ${e.width}x${e.height} (${this.formatBytes(e.size)})`;const s=document.createElement("button");return s.classList.add("ic","load-button"),s.textContent="画像を読み込む",s.addEventListener("click",()=>{try{r.replaceWith(this.createImageElement(t));}catch(n){this.logger.error("画像の読み込み中にエラーが発生しました",n instanceof Error?n:void 0,{url:t});}}),r.append(o,s),r}catch(r){this.logger.error("プレースホルダーの作成中にエラーが発生しました",r instanceof Error?r:void 0,{url:t});const o=document.createElement("div");return o.classList.add("ic","image-placeholder"),o.textContent="画像の表示に失敗しました",o}}createErrorPlaceholder(t){try{const e=document.createElement("div");e.classList.add("ic","image-placeholder"),e.style.backgroundColor="rgba(220, 53, 69, 0.2)";const r=document.createElement("div");r.textContent="画像の読み込みに失敗しました",r.style.color="#dc3545";const o=document.createElement("button");return o.classList.add("ic","load-button"),o.textContent="再試行",o.addEventListener("click",()=>{try{e.replaceWith(this.createImageElement(t));}catch(s){this.logger.error("画像の再読み込み中にエラーが発生しました",s instanceof Error?s:void 0,{url:t});}}),e.append(r,o),e}catch(e){this.logger.error("エラープレースホルダーの作成中にエラーが発生しました",e instanceof Error?e:void 0,{url:t});const r=document.createElement("div");return r.textContent="エラー",r}}createImageElement(t){const e=document.createElement("img");return e.src=t,e.classList.add("ic","grid-image"),e}async getImageMetadata(t){return new Promise((e,r)=>{try{const o=new Image;o.crossOrigin="anonymous";const s=window.setTimeout(()=>{this.logger.warn("画像サイズ取得がタイムアウトしました",{url:t}),r(new Error("Image size detection timeout"));},8e3);o.onload=()=>{try{if(window.clearTimeout(s),o.width===0||o.height===0){this.logger.warn("無効な画像サイズです",{url:t,width:o.width,height:o.height}),r(new Error("Invalid image dimensions"));return}et({method:"HEAD",url:t,timeout:5e3}).then(n=>{try{const a=n.headers??"",c=a.match(/Content-Length:\s*(\d+)/i),g=a.match(/Content-Type:\s*([^;\n]+)/i),l=c?Number.parseInt(c[1],10):0,h=g?g[1]:"";if(!h.startsWith("image/")){this.logger.warn("画像ではないコンテンツタイプです",{url:t,contentType:h}),r(new Error("Not an image"));return}e({width:o.width,height:o.height,size:Number.isFinite(l)?l:0,loaded:o.complete});}catch(a){this.logger.error("ヘッダー解析中にエラーが発生しました",a instanceof Error?a:void 0,{url:t}),r(a);}}).catch(n=>{this.logger.error("画像メタデータ取得中にエラーが発生しました",n instanceof Error?n:void 0,{url:t}),r(new Error("HEAD request failed"));});}catch(n){this.logger.error("メタデータ取得処理でエラーが発生しました",n instanceof Error?n:void 0,{url:t}),r(n);}},o.onerror=()=>{window.clearTimeout(s),this.logger.warn("画像読み込みに失敗しました",{url:t}),r(new Error("Image load error"));},o.src=t;}catch(o){this.logger.error("メタデータ取得処理の開始中にエラーが発生しました",o instanceof Error?o:void 0,{url:t}),r(o);}})}formatBytes(t){return t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/1024/1024).toFixed(1)} MB`}isImageUrl(t){const e=[".jpg",".jpeg",".png",".gif",".webp",".svg"],r=t.toLowerCase();return e.some(o=>r.endsWith(o))}}class Ht{constructor(t){this.logger=t;}hostPatterns=[/(?:https?:\/\/)?(?:www\.)?imgur\.com\//i,/(?:https?:\/\/)?(?:www\.)?flickr\.com\//i,/(?:https?:\/\/)?(?:www\.)?pinterest\.com\//i,/(?:https?:\/\/)?(?:www\.)?deviantart\.com\//i,/(?:https?:\/\/)?(?:www\.)?artstation\.com\//i,/(?:https?:\/\/)?(?:www\.)?500px\.com\//i,/(?:https?:\/\/)?(?:www\.)?unsplash\.com\//i,/(?:https?:\/\/)?(?:www\.)?pexels\.com\//i,/(?:https?:\/\/)?(?:www\.)?pixiv\.net\//i,/(?:https?:\/\/)?(?:www\.)?tinypic\.com\//i,/(?:https?:\/\/)?(?:www\.)?postimages\.org\//i,/(?:https?:\/\/)?(?:www\.)?imgbox\.com\//i,/(?:https?:\/\/)?(?:www\.)?imagebam\.com\//i,/(?:https?:\/\/)?(?:www\.)?imagevenue\.com\//i,/(?:https?:\/\/)?(?:www\.)?imageshack\.us\//i,/(?:https?:\/\/)?(?:www\.)?photobucket\.com\//i,/(?:https?:\/\/)?(?:www\.)?freeimage\.host\//i,/(?:https?:\/\/)?(?:www\.)?ibb\.co\//i,/(?:https?:\/\/)?(?:www\.)?imgbb\.com\//i,/(?:https?:\/\/)?(?:www\.)?gyazo\.com\//i,/(?:https?:\/\/)?(?:www\.)?twitter\.com\//i,/(?:https?:\/\/)?(?:www\.)?x\.com\//i,/(?:https?:\/\/)?(?:www\.)?instagram\.com\//i,/(?:https?:\/\/)?(?:www\.)?facebook\.com\//i,/(?:https?:\/\/)?(?:www\.)?reddit\.com\//i,/(?:https?:\/\/)?(?:www\.)?tumblr\.com\//i,/(?:https?:\/\/)?(?:www\.)?weibo\.com\//i,/(?:https?:\/\/)?(?:www\.)?vk\.com\//i];isSupportedHost(t){const e=this.hostPatterns.some(r=>r.test(t));return this.logger.debug("ホストサポート判定",{url:t,supported:e}),e}addHostPattern(t){const e=t instanceof RegExp?t:new RegExp(t,"i");this.hostPatterns.push(e),this.logger.debug("ホストパターンを追加しました",{pattern:e.source});}}class Dt{constructor(t){this.logger=t,this.trustedDomains=new Set([window.location.hostname,"cdn.jsdelivr.net","fonts.googleapis.com","fonts.gstatic.com"]);}trustedDomains;classifyImageSource(t,e=null){try{const r=new URL(t,window.location.href);return r.hostname===window.location.hostname?{trustLevel:"high",reason:"same-domain",fastPath:!0,element:e}:this.trustedDomains.has(r.hostname)?{trustLevel:"high",reason:"trusted-cdn",fastPath:!0,element:e}:e&&(e.tagName==="IMG"||e.tagName==="SOURCE")&&e instanceof HTMLImageElement&&e.complete&&e.naturalWidth>0?{trustLevel:"medium",reason:"loaded-dom-element",fastPath:!0,element:e}:r.protocol==="https:"?{trustLevel:"medium",reason:"https-external",fastPath:!1,element:e}:{trustLevel:"low",reason:"untrusted-source",fastPath:!1,element:e}}catch(r){return this.logger.error("画像ソース分類中にエラーが発生しました",r instanceof Error?r:void 0,{url:t}),{trustLevel:"low",reason:"classification-error",fastPath:false,element:e}}}getMetadataFromElement(t){return t instanceof HTMLImageElement?{width:t.naturalWidth||t.width||0,height:t.naturalHeight||t.height||0,size:0,loaded:t.complete}:null}}class At{constructor(t,e=5,r=1e3){this.logger=t,this.batchSize=e,this.delay=r;}queue=[];isProcessing=false;addRequest(t){this.queue.push(t),this.isProcessing||this.processBatch();}async processBatch(){try{this.isProcessing=!0;let t=0,e=0;for(;this.queue.length>0;){const r=this.queue.splice(0,this.batchSize);t+=1;try{const o=await Promise.allSettled(r.map(n=>n())),s=o.filter(n=>n.status==="rejected").length;e+=s,s>0&&(this.logger.warn("バッチ処理でエラーが発生しました",{batchNumber:t,batchErrors:s}),o.forEach((n,a)=>{if(n.status==="rejected"){const c=n.reason instanceof Error?n.reason:void 0;this.logger.error("バッチ処理タスクでエラーが発生しました",c,{batchNumber:t,taskIndex:a});}}));}catch(o){this.logger.error("バッチ処理中に予期しないエラーが発生しました",o instanceof Error?o:void 0,{batchNumber:t}),e+=1;}this.queue.length>0&&await new Promise(o=>setTimeout(o,this.delay));}e>0?this.logger.warn("バッチ処理完了",{processedBatches:t,totalErrors:e}):this.logger.debug("バッチ処理完了",{processedBatches:t,totalErrors:e});}catch(t){throw this.logger.error("バッチ処理中に致命的なエラーが発生しました",t instanceof Error?t:void 0),t}finally{this.isProcessing=false;}}}class $t{constructor(t,e,r,o,s){this.uiBatchUpdater=t,this.badImageHandler=e,this.progressBar=r,this.toast=o,this.logger=s,this.imageHostManager=new Ht(C("ImageCollector2:ImageHostManager")),this.imageSourceClassifier=new Dt(C("ImageCollector2:SourceClassifier")),this.requestLimiter=new At(C("ImageCollector2:RequestLimiter"));}imageHostManager;imageSourceClassifier;requestLimiter;async collectImages(){this.logger.debug("画像収集開始"),this.toast.show("画像収集を開始します...","info"),this.progressBar.show(),this.progressBar.update(0);try{const t=new Map,e=[],r=[];this.collectFromImages(t,e,r),this.collectFromPictureSources(t,e,r),this.collectFromAnchors(t,r),this.collectFromBackgrounds(t,r),this.logger.debug("画像分類完了",{fastPath:e.length,slowPath:r.length}),this.toast.show(`画像を分類しました: 高速=${e.length}, 通常=${r.length}`,"info"),e.length>0&&(this.toast.show("信頼できる画像を高速処理中...","info"),await this.uiBatchUpdater.addImagesFastPath(e),this.progressBar.update(30)),r.length>0&&(this.toast.show("外部画像を検証中...","info"),await this.processSlowPathImages(r));const o=e.length+r.length;if(o===0){this.logger.warn("処理対象の画像が0件です"),this.toast.show("処理対象の画像が見つかりませんでした","warning"),this.progressBar.hide();return}this.progressBar.update(100),setTimeout(()=>{this.progressBar.hide(),this.toast.show(`${o}枚の画像を収集しました！(高速:${e.length}, 通常:${r.length})`,"success"),this.logger.debug("画像収集完了",{totalImages:o});},500);}catch(t){this.logger.error("画像収集処理中に予期しないエラーが発生しました",t instanceof Error?t:void 0),this.toast.show("画像収集中に予期しないエラーが発生しました","error"),this.progressBar.hide();}}collectFromImages(t,e,r){document.querySelectorAll("img").forEach(o=>{try{const s=this.resolveUrl(o.src);if(!s)return;const n=this.imageSourceClassifier.classifyImageSource(s,o);t.set(s,{element:o,classification:n}),n.fastPath?(e.push({url:s,classification:n}),this.logger.debug("高速パス画像",{src:s.substring(0,50),reason:n.reason})):(r.push(s),this.logger.debug("低速パス画像",{src:s.substring(0,50),reason:n.reason}));}catch(s){this.logger.warn("img要素の処理中にエラーが発生しました",{error:s,src:o.src});}});}collectFromPictureSources(t,e,r){document.querySelectorAll("picture source").forEach(o=>{try{o.srcset.split(",").map(n=>n.trim().split(" ")[0]).filter(Boolean).forEach(n=>{const a=this.resolveUrl(n);if(!a||t.has(a))return;const c=this.imageSourceClassifier.classifyImageSource(a,o);t.set(a,{element:o,classification:c}),c.fastPath?(e.push({url:a,classification:c}),this.logger.debug("高速パス(picture)",{src:a.substring(0,50),reason:c.reason})):(r.push(a),this.logger.debug("低速パス(picture)",{src:a.substring(0,50),reason:c.reason}));});}catch(s){this.logger.warn("picture要素の処理中にエラーが発生しました",{error:s,srcset:o.srcset});}});}collectFromAnchors(t,e){document.querySelectorAll("a").forEach(r=>{try{const o=this.resolveUrl(r.href);if(!o||!this.isImageUrl(o)||t.has(o))return;const s=this.imageSourceClassifier.classifyImageSource(o);t.set(o,{element:null,classification:s}),e.push(o),this.logger.debug("低速パス(link)",{src:o.substring(0,50),reason:s.reason});}catch(o){this.logger.warn("a要素の処理中にエラーが発生しました",{error:o,href:r.href});}});}collectFromBackgrounds(t,e){document.querySelectorAll("*").forEach(r=>{try{const o=window.getComputedStyle(r).backgroundImage;if(!o||o==="none")return;const s=o.replace(/^url\(["']?/,"").replace(/["']?\)$/,""),n=this.resolveUrl(s);if(!n||t.has(n))return;const a=this.imageSourceClassifier.classifyImageSource(n);t.set(n,{element:null,classification:a}),e.push(n),this.logger.debug("低速パス(bg)",{src:n.substring(0,50),reason:a.reason});}catch(o){this.logger.warn("背景画像の処理中にエラーが発生しました",{error:o,tag:r.tagName});}});}async processSlowPathImages(t){const e=[];for(const s of t)try{if(this.imageHostManager.isSupportedHost(s)){const n=await this.getSnsImageUrl(s);e.push(n);}else e.push(s);}catch(n){this.logger.warn("SNS画像URL解決中にエラーが発生しました",{error:n,url:s}),e.push(s);}const o=(await Promise.allSettled(e.map(async s=>{try{return await this.badImageHandler.isValidImage(s)?s:null}catch(n){return this.logger.warn("画像検証中にエラーが発生しました",{error:n,url:s}),null}}))).filter(s=>s.status==="fulfilled").map(s=>s.value).filter(s=>s!==null);o.length>0&&await this.uiBatchUpdater.addImages(o),this.progressBar.update(60);}resolveUrl(t){if(!t)return null;try{if(t.includes("?http")){const e=t.split("?http")[1];if(e)return new URL(`http${e}`).href}return new URL(t,window.location.href).href}catch(e){return this.logger.debug("URL解決に失敗しました",{url:t,error:e}),null}}isImageUrl(t){if(!t)return  false;const e=[".jpg",".jpeg",".png",".gif",".webp",".svg"],r=t.toLowerCase();return e.some(o=>r.endsWith(o))}async getSnsImageUrl(t){return /(twitter\.com|x\.com)/i.test(t)?new Promise(e=>{et({url:t,responseType:"text"}).then(r=>{try{const o=new DOMParser,s=String(r.response.responseText??""),a=o.parseFromString(s,"text/html").querySelector('meta[property="og:image"]');a?.getAttribute("content")?e(a.getAttribute("content")??t):e(t);}catch(o){this.logger.warn("SNS画像の解析中にエラーが発生しました",{error:o,url:t}),e(t);}}).catch(()=>e(t));}):t}}var E=Uint8Array,Z=Uint16Array,pt=Int32Array,mt=new E([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),wt=new E([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Bt=new E([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ft=function(i,t){for(var e=new Z(31),r=0;r<31;++r)e[r]=t+=1<<i[r-1];for(var o=new pt(e[30]),r=1;r<30;++r)for(var s=e[r];s<e[r+1];++s)o[s]=s-e[r]<<5|r;return {b:e,r:o}},Ut=Ft(mt,2),ie=Ut.b,gt=Ut.r;ie[28]=258,gt[258]=28;var ne=Ft(wt,0),Et=ne.r,dt=new Z(32768);for(var m=0;m<32768;++m){var G=(m&43690)>>1|(m&21845)<<1;G=(G&52428)>>2|(G&13107)<<2,G=(G&61680)>>4|(G&3855)<<4,dt[m]=((G&65280)>>8|(G&255)<<8)>>1;}var J=(function(i,t,e){for(var r=i.length,o=0,s=new Z(t);o<r;++o)i[o]&&++s[i[o]-1];var n=new Z(t);for(o=1;o<t;++o)n[o]=n[o-1]+s[o-1]<<1;var a;for(a=new Z(r),o=0;o<r;++o)i[o]&&(a[o]=dt[n[i[o]-1]++]>>15-i[o]);return a}),O=new E(288);for(var m=0;m<144;++m)O[m]=8;for(var m=144;m<256;++m)O[m]=9;for(var m=256;m<280;++m)O[m]=7;for(var m=280;m<288;++m)O[m]=8;var tt=new E(32);for(var m=0;m<32;++m)tt[m]=5;var ae=J(O,9),le=J(tt,5),Rt=function(i){return (i+7)/8|0},Vt=function(i,t,e){return (e==null||e>i.length)&&(e=i.length),new E(i.subarray(t,e))},ce=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],rt=function(i,t,e){var r=new Error(t||ce[i]);if(r.code=i,Error.captureStackTrace&&Error.captureStackTrace(r,rt),!e)throw r;return r},V=function(i,t,e){e<<=t&7;var r=t/8|0;i[r]|=e,i[r+1]|=e>>8;},Y=function(i,t,e){e<<=t&7;var r=t/8|0;i[r]|=e,i[r+1]|=e>>8,i[r+2]|=e>>16;},lt=function(i,t){for(var e=[],r=0;r<i.length;++r)i[r]&&e.push({s:r,f:i[r]});var o=e.length,s=e.slice();if(!o)return {t:Gt,l:0};if(o==1){var n=new E(e[0].s+1);return n[e[0].s]=1,{t:n,l:1}}e.sort(function(P,M){return P.f-M.f}),e.push({s:-1,f:25001});var a=e[0],c=e[1],g=0,l=1,h=2;for(e[0]={s:-1,f:a.f+c.f,l:a,r:c};l!=o-1;)a=e[e[g].f<e[h].f?g++:h++],c=e[g!=l&&e[g].f<e[h].f?g++:h++],e[l++]={s:-1,f:a.f+c.f,l:a,r:c};for(var d=s[0].s,r=1;r<o;++r)s[r].s>d&&(d=s[r].s);var u=new Z(d+1),b=ut(e[l-1],u,0);if(b>t){var r=0,w=0,S=b-t,A=1<<S;for(s.sort(function(M,v){return u[v.s]-u[M.s]||M.f-v.f});r<o;++r){var k=s[r].s;if(u[k]>t)w+=A-(1<<b-u[k]),u[k]=t;else break}for(w>>=S;w>0;){var $=s[r].s;u[$]<t?w-=1<<t-u[$]++-1:++r;}for(;r>=0&&w;--r){var y=s[r].s;u[y]==t&&(--u[y],++w);}b=t;}return {t:new E(u),l:b}},ut=function(i,t,e){return i.s==-1?Math.max(ut(i.l,t,e+1),ut(i.r,t,e+1)):t[i.s]=e},St=function(i){for(var t=i.length;t&&!i[--t];);for(var e=new Z(++t),r=0,o=i[0],s=1,n=function(c){e[r++]=c;},a=1;a<=t;++a)if(i[a]==o&&a!=t)++s;else {if(!o&&s>2){for(;s>138;s-=138)n(32754);s>2&&(n(s>10?s-11<<5|28690:s-3<<5|12305),s=0);}else if(s>3){for(n(o),--s;s>6;s-=6)n(8304);s>2&&(n(s-3<<5|8208),s=0);}for(;s--;)n(o);s=1,o=i[a];}return {c:e.subarray(0,r),n:t}},X=function(i,t){for(var e=0,r=0;r<t.length;++r)e+=i[r]*t[r];return e},qt=function(i,t,e){var r=e.length,o=Rt(t+2);i[o]=r&255,i[o+1]=r>>8,i[o+2]=i[o]^255,i[o+3]=i[o+1]^255;for(var s=0;s<r;++s)i[o+s+4]=e[s];return (o+4+r)*8},Pt=function(i,t,e,r,o,s,n,a,c,g,l){V(t,l++,e),++o[256];for(var h=lt(o,15),d=h.t,u=h.l,b=lt(s,15),w=b.t,S=b.l,A=St(d),k=A.c,$=A.n,y=St(w),P=y.c,M=y.n,v=new Z(19),p=0;p<k.length;++p)++v[k[p]&31];for(var p=0;p<P.length;++p)++v[P[p]&31];for(var f=lt(v,7),z=f.t,_=f.l,L=19;L>4&&!z[Bt[L-1]];--L);var j=g+5<<3,T=X(o,O)+X(s,tt)+n,H=X(o,d)+X(s,w)+n+14+3*L+X(v,z)+2*v[16]+3*v[17]+7*v[18];if(c>=0&&j<=T&&j<=H)return qt(t,l,i.subarray(c,c+g));var F,x,D,q;if(V(t,l,1+(H<T)),l+=2,H<T){F=J(d,u),x=d,D=J(w,S),q=w;var st=J(z,_);V(t,l,$-257),V(t,l+5,M-1),V(t,l+10,L-4),l+=14;for(var p=0;p<L;++p)V(t,l+3*p,z[Bt[p]]);l+=3*L;for(var U=[k,P],Q=0;Q<2;++Q)for(var N=U[Q],p=0;p<N.length;++p){var R=N[p]&31;V(t,l,st[R]),l+=z[R],R>15&&(V(t,l,N[p]>>5&127),l+=N[p]>>12);}}else F=ae,x=O,D=le,q=tt;for(var p=0;p<a;++p){var B=r[p];if(B>255){var R=B>>18&31;Y(t,l,F[R+257]),l+=x[R+257],R>7&&(V(t,l,B>>23&31),l+=mt[R]);var W=B&31;Y(t,l,D[W]),l+=q[W],W>3&&(Y(t,l,B>>5&8191),l+=wt[W]);}else Y(t,l,F[B]),l+=x[B];}return Y(t,l,F[256]),l+x[256]},he=new pt([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Gt=new E(0),ge=function(i,t,e,r,o,s){var n=s.z||i.length,a=new E(r+n+5*(1+Math.ceil(n/7e3))+o),c=a.subarray(r,a.length-o),g=s.l,l=(s.r||0)&7;if(t){l&&(c[0]=s.r>>3);for(var h=he[t-1],d=h>>13,u=h&8191,b=(1<<e)-1,w=s.p||new Z(32768),S=s.h||new Z(b+1),A=Math.ceil(e/3),k=2*A,$=function(at){return (i[at]^i[at+1]<<A^i[at+2]<<k)&b},y=new pt(25e3),P=new Z(288),M=new Z(32),v=0,p=0,f=s.i||0,z=0,_=s.w||0,L=0;f+2<n;++f){var j=$(f),T=f&32767,H=S[j];if(w[T]=H,S[j]=T,_<=f){var F=n-f;if((v>7e3||z>24576)&&(F>423||!g)){l=Pt(i,c,0,y,P,M,p,z,L,f-L,l),z=v=p=0,L=f;for(var x=0;x<286;++x)P[x]=0;for(var x=0;x<30;++x)M[x]=0;}var D=2,q=0,st=u,U=T-H&32767;if(F>2&&j==$(f-U))for(var Q=Math.min(d,F)-1,N=Math.min(32767,f),R=Math.min(258,F);U<=N&&--st&&T!=H;){if(i[f+D]==i[f+D-U]){for(var B=0;B<R&&i[f+B]==i[f+B-U];++B);if(B>D){if(D=B,q=U,B>Q)break;for(var W=Math.min(U,B-2),vt=0,x=0;x<W;++x){var it=f-U+x&32767,Jt=w[it],yt=it-Jt&32767;yt>vt&&(vt=yt,H=it);}}}T=H,H=w[T],U+=T-H&32767;}if(q){y[z++]=268435456|gt[D]<<18|Et[q];var xt=gt[D]&31,It=Et[q]&31;p+=mt[xt]+wt[It],++P[257+xt],++M[It],_=f+D,++v;}else y[z++]=i[f],++P[i[f]];}}for(f=Math.max(f,_);f<n;++f)y[z++]=i[f],++P[i[f]];l=Pt(i,c,g,y,P,M,p,z,L,f-L,l),g||(s.r=l&7|c[l/8|0]<<3,l-=7,s.h=S,s.p=w,s.i=f,s.w=_);}else {for(var f=s.w||0;f<n+g;f+=65535){var nt=f+65535;nt>=n&&(c[l/8|0]=g,nt=n),l=qt(c,l+1,i.subarray(f,nt));}s.i=n;}return Vt(a,0,r+Rt(l)+o)},de=(function(){for(var i=new Int32Array(256),t=0;t<256;++t){for(var e=t,r=9;--r;)e=(e&1&&-306674912)^e>>>1;i[t]=e;}return i})(),ue=function(){var i=-1;return {p:function(t){for(var e=i,r=0;r<t.length;++r)e=de[e&255^t[r]]^e>>>8;i=e;},d:function(){return ~i}}},fe=function(i,t,e,r,o){if(!o&&(o={l:1},t.dictionary)){var s=t.dictionary.subarray(-32768),n=new E(s.length+i.length);n.set(s),n.set(i,s.length),i=n,o.w=s.length;}return ge(i,t.level==null?6:t.level,t.mem==null?o.l?Math.ceil(Math.max(8,Math.min(13,Math.log(i.length)))*1.5):20:12+t.mem,e,r,o)},Ot=function(i,t){var e={};for(var r in i)e[r]=i[r];for(var r in t)e[r]=t[r];return e},I=function(i,t,e){for(;e;++t)i[t]=e,e>>>=8;};function pe(i,t){return fe(i,t||{},0,0)}var _t=function(i,t,e,r){for(var o in i){var s=i[o],n=t+o,a=r;Array.isArray(s)&&(a=Ot(r,s[1]),s=s[0]),s instanceof E?e[n]=[s,a]:(e[n+="/"]=[new E(0),a],_t(s,n,e,r));}},Mt=typeof TextEncoder<"u"&&new TextEncoder,me=typeof TextDecoder<"u"&&new TextDecoder,we=0;try{me.decode(Gt,{stream:!0}),we=1;}catch{}function zt(i,t){var e;if(Mt)return Mt.encode(i);for(var r=i.length,o=new E(i.length+(i.length>>1)),s=0,n=function(g){o[s++]=g;},e=0;e<r;++e){if(s+5>o.length){var a=new E(s+8+(r-e<<1));a.set(o),o=a;}var c=i.charCodeAt(e);c<128||t?n(c):c<2048?(n(192|c>>6),n(128|c&63)):c>55295&&c<57344?(c=65536+(c&1047552)|i.charCodeAt(++e)&1023,n(240|c>>18),n(128|c>>12&63),n(128|c>>6&63),n(128|c&63)):(n(224|c>>12),n(128|c>>6&63),n(128|c&63));}return Vt(o,0,s)}var ft=function(i){var t=0;if(i)for(var e in i){var r=i[e].length;r>65535&&rt(9),t+=r+4;}return t},Lt=function(i,t,e,r,o,s,n,a){var c=r.length,g=e.extra,l=a&&a.length,h=ft(g);I(i,t,n!=null?33639248:67324752),t+=4,n!=null&&(i[t++]=20,i[t++]=e.os),i[t]=20,t+=2,i[t++]=e.flag<<1|(s<0&&8),i[t++]=o&&8,i[t++]=e.compression&255,i[t++]=e.compression>>8;var d=new Date(e.mtime==null?Date.now():e.mtime),u=d.getFullYear()-1980;if((u<0||u>119)&&rt(10),I(i,t,u<<25|d.getMonth()+1<<21|d.getDate()<<16|d.getHours()<<11|d.getMinutes()<<5|d.getSeconds()>>1),t+=4,s!=-1&&(I(i,t,e.crc),I(i,t+4,s<0?-s-2:s),I(i,t+8,e.size)),I(i,t+12,c),I(i,t+14,h),t+=16,n!=null&&(I(i,t,l),I(i,t+6,e.attrs),I(i,t+10,n),t+=14),i.set(r,t),t+=c,h)for(var b in g){var w=g[b],S=w.length;I(i,t,+b),I(i,t+2,S),i.set(w,t+4),t+=4+S;}return l&&(i.set(a,t),t+=l),t},be=function(i,t,e,r,o){I(i,t,101010256),I(i,t+8,e),I(i,t+10,e),I(i,t+12,r),I(i,t+16,o);};function ct(i,t){t||(t={});var e={},r=[];_t(i,"",e,t);var o=0,s=0;for(var n in e){var a=e[n],c=a[0],g=a[1],l=g.level==0?0:8,h=zt(n),d=h.length,u=g.comment,b=u&&zt(u),w=b&&b.length,S=ft(g.extra);d>65535&&rt(11);var A=l?pe(c,g):c,k=A.length,$=ue();$.p(c),r.push(Ot(g,{size:c.length,crc:$.d(),c:A,f:h,m:b,u:d!=n.length||b&&u.length!=w,o,compression:l})),o+=30+d+S+k,s+=76+2*(d+S)+(w||0)+k;}for(var y=new E(s+22),P=o,M=s-o,v=0;v<r.length;++v){var h=r[v];Lt(y,h.o,h,h.f,h.u,h.c.length);var p=30+h.f.length+ft(h.extra);y.set(h.c,h.o+p),Lt(y,o,h,h.f,h.u,h.c.length,h.o,h.m),o+=16+p+(h.m?h.m.length:0);}return be(y,o,r.length,M,P),y}var ve="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z",ye="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z",xe="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z";function bt(i,t=24){const e=String(t),r=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${i}"></path></svg>`}const K=bt(ye),Ie=bt(ve),Ce=bt(xe),Be={maxZipSize:500*1024*1024,maxImagesPerZip:300,compressionLevel:6,splitZipFiles:true};class jt{constructor(t,e,r,o,s,n,a=Be){this.uiBuilder=t,this.badImageHandler=e,this.toast=r,this.progressBar=o,this.logger=s,this.config=n,this.options=a;}filesData=new Map;downloadedUrls=new Set;isProcessing=false;async prepareZip(){if(this.logger.debug("prepareZip開始"),this.isProcessing){this.logger.debug("既に処理中のため、prepareZipをスキップ"),this.toast.show("現在処理中です。しばらくお待ちください...","info");return}this.isProcessing=true;try{this.filesData.clear(),this.uiBuilder.setZipButtonState("processing",Ce),this.toast.show("ZIPファイルの準備を開始します...","info"),this.progressBar.show(),this.progressBar.update(0);let t=Array.from(this.uiBuilder.imageData.keys());this.config.singleImageTest&&t.length>0&&(this.logger.debug("単一画像テストモード: 最初の1枚だけ処理します"),t=[t[0]],this.toast.show("テストモード: 1枚だけZIPに追加します","warning"));const e=t.length;if(this.logger.debug(`画像URL ${e}件を収集`),e===0){this.toast.show("ダウンロードできる画像がありません","error"),this.uiBuilder.setZipButtonState("initial",K);return}let r=0,o=0,s=0;const n=[],a=this.uiBuilder.imageData;for(const[g,l]of t.entries())try{this.logger.debug(`画像情報収集 ${g+1}/${e}: ${l.substring(0,50)}...`);const h=a.get(l);if(!h){this.logger.error("画像データが見つかりません",void 0,{url:l}),o+=1;continue}if(this.logger.debug("メタデータ",{width:h.metadata?.width,height:h.metadata?.height,size:h.metadata?.size,hasBlob:h.blob!==null}),h.blob)s+=1,this.logger.debug("既存のBlobを使用",{size:h.blob.size});else try{const u=await this.fetchImageAsBlob(l);h.blob=u,a.set(l,h),this.logger.debug("Blobダウンロード成功",{size:u.size});}catch(u){this.logger.error("画像のダウンロードに失敗しました",u instanceof Error?u:void 0,{url:l}),o+=1;continue}const d=this.getFilenameFromUrl(l);n.push({url:l,entry:h,fileName:d});}catch(h){this.logger.error("画像メタデータ処理中にエラーが発生しました",h instanceof Error?h:void 0,{url:l,index:g}),o+=1;}this.logger.debug("並列処理開始",{count:n.length}),n.length===0&&this.toast.show("ZIPに追加できる画像がありませんでした","warning");const c=await Promise.all(n.map(async({url:g,entry:l,fileName:h},d)=>{try{if(!l.blob)return this.logger.error("Blobが存在しません",void 0,{url:g,fileName:h}),{success:!1,url:g,fileName:h};this.logger.debug("画像変換",{index:d+1,fileName:h});const u=new Uint8Array(await l.blob.arrayBuffer());return u.byteLength===0?(this.logger.warn("変換後のデータが空です",{url:g,fileName:h}),{success:!1,url:g,fileName:h}):{success:!0,url:g,fileName:h,bytes:u}}catch(u){return this.logger.error("画像処理中にエラーが発生しました",u instanceof Error?u:void 0,{url:g,fileName:h}),{success:!1,url:g,fileName:h}}}));for(const g of c){g.success&&g.bytes?(this.filesData.set(g.fileName,g.bytes),this.downloadedUrls.add(g.url),r+=1):o+=1;const l=r/e*100;this.progressBar.update(l);}this.logger.debug("並列処理完了",{processed:r,failed:o,skipped:s,filesCount:this.filesData.size}),this.toast.show(`${r}/${e} 画像が準備されました`,"info"),this.config.singleImageTest&&(this.logger.debug("単一画像テストモードで実行されました"),this.toast.show("テストモード: 単一画像のみでZIPを生成します","info")),o>0&&this.toast.show(`${o}枚の画像をZIPに含められませんでした`,"warning"),r>0?(this.toast.show("ZIPファイルの準備が完了しました！ボタンをクリックしてダウンロードしてください","success"),this.uiBuilder.setZipButtonState("ready",Ie)):(this.logger.error("処理された画像が0件です",void 0,{total:e,processed:r,failed:o}),this.toast.show("ZIPファイルの作成に失敗しました","error"),this.uiBuilder.setZipButtonState("initial",K),this.filesData.clear());}catch(t){this.logger.error("ZIP準備中にエラーが発生しました",t instanceof Error?t:void 0,{filesDataSize:this.filesData.size}),this.toast.show("ZIPファイルの準備に失敗しました","error"),this.uiBuilder.setZipButtonState("initial",K),this.filesData.clear();}finally{this.progressBar.hide(),this.isProcessing=false;}}async downloadZip(){if(this.logger.debug("downloadZip開始"),!this.fflateAvailable()){this.toast.show("ZIPライブラリが読み込まれていないため、ダウンロードできません","error"),this.logger.error("fflate利用不可のためダウンロード中止");return}if(this.filesData.size===0){this.logger.warn("ファイルデータが空のため準備からやり直し"),this.toast.show("ZIPファイルが準備されていません。再度準備します...","warning"),await this.prepareZip();return}const t=Array.from(this.filesData.entries());if(t.length===0){this.logger.error("ZIPファイルが空です"),this.toast.show("ZIPファイルに画像が含まれていません","error"),this.uiBuilder.setZipButtonState("initial",K);return}this.logger.debug("ZIP内のファイル数",{count:t.length});try{this.isProcessing=!0,this.toast.show("ZIPファイルを生成しています...","info"),this.progressBar.show();const e=t.length;this.options.splitZipFiles&&e>this.options.maxImagesPerZip?await this.generateSplitZips(t,e):await this.generateSingleZip(t);}catch(e){this.logger.error("ZIPダウンロード中に詳細エラー情報",e instanceof Error?e:void 0,{filesDataSize:this.filesData.size}),this.toast.show("ZIPファイルの生成に失敗しました","error");}finally{this.progressBar.hide(),this.uiBuilder.setZipButtonState("initial",'<span class="ic material-icons">download</span>'),this.isProcessing=false;}}async generateSingleZip(t){this.logger.debug("単一ZIPファイル生成開始"),console.time("[ZipDownloader] ZIP生成時間");const e={};for(const[a,c]of t)e[a]=c;const r=this.createZipOptions(),o=ct(e,r);if(console.timeEnd("[ZipDownloader] ZIP生成時間"),!o)throw new Error("ZIP生成結果がnullです");const s=this.createZipBlob(o),n=`images_${this.getFormattedDate()}.zip`;await this.triggerDownload(s,n),this.toast.show("ZIPファイルのダウンロードが開始されました","success");}async generateSplitZips(t,e){this.logger.debug("分割ZIPファイル生成開始",{totalEntries:e});const r=Math.ceil(e/this.options.maxImagesPerZip);this.toast.show(`画像が多いため、${r}個のZIPファイルに分割します`,"info");for(let o=0;o<r;o+=1){const s=o*this.options.maxImagesPerZip,n=Math.min((o+1)*this.options.maxImagesPerZip,e),a=t.slice(s,n);this.logger.debug("分割ZIP生成",{part:o+1,start:s+1,end:n}),this.progressBar.update(o/r*100);const c={};for(const[d,u]of a)c[d]=u;const g=ct(c,this.createZipOptions()),l=this.createZipBlob(g),h=`images_${this.getFormattedDate()}_part${o+1}of${r}.zip`;await this.triggerDownload(l,h),o<r-1&&(this.toast.show(`パート${o+1}/${r}のダウンロードが開始されました。次のパートを準備中...`,"success"),await new Promise(d=>setTimeout(d,1500)));}this.toast.show(`全${r}個のZIPファイルのダウンロードを開始しました`,"success");}triggerDownload(t,e){return this.logger.debug("ダウンロード開始",{filename:e}),new Promise((r,o)=>{try{const s=document.createElement("a");s.href=URL.createObjectURL(t),s.download=e,document.body.appendChild(s),s.click(),setTimeout(()=>{document.body.removeChild(s),URL.revokeObjectURL(s.href),r();},100);}catch(s){this.logger.error("ダウンロードリンク作成エラー",s instanceof Error?s:void 0,{filename:e}),o(s);}})}fetchImageAsBlob(t){return this.logger.debug("fetchImageAsBlob開始",{url:t.substring(0,50)}),new Promise((e,r)=>{et({url:t,responseType:"blob",timeout:3e4}).then(o=>{const s=o.response;s?(this.logger.debug("画像ダウンロード成功",{url:t.substring(0,50),size:s.size}),e(s)):(this.logger.error("レスポンスまたはレスポンスデータが空です",void 0,{url:t}),r(new Error("Empty response")));}).catch(o=>{this.logger.error("画像ダウンロード失敗",void 0,{url:t,error:o}),r(o);});})}createZipOptions(){return {level:this.options.compressionLevel,mem:8}}createZipBlob(t){const e=t.slice().buffer;return new Blob([e],{type:"application/zip"})}getFilenameFromUrl(t){const[e]=t.split("?");let r=e?.split("/").pop()??"image.jpg";r.includes(".")||(r+=".jpg");const o=r.substring(0,r.lastIndexOf(".")),s=r.substring(r.lastIndexOf("."));let n=1,a=r;for(;this.filesData.has(a);)a=`${o}_${n}${s}`,n+=1;return a}getFormattedDate(){const t=new Date,e=t.getFullYear(),r=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0"),s=String(t.getHours()).padStart(2,"0"),n=String(t.getMinutes()).padStart(2,"0");return `${e}${r}${o}_${s}${n}`}fflateAvailable(){return typeof ct=="function"}}class Nt{constructor(t,e,r){this.uiBuilder=t,this.imageCollector=e,this.logger=r;}register(){oe("🚀起動",()=>{try{this.uiBuilder.showModal(),this.imageCollector.collectImages();}catch(t){this.logger.error("メニューコマンド実行中にエラーが発生しました",t instanceof Error?t:void 0);}}),this.logger.debug("メニューコマンドを登録しました");}}const ot=(i={})=>{const t=document.createElement("div");i.id&&(t.id=i.id),t.style.position="relative";const e=t.attachShadow({mode:i.mode??"open"});if(i.cssText){const r=document.createElement("style");r.textContent=i.cssText,e.appendChild(r);}return i.adoptStyles?.length&&i.adoptStyles.forEach(r=>{const o=document.createElement("style");o.textContent=r,e.appendChild(o);}),document.body.appendChild(t),{host:t,root:e,dispose:()=>{t.remove();}}};class Wt{constructor(t){this.logger=t,this.init();}progressContainer=null;progressBar=null;progressText=null;shadowHost=null;shadowRoot=null;show(){this.getContainer().style.display="block";}hide(){this.getContainer().style.display="none";}update(t){const e=Math.max(0,Math.min(100,t));this.getProgressBar().style.width=`${e}%`,this.getProgressText().textContent=`進捗: ${e.toFixed(0)}%`;}init(){const{host:t,root:e}=ot({id:"progress-shadow-host",mode:"closed"});this.shadowHost=t,this.shadowRoot=e;const r=document.createElement("style");r.textContent=`
      .ic.progress-container {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 5px;
        z-index: 10001;
        display: none;
      }

      .ic.progress-bar {
        height: 10px;
        background-color: #4caf50;
        border-radius: 5px;
        width: 0%;
        transition: width 0.3s ease;
      }

      .ic.progress-text {
        text-align: center;
        color: white;
        margin-top: 5px;
        font-size: 0.9rem;
      }
    `,this.shadowRoot.appendChild(r),this.progressContainer=document.createElement("div"),this.progressContainer.classList.add("ic","progress-container"),this.progressBar=document.createElement("div"),this.progressBar.classList.add("ic","progress-bar"),this.progressContainer.appendChild(this.progressBar),this.progressText=document.createElement("div"),this.progressText.classList.add("ic","progress-text"),this.progressText.textContent="進捗: 0%",this.progressContainer.appendChild(this.progressText),this.shadowRoot.appendChild(this.progressContainer),this.logger.debug("プログレスバーUIを初期化しました");}getContainer(){if(!this.progressContainer)throw new Error("Progress container is not initialized.");return this.progressContainer}getProgressBar(){if(!this.progressBar)throw new Error("Progress bar is not initialized.");return this.progressBar}getProgressText(){if(!this.progressText)throw new Error("Progress text is not initialized.");return this.progressText}}class Qt{constructor(t){this.logger=t,this.init();}toastContainer=null;shadowHost=null;shadowRoot=null;show(t,e="info",r=3e3){const o=this.getToastContainer(),s=document.createElement("div");s.classList.add("ic","toast",`ic.toast-${e}`),s.textContent=t,o.appendChild(s),setTimeout(()=>{s.classList.add("show");},10),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>{s.parentNode&&s.remove();},300);},r);}init(){const{host:t,root:e}=ot({id:"toast-shadow-host",mode:"closed"});this.shadowHost=t,this.shadowRoot=e;const r=document.createElement("style");r.textContent=`
      .ic.toast-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .ic.toast {
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .ic.toast.show {
        opacity: 1;
        transform: translateY(0);
      }

      .ic.toast-info {
        background-color: rgba(0, 123, 255, 0.9);
      }

      .ic.toast-success {
        background-color: rgba(40, 167, 69, 0.9);
      }

      .ic.toast-warning {
        background-color: rgba(255, 193, 7, 0.9);
      }

      .ic.toast-error {
        background-color: rgba(220, 53, 69, 0.9);
      }
    `,this.shadowRoot.appendChild(r),this.toastContainer=document.createElement("div"),this.toastContainer.classList.add("ic","toast-container"),this.shadowRoot.appendChild(this.toastContainer),this.logger.debug("トーストUIを初期化しました");}getToastContainer(){if(!this.toastContainer)throw new Error("Toast container is not initialized.");return this.toastContainer}}class Yt{constructor(t,e,r){this.uiBuilder=t,this.badImageHandler=e,this.logger=r;}imageQueue=[];isProcessing=false;async addImagesFastPath(t){if(!Array.isArray(t)){this.logger.error("imageItemsが配列ではありません",void 0,{type:typeof t});return}let e=0,r=0;for(const o of t)try{const{url:s,classification:n}=o;let a=null;const c=n.element;if(c instanceof HTMLImageElement&&c.naturalWidth>0&&c.naturalHeight>0&&(a={width:c.naturalWidth,height:c.naturalHeight,size:0,loaded:c.complete},this.logger.debug(`DOM要素からメタデータ取得: ${s.substring(0,50)}...`,{width:a.width,height:a.height})),!a&&(a=await this.badImageHandler.getImageMetadata(s),!a)){this.logger.warn("高速パスでもメタデータ取得に失敗しました",{url:s}),r+=1;continue}this.imageQueue.push({url:s,metadata:a}),e+=1;}catch(s){this.logger.error("高速パス画像処理中にエラーが発生しました",s instanceof Error?s:void 0,{url:o.url}),r+=1;}this.logger.debug("高速パス処理完了",{successCount:e,failureCount:r}),this.isProcessing||this.processBatch();}async addImages(t){if(!Array.isArray(t)){this.logger.error("imageUrlsが配列ではありません",void 0,{type:typeof t});return}let e=0,r=0;for(const o of t)try{const s=await this.badImageHandler.getImageMetadata(o);if(!s){this.logger.warn("画像のメタデータ取得に失敗しました",{url:o}),r+=1;continue}this.imageQueue.push({url:o,metadata:s}),e+=1;}catch(s){this.logger.error("画像メタデータの取得中にエラーが発生しました",s instanceof Error?s:void 0,{url:o}),r+=1;}this.logger.debug("画像追加処理完了",{successCount:e,failureCount:r}),this.isProcessing||this.processBatch();}async processBatch(){try{this.isProcessing=!0;const t=5,e=()=>{try{this.imageQueue.splice(0,t).forEach(({url:o,metadata:s})=>{try{this.uiBuilder.addImageToGrid(o,s);}catch(n){this.logger.error("グリッドへの画像追加中にエラーが発生しました",n instanceof Error?n:void 0,{url:o});}}),this.imageQueue.length>0?requestAnimationFrame(e):(this.isProcessing=!1,this.logger.debug("バッチ処理が完了しました"));}catch(r){this.logger.error("バッチ処理中にエラーが発生しました",r instanceof Error?r:void 0),this.isProcessing=!1;}};requestAnimationFrame(e);}catch(t){this.logger.error("バッチ処理の開始中にエラーが発生しました",t instanceof Error?t:void 0),this.isProcessing=false;}}}class Xt{constructor(t,e,r){this.config=t,this.badImageHandler=e,this.logger=r;}modal=null;gridContainer=null;closeButton=null;zipButton=null;shadowHost=null;shadowRoot=null;imageStore=new Map;buildModal(){try{const{host:t,root:e}=ot({id:"image-collector-shadow-host",mode:"closed"});this.shadowHost=t,this.shadowRoot=e,this.injectShadowStyles(this.shadowRoot),this.modal=document.createElement("div"),this.modal.classList.add("image-collector-modal"),this.gridContainer=document.createElement("div"),this.gridContainer.classList.add("ic","image-grid-container"),this.modal.appendChild(this.gridContainer),this.zipButton=document.createElement("button"),this.zipButton.classList.add("ic","zip-download-button"),this.zipButton.innerHTML=K,this.zipButton.dataset.state="initial",this.zipButton.style.display=this.config.showZipButton?"flex":"none",this.modal.appendChild(this.zipButton),this.closeButton=document.createElement("button"),this.closeButton.classList.add("ic","close-button"),this.closeButton.textContent="×",this.modal.appendChild(this.closeButton),this.shadowRoot.appendChild(this.modal),document.body.appendChild(this.shadowHost),this.logger.debug("モーダルの構築が完了しました");}catch(t){throw this.logger.error("モーダルの構築中にエラーが発生しました",t instanceof Error?t:void 0),t}}addImageToGrid(t,e){const r=this.getGridContainer(),o=this.createImageItem(t,e);r.appendChild(o);}showModal(){this.getModalElement().style.display="block";}hideModal(){const t=this.getGridContainer();t.innerHTML="",this.getModalElement().style.display="none";}setZipButtonVisibility(t){const e=this.getZipButton();e.style.display=t?"flex":"none";}setZipButtonState(t,e){const r=this.getZipButton();r.dataset.state=t,r.innerHTML=e;}get imageData(){return this.imageStore}getModalElement(){if(!this.modal)throw new Error("Modal has not been built yet.");return this.modal}getGridContainer(){if(!this.gridContainer)throw new Error("Grid container has not been built yet.");return this.gridContainer}getZipButton(){if(!this.zipButton)throw new Error("ZIP button has not been built yet.");return this.zipButton}getCloseButton(){if(!this.closeButton)throw new Error("Close button has not been built yet.");return this.closeButton}injectShadowStyles(t){const e=document.createElement("style");e.textContent=`
      .image-collector-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: none;
        z-index: 9999;
        backdrop-filter: blur(10px);
        overflow-y: auto;
      }

      .ic.image-grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        padding: 20px;
        max-width: 90%;
        margin: 0 auto;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        backdrop-filter: blur(5px);
        margin-top: 50px;
      }

      .ic.image-item {
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.2);
        transition: transform 0.3s ease;
      }

      .ic.image-item:hover {
        transform: scale(1.05);
      }

      .ic.grid-image {
        width: 100%;
        height: auto;
        display: block;
        opacity: 0.9;
        transition: opacity 0.3s ease;
      }

      .ic.grid-image:hover {
        opacity: 1;
      }

      .ic.close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10000;
        transition: color 0.3s ease;
      }

      .ic.close-button:hover {
        color: #ff4444;
      }

      .ic.zip-download-button {
        position: absolute;
        top: 20px;
        left: 20px;
        background-color: rgba(0, 123, 255, 0.2);
        border: 2px solid rgba(0, 123, 255, 0.4);
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10000;
        transition: all 0.3s ease;
        box-shadow: 0 0 15px rgba(0, 123, 255, 0.3);
      }

      .ic.zip-download-button:hover {
        background-color: rgba(0, 123, 255, 0.4);
        transform: scale(1.1);
      }

      .ic.zip-download-button[data-state="processing"] {
        background-color: rgba(255, 193, 7, 0.2);
        border-color: rgba(255, 193, 7, 0.4);
        animation: pulse 1.5s infinite;
      }

      .ic.zip-download-button[data-state="ready"] {
        background-color: rgba(40, 167, 69, 0.2);
        border-color: rgba(40, 167, 69, 0.4);
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.6);
        }
        70% {
          box-shadow: 0 0 0 15px rgba(255, 193, 7, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
        }
      }

      /* Material Icons font removed; now using inline SVG from @mdi/js */

      .ic.image-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 10px;
        text-align: center;
      }

      .ic.size-info {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 10px;
      }

      .ic.load-button {
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.load-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.full-screen-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 10002;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ic.full-screen-image {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      }

      .ic.download-button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.download-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.full-screen-close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10003;
        transition: color 0.3s ease;
      }

      .ic.full-screen-close-button:hover {
        color: #ff4444;
      }

      .ic.original-link-button {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.original-link-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.file-name-display {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 1.2rem;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 10003;
      }
    `,t.appendChild(e);}createImageItem(t,e){const r=document.createElement("div");if(r.classList.add("ic","image-item"),this.imageStore.set(t,{metadata:e,blob:null}),e.size>this.badImageHandler.maxFileSize)return r.appendChild(this.badImageHandler.createPlaceholder(t,e)),r;const o=document.createElement("img");return o.src=t,o.alt="Collected Image",o.classList.add("ic","grid-image"),o.onerror=()=>{this.logger.warn("画像の読み込みに失敗しました",{imageUrl:t});const s=this.badImageHandler.createErrorPlaceholder(t);r.replaceChildren(s);},r.appendChild(o),r}}class Kt{constructor(t,e,r){this.uiBuilder=t,this.zipDownloader=e,this.logger=r;}initialize(){this.setupModalInteractions(),this.setupZipButton(),this.setupGridInteractions(),this.logger.debug("イベントハンドラーの設定が完了しました");}setupModalInteractions(){const t=this.uiBuilder.getModalElement();t.addEventListener("click",e=>{try{e.target===t&&this.uiBuilder.hideModal();}catch(r){this.logger.error("モーダルクリックイベント処理中にエラーが発生しました",r instanceof Error?r:void 0);}}),this.uiBuilder.getCloseButton().addEventListener("click",()=>{try{this.uiBuilder.hideModal();}catch(e){this.logger.error("閉じるボタンクリック処理中にエラーが発生しました",e instanceof Error?e:void 0);}});}setupZipButton(){this.uiBuilder.getZipButton().addEventListener("click",()=>{try{const t=this.uiBuilder.getZipButton().dataset.state;t==="initial"?this.zipDownloader.prepareZip():t==="ready"&&this.zipDownloader.downloadZip();}catch(t){this.logger.error("ZIPボタンクリック処理中にエラーが発生しました",t instanceof Error?t:void 0);}});}setupGridInteractions(){this.uiBuilder.getGridContainer().addEventListener("click",e=>{try{const r=e.target;if(!(r instanceof Element))return;const o=r.closest(".ic.grid-image");if(!o)return;const s=o.src,n=o.dataset.originalUrl??s;this.showFullScreenImage(s,n);}catch(r){this.logger.error("画像クリック処理中にエラーが発生しました",r instanceof Error?r:void 0);}});}showFullScreenImage(t,e){const{root:r,dispose:o}=ot({id:"fullscreen-shadow-host",mode:"closed"}),s=document.createElement("style");s.textContent=`
      .ic.full-screen-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 10002;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ic.full-screen-image {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      }

      .ic.download-button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.download-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.full-screen-close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10003;
        transition: color 0.3s ease;
      }

      .ic.full-screen-close-button:hover {
        color: #ff4444;
      }

      .ic.original-link-button {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.original-link-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.file-name-display {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 1.2rem;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 10003;
      }
    `,r.appendChild(s);const n=document.createElement("div");n.classList.add("ic","full-screen-container");const a=document.createElement("img");a.src=t,a.classList.add("ic","full-screen-image"),n.appendChild(a);const c=document.createElement("button");c.classList.add("ic","download-button"),c.textContent="ダウンロード",c.addEventListener("click",()=>{try{this.downloadImage(t);}catch(d){this.logger.error("フルスクリーンダウンロード中にエラーが発生しました",d instanceof Error?d:void 0,{imageUrl:t});}}),n.appendChild(c);const g=document.createElement("button");g.classList.add("ic","original-link-button"),g.textContent="元ページを開く",g.addEventListener("click",()=>{window.open(e,"_blank");}),n.appendChild(g);const l=document.createElement("div");l.classList.add("ic","file-name-display"),l.textContent=e.split("/").pop()??e,n.appendChild(l);const h=document.createElement("button");h.classList.add("ic","full-screen-close-button"),h.textContent="×",h.addEventListener("click",()=>{try{o();}catch(d){this.logger.error("フルスクリーンモーダルの閉じる処理でエラーが発生しました",d instanceof Error?d:void 0);}}),n.appendChild(h),n.addEventListener("click",d=>{if(d.target===n)try{o();}catch(u){this.logger.error("フルスクリーンモーダルの削除中にエラーが発生しました",u instanceof Error?u:void 0);}}),r.appendChild(n);}async downloadImage(t){try{const r=(await et({url:t,responseType:"blob"})).response;if(!r){this.logger.error("ダウンロードしたBlobが空です",void 0,{imageUrl:t});return}const o=document.createElement("a");o.href=URL.createObjectURL(r),o.download=t.split("/").pop()??"image",document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(o.href),this.logger.debug("画像のダウンロードが完了しました",{imageUrl:t});}catch(e){this.logger.error("ダウンロード要求の作成中にエラーが発生しました",e instanceof Error?e:void 0,{imageUrl:t});}}}async function Ee(){const i=new te(Zt),t=C("ImageCollector2"),e=C("ImageCollector2:Bootstrap");e.info("legacy collector bootstrap start"),Se(i,t,e);}function Se(i,t,e){try{const r=new Tt(C("ImageCollector2:BadImageHandler")),o=new Xt(i,r,C("ImageCollector2:UIBuilder"));o.buildModal(),requestAnimationFrame(()=>{try{const s=new Wt(C("ImageCollector2:ProgressBar")),n=new Qt(C("ImageCollector2:Toast")),a=new Yt(o,r,C("ImageCollector2:UIBatchUpdater")),c=new jt(o,r,n,s,C("ImageCollector2:ZipDownloader"),i),g=new Kt(o,c,C("ImageCollector2:UIEventHandler"));g.initialize();const l=new $t(a,r,s,n,C("ImageCollector2:ImageCollectorMain"));new Nt(o,l,C("ImageCollector2:MenuRegister")).register(),se(i,C("ImageCollector2:ConfigCommands"),o),Pe({config:i,uiBuilder:o,uiBatchUpdater:a,uiEventHandler:g,imageCollectorMain:l,badImageHandler:r,toast:n,progressBar:s,zipDownloader:c}),e.info("legacy collector components initialized");}catch(s){e.error("遅延初期化中にエラーが発生しました",s instanceof Error?s:void 0);}});}catch(r){e.error("コンポーネント初期化中にエラーが発生しました",r instanceof Error?r:void 0);}}function Pe(i){kt().ImageCollector2={MenuRegister:Nt,UIBuilder:Xt,UIBatchUpdater:Yt,UIEventHandler:Kt,ImageCollectorMain:$t,BadImageHandler:Tt,ImageSourceClassifier:Dt,Toast:Qt,ProgressBar:Wt,RequestBatchLimiter:At,ImageHostManager:Ht,ZipDownloader:jt,...i,config:i.config};}class Me{constructor(t={}){this.options=t,this.log=C("ImageCollectorApp");}log;start(){this.log.info("starting legacy collector"),Ee();}}const ht=C("ImageCollector2");async function ze(){ht.info("bootstrap start");try{new Me().start(),ht.info("legacy bootstrap completed");}catch(i){ht.error("bootstrap failed",i);}}ze();

})();