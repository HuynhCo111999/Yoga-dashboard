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
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tổng quan</h1>
          <p className="mt-2 text-sm text-gray-700">
            Thống kê tổng quan về hoạt động của studio yoga.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.name} className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6">
              <dt>
                <p className="truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.changeType === 'increase'
                      ? 'text-emerald-600'
                      : item.changeType === 'decrease'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {item.changeType === 'increase' && (
                    <svg
                      className="h-4 w-4 flex-shrink-0 self-center text-emerald-500"
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activities */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Hoạt động gần đây</h3>
              <div className="mt-6 flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-emerald-600 font-medium text-sm">
                              {activity.user.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span>{' '}
                            {activity.action}{' '}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Ca tập hôm nay</h3>
              <div className="mt-6 flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                  {upcomingSessions.map((session) => (
                    <li key={session.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.className}
                          </p>
                          <p className="text-sm text-gray-500">
                            {session.instructor} • {session.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">
                            {session.registered}/{session.capacity}
                          </p>
                          <p className="text-xs text-gray-500">người đăng ký</p>
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
