import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Função para carregar o token do AsyncStorage ao iniciar o app
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          await fetchUserData(storedToken); // Se existir um token, busca os dados do usuário
        }
      } catch (error) {
        console.error('Erro ao carregar o token:', error);
      }
    };
    loadToken();
  }, []);

  // Função de login que salva o token no AsyncStorage e os dados do usuário no estado
  const login = async (userData, authToken) => {
    try {
      await AsyncStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);

      // Buscar dados adicionais do usuário
      await fetchUserData(authToken);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  };

  // Função de registro que salva o token e dados do usuário
  const register = async (userData, authToken) => {
    try {
      await AsyncStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  };

  // Função para buscar dados do usuário com o token armazenado
  const fetchUserData = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        console.error('Erro ao buscar dados do usuário:', data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  // Função de logout que limpa o token e os dados do usuário
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para acessar o contexto
export const useUser = () => useContext(UserContext);
