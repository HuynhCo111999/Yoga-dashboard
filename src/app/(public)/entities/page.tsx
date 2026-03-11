import Link from 'next/link';

const TARGET_URL = 'https://yen-yoga-studio.com/';

const googleRedirectBases = [
  'https://google.pl/url',
  'https://google.ca/url',
  'https://google.nl/url',
  'https://google.com.br/url',
  'https://google.com.au/url',
  'https://google.cz/url',
  'https://google.ch/url',
  'https://google.be/url',
  'https://google.at/url',
  'https://google.se/url',
  'https://google.com.tw/url',
  'https://google.com.hk/url',
  'https://google.dk/url',
  'https://google.hu/url',
  'https://google.fi/url',
  'https://google.com.tr/url',
  'https://google.com.ua/url',
  'https://google.com.mx/url',
  'https://google.pt/url',
  'https://google.co.nz/url',
  'https://google.co.th/url',
  'https://google.no/url',
  'https://google.com.ar/url',
  'https://google.ro/url',
  'https://google.co.za/url',
  'https://google.co.id/url',
  'https://google.sk/url',
  'https://google.ie/url',
  'https://google.gr/url',
  'https://google.com.my/url',
  'https://google.cl/url',
  'https://google.com.vn/url',
  'https://google.com.ph/url',
  'https://google.bg/url',
  'https://google.co.kr/url',
  'https://google.co.il/url',
  'https://google.lt/url',
  'https://google.si/url',
  'https://google.hr/url',
  'https://google.com/url',
  'https://google.ae/url',
  'https://google.rs/url',
  'https://google.com.sa/url',
  'https://google.com.co/url',
  'https://google.ee/url',
  'https://google.lv/url',
  'https://google.com.pe/url',
  'https://google.mu/url',
  'https://google.co.ve/url',
  'https://google.lk/url',
  'https://google.com.pk/url',
  'https://google.lu/url',
  'https://google.by/url',
  'https://google.com.ng/url',
  'https://google.com.np/url',
  'https://google.com.uy/url',
  'https://google.tn/url',
  'https://google.com.ec/url',
  'https://google.com.bd/url',
  'https://google.co.ke/url',
  'https://google.dz/url',
  'https://google.co.cr/url',
  'https://google.com.lb/url',
  'https://google.com.do/url',
  'https://google.com.gh/url',
  'https://google.com.gt/url',
  'https://google.com.pr/url',
  'https://google.ba/url',
  'https://google.is/url',
  'https://google.kz/url',
  'https://google.com.mt/url',
  'https://google.com.py/url',
  'https://google.co.ug/url',
  'https://google.co.bw/url',
  'https://google.com.kw/url',
  'https://google.com.kh/url',
  'https://google.ge/url',
  'https://google.jo/url',
  'https://google.com.sv/url',
  'https://google.com.bo/url',
  'https://google.com.ni/url',
  'https://google.com.pa/url',
  'https://google.cat/url',
  'https://google.hn/url',
  'https://google.mk/url',
  'https://google.ad/url',
  'https://google.com.bh/url',
  'https://google.ci/url',
  'https://google.co.ma/url',
  'https://google.com.cy/url',
  'https://google.com.qa/url',
  'https://google.li/url',
  'https://google.com.na/url',
  'https://google.iq/url',
  'https://google.com.jm/url',
  'https://google.am/url',
  'https://google.tt/url',
  'https://google.cm/url',
  'https://google.md/url',
  'https://google.me/url',
  'https://google.az/url',
  'https://google.co.tz/url',
  'https://google.co.zw/url',
  'https://google.mg/url',
  'https://google.sn/url',
  'https://google.ps/url',
  'https://google.mn/url',
  'https://google.mv/url',
  'https://google.com.et/url',
  'https://google.com.om/url',
  'https://google.com.cu/url',
  'https://google.com.bz/url',
  'https://google.sr/url',
  'https://google.bs/url',
  'https://google.la/url',
  'https://google.je/url',
  'https://google.com.mm/url',
  'https://google.cd/url',
  'https://google.com.ly/url',
  'https://google.as/url',
  'https://google.rw/url',
  'https://google.tg/url',
  'https://google.gp/url',
  'https://google.al/url',
  'https://google.co.vi/url',
  'https://google.co.zm/url',
  'https://google.vg/url',
  'https://google.ht/url',
  'https://google.com.gi/url',
  'https://google.co.mz/url',
  'https://google.com.af/url',
  'https://google.ms/url',
  'https://google.sh/url',
  'https://google.bi/url',
  'https://google.com.fj/url',
  'https://google.com.ag/url',
  'https://google.mw/url',
  'https://google.co.uz/url',
  'https://google.kg/url',
  'https://google.tm/url',
  'https://google.fm/url',
  'https://google.com.pg/url',
  'https://google.ws/url',
  'https://google.bt/url',
  'https://google.co.ls/url',
  'https://google.co.ao/url',
  'https://google.gm/url',
  'https://google.com.nf/url',
  'https://google.gl/url',
  'https://google.im/url',
  'https://google.gg/url',
  'https://google.sm/url',
  'https://google.com.bn/url',
  'https://google.sc/url',
  'https://google.cg/url',
  'https://google.dm/url',
  'https://google.dj/url',
  'https://google.tl/url',
  'https://google.cv/url',
  'https://google.bf/url',
  'https://google.com.vc/url',
  'https://google.com.ai/url',
  'https://google.bj/url',
  'https://google.ml/url',
  'https://google.to/url',
  'https://google.so/url',
  'https://google.co.ck/url',
  'https://google.cf/url',
  'https://google.gy/url',
  'https://google.com.tj/url',
  'https://google.pn/url',
  'https://google.st/url',
  'https://google.td/url',
  'https://google.vu/url',
  'https://google.tk/url',
  'https://google.com.sb/url',
  'https://google.com.sl/url',
  'https://google.ne/url',
  'https://google.nr/url',
  'https://google.ki/url',
  'https://google.ga/url',
  'https://google.nu/url',
  'https://google.ac/url',
];

const socialLinks = [
  {
    label: 'Website chính',
    url: TARGET_URL,
  },
  // Google redirect URLs với tham số q trỏ về domain chính
  ...googleRedirectBases.map((base) => ({
    label: base,
    url: `${base}?q=${(TARGET_URL)}`,
  })),
];

export const metadata = {
  title: 'Social Entities của Yên Yoga Studio',
  description:
    'Danh sách các social entity chính thức của Yên Yoga Studio để Google hiểu rõ thương hiệu và tăng độ tin cậy SEO.',
};

export default function EntitiesPage() {
  return (
    <main className="min-h-[100dvh] bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary-500 uppercase mb-3">
            Social Entities
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Các kênh chính thức của Yên Yoga Studio
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Trang này liệt kê các đường dẫn social entity chính thức của thương hiệu để hỗ trợ
            Google và các công cụ tìm kiếm hiểu rõ hơn về Yên Yoga Studio.
          </p>
        </header>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">
          <ul className="space-y-3">
            {socialLinks.map((item) => (
              <li
                key={item.label}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b last:border-b-0 border-gray-100 pb-3 last:pb-0"
              >
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 break-all"
                >
                  {item.url}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

