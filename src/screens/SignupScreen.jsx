import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext';
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import axios from "axios";
import { API_URL } from "@env";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useUser();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useFocusEffect(
    React.useCallback(() => {
      // Limpar os estados ao focar na tela
      setUsername("");
      setEmail("");
      setPassword("");
      setUserError("");
      setEmailError("");
      setPasswordError("");

      return () => {
        
      };
    }, [])
  );

  const handleUsernameChange = (text) => {
    setUsername(text);
    if (text.length >= 5) {
      setUserError("");
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailRegex.test(text)) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text.length >= 8) {
      setPasswordError("");
    }
  };

  const handleRegister = async () => {
    setLoading(true);
  
    if (username.length < 5) {
      setUserError("O nome de usuário deve ter pelo menos 5 caracteres.");
      setLoading(false);
      return;
    } else {
      setUserError("");
    }
  
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      setLoading(false);
      return;
    } else {
      setEmailError("");
    }
  
    if (password.length < 8) {
      setPasswordError("Use 8 caracteres ou mais para sua senha");
      setLoading(false);
      return;
    } else {
      setPasswordError("");
    }
  
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
      });
  
      // Armazenar o token no AsyncStorage
      await AsyncStorage.setItem('userToken', response.data.token);
      await register({ username, email }, response.data.token);
      navigation.navigate('HOME');

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Um erro desconhecido ocorreu";
        console.log("API Error:", errorMessage);
        console.log("Error Details:", error.response);
  
        if (error.response && error.response.status === 400) {
          setEmailError("Este E-mail já está em uso. Tente outro.");
        } else {
          Alert.alert("Error", errorMessage);
        }
      } else {
        console.log("Unexpected Error:", error);
        Alert.alert(
          "Error",
          "Erro ao conectar com o servidor. Tente novamente mais tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };  

  const handleGoHome = () => {
    navigation.goBack();
  };

  const handleGoLogin = () => {
    navigation.navigate("LOGIN");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoHome}>
        <Ionicons
          name={"arrow-back-outline"}
          color={colors.primary}
          size={25}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Vamos começar</Text>
        <Text style={styles.headingText}>a sua jornada!</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"user"} size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Digite seu nome"
            placeholderTextColor={colors.secondary}
            value={username}
            onChangeText={handleUsernameChange}
          />
        </View>
        {userError ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="red"
              style={styles.errorIcon}
            />
            <Text style={styles.errorText}>{userError}</Text>
          </View>
        ) : null}
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
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="red"
              style={styles.errorIcon}
            />
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
          <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
            <SimpleLineIcons name={"eye"} size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="red"
              style={styles.errorIcon}
            />
            <Text style={styles.errorText}>{passwordError}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.loginButtonWrapper, loading && { opacity: 0.5 }]}
          onPress={handleRegister}
          disabled={loading} // Desabilitando o botão quando está carregando
        >
          {loading ? (
            <ActivityIndicator size="large" color={colors.white} />
          ) : (
            <Text style={styles.loginText}>Cadastrar</Text>
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
    color: "red",
    marginLeft: 5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    height: 24,
    width: 24,
  },
  googleText: {
    fontSize: 20,
    color: colors.white,
    fontFamily: fonts.SemiBold,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  accountText: {
    color: colors.white,
  },
  signupText: {
    color: colors.white,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default SignupScreen;
