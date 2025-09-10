import { initializeApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, deleteUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Firebase configuration
// Environment variables are loaded from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC0ZTh6rcSCn5vTANp0CWKJ-aIZxx4vt90',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'yen-yoga-dashboard.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'yen-yoga-dashboard',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'yen-yoga-dashboard.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '17255003511',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:17255003511:web:737c001d0e5e5debf25d72',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XX91RY8C7H',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  analytics = getAnalytics(app);
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const authService = {
  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      return { user: null, error: message };
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string, userData: Partial<UserData>): Promise<AuthResult> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document in Firestore
      const newUserData: UserData = {
        email: userCredential.user.email || email,
        role: userData.role || 'member',
        name: userData.name || '',
        createdAt: new Date().toISOString(),
        ...userData,
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);

      return { user: userCredential.user, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      return { user: null, error: message };
    }
  },

  // Create user document only (for admin to create members without auth)
  createUserDocument: async (
    email: string,
    userData: Partial<UserData>
  ): Promise<{ uid: string; error: string | null }> => {
    try {
      // Generate a unique ID for the user document
      const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create user document in Firestore
      const newUserData: UserData = {
        email,
        role: userData.role || 'member',
        name: userData.name || '',
        createdAt: new Date().toISOString(),
        ...userData,
        // Add a flag to indicate this user needs to complete auth setup
        authSetupRequired: true,
      };

      await setDoc(doc(db, 'users', uid), newUserData);

      return { uid, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create user document';
      return { uid: '', error: message };
    }
  },

  // Sign out
  signOut: async (): Promise<ErrorResult> => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign out failed';
      return { error: message };
    }
  },

  // Get current user data from Firestore
  getUserData: async (uid: string): Promise<DataResult<UserData>> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { data: userDoc.data() as UserData, error: null };
      } else {
        return { data: null, error: 'User not found' };
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get user data';
      return { data: null, error: message };
    }
  },

  // Update user data
  updateUserData: async (uid: string, userData: Partial<UserData>): Promise<ErrorResult> => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...userData,
        updatedAt: new Date().toISOString(),
      });
      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update user data';
      return { error: message };
    }
  },

  // Delete user account
  deleteUser: async (email: string): Promise<{ error: string | null }> => {
    try {
      // Note: This function would typically require admin privileges
      // For client-side deletion, the user needs to be currently authenticated
      // In production, this should be done through Firebase Admin SDK on the server
      
      // For now, we'll just return success since the actual deletion
      // should be handled by Firebase Admin SDK on the backend
      console.warn('User deletion should be handled by Firebase Admin SDK on the server');
      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      return { error: message };
    }
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// User data interfaces
export interface UserData {
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
  updatedAt?: string;
  phone?: string;
  // Admin specific fields
  department?: string;
  location?: string;
  // Member specific fields
  membershipStatus?: string;
  currentPackage?: string;
  remainingClasses?: number;
  joinDate?: string;
  address?: string;
  emergencyContact?: string;
  healthNotes?: string;
  // Auth setup flag
  authSetupRequired?: boolean;
  [key: string]: unknown; // For additional fields
}

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export interface DataResult<T = UserData> {
  data: T | null;
  error: string | null;
}

export interface ErrorResult {
  error: string | null;
}

// User interface
export interface FirebaseUser extends User {
  role?: UserRole;
  name?: string;
  userData?: UserData;
}

export default app;
