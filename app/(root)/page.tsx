import SearchForm from '@/components/forms/SearchForm';
import { SanityLive } from '@/sanity/lib/live';
import LoadMoreSpinner from '@/components/LoadMoreSpinner';
import { fetchArticlesAction } from '@/actions/server-actions';
import { SquarePen } from 'lucide-react';
import type { Metadata } from 'next';
import { openGraphImage } from '../shared-metadata';
import { Suspense } from 'react';
import FadeInAnimation from '@/components/animations/FadeInAnimation';
import SlideInFromLeftAnimation from '@/components/animations/SlideInFromLeftAnimation ';

export const metadata: Metadata = {
  title: `Ex* | Shuan's blog | shuan.ltd | www.shuan.ltd`,
  description:
    'Welcome to my website -- Ex*, you can share your ideas with me at here, and know more about my technical background, knowledge.',
  openGraph: {
    ...openGraphImage,
    title: 'Public PlayGround',
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).query;

  /* 取得第一頁的文章資料 */
  const initialArticles = await fetchArticlesAction(1, query);

  return (
    <>
      <section className="global_background">
        <FadeInAnimation>
          <h1 className="heading">Welcome to Ex*!!</h1>
          <p className="sub-heading text-center !max-w-3xl">
            Share what you've learned to make this <br></br>
            <span className="idea">public playground</span> even more fun!!
          </p>
        </FadeInAnimation>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <div className="flex justify-start items-center pl-4">
          <SquarePen width={45} height={45} />
          <SlideInFromLeftAnimation>
            <p className="text-all-article">
              {query
                ? `Search result for keyword "${query}"`
                : 'Public Playground'}
            </p>
          </SlideInFromLeftAnimation>
        </div>
        <Suspense fallback={<div>Loading articles...</div>}>
          {/* <SlideInFromLeftAnimation> */}
          <LoadMoreSpinner
            initialArticles={initialArticles}
            searchQuery={query}
          />
          {/* </SlideInFromLeftAnimation> */}
        </Suspense>
      </section>
      <SanityLive />
    </>
  );
}
