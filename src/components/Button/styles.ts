import styled, { css } from 'styled-components/native';
import { RectButton, RectButtonProperties } from 'react-native-gesture-handler';

type ContainerProps = {} & RectButtonProperties;

export const Container = styled(RectButton)<ContainerProps>`
  width: 100%;
  height: 60px;
  background: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 8px;

  ${({ enabled }) =>
    !enabled &&
    css`
      opacity: 0.6;
    `}
`;

export const ButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #312e38;
  font-size: 18px;
`;
