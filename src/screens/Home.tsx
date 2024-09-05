import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export interface HomeScreenProps {}

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Ola Bem vindo ao Teste</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent : 'center',
        alignItems: 'center'
    },
});

export default HomeScreen;
