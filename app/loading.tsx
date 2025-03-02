import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="font-bold ml-4 text-[40px]">Loading...</h1>

      <Image
        src={'/fade-stagger-circles.svg'}
        alt="Loading"
        width={150}
        height={150}
      />
    </div>
  );
}
