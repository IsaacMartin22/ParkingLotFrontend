export interface ChatbotInteractionResponse {
  question: string;
  response: string;
  timestamp: string;
  cacheHit?: boolean;
  embeddingLatencyMs?: number;
  vectorSearchDurationMs?: number;
  vectorSearchDocumentCount?: number;
  rating?: number;
}

export interface RecentChatbotInteractionsResponse {
  interactions: ChatbotInteractionResponse[];
}
