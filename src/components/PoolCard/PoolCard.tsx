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
} from './styled';

const PoolCard: React.FC = () => {
  const { fontSize, ref } = useFitText({
    minFontSize: 20,
    maxFontSize: 200,
    resolution: 5,
  });

  return (
    <CardStyled>
      <LeftColumn>
        <CoinImage src="https://ipfs.io/ipfs/QmZ3oug89a3BaVqdJrJEA8CKmLF4M8snuAnphR6z1yq8V8/static/media/dai.7df58851.svg" />
        <Divider />
        <span style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Text size="sm">Current Balance</Text>
        </span>
        <BalanceText ref={ref} fontSize={fontSize}>
          $0.00
        </BalanceText>
      </LeftColumn>
      <Column>
        <CardHeading>Prize Value</CardHeading>
        <PrizeTextContainer>
          <PrizeText>$3,035</PrizeText>
        </PrizeTextContainer>
      </Column>
      <Column>
        <CardHeading>Countdown</CardHeading>
        <CountdownText>0 days 4 hours 7 minutes</CountdownText>
        <Button size="lg" color="primary" variant="contained">
          Deposit DAI
        </Button>
      </Column>
    </CardStyled>
  );
};

export default PoolCard;
