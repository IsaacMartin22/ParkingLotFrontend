import {
  validateChatbotInteractionResponse,
  validateRecentChatbotInteractionsResponse,
} from '../network/useRecentChatbotInteractions';

describe('recent chatbot interaction validation', () => {
  it('retains valid chat interaction metrics returned by the API', () => {
    expect(validateChatbotInteractionResponse({
      question: 'Where is my car?',
      response: 'Your car is in space A12.',
      timestamp: '2026-09-06T12:00:00Z',
      cacheHit: true,
      embeddingLatencyMs: 12.5,
      vectorSearchDurationMs: 24.75,
      vectorSearchDocumentCount: 3,
      rating: 5,
    })).toEqual({
      question: 'Where is my car?',
      response: 'Your car is in space A12.',
      timestamp: '2026-09-06T12:00:00Z',
      cacheHit: true,
      embeddingLatencyMs: 12.5,
      vectorSearchDurationMs: 24.75,
      vectorSearchDocumentCount: 3,
      rating: 5,
    });
  });

  it('omits null, missing, and malformed optional metrics from historic records', () => {
    expect(validateRecentChatbotInteractionsResponse({
      interactions: [{
        question: 'How full is the lot?',
        response: 'There are 10 spaces available.',
        timestamp: '2026-09-06T12:00:00Z',
        cacheHit: null,
        embeddingLatencyMs: null,
        vectorSearchDurationMs: '15',
        vectorSearchDocumentCount: -1,
        rating: Number.NaN,
      }],
    }).interactions[0]).toEqual({
      question: 'How full is the lot?',
      response: 'There are 10 spaces available.',
      timestamp: '2026-09-06T12:00:00Z',
      cacheHit: undefined,
      embeddingLatencyMs: undefined,
      vectorSearchDurationMs: undefined,
      vectorSearchDocumentCount: undefined,
      rating: undefined,
    });
  });
});
