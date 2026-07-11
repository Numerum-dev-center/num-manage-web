import { isAxiosError } from 'axios';

export function getErrorMessage(error: unknown, fallback = 'Une erreur est survenue'): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    const message = data?.message;
    if (Array.isArray(message)) return message[0] ?? fallback;
    if (typeof message === 'string') return message;
  }
  return fallback;
}
