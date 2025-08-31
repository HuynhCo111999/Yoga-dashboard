'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const classes = [
  {
    id: 1,
    name: 'Hatha Yoga Cơ bản',
    description: 'Lớp yoga cơ bản dành cho người mới bắt đầu, tập trung vào các tư thế cơ bản và hơi thở.',
    instructor: 'Nguyễn Thị Hương',
    capacity: 15,
    duration: 90, // minutes
    difficulty: 'beginner',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'Vinyasa Flow',
    description: 'Yoga động kết hợp các tư thế với nhịp thở, tạo ra dòng chảy liên tục và mượt mà.',
    instructor: 'Trần Văn Nam',
    capacity: 12,
    duration: 90,
    difficulty: 'intermediate',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 3,
    name: 'Yin Yoga & Meditation',
    description: 'Lớp yoga tĩnh kết hợp thiền định, giúp thư giãn sâu và cải thiện tính linh hoạt.',
    instructor: 'Lê Thị Mai',
    capacity: 10,
    duration: 90,
    difficulty: 'beginner',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 4,
    name: 'Power Yoga',
    description: 'Yoga mạnh mẽ và năng động, tập trung vào việc tăng cường sức khỏe và thể lực.',
    instructor: 'Phạm Minh Đức',
    capacity: 8,
    duration: 75,
    difficulty: 'advanced',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 5,
    name: 'Prenatal Yoga',
    description: 'Lớp yoga dành riêng cho phụ nữ mang thai, an toàn và hiệu quả.',
    instructor: 'Lê Thị Mai',
    capacity: 6,
    duration: 75,
    difficulty: 'beginner',
    isActive: false,
    createdAt: '2023-12-20',
  },
];

const instructors = [
  'Nguyễn Thị Hương',
  'Trần Văn Nam',
  'Lê Thị Mai',
  'Phạm Minh Đức',
  'Võ Thị Lan',
];

const difficultyColors = {
  beginner: 'bg-primary-100 text-primary-800 border border-primary-200',
  intermediate: 'bg-accent-100 text-accent-800 border border-accent-200',
  advanced: 'bg-secondary-100 text-secondary-800 border border-secondary-200'
};

const difficultyLabels = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao'
};

export default function ClassesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState<typeof classes[0] | null>(null);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    instructor: '',
    capacity: '',
    duration: '90',
    difficulty: 'beginner',
    isActive: true,
  });

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new class:', newClass);
    setShowAddForm(false);
    setNewClass({
      name: '',
      description: '',
      instructor: '',
      capacity: '',
      duration: '90',
      difficulty: 'beginner',
      isActive: true,
    });
  };

  const handleEditClass = (cls: typeof classes[0]) => {
    setEditingClass(cls);
    setNewClass({
      name: cls.name,
      description: cls.description,
      instructor: cls.instructor,
      capacity: cls.capacity.toString(),
      duration: cls.duration.toString(),
      difficulty: cls.difficulty,
      isActive: cls.isActive,
    });
    setShowAddForm(true);
  };

  const handleDeleteClass = (classId: number) => {
    if (confirm('Bạn có chắc muốn xóa lớp học này?')) {
      console.log('Deleting class:', classId);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý lớp học</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tạo và quản lý các lớp học yoga tại Yên Yoga
          </p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-accent-400 to-accent-600 rounded-full mx-auto"></div>
          
          <div className="mt-8">
            <button
              type="button"
              onClick={() => {
                setEditingClass(null);
                setNewClass({
                  name: '',
                  description: '',
                  instructor: '',
                  capacity: '',
                  duration: '90',
                  difficulty: 'beginner',
                  isActive: true,
                });
                setShowAddForm(true);
              }}
              className="inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-accent-600 hover:to-accent-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Thêm lớp học mới
            </button>
          </div>
        </div>

        {/* Classes table */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl border border-accent-100">
          <ul role="list" className="divide-y divide-accent-100/50">
            {classes.map((cls) => (
              <li key={cls.id} className="hover:bg-accent-50/30 transition-colors duration-200">
                <div className="px-6 py-6 sm:px-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center shadow-md">
                          <svg className="w-6 h-6 text-accent-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{cls.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                difficultyColors[cls.difficulty as keyof typeof difficultyColors]
                              }`}
                            >
                              {difficultyLabels[cls.difficulty as keyof typeof difficultyLabels]}
                            </span>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                cls.isActive
                                  ? 'bg-primary-100 text-primary-800 border-primary-200'
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }`}
                            >
                              {cls.isActive ? '✓ Hoạt động' : '⏸ Tạm ngưng'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{cls.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center p-3 bg-primary-50/50 rounded-xl">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <div>
                              <p className="text-xs font-medium text-gray-600">Giảng viên</p>
                              <p className="text-sm font-semibold text-gray-900">{cls.instructor}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-secondary-50/50 rounded-xl">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-secondary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <p className="text-xs font-medium text-gray-600">Thời lượng</p>
                              <p className="text-sm font-semibold text-gray-900">{cls.duration} phút</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-accent-50/50 rounded-xl">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-accent-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <div>
                              <p className="text-xs font-medium text-gray-600">Sức chứa</p>
                              <p className="text-sm font-semibold text-gray-900">{cls.capacity} người</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3 ml-6">
                      <button
                        onClick={() => handleEditClass(cls)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-accent-700 bg-accent-50 border border-accent-200 rounded-xl hover:bg-accent-100 hover:border-accent-300 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all duration-200"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Add/Edit Class Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                  {editingClass ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}
                </h3>
                <form onSubmit={handleAddClass} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Tên lớp học
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newClass.name}
                      onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
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
                      value={newClass.description}
                      onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                      Giảng viên
                    </label>
                    <select
                      id="instructor"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newClass.instructor}
                      onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                    >
                      <option value="">Chọn giảng viên</option>
                      {instructors.map((instructor) => (
                        <option key={instructor} value={instructor}>
                          {instructor}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                        Sức chứa
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        required
                        min="1"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        value={newClass.capacity}
                        onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                        Thời gian (phút)
                      </label>
                      <input
                        type="number"
                        id="duration"
                        required
                        min="30"
                        step="15"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        value={newClass.duration}
                        onChange={(e) => setNewClass({ ...newClass, duration: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                      Cấp độ
                    </label>
                    <select
                      id="difficulty"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newClass.difficulty}
                      onChange={(e) => setNewClass({ ...newClass, difficulty: e.target.value })}
                    >
                      <option value="beginner">Cơ bản</option>
                      <option value="intermediate">Trung cấp</option>
                      <option value="advanced">Nâng cao</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="isActive"
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      checked={newClass.isActive}
                      onChange={(e) => setNewClass({ ...newClass, isActive: e.target.checked })}
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Lớp đang hoạt động
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
                      {editingClass ? 'Cập nhật' : 'Thêm'}
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
