'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const packages = [
  {
    id: 1,
    name: 'Gói Cơ bản',
    description: 'Phù hợp cho người mới bắt đầu với yoga',
    price: 500000,
    duration: 30,
    classLimit: 8,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'Gói Premium',
    description: 'Gói tập toàn diện với nhiều lợi ích',
    price: 800000,
    duration: 30,
    classLimit: 12,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 3,
    name: 'Gói Unlimited',
    description: 'Tập không giới hạn trong tháng',
    price: 1200000,
    duration: 30,
    classLimit: -1, // Unlimited
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 4,
    name: 'Gói Học sinh - Sinh viên',
    description: 'Ưu đãi đặc biệt cho học sinh, sinh viên',
    price: 350000,
    duration: 30,
    classLimit: 6,
    isActive: false,
    createdAt: '2023-12-15',
  },
];

export default function PackagesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<typeof packages[0] | null>(null);
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    price: '',
    duration: '30',
    classLimit: '',
    isActive: true,
  });

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new package:', newPackage);
    setShowAddForm(false);
    setNewPackage({
      name: '',
      description: '',
      price: '',
      duration: '30',
      classLimit: '',
      isActive: true,
    });
  };

  const handleEditPackage = (pkg: typeof packages[0]) => {
    setEditingPackage(pkg);
    setNewPackage({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration.toString(),
      classLimit: pkg.classLimit === -1 ? '' : pkg.classLimit.toString(),
      isActive: pkg.isActive,
    });
    setShowAddForm(true);
  };

  const handleDeletePackage = (packageId: number) => {
    if (confirm('Bạn có chắc muốn xóa gói tập này?')) {
      console.log('Deleting package:', packageId);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý gói tập</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tạo và quản lý các gói tập yoga cho thành viên tại Yên Yoga
          </p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full mx-auto"></div>
          
          <div className="mt-8">
            <button
              type="button"
              onClick={() => {
                setEditingPackage(null);
                setNewPackage({
                  name: '',
                  description: '',
                  price: '',
                  duration: '30',
                  classLimit: '',
                  isActive: true,
                });
                setShowAddForm(true);
              }}
              className="inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-secondary-500 to-secondary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-secondary-600 hover:to-secondary-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Thêm gói tập mới
            </button>
          </div>
        </div>

        {/* Packages grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-secondary-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="px-6 py-6 sm:p-8">
                {/* Header with price highlight */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-secondary-600 mb-2">
                    {formatPrice(pkg.price)}
                  </div>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                </div>

                {/* Package details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-secondary-50/50 rounded-xl">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-secondary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Thời hạn</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{pkg.duration} ngày</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-primary-50/50 rounded-xl">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Số lớp</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {pkg.classLimit === -1 ? '✨ Không giới hạn' : `${pkg.classLimit} lớp`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-accent-50/50 rounded-xl">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-accent-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Trạng thái</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                        pkg.isActive
                          ? 'bg-primary-100 text-primary-800 border-primary-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      {pkg.isActive ? '✓ Hoạt động' : '⏸ Tạm ngưng'}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditPackage(pkg)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-secondary-700 bg-secondary-50 border border-secondary-200 rounded-xl hover:bg-secondary-100 hover:border-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all duration-200"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Package Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-8 border-0 w-full max-w-lg shadow-2xl rounded-2xl bg-white/95 backdrop-blur-lg border border-secondary-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {editingPackage ? 'Chỉnh sửa gói tập' : 'Thêm gói tập mới'}
                </h3>
                <p className="text-gray-600">
                  {editingPackage ? 'Cập nhật thông tin gói tập' : 'Tạo gói tập mới cho Yên Yoga'}
                </p>
              </div>
              
              <form onSubmit={handleAddPackage} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên gói tập
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="block w-full px-4 py-3 border border-secondary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="Ví dụ: Gói Premium"
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="block w-full px-4 py-3 border border-secondary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="Mô tả về gói tập này..."
                    value={newPackage.description}
                    onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                      Giá (VNĐ)
                    </label>
                    <input
                      type="number"
                      id="price"
                      required
                      className="block w-full px-4 py-3 border border-secondary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                      placeholder="500000"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                      Thời hạn (ngày)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      required
                      className="block w-full px-4 py-3 border border-secondary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                      placeholder="30"
                      value={newPackage.duration}
                      onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="classLimit" className="block text-sm font-semibold text-gray-700 mb-2">
                    Số lớp (để trống nếu không giới hạn)
                  </label>
                  <input
                    type="number"
                    id="classLimit"
                    className="block w-full px-4 py-3 border border-secondary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="Để trống cho không giới hạn"
                    value={newPackage.classLimit}
                    onChange={(e) => setNewPackage({ ...newPackage, classLimit: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center p-4 bg-secondary-50/50 rounded-xl">
                  <input
                    id="isActive"
                    type="checkbox"
                    className="h-5 w-5 text-secondary-600 focus:ring-secondary-500 border-secondary-300 rounded"
                    checked={newPackage.isActive}
                    onChange={(e) => setNewPackage({ ...newPackage, isActive: e.target.checked })}
                  />
                  <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-gray-900">
                    Gói đang hoạt động và có thể đăng ký
                  </label>
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
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-secondary-500 to-secondary-600 border border-transparent rounded-xl hover:from-secondary-600 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {editingPackage ? 'Cập nhật gói tập' : 'Thêm gói tập'}
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
