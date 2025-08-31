'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const members = [
  {
    id: 1,
    name: 'Nguyễn Thị Lan',
    email: 'lan.nguyen@email.com',
    phone: '0901234567',
    membershipStatus: 'active',
    joinDate: '2024-01-15',
    package: 'Gói Premium',
    remainingClasses: 15,
  },
  {
    id: 2,
    name: 'Trần Văn Minh',
    email: 'minh.tran@email.com',
    phone: '0907654321',
    membershipStatus: 'active',
    joinDate: '2024-01-10',
    package: 'Gói Cơ bản',
    remainingClasses: 8,
  },
  {
    id: 3,
    name: 'Lê Thị Hoa',
    email: 'hoa.le@email.com',
    phone: '0909876543',
    membershipStatus: 'expired',
    joinDate: '2023-12-01',
    package: 'Gói Premium',
    remainingClasses: 0,
  },
  {
    id: 4,
    name: 'Phạm Quang Huy',
    email: 'huy.pham@email.com',
    phone: '0902345678',
    membershipStatus: 'active',
    joinDate: '2024-01-08',
    package: 'Gói Unlimited',
    remainingClasses: -1, // Unlimited
  },
  {
    id: 5,
    name: 'Võ Thị Mai',
    email: 'mai.vo@email.com',
    phone: '0905432109',
    membershipStatus: 'inactive',
    joinDate: '2023-11-20',
    package: 'Gói Cơ bản',
    remainingClasses: 3,
  },
];

const statusColors = {
  active: 'bg-primary-100 text-primary-800 border border-primary-200',
  inactive: 'bg-accent-100 text-accent-800 border border-accent-200',
  expired: 'bg-red-100 text-red-800 border border-red-200',
};

const statusLabels = {
  active: 'Hoạt động',
  inactive: 'Tạm ngưng',
  expired: 'Hết hạn',
};

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    package: 'basic',
  });

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle adding new member here
    console.log('Adding new member:', newMember);
    setShowAddForm(false);
    setNewMember({ name: '', email: '', phone: '', package: 'basic' });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý thành viên</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Danh sách tất cả thành viên và thông tin gói tập của họ tại Yên Yoga
          </p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
          
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Thêm thành viên mới
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border border-primary-200 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white shadow-md hover:shadow-lg transition-all duration-200 sm:text-sm"
              placeholder="Tìm kiếm thành viên theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Members table */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl border border-primary-100">
          <ul role="list" className="divide-y divide-primary-100/50">
            {filteredMembers.map((member) => (
              <li key={member.id} className="hover:bg-primary-50/30 transition-colors duration-200">
                <div className="px-6 py-6 sm:px-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-md">
                          <span className="text-primary-700 font-semibold text-lg">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-6">
                        <div className="flex items-center space-x-3">
                          <p className="text-lg font-semibold text-gray-900">{member.name}</p>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              statusColors[member.membershipStatus as keyof typeof statusColors]
                            }`}
                          >
                            {statusLabels[member.membershipStatus as keyof typeof statusLabels]}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            <p>{member.email}</p>
                          </div>
                          <span className="mx-3 text-gray-300">•</span>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <p>{member.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-3 py-1 rounded-xl bg-secondary-50 border border-secondary-200 mb-2">
                        <span className="text-sm font-semibold text-secondary-700">{member.package}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.remainingClasses === -1 
                          ? '✨ Không giới hạn' 
                          : `${member.remainingClasses} lớp còn lại`
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tham gia: {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Chỉnh sửa
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Xóa
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Add Member Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-8 border-0 w-full max-w-md shadow-2xl rounded-2xl bg-white/95 backdrop-blur-lg border border-primary-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Thêm thành viên mới
                </h3>
                <p className="text-gray-600">Thêm thành viên mới vào Yên Yoga</p>
              </div>
              <form onSubmit={handleAddMember} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="block w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="Nhập họ và tên"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="block w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="example@gmail.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    className="block w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="0901234567"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="package" className="block text-sm font-semibold text-gray-700 mb-2">
                    Gói tập
                  </label>
                  <select
                    id="package"
                    className="block w-full px-4 py-3 border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                    value={newMember.package}
                    onChange={(e) => setNewMember({ ...newMember, package: e.target.value })}
                  >
                    <option value="basic">Gói Cơ bản</option>
                    <option value="premium">Gói Premium</option>
                    <option value="unlimited">Gói Unlimited</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 border border-transparent rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Thêm thành viên
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
