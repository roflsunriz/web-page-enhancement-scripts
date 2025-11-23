import { svgClose, svgContentCopy, svgFlash, svgMonitor } from '@/shared/icons/mdi';

export const TEMPLATE_POLICY_NAME = 'youtube-info-copier-template';

export function getTemplate(): string {
  return `
    <style>
        .glass-control-container {
            position: relative;
            pointer-events: none;
        }

        .control-handle {
            width: 6px;
            height: 60px;
            background: rgba(255, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto;
            position: relative;
            z-index: 10;
            box-shadow: 2px 0 8px rgba(255, 0, 0, 0.4);
        }

        .control-handle:hover {
            width: 12px;
            background: rgba(255, 0, 0, 1.0);
            box-shadow: 2px 0 12px rgba(255, 0, 0, 0.6);
        }

        .control-handle:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.5);
        }

        /* 準備中状態 */
        .control-handle.preparing {
            background: rgba(255, 152, 0, 0.8);
            box-shadow: 2px 0 8px rgba(255, 152, 0, 0.4);
            animation: pulse 1s ease-in-out infinite;
        }

        /* 準備完了状態 - ハートバウンシング */
        .control-handle.ready {
            background: rgba(76, 175, 80, 0.9);
            box-shadow: 2px 0 12px rgba(76, 175, 80, 0.6);
            animation: heartBounce 0.8s ease-in-out infinite;
        }

        .control-handle.error {
            background: rgba(244, 67, 54, 0.8);
            box-shadow: 2px 0 8px rgba(244, 67, 54, 0.4);
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.7;
                transform: scale(1.05);
            }
        }

        @keyframes heartBounce {
            0%, 100% {
                transform: scale(1);
            }
            10% {
                transform: scale(1.1);
            }
            20% {
                transform: scale(1);
            }
            30% {
                transform: scale(1.15);
            }
            40% {
                transform: scale(1);
            }
        }

        .control-panel {
            position: absolute;
            bottom: 0;
            left: 0;
            min-width: 280px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 0;
            overflow: hidden;
            opacity: 0;
            transform: translateX(-100%) scale(0.8);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            z-index: 9;
            margin-left: 12px;
        }

        .control-panel.expanded {
            opacity: 1;
            transform: translateX(0) scale(1);
            pointer-events: auto;
        }

        .panel-header {
            background: rgba(255, 0, 0, 0.1);
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .panel-icon {
            display: inline-flex;
            width: 20px;
            height: 20px;
            color: rgba(255, 255, 255, 0.9);
        }

        .panel-icon svg {
            width: 100%;
            height: 100%;
            display: block;
        }

        .panel-title {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            margin: 0;
        }

        .panel-content {
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .panel-button {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.85);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: left;
        }

        .panel-button:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }

        .panel-button:active {
            transform: translateY(0);
        }

        .panel-button.primary {
            background: rgba(255, 0, 0, 0.2);
            border-color: rgba(255, 0, 0, 0.3);
            color: rgba(255, 255, 255, 0.95);
        }

        .panel-button.primary:hover {
            background: rgba(255, 0, 0, 0.3);
            border-color: rgba(255, 0, 0, 0.4);
        }

        .panel-button .panel-icon {
            width: 16px;
            height: 16px;
            color: currentColor;
        }

        .popup {
            position: absolute;
            bottom: 100%;
            left: 0;
            min-width: 200px;
            max-width: 400px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            padding: 16px;
            margin-bottom: 8px;
            max-height: 300px;
            overflow-y: auto;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 15;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
            pointer-events: none;
            margin-left: 12px;
        }
        
        .popup.show {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }
        
        .popup-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #ff0000;
            border-bottom: 1px solid rgba(255, 0, 0, 0.2);
            padding-bottom: 8px;
        }
        
        .popup-content {
            white-space: pre-wrap;
            word-wrap: break-word;
            background: rgba(245, 245, 245, 0.8);
            padding: 8px;
            border-radius: 8px;
            border-left: 3px solid #ff0000;
        }
        
        .popup-close {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .popup-close:hover {
            background: rgba(0, 0, 0, 0.1);
            color: #333;
        }

        .popup-close svg {
            width: 18px;
            height: 18px;
            display: block;
        }

        @media (max-width: 768px) {
            .control-handle { height: 50px; }
            .control-panel { min-width: 240px; }
            .panel-header { padding: 12px 16px; }
            .panel-content { padding: 8px; }
            .panel-button { padding: 10px 12px; font-size: 12px; }
            .popup { max-width: 280px; }
        }

        @media (prefers-contrast: high) {
            .control-handle { background: rgba(255, 0, 0, 0.9); border: 2px solid rgba(255, 255, 255, 0.8); }
            .control-panel { background: rgba(0, 0, 0, 0.9); border: 2px solid rgba(255, 255, 255, 0.8); }
        }
    </style>
    
    <div class="glass-control-container">
        <div class="control-handle" aria-label="YouTube動画情報コピー" title="YouTube動画情報" tabindex="0"></div>
        <div class="control-panel">
            <div class="panel-header">
                <span class="panel-icon">${svgMonitor}</span>
                <span class="panel-title">YouTube Info</span>
            </div>
            <div class="panel-content">
                <button class="panel-button primary" data-action="copy">
                    <span class="panel-icon">${svgContentCopy}</span>
                    動画情報をコピー
                </button>
                <button class="panel-button" data-action="quick-copy">
                    <span class="panel-icon">${svgFlash}</span>
                    タイトル+URLのみ
                </button>
            </div>
        </div>
        
        <div class="popup">
            <button class="popup-close" aria-label="閉じる">${svgClose}</button>
            <div class="popup-title">コピーした概要</div>
            <div class="popup-content"></div>
        </div>
    </div>
  `;
}
