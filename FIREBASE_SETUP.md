# Firebase Setup Guide for Yên Yoga Dashboard

## 1. Tạo Firebase Project

1. Đi đến [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" hoặc "Tạo dự án"
3. Đặt tên project: `yen-yoga-dashboard`
4. Bật Google Analytics (tùy chọn)
5. Chọn location và tạo project

## 2. Setup Authentication

1. Trong Firebase Console, vào **Authentication** > **Get started**
2. Vào tab **Sign-in method**
3. Enable **Email/Password** provider
4. Click **Email/Password** > Enable > Save

## 3. Setup Firestore Database

1. Trong Firebase Console, vào **Firestore Database** > **Create database**
2. Chọn **Start in test mode** (sẽ cấu hình security rules sau)
3. Chọn location gần nhất (asia-southeast1 cho Việt Nam)

## 4. Setup Web App

1. Trong Firebase Console, click icon **Web** (</>) để add web app
2. Đặt tên app: `yen-yoga-web`
3. Check **Also set up Firebase Hosting** (tùy chọn)
4. Click **Register app**

## 5. Get Firebase Configuration

Sau khi register app, bạn sẽ thấy Firebase config object:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 6. Update Environment Variables

1. Tạo file `.env.local` trong root directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here
```

2. Thay thế các giá trị với Firebase config của bạn

## 7. Setup Demo Accounts

1. Restart development server: `npm run dev`
2. Đi đến: `http://localhost:3000/setup-demo`
3. Click "Tạo Demo Accounts" để tạo tài khoản test
4. Sử dụng accounts sau để login:
   - **Admin**: admin@yenyoga.com / admin123
   - **Member**: member@yenyoga.com / member123

## 8. Test Authentication

1. Đi đến trang login: `http://localhost:3000/login`
2. Thử login với demo accounts
3. Kiểm tra redirect đến đúng dashboard (admin/member)
4. Thử logout và kiểm tra redirect về login

## 9. Firestore Security Rules (Production)

Khi deploy production, cập nhật Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can read all users
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Other collections (members, packages, classes, sessions)
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 10. Cleanup

Sau khi setup xong:
1. Xóa hoặc comment out route `/setup-demo`
2. Remove file `src/app/setup-demo/page.tsx`
3. Remove file `src/lib/setupDemo.ts`

## Troubleshooting

### Lỗi thường gặp:

1. **"Firebase config not found"**
   - Kiểm tra .env.local có đúng format không
   - Restart development server

2. **"Auth domain mismatch"**
   - Kiểm tra FIREBASE_AUTH_DOMAIN trong .env.local
   - Đảm bảo domain match với Firebase Console

3. **"Permission denied"**
   - Kiểm tra Firestore rules
   - Đảm bảo Authentication đã được enable

4. **"Demo accounts creation failed"**
   - Kiểm tra Authentication provider đã enable chưa
   - Kiểm tra email/password requirements

## Next Steps

Sau khi setup Firebase Auth thành công:
1. Setup Firestore collections cho members, packages, classes, sessions
2. Implement CRUD operations cho admin features
3. Add real-time updates với Firestore listeners
4. Implement file upload với Firebase Storage (cho avatars, images)
5. Add push notifications với Firebase Cloud Messaging

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
