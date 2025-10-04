import type { LoadingSpinner } from './ui/loading-spinner';
import { ICollector, CollectionResult } from './collectors/i-collector';
import { TwitterCollector } from './collectors/twitter-collector';
import { GenericCollector } from './collectors/generic-collector';
import { win } from './util';

/**
 * 画像収集のメインクラス。
 * 適切なコレクターを選択し、画像収集処理を委譲します。
 */
export class DataLoader {
  private spinner: LoadingSpinner | null = null;
  private collector: ICollector;

  constructor() {
    this.collector = this.createCollector();
  }

  public setSpinner(spinner: LoadingSpinner | null): void {
    this.spinner = spinner;
    this.collector.setSpinner(spinner);
  }

  /**
   * 現在のURLに基づいて適切なコレクターを生成します。
   */
  private createCollector(): ICollector {
    const href = win.location.href;
    if (href.includes('twitter.com') || href.includes('x.com')) {
      return new TwitterCollector();
    }
    return new GenericCollector();
  }

  /**
   * 画像収集処理を開始します。
   */
  public async collectImageUrls(): Promise<CollectionResult> {
    this.spinner?.updateMessage('画像収集システムを開始中...');
    return this.collector.collect();
  }
}
