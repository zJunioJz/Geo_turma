import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo à Home</Text>
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
});

export default HomeScreen;
