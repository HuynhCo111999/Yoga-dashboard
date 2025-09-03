# 🧘‍♀️ Yên Yoga Dashboard

**Hệ thống quản lý studio yoga với Next.js 15, Firebase Authentication và Tailwind CSS**

## ✨ Features

### 🏠 **Public Pages**
- **Homepage** - Trang chủ với thông tin studio
- **About** - Giới thiệu về Yên Yoga
- **Contact** - Thông tin liên hệ và bản đồ
- **Blog** - Tin tức và bài viết yoga
- **Calendar** - Lịch tập công khai

### 🔐 **Authentication System**
- **Firebase Authentication** - Email/Password login
- **Role-based Access** - Admin và Member roles
- **Protected Routes** - Route guards cho private pages
- **Auto Redirect** - Redirect based on user role

### 👨‍💼 **Admin Dashboard**
- **Overview** - Thống kê tổng quan
- **Members Management** - Quản lý thành viên
- **Packages Management** - Quản lý gói tập
- **Classes Management** - Quản lý lớp học
- **Sessions Management** - Quản lý lịch tập
- **Profile Management** - Quản lý hồ sơ admin

### 👥 **Member Dashboard**
- **Personal Dashboard** - Thông tin cá nhân
- **Class Booking** - Đặt lịch tập
- **Schedule View** - Xem lịch tập
- **Profile Management** - Quản lý hồ sơ member

### 🎨 **UI/UX Features**
- **Responsive Design** - Mobile-first approach
- **Yên Yoga Branding** - Orange/brown theme colors
- **Glassmorphism Effects** - Modern UI với backdrop blur
- **PWA Support** - Progressive Web App
- **Dark/Light Theme** - Theme switching (ready)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Styling**: Tailwind CSS + Custom theme
- **Language**: TypeScript
- **PWA**: next-pwa
- **Icons**: Heroicons
- **Deployment**: Ready for Vercel/Netlify

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project with Authentication enabled

### Installation

```bash
# Clone project
git clone <repo-url>
cd yoga-dashboard

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your Firebase config

# Start development server
npm run dev
```

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project: `yen-yoga-dashboard`

2. **Enable Authentication**
   - Authentication > Sign-in method
   - Enable Email/Password provider

3. **Setup Firestore**
   - Firestore Database > Create database
   - Start in test mode

4. **Get Firebase Config**
   - Project Settings > General > Your apps
   - Copy config to `.env.local`

### Environment Variables

Create `.env.local` file:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 🔑 Demo Accounts

Create demo accounts using Firebase Auth:

**Admin Account:**
- Email: `admin@yenyoga.com`
- Password: `admin123`
- Role: `admin`

**Member Account:**
- Email: `member@yenyoga.com`
- Password: `member123`
- Role: `member`

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── (public)/          # Public routes
│   ├── (private)/         # Protected routes
│   ├── login/             # Authentication page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── Header.tsx        # Navigation header
│   └── Footer.tsx        # Site footer
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utilities
│   └── firebase.ts       # Firebase configuration
└── types/                # TypeScript types
```

## 🎨 Theme & Styling

### Color Palette
```css
/* Primary (Orange) */
--primary-50: #fff7ed;
--primary-500: #f97316;
--primary-600: #ea580c;

/* Secondary (Brown) */
--secondary-50: #fdf8f6;
--secondary-500: #92400e;
--secondary-600: #78350f;

/* Accent (Yellow-Orange) */
--accent-50: #fffbeb;
--accent-500: #f59e0b;
--accent-600: #d97706;
```

### Design System
- **Typography**: Geist Sans font family
- **Border Radius**: 8px, 12px, 16px scale
- **Shadows**: Subtle box-shadows with blur
- **Spacing**: Tailwind's 4px base unit
- **Glassmorphism**: backdrop-blur + semi-transparent backgrounds

## 🔒 Security

### Authentication
- Firebase Auth handles all authentication
- JWT tokens for session management
- Role-based access control

### Route Protection
- `AuthContext` provides global auth state
- `useAuth` hook for components
- Automatic redirects for unauthorized access

### Firestore Security
Production rules example:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 📱 PWA Features

- **Offline Support** - Service worker caching
- **Install Prompt** - Add to home screen
- **App Manifest** - Native app experience
- **Background Sync** - Sync data when online

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Environment Variables for Production
Add all `NEXT_PUBLIC_FIREBASE_*` variables to your hosting platform.

## 🔧 Development

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript checking
```

### Adding New Features
1. Create components in `src/components/`
2. Add pages in appropriate route groups
3. Update types in `src/types/`
4. Test authentication flows
5. Update this README

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: support@yenyoga.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

**Made with ❤️ for Yên Yoga Studio** 🧘‍♀️