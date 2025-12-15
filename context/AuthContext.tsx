
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User, UserRole } from '../types';
import { UserService } from '../services/api';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  // Dev only
  switchRoleMock: (role: UserRole) => Promise<void>; 
  loginMock: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth) {
        // Real Firebase Auth
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const profile = await UserService.getUserProfile(firebaseUser.uid);
                if (profile) {
                    setUser(profile);
                } else {
                    // New user or no profile doc yet
                    setUser({
                        id: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        name: firebaseUser.displayName || 'User',
                        role: 'member' // Default
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    } else {
        // Mock Auth Fallback: Check local storage or wait for manual login
        setLoading(false);
    }
  }, []);

  const logout = async () => {
    if (auth) {
        await firebaseSignOut(auth);
    } else {
        setUser(null);
    }
  };

  const switchRoleMock = async (role: UserRole) => {
    setLoading(true);
    const updatedUser = await UserService.updateRoleMock(role);
    setUser(updatedUser);
    setLoading(false);
  };

  const loginMock = async (role: UserRole) => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const names: Record<string, string> = {
          'member': 'Bro. Alex Parishioner',
          'class_leader': 'Sis. Grace Leader',
          'rev_minister': 'Rev. John Shepherd',
          'society_steward': 'Mr. Kwame Steward',
          'admin': 'System Administrator'
      };

      const newUser: User = {
          id: 'mock_u1',
          name: names[role] || 'Mock User',
          email: `${role}@gmct.com`,
          role: role,
          classId: role === 'class_leader' ? 'c5' : role === 'member' ? 'c5' : undefined,
          className: (role === 'class_leader' || role === 'member') ? 'Class 5' : undefined,
          phoneNumber: '0240000000'
      };
      
      setUser(newUser);
      setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, switchRoleMock, loginMock }}>
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
