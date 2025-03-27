import React from 'react';
import ArticleCard from './ArticleCard';
import { ArticleWithSaveStatus } from '@/app/(root)/users/[id]/page';

const UserArticles = async ({
  id,
  articles,
}: {
  id: string;
  articles: Array<ArticleWithSaveStatus>;
}) => {
  console.log('articles: ', articles);

  return (
    <>
      {articles.length > 0 ? (
        articles.map((article: ArticleWithSaveStatus) => (
          <ArticleCard
            key={article?._id}
            article={article}
            userId={id}
            initialSavedStatus={article.saveStatus}
          />
        ))
      ) : (
        <p className="no-result">No articles yet</p>
      )}
    </>
  );
};

export default UserArticles;
