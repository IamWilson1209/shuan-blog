'use client';

import { useTransition } from 'react';
import { BookmarkIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { saveArticle } from '@/actions/server-actions';
import { toast } from 'sonner';
import { sendGTMEvent } from '@next/third-parties/google';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/stores';
import { handleSaveArticle } from '@/app/redux/save-articles/slice';
import { signIn } from 'next-auth/react';

type SaveButtonProps = {
  articleId: string;
  onlyIcon: boolean;
};

const SaveButton = ({ articleId, onlyIcon }: SaveButtonProps) => {
  const dispatch = useDispatch();

  /* Redux取得使用者的登入狀態 */
  const { session, status } = useSelector((state: RootState) => state.auth);
  const userId = session?.id;

  /* Redux取得此篇文章的儲存狀態 */
  const savedArticles = useSelector(
    (state: RootState) => state.savedArticles.savedArticles
  );
  const isSaved = savedArticles[articleId] ?? false;

  /* handle 處裡過程 */
  const [isPending, startTransition] = useTransition();

  /* 處裡點擊儲存事件 */
  const handleSave = async () => {
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

    startTransition(async () => {
      try {
        /* 發送server action儲存文章 */
        const result = await saveArticle(articleId);

        /* 發送redux更新全局狀態 */
        dispatch(handleSaveArticle({ articleId, isSaved: result.isSaved }));

        /* toast出通知顯示給使用者 */
        toast.success(
          result.isSaved ? (
            <p className="font-work-sans">Article has been saved!</p>
          ) : (
            <p className="font-work-sans">Unsaved article!</p>
          )
        );

        /* 發送Google Analytics Event */
        sendGTMEvent({
          event: 'saveButtonClicked', // 事件名稱
          value: result.isSaved ? 'saved' : 'unSaved',
          articleId: articleId,
        });
      } catch (error) {
        console.error('Failed to toggle save:', error);
        toast.error('Failed to toggle save status');
      }
    });
  };

  return (
    <Button
      onClick={handleSave}
      disabled={isPending}
      variant={onlyIcon ? 'nothing' : 'outline'}
      className={`flex gap-2 text-[15px] hover:text-gray-300 ${onlyIcon ? '' : 'w-30 h-12'}`}
    >
      <BookmarkIcon
        size={24}
        className={`transition-colors ${
          isPending
            ? 'text-gray-400 animate-pulse'
            : isSaved
              ? 'text-black dark:text-white-100/80 fill-current stroke-none'
              : 'text-gray-600'
        }`}
      />
      {onlyIcon ? null : isSaved ? (
        <p className="pr-1">Saved</p>
      ) : (
        <p className="pr-1">Save</p>
      )}
    </Button>
  );
};

export default SaveButton;
