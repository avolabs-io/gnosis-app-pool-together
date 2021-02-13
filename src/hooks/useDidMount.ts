import { useRef } from 'react';

export const useDidMount = (fn: () => void): void => {
  const isMounted = useRef(false);
  if (!isMounted.current) {
    isMounted.current = true;
    fn();
  }
};
