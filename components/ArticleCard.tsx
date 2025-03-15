'use client';

import { formatDate } from '@/utils/utils';
import { Article, Author } from '@/sanity/types';
import { EyeIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { EditButton } from './EditButton';
import { deleteArticleAction } from '@/actions/server-actions';
import { LikeButton } from './LikeButton';

export type ArticlePageType = Omit<Article, 'author'> & {
  author?: Author;
  likes?: number;
  likedBy?: string[];
};

const ArticleCard = ({
  article,
  userId,
  initialSavedStatus,
}: {
  article: ArticlePageType;
  userId?: string;
  initialSavedStatus: boolean;
}) => {
  const {
    title,
    author,
    category,
    _id,
    image,
    desc,
    views,
    _createdAt,
    likes,
    likedBy,
  } = article;

  // O(1)
  const initialHasLiked = userId ? likedBy?.includes(userId) : false;

  return (
    <li className="relative article-page-card group">
      <div className="absolute top-2 right-5">
        <EditButton
          id={_id}
          authorId={author?._id}
          deleteArticleAction={deleteArticleAction}
          userId={userId}
          initialSavedStatus={initialSavedStatus}
        />
      </div>
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/articles/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1 dark:text-white-100/80 dark:hover:hover:underline dark:hover:text-blue-600/80 hover:underline hover:text-blue-600/80">
              {title}
            </h3>
          </Link>
          <Link href={`/users/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">
              Author : {author?.name}
            </p>
          </Link>
        </div>
        <Link href={`/users/${author?._id}`}>
          <Image
            src={author?.image!}
            alt={author?.name!}
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>
      <div className="flex-between mt-5">
        <p className="article-page-date">{formatDate(_createdAt)}</p>
        <div className="flex-between gap-1.5">
          <div className="flex gap-1.5">
            <EyeIcon className="size-6 text-gray-600" />
            <span className="font-medium text-gray-600">{views}</span>
          </div>
          <LikeButton
            articleId={_id}
            initialLikes={likes}
            initialHasLiked={initialHasLiked}
          />
        </div>
      </div>
      <Link href={`/articles/${_id}`}>
        <p className="article-page-desc">{desc}</p>
        <img src={image} alt="placeholder" className="article-page-img" />
      </Link>
      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium"># {category}</p>
        </Link>
        <Button className="article-page-btn" asChild>
          <Link href={`/articles/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default ArticleCard;
