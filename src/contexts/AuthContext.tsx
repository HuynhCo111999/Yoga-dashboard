'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, FirebaseUser, UserRole, UserData, AuthResult, ErrorResult } from '@/lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, userData: Partial<UserData>) => Promise<AuthResult>;
  signOut: () => Promise<ErrorResult>;
  updateProfile: (userData: Partial<UserData>) => Promise<ErrorResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminSession, setAdminSession] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Refresh token to fix "Unknown SID" issue
        try {
          await firebaseUser.getIdToken(true); // Force refresh
        } catch (tokenError) {
          // If token refresh fails, sign out and reload
          await authService.signOut();
          window.location.reload();
          return;
        }
        
        // Get user data from Firestore
        const { data, error } = await authService.getUserData(firebaseUser.uid);
        if (data) {
          const userWithData: FirebaseUser = {
            ...firebaseUser,
            role: data.role,
            name: data.name,
            userData: data
          };
          setUser(userWithData);
          setUserData(data);
          
          // Store admin session for preservation
          if (data.role === 'admin') {
            setAdminSession(userWithData);
          }
        } else {
          // Check if this is a newly created user (member) without role data yet
          if (firebaseUser && firebaseUser.email) {
            // If we have an admin session and this is a different user (new member), keep admin session
            if (adminSession && adminSession.uid !== firebaseUser.uid) {
              // This is a new member being created, restore admin session
              setUser(adminSession);
              setUserData(adminSession.userData || null);
              return;
            }
          }
          // Don't set user without role data to prevent login loops
          setUser(null);
          setUserData(null);
          setAdminSession(null);
          // Sign out if user data is missing
          await authService.signOut();
        }
      } else {
        setUser(null);
        setUserData(null);
        setAdminSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [adminSession]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await authService.signIn(email, password);
    setLoading(false);
    return result;
  };

  const signUp = async (email: string, password: string, userData: Partial<UserData>) => {
    setLoading(true);
    const result = await authService.signUp(email, password, userData);
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    const result = await authService.signOut();
    setLoading(false);
    return result;
  };

  const updateProfile = async (newUserData: Partial<UserData>) => {
    if (!user) return { error: 'No user logged in' };
    
    const result = await authService.updateUserData(user.uid, newUserData);
    if (!result.error && userData) {
      // Update local state
      const updatedUserData = { ...userData, ...newUserData };
      setUserData(updatedUserData);
      setUser({ ...user, userData: updatedUserData });
    }
    return result;
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook để check user role
export function useRequireAuth(requiredRole?: UserRole) {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
    
    if (!loading && user && requiredRole && user.role !== requiredRole) {
      // Redirect if user doesn't have required role
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/member';
      }
    }
  }, [user, loading, requiredRole]);

  return { user, loading };
}
