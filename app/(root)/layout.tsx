import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import { openGraphImage } from '../shared-metadata';

export const metadata: Metadata = {
  title: `Ex*`,
  description:
    'Welcome to my website -- Ex*, you can share your ideas with me at here, and know more about my technical background, knowledge.',
  openGraph: {
    ...openGraphImage,
    title: 'Public PlayGround',
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-work-sans">
      <Navbar />
      {children}
    </main>
  );
}
