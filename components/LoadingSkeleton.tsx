import Image from 'next/image';
const LoadingSkeleton = () => {
  return (
    <>
      <Image
        src="/fade-stagger-circles.svg" // Light Mode 圖片
        alt="Loading"
        width={120}
        height={120}
        className="block dark:hidden" // Light Mode 可見，Dark Mode 隱藏
      />
      <Image
        src="/fade-stagger-squares.svg" // Dark Mode 圖片
        alt="Loading"
        width={120}
        height={120}
        className="hidden dark:block" // Dark Mode 可見，Light Mode 隱藏
      />
    </>
  );
};

export default LoadingSkeleton;
