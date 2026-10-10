import React, { JSX, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useSendChatMessage, { fetchAvailableChatModels } from '../network/useSendChatMessage';
import { ISAAC_GITHUB } from '../types/constants';
import '../styles/Chatbot.css';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  citation?: string | string[];
}

function normalizeCitationValues(citation?: string | string[]): string[] {
  if (!citation) return [];

  if (Array.isArray(citation)) {
    return citation.flatMap((item) => normalizeCitationValues(item));
  }

  return citation
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getCitationUrl(citation: string): string | undefined {
  const normalized = citation.toLowerCase();

  if (normalized === 'resume') {
    return `${process.env.PUBLIC_URL}/resume.pdf`;
  }

  if (normalized === 'github') {
    return ISAAC_GITHUB;
  }

  if (/^https?:\/\//i.test(citation)) {
    return citation;
  }

  return undefined;
}

function Chatbot(): JSX.Element {
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'I am a RAG chatbot that accesses a vector database about Isaac. Ask me questions' },
  ]);
  const [input, setInput] = useState('');
  const [inputHistoryIndex, setInputHistoryIndex] = useState(-1);
  const [selectedModel, setSelectedModel] = useState('gpt-6.1-sol');
  const hasUserMessage = messages.some((msg) => msg.role === 'user');
  const userQuestionHistory = messages
    .filter((msg) => msg.role === 'user')
    .map((msg) => msg.text);
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
    setInputHistoryIndex(-1);

    sendMessage(
      { message: trimmed, model: selectedModel },
      {
        onSuccess: (response) => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'bot',
              text: response.answer,
              citation: response.citation,
            },
          ]);
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
    if (e.key === 'ArrowUp') {
      if (!userQuestionHistory.length) return;
      e.preventDefault();
      setInputHistoryIndex((prev) => {
        const nextIndex = prev < userQuestionHistory.length - 1 ? prev + 1 : prev;
        setInput(userQuestionHistory[userQuestionHistory.length - 1 - nextIndex] ?? '');
        return nextIndex;
      });
      return;
    }

    if (e.key === 'ArrowDown') {
      if (inputHistoryIndex === -1) return;
      e.preventDefault();
      setInputHistoryIndex((prev) => {
        const nextIndex = prev - 1;
        if (nextIndex < 0) {
          setInput('');
          return -1;
        }
        setInput(userQuestionHistory[userQuestionHistory.length - 1 - nextIndex] ?? '');
        return nextIndex;
      });
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chatbot">
      <div ref={messagesRef} className={`chatbot-messages ${hasUserMessage ? 'chatbot-messages--expanded' : ''}`}>
        {messages.map((msg, i) => {
          const citationLinks = normalizeCitationValues(msg.citation)
            .map((citation) => ({ citation, href: getCitationUrl(citation) }))
            .filter((entry): entry is { citation: string; href: string } => Boolean(entry.href));

          return (
            <div key={i} className={`chatbot-bubble chatbot-bubble--${msg.role}`}>
              <div>
                {msg.text}
                {msg.role === 'bot' && citationLinks.length > 0 && (
                  <>
                    {' '}
                    <span className="chatbot-citation-row">
                  {citationLinks.map((entry, index) => (
                    <a
                      key={`${entry.citation}-${index}`}
                      className="chatbot-citation"
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Citation ${index + 1}`}
                    >
                      [{index + 1}]
                    </a>
                  ))}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
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
