import { createSlice } from "@reduxjs/toolkit";
import { SettingsState } from "./types";
import { loadSettings, saveSettings } from "./utils";

const initialState: SettingsState = loadSettings();

const { reducer, actions } = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleShowRemainingCheckoutValue: (state) => {
      state.showRemainingCheckoutValue = !state.showRemainingCheckoutValue;
      saveSettings(state);
    },
    toggleDisplayWelcomeMessage: (state) => {
      state.displayWelcomeMessage = !state.displayWelcomeMessage;
      saveSettings(state);
    },
    toggleVoiceover: (state) => {
      state.isVoiceoverEnabled = !state.isVoiceoverEnabled;
      saveSettings(state);
    },
    toggleSpeechRecognition: (state) => {
      state.isSpeechRecognitionEnabled = !state.isSpeechRecognitionEnabled;
      saveSettings(state);
    },
  },
});

export const {
  toggleShowRemainingCheckoutValue,
  toggleDisplayWelcomeMessage,
  toggleVoiceover,
  toggleSpeechRecognition,
} = actions;

export default reducer;
