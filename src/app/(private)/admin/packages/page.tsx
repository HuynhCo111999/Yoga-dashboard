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
      <div className="space-y-6">
        {/* Page header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Quản lý gói tập</h1>
            <p className="mt-2 text-sm text-gray-700">
              Tạo và quản lý các gói tập yoga cho thành viên.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
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
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Thêm gói tập
            </button>
          </div>
        </div>

        {/* Packages grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{pkg.name}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{pkg.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Giá:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(pkg.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Thời hạn:</span>
                    <span className="text-sm font-medium text-gray-900">{pkg.duration} ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Số lớp:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {pkg.classLimit === -1 ? 'Không giới hạn' : `${pkg.classLimit} lớp`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Trạng thái:</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pkg.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {pkg.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Package Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                  {editingPackage ? 'Chỉnh sửa gói tập' : 'Thêm gói tập mới'}
                </h3>
                <form onSubmit={handleAddPackage} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Tên gói tập
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newPackage.name}
                      onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Giá (VNĐ)
                    </label>
                    <input
                      type="number"
                      id="price"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                      Thời hạn (ngày)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newPackage.duration}
                      onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="classLimit" className="block text-sm font-medium text-gray-700">
                      Số lớp (để trống nếu không giới hạn)
                    </label>
                    <input
                      type="number"
                      id="classLimit"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newPackage.classLimit}
                      onChange={(e) => setNewPackage({ ...newPackage, classLimit: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="isActive"
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      checked={newPackage.isActive}
                      onChange={(e) => setNewPackage({ ...newPackage, isActive: e.target.checked })}
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Gói đang hoạt động
                    </label>
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
                      {editingPackage ? 'Cập nhật' : 'Thêm'}
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
