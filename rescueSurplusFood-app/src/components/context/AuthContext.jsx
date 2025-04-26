import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Tenta di leggere lo stato di autenticazione da localStorage all'avvio
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    return storedIsLoggedIn === 'true' || false;
  });

  useEffect(() => {
    // Aggiorna localStorage ogni volta che isLoggedIn cambia
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}