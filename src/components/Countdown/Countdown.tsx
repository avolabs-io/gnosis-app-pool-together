import React, { useState, useEffect } from 'react';
import { intervalToDuration, formatDuration } from 'date-fns';
import { useInterval } from '../../utils/useInterval';
import { Props } from './Countdown.types';
import { CountdownContainer, CountdownDigit, CountdownText } from './styled';

const Countdown: React.FC<Props> = ({ prizeGivingSecondsRemaining }: Props) => {
  const [countdownTimer, setCountdownTimer] = useState<number>(prizeGivingSecondsRemaining);
  const [display, setDisplay] = useState<React.ReactNode[]>([]);

  useEffect(() => setCountdownTimer(prizeGivingSecondsRemaining), [JSON.stringify(prizeGivingSecondsRemaining)]);

  const [initializedTime, _] = useState(Date.now());

  useInterval(() => {
    setCountdownTimer(countdownTimer - 1000);
  }, 1000);

  useEffect(() => {
    if (countdownTimer) {
      const content: React.ReactNode[] = [];
      const time = formatDuration(
        intervalToDuration({
          start: new Date(initializedTime),
          end: new Date(countdownTimer),
        }),
        { delimiter: ', ' },
      );
      const split = time.split(', ');

      split.map((elem, index) => {
        const num = elem.replace(/\D/g, '');
        const string = elem.match(/[a-zA-Z]+/g);
        if (string && string[0] == 'seconds') return;
        content.push(
          <CountdownDigit key={index} className="countdown-number">
            {num}&ensp;
          </CountdownDigit>,
        );
        content.push(
          <CountdownText key={index + 100} className="countdown-text">
            {string}&ensp;
          </CountdownText>,
        );
      });
      setDisplay(content);
    }
  }, [countdownTimer]);

  return (
    <>
      <CountdownContainer>{display}</CountdownContainer>
    </>
  );
};

export default React.memo(Countdown);
