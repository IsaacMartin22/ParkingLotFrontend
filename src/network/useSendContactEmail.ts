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

    const data: ContactResponse = await response.json();

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
