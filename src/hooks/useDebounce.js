import { useRef } from 'react';

const useDebounce = (callback, timeout) => {
  const timer = useRef(null);

  return () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      callback();
      timer.current = null;
    }, timeout);
  };
};

export default useDebounce;
