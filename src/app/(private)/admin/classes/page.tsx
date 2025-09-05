'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, PencilIcon, MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';
import { classesApi, YogaClass } from '@/lib/api';

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 border border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border border-red-200',
};

const difficultyLabels = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [instructors, setInstructors] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [instructorFilter, setInstructorFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState<YogaClass | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructor: '',
    duration: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    maxCapacity: '',
    price: '',
    category: '',
    requirements: [''],
    benefits: [''],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [classesResult, instructorsResult, categoriesResult] = await Promise.all([
        classesApi.getAllClasses(),
        classesApi.getInstructors(),
        classesApi.getCategories()
      ]);

      if (classesResult.success && classesResult.data) {
        setClasses(classesResult.data);
      } else {
        console.error('Error loading classes:', classesResult.error);
        setError('Không thể tải danh sách lớp học');
      }

      if (instructorsResult.success && instructorsResult.data) {
        setInstructors(instructorsResult.data);
      }

      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = difficultyFilter === 'all' || cls.difficulty === difficultyFilter;
    const matchesInstructor = instructorFilter === 'all' || cls.instructor === instructorFilter;
    
    return matchesSearch && matchesDifficulty && matchesInstructor;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      const classData = {
        name: formData.name,
        description: formData.description,
        instructor: formData.instructor,
        duration: parseInt(formData.duration),
        difficulty: formData.difficulty,
        maxCapacity: parseInt(formData.maxCapacity),
        price: formData.price ? parseInt(formData.price) : undefined,
        category: formData.category || undefined,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        benefits: formData.benefits.filter(benefit => benefit.trim() !== ''),
      };

      if (editingClass) {
        // Update existing class
        const result = await classesApi.updateClass(editingClass.id, classData);
        
        if (result.success && result.data) {
          setClasses(prev => prev.map(c => c.id === editingClass.id ? result.data! : c));
          setEditingClass(null);
          resetForm();
        } else {
          setError(result.error || 'Có lỗi xảy ra khi cập nhật lớp học');
        }
      } else {
        // Create new class
        const result = await classesApi.createClass(classData);

        if (result.success && result.data) {
          setClasses(prev => [result.data!, ...prev]);
    setShowAddForm(false);
          resetForm();
          // Refresh instructors and categories if new ones were added
          await loadInstructorsAndCategories();
        } else {
          setError(result.error || 'Có lỗi xảy ra khi tạo lớp học');
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Có lỗi xảy ra khi xử lý yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  const loadInstructorsAndCategories = async () => {
    const [instructorsResult, categoriesResult] = await Promise.all([
      classesApi.getInstructors(),
      classesApi.getCategories()
    ]);

    if (instructorsResult.success && instructorsResult.data) {
      setInstructors(instructorsResult.data);
    }

    if (categoriesResult.success && categoriesResult.data) {
      setCategories(categoriesResult.data);
    }
  };

  const handleEdit = (cls: YogaClass) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      description: cls.description,
      instructor: cls.instructor,
      duration: cls.duration.toString(),
      difficulty: cls.difficulty,
      maxCapacity: cls.maxCapacity.toString(),
      price: cls.price?.toString() || '',
      category: cls.category || '',
      requirements: cls.requirements && cls.requirements.length > 0 ? cls.requirements : [''],
      benefits: cls.benefits && cls.benefits.length > 0 ? cls.benefits : [''],
    });
    setShowAddForm(true);
  };

  const handleToggleStatus = async (classId: string) => {
    try {
      const result = await classesApi.toggleClassStatus(classId);
      
      if (result.success && result.data) {
        setClasses(prev => prev.map(c => c.id === classId ? result.data! : c));
      } else {
        setError(result.error || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      setError('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleDuplicate = async (classId: string) => {
    try {
      const result = await classesApi.duplicateClass(classId);
      
      if (result.success && result.data) {
        setClasses(prev => [result.data!, ...prev]);
      } else {
        setError(result.error || 'Có lỗi xảy ra khi sao chép lớp học');
      }
    } catch (err) {
      console.error('Duplicate error:', err);
      setError('Có lỗi xảy ra khi sao chép lớp học');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      instructor: '',
      duration: '',
      difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
      maxCapacity: '',
      price: '',
      category: '',
      requirements: [''],
      benefits: [''],
    });
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
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
              <span className="text-gray-600">Đang tải danh sách lớp học...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Lớp học</h1>
          <p className="mt-3 text-lg text-gray-600">
            Cấu hình các lớp học và nội dung giảng dạy
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
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm lớp học..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as 'all' | 'beginner' | 'intermediate' | 'advanced')}
              className="block w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Tất cả cấp độ</option>
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>

            <select
              value={instructorFilter}
              onChange={(e) => setInstructorFilter(e.target.value)}
              className="block w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Tất cả giảng viên</option>
              {instructors.map(instructor => (
                <option key={instructor} value={instructor}>{instructor}</option>
              ))}
            </select>
        </div>

                      <button
            onClick={() => {
              setShowAddForm(true);
              setEditingClass(null);
              resetForm();
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm lớp học
                      </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingClass ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}
                </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên lớp học *
                    </label>
                    <input
                      type="text"
                      required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="VD: Hatha Yoga Cơ bản"
                    />
                  </div>

                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giảng viên *
                      </label>
                      <input
                  type="text"
                        required
                  value={formData.instructor}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="VD: Nguyễn Thị Hương"
                      />
                    </div>

                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời lượng (phút) *
                      </label>
                      <input
                        type="number"
                        required
                        min="30"
                  max="180"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="90"
                      />
                    </div>

                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cấp độ *
                    </label>
                    <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="beginner">Cơ bản</option>
                      <option value="intermediate">Trung cấp</option>
                      <option value="advanced">Nâng cao</option>
                    </select>
                  </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sức chứa tối đa *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá lẻ (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="200000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="VD: Hatha Yoga"
                />
                {categories.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    Có sẵn: {categories.join(', ')}
                  </div>
                )}
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
                  placeholder="Mô tả chi tiết về lớp học..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yêu cầu
                </label>
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="VD: Không cần kinh nghiệm"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  + Thêm yêu cầu
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lợi ích
                    </label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="VD: Cải thiện tính linh hoạt"
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBenefit}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  + Thêm lợi ích
                </button>
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingClass(null);
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
                  {submitting ? 'Đang xử lý...' : (editingClass ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{cls.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[cls.difficulty]}`}>
                      {difficultyLabels[cls.difficulty]}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cls.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {cls.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{cls.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giảng viên:</span>
                    <span className="font-medium text-primary-600">{cls.instructor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Thời lượng:</span>
                    <span className="font-medium">{cls.duration} phút</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sức chứa:</span>
                    <span className="font-medium">{cls.maxCapacity} người</span>
                  </div>
                  {cls.price && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Giá lẻ:</span>
                      <span className="font-semibold text-primary-600">
                        {cls.price.toLocaleString()}đ
                      </span>
                    </div>
                  )}
                  {cls.category && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Danh mục:</span>
                      <span className="font-medium">{cls.category}</span>
                    </div>
                  )}
                </div>

                {cls.benefits && cls.benefits.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Lợi ích:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {cls.benefits.slice(0, 2).map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-primary-400 rounded-full mr-2"></span>
                          {benefit}
                        </li>
                      ))}
                      {cls.benefits.length > 2 && (
                        <li className="text-primary-600">+{cls.benefits.length - 2} lợi ích khác</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                  <button
                    onClick={() => handleToggleStatus(cls.id)}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                      cls.isActive
                        ? 'text-red-700 bg-red-100 hover:bg-red-200'
                        : 'text-green-700 bg-green-100 hover:bg-green-200'
                    }`}
                  >
                    {cls.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(cls)}
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(cls.id)}
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

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm || difficultyFilter !== 'all' || instructorFilter !== 'all' 
                ? 'Không tìm thấy lớp học nào' 
                : 'Chưa có lớp học nào'}
            </div>
            {!searchTerm && difficultyFilter === 'all' && instructorFilter === 'all' && (
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingClass(null);
                  resetForm();
                }}
                className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Tạo lớp học đầu tiên
              </button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}