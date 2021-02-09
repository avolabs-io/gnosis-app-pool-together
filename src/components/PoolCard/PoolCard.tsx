import React, {useState} from 'react';
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

  const [imageUrl, setImageUrl] = useState(`https://gnosis-safe-token-logos.s3.amazonaws.com/${props.tokenImageUrl}.png`);

  return (
    <CardStyled>
      <LeftColumn>
        <CoinImage
          src={imageUrl}
          onError={() => {
            setImageUrl('https://ipfs.io/ipfs/QmZ3oug89a3BaVqdJrJEA8CKmLF4M8snuAnphR6z1yq8V8/static/media/dai.7df58851.svg');
          }}
        />
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
