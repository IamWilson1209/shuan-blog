import EmailForm from '@/components/forms/EmailForm';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';
import { openGraphImage } from '@/app/shared-metadata';
import FadeInAnimation from '@/components/animations/FadeInAnimation';

export const metadata: Metadata = {
  title: `Ex* | Contact me`,
  description:
    'Contact Me Information: Email:zenfonlee@gmail.com, Phone:+886-965-650-099, GitHub: https://github.com/IamWilson1209, LinkedIn: https://linkedin.com/in/weishiuan',
  openGraph: {
    ...openGraphImage,
    title: '李瑋軒 | Wei-shiuan Lee',
  },
};

const ContactPage = () => {
  return (
    <FadeInAnimation>
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-900  flex items-center justify-center p-6">
        <div className="max-w-7xl w-full bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
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
            <div className="md:w-3/4 space-y-6 font-work-sans">
              <h2 className="text-2xl font-bold text-black-800 dark:text-white-100 mt-4">
                About Me
              </h2>
              <p className="text-gray-700 dark:text-gray-300 font-normal">
                I’m a software engineer with a foundation in full-stack web app
                development, AI integration, and algorithm design. I have
                extensive experience in programming over 5 years.
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-normal">
                Over the past year, I have focused on building modern, scalable
                full-stack applications using JavaScript, TypeScript, React, and
                Next.js.
              </p>

              <h2 className="text-2xl font-bold text-black-800 dark:text-white-100 mt-4">
                Current Projects
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 font-normal pl-4">
                <li>
                  Ex*, a blog CMS powered by Next.js and Sanity, featuring a
                  RAG-based AI chatbot built on GPT-4o for content generation.
                </li>
                <li>
                  Real-time AI-integrated chat app using Next.js, Convex, and
                  OpenAI (GPT-3.5-Turbo, DALL-E).
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-black-800 dark:text-white-100 mt-4">
                Work Experience
              </h2>
              <p className="text-gray-700 dark:text-gray-300 font-normal">
                During my 2023 internship at Micron as a PE Cost Engineer, I
                created an anomaly cost detection web app, saving my managers
                90% of their time by automating critical processes.
              </p>

              <h2 className="text-2xl font-bold text-black-800 dark:text-white-100 mt-4">
                My Goal
              </h2>
              <p className="text-gray-700 dark:text-gray-300 font-normal">
                I thrive on turning ideas into impactful solutions and am eager
                to contribute to cutting-edge tech projects. If you like my
                work, let’s connect!
              </p>
            </div>

            {/* 中層右邊：照片 */}
            <div className="md:w-1/3 mt-6 md:mt-40 lg:mt-30">
              <div className="w-full aspect-square relative rounded-lg overflow-hidden">
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
          <div className="text-sm text-gray-500 dark:text-white-100/70 space-y-8">
            <div className="flex flex-col sm:space-x-12 md:space-x-32 sm:flex-row ">
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
    </FadeInAnimation>
  );
};

export default ContactPage;
