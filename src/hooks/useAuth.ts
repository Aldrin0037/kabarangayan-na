import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { storage } from '@/utils/helpers';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const storedUser = storage.get<User>('user');
        const token = storage.get<string>('token');
        
        if (storedUser && token) {
          // TODO: Validate token with backend
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        storage.remove('user');
        storage.remove('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Mock login for development
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        contactNumber: '09123456789',
        address: 'Sample Address, Las Piñas City',
        role: email.includes('admin') ? 'admin' : 'resident',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockToken = 'mock-jwt-token';
      
      storage.set('user', mockUser);
      storage.set('token', mockToken);
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        middleName: userData.middleName,
        contactNumber: userData.contactNumber,
        address: userData.address,
        role: 'resident',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockToken = 'mock-jwt-token';
      
      storage.set('user', newUser);
      storage.set('token', mockToken);
      setUser(newUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storage.remove('user');
    storage.remove('token');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData, updatedAt: new Date() };
      setUser(updatedUser);
      storage.set('user', updatedUser);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};