import { STORAGE_KEY, STORAGE_VERSION } from "./constants";
import { PersistedSettings, SettingsState } from "./types";

const defaultSettings: SettingsState = {
  showRemainingCheckoutValue: false,
};

export const migrateSettings = (
  persisted: PersistedSettings,
): SettingsState => {
  if (persisted.version === 1) {
    return {
      ...defaultSettings,
      ...persisted.settings,
    };
  }

  return defaultSettings;
};

export const loadSettings = (): SettingsState => {
  if (typeof globalThis === "undefined") {
    return defaultSettings;
  }

  try {
    const rawSettings = globalThis.localStorage.getItem(STORAGE_KEY);
    if (!rawSettings) {
      return defaultSettings;
    }

    const parsed = JSON.parse(rawSettings) as Partial<PersistedSettings>;
    if (typeof parsed !== "object" || parsed === null) {
      return defaultSettings;
    }

    if (
      typeof parsed.version !== "number" ||
      typeof parsed.settings !== "object" ||
      parsed.settings === null
    ) {
      return defaultSettings;
    }

    return migrateSettings(parsed as PersistedSettings);
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: SettingsState) => {
  if (typeof globalThis === "undefined") {
    return;
  }

  try {
    const payload: PersistedSettings = {
      version: STORAGE_VERSION,
      settings,
    };
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors (quota exceeded / blocked storage).
  }
};
