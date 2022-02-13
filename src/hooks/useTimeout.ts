import { useEffect, useRef, useState } from "react";

export default function useTimeout<T extends Function>(callback: T, delay: number | null, deps?: any[]) {
    const savedCallback = useRef<T>();
    const savedId = useRef<NodeJS.Timeout>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback].concat(deps !== undefined ? deps : []));

    useEffect(() => {
        const tick = () => {
            if (savedCallback.current !== undefined) {
                savedCallback.current();
                if (delay !== null) {
                    savedId.current = setTimeout(tick, delay)
                }
            }
        };

        if (delay !== null) {
            tick();

            return () => {
                if (savedId.current !== undefined)
                    clearTimeout(savedId.current);
            };
        }
    }, [delay].concat(deps !== undefined ? deps : []));

    return savedId;
}