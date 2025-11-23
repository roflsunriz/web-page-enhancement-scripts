/**
 * dアニメニコニココメント診断スニペット
 * ブラウザのコンソールで実行してエピソード切り替え時の状態を診断
 */

(function() {
  const global = window.dAniRenderer;
  
  if (!global) {
    console.error('❌ dAniRenderer が見つかりません');
    return;
  }

  function createDiagnostic() {
    const renderer = global.instances.renderer;
    const switchHandler = global.instances.switchHandler;
    const settingsManager = global.instances.settingsManager;
    
    const videoElement = document.querySelector('video');
    const comments = renderer?.getCommentsSnapshot() || [];
    const videoData = settingsManager?.loadVideoData();
    
    // DOM要素を調査
    const commentOverlays = Array.from(document.querySelectorAll('[data-comment-overlay], [data-comment-renderer]'));
    const canvasElements = Array.from(document.querySelectorAll('canvas'));
    const videoSiblings = videoElement?.parentElement ? 
      Array.from(videoElement.parentElement.children).filter(el => el !== videoElement) : [];
    
    // comment-overlayの内部状態を取得（可能な限り）
    let overlayInternals = null;
    try {
      // @ts-ignore - private propertiesにアクセス
      overlayInternals = {
        hasRenderer: !!renderer?.renderer,
        rendererVideoElement: renderer?.renderer?.getVideoElement?.() ? 'attached' : 'detached',
        rendererCurrentSrc: renderer?.renderer?.getCurrentVideoSource?.() || null,
        // @ts-ignore
        rendererActiveComments: renderer?.renderer?.activeComments?.length || 0,
        // @ts-ignore
        rendererCanvas: renderer?.renderer?.canvas ? 'exists' : 'null',
        // @ts-ignore
        rendererContext: renderer?.renderer?.context ? 'exists' : 'null',
      };
    } catch (e) {
      overlayInternals = { error: e.message };
    }

    const diagnostic = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      partId: new URLSearchParams(window.location.search).get('partId'),
      
      // グローバルインスタンスの状態
      instances: {
        renderer: !!renderer,
        switchHandler: !!switchHandler,
        settingsManager: !!settingsManager,
      },
      
      // 動画情報
      video: videoElement ? {
        exists: true,
        src: videoElement.currentSrc || videoElement.src || null,
        currentTime: videoElement.currentTime,
        duration: videoElement.duration,
        readyState: videoElement.readyState,
        paused: videoElement.paused,
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
        parentElement: videoElement.parentElement?.tagName || null,
      } : { exists: false },
      
      // 保存されているvideoData
      savedVideoData: videoData ? {
        videoId: videoData.videoId,
        title: videoData.title,
        commentCount: videoData.commentCount,
      } : null,
      
      // レンダラーの状態
      renderer: renderer ? {
        commentsCount: comments.length,
        videoElement: renderer.getVideoElement() ? 'attached' : 'null',
        currentVideoSrc: renderer.getCurrentVideoSource(),
        sampleComments: comments.slice(0, 5).map(c => ({
          text: c.text?.substring(0, 30),
          vposMs: c.vposMs,
          vposSec: (c.vposMs / 1000).toFixed(2),
        })),
        // 最初と最後のコメント
        firstComment: comments[0] ? {
          text: comments[0].text?.substring(0, 30),
          vposMs: comments[0].vposMs,
        } : null,
        lastComment: comments[comments.length - 1] ? {
          text: comments[comments.length - 1].text?.substring(0, 30),
          vposMs: comments[comments.length - 1].vposMs,
        } : null,
      } : null,
      
      // comment-overlayの内部状態
      overlayInternals,
      
      // DOM要素の調査
      dom: {
        commentOverlays: {
          count: commentOverlays.length,
          elements: commentOverlays.map(el => ({
            tag: el.tagName,
            id: el.id || null,
            classes: el.className || null,
            attributes: Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`),
          })),
        },
        canvasElements: {
          count: canvasElements.length,
          elements: canvasElements.map(canvas => ({
            id: canvas.id || null,
            classes: canvas.className || null,
            width: canvas.width,
            height: canvas.height,
            parent: canvas.parentElement?.tagName || null,
            isVideoSibling: canvas.parentElement === videoElement?.parentElement,
          })),
        },
        videoSiblings: {
          count: videoSiblings.length,
          elements: videoSiblings.map(el => ({
            tag: el.tagName,
            id: el.id || null,
            classes: el.className || null,
            isCanvas: el.tagName === 'CANVAS',
            isDiv: el.tagName === 'DIV',
          })),
        },
      },
      
      // DOMツリー構造（video要素周辺）
      domTree: videoElement ? {
        parent: {
          tag: videoElement.parentElement?.tagName,
          id: videoElement.parentElement?.id || null,
          classes: videoElement.parentElement?.className || null,
          childrenCount: videoElement.parentElement?.children.length,
        },
        siblings: Array.from(videoElement.parentElement?.children || []).map(el => ({
          tag: el.tagName,
          id: el.id || null,
          isVideo: el === videoElement,
          textContent: el.textContent?.substring(0, 50) || null,
        })),
      } : null,
    };
    
    return diagnostic;
  }
  
  // 診断実行
  console.log('='.repeat(80));
  console.log('🔍 dアニメニコニココメント診断');
  console.log('='.repeat(80));
  
  const diagnostic = createDiagnostic();
  
  // JSON出力
  console.log('\n📋 診断結果JSON:');
  console.log(JSON.stringify(diagnostic, null, 2));
  
  // 重要な問題を検出
  console.log('\n⚠️  問題検出:');
  
  const issues = [];
  
  if (!diagnostic.instances.renderer) {
    issues.push('❌ レンダラーインスタンスが存在しません');
  }
  
  if (diagnostic.renderer && diagnostic.savedVideoData && 
      diagnostic.renderer.commentsCount > 0 && diagnostic.savedVideoData.videoId) {
    console.log(`✅ コメント数: ${diagnostic.renderer.commentsCount}件`);
    console.log(`✅ VideoID: ${diagnostic.savedVideoData.videoId}`);
  }
  
  if (diagnostic.dom.canvasElements.count > 1) {
    issues.push(`⚠️  Canvas要素が${diagnostic.dom.canvasElements.count}個存在します（通常は1個）`);
  }
  
  if (diagnostic.dom.commentOverlays.count > 0) {
    issues.push(`⚠️  残存コメントオーバーレイ要素: ${diagnostic.dom.commentOverlays.count}個`);
  }
  
  if (diagnostic.renderer && diagnostic.renderer.videoElement === 'null') {
    issues.push('❌ レンダラーがvideo要素にアタッチされていません');
  }
  
  if (diagnostic.video.exists && diagnostic.renderer) {
    const videoSrc = diagnostic.video.src;
    const rendererSrc = diagnostic.renderer.currentVideoSrc;
    if (videoSrc !== rendererSrc) {
      issues.push(`❌ video.src とレンダラーの認識がずれています`);
      console.log(`   video.src: ${videoSrc}`);
      console.log(`   renderer.src: ${rendererSrc}`);
    }
  }
  
  if (issues.length === 0) {
    console.log('✅ 明らかな問題は検出されませんでした');
  } else {
    issues.forEach(issue => console.log(issue));
  }
  
  // グローバルに保存
  window.__dAnimeDiagnostic = diagnostic;
  
  // JSONファイルとしてダウンロード
  function downloadDiagnostic() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `d-anime-diagnostic-${diagnostic.partId || 'unknown'}-${timestamp}.json`;
    
    const blob = new Blob([JSON.stringify(diagnostic, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log(`✅ ダウンロード: ${filename}`);
  }
  
  downloadDiagnostic();
  
  console.log('\n💾 再度ダウンロードするには:');
  console.log('  window.__dAnimeDiagnostic.download()');
  console.log('  または: d()');
  
  console.log('\n🔄 使い方:');
  console.log('  1. エピソード切り替え前に実行（自動ダウンロード）');
  console.log('  2. backward/forwardでエピソード切り替え');
  console.log('  3. 古いコメントが残っている状態で再実行（自動ダウンロード）');
  console.log('  4. 2つのJSONファイルを比較');
  console.log('='.repeat(80));
  
  // ダウンロード関数をアタッチ
  diagnostic.download = downloadDiagnostic;
  
  // グローバルショートカット
  window.d = downloadDiagnostic;
  
  return diagnostic;
})();

