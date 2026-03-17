'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Về chúng tôi', href: '/about' },
  { name: 'Lịch học', href: '/calendar' },
  { name: 'Gói tập', href: '/packages' },
  { name: 'Blog', href: '/blog' },
  { name: 'Liên hệ', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isLoggedIn = !!user;
  const userRole = user?.role || '';

  // Wait for client mount before using createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    const result = await signOut();
    if (!result.error) {
      router.push('/');
    } else {
      console.error('Logout error:', result.error);
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  // Mobile menu rendered via portal directly into <body>
  const mobileMenu = mounted && mobileMenuOpen ? createPortal(
    <div role="dialog" aria-modal="true" aria-label="Menu điều hướng">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 9998 }}
        onClick={() => setMobileMenuOpen(false)}
      />
      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-white px-4 py-4 sm:px-6 sm:py-6 sm:max-w-sm shadow-2xl"
        style={{ zIndex: 9999 }}
      >
        {/* Header of drawer */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-3" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <Image src="/logo.jpeg" alt="Yên Yoga" width={40} height={40} className="rounded-full" />
            </div>
            <span className="text-lg font-bold text-primary-600">Yên Yoga</span>
          </Link>
          <button
            type="button"
            className="-m-2.5 rounded-xl p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Đóng menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flow-root">
          <div className="-my-6 divide-y divide-gray-200/50">
            <div className="space-y-1 py-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`-mx-3 flex items-center rounded-xl px-4 py-3 text-base font-semibold leading-7 transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-500 pl-3'
                      : 'text-gray-800 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="py-6 space-y-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href={userRole === 'admin' ? '/admin' : '/member'}
                    className="-mx-3 block rounded-xl px-4 py-3 text-base font-semibold leading-7 text-gray-800 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {userRole === 'admin' ? 'Quản lý' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="-mx-3 block w-full text-left rounded-xl px-4 py-3 text-base font-semibold leading-7 text-red-600 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-base font-semibold text-white shadow-md hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-md shadow-md border-b border-white/60'
            : 'bg-white/70 backdrop-blur-sm shadow-sm'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8" aria-label="Global">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-primary-300 transition-shadow duration-300">
                <Image src="/logo.jpeg" alt="Yên Yoga" width={50} height={50} className="rounded-full" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary-600 group-hover:text-primary-500 transition-colors">
                Yên Yoga
              </span>
            </Link>
          </div>

          {/* Hamburger button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Mở menu chính</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex lg:gap-x-8 xl:gap-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link text-sm font-semibold leading-6 transition-colors duration-200 pb-1 ${
                  isActive(item.href)
                    ? 'text-primary-600 active'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href={userRole === 'admin' ? '/admin' : '/member'}
                  className="text-sm font-semibold leading-6 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {userRole === 'admin' ? 'Quản lý' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-shine rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile menu rendered via portal into <body> — bypasses header's stacking context */}
      {mobileMenu}
    </>
  );
}
