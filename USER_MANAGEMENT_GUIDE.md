# User Management System - Firebase Auth Integration

## Tổng quan

Hệ thống quản lý người dùng đã được cập nhật để tích hợp Firebase Authentication với cơ sở dữ liệu Firestore, giải quyết vấn đề quản lý cả role và thông tin chi tiết của members.

## Cấu trúc Database

### Collections

1. **users**: Quản lý thông tin xác thực và role
   - Lưu trữ thông tin cơ bản của tất cả users (admin + members)
   - Quản lý role (admin/member)
   - Document ID trùng với Firebase Auth UID

2. **members**: Quản lý thông tin chi tiết của members
   - Lưu trữ thông tin chi tiết về thành viên (gói tập, lịch sử, v.v.)
   - Document ID trùng với users collection

## Quy trình tạo Member mới

### Cho Admin:

1. **Tạo Member**: 
   - Admin điền form tạo member mới (không cần password)
   - Hệ thống tự động tạo:
     - Document trong `users` collection với `authSetupRequired: true`
     - Document trong `members` collection với thông tin chi tiết
   - Member được tạo mà không ảnh hưởng đến session của admin

2. **Thông báo cho Member**:
   - Admin thông báo cho member về tài khoản mới
   - Cung cấp link setup: `/setup-auth?email=member@example.com`

### Cho Member:

1. **Setup Authentication**:
   - Member truy cập link setup được admin cung cấp
   - Tạo mật khẩu cho tài khoản
   - Hệ thống tạo Firebase Auth user và cập nhật documents

2. **Đăng nhập**:
   - Member có thể đăng nhập bình thường sau khi setup

## API Methods

### UsersApi
- `createUser(userData)`: Tạo user với Firebase Auth (dành cho sign up thông thường)
- `getUserByEmail(email)`: Tìm user theo email
- `updateUser(id, userData)`: Cập nhật thông tin user
- `getUsersByRole(role)`: Lấy danh sách user theo role

### MembersApi  
- `createMember(memberData)`: Tạo member mới (không cần password)
- `updateMember(id, memberData)`: Cập nhật thông tin member
- `getAllMembers(filters)`: Lấy danh sách members với filters

### AuthService
- `signUp(email, password, userData)`: Đăng ký với Firebase Auth
- `createUserDocument(email, userData)`: Tạo user document mà không tạo Firebase Auth
- `signIn(email, password)`: Đăng nhập
- `signOut()`: Đăng xuất

## Components

### AuthSetup
Component cho phép member setup authentication sau khi được admin tạo tài khoản.

**Props:**
- `userEmail`: Email của user cần setup
- `onSuccess`: Callback khi setup thành công  
- `onCancel`: Callback khi hủy setup

## Security Notes

1. **Admin Session Protection**: Admin không bị logout khi tạo member mới
2. **Two-stage Authentication**: Member được tạo trước, setup auth sau
3. **Role Management**: Users và Members được quản lý riêng biệt nhưng liên kết với nhau

## Migration từ hệ thống cũ

Nếu có members đã tồn tại trong hệ thống cũ:

1. Tạo corresponding documents trong `users` collection
2. Set `authSetupRequired: true` cho các users này
3. Thông báo cho members setup authentication

## Sử dụng trong Development

```typescript
// Tạo member mới (Admin)
const result = await membersApi.createMember({
  email: 'member@example.com',
  name: 'Tên Member',
  phone: '0123456789',
  packageId: 'package-id' // optional
});

// Setup authentication (Member)
// Redirect to: /setup-auth?email=member@example.com

// Đăng nhập (Member sau khi setup)
const authResult = await authService.signIn('member@example.com', 'password');
```

## Lưu ý quan trọng

1. Member mới tạo sẽ có `authSetupRequired: true` trong users collection
2. Sau khi setup auth thành công, flag này sẽ được set thành `false`
3. Document ID trong cả 2 collections (users và members) sẽ giống nhau sau khi setup
4. Admin cần cung cấp link setup cho member sau khi tạo tài khoản
