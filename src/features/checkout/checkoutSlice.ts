import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardKey, CHECKOUTS, CheckoutsType } from "../../constants";
import { random } from "lodash";
import { getDartboardElement } from "../../components/Dartboard";

export interface CheckoutState {
  checkout: number;
  minCheckoutValue: number;
  maxCheckoutValue: number;
  path: BoardKey[];
  showPath: boolean;
}

const checkoutKeys = Object.keys(CHECKOUTS).map((n: keyof CheckoutsType) => n);
const initialMin = Number(checkoutKeys[0]);
const initialMax = Number(checkoutKeys[checkoutKeys.length - 1]);
const synth = window.speechSynthesis;

const initialState: CheckoutState = {
  checkout: random(initialMin, initialMax),
  minCheckoutValue: initialMin,
  maxCheckoutValue: initialMax,
  path: [],
  showPath: false,
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
    calculateCheckout: (state) => {
      const { minCheckoutValue, maxCheckoutValue } = state;
      const rand = random(minCheckoutValue, maxCheckoutValue);

      synth.speak(new SpeechSynthesisUtterance(`you require ${rand} `));

      state.checkout = rand;
      state.path = [];
      state.showPath = false;

      const dartboard = getDartboardElement();

      if (dartboard) {
        dartboard.hits = [];
      }
    },
  },
});

export const {
  setCheckout,
  setMinCheckoutValue,
  setMaxCheckoutValue,
  addPath,
  resetPath,
  showPath,
  calculateCheckout,
} = actions;

export default reducer;
