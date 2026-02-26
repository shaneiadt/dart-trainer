export interface SettingsState {
  showRemainingCheckoutValue: boolean;
  displayWelcomeMessage: boolean;
  isVoiceoverEnabled: boolean;
  isSpeechRecognitionEnabled: boolean;
}

export interface PersistedSettings {
  version: number;
  settings: SettingsState;
}
