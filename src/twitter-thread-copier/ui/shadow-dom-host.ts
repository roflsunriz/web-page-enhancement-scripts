import type { Logger } from "@/shared/logger";
import { createShadowHost } from '@/shared/dom';

const styles = [
  ".copy-thread-button {",
  "  position: fixed;",
  "  bottom: 100px;",
  "  right: 20px;",
  "  width: 50px;",
  "  height: 50px;",
  "  border-radius: 50%;",
  "  background-color: #e01e1e;",
  "  color: white;",
  "  border: none;",
  "  cursor: pointer;",
  "  display: flex;",
  "  align-items: center;",
  "  justify-content: center;",
  "  z-index: 9999;",
  "  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);",
  "  transition: all 0.3s ease;",
  "  pointer-events: auto;",
  "}",
  ".copy-thread-button:hover {",
  "  transform: scale(1.1);",
  "  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);",
  "}",
  ".copy-thread-button.success {",
  "  background-color: #4CAF50;",
  "}",
  ".copy-thread-button.ready {",
  "  background-color: #1DA1F2;",
  "}",
  ".copy-thread-button.loading svg {",
  "  animation: spinning 1.5s linear infinite;",
  "}",
  ".copy-thread-button .text {",
  "  position: absolute;",
  "  font-size: 12px;",
  "  white-space: nowrap;",
  "  top: -25px;",
  "  background-color: #333;",
  "  padding: 3px 8px;",
  "  border-radius: 4px;",
  "  opacity: 0;",
  "  visibility: hidden;",
  "  transition: all 0.2s ease;",
  "}",
  ".copy-thread-button:hover .text {",
  "  opacity: 1;",
  "  visibility: visible;",
  "}",
  ".control-panel-container {",
  "  position: fixed;",
  "  bottom: 160px;",
  "  right: 20px;",
  "  background-color: rgba(0, 0, 0, 0.7);",
  "  color: white;",
  "  padding: 8px 12px;",
  "  border-radius: 20px;",
  "  z-index: 9999;",
  "  display: flex;",
  "  flex-direction: column;",
  "  gap: 8px;",
  "  font-size: 14px;",
  "  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);",
  "  pointer-events: auto;",
  "}",
  ".control-panel-container select,",
  ".control-panel-container input {",
  "  margin-left: 8px;",
  "  transform: scale(0.96);",
  "}",
  ".control-panel-container label {",
  "  display: flex;",
  "  align-items: center;",
  "  white-space: nowrap;",
  "}",
  ".control-panel-container select {",
  "  background-color: #333;",
  "  color: white;",
  "  border: 1px solid #666;",
  "  border-radius: 4px;",
  "  padding: 2px 4px;",
  "}",
  "@keyframes spinning {",
  "  from { transform: rotate(0deg); }",
  "  to { transform: rotate(360deg); }",
  "}",
  ".copy-toast {",
  "  position: fixed;",
  "  bottom: 180px;",
  "  right: 20px;",
  "  background-color: rgba(0, 0, 0, 0.8);",
  "  color: white;",
  "  padding: 12px 20px;",
  "  border-radius: 8px;",
  "  z-index: 10000;",
  "  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);",
  "  max-width: 300px;",
  "  opacity: 0;",
  "  transform: translateY(20px);",
  "  transition: all 0.3s ease;",
  "  pointer-events: auto;",
  "}",
  ".copy-toast.visible {",
  "  opacity: 1;",
  "  transform: translateY(0);",
  "}",
  ".toast-title {",
  "  font-weight: bold;",
  "  margin-bottom: 5px;",
  "}",
  ".toast-content {",
  "  font-size: 13px;",
  "  opacity: 0.9;",
  "  overflow: hidden;",
  "  text-overflow: ellipsis;",
  "  display: -webkit-box;",
  "  -webkit-line-clamp: 3;",
  "  -webkit-box-orient: vertical;",
  "}",
  ".reset-start-point {",
  "  position: fixed;",
  "  bottom: 220px;",
  "  right: 20px;",
  "  padding: 8px 12px;",
  "  background-color: #ff6b6b;",
  "  color: white;",
  "  border: none;",
  "  border-radius: 20px;",
  "  cursor: pointer;",
  "  font-size: 12px;",
  "  z-index: 9999;",
  "  opacity: 0;",
  "  visibility: hidden;",
  "  transition: all 0.3s ease;",
  "  pointer-events: auto;",
  "}",
  ".reset-start-point.visible {",
  "  opacity: 1;",
  "  visibility: visible;",
  "}",
  ".reset-start-point:hover {",
  "  background-color: #ff5252;",
  "  transform: scale(1.05);",
  "}",
].join("\n");

export class ShadowDomHost {
  private shadowRoot: ShadowRoot | null = null;
  private disposeFn: (() => void) | null = null;

  constructor(private readonly logger: Logger) {}

  init(): ShadowRoot {
    if (this.shadowRoot) {
      return this.shadowRoot;
    }

    try {
      const { root, dispose } = createShadowHost({
        id: 'twitter-thread-copier-shadow-host',
        mode: 'closed',
        cssText: styles,
      });
      this.shadowRoot = root;
      this.disposeFn = dispose;
      this.logger.debug('shadow DOM initialized');
      return root;
    } catch (error) {
      this.logger.error('shadow DOM initialization failed', error);
      throw error;
    }
  }

  appendChild<T extends Node>(node: T): T {
    if (!this.shadowRoot) {
      this.init();
    }
    this.shadowRoot!.appendChild(node);
    return node;
  }

  querySelector<T extends Element>(selector: string): T | null {
    return this.shadowRoot?.querySelector<T>(selector) ?? null;
  }

  destroy(): void {
    if (!this.disposeFn) return;
    try {
      this.disposeFn();
      this.logger.debug('shadow DOM destroyed');
    } catch (error) {
      this.logger.error('shadow DOM destroy failed', error);
    } finally {
      this.shadowRoot = null;
      this.disposeFn = null;
    }
  }

  private addStyles(root: ShadowRoot): void {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    root.appendChild(styleElement);
  }
}
