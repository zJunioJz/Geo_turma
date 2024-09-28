import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity,  } from 'react-native';
import { useUser } from '../context/UserContext'; 
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user} = useUser(); 

  const handleSettingsPress = () => {
    navigation.navigate("SETTINGS");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo à Home</Text>
      {user && (
        <Text style={styles.userInfoText}>
          Usuário: {user.email}
        </Text>
      )}
      <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
        <Text style={styles.buttonText}>Ir para Configurações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfoText: {
    fontSize: 18,
    marginVertical: 10,
  },
  tokenText: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 10,
  },
  settingsButton: {
    marginTop: 20,
    backgroundColor: '#007BFF', 
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
