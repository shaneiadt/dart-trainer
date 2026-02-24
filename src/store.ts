import { configureStore } from "@reduxjs/toolkit";
import checkoutTrainer from "./features/checkoutTrainer/checkoutTrainerSlice";
import settings from "./features/settings/settingsSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    checkoutTrainer,
    settings,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = (): AppDispatch => useDispatch();
