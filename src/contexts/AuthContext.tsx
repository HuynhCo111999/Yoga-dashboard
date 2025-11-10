'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, FirebaseUser, UserRole, UserData, AuthResult, ErrorResult } from '@/lib/firebase';
import { logger } from '@/lib/logger';

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
    logger.debug('Setting up auth state listener');
    
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        logger.debug('Auth state changed - user detected', { uid: firebaseUser.uid });
        
        // Refresh token to fix "Unknown SID" issue
        try {
          await firebaseUser.getIdToken(true); // Force refresh
          logger.debug('Token refreshed successfully', { uid: firebaseUser.uid });
        } catch (tokenError) {
          logger.error('Token refresh failed', tokenError as Error, { uid: firebaseUser.uid });
          // If token refresh fails, sign out and reload
          await authService.signOut();
          window.location.reload();
          return;
        }
        
        // Get user data from Firestore
        const { data, error } = await authService.getUserData(firebaseUser.uid);
        if (data) {
          logger.info('User authenticated successfully', { 
            uid: firebaseUser.uid, 
            email: firebaseUser.email,
            role: data.role 
          });
          
          const userWithData: FirebaseUser = {
            ...firebaseUser,
            role: data.role,
            name: data.name,
            userData: data
          };
          setUser(userWithData);
          setUserData(data);
          
          // Set user context in logger
          logger.setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            name: data.name
          });
          logger.setTag('role', data.role);
          
          // Store admin session for preservation
          if (data.role === 'admin') {
            setAdminSession(userWithData);
            logger.debug('Admin session stored');
          }
        } else {
          logger.warning('User data not found in Firestore', { 
            uid: firebaseUser.uid,
            error 
          });
          
          // Check if this is a newly created user (member) without role data yet
          if (firebaseUser && firebaseUser.email) {
            // If we have an admin session and this is a different user (new member), keep admin session
            if (adminSession && adminSession.uid !== firebaseUser.uid) {
              logger.info('Restoring admin session after member creation', { 
                adminUid: adminSession.uid,
                newMemberUid: firebaseUser.uid 
              });
              // This is a new member being created, restore admin session
              setUser(adminSession);
              setUserData(adminSession.userData || null);
              return;
            }
          }
          // Don't set user without role data to prevent login loops
          logger.warning('Signing out user without role data');
          setUser(null);
          setUserData(null);
          setAdminSession(null);
          logger.clearUser();
          // Sign out if user data is missing
          await authService.signOut();
        }
      } else {
        logger.debug('Auth state changed - no user');
        setUser(null);
        setUserData(null);
        setAdminSession(null);
        logger.clearUser();
      }
      setLoading(false);
    });

    return () => {
      logger.debug('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    logger.info('Sign in attempt', { email });
    setLoading(true);
    const result = await authService.signIn(email, password);
    setLoading(false);
    
    if (result.error) {
      logger.warning('Sign in failed', { email, error: result.error });
    } else {
      logger.event('User Signed In', { email });
    }
    
    return result;
  };

  const signUp = async (email: string, password: string, userData: Partial<UserData>) => {
    logger.info('Sign up attempt', { email, role: userData.role });
    setLoading(true);
    const result = await authService.signUp(email, password, userData);
    setLoading(false);
    
    if (result.error) {
      logger.warning('Sign up failed', { email, error: result.error });
    } else {
      logger.event('User Signed Up', { email, role: userData.role });
    }
    
    return result;
  };

  const signOut = async () => {
    const currentUser = user?.email;
    logger.info('Sign out attempt', { email: currentUser });
    setLoading(true);
    const result = await authService.signOut();
    setLoading(false);
    
    if (!result.error) {
      logger.event('User Signed Out', { email: currentUser });
      logger.clearUser();
    }
    
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
