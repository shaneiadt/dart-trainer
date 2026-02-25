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
  },
});

export const { toggleShowRemainingCheckoutValue } = actions;

export default reducer;
