export default function About() {
  return (
    <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Về chúng tôi</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Yoga Studio là một không gian dành riêng cho những người yêu thích yoga và mong muốn 
              tìm thấy sự cân bằng trong cuộc sống. Chúng tôi tin rằng yoga không chỉ là một bài tập thể dục, 
              mà là một hành trình khám phá bản thân và kết nối với cộng đồng.
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
            <div className="relative lg:order-last lg:col-span-5">
              <svg
                className="absolute -top-[40rem] left-1 -z-10 h-[64rem] w-[175.5rem] -translate-x-1/2 stroke-gray-900/10 [mask-image:radial-gradient(64rem_64rem_at_111.5rem_0%,white,transparent)]"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="e87443c8-56e4-4c20-9111-55b82fa704e3"
                    width={200}
                    height={200}
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M0.5 0V200M200 0.5L0 0.499983" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" strokeWidth={0} fill="url(#e87443c8-56e4-4c20-9111-55b82fa704e3)" />
              </svg>
              <figure className="border-l border-emerald-600 pl-8">
                <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                  <p>
                    &ldquo;Yoga là ánh sáng, một khi thắp lên sẽ không bao giờ tắt. 
                    Thực hành càng tốt, ngọn lửa càng sáng hơn.&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-8 flex gap-x-4">
                  <div className="text-sm leading-6">
                    <div className="font-semibold text-gray-900">B.K.S. Iyengar</div>
                    <div className="text-gray-600">Guru Yoga nổi tiếng thế giới</div>
                  </div>
                </figcaption>
              </figure>
            </div>
            <div className="max-w-xl text-base leading-7 text-gray-700 lg:col-span-7">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Câu chuyện của chúng tôi</h3>
              <p>
                Được thành lập vào năm 2020, Yoga Studio ra đời từ niềm đam mê chia sẻ những lợi ích 
                tuyệt vời của yoga đến với cộng đồng. Chúng tôi bắt đầu với một studio nhỏ và giờ đây 
                đã phát triển thành một cộng đồng gồm hơn 500 thành viên.
              </p>
              <p className="mt-6">
                Đội ngũ giảng viên của chúng tôi đều được đào tạo chuyên nghiệp với các chứng chỉ 
                quốc tế từ Yoga Alliance, Iyengar Yoga và nhiều trường phái yoga khác. Mỗi giảng viên 
                đều mang đến phong cách riêng và kinh nghiệm phong phú.
              </p>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">Sứ mệnh của chúng tôi</h3>
              <ul role="list" className="mt-6 max-w-xl space-y-4 text-gray-600">
                <li className="flex gap-x-3">
                  <span className="text-emerald-600 font-bold">•</span>
                  Tạo ra một không gian an toàn và hỗ trợ cho mọi người thực hành yoga
                </li>
                <li className="flex gap-x-3">
                  <span className="text-emerald-600 font-bold">•</span>
                  Chia sẻ kiến thức và kỹ năng yoga một cách chân thành và chuyên nghiệp
                </li>
                <li className="flex gap-x-3">
                  <span className="text-emerald-600 font-bold">•</span>
                  Xây dựng cộng đồng yoga kết nối và hỗ trợ lẫn nhau
                </li>
                <li className="flex gap-x-3">
                  <span className="text-emerald-600 font-bold">•</span>
                  Giúp mọi người tìm thấy sự cân bằng và hạnh phúc trong cuộc sống
                </li>
              </ul>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">Các lớp học của chúng tôi</h3>
              <p>
                Chúng tôi cung cấp đa dạng các lớp học từ cơ bản đến nâng cao:
              </p>
              <ul role="list" className="mt-4 space-y-2 text-gray-600">
                <li>• Hatha Yoga - Phù hợp cho người mới bắt đầu</li>
                <li>• Vinyasa Flow - Yoga động với nhịp thở</li>
                <li>• Yin Yoga - Yoga tĩnh, thư giãn sâu</li>
                <li>• Power Yoga - Yoga mạnh mẽ, tăng cường sức khỏe</li>
                <li>• Meditation - Thiền và thở</li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  );
}
