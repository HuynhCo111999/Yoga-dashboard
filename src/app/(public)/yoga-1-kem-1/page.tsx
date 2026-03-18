import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { generateMetadata as generateSEOMetadata, generateFAQStructuredData, generateServiceStructuredData } from "@/utils/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Yoga 1 kèm 1 tại TP.HCM (HCM)",
  description:
    "Yoga 1 kèm 1 tại TP.HCM (HCM) cùng HLV kèm riêng theo thể trạng. Lộ trình cá nhân hóa, chỉnh tư thế kỹ, phù hợp người mới, dân văn phòng, phục hồi. Đặt lịch tư vấn tại Yên Yoga.",
  keywords: [
    "yoga 1 kèm 1",
    "yoga 1-1",
    "yoga kèm riêng",
    "yoga cá nhân",
    "yoga PT",
    "yoga tại HCM",
    "yoga TP.HCM",
    "yoga Bình Thạnh",
    "yoga phục hồi",
    "yoga cho người mới",
  ],
  canonical: "/yoga-1-kem-1",
  ogImage: "/class-studio.jpeg",
});

const faqs = [
  {
    question: "Yoga 1 kèm 1 tại TP.HCM phù hợp với ai?",
    answer:
      "Phù hợp với người mới cần chỉnh tư thế kỹ, người bận rộn cần lịch linh hoạt, dân văn phòng hay đau mỏi vai gáy/lưng, và người có mục tiêu cụ thể như tăng linh hoạt, cải thiện sức bền hoặc giảm stress.",
  },
  {
    question: "Tập yoga 1–1 khác gì so với lớp đông?",
    answer:
      "Với yoga 1–1, HLV theo sát từng động tác, điều chỉnh bài tập theo thể trạng và mục tiêu riêng. Bạn được sửa sai ngay tại chỗ, tập an toàn hơn và thường tiến bộ nhanh hơn.",
  },
  {
    question: "Một buổi yoga 1 kèm 1 kéo dài bao lâu?",
    answer:
      "Thông thường 60–75 phút/buổi (tuỳ mục tiêu và thể trạng). Khi tư vấn, Yên Yoga sẽ đề xuất thời lượng phù hợp để đảm bảo hiệu quả và an toàn.",
  },
  {
    question: "Tôi cần chuẩn bị gì khi học yoga 1 kèm 1?",
    answer:
      "Chỉ cần trang phục thoải mái, khăn nhỏ và nước uống. Thảm tập và dụng cụ hỗ trợ thường có sẵn tại studio.",
  },
  {
    question: "Lịch học yoga 1 kèm 1 tại HCM có linh hoạt không?",
    answer:
      "Có. Bạn có thể chọn khung giờ phù hợp (sáng/trưa/tối) và sắp xếp lại buổi theo chính sách của gói tập. Hãy liên hệ để được gợi ý lịch phù hợp.",
  },
];

export default function YogaOneOnOnePage() {
  return (
    <>
      <Header />

      <main className="min-h-[100dvh] bg-gradient-to-br from-primary-50 via-white to-accent-50">
        {/* Hero */}
        <section className="pt-24 pb-12 sm:pt-28 sm:pb-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-primary-100 px-4 py-1.5 text-xs font-semibold text-primary-700 shadow-sm">
                  <span className="text-base">🧘</span>
                  Yoga kèm riêng 1–1 tại TP.HCM (HCM)
                </p>

                <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                  Yoga 1 kèm 1 tại TP.HCM
                  <span className="block text-primary-600">Lộ trình cá nhân hóa theo thể trạng</span>
                </h1>

                <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Nếu bạn muốn tập đúng từ đầu, được chỉnh tư thế kỹ và theo sát tiến độ, yoga 1–1 là lựa chọn tối ưu.
                  HLV sẽ đánh giá thể trạng, thiết kế bài tập phù hợp (người mới, dân văn phòng, phục hồi) và điều chỉnh theo từng buổi.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Đặt lịch tư vấn 1 kèm 1 →
                  </Link>
                  <Link
                    href="/packages"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Xem gói tập
                  </Link>
                </div>

                <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl">
                  {[
                    { label: "Chỉnh tư thế", value: "Kỹ" },
                    { label: "Lộ trình", value: "Cá nhân" },
                    { label: "Khung giờ", value: "Linh hoạt" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl bg-white/80 border border-gray-100 p-4 text-center shadow-sm">
                      <p className="text-lg font-bold text-gray-900">{item.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
                  <Image
                    src="/images/banner.png"
                    alt="Yoga 1 kèm 1 tại TP.HCM tại Yên Yoga"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why 1–1 */}
        <section className="py-14 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Vì sao nên chọn yoga 1 kèm 1?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600">
                Khi mục tiêu của bạn là tập đúng, an toàn và tối ưu thời gian, 1–1 giúp loại bỏ “điểm mù” mà lớp đông thường gặp.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Đánh giá thể trạng & mục tiêu",
                  desc: "Tập trung vào điểm đau/mỏi, độ linh hoạt, sức bền và mục tiêu cụ thể của bạn.",
                },
                {
                  title: "Chỉnh tư thế chi tiết",
                  desc: "HLV quan sát và sửa sai ngay tại chỗ, giúp bạn tránh sai lệch, giảm chấn thương.",
                },
                {
                  title: "Theo dõi tiến bộ theo tuần",
                  desc: "Bài tập được điều chỉnh liên tục để bạn tiến bộ đều, phù hợp lịch làm việc tại HCM.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Quy trình học yoga 1 kèm 1 tại Yên Yoga
                </h2>
                <p className="mt-3 text-sm sm:text-base text-gray-600">
                  Rõ ràng, dễ theo, tập trung vào hiệu quả và an toàn.
                </p>

                <div className="mt-6 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Bạn ở TP.HCM (HCM) và muốn sắp xếp lịch linh hoạt? Hãy để lại thông tin, Yên Yoga sẽ gợi ý khung giờ phù hợp
                    và lộ trình theo mục tiêu của bạn.
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Nhận tư vấn ngay
                    </Link>
                    <Link
                      href="/calendar"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Xem lịch học
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <ol className="space-y-4">
                  {[
                    {
                      step: "01",
                      title: "Tư vấn & đặt lịch",
                      desc: "Trao đổi mục tiêu, thời gian rảnh, tình trạng sức khỏe để chọn khung giờ phù hợp.",
                    },
                    {
                      step: "02",
                      title: "Đánh giá thể trạng",
                      desc: "Đo mức độ linh hoạt, kiểm tra điểm đau/mỏi và thói quen vận động.",
                    },
                    {
                      step: "03",
                      title: "Lộ trình cá nhân hóa",
                      desc: "Thiết kế bài tập theo mục tiêu: người mới, dân văn phòng, phục hồi hoặc nâng cao.",
                    },
                    {
                      step: "04",
                      title: "Theo dõi & tối ưu",
                      desc: "Điều chỉnh bài tập theo từng buổi, theo dõi tiến bộ và hướng dẫn tự tập tại nhà.",
                    },
                  ].map((item) => (
                    <li key={item.step} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex gap-4">
                      <div className="shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700 font-bold">
                          {item.step}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                        <p className="mt-1 text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                FAQ về yoga 1 kèm 1 tại TP.HCM
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600">
                Một vài câu hỏi thường gặp trước khi bạn bắt đầu.
              </p>
            </div>

            <div className="grid gap-4">
              {faqs.map((item) => (
                <details key={item.question} className="group rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                    <span className="text-sm sm:text-base font-bold text-gray-900">{item.question}</span>
                    <span className="mt-0.5 text-gray-400 group-open:rotate-180 transition-transform">⌄</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 p-8 sm:p-10 text-center text-white shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-400/20 rounded-full" />
              </div>
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Sẵn sàng bắt đầu yoga 1 kèm 1 tại TP.HCM?
                </h2>
                <p className="mt-3 text-sm sm:text-base text-primary-100 max-w-2xl mx-auto">
                  Để lại thông tin, Yên Yoga sẽ tư vấn lộ trình phù hợp thể trạng và lịch của bạn.
                </p>
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-white text-primary-700 text-sm font-bold hover:bg-primary-50 transition-colors w-full sm:w-auto"
                  >
                    Liên hệ tư vấn →
                  </Link>
                  <Link
                    href="/packages"
                    className="inline-flex items-center justify-center px-7 py-3 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto"
                  >
                    Xem gói tập
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateServiceStructuredData({
              name: "Yoga 1 kèm 1 tại TP.HCM",
              description:
                "Dịch vụ yoga 1 kèm 1 tại TP.HCM (HCM) cùng HLV kèm riêng theo thể trạng, lộ trình cá nhân hóa, chỉnh tư thế kỹ, phù hợp người mới, dân văn phòng và phục hồi.",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQStructuredData(faqs)),
        }}
      />
    </>
  );
}

