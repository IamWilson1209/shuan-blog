'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ellipsis, Pencil, CircleX } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SaveButton from '@/components/buttons/SaveButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/stores';

export const EditButton = ({
  id,
  authorId,
  deleteArticleAction,
}: {
  id: string;
  authorId: string | undefined;
  deleteArticleAction: (id: string) => Promise<any>;
}) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* 用Redux取得全局使用者登入狀態 */
  const { session, status } = useSelector((state: RootState) => state.auth);
  const sameAuthor = status === 'authenticated' && session?.id === authorId;

  /* 處裡刪除文章 */
  const handleDelete = async () => {
    setIsPending(true);
    try {
      const result = await deleteArticleAction(id);
      if (result.status === 'Success') {
        setIsOpen(false);
        /* 待優化 */
        router.push(`/users/${session.id}`);
        toast.success('Article has been deleted');
      }
    } catch (error) {
      toast.error('Article delete failed');
    } finally {
      setIsPending(false);
    }
  };

  /* 當 sameAuthor 為 true 時（使用者是作者），顯示編輯和刪除選項 */
  return sameAuthor ? (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Ellipsis />
      </PopoverTrigger>
      <PopoverContent className="w-50 bg-white dark:bg-black-100 shadow-md rounded-md">
        <div className="flex flex-row gap-1">
          <Button
            variant="nothing"
            className="text-black dark:text-white-100 font-work-sans"
          >
            <Link href={`/articles/edit/${id}`}>
              <Pencil />
            </Link>
          </Button>
          <Button
            variant="nothing"
            className="text-red-900 dark:text-red-500 font-work-sans"
            onClick={handleDelete}
            disabled={isPending}
          >
            <CircleX />
          </Button>
          <SaveButton articleId={id} onlyIcon={true} />
        </div>
      </PopoverContent>
    </Popover>
  ) : (
    /* 當 sameAuthor 為 false 時（使用者不是作者），只顯示儲存按鈕 */
    <SaveButton articleId={id} onlyIcon={true} />
  );
};
