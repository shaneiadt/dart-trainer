import { BOARD_VALUES } from "../../constants";
import { RootState } from "../../store";

export const getMinCheckoutValue = (state: RootState) =>
  state.checkout.minCheckoutValue;

export const getMaxCheckoutValue = (state: RootState) =>
  state.checkout.maxCheckoutValue;

export const getCheckoutValue = (state: RootState) => state.checkout.checkout;

export const getShowPath = (state: RootState) => state.checkout.showPath;

export const getUserCheckoutPath = (state: RootState) => state.checkout.path;

export const getIsLastDartDouble = (state: RootState): boolean =>
  !!state.checkout.path[state.checkout.path.length - 1]?.includes("D");

export const getUserCheckoutValue = (state: RootState) =>
  state.checkout.path
    .map((bk) => BOARD_VALUES[bk])
    .reduce((pv, cv) => pv + cv, 0);

export const getIsCheckedOut = (state: RootState) => {
  const isLastDartDouble = getIsLastDartDouble(state);
  const checkout = getCheckoutValue(state);
  const userCheckoutValue = getUserCheckoutValue(state);

  return isLastDartDouble && userCheckoutValue === checkout;
};
