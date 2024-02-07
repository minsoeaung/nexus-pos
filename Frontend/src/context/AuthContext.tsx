import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import { AppUser } from '../types/AppUser.ts';
import { createContext, ReactNode, useContext } from 'react';
import { ApiClient } from '../api/apiClient.ts';
import { LoginResponse } from '../types/LoginResponse.ts';

interface IAuthContext {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  setUser: () => {
  },
  login: async () => {
  },
  logout: async () => {
  },
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<AppUser | null>('currentUser', null);

  const login = async (userName: string, password: string) => {
    // IdentityEndpoints has "email" field, but it is actually a username.
    const data = await ApiClient.post<never, LoginResponse>('api/accounts/login', { email: userName, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, logout, login }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};