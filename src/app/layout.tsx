import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/AppContext';
import { Vazirmatn } from 'next/font/google';

const vazirmatn = Vazirmatn({ subsets: ['latin'], variable: '--font-vazirmatn' });

const APP_NAME = 'RasaPM';
const APP_DESCRIPTION = 'یک اپلیکیشن PWA برای مدیریت PMهای هفتگی سایت‌ها.';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#34A0A4',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-body antialiased`}>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
