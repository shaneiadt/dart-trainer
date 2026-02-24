import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { random } from "lodash";
import { CHECKOUTS, CheckoutsType } from "../../constants/checkouts";
import { BoardKey } from "../../constants/values";

export interface CheckoutTrainerState {
  checkout: number;
  minCheckoutValue: number;
  maxCheckoutValue: number;
  path: BoardKey[];
  showPath: boolean;
  gameInProgress: boolean;
}

const checkoutKeys = Object.keys(CHECKOUTS).map((n: keyof CheckoutsType) => n);
const initialMin = Number(checkoutKeys[0]);
const initialMax = Number(checkoutKeys[checkoutKeys.length - 1]);
const synth = globalThis.speechSynthesis;

const initialState: CheckoutTrainerState = {
  checkout: 0,
  minCheckoutValue: initialMin,
  maxCheckoutValue: initialMax,
  path: [],
  showPath: false,
  gameInProgress: false,
};

const { reducer, actions } = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckout: (state, action: PayloadAction<number>) => {
      state.checkout = action.payload;
    },
    setMinCheckoutValue: (state, action: PayloadAction<number>) => {
      state.minCheckoutValue = action.payload;
    },
    setMaxCheckoutValue: (state, action: PayloadAction<number>) => {
      state.maxCheckoutValue = action.payload;
    },
    addPath: (state, { payload }: PayloadAction<BoardKey>) => {
      state.path.push(payload);
    },
    resetPath: (state) => {
      state.path = [];
    },
    showPath: (state, { payload }: PayloadAction<boolean>) => {
      state.showPath = payload;
    },
    startGame: (state) => {
      state.gameInProgress = true;
    },
    calculateCheckout: (state) => {
      const { minCheckoutValue, maxCheckoutValue } = state;
      const rand = random(minCheckoutValue, maxCheckoutValue);

      synth.speak(new SpeechSynthesisUtterance(`you require ${rand} `));

      state.checkout = rand;
      state.path = [];
      state.showPath = false;
    },
  },
});

export const {
  setCheckout,
  setMinCheckoutValue,
  setMaxCheckoutValue,
  startGame,
  addPath,
  resetPath,
  showPath,
  calculateCheckout,
} = actions;

export default reducer;
