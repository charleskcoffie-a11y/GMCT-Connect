import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { UserService } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UserService.getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const switchRole = async (role: UserRole) => {
    setLoading(true);
    const updatedUser = await UserService.updateRole(role);
    setUser(updatedUser);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
