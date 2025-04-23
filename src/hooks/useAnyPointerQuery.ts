import { useMatchMedia } from "./useMatchMedia.ts";
import { Pointers } from "./usePrimaryPointerQuery.ts";

export const useAnyPointerQuery = (pointer: keyof typeof Pointers) => {
  return useMatchMedia(`(any-pointer: ${pointer})`);
};
