import React, { JSX, useState, useRef, useEffect, KeyboardEvent } from 'react';
import useSendChatMessage from '../network/useSendChatMessage';
import '../styles/Chatbot.css';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

function Chatbot(): JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Hi! Ask me anything about this project.' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { mutate: sendMessage, isLoading } = useSendChatMessage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
      <div className="chatbot-header">
        <span className="chatbot-title">Chat</span>
      </div>

      <div className="chatbot-messages">
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
        <div ref={bottomRef} />
      </div>

      <div className="chatbot-input-row">
        <textarea
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          disabled={isLoading}
        />
        <button
          className="chatbot-send-btn"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
