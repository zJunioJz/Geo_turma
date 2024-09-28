// src/screens/LogoutScreen.js
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); 
      logout(); 
      
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LOGIN' }],
        });
      }, 100); 
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleProfile = () => {
    navigation.navigate("SETTINGS");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.alert}>
          <View style={styles.alertContent}>
            <Image
              alt=""
              style={styles.alertAvatar}
              source={{
                uri:"https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png"
              }} />

            <Text style={styles.alertTitle}>
              Sair da conta
              {'\n'}
              {user ? user.username : 'Usuário'}
            </Text>

            <Text style={styles.alertMessage}>
              Você tem certeza de que deseja sair desta conta?
              Você precisará da sua senha para fazer login novamente.
            </Text>
          </View>

          <TouchableOpacity onPress={handleLogout}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Sim, sair</Text>
            </View>
          </TouchableOpacity>

          <View style={{ marginTop: 8 }}>
            <TouchableOpacity onPress={handleProfile}>
              <View style={styles.btnSecondary}>
                <Text style={styles.btnSecondaryText}>Cancelar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  alert: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'stretch',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingTop: 80,
  },
  alertContent: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  alertAvatar: {
    width: 160,
    height: 160,
    borderRadius: 9999,
    alignSelf: 'center',
    marginBottom: 24,
  },
  alertTitle: {
    marginBottom: 16,
    fontSize: 34,
    lineHeight: 44,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  alertMessage: {
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    color: '#9a9a9a',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#f75249',
    borderColor: '#f75249',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  btnSecondaryText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#f75249',
  },
});

export default LogoutScreen;
