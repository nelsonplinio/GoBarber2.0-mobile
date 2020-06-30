import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RectButtonProperties } from 'react-native-gesture-handler';
import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
  children: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  enabled,
  ...rest
}) => {
  return (
    <Container enabled={enabled && !loading} {...rest}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <ButtonText>{children}</ButtonText>
      )}
    </Container>
  );
};

export default Button;
