import axios from 'axios';

export const getErrorMessage = (err: unknown, fallback = 'Ocorreu um erro. Tente novamente.'): string => {
  if (!axios.isAxiosError(err)) return fallback;
  const data = err.response?.data;
  if (typeof data === 'string' && data) return data;
  if (data?.mensagem) return data.mensagem;
  if (data?.errors) {
    const first = Object.values(data.errors as Record<string, string[]>)[0];
    if (first?.[0]) return first[0];
  }
  if (data?.title) return data.title;
  return fallback;
};
