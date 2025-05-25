import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

// Create the Auth Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => {},
  updateUserProfile: () => Promise.resolve(),
  verifyKyc: () => Promise.resolve(),
});

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate checking for user session on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // In a real app, this would verify token with backend
        const savedUser = localStorage.getItem('loan_app_user');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to restore user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in a real app this would come from backend
      const userData: User = {
        id: '12345',
        name: 'John Doe',
        email,
        phone: '+254712345678',
        kycVerified: false,
        role: email.includes('admin') ? 'admin' : 'user',
        creditScore: 650,
        createdAt: new Date().toISOString(),
      };
      
      setUser(userData);
      localStorage.setItem('loan_app_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: Partial<User>): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user creation - in a real app this would be done by backend
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        kycVerified: false,
        role: 'user',
        creditScore: 0, // Initial credit score
        createdAt: new Date().toISOString(),
      };
      
      setUser(newUser);
      localStorage.setItem('loan_app_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('loan_app_user');
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return Promise.reject('No user logged in');
    
    setLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('loan_app_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Profile update failed:', error);
      throw new Error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // KYC verification
  const verifyKyc = async (kycData: any): Promise<void> => {
    if (!user) return Promise.reject('No user logged in');
    
    setLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would send KYC data to backend for verification
      const verifiedUser = { ...user, kycVerified: true };
      setUser(verifiedUser);
      localStorage.setItem('loan_app_user', JSON.stringify(verifiedUser));
    } catch (error) {
      console.error('KYC verification failed:', error);
      throw new Error('KYC verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      updateUserProfile,
      verifyKyc
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using Auth context
export const useAuth = () => useContext(AuthContext);