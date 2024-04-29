import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import "core-js/stable/atob";


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null); 

  // Updated signIn to accept both token and email
  const signIn = (token, email) => {
    console.log(token);
    setUserToken(token);
    setUserEmail(email);
    AsyncStorage.setItem('token', token);
  };

  const signOut = () => {
    AsyncStorage.removeItem('token');
    setUserToken(null);
    setUserEmail(null);
  };

  const isLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const userEmail = jwtDecode(token).user_id;
        setUserToken(token);
        setUserEmail(userEmail);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, userEmail, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
