import styled from 'styled-components/native';

import { Platform, FlatList } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { RectButton } from 'react-native-gesture-handler';
import { Provider, ProviderDayAvailability } from './index';

interface ChipsButtonProps {
  selected?: boolean;
}

interface ChipsButtonTextProps {
  selected?: boolean;
}

interface HourItemProps {
  selected: boolean;
  available: boolean;
}

interface HourItemTextProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

const headerPaddingTop = Platform.OS === 'ios' ? getStatusBarHeight() : 24;
export const Header = styled.View`
  padding: ${headerPaddingTop}px 24px 24px;
  background: #28262e;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity`
  height: 30px;
  width: 30px;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 24px;
  font-family: 'RobotoSlab-Medium';
  line-height: 28px;
  margin-left: 16px;
`;
export const UserAvatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 30px;
  margin-left: auto;
`;

export const ProvidersListContainer = styled.View``;

export const ProvidersList = styled(
  FlatList as new () => FlatList<Provider>,
).attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingEnd: 24,
    paddingStart: 16,
    paddingVertical: 24,
  },
})``;

export const ChipsButton = styled(RectButton)<ChipsButtonProps>`
  background: ${({ selected }) => (selected ? '#ff9000' : '#3e3b47')};
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  padding: 8px 16px;
  margin-left: 10px;
`;

export const ChipsButtonAvatar = styled.Image`
  height: 32px;
  width: 32px;
  border-radius: 16px;
  margin-right: 8px;
`;

export const ChipsButtonText = styled.Text<ChipsButtonTextProps>`
  font-size: 18px;
  font-family: 'RobotoSlab-Medium';
  color: ${({ selected }) => (selected ? '#3e3b47' : '#f4ede8')};
`;

export const Title = styled.Text`
  font-size: 28px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 16px;
`;

export const DatePickerContainer = styled.TouchableOpacity`
  margin: 0 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const DatePickerText = styled.Text`
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  font-size: 24px;
`;

export const DatePickerLabel = styled.Text`
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  font-size: 18px;
  opacity: 0.7;
`;

export const HourDayPeriodContainer = styled.View``;

export const HourDayPeriodTitle = styled.Text`
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  font-size: 20px;
  margin-left: 16px;
`;

export const HourDayPeriodList = styled(
  FlatList as new () => FlatList<ProviderDayAvailability>,
).attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingEnd: 16,
    paddingStart: 16,
    paddingVertical: 16,
  },
})``;

export const HourItem = styled(RectButton)<HourItemProps>`
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  padding: 8px 16px;
  margin-left: 10px;

  opacity: ${({ available }) => (available ? 1 : 0.4)};
  background: ${({ selected }) => (selected ? '#ff9000' : '#3e3b47')};
`;

export const HourItemText = styled.Text<ChipsButtonTextProps>`
  font-size: 18px;
  font-family: 'RobotoSlab-Medium';
  color: ${({ selected }) => (selected ? '#3e3b47' : '#f4ede8')};
`;
