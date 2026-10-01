import React, { JSX, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useSendChatMessage, { fetchAvailableChatModels } from '../network/useSendChatMessage';
import '../styles/Chatbot.css';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

function Chatbot(): JSX.Element {
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'I am a RAG chatbot that accesses a vector database about Isaac. Ask me questions' },
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-6.1-sol');
  const hasUserMessage = messages.some((msg) => msg.role === 'user');
  const { mutate: sendMessage, isLoading } = useSendChatMessage();
  const { data: availableModels = [] } = useQuery(['chatModels'], fetchAvailableChatModels, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const modelOptions = availableModels.length > 0 ? availableModels : ['gpt-6.1-sol'];

  useEffect(() => {
    if (availableModels.length && !availableModels.includes(selectedModel)) {
      setSelectedModel(availableModels[0]);
    }
  }, [availableModels, selectedModel]);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !selectedModel) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');

    sendMessage(
      { message: trimmed, model: selectedModel },
      {
        onSuccess: (response) => {
          setMessages((prev) => [...prev, { role: 'bot', text: response }]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            { role: 'bot', text: 'Sorry, something went wrong. Please try again.' },
          ]);
        },
      },
    );
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chatbot">
      <div ref={messagesRef} className={`chatbot-messages ${hasUserMessage ? 'chatbot-messages--expanded' : ''}`}>
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

      <div className="chatbot-composer">
        <div className="chatbot-input-row">
          <textarea
            className="chatbot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about my background..."
            rows={1}
            disabled={isLoading || !selectedModel}
          />

          <label className="chatbot-model-label" htmlFor="chatbot-model-select">
            <span className="chatbot-model-label-text">Model</span>
            <select
              id="chatbot-model-select"
              className="chatbot-model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </label>

          <button
            className="chatbot-send-btn"
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !selectedModel}
            aria-label="Send message"
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
