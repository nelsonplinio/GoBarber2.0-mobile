import React, { useCallback, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Platform,
} from 'react-native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPassowrdText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const handleSubmit = useCallback((data: FormData) => {
    formRef.current?.reset();
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu login</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input name="email" icon="mail" placeholder="E-mail" />

              <Input
                name="password"
                secureTextEntry
                icon="lock"
                placeholder="Senha"
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Entrar
              </Button>
            </Form>
            <ForgotPassword>
              <ForgotPassowrdText>Esqueci minha senha</ForgotPassowrdText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
