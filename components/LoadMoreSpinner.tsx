'use client';

import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';
import ArticleCard, { ArticleCardProps } from './ArticleCard';
import { fetchArticlesAction } from '@/actions/server-actions';
import LoadingSkeleton from './LoadingSkeleton';

interface LoadMoreProps {
  initialArticles: ArticleCardProps[];
  searchQuery?: string | string[] | null | undefined;
}

function LoadMoreSpinner({ initialArticles, searchQuery }: LoadMoreProps) {
  const { ref, inView } = useInView();
  const [articles, setArticles] = useState<ArticleCardProps[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(page);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    /* 當滑到底時，useEffect 繼續從 Database 抓取 articles */
    if (inView && hasMore) {
      setIsLoading(true);

      /* 設定delay，不然會持續處於Loading狀態 */
      const delay = 500;
      const timeoutId = setTimeout(async () => {
        const newArticles = await fetchArticlesAction(
          pageRef.current,
          searchQuery
        );
        if (newArticles.length === 0) {
          setHasMore(false);
        } else {
          /* 有抓到，繼續更新儲存狀態 */
          setArticles((prev) => [...prev, ...newArticles]);
          setPage((prev) => prev + 1);
        }
        setIsLoading(false);
      }, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [inView, isLoading, searchQuery, hasMore]);

  return (
    <>
      <ul className="mt-5 card_grid pb-8">
        {articles.length > 0 ? (
          articles.map((article: ArticleCardProps) => (
            <ArticleCard key={article?._id} article={article} />
          ))
        ) : (
          <p className="no-results">No articles found</p>
        )}
      </ul>
      <hr />
      <section className="flex justify-center items-center w-full">
        <div ref={ref}>
          {inView && isLoading && (
            <div>
              <LoadingSkeleton />
            </div>
          )}
          {inView && !hasMore && (
            <>
              <p className="text-center text-[40px] font-bold text-black-200 dark:text-white-100/80 mt-3">
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
