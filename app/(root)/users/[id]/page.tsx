import { auth } from '@/auth';
import { client } from '@/sanity/lib/client';
import { GET_AUTHOR_BY_ID_QUERY } from '@/sanity/lib/queries';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import Image from 'next/image';
import UserArticles from '@/components/UserArticles';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Metadata, ResolvingMetadata } from 'next';
import { fetchUserPageDataAction } from '@/actions/server-actions';
import FadeInAnimation from '@/components/animations/FadeInAnimation';
import SlideInFromLeftAnimation from '@/components/animations/SlideInFromLeftAnimation ';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const user = await client
    .withConfig({ useCdn: false })
    .fetch(GET_AUTHOR_BY_ID_QUERY, { id });

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Ex* | ${user?.username} | ${user?.email}`,
    openGraph: {
      images: [`${user?.url}`, ...previousImages],
    },
  };
}

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  /* 使用 Server Action 獲取使用者頁面資料 */
  const data = await fetchUserPageDataAction();

  /* 沒查到，回傳 not found */
  if (!data) return notFound();

  /* 解構資料 */
  const { user, articles } = data;

  return (
    <section className="profile_container">
      <FadeInAnimation>
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
          <p className="mt-1 text-center text-14-normal dark:text-white-100/80">
            {user?.bio}
          </p>
        </div>
      </FadeInAnimation>

      <SlideInFromLeftAnimation>
        <div className="flex-1 flex flex-col lg:-mt-5">
          <p className="text-30-bold pl-4">
            {session?.id === id ? 'Your' : 'All'} Articles
          </p>
          <hr className="my-4 border-black-100/20" />
          <ul className="card_grid-sm">
            <Suspense fallback={<ArticleLoading />}>
              <UserArticles id={id} articles={articles} />
            </Suspense>
          </ul>
        </div>
      </SlideInFromLeftAnimation>
    </section>
  );
};

const ArticleLoading = () => {
  return (
    <div className="flex justify-center items-center">
      <LoadingSkeleton />
    </div>
  );
};

export default UserPage;
