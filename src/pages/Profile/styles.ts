import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 16px 25px;
`;

export const BackButton = styled(RectButton)`
  position: absolute;
  left: 8px;
  top: 8px;
  height: 52px;
  width: 52px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
  align-self: flex-start;
`;

export const UserAvatarContainer = styled.View`
  position: relative;
`;

export const UserAvatar = styled.Image`
  height: 182px;
  width: 182px;
  border-radius: 91px;
`;

export const UserAvatarButton = styled(RectButton)`
  position: absolute;
  background: #ff9000;
  height: 62px;
  width: 62px;
  border-radius: 31px;
  align-items: center;
  justify-content: center;
  bottom: -6px;
  right: -6px;
`;

export const LogoutButton = styled.TouchableOpacity`
  margin-top: 16px;
  width: 100%;
  height: 60px;
  align-items: center;
  justify-content: center;
`;

export const LogoutButtonText = styled.Text`
  color: #c54040;
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  border-radius: 10px;
`;
