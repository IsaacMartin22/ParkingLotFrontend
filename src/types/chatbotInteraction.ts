export interface ChatbotInteractionResponse {
  question: string;
  response: string;
  timestamp: string;
}

export interface RecentChatbotInteractionsResponse {
  interactions: ChatbotInteractionResponse[];
}
