'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sessionsApi, Session, membersApi } from '@/lib/api';
import { checkSessionCancellationTime } from '@/utils/sessionUtils';
import Header from '@/components/Header';

// Types
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

const difficultyColors: Record<DifficultyLevel, string> = {
  beginner: 'bg-accent-100 text-accent-800',
  intermediate: 'bg-primary-100 text-primary-800',
  advanced: 'bg-secondary-100 text-secondary-800'
};

const difficultyLabels: Record<DifficultyLevel, string> = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao'
};

interface RegistrationPopupProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isRegistered: boolean;
  loading: boolean;
}

function RegistrationPopup({ session, isOpen, onClose, onConfirm, isRegistered, loading }: RegistrationPopupProps) {
  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {isRegistered ? 'Hủy đăng ký' : 'Xác nhận đăng ký'}
          </h3>
          
          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900">{session.className}</h4>
              <p className="text-sm text-gray-600 mt-1">Giảng viên: {session.instructor}</p>
              <p className="text-sm text-gray-600">
                Ngày: {new Date(session.date).toLocaleDateString('vi-VN')} • {session.startTime} - {session.endTime}
              </p>
              <p className="text-sm text-gray-600">
                Sức chứa: {session.registeredCount}/{session.capacity} người
              </p>
            </div>
            
            {isRegistered ? (
              <div className="text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-sm">
                  ⚠️ Việc hủy đăng ký cần được xác thực bởi admin. Bạn có chắc chắn muốn hủy đăng ký không?
                </p>
              </div>
            ) : (
              <div className="text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm">
                  ✅ Bạn có chắc chắn muốn đăng ký lớp học này không?
                </p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                isRegistered 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                  : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
              }`}
            >
              {loading ? 'Đang xử lý...' : (isRegistered ? 'Xác nhận hủy' : 'Xác nhận đăng ký')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Calendar() {
  const { user } = useAuth();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth()));
  const [sessions, setSessions] = useState<Session[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [currentMonth]);

  useEffect(() => {
    if (user) {
      loadUserRegistrations();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Debug authentication
      console.log('Loading sessions, user:', user?.email, 'uid:', user?.uid);
      
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      console.log('Date range:', startDate.toISOString().split('T')[0], 'to', endDate.toISOString().split('T')[0]);

      const result = await sessionsApi.getSessionsByDateRange(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      console.log('Sessions API result:', result);

      if (result.success && result.data) {
        setSessions(result.data);
      } else {
        setError('Không thể tải lịch tập');
        console.error('Error loading sessions:', result.error);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError('Có lỗi xảy ra khi tải lịch tập');
    } finally {
      setLoading(false);
    }
  };

  const loadUserRegistrations = async () => {
    if (!user || !user.email) return;

    try {
      // Find member by email first
      const memberResult = await membersApi.getMemberByEmail(user.email);
      if (!memberResult.success || !memberResult.data) {
        console.log('No member found for user:', user.email);
        setUserRegistrations([]);
        return;
      }

      const memberId = memberResult.data.id;
      console.log('Loading registrations for member:', memberId);

      // Get user's registrations from sessions
      const registrationIds: string[] = [];
      sessions.forEach(session => {
        const userRegistration = session.registrations.find(
          reg => reg.memberId === memberId && reg.status === 'confirmed'
        );
        if (userRegistration) {
          registrationIds.push(session.id);
        }
      });
      
      console.log('Found registrations:', registrationIds);
      setUserRegistrations(registrationIds);
    } catch (err) {
      console.error('Error loading user registrations:', err);
    }
  };

  const filteredSessions = sessions.filter(session => session.date === selectedDate);

  const handleRegisterClick = (session: Session) => {
    if (!user) {
      setError('Bạn cần đăng nhập để đăng ký lớp học');
      return;
    }

    // Check if session is full and user is not registered
    if (session.registeredCount >= session.capacity && !userRegistrations.includes(session.id)) {
      setError('Lớp học này đã đầy');
      return;
    }

    setSelectedSession(session);
    setShowPopup(true);
  };

  const handleRegistrationConfirm = async () => {
    if (!selectedSession || !user || !user.email) return;

    try {
      setActionLoading(true);
      setError(null);

      // Find member by email first
      const memberResult = await membersApi.getMemberByEmail(user.email);
      if (!memberResult.success || !memberResult.data) {
        setError('Không tìm thấy thông tin thành viên');
        return;
      }

      const memberId = memberResult.data.id;
      const isRegistered = userRegistrations.includes(selectedSession.id);

      if (isRegistered) {
        // Cancel registration
        const result = await sessionsApi.cancelRegistration(selectedSession.id, memberId);
        
        if (result.success && result.data) {
          // Update local state
          setSessions(prev => prev.map(s => s.id === selectedSession.id ? result.data! : s));
          setUserRegistrations(prev => prev.filter(id => id !== selectedSession.id));
          setShowPopup(false);
          setSelectedSession(null);
        } else {
          setError(result.error || 'Có lỗi xảy ra khi hủy đăng ký');
        }
      } else {
        // Register for session
        const registrationData = {
          sessionId: selectedSession.id,
          memberId: memberId,
          notes: '',
        };

        console.log('📝 Registering for session:', {
          sessionId: selectedSession.id,
          memberId: memberId,
          memberEmail: user.email,
          className: selectedSession.className,
          date: selectedSession.date
        });

        const result = await sessionsApi.registerMemberForSession(registrationData);
        
        if (result.success && result.data) {
          console.log('✅ Registration successful:', result.data);
          // Update local state
          setSessions(prev => prev.map(s => s.id === selectedSession.id ? result.data! : s));
          setUserRegistrations(prev => [...prev, selectedSession.id]);
          setShowPopup(false);
          setSelectedSession(null);
    } else {
          console.error('❌ Registration failed:', result.error);
          setError(result.error || 'Có lỗi xảy ra khi đăng ký');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Có lỗi xảy ra khi xử lý yêu cầu');
    } finally {
      setActionLoading(false);
    }
  };

  const getNextWeekDates = () => {
    const dates = [];
    const currentDate = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const getSessionsForDate = (dateStr: string) => {
    return sessions.filter(session => session.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const formatMonthYear = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  const isToday = (dateStr: string) => {
    const today = new Date();
    const checkDate = new Date(dateStr);
    return checkDate.toDateString() === today.toDateString();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = formatDate(date);
      const sessionsForDay = getSessionsForDate(dateStr);
      
      days.push({
        date: dateStr,
        day,
        sessions: sessionsForDay,
        isToday: isToday(dateStr),
        isSelected: dateStr === selectedDate
      });
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Lịch tập Yên Yoga</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá và đăng ký các lớp yoga phù hợp với lịch trình của bạn
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
          
          {/* Login status */}
          {!user && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-sm text-amber-700">
                💡 Bạn cần <a href="/login" className="font-medium text-amber-800 hover:text-amber-900 underline">đăng nhập</a> để đăng ký lớp học
            </p>
          </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-2xl mx-auto">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-800 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-100 overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{formatMonthYear(currentMonth)}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentMonth(new Date(today.getFullYear(), today.getMonth()))}
                      className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium"
                    >
                      Hôm nay
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="text-gray-600">Đang tải lịch tập...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                        <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays().map((day, index) => (
                        <div key={index} className="aspect-square">
                          {day ? (
                            <button
                              onClick={() => setSelectedDate(day.date)}
                              className={`w-full h-full rounded-xl p-2 transition-all duration-200 hover:scale-105 ${
                                day.isSelected
                                  ? 'bg-primary-500 text-white shadow-lg'
                                  : day.isToday
                                  ? 'bg-accent-100 text-accent-800 border-2 border-accent-400'
                                  : day.sessions.length > 0
                                  ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                                  : 'text-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              <div className="text-sm font-semibold">{day.day}</div>
                              {day.sessions.length > 0 && (
                                <div className={`text-xs mt-1 ${
                                  day.isSelected ? 'text-white' : 'text-primary-600'
                                }`}>
                                  {day.sessions.length} lớp
                                </div>
                              )}
                            </button>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
          </div>

            {/* Quick Week View */}
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">7 ngày tới</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {getNextWeekDates().map((date, index) => {
                  const dateStr = formatDate(date);
                  const sessionsCount = getSessionsForDate(dateStr).length;
                  const isSelected = dateStr === selectedDate;
                  const isTodayDate = isToday(dateStr);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                        isSelected
                          ? 'bg-primary-500 text-white shadow-lg'
                          : isTodayDate
                          ? 'bg-accent-100 text-accent-800 border-2 border-accent-400'
                          : 'bg-gray-50 text-gray-700 hover:bg-primary-50'
                      }`}
                    >
                      <div className="text-sm font-semibold">{formatDisplayDate(date)}</div>
                      <div className={`text-xs mt-1 ${
                        isSelected ? 'text-white' : 'text-primary-600'
                      }`}>
                        {sessionsCount} lớp
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sessions for selected date */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-100 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-6 py-4">
                <h3 className="text-xl font-bold">
                  {new Date(selectedDate).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </h3>
              </div>

              <div className="p-6">
                {filteredSessions.length > 0 ? (
                  <div className="space-y-4">
                {filteredSessions.map((session) => {
                      const isRegistered = userRegistrations.includes(session.id);
                  const isFull = session.registeredCount >= session.capacity;
                      const timeInfo = checkSessionCancellationTime(session.date, session.startTime);
                      const canRegister = user && (!isFull || isRegistered);
                      const canCancel = isRegistered && timeInfo.canCancel;

                  return (
                    <div
                      key={session.id}
                          className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-200 hover:border-primary-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-gray-900 text-lg leading-tight">
                              {session.className}
                            </h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[session.difficulty as DifficultyLevel]}`}>
                              {difficultyLabels[session.difficulty as DifficultyLevel]}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {session.instructor}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {session.startTime} - {session.endTime}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {session.registeredCount}/{session.capacity} người
                              {isFull && !isRegistered && <span className="ml-1 text-red-500">(Đầy)</span>}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Đã đăng ký</span>
                              <span>{Math.round((session.registeredCount / session.capacity) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  isFull ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-primary-400 to-primary-600'
                                }`}
                                style={{ width: `${Math.min((session.registeredCount / session.capacity) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>

                          {isRegistered && (
                            <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-2">
                              <p className="text-xs text-green-700 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Bạn đã đăng ký lớp này
                              </p>
                        </div>
                          )}

                          <button
                            onClick={() => handleRegisterClick(session)}
                            disabled={!canRegister || actionLoading || (isRegistered && !canCancel)}
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                              !user
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : isRegistered
                                ? canCancel
                                  ? 'bg-red-500 hover:bg-red-600 text-white'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : isFull
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary-500 hover:bg-primary-600 text-white hover:scale-105'
                            }`}
                            title={isRegistered && !canCancel ? `Chỉ được hủy trước 1 tiếng. ${timeInfo.timeUntilSessionText}` : ''}
                          >
                            {!user
                              ? 'Cần đăng nhập'
                              : isRegistered
                              ? canCancel
                              ? 'Hủy đăng ký' 
                                : 'Không thể hủy'
                              : isFull 
                              ? 'Đã đầy' 
                              : 'Đăng ký'}
                          </button>
                        </div>
                      );
                    })}
                      </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                    </div>
                    <p className="text-gray-500">Không có lớp học nào trong ngày này</p>
                    <p className="text-sm text-gray-400 mt-1">Hãy chọn ngày khác để xem lịch tập</p>
              </div>
            )}
              </div>
            </div>
          </div>
        </div>

        {/* Registration Popup */}
        <RegistrationPopup
          session={selectedSession}
          isOpen={showPopup}
          onClose={() => {
            setShowPopup(false);
            setSelectedSession(null);
          }}
          onConfirm={handleRegistrationConfirm}
          isRegistered={selectedSession ? userRegistrations.includes(selectedSession.id) : false}
          loading={actionLoading}
        />
      </div>
    </div>
  );
}