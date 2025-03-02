import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-800">
      <h1 className="font-bold ml-4 text-[40px]">Loading...</h1>

      <Image
        src={'/fade-stagger-circles.svg'}
        alt="Loading"
        width={150}
        height={150}
        className="block dark:hidden" // Light Mode 可見，Dark Mode 隱藏
      />
      <Image
        src="/fade-stagger-squares.svg" // Dark Mode 圖片
        alt="Loading"
        width={150}
        height={150}
        className="hidden dark:block" // Dark Mode 可見，Light Mode 隱藏
      />
    </div>
  );
}
