

const memberData = {
  name: 'Nguyễn Thị Lan',
  email: 'lan.nguyen@email.com',
  membershipStatus: 'active',
  currentPackage: 'Gói Premium',
  remainingClasses: 8,
  joinDate: '2024-01-15',
  nextClass: {
    name: 'Hatha Yoga Cơ bản',
    instructor: 'Nguyễn Thị Hương',
    date: '2024-01-24',
    time: '18:00 - 19:30'
  }
};

const recentClasses = [
  {
    id: 1,
    name: 'Vinyasa Flow',
    instructor: 'Trần Văn Nam',
    date: '2024-01-20',
    status: 'attended'
  },
  {
    id: 2,
    name: 'Yin Yoga',
    instructor: 'Lê Thị Mai',
    date: '2024-01-18',
    status: 'attended'
  },
  {
    id: 3,
    name: 'Hatha Yoga Cơ bản',
    instructor: 'Nguyễn Thị Hương',
    date: '2024-01-16',
    status: 'attended'
  }
];

const upcomingClasses = [
  {
    id: 1,
    name: 'Hatha Yoga Cơ bản',
    instructor: 'Nguyễn Thị Hương',
    date: '2024-01-24',
    time: '18:00 - 19:30',
    status: 'registered'
  },
  {
    id: 2,
    name: 'Power Yoga',
    instructor: 'Phạm Minh Đức',
    date: '2024-01-26',
    time: '06:30 - 07:45',
    status: 'registered'
  }
];

export default function MemberDashboard() {
  return (
    <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Chào mừng, {memberData.name}!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Chúc bạn có những buổi tập yoga thật hiệu quả và tràn đầy năng lượng.
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Gói hiện tại
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {memberData.currentPackage}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Lớp còn lại
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {memberData.remainingClasses} lớp
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Ngày tham gia
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {new Date(memberData.joinDate).toLocaleDateString('vi-VN')}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-3 w-3 rounded-full ${
                      memberData.membershipStatus === 'active' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Trạng thái
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {memberData.membershipStatus === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Next class */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Lớp học tiếp theo
                </h3>
                {memberData.nextClass ? (
                  <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-emerald-900">
                          {memberData.nextClass.name}
                        </h4>
                        <p className="text-sm text-emerald-700">
                          Giảng viên: {memberData.nextClass.instructor}
                        </p>
                        <p className="text-sm text-emerald-700">
                          {new Date(memberData.nextClass.date).toLocaleDateString('vi-VN')} • {memberData.nextClass.time}
                        </p>
                      </div>
                      <div className="text-emerald-600">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Bạn chưa đăng ký lớp nào.</p>
                )}
                <div className="mt-4">
                  <a
                    href="/calendar"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Xem lịch học
                  </a>
                </div>
              </div>
            </div>

            {/* Upcoming classes */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Lớp đã đăng ký
                </h3>
                <div className="space-y-3">
                  {upcomingClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{cls.name}</p>
                        <p className="text-xs text-gray-500">
                          {cls.instructor} • {new Date(cls.date).toLocaleDateString('vi-VN')} • {cls.time}
                        </p>
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-xs">
                        Hủy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent classes */}
            <div className="bg-white shadow rounded-lg lg:col-span-2">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Lịch sử tham gia
                </h3>
                <div className="overflow-hidden">
                  <ul role="list" className="divide-y divide-gray-200">
                    {recentClasses.map((cls) => (
                      <li key={cls.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {cls.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {cls.instructor} • {new Date(cls.date).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Đã tham gia
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thao tác nhanh
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <a
                href="/calendar"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Đăng ký lớp mới
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Liên hệ hỗ trợ
              </a>
              <a
                href="/blog"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Đọc blog yoga
              </a>
            </div>
          </div>
        </div>
    </div>
  );
}
