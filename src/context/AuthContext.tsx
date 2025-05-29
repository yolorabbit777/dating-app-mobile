import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User, AuthContextType, AuthResult, SignupData} from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async (): Promise<void> => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData) as User);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<AuthResult> => {
    try {
      // Mock login for demo - replace with actual API call
      if (email === 'john@example.com' && password === 'password123') {
        const mockUser: User = {
          id: 1,
          email: 'john@example.com',
          name: 'John Doe',
          age: 28,
          bio: 'Love hiking and coffee',
          profilePicture: 'https://via.placeholder.com/300x300?text=John',
        };
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return {success: true};
      }
      return {success: false, message: 'Invalid credentials'};
    } catch (error) {
      return {success: false, message: 'Login failed'};
    }
  };

  const signup = async (userData: SignupData): Promise<AuthResult> => {
    try {
      // Mock signup for demo - replace with actual API call
      const mockUser: User = {
        id: Date.now(),
        ...userData,
        profilePicture: `https://via.placeholder.com/300x300?text=${userData.name.charAt(
          0,
        )}`,
      };
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return {success: true};
    } catch (error) {
      return {success: false, message: 'Signup failed'};
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = async (updatedUser: User): Promise<void> => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
