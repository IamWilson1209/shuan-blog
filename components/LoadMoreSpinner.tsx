'use client';

import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';
import ArticlePage, { ArticlePageType } from './ArticleCard';
import { fetchArticlesAction } from '@/actions/server-actions';

interface LoadMoreProps {
  initialArticles: ArticlePageType[];
  searchQuery?: string | string[] | null | undefined;
}

function LoadMoreSpinner({ initialArticles, searchQuery }: LoadMoreProps) {
  const { ref, inView } = useInView();
  const [articles, setArticles] = useState<ArticlePageType[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(page);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    if (inView && hasMore) {
      setIsLoading(true);

      const delay = 500;
      const timeoutId = setTimeout(() => {
        fetchArticlesAction(pageRef.current, searchQuery)
          .then((res) => {
            if (res.length === 0) {
              setHasMore(false);
            } else {
              setArticles((prev) => [...prev, ...res]);
              setPage((prev) => {
                return prev + 1;
              });
            }
          })
          .catch((err) => console.error('Failed to fetch articles:', err))
          .finally(() => setIsLoading(false));
      }, delay);

      // 清除計時器
      return () => clearTimeout(timeoutId);
    }
  }, [inView, isLoading, searchQuery, hasMore]);

  return (
    <>
      <ul className="mt-5 card_grid pb-8">
        {articles.length > 0 ? (
          articles.map((article: ArticlePageType) => (
            <ArticlePage key={article?._id} article={article} />
          ))
        ) : (
          <p className="no-results">No articles found</p>
        )}
      </ul>
      <hr />
      <section className="flex justify-center items-center w-full">
        <div ref={ref}>
          {inView && isLoading && (
            <Image
              src="./tube-spinner.svg"
              alt="spinner"
              width={120}
              height={120}
              className="object-contain"
            />
          )}
          {inView && !hasMore && (
            <>
              <p className="text-center text-[40px] font-bold text-black-200 mt-3">
                No more articles
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default LoadMoreSpinner;
