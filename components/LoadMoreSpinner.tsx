'use client';

import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';
import ArticleCard, { ArticlePageType } from './ArticleCard';
import { fetchArticlesAction, getSavedStatus } from '@/actions/server-actions';
import { useSession } from 'next-auth/react';
import LoadingSkeleton from './LoadingSkeleton';

/* 擴展 ArticlePageType，添加 initialSavedStatus */
export interface EnrichedArticlePageType extends ArticlePageType {
  initialSavedStatus: boolean;
}

interface LoadMoreProps {
  initialArticles: EnrichedArticlePageType[];
  searchQuery?: string | string[] | null | undefined;
}

/* 這段移到server端，計算所有文章的 initialSavedStatus */
async function fetchInitialSavedStatuses(
  articles: EnrichedArticlePageType[],
  userId?: string
) {
  const statuses = await Promise.all(
    articles.map((article) =>
      userId ? getSavedStatus(userId, article._id) : Promise.resolve(false)
    )
  );
  return articles.map((article, index) => ({
    ...article,
    initialSavedStatus: statuses[index],
  }));
}

function LoadMoreSpinner({
  initialArticles,
  searchQuery,
  // userId,
}: LoadMoreProps) {
  const { ref, inView } = useInView();
  const [articles, setArticles] =
    useState<EnrichedArticlePageType[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(page);
  const { data: session, status } = useSession();
  const userId = session?.id;

  /* 預先計算 initialArticles 的儲存狀態 */
  useEffect(() => {
    const loadInitialArticles = async () => {
      const enrichedArticles = await fetchInitialSavedStatuses(
        initialArticles,
        userId
      );
      setArticles(enrichedArticles);
    };
    if (status !== 'loading') {
      loadInitialArticles();
    }
  }, [initialArticles, session, status]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    console.log('trigger 2');

    /* 當滑到底時，useEffect 繼續從 Database 抓取 articles */
    if (inView && hasMore) {
      setIsLoading(true);

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
          const enrichedNewArticles = await fetchInitialSavedStatuses(
            newArticles,
            userId
          );
          setArticles((prev) => [...prev, ...enrichedNewArticles]);
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
          articles.map((article: EnrichedArticlePageType) => (
            <ArticleCard
              key={article?._id}
              article={article}
              userId={userId}
              initialSavedStatus={article?.initialSavedStatus}
            />
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
