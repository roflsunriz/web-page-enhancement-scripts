/**
 * Twitter Clean UI - 設定管理システム
 */

import type { Settings, Profile, StorageData } from './types';
import { DEFAULT_SETTINGS, STORAGE_KEY } from './constants';

/**
 * 設定管理クラス
 */
export class SettingsManager {
  private currentSettings: Settings;
  private profiles: Map<string, Profile> = new Map();
  private currentProfileId: string = 'default';
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  /**
   * コンストラクタ
   */
  constructor() {
    this.currentSettings = { ...DEFAULT_SETTINGS };
    // 非同期初期化を開始（awaitはinitialize()で行う）
    this.initPromise = this.load();
  }

  /**
   * 初期化完了を待機
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    if (this.initPromise) {
      await this.initPromise;
      this.initialized = true;
    }
  }

  /**
   * 初期化が完了しているかどうか
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * ストレージからデータを読み込み
   */
  private async load(): Promise<void> {
    try {
      const data = await this.loadFromStorage();
      if (data) {
        // デフォルト設定とマージして、新しいプロパティを追加
        this.currentSettings = this.mergeWithDefaults(data.settings);
        this.currentProfileId = data.currentProfileId;

        // プロファイルをマップに変換（各プロファイルの設定もマージ）
        Object.entries(data.profiles).forEach(([id, profile]) => {
          this.profiles.set(id, {
            ...profile,
            settings: this.mergeWithDefaults(profile.settings),
          });
        });
      } else {
        // デフォルトプロファイルを作成
        this.createDefaultProfile();
      }
    } catch (error) {
      console.error('[SettingsManager] Failed to load settings:', error);
      this.createDefaultProfile();
    }
  }

  /**
   * 設定をデフォルト値とマージ（新しいプロパティを追加）
   */
  private mergeWithDefaults(settings: Settings): Settings {
    return {
      ...DEFAULT_SETTINGS,
      ...settings,
      visibility: {
        ...DEFAULT_SETTINGS.visibility,
        ...settings.visibility,
      },
      layout: {
        ...DEFAULT_SETTINGS.layout,
        ...settings.layout,
      },
    };
  }

  /**
   * ストレージからデータを取得
   */
  private async loadFromStorage(): Promise<StorageData | null> {
    return new Promise((resolve) => {
      if (typeof GM_getValue === 'undefined') {
        // GM_getValueが使えない場合はlocalStorageを使用
        const data = localStorage.getItem(STORAGE_KEY);
        resolve(data ? JSON.parse(data) : null);
      } else {
        const data = GM_getValue(STORAGE_KEY, null);
        resolve(data ? JSON.parse(data as string) : null);
      }
    });
  }

  /**
   * ストレージにデータを保存
   */
  private async saveToStorage(data: StorageData): Promise<void> {
    return new Promise((resolve) => {
      const jsonData = JSON.stringify(data);
      
      if (typeof GM_setValue === 'undefined') {
        // GM_setValueが使えない場合はlocalStorageを使用
        localStorage.setItem(STORAGE_KEY, jsonData);
      } else {
        GM_setValue(STORAGE_KEY, jsonData);
      }
      
      resolve();
    });
  }

  /**
   * デフォルトプロファイルを作成
   */
  private createDefaultProfile(): void {
    const now = Date.now();
    const defaultProfile: Profile = {
      id: 'default',
      name: 'Default',
      settings: { ...DEFAULT_SETTINGS },
      createdAt: now,
      updatedAt: now,
    };

    this.profiles.set('default', defaultProfile);
    this.currentProfileId = 'default';
    this.currentSettings = { ...DEFAULT_SETTINGS };
    this.save();
  }

  /**
   * 現在の設定を取得
   */
  public getSettings(): Settings {
    return { ...this.currentSettings };
  }

  /**
   * 設定を更新
   */
  public updateSettings(settings: Partial<Settings>): void {
    this.currentSettings = {
      ...this.currentSettings,
      ...settings,
      visibility: {
        ...this.currentSettings.visibility,
        ...(settings.visibility || {}),
      },
      layout: {
        ...this.currentSettings.layout,
        ...(settings.layout || {}),
      },
    };

    // 現在のプロファイルも更新
    const profile = this.profiles.get(this.currentProfileId);
    if (profile) {
      profile.settings = { ...this.currentSettings };
      profile.updatedAt = Date.now();
    }

    this.save();
  }

  /**
   * 設定を保存
   */
  public async save(): Promise<void> {
    const data: StorageData = {
      currentProfileId: this.currentProfileId,
      profiles: Object.fromEntries(this.profiles),
      settings: this.currentSettings,
    };

    await this.saveToStorage(data);
  }

  /**
   * 設定をリセット
   */
  public reset(): void {
    this.currentSettings = { ...DEFAULT_SETTINGS };
    this.save();
  }

  /**
   * プロファイルを作成
   */
  public createProfile(name: string): Profile {
    const id = `profile_${Date.now()}`;
    const now = Date.now();
    const profile: Profile = {
      id,
      name,
      settings: { ...this.currentSettings },
      createdAt: now,
      updatedAt: now,
    };

    this.profiles.set(id, profile);
    this.save();
    return profile;
  }

  /**
   * プロファイルを削除
   */
  public deleteProfile(profileId: string): boolean {
    if (profileId === 'default') {
      console.warn('[SettingsManager] Cannot delete default profile');
      return false;
    }

    const deleted = this.profiles.delete(profileId);
    if (deleted) {
      // 削除したプロファイルが現在のプロファイルの場合
      if (this.currentProfileId === profileId) {
        this.switchProfile('default');
      }
      this.save();
    }

    return deleted;
  }

  /**
   * プロファイルを切り替え
   */
  public switchProfile(profileId: string): boolean {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      console.warn(`[SettingsManager] Profile not found: ${profileId}`);
      return false;
    }

    this.currentProfileId = profileId;
    this.currentSettings = { ...profile.settings };
    this.save();
    return true;
  }

  /**
   * 現在のプロファイルIDを取得
   */
  public getCurrentProfileId(): string {
    return this.currentProfileId;
  }

  /**
   * プロファイルを取得
   */
  public getProfile(profileId: string): Profile | null {
    return this.profiles.get(profileId) || null;
  }

  /**
   * すべてのプロファイルを取得
   */
  public getAllProfiles(): Profile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * 設定をエクスポート
   */
  public exportSettings(): string {
    const data: StorageData = {
      currentProfileId: this.currentProfileId,
      profiles: Object.fromEntries(this.profiles),
      settings: this.currentSettings,
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * 設定をインポート
   */
  public importSettings(jsonData: string): boolean {
    try {
      const data: StorageData = JSON.parse(jsonData);

      // バリデーション
      if (!data.settings || !data.profiles || !data.currentProfileId) {
        throw new Error('Invalid settings data');
      }

      this.currentSettings = data.settings;
      this.currentProfileId = data.currentProfileId;

      // プロファイルをマップに変換
      this.profiles.clear();
      Object.entries(data.profiles).forEach(([id, profile]) => {
        this.profiles.set(id, profile);
      });

      this.save();
      return true;
    } catch (error) {
      console.error('[SettingsManager] Failed to import settings:', error);
      return false;
    }
  }

  /**
   * プロファイル名を変更
   */
  public renameProfile(profileId: string, newName: string): boolean {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      return false;
    }

    profile.name = newName;
    profile.updatedAt = Date.now();
    this.save();
    return true;
  }
}

