'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { packagesApi, Package } from '@/lib/api';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    classLimit: '',
    benefits: [''],
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await packagesApi.getAllPackages();

      if (result.success && result.data) {
        setPackages(result.data);
      } else {
        console.error('Error loading packages:', result.error);
        setError('Không thể tải danh sách gói tập');
      }
    } catch (err) {
      console.error('Error loading packages:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      const packageData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        duration: parseInt(formData.duration),
        classLimit: parseInt(formData.classLimit),
        benefits: formData.benefits.filter(benefit => benefit.trim() !== ''),
      };

      if (editingPackage) {
        // Update existing package
        const result = await packagesApi.updatePackage(editingPackage.id, packageData);
        
        if (result.success && result.data) {
          setPackages(prev => prev.map(p => p.id === editingPackage.id ? result.data! : p));
          setEditingPackage(null);
          resetForm();
        } else {
          setError(result.error || 'Có lỗi xảy ra khi cập nhật gói tập');
        }
      } else {
        // Create new package
        const result = await packagesApi.createPackage(packageData);

        if (result.success && result.data) {
          setPackages(prev => [result.data!, ...prev]);
          setShowAddForm(false);
          resetForm();
        } else {
          setError(result.error || 'Có lỗi xảy ra khi tạo gói tập');
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Có lỗi xảy ra khi xử lý yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration.toString(),
      classLimit: pkg.classLimit.toString(),
      benefits: pkg.benefits && pkg.benefits.length > 0 ? pkg.benefits : [''],
    });
    setShowAddForm(true);
  };

  const handleToggleStatus = async (packageId: string) => {
    try {
      const result = await packagesApi.togglePackageStatus(packageId);
      
      if (result.success && result.data) {
        setPackages(prev => prev.map(p => p.id === packageId ? result.data! : p));
      } else {
        setError(result.error || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      setError('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleDuplicate = async (packageId: string) => {
    try {
      const result = await packagesApi.duplicatePackage(packageId);
      
      if (result.success && result.data) {
        setPackages(prev => [result.data!, ...prev]);
      } else {
        setError(result.error || 'Có lỗi xảy ra khi sao chép gói tập');
      }
    } catch (err) {
      console.error('Duplicate error:', err);
      setError('Có lỗi xảy ra khi sao chép gói tập');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      classLimit: '',
      benefits: [''],
    });
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="text-gray-600">Đang tải danh sách gói tập...</span>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Gói tập</h1>
          <p className="mt-3 text-lg text-gray-600">
            Cấu hình các gói tập và dịch vụ của studio
          </p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Tổng cộng {packages.length} gói tập
          </div>
          
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingPackage(null);
              resetForm();
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm gói tập
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPackage ? 'Chỉnh sửa gói tập' : 'Thêm gói tập mới'}
            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên gói *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="VD: Gói Premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá (VNĐ) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="500000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời hạn (ngày) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số buổi tập *
                </label>
                <input
                  type="number"
                  required
                  min="-1"
                  value={formData.classLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, classLimit: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="8 (hoặc -1 cho không giới hạn)"
                />
                <p className="text-xs text-gray-500 mt-1">Nhập -1 cho không giới hạn</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Mô tả về gói tập này..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quyền lợi
                </label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="VD: Tập không giới hạn"
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBenefit}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  + Thêm quyền lợi
                </button>
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingPackage(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {submitting ? 'Đang xử lý...' : (editingPackage ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      pkg.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {pkg.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giá:</span>
                    <span className="font-semibold text-primary-600">
                      {pkg.price.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Thời hạn:</span>
                    <span className="font-medium">{pkg.duration} ngày</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Số buổi:</span>
                    <span className="font-medium">
                      {pkg.classLimit === -1 ? 'Không giới hạn' : `${pkg.classLimit} buổi`}
                    </span>
                  </div>
                </div>

                {pkg.benefits && pkg.benefits.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Quyền lợi:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {pkg.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-primary-400 rounded-full mr-2"></span>
                          {benefit}
                        </li>
                      ))}
                      {pkg.benefits.length > 3 && (
                        <li className="text-primary-600">+{pkg.benefits.length - 3} quyền lợi khác</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                  <button
                    onClick={() => handleToggleStatus(pkg.id)}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                      pkg.isActive
                        ? 'text-red-700 bg-red-100 hover:bg-red-200'
                        : 'text-green-700 bg-green-100 hover:bg-green-200'
                    }`}
                  >
                    {pkg.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(pkg.id)}
                      className="text-secondary-600 hover:text-secondary-800 transition-colors"
                      title="Sao chép"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Chưa có gói tập nào</div>
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingPackage(null);
                resetForm();
              }}
              className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Tạo gói tập đầu tiên
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}