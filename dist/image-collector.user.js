// ==UserScript==
// @name         image-collector
// @namespace    imageCollector
// @version      5.3.0
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

    const Be={debug:"debug",info:"info",warn:"warn",error:"error"},Pe={debug:10,info:20,warn:30,error:40};let He=s=>Pe[s]>=Pe.warn;const st=s=>{He=s;},z=s=>{const e=`[${s}]`,t={};return Object.keys(Be).forEach(r=>{const o=Be[r];t[r]=(...i)=>{if(!He(r,s))return;(console[o]??console.log)(e,...i);};}),t},De={debugMode:false,showZipButton:true,singleImageTest:false};class at{state;constructor(e){this.state={...De,...e};}get snapshot(){return {...this.state}}get debugMode(){return this.state.debugMode}get showZipButton(){return this.state.showZipButton}get singleImageTest(){return this.state.singleImageTest}isDebugEnabled(){return this.state.debugMode===true}setDebugMode(e){return this.state.debugMode=!!e,this.state.debugMode}setShowZipButton(e){return this.state.showZipButton=!!e,this.state.showZipButton}setSingleImageTest(e){return this.state.singleImageTest=!!e,this.state.singleImageTest}update(e){this.state={...this.state,...e};}}var nt=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,lt=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;function Re(){return typeof unsafeWindow<"u"?unsafeWindow:window}function ct(s,e){nt(s,e);}function gt(s,e,t){const r=Re();r.setImageCollectorDebug=o=>{const i=s.setDebugMode(o);return e.info(`デバッグモード: ${i?"オン":"オフ"}`),i},r.setImageCollectorZipButton=o=>{const i=s.setShowZipButton(o);return e.info(`ZIPボタン: ${i?"表示":"非表示"}`),t.setZipButtonVisibility(i),i},r.setSingleImageTest=o=>{const i=s.setSingleImageTest(o);return e.info(`単一画像テストモード: ${i?"オン":"オフ"}`),i};}const ie=s=>new Promise((e,t)=>{lt({url:s.url,method:s.method??"GET",headers:s.headers,data:s.data,responseType:s.responseType??"text",timeout:s.timeout,onprogress:s.onprogress,onload:r=>{e({status:r.status,statusText:r.statusText,response:r.response,finalUrl:r.finalUrl,headers:r.responseHeaders});},onerror:r=>{const o=r?.error??"unknown error";t(new Error(`GM_xmlhttpRequest failed: ${o}`));},ontimeout:()=>{t(new Error("GM_xmlhttpRequest timeout"));}});}),ht=new Set(["ar","ur"]);function dt(s){return ht.has(s)?"rtl":"ltr"}function ut(s,e){return s.replace(/\{([a-zA-Z0-9_]+)\}/g,(t,r)=>{const o=e[r];return o===void 0?t:String(o)})}function pt(s){const e=Object.keys(s.translations);let t=s.defaultLocale;const r=h=>{const n=h.toLowerCase(),c=s.aliases?.[n];if(c)return c;const d=e.find(b=>b.toLowerCase()===n);if(d)return d;const u=n.split("-")[0];return e.find(b=>b.toLowerCase().split("-")[0]===u)??null},o=()=>{const h=navigator.languages.length>0?navigator.languages:[navigator.language];for(const n of h){const c=r(n);if(c)return c}return s.fallbackLocale},i=h=>{const n=s.translations[t]?.[h];if(n)return n;const c=s.translations[s.fallbackLocale]?.[h];return c||(s.translations[s.defaultLocale]?.[h]??h)};return {locales:e,getLocale:()=>t,setLocale:h=>{t=h;},detectBrowserLocale:o,t:i,format:(h,n)=>ut(i(h),n),getTranslations:(h=t)=>s.translations[h]??s.translations[s.fallbackLocale],getDirection:(h=t)=>dt(h),getMissingTranslationKeys:h=>{const n=s.translations[s.fallbackLocale],c=s.translations[h];return Object.keys(n).filter(d=>!c[d])}}}const mt={ja:{collectComplete:"{total}枚の画像を収集しました！(高速:{fast}, 通常:{normal})",collectStart:"画像収集を開始します...",collectUnexpectedError:"画像収集中に予期しないエラーが発生しました",classifiedImages:"画像を分類しました: 高速={fast}, 通常={normal}",download:"ダウンロード",externalImagesValidating:"外部画像を検証中...",failedImagesInZip:"{count}枚の画像をZIPに含められませんでした",fullscreenOriginal:"元ページを開く",imageLoadFailed:"画像の読み込みに失敗しました",imageReady:"{processed}/{total} 画像が準備されました",loadImage:"画像を読み込む",menuLaunch:"🚀起動",noDownloadableImages:"ダウンロードできる画像がありません",noImagesFound:"処理対象の画像が見つかりませんでした",noImagesForZip:"ZIPに追加できる画像がありませんでした",progress:"進捗: {percent}%",reliableImagesProcessing:"信頼できる画像を高速処理中...",retry:"再試行",size:"サイズ: {width}x{height} ({size})",testModeOneImage:"テストモード: 1枚だけZIPに追加します",zipDownloadStarted:"ZIPファイルのダウンロードが開始されました",zipEmpty:"ZIPファイルに画像が含まれていません",zipGenerateFailed:"ZIPファイルの生成に失敗しました",zipGenerating:"ZIPファイルを生成しています...",zipLibraryUnavailable:"ZIPライブラリが読み込まれていないため、ダウンロードできません",zipManyImagesSplit:"画像が多いため、{count}個のZIPファイルに分割します",zipNoPrepared:"ZIPファイルが準備されていません。再度準備します...",zipPartStarted:"パート{part}/{total}のダウンロードが開始されました。次のパートを準備中...",zipPrepareComplete:"ZIPファイルの準備が完了しました！ボタンをクリックしてダウンロードしてください",zipPrepareFailed:"ZIPファイルの準備に失敗しました",zipPrepareStart:"ZIPファイルの準備を開始します...",zipProcessing:"現在処理中です。しばらくお待ちください...",zipReadyCount:"{processed}/{total} 画像が準備されました",zipSplitStarted:"全{count}個のZIPファイルのダウンロードを開始しました",zipTestMode:"テストモード: 単一画像のみでZIPを生成します"},en:{collectComplete:"Collected {total} image(s)! (fast: {fast}, normal: {normal})",collectStart:"Starting image collection...",collectUnexpectedError:"An unexpected error occurred while collecting images",classifiedImages:"Classified images: fast={fast}, normal={normal}",download:"Download",externalImagesValidating:"Validating external images...",failedImagesInZip:"{count} image(s) could not be included in the ZIP",fullscreenOriginal:"Open source page",imageLoadFailed:"Failed to load the image",imageReady:"{processed}/{total} image(s) are ready",loadImage:"Load image",menuLaunch:"🚀 Launch",noDownloadableImages:"There are no downloadable images",noImagesFound:"No target images were found",noImagesForZip:"No images could be added to the ZIP",progress:"Progress: {percent}%",reliableImagesProcessing:"Fast-processing trusted images...",retry:"Retry",size:"Size: {width}x{height} ({size})",testModeOneImage:"Test mode: adding only one image to the ZIP",zipDownloadStarted:"ZIP download has started",zipEmpty:"The ZIP file contains no images",zipGenerateFailed:"Failed to generate the ZIP file",zipGenerating:"Generating ZIP file...",zipLibraryUnavailable:"The ZIP library is not loaded, so the download cannot continue",zipManyImagesSplit:"Too many images; splitting into {count} ZIP files",zipNoPrepared:"The ZIP file is not prepared. Preparing it again...",zipPartStarted:"Part {part}/{total} download has started. Preparing the next part...",zipPrepareComplete:"ZIP preparation is complete. Click the button to download.",zipPrepareFailed:"Failed to prepare the ZIP file",zipPrepareStart:"Starting ZIP preparation...",zipProcessing:"Processing now. Please wait...",zipReadyCount:"{processed}/{total} image(s) are ready",zipSplitStarted:"Started downloading all {count} ZIP files",zipTestMode:"Test mode: generating a ZIP with only one image"}},re=pt({translations:mt,defaultLocale:"ja",fallbackLocale:"en"});re.setLocale(re.detectBrowserLocale());const V=re.format,f=re.t;class Ue{constructor(e){this.logger=e;}minSize=50;maxSize=5e3;maxFileSize=5*1024*1024;deletedImageSizes=[{width:320,height:320},{width:161,height:81}];async isValidImage(e){if(!e||!this.isImageUrl(e))return  false;try{const t=await this.getImageMetadata(e);return !t||this.isDeletedImage(t)||t.width<this.minSize||t.height<this.minSize||t.width>this.maxSize||t.height>this.maxSize?!1:t.size>this.maxFileSize?"large":!0}catch(t){return this.logger.error("画像のメタデータ取得中にエラーが発生しました",t,{url:e}),false}}isDeletedImage(e){return this.deletedImageSizes.some(t=>t.width===e.width&&t.height===e.height)}createPlaceholder(e,t){try{const r=document.createElement("div");r.classList.add("ic","image-placeholder");const o=document.createElement("div");o.classList.add("ic","size-info"),o.textContent=V("size",{height:String(t.height),size:this.formatBytes(t.size),width:String(t.width)});const i=document.createElement("button");return i.classList.add("ic","load-button"),i.textContent=f("loadImage"),i.addEventListener("click",()=>{try{r.replaceWith(this.createImageElement(e));}catch(a){this.logger.error("画像の読み込み中にエラーが発生しました",a,{url:e});}}),r.append(o,i),r}catch(r){this.logger.error("プレースホルダーの作成中にエラーが発生しました",r,{url:e});const o=document.createElement("div");return o.classList.add("ic","image-placeholder"),o.textContent=f("imageLoadFailed"),o}}createErrorPlaceholder(e){try{const t=document.createElement("div");t.classList.add("ic","image-placeholder"),t.style.backgroundColor="rgba(220, 53, 69, 0.2)";const r=document.createElement("div");r.textContent=f("imageLoadFailed"),r.style.color="#dc3545";const o=document.createElement("button");return o.classList.add("ic","load-button"),o.textContent=f("retry"),o.addEventListener("click",()=>{try{t.replaceWith(this.createImageElement(e));}catch(i){this.logger.error("画像の再読み込み中にエラーが発生しました",i,{url:e});}}),t.append(r,o),t}catch(t){this.logger.error("エラープレースホルダーの作成中にエラーが発生しました",t,{url:e});const r=document.createElement("div");return r.textContent=f("imageLoadFailed"),r}}createImageElement(e){const t=document.createElement("img");return t.src=e,t.classList.add("ic","grid-image"),t}async getImageMetadata(e){return new Promise((t,r)=>{try{const o=new Image;o.crossOrigin="anonymous";const i=window.setTimeout(()=>{this.logger.warn("画像サイズ取得がタイムアウトしました",{url:e}),r(new Error("Image size detection timeout"));},8e3);o.onload=()=>{try{if(window.clearTimeout(i),o.width===0||o.height===0){this.logger.warn("無効な画像サイズです",{url:e,width:o.width,height:o.height}),r(new Error("Invalid image dimensions"));return}ie({method:"HEAD",url:e,timeout:5e3}).then(a=>{try{const l=a.headers??"",g=l.match(/Content-Length:\s*(\d+)/i),h=l.match(/Content-Type:\s*([^;\n]+)/i),n=g?Number.parseInt(g[1],10):0,c=h?h[1]:"";if(!c.startsWith("image/")){this.logger.warn("画像ではないコンテンツタイプです",{url:e,contentType:c}),r(new Error("Not an image"));return}t({width:o.width,height:o.height,size:Number.isFinite(n)?n:0,loaded:o.complete});}catch(l){this.logger.error("ヘッダー解析中にエラーが発生しました",l,{url:e}),r(l);}}).catch(a=>{this.logger.error("画像メタデータ取得中にエラーが発生しました",a,{url:e}),r(new Error("HEAD request failed"));});}catch(a){this.logger.error("メタデータ取得処理でエラーが発生しました",a,{url:e}),r(a);}},o.onerror=()=>{window.clearTimeout(i),this.logger.warn("画像読み込みに失敗しました",{url:e}),r(new Error("Image load error"));},o.src=e;}catch(o){this.logger.error("メタデータ取得処理の開始中にエラーが発生しました",o,{url:e}),r(o);}})}formatBytes(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/1024/1024).toFixed(1)} MB`}isImageUrl(e){const t=[".jpg",".jpeg",".png",".gif",".webp",".svg"],r=e.toLowerCase();return t.some(o=>r.endsWith(o))}}class Ae{constructor(e){this.logger=e;}hostPatterns=[/(?:https?:\/\/)?(?:www\.)?imgur\.com\//i,/(?:https?:\/\/)?(?:www\.)?flickr\.com\//i,/(?:https?:\/\/)?(?:www\.)?pinterest\.com\//i,/(?:https?:\/\/)?(?:www\.)?deviantart\.com\//i,/(?:https?:\/\/)?(?:www\.)?artstation\.com\//i,/(?:https?:\/\/)?(?:www\.)?500px\.com\//i,/(?:https?:\/\/)?(?:www\.)?unsplash\.com\//i,/(?:https?:\/\/)?(?:www\.)?pexels\.com\//i,/(?:https?:\/\/)?(?:www\.)?pixiv\.net\//i,/(?:https?:\/\/)?(?:www\.)?tinypic\.com\//i,/(?:https?:\/\/)?(?:www\.)?postimages\.org\//i,/(?:https?:\/\/)?(?:www\.)?imgbox\.com\//i,/(?:https?:\/\/)?(?:www\.)?imagebam\.com\//i,/(?:https?:\/\/)?(?:www\.)?imagevenue\.com\//i,/(?:https?:\/\/)?(?:www\.)?imageshack\.us\//i,/(?:https?:\/\/)?(?:www\.)?photobucket\.com\//i,/(?:https?:\/\/)?(?:www\.)?freeimage\.host\//i,/(?:https?:\/\/)?(?:www\.)?ibb\.co\//i,/(?:https?:\/\/)?(?:www\.)?imgbb\.com\//i,/(?:https?:\/\/)?(?:www\.)?gyazo\.com\//i,/(?:https?:\/\/)?(?:www\.)?twitter\.com\//i,/(?:https?:\/\/)?(?:www\.)?x\.com\//i,/(?:https?:\/\/)?(?:www\.)?instagram\.com\//i,/(?:https?:\/\/)?(?:www\.)?facebook\.com\//i,/(?:https?:\/\/)?(?:www\.)?reddit\.com\//i,/(?:https?:\/\/)?(?:www\.)?tumblr\.com\//i,/(?:https?:\/\/)?(?:www\.)?weibo\.com\//i,/(?:https?:\/\/)?(?:www\.)?vk\.com\//i];isSupportedHost(e){const t=this.hostPatterns.some(r=>r.test(e));return this.logger.debug("ホストサポート判定",{url:e,supported:t}),t}addHostPattern(e){const t=e instanceof RegExp?e:new RegExp(e,"i");this.hostPatterns.push(t),this.logger.debug("ホストパターンを追加しました",{pattern:t.source});}}class $e{constructor(e){this.logger=e,this.trustedDomains=new Set([window.location.hostname,"cdn.jsdelivr.net","fonts.googleapis.com","fonts.gstatic.com"]);}trustedDomains;classifyImageSource(e,t=null){try{const r=new URL(e,window.location.href);return r.hostname===window.location.hostname?{trustLevel:"high",reason:"same-domain",fastPath:!0,element:t}:this.trustedDomains.has(r.hostname)?{trustLevel:"high",reason:"trusted-cdn",fastPath:!0,element:t}:t&&(t.tagName==="IMG"||t.tagName==="SOURCE")&&t instanceof HTMLImageElement&&t.complete&&t.naturalWidth>0?{trustLevel:"medium",reason:"loaded-dom-element",fastPath:!0,element:t}:r.protocol==="https:"?{trustLevel:"medium",reason:"https-external",fastPath:!1,element:t}:{trustLevel:"low",reason:"untrusted-source",fastPath:!1,element:t}}catch(r){return this.logger.error("画像ソース分類中にエラーが発生しました",r,{url:e}),{trustLevel:"low",reason:"classification-error",fastPath:false,element:t}}}getMetadataFromElement(e){return e instanceof HTMLImageElement?{width:e.naturalWidth||e.width||0,height:e.naturalHeight||e.height||0,size:0,loaded:e.complete}:null}}class Oe{constructor(e,t=5,r=1e3){this.logger=e,this.batchSize=t,this.delay=r;}queue=[];isProcessing=false;addRequest(e){this.queue.push(e),this.isProcessing||this.processBatch();}async processBatch(){try{this.isProcessing=!0;let e=0,t=0;for(;this.queue.length>0;){const r=this.queue.splice(0,this.batchSize);e+=1;try{const o=await Promise.allSettled(r.map(a=>a())),i=o.filter(a=>a.status==="rejected").length;t+=i,i>0&&(this.logger.warn("バッチ処理でエラーが発生しました",{batchNumber:e,batchErrors:i}),o.forEach((a,l)=>{if(a.status==="rejected"){const g=a.reason instanceof Error?a.reason:void 0;this.logger.error("バッチ処理タスクでエラーが発生しました",g,{batchNumber:e,taskIndex:l});}}));}catch(o){this.logger.error("バッチ処理中に予期しないエラーが発生しました",o,{batchNumber:e}),t+=1;}this.queue.length>0&&await new Promise(o=>setTimeout(o,this.delay));}t>0?this.logger.warn("バッチ処理完了",{processedBatches:e,totalErrors:t}):this.logger.debug("バッチ処理完了",{processedBatches:e,totalErrors:t});}catch(e){throw this.logger.error("バッチ処理中に致命的なエラーが発生しました",e),e}finally{this.isProcessing=false;}}}class Ve{constructor(e,t,r,o,i){this.uiBatchUpdater=e,this.badImageHandler=t,this.progressBar=r,this.toast=o,this.logger=i,this.imageHostManager=new Ae(z("ImageCollector2:ImageHostManager")),this.imageSourceClassifier=new $e(z("ImageCollector2:SourceClassifier")),this.requestLimiter=new Oe(z("ImageCollector2:RequestLimiter"));}imageHostManager;imageSourceClassifier;requestLimiter;async collectImages(){this.logger.debug("画像収集開始"),this.toast.show(f("collectStart"),"info"),this.progressBar.show(),this.progressBar.update(0);try{const e=new Map,t=[],r=[];this.collectFromImages(e,t,r),this.collectFromPictureSources(e,t,r),this.collectFromAnchors(e,r),this.collectFromBackgrounds(e,r),this.logger.debug("画像分類完了",{fastPath:t.length,slowPath:r.length}),this.toast.show(V("classifiedImages",{fast:String(t.length),normal:String(r.length)}),"info"),t.length>0&&(this.toast.show(f("reliableImagesProcessing"),"info"),await this.uiBatchUpdater.addImagesFastPath(t),this.progressBar.update(30)),r.length>0&&(this.toast.show(f("externalImagesValidating"),"info"),await this.processSlowPathImages(r));const o=t.length+r.length;if(o===0){this.logger.warn("処理対象の画像が0件です"),this.toast.show(f("noImagesFound"),"warning"),this.progressBar.hide();return}this.progressBar.update(100),setTimeout(()=>{this.progressBar.hide(),this.toast.show(V("collectComplete",{fast:String(t.length),normal:String(r.length),total:String(o)}),"success"),this.logger.debug("画像収集完了",{totalImages:o});},500);}catch(e){this.logger.error("画像収集処理中に予期しないエラーが発生しました",e),this.toast.show(f("collectUnexpectedError"),"error"),this.progressBar.hide();}}collectFromImages(e,t,r){document.querySelectorAll("img").forEach(o=>{try{const i=this.resolveUrl(o.src);if(!i)return;const a=this.imageSourceClassifier.classifyImageSource(i,o);e.set(i,{element:o,classification:a}),a.fastPath?(t.push({url:i,classification:a}),this.logger.debug("高速パス画像",{src:i.substring(0,50),reason:a.reason})):(r.push(i),this.logger.debug("低速パス画像",{src:i.substring(0,50),reason:a.reason}));}catch(i){this.logger.warn("img要素の処理中にエラーが発生しました",{error:i,src:o.src});}});}collectFromPictureSources(e,t,r){document.querySelectorAll("picture source").forEach(o=>{try{o.srcset.split(",").map(a=>a.trim().split(" ")[0]).filter(Boolean).forEach(a=>{const l=this.resolveUrl(a);if(!l||e.has(l))return;const g=this.imageSourceClassifier.classifyImageSource(l,o);e.set(l,{element:o,classification:g}),g.fastPath?(t.push({url:l,classification:g}),this.logger.debug("高速パス(picture)",{src:l.substring(0,50),reason:g.reason})):(r.push(l),this.logger.debug("低速パス(picture)",{src:l.substring(0,50),reason:g.reason}));});}catch(i){this.logger.warn("picture要素の処理中にエラーが発生しました",{error:i,srcset:o.srcset});}});}collectFromAnchors(e,t){document.querySelectorAll("a").forEach(r=>{try{const o=this.resolveUrl(r.href);if(!o||!this.isImageUrl(o)||e.has(o))return;const i=this.imageSourceClassifier.classifyImageSource(o);e.set(o,{element:null,classification:i}),t.push(o),this.logger.debug("低速パス(link)",{src:o.substring(0,50),reason:i.reason});}catch(o){this.logger.warn("a要素の処理中にエラーが発生しました",{error:o,href:r.href});}});}collectFromBackgrounds(e,t){document.querySelectorAll("*").forEach(r=>{try{const o=window.getComputedStyle(r).backgroundImage;if(!o||o==="none")return;const i=o.replace(/^url\(["']?/,"").replace(/["']?\)$/,""),a=this.resolveUrl(i);if(!a||e.has(a))return;const l=this.imageSourceClassifier.classifyImageSource(a);e.set(a,{element:null,classification:l}),t.push(a),this.logger.debug("低速パス(bg)",{src:a.substring(0,50),reason:l.reason});}catch(o){this.logger.warn("背景画像の処理中にエラーが発生しました",{error:o,tag:r.tagName});}});}async processSlowPathImages(e){const t=[];for(const i of e)try{if(this.imageHostManager.isSupportedHost(i)){const a=await this.getSnsImageUrl(i);t.push(a);}else t.push(i);}catch(a){this.logger.warn("SNS画像URL解決中にエラーが発生しました",{error:a,url:i}),t.push(i);}const o=(await Promise.allSettled(t.map(async i=>{try{return await this.badImageHandler.isValidImage(i)?i:null}catch(a){return this.logger.warn("画像検証中にエラーが発生しました",{error:a,url:i}),null}}))).filter(i=>i.status==="fulfilled").map(i=>i.value).filter(i=>i!==null);o.length>0&&await this.uiBatchUpdater.addImages(o),this.progressBar.update(60);}resolveUrl(e){if(!e)return null;try{if(e.includes("?http")){const t=e.split("?http")[1];if(t)return new URL(`http${t}`).href}return new URL(e,window.location.href).href}catch(t){return this.logger.debug("URL解決に失敗しました",{url:e,error:t}),null}}isImageUrl(e){if(!e)return  false;const t=[".jpg",".jpeg",".png",".gif",".webp",".svg"],r=e.toLowerCase();return t.some(o=>r.endsWith(o))}async getSnsImageUrl(e){return /(twitter\.com|x\.com)/i.test(e)?new Promise(t=>{ie({url:e,responseType:"text"}).then(r=>{try{const o=new DOMParser,i=String(r.response.responseText??""),l=o.parseFromString(i,"text/html").querySelector('meta[property="og:image"]');l?.getAttribute("content")?t(l.getAttribute("content")??e):t(e);}catch(o){this.logger.warn("SNS画像の解析中にエラーが発生しました",{error:o,url:e}),t(e);}}).catch(r=>{this.logger.warn("SNS画像URL取得中にエラーが発生しました",{error:r,url:e}),t(e);});}):e}}var B=Uint8Array,k=Uint16Array,be=Int32Array,ve=new B([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),ye=new B([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Le=new B([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ge=function(s,e){for(var t=new k(31),r=0;r<31;++r)t[r]=e+=1<<s[r-1];for(var o=new be(t[30]),r=1;r<30;++r)for(var i=t[r];i<t[r+1];++i)o[i]=i-t[r]<<5|r;return {b:t,r:o}},qe=Ge(ve,2),ft=qe.b,pe=qe.r;ft[28]=258,pe[258]=28;var wt=Ge(ye,0),Me=wt.r,me=new k(32768);for(var w=0;w<32768;++w){var N=(w&43690)>>1|(w&21845)<<1;N=(N&52428)>>2|(N&13107)<<2,N=(N&61680)>>4|(N&3855)<<4,me[w]=((N&65280)>>8|(N&255)<<8)>>1;}var te=(function(s,e,t){for(var r=s.length,o=0,i=new k(e);o<r;++o)s[o]&&++i[s[o]-1];var a=new k(e);for(o=1;o<e;++o)a[o]=a[o-1]+i[o-1]<<1;var l;for(l=new k(r),o=0;o<r;++o)s[o]&&(l[o]=me[a[s[o]-1]++]>>15-s[o]);return l}),_=new B(288);for(var w=0;w<144;++w)_[w]=8;for(var w=144;w<256;++w)_[w]=9;for(var w=256;w<280;++w)_[w]=7;for(var w=280;w<288;++w)_[w]=8;var oe=new B(32);for(var w=0;w<32;++w)oe[w]=5;var bt=te(_,9),vt=te(oe,5),Ne=function(s){return (s+7)/8|0},_e=function(s,e,t){return (t==null||t>s.length)&&(t=s.length),new B(s.subarray(e,t))},yt=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],se=function(s,e,t){var r=new Error(e||yt[s]);if(r.code=s,Error.captureStackTrace&&Error.captureStackTrace(r,se),!t)throw r;return r},G=function(s,e,t){t<<=e&7;var r=e/8|0;s[r]|=t,s[r+1]|=t>>8;},X=function(s,e,t){t<<=e&7;var r=e/8|0;s[r]|=t,s[r+1]|=t>>8,s[r+2]|=t>>16;},he=function(s,e){for(var t=[],r=0;r<s.length;++r)s[r]&&t.push({s:r,f:s[r]});var o=t.length,i=t.slice();if(!o)return {t:We,l:0};if(o==1){var a=new B(t[0].s+1);return a[t[0].s]=1,{t:a,l:1}}t.sort(function(L,M){return L.f-M.f}),t.push({s:-1,f:25001});var l=t[0],g=t[1],h=0,n=1,c=2;for(t[0]={s:-1,f:l.f+g.f,l,r:g};n!=o-1;)l=t[t[h].f<t[c].f?h++:c++],g=t[h!=n&&t[h].f<t[c].f?h++:c++],t[n++]={s:-1,f:l.f+g.f,l,r:g};for(var d=i[0].s,r=1;r<o;++r)i[r].s>d&&(d=i[r].s);var u=new k(d+1),b=fe(t[n-1],u,0);if(b>e){var r=0,v=0,P=b-e,R=1<<P;for(i.sort(function(M,y){return u[y.s]-u[M.s]||M.f-y.f});r<o;++r){var T=i[r].s;if(u[T]>e)v+=R-(1<<b-u[T]),u[T]=e;else break}for(v>>=P;v>0;){var U=i[r].s;u[U]<e?v-=1<<e-u[U]++-1:++r;}for(;r>=0&&v;--r){var x=i[r].s;u[x]==e&&(--u[x],++v);}b=e;}return {t:new B(u),l:b}},fe=function(s,e,t){return s.s==-1?Math.max(fe(s.l,e,t+1),fe(s.r,e,t+1)):e[s.s]=t},Ee=function(s){for(var e=s.length;e&&!s[--e];);for(var t=new k(++e),r=0,o=s[0],i=1,a=function(g){t[r++]=g;},l=1;l<=e;++l)if(s[l]==o&&l!=e)++i;else {if(!o&&i>2){for(;i>138;i-=138)a(32754);i>2&&(a(i>10?i-11<<5|28690:i-3<<5|12305),i=0);}else if(i>3){for(a(o),--i;i>6;i-=6)a(8304);i>2&&(a(i-3<<5|8208),i=0);}for(;i--;)a(o);i=1,o=s[l];}return {c:t.subarray(0,r),n:e}},J=function(s,e){for(var t=0,r=0;r<e.length;++r)t+=s[r]*e[r];return t},je=function(s,e,t){var r=t.length,o=Ne(e+2);s[o]=r&255,s[o+1]=r>>8,s[o+2]=s[o]^255,s[o+3]=s[o+1]^255;for(var i=0;i<r;++i)s[o+i+4]=t[i];return (o+4+r)*8},Ze=function(s,e,t,r,o,i,a,l,g,h,n){G(e,n++,t),++o[256];for(var c=he(o,15),d=c.t,u=c.l,b=he(i,15),v=b.t,P=b.l,R=Ee(d),T=R.c,U=R.n,x=Ee(v),L=x.c,M=x.n,y=new k(19),m=0;m<T.length;++m)++y[T[m]&31];for(var m=0;m<L.length;++m)++y[L[m]&31];for(var p=he(y,7),E=p.t,j=p.l,Z=19;Z>4&&!E[Le[Z-1]];--Z);var W=h+5<<3,F=J(o,_)+J(i,oe)+a,H=J(o,d)+J(i,v)+a+14+3*Z+J(y,E)+2*y[16]+3*y[17]+7*y[18];if(g>=0&&W<=F&&W<=H)return je(e,n,s.subarray(g,g+h));var A,I,D,q;if(G(e,n,1+(H<F)),n+=2,H<F){A=te(d,u),I=d,D=te(v,P),q=v;var ne=te(E,j);G(e,n,U-257),G(e,n+5,M-1),G(e,n+10,Z-4),n+=14;for(var m=0;m<Z;++m)G(e,n+3*m,E[Le[m]]);n+=3*Z;for(var $=[T,L],K=0;K<2;++K)for(var Q=$[K],m=0;m<Q.length;++m){var O=Q[m]&31;G(e,n,ne[O]),n+=E[O],O>15&&(G(e,n,Q[m]>>5&127),n+=Q[m]>>12);}}else A=bt,I=_,D=vt,q=oe;for(var m=0;m<l;++m){var S=r[m];if(S>255){var O=S>>18&31;X(e,n,A[O+257]),n+=I[O+257],O>7&&(G(e,n,S>>23&31),n+=ve[O]);var Y=S&31;X(e,n,D[Y]),n+=q[Y],Y>3&&(X(e,n,S>>5&8191),n+=ye[Y]);}else X(e,n,A[S]),n+=I[S];}return X(e,n,A[256]),n+I[256]},xt=new be([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),We=new B(0),It=function(s,e,t,r,o,i){var a=i.z||s.length,l=new B(r+a+5*(1+Math.ceil(a/7e3))+o),g=l.subarray(r,l.length-o),h=i.l,n=(i.r||0)&7;if(e){n&&(g[0]=i.r>>3);for(var c=xt[e-1],d=c>>13,u=c&8191,b=(1<<t)-1,v=i.p||new k(32768),P=i.h||new k(b+1),R=Math.ceil(t/3),T=2*R,U=function(ge){return (s[ge]^s[ge+1]<<R^s[ge+2]<<T)&b},x=new be(25e3),L=new k(288),M=new k(32),y=0,m=0,p=i.i||0,E=0,j=i.w||0,Z=0;p+2<a;++p){var W=U(p),F=p&32767,H=P[W];if(v[F]=H,P[W]=F,j<=p){var A=a-p;if((y>7e3||E>24576)&&(A>423||!h)){n=Ze(s,g,0,x,L,M,m,E,Z,p-Z,n),E=y=m=0,Z=p;for(var I=0;I<286;++I)L[I]=0;for(var I=0;I<30;++I)M[I]=0;}var D=2,q=0,ne=u,$=F-H&32767;if(A>2&&W==U(p-$))for(var K=Math.min(d,A)-1,Q=Math.min(32767,p),O=Math.min(258,A);$<=Q&&--ne&&F!=H;){if(s[p+D]==s[p+D-$]){for(var S=0;S<O&&s[p+S]==s[p+S-$];++S);if(S>D){if(D=S,q=$,S>K)break;for(var Y=Math.min($,S-2),Ie=0,I=0;I<Y;++I){var le=p-$+I&32767,it=v[le],Ce=le-it&32767;Ce>Ie&&(Ie=Ce,H=le);}}}F=H,H=v[F],$+=F-H&32767;}if(q){x[E++]=268435456|pe[D]<<18|Me[q];var Se=pe[D]&31,ze=Me[q]&31;m+=ve[Se]+ye[ze],++L[257+Se],++M[ze],j=p+D,++y;}else x[E++]=s[p],++L[s[p]];}}for(p=Math.max(p,j);p<a;++p)x[E++]=s[p],++L[s[p]];n=Ze(s,g,h,x,L,M,m,E,Z,p-Z,n),h||(i.r=n&7|g[n/8|0]<<3,n-=7,i.h=P,i.p=v,i.i=p,i.w=j);}else {for(var p=i.w||0;p<a+h;p+=65535){var ce=p+65535;ce>=a&&(g[n/8|0]=h,ce=a),n=je(g,n+1,s.subarray(p,ce));}i.i=a;}return _e(l,0,r+Ne(n)+o)},Ct=(function(){for(var s=new Int32Array(256),e=0;e<256;++e){for(var t=e,r=9;--r;)t=(t&1&&-306674912)^t>>>1;s[e]=t;}return s})(),St=function(){var s=-1;return {p:function(e){for(var t=s,r=0;r<e.length;++r)t=Ct[t&255^e[r]]^t>>>8;s=t;},d:function(){return ~s}}},zt=function(s,e,t,r,o){if(!o&&(o={l:1},e.dictionary)){var i=e.dictionary.subarray(-32768),a=new B(i.length+s.length);a.set(i),a.set(s,i.length),s=a,o.w=i.length;}return It(s,e.level==null?6:e.level,e.mem==null?o.l?Math.ceil(Math.max(8,Math.min(13,Math.log(s.length)))*1.5):20:12+e.mem,t,r,o)},Qe=function(s,e){var t={};for(var r in s)t[r]=s[r];for(var r in e)t[r]=e[r];return t},C=function(s,e,t){for(;t;++e)s[e]=t,t>>>=8;};function Bt(s,e){return zt(s,e||{},0,0)}var Ye=function(s,e,t,r){for(var o in s){var i=s[o],a=e+o,l=r;Array.isArray(i)&&(l=Qe(r,i[1]),i=i[0]),i instanceof B?t[a]=[i,l]:(t[a+="/"]=[new B(0),l],Ye(i,a,t,r));}},ke=typeof TextEncoder<"u"&&new TextEncoder,Pt=typeof TextDecoder<"u"&&new TextDecoder,Lt=0;try{Pt.decode(We,{stream:!0}),Lt=1;}catch{}function Te(s,e){var t;if(ke)return ke.encode(s);for(var r=s.length,o=new B(s.length+(s.length>>1)),i=0,a=function(h){o[i++]=h;},t=0;t<r;++t){if(i+5>o.length){var l=new B(i+8+(r-t<<1));l.set(o),o=l;}var g=s.charCodeAt(t);g<128||e?a(g):g<2048?(a(192|g>>6),a(128|g&63)):g>55295&&g<57344?(g=65536+(g&1047552)|s.charCodeAt(++t)&1023,a(240|g>>18),a(128|g>>12&63),a(128|g>>6&63),a(128|g&63)):(a(224|g>>12),a(128|g>>6&63),a(128|g&63));}return _e(o,0,i)}var we=function(s){var e=0;if(s)for(var t in s){var r=s[t].length;r>65535&&se(9),e+=r+4;}return e},Fe=function(s,e,t,r,o,i,a,l){var g=r.length,h=t.extra,n=l&&l.length,c=we(h);C(s,e,a!=null?33639248:67324752),e+=4,a!=null&&(s[e++]=20,s[e++]=t.os),s[e]=20,e+=2,s[e++]=t.flag<<1|(i<0&&8),s[e++]=o&&8,s[e++]=t.compression&255,s[e++]=t.compression>>8;var d=new Date(t.mtime==null?Date.now():t.mtime),u=d.getFullYear()-1980;if((u<0||u>119)&&se(10),C(s,e,u<<25|d.getMonth()+1<<21|d.getDate()<<16|d.getHours()<<11|d.getMinutes()<<5|d.getSeconds()>>1),e+=4,i!=-1&&(C(s,e,t.crc),C(s,e+4,i<0?-i-2:i),C(s,e+8,t.size)),C(s,e+12,g),C(s,e+14,c),e+=16,a!=null&&(C(s,e,n),C(s,e+6,t.attrs),C(s,e+10,a),e+=14),s.set(r,e),e+=g,c)for(var b in h){var v=h[b],P=v.length;C(s,e,+b),C(s,e+2,P),s.set(v,e+4),e+=4+P;}return n&&(s.set(l,e),e+=n),e},Mt=function(s,e,t,r,o){C(s,e,101010256),C(s,e+8,t),C(s,e+10,t),C(s,e+12,r),C(s,e+16,o);};function de(s,e){e||(e={});var t={},r=[];Ye(s,"",t,e);var o=0,i=0;for(var a in t){var l=t[a],g=l[0],h=l[1],n=h.level==0?0:8,c=Te(a),d=c.length,u=h.comment,b=u&&Te(u),v=b&&b.length,P=we(h.extra);d>65535&&se(11);var R=n?Bt(g,h):g,T=R.length,U=St();U.p(g),r.push(Qe(h,{size:g.length,crc:U.d(),c:R,f:c,m:b,u:d!=a.length||b&&u.length!=v,o,compression:n})),o+=30+d+P+T,i+=76+2*(d+P)+(v||0)+T;}for(var x=new B(i+22),L=o,M=i-o,y=0;y<r.length;++y){var c=r[y];Fe(x,c.o,c,c.f,c.u,c.c.length);var m=30+c.f.length+we(c.extra);x.set(c.c,c.o+m),Fe(x,o,c,c.f,c.u,c.c.length,c.o,c.m),o+=16+m+(c.m?c.m.length:0);}return Mt(x,o,r.length,M,L),x}var Et="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z",Zt="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z",kt="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z";function xe(s,e=24){const t=String(e),r=String(e);return `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${s}"></path></svg>`}const ee=xe(Zt),Tt=xe(Et),Ft=xe(kt),Ht={maxZipSize:500*1024*1024,maxImagesPerZip:300,compressionLevel:6,splitZipFiles:true};class Ke{constructor(e,t,r,o,i,a,l=Ht){this.uiBuilder=e,this.badImageHandler=t,this.toast=r,this.progressBar=o,this.logger=i,this.config=a,this.options=l;}filesData=new Map;downloadedUrls=new Set;isProcessing=false;async prepareZip(){if(this.logger.debug("prepareZip開始"),this.isProcessing){this.logger.debug("既に処理中のため、prepareZipをスキップ"),this.toast.show(f("zipProcessing"),"info");return}this.isProcessing=true;try{this.filesData.clear(),this.uiBuilder.setZipButtonState("processing",Ft),this.toast.show(f("zipPrepareStart"),"info"),this.progressBar.show(),this.progressBar.update(0);let e=Array.from(this.uiBuilder.imageData.keys());this.config.singleImageTest&&e.length>0&&(this.logger.debug("単一画像テストモード: 最初の1枚だけ処理します"),e=[e[0]],this.toast.show(f("testModeOneImage"),"warning"));const t=e.length;if(this.logger.debug(`画像URL ${t}件を収集`),t===0){this.toast.show(f("noDownloadableImages"),"error"),this.uiBuilder.setZipButtonState("initial",ee);return}let r=0,o=0,i=0;const a=[],l=this.uiBuilder.imageData;for(const[h,n]of e.entries())try{this.logger.debug(`画像情報収集 ${h+1}/${t}: ${n.substring(0,50)}...`);const c=l.get(n);if(!c){this.logger.error("画像データが見つかりません",void 0,{url:n}),o+=1;continue}if(this.logger.debug("メタデータ",{width:c.metadata?.width,height:c.metadata?.height,size:c.metadata?.size,hasBlob:c.blob!==null}),c.blob)i+=1,this.logger.debug("既存のBlobを使用",{size:c.blob.size});else try{const u=await this.fetchImageAsBlob(n);c.blob=u,l.set(n,c),this.logger.debug("Blobダウンロード成功",{size:u.size});}catch(u){this.logger.error("画像のダウンロードに失敗しました",u,{url:n}),o+=1;continue}const d=this.getFilenameFromUrl(n);a.push({url:n,entry:c,fileName:d});}catch(c){this.logger.error("画像メタデータ処理中にエラーが発生しました",c,{url:n,index:h}),o+=1;}this.logger.debug("並列処理開始",{count:a.length}),a.length===0&&this.toast.show(f("noImagesForZip"),"warning");const g=await Promise.all(a.map(async({url:h,entry:n,fileName:c},d)=>{try{if(!n.blob)return this.logger.error("Blobが存在しません",void 0,{url:h,fileName:c}),{success:!1,url:h,fileName:c};this.logger.debug("画像変換",{index:d+1,fileName:c});const u=new Uint8Array(await n.blob.arrayBuffer());return u.byteLength===0?(this.logger.warn("変換後のデータが空です",{url:h,fileName:c}),{success:!1,url:h,fileName:c}):{success:!0,url:h,fileName:c,bytes:u}}catch(u){return this.logger.error("画像処理中にエラーが発生しました",u,{url:h,fileName:c}),{success:!1,url:h,fileName:c}}}));for(const h of g){h.success&&h.bytes?(this.filesData.set(h.fileName,h.bytes),this.downloadedUrls.add(h.url),r+=1):o+=1;const n=r/t*100;this.progressBar.update(n);}this.logger.debug("並列処理完了",{processed:r,failed:o,skipped:i,filesCount:this.filesData.size}),this.toast.show(V("zipReadyCount",{processed:String(r),total:String(t)}),"info"),this.config.singleImageTest&&(this.logger.debug("単一画像テストモードで実行されました"),this.toast.show(f("zipTestMode"),"info")),o>0&&this.toast.show(V("failedImagesInZip",{count:String(o)}),"warning"),r>0?(this.toast.show(f("zipPrepareComplete"),"success"),this.uiBuilder.setZipButtonState("ready",Tt)):(this.logger.error("処理された画像が0件です",void 0,{total:t,processed:r,failed:o}),this.toast.show(f("zipGenerateFailed"),"error"),this.uiBuilder.setZipButtonState("initial",ee),this.filesData.clear());}catch(e){this.logger.error("ZIP準備中にエラーが発生しました",e,{filesDataSize:this.filesData.size}),this.toast.show(f("zipPrepareFailed"),"error"),this.uiBuilder.setZipButtonState("initial",ee),this.filesData.clear();}finally{this.progressBar.hide(),this.isProcessing=false;}}async downloadZip(){if(this.logger.debug("downloadZip開始"),!this.fflateAvailable()){this.toast.show(f("zipLibraryUnavailable"),"error"),this.logger.error("fflate利用不可のためダウンロード中止");return}if(this.filesData.size===0){this.logger.warn("ファイルデータが空のため準備からやり直し"),this.toast.show(f("zipNoPrepared"),"warning"),await this.prepareZip();return}const e=Array.from(this.filesData.entries());if(e.length===0){this.logger.error("ZIPファイルが空です"),this.toast.show(f("zipEmpty"),"error"),this.uiBuilder.setZipButtonState("initial",ee);return}this.logger.debug("ZIP内のファイル数",{count:e.length});try{this.isProcessing=!0,this.toast.show(f("zipGenerating"),"info"),this.progressBar.show();const t=e.length;this.options.splitZipFiles&&t>this.options.maxImagesPerZip?await this.generateSplitZips(e,t):await this.generateSingleZip(e);}catch(t){this.logger.error("ZIPダウンロード中に詳細エラー情報",t,{filesDataSize:this.filesData.size}),this.toast.show(f("zipGenerateFailed"),"error");}finally{this.progressBar.hide(),this.uiBuilder.setZipButtonState("initial",'<span class="ic material-icons">download</span>'),this.isProcessing=false;}}async generateSingleZip(e){this.logger.debug("単一ZIPファイル生成開始");const t=performance.now(),r={};for(const[g,h]of e)r[g]=h;const o=this.createZipOptions(),i=de(r,o);if(this.logger.debug("ZIP生成時間",{milliseconds:Math.round(performance.now()-t)}),!i)throw new Error("ZIP生成結果がnullです");const a=this.createZipBlob(i),l=`images_${this.getFormattedDate()}.zip`;await this.triggerDownload(a,l),this.toast.show(f("zipDownloadStarted"),"success");}async generateSplitZips(e,t){this.logger.debug("分割ZIPファイル生成開始",{totalEntries:t});const r=Math.ceil(t/this.options.maxImagesPerZip);this.toast.show(V("zipManyImagesSplit",{count:String(r)}),"info");for(let o=0;o<r;o+=1){const i=o*this.options.maxImagesPerZip,a=Math.min((o+1)*this.options.maxImagesPerZip,t),l=e.slice(i,a);this.logger.debug("分割ZIP生成",{part:o+1,start:i+1,end:a}),this.progressBar.update(o/r*100);const g={};for(const[d,u]of l)g[d]=u;const h=de(g,this.createZipOptions()),n=this.createZipBlob(h),c=`images_${this.getFormattedDate()}_part${o+1}of${r}.zip`;await this.triggerDownload(n,c),o<r-1&&(this.toast.show(V("zipPartStarted",{part:String(o+1),total:String(r)}),"success"),await new Promise(d=>setTimeout(d,1500)));}this.toast.show(V("zipSplitStarted",{count:String(r)}),"success");}triggerDownload(e,t){return this.logger.debug("ダウンロード開始",{filename:t}),new Promise((r,o)=>{try{const i=document.createElement("a");i.href=URL.createObjectURL(e),i.download=t,document.body.appendChild(i),i.click(),setTimeout(()=>{document.body.removeChild(i),URL.revokeObjectURL(i.href),r();},100);}catch(i){this.logger.error("ダウンロードリンク作成エラー",i,{filename:t}),o(i);}})}fetchImageAsBlob(e){return this.logger.debug("fetchImageAsBlob開始",{url:e.substring(0,50)}),new Promise((t,r)=>{ie({url:e,responseType:"blob",timeout:3e4}).then(o=>{const i=o.response;i?(this.logger.debug("画像ダウンロード成功",{url:e.substring(0,50),size:i.size}),t(i)):(this.logger.error("レスポンスまたはレスポンスデータが空です",void 0,{url:e}),r(new Error("Empty response")));}).catch(o=>{this.logger.error("画像ダウンロード失敗",void 0,{url:e,error:o}),r(o);});})}createZipOptions(){return {level:this.options.compressionLevel,mem:8}}createZipBlob(e){const t=e.slice().buffer;return new Blob([t],{type:"application/zip"})}getFilenameFromUrl(e){const[t]=e.split("?");let r=t?.split("/").pop()??"image.jpg";r.includes(".")||(r+=".jpg");const o=r.substring(0,r.lastIndexOf(".")),i=r.substring(r.lastIndexOf("."));let a=1,l=r;for(;this.filesData.has(l);)l=`${o}_${a}${i}`,a+=1;return l}getFormattedDate(){const e=new Date,t=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0"),i=String(e.getHours()).padStart(2,"0"),a=String(e.getMinutes()).padStart(2,"0");return `${t}${r}${o}_${i}${a}`}fflateAvailable(){return typeof de=="function"}}class Xe{constructor(e,t,r){this.uiBuilder=e,this.imageCollector=t,this.logger=r;}register(){ct(f("menuLaunch"),()=>{try{this.uiBuilder.showModal(),this.imageCollector.collectImages();}catch(e){this.logger.error("メニューコマンド実行中にエラーが発生しました",e);}}),this.logger.debug("メニューコマンドを登録しました");}}const ae=(s={})=>{const e=document.createElement("div");s.id&&(e.id=s.id),e.style.position="relative";const t=e.attachShadow({mode:s.mode??"open"});if(s.cssText){const r=document.createElement("style");r.textContent=s.cssText,t.appendChild(r);}return s.adoptStyles?.length&&s.adoptStyles.forEach(r=>{const o=document.createElement("style");o.textContent=r,t.appendChild(o);}),document.body.appendChild(e),{host:e,root:t,dispose:()=>{e.remove();}}};class Je{constructor(e){this.logger=e,this.init();}progressContainer=null;progressBar=null;progressText=null;shadowHost=null;shadowRoot=null;show(){this.getContainer().style.display="block";}hide(){this.getContainer().style.display="none";}update(e){const t=Math.max(0,Math.min(100,e));this.getProgressBar().style.width=`${t}%`,this.getProgressText().textContent=V("progress",{percent:t.toFixed(0)});}init(){const{host:e,root:t}=ae({id:"progress-shadow-host",mode:"closed"});this.shadowHost=e,this.shadowRoot=t;const r=document.createElement("style");r.textContent=`
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
    `,this.shadowRoot.appendChild(r),this.progressContainer=document.createElement("div"),this.progressContainer.classList.add("ic","progress-container"),this.progressBar=document.createElement("div"),this.progressBar.classList.add("ic","progress-bar"),this.progressContainer.appendChild(this.progressBar),this.progressText=document.createElement("div"),this.progressText.classList.add("ic","progress-text"),this.progressText.textContent=V("progress",{percent:"0"}),this.progressContainer.appendChild(this.progressText),this.shadowRoot.appendChild(this.progressContainer),this.logger.debug("プログレスバーUIを初期化しました");}getContainer(){if(!this.progressContainer)throw new Error("Progress container is not initialized.");return this.progressContainer}getProgressBar(){if(!this.progressBar)throw new Error("Progress bar is not initialized.");return this.progressBar}getProgressText(){if(!this.progressText)throw new Error("Progress text is not initialized.");return this.progressText}}class et{constructor(e){this.logger=e,this.init();}toastContainer=null;shadowHost=null;shadowRoot=null;show(e,t="info",r=3e3){const o=this.getToastContainer(),i=document.createElement("div");i.classList.add("ic","toast",`ic.toast-${t}`),i.textContent=e,o.appendChild(i),setTimeout(()=>{i.classList.add("show");},10),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>{i.parentNode&&i.remove();},300);},r);}init(){const{host:e,root:t}=ae({id:"toast-shadow-host",mode:"closed"});this.shadowHost=e,this.shadowRoot=t;const r=document.createElement("style");r.textContent=`
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
    `,this.shadowRoot.appendChild(r),this.toastContainer=document.createElement("div"),this.toastContainer.classList.add("ic","toast-container"),this.shadowRoot.appendChild(this.toastContainer),this.logger.debug("トーストUIを初期化しました");}getToastContainer(){if(!this.toastContainer)throw new Error("Toast container is not initialized.");return this.toastContainer}}class tt{constructor(e,t,r){this.uiBuilder=e,this.badImageHandler=t,this.logger=r;}imageQueue=[];isProcessing=false;async addImagesFastPath(e){if(!Array.isArray(e)){this.logger.error("imageItemsが配列ではありません",void 0,{type:typeof e});return}let t=0,r=0;for(const o of e)try{const{url:i,classification:a}=o;let l=null;const g=a.element;if(g instanceof HTMLImageElement&&g.naturalWidth>0&&g.naturalHeight>0&&(l={width:g.naturalWidth,height:g.naturalHeight,size:0,loaded:g.complete},this.logger.debug(`DOM要素からメタデータ取得: ${i.substring(0,50)}...`,{width:l.width,height:l.height})),!l&&(l=await this.badImageHandler.getImageMetadata(i),!l)){this.logger.warn("高速パスでもメタデータ取得に失敗しました",{url:i}),r+=1;continue}this.imageQueue.push({url:i,metadata:l}),t+=1;}catch(i){this.logger.error("高速パス画像処理中にエラーが発生しました",i,{url:o.url}),r+=1;}this.logger.debug("高速パス処理完了",{successCount:t,failureCount:r}),this.isProcessing||this.processBatch();}async addImages(e){if(!Array.isArray(e)){this.logger.error("imageUrlsが配列ではありません",void 0,{type:typeof e});return}let t=0,r=0;for(const o of e)try{const i=await this.badImageHandler.getImageMetadata(o);if(!i){this.logger.warn("画像のメタデータ取得に失敗しました",{url:o}),r+=1;continue}this.imageQueue.push({url:o,metadata:i}),t+=1;}catch(i){this.logger.error("画像メタデータの取得中にエラーが発生しました",i,{url:o}),r+=1;}this.logger.debug("画像追加処理完了",{successCount:t,failureCount:r}),this.isProcessing||this.processBatch();}async processBatch(){try{this.isProcessing=!0;const e=5,t=()=>{try{this.imageQueue.splice(0,e).forEach(({url:o,metadata:i})=>{try{this.uiBuilder.addImageToGrid(o,i);}catch(a){this.logger.error("グリッドへの画像追加中にエラーが発生しました",a,{url:o});}}),this.imageQueue.length>0?requestAnimationFrame(t):(this.isProcessing=!1,this.logger.debug("バッチ処理が完了しました"));}catch(r){this.logger.error("バッチ処理中にエラーが発生しました",r),this.isProcessing=!1;}};requestAnimationFrame(t);}catch(e){this.logger.error("バッチ処理の開始中にエラーが発生しました",e),this.isProcessing=false;}}}class rt{constructor(e,t,r){this.config=e,this.badImageHandler=t,this.logger=r;}modal=null;gridContainer=null;closeButton=null;zipButton=null;shadowHost=null;shadowRoot=null;imageStore=new Map;buildModal(){try{const{host:e,root:t}=ae({id:"image-collector-shadow-host",mode:"closed"});this.shadowHost=e,this.shadowRoot=t,this.injectShadowStyles(this.shadowRoot),this.modal=document.createElement("div"),this.modal.classList.add("image-collector-modal"),this.gridContainer=document.createElement("div"),this.gridContainer.classList.add("ic","image-grid-container"),this.modal.appendChild(this.gridContainer),this.zipButton=document.createElement("button"),this.zipButton.classList.add("ic","zip-download-button"),this.zipButton.innerHTML=ee,this.zipButton.dataset.state="initial",this.zipButton.style.display=this.config.showZipButton?"flex":"none",this.modal.appendChild(this.zipButton),this.closeButton=document.createElement("button"),this.closeButton.classList.add("ic","close-button"),this.closeButton.textContent="×",this.modal.appendChild(this.closeButton),this.shadowRoot.appendChild(this.modal),document.body.appendChild(this.shadowHost),this.logger.debug("モーダルの構築が完了しました");}catch(e){throw this.logger.error("モーダルの構築中にエラーが発生しました",e),e}}addImageToGrid(e,t){const r=this.getGridContainer(),o=this.createImageItem(e,t);r.appendChild(o);}showModal(){this.getModalElement().style.display="block";}hideModal(){const e=this.getGridContainer();e.innerHTML="",this.getModalElement().style.display="none";}setZipButtonVisibility(e){const t=this.getZipButton();t.style.display=e?"flex":"none";}setZipButtonState(e,t){const r=this.getZipButton();r.dataset.state=e,r.innerHTML=t;}get imageData(){return this.imageStore}getModalElement(){if(!this.modal)throw new Error("Modal has not been built yet.");return this.modal}getGridContainer(){if(!this.gridContainer)throw new Error("Grid container has not been built yet.");return this.gridContainer}getZipButton(){if(!this.zipButton)throw new Error("ZIP button has not been built yet.");return this.zipButton}getCloseButton(){if(!this.closeButton)throw new Error("Close button has not been built yet.");return this.closeButton}injectShadowStyles(e){const t=document.createElement("style");t.textContent=`
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
    `,e.appendChild(t);}createImageItem(e,t){const r=document.createElement("div");if(r.classList.add("ic","image-item"),this.imageStore.set(e,{metadata:t,blob:null}),t.size>this.badImageHandler.maxFileSize)return r.appendChild(this.badImageHandler.createPlaceholder(e,t)),r;const o=document.createElement("img");return o.src=e,o.alt="Collected Image",o.classList.add("ic","grid-image"),o.onerror=()=>{this.logger.warn("画像の読み込みに失敗しました",{imageUrl:e});const i=this.badImageHandler.createErrorPlaceholder(e);r.replaceChildren(i);},r.appendChild(o),r}}class ot{constructor(e,t,r){this.uiBuilder=e,this.zipDownloader=t,this.logger=r;}initialize(){this.setupModalInteractions(),this.setupZipButton(),this.setupGridInteractions(),this.logger.debug("イベントハンドラーの設定が完了しました");}setupModalInteractions(){const e=this.uiBuilder.getModalElement();e.addEventListener("click",t=>{try{t.target===e&&this.uiBuilder.hideModal();}catch(r){this.logger.error("モーダルクリックイベント処理中にエラーが発生しました",r);}}),this.uiBuilder.getCloseButton().addEventListener("click",()=>{try{this.uiBuilder.hideModal();}catch(t){this.logger.error("閉じるボタンクリック処理中にエラーが発生しました",t);}});}setupZipButton(){this.uiBuilder.getZipButton().addEventListener("click",()=>{try{const e=this.uiBuilder.getZipButton().dataset.state;e==="initial"?this.zipDownloader.prepareZip():e==="ready"&&this.zipDownloader.downloadZip();}catch(e){this.logger.error("ZIPボタンクリック処理中にエラーが発生しました",e);}});}setupGridInteractions(){this.uiBuilder.getGridContainer().addEventListener("click",t=>{try{const r=t.target;if(!(r instanceof Element))return;const o=r.closest(".ic.grid-image");if(!o)return;const i=o.src,a=o.dataset.originalUrl??i;this.showFullScreenImage(i,a);}catch(r){this.logger.error("画像クリック処理中にエラーが発生しました",r);}});}showFullScreenImage(e,t){const{root:r,dispose:o}=ae({id:"fullscreen-shadow-host",mode:"closed"}),i=document.createElement("style");i.textContent=`
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
    `,r.appendChild(i);const a=document.createElement("div");a.classList.add("ic","full-screen-container");const l=document.createElement("img");l.src=e,l.classList.add("ic","full-screen-image"),a.appendChild(l);const g=document.createElement("button");g.classList.add("ic","download-button"),g.textContent=f("download"),g.addEventListener("click",()=>{try{this.downloadImage(e);}catch(d){this.logger.error("フルスクリーンダウンロード中にエラーが発生しました",d,{imageUrl:e});}}),a.appendChild(g);const h=document.createElement("button");h.classList.add("ic","original-link-button"),h.textContent=f("fullscreenOriginal"),h.addEventListener("click",()=>{window.open(t,"_blank");}),a.appendChild(h);const n=document.createElement("div");n.classList.add("ic","file-name-display"),n.textContent=t.split("/").pop()??t,a.appendChild(n);const c=document.createElement("button");c.classList.add("ic","full-screen-close-button"),c.textContent="×",c.addEventListener("click",()=>{try{o();}catch(d){this.logger.error("フルスクリーンモーダルの閉じる処理でエラーが発生しました",d);}}),a.appendChild(c),a.addEventListener("click",d=>{if(d.target===a)try{o();}catch(u){this.logger.error("フルスクリーンモーダルの削除中にエラーが発生しました",u);}}),r.appendChild(a);}async downloadImage(e){try{const r=(await ie({url:e,responseType:"blob"})).response;if(!r){this.logger.error("ダウンロードしたBlobが空です",void 0,{imageUrl:e});return}const o=document.createElement("a");o.href=URL.createObjectURL(r),o.download=e.split("/").pop()??"image",document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(o.href),this.logger.debug("画像のダウンロードが完了しました",{imageUrl:e});}catch(t){this.logger.error("ダウンロード要求の作成中にエラーが発生しました",t,{imageUrl:e});}}}async function Dt(){const s=new at(De);st(t=>t==="warn"||t==="error"?true:s.isDebugEnabled());const e=z("ImageCollector2:Bootstrap");e.info("legacy collector bootstrap start"),Rt(s,e);}function Rt(s,e){try{const t=new Ue(z("ImageCollector2:BadImageHandler")),r=new rt(s,t,z("ImageCollector2:UIBuilder"));r.buildModal(),requestAnimationFrame(()=>{try{const o=new Je(z("ImageCollector2:ProgressBar")),i=new et(z("ImageCollector2:Toast")),a=new tt(r,t,z("ImageCollector2:UIBatchUpdater")),l=new Ke(r,t,i,o,z("ImageCollector2:ZipDownloader"),s),g=new ot(r,l,z("ImageCollector2:UIEventHandler"));g.initialize();const h=new Ve(a,t,o,i,z("ImageCollector2:ImageCollectorMain"));new Xe(r,h,z("ImageCollector2:MenuRegister")).register(),gt(s,z("ImageCollector2:ConfigCommands"),r),Ut({config:s,uiBuilder:r,uiBatchUpdater:a,uiEventHandler:g,imageCollectorMain:h,badImageHandler:t,toast:i,progressBar:o,zipDownloader:l}),e.info("legacy collector components initialized");}catch(o){e.error("遅延初期化中にエラーが発生しました",o);}});}catch(t){e.error("コンポーネント初期化中にエラーが発生しました",t);}}function Ut(s){Re().ImageCollector2={MenuRegister:Xe,UIBuilder:rt,UIBatchUpdater:tt,UIEventHandler:ot,ImageCollectorMain:Ve,BadImageHandler:Ue,ImageSourceClassifier:$e,Toast:et,ProgressBar:Je,RequestBatchLimiter:Oe,ImageHostManager:Ae,ZipDownloader:Ke,...s,config:s.config};}class At{constructor(e={}){this.options=e,this.log=z("ImageCollectorApp");}log;start(){this.log.info("starting legacy collector"),Dt();}}const ue=z("ImageCollector2");async function $t(){ue.info("bootstrap start");try{new At().start(),ue.info("legacy bootstrap completed");}catch(s){ue.error("bootstrap failed",s);}}$t();

})();