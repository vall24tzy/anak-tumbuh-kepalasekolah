import { useRef, useEffect, useCallback } from "react";

// Menunda eksekusi callback sampai user berhenti memicu selama `delay` ms.
// Berguna untuk search input agar tidak filter/fetch di setiap ketikan.
export default function useDebounce<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
) {
  const handler = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (handler.current) clearTimeout(handler.current);
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (handler.current) clearTimeout(handler.current);
      handler.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
