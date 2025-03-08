// components/Sidebar.tsx
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="fixed left-4 top-4 z-50 md:hidden">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="flex h-full flex-col p-4">
          <h2 className="mb-4 text-lg font-semibold">Chat Room</h2>
          <div className="flex-1 rounded-lg border border-gray-200 p-4">
            {/* 聊天室框架 - 未來可在此添加聊天邏輯 */}
            <div className="h-full text-gray-500">
              Chat room content will go here
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// lib/icons.tsx (可選 - 如果你沒有 Menu Icon)
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);
