# Sentry Setup Guide

Dự án đã được cấu hình với Sentry để monitor lỗi và performance. Để hoàn tất setup:

## 1. Tạo Sentry Account & Project

1. Truy cập https://sentry.io/ và đăng ký (hoặc đăng nhập)
2. Tạo project mới, chọn **Next.js** platform
3. Copy **DSN** từ project settings

## 2. Cấu hình Environment Variables

Thêm các biến sau vào file `.env.local` (tạo file nếu chưa có):

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id

# Sentry Build Configuration (optional - for uploading source maps)
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token
```

### Lấy thông tin:
- **NEXT_PUBLIC_SENTRY_DSN**: Settings → Projects → [Your Project] → Client Keys (DSN)
- **SENTRY_ORG**: Organization Settings → General Settings → Organization Slug
- **SENTRY_PROJECT**: Settings → Projects → [Your Project] → General Settings → Name
- **SENTRY_AUTH_TOKEN**: Settings → Account → API → Auth Tokens → Create New Token
  - Scopes cần: `project:read`, `project:releases`, `org:read`

## 3. Test Sentry Integration

Tạo file test để trigger error:

```tsx
// src/app/sentry-example-page/page.tsx
'use client';

export default function SentryExamplePage() {
  return (
    <div>
      <button
        onClick={() => {
          throw new Error('Sentry Test Error - Client Side!');
        }}
      >
        Throw Client Error
      </button>
      
      <button
        onClick={async () => {
          const res = await fetch('/api/sentry-example-api');
          await res.json();
        }}
      >
        Throw Server Error
      </button>
    </div>
  );
}
```

```tsx
// src/app/api/sentry-example-api/route.ts
export async function GET() {
  throw new Error('Sentry Test Error - Server Side!');
}
```

Truy cập `/sentry-example-page` và click các button để test. Lỗi sẽ xuất hiện trong Sentry dashboard.

## 4. Features đã được cấu hình

### Client-side monitoring
- ✅ Error tracking
- ✅ Performance monitoring
- ✅ Session Replay (ghi lại hành vi user khi có lỗi)
- ✅ Filter browser extension errors

### Server-side monitoring
- ✅ API route errors
- ✅ Server component errors
- ✅ Performance monitoring

### Edge runtime monitoring
- ✅ Edge function errors
- ✅ Middleware errors

## 5. Sử dụng Sentry trong code

### Capture manual errors:
```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // your code
} catch (error) {
  Sentry.captureException(error);
}
```

### Add context:
```typescript
Sentry.setUser({ id: user.id, email: user.email });
Sentry.setContext('custom', { key: 'value' });
```

### Add breadcrumbs:
```typescript
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info',
});
```

## 6. Production Deployment

Khi deploy production:

1. Set `NEXT_PUBLIC_SENTRY_DSN` trong hosting environment variables (Vercel, etc.)
2. Để upload source maps, set thêm:
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `SENTRY_AUTH_TOKEN`

3. Giảm sample rate trong production để tiết kiệm quota:

```typescript
// sentry.client.config.ts
tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
```

## 7. Dashboard & Alerts

Trong Sentry dashboard bạn có thể:
- Xem danh sách lỗi theo frequency, user impact
- Replay session để xem user đã làm gì trước khi lỗi xảy ra
- Set up alerts qua email/Slack khi có lỗi mới
- Tích hợp với GitHub để tự động tạo issue
- Xem performance metrics (API response time, page load, etc.)

## 8. Files đã được tạo

- ✅ `sentry.client.config.ts` - Client-side config
- ✅ `sentry.server.config.ts` - Server-side config
- ✅ `sentry.edge.config.ts` - Edge runtime config
- ✅ `next.config.ts` - Updated with Sentry webpack plugin

## Lưu ý

- **Development**: Sentry vẫn hoạt động nhưng không upload source maps
- **Production**: Full monitoring + source maps upload
- **Privacy**: Session replay đã được config để mask sensitive data (`maskAllText: true`)
- **Performance**: `tracesSampleRate: 1.0` = track 100% requests (có thể giảm trong production)

---

Để biết thêm chi tiết, xem docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/

