'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { likeArticle } from '@/actions/server-actions';
import { sendGTMEvent } from '@next/third-parties/google';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/stores';
import { updateLikeStatus } from '@/app/redux/like-articles/slice';

interface LikeButtonProps {
  articleId: string;
  initialLikes: number | undefined;
}

export const LikeButton = ({ articleId, initialLikes }: LikeButtonProps) => {
  const dispatch = useDispatch();
  const likedArticles = useSelector(
    (state: RootState) => state.likedArticles.likedArticles
  );
  const hasLiked = likedArticles[articleId] ?? false; // Redux 提供初始值
  const [likes, setLikes] = useState(initialLikes ?? 0); // 本地管理 likes
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    const newHasLiked = !hasLiked;
    setLikes(likes + (newHasLiked ? 1 : -1)); // 本地更新 likes

    startTransition(async () => {
      /* 發送server action改變喜愛數的數字、儲存狀態 */
      const result = await likeArticle(articleId);

      /* 如果後端執行成功 */
      if (result.status === 'Success') {
        /* 更新全局管理的使用者儲存文章狀態 */
        dispatch(
          updateLikeStatus({
            articleId,
            hasLiked: result.hasLiked,
          })
        );
        /* toast 出消息給使用者知道 */
        toast.success(result.hasLiked ? 'Liked!' : 'Unliked!');

        /* 像Google Analytics發送 GTM 事件 */
        sendGTMEvent({
          event: 'likeButtonClicked', // 自訂事件名稱
          value: result.hasLiked ? 'like' : 'unlike', // 根據按讚狀態傳送不同值
          articleId: articleId, // 傳送文章 ID
        });
      } else {
        /* 失敗回滾本地狀態 */
        setLikes(initialLikes ?? 0);
        toast.error(result.error || 'Failed to toggle like');
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className="flex items-center gap-1 font-medium text-gray-600 hover:text-red-500 transition-colors"
    >
      <Heart
        className={`size-5 hover:fill-red-500 hover:text-red-500 transition-colors ${
          isPending
            ? 'fill-red-400 text-red-400 animate-pulse' // 更新中顯示灰色並閃爍
            : hasLiked
              ? 'fill-red-500 text-red-500'
              : 'text-gray-600'
        }`}
      />
      <span>{likes || 0}</span>
    </button>
  );
};
