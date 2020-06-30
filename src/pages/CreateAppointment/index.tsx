import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Alert, ScrollView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, isToday, isTomorrow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import Button from '../../components/Button';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ChipsButton,
  ChipsButtonAvatar,
  ChipsButtonText,
  Title,
  DatePickerContainer,
  DatePickerText,
  DatePickerLabel,
  HourDayPeriodContainer,
  HourDayPeriodTitle,
  HourDayPeriodList,
  HourItem,
  HourItemText,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url?: string;
}

interface RouteParams {
  provider_id: string;
}

export interface ProviderDayAvailability {
  hour: number;
  available: boolean;
  hourDate: Date;
  hourFormatted: string;
}

interface HourDayPeriod {
  morning: ProviderDayAvailability[];
  afternoon: ProviderDayAvailability[];
  night?: ProviderDayAvailability[];
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();
  const routeParams = route.params as RouteParams;

  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.provider_id,
  );
  const [hourDayPeriod, setHourDayPeriod] = useState<HourDayPeriod>(
    {} as HourDayPeriod,
  );
  const [datePickerOpened, setDatePickerOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [
    selectedHour,
    setSelectedHour,
  ] = useState<ProviderDayAvailability | null>(null);

  const selectedDateFormatted = useMemo(() => {
    if (isToday(selectedDate)) {
      return 'Hoje';
    }

    if (isTomorrow(selectedDate)) {
      return 'Amanha';
    }

    return format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  }, [selectedDate]);

  const handleToggleOpenDatePicker = useCallback(() => {
    setDatePickerOpened(!datePickerOpened);
  }, [datePickerOpened]);

  const handleOnDateChange = useCallback((_: Event, date?: Date) => {
    if (Platform.OS === 'android') {
      setDatePickerOpened(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleSelectHour = useCallback((hour: ProviderDayAvailability) => {
    setSelectedHour(hour);
  }, []);

  const handleScheduleAppointment = useCallback(async () => {
    if (!selectedHour) {
      Alert.alert('Horário necessario', 'Selecione um horário para agendar.');
      return;
    }

    try {
      setLoading(true);

      await api.post('/appointments', {
        provider_id: selectedProvider,
        date: selectedHour?.hourDate,
      });

      goBack();

      Alert.alert(
        'Agendamento concluido',
        `Seu agendamento foi feito com sucesso para ${selectedDateFormatted} às ${selectedHour.hourFormatted}`,
      );
    } catch (error) {
      if (error.response) {
        Alert.alert('Erro no agendamento', error.response.data.message);
        return;
      }

      Alert.alert(
        'Erro no agendamento',
        'Ocorreu algo inesperado no seu agendamento.',
      );
    } finally {
      setLoading(false);
    }
  }, [selectedHour, selectedDateFormatted, selectedProvider, goBack]);

  useEffect(() => {
    async function loadProviders(): Promise<void> {
      const response = await api.get<Provider[]>('/providers');

      const selectedProviderIndex = response.data.findIndex(
        ({ id }) => id === routeParams.provider_id,
      );

      let providersResponse = response.data;

      if (selectedProviderIndex !== -1) {
        const [selected] = providersResponse.splice(selectedProviderIndex, 1);

        providersResponse = [selected, ...providersResponse];
      }

      setProviders(providersResponse);
    }

    loadProviders();
  }, [routeParams.provider_id]);

  useEffect(() => {
    async function loadProviderDayAvailability(): Promise<void> {
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();

      const response = await api.get<ProviderDayAvailability[]>(
        `/providers/${selectedProvider}/day-availability`,
        {
          params: {
            day,
            year,
            month: month + 1,
          },
        },
      );

      const providerDayAvailability = response.data
        // .filter(({ available }) => available)
        .map<ProviderDayAvailability>(({ hour, available }) => ({
          hour,
          available,
          hourDate: new Date(year, month, day, hour),
          hourFormatted: format(new Date(year, month, day, hour), 'HH:mm'),
        }));

      const morning = providerDayAvailability.filter(
        dayAvailability => dayAvailability.hour < 12,
      );

      const afternoon = providerDayAvailability.filter(
        dayAvailability => dayAvailability.hour >= 12,
      );

      setHourDayPeriod({
        morning,
        afternoon,
      });
    }

    loadProviderDayAvailability();
  }, [selectedDate, selectedProvider]);

  return (
    <Container>
      <Header>
        <BackButton onPress={goBack}>
          <Icon name="arrow-left" size={30} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar
          source={{
            uri:
              user.avatar_url ||
              `https://api.adorable.io/avatars/70/${user.name}@adorable.png`,
          }}
        />
      </Header>
      <ScrollView style={{ flex: 1 }}>
        <ProvidersListContainer>
          <ProvidersList
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ChipsButton
                selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <ChipsButtonAvatar
                  source={{
                    uri:
                      provider.avatar_url ||
                      `https://api.adorable.io/avatars/70/${provider.name}@adorable.png`,
                  }}
                />

                <ChipsButtonText selected={provider.id === selectedProvider}>
                  {provider.name}
                </ChipsButtonText>
              </ChipsButton>
            )}
          />
        </ProvidersListContainer>

        <Title>Escolha a data</Title>

        <DatePickerContainer onPress={handleToggleOpenDatePicker}>
          <DatePickerText>{selectedDateFormatted}</DatePickerText>
          <DatePickerLabel>Alterar</DatePickerLabel>
        </DatePickerContainer>

        {datePickerOpened && (
          <DateTimePicker
            value={selectedDate}
            onChange={handleOnDateChange}
            mode="date"
            display="calendar"
            textColor="#f4ede8"
            minimumDate={new Date()}
          />
        )}

        <Title>Escolha o horário</Title>

        <HourDayPeriodContainer>
          <HourDayPeriodTitle>Manha</HourDayPeriodTitle>

          <HourDayPeriodList
            data={hourDayPeriod.morning}
            keyExtractor={({ hour }) => String(hour)}
            renderItem={({ item: hourAvailability }) => (
              <HourItem
                available={hourAvailability.available}
                enabled={hourAvailability.available}
                onPress={() => handleSelectHour(hourAvailability)}
                selected={selectedHour?.hour === hourAvailability.hour}
              >
                <HourItemText
                  selected={selectedHour?.hour === hourAvailability.hour}
                >
                  {hourAvailability.hourFormatted}
                </HourItemText>
              </HourItem>
            )}
          />
        </HourDayPeriodContainer>

        <HourDayPeriodContainer>
          <HourDayPeriodTitle>Tarde</HourDayPeriodTitle>

          <HourDayPeriodList
            data={hourDayPeriod.afternoon}
            keyExtractor={({ hour }) => String(hour)}
            renderItem={({ item: hourAvailability }) => (
              <HourItem
                available={hourAvailability.available}
                enabled={hourAvailability.available}
                onPress={() => handleSelectHour(hourAvailability)}
                selected={selectedHour?.hour === hourAvailability.hour}
              >
                <HourItemText
                  selected={selectedHour?.hour === hourAvailability.hour}
                >
                  {hourAvailability.hourFormatted}
                </HourItemText>
              </HourItem>
            )}
          />
        </HourDayPeriodContainer>

        <Button
          loading={loading}
          enabled={!!selectedHour}
          onPress={handleScheduleAppointment}
          style={{ marginHorizontal: '5%', marginVertical: 22, width: '90%' }}
        >
          Agendar
        </Button>
      </ScrollView>
    </Container>
  );
};

export default CreateAppointment;
