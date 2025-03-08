import ExChatHome from './ExChatHome';
import { BotMessageSquare } from 'lucide-react';

export default function ExChatSideBar() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-black-200">
      <div className="flex flex-col items-center space-y-4 mb-8 mt-10">
        <BotMessageSquare className="text-amber-500" width={100} height={100} />
        <h1 className="font-bold text-5xl text-amber-700/80">GuAI</h1>
      </div>
      <div className="font-semibold p-5 dark:text-white-100/90 text-2xl text-center">
        Let ExBot help you write your article! Tell GuAI what you need!
      </div>

      <div className="flex-1 overflow-hidden">
        <ExChatHome />
      </div>
    </div>
  );
}
