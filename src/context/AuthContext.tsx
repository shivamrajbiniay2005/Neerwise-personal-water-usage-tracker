import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/water';
import { INITIAL_USER } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    householdSize: number;
    targetAllowance: number;
    residenceType?: 'apt' | 'single' | 'eco';
  }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogleDemo: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'neerwise_auth_user';
const STORAGE_KEY_REMEMBER = 'neerwise_remember_me';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode] = useState(true);

  // Initialize auth state
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore parsing error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string, remember: boolean): Promise<{ success: boolean; error?: string }> => {
    // Validate inputs
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!pass || pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Simulated network authentication delay for realism
    await new Promise((r) => setTimeout(r, 600));

    // Support default demo accounts or any credentials in demo mode
    let loggedUser: User;
    if (email.toLowerCase().includes('vance') || email.toLowerCase().includes('operator') || email === 's.vance@hydro-grid.org') {
      loggedUser = { ...INITIAL_USER, email };
    } else {
      loggedUser = {
        ...INITIAL_USER,
        id: `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/^./, (c) => c.toUpperCase()),
      };
    }

    setUser(loggedUser);
    if (remember) {
      localStorage.setItem(STORAGE_KEY_REMEMBER, 'true');
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(loggedUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_REMEMBER);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(loggedUser));
    }

    return { success: true };
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
    householdSize: number;
    targetAllowance: number;
    residenceType?: 'apt' | 'single' | 'eco';
  }): Promise<{ success: boolean; error?: string }> => {
    if (!userData.name.trim()) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!userData.email || !userData.email.includes('@')) {
      return { success: false, error: 'Valid email address is required.' };
    }
    if (userData.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    await new Promise((r) => setTimeout(r, 600));

    const newUser: User = {
      ...INITIAL_USER,
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      householdSize: userData.householdSize || 3,
      occupancyDescription: `${userData.householdSize || 3} People (Registered Pod)`,
      targetLitersPerDay: userData.targetAllowance || 135,
      residenceType: userData.residenceType || 'single',
      residenceTypeName: userData.residenceType === 'eco' ? 'Certified Eco-Dwelling' : userData.residenceType === 'apt' ? 'Urban Apartment' : 'Single Family Residence',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      streakDays: 1,
      totalSparedVolumeLiters: 0,
      badgesUnlockedCount: 1,
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    return { success: true };
  };

  const loginWithGoogleDemo = async (): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 500));
    const demoGoogleUser: User = {
      ...INITIAL_USER,
      id: 'user_google_samantha',
      name: 'Dr. Samantha Vance',
      email: 's.vance@hydro-grid.org',
    };
    setUser(demoGoogleUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(demoGoogleUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((r) => setTimeout(r, 500));
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    return {
      success: true,
      message: `Recovery cryptographic token dispatched to ${email}. Check your inbox for node re-authorization instructions.`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogleDemo,
        logout,
        updateUser,
        requestPasswordReset,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
