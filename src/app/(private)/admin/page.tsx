import AdminLayout from '@/components/admin/AdminLayout';

const stats = [
  { name: 'Tổng thành viên', stat: '127', change: '+12', changeType: 'increase' },
  { name: 'Lớp học hoạt động', stat: '8', change: '+2', changeType: 'increase' },
  { name: 'Ca tập hôm nay', stat: '6', change: '0', changeType: 'unchanged' },
  { name: 'Doanh thu tháng', stat: '45.2M', change: '+4.5%', changeType: 'increase' },
];

const recentActivities = [
  {
    id: 1,
    user: 'Nguyễn Thị Lan',
    action: 'đã đăng ký',
    target: 'Hatha Yoga Cơ bản',
    time: '5 phút trước',
  },
  {
    id: 2,
    user: 'Trần Văn Minh',
    action: 'đã hủy đăng ký',
    target: 'Vinyasa Flow',
    time: '15 phút trước',
  },
  {
    id: 3,
    user: 'Lê Thị Hoa',
    action: 'đã tham gia',
    target: 'Power Yoga',
    time: '1 giờ trước',
  },
  {
    id: 4,
    user: 'Phạm Quang Huy',
    action: 'đã đăng ký gói',
    target: 'Gói Premium',
    time: '2 giờ trước',
  },
];

const upcomingSessions = [
  {
    id: 1,
    className: 'Hatha Yoga Cơ bản',
    instructor: 'Nguyễn Thị Hương',
    time: '18:00 - 19:30',
    registered: 12,
    capacity: 15,
  },
  {
    id: 2,
    className: 'Vinyasa Flow',
    instructor: 'Trần Văn Nam',
    time: '19:45 - 21:00',
    registered: 8,
    capacity: 12,
  },
  {
    id: 3,
    className: 'Yin Yoga',
    instructor: 'Lê Thị Mai',
    time: '20:00 - 21:30',
    registered: 6,
    capacity: 10,
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan Yên Yoga</h1>
          <p className="mt-3 text-lg text-gray-600">
            Thống kê tổng quan về hoạt động của studio yoga
          </p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.name} className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-primary-100 px-6 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-200">
              <dt>
                <p className="truncate text-sm font-semibold text-secondary-600 uppercase tracking-wide">{item.name}</p>
              </dt>
              <dd className="flex items-baseline mt-3">
                <p className="text-3xl font-bold text-gray-900">{item.stat}</p>
                <p
                  className={`ml-3 flex items-baseline text-sm font-semibold ${
                    item.changeType === 'increase'
                      ? 'text-primary-600'
                      : item.changeType === 'decrease'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {item.changeType === 'increase' && (
                    <svg
                      className="h-4 w-4 flex-shrink-0 self-center text-primary-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {item.changeType === 'decrease' && (
                    <svg
                      className="h-4 w-4 flex-shrink-0 self-center text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="sr-only">
                    {item.changeType === 'increase' ? 'Tăng' : 'Giảm'} so với tháng trước
                  </span>
                  {item.change}
                </p>
              </dd>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activities */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h3>
              </div>
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-primary-100/50">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                            <span className="text-primary-700 font-semibold text-sm">
                              {activity.user.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold text-primary-700">{activity.user}</span>{' '}
                            {activity.action}{' '}
                            <span className="font-semibold text-secondary-700">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Ca tập hôm nay</h3>
              </div>
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-primary-100/50">
                  {upcomingSessions.map((session) => (
                    <li key={session.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {session.className}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="text-primary-600 font-medium">{session.instructor}</span> • {session.time}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                            {session.registered}/{session.capacity} người
                          </div>
                          <p className="text-xs text-gray-500 mt-1">đăng ký</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
