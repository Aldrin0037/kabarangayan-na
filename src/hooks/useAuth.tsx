
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { storage } from '@/utils/helpers';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
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
        // Check if there's an active session with Supabase
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          // Session exists, get user data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();

          if (userError) {
            throw new Error(userError.message);
          }

          // Map to User type
          const userProfile: User = {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email || '',
            firstName: userData.first_name,
            lastName: userData.last_name,
            middleName: userData.middle_name,
            contactNumber: userData.contact_number,
            address: userData.address,
            role: userData.role as UserRole,
            isActive: userData.is_active,
            createdAt: new Date(sessionData.session.user.created_at || ''),
            updatedAt: new Date(userData.updated_at || '')
          };

          storage.set('user', userProfile);
          storage.set('token', sessionData.session.access_token);
          setUser(userProfile);
        } else {
          // No active session
          storage.remove('user');
          storage.remove('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        storage.remove('user');
        storage.remove('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error || !data.user) {
        throw new Error(error?.message || 'Invalid credentials');
      }

      // Fetch user profile data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        throw new Error(userError.message || 'Failed to fetch user profile');
      }

      // Map Supabase user to local User type
      const userProfile: User = {
        id: data.user.id,
        email: data.user.email || '',
        firstName: userData.first_name,
        lastName: userData.last_name,
        middleName: userData.middle_name,
        contactNumber: userData.contact_number,
        address: userData.address,
        role: userData.role as UserRole,
        isActive: userData.is_active,
        createdAt: new Date(data.user.created_at || ''),
        updatedAt: new Date(userData.updated_at || '')
      };

      storage.set('user', userProfile);
      storage.set('token', data.session?.access_token || '');
      setUser(userProfile);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            middle_name: userData.middleName || '',
            role: 'resident'
          }
        }
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Registration failed');
      }

      // Insert additional user data into the users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            middle_name: userData.middleName || '',
            contact_number: userData.contactNumber,
            address: userData.address,
            role: 'resident',
            is_active: true
          }
        ]);

      if (profileError) {
        throw new Error(profileError.message || 'Failed to create user profile');
      }

      // Map Supabase user to local User type
      const userProfile: User = {
        id: authData.user.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        middleName: userData.middleName,
        contactNumber: userData.contactNumber,
        address: userData.address,
        role: 'resident' as UserRole,
        isActive: true,
        createdAt: new Date(authData.user.created_at || ''),
        updatedAt: new Date()
      };
      
      storage.set('user', userProfile);
      storage.set('token', authData.session?.access_token || '');
      setUser(userProfile);
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      storage.remove('user');
      storage.remove('token');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      try {
        // Update user data in Supabase
        const { error } = await supabase
          .from('users')
          .update({
            first_name: userData.firstName || user.firstName,
            last_name: userData.lastName || user.lastName,
            middle_name: userData.middleName || user.middleName,
            contact_number: userData.contactNumber || user.contactNumber,
            address: userData.address || user.address,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) {
          throw new Error(error.message);
        }

        // Update local user state
        const updatedUser = { ...user, ...userData, updatedAt: new Date() };
        setUser(updatedUser);
        storage.set('user', updatedUser);
      } catch (error) {
        console.error('Update user failed:', error);
        throw new Error('Failed to update user profile');
      }
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