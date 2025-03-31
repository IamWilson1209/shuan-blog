import { formatDate } from '@/utils/utils';
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
import SaveButton from '@/components/buttons/SaveButton';
import { LikeButton } from '@/components/buttons/LikeButton';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const article = await client.fetch(GET_ARTICLE_BY_ID_QUERY, { id });

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${article?.title} | ${article?.author?.name}`,
    description: `${article?.desc} | ${article?._createdAt} | ${article?.category}`,
    openGraph: {
      images: [`${article?.image}`, ...previousImages],
    },
  };
}

const md = markdownit();

/* 啟用ppr機制 */
export const experimental_ppr = true;

const ArticlePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  /* 
    Docs: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#parallel-and-sequential-data-fetching
    平行資料獲取，效率較高
  */
  const [article] = await Promise.all([
    client.withConfig({ useCdn: false }).fetch(GET_ARTICLE_BY_ID_QUERY, { id }),
    // client.fetch(GET_PLAYLIST_BY_SLUG_QUERY, {
    //   slug: 'user-playlist',
    // }),
  ]);

  /* 解析markdown資料 */
  const parsedContent = md.render(article?.content || '');

  /* 如果沒有找到，導到notFound */
  if (!article) return notFound();

  return (
    <>
      <section className="flex flex-col items-start mt-5 max-w-4xl mx-auto">
        <h1 className="heading-article">{article?.title}</h1>
        <p className="px-6 sub-heading-article !max-w-5xl">{article?.desc}</p>
        <div className="flex items-start gap-2 px-6 mt-5">
          <Timer
            className="pb-1 text-black-100/80 dark:text-white-100"
            strokeWidth={3}
          />
          <p className="tag">{formatDate(article?._createdAt)}</p>
        </div>
      </section>

      <section className="section_container_article_page">
        <div className="space-y-5 mt-5 max-w-4xl mx-auto">
          <hr />
          <div className="flex-between gap-5">
            <Link
              href={`/users/${article?.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={article?.author?.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div className="mx-1">
                <p className="text-24-medium">{article?.author?.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{article?.author?.username}
                </p>
              </div>
            </Link>

            <div className="flex gap-1 items-center">
              <p className="category-tag"># {article?.category}</p>
              <div className="">
                <LikeButton articleId={id} initialLikes={article.likes} />
              </div>
              <SaveButton onlyIcon={false} articleId={id} />
            </div>
          </div>
          <hr className="mt-8" />
          <div className="flex items-center justify-center">
            <Image
              src={article?.image}
              alt="thumbnail"
              width={64}
              height={64}
              className="w-full md:w-10/12 lg:w-8/12 h-auto rounded-lg mb-3"
            />
          </div>

          <hr className="mt-8 " />

          {parsedContent ? (
            <article
              className="mx-auto prose dark:prose-invert max-w-4xl font-work-sans font-normal tracking-normal leading-snug whitespace-normal dark:text-white-100/70"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result dark:text-white-100/80">
              No details provided
            </p>
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

        <section>
          <p className="text-30-semibold"></p>
          <ul className="mt-7 card_grid-sm">
            {/* {relatedPosts.map((post: ArticlePageType, i: number) => (
            <ArticlePage key={i} article={article} />
          ))} */}
          </ul>
        </section>
        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <Views id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default ArticlePage;
