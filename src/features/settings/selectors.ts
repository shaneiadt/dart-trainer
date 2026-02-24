import { RootState } from "../../store";

export const getSettingsState = (state: RootState) => state.settings;
export const getShowRemainingCheckoutValue = (state: RootState) =>
  getSettingsState(state).showRemainingCheckoutValue;
