import { createSlice } from "@reduxjs/toolkit";

export interface SettingsState {
  showRemainingCheckoutValue: boolean;
}

const initialState: SettingsState = {
  showRemainingCheckoutValue: false,
};

const { reducer, actions } = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleShowRemainingCheckoutValue: (state) => {
      state.showRemainingCheckoutValue = !state.showRemainingCheckoutValue;
    },
  },
});

export const { toggleShowRemainingCheckoutValue } = actions;

export default reducer;
