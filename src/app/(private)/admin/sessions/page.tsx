'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, PencilIcon, EyeIcon, CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { sessionsApi, classesApi, membersApi, Session, YogaClass, Member } from '@/lib/api';

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800 border border-blue-200',
  completed: 'bg-green-100 text-green-800 border border-green-200',
  cancelled: 'bg-red-100 text-red-800 border border-red-200',
};

const statusLabels = {
  scheduled: 'Đã lên lịch',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showRegistrations, setShowRegistrations] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    classId: '',
    date: '',
    startTime: '',
    endTime: '',
    capacity: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sessionsResult, classesResult, membersResult] = await Promise.all([
        sessionsApi.getAllSessions(),
        classesApi.getActiveClasses(),
        membersApi.getAllMembers({ status: 'active' })
      ]);

      if (sessionsResult.success && sessionsResult.data) {
        setSessions(sessionsResult.data);
      } else {
        console.error('Error loading sessions:', sessionsResult.error);
        setError('Không thể tải danh sách ca tập');
      }

      if (classesResult.success && classesResult.data) {
        setClasses(classesResult.data);
      } else {
        console.error('Error loading classes:', classesResult.error);
      }

      if (membersResult.success && membersResult.data) {
        setMembers(membersResult.data);
      } else {
        console.error('Error loading members:', membersResult.error);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesDate = !dateFilter || session.date === dateFilter;
    
    return matchesStatus && matchesDate;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      const sessionData = {
        classId: formData.classId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        notes: formData.notes || undefined,
      };

      if (editingSession) {
        // Update existing session
        const result = await sessionsApi.updateSession(editingSession.id, sessionData);
        
        if (result.success && result.data) {
          setSessions(prev => prev.map(s => s.id === editingSession.id ? result.data! : s));
          setEditingSession(null);
          resetForm();
        } else {
          setError(result.error || 'Có lỗi xảy ra khi cập nhật ca tập');
        }
      } else {
        // Create new session
        const result = await sessionsApi.createSession(sessionData);

        if (result.success && result.data) {
          setSessions(prev => [result.data!, ...prev]);
          setShowAddForm(false);
          resetForm();
        } else {
          setError(result.error || 'Có lỗi xảy ra khi tạo ca tập');
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Có lỗi xảy ra khi xử lý yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setFormData({
      classId: session.classId,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      capacity: session.capacity.toString(),
      notes: session.notes || '',
    });
    setShowAddForm(true);
  };

  const handleStatusChange = async (sessionId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      const result = await sessionsApi.updateSession(sessionId, { status });
      
      if (result.success && result.data) {
        setSessions(prev => prev.map(s => s.id === sessionId ? result.data! : s));
      } else {
        setError(result.error || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (err) {
      console.error('Status change error:', err);
      setError('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleViewRegistrations = (session: Session) => {
    setSelectedSession(session);
    setShowRegistrations(true);
  };

  const handleMarkAttendance = async (sessionId: string, memberId: string, attended: boolean) => {
    try {
      const result = await sessionsApi.markAttendance(sessionId, memberId, attended);
      
      if (result.success && result.data) {
        setSessions(prev => prev.map(s => s.id === sessionId ? result.data! : s));
        setSelectedSession(result.data);
      } else {
        setError(result.error || 'Có lỗi xảy ra khi điểm danh');
      }
    } catch (err) {
      console.error('Attendance error:', err);
      setError('Có lỗi xảy ra khi điểm danh');
    }
  };

  const resetForm = () => {
    setFormData({
      classId: '',
      date: '',
      startTime: '',
      endTime: '',
      capacity: '',
      notes: '',
    });
  };

  const getClassById = (classId: string) => {
    return classes.find(cls => cls.id === classId);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="text-gray-600">Đang tải danh sách ca tập...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Ca tập</h1>
          <p className="mt-3 text-lg text-gray-600">
            Lên lịch và quản lý các ca tập hàng ngày
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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'scheduled' | 'completed' | 'cancelled')}
              className="block w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingSession(null);
              resetForm();
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm ca tập
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingSession ? 'Chỉnh sửa ca tập' : 'Thêm ca tập mới'}
            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lớp học *
                </label>
                <select
                  required
                  value={formData.classId}
                  onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Chọn lớp học</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.instructor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày tập *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ bắt đầu *
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ kết thúc *
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sức chứa (tùy chọn)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Mặc định theo lớp học"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ghi chú đặc biệt cho ca tập này..."
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingSession(null);
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
                  {submitting ? 'Đang xử lý...' : (editingSession ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sessions Table */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-primary-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Danh sách ca tập ({filteredSessions.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary-100">
              <thead className="bg-primary-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lớp học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đăng ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-primary-100">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                            <CalendarIcon className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{session.className}</div>
                          <div className="text-sm text-gray-500">{session.instructor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(session.date)}
                        </div>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {session.startTime} - {session.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {session.registeredCount}/{session.capacity}
                        </span>
                        <div className={`ml-2 h-2 w-16 rounded-full overflow-hidden ${
                          session.registeredCount >= session.capacity ? 'bg-red-200' : 'bg-gray-200'
                        }`}>
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              session.registeredCount >= session.capacity ? 'bg-red-500' : 'bg-primary-500'
                            }`}
                            style={{ width: `${Math.min((session.registeredCount / session.capacity) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={session.status}
                        onChange={(e) => handleStatusChange(session.id, e.target.value as 'scheduled' | 'completed' | 'cancelled')}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-primary-500 ${statusColors[session.status]}`}
                      >
                        <option value="scheduled">Đã lên lịch</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(session)}
                        className="text-primary-600 hover:text-primary-900 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleViewRegistrations(session)}
                        className="text-secondary-600 hover:text-secondary-900 transition-colors"
                        title="Xem đăng ký"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredSessions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {statusFilter !== 'all' || dateFilter ? 'Không tìm thấy ca tập nào' : 'Chưa có ca tập nào'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Registrations Modal */}
        {showRegistrations && selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Danh sách đăng ký - {selectedSession.className}
                  </h3>
                  <button
                    onClick={() => setShowRegistrations(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(selectedSession.date)} • {selectedSession.startTime} - {selectedSession.endTime}
                </p>
              </div>
              
              <div className="p-6">
                {selectedSession.registrations.length > 0 ? (
                  <div className="space-y-4">
                    {selectedSession.registrations.map((registration) => (
                      <div key={registration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{registration.memberName}</div>
                          <div className="text-sm text-gray-500">{registration.memberEmail}</div>
                          <div className="text-xs text-gray-400">
                            Đăng ký: {new Date(registration.registeredAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            registration.status === 'attended' ? 'bg-green-100 text-green-800' :
                            registration.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            registration.status === 'no-show' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {registration.status === 'attended' ? 'Đã tham gia' :
                             registration.status === 'confirmed' ? 'Đã xác nhận' :
                             registration.status === 'no-show' ? 'Vắng mặt' : 'Đã hủy'}
                          </span>
                          
                          {selectedSession.status === 'completed' && registration.status === 'confirmed' && (
                            <div className="space-x-1">
                              <button
                                onClick={() => handleMarkAttendance(selectedSession.id, registration.memberId, true)}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                              >
                                Có mặt
                              </button>
                              <button
                                onClick={() => handleMarkAttendance(selectedSession.id, registration.memberId, false)}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                Vắng mặt
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có đăng ký nào
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}