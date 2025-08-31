'use client';

import { useState } from 'react';

// Mock data for sessions
const sessions = [
  {
    id: 1,
    className: 'Hatha Yoga Cơ bản',
    instructor: 'Nguyễn Thị Hương',
    date: '2024-01-22',
    startTime: '07:00',
    endTime: '08:30',
    capacity: 15,
    registeredCount: 8,
    difficulty: 'beginner',
    status: 'scheduled'
  },
  {
    id: 2,
    className: 'Vinyasa Flow',
    instructor: 'Trần Văn Nam',
    date: '2024-01-22',
    startTime: '18:30',
    endTime: '20:00',
    capacity: 12,
    registeredCount: 12,
    difficulty: 'intermediate',
    status: 'scheduled'
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
    difficulty: 'beginner',
    status: 'scheduled'
  },
  {
    id: 4,
    className: 'Power Yoga',
    instructor: 'Phạm Minh Đức',
    date: '2024-01-24',
    startTime: '06:30',
    endTime: '07:45',
    capacity: 8,
    registeredCount: 5,
    difficulty: 'advanced',
    status: 'scheduled'
  },
  {
    id: 5,
    className: 'Hatha Yoga Cơ bản',
    instructor: 'Nguyễn Thị Hương',
    date: '2024-01-24',
    startTime: '18:00',
    endTime: '19:30',
    capacity: 15,
    registeredCount: 11,
    difficulty: 'beginner',
    status: 'scheduled'
  },
  {
    id: 6,
    className: 'Prenatal Yoga',
    instructor: 'Lê Thị Mai',
    date: '2024-01-25',
    startTime: '16:00',
    endTime: '17:15',
    capacity: 6,
    registeredCount: 4,
    difficulty: 'beginner',
    status: 'scheduled'
  },
  // More sessions for better calendar view
  {
    id: 7,
    className: 'Morning Flow',
    instructor: 'Nguyễn Thị Hương',
    date: '2024-01-26',
    startTime: '07:00',
    endTime: '08:00',
    capacity: 12,
    registeredCount: 7,
    difficulty: 'intermediate',
    status: 'scheduled'
  },
  {
    id: 8,
    className: 'Restorative Yoga',
    instructor: 'Lê Thị Mai',
    date: '2024-01-27',
    startTime: '19:30',
    endTime: '21:00',
    capacity: 8,
    registeredCount: 5,
    difficulty: 'beginner',
    status: 'scheduled'
  },
  {
    id: 9,
    className: 'Hot Yoga',
    instructor: 'Phạm Minh Đức',
    date: '2024-01-28',
    startTime: '18:00',
    endTime: '19:15',
    capacity: 10,
    registeredCount: 8,
    difficulty: 'advanced',
    status: 'scheduled'
  },
  {
    id: 10,
    className: 'Weekend Workshop',
    instructor: 'Trần Văn Nam',
    date: '2024-01-28',
    startTime: '09:00',
    endTime: '11:00',
    capacity: 20,
    registeredCount: 15,
    difficulty: 'intermediate',
    status: 'scheduled'
  },
  {
    id: 11,
    className: 'Gentle Yoga',
    instructor: 'Nguyễn Thị Hương',
    date: '2024-01-29',
    startTime: '16:00',
    endTime: '17:00',
    capacity: 15,
    registeredCount: 10,
    difficulty: 'beginner',
    status: 'scheduled'
  },
  {
    id: 12,
    className: 'Advanced Ashtanga',
    instructor: 'Phạm Minh Đức',
    date: '2024-01-30',
    startTime: '06:00',
    endTime: '07:30',
    capacity: 6,
    registeredCount: 4,
    difficulty: 'advanced',
    status: 'scheduled'
  }
];

const difficultyColors = {
  beginner: 'bg-accent-100 text-accent-800',
  intermediate: 'bg-primary-100 text-primary-800',
  advanced: 'bg-secondary-100 text-secondary-800'
};

const difficultyLabels = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao'
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState('2024-01-22');
  const [registeredSessions, setRegisteredSessions] = useState<number[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0)); // January 2024

  const filteredSessions = sessions.filter(session => session.date === selectedDate);

  const handleRegister = (sessionId: number) => {
    if (registeredSessions.includes(sessionId)) {
      setRegisteredSessions(registeredSessions.filter(id => id !== sessionId));
    } else {
      setRegisteredSessions([...registeredSessions, sessionId]);
    }
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date('2024-01-22'); // Mock today for demo
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
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

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be 6, Monday (1) to be 0
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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        dateStr,
        sessions: getSessionsForDate(dateStr)
      });
    }

    return days;
  };

  return (
    <div className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section with Calendar Wireframe */}
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">Lịch học Yên Yoga</h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              Chọn ngày và đăng ký tham gia các lớp học yoga phù hợp với bạn.
            </p>
          </div>

          {/* Monthly Calendar View */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg border border-secondary-200 overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-secondary-50 to-accent-50 px-4 py-4 sm:px-6 sm:py-5 border-b border-secondary-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="group p-2 sm:p-3 rounded-lg bg-white hover:bg-primary-50 text-secondary-600 hover:text-primary-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-secondary-200 hover:border-primary-300"
                    aria-label="Tháng trước"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 transform group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="text-center">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 capitalize">
                      {formatMonthYear(currentMonth)}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Lịch học hàng tháng</p>
                  </div>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="group p-2 sm:p-3 rounded-lg bg-white hover:bg-primary-50 text-secondary-600 hover:text-primary-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-secondary-200 hover:border-primary-300"
                    aria-label="Tháng sau"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-3 sm:p-4 lg:p-6">
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
                    <div key={day} className={`py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold rounded-lg ${
                      index === 6 ? 'text-primary-600 bg-primary-50' : 'text-gray-700 bg-gray-50'
                    }`}>
                      <span className="hidden sm:inline">
                        {index === 0 ? 'Thứ 2' : index === 1 ? 'Thứ 3' : index === 2 ? 'Thứ 4' : 
                         index === 3 ? 'Thứ 5' : index === 4 ? 'Thứ 6' : index === 5 ? 'Thứ 7' : 'CN'}
                      </span>
                      <span className="sm:hidden">{day}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {generateCalendarDays().map((dayData, index) => (
                    <div
                      key={index}
                      className={`relative h-16 sm:h-20 lg:h-24 rounded-lg sm:rounded-xl border border-gray-200 sm:border-2 transition-all duration-200 ${
                        dayData 
                          ? selectedDate === dayData.dateStr
                            ? 'border-primary-500 bg-primary-50 shadow-md cursor-pointer'
                            : isToday(dayData.dateStr)
                            ? 'border-accent-300 bg-accent-50 hover:bg-accent-100 cursor-pointer shadow-sm'
                            : dayData.sessions.length > 0
                            ? 'border-secondary-200 bg-white hover:bg-secondary-50 cursor-pointer hover:shadow-md hover:border-secondary-300'
                            : 'border-gray-200 bg-white hover:bg-gray-50 cursor-pointer hover:border-gray-300'
                          : 'border-transparent bg-gray-50'
                      }`}
                      onClick={() => dayData && setSelectedDate(dayData.dateStr)}
                    >
                      {dayData && (
                        <>
                          <div className={`p-1 sm:p-2 ${
                            selectedDate === dayData.dateStr 
                              ? 'text-primary-700' 
                              : isToday(dayData.dateStr)
                              ? 'text-accent-800'
                              : 'text-gray-900'
                          }`}>
                            <span className="text-xs sm:text-sm font-semibold">{dayData.day}</span>
                            {selectedDate === dayData.dateStr && (
                              <div className="w-4 sm:w-6 h-0.5 bg-primary-500 rounded-full mt-1"></div>
                            )}
                            {isToday(dayData.dateStr) && selectedDate !== dayData.dateStr && (
                              <div className="w-4 sm:w-6 h-0.5 bg-accent-400 rounded-full mt-1"></div>
                            )}
                          </div>
                          {dayData.sessions.length > 0 && (
                            <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2">
                              <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-center">
                                {dayData.sessions.slice(0, 2).map((session, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shadow-sm ${
                                      session.difficulty === 'beginner' ? 'bg-accent-500' :
                                      session.difficulty === 'intermediate' ? 'bg-primary-500' : 'bg-secondary-500'
                                    }`}
                                    title={`${session.className} - ${session.startTime}`}
                                  />
                                ))}
                                {dayData.sessions.length > 2 && (
                                  <div className="flex items-center">
                                    <span className="text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-1 py-0.5 leading-none">
                                      +{dayData.sessions.length - 2}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {dayData.sessions.length === 1 && (
                                <div className="mt-1 text-center">
                                  <span className="text-xs text-gray-600 font-medium truncate block">
                                    {dayData.sessions[0].startTime}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Calendar Legend */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-secondary-50 rounded-xl border border-gray-200">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 text-center">Chú thích cấp độ lớp học</h4>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm">
                    <div className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg shadow-sm">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-accent-500 shadow-sm"></div>
                      <span className="font-medium text-gray-700">Cơ bản</span>
                    </div>
                    <div className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg shadow-sm">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary-500 shadow-sm"></div>
                      <span className="font-medium text-gray-700">Trung cấp</span>
                    </div>
                    <div className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg shadow-sm">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-secondary-500 shadow-sm"></div>
                      <span className="font-medium text-gray-700">Nâng cao</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selector - Quick Week View */}
          <div className="mt-12 sm:mt-16">
            <div className="bg-white rounded-2xl shadow-lg border border-secondary-200 overflow-hidden">
              <div className="bg-gradient-to-r from-secondary-50 to-accent-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-secondary-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 text-center">Xem nhanh 7 ngày tới</h3>
              </div>
              <div className="p-3 sm:p-4">
                <nav className="flex space-x-1 sm:space-x-2 justify-start sm:justify-center overflow-x-auto pb-2 sm:pb-0" aria-label="Date selector">
                {getNextWeekDates().map((date) => {
                  const dateStr = formatDate(date);
                  const isSelected = selectedDate === dateStr;
                    const sessionsCount = getSessionsForDate(dateStr).length;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                        className={`relative flex-shrink-0 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                        isSelected
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                            : 'bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-center min-w-0">
                          <div className="font-semibold whitespace-nowrap">{formatDisplayDate(date)}</div>
                          {sessionsCount > 0 && (
                            <div className={`mt-1 text-xs px-1.5 py-0.5 sm:px-2 rounded-full ${
                              isSelected 
                                ? 'bg-white text-primary-600' 
                                : 'bg-primary-100 text-primary-700'
                            }`}>
                              {sessionsCount} lớp
                            </div>
                          )}
                        </div>
                    </button>
                  );
                })}
              </nav>
              </div>
            </div>
          </div>

          {/* Sessions List */}
          <div className="mt-6 sm:mt-8">
            <div className="bg-white rounded-2xl shadow-lg border border-secondary-200 overflow-hidden">
              <div className="bg-gradient-to-r from-secondary-50 to-accent-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-secondary-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 text-center">
                  Lớp học ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
                </h3>
              </div>
              <div className="p-4 sm:p-6">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Chưa có lớp học</h4>
                    <p className="text-sm sm:text-base text-gray-500">Không có lớp học nào được lên lịch trong ngày này.</p>
              </div>
            ) : (
                  <div className="space-y-3 sm:space-y-4">
                {filteredSessions.map((session) => {
                  const isRegistered = registeredSessions.includes(session.id);
                  const isFull = session.registeredCount >= session.capacity;
                  return (
                    <div
                      key={session.id}
                          className="relative rounded-xl border-2 border-secondary-200 bg-white px-4 py-4 sm:px-6 sm:py-5 shadow-sm hover:border-primary-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                              {session.className}
                            </h3>
                            <span
                              className={`self-start sm:self-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                difficultyColors[session.difficulty as keyof typeof difficultyColors]
                              }`}
                            >
                              {difficultyLabels[session.difficulty as keyof typeof difficultyLabels]}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                              {session.instructor}
                            </span>
                            <span className="flex items-center">
                              <svg className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {session.startTime} - {session.endTime}
                            </span>
                            <span className="flex items-center">
                              <svg className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                              </svg>
                              {session.registeredCount}/{session.capacity} người
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-full sm:w-auto">
                          <button
                            onClick={() => handleRegister(session.id)}
                            disabled={isFull && !isRegistered}
                            className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 sm:px-6 sm:py-3 border-2 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 cursor-pointer ${
                              isRegistered
                                ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 shadow-sm hover:shadow-md'
                                : isFull
                                ? 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed opacity-60'
                                : 'border-primary-300 text-primary-700 bg-primary-50 hover:bg-primary-100 hover:border-primary-400 shadow-sm hover:shadow-md'
                            }`}
                          >
                            {isRegistered ? (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Hủy đăng ký
                              </>
                            ) : isFull ? (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
                                </svg>
                                Đã đầy
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Đăng ký
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      {isRegistered && (
                        <div className="mt-4 rounded-xl bg-gradient-to-r from-accent-50 to-accent-100 p-4 border-2 border-accent-200 shadow-sm">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-semibold text-accent-800">
                                Đăng ký thành công!
                              </h4>
                              <p className="text-sm text-accent-700 mt-1">
                                Bạn đã đăng ký thành công lớp học này. Vui lòng đến đúng giờ.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
              </div>
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-secondary-200">
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Hướng dẫn đăng ký lớp học</h4>
              <p className="text-sm text-gray-600">Tìm hiểu về các cấp độ và cách đăng ký</p>
          </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-accent-50 rounded-xl border border-accent-200">
                <div className="w-3 h-3 bg-accent-500 rounded-full mx-auto mb-2"></div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-800 mb-2">
                  Cơ bản
                </span>
                <p className="text-xs text-gray-600">Phù hợp cho người mới bắt đầu</p>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-xl border border-primary-200">
                <div className="w-3 h-3 bg-primary-500 rounded-full mx-auto mb-2"></div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 mb-2">
                  Trung cấp
                </span>
                <p className="text-xs text-gray-600">Cần có kinh nghiệm cơ bản</p>
              </div>
              <div className="text-center p-4 bg-secondary-50 rounded-xl border border-secondary-200">
                <div className="w-3 h-3 bg-secondary-500 rounded-full mx-auto mb-2"></div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-secondary-100 text-secondary-800 mb-2">
                  Nâng cao
                </span>
                <p className="text-xs text-gray-600">Dành cho người có kinh nghiệm</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-primary-600 rounded-lg"></div>
                  <span>Ngày được chọn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-accent-100 border-2 border-accent-400 rounded-lg"></div>
                  <span>Hôm nay</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white border-2 border-secondary-300 rounded-lg"></div>
                  <span>Có lớp học</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
