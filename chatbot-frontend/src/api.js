// src/api.js
import axios from 'axios';

// Defaults to port 5000 on whatever host served this page, so the app also
// works when opened from another machine on the LAN. Override with VITE_API_URL.
export const API_URL =
  import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

export const API_HOST = (() => {
  try {
    return new URL(API_URL).host;
  } catch {
    return API_URL;
  }
})();

const client = axios.create({ baseURL: API_URL, timeout: 30000 });

// `kind` tells the UI which hop of the path failed:
//   offline  - the Flask backend could not be reached at all
//   degraded - Flask answered, but the TCP socket server failed
//   timeout  - no reply within the timeout
export class ChatError extends Error {
  constructor(message, kind) {
    super(message);
    this.kind = kind;
  }
}

export async function askQuestion(question) {
  const started = performance.now();
  let data;
  try {
    ({ data } = await client.post('/ask', { question }));
  } catch (error) {
    throw toChatError(error);
  }
  if (typeof data?.answer !== 'string' || data.answer === '') {
    throw new ChatError('The socket server closed the connection without replying.', 'degraded');
  }
  return { answer: data.answer, latency: Math.round(performance.now() - started) };
}

function toChatError(error) {
  if (error.code === 'ECONNABORTED') {
    return new ChatError('No reply within 30 seconds. The socket server may be slow or unreachable.', 'timeout');
  }
  if (error.response) {
    const detail = error.response.data?.error ?? `HTTP ${error.response.status}`;
    return new ChatError(`Backend error: ${detail}`, 'degraded');
  }
  return new ChatError(`Could not reach the backend at ${API_HOST}. Is the Flask server running?`, 'offline');
}
