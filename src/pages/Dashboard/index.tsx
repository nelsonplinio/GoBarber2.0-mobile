import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProvidersListHeader,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const [providers, setProviders] = useState<Provider[]>([]);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = useCallback(
    ({ id: provider_id }: Provider) => {
      navigate('CreateAppointment', { provider_id });
    },
    [navigate],
  );

  useEffect(() => {
    async function loadProviders(): Promise<void> {
      const response = await api.get<Provider[]>('/providers');

      setProviders(response.data);
    }

    loadProviders();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#28262e" />
      <Container>
        <Header>
          <HeaderTitle>
            Bem vindo,
            {'\n'}
            <UserName>{user.name}</UserName>
          </HeaderTitle>

          <ProfileButton onPress={navigateToProfile}>
            <UserAvatar
              source={{
                uri:
                  user.avatar_url ||
                  `https://api.adorable.io/avatars/70/${user.name}@adorable.png`,
              }}
            />
          </ProfileButton>
        </Header>

        <ProvidersList
          data={providers}
          contentContainerStyle={{
            paddingTop: 32,
            paddingBottom: 16,
            paddingHorizontal: 24,
          }}
          keyExtractor={provider => provider.id}
          ListHeaderComponent={
            <ProvidersListHeader>Cabeleireiros</ProvidersListHeader>
          }
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => navigateToCreateAppointment(provider)}
            >
              <ProviderAvatar
                source={{
                  uri:
                    provider.avatar_url ||
                    `https://api.adorable.io/avatars/70/${provider.name}@adorable.png`,
                }}
              />

              <ProviderInfo>
                <ProviderName numberOfLines={1}>{provider.name}</ProviderName>
                <ProviderMeta>
                  <Icon name="calendar" size={14} color="#ff9000" />
                  <ProviderMetaText>Segunda à Sexta</ProviderMetaText>
                </ProviderMeta>
                <ProviderMeta>
                  <Icon name="clock" size={14} color="#ff9000" />
                  <ProviderMetaText>8h às 18h</ProviderMetaText>
                </ProviderMeta>
              </ProviderInfo>
            </ProviderContainer>
          )}
        />
      </Container>
    </>
  );
};

export default Dashboard;
