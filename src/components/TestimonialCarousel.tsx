'use client';

import { useState, useEffect, useCallback } from 'react';

const testimonials = [
  {
    initial: 'L',
    name: 'Lan Anh',
    age: 32,
    duration: 'Học lớp Hatha cơ bản tại Yên Yoga hơn 1 năm',
    short: 'Lớp Hatha buổi tối tại Yên Yoga giúp mình reset lại sau ngày dài. Không gian yên tĩnh, giáo trình rất dễ theo.',
    full: 'Sau giờ làm việc căng thẳng, mỗi buổi tối đến lớp Hatha cơ bản tại Yên Yoga giống như được reset lại hoàn toàn. Lớp học yên tĩnh, số lượng học viên vừa phải nên giảng viên luôn để ý chỉnh từng tư thế. Sau 3 tháng theo lớp, mình ngủ ngon hơn, ít đau mỏi vai gáy và cảm thấy yêu việc đi học yoga hơn mỗi ngày.',
    color: 'from-primary-400 to-primary-600',
    bg: 'from-primary-50 to-orange-50',
    accent: 'text-primary-600',
  },
  {
    initial: 'M',
    name: 'Minh Châu',
    age: 28,
    duration: 'Đang theo lớp Vinyasa Flow tại Yên Yoga hơn 8 tháng',
    short: 'Lớp Vinyasa Flow ở Yên Yoga giúp mình vừa đổ mồ hôi, vừa xả stress. Thầy cô luôn điều chỉnh động tác rất kỹ.',
    full: 'Mình đăng ký lớp Vinyasa Flow tại Yên Yoga với mục tiêu giảm stress sau sinh và siết dáng. Các giảng viên trong lớp luôn quan sát kỹ, điều chỉnh động tác phù hợp với từng thể trạng. Sau vài tháng học lớp này, mình thấy cơ thể linh hoạt hơn, tinh thần cũng nhẹ nhàng và tập yoga trở thành thói quen không thể thiếu.',
    color: 'from-accent-400 to-yellow-500',
    bg: 'from-accent-50 to-yellow-50',
    accent: 'text-accent-600',
  },
  {
    initial: 'T',
    name: 'Thanh Hà',
    age: 45,
    duration: 'Học lớp yoga trị liệu lưng tại Yên Yoga hơn 2 năm',
    short: 'Lớp yoga trị liệu lưng ở Yên Yoga giúp mình giảm hẳn đau lưng mãn tính. Bài tập nhẹ nhàng nhưng rất hiệu quả.',
    full: 'Ở tuổi 45 mình rất lo về vấn đề cột sống, nhưng lớp yoga trị liệu lưng tại Yên Yoga đã thay đổi mọi thứ. Giáo trình lớp học tập trung vào giãn cơ, kéo giãn cột sống và tăng sức mạnh vùng core. Giảng viên luôn nhắc mình lắng nghe cơ thể. Sau thời gian kiên trì theo lớp, mình hầu như không còn đau lưng mãn tính nữa.',
    color: 'from-secondary-400 to-secondary-600',
    bg: 'from-secondary-50 to-stone-50',
    accent: 'text-secondary-600',
  },
  {
    initial: 'H',
    name: 'Hoàng Nam',
    age: 35,
    duration: 'Tham gia lớp yoga buổi sáng tại Yên Yoga hơn 6 tháng',
    short: 'Lớp yoga buổi sáng ở Yên Yoga giúp mình khởi động ngày mới đầy năng lượng. Không khí lớp rất thoải mái.',
    full: 'Ban đầu mình nghĩ các lớp học yoga ở Yên Yoga chỉ hợp với nữ, nhưng sau khi thử lớp buổi sáng thì mình thay đổi hoàn toàn. Các bài tập kết hợp sức mạnh và giãn cơ khiến cơ thể tỉnh táo, sức bền tăng rõ rệt. Không gian lớp học dễ chịu, thầy cô thân thiện, phần thư giãn cuối buổi giúp mình bắt đầu ngày làm việc với tâm trạng rất nhẹ nhàng.',
    color: 'from-primary-300 to-accent-500',
    bg: 'from-orange-50 to-amber-50',
    accent: 'text-primary-500',
  },
];

const STARS = (
  <div className="flex gap-1 mb-3">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-4 h-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const n = testimonials.length;
  const prevIdx = (current - 1 + n) % n;
  const nextIdx = (current + 1) % n;

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 400);
    },
    [animating, current]
  );

  const prev = useCallback(() => goTo(prevIdx), [goTo, prevIdx]);
  const next = useCallback(() => goTo(nextIdx), [goTo, nextIdx]);

  // Auto-play
  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % n), 5000);
    return () => clearInterval(t);
  }, [current, goTo, n]);

  const center = testimonials[current];
  const left = testimonials[prevIdx];
  const right = testimonials[nextIdx];

  return (
    <div className="relative w-full">
      {/* Cards row — fixed height container to prevent layout shift */}
      <div className="flex items-center justify-center gap-3 lg:gap-5">

        {/* LEFT card */}
        <div
          className="hidden sm:block flex-shrink-0 w-56 lg:w-64 cursor-pointer"
          onClick={prev}
          role="button"
          aria-label={`Xem đánh giá của ${left.name}`}
        >
          <div className={`
            h-64 lg:h-72 rounded-2xl p-5 border border-gray-100 shadow-sm bg-gradient-to-br ${left.bg}
            flex flex-col justify-between
            opacity-50 scale-95 origin-right
            hover:opacity-60 transition-all duration-500
            ${animating ? 'opacity-30' : ''}
          `}>
            <div>
              {STARS}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">"{left.short}"</p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-gray-200/50">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${left.color} flex items-center justify-center flex-shrink-0 shadow`}>
                <span className="text-white font-bold text-sm">{left.initial}</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{left.name}</p>
                <p className="text-xs text-gray-400 truncate">{left.duration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER card */}
        <div className="flex-shrink-0 w-full sm:w-80 lg:w-[420px]">
          <div className={`
            relative rounded-3xl p-7 lg:p-8 border border-white shadow-2xl bg-gradient-to-br ${center.bg}
            overflow-hidden transition-all duration-500
            ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
          `}>
            {/* Large decorative quote */}
            <div className="absolute top-4 right-6 text-7xl font-serif text-primary-200/60 leading-none select-none pointer-events-none">
              "
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Quote text — fixed height to prevent layout shift */}
            <div className="h-28 lg:h-30 overflow-hidden relative z-10">
              <p className="text-gray-700 text-base leading-relaxed line-clamp-4">
                "{center.full}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 mt-5 pt-5 border-t border-black/5">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${center.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                <span className="text-white font-bold text-lg">{center.initial}</span>
              </div>
              <div>
                <p className="font-bold text-gray-900">{center.name}</p>
                <p className="text-sm text-gray-500">{center.age} tuổi • {center.duration} tại Yên Yoga</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT card */}
        <div
          className="hidden sm:block flex-shrink-0 w-56 lg:w-64 cursor-pointer"
          onClick={next}
          role="button"
          aria-label={`Xem đánh giá của ${right.name}`}
        >
          <div className={`
            h-64 lg:h-72 rounded-2xl p-5 border border-gray-100 shadow-sm bg-gradient-to-br ${right.bg}
            flex flex-col justify-between
            opacity-50 scale-95 origin-left
            hover:opacity-60 transition-all duration-500
            ${animating ? 'opacity-30' : ''}
          `}>
            <div>
              {STARS}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">"{right.short}"</p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-gray-200/50">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${right.color} flex items-center justify-center flex-shrink-0 shadow`}>
                <span className="text-white font-bold text-sm">{right.initial}</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{right.name}</p>
                <p className="text-xs text-gray-400 truncate">{right.duration}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators + arrows */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
          aria-label="Trước"
          className="w-9 h-9 cursor-pointer rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-400 hover:text-primary-600 hover:border-primary-300 hover:shadow-md transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="flex gap-2 items-center">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Đánh giá ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-7 h-2.5 bg-primary-500'
                  : 'w-2.5 h-2.5 bg-gray-300 hover:bg-primary-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Tiếp"
          className="w-9 h-9 cursor-pointer rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-400 hover:text-primary-600 hover:border-primary-300 hover:shadow-md transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
