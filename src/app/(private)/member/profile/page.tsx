'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserIcon, KeyIcon, BellIcon, HeartIcon } from '@heroicons/react/24/outline';

const memberData = {
  name: 'Nguyễn Thị Lan',
  email: 'lan.nguyen@email.com',
  phone: '0901234567',
  membershipStatus: 'active',
  currentPackage: 'Gói Premium',
  remainingClasses: 8,
  joinDate: '2024-01-15',
  avatar: 'L',
  address: 'Quận 1, TP.HCM',
  emergencyContact: '0907654321',
  healthNotes: 'Không có vấn đề sức khỏe đặc biệt'
};

function MemberHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('#member-user-menu') && !target.closest('[role="menu"]')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-primary-200 shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/member" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Yên Yoga
              </h1>
              <p className="text-xs text-gray-500">Không gian yoga thanh tịnh</p>
            </div>
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              id="member-user-menu"
              type="button"
              className="flex items-center space-x-3 p-2 hover:bg-primary-50 rounded-xl transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {memberData.name.charAt(0)}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900">{memberData.name}</p>
                <p className="text-xs text-gray-500">Thành viên</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div role="menu" className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-primary-100 py-1 z-10">
                <Link
                  href="/member/profile"
                  className="flex items-center px-4 py-3 text-sm text-primary-700 bg-primary-50 font-semibold"
                >
                  <svg className="mr-3 h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Hồ sơ cá nhân
                </Link>
                <Link
                  href="/member/settings"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Cài đặt
                </Link>
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Về trang chủ
                </Link>
                <div className="border-t border-primary-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors"
                >
                  <svg className="mr-3 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function MemberProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(memberData);

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', name: 'Thông tin cá nhân', icon: UserIcon },
    { id: 'health', name: 'Sức khỏe & An toàn', icon: HeartIcon },
    { id: 'security', name: 'Bảo mật', icon: KeyIcon },
    { id: 'notifications', name: 'Thông báo', icon: BellIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50">
      <MemberHeader />
      
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="space-y-8">
            {/* Page header */}
            <div className="text-center">
              <div className="flex justify-center items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">{memberData.avatar}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{memberData.name}</h1>
                  <p className="text-lg text-primary-600 font-medium">Thành viên Yên Yoga</p>
                </div>
              </div>
              <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
            </div>

            {/* Tabs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100">
              <div className="border-b border-primary-100">
                <nav className="flex space-x-4 px-6 overflow-x-auto" aria-label="Tabs">
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
                          Địa chỉ
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="block w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                            {formData.address}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Liên hệ khẩn cấp
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.emergencyContact}
                            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                            className="block w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                            {formData.emergencyContact}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-primary-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thành viên</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Gói tập hiện tại
                          </label>
                          <div className="px-4 py-3 bg-primary-50 rounded-xl text-primary-700 font-semibold">
                            {memberData.currentPackage}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Lớp còn lại
                          </label>
                          <div className="px-4 py-3 bg-accent-50 rounded-xl text-accent-700 font-semibold">
                            {memberData.remainingClasses} lớp
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Ngày tham gia
                          </label>
                          <div className="px-4 py-3 bg-secondary-50 rounded-xl text-secondary-700 font-medium">
                            {new Date(memberData.joinDate).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Health Tab */}
                {activeTab === 'health' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Thông tin sức khỏe & An toàn</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ghi chú sức khỏe
                        </label>
                        <textarea
                          rows={4}
                          value={formData.healthNotes}
                          onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
                          className="block w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                          placeholder="Hãy cho chúng tôi biết về tình trạng sức khỏe của bạn để có thể hỗ trợ tốt nhất..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                          <h4 className="font-semibold text-red-900 mb-2">Chấn thương cũ</h4>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded text-red-600" />
                            <span className="text-sm text-red-700">Đau lưng</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded text-red-600" />
                            <span className="text-sm text-red-700">Chấn thương cổ</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded text-red-600" />
                            <span className="text-sm text-red-700">Chấn thương khác</span>
                          </label>
                        </div>

                        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-2">Mục tiêu tập luyện</h4>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded text-green-600" defaultChecked />
                            <span className="text-sm text-green-700">Thư giãn & giảm stress</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded text-green-600" />
                            <span className="text-sm text-green-700">Tăng sự linh hoạt</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded text-green-600" />
                            <span className="text-sm text-green-700">Tăng cường sức khỏe</span>
                          </label>
                        </div>
                      </div>

                      <button className="w-full sm:w-auto inline-flex items-center px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                        Cập nhật thông tin sức khỏe
                      </button>
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
                          <h4 className="font-semibold text-gray-900">Thông báo lớp học</h4>
                          <p className="text-sm text-gray-600">Nhắc nhở về lớp học sắp tới</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-primary-100">
                        <div>
                          <h4 className="font-semibold text-gray-900">Ưu đãi & khuyến mãi</h4>
                          <p className="text-sm text-gray-600">Thông báo về các chương trình ưu đãi</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-primary-100">
                        <div>
                          <h4 className="font-semibold text-gray-900">Tips & bài tập</h4>
                          <p className="text-sm text-gray-600">Lời khuyên và bài tập yoga</p>
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
        </div>
      </div>
    </div>
  );
}
