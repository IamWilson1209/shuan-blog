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
import { Timer } from 'lucide-react';
import { auth } from '@/auth';
import { getSavedStatus } from '@/actions/server-actions';
import SaveButton from '@/components/SaveButton';

const md = markdownit();
export const experimental_ppr = true;

const ArticlePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  const currentUserId = session?.id || null;
  const isLoggedIn = !!currentUserId;

  const initialSavedStatus = isLoggedIn
    ? await getSavedStatus(currentUserId, id)
    : false;

  /* 
    Docs: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#parallel-and-sequential-data-fetching
    Parallel data fetching
  */
  const [article] = await Promise.all([
    client.withConfig({ useCdn: false }).fetch(GET_ARTICLE_BY_ID_QUERY, { id }),
    // client.fetch(GET_PLAYLIST_BY_SLUG_QUERY, {
    //   slug: 'user-playlist',
    // }),
  ]);

  const parsedContent = md.render(article?.content || '');

  if (!article) return notFound();

  return (
    <>
      <section className="flex flex-col items-start mt-5 max-w-7xl mx-auto">
        <h1 className="heading-article">{article.title}</h1>
        <p className="px-6 sub-heading-article !max-w-5xl">{article.desc}</p>
        <div className="flex items-start gap-2 px-6 mt-1">
          <Timer className="pb-1 text-black-100/80" strokeWidth={3} />
          <p className="tag">{formatDate(article?._createdAt)}</p>
        </div>
      </section>

      <section className="section_container_article_page">
        <div className="space-y-5 mt-5 max-w-7xl mx-auto">
          <hr />
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

              <div className="mx-1">
                <p className="text-24-medium">{article.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{article.author.username}
                </p>
              </div>
            </Link>

            <div className="flex gap-3 items-center">
              <p className="category-tag"># {article.category}</p>
              <SaveButton
                onlyIcon={false}
                articleId={id}
                userId={currentUserId}
                initialSavedStatus={initialSavedStatus}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
          <hr className="mt-8" />
          <img
            src={article.image}
            alt="thumbnail"
            className="w-full h-auto rounded-xl mb-3"
          />

          <hr className="mt-8" />

          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr />

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
