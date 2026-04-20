import axios from 'axios';

interface ApiErrorPayload {
  message?: string;
  error?: string;
}

const isGenericAxiosStatusMessage = (message: string): boolean => /^Request failed with status code \d{3}$/.test(message.trim());

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;

    if (typeof payload?.message === 'string' && payload.message.trim()) {
      return payload.message;
    }

    if (typeof payload?.error === 'string' && payload.error.trim()) {
      return payload.error;
    }

    if (typeof error.message === 'string' && error.message.trim() && !isGenericAxiosStatusMessage(error.message)) {
      return error.message;
    }

    return fallback;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};
