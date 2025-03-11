import React from 'react';
import { Metadata } from 'next';
import { openGraphImage } from '@/app/shared-metadata';

export const metadata: Metadata = {
  title: `Ex* | About Ex* | Shuan'${'s'} blog`,
  description:
    'Ex* is a public knowledge playground where you can explore content shared by others, gain valuable knowledge, and even contribute your own ideas, experiences, or expertise to the public. Join us and start your journey by creating!',
  openGraph: {
    ...openGraphImage,
    title: 'Public PlayGround',
  },
};

const AboutPage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-r from-purple-100 to-indigo-100 py-16 px-6 animate-gradient dark:global_background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white-100/80 mb-12 text-center animate-fade-in">
            What is Ex*?
          </h1>
          <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-8 md:p-12 transform transition-all hover:scale-105 duration-300 ease-in-out">
            <p className="text-xl font-work-sans md:text-2xl text-gray-700 dark:text-white-100/80 leading-relaxed">
              Ex* is a{' '}
              <span className="font-semibold text-purple-600 animate-pulse">
                public knowledge playground
              </span>{' '}
              where you can explore content shared by others, gain valuable
              knowledge, and even contribute your own ideas, experiences, or
              expertise to the public. To strengthen this community, start your
              journey by creating!
            </p>
          </div>
        </div>

        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white-100/80 mb-12 text-center animate-fade-in">
            Why Ex*?
          </h1>
          <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-8 md:p-12 transform transition-all hover:scale-105 duration-300 ease-in-out">
            <p className="text-xl md:text-2xl text-gray-700 dark:text-white-100/80 leading-relaxed">
              The{' '}
              <span className="font-semibold text-purple-600 animate-pulse">
                *
              </span>{' '}
              invites you to fill in any word starting with{' '}
              <span className="font-semibold text-indigo-600">Ex</span> that
              resonates with you. To me, Ex is a special prefix, sparking
              countless positive adjectives like <em>extraordinary</em>,{' '}
              <em>excellent</em>, and <em>exceptional</em>. Though there are
              also words with some ordinary meanings—<em>expired</em>,{' '}
              <em>ex-girlfriend</em>, or <em>ex-boyfriend</em>,{' '}
              <span className="font-semibold text-purple-600 animate-pulse">
                Ex* is yours to define.
              </span>{' '}
              By using this platform thoughtfully, you can transform Ex* into a
              force for good and unlock its potential to inspire and support
              you. Let’s get started!
            </p>
          </div>
        </div>

        {/* Logo 展示 */}
        <div className="flex justify-center mt-16">
          <img
            src="/Ex-meta.png"
            alt="Ex Logo"
            className="w-32 h-32 rounded-md hover:scale-110 transition-transform duration-300 ease-in-out"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
