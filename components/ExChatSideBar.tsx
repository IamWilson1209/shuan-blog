import ExChatHome from './ExChatHome';
import { MessageCircleMore } from 'lucide-react';

export default function ExChatSideBar() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-black-200">
      <div className="flex flex-col items-center space-y-4 mb-8 mt-10">
        <MessageCircleMore
          className="text-amber-500"
          width={100}
          height={100}
        />
        <h1 className="font-bold text-5xl text-amber-600/80">ExChat</h1>
      </div>
      <div className="font-semibold p-5 dark:text-white-100/90 text-xl text-center">
        Let ExBot help you write your article! Tell ExBot what you need!
      </div>

      <div className="flex-1 overflow-hidden">
        <ExChatHome />
      </div>
    </div>
  );
}
