import PromptSuggestionButton from './PromptSuggestionButton';

const PromptSuggestionsRows = ({ onPromptClick }) => {
  const prompts = [
    'Write a journey for me',
    'Give me a intersted story',
    'What is Ex*?',
  ];
  return (
    <div>
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
