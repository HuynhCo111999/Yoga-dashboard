'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'Khóa học yoga của Yên Yoga phù hợp với những ai?',
    answer:
      'Các khóa học yoga của Yên Yoga được thiết kế theo nhiều cấp độ: từ người mới bắt đầu, người đã tập một thời gian đến học viên nâng cao. Bạn có thể chọn lớp Hatha cơ bản, Vinyasa năng động, Yin yoga thư giãn hoặc các lớp phục hồi dành cho người đau lưng, dân văn phòng.',
  },
  {
    question: 'Thời lượng và lịch học của một khóa học yoga tại Yên Yoga như thế nào?',
    answer:
      'Một khóa học yoga tiêu chuẩn tại Yên Yoga thường kéo dài từ 4–8 tuần, mỗi tuần 2–3 buổi, mỗi buổi khoảng 60–75 phút. Lịch học linh hoạt sáng – trưa – tối để bạn dễ dàng sắp xếp công việc và sinh hoạt cá nhân.',
  },
  {
    question: 'Học phí khóa học yoga tại Yên Yoga là bao nhiêu?',
    answer:
      'Yên Yoga có nhiều gói khóa học yoga với mức phí khác nhau, từ gói cơ bản theo số buổi đến gói không giới hạn theo tháng. Học phí chi tiết được cập nhật ở trang Gói tập; bạn cũng có thể liên hệ trực tiếp Yên Yoga để nhận tư vấn và ưu đãi mới nhất.',
  },
  {
    question: 'Tôi là người mới, nên bắt đầu khóa học yoga nào tại Yên Yoga?',
    answer:
      'Nếu bạn là người mới, Yên Yoga khuyên nên bắt đầu với các khóa Hatha Yoga cơ bản hoặc lớp “Yoga cho người mới bắt đầu”. HLV sẽ hướng dẫn kỹ kỹ thuật hít thở, canh chỉnh tư thế và tốc độ phù hợp để bạn làm quen an toàn và hiệu quả.',
  },
  {
    question: 'Khóa học yoga của Yên Yoga có hỗ trợ thử buổi đầu không?',
    answer:
      'Yên Yoga thường xuyên có chương trình trải nghiệm buổi học yoga đầu tiên miễn phí hoặc ưu đãi cho học viên mới. Bạn có thể đăng ký qua trang Lịch học hoặc liên hệ trực tiếp để được sắp xếp buổi trải nghiệm phù hợp.',
  },
  {
    question: 'Tôi cần chuẩn bị gì khi tham gia khóa học yoga tại Yên Yoga?',
    answer:
      'Bạn chỉ cần mặc trang phục co giãn thoải mái, mang theo khăn nhỏ và bình nước cá nhân. Thảm tập yoga và dụng cụ hỗ trợ như block, strap, bolster sẽ được Yên Yoga chuẩn bị sẵn tại studio.',
  },
  {
    question: 'Tôi có thể bỏ lỡ buổi học trong khóa mà không bị mất buổi không?',
    answer:
      'Tùy theo gói khóa học yoga bạn đăng ký, Yên Yoga cho phép linh hoạt sắp xếp lại buổi nếu bạn báo trước trong khung thời gian quy định. Với một số gói, bạn có thể bù buổi trong thời hạn gói; chi tiết sẽ được tư vấn rõ trước khi đăng ký.',
  },
  {
    question: 'Khóa học yoga tại Yên Yoga có giới hạn số học viên trong lớp không?',
    answer:
      'Mỗi lớp học yoga tại Yên Yoga được giới hạn số lượng học viên để đảm bảo huấn luyện viên có thể quan sát và chỉnh sửa tư thế cho từng người. Thông thường, lớp cơ bản có 8–12 học viên, lớp chuyên sâu có thể ít hơn.',
  },
  {
    question: 'Tôi có thể đăng ký khóa học yoga online tại Yên Yoga không?',
    answer:
      'Ngoài các khóa học yoga trực tiếp tại studio, Yên Yoga có thể mở các khóa online theo từng giai đoạn hoặc theo nhóm riêng. Bạn hãy liên hệ trực tiếp Yên Yoga để được thông tin mới nhất về lịch mở khóa online.',
  },
  {
    question: 'Khóa học yoga của Yên Yoga có hỗ trợ tư vấn cá nhân không?',
    answer:
      'Trước khi tham gia khóa học yoga, bạn có thể được huấn luyện viên hoặc tư vấn viên trao đổi nhanh về tình trạng sức khỏe, mục tiêu luyện tập để chọn lớp phù hợp. Với một số gói, bạn còn được theo dõi và điều chỉnh lộ trình cá nhân hóa.',
  },
];

export default function FAQSection() {
  // Cho phép mở nhiều câu hỏi đồng thời
  const [openIndexes, setOpenIndexes] = useState<boolean[]>(() =>
    faqs.map((_, index) => index === 0),
  );

  return (
    <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 left-10 w-40 h-40 rounded-full bg-primary-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-10 w-52 h-52 rounded-full bg-accent-200/40 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/80 text-primary-600 text-sm font-semibold mb-4 border border-primary-100 shadow-sm">
            Câu hỏi thường gặp
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            FAQ về <span className="gradient-text">khóa học yoga của Yên Yoga</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Giải đáp những thắc mắc phổ biến về khóa học yoga tại Yên Yoga để bạn yên tâm lựa chọn hành trình luyện tập phù hợp.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid gap-4 md:grid-cols-2">
          {faqs.map((item, index) => {
            const isOpen = openIndexes[index];
            return (
              <div
                key={item.question}
                className="border border-white/70 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  type="button"
                  className="cursor-pointer w-full flex items-start justify-between gap-3 px-4 sm:px-5 py-4 text-left"
                  onClick={() =>
                    setOpenIndexes(prev => {
                      const next = [...prev];
                      next[index] = !next[index];
                      return next;
                    })
                  }
                >
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    {item.question}
                  </h3>
                  <span className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-sm flex-shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div
                  className={`px-4 sm:px-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 ${
                    isOpen ? 'pt-3 pb-2 block' : 'pt-0 hidden'
                  }`}
                  aria-hidden={!isOpen}
                >
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

