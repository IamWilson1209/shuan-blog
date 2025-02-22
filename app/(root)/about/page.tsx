import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Ex* | Ex*.com',
  description:
    'Choosing a name like "Ex" for a logo infuses it with a wealth of positive connotations. Words beginning with "Ex" — such as education, excellence, expertise, extraordinary, and excitement — carry meanings of growth, superiority, and energy. This simple prefix suggests a brand that stands out, embodying qualities like knowledge and skill (education, expertise), exceptional achievement (excellence, extraordinary), and vibrant enthusiasm (excitement). It’s a compact yet powerful way to signal ambition and dynamism, aligning with a vision of innovation and leadership. In a competitive world, "Ex" offers a memorable hook that implies going beyond the ordinary, resonating with audiences who value progress and distinction. Thus, "Ex" not only enhances the logo’s appeal but also embeds it with layers of uplifting significance, making it an ideal choice for a forward-thinking identity.',
  icons: { icon: '/Ex-meta-v3.png' },
};

const AboutPage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 py-12 px-6 animate-gradient">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-8 text-center animate-fade-in">
          Why "Ex*"?
        </h1>
        <div className="flex justify-center mb-6">
          <img
            src="/Ex-meta.png"
            alt="Ex Logo"
            className="w-24 h-24 rounded-md hover:scale-110 transition-transform duration-300 ease-in-out"
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Choosing a name like{' '}
            <span className="font-semibold text-blue-600 animate-pulse">
              "Ex"
            </span>{' '}
            for a logo infuses it with a wealth of positive connotations. Words
            beginning with "Ex" — such as <em>education</em>,{' '}
            <em>excellence</em>, <em>expertise</em>, <em>extraordinary</em>, and{' '}
            <em>excitement</em> — carry meanings of growth, superiority, and
            energy. This simple prefix suggests a brand that stands out,
            embodying qualities like knowledge and skill (<em>education</em>,{' '}
            <em>expertise</em>), exceptional achievement (<em>excellence</em>,{' '}
            <em>extraordinary</em>), and vibrant enthusiasm (<em>excitement</em>
            ). It’s a compact yet powerful way to signal ambition and dynamism,
            aligning with a vision of innovation and leadership. In a
            competitive world, "Ex" offers a memorable hook that implies going
            beyond the ordinary, resonating with audiences who value progress
            and distinction. Thus, "Ex" not only enhances the logo’s appeal but
            also embeds it with layers of uplifting significance, making it an
            ideal choice for a forward-thinking identity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
