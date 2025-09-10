'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, ArrowPathIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { membersApi, packagesApi, Member, Package } from '@/lib/api';

const statusColors = {
  active: 'bg-green-100 text-green-800 border border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border border-gray-200',
  suspended: 'bg-red-100 text-red-800 border border-red-200',
  expired: 'bg-orange-100 text-orange-800 border border-orange-200',
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended' | 'expired'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSetupLink, setShowSetupLink] = useState(false);
  const [setupLinkInfo, setSetupLinkInfo] = useState<{ email: string; link: string } | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showRenewToast, setShowRenewToast] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewingMember, setRenewingMember] = useState<Member | null>(null);
  const [renewPackageId, setRenewPackageId] = useState('');
  const [renewSubmitting, setRenewSubmitting] = useState(false);
  const [renewMode, setRenewMode] = useState<'add' | 'replace'>('add'); // 'add' = cộng dồn, 'replace' = thay thế
  const [checkingAllExpiry, setCheckingAllExpiry] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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

      const [membersResult, packagesResult] = await Promise.all([membersApi.getAllMembers(), packagesApi.getActivePackages()]);

      if (membersResult.success && membersResult.data) {
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

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.email.toLowerCase().includes(searchTerm.toLowerCase()) || (member.phone && member.phone.includes(searchTerm));

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
        const updateData: Partial<Member> = {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          healthNotes: formData.healthNotes,
          ...(formData.packageId && { currentPackage: formData.packageId }),
        };

        // If package is being updated, also update remainingClasses
        if (formData.packageId && formData.packageId !== editingMember.currentPackage) {
          const selectedPackage = packages.find((pkg) => pkg.id === formData.packageId);
          if (selectedPackage) {
            updateData.remainingClasses = selectedPackage.classLimit;
            updateData.packageStartDate = new Date().toISOString().split('T')[0];
          }
        }

        const result = await membersApi.updateMember(editingMember.id, updateData);

        if (result.success && result.data) {
          setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? result.data! : m)));
          setEditingMember(null);
          setShowAddForm(false);
          resetForm();
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
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          healthNotes: formData.healthNotes,
          ...(formData.packageId && { packageId: formData.packageId }),
        };

        const result = await membersApi.createMember(memberCreateData);

        if (result.success && result.data) {
          setMembers((prev) => [result.data!, ...prev]);
          setShowAddForm(false);
          resetForm();

          // Show setup link for new member
          const setupLink = `${window.location.origin}/setup-auth?email=${encodeURIComponent(formData.email)}`;
          setSetupLinkInfo({
            email: formData.email,
            link: setupLink,
          });
          setShowSetupLink(true);
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
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      address: member.address || '',
      emergencyContact: member.emergencyContact || '',
      healthNotes: member.healthNotes || '',
      packageId: member.currentPackage || '',
    });
    setShowAddForm(true);
  };

  const handleStatusChange = async (memberId: string, newStatus: 'active' | 'inactive' | 'suspended' | 'expired') => {
    try {
      const result = await membersApi.updateMember(memberId, { membershipStatus: newStatus });

      if (result.success && result.data) {
        setMembers((prev) => prev.map((m) => (m.id === memberId ? result.data! : m)));
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
      address: '',
      emergencyContact: '',
      healthNotes: '',
      packageId: '',
    });
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    }
  };

  const handleRenewPackage = async (member: Member) => {
    // GIAI ĐOẠN 1: Tự động kiểm tra và xử lý hết hạn trước khi gia hạn
    if (member.currentPackage && member.packageStartDate) {
      try {
        const expireResult = await membersApi.checkAndExpirePackage(member.id);
        if (expireResult.success && expireResult.data) {
          if (expireResult.data.wasExpired) {
            // Cập nhật member trong danh sách
            setMembers((prev) => prev.map((m) => (m.id === member.id ? expireResult.data!.member! : m)));
            // Sử dụng member đã được cập nhật
            member = expireResult.data.member!;
          }
        }
      } catch (err) {
        console.error('Error checking package expiry:', err);
      }
    }

    // GIAI ĐOẠN 2: Mở modal gia hạn
    setRenewingMember(member);
    setRenewPackageId(member.currentPackage || '');
    setRenewMode('add'); // Mặc định là cộng dồn
    setShowRenewModal(true);
  };

  const handleRenewSubmit = async () => {
    if (!renewingMember || !renewPackageId || renewSubmitting) return;

    try {
      setRenewSubmitting(true);
      setError(null);

      const selectedPackage = packages.find((pkg) => pkg.id === renewPackageId);
      if (!selectedPackage) {
        setError('Không tìm thấy gói tập được chọn');
        return;
      }

      // Sử dụng logic 2 giai đoạn mới:
      // Giai đoạn 1: Kiểm tra và xử lý package hết hạn (tự động trong API)
      // Giai đoạn 2: Gia hạn package với mode add/replace
      const result = await membersApi.updateMemberPackage(
        renewingMember.id,
        renewPackageId,
        selectedPackage.classLimit,
        renewMode // 'add' hoặc 'replace'
      );

      if (result.success && result.data) {
        // Update member in the list
        setMembers((prev) => prev.map((m) => (m.id === renewingMember.id ? result.data! : m)));

        // Reload data to get fresh member stats
        setTimeout(() => {
          loadData();
        }, 500);

        // Close modal and reset
        setShowRenewModal(false);
        setRenewingMember(null);
        setRenewPackageId('');
        setRenewMode('add');

        // Show success message
        setShowRenewToast(true);
        setTimeout(() => setShowRenewToast(false), 3000);
      } else {
        setError(result.error || 'Có lỗi xảy ra khi gia hạn gói tập');
      }
    } catch (err) {
      console.error('Renew package error:', err);
      setError('Có lỗi xảy ra khi gia hạn gói tập');
    } finally {
      setRenewSubmitting(false);
    }
  };

  const handleCheckExpiry = async (member: Member) => {
    if (!member.currentPackage || !member.packageStartDate) {
      alert('Member không có package hoặc thông tin ngày bắt đầu');
      return;
    }

    try {
      setError(null);

      const result = await membersApi.checkAndExpirePackage(member.id);

      if (result.success && result.data) {
        if (result.data.wasExpired) {
          // Update member in the list
          setMembers((prev) => prev.map((m) => (m.id === member.id ? result.data!.member! : m)));
          alert(`Package của ${member.name} đã hết hạn và được cập nhật về 0 buổi`);
        } else {
          alert(`Package của ${member.name} vẫn còn hiệu lực`);
        }
      } else {
        setError(result.error || 'Có lỗi xảy ra khi kiểm tra package');
      }
    } catch (err) {
      console.error('Check expiry error:', err);
      setError('Có lỗi xảy ra khi kiểm tra package');
    }
  };

  const handleCheckAllExpiry = async () => {
    try {
      setCheckingAllExpiry(true);
      setError(null);

      const membersWithPackages = members.filter((member) => member.currentPackage && member.packageStartDate);

      if (membersWithPackages.length === 0) {
        alert('Không có member nào có package để kiểm tra');
        return;
      }

      let expiredCount = 0;
      const updatedMembers = [...members];

      // Kiểm tra từng member có package
      for (const member of membersWithPackages) {
        try {
          const result = await membersApi.checkAndExpirePackage(member.id);

          if (result.success && result.data) {
            if (result.data.wasExpired) {
              expiredCount++;
              // Cập nhật member trong array
              const memberIndex = updatedMembers.findIndex((m) => m.id === member.id);
              if (memberIndex !== -1 && result.data.member) {
                updatedMembers[memberIndex] = result.data.member;
              }
            }
          }
        } catch (err) {
          console.error(`Error checking expiry for member ${member.id}:`, err);
        }
      }

      // Cập nhật danh sách members
      setMembers(updatedMembers);

      // Hiển thị kết quả
      alert(`Đã kiểm tra ${membersWithPackages.length} members.\n` + `Số packages đã hết hạn: ${expiredCount}\n` + `Số packages còn hiệu lực: ${membersWithPackages.length - expiredCount}`);
    } catch (err) {
      console.error('Check all expiry error:', err);
      setError('Có lỗi xảy ra khi kiểm tra hết hạn');
    } finally {
      setCheckingAllExpiry(false);
    }
  };

  const getPackageInfo = (member: Member) => {
    if (!member.currentPackage) {
      return {
        name: 'Chưa có gói',
        remaining: 'Chưa có thông tin',
        total: 'N/A',
      };
    }

    const pkg = packages.find((p) => p.id === member.currentPackage);
    if (!pkg) {
      return {
        name: 'Không xác định',
        remaining: 'Chưa có thông tin',
        total: 'N/A',
      };
    }

    // Use remainingClasses directly from member object
    const remainingClasses = member.remainingClasses;
    let remainingText = '';

    if (remainingClasses === -1) {
      remainingText = 'Không giới hạn';
    } else if (remainingClasses !== undefined && remainingClasses !== null) {
      remainingText = `${remainingClasses} buổi còn lại`;
    } else {
      // Fallback to package limit if remainingClasses not set
      remainingText = pkg.classLimit === -1 ? 'Không giới hạn' : `${pkg.classLimit} buổi còn lại`;
    }

    return {
      name: pkg.name,
      remaining: remainingText,
      total: pkg.classLimit === -1 ? 'Không giới hạn' : `${pkg.classLimit} buổi`,
    };
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='space-y-6'>
          <div className='flex items-center justify-center h-64'>
            <div className='flex items-center space-x-2'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
              <span className='text-gray-600'>Đang tải danh sách thành viên...</span>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Quản lý Thành viên</h1>
          <p className='mt-3 text-lg text-gray-600'>Danh sách và thông tin chi tiết của các thành viên</p>
          <div className='mt-4 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto'></div>
        </div>

        {/* Error Display */}
        {error && <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>{error}</div>}

        {/* Controls */}
        <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
          <div className='flex items-center space-x-4 w-full sm:w-auto'>
            <div className='relative flex-grow sm:w-80'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
              </div>
              <input type='text' placeholder='Tìm kiếm thành viên...' className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'suspended')} className='block w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'>
              <option value='all'>Tất cả trạng thái</option>
              <option value='active'>Hoạt động</option>
              <option value='inactive'>Không hoạt động</option>
              <option value='suspended'>Bị đình chỉ</option>
            </select>
          </div>

          <div className='flex items-center space-x-4'>
            <button
              onClick={handleCheckAllExpiry}
              disabled={checkingAllExpiry}
              className='inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-lg shadow-sm text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              <ExclamationTriangleIcon className='h-4 w-4 mr-2' />
              {checkingAllExpiry ? 'Đang kiểm tra...' : 'Kiểm tra hết hạn tất cả'}
            </button>

            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingMember(null);
                resetForm();
              }}
              className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 cursor-pointer'
            >
              <PlusIcon className='h-5 w-5 mr-2' />
              Thêm thành viên
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className='bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>{editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}</h3>

            {!editingMember && (
              <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <p className='text-sm text-blue-700'>
                  <strong>Lưu ý:</strong> Thành viên sẽ được tạo mà chưa có tài khoản đăng nhập. Thành viên có thể liên hệ admin để được hỗ trợ thiết lập tài khoản sau.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Họ và tên *</label>
                <input type='text' required value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
                <input type='email' required disabled={!!editingMember} value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Số điện thoại</label>
                <input type='tel' value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500' />
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Địa chỉ</label>
                <input type='text' value={formData.address} onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))} className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Liên hệ khẩn cấp</label>
                <input type='text' value={formData.emergencyContact} onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))} className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Gói tập</label>
                <select value={formData.packageId} onChange={(e) => setFormData((prev) => ({ ...prev, packageId: e.target.value }))} className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'>
                  <option value=''>Chọn gói tập</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.price.toLocaleString()}đ
                    </option>
                  ))}
                </select>
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Ghi chú sức khỏe</label>
                <textarea rows={3} value={formData.healthNotes} onChange={(e) => setFormData((prev) => ({ ...prev, healthNotes: e.target.value }))} className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500' />
              </div>

              <div className='md:col-span-2 flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMember(null);
                    resetForm();
                  }}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer'
                >
                  Hủy
                </button>
                <button type='submit' disabled={submitting} className='px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
                  {submitting ? 'Đang xử lý...' : editingMember ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Setup Link Modal */}
        {showSetupLink && setupLinkInfo && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-2xl shadow-xl max-w-md w-full p-6'>
              <div className='text-center mb-4'>
                <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4'>
                  <svg className='h-6 w-6 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Thành viên đã được tạo thành công!</h3>
                <p className='text-sm text-gray-600 mb-4'>Gửi đường link dưới đây cho thành viên để họ thiết lập tài khoản:</p>
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Email thành viên:</label>
                <div className='p-3 bg-gray-50 rounded-lg text-sm text-gray-900 font-mono'>{setupLinkInfo.email}</div>
              </div>

              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Đường link thiết lập tài khoản:</label>
                <div className='flex items-center space-x-2'>
                  <div className='flex-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-900 font-mono break-all'>{setupLinkInfo.link}</div>
                  <button onClick={() => handleCopyLink(setupLinkInfo.link)} className='px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors cursor-pointer' title='Copy link'>
                    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                    </svg>
                  </button>
                </div>
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
                <p className='text-sm text-blue-700'>
                  <strong>Hướng dẫn:</strong> Gửi đường link này cho thành viên qua email hoặc tin nhắn. Thành viên sẽ sử dụng link để thiết lập mật khẩu và đăng nhập lần đầu.
                </p>
              </div>

              <div className='flex justify-end space-x-3'>
                <button
                  onClick={() => {
                    handleCopyLink(setupLinkInfo.link);
                    setShowSetupLink(false);
                    setSetupLinkInfo(null);
                  }}
                  className='px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer'
                >
                  Copy & Đóng
                </button>
                <button
                  onClick={() => {
                    setShowSetupLink(false);
                    setSetupLinkInfo(null);
                  }}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer'
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Copy Success Toast */}
        {showCopyToast && (
          <div className='fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2'>
            <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            <span>Đã copy link thành công!</span>
          </div>
        )}

        {/* Renew Success Toast */}
        {showRenewToast && (
          <div className='fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2'>
            <ArrowPathIcon className='h-5 w-5' />
            <span>Đã gia hạn gói tập thành công!</span>
          </div>
        )}

        {/* Renew Package Modal */}
        {showRenewModal && renewingMember && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-2xl shadow-xl max-w-md w-full p-6'>
              <div className='text-center mb-6'>
                <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4'>
                  <ArrowPathIcon className='h-6 w-6 text-blue-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Gia hạn gói tập</h3>
                <p className='text-sm text-gray-600'>
                  Gia hạn gói tập cho thành viên: <strong>{renewingMember.name}</strong>
                </p>
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Chọn gói tập mới:</label>
                <select value={renewPackageId} onChange={(e) => setRenewPackageId(e.target.value)} className='block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'>
                  <option value=''>Chọn gói tập</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.price.toLocaleString()}đ{pkg.classLimit === -1 ? ' (Không giới hạn)' : ` (${pkg.classLimit} buổi)`}
                    </option>
                  ))}
                </select>
              </div>

              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Cách tính số buổi:</label>
                <div className='space-y-2'>
                  <label className='flex items-center'>
                    <input type='radio' name='renewMode' value='add' checked={renewMode === 'add'} onChange={(e) => setRenewMode(e.target.value as 'add')} className='mr-2 text-blue-600' />
                    <span className='text-sm text-gray-700'>
                      <strong>Cộng dồn</strong> - Cộng số buổi mới vào số buổi còn lại (khuyến nghị)
                    </span>
                  </label>
                  <label className='flex items-center'>
                    <input type='radio' name='renewMode' value='replace' checked={renewMode === 'replace'} onChange={(e) => setRenewMode(e.target.value as 'replace')} className='mr-2 text-blue-600' />
                    <span className='text-sm text-gray-700'>
                      <strong>Thay thế</strong> - Thay thế số buổi cũ bằng số buổi mới
                    </span>
                  </label>
                </div>
              </div>

              {renewPackageId && (
                <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <h4 className='text-sm font-medium text-blue-900 mb-2'>Thông tin gia hạn:</h4>
                  {(() => {
                    const selectedPackage = packages.find((pkg) => pkg.id === renewPackageId);
                    if (!selectedPackage) return null;

                    const currentRemainingClasses = renewingMember.remainingClasses || 0;
                    let newTotalClasses = selectedPackage.classLimit;

                    // Calculate based on mode
                    if (renewMode === 'add') {
                      if (selectedPackage.classLimit === -1 || currentRemainingClasses === -1) {
                        newTotalClasses = -1;
                      } else {
                        newTotalClasses = currentRemainingClasses + selectedPackage.classLimit;
                      }
                    } else {
                      newTotalClasses = selectedPackage.classLimit;
                    }

                    return (
                      <div className='text-sm text-blue-700 space-y-1'>
                        <p>
                          • Gói tập mới: <strong>{selectedPackage.name}</strong>
                        </p>
                        <p>
                          • Giá gói: <strong>{selectedPackage.price.toLocaleString()}đ</strong>
                        </p>
                        <p>
                          • Buổi của gói mới: <strong>{selectedPackage.classLimit === -1 ? 'Không giới hạn' : `${selectedPackage.classLimit} buổi`}</strong>
                        </p>
                        <div className='border-t border-blue-200 pt-2 mt-2'>
                          <p className='font-medium'>Kết quả sau gia hạn:</p>
                          <p>
                            • Buổi hiện tại: <strong>{currentRemainingClasses === -1 ? 'Không giới hạn' : `${currentRemainingClasses} buổi`}</strong>
                          </p>
                          <p>
                            • Tổng buổi sau gia hạn: <strong className='text-green-700'>{newTotalClasses === -1 ? 'Không giới hạn' : `${newTotalClasses} buổi`}</strong>
                          </p>
                        </div>
                        <p>
                          • Ngày gia hạn: <strong>{new Date().toLocaleDateString('vi-VN')}</strong>
                        </p>
                        <p className={`text-xs mt-2 p-2 rounded ${renewMode === 'add' ? 'text-green-700 bg-green-100' : 'text-orange-700 bg-orange-100'}`}>
                          {renewMode === 'add' ? (
                            <>
                              💡 <strong>Cộng dồn:</strong> Số buổi còn lại sẽ được cộng với gói mới.
                            </>
                          ) : (
                            <>
                              ⚠️ <strong>Thay thế:</strong> Số buổi còn lại sẽ bị thay thế bằng gói mới.
                            </>
                          )}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className='flex justify-end space-x-3'>
                <button
                  onClick={() => {
                    setShowRenewModal(false);
                    setRenewingMember(null);
                    setRenewPackageId('');
                    setRenewMode('add');
                  }}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer'
                >
                  Hủy
                </button>
                <button onClick={handleRenewSubmit} disabled={!renewPackageId || renewSubmitting} className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
                  {renewSubmitting ? 'Đang xử lý...' : 'Gia hạn'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Members Table */}
        <div className='bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 overflow-hidden'>
          <div className='px-6 py-4 border-b border-primary-100'>
            <h3 className='text-lg font-semibold text-gray-900'>Danh sách thành viên ({filteredMembers.length})</h3>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-primary-100'>
              <thead className='bg-primary-50/50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Thành viên</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Liên hệ</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Gói tập</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Trạng thái</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Ngày tham gia</th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>Thao tác</th>
                </tr>
              </thead>
              <tbody className='bg-white/50 divide-y divide-primary-100'>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className='hover:bg-primary-50/30 transition-colors'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='h-10 w-10 flex-shrink-0'>
                          <div className='h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center'>
                            <span className='text-primary-700 font-semibold text-sm'>{member.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>{member.name}</div>
                          <div className='text-sm text-gray-500'>{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{member.phone || 'Chưa có'}</div>
                      <div className='text-sm text-gray-500'>{member.address || 'Chưa có địa chỉ'}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {(() => {
                        const packageInfo = getPackageInfo(member);
                        return (
                          <>
                            <div className='text-sm text-gray-900'>{packageInfo.name}</div>
                            <div className='text-sm text-gray-500'>{packageInfo.remaining}</div>
                            <div className='text-xs text-gray-400'>Tổng: {packageInfo.total}</div>
                          </>
                        );
                      })()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <select value={member.membershipStatus} onChange={(e) => handleStatusChange(member.id, e.target.value as 'active' | 'inactive' | 'suspended' | 'expired')} className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-primary-500 ${statusColors[member.membershipStatus]}`}>
                        <option value='active'>Hoạt động</option>
                        <option value='inactive'>Không hoạt động</option>
                        <option value='suspended'>Bị đình chỉ</option>
                      </select>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{new Date(member.joinDate).toLocaleDateString('vi-VN')}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2'>
                      <button onClick={() => handleEdit(member)} className='text-primary-600 hover:text-primary-900 transition-colors cursor-pointer' title='Chỉnh sửa thành viên'>
                        <PencilIcon className='h-4 w-4' />
                      </button>
                      {member.currentPackage && member.packageStartDate && (
                        <button onClick={() => handleCheckExpiry(member)} className='text-orange-600 hover:text-orange-900 transition-colors cursor-pointer' title='Kiểm tra hết hạn package'>
                          <ClockIcon className='h-4 w-4' />
                        </button>
                      )}
                      {member.currentPackage && (
                        <button onClick={() => handleRenewPackage(member)} className='text-green-600 hover:text-green-900 transition-colors cursor-pointer' title='Gia hạn gói tập'>
                          <ArrowPathIcon className='h-4 w-4' />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMembers.length === 0 && (
              <div className='text-center py-12'>
                <div className='text-gray-500'>{searchTerm || statusFilter !== 'all' ? 'Không tìm thấy thành viên nào' : 'Chưa có thành viên nào'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
