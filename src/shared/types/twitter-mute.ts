export interface MuteSettings {
    version: number;
    stringKeywords: string[];
    regexKeywords: string[];
    lastImport: string | null;
    enabled: boolean;
    debugMode: boolean;
  }