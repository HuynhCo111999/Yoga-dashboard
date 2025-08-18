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
  }
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

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState('2024-01-22');
  const [registeredSessions, setRegisteredSessions] = useState<number[]>([]);

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

  return (
    <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Lịch học Yoga</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Chọn ngày và đăng ký tham gia các lớp học yoga phù hợp với bạn.
            </p>
          </div>

          {/* Date Selector */}
          <div className="mt-16">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
                {getNextWeekDates().map((date) => {
                  const dateStr = formatDate(date);
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`${
                        isSelected
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                    >
                      {formatDisplayDate(date)}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sessions List */}
          <div className="mt-8">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Không có lớp học nào trong ngày này.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredSessions.map((session) => {
                  const isRegistered = registeredSessions.includes(session.id);
                  const isFull = session.registeredCount >= session.capacity;
                  return (
                    <div
                      key={session.id}
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {session.className}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                difficultyColors[session.difficulty as keyof typeof difficultyColors]
                              }`}
                            >
                              {difficultyLabels[session.difficulty as keyof typeof difficultyLabels]}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                              {session.instructor}
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
                              {session.registeredCount}/{session.capacity} người
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleRegister(session.id)}
                            disabled={isFull && !isRegistered}
                            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                              isRegistered
                                ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                                : isFull
                                ? 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
                                : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            }`}
                          >
                            {isRegistered 
                              ? 'Hủy đăng ký' 
                              : isFull 
                              ? 'Đã đầy' 
                              : 'Đăng ký'
                            }
                          </button>
                        </div>
                      </div>
                      {isRegistered && (
                        <div className="mt-3 rounded-md bg-emerald-50 p-3">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-emerald-800">
                                Bạn đã đăng ký thành công lớp học này!
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

          {/* Legend */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Chú thích cấp độ:</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                  Cơ bản
                </span>
                <span className="text-sm text-gray-600">Phù hợp cho người mới bắt đầu</span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                  Trung cấp
                </span>
                <span className="text-sm text-gray-600">Cần có kinh nghiệm cơ bản</span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                  Nâng cao
                </span>
                <span className="text-sm text-gray-600">Dành cho người có kinh nghiệm</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
