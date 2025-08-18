'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const sessions = [
  {
    id: 1,
    classId: 1,
    className: 'Hatha Yoga Cơ bản',
    instructor: 'Nguyễn Thị Hương',
    date: '2024-01-22',
    startTime: '07:00',
    endTime: '08:30',
    capacity: 15,
    registeredCount: 8,
    status: 'scheduled',
    registrations: [
      { id: 1, memberName: 'Nguyễn Thị Lan', status: 'confirmed' },
      { id: 2, memberName: 'Trần Văn Minh', status: 'confirmed' },
    ]
  },
  {
    id: 2,
    classId: 2,
    className: 'Vinyasa Flow',
    instructor: 'Trần Văn Nam',
    date: '2024-01-22',
    startTime: '18:30',
    endTime: '20:00',
    capacity: 12,
    registeredCount: 12,
    status: 'scheduled',
    registrations: []
  },
  {
    id: 3,
    className: 'Yin Yoga & Meditation',
    instructor: 'Lê Thị Mai',
    date: '2024-01-23',
    startTime: '19:00',
    endTime: '20:30',
    capacity: 10,
    registeredCount: 6,
    status: 'scheduled',
    registrations: []
  },
  {
    id: 4,
    className: 'Power Yoga',
    instructor: 'Phạm Minh Đức',
    date: '2024-01-21',
    startTime: '06:30',
    endTime: '07:45',
    capacity: 8,
    registeredCount: 5,
    status: 'completed',
    registrations: []
  },
];

const classes = [
  { id: 1, name: 'Hatha Yoga Cơ bản', instructor: 'Nguyễn Thị Hương', duration: 90 },
  { id: 2, name: 'Vinyasa Flow', instructor: 'Trần Văn Nam', duration: 90 },
  { id: 3, name: 'Yin Yoga & Meditation', instructor: 'Lê Thị Mai', duration: 90 },
  { id: 4, name: 'Power Yoga', instructor: 'Phạm Minh Đức', duration: 75 },
];

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  scheduled: 'Đã lên lịch',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export default function SessionsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [selectedSession, setSelectedSession] = useState<typeof sessions[0] | null>(null);
  const [editingSession, setEditingSession] = useState<typeof sessions[0] | null>(null);
  const [newSession, setNewSession] = useState({
    classId: '',
    date: '',
    startTime: '',
    endTime: '',
    capacity: '',
  });

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new session:', newSession);
    setShowAddForm(false);
    setNewSession({
      classId: '',
      date: '',
      startTime: '',
      endTime: '',
      capacity: '',
    });
  };

  const handleEditSession = (session: typeof sessions[0]) => {
    setEditingSession(session);
    setNewSession({
      classId: session.classId?.toString() || '',
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      capacity: session.capacity.toString(),
    });
    setShowAddForm(true);
  };

  const handleDeleteSession = (sessionId: number) => {
    if (confirm('Bạn có chắc muốn xóa ca tập này?')) {
      console.log('Deleting session:', sessionId);
    }
  };

  const handleViewRegistrations = (session: typeof sessions[0]) => {
    setSelectedSession(session);
    setShowRegistrations(true);
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const handleClassChange = (classId: string) => {
    const selectedClass = classes.find(cls => cls.id.toString() === classId);
    if (selectedClass && newSession.startTime) {
      const endTime = calculateEndTime(newSession.startTime, selectedClass.duration);
      setNewSession({
        ...newSession,
        classId,
        endTime,
        capacity: '',
      });
    } else {
      setNewSession({ ...newSession, classId });
    }
  };

  const handleStartTimeChange = (startTime: string) => {
    const selectedClass = classes.find(cls => cls.id.toString() === newSession.classId);
    if (selectedClass) {
      const endTime = calculateEndTime(startTime, selectedClass.duration);
      setNewSession({ ...newSession, startTime, endTime });
    } else {
      setNewSession({ ...newSession, startTime });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Quản lý ca tập</h1>
            <p className="mt-2 text-sm text-gray-700">
              Tạo và quản lý lịch trình các ca tập yoga.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => {
                setEditingSession(null);
                setNewSession({
                  classId: '',
                  date: '',
                  startTime: '',
                  endTime: '',
                  capacity: '',
                });
                setShowAddForm(true);
              }}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Thêm ca tập
            </button>
          </div>
        </div>

        {/* Sessions table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul role="list" className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <li key={session.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{session.className}</h3>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[session.status as keyof typeof statusColors]
                          }`}
                        >
                          {statusLabels[session.status as keyof typeof statusLabels]}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          {session.instructor}
                        </span>
                        <span className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                          </svg>
                          {new Date(session.date).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {session.startTime} - {session.endTime}
                        </span>
                        <span className="flex items-center">
                          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                          </svg>
                          {session.registeredCount}/{session.capacity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewRegistrations(session)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem danh sách đăng ký"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditSession(session)}
                        className="text-emerald-600 hover:text-emerald-900"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
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

        {/* Add/Edit Session Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                  {editingSession ? 'Chỉnh sửa ca tập' : 'Thêm ca tập mới'}
                </h3>
                <form onSubmit={handleAddSession} className="space-y-4">
                  <div>
                    <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
                      Lớp học
                    </label>
                    <select
                      id="classId"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newSession.classId}
                      onChange={(e) => handleClassChange(e.target.value)}
                    >
                      <option value="">Chọn lớp học</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - {cls.instructor}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Ngày
                    </label>
                    <input
                      type="date"
                      id="date"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newSession.date}
                      onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                        Giờ bắt đầu
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        value={newSession.startTime}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                        Giờ kết thúc
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                        value={newSession.endTime}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                      Sức chứa (để trống để dùng mặc định của lớp)
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      min="1"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      value={newSession.capacity}
                      onChange={(e) => setNewSession({ ...newSession, capacity: e.target.value })}
                    />
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
                      {editingSession ? 'Cập nhật' : 'Thêm'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Registrations Modal */}
        {showRegistrations && selectedSession && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                  Danh sách đăng ký - {selectedSession.className}
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedSession.registrations && selectedSession.registrations.length > 0 ? (
                    selectedSession.registrations.map((registration: { id: number; memberName: string; status: string }) => (
                      <div key={registration.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">{registration.memberName}</span>
                        <span className="text-xs text-emerald-600">{registration.status}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">Chưa có đăng ký nào</p>
                  )}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setShowRegistrations(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
