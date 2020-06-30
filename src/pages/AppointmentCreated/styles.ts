import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

export const Title = styled.Text`
  font-size: 28px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 16px;
`;

export const ProviderContainer = styled.View`
  align-items: center;
  width: 100%;
  margin: 16px 0;
`;

export const ProviderAvatar = styled.Image`
  height: 84px;
  width: 84px;
  border-radius: 50px;
`;

export const ProviderName = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Regular';
  margin-top: 16px;
`;

export const Description = styled.Text`
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  font-size: 22px;
  text-align: center;
  margin-bottom: 16px;
`;
