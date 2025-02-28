import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';

export const EditButton = ({ id }: { id: string }) => {
  return (
    <Popover>
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
          >
            <Link href={`/articles/edit/${id}`}>Delete</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
