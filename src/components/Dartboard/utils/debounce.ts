/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = (
  func: any,
  delay: number,
  options?: { leading?: boolean; trailing?: boolean },
) => {
  let timeout: ReturnType<typeof setInterval>;
  let leadingCall = false;
  let trailingCall = false;

  const debounced = (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (options?.leading && !leadingCall) {
      func(...(args as []));
      leadingCall = true;
    }

    timeout = setTimeout(() => {
      if (options?.trailing && leadingCall) {
        func(...(args as []));
      }
      leadingCall = false;
      trailingCall = false;
    }, delay);

    if (options?.trailing && !leadingCall && !trailingCall) {
      func(...(args as []));
      trailingCall = true;
    }
  };
  return debounced;
};
