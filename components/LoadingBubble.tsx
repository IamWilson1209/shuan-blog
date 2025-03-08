import Image from 'next/image';

const LoadingBubble = () => {
  return (
    <div>
      <Image
        src={'/fade-stagger-squares.svg'}
        alt="Loading"
        width={60}
        height={60}
      />
    </div>
  );
};

export default LoadingBubble;
