import React, { useMemo, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format, isToday, isTomorrow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Button from '../../components/Button';

import {
  Container,
  Title,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Description,
} from './styles';

interface RouteParams {
  date: number;
  provider: string;
}

interface Provider {
  name: string;
  avatar_url?: string;
}

const AppointmentCreated: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const appointmentDateFormatted = useMemo<string>(() => {
    const { date } = routeParams;
    if (isToday(date)) {
      return format(date, "'Hoje às 'HH:mm'h'");
    }

    if (isTomorrow(date)) {
      return format(date, "'Amanha às 'HH:mm'h'");
    }

    return format(date, "eeee, 'dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'", {
      locale: ptBR,
    });
  }, [routeParams]);

  const provider = useMemo<Provider>(() => {
    return JSON.parse(routeParams.provider) as Provider;
  }, [routeParams]);

  const { reset } = useNavigation();

  const handleOkButton = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard',
        },
      ],
      index: 0,
    });
  }, [reset]);

  return (
    <Container>
      <Icon name="check" color="#04d361" size={120} />

      <Title>Agendamento realizado</Title>

      <ProviderContainer>
        <ProviderAvatar
          source={{
            uri:
              provider.avatar_url ||
              `https://api.adorable.io/avatars/70/${provider.name}@adorable.png`,
          }}
        />

        <ProviderName>{provider.name}</ProviderName>
      </ProviderContainer>

      <Description>{appointmentDateFormatted}</Description>

      <Button style={{ marginVertical: 16 }} onPress={handleOkButton}>
        OK
      </Button>
    </Container>
  );
};

export default AppointmentCreated;
