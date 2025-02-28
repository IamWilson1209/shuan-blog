'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';
import { useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner'; // 可選：用於顯示提示

export const EditButton = ({
  id,
  deleteArticleAction,
  authorId,
}: {
  id: string;
  deleteArticleAction: (id: string) => Promise<any>;
  authorId: string | undefined;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsPending(true);
    try {
      const result = await deleteArticleAction(id);
      if (result.status === 'Success') {
        setIsOpen(false);
        router.push(`/users/${authorId}`);
        toast('Success!!', {
          description: 'Your article has been deleted successfully',
        });
      }
    } catch (error) {
      toast('Something went wrong!!', {
        description: 'Please check your inputs and try again',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Ellipsis />
      </PopoverTrigger>
      <PopoverContent className="w-60 bg-white shadow-md rounded-md p-4">
        <div className="grid gap-4">
          <Button className="bg-black text-white font-work-sans">
            <Link href={`/articles/edit/${id}`}>Edit</Link>
          </Button>
          <Button
            variant="destructive"
            className="bg-red-900 text-white font-work-sans"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
