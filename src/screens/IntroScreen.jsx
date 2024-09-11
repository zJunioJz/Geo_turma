import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

const IntroScreen = () => {
  const navigation = useNavigation();
  
  const [activeButton, setActiveButton] = useState(null);

  const handleLogin = () => {
    setActiveButton("login");
    navigation.navigate("LOGIN");
  };

  const handleSignup = () => {
    setActiveButton("signup");
    navigation.navigate("SIGNUP");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Image source={require("../assets/man.png")} style={styles.bannerImage} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.loginButtonWrapper,
            { backgroundColor: activeButton === "login" ? colors.primary : colors.white },
          ]}
          onPress={handleLogin}
        >
          <Text style={[styles.loginButtonText, { color: activeButton === "login" ? colors.white : colors.primary }]}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.loginButtonWrapper,
            { backgroundColor: activeButton === "signup" ? colors.primary : colors.white },
          ]}
          onPress={handleSignup}
        >
          <Text style={[styles.signupButtonText, { color: activeButton === "signup" ? colors.white : colors.primary }]}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  logo: {
    height: 40,
    width: 140,
    marginVertical: 30,
    marginTop: 130,
  },
  bannerImage: {
    marginVertical: 20,
    height: 250,
    width: 231,
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.SemiBold,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.primary,
    marginTop: 40,
  },
  subTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.secondary,
    fontFamily: fonts.Medium,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    width: "80%",
    height: 60,
    borderRadius: 100,
  },
  loginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    borderRadius: 100,
  },
  loginButtonText: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
  signupButtonText: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
});
