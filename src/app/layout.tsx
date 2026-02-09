import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BASIC META TAGS
  // ═══════════════════════════════════════════════════════════════════════════
  title: {
    default: 'SearchCourse - Discover Premium Course Deals',
    template: '%s | SearchCourse',
  },
  description:
    'Find the best deals on online courses from Udemy, Coursera, and more. Save up to 90% on top-rated technical courses with verified coupons.',
  keywords: [
    'online courses',
    'course deals',
    'udemy coupons',
    'coursera discounts',
    'programming courses',
    'web development',
    'learning platform',
    'free courses',
    'course coupons',
    'online learning',
  ],
  authors: [{ name: 'SearchCourse' }],
  creator: 'SearchCourse',
  publisher: 'SearchCourse',
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FAVICON & ICONS
  // Maps to: /seo/16x16-icon.ico, /seo/32x32-icon.ico, etc.
  // ═══════════════════════════════════════════════════════════════════════════
  icons: {
    icon: [
      { url: '/seo/16x16-icon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/seo/32x32-icon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/seo/48x48-icon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/seo/192x192-icon.ico', sizes: '192x192', type: 'image/x-icon' },
      { url: '/seo/512x512-icon.ico', sizes: '512x512', type: 'image/x-icon' },
    ],
    shortcut: '/seo/32x32-icon.ico',
    apple: [
      { url: '/seo/192x192-icon.ico', sizes: '180x180', type: 'image/x-icon' },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // OPEN GRAPH (Facebook, LinkedIn, WhatsApp)
  // Maps to: /seo/og-image.png
  // ═══════════════════════════════════════════════════════════════════════════
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'SearchCourse',
    title: 'SearchCourse - Discover Premium Course Deals',
    description:
      'Find the best deals on online courses from Udemy, Coursera, and more. Save up to 90% on top-rated courses.',
    images: [
      {
        url: '/seo/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SearchCourse - Your Gateway to Premium Online Courses',
        type: 'image/png',
      },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TWITTER CARD
  // Maps to: /seo/twitter-card.png
  // ═══════════════════════════════════════════════════════════════════════════
  twitter: {
    card: 'summary_large_image',
    title: 'SearchCourse - Discover Premium Course Deals',
    description:
      'Find the best deals on online courses from Udemy, Coursera, and more. Save up to 90% on top-rated courses.',
    images: [
      {
        url: '/seo/twitter-card.png',
        width: 1200,
        height: 600,
        alt: 'SearchCourse - Premium Course Deals',
      },
    ],
    creator: '@searchcourse',
    site: '@searchcourse',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ROBOTS & INDEXING
  // ═══════════════════════════════════════════════════════════════════════════
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL META
  // ═══════════════════════════════════════════════════════════════════════════
  applicationName: 'SearchCourse',
  referrer: 'origin-when-cross-origin',
  category: 'education',
  other: {
    'theme-color': '#0f172a', // Dark slate for dark mode default
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
