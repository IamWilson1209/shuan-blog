import React from 'react';
import ArticleCard from './ArticleCard';
import { ArticleWithSaveStatus } from '@/types/ArticleWithSaveStatus';

const UserArticles = async ({
  articles,
}: {
  id: string;
  articles: Array<ArticleWithSaveStatus>;
}) => {
  return (
    <>
      {articles.length > 0 ? (
        articles.map((article: ArticleWithSaveStatus) => (
          <ArticleCard key={article?._id} article={article} />
        ))
      ) : (
        <p className="no-result">No articles yet</p>
      )}
    </>
  );
};

export default UserArticles;
