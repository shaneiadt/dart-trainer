/* eslint-disable @typescript-eslint/no-explicit-any */
export const throttle = (func: () => void, delay: number) => {
  let timerFlag: ReturnType<typeof setInterval> | null = null;
  return (...args: any[]) => {
    if (timerFlag === null) {
      func(...(args) as []);
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
};

export const throttleAnimation = (func: () => void) => {
  let isFiring = false;
  return (...args: []) => {
    if (isFiring === false) {
      requestAnimationFrame(() => {
        func(...args);
        isFiring = false;
      });
    }
    isFiring = true;
  };
};
