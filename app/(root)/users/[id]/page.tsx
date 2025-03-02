import { auth } from '@/auth';
import { client } from '@/sanity/lib/client';
import {
  GET_ARTICLES_SAVE_STATUS_BY_USER_ID,
  GET_AUTHOR_BY_ID_QUERY,
} from '@/sanity/lib/queries';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import Image from 'next/image';
import { ArticleCardSkeleton } from '@/components/ArticleCard';
import UserArticles from '@/components/UserArticles';

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  const userId = session?.id;

  // 並行查詢使用者資料和當前使用者的儲存文章
  const [user, savedArticlesArray] = await Promise.all([
    client.fetch(GET_AUTHOR_BY_ID_QUERY, { id }),
    userId
      ? client.fetch(GET_ARTICLES_SAVE_STATUS_BY_USER_ID, { userId })
      : Promise.resolve({ savedArticles: [] }),
  ]);
  if (!user) return notFound();

  // 將 savedArticles 轉為 Set 以便快速查找
  const savedArticleIds = new Set(
    savedArticlesArray.savedArticles?.map(
      (ref: { _ref: string }) => ref._ref
    ) || []
  );
  return (
    <section className="profile_container">
      <div className="profile_card">
        <Image
          src={user.image}
          alt={user.name}
          width={400}
          height={400}
          className="profile_image"
        />

        <div className="flex flex-col items-center mt-5">
          <h3 className="text-24-black uppercase text-center line-clamp-1">
            {user.name}
          </h3>
        </div>

        <p className="text-30-extrabold text-center">@{user?.username}</p>
        <p className="text-20-medium text-center">{user?.email}</p>
        <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
      </div>

      <div className="flex-1 flex flex-col lg:-mt-5">
        <p className="text-30-bold pl-4">
          {session?.id === id ? 'Your' : 'All'} Articles
        </p>
        <hr className="my-4 border-black-100/20" />
        <ul className="card_grid-sm">
          <Suspense fallback={<ArticleCardSkeleton />}>
            <UserArticles
              id={id}
              userId={userId}
              savedArticleIds={savedArticleIds}
            />
          </Suspense>
        </ul>
      </div>
    </section>
  );
};

export default UserPage;
