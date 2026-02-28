import { useCallback, useRef } from 'react';
import { SYSTEM_MESSAGE } from '@/data/chatPrompt';

const PROXY_URL = import.meta.env.VITE_PROXY_URL;

/**
 * Hook for sending messages to the chat proxy and streaming SSE responses.
 * Dispatches reducer actions for token streaming, completion, and errors.
 *
 * @param {Function} dispatch - useReducer dispatch from ChatContext
 * @returns {{ sendMessage: Function, abort: Function }}
 */
export function useChatApi(dispatch) {
  const abortRef = useRef(null);

  const sendMessage = useCallback(
    async (messages) => {
      // Abort any in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const botMessageId = crypto.randomUUID();
      dispatch({ type: 'START_BOT_MESSAGE', id: botMessageId });

      try {
        const response = await fetch(PROXY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              SYSTEM_MESSAGE,
              ...messages.map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop(); // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;

            const data = trimmed.slice(6);
            if (data === '[DONE]') {
              dispatch({ type: 'STREAM_COMPLETE' });
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                dispatch({
                  type: 'APPEND_TOKEN',
                  id: botMessageId,
                  token,
                });
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }

        // Stream ended without [DONE] — still complete
        dispatch({ type: 'STREAM_COMPLETE' });
      } catch (err) {
        if (err.name !== 'AbortError') {
          dispatch({
            type: 'SET_ERROR',
            payload: 'Oops, something went wrong. Please try again.',
          });
        }
      }
    },
    [dispatch]
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { sendMessage, abort };
}
