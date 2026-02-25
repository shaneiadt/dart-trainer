export interface SettingsState {
  showRemainingCheckoutValue: boolean;
}

export interface PersistedSettings {
  version: number;
  settings: SettingsState;
}
