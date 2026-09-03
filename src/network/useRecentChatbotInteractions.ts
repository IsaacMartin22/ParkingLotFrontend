import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../types/constants';
import {
  ChatbotInteractionResponse,
  RecentChatbotInteractionsResponse
} from '../types/chatbotInteraction';
import usePostAnalyticsRequest from './usePostAnalyticsRequest';
import { buildNetworkSuccessAnalyticsRequest } from './analyticsNetwork';

function validateChatbotInteractionResponse(interaction: unknown): ChatbotInteractionResponse {
  if (!interaction || typeof interaction !== 'object') {
    throw new Error(`Invalid chatbot interaction: ${JSON.stringify(interaction)}`);
  }

  const parsed = interaction as Partial<ChatbotInteractionResponse>;

  return {
    question: typeof parsed.question === 'string' ? parsed.question : '',
    response: typeof parsed.response === 'string' ? parsed.response : '',
    timestamp: typeof parsed.timestamp === 'string' ? parsed.timestamp : '',
  };
}

function validateRecentChatbotInteractionsResponse(response: unknown): RecentChatbotInteractionsResponse {
  if (!response || typeof response !== 'object') {
    throw new Error(`Invalid recent chatbot interactions response: ${JSON.stringify(response)}`);
  }

  const parsed = response as Partial<RecentChatbotInteractionsResponse>;
  const interactions = Array.isArray(parsed.interactions) ? parsed.interactions : [];

  return {
    interactions: interactions.map(validateChatbotInteractionResponse),
  };
}

async function fetchRecentChatbotInteractions(): Promise<RecentChatbotInteractionsResponse> {
  const res = await fetch(`${API_URL}/recent-interactions`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);

  const data: unknown = await res.json();
  return validateRecentChatbotInteractionsResponse(data);
}

export default function useRecentChatbotInteractions() {
  const { mutate: postAnalyticsRequest } = usePostAnalyticsRequest();
  const requestName = 'recentChatbotInteractions';

  async function fetchRecentChatbotInteractionsWithAnalytics(): Promise<RecentChatbotInteractionsResponse> {
    const startedAt = Date.now();
    const result = await fetchRecentChatbotInteractions();
    postAnalyticsRequest(buildNetworkSuccessAnalyticsRequest(Date.now() - startedAt, requestName));
    return result;
  }

  return useQuery([requestName], fetchRecentChatbotInteractionsWithAnalytics, {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
