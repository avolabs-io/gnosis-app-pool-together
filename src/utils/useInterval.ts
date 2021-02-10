import React, { useState, useEffect, useRef } from 'react';

type CallbackFunction = () => void;

export const useInterval = (callback: CallbackFunction, delay: number) => {
  const savedCallback = useRef<CallbackFunction>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (savedCallback.current !== undefined) {
        savedCallback.current();
      }
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
