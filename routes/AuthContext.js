import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null); // Added state for userEmail

  // Updated signIn to accept both token and email
  const signIn = (token, email) => {
    setUserToken(token);
    setUserEmail(email); // Now also setting userEmail
  };

  // Updated signOut to also clear userEmail
  const signOut = () => {
    setUserToken(null);
    setUserEmail(null); // Clearing userEmail on sign out
  };

  return (
    <AuthContext.Provider value={{ userToken, userEmail, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
