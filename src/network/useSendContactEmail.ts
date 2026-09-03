import { useMutation } from '@tanstack/react-query';
import { API_URL, ISAAC_EMAIL } from '../types/constants';

interface ContactRequest {
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message?: string;
}

async function parseContactResponse(response: Response): Promise<ContactResponse> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return { success: response.ok };
  }

  const rawBody = await response.text();
  if (!rawBody.trim()) {
    return { success: response.ok };
  }

  const parsed: unknown = JSON.parse(rawBody);
  if (typeof parsed === 'object' && parsed !== null) {
    const maybeSuccess = 'success' in parsed ? (parsed as { success?: unknown }).success : undefined;
    const maybeMessage = 'message' in parsed ? (parsed as { message?: unknown }).message : undefined;
    return {
      success: typeof maybeSuccess === 'boolean' ? maybeSuccess : response.ok,
      message: typeof maybeMessage === 'string' ? maybeMessage : undefined,
    };
  }

  return { success: response.ok };
}

async function sendContactEmail(message: string): Promise<string> {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    throw new Error('Please enter a message before sending.');
  }

  const payload: ContactRequest = {
    subject: 'Portfolio Contact',
    message: trimmedMessage,
  };

  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Contact API responded with ${response.status}`);
    }

    const data = await parseContactResponse(response);

    if (!data.success) {
      throw new Error(data.message ?? 'Unable to send your message right now.');
    }

    return data.message ?? 'Thanks! Your message was sent.';
  } catch (error) {
    const fallbackAddress = ISAAC_EMAIL.replace(/^mailto:/i, '');
    const fallbackUrl = `mailto:${fallbackAddress}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(trimmedMessage)}`;

    window.location.href = fallbackUrl;

    if (error instanceof Error) {
      throw new Error(`${error.message} Your email client was opened instead.`);
    }

    throw new Error('Unable to send your message right now. Your email client was opened instead.');
  }
}

export default function useSendContactEmail() {
  return useMutation((message: string) => sendContactEmail(message));
}
