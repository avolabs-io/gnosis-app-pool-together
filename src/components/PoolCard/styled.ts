import styled from 'styled-components';
import media from 'styled-media-query';
import { Card } from '@gnosis.pm/safe-react-components';
import { Heading } from '../GeneralStyled';

export const CoinImage = styled.img`
  border-radius: 25px;
  height: 70px;
  width: 70px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  ${media.lessThan('small')`
  width: 60px;
  height: 60px;
  `}
`;

export const LoadingText = styled(Heading)`
  margin: auto 0 auto 0;
`;

export const CardStyled = styled(Card)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 150px;
  margin-top: 40px;
  margin-bottom: 40px;
  max-width: 750px;
  min-width: 300px;
  margin-left: auto;
  margin-right: auto;
  font-family: Averta, Roboto;
`;

export const Column = styled.div`
  align-self: flex-start;
  margin-left: 2.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: space-around;
`;

export const CountdownColumn = styled.div`
  align-self: flex-start;
  margin-left: 2.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: space-around;
  min-width: 30%;
  max-width: 30%;
`;

export const PrizeText = styled.h1`
  font-family: Averta, Roboto;
  font-size: 3.5rem;
  margin: 0;
  ${media.lessThan('medium')`
    font-size: 3rem;
  `}
  ${media.lessThan('small')`
    font-size:2rem;
  `}
`;

export const PrizeTextContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-top: auto;
`;

export const LeftColumn = styled.div`
  height: 100%;
  width: 150px;
  display: flex;
  flex-direction: column;
  text-align: center;
  ${media.lessThan('small')`
    width: 75px;
  `}
`;

export const BalanceText = styled.div`
  width: 100%;
  height: 50px;
  flex: 1;
  font-size: ${(props: { fontSize: string; ref: React.MutableRefObject<HTMLDivElement> }) => props.fontSize || '100%'};
`;
