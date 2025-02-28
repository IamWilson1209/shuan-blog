import { cn, formatDate } from '@/lib/utils';
import { Article, Author } from '@/sanity/types';
import { EyeIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { EditButton } from './EditButton';

export type ArticlePageType = Omit<Article, 'author'> & { author?: Author };

const ArticleCard = ({ article }: { article: ArticlePageType }) => {
  const { title, author, category, _id, image, desc, views, _createdAt } =
    article;

  return (
    <li className="relative article-page-card group">
      <div className="absolute top-5 right-5">
        <EditButton id={_id} />
      </div>
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/articles/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
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
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>

      <Link href={`/articles/${_id}`}>
        <p className="article-page-desc">{desc}</p>
        <img src={image} alt="placeholder" className="article-page-img" />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">Category : {category}</p>
        </Link>
        <Button className="article-page-btn" asChild>
          <Link href={`/articles/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export const ArticleCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn('skeleton', index)}>
        <Skeleton className="article-page-skeleton" />
      </li>
    ))}
  </>
);

export default ArticleCard;
