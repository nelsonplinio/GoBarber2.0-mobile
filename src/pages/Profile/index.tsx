import React, { useCallback, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { ScrollView, Alert, TextInput } from 'react-native';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import Permissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  BackButton,
  Title,
  UserAvatarContainer,
  UserAvatar,
  UserAvatarButton,
  LogoutButton,
  LogoutButtonText,
} from './styles';

interface FormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateProfile, signOut } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const { goBack } = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('O nome obrigatório'),

          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),

          old_password: Yup.string(),

          password: Yup.string().when('old_password', {
            is: val => val && !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string().notRequired(),
          }),

          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => val && !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string().notRequired(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateProfile(response.data);

        Alert.alert(
          'Atualização realizada!',
          'Atualização do perfil realizada com sucesso.',
        );
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Deu um erro ao realizar a atualização do perfil, tente novamente.',
        );
      } finally {
        setLoading(false);
      }
    },
    [updateProfile],
  );

  const handleGoBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const hadleUpdateAvatar = useCallback(async () => {
    const permissionsRequired = [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ];

    const checkResult = await Permissions.checkMultiple(permissionsRequired);

    let resultList = permissionsRequired.map(key => checkResult[key]);

    const checkBlockedOrUnavailable = resultList.find(
      result => result === RESULTS.UNAVAILABLE || result === RESULTS.BLOCKED,
    );

    if (checkBlockedOrUnavailable) {
      return;
    }

    const checkDenied = resultList.find(result => result === RESULTS.DENIED);

    if (checkDenied) {
      const requestResult = await Permissions.requestMultiple(
        permissionsRequired,
      );

      resultList = permissionsRequired.map(key => requestResult[key]);

      const checkDeniedOrBlocked = resultList.find(
        result => result === RESULTS.DENIED || result === RESULTS.BLOCKED,
      );

      if (checkDeniedOrBlocked) {
        return;
      }
    }

    ImagePicker.showImagePicker(
      {
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Tirar foto',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.error) {
          Alert.alert('Não foi possivel atualizar seu avatar');
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          name: response.fileName,
          type: response.type,
          uri: response.uri,
        });

        api.patch('/users/avatar', data).then(apiResponse => {
          updateProfile(apiResponse.data);
        });
      },
    );
  }, [updateProfile]);

  return (
    <ScrollView>
      <Container>
        <BackButton onPress={handleGoBack}>
          <Icon name="arrow-left" color="#f4ede8" size={32} />
        </BackButton>

        <UserAvatarContainer>
          <UserAvatar source={{ uri: user.avatar_url }} />

          <UserAvatarButton onPress={hadleUpdateAvatar}>
            <Icon name="camera" color="#312e38" size={32} />
          </UserAvatarButton>
        </UserAvatarContainer>

        <Title>Meu perfil</Title>
        <Form ref={formRef} initialData={user} onSubmit={handleSubmit}>
          <Input
            name="name"
            icon="user"
            placeholder="Nome"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => {
              emailInputRef.current?.focus();
            }}
          />

          <Input
            ref={emailInputRef}
            name="email"
            icon="mail"
            placeholder="E-mail"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => {
              oldPasswordInputRef.current?.focus();
            }}
          />

          <Input
            ref={oldPasswordInputRef}
            name="old_password"
            icon="lock"
            placeholder="Senha atual"
            secureTextEntry
            containerStyle={{ marginTop: 16 }}
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordInputRef.current?.focus();
            }}
          />

          <Input
            ref={passwordInputRef}
            name="password"
            icon="lock"
            placeholder="Nova senha"
            secureTextEntry
            returnKeyType="next"
            onSubmitEditing={() => {
              confirmPasswordInputRef.current?.focus();
            }}
          />

          <Input
            ref={confirmPasswordInputRef}
            name="password_confirmation"
            icon="lock"
            placeholder="Confirmar senha"
            secureTextEntry
            returnKeyType="send"
            onSubmitEditing={() => formRef.current?.submitForm()}
          />
        </Form>
        <Button
          loading={loading}
          style={{ width: '100%' }}
          onPress={() => formRef.current?.submitForm()}
        >
          Confirmar mudanças
        </Button>

        <LogoutButton onPress={handleSignOut}>
          <LogoutButtonText>Sair da conta</LogoutButtonText>
        </LogoutButton>
      </Container>
    </ScrollView>
  );
};

export default Profile;
