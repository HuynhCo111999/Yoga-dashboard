# 🔥 Firestore Security Rules Fix

## ❌ Current Error:
```
members API Error: FirebaseError: Missing or insufficient permissions.
Failed to create member document: Missing or insufficient permissions
```

## ✅ Solution: Update Firestore Security Rules

### Step 1: Go to Firebase Console
1. **Open**: https://console.firebase.google.com/
2. **Select Project**: `yen-yoga-dashboard`
3. **Navigate**: Firestore Database → Rules

### Step 2: Replace Current Rules
**Replace the entire rules section with:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write all documents
    // This is for development - restrict in production
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Specific rules for users collection (role management)
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Specific rules for members collection (member data)
    match /members/{memberId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 3: Publish Rules
1. **Click**: "Publish" button
2. **Wait**: For rules to propagate (1-2 minutes)

### Step 4: Test
1. **Refresh**: Your application
2. **Try**: Creating a member again
3. **Check**: Console for success messages

## 🔒 Production Security Rules (Optional)

For production, use more restrictive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users can read/write everything
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Members can read their own data
    match /members/{memberId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == memberId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Public read access for classes and sessions
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /sessions/{sessionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🚨 Important Notes

1. **Development Rules**: The first rule set allows all authenticated users to read/write
2. **Security**: This is for development only - use production rules for live apps
3. **Propagation**: Rules take 1-2 minutes to propagate globally
4. **Testing**: Always test after changing rules

## 🔍 Troubleshooting

### If still getting permission errors:
1. **Check**: User is authenticated (console should show user email)
2. **Verify**: Rules are published (check timestamp in Firebase Console)
3. **Wait**: 2-3 minutes for rules to propagate
4. **Refresh**: Browser and try again

### If "Unknown SID" error persists:
1. **Clear**: Browser cache and cookies
2. **Sign out**: And sign in again
3. **Check**: Network connection
4. **Restart**: Development server
