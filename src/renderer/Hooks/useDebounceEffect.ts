import { DependencyList, useRef } from 'react';
import { useDebounce } from 'react-use';

/**
 * useDebounce that only fires if any dependency has changed
 */
export const useChangeDebounce = (fn: Function, ms?: number, deps?: DependencyList) => {
    const lastDepValues = useRef(deps);

    useDebounce(() => {
        if (lastDepValues.current.some((it, index) => it !== deps[index])) {
            fn();
        }

        lastDepValues.current = deps;
    }, 500, [deps, fn]);
};
