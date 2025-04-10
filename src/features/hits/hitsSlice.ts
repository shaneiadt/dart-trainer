import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { PolarPoint } from "../../components/Dartboard";
import { BoardKey } from "../../constants";

export type Hit = {
  point: PolarPoint;
  key: BoardKey;
  value: number;
};

export type HitsState = Hit[];

const initialState: HitsState = [];

export const { reducer, actions } = createSlice({
  name: "hits",
  initialState,
  reducers: {
    addHit: (state, action: PayloadAction<Hit>) => {
      return [...state, action.payload];
    },
    resetHitsState: () => {
      return [];
    },
  },
});

export const { addHit, resetHitsState } = actions;

export default reducer;
