import EmailForm from '@/components/EmailForm';
import Link from 'next/link';
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';
import { openGraphImage } from '@/app/shared-metadata';

export const metadata: Metadata = {
  title: `Ex* | Contact me`,
  description:
    'Contact Me Information: Email:zenfonlee@gmail.com, Phone:+886-965-650-099, GitHub: https://github.com/IamWilson1209, LinkedIn: https://linkedin.com/in/weishiuan',
  openGraph: {
    ...openGraphImage,
    images: ['Shuan.jpg'],
    title: '李瑋軒 | Wei-shiuan Lee',
  },
};

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900  flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
        {/* 上層：Contact Me 標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white-100/70">
            Contact Me
          </h1>
        </div>

        {/* 分隔線 */}
        <hr className="border-t border-gray-300 my-6" />

        {/* 中層：自傳和照片 */}
        <div className="md:flex md:space-x-8">
          {/* 中層左邊：自傳 */}
          <div className="md:w-2/3 space-y-4">
            <p className="text-lg text-gray-700 dark:text-white-100/70">
              Hi! I’m <span className="font-semibold">Wei-Shiuan Lee</span>, a
              self-learning full-stack developer from Hsinchu, Taiwan.
            </p>
            <p className="text-gray-600 dark:text-white-100/70">
              I study all web development skills by myself, with my main
              specialized tech stack being{' '}
              <span className="font-medium text-red-600">MERN</span> (MongoDB,
              Express, React, Node.js) and{' '}
              <span className="font-medium text-red-600">Next.js</span>{' '}
              development.
            </p>
            <p className="text-gray-600 dark:text-white-100/70">
              Recently, I started my web engineering career and am seeking a
              full-time position as a{' '}
              <span className="font-medium">full-stack software engineer</span>.
              If you like my work, please feel free to contact me!
            </p>
          </div>

          {/* 中層右邊：照片 */}
          <div className="md:w-1/3 mt-6 md:mt-0">
            <div className="w-full h-64 relative rounded-lg overflow-hidden">
              <Image
                src={'/Shuan.jpg'}
                alt={'Wei-Shiuan Lee'}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* 分隔線 */}
        <hr className="border-t border-gray-300 my-6" />

        {/* 下層：聯絡資訊 */}
        <div className="text-sm text-gray-500 dark:text-white-100/70 space-y-4">
          <div className="flex flex-row space-x-32">
            <div>
              <p className="flex items-center gap-2">
                <Mail fill="black" stroke="white" strokeWidth={1} />
                Email:
                <Link
                  href="mailto:zenfonlee@gmail.com"
                  className="text-red-600 hover:underline"
                >
                  zenfonlee@gmail.com
                </Link>
              </p>
              <p className="flex items-center gap-2">
                <Phone fill="black" stroke="white" strokeWidth={1} />
                Phone:
                <span className="text-red-600 hover:underline">
                  +886-965-650-099
                </span>
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2">
                <Image
                  src={'/icons8-github-logo.svg'}
                  alt={''}
                  width={24}
                  height={24}
                />
                GitHub:
                <Link
                  href="https://github.com/IamWilson1209"
                  className="text-red-600 hover:underline"
                >
                  https://github.com/IamWilson1209
                </Link>
              </p>
              <p className="flex items-center gap-2">
                <Image
                  src={'/icons8-linkedin.svg'}
                  alt={''}
                  width={24}
                  height={24}
                />
                LinkedIn:
                <Link
                  href="https://linkedin.com/in/weishiuan"
                  className="text-red-600 hover:underline"
                >
                  https://linkedin.com/in/weishiuan
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <EmailForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
