import { useMatchMedia } from "./useMatchMedia.ts";
import { Pointers } from "./usePrimaryPointerQuery.ts";

export const enum Hovers {
  none = "none",
  hover = "hover",
}

export const useAnyStylusQuery = () => {
  return useMatchMedia(
    `(any-pointer: ${Pointers.fine}) and (any-hover: ${Hovers.none})`
  );
};
