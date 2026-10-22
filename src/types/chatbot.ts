export interface ChatbotResponse {
  answer: string;
  citation?: string | string[];
}

export interface AvailableChatTool {
  name: string;
  description?: string;
}

export interface AvailableToolsResponse {
  tools: AvailableChatTool[];
}
