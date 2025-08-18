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
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-yellow-100 text-yellow-800',
  expired: 'bg-red-100 text-red-800',
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
      <div className="space-y-6">
        {/* Page header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Quản lý thành viên</h1>
            <p className="mt-2 text-sm text-gray-700">
              Danh sách tất cả thành viên và thông tin gói tập của họ.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Thêm thành viên
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="Tìm kiếm thành viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Members table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <li key={member.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-emerald-600 font-medium">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusColors[member.membershipStatus as keyof typeof statusColors]
                            }`}
                          >
                            {statusLabels[member.membershipStatus as keyof typeof statusLabels]}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <p>{member.email}</p>
                          <span className="mx-2">•</span>
                          <p>{member.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{member.package}</p>
                      <p className="text-sm text-gray-500">
                        {member.remainingClasses === -1 
                          ? 'Không giới hạn' 
                          : `${member.remainingClasses} lớp còn lại`
                        }
                      </p>
                      <p className="text-xs text-gray-400">
                        Tham gia: {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="flex items-center text-sm text-gray-500">
                        {/* Additional member info can go here */}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <button
                        type="button"
                        className="text-emerald-600 hover:text-emerald-900 text-sm font-medium"
                      >
                        Chỉnh sửa
                      </button>
                      <span className="mx-2">•</span>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Add Member Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                  Thêm thành viên mới
                </h3>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="package" className="block text-sm font-medium text-gray-700">
                      Gói tập
                    </label>
                    <select
                      id="package"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newMember.package}
                      onChange={(e) => setNewMember({ ...newMember, package: e.target.value })}
                    >
                      <option value="basic">Gói Cơ bản</option>
                      <option value="premium">Gói Premium</option>
                      <option value="unlimited">Gói Unlimited</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      Thêm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
