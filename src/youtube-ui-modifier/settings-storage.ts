import { getValue, setValue } from '@/shared/userscript';
import { STORAGE_KEY } from './constants';
import { DEFAULT_SETTINGS } from './settings-definitions';
import type { YoutubeUiModifierSettings } from '@/shared/types';

export class SettingsStorage {
  public load(): YoutubeUiModifierSettings {
    const stored = getValue<Partial<YoutubeUiModifierSettings>>(STORAGE_KEY, {});
    return {
      ...DEFAULT_SETTINGS,
      ...(stored ?? {}),
    };
  }

  public save(settings: YoutubeUiModifierSettings): void {
    setValue(STORAGE_KEY, settings);
  }
}
