import { useState } from 'react';
import { authService } from '@/lib/firebase';
import { usersApi } from '@/lib/api';

interface AuthSetupProps {
  userEmail: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AuthSetup({ userEmail, onSuccess, onCancel }: AuthSetupProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get existing user document to get user data
      const userResult = await usersApi.getUserByEmail(userEmail);
      if (!userResult.success || !userResult.data) {
        setError('Không tìm thấy thông tin người dùng');
        return;
      }

      // Create Firebase Auth user
      const authResult = await authService.signUp(userEmail, password, {
        name: userResult.data.name,
        role: userResult.data.role,
        phone: userResult.data.phone,
      });

      if (!authResult.user || authResult.error) {
        setError(authResult.error || 'Không thể tạo tài khoản xác thực');
        return;
      }

      // Update user document to remove authSetupRequired flag and update with Firebase Auth UID
      await usersApi.updateUser(authResult.user.uid, {
        authSetupRequired: false,
      });

      // Delete the old user document (with the generated ID)
      await usersApi.deleteUser(userResult.data.id);

      onSuccess?.();
    } catch (err) {
      console.error('Auth setup error:', err);
      setError('Có lỗi xảy ra khi thiết lập tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Thiết lập tài khoản
      </h2>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          Tài khoản của bạn đã được tạo bởi admin. Vui lòng thiết lập mật khẩu để có thể đăng nhập.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={userEmail}
            disabled
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu *
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Nhập lại mật khẩu"
          />
        </div>

        <div className="flex space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Đang thiết lập...' : 'Thiết lập tài khoản'}
          </button>
        </div>
      </form>
    </div>
  );
}
