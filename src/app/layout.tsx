import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import StructuredData from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yen-yoga.vercel.app'),
  title: {
    default: "Yên Yoga Studio - Không gian yoga thanh tịnh",
    template: "%s | Yên Yoga Studio"
  },
  description: "Khám phá hành trình yoga tại Yên Yoga Studio với đội ngũ giảng viên chuyên nghiệp, lớp học đa dạng và không gian thanh tịnh. Đăng ký ngay để bắt đầu hành trình cân bằng cơ thể và tâm hồn.",
  keywords: [
    "yoga", "yoga studio", "hatha yoga", "vinyasa yoga", "meditation", 
    "thiền", "tập yoga", "yoga việt nam", "yoga hcm", "yoga sài gòn",
    "lớp yoga", "giảng viên yoga", "yoga cho người mới", "yoga nâng cao"
  ],
  authors: [{ name: "Yên Yoga Studio" }],
  creator: "Yên Yoga Studio",
  publisher: "Yên Yoga Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://yoga-dashboard-two.vercel.app',
    siteName: 'Yên Yoga Studio',
    title: 'Yên Yoga Studio - Không gian yoga thanh tịnh',
    description: 'Khám phá hành trình yoga tại Yên Yoga Studio với đội ngũ giảng viên chuyên nghiệp, lớp học đa dạng và không gian thanh tịnh.',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Yên Yoga Studio Logo',
      },
      {
        url: '/class-studio.jpeg',
        width: 1200,
        height: 630,
        alt: 'Yên Yoga Studio - Không gian luyện tập',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yên Yoga Studio - Không gian yoga thanh tịnh',
    description: 'Khám phá hành trình yoga tại Yên Yoga Studio với đội ngũ giảng viên chuyên nghiệp, lớp học đa dạng và không gian thanh tịnh.',
    images: ['/logo.jpeg'],
    creator: '@yenyogastudio',
    site: '@yenyogastudio',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://yoga-dashboard-two.vercel.app',
    languages: {
      'vi-VN': 'https://yoga-dashboard-two.vercel.app',
    },
  },
  category: 'Health & Fitness',
  manifest: "/manifest.json",
  themeColor: "#f97316",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <StructuredData type="organization" />
        <StructuredData type="localBusiness" />
        <StructuredData type="website" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
