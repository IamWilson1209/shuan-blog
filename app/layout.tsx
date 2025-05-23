import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import 'easymde/dist/easymde.min.css';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import { GoogleTagManager } from '@next/third-parties/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { ReduxInitializer } from '@/components/ReduxInitializer';

const workSans = localFont({
  src: [
    {
      path: './fonts/WorkSans-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-Thin.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-ExtraLight.ttf',
      weight: '100',
      style: 'normal',
    },
  ],
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: "Shuan's Blog",
  icons: {
    icon: '/Ex.png',
  },
  description:
    "Welcome to Shuan's personal blog, find out more about me and my articles here!!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* 
      suppressHydrationWarning: server 初始渲染的背景色與 client 不相符
      使用 shadcn handle theme, 
      直接使用此屬性避免 hydration 警告 
    */
    <html lang="en" suppressHydrationWarning>
      <body className={`${workSans.variable} `}>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider>
              <ReduxInitializer />
              {children}
              <Analytics />
              <GoogleTagManager gtmId="GTM-P98XJMMN" />
              <GoogleAnalytics gaId="G-38FPHRNTCG" />
              <Toaster position="bottom-left" closeButton richColors />
            </SessionProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
