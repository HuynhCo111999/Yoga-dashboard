'use client';

import { useState, useEffect, useCallback } from 'react';

const testimonials = [
  {
    initial: 'L',
    name: 'Lan Anh',
    age: 32,
    duration: 'Thành viên hơn 1 năm',
    short: 'Mỗi buổi tối đến Yên Yoga giống như được reset lại hoàn toàn. Không gian yên tĩnh, giảng viên tận tâm.',
    full: 'Sau giờ làm việc căng thẳng, mỗi buổi tối đến Yên Yoga giống như được reset lại hoàn toàn. Không gian yên tĩnh, giảng viên hướng dẫn rất kỹ và luôn để ý từng chuyển động. Sau 3 tháng tập, mình ngủ ngon hơn, ít đau mỏi vai gáy và tinh thần cũng nhẹ nhàng hơn rất nhiều.',
    color: 'from-primary-400 to-primary-600',
    bg: 'from-primary-50 to-orange-50',
    accent: 'text-primary-600',
  },
  {
    initial: 'M',
    name: 'Minh Châu',
    age: 28,
    duration: 'Thành viên hơn 8 tháng',
    short: 'Các giảng viên Yên Yoga rất tận tâm, luôn điều chỉnh động tác phù hợp. Yoga giờ là thói quen không thể thiếu.',
    full: 'Mình bắt đầu tập yoga với mục tiêu giảm stress sau sinh. Các giảng viên Yên Yoga rất tận tâm, luôn điều chỉnh động tác phù hợp với từng người. Bây giờ yoga đã trở thành một phần không thể thiếu trong cuộc sống. Cảm ơn cộng đồng Yên Yoga đã đồng hành!',
    color: 'from-accent-400 to-yellow-500',
    bg: 'from-accent-50 to-yellow-50',
    accent: 'text-accent-600',
  },
  {
    initial: 'T',
    name: 'Thanh Hà',
    age: 45,
    duration: 'Thành viên hơn 2 năm',
    short: 'Ở tuổi 45, cột sống của mình cải thiện rõ rệt, không còn đau lưng mãn tính. Khoản đầu tư sức khoẻ tốt nhất!',
    full: 'Ở tuổi 45 mình lo ngại không theo kịp, nhưng Yên Yoga có lớp dành riêng cho người mới, rất phù hợp. Giảng viên kiên nhẫn và nhiệt tình. Cột sống cải thiện rõ rệt, không còn đau lưng mãn tính. Đây là khoản đầu tư sức khoẻ tốt nhất mình từng làm.',
    color: 'from-secondary-400 to-secondary-600',
    bg: 'from-secondary-50 to-stone-50',
    accent: 'text-secondary-600',
  },
  {
    initial: 'H',
    name: 'Hoàng Nam',
    age: 35,
    duration: 'Thành viên hơn 6 tháng',
    short: 'Sức bền và sự linh hoạt cải thiện đáng kể. Không khí lớp học thoải mái, không áp lực chút nào.',
    full: 'Ban đầu mình nghĩ yoga chỉ dành cho nữ giới, nhưng sau khi thử thì thấy mình cần nó từ lâu! Sức bền và sự linh hoạt cải thiện đáng kể. Không khí lớp học rất thoải mái, không áp lực. Mình đặc biệt thích các buổi thiền cuối mỗi lớp — cảm giác bình yên thật sự.',
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
