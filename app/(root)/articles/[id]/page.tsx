import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import {
  GET_ARTICLE_BY_ID_QUERY,
  GET_PLAYLIST_BY_SLUG_QUERY,
} from '@/sanity/lib/queries';
import Link from 'next/link';
import React, { Suspense } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import Views from '@/components/Views';
import { notFound } from 'next/navigation';
import markdownit from 'markdown-it';
import { ArticlePageType } from '@/components/ArticlePage';

const md = markdownit();
export const experimental_ppr = true;

const ArticlePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  /* 
    Docs: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#parallel-and-sequential-data-fetching
    Parallel data fetching
  */
  const [article] = await Promise.all([
    client.fetch(GET_ARTICLE_BY_ID_QUERY, { id }),
    // client.fetch(GET_PLAYLIST_BY_SLUG_QUERY, {
    //   slug: 'user-playlist',
    // }),
  ]);

  // console.log('editorPosts: ', editorPosts);

  const parsedContent = md.render(article?.content || '');

  if (!article) return notFound();
  return (
    <>
      <section className="global_background !min-h-[230px]">
        <p className="tag">{formatDate(article?._createdAt)}</p>

        <h1 className="heading">{article.title}</h1>
        <p className="sub-heading !max-w-5xl">{article.description}</p>
      </section>

      <section className="section_container">
        <img
          src={article.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/users/${article.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={article.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{article.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{article.author.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{article.category}</p>
          </div>

          <h3 className="text-30-bold">Content</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        {/* {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>

            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: ArticlePageType, i: number) => (
                <ArticlePage key={i} article={article} />
              ))}
            </ul>
          </div>
        )} */}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <Views id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default ArticlePage;
