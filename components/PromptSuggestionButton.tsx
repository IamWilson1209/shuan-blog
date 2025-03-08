const PromptSuggestionButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 "
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
