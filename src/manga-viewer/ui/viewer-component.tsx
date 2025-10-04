import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChapterNavigator } from '../chapter-navigator';
import { globalState } from '../state';
import { MOUSE_INACTIVITY_DELAY } from '../constants';
import { DataLoader } from '../data-loader';
import { LoadingSpinner } from './loading-spinner';
import { win } from '../util';

type ViewerProps = {
  images: string[];
  onClose: () => void;
  initialAutoNav?: boolean;
};

type TransformState = {
  scale: number;
  translateX: number;
  translateY: number;
};

type ProgressState = {
  visible: boolean;
  percent: number;
  message: string;
  phase: 'init' | 'loading' | 'complete' | string;
};

export const ViewerComponent: React.FC<ViewerProps> = ({
  images,
  onClose,
  initialAutoNav = true,
}) => {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [transformState, setTransformState] = useState<TransformState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [turnDirection, setTurnDirection] = useState<'prev' | 'next' | null>(null);
  const [bounceDirection, setBounceDirection] = useState<'left' | 'right' | null>(null);
  const [autoChapterNavigation, setAutoChapterNavigation] = useState(initialAutoNav);
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const [hintsVisible, setHintsVisible] = useState(false);
  const [isMouseActive, setIsMouseActive] = useState(false);
  const [chapterTitle] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [progressState, setProgressState] = useState<ProgressState>({
    visible: false,
    percent: 0,
    message: '',
    phase: 'init',
  });
  // タッチ操作用の状態
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialTransformState, setInitialTransformState] = useState<TransformState | null>(null);
  const [showTurnIndicator, setShowTurnIndicator] = useState(false);
  const [turnIndicatorSide, setTurnIndicatorSide] = useState<'left' | 'right' | null>(null);

  const [showRetryButton, setShowRetryButton] = useState(images.length === 0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [rightImageWidth, setRightImageWidth] = useState<number | null>(null);

  const rightImgRef = useRef<HTMLImageElement | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);
  const mainViewerRef = useRef<HTMLDivElement>(null);
  const chapterNavigator = useRef(new ChapterNavigator());
  const zoomIndicatorTimeout = useRef<number | null>(null);
  const progressFallbackTimer = useRef<number | null>(null);
  const hintsRef = useRef<HTMLDivElement>(null);
  const mouseActivityTimer = useRef<number | null>(null);
  const progressStateRef = useRef(progressState);
  useEffect(() => {
    progressStateRef.current = progressState;
  }, [progressState]);

  const currentSpreadIndexRef = useRef(currentSpreadIndex);
  useEffect(() => {
    currentSpreadIndexRef.current = currentSpreadIndex;
  }, [currentSpreadIndex]);

  const isAnimatingRef = useRef(isAnimating);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  const resetMouseActivity = useCallback(() => {
    setIsMouseActive(true);
    if (mouseActivityTimer.current) clearTimeout(mouseActivityTimer.current);
    mouseActivityTimer.current = window.setTimeout(() => {
      setIsMouseActive(false);
      setHintsVisible(false);
    }, MOUSE_INACTIVITY_DELAY);
  }, [mouseActivityTimer]);

  const showZoomLevel = useCallback(() => {
    resetMouseActivity();
    if (zoomIndicatorTimeout.current) {
      clearTimeout(zoomIndicatorTimeout.current);
    }
    setShowZoomIndicator(true);
    zoomIndicatorTimeout.current = window.setTimeout(() => {
      setShowZoomIndicator(false);
    }, 1500);
  }, [resetMouseActivity]);

  const showBounceAnimation = useCallback((direction: 'left' | 'right') => {
    setBounceDirection(direction);
    setTimeout(() => setBounceDirection(null), 300);
  }, []);

  const animatePageTurn = useCallback(
    (direction: 'prev' | 'next') => {
      setIsMouseActive(false);
      if (isAnimatingRef.current) return;

      const currentIndex = currentSpreadIndexRef.current;
      const maxSpreadIndex = Math.ceil(images.length / 2) - 1;
      const isLoading = progressState.phase !== 'complete';

      if (direction === 'prev' && currentIndex <= 0) {
        showBounceAnimation('left');
        if (!isLoading && autoChapterNavigation && images.length > 0) {
          if (chapterNavigator.current.navigatePrevChapter()) onClose();
        }
        return;
      }
      if (direction === 'next' && currentIndex >= maxSpreadIndex) {
        showBounceAnimation('right');
        if (!isLoading && autoChapterNavigation && images.length > 0) {
          if (chapterNavigator.current.navigateNextChapter()) onClose();
        }
        return;
      }

      setIsAnimating(true);
      setTurnDirection(direction);

      setCurrentSpreadIndex((prev) => (direction === 'prev' ? prev - 1 : prev + 1));

      setTimeout(() => {
        setIsAnimating(false);
        setTurnDirection(null);
      }, 200);
    },
    [images.length, autoChapterNavigation, onClose, progressState.phase, showBounceAnimation],
  );

  const handlePageTurn = useCallback(
    (direction: 'prev' | 'next') => {
      setIsMouseActive(false);
      setHintsVisible(false);
      if (viewerRef.current) {
        viewerRef.current.focus();
      }
      animatePageTurn(direction);
    },
    [animatePageTurn],
  );

  useEffect(() => {
    // グローバルプログレス更新
    if (typeof win !== 'undefined') {
      win.MangaViewer = win.MangaViewer || {};
      win.MangaViewer.updateProgress = (
        percent: number,
        message: string,
        phase: 'init' | 'loading' | 'complete' | string | null = null,
      ) => {
        // ログ出力
        try {
          console.debug('[MangaViewer] updateProgress called:', { percent, message, phase });
        } catch { /* ignore */ }

        // 既存の状態更新ロジック
        setProgressState((prev) => {
          let newPhase = phase || prev.phase;
          if (percent >= 100) newPhase = 'complete';
          if (percent < prev.percent && newPhase === prev.phase) return prev;
          return { visible: true, percent, message: message || '', phase: newPhase };
        });

        // フォールバックタイマーは 'loading' フェーズのみで動作させる
        const shouldUseFallback = (phase === 'loading') || (phase === null && progressStateRef.current.phase === 'loading');
        // Clear any existing fallback timer unless we should set a new one
        if (progressFallbackTimer.current) {
          clearTimeout(progressFallbackTimer.current);
          progressFallbackTimer.current = null;
        }
        if (shouldUseFallback && percent < 100) {
          progressFallbackTimer.current = window.setTimeout(() => {
            try {
              console.warn('[MangaViewer] progress fallback triggered: forcing complete');
            } catch { /* ignore */ }
            setProgressState((prev) => ({ ...prev, phase: 'complete' }));
            setTimeout(() => setProgressState((prev) => ({ ...prev, visible: false })), 2000);
          }, 8000);
        } else {
          try {
            console.debug('[MangaViewer] fallback not set (phase)', { phase });
          } catch { /* ignore */ }
        }

        if (percent >= 100) {
          // Hide the UI after a short delay but keep phase at 'complete'.
          setTimeout(() => setProgressState((prev) => ({ ...prev, visible: false })), 2000);
        }
      };
      // マウント時に global buffer が存在すればフラッシュして Viewer の updateProgress を呼び出す
      try {
        const mvHolder = win as unknown as { MangaViewer?: { _progressBuffer?: Array<[number, string, string | null]> } };
        const buffer = mvHolder.MangaViewer?._progressBuffer;
        if (Array.isArray(buffer) && buffer.length > 0) {
          try {
            console.debug('[MangaViewer] flushing progress buffer', { count: buffer.length });
          } catch (err) {
            console.debug('[MangaViewer] flushing progress buffer debug error', err);
          }
          for (const [p, m, ph] of buffer) {
            try {
              // ph は null である可能性があるので string にフォールバック
              win.MangaViewer.updateProgress(p, m, ph ?? 'loading');
            } catch (err) {
              console.error('[MangaViewer] error flushing progress buffer', err);
            }
          }
          mvHolder.MangaViewer!._progressBuffer = [];
        }
      } catch (err) {
        console.error('[MangaViewer] flushing progress buffer error', err);
      }
      return () => {
        if (win.MangaViewer) win.MangaViewer.updateProgress = undefined;
        if (progressFallbackTimer.current) {
          clearTimeout(progressFallbackTimer.current);
          progressFallbackTimer.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    // マウント時の処理
    if (viewerRef.current) {
      viewerRef.current.focus();
      document.querySelectorAll('iframe').forEach((iframe) => iframe.setAttribute('tabindex', '-1'));
    }
    resetMouseActivity();

    const handleFocusOut = (e: FocusEvent) => {
      const newTarget = e.relatedTarget as HTMLElement;
      if (
        newTarget &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(newTarget.tagName) &&
        newTarget.isContentEditable
      ) {
        return;
      }
      setTimeout(() => viewerRef.current?.focus(), 10);
    };
    viewerRef.current?.addEventListener('focusout', handleFocusOut);

    return () => {
      viewerRef.current?.removeEventListener('focusout', handleFocusOut);
      if (mouseActivityTimer.current) clearTimeout(mouseActivityTimer.current);
    };
  }, [resetMouseActivity]);

  useEffect(() => {
    // キーボードイベント
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!viewerRef.current || !globalState.isViewerActive) return;
      const activeElement = document.activeElement as HTMLElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          activeElement.isContentEditable)
      ) {
        return;
      }

      const isPageTurnKey = ['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(event.key);
      if (!isPageTurnKey) resetMouseActivity();

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handlePageTurn('next');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handlePageTurn('prev');
          break;
        case 'w':
        case 'W':
        case 'ArrowUp': {
          const newScale = Math.min(transformState.scale * 1.1, 3);
          const pinchX = mousePosition.x / transformState.scale;
          const pinchY = mousePosition.y / transformState.scale;
          const newTranslateX = mousePosition.x - pinchX * newScale;
          const newTranslateY = mousePosition.y - pinchY * newScale;
          setTransformState({ scale: newScale, translateX: newTranslateX, translateY: newTranslateY });
          showZoomLevel();
          break;
        }
        case 's':
        case 'S':
        case 'ArrowDown': {
          const newScale = Math.max(transformState.scale * 0.9, 0.5);
          const pinchX = mousePosition.x / transformState.scale;
          const pinchY = mousePosition.y / transformState.scale;
          const newTranslateX = mousePosition.x - pinchX * newScale;
          const newTranslateY = mousePosition.y - pinchY * newScale;
          setTransformState({ scale: newScale, translateX: newTranslateX, translateY: newTranslateY });
          showZoomLevel();
          break;
        }
        case 'q':
        case 'Q':
          setTransformState({ scale: 1, translateX: 0, translateY: 0 });
          showZoomLevel();
          break;
        case 'h':
        case 'H':
          setHintsVisible((prev) => !prev);
          break;
      }
    };
    globalState.keyDispatcher = handleKeyPress;
    return () => {
      if (globalState.keyDispatcher === handleKeyPress) {
        globalState.keyDispatcher = null;
      }
    };
  }, [transformState, mousePosition, handlePageTurn, resetMouseActivity, showZoomLevel]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      resetMouseActivity();
      if (mainViewerRef.current) {
        const rect = mainViewerRef.current.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
      if (isDragging && transformState.scale > 1) {
        setTransformState((prev) => ({
          ...prev,
          translateX: prev.translateX + e.movementX,
          translateY: prev.translateY + e.movementY,
        }));
      }
    },
    [isDragging, transformState.scale, resetMouseActivity],
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      resetMouseActivity();

      const newScale = e.deltaY < 0
        ? Math.min(transformState.scale * 1.1, 3)
        : Math.max(transformState.scale * 0.9, 0.5);

      const pinchX = mousePosition.x / transformState.scale;
      const pinchY = mousePosition.y / transformState.scale;
      const newTranslateX = mousePosition.x - pinchX * newScale;
      const newTranslateY = mousePosition.y - pinchY * newScale;

      setTransformState({ scale: newScale, translateX: newTranslateX, translateY: newTranslateY });
      showZoomLevel();
    },
    [transformState, mousePosition, resetMouseActivity, showZoomLevel],
  );

  const handleRetryCollection = useCallback(async () => {
    setIsRetrying(true);
    const spinner = new LoadingSpinner();
    spinner.show('画像を再収集中...');
    try {
      const loader = new DataLoader();
      loader.setSpinner(spinner);
      const result = await loader.collectImageUrls();
      if (result.initialUrls.length > 0) {
        spinner.hide();
        onClose();
        globalState.app?.launch();
      } else {
        spinner.updateMessage('画像が見つかりませんでした。');
        setTimeout(() => {
          spinner.hide();
          setIsRetrying(false);
          setShowRetryButton(true);
        }, 2000);
      }
    } catch {
      spinner.updateMessage('エラーが発生しました。');
      setTimeout(() => {
        spinner.hide();
        setIsRetrying(false);
        setShowRetryButton(true);
      }, 2000);
    }
  }, [onClose]);

  const spread = useMemo(() => {
    const startIdx = currentSpreadIndex * 2;
    const leftPageIndex = startIdx + 1;
    const rightPageIndex = startIdx;
    const isLastSpread = Math.ceil(images.length / 2) - 1 === currentSpreadIndex;
    const isOddNumberOfImages = images.length % 2 === 1;

    if (isLastSpread && isOddNumberOfImages && leftPageIndex === images.length) {
      return [null, rightPageIndex < images.length ? images[rightPageIndex] : null];
    }
    return [
      leftPageIndex < images.length ? images[leftPageIndex] : null,
      rightPageIndex < images.length ? images[rightPageIndex] : null,
    ];
  }, [currentSpreadIndex, images]);

  useEffect(() => {
    const handleResize = () => {
      if (rightImgRef.current) {
        try {
          const w = rightImgRef.current.getBoundingClientRect().width;
          setRightImageWidth(w);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.mv-end-page')) {
      if (autoChapterNavigation) {
        if (chapterNavigator.current.navigateNextChapter()) onClose();
      }
      return;
    }

    const mainViewerRect = mainViewerRef.current?.getBoundingClientRect();
    if (!mainViewerRect) return;

    const clickX = e.clientX - mainViewerRect.left;
    const clickArea = clickX / mainViewerRect.width;

    // 左開き: 画面左クリックで次ページ（進む）、右クリックで前ページ（戻る）
    if (clickArea < 0.5) {
      handlePageTurn('next');
    } else {
      handlePageTurn('prev');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
      setTouchStartY(e.touches[0].clientY);
      setTouchStartTime(Date.now());
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      setInitialPinchDistance(distance);
      setInitialTransformState(transformState);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) {
          setTurnIndicatorSide('right');
          setShowTurnIndicator(true);
        } else if (deltaX < -50) {
          setTurnIndicatorSide('left');
          setShowTurnIndicator(true);
        } else {
          setShowTurnIndicator(false);
        }
      }
    } else if (e.touches.length === 2 && initialPinchDistance && initialTransformState) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const newScale = initialTransformState.scale * (distance / initialPinchDistance);
      setTransformState((prev) => ({ ...prev, scale: Math.min(Math.max(newScale, 0.5), 3) }));
      showZoomLevel();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaTime = Date.now() - touchStartTime;
    const swipeVelocity = Math.abs(deltaX) / deltaTime;

    setShowTurnIndicator(false);

    if (Math.abs(deltaX) > 50 || swipeVelocity > 0.5) {
      // 左開きに合わせてスワイプの挙動も反転
      if (deltaX > 0) {
        handlePageTurn('next');
      } else {
        handlePageTurn('prev');
      }
    }
    setInitialPinchDistance(null);
    setInitialTransformState(null);
  };

  return (
    <div
      className={`manga-viewer-container ${isMouseActive ? '' : 'mouse-inactive'}`}
      tabIndex={0}
      ref={viewerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsDragging(false)}
      onMouseDown={(e) => {
        if (e.button === 0) setIsDragging(true);
      }}
      onMouseUp={(e) => {
        if (e.button === 0) setIsDragging(false);
      }}
      onClick={handleClick}
      onWheel={handleWheel}
      onAuxClick={(e) => {
        if (e.button === 1) {
          e.preventDefault();
          setTransformState({ scale: 1, translateX: 0, translateY: 0 });
          showZoomLevel();
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button key="mobile-close-button" className="mv-mobile-close-button" onClick={onClose} />

      <div
        className="mv-top-container"
        style={{
          transform: isMouseActive ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease-out',
          position: 'absolute',
          width: '100%',
          zIndex: 100,
        }}
      >
        {/* Header */}
        <div className="mv-header">
          <div className="mv-header-text">
            {images.length === 0
              ? '画像が見つかりません'
              : `${currentSpreadIndex + 1} / ${Math.ceil(images.length / 2)} ${
                  chapterTitle ? `- ${chapterTitle}` : ''
                }`}
          </div>
          <div
            className={`mv-auto-nav-toggle ${autoChapterNavigation ? '' : 'off'}`}
            onClick={() => setAutoChapterNavigation((prev) => !prev)}
          >
            チャプター自動移動: {autoChapterNavigation ? 'ON' : 'OFF'}
          </div>
          <button onClick={onClose} className="mv-close-button">
            閉じる
          </button>
        </div>
        {/* Progress Bar */}
        {progressState.visible && (
          <div className="mv-progress-container">
            <div className="mv-progress-bar" style={{ width: `${progressState.percent}%` }} />
            {progressState.message && (
              <div className="mv-progress-message">{progressState.message}</div>
            )}
          </div>
        )}
      </div>

      <div
        className="mv-main-viewer"
        ref={mainViewerRef}
        style={{ cursor: isDragging && transformState.scale > 1 ? 'grabbing' : 'default' }}
      >
        {images.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
              画像が見つかりませんでした
            </div>
            <div style={{ fontSize: '16px', marginBottom: '30px' }}>
              ページの読み込みが完了する前に画像収集が行われた可能性があります。
            </div>
            {showRetryButton && !isRetrying && (
              <button onClick={handleRetryCollection} className="mv-close-button">
                画像を再収集する
              </button>
            )}
            {isRetrying && <div style={{ fontSize: '16px' }}>再収集中...</div>}
          </div>
        ) : (
          <div
            className="mv-spread-container"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              transform: `scale(${transformState.scale}) translate(${transformState.translateX}px, ${transformState.translateY}px)`,
              transformOrigin: '0 0',
              transition: isAnimating ? 'none' : 'transform 0.1s ease-out',
              animation:
                bounceDirection === 'left'
                  ? 'bounceLeft 0.3s ease-in-out'
                  : bounceDirection === 'right'
                  ? 'bounceRight 0.3s ease-in-out'
                  : 'none',
            }}
          >
            {spread.map((url, index) => {
              const pageSide = index === 0 ? 'left' : 'right';
              const isAnimatingThisPage =
                isAnimating &&
                ((turnDirection === 'next' && pageSide === 'left') ||
                  (turnDirection === 'prev' && pageSide === 'right'));

              return url ? (
                <div
                  key={`page-container-${index}`}
                  className="mv-page-container"
                  style={{ zIndex: isAnimatingThisPage ? 10 : 1 }}
                >
                  <img
                    ref={pageSide === 'right' ? rightImgRef : undefined}
                    src={url}
                    className={`mv-page ${isAnimatingThisPage ? 'mv-page-animating' : ''}`}
                    style={{
                      animation: isAnimatingThisPage
                        ? turnDirection === 'next'
                          ? 'turnPageForward 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)'
                          : 'turnPageBackward 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)'
                        : 'none',
                      transformOrigin: pageSide === 'left' ? 'right center' : 'left center',
                    }}
                    draggable={false}
                  />
                </div>
              ) : (
                <div key={`empty-${index}`} className="mv-page-container">
                  {index === 0 && images.length % 2 === 1 && currentSpreadIndex === Math.ceil(images.length / 2) - 1 && (
                    // 空ページは通常のページと同じクラス/サイズで白地を作り、テキストを中央に配置する
                    <div
                      className="mv-page mv-end-page"
                    style={{
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // 右側画像幅が取得できない場合は 700px をフォールバック幅として使用
                        width: rightImageWidth ? `${rightImageWidth}px` : '700px',
                      }}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>End of Contents</div>
                      <div style={{ fontSize: '14px' }}>{autoChapterNavigation ? 'クリックして次のチャプターへ' : '最後のページです'}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* UI Overlays */}
      <div
        className={`mv-zoom-indicator ${showZoomIndicator ? 'visible' : ''}`}
      >{`ズーム: ${Math.round(transformState.scale * 100)}%`}</div>

      <div ref={hintsRef} className={`mv-shortcuts-hint ${hintsVisible ? 'visible' : 'hidden'}`}>
        <span>移動: <span className="mv-key">←</span><span className="mv-key">→</span></span> |
        <span>ズーム: <span className="mv-key">↑</span><span className="mv-key">↓</span></span> |
        <span>リセット: <span className="mv-key">Q</span></span>
      </div>

      {showTurnIndicator && (
        <div className={`mv-page-turn-indicator ${turnIndicatorSide} visible`}>
          {turnIndicatorSide === 'left' ? '→' : '←'}
        </div>
      )}
    </div>
  );
};
