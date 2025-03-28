'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { likeArticle } from '@/actions/server-actions';
import { sendGTMEvent } from '@next/third-parties/google';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/stores';
import { updateLikeStatus } from '@/app/redux/like-articles/slice';
import { signIn } from 'next-auth/react';

interface LikeButtonProps {
  articleId: string;
  initialLikes: number | undefined;
}

export const LikeButton = ({ articleId, initialLikes }: LikeButtonProps) => {
  const dispatch = useDispatch();

  /* Redux取得使用者的登入狀態 */
  const { session, status } = useSelector((state: RootState) => state.auth);
  const userId = session?.id;

  /* Redux提供文章是否被使用者喜歡的初始狀態 */
  const likedArticles = useSelector(
    (state: RootState) => state.likedArticles.likedArticles
  );
  const hasLiked = likedArticles[articleId] ?? false;

  /* client管理文章喜歡數量，防止一直去後端獲取資料 */
  const [likes, setLikes] = useState(initialLikes ?? 0);
  const [isPending, startTransition] = useTransition();

  /* 處裡點擊愛心事件 */
  const handleLike = () => {
    if (!userId) {
      toast(
        <p className="font-work-sans text-sm">
          Dear writer, you're not login yet
        </p>,
        {
          description: (
            <p className="font-work-sans">Please login to save your articles</p>
          ),
          action: {
            label: <p className="font-work-sans">Login</p>,
            onClick: () => {
              signIn('github');
            },
          },
        }
      );
      return;
    }
    /* 樂觀更新 */
    const newHasLiked = !hasLiked;
    setLikes(likes + (newHasLiked ? 1 : -1));

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
        toast.success(
          result.hasLiked ? (
            <p className="font-work-sans">Liked!</p>
          ) : (
            <p className="font-work-sans">Unliked!</p>
          )
        );

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
            ? 'fill-red-400 text-red-400 animate-pulse'
            : hasLiked
              ? 'fill-red-500 text-red-500'
              : 'text-gray-600'
        }`}
      />
      <span>{likes || 0}</span>
    </button>
  );
};
