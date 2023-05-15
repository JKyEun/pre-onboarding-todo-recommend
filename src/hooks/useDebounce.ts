import { useRef } from 'react';

const useDebounce = (callback: () => void, timeout: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      callback();
      timer.current = null;
    }, timeout);
  };
};

export default useDebounce;
