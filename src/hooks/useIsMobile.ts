import { useEffect, useState } from "react";

export const useIsMobile = (MOBILE_BREAKPOINT = 768) => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = globalThis.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );

    const onChange = () => {
      setIsMobile(globalThis.innerWidth < MOBILE_BREAKPOINT);
    };

    mql.addEventListener("change", onChange);

    setIsMobile(globalThis.innerWidth < MOBILE_BREAKPOINT);

    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, [MOBILE_BREAKPOINT]);

  return !!isMobile;
};
