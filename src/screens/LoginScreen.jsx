import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext';
import { API_URL } from "@env";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUser();

  // Limpar estados ao focar na tela
  useFocusEffect(
    React.useCallback(() => {
      setEmail("");
      setPassword("");
      setErrorMessage("");

      return () => {};
    }, [])
  );

  const handleInputChange = (setter) => (value) => {
    setter(value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    } else {
      setErrorMessage("");
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        await login(data.user, data.token); 
        navigation.navigate("HOME");
      } else {
        setErrorMessage("Email ou senha incorretos");
      }
    } catch (error) {
      console.error("Erro de login:", error);
      alert("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignup = () => {
    navigation.navigate("SIGNUP");
  };

  const handleGoBack = () => {
    navigation.navigate("LOGIN");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name={"arrow-back-outline"}
          color={colors.primary}
          size={25}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Olá,</Text>
        <Text style={styles.headingText}>Bem-vindo</Text>
        <Text style={styles.headingText}>de volta, Atleta</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Digite seu e-mail"
            placeholderTextColor={colors.secondary}
            keyboardType="email-address"
            value={email}
            onChangeText={handleInputChange(setEmail)}
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Digite sua senha"
            placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntery}
            value={password}
            onChangeText={handleInputChange(setPassword)}
          />
          <TouchableOpacity
            onPress={() => {
              setSecureEntery((prev) => !prev);
            }}
          >
            <SimpleLineIcons name={"eye"} size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="red"
              style={styles.errorIcon}
            />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.loginButtonWrapper, loading && { opacity: 0.5 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color={colors.white} />
          ) : (
            <Text style={styles.loginText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.continueText}>ou continue com</Text>
        <TouchableOpacity style={styles.googleButtonContainer}>
          <Image
            source={require("../assets/google.png")}
            style={styles.googleImage}
          />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Ainda não tem uma conta?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Cadastre-se</Text>
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
    padding: 30,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  textContainer: {
    marginVertical: 20,
    marginTop: 30,
  },
  headingText: {
    fontSize: 32,
    color: colors.white,
    fontFamily: fonts.SemiBold,
  },
  formContainer: {
    marginTop: 20,
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
    borderRadius: 10,
    marginTop: 20,
    paddingVertical: 10,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginLeft: 5,
  },
  errorIcon: {
    marginLeft: 10,
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
    marginTop: 40,
  },
  accountText: {
    color: colors.white,
    fontFamily: fonts.Regular,
  },
  signupText: {
    color: colors.white,
    fontFamily: fonts.SemiBold,
    marginLeft: 5,
  },
});

export default LoginScreen;
