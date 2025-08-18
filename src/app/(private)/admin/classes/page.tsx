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
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
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
      <div className="space-y-6">
        {/* Page header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Quản lý lớp học</h1>
            <p className="mt-2 text-sm text-gray-700">
              Tạo và quản lý các lớp học yoga.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
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
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Thêm lớp học
            </button>
          </div>
        </div>

        {/* Classes table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul role="list" className="divide-y divide-gray-200">
            {classes.map((cls) => (
              <li key={cls.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{cls.name}</h3>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            difficultyColors[cls.difficulty as keyof typeof difficultyColors]
                          }`}
                        >
                          {difficultyLabels[cls.difficulty as keyof typeof difficultyLabels]}
                        </span>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            cls.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {cls.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{cls.description}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          {cls.instructor}
                        </span>
                        <span className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {cls.duration} phút
                        </span>
                        <span className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                          </svg>
                          {cls.capacity} người
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClass(cls)}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
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
