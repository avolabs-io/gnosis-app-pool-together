import React, { useState } from 'react';
import { Text, Button, Divider } from '@gnosis.pm/safe-react-components';
import useFitText from 'use-fit-text';
import {
  CoinImage,
  CardStyled,
  Column,
  PrizeText,
  LeftColumn,
  BalanceText,
  PrizeTextContainer,
  CountdownColumn,
} from './styled';
import PoolCardProps from './PoolCardProps';
import Countdown from '../Countdown';

import { Heading } from '../GeneralStyled';
import { useNavigation } from '../../providers/navigation';

const PoolCard: React.FC<PoolCardProps> = ({
  tokenImageUrl,
  userBalance,
  prizeValue,
  secondsRemaining,
  tokenSymbol,
  poolIndex,
}: PoolCardProps) => {
  const { fontSize, ref } = useFitText({
    minFontSize: 20,
    maxFontSize: 150,
    resolution: 5,
  });
  const { setNavigation } = useNavigation();

  const [imageUrl, setImageUrl] = useState(`https://gnosis-safe-token-logos.s3.amazonaws.com/${tokenImageUrl}.png`);

  return (
    <CardStyled>
      <LeftColumn>
        <CoinImage
          src={imageUrl}
          onError={() => {
            setImageUrl(
              'https://ipfs.io/ipfs/QmZ3oug89a3BaVqdJrJEA8CKmLF4M8snuAnphR6z1yq8V8/static/media/dai.7df58851.svg',
            );
          }}
        />
        <Divider />
        <span style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Text size="sm">Current Tickets</Text>
        </span>
        <BalanceText ref={ref} fontSize={fontSize}>
          {userBalance}
        </BalanceText>
      </LeftColumn>
      <Column>
        <Heading>Prize Value</Heading>
        <PrizeTextContainer>
          <PrizeText>${prizeValue}</PrizeText>
        </PrizeTextContainer>
      </Column>
      <CountdownColumn>
        <Heading>Countdown</Heading>
        <Countdown prizeGivingSecondsRemaining={secondsRemaining} />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Button
            size="lg"
            color="primary"
            variant="contained"
            onClick={() => setNavigation({ selectedPage: '1', initiallySelectedPool: poolIndex })}
          >
            Deposit {tokenSymbol}
          </Button>
        </div>
      </CountdownColumn>
    </CardStyled>
  );
};

export default PoolCard;
