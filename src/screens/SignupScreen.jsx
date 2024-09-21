import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import axios from 'axios';
import { API_URL } from '@env';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleRegister = async () => {
    // Validar o comprimento da senha
    if (password.length < 8) {
      setPasswordError('Use 8 caracteres ou mais para sua senha');
      return; // Impedir o envio do formulário se a senha for inválida
    }

    // Validar o domínio do e-mail
    if (!email.endsWith('@gmail.com')) {
      setEmailError('O e-mail deve terminar com @gmail.com');
      return; // Impedir o envio do formulário se o e-mail não for válido
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
      });
      navigation.navigate('HOME');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'An unknown error occurred';
        console.log('API Error:', errorMessage);
        console.log('Error Details:', error.response);
    
        if (error.response && error.response.status === 400) {
          setEmailError('Este E-mail já está em uso. Tente outro.');
        } else {
          Alert.alert('Error', errorMessage);
        }
      } else {
        console.log('Unexpected Error:', error);
        Alert.alert('Error', 'Erro ao conectar com o servidor. Tente novamente mais tarde.');
      }
    }
    
  };

  const handleGoHome = () => {
    navigation.goBack();
  };

  const handleGoLogin = () => {
    navigation.navigate("LOGIN");
  };

  // Função para lidar com mudanças no campo de email
  const handleEmailChange = (text) => {
    setEmail(text);
    // Limpar o erro de email quando o usuário altera o valor do campo
    if (text.endsWith('@gmail.com') || !emailError) {
      setEmailError('');
    }
  };

  // Função para lidar com mudanças no campo de senha
  const handlePasswordChange = (text) => {
    setPassword(text);
    // Limpar o erro de senha quando o usuário altera o valor do campo
    if (passwordError) {
      setPasswordError('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoHome}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Vamos começar</Text>
        <Text style={styles.headingText}>a sua jornada!</Text>
      </View>
      {/* form */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"user"} size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Digite seu nome"
            placeholderTextColor={colors.secondary}
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Digite seu e-mail"
            placeholderTextColor={colors.secondary}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
          />
        </View>
        {emailError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={20} color="red" style={styles.errorIcon} />
            <Text style={styles.errorText}>{emailError}</Text>
          </View>
        ) : null}
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Digite sua senha"
            placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntry}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <TouchableOpacity onPress={() => setSecureEntry(prev => !prev)}>
            <SimpleLineIcons name={"eye"} size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={20} color="red" style={styles.errorIcon} />
            <Text style={styles.errorText}>{passwordError}</Text>
          </View>
        ) : null}
        <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleRegister}>
          <Text style={styles.loginText}>Cadastrar</Text>
        </TouchableOpacity>
        <Text style={styles.continueText}>ou continue com</Text>
        <TouchableOpacity style={styles.googleButtonContainer}>
          <Image source={require('../assets/google.png')} style={styles.googleImage} />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Já tem uma conta!</Text>
          <TouchableOpacity onPress={handleGoLogin}>
            <Text style={styles.signupText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginLeft: 5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    marginLeft: 10,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  textContainer: {
    marginVertical: 30,
  },
  headingText: {
    fontSize: 32,
    color: colors.white,
    fontFamily: fonts.SemiBold,
  },
  formContainer: {
    marginTop: 0,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
    color: colors.white,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: colors.white,
    fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.white,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    color: colors.white,
    fontFamily: fonts.SemiBold,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.white,
    fontFamily: fonts.Regular,
  },
  signupText: {
    color: colors.white,
    fontFamily: fonts.Bold,
  },
});

export default SignupScreen;