import { useEffect, useRef } from 'react';
import usePostAnalyticsRequest from './usePostAnalyticsRequest';
import { buildErrorAnalyticsRequest } from './analyticsError';

function normalizeErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallbackMessage;
}

export default function useAnalyticsErrorReporter(error: unknown, fallbackMessage: string): void {
  const { mutate } = usePostAnalyticsRequest();
  const lastReportedMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!error) {
      return;
    }

    const errorMessage = normalizeErrorMessage(error, fallbackMessage);

    if (lastReportedMessageRef.current === errorMessage) {
      return;
    }

    lastReportedMessageRef.current = errorMessage;
    mutate(buildErrorAnalyticsRequest(errorMessage));
  }, [error, fallbackMessage, mutate]);
}
