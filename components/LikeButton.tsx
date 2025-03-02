'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { toggleLikeAction } from '@/actions/server-actions';

interface LikeButtonProps {
  articleId: string;
  initialLikes: number | undefined;
  initialHasLiked: boolean | undefined;
}

export const LikeButton = ({
  articleId,
  initialLikes,
  initialHasLiked,
}: LikeButtonProps) => {
  /* 用本地 useState 更新 UI，減少伺服器請求 */
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(async () => {
      const result = await toggleLikeAction(articleId);
      if (result.status === 'Success') {
        setLikes(result.likes);
        setHasLiked(result.hasLiked);
        toast.success(result.hasLiked ? 'Liked!' : 'Unliked!');
      } else {
        toast.error(result.error || 'Failed to toggle like');
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
    >
      <Heart
        className={`size-5 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`}
      />
      <span>{likes || 0}</span>
    </button>
  );
};
