import PromptSuggestionButton from './PromptSuggestionButton';

const PromptSuggestionsRows = ({ onPromptClick }) => {
  const prompts = [
    'Write a journey for me',
    'Give me a intersted story',
    'Introduce Ex* to me',
  ];
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-3 p-4">
      {prompts.map((promptText, index) => (
        <PromptSuggestionButton
          key={`suggestion-${index}`}
          text={promptText}
          onClick={() => onPromptClick(promptText)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionsRows;
