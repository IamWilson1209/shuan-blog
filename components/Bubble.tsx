const Bubble = ({ message }) => {
  const { content, role } = message;
  return <div className={`${role} bubble`}>content {content}</div>;
};

export default Bubble;
