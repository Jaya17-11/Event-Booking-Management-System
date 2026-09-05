import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    const userData = { name: data.name, email: data.email, role: data.role };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return data;
  };

  const register = async (userData) => {
    const { data } = await API.post('/users/register', userData);
    return data;
  };

const logout = async () => {
  try {
    const token = localStorage.getItem('token');

    if (token) {
      await API.post(
        '/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    }
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }
};

  const isAdmin = () => user?.role === 'ADMIN';
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
