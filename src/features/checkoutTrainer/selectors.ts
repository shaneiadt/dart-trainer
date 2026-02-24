import { BOARD_VALUES } from "../../constants/values";
import { RootState } from "../../store";

export const getCheckoutTrainerState = (state: RootState) =>
  state.checkoutTrainer;
export const getMinCheckoutValue = (state: RootState) =>
  getCheckoutTrainerState(state).minCheckoutValue;

export const getMaxCheckoutValue = (state: RootState) =>
  getCheckoutTrainerState(state).maxCheckoutValue;

export const getCheckoutValue = (state: RootState) =>
  getCheckoutTrainerState(state).checkout;

export const getShowPath = (state: RootState) =>
  getCheckoutTrainerState(state).showPath;

export const getUserCheckoutPath = (state: RootState) =>
  getCheckoutTrainerState(state).path;

export const getIsCheckoutTrainerGameInProgress = (state: RootState) =>
  getCheckoutTrainerState(state).gameInProgress;

export const getIsLastDartDouble = (state: RootState): boolean =>
  !!getCheckoutTrainerState(state).path[
    getCheckoutTrainerState(state).path.length - 1
  ]?.includes("D");

export const isBusted = (state: RootState) => {
  const checkout = getCheckoutValue(state);
  const userCheckoutValue = getUserCheckoutValue(state);
  const isLastDartDouble = getIsLastDartDouble(state);

  return (
    userCheckoutValue > checkout ||
    (userCheckoutValue === checkout && !isLastDartDouble)
  );
};

export const getUserCheckoutValue = (state: RootState) =>
  getCheckoutTrainerState(state)
    .path.map((bk) => BOARD_VALUES[bk])
    .reduce((pv, cv) => pv + cv, 0);

export const getIsCheckedOut = (state: RootState) => {
  const isLastDartDouble = getIsLastDartDouble(state);
  const checkout = getCheckoutValue(state);
  const userCheckoutValue = getUserCheckoutValue(state);

  return isLastDartDouble && userCheckoutValue === checkout;
};

export const getIsDartboardDisabled = (state: RootState) =>
  getCheckoutTrainerState(state).path.length === 3 ||
  getIsCheckedOut(state) ||
  !getIsCheckoutTrainerGameInProgress(state) ||
  isBusted(state);

export const getDartsRemaining = (state: RootState) =>
  3 - getUserCheckoutPath(state).length;
