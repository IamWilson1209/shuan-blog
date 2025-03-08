'use client';

import Image from 'next/image';
import { useChat } from 'ai/react';
import { Message } from 'ai';
import Bubble from '../../../components/Bubble';
import LoadingBubble from '../../../components/LoadingBubble';
import PromptSuggestionsRow from '../../../components/PromptSuggestionsRow';

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
      <Image src={'/Ex.png'} alt={'ExChat'} width="250" height="250" />
      <section>
        <h1>ExChat</h1>
        {noMessage ? (
          <>
            <p>
              No messages yet. Send your first message to start a conversation.
            </p>
            <br />
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

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something!!"
        />
        <input type="submit" />
      </form>
    </main>
  );
};

export default ExChatHome;
