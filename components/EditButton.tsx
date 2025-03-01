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
import SaveButton from '@/components/SaveButton';

export const EditButton = ({
  id,
  authorId,
  deleteArticleAction,
  userId,
  initialSavedStatus,
}: {
  id: string;
  authorId: string | undefined;
  deleteArticleAction: (id: string) => Promise<any>;
  userId: string | undefined;
  initialSavedStatus: boolean;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const isLoggedIn = !!userId;
  const sameAuthor = userId === authorId;

  const handleDelete = async () => {
    setIsPending(true);
    try {
      const result = await deleteArticleAction(id);
      if (result.status === 'Success') {
        setIsOpen(false);
        router.push(`/users/${userId}`);
        toast.success('Article has been created');
      }
    } catch (error) {
      toast.error('Event has not been created');
    } finally {
      setIsPending(false);
    }
  };

  return sameAuthor ? (
    // 當 sameAuthor 為 true 時（使用者是作者），顯示編輯和刪除選項
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Ellipsis />
      </PopoverTrigger>
      <PopoverContent className="w-50 bg-white shadow-md rounded-md">
        <div className="flex flex-row gap-1">
          <Button variant="nothing" className="text-black font-work-sans">
            <Link href={`/articles/edit/${id}`}>
              <Pencil />
            </Link>
          </Button>
          <Button
            variant="nothing"
            className="text-red-900 font-work-sans"
            onClick={handleDelete}
            disabled={isPending}
          >
            <CircleX />
          </Button>
          <SaveButton
            articleId={id}
            userId={userId}
            initialSavedStatus={initialSavedStatus}
            isLoggedIn={isLoggedIn}
            onlyIcon={true}
          />
        </div>
      </PopoverContent>
    </Popover>
  ) : (
    // 當 sameAuthor 為 false 時（使用者不是作者），只顯示儲存按鈕
    <SaveButton
      articleId={id}
      userId={userId}
      initialSavedStatus={initialSavedStatus}
      isLoggedIn={isLoggedIn}
      onlyIcon={true}
    />
  );
};
