const Bubble = ({ message }) => {
  const { content, role } = message;

  const bubbleStyle =
    role === 'user'
      ? 'bg-amber-500 dark:bg-amber-600/90 text-white self-end'
      : 'bg-black-100/80 dark:bg-black-100/80 text-white-100/80 self-start';

  return (
    <div
      className={`${bubbleStyle} max-w-[80%] rounded-lg p-4 mb-2 break-words`}
    >
      content {content}
    </div>
  );
};

export default Bubble;
