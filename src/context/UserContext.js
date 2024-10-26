import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
          await fetchUserData(storedToken);
        } else {
          console.log('Nenhum token encontrado');
        }
      } catch (error) {
        console.log('Erro ao carregar o token:', error);
      }
    };
    loadToken();
  }, []);

  // Função para buscar dados do usuário com o token armazenado
  const fetchUserData = useCallback(async (authToken) => {
    if (!authToken) {
      console.log('Nenhum token encontrado, não é possível buscar dados do usuário.');
      return;
    }

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
        console.log('Erro ao buscar dados do usuário:', data.message || data.error);
      }
    } catch (error) {
      console.log('Erro ao buscar dados do usuário:', error);
    }
  }, []);

  // Função de login
  const login = useCallback(async (userData, authToken) => {
    try {
      await AsyncStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
      await fetchUserData(authToken);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }, [fetchUserData]);

  // Função de registro
  const register = useCallback(async (userData, authToken) => {
    try {
      await AsyncStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.log('Erro ao salvar token:', error);
    }
  }, []);

  // Função de logout
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, token, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para acessar o contexto
export const useUser = () => useContext(UserContext);
