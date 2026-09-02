import React, { JSX, useState, KeyboardEvent } from 'react';
import useSendChatMessage from '../network/useSendChatMessage';
import '../styles/Chatbot.css';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

function Chatbot(): JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'I am a RAG chatbot that accesses a vector database about Isaac. Ask me questions' },
  ]);
  const [input, setInput] = useState('');
  const hasUserMessage = messages.some((msg) => msg.role === 'user');
  const { mutate: sendMessage, isLoading } = useSendChatMessage();

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');

    sendMessage(trimmed, {
      onSuccess: (response) => {
        setMessages((prev) => [...prev, { role: 'bot', text: response }]);
      },
      onError: () => {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: 'Sorry, something went wrong. Please try again.' },
        ]);
      },
    });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chatbot">
      <div className={`chatbot-messages ${hasUserMessage ? 'chatbot-messages--expanded' : ''}`}>
        {messages.map((msg, i) => (
          <div key={i} className={`chatbot-bubble chatbot-bubble--${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="chatbot-bubble chatbot-bubble--bot chatbot-bubble--typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <div className="chatbot-input-row">
        <textarea
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about my background..."
          rows={1}
          disabled={isLoading}
        />
        <button
          className="chatbot-send-btn"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
