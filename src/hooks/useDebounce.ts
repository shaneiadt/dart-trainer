import { debounce } from "lodash";
import { useEffect, useMemo, useRef } from "react";

export const useDebounce = (callback: () => void) => {
    const ref = useRef<() => void | null>(null);

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const debouncedCallback = useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return debounce(func, 1000);
    }, []);

    return debouncedCallback;
};