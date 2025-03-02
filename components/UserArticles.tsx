import { client } from '@/sanity/lib/client';
import { GET_ARTICLES_BY_AUTHOR_QUERY } from '@/sanity/lib/queries';
import React from 'react';
import ArticleCard, { ArticlePageType } from './ArticleCard';

const UserArticles = async ({
  id,
  userId,
  savedArticleIds,
}: {
  id: string;
  userId: string | undefined;
  savedArticleIds: Set<string> | Set<unknown>;
}) => {
  const userArticles = await client
    .withConfig({ useCdn: false })
    .fetch(GET_ARTICLES_BY_AUTHOR_QUERY, { id });

  /* 將每篇文章與 savedArticleIds 匹配，計算 initialSavedStatus */
  const articleWithSaveStatus = userArticles.map(
    (article: ArticlePageType) => ({
      ...article,
      initialSavedStatus: savedArticleIds.has(article._id),
    })
  );

  return (
    <>
      {userArticles.length > 0 ? (
        userArticles.map((articles: ArticlePageType) => (
          <ArticleCard
            key={articles?._id}
            article={articles}
            userId={userId}
            initialSavedStatus={articleWithSaveStatus.initialSavedStatus}
          />
        ))
      ) : (
        <p className="no-result">No articles yet</p>
      )}
    </>
  );
};

export default UserArticles;
