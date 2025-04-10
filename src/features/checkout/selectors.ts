import { RootState } from "../../store";

export const getMinCheckoutValue = (state: RootState) =>
  state.checkout.minCheckoutValue;

export const getMaxCheckoutValue = (state: RootState) =>
  state.checkout.maxCheckoutValue;

export const getCheckoutValue = (state: RootState) => state.checkout.checkout;

export const getShowPath = (state: RootState) => state.checkout.showPath;
