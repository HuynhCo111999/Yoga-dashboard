'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { UserIcon, KeyIcon, BellIcon } from '@heroicons/react/24/outline';

const adminData = {
  name: 'Nguyễn Văn Admin',
  email: 'admin@yenyoga.com',
  phone: '0901234567',
  role: 'Quản trị viên',
  joinDate: '2023-01-01',
  avatar: 'A',
  department: 'Quản lý Studio',
  location: 'Hồ Chí Minh'
};

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(adminData);

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', name: 'Thông tin cá nhân', icon: UserIcon },
    { id: 'security', name: 'Bảo mật', icon: KeyIcon },
    { id: 'notifications', name: 'Thông báo', icon: BellIcon },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">{adminData.avatar}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{adminData.name}</h1>
              <p className="text-lg text-primary-600 font-medium">{adminData.role}</p>
            </div>
          </div>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100">
          <div className="border-b border-primary-100">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 sm:p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h3>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="block w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                        {formData.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="block w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                        {formData.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="block w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                        {formData.phone}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Chức vụ
                    </label>
                    <div className="px-4 py-3 bg-primary-50 rounded-xl text-primary-700 font-semibold">
                      {formData.role}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phòng ban
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="block w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                        {formData.department}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Địa điểm
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="block w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                        {formData.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-primary-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin hệ thống</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ngày tham gia
                      </label>
                      <div className="px-4 py-3 bg-secondary-50 rounded-xl text-secondary-700 font-medium">
                        {new Date(adminData.joinDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Trạng thái tài khoản
                      </label>
                      <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-primary-100 text-primary-800 border border-primary-200">
                        ✓ Hoạt động
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Bảo mật tài khoản</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="p-6 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl border border-accent-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Đổi mật khẩu</h4>
                    <p className="text-gray-600 mb-4">Cập nhật mật khẩu để bảo mật tài khoản của bạn</p>
                    <button className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl bg-accent-500 text-white hover:bg-accent-600 transition-colors">
                      Đổi mật khẩu
                    </button>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Xác thực hai yếu tố</h4>
                    <p className="text-gray-600 mb-4">Tăng cường bảo mật với xác thực hai yếu tố</p>
                    <button className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl bg-secondary-500 text-white hover:bg-secondary-600 transition-colors">
                      Kích hoạt 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Cài đặt thông báo</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-primary-100">
                    <div>
                      <h4 className="font-semibold text-gray-900">Thông báo email</h4>
                      <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-primary-100">
                    <div>
                      <h4 className="font-semibold text-gray-900">Thông báo đăng ký mới</h4>
                      <p className="text-sm text-gray-600">Thông báo khi có thành viên đăng ký mới</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-primary-100">
                    <div>
                      <h4 className="font-semibold text-gray-900">Báo cáo hàng tuần</h4>
                      <p className="text-sm text-gray-600">Nhận báo cáo hoạt động hàng tuần</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
