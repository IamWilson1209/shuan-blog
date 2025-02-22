import { client } from '@/sanity/lib/client';
import { GET_ARTICLES_BY_AUTHOR_QUERY } from '@/sanity/lib/queries';
import React from 'react';
import ArticlePage, { ArticlePageType } from './ArticlePage';

const UserArticles = async ({ id }: { id: string }) => {
  const userArticles = await client.fetch(GET_ARTICLES_BY_AUTHOR_QUERY, { id });
  return (
    <>
      {userArticles.length > 0 ? (
        userArticles.map((articles: ArticlePageType) => (
          <ArticlePage key={articles?._id} article={articles} />
        ))
      ) : (
        <p className="no-result">No articles yet</p>
      )}
    </>
  );
};

export default UserArticles;
