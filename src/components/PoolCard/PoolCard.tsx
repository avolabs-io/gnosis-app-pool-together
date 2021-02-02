import React from 'react';
import { Text, Button, Divider } from '@gnosis.pm/safe-react-components';
import useFitText from 'use-fit-text';
import {
  CoinImage,
  CardStyled,
  Column,
  CardHeading,
  PrizeText,
  LeftColumn,
  CountdownText,
  BalanceText,
  PrizeTextContainer,
  CountdownColumn,
} from './styled';
import PoolCardProps from './PoolCardProps';

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
        <CardHeading>Prize Value</CardHeading>
        <PrizeTextContainer>
          <PrizeText>${props.prizeValue}</PrizeText>
        </PrizeTextContainer>
      </Column>
      <CountdownColumn>
        <CardHeading>Countdown</CardHeading>
        <CountdownText>
          {props.countdown.days} days {props.countdown.hours} hours {props.countdown.minutes} minutes
        </CountdownText>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {props.userBalance === '0.00' && (
            <Button size="lg" color="primary" variant="contained">
              Deposit {props.tokenSymbol}
            </Button>
          )}
          {!(props.userBalance === '0.00') && (
            <div style={{ display: 'flex', height: '80px', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Button size="md" color="primary" variant="contained">
                Deposit {props.tokenSymbol}
              </Button>
              <Button size="md" color="secondary" variant="contained">
                Withdraw {props.tokenSymbol}
              </Button>
            </div>
          )}
        </div>
      </CountdownColumn>
    </CardStyled>
  );
};

export default PoolCard;
