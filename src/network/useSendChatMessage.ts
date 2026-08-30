import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../types/constants';

interface ChatRequest {
  question: string;
}

interface ChatResponse {
  answer: string;
}

async function sendChatMessage(message: string): Promise<string> {
  const requestBody: ChatRequest = { question: message };
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  if (!res.ok) throw new Error(`Chat API responded with ${res.status}`);
  const data: ChatResponse = await res.json();
  return data.answer;
}

export default function useSendChatMessage() {
  return useMutation((message: string) => sendChatMessage(message));
}
