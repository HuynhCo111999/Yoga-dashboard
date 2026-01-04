# Deployment Guide - Vercel với GitHub Actions

Hướng dẫn thiết lập CI/CD pipeline để tự động deploy lên Vercel thông qua GitHub Actions.

## 📋 Yêu cầu

1. Tài khoản Vercel
2. Repository GitHub
3. Vercel project đã được tạo

## 🔧 Thiết lập

### Bước 1: Lấy Vercel Token và Project IDs

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Vào **Settings** → **Tokens** → Tạo token mới
3. Copy token (sẽ dùng làm `VERCEL_TOKEN`)
4. Vào project của bạn → **Settings** → **General**
5. Copy **Project ID** (sẽ dùng làm `VERCEL_PROJECT_ID`)
6. Copy **Team ID** hoặc **User ID** (sẽ dùng làm `VERCEL_ORG_ID`)

### Bước 2: Thêm Secrets vào GitHub

1. Vào repository GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Thêm các secrets sau:

   - `VERCEL_TOKEN`: Token từ Vercel
   - `VERCEL_ORG_ID`: Organization/User ID từ Vercel
   - `VERCEL_PROJECT_ID`: Project ID từ Vercel

### Bước 3: Cấu hình Environment Variables trên Vercel

Đảm bảo tất cả environment variables cần thiết đã được cấu hình trên Vercel:

1. Vào project trên Vercel → **Settings** → **Environment Variables**
2. Thêm các biến môi trường:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `SENTRY_DSN`
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - Và các biến khác cần thiết cho project

### Bước 4: Cấu hình Vercel Project

Nếu chưa có project trên Vercel:

1. Cài đặt Vercel CLI: `npm i -g vercel`
2. Chạy `vercel` trong thư mục project
3. Làm theo hướng dẫn để link project
4. Lấy các IDs cần thiết từ `.vercel/project.json` hoặc Vercel dashboard

## 🚀 Workflow Files

### `deploy.yml`
- Deploy tự động khi push vào `main` hoặc `master`
- Tạo preview deployment cho pull requests
- Chạy build và test trước khi deploy

### `ci.yml`
- Chạy linter và build trên mọi push/PR
- Đảm bảo code quality trước khi merge

## 📝 Cách sử dụng

### Deploy Production
1. Push code vào branch `main` hoặc `master`
2. GitHub Actions sẽ tự động:
   - Chạy linter
   - Build project
   - Deploy lên Vercel production

### Preview Deployment
1. Tạo pull request vào `main` hoặc `master`
2. GitHub Actions sẽ tự động tạo preview deployment
3. Link preview sẽ xuất hiện trong PR comments

## 🔍 Troubleshooting

### Lỗi: "VERCEL_TOKEN not found"
- Kiểm tra đã thêm secret `VERCEL_TOKEN` vào GitHub Secrets
- Đảm bảo secret được đặt tên chính xác

### Lỗi: "Project not found"
- Kiểm tra `VERCEL_PROJECT_ID` và `VERCEL_ORG_ID` đã đúng
- Đảm bảo token có quyền truy cập project

### Build fails
- Kiểm tra environment variables trên Vercel đã đầy đủ
- Xem logs trong GitHub Actions để biết lỗi cụ thể

### Deploy nhưng không có thay đổi
- Kiểm tra Vercel project đã được link đúng
- Đảm bảo `vercel pull` chạy thành công

## 📚 Tài liệu tham khảo

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

