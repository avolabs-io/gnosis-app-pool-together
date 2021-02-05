import React from 'react';
import { Text, Button, Divider } from '@gnosis.pm/safe-react-components';
import useFitText from 'use-fit-text';
import {
  CoinImage,
  CardStyled,
  Column,
  PrizeText,
  LeftColumn,
  CountdownText,
  BalanceText,
  PrizeTextContainer,
  CountdownColumn,
} from './styled';
import PoolCardProps from './PoolCardProps';

import { Heading } from '../GeneralStyled';

const PoolCard: React.FC<PoolCardProps> = (props) => {
  const { fontSize, ref } = useFitText({
    minFontSize: 20,
    maxFontSize: 150,
    resolution: 5,
  });

  return (
    <CardStyled>
      <LeftColumn>
        <CoinImage src={props.tokenImageUrl} />
        <Divider />
        <span style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Text size="sm">Current Tickets</Text>
        </span>
        <BalanceText ref={ref} fontSize={fontSize}>
          {props.userBalance}
        </BalanceText>
      </LeftColumn>
      <Column>
        <Heading>Prize Value</Heading>
        <PrizeTextContainer>
          <PrizeText>${props.prizeValue}</PrizeText>
        </PrizeTextContainer>
      </Column>
      <CountdownColumn>
        <Heading>Countdown</Heading>
        <CountdownText>
          {props.countdown.days} days {props.countdown.hours} hours {props.countdown.minutes} minutes
        </CountdownText>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Button size="lg" color="primary" variant="contained">
            Deposit {props.tokenSymbol}
          </Button>
        </div>
      </CountdownColumn>
    </CardStyled>
  );
};

export default PoolCard;
