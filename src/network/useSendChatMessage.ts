import { useMutation } from '@tanstack/react-query';
import { ChatbotResponse } from '../types/chatbot';
import { API_URL } from '../types/constants';

interface ChatRequest {
  question: string;
  model: string;
}

function normalizeChatModels(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          const candidate = item as {
            name?: unknown;
            model?: unknown;
            value?: unknown;
            modelName?: unknown;
            model_name?: unknown;
          };
          const value = candidate.name ?? candidate.model ?? candidate.value ?? candidate.modelName ?? candidate.model_name;
          return typeof value === 'string' ? value : '';
        }
        return '';
      })
      .filter((item): item is string => Boolean(item));
  }

  if (raw && typeof raw === 'object') {
    const candidate = raw as {
      models?: unknown;
      availableModels?: unknown;
      available_models?: unknown;
      data?: unknown;
    };
    const nested = candidate.models ?? candidate.availableModels ?? candidate.available_models ?? candidate.data;
    return normalizeChatModels(nested);
  }

  return [];
}

export function validateChatModelsResponse(response: unknown): string[] {
  return normalizeChatModels(response);
}

export async function fetchAvailableChatModels(): Promise<string[]> {
  const res = await fetch(`${API_URL}/chat/models`);
  if (!res.ok) throw new Error(`Chat models API responded with ${res.status}`);

  const data: unknown = await res.json();
  return validateChatModelsResponse(data);
}

async function sendChatMessage(message: string, model: string): Promise<ChatbotResponse> {
  const requestBody: ChatRequest = { question: message, model };
  const res = await fetch(`${API_URL}/chat-with-citation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  if (!res.ok) throw new Error(`Chat API responded with ${res.status}`);
  const data: ChatbotResponse = await res.json();
  return data;
}

export default function useSendChatMessage() {
  return useMutation(({ message, model }: { message: string; model: string }) => sendChatMessage(message, model));
}
