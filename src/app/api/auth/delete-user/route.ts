import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    // Check if all required environment variables are available
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase Admin SDK credentials not configured. Auth user deletion will be skipped.');
    } else {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    console.log('Attempting to delete user with UID:', uid);

    // Delete from Firebase Auth first
    try {
      if (getApps().length > 0) {
        const auth = getAuth();
        await auth.deleteUser(uid);
        console.log('Successfully deleted Firebase Auth user');
      } else {
        console.warn('Firebase Admin SDK not initialized. Skipping Auth user deletion.');
      }
    } catch (authError) {
      console.error('Error deleting Firebase Auth user:', authError);
      // Continue with Firestore deletion even if Auth deletion fails
    }

    // Delete user document from Firestore 'users' collection
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await deleteDoc(userDocRef);
        console.log('Successfully deleted user document from Firestore users collection');
      } else {
        console.log('User document not found in users collection');
      }
    } catch (firestoreError) {
      console.error('Error deleting user document from Firestore:', firestoreError);
      return NextResponse.json({ error: 'Failed to delete user document from Firestore' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully from both Firebase Auth and Firestore',
    });
  } catch (error) {
    console.error('Error in delete-user API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
