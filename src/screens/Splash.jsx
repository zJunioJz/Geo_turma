import { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from "@env";
import loadingJason from '../assets/loading.json';
import { colors } from '../utils/colors';

const size = Dimensions.get('window').width * 0.8;

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const checkToken = async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (token) {
                const response = await axios.get(`${API_URL}/verify-token`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
          
                if (response.status === 200) {
                  navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'HOME' }],
                  }));
                } else {
                  throw new Error('Token inválido');
                }
              } else {
                throw new Error('Nenhum token encontrado');
              }
            } catch (error) {
              console.error('Erro ao verificar o token ou buscar dados:', error);
              // Certifique-se de que o redirecionamento para LOGIN ocorra aqui
              navigation.dispatch(CommonActions.reset({
                index: 0,
                routes: [{ name: 'LOGIN' }],
              }));
            }
          };
          

        const timeout = setTimeout(() => {
            checkToken();
        }, 3000); // Verifica o token após 3 segundos

        return () => clearTimeout(timeout);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <LottieView
                source={loadingJason}
                style={{ width: size, height: size }}
                autoPlay
                loop
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.black,
    },
});

export default SplashScreen;
