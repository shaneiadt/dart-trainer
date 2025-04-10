import { RootState } from "../../store";

export const getHits = (state: RootState) => state.hits;

export const getIsDartboardDisabled = (state: RootState) =>
  state.hits.length === 3;
