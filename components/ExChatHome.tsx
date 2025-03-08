'use client';

import { useChat } from 'ai/react';
import { Message } from 'ai';
import Bubble from '../components/Bubble';
import LoadingBubble from '../components/LoadingBubble';
import PromptSuggestionsRow from '../components/PromptSuggestionsRow';

const ExChatHome = () => {
  const {
    append,
    isLoading,
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat();

  const noMessage = !messages || messages.length === 0;

  const handlePrompt = async (promptText) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: 'user',
    };
    append(msg);
  };

  return (
    <main>
      <section className="w-full max-w-2xl bg-white dark:bg-black-200 dark:text-white-100/80 rounded-lg shadow-lg p-6 space-y-4 flex flex-col">
        {noMessage ? (
          <>
            <p className="text-gray-600 text-center">
              No messages yet. Send your first message to start a conversation.
            </p>
            <PromptSuggestionsRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mt-8 flex flex-col md:flex-col space-y-2 md:space-y-2"
      >
        <input
          type="text"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something!!"
          className="flex-1 p-3 z-10 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Send
        </button>
      </form>
    </main>
  );
};

export default ExChatHome;
