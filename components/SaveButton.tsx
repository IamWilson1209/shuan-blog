'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { saveArticle } from '@/actions/server-actions';
import { toast } from 'sonner';
import { sendGTMEvent } from '@next/third-parties/google';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { RootState } from '@/app/redux/stores';
import { handleSaveArticle } from '@/app/redux/save-articles/slice';

type SaveButtonProps = {
  articleId: string;
  onlyIcon: boolean;
};

const SaveButton = ({ articleId, onlyIcon }: SaveButtonProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  /* 取得使用者的登入狀態 */
  const { data: session } = useSession();
  const userId = session?.id;

  /* Redux取得此篇文章的儲存狀態 */
  const savedArticles = useSelector(
    (state: RootState) => state.savedArticles.savedArticles
  );
  const isSaved = savedArticles[articleId] ?? false;

  /* handle 處裡過程 */
  const [isPending, startTransition] = useTransition();

  const handleToggleSave = async () => {
    if (!userId) {
      /* 待修正 */
      router.push('/login');
      return;
    }

    startTransition(async () => {
      try {
        /* 發送server action儲存文章 */
        const result = await saveArticle(articleId);

        /* 發送redux更新全局狀態 */
        dispatch(handleSaveArticle({ articleId, isSaved: result.isSaved }));

        /* toast出通知顯示給使用者 */
        toast.success(
          result.isSaved ? 'Article has been saved' : 'Article has beed unsaved'
        );

        /* 發送Google Analytics Event */
        sendGTMEvent({
          event: 'saveButtonClicked', // 事件名稱
          value: result.isSaved ? 'saved' : 'unSaved', // 根據儲存狀態傳送不同值
          articleId: articleId, // 傳送文章 ID
        });
      } catch (error) {
        console.error('Failed to toggle save:', error);
        toast.error('Failed to toggle save status');
      }
    });
  };

  return (
    <Button
      onClick={handleToggleSave}
      disabled={isPending}
      variant={onlyIcon ? 'nothing' : 'outline'}
      className={`flex gap-2 text-[15px] ${onlyIcon ? '' : 'w-30 h-12'}`}
    >
      {isSaved ? (
        <BookmarkIcon
          className="text-black dark:text-white-100/80"
          fill="currentColor"
          stroke="none"
        />
      ) : (
        <BookmarkIcon size={24} />
      )}
      {onlyIcon ? null : isSaved ? (
        <p className="pr-1">Saved</p>
      ) : (
        <p className="pr-1">Save</p>
      )}
    </Button>
  );
};

export default SaveButton;
