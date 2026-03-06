'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sessionsApi, Session, membersApi, packagesApi, Package } from '@/lib/api';
import { checkSessionCancellationTime } from '@/utils/sessionUtils';
import { checkPackageValidity, checkPackageValidityOnDate, formatPackageValidity } from '@/utils/packageUtils';
import Header from '@/components/Header';

// Types
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

const difficultyColors: Record<DifficultyLevel, string> = {
  beginner: 'bg-accent-100 text-accent-800',
  intermediate: 'bg-primary-100 text-primary-800',
  advanced: 'bg-secondary-100 text-secondary-800',
};

const difficultyLabels: Record<DifficultyLevel, string> = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-2xl shadow-xl max-w-md w-full'>
        <div className='p-6'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>{isRegistered ? 'Hủy đăng ký' : 'Xác nhận đăng ký'}</h3>

          <div className='mb-6'>
            <div className='bg-gray-50 rounded-lg p-4 mb-4'>
              <h4 className='font-semibold text-gray-900'>{session.className}</h4>
              <p className='text-sm text-gray-600 mt-1'>Giảng viên: {session.instructor}</p>
              <p className='text-sm text-gray-600'>
                Ngày: {new Date(session.date).toLocaleDateString('vi-VN')} • {session.startTime} - {session.endTime}
              </p>
              <p className='text-sm text-gray-600'>
                Sức chứa: {session.registeredCount}/{session.capacity} người
              </p>
            </div>

            {isRegistered ? (
              <div className='text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200'>
                <p className='text-sm'>⚠️ Việc hủy đăng ký cần được xác thực bởi admin. Bạn có chắc chắn muốn hủy đăng ký không?</p>
              </div>
            ) : (
              <div className='text-green-600 bg-green-50 p-3 rounded-lg border border-green-200'>
                <p className='text-sm'>✅ Bạn có chắc chắn muốn đăng ký lớp học này không?</p>
              </div>
            )}
          </div>

          <div className='flex space-x-3'>
            <button onClick={onClose} disabled={loading} className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50'>
              Hủy
            </button>
            <button onClick={onConfirm} disabled={loading} className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${isRegistered ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'}`}>
              {loading ? 'Đang xử lý...' : isRegistered ? 'Xác nhận hủy' : 'Xác nhận đăng ký'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CalendarClientPage() {
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
  const [packageValidity, setPackageValidity] = useState<string | null>(null);
  const [packageExpiryDateStr, setPackageExpiryDateStr] = useState<string | null>(null);
  const [canRegisterOnDate, setCanRegisterOnDate] = useState<boolean | null>(null);

  useEffect(() => {
    loadSessions();
  }, [currentMonth]);

  useEffect(() => {
    if (user) {
      loadUserRegistrations();
      loadPackageValidity();
    }
  }, [user]);

  // Recompute package validity when the selected date changes
  useEffect(() => {
    if (user) {
      loadPackageValidity();
    }
  }, [selectedDate, user]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Debug authentication
      console.log('Loading sessions, user:', user?.email, 'uid:', user?.uid);

      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      console.log('Date range:', startDate.toISOString().split('T')[0], 'to', endDate.toISOString().split('T')[0]);

      const result = await sessionsApi.getSessionsByDateRange(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);

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
    if (!user || !user.email) {
      setUserRegistrations([]);
      return;
    }

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
      sessions.forEach((session) => {
        const userRegistration = session.registrations.find((reg) => reg.memberId === memberId && reg.status === 'confirmed');
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

  const loadPackageValidity = async () => {
    if (!user || !user.email) {
      setPackageValidity(null);
      setPackageExpiryDateStr(null);
      setCanRegisterOnDate(null);
      return;
    }

    try {
      // Find member by email first
      const memberResult = await membersApi.getMemberByEmail(user.email);
      if (!memberResult.success || !memberResult.data) {
        setPackageValidity(null);
        return;
      }

      const member = memberResult.data;
      if (!member.currentPackage) {
        setPackageValidity('Chưa có gói tập');
        return;
      }

      // Get package information
      const packageResult = await packagesApi.getById(member.currentPackage);
      if (!packageResult.success || !packageResult.data) {
        setPackageValidity('Không tìm thấy thông tin gói tập');
        return;
      }

      // Check package validity as of today (summary)
      const validity = checkPackageValidity(member, packageResult.data as Package);
      setPackageValidity(formatPackageValidity(validity));
      // Store expiry date string for calendar disabling
      if (validity.expiryDate) {
        const y = validity.expiryDate.getFullYear();
        const m = String(validity.expiryDate.getMonth() + 1).padStart(2, '0');
        const d = String(validity.expiryDate.getDate()).padStart(2, '0');
        setPackageExpiryDateStr(`${y}-${m}-${d}`);
      } else {
        setPackageExpiryDateStr(null);
      }

      // Check validity for selected date
      const validityOnDate = checkPackageValidityOnDate(member, packageResult.data as Package, selectedDate);
      setCanRegisterOnDate(validityOnDate.isValid);
    } catch (err) {
      console.error('Error loading package validity:', err);
      setPackageValidity('Lỗi khi kiểm tra gói tập');
    }
  };

  const filteredSessions = sessions.filter((session) => session.date === selectedDate);

  const handleRegisterClick = (session: Session) => {
    if (!user) {
      // Redirect to login page for guest users
      window.location.href = '/login';
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
          setSessions((prev) => prev.map((s) => (s.id === selectedSession.id ? result.data! : s)));
          setUserRegistrations((prev) => prev.filter((id) => id !== selectedSession.id));
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
          date: selectedSession.date,
        });

        const result = await sessionsApi.registerMemberForSession(registrationData);

        if (result.success && result.data) {
          console.log('✅ Registration successful:', result.data);
          // Update local state
          setSessions((prev) => prev.map((s) => (s.id === selectedSession.id ? result.data! : s)));
          setUserRegistrations((prev) => [...prev, selectedSession.id]);
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
      month: '2-digit',
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
    return sessions.filter((session) => session.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
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
      month: 'long',
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
      // Only disable dates by package for logged in users
      const isDisabledByPackage = user && packageExpiryDateStr ? dateStr > packageExpiryDateStr : false;
      const sessionsForDay = getSessionsForDate(dateStr);

      days.push({
        date: dateStr,
        day,
        sessions: sessionsForDay,
        isToday: isToday(dateStr),
        isSelected: dateStr === selectedDate,
        isDisabledByPackage,
      });
    }
    return days;
  };

  return (
    <div className='min-h-[100dvh] bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-float pointer-events-none"></div>

      <Header />
      
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10'>
        {/* Page Header */}
        <div className='text-center mb-16'>
          <span className="inline-block py-1.5 px-4 rounded-full bg-white border border-secondary-200 text-secondary-600 text-sm font-semibold tracking-wide mb-4 shadow-sm animate-fadeInUp">
            Lịch Tập Yoga
          </span>
          <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight animate-fadeInUp animate-delay-100'>
            Lên lịch cho <span className="gradient-text">sự bình yên</span>
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto animate-fadeInUp animate-delay-200'>
            Khám phá và đăng ký các lớp yoga phù hợp với lịch trình của bạn. Mọi hành trình đều bắt đầu từ một bước nhỏ.
          </p>

          {/* Login status */}
          {!user && (
            <div className='mt-8 bg-white/60 backdrop-blur-md border border-amber-200 shadow-lg rounded-2xl p-4 max-w-md mx-auto animate-fadeInUp animate-delay-300'>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className='text-sm text-gray-700 font-medium text-left'>
                  Bạn cần{' '}
                  <a href='/login' className='text-primary-600 hover:text-primary-700 font-bold underline decoration-2 underline-offset-2 transition-colors'>
                    đăng nhập
                  </a>{' '}
                  để đăng ký lớp học
                </p>
              </div>
            </div>
          )}

          {/* Package validity status */}
          {user && packageValidity && (
            <div className={`mt-8 backdrop-blur-md rounded-2xl p-4 max-w-md mx-auto shadow-lg animate-fadeInUp animate-delay-300 ${packageValidity?.includes('hết hạn') || packageValidity?.includes('Chưa có gói') ? 'bg-red-50/80 border border-red-200' : packageValidity?.includes('còn') && parseInt(packageValidity.match(/\d+/)?.[0] || '0') <= 7 ? 'bg-amber-50/80 border border-amber-200' : 'bg-green-50/80 border border-green-200'}`}>
              <div className="flex items-center justify-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${packageValidity?.includes('hết hạn') || packageValidity?.includes('Chưa có gói') ? 'bg-red-100 text-red-600' : packageValidity?.includes('còn') && parseInt(packageValidity.match(/\d+/)?.[0] || '0') <= 7 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className={`text-sm font-medium ${packageValidity?.includes('hết hạn') || packageValidity?.includes('Chưa có gói') ? 'text-red-700' : packageValidity?.includes('còn') && parseInt(packageValidity.match(/\d+/)?.[0] || '0') <= 7 ? 'text-amber-700' : 'text-green-700'}`}>
                  {packageValidity}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className='mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl max-w-2xl mx-auto shadow-md flex justify-between items-center animate-fadeInUp'>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={() => setError(null)} className='text-red-500 hover:text-red-700 transition-colors p-1 bg-red-100 rounded-full hover:bg-red-200'>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Calendar Area */}
          <div className='lg:col-span-2'>
            <div className='bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white overflow-hidden'>
              {/* Calendar Controls */}
              <div className='bg-gradient-to-r from-secondary-800 to-secondary-900 text-white px-8 py-6'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-2xl lg:text-3xl font-bold tracking-tight'>{formatMonthYear(currentMonth)}</h2>
                  <div className='flex items-center gap-3'>
                    <button onClick={() => navigateMonth('prev')} className='cursor-pointer p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all hover:scale-105 active:scale-95'>
                      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M15 19l-7-7 7-7' />
                      </svg>
                    </button>
                      <button onClick={() => setCurrentMonth(new Date(today.getFullYear(), today.getMonth()))} className='cursor-pointer px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all hover:scale-105 active:scale-95 text-sm font-semibold tracking-wide'>
                      Hôm nay
                    </button>
                    <button onClick={() => navigateMonth('next')} className='cursor-pointer p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all hover:scale-105 active:scale-95'>
                      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M9 5l7 7-7 7' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className='p-6'>
                {loading ? (
                  <div className='flex items-center justify-center h-64'>
                    <div className='flex items-center space-x-2'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
                      <span className='text-gray-600'>Đang tải lịch tập...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Day headers */}
                    <div className='grid grid-cols-7 gap-1 mb-4'>
                      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
                        <div key={day} className='text-center text-sm font-semibold text-gray-500 py-2'>
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className='grid grid-cols-7 gap-1'>
                      {generateCalendarDays().map((day, index) => (
                        <div key={index} className='aspect-square'>
                          {day ? (
                            <button
                              onClick={() => setSelectedDate(day.date)}
                              title={day.isDisabledByPackage ? 'Gói tập không còn hiệu lực vào ngày này' : ''}
                              className={`w-full h-full cursor-pointer rounded-xl p-2 transition-all duration-200 ${day.isDisabledByPackage ? 'bg-gray-100 text-gray-300' : 'hover:scale-105'} ${
                                day.isSelected ? 'bg-primary-500 text-white shadow-lg' : day.isToday ? 'bg-accent-100 text-accent-800 border-2 border-accent-400' : day.sessions.length > 0 ? 'bg-primary-50 text-primary-700 hover:bg-primary-100' : 'text-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              <div className='text-sm font-semibold'>{day.day}</div>
                              {day.sessions.length > 0 && <div className={`text-xs mt-1 ${day.isSelected ? 'text-white' : day.isDisabledByPackage ? 'text-gray-400' : 'text-primary-600'}`}>{day.sessions.length} lớp</div>}
                              {day.isDisabledByPackage && <div className='mt-1 text-[10px] font-medium text-gray-400'>Hết hạn</div>}
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
            <div className='mt-8 bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 sm:p-8'>
              <div className="flex items-center justify-between mb-6">
                <h3 className='text-xl font-bold text-gray-900'>7 Ngày Tới</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-6"></div>
              </div>
              
              <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4'>
                {getNextWeekDates().map((date, index) => {
                  const dateStr = formatDate(date);
                  const sessionsCount = getSessionsForDate(dateStr).length;
                  const isSelected = dateStr === selectedDate;
                  const isTodayDate = isToday(dateStr);

                  return (
                    <button 
                      key={index} 
                      onClick={() => setSelectedDate(dateStr)} 
                      className={`relative cursor-pointer overflow-hidden p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${isSelected ? 'shadow-[0_10px_20px_rgba(219,110,76,0.2)] border-transparent' : isTodayDate ? 'border-2 border-accent-300 bg-white/50 shadow-sm' : 'border border-gray-100 bg-white/50 hover:shadow-md hover:border-primary-100'}`}
                    >
                      {isSelected && <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600"></div>}
                      
                      <div className="relative z-10 flex flex-col h-full justify-between items-center text-center gap-2">
                        <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{formatDisplayDate(date).split(',')[0]}</div>
                        <div className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{date.getDate()}</div>
                        
                        <div className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${isSelected ? 'bg-white/20 text-white' : sessionsCount > 0 ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                          {sessionsCount} lớp
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sessions for selected date */}
          <div className='lg:col-span-1'>
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-100 overflow-hidden sticky top-8'>
              <div className='bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-6 py-4'>
                <h3 className='text-xl font-bold'>
                  {new Date(selectedDate).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </h3>
              </div>

              <div className='p-6'>
                {filteredSessions.length > 0 ? (
                  <div className='space-y-4'>
                    {filteredSessions.map((session) => {
                      const isRegistered = userRegistrations.includes(session.id);
                      const isFull = session.registeredCount >= session.capacity;
                      const timeInfo = checkSessionCancellationTime(session.date, session.startTime);
                      const canRegister = user && (!isFull || isRegistered) && (canRegisterOnDate ?? true);
                      const canCancel = isRegistered && timeInfo.canCancel;

                      return (
                        <div key={session.id} className='group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden'>
                          {/* Top decorative gradient line */}
                          <div className={`absolute top-0 left-0 w-full h-1 ${isFull && !isRegistered ? 'bg-red-400' : 'bg-primary-400'}`}></div>
                          
                          <div className='flex items-start justify-between mb-4 mt-2'>
                            <h4 className='font-bold text-gray-900 text-xl leading-tight group-hover:text-primary-600 transition-colors'>{session.className}</h4>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${difficultyColors[session.difficulty as DifficultyLevel]}`}>{difficultyLabels[session.difficulty as DifficultyLevel]}</span>
                          </div>

                          <div className='space-y-3 mb-6 bg-gray-50/50 rounded-xl p-4 border border-gray-100/50'>
                            <div className='flex items-center text-sm text-gray-700'>
                              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm text-primary-500">
                                <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                </svg>
                              </div>
                              <span className="font-medium">{session.instructor}</span>
                            </div>
                            <div className='flex items-center text-sm text-gray-700'>
                              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm text-primary-500">
                                <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                              </div>
                              {session.startTime} - {session.endTime}
                            </div>
                            <div className='flex items-center text-sm text-gray-700'>
                              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm text-primary-500">
                                <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                                </svg>
                              </div>
                              <span className="flex-1">
                                {session.registeredCount}/{session.capacity} học viên
                                {isFull && !isRegistered && <span className='ml-2 text-red-500 font-bold badge bg-red-50 px-2 py-0.5 rounded text-[10px] uppercase'>Đã đầy</span>}
                                {!isFull && <span className="text-gray-400 ml-1">({session.capacity - session.registeredCount} chỗ trống)</span>}
                              </span>
                            </div>
                          </div>

                          <div className='mb-5'>
                            <div className='flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2'>
                              <span>Sức chứa</span>
                              <span className={isFull ? 'text-red-500' : 'text-primary-600'}>{Math.round((session.registeredCount / session.capacity) * 100)}%</span>
                            </div>
                            <div className='w-full bg-gray-100 rounded-full h-1.5 overflow-hidden'>
                              <div className={`h-1.5 rounded-full transition-all duration-700 ease-out ${isFull ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-primary-300 to-primary-500'}`} style={{ width: `${Math.min((session.registeredCount / session.capacity) * 100, 100)}%` }}></div>
                            </div>
                          </div>

                          {/* Registration status for logged in users */}
                          {user && isRegistered && (
                            <div className='mb-4 bg-green-50/50 border border-green-200/60 rounded-xl p-3 flex items-start'>
                              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 mt-0.5 mr-2">
                                <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
                                  <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                </svg>
                              </div>
                              <p className='text-sm text-green-800 font-medium'>
                                Tuyệt vời! Bạn đã đăng ký lớp này.
                              </p>
                            </div>
                          )}

                          {/* Login prompt for guests */}
                          {!user && (
                            <div className='mb-4 bg-secondary-50 border border-secondary-200 rounded-xl p-3 flex items-start group/login cursor-pointer' onClick={() => window.location.href = '/login'}>
                              <div className="w-5 h-5 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 shrink-0 mt-0.5 mr-2 group-hover/login:scale-110 transition-transform">
                                <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className='text-xs text-secondary-800 font-medium'>Đăng nhập để đăng ký lớp</p>
                                <span className='text-[10px] text-secondary-500 font-bold uppercase tracking-wider group-hover/login:text-secondary-700 transition-colors'>Tới trang đăng nhập →</span>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => handleRegisterClick(session)}
                            disabled={!canRegister || actionLoading || (isRegistered && !canCancel)}
                            className={`w-full cursor-pointer py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 ${
                              !user 
                                ? 'bg-secondary-800 hover:bg-secondary-900 text-white hover:shadow-lg' 
                                : isRegistered 
                                  ? (canCancel ? 'bg-white border-2 border-red-100 hover:border-red-500 text-red-600 hover:bg-red-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed') 
                                  : isFull 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'btn-shine bg-primary-600 hover:bg-primary-700 text-white shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.23)]'
                            }`}
                            title={!user ? 'Nhấn để đăng nhập' : isRegistered && !canCancel ? `Chỉ được hủy trước 1 tiếng. ${timeInfo.timeUntilSessionText}` : canRegisterOnDate === false ? 'Gói tập không còn hiệu lực vào ngày này' : ''}
                          >
                            {!user ? 'Đăng nhập ngay' : isRegistered ? (canCancel ? 'Hủy đăng ký' : 'Đã quá thời gian hủy') : isFull ? 'Lớp đã đầy' : canRegisterOnDate === false ? 'Gói tập hết hạn' : 'Đăng ký học'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='text-center py-12'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <svg className='w-8 h-8 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                    </div>
                    <p className='text-gray-500'>Không có lớp học nào trong ngày này</p>
                    <p className='text-sm text-gray-400 mt-1'>Hãy chọn ngày khác để xem lịch tập</p>
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
