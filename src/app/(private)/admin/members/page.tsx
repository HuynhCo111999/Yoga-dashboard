'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon } from '@heroicons/react/24/outline';
import { membersApi, packagesApi, Member, Package } from '@/lib/api';

const statusColors = {
  active: 'bg-green-100 text-green-800 border border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border border-gray-200',
  suspended: 'bg-red-100 text-red-800 border border-red-200',
};



export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    emergencyContact: '',
    healthNotes: '',
    packageId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [membersResult, packagesResult] = await Promise.all([
        membersApi.getAllMembers(),
        packagesApi.getActivePackages()
      ]);

      if (membersResult.success && membersResult.data) {
        console.log('Loaded members:', membersResult.data.length);
        console.log('Members data:', membersResult.data.map(m => ({ id: m.id, name: m.name, email: m.email })));
        setMembers(membersResult.data);
      } else {
        console.error('Error loading members:', membersResult.error);
        setError('Không thể tải danh sách thành viên');
      }

      if (packagesResult.success && packagesResult.data) {
        setPackages(packagesResult.data);
      } else {
        console.error('Error loading packages:', packagesResult.error);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const refreshMembers = async () => {
    try {
      console.log('Refreshing members list...');
      const membersResult = await membersApi.getAllMembers();
      
      if (membersResult.success && membersResult.data) {
        console.log('Refreshed members:', membersResult.data.length);
        setMembers(membersResult.data);
      } else {
        console.error('Error refreshing members:', membersResult.error);
      }
    } catch (err) {
      console.error('Error refreshing members:', err);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.phone && member.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || member.membershipStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      if (editingMember) {
        // Update existing member
        const updateData = {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          healthNotes: formData.healthNotes,
          ...(formData.packageId && { currentPackage: formData.packageId }),
        };

        console.log('Updating member with data:', updateData);
        const result = await membersApi.updateMember(editingMember.id, updateData);
        console.log('Member update result:', result);
        
        if (result.success && result.data) {
          console.log('Member updated successfully, updating list...');
          setMembers(prev => prev.map(m => m.id === editingMember.id ? result.data! : m));
          setEditingMember(null);
          setShowAddForm(false);
          resetForm();
          console.log('Member updated in list successfully');
        } else {
          console.error('Member update failed:', result.error);
          setError(result.error || 'Có lỗi xảy ra khi cập nhật thành viên');
        }
      } else {
        // Create new member
        const memberCreateData = {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          healthNotes: formData.healthNotes,
          ...(formData.packageId && { packageId: formData.packageId }),
        };
        
        console.log('Creating member with data:', memberCreateData);
        const result = await membersApi.createMember(memberCreateData);
        console.log('Member creation result:', result);

        if (result.success && result.data) {
          console.log('Member created successfully, updating list...');
          setMembers(prev => [result.data!, ...prev]);
          setShowAddForm(false);
          resetForm();
          console.log('Member added to list successfully');
        } else {
          console.error('Member creation failed:', result.error);
          setError(result.error || 'Có lỗi xảy ra khi tạo thành viên');
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Có lỗi xảy ra khi xử lý yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (member: Member) => {
    console.log('Editing member:', member);
    console.log('Member ID:', member.id);
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      password: '',
      address: member.address || '',
      emergencyContact: member.emergencyContact || '',
      healthNotes: member.healthNotes || '',
      packageId: member.currentPackage || '',
    });
    setShowAddForm(true);
  };

  const handleStatusChange = async (memberId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      const result = await membersApi.updateMember(memberId, { membershipStatus: newStatus });
      
      if (result.success && result.data) {
        setMembers(prev => prev.map(m => m.id === memberId ? result.data! : m));
      } else {
        setError(result.error || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (err) {
      console.error('Status change error:', err);
      setError('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      emergencyContact: '',
      healthNotes: '',
      packageId: '',
    });
  };

  const getPackageName = (packageId?: string) => {
    if (!packageId) return 'Chưa có gói';
    const pkg = packages.find(p => p.id === packageId);
    return pkg?.name || 'Không xác định';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="text-gray-600">Đang tải danh sách thành viên...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Thành viên</h1>
          <p className="mt-3 text-lg text-gray-600">
            Danh sách và thông tin chi tiết của các thành viên
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
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm thành viên..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'suspended')}
              className="block w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="suspended">Bị đình chỉ</option>
            </select>
          </div>

          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingMember(null);
              resetForm();
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm thành viên
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  disabled={!!editingMember}
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {!editingMember && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    required={!editingMember}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Liên hệ khẩn cấp
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gói tập
                </label>
                <select
                  value={formData.packageId}
                  onChange={(e) => setFormData(prev => ({ ...prev, packageId: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Chọn gói tập</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.price.toLocaleString()}đ
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú sức khỏe
                </label>
                <textarea
                  rows={3}
                  value={formData.healthNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, healthNotes: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMember(null);
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
                  {submitting ? 'Đang xử lý...' : (editingMember ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Members Table */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-primary-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Danh sách thành viên ({filteredMembers.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary-100">
              <thead className="bg-primary-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thành viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gói tập
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tham gia
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-primary-100">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                            <span className="text-primary-700 font-semibold text-sm">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.phone || 'Chưa có'}</div>
                      <div className="text-sm text-gray-500">{member.address || 'Chưa có địa chỉ'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getPackageName(member.currentPackage)}</div>
                      <div className="text-sm text-gray-500">
                        {member.remainingClasses === -1 ? 'Không giới hạn' : 
                         member.remainingClasses ? `${member.remainingClasses} buổi còn lại` : 'Hết buổi'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={member.membershipStatus}
                        onChange={(e) => handleStatusChange(member.id, e.target.value as 'active' | 'inactive' | 'suspended')}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-primary-500 ${statusColors[member.membershipStatus]}`}
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                        <option value="suspended">Bị đình chỉ</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-primary-600 hover:text-primary-900 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' ? 'Không tìm thấy thành viên nào' : 'Chưa có thành viên nào'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}