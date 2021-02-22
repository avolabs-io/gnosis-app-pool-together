import styled from 'styled-components';
import media from 'styled-media-query';

export const CountdownContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: auto;
`;

export const CountdownDigit = styled.h2`
  letter-spacing: 1px;
  margin-bottom: auto;
  margin: 0;
  text-align: center;
  font-size: 15px;
  ${media.lessThan('small')`
  font-size: 13px;
`}
`;

export const CountdownText = styled.p`
  letter-spacing: 1px;
  margin-bottom: auto;
  text-align: center;
  margin: 0;
  font-size: 11px;
  ${media.lessThan('small')`
  font-size: 10px;
`}
`;
