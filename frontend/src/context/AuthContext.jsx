import { createContext, useContext, useState, useEffect } from 'react';

const AUTH_KEY = 'smart-helper-auth';

const AuthContext = createContext(null);

function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setStoredAuth(data) {
  if (data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredAuth);

  useEffect(() => {
    setStoredAuth(user);
  }, [user]);

  const login = (email, role, token = 'mock-jwt-token') => {
    const auth = { email, role, token };
    setUser(auth);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    role: user?.role ?? null,
    token: user?.token ?? null,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
