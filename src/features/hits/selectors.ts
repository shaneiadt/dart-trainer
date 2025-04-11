import { RootState } from "../../store";
import { getIsCheckedOut } from "../checkout/selectors";

export const getHits = (state: RootState) => state.hits;

export const getIsDartboardDisabled = (state: RootState) =>
  state.hits.length === 3 || getIsCheckedOut(state);
